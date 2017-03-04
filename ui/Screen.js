import React, {
  Component,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Button,
} from './Button';

export function screen(WrappedComponent) {
  return class extends Component {
    render() {
      if (this.props.loading) {
        return <LoadingScreen />;
      }

      if (this.props.error) {
        return <ErrorScreen refetch={this.props.refetch} />;
      }

      return <WrappedComponent {...this.props} />;
    }
  }
}

export const Screen = (props) => (
  <View {...props} style={[Styles.Screen, props.style]} />
);

export const LoadingScreen = (props) => (
  <Screen style={props.style}>
    <Text style={Styles.LoadingText}>Loading...</Text>
  </Screen>
);

const ErrorScreen = (props) => (
  <Screen style={props.style}>
    <Text style={Styles.ErrorText}>Network Error</Text>
    <Button text="Refresh" onPress={() => props.refetch()} />
  </Screen>
);

const Styles = StyleSheet.create({
  Screen: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  LoadingText: {
    textAlign: "center",
  },
  ErrorText: {
    color: "#f00",
    textAlign: "center",
  },
});
