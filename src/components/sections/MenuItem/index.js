import React, { Component } from 'react';
import { styles } from './styles.scss';
import { Link } from 'react-router';

export default class MenuItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Link
        className={ `${styles}` }
        to={ this.props.to }
        style={{ backgroundColor: this.props.bgColor }}
      >
        { this.props.children }
      </Link>
    );
  }
}