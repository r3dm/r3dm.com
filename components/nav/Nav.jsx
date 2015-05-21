import React, { PropTypes } from 'react';
import tweenState from 'react-tween-state';
import { createContainer } from 'thundercats';

import Links from './Links.jsx';
import Logo from '../logo';
import Hamburger from '../common/Hamburger.jsx';

let win;

export default createContainer(React.createClass({

  contextTypes: {
    router: PropTypes.func
  },
  displayName: 'Nav',
  mixins: [tweenState.Mixin],

  propTypes: {
    links: PropTypes.array,
    navActions: PropTypes.object,
    showNavAtTop: PropTypes.bool
  },

  getInitialState: function() {
    return {};
  },

  componentWillMount: function() {
    this.setState({ top: this.state.showNavAtTop ? 0 : -150 });
  },

  componentDidMount: function() {
    win = typeof window !== 'undefined' ? window : null;
  },

  componentDidUpdate: function() {
    if (this.state.top === -150) {
      this.activateNavTween();
    }
  },

  activateNavTween: function() {
    this.tweenState('top', {
      easing: tweenState.easingTypes.easeInOutQuad,
      stackBehavior: tweenState.stackBehavior.ADDITIVE,
      duration: 1500,
      endValue: this.state.top === 0 ? -150 : 0
    });
  },

  getThundercats: function(props, context) {
    return {
      actions: 'navActions',
      store: 'NavStore',
      fetchAction: 'navActions.setLinks',
      payload: context.router.getCurrentPath()
    };
  },

  handleHamburgerClick: function() {
    this.props.navActions.openSideNav(true);
  },

  render: function() {
    const { links } = this.props;
    const hash = win ? win.location.hash : '';
    const top = this.getTweeningValue('top');

    const navStyle = {
      WebkitTransform: 'translateY(' + top + 'px)',
      transform: 'translateY(' + top + 'px)'
    };

    return (
      <nav
        className='nav'
        style={ navStyle }>
        <div className='nav_logo'>
          <a href='#' target='_self'>
            <Logo
              logoClass='nav_logo-mark'
              type='mark' />
            <Logo
              logoClass='nav_logo-type'
              type='type' />
          </a>
        </div>
        <Links
          className='nav_links nav_links-hide'
          hash={ hash }
          links={ links } />
        <div className='nav_links-hamburger'>
          <Hamburger onClick={ this.handleHamburgerClick }/>
        </div>
      </nav>
    );
  }
}));
