import React from 'react';
import PropTypes from 'prop-types';
import Clipboard from 'clipboard';

export default class CopyToClipboard extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    text: PropTypes.string.isRequired,
  };

  componentDidMount() {
    this.clipboard = new Clipboard(this.button);
  }

  componentWillUnmount() {
    this.clipboard.destroy();
  }

  render() {
    const { className, text } = this.props;

    return Clipboard.isSupported() && (
      <button
        ref={c => (this.button = c)}
        className={className}
        title="Copy to clipboard"
        data-clipboard-text={text}
      >
        <span className="fa fa-clipboard" />
      </button>
    );
  }
}
