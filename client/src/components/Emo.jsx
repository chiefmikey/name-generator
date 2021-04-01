import React from 'react';

const Emo = ({ selectChange, emo }) => (
  <h4>
    Emo Mode:
    <input checked={emo} type="checkbox" onChange={selectChange} />
  </h4>
);

export default Emo;
