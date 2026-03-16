<template>
  <div class="page">
    <div class="card">
      <h1 class="title">NAME GENERATOR</h1>
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

      <transition name="result-fade">
        <div
          v-if="hasResult"
          class="result-card"
        >
          <div class="result-text">
            {{ displayResult }}
          </div>
          <button
            type="button"
            class="copy-btn"
            @click="copyResult"
          >
            {{ copied ? 'Copied!' : 'Copy' }}
          </button>
        </div>
      </transition>

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

        this.mainResult = `${emotion}_${petName}_${sugar}`;
        this.emoResult = `_xXx_${emoEmotion}_${petName}_666_xXx_`;

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
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
}

.card {
  width: 100%;
  max-width: 480px;
  padding: 2.5rem 2rem;
  background: rgba(15, 15, 35, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.25rem;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.5),
    0 0 100px rgba(100, 60, 255, 0.08);
  backdrop-filter: blur(20px);
}

.title {
  font-size: 2rem;
  font-weight: 900;
  color: #fff;
  text-align: center;
  letter-spacing: 0.15em;
}

.subtitle {
  margin-top: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.45);
  text-align: center;
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
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder {
    color: rgba(255, 255, 255, 0.25);
  }

  &:focus {
    border-color: #00d4aa;
    box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.15);
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
  transition: opacity 0.2s, transform 0.15s;

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
}

.result-text {
  font-size: 1.35rem;
  font-weight: 800;
  color: #00ffc8;
  word-break: break-all;
  text-shadow: 0 0 30px rgba(0, 255, 200, 0.3);
}

.copy-btn {
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

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.12);
  }
}

.result-fade-enter-active {
  transition: all 0.4s ease-out;
}

.result-fade-leave-active {
  transition: all 0.2s ease-in;
}

.result-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.result-fade-leave-to {
  opacity: 0;
}

.footer {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.25);
  text-align: center;

  a {
    color: rgba(255, 255, 255, 0.45);
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: #00d4aa;
    }
  }
}
</style>
