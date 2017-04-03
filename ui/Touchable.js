import React, {
  Component,
} from 'react';
import {
  TouchableHighlight,
  View,
} from 'react-native';

export default function touchable(WrappedComponent) {
  return class extends Component {
    state = {
      active: false,
    };

    render() {
      return <TouchableHighlight
          style={this.props.layoutStyle}
          underlayColor="transparent"
          onPress={this.props.onPress}
          onShowUnderlay={() => this.onUnderlayToggle_(true)}
          onHideUnderlay={() => this.onUnderlayToggle_(false)}>
        <View>
          <WrappedComponent {...this.props}
            touchableActive={this.state.active} />
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
