<template>
  <div class="wrapper">
    <div id="header">NAME GENERATOR</div>
    <div id="main">
      <h4>Your Birthday:</h4>
      <Birthday @logBirthday="logBirthday" />
      <h4>Favorite Animal:</h4>
      <Animal :birthday="birthday" @logPet="logPet" />
      <h4>Pick a Fruit:</h4>
      <Fruit @logFruit="logFruit" />
      <Selection :birthday="birthday" :animal="animal" :fruit="fruit" />
      <form @submit.prevent="handleSubmit">
        <button class="submit-button-main" type="submit">Submit</button>
      </form>
      <h4>
        Emo Mode:
        <input v-model="emo" type="checkbox" />
      </h4>
      <div v-if="emo" id="result">
        <h3>Your New Name:</h3>
        <div id="new-name">
          <h2>{{ emoResult }}</h2>
        </div>
      </div>
      <div v-else id="result">
        <h3>Your New Name:</h3>
        <div id="new-name">
          <h2>{{ mainResult }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Animal from './Animal.vue';
import Birthday from './Birthday.vue';
import Fruit from './Fruit.vue';
import Selection from './Selection.vue';

export default {
  components: {
    Animal,
    Birthday,
    Fruit,
    Selection,
  },

  data() {
    return {
      emotion: '',
      normalEmotion: '',
      emoEmotion: '',
      animal: '',
      petName: '',
      birthday: '',
      fruit: '',
      sugar: '',
      emo: false,
      result: false,
      mainResult: '',
      emoResult: '',
    };
  },

  methods: {
    handleSubmit() {
      this.getEmotion(this.emo);
      this.checkAll();
    },

    getEmotion() {
      axios
        .get('/submit/emotion')
        .then((res) => {
          const random = Math.floor(Math.random() * res.data.length);
          const randomEmotion1 = res.data[random].word;
          this.emotion = randomEmotion1;
          this.normalEmotion = randomEmotion1;
        })
        .catch((error) => {
          console.error('error in get emotion', error);
        });
      axios
        .get('/submit/emotion/emo')
        .then((res) => {
          const random = Math.floor(Math.random() * res.data.length);
          const randomEmotion2 = res.data[random].word;
          this.emoEmotion = randomEmotion2;
        })
        .catch((error) => {
          console.error('error in get emotion', error);
        });
    },

    postAll() {
      const theEmotion = this.emotion || 'chief';
      const theEmo = this.emoEmotion || 'sadly';
      const thePetName = this.petName || 'mikey';
      const theSugar = this.sugar || '3000';
      const mainResult = `${theEmotion}_${thePetName}_${theSugar}`;
      const emoResult = `_xXx_${theEmo}_${thePetName}_666_xXx_`;

      axios
        .post('/submit/post', {
          emotion: this.emotion,
          normalEmotion: this.normalEmotion,
          emoEmotion: this.emoEmotion,
          animal: this.animal,
          petName: this.petName,
          birthday: this.birthday,
          fruit: this.fruit,
          sugar: this.sugar,
          result: this.result,
          mainResult: this.mainResult,
          emoResult: this.emoResult,
        })
        .catch((error) => {
          console.error('error in submit post', error);
        });
      this.result = true;
      this.mainResult = mainResult;
      this.emoResult = emoResult;
    },

    checkAll() {
      const checkIt = {
        method: 'get',
        url: '/submit/get',
        params: {
          birthday: this.birthday,
          fruit: this.fruit,
          animal: this.animal,
        },
      };
      axios(checkIt)
        .then((res) => {
          if (res.data[0]) {
            this.result = true;
            this.emotion = res.data[0].emotion;
            this.normalEmotion = res.data[0].normalEmotion;
            this.emoEmotion = res.data[0].emoEmotion;
            this.petName = res.data[0].petName;
            this.sugar = res.data[0].sugar;
            this.mainResult = res.data[0].mainResult;
            this.emoResult = res.data[0].emoResult;
          } else {
            this.postAll();
          }
        })
        .catch((error) => {
          console.error('error in check it', error);
        });
    },

    logBirthday(birthday) {
      this.getEmotion(this.emo);
      this.birthday = birthday;
      this.result = false;
    },

    logPet(animal, petName) {
      this.animal = animal;
      this.petName = petName;
      this.result = false;
    },

    logFruit(fruit, sugar) {
      this.fruit = fruit;
      this.sugar = sugar;
      this.result = false;
    },

    logResult(mainResult, emoResult) {
      this.mainResult = mainResult;
      this.emoResult = emoResult;
    },
  },
};
</script>

<style lang="stylus">
*, *::before, *::after
  box-sizing border-box

html, body
  font 16px/1.2 BlinkMacSystemFont, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif
  padding 10px

.wrapper
  margin 0 auto
  display flex
  flex-direction column
  align-items center

form
  margin-bottom 20px

input[type="text"]
  width 200px
  padding 10px
  border 1px solid #777
</style>
