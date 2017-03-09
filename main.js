import ApolloClient, {
  createNetworkInterface,
  toIdValue
} from 'apollo-client';
import Expo, {
  Components,
  Notifications,
} from 'expo';
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
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import MakeGuessesScreen from './screens/MakeGuessesScreen';
import ResultsScreen from './screens/ResultsScreen';
import {
  getUserStore,
} from './data/UserStore';

const dataIdFromObject = (object) => {
  if (object.__typename && object.id) {
    return object.__typename + object.id;
  } else {
    return null;
  }
};
const apolloClient = new ApolloClient({
  networkInterface: createNetworkInterface({uri: Constants.GraphQLUri}),
  addTypename: true,
  dataIdFromObject: dataIdFromObject,
  customResolvers: {
    Query: {
      partnership: (_, args) => toIdValue(dataIdFromObject({
        __typename: "Partnership",
        id: args.id
      })),
      game: (_, args) => toIdValue(dataIdFromObject({
        __typename: "Game",
        id: args.id
      }))
    }
  }
});

class App extends Component {
  componentDidMount() {
    StatusBar.setHidden(true);
    this.isMounted_ = true;
    getUserStore().addListener(this.onUserUpdate_);
    Notifications.addListener(
      (notification) => this.handleNotification_(notification));
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
        ref={(navigator) => { this.navigator_ = navigator; }}
        initialRoute={{
          component: MainScreen,
          props: { currentUserId }
        }}
        renderScene={(route, navigator) => {
          let props = route.props || {};
          props.navigator = navigator;
          return React.createElement(route.component, props);
        }} />
    </ApolloProvider>;
  }

  handleNotification_(notification) {
    const currentUserId = getUserStore().getCurrentUserId();
    if (notification.origin === "selected" &&
        currentUserId &&
        this.navigator_) {
      const screen = notification.data.cluesGiven ?
        MakeGuessesScreen : ResultsScreen;
      this.navigator_.immediatelyResetRouteStack([
        {
          component: MainScreen,
          props: { currentUserId }
        },
        {
          component: screen,
          props: {
            currentUserId: currentUserId,
            gameId: notification.data.gameId
          }
        }
      ]);
    }
  }

  onUserUpdate_ = () => {
    if (this.isMounted_) {
      this.forceUpdate();
    }
  };
}

Expo.registerRootComponent(App);
