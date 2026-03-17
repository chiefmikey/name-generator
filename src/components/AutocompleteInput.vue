<template>
  <div class="input-group">
    <label class="input-label">{{ label }}</label>
    <div class="ac-inline">
      <input
        ref="input"
        :value="modelValue"
        :class="['styled-input', { 'input-error': showError }]"
        type="text"
        :placeholder="placeholder"
        autocomplete="off"
        @input="onInput($event.target.value)"
        @blur="touched = true"
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
      class="error-text"
      :class="{ 'error-text-hidden': !showError }"
    >{{ showError ? error : '&nbsp;' }}</span>
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

  data() {
    return {
      touched: false,
    };
  },

  computed: {
    showError() {
      return this.touched && this.error;
    },

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
    onInput(value) {
      this.$emit('update:modelValue', value);
      if (!value.trim()) this.touched = false;
    },

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
  height: 3.25rem;
  padding: 0 1rem;
  overflow: hidden;
  pointer-events: none;
}

.ac-spacer {
  font-family: inherit;
  font-size: 1rem;
  color: transparent;
  white-space: pre;
}

.ac-hint {
  font-family: inherit;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.2);
  white-space: pre;

  .emo-active & {
    color: rgba(100, 50, 160, 0.3);
  }
}

@media (min-width: 520px) {
  .ac-ghost {
    height: 3.5rem;
    padding: 0 1.125rem;
  }
}
</style>
