import React from 'react';

export default class NotFound extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div key="404" className="not-found">
        <h1>404</h1>
      </div>
    );
  }
}
