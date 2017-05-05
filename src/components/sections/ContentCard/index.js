import React, { Component } from 'react';
import ProjectLinks from '../ProjectLinks';
import { Link } from 'react-router';
import { styles } from './styles.scss';

export default class ContentCard extends Component {
  constructor(props) {
    super(props);
  }

  renderPostInfo() {
    return <p>[{ this.props.content.tags.reduce((str, tag) => `${str}, ${tag}`) }]</p>;
  }

  renderAdditionalInfo() {
    return (
      <div className='addl-info'>
        <div className='addl-info-inner'>
          <p>{ this.props.content.desc }</p>
          { this.props.type === 'post' && this.renderPostInfo() }
          { this.props.type === 'project' && <ProjectLinks content={ this.props.content } /> }
        </div>
      </div>
    )
  }

  renderContent() {
    if (!this.props.content) return;
    return (
      <div className='card-container'>
        <h2>{ this.props.content.title }</h2>
        { this.props.isMediumSize && this.renderAdditionalInfo() }
        
      </div>
    );
  }

  generatePostUrl() {
    const post = this.props.content;
    if (!post) return;
    return `/${post.year}/${post.month}/${post.day}/${post.filename}`;
  }

  renderPost() {
    return (
      <Link
        className='post-link'
        to={ this.generatePostUrl() }
      >
        { this.renderContent() }
      </Link>
    );
  }

  render() {
    return (
      <div className={ `${styles} card-container-outer` }>
        { this.props.type === 'post' && this.renderPost() }
        { this.props.type === 'project' && this.renderContent() }
      </div>
    );
  }
}
