import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { QuizAnswers } from './types/quiz';
import { SharePayload } from './types/rarity';
import { CORE_QUESTIONS } from './lib/rarity/questions';
import { calculateRarity } from './lib/rarity/rarityEngine';
import { isCoreQuizComplete } from './lib/rarity/validation';
import { decodeShareToken, encodeShareToken } from './lib/share';
import { trackEvent } from './lib/analytics';
import { I18nProvider } from './lib/i18n';
import { PopulationField } from './components/PopulationField';
import { Navbar, RouteView } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { QuestionScreen } from './components/QuestionScreen';
import { CalculationAnimation } from './components/CalculationAnimation';
import { RarityReveal } from './components/RarityReveal';
import { ChallengeLanding } from './components/Challenge';
import {
  AboutPage,
  ContactPage,
  MethodologyPage,
  PrivacyPage,
} from './components/EditorialPages';

const STORAGE_KEY_ANSWERS = 'hrau_quiz_answers_v1';
const STORAGE_KEY_INDEX = 'hrau_quiz_index_v1';

interface ParsedLocationState {
  view: RouteView;
  token?: string;
}

function parseWindowLocation(): ParsedLocationState {
  if (typeof window === 'undefined') return { view: 'home' };
  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  if (path === '/quiz') return { view: 'quiz' };
  if (path === '/about') return { view: 'about' };
  if (path === '/methodology') return { view: 'methodology' };
  if (path === '/privacy') return { view: 'privacy' };
  if (path === '/contact') return { view: 'contact' };

  if (path.startsWith('/result/')) {
    const token = path.slice('/result/'.length);
    return { view: 'result', token };
  }
  if (path === '/result') {
    return { view: 'result' };
  }

  if (path.startsWith('/challenge/')) {
    const token = path.slice('/challenge/'.length);
    return { view: 'challenge', token };
  }

  return { view: 'home' };
}

function AppContent() {
  const [answers, setAnswers] = useState<QuizAnswers>(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY_ANSWERS);
      return raw ? (JSON.parse(raw) as QuizAnswers) : {};
    } catch {
      return {};
    }
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY_INDEX);
      const parsed = raw ? parseInt(raw, 10) : 0;
      return Number.isFinite(parsed) && parsed >= 0 && parsed < CORE_QUESTIONS.length
        ? parsed
        : 0;
    } catch {
      return 0;
    }
  });

  const [currentView, setCurrentView] = useState<RouteView>('home');
  const [challengerPayload, setChallengerPayload] = useState<SharePayload | null>(null);
  const [sharedViewPayload, setSharedViewPayload] = useState<SharePayload | null>(null);

  const autoAdvanceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(answers));
      sessionStorage.setItem(STORAGE_KEY_INDEX, String(currentQuestionIndex));
    } catch {
      // Ignore storage quota errors
    }
  }, [answers, currentQuestionIndex]);

  const rarityResult = useMemo(() => calculateRarity(answers), [answers]);

  const navigateTo = useCallback((view: RouteView, urlPath?: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (typeof window !== 'undefined') {
      const targetPath =
        urlPath ??
        (view === 'home'
          ? '/'
          : view === 'calculating'
          ? '/quiz'
          : `/${view}`);

      const search = window.location.search || '';
      const fullTarget = `${targetPath}${search}`;

      if (`${window.location.pathname}${window.location.search}` !== fullTarget) {
        try {
          window.history.pushState({ view }, '', fullTarget);
        } catch {
          // Ignore in restricted sandboxed environments
        }
      }
    }
  }, []);

  useEffect(() => {
    const syncFromUrl = () => {
      const parsed = parseWindowLocation();

      if (parsed.view === 'challenge') {
        const decoded = decodeShareToken(parsed.token);
        setChallengerPayload(decoded);
        setSharedViewPayload(null);
        setCurrentView('challenge');
        return;
      }

      if (parsed.view === 'result') {
        if (parsed.token) {
          const decoded = decodeShareToken(parsed.token);
          if (decoded && !isCoreQuizComplete(answers)) {
            setSharedViewPayload(decoded);
          } else {
            setSharedViewPayload(null);
          }
        }
        setCurrentView('result');
        return;
      }

      setSharedViewPayload(null);
      setCurrentView(parsed.view);
    };

    syncFromUrl();
    trackEvent('homepage_view');

    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, [answers]);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        window.clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, []);

  const handleStartFreshQuiz = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      window.clearTimeout(autoAdvanceTimerRef.current);
    }
    setSharedViewPayload(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
    trackEvent('quiz_started', { mode: 'fresh' });
    navigateTo('quiz', '/quiz');
  }, [navigateTo]);

  const handleResumeQuiz = useCallback(() => {
    setSharedViewPayload(null);
    trackEvent('quiz_started', { mode: 'resume' });
    navigateTo('quiz', '/quiz');
  }, [navigateTo]);

  const handleAcceptChallenge = useCallback(() => {
    setSharedViewPayload(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
    trackEvent('quiz_started', { mode: 'challenge' });
    navigateTo('quiz', '/quiz');
  }, [navigateTo]);

  const handleSelectCoreAnswer = useCallback(
    (questionId: string, optionId: string) => {
      if (autoAdvanceTimerRef.current) {
        window.clearTimeout(autoAdvanceTimerRef.current);
      }

      const updatedAnswers = { ...answers, [questionId]: optionId };
      setAnswers(updatedAnswers);

      trackEvent('question_answered', {
        questionId,
        stepIndex: currentQuestionIndex + 1,
      });

      autoAdvanceTimerRef.current = window.setTimeout(() => {
        if (currentQuestionIndex < CORE_QUESTIONS.length - 1) {
          setCurrentQuestionIndex((prev) => Math.min(CORE_QUESTIONS.length - 1, prev + 1));
        } else {
          trackEvent('quiz_completed', {
            answeredCount: Object.keys(updatedAnswers).length,
          });
          if (challengerPayload) {
            trackEvent('challenge_completed');
          }
          setCurrentView('calculating');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 340);
    },
    [answers, currentQuestionIndex, challengerPayload]
  );

  const handlePreviousQuestion = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      window.clearTimeout(autoAdvanceTimerRef.current);
    }
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      navigateTo('home', '/');
    }
  }, [currentQuestionIndex, navigateTo]);

  const handleCalculationFinished = useCallback(() => {
    const token = encodeShareToken(rarityResult);
    trackEvent('result_viewed', {
      confidence: rarityResult.confidence,
      tier: rarityResult.narrative.tier,
    });
    navigateTo('result', `/result/${token}`);
  }, [navigateTo, rarityResult]);

  const handleUpdateBonusOrAnswer = useCallback((questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  }, []);

  const coreAnsweredCount = CORE_QUESTIONS.filter((q) => Boolean(answers[q.id])).length;
  const activeQuestion = CORE_QUESTIONS[currentQuestionIndex] ?? CORE_QUESTIONS[0];

  return (
    <div className="relative flex min-h-dvh flex-col bg-[var(--background)] text-[var(--text-primary)] bg-noise">
      {/* Subtle Background Dot Population Animation */}
      <PopulationField
        density={currentView === 'home' || currentView === 'calculating' ? 'normal' : 'subtle'}
      />

      {/* Minimal Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => navigateTo(view)}
        onStartQuiz={handleStartFreshQuiz}
        hasSavedProgress={coreAnsweredCount > 0}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {currentView === 'home' && (
          <Hero
            onStartQuiz={handleStartFreshQuiz}
            onResumeQuiz={handleResumeQuiz}
            onViewLastResult={() => {
              const token = encodeShareToken(rarityResult);
              navigateTo('result', `/result/${token}`);
            }}
            savedAnswerCount={coreAnsweredCount}
            hasPreviousResult={coreAnsweredCount >= 12}
          />
        )}

        {currentView === 'quiz' && (
          <QuestionScreen
            question={activeQuestion}
            currentIndex={currentQuestionIndex}
            totalQuestions={CORE_QUESTIONS.length}
            selectedOptionId={answers[activeQuestion.id]}
            onSelectAnswer={handleSelectCoreAnswer}
            onBack={handlePreviousQuestion}
            canGoBack={currentQuestionIndex > 0}
          />
        )}

        {currentView === 'calculating' && (
          <CalculationAnimation onComplete={handleCalculationFinished} />
        )}

        {currentView === 'result' && (
          <RarityReveal
            result={rarityResult}
            answers={answers}
            challengerPayload={challengerPayload}
            sharedViewPayload={sharedViewPayload}
            onUpdateAnswer={handleUpdateBonusOrAnswer}
            onRetakeQuiz={handleStartFreshQuiz}
            onEditQuizAnswers={() => {
              setSharedViewPayload(null);
              navigateTo('quiz', '/quiz');
            }}
            onNavigateMethodology={() => navigateTo('methodology', '/methodology')}
          />
        )}

        {currentView === 'challenge' && (
          <ChallengeLanding
            challengerPayload={challengerPayload}
            onAcceptChallenge={handleAcceptChallenge}
          />
        )}

        {currentView === 'about' && <AboutPage onStartQuiz={handleStartFreshQuiz} />}

        {currentView === 'methodology' && (
          <MethodologyPage onStartQuiz={handleStartFreshQuiz} />
        )}

        {currentView === 'privacy' && <PrivacyPage onStartQuiz={handleStartFreshQuiz} />}

        {currentView === 'contact' && <ContactPage onStartQuiz={handleStartFreshQuiz} />}
      </main>

      {/* Minimal Footer */}
      {currentView !== 'quiz' && currentView !== 'calculating' && (
        <Footer onNavigate={(view) => navigateTo(view)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
