import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import touchable from './Touchable';

export const Row = touchable((props) => (
  <View style={[
      Styles.Row,
      props.touchableActive ? Styles.RowActive : null,
      props.style]}>
    {props.pictureUser ? <UserPicture user={props.pictureUser} /> : null}
    <Text style={Styles.RowTitle}>{props.title}</Text>
    {props.button}
  </View>
));

const UserPicture = (props) => {
  const fbId = props.user.id.substring(2);
  const pictureUrl = `https://graph.facebook.com/${fbId}/picture?type=square`;
  return <Image style={[Styles.UserPicture, props.style]}
    source={{uri: pictureUrl}}/>
};

export const HeaderRow = (props) => (
  <Text style={[Styles.HeaderRow, props.style]}>
    {props.text}
  </Text>
);

const Styles = StyleSheet.create({
  Row: {
    flexDirection: "row",
    alignItems: "center",
    height: 64,
    paddingLeft: 16
  },
  RowActive: {
    backgroundColor: "#0f0",
  },
  UserPicture: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16
  },
  RowTitle: {
    flex: 1,
  },
  HeaderRow: {
    paddingLeft: 16,
    paddingTop: 16,
    color: "#aaa",
  },
});
