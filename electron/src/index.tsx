import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { RecoilRoot } from 'recoil';
import { Spinner } from '@blueprintjs/core';

window.React = React;

render(
  <React.StrictMode>
    <RecoilRoot>
      <React.Suspense fallback={<Spinner />}>
        <App />
      </React.Suspense>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
);
