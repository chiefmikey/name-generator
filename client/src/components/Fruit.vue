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

  emits: ['logFruit'],

  data() {
    return {
      fruitInput: '',
      foundFruit: '',
      sugar: null,
    };
  },

  methods: {
    getFruit() {
      let fruitDefault;
      let sugarDefault;
      const fruitSearch = {
        method: 'get',
        url: '/submit/fruit',
        params: { fruitInput: this.fruitInput },
      };
      axios(fruitSearch)
        .then((res) => {
          fruitDefault = res.data.name
            ? res.data.name
            : this.fruitInput[0].toUpperCase() + this.fruitInput.slice(1);
          // sugarDefault = String(res.data.nutritions.sugar).replace('.', '');
          sugarDefault = res.data.nutritions.sugar
            ? String(res.data.nutritions.sugar).replace('.', '')
            : '510';
          this.foundFruit = fruitDefault;
          this.sugar = sugarDefault;
          this.$emit('logFruit', fruitDefault, sugarDefault);
        })
        .catch((error) => console.error('error in fruit search', error));
      this.fruitInput = '';
    },
  },
};
</script>

<style lang="stylus"></style>
