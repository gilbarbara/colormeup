import React from 'react';
import PropTypes from 'prop-types';
import InlineSVG from 'react-inlinesvg';
import { validateHex } from 'colorizr';
import { getColorModes, isNumber } from 'modules/helpers';

import { push, saveColor, setOptions, toggleSidebar } from 'actions';

import CopyToClipboard from 'components/CopyToClipboard';
import NumericField from 'components/NumericField';
import Sliders from 'components/Sliders';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.tabIndex = 1;
    this.state = {
      value: props.color.hex || '',
    };
  }

  static propTypes = {
    app: PropTypes.object.isRequired,
    color: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    document.addEventListener('keypress', this.handleKeyPress);
  }

  componentWillReceiveProps(nextProps) {
    const { color } = this.props;

    if (color.instance && color.hex !== nextProps.color.hex) {
      this.updateColors(nextProps);
      this.setState({ value: nextProps.color.hex });
    }
  }

  componentWillUnmount() {
    document.body.removeEventListener('keypress', this.handleKeyPress);
  }

  updateColors(props = this.props) {
    const { color: { instance } } = props;
    const backupColor = instance.lightness < 30 ? '#FFF' : '#333';

    $('.logo svg')
      .find('#color')
      .css({
        fill: (instance.saturation > 8 ? (
          instance.hsl2hex({
            h: (instance.hue + 90) % 360,
            s: (instance.saturation < 30 ? Math.abs(instance.saturation + 30) : instance.saturation),
            l: (instance.lightness < 35 ? instance.lightness + 20 : instance.lightness),
          })
        ) : backupColor),
        fillOpacity: (instance.saturation < 10 ? 0.6 : 1),
      })
      .end()
      .find('#me')
      .css({
        fill: (instance.saturation > 8 ? (
          instance.hsl2hex({
            h: (instance.hue + 180) % 360,
            s: (instance.saturation < 30 ? Math.abs(instance.saturation + 30) : instance.saturation),
            l: (instance.lightness < 35 ? instance.lightness + 20 : instance.lightness),
          })
        ) : backupColor),
        fillOpacity: (instance.saturation < 10 ? 0.4 : 1),
      })
      .end()
      .find('#up')
      .css({
        fill: (instance.saturation > 8 ? (
          instance.hsl2hex({
            h: (instance.hue + 270) % 360,
            s: (instance.saturation < 30 ? Math.abs(instance.saturation + 30) : instance.saturation),
            l: (instance.lightness < 35 ? instance.lightness + 20 : instance.lightness),
          })
        ) : backupColor),
        fillOpacity: (instance.saturation < 10 ? 0.2 : 1),
      })
      .end();

    $('.navigation-toggle-icon').css({
      color: (instance.saturation > 8 ? (
        instance.hsl2hex({
          h: (instance.hue + 90) % 360,
          s: (instance.saturation < 30 ? Math.abs(instance.saturation + 30) : instance.saturation),
          l: (instance.lightness < 35 ? instance.lightness + 20 : instance.lightness),
        })
      ) : backupColor),
    });
  }

  svgLoaded = () => {
    const { color: { instance }, dispatch } = this.props;

    this.updateColors();

    $('#color').on('click', (e) => {
      dispatch(push(`/${instance.rgb2hex($(e.target).css('fill'))}`));
    });

    $('#me').on('click', (e) => {
      dispatch(push(`/${instance.rgb2hex($(e.target).css('fill'))}`));
    });

    $('#up').on('click', (e) => {
      dispatch(push(`/${instance.rgb2hex($(e.target).css('fill'))}`));
    });
  };

  handleChangeColorInput = ({ target }) => {
    const { dispatch } = this.props;
    const value = target.value.replace(/[^#0-9A-F]/ig, '');

    if (value.length > 7) {
      return;
    }
    this.setState({ value });


    const color = `#${value.replace(/[^0-9A-F]+/i, '').slice(-6)}`;

    if (validateHex(color)) {
      dispatch(push(`/${color}`));
    }
  };

  handleChangeSteps = (data) => {
    const { dispatch } = this.props;

    if (isNumber(data.value) && data.value > 0) {
      dispatch(setOptions({ [data.name]: data.value }));
    }
  };

  handleClickToggleSidebar = () => {
    const { app, dispatch } = this.props;

    dispatch(toggleSidebar(!app.isSidebarActive));
  };

  handleClickTypesMenu = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;

    dispatch(setOptions({ type: e.currentTarget.dataset.type }));
  };

  handleClickRandomColor = ({ currentTarget }) => {
    const { color: { instance }, dispatch } = this.props;
    const randomColor = instance.random();

    $(currentTarget).addClass('rotate');
    setTimeout(() => {
      $(currentTarget).removeClass('rotate');
    }, 400);

    dispatch(push(instance.hsl2hex(randomColor.hsl)));
  };

  handleClickSaveColor = ({ currentTarget }) => {
    const { color, dispatch } = this.props;
    const $icon = $(currentTarget).find('.fa-heart');
    const offset = $icon.offset();

    $($icon.clone()
      .css({
        fontSize: $icon.css('font-size'),
        position: 'absolute',
        top: offset.top,
        left: offset.left,
      })
      .addClass('grow-element'))
      .appendTo('body');

    $('.grow-element').addClass('grow');

    setTimeout(() => {
      $('.grow-element').remove();
    }, 800);

    dispatch(saveColor(color.hex));
  };

  handleKeyPress = (e) => {
    if (e.target.tagName === 'BODY' && e.keyCode === 32) {
      e.preventDefault();
      document.querySelector('.random-color').click();
    }
  };

  renderToggle() {
    const { app: { isSidebarActive } } = this.props;

    return (
      <div className="app__toggle">
        <input
          id="navigation-checkbox"
          className="navigation-checkbox"
          type="checkbox"
          checked={isSidebarActive}
          onChange={this.handleClickToggleSidebar}
        />
        <label className="navigation-toggle" htmlFor="navigation-checkbox">
          <span className="navigation-toggle-icon" />
        </label>
      </div>
    );
  }

  renderInput() {
    const { value } = this.state;
    const { color: { hex } } = this.props;

    return (
      <div className="app__input">
        <div className="input-group">
          <span className="input-group-btn">
            <button
              className="btn btn-light random-color"
              title="Randomize Color"
              onClick={this.handleClickRandomColor}
            >
              <span className="fa fa-refresh" />
            </button>
          </span>
          <input
            type="text"
            className="form-control input-color"
            value={value}
            tabIndex={-1}
            onChange={this.handleChangeColorInput}
          />
          <span className="input-group-btn">
            <CopyToClipboard className="btn btn-light" text={hex} />
          </span>
          <span className="input-group-btn">
            <button
              className="btn btn-light save-color"
              title="Add to Favorites"
              onClick={this.handleClickSaveColor}
            >
              <span className="fa fa-heart" />
            </button>
          </span>
        </div>
      </div>
    );
  }

  renderSelectors() {
    const { color: { steps, type } } = this.props;

    return (
      <div className="app__type">
        {getColorModes().map((d, i) => (
          <div key={i} className={d.name}>
            <div className="btn-group" role="group" aria-label={d.name}>
              {d.types.map((m, j) => (
                <a
                  key={j} href="#"
                  className={`btn ${(type === m.key ? 'btn-primary' : 'btn-light')}`}
                  data-type={m.key}
                  onClick={this.handleClickTypesMenu}
                >
                  {m.name}
                </a>
              ))}
            </div>
          </div>
        ))}
        <div className="steps">
          <span className="fa fa-th" />
          <NumericField
            name="steps"
            className="form-control"
            min={1}
            max={64}
            value={steps}
            tabIndex={++this.tabIndex}
            onChange={this.handleChangeSteps}
          />
        </div>
      </div>
    );
  }

  render() {
    const { color, dispatch } = this.props;
    const { hex, instance } = color;

    if (!instance) {
      return null;
    }

    return (
      <div
        className="app__header"
        style={{ backgroundColor: hex, borderColor: instance.darken(15) }}
      >
        <div className="app__header__wrapper">
          <div className="logo">
            <InlineSVG src={require('assets/media/brand/logo.svg')} uniquifyIDs={false} onLoad={this.svgLoaded}>
              <img src={require('assets/media/brand/logo.png')} alt="colormeup" />
            </InlineSVG>
          </div>
          {this.renderInput()}
          <Sliders color={color} dispatch={dispatch} />
          {this.renderSelectors()}
          {this.renderToggle()}
        </div>
      </div>
    );
  }
}

export default Header;
