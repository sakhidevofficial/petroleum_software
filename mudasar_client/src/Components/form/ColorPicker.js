import React from 'react'
import { MuiColorInput } from 'mui-color-input'

const ColorPicker = ({value, handleColorChange}) => {

  return <MuiColorInput format="hex"  style={{width: "100%"}} value={value} onChange={handleColorChange} />
}

export default ColorPicker;