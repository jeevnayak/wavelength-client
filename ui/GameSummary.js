import React from 'react';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

import {
  PrimaryButton,
} from './Button';
import Colors from './Colors';
import {
  getIncorrectGuesses,
  getScore,
  kMaxScore,
} from '../util/Helpers';
import Sizes from './Sizes';
import {
  BoldText,
} from './Text';
import UserPicture from './UserPicture';

export default (props) => {
  let createGameButton;
  if (props.onPressCreateGame) {
    createGameButton = <PrimaryButton
      style={Styles.CreateGameButton}
      text="START NEW GAME"
      onPress={props.onPressCreateGame} />;
  }
  const incorrectGuesses = getIncorrectGuesses(props.game);
  let incorrectGuessesSection;
  if (incorrectGuesses.length) {
    const incorrectGuessesTitle = props.game.isCluer ?
      `${props.guesser.firstName.toUpperCase()}'S GUESSES:` : "YOUR GUESSES:";
    const incorrectGuessesViews = incorrectGuesses.map((guess, i) => (
      <BoldText key={i} style={Styles.IncorrectGuess}>{guess}</BoldText>
    ));
    incorrectGuessesSection = [
      <BoldText key="title" style={Styles.IncorrectGuess}>
        {incorrectGuessesTitle}
      </BoldText>,
      ...incorrectGuessesViews
    ];
  }
  return <View style={[Styles.Container, props.style]}>
    <BoldText style={Styles.Score}>
      {`SCORE: ${getScore(props.game)} / ${kMaxScore}`}
    </BoldText>
    {createGameButton}
    <View style={Styles.Users}>
      <UserPicture user={props.cluer} style={Styles.UserPicture} />
      <BoldText style={Styles.Arrow}>→</BoldText>
      <UserPicture user={props.guesser} style={Styles.UserPicture} />
    </View>
    {incorrectGuessesSection}
  </View>;
};

const Styles = StyleSheet.create({
  Container: {
    alignItems: "center",
    paddingBottom: 96,
  },
  Score: {
    fontSize: Sizes.Text,
    marginBottom: 24,
  },
  Users: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  UserPicture: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 10,
    marginRight: 10,
  },
  Arrow: {
    fontSize: Sizes.Text,
  },
  IncorrectGuess: {
    fontSize: Sizes.SmallText,
    color: Colors.SecondaryText,
    marginBottom: 7,
  },
  CreateGameButton: {
    marginBottom: 24,
  },
});
