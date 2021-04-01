import React from 'react';
import axios from 'axios';

class Fruit extends React.Component {
  constructor() {
    super();
    this.state = {
      fruitInput: '',
      foundFruit: '',
      sugar: null,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getFruit = this.getFruit.bind(this);
  }

  onChange(event) {
    event.preventDefault();
    this.setState({ fruitInput: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();
    this.getFruit();
  }

  getFruit() {
    const { fruitInput, foundFruit, sugar } = this.state;
    const { logFruit } = this.props;
    let fruitDefault;
    let sugarDefault;
    const fruitSearch = {
      method: 'get',
      url: '/submit/fruit',
      params: { fruitInput },
    };
    axios(fruitSearch)
      .then((res) => {
        fruitDefault = res.data.name ? res.data.name
          : fruitInput[0].toUpperCase() + fruitInput.slice(1);
        // sugarDefault = String(res.data.nutritions.sugar).replace('.', '');
        sugarDefault = res.data.nutritions.sugar ? String(res.data.nutritions.sugar).replace('.', '') : '510';
        this.setState({ foundFruit: fruitDefault, sugar: sugarDefault },
          logFruit(fruitDefault, sugarDefault));
      })
      .catch((error) => console.error('error in fruit search', error));
    this.setState({ fruitInput: '' });
  }

  render() {
    const { fruitInput } = this.state;
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input type="text" name="fruit" onChange={this.onChange} value={fruitInput} />
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default Fruit;
