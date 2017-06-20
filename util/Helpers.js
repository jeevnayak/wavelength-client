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

export function needsReplay(game) {
  return game.isCluer &&
    getGameState(game) === GameState.Complete &&
    !game.replayed;
}

export function getGameScreen(game) {
  switch (getGameState(game)) {
    case GameState.GiveClues:
      return {screen: GiveCluesScreen};
    case GameState.MakeGuesses:
      return {screen: MakeGuessesScreen};
    case GameState.TheirTurnToGuess:
      return {
        screen: ResultsScreen,
        props: {hideSummary: true},
      };
    case GameState.Complete:
      return {screen: ResultsScreen};
    default:
      return {screen: null};
  }
}

export function getScore(game) {
  const scoreByNumIncorrect = [50, 30, 20, 10];
  let numIncorrect = 0;
  let guessedWord = false;
  let score = 0;
  for (let i = 0; i < game.guesses.length; i++) {
    const guess = game.guesses[i];
    const correct = guessedWord ?
      (guess === game.clues[i]) : (guess === game.word);
    if (correct) {
      guessedWord = true;
      score += scoreByNumIncorrect[numIncorrect];
    } else {
      numIncorrect++;
    }
  }
  return score;
}

export function getIncorrectGuesses(game) {
  let guessedWord = false;
  let incorrectGuesses = [];
  for (let i = 0; i < game.guesses.length; i++) {
    const guess = game.guesses[i];
    const correct = guessedWord ?
      (guess === game.clues[i]) : (guess === game.word);
    if (correct) {
      guessedWord = true;
    } else if (guess.length) {
      incorrectGuesses.push(guess);
    }
  }
  return incorrectGuesses;
}
