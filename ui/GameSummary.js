import React from 'react';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

import Colors from './Colors';
import {
  getIncorrectGuesses,
  getScore,
} from '../util/Helpers';
import PlusIcon from '../icons/Plus';
import {
  BoldText,
} from './Text';
import UserPicture from './UserPicture';

export default (props) => {
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
    <BoldText style={Styles.Score}>{`SCORE: ${getScore(props.game)}`}</BoldText>
    <View style={Styles.Users}>
      <UserPicture user={props.cluer} style={Styles.UserPicture} />
      <PlusIcon size={20} />
      <UserPicture user={props.guesser} style={Styles.UserPicture} />
    </View>
    {incorrectGuessesSection}
  </View>;
};

const Styles = StyleSheet.create({
  Container: {
    alignItems: "center",
  },
  Score: {
    fontSize: 20,
    marginBottom: 15,
  },
  Users: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  UserPicture: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginLeft: 15,
    marginRight: 15,
  },
  IncorrectGuess: {
    fontSize: 13,
    color: Colors.SecondaryText,
    marginBottom: 7,
  },
});
