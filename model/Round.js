export default class Round {
  constructor(id, word, isCluer, clues, guesses, replayed, updated) {
    this.id = id;
    this.word = word;
    this.isCluer = isCluer;
    this.clues = clues;
    this.guesses = guesses;
    this.replayed = replayed;
    this.updated = updated;
  }

  async saveToServer() {
    try {
      const resp = await fetch(Constants.ServerUrl + "/update-round", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: Round.toJson(this)
      });
      return resp.ok;
    } catch (error) {
      return false;
    }
  }

  static fromObj(obj) {
    return new Round(obj.id, obj.word, obj.isCluer,
      obj.clues, obj.guesses, obj.replayed, obj.updated);
  }

  static toJson(round) {
    return JSON.stringify(round);
  }
}
