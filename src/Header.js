import React, { useEffect, useState,useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { parseString } from 'xml2js';
import { Nav } from 'react-bootstrap';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Swal from 'sweetalert2';
// import ErrorLogger from './ErrorLogger';
const Header = () => {
    return (
        <>
            <div className="overlay"></div>
                <div className="autorize-popup">
                    <div className="autorize-tabs">
                        <a href="#" className="autorize-tab-a current">Sign in</a>
                        <a href="#" className="autorize-tab-b">Register</a>
                        <a href="#" className="autorize-close"></a>
                        <div className="clear"></div>
                    </div>
                    <section className="autorize-tab-content">
                        <div className="autorize-padding">
                            <h6 className="autorize-lbl">Welocome! Login in to Your Accont</h6>
                            <input type="text" placeholder="Name" />
                            <input type="text" placeholder="Password" />
                            <footer className="autorize-bottom">
                                <button className="authorize-btn">Login</button>
                                <a href="#" className="authorize-forget-pass">Forgot your password?</a>
                                <div className="clear"></div>
                            </footer>
                        </div>
                    </section>
                    <section className="autorize-tab-content">
                        <div className="autorize-padding">
                            <h6 className="autorize-lbl">Register for Your Account</h6>
                            <input type="text" placeholder="Name" />
                            <input type="text" placeholder="Password" />
                            <footer className="autorize-bottom">
                                <button className="authorize-btn">Registration</button>
                                <div className="clear"></div>
                            </footer>
                        </div>
                    </section>
            </div>
            <header id="top">
                <div className="header-b">

                    <div className="mobile-menu">
                        <nav>
                            <ul>
                                <li>
                                    <Link className="has-child" to="/">HOME</Link>
                               

                                </li>

                                <li><a className="has-child" href="#">Services</a>
                                    <ul>
                                        <li><a href="#">Hotel Booking</a></li>
                                        <li><a href="#">Cabs</a></li>
                                        <li><a href="#">Ticketing - Train, Bus & flight</a></li>
                                        <li><a href="#">logistics</a></li>
                                        <li><a href="#">FRRO/FRO consultancy</a></li>
                                    </ul>
                                </li>
                                <li><a className="has-child" href="#">About US</a>

                                </li>
                                <li><a href="#">CONTACTS</a></li>
                            </ul>
                        </nav>
                    </div>


                    <div className="wrapper-padding">
                        <div className="header-logo"><a href="index-2.html"><img alt="" src="img/taxivaxi/logo/cotrav_logo.svg" /></a></div>
                        <div className="header-right">
                            <div className="hdr-srch">
                                <a href="#" className="hdr-srch-btn"></a>
                            </div>
                            <div className="hdr-srch-overlay">
                                <div className="hdr-srch-overlay-a">
                                    <input type="text" placeholder="Start typing..." />
                                    <a href="#" className="srch-close"></a>
                                    <div className="clear"></div>
                                </div>
                            </div>
                            <div className="hdr-srch-devider"></div>
                            <a href="#" className="menu-btn"></a>
                            <nav className="header-nav">
                                <ul>
                                    <li><Link className="nav-links" to="/">HOME</Link></li>
                                    

                                    <li><a className="has-child" href="#">Services</a>
                                        <ul>
                                            <li><a href="flightOneWay.html">Hotel Booking</a></li>
                                            
                                            <li><a href="flightOneWay.html">Cabs</a></li>
                                            <li><a href="flightOneWay.html">Ticketing - Train, Bus & flight</a></li>
                                            <li><a href="flightOneWay.html">logistics</a></li>
                                            <li><a href="flightOneWay.html">FRRO/FRO consultancy</a></li>
                                        </ul>
                                    </li>
                                    <li><a className="has-child" href="#">About US</a>

                                    </li>
                                    <li><a href="#">CONTATCS</a></li>
                                </ul>
                            </nav>
                        </div>
                        <div className="clear"></div>
                    </div>
                </div>
            </header>
        </>
    );
   
}

export default Header