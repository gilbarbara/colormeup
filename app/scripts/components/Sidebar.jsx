import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import config from 'config';
import { resetUserData, setUserOptions, toggleSidebar } from 'actions';
import CopyToClipboard from './CopyToClipboard';

export default class Sidebar extends React.Component {
  state = {
    confirmReset: false,
  };

  static propTypes = {
    app: PropTypes.object.isRequired,
    color: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  handleClickResetFavorites = () => {
    const { confirmReset } = this.state;
    const { dispatch } = this.props;

    if (confirmReset) {
      dispatch(resetUserData());
      return;
    }

    this.setState({
      confirmReset: true,
    }, () => {
      setTimeout(() => {
        this.setState({
          confirmReset: false,
        });
      }, 4000);
    });
  };

  handleClickHelp = () => {
    const { dispatch, user } = this.props;

    dispatch(setUserOptions({ showHelp: !user.showHelp }));

    $('.help .text').slideToggle();
  };

  handleClickHideStarter = () => {
    const { dispatch, user } = this.props;

    dispatch(setUserOptions({ showStarterKit: !user.showStarterKit }));
  };

  handleClickRestore = () => {
    const { dispatch } = this.props;

    dispatch(setUserOptions({ showStarterKit: true }));
  };

  handleClickColor = () => {
    const { dispatch } = this.props;

    dispatch(toggleSidebar(false));
  };

  render() {
    const { confirmReset } = this.state;
    const {
      app: { isSidebarActive },
      color: { hex, instance },
      user: { colors, showHelp, showStarterKit },
    } = this.props;

    if (!instance) {
      return null;
    }

    const currentColor = instance.hsl2hex({
      h: (instance.hue + 90) % 360,
      s: (instance.saturation < 30 ? Math.abs(instance.saturation + 30) : instance.saturation),
      l: (instance.lightness < 35 ? instance.lightness + 20 : instance.lightness),
    });
    const backupColor = instance.lightness < 30 ? '#FFF' : '#333';

    const vars = {
      hex,
      hsl: `hsl(${Math.round(instance.hue)}, ${Math.round(instance.saturation)}%,  ${Math.round(instance.lightness)}%)`,
      rgb: `rgb(${instance.red}, ${instance.green}, ${instance.blue})`,
      currentColor: (instance.saturation > 8 ? currentColor : backupColor),
    };

    const output = {
      favorites: (<p>No favorites yet!</p>),
    };

    if (showStarterKit) {
      output.default = (
        <div className="app__sidebar__list default">
          <h3>
            <span className="fa fa-bolt" /> starter kit
            <button
              title="Hide this kit"
              className="hide-starter reset"
              onClick={this.handleClickHideStarter}
            >
              <span className="fa fa-eye-slash" />
            </button>
          </h3>
          <div className="items">{
            config.colors.map((d, i) =>
              (<Link
                key={i}
                to={`/${d}`}
                style={{ backgroundColor: d }}
                onClick={this.handleClickColor}
              />)
            )
          }
          </div>
        </div>
      );
    }
    else {
      output.restore = (
        <p className="restore-starter">
          <button
            className="btn btn-secondary btn-xs"
            onClick={this.handleClickRestore}
          >Restore starter kit
          </button>
        </p>
      );
    }

    if (colors.length) {
      output.favorites = colors.map((d, i) =>
        (<Link
          to={`/${d}`}
          key={i}
          style={{ backgroundColor: d }}
          onClick={this.handleClickColor}
        />)
      );
    }

    return (
      <div
        className={cx('app__sidebar', {
          visible: isSidebarActive,
        })}
      >
        <div className="app__sidebar__list favorites">
          <h3><span className="fa fa-heart" /> your favorites
            {colors.length > 0 && (
              <button
                title="Erase your favorites"
                className="erase-favorites reset"
                onClick={this.handleClickResetFavorites}
              >
                <span
                  className={cx('fa', {
                    'fa-trash': !confirmReset,
                    'fa-check-circle': confirmReset,
                  })}
                />
              </button>
            )}
          </h3>
          <div className="items">{output.favorites}</div>
        </div>
        {output.default}
        <div className="app__sidebar__list export">
          <h3>
            <span className="fa fa-eyedropper" /> values
          </h3>
          <div className="code">
            <div className="hex-copy clearfix">
              <span>{vars.hex}</span>
              <CopyToClipboard text={vars.hex} />
            </div>
            <div className="rgb-copy clearfix">
              <span>{vars.rgb}</span>
              <CopyToClipboard text={vars.rgb} />
            </div>
            <div className="hsl-copy clearfix">
              <span>{vars.hsl}</span>
              <CopyToClipboard text={vars.hsl} />
            </div>
          </div>
        </div>

        <div className="app__sidebar__list help">
          <h3>
            <button className="toggle" onClick={this.handleClickHelp}>
              <span className="fa fa-question-circle" /> Help
            </button>
          </h3>
          <div className={cx('text', { hidden: !showHelp })}>
            <h5 style={{ color: instance.lightness < 20 ? '#fff' : hex }}>Know your colors!</h5>
            <p>colormeup is a tool to inspect colors and play with its many variations in HSL or RGB.
            </p>
            <ul className="list-unstyled">
              <li><span className="fa fa-th fa-fw" /> change the number of colors</li>
              <li><span className="fa fa-refresh fa-fw" /> generate a new color</li>
              <li><span className="fa fa-heart fa-fw" /> save to your favorites</li>
            </ul>

            {output.restore}
          </div>
        </div>
      </div>
    );
  }
}
