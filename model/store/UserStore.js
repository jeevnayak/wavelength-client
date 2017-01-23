import {
  AsyncStorage,
} from 'react-native';

import Constants from '../../util/Constants';
import Store from './Store';
import User from '../User';

const kCurrentUserIdStorageKey_ = "WavelengthCurrentUserId";

class UserStore extends Store {
  constructor() {
    super();
    this.currentUserId_ = null;
    this.initialize_();
  }

  getCurrentUserId() {
    return this.currentUserId_;
  }

  setCurrentUserId(userId) {
    this.currentUserId_ = userId;
    this.notifyListeners();
    this.saveCurrentUserIdToStorage_();
  }

  clearCurrentUser() {
    this.clearCurrentUserIdFromStorage_();
  }

  async initialize_() {
    await this.loadCurrentUserIdFromStorage_();
    this.onInitialized();
  }

  async saveCurrentUserIdToStorage_() {
    try {
      await AsyncStorage.setItem(
        kCurrentUserIdStorageKey_, this.currentUserId_);
    } catch (error) {
      // no-op
    }
  }

  async loadCurrentUserIdFromStorage_() {
    try {
      this.currentUserId_ = await AsyncStorage.getItem(
        kCurrentUserIdStorageKey_);
    } catch (error) {
      // no-op
    }
  }

  async clearCurrentUserIdFromStorage_() {
    try {
      await AsyncStorage.removeItem(kCurrentUserIdStorageKey_);
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
