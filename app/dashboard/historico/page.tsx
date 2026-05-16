"use client";

import { motion } from "motion/react";

export default function HistoricoPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-2">
          Histórico
        </h1>
        <p className="text-sm text-foreground/40 mb-8">
          Acompanhe sua jornada emocional ao longo do tempo.
        </p>
      </motion.div>

      <motion.div
        className="glass-panel p-8 text-center"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <div className="w-16 h-16 rounded-full bg-anima-violet/10 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-anima-violet/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-foreground/70 mb-1">
          Em breve
        </h3>
        <p className="text-sm text-foreground/40 max-w-xs mx-auto">
          Seu histórico emocional aparecerá aqui conforme você registrar seus
          sentimentos.
        </p>
      </motion.div>
    </div>
  );
}
