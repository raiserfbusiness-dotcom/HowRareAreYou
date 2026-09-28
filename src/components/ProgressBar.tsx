import React from 'react';
import { useI18n } from '../lib/i18n';

interface ProgressBarProps {
  currentIndex: number;
  totalCount: number;
  labelPrefix?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentIndex,
  totalCount,
  labelPrefix,
}) => {
  const { t } = useI18n();
  const safeTotal = Math.max(1, totalCount);
  const currentOneBased = Math.min(safeTotal, currentIndex + 1);
  const percentage = Math.min(100, Math.max(0, (currentOneBased / safeTotal) * 100));

  const formattedCurrent = String(currentOneBased).padStart(2, '0');
  const formattedTotal = String(safeTotal).padStart(2, '0');
  const prefix = labelPrefix ?? t.quiz.questionPrefix;

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between text-xs font-mono-tabular tracking-widest text-[var(--text-secondary)]">
        <span>
          {prefix} {formattedCurrent} {t.quiz.ofWord} {formattedTotal}
        </span>
        <span>
          {formattedCurrent} / {formattedTotal}
        </span>
      </div>
      {/* Very thin progress line */}
      <div
        role="progressbar"
        aria-valuenow={currentOneBased}
        aria-valuemin={1}
        aria-valuemax={safeTotal}
        aria-label={`${prefix} ${currentOneBased} ${t.quiz.ofWord} ${safeTotal}`}
        className="h-[2px] w-full overflow-hidden bg-white/15"
      >
        <div
          className="h-full bg-[var(--accent)] transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
