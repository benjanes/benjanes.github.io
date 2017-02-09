import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { styles } from './styles.scss';

import NavCard from '../../sections/NavCard';

// can probably achieve conditional animations by accessing lastPath prop from the App component (parent of About)
export default class Contact extends Component {
  constructor(props) {
    super(props);
  }

  componentWillEnter(next) {
    const tl = new TimelineMax();
    tl
      .set(this.$panel1, { transformOrigin: '50% 100%', rotationX: 91 })
      .set(this.$btn2, { transformOrigin: '0% 50%', rotationY: 91 })
      .set(this.$btn3, { transformOrigin: '0% 50%', rotationY: 91 })
      .set(this.$btn1, { transformOrigin: '50% 100%', rotationX: 91 })
      .set(this.$btn0, { transformOrigin: '100% 50%', rotationY: -91 })
      .to(this.$panel1, 0.25, { rotationX: 0 }, '+=1')
      .to(this.$btn2, 0.1875, { rotationY: 0 })
      .to(this.$btn3, 0.1875, { rotationY: 0 })
      .to(this.$btn1, 0.1875, { rotationX: 0 })
      .to(this.$btn0, 0.1875, { rotationY: 0 })
      .call(next);
  }

  componentWillLeave(next) {
    const tl = new TimelineMax();
    tl
      .set(this.$panel1, { transformOrigin: '50% 100%', rotationX: 0 })
      .set(this.$btn2, { transformOrigin: '0% 50%', rotationY: 0 })
      .set(this.$btn3, { transformOrigin: '0% 50%', rotationY: 0 })
      .set(this.$btn1, { transformOrigin: '50% 100%', rotationX: 0 })
      .set(this.$btn0, { transformOrigin: '100% 50%', rotationY: 0 })
      .to(this.$btn0, 0.1875, { rotationY: -91 })
      .to(this.$btn1, 0.1875, { rotationX: 91 })
      .to(this.$btn3, 0.1875, { rotationY: 91 })
      .to(this.$btn2, 0.1875, { rotationY: 91 })
      .to(this.$panel1, 0.25, { rotationX: 91 })
      .call(next);
  }

  renderContactBtns() {
    const contacts = [
      { type: 'email', link: 'link' },
      { type: 'linkedin', link: 'link' },
      { type: 'gh', link: 'link' },
      { type: 'cp', link: 'link' }
    ];
    return <div className='contact-btn-container'>{ contacts.map(this.renderBtn.bind(this)) }</div>;
  }

  renderBtn(btn, idx) {
    return (
      <a
        ref={ btn => this[`$btn${idx}`] = btn }
        key={ btn.type }
        className={ `contact-btn ${ btn.type }` }
        href={ btn.link }
      >{ btn.type }</a>
    )
  }

  render() {
    return (
      <div className={ `${styles}` }>
        <div
          ref={ panel1 => this.$panel1 = panel1 }
          className='contact-panel'
        >
          <NavCard
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
