import Constants from '../../util/Constants';
import Game from '../Game';
import Store from './Store';
import User from '../User';
import {
  getUserStore,
} from './UserStore'

class GameStore extends Store {
  constructor() {
    super();
    this.user_ = null;
    this.gamesById_ = {};
    getUserStore().addListener(this.onUserUpdated_);
  }

  async refresh() {
    await this.loadGamesFromServer_();
    if (!this.isInitialized()) {
      this.onInitialized();
    } else {
      this.notifyListeners();
    }
  }

  getGames() {
    return Object.values(this.gamesById_);
  }

  getPartnerIds() {
    return new Set(Object.values(this.gamesById_).map((game) => game.partnerId));
  }

  async createGame(partner) {
    const gameObj = await this.createGameOnServer_(partner);
    if (!gameObj) {
      return null;
    }
    const game = Game.fromObj(gameObj);
    this.gamesById_[game.id] = game;
    this.notifyListeners();
    return game;
  }

  onUserUpdated_ = () => {
    const currentUser = getUserStore().getCurrentUser();
    if (!this.user_ && currentUser) {
        this.user_ = currentUser;
        this.refresh();
    }
  };

  async loadGamesFromServer_() {
    try {
      const resp = await fetch(Constants.ServerUrl + `/games/${this.user_.id}`);
      const respJson = await resp.json();
      for (const gameObj of respJson.games) {
        this.gamesById_[gameObj.id] = Game.fromObj(gameObj);
      }
      for (const userObj of respJson.users) {
        getUserStore().addUser(User.fromObj(userObj));
      }
    } catch (error) {
    }
  }

  async createGameOnServer_(partner) {
    try {
      const resp = await fetch(Constants.ServerUrl + "/create-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          player1Id: this.user_.id,
          player2Id: partner.id
        })
      });
      return await resp.json();
    } catch (error) {
      return null;
    }
  }
}

const gameStore_ = new GameStore();

export function getGameStore() {
  return gameStore_;
}
