import React, {
  Component,
} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
} from 'react-native';

export default Atom = (props) => {
  const style = {
    width: props.size,
    height: props.size
  };
  return <View style={style}>
    <Nucleus
      size={props.nucleusSize}
      color="#f0f"
      atomSize={props.size} />
    <Orbital
      size={props.size}
      electronSize={props.electronSize}
      electronColor="#00f"
      rotation={120}
      tilt={props.orbitalTilt} />
    <Orbital
      size={props.size}
      electronSize={props.electronSize}
      electronColor="#0f0"
      rotation={60}
      tilt={props.orbitalTilt} />
    <Orbital
      size={props.size}
      electronSize={props.electronSize}
      electronColor="#f00"
      rotation={0}
      tilt={props.orbitalTilt} />
  </View>;
};

export const Orbital = (props) => {
  const rotation = props.rotation || 0;
  const tilt = props.tilt || 0;
  const style = {
    position: props.standalone ? "relative" : "absolute",
    width: props.size,
    height: props.size
  };
  return <View style={style}>
    <Orbit size={props.size} rotation={rotation} tilt={tilt} />
    <Electron
      size={props.electronSize}
      color={props.electronColor}
      orbitalSize={props.size}
      orbitalRotation={rotation}
      orbitalTilt={tilt} />
  </View>;
};

const Orbit = (props) => {
  const style = {
    width: props.size,
    height: props.size,
    borderRadius: props.size / 2,
    transform: [
      {rotateZ: `${props.rotation}deg`},
      {rotateY: `${props.tilt}deg`},
    ]
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
    const inverseRotation = this.state.rotation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "-360deg"]
    });
    const style = {
      top: center,
      left: center,
      width: this.props.size,
      height: this.props.size,
      backgroundColor: this.props.color,
      borderRadius: this.props.size / 2,
      transform: [
        // roundabout way of doing translateZ(1000) since React Native
        // doesn't support it
        {rotateY: "-90deg"},
        {translateX: 1000},
        {rotateY: "90deg"},
        // end translateZ(1000)
        {rotateZ: `${this.props.orbitalRotation}deg`},
        {rotateY: `${this.props.orbitalTilt}deg`},
        {rotateZ: rotation},
        {translateX: this.props.orbitalSize / 2},
        {rotateZ: inverseRotation},
        {rotateY: `-${this.props.orbitalTilt}deg`},
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

const Nucleus = (props) => {
  const center = (props.atomSize - props.size) / 2;
  const style = {
    top: center,
    left: center,
    width: props.size,
    height: props.size,
    backgroundColor: props.color,
    borderRadius: props.size / 2
  };
  return <View style={style} />;
};

const Styles = StyleSheet.create({
  Orbit: {
    position: "absolute",
    top: 0,
    left: 0,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  Electron: {
    position: "absolute",
  },
});
