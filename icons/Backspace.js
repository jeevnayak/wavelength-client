import {
  Svg,
} from 'expo';
import React from 'react';

export default (props) => (
  <Svg width={props.size * 47 / 34} height={props.size}>
    <Svg.Path scale={props.size / 34} fill="none" stroke="#000" strokeWidth="3" d="M15.4833201,3.13353562 L15.4066398,3.20194028 C8.30544094,9.11266093 1.5,15.6043954 1.5,17 C1.5,18.4046233 8.36184118,24.9396837 15.5320526,30.9057291 C15.7112138,31.0734266 15.9005589,31.2299062 16.1675218,31.4271469 C16.2325881,31.4804117 16.2325881,31.4804117 16.2582442,31.5014491 C16.3169977,31.5504747 16.3560335,31.5751031 16.3671387,31.5797697 L16.553239,31.6736841 C17.4576517,32.212008 18.4892944,32.5 19.5661323,32.5 L38.5947873,32.5 C41.8621751,32.5 44.5,29.8623245 44.5,26.6015477 L44.5,7.39845234 C44.5,4.14709789 41.8528482,1.5 38.5947873,1.5 L19.5661323,1.5 C18.4751807,1.5 17.4329394,1.79287437 16.5230031,2.33977754 L16.368652,2.4207336 C16.3516663,2.42841936 16.311758,2.45413007 16.244835,2.5096088 C16.2415435,2.51229091 16.2415435,2.51229091 16.2220845,2.52818757 L16.1422266,2.58912267 C15.9098281,2.75444079 15.689585,2.93643639 15.4833201,3.13353562 Z" />
    <Svg.Path scale={props.size / 34} fill="#000" d="M25.9894074,16.9768443 L20.4429229,22.5233288 C19.955686,23.0105657 19.9542328,23.8034752 20.4423882,24.2916306 C20.9339468,24.7831893 21.7222392,24.7795465 22.2106899,24.2910958 L27.7571744,18.7446113 L33.3036589,24.2910958 C33.7908958,24.7783327 34.5838053,24.7797859 35.0719606,24.2916306 C35.5635193,23.8000719 35.5598766,23.0117796 35.0714259,22.5233288 L29.5249414,16.9768443 L35.2910958,11.2106899 C35.7783327,10.723453 35.7797859,9.93054352 35.2916306,9.44238816 C34.8000719,8.95082946 34.0117796,8.95447221 33.5233288,9.44292291 L27.7571744,15.2090774 L21.99102,9.44292291 C21.5037831,8.95568604 20.7108736,8.95423279 20.2227182,9.44238816 C19.7311595,9.93394685 19.7348023,10.7222392 20.223253,11.2106899 L25.9894074,16.9768443 Z" />
  </Svg>
);