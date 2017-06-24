import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Button,
} from './Button';
import {
  CardView,
} from './Card';
import Colors from './Colors';
import PlusIcon from '../icons/Plus';
import {
  BoldText,
  CenteredBoldText,
  MediumText,
} from './Text';
import UserPicture from './UserPicture';

const kRowHeight = 72;

export default Row = (props) => {
  let subtitle;
  if (props.subtitle) {
    subtitle = <BoldText style={Styles.RowSubtitle}>
      {props.subtitle}
    </BoldText>;
  }
  return <TouchableOpacity activeOpacity={0.5} onPress={props.onPress}>
    <View style={[Styles.Row, props.style]}>
      <View>
        {props.pictureUser ?
          <UserPicture user={props.pictureUser} style={Styles.LeftCircle} /> :
          <NewGameIcon />}
        {props.badgeCount ? <Badge count={props.badgeCount} /> : null}
      </View>
      <View style={Styles.RowText}>
        <BoldText style={Styles.RowTitle}>{props.title}</BoldText>
        {subtitle}
      </View>
      {props.onPressCreateGame ?
        <CreateGameButton onPress={props.onPressCreateGame} /> : null}
    </View>
  </TouchableOpacity>;
};

const Badge = (props) => {
  const contents = <CenteredBoldText textStyle={Styles.BadgeText}>
    {props.count}
  </CenteredBoldText>;
  return <View style={Styles.Badge}>
    <CardView width={10} customContents={contents} />
  </View>;
};

const NewGameIcon = (props) => (
  <View style={[Styles.LeftCircle, Styles.NewGameIcon]}>
    <PlusIcon size={16} />
  </View>
);

const CreateGameButton = (props) => (
  <Button style={Styles.CreateGameButton} onPress={props.onPress}>
    <PlusIcon size={16} />
  </Button>
);

const Styles = StyleSheet.create({
  Row: {
    flexDirection: "row",
    alignItems: "center",
    height: kRowHeight,
    paddingLeft: 16
  },
  LeftCircle: {
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
  Badge: {
    position: "absolute",
    bottom: 0,
    right: 15,
  },
  BadgeText: {
    fontSize: 9,
    color: Colors.Primary,
  },
  NewGameIcon: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.Primary,
  },
  CreateGameButton: {
    width: kRowHeight,
    height: kRowHeight,
    justifyContent: "center",
    alignItems: "center",
  },
});
