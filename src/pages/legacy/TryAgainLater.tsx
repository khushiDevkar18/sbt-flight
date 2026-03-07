import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

const TryAgainLater = () => {
    const imageStyle: CSSProperties = { width: '100%', paddingTop: '4%', paddingBottom: '10px' };
    const buttonStyle: CSSProperties = { marginBottom: '2%' };

    return (
        <>
        <div style={{textAlign:'center'}}>
            <img src="img/taxivaxi/pagenotfound/try_again_later.png" style={imageStyle} alt="Try again later" />
            <Link to="/"><button className="back-home-btn" style={buttonStyle}>Back to Home </button></Link>
        </div>
        </>

    )
}

export default TryAgainLater
