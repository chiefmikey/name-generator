import { describe, expect, it } from 'vitest';

import animals from '../src/data/animals.json';
import emoEmotions from '../src/data/emo-emotions.json';
import emotions from '../src/data/emotions.json';
import fruits from '../src/data/fruits.json';

describe('animals dataset', () => {
  const keys = Object.keys(animals);

  it('has at least 150 animal types', () => {
    const animalKeys = keys.filter((k) => k !== 'default');
    expect(animalKeys.length).toBeGreaterThanOrEqual(150);
  });

  it('has a default key', () => {
    expect(animals).toHaveProperty('default');
  });

  it('every animal has at least 10 pet names', () => {
    for (const key of keys) {
      expect(animals[key].length, `${key} has too few names`).toBeGreaterThanOrEqual(10);
    }
  });

  it('all keys are lowercase', () => {
    for (const key of keys) {
      expect(key).toBe(key.toLowerCase());
    }
  });

  it('pet names are non-empty strings', () => {
    for (const key of keys) {
      for (const name of animals[key]) {
        expect(typeof name).toBe('string');
        expect(name.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

describe('fruits dataset', () => {
  const keys = Object.keys(fruits);

  it('has at least 150 fruits', () => {
    expect(keys.length).toBeGreaterThanOrEqual(150);
  });

  it('all keys are lowercase', () => {
    for (const key of keys) {
      expect(key).toBe(key.toLowerCase());
    }
  });

  it('all sugar values are numbers', () => {
    for (const key of keys) {
      expect(typeof fruits[key], `${key} sugar is not a number`).toBe('number');
    }
  });

  it('sugar values are non-negative', () => {
    for (const key of keys) {
      expect(fruits[key], `${key} has negative sugar`).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('emotions dataset', () => {
  it('has at least 100 positive emotions', () => {
    expect(emotions.length).toBeGreaterThanOrEqual(100);
  });

  it('all entries are non-empty lowercase strings', () => {
    for (const word of emotions) {
      expect(typeof word).toBe('string');
      expect(word).toBe(word.toLowerCase());
      expect(word.trim().length).toBeGreaterThan(0);
    }
  });

  it('has no duplicates', () => {
    const unique = new Set(emotions);
    expect(unique.size).toBe(emotions.length);
  });
});

describe('emo-emotions dataset', () => {
  it('has at least 100 emo emotions', () => {
    expect(emoEmotions.length).toBeGreaterThanOrEqual(100);
  });

  it('all entries are non-empty lowercase strings', () => {
    for (const word of emoEmotions) {
      expect(typeof word).toBe('string');
      expect(word).toBe(word.toLowerCase());
      expect(word.trim().length).toBeGreaterThan(0);
    }
  });
});
