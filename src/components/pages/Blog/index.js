import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { styles } from './styles.scss';

import NavCard from '../../sections/NavCard';
import CardSlot from '../../sections/CardSlot';
import posts from '../../../content/posts/posts.json';

const maxPostIdx = posts.length - 1;

export default class Blog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: posts,
      isAnimating: true,
      offScreen: props.postIdx > 2,
      cardOne: posts[props.postIdx - 2],
      cardTwo: posts[props.postIdx - 1],
      cardThree: posts[props.postIdx],
      onDeck: props.postIdx < maxPostIdx,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.postIdx !== this.props.postIdx) {
      this.updateCards(nextProps.postIdx);
    }
  }

  componentWillAppear(next) {
    this.setState({ isAnimating: false });
    next();
  }

  componentWillEnter(next) {
    const tl = new TimelineMax();

    if (this.props.lastPath === '/') {
      tl
        .set(this.$card1, { transformOrigin: '50% 100%', rotationX: 91, backfaceVisibility: 'hidden' })
        .set(this.$card2, { transformOrigin: '0% 50%', rotationY: 91, backfaceVisibility: 'hidden' })
        .set(this.$card3, { transformOrigin: '50% 0%', rotationX: -91, backfaceVisibility: 'hidden' })
        .set(this.$card4, { transformOrigin: '100% 50%', rotationY: -91, backfaceVisibility: 'hidden' })
        .to(this.$card4, 0.25, { rotationY: 0 }, '+=1')
        .to(this.$card1, 0.25, { rotationX: 0 })
        .to(this.$card2, 0.25, { rotationY: 0 })
        .to(this.$card3, 0.25, { rotationX: 0 });
    } else {
      tl
        .fromTo(this.$card1, 0.45, { x: '-100%' }, { x: '0%' }, 0.15)
        .fromTo(this.$card2, 0.4, { x: '100%' }, { x: '0%' }, 0.05)
        .fromTo(this.$card3, 0.5, { x: '100%' }, { x: '0%' }, 0.2)
        .fromTo(this.$card4, 0.4, { x: '-100%' }, { x: '0%' }, 0);
        // add a fixed duration here and randomize the delays and durations
    }
    
    tl.call(next);
  }

  componentDidEnter() {
    this.setState({ isAnimating: false });
  }

  componentWillLeave(next) {
    const tl = new TimelineMax();

    if (browserHistory.getCurrentLocation().pathname === '/') {
      tl
        .set(this.$card1, { transformOrigin: '50% 100%', backfaceVisibility: 'hidden' })
        .set(this.$card2, { transformOrigin: '0% 50%', backfaceVisibility: 'hidden' })
        .set(this.$card3, { transformOrigin: '50% 0%', backfaceVisibility: 'hidden' })
        .set(this.$card4, { transformOrigin: '100% 50%', backfaceVisibility: 'hidden' })
        .to(this.$card3, 0.25, { rotationX: -91 })
        .to(this.$card2, 0.25, { rotationY: 91 })
        .to(this.$card1, 0.25, { rotationX: 91 })
        .to(this.$card4, 0.25, { rotationY: -91 });
    } else {
      tl
        .fromTo(this.$card1, 0.45, { x: '0%' }, { x: '-100%', ease: Power2.easeInOut }, 0.15)
        .fromTo(this.$card2, 0.4, { x: '0%' }, { x: '100%', ease: Power2.easeInOut }, 0.05)
        .fromTo(this.$card3, 0.5, { x: '0%' }, { x: '100%', ease: Power2.easeInOut }, 0.2)
        .fromTo(this.$card4, 0.4, { x: '0%' }, { x: '-100%', ease: Power2.easeInOut }, 0);
    }
    tl.call(next);
  }

  updateCards(postIdx) {
    const nextState = {
      cardOne: posts[postIdx - 2],
      cardTwo: posts[postIdx - 1],
      cardThree: posts[postIdx],
      isAnimating: true
    };

    nextState.offScreen = postIdx - 2 <= 0 ? false : true;
    nextState.onDeck = postIdx >= maxPostIdx ? false : true;

    this.setState(nextState, () => {
      setTimeout(() => { this.setState({ isAnimating: false }) }, 1000);
    });
  }

  render() {
    return (
      <div className={ `${styles}` }>
        <div
          ref={ card => this.$card1 = card }
          className='card'
        >
          <CardSlot
            current={ this.state.cardThree }
            directionCurrent='LTR'
            directionNext='LTR'
            directionCurrentReverse='RTL'
            directionNextReverse='RTL'
            delayCurrent={ 0.5 }
            delayNext={ 0.75 }
            delayCurrentReverse={ 0 }
            delayNextReverse={ 0.25 }
          />
        </div>
        <div
          ref={ card => this.$card2 = card }
          className='card'
        >
          <CardSlot
            current={ this.state.cardTwo }
            directionCurrent='TTB'
            directionNext='LTR'
            directionCurrentReverse='RTL'
            directionNextReverse='BTT'
            delayCurrent={ 0.25 }
            delayNext={ 0.5 }
            delayCurrentReverse={ 0.25 }
            delayNextReverse={ 0.5 }
          />
        </div>
        <div
          ref={ card => this.$card4 = card }
          className='card'
        >
          <NavCard
            parent='blog'
            homeAtTop={ false }
            includeDirBtns={ true }
            isAnimating={ this.state.isAnimating }
            onDeck={ this.state.onDeck }
            offScreen={ this.state.offScreen }
          />
        </div>
        <div
          ref={ card => this.$card3 = card }
          className='card'
        >
          <CardSlot
            current={ this.state.cardOne }
            directionCurrent='TTB'
            directionNext='TTB'
            directionCurrentReverse='BTT'
            directionNextReverse='BTT'
            delayCurrent={ 0 }
            delayNext={ 0.25 }
            delayCurrentReverse={ 0.5 }
            delayNextReverse={ 0.75 }
          />
        </div>
      </div>
    );
  }
}
