"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RoutineBlock } from "@/types/routine";
import { cn } from "@/lib/utils";
import { X, Repeat, GripVertical } from "lucide-react";
import { formatDuration } from "@/lib/utils/routine-calc";
import { useRoutineEditor } from "./RoutineEditorContext";

interface BlockItemProps {
  block: RoutineBlock;
  parentId?: string;
  children?: React.ReactNode;
}

export function BlockItem({ block, parentId, children }: BlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: { parentId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const { dispatch } = useRoutineEditor();

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: "REMOVE_BLOCK", payload: { id: block.id } });
  };

  if (block.type === "exercise") {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "group relative bg-[#1d2626] rounded-xl border border-white/5 overflow-hidden flex items-stretch min-h-[64px] shadow-md hover:border-gray-600 transition-colors mb-3",
          isDragging && "border-primary/50 shadow-neon-box"
        )}
      >
        <div
          className="w-10 shrink-0 flex items-center justify-center cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-100 border-r border-white/5"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={18} />
        </div>
        <div className="w-1.5 bg-primary h-full flex-shrink-0 shadow-[0_0_10px_rgba(6,224,206,0.5)]" />
        <div className="flex-1 flex items-center justify-between px-4 pl-3 gap-3">
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <input
              value={block.title}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_BLOCK",
                  payload: { id: block.id, updates: { title: e.target.value } },
                })
              }
              className="font-bold text-gray-100 text-base bg-transparent border-none outline-none focus:ring-0 w-full"
              placeholder="운동 이름"
            />
            <span className="text-[10px] text-primary font-mono tracking-wider">
              EXERCISE
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <input
              type="number"
              min={1}
              max={999}
              value={block.duration}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!Number.isNaN(v) && v >= 1)
                  dispatch({
                    type: "UPDATE_BLOCK",
                    payload: { id: block.id, updates: { duration: v } },
                  });
              }}
              className="w-14 bg-black/20 px-2 py-1 rounded-md border border-white/5 text-gray-200 text-sm font-mono font-bold text-right"
            />
            <span className="text-[10px] text-gray-300">초</span>
            <button
              type="button"
              onClick={handleRemove}
              className="text-gray-300 hover:text-red-400 transition-colors p-1 rounded hover:bg-white/5"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "rest") {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "group relative bg-[#1d2626] rounded-xl border border-white/5 overflow-hidden flex items-stretch min-h-[64px] shadow-md hover:border-gray-600 transition-colors mb-3",
          isDragging && "border-accent-green/50 shadow-[0_0_10px_rgba(0,230,118,0.3)]"
        )}
      >
        <div
          className="w-10 shrink-0 flex items-center justify-center cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-100 border-r border-white/5"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={18} />
        </div>
        <div className="w-1.5 bg-[#00e676] h-full flex-shrink-0 shadow-[0_0_10px_rgba(0,230,118,0.3)]" />
        <div className="flex-1 flex items-center justify-between px-4 pl-3 gap-3">
          <div className="flex flex-col justify-center">
            <span className="font-bold text-gray-100 text-base">휴식</span>
            <span className="text-[10px] text-[#00e676] font-mono tracking-wider">
              RECOVERY
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <input
              type="number"
              min={1}
              max={999}
              value={block.duration}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!Number.isNaN(v) && v >= 1)
                  dispatch({
                    type: "UPDATE_BLOCK",
                    payload: { id: block.id, updates: { duration: v } },
                  });
              }}
              className="w-14 bg-black/20 px-2 py-1 rounded-md border border-white/5 text-gray-200 text-sm font-mono font-bold text-right"
            />
            <span className="text-[10px] text-gray-300">초</span>
            <button
              type="button"
              onClick={handleRemove}
              className="text-gray-300 hover:text-red-400 transition-colors p-1 rounded hover:bg-white/5"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "loop") {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "border border-primary/40 rounded-xl overflow-hidden bg-primary/[0.03] shadow-neon-box relative mb-3",
          isDragging && "opacity-50"
        )}
      >
        <div className="absolute top-0 right-0 p-2 opacity-50 pointer-events-none">
          <Repeat className="text-primary/30 w-16 h-16" />
        </div>
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-3 flex items-center justify-between backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div
              className="cursor-grab active:cursor-grabbing p-1 rounded text-primary"
              {...attributes}
              {...listeners}
            >
              <GripVertical size={18} />
            </div>
            <Repeat className="text-primary w-5 h-5" />
            <span className="text-sm font-bold text-primary">
              세트 반복: {block.repeat}회
            </span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-gray-300 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-3 loop-children-container">
          {children}
        </div>
      </div>
    );
  }

  return null;
}
