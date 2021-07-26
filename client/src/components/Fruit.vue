<template>
  <div>
    <form @submit.prevent="getFruit">
      <input
        v-model="fruitInput"
        type="text"
        name="fruit"
        placeholder="Apple, banana, etc."
      />
      <button class="submit-button" type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  method: {
    required: true,
    type: Function,
  },

  emits: ['logFruit', 'logSugar'],

  data() {
    return {
      fruitInput: '',
    };
  },

  methods: {
    getFruit() {
      const fruitDefault =
        this.fruitInput.length > 0
          ? this.fruitInput[0].toUpperCase() + this.fruitInput.slice(1)
          : '';
      if (fruitDefault.length > 0) {
        this.$emit('logFruit', fruitDefault);
      }
      const fruitSearch = {
        method: 'get',
        url: '/submit/fruit',
        params: { fruitInput: this.fruitInput },
      };
      axios(fruitSearch)
        .then((res) => {
          const sugarDefault = res.data.nutritions.sugar
            ? String(res.data.nutritions.sugar).replace('.', '')
            : '510';
          this.$emit('logSugar', sugarDefault);
        })
        .catch((error) => console.error('error in fruit search', error));
      this.fruitInput = '';
    },
  },
};
</script>

<style lang="stylus"></style>
