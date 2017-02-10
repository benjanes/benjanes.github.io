import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { styles } from './styles.scss';

import ContentCard from '../ContentCard';
import { connect } from 'react-redux';

const keyFrames = {
  current: {
    'LTR': [{ x: '0%', y: '0%' }, { x: '100%', y: '0%', ease: Circ.easeInOut }],
    'RTL': [{ x: '0%', y: '0%' }, { x: '-100%', y: '0%', ease: Circ.easeInOut }],
    'TTB': [{ x: '0%', y: '0%' }, { x: '0%', y: '100%', ease: Circ.easeInOut }],
    'BTT': [{ x: '0%', y: '0%' }, { x: '0%', y: '-100%', ease: Circ.easeInOut }]
  },
  next: {
    'LTR': [{ x: '-100%', y: '0%' }, { x: '0%', y: '0%', ease: Circ.easeInOut }],
    'RTL': [{ x: '100%', y: '0%' }, { x: '0%', y: '0%', ease: Circ.easeInOut }],
    'TTB': [{ x: '0%', y: '-100%' }, { x: '0%', y: '0%', ease: Circ.easeInOut }],
    'BTT': [{ x: '0%', y: '100%' }, { x: '0%', y: '0%', ease: Circ.easeInOut }]
  }
};

class CardSlot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      next: null,
      post: props.current
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.current.title !== this.state.post.title) {
      this.setState({ next: nextProps.current }, this.startTransition);
    }
  }

  startTransition() {
    console.log('start transition...');
    const next = this.endTransition;
    const tl = new TimelineMax();
    
    const currDirKey = this.props.transitionDirection === 'forward' ? 'directionCurrent' : 'directionCurrentReverse';
    const nextDirKey = this.props.transitionDirection === 'forward' ? 'directionNext' : 'directionNextReverse';
    const currDelayKey = this.props.transitionDirection === 'forward' ? 'delayCurrent' : 'delayCurrentReverse';
    const nextDelayKey = this.props.transitionDirection === 'forward' ? 'delayNext' : 'delayNextReverse';

    const currentKeyframes = keyFrames.current[this.props[currDirKey]];
    const nextKeyframes = keyFrames.next[this.props[nextDirKey]];
    const currDelay = this.props[currDelayKey];
    const nextDelay = this.props[nextDelayKey];

    currentKeyframes[1].delay = currDelay;
    nextKeyframes[1].delay = nextDelay;

    TweenMax.fromTo(this.$current, 0.25, currentKeyframes[0], currentKeyframes[1]);
    TweenMax.fromTo(this.$next, 0.25, nextKeyframes[0], nextKeyframes[1]);
    TweenMax.delayedCall(1, next, [], this);
  }

  endTransition() {
    TweenMax.set(this.$current, { x: '0%', y: '0%' });
    this.setState({ post: this.state.next }, () => {
      TweenMax.set(this.$next, { x: '-1000%' });
      this.setState({ next: null });
    });
  }

  render() {
    return (
      <div className={ `${styles}` }>
        <div
          ref={ next => this.$next = next }
          className='card-holder'
        >
          <ContentCard
            content={ this.state.next }
          />
        </div>
        <div
          ref={ current => this.$current = current }
          className='card-holder'
        >
          <ContentCard
            content={ this.state.post }
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps({ rootState }) {
  return {
    transitionDirection: rootState.appData.transitionDirection
  };
}

export default connect(mapStateToProps, null)(CardSlot);
