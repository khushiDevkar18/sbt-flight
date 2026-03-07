import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

const CabResultNotFound = () => {
    const buttonStyle: CSSProperties = {
        backgroundColor: '#785ef7',
        padding: '15px 35px',
        color: 'white',
        textDecoration: 'none',
        width: '200px',
        textTransform: 'uppercase',
        fontFamily: 'raleway',
        fontWeight: 'bold',
        fontSize: '14px',
    };

    return (
        <>
        <div style={{textAlign:'center'}}>
            <img src="/img/Cab_Not_Found.png" className='w-full py-8 mt-2' alt="Cab not found" />
            <Link to="/"><button className="back-home-btn mb-5" style={buttonStyle}>Back to Home </button></Link>
        </div>
        </>

    )
}

export default CabResultNotFound
