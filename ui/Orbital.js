import React, {
  Component,
} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
} from 'react-native';

export default Orbital = (props) => {
  const style = {
    width: props.size,
    height: props.size
  };
  return <View style={[Styles.Orbital, style]}>
    <Orbit size={props.size} />
    <Electron size={props.electronSize} orbitalSize={props.size} />
  </View>;
};

const Orbit = (props) => {
  const style = {
    width: props.size,
    height: props.size,
    borderRadius: props.size / 2
  };
  return <View style={[Styles.Orbit, style]} />;
};

class Electron extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rotation: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.rotate_();
  }

  render() {
    const center = (this.props.orbitalSize - this.props.size) / 2;
    const rotation = this.state.rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"]
    });
    const style = {
      top: center,
      left: center,
      width: this.props.size,
      height: this.props.size,
      borderRadius: this.props.size / 2,
      transform: [
        {rotateZ:  rotation},
        {translateX: this.props.orbitalSize / 2},
      ]
    };
    return <Animated.View style={[Styles.Electron, style]} />;
  }

  rotate_() {
    this.state.rotation.setValue(0);
    Animated.timing(this.state.rotation, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
    }).start(() => this.rotate_());
  }
}

const Styles = StyleSheet.create({
  Orbital: {
    position: "relative",
  },
  Orbit: {
    position: "absolute",
    top: 0,
    left: 0,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  Electron: {
    position: "absolute",
    backgroundColor: "#0ff",
  },
});
