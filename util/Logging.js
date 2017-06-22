import {
  Amplitude,
} from 'expo';

export const Event = {
  CreateGame: "create game",
  GiveClues: "give clues",
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
