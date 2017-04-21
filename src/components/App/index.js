import React, { Component } from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import AppBg from '../sections/AppBg';
import { styles } from './styles.scss';

import { connect } from 'react-redux';

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
        <AppBg />
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
      </div>
    );
  }
}

function mapStateToProps({ rootState }) {
  return {
    postIdx: rootState.appData.postIdx,
    projIdx: rootState.appData.projIdx,
  };
}

export default connect(mapStateToProps)(App);

