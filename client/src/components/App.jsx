import React from 'react';
import axios from 'axios';
import Animal from './Animal.jsx';
import Birthday from './Birthday.jsx';
import Fruit from './Fruit.jsx';
import Emo from './Emo.jsx';
import Selection from './Selection.jsx';
import Result from './Result.jsx';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
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
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getEmotion = this.getEmotion.bind(this);
    this.checkAll = this.checkAll.bind(this);
    this.postAll = this.postAll.bind(this);
    this.logBirthday = this.logBirthday.bind(this);
    this.logPet = this.logPet.bind(this);
    this.logFruit = this.logFruit.bind(this);
    this.logResult = this.logResult.bind(this);
    this.selectChange = this.selectChange.bind(this);
  }

  handleSubmit() {
    this.checkAll();
  }

  getEmotion(emo) {
    let chosenEmotion;
    axios.get('/submit/emotion')
      .then((res) => {
        const randomEmotion1 = res.data[Math.floor(Math.random() * res.data.length)].word;
        this.setState({ emotion: randomEmotion1, normalEmotion: randomEmotion1 });
      })
      .catch((error) => {
        console.error('error in get emotion', error);
      });
    axios.get('/submit/emotion/emo')
      .then((res) => {
        const randomEmotion2 = res.data[Math.floor(Math.random() * res.data.length)].word;
        this.setState({ emoEmotion: randomEmotion2 });
      })
      .catch((error) => {
        console.error('error in get emotion', error);
      });
  }

  postAll() {
    const {
      emotion, normalEmotion, emoEmotion, animal, petName, birthday, fruit, sugar, result,
    } = this.state;

    const theEmotion = emotion || 'chief';
    const theEmo = emoEmotion || 'sadly';
    const thePetName = petName || 'mikey';
    const theSugar = sugar || '3000';
    const mainResult = `${theEmotion}_${thePetName}_${theSugar}`;
    const emoResult = `_xXx_${theEmo}_${thePetName}_${theSugar}_xXx_`;

    axios.post('/submit/post', {
      emotion, normalEmotion, emoEmotion, animal, petName, birthday, fruit, sugar, result, mainResult, emoResult,
    })
      .catch((error) => {
        console.error('error in submit post', error);
      });
    this.setState({ result: true, mainResult, emoResult });
  }

  checkAll() {
    const { birthday, fruit, animal } = this.state;
    const checkIt = {
      method: 'get',
      url: '/submit/get',
      params: { birthday, fruit, animal },
    };
    axios(checkIt)
      .then((res) => {
        if (res.data[0]) {
          this.setState({ result: true, emotion: res.data[0].emotion, normalEmotion: res.data[0].normalEmotion, emoEmotion: res.data[0].emoEmotion, petName: res.data[0].petName, sugar: res.data[0].sugar, mainResult: res.data[0].mainResult, emoResult: res.data[0].emoResult });
        } else {
          this.postAll();
        }
      })
      .catch((error) => {
        console.error('error in check it', error);
      });
  }

  logBirthday(birthday) {
    const { emo } = this.state;
    this.getEmotion(emo);
    this.setState({ birthday, result: false });
  }

  logPet(animal, petName) {
    this.setState({ animal, petName, result: false });
  }

  logFruit(fruit, sugar) {
    this.setState({ fruit, sugar, result: false });
  }

  logResult(mainResult, emoResult) {
    this.setState({ mainResult, emoResult });
  }

  selectChange() {
    const { emo, normalEmotion, emoEmotion } = this.state;
    if (emo) {
      this.setState({ emo: false, emotion: normalEmotion });
    } else {
      this.setState({ emo: true, emotion: emoEmotion });
    }
  }

  render() {
    const {
      emotion, animal, petName, fruit, sugar, birthday, emo, result, mainResult, emoResult,
    } = this.state;
    return (
      <>
        <div id="header">
          <h2>The</h2>
          <h1>Myspace Name</h1>
          <h2>Generator</h2>
        </div>
        <div id="main">
          <h4>Your Birthday:</h4>
          <Birthday logBirthday={this.logBirthday} />
          <h4>Favorite Animal:</h4>
          <Animal logPet={this.logPet} birthday={birthday} />
          <h4>Pick a Fruit:</h4>
          <Fruit logFruit={this.logFruit} />
          <Selection birthday={birthday} animal={animal} fruit={fruit} submit={this.handleSubmit} result={result} />
          <Emo selectChange={this.selectChange} emo={emo} />
          {result ? <Result emo={emo} mainResult={mainResult} emoResult={emoResult} />
            : undefined}
        </div>
      </>
    );
  }
}

export default App;
