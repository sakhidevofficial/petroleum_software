import React from 'react'


const PageNotFount = () => {
  return (
    <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <img src="/img/pageNotFound4.jpg" alt='notfoundimage' width={270} height={300} />
        {/* <img src="/img/pageNotFound1.png" width={600} height={500} /> */}
       
       <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>

      <h1 style={{color: "#386DB5"}}>SORRY PAGE NOT FOUND</h1>
      <div style={{width: 500, textAlign: "center", color: "#5c87c3ff"}}>Sorry for inconvienence, try to access another feature from the sidebar. We hope you will not be disappointed from the app.</div>
       </div>
    </div>
  )
}

export default PageNotFount
