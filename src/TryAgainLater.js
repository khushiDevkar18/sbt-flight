import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const TryAgainLater = () => {
    



    return (
        <>
        

        <div style={{textAlign:'center'}}>
            <img src="img/taxivaxi/pagenotfound/try_again_later.png" style={{width:'100%', paddingTop:'4%', paddingBottom:'10px'}} />
            <Link to="/"><button className="back-home-btn" style={{marginBottom:'2%'}}>Back to Home </button></Link>
        </div>
        </>

    )
}

export default TryAgainLater