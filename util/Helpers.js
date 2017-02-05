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
