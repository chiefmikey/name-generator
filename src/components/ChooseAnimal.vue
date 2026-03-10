<template>
  <div class="input-group">
    <label class="input-label">Favorite Animal</label>
    <input
      :value="modelValue"
      class="styled-input"
      type="text"
      placeholder="Dog, cat, snake..."
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ChooseAnimal',

  props: {
    modelValue: {
      default: '',
      type: String,
    },
  },

  emits: ['update:modelValue'],
});
</script>
