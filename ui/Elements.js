import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

export const Screen = (props) => (
  <View {...props} style={[ScreenStyles.Root, props.style]} />
);
const ScreenStyles = StyleSheet.create({
  Root: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});

export const LoadingScreen = (props) => (
  <Screen {...props}>
    <Text>Loading...</Text>
  </Screen>
);

export const Row = (props) => (
  <TouchableHighlight onPress={props.onPress}>
    <View {...props} style={[RowStyles.Row, props.style]} />
  </TouchableHighlight>
);

export const UserPicture = (props) => {
  const fbId = props.user.id.substring(2);
  const pictureUrl = `https://graph.facebook.com/${fbId}/picture?type=square`;
  return <Image {...props} style={[RowStyles.UserPicture, props.style]}
    source={{uri: pictureUrl}}/>
};

export const RowTitle = (props) => (
  <Text {...props} style={[RowStyles.RowTitle, props.style]}>
    {props.text}
  </Text>
);

const RowStyles = StyleSheet.create({
  Row: {
    flexDirection: "row",
    alignItems: "center",
    height: 70,
  },
  UserPicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  RowTitle: {
    flex: 1,
  },
});
