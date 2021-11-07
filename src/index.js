import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import App from './App';
import Profile from './pages/Profile';
import { applyMiddleware, createStore } from "redux";
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import rootReducer from './store/reducers';
import {composeWithDevTools} from 'redux-devtools-extension';
import './css/main.css';

export const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(thunk),
));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
