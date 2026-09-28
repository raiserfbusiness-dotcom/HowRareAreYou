import React, { useEffect, useState } from 'react';
import { useI18n } from '../lib/i18n';

interface CalculationAnimationProps {
  onComplete: () => void;
}

export const CalculationAnimation: React.FC<CalculationAnimationProps> = ({
  onComplete,
}) => {
  const { t } = useI18n();
  const [stepIndex, setStepIndex] = useState(0);
  const steps = t.calculation.steps;

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      const quickTimer = window.setTimeout(onComplete, 400);
      return () => window.clearTimeout(quickTimer);
    }

    const stepInterval = window.setInterval(() => {
      setStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 520);

    const finishTimer = window.setTimeout(() => {
      onComplete();
    }, 2750);

    return () => {
      window.clearInterval(stepInterval);
      window.clearTimeout(finishTimer);
    };
  }, [onComplete, steps.length]);

  const progressPercent = Math.round(((stepIndex + 1) / steps.length) * 100);

  return (
    <section
      aria-live="polite"
      className="relative z-10 mx-auto flex min-h-[calc(100dvh-72px)] w-full max-w-2xl flex-col items-center justify-center px-5 py-16 text-center"
    >
      <div className="w-full space-y-8">
        <p className="font-mono-tabular text-xs uppercase tracking-widest text-[var(--accent-bright)]">
          {t.calculation.tag}
        </p>

        <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl min-h-[1.3em]">
          {steps[stepIndex] ?? steps[0]}
        </h1>

        <div className="mx-auto max-w-md space-y-3">
          <div className="h-[2px] w-full overflow-hidden bg-white/15">
            <div
              className="h-full bg-[var(--accent)] transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between font-mono-tabular text-xs text-[var(--text-muted)]">
            <span>{t.calculation.estimatingLabel}</span>
            <span>{progressPercent}%</span>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="button"
            onClick={onComplete}
            className="text-xs font-mono-tabular text-[var(--text-muted)] underline-offset-4 hover:text-[var(--text-secondary)] hover:underline"
          >
            {t.calculation.skip}
          </button>
        </div>
      </div>
    </section>
  );
};
