import Constants from '../util/Constants';
import Round from './Round';
import {
    getUserStore,
} from './store/UserStore';

export default class Game {
  constructor(id, partnerId, isCreator, rounds) {
    this.id = id;
    this.partnerId = partnerId;
    this.isCreator = isCreator;
    this.rounds = rounds;
    console.log(this);
  }

  getPartner() {
    return getUserStore().getUser(this.partnerId);
  }

  static fromObj(obj) {
    let rounds = [];
    for (const roundObj of obj.rounds) {
        rounds.push(Round.fromObj(roundObj));
    }
    return new Game(obj.id, obj.partnerId, obj.isCreator, rounds);
  }
}
