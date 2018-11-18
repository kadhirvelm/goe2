import * as React from "react";

import { IIconProps } from "./icon";

export class RelativeGraphIcon extends React.PureComponent<IIconProps> {
  public render() {
    return (
      <svg
        id="Layer_1"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 150 55"
        {...this.props.attributes}
      >
        <line x1="15.76" y1="27.46" x2="47" y2="39" />
        <line x1="15.76" y1="27.46" x2="127" y2="31" />
        <line x1="15.76" y1="27.46" x2="87" y2="14" />
        <circle cx="15.48" cy="27.18" r="10.96" />
        <path d="M15.48,16.72A10.46,10.46,0,1,1,5,27.18,10.47,10.47,0,0,1,15.48,16.72m0-1A11.46,11.46,0,1,0,26.94,27.18,11.47,11.47,0,0,0,15.48,15.72Z" />
        <path d="M57.85,32.09A10.46,10.46,0,1,1,47.39,42.55,10.47,10.47,0,0,1,57.85,32.09m0-1A11.46,11.46,0,1,0,69.31,42.55,11.46,11.46,0,0,0,57.85,31.09Z" />
        <path d="M97.69,2A10.47,10.47,0,1,1,87.23,12.48,10.48,10.48,0,0,1,97.69,2m0-1a11.47,11.47,0,1,0,11.46,11.47A11.47,11.47,0,0,0,97.69,1Z" />
        <path d="M137.52,20.15a10.47,10.47,0,1,1-10.46,10.47,10.49,10.49,0,0,1,10.46-10.47m0-1A11.47,11.47,0,1,0,149,30.62a11.47,11.47,0,0,0-11.47-11.47Z" />
      </svg>
    );
  }
}
