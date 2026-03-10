<template>
  <div class="input-group">
    <label class="input-label">Pick a Fruit</label>
    <input
      :value="modelValue"
      class="styled-input"
      type="text"
      placeholder="Apple, banana, mango..."
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ChooseFruit',

  props: {
    modelValue: {
      default: '',
      type: String,
    },
  },

  emits: ['update:modelValue'],
});
</script>
