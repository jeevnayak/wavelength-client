import React from 'react';
import {
  Image,
  StyleSheet,
} from 'react-native';

import Colors from './Colors';

export default UserPicture = (props) => {
  const fbId = props.user.id.substring(2);
  const pictureUrl = `https://graph.facebook.com/${fbId}/picture?type=square`;
  return <Image style={[Styles.UserPicture, props.style]}
    source={{uri: pictureUrl}}/>
};

const Styles = StyleSheet.create({
  UserPicture: {
    borderWidth: 2,
    borderColor: Colors.Primary,
  },
});
