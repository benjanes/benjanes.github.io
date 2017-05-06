import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { styles } from './styles.scss';

import NavCard from '../../sections/NavCard';
import CardSlot from '../../sections/CardSlot';
import projects from '../../../content/projects/projects.json';

const maxProjIdx = projects.length - 1;

export default class Projects extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAnimating: true,
      offScreen: props.projIdx > 2,
      cardOne: projects[props.projIdx - 2],
      cardTwo: projects[props.projIdx - 1],
      cardThree: projects[props.projIdx],
      onDeck: props.projIdx < maxProjIdx,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.projIdx !== this.props.projIdx) {
      this.updateCards(nextProps.projIdx);
    }
  }

  componentWillAppear(next) {
    this.setState({ isAnimating: false });
    next();
  }

  componentWillEnter(next) {
    const tl = new TimelineMax();

    if (this.props.isMediumSize) {
      tl
        .set(this.$card1, { transformOrigin: '50% 100%', rotationX: 91, backfaceVisibility: 'hidden' })
        .set(this.$card2, { transformOrigin: '0% 50%', rotationY: 91, backfaceVisibility: 'hidden' })
        .set(this.$card3, { transformOrigin: '50% 0%', rotationX: -91, backfaceVisibility: 'hidden' })
        .set(this.$card4, { transformOrigin: '100% 50%', rotationY: -91, backfaceVisibility: 'hidden' })
        .to(this.$card2, 0.25, { rotationY: 0, ease: Cubic.easeOut }, '+=1')
        .to(this.$card3, 0.25, { rotationX: 0, ease: Cubic.easeOut })
        .to(this.$card4, 0.25, { rotationY: 0, ease: Cubic.easeOut })
        .to(this.$card1, 0.25, { rotationX: 0, ease: Cubic.easeOut });
    } else {
      let cards = [this.$card2, this.$card1, this.$card4, this.$card3];
      tl
        .set(cards, { x: '-100%', backfaceVisibility: 'hidden' })
        .staggerTo(cards, 0.4, { x: '0%', ease: Cubic.easeInOut }, 0.15);
    }  

    tl.call(next);
  }

  componentDidEnter() {
    this.setState({ isAnimating: false });
  }

  componentWillLeave(next) {
    const tl = new TimelineMax();

    if (this.props.isMediumSize) {
      tl
        .set(this.$card1, { transformOrigin: '50% 100%', backfaceVisibility: 'hidden' })
        .set(this.$card2, { transformOrigin: '0% 50%', backfaceVisibility: 'hidden' })
        .set(this.$card3, { transformOrigin: '50% 0%', backfaceVisibility: 'hidden' })
        .set(this.$card4, { transformOrigin: '100% 50%', backfaceVisibility: 'hidden' })
        .to(this.$card1, 0.25, { rotationX: 91, ease: Power2.easeInOut })
        .to(this.$card4, 0.25, { rotationY: -91, ease: Power2.easeInOut })
        .to(this.$card3, 0.25, { rotationX: -91, ease: Power2.easeInOut })
        .to(this.$card2, 0.25, { rotationY: 91, ease: Power2.easeInOut });
    } else {
      let cards = [this.$card3, this.$card4, this.$card1, this.$card2];
      
      tl
        .set(cards, { backfaceVisibility: 'hidden' })
        .staggerFromTo(cards, 0.4, { x: '0%' }, { x: '-100%', ease: Cubic.easeInOut }, 0.15);
    }
        
    tl.call(next);
  }

  updateCards(projIdx) {
    const nextState = {
      cardOne: projects[projIdx - 2],
      cardTwo: projects[projIdx - 1],
      cardThree: projects[projIdx],
      isAnimating: true
    };

    nextState.offScreen = projIdx - 2 <= 0 ? false : true;
    nextState.onDeck = projIdx >= maxProjIdx ? false : true;

    this.setState(nextState, () => {
      setTimeout(() => { this.setState({ isAnimating: false }) }, 1000);
    });
  }

  render() {
    return (
      <div className={ `${styles} page-wrapper` }>
        <div
          ref={ card => this.$card1 = card }
          className='card'
        >
          <CardSlot
            type='project'
            current={ this.state.cardThree }
            directionCurrent='TTB'
            directionNext='TTB'
            directionCurrentReverse='BTT'
            directionNextReverse='BTT'
            delayCurrent={ 0.5 }
            delayNext={ 0.75 }
            delayCurrentReverse={ 0 }
            delayNextReverse={ 0.25 }
            isMediumSize={ this.props.isMediumSize }
          />
        </div>
        <div
          ref={ card => this.$card2 = card }
          className='card'
        >
          <NavCard
            parent='projects'
            homeAtTop={ true }
            includeDirBtns={ true }
            isAnimating={ this.state.isAnimating }
            onDeck={ this.state.onDeck }
            offScreen={ this.state.offScreen }
            isMediumSize={ this.props.isMediumSize }
          />
        </div>
        <div
          ref={ card => this.$card4 = card }
          className='card'
        >
          <CardSlot
            type='project'
            current={ this.state.cardTwo }
            directionCurrent='LTR'
            directionNext='TTB'
            directionCurrentReverse='BTT'
            directionNextReverse='RTL'
            delayCurrent={ 0.25 }
            delayNext={ 0.5 }
            delayCurrentReverse={ 0.25 }
            delayNextReverse={ 0.5 }
            isMediumSize={ this.props.isMediumSize }
          />
        </div>
        <div
          ref={ card => this.$card3 = card }
          className='card'
        >
          <CardSlot
            type='project'
            current={ this.state.cardOne }
            directionCurrent='LTR'
            directionNext='LTR'
            directionCurrentReverse='RTL'
            directionNextReverse='RTL'
            delayCurrent={ 0 }
            delayNext={ 0.25 }
            delayCurrentReverse={ 0.5 }
            delayNextReverse={ 0.75 }
            isMediumSize={ this.props.isMediumSize }
          />
        </div>
      </div>
    );
  }
}

