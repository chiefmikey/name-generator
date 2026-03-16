<template>
  <AutocompleteInput
    :model-value="modelValue"
    :options="animalNames"
    :error="error"
    label="Favorite Animal"
    placeholder="Dog, cat, snake..."
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script>
import { defineComponent } from 'vue';

import animals from '../data/animals.json';

import AutocompleteInput from './AutocompleteInput.vue';

const animalNames = Object.keys(animals)
  .filter((k) => k !== 'default')
  .sort();

export default defineComponent({
  name: 'ChooseAnimal',

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
      animalNames,
    };
  },
});
</script>
