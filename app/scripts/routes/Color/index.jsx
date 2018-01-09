import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Colorizr, { validateHex } from 'colorizr';

import config from 'config';
import { initialize, push, setColor } from 'actions';

import Boxes from './Boxes';

// todo re-add steps and type to params?
// todo new font!

class Color extends React.Component {
  static propTypes = {
    color: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.initialize();
  }

  componentWillReceiveProps(nextProps) {
    const { color, dispatch, router: { location } } = this.props;
    const { router: { location: nextLocation } } = nextProps;

    if (location.hash !== nextLocation.hash) {
      if (validateHex(nextLocation.hash)) {
        if (!color.instance) {
          this.initialize();
        }
        else {
          color.instance.setColor(nextLocation.hash);
          dispatch(setColor(nextLocation.hash));
        }
      }

      document.title = `${nextLocation.hash ? `${nextLocation.hash} @ ` : ''}colormeup`;
    }
  }

  initialize() {
    const { dispatch, router } = this.props;
    const { hash } = router.location;
    const isValidColor = validateHex(hash);

    const defaultColor = config.colors[Math.floor(Math.random() * (config.colors.length - 1)) + 1];
    const color = isValidColor ? hash : defaultColor;
    const colorizr = new Colorizr(color);

    dispatch(initialize(colorizr));

    if (!isValidColor) {
      dispatch(push(`/${color}`));
    }
  }

  render() {
    const { color } = this.props;

    return (
      <div className="app__color">
        {color.instance && <Boxes color={color} />}
      </div>
    );
  }
}

/* istanbul ignore else */
function mapStateToProps(state) {
  return {
    color: state.color,
    router: state.router,
    user: state.user,
  };
}

export default connect(mapStateToProps)(Color);
