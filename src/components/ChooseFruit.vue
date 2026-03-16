<template>
  <div class="input-group">
    <label class="input-label">Pick a Fruit</label>
    <input
      :value="modelValue"
      :class="['styled-input', { 'input-error': error }]"
      type="text"
      list="fruit-options"
      placeholder="Apple, banana, mango..."
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <datalist id="fruit-options">
      <option
        v-for="name in fruitNames"
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

import fruits from '../data/fruits.json';

const fruitNames = Object.keys(fruits).sort();

export default defineComponent({
  name: 'ChooseFruit',

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
      fruitNames,
    };
  },
});
</script>
