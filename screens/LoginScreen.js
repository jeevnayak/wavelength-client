import Expo, {
  Notifications,
  Permissions,
} from 'expo';
import gql from 'graphql-tag';
import React, {
  Component,
} from 'react';
import {
  compose,
  graphql,
} from 'react-apollo';
import {
  Dimensions,
  StyleSheet,
} from 'react-native';

import {
  PrimaryButton,
} from '../ui/Button';
import {
  CardView,
} from '../ui/Card';
import Constants from '../util/Constants';
import {
  Screen,
} from '../ui/Screen';
import {
  getUserStore,
} from '../data/UserStore';

const kWindowWidth = Dimensions.get("window").width;
const kPadding = 50;
const kClues = ["A", "HARMONIOUS", "WORD", "GAME"];

class LoginScreen extends Component {
  render() {
    return <Screen style={Styles.Screen}>
      <CardView
        width={kWindowWidth - 2 * kPadding}
        word="WAVELENGTH"
        clues={kClues.map((clue) => ({text: clue}))} />
      <PrimaryButton
        style={Styles.LoginButton}
        text="CONNECT TO FACEBOOK"
        onPress={() => this.login_()} />
    </Screen>;
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
      await Expo.Facebook.logInWithReadPermissionsAsync(
        Constants.FbAppId, {
          permissions: Constants.FbPermissions,
        });
    if (type === "success") {
      const resp = await fetch(`https://graph.facebook.com/me?` +
        `access_token=${token}&fields=${Constants.FbUserFields}`);
      const respJson = await resp.json();
      const userId = Constants.FbUserIdPrefix + respJson.id;
      const userResp = await this.props.onFbLogin(
        userId, respJson.name, respJson.first_name, respJson.last_name, token);
      return userResp.data.updateUser.id;
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

const Styles = StyleSheet.create({
  Screen: {
    justifyContent: "center",
    paddingLeft: kPadding,
    paddingRight: kPadding,
  },
  LoginButton: {
    alignItems: "center",
    marginTop: 30,
    paddingLeft: 0,
    paddingRight: 0,
  },
});

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

export default compose(
  graphql(updateUserMutation, {
    props: ({ mutate }) => ({
      onFbLogin: (id, name, firstName, lastName, fbToken) => {
        return mutate({
          variables: { id, name, firstName, lastName, fbToken }
        });
      }
    }),
  }),
  graphql(addPushTokenMutation, {
    props: ({ mutate }) => ({
      addPushToken: (userId, pushToken) => {
        mutate({
          variables: { userId, pushToken }
        });
      }
    }),
  })
)(LoginScreen);
