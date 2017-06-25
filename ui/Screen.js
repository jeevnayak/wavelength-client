import React, {
  Component,
} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import {
  BackButton,
  Button,
} from './Button';
import Colors from './Colors';
import Sizes from './Sizes';
import {
  CenteredBoldText,
  MediumText,
} from './Text';

export function screen(WrappedComponent) {
  return class extends Component {
    render() {
      if (this.props.loading) {
        return <LoadingScreen />;
      }

      if (this.props.error) {
        return <ErrorScreen refetch={this.props.refetch} />;
      }

      return <WrappedComponent {...this.props} />;
    }
  }
}

export const Screen = (props) => {
  if (props.navigator) {
    return <View style={Styles.Screen}>
      <Header navigator={props.navigator} title={props.title} />
      <View {...props} style={[Styles.Screen, props.style]} />
    </View>;
  } else {
    return <View {...props} style={[Styles.Screen, props.style]} />;
  }
};

const Header = (props) => {
  let title;
  if (props.title) {
    title = <CenteredBoldText
        style={Styles.HeaderTitle}
        textStyle={Styles.HeaderTitleText}>
      {props.title.toUpperCase()}
    </CenteredBoldText>;
  }
  return <View style={Styles.Header}>
    {title}
    <BackButton navigator={props.navigator} />
  </View>;
};

const LoadingScreen = (props) => (
  <Screen style={props.style}>
    <MediumText style={Styles.LoadingText}>Loading...</MediumText>
  </Screen>
);

const ErrorScreen = (props) => (
  <Screen style={props.style}>
    <MediumText style={Styles.ErrorText}>Network Error</MediumText>
    <Button text="Refresh" onPress={() => props.refetch()} />
  </Screen>
);

const Styles = StyleSheet.create({
  Screen: {
    flex: 1,
    backgroundColor: Colors.Background,
  },
  Header: {
    height: 72,
    marginTop: 8,
  },
  HeaderTitle: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  HeaderTitleText: {
    fontSize: Sizes.Text,
  },
  LoadingText: {
    textAlign: "center",
  },
  ErrorText: {
    color: "#f00",
    textAlign: "center",
  },
});
