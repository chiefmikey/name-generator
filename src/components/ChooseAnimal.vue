<template>
  <div>
    <form @submit.prevent="getPet">
      <input
        v-model="animalInput"
        aria-label="animalInput"
        type="text"
        name="animalInput"
        placeholder="Dog, cat, etc."
      />
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
import axios from 'axios';

export default {
  props: {
    birthday: {
      required: true,
      type: String,
    },
  },

  method: {
    required: true,
    type: Function,
  },

  emits: ['logAnimal', 'logPet'],

  data() {
    return {
      animalInput: '',
    };
  },

  methods: {
    getPet() {
      const defaultBirthday = this.birthday === '' ? '01-13' : this.birthday;
      const defaultAnimal = this.animalInput.length > 0
        ? this.animalInput[0].toUpperCase() + this.animalInput.slice(1)
        : '';
      this.animalInput = '';
      this.$emit('logAnimal', defaultAnimal);
      const petSearch = {
        method: 'get',
        url: '/submit/animal',
        params: { defaultAnimal, defaultBirthday },
      };
      axios(petSearch)
        .then((response) => {
          const nameSplit = response.data.name.split(' ');
          const animalName = nameSplit[0];
          this.$emit('logPet', animalName);
        })
        .catch((error) => console.error('error in pet search', error));
    },
  },
};
</script>

<style lang="stylus"></style>
