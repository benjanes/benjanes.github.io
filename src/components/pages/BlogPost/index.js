import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PostContainer from '../../../containers/PostContainer';
import { styles } from './styles.scss';

export default class BlogPost extends Component {
  constructor(props) {
    super(props);
  }

  componentWillLeave(next) {
    // switch this for nav between posts...
    const el = ReactDOM.findDOMNode(this);
    TweenMax.set(el, { css: { zIndex: -1 }});
    TweenMax.set(el, { opacity: 0, delay: 1, onComplete: next });

    // TweenMax.to(el, 1, { opacity: 0, onComplete: next });
  }

  render() {
    return (
      <div className={ `${styles}` }>
        <PostContainer
          params={ this.props.params }
        />
      </div>
    );
  }
}
