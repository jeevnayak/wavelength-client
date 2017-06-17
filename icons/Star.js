import {
  Svg,
} from 'expo';
import React from 'react';

import Colors from '../ui/Colors';

export default (props) => (
  <Svg width={props.size} height={props.size}>
    <Svg.Path scale={props.size / 32} fill={Colors.Wavelength} d="M16,32 C7.163444,32 0,24.836556 0,16 C0,7.163444 7.163444,0 16,0 C24.836556,0 32,7.163444 32,16 C32,24.836556 24.836556,32 16,32 Z M16,21 L21.8778525,24.0901699 L20.7552826,17.545085 L25.5105652,12.9098301 L18.9389263,11.954915 L16,6 L13.0610737,11.954915 L6.48943484,12.9098301 L11.2447174,17.545085 L10.1221475,24.0901699 L16,21 Z" />
  </Svg>
);
