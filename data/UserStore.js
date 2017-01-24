import {
  AsyncStorage,
} from 'react-native';

const kCurrentUserIdStorageKey_ = "WavelengthCurrentUserId";

class UserStore {
  constructor() {
    this.currentUserId_ = null;
    this.initialized_ = false;
    this.listeners_ = [];

    this.initialize_();
  }

  isInitialized() {
    return this.initialized_;
  }

  getCurrentUserId() {
    return this.currentUserId_;
  }

  setCurrentUserId(userId) {
    this.currentUserId_ = userId;
    this.notifyListeners_();
    this.saveCurrentUserIdToStorage_();
  }

  clearCurrentUser() {
    this.clearCurrentUserIdFromStorage_();
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

  async initialize_() {
    await this.loadCurrentUserIdFromStorage_();
    this.initialized_ = true;
    this.notifyListeners_();
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
      this.notifyListeners_();
    } catch (error) {
      // no-op
    }
  }
}

const userStore_ = new UserStore();

export function getUserStore() {
  return userStore_;
}
