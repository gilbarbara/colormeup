import React from 'react';
import PropTypes from 'prop-types';

const KEYCODE_UP = 38;
const KEYCODE_DOWN = 40;
const SPEED = 50;
const DELAY = 500;

class NumericField extends React.Component {
  /**
   * @class
   * @description Set the initial state and create the "_timer" property to contain the
   * step timer. Then define all the private methods within the constructor.
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this._timer = null;

    this.state = {
      value: props.value ? this.parseValue(props.value) : '',
    };
  }

  static propTypes = {
    className: PropTypes.string,
    max: PropTypes.number,
    min: PropTypes.number,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    precision: PropTypes.number,
    step: PropTypes.number,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  };

  /**
   * The default behaviour is to start from 0, use step of 1 and display
   * integers
   */
  static defaultProps = {
    max: Number.MAX_SAFE_INTEGER || 9007199254740991,
    min: Number.MIN_SAFE_INTEGER || -9007199254740991,
    onChange: () => {},
    precision: 0,
    step: 1,
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ value: this.parseValue(nextProps.value) });
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  /**
   * Exclude the required props to pass it back.
   *
   * @param {Object} props
   * @augments this
   */
  getInputProps() {
    const excludeProps = [
      'className',
      'max',
      'min',
      'onChange',
      'precision',
      'step',
      'value',
    ];

    return Object.keys(this.props)
      .filter(d => !excludeProps.includes(d))
      .reduce((acc, idx) => {
        acc[idx] = this.props[idx];

        return acc;
      }, {});
  }

  /**
   * This is used internally to parse any value into a number.
   *
   * @private
   * @param {string|number} value
   * @returns {number}
   */
  parseValue(value) {
    const { precision } = this.props;
    let n = parseFloat(value);

    if (isNaN(n) || !isFinite(n)) {
      n = 0;
    }

    n = Math.min(Math.max(n, this.props.min), this.props.max);

    return parseFloat(n.toFixed(precision));
  }

  /**
   * The internal method that actually sets the new value on the input.
   *
   * @private
   * @param {number} num
   */
  updateStep(num) {
    const { value } = this.state;
    const { name, step } = this.props;
    const nextValue = this.parseValue(value + (step * num));

    if (nextValue !== value) {
      this.setState({ value: nextValue }, () => {
        this.props.onChange({ name, value: nextValue });
      });
    }
  }

  /**
   * Increments the value with one step and the enters a recursive calls
   * after DELAY. This is bound to the mousedown event on the "up" button
   * and will be stopped on mouseout/mouseup.
   *
   * @param {boolean} recursive - The method is passing this to itself while it is in recursive mode.
   * @param {boolean} doFocus
   */
  increase(recursive = false, doFocus = true) {
    this.stopTimer();
    this.updateStep(1);

    if (isNaN(this.state.value) || this.state.value < this.props.max) {
      this._timer = setTimeout(() => {
        this.increase(true);
      }, recursive ? SPEED : DELAY);
    }

    if (doFocus) {
      setTimeout(() => {
        this.input.focus();
      });
    }
  }

  /**
   * Decrements the value with one step and the enters a recursive calls
   * after DELAY. This is bound to the mousedown event on the "down" button
   * and will be stopped on mouseout/mouseup.
   *
   * @param {boolean} recursive - The method is passing this to itself while it is in recursive mode.
   * @param {boolean} doFocus
   */
  decrease(recursive = false, doFocus = true) {
    this.stopTimer();
    this.updateStep(-1);

    if (isNaN(this.state.value) || this.state.value > this.props.min) {
      this._timer = setTimeout(() => {
        this.decrease(true);
      }, recursive ? SPEED : DELAY);
    }

    if (doFocus) {
      setTimeout(() => {
        this.input.focus();
      });
    }
  }

  /**
   * Stop the timer
   */
  stopTimer = () => {
    if (this._timer) {
      window.clearTimeout(this._timer);
      this._timer = null;
    }
  };

  /**
   * This gets called whenever the user edits the input value. The value will
   * be recreated using the current parse/format methods so the input will
   * appear as readonly if the user tries to type something invalid.
   *
   * @param  {element#change} e
   * @listens element#change
   */
  handleChange = ({ target }) => {
    const { name, onChange } = this.props;

    this.setState({
      value: target.value.length ? this.parseValue(target.value) : target.value,
    }, () => {
      onChange({ name, value: this.state.value });
    });
  };

  /**
   * This binds the Up/Down arrow keys.
   *
   * @param  {element#keydown} e
   * @listens element#keydown
   */
  handleKeyDown = (e) => {
    const { step } = this.props;

    if ([KEYCODE_UP, KEYCODE_DOWN].includes(e.keyCode)) {
      e.preventDefault();

      const amount = e.keyCode === KEYCODE_UP ? 1 : -1;
      let nextStep = 1;

      if ((e.ctrlKey || e.metaKey) && step < 1) {
        nextStep = 0.1;
      }
      else if (e.shiftKey) {
        nextStep = 10;
      }

      if ((this.state.value > this.props.min || this.state.value < this.props.max) && this._timer === null) {
        this._timer = setTimeout(() => {
          this.updateStep(nextStep * amount);
          this.stopTimer();
        }, SPEED);
      }
    }
  };

  handleMouseExit = () => {
    this.stopTimer();
  };

  /**
   *
   * @param  {element#click} e
   * @listens element#click
   */
  handleClickBtn = (e) => {
    const el = e.target;

    this[el.classList.contains('numeric-field-up') ? 'increase' : 'decrease']();
  };

  render() {
    const { value } = this.state;
    const { className } = this.props;

    const inputProps = {
      ...this.getInputProps(),
      onChange: this.handleChange,
      onKeyDown: this.handleKeyDown,
      onKeyUp: this.stopTimer,
      type: 'text',
      value,
    };

    const wrapperClassNames = [
      'numeric-field-wrapper',
    ];
    const inputClassNames = [
      className,
      'numeric-field-input',
    ];

    if (inputProps.readOnly) {
      wrapperClassNames.push('readonly');
    }

    if (inputProps.disabled) {
      wrapperClassNames.push('disabled');
    }

    if (className.includes('form-control')) {
      wrapperClassNames.push('bs-form-control');
    }
    else {
      wrapperClassNames.push('std');
    }

    return (
      <span
        className={wrapperClassNames.join(' ')}
        onMouseUp={this.handleMouseExit}
        onMouseOut={this.handleMouseExit}
      >
        <input
          ref={c => (this.input = c)}
          {...inputProps}
          className={inputClassNames.join(' ')}
        />
        <button
          className="numeric-field-up"
          onMouseDown={this.handleClickBtn}
          onMouseUp={this.handleMouseExit}
        />
        <button
          className="numeric-field-down"
          onMouseDown={this.handleClickBtn}
          onMouseUp={this.handleMouseExit}
        />
      </span>
    );
  }
}

export default NumericField;
