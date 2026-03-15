import React from 'react';
import "./form.scss"

const FileInput = ({file, setFile}) => {
  //Handle on File change 
  const handleOnChange = (e) => {
    setFile(e.target.files[0])
  }
  return <div>
    <input type="file" onChange={handleOnChange}  className='fileInput'/>
  </div>;
};

export default FileInput;