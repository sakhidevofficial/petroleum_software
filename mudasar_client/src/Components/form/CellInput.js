import React from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const CellInput = ({state, name, setState}) => {    
  return (
    
     /*Text Field for the Contact of Tenant*/
     <PhoneInput
     name="Contact Number"
     country={'pk'}
     masks={{pk: '...-.......'}}
     placeholder="+92 300-1234567"
     value={state.contact}
     onChange={contact => setState({...state, [name]: contact })}
   />
  )
}

export default CellInput