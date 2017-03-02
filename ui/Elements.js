import React, {
  Component,
} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

function wrapInTouchableHighlight(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        active: false
      };
    }

    render() {
      return <TouchableHighlight
          style={this.props.layoutStyle}
          onPress={this.props.onPress}
          onShowUnderlay={() => this.onUnderlayToggle_(true)}
          onHideUnderlay={() => this.onUnderlayToggle_(false)}>
        <View>
          <WrappedComponent {...this.props}
            highlightActive={this.state.active} />
        </View>
      </TouchableHighlight>;
    }

    onUnderlayToggle_(activeState) {
      this.setState({
        active: activeState
      });
    }
  }
}

export const Screen = (props) => (
  <View {...props} style={[ScreenStyles.Root, props.style]} />
);

export const LoadingScreen = (props) => (
  <Screen>
    <Text style={[ScreenStyles.Loading, props.style]}>Loading...</Text>
  </Screen>
);

export const Row = wrapInTouchableHighlight((props) => (
  <View style={[RowStyles.Row, props.highlightActive ? RowStyles.RowActive : null, props.style]}>
    {props.pictureUser ? <UserPicture user={props.pictureUser} /> : null}
    <Text style={RowStyles.RowTitle}>{props.title}</Text>
  </View>
));

export const UserPicture = (props) => {
  const fbId = props.user.id.substring(2);
  const pictureUrl = `https://graph.facebook.com/${fbId}/picture?type=square`;
  return <Image style={[RowStyles.UserPicture, props.style]}
    source={{uri: pictureUrl}}/>
};

export const RowHeader = (props) => (
  <Text style={[RowStyles.RowHeader, props.style]}>
    {props.text}
  </Text>
);

export const Button = wrapInTouchableHighlight((props) => (
  <Text
      style={[ButtonStyles.Base, props.highlightActive ? ButtonStyles.BaseActive : null, props.style]}>
    {props.text}
  </Text>
));

export const BackButton = (props) => (
  <Button onPress={props.navigator.pop} style={[ButtonStyles.Back, props.style]} text="Back" />
);

const ButtonStyles = StyleSheet.create({
  Base: {
    height: 64,
    textAlign: "center",
    lineHeight: 64,
  },
  BaseActive: {
    backgroundColor: "#f00",
  },
  Back: {
    textAlign: "left",
    paddingLeft: 16,
  },
});

const RowStyles = StyleSheet.create({
  Row: {
    flexDirection: "row",
    alignItems: "center",
    height: 64,
    paddingLeft: 16
  },
  RowActive: {
    backgroundColor: "#0f0",
  },
  UserPicture: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16
  },
  RowTitle: {
    flex: 1,
  },
  RowHeader: {
    paddingLeft: 16,
    paddingTop: 16,
    color: "#aaa",
  },
});

const ScreenStyles = StyleSheet.create({
  Root: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  Loading: {
    textAlign: "center",
  },
});
