import React, { Component } from 'react';
import { IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import middleware from './middleware';
import reducers from './reducers';
import AppWrapper from './components/AppWrapper';
import { toggleDarkMode } from './actions/settings';

export default class App extends Component {

  componentDidMount() {
    this.store.dispatch(toggleDarkMode(true));
  }

  store = createStore(reducers, middleware);

  render() {
    return (
      <Provider store={this.store}>
        <IconRegistry icons={EvaIconsPack} />
        <AppWrapper/>
      </Provider>
    );
  }
}