import React, { Component } from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import AppBg from '../sections/AppBg';
import { styles } from './styles.scss';

import { connect } from 'react-redux';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
     lastPath: null
    };
  }

  componentWillReceiveProps(nextProps) {
   const lastPath = this.props.location.pathname;
   this.setState({ lastPath });
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
            projIdx: this.props.projIdx
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

