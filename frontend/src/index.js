import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppWrapper from './AppWrapper'; // ⬅️ ganti ke AppWrapper
import reportWebVitals from './reportWebVitals';
import store from './app/store';
import { Provider } from 'react-redux';
import SuspenseContent from './containers/SuspenseContent';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Suspense fallback={<SuspenseContent />}>
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  </Suspense>
);

reportWebVitals();
