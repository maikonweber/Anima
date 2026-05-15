"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BASE_EMOTIONS, BASE_EMOTION_IDS } from "@/lib/emotion/base-emotions";
import { getBlend } from "@/lib/emotion/blends";
import { mixColors } from "@/lib/emotion/utils";
import type { BaseEmotionId } from "@/lib/emotion/types";

export function EmotionLayerMap({ className = "" }: { className?: string }) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <div
        className="inline-grid gap-2 min-w-[420px]"
        style={{
          gridTemplateColumns: `80px repeat(${BASE_EMOTION_IDS.length}, 1fr)`,
        }}
      >
        {/* Empty corner */}
        <div />

        {/* Column headers */}
        {BASE_EMOTION_IDS.map((id) => {
          const e = BASE_EMOTIONS[id];
          return (
            <div
              key={`col-${id}`}
              className="flex flex-col items-center gap-1 px-1 py-2"
            >
              <span className="text-lg" aria-hidden="true">
                {e.icon}
              </span>
              <span className="text-[10px] font-medium text-foreground/50 truncate max-w-full text-center">
                {e.name}
              </span>
            </div>
          );
        })}

        {/* Rows */}
        {BASE_EMOTION_IDS.map((rowId) => {
          const rowEmotion = BASE_EMOTIONS[rowId];
          return [
            <div
              key={`row-${rowId}`}
              className="flex items-center gap-2 pr-2"
            >
              <span className="text-lg" aria-hidden="true">
                {rowEmotion.icon}
              </span>
              <span className="text-[10px] font-medium text-foreground/50 truncate">
                {rowEmotion.name}
              </span>
            </div>,
            ...BASE_EMOTION_IDS.map((colId) => (
              <MapCell
                key={`${rowId}-${colId}`}
                rowId={rowId}
                colId={colId}
                isHovered={hoveredCell === `${rowId}-${colId}`}
                onHover={(hovered) =>
                  setHoveredCell(hovered ? `${rowId}-${colId}` : null)
                }
              />
            )),
          ];
        })}
      </div>
    </div>
  );
}

function MapCell({
  rowId,
  colId,
  isHovered,
  onHover,
}: {
  rowId: BaseEmotionId;
  colId: BaseEmotionId;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}) {
  const isSame = rowId === colId;
  const rowEmotion = BASE_EMOTIONS[rowId];
  const colEmotion = BASE_EMOTIONS[colId];
  const blend = isSame ? null : getBlend(rowId, colId);
  const cellColor = isSame
    ? rowEmotion.color
    : mixColors(rowEmotion.color, colEmotion.color);

  return (
    <motion.div
      className="relative aspect-square rounded-xl cursor-default flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: `${cellColor}${isSame ? "30" : "25"}`,
        border: `1px solid ${cellColor}${isHovered ? "50" : "15"}`,
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      whileHover={{ scale: 1.08 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      tabIndex={0}
      role="gridcell"
      aria-label={
        isSame
          ? rowEmotion.name
          : blend
            ? `${rowEmotion.name} + ${colEmotion.name} = ${blend.composite.name}`
            : `${rowEmotion.name} + ${colEmotion.name}`
      }
    >
      {isSame ? (
        <div
          className="w-6 h-6 rounded-full"
          style={{
            backgroundColor: cellColor,
            opacity: 0.6,
            boxShadow: `0 0 12px ${cellColor}40`,
          }}
        />
      ) : (
        <div className="flex items-center">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: rowEmotion.color, opacity: 0.7 }}
          />
          <div
            className="-ml-2 w-4 h-4 rounded-full"
            style={{ backgroundColor: colEmotion.color, opacity: 0.7 }}
          />
        </div>
      )}

      {/* Hover tooltip */}
      <AnimatePresence>
        {isHovered && !isSame && blend && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center rounded-xl z-10"
            style={{
              backgroundColor: `${cellColor}90`,
              backdropFilter: "blur(8px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <span className="text-[10px] font-semibold text-white text-center px-1 drop-shadow-sm leading-tight">
              {blend.composite.name}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glow on hover */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow: `0 0 20px -4px ${cellColor}60`,
          }}
        />
      )}
    </motion.div>
  );
}
