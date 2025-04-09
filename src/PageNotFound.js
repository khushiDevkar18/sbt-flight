import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const PageNotFound = () => {
    



    return (
        <>
        

        <div style={{textAlign:'center'}}>
            <img src="img/taxivaxi/pagenotfound/page not found.png" style={{width:'100%',paddingBottom:'50px'}} />
            <Link to="/"><button className="back-home-btn" style={{
                backgroundColor: '#bd8100',
                padding: '15px 35px',
                color: '#fff',
                textDecoration: 'none',
                width: '200px',
                textTransform: 'uppercase',
                fontFamily: 'raleway',
                fontWeight: 'bold', // Corrected value
                fontSize: '14px' // Added fontSize property
                }}>Back to Home </button></Link>
        </div>
        </>

    )
}

export default PageNotFound