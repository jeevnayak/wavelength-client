import React, {
  Component,
} from 'react';
import {
  View,
} from 'react-native';

import Atom, {
  Orbital,
} from '../ui/Atom';
import {
  BackButton,
  Button,
} from '../ui/Button';
import {
  Screen,
} from '../ui/Screen';

export default class DemoScreen extends Component {
  state = {
    currentDemo: "atom",
  };

  render() {
    let contents;
    switch (this.state.currentDemo) {
      case "atom":
        contents = <View style={{alignItems: "center"}}>
          <Atom
            size={200}
            electronSize={20}
            nucleusSize={25}
            orbitalTilt={73} />
        </View>;
        break;
      case "small":
        contents = <View style={{alignItems: "center"}}>
          <Orbital
            size={200}
            electronSize={20}
            electronColor="#f00" />
        </View>;
        break;
      case "large":
        contents = <View style={{position: "absolute", top: 500, left: -175}}>
          <Orbital
            size={700}
            electronSize={40}
            electronColor="#f00" />
        </View>;
        break;
    }
    return <Screen>
      <BackButton navigator={this.props.navigator} />
      <Button text="Small orbital" onPress={() => this.setDemo_("small")} />
      <Button text="Large orbital" onPress={() => this.setDemo_("large")} />
      {contents}
    </Screen>;
  }

  setDemo_(demo) {
    this.setState({currentDemo: demo});
  }
};
