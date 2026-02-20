"use client";

import { cn } from "@/lib/utils";
import { RoutineBlock } from "@/types/routine";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Repeat, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useRoutineEditor } from "./RoutineEditorContext";

const EXERCISE_COLORS = ["#f44336", "#e91e63", "#ff9800", "#ffeb3b", "#00bcd4"];
const REST_COLORS = ["#4caf50", "#03a9f4"];
const LOOP_COLORS = ["#2196f3", "#673ab7", "#009688"];

function PresetColorPicker({
  value,
  onChange,
  presets,
}: {
  value: string;
  onChange: (color: string) => void;
  presets: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative flex items-center" ref={ref}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-4 h-4 rounded-full border border-white/30 shadow-sm"
        style={{ backgroundColor: value }}
      />
      {isOpen && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] bg-[#2a3636] border border-white/10 rounded-xl p-3 shadow-2xl flex gap-3">
          {presets.map((color) => (
            <button
              key={color}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(color);
                setIsOpen(false);
              }}
              className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

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
          "group relative bg-[#1d2626] rounded-xl border border-white/5 flex items-stretch min-h-[64px] shadow-md hover:border-gray-600 transition-colors mb-3",
          isDragging && "border-primary/50 shadow-neon-box"
        )}
      >
        <div
          className="touch-none w-10 shrink-0 flex items-center justify-center cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-100 border-r border-white/5"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={18} />
        </div>
        <div
          className="w-1.5 h-full flex-shrink-0"
          style={{ backgroundColor: block.color || "#06e0ce", boxShadow: `0 0 10px ${block.color || "#06e0ce"}80` }}
        />
        <div className="flex-1 flex items-center justify-between px-4 pl-3 gap-3">
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <input
                value={block.title}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_BLOCK",
                    payload: { id: block.id, updates: { title: e.target.value } },
                  })
                }
                className="font-bold text-gray-100 text-base bg-transparent border-none outline-none focus:ring-0 w-full p-0"
                placeholder="운동 이름"
              />
              <PresetColorPicker
                value={block.color || EXERCISE_COLORS[0]}
                onChange={(color) =>
                  dispatch({
                    type: "UPDATE_BLOCK",
                    payload: { id: block.id, updates: { color } },
                  })
                }
                presets={EXERCISE_COLORS}
              />
            </div>
            <span
              className="text-[10px] font-mono tracking-wider"
              style={{ color: block.color || "#06e0ce" }}
            >
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
          "group relative bg-[#1d2626] rounded-xl border border-white/5 flex items-stretch min-h-[64px] shadow-md hover:border-gray-600 transition-colors mb-3",
          isDragging && "border-accent-green/50 shadow-[0_0_10px_rgba(0,230,118,0.3)]"
        )}
      >
        <div
          className="touch-none w-10 shrink-0 flex items-center justify-center cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-100 border-r border-white/5"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={18} />
        </div>
        <div
          className="w-1.5 h-full flex-shrink-0"
          style={{ backgroundColor: block.color || "#00e676", boxShadow: `0 0 10px ${block.color || "#00e676"}80` }}
        />
        <div className="flex-1 flex items-center justify-between px-4 pl-3 gap-3">
          <div className="flex flex-col justify-center min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <input
                value={block.title || "휴식"}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_BLOCK",
                    payload: { id: block.id, updates: { title: e.target.value } },
                  })
                }
                className="font-bold text-gray-100 text-base bg-transparent border-none outline-none focus:ring-0 w-full p-0"
                placeholder="휴식"
              />
              <PresetColorPicker
                value={block.color || REST_COLORS[0]}
                onChange={(color) =>
                  dispatch({
                    type: "UPDATE_BLOCK",
                    payload: { id: block.id, updates: { color } },
                  })
                }
                presets={REST_COLORS}
              />
            </div>
            <span
              className="text-[10px] font-mono tracking-wider"
              style={{ color: block.color || "#00e676" }}
            >
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
        style={{ ...style, borderColor: block.color || "#00b4d8" }}
        className={cn(
          "border rounded-xl bg-[#1d2626]/40 shadow-neon-box relative mb-3",
          isDragging && "opacity-50"
        )}
      >
        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none z-0">
          <div className="absolute top-0 right-0 p-2 opacity-10">
            <Repeat style={{ color: block.color || "#00b4d8" }} className="w-16 h-16" />
          </div>
        </div>
        <div className="bg-[#1d2626]/80 border-b border-white/10 px-4 py-3 flex items-center justify-between backdrop-blur-sm relative z-10 rounded-t-xl">
          <div className="flex items-center gap-2">
            <div
              className="touch-none cursor-grab active:cursor-grabbing p-1 rounded"
              style={{ color: block.color || "#00b4d8" }}
              {...attributes}
              {...listeners}
            >
              <GripVertical size={18} />
            </div>
            <Repeat style={{ color: block.color || "#00b4d8" }} className="w-5 h-5 flex-shrink-0" />
            <input
              value={block.title || "세트 그룹"}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_BLOCK",
                  payload: { id: block.id, updates: { title: e.target.value } },
                })
              }
              className="text-sm font-bold bg-transparent border-none outline-none focus:ring-0 p-0 w-24"
              style={{ color: block.color || "#00b4d8" }}
              placeholder="세트 그룹"
            />
            <div className="flex items-center gap-1 bg-black/30 rounded-md px-1 py-0.5 border border-white/10 shrink-0">
              <button
                type="button"
                onClick={() =>
                  dispatch({
                    type: "UPDATE_BLOCK",
                    payload: { id: block.id, updates: { repeat: Math.max(1, block.repeat - 1) } },
                  })
                }
                className="text-gray-400 hover:text-white px-1"
              >
                -
              </button>
              <span className="text-sm font-bold text-gray-200 w-4 text-center">
                {block.repeat}
              </span>
              <button
                type="button"
                onClick={() =>
                  dispatch({
                    type: "UPDATE_BLOCK",
                    payload: { id: block.id, updates: { repeat: block.repeat + 1 } },
                  })
                }
                className="text-gray-400 hover:text-white px-1"
              >
                +
              </button>
            </div>
            <span className="text-[12px] font-bold text-gray-400 shrink-0">회 반복</span>
            <PresetColorPicker
              value={block.color || LOOP_COLORS[0]}
              onChange={(color) =>
                dispatch({
                  type: "UPDATE_BLOCK",
                  payload: { id: block.id, updates: { color } },
                })
              }
              presets={LOOP_COLORS}
            />
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
