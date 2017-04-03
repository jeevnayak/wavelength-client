import React, {
  Component,
} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import {
  Button,
} from './Button';
import {
  MediumText,
} from '../ui/Text';

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

const LoadingScreen = (props) => (
  <Screen style={props.style}>
    <MediumText style={Styles.LoadingText}>Loading...</MediumText>
  </Screen>
);

const ErrorScreen = (props) => (
  <Screen style={props.style}>
    <MediumText style={Styles.ErrorText}>Network Error</MediumText>
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
