import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const ResultNotFound = () => {
    



    return (
        <>
        

        <div style={{textAlign:'center'}}>
            <img src="/img/resultNotFound.png" className='w-full py-8'/>
            <Link to="/"><button className="back-home-btn" style={{
                backgroundColor: '#785ef7',
                padding: '15px 35px',
                color: 'white',
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

export default ResultNotFound