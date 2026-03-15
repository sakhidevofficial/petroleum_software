import React from 'react';
import Avatar from "react-avatar";
import "./form.scss"

const AvatarInput = ({file, setFile}) => {
  //Handle on File change 
  const handleOnChange = (e) => {
    setFile(e.target.files[0])
    // document.getElementById('wrapper').style.backgroundImage = `url(${URL.createObjectURL(file)})`
  }
  return <div className='avatarInputWrapper' id='wrapper'>
    <img src={file && URL.createObjectURL(file)} width="130px" height="130px" />
    <input type="file" onChange={handleOnChange}  className='avatarInput'/>
  </div>;
};

export default AvatarInput;