import Exponent from 'exponent';
import React, {
  Component,
} from 'react';
import {
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import Constants from '../util/Constants';
import {
  Screen,
} from '../ui/Elements';
import {
  getUserStore,
} from '../model/store/UserStore'

export default class LoginScreen extends Component {
  render() {
    return (
      <Screen>
        <TouchableHighlight onPress={() => this.fbLogin_()}>
          <Text>Log in with Facebook</Text>
        </TouchableHighlight>
      </Screen>
    );
  }

  async fbLogin_() {
    const { type, token } =
      await Exponent.Facebook.logInWithReadPermissionsAsync(
        Constants.FbAppId, {
          permissions: Constants.FbPermissions,
        });
    if (type === "success") {
      const resp = await fetch(`https://graph.facebook.com/me?` +
        `access_token=${token}&fields=${Constants.FbUserFields}`);
      const respJson = await resp.json();
      await getUserStore().onFbLogin(respJson.id, respJson.name,
        respJson.first_name, respJson.last_name, token);
    }
  }
}
