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
        {birthday || '–'}
      </div>
      <div>
        <h5>Animal:</h5>
        {' '}
        {animal || '–'}
      </div>
      <div>
        <h5>Fruit:</h5>
        {' '}
        {fruit || '–'}
      </div>
      <div id="submit">
        {button}
      </div>
    </div>
  );
};

export default Selection;
