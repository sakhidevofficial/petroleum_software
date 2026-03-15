import { Cancel } from '@mui/icons-material'
import { Chip, Typography } from '@mui/material'
import React from 'react'

const Card = ({heading, groups, deleteGroup, deleteFeature, features, dbfeatures}) => {

 
  //Handle Get Feature Name by id
  const getFeatureName = (id) => {
      const name =  dbfeatures.filter(item => item.id === id)[0]?.feature
      return name;
  } 
  return (
    <div className="card" style={{marginTop: "15px"}}>
        {/* Heading of the card  */}
        <Typography>{heading || ""}</Typography>
       
        {/* check if group is an array then iterate groups using map  */}
        {Array.isArray(groups) && groups.map(groupItem => <div key={groupItem.id}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: "center"}}>
            {/* Title for the features group  */}
            <Typography>{groupItem.groupTitle}</Typography>
            {/* Delete group function from list  */}
            <Cancel onClick={()=> deleteGroup(groupItem.id)} sx={{fontSize: 20, color: "#9c9c9c"}}/>
            
            </div>
            <div style={{display: "flex", gap: "5px", paddingTop: "10px", flexWrap: "wrap"}}>
            {/* Check if features type is array then perform filter  */}
            {Array.isArray(features) && features
              .filter((item) => item.group === groupItem.id)
              .map((item) => (
                <div key={item.id}>
                  {/* //After filtering and mapping iterate each item in chip  */}
                <Chip  label={`${getFeatureName(item.id)}`} size="small" onDelete={()=>deleteFeature(item.id)} />
                </div>
              ))}
         
        </div>
        
        </div>  
        )} 
       
    </div>
  )
}

export default Card