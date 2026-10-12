<template>
  <div class="input-group">
    <label class="input-label">Your Birthday</label>
    <div class="select-row">
      <select
        v-model="month"
        class="styled-select"
        @change="onMonthChange"
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
          v-for="d in maxDay"
          :key="d"
          :value="d"
        >
          {{ d }}
        </option>
      </select>
    </div>
    <span class="error-text error-text-hidden">&nbsp;</span>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

// February allows 29 because no year is collected.
const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function parseBirthday(value) {
  const empty = { day: '', month: '', value: '' };
  if (typeof value !== 'string') return empty;
  const found = /^(\d{1,2})-(\d{1,2})$/.exec(value);
  if (!found) return empty;
  const month = Number(found[1]);
  const day = Number(found[2]);
  if (month < 1 || month > 12 || day < 1 || day > DAYS_IN_MONTH[month - 1]) {
    return empty;
  }
  return { day, month, value: `${month}-${day}` };
}

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
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
    };
  },

  computed: {
    maxDay() {
      return this.month ? DAYS_IN_MONTH[this.month - 1] : 31;
    },

    composed() {
      return this.month && this.day ? `${this.month}-${this.day}` : '';
    },
  },

  watch: {
    modelValue: {
      handler(value) {
        const parsed = parseBirthday(value);
        // Ignore echoes of our own value so a partial selection survives.
        if (parsed.value === this.composed) return;
        this.month = parsed.month;
        this.day = parsed.day;
      },
      immediate: true,
    },
  },

  methods: {
    onMonthChange() {
      if (this.day && this.day > this.maxDay) this.day = '';
      this.emitValue();
    },

    emitValue() {
      this.$emit('update:modelValue', this.composed);
    },
  },
});
</script>
