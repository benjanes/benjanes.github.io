import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { styles } from './styles.scss';
import { browserHistory } from 'react-router';
// import { Link } from 'react-router';
import MenuItem from '../../sections/MenuItem';

export default class Home extends Component {
  constructor(props) {
    super(props);
  }

  componentWillEnter(next) {
    const lastPath = this.props.lastPath;
    const tl = new TimelineMax();
    tl
      .set(this.$card1, { transformOrigin: '100% 50%', rotationY: -91 })
      .set(this.$card2, { transformOrigin: '50% 100%', rotationX: 91 })
      .set(this.$card3, { transformOrigin: '0% 50%', rotationY: 91 })
      .set(this.$card4, { transformOrigin: '50% 0%', rotationX: -91 });
    
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
    }

    tl.call(next);
  }

  componentWillLeave(next) {
    const nextPath = browserHistory.getCurrentLocation().pathname;
    const tl = new TimelineMax();
    tl
      .set(this.$card1, { transformOrigin: '100% 50%' })
      .set(this.$card2, { transformOrigin: '50% 100%' })
      .set(this.$card3, { transformOrigin: '0% 50%' })
      .set(this.$card4, { transformOrigin: '50% 0%' });
      
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
          <MenuItem to='/contact' bgColor='beige'>
            <h1>CONTACT</h1>
          </MenuItem>
        </div>
        <div
          ref={ card => this.$card2 = card }
          className='menu-item'
        >
          <MenuItem to='/projects' bgColor='gray'>
            <h1>PROJECTS</h1>
          </MenuItem>
        </div>
        <div
          ref={ card => this.$card4 = card }
          className='menu-item'
        >
          <MenuItem to='/blog' bgColor='orange'>
            <h1>BLOG</h1>
          </MenuItem>
        </div>
        <div
          ref={ card => this.$card3 = card }
          className='menu-item'
        >
          <MenuItem to='/about' bgColor='plum'>
            <h1>ABOUT</h1>
          </MenuItem>
        </div>
      </div>
    );
  }
}
