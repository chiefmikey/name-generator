<template>
  <div>
    <form @submit.prevent="onSubmit">
      <select
        id="monthSelect"
        v-model="monthInput"
      >
        <option value="">
          Month
        </option>
        <option
          v-for="month in months"
          :key="month.id"
          :value="month.date"
        >
          {{ month.date }}
        </option>
      </select>
      <select
        id="daySelect"
        v-model="dayInput"
      >
        <option value="">
          Day
        </option>
        <option
          v-for="day in days"
          :key="day.id"
          :value="day.date"
        >
          {{ day.date }}
        </option>
      </select>
      <button
        class="submit-button"
        type="submit"
      >
        Submit
      </button>
    </form>
  </div>
</template>

<script>
const choose = {
  method: {
    required: true,
    type: Function,
  },

  emits: ['logBirthday'],

  data() {
    return {
      monthInput: '',
      dayInput: '',
      days: [],
      months: [],
    };
  },

  beforeMount() {
    const monthKey = 0;
    for (let index = 1; index <= 12; index += 1) {
      const theMonth = String(index);
      this.months.push({ id: monthKey, date: theMonth });
      this.monthKey += 1;
    }

    const dayKey = 0;
    for (let index = 1; index <= 31; index += 1) {
      const theDay = String(index);
      this.days.push({ id: dayKey, date: theDay });
      this.dayKey += 1;
    }
  },

  methods: {
    onSubmit() {
      const date = `${this.monthInput}-${this.dayInput}`;
      this.$emit('logBirthday', date);
      this.monthInput = '';
      this.dayInput = '';
    },
  },
};
export default choose;
</script>

<style lang="stylus"></style>
