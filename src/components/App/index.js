import React, { Component } from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import InfoOverlay from '../sections/InfoOverlay';
import { styles } from './styles.scss';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setShowOverlay } from '../../store/actions.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lastPath: null,
      isMediumSize: window.innerWidth > 768 ? true : false,
    };

    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  componentWillReceiveProps(nextProps) {
   const lastPath = this.props.location.pathname;
   this.setState({ lastPath });
  }

  handleResize() {
    const isMediumSize = window.innerWidth > 768 ? true : false;

    if (!this.state.isMediumSize && isMediumSize || this.state.isMediumSize && !isMediumSize) this.setState({ isMediumSize });
  }

  render() {
    return (
      <div className={ `${styles}` }>
        <header className='site-header'>
          <h1>www.benjanes.com</h1>
        </header>
        <ReactTransitionGroup
          component='div'
          className='main-transition'
        >
          { React.cloneElement(this.props.children, {
            key: this.props.location.pathname,
            lastPath: this.state.lastPath,
            postIdx: this.props.postIdx,
            projIdx: this.props.projIdx,
            isMediumSize: this.state.isMediumSize,
          }) }
        </ReactTransitionGroup>
        <ReactTransitionGroup>
          { this.props.isOverlayShown && <InfoOverlay detail={this.props.overlayDetail} setShowOverlay={this.props.setShowOverlay}/> }
        </ReactTransitionGroup>
        <div className='app-bg'></div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setShowOverlay }, dispatch);
}

function mapStateToProps({ rootState }) {
  return {
    postIdx: rootState.appData.postIdx,
    projIdx: rootState.appData.projIdx,
    isOverlayShown: rootState.appData.isOverlayShown,
    overlayDetail: rootState.appData.overlayDetail,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

