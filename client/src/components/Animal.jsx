import React from 'react';
import axios from 'axios';

class Animal extends React.Component {
  constructor() {
    super();
    this.state = {
      animalInput: '',
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getPet = this.getPet.bind(this);
  }

  onChange(event) {
    event.preventDefault();
    this.setState({ animalInput: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();
    this.getPet();
    this.setState({ animalInput: '' });
  }

  getPet() {
    const { animalInput } = this.state;
    const { logPet, birthday } = this.props;
    const defaultBirthday = birthday === '' ? '01-13' : birthday;
    const defaultAnimal = animalInput === '' ? '' : animalInput[0].toUpperCase() + animalInput.slice(1);
    const petSearch = {
      method: 'get',
      url: '/submit/animal',
      params: { defaultAnimal, defaultBirthday },
    };
    axios(petSearch)
      .then((res) => {
        const nameSplit = res.data.name.split(' ');
        const animalName = nameSplit[0];
        this.setState({ animalInput: '' }, logPet(defaultAnimal, animalName));
      })
      .catch((error) => console.error('error in pet search', error));
  }

  render() {
    const { animalInput } = this.state;
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input type="text" name="fruit" onChange={this.onChange} value={animalInput} />
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default Animal;
