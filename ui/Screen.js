import React, {
  Component,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export function screen(WrappedComponent) {
  return class extends Component {
    render() {
      if (this.props.loading) {
        return <LoadingScreen />;
      }

      if (this.props.error) {
        return <ErrorScreen />;
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
