<template>
  <div class="wrapper">
    <div class="header">NAME GENERATOR</div>
    <div class="main">
      <div
        v-for="item in items"
        :key="item.label"
      >
        <h4>{{ item.label }}:</h4>
        <component
          :is="item.component"
          v-model="item.model"
        />
      </div>
      <ChooseSelection
        :birthday="birthday"
        :animal="animal"
        :fruit="fruit"
      />
      <form @submit.prevent="checkAll">
        <button
          class="submit-button-main"
          :disabled="isFilled"
          type="submit"
        >
          Submit
        </button>
      </form>
      <h4>
        Emo Mode:
        <input
          v-model="emo"
          type="checkbox"
          aria-label="emo"
        />
      </h4>
      <h3>Your New Name:</h3>
      <div class="result">
        <div class="new-name">
          <h2 v-if="finalResults">
            {{ result }}
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { defineComponent } from 'vue';

import ChooseAnimal from './ChooseAnimal.vue';
import ChooseBirthday from './ChooseBirthday.vue';
import ChooseFruit from './ChooseFruit.vue';
import ChooseSelection from './ChooseSelection.vue';

export default defineComponent({
  name: 'App',

  components: {
    ChooseAnimal,
    ChooseBirthday,
    ChooseFruit,
    ChooseSelection,
  },

  data() {
    return {
      items: [
        {
          label: 'Your Birthday',
          component: 'ChooseBirthday',
          model: 'birthday',
        },
        {
          label: 'Favorite Animal',
          component: 'ChooseAnimal',
          model: 'animal',
        },
        { label: 'Pick a Fruit', component: 'ChooseFruit', model: 'fruit' },
      ],
      emotion: '',
      normalEmotion: '',
      emoEmotion: '',
      animal: '',
      petName: '',
      birthday: '',
      fruit: '',
      sugar: '',
      emo: false,
      mainResult: '',
      emoResult: '',
    };
  },

  computed: {
    isFilled() {
      return !(
        this.birthday.length > 0 &&
        this.animal.length > 0 &&
        this.fruit.length > 0
      );
    },

    finalResults() {
      return this.mainResult.length > 0 && this.emoResult.length > 0;
    },

    result() {
      return this.emo ? this.emoResult : this.mainResult;
    },
  },

  methods: {
    async getEmotion() {
      try {
        const response = await axios.get('/submit/emotion');
        const random = Math.floor(Math.random() * response.data.length);
        const randomEmotion1 = response.data[random].word;
        this.emotion = randomEmotion1;
        this.normalEmotion = randomEmotion1;
      } catch (error) {
        console.error('error in get emotion', error);
      }

      try {
        const response = await axios.get('/submit/emotion/emo');
        const random = Math.floor(Math.random() * response.data.length);
        const randomEmotion2 = response.data[random].word;
        this.emoEmotion = randomEmotion2;
      } catch (error) {
        console.error('error in get emotion', error);
      }
    },

    postAll() {
      const theEmotion = this.emotion || 'chief';
      const theEmo = this.emoEmotion || 'sadly';
      const thePetName = this.petName || 'mikey';
      const theSugar = this.sugar || '3000';
      const mainResult = `${theEmotion}_${thePetName}_${theSugar}`;
      const emoResult = `_xXx_${theEmo}_${thePetName}_666_xXx_`;
      this.mainResult = mainResult;
      this.emoResult = emoResult;
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
          mainResult,
          emoResult,
        })
        .catch((error) => {
          console.error('error in submit post', error);
        });
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
        .then((response) => {
          if (response.data[0]) {
            this.emotion = response.data[0].emotion;
            this.normalEmotion = response.data[0].normalEmotion;
            this.emoEmotion = response.data[0].emoEmotion;
            this.petName = response.data[0].petName;
            this.sugar = response.data[0].sugar;
            this.mainResult = response.data[0].mainResult;
            this.emoResult = response.data[0].emoResult;
          } else {
            this.postAll();
          }
        })
        .then(() => {
          this.animal = '';
          this.birthday = '';
          this.fruit = '';
        })
        .catch((error) => {
          console.error('error in check it', error);
        });
    },
  },
});
</script>

<style lang="scss">
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  font-family: Arial, Helvetica, sans-serif;
  padding: 10px;
  background-color: lightgray;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
}

h2,
h3,
h4,
h5,
h6 {
  padding: 5px 0;
  margin: 5px 0;
}

.wrapper {
  background-color: black;
  color: white;
  width: 500px;
  margin: auto;
  padding: 3rem;
  box-shadow: 10px 10px green;
}

.header {
  font-size: 24px;
  font-weight: 900;
  text-align: center;
  padding-bottom: 20px;
}

.main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

form {
  margin-bottom: 20px;
  align-self: center;
}

select {
  height: 30px;
}

input[type='text'] {
  width: 200px;
  height: 30px;
  padding: 10px;
  border: 1px solid #777;
}

.submit-button {
  height: 30px;
}

.submit-button-main {
  width: 300px;
  height: 50px;
  margin: 20px 0 10px;
  padding: 10px 20px;
}

.result {
  height: 50px;
  text-shadow: 4px 4px green;
}
</style>
