/* eslint-disable import/extensions,import/no-unresolved,import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'simple-react-router-redux';
import history from 'modules/history';
import cx from 'classnames';

import { toggleSidebar } from 'actions';

import Home from 'routes/Color/index';
import NotFound from 'routes/NotFound';

import Sidebar from 'components/Sidebar';
import Header from 'components/Header';
import Footer from 'components/Footer';

export class App extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    color: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  };

  handleClickOverlay = () => {
    const { dispatch } = this.props;

    dispatch(toggleSidebar(false));
  };

  render() {
    const { app, color, dispatch, router, user } = this.props;

    return (
      <ConnectedRouter history={history}>
        <div key="App" className="app">
          <Header app={app} color={color} dispatch={dispatch} router={router} />
          <Sidebar app={app} color={color} dispatch={dispatch} router={router} user={user} />
          <main className="app__main">
            <Switch>
              <Route path="/" component={Home} />
              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
          <div
            className={cx('app__overlay', {
              'is-active': app.isSidebarActive,
            })}
            onClick={this.handleClickOverlay}
          />
        </div>
      </ConnectedRouter>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    app: state.app,
    color: state.color,
    router: state.router,
    user: state.user,
  };
}

export default connect(mapStateToProps)(App);
