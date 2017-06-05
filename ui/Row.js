import React from 'react';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

import Colors from './Colors';
import {
  BoldText,
  MediumText,
} from './Text';
import touchable from './Touchable';
import UserPicture from './UserPicture';

export default Row = touchable((props) => {
  let subtitle;
  if (props.subtitle) {
    subtitle = <BoldText style={Styles.RowSubtitle}>
      {props.subtitle}
    </BoldText>;
  }
  return <View style={[
      Styles.Row,
      props.touchableActive ? Styles.RowActive : null,
      props.style]}>
    {props.pictureUser ?
      <UserPicture user={props.pictureUser} style={Styles.UserPicture} /> :
      null}
    <View style={Styles.RowText}>
      <BoldText style={Styles.RowTitle}>{props.title}</BoldText>
      {subtitle}
    </View>
    {props.button}
  </View>;
});

const Styles = StyleSheet.create({
  Row: {
    flexDirection: "row",
    alignItems: "center",
    height: 72,
    paddingLeft: 16
  },
  RowActive: {
    backgroundColor: "#0f0",
  },
  UserPicture: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 16,
  },
  RowText: {
    flex: 1,
  },
  RowTitle: {
    fontSize: 20,
  },
  RowSubtitle: {
    color: Colors.SecondaryText,
  },
});
