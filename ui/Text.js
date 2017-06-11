import React from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export const MediumText = (props) => {
  return <Text {...props} style={[Styles.MediumText, props.style]} />;
}

export const BoldText = (props) => {
  return <Text {...props} style={[Styles.BoldText, props.style]} />;
}

export const CenteredMediumText = (props) => {
  const { style, ...textProps } = props;
  return <View style={[Styles.CenteredContainer, style]}>
    <MediumText {...textProps} style={props.textStyle} />
  </View>;
}

export const CenteredBoldText = (props) => {
  const { style, ...textProps } = props;
  return <View style={[Styles.CenteredContainer, style]}>
    <BoldText {...textProps} style={props.textStyle} />
  </View>;
}

export const MediumAnimatedText = (props) => {
  return <Animated.Text {...props} style={[Styles.MediumText, props.style]} />;
}

export const BoldAnimatedText = (props) => {
  return <Animated.Text {...props} style={[Styles.BoldText, props.style]} />;
}

export const InstructionText = (props) => {
  return <BoldText {...props} style={[Styles.InstructionText, props.style]} />;
}

const Styles = StyleSheet.create({
  MediumText: {
    fontFamily: "brandon-medium",
  },
  BoldText: {
    fontFamily: "brandon-bold",
  },
  CenteredContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  InstructionText: {
    fontSize: 16,
    color: "rgba(0,0,0,0.5)",
    textAlign: "center",
  },
});
