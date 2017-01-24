import Constants from '../../util/Constants';
import {
  getGameStore,
} from './GameStore';
import Store from './Store';
import User from '../User';
import {
  getUserStore,
} from './UserStore';

class FbFriendStore extends Store {
  constructor() {
    super();
    this.fbFriendIds_ = new Set();
  }

  async refresh() {
    await this.fetchFbFriends_();
    if (!this.isInitialized()) {
      this.onInitialized();
    } else {
      this.notifyListeners();
    }
  }

  getFbFriends() {
    const userStore = getUserStore();
    return Array.from(this.fbFriendIds_)
      .map((fbId) => userStore.getFbUser(fbId))
      .sort((friend1, friend2) => {
        if (friend1.name > friend2.name) {
          return 1;
        } else if (friend1.name < friend2.name) {
          return -1;
        } else {
          return 0;
        }
      });
  }

  async fetchFbFriends_() {
    const userStore = getUserStore();
    const currentUser = userStore.getCurrentUser();
    const partnerIds = getGameStore().getPartnerIds();
    try {
      const resp = await fetch(
        `https://graph.facebook.com/${currentUser.getFbId()}/friends?` +
        `access_token=${currentUser.fbToken}&fields=${Constants.FbUserFields}`);
      const respJson = await resp.json();
      for (const fbUserInfo of respJson.data) {
        this.fbFriendIds_.add(fbUserInfo.id);
        // don't overwrite user data fetched from the Wavelength server
        if (!partnerIds.has(User.fbIdToUserId(fbUserInfo.id))) {
          userStore.addUser(User.fromFbInfo(fbUserInfo.id, fbUserInfo.name,
            fbUserInfo.first_name, fbUserInfo.last_name));
        }
      }
    } catch (error) {
    }
  }
}

// let fbFriendStore_ = new FbFriendStore();

export function getFbFriendStore() {
  return fbFriendStore_;
}
