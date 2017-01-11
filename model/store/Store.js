export default class Store {
  constructor() {
    this.initialized_ = false;
    this.listeners_ = [];
  }

  isInitialized() {
    return this.initialized_;
  }

  onInitialized() {
    this.initialized_ = true;
    this.notifyListeners();
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

  notifyListeners() {
    for (const listener of this.listeners_) {
      listener();
    }
  }
}
