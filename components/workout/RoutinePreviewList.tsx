import { ExerciseBlock, LoopBlock, RestBlock, RoutineBlock } from "@/types/routine";
import { Coffee, Dumbbell, Repeat } from "lucide-react";

interface RoutinePreviewListProps {
  blocks: RoutineBlock[];
}

export function RoutinePreviewList({ blocks }: RoutinePreviewListProps) {
  return (
    <div className="flex flex-col gap-3 mt-6">
      <h3 className="text-lg font-bold text-white mb-2">훈련 구성</h3>
      <div className="flex flex-col gap-3">
        {blocks.map((block, index) => (
          <PreviewBlockItem key={`${block.id}_${index}`} block={block} />
        ))}
      </div>
    </div>
  );
}

function PreviewBlockItem({ block }: { block: RoutineBlock }) {
  if (block.type === "exercise") {
    const ex = block as ExerciseBlock;
    return (
      <div className="flex flex-col p-4 rounded-xl bg-[#162629] border border-white/5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5" style={{ color: ex.color || "#06e0ce" }}>
              <Dumbbell size={20} />
            </div>
            <div>
              <h4 className="text-white font-bold">{ex.title}</h4>
              <p className="text-xs text-gray-400 mt-0.5">
                {ex.duration}초 {ex.reps ? `· ${ex.reps}회` : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "rest") {
    const rest = block as RestBlock;
    return (
      <div className="flex flex-col p-3 rounded-xl bg-[#1d2d30] border border-dashed border-white/10 opacity-70">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-transparent text-gray-400">
            <Coffee size={18} />
          </div>
          <span className="text-sm font-medium text-gray-300">
            {rest.title || "휴식"} ({rest.duration}초)
          </span>
        </div>
      </div>
    );
  }

  if (block.type === "loop") {
    const loop = block as LoopBlock;
    return (
      <div className="flex flex-col p-4 rounded-xl border border-[#25d1f4]/30 bg-[#25d1f4]/5">
        <div className="flex items-center gap-2 mb-3 text-[#25d1f4]">
          <Repeat size={18} />
          <span className="font-bold text-sm tracking-wide">
            {loop.repeat}세트 반복
          </span>
        </div>
        <div className="flex flex-col gap-2 pl-2 border-l-2 border-[#25d1f4]/20 ml-2">
          {loop.children?.map((childBlock, idx) => (
            <PreviewBlockItem key={`${childBlock.id}_${idx}`} block={childBlock} />
          ))}
        </div>
      </div>
    );
  }

  return null;
}
