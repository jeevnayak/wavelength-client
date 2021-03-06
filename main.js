import ApolloClient, {
  createNetworkInterface,
  toIdValue,
} from 'apollo-client';
import Expo, {
  Amplitude,
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
  Platform,
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
import PartnershipScreen from './screens/PartnershipScreen';
import PartnershipQuery from './queries/PartnershipQuery';
import ResultsScreen from './screens/ResultsScreen';
import {
  LoadingScreen,
} from './ui/Screen';
import UserQuery from './queries/UserQuery';
import {
  getUserStore,
} from './data/UserStore';

if (!Expo.Constants.manifest.xde) {
  Sentry.config(
    "https://9aac787d58bc4d36b8f3bab6638ac006@sentry.io/178839").install();
  Amplitude.initialize("bb4671d7499e2b27702fea579e42d291");
}

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
      return <LoadingScreen />;
    }

    const userStore = getUserStore();
    if (!userStore.isInitialized()) {
      return <LoadingScreen />;
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
        }}
        configureScene={(route, routeStack) => (
          route.isModal ? Navigator.SceneConfigs.FloatFromBottom :
            Navigator.SceneConfigs.PushFromRight
        )} />
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
    const navigateToGame = () => {
      const screen = notification.data.cluesGiven ?
        MakeGuessesScreen : ResultsScreen;
      this.navigator_.immediatelyResetRouteStack([
        {
          component: MainScreen,
          props: {
            currentUserId: currentUserId,
            forceRefetch: true,
          },
        },
        {
          component: PartnershipScreen,
          props: {
            currentUserId: currentUserId,
            partnershipId: notification.data.partnershipId,
            forceRefetch: true,
          },
        },
        {
          component: screen,
          props: {
            currentUserId: currentUserId,
            gameId: notification.data.gameId,
            forceRefetch: true,
          },
          isModal: true,
        }
      ]);
    };
    if (notification.origin === "received" && currentUserId) {
      if (Platform.OS === "ios") {
        if (this.isMounted_) {
          apolloClient.query({
            query: UserQuery,
            variables: {
              currentUserId: currentUserId,
            },
            fetchPolicy: "network-only",
          });
          apolloClient.query({
            query: PartnershipQuery,
            variables: {
              partnershipId: notification.data.partnershipId,
              currentUserId: currentUserId,
            },
            fetchPolicy: "network-only",
          });
        } else {
          navigateToGame();
        }
      }
    } else if (notification.origin === "selected" &&
        currentUserId &&
        this.navigator_) {
      navigateToGame();
    }
  }

  onUserUpdate_ = () => {
    if (this.isMounted_) {
      this.forceUpdate();
      if (getUserStore().getCurrentUserId()) {
        Amplitude.setUserId(getUserStore().getCurrentUserId());
      }
    }
  };
}

Expo.registerRootComponent(App);
