import React, {useState} from 'react'
import {  
    TextField
  } from "@mui/material";
  import {Visibility, VisibilityOff} from '@mui/icons-material';
const PasswordInput = ({label, onChange, name, type, state}) => {
    //Set State for handle password visisbility
    const [visibility, setVisibility] = useState(false)

    //Handle Password Visibility
    const handleVisibility = () =>{
        setVisibility(!visibility)
    }
  return (
    <div style={{position: "relative"}}>
        <TextField
            label={label}
            size="small"
            style={{minWidth: "100%"}}
            onChange={onChange}
            name={name}
            type={visibility ? "text":type}
            value={state[name]}
        />
        {visibility ? 
        <Visibility onClick={ () => handleVisibility()} style={{position: "absolute", right: "15", top: "8"}} /> :
        <VisibilityOff onClick={()=>handleVisibility()} style={{position: "absolute", right: "15", top: "8"}} />
        }
    </div>
  )
}

export default PasswordInput