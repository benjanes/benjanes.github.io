import React, { Component } from 'react';
import { Link } from 'react-router';
import { styles } from './styles.scss';


// can probably achieve conditional animations by accessing lastPath prop from the App component (parent of About)
export default class ContentCard extends Component {
  constructor(props) {
    super(props);
  }

  renderContent() {
    if (!this.props.content) return;
    return (
      <h2>{ this.props.content.title }</h2>
    );
  }

  generatePostUrl() {
    const post = this.props.content;
    if (!post) return;
    return `/${post.year}/${post.month}/${post.day}/${post.filename}`;
  }

  render() {
    return (
      <Link
        className={ `${styles}` }
        to={ this.generatePostUrl() }
      >
        { this.renderContent() }
      </Link>
    );
  }
}
