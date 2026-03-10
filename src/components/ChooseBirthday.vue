<template>
  <div class="input-group">
    <label class="input-label">Your Birthday</label>
    <div class="select-row">
      <select
        v-model="month"
        class="styled-select"
        @change="emitValue"
      >
        <option value="">Month</option>
        <option
          v-for="m in 12"
          :key="m"
          :value="m"
        >
          {{ monthNames[m - 1] }}
        </option>
      </select>
      <select
        v-model="day"
        class="styled-select"
        @change="emitValue"
      >
        <option value="">Day</option>
        <option
          v-for="d in 31"
          :key="d"
          :value="d"
        >
          {{ d }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ChooseBirthday',

  props: {
    modelValue: {
      default: '',
      type: String,
    },
  },

  emits: ['update:modelValue'],

  data() {
    return {
      month: '',
      day: '',
      monthNames: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    };
  },

  methods: {
    emitValue() {
      if (this.month && this.day) {
        this.$emit('update:modelValue', `${this.month}-${this.day}`);
      }
    },
  },
});
</script>
