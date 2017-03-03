import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export const Screen = (props) => (
  <View {...props} style={[Styles.Screen, props.style]} />
);

export const LoadingScreen = (props) => (
  <Screen style={props.style}>
    <Text style={Styles.LoadingText}>Loading...</Text>
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
});
