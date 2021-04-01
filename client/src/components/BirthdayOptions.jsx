import React from 'react';

const BirthdayOptions = ({ month, day }) => {
  let key = 0;
  if (month) {
    const options = [];
    for (let i = 1; i <= 12; i += 1) {
      let theMonth = String(i);
      if (theMonth.length < 2) {
        theMonth = `0${theMonth}`;
      }
      options.push(<option key={key} value={theMonth}>{String(i)}</option>);
      key += 1;
    }
    return options;
  }
  if (day) {
    const options = [];
    for (let i = 1; i <= 31; i += 1) {
      let theDay = String(i);
      if (theDay.length < 2) {
        theDay = `0${theDay}`;
      }
      options.push(<option key={key} value={theDay}>{String(i)}</option>);
      key += 1;
    }
    return options;
  }
  return 'none';
};

export default BirthdayOptions;
