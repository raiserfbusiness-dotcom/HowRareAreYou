import assert from 'node:assert/strict';
import {
  calculateRarity,
  formatRarity,
  formatShortRarity,
  generateRarityNarrative,
} from '../rarityEngine';
import { validateQuizAnswers } from '../validation';
import { decodeShareToken, encodeShareToken } from '../../share';
import { trackEvent } from '../../analytics';
import { WORLD_POPULATION_ESTIMATE } from '../distributions';

function runTestSuite() {
  let passed = 0;

  const test = (name: string, fn: () => void) => {
    fn();
    passed++;
    console.log(`✓ ${name}`);
  };

  // 1. All common answers
  test('1. Calculates reasonable estimate for all common answers', () => {
    const commonAnswers = {
      birthDecade: '2005_plus',
      birthMonth: 'sep',
      birthRegion: 'east_se_asia',
      handedness: 'right',
      siblings: 'one',
      heightRange: '160_169',
      chronotype: 'intermediate',
      petPreference: 'dogs',
      languages: 'two',
      coffeeHabit: 'daily_multi',
      socialEnergy: 'stay_in_mostly',
      sleepTime: '10pm_midnight',
    };

    const result = calculateRarity(commonAnswers);
    assert.equal(result.isValid, true);
    assert.equal(result.coreAnsweredCount, 12);
    assert.ok(result.oneInX >= 100 && result.oneInX < 10_000_000);
    assert.ok(result.statisticalTwins > 0);
  });

  // 2. All rare answers
  test('2. Calculates rare estimate for all rare answers and clamps to world population', () => {
    const rareAnswers = {
      birthDecade: '1965_1974',
      birthMonth: 'feb',
      birthRegion: 'oceania',
      handedness: 'ambidextrous',
      siblings: 'four_plus',
      heightRange: '190_plus',
      chronotype: 'extreme_owl',
      petPreference: 'neither',
      languages: 'four_plus',
      coffeeHabit: 'none',
      socialEnergy: 'go_out_always',
      sleepTime: 'after_2am',
    };

    const result = calculateRarity(rareAnswers);
    assert.equal(result.isValid, true);
    assert.ok(result.oneInX > 1_000_000);
    assert.ok(result.oneInX <= WORLD_POPULATION_ESTIMATE);
    assert.equal(result.rarestCombination.traits.length, 4);
  });

  // 3. Missing / empty answers
  test('3. Handles empty or insufficient answers gracefully without nonsense', () => {
    const emptyResult = calculateRarity({});
    assert.equal(emptyResult.isValid, false);
    assert.ok(
      emptyResult.invalidReason?.includes(
        "You're unusual in ways we can't reliably measure yet."
      )
    );

    const twoAnswers = calculateRarity({
      birthMonth: 'nov',
      handedness: 'left',
    });
    assert.equal(twoAnswers.isValid, false);
  });

  // 4. Extremely rare combination with bonus traits
  test('4. Handles bonus traits ("Can You Get Rarer?") and updates rarity', () => {
    const baseProfile = {
      birthDecade: '1995_2004',
      birthMonth: 'nov',
      birthRegion: 'europe',
      handedness: 'left',
      siblings: 'two',
      heightRange: '180_189',
      chronotype: 'night_owl',
      petPreference: 'cats',
      languages: 'three',
      coffeeHabit: 'daily_one',
      socialEnergy: 'stay_in_mostly',
      sleepTime: 'midnight_2am',
    };

    const baseResult = calculateRarity(baseProfile);
    const upgradedResult = calculateRarity({
      ...baseProfile,
      eyeColor: 'green',
      tongueRoll: 'cloverleaf',
      livedAbroad: 'two_plus',
    });

    assert.equal(upgradedResult.bonusAnsweredCount, 3);
    assert.ok(upgradedResult.oneInX > baseResult.oneInX);
  });

  // 5. Very common 3-trait minimum combination
  test('5. Calculates valid estimate for 3-trait minimum combination', () => {
    const threeCommon = {
      handedness: 'right',
      birthDecade: '2005_plus',
      siblings: 'one',
    };
    const result = calculateRarity(threeCommon);
    assert.equal(result.isValid, true);
    assert.ok(result.oneInX >= 2 && result.oneInX < 500);
    assert.equal(result.narrative.tier, 'COMMON');
  });

  // 6. Rarity number formatting
  test('6. Formats rarity numbers cleanly without fake decimal precision', () => {
    assert.equal(formatRarity(848), '~1 in 850');
    assert.equal(formatRarity(125_432), '~1 in 125,000');
    assert.equal(formatRarity(2_738_492.384), '~1 in 2.7 million');
    assert.equal(formatRarity(31_412_000), '~1 in 31 million');
    assert.equal(formatRarity(1_210_000_000), '~1 in 1.2 billion');
    assert.equal(formatShortRarity(2_700_000), '1 IN 2.7 MILLION');
  });

  // 7. Correlation adjustments prevent naive multiplication
  test('7. Applies correlation dampeners for linked traits (e.g. night owl + late sleep)', () => {
    const correlated = calculateRarity({
      handedness: 'right',
      chronotype: 'night_owl',
      sleepTime: 'after_2am',
    });
    assert.ok(correlated.correlationAdjustmentsApplied.length >= 1);
  });

  // 8. Validation rejects unknown option IDs
  test('8. Filters out unknown or malformed question/option keys', () => {
    const v = validateQuizAnswers({
      handedness: 'invalid_option',
      unknownQuestion: 'left',
      birthMonth: 'nov',
      siblings: 'two',
      chronotype: 'night_owl',
    });
    assert.equal(v.isValid, true);
    assert.equal(v.totalCount, 3);
    assert.equal(v.validAnswers.handedness, undefined);
  });

  // 9. Share & Challenge token encoding and malformed token handling
  test('9. Encodes privacy-safe share tokens and rejects malformed IDs', () => {
    const sample = calculateRarity({
      birthMonth: 'nov',
      handedness: 'left',
      siblings: 'two',
      chronotype: 'night_owl',
    });

    const token = encodeShareToken(sample, 'Sam');
    const decoded = decodeShareToken(token);
    assert.ok(decoded !== null);
    assert.equal(decoded?.o, sample.oneInX);
    assert.equal(decoded?.n, 'Sam');

    // Malformed tokens return null safely
    assert.equal(decodeShareToken(''), null);
    assert.equal(decodeShareToken('not-a-valid-base64-payload!!!'), null);
    assert.equal(decodeShareToken(null), null);
  });

  // 10. Narrative & Privacy-safe analytics
  test('10. Generates honest narrative copy and strips sensitive fields from analytics', () => {
    const narrative = generateRarityNarrative(2_700_000);
    assert.equal(narrative.tier, 'VERY RARE');
    assert.ok(!narrative.headline.toLowerCase().includes('unique'));

    const evt = trackEvent('question_answered', {
      questionId: 'handedness',
      rawAnswer: 'left',
      email: 'user@example.com',
    });
    assert.equal(evt.metadata?.questionId, 'handedness');
    assert.equal(evt.metadata?.rawAnswer, undefined);
    assert.equal(evt.metadata?.email, undefined);
  });

  console.log(`\nAll ${passed} test suites passed.`);
}

runTestSuite();
