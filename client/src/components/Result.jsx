import React from 'react';

const Result = ({ emo, mainResult, emoResult }) => {
  if (emo) {
    return (
      <div id="result">
        <h3>Your New Myspace Name:</h3>
        <div id="new-name">
          <h2>{emoResult}</h2>
        </div>
      </div>
    );
  }

  return (
    <div id="result">
      <h3>Your New Myspace Name:</h3>
      <div id="new-name">
        <h2>{mainResult}</h2>
      </div>
    </div>
  );
};

export default Result;
