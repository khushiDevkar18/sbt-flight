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
             <footer className="footer">
      <div className="footer_top">
        {/* Logo and Tagline */}
        <div className="footer_brand">
          <img src="./img/Cotrav_Logo.png" alt="Cotrav Logo" className="footer_logo" />
          <p>
            Simplifying your Business Travel<br />
            Navigating your corporate travel needs,<br />
            from Takeoff to Touchdown.
          </p>
          <div className="footer_socials">
        <img src='./img/FaceBook.png' className='w-2 h-3'/>
        <img src='./img/Instagram.png' className='w-3 h-3'/>
        <img src='./img/Thread.png' className='w-3 h-3'/>
         
          </div>
        </div>

        {/* Contact Info */}
        <div className="footer_contact">
          <h4>Get In Touch</h4>
          <p> <img src='./img/Location_123.png' className='w-2 h-3'/> 6th floor, Unit no. 603, GLOBAL BUSINESS PARK, Tower B,<br />Gurugram, Haryana 122002</p>
          <p>   <img src='./img/Phone.png' className='w-3 h-3'/> 0124-423-4958</p>
          <p>   <img src='./img/email.png' className='w-3 h-3'/>info@taxivaxi.com</p>
          <p>   <img src='./img/angel.png' className='w-3 h-3'/>angelotours</p>
        </div>

        {/* Services */}
        <div className="footer_services">
          <h4>Our Services</h4>
         
            <p>Cab Rentals</p>
            <p>Hotel Bookings</p>
            <p>Ticket Bookings</p>
            <p>FRRO Consultancy</p>
            <p>Logistics</p>
         
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer_bottom px-3">
        <p> Copyright © 2023 - BAI Infosolutions Private Limited</p>
        <div className="footer_links">
          <a href="#">Privacy policy</a>
          <a href="#">Terms of use</a>
          <a href="#">Legal</a>
        </div>
      </div>
    </footer>
        </>
    );
   
}

export default Footer