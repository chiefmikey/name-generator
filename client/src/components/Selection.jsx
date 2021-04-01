import React from 'react';

const Selection = ({
  birthday, animal, fruit, submit, result,
}) => {
  let button = <button type="submit" id="submit-disable" onClick={submit} disabled>Submit</button>;
  if (birthday && animal && fruit && !result) {
    button = <button type="submit" id="submit" onClick={submit}>Submit</button>;
  }
  return (

  <div id="selection">
    <div>
      <h5>Birthday:</h5>
      {' '}
      {birthday || 'none'}
    </div>
    <div>
      <h5>Animal:</h5>
      {' '}
      {animal || 'none'}
    </div>
    <div>
      <h5>Fruit:</h5>
      {' '}
      {fruit || 'none'}
    </div>
    <div id="submit">
      {button}
    </div>
  </div>
)};

export default Selection;
