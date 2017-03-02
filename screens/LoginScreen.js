import Exponent, {
  Notifications,
  Permissions,
} from 'exponent';
import gql from 'graphql-tag';
import React, {
  Component,
} from 'react';
import {
  graphql,
} from 'react-apollo';
import {
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import Constants from '../util/Constants';
import {
  Button,
  Screen,
} from '../ui/Elements';
import {
  getUserStore,
} from '../data/UserStore'

class LoginScreen extends Component {
  render() {
    return (
      <Screen>
        <Button onPress={() => this.login_()} text="Log in with Facebook" />
      </Screen>
    );
  }

  async login_() {
    const userId = await this.fbLogin_();
    if (userId) {
      await this.registerForPushNotifications_(userId);
      getUserStore().setCurrentUserId(userId);
    }
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
      const userId = Constants.FbUserIdPrefix + respJson.id;
      await this.props.onFbLogin(userId, respJson.name, respJson.first_name,
        respJson.last_name, token);
      return userId;
    } else {
      return null;
    }
  }

  async registerForPushNotifications_(userId) {
    const { status } = await Permissions.askAsync(
      Permissions.REMOTE_NOTIFICATIONS);
    if (status !== "granted") {
      return;
    }

    const pushToken = await Notifications.getExponentPushTokenAsync();
    await this.props.addPushToken(userId, pushToken);
  }
}

const updateUserMutation = gql`
  mutation updateUser($id: String!, $name: String!, $firstName: String!,
      $lastName: String!, $fbToken: String!) {
    updateUser(id: $id, name: $name, firstName: $firstName,
        lastName: $lastName, fbToken: $fbToken) {
      id
      name
      firstName
      lastName
      fbToken
    }
  }
`;

const addPushTokenMutation = gql`
  mutation addPushToken($userId: String!, $pushToken: String!) {
    addPushToken(userId: $userId, pushToken: $pushToken) {
      id
    }
  }
`;

export default graphql(updateUserMutation, {
  props: ({ mutate }) => ({
    onFbLogin: (id, name, firstName, lastName, fbToken) => {
      mutate({
        variables: { id, name, firstName, lastName, fbToken }
      });
    }
  }),
})(graphql(addPushTokenMutation, {
  props: ({ mutate }) => ({
    addPushToken: (userId, pushToken) => {
      mutate({
        variables: { userId, pushToken }
      });
    }
  }),
})(LoginScreen));
