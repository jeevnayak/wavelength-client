import GiveCluesScreen from '../screens/GiveCluesScreen';
import MakeGuessesScreen from '../screens/MakeGuessesScreen';
import ResultsScreen from '../screens/ResultsScreen';

export const GameState = {
  GiveClues: "GiveClues",
  MakeGuesses: "MakeGuesses",
  TheirTurnToClue: "TheirTurnToClue",
  TheirTurnToGuess: "TheirTurnToGuess",
  Complete: "Complete",
}

export function getGameState(game) {
  if (game.clues.length >= 4 && game.guesses.length >= 4) {
    return GameState.Complete;
  } else if (game.clues.length < 4) {
    if (game.isCluer) {
      return GameState.GiveClues;
    } else {
      return GameState.TheirTurnToClue;
    }
  } else {
    if (game.isCluer) {
      return GameState.TheirTurnToGuess;
    } else {
      return GameState.MakeGuesses;
    }
  }
}

export function getGameScreen(game) {
  switch (getGameState(game)) {
    case GameState.GiveClues:
      return GiveCluesScreen;
    case GameState.MakeGuesses:
      return MakeGuessesScreen;
    case GameState.Complete:
      return ResultsScreen;
    default:
      return null;
  }
}
