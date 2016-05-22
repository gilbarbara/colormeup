import React from 'react';

export default function() {
  return (
    <div className="app__footer">
      <a href="http://kollectiv.org/" target="_blank">
        <img src={require('../../media/kollectiv.svg')} width="120" alt="Kollectiv" />
      </a>
      <a href="https://github.com/gilbarbara/colormeup" target="_blank">
        <img src={require('../../media/github.svg')} width="50" alt="github" />
      </a>
    </div>
  );
}
