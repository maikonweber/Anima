"use client";

import { motion, useReducedMotion } from "motion/react";
import { TrendsChart } from "@/components/insights/TrendsChart";
import { MonthlyReport } from "@/components/insights/MonthlyReport";
import { CorrelationBars } from "@/components/insights/CorrelationBars";
import { MoodCalendarCard } from "@/components/insights/MoodCalendarCard";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/locale-provider";
import { getProductDictionary } from "@/lib/i18n/product-dictionary";

export default function InsightsPage() {
  const reduce = useReducedMotion() ?? false;
  const { locale, localizedHref } = useLocale();
  const t = getProductDictionary(locale);

  const sections = [
    <MoodCalendarCard key="calendar" />,
    <TrendsChart key="trends" />,
    <MonthlyReport key="monthly" />,
    <CorrelationBars key="correlations" />,
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        className="mb-6"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 mb-1">
          Insights
        </h1>
        <p className="text-sm text-foreground/40">
          Padrões e tendências da sua jornada emocional
        </p>
        <Link
          href={localizedHref("/dashboard/relatorio")}
          className="inline-block mt-3 text-sm font-medium text-anima-violet hover:underline"
        >
          {t.report.link} →
        </Link>
      </motion.div>

      <div className="space-y-6">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : 0.08 * (i + 1) }}
          >
            {section}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
