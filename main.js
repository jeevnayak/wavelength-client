import ApolloClient, {
  createNetworkInterface,
  toIdValue
} from 'apollo-client';
import Expo, {
  AppLoading,
  Font,
  Notifications,
} from 'expo';
import React, {
  Component,
} from 'react';
import {
  ApolloProvider
} from 'react-apollo';
import {
  BackHandler,
  StatusBar,
} from 'react-native';
import {
  Navigator,
} from 'react-native-deprecated-custom-components';
import Sentry from 'sentry-expo';

import Constants from './util/Constants';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import MakeGuessesScreen from './screens/MakeGuessesScreen';
import ResultsScreen from './screens/ResultsScreen';
import {
  getUserStore,
} from './data/UserStore';

Sentry.config(
  "https://9aac787d58bc4d36b8f3bab6638ac006@sentry.io/178839").install();

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
  state = {
    fontLoaded: false,
  };

  async componentDidMount() {
    StatusBar.setHidden(true);
    this.isMounted_ = true;
    getUserStore().addListener(this.onUserUpdate_);
    BackHandler.addEventListener(
      "hardwareBackPress", () => this.handleBackPress_());
    Notifications.addListener(
      (notification) => this.handleNotification_(notification));
    await Font.loadAsync({
      "brandon-medium": require("./fonts/brandon-grotesque-medium.otf"),
      "brandon-bold": require("./fonts/brandon-grotesque-bold.otf"),
    });
    this.setState({fontLoaded: true});
  }

  componentWillUnmount() {
    this.isMounted_ = false;
    getUserStore().removeListener(this.onUserUpdate_);
  }

  render() {
    if (!this.state.fontLoaded) {
      return <AppLoading />;
    }

    const userStore = getUserStore();
    if (!userStore.isInitialized()) {
      return <AppLoading />;
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

  handleBackPress_() {
    if (this.navigator_ && this.navigator_.getCurrentRoutes().length > 1) {
      this.navigator_.pop();
      return true;
    }
    return false;
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
