import React from 'react';
import {
  Animated,
  StyleSheet,
  Text,
} from 'react-native';

export const MediumText = (props) => {
  return <Text {...props} style={[Styles.MediumText, props.style]} />;
}

export const BoldText = (props) => {
  return <Text {...props} style={[Styles.BoldText, props.style]} />;
}

export const MediumAnimatedText = (props) => {
  return <Animated.Text {...props} style={[Styles.MediumText, props.style]} />;
}

export const BoldAnimatedText = (props) => {
  return <Animated.Text {...props} style={[Styles.BoldText, props.style]} />;
}

const Styles = StyleSheet.create({
  MediumText: {
    fontFamily: "brandon-medium",
  },
  BoldText: {
    fontFamily: "brandon-bold",
  },
});
