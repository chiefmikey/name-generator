<template>
  <div>
    <form @submit.prevent="onSubmit">
      <input
        v-model="animalInput"
        type="text"
        name="fruit"
        placeholder="Dog, cat, etc."
      />
      <button class="submit-button" type="submit">Submit</button>
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

  emits: ['logPet'],

  data() {
    return {
      animalInput: '',
    };
  },

  methods: {
    onSubmit() {
      this.getPet();
      this.animalInput = '';
    },

    getPet() {
      const defaultBirthday = this.birthday === '' ? '01-13' : this.birthday;
      const defaultAnimal =
        this.animalInput === ''
          ? ''
          : this.animalInput[0].toUpperCase() + this.animalInput.slice(1);
      const petSearch = {
        method: 'get',
        url: '/submit/animal',
        params: { defaultAnimal, defaultBirthday },
      };
      axios(petSearch)
        .then((res) => {
          const nameSplit = res.data.name.split(' ');
          const animalName = nameSplit[0];
          this.animalInput = '';
          this.$emit('logPet', defaultAnimal, animalName);
        })
        .catch((error) => console.error('error in pet search', error));
    },
  },
};
</script>

<style lang="stylus"></style>
