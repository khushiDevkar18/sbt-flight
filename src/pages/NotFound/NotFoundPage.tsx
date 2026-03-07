import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
    const imageStyle: CSSProperties = { width: '100%', paddingBottom: '50px' };
    const buttonStyle: CSSProperties = {
        backgroundColor: '#bd8100',
        padding: '15px 35px',
        color: '#fff',
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
            <img src="img/taxivaxi/pagenotfound/page not found.png" style={imageStyle} alt="Page not found" />
            <Link to="/"><button className="back-home-btn" style={buttonStyle}>Back to Home </button></Link>
        </div>
        </>

    )
}

export default PageNotFound
