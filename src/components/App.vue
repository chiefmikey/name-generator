<template>
  <div
    class="page"
    :class="{ 'emo-active': emo }"
  >
    <div class="card-wrapper">
      <transition name="emo-appear">
        <div
          v-if="emo"
          class="emo-decor"
        >
          <div class="emo-bar emo-bar-1" />
          <div class="emo-bar emo-bar-2" />
          <div class="emo-cross emo-cross-1" />
          <div class="emo-cross emo-cross-2" />
          <div class="emo-cross emo-cross-3" />
          <div class="emo-cross emo-cross-4" />
          <div class="emo-skull emo-skull-1" />
          <div class="emo-skull emo-skull-2" />
        </div>
      </transition>
      <div class="card">
        <h1 class="title">
          NAME GENERATOR
        </h1>
        <p class="subtitle">
          Your new identity starts here
        </p>

        <div class="form-area">
          <ChooseBirthday v-model="birthday" />
          <ChooseAnimal
            v-model="animal"
            :error="animalError"
          />
          <ChooseFruit
            v-model="fruit"
            :error="fruitError"
          />
        </div>

        <div class="action-area">
          <button
            type="button"
            class="generate-btn"
            :disabled="!isReady || hasResult"
            :class="{ 'generate-btn-done': hasResult }"
            @click="generate"
          >
            {{ buttonText }}
          </button>

          <div class="emo-toggle">
            <span :class="{ active: !emo }">Normal</span>
            <label class="toggle">
              <input
                v-model="emo"
                type="checkbox"
              />
              <span class="slider" />
            </label>
            <span :class="{ active: emo }">Emo Mode</span>
          </div>
        </div>

        <div class="result-area">
          <div
            class="result-card"
            :class="{ 'result-card-hidden': !hasResult }"
          >
            <div
              class="result-text"
              :style="{ fontSize: resultFontSize }"
            >
              {{ displayResult || '&nbsp;' }}
            </div>
          </div>
          <button
            type="button"
            class="copy-btn"
            :class="{ 'copy-btn-hidden': !hasResult }"
            @click="copyResult"
          >
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
        </div>

        <footer class="footer">
          made by
          <a
            href="https://github.com/chiefmikey"
            target="_blank"
            rel="noopener noreferrer"
          >chief mikey</a>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import animals from '../data/animals.json';
import emoEmotions from '../data/emo-emotions.json';
import emotions from '../data/emotions.json';
import fruits from '../data/fruits.json';

import ChooseAnimal from './ChooseAnimal.vue';
import ChooseBirthday from './ChooseBirthday.vue';
import ChooseFruit from './ChooseFruit.vue';

const emoFormats = [
  (e, p, n) => `_xXx_${e}_${p}_${n}_xXx_`,
  (e, p, n) => `~xXx~${e}_${p}_${n}~xXx~`,
  (e, p, n) => `x_${e}_${p}_${n}_x`,
  (e, p, n) => `xX_${e}_${p}_${n}_Xx`,
  (e, p, n) => `xx_${e}_${p}_${n}_xx`,
  (e, p, n) => `-x-_${e}_${p}_${n}_-x-`,
  (e, p, n) => `~*_${e}_${p}_${n}_*~`,
  (e, p, n) => `*~_${e}_${p}_${n}_~*`,
  (e, p, n) => `_-x-_${e}_${p}_${n}_-x-_`,
  (e, p, n) => `o0o_${e}_${p}_${n}_o0o`,
  (e, p, n) => `xo_${e}_${p}_${n}_ox`,
  (e, p, n) => `</3_${e}_${p}_${n}_</3`,
  (e, p, n) => `_-_${e}_${p}_${n}_-_`,
  (e, p, n) => `~+~_${e}_${p}_${n}_~+~`,
  (e, p, n) => `._x_${e}_${p}_${n}_x_.`,
  (e, p, n) => `*-*_${e}_${p}_${n}_*-*`,
  (e, p, n) => `~x~_${e}_${p}_${n}_~x~`,
];

const emoNums = [
  '666', '13', '333', '999', '616', '143', '831', '69', '420',
];

const postGenerateMessages = [
  'Enjoy the new you',
  'You are reborn',
  'Absolute perfection',
  'No refunds',
  'You are welcome',
  'Iconic, honestly',
  'Peak identity',
  'Unmatched aura',
  'Certified banger',
  'Main character era',
  'Born to slay',
  'Accept your destiny',
  'Vibe: shifted',
  'Tell your friends',
  'Go forth, legend',
  'Witness greatness',
  'Name unlocked',
  'This is you now',
  'Tattoo-worthy',
  'The crowd roars',
  'Prophecy fulfilled',
  'No going back',
  'Respect the name',
  'It was meant to be',
  'Consider it a gift',
  'Screenshot this',
  'Update your bio',
  'Pure excellence',
  'Flawless execution',
  'Chef kiss',
];

const emoPostMessages = [
  'Sad 4 u',
  'Pain is art',
  'Nobody gets it',
  'The void approves',
  'Darkness becomes u',
  'RIP old self',
  'Broken but cute',
  'Dead inside',
  'Tears forever',
  'Feel the pain',
  'Black suits you',
  'Screaming inside',
  'Forever alone',
  'So misunderstood',
  'Shattered, reborn',
  'Shadows know',
  'Let it bleed',
  'Born to suffer',
  'Embrace the dark',
  'No one cares',
  'Cry about it',
  'Fade to black',
  'Gone forever',
  'Hauntingly yours',
  'Beautifully tragic',
  'Cold and numb',
  'Welcome to pain',
  'Doomed, honestly',
  'It hurts so good',
  'Stay broken',
];

export default defineComponent({
  name: 'App',

  components: {
    ChooseAnimal,
    ChooseBirthday,
    ChooseFruit,
  },

  data() {
    return {
      birthday: '',
      animal: '',
      fruit: '',
      emo: false,
      mainResult: '',
      emoResult: '',
      generating: false,
      copied: false,
      postMessage: '',
      emoPostMessage: '',
    };
  },

  computed: {
    animalError() {
      if (!this.animal.trim()) return '';
      return this.resolveAnimal(this.animal) === null
        ? 'Not a recognized animal'
        : '';
    },

    fruitError() {
      if (!this.fruit.trim()) return '';
      return this.resolveFruit(this.fruit) === null
        ? 'Not a recognized fruit'
        : '';
    },

    buttonText() {
      if (this.generating) return 'Transforming...';
      if (this.hasResult) {
        return this.emo ? this.emoPostMessage : this.postMessage;
      }
      return "Let's Go";
    },

    isReady() {
      return (
        this.birthday.length > 0 &&
        this.animal.trim().length > 0 &&
        this.fruit.trim().length > 0 &&
        !this.animalError &&
        !this.fruitError
      );
    },

    hasResult() {
      return this.mainResult.length > 0;
    },

    displayResult() {
      return this.emo ? this.emoResult : this.mainResult;
    },

    resultFontSize() {
      const len = this.displayResult.length;
      const maxSize = 1.35;
      const minSize = 0.55;
      const longThreshold = 42;
      const shortThreshold = 18;
      if (len <= shortThreshold) return `${maxSize}rem`;
      if (len >= longThreshold) return `${minSize}rem`;
      const scale =
        (len - shortThreshold) / (longThreshold - shortThreshold);
      return `${(maxSize - scale * (maxSize - minSize)).toFixed(3)}rem`;
    },
  },

  watch: {
    birthday() {
      this.resetResult();
    },
    animal() {
      this.resetResult();
    },
    fruit() {
      this.resetResult();
    },
  },

  methods: {
    resetResult() {
      if (this.hasResult) {
        this.mainResult = '';
        this.emoResult = '';
        this.emo = false;
        this.copied = false;
        this.postMessage = '';
        this.emoPostMessage = '';
      }
    },

    depluralize(word) {
      if (word.endsWith('ies') && word.length > 4) {
        return [word.slice(0, -3) + 'y'];
      }
      const forms = [];
      if (word.endsWith('ves') && word.length > 4) {
        forms.push(word.slice(0, -3) + 'f');
        forms.push(word.slice(0, -3) + 'fe');
      }
      if (word.endsWith('es') && word.length > 3) {
        forms.push(word.slice(0, -2));
      }
      if (word.endsWith('s') && word.length > 2) {
        forms.push(word.slice(0, -1));
      }
      return forms;
    },

    resolveAnimal(value) {
      const key = value.toLowerCase().trim();
      if (key in animals && key !== 'default') return key;
      for (const candidate of this.depluralize(key)) {
        if (candidate in animals && candidate !== 'default') return candidate;
      }
      return null;
    },

    resolveFruit(value) {
      const key = value.toLowerCase().trim();
      if (key in fruits) return key;
      for (const candidate of this.depluralize(key)) {
        if (candidate in fruits) return candidate;
      }
      return null;
    },

    pickRandom(array) {
      return array[Math.floor(Math.random() * array.length)];
    },

    getSugar(fruitName) {
      const key = this.resolveFruit(fruitName);
      if (key !== null) {
        return String(fruits[key]).replace('.', '');
      }
      return '0';
    },

    getPetName(animalType) {
      const key = this.resolveAnimal(animalType);
      const names = key !== null ? animals[key] : animals.default;
      return this.pickRandom(names);
    },

    getCacheKey() {
      return `name-gen:${this.birthday}:${this.animal.toLowerCase()}:${this.fruit.toLowerCase()}`;
    },

    generate() {
      const cacheKey = this.getCacheKey();
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        const data = JSON.parse(cached);
        this.mainResult = data.mainResult;
        this.emoResult = data.emoResult;
        this.postMessage = this.pickRandom(postGenerateMessages);
        this.emoPostMessage = this.pickRandom(emoPostMessages);
        return;
      }

      this.generating = true;

      setTimeout(() => {
        const emotion = this.pickRandom(emotions);
        const emoEmotion = this.pickRandom(emoEmotions);
        const petName = this.getPetName(this.animal);
        const sugar = this.getSugar(this.fruit);
        const emoFormat = this.pickRandom(emoFormats);
        const emoNum = this.pickRandom(emoNums);

        this.mainResult = `${emotion}_${petName}_${sugar}`;
        this.emoResult = emoFormat(emoEmotion, petName, emoNum);
        this.postMessage = this.pickRandom(postGenerateMessages);
        this.emoPostMessage = this.pickRandom(emoPostMessages);

        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            emoResult: this.emoResult,
            mainResult: this.mainResult,
          }),
        );

        this.generating = false;
      }, 800);
    },

    copyResult() {
      navigator.clipboard.writeText(this.displayResult);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 1500);
    },
  },
});
</script>

<style lang="scss">
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  touch-action: pan-y;
}

body {
  position: fixed;
  inset: 0;
  overflow: hidden;
}

.page {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 2rem 1rem;
  overflow-x: hidden;
  touch-action: pan-y;
  overflow-y: auto;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);

  &::before {
    content: '';
    position: fixed;
    inset: 0;
    background: linear-gradient(
      135deg,
      #0a0a0a 0%,
      #0d0518 30%,
      #08020f 60%,
      #030105 100%
    );
    opacity: 0;
    transition: opacity 0.6s ease;
    z-index: 0;
  }

  &.emo-active::before {
    opacity: 1;
  }
}

.card-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 320px;
}

.card {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 1.5rem 1rem;
  background: rgba(15, 15, 35, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.5),
    0 0 100px rgba(100, 60, 255, 0.08);
  backdrop-filter: blur(20px);
  transition: border-color 0.4s ease, box-shadow 0.4s ease,
    background 0.4s ease;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent 0px,
      transparent 3px,
      rgba(0, 0, 0, 0.06) 3px,
      rgba(0, 0, 0, 0.06) 6px
    );
    border-radius: inherit;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 2;
  }

  .emo-active & {
    background: rgba(5, 2, 5, 0.95);
    border-color: rgba(55, 12, 85, 0.25);

    &::after {
      opacity: 1;
    }
    box-shadow:
      0 25px 50px rgba(0, 0, 0, 0.7),
      0 0 60px rgba(55, 12, 85, 0.15),
      0 0 120px rgba(55, 12, 85, 0.05);
    animation: emo-border-pulse 3s ease-in-out infinite;
  }
}

@keyframes emo-border-pulse {
  0%,
  100% {
    box-shadow:
      0 25px 50px rgba(0, 0, 0, 0.7),
      0 0 60px rgba(55, 12, 85, 0.15),
      0 0 120px rgba(55, 12, 85, 0.05);
  }

  50% {
    box-shadow:
      0 25px 50px rgba(0, 0, 0, 0.7),
      0 0 80px rgba(55, 12, 85, 0.3),
      0 0 160px rgba(55, 12, 85, 0.1);
  }
}

// Emo decorative elements (behind the card)
.emo-decor {
  position: absolute;
  inset: -30px;
  pointer-events: none;
  z-index: 0;
}

.emo-bar {
  position: absolute;
  left: -15%;
  width: 130%;
  height: 22px;
  background: repeating-linear-gradient(
    90deg,
    #5a2d88 0px,
    #5a2d88 3px,
    #0e0418 3px,
    #0e0418 7px
  );
  border-radius: 2px;
  opacity: 0.55;
}

.emo-bar-1 {
  top: 35%;
  transform: rotate(28deg);
}

.emo-bar-2 {
  bottom: 35%;
  transform: rotate(-28deg);
}

.emo-cross {
  position: absolute;
  width: 3px;
  height: 18px;
  background: #9966cc;
  opacity: 0.7;
  filter: drop-shadow(0 0 6px rgba(120, 60, 180, 0.6));
  animation: emo-cross-drift 20s linear infinite;

  &::after {
    content: '';
    position: absolute;
    top: 4px;
    left: -6px;
    width: 15px;
    height: 3px;
    background: inherit;
  }
}

.emo-cross-1 {
  top: -10px;
  left: -10px;
}

.emo-cross-2 {
  top: -10px;
  right: -10px;
  animation-delay: 5s;
  animation-direction: reverse;
}

.emo-cross-3 {
  bottom: -10px;
  left: -10px;
  animation-delay: 10s;
}

.emo-cross-4 {
  bottom: -10px;
  right: -10px;
  animation-delay: 15s;
  animation-direction: reverse;
}

@keyframes emo-cross-drift {
  0% {
    transform: rotate(0deg) translate(0, 0);
    opacity: 0.5;
  }

  25% {
    transform: rotate(90deg) translate(14px, -10px);
    opacity: 0.85;
  }

  50% {
    transform: rotate(180deg) translate(-8px, 12px);
    opacity: 0.5;
  }

  75% {
    transform: rotate(270deg) translate(10px, 8px);
    opacity: 0.85;
  }

  100% {
    transform: rotate(360deg) translate(0, 0);
    opacity: 0.5;
  }
}

@keyframes emo-float {
  0% {
    transform: translate(0, 0);
    opacity: 0.6;
  }

  20% {
    transform: translate(10px, -16px);
    opacity: 0.8;
  }

  40% {
    transform: translate(-6px, -8px);
    opacity: 0.65;
  }

  60% {
    transform: translate(12px, -20px);
    opacity: 0.8;
  }

  80% {
    transform: translate(-8px, -12px);
    opacity: 0.65;
  }

  100% {
    transform: translate(0, 0);
    opacity: 0.6;
  }
}

.emo-skull {
  position: absolute;
  width: 34px;
  height: 42px;
  opacity: 0.7;
  filter: drop-shadow(0 0 8px rgba(120, 60, 180, 0.6));
  animation: emo-float 7s ease-in-out infinite;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 34px;
    height: 32px;
    background:
      radial-gradient(circle 4px at 35% 52%, #06020f 99%, transparent 100%),
      radial-gradient(circle 4px at 65% 52%, #06020f 99%, transparent 100%),
      radial-gradient(ellipse 3px 4px at 50% 72%, #06020f 99%, transparent 100%),
      #6b3a9e;
    border-radius: 17px 17px 10px 10px;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 5px;
    width: 24px;
    height: 12px;
    background: repeating-linear-gradient(
      90deg,
      #6b3a9e 0px,
      #6b3a9e 3px,
      #06020f 3px,
      #06020f 4px
    );
    border-radius: 0 0 5px 5px;
  }
}

.emo-skull-1 {
  top: 3%;
  right: -22px;
  animation-delay: 1s;
}

.emo-skull-2 {
  bottom: 3%;
  left: -22px;
  animation-delay: 3s;
}

.emo-appear-enter-active {
  transition: all 0.5s ease-out;
}

.emo-appear-leave-active {
  transition: all 0.3s ease-in;
}

.emo-appear-enter-from,
.emo-appear-leave-to {
  opacity: 0;
  transform: scale(0.7);
}

.title {
  font-size: 1.35rem;
  font-weight: 900;
  text-align: center;
  letter-spacing: 0.08em;
  user-select: none;
  background: linear-gradient(135deg, #00ffc8 0%, #00b4d8 50%, #00d4aa 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: background 0.4s ease, filter 0.4s ease;

  .emo-active & {
    background: linear-gradient(135deg, #7744aa 0%, #4a1275 50%, #8855bb 100%);
    background-clip: text;
    -webkit-background-clip: text;
    filter: drop-shadow(0 0 20px rgba(80, 30, 120, 0.4));
  }
}

.subtitle {
  margin-top: 0.25rem;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
  text-align: center;
  user-select: none;
  transition: color 0.4s ease;

  .emo-active & {
    color: rgba(130, 70, 180, 0.5);
  }
}

.form-area {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.input-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  user-select: none;
  transition: color 0.4s ease;

  .emo-active & {
    color: rgba(130, 70, 180, 0.6);
  }
}

.styled-input,
.styled-select {
  width: 100%;
  height: 2.25rem;
  padding: 0 0.75rem;
  font-family: inherit;
  font-size: 1rem;
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
  border: 1.5px solid rgba(255, 255, 255, 0.7);
  border-radius: 0.625rem;
  outline: none;
  caret-color: #00d4aa;
  transition: border-color 0.2s, box-shadow 0.2s, background-color 0.4s;

  user-select: none;
  -webkit-user-select: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.35);
  }

  &:focus {
    border-color: #00d4aa;
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.15);
  }

  .emo-active & {
    background-color: rgba(55, 12, 85, 0.08);
    border-color: rgba(100, 40, 150, 0.5);
    caret-color: #7744aa;

    &:focus {
      border-color: #7744aa;
      box-shadow: 0 0 0 3px rgba(80, 30, 120, 0.2);
    }
  }

  &.input-error {
    border-color: #ff4757;
    box-shadow: 0 0 0 3px rgba(255, 71, 87, 0.15);

    &:focus {
      border-color: #ff4757;
      box-shadow: 0 0 0 3px rgba(255, 71, 87, 0.25);
    }
  }
}

.error-text {
  font-size: 0.6rem;
  font-weight: 500;
  color: #ff4757;
  user-select: none;

  &.error-text-hidden {
    visibility: hidden;
  }
}

.styled-select {
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.4)' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;

  option {
    color: #000;
    background: #fff;
  }
}

.select-row {
  display: flex;
  gap: 0.75rem;

  .styled-select {
    flex: 1;
  }
}

.action-area {
  padding: 1.25rem 0 0.5rem;
}

.result-area {
  padding: 0.75rem 0 0;
}

.generate-btn {
  display: block;
  width: 100%;
  height: 2.75rem;
  margin-bottom: 1rem;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  background: linear-gradient(135deg, #00d4aa 0%, #00b4d8 50%, #00d4aa 100%);
  background-size: 200% 100%;
  border: none;
  border-radius: 0.75rem;
  box-shadow:
    0 4px 15px rgba(0, 212, 170, 0.3),
    0 0 30px rgba(0, 180, 216, 0.1);
  transition: transform 0.2s, box-shadow 0.3s, background 0.4s,
    background-size 0.4s;
  animation: btn-shimmer 3s ease-in-out infinite;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow:
      0 6px 20px rgba(0, 212, 170, 0.4),
      0 0 40px rgba(0, 180, 216, 0.15);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(0, 212, 170, 0.2);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
    box-shadow: none;
    animation: none;
  }

  &.generate-btn-done {
    cursor: default;
    opacity: 0.7;
    animation: none;
  }

  .emo-active & {
    background: linear-gradient(135deg, #4a1275 0%, #2d0845 50%, #4a1275 100%);
    background-size: 200% 100%;
    box-shadow:
      0 4px 15px rgba(55, 12, 85, 0.4),
      0 0 30px rgba(55, 12, 85, 0.15);
    animation: btn-shimmer-emo 3s ease-in-out infinite;

    &:hover:not(:disabled) {
      box-shadow:
        0 6px 20px rgba(55, 12, 85, 0.5),
        0 0 40px rgba(55, 12, 85, 0.2);
    }
  }
}

@keyframes btn-shimmer {
  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

@keyframes btn-shimmer-emo {
  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

.emo-toggle {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  margin-bottom: 0;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.35);
  user-select: none;

  span.active {
    color: #fff;
    text-shadow: 0 0 0.5px #fff, 0 0 0.5px #fff;
  }
}

.toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;

  input {
    width: 0;
    height: 0;
    opacity: 0;

    &:checked + .slider {
      background: #4a1275;
    }

    &:checked + .slider::before {
      transform: translateX(20px);
    }
  }

  .slider {
    position: absolute;
    inset: 0;
    cursor: pointer;
    background: #00d4aa;
    border-radius: 24px;
    transition: background 0.3s;

    &::before {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 18px;
      height: 18px;
      background: #fff;
      border-radius: 50%;
      transition: transform 0.3s;
    }
  }
}

.result-card {
  position: relative;
  padding: 1rem 0.75rem;
  margin-bottom: 1rem;
  overflow: visible;
  text-align: center;
  background: rgba(0, 212, 170, 0.06);
  border: 1px solid rgba(0, 212, 170, 0.2);
  border-radius: 0.75rem;
  transition: background 0.4s ease, border-color 0.4s ease, opacity 0.4s ease;

  .emo-active & {
    background: rgba(80, 30, 120, 0.06);
    border-color: rgba(100, 40, 150, 0.25);
  }

  &.result-card-hidden {
    opacity: 0;
    pointer-events: none;
  }
}

.result-text {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 1.75rem;
  font-weight: 800;
  color: #00ffc8;
  white-space: nowrap;
  text-shadow: 0 0 30px rgba(0, 255, 200, 0.3);
  transition: color 0.4s ease, text-shadow 0.4s ease;

  .emo-active & {
    color: #9966cc;
    text-shadow: 0 0 30px rgba(100, 50, 160, 0.4);
  }
}

.copy-btn {
  display: block;
  min-width: 5.5rem;
  margin: 0 auto;
  padding: 0.45rem 1.25rem;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  user-select: none;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  transition: background 0.2s, color 0.2s, opacity 0.4s;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.12);
  }

  .emo-active & {
    border-color: rgba(100, 40, 150, 0.25);

    &:hover {
      background: rgba(80, 30, 120, 0.15);
    }
  }

  &.copy-btn-hidden {
    opacity: 0;
    pointer-events: none;
  }
}

.footer {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.25);
  text-align: center;
  user-select: none;
  transition: color 0.4s ease;

  a {
    color: rgba(255, 255, 255, 0.45);
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: #00d4aa;
    }

    .emo-active & {
      &:hover {
        color: #8855bb;
      }
    }
  }
}

@media (min-width: 520px) {
  .page {
    padding: 1rem;
  }

  .card-wrapper {
    max-width: 480px;
  }

  .card {
    padding: 2.5rem 2rem;
    border-radius: 1.25rem;
  }

  .title {
    font-size: 2rem;
    letter-spacing: 0.15em;
  }

  .subtitle {
    margin-top: 0.5rem;
    margin-bottom: 2rem;
    font-size: 0.85rem;
  }

  .form-area {
    gap: 1.25rem;
    margin-bottom: 1.75rem;
  }

  .input-group {
    gap: 0.4rem;
  }

  .input-label {
    font-size: 0.75rem;
  }

  .styled-input,
  .styled-select {
    height: 2.75rem;
    padding: 0 0.875rem;
    font-size: 0.95rem;
  }

  .error-text {
    font-size: 0.7rem;
  }

  .generate-btn {
    height: 3.5rem;
    margin-bottom: 1.25rem;
    font-size: 1.1rem;
  }

  .emo-toggle {
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    font-size: 0.8rem;
  }

  .result-card {
    padding: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .copy-btn {
    margin-bottom: 1.5rem;
  }
}
</style>
