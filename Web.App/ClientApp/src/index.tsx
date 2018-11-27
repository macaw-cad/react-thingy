import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Environment } from './Environment';
import * as serviceWorker from './serviceWorker';
import App from './App';
import './HypernovaComponents';

import './index.css';

if (!Environment.isServer) {

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: http://bit.ly/CRA-PWA
  serviceWorker.unregister();
  
  // Only render the React <App/> if not already rendered server side.
  const rootElement: HTMLElement | null = document.getElementById('root');
  if (!!rootElement && !rootElement.hasChildNodes()) {
    ReactDOM.render(<App />, rootElement);
  }
}