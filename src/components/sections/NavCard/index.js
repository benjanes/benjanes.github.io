import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { styles } from './styles.scss';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPostIdx, setProjIdx, setTransitionDirection } from '../../../store/actions.js';

class NavCard extends Component {
  constructor(props) {
    super(props);
  }

  handleHomeClick(e) {
    e.preventDefault();
    if (this.props.isAnimating) return;
    browserHistory.push('/');
  }

  handleForwardClick() {
    if (this.props.isAnimating) return;
    this.props.setTransitionDirection('forward');

    if (this.props.parent === 'blog') {
      this.props.setPostIdx(this.props.postIdx + 1);
    } else if (this.props.parent === 'projects') {
      this.props.setProjIdx(this.props.projIdx + 1);
    }
  }

  handleBackClick() {
    if (this.props.isAnimating) return;
    this.props.setTransitionDirection('reverse');

    if (this.props.parent === 'blog') {
      this.props.setPostIdx(this.props.postIdx - 1);
    } else if (this.props.parent === 'projects') {
      this.props.setProjIdx(this.props.projIdx - 1);
    }
  }

  renderHomeBtn() {
    return (
      <a className='home-btn' onClick={ this.handleHomeClick.bind(this) } href='/'>
        <span className='fa'>&#xf015;</span>
      </a>
    )
  }

  renderTitle() {
    return <div className='title'><h2>{ this.props.parent }</h2></div>
  }

  renderBackBtn() {
    return (
      <div
        className={ `fa nav-btn back-btn ${ !this.props.offScreen ? 'disabled' : '' }` }
        onClick={ this.props.offScreen ? this.handleBackClick.bind(this) : null }
      >
        <span>&#xf053;</span>
      </div>
    )
  }

  renderForwardBtn() {
    return (
      <div
        className={ `fa nav-btn forward-btn ${ !this.props.onDeck ? 'disabled' : '' }` }
        onClick={ this.props.onDeck ? this.handleForwardClick.bind(this) : null }
      >
        <span>&#xf054;</span>
      </div>
    )
  }

  render() {
    return (
      <div className={ `${styles} nav-card` }>
        { (this.props.homeAtTop || !this.props.isMediumSize) && this.renderTitle() }
        { (this.props.homeAtTop || !this.props.isMediumSize) && this.renderHomeBtn() }
        { this.props.includeDirBtns && this.renderBackBtn() }
        { this.props.includeDirBtns && this.renderForwardBtn() }
        { !this.props.homeAtTop && !this.props.isMediumSize && this.renderHomeBtn() }
        { !this.props.homeAtTop && !this.props.isMediumSize && this.renderTitle() }
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setPostIdx, setProjIdx, setTransitionDirection }, dispatch);
}

function mapStateToProps({ rootState }) {
  return {
    postIdx: rootState.appData.postIdx,
    projIdx: rootState.appData.projIdx,
    transitionDirection: rootState.appData.transitionDirection
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavCard);
