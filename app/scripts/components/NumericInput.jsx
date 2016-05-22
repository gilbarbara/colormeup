import React from 'react';

const KEYCODE_UP = 38;
const KEYCODE_DOWN = 40;
const SPEED = 50;
const DELAY = 500;

class NumericInput extends React.Component {
  /**
   * @class
   * @description Set the initial state and create the "_timer" property to contain the
   * step timer. Then define all the private methods within the constructor.
   * @param {Object} props
   */
  constructor(props) {
    super(props);

    this._timer = null;

    this.step = this.step.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onClickBtn = this.onClickBtn.bind(this);
    this.stopTimer = this.stopTimer.bind(this);

    this.state = {
      value: props.value ? this.parse(String(props.value || '')) : null
    };
  }

  static propTypes = {
    className: React.PropTypes.string,
    format: React.PropTypes.func,
    max: React.PropTypes.number,
    min: React.PropTypes.number,
    name: React.PropTypes.string,
    onChange: React.PropTypes.func,
    parse: React.PropTypes.func,
    precision: React.PropTypes.number,
    step: React.PropTypes.number,
    value: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string])
  };

  /**
   * The deault behaviour is to start from 0, use step of 1 and display
   * integers
   */
  static defaultProps = {
    value: 0,
    step: 1,
    min: Number.MIN_SAFE_INTEGER || -9007199254740991,
    max: Number.MAX_SAFE_INTEGER || 9007199254740991,
    precision: 0,
    parse: null,
    format: null
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value
    });
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
  setCustomProps(props = this.props) {
    this.customProps = {};

    const widgetProps = [
      'format',
      'max',
      'min',
      'onChange',
      'parse',
      'precision',
      'step',
      'value'
    ];

    Object.keys(props).forEach(d => {
      if (widgetProps.indexOf(d) === -1) {
        this.customProps[d] = props[d];
      }
    });
  }

  /**
   * Convert string to number.
   *
   * @private
   * @param {string} x
   * @returns {Number|String}
   */
  toNumber(x) {
    const q = Math.pow(10, this.props.precision);
    let n = parseFloat(x);

    if (isNaN(n) || !isFinite(n)) {
      n = 0;
    }

    n = Math.min(Math.max(n, this.props.min), this.props.max);
    n = Math.round(n * q) / q;

    return n;
  }

  /**
   * This is used internally to parse any string into a number. It will
   * delegate to this.props.parse function if one is provided. Otherwise it
   * will just use parseFloat.
   *
   * @private
   * @param {string} x
   * @returns {number}
   */
  parse(x) {
    if (typeof this.props.parse === 'function') {
      return parseFloat(this.props.parse(x));
    }
    return parseFloat(x);
  }

  /**
   * This is used internally to format a number to it's dislay representation.
   * It will invoke the this.props.format function if one is provided.
   *
   * @private
   * @param {number|string} n
   * @returns {string}
   */
  format(n) {
    const _n = this.toNumber(n).toFixed(this.props.precision);

    if (this.props.format) {
      return this.props.format(_n);
    }

    return _n;
  }

  /**
   * The internal method that actualy sets the new value on the input.
   *
   * @private
   * @param {number} n
   */
  step(n) {
    const _n = this.toNumber((this.state.value || 0) + this.props.step * n);

    if (_n !== this.state.value) {
      this.setState({ value: _n }, () => {
        if (typeof this.props.onChange === 'function') {
          this.props.onChange(this.state.value, this.customProps);
        }
      });
    }
  }

  /**
   * This gets called whenever the user edits the input value. The value will
   * be recreated using the current parse/format methods so the input will
   * appear as readonly if the user tries to type something invalid.
   *
   * @param  {element#change} e
   * @listens element#change
   */
  onChange(e) {
    this.setState({
      value: this.parse(e.target.value)
    }, () => {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange(this.state.value, this.customProps);
      }
    });
  }

  /**
   * This binds the Up/Down arrow keys.
   *
   * @param  {element#keydown} e
   * @listens element#keydown
   */
  onKeyDown(e) {
    let step;

    if (e.keyCode === KEYCODE_UP || e.keyCode === KEYCODE_DOWN) {
      e.preventDefault();

      if (e.keyCode === KEYCODE_UP) {
        step = e.ctrlKey || e.metaKey ? 0.1 : (e.shiftKey ? 10 : 1);
      }
      else {
        step = e.ctrlKey || e.metaKey ? -0.1 : (e.shiftKey ? -10 : -1);
      }

      if ((this.state.value > this.props.min || this.state.value < this.props.max) && this._timer === null) {
        this._timer = setTimeout(() => {
          this.step(step);
          this.stopTimer();
        }, SPEED);
      }
    }
  }

  onClickBtn(e) {
    const el = e.target;

    this[el.classList.contains('numeric-input-up') ? 'increase' : 'decrease']();
  }

  preventClick(e) {
    e.preventDefault();
  }

  stopTimer() {
    if (this._timer) {
      window.clearTimeout(this._timer);
      this._timer = null;
    }
  }

  /**
   * Increments the value with one step and the enters a recursive calls
   * after DELAY. This is bound to the mousedown event on the "up" button
   * and will be stopped on mouseout/mouseup.
   *
   * @param {boolean} _recursive - The method is passing this to itself while it is in recursive mode.
   * @param {boolean} doFocus
   */
  increase(_recursive = false, doFocus = true) {
    this.stopTimer();
    this.step(1);

    if (isNaN(this.state.value) || this.state.value < this.props.max) {
      this._timer = setTimeout(() => {
        this.increase(true);
      }, _recursive ? SPEED : DELAY);
    }

    if (doFocus) {
      setTimeout(() => {
        this.refs.input.focus();
      });
    }
  }

  /**
   * Decrements the value with one step and the enters a recursive calls
   * after DELAY. This is bound to the mousedown event on the "down" button
   * and will be stopped on mouseout/mouseup.
   *
   * @param {boolean} _recursive - The method is passing this to itself while it is in recursive mode.
   * @param {boolean} doFocus
   */
  decrease(_recursive = false, doFocus = true) {
    this.stopTimer();
    this.step(-1);

    if (isNaN(this.state.value) || this.state.value > this.props.min) {
      this._timer = setTimeout(() => {
        this.decrease(true);
      }, _recursive ? SPEED : DELAY);
    }

    if (doFocus) {
      setTimeout(() => {
        this.refs.input.focus();
      });
    }
  }

  /**
   * Renders an input wrapped in relative span and up/down buttons.
   *
   * @returns {ReactElement}
   */
  render() {
    const PROPS = this.props;
    const inputProps = {
      ref: 'input'
    };

    this.setCustomProps();

    Object.keys(this.customProps).forEach(key => {
      inputProps[key] = this.customProps[key];
    });

    inputProps.type = 'text';
    inputProps.value = this.state.value || this.state.value === 0 ? this.format(this.state.value) : '';
    inputProps.onChange = this.onChange;
    inputProps.onKeyDown = this.onKeyDown;
    inputProps.onKeyUp = this.stopTimer;
    inputProps.classNames = [];

    if (PROPS.className) {
      inputProps.classNames.push(PROPS.className);
    }

    const attrs = {
      wrap: {
        onMouseUp: this.stopTimer,
        onMouseOut: this.stopTimer,
        classNames: []
      },
      input: inputProps,
      btnUp: {
        href: '#',
        onClick: this.preventClick,
        onMouseDown: this.onClickBtn,
        onMouseUp: this.stopTimer
      },
      btnDown: {
        href: '#',
        onClick: this.preventClick,
        onMouseDown: this.onClickBtn,
        onMouseUp: this.stopTimer
      }
    };

    attrs.wrap.classNames.push('numeric-input-wrap');
    attrs.input.classNames.push('numeric-input-input');
    attrs.btnUp.className = 'numeric-input-up';
    attrs.btnDown.className = 'numeric-input-down';

    if (PROPS.name) {
      attrs.input.classNames.push(PROPS.name);
      attrs.wrap.classNames.push(`${PROPS.name}-wrap`);
    }

    if (attrs.input.readOnly) {
      attrs.wrap.classNames.push('readonly');
    }

    if (attrs.input.disabled) {
      attrs.wrap.classNames.push('disabled');
    }

    attrs.input.className = attrs.input.classNames.join(' ');

    if ((/\bform-control\b/).test(attrs.input.className)) {
      attrs.wrap.classNames.push('bs-form-control');
    }
    else {
      attrs.wrap.classNames.push('std');
    }

    attrs.wrap.className = attrs.wrap.classNames.join(' ');

    return (
      <span {...attrs.wrap}>
        <input {...attrs.input} />
        <a {...attrs.btnUp} />
        <a {...attrs.btnDown} />
      </span>
    );
  }
}

export default NumericInput;
