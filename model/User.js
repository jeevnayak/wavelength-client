import Constants from '../util/Constants';

export default class User {
  constructor(id, name, firstName, lastName, fbToken=null) {
    this.id = id;
    this.name = name;
    this.firstName = firstName;
    this.lastName = lastName;
    this.fbToken = fbToken;
  }

  getFbId() {
    return User.userIdToFbId(this.id);
  }

  getPictureUrl() {
    return `https://graph.facebook.com/${this.getFbId()}/picture?type=square`;
  }

  async saveToServer() {
    try {
      const resp = await fetch(Constants.ServerUrl + "/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: User.toJson(this)
      });
      return resp.ok;
    } catch (error) {
      return false;
    }
  }

  static fromFbInfo(fbId, name, firstName, lastName, fbToken=null) {
    return new User(User.fbIdToUserId(fbId), name, firstName, lastName, fbToken);
  }

  static fromObj(obj) {
    return new User(obj.id, obj.name, obj.firstName, obj.lastName, obj.fbToken);
  }

  static toJson(user) {
    return JSON.stringify(user);
  }

  static fromJson(json) {
    return User.fromObj(JSON.parse(json));
  }

  static fbIdToUserId(fbId) {
    return Constants.FbUserIdPrefix + fbId;
  }

  static userIdToFbId(userId) {
    return userId.substring(2);
  }
}
