"use client";

import type { LoopBlock, RoutineBlock } from "@/types/routine";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useDroppable,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BlockItem } from "./BlockItem";
import { useRoutineEditor } from "./RoutineEditorContext";

const DROP_LOOP_PREFIX = "drop-loop-";

function NestedBlockList({ loop }: { loop: LoopBlock }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${DROP_LOOP_PREFIX}${loop.id}`,
  });
  const children = loop.children ?? [];

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "p-3 space-y-3 min-h-[60px] rounded-lg border border-dashed transition-colors",
        isOver ? "border-primary/60 bg-primary/10" : "border-white/10 bg-white/[0.02]"
      )}
    >
      <SortableContext
        items={children.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        {children.map((block) => (
          <BlockItem key={block.id} block={block} parentId={loop.id} />
        ))}
        {children.length === 0 && (
          <div className="text-center py-4 text-gray-300 text-xs">
            여기로 드래그하여 세트에 추가
          </div>
        )}
      </SortableContext>
    </div>
  );
}

function cn(...args: (string | boolean | undefined)[]) {
  return args.filter(Boolean).join(" ");
}

function RootDropZone({ children, isEmpty }: { children: React.ReactNode; isEmpty: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: "drop-root",
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "space-y-3 pb-40 h-full min-h-[50vh] transition-colors rounded-xl flex flex-col",
        isOver && "bg-white/[0.02]"
      )}
    >
      {children}

      {/* Invisible drop target that always exists at the bottom */}
      <div
        className={cn(
          "flex-1 min-h-[100px] border-2 border-dashed rounded-xl transition-all duration-300 flex items-center justify-center",
          isOver ? "border-primary/50 bg-primary/5 opacity-100" : "border-transparent opacity-0"
        )}
      >
        <div className="text-center transition-opacity text-primary">
          <p className="font-bold">여기로 드롭하여 세트에서 빼기</p>
        </div>
      </div>

      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center p-8 text-gray-400 border-2 border-dashed border-white/10 rounded-xl bg-[#0d1414]/80 backdrop-blur-sm">
            <p>루틴이 비어있습니다.</p>
            <p className="text-sm mt-1">아래 버튼을 눌러 운동을 추가하세요.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function BlockListRoot() {
  const { state, dispatch } = useRoutineEditor();
  const { blocks } = state;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const fromParentId = active.data.current?.parentId as string | undefined;

    if (overId.startsWith(DROP_LOOP_PREFIX)) {
      const toParentId = overId.slice(DROP_LOOP_PREFIX.length);
      const toLoop = state.blocks.find((b) => b.type === "loop" && b.id === toParentId) as LoopBlock | undefined;
      const toIndex = toLoop?.children?.length ?? 0;
      dispatch({
        type: "MOVE_BLOCK_TO_CONTAINER",
        payload: { blockId: activeId, fromParentId, toParentId, toIndex },
      });
      return;
    }

    if (overId === "drop-root") {
      dispatch({
        type: "MOVE_BLOCK_TO_CONTAINER",
        payload: { blockId: activeId, fromParentId, toParentId: undefined, toIndex: state.blocks.length },
      });
      return;
    }

    const fromInfo = findBlockById(state.blocks, activeId, undefined);
    const overInfo = findBlockById(state.blocks, overId, undefined);
    if (!fromInfo || !overInfo) return;

    if (fromInfo.parentId !== overInfo.parentId) {
      const isOverLoop = overInfo.block.type === "loop";

      if (!isOverLoop) {
        dispatch({
          type: "MOVE_BLOCK_TO_CONTAINER",
          payload: {
            blockId: activeId,
            fromParentId: fromInfo.parentId,
            toParentId: overInfo.parentId,
            toIndex: overInfo.index,
          },
        });
      }
      return;
    }

    const list =
      fromInfo.parentId == null
        ? state.blocks
        : (state.blocks.find((b) => b.type === "loop" && b.id === fromInfo.parentId) as LoopBlock | undefined)
            ?.children ?? [];
    const reordered = arrayMove([...list], fromInfo.index, overInfo.index);
    if (fromInfo.parentId == null) {
      dispatch({ type: "SET_BLOCKS", payload: { blocks: reordered } });
    } else {
      dispatch({
        type: "UPDATE_BLOCK",
        payload: { id: fromInfo.parentId, updates: { children: reordered } },
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={blocks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <RootDropZone isEmpty={blocks.length === 0}>
          {blocks.map((block) =>
            block.type === "loop" ? (
              <BlockItem key={block.id} block={block}>
                <NestedBlockList loop={block} />
              </BlockItem>
            ) : (
              <BlockItem key={block.id} block={block} />
            )
          )}
        </RootDropZone>
      </SortableContext>
    </DndContext>
  );
}

function findBlockById(
  blocks: RoutineBlock[],
  id: string,
  parentId?: string
): { block: RoutineBlock; parentId: string | undefined; index: number } | null {
  const idx = blocks.findIndex((b) => b.id === id);
  if (idx !== -1) return { block: blocks[idx], parentId, index: idx };
  for (const b of blocks) {
    if (b.type === "loop" && b.children?.length) {
      const found = findBlockById(b.children, id, b.id);
      if (found) return found;
    }
  }
  return null;
}
