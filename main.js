import Exponent, {
  Components,
} from 'exponent';
import React, {
  Component,
} from 'react';
import {
  Navigator,
  StatusBar,
} from 'react-native';

import GameListScreen from './screens/GameListScreen';
import LoginScreen from './screens/LoginScreen';
import {
  getUserStore,
} from './model/store/UserStore';
import {
  getGameStore,
} from './model/store/GameStore';

class App extends Component {
  componentDidMount() {
    StatusBar.setHidden(true);
    this.isMounted_ = true;
    getUserStore().addListener(this.onModelUpdate_);
    getGameStore().addListener(this.onModelUpdate_);
  }

  componentWillUnmount() {
    this.isMounted_ = false;
    getUserStore().removeListener(this.onModelUpdate_);
    getGameStore().removeListener(this.onModelUpdate_);
  }

  render() {
    const userStore = getUserStore();
    if (!userStore.isInitialized()) {
      return <Components.AppLoading />;
    }

    const currentUser = userStore.getCurrentUser();
    if (!currentUser) {
      return <LoginScreen />;
    }

    if (!getGameStore().isInitialized()) {
      return <Components.AppLoading />;
    }

    return <Navigator
      initialRoute={{
        component: GameListScreen,
        props: {user: currentUser}
      }}
      renderScene={(route, navigator) => {
        let props = route.props || {};
        props.navigator = navigator;
        return React.createElement(route.component, props);
      }} />;
  }
  
  onModelUpdate_ = () => {
    if (this.isMounted_) {
      this.forceUpdate();
    }
  };
}

Exponent.registerRootComponent(App);
