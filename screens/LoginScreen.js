import Exponent from 'exponent';
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
  Screen,
} from '../ui/Elements';
import {
  getUserStore,
} from '../model/store/UserStore'

class LoginScreen extends Component {
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
      const userId = Constants.FbUserIdPrefix + respJson.id;
      await this.props.onFbLogin(userId, respJson.name, respJson.first_name,
        respJson.last_name, token);
      getUserStore().setCurrentUserId(userId);
    }
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

export default graphql(updateUserMutation, {
  props: ({ mutate }) => ({
    onFbLogin: (id, name, firstName, lastName, fbToken) => {
      mutate({variables: {id, name, firstName, lastName, fbToken}});
    }
  }),
})(LoginScreen);
