import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { styles } from './styles.scss';
import { browserHistory } from 'react-router';
import MenuItem from '../../sections/MenuItem';

export default class Home extends Component {
  constructor(props) {
    super(props);
  }

  componentWillEnter(next) {
    const lastPath = this.props.lastPath;
    const tl = new TimelineMax();

    if (this.props.isMediumSize) {
      tl
        .set(this.$card1, { transformOrigin: '100% 50%', rotationY: -91, backfaceVisibility: 'hidden' })
        .set(this.$card2, { transformOrigin: '50% 100%', rotationX: 91, backfaceVisibility: 'hidden' })
        .set(this.$card3, { transformOrigin: '0% 50%', rotationY: 91, backfaceVisibility: 'hidden' })
        .set(this.$card4, { transformOrigin: '50% 0%', rotationX: -91, backfaceVisibility: 'hidden' });
      
      if (lastPath === '/contact') {
        tl
          .to(this.$card4, 0.25, { rotationX: 0 }, '+=1')
          .to(this.$card3, 0.25, { rotationY: 0 })
          .to(this.$card2, 0.25, { rotationX: 0 })
          .to(this.$card1, 0.25, { rotationY: 0 });
      } else if (lastPath === '/projects') {
        tl
          .to(this.$card1, 0.25, { rotationY: 0 }, '+=1')
          .to(this.$card4, 0.25, { rotationX: 0 })
          .to(this.$card3, 0.25, { rotationY: 0 })
          .to(this.$card2, 0.25, { rotationX: 0 });
      } else if (lastPath === '/about') {
        tl
          .to(this.$card2, 0.25, { rotationX: 0 }, '+=1')
          .to(this.$card1, 0.25, { rotationY: 0 })
          .to(this.$card4, 0.25, { rotationX: 0 })
          .to(this.$card3, 0.25, { rotationY: 0 });
      } else if (lastPath === '/blog') {
        tl
          .to(this.$card3, 0.25, { rotationY: 0 }, '+=1')
          .to(this.$card2, 0.25, { rotationX: 0 })
          .to(this.$card1, 0.25, { rotationY: 0 })
          .to(this.$card4, 0.25, { rotationX: 0 });
      } else {
        tl
          .set(this.$card1, { rotationY: 0, x: '-100%' })
          .set(this.$card2, { rotationX: 0, x: '100%' })
          .set(this.$card3, { rotationY: 0, x: '100%' })
          .set(this.$card4, { rotationX: 0, x: '-100%' })
          .to(this.$card1, 0.45, { x: '0%' }, 0.15)
          .to(this.$card2, 0.4, { x: '0%' }, 0.05)
          .to(this.$card3, 0.5, { x: '0%' }, 0.2)
          .to(this.$card4, 0.4, { x: '0%' }, 0);
      }
    } else {
      let cards = [this.$card3, this.$card4, this.$card2, this.$card1];
      let delay = lastPath === '/contact' ? 0.15 : 0;
      tl
        .set(cards, { x: '100%', backfaceVisibility: 'hidden' })
        .staggerTo(cards, 0.4, { x: '0%', ease: Cubic.easeInOut, delay: delay }, 0.15);
    }

    tl.call(next);
  }

  componentWillLeave(next) {
    const nextPath = browserHistory.getCurrentLocation().pathname;
    const tl = new TimelineMax();

    if (this.props.isMediumSize) {
      tl
        .set(this.$card1, { transformOrigin: '100% 50%', backfaceVisibility: 'hidden' })
        .set(this.$card2, { transformOrigin: '50% 100%', backfaceVisibility: 'hidden' })
        .set(this.$card3, { transformOrigin: '0% 50%', backfaceVisibility: 'hidden' })
        .set(this.$card4, { transformOrigin: '50% 0%', backfaceVisibility: 'hidden' });
        
      if (nextPath === '/contact') {
        tl
          .to(this.$card1, 0.25, { rotationY: -91 })
          .to(this.$card2, 0.25, { rotationX: 91 })
          .to(this.$card3, 0.25, { rotationY: 91 })
          .to(this.$card4, 0.25, { rotationX: -91 });
      } else if (nextPath === '/projects') {
        tl
          .to(this.$card2, 0.25, { rotationX: 91 })
          .to(this.$card3, 0.25, { rotationY: 91 })
          .to(this.$card4, 0.25, { rotationX: -91 })
          .to(this.$card1, 0.25, { rotationY: -91 });
      } else if (nextPath === '/about') {
        tl
          .to(this.$card3, 0.25, { rotationY: 91 })
          .to(this.$card4, 0.25, { rotationX: -91 })
          .to(this.$card1, 0.25, { rotationY: -91 })
          .to(this.$card2, 0.25, { rotationX: 91 });
      } else if (nextPath === '/blog') {
        tl
          .to(this.$card4, 0.25, { rotationX: -91 })
          .to(this.$card1, 0.25, { rotationY: -91 })
          .to(this.$card2, 0.25, { rotationX: 91 })
          .to(this.$card3, 0.25, { rotationY: 91 });
      } else {
        tl
          .fromTo(this.$card1, 0.45, { x: '0%' }, { x: '-100%', ease: Power2.easeInOut }, 0.15)
          .fromTo(this.$card2, 0.4, { x: '0%' }, { x: '100%', ease: Power2.easeInOut }, 0.05)
          .fromTo(this.$card3, 0.5, { x: '0%' }, { x: '100%', ease: Power2.easeInOut }, 0.2)
          .fromTo(this.$card4, 0.4, { x: '0%' }, { x: '-100%', ease: Power2.easeInOut }, 0);
      }
    } else {
      let cards = [this.$card1, this.$card2, this.$card4, this.$card3];
      tl
        .set(cards, { backfaceVisibility: 'hidden' })
        .staggerFromTo(cards, 0.4, { x: '0%' }, { x: '100%', ease: Cubic.easeInOut }, 0.15);
    }
    
    tl.call(next);
  }

  render() {
    return (
      <div className={ `${styles}` }>
        <div
          ref={ card => this.$card1 = card }
          className='menu-item'
        >
          <MenuItem to='/contact' bgColor='rgba(255,164,83,0.9)'>
            <h1>contact</h1>
          </MenuItem>
        </div>
        <div
          ref={ card => this.$card2 = card }
          className='menu-item'
        >
          <MenuItem to='/projects' bgColor='rgba(255,92,83,0.9)'>
            <h1>projects</h1>
          </MenuItem>
        </div>
        <div
          ref={ card => this.$card4 = card }
          className='menu-item'
        >
          <MenuItem to='/blog' bgColor='rgba(76,232,95,0.9)'>
            <h1>blog</h1>
          </MenuItem>
        </div>
        <div
          ref={ card => this.$card3 = card }
          className='menu-item'
        >
          <MenuItem to='/about' bgColor='rgba(72,203,215,0.9)'>
            <h1>about</h1>
          </MenuItem>
        </div>
      </div>
    );
  }
}
