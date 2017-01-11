import {
  AsyncStorage,
} from 'react-native';

import Constants from '../../util/Constants';
import Store from './Store';
import User from '../User';

const kCurrentUserStorageKey_ = "WavelengthCurrentUser";

class UserStore extends Store {
  constructor() {
    super();
    this.usersById_ = {};
    this.currentUserId_ = null;
    this.initialize_();
  }

  getUser(userId) {
    return this.usersById_[userId];
  }

  getFbUser(fbId) {
    return this.usersById_[User.fbIdToUserId(fbId)];
  }

  addUser(user) {
    this.usersById_[user.id] = user;
  }

  getCurrentUser() {
    return this.currentUserId_ ? this.usersById_[this.currentUserId_] : null;
  }

  clearCurrentUser() {
    this.clearCurrentUserFromStorage_();
  }

  async onFbLogin(fbId, name, firstName, lastName, fbToken) {
    const user = User.fromFbInfo(fbId, name, firstName, lastName, fbToken);
    if (await user.saveToServer()) {
      this.currentUserId_ = user.id;
      this.addUser(user);
      this.notifyListeners();
      this.saveCurrentUserToStorage_();
    }
  }

  async initialize_() {
    await this.loadCurrentUserFromStorage_();
    this.onInitialized();
  }

  async saveCurrentUserToStorage_() {
    try {
      await AsyncStorage.setItem(
        kCurrentUserStorageKey_, User.toJson(this.getCurrentUser()));
    } catch (error) {
      // no-op
    }
  }

  async loadCurrentUserFromStorage_() {
    try {
      const json = await AsyncStorage.getItem(kCurrentUserStorageKey_);
      if (json){
        const user = User.fromJson(json);
        this.currentUserId_ = user.id;
        this.addUser(user);
      }
    } catch (error) {
      // no-op
    }
  }

  async clearCurrentUserFromStorage_() {
    try {
      await AsyncStorage.removeItem(kCurrentUserStorageKey_);
      this.currentUserId_ = null;
      this.notifyListeners();
    } catch (error) {
      // no-op
    }
  }

  
}

const userStore_ = new UserStore();

export function getUserStore() {
  return userStore_;
}
