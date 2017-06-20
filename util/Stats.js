import {
  GameState,
  getGameState,
  getNumWavelengths,
  isPerfectGame,
  wonGame,
} from './Helpers';

export function getStats(partnership) {
  return [
    gamesPlayed(partnership),
    gamesWon(partnership),
    wavelengths(partnership),
    perfectGames(partnership),
    currentStreak(partnership),
    longestStreak(partnership),
  ];
}

function gamesPlayed(partnership) {
  return {
    title: "Games Played",
    value: partnership.games.length,
  };
}

function gamesWon(partnership) {
  return {
    title: "Games Won",
    value: partnership.games.filter(wonGame).length,
  };
}

function wavelengths(partnership) {
  return {
    title: "Wavelengths",
    value: partnership.games.reduce(
      (numWavelengths, game) => numWavelengths + getNumWavelengths(game), 0),
  };
}

function perfectGames(partnership) {
  return {
    title: "Perfect Games",
    value: partnership.games.filter(isPerfectGame).length,
  };
}

function currentStreak(partnership) {
  const completedGames = partnership.games.filter(
    (game) => getGameState(game) === GameState.Complete);
  completedGames.sort((game1, game2) => (
    parseInt(game2.lastUpdated) - parseInt(game1.lastUpdated)
  ));
  let streak = 0;
  for (const game of completedGames) {
    if (!wonGame(game)) {
      break;
    }
    streak++;
  }
  return {
    title: "Current Streak",
    value: streak,
  };
}

function longestStreak(partnership) {
  const completedGames = partnership.games.filter(
    (game) => getGameState(game) === GameState.Complete);
  completedGames.sort((game1, game2) => (
    parseInt(game2.lastUpdated) - parseInt(game1.lastUpdated)
  ));
  let longestStreak = 0;
  let streak = 0;
  for (const game of completedGames) {
    if (wonGame(game)) {
      streak++;
    } else {
      streak = 0;
    }
    if (streak > longestStreak) {
      longestStreak = streak;
    }
  }
  return {
    title: "Longest Streak",
    value: longestStreak,
  };
}
