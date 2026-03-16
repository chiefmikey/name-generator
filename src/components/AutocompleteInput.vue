<template>
  <div class="input-group">
    <label class="input-label">{{ label }}</label>
    <div class="ac-inline">
      <input
        ref="input"
        :value="modelValue"
        :class="['styled-input', { 'input-error': error }]"
        type="text"
        :placeholder="placeholder"
        autocomplete="off"
        @input="$emit('update:modelValue', $event.target.value)"
        @keydown="onKeydown"
      />
      <div
        v-if="hint"
        class="ac-ghost"
      >
        <span class="ac-spacer">{{ modelValue }}</span>
        <span class="ac-hint">{{ hint }}</span>
      </div>
    </div>
    <span
      v-if="error"
      class="error-text"
    >{{ error }}</span>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AutocompleteInput',

  props: {
    modelValue: {
      default: '',
      type: String,
    },
    options: {
      required: true,
      type: Array,
    },
    error: {
      default: '',
      type: String,
    },
    label: {
      required: true,
      type: String,
    },
    placeholder: {
      default: '',
      type: String,
    },
  },

  emits: ['update:modelValue'],

  computed: {
    hint() {
      const query = this.modelValue.toLowerCase();
      if (!query.trim()) return '';
      const match = this.options.find((opt) => opt.startsWith(query));
      if (!match || match === query) return '';
      return match.slice(query.length);
    },

    fullMatch() {
      const query = this.modelValue.toLowerCase();
      if (!query.trim()) return null;
      return this.options.find((opt) => opt.startsWith(query)) || null;
    },
  },

  methods: {
    onKeydown(e) {
      if (!this.hint) return;
      if (e.key === 'Tab' || e.key === 'ArrowRight') {
        const input = this.$refs.input;
        if (input.selectionStart === this.modelValue.length) {
          e.preventDefault();
          this.$emit('update:modelValue', this.fullMatch);
        }
      }
    },
  },
});
</script>

<style lang="scss">
.ac-inline {
  position: relative;
}

.ac-ghost {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  height: 2.75rem;
  padding: 0 0.875rem;
  overflow: hidden;
  pointer-events: none;
}

.ac-spacer {
  font-family: inherit;
  font-size: 0.95rem;
  color: transparent;
  white-space: pre;
}

.ac-hint {
  font-family: inherit;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.2);
  white-space: pre;

  .emo-active & {
    color: rgba(224, 64, 251, 0.25);
  }
}
</style>
