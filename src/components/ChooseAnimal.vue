<template>
  <div class="input-group">
    <label class="input-label">Favorite Animal</label>
    <input
      :value="modelValue"
      :class="['styled-input', { 'input-error': error }]"
      type="text"
      list="animal-options"
      placeholder="Dog, cat, snake..."
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <datalist id="animal-options">
      <option
        v-for="name in animalNames"
        :key="name"
        :value="name"
      />
    </datalist>
    <span
      v-if="error"
      class="error-text"
    >{{ error }}</span>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import animals from '../data/animals.json';

const animalNames = Object.keys(animals)
  .filter((k) => k !== 'default')
  .sort();

export default defineComponent({
  name: 'ChooseAnimal',

  props: {
    modelValue: {
      default: '',
      type: String,
    },
    error: {
      default: '',
      type: String,
    },
  },

  emits: ['update:modelValue'],

  data() {
    return {
      animalNames,
    };
  },
});
</script>
