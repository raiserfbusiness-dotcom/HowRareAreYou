import React, { createContext, useContext, useEffect, useState } from 'react';
import { Question } from '../types/quiz';
import { ConfidenceLevel, RarityTier } from '../types/rarity';

export type Language = 'en' | 'es' | 'de';

export const SUPPORTED_LANGUAGES: { code: Language; label: string; nativeName: string }[] = [
  { code: 'en', label: 'EN', nativeName: 'English' },
  { code: 'es', label: 'ES', nativeName: 'Español' },
  { code: 'de', label: 'DE', nativeName: 'Deutsch' },
];

interface QuestionTranslation {
  prompt: string;
  subtitle?: string;
  categoryLabel: string;
  options: Record<
    string,
    {
      label: string;
      shortTag: string;
      cardLabel: string;
      subtext?: string;
    }
  >;
}

export interface UITranslations {
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  brand: {
    name: string;
  };
  nav: {
    about: string;
    methodology: string;
    privacy: string;
    contact: string;
    home: string;
    findOut: string;
    languageLabel: string;
  };
  footer: {
    privacyNote: string;
    disclaimer: string;
    modelMeta: string;
  };
  hero: {
    titleLine1: string;
    titleLine2: string;
    subtitleLine1: string;
    subtitleLine2: string;
    ctaPrimary: string;
    ctaResume: (count: number) => string;
    ctaLastResult: string;
    noAccountNote: string;
    section01Tag: string;
    commonBirthday: string;
    commonHeight: string;
    commonHabits: string;
    combineQuestion: string;
    combineBody: string;
    ctaSecondary: string;
    cascadeHeader: string;
    cascadePeopleSuffix: string;
    cascadeHint: string;
    cascadeSteps: {
      trait: string;
      prevalence: string;
      remaining: string;
      oneIn: string;
    }[];
    seoSectionTitle: string;
    seoGroup1Title: string;
    seoGroup1Body: string;
    seoGroup2Title: string;
    seoGroup2Body: string;
    seoGroup3Title: string;
    seoGroup3Body: string;
  };
  quiz: {
    questionPrefix: string;
    ofWord: string;
    previous: string;
    keyboardHint: (maxKey: number) => string;
    localCalculationNote: string;
  };
  calculation: {
    tag: string;
    steps: string[];
    estimatingLabel: string;
    skip: string;
  };
  result: {
    weFoundSomething: string;
    yourEstimatedRarity: string;
    demoEstimateModel: string;
    estimatedLabel: string;
    occurrenceExplanationPrefix: string;
    occurrenceExplanationSuffix: string;
    estimatedPercentileLabel: string;
    percentileExplanation: (pct: string) => string;
    estimatedRangeLabel: string;
    modelConfidenceLabel: string;
    confidenceSummary: (traits: number, correlations: number) => string;
    intersectionHighlight: string;
    yourRarestCombination: string;
    rarestComboExplanation: string;
    individualEstPrefix: string;
    subComboOccurrence: string;
    howManyTitle: string;
    howManyIntroLine1: string;
    howManyIntroLine2: string;
    howManyOutro: string;
    howManyFooter: string;
    somewhereOnEarth: string;
    twinsHeadline: string;
    twinsSubtext: string;
    estimatedStatisticalTwins: string;
    twinsDisclaimer: string;
    upgradeLoopTag: (added: number, total: number) => string;
    canYouGetRarer: string;
    upgradeDescription: (total: number) => string;
    keepGoing: string;
    currentLiveEstimate: (count: number) => string;
    bonusCharacteristic: string;
    activeInModel: string;
    upgradeDisclaimer: string;
    shareCardTag: string;
    shareCardHeadline: string;
    shareCardBody: string;
    noPiiStored: string;
    shareMyResult: string;
    copyShareLink: string;
    linkCopied: string;
    downloadRarityCard: string;
    renderingCard: string;
    statusLinkCopied: string;
    statusClipboardError: string;
    statusCardDownloaded: string;
    statusCardError: string;
    shareText: (rarity: string, twins: string) => string;
    challengeTag: string;
    thinkYoureRarer: string;
    challengeDescription: string;
    optionalDisplayName: string;
    aliasPlaceholder: string;
    challengeAFriend: string;
    copyLink: string;
    challengeLinkCopied: string;
    challengeShareTitle: string;
    challengeShareText: (rarity: string) => string;
    incomingChallengeTag: string;
    challengedYou: (name: string) => string;
    someone: string;
    theirEstimatedRarity: string;
    theirRarestCombination: string;
    estimatedOccurrenceLabel: string;
    challengeTakes60s: string;
    incompleteChallengeBody: string;
    challengeComparisonTag: string;
    challengersRarity: (name?: string) => string;
    comparisonRarer: string;
    comparisonLessRare: string;
    comparisonTie: string;
    sharedEstimateTag: string;
    sharedProfileSummary: (rarity: string, twins: string) => string;
    rarestInThisProfile: string;
    sharedCtaTitle: string;
    sharedCtaSubtitle: string;
    findOutYourRarity: string;
    insufficientDataTag: string;
    insufficientDataHeadline: string;
    insufficientDataSubtext: string;
    answerMoreQuestions: string;
    showBreakdown: (count: number) => string;
    hideBreakdown: (count: number) => string;
    changeAnswers: string;
    howIsThisCalculated: string;
    startOver: string;
    modelInputBreakdown: string;
    showingPrevalenceNote: string;
    baselineSuffix: string;
    correlationNotePrefix: string;
    confidenceWord: string;
  };
  confidenceLabels: Record<ConfidenceLevel, string>;
  confidenceExplanations: Record<ConfidenceLevel, string>;
  narratives: Record<RarityTier, { headline: string; summary: string }>;
  pages: {
    about: {
      tag: string;
      title: string;
      lead: string;
      bullet1: string;
      bullet2: string;
      bullet3: string;
      combinationsDifferent: string;
      body1: string;
      body2: string;
      honestyTag: string;
      honestyBody: string;
      cta: string;
    };
    methodology: {
      tag: string;
      title: string;
      subtitle: string;
      card1Tag: string;
      card1Title: string;
      card1Body: string;
      card2Tag: string;
      card2Title: string;
      card2Body: string;
      card3Tag: string;
      card3Title: string;
      card3Body: string;
      card4Tag: string;
      card4Title: string;
      card4Body: string;
      rulesTitle: string;
      rulesSubtitle: string;
      conditionalAdjustmentSuffix: string;
      distributionsTitle: string;
      cta: string;
    };
    privacy: {
      tag: string;
      title: string;
      quote: string;
      card1Title: string;
      card1Body: string;
      card2Title: string;
      card2Body: string;
      card3Title: string;
      card3Body: string;
      card4Title: string;
      card4Body: string;
      cta: string;
    };
    contact: {
      tag: string;
      title: string;
      body: string;
      editorialLabel: string;
      generalLabel: string;
      cta: string;
    };
  };
  questions: Record<string, QuestionTranslation>;
}

export const TRANSLATIONS: Record<Language, UITranslations> = {
  en: {
    seo: {
      title: 'How Rare Are You? — Find Out How Unusual You Are',
      description:
        'There are billions of people on Earth. How many of them are actually like you? Take the interactive rarity test and discover your estimated statistical rarity.',
      keywords:
        'how rare are you, how rare am I test, statistical rarity calculator, human trait combination quiz, statistical twin finder, demographic comparison, probability curiosity engine',
    },
    brand: {
      name: 'HOW RARE ARE YOU?',
    },
    nav: {
      about: 'About',
      methodology: 'Methodology',
      privacy: 'Privacy',
      contact: 'Contact',
      home: 'Home',
      findOut: 'FIND OUT',
      languageLabel: 'Language',
    },
    footer: {
      privacyNote: "We don't need to know who you are to calculate your result.",
      disclaimer:
        'Results are estimates and should not be interpreted as exact population statistics.',
      modelMeta: 'Reference Population: ~8.1B · Client-Side Model',
    },
    hero: {
      titleLine1: 'HOW RARE',
      titleLine2: 'ARE YOU?',
      subtitleLine1: 'There are billions of people on Earth.',
      subtitleLine2: 'How many of them are actually like you?',
      ctaPrimary: 'FIND OUT',
      ctaResume: (count) => `RESUME (${count}/12 ANSWERED)`,
      ctaLastResult: 'VIEW LAST ESTIMATE',
      noAccountNote: 'No account required. Takes about 60 seconds.',
      section01Tag: '01. The Mathematics of Overlap',
      commonBirthday: 'Your birthday is common.',
      commonHeight: 'Your height is common.',
      commonHabits: 'Your habits are common.',
      combineQuestion: 'But what happens when you combine them?',
      combineBody:
        "That's where things get interesting. Even when every single answer you give is shared by hundreds of millions of people, the intersection of twelve ordinary traits quickly narrows the entire planet down to a small town.",
      ctaSecondary: 'FIND MY RARITY',
      cascadeHeader: 'EXAMPLE COMBINATION CASCADE',
      cascadePeopleSuffix: 'people',
      cascadeHint:
        'Click any layer above to see how each additional characteristic narrows the estimated population pool.',
      cascadeSteps: [
        {
          trait: 'Reference population on Earth',
          prevalence: '100%',
          remaining: '~8,100,000,000',
          oneIn: '1 in 1',
        },
        {
          trait: '+ Born in November',
          prevalence: '~8.0%',
          remaining: '~648,000,000',
          oneIn: '~1 in 12',
        },
        {
          trait: '+ Left-handed',
          prevalence: '~10.1%',
          remaining: '~65,400,000',
          oneIn: '~1 in 124',
        },
        {
          trait: '+ Speaks 3 languages',
          prevalence: '~13.0%',
          remaining: '~8,500,000',
          oneIn: '~1 in 950',
        },
        {
          trait: '+ Night owl + 2 siblings + Tea drinker',
          prevalence: 'Combined overlap',
          remaining: '~80,000',
          oneIn: '~1 in 101,000',
        },
      ],
      seoSectionTitle: 'EXPLORE RELATED TOPICS & QUERIES',
      seoGroup1Title: 'Rarity & Trait Tests',
      seoGroup1Body:
        'How rare am I test · Statistical rarity calculator · Human trait combination quiz · 1 in a million traits · Uncommon physical & behavioral habits',
      seoGroup2Title: 'Population & Probability',
      seoGroup2Body:
        'Global demographic comparison · Statistical twin finder · Birthday & left-handedness odds · World population overlap · Probability curiosity engine',
      seoGroup3Title: 'Interactive Discovery',
      seoGroup3Body:
        'Self-discovery games · Interactive data visualization · Shareable personality & habit experiments · Compare rarity with friends',
    },
    quiz: {
      questionPrefix: 'QUESTION',
      ofWord: 'OF',
      previous: 'PREVIOUS',
      keyboardHint: (maxKey) =>
        `Press 1–${maxKey} to select · Backspace to go back`,
      localCalculationNote: 'Calculated locally in your browser',
    },
    calculation: {
      tag: 'STATISTICAL COMBINATION MODEL',
      steps: [
        'Comparing your answers...',
        'Finding patterns...',
        'Calculating combinations...',
        'Building your statistical estimate...',
        'One last thing...',
      ],
      estimatingLabel: 'ESTIMATING INTERSECTION',
      skip: 'Skip animation',
    },
    result: {
      weFoundSomething: 'WE FOUND SOMETHING.',
      yourEstimatedRarity: 'YOUR ESTIMATED RARITY',
      demoEstimateModel: 'DEMO ESTIMATE MODEL',
      estimatedLabel: 'ESTIMATED',
      occurrenceExplanationPrefix:
        'That means your combination of characteristics is estimated to occur in roughly',
      occurrenceExplanationSuffix: 'people.',
      estimatedPercentileLabel: 'ESTIMATED PERCENTILE',
      percentileExplanation: (pct) =>
        `You are more statistically unusual than approximately ${pct} of the reference population.`,
      estimatedRangeLabel: 'ESTIMATED RANGE',
      modelConfidenceLabel: 'MODEL CONFIDENCE',
      confidenceSummary: (traits, correlations) =>
        `Based on ${traits} characteristics and ${correlations} correlation adjustments.`,
      intersectionHighlight: 'INTERSECTION HIGHLIGHT',
      yourRarestCombination: 'YOUR RAREST COMBINATION',
      rarestComboExplanation:
        'Your rarest subset of overlapping answers creates one of the most statistically uncommon intersections in your profile.',
      individualEstPrefix: 'Individual est:',
      subComboOccurrence: 'ESTIMATED SUB-COMBINATION OCCURRENCE',
      howManyTitle: 'HOW MANY OF YOU?',
      howManyIntroLine1: 'There are billions of people on Earth.',
      howManyIntroLine2: 'Based on your answers, we estimate that approximately:',
      howManyOutro:
        'people may share a similar combination of characteristics across the global reference population (~8.1 billion).',
      howManyFooter:
        'Calculated as an approximate proportion of the global reference model.',
      somewhereOnEarth: 'SOMEWHERE ON EARTH...',
      twinsHeadline: 'You probably have statistical twins.',
      twinsSubtext:
        'People whose answers overlap with yours across many characteristics.',
      estimatedStatisticalTwins: 'ESTIMATED STATISTICAL TWINS',
      twinsDisclaimer:
        'These are statistical population estimates, not identified real individuals.',
      upgradeLoopTag: (added, total) =>
        `OPTIONAL SECOND LOOP · ${added} / ${total} ADDED`,
      canYouGetRarer: 'CAN YOU GET RARER?',
      upgradeDescription: (total) =>
        `Add up to ${total} optional traits to see how additional characteristics shift your estimated rarity in real time.`,
      keepGoing: 'KEEP GOING',
      currentLiveEstimate: (count) =>
        `CURRENT LIVE ESTIMATE (${count} CHARACTERISTICS)`,
      bonusCharacteristic: 'BONUS CHARACTERISTIC',
      activeInModel: 'ACTIVE IN MODEL',
      upgradeDisclaimer:
        'Note: Adding more characteristics increases dimensionality. Our model applies a correlation dampener so multi-trait estimates remain grounded as approximations rather than exact figures.',
      shareCardTag: 'SHAREABLE RARITY CARD',
      shareCardHeadline: 'Designed to screenshot or send to a friend.',
      shareCardBody:
        'Your card includes only the high-level statistical estimate and your 4-trait combination highlight. It never exposes your full questionnaire answers or personal identity.',
      noPiiStored: 'NO PII STORED',
      shareMyResult: 'SHARE MY RESULT',
      copyShareLink: 'COPY SHARE LINK',
      linkCopied: 'LINK COPIED',
      downloadRarityCard: 'DOWNLOAD RARITY CARD',
      renderingCard: 'RENDERING CARD...',
      statusLinkCopied: 'Share link copied to clipboard.',
      statusClipboardError: 'Could not access clipboard automatically.',
      statusCardDownloaded: 'Rarity card downloaded.',
      statusCardError: 'Unable to generate image card in this browser.',
      shareText: (rarity, twins) =>
        `My estimated statistical rarity is ${rarity} (with ${twins} estimated statistical twins on Earth). How rare are you?`,
      challengeTag: 'FRIEND CHALLENGE',
      thinkYoureRarer: "THINK YOU'RE RARER?",
      challengeDescription:
        "Send a challenge link to a friend. They'll see your estimated rarity score—without seeing your private answers—and find out how their combination compares.",
      optionalDisplayName: 'OPTIONAL DISPLAY NAME OR INITIALS',
      aliasPlaceholder: 'e.g. Alex',
      challengeAFriend: 'CHALLENGE A FRIEND',
      copyLink: 'COPY LINK',
      challengeLinkCopied: 'CHALLENGE LINK COPIED',
      challengeShareTitle: "Think you're rarer?",
      challengeShareText: (rarity) =>
        `My estimated combination is ${rarity}. Think you're rarer? Find out:`,
      incomingChallengeTag: 'INCOMING RARITY CHALLENGE',
      challengedYou: (name) => `${name} challenged you.`,
      someone: 'Someone',
      theirEstimatedRarity: 'THEIR ESTIMATED RARITY',
      theirRarestCombination: 'THEIR RAREST COMBINATION',
      estimatedOccurrenceLabel: 'Estimated occurrence:',
      challengeTakes60s:
        'Takes about 60 seconds · Your answers stay private in your browser.',
      incompleteChallengeBody:
        'This challenge link appears incomplete, but you can still discover your own estimated statistical rarity.',
      challengeComparisonTag: 'CHALLENGE COMPARISON',
      challengersRarity: (name) =>
        name ? `${name.toUpperCase()}’S ESTIMATED RARITY` : 'CHALLENGER’S ESTIMATED RARITY',
      comparisonRarer:
        'Your combination of characteristics is estimated to be statistically less common than your friend’s.',
      comparisonLessRare:
        'Your friend’s combination is estimated to be slightly less common in our reference model, though both profiles have distinct trait intersections.',
      comparisonTie:
        'Remarkably, you and your friend landed on the exact same estimated rarity tier.',
      sharedEstimateTag: 'SHARED RARITY ESTIMATE',
      sharedProfileSummary: (rarity, twins) =>
        `This shared profile is estimated to occur in roughly ${rarity} people, with approximately ${twins} estimated statistical twins on Earth.`,
      rarestInThisProfile: 'RAREST COMBINATION IN THIS PROFILE',
      sharedCtaTitle: 'How many people on Earth are actually like you?',
      sharedCtaSubtitle:
        'Take the 60-second interactive test to calculate your own combination.',
      findOutYourRarity: 'FIND OUT YOUR RARITY',
      insufficientDataTag: 'INSUFFICIENT DATA POINTS',
      insufficientDataHeadline:
        "You're unusual in ways we can't reliably measure yet.",
      insufficientDataSubtext: 'We need a little more information.',
      answerMoreQuestions: 'ANSWER MORE QUESTIONS',
      showBreakdown: (count) => `VIEW CHARACTERISTIC BREAKDOWN (${count})`,
      hideBreakdown: (count) => `HIDE CHARACTERISTIC BREAKDOWN (${count})`,
      changeAnswers: 'Change answers',
      howIsThisCalculated: 'How is this calculated?',
      startOver: 'START OVER',
      modelInputBreakdown: 'Model Input Breakdown',
      showingPrevalenceNote: 'Showing raw prevalence & covariance adjustments',
      baselineSuffix: 'baseline',
      correlationNotePrefix: 'Correlation note:',
      confidenceWord: 'Confidence',
    },
    confidenceLabels: {
      'HIGH CONFIDENCE': 'HIGH CONFIDENCE',
      'MEDIUM CONFIDENCE': 'MEDIUM CONFIDENCE',
      'LOW CONFIDENCE': 'LOW CONFIDENCE',
    },
    confidenceExplanations: {
      'HIGH CONFIDENCE':
        'Anchored primarily by broad demographic distributions with established baseline frequencies.',
      'MEDIUM CONFIDENCE':
        'Your estimate has moderate statistical uncertainty because some characteristics rely on broad population approximations.',
      'LOW CONFIDENCE':
        'This estimate spans a wider interval because multi-trait behavioral intersections carry higher statistical variance.',
    },
    narratives: {
      COMMON: {
        headline: "You're surprisingly typical.",
        summary:
          'Individually and in combination, your selected traits align closely with broad global majorities.',
      },
      UNCOMMON: {
        headline: "You're less common than you might expect.",
        summary:
          'While most of your individual answers are shared by millions, their overlap narrows the field considerably.',
      },
      RARE: {
        headline: 'Your combination starts getting unusual.',
        summary:
          'Only a small fraction of the reference population is estimated to share this specific intersection of traits.',
      },
      'VERY RARE': {
        headline: "That's a remarkably uncommon combination.",
        summary:
          'A few key overlaps in your profile filter out the vast majority of the global reference population.',
      },
      'EXTREMELY RARE': {
        headline: 'Your combination is difficult to find.',
        summary:
          'Across an estimated 8.1 billion people, this particular intersection of characteristics is statistically sparse.',
      },
    },
    pages: {
      about: {
        tag: 'ABOUT THIS EXPERIMENT',
        title: 'WHY DOES THIS EXIST?',
        lead: 'Most of the things that make you “you” aren’t particularly rare on their own.',
        bullet1: 'Your birthday isn’t that unusual.',
        bullet2: 'Your height isn’t that unusual.',
        bullet3: 'Your habits probably aren’t either.',
        combinationsDifferent: 'But combinations are different.',
        body1:
          'HOW RARE ARE YOU? explores how uncommon your particular combination of characteristics might be when layered across a reference model of ~8.1 billion people.',
        body2:
          'Rather than acting as a clinical assessment or personality diagnosis, it is an interactive statistical curiosity engine—designed to show how rapidly ordinary human traits intersect into something uncommon.',
        honestyTag: 'INTELLECTUAL HONESTY NOTE',
        honestyBody:
          'These results are estimates, not scientific diagnoses or exact measurements. Where exact global census counts do not exist for everyday habits, our model uses transparent population approximations and explicitly labels uncertainty.',
        cta: 'FIND OUT YOUR RARITY',
      },
      methodology: {
        tag: 'MODEL ARCHITECTURE & TRANSPARENCY',
        title: 'METHODOLOGY',
        subtitle:
          'How our statistical engine estimates combination rarity, handles correlated traits, and quantifies uncertainty.',
        card1Tag: '01. REFERENCE POPULATION',
        card1Title: 'How the population reference is defined',
        card1Body:
          'All estimates are normalized against a global human reference population of approximately 8.1 billion people. Estimated “statistical twins” represent the approximate number of people on Earth who would share an overlapping profile if the model distribution held uniformly.',
        card2Tag: '02. COMBINATION PROBABILITY',
        card2Title: 'Why combinations are difficult to calculate',
        card2Body:
          'In naive probability, independent events multiply: P(A and B) = P(A) × P(B). However, human beings are not independent coin flips. Multiplying twelve raw percentages blindly often exaggerates how rare someone is.',
        card3Tag: '03. COVARIANCE & CORRELATIONS',
        card3Title: 'How correlations between traits are handled',
        card3Body:
          'Our engine applies conditional probability dampeners for linked characteristics—such as night-owl chronotypes and sleeping past midnight, or region of birth and multilingualism—plus a high-dimensionality shrinkage factor for 9+ traits.',
        card4Tag: '04. EVIDENCE HIERARCHY',
        card4Title: 'Stronger evidence vs. broad estimates',
        card4Body:
          'Demographic and biological traits (birth month, regional cohort, handedness, eye color) have stronger empirical baselines than behavioral preferences (morning vs. night person, staying in vs. going out), which are modeled as prototype survey approximations.',
        rulesTitle: 'Active Dependency & Correlation Rules',
        rulesSubtitle:
          'When both traits in a rule below are selected, the engine adjusts the conditional probability to prevent double-counting overlapping characteristics:',
        conditionalAdjustmentSuffix: '× conditional adjustment',
        distributionsTitle: 'Attribute Distributions & Confidence Tiers',
        cta: 'TEST YOUR COMBINATION',
      },
      privacy: {
        tag: 'PRIVACY BY ARCHITECTURE',
        title: 'PRIVACY',
        quote: '“We don’t need to know who you are to calculate your result.”',
        card1Title: '1. 100% Client-Side Calculation',
        card1Body:
          'Your answers are evaluated directly inside your browser using our client-side statistical model. We do not transmit your raw questionnaire responses to a central profile database.',
        card2Title: '2. No Personal Identifiers Requested',
        card2Body:
          'We never ask for your full name, email address, phone number, exact street address, or exact date of birth. Even age and location are grouped into broad global cohorts.',
        card3Title: '3. Privacy-Safe Share Links',
        card3Body:
          'When you create a share link or friend challenge link, the URL token encodes only your final estimated rarity number and the 4-trait summary shown on your card—never your complete set of answers.',
        card4Title: '4. Local Session Storage',
        card4Body:
          'To prevent losing progress if you accidentally refresh the page during the questionnaire, your current selections are temporarily held in your browser’s sessionStorage and cleared whenever you reset the test.',
        cta: 'RETURN TO EXPERIMENT',
      },
      contact: {
        tag: 'INQUIRIES & DATASET CONTRIBUTIONS',
        title: 'CONTACT',
        body: 'Have feedback on a demographic distribution, want to suggest a new non-sensitive trait for the “Can You Get Rarer?” loop, or found an interesting statistical combination?',
        editorialLabel: 'EDITORIAL & RESEARCH',
        generalLabel: 'GENERAL & PRESS',
        cta: 'TAKE THE RARITY TEST',
      },
    },
    questions: {
      birthDecade: {
        prompt: 'Which period were you born in?',
        subtitle:
          'Broad cohorts help estimate demographic patterns without needing your exact birthday.',
        categoryLabel: 'demographics',
        options: {
          '2005_plus': { label: '2005 or later', shortTag: 'BORN 2005+', cardLabel: 'Born 2005 or later' },
          '1995_2004': { label: '1995 – 2004', shortTag: '1995–2004 COHORT', cardLabel: 'Born 1995–2004' },
          '1985_1994': { label: '1985 – 1994', shortTag: '1985–1994 COHORT', cardLabel: 'Born 1985–1994' },
          '1975_1984': { label: '1975 – 1984', shortTag: '1975–1984 COHORT', cardLabel: 'Born 1975–1984' },
          '1965_1974': { label: '1965 – 1974', shortTag: '1965–1974 COHORT', cardLabel: 'Born 1965–1974' },
          pre_1965: { label: 'Before 1965', shortTag: 'PRE-1965 COHORT', cardLabel: 'Born before 1965' },
        },
      },
      birthMonth: {
        prompt: 'What month were you born?',
        categoryLabel: 'demographics',
        options: {
          jan: { label: 'January', shortTag: 'JANUARY', cardLabel: 'Born in January' },
          feb: { label: 'February', shortTag: 'FEBRUARY', cardLabel: 'Born in February' },
          mar: { label: 'March', shortTag: 'MARCH', cardLabel: 'Born in March' },
          apr: { label: 'April', shortTag: 'APRIL', cardLabel: 'Born in April' },
          may: { label: 'May', shortTag: 'MAY', cardLabel: 'Born in May' },
          jun: { label: 'June', shortTag: 'JUNE', cardLabel: 'Born in June' },
          jul: { label: 'July', shortTag: 'JULY', cardLabel: 'Born in July' },
          aug: { label: 'August', shortTag: 'AUGUST', cardLabel: 'Born in August' },
          sep: { label: 'September', shortTag: 'SEPTEMBER', cardLabel: 'Born in September' },
          oct: { label: 'October', shortTag: 'OCTOBER', cardLabel: 'Born in October' },
          nov: { label: 'November', shortTag: 'NOVEMBER', cardLabel: 'Born in November' },
          dec: { label: 'December', shortTag: 'DECEMBER', cardLabel: 'Born in December' },
        },
      },
      birthRegion: {
        prompt: 'Which part of the world were you born in?',
        categoryLabel: 'demographics',
        options: {
          east_se_asia: { label: 'East or Southeast Asia', shortTag: 'EAST/SE ASIA', cardLabel: 'From East/SE Asia' },
          south_asia: { label: 'South Asia', shortTag: 'SOUTH ASIA', cardLabel: 'From South Asia' },
          europe: { label: 'Europe', shortTag: 'EUROPE', cardLabel: 'From Europe' },
          north_america: { label: 'North America', shortTag: 'NORTH AMERICA', cardLabel: 'From North America' },
          latin_america: { label: 'Latin America or Caribbean', shortTag: 'LATIN AMERICA', cardLabel: 'From Latin America' },
          sub_saharan_africa: { label: 'Sub-Saharan Africa', shortTag: 'SUB-SAHARAN AFRICA', cardLabel: 'From Sub-Saharan Africa' },
          mena: { label: 'Middle East or North Africa', shortTag: 'MENA REGION', cardLabel: 'From MENA region' },
          oceania: { label: 'Oceania', shortTag: 'OCEANIA', cardLabel: 'From Oceania' },
        },
      },
      handedness: {
        prompt: 'Which hand do you naturally write with?',
        categoryLabel: 'biology',
        options: {
          right: { label: 'Right-handed', shortTag: 'RIGHT-HANDED', cardLabel: 'Right-handed' },
          left: { label: 'Left-handed', shortTag: 'LEFT-HANDED', cardLabel: 'Left-handed' },
          ambidextrous: { label: 'Ambidextrous (Both equally)', shortTag: 'AMBIDEXTROUS', cardLabel: 'Ambidextrous' },
        },
      },
      siblings: {
        prompt: 'How many siblings do you have?',
        categoryLabel: 'demographics',
        options: {
          none: { label: 'None (Only child)', shortTag: 'ONLY CHILD', cardLabel: 'Only child' },
          one: { label: '1 sibling', shortTag: '1 SIBLING', cardLabel: '1 sibling' },
          two: { label: '2 siblings', shortTag: '2 SIBLINGS', cardLabel: '2 siblings' },
          three: { label: '3 siblings', shortTag: '3 SIBLINGS', cardLabel: '3 siblings' },
          four_plus: { label: '4 or more', shortTag: '4+ SIBLINGS', cardLabel: '4+ siblings' },
        },
      },
      heightRange: {
        prompt: 'Approximately how tall are you?',
        categoryLabel: 'biology',
        options: {
          under_160: { label: 'Under 160 cm', subtext: 'Under 5′3″', shortTag: 'UNDER 160CM', cardLabel: 'Under 160 cm tall' },
          '160_169': { label: '160 – 169 cm', subtext: '5′3″ – 5′6″', shortTag: '160–169CM', cardLabel: '160–169 cm tall' },
          '170_179': { label: '170 – 179 cm', subtext: '5′7″ – 5′10″', shortTag: '170–179CM', cardLabel: '170–179 cm tall' },
          '180_189': { label: '180 – 189 cm', subtext: '5′11″ – 6′2″', shortTag: '180–189CM', cardLabel: '180–189 cm tall' },
          '190_plus': { label: '190 cm or taller', subtext: '6′3″ or taller', shortTag: '190CM+ TALL', cardLabel: '190 cm+ tall' },
        },
      },
      chronotype: {
        prompt: 'Are you more of a morning person or a night person?',
        categoryLabel: 'chronobiology',
        options: {
          early_bird: { label: 'Definite morning person', shortTag: 'EARLY BIRD', cardLabel: 'Early bird' },
          morning_lean: { label: 'Mostly morning', shortTag: 'MORNING LEAN', cardLabel: 'Morning person' },
          intermediate: { label: 'Somewhere in the middle', shortTag: 'ADAPTABLE CLOCK', cardLabel: 'Mid-day chronotype' },
          night_owl: { label: 'Night owl', shortTag: 'NIGHT OWL', cardLabel: 'Night owl' },
          extreme_owl: { label: 'Extreme night owl', shortTag: 'EXTREME NIGHT OWL', cardLabel: 'Extreme night owl' },
        },
      },
      petPreference: {
        prompt: 'Do you prefer cats, dogs, both, or neither?',
        categoryLabel: 'behavior',
        options: {
          dogs: { label: 'Dogs', shortTag: 'DOG PERSON', cardLabel: 'Prefers dogs' },
          cats: { label: 'Cats', shortTag: 'CAT PERSON', cardLabel: 'Prefers cats' },
          both: { label: 'Both equally', shortTag: 'CATS & DOGS', cardLabel: 'Likes cats & dogs' },
          neither: { label: 'Neither', shortTag: 'NO PETS', cardLabel: 'Prefers neither pet' },
        },
      },
      languages: {
        prompt: 'How many languages can you hold a conversation in?',
        categoryLabel: 'culture',
        options: {
          one: { label: 'One language', shortTag: 'MONOLINGUAL', cardLabel: 'Speaks 1 language' },
          two: { label: 'Two languages', shortTag: 'BILINGUAL', cardLabel: 'Bilingual' },
          three: { label: 'Three languages', shortTag: 'TRILINGUAL', cardLabel: 'Trilingual' },
          four_plus: { label: 'Four or more', shortTag: 'POLYGLOT (4+)', cardLabel: 'Speaks 4+ languages' },
        },
      },
      coffeeHabit: {
        prompt: 'Do you drink coffee?',
        categoryLabel: 'behavior',
        options: {
          daily_multi: { label: 'Multiple cups every day', shortTag: 'HEAVY COFFEE', cardLabel: 'Multi-cup coffee drinker' },
          daily_one: { label: 'One cup a day', shortTag: 'DAILY COFFEE', cardLabel: 'Daily coffee drinker' },
          occasional: { label: 'Occasionally', shortTag: 'OCCASIONAL COFFEE', cardLabel: 'Occasional coffee' },
          tea_only: { label: 'No, I prefer tea', shortTag: 'TEA DEVOTEE', cardLabel: 'Tea over coffee' },
          none: { label: 'No caffeine at all', shortTag: 'CAFFEINE-FREE', cardLabel: 'Caffeine-free' },
        },
      },
      socialEnergy: {
        prompt: 'Do you prefer staying in or going out?',
        categoryLabel: 'behavior',
        options: {
          stay_in_always: { label: 'Almost always staying in', shortTag: 'HOMEBODY', cardLabel: 'Dedicated homebody' },
          stay_in_mostly: { label: 'Usually staying in', shortTag: 'QUIET EVENINGS', cardLabel: 'Prefers staying in' },
          balanced: { label: 'Equal mix of both', shortTag: 'AMBIVERT PACE', cardLabel: 'Balanced social energy' },
          go_out_mostly: { label: 'Usually going out', shortTag: 'OUTBOUND SOCIAL', cardLabel: 'Prefers going out' },
          go_out_always: { label: 'Always out whenever possible', shortTag: 'NIGHTLIFE REGULAR', cardLabel: 'Always going out' },
        },
      },
      sleepTime: {
        prompt: 'When do you usually go to sleep?',
        categoryLabel: 'chronobiology',
        options: {
          before_10pm: { label: 'Before 10:00 PM', shortTag: 'SLEEPS <10PM', cardLabel: 'Sleeps before 10 PM' },
          '10pm_midnight': { label: 'Between 10:00 PM and Midnight', shortTag: '10PM–12AM SLEEP', cardLabel: 'Sleeps 10 PM–Midnight' },
          midnight_2am: { label: 'Between Midnight and 2:00 AM', shortTag: 'PAST MIDNIGHT', cardLabel: 'Sleeps past midnight' },
          after_2am: { label: 'After 2:00 AM', shortTag: 'SLEEPS 2AM+', cardLabel: 'Sleeps after 2 AM' },
        },
      },
      eyeColor: {
        prompt: 'What color are your eyes?',
        categoryLabel: 'biology',
        options: {
          brown: { label: 'Brown', shortTag: 'BROWN EYES', cardLabel: 'Brown eyes' },
          blue: { label: 'Blue', shortTag: 'BLUE EYES', cardLabel: 'Blue eyes' },
          hazel: { label: 'Hazel', shortTag: 'HAZEL EYES', cardLabel: 'Hazel eyes' },
          amber: { label: 'Amber', shortTag: 'AMBER EYES', cardLabel: 'Amber eyes' },
          green: { label: 'Green', shortTag: 'GREEN EYES', cardLabel: 'Green eyes' },
          gray: { label: 'Gray', shortTag: 'GRAY EYES', cardLabel: 'Gray eyes' },
        },
      },
      cilantro: {
        prompt: 'How does cilantro (coriander leaf) taste to you?',
        categoryLabel: 'biology',
        options: {
          herbal: { label: 'Fresh and citrusy', shortTag: 'LIKES CILANTRO', cardLabel: 'Enjoys cilantro' },
          soap: { label: 'It tastes like soap', shortTag: 'CILANTRO = SOAP', cardLabel: 'Cilantro tastes like soap' },
          neutral: { label: 'Neutral / barely notice it', shortTag: 'CILANTRO NEUTRAL', cardLabel: 'Cilantro neutral' },
          never_tried: { label: 'Not sure / never tried it', shortTag: 'NO CILANTRO DATA', cardLabel: 'Unfamiliar with cilantro' },
        },
      },
      tongueRoll: {
        prompt: 'Can you roll your tongue into a tube?',
        categoryLabel: 'biology',
        options: {
          yes: { label: 'Yes, easily', shortTag: 'TONGUE ROLLER', cardLabel: 'Can roll tongue' },
          no: { label: 'No, not at all', shortTag: 'NON-ROLLER', cardLabel: 'Cannot roll tongue' },
          cloverleaf: { label: 'I can fold a cloverleaf shape', shortTag: 'CLOVERLEAF TONGUE', cardLabel: 'Cloverleaf tongue folder' },
        },
      },
      livedAbroad: {
        prompt: 'Have you lived in a country other than where you were born?',
        categoryLabel: 'culture',
        options: {
          never: { label: 'No, never', shortTag: 'DOMESTIC ROOTS', cardLabel: 'Lived in birth country' },
          under_1yr: { label: 'Yes, for less than a year', shortTag: 'BRIEF EXPAT', cardLabel: 'Lived abroad <1 year' },
          one_country: { label: 'Yes, in one other country', shortTag: '2-COUNTRY LIFE', cardLabel: 'Lived in 2 countries' },
          two_plus: { label: 'Yes, in two or more other countries', shortTag: 'GLOBAL NOMAD', cardLabel: 'Lived in 3+ countries' },
        },
      },
      seasonPreference: {
        prompt: 'Which season do you prefer most?',
        categoryLabel: 'behavior',
        options: {
          spring: { label: 'Spring', shortTag: 'SPRING PERSON', cardLabel: 'Prefers spring' },
          summer: { label: 'Summer', shortTag: 'SUMMER PERSON', cardLabel: 'Prefers summer' },
          autumn: { label: 'Autumn / Fall', shortTag: 'AUTUMN PERSON', cardLabel: 'Prefers autumn' },
          winter: { label: 'Winter', shortTag: 'WINTER PERSON', cardLabel: 'Prefers winter' },
        },
      },
      driversLicense: {
        prompt: 'Do you have a driver’s license?',
        categoryLabel: 'culture',
        options: {
          yes_regular: { label: 'Yes, I drive regularly', shortTag: 'REGULAR DRIVER', cardLabel: 'Regular driver' },
          yes_rarely: { label: 'Yes, but I rarely drive', shortTag: 'LICENSED NON-DRIVER', cardLabel: 'Licensed but rarely drives' },
          no_license: { label: 'No driver’s license', shortTag: 'NO LICENSE', cardLabel: 'No driver’s license' },
        },
      },
    },
  },

  es: {
    seo: {
      title: '¿Qué Tan Raro Eres? — Descubre Qué Tan Inusual Eres',
      description:
        'Hay miles de millones de personas en la Tierra. ¿Cuántas de ellas son realmente como tú? Haz el test interactivo y descubre tu rareza estadística estimada.',
      keywords:
        'qué tan raro eres, test de rareza estadística, calculadora de probabilidad humana, gemelo estadístico, comparación demográfica mundial, test interactivo de rasgos',
    },
    brand: {
      name: '¿QUÉ TAN RARO ERES?',
    },
    nav: {
      about: 'Acerca de',
      methodology: 'Metodología',
      privacy: 'Privacidad',
      contact: 'Contacto',
      home: 'Inicio',
      findOut: 'DESCUBRIR',
      languageLabel: 'Idioma',
    },
    footer: {
      privacyNote: 'No necesitamos saber quién eres para calcular tu resultado.',
      disclaimer:
        'Los resultados son estimaciones y no deben interpretarse como estadísticas poblacionales exactas.',
      modelMeta: 'Población de referencia: ~8,1 mil M · Modelo local en tu navegador',
    },
    hero: {
      titleLine1: '¿QUÉ TAN RARO',
      titleLine2: 'ERES TÚ?',
      subtitleLine1: 'Hay miles de millones de personas en la Tierra.',
      subtitleLine2: '¿Cuántas de ellas son realmente como tú?',
      ctaPrimary: 'DESCUBRIR',
      ctaResume: (count) => `CONTINUAR (${count}/12 RESPONDIDAS)`,
      ctaLastResult: 'VER ÚLTIMA ESTIMACIÓN',
      noAccountNote: 'Sin cuenta ni registro. Toma unos 60 segundos.',
      section01Tag: '01. La Matemática de las Combinaciones',
      commonBirthday: 'Tu mes de nacimiento es común.',
      commonHeight: 'Tu estatura es común.',
      commonHabits: 'Tus hábitos son comunes.',
      combineQuestion: '¿Pero qué pasa cuando los combinas?',
      combineBody:
        'Ahí es donde todo se vuelve interesante. Aunque cada respuesta individual sea compartida por cientos de millones de personas, la intersección de doce rasgos cotidianos reduce rápidamente todo el planeta al tamaño de un pueblo.',
      ctaSecondary: 'CALCULAR MI RAREZA',
      cascadeHeader: 'EJEMPLO DE CASCADA DE COMBINACIÓN',
      cascadePeopleSuffix: 'personas',
      cascadeHint:
        'Haz clic en cualquier nivel para ver cómo cada rasgo adicional reduce el grupo poblacional estimado.',
      cascadeSteps: [
        {
          trait: 'Población de referencia en la Tierra',
          prevalence: '100%',
          remaining: '~8.100.000.000',
          oneIn: '1 de 1',
        },
        {
          trait: '+ Nacido en noviembre',
          prevalence: '~8,0%',
          remaining: '~648.000.000',
          oneIn: '~1 de cada 12',
        },
        {
          trait: '+ Zurdo',
          prevalence: '~10,1%',
          remaining: '~65.400.000',
          oneIn: '~1 de cada 124',
        },
        {
          trait: '+ Habla 3 idiomas',
          prevalence: '~13,0%',
          remaining: '~8.500.000',
          oneIn: '~1 de cada 950',
        },
        {
          trait: '+ Noctámbulo + 2 hermanos + Toma té',
          prevalence: 'Cruce combinado',
          remaining: '~80.000',
          oneIn: '~1 de cada 101.000',
        },
      ],
      seoSectionTitle: 'EXPLORA TEMAS Y BÚSQUEDAS RELACIONADAS',
      seoGroup1Title: 'Tests de Rareza y Rasgos',
      seoGroup1Body:
        'Test qué tan raro soy · Calculadora de rareza estadística · Cuestionario de combinaciones humanas · Rasgos de 1 en un millón · Hábitos físicos y de comportamiento',
      seoGroup2Title: 'Población y Probabilidad',
      seoGroup2Body:
        'Comparación demográfica global · Buscador de gemelos estadísticos · Probabilidad de cumpleaños y zurdos · Superposición de población mundial · Curiosidad estadística',
      seoGroup3Title: 'Descubrimiento Interactivo',
      seoGroup3Body:
        'Juegos de autodescubrimiento · Visualización de datos interactiva · Experimentos compartibles de hábitos y personalidad · Compara tu rareza con amigos',
    },
    quiz: {
      questionPrefix: 'PREGUNTA',
      ofWord: 'DE',
      previous: 'ANTERIOR',
      keyboardHint: (maxKey) =>
        `Presiona 1–${maxKey} para elegir · Retroceso para volver`,
      localCalculationNote: 'Calculado localmente en tu navegador',
    },
    calculation: {
      tag: 'MODELO DE COMBINACIÓN ESTADÍSTICA',
      steps: [
        'Comparando tus respuestas...',
        'Buscando patrones...',
        'Calculando combinaciones...',
        'Construyendo tu estimación estadística...',
        'Una última cosa...',
      ],
      estimatingLabel: 'ESTIMANDO INTERSECCIÓN',
      skip: 'Saltar animación',
    },
    result: {
      weFoundSomething: 'ENCONTRAMOS ALGO.',
      yourEstimatedRarity: 'TU RAREZA ESTIMADA',
      demoEstimateModel: 'MODELO DE ESTIMACIÓN DEMO',
      estimatedLabel: 'ESTIMADO',
      occurrenceExplanationPrefix:
        'Esto significa que tu combinación de características ocurre aproximadamente en',
      occurrenceExplanationSuffix: 'personas.',
      estimatedPercentileLabel: 'PERCENTIL ESTIMADO',
      percentileExplanation: (pct) =>
        `Eres estadísticamente más inusual que aproximadamente el ${pct} de la población de referencia.`,
      estimatedRangeLabel: 'RANGO ESTIMADO',
      modelConfidenceLabel: 'CONFIANZA DEL MODELO',
      confidenceSummary: (traits, correlations) =>
        `Basado en ${traits} características y ${correlations} ajustes de correlación.`,
      intersectionHighlight: 'CRUCE DESTACADO',
      yourRarestCombination: 'TU COMBINACIÓN MÁS RARA',
      rarestComboExplanation:
        'El subconjunto más infrecuente de tus respuestas crea una de las intersecciones estadísticamente menos comunes de tu perfil.',
      individualEstPrefix: 'Est. individual:',
      subComboOccurrence: 'FRECUENCIA ESTIMADA DE ESTA SUBCOMBINACIÓN',
      howManyTitle: '¿CUÁNTOS HAY COMO TÚ?',
      howManyIntroLine1: 'Hay miles de millones de personas en la Tierra.',
      howManyIntroLine2: 'Según tus respuestas, estimamos que aproximadamente:',
      howManyOutro:
        'personas podrían compartir una combinación similar de características en la población mundial de referencia (~8,1 mil millones).',
      howManyFooter:
        'Calculado como una proporción aproximada del modelo global de referencia.',
      somewhereOnEarth: 'EN ALGÚN LUGAR DE LA TIERRA...',
      twinsHeadline: 'Probablemente tienes gemelos estadísticos.',
      twinsSubtext:
        'Personas cuyas respuestas coinciden con las tuyas en muchas características.',
      estimatedStatisticalTwins: 'GEMELOS ESTADÍSTICOS ESTIMADOS',
      twinsDisclaimer:
        'Estas son estimaciones estadísticas poblacionales, no individuos reales identificados.',
      upgradeLoopTag: (added, total) =>
        `RONDA OPCIONAL · ${added} / ${total} AÑADIDAS`,
      canYouGetRarer: '¿PUEDES SER AÚN MÁS RARO?',
      upgradeDescription: (total) =>
        `Añade hasta ${total} rasgos opcionales para ver cómo cambia tu rareza estimada en tiempo real.`,
      keepGoing: 'SEGUIR EXPLORANDO',
      currentLiveEstimate: (count) =>
        `ESTIMACIÓN EN VIVO (${count} CARACTERÍSTICAS)`,
      bonusCharacteristic: 'RASGO ADICIONAL',
      activeInModel: 'ACTIVO EN EL MODELO',
      upgradeDisclaimer:
        'Nota: Añadir más características aumenta la dimensionalidad. Nuestro modelo aplica un amortiguador de correlación para mantener las estimaciones realistas.',
      shareCardTag: 'TARJETA DE RAREZA COMPARTIBLE',
      shareCardHeadline: 'Diseñada para captura de pantalla o enviar a un amigo.',
      shareCardBody:
        'Tu tarjeta incluye únicamente la estimación estadística general y tus 4 rasgos más raros. Nunca expone todas tus respuestas ni tu identidad.',
      noPiiStored: 'SIN DATOS PERSONALES',
      shareMyResult: 'COMPARTIR MI RESULTADO',
      copyShareLink: 'COPIAR ENLACE',
      linkCopied: 'ENLACE COPIADO',
      downloadRarityCard: 'DESCARGAR TARJETA',
      renderingCard: 'GENERANDO TARJETA...',
      statusLinkCopied: 'Enlace copiado al portapapeles.',
      statusClipboardError: 'No se pudo copiar automáticamente.',
      statusCardDownloaded: 'Tarjeta descargada.',
      statusCardError: 'No se pudo generar la imagen en este navegador.',
      shareText: (rarity, twins) =>
        `Mi rareza estadística estimada es ${rarity} (con ${twins} gemelos estadísticos estimados en la Tierra). ¿Qué tan raro eres tú?`,
      challengeTag: 'RETO ENTRE AMIGOS',
      thinkYoureRarer: '¿CREES QUE ERES MÁS RARO?',
      challengeDescription:
        'Envía un enlace de reto a un amigo. Verá tu puntuación estimada —sin ver tus respuestas privadas— y descubrirá cómo se compara su combinación.',
      optionalDisplayName: 'NOMBRE O INICIALES (OPCIONAL)',
      aliasPlaceholder: 'ej. Alex',
      challengeAFriend: 'RETAR A UN AMIGO',
      copyLink: 'COPIAR ENLACE',
      challengeLinkCopied: 'ENLACE DE RETO COPIADO',
      challengeShareTitle: '¿Crees que eres más raro?',
      challengeShareText: (rarity) =>
        `Mi combinación estimada es ${rarity}. ¿Crees que eres más raro? Descúbrelo:`,
      incomingChallengeTag: 'RETO DE RAREZA RECIBIDO',
      challengedYou: (name) => `${name} te ha retado.`,
      someone: 'Alguien',
      theirEstimatedRarity: 'SU RAREZA ESTIMADA',
      theirRarestCombination: 'SU COMBINACIÓN MÁS RARA',
      estimatedOccurrenceLabel: 'Frecuencia estimada:',
      challengeTakes60s:
        'Toma unos 60 segundos · Tus respuestas permanecen privadas en tu navegador.',
      incompleteChallengeBody:
        'Este enlace de reto parece incompleto, pero aún puedes descubrir tu propia rareza estadística estimada.',
      challengeComparisonTag: 'COMPARACIÓN DEL RETO',
      challengersRarity: (name) =>
        name ? `RAREZA ESTIMADA DE ${name.toUpperCase()}` : 'RAREZA ESTIMADA DEL RETADOR',
      comparisonRarer:
        'Se estima que tu combinación de características es estadísticamente menos común que la de tu amigo.',
      comparisonLessRare:
        'La combinación de tu amigo es ligeramente menos común en nuestro modelo, aunque ambos perfiles tienen cruces únicos.',
      comparisonTie:
        'Sorprendentemente, tú y tu amigo obtuvieron exactamente el mismo nivel estimado de rareza.',
      sharedEstimateTag: 'ESTIMACIÓN DE RAREZA COMPARTIDA',
      sharedProfileSummary: (rarity, twins) =>
        `Se estima que este perfil compartido ocurre aproximadamente en ${rarity} personas, con unos ${twins} gemelos estadísticos en la Tierra.`,
      rarestInThisProfile: 'COMBINACIÓN MÁS RARA EN ESTE PERFIL',
      sharedCtaTitle: '¿Cuántas personas en la Tierra son realmente como tú?',
      sharedCtaSubtitle:
        'Haz el test interactivo de 60 segundos para calcular tu propia combinación.',
      findOutYourRarity: 'DESCUBRE TU RAREZA',
      insufficientDataTag: 'DATOS INSUFICIENTES',
      insufficientDataHeadline:
        'Eres inusual de formas que aún no podemos medir con fiabilidad.',
      insufficientDataSubtext: 'Necesitamos un poco más de información.',
      answerMoreQuestions: 'RESPONDER MÁS PREGUNTAS',
      showBreakdown: (count) => `VER DESGLOSE DE CARACTERÍSTICAS (${count})`,
      hideBreakdown: (count) => `OCULTAR DESGLOSE DE CARACTERÍSTICAS (${count})`,
      changeAnswers: 'Cambiar respuestas',
      howIsThisCalculated: '¿Cómo se calcula esto?',
      startOver: 'EMPEZAR DE NUEVO',
      modelInputBreakdown: 'Desglose del Modelo',
      showingPrevalenceNote: 'Mostrando prevalencia base y ajustes de covarianza',
      baselineSuffix: 'base',
      correlationNotePrefix: 'Nota de correlación:',
      confidenceWord: 'Confianza',
    },
    confidenceLabels: {
      'HIGH CONFIDENCE': 'CONFIANZA ALTA',
      'MEDIUM CONFIDENCE': 'CONFIANZA MEDIA',
      'LOW CONFIDENCE': 'CONFIANZA BAJA',
    },
    confidenceExplanations: {
      'HIGH CONFIDENCE':
        'Basado principalmente en distribuciones demográficas amplias con frecuencias base establecidas.',
      'MEDIUM CONFIDENCE':
        'Tu estimación tiene una incertidumbre estadística moderada porque algunas características se basan en aproximaciones poblacionales.',
      'LOW CONFIDENCE':
        'Esta estimación abarca un intervalo más amplio porque las intersecciones conductuales múltiples tienen mayor varianza.',
    },
    narratives: {
      COMMON: {
        headline: 'Eres sorprendentemente típico.',
        summary:
          'Tanto individualmente como en conjunto, tus rasgos seleccionados coinciden con amplias mayorías globales.',
      },
      UNCOMMON: {
        headline: 'Eres menos común de lo que imaginas.',
        summary:
          'Aunque millones comparten tus respuestas individuales, su superposición reduce considerablemente el grupo.',
      },
      RARE: {
        headline: 'Tu combinación empieza a ser inusual.',
        summary:
          'Solo una pequeña fracción de la población de referencia comparte esta intersección específica de rasgos.',
      },
      'VERY RARE': {
        headline: 'Esa es una combinación notablemente poco común.',
        summary:
          'Unos pocos cruces clave en tu perfil descartan a la gran mayoría de la población mundial de referencia.',
      },
      'EXTREMELY RARE': {
        headline: 'Tu combinación es difícil de encontrar.',
        summary:
          'Entre unos 8,1 mil millones de personas, esta intersección particular de características es estadísticamente escasa.',
      },
    },
    pages: {
      about: {
        tag: 'SOBRE ESTE EXPERIMENTO',
        title: '¿POR QUÉ EXISTE ESTO?',
        lead: 'La mayoría de las cosas que te hacen ser “tú” no son particularmente raras por sí solas.',
        bullet1: 'Tu cumpleaños no es tan inusual.',
        bullet2: 'Tu estatura no es tan inusual.',
        bullet3: 'Tus hábitos probablemente tampoco lo sean.',
        combinationsDifferent: 'Pero las combinaciones son diferentes.',
        body1:
          '¿QUÉ TAN RARO ERES? explora qué tan poco común puede ser tu combinación particular de características al proyectarla sobre un modelo de referencia de ~8,1 mil millones de personas.',
        body2:
          'En lugar de ser un diagnóstico clínico o un test psicológico definitivo, es un motor interactivo de curiosidad estadística diseñado para mostrar cómo rasgos cotidianos se cruzan rápidamente en algo inusual.',
        honestyTag: 'NOTA DE HONESTIDAD INTELECTUAL',
        honestyBody:
          'Estos resultados son estimaciones, no diagnósticos científicos ni mediciones exactas. Donde no existen censos globales exactos sobre hábitos cotidianos, nuestro modelo utiliza aproximaciones transparentes e indica explícitamente la incertidumbre.',
        cta: 'DESCUBRIR MI RAREZA',
      },
      methodology: {
        tag: 'ARQUITECTURA Y TRANSPARENCIA DEL MODELO',
        title: 'METODOLOGÍA',
        subtitle:
          'Cómo nuestro motor estadístico estima la rareza de combinaciones, gestiona rasgos correlacionados y cuantifica la incertidumbre.',
        card1Tag: '01. POBLACIÓN DE REFERENCIA',
        card1Title: 'Cómo se define la población de referencia',
        card1Body:
          'Todas las estimaciones se normalizan frente a una población humana global de aproximadamente 8,1 mil millones de personas. Los “gemelos estadísticos” representan el número aproximado de personas que compartirían un perfil similar.',
        card2Tag: '02. PROBABILIDAD COMBINADA',
        card2Title: 'Por qué es difícil calcular combinaciones',
        card2Body:
          'En probabilidad simple, los eventos independientes se multiplican: P(A y B) = P(A) × P(B). Sin embargo, los seres humanos no somos monedas al aire independientes.',
        card3Tag: '03. COVARIANZA Y CORRELACIONES',
        card3Title: 'Cómo se manejan las correlaciones entre rasgos',
        card3Body:
          'Nuestro motor aplica amortiguadores de probabilidad condicional para rasgos vinculados —como ser noctámbulo y dormir después de medianoche, o la región de nacimiento y el multilingüismo—.',
        card4Tag: '04. JERARQUÍA DE EVIDENCIA',
        card4Title: 'Evidencia sólida frente a estimaciones amplias',
        card4Body:
          'Los rasgos demográficos y biológicos (mes de nacimiento, región, lateralidad, color de ojos) tienen bases empíricas más sólidas que las preferencias conductuales.',
        rulesTitle: 'Reglas Activas de Dependencia y Correlación',
        rulesSubtitle:
          'Cuando se seleccionan ambos rasgos de una regla, el motor ajusta la probabilidad condicional para evitar contar dos veces características superpuestas:',
        conditionalAdjustmentSuffix: '× ajuste condicional',
        distributionsTitle: 'Distribuciones de Atributos y Niveles de Confianza',
        cta: 'PROBAR MI COMBINACIÓN',
      },
      privacy: {
        tag: 'PRIVACIDAD POR ARQUITECTURA',
        title: 'PRIVACIDAD',
        quote: '“No necesitamos saber quién eres para calcular tu resultado.”',
        card1Title: '1. Cálculo 100% en tu Navegador',
        card1Body:
          'Tus respuestas se evalúan directamente en tu navegador mediante nuestro modelo estadístico local. No enviamos tus respuestas individuales a ninguna base de datos central.',
        card2Title: '2. Sin Datos Personales Identificables',
        card2Body:
          'Nunca pedimos tu nombre completo, correo electrónico, teléfono, dirección exacta ni fecha exacta de nacimiento. La edad y ubicación se agrupan en cohortes amplias.',
        card3Title: '3. Enlaces para Compartir Seguros',
        card3Body:
          'Cuando creas un enlace para compartir o retar a un amigo, el código del enlace solo incluye tu número estimado de rareza y los 4 rasgos destacados de tu tarjeta.',
        card4Title: '4. Almacenamiento Temporal de Sesión',
        card4Body:
          'Para evitar que pierdas tu progreso si recargas la página durante el cuestionario, tus selecciones se guardan temporalmente en sessionStorage de tu navegador.',
        cta: 'VOLVER AL EXPERIMENTO',
      },
      contact: {
        tag: 'CONSULTAS Y CONTRIBUCIONES DE DATOS',
        title: 'CONTACTO',
        body: '¿Tienes comentarios sobre una distribución demográfica, quieres sugerir un nuevo rasgo para la ronda “¿Puedes ser aún más raro?” o encontraste una combinación interesante?',
        editorialLabel: 'INVESTIGACIÓN Y DATOS',
        generalLabel: 'GENERAL Y PRENSA',
        cta: 'HACER EL TEST DE RAREZA',
      },
    },
    questions: {
      birthDecade: {
        prompt: '¿En qué periodo naciste?',
        subtitle:
          'Las cohortes amplias ayudan a estimar patrones demográficos sin necesitar tu fecha exacta de nacimiento.',
        categoryLabel: 'demografía',
        options: {
          '2005_plus': { label: '2005 o después', shortTag: 'NACIDO 2005+', cardLabel: 'Nacido en 2005 o después' },
          '1995_2004': { label: '1995 – 2004', shortTag: 'COHORTE 1995–2004', cardLabel: 'Nacido entre 1995–2004' },
          '1985_1994': { label: '1985 – 1994', shortTag: 'COHORTE 1985–1994', cardLabel: 'Nacido entre 1985–1994' },
          '1975_1984': { label: '1975 – 1984', shortTag: 'COHORTE 1975–1984', cardLabel: 'Nacido entre 1975–1984' },
          '1965_1974': { label: '1965 – 1974', shortTag: 'COHORTE 1965–1974', cardLabel: 'Nacido entre 1965–1974' },
          pre_1965: { label: 'Antes de 1965', shortTag: 'ANTES DE 1965', cardLabel: 'Nacido antes de 1965' },
        },
      },
      birthMonth: {
        prompt: '¿En qué mes naciste?',
        categoryLabel: 'demografía',
        options: {
          jan: { label: 'Enero', shortTag: 'ENERO', cardLabel: 'Nacido en enero' },
          feb: { label: 'Febrero', shortTag: 'FEBRERO', cardLabel: 'Nacido en febrero' },
          mar: { label: 'Marzo', shortTag: 'MARZO', cardLabel: 'Nacido en marzo' },
          apr: { label: 'Abril', shortTag: 'ABRIL', cardLabel: 'Nacido en abril' },
          may: { label: 'Mayo', shortTag: 'MAYO', cardLabel: 'Nacido en mayo' },
          jun: { label: ' Junio', shortTag: 'JUNIO', cardLabel: 'Nacido en junio' },
          jul: { label: 'Julio', shortTag: 'JULIO', cardLabel: 'Nacido en julio' },
          aug: { label: 'Agosto', shortTag: 'AGOSTO', cardLabel: 'Nacido en agosto' },
          sep: { label: 'Septiembre', shortTag: 'SEPTIEMBRE', cardLabel: 'Nacido en septiembre' },
          oct: { label: 'Octubre', shortTag: 'OCTUBRE', cardLabel: 'Nacido en octubre' },
          nov: { label: 'Noviembre', shortTag: 'NOVIEMBRE', cardLabel: 'Nacido en noviembre' },
          dec: { label: 'Diciembre', shortTag: 'DICIEMBRE', cardLabel: 'Nacido en diciembre' },
        },
      },
      birthRegion: {
        prompt: '¿En qué región del mundo naciste?',
        categoryLabel: 'demografía',
        options: {
          east_se_asia: { label: 'Asia Oriental o Sudeste Asiático', shortTag: 'ASIA ORIENTAL/SE', cardLabel: 'De Asia Oriental/SE' },
          south_asia: { label: 'Asia del Sur', shortTag: 'ASIA DEL SUR', cardLabel: 'De Asia del Sur' },
          europe: { label: 'Europa', shortTag: 'EUROPA', cardLabel: 'De Europa' },
          north_america: { label: 'Norteamérica', shortTag: 'NORTEAMÉRICA', cardLabel: 'De Norteamérica' },
          latin_america: { label: 'América Latina o el Caribe', shortTag: 'LATINOAMÉRICA', cardLabel: 'De Latinoamérica' },
          sub_saharan_africa: { label: 'África Subsahariana', shortTag: 'ÁFRICA SUBSAHARIANA', cardLabel: 'De África Subsahariana' },
          mena: { label: 'Medio Oriente o Norte de África', shortTag: 'REGIÓN MENA', cardLabel: 'De Medio Oriente/Norte de África' },
          oceania: { label: 'Oceanía', shortTag: 'OCEANÍA', cardLabel: 'De Oceanía' },
        },
      },
      handedness: {
        prompt: '¿Con qué mano escribes de forma natural?',
        categoryLabel: 'biología',
        options: {
          right: { label: 'Diestro (mano derecha)', shortTag: 'DIESTRO', cardLabel: 'Diestro' },
          left: { label: 'Zurdo (mano izquierda)', shortTag: 'ZURDO', cardLabel: 'Zurdo' },
          ambidextrous: { label: 'Ambidiestro (ambas por igual)', shortTag: 'AMBIDIESTRO', cardLabel: 'Ambidiestro' },
        },
      },
      siblings: {
        prompt: '¿Cuántos hermanos o hermanas tienes?',
        categoryLabel: 'demografía',
        options: {
          none: { label: 'Ninguno (hijo único)', shortTag: 'HIJO ÚNICO', cardLabel: 'Hijo único' },
          one: { label: '1 hermano/a', shortTag: '1 HERMANO', cardLabel: '1 hermano/a' },
          two: { label: '2 hermanos', shortTag: '2 HERMANOS', cardLabel: '2 hermanos' },
          three: { label: '3 hermanos', shortTag: '3 HERMANOS', cardLabel: '3 hermanos' },
          four_plus: { label: '4 o más', shortTag: '4+ HERMANOS', cardLabel: '4+ hermanos' },
        },
      },
      heightRange: {
        prompt: '¿Cuánto mides aproximadamente?',
        categoryLabel: 'biología',
        options: {
          under_160: { label: 'Menos de 160 cm', subtext: 'Menos de 5′3″', shortTag: '<160 CM', cardLabel: 'Menos de 160 cm' },
          '160_169': { label: '160 – 169 cm', subtext: '5′3″ – 5′6″', shortTag: '160–169 CM', cardLabel: '160–169 cm de estatura' },
          '170_179': { label: '170 – 179 cm', subtext: '5′7″ – 5′10″', shortTag: '170–179 CM', cardLabel: '170–179 cm de estatura' },
          '180_189': { label: '180 – 189 cm', subtext: '5′11″ – 6′2″', shortTag: '180–189 CM', cardLabel: '180–189 cm de estatura' },
          '190_plus': { label: '190 cm o más', subtext: '6′3″ o más', shortTag: '190+ CM', cardLabel: '190 cm o más de estatura' },
        },
      },
      chronotype: {
        prompt: '¿Eres más una persona mañanera o nocturna?',
        categoryLabel: 'cronobiología',
        options: {
          early_bird: { label: 'Definitivamente madrugador', shortTag: 'MADRUGADOR', cardLabel: 'Madrugador' },
          morning_lean: { label: 'Más bien de mañana', shortTag: 'MAÑANERO', cardLabel: 'Persona mañanera' },
          intermediate: { label: 'En un punto intermedio', shortTag: 'RITMO INTERMEDIO', cardLabel: 'Cronotipo intermedio' },
          night_owl: { label: 'Noctámbulo', shortTag: 'NOCTÁMBULO', cardLabel: 'Noctámbulo' },
          extreme_owl: { label: 'Noctámbulo extremo', shortTag: 'NOCTÁMBULO EXTREMO', cardLabel: 'Noctámbulo extremo' },
        },
      },
      petPreference: {
        prompt: '¿Prefieres los gatos, los perros, ambos o ninguno?',
        categoryLabel: 'comportamiento',
        options: {
          dogs: { label: 'Perros', shortTag: 'TEAM PERROS', cardLabel: 'Prefiere los perros' },
          cats: { label: 'Gatos', shortTag: 'TEAM GATOS', cardLabel: 'Prefiere los gatos' },
          both: { label: 'Ambos por igual', shortTag: 'PERROS Y GATOS', cardLabel: 'Le gustan perros y gatos' },
          neither: { label: 'Ninguno', shortTag: 'SIN MASCOTAS', cardLabel: 'No prefiere mascotas' },
        },
      },
      languages: {
        prompt: '¿En cuántos idiomas puedes mantener una conversación?',
        categoryLabel: 'cultura',
        options: {
          one: { label: 'Un idioma', shortTag: 'MONOLINGÜE', cardLabel: 'Habla 1 idioma' },
          two: { label: 'Dos idiomas', shortTag: 'BILINGÜE', cardLabel: 'Bilingüe' },
          three: { label: 'Tres idiomas', shortTag: 'TRILINGÜE', cardLabel: 'Trilingüe' },
          four_plus: { label: 'Cuatro o más', shortTag: 'POLÍGLOTA (4+)', cardLabel: 'Habla 4+ idiomas' },
        },
      },
      coffeeHabit: {
        prompt: '¿Tomas café?',
        categoryLabel: 'comportamiento',
        options: {
          daily_multi: { label: 'Varias tazas todos los días', shortTag: 'MUCHO CAFÉ', cardLabel: 'Varias tazas de café al día' },
          daily_one: { label: 'Una taza al día', shortTag: 'CAFÉ DIARIO', cardLabel: 'Una taza de café al día' },
          occasional: { label: 'Ocasionalmente', shortTag: 'CAFÉ OCASIONAL', cardLabel: 'Café ocasional' },
          tea_only: { label: 'No, prefiero el té', shortTag: 'AMANTE DEL TÉ', cardLabel: 'Prefiere el té al café' },
          none: { label: 'Nada de cafeína', shortTag: 'SIN CAFEÍNA', cardLabel: 'Sin cafeína' },
        },
      },
      socialEnergy: {
        prompt: '¿Prefieres quedarte en casa o salir?',
        categoryLabel: 'comportamiento',
        options: {
          stay_in_always: { label: 'Casi siempre quedarme en casa', shortTag: 'HOGAREÑO', cardLabel: 'Muy hogareño' },
          stay_in_mostly: { label: 'Normalmente quedarme en casa', shortTag: 'NOCHES TRANQUILAS', cardLabel: 'Prefiere quedarse en casa' },
          balanced: { label: 'Mitad y mitad', shortTag: 'EQUILIBRADO', cardLabel: 'Energía social equilibrada' },
          go_out_mostly: { label: 'Normalmente salir', shortTag: 'SOCIABLE', cardLabel: 'Prefiere salir' },
          go_out_always: { label: 'Salir siempre que sea posible', shortTag: 'VIDA NOCTURNA', cardLabel: 'Siempre sale' },
        },
      },
      sleepTime: {
        prompt: '¿A qué hora sueles dormirte?',
        categoryLabel: 'cronobiología',
        options: {
          before_10pm: { label: 'Antes de las 10:00 PM', shortTag: 'DUERME <10PM', cardLabel: 'Duerme antes de las 10 PM' },
          '10pm_midnight': { label: 'Entre las 10:00 PM y medianoche', shortTag: 'DUERME 10PM–12AM', cardLabel: 'Duerme entre 10 PM y 12 AM' },
          midnight_2am: { label: 'Entre medianoche y las 2:00 AM', shortTag: 'DESPUÉS DE MEDIANOCHE', cardLabel: 'Duerme pasada la medianoche' },
          after_2am: { label: 'Después de las 2:00 AM', shortTag: 'DUERME 2AM+', cardLabel: 'Duerme después de las 2 AM' },
        },
      },
      eyeColor: {
        prompt: '¿De qué color son tus ojos?',
        categoryLabel: 'biología',
        options: {
          brown: { label: 'Marrones / cafés', shortTag: 'OJOS MARRONES', cardLabel: 'Ojos marrones' },
          blue: { label: 'Azules', shortTag: 'OJOS AZULES', cardLabel: 'Ojos azules' },
          hazel: { label: 'Avellana (pardos)', shortTag: 'OJOS AVELLANA', cardLabel: 'Ojos avellana' },
          amber: { label: 'Ámbar / miel', shortTag: 'OJOS ÁMBAR', cardLabel: 'Ojos ámbar' },
          green: { label: 'Verdes', shortTag: 'OJOS VERDES', cardLabel: 'Ojos verdes' },
          gray: { label: 'Grises', shortTag: 'OJOS GRISES', cardLabel: 'Ojos grises' },
        },
      },
      cilantro: {
        prompt: '¿A qué te sabe el cilantro fresco?',
        categoryLabel: 'biología',
        options: {
          herbal: { label: 'Fresco y cítrico', shortTag: 'AMA EL CILANTRO', cardLabel: 'Disfruta el cilantro' },
          soap: { label: 'Me sabe a jabón', shortTag: 'CILANTRO = JABÓN', cardLabel: 'El cilantro le sabe a jabón' },
          neutral: { label: 'Neutro / apenas lo noto', shortTag: 'CILANTRO NEUTRO', cardLabel: 'Neutral ante el cilantro' },
          never_tried: { label: 'No estoy seguro / nunca lo probé', shortTag: 'SIN DATO CILANTRO', cardLabel: 'No conoce el cilantro' },
        },
      },
      tongueRoll: {
        prompt: '¿Puedes enrollar la lengua en forma de tubo?',
        categoryLabel: 'biología',
        options: {
          yes: { label: 'Sí, fácilmente', shortTag: 'ENROLLA LA LENGUA', cardLabel: 'Puede enrollar la lengua' },
          no: { label: 'No, para nada', shortTag: 'NO ENROLLA LENGUA', cardLabel: 'No puede enrollar la lengua' },
          cloverleaf: { label: 'Puedo hacer forma de trébol', shortTag: 'LENGUA EN TRÉBOL', cardLabel: 'Lengua en forma de trébol' },
        },
      },
      livedAbroad: {
        prompt: '¿Has vivido en otro país distinto al que naciste?',
        categoryLabel: 'cultura',
        options: {
          never: { label: 'No, nunca', shortTag: 'RAÍCES LOCALES', cardLabel: 'Siempre en su país natal' },
          under_1yr: { label: 'Sí, por menos de un año', shortTag: 'EXPAT BREVE', cardLabel: 'Vivió <1 año en el extranjero' },
          one_country: { label: 'Sí, en otro país', shortTag: 'VIDA EN 2 PAÍSES', cardLabel: 'Ha vivido en 2 países' },
          two_plus: { label: 'Sí, en dos o más países distintos', shortTag: 'NÓMADA GLOBAL', cardLabel: 'Ha vivido en 3+ países' },
        },
      },
      seasonPreference: {
        prompt: '¿Qué estación del año prefieres más?',
        categoryLabel: 'comportamiento',
        options: {
          spring: { label: 'Primavera', shortTag: 'PRIMAVERA', cardLabel: 'Prefiere la primavera' },
          summer: { label: 'Verano', shortTag: 'VERANO', cardLabel: 'Prefiere el verano' },
          autumn: { label: 'Otoño', shortTag: 'OTOÑO', cardLabel: 'Prefiere el otoño' },
          winter: { label: 'Invierno', shortTag: 'INVIERNO', cardLabel: 'Prefiere el invierno' },
        },
      },
      driversLicense: {
        prompt: '¿Tienes licencia de conducir?',
        categoryLabel: 'cultura',
        options: {
          yes_regular: { label: 'Sí, conduzco con regularidad', shortTag: 'CONDUCTOR HABITUAL', cardLabel: 'Conduce regularmente' },
          yes_rarely: { label: 'Sí, pero rara vez conduzco', shortTag: 'CON LICENCIA SIN USO', cardLabel: 'Con licencia pero casi no conduce' },
          no_license: { label: 'No tengo licencia de conducir', shortTag: 'SIN LICENCIA', cardLabel: 'Sin licencia de conducir' },
        },
      },
    },
  },

  de: {
    seo: {
      title: 'Wie Selten Bist Du? — Finde Heraus, Wie Ungewöhnlich Du Bist',
      description:
        'Es gibt Milliarden Menschen auf der Erde. Wie viele davon sind eigentlich so wie du? Mach den interaktiven Seltenheitstest und entdecke deine geschätzte statistische Seltenheit.',
      keywords:
        'wie selten bist du, wie selten bin ich test, statistischer seltenheitsrechner, merkmalskombination quiz, statistischer zwilling, bevölkerungsvergleich',
    },
    brand: {
      name: 'WIE SELTEN BIST DU?',
    },
    nav: {
      about: 'Über uns',
      methodology: 'Methodik',
      privacy: 'Datenschutz',
      contact: 'Kontakt',
      home: 'Start',
      findOut: 'FINDE ES HERAUS',
      languageLabel: 'Sprache',
    },
    footer: {
      privacyNote:
        'Wir müssen nicht wissen, wer du bist, um dein Ergebnis zu berechnen.',
      disclaimer:
        'Alle Ergebnisse sind statistische Schätzungen und keine exakten Bevölkerungsmessungen.',
      modelMeta: 'Referenzbevölkerung: ~8,1 Mrd. · Lokales Browser-Modell',
    },
    hero: {
      titleLine1: 'WIE SELTEN',
      titleLine2: 'BIST DU?',
      subtitleLine1: 'Es gibt Milliarden Menschen auf der Erde.',
      subtitleLine2: 'Wie viele davon sind eigentlich so wie du?',
      ctaPrimary: 'FINDE ES HERAUS',
      ctaResume: (count) => `FORTSETZEN (${count}/12 BEANTWORTET)`,
      ctaLastResult: 'LETZTE SCHÄTZUNG ANSEHEN',
      noAccountNote: 'Kein Konto erforderlich. Dauert etwa 60 Sekunden.',
      section01Tag: '01. Die Mathematik der Überschneidung',
      commonBirthday: 'Dein Geburtsmonat ist gewöhnlich.',
      commonHeight: 'Deine Körpergröße ist gewöhnlich.',
      commonHabits: 'Deine Gewohnheiten sind gewöhnlich.',
      combineQuestion: 'Aber was passiert, wenn man sie kombiniert?',
      combineBody:
        'Genau hier wird es spannend. Selbst wenn jede einzelne deiner Antworten von Hunderten Millionen Menschen geteilt wird, schrumpft die Schnittmenge aus zwölf alltäglichen Merkmalen die gesamte Weltbevölkerung schnell auf die Größe einer Kleinstadt.',
      ctaSecondary: 'MEINE SELTENHEIT BERECHNEN',
      cascadeHeader: 'BEISPIEL EINER KOMBINATIONS-KASKADE',
      cascadePeopleSuffix: 'Menschen',
      cascadeHint:
        'Klicke auf eine Ebene, um zu sehen, wie jedes weitere Merkmal die geschätzte Bevölkerungsgruppe verkleinert.',
      cascadeSteps: [
        {
          trait: 'Referenzbevölkerung auf der Erde',
          prevalence: '100%',
          remaining: '~8.100.000.000',
          oneIn: '1 von 1',
        },
        {
          trait: '+ Geboren im November',
          prevalence: '~8,0%',
          remaining: '~648.000.000',
          oneIn: '~1 von 12',
        },
        {
          trait: '+ Linkshändig',
          prevalence: '~10,1%',
          remaining: '~65.400.000',
          oneIn: '~1 von 124',
        },
        {
          trait: '+ Spricht 3 Sprachen',
          prevalence: '~13,0%',
          remaining: '~8.500.000',
          oneIn: '~1 von 950',
        },
        {
          trait: '+ Nachteule + 2 Geschwister + Teetrinker',
          prevalence: 'Kombinierte Schnittmenge',
          remaining: '~80.000',
          oneIn: '~1 von 101.000',
        },
      ],
      seoSectionTitle: 'VERWANDTE THEMEN & SUCHBEGRIFFE ENTDECKEN',
      seoGroup1Title: 'Seltenheits- & Merkmalstests',
      seoGroup1Body:
        'Wie selten bin ich Test · Statistischer Seltenheitsrechner · Menschliche Merkmalskombination Quiz · 1-zu-einer-Million Eigenschaften · Ungewöhnliche Gewohnheiten',
      seoGroup2Title: 'Bevölkerung & Wahrscheinlichkeit',
      seoGroup2Body:
        'Globaler Demografie-Vergleich · Statistischer Zwilling Finder · Geburtstags- & Linkshänder-Wahrscheinlichkeit · Weltbevölkerung Schnittmenge',
      seoGroup3Title: 'Interaktive Entdeckung',
      seoGroup3Body:
        'Selbstentdeckungsspiele · Interaktive Datenvisualisierung · Teilbare Persönlichkeits- & Gewohnheitsexperimente · Seltenheit mit Freunden vergleichen',
    },
    quiz: {
      questionPrefix: 'FRAGE',
      ofWord: 'VON',
      previous: 'ZURÜCK',
      keyboardHint: (maxKey) =>
        `Tasten 1–${maxKey} zur Auswahl · Rücktaste für Zurück`,
      localCalculationNote: 'Lokal in deinem Browser berechnet',
    },
    calculation: {
      tag: 'STATISTISCHES KOMBINATIONSMODELL',
      steps: [
        'Deine Antworten werden verglichen...',
        'Muster werden erkannt...',
        'Kombinationen werden berechnet...',
        'Deine statistische Schätzung wird erstellt...',
        'Noch ein letzter Schritt...',
      ],
      estimatingLabel: 'SCHNITTMENGE WIRD GESCHÄTZT',
      skip: 'Animation überspringen',
    },
    result: {
      weFoundSomething: 'WIR HABEN ETWAS GEFUNDEN.',
      yourEstimatedRarity: 'DEINE GESCHÄTZTE SELTENHEIT',
      demoEstimateModel: 'DEMO-SCHÄTZMODELL',
      estimatedLabel: 'GESCHÄTZT',
      occurrenceExplanationPrefix:
        'Das bedeutet, dass deine Merkmalskombination schätzungsweise bei etwa',
      occurrenceExplanationSuffix: 'Menschen vorkommt.',
      estimatedPercentileLabel: 'GESCHÄTZTES PERZENTIL',
      percentileExplanation: (pct) =>
        `Du bist statistisch ungewöhnlicher als etwa ${pct} der Referenzbevölkerung.`,
      estimatedRangeLabel: 'GESCHÄTZTER BEREICH',
      modelConfidenceLabel: 'MODELL-KONFIDENZ',
      confidenceSummary: (traits, correlations) =>
        `Basierend auf ${traits} Merkmalen und ${correlations} Korrelationsanpassungen.`,
      intersectionHighlight: 'SCHNITTMENGEN-HIGHLIGHT',
      yourRarestCombination: 'DEINE SELTENSTE KOMBINATION',
      rarestComboExplanation:
        'Deine seltenste Teilmenge sich überschneidender Antworten bildet eine der statistisch ungewöhnlichsten Schnittmengen in deinem Profil.',
      individualEstPrefix: 'Einzelschätzung:',
      subComboOccurrence: 'GESCHÄTZTES VORKOMMEN DIESER TEILKOMBINATION',
      howManyTitle: 'WIE VIELE GIBT ES WIE DICH?',
      howManyIntroLine1: 'Es gibt Milliarden Menschen auf der Erde.',
      howManyIntroLine2: 'Anhand deiner Antworten schätzen wir, dass etwa:',
      howManyOutro:
        'Menschen innerhalb der globalen Referenzbevölkerung (~8,1 Milliarden) eine ähnliche Merkmalskombination teilen.',
      howManyFooter:
        'Berechnet als ungefähre Proportion des globalen Referenzmodells.',
      somewhereOnEarth: 'IRGENDWO AUF DER ERDE...',
      twinsHeadline: 'Du hast wahrscheinlich statistische Zwillinge.',
      twinsSubtext:
        'Menschen, deren Antworten sich in vielen Merkmalen mit deinen überschneiden.',
      estimatedStatisticalTwins: 'GESCHÄTZTE STATISTISCHE ZWILLINGE',
      twinsDisclaimer:
        'Dies sind statistische Bevölkerungsschätzungen, keine identifizierten realen Personen.',
      upgradeLoopTag: (added, total) =>
        `OPTIONALE ZWEITE RUNDE · ${added} / ${total} HINZUGEFÜGT`,
      canYouGetRarer: 'KANNST DU NOCH SELTENER WERDEN?',
      upgradeDescription: (total) =>
        `Füge bis zu ${total} optionale Merkmale hinzu, um live zu sehen, wie sich deine geschätzte Seltenheit verändert.`,
      keepGoing: 'WEITERMACHEN',
      currentLiveEstimate: (count) =>
        `AKTUELLE LIVE-SCHÄTZUNG (${count} MERKMALE)`,
      bonusCharacteristic: 'BONUS-MERKMAL',
      activeInModel: 'AKTIV IM MODELL',
      upgradeDisclaimer:
        'Hinweis: Weitere Merkmale erhöhen die Dimensionalität. Unser Modell nutzt eine Korrelationsdämpfung, damit Schätzungen realistisch bleiben.',
      shareCardTag: 'TEILBARE SELTENHEITSKARTE',
      shareCardHeadline: 'Für Screenshots oder zum Teilen mit Freunden gemacht.',
      shareCardBody:
        'Deine Karte zeigt nur die statistische Gesamtschätzung und deine 4 seltensten kombinierten Merkmale. Deine vollständigen Antworten bleiben privat.',
      noPiiStored: 'KEINE PERSÖNLICHEN DATEN',
      shareMyResult: 'MEIN ERGEBNIS TEILEN',
      copyShareLink: 'LINK KOPIEREN',
      linkCopied: 'LINK KOPIERT',
      downloadRarityCard: 'KARTE HERUNTERLADEN',
      renderingCard: 'KARTE WIRD ERSTELLT...',
      statusLinkCopied: 'Link in die Zwischenablage kopiert.',
      statusClipboardError: 'Zwischenablage konnte nicht automatisch beschrieben werden.',
      statusCardDownloaded: 'Seltenheitskarte heruntergeladen.',
      statusCardError: 'Bildkarte konnte in diesem Browser nicht erstellt werden.',
      shareText: (rarity, twins) =>
        `Meine geschätzte statistische Seltenheit liegt bei ${rarity} (mit ${twins} geschätzten statistischen Zwillingen auf der Erde). Wie selten bist du?`,
      challengeTag: 'FREUNDE HERAUSFORDERN',
      thinkYoureRarer: 'GLAUBST DU, DU BIST SELTENER?',
      challengeDescription:
        'Sende einen Challenge-Link an Freunde. Sie sehen deinen geschätzten Seltenheitswert — ohne deine privaten Antworten — und erfahren, wie ihre Kombination abschneidet.',
      optionalDisplayName: 'OPTIONALER ANZEIGENAME ODER INITIALEN',
      aliasPlaceholder: 'z. B. Alex',
      challengeAFriend: 'FREUND HERAUSFORDERN',
      copyLink: 'LINK KOPIEREN',
      challengeLinkCopied: 'CHALLENGE-LINK KOPIERT',
      challengeShareTitle: 'Glaubst du, du bist seltener?',
      challengeShareText: (rarity) =>
        `Meine geschätzte Kombination liegt bei ${rarity}. Glaubst du, du bist seltener? Finde es heraus:`,
      incomingChallengeTag: 'SELTENHEITS-HERAUSFORDERUNG',
      challengedYou: (name) => `${name} hat dich herausgefordert.`,
      someone: 'Jemand',
      theirEstimatedRarity: 'DEREN GESCHÄTZTE SELTENHEIT',
      theirRarestCombination: 'DEREN SELTENSTE KOMBINATION',
      estimatedOccurrenceLabel: 'Geschätztes Vorkommen:',
      challengeTakes60s:
        'Dauert ca. 60 Sekunden · Deine Antworten bleiben privat in deinem Browser.',
      incompleteChallengeBody:
        'Dieser Challenge-Link scheint unvollständig zu sein, aber du kannst trotzdem deine eigene statistische Seltenheit berechnen.',
      challengeComparisonTag: 'CHALLENGE-VERGLEICH',
      challengersRarity: (name) =>
        name ? `GESCHÄTZTE SELTENHEIT VON ${name.toUpperCase()}` : 'GESCHÄTZTE SELTENHEIT DES HERAUSFORDERERS',
      comparisonRarer:
        'Deine Merkmalskombination wird statistisch als noch seltener eingeschätzt als die deines Freundes.',
      comparisonLessRare:
        'Die Kombination deines Freundes ist in unserem Modell etwas seltener, wobei beide Profile ganz eigene Überschneidungen aufweisen.',
      comparisonTie:
        'Bemerkenswert: Ihr habt exakt dieselbe geschätzte Seltenheitsstufe erreicht.',
      sharedEstimateTag: 'GETEILTE SELTENHEITSSCHÄTZUNG',
      sharedProfileSummary: (rarity, twins) =>
        `Dieses geteilte Profil kommt schätzungsweise bei etwa ${rarity} Menschen vor, mit rund ${twins} geschätzten statistischen Zwillingen auf der Erde.`,
      rarestInThisProfile: 'SELTENSTE KOMBINATION IN DIESEM PROFIL',
      sharedCtaTitle: 'Wie viele Menschen auf der Erde sind eigentlich so wie du?',
      sharedCtaSubtitle:
        'Mach den interaktiven 60-Sekunden-Test, um deine eigene Kombination zu berechnen.',
      findOutYourRarity: 'DEINE SELTENHEIT BERECHNEN',
      insufficientDataTag: 'ZU WENIGE DATENPUNKTE',
      insufficientDataHeadline:
        'Du bist auf eine Weise ungewöhnlich, die wir noch nicht zuverlässig messen können.',
      insufficientDataSubtext: 'Wir brauchen noch ein paar mehr Angaben.',
      answerMoreQuestions: 'WEITERE FRAGEN BEANTWORTEN',
      showBreakdown: (count) => `MERKMALS-AUFSCHLÜSSELUNG ANZEIGEN (${count})`,
      hideBreakdown: (count) => `MERKMALS-AUFSCHLÜSSELUNG AUSBLENDEN (${count})`,
      changeAnswers: 'Antworten ändern',
      howIsThisCalculated: 'Wie wird das berechnet?',
      startOver: 'NEU STARTEN',
      modelInputBreakdown: 'Aufschlüsselung der Modelleingaben',
      showingPrevalenceNote: 'Zeigt Basis-Prävalenz & Kovarianz-Anpassungen',
      baselineSuffix: 'Basiswert',
      correlationNotePrefix: 'Korrelationshinweis:',
      confidenceWord: 'Konfidenz',
    },
    confidenceLabels: {
      'HIGH CONFIDENCE': 'HOHE KONFIDENZ',
      'MEDIUM CONFIDENCE': 'MITTLERE KONFIDENZ',
      'LOW CONFIDENCE': 'NIEDRIGE KONFIDENZ',
    },
    confidenceExplanations: {
      'HIGH CONFIDENCE':
        'Hauptsächlich gestützt auf breite demografische Verteilungen mit etablierten Basisraten.',
      'MEDIUM CONFIDENCE':
        'Deine Schätzung weist eine moderate statistische Unsicherheit auf, da einige Merkmale auf breiten Bevölkerungsannäherungen beruhen.',
      'LOW CONFIDENCE':
        'Diese Schätzung umfasst ein breiteres Intervall, da mehrfache Verhaltensschnittmengen eine höhere Varianz aufweisen.',
    },
    narratives: {
      COMMON: {
        headline: 'Du bist überraschend typisch.',
        summary:
          'Sowohl einzeln als auch in Kombination stimmen deine gewählten Merkmale eng mit großen globalen Mehrheiten überein.',
      },
      UNCOMMON: {
        headline: 'Du bist seltener, als du vielleicht denkst.',
        summary:
          'Obwohl Millionen deine Einzelantworten teilen, grenzt ihre Überschneidung das Feld deutlich ein.',
      },
      RARE: {
        headline: 'Deine Kombination wird langsam ungewöhnlich.',
        summary:
          'Nur ein kleiner Teil der Referenzbevölkerung teilt schätzungsweise genau diese Schnittmenge an Eigenschaften.',
      },
      'VERY RARE': {
        headline: 'Das ist eine bemerkenswert seltene Kombination.',
        summary:
          'Einige wenige Schlüsselüberschneidungen in deinem Profil filtern den Großteil der Weltbevölkerung heraus.',
      },
      'EXTREMELY RARE': {
        headline: 'Deine Kombination ist schwer zu finden.',
        summary:
          'Unter geschätzten 8,1 Milliarden Menschen ist diese spezielle Überschneidung von Merkmalen statistisch äußerst dünn gesät.',
      },
    },
    pages: {
      about: {
        tag: 'ÜBER DIESES EXPERIMENT',
        title: 'WARUM GIBT ES DAS?',
        lead: 'Die meisten Dinge, die dich ausmachen, sind für sich genommen gar nicht besonders selten.',
        bullet1: 'Dein Geburtstag ist nicht besonders ungewöhnlich.',
        bullet2: 'Deine Körpergröße ist nicht besonders ungewöhnlich.',
        bullet3: 'Deine Gewohnheiten sind es wahrscheinlich auch nicht.',
        combinationsDifferent: 'Aber Kombinationen sind anders.',
        body1:
          'WIE SELTEN BIST DU? untersucht, wie ungewöhnlich deine spezielle Kombination von Eigenschaften ist, wenn man sie auf ein Referenzmodell von ~8,1 Milliarden Menschen überträgt.',
        body2:
          'Statt einer klinischen Diagnose oder eines psychologischen Tests ist dies eine interaktive statistische Entdeckungsmaschine — entwickelt, um zu zeigen, wie schnell alltägliche Eigenschaften zu etwas Ungewöhnlichem verschmelzen.',
        honestyTag: 'HINWEIS ZUR WISSENSCHAFTLICHEN EHRLICHKEIT',
        honestyBody:
          'Diese Ergebnisse sind Schätzungen, keine wissenschaftlichen Diagnosen oder exakten Messungen. Wo keine weltweiten Volkszählungsdaten für Alltagsgewohnheiten vorliegen, nutzt unser Modell transparente Annäherungen.',
        cta: 'FINDE DEINE SELTENHEIT HERAUS',
      },
      methodology: {
        tag: 'MODELLARCHITEKTUR & TRANSPARENZ',
        title: 'METHODIK',
        subtitle:
          'Wie unser statistisches Modell Kombinationsseltenheit schätzt, korrelierte Merkmale berücksichtigt und Unsicherheit beziffert.',
        card1Tag: '01. REFERENZBEVÖLKERUNG',
        card1Title: 'Wie die Referenzbevölkerung definiert ist',
        card1Body:
          'Alle Schätzungen beziehen sich auf eine globale menschliche Referenzbevölkerung von rund 8,1 Milliarden Menschen. Geschätzte „statistische Zwillinge“ geben an, wie viele Menschen weltweit ein ähnliches Profil teilen würden.',
        card2Tag: '02. KOMBINATIONSWAHRSCHEINLICHKEIT',
        card2Title: 'Warum Kombinationen schwer zu berechnen sind',
        card2Body:
          'In der einfachen Wahrscheinlichkeitsrechnung multiplizieren sich unabhängige Ereignisse: P(A und B) = P(A) × P(B). Menschen sind jedoch keine unabhängigen Münzwürfe.',
        card3Tag: '03. KOVARIANZ & KORRELATIONEN',
        card3Title: 'Wie Zusammenhänge zwischen Merkmalen behandelt werden',
        card3Body:
          'Unser Modell wendet bedingte Wahrscheinlichkeitsdämpfungen für zusammenhängende Merkmale an — etwa Nachteulen-Chronotyp und spätes Einschlafen oder Geburtsregion und Mehrsprachigkeit.',
        card4Tag: '04. EVIDENZ-HIERARCHIE',
        card4Title: 'Stärkere Evidenz vs. breite Schätzungen',
        card4Body:
          'Demografische und biologische Merkmale (Geburtsmonat, Region, Händigkeit, Augenfarbe) haben stärkere empirische Grundlagen als Verhaltenspräferenzen.',
        rulesTitle: 'Aktive Abhängigkeits- & Korrelationsregeln',
        rulesSubtitle:
          'Wenn beide Merkmale einer Regel ausgewählt werden, passt das Modell die bedingte Wahrscheinlichkeit an, um Doppelzählungen zu vermeiden:',
        conditionalAdjustmentSuffix: '× bedingte Anpassung',
        distributionsTitle: 'Merkmalsverteilungen & Konfidenzstufen',
        cta: 'MEINE KOMBINATION TESTEN',
      },
      privacy: {
        tag: 'DATENSCHUTZ DURCH ARCHITEKTUR',
        title: 'DATENSCHUTZ',
        quote: '„Wir müssen nicht wissen, wer du bist, um dein Ergebnis zu berechnen.“',
        card1Title: '1. 100 % Berechnung im Browser',
        card1Body:
          'Deine Antworten werden direkt in deinem Browser ausgewertet. Wir übertragen deine Fragebogen-Antworten nicht an eine zentrale Datenbank.',
        card2Title: '2. Keine persönlichen Identifikatoren',
        card2Body:
          'Wir fragen niemals nach deinem Namen, deiner E-Mail-Adresse, Telefonnummer, genauen Adresse oder deinem exakten Geburtsdatum.',
        card3Title: '3. Datenschutzfreundliche Share-Links',
        card3Body:
          'Wenn du einen Share- oder Challenge-Link erstellst, enthält das URL-Token nur deinen geschätzten Seltenheitswert und die 4 Merkmale auf deiner Karte.',
        card4Title: '4. Lokaler Sitzungsspeicher',
        card4Body:
          'Damit dein Fortschritt beim Neuladen nicht verloren geht, werden deine aktuellen Antworten temporär im sessionStorage deines Browsers gehalten.',
        cta: 'ZURÜCK ZUM EXPERIMENT',
      },
      contact: {
        tag: 'ANFRAGEN & DATENSATZ-BEITRÄGE',
        title: 'KONTAKT',
        body: 'Hast du Feedback zu einer demografischen Verteilung, möchtest du ein neues Merkmal vorschlagen oder hast du eine spannende statistische Kombination entdeckt?',
        editorialLabel: 'REDAKTION & FORSCHUNG',
        generalLabel: 'ALLGEMEIN & PRESSE',
        cta: 'SELTENHEITSTEST STARTEN',
      },
    },
    questions: {
      birthDecade: {
        prompt: 'In welchem Zeitraum wurdest du geboren?',
        subtitle:
          'Breite Altersgruppen helfen dabei, demografische Muster zu schätzen, ohne dein genaues Geburtsdatum zu benötigen.',
        categoryLabel: 'Demografie',
        options: {
          '2005_plus': { label: '2005 oder später', shortTag: 'GEBOREN 2005+', cardLabel: 'Geboren 2005 oder später' },
          '1995_2004': { label: '1995 – 2004', shortTag: 'JAHRGANG 1995–2004', cardLabel: 'Geboren 1995–2004' },
          '1985_1994': { label: '1985 – 1994', shortTag: 'JAHRGANG 1985–1994', cardLabel: 'Geboren 1985–1994' },
          '1975_1984': { label: '1975 – 1984', shortTag: 'JAHRGANG 1975–1984', cardLabel: 'Geboren 1975–1984' },
          '1965_1974': { label: '1965 – 1974', shortTag: 'JAHRGANG 1965–1974', cardLabel: 'Geboren 1965–1974' },
          pre_1965: { label: 'Vor 1965', shortTag: 'VOR 1965 GEBOREN', cardLabel: 'Geboren vor 1965' },
        },
      },
      birthMonth: {
        prompt: 'In welchem Monat wurdest du geboren?',
        categoryLabel: 'Demografie',
        options: {
          jan: { label: 'Januar', shortTag: 'JANUAR', cardLabel: 'Geboren im Januar' },
          feb: { label: 'Februar', shortTag: 'FEBRUAR', cardLabel: 'Geboren im Februar' },
          mar: { label: 'März', shortTag: 'MÄRZ', cardLabel: 'Geboren im März' },
          apr: { label: 'April', shortTag: 'APRIL', cardLabel: 'Geboren im April' },
          may: { label: 'Mai', shortTag: 'MAI', cardLabel: 'Geboren im Mai' },
          jun: { label: 'Juni', shortTag: 'JUNI', cardLabel: 'Geboren im Juni' },
          jul: { label: 'Juli', shortTag: 'JULI', cardLabel: 'Geboren im Juli' },
          aug: { label: 'August', shortTag: 'AUGUST', cardLabel: 'Geboren im August' },
          sep: { label: 'September', shortTag: 'SEPTEMBER', cardLabel: 'Geboren im September' },
          oct: { label: 'Oktober', shortTag: 'OKTOBER', cardLabel: 'Geboren im Oktober' },
          nov: { label: 'November', shortTag: 'NOVEMBER', cardLabel: 'Geboren im November' },
          dec: { label: 'Dezember', shortTag: 'DEZEMBER', cardLabel: 'Geboren im Dezember' },
        },
      },
      birthRegion: {
        prompt: 'In welchem Teil der Welt wurdest du geboren?',
        categoryLabel: 'Demografie',
        options: {
          east_se_asia: { label: 'Ost- oder Südostasien', shortTag: 'OST-/SÜDOSTASIEN', cardLabel: 'Aus Ost-/Südostasien' },
          south_asia: { label: 'Südasien', shortTag: 'SÜDASIEN', cardLabel: 'Aus Südasien' },
          europe: { label: 'Europa', shortTag: 'EUROPA', cardLabel: 'Aus Europa' },
          north_america: { label: 'Nordamerika', shortTag: 'NORDAMERIKA', cardLabel: 'Aus Nordamerika' },
          latin_america: { label: 'Lateinamerika oder Karibik', shortTag: 'LATEINAMERIKA', cardLabel: 'Aus Lateinamerika' },
          sub_saharan_africa: { label: 'Subsahara-Afrika', shortTag: 'SUBSAHARA-AFRIKA', cardLabel: 'Aus Subsahara-Afrika' },
          mena: { label: 'Naher Osten oder Nordafrika', shortTag: 'MENA-REGION', cardLabel: 'Aus Nahost/Nordafrika' },
          oceania: { label: 'Ozeanien', shortTag: 'OZEANIEN', cardLabel: 'Aus Ozeanien' },
        },
      },
      handedness: {
        prompt: 'Mit welcher Hand schreibst du von Natur aus?',
        categoryLabel: 'Biologie',
        options: {
          right: { label: 'Rechtshändig', shortTag: 'RECHTSHÄNDIG', cardLabel: 'Rechtshändig' },
          left: { label: 'Linkshändig', shortTag: 'LINKSHÄNDIG', cardLabel: 'Linkshändig' },
          ambidextrous: { label: 'Beidhändig (gleichermaßen)', shortTag: 'BEIDHÄNDIG', cardLabel: 'Beidhändig' },
        },
      },
      siblings: {
        prompt: 'Wie viele Geschwister hast du?',
        categoryLabel: 'Demografie',
        options: {
          none: { label: 'Keine (Einzelkind)', shortTag: 'EINZELKIND', cardLabel: 'Einzelkind' },
          one: { label: '1 Geschwisterteil', shortTag: '1 GESCHWISTERTEIL', cardLabel: '1 Geschwisterteil' },
          two: { label: '2 Geschwister', shortTag: '2 GESCHWISTER', cardLabel: '2 Geschwister' },
          three: { label: '3 Geschwister', shortTag: '3 GESCHWISTER', cardLabel: '3 Geschwister' },
          four_plus: { label: '4 oder mehr', shortTag: '4+ GESCHWISTER', cardLabel: '4+ Geschwister' },
        },
      },
      heightRange: {
        prompt: 'Wie groß bist du ungefähr?',
        categoryLabel: 'Biologie',
        options: {
          under_160: { label: 'Unter 160 cm', subtext: 'Unter 5′3″', shortTag: 'UNTER 160 CM', cardLabel: 'Unter 160 cm groß' },
          '160_169': { label: '160 – 169 cm', subtext: '5′3″ – 5′6″', shortTag: '160–169 CM', cardLabel: '160–169 cm groß' },
          '170_179': { label: '170 – 179 cm', subtext: '5′7″ – 5′10″', shortTag: '170–179 CM', cardLabel: '170–179 cm groß' },
          '180_189': { label: '180 – 189 cm', subtext: '5′11″ – 6′2″', shortTag: '180–189 CM', cardLabel: '180–189 cm groß' },
          '190_plus': { label: '190 cm oder größer', subtext: '6′3″ oder größer', shortTag: '190+ CM GROSS', cardLabel: '190 cm+ groß' },
        },
      },
      chronotype: {
        prompt: 'Bist du eher ein Morgenmensch oder ein Nachtmensch?',
        categoryLabel: 'Chronobiologie',
        options: {
          early_bird: { label: 'Ausgeprägter Frühaufsteher', shortTag: 'FRÜHAUFSTEHER', cardLabel: 'Frühaufsteher' },
          morning_lean: { label: 'Eher Morgenmensch', shortTag: 'MORGENMENSCH', cardLabel: 'Morgenmensch' },
          intermediate: { label: 'Irgendwo dazwischen', shortTag: 'FLEXIBLER RHYTHMUS', cardLabel: 'Flexibler Chronotyp' },
          night_owl: { label: 'Nachteule', shortTag: 'NACHTEULE', cardLabel: 'Nachteule' },
          extreme_owl: { label: 'Extreme Nachteule', shortTag: 'EXTREME NACHTEULE', cardLabel: 'Extreme Nachteule' },
        },
      },
      petPreference: {
        prompt: 'Magst du lieber Katzen, Hunde, beides oder keins von beidem?',
        categoryLabel: 'Verhalten',
        options: {
          dogs: { label: 'Hunde', shortTag: 'HUNDEMENSCH', cardLabel: 'Mag Hunde lieber' },
          cats: { label: 'Katzen', shortTag: 'KATZENMENSCH', cardLabel: 'Mag Katzen lieber' },
          both: { label: 'Beides gleichermaßen', shortTag: 'KATZEN & HUNDE', cardLabel: 'Mag Katzen & Hunde' },
          neither: { label: 'Keins von beidem', shortTag: 'KEINE HAUSTIERE', cardLabel: 'Keine Haustier-Präferenz' },
        },
      },
      languages: {
        prompt: 'In wie vielen Sprachen kannst du ein Gespräch führen?',
        categoryLabel: 'Kultur',
        options: {
          one: { label: 'Einer Sprache', shortTag: 'EINSPRACHIG', cardLabel: 'Spricht 1 Sprache' },
          two: { label: 'Zwei Sprachen', shortTag: 'ZWEISPRACHIG', cardLabel: 'Zweisprachig' },
          three: { label: 'Drei Sprachen', shortTag: 'DREISPRACHIG', cardLabel: 'Dreisprachig' },
          four_plus: { label: 'Vier oder mehr', shortTag: 'POLYGLOTT (4+)', cardLabel: 'Spricht 4+ Sprachen' },
        },
      },
      coffeeHabit: {
        prompt: 'Trinkst du Kaffee?',
        categoryLabel: 'Verhalten',
        options: {
          daily_multi: { label: 'Mehrere Tassen jeden Tag', shortTag: 'VIEL KAFFEE', cardLabel: 'Mehrere Tassen Kaffee täglich' },
          daily_one: { label: 'Eine Tasse pro Tag', shortTag: 'TÄGLICH KAFFEE', cardLabel: 'Täglicher Kaffeetrinker' },
          occasional: { label: 'Gelegentlich', shortTag: 'GELEGENTLICH KAFFEE', cardLabel: 'Gelegentlich Kaffee' },
          tea_only: { label: 'Nein, ich trinke lieber Tee', shortTag: 'TEELIEBHABER', cardLabel: 'Tee statt Kaffee' },
          none: { label: 'Überhaupt kein Koffein', shortTag: 'KOFFEINFREI', cardLabel: 'Koffeinfrei' },
        },
      },
      socialEnergy: {
        prompt: 'Bleibst du abends lieber zu Hause oder gehst du lieber aus?',
        categoryLabel: 'Verhalten',
        options: {
          stay_in_always: { label: 'Fast immer zu Hause bleiben', shortTag: 'STUBENHOCKER', cardLabel: 'Überzeugter Stubenhocker' },
          stay_in_mostly: { label: 'Meistens zu Hause bleiben', shortTag: 'RUHIGE ABENDE', cardLabel: 'Bleibt meist lieber zu Hause' },
          balanced: { label: 'Ausgewogene Mischung', shortTag: 'AMBIVERTIERT', cardLabel: 'Ausgewogene soziale Energie' },
          go_out_mostly: { label: 'Meistens ausgehen', shortTag: 'GESELLIG', cardLabel: 'Geht lieber aus' },
          go_out_always: { label: 'Immer unterwegs, wenn möglich', shortTag: 'NACHTLEBEN-FAN', cardLabel: 'Fast immer unterwegs' },
        },
      },
      sleepTime: {
        prompt: 'Wann gehst du normalerweise schlafen?',
        categoryLabel: 'Chronobiologie',
        options: {
          before_10pm: { label: 'Vor 22:00 Uhr', shortTag: 'SCHLÄFT <22 UHR', cardLabel: 'Schläft vor 22 Uhr' },
          '10pm_midnight': { label: 'Zwischen 22:00 Uhr und Mitternacht', shortTag: '22–24 UHR SCHLAF', cardLabel: 'Schläft 22–24 Uhr' },
          midnight_2am: { label: 'Zwischen Mitternacht und 2:00 Uhr', shortTag: 'NACH MITTERNACHT', cardLabel: 'Schläft nach Mitternacht' },
          after_2am: { label: 'Nach 2:00 Uhr nachts', shortTag: 'SCHLÄFT 2 UHR+', cardLabel: 'Schläft nach 2 Uhr nachts' },
        },
      },
      eyeColor: {
        prompt: 'Welche Augenfarbe hast du?',
        categoryLabel: 'Biologie',
        options: {
          brown: { label: 'Braun', shortTag: 'BRAUNE AUGEN', cardLabel: 'Braune Augen' },
          blue: { label: 'Blau', shortTag: 'BLAUE AUGEN', cardLabel: 'Blaue Augen' },
          hazel: { label: 'Haselnussbraun (Hazel)', shortTag: 'HASELNUSS-AUGEN', cardLabel: 'Haselnussbraune Augen' },
          amber: { label: 'Bernsteinfarben', shortTag: 'BERNSTEIN-AUGEN', cardLabel: 'Bernsteinfarbene Augen' },
          green: { label: 'Grün', shortTag: 'GRÜNE AUGEN', cardLabel: 'Grüne Augen' },
          gray: { label: 'Grau', shortTag: 'GRAUE AUGEN', cardLabel: 'Graue Augen' },
        },
      },
      cilantro: {
        prompt: 'Wie schmeckt frischer Koriander für dich?',
        categoryLabel: 'Biologie',
        options: {
          herbal: { label: 'Frisch und zitronig', shortTag: 'MAG KORIANDER', cardLabel: 'Mag Koriander' },
          soap: { label: 'Schmeckt wie Seife', shortTag: 'KORIANDER = SEIFE', cardLabel: 'Koriander schmeckt seifig' },
          neutral: { label: 'Neutral / kaum wahrnehmbar', shortTag: 'KORIANDER NEUTRAL', cardLabel: 'Koriander-neutral' },
          never_tried: { label: 'Nicht sicher / noch nie probiert', shortTag: 'KEINE KORIANDER-DATEN', cardLabel: 'Koriander unbekannt' },
        },
      },
      tongueRoll: {
        prompt: 'Kannst du deine Zunge zu einer Röhre rollen?',
        categoryLabel: 'Biologie',
        options: {
          yes: { label: 'Ja, problemlos', shortTag: 'ZUNGENROLLER', cardLabel: 'Kann Zunge rollen' },
          no: { label: 'Nein, überhaupt nicht', shortTag: 'NICHT-ROLLER', cardLabel: 'Kann Zunge nicht rollen' },
          cloverleaf: { label: 'Ich kann ein Kleeblatt falten', shortTag: 'KLEEBLATT-ZUNGE', cardLabel: 'Kleeblatt-Zunge' },
        },
      },
      livedAbroad: {
        prompt: 'Hast du schon in einem anderen Land als deinem Geburtsland gelebt?',
        categoryLabel: 'Kultur',
        options: {
          never: { label: 'Nein, noch nie', shortTag: 'HEIMATVERBUNDEN', cardLabel: 'Lebt im Geburtsland' },
          under_1yr: { label: 'Ja, weniger als ein Jahr', shortTag: 'KURZZEIT-EXPAT', cardLabel: '<1 Jahr im Ausland gelebt' },
          one_country: { label: 'Ja, in einem anderen Land', shortTag: '2-LÄNDER-LEBEN', cardLabel: 'In 2 Ländern gelebt' },
          two_plus: { label: 'Ja, in zwei oder mehr anderen Ländern', shortTag: 'WELTENBUMMLER', cardLabel: 'In 3+ Ländern gelebt' },
        },
      },
      seasonPreference: {
        prompt: 'Welche Jahreszeit magst du am liebsten?',
        categoryLabel: 'Verhalten',
        options: {
          spring: { label: 'Frühling', shortTag: 'FRÜHLINGSMENSCH', cardLabel: 'Liebt den Frühling' },
          summer: { label: 'Sommer', shortTag: 'SOMMERMENSCH', cardLabel: 'Liebt den Sommer' },
          autumn: { label: 'Herbst', shortTag: 'HERBSTMENSCH', cardLabel: 'Liebt den Herbst' },
          winter: { label: 'Winter', shortTag: 'WINTERMENSCH', cardLabel: 'Liebt den Winter' },
        },
      },
      driversLicense: {
        prompt: 'Hast du einen Führerschein?',
        categoryLabel: 'Kultur',
        options: {
          yes_regular: { label: 'Ja, ich fahre regelmäßig', shortTag: 'VIELFAHRER', cardLabel: 'Fährt regelmäßig Auto' },
          yes_rarely: { label: 'Ja, aber ich fahre selten', shortTag: 'SELTENFAHRER', cardLabel: 'Führerschein, fährt selten' },
          no_license: { label: 'Kein Führerschein', shortTag: 'KEIN FÜHRERSCHEIN', cardLabel: 'Kein Führerschein' },
        },
      },
    },
  },
};

/**
 * Localized rarity formatting ("~1 in 2.7 million" / "~1 de cada 2,7 millones" / "~1 von 2,7 Millionen")
 */
export function formatRarityLocalized(
  oneInX: number,
  lang: Language,
  includeTilde = true
): string {
  const locale = lang === 'de' ? 'de-DE' : lang === 'es' ? 'es-ES' : 'en-US';
  const prefix =
    lang === 'es'
      ? includeTilde
        ? '~1 de cada '
        : '1 de cada '
      : lang === 'de'
      ? includeTilde
        ? '~1 von '
        : '1 von '
      : includeTilde
      ? '~1 in '
      : '1 in ';

  if (!Number.isFinite(oneInX) || oneInX <= 1) {
    return `${prefix}1`;
  }

  const val = Math.round(oneInX);

  if (val < 100) {
    return `${prefix}${val.toLocaleString(locale)}`;
  }
  if (val < 1_000) {
    const rounded = Math.round(val / 10) * 10;
    return `${prefix}${rounded.toLocaleString(locale)}`;
  }
  if (val < 10_000) {
    const rounded = Math.round(val / 50) * 50;
    return `${prefix}${rounded.toLocaleString(locale)}`;
  }
  if (val < 100_000) {
    const rounded = Math.round(val / 500) * 500;
    return `${prefix}${rounded.toLocaleString(locale)}`;
  }
  if (val < 1_000_000) {
    const rounded = Math.round(val / 1_000) * 1_000;
    return `${prefix}${rounded.toLocaleString(locale)}`;
  }

  if (val < 1_000_000_000) {
    const millions = val / 1_000_000;
    const numStr =
      millions >= 10
        ? Math.round(millions).toLocaleString(locale)
        : millions.toLocaleString(locale, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 1,
          });
    const unit =
      lang === 'es' ? 'millones' : lang === 'de' ? 'Millionen' : 'million';
    return `${prefix}${numStr} ${unit}`;
  }

  const billions = val / 1_000_000_000;
  const numStr =
    billions >= 10
      ? Math.round(billions).toLocaleString(locale)
      : billions.toLocaleString(locale, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 1,
        });
  const unit =
    lang === 'es'
      ? 'mil millones'
      : lang === 'de'
      ? 'Milliarden'
      : 'billion';
  return `${prefix}${numStr} ${unit}`;
}

export function formatShortRarityLocalized(oneInX: number, lang: Language): string {
  return formatRarityLocalized(oneInX, lang, false).toUpperCase();
}

export function localizeQuestion(question: Question, lang: Language): Question {
  const qTrans = TRANSLATIONS[lang]?.questions[question.id];
  if (!qTrans) return question;

  return {
    ...question,
    prompt: qTrans.prompt,
    subtitle: qTrans.subtitle ?? question.subtitle,
    options: question.options.map((opt) => {
      const oTrans = qTrans.options[opt.id];
      if (!oTrans) return opt;
      return {
        ...opt,
        label: oTrans.label,
        shortTag: oTrans.shortTag,
        cardLabel: oTrans.cardLabel,
        subtext: oTrans.subtext ?? opt.subtext,
      };
    }),
  };
}

const STORAGE_KEY_LANG = 'hrau_lang_v1';

function detectInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en';

  const params = new URLSearchParams(window.location.search);
  const queryLang = params.get('lang')?.toLowerCase();
  if (queryLang === 'en' || queryLang === 'es' || queryLang === 'de') {
    return queryLang;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    if (saved === 'en' || saved === 'es' || saved === 'de') {
      return saved;
    }
  } catch {
    // Ignore storage access errors
  }

  const navLang = navigator.language?.toLowerCase() ?? '';
  if (navLang.startsWith('es')) return 'es';
  if (navLang.startsWith('de')) return 'de';
  return 'en';
}

interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: UITranslations;
  localeCode: string;
}

const I18nContext = createContext<I18nContextValue>({
  language: 'en',
  setLanguage: () => {},
  t: TRANSLATIONS.en,
  localeCode: 'en-US',
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(detectInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch {
      // Ignore storage quota errors
    }

    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', lang);
        window.history.replaceState(window.history.state, '', url.toString());
      } catch {
        // Ignore in sandboxed iframe
      }
    }
  };

  // Sync HTML lang attribute and SEO meta tags whenever language changes
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const seo = TRANSLATIONS[language].seo;

    document.documentElement.lang = language;
    document.title = seo.title;

    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', seo.description);
    setMeta('meta[name="keywords"]', seo.keywords);
    setMeta('meta[property="og:title"]', seo.title);
    setMeta('meta[property="og:description"]', seo.description);
    setMeta('meta[name="twitter:title"]', seo.title);
    setMeta('meta[name="twitter:description"]', seo.description);
  }, [language]);

  const localeCode =
    language === 'de' ? 'de-DE' : language === 'es' ? 'es-ES' : 'en-US';

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t: TRANSLATIONS[language],
        localeCode,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}
