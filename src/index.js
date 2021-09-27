import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import App from 'src/components/App';

const rootReactElement = (
  <Router>
    <App />
  </Router>  
);

const target = document.getElementById('root');

ReactDom.render(rootReactElement, target);