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
const Footer = () => {
    return (
        <>
            <footer className="footer-a">
                <div className="wrapper-padding">
                    <div className="section">
                        <div className="footer-lbl">Get In Touch</div>
                        <div className="footer-adress">Address: 6th floor, Unit no. 603, GLOBAL BUSINESS PARK,Tower B,Gurugram, <br />  Haryana 122002</div>
                        <div className="footer-phones">Telephones: 0124-423-4958</div>
                        <div className="footer-email">E-mail: info@taxivaxi.com</div>
                        <div className="footer-skype">Skype: angelotours</div>
                    </div>
                    <div className="section">
                        <div className="footer-lbl">Our Services</div>
                        <div className="footer-tours">

                            <div className="footer-tour">
                                Cab Rentals
                                <div className="clear"></div>
                            </div>

                            <div className="footer-tour">
                                Hotel Bookings
                                <div className="clear"></div>
                            </div>

                            <div className="footer-tour">
                                Ticket Bookings
                                <div className="clear"></div>
                            </div>

                            <div className="footer-tour">
                                FRRO Consultancy
                                <div className="clear"></div>
                            </div>

                            <div className="footer-tour">
                                Logistics
                                <div className="clear"></div>
                            </div>

                        </div>
                    </div>
                    <div className="section">
                        <div className="footer-lbl">About US</div>
                    </div>
                    <div className="section">
                        <div className="footer-lbl">sign up</div>
                        <div className="footer-subscribe">
                            <div className="footer-subscribe-a">
                                <input type="text" placeholder="you email" defaultValue="your email" />
                            </div>
                        </div>
                        <button className="footer-subscribe-btn">Sign up</button>
                    </div>
                </div>
                <div className="clear"></div>
            </footer>

            <footer className="footer-b">
                <div className="wrapper-padding">
                    <div className="footer-left">Copyright © 2023 - BAI Infosolutions Private Limited</div>
                    <div className="footer-social">
                        <a href="#" className="footer-twitter"></a>
                        <a href="#" className="footer-facebook"></a>
                        <a href="#" className="footer-instagram"></a>
                    </div>
                    <div className="clear"></div>
                </div>
            </footer>
        </>
    );
   
}

export default Footer