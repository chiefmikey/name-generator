import React from 'react';
import BirthdayOptions from './BirthdayOptions';

class Birthday extends React.Component {
  constructor() {
    super();
    this.state = {
      monthInput: '',
      dayInput: '',
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    event.preventDefault();
    if (event.target.id === 'monthSelect') {
      this.setState({ monthInput: event.target.value });
    }
    if (event.target.id === 'daySelect') {
      this.setState({ dayInput: event.target.value });
    }
  }

  onSubmit(event) {
    event.preventDefault();
    const { monthInput, dayInput } = this.state;
    const { logBirthday } = this.props;
    const date = `${monthInput}-${dayInput}`;
    logBirthday(date);
    this.setState({ monthInput: '', dayInput: '' });
  }

  render() {
    const { monthInput, dayInput } = this.state;
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <select id="monthSelect" onChange={this.onChange} value={monthInput}>
            <option value="">Month</option>
            <BirthdayOptions month />
          </select>
          <select id="daySelect" onChange={this.onChange} value={dayInput}>
            <option value="">Day</option>
            <BirthdayOptions day />
          </select>
          {/* <input type="text" name="birthday" onChange={this.onChange} value={birthdayInput} /> */}
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default Birthday;
