import ApolloClient, {
  createNetworkInterface
} from 'apollo-client';
import Exponent, {
  Components,
} from 'exponent';
import React, {
  Component,
} from 'react';
import {
  ApolloProvider
} from 'react-apollo';
import {
  Navigator,
  StatusBar,
} from 'react-native';

import Constants from './util/Constants';
import MainScreen from './screens/MainScreen';
import LoginScreen from './screens/LoginScreen';
import {
  getUserStore,
} from './model/store/UserStore';

const apolloClient = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: Constants.GraphQLUri }),
});

class App extends Component {
  componentDidMount() {
    StatusBar.setHidden(true);
    this.isMounted_ = true;
    getUserStore().addListener(this.onUserUpdate_);
  }

  componentWillUnmount() {
    this.isMounted_ = false;
    getUserStore().removeListener(this.onUserUpdate_);
  }

  render() {
    const userStore = getUserStore();
    if (!userStore.isInitialized()) {
      return <Components.AppLoading />;
    }

    const currentUserId = userStore.getCurrentUserId();
    if (!currentUserId) {
      return <ApolloProvider client={apolloClient}>
        <LoginScreen />
      </ApolloProvider>;
    }

    return <ApolloProvider client={apolloClient}>
      <Navigator
        initialRoute={{
          component: MainScreen,
          props: {currentUserId: currentUserId}
        }}
        renderScene={(route, navigator) => {
          let props = route.props || {};
          props.navigator = navigator;
          return React.createElement(route.component, props);
        }} />
    </ApolloProvider>;
  }
  
  onUserUpdate_ = () => {
    if (this.isMounted_) {
      this.forceUpdate();
    }
  };
}

Exponent.registerRootComponent(App);
