<template>
  <AutocompleteInput
    :model-value="modelValue"
    :options="fruitNames"
    :error="error"
    label="Pick a Fruit"
    placeholder="Apple, banana, mango..."
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script>
import { defineComponent } from 'vue';

import fruits from '../data/fruits.json';

import AutocompleteInput from './AutocompleteInput.vue';

const fruitNames = Object.keys(fruits).sort();

export default defineComponent({
  name: 'ChooseFruit',

  components: { AutocompleteInput },

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
