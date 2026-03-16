import { describe, expect, it } from 'vitest';

import animals from '../src/data/animals.json';
import fruits from '../src/data/fruits.json';

function depluralize(word) {
  if (word.endsWith('ies') && word.length > 4) {
    return [`${word.slice(0, -3)}y`];
  }
  const forms = [];

  if (word.endsWith('ves') && word.length > 4) {
    forms.push(`${word.slice(0, -3)}f`, `${word.slice(0, -3)}fe`);
  }
  if (word.endsWith('es') && word.length > 3) {
    forms.push(word.slice(0, -2));
  }
  if (word.endsWith('s') && word.length > 2) {
    forms.push(word.slice(0, -1));
  }

  return forms;
}

function resolveAnimal(value) {
  const key = value.toLowerCase().trim();

  if (key in animals && key !== 'default') {
    return key;
  }
  for (const candidate of depluralize(key)) {
    if (candidate in animals && candidate !== 'default') {
      return candidate;
    }
  }

  return null;
}

function resolveFruit(value) {
  const key = value.toLowerCase().trim();

  if (key in fruits) {
    return key;
  }
  for (const candidate of depluralize(key)) {
    if (candidate in fruits) {
      return candidate;
    }
  }

  return null;
}

describe('resolveAnimal', () => {
  it('resolves exact match', () => {
    expect(resolveAnimal('dog')).toBe('dog');
    expect(resolveAnimal('cat')).toBe('cat');
    expect(resolveAnimal('dolphin')).toBe('dolphin');
  });

  it('is case-insensitive', () => {
    expect(resolveAnimal('Dog')).toBe('dog');
    expect(resolveAnimal('CAT')).toBe('cat');
    expect(resolveAnimal('EAGLE')).toBe('eagle');
  });

  it('trims whitespace', () => {
    expect(resolveAnimal('  dog  ')).toBe('dog');
  });

  it('depluralizes simple -s', () => {
    expect(resolveAnimal('dogs')).toBe('dog');
    expect(resolveAnimal('cats')).toBe('cat');
  });

  it('depluralizes -ies to -y', () => {
    expect(resolveAnimal('butterflies')).toBe('butterfly');
  });

  it('depluralizes -es', () => {
    expect(resolveAnimal('foxes')).toBe('fox');
  });

  it('depluralizes -ves to -f/-fe', () => {
    expect(resolveAnimal('wolves')).toBe('wolf');
  });

  it('returns null for unknown animals', () => {
    expect(resolveAnimal('blargmonster')).toBeNull();
    expect(resolveAnimal('')).toBeNull();
    expect(resolveAnimal('   ')).toBeNull();
  });

  it('rejects "default" as an animal', () => {
    expect(resolveAnimal('default')).toBeNull();
  });
});

describe('resolveFruit', () => {
  it('resolves exact match', () => {
    expect(resolveFruit('apple')).toBe('apple');
    expect(resolveFruit('banana')).toBe('banana');
    expect(resolveFruit('mango')).toBe('mango');
  });

  it('is case-insensitive', () => {
    expect(resolveFruit('Apple')).toBe('apple');
    expect(resolveFruit('BANANA')).toBe('banana');
  });

  it('depluralizes', () => {
    expect(resolveFruit('apples')).toBe('apple');
    expect(resolveFruit('cherries')).toBe('cherry');
  });

  it('returns null for unknown fruits', () => {
    expect(resolveFruit('zorgfruit')).toBeNull();
    expect(resolveFruit('')).toBeNull();
  });
});

describe('depluralize', () => {
  it('handles -ies', () => {
    expect(depluralize('butterflies')).toEqual(['butterfly']);
    expect(depluralize('cherries')).toEqual(['cherry']);
  });

  it('handles -ves', () => {
    const result = depluralize('wolves');

    expect(result).toContain('wolf');
    expect(result).toContain('wolfe');
  });

  it('handles -es', () => {
    expect(depluralize('foxes')).toContain('fox');
  });

  it('handles simple -s', () => {
    expect(depluralize('dogs')).toContain('dog');
  });

  it('returns empty for short words', () => {
    expect(depluralize('as')).toEqual([]);
    expect(depluralize('is')).toEqual([]);
  });
});
