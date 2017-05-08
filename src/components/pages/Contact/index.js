import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { styles } from './styles.scss';

import NavCard from '../../sections/NavCard';

export default class Contact extends Component {
  constructor(props) {
    super(props);
  }

  componentWillEnter(next) {
    const tl = new TimelineMax();
    
    if (this.props.isMediumSize) {
      tl
        .set(this.$panel1, { transformOrigin: '50% 100%', rotationX: 91, backfaceVisibility: 'hidden' })
        .set(this.$btn2, { transformOrigin: '0% 50%', rotationY: 91, backfaceVisibility: 'hidden' })
        .set(this.$btn3, { transformOrigin: '0% 50%', rotationY: 91, backfaceVisibility: 'hidden' })
        .set(this.$btn1, { transformOrigin: '50% 100%', rotationX: 91, backfaceVisibility: 'hidden' })
        .set(this.$btn0, { transformOrigin: '100% 50%', rotationY: -91, backfaceVisibility: 'hidden' })
        .to(this.$panel1, 0.25, { rotationX: 0, ease: Cubic.easeOut }, '+=1')
        .to(this.$btn2, 0.1875, { rotationY: 0, ease: Cubic.easeOut })
        .to(this.$btn3, 0.1875, { rotationY: 0, ease: Cubic.easeOut })
        .to(this.$btn1, 0.1875, { rotationX: 0, ease: Cubic.easeOut })
        .to(this.$btn0, 0.1875, { rotationY: 0, ease: Cubic.easeOut });
    } else {
      tl
        .set(this.$panel1, { x: '-100%', backfaceVisibility: 'hidden' })
        .set(this.$btn0, { x: '-100%', y: '-100%', backfaceVisibility: 'hidden' })
        .set(this.$btn1, { x: '-100%', y: '-200%', backfaceVisibility: 'hidden' })
        .set(this.$btn2, { x: '-100%', y: '-300%', backfaceVisibility: 'hidden' })
        .set(this.$btn3, { x: '-100%', y: '-400%', backfaceVisibility: 'hidden' })
        .to([this.$panel1, this.$btn0, this.$btn1, this.$btn2, this.$btn3], 0.4, { x: '0%', ease: Cubic.easeInOut })
        .to([this.$btn0, this.$btn1, this.$btn2, this.$btn3], 0.5, { y: '0%', ease: Cubic.easeInOut }, '+=0.1');
    }
    
    tl.call(next);
  }

  componentWillLeave(next) {
    const tl = new TimelineMax();

    if (this.props.isMediumSize) {
      tl
        .set(this.$panel1, { transformOrigin: '50% 100%', rotationX: 0, backfaceVisibility: 'hidden' })
        .set(this.$btn2, { transformOrigin: '0% 50%', rotationY: 0, backfaceVisibility: 'hidden' })
        .set(this.$btn3, { transformOrigin: '0% 50%', rotationY: 0, backfaceVisibility: 'hidden' })
        .set(this.$btn1, { transformOrigin: '50% 100%', rotationX: 0, backfaceVisibility: 'hidden' })
        .set(this.$btn0, { transformOrigin: '100% 50%', rotationY: 0, backfaceVisibility: 'hidden' })
        .to(this.$btn0, 0.1875, { rotationY: -91, ease: Power2.easeInOut })
        .set(this.$btn0, { opacity: 0 })
        .to(this.$btn1, 0.1875, { rotationX: 91, ease: Power2.easeInOut })
        .set(this.$btn1, { opacity: 0 })
        .to(this.$btn3, 0.1875, { rotationY: 91, ease: Power2.easeInOut })
        .set(this.$btn3, { opacity: 0 })
        .to(this.$btn2, 0.1875, { rotationY: 91, ease: Power2.easeInOut })
        .set(this.$btn2, { opacity: 0 })
        .to(this.$panel1, 0.25, { rotationX: 91, ease: Power2.easeInOut })
        .set(this.$panel1, { opacity: 0 });
    } else {
      tl
        .set([this.$panel1, this.$btn0, this.$btn1, this.$btn2, this.$btn3], { x: '0%', y: '0%', backfaceVisibility: 'hidden' })
        .to(this.$btn0, 0.5, { y: '-100%', ease: Cubic.easeInOut }, 0)
        .to(this.$btn1, 0.5, { y: '-200%', ease: Cubic.easeInOut }, 0)
        .to(this.$btn2, 0.5, { y: '-300%', ease: Cubic.easeInOut }, 0)
        .to(this.$btn3, 0.5, { y: '-400%', ease: Cubic.easeInOut }, 0)
        .to([this.$panel1, this.$btn0, this.$btn1, this.$btn2, this.$btn3], 0.4, { x: '-100%', ease: Cubic.easeInOut }, '+=0.1')
    }

    tl.call(next);
  }

  renderContactBtns() {
    const contacts = [
      { type: 'email', link: 'mailto:brjanes@gmail.com', icon: 'fa-envelope' },
      { type: 'linkedin', link: 'https://www.linkedin.com/in/benjanes1/', icon: 'fa-linkedin' },
      { type: 'gh', link: 'https://github.com/benjanes', icon: 'fa-github' },
      { type: 'cp', link: 'http://codepen.io/benjanes', icon: 'fa-codepen' }
    ];
    return <div className='contact-btn-container'>{ contacts.map(this.renderBtn, this) }</div>;
  }

  renderBtn(btn, idx) {
    return (
      <a
        ref={ btn => this[`$btn${idx}`] = btn }
        key={ btn.type }
        className={ `contact-btn` }
        href={ btn.link }
      ><i className={ `fa ${btn.icon}` }></i></a>
    )
  }

  render() {
    return (
      <div className={ `${styles} page-wrapper` }>
        <div
          ref={ panel1 => this.$panel1 = panel1 }
          className='contact-panel'
        >
          <NavCard
            isMediumSize={ this.props.isMediumSize }
            parent='contact'
            homeAtTop={ true }
          />
        </div>
        <div
          className='contact-panel'
          ref={ panel2 => this.$panel2 = panel2 }
        >
          { this.renderContactBtns() }
        </div>
      </div>
    );
  }
}
