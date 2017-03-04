import React, {
  Component,
} from 'react';

import Constants from '../util/Constants';

class FbFriendStore {
  constructor(user) {
    this.user_ = user;
    this.loading_ = true;
    this.loadError_ = false;
    this.fbFriends_ = [];
    this.listeners_ = [];
  }

  isLoading() {
    return this.loading_;
  }

  loadError() {
    return this.loadError_;
  }

  getFbFriends() {
    return this.fbFriends_;
  }

  refetch() {
    this.fetchFbFriends_();
  }

  addListener(listener) {
    this.listeners_.push(listener);
  }

  removeListener(listener) {
    const index = this.listeners_.indexOf(listener);
    if (index !== -1) {
      this.listeners_.splice(index, 1);
    }
  }

  notifyListeners_() {
    for (const listener of this.listeners_) {
      listener();
    }
  }

  async fetchFbFriends_() {
    let fbFriends = [];
    try {
      const fbId = this.user_.id.substring(2);
      const resp = await fetch(
        `https://graph.facebook.com/${fbId}/friends?` +
        `access_token=${this.user_.fbToken}&` +
        `fields=${Constants.FbUserFields}`);
      const respJson = await resp.json();
      for (const fbUserInfo of respJson.data) {
        fbFriends.push({
          id: Constants.FbUserIdPrefix + fbUserInfo.id,
          name: fbUserInfo.name,
          firstName: fbUserInfo.first_name,
          lastName: fbUserInfo.last_name
        });
      }
      this.loadError_ = false;
    } catch (error) {
      this.loadError_ = true;
    }
    this.loading_ = false;
    this.fbFriends_ = fbFriends;
    this.notifyListeners_();
  }
}

let fbFriendStore_;

export function withFbFriends(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: true,
        error: false,
        fbFriends: []
      };
      if (!fbFriendStore_) {
        fbFriendStore_ = new FbFriendStore(props.currentUser);
      }
    }

    componentDidMount() {
      this.isMounted_ = true;
      fbFriendStore_.addListener(this.onFbFriendsUpdated_);
      fbFriendStore_.refetch();
    }

    componentWillUnmount() {
      this.isMounted_ = false;
      fbFriendStore_.removeListener(this.onFbFriendsUpdated_);
    }

    onFbFriendsUpdated_ = () => {
      if (this.isMounted_) {
        this.setState({
          loading: fbFriendStore_.isLoading(),
          error: fbFriendStore_.loadError(),
          fbFriends: fbFriendStore_.getFbFriends()
        });
      }
    };

    render() {
      let passThroughProps = Object.assign({}, this.props);
      delete passThroughProps.error;
      delete passThroughProps.refetch;

      return <WrappedComponent {...passThroughProps}
        loading={this.props.loading ||
          (!this.props.fbFriendsNotNeeded && this.state.loading)}
        error={this.props.error || this.state.error}
        refetch={() => this.refetch_()}
        fbFriends={this.state.fbFriends} />;
    }

    refetch_() {
      fbFriendStore_.refetch()
      if (this.props.refetch) {
        this.props.refetch();
      }
    }
  }
}
