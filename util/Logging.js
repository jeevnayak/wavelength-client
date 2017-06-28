import {
  Amplitude,
} from 'expo';

export const Event = {
  StartCreateGame: "start create game",
  CreateGame: "create game",
  StartGiveClues: "start give clues",
  GiveClues: "give clues",
  StartMakeGuesses: "start make guesses",
  MakeGuesses: "make guesses",
  ViewReplay: "view replay",
}

export function setUserProperties(user) {
  Amplitude.setUserProperties({name: user.name});
}

export function logEvent(eventName, properties) {
  if (properties) {
    Amplitude.logEventWithProperties(eventName, properties);
  } else {
    Amplitude.logEvent(eventName);
  }
}
