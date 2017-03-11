import React, {
  Component,
} from 'react';
import {
  View,
} from 'react-native';

import {
  BackButton,
} from '../ui/Button';
import Orbital from '../ui/Orbital';
import {
  Screen,
} from '../ui/Screen';

export default DemoScreen = (props) => (
  <Screen>
    <BackButton navigator={props.navigator} />
    <View style={{alignItems: "center"}}>
      <Orbital size={200} electronSize={20} />
    </View>
  </Screen>
);
