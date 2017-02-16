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
      <div className='card-container'>
        <h2>{ this.props.content.title }</h2>

        <div className='addl-info'>
          <div className='addl-info-inner'>
            <p>{ this.props.content.desc }</p>
            <p>[{ this.props.content.tags.reduce((str, tag) => `${str}, ${tag}`) }]</p>
          </div>
        </div>
      </div>
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
