import React from 'react';
import { Route, IndexRoute } from 'react-router';

/* Components */
import App from './components/App';
// Pages
import Home from './components/pages/Home';
import Blog from './components/pages/Blog';
import About from './components/pages/About';
import Projects from './components/pages/Projects';
import Contact from './components/pages/Contact';
import BlogPost from './components/pages/BlogPost';

/* Containers */

export default (
  <Route path='/' component={ App } >
    <IndexRoute component={ Home } />
    <Route path='/blog' component={ Blog } />
    <Route path='/about' component={ About } />
    <Route path='/projects' component={ Projects } />
    <Route path='/contact' component={ Contact } />
    <Route path='/:year/:month/:day/:filename' component={ BlogPost } />
    <Route status={404} path='*' component={ Home } />
  </Route>
)
