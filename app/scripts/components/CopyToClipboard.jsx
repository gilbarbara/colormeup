import React from 'react';
import PropTypes from 'prop-types';
import Clipboard from 'clipboard';

export default class CopyToClipboard extends React.Component {
  state = {
    copied: false,
  };

  static propTypes = {
    className: PropTypes.string,
    text: PropTypes.string.isRequired,
  };

  static defaultProps = {
    className: '',
  };

  componentDidMount() {
    this.clipboard = new Clipboard(this.button);

    this.clipboard.on('success', () => {
      this.setState({ copied: true });
      clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        this.setState({ copied: false });
      }, 2000);
    });
  }

  componentWillUnmount() {
    this.clipboard.destroy();
  }

  render() {
    const { copied } = this.state;
    const { className, text } = this.props;
    const classNames = className.split(' ');

    if (copied) {
      classNames.push('tooltipped', 'tooltipped-sw');
    }

    if (!Clipboard.isSupported()) return null;

    return (
      <button
        ref={c => (this.button = c)}
        className={classNames.join(' ')}
        title="Copy to clipboard"
        aria-label="Copied!"
        data-clipboard-text={text}
      >
        <span className="fa fa-clipboard" />
      </button>
    );
  }
}
