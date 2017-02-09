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

    // console.log(projects);
    console.log(props.projIdx);

    this.state = {
      projects: projects,
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
    // console.log(this.props.lastPath);
    const tl = new TimelineMax();

    tl
      .set(this.$card1, { transformOrigin: '50% 100%', rotationX: 91 })
      .set(this.$card2, { transformOrigin: '0% 50%', rotationY: 91 })
      .set(this.$card3, { transformOrigin: '50% 0%', rotationX: -91 })
      .set(this.$card4, { transformOrigin: '100% 50%', rotationY: -91 })
      .to(this.$card2, 0.25, { rotationY: 0 }, '+=1')
      .to(this.$card3, 0.25, { rotationX: 0 })
      .to(this.$card4, 0.25, { rotationY: 0 })
      .to(this.$card1, 0.25, { rotationX: 0 })
      .call(next);
  }

  componentDidEnter() {
    this.setState({ isAnimating: false });
  }

  componentWillLeave(next) {
    const tl = new TimelineMax();

    tl
      .set(this.$card1, { transformOrigin: '50% 100%' })
      .set(this.$card2, { transformOrigin: '0% 50%' })
      .set(this.$card3, { transformOrigin: '50% 0%' })
      .set(this.$card4, { transformOrigin: '100% 50%' })
      .to(this.$card1, 0.25, { rotationX: 91 })
      .to(this.$card4, 0.25, { rotationY: -91 })
      .to(this.$card3, 0.25, { rotationX: -91 })
      .to(this.$card2, 0.25, { rotationY: 91 })
      .call(next);
  }

  updateCards(projIdx) {
    console.log('update cards...');
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
      <div className={ `${styles}` }>
        <div
          ref={ card => this.$card1 = card }
          className='card'
        >
          <CardSlot
            current={ this.state.cardThree }
            directionCurrent='TTB'
            directionNext='TTB'
            directionCurrentReverse='BTT'
            directionNextReverse='BTT'
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
          <NavCard
            parent='projects'
            homeAtTop={ true }
            includeDirBtns={ true }
            isAnimating={ this.state.isAnimating }
            onDeck={ this.state.onDeck }
            offScreen={ this.state.offScreen }
          />
        </div>
        <div
          ref={ card => this.$card4 = card }
          className='card'
        >
          <CardSlot
            current={ this.state.cardTwo }
            directionCurrent='RTL'
            directionNext='TTB'
            directionCurrentReverse='BTT'
            directionNextReverse='RTL'
            delayCurrent={ 0.25 }
            delayNext={ 0.5 }
            delayCurrentReverse={ 0.25 }
            delayNextReverse={ 0.5 }
          />
        </div>
        <div
          ref={ card => this.$card3 = card }
          className='card'
        >
          <CardSlot
            current={ this.state.cardOne }
            directionCurrent='LTR'
            directionNext='LTR'
            directionCurrentReverse='RTL'
            directionNextReverse='RTL'
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
