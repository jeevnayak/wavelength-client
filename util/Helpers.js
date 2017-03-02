import GiveCluesScreen from '../screens/GiveCluesScreen';
import MakeGuessesScreen from '../screens/MakeGuessesScreen';
import ResultsScreen from '../screens/ResultsScreen';

export const GameState = {
  GiveClues: "Your turn to give clues",
  MakeGuesses: "Your turn to guess",
  TheirTurn: "Their turn",
  Complete: "Complete"
}

export function getGameState(game) {
  if (game.clues.length >= 4 && game.guesses.length >= 4) {
    return GameState.Complete;
  } else if (game.isCluer && game.clues.length < 4) {
    return GameState.GiveClues;
  } else if (!game.isCluer && game.clues.length >= 4) {
    return GameState.MakeGuesses;
  } else {
    return GameState.TheirTurn;
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
