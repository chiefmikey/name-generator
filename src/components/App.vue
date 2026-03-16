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
          <div class="emo-x emo-x-1">
            x
          </div>
          <div class="emo-x emo-x-2">
            x
          </div>
          <div class="emo-x emo-x-3">
            x
          </div>
          <div class="emo-x emo-x-4">
            x
          </div>
          <div class="emo-star emo-star-1">
            &lt;/3
          </div>
          <div class="emo-star emo-star-2">
            &lt;/3
          </div>
        </div>
      </transition>
      <div class="card">
        <h1 class="title">
          NAME GENERATOR
        </h1>
        <p class="subtitle">
          Generate your ultimate social media identity
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

        <button
          type="button"
          class="generate-btn"
          :disabled="!isReady"
          @click="generate"
        >
          {{ generating ? 'Generating...' : 'Generate My Name' }}
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
          <button
            type="button"
            class="copy-btn"
            :disabled="!hasResult"
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
  (e, p, n) => `x_${e}_${p}_${n}_x`,
  (e, p) => `~*${e}_${p}*~`,
  (e, p) => `*~${e}_${p}~*`,
  (e, p, n) => `xX_${e}_${p}${n}_Xx`,
  (e, p, n) => `-x-${e}_${p}_${n}-x-`,
  (e, p) => `_-_${e}_${p}_-_`,
  (e, p, n) => `..${e}_${p}_${n}..`,
  (e, p, n) => `xx_${e}_${p}_${n}_xx`,
  (e, p) => `${e}_${p}_</3`,
  (e, p, n) => `~${e}_${p}_${n}~`,
  (e, p) => `._${e}_${p}_.`,
  (e, p, n) => `rawr_${e}_${p}_${n}`,
  (e, p) => `o0o_${e}_${p}_o0o`,
  (e, p, n) => `xo_${e}_${p}_${n}_xo`,
  (e, p, n) => `--${e}_${p}_${n}--`,
  (e, p) => `${e}_x_${p}_x3`,
];

const emoNums = [
  '666', '13', '333', '999', '616', '143', '831', '69', '420',
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
      const minSize = 0.7;
      const longThreshold = 42;
      const shortThreshold = 18;
      if (len <= shortThreshold) return `${maxSize}rem`;
      if (len >= longThreshold) return `${minSize}rem`;
      const scale =
        (len - shortThreshold) / (longThreshold - shortThreshold);
      return `${(maxSize - scale * (maxSize - minSize)).toFixed(3)}rem`;
    },
  },

  methods: {
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

        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            emoResult: this.emoResult,
            mainResult: this.mainResult,
          }),
        );

        this.generating = false;
      }, 400);
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
}

.page {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      #0a0a0a 0%,
      #1a0015 30%,
      #0d0011 60%,
      #050005 100%
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
  max-width: 480px;
}

.card {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 2.5rem 2rem;
  background: rgba(15, 15, 35, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.25rem;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.5),
    0 0 100px rgba(100, 60, 255, 0.08);
  backdrop-filter: blur(20px);
  transition: border-color 0.4s ease, box-shadow 0.4s ease,
    background 0.4s ease;

  .emo-active & {
    background: rgba(10, 5, 15, 0.92);
    border-color: rgba(224, 64, 251, 0.3);
    box-shadow:
      0 25px 50px rgba(0, 0, 0, 0.7),
      0 0 60px rgba(224, 64, 251, 0.15),
      0 0 120px rgba(224, 64, 251, 0.05);
    animation: emo-border-pulse 3s ease-in-out infinite;
  }
}

@keyframes emo-border-pulse {
  0%,
  100% {
    box-shadow:
      0 25px 50px rgba(0, 0, 0, 0.7),
      0 0 60px rgba(224, 64, 251, 0.15),
      0 0 120px rgba(224, 64, 251, 0.05);
  }

  50% {
    box-shadow:
      0 25px 50px rgba(0, 0, 0, 0.7),
      0 0 80px rgba(224, 64, 251, 0.3),
      0 0 160px rgba(224, 64, 251, 0.1);
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
  background: repeating-conic-gradient(
      #e040fb 0% 25%,
      #1a0015 0% 50%
    )
    0 0 / 11px 11px;
  border-radius: 3px;
  opacity: 0.5;
}

.emo-bar-1 {
  top: 35%;
  transform: rotate(28deg);
}

.emo-bar-2 {
  bottom: 35%;
  transform: rotate(-28deg);
}

.emo-x {
  position: absolute;
  font-size: 2rem;
  font-weight: 900;
  font-style: italic;
  color: #e040fb;
  opacity: 0.5;
  text-shadow: 0 0 15px rgba(224, 64, 251, 0.6);
  animation: emo-x-pulse 4s ease-in-out infinite;
}

.emo-x-1 {
  top: -8px;
  left: -8px;
}

.emo-x-2 {
  top: -8px;
  right: -8px;
  animation-delay: 1s;
}

.emo-x-3 {
  bottom: -8px;
  left: -8px;
  animation-delay: 2s;
}

.emo-x-4 {
  bottom: -8px;
  right: -8px;
  animation-delay: 3s;
}

@keyframes emo-x-pulse {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }

  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

.emo-star {
  position: absolute;
  font-size: 2.5rem;
  font-weight: 900;
  color: #ff69b4;
  opacity: 0.35;
  text-shadow: 0 0 20px rgba(255, 105, 180, 0.5);
  animation: emo-star-spin 12s linear infinite;
}

.emo-star-1 {
  top: 15%;
  right: -20px;
}

.emo-star-2 {
  bottom: 15%;
  left: -20px;
  animation-direction: reverse;
  animation-delay: 2s;
}

@keyframes emo-star-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
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
  font-size: 2rem;
  font-weight: 900;
  color: #fff;
  text-align: center;
  letter-spacing: 0.15em;
  transition: color 0.4s ease, text-shadow 0.4s ease;

  .emo-active & {
    color: #e040fb;
    text-shadow: 0 0 30px rgba(224, 64, 251, 0.4);
  }
}

.subtitle {
  margin-top: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.45);
  text-align: center;
  transition: color 0.4s ease;

  .emo-active & {
    color: rgba(224, 64, 251, 0.5);
  }
}

.form-area {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.75rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.input-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: color 0.4s ease;

  .emo-active & {
    color: rgba(224, 64, 251, 0.55);
  }
}

.styled-input,
.styled-select {
  width: 100%;
  height: 2.75rem;
  padding: 0 0.875rem;
  font-family: inherit;
  font-size: 0.95rem;
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.625rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.4s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }

  &:focus {
    border-color: #00d4aa;
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.15);
  }

  .emo-active & {
    background: rgba(224, 64, 251, 0.04);
    border-color: rgba(224, 64, 251, 0.15);

    &:focus {
      border-color: #e040fb;
      box-shadow: 0 0 0 3px rgba(224, 64, 251, 0.15);
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
  font-size: 0.7rem;
  font-weight: 500;
  color: #ff4757;

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

.generate-btn {
  display: block;
  width: 100%;
  height: 3.25rem;
  margin-bottom: 1.25rem;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.05em;
  cursor: pointer;
  background: linear-gradient(135deg, #00d4aa 0%, #00b4d8 100%);
  border: none;
  border-radius: 0.75rem;
  transition: opacity 0.2s, transform 0.15s, background 0.4s;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    opacity: 0.9;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.35;
  }

  .emo-active & {
    background: linear-gradient(135deg, #e040fb 0%, #9c27b0 100%);
  }
}

.emo-toggle {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.35);

  span.active {
    color: #fff;
    font-weight: 600;
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
      background: #e040fb;
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
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  background: rgba(0, 212, 170, 0.06);
  border: 1px solid rgba(0, 212, 170, 0.2);
  border-radius: 0.75rem;
  transition: background 0.4s ease, border-color 0.4s ease, opacity 0.4s ease;

  .emo-active & {
    background: rgba(224, 64, 251, 0.06);
    border-color: rgba(224, 64, 251, 0.25);
  }

  &.result-card-hidden {
    opacity: 0;
    pointer-events: none;
  }
}

.result-text {
  font-weight: 800;
  color: #00ffc8;
  white-space: nowrap;
  text-shadow: 0 0 30px rgba(0, 255, 200, 0.3);
  transition: color 0.4s ease, text-shadow 0.4s ease;

  .emo-active & {
    color: #ff69b4;
    text-shadow: 0 0 30px rgba(255, 105, 180, 0.4);
  }
}

.copy-btn {
  min-width: 5.5rem;
  margin-top: 0.75rem;
  padding: 0.4rem 1rem;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.5rem;
  transition: background 0.2s, color 0.2s;

  &:hover:not(:disabled) {
    color: #fff;
    background: rgba(255, 255, 255, 0.12);
  }

  &:disabled {
    cursor: default;
    opacity: 0;
  }
}


.footer {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.25);
  text-align: center;
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
        color: #e040fb;
      }
    }
  }
}
</style>
