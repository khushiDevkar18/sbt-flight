import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { parseString } from 'xml2js';
import './styles.css';
import Swal from 'sweetalert2';
import CONFIG from "./config";
// import ErrorLogger from './ErrorLogger';
const BookingContinue = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [flightErrors, setFlighterrors] = useState([]);
    const [pnr, setPnr] = useState([]);
    const [resegments, setresegments] = useState([]);
    const [respricings, setrespricings] = useState([]);
    const reservationData = location.state && location.state.bookingCompleteData.reservationdata;
    const apiairports = location.state && location.state.bookingCompleteData.apiairportsdata;
    const ticketdata = location.state && location.state.bookingCompleteData.ticketdata;
    // console.log('ticketdata', ticketdata);
    const segments = location.state && location.state.bookingCompleteData.segmentParse;
    const Passengers = location.state && location.state.bookingCompleteData.Passengers;
    const packageSelected = location.state && location.state.bookingCompleteData.PackageSelected;
    const Airports = location.state && location.state.bookingCompleteData.Airports;
    const Airlines = location.state && location.state.bookingCompleteData.Airlines;
    const markup_price = location.state && location.state.bookingCompleteData.markup_price;
    const discount = location.state && location.state.bookingCompleteData.discount;
    
    const seat_codes = location.state && location.state.bookingCompleteData.seat_codes;
    const bookingid = location.state && location.state.bookingCompleteData.booking_id;
    const reservationStatus = location.state && location.state.bookingCompleteData.bookingStatus;
    const flightDetails = location.state && location.state.bookingCompleteData.flightDetails;
    console.log("flightDetailsB", flightDetails);
    console.log("reservationStatus",reservationStatus);

    const segmentlist = sessionStorage.getItem('segmentarray');
    console.log('segmentlist', segmentlist);
    const request = location.state?.bookingCompleteData || {};

    useEffect(() => {
        const disableBackButton = () => {
            window.history.pushState(null, '', window.location.href);
            window.onpopstate = () => {
                window.history.pushState(null, '', window.location.href);
                navigate('/'); // Redirect to main home page
            };
        };

        disableBackButton();

        return () => {
            window.onpopstate = null;
        };
    }, [navigate]);
    const handleAirline = (carrier) => {
        const airline = Airlines.find((airlineInfo) => {
            return airlineInfo['$'] && airlineInfo['$']['Code'] === carrier;
        });
        if (airline) {
            return airline['$']['Description'];
        } else {
            return "Airline";
        }
    }
    const handleAirport = (airportcode) => {
        if (airportcode) {
            const airport = Airports.find((airportInfo) => {
                return airportInfo['$'] && airportInfo['$']['Code'] === airportcode;
            });
            if (airport) {
                return airport['$']['Name'];
            } else {
                return "Airport";
            }
        }
    }
    const handleApiAirport = (airportcode) => {
        const airportapi = apiairports.find((apiairportsInfo) => {
            return apiairportsInfo && apiairportsInfo['airport_iata_code'] === airportcode;
        });
        if (airportapi) {
            return (airportapi['airport_name']);
        } else {
            return "";
        }
    }

    const downloadETicket = async () => {
        try {
            const response = await axios.post(
                `${CONFIG.MAIN_API}/api/flights/getBookingEticket`,
                new URLSearchParams({ booking_id: bookingid }) // Send booking_id as form data
            );

            if (response.data.success === "1" && response.data.result?.ticket) {
                window.open(response.data.result.ticket, "_blank"); // Open ticket in new tab
            } else {
                console.error("No ticket found:", response.data);
            }
        } catch (error) {
            console.error("Error downloading e-ticket:", error);
        }
    };
    const calculateAge = (birthdate) => {
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    useEffect(() => {
        parseString(reservationData, { explicitArray: false }, (err, reservationresult) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return;
            }
            const ReservationRsp = reservationresult['SOAP:Envelope']['SOAP:Body']['universal:AirCreateReservationRsp'];
            if (ReservationRsp !== null && ReservationRsp !== undefined) {
                const passnegrinfo = reservationresult['SOAP:Envelope']['SOAP:Body']['universal:AirCreateReservationRsp']['universal:UniversalRecord']['common_v52_0:BookingTraveler'];
                const pnrCode = reservationresult['SOAP:Envelope']['SOAP:Body']['universal:AirCreateReservationRsp']['universal:UniversalRecord']['air:AirReservation']['common_v52_0:SupplierLocator']['$']['SupplierLocatorCode'];
                const universallocatorCode = reservationresult['SOAP:Envelope']['SOAP:Body']['universal:AirCreateReservationRsp']['universal:UniversalRecord']['$']['LocatorCode'];
                const ressegmentinfo = reservationresult['SOAP:Envelope']['SOAP:Body']['universal:AirCreateReservationRsp']['universal:UniversalRecord']['air:AirReservation']['air:AirSegment'];
                const respricinginfo = reservationresult['SOAP:Envelope']['SOAP:Body']['universal:AirCreateReservationRsp']['universal:UniversalRecord']['air:AirReservation']['air:AirPricingInfo'];
                setPnr(pnrCode);
                setresegments(Array.isArray(ressegmentinfo) ? ressegmentinfo : [ressegmentinfo]);
                setrespricings(Array.isArray(respricinginfo) ? respricinginfo : [respricinginfo]);
            } else {
                const error = reservationresult['SOAP:Envelope']['SOAP:Body']['SOAP:Fault']['faultstring'];
                setFlighterrors(error);
            }
        });


    }, []);

    useEffect(() => {
        let timeoutId;
        const timeoutDuration = 5 * 60 * 1000;
        const handleInactive = () => {
            Swal.fire({
                title: 'Something went Wrong !',
                text: 'Your session has expired. You will be redirected to the homepage.',
                confirmButtonText: 'OK'
            });
            navigate('/');
        };
        const resetTimer = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleInactive, timeoutDuration);
        };
        const resetOnActivity = () => {
            resetTimer();
            window.addEventListener('mousemove', resetTimer);
            window.addEventListener('keydown', resetTimer);
        };
        resetOnActivity();
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
        };
    }, [navigate]);
    return (
        <div className="yield-content">
        
            <div className="main-cont" id="main_cont">
                <div className="body-wrapper">
                    <div className="wrapper-padding">
                        <span class="bgGradient">
                            <p style={{ color: 'white', marginTop: '33px', marginLeft: '10px', fontSize: '19px' }}>
                                {/* Your Flight Booking is confirmed! */}
                                {reservationStatus}
                                <div style={{ fontSize: '12px' }}>PNR No. {pnr}</div>
                            </p>
                        </span>
                        <div className="sp-page" >
                            <div className="sp-page-a" style={{ marginTop: '36px' }}>
                                <div className="sp-page-l">
                                    <div className="sp-page-lb">
                                        <div className="sp-page-p">
                                            <div className="booking-left">
                                              
                                                <div className="complete-info">
                                                    <div className="complete-info-table">
                                                        <div className="complete-info-i">
                                                            {resegments && resegments.map((segmentinfo, segmentindex) => {
                                                                if (segmentinfo['$'] && segmentinfo['$']['Group'] === "0") {
                                                                    return (
                                                                        <div key={segmentindex}>
                                                                            <div id="Flight Details" className="tabcontent">
                                                                                <div className="flight-route">
                                                                                    <span className="route">
                                                                                        {handleAirport(segmentinfo['$']['Origin'])} → {handleAirport(segmentinfo['$']['Destination'])}
                                                                                    </span>
                                                                                    <span className={`status-chip ${reservationStatus === 'Flight Booking is confirmed!.' || reservationStatus === 'Booking Ticketed.' ? '' : 'red'}`}>
                                                                                    {reservationStatus === 'Flight Booking is confirmed!.' || reservationStatus === 'Booking Ticketed.' ? 'Confirmed' : 'On Hold'}
                                                                                    </span>



                                                                                </div>
                                                                                <div className="clear" />


                                                                                <div className="flight-details-containerr">
                                                                                    {/* Left Section - Airline Logo, Name, Flight Number */}
                                                                                    <div className="flight-details-left">
                                                                                        <img
                                                                                            src={`https://devapi.taxivaxi.com/airline_logo_images/${segmentinfo['$']['Carrier']}.png`}
                                                                                            alt="Airline Logo"
                                                                                            className="airline-logoo"
                                                                                        />
                                                                                        <div className="airline-info">
                                                                                            <div className="airline-name">
                                                                                                {handleAirline(segmentinfo['$']['Carrier'])}
                                                                                            </div>
                                                                                            <div className="airline-details">
                                                                                                {segmentinfo['$']['Carrier']}-{segmentinfo['$']['FlightNumber']}
                                                                                            </div>
                                                                                            <span className="equipmentno">
                                                                                                {segmentinfo['$']['Equipment']}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>

                                                                                    {/* Right Section - Departure & Arrival */}
                                                                                    <div className="flight-details-right">
                                                                                        {/* Departure Details */}
                                                                                        <div className="flight-timee-details">
                                                                                            <div className="flight-timee">{new Date(segmentinfo['$']['DepartureTime']).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                                                                                            <div className="flight-date">
                                                                                                {(() => {
                                                                                                    const departureDate = new Date(segmentinfo['$']['DepartureTime']);
                                                                                                    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                                                                                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                                                                                    return `${weekdays[departureDate.getDay()]}, ${departureDate.getDate()} ${months[departureDate.getMonth()]} ${departureDate.getFullYear()}`;
                                                                                                })()}
                                                                                            </div>
                                                                                            <div className="flight-location">{handleAirport(segmentinfo['$']['Origin'])}</div>
                                                                                            {/* <div className="flight-terminal">
                                                                                            {handleApiAirport(segmentinfo['$']['Origin'])} 
                                                                                            {segmentinfo['air:FlightDetails']?.['$']?.['OriginTerminal'] ? `. T-${segmentinfo['air:FlightDetails']['$']['OriginTerminal']}` : ''}
                                                                                        </div> */}
                                                                                            <div className="flight-terminal">
                                                                                                {handleApiAirport(segmentinfo['$']['Origin'])}
                                                                                                {(() => {
                                                                                                    const matchedFlightDetail = flightDetails.find(flight =>
                                                                                                        flight.$?.Origin === segmentinfo['$']['Origin'] &&
                                                                                                        flight.$?.Destination === segmentinfo['$']['Destination'] &&
                                                                                                        flight.$?.DepartureTime === segmentinfo['$']['DepartureTime'] &&
                                                                                                        flight.$?.ArrivalTime === segmentinfo['$']['ArrivalTime']
                                                                                                    );

                                                                                                    return matchedFlightDetail?.$?.OriginTerminal ? (
                                                                                                        <span> T-{matchedFlightDetail.$.OriginTerminal}</span>
                                                                                                    ) : (
                                                                                                        ""
                                                                                                    );
                                                                                                })()}

                                                                                            </div>


                                                                                        </div>

                                                                                        {/* Flight Duration */}
                                                                                        <div className="flight-duration">
                                                                                            <div className="duration-text">
                                                                                                {(() => {
                                                                                                    {/* console.log('TravelTime',segmentinfo['$']['TravelTime']); */ }
                                                                                                    const flightTimeInMinutes = parseInt(segmentinfo['$']['TravelTime'] || "0");
                                                                                                    const hours = Math.floor(flightTimeInMinutes / 60);
                                                                                                    const minutes = flightTimeInMinutes % 60;
                                                                                                    return `${hours}h ${minutes}m`;
                                                                                                })()}
                                                                                            </div>
                                                                                            <div className="duration-line">
                                                                                                <hr />
                                                                                            </div>
                                                                                        </div>

                                                                                        {/* Arrival Details */}
                                                                                        <div className="flight-timee-details">
                                                                                            <div className="flight-timee">{new Date(segmentinfo['$']['ArrivalTime']).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
                                                                                            <div className="flight-date">
                                                                                                {(() => {
                                                                                                    const arrivalDate = new Date(segmentinfo['$']['ArrivalTime']);
                                                                                                    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                                                                                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                                                                                    return `${weekdays[arrivalDate.getDay()]}, ${arrivalDate.getDate()} ${months[arrivalDate.getMonth()]} ${arrivalDate.getFullYear()}`;
                                                                                                })()}
                                                                                            </div>
                                                                                            <div className="flight-location">{handleAirport(segmentinfo['$']['Destination'])}</div>
                                                                                            {/* <div className="flight-terminal">
                                                                                            {handleApiAirport(segmentinfo['$']['Destination'])} 
                                                                                            {segmentinfo['air:FlightDetails']?.['$']?.['DestinationTerminal'] ? `. T-${segmentinfo['air:FlightDetails']['$']['DestinationTerminal']}` : ''}
                                                                                        </div> */}
                                                                                            <div className="flight-terminal">
                                                                                                {handleApiAirport(segmentinfo['$']['Destination'])}
                                                                                                {(() => {
                                                                                                    const matchedFlightDetail = flightDetails.find(flight =>
                                                                                                        flight.$?.Origin === segmentinfo['$']['Origin'] &&
                                                                                                        flight.$?.Destination === segmentinfo['$']['Destination'] &&
                                                                                                        flight.$?.DepartureTime === segmentinfo['$']['DepartureTime'] &&
                                                                                                        flight.$?.ArrivalTime === segmentinfo['$']['ArrivalTime']
                                                                                                    );

                                                                                                    return matchedFlightDetail?.$?.DestinationTerminal ? (
                                                                                                        <span> T-{matchedFlightDetail.$.DestinationTerminal}</span>
                                                                                                    ) : (
                                                                                                        ""
                                                                                                    );
                                                                                                })()}
                                                                                            </div>

                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="clear" />
                                                                            </div>
                                                                            <br className="clear" />
                                                                        </div>
                                                                    );
                                                                }
                                                            })}
                                                            {resegments && resegments.map((segmentinfo, segmentindex) => {
                                                                if (segmentinfo['$'] && segmentinfo['$']['Group'] === "1") {
                                                                    return (
                                                                        <div key={segmentindex}>
                                                                            <div id="Flight Details" className="tabcontent">
                                                                                <div className="flight-details-a">
                                                                                    <img
                                                                                        src={`https://devapi.taxivaxi.com/airline_logo_images/${segmentinfo['$']['Carrier']}.png`}
                                                                                        width="20px"
                                                                                    />
                                                                                    || {handleAirport(segmentinfo['$']['Origin'])} to {handleAirport(segmentinfo['$']['Destination'])} , &nbsp;
                                                                                    {segmentinfo['$'] &&
                                                                                        (() => {
                                                                                            const arrivalTime = new Date(segmentinfo['$']['DepartureTime']);
                                                                                            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                                                                                            const day = arrivalTime.getDate();
                                                                                            const month = months[arrivalTime.getMonth()];
                                                                                            const formattedDateString = `${day} ${month}`;

                                                                                            return formattedDateString;
                                                                                        })()
                                                                                    } . {segmentinfo['$']['Carrier']}{segmentinfo['$']['FlightNumber']}
                                                                                    <span className='equipmentno'>{segmentinfo['$']['Equipment']}</span>
                                                                                </div>
                                                                                <br className="clear" />
                                                                                <div className="clear" />
                                                                                <div
                                                                                    className="flight-details-l"
                                                                                    style={{ width: 290 }}
                                                                                >
                                                                                    <div className="flight-details-b">{/*21:55*/}
                                                                                        {new Date(segmentinfo['$']['DepartureTime']).toLocaleTimeString('en-US', {
                                                                                            hour: 'numeric',
                                                                                            minute: 'numeric',
                                                                                            hour12: false,
                                                                                        })}
                                                                                    </div>
                                                                                    <div className="flight-details-b">
                                                                                        {segmentinfo['$'] &&
                                                                                            (() => {
                                                                                                const arrivalTime = new Date(segmentinfo['$']['DepartureTime']);
                                                                                                const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                                                                                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                                                                                                const weekday = weekdays[arrivalTime.getDay()];
                                                                                                const day = arrivalTime.getDate();
                                                                                                const month = months[arrivalTime.getMonth()];
                                                                                                const year = arrivalTime.getFullYear();

                                                                                                // Construct the final formatted date string
                                                                                                const formattedDateString = `${weekday}, ${day} ${month} ${year}`;

                                                                                                return formattedDateString;
                                                                                            })()
                                                                                        }
                                                                                    </div>
                                                                                    <div className="flight-details-c">{handleAirport(segmentinfo['$']['Origin'])} </div>
                                                                                    <div className="flight-details-c1">{handleApiAirport(segmentinfo['$']['Origin'])} {segmentinfo['air:FlightDetails'] && segmentinfo['air:FlightDetails']['$'] && segmentinfo['air:FlightDetails']['$']['OriginTerminal'] ? `. T-${segmentinfo['air:FlightDetails'] && segmentinfo['air:FlightDetails']['$'] && segmentinfo['air:FlightDetails']['$']['OriginTerminal']}` : ''}</div>
                                                                                </div>
                                                                                <div className="flight-details-m">
                                                                                    <div
                                                                                        className="flight-details-b"
                                                                                        style={{ textAlign: "center" }}
                                                                                    >
                                                                                        {segmentinfo['$']
                                                                                            && (() => {
                                                                                                const flightTimeInMinutes = parseInt(segmentinfo['air:FlightDetails'] && segmentinfo['air:FlightDetails']['$'] && segmentinfo['air:FlightDetails']['$']['FlightTime']);
                                                                                                const hours = Math.floor(flightTimeInMinutes / 60);
                                                                                                const minutes = flightTimeInMinutes % 60;
                                                                                                const formattedHours = String(hours).padStart(2, '0');
                                                                                                const formattedMinutes = String(minutes).padStart(2, '0');
                                                                                                const formattedFlightTime = `${formattedHours}h ${formattedMinutes}m`;
                                                                                                return formattedFlightTime;
                                                                                            })
                                                                                                ()}
                                                                                        {/* 2h 20m */}
                                                                                    </div>
                                                                                    <div className="flight-details-b">
                                                                                        <hr
                                                                                            style={{
                                                                                                padding: 2,
                                                                                                backgroundColor: "#bd8100",
                                                                                                color: "#bd8100",
                                                                                                margin: 2
                                                                                            }}
                                                                                        />
                                                                                    </div>
                                                                                    <div className="flight-details-c" />
                                                                                </div>
                                                                                <div className="flight-details-r">
                                                                                    <div className="flight-details-b">{/*00:15*/}
                                                                                        {new Date(segmentinfo['$']['ArrivalTime']).toLocaleTimeString('en-US', {
                                                                                            hour: 'numeric',
                                                                                            minute: 'numeric',
                                                                                            hour12: false,
                                                                                        })}
                                                                                    </div>
                                                                                    <div className="flight-details-b">
                                                                                        {/* Thu,25 Jan 24 */}
                                                                                        {segmentinfo['$'] &&
                                                                                            (() => {
                                                                                                const arrivalTime = new Date(segmentinfo['$']['ArrivalTime']);
                                                                                                const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                                                                                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                                                                                                const weekday = weekdays[arrivalTime.getDay()];
                                                                                                const day = arrivalTime.getDate();
                                                                                                const month = months[arrivalTime.getMonth()];
                                                                                                const year = arrivalTime.getFullYear();

                                                                                                // Construct the final formatted date string
                                                                                                const formattedDateString = `${weekday}, ${day} ${month} ${year}`;

                                                                                                return formattedDateString;
                                                                                            })()
                                                                                        }

                                                                                    </div>
                                                                                    <div className="flight-details-c">{handleAirport(segmentinfo['$']['Destination'])} </div>
                                                                                    <div className="flight-details-c1">
                                                                                        {handleApiAirport(segmentinfo['$']['Destination'])} {segmentinfo['air:FlightDetails'] && segmentinfo['air:FlightDetails']['$'] && segmentinfo['air:FlightDetails']['$']['DestinationTerminal'] ? `. T-${segmentinfo['air:FlightDetails'] && segmentinfo['air:FlightDetails']['$'] && segmentinfo['air:FlightDetails']['$']['DestinationTerminal']}` : ''}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="clear" />
                                                                            </div>
                                                                            <br className="clear" />
                                                                        </div>
                                                                    );
                                                                }
                                                            })}
                                                            <br className="clear" />
                                                        </div>
                                                    </div>
                                                    <div className="complete-devider" />

                                                    <div className="passenger-details-container">
                                                        <table className="passenger-table">
                                                            <thead>
                                                                <tr>
                                                                    <th>TRAVELLER</th>
                                                                    <th>PNR/E-TICKET NUMBER</th>
                                                                    <th>SEAT</th>
                                                                    <th>MEAL</th>
                                                                    <th>EXCESS BAGGAGE</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {Passengers && Passengers.keys && Passengers.keys.length > 0 &&
                                                                    Passengers.keys.map((key, index) => (
                                                                        <tr key={index}>
                                                                            <td className="traveller-info">
                                                                                <span className="traveller-icon">👤</span>
                                                                                <span className="traveller-name">
                                                                                    <strong>{Passengers.namesWithPrefix[index]} {Passengers.firstNames[index]} {Passengers.lastNames[index]}</strong>
                                                                                    &nbsp;{Passengers.codes[index] === 'ADT' ? 'Adult' :
                                                                                        Passengers.codes[index] === 'CNN' ? 'Child' :
                                                                                            Passengers.codes[index] === 'INF' ? 'Infant' : 'Unknown'}, {Passengers.genderNames[index] === 'M' ? 'Male' : 'Female'}
                                                                                </span>
                                                                            </td>
                                                                            <td>
                                                                                <strong>{pnr}</strong>
                                                                                <br />

                                                                            </td>
                                                                            <td>
                                                                                {Array.isArray(seat_codes) && seat_codes.length > 0 ? seat_codes.join(", ") : " - "}
                                                                            </td>

                                                                            <td>-</td>
                                                                            <td>-</td>
                                                                        </tr>
                                                                    ))
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="complete-devider" />
                                                    <div className="bg-orange-100 border-l-4 border-orange-500 p-3 rounded-md shadow-sm text-sm">
                                                        <p className="text-orange-700 font-bold text-xs">IMPORTANT INFORMATION</p>
                                                        <ul className="mt-1 text-gray-700 text-xs pl-4">
                                                            <li className="flex items-start">
                                                                <span className="text-xs leading-5">●</span>
                                                                <div className="pl-2">
                                                                    <span className="font-semibold">Valid ID proof needed :</span>
                                                                    <span className="ml-1">
                                                                        Carry a valid photo identification proof (Driver Licence, Aadhar Card, Pan Card, or any other Government-recognized photo identification)
                                                                    </span>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="booking-devider" />
                                                    
                                                    <div className='complete-txt'>
                                                    </div>
                                                    <div className="complete-devider" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="clear" />
                                </div>
                            </div>
                            <div className="sp-page-r" style={{ marginTop: '83px' }}>
                                <div className="h-help">
                                    <div className="h-help-lbl">Ticket(s)</div>
                                    <div className="h-help-links">
                                        {/* <div className="h-help-link">
                                            
                                            <a href="#" className="h-help-text">Download E-ticket(s)</a>
                                        </div> */}
                                        <div className="h-help-link">
                                            <a href="#" className="h-help-text" onClick={(e) => { e.preventDefault(); downloadETicket(); }}>
                                                Download E-ticket(s)
                                            </a>
                                        </div>

                                    </div>
                                </div>
                                <div className="h-help">
                                    <div className="h-help-lbl">Need CoTrav Help?</div>
                                    <div className="h-help-lbl-a">
                                        We would be happy to help you!
                                    </div>
                                    <div className="h-help-phone">0124-423-4958</div>
                                    <div className="h-help-email">flight@cotrav.co</div>
                                </div>
                                <div className="h-help">
                                    <div className="h-help-lbl">Good To Know</div>
                                    <div className="h-help-lbl-a">While boarding a Domestic Flight</div>

                                    <div className="h-help-item">
                                        <i className="fas fa-clock h-help-icon"></i>
                                        <div className="h-help-text">
                                            <div className="h-help-title">Boarding Time</div>
                                            <p className="h-help-desc">Check-in desks will close 1 hour before departure.</p>
                                        </div>
                                    </div>

                                    <div className="h-help-item">
                                        <i className="fas fa-id-card h-help-icon"></i>
                                        <div className="h-help-text">
                                            <div className="h-help-title">Valid ID Proof Required</div>
                                            <p className="h-help-desc">
                                                Please carry a valid ID proof. Driving License, Aadhar Card, Pan Card, or any other government-authorized photo identification.
                                            </p>
                                        </div>
                                    </div>
                                </div>



                                <div className="h-reasons">
                                    <div className="h-liked-lbl">Price Breakup</div>
                                    <div className="h-reasons-row">
                                        <div className="reasons-i">
                                            <div className="reasons-h">
                                                <div className="reasons-l">Total Price</div>
                                                <div className="reasons-r">
                                                    <div className="reasons-rb">
                                                        <div className="reasons-p">
                                                            <div className="reasons-i-lbl">
                                                                <strong>
                                                                    {packageSelected && packageSelected.$.TotalPrice.includes('INR') ? '₹ ' : ''}
                                                                    {(parseFloat(packageSelected.$.TotalPrice.replace('INR', '').trim()) + markup_price + discount)}</strong>
                                                                {/* {packageSelected && packageSelected.$.TotalPrice.replace('INR', '')} */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <br className="clear" />
                                                </div>
                                            </div>
                                            <div className="clear" />
                                        </div>
                                        {packageSelected && packageSelected['air:AirPricingInfo'] && (
                                            Array.isArray(packageSelected['air:AirPricingInfo'])
                                                ? (
                                                    packageSelected['air:AirPricingInfo'].map((priceInfo, priceIndex) => (
                                                        <div key={priceIndex} className="reasons-i">
                                                            <div className="reasons-h">
                                                                <div className="reasons-l">
                                                                    {priceInfo['air:PassengerType']['$'] ? (
                                                                        <>
                                                                            {
                                                                                priceInfo['air:PassengerType']['$']['Code'] === 'ADT' ? `Adult X ${request.adult}` :
                                                                                    priceInfo['air:PassengerType']['$']['Code'] === 'CNN' ? `Child X ${request.child}` :
                                                                                        priceInfo['air:PassengerType']['$']['Code'] === 'INF' ? `Infant X ${request.infant}` : 'Unknown'
                                                                            }
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            {
                                                                                priceInfo['air:PassengerType'][0]['$']['Code'] === 'ADT' ? `Adult X ${request.adult}` :
                                                                                    priceInfo['air:PassengerType'][0]['$']['Code'] === 'CNN' ? `Child X ${request.child}` :
                                                                                        priceInfo['air:PassengerType'][0]['$']['Code'] === 'INF' ? `Infant X ${request.infant}` : 'Unknown'
                                                                            }
                                                                        </>
                                                                    )
                                                                    }
                                                                </div>
                                                                <div className="reasons-r">
                                                                    <div className="reasons-rb">
                                                                        <div className="reasons-p">
                                                                            <div className="reasons-i-lbl">
                                                                                {priceInfo.$.ApproximateBasePrice.includes('INR') ? '₹ ' : ''}
                                                                                {priceInfo.$.ApproximateBasePrice.replace('INR', '')}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <br className="clear" />
                                                                </div>
                                                            </div>
                                                            <div className="clear" />
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="reasons-i">
                                                        <div className="reasons-h">
                                                            <div className="reasons-l">Adult X {request.adult}</div>
                                                            <div className="reasons-r">
                                                                <div className="reasons-rb">
                                                                    <div className="reasons-p">
                                                                        <div className="reasons-i-lbl">
                                                                            {packageSelected['air:AirPricingInfo'].$.ApproximateBasePrice.includes('INR') ? '₹ ' : ''}
                                                                            {packageSelected['air:AirPricingInfo'].$.ApproximateBasePrice.replace('INR', '')}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <br className="clear" />
                                                            </div>
                                                        </div>
                                                        <div className="clear" />
                                                    </div>
                                                )
                                        )}
                                        <div className="reasons-i">
                                            <div className="reasons-h">
                                                <div className="reasons-l">All Taxes (includes)</div>
                                                <div className="reasons-r">
                                                    <div className="reasons-rb">
                                                        <div className="reasons-p">
                                                            <div className="reasons-i-lbl">
                                                                {packageSelected && packageSelected.$.ApproximateTaxes.includes('INR') ? '₹ ' : ''}
                                                                {/* {packageSelected && packageSelected.$.ApproximateTaxes.replace('INR', '')} */}
                                                                {(parseFloat(packageSelected.$.ApproximateTaxes.replace('INR', '').trim()) + markup_price + discount)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <br className="clear" />
                                                </div>
                                            </div>
                                            <div className="clear" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="clear" />
                        </div>
                    </div>
                </div>
            </div>
            {/* /main-cont */}
        </div>


    )
}

export default BookingContinue