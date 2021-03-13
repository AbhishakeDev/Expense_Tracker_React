import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Provider } from './context/context';
import { SpeechProvider } from '@speechly/react-client'

ReactDOM.render(
  <SpeechProvider appId="e532621c-254e-4990-b5d9-d185776bef87" language="en-US">
    <Provider>
      <App />
    </Provider>
  </SpeechProvider>,

  document.getElementById('root')
);

