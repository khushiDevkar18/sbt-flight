import React, { useEffect, useState, useRef } from 'react'
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
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import CONFIG from "./config";


const FlightCheckIn = ({ CheckIn, onFlightCheckInChange }) => {
    useEffect(() => {
        const newCheckIn = CheckIn;
        onFlightCheckInChange(newCheckIn);
    }, []);
    return <span>{CheckIn}</span>;
};
const FlightCabin = ({ Cabin, onFlightCabinChange }) => {
    useEffect(() => {
        const newCabin = Cabin;
        onFlightCabinChange(newCabin);
    }, []);
    return <span>{Cabin}</span>;
};
const Booking = () => {
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const formtaxivaxi = location.state && location.state.serviceData.formtaxivaxi;
    const bookingid = location.state && location.state.serviceData.booking_id;
    const clientid = location.state && location.state.serviceData?.client_id;
    const is_gst_benefit = location.state && location.state.serviceData?.is_gst_benefit;
    const fareInfoRefKey = location.state && location.state.serviceData?.fareInfoRefKey;

    const segmentParsee = location.state && location.state.serviceData.SegmentPricelist;
    const packageSelectedd = location.state && location.state.serviceData.packageselected;
    const [segmentParse, setSegmentParse] = useState(() => segmentParsee); // Initialize only once
    const hasUpdated = useRef(false);
    useEffect(() => {
        if (!hasUpdated.current && segmentParsee) {
            setSegmentParse(segmentParsee);
        }
    }, [segmentParsee]);

    const packageSelectedRef = useRef(null);
    const segmentParseRef = useRef(null);

    const [packageSelected, setPackageSelected] = useState(packageSelectedd);
    console.log('asdfasdfkjasdfasd', packageSelected);

    const tripType = formtaxivaxi['trip_type'];
    const flightType = formtaxivaxi['flight_type'];
    let seat_type = formtaxivaxi['seat_type'];
    let returns = 0;
    if (formtaxivaxi) {
        returns = formtaxivaxi['trip_type'] === "Round Trip" ? 1 : 0;
    }

    const segment = Array.isArray(segmentParse) ? segmentParse : [segmentParse];
    const providerCode = segment[0]['$']['ProviderCode'];
    const carrier = segment[0]['$']['SupplierCode'];

    const apiairports = location.state && location.state.serviceData.apiairportsdata;
    const serviceresponse = location.state && location.state.serviceData.servicedata;
    const request = location.state?.serviceData || {};

    const fareFamily = packageSelected?.["air:AirPricingInfo"]?.["air:FareInfo"]?.["$"]?.FareFamily;

    const Airports = location.state && location.state.serviceData.Airports;

    const Airlines = location.state && location.state.serviceData.Airlines;
    const hostTokenParse = location.state && location.state.serviceData.hostToken;
    const Passengerarray = location.state && location.state.serviceData.Passengerarray;
    const [passengereventKeys, setPassengerkey] = useState(Passengerarray[0]['Key']);
    const classType = location.state && location.state.serviceData.classtype;
    const access_token = location.state && location.state.serviceData.accesstoken;
    const comHostTokens1 = location.state && location.state.serviceData.comHostTokens1;
    const segmentArray1 = location.state && location.state.serviceData.segmentArray;
    const Passengerxml = location.state && location.state.serviceData.Passengerxml;
    const airPricingCommand = location.state && location.state.serviceData.airPricingCommand;
    const markup_price = location.state && location.state.serviceData.markup_price;
    const flightDetails = location.state && location.state.serviceData.flightDetails;
    const actualFlightDetails = location.state && location.state.serviceData.flightDetails;
    console.log('flightDetails', flightDetails);

    const [accordion1Expanded, setAccordion1Expanded] = useState(true);
    const [accordion5Expanded, setAccordion5Expanded] = useState(false);
    const [flightErrors, setFlighterrors] = useState([]);
    const [accordion2Expanded, setAccordion2Expanded] = useState(false);
    const [accordion3Expanded, setAccordion3Expanded] = useState(false);
    const [accordion4Expanded, setAccordion4Expanded] = useState(false);
    const [passengerDetailsVisible, setPassengerDetailsVisible] = useState(true);
    const [seattravelerparse, setseattravelerparse] = useState(null);
    const [seatOptionalparse, setseatOptionalparse] = useState(null);
    const [segmenttaxivaxisData, setsegmenttaxivaxis] = useState(null);

    const [checkedInBaggage, setCheckedIn] = useState(null);
    const [cabinBaggage, setCabin] = useState(null);
    const [Passengers, setPassengers] = useState(null);
    const [seatrowsParse, setseatrowsparse] = useState(null);
    const [serviceoptionalsOptions, setserviceoptionalsOptions] = useState([]);
    const [serviceSegments, setserviceSegments] = useState([]);
    const [seatresponseparse, setseatresponseparse] = useState(null);
    const [emptyseatmap, setemptyseatmap] = useState(false);
    const [emptaxivaxi, setEmptaxivaxi] = useState([]);
    const [updatepassengerarrays, setupdatepassengerarray] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [clientGst, setClientGST] = useState([]);
    const [clientFormGst, setClientFormGST] = useState([]);
    const [pnr_no, setPnrCode] = useState([]);
    const noOfSeats = formtaxivaxi['no_of_seats'];
    const [value, setValue] = useState('');
    const [isseatloading, setSeatloading] = useState(false);
    const [isreservation, setReservation] = useState(false);
    const [fareRuleText, setFareRuleText] = useState(null);
    const [cancellationPolicy, setCancellationPolicy] = useState(null);

    const providerCodeRef = useRef(null);
    const Targetbranch = 'P4451438';

    const handleChange = (value) => {
        setValue(value);
    };


    const handleCheckIn = (baggage) => {
        setCheckedIn(baggage);
    }

    const handleCabin = (baggage) => {
        setCabin(baggage);
    }

    const mergedData = { ...emptaxivaxi };


    if (Passengers) {
        Object.keys(Passengers.keys).forEach(index => {
            const taxiInfo = emptaxivaxi[index];
            if (taxiInfo) {
                mergedData[index] = { id: taxiInfo.id, keys: Passengers.keys[index] };
            }
        });
    }

    const employees = Array.isArray(formtaxivaxi.passengerDetailsArray)
        ? formtaxivaxi.passengerDetailsArray.map(passenger => passenger.id)
        : Object.keys(formtaxivaxi)
            .filter(key => key.startsWith("passengerDetailsArray") && key.endsWith("[id]"))
            .map(key => formtaxivaxi[key]);

    const hasNonEmptyProperties = (obj) => {
        for (let key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
                return true; // Found a non-empty property
            }
        }
        return false; // No non-empty properties found
    };
    useEffect(() => {
        clearedData();
        fetchGstData();
    }, []);

    useEffect(() => {
        const fetchCancellationPolicy = async () => {
            if (cancellationPolicy) return;

            try {
                const response = await axios.get(`${CONFIG.MAIN_API}/api/flights/getCancellationDateChangePolicy`);
                setCancellationPolicy(response.data.data);
            } catch (error) {
                console.error("Error fetching cancellation policy:", error);
            }
        };

        fetchCancellationPolicy();
    }, [cancellationPolicy]);

    const clearedData = async () => {
        const empIdsArray = Array.isArray(employees) ? employees : [employees]; // Ensure empIdsArray is always an array
        const formData = new URLSearchParams();

        empIdsArray.forEach((id, index) => {
            formData.append(`employee_id[${index}]`, id);
        });

        try {
            const response = await fetch(`${CONFIG.MAIN_API}/api/flights/employeeByTaxivaxi`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            const data = responseData.result;

            const organizedData = {};

            // Organize the response data
            data.forEach((emp, index) => {
                organizedData[index] = emp;
            });
            setEmptaxivaxi(organizedData);
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    const fetchGstData = async () => {
        const formData = new URLSearchParams();
        formData.append(`clientid`, clientid);

        try {
            if (is_gst_benefit == '1') {
                const response = await fetch(`${CONFIG.MAIN_API}/api/flights/getClientGst`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData.toString(),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const responseData = await response.json();
                const data = responseData.result;

                const gstData = {
                    gst_id: data.gst_id || '',
                    billing_name: data.billing_name || '',
                    billing_address: data.billing_address_line1 || '',
                    billing_contact: data.billing_contact || ''
                };

                setClientGST(gstData);
            }
            else {
                const gst_id = '07AAGCB3556P1Z7';
                const billing_name = 'BAI INFOSOLUTIONS PRIVATE LIMITED';
                const billing_address = '1 1075 1 2 GF 4/Mehrauli/New Delhi/110030';
                const billing_contact = '9881102875';

                const gstData = {
                    gst_id,
                    billing_name,
                    billing_address,
                    billing_contact
                }
                setClientGST(gstData);
            }
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    // console.log('emptaxivaxi', emptaxivaxi);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const [maxDate, setMaxDate] = useState('');
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    const [gstRegistrationNo, setGstRegistrationNo] = useState('');

    const handleGstKeyPress = (e) => {
        const inputValue = e.target.value;
        const keyPressed = e.key;

        if (keyPressed.match(/[a-zA-Z0-9]/) && inputValue.length < 15) {
            setGstRegistrationNo(inputValue);
        } else {
            e.preventDefault();
        }
    };

    useEffect(() => {
        const today = new Date();
        const formattedToday = today.toISOString().split('T')[0];
        setMaxDate(formattedToday);
    }, []);

    const handleseatbuttonskip = () => {
        setAccordion3Expanded(false);

    }
    const handlebaggagebuttonskip = () => {
        setAccordion4Expanded(false);

    }

    const handleNavItemClick = (index) => {
        setActiveTab(index);
    };

    const formatDateTime = (fullDateTime) => {
        const year = fullDateTime.getFullYear();
        const month = String(fullDateTime.getMonth() + 1).padStart(2, '0');
        const day = String(fullDateTime.getDate()).padStart(2, '0');

        // Format as 'yy-mm-dd'
        return `${year}-${month}-${day}`;
    };

    const handleEffectiveDateWithTime = (departureDate, pricingInfo, segmentParsee) => {
        const fareInfoKey = pricingInfo['air:FareInfo']['$']['key'];
        const bookingInfo = pricingInfo['air:BookingInfo'];

        let departureTime = 'N/A';

        // Handle both object and array cases for BookingInfo
        const bookingArray = Array.isArray(bookingInfo) ? bookingInfo : [bookingInfo];

        // Find the matching segment reference
        const matchingSegment = bookingArray.find(
            info => info['$']['SegmentRef'] === fareInfoKey
        );

        if (matchingSegment) {
            const segmentKey = matchingSegment['$']['SegmentRef'];
            const matchingSegmentDetails = segmentParsee.find(
                segment => segment['$']['Key'] === segmentKey
            );

            if (matchingSegmentDetails) {
                departureTime = matchingSegmentDetails['$']['DepartureTime'] || 'N/A';
            }
        }

        // Format date and time
        const date = new Date(departureDate);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });

        return `${formattedDate} | ${departureTime}`;
    };


    const formRef = useRef(null);
    useEffect(() => {
        parseString(serviceresponse, { explicitArray: false }, (err, serviceresult) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return;
            }
            const serviceRsp = serviceresult['SOAP:Envelope']['SOAP:Body']['air:AirMerchandisingOfferAvailabilityRsp'];
            // console.log('serviceRsp',serviceRsp);

            if (serviceRsp !== null && serviceRsp !== undefined) {
                if (serviceresult['SOAP:Envelope']['SOAP:Body']['air:AirMerchandisingOfferAvailabilityRsp']['air:OptionalServices']) {
                    const serviceoptionalss = serviceresult['SOAP:Envelope']['SOAP:Body']['air:AirMerchandisingOfferAvailabilityRsp']['air:OptionalServices']['air:OptionalService'];
                    const serviceSegmentlists = serviceresult['SOAP:Envelope']['SOAP:Body']['air:AirMerchandisingOfferAvailabilityRsp']['air:AirSolution']['air:AirSegment'];
                    setserviceoptionalsOptions(Array.isArray(serviceoptionalss) ? serviceoptionalss : [serviceoptionalss]);
                    setserviceSegments(Array.isArray(serviceSegmentlists) ? serviceSegmentlists : [serviceSegmentlists]);
                }
            } else {
                const error = serviceresult['SOAP:Envelope']['SOAP:Body']['SOAP:Fault']['faultstring'];
                // ErrorLogger.logError('service_api','Error',error);
                setFlighterrors(error);
            }
        });
    }, []);

    const [buttonTexts, setButtonTexts] = useState({});

    const serviceoptions = [];

    Object.entries(buttonTexts).forEach(([index, innerObject]) => {
        const segmentIndex = parseInt(index);
        Object.entries(innerObject).forEach(([key, value]) => {
            const optionIndex = parseInt(key);
            segmentParse.forEach((segmentInfo, segmentInfoIndex) => {
                if (segmentInfoIndex === segmentIndex) {
                    for (let i = 0; i < value; i++) {
                        serviceoptionalsOptions.forEach((optionInfo, optionInfoIndex) => {
                            if (optionInfoIndex === optionIndex) {
                                for (let i = 0; i < value; i++) {
                                    serviceoptions.push({ segmentInfo, optionInfo });
                                }
                            }
                        });
                    }
                }
            });
        });
    });

    const extractedData = serviceoptions.map(option => ({
        TotalPrice: option.optionInfo.$.TotalPrice,
        Description: option.optionInfo.$.TotalWeight,
        SegmentKey: option.segmentInfo.$?.Key
    }));


    const handle1Click = (index, serviceindex) => {
        setButtonTexts(prevState => ({
            ...prevState,
            [serviceindex]: {
                ...prevState[serviceindex],
                [index]: (prevState[serviceindex]?.[index] || 0) + 1,
            }
        }));
    };

    const handle0Click = (index, serviceindex) => {
        setButtonTexts(prevState => ({
            ...prevState,
            [serviceindex]: {
                ...prevState[serviceindex],
                [index]: Math.max((prevState[serviceindex]?.[index] || 0) - 1, 0),
            }
        }));
    };
    const handleOptional = (optionalkey) => {
        let totalPrice = null;
        if (seatOptionalparse) {
            seatOptionalparse.map((optionalinfo, optionalindex) => {
                if (optionalinfo['$']['Key'] === optionalkey) {
                    totalPrice = optionalinfo['$']['TotalPrice'];
                }
            });
        }
        if (totalPrice && totalPrice.includes('INR')) {
            totalPrice = totalPrice.replace('INR', '₹ ');
        }
        return totalPrice;
    };
    const handleOptionalprice = (optionalkey) => {
        let totalPrice = null;
        if (seatOptionalparse) {
            seatOptionalparse.map((optionalinfo, optionalindex) => {
                if (optionalinfo['$']['Key'] === optionalkey) {
                    totalPrice = optionalinfo['$']['TotalPrice'];
                }
            });
        }
        if (totalPrice && totalPrice.includes('INR')) {
            totalPrice = totalPrice.replace('INR', '');
            if (totalPrice > 300) {
                return "more300";
            } else {
                return "less300";
            }
        } else {
            if (totalPrice > 300) {
                return "more300";
            } else {
                return "less300";
            }
        }
        return totalPrice;
    };
    const handleBackButtonClick = () => {

        function formatfinalDate(dateString) {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
        const searchdeparture = formatfinalDate(request.searchfinaldeparture);
        let searchreturnDate = null;
        if (request.searchfinalreturn !== null) {
            searchreturnDate = formatfinalDate(request.searchfinalreturn);
        }

        const responseData = {
            responsedata: request.FinalResponse,
            searchfromcity: request.finalorigin,
            searchtocity: request.finaldestination,
            searchdeparture: searchdeparture,
            searchreturnDate: searchreturnDate,
            airlinedata: request.finalairlines,
            airportData: request.finalairports,
            selectadult: request.adult,
            selectchild: request.child,
            selectinfant: request.infant,
            selectclass: request.classtype,
            bookingtype: request.bookingtype
        };
        navigate('/SearchFlight', { state: { responseData } });
    };
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
        const airport = Airports.find((airportInfo) => {
            return airportInfo['$'] && airportInfo['$']['Code'] === airportcode;
        });
        if (airport) {
            return airport['$']['Name'];
        } else {
            return "Airport";
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

    const handleEffectiveDate = (date) => {

        const arrivalTime = new Date(date);
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const weekday = weekdays[arrivalTime.getDay()];
        const day = arrivalTime.getDate();
        const month = months[arrivalTime.getMonth()];
        const year = arrivalTime.getFullYear();
        const formattedDateString = `${weekday}, ${day} ${month} ${year}`;

        return formattedDateString;
    }

    const handleEffectiveDate1 = (date) => {
        // console.log("date", date);

        const arrivalTime = new Date(date);
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const weekday = weekdays[arrivalTime.getDay()];
        const day = arrivalTime.getDate();
        const month = months[arrivalTime.getMonth()];
        const year = arrivalTime.getFullYear();
        const formattedDateString = `${weekday}, ${day} ${month} ${year}`;
        // console.log("formattedDateString", formattedDateString);

        return formattedDateString;
    }
    const handleAfterEffectiveDate = (dateString) => {
        const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
        const dateObj = new Date(dateString);
        return dateObj.toLocaleDateString('en-US', options);
    };
    const handlePassengerDetails = () => {
        setPassengerDetailsVisible(!passengerDetailsVisible);
    };

    const isAlphabetic = (event) => {
        var charCode = event.charCode;
        return (
            (charCode >= 65 && charCode <= 90) || // A-Z
            (charCode >= 97 && charCode <= 122) || // a-z
            charCode === 32 // Space
        );
    };
    function handleKeyPress(event) {
        if (!isAlphabetic(event)) {
            event.preventDefault();
        }
    }
    const isNumber = (event) => {
        var charCode = event.charCode;
        return (
            charCode >= 48 && charCode <= 57
        );
    };
    function handleNumberPress(event) {
        if (!isNumber(event)) {
            event.preventDefault();
        }
    }
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
    const arraysAreEqual = (arr1, arr2) => {
        if (arr1.length !== arr2.length) {
            return false;
        }

        for (let i = 0; i < arr1.length; i++) {
            const obj1 = arr1[i];
            const obj2 = arr2[i];

            for (const key in obj1) {
                if (obj1.hasOwnProperty(key)) {
                    if (obj1[key] !== obj2[key]) {
                        return false;
                    }
                }
            }
        }

        return true;
    };

    const fetchPriceData = async () => {
        // try {
        // setSegmentParse();
        // console.log('segmentParse', segmentParse);
        console.log('fetchprice');
        const tempCodes = [];
        const optionalServicesXML = {
            "air:OptionalServices": {
                "air:OptionalService": seatOptionalparse
                    .filter(service => previousSelections.some(selection => selection.optionalkey === service["$"].Key))
                    .map(service => {
                        const matchedSelection = previousSelections.find(selection => selection.optionalkey === service["$"].Key);
                        delete service["air:BrandingInfo"]; // Remove air:BrandingInfo
                        // if (matchedSelection?.code) {
                        //     setSelectedCodes(prevCodes => [...prevCodes, matchedSelection.code]); 
                        // }
                        if (matchedSelection?.code) {
                            tempCodes.push(matchedSelection.code); // Collect seat codes
                        }

                        return {
                            "$": service["$"], // Retain existing attributes
                            "com:ServiceData": {
                                "$": {
                                    "BookingTravelerRef": service["common_v52_0:ServiceData"]["$"].BookingTravelerRef,
                                    "AirSegmentRef": service["common_v52_0:ServiceData"]["$"].AirSegmentRef,
                                    "Data": matchedSelection.code // Add Data="1-F"
                                }
                            },
                            "com:ServiceInfo": {
                                "com:Description": service["common_v52_0:ServiceInfo"]["common_v52_0:Description"] // Change common_v52_0 to com
                            }
                        };
                    })
            }
        };
        const builder = require('xml2js').Builder;
        var pricepointXMLpc = new builder().buildObject({
            'soap:Envelope': {
                '$': {
                    'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/'
                },
                'soap:Body': {
                    'air:AirPriceReq': {
                        '$': {
                            'AuthorizedBy': 'TAXIVAXI',
                            'TargetBranch': Targetbranch,
                            'FareRuleType': 'short',
                            'TraceId': 'TVSBP001',
                            'xmlns:air': 'http://www.travelport.com/schema/air_v52_0',
                            'xmlns:com': 'http://www.travelport.com/schema/common_v52_0'
                        },
                        'BillingPointOfSaleInfo': {
                            '$': {
                                'OriginApplication': 'UAPI',
                                'xmlns': 'http://www.travelport.com/schema/common_v52_0'
                            },
                        },
                        'air:AirItinerary': {
                            'air:AirSegment': segmentParsee,
                            'com:HostToken': comHostTokens1,
                        },
                        'air:AirPricingModifiers': {
                            '$': {
                                'InventoryRequestType': 'DirectAccess',
                                'ETicketability': 'Yes',
                                'FaresIndicator': "AllFares"
                            },
                            'air:PermittedCabins': {
                                'com:CabinClass': {
                                    '$': {
                                        'Type': classType,
                                    },
                                },
                            },
                            'air:BrandModifiers': {
                                'air:FareFamilyDisplay': {
                                    '$': {
                                        'ModifierType': 'FareFamily',
                                    },
                                },
                            },
                        },
                        'com:SearchPassenger': Passengerxml,
                        'air:AirPricingCommand': airPricingCommand,
                        ...optionalServicesXML,
                        'com:FormOfPayment': {
                            '$': {
                                'Type': "Credit"
                            },
                            'com:CreditCard': {
                                '$': {
                                    'BankCountryCode': "IN",
                                    'CVV': "737",
                                    'ExpDate': "2026-11",
                                    'Name': "Pavan Patil",
                                    'Number': "4111111111111111",
                                    'Type': "VI",
                                },
                                'com:BillingAddress': {
                                    'com:AddressName': "Home",
                                    'com:Street': "A-304 Relicon Felicia,Pashan,Pune",
                                    'com:City': "Pune",
                                    'com:State': "Maharashtra",
                                    'com:PostalCode': "411011",
                                    'com:Country': "IN",
                                }
                            },
                        },

                        // 'com:FormOfPayment': {
                        //     '$': {
                        //         'Type': 'AgencyPayment'
                        //     },
                        //     'com:AgencyPayment': {
                        //         '$': {
                        //             'AgencyBillingIdentifier': 'KTDEL283',
                        //             'AgencyBillingPassword': 'Baiinfo@2024'
                        //         }
                        //     }
                        // },
                    }
                }
            }
        });
        console.log('pricepointXMLpc', pricepointXMLpc);
        const response = await axios.post(
            `${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightAirServiceRequest`,
            pricepointXMLpc
        );
        console.log('response for data', response.data)
        // return response.data;

        parseString(response.data, { explicitArray: false }, (err, priceresult) => {
            if (err) {
                console.error("Error parsing XML:", err);
                return;
            }

            const AirPriceRsp = priceresult["SOAP:Envelope"]["SOAP:Body"]["air:AirPriceRsp"];

            segmentParseRef.current = AirPriceRsp["air:AirItinerary"]["air:AirSegment"];
            packageSelectedRef.current = AirPriceRsp["air:AirPriceResult"]["air:AirPricingSolution"];

        })


        const segmentParse = segmentParseRef.current;
        const packageSelected = packageSelectedRef.current;
        console.log('packageSelected in fetchprice', packageSelected);
        console.log('segmentParse in fetchprice', segmentParse);




        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear().toString().slice(-2);
            return `${day}${month}${year}`;
        };

        const segments = Array.isArray(segmentParse) ? segmentParse : [segmentParse];

        for (const segment of segments) {
            if (segment['$'] && segment['$']['Key']) {
                if (segment['$']['HostTokenRef']) {
                    delete segment['$']['HostTokenRef'];
                }
                if (Array.isArray(packageSelected['air:AirSegmentRef'])) {
                    packageSelected['air:AirSegmentRef'] = segments;
                } else {
                    if (packageSelected['air:AirSegmentRef']['$']['Key'] === segment['$']['Key']) {
                        packageSelected['air:AirSegmentRef'] = segment;
                    }
                }
            }
        }
        const formseat = [];
        let tax_k3 = 0;
        if (Array.isArray(packageSelected['air:AirPricingInfo'])) {
            packageSelected['air:AirPricingInfo'].forEach(reservationpricinginfo => {
                if (Array.isArray(reservationpricinginfo['air:TaxInfo'])) {
                    reservationpricinginfo['air:TaxInfo'].forEach(taxreservationpricinginfo => {
                        if (taxreservationpricinginfo.$.CarrierDefinedCategory.includes("GST")) {
                            let amount = parseFloat(taxreservationpricinginfo.$.Amount.replace("INR", "").trim());
                            tax_k3 += Math.floor(amount);
                            tax_k3 = tax_k3 * noOfSeats;
                        }
                    });
                } else {
                    if (reservationpricinginfo['air:TaxInfo'].$.CarrierDefinedCategory.includes("GST")) {
                        let amount = parseFloat(reservationpricinginfo['air:TaxInfo'].$.Amount.replace("INR", "").trim());
                        tax_k3 += Math.floor(amount);
                        tax_k3 = tax_k3 * noOfSeats;
                    }
                }
            });
        } else {
            if (Array.isArray(packageSelected['air:AirPricingInfo']['air:TaxInfo'])) {
                packageSelected['air:AirPricingInfo']['air:TaxInfo'].forEach(taxreservationpricinginfo => {
                    if (taxreservationpricinginfo.$.CarrierDefinedCategory.includes("GST")) {
                        let amount = parseFloat(taxreservationpricinginfo.$.Amount.replace("INR", "").trim());
                        tax_k3 += Math.floor(amount);
                        tax_k3 = tax_k3 * noOfSeats;
                    }
                });
            } else {
                if (packageSelected['air:AirPricingInfo']['air:TaxInfo'].$.CarrierDefinedCategory.includes("GST")) {
                    let amount = parseFloat(packageSelected['air:AirPricingInfo']['air:TaxInfo'].$.Amount.replace("INR", "").trim());
                    tax_k3 += Math.floor(amount);
                    tax_k3 = tax_k3 * noOfSeats;
                }
            }
        }

        let total_price = 0;
        let base_price = 0;
        let total_tax = 0;
        let fare_type = '';
        let discount = 0;


        if (packageSelected['air:AirPricingInfo']) {
            if (packageSelected['air:AirPricingInfo']['$']['TotalPrice']) {
                total_price = Math.floor(parseFloat(packageSelected['air:AirPricingInfo']['$']['TotalPrice'].replace("INR", "").trim()));
                total_price = total_price * noOfSeats;
            }
            if (packageSelected['air:AirPricingInfo']['$']['Taxes']) {
                total_tax = Math.floor(parseFloat(packageSelected['air:AirPricingInfo']['$']['Taxes'].replace("INR", "").trim()));
                total_tax = total_tax * noOfSeats;
            }
            if (packageSelected["air:AirPricingInfo"]["$"]["BasePrice"]) {
                base_price = Math.floor(parseFloat(packageSelected["air:AirPricingInfo"]["$"]["BasePrice"].replace("INR", "").trim()));
                base_price = base_price * noOfSeats;
                console.log("base_price c", base_price);
            }
            if (packageSelected['air:AirPricingInfo']['$']['Refundable']) {
                fare_type = packageSelected['air:AirPricingInfo']['$']['Refundable'] == 'true' ? 'Refundable' : 'Non Refundable';
            }
            const feeInfo = packageSelected?.["air:AirPricingInfo"]?.['air:FeeInfo'];

            if (feeInfo?.["$"]?.["Text"] === 'PromotionDiscount') {
                const feesRaw = feeInfo?.["$"]?.["Amount"];
                if (feesRaw) {
                    const feeAmount = parseFloat(feesRaw.replace("INR", "").trim());
                    discount = Math.floor(Math.abs(feeAmount)) * parseFloat(noOfSeats || 1);
                }
            }
console.log("discount",discount);

        }
        let assignTax = 0; // Initialize assignTax

        if (Array.isArray(packageSelected['air:AirPricingInfo'])) {
            packageSelected['air:AirPricingInfo'].forEach(reservationpricinginfo => {
                let taxInfoArray = reservationpricinginfo['air:TaxInfo'];

                // Handle cases where 'air:TaxInfo' is not an array
                if (!Array.isArray(taxInfoArray)) {
                    taxInfoArray = taxInfoArray ? [taxInfoArray] : [];
                }

                taxInfoArray.forEach(taxreservationpricinginfo => {
                    const category = taxreservationpricinginfo?.$?.CarrierDefinedCategory;

                    if (category && ["RCF", "TTF", "PHF"].includes(category.trim())) {
                        let amount = parseFloat(taxreservationpricinginfo.$.Amount.replace("INR", "").trim());
                        amount = amount * noOfSeats;
                        assignTax += Math.floor(amount);
                    }
                });
            });
        } else if (Array.isArray(packageSelected['air:AirPricingInfo']['air:TaxInfo'])) {
            packageSelected['air:AirPricingInfo']['air:TaxInfo'].forEach(taxreservationpricinginfo => {
                const category = taxreservationpricinginfo?.$?.CarrierDefinedCategory;

                if (category && ["RCF", "TTF", "PHF"].includes(category.trim())) {
                    let amount = parseFloat(taxreservationpricinginfo.$.Amount.replace("INR", "").trim());
                    amount = amount * noOfSeats;
                    assignTax += Math.floor(amount);
                }
            });
        } else if (packageSelected['air:AirPricingInfo']['air:TaxInfo']?.$?.CarrierDefinedCategory) {
            const category = packageSelected['air:AirPricingInfo']['air:TaxInfo'].$.CarrierDefinedCategory;

            if (category && ["RCF", "TTF", "PHF"].includes(category.trim())) {
                let amount = parseFloat(packageSelected['air:AirPricingInfo']['air:TaxInfo'].$.Amount.replace("INR", "").trim());
                amount = amount * noOfSeats;
                assignTax += Math.floor(amount);
            }
        }
        console.log('base_price', base_price);
        console.log('assignTax', assignTax);
        previousSelections.forEach(seatselect => {
            const segmentseat = seatselect.segment;
            let seat_price = '0';
            if (seatselect['optionalkey'] !== 'free') {
                seatOptionalparse.forEach(seatOptionalparseinfo => {
                    if (seatselect.optionalkey === seatOptionalparseinfo['$']['Key']) {
                        seat_price = seatOptionalparseinfo['$']['TotalPrice'];
                    }

                });
            }

            const segmentArray = Array.isArray(segmentParse) ? segmentParse : [segmentParse];

            segmentArray.forEach(segment => {
                if (segmentseat === segment['$']['Key']) {
                    let segmentseatData = {
                        'seat_no': seatselect.code,
                        'seat-price': seat_price,
                        'passenger': seatselect.passenger,
                        'segment_key': segment['$'].Key,
                    };
                    formseat.push(segmentseatData);
                }
            });

        });
        let stopCounts = 0;
        let returnstopCounts = 0;
        const segmentss = Array.isArray(segmentParse) ? segmentParse : [segmentParse];

        segmentss.forEach(segment => {
            const groupNumber = parseInt(segment['$']['Group']);
            if (groupNumber === 0) {
                stopCounts++;
            }
            if (groupNumber === 1) {
                returnstopCounts++;
            }
        });

        const segmenttaxivaxis = [];
        segmentss.forEach(segment => {
            let segmenttaxivaxi = {
                'Key': segment['$'].Key,
                'FlightNumber': segment['$'].FlightNumber,
                'Carrier': segment['$'].Carrier,
                'Origin': segment['$'].Origin,
                'Destination': segment['$'].Destination,
                'DepartureTime': segment['$'].DepartureTime,
                'ArrivalTime': segment['$'].ArrivalTime,
                'Group': segment['$'].Group,
            };
            segmenttaxivaxis.push(segmenttaxivaxi);
        });
        setsegmenttaxivaxis(segmenttaxivaxis);
        if (stopCounts > 0) {
            stopCounts = stopCounts - 1;
        }
        if (returnstopCounts > 0) {
            returnstopCounts = returnstopCounts - 1;
        }
        function generateUniqueKey() {
            const characters = '0123456789ABCDEF';
            let key = '';

            for (let i = 0; i < 6; i++) {
                const index = Math.floor(Math.random() * characters.length);
                key += characters[index];
            }
            return key;
        }
        const passengersreservation = Passengers.keys.map((key, index) => {
            const bookingTraveler = {
                '$': {
                    'Age': calculateAge(Passengers.ageNames[index]),
                    'Gender': Passengers.genderNames[index],
                    'Key': key,
                    'TravelerType': Passengers.codes[index]
                },
                'com:BookingTravelerName': {
                    '$': {
                        'First': Passengers.firstNames[index],
                        'Last': Passengers.lastNames[index],
                        'Prefix': Passengers.genderNames[index] === 'F' ? 'Miss' : 'Mr'
                    }
                },
                'com:PhoneNumber': {
                    '$': {
                        'Number': Passengers.contactNo,
                        'Type': "Mobile"
                    }
                },
                'com:Email': {
                    '$': {
                        'EmailID': Passengers.email,
                    }
                },
                'com:SSR': [
                    {
                        '$': {
                            'Carrier': carrier,
                            'FreeText': "/IND/" + clientFormGst.GSTIN + "/" + clientFormGst.company_gst_name,
                            'Key': generateUniqueKey(),
                            'Status': "HK",
                            'Type': "GSTN"
                        }
                    },
                    {
                        '$': {
                            'Carrier': carrier,
                            'FreeText': "/IND/demo//taxivaxi.com",
                            'Key': generateUniqueKey(),
                            'Status': "HK",
                            'Type': "GSTE"
                        }
                    },
                    {
                        '$': {
                            'Carrier': carrier,
                            'FreeText': "/IND/" + clientFormGst.company_gst_contact,
                            'Key': generateUniqueKey(),
                            'Status': "HK",
                            'Type': "GSTP"
                        }
                    },
                    {
                        '$': {
                            'Carrier': carrier,
                            'FreeText': "/IND/" + clientFormGst.company_gst_address,
                            'Key': generateUniqueKey(),
                            'Status': "HK",
                            'Type': "GSTA"
                        }
                    }
                ],
                ...(Passengers.codes[index] === 'CNN' || Passengers.codes[index] === 'INF' ? {
                    'com:NameRemark': {
                        'com:RemarkData': Passengers.codes[index] === 'CNN' ? `PC-${calculateAge(Passengers.ageNames[index])} ${formatDate(Passengers.ageNames[index])}` : formatDate(Passengers.ageNames[index])
                    }
                } : {}),
                'com:Address': {
                    'com:AddressName': Passengers.address,
                    'com:Street': Passengers.street,
                    'com:City': Passengers.city,
                    'com:State': Passengers.state,
                    'com:PostalCode': Passengers.postalCode,
                    'com:Country': Passengers.country,
                }
            };

            return bookingTraveler;
        });

        let passengerTypeIndex = 0;

        if (Array.isArray(packageSelected['air:AirPricingInfo'])) {
            packageSelected['air:AirPricingInfo'].forEach(reservationpricinginfo => {
                if (Array.isArray(reservationpricinginfo['air:PassengerType'])) {
                    reservationpricinginfo['air:PassengerType'].forEach(passengerType => {
                        passengerType['$']['BookingTravelerRef'] = Passengers.keys[passengerTypeIndex];
                        passengerTypeIndex++;
                    });
                } else {
                    reservationpricinginfo['air:PassengerType']['$']['BookingTravelerRef'] = Passengers.keys[passengerTypeIndex];
                    passengerTypeIndex++;
                }
            });
        } else {
            if (Array.isArray(packageSelected['air:AirPricingInfo']['air:PassengerType'])) {
                packageSelected['air:AirPricingInfo']['air:PassengerType'].forEach(passengerType => {
                    passengerType['$']['BookingTravelerRef'] = Passengers.keys[passengerTypeIndex];
                    passengerTypeIndex++;
                });
            } else {
                packageSelected['air:AirPricingInfo']['air:PassengerType']['$']['BookingTravelerRef'] = Passengers.keys[passengerTypeIndex];
            }
        }
        if (packageSelected['air:OptionalServices']) {
            delete packageSelected['air:OptionalServices']['air:OptionalService'];
            delete packageSelected['air:OptionalServices']['air:OptionalServiceRules'];

        }
        const specificSeatAssignments = [];
        if (previousSelections.length !== 0) {
            previousSelections.forEach(seatSelection => {
                if (seatSelection.optionalkey === "free") {
                    const SeatId = seatSelection.code;
                    const BookingTravelerRef = seatSelection.passenger;
                    const SegmentRef = seatSelection.segment;
                    const specificSeatAssignment = {
                        '$': {
                            'SeatId': SeatId,
                            'BookingTravelerRef': BookingTravelerRef,
                            'SegmentRef': SegmentRef
                        }
                    };
                    specificSeatAssignments.push(specificSeatAssignment);
                }
            });
        }

        var xml2js = require('xml2js');
        var reservationRequestEnvelope = {
            'soapenv:Envelope': {
                '$': {
                    'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/'
                },
                'soapenv:Body': {
                    'univ:AirCreateReservationReq': {
                        '$': {
                            'AuthorizedBy': 'TAXIVAXI',
                            'RetainReservation': 'Both',
                            'TargetBranch': Targetbranch,
                            'TraceId': 'ac191f0b9c0546659065f29389eae552',
                            'RestrictWaitlist': 'true',
                            'xmlns:univ': 'http://www.travelport.com/schema/universal_v52_0',
                            'xmlns:air': 'http://www.travelport.com/schema/air_v52_0',
                            'xmlns:com': 'http://www.travelport.com/schema/common_v52_0',
                            'xmlns:common_v52_0': 'http://www.travelport.com/schema/common_v52_0'
                        },
                        'com:BillingPointOfSaleInfo': {
                            '$': {
                                'OriginApplication': 'UAPI',
                            },
                        },
                        'com:BookingTraveler': passengersreservation,
                        'com:OSI': {
                            '$': {
                                'Carrier': carrier,
                                'Key': "1",
                                'Text': "INDA 6576899966 PAX",
                                'ProviderCode': providerCode,
                                'xmlns:com': "http://www.travelport.com/schema/common_v52_0"
                            }
                        },
                        'com:ContinuityCheckOverride': true,
                        'com:AgencyContactInfo': {
                            'com:PhoneNumber': {
                                '$': {
                                    'CountryCode': "91",
                                    'AreaCode': "011",
                                    'Number': "9881102875",
                                    'Location': "DEL",
                                    'Type': "Agency"
                                }
                            }
                        },
                        'com:EmailNotification': {
                            '$': {
                                'Recipients': "All"
                            }
                        },

                        // 'com:FormOfPayment': {
                        //     '$': {
                        //         'Type': 'AgencyPayment'
                        //     },
                        //     'com:AgencyPayment': {
                        //         '$': {
                        //             'AgencyBillingIdentifier': 'KTDEL283',
                        //             'AgencyBillingPassword': 'Baiinfo@2024'
                        //         }
                        //     }
                        // },

                        'com:FormOfPayment': {
                            '$': {
                                'Type': "Credit"
                            },
                            'com:CreditCard': {
                                '$': {
                                    'BankCountryCode': "IN",
                                    'CVV': "737",
                                    'ExpDate': "2026-11",
                                    'Name': "Pavan Patil",
                                    'Number': "4111111111111111",
                                    'Type': "VI",
                                },
                                'com:BillingAddress': {
                                    'com:AddressName': "Home",
                                    'com:Street': "A-304 Relicon Felicia,Pashan,Pune",
                                    'com:City': "Pune",
                                    'com:State': "Maharashtra",
                                    'com:PostalCode': "411011",
                                    'com:Country': "IN",
                                }
                            },
                        },
                        'air:AirPricingSolution': packageSelected,
                        'com:ActionStatus': {
                            '$': {
                                'ProviderCode': providerCode,
                                'TicketDate': "T*",
                                'Type': "ACTIVE"
                            }
                        }
                    }
                }
            }
        };
        if (specificSeatAssignments.length > 0) {
            // specificSeatAssignments.forEach(specificSeatAssignment => {
            reservationRequestEnvelope['soapenv:Envelope']['soapenv:Body']['univ:AirCreateReservationReq']['air:SpecificSeatAssignment'] = specificSeatAssignments;
            // });
        }
        var xmlBuilder = new xml2js.Builder();
        var reservationRequestXML = xmlBuilder.buildObject(reservationRequestEnvelope);


        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(reservationRequestXML, 'text/xml');
        var allElements = xmlDoc.getElementsByTagName('*');
        for (let i = 0; i < allElements.length; i++) {
            var element = allElements[i];
            if (element.tagName === 'air:AirSegmentRef') {
                var newElement = xmlDoc.createElement('air:AirSegment');

                // Copy all attributes from the original element
                for (let j = 0; j < element.attributes.length; j++) {
                    var attr = element.attributes[j];
                    newElement.setAttribute(attr.nodeName, attr.nodeValue);
                }

                let segmentKey = newElement.getAttribute("Key");
                let providerCode = newElement.getAttribute("ProviderCode"); // Get ProviderCode from newElement
                providerCodeRef.current = providerCode;

                let bookingInfoArray = packageSelected['air:AirPricingInfo']['air:BookingInfo'];

                if (!Array.isArray(bookingInfoArray)) {
                    bookingInfoArray = [bookingInfoArray];
                }

                let matchingBookingInfo = bookingInfoArray.find(info => info["$"]["SegmentRef"] === segmentKey);

                if (matchingBookingInfo && providerCode === "ACH") {
                    // Add HostTokenRef only if ProviderCode is "ACH"
                    let hostTokenRef = matchingBookingInfo["$"]["HostTokenRef"];
                    newElement.setAttribute("HostTokenRef", hostTokenRef);
                }


                for (let j = 0; j < element.childNodes.length; j++) {
                    var childNode = element.childNodes[j].cloneNode(true);
                    newElement.appendChild(childNode);
                }

                element.parentNode.replaceChild(newElement, element);
            }
        }

        const providerCodeValue = providerCode;
        // console.log('providerCodeValue', providerCodeValue);

        var modifiedXmlString = new XMLSerializer().serializeToString(xmlDoc);
        console.log('modifiedXmlString ACH', modifiedXmlString);


        const reservationresponse = await axios.post(`${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightAirServiceRequest`, modifiedXmlString);
        const reservationResponse = reservationresponse.data;
 
        console.log('reservationResponse', reservationResponse);
        let matchesDataInfo;
        console.log("re packageSelected", packageSelected);
        const fareInfoList = Array.isArray(packageSelected['air:AirPricingInfo']['air:FareInfo']) ? packageSelected['air:AirPricingInfo']['air:FareInfo'][0] : packageSelected['air:AirPricingInfo']['air:FareInfo'];

        fareInfoList['air:Brand']['air:Text'].map((textinfor, textindex) => {
            if (
                textinfor['$'] &&
                textinfor['$']['Type'] === "MarketingConsumer"
            ) {
                const infoText = textinfor['_'];
                const matches = infoText.match(/\b\d+\s?(kgs?|kg)\b/gi);

                if (matches) {
                    matchesDataInfo = matches
                }
            }
        })

        parseString(reservationResponse, { explicitArray: false }, async (err, reservationresult) => {
            if (err) {
                console.error('Error parsing XML:', err);
                return;
            }
            const soapFault = reservationresult?.['SOAP:Envelope']?.['SOAP:Body']?.['SOAP:Fault'];
            if (soapFault) {
                navigate('/tryagainlater');
                return;

            }
            const pnrCode = reservationresult['SOAP:Envelope']['SOAP:Body']['universal:AirCreateReservationRsp']['universal:UniversalRecord']['air:AirReservation']['$']['LocatorCode']; //carrierlocator
            const flightpnrCode = reservationresult['SOAP:Envelope']['SOAP:Body']['universal:AirCreateReservationRsp']['universal:UniversalRecord']['air:AirReservation']['common_v52_0:SupplierLocator']['$']['SupplierLocatorCode'];
            const mainlocatorCode = reservationresult['SOAP:Envelope']['SOAP:Body']['universal:AirCreateReservationRsp']['universal:UniversalRecord']['$']['LocatorCode']; //universal

            var UniversalRecordRequest = {
                "soap:Envelope": {
                    '$': {
                        "@xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/",
                    },
                    "soap:Body": {
                        "univ:UniversalRecordRetrieveReq": {
                            '$': {
                                "@TargetBranch": Targetbranch,
                                "@TraceId": "TVSBP001",
                                "@AuthorizedBy": "TAXIVAXI",
                                "@RetrieveProviderReservationDetails": "true",
                                "@xmlns:univ": "http://www.travelport.com/schema/universal_v52_0",
                                "@xmlns:com": "http://www.travelport.com/schema/common_v52_0",
                            },
                            "com:BillingPointOfSaleInfo": {
                                '$': {
                                    "@OriginApplication": "UAPI"
                                }
                            },
                            "univ:ProviderReservationInfo": {
                                '$': {
                                    "@ProviderCode": "ACH",
                                    "@ProviderLocatorCode": flightpnrCode
                                }
                            }
                        }
                    }
                }
            }
            // const UniversalRecordResponse = await axios.post('${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightUniversalRecordService')


            const flightDetails = {};

            const formattedsegmenttaxivaxis = Array.isArray(segmenttaxivaxis) ? segmenttaxivaxis : [segmenttaxivaxis]
            console.log("formattedsegmenttaxivaxis", formattedsegmenttaxivaxis);
            if (Array.isArray(formattedsegmenttaxivaxis)) {
                formattedsegmenttaxivaxis.forEach((segment, index) => {
                    console.log("segment.DepartureDate", segment.DepartureDate);
                    console.log("segment.ArrivalDate", segment.ArrivalDate);
                    console.log("segment.DepartureTime", segment.DepartureTime);
                    console.log("segment.ArrivalTime", segment.ArrivalTime);
                    const departureDate = new Date(segment.DepartureTime);
                    const arrivalDate = new Date(segment.ArrivalTime);

                    const formattedDate = formatDateTime(departureDate);
                    const formattedDeparture = new Date(segment.DepartureTime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: false,
                    });
                    const concatDeptDateTime = formattedDate + " " + formattedDeparture;

                    const formattedArrivalDate = formatDateTime(arrivalDate);

                    const formattedArrival = new Date(segment.ArrivalTime).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: false,
                    });
                    const concatArrivalDateTime = formattedArrivalDate + " " + formattedArrival;

                    const matchedFlightDetail = actualFlightDetails.find(flight =>
                        flight.$?.Origin === segment.Origin &&
                        flight.$?.Destination === segment.Destination &&
                        flight.$?.DepartureTime == (segment.DepartureTime) &&
                        flight.$?.ArrivalTime == (segment.ArrivalTime)
                    );

                    if (fareFamily == 'Corporate Fare') {
                        seat_type = 'Corporate Economy'
                    } else {
                        seat_type = seat_type;
                    }

                    flightDetails[`from_${index}`] = segment.Origin;
                    flightDetails[`to_${index}`] = segment.Destination;
                    flightDetails[`depart_${index}`] = concatDeptDateTime;
                    flightDetails[`arrival_${index}`] = concatArrivalDateTime;
                    flightDetails[`flight_name_${index}`] = handleAirline(segment.Carrier) + " (" + flightType + ")";
                    flightDetails[`flight_no_${index}`] = segment.Carrier + " " + segment.FlightNumber;
                    flightDetails[`seat_type_${index}`] = seat_type;
                    flightDetails[`pnr_no_${index}`] = flightpnrCode;
                    flightDetails[`checked_bg_${index}`] = matchesDataInfo?.[0] || 'NA';
                    flightDetails[`cabin_bg_${index}`] = matchesDataInfo?.[1] || 'NA';
                    flightDetails[`OriginTerminal_${index}`] = matchedFlightDetail?.$?.OriginTerminal ? `T-${matchedFlightDetail.$.OriginTerminal}` : "";
                    flightDetails[`DestinationTerminal_${index}`] = matchedFlightDetail?.$?.DestinationTerminal ? `T-${matchedFlightDetail.$.DestinationTerminal}` : "";
                });
            }

            const formatedmergedData = Array.isArray(mergedData) ? mergedData : [mergedData];
            const passengerDetailsFormatted = {};
            if (Array.isArray(formattedsegmenttaxivaxis) && Array.isArray(formatedmergedData)) {
                formattedsegmenttaxivaxis.forEach((segment, flightIndex) => {
                    formatedmergedData.forEach((passenger, passengerIndex) => {
                        passengerDetailsFormatted[`people_id_${flightIndex}_${passengerIndex}`] = passenger.id || "NA";
                        passengerDetailsFormatted[`ticket_no_${flightIndex}_${passengerIndex}`] = passenger.ticket_no || "NA";
                        passengerDetailsFormatted[`meal_include_${flightIndex}_${passengerIndex}`] = passenger.ticket_no || "NA";
                    });
                });
            }

            const seatDetailsFormatted = {};
            console.log("formseat", formseat)
            if (Array.isArray(formattedsegmenttaxivaxis) && Array.isArray(formseat)) {
                segmenttaxivaxis.forEach((segment, flightIndex) => {
                    formseat.forEach((seat, passengerIndex) => {
                        seatDetailsFormatted[`seat_no_${flightIndex}_${passengerIndex}`] = seat.seat_no || "NA";
                    });
                });
            }

            const tax_excluding_k3 = parseFloat(total_tax) - parseFloat(tax_k3) - parseFloat(assignTax);
            const passenger_markup_price = parseFloat(markup_price) * parseFloat(noOfSeats);
            const formtaxivaxiData = {
                // ...formtaxivaxi,
                access_token: access_token,
                booking_id: bookingid,
                trip_type: tripType,
                fare_type: 'Refundable',
                is_extra_baggage_included: 0,
                flight_type: flightType,
                total_ex_tax_fees: (base_price + assignTax)-discount,
                total_price: total_price,
                tax_and_fees: tax_excluding_k3 + discount,
                gst_k3: tax_k3,
                mark_up_price: 0,
                no_of_stops: stopCounts,
                no_of_stops_return: returnstopCounts,
                no_of_seats: noOfSeats,
                people_id: 'NULL',
                date_change_charges: 0,
                seat_charges: 0,
                meal_charges: 0,
                extra_baggage_charges: 0,
                fast_forward_charges: 0,
                vip_service_charges: 0,
                pnrcode: flightpnrCode,
                universallocatorCode: mainlocatorCode,
                applied_markup: passenger_markup_price,
                actual_markup: formtaxivaxi.markup_details?.[0]?.actual_markup_value,
                discount: discount,
                ...flightDetails,
                extrabaggage: 'NA',
                checkedInBaggage: checkedInBaggage,
                cabinBaggage: cabinBaggage,
                returns: returns,
                ...passengerDetailsFormatted,
                ...seatDetailsFormatted
            };

            console.log('assignFlightPayloadData', formtaxivaxiData);

            const apiLink = `${CONFIG.MAIN_API}/api/flights/assignSbtCotravFlightBooking`;

            axios.post(apiLink, JSON.stringify(formtaxivaxiData), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }).then((response) => {
                console.log("responseData", response)
            })

            console.log("Condition met, navigating... now in the reservationresult");

            const bookingCompleteData = {
                reservationdata: reservationResponse,
                segmentParse: segmentParse,
                Passengers: Passengers,
                PackageSelected: packageSelected,
                Airports: Airports,
                Airlines: Airlines,
                adult: request.adult,
                child: request.child,
                infant: request.infant,
                apiairportsdata: apiairports,
                markup_price: passenger_markup_price,
                seat_codes: tempCodes,
                booking_id: bookingid,
                flightDetails: actualFlightDetails,
                discount: discount,
                // ticketdata: ticketresponse.data 
            };
            console.log('bookingCompleteData', bookingCompleteData);
            navigate('/bookingCompleted', { state: { bookingCompleteData } });
            return;
        })


    };

    // } catch (error) {
    //     console.error("Error fetching price data:", error);
    // }



    const handleCompleteBooking = async (event) => {
        setSeatloading(false);
        setReservation(true);
        event.preventDefault();

        let isValidpassenger = true;

        const finalupdatepassengerarray = Passengerarray.map((passengerinfo, passengerindex) => {
            const firstName = document.querySelector(`input[name="adult_first_name[]"][data-index="${passengerindex}"]`).value;
            const lastName = document.querySelector(`input[name="adult_last_name[]"][data-index="${passengerindex}"]`).value;
            const birthdate = document.querySelector(`input[name="adult_age[]"][data-index="${passengerindex}"]`).value;
            const gender = document.querySelector(`select[name="adult_gender[]"][data-index="${passengerindex}"]`).value;

            const age = calculateAge(birthdate);

            if (firstName.trim() === '') {
                isValidpassenger = false;
                const firstNameError = document.querySelector(`.adult_first_name-message[data-index="${passengerindex}"]`);
                firstNameError.style.display = 'block';
            } else {
                const firstNameError = document.querySelector(`.adult_first_name-message[data-index="${passengerindex}"]`);
                firstNameError.style.display = 'none';
            }

            if (lastName.trim() === '') {
                isValidpassenger = false;
                const lastNameError = document.querySelector(`.adult_last_name-message[data-index="${passengerindex}"]`);
                lastNameError.style.display = 'block';
            } else {
                const lastNameError = document.querySelector(`.adult_last_name-message[data-index="${passengerindex}"]`);
                lastNameError.style.display = 'none';
            }

            if (isValidpassenger) {
                return {
                    ...passengerinfo,
                    adult_first_name: firstName,
                    adult_last_name: lastName,
                    adult_age: age,
                    adult_gender: gender,
                };
            } else {
                return passengerinfo;
            }
        });
        const isEqual = arraysAreEqual(finalupdatepassengerarray, updatepassengerarrays);
        if (isEqual) {
            let allCombinationsExist = true;
            if (seattravelerparse) {
                seattravelerparse.forEach(obj => {
                    seatresponseparse.forEach(segobj => {
                        if (obj['$']['Code'] !== 'INF') {
                            const passengerKey = obj['$']['Key'];
                            const segmentKey = segobj['$']['Key'];
                            if (Array.isArray(previousSelections) && previousSelections.length > 0) {
                                const combinationExists = previousSelections.some(selection => {
                                    return selection.passenger === passengerKey && selection.segment === segmentKey;
                                });

                                if (!combinationExists) {
                                    allCombinationsExist = false;
                                    return;
                                }
                            } else {
                                allCombinationsExist = false;
                                return;
                            }
                        }
                    });
                });
            }
            if (allCombinationsExist) {
                handleconfirmedbooked();
            } else {
                Swal.fire({
                    title: 'Are you sure?',
                    text: 'Do you want to proceed without selecting a seat',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, Proceed!',
                    cancelButtonText: 'No, cancel!',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        handleconfirmedbooked();
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        Swal.fire(
                            'Please select Seat!',
                        );
                    }
                });
            }

        } else {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you want to save edit details',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Proceed!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    const submitEvent = new Event('submit', { bubbles: true });
                    formRef.current.dispatchEvent(submitEvent);
                    setTimeout(() => {
                        Swal.fire('Updated Passengers Details Successfully!');
                    }, 2000);
                }
            });
        }

        async function handleconfirmedbooked() {
            console.log("in func");
            setLoading(true)

            if (previousSelections.length > 0 && airPricingCommand) {
                fetchPriceData();
                return;
            }


            const formatDate = (dateString) => {
                const date = new Date(dateString);
                const day = date.getDate().toString().padStart(2, '0');
                const month = date.toLocaleString('default', { month: 'short' });
                const year = date.getFullYear().toString().slice(-2);
                return `${day}${month}${year}`;
            };

            const segments = Array.isArray(segmentParse) ? segmentParse : [segmentParse];

            for (const segment of segments) {
                if (segment['$'] && segment['$']['Key']) {
                    if (segment['$']['HostTokenRef']) {
                        delete segment['$']['HostTokenRef'];
                    }
                    if (Array.isArray(packageSelected['air:AirSegmentRef'])) {
                        packageSelected['air:AirSegmentRef'] = segments;
                    } else {
                        if (packageSelected['air:AirSegmentRef']['$']['Key'] === segment['$']['Key']) {
                            packageSelected['air:AirSegmentRef'] = segment;
                        }
                    }
                }
            }

            const formseat = [];
            let tax_k3 = 0;

            if (Array.isArray(packageSelected['air:AirPricingInfo'])) {
                packageSelected['air:AirPricingInfo'].forEach(reservationpricinginfo => {
                    let taxInfoArray = reservationpricinginfo['air:TaxInfo'];

                    if (Array.isArray(taxInfoArray)) {
                        let found = false;

                        taxInfoArray.forEach(taxreservationpricinginfo => {
                            let category = taxreservationpricinginfo?.$?.CarrierDefinedCategory || taxreservationpricinginfo?.Category || "";
                            let amountStr = taxreservationpricinginfo?.$?.Amount || taxreservationpricinginfo?.Amount || "0";

                            if (category && category.includes("GST")) {
                                tax_k3 += Math.floor(parseFloat(amountStr.replace("INR", "").trim()));
                                tax_k3 = tax_k3 * noOfSeats;
                                found = true;
                            }
                        });

                        // If GST was not found, search for K3
                        if (!found) {
                            taxInfoArray.forEach(taxreservationpricinginfo => {
                                let category = taxreservationpricinginfo?.$?.CarrierDefinedCategory || taxreservationpricinginfo?.Category || "";
                                let amountStr = taxreservationpricinginfo?.$?.Amount || taxreservationpricinginfo?.Amount || "0";

                                if (category && category.includes("K3")) {
                                    tax_k3 += Math.floor(parseFloat(amountStr.replace("INR", "").trim()));
                                    tax_k3 = tax_k3 * noOfSeats;
                                }
                            });
                        }
                    } else {
                        let category = taxInfoArray?.$?.CarrierDefinedCategory || taxInfoArray?.Category || "";
                        let amountStr = taxInfoArray?.$?.Amount || taxInfoArray?.Amount || "0";

                        if (category && category.includes("GST")) {
                            tax_k3 += Math.floor(parseFloat(amountStr.replace("INR", "").trim()));
                            tax_k3 = tax_k3 * noOfSeats;
                        } else if (category && category.includes("K3")) {
                            tax_k3 += Math.floor(parseFloat(amountStr.replace("INR", "").trim()));
                            tax_k3 = tax_k3 * noOfSeats;
                        }
                    }
                });
            } else {
                let taxInfoArray = packageSelected['air:AirPricingInfo']?.['air:TaxInfo'];

                if (Array.isArray(taxInfoArray)) {
                    let found = false;

                    taxInfoArray.forEach(taxreservationpricinginfo => {
                        let category = taxreservationpricinginfo?.$?.CarrierDefinedCategory || taxreservationpricinginfo?.Category || "";
                        let amountStr = taxreservationpricinginfo?.$?.Amount || taxreservationpricinginfo?.Amount || "0";

                        if (category && category.includes("GST")) {
                            tax_k3 += Math.floor(parseFloat(amountStr.replace("INR", "").trim()));
                            tax_k3 = tax_k3 * noOfSeats;
                            found = true;
                        }
                    });

                    // If GST was not found, search for K3
                    if (!found) {
                        taxInfoArray.forEach(taxreservationpricinginfo => {
                            let category = taxreservationpricinginfo?.$?.CarrierDefinedCategory || taxreservationpricinginfo?.Category || "";
                            let amountStr = taxreservationpricinginfo?.$?.Amount || taxreservationpricinginfo?.Amount || "0";

                            if (category && category.includes("K3")) {
                                tax_k3 += Math.floor(parseFloat(amountStr.replace("INR", "").trim()));
                                tax_k3 = tax_k3 * noOfSeats;
                            }
                        });
                    }
                } else {
                    let category = taxInfoArray?.$?.CarrierDefinedCategory || taxInfoArray?.Category || "";
                    let amountStr = taxInfoArray?.$?.Amount || taxInfoArray?.Amount || "0";

                    if (category && category.includes("GST")) {
                        tax_k3 += Math.floor(parseFloat(amountStr.replace("INR", "").trim()));
                        tax_k3 = tax_k3 * noOfSeats;
                    } else if (category && category.includes("K3")) {
                        tax_k3 += Math.floor(parseFloat(amountStr.replace("INR", "").trim()));
                        tax_k3 = tax_k3 * noOfSeats;
                    }
                }
            }


            console.log("Total GST Tax:", tax_k3);

            let total_price = 0;
            let base_price = 0;
            let total_tax = 0;
            let fare_type = '';
            let discount = 0;

            console.log("packageSelected at re", packageSelected);

            if (packageSelected['air:AirPricingInfo']) {
                if (packageSelected['air:AirPricingInfo']['$']['TotalPrice']) {
                    total_price = Math.floor(parseFloat(packageSelected['air:AirPricingInfo']['$']['TotalPrice'].replace("INR", "").trim()));
                    total_price = total_price * noOfSeats;
                }
                if (packageSelected['air:AirPricingInfo']['$']['Taxes']) {
                    total_tax = Math.floor(parseFloat(packageSelected['air:AirPricingInfo']['$']['Taxes'].replace("INR", "").trim()));
                    total_tax = total_tax * noOfSeats;
                }
                if (packageSelected["air:AirPricingInfo"]["$"]["BasePrice"]) {
                    base_price = Math.floor(parseFloat(packageSelected["air:AirPricingInfo"]["$"]["BasePrice"].replace("INR", "").trim()));
                    base_price = base_price * noOfSeats;
                    console.log("base_price c", base_price);

                }
                if (packageSelected['air:AirPricingInfo']['$']['Refundable']) {
                    fare_type = packageSelected['air:AirPricingInfo']['$']['Refundable'] == 'true' ? 'Refundable' : 'Non Refundable';
                }
                const feeInfo = packageSelected?.["air:AirPricingInfo"]?.['air:FeeInfo'];

                if (feeInfo?.["$"]?.["Text"] === 'PromotionDiscount') {
                    const feesRaw = feeInfo?.["$"]?.["Amount"];
                    if (feesRaw) {
                        const feeAmount = parseFloat(feesRaw.replace("INR", "").trim());
                        discount = Math.floor(Math.abs(feeAmount)) * parseFloat(noOfSeats || 1);
                    }
                }
console.log("discount",discount);


            }
            let assignTax = 0; // Initialize assignTax

            if (Array.isArray(packageSelected['air:AirPricingInfo'])) {
                packageSelected['air:AirPricingInfo'].forEach(reservationpricinginfo => {
                    let taxInfoArray = reservationpricinginfo['air:TaxInfo'];

                    // Handle cases where 'air:TaxInfo' is not an array
                    if (!Array.isArray(taxInfoArray)) {
                        taxInfoArray = taxInfoArray ? [taxInfoArray] : [];
                    }

                    taxInfoArray.forEach(taxreservationpricinginfo => {
                        const category = taxreservationpricinginfo?.$?.CarrierDefinedCategory;

                        if (category && ["RCF", "TTF", "PHF"].includes(category.trim())) {
                            let amount = parseFloat(taxreservationpricinginfo.$.Amount.replace("INR", "").trim());
                            console.log("before amount", amount);
                            amount = amount * noOfSeats;
                            console.log("amount", amount);

                            assignTax += Math.floor(amount);
                        }
                    });
                });
            } else if (Array.isArray(packageSelected['air:AirPricingInfo']['air:TaxInfo'])) {
                packageSelected['air:AirPricingInfo']['air:TaxInfo'].forEach(taxreservationpricinginfo => {
                    const category = taxreservationpricinginfo?.$?.CarrierDefinedCategory;

                    if (category && ["RCF", "TTF", "PHF"].includes(category.trim())) {
                        let amount = parseFloat(taxreservationpricinginfo.$.Amount.replace("INR", "").trim());
                        console.log("before amount", amount);
                        amount = amount * noOfSeats;
                        console.log("amount", amount);
                        assignTax += Math.floor(amount);
                    }
                });
            } else if (packageSelected['air:AirPricingInfo']['air:TaxInfo']?.$?.CarrierDefinedCategory) {
                const category = packageSelected['air:AirPricingInfo']['air:TaxInfo'].$.CarrierDefinedCategory;

                if (category && ["RCF", "TTF", "PHF"].includes(category.trim())) {
                    let amount = parseFloat(packageSelected['air:AirPricingInfo']['air:TaxInfo'].$.Amount.replace("INR", "").trim());
                    console.log("before amount", amount);
                    amount = amount * noOfSeats;
                    console.log("amount", amount);
                    assignTax += Math.floor(amount);
                }
            }
            console.log('base_price', base_price);
            console.log('assignTax', assignTax);
            previousSelections.forEach(seatselect => {
                const segmentseat = seatselect.segment;
                let seat_price = '0';
                if (seatselect['optionalkey'] !== 'free') {
                    seatOptionalparse.forEach(seatOptionalparseinfo => {
                        if (seatselect.optionalkey === seatOptionalparseinfo['$']['Key']) {
                            seat_price = seatOptionalparseinfo['$']['TotalPrice'];
                        }

                    });
                }

                const segmentArray = Array.isArray(segmentParse) ? segmentParse : [segmentParse];

                segmentArray.forEach(segment => {
                    if (segmentseat === segment['$']['Key']) {
                        let segmentseatData = {
                            'seat_no': seatselect.code,
                            'seat-price': seat_price,
                            'passenger': seatselect.passenger,
                            'segment_key': segment['$'].Key,
                        };
                        formseat.push(segmentseatData);
                    }
                });

            });

            let stopCounts = 0;
            let returnstopCounts = 0;
            const segmentss = Array.isArray(segmentParse) ? segmentParse : [segmentParse];

            segmentss.forEach(segment => {
                const groupNumber = parseInt(segment['$']['Group']);
                if (groupNumber === 0) {
                    stopCounts++;
                }
                if (groupNumber === 1) {
                    returnstopCounts++;
                }
            });

            const segmenttaxivaxis = [];
            segmentss.forEach(segment => {
                let segmenttaxivaxi = {
                    'Key': segment['$'].Key,
                    'FlightNumber': segment['$'].FlightNumber,
                    'Carrier': segment['$'].Carrier,
                    'Origin': segment['$'].Origin,
                    'Destination': segment['$'].Destination,
                    'DepartureTime': segment['$'].DepartureTime,
                    'ArrivalTime': segment['$'].ArrivalTime,
                    'Group': segment['$'].Group,
                };
                segmenttaxivaxis.push(segmenttaxivaxi);
            });

            if (stopCounts > 0) {
                stopCounts = stopCounts - 1;
            }
            if (returnstopCounts > 0) {
                returnstopCounts = returnstopCounts - 1;
            }
            function generateUniqueKey() {
                const characters = '0123456789ABCDEF';
                let key = '';

                for (let i = 0; i < 6; i++) {
                    const index = Math.floor(Math.random() * characters.length);
                    key += characters[index];
                }
                return key;
            }
            const passengersreservation = Passengers.keys.map((key, index) => {
                const bookingTraveler = {
                    '$': {
                        'Age': calculateAge(Passengers.ageNames[index]),
                        'Gender': Passengers.genderNames[index],
                        'Key': key,
                        'TravelerType': Passengers.codes[index]
                    },
                    'com:BookingTravelerName': {
                        '$': {
                            'First': Passengers.firstNames[index],
                            'Last': Passengers.lastNames[index],
                            'Prefix': Passengers.genderNames[index] === 'F' ? 'Miss' : 'Mr'
                        }
                    },
                    'com:PhoneNumber': {
                        '$': {
                            'Number': Passengers.contactNo,
                            'Type': "Mobile"
                        }
                    },
                    'com:Email': {
                        '$': {
                            'EmailID': Passengers.email,
                        }
                    },
                    'com:SSR': [
                        {
                            '$': {
                                'Carrier': carrier,
                                'FreeText': "/IND/" + clientFormGst.GSTIN + "/" + clientFormGst.company_gst_name,
                                'Key': generateUniqueKey(),
                                'Status': "HK",
                                'Type': "GSTN"
                            }
                        },
                        {
                            '$': {
                                'Carrier': carrier,
                                'FreeText': "/IND/demo//taxivaxi.com",
                                'Key': generateUniqueKey(),
                                'Status': "HK",
                                'Type': "GSTE"
                            }
                        },
                        {
                            '$': {
                                'Carrier': carrier,
                                'FreeText': "/IND/" + clientFormGst.company_gst_contact,
                                'Key': generateUniqueKey(),
                                'Status': "HK",
                                'Type': "GSTP"
                            }
                        },
                        {
                            '$': {
                                'Carrier': carrier,
                                'FreeText': "/IND/" + clientFormGst.company_gst_address,
                                'Key': generateUniqueKey(),
                                'Status': "HK",
                                'Type': "GSTA"
                            }
                        }
                    ],
                    ...(Passengers.codes[index] === 'CNN' || Passengers.codes[index] === 'INF' ? {
                        'com:NameRemark': {
                            'com:RemarkData': Passengers.codes[index] === 'CNN' ? `PC-${calculateAge(Passengers.ageNames[index])} ${formatDate(Passengers.ageNames[index])}` : formatDate(Passengers.ageNames[index])
                        }
                    } : {}),
                    'com:Address': {
                        'com:AddressName': Passengers.address,
                        'com:Street': Passengers.street,
                        'com:City': Passengers.city,
                        'com:State': Passengers.state,
                        'com:PostalCode': Passengers.postalCode,
                        'com:Country': Passengers.country,
                    }
                };

                return bookingTraveler;
            });

            let passengerTypeIndex = 0;

            if (Array.isArray(packageSelected['air:AirPricingInfo'])) {
                packageSelected['air:AirPricingInfo'].forEach(reservationpricinginfo => {
                    if (Array.isArray(reservationpricinginfo['air:PassengerType'])) {
                        reservationpricinginfo['air:PassengerType'].forEach(passengerType => {
                            passengerType['$']['BookingTravelerRef'] = Passengers.keys[passengerTypeIndex];
                            passengerTypeIndex++;
                        });
                    } else {
                        reservationpricinginfo['air:PassengerType']['$']['BookingTravelerRef'] = Passengers.keys[passengerTypeIndex];
                        passengerTypeIndex++;
                    }
                });
            } else {
                if (Array.isArray(packageSelected['air:AirPricingInfo']['air:PassengerType'])) {
                    packageSelected['air:AirPricingInfo']['air:PassengerType'].forEach(passengerType => {
                        passengerType['$']['BookingTravelerRef'] = Passengers.keys[passengerTypeIndex];
                        passengerTypeIndex++;
                    });
                } else {
                    packageSelected['air:AirPricingInfo']['air:PassengerType']['$']['BookingTravelerRef'] = Passengers.keys[passengerTypeIndex];
                }
            }
            if (packageSelected['air:OptionalServices']) {
                delete packageSelected['air:OptionalServices']['air:OptionalService'];
                delete packageSelected['air:OptionalServices']['air:OptionalServiceRules'];

            }
            const specificSeatAssignments = [];
            if (previousSelections.length !== 0) {
                previousSelections.forEach(seatSelection => {
                    if (seatSelection.optionalkey === "free") {
                        const SeatId = seatSelection.code;
                        const BookingTravelerRef = seatSelection.passenger;
                        const SegmentRef = seatSelection.segment;
                        const specificSeatAssignment = {
                            '$': {
                                'SeatId': SeatId,
                                'BookingTravelerRef': BookingTravelerRef,
                                'SegmentRef': SegmentRef
                            }
                        };
                        specificSeatAssignments.push(specificSeatAssignment);
                    }
                });
            }
            // console.log('packageSelected', packageSelected);

            const passengerAges = Passengers.ageNames.map(calculateAge);
            const makeReservationRequest = async () => {

                var xml2js = require('xml2js');
                var reservationRequestEnvelope = {
                    'soapenv:Envelope': {
                        '$': {
                            'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/'
                        },
                        'soapenv:Body': {
                            'univ:AirCreateReservationReq': {
                                '$': {
                                    'AuthorizedBy': 'TAXIVAXI',
                                    'RetainReservation': 'Both',
                                    'TargetBranch': Targetbranch,
                                    'TraceId': 'ac191f0b9c0546659065f29389eae552',
                                    'RestrictWaitlist': 'true',
                                    'xmlns:univ': 'http://www.travelport.com/schema/universal_v52_0',
                                    'xmlns:air': 'http://www.travelport.com/schema/air_v52_0',
                                    'xmlns:com': 'http://www.travelport.com/schema/common_v52_0',
                                    'xmlns:common_v52_0': 'http://www.travelport.com/schema/common_v52_0'
                                },
                                'com:BillingPointOfSaleInfo': {
                                    '$': {
                                        'OriginApplication': 'UAPI',
                                    },
                                },
                                'com:BookingTraveler': passengersreservation,
                                'com:OSI': {
                                    '$': {
                                        'Carrier': carrier,
                                        'Key': "1",
                                        'Text': "INDA 6576899966 PAX",
                                        'ProviderCode': providerCode,
                                        'xmlns:com': "http://www.travelport.com/schema/common_v52_0"
                                    }
                                },
                                'com:ContinuityCheckOverride': true,
                                'com:AgencyContactInfo': {
                                    'com:PhoneNumber': {
                                        '$': {
                                            'CountryCode': "91",
                                            'AreaCode': "011",
                                            'Number': "9881102875",
                                            'Location': "DEL",
                                            'Type': "Agency"
                                        }
                                    }
                                },
                                'com:EmailNotification': {
                                    '$': {
                                        'Recipients': "All"
                                    }
                                },
                                // 'com:FormOfPayment': {
                                //     '$': {
                                //         'Type': 'AgencyPayment'
                                //     },
                                //     'com:AgencyPayment': {
                                //         '$': {
                                //             'AgencyBillingIdentifier': 'KTDEL283',
                                //             'AgencyBillingPassword': 'Baiinfo@2024'
                                //         }
                                //     }
                                // },

                                'com:FormOfPayment': {
                                    '$': {
                                        'Type': "Credit"
                                    },
                                    'com:CreditCard': {
                                        '$': {
                                            'BankCountryCode': "IN",
                                            'CVV': "737",
                                            'ExpDate': "2026-11",
                                            'Name': "Pavan Patil",
                                            'Number': "4111111111111111",
                                            'Type': "VI",
                                        },
                                        'com:BillingAddress': {
                                            'com:AddressName': "Home",
                                            'com:Street': "A-304 Relicon Felicia,Pashan,Pune",
                                            'com:City': "Pune",
                                            'com:State': "Maharashtra",
                                            'com:PostalCode': "411011",
                                            'com:Country': "IN",
                                        }
                                    },
                                },
                                'air:AirPricingSolution': packageSelected,
                                'com:ActionStatus': {
                                    '$': {
                                        'ProviderCode': providerCode,
                                        'TicketDate': "T*",
                                        'Type': "ACTIVE"
                                    }
                                }
                            }
                        }
                    }
                };
                // console.log()
                if (specificSeatAssignments.length > 0) {
                    // specificSeatAssignments.forEach(specificSeatAssignment => {
                    reservationRequestEnvelope['soapenv:Envelope']['soapenv:Body']['univ:AirCreateReservationReq']['air:SpecificSeatAssignment'] = specificSeatAssignments;
                    // });
                }
                var xmlBuilder = new xml2js.Builder();
                var reservationRequestXML = xmlBuilder.buildObject(reservationRequestEnvelope);


                var parser = new DOMParser();
                var xmlDoc = parser.parseFromString(reservationRequestXML, 'text/xml');
                var allElements = xmlDoc.getElementsByTagName('*');
                for (let i = 0; i < allElements.length; i++) {
                    var element = allElements[i];
                    if (element.tagName === 'air:AirSegmentRef') {
                        var newElement = xmlDoc.createElement('air:AirSegment');

                        // Copy all attributes from the original element
                        for (let j = 0; j < element.attributes.length; j++) {
                            var attr = element.attributes[j];
                            newElement.setAttribute(attr.nodeName, attr.nodeValue);
                        }

                        let segmentKey = newElement.getAttribute("Key");
                        let providerCode = newElement.getAttribute("ProviderCode"); // Get ProviderCode from newElement
                        providerCodeRef.current = providerCode;

                        let bookingInfoArray = packageSelected['air:AirPricingInfo']['air:BookingInfo'];

                        if (!Array.isArray(bookingInfoArray)) {
                            bookingInfoArray = [bookingInfoArray];
                        }

                        let matchingBookingInfo = bookingInfoArray.find(info => info["$"]["SegmentRef"] === segmentKey);

                        if (matchingBookingInfo && providerCode === "ACH") {
                            // Add HostTokenRef only if ProviderCode is "ACH"
                            let hostTokenRef = matchingBookingInfo["$"]["HostTokenRef"];
                            newElement.setAttribute("HostTokenRef", hostTokenRef);
                        }


                        for (let j = 0; j < element.childNodes.length; j++) {
                            var childNode = element.childNodes[j].cloneNode(true);
                            newElement.appendChild(childNode);
                        }

                        element.parentNode.replaceChild(newElement, element);
                    }
                }
                const providerCodeValue = providerCode;
                // console.log('providerCodeValue', providerCodeValue);

                var modifiedXmlString = new XMLSerializer().serializeToString(xmlDoc);
                console.log('modifiedXmlString', modifiedXmlString);

                try {
                    const reservationresponse = await axios.post(`${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightAirServiceRequest`, modifiedXmlString);
                    const reservationResponse = reservationresponse.data;
                    
                    console.log('reservationResponse', reservationResponse);

                    parseString(reservationResponse, { explicitArray: false }, async (err, reservationresult) => {
                        if (err) {
                            console.error('Error parsing XML:', err);
                            return;
                        }
                        let matchesDataInfo;

                        const ReservationRsp = reservationresult['SOAP:Envelope']['SOAP:Body']['universal:AirCreateReservationRsp'];
                        if (ReservationRsp !== null && ReservationRsp !== undefined) {
                            const locatorCode = reservationresult['SOAP:Envelope']['SOAP:Body']['universal:AirCreateReservationRsp']['universal:UniversalRecord']['universal:ProviderReservationInfo']['$']['LocatorCode'];
                            const pnrCode = reservationresult['SOAP:Envelope']['SOAP:Body']['universal:AirCreateReservationRsp']['universal:UniversalRecord']['air:AirReservation']['$']['LocatorCode']; //carrierlocator
                            const universallocatorCode = reservationresult['SOAP:Envelope']['SOAP:Body']['universal:AirCreateReservationRsp']['universal:UniversalRecord']['$']['LocatorCode']; //universal
                            const segmentreservation = reservationresult['SOAP:Envelope']['SOAP:Body']['universal:AirCreateReservationRsp']['universal:UniversalRecord']['air:AirReservation']['air:AirSegment'];
                            const flightpnrCode = reservationresult['SOAP:Envelope']['SOAP:Body']['universal:AirCreateReservationRsp']['universal:UniversalRecord']['air:AirReservation']['common_v52_0:SupplierLocator']['$']['SupplierLocatorCode'];
                            console.log("packageSelected['air:AirPricingInfo'][0]", packageSelected);

                            const fareInfoList = Array.isArray(packageSelected['air:AirPricingInfo']['air:FareInfo']) ? packageSelected['air:AirPricingInfo']['air:FareInfo'][0] : packageSelected['air:AirPricingInfo']['air:FareInfo'];


                            fareInfoList['air:Brand']['air:Text'].map((textinfor, textindex) => {
                                if (
                                    textinfor['$'] &&
                                    textinfor['$']['Type'] === "MarketingConsumer"
                                ) {
                                    const infoText = textinfor['_'];
                                    const matches = infoText.match(/\b\d+\s?(kgs?|kg)\b/gi);

                                    if (matches) {
                                        matchesDataInfo = matches
                                    }
                                }
                            })

                            const flightDetails = {};

                            const formattedsegmenttaxivaxis = Array.isArray(segmenttaxivaxis) ? segmenttaxivaxis : [segmenttaxivaxis];
                            console.log("formattedsegmenttaxivaxis", formattedsegmenttaxivaxis);

                            if (Array.isArray(formattedsegmenttaxivaxis)) {
                                formattedsegmenttaxivaxis.forEach((segment, index) => {
                                    console.log("segment.DepartureTime", segment.DepartureTime);
                                    console.log("segment.ArrivalTime", segment.ArrivalTime);

                                    const departureDate = new Date(segment.DepartureTime);
                                    const arrivalDate = new Date(segment.ArrivalTime);

                                    const formattedDate = formatDateTime(departureDate);

                                    const formattedDeparture = new Date(segment.DepartureTime).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: false,
                                    });

                                    const concatDeptDateTime = formattedDate + " " + formattedDeparture;

                                    const formattedArrivalDate = formatDateTime(arrivalDate);

                                    const formattedArrival = new Date(segment.ArrivalTime).toLocaleTimeString('en-US', {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: false,
                                    });
                                    const concatArrivalDateTime = formattedArrivalDate + " " + formattedArrival;


                                    const matchedFlightDetail = actualFlightDetails.find(flight =>
                                        flight.$?.Origin === segment.Origin &&
                                        flight.$?.Destination === segment.Destination &&
                                        flight.$?.DepartureTime == (segment.DepartureTime) &&
                                        flight.$?.ArrivalTime == (segment.ArrivalTime)
                                    );


                                    console.log("actualFlightDetails", actualFlightDetails)
                                    console.log("matchedFlightDetail", matchedFlightDetail)
                                    console.log("concatDeptDateTime", concatDeptDateTime);
                                    if (fareFamily == 'Corporate Fare') {
                                        seat_type = 'Corporate Economy'
                                    } else {
                                        seat_type = seat_type;
                                    }
                                    flightDetails[`from_${index}`] = segment.Origin;
                                    flightDetails[`to_${index}`] = segment.Destination;
                                    flightDetails[`depart_${index}`] = concatDeptDateTime;
                                    flightDetails[`arrival_${index}`] = concatArrivalDateTime;
                                    flightDetails[`flight_name_${index}`] = handleAirline(segment.Carrier) + " (" + flightType + ")";
                                    flightDetails[`flight_no_${index}`] = segment.Carrier + " " + segment.FlightNumber;
                                    flightDetails[`seat_type_${index}`] = seat_type;
                                    flightDetails[`pnr_no_${index}`] = flightpnrCode;
                                    flightDetails[`checked_bg_${index}`] = matchesDataInfo?.[0] || 'NA';
                                    flightDetails[`cabin_bg_${index}`] = matchesDataInfo?.[1] || 'NA';
                                    flightDetails[`OriginTerminal_${index}`] = matchedFlightDetail?.$?.OriginTerminal ? `T-${matchedFlightDetail.$.OriginTerminal}` : "";
                                    flightDetails[`DestinationTerminal_${index}`] = matchedFlightDetail?.$?.DestinationTerminal ? `T-${matchedFlightDetail.$.DestinationTerminal}` : "";

                                });
                            }

                            const formatedmergedData = Array.isArray(mergedData) ? mergedData : [mergedData];

                            const passengerDetailsFormatted = {};
                            if (Array.isArray(formattedsegmenttaxivaxis) && Array.isArray(formatedmergedData)) {
                                formattedsegmenttaxivaxis.forEach((segment, flightIndex) => {
                                    formatedmergedData.forEach((passenger, passengerIndex) => {
                                        passengerDetailsFormatted[`people_id_${flightIndex}_${passengerIndex}`] = passenger.id || "NA";
                                        passengerDetailsFormatted[`ticket_no_${flightIndex}_${passengerIndex}`] = passenger.ticket_no || "NA";
                                        passengerDetailsFormatted[`meal_include_${flightIndex}_${passengerIndex}`] = passenger.ticket_no || "NA";
                                    });
                                });
                            }

                            const seatDetailsFormatted = {};
                            if (Array.isArray(formattedsegmenttaxivaxis) && Array.isArray(formseat)) {
                                segmenttaxivaxis.forEach((segment, flightIndex) => {
                                    formseat.forEach((seat, passengerIndex) => {
                                        seatDetailsFormatted[`seat_no_${flightIndex}_${passengerIndex}`] = seat.seat_no || "NA";
                                    });
                                });
                            }

                            if (providerCodeValue?.trim() === "ACH") {
                                console.log("Condition met, navigating...");
                                const tax_excluding_k3 = parseFloat(total_tax) - parseFloat(tax_k3) - parseFloat(assignTax);
                                const passenger_markup_price = parseFloat(markup_price) * parseFloat(noOfSeats);
                                const formtaxivaxiData = {
                                    access_token: access_token,
                                    booking_id: bookingid,
                                    trip_type: tripType,
                                    fare_type: 'Refundable',
                                    is_extra_baggage_included: 0,
                                    flight_type: flightType,
                                    total_ex_tax_fees: (base_price + assignTax)-discount,
                                    total_price: total_price,
                                    tax_and_fees: tax_excluding_k3 + discount,
                                    gst_k3: tax_k3,
                                    no_of_stops: stopCounts,
                                    no_of_stops_return: returnstopCounts,
                                    no_of_seats: noOfSeats,
                                    people_id: 'NULL',
                                    date_change_charges: 0,
                                    seat_charges: 0,
                                    meal_charges: 0,
                                    extra_baggage_charges: 0,
                                    fast_forward_charges: 0,
                                    vip_service_charges: 0,
                                    pnrcode: flightpnrCode,
                                    universallocatorCode: universallocatorCode,
                                    applied_markup: passenger_markup_price,
                                    actual_markup: formtaxivaxi.markup_details?.[0]?.actual_markup_value,
                                    discount: discount,
                                    ...flightDetails,
                                    extrabaggage: 'NA',
                                    checkedInBaggage: checkedInBaggage,
                                    cabinBaggage: cabinBaggage,
                                    returns: returns,
                                    ...passengerDetailsFormatted,
                                    ...seatDetailsFormatted
                                };

                                console.log('assignFlightPayloadData', formtaxivaxiData);

                                const apiLink = `${CONFIG.MAIN_API}/api/flights/assignSbtCotravFlightBooking`;

                                axios.post(apiLink, JSON.stringify(formtaxivaxiData), {
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                }).then((response) => {
                                    console.log("responseData", response)
                                })

                                var UniversalRecordRequest = {
                                    "soap:Envelope": {
                                        '$': {
                                            "@xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/",
                                        },
                                        "soap:Body": {
                                            "univ:UniversalRecordRetrieveReq": {
                                                '$': {
                                                    "@TargetBranch": Targetbranch,
                                                    "@TraceId": "TVSBP001",
                                                    "@AuthorizedBy": "TAXIVAXI",
                                                    "@RetrieveProviderReservationDetails": "true",
                                                    "@xmlns:univ": "http://www.travelport.com/schema/universal_v52_0",
                                                    "@xmlns:com": "http://www.travelport.com/schema/common_v52_0",
                                                },
                                                "com:BillingPointOfSaleInfo": {
                                                    '$': {
                                                        "@OriginApplication": "UAPI"
                                                    }
                                                },
                                                "univ:ProviderReservationInfo": {
                                                    '$': {
                                                        "@ProviderCode": "ACH",
                                                        "@ProviderLocatorCode": flightpnrCode
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                // const UniversalRecordResponse = await axios.post('${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightUniversalRecordService')

                                const bookingCompleteData = {
                                    reservationdata: reservationResponse,
                                    segmentParse: segmentParse,
                                    Passengers: Passengers,
                                    PackageSelected: packageSelected,
                                    Airports: Airports,
                                    Airlines: Airlines,
                                    adult: request.adult,
                                    child: request.child,
                                    infant: request.infant,
                                    apiairportsdata: apiairports,
                                    markup_price: passenger_markup_price,
                                    booking_id: bookingid,
                                    flightDetails: actualFlightDetails,
                                    discount: discount,
                                    // ticketdata: ticketresponse.data 
                                };
                                console.log('bookingCompleteData', bookingCompleteData);
                                navigate('/bookingCompleted', { state: { bookingCompleteData } });
                                return;
                            }

                            const tax_and_fees = parseFloat(base_price);

                            const makeGetUnversalCodeRequest = async () => {
                                const username = 'Universal API/uAPI8645980109-af7494fa';
                                const password = 'N-k29Z}my5';
                                const authHeader = `Basic ${btoa(`${username}:${password}`)}`

                                const builder = require('xml2js').Builder;
                                var GetUnversalCodeXML = new builder().buildObject({
                                    'soap:Envelope': {
                                        '$': {
                                            'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/'
                                        },
                                        'soap:Body': {
                                            'univ:UniversalRecordRetrieveReq': {
                                                '$': {
                                                    'TargetBranch': Targetbranch,
                                                    'RetrieveProviderReservationDetails': 'true',
                                                    'xmlns:univ': 'http://www.travelport.com/schema/universal_v52_0',
                                                    'xmlns:com': 'http://www.travelport.com/schema/common_v52_0',
                                                },
                                                'com:BillingPointOfSaleInfo': {
                                                    '$': {
                                                        'OriginApplication': 'UAPI',
                                                    },
                                                },
                                                'univ:ProviderReservationInfo': {
                                                    '$': {
                                                        'ProviderCode': providerCode,
                                                        'ProviderLocatorCode': locatorCode
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });
                                try {
                                    const getUnversalCoderesponse = await axios.post(`${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightAirServiceRequest`, GetUnversalCodeXML);
                                    const GetUnversalCodeResponse = getUnversalCoderesponse.data;
                                    console.log("getUnversalCoderesponse", getUnversalCoderesponse)
                                } catch (error) {
                                    console.error(error);
                                }
                            };

                            const makeTicketRequest = async () => {
                                const builder = require('xml2js').Builder;
                                var TicketXML = new builder().buildObject({
                                    'soapenv:Envelope': {
                                        '$': {
                                            'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/'
                                        },
                                        'soapenv:Header': '',
                                        'soapenv:Body': {
                                            'air:AirTicketingReq': {
                                                '$': {
                                                    'AuthorizedBy': 'TAXIVAXI',
                                                    'RetrieveProviderReservationDetails': 'true',
                                                    'ReturnInfoOnFail': 'true',
                                                    'TargetBranch': Targetbranch,
                                                    'TraceId': 'ac191f0b9c0546659065f29389eae552',
                                                    'xmlns:air': 'http://www.travelport.com/schema/air_v52_0',
                                                    'xmlns:common': 'http://www.travelport.com/schema/common_v52_0',
                                                    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                                                    'xsi:schemaLocation': 'http://www.travelport.com/schema/air_v52_0 file:///C:/Users/mukil.kumar/Documents/Ecommerce/WSDL/Release-V17.3.0.35-V17.3/air_v52_0/AirReqRsp.xsd',
                                                },
                                                'common:BillingPointOfSaleInfo': {
                                                    '$': {
                                                        'OriginApplication': 'UAPI',
                                                    },
                                                },
                                                'air:AirReservationLocatorCode': pnrCode
                                            }
                                        }
                                    }
                                });

                                console.log(TicketXML);

                                try {
                                    const ticketresponse = await axios.post(`${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightAirServiceRequest`, TicketXML);
                                    const TicketResponse = ticketresponse.data;
                                    console.log("ticketresponse1", TicketResponse);
                                    return TicketResponse; // ✅ Returning the response
                                } catch (error) {
                                    console.error(error);
                                    return null; // ✅ Return null in case of error
                                }
                            };

                            const executeCodeTicketSequentially = async () => {
                                let getUnversalCoderesponse, ticketresponse;
                                // let ticketresponse;

                                try {
                                    getUnversalCoderesponse = await makeGetUnversalCodeRequest();
                                    // shall i apply condition for provider code only call for 1G not for ACH
                                    ticketresponse = await makeTicketRequest();
                                    console.log('ticketresponse2', ticketresponse);

                                    // if (hasNonEmptyProperties(emptaxivaxi)) {
                                    // const sessiondata = async () => {   
                                    const tax_excluding_k3 = parseFloat(total_tax) - parseFloat(tax_k3) - parseFloat(assignTax);
                                    const passenger_markup_price = parseFloat(markup_price) * parseFloat(noOfSeats);
                                    const formtaxivaxiData = {
                                        // ...formtaxivaxi,
                                        access_token: access_token,
                                        booking_id: bookingid,
                                        trip_type: tripType,
                                        fare_type: 'Refundable',
                                        is_extra_baggage_included: 0,
                                        flight_type: flightType,
                                        total_ex_tax_fees: (base_price + assignTax)-discount,
                                        total_price: total_price,
                                        tax_and_fees: tax_excluding_k3 + discount,
                                        gst_k3: tax_k3,
                                        mark_up_price: 0,
                                        no_of_stops: stopCounts,
                                        no_of_stops_return: returnstopCounts,
                                        no_of_seats: noOfSeats,
                                        people_id: 'NULL',
                                        date_change_charges: 0,
                                        seat_charges: 0,
                                        meal_charges: 0,
                                        extra_baggage_charges: 0,
                                        fast_forward_charges: 0,
                                        vip_service_charges: 0,
                                        pnrcode: flightpnrCode,
                                        universallocatorCode: universallocatorCode,
                                        applied_markup: passenger_markup_price,
                                        actual_markup: formtaxivaxi.markup_details?.[0]?.actual_markup_value,
                                        discount: discount,
                                        ...flightDetails,
                                        extrabaggage: 'NA',
                                        // seatdetails: formseat,
                                        checkedInBaggage: checkedInBaggage,
                                        cabinBaggage: cabinBaggage,
                                        returns: returns,
                                        // passengerdetails: mergedData
                                        ...passengerDetailsFormatted,
                                        ...seatDetailsFormatted
                                    };

                                    console.log("ticketresponse.data", ticketresponse)

                                    console.log('assignFlightPayloadData', JSON.stringify(formtaxivaxiData));

                                    const apiLink = `${CONFIG.MAIN_API}/api/flights/assignSbtCotravFlightBooking`;

                                    axios.post(apiLink, JSON.stringify(formtaxivaxiData), {
                                        headers: {
                                            'Content-Type': 'application/x-www-form-urlencoded',
                                        },
                                    })
                                        .then((response) => {
                                            console.log("responseData", response)
                                            if (response.data.success === "1") {
                                                Swal.fire({
                                                    title: "Success!",
                                                    text: "Booking Confirmed.",
                                                    icon: "success",
                                                    confirmButtonText: "OK",
                                                });
                                            } else {
                                                Swal.fire({
                                                    title: "Error!",
                                                    text: response.data.error || "Something went wrong.",
                                                    icon: "error",
                                                    confirmButtonText: "Retry",
                                                });
                                            }
                                        })
                                        .catch((error) => {
                                            Swal.fire({
                                                title: "Error!",
                                                text: "Something went wrong while creating the booking.",
                                                icon: "error",
                                                confirmButtonText: "Retry",
                                            });
                                        });
                                    const bookingCompleteData = {
                                        reservationdata: reservationResponse,
                                        segmentParse: segmentParse,
                                        Passengers: Passengers,
                                        PackageSelected: packageSelected,
                                        Airports: Airports,
                                        Airlines: Airlines,
                                        adult: request.adult,
                                        child: request.child,
                                        infant: request.infant,
                                        apiairportsdata: apiairports,
                                        ticketdata: ticketresponse,
                                        markup_price: passenger_markup_price,
                                        booking_id: bookingid,
                                        flightDetails: actualFlightDetails,
                                        discount: discount,
                                    };
                                    console.log('bookingCompleteData', bookingCompleteData);
                                    navigate('/bookingCompleted', { state: { bookingCompleteData } });


                                } catch (error) {
                                    console.error('Error executing requests:', error);
                                }
                            };
                            executeCodeTicketSequentially();




                            if (Array.isArray(segmentreservation)) {
                                segmentreservation.forEach(objs => {
                                    if (objs['common_v52_0:SellMessage']) {
                                        objs['com:SellMessage'] = objs['common_v52_0:SellMessage'];
                                        delete objs['common_v52_0:SellMessage'];
                                    }
                                });
                            } else {
                                if (segmentreservation['common_v52_0:SellMessage']) {
                                    segmentreservation['com:SellMessage'] = segmentreservation['common_v52_0:SellMessage'];
                                    delete segmentreservation['common_v52_0:SellMessage'];
                                }
                            }
                            if (seattravelerparse) {
                                seattravelerparse.forEach(obj => {
                                    if (obj['common_v52_0:Name']) {
                                        obj['com:Name'] = obj['common_v52_0:Name'];
                                        delete obj['common_v52_0:Name'];
                                    }
                                });
                            }
                            // console.log(previousSelections);
                            if (previousSelections.length !== 0 || serviceoptions || serviceoptions.length > 0) {


                                const optionalkeyarray = [];
                                if (seatOptionalparse) {
                                    seatOptionalparse.forEach(seatOptionalparseinfo => {
                                        previousSelections.forEach(seatSelection => {
                                            if (seatSelection.optionalkey !== "free" && seatSelection.optionalkey === seatOptionalparseinfo['$']['Key']) {
                                                seatOptionalparseinfo['common_v52_0:ServiceData']['$'].Data = seatSelection.code;
                                                optionalkeyarray.push(seatOptionalparseinfo);

                                            }
                                        });
                                    });
                                }
                                const makeMerchandisingRequest = async () => {
                                    const username = 'Universal API/uAPI8645980109-af7494fa';
                                    const password = 'N-k29Z}my5';
                                    const authHeader = `Basic ${btoa(`${username}:${password}`)}`
                                    const mergedArray = [...serviceoptions];
                                    mergedArray.push(...optionalkeyarray);



                                    const builder = require('xml2js').Builder;
                                    var MerchandisingrequestXML1 = new builder().buildObject({
                                        'soap:Envelope': {
                                            '$': {
                                                'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/'
                                            },
                                            'soap:Header': {

                                            },
                                            'soap:Body': {
                                                '$': {
                                                    'xmlns:air': 'http://www.travelport.com/schema/air_v52_0',
                                                    'xmlns:com': 'http://www.travelport.com/schema/common_v52_0',
                                                    'xmlns:univ': 'http://www.travelport.com/schema/universal_v52_0'
                                                },
                                                'univ:AirMerchandisingFulfillmentReq': {
                                                    '$': {
                                                        'TargetBranch': Targetbranch
                                                    },
                                                    'com:BillingPointOfSaleInfo': {
                                                        '$': {
                                                            'OriginApplication': 'UAPI'
                                                        },
                                                    },
                                                    'air:HostReservation': {
                                                        '$': {
                                                            'Carrier': 'UK',
                                                            'CarrierLocatorCode': pnrCode,
                                                            'ProviderCode': providerCode,
                                                            'ProviderLocatorCode': locatorCode,
                                                            'UniversalLocatorCode': universallocatorCode
                                                        },
                                                    },
                                                    'air:AirSolution': {
                                                        'air:SearchTraveler': seattravelerparse,
                                                        'air:AirSegment': segmentreservation
                                                    },
                                                    'air:OptionalServices': {
                                                        '$': {
                                                            'xmlns:common_v52_0': 'http://www.travelport.com/schema/common_v52_0'
                                                        },
                                                        'air:OptionalServicesTotal': '',
                                                        'air:OptionalService': mergedArray
                                                    }
                                                }
                                            }
                                        }
                                    });
                                    console.log('1', MerchandisingrequestXML1);
                                    try {
                                        const Merchandisingresponse = await axios.post(`${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightAirServiceRequest`, MerchandisingrequestXML1, {
                                            headers: {
                                                'Content-Type': 'text/xml',
                                                'Authorization': authHeader,
                                            },
                                        });
                                        const MerchandisingResponse = Merchandisingresponse.data;


                                    } catch (error) {
                                        console.error(error);
                                        // ErrorLogger.logError('merchandising_api',MerchandisingrequestXML1,error);
                                    }
                                };
                                makeMerchandisingRequest();
                            } else if (serviceoptions && serviceoptions.length > 0) {
                                const makeMerchandisingRequest = async () => {
                                    const username = 'Universal API/uAPI8645980109-af7494fa';
                                    const password = 'N-k29Z}my5';
                                    const authHeader = `Basic ${btoa(`${username}:${password}`)}`
                                    const mergedArray = [...serviceoptions];

                                    const builder = require('xml2js').Builder;
                                    var MerchandisingrequestXML2 = new builder().buildObject({
                                        'soap:Envelope': {
                                            '$': {
                                                'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/'
                                            },
                                            'soap:Header': {

                                            },
                                            'soap:Body': {
                                                '$': {
                                                    'xmlns:air': 'http://www.travelport.com/schema/air_v52_0',
                                                    'xmlns:com': 'http://www.travelport.com/schema/common_v52_0',
                                                    'xmlns:univ': 'http://www.travelport.com/schema/universal_v52_0'
                                                },
                                                'univ:AirMerchandisingFulfillmentReq': {
                                                    '$': {
                                                        'TargetBranch': Targetbranch
                                                    },
                                                    'com:BillingPointOfSaleInfo': {
                                                        '$': {
                                                            'OriginApplication': 'UAPI'
                                                        },
                                                    },
                                                    'air:HostReservation': {
                                                        '$': {
                                                            'Carrier': 'UK',
                                                            'CarrierLocatorCode': pnrCode,
                                                            'ProviderCode': providerCode,
                                                            'ProviderLocatorCode': locatorCode,
                                                            'UniversalLocatorCode': universallocatorCode
                                                        },
                                                    },
                                                    'air:AirSolution': {
                                                        'air:SearchTraveler': seattravelerparse,
                                                        'air:AirSegment': segmentreservation
                                                    },
                                                    'air:OptionalServices': {
                                                        '$': {
                                                            'xmlns:common_v52_0': 'http://www.travelport.com/schema/common_v52_0'
                                                        },
                                                        'air:OptionalServicesTotal': '',
                                                        'air:OptionalService': mergedArray
                                                    }
                                                }
                                            }
                                        }
                                    });

                                    console.log('2', MerchandisingrequestXML2);


                                    try {
                                        const Merchandisingresponse = await axios.post(`${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightAirServiceRequest`, MerchandisingrequestXML2, {
                                            headers: {
                                                'Content-Type': 'text/xml',
                                                'Authorization': authHeader,
                                            },
                                        });
                                        const MerchandisingResponse = Merchandisingresponse.data;


                                    } catch (error) {
                                        console.error(error);
                                        // ErrorLogger.logError('merchandising_api',MerchandisingrequestXML2,error);
                                    }
                                };
                                makeMerchandisingRequest();
                            }

                        } else {
                            const error = reservationresult['SOAP:Envelope']['SOAP:Body']['SOAP:Fault']['faultstring'];
                            // ErrorLogger.logError('flight_reservation_api1',modifiedXmlString,error);
                            navigate('/tryagainlater');
                        }


                    });
                } catch (error) {

                    // ErrorLogger.logError('flight_reservation_api2','Error',error);
                    navigate('/tryagainlater');
                }
                finally {
                    setLoading(false);
                }
            };
            makeReservationRequest();
            // setLoading(false);
        }
    }

    const navigate = useNavigate();

    const handlePassengerSubmit = async (event) => {
        setSeatloading(true);
        event.preventDefault();
        const email = event.target.email.value.trim();
        const contactDetails = event.target.contact_details.value.trim();
        let address = event.target.address ? event.target.address.value.trim() : "NA";
        let street = event.target.street ? event.target.street.value.trim() : "NA";
        let city = event.target.city ? event.target.city.value.trim() : "NA";
        let state = event.target.state ? event.target.state.value.trim() : "NA";
        let postal_code = event.target.postal_code ? event.target.postal_code.value.trim() : "NA";
        let country = event.target.country ? event.target.country.value.trim() : "NA";

        let GSTIN = event.target.gst_registration_no.value.trim();
        let company_gst_name = event.target.company_gst_name.value.trim();
        let company_gst_address = event.target.company_gst_address.value.trim();
        let company_gst_contact = event.target.company_gst_contact.value.trim();

        const gstFormDetails = {
            GSTIN,
            company_gst_name,
            company_gst_address,
            company_gst_contact
        }

        setClientFormGST(gstFormDetails);

        let isValidPassenger = true;

        if (!email) {
            isValidPassenger = false;
            const emailError = document.querySelector('.email-message');
            emailError.style.display = 'block';
        } else {
            const emailError = document.querySelector('.email-message');
            emailError.style.display = 'none';
        }

        if (!contactDetails) {
            isValidPassenger = false;
            const contactDetailsError = document.querySelector('.contact_details-message');
            contactDetailsError.style.display = 'block';
        } else {
            const contactDetailsError = document.querySelector('.contact_details-message');
            contactDetailsError.style.display = 'none';
        }
        if (!address) {
            address = 'NA';
        }
        if (!street) {
            street = 'NA';
        }
        if (!city) {
            city = 'NA';
        }
        if (!state) {
            state = 'NA';
        }
        if (!postal_code) {
            postal_code = 'NA';
        }
        if (!country) {
            country = 'IN';
        }
        const { isValid, updatepassengerarray } = validateSavePassenger(Passengerarray);
        setupdatepassengerarray(updatepassengerarray);
        if (isValid && isValidPassenger) {
            setAccordion2Expanded(false);

            const formData = new FormData(event.target);
            const passengerKeys = Array.from(formData.getAll('passengerkey[]'));
            const passengerCode = Array.from(formData.getAll('passengercode[]'));
            const passengerFirstNames = Array.from(formData.getAll('adult_first_name[]'));
            // console.log('passengerFirstNames',passengerFirstNames);
            const passengerLastNames = Array.from(formData.getAll('adult_last_name[]'));
            const passengerAgeNames = Array.from(formData.getAll('adult_age[]'));
            const passengerGenderNames = Array.from(formData.getAll('adult_gender[]'));
            // const passengeremail = Array.from(formData.getAll('email'));
            // const passengercontact = Array.from(formData.getAll('contact_details'));

            const passengerNamesWithPrefix = passengerGenderNames.map(gender => {
                if (gender === 'F') {
                    return 'Miss';
                } else {
                    return 'Mr';
                }
            });
            const passengerEmail = event.target.email.value;
            const passengerContactNo = event.target.contact_details.value;
            const passengerAddress = address;
            const passengerStreet = street;
            const passengerCity = city;
            const passengerState = state;
            const passengerPostalCode = postal_code;
            const passengerCountry = country;
            const passengerDetails = {
                keys: passengerKeys,
                codes: passengerCode,
                firstNames: passengerFirstNames,
                lastNames: passengerLastNames,
                ageNames: passengerAgeNames,
                genderNames: passengerGenderNames,
                namesWithPrefix: passengerNamesWithPrefix,
                email: passengerEmail,
                contactNo: passengerContactNo,
                address: passengerAddress,
                street: passengerStreet,
                city: passengerCity,
                state: passengerState,
                postalCode: passengerPostalCode,
                country: passengerCountry
            };
            // console.log('passengerDetails',passengerDetails);
            const passenger_details = passengerDetails.firstNames.map((firstName, index) => ({
                name: firstName,
                contact: passengerDetails.contactNo, // Assuming the same contact applies to all
                email: passengerDetails.email, // Assuming the same email applies to all
            }));
            if (formtaxivaxi['search_query_id']) {
                const requestData = {
                    access_token,
                    clientid, // Ensure this variable is defined somewhere
                    search_query_id: formtaxivaxi['search_query_id'],
                    passenger_details,
                };

                console.log("requestData", requestData);

                // Define the async function
                const addSearchQueryAsBooking = async () => {
                    try {
                        const response = await axios.post(
                            `${CONFIG.MAIN_API}/api/flights/addSearchQueryAsBooking`,
                            requestData
                        );
                        console.log("API Response:", response.data);
                    } catch (error) {
                        console.error("Error calling API:", error);
                    }
                };

                // Call the async function
                addSearchQueryAsBooking();
            }


            setPassengers(passengerDetails);
            const passengerDetailss = {
                keys: [],
                codes: [],
                firstNames: [],
                lastNames: [],
                gender: [],
                age: [],
                contact: [],
                email: []
            };

            for (let i = 0; i < passengerKeys.length; i++) {
                if (passengerCode[i] !== "INF") {
                    passengerDetailss.keys.push(passengerKeys[i]);
                    passengerDetailss.codes.push(passengerCode[i]);
                    passengerDetailss.firstNames.push(passengerFirstNames[i]);
                    passengerDetailss.lastNames.push(passengerLastNames[i]);
                    passengerDetailss.gender.push(passengerGenderNames[i]);
                    passengerDetailss.email.push(passengerEmail[i]);
                    passengerDetailss.contact.push(passengerContactNo[i]);
                    passengerDetailss.age.push(passengerAgeNames[i]);
                }
            }
            const passengerDetailssString = JSON.stringify(passengerDetailss);
            sessionStorage.setItem('passengerDetailss', passengerDetailssString);
            const passengerAges = passengerAgeNames.map(calculateAge);
            // const capitalizeFirstLetter = (str) => {
            //     return str.replace(/\b\w/g, (char) => char.toUpperCase());
            //   };
            const formattedDetails = passengerDetails.keys.map((key, index) => {
                const firstName = passengerFirstNames[index];
                const lastName = passengerLastNames[index];
                const email = passengerEmail;  // Handle cases where email might be missing
                const contactNo = passengerContactNo;
                return `
                    <div style="border-bottom: 1px solid #ddd; padding: 10px; font-size: 13px; color: #555;">
        <div style="font-weight: bold; font-size: 14px; color: #333; margin-bottom: 5px;">
            Passenger ${index + 1}
        </div>
        <div style="display: flex; gap: 50px;"> 
            <div style="width: 100px; font-weight: 600;">Name:</div>
            <div style="flex: 1;">${firstName} ${lastName} ${passengerGenderNames[index] === 'F' ? '(Female)' : '(Male)'}</div>
        </div>
        <div style="display: flex; gap: 50px;">
            <div style="width: 100px; font-weight: 600;">Email:</div>
            <div style="flex: 1;">${email}</div>
        </div>
        <div style="display: flex; gap: 50px;">
            <div style="width: 100px; font-weight: 600;">Contact No:</div>
            <div style="flex: 1;">${contactNo}</div>
        </div>
    </div>
                `;
            }).join('<br><br>');

            setLoading(false);
            Swal.fire({
                title: 'Review Details',
                html: `
                    <div class="review-details" style={{fontSize:'11px',fontFamily:'Montserrat',textAlign:'left'}}>Please ensure that the spelling of your name and other details match with your travel document/govt. ID, as these cannot be changed later. Errors might lead to cancellation penalties.</div>
                    <br>
                    <div class="review-passenger-details" style={{fontSize:'13px',fontFamily:'Montserrat',textAlign:'left'}}>${formattedDetails}</div>
                    <br>
                `,
                showCancelButton: true,
                confirmButtonText: 'Confirm',
                cancelButtonText: 'Edit',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    setLoading(true);
                    const makeSeatRequest = async () => {
                        const username = 'Universal API/uAPI8645980109-af7494fa';
                        const password = 'N-k29Z}my5';
                        const authHeader = `Basic ${btoa(`${username}:${password}`)}`

                        const builder = require('xml2js').Builder;
                        var seatMapRequestXML = new builder().buildObject({
                            'soap:Envelope': {
                                '$': {
                                    'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/'
                                },
                                'soap:Body': {
                                    '$': {
                                        'xmlns:air': 'http://www.travelport.com/schema/air_v52_0',
                                        'xmlns:com': 'http://www.travelport.com/schema/common_v52_0'
                                    },
                                    'air:SeatMapReq': {
                                        '$': {
                                            'TraceId': 'ac191f0b9c0546659065f29389eae552',
                                            'AuthorizedBy': 'TAXIVAXI',
                                            'TargetBranch': Targetbranch,
                                            'ReturnSeatPricing': 'true',
                                            'ReturnBrandingInfo': 'true'
                                        },
                                        'com:BillingPointOfSaleInfo': {
                                            '$': {
                                                'OriginApplication': 'UAPI',
                                            },
                                        },
                                        'air:AirSegment': segmentParse,
                                        'com:HostToken': hostTokenParse,
                                        'air:SearchTraveler': passengerDetailss.keys.map((key, index) => ({
                                            '$': {
                                                'Code': passengerCode[index],
                                                'Age': passengerAges[index],
                                                'Key': key
                                            },
                                            'com:Name': {
                                                '$': {
                                                    'Prefix': passengerGenderNames[index] === 'F' ? 'Miss' : 'Mr',
                                                    'First': passengerFirstNames[index],
                                                    'Last': passengerLastNames[index]
                                                }
                                            }
                                        }))
                                    }
                                }
                            }
                        });
                        console.log('seatMapRequestXML', seatMapRequestXML);

                        try {

                            const seatresponse = await axios.post(`${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightAirServiceRequest`, seatMapRequestXML, {
                                headers: {
                                    'Content-Type': 'text/xml',
                                    'Authorization': authHeader,
                                },
                            });
                            const seatResponse = seatresponse.data;
                            console.log('seatResponse', seatResponse);

                            parseString(seatResponse, { explicitArray: false }, (err, seatresult) => {
                                if (err) {
                                    console.error('Error parsing XML:', err);
                                    return;
                                }
                                const AirSeatRsp = seatresult['SOAP:Envelope']['SOAP:Body']['air:SeatMapRsp'];

                                if (AirSeatRsp !== null && AirSeatRsp !== undefined) {
                                    const seatResponse = seatresult['SOAP:Envelope']['SOAP:Body']['air:SeatMapRsp']['air:AirSegment'];
                                    const seatRows = seatresult['SOAP:Envelope']['SOAP:Body']['air:SeatMapRsp']['air:Rows'];
                                    const seatTraveler = seatresult['SOAP:Envelope']['SOAP:Body']['air:SeatMapRsp']['air:SearchTraveler'];
                                    let seatOptional = [];
                                    if (seatresult?.['SOAP:Envelope']?.['SOAP:Body']?.['air:SeatMapRsp']?.['air:OptionalServices']?.['air:OptionalService']) {
                                        seatOptional = seatresult['SOAP:Envelope']['SOAP:Body']['air:SeatMapRsp']['air:OptionalServices']['air:OptionalService'];
                                    }

                                    setseatrowsparse(Array.isArray(seatRows) ? seatRows : [seatRows]);
                                    setseatresponseparse(Array.isArray(seatResponse) ? seatResponse : [seatResponse]);
                                    setseattravelerparse(Array.isArray(seatTraveler) ? seatTraveler : [seatTraveler]);
                                    setseatOptionalparse(Array.isArray(seatOptional) ? seatOptional : [seatOptional]);
                                } else {
                                    const error = seatresult['SOAP:Envelope']['SOAP:Body']['SOAP:Fault']['faultstring'];
                                    // ErrorLogger.logError('seatmap_api',seatMapRequestXML,error);
                                    if (seatresult['SOAP:Envelope']['SOAP:Body']['SOAP:Fault']['detail']['common_v52_0:ErrorInfo']['common_v52_0:Code'] === '101') {
                                        Swal.fire({
                                            title: 'Seat Selection Not Available',
                                            // text: 'Seat Selection Not Available',
                                            // icon: 'info',
                                            confirmButtonText: 'OK'
                                        });
                                        setemptyseatmap(true);
                                    } else {
                                        setFlighterrors(error);
                                    }
                                    // setFlighterrors(error);
                                }


                            });
                        } catch (error) {
                            // ErrorLogger.logError('seatmap_api','error',error);
                            navigate('/tryagainlater');
                        }
                        finally {
                            setLoading(false);
                            setAccordion3Expanded(true);
                            setAccordion4Expanded(true);
                        }
                    };

                    makeSeatRequest();
                } else {
                    Swal.fire(
                        'Please confirm details',
                        setAccordion1Expanded(true),
                        setAccordion2Expanded(true),
                        setAccordion5Expanded(true),
                    );
                }
            });


        } else {
            setAccordion1Expanded(true);
        }
    }

    const validateSavePassenger = (Passengerarray) => {
        // console.log('Passengerarray', Passengerarray);
        let isValid = true;

        const updatepassengerarray = Passengerarray.map((passengerinfo, passengerindex) => {
            const firstName = document.querySelector(`input[name="adult_first_name[]"][data-index="${passengerindex}"]`).value;
            // console.log('firstName', firstName);
            const email1 = document.querySelector(`input[name="email1"][data-index="${passengerindex}"]`).value;
            // console.log('email1', email1); 
            const cnct = document.querySelector(`input[name="contact_details1"][data-index="${passengerindex}"]`).value;
            // console.log('cnct', cnct); 
            const lastName = document.querySelector(`input[name="adult_last_name[]"][data-index="${passengerindex}"]`).value;
            const birthdate = document.querySelector(`input[name="adult_age[]"][data-index="${passengerindex}"]`).value;
            const gender = document.querySelector(`select[name="adult_gender[]"][data-index="${passengerindex}"]`).value;
            const age = calculateAge(birthdate);
            // console.log('age', age);

            if (firstName.trim() === '') {
                isValid = false;
                const firstNameError = document.querySelector(`.adult_first_name-message[data-index="${passengerindex}"]`);
                firstNameError.style.display = 'block';
            } else {
                const firstNameError = document.querySelector(`.adult_first_name-message[data-index="${passengerindex}"]`);
                firstNameError.style.display = 'none';
            }

            if (lastName.trim() === '') {
                isValid = false;
                const lastNameError = document.querySelector(`.adult_last_name-message[data-index="${passengerindex}"]`);
                lastNameError.style.display = 'block';
            } else {
                const lastNameError = document.querySelector(`.adult_last_name-message[data-index="${passengerindex}"]`);
                lastNameError.style.display = 'none';
            }

            // if (passengerinfo.Code === 'ADT' && !(age >= 12)) {
            //     isValid = false;
            //     const ageError1 = document.querySelector(`.adult_age-message1[data-index="${passengerindex}"]`);
            //     ageError1.style.display = 'block';
            // } else if (passengerinfo.Code === 'CNN' && !(age >= 2 && age <= 12)) {
            //     isValid = false;
            //     const ageError2 = document.querySelector(`.adult_age-message2[data-index="${passengerindex}"]`);
            //     ageError2.style.display = 'block';
            // } else if (passengerinfo.Code === 'INF' && !(age >= 0 && age <= 2)) {
            //     isValid = false;
            //     const ageError3 = document.querySelector(`.adult_age-message3[data-index="${passengerindex}"]`);
            //     ageError3.style.display = 'block';
            // } else if (birthdate.trim() === '') {
            //     isValid = false;
            //     const ageError = document.querySelector(`.adult_age-message[data-index="${passengerindex}"]`);
            //     ageError.style.display = 'block';
            // } else {
            //     const ageError = document.querySelector(`.adult_age-message[data-index="${passengerindex}"]`);
            //     const ageError1 = document.querySelector(`.adult_age-message1[data-index="${passengerindex}"]`);
            //     const ageError2 = document.querySelector(`.adult_age-message2[data-index="${passengerindex}"]`);
            //     const ageError3 = document.querySelector(`.adult_age-message3[data-index="${passengerindex}"]`);
            //     ageError.style.display = 'none';
            //     ageError1.style.display = 'none';
            //     ageError2.style.display = 'none';
            //     ageError3.style.display = 'none';
            // }

            if (isValid) {
                return {
                    ...passengerinfo,
                    adult_first_name: firstName,
                    adult_last_name: lastName,
                    adult_age: age,
                    adult_gender: gender,
                };
            } else {
                return passengerinfo;
            }
        });

        return { isValid, updatepassengerarray };

    };

    const handleSavePassenger = () => {
        const { isValid, updatepassengerarray } = validateSavePassenger(Passengerarray);
        if (isValid) {
            setAccordion1Expanded(false);
            setAccordion5Expanded(true);
        }
    };
    const handleSavePassenger2 = () => {
        // const {isValid, updatepassengerarray } = validateSavePassenger(Passengerarray);
        // if (isValid) {
        setAccordion5Expanded(false);
        setAccordion2Expanded(true);
        // }
    };

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === seatresponseparse.length - 1 ? 0 : prevIndex + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? seatresponseparse.length - 1 : prevIndex - 1));
    };

    const [passengereventindexs, setPassengereventindexs] = useState(0);
    const handlePassengerevent = (key, index) => {
        setPassengerkey(key);
        setPassengereventindexs(index);
    }

    const [seatcodeselected, setseatcodeselected] = useState(null);
    const [seatpassengerselected, setseatpassengerselected] = useState(null);
    const [seatsegmentselected, setseatsegmentselected] = useState(null);
    const [seatoptionalkeyselected, setseatoptionalkeyselected] = useState(null);
    const [previousSelections, setPreviousSelections] = useState([]);
    // console.log('previousSelections',previousSelections);

    const handleseatSelectiondisplay = (seatpassenger, seatsegment, seatcode, optionalservicekey) => {
        setCurrentIndex((prevIndex) => (prevIndex === seatresponseparse.length - 1 ? 0 : prevIndex + 1));
        // console.log('seat detail ', seatpassenger, seatsegment, seatcode, optionalservicekey);
        setseatcodeselected(seatcode);
        setseatpassengerselected(seatpassenger);
        setseatsegmentselected(seatsegment);
        setseatoptionalkeyselected(optionalservicekey);
        const radioButton = document.getElementById(`${seatpassenger} ${seatsegment} ${seatcode}`);

        if (radioButton) {
            radioButton.checked = !radioButton.checked;

            if (!radioButton.checked) {
                // const indexToRemove = previousSelections.findIndex(selection => selection.passenger === seatpassenger && selection.segment === seatsegment && selection.code === seatcode);
                // if (indexToRemove !== -1) {
                setPreviousSelections(previousSelections.filter(selection => !(selection.passenger === seatpassenger && selection.segment === seatsegment && selection.code === seatcode)));
                // }
            }
        }


    };


    useEffect(() => {

        if (
            seatcodeselected !== null &&
            seatpassengerselected !== null &&
            seatsegmentselected !== null &&
            seatoptionalkeyselected !== null
        ) {

            const existingIndex = previousSelections.findIndex(
                selection => selection.passenger === seatpassengerselected && selection.segment === seatsegmentselected
            );

            if (existingIndex !== -1) {

                const updatedSelections = [...previousSelections];
                updatedSelections[existingIndex].code = seatcodeselected;
                updatedSelections[existingIndex].optionalkey = seatoptionalkeyselected;
                setPreviousSelections(updatedSelections);
            } else {

                setPreviousSelections(prevSelections => [
                    ...prevSelections,
                    { passenger: seatpassengerselected, segment: seatsegmentselected, code: seatcodeselected, optionalkey: seatoptionalkeyselected }
                ]);
            }
        }
    }, [seatcodeselected, seatpassengerselected, seatsegmentselected, seatoptionalkeyselected]);

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

    var sessionData = () => {
        (async () => {
            try {
                const keys = Object.keys(sessionStorage);
                const allData = {};
                keys.forEach(key => {
                    const value = sessionStorage.getItem(key);
                    allData[key] = value;
                });
                // console.log(allData);

                const soapEnvelope = allData.searchdata;
                const username = 'Universal API/uAPI8645980109-af7494fa';
                const password = 'N-k29Z}my5';
                const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

                const eresponse = await axios.post(`${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightAirServiceRequest`, soapEnvelope);

                const eResponse = eresponse.data;

                parseString(eResponse, { explicitArray: false }, (err, result) => {
                    if (err) {
                        console.error('Error parsing XML:', err);
                        return;
                    }
                    const lowFareSearchRsp = result['SOAP:Envelope']['SOAP:Body']['air:LowFareSearchRsp'];
                    if (lowFareSearchRsp !== null && lowFareSearchRsp !== undefined) {
                        const pricepointlist = result['SOAP:Envelope']['SOAP:Body']['air:LowFareSearchRsp']['air:AirPricePointList']['air:AirPricePoint'];
                        const Segmentlist = result['SOAP:Envelope']['SOAP:Body']['air:LowFareSearchRsp']['air:AirSegmentList']['air:AirSegment'];
                        const FlightOptions = Array.isArray(pricepointlist) ? pricepointlist : [pricepointlist];
                        const foundItem = FlightOptions.filter(item => item.$.TotalPrice === allData.SearchPriceTotalPrice);
                        const segmentArray = [];
                        // console.log(foundItem);
                        if (foundItem.length > 0) {
                            foundItem.forEach(foundItemoptioninfo => {
                                if (Array.isArray(foundItemoptioninfo['air:AirPricingInfo'])) {
                                    foundItemoptioninfo['air:AirPricingInfo'].forEach(pricingoptioninfo => {
                                        if (Array.isArray(pricingoptioninfo['air:FlightOptionsList']['air:FlightOption'])) {
                                            pricingoptioninfo['air:FlightOptionsList']['air:FlightOption'].forEach(flightoptioninfo => {
                                                if (Array.isArray(flightoptioninfo['air:Option'])) {
                                                    if (Array.isArray(flightoptioninfo['air:Option']['0']['air:BookingInfo'])) {
                                                        flightoptioninfo['air:Option']['0']['air:BookingInfo'].forEach(bookingoptioninfo => {
                                                            const segmentrefkey = bookingoptioninfo['$']['SegmentRef'];
                                                            const segmentfoundItem = Segmentlist.find(item => item.$.Key === segmentrefkey);
                                                            segmentArray.push(segmentfoundItem);
                                                        });
                                                    } else {
                                                        const segmentrefkey = flightoptioninfo['air:Option']['0']['air:BookingInfo']['$']['SegmentRef'];
                                                        const segmentfoundItem = Segmentlist.find(item => item.$.Key === segmentrefkey);
                                                        segmentArray.push(segmentfoundItem);
                                                    }
                                                } else {
                                                    if (Array.isArray(flightoptioninfo['air:Option']['air:BookingInfo'])) {
                                                        flightoptioninfo['air:Option']['air:BookingInfo'].forEach(bookingoptioninfo => {
                                                            const segmentrefkey = bookingoptioninfo['$']['SegmentRef'];
                                                            const segmentfoundItem = Segmentlist.find(item => item.$.Key === segmentrefkey);
                                                            segmentArray.push(segmentfoundItem);
                                                        });
                                                    } else {
                                                        const segmentrefkey = flightoptioninfo['air:Option']['air:BookingInfo']['$']['SegmentRef'];
                                                        const segmentfoundItem = Segmentlist.find(item => item.$.Key === segmentrefkey);
                                                        segmentArray.push(segmentfoundItem);
                                                    }
                                                }

                                            });
                                        }
                                        else {
                                            if (Array.isArray(pricingoptioninfo['air:FlightOptionsList']['air:FlightOption']['air:Option'])) {
                                                if (Array.isArray(pricingoptioninfo['air:FlightOptionsList']['air:FlightOption']['air:Option']['0']['air:BookingInfo'])) {
                                                    pricingoptioninfo['air:FlightOptionsList']['air:FlightOption']['air:Option']['0']['air:BookingInfo'].forEach(bookingoptioninfo => {
                                                        const segmentrefkey = bookingoptioninfo['$']['SegmentRef'];
                                                        const segmentfoundItem = Segmentlist.find(item => item.$.Key === segmentrefkey);
                                                        segmentArray.push(segmentfoundItem);
                                                    });
                                                } else {
                                                    const segmentrefkey = pricingoptioninfo['air:FlightOptionsList']['air:FlightOption']['air:Option']['0']['air:BookingInfo']['$']['SegmentRef'];
                                                    const segmentfoundItem = Segmentlist.find(item => item.$.Key === segmentrefkey);
                                                    segmentArray.push(segmentfoundItem);
                                                }
                                            } else {
                                                if (Array.isArray(pricingoptioninfo['air:FlightOptionsList']['air:FlightOption']['air:Option']['air:BookingInfo'])) {
                                                    pricingoptioninfo['air:FlightOptionsList']['air:FlightOption']['air:Option']['air:BookingInfo'].forEach(bookingoptioninfo => {
                                                        const segmentrefkey = bookingoptioninfo['$']['SegmentRef'];
                                                        const segmentfoundItem = Segmentlist.find(item => item.$.Key === segmentrefkey);
                                                        segmentArray.push(segmentfoundItem);
                                                    });
                                                } else {
                                                    const segmentrefkey = pricingoptioninfo['air:FlightOptionsList']['air:FlightOption']['air:Option']['air:BookingInfo']['$']['SegmentRef'];
                                                    const segmentfoundItem = Segmentlist.find(item => item.$.Key === segmentrefkey);
                                                    segmentArray.push(segmentfoundItem);
                                                }
                                            }

                                        }
                                    });
                                } else {
                                    if (Array.isArray(foundItemoptioninfo['air:AirPricingInfo']['air:FlightOptionsList']['air:FlightOption'])) {
                                        foundItemoptioninfo['air:AirPricingInfo']['air:FlightOptionsList']['air:FlightOption'].forEach(flightoptioninfo => {
                                            if (Array.isArray(flightoptioninfo['air:Option'])) {
                                                if (Array.isArray(flightoptioninfo['air:Option']['0']['air:BookingInfo'])) {
                                                    flightoptioninfo['air:Option']['0']['air:BookingInfo'].forEach(bookingoptioninfo => {
                                                        const segmentrefkey = bookingoptioninfo['$']['SegmentRef'];
                                                        const segmentfoundItem = Segmentlist.find(item => item.$.Key === segmentrefkey);
                                                        segmentArray.push(segmentfoundItem);
                                                    });
                                                } else {
                                                    const segmentrefkey = flightoptioninfo['air:Option']['0']['air:BookingInfo']['$']['SegmentRef'];
                                                    const segmentfoundItem = Segmentlist.find(item => item.$.Key === segmentrefkey);
                                                    segmentArray.push(segmentfoundItem);
                                                }
                                            } else {
                                                if (Array.isArray(flightoptioninfo['air:Option']['air:BookingInfo'])) {
                                                    flightoptioninfo['air:Option']['air:BookingInfo'].forEach(bookingoptioninfo => {
                                                        const segmentrefkey = bookingoptioninfo['$']['SegmentRef'];
                                                        const segmentfoundItem = Segmentlist.find(item => item.$.Key === segmentrefkey);
                                                        segmentArray.push(segmentfoundItem);
                                                    });
                                                } else {
                                                    const segmentrefkey = flightoptioninfo['air:Option']['air:BookingInfo']['$']['SegmentRef'];
                                                    const segmentfoundItem = Segmentlist.find(item => item.$.Key === segmentrefkey);
                                                    segmentArray.push(segmentfoundItem);
                                                }
                                            }
                                        });
                                    }
                                    else {
                                        if (Array.isArray(foundItemoptioninfo['air:AirPricingInfo']['air:FlightOptionsList']['air:FlightOption']['air:Option'])) {
                                            if (Array.isArray(foundItemoptioninfo['air:AirPricingInfo']['air:FlightOptionsList']['air:FlightOption']['air:Option']['0']['air:BookingInfo'])) {
                                                foundItemoptioninfo['air:AirPricingInfo']['air:FlightOptionsList']['air:FlightOption']['air:Option']['0']['air:BookingInfo'].forEach(bookingoptioninfo => {
                                                    const segmentrefkey = bookingoptioninfo['$']['SegmentRef'];
                                                    const segmentfoundItem = Segmentlist.find(item => item.$.Key === segmentrefkey);
                                                    segmentArray.push(segmentfoundItem);
                                                });
                                            } else {
                                                const segmentrefkey = foundItemoptioninfo['air:AirPricingInfo']['air:FlightOptionsList']['air:FlightOption']['air:Option']['0']['air:BookingInfo']['$']['SegmentRef'];
                                                const segmentfoundItem = Segmentlist.find(item => item.$.Key === segmentrefkey);
                                                segmentArray.push(segmentfoundItem);
                                            }
                                        } else {
                                            if (Array.isArray(foundItemoptioninfo['air:AirPricingInfo']['air:FlightOptionsList']['air:FlightOption']['air:Option']['air:BookingInfo'])) {
                                                foundItemoptioninfo['air:AirPricingInfo']['air:FlightOptionsList']['air:FlightOption']['air:Option']['air:BookingInfo'].forEach(bookingoptioninfo => {
                                                    const segmentrefkey = bookingoptioninfo['$']['SegmentRef'];
                                                    const segmentfoundItem = Segmentlist.find(item => item.$.Key === segmentrefkey);
                                                    segmentArray.push(segmentfoundItem);
                                                });
                                            } else {
                                                const segmentrefkey = foundItemoptioninfo['air:AirPricingInfo']['air:FlightOptionsList']['air:FlightOption']['air:Option']['air:BookingInfo']['$']['SegmentRef'];
                                                const segmentfoundItem = Segmentlist.find(item => item.$.Key === segmentrefkey);
                                                segmentArray.push(segmentfoundItem);
                                            }
                                        }
                                    }
                                }
                            });
                            const segmentArrayjson = JSON.parse(sessionStorage.getItem('segmentarray'));

                            const resultArray = [];

                            for (const item1 of segmentArray) {
                                for (const item2 of segmentArrayjson) {
                                    if (item1.$.Origin === item2.$.Origin && item1.$.Destination === item2.$.Destination) {
                                        if (item1.$.Carrier === item2.$.Carrier && item1.$.FlightNumber === item2.$.FlightNumber) {
                                            resultArray.push(item1);
                                        }
                                    }
                                }
                            }

                            resultArray.forEach(segment => {
                                if (segment['$']) {
                                    segment['$'].ProviderCode = providerCode;
                                }
                                delete segment['air:FlightDetailsRef'];
                            });

                            for (let i = 0; i < resultArray.length; i++) {
                                let currentSegment = resultArray[i];
                                for (let j = i + 1; j < resultArray.length; j++) {
                                    const nextSegment = resultArray[j];
                                    if (currentSegment.$.Group === nextSegment.$.Group) {
                                        currentSegment['air:Connection'] = "";
                                        currentSegment = resultArray[j];
                                        break;
                                    }
                                }
                            }
                            const passengerKeysXmljson = JSON.parse(sessionStorage.getItem('passengerKeysXml'));
                            const makeSoapRequest = async () => {
                                const username = 'Universal API/uAPI8645980109-af7494fa';
                                const password = 'N-k29Z}my5';
                                const authHeader = `Basic ${btoa(`${username}:${password}`)}`
                                const builder = require('xml2js').Builder;
                                var pricepointXML = new builder().buildObject({
                                    'soap:Envelope': {
                                        '$': {
                                            'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/'
                                        },
                                        'soap:Body': {
                                            'air:AirPriceReq': {
                                                '$': {
                                                    'AuthorizedBy': 'TAXIVAXI',
                                                    'TargetBranch': Targetbranch,
                                                    'FareRuleType': 'short',
                                                    'TraceId': 'TVSBP001',
                                                    'xmlns:air': 'http://www.travelport.com/schema/air_v52_0',
                                                    'xmlns:com': 'http://www.travelport.com/schema/common_v52_0'
                                                },
                                                'BillingPointOfSaleInfo': {
                                                    '$': {
                                                        'OriginApplication': 'UAPI',
                                                        'xmlns': 'http://www.travelport.com/schema/common_v52_0'
                                                    },
                                                },
                                                'air:AirItinerary': {
                                                    'air:AirSegment': resultArray
                                                },
                                                'air:AirPricingModifiers': {
                                                    '$': {
                                                        'InventoryRequestType': 'DirectAccess',
                                                        'ETicketability': 'Yes',
                                                        'FaresIndicator': "AllFares"
                                                    },
                                                    'air:PermittedCabins': {
                                                        'com:CabinClass': {
                                                            '$': {
                                                                'Type': allData.classType,
                                                            },
                                                        },
                                                    },
                                                    'air:BrandModifiers': {
                                                        'air:FareFamilyDisplay': {
                                                            '$': {
                                                                'ModifierType': 'FareFamily',
                                                            },
                                                        },
                                                    },
                                                },
                                                'com:SearchPassenger': passengerKeysXmljson,
                                                'air:AirPricingCommand': ''
                                            }
                                        }
                                    }
                                });

                                try {
                                    const priceresponse = await axios.post(`${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightAirServiceRequest`, pricepointXML, {
                                        headers: {
                                            'Content-Type': 'text/xml',
                                            'Authorization': authHeader,
                                        },
                                    });
                                    const priceResponse = priceresponse.data;
                                    parseString(priceResponse, { explicitArray: false }, (err, priceresult) => {
                                        if (err) {
                                            console.error('Error parsing XML:', err);
                                            return;
                                        }
                                        const AirPriceRsp = priceresult['SOAP:Envelope']['SOAP:Body']['air:AirPriceRsp'];

                                        if (AirPriceRsp !== null && AirPriceRsp !== undefined) {
                                            const pricereponseArray = priceresult['SOAP:Envelope']['SOAP:Body']['air:AirPriceRsp']['air:AirPriceResult']['air:AirPricingSolution'];
                                            const pricereponse = Array.isArray(pricereponseArray) ? pricereponseArray : [pricereponseArray];
                                            const SegmentParseArray = priceresult['SOAP:Envelope']['SOAP:Body']['air:AirPriceRsp']['air:AirItinerary']['air:AirSegment'];
                                            const SegmentParse = Array.isArray(SegmentParseArray) ? SegmentParseArray : [SegmentParseArray];
                                            const selectedPackage = pricereponse.find(item => item.$.TotalPrice === allData.packageselectedPrice);

                                            const airPricingInfo = selectedPackage['air:AirPricingInfo'];
                                            const combinedArray = [];
                                            if (Array.isArray(airPricingInfo)) {
                                                if (Array.isArray(airPricingInfo[0]['air:BookingInfo'])) {
                                                    airPricingInfo[0]['air:BookingInfo'].forEach(bookinginfo => {
                                                        combinedArray.push({
                                                            segmentRef: bookinginfo['$']['SegmentRef'],
                                                            hostTokenRef: bookinginfo['$']['HostTokenRef']
                                                        });
                                                    });
                                                } else {
                                                    combinedArray.push({
                                                        segmentRef: airPricingInfo[0]['air:BookingInfo']['$']['SegmentRef'],
                                                        hostTokenRef: airPricingInfo[0]['air:BookingInfo']['$']['HostTokenRef']
                                                    });
                                                }
                                            } else {
                                                if (Array.isArray(airPricingInfo['air:BookingInfo'])) {
                                                    airPricingInfo['air:BookingInfo'].forEach(bookinginfo => {
                                                        combinedArray.push({
                                                            segmentRef: bookinginfo['$']['SegmentRef'],
                                                            hostTokenRef: bookinginfo['$']['HostTokenRef']
                                                        });
                                                    });
                                                } else {
                                                    combinedArray.push({
                                                        segmentRef: airPricingInfo['air:BookingInfo']['$']['SegmentRef'],
                                                        hostTokenRef: airPricingInfo['air:BookingInfo']['$']['HostTokenRef']
                                                    });
                                                }
                                            }

                                            const HostToken = selectedPackage['common_v52_0:HostToken'];
                                            // console.log(HostToken);
                                            let finaldeparturedate = '';
                                            let finalreturndate = '';
                                            let finalarrivaldate = '';

                                            if (allData.formdata_bookingtype === "Return") {
                                                SegmentParse.map((segmentInfo, segmentindex) => {

                                                    if (segmentindex === 0) {
                                                        finaldeparturedate = segmentInfo['$']['DepartureTime'];
                                                    }
                                                    if (segmentInfo['$']['Group'] === '1') {
                                                        finalreturndate = segmentInfo['$']['DepartureTime'];
                                                        return true;
                                                    }
                                                    return false;
                                                });
                                            } else {
                                                SegmentParse.map((segmentInfo, segmentindex) => {

                                                    if (segmentindex === 0) {
                                                        finaldeparturedate = segmentInfo['$']['DepartureTime'];
                                                        finalarrivaldate = segmentInfo['$']['ArrivalTime'];
                                                    }

                                                });
                                            }

                                            for (let i = 0; i < SegmentParse.length; i++) {
                                                let currentSegment = SegmentParse[i];
                                                for (let j = i + 1; j < SegmentParse.length; j++) {
                                                    const nextSegment = SegmentParse[j];
                                                    if (currentSegment.$.Group === nextSegment.$.Group) {
                                                        currentSegment['air:Connection'] = "";
                                                        currentSegment = SegmentParse[j];
                                                        break;
                                                    }
                                                }
                                            }
                                            SegmentParse.forEach(segment => {
                                                const segmentKey = segment['$'].Key;
                                                const matchedEntry = combinedArray.find(entry => entry.segmentRef === segmentKey);
                                                if (matchedEntry) {
                                                    segment['$'].HostTokenRef = matchedEntry.hostTokenRef;
                                                }
                                            });
                                            // console.log('seg',SegmentParse);
                                            // console.log('host', HostToken);

                                            const makeServicesRequest = async () => {
                                                const username = 'Universal API/uAPI8645980109-af7494fa';
                                                const password = 'N-k29Z}my5';
                                                const authHeader = `Basic ${btoa(`${username}:${password}`)}`


                                                const builder = require('xml2js').Builder;
                                                var servicerequestXML = new builder().buildObject({
                                                    'soap:Envelope': {
                                                        '$': {
                                                            'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/'
                                                        },
                                                        'soap:Header': {

                                                        },
                                                        'soap:Body': {
                                                            '$': {
                                                                'xmlns:air': 'http://www.travelport.com/schema/air_v52_0',
                                                                'xmlns:com': 'http://www.travelport.com/schema/common_v52_0',
                                                            },
                                                            'air:AirMerchandisingOfferAvailabilityReq': {
                                                                '$': {
                                                                    'TargetBranch': Targetbranch,
                                                                    'TraceId': 'ac191f0b9c0546659065f29389eae552'
                                                                },
                                                                'com:BillingPointOfSaleInfo': {
                                                                    '$': {
                                                                        'OriginApplication': 'UAPI'
                                                                    },
                                                                },
                                                                'air:AirSolution': {
                                                                    'air:AirSegment': SegmentParse,
                                                                    'com:HostToken': HostToken
                                                                },

                                                            }
                                                        }
                                                    }
                                                });

                                                try {
                                                    const serviceresponse = await axios.post(`${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightAirServiceRequest`, servicerequestXML, {
                                                        headers: {
                                                            'Content-Type': 'text/xml',
                                                            'Authorization': authHeader,
                                                        },
                                                    });
                                                    const serviceResponse = serviceresponse.data;


                                                    for (const segment of segmentParse) {
                                                        if (segment['$'] && segment['$']['Key']) {
                                                            if (segment['$']['HostTokenRef']) {
                                                                delete segment['$']['HostTokenRef'];
                                                            }
                                                            if (Array.isArray(selectedPackage['air:AirSegmentRef'])) {
                                                                selectedPackage['air:AirSegmentRef'] = segmentParse;
                                                            } else {
                                                                if (selectedPackage['air:AirSegmentRef']['$']['Key'] === segment['$']['Key']) {
                                                                    selectedPackage['air:AirSegmentRef'] = segment;
                                                                }
                                                            }
                                                        }
                                                    }
                                                    // console.log(segmentParse);
                                                    // console.log(HostToken);
                                                    const passengerDetailss = JSON.parse(sessionStorage.getItem('passengerDetailss'));
                                                    // console.log(passengerDetailss);

                                                    const makeSeatRequest = async () => {
                                                        const username = 'Universal API/uAPI8645980109-af7494fa';
                                                        const password = 'N-k29Z}my5';
                                                        const authHeader = `Basic ${btoa(`${username}:${password}`)}`

                                                        const builder = require('xml2js').Builder;
                                                        var seatMapRequestXML = new builder().buildObject({
                                                            'soap:Envelope': {
                                                                '$': {
                                                                    'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/'
                                                                },
                                                                'soap:Body': {
                                                                    '$': {
                                                                        'xmlns:air': 'http://www.travelport.com/schema/air_v52_0',
                                                                        'xmlns:com': 'http://www.travelport.com/schema/common_v52_0'
                                                                    },
                                                                    'air:SeatMapReq': {
                                                                        '$': {
                                                                            'TraceId': 'ac191f0b9c0546659065f29389eae552',
                                                                            'AuthorizedBy': 'TAXIVAXI',
                                                                            'TargetBranch': Targetbranch,
                                                                            'ReturnSeatPricing': 'true',
                                                                            'ReturnBrandingInfo': 'true'
                                                                        },
                                                                        'com:BillingPointOfSaleInfo': {
                                                                            '$': {
                                                                                'OriginApplication': 'UAPI',
                                                                            },
                                                                        },
                                                                        'air:AirSegment': segmentParse,
                                                                        'com:HostToken': hostTokenParse,
                                                                        // 'air:SearchTraveler': passengerDetailss.keys.map((key, index) => ({
                                                                        //     '$': {
                                                                        //         'Code': codes[index],
                                                                        //         'Age': '25',
                                                                        //         'Key': key
                                                                        //     },
                                                                        //     'com:Name': {
                                                                        //         '$': {
                                                                        //             'Prefix': gender[index] === 'F' ? 'Miss' : 'Mr',
                                                                        //             'First': firstNames[index],
                                                                        //             'Last': lastNames[index]
                                                                        //         }
                                                                        //     }
                                                                        // }))
                                                                    }
                                                                }
                                                            }
                                                        });

                                                        try {
                                                            const seatresponse = await axios.post(`${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightAirServiceRequest`, seatMapRequestXML, {
                                                                headers: {
                                                                    'Content-Type': 'text/xml',
                                                                    'Authorization': authHeader,
                                                                },
                                                            });
                                                            const seatResponse = seatresponse.data;
                                                            // console.log(seatResponse);
                                                            parseString(seatResponse, { explicitArray: false }, (err, seatresult) => {
                                                                if (err) {
                                                                    console.error('Error parsing XML:', err);
                                                                    return;
                                                                }
                                                                const AirSeatRsp = seatresult['SOAP:Envelope']['SOAP:Body']['air:SeatMapRsp'];

                                                                if (AirSeatRsp !== null && AirSeatRsp !== undefined) {
                                                                    const seatResponse = seatresult['SOAP:Envelope']['SOAP:Body']['air:SeatMapRsp']['air:AirSegment'];
                                                                    const seatRows = seatresult['SOAP:Envelope']['SOAP:Body']['air:SeatMapRsp']['air:Rows'];
                                                                    const seatTraveler = seatresult['SOAP:Envelope']['SOAP:Body']['air:SeatMapRsp']['air:SearchTraveler'];
                                                                    let seatOptional = [];
                                                                    if (seatresult?.['SOAP:Envelope']?.['SOAP:Body']?.['air:SeatMapRsp']?.['air:OptionalServices']?.['air:OptionalService']) {
                                                                        seatOptional = seatresult['SOAP:Envelope']['SOAP:Body']['air:SeatMapRsp']['air:OptionalServices']['air:OptionalService'];
                                                                    }

                                                                    // setseatrowsparse(Array.isArray(seatRows) ? seatRows : [seatRows]);
                                                                    // setseatresponseparse(Array.isArray(seatResponse) ? seatResponse : [seatResponse]);
                                                                    // setseattravelerparse(Array.isArray(seatTraveler) ? seatTraveler : [seatTraveler]);
                                                                    // setseatOptionalparse(Array.isArray(seatOptional) ? seatOptional : [seatOptional]);
                                                                } else {
                                                                    const error = seatresult['SOAP:Envelope']['SOAP:Body']['SOAP:Fault']['faultstring'];
                                                                    // ErrorLogger.logError('seatmap_api',seatMapRequestXML,error);
                                                                    if (seatresult['SOAP:Envelope']['SOAP:Body']['SOAP:Fault']['detail']['common_v52_0:ErrorInfo']['common_v52_0:Code'] === '101') {
                                                                        Swal.fire({
                                                                            title: 'Seat Selection Not Available',
                                                                            // text: 'Seat Selection Not Available',
                                                                            // icon: 'info',
                                                                            confirmButtonText: 'OK'
                                                                        });
                                                                        // setemptyseatmap(true);
                                                                    } else {
                                                                        setFlighterrors(error);
                                                                    }
                                                                    // setFlighterrors(error);
                                                                }


                                                            });
                                                        } catch (error) {
                                                            navigate('/tryagainlater');
                                                        }
                                                        finally {
                                                            setLoading(false);

                                                        }
                                                    };

                                                    makeSeatRequest();
                                                    // setLoading(false);
                                                    // navigate('/bookingProcess', { state: { serviceData } });

                                                } catch (error) {
                                                    console.error(error);
                                                    // ErrorLogger.logError('service_api',servicerequestXML,error);
                                                    navigate('/tryagainlater');
                                                }
                                                finally {
                                                    setLoading(false);
                                                }
                                            };

                                            makeServicesRequest();

                                        } else {
                                            const error = priceresult['SOAP:Envelope']['SOAP:Body']['SOAP:Fault']['faultstring'];
                                            // ErrorLogger.logError('price_api',pricepointXML,error);
                                            Swal.fire({
                                                title: 'Something Went Wrong !',
                                                text: 'Please try again later',
                                                confirmButtonText: 'OK'
                                            });
                                        }


                                    });
                                } catch (error) {
                                    // ErrorLogger.logError('price_api','Error',error);
                                    navigate('/tryagainlater');
                                }
                                finally {
                                    setLoading(false);
                                }
                            };

                            makeSoapRequest();
                        }




                    } else {
                        const error = result['SOAP:Envelope']['SOAP:Body']['SOAP:Fault']['faultstring'];
                        console.error('Error:', error);
                    }
                });
            } catch (error) {
                console.error('Error:', error);
            }
        })();
    }

    const [prices, setPrices] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const cancelPenaltyAmount = [];
        const penaltyApplies = [];

        if (Array.isArray(packageSelected['air:AirPricingInfo'])) {
            const pricingInfo = packageSelected['air:AirPricingInfo'][0];

            if (Array.isArray(pricingInfo['air:CancelPenalty'])) {
                pricingInfo['air:CancelPenalty'].forEach(cancelpolicy => {
                    cancelPenaltyAmount.push(cancelpolicy?.['air:Amount']);
                    penaltyApplies.push(cancelpolicy?.['$']?.['PenaltyApplies'] || 'NA');
                });
            } else {
                cancelPenaltyAmount.push(pricingInfo?.['air:CancelPenalty']?.['air:Amount']);
                penaltyApplies.push(pricingInfo?.['air:CancelPenalty']?.['$']?.['PenaltyApplies'] || 'NA');
            }
        } else {
            const pricingInfo = packageSelected['air:AirPricingInfo'];

            if (Array.isArray(pricingInfo['air:CancelPenalty'])) {
                pricingInfo['air:CancelPenalty'].forEach(cancelpolicy => {
                    cancelPenaltyAmount.push(cancelpolicy?.['air:Amount']);
                    penaltyApplies.push(cancelpolicy?.['$']?.['PenaltyApplies'] || 'NA');
                });
            } else {
                cancelPenaltyAmount.push(pricingInfo?.['air:CancelPenalty']?.['air:Amount']);
                penaltyApplies.push(pricingInfo?.['air:CancelPenalty']?.['$']?.['PenaltyApplies'] || 'NA');
            }
        }

        const newPrice = penaltyApplies.map((condition, index) => ({
            condition: condition,
            price: cancelPenaltyAmount[index] ? cancelPenaltyAmount[index].replace('INR', '₹ ') : '₹ 0'
        }));

        setPrices(newPrice);
    }, [packageSelected]);

    useEffect(() => {
        const grad1 = document.getElementById('grad1');
        if (totalCount > 1 && grad1) {
            grad1.id = 'grad0';
        }
    }, [totalCount]);

    // useEffect(() => {
    //     const priceItemsContainer = document.getElementById('price-items');
    //     setTotalCount(prices.length);
    //     priceItemsContainer.innerHTML = '';
    //     // console.log(prices);
    //     prices.forEach((price, index) => {
    //         const priceItem = document.createElement('div');
    //         priceItem.classList.add('price-item');
    //         priceItem.style.width = `${(1 / totalCount) * 100}%`;

    //         const conditionSpan = document.createElement('span');
    //         conditionSpan.textContent = price.condition;
    //         conditionSpan.classList.add('conditionSpan');
    //         priceItem.appendChild(conditionSpan);

    //         const conditionSpanprice = document.createElement('span');
    //         conditionSpanprice.textContent = price.price;
    //         conditionSpanprice.classList.add('conditionSpanprice');
    //         priceItem.appendChild(conditionSpanprice);

    //         priceItemsContainer.appendChild(priceItem);
    //     });
    // }, [prices, totalCount]);

    return (

        <div className="yield-content" style={{ background: '#e8e4ff' }}>
            {/* <header className="search-barr" id="widgetHeader">
            <p style={{ color: 'white'}}>Complete Your Booking</p>
        </header> */}
            {loading &&
                <div className="page-center-loader flex items-center justify-center">
                    <div className="big-loader flex items-center justify-center">
                        {/* <IconLoader className="big-icon animate-[spin_2s_linear_infinite]" /> */}
                        <img className="loader-gif" src="/img/cotravloader.gif" alt="Loader" />
                        {(() => {
                            switch (true) {
                                case isseatloading:
                                    return (
                                        <p className="text-center ml-4 text-gray-600 text-lg">
                                            Retrieving Seat details. Please wait a moment.
                                        </p>
                                    );
                                case isreservation:
                                    return (
                                        <p className="text-center ml-4 text-gray-600" >
                                            Processing your reservation. Please wait...
                                        </p>
                                    );

                                default:
                                    return (
                                        <p className="text-center ml-4 text-gray-600 text-lg">
                                            Retrieving flight details. Please wait a moment.
                                        </p>
                                    )
                            }
                        })()}

                    </div>
                </div>
            }

            <div className="main-cont" id="main_cont">
                <div className="body-wrapper">

                    <div className="wrapper-padding">
                        <span class="bgGradient"></span>

                        <div className="sp-page">
                            <div className="sp-page-a">
                                <div className="sp-page-l">
                                    <div className="sp-page-lb">
                                        <div className="sp-page-p">
                                            <div className="booking-left">

                                                {packageSelected['air:AirPricingInfo'] && (
                                                    Array.isArray(packageSelected['air:AirPricingInfo'])
                                                        ? (
                                                            packageSelected['air:AirPricingInfo'][0]['air:FareInfo'] && (
                                                                Array.isArray(packageSelected['air:AirPricingInfo'][0]['air:FareInfo'])
                                                                    ? (
                                                                        packageSelected['air:AirPricingInfo'][0]['air:FareInfo'].map((fareInfo, fareIndex) => (
                                                                            <div key={fareIndex}>
                                                                                {fareInfo['air:Brand']['air:Text'] ? (

                                                                                    <div className="baggagae_policy">
                                                                                        {fareIndex === 0 &&
                                                                                            <>
                                                                                                <span className='headingpolicies'>
                                                                                                    Flight Details
                                                                                                    <span
                                                                                                    >
                                                                                                        {/* <button
                                                                                                            type="button"
                                                                                                            className="packagemore"
                                                                                                            data-toggle="modal"
                                                                                                            data-target=".bd-example-modal-lg"
                                                                                                        >
                                                                                                            Package Details
                                                                                                        </button> */}

                                                                                                    </span>
                                                                                                </span>
                                                                                                <div
                                                                                                    className="modal fade bd-example-modal-lg multipleflight"
                                                                                                    tabIndex={-1}
                                                                                                    role="dialog"
                                                                                                    aria-labelledby="myLargeModalLabel"
                                                                                                    aria-hidden="true"
                                                                                                >
                                                                                                    <div className="modal-dialog modal-lg">
                                                                                                        <div className="modal-content">
                                                                                                            <div className="modal-header">
                                                                                                                <h5
                                                                                                                    className="modal-title"
                                                                                                                    id="exampleModalLabel"
                                                                                                                >
                                                                                                                    Flight Details
                                                                                                                </h5>
                                                                                                                <button
                                                                                                                    type="button"
                                                                                                                    className="close"
                                                                                                                    data-dismiss="modal"
                                                                                                                    aria-label="Close"
                                                                                                                    style={{ marginLeft: '60%', marginRight: '0', padding: '0' }}

                                                                                                                >
                                                                                                                    <span style={{ width: '9px', height: '10px', display: 'block' }}
                                                                                                                        aria-hidden="true">×</span>
                                                                                                                </button>
                                                                                                            </div>
                                                                                                            <div className="modal-body">
                                                                                                                <div className="row">
                                                                                                                    {packageSelected['air:AirPricingInfo'] && (
                                                                                                                        Array.isArray(packageSelected['air:AirPricingInfo'])
                                                                                                                            ? (
                                                                                                                                packageSelected['air:AirPricingInfo'].map((pricingInfo, pricingIndex) => (
                                                                                                                                    <div key={pricingIndex} className="col-md-5">
                                                                                                                                        {pricingInfo['air:FareInfo'] && (
                                                                                                                                            Array.isArray(pricingInfo['air:FareInfo'])
                                                                                                                                                ? (
                                                                                                                                                    <div >

                                                                                                                                                        {/* {pricingInfo['air:FareInfo'].map((fareInfo, fareIndex) => ( */}
                                                                                                                                                        {pricingInfo['air:FareInfo'][0]['air:Brand']['air:Text'] && (
                                                                                                                                                            Array.isArray(pricingInfo['air:FareInfo'][0]['air:Brand']['air:Text'])
                                                                                                                                                                ? (
                                                                                                                                                                    <div>
                                                                                                                                                                        {pricingInfo['air:FareInfo'][0]['air:Brand']['air:Text'].map((textinfor, textindex) => {
                                                                                                                                                                            if (
                                                                                                                                                                                textinfor['$'] &&
                                                                                                                                                                                textinfor['$']['Type'] === "MarketingConsumer"
                                                                                                                                                                            ) {

                                                                                                                                                                                const infoArray = textinfor['_'].split('\n').filter(item => item.trim() !== '');

                                                                                                                                                                                return (
                                                                                                                                                                                    <div key={textindex} className="panelfare">
                                                                                                                                                                                        <div className='fareaccordion'>
                                                                                                                                                                                            {pricingIndex === 0 ? 'Adult package' : pricingIndex === 1 ? 'Child package' : 'Infant package'}
                                                                                                                                                                                        </div>

                                                                                                                                                                                        <ul>
                                                                                                                                                                                            {infoArray.map((item, index) => (
                                                                                                                                                                                                <li key={index}>{item.trim()}</li>
                                                                                                                                                                                            ))}
                                                                                                                                                                                        </ul>

                                                                                                                                                                                    </div>
                                                                                                                                                                                );
                                                                                                                                                                            }

                                                                                                                                                                        })}
                                                                                                                                                                    </div>
                                                                                                                                                                ) : (
                                                                                                                                                                    <>
                                                                                                                                                                        <div>
                                                                                                                                                                            <div className='fareaccordion'>
                                                                                                                                                                                {pricingIndex === 0 ? 'Adult package' : pricingIndex === 1 ? 'Child package' : 'Infant package'}
                                                                                                                                                                            </div>
                                                                                                                                                                            <div>Not Available</div>
                                                                                                                                                                        </div>
                                                                                                                                                                    </>
                                                                                                                                                                )
                                                                                                                                                        )}
                                                                                                                                                        {/* ))} */}

                                                                                                                                                    </div>

                                                                                                                                                ) : (
                                                                                                                                                    pricingInfo['air:FareInfo']['air:Brand']['air:Text'] && (
                                                                                                                                                        Array.isArray(pricingInfo['air:FareInfo']['air:Brand']['air:Text'])
                                                                                                                                                            ? (
                                                                                                                                                                <div>

                                                                                                                                                                    {pricingInfo['air:FareInfo']['air:Brand']['air:Text'].map((textinfor, textindex) => {
                                                                                                                                                                        if (
                                                                                                                                                                            textinfor['$'] &&
                                                                                                                                                                            textinfor['$']['Type'] === "MarketingConsumer"
                                                                                                                                                                        ) {

                                                                                                                                                                            const infoArray = textinfor['_'].split('\n').filter(item => item.trim() !== '');

                                                                                                                                                                            return (
                                                                                                                                                                                <div key={textindex}>
                                                                                                                                                                                    <div className="panelfare">
                                                                                                                                                                                        <div className='fareaccordion'>
                                                                                                                                                                                            {pricingIndex === 0 ? 'Adult package' : pricingIndex === 1 ? 'Child package' : 'Infant package'}
                                                                                                                                                                                        </div>

                                                                                                                                                                                        <ul>
                                                                                                                                                                                            {infoArray.map((item, index) => (
                                                                                                                                                                                                <li key={index}>{item.trim()}</li>
                                                                                                                                                                                            ))}
                                                                                                                                                                                        </ul>

                                                                                                                                                                                    </div>
                                                                                                                                                                                </div>
                                                                                                                                                                            );
                                                                                                                                                                        }

                                                                                                                                                                    })}

                                                                                                                                                                </div>
                                                                                                                                                            ) : (
                                                                                                                                                                <>
                                                                                                                                                                    <div>
                                                                                                                                                                        <div className='fareaccordion'>
                                                                                                                                                                            {pricingIndex === 0 ? 'Adult package' : pricingIndex === 1 ? 'Child package' : 'Infant package'}
                                                                                                                                                                        </div>
                                                                                                                                                                        <div>Not Available</div>
                                                                                                                                                                    </div>
                                                                                                                                                                </>
                                                                                                                                                            )
                                                                                                                                                    )
                                                                                                                                                )

                                                                                                                                        )}
                                                                                                                                    </div>
                                                                                                                                ))

                                                                                                                            ) : (
                                                                                                                                packageSelected['air:AirPricingInfo']['air:FareInfo'] && (
                                                                                                                                    Array.isArray(packageSelected['air:AirPricingInfo']['air:FareInfo'])
                                                                                                                                        ? (
                                                                                                                                            <div className='col-md-5'>

                                                                                                                                                {/* {packageSelected['air:AirPricingInfo']['air:FareInfo'].map((fareInfo, fareIndex) => ( */}
                                                                                                                                                {packageSelected['air:AirPricingInfo']['air:FareInfo'][0]['air:Brand']['air:Text'] && (
                                                                                                                                                    Array.isArray(packageSelected['air:AirPricingInfo']['air:FareInfo'][0]['air:Brand']['air:Text'])
                                                                                                                                                        ? (
                                                                                                                                                            <div>
                                                                                                                                                                {packageSelected['air:AirPricingInfo']['air:FareInfo'][0]['air:Brand']['air:Text'].map((textinfor, textindex) => {
                                                                                                                                                                    if (
                                                                                                                                                                        textinfor['$'] &&
                                                                                                                                                                        textinfor['$']['Type'] === "MarketingConsumer"
                                                                                                                                                                    ) {

                                                                                                                                                                        const infoArray = textinfor['_'].split('\n').filter(item => item.trim() !== '');

                                                                                                                                                                        return (
                                                                                                                                                                            <div key={textindex} className="panelfare">
                                                                                                                                                                                <div className='fareaccordion'> Adult package </div>

                                                                                                                                                                                <ul>
                                                                                                                                                                                    {infoArray.map((item, index) => (
                                                                                                                                                                                        <li key={index}>{item.trim()}</li>
                                                                                                                                                                                    ))}
                                                                                                                                                                                </ul>

                                                                                                                                                                            </div>
                                                                                                                                                                        );
                                                                                                                                                                    }

                                                                                                                                                                })}
                                                                                                                                                            </div>
                                                                                                                                                        ) : (
                                                                                                                                                            <>
                                                                                                                                                                <div>
                                                                                                                                                                    <div className='fareaccordion'> Adult package </div>
                                                                                                                                                                    <div>Not Available</div>
                                                                                                                                                                </div>
                                                                                                                                                            </>
                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                                                {/* ))} */}

                                                                                                                                            </div>

                                                                                                                                        ) : (
                                                                                                                                            packageSelected['air:AirPricingInfo']['air:FareInfo']['air:Brand']['air:Text'] && (
                                                                                                                                                Array.isArray(packageSelected['air:AirPricingInfo']['air:FareInfo']['air:Brand']['air:Text'])
                                                                                                                                                    ? (
                                                                                                                                                        <div className='col-md-6'>

                                                                                                                                                            {packageSelected['air:AirPricingInfo']['air:FareInfo']['air:Brand']['air:Text'].map((textinfor, textindex) => {
                                                                                                                                                                if (
                                                                                                                                                                    textinfor['$'] &&
                                                                                                                                                                    textinfor['$']['Type'] === "MarketingConsumer"
                                                                                                                                                                ) {
                                                                                                                                                                    const infoArray = textinfor['_'].split('\n').filter(item => item.trim() !== '');

                                                                                                                                                                    return (
                                                                                                                                                                        <div key={textindex}>
                                                                                                                                                                            <div className="panelfare">
                                                                                                                                                                                <div className='fareaccordion'> Adult package </div>


                                                                                                                                                                                <ul>
                                                                                                                                                                                    {infoArray.map((item, index) => (
                                                                                                                                                                                        <li key={index}>{item.trim()}</li>
                                                                                                                                                                                    ))}
                                                                                                                                                                                </ul>

                                                                                                                                                                            </div>
                                                                                                                                                                        </div>
                                                                                                                                                                    );
                                                                                                                                                                }

                                                                                                                                                            })}

                                                                                                                                                        </div>
                                                                                                                                                    ) : (
                                                                                                                                                        <>
                                                                                                                                                            <div>
                                                                                                                                                                <div className='fareaccordion'> Adult package </div>
                                                                                                                                                                <div>Not Available</div>
                                                                                                                                                            </div>
                                                                                                                                                        </>
                                                                                                                                                    )
                                                                                                                                            )
                                                                                                                                        )

                                                                                                                                )
                                                                                                                            )
                                                                                                                    )}

                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </>
                                                                                        }
                                                                                        <div className='row' style={{ border: '1px solid #e3e3e3', margin: '0% 0%' }}>
                                                                                            <div className="booking-form bagg-form-details">

                                                                                                {Array.isArray(fareInfo['air:Brand']['air:Text'])
                                                                                                    ? (
                                                                                                        fareInfo['air:Brand']['air:Text'].map((textinfor, textindex) => {
                                                                                                            if (
                                                                                                                textinfor['$'] &&
                                                                                                                textinfor['$']['Type'] === "MarketingConsumer"
                                                                                                            ) {

                                                                                                                const infoText = textinfor['_'];
                                                                                                                const matches = infoText.match(/\b\d+\s?(kgs?|kg)\b/gi);

                                                                                                                return (
                                                                                                                    <div key={textindex}>
                                                                                                                        <div className="airport-flight-row">
                                                                                                                            {(() => {
                                                                                                                                const uniqueCarriers1 = new Set();
                                                                                                                                segmentParse.forEach(segmentinfo => uniqueCarriers1.add(segmentinfo['$']['Carrier']));

                                                                                                                                return (
                                                                                                                                    Array.from(uniqueCarriers1).map((carrier, index) => (
                                                                                                                                        <div key={index} className="airport-flight-container">
                                                                                                                                            {/* Airline Logo */}
                                                                                                                                            <img
                                                                                                                                                className="airport-airline-img"
                                                                                                                                                src={`${CONFIG.DEV_API}/airline_logo_images/${carrier}.png`}
                                                                                                                                                alt="Airline logo"
                                                                                                                                            />

                                                                                                                                            {/* Airline Name, Flight Number, and Aircraft Type */}
                                                                                                                                            <div className="airport-flight-details">
                                                                                                                                                <span className="airport-airline-name">{handleAirline(carrier)}
                                                                                                                                                    {segmentParse
                                                                                                                                                        .filter(segmentinfo => segmentinfo['$']['Carrier'] === carrier)
                                                                                                                                                        .map((segmentinfo, segmentindex) => (
                                                                                                                                                            fareIndex === segmentindex && (
                                                                                                                                                                <span key={segmentindex} className="airport-flight-number">
                                                                                                                                                                    {segmentinfo['$']['Carrier']} {segmentinfo['$']['FlightNumber']}
                                                                                                                                                                </span>
                                                                                                                                                            )
                                                                                                                                                        ))
                                                                                                                                                    }
                                                                                                                                                </span>

                                                                                                                                            </div>

                                                                                                                                            {/* Cabin Class */}
                                                                                                                                            <div className="airport-cabin-class">{classType}</div>
                                                                                                                                        </div>
                                                                                                                                    ))
                                                                                                                                );
                                                                                                                            })()}
                                                                                                                        </div>
                                                                                                                        <div className="flight-details-container">
                                                                                                                            <div className='row accordionfarename apiairportname'>
                                                                                                                                <span className='apicircle'>◯</span>
                                                                                                                                <span className='airportname'>
                                                                                                                                    {handleAirport(fareInfo['$']['Origin'])}
                                                                                                                                </span>
                                                                                                                                <span className='airport'>
                                                                                                                                    {handleApiAirport(fareInfo['$']['Origin'])}
                                                                                                                                    {(
                                                                                                                                        (Array.isArray(segmentArray1) ? segmentArray1 : [segmentArray1]).filter(segment => {

                                                                                                                                            const bookingInfo = packageSelected['air:AirPricingInfo']['air:BookingInfo'].find(
                                                                                                                                                info => info['$']['FareInfoRef'] === fareInfo['$']['Key']
                                                                                                                                            );

                                                                                                                                            // Check if the segment's key matches the booking info's SegmentRef
                                                                                                                                            return bookingInfo && segment['$']['Key'] === bookingInfo['$']['SegmentRef'];
                                                                                                                                        }).map(segment => {
                                                                                                                                            const matchedFlightDetail = actualFlightDetails.find(flight =>
                                                                                                                                                flight.$?.Origin === segment['$']['Origin'] &&
                                                                                                                                                flight.$?.Destination === segment['$']['Destination'] &&
                                                                                                                                                flight.$?.DepartureTime === segment['$']['DepartureTime'] &&
                                                                                                                                                flight.$?.ArrivalTime === segment['$']['ArrivalTime']
                                                                                                                                            );

                                                                                                                                            return matchedFlightDetail?.$?.OriginTerminal ? ` T-${matchedFlightDetail.$.OriginTerminal}` : null;
                                                                                                                                        })
                                                                                                                                            .filter(Boolean)
                                                                                                                                            .join("")
                                                                                                                                    )}</span>
                                                                                                                            </div>
                                                                                                                            <div className='row accordionfarename apiairportname'>
                                                                                                                                <span className='vertical_line'></span>
                                                                                                                                {handleEffectiveDate(fareInfo['$']['Origin']['DepartureDate'])}
                                                                                                                                {/* {(segmentParsee['$']['DepartureTime'])} */}
                                                                                                                            </div>
                                                                                                                            <div className='row accordionfarename apiairportname'>
                                                                                                                                <span className='apicircle'>◯</span>
                                                                                                                                <span className='airportname'>
                                                                                                                                    {handleAirport(fareInfo['$']['Destination'])}
                                                                                                                                </span>
                                                                                                                                <span className='airport'>
                                                                                                                                    {handleApiAirport(fareInfo['$']['Destination'])}
                                                                                                                                    {(
                                                                                                                                        (Array.isArray(segmentArray1) ? segmentArray1 : [segmentArray1]).filter(segment => {

                                                                                                                                            const bookingInfo = packageSelected['air:AirPricingInfo']['air:BookingInfo'].find(
                                                                                                                                                info => info['$']['FareInfoRef'] === fareInfo['$']['Key']
                                                                                                                                            );


                                                                                                                                            return bookingInfo && segment['$']['Key'] === bookingInfo['$']['SegmentRef'];
                                                                                                                                        }).map(segment => {

                                                                                                                                            const matchedFlightDetail = actualFlightDetails.find(flight =>
                                                                                                                                                flight.$?.Origin === segment['$']['Origin'] &&
                                                                                                                                                flight.$?.Destination === segment['$']['Destination'] &&
                                                                                                                                                flight.$?.DepartureTime === segment['$']['DepartureTime'] &&
                                                                                                                                                flight.$?.ArrivalTime === segment['$']['ArrivalTime']
                                                                                                                                            );

                                                                                                                                            return matchedFlightDetail?.$?.DestinationTerminal ? ` T-${matchedFlightDetail.$.DestinationTerminal}` : null;
                                                                                                                                        })
                                                                                                                                            .filter(Boolean)
                                                                                                                                            .join("")
                                                                                                                                    )}</span>
                                                                                                                            </div>
                                                                                                                            <div className='baggage-info'>
                                                                                                                                <span className="cabin-baggage">
                                                                                                                                    <img src="/img/cabin_bag.svg" alt="Cabin Baggage" className="baggage-icon" /><strong>Cabin Baggage:</strong> {matches && matches[1] ? matches[1] : 'NA'}
                                                                                                                                </span>
                                                                                                                                <span className="checkin-baggage">
                                                                                                                                    <img src="/img/checkin_bag.svg" alt="Cabin Baggage" className="baggage-icon" /><strong>Check-In Baggage:</strong> {matches && matches[0] ? matches[0] : 'NA'}
                                                                                                                                </span>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>

                                                                                                                );
                                                                                                            }

                                                                                                        })
                                                                                                    ) : (
                                                                                                        <>
                                                                                                            <div className='row'>
                                                                                                                <div className='accordionfarename col-md-4'>{handleAirport(fareInfo['$']['Origin'])} →  {handleAirport(fareInfo['$']['Destination'])}</div>
                                                                                                                <div className="accordionfarecabinclass col-md-3">Not available</div>
                                                                                                            </div>
                                                                                                        </>
                                                                                                    )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (null)}
                                                                            </div>

                                                                        ))



                                                                    ) : (
                                                                        packageSelected['air:AirPricingInfo'][0]['air:FareInfo']['air:Brand']['air:Text'] ? (
                                                                            <div className="baggagae_policy">
                                                                                <span className='headingpolicies' >
                                                                                    Flight Details
                                                                                    <span>
                                                                                        {/* <button
                                                                                            type="button"
                                                                                            className="packagemore"
                                                                                            data-toggle="modal"
                                                                                            data-target=".bd-example-modal-lg"
                                                                                        >
                                                                                            Package Details
                                                                                        </button> */}
                                                                                    </span>
                                                                                </span>
                                                                                <div
                                                                                    className="modal fade bd-example-modal-lg multipleflight"
                                                                                    tabIndex={-1}
                                                                                    role="dialog"
                                                                                    aria-labelledby="myLargeModalLabel"
                                                                                    aria-hidden="true"
                                                                                >
                                                                                    <div className="modal-dialog modal-lg">
                                                                                        <div className="modal-content">
                                                                                            <div className="modal-header">
                                                                                                <h5
                                                                                                    className="modal-title"
                                                                                                    id="exampleModalLabel"
                                                                                                >
                                                                                                    Flight Details
                                                                                                </h5>
                                                                                                <button
                                                                                                    type="button"
                                                                                                    className="close"
                                                                                                    data-dismiss="modal"
                                                                                                    aria-label="Close"
                                                                                                    style={{ marginLeft: '60%', marginRight: '0', padding: '0' }}

                                                                                                >
                                                                                                    <span
                                                                                                        style={{ width: '9px', height: '10px', display: 'block' }}
                                                                                                        aria-hidden="true">×</span>
                                                                                                </button>
                                                                                            </div>
                                                                                            <div className="modal-body">
                                                                                                <div className="row">
                                                                                                    {packageSelected['air:AirPricingInfo'] && (
                                                                                                        Array.isArray(packageSelected['air:AirPricingInfo'])
                                                                                                            ? (
                                                                                                                packageSelected['air:AirPricingInfo'].map((pricingInfo, pricingIndex) => (
                                                                                                                    <div key={pricingIndex} className="col-md-6">
                                                                                                                        {pricingInfo['air:FareInfo'] && (
                                                                                                                            Array.isArray(pricingInfo['air:FareInfo'])
                                                                                                                                ? (
                                                                                                                                    <div >

                                                                                                                                        {/* {pricingInfo['air:FareInfo'].map((fareInfo, fareIndex) => ( */}
                                                                                                                                        {pricingInfo['air:FareInfo'][0]['air:Brand']['air:Text'] && (
                                                                                                                                            Array.isArray(pricingInfo['air:FareInfo'][0]['air:Brand']['air:Text'])
                                                                                                                                                ? (
                                                                                                                                                    <div>
                                                                                                                                                        {pricingInfo['air:FareInfo'][0]['air:Brand']['air:Text'].map((textinfor, textindex) => {
                                                                                                                                                            if (
                                                                                                                                                                textinfor['$'] &&
                                                                                                                                                                textinfor['$']['Type'] === "MarketingConsumer"
                                                                                                                                                            ) {

                                                                                                                                                                const infoArray = textinfor['_'].split('\n').filter(item => item.trim() !== '');

                                                                                                                                                                return (
                                                                                                                                                                    <div key={textindex} className="panelfare">
                                                                                                                                                                        <div className='fareaccordion'>
                                                                                                                                                                            {pricingIndex === 0 ? 'Adult package' : pricingIndex === 1 ? 'Child package' : 'Infant package'}
                                                                                                                                                                        </div>

                                                                                                                                                                        <ul>
                                                                                                                                                                            {infoArray.map((item, index) => (
                                                                                                                                                                                <li key={index}>{item.trim()}</li>
                                                                                                                                                                            ))}
                                                                                                                                                                        </ul>

                                                                                                                                                                    </div>
                                                                                                                                                                );
                                                                                                                                                            }

                                                                                                                                                        })}
                                                                                                                                                    </div>
                                                                                                                                                ) : (
                                                                                                                                                    <>
                                                                                                                                                        <div>
                                                                                                                                                            <div className='fareaccordion'>
                                                                                                                                                                {pricingIndex === 0 ? 'Adult package' : pricingIndex === 1 ? 'Child package' : 'Infant package'}
                                                                                                                                                            </div>
                                                                                                                                                            <div>Not Available</div>
                                                                                                                                                        </div>
                                                                                                                                                    </>
                                                                                                                                                )
                                                                                                                                        )}
                                                                                                                                        {/* ))} */}

                                                                                                                                    </div>

                                                                                                                                ) : (
                                                                                                                                    pricingInfo['air:FareInfo']['air:Brand']['air:Text'] && (
                                                                                                                                        Array.isArray(pricingInfo['air:FareInfo']['air:Brand']['air:Text'])
                                                                                                                                            ? (
                                                                                                                                                <div>

                                                                                                                                                    {pricingInfo['air:FareInfo']['air:Brand']['air:Text'].map((textinfor, textindex) => {
                                                                                                                                                        if (
                                                                                                                                                            textinfor['$'] &&
                                                                                                                                                            textinfor['$']['Type'] === "MarketingConsumer"
                                                                                                                                                        ) {

                                                                                                                                                            const infoArray = textinfor['_'].split('\n').filter(item => item.trim() !== '');

                                                                                                                                                            return (
                                                                                                                                                                <div key={textindex} >
                                                                                                                                                                    <div className="panelfare">
                                                                                                                                                                        <div className='fareaccordion'>
                                                                                                                                                                            {pricingIndex === 0 ? 'Adult package' : pricingIndex === 1 ? 'Child package' : 'Infant package'}
                                                                                                                                                                        </div>

                                                                                                                                                                        <ul>
                                                                                                                                                                            {infoArray.map((item, index) => (
                                                                                                                                                                                <li key={index}>{item.trim()}</li>
                                                                                                                                                                            ))}
                                                                                                                                                                        </ul>

                                                                                                                                                                    </div>
                                                                                                                                                                </div>
                                                                                                                                                            );
                                                                                                                                                        }

                                                                                                                                                    })}

                                                                                                                                                </div>
                                                                                                                                            ) : (
                                                                                                                                                <>
                                                                                                                                                    <div>
                                                                                                                                                        <div className='fareaccordion'>
                                                                                                                                                            {pricingIndex === 0 ? 'Adult package' : pricingIndex === 1 ? 'Child package' : 'Infant package'}
                                                                                                                                                        </div>
                                                                                                                                                        <div>Not Available</div>
                                                                                                                                                    </div>
                                                                                                                                                </>
                                                                                                                                            )
                                                                                                                                    )
                                                                                                                                )

                                                                                                                        )}
                                                                                                                    </div>
                                                                                                                ))

                                                                                                            ) : (
                                                                                                                packageSelected['air:AirPricingInfo']['air:FareInfo'] && (
                                                                                                                    Array.isArray(packageSelected['air:AirPricingInfo']['air:FareInfo'])
                                                                                                                        ? (
                                                                                                                            <div className='col-md-6'>

                                                                                                                                {/* {packageSelected['air:AirPricingInfo']['air:FareInfo'].map((fareInfo, fareIndex) => ( */}
                                                                                                                                {packageSelected['air:AirPricingInfo']['air:FareInfo'][0]['air:Brand']['air:Text'] && (
                                                                                                                                    Array.isArray(packageSelected['air:AirPricingInfo']['air:FareInfo'][0]['air:Brand']['air:Text'])
                                                                                                                                        ? (
                                                                                                                                            <div>
                                                                                                                                                {packageSelected['air:AirPricingInfo']['air:FareInfo'][0]['air:Brand']['air:Text'].map((textinfor, textindex) => {
                                                                                                                                                    if (
                                                                                                                                                        textinfor['$'] &&
                                                                                                                                                        textinfor['$']['Type'] === "MarketingConsumer"
                                                                                                                                                    ) {

                                                                                                                                                        const infoArray = textinfor['_'].split('\n').filter(item => item.trim() !== '');

                                                                                                                                                        return (
                                                                                                                                                            <div key={textindex} className="panelfare">
                                                                                                                                                                <div className='fareaccordion'> Adult package </div>

                                                                                                                                                                <ul>
                                                                                                                                                                    {infoArray.map((item, index) => (
                                                                                                                                                                        <li key={index}>{item.trim()}</li>
                                                                                                                                                                    ))}
                                                                                                                                                                </ul>

                                                                                                                                                            </div>
                                                                                                                                                        );
                                                                                                                                                    }

                                                                                                                                                })}
                                                                                                                                            </div>
                                                                                                                                        ) : (
                                                                                                                                            <>
                                                                                                                                                <div>
                                                                                                                                                    <div className='fareaccordion'> Adult package </div>
                                                                                                                                                    <div>Not Available</div>
                                                                                                                                                </div>
                                                                                                                                            </>
                                                                                                                                        )
                                                                                                                                )}
                                                                                                                                {/* ))} */}

                                                                                                                            </div>

                                                                                                                        ) : (
                                                                                                                            packageSelected['air:AirPricingInfo']['air:FareInfo']['air:Brand']['air:Text'] && (
                                                                                                                                Array.isArray(packageSelected['air:AirPricingInfo']['air:FareInfo']['air:Brand']['air:Text'])
                                                                                                                                    ? (
                                                                                                                                        <div className='col-md-6'>

                                                                                                                                            {packageSelected['air:AirPricingInfo']['air:FareInfo']['air:Brand']['air:Text'].map((textinfor, textindex) => {
                                                                                                                                                if (
                                                                                                                                                    textinfor['$'] &&
                                                                                                                                                    textinfor['$']['Type'] === "MarketingConsumer"
                                                                                                                                                ) {
                                                                                                                                                    const infoArray = textinfor['_'].split('\n').filter(item => item.trim() !== '');

                                                                                                                                                    return (
                                                                                                                                                        <div key={textindex}>
                                                                                                                                                            <div className="panelfare">
                                                                                                                                                                <div className='fareaccordion'> Adult package </div>


                                                                                                                                                                <ul>
                                                                                                                                                                    {infoArray.map((item, index) => (
                                                                                                                                                                        <li key={index}>{item.trim()}</li>
                                                                                                                                                                    ))}
                                                                                                                                                                </ul>

                                                                                                                                                            </div>
                                                                                                                                                        </div>
                                                                                                                                                    );
                                                                                                                                                }

                                                                                                                                            })}

                                                                                                                                        </div>
                                                                                                                                    ) : (
                                                                                                                                        <>
                                                                                                                                            <div>
                                                                                                                                                <div className='fareaccordion'> Adult package </div>
                                                                                                                                                <div>Not Available</div>
                                                                                                                                            </div>
                                                                                                                                        </>
                                                                                                                                    )
                                                                                                                            )
                                                                                                                        )

                                                                                                                )
                                                                                                            )
                                                                                                    )}

                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='row' style={{ border: '1px solid #e3e3e3', margin: '0% 0%' }}>
                                                                                    <div
                                                                                        className="booking-form bagg-form-details"

                                                                                    >
                                                                                        {Array.isArray(packageSelected['air:AirPricingInfo'][0]['air:FareInfo']['air:Brand']['air:Text'])
                                                                                            ? (
                                                                                                packageSelected['air:AirPricingInfo'][0]['air:FareInfo']['air:Brand']['air:Text'].map((textinfor, textindex) => {
                                                                                                    if (
                                                                                                        textinfor['$'] &&
                                                                                                        textinfor['$']['Type'] === "MarketingConsumer"
                                                                                                    ) {

                                                                                                        const infoText = textinfor['_'];
                                                                                                        const matches = infoText.match(/\b\d+\s?(kgs?|kg)\b/gi);
                                                                                                        console.log("matches1", matches);
                                                                                                        return (
                                                                                                            <div key={textindex}>
                                                                                                                <div className="airport-flight-row">
                                                                                                                    {(() => {
                                                                                                                        const uniqueCarriers = new Set();
                                                                                                                        segmentParse.forEach(segmentinfo => uniqueCarriers.add(segmentinfo['$']['Carrier']));

                                                                                                                        return Array.from(uniqueCarriers).map((carrier, index) => (
                                                                                                                            <div key={index} className="airport-flight-container">
                                                                                                                                {/* Airline Logo */}
                                                                                                                                <img
                                                                                                                                    className="airportairlineimg"
                                                                                                                                    src={`${CONFIG.DEV_API}/airline_logo_images/${carrier}.png`}
                                                                                                                                    alt="Airline logo"
                                                                                                                                    width="30px"
                                                                                                                                />

                                                                                                                                {/* Flight Details */}
                                                                                                                                <div className="airport-flight-details">
                                                                                                                                    <span className="airportairline">{handleAirline(carrier)}
                                                                                                                                        {segmentParse
                                                                                                                                            .filter(segmentinfo => segmentinfo['$']['Carrier'] === carrier)
                                                                                                                                            .map((segmentinfo, segmentindex) => (
                                                                                                                                                <span key={segmentindex}>
                                                                                                                                                    {segmentindex > 0 && ', '}
                                                                                                                                                    {segmentinfo['$']['Carrier']} {segmentinfo['$']['FlightNumber']}
                                                                                                                                                </span>
                                                                                                                                            ))}
                                                                                                                                    </span>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        ));
                                                                                                                    })()}

                                                                                                                    {/* Cabin Class (Aligned to the Right) */}
                                                                                                                    <span className="airport-cabin-class">{classType}</span>
                                                                                                                </div>
                                                                                                                <div className="flight-details-container">
                                                                                                                    <div className='row accordionfarename apiairportname'>
                                                                                                                        <span className='apicircle'>◯</span>
                                                                                                                        <span className='airportname'>
                                                                                                                            {handleAirport(packageSelected['air:AirPricingInfo'][0]['air:FareInfo']['$']['Origin'])}
                                                                                                                        </span>
                                                                                                                        <span className='airport'>
                                                                                                                            {handleApiAirport(packageSelected['air:AirPricingInfo'][0]['air:FareInfo']['$']['Origin'])}
                                                                                                                            {console.log("test1")}</span>
                                                                                                                    </div>
                                                                                                                    <div className='row accordionfarename apiairportname'>
                                                                                                                        <span className='vertical_line'></span>
                                                                                                                        {handleEffectiveDate(packageSelected['air:AirPricingInfo'][0]['air:FareInfo']['$']['DepartureDate'])}
                                                                                                                        {/* {(segmentParsee['$']['DepartureTime'])} */}


                                                                                                                    </div>
                                                                                                                    <div className='row accordionfarename apiairportname'>
                                                                                                                        <span className='apicircle'>◯</span>
                                                                                                                        <span className='airportname'>
                                                                                                                            {handleAirport(packageSelected['air:AirPricingInfo'][0]['air:FareInfo']['$']['Destination'])}
                                                                                                                        </span>
                                                                                                                        <span className='airport'>
                                                                                                                            {handleApiAirport(packageSelected['air:AirPricingInfo'][0]['air:FareInfo']['$']['Destination'])}
                                                                                                                            {console.log("test2")}</span>
                                                                                                                    </div>
                                                                                                                    <div className='baggage-info'>
                                                                                                                        <span className="cabin-baggage">
                                                                                                                            <img src="/img/cabin_bag.svg" alt="Cabin Baggage" className="baggage-icon" /><strong>Cabin Baggage:</strong> {matches && matches[1] ? matches[1] : 'NA'}
                                                                                                                        </span>
                                                                                                                        <span className="checkin-baggage">
                                                                                                                            <img src="/img/checkin_bag.svg" alt="Cabin Baggage" className="baggage-icon" /><strong>Check-In Baggage:</strong> {matches && matches[0] ? matches[0] : 'NA'}
                                                                                                                        </span>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>

                                                                                                        );
                                                                                                    }

                                                                                                })


                                                                                            ) : (
                                                                                                <>
                                                                                                    <div className='row'>
                                                                                                        <div className='accordionfarename col-md-4'>{handleAirport(packageSelected['air:AirPricingInfo'][0]['air:FareInfo']['$']['Origin'])} → {handleAirport(packageSelected['air:AirPricingInfo'][0]['air:FareInfo']['$']['Destination'])}</div>
                                                                                                        <div className="accordionfarecabinclass col-md-3">Not Available</div>
                                                                                                    </div>
                                                                                                </>
                                                                                            )}

                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ) : (null)
                                                                    )

                                                            )

                                                        ) : (
                                                            packageSelected['air:AirPricingInfo']['air:FareInfo'] && (
                                                                Array.isArray(packageSelected['air:AirPricingInfo']['air:FareInfo'])
                                                                    ? (
                                                                        packageSelected['air:AirPricingInfo']['air:FareInfo'].map((fareInfo, fareIndex) => (
                                                                            <div key={fareIndex}>
                                                                                {fareInfo['air:Brand']['air:Text'] ? (
                                                                                    <div className="baggagae_policy">
                                                                                        {fareIndex === 0 &&
                                                                                            <>
                                                                                                <span className='headingpolicies' >
                                                                                                    Flight Details
                                                                                                    <span>
                                                                                                        {/* <button
                                                                                                            type="button"
                                                                                                            className="packagemore"
                                                                                                            data-toggle="modal"
                                                                                                            data-target=".bd-example-modal-lg"
                                                                                                        >
                                                                                                            Package Details
                                                                                                        </button> */}
                                                                                                    </span>
                                                                                                </span>
                                                                                                <div
                                                                                                    className="modal fade bd-example-modal-lg multipleflight"
                                                                                                    tabIndex={-1}
                                                                                                    role="dialog"
                                                                                                    aria-labelledby="myLargeModalLabel"
                                                                                                    aria-hidden="true"
                                                                                                >
                                                                                                    <div className="modal-dialog modal-lg">
                                                                                                        <div className="modal-content">
                                                                                                            <div className="modal-header">
                                                                                                                <h5
                                                                                                                    className="modal-title"
                                                                                                                    id="exampleModalLabel"
                                                                                                                >
                                                                                                                    Selected Package Details
                                                                                                                </h5>
                                                                                                                <button
                                                                                                                    type="button"
                                                                                                                    className="close"
                                                                                                                    data-dismiss="modal"
                                                                                                                    aria-label="Close"
                                                                                                                    style={{ marginLeft: '60%', marginRight: '0', padding: '0' }}

                                                                                                                >
                                                                                                                    <span
                                                                                                                        style={{ width: '9px', height: '10px', display: 'block' }}
                                                                                                                        aria-hidden="true">×</span>
                                                                                                                </button>
                                                                                                            </div>
                                                                                                            <div className="modal-body">
                                                                                                                <div className="row">
                                                                                                                    {packageSelected['air:AirPricingInfo'] && (
                                                                                                                        Array.isArray(packageSelected['air:AirPricingInfo'])
                                                                                                                            ? (
                                                                                                                                packageSelected['air:AirPricingInfo'].map((pricingInfo, pricingIndex) => (
                                                                                                                                    <div key={pricingIndex} className="col-md-6">
                                                                                                                                        {pricingInfo['air:FareInfo'] && (
                                                                                                                                            Array.isArray(pricingInfo['air:FareInfo'])
                                                                                                                                                ? (
                                                                                                                                                    <div >

                                                                                                                                                        {/* {pricingInfo['air:FareInfo'].map((fareInfo, fareIndex) => ( */}
                                                                                                                                                        {pricingInfo['air:FareInfo'][0]['air:Brand']['air:Text'] && (
                                                                                                                                                            Array.isArray(pricingInfo['air:FareInfo'][0]['air:Brand']['air:Text'])
                                                                                                                                                                ? (
                                                                                                                                                                    <div>
                                                                                                                                                                        {pricingInfo['air:FareInfo'][0]['air:Brand']['air:Text'].map((textinfor, textindex) => {
                                                                                                                                                                            if (
                                                                                                                                                                                textinfor['$'] &&
                                                                                                                                                                                textinfor['$']['Type'] === "MarketingConsumer"
                                                                                                                                                                            ) {

                                                                                                                                                                                const infoArray = textinfor['_'].split('\n').filter(item => item.trim() !== '');

                                                                                                                                                                                return (
                                                                                                                                                                                    <div key={textindex} className="panelfare">
                                                                                                                                                                                        <div className='fareaccordion'>
                                                                                                                                                                                            {pricingIndex === 0 ? 'Adult package' : pricingIndex === 1 ? 'Child package' : 'Infant package'}
                                                                                                                                                                                        </div>

                                                                                                                                                                                        <ul>
                                                                                                                                                                                            {infoArray.map((item, index) => (
                                                                                                                                                                                                <li key={index}>{item.trim()}</li>
                                                                                                                                                                                            ))}
                                                                                                                                                                                        </ul>

                                                                                                                                                                                    </div>
                                                                                                                                                                                );
                                                                                                                                                                            }

                                                                                                                                                                        })}
                                                                                                                                                                    </div>
                                                                                                                                                                ) : (
                                                                                                                                                                    <>
                                                                                                                                                                        <div>
                                                                                                                                                                            <div className='fareaccordion'>
                                                                                                                                                                                {pricingIndex === 0 ? 'Adult package' : pricingIndex === 1 ? 'Child package' : 'Infant package'}
                                                                                                                                                                            </div>
                                                                                                                                                                            <div>Not Available</div>
                                                                                                                                                                        </div>
                                                                                                                                                                    </>
                                                                                                                                                                )
                                                                                                                                                        )}
                                                                                                                                                        {/* ))} */}

                                                                                                                                                    </div>

                                                                                                                                                ) : (
                                                                                                                                                    pricingInfo['air:FareInfo']['air:Brand']['air:Text'] && (
                                                                                                                                                        Array.isArray(pricingInfo['air:FareInfo']['air:Brand']['air:Text'])
                                                                                                                                                            ? (
                                                                                                                                                                <div>

                                                                                                                                                                    {pricingInfo['air:FareInfo']['air:Brand']['air:Text'].map((textinfor, textindex) => {
                                                                                                                                                                        if (
                                                                                                                                                                            textinfor['$'] &&
                                                                                                                                                                            textinfor['$']['Type'] === "MarketingConsumer"
                                                                                                                                                                        ) {

                                                                                                                                                                            const infoArray = textinfor['_'].split('\n').filter(item => item.trim() !== '');

                                                                                                                                                                            return (
                                                                                                                                                                                <div key={textindex}>
                                                                                                                                                                                    <div className="panelfare">
                                                                                                                                                                                        <div className='fareaccordion'>
                                                                                                                                                                                            {pricingIndex === 0 ? 'Adult package' : pricingIndex === 1 ? 'Child package' : 'Infant package'}
                                                                                                                                                                                        </div>

                                                                                                                                                                                        <ul>
                                                                                                                                                                                            {infoArray.map((item, index) => (
                                                                                                                                                                                                <li key={index}>{item.trim()}</li>
                                                                                                                                                                                            ))}
                                                                                                                                                                                        </ul>

                                                                                                                                                                                    </div>
                                                                                                                                                                                </div>
                                                                                                                                                                            );
                                                                                                                                                                        }

                                                                                                                                                                    })}

                                                                                                                                                                </div>
                                                                                                                                                            ) : (
                                                                                                                                                                <>
                                                                                                                                                                    <div>
                                                                                                                                                                        <div className='fareaccordion'>
                                                                                                                                                                            {pricingIndex === 0 ? 'Adult package' : pricingIndex === 1 ? 'Child package' : 'Infant package'}
                                                                                                                                                                        </div>
                                                                                                                                                                        <div>Not Available</div>
                                                                                                                                                                    </div>
                                                                                                                                                                </>
                                                                                                                                                            )
                                                                                                                                                    )
                                                                                                                                                )

                                                                                                                                        )}
                                                                                                                                    </div>
                                                                                                                                ))

                                                                                                                            ) : (
                                                                                                                                packageSelected['air:AirPricingInfo']['air:FareInfo'] && (
                                                                                                                                    Array.isArray(packageSelected['air:AirPricingInfo']['air:FareInfo'])
                                                                                                                                        ? (
                                                                                                                                            <div className='col-md-6'>

                                                                                                                                                {/* {packageSelected['air:AirPricingInfo']['air:FareInfo'].map((fareInfo, fareIndex) => ( */}
                                                                                                                                                {packageSelected['air:AirPricingInfo']['air:FareInfo'][0]['air:Brand']['air:Text'] && (
                                                                                                                                                    Array.isArray(packageSelected['air:AirPricingInfo']['air:FareInfo'][0]['air:Brand']['air:Text'])
                                                                                                                                                        ? (
                                                                                                                                                            <div>
                                                                                                                                                                {packageSelected['air:AirPricingInfo']['air:FareInfo'][0]['air:Brand']['air:Text'].map((textinfor, textindex) => {
                                                                                                                                                                    if (
                                                                                                                                                                        textinfor['$'] &&
                                                                                                                                                                        textinfor['$']['Type'] === "MarketingConsumer"
                                                                                                                                                                    ) {

                                                                                                                                                                        const infoArray = textinfor['_'].split('\n').filter(item => item.trim() !== '');

                                                                                                                                                                        return (
                                                                                                                                                                            <div key={textindex} className="panelfare">
                                                                                                                                                                                <div className='fareaccordion'> Adult package </div>

                                                                                                                                                                                <ul>
                                                                                                                                                                                    {infoArray.map((item, index) => (
                                                                                                                                                                                        <li key={index}>{item.trim()}</li>
                                                                                                                                                                                    ))}
                                                                                                                                                                                </ul>

                                                                                                                                                                            </div>
                                                                                                                                                                        );
                                                                                                                                                                    }

                                                                                                                                                                })}
                                                                                                                                                            </div>
                                                                                                                                                        ) : (
                                                                                                                                                            <>
                                                                                                                                                                <div>
                                                                                                                                                                    <div className='fareaccordion'> Adult package </div>
                                                                                                                                                                    <div>Not Available</div>
                                                                                                                                                                </div>
                                                                                                                                                            </>
                                                                                                                                                        )
                                                                                                                                                )}
                                                                                                                                                {/* ))} */}

                                                                                                                                            </div>

                                                                                                                                        ) : (
                                                                                                                                            packageSelected['air:AirPricingInfo']['air:FareInfo']['air:Brand']['air:Text'] && (
                                                                                                                                                Array.isArray(packageSelected['air:AirPricingInfo']['air:FareInfo']['air:Brand']['air:Text'])
                                                                                                                                                    ? (
                                                                                                                                                        <div className='col-md-6'>

                                                                                                                                                            {packageSelected['air:AirPricingInfo']['air:FareInfo']['air:Brand']['air:Text'].map((textinfor, textindex) => {
                                                                                                                                                                if (
                                                                                                                                                                    textinfor['$'] &&
                                                                                                                                                                    textinfor['$']['Type'] === "MarketingConsumer"
                                                                                                                                                                ) {
                                                                                                                                                                    const infoArray = textinfor['_'].split('\n').filter(item => item.trim() !== '');

                                                                                                                                                                    return (
                                                                                                                                                                        <div key={textindex}>
                                                                                                                                                                            <div className="panelfare">
                                                                                                                                                                                <div className='fareaccordion'> Adult package </div>


                                                                                                                                                                                <ul>
                                                                                                                                                                                    {infoArray.map((item, index) => (
                                                                                                                                                                                        <li key={index}>{item.trim()}</li>
                                                                                                                                                                                    ))}
                                                                                                                                                                                </ul>

                                                                                                                                                                            </div>
                                                                                                                                                                        </div>
                                                                                                                                                                    );
                                                                                                                                                                }

                                                                                                                                                            })}

                                                                                                                                                        </div>
                                                                                                                                                    ) : (
                                                                                                                                                        <>
                                                                                                                                                            <div>
                                                                                                                                                                <div className='fareaccordion'> Adult package </div>
                                                                                                                                                                <div>Not Available</div>
                                                                                                                                                            </div>
                                                                                                                                                        </>
                                                                                                                                                    )
                                                                                                                                            )
                                                                                                                                        )

                                                                                                                                )
                                                                                                                            )
                                                                                                                    )}

                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </>
                                                                                        }
                                                                                        <div className='row' style={{ border: '1px solid #e3e3e3', margin: '0% 0%' }}>
                                                                                            <div
                                                                                                className="booking-form bagg-form-details"

                                                                                            >
                                                                                                {Array.isArray(fareInfo['air:Brand']['air:Text'])
                                                                                                    ? (
                                                                                                        fareInfo['air:Brand']['air:Text'].map((textinfor, textindex) => {
                                                                                                            if (
                                                                                                                textinfor['$'] &&
                                                                                                                textinfor['$']['Type'] === "MarketingConsumer"
                                                                                                            ) {

                                                                                                                const infoText = textinfor['_'];
                                                                                                                const matches = infoText.match(/\b\d+\s?(kgs?|kg)\b/gi);

                                                                                                                return (
                                                                                                                    <div key={textindex}>
                                                                                                                        <div className="row accordionfarename apiairportname">
                                                                                                                            <div className="airport-flight-row">
                                                                                                                                {(() => {
                                                                                                                                    const uniqueCarriers1 = new Set();

                                                                                                                                    segmentParse && segmentParse.forEach(segmentinfo => {
                                                                                                                                        uniqueCarriers1.add(segmentinfo['$']['Carrier']);
                                                                                                                                    });

                                                                                                                                    return (
                                                                                                                                        segmentParse &&
                                                                                                                                        Array.from(uniqueCarriers1).map((carrier, index) => (
                                                                                                                                            <div key={index} className="airport-flight-container">
                                                                                                                                                <img
                                                                                                                                                    className="airportairlineimg"
                                                                                                                                                    src={`${CONFIG.DEV_API}/airline_logo_images/${carrier}.png`}
                                                                                                                                                    alt="Airline logo"
                                                                                                                                                    width="30px"
                                                                                                                                                />

                                                                                                                                                <div className="airport-flight-details">
                                                                                                                                                    {(Array.isArray(segmentParse) ? segmentParse : [segmentParse])
                                                                                                                                                        .filter(segmentinfo => segmentinfo?.['$']?.['Carrier'] === carrier)
                                                                                                                                                        .map((segmentinfo, segmentindex) => {
                                                                                                                                                            if (fareIndex === segmentindex) {
                                                                                                                                                                return (
                                                                                                                                                                    <span key={segmentindex} className="airportflightnumber">
                                                                                                                                                                        <span className="airportairline">
                                                                                                                                                                            {handleAirline(segmentinfo['$']['Carrier'])}{" "}
                                                                                                                                                                            {segmentinfo['$']['Carrier']} {segmentinfo['$']['FlightNumber']}
                                                                                                                                                                        </span>
                                                                                                                                                                    </span>
                                                                                                                                                                );
                                                                                                                                                            }
                                                                                                                                                            return null;
                                                                                                                                                        })}
                                                                                                                                                </div>
                                                                                                                                            </div>
                                                                                                                                        ))
                                                                                                                                    );
                                                                                                                                })()}

                                                                                                                                {/* Right-aligned cabin class */}
                                                                                                                                <span className="airport-cabin-class">{classType}</span>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="flight-details-container">
                                                                                                                            <div className='row accordionfarename apiairportname'>
                                                                                                                                <span className='apicircle'>◯</span>
                                                                                                                                <span className='airportname'>
                                                                                                                                    {handleAirport(fareInfo['$']['Origin'])}
                                                                                                                                </span>
                                                                                                                                <span className='airport'>
                                                                                                                                    {handleApiAirport(fareInfo['$']['Origin'])}
                                                                                                                                    {(
                                                                                                                                        (Array.isArray(segmentArray1) ? segmentArray1 : [segmentArray1]).filter(segment => {
                                                                                                                                            // Find the booking info that matches the FareInfoRef
                                                                                                                                            const bookingInfo = packageSelected['air:AirPricingInfo']['air:BookingInfo'].find(
                                                                                                                                                info => info['$']['FareInfoRef'] === fareInfo['$']['Key']
                                                                                                                                            );

                                                                                                                                            // Check if the segment's key matches the booking info's SegmentRef
                                                                                                                                            return bookingInfo && segment['$']['Key'] === bookingInfo['$']['SegmentRef'];
                                                                                                                                        }).map(segment => {
                                                                                                                                            // Find the matching flight details
                                                                                                                                            const matchedFlightDetail = actualFlightDetails.find(flight =>
                                                                                                                                                flight.$?.Origin === segment['$']['Origin'] &&
                                                                                                                                                flight.$?.Destination === segment['$']['Destination'] &&
                                                                                                                                                flight.$?.DepartureTime === segment['$']['DepartureTime'] &&
                                                                                                                                                flight.$?.ArrivalTime === segment['$']['ArrivalTime']
                                                                                                                                            );

                                                                                                                                            return matchedFlightDetail?.$?.OriginTerminal ? ` T-${matchedFlightDetail.$.OriginTerminal}` : null;
                                                                                                                                        })
                                                                                                                                            .filter(Boolean)
                                                                                                                                            .join("")
                                                                                                                                    )}</span>
                                                                                                                            </div>
                                                                                                                            <div className='row accordionfarename apiairportname'>
                                                                                                                                <span className='vertical_line'></span>
                                                                                                                                {handleEffectiveDate(fareInfo['$']['DepartureDate'])}
                                                                                                                                {/* {(segmentParsee['$']['DepartureTime'])} */}

                                                                                                                            </div>
                                                                                                                            <div className='row accordionfarename apiairportname'>
                                                                                                                                <span className='apicircle'>◯</span>
                                                                                                                                <span className='airportname'>
                                                                                                                                    {handleAirport(fareInfo['$']['Destination'])}
                                                                                                                                </span>
                                                                                                                                <span className='airport'>
                                                                                                                                    {handleApiAirport(fareInfo['$']['Destination'])}

                                                                                                                                    {(
                                                                                                                                        (Array.isArray(segmentArray1) ? segmentArray1 : [segmentArray1]).filter(segment => {
                                                                                                                                            // Find the booking info that matches the FareInfoRef
                                                                                                                                            const bookingInfo = packageSelected['air:AirPricingInfo']['air:BookingInfo'].find(
                                                                                                                                                info => info['$']['FareInfoRef'] === fareInfo['$']['Key']
                                                                                                                                            );

                                                                                                                                            // Check if the segment's key matches the booking info's SegmentRef
                                                                                                                                            return bookingInfo && segment['$']['Key'] === bookingInfo['$']['SegmentRef'];
                                                                                                                                        }).map(segment => {
                                                                                                                                            // Find the matching flight details
                                                                                                                                            const matchedFlightDetail = actualFlightDetails.find(flight =>
                                                                                                                                                flight.$?.Origin === segment['$']['Origin'] &&
                                                                                                                                                flight.$?.Destination === segment['$']['Destination'] &&
                                                                                                                                                flight.$?.DepartureTime === segment['$']['DepartureTime'] &&
                                                                                                                                                flight.$?.ArrivalTime === segment['$']['ArrivalTime']
                                                                                                                                            );

                                                                                                                                            return matchedFlightDetail?.$?.DestinationTerminal ? ` T-${matchedFlightDetail.$.DestinationTerminal}` : null;
                                                                                                                                        })
                                                                                                                                            .filter(Boolean)
                                                                                                                                            .join("")
                                                                                                                                    )}</span>
                                                                                                                            </div>
                                                                                                                            <div className='baggage-info'>
                                                                                                                                <span className="cabin-baggage">
                                                                                                                                    <img src="/img/cabin_bag.svg" alt="Cabin Baggage" className="baggage-icon" /><strong>Cabin Baggage:</strong> {matches && matches[1] ? matches[1] : 'NA'}
                                                                                                                                </span>
                                                                                                                                <span className="checkin-baggage">
                                                                                                                                    <img src="/img/checkin_bag.svg" alt="Cabin Baggage" className="baggage-icon" /><strong>Check-In Baggage:</strong> {matches && matches[0] ? matches[0] : 'NA'}
                                                                                                                                </span>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>

                                                                                                                );
                                                                                                            }

                                                                                                        })
                                                                                                    ) : (
                                                                                                        <>
                                                                                                            <div className='row'>
                                                                                                                <div className='accordionfarename col-md-4'>{handleAirport(fareInfo['$']['Origin'])} → {handleAirport(fareInfo['$']['Destination'])}</div>
                                                                                                                <div className="accordionfarecabinclass col-md-3">Not Available</div>
                                                                                                            </div>
                                                                                                        </>
                                                                                                    )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ) : (null)}
                                                                            </div>

                                                                        ))



                                                                    ) : (
                                                                        packageSelected['air:AirPricingInfo']['air:FareInfo']['air:Brand']['air:Text'] ? (
                                                                            <div className="baggagae_policy">
                                                                                <span className='headingpolicies' >
                                                                                    Flight Details
                                                                                    <span>
                                                                                        {/* <button
                                                                                            type="button"
                                                                                            className="packagemore"
                                                                                            data-toggle="modal"
                                                                                            data-target=".bd-example-modal-lg"
                                                                                        >
                                                                                            Package Details
                                                                                        </button> */}
                                                                                    </span>
                                                                                </span>
                                                                                <div
                                                                                    className="modal fade bd-example-modal-lg multipleflight"
                                                                                    tabIndex={-1}
                                                                                    role="dialog"
                                                                                    aria-labelledby="myLargeModalLabel"
                                                                                    aria-hidden="true"
                                                                                >
                                                                                    <div className="modal-dialog modal-lg">
                                                                                        <div className="modal-content">
                                                                                            <div className="modal-header">
                                                                                                <h5
                                                                                                    className="modal-title"
                                                                                                    id="exampleModalLabel"
                                                                                                >
                                                                                                    Flight Details
                                                                                                </h5>
                                                                                                <button
                                                                                                    type="button"
                                                                                                    className="close"
                                                                                                    data-dismiss="modal"
                                                                                                    aria-label="Close"
                                                                                                    style={{ marginLeft: '60%', marginRight: '0', padding: '0' }}

                                                                                                >
                                                                                                    <span style={{ width: '9px', height: '10px', display: 'block' }}
                                                                                                        aria-hidden="true">×</span>
                                                                                                </button>
                                                                                            </div>
                                                                                            <div className="modal-body">
                                                                                                <div className="row">
                                                                                                    {packageSelected['air:AirPricingInfo'] && (
                                                                                                        Array.isArray(packageSelected['air:AirPricingInfo'])
                                                                                                            ? (
                                                                                                                packageSelected['air:AirPricingInfo'].map((pricingInfo, pricingIndex) => (
                                                                                                                    <div key={pricingIndex} className="col-md-6">
                                                                                                                        {pricingInfo['air:FareInfo'] && (
                                                                                                                            Array.isArray(pricingInfo['air:FareInfo'])
                                                                                                                                ? (
                                                                                                                                    <div >

                                                                                                                                        {/* {pricingInfo['air:FareInfo'].map((fareInfo, fareIndex) => ( */}
                                                                                                                                        {pricingInfo['air:FareInfo'][0]['air:Brand']['air:Text'] && (
                                                                                                                                            Array.isArray(pricingInfo['air:FareInfo'][0]['air:Brand']['air:Text'])
                                                                                                                                                ? (
                                                                                                                                                    <div>
                                                                                                                                                        {pricingInfo['air:FareInfo'][0]['air:Brand']['air:Text'].map((textinfor, textindex) => {
                                                                                                                                                            if (
                                                                                                                                                                textinfor['$'] &&
                                                                                                                                                                textinfor['$']['Type'] === "MarketingConsumer"
                                                                                                                                                            ) {

                                                                                                                                                                const infoArray = textinfor['_'].split('\n').filter(item => item.trim() !== '');

                                                                                                                                                                return (
                                                                                                                                                                    <div key={textindex} className="panelfare">
                                                                                                                                                                        <div className='fareaccordion'>
                                                                                                                                                                            {pricingIndex === 0 ? 'Adult package' : pricingIndex === 1 ? 'Child package' : 'Infant package'}
                                                                                                                                                                        </div>

                                                                                                                                                                        <ul>
                                                                                                                                                                            {infoArray.map((item, index) => (
                                                                                                                                                                                <li key={index}>{item.trim()}</li>
                                                                                                                                                                            ))}
                                                                                                                                                                        </ul>

                                                                                                                                                                    </div>
                                                                                                                                                                );
                                                                                                                                                            }

                                                                                                                                                        })}
                                                                                                                                                    </div>
                                                                                                                                                ) : (
                                                                                                                                                    <>
                                                                                                                                                        <div>
                                                                                                                                                            <div className='fareaccordion'>
                                                                                                                                                                {pricingIndex === 0 ? 'Adult package' : pricingIndex === 1 ? 'Child package' : 'Infant package'}
                                                                                                                                                            </div>
                                                                                                                                                            <div>Not Available</div>
                                                                                                                                                        </div>
                                                                                                                                                    </>
                                                                                                                                                )
                                                                                                                                        )}
                                                                                                                                        {/* ))} */}

                                                                                                                                    </div>

                                                                                                                                ) : (
                                                                                                                                    pricingInfo['air:FareInfo']['air:Brand']['air:Text'] && (
                                                                                                                                        Array.isArray(pricingInfo['air:FareInfo']['air:Brand']['air:Text'])
                                                                                                                                            ? (
                                                                                                                                                <div>

                                                                                                                                                    {pricingInfo['air:FareInfo']['air:Brand']['air:Text'].map((textinfor, textindex) => {
                                                                                                                                                        if (
                                                                                                                                                            textinfor['$'] &&
                                                                                                                                                            textinfor['$']['Type'] === "MarketingConsumer"
                                                                                                                                                        ) {

                                                                                                                                                            const infoArray = textinfor['_'].split('\n').filter(item => item.trim() !== '');

                                                                                                                                                            return (
                                                                                                                                                                <div key={textindex}>
                                                                                                                                                                    <div className="panelfare">
                                                                                                                                                                        <div className='fareaccordion'>
                                                                                                                                                                            {pricingIndex === 0 ? 'Adult package' : pricingIndex === 1 ? 'Child package' : 'Infant package'}
                                                                                                                                                                        </div>

                                                                                                                                                                        <ul>
                                                                                                                                                                            {infoArray.map((item, index) => (
                                                                                                                                                                                <li key={index}>{item.trim()}</li>
                                                                                                                                                                            ))}
                                                                                                                                                                        </ul>

                                                                                                                                                                    </div>
                                                                                                                                                                </div>
                                                                                                                                                            );
                                                                                                                                                        }

                                                                                                                                                    })}

                                                                                                                                                </div>
                                                                                                                                            ) : (
                                                                                                                                                <>
                                                                                                                                                    <div>
                                                                                                                                                        <div className='fareaccordion'>
                                                                                                                                                            {pricingIndex === 0 ? 'Adult package' : pricingIndex === 1 ? 'Child package' : 'Infant package'}
                                                                                                                                                        </div>
                                                                                                                                                        <div>Not Available</div>
                                                                                                                                                    </div>
                                                                                                                                                </>
                                                                                                                                            )
                                                                                                                                    )
                                                                                                                                )

                                                                                                                        )}
                                                                                                                    </div>
                                                                                                                ))

                                                                                                            ) : (
                                                                                                                packageSelected['air:AirPricingInfo']['air:FareInfo'] && (
                                                                                                                    Array.isArray(packageSelected['air:AirPricingInfo']['air:FareInfo'])
                                                                                                                        ? (
                                                                                                                            <div className='col-md-6'>

                                                                                                                                {/* {packageSelected['air:AirPricingInfo']['air:FareInfo'].map((fareInfo, fareIndex) => ( */}
                                                                                                                                {packageSelected['air:AirPricingInfo']['air:FareInfo'][0]['air:Brand']['air:Text'] && (
                                                                                                                                    Array.isArray(packageSelected['air:AirPricingInfo']['air:FareInfo'][0]['air:Brand']['air:Text'])
                                                                                                                                        ? (
                                                                                                                                            <div>
                                                                                                                                                {packageSelected['air:AirPricingInfo']['air:FareInfo'][0]['air:Brand']['air:Text'].map((textinfor, textindex) => {
                                                                                                                                                    if (
                                                                                                                                                        textinfor['$'] &&
                                                                                                                                                        textinfor['$']['Type'] === "MarketingConsumer"
                                                                                                                                                    ) {

                                                                                                                                                        const infoArray = textinfor['_'].split('\n').filter(item => item.trim() !== '');

                                                                                                                                                        return (
                                                                                                                                                            <div key={textindex} className="panelfare">
                                                                                                                                                                <div className='fareaccordion'> Adult package </div>

                                                                                                                                                                <ul>
                                                                                                                                                                    {infoArray.map((item, index) => (
                                                                                                                                                                        <li key={index}>{item.trim()}</li>
                                                                                                                                                                    ))}
                                                                                                                                                                </ul>

                                                                                                                                                            </div>
                                                                                                                                                        );
                                                                                                                                                    }

                                                                                                                                                })}
                                                                                                                                            </div>
                                                                                                                                        ) : (
                                                                                                                                            <>
                                                                                                                                                <div>
                                                                                                                                                    <div className='fareaccordion'> Adult package </div>
                                                                                                                                                    <div>Not Available</div>
                                                                                                                                                </div>
                                                                                                                                            </>
                                                                                                                                        )
                                                                                                                                )}
                                                                                                                                {/* ))} */}

                                                                                                                            </div>

                                                                                                                        ) : (
                                                                                                                            packageSelected['air:AirPricingInfo']['air:FareInfo']['air:Brand']['air:Text'] && (
                                                                                                                                Array.isArray(packageSelected['air:AirPricingInfo']['air:FareInfo']['air:Brand']['air:Text'])
                                                                                                                                    ? (
                                                                                                                                        <div className='col-md-6'>

                                                                                                                                            {packageSelected['air:AirPricingInfo']['air:FareInfo']['air:Brand']['air:Text'].map((textinfor, textindex) => {
                                                                                                                                                if (
                                                                                                                                                    textinfor['$'] &&
                                                                                                                                                    textinfor['$']['Type'] === "MarketingConsumer"
                                                                                                                                                ) {
                                                                                                                                                    const infoArray = textinfor['_'].split('\n').filter(item => item.trim() !== '');

                                                                                                                                                    return (
                                                                                                                                                        <div key={textindex} >
                                                                                                                                                            <div className="panelfare">
                                                                                                                                                                <div className='fareaccordion'> Adult package </div>


                                                                                                                                                                <ul>
                                                                                                                                                                    {infoArray.map((item, index) => (
                                                                                                                                                                        <li key={index}>{item.trim()}</li>
                                                                                                                                                                    ))}
                                                                                                                                                                </ul>

                                                                                                                                                            </div>
                                                                                                                                                        </div>
                                                                                                                                                    );
                                                                                                                                                }

                                                                                                                                            })}

                                                                                                                                        </div>
                                                                                                                                    ) : (
                                                                                                                                        <>
                                                                                                                                            <div>
                                                                                                                                                <div className='fareaccordion'> Adult package </div>
                                                                                                                                                <div>Not Available</div>
                                                                                                                                            </div>
                                                                                                                                        </>
                                                                                                                                    )
                                                                                                                            )
                                                                                                                        )

                                                                                                                )
                                                                                                            )
                                                                                                    )}

                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='row' style={{ border: '1px solid #e3e3e3', margin: '0% 0%' }}>
                                                                                    <div
                                                                                        className="booking-form bagg-form-details"

                                                                                    >
                                                                                        {Array.isArray(packageSelected['air:AirPricingInfo']['air:FareInfo']['air:Brand']['air:Text'])
                                                                                            ? (
                                                                                                packageSelected['air:AirPricingInfo']['air:FareInfo']['air:Brand']['air:Text'].map((textinfor, textindex) => {
                                                                                                    if (
                                                                                                        textinfor['$'] &&
                                                                                                        textinfor['$']['Type'] === "MarketingConsumer"
                                                                                                    ) {
                                                                                                        const infoText = textinfor['_'];
                                                                                                        const matches = infoText.match(/\b\d+\s?(kgs?|kg)\b/gi);

                                                                                                        return (
                                                                                                            <div key={textindex}>
                                                                                                                <div className="row accordionfarename apiairportname">
                                                                                                                    <div className="airport-flight-row">
                                                                                                                        {(() => {
                                                                                                                            const uniqueCarriers1 = new Set();

                                                                                                                            if (Array.isArray(segmentParse)) {
                                                                                                                                segmentParse.forEach(segmentinfo => {
                                                                                                                                    uniqueCarriers1.add(segmentinfo['$']['Carrier']);
                                                                                                                                });
                                                                                                                            } else if (segmentParse && segmentParse['$'] && segmentParse['$']['Carrier']) {
                                                                                                                                uniqueCarriers1.add(segmentParse['$']['Carrier']);
                                                                                                                            }

                                                                                                                            return (
                                                                                                                                segmentParse &&
                                                                                                                                Array.from(uniqueCarriers1).map((carrier, index) => (
                                                                                                                                    <div key={index} className="airport-flight-container">
                                                                                                                                        <img
                                                                                                                                            className="airportairlineimg"
                                                                                                                                            src={`${CONFIG.DEV_API}/airline_logo_images/${carrier}.png`}
                                                                                                                                            alt="Airline logo"
                                                                                                                                            width="30px"
                                                                                                                                        />

                                                                                                                                        <div className="airport-flight-details">
                                                                                                                                            {Array.isArray(segmentParse)
                                                                                                                                                ? segmentParse
                                                                                                                                                    .filter(segmentinfo => segmentinfo['$']['Carrier'] === carrier)
                                                                                                                                                    .map((segmentinfo, segmentindex) => (
                                                                                                                                                        <span key={segmentindex} className="airportflightnumber">
                                                                                                                                                            <span className="airportairline">
                                                                                                                                                                {handleAirline(segmentinfo['$']['Carrier'])}
                                                                                                                                                            </span>{" "}
                                                                                                                                                            {segmentindex > 0 && ", "}
                                                                                                                                                            {segmentinfo['$']['Carrier']} {segmentinfo['$']['FlightNumber']}
                                                                                                                                                        </span>
                                                                                                                                                    ))
                                                                                                                                                : segmentParse['$']['Carrier'] === carrier && (
                                                                                                                                                    <span className="airportflightnumber">
                                                                                                                                                        <span className="airportairline">
                                                                                                                                                            {handleAirline(segmentParse['$']['Carrier'])}
                                                                                                                                                            {" "}
                                                                                                                                                            {segmentParse['$']['Carrier']} {segmentParse['$']['FlightNumber']}
                                                                                                                                                        </span>

                                                                                                                                                    </span>
                                                                                                                                                )}
                                                                                                                                        </div>
                                                                                                                                    </div>
                                                                                                                                ))
                                                                                                                            );
                                                                                                                        })()}

                                                                                                                        {/* Right-aligned cabin class */}
                                                                                                                        <span className="airport-cabin-class">{classType}</span>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="flight-details-container">
                                                                                                                    <div className='row accordionfarename apiairportname'>
                                                                                                                        <span className='apicircle'>◯</span>
                                                                                                                        <span className='airportname'>
                                                                                                                            {handleAirport(packageSelected['air:AirPricingInfo']['air:FareInfo']['$']['Origin'])}
                                                                                                                        </span>
                                                                                                                        <span className='airport'>
                                                                                                                            {handleApiAirport(packageSelected['air:AirPricingInfo']['air:FareInfo']['$']['Origin'])}
                                                                                                                            {(Array.isArray(segmentArray1) ? segmentArray1 : [segmentArray1]).map((segment, index) => {
                                                                                                                                const isSegmentMatched = segment['$']['Key'] === packageSelected['air:AirSegmentRef']['$']['Key'];
                                                                                                                                if (isSegmentMatched) {

                                                                                                                                    const matchedFlightDetail = actualFlightDetails.find(flight =>
                                                                                                                                        flight.$?.Origin === segment['$']['Origin'] &&
                                                                                                                                        flight.$?.Destination === segment['$']['Destination'] &&
                                                                                                                                        flight.$?.DepartureTime === segment['$']['DepartureTime'] &&
                                                                                                                                        flight.$?.ArrivalTime === segment['$']['ArrivalTime']
                                                                                                                                    );

                                                                                                                                    console.log("Matched Flight Detail:", matchedFlightDetail);

                                                                                                                                    return matchedFlightDetail?.$?.OriginTerminal ? `T-${matchedFlightDetail.$.OriginTerminal}` : null;
                                                                                                                                } else {
                                                                                                                                    return null;
                                                                                                                                }
                                                                                                                            })}

                                                                                                                        </span>
                                                                                                                    </div>
                                                                                                                    <div className='row accordionfarename apiairportname'>
                                                                                                                        <span className='vertical_line'>  </span>
                                                                                                                        {handleEffectiveDate(packageSelected['air:AirPricingInfo']['air:FareInfo']['$']['DepartureDate'])}
                                                                                                                        {/* {(segmentParsee['$']['DepartureTime'])} */}

                                                                                                                    </div>

                                                                                                                    <div className='row accordionfarename apiairportname'>
                                                                                                                        <span className='apicircle'>◯</span>
                                                                                                                        <span className='airportname'>
                                                                                                                            {handleAirport(packageSelected['air:AirPricingInfo']['air:FareInfo']['$']['Destination'])}
                                                                                                                        </span>
                                                                                                                        <span className='airport'>
                                                                                                                            {handleApiAirport(packageSelected['air:AirPricingInfo']['air:FareInfo']['$']['Destination'])}
                                                                                                                            {(Array.isArray(segmentArray1) ? segmentArray1 : [segmentArray1]).map((segment, index) => {
                                                                                                                                const isSegmentMatched = segment['$']['Key'] === packageSelected['air:AirSegmentRef']['$']['Key'];
                                                                                                                                if (isSegmentMatched) {
                                                                                                                                    const matchedFlightDetail = actualFlightDetails.find(flight =>
                                                                                                                                        flight.$?.Origin === segment['$']['Origin'] &&
                                                                                                                                        flight.$?.Destination === segment['$']['Destination'] &&
                                                                                                                                        flight.$?.DepartureTime === segment['$']['DepartureTime'] &&
                                                                                                                                        flight.$?.ArrivalTime === segment['$']['ArrivalTime']
                                                                                                                                    );
                                                                                                                                    return matchedFlightDetail?.$?.DestinationTerminal ? ` T-${matchedFlightDetail.$.DestinationTerminal}` : null;
                                                                                                                                } else {
                                                                                                                                    return null;
                                                                                                                                }
                                                                                                                            })}</span>
                                                                                                                    </div>
                                                                                                                    <div className='baggage-info'>
                                                                                                                        <span className="cabin-baggage">
                                                                                                                            <img src="/img/cabin_bag.svg" alt="Cabin Baggage" className="baggage-icon" /><strong>Cabin Baggage:</strong> {matches && matches[1] ? matches[1] : 'NA'}
                                                                                                                        </span>
                                                                                                                        <span className="checkin-baggage">
                                                                                                                            <img src="/img/checkin_bag.svg" alt="Cabin Baggage" className="baggage-icon" /><strong>Check-In Baggage:</strong> {matches && matches[0] ? matches[0] : 'NA'}
                                                                                                                        </span>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        );
                                                                                                    }

                                                                                                })
                                                                                            ) : (
                                                                                                <>
                                                                                                    <div className='row'>
                                                                                                        <div className='accordionfarename col-md-4'>{handleAirport(packageSelected['air:AirPricingInfo']['air:FareInfo']['$']['Origin'])} → {handleAirport(packageSelected['air:AirPricingInfo']['air:FareInfo']['$']['Destination'])}</div>
                                                                                                        <div className="accordionfarecabinclass col-md-3">Not Available</div>
                                                                                                    </div>
                                                                                                </>
                                                                                            )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ) : (null)
                                                                    )

                                                            )
                                                        )
                                                )}
                                                <div className="table-container">
                                                    <h1>Cancellation / Date Change Charges</h1>
                                                    <table className="styled-table">
                                                        <thead>
                                                            <tr>
                                                                <th>
                                                                    Cancellation <br />
                                                                    {/* <span className="sub-header">(From Scheduled flight departure)</span> */}
                                                                </th>
                                                                <th>
                                                                    Date Change <br />
                                                                    {/* <span className="sub-header">(Per passenger)</span> */}
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    {cancellationPolicy?.Cancellation?.find((policy) => policy.fare_name === fareFamily)?.fee || "N/A"}
                                                                </td>
                                                                <td>
                                                                    {cancellationPolicy?.Date_Change?.find((policy) => policy.fare_name === fareFamily)?.fee || "N/A"}
                                                                </td>
                                                            </tr>

                                                        </tbody>
                                                    </table>
                                                    <p className="note">* From the Time of Departure</p>
                                                </div>

                                                {/* <div className="table-container">
                                                    <h1>Cancellation Charges</h1>
                                                    <table className="styled-table">
                                                        <thead>
                                                        <tr>
                                                            <th>
                                                            Time frame <br />
                                                            <span className="sub-header">(From Scheduled flight departure)</span>
                                                            </th>
                                                            <th>
                                                            Airline fee <br />
                                                            <span className="sub-header">(Per passenger)</span>
                                                            </th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {Array.isArray(packageSelected['air:AirPricingInfo']) ? (
                                                            packageSelected['air:AirPricingInfo'].flatMap((pricingInfo) =>
                                                            Array.isArray(pricingInfo['air:CancelPenalty']) ? (
                                                                pricingInfo['air:CancelPenalty'].map((cancelpolicy, cancelindex) => (
                                                                <tr key={cancelindex}>
                                                                    <td>
                                                                    {cancelpolicy?.['$']?.['PenaltyApplies'] || 'NA'}
                                                                    </td>
                                                                    <td>
                                                                    {(cancelpolicy?.['air:Amount'] || 'NA').includes('INR') ? '₹ ' : ''}
                                                                    {(cancelpolicy?.['air:Amount'] || 'NA').replace('INR', '')}
                                                                    </td>
                                                                </tr>
                                                                ))
                                                            ) : (
                                                                <tr key={'single'}>
                                                                <td>
                                                                    {pricingInfo?.['air:CancelPenalty']?.['$']?.['PenaltyApplies'] || 'NA'}
                                                                </td>
                                                                <td>
                                                                    {(pricingInfo?.['air:CancelPenalty']?.['air:Amount'] || 'NA').includes('INR') ? '₹ ' : ''}
                                                                    {(pricingInfo?.['air:CancelPenalty']?.['air:Amount'] || 'NA').replace('INR', '')}
                                                                </td>
                                                                </tr>
                                                            )
                                                            )
                                                        ) : (
                                                            Array.isArray(packageSelected['air:AirPricingInfo']['air:CancelPenalty']) ? (
                                                            packageSelected['air:AirPricingInfo']['air:CancelPenalty'].map((cancelpolicy, cancelindex) => (
                                                                <tr key={cancelindex}>
                                                                <td>
                                                                    {cancelpolicy?.['$']?.['PenaltyApplies'] || 'NA'}
                                                                </td>
                                                                <td>
                                                                    {(cancelpolicy?.['air:Amount'] || 'NA').includes('INR') ? '₹ ' : ''}
                                                                    {(cancelpolicy?.['air:Amount'] || 'NA').replace('INR', '')}
                                                                </td>
                                                                </tr>
                                                            ))
                                                            ) : (
                                                            <tr key={'single'}>
                                                                <td>
                                                                {packageSelected['air:AirPricingInfo']?.['air:CancelPenalty']?.['$']?.['PenaltyApplies'] || 'NA'}
                                                                </td>
                                                                <td>
                                                                {(packageSelected['air:AirPricingInfo']?.['air:CancelPenalty']?.['air:Amount'] || 'NA').includes('INR') ? '₹ ' : ''}
                                                                {(packageSelected['air:AirPricingInfo']?.['air:CancelPenalty']?.['air:Amount'] || 'NA').replace('INR', '')}
                                                                </td>
                                                            </tr>
                                                            )
                                                        )}
                                                        </tbody>
                                                    </table>
                                                    <p className="note">* From the Time of Departure</p>
                                                </div> */}
                                                {/* <p className="highlighted-note">
                                                <strong>*Important:</strong> The airline fee is indicative. Cotrav does not guarantee the accuracy of this information.
                                                    All fees mentioned are per passenger. All Refunds are airline approval.
                                                </p>
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
                                                <div className="cancellation-container">
            <p className="cancellation-title">CANCELLATION</p>
            <p className="cancellation-info">
                You are eligible for full cancellation with just <strong>INR 315.0</strong> + convenience fees (per passenger) being charged as airline refund applicable fee if you cancel within <strong>05:07 hrs</strong>
            </p>

            <div className="flight-info">
                <p style={{ marginBottom:'0'}}><strong>Mumbai ➝ Delhi</strong> 18 Feb, AIR INDIA</p>
                
            </div>

            
            <table className="cancellation-table">
    <tbody>
        <tr>
            <td className="bullet black">&#9679;</td>
            <td>
                <p className="rule-header">Booking Date - 24 Hr(s) to Departure</p>
                <p className="rule-time">Till Mon Feb 17 21:00:00 2025 (Departure City TimeZone)</p>
            </td>
            <td className="charges">Cancellation Charges: ₹ 262.0/Adult</td>
        </tr>
        <tr>
            <td className="bullet orange">&#9679;</td>
            <td>
                <p className="rule-header">24 Hr(s) - 2 Hr(s) to Departure</p>
                <p className="rule-time">Till Tue Feb 18 19:00:00 2025 (Departure City TimeZone)</p>
            </td>
            <td className="charges">Cancellation Charges: ₹ 524.0/Adult</td>
        </tr>
        <tr>
            <td className="bullet red">&#9679;</td>
            <td>
                <p className="rule-header">2 Hr(s) - Departure time</p>
                <p className="rule-time">Till Tue Feb 18 21:00:00 2025 (Departure City TimeZone)</p>
            </td>
            <td>
                <p className="rule-header" style={{ marginLeft: '59%', color: 'red'}}>Non-Refundable</p>
                <p className="rule-details" style={{ marginLeft: '40%'}}>The airline does not allow cancellation during this time window.</p>
            </td>
        </tr>
    </tbody>
</table>

            <ul className="policy-list">
                <li>The airline cancellation penalty is subject to change and will be based on the policy in effect at the time of cancellation.</li>
                <li>Airline charges a cancellation fees when you cancel in a particular time window.</li>
                <li>Insurance, donation and convenience fees are non-refundable.</li>
            </ul>

            <div className="cancellation-buttons">
                <button className="full-cancel-btn">FULL CANCELLATION</button>
                <button className="partial-cancel-btn">PARTIAL CANCELLATION</button>
            </div>
        </div> */}


                                                {/* <div className="table-container">
                                                    <h1>Date Change Charges</h1>
                                                    <table className="styled-table">
                                                        <thead>
                                                        <tr>
                                                            <th>
                                                            Time frame <br />
                                                            <span className="sub-header">(From Scheduled flight departure)</span>
                                                            </th>
                                                            <th>
                                                            Airline fee + Fare difference<br />
                                                            <span className="sub-header">(Per passenger)</span>
                                                            </th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                            {Array.isArray(packageSelected['air:AirPricingInfo']) ? (
                                                                packageSelected['air:AirPricingInfo'].flatMap((pricingInfo) =>
                                                                Array.isArray(pricingInfo['air:ChangePenalty']) ? (
                                                                    pricingInfo['air:ChangePenalty'].map((changepolicy, changeindex) => (
                                                                    <tr key={changeindex}>
                                                                        <td>
                                                                        {changepolicy?.['$']?.['PenaltyApplies'] || 'NA'}
                                                                        </td>
                                                                        <td>
                                                                        {(changepolicy?.['air:Amount'] || 'NA').includes('INR') ? '₹ ' : ''}
                                                                        {(changepolicy?.['air:Amount'] || 'NA').replace('INR', '')}
                                                                        </td>
                                                                    </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr key={'single-change'}>
                                                                    <td>
                                                                        {pricingInfo?.['air:ChangePenalty']?.['$']?.['PenaltyApplies'] || 'NA'}
                                                                    </td>
                                                                    <td>
                                                                        {(pricingInfo?.['air:ChangePenalty']?.['air:Amount'] || 'NA').includes('INR') ? '₹ ' : ''}
                                                                        {(pricingInfo?.['air:ChangePenalty']?.['air:Amount'] || 'NA').replace('INR', '')}
                                                                    </td>
                                                                    </tr>
                                                                )
                                                                )
                                                            ) : (
                                                                Array.isArray(packageSelected['air:AirPricingInfo']['air:ChangePenalty']) ? (
                                                                packageSelected['air:AirPricingInfo']['air:ChangePenalty'].map((changepolicy, changeindex) => (
                                                                    <tr key={changeindex}>
                                                                    <td>
                                                                        {changepolicy?.['$']?.['PenaltyApplies'] || 'NA'}
                                                                    </td>
                                                                    <td>
                                                                        {(changepolicy?.['air:Amount'] || 'NA').includes('INR') ? '₹ ' : ''}
                                                                        {(changepolicy?.['air:Amount'] || 'NA').replace('INR', '')}
                                                                    </td>
                                                                    </tr>
                                                                ))
                                                                ) : (
                                                                <tr key={'single-change'}>
                                                                    <td>
                                                                    {packageSelected['air:AirPricingInfo']?.['air:ChangePenalty']?.['$']?.['PenaltyApplies'] || 'NA'}
                                                                    </td>
                                                                    <td>
                                                                    {(packageSelected['air:AirPricingInfo']?.['air:ChangePenalty']?.['air:Amount'] || 'NA').includes('INR') ? '₹ ' : ''}
                                                                    {(packageSelected['air:AirPricingInfo']?.['air:ChangePenalty']?.['air:Amount'] || 'NA').replace('INR', '')}
                                                                    </td>
                                                                </tr>
                                                                )
                                                            )}
                                                            </tbody>

                                                    </table>
                                                </div>
                                                <p className="highlighted-note">
                                                <strong>*Important:</strong>The airline fee is indicative. Cotrav does not guarantee the accuracy of this information.
                                                    All fees mentioned are per passenger. Date change charges are applicable only on selecting the same airline on
                                                    a new date. The difference in fares between the old & the new booking will also be payable by the user.
                                                    Please refer to the date change charges section above for details on the number of allowd free date changes
                                                    if applicable
                                                </p> */}
                                                {/* <div className="booking-devider" /> */}
                                                <form ref={formRef} onSubmit={(e) => handlePassengerSubmit(e)} style={{ marginTop: '1%' }}>
                                                    <input
                                                        type="hidden"
                                                        name="_token"
                                                        defaultValue="i4raLr6oEg0tP0rBiDGwtSpV4Wfesa5PiCq222sR"
                                                    />{" "}
                                                    <div>
                                                        <Accordion defaultExpanded expanded={accordion1Expanded} onChange={(event, isExpanded) => setAccordion1Expanded(isExpanded)}>
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon />}
                                                                aria-controls="panel1-content"
                                                                id="panel1-header"
                                                                className="accordion"
                                                            >
                                                                <img
                                                                    src="/img/taxivaxi/meal_seats/user_icon.svg"
                                                                    width="15px"
                                                                />&nbsp;
                                                                Passenger Details &nbsp;&nbsp;
                                                                <span className='govid'> Important: Enter name as mentioned on your passport or Government approved IDs.</span>
                                                            </AccordionSummary>
                                                            <AccordionDetails>

                                                                <div className="" id="">
                                                                    {Passengerarray && Passengerarray.map((passengerinfo, passengerindex) => (
                                                                        <div key={passengerindex}>
                                                                            <div id="totalPassenger" data-totalpassenger={1} />
                                                                            <input type="hidden" name="passengerkey[]" value={passengerinfo.Key} />
                                                                            <input type="hidden" name="passengercode[]" value={passengerinfo.Code} />
                                                                            <h1 style={{ backgroundColor: "#fff", marginLeft: 5, marginTop: 10 }}>
                                                                                {passengerinfo.Code === "ADT" ? `Adult (${passengerindex + 1})` : passengerinfo.Code === "INF" ? `Infant (${passengerindex + 1})` : `Child (${passengerindex + 1})`}
                                                                            </h1>
                                                                            <div className="booking-container1">
                                                                                {/* First Row: Prefix, First Name, Last Name */}
                                                                                <div className="booking-row">
                                                                                    <div className="booking-field booking-prefix">
                                                                                        <label>Prefix</label>
                                                                                        <div className="form-calendar1">
                                                                                            <select

                                                                                                name="adult_prefix[]"
                                                                                                data-index={passengerindex}
                                                                                                readOnly={bookingid}
                                                                                                defaultValue={emptaxivaxi?.[passengerindex]?.gender === "Female" ? "Mrs" : "Mr"}
                                                                                            >
                                                                                                <option value="Mr" selected={emptaxivaxi?.[passengerindex]?.gender === "Male"}>Mr.</option>
                                                                                                <option value="Mrs" selected={emptaxivaxi?.[passengerindex]?.gender === "Female"}>Mrs.</option>
                                                                                            </select>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="booking-field booking-name">
                                                                                        <label>First Name<span className="mandatory-star">*</span></label>
                                                                                        <input
                                                                                            type="text"
                                                                                            name="adult_first_name[]"
                                                                                            onKeyPress={handleKeyPress}
                                                                                            data-index={passengerindex}
                                                                                            readOnly={bookingid}
                                                                                            defaultValue={
                                                                                                emptaxivaxi?.[passengerindex]?.people_name
                                                                                                    ? (emptaxivaxi[passengerindex].people_name.trim().includes(' ')
                                                                                                        ? emptaxivaxi[passengerindex].people_name.trim().split(' ').slice(0, -1).join(' ').trim()
                                                                                                        : emptaxivaxi[passengerindex].people_name.trim()) // If only one word, use the same for first name
                                                                                                    : ''
                                                                                            }
                                                                                        // defaultValue={
                                                                                        //     emptaxivaxi?.[passengerindex]?.people_name
                                                                                        //         ? emptaxivaxi[passengerindex].people_name.trim().split(' ').slice(0, -1).join(' ').trim()
                                                                                        //         : ''
                                                                                        // }
                                                                                        />
                                                                                        <span className="error-message adult_first_name-message" data-index={passengerindex} style={{ display: "none", color: "red", fontWeight: "normal" }}>
                                                                                            Please enter the First name.
                                                                                        </span>
                                                                                    </div>

                                                                                    <div className="booking-field booking-name">
                                                                                        <label>Last Name<span className="mandatory-star">*</span></label>
                                                                                        <input
                                                                                            type="text"
                                                                                            name="adult_last_name[]"
                                                                                            onKeyPress={handleKeyPress}
                                                                                            data-index={passengerindex}
                                                                                            readOnly={bookingid}
                                                                                            defaultValue={
                                                                                                emptaxivaxi?.[passengerindex]?.people_name
                                                                                                    ? (emptaxivaxi[passengerindex].people_name.trim().includes(' ')
                                                                                                        ? emptaxivaxi[passengerindex].people_name.trim().split(' ').pop()
                                                                                                        : emptaxivaxi[passengerindex].people_name.trim()) // If only one word, use the same for last name
                                                                                                    : ''
                                                                                            }
                                                                                        // defaultValue={
                                                                                        //     emptaxivaxi?.[passengerindex]?.people_name
                                                                                        //         ? emptaxivaxi[passengerindex].people_name.trim().split(' ').pop()
                                                                                        //         : ''
                                                                                        // }
                                                                                        />
                                                                                        <span className="error-message adult_last_name-message" data-index={passengerindex} style={{ display: "none", color: "red", fontWeight: "normal" }}>
                                                                                            Please enter the last name.
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="booking-form-i" style={{ display: "none" }}> {/* Hide the entire field */}
                                                                                        <input
                                                                                            type="date"
                                                                                            name="adult_age[]"
                                                                                            max={maxDate}
                                                                                            data-index={passengerindex}
                                                                                            readOnly={bookingid}
                                                                                            defaultValue={
                                                                                                emptaxivaxi &&
                                                                                                    emptaxivaxi[passengerindex] &&
                                                                                                    emptaxivaxi[passengerindex]['date_of_birth']
                                                                                                    ? emptaxivaxi[passengerindex]['date_of_birth']
                                                                                                    : new Date(new Date().setFullYear(new Date().getFullYear() - 99))
                                                                                                        .toISOString()
                                                                                                        .split("T")[0] // Converts to YYYY-MM-DD format
                                                                                            }
                                                                                        />
                                                                                    </div>

                                                                                </div>

                                                                                {/* Second Row: Email, Mobile, Gender */}
                                                                                <div className="booking-row">
                                                                                    <div className="booking-field booking-email">
                                                                                        <label>Email ID</label>
                                                                                        <input
                                                                                            type="email"
                                                                                            name="email1"
                                                                                            data-index={passengerindex}
                                                                                            placeholder=""
                                                                                            readOnly={bookingid}
                                                                                            defaultValue={emptaxivaxi?.[0]?.people_email || ''}
                                                                                        />
                                                                                        <span className="error-message">Please enter Email ID.</span>
                                                                                    </div>

                                                                                    <div className="booking-field booking-mobile">
                                                                                        <label>Mobile Number</label>
                                                                                        <div className="mobile-input-wrapper">
                                                                                            <PhoneInput
                                                                                                international
                                                                                                defaultCountry="IN" // Default country set to India
                                                                                                value={value || (emptaxivaxi?.[0]?.people_contact ? `+91${emptaxivaxi[0].people_contact}` : '')} // Ensure +91 prefix
                                                                                                data-index={passengerindex}
                                                                                                onChange={handleChange}
                                                                                                className="phone-input"
                                                                                                placeholder="Enter phone number"
                                                                                                readOnly={bookingid}
                                                                                                name="contact_details1"
                                                                                            />
                                                                                        </div>
                                                                                        <span className="error-message">
                                                                                            {value && !isValidPhoneNumber(value) && "Please enter a valid Mobile Number."}
                                                                                        </span>
                                                                                    </div>

                                                                                    <div className="booking-field booking-gender">
                                                                                        <label>Gender</label>
                                                                                        <div className="form-calendar1">
                                                                                            <select
                                                                                                name="adult_gender[]"
                                                                                                data-index={passengerindex}
                                                                                                // disabled = {bookingid}
                                                                                                style={{ pointerEvents: bookingid ? 'none' : 'auto' }}
                                                                                                defaultValue={emptaxivaxi?.[passengerindex]?.gender === "Female" ? 'F' : 'M'}
                                                                                            >
                                                                                                <option value="">Select Gender</option>
                                                                                                <option value="M" selected={emptaxivaxi?.[passengerindex]?.gender === "Male"}>Male</option>
                                                                                                <option value="F" selected={emptaxivaxi?.[passengerindex]?.gender === "Female"}>Female</option>
                                                                                            </select>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                                                <img src="/img/checkin_bag.svg" alt="Cabin Baggage" className="baggage-icon" />
                                                                                <span style={{ color: '#000000', fontSize: 'small', fontWeight: 'bold' }}>Frequent Flyer Number</span>
                                                                                <span style={{ color: '#757575', fontSize: 'small' }}>(Avail extra benefits & earn points)</span>
                                                                            </div>
                                                                            <div className="booking-row" style={{ marginTop: '10px' }}>
                                                                                <div className="booking-field booking-email">
                                                                                    <label>Frequent Flyer Airline</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        name="flyername"
                                                                                        data-index={passengerindex}
                                                                                        placeholder=""

                                                                                    />
                                                                                </div>
                                                                                <div className="booking-field booking-email">
                                                                                    <label>Frequent Flyer No</label>
                                                                                    <input
                                                                                        type="text"
                                                                                        name="flyernumber"
                                                                                        data-index={passengerindex}
                                                                                        placeholder=""

                                                                                    />
                                                                                </div>

                                                                            </div>

                                                                            <div className="booking-form-append" />
                                                                        </div>
                                                                    ))}
                                                                    <div className="add-passenger">
                                                                        <button
                                                                            type="button"
                                                                            id="save-passenger-btn"
                                                                            className="passenger-submit"
                                                                            onClick={handleSavePassenger}
                                                                        >
                                                                            Save Passenger
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                            </AccordionDetails>
                                                            <AccordionActions>
                                                                {/* <Button>Cancel</Button>
                                                                <Button>Agree</Button> */}
                                                            </AccordionActions>
                                                        </Accordion>
                                                        <div className="booking-devider" />
                                                        <Accordion defaultExpanded expanded={accordion5Expanded} onChange={(event, isExpanded) => setAccordion5Expanded(isExpanded)}>
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon />}
                                                                aria-controls="panel1-content"
                                                                id="panel1-header"
                                                                className="accordion"
                                                            >
                                                                <img
                                                                    src="/img/taxivaxi/meal_seats/user_icon.svg"
                                                                    width="15px"
                                                                />&nbsp;
                                                                GST Details &nbsp;&nbsp;
                                                                {/* <span className='govid'> Important: Enter name as mentioned on your passport or Government approved IDs.</span> */}
                                                            </AccordionSummary>
                                                            <AccordionDetails>

                                                                <div className="" id="">
                                                                    <div
                                                                        className="booking-form gstblock"
                                                                        style={{
                                                                            marginLeft: 5,
                                                                            marginRight: 5,
                                                                            marginBottom: 0
                                                                        }}
                                                                    >
                                                                        <div className="booking-form-i booking-form-i3">
                                                                            <label>GSTIN</label>
                                                                            <div className="input">
                                                                                <input
                                                                                    type="text"
                                                                                    name="gst_registration_no"
                                                                                    placeholder=""
                                                                                    defaultValue={clientGst.gst_id}
                                                                                    onChange={(e) => setGstRegistrationNo(e.target.value)}
                                                                                    onKeyPress={handleGstKeyPress}
                                                                                />
                                                                            </div>
                                                                            <span
                                                                                className="error-message gst_registration_no-message"
                                                                                style={{
                                                                                    display: "none",
                                                                                    color: "red",
                                                                                    fontWeight: "normal"
                                                                                }}
                                                                            >
                                                                                Please enter GSTIN.
                                                                            </span>
                                                                        </div>

                                                                        <div className="booking-form-i booking-form-i3">
                                                                            <label>Name</label>
                                                                            <div className="input">
                                                                                <input
                                                                                    type="text"
                                                                                    name="company_gst_name"
                                                                                    defaultValue={clientGst.billing_name}
                                                                                    placeholder="" />
                                                                            </div>
                                                                            <span
                                                                                className="error-message company_gst_name-message"
                                                                                style={{
                                                                                    display: "none",
                                                                                    color: "red",
                                                                                    fontWeight: "normal"
                                                                                }}  >
                                                                                Please enter Name.
                                                                            </span>
                                                                        </div>

                                                                        <div className="booking-form-i booking-form-i3">
                                                                            <label>GST Address</label>
                                                                            <div className="input">
                                                                                <input
                                                                                    type="text"
                                                                                    name="company_gst_address"
                                                                                    defaultValue={clientGst.billing_address}
                                                                                    placeholder="" />
                                                                            </div>
                                                                            <span
                                                                                className="error-message company_gst_name-message"
                                                                                style={{
                                                                                    display: "none",
                                                                                    color: "red",
                                                                                    fontWeight: "normal"
                                                                                }}  >
                                                                                Please enter GST Address.
                                                                            </span>
                                                                        </div>

                                                                        <div className="booking-form-i booking-form-i3">
                                                                            <label>GST Contact</label>
                                                                            <div className="input">
                                                                                <input
                                                                                    type="text"
                                                                                    name="company_gst_contact"
                                                                                    defaultValue={clientGst.billing_contact}
                                                                                    placeholder="" />
                                                                            </div>
                                                                            <span
                                                                                className="error-message company_gst_name-message"
                                                                                style={{
                                                                                    display: "none",
                                                                                    color: "red",
                                                                                    fontWeight: "normal"
                                                                                }}  >
                                                                                Please enter GST Contact.
                                                                            </span>
                                                                        </div>

                                                                    </div>
                                                                    <div className="add-passenger">
                                                                        <button
                                                                            type="button"
                                                                            id="save-passenger-btn"
                                                                            className="passenger-submit"
                                                                            onClick={handleSavePassenger2} // Invoke the validation function on button click
                                                                        >
                                                                            Save Details
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                            </AccordionDetails>
                                                            <AccordionActions>
                                                                {/* <Button>Cancel</Button>
                                                                <Button>Agree</Button> */}
                                                            </AccordionActions>
                                                        </Accordion>
                                                        <div className="booking-devider" />
                                                        <Accordion expanded={accordion2Expanded} onChange={(event, isExpanded) => setAccordion2Expanded(isExpanded)}>
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon />}
                                                                aria-controls="panel2-content"
                                                                id="panel2-header"
                                                                className="accordion"
                                                            >
                                                                <img
                                                                    src="img/taxivaxi/meal_seats/user_icon.svg"
                                                                    width="15px"
                                                                />&nbsp;
                                                                Contact details
                                                            </AccordionSummary>
                                                            <AccordionDetails>

                                                                <div className="" id="">
                                                                    <div
                                                                        className="booking-form"
                                                                        style={{
                                                                            marginLeft: 5,
                                                                            marginRight: 5,
                                                                            marginBottom: 0
                                                                        }}
                                                                    >
                                                                        <div className="booking-form-i booking-form-i2">
                                                                            <label>Email ID</label>
                                                                            <div className="input">
                                                                                <input
                                                                                    type="email"
                                                                                    name="email"
                                                                                    placeholder=""
                                                                                    // readOnly={bookingid}
                                                                                    defaultValue='flight@cotrav.co'
                                                                                />

                                                                            </div>
                                                                            <span
                                                                                className="error-message email-message"
                                                                                style={{
                                                                                    display: "none",
                                                                                    color: "red",
                                                                                    fontWeight: "normal"
                                                                                }}
                                                                            >
                                                                                Please enter Email ID.
                                                                            </span>
                                                                        </div>
                                                                        <div className="booking-form-i booking-form-i2">
                                                                            <label>Mobile Number</label>
                                                                            <div className="input">
                                                                                <input
                                                                                    type="text"
                                                                                    name="contact_details"
                                                                                    onKeyPress={handleNumberPress}
                                                                                    maxLength={10}
                                                                                    minLength={10}
                                                                                    placeholder=""
                                                                                    // readOnly={bookingid}
                                                                                    defaultValue={emptaxivaxi && emptaxivaxi[0] && emptaxivaxi[0]['people_contact'] &&
                                                                                        emptaxivaxi[0]['people_contact']
                                                                                    }
                                                                                />
                                                                            </div>
                                                                            <span
                                                                                className="error-message contact_details-message"
                                                                                style={{
                                                                                    display: "none",
                                                                                    color: "red",
                                                                                    fontWeight: "normal"
                                                                                }}
                                                                            >
                                                                                Please enter Mobile Number.
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div
                                                                        className="booking-form"
                                                                        style={{
                                                                            marginLeft: 5,
                                                                            marginRight: 5,
                                                                            marginBottom: 0
                                                                        }}
                                                                    >
                                                                        <div className="booking-form-i booking-form-i3">
                                                                            <label>Address</label>
                                                                            <div className="input">
                                                                                <input
                                                                                    type="text"
                                                                                    name="address"
                                                                                    // defaultValue=""
                                                                                    placeholder=""
                                                                                    // readOnly={bookingid}
                                                                                    defaultValue={emptaxivaxi && emptaxivaxi[0] && emptaxivaxi[0]['home_address'] ?
                                                                                        emptaxivaxi[0]['home_address'] : ''
                                                                                    }
                                                                                />
                                                                            </div>
                                                                            <span
                                                                                className="error-message address-message"
                                                                                style={{
                                                                                    display: "none",
                                                                                    color: "red",
                                                                                    fontWeight: "normal"
                                                                                }}
                                                                            >
                                                                                Please enter Address.
                                                                            </span>
                                                                        </div>
                                                                        <div className="booking-form-i booking-form-i3">
                                                                            <label>Street</label>
                                                                            <div className="input">
                                                                                <input
                                                                                    type="text"
                                                                                    name="street"
                                                                                    placeholder=""
                                                                                    // readOnly={bookingid}
                                                                                    defaultValue={emptaxivaxi && emptaxivaxi[0] && emptaxivaxi[0]['home_address'] ?
                                                                                        emptaxivaxi[0]['home_address'] : ''
                                                                                    }
                                                                                />
                                                                            </div>
                                                                            <span
                                                                                className="error-message street-message"
                                                                                style={{
                                                                                    display: "none",
                                                                                    color: "red",
                                                                                    fontWeight: "normal"
                                                                                }}
                                                                            >
                                                                                Please enter Street.
                                                                            </span>
                                                                        </div>
                                                                    </div> */}
                                                                    {/* <div
                                                                        className="booking-form"
                                                                        style={{
                                                                            marginLeft: 5,
                                                                            marginRight: 5,
                                                                            marginBottom: 0
                                                                        }}
                                                                    >
                                                                        <div className="booking-form-i booking-form-i3">
                                                                            <label>City</label>
                                                                            <div className="input">
                                                                                <input
                                                                                    type="text"
                                                                                    name="city"
                                                                                    placeholder=""
                                                                                    onKeyPress={handleKeyPress}
                                                                                    // readOnly={bookingid}
                                                                                    defaultValue={emptaxivaxi && emptaxivaxi[0] && emptaxivaxi[0]['city_name'] ?
                                                                                        emptaxivaxi[0]['city_name'] : ''
                                                                                    }
                                                                                />
                                                                            </div>
                                                                            <span
                                                                                className="error-message city-message"
                                                                                style={{
                                                                                    display: "none",
                                                                                    color: "red",
                                                                                    fontWeight: "normal"
                                                                                }}
                                                                            >
                                                                                Please enter City.
                                                                            </span>
                                                                        </div>
                                                                        <div className="booking-form-i booking-form-i3">
                                                                            <label>State</label>
                                                                            <div className="input">
                                                                                <input
                                                                                    type="text"
                                                                                    name="state"
                                                                                    placeholder=""
                                                                                    onKeyPress={handleKeyPress}
                                                                                    // readOnly={bookingid}
                                                                                    defaultValue={emptaxivaxi && emptaxivaxi[0] && emptaxivaxi[0]['state_name'] ?
                                                                                        emptaxivaxi[0]['state_name'] : ''
                                                                                    }

                                                                                />
                                                                            </div>
                                                                            <span
                                                                                className="error-message state-message"
                                                                                style={{
                                                                                    display: "none",
                                                                                    color: "red",
                                                                                    fontWeight: "normal"
                                                                                }}
                                                                            >
                                                                                Please enter State.
                                                                            </span>
                                                                        </div>
                                                                    </div> */}
                                                                    {/* <div
                                                                        className="booking-form"
                                                                        style={{
                                                                            marginLeft: 5,
                                                                            marginRight: 5,
                                                                            marginBottom: 0
                                                                        }}
                                                                    >
                                                                        <div className="booking-form-i booking-form-i3">
                                                                            <label>Postal Code</label>
                                                                            <div className="input">
                                                                                <input
                                                                                    type="text"
                                                                                    name="postal_code"
                                                                                    onKeyPress={handleNumberPress}
                                                                                    maxLength={6}
                                                                                    minLength={6}
                                                                                    placeholder=""
                                                                                    // readOnly={bookingid}
                                                                                    defaultValue={emptaxivaxi && emptaxivaxi[0] && emptaxivaxi[0]['postal_code'] ?
                                                                                        emptaxivaxi[0]['postal_code'] : ''
                                                                                    }
                                                                                />
                                                                            </div>
                                                                            <span
                                                                                className="error-message postal_code-message"
                                                                                style={{
                                                                                    display: "none",
                                                                                    color: "red",
                                                                                    fontWeight: "normal"
                                                                                }}
                                                                            >
                                                                                Please enter Pin code.
                                                                            </span>
                                                                        </div>
                                                                        <div className="booking-form-i booking-form-i3">
                                                                            <label>Country Code</label>
                                                                            <div className="input">
                                                                                <input
                                                                                    type="text"
                                                                                    name="country"
                                                                                    placeholder="Eg.IN"
                                                                                    defaultValue={emptaxivaxi && emptaxivaxi[0] && emptaxivaxi[0]['country_code'] ?
                                                                                        emptaxivaxi[0]['country_code'] : 'IN'
                                                                                    }
                                                                                />
                                                                            </div>
                                                                            <span
                                                                                className="error-message country-message"
                                                                                style={{
                                                                                    display: "none",
                                                                                    color: "red",
                                                                                    fontWeight: "normal"
                                                                                }}
                                                                            >
                                                                                Please enter Country.
                                                                            </span>
                                                                        </div>
                                                                    </div> */}

                                                                    <div className="booking-form-append" />
                                                                    <div className="add-passenger">
                                                                        <div
                                                                            className="modal fade bd-example-modal-lg multipleflight"
                                                                            tabIndex={-1}
                                                                            role="dialog"
                                                                            aria-labelledby="myLargeModalLabel"
                                                                            aria-hidden="true"
                                                                        >
                                                                            <div className="modal-dialog modal-lg">
                                                                                <div className="modal-content">
                                                                                    <div className="modal-header">
                                                                                        <h5
                                                                                            className="modal-title"
                                                                                            id="exampleModalLabel"
                                                                                        >
                                                                                            Review Details
                                                                                        </h5>
                                                                                        <button
                                                                                            type="button"
                                                                                            className="close"
                                                                                            data-dismiss="modal"
                                                                                            aria-label="Close"

                                                                                        >
                                                                                            <span style={{ width: '9px', height: '10px', display: 'block' }}
                                                                                                aria-hidden="true">×</span>
                                                                                        </button>
                                                                                    </div>
                                                                                    <div className="modal-body">
                                                                                        <div className="row">
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/* <Link to={'/passengerseat'}> */}
                                                                        <button type="submit" className="save_details" >
                                                                            Save Details
                                                                        </button>

                                                                        {/* </Link> */}
                                                                    </div>
                                                                </div>

                                                            </AccordionDetails>
                                                            <AccordionActions>
                                                                {/* <Button>Cancel</Button>
                                                                <Button>Agree</Button> */}
                                                            </AccordionActions>
                                                        </Accordion>

                                                        <div className="booking-devider" />

                                                    </div>
                                                    {/* {renderForms()} */}
                                                    {/* {passengerDetailsVisible && ( */}

                                                    {/* )} */}


                                                </form>
                                                <form onSubmit={(e) => handleCompleteBooking(e)}>

                                                    <Accordion expanded={seatresponseparse ? accordion3Expanded : false} onChange={(event, isExpanded) => setAccordion3Expanded(isExpanded)}>
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls="panel3-content"
                                                            id="panel3-header"
                                                            className={`accordion ${emptyseatmap ? 'emptyseatmap' : ''}`}
                                                        >
                                                            <img src="/img/taxivaxi/meal_seats/seat3.svg" width="20px" />&nbsp;Choose Seats

                                                            {/* Conditionally render seat number and price */}
                                                            {previousSelections.some(selection => selection.passenger === passengereventKeys) && (
                                                                <span style={{ marginLeft: '20px' }}>
                                                                    Seat No. {previousSelections
                                                                        .filter(selection => selection.passenger === passengereventKeys)
                                                                        .map(selection => selection.code)
                                                                        .join(', ')}

                                                                </span>
                                                            )}
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <div className='panel' id="panel2" style={{ maxHeight: "450px" }}>
                                                                <div className='seatleft'>
                                                                    <div className='seatleftul'>
                                                                        {Passengers && Passengers.keys && Passengers.keys.length > 1 ? (
                                                                            Passengers.keys.map((key, index) => (
                                                                                Passengers.codes[index] !== 'INF' && (
                                                                                    <button
                                                                                        key={index}
                                                                                        type="button"
                                                                                        className={`seatleftli tablinkseat ${key === passengereventKeys ? 'active' : ''}`}
                                                                                        id={`passenger${index + 1}`}
                                                                                        onClick={() => handlePassengerevent(key, index)}
                                                                                    >
                                                                                        {Passengers.namesWithPrefix[index]}. {Passengers.firstNames[index]}<br />
                                                                                        <span>
                                                                                            Seat No. {previousSelections.some(selection => selection.passenger === key) &&
                                                                                                `${previousSelections.filter(selection => selection.passenger === key).map(selection => selection.code).join(', ')}`}
                                                                                        </span>
                                                                                        <br />
                                                                                        <span>
                                                                                            {previousSelections.some(selection => selection.passenger === key) &&
                                                                                                `Price - ${previousSelections.filter(selection => selection.passenger === key).map(selection => handleOptional(selection.optionalkey)).join(', ')}`}
                                                                                        </span>
                                                                                    </button>
                                                                                )
                                                                            ))
                                                                        ) : (
                                                                            <>
                                                                                {Passengers && Passengers.keys && (
                                                                                    Passengers.codes[0] !== 'INF' && (
                                                                                        <button type="button" className="seatleftli tablinkseat active" id="defaultopen" onClick={() => handlePassengerevent(Passengers.keys[0], 0)}>
                                                                                            {Passengers.namesWithPrefix[0]}. {Passengers.firstNames[0]}<br />
                                                                                            <span>
                                                                                                Seat No. {previousSelections.some(selection => selection.passenger === Passengers.keys[0]) &&
                                                                                                    `${previousSelections.filter(selection => selection.passenger === Passengers.keys[0]).map(selection => selection.code).join(', ')}`}
                                                                                            </span>
                                                                                            <br />
                                                                                            <span>
                                                                                                {previousSelections.some(selection => selection.passenger === Passengers.keys[0]) &&
                                                                                                    `Price - ${previousSelections.filter(selection => selection.passenger === Passengers.keys[0]).map(selection => handleOptional(selection.optionalkey)).join(', ')}`}
                                                                                            </span>
                                                                                        </button>
                                                                                    )
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>

                                                                </div>
                                                                <div className='tabcontentseat'>
                                                                    <div className='seatright'>
                                                                        <div className='card-body' style={{ padding: '0px' }}>
                                                                            <div className="seat_selection">
                                                                                {seatrowsParse &&
                                                                                    seatrowsParse.length > 1 ? (
                                                                                    <>
                                                                                        <div className='noted_seat'>
                                                                                            <div className='row noted_seat_clear'>
                                                                                                <div className='col-md-9'>Free</div>
                                                                                                <div className='col-md-3 noted_seat_free'></div>
                                                                                            </div>
                                                                                            <div className='row noted_seat_clear'>
                                                                                                <div className='col-md-9'>₹ 1 - ₹ 300</div>
                                                                                                <div className='col-md-3 noted_seat_300'></div>
                                                                                            </div>
                                                                                            <div className='row noted_seat_clear'>
                                                                                                <div className='col-md-9'>{'> ₹ 300'}</div>
                                                                                                <div className='col-md-3 noted_seat_g300'></div>
                                                                                            </div>
                                                                                            <div className='row noted_seat_clear'>
                                                                                                <div className='col-md-9'>Unavailable</div>
                                                                                                <div className='col-md-3 noted_seat_disabled'></div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <button type="button" className='seatprevbutton' onClick={prevSlide}>{'<<'}</button>
                                                                                        <button type="button" className='seatnextbutton' onClick={nextSlide}>{'>>'}</button>
                                                                                        {seatresponseparse && seatresponseparse.map((seatresponseparseInfo, seatresponseparseindex) => (
                                                                                            <React.Fragment key={seatresponseparseindex}>
                                                                                                {seatrowsParse.map((seatrowsParseInfo, seatrowsParseindex) => {
                                                                                                    if (seatresponseparseInfo['$'] && seatrowsParseInfo['$']['SegmentRef'] === seatresponseparseInfo['$']['Key']) {
                                                                                                        return (
                                                                                                            <div key={seatrowsParseindex} style={{ display: currentIndex === seatresponseparseindex ? 'block' : 'none' }}>
                                                                                                                <div className={`plane passenger${passengereventindexs}`}>
                                                                                                                    <div className="cockpit">
                                                                                                                        <h1>
                                                                                                                            {handleAirport(seatresponseparseInfo['$']['Origin'])}
                                                                                                                            <br />
                                                                                                                            <span className='apiairportname1'>({handleApiAirport(seatresponseparseInfo['$']['Origin'])})</span>
                                                                                                                            <br />
                                                                                                                            <span className="brcockpit"> TO </span>
                                                                                                                            <br />
                                                                                                                            {handleAirport(seatresponseparseInfo['$']['Destination'])}
                                                                                                                            <br />
                                                                                                                            <span className='apiairportname1'>({handleApiAirport(seatresponseparseInfo['$']['Destination'])})</span>
                                                                                                                            <br />
                                                                                                                            <span className="brcockpit1">
                                                                                                                                (Flight Number: {seatresponseparseInfo['$']['Carrier']}{seatresponseparseInfo['$']['FlightNumber']}) - <span className='equipmentno'>{seatresponseparseInfo['$']['Equipment']}</span>
                                                                                                                            </span>
                                                                                                                        </h1>
                                                                                                                    </div>
                                                                                                                    <div className="exit exit--front fuselage"></div>
                                                                                                                    <ol className="cabin fuselage">
                                                                                                                        {seatrowsParseInfo['air:Row'] && Array.isArray(seatrowsParseInfo['air:Row']) ? (
                                                                                                                            seatrowsParseInfo['air:Row'].map((rowInfo, rowindex) => {
                                                                                                                                if (rowInfo['$'] && rowInfo['$']['SearchTravelerRef'] === passengereventKeys) {
                                                                                                                                    return (
                                                                                                                                        <li key={rowindex} className={`row row--${rowInfo['$']['Number']}`}>
                                                                                                                                            {rowindex === 0 && (
                                                                                                                                                <ol className={`seats ${classType} olrow${rowInfo['air:Facility'].length}`}>
                                                                                                                                                    {rowInfo['air:Facility'] && (
                                                                                                                                                        <>
                                                                                                                                                            <li className={`seat ${classType}_class ${classType}_class_${rowInfo['air:Facility'].length} lirow${rowInfo['air:Facility'].length}`}></li>
                                                                                                                                                            {rowInfo['air:Facility']
                                                                                                                                                                .filter(seatfacilityInfo => seatfacilityInfo['$']['SeatCode'])
                                                                                                                                                                .map(seatfacilityInfo => seatfacilityInfo['$']['SeatCode'].split('-')[1])
                                                                                                                                                                .map((seatCode, index) => (
                                                                                                                                                                    <li className={`seat ${classType}_class ${classType}_class_${rowInfo['air:Facility'].length} lirow${rowInfo['air:Facility'].length}`} key={index}>
                                                                                                                                                                        <span className='abcspan'>{seatCode}</span>
                                                                                                                                                                    </li>
                                                                                                                                                                ))}
                                                                                                                                                        </>
                                                                                                                                                    )}
                                                                                                                                                </ol>
                                                                                                                                            )}
                                                                                                                                            <ol className={`seats ${classType} olrow${rowInfo['air:Facility'].length}`} type="A">
                                                                                                                                                <li className={`seat ${classType}_class ${classType}_class_${rowInfo['air:Facility'].length} lirow${rowInfo['air:Facility'].length}`}>{rowInfo['$']['Number']}</li>
                                                                                                                                                {rowInfo['air:Facility'] && rowInfo['air:Facility'].map((seatfacilityInfo, seatfacilityindex) => (
                                                                                                                                                    seatfacilityInfo['$']['SeatCode'] ? (
                                                                                                                                                        <li key={seatfacilityindex} className={`seat ${classType}_class ${classType}_class_${rowInfo['air:Facility'].length} lirow${rowInfo['air:Facility'].length}`}>
                                                                                                                                                            <input
                                                                                                                                                                type="radio"
                                                                                                                                                                name={`optionalkeys[${passengereventKeys}][${seatrowsParseInfo['$']['SegmentRef']}]`}
                                                                                                                                                                id={`${passengereventKeys} ${seatrowsParseInfo['$']['SegmentRef']} ${seatfacilityInfo['$']['SeatCode']}`}
                                                                                                                                                                data-group=""
                                                                                                                                                                data-groups="group"
                                                                                                                                                                value={seatfacilityInfo['$']['OptionalServiceRef'] !== undefined ? `${seatfacilityInfo['$']['OptionalServiceRef']} ${seatfacilityInfo['$']['SeatCode']}` : `free ${passengereventKeys} ${seatrowsParseInfo['$']['SegmentRef']} ${seatfacilityInfo['$']['SeatCode']}`}
                                                                                                                                                                disabled={seatfacilityInfo['$']['Availability'] === "NoSeat" || seatfacilityInfo['$']['Availability'] === "Blocked" || seatfacilityInfo['$']['Availability'] === "Occupied" || previousSelections.some(selection => selection.passenger !== passengereventKeys && selection.segment === seatrowsParseInfo['$']['SegmentRef'] && selection.code === seatfacilityInfo['$']['SeatCode'])}
                                                                                                                                                                onClick={() => handleseatSelectiondisplay(passengereventKeys, seatrowsParseInfo['$']['SegmentRef'], seatfacilityInfo['$']['SeatCode'], seatfacilityInfo['$']['OptionalServiceRef'] ? seatfacilityInfo['$']['OptionalServiceRef'] : 'free')}
                                                                                                                                                                checked={previousSelections.some(selection => selection.passenger === passengereventKeys && selection.segment === seatrowsParseInfo['$']['SegmentRef'] && selection.code === seatfacilityInfo['$']['SeatCode'])}
                                                                                                                                                            />
                                                                                                                                                            <label
                                                                                                                                                                className={`${seatfacilityInfo['$']['OptionalServiceRef'] ? handleOptionalprice(seatfacilityInfo['$']['OptionalServiceRef']) : 'free'} ${seatfacilityInfo['$']['Availability'] || 'Occupied'}`}
                                                                                                                                                                htmlFor={`${passengereventKeys} ${seatrowsParseInfo['$']['SegmentRef']} ${seatfacilityInfo['$']['SeatCode']}`}
                                                                                                                                                                title={`${seatfacilityInfo['$']['Availability'] || 'Occupied'} [${seatfacilityInfo['$']['SeatCode']}] ${seatfacilityInfo['$']['OptionalServiceRef'] ?
                                                                                                                                                                    handleOptional(seatfacilityInfo['$']['OptionalServiceRef'])
                                                                                                                                                                    : '₹ 0'
                                                                                                                                                                    }`}
                                                                                                                                                            >
                                                                                                                                                            </label>
                                                                                                                                                            <span className="tooltip">
                                                                                                                                                                {seatfacilityInfo['$']['Availability'] || 'Occupied'} [{seatfacilityInfo['$']['SeatCode']}] {
                                                                                                                                                                    seatfacilityInfo['$']['OptionalServiceRef'] ?
                                                                                                                                                                        seatfacilityInfo['$']['OptionalServiceRef']
                                                                                                                                                                        : '₹ 0'
                                                                                                                                                                }
                                                                                                                                                            </span>

                                                                                                                                                        </li>
                                                                                                                                                    ) : null
                                                                                                                                                ))}
                                                                                                                                            </ol>
                                                                                                                                        </li>
                                                                                                                                    );
                                                                                                                                }
                                                                                                                            })
                                                                                                                        ) : (
                                                                                                                            <li className="row row--">
                                                                                                                                <ol className="seats " type="A">
                                                                                                                                    <li className="seat"></li>
                                                                                                                                    <li className="seat">
                                                                                                                                        <input type="radio" name="optionalkeys" id="" data-group="" data-groups="group" />
                                                                                                                                        <label className=""></label>
                                                                                                                                        <span className="tooltip">Price</span>
                                                                                                                                    </li>
                                                                                                                                </ol>
                                                                                                                            </li>
                                                                                                                        )}
                                                                                                                    </ol>
                                                                                                                    <div className="exit exit--back fuselage"></div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        );
                                                                                                    }
                                                                                                    return null; // If condition fails, return null
                                                                                                })}
                                                                                            </React.Fragment>
                                                                                        ))}

                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <div className='noted_seat'>
                                                                                            <div className='row noted_seat_clear'>
                                                                                                <div className='col-md-9'>Free</div>
                                                                                                <div className='col-md-3 noted_seat_free'></div>
                                                                                            </div>
                                                                                            <div className='row noted_seat_clear'>
                                                                                                <div className='col-md-9'>₹ 1 - ₹ 300</div>
                                                                                                <div className='col-md-3 noted_seat_300'></div>
                                                                                            </div>
                                                                                            <div className='row noted_seat_clear'>
                                                                                                <div className='col-md-9'>{'> ₹ 300'}</div>
                                                                                                <div className='col-md-3 noted_seat_g300'></div>
                                                                                            </div>
                                                                                            <div className='row noted_seat_clear'>
                                                                                                <div className='col-md-9'>Unavailable</div>
                                                                                                <div className='col-md-3 noted_seat_disabled'></div>
                                                                                            </div>
                                                                                        </div>
                                                                                        {seatrowsParse && seatresponseparse && seatresponseparse.map((seatresponseparseInfo, seatresponseparseindex) => (
                                                                                            <React.Fragment key={seatresponseparseindex}>
                                                                                                {seatrowsParse.map((seatrowsParseInfo, seatrowsParseindex) => {
                                                                                                    if (seatresponseparseInfo['$'] && seatrowsParseInfo['$']['SegmentRef'] === seatresponseparseInfo['$']['Key']) {
                                                                                                        return (
                                                                                                            <div key={seatrowsParseindex} style={{ display: currentIndex === seatresponseparseindex ? 'block' : 'none' }}>
                                                                                                                <div className={`plane passenger${passengereventindexs}`}>
                                                                                                                    <div className="cockpit">
                                                                                                                        <h1>
                                                                                                                            {handleAirport(seatresponseparseInfo['$']['Origin'])}
                                                                                                                            <br />
                                                                                                                            <span className='apiairportname1'>({handleApiAirport(seatresponseparseInfo['$']['Origin'])})</span>
                                                                                                                            <br />
                                                                                                                            <span className="brcockpit"> TO </span>
                                                                                                                            <br />
                                                                                                                            {handleAirport(seatresponseparseInfo['$']['Destination'])}
                                                                                                                            <br />
                                                                                                                            <span className='apiairportname1'>({handleApiAirport(seatresponseparseInfo['$']['Destination'])})</span>
                                                                                                                            <br />
                                                                                                                            <span className="brcockpit1">
                                                                                                                                (Flight Number: {seatresponseparseInfo['$']['Carrier']}{seatresponseparseInfo['$']['FlightNumber']}) - <span className='equipmentno'>{seatresponseparseInfo['$']['Equipment']}</span>
                                                                                                                            </span>
                                                                                                                        </h1>
                                                                                                                    </div>
                                                                                                                    <div className="exit exit--front fuselage"></div>
                                                                                                                    <ol className="cabin fuselage">
                                                                                                                        {seatrowsParseInfo['air:Row'] && Array.isArray(seatrowsParseInfo['air:Row']) ? (
                                                                                                                            seatrowsParseInfo['air:Row'].map((rowInfo, rowindex) => {
                                                                                                                                if (rowInfo['$'] && rowInfo['$']['SearchTravelerRef'] === passengereventKeys) {
                                                                                                                                    return (
                                                                                                                                        <li key={rowindex} className={`row row--${rowInfo['$']['Number']}`}>
                                                                                                                                            {rowindex === 0 && (
                                                                                                                                                <ol className={`seats ${classType} olrow${rowInfo['air:Facility'].length}`}>
                                                                                                                                                    {rowInfo['air:Facility'] && (
                                                                                                                                                        <>
                                                                                                                                                            <li className={`seat ${classType}_class ${classType}_class_${rowInfo['air:Facility'].length} lirow${rowInfo['air:Facility'].length}`}></li>
                                                                                                                                                            {rowInfo['air:Facility']
                                                                                                                                                                .filter(seatfacilityInfo => seatfacilityInfo['$']['SeatCode'])
                                                                                                                                                                .map(seatfacilityInfo => seatfacilityInfo['$']['SeatCode'].split('-')[1])
                                                                                                                                                                .map((seatCode, index) => (
                                                                                                                                                                    <li className={`seat ${classType}_class ${classType}_class_${rowInfo['air:Facility'].length} lirow${rowInfo['air:Facility'].length}`} key={index}>
                                                                                                                                                                        <span className='abcspan'>{seatCode}</span>
                                                                                                                                                                    </li>
                                                                                                                                                                ))}
                                                                                                                                                        </>
                                                                                                                                                    )}
                                                                                                                                                </ol>
                                                                                                                                            )}
                                                                                                                                            <ol className={`seats ${classType} olrow${rowInfo['air:Facility'].length}`} type="A">
                                                                                                                                                <li className={`seat ${classType}_class ${classType}_class_${rowInfo['air:Facility'].length} lirow${rowInfo['air:Facility'].length}`}>{rowInfo['$']['Number']}</li>
                                                                                                                                                {rowInfo['air:Facility'] && rowInfo['air:Facility'].map((seatfacilityInfo, seatfacilityindex) => (
                                                                                                                                                    seatfacilityInfo['$']['SeatCode'] ? (
                                                                                                                                                        <li key={seatfacilityindex} className={`seat ${classType}_class ${classType}_class_${rowInfo['air:Facility'].length} lirow${rowInfo['air:Facility'].length}`}>
                                                                                                                                                            <input
                                                                                                                                                                type="radio"
                                                                                                                                                                name={`optionalkeys[${passengereventKeys}][${seatrowsParseInfo['$']['SegmentRef']}]`}
                                                                                                                                                                id={`${passengereventKeys} ${seatrowsParseInfo['$']['SegmentRef']} ${seatfacilityInfo['$']['SeatCode']}`}
                                                                                                                                                                data-group=""
                                                                                                                                                                data-groups="group"
                                                                                                                                                                value={seatfacilityInfo['$']['OptionalServiceRef'] !== undefined ? `${seatfacilityInfo['$']['OptionalServiceRef']} ${seatfacilityInfo['$']['SeatCode']}` : `free ${passengereventKeys} ${seatrowsParseInfo['$']['SegmentRef']} ${seatfacilityInfo['$']['SeatCode']}`}
                                                                                                                                                                disabled={seatfacilityInfo['$']['Availability'] === "NoSeat" || seatfacilityInfo['$']['Availability'] === "Blocked" || seatfacilityInfo['$']['Availability'] === "Occupied" || previousSelections.some(selection => selection.passenger !== passengereventKeys && selection.segment === seatrowsParseInfo['$']['SegmentRef'] && selection.code === seatfacilityInfo['$']['SeatCode'])}
                                                                                                                                                                onClick={() => handleseatSelectiondisplay(passengereventKeys, seatrowsParseInfo['$']['SegmentRef'], seatfacilityInfo['$']['SeatCode'], seatfacilityInfo['$']['OptionalServiceRef'] ? seatfacilityInfo['$']['OptionalServiceRef'] : 'free')}
                                                                                                                                                                checked={previousSelections.some(selection => selection.passenger === passengereventKeys && selection.segment === seatrowsParseInfo['$']['SegmentRef'] && selection.code === seatfacilityInfo['$']['SeatCode'])}
                                                                                                                                                            />
                                                                                                                                                            <label className={`${seatfacilityInfo['$']['OptionalServiceRef'] ? handleOptionalprice(seatfacilityInfo['$']['OptionalServiceRef']) : 'free'} ${seatfacilityInfo['$']['Availability'] || 'Occupied'}`} htmlFor={`${passengereventKeys} ${seatrowsParseInfo['$']['SegmentRef']} ${seatfacilityInfo['$']['SeatCode']}`} title={`${seatfacilityInfo['$']['Availability'] || 'Occupied'} [${seatfacilityInfo['$']['SeatCode']}] ${seatfacilityInfo['$']['OptionalServiceRef'] ? (handleOptional(seatfacilityInfo['$']['OptionalServiceRef'])) : '₹ 0'}`}></label>
                                                                                                                                                            <span className="tooltip">{seatfacilityInfo['$']['Availability'] || 'Occupied'} [{seatfacilityInfo['$']['SeatCode']}]
                                                                                                                                                                {seatfacilityInfo['$']['OptionalServiceRef'] ? seatfacilityInfo['$']['OptionalServiceRef'] : '₹ 0'}</span>
                                                                                                                                                        </li>
                                                                                                                                                    ) : null
                                                                                                                                                ))}
                                                                                                                                            </ol>
                                                                                                                                        </li>
                                                                                                                                    );
                                                                                                                                }
                                                                                                                            })
                                                                                                                        ) : (
                                                                                                                            <li className="row row--">
                                                                                                                                <ol className="seats " type="A">
                                                                                                                                    <li className="seat"></li>
                                                                                                                                    <li className="seat">
                                                                                                                                        <input type="radio" name="optionalkeys" id="" data-group="" data-groups="group" />
                                                                                                                                        <label className=""></label>
                                                                                                                                        <span className="tooltip">Price</span>
                                                                                                                                    </li>
                                                                                                                                </ol>
                                                                                                                            </li>
                                                                                                                        )}
                                                                                                                    </ol>
                                                                                                                    <div className="exit exit--back fuselage"></div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        );
                                                                                                    }
                                                                                                    return null; // If condition fails, return null
                                                                                                })}
                                                                                            </React.Fragment>
                                                                                        ))}
                                                                                    </>
                                                                                )
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className='seatbutton'>
                                                                {Array.isArray(previousSelections) && previousSelections.length > 0 ? (
                                                                    <button type='button' className='seatbuttonskip disabledskip' style={{ marginRight: '4px' }} disabled>Skip</button>
                                                                ) : (
                                                                    <button type='button' onClick={handleseatbuttonskip} className='seatbuttonskip' style={{ marginRight: '4px' }}>Skip</button>
                                                                )}
                                                                <button type='button' onClick={handleseatbuttonskip} className='seatbuttonskip'>continue</button>
                                                            </div>
                                                        </AccordionDetails>
                                                        <AccordionActions>
                                                            {/* <Button>Cancel</Button>
                                                                <Button>Agree</Button> */}
                                                        </AccordionActions>
                                                    </Accordion>
                                                    <div className="booking-devider" />
                                                    <Accordion expanded={serviceoptionalsOptions && serviceoptionalsOptions.length > 0 ? accordion4Expanded : false} onChange={(event, isExpanded) => setAccordion4Expanded(isExpanded)}>
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls="panel2-content"
                                                            id="panel2-header"
                                                            className={`accordion ${serviceoptionalsOptions && serviceoptionalsOptions.length > 0 ? '' : 'emptyseatmap'}`}
                                                        >
                                                            <img
                                                                src="img/taxivaxi/meal_seats/user_icon.svg"
                                                                width="15px"
                                                            />&nbsp;
                                                            extra baggage

                                                            {serviceoptionalsOptions && serviceoptionalsOptions.length > 0 ? ''
                                                                : (
                                                                    <span className='extradisabled'>Extra Baggage selections are not allowed</span>
                                                                )
                                                            }

                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            {serviceoptionalsOptions && serviceoptionalsOptions.length > 0 && (
                                                                <>
                                                                    <div className='extrabaggage'>
                                                                        <Nav variant="tabs" defaultActiveKey={`serviceoptionindex0`}>
                                                                            {serviceoptionalsOptions && serviceSegments && serviceSegments.map((serviceSegmentsinfo, serviceSegmentsindex) => (
                                                                                <Nav.Item key={serviceSegmentsindex}>
                                                                                    <Nav.Link
                                                                                        eventKey={`serviceSegmentsindex${serviceSegmentsindex}`}
                                                                                        className={`nav-link ${serviceSegmentsindex === activeTab ? 'active' : ''}`}
                                                                                        onClick={() => handleNavItemClick(serviceSegmentsindex)}
                                                                                    >
                                                                                        {handleAirport(serviceSegmentsinfo.$.Origin)}&nbsp; → &nbsp;{handleAirport(serviceSegmentsinfo.$.Destination)}
                                                                                    </Nav.Link>
                                                                                </Nav.Item>
                                                                            ))}
                                                                        </Nav>
                                                                        <div className="tab-content">
                                                                            {serviceoptionalsOptions &&
                                                                                serviceSegments &&
                                                                                serviceSegments.map((serviceSegmentsinfo, serviceSegmentsindex) => (
                                                                                    <div
                                                                                        key={serviceSegmentsindex}
                                                                                        id={`serviceSegmentsindex${serviceSegmentsindex}`}
                                                                                        className={`tab-pane ${serviceSegmentsindex === activeTab ? 'show active' : ''}`}
                                                                                    ><div className='row' key={serviceSegmentsindex}>
                                                                                            {serviceoptionalsOptions &&
                                                                                                serviceoptionalsOptions.map((serviceoptionalsOptioninfo, serviceoptionalsOptionindex) => {
                                                                                                    if (serviceoptionalsOptioninfo['common_v52_0:ServiceData'][0]) {
                                                                                                        return serviceoptionalsOptioninfo['common_v52_0:ServiceData'].map((servicedatainfo, servicedataindex) => {
                                                                                                            if (servicedatainfo['$'] && servicedatainfo['$']['AirSegmentRef'] === serviceSegmentsinfo['$']['Key']) {
                                                                                                                return (
                                                                                                                    <div className='col-md-6' key={serviceoptionalsOptionindex} >
                                                                                                                        <div className='extrabaggageinput'>
                                                                                                                            <div className='row'>
                                                                                                                                <div className='col-md-6'>
                                                                                                                                    <div>
                                                                                                                                        {serviceoptionalsOptioninfo.$.TotalWeight}
                                                                                                                                    </div>
                                                                                                                                    <div className='baggaegdetails'>{serviceoptionalsOptioninfo['common_v52_0:ServiceInfo']['common_v52_0:Description']}</div>
                                                                                                                                </div>
                                                                                                                                <div className='col-md-3'>
                                                                                                                                    <span>
                                                                                                                                        {serviceoptionalsOptioninfo.$.ApproximateTotalPrice.includes('INR') ? '₹ ' : ''}
                                                                                                                                        {serviceoptionalsOptioninfo.$.ApproximateTotalPrice.replace('INR', '')}
                                                                                                                                    </span>
                                                                                                                                </div>
                                                                                                                                <div className='col-md-3 baggageoptionbuttons'>
                                                                                                                                    <span className='buttonoption0' onClick={() => handle0Click(serviceoptionalsOptionindex, servicedataindex)}>-</span>
                                                                                                                                    <span className='buttonoptionspan'>{buttonTexts[servicedataindex]?.[serviceoptionalsOptionindex] || '0'}</span>
                                                                                                                                    <span className='buttonoption1' onClick={() => handle1Click(serviceoptionalsOptionindex, servicedataindex)}>+</span>


                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                );
                                                                                                            } else {
                                                                                                                return null;
                                                                                                            }
                                                                                                        });
                                                                                                    } else {


                                                                                                        if (
                                                                                                            serviceoptionalsOptioninfo['common_v52_0:ServiceData'] &&
                                                                                                            serviceoptionalsOptioninfo['common_v52_0:ServiceData']['$'] &&
                                                                                                            serviceoptionalsOptioninfo['common_v52_0:ServiceData']['$']['AirSegmentRef'] === serviceSegmentsinfo['$']['Key']
                                                                                                        ) {
                                                                                                            return (
                                                                                                                <div className='col-md-6' key={serviceoptionalsOptionindex}>
                                                                                                                    <div className='extrabaggageinput'>
                                                                                                                        <div className='row'>
                                                                                                                            <div className='col-md-6'>
                                                                                                                                <div>
                                                                                                                                    {serviceoptionalsOptioninfo.$.TotalWeight}
                                                                                                                                </div>
                                                                                                                                <div className='baggaegdetails'>{serviceoptionalsOptioninfo['common_v52_0:ServiceInfo']['common_v52_0:Description']}</div>
                                                                                                                            </div>
                                                                                                                            <div className='col-md-3'>
                                                                                                                                <span>
                                                                                                                                    {serviceoptionalsOptioninfo.$.ApproximateTotalPrice.includes('INR') ? '₹ ' : ''}
                                                                                                                                    {serviceoptionalsOptioninfo.$.ApproximateTotalPrice.replace('INR', '')}
                                                                                                                                </span>
                                                                                                                            </div>
                                                                                                                            <div className='col-md-3 baggageoptionbuttons'>
                                                                                                                                <span className='buttonoption0' onClick={() => handle0Click(serviceoptionalsOptionindex, 0)}>-</span>
                                                                                                                                <span className='buttonoptionspan'>{buttonTexts[0]?.[serviceoptionalsOptionindex] || '0'}</span>
                                                                                                                                <span className='buttonoption1' onClick={() => handle1Click(serviceoptionalsOptionindex, 0)}>+</span>


                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            );
                                                                                                        }
                                                                                                    }
                                                                                                })}
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                        </div>

                                                                    </div>
                                                                    <div className='baggagebutton'>
                                                                        {Object.keys(buttonTexts).length !== 0 || Object.values(buttonTexts).some(value => value > 0) ? (
                                                                            <button type='button' className='baggagebuttonskip disabledskip' style={{ marginRight: '4px' }} disabled>Skip</button>
                                                                        ) : (
                                                                            <button type='button' onClick={handlebaggagebuttonskip} className='baggagebuttonskip' style={{ marginRight: '4px' }}>Skip</button>
                                                                        )}
                                                                        <button type='button' onClick={handlebaggagebuttonskip} className='baggagebuttonskip'>continue</button>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </AccordionDetails>
                                                        <AccordionActions>
                                                        </AccordionActions>
                                                    </Accordion>

                                                    <div className="booking-devider" />
                                                    <div>
                                                        <input type='checkbox' /><label className='confirmtocontinue'>I confirm that I have read and I accept the <a href="#">Fare Rules</a> , the <a href="#">Privacy Policy</a> , the <a href="#">User Agreement</a> and <a href="#">Terms of Service</a> of Taxivaxi</label>
                                                    </div>
                                                    <button type="button" id="back_button" onClick={() => window.history.back()}>
                                                        Back
                                                    </button>

                                                    {emptyseatmap || seatresponseparse ? (
                                                        <button
                                                            type="submit"
                                                            className="booking_continue booking_continue_hover"
                                                        >
                                                            Continue booking
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="submit"
                                                            className="booking_continue"
                                                            disabled
                                                            style={{ cursor: 'not-allowed' }}
                                                        >
                                                            Continue booking
                                                        </button>
                                                    )}

                                                    <div className="booking-devider" />
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="clear" />
                                </div>
                            </div>
                            <div className="sp-page-r">
                                <div className="checkout-coll">
                                    <div className="checkout-head">
                                        <div className="checkout-headl">
                                            <a href="#">
                                                {(() => {
                                                    const uniqueCarriers1 = new Set();

                                                    // Populate uniqueCarriers1 with unique carrier values
                                                    segmentParse && (Array.isArray(segmentParse) ? segmentParse : [segmentParse]).forEach(segmentinfo => {
                                                        uniqueCarriers1.add(segmentinfo['$']['Carrier']);
                                                    });

                                                    return (
                                                        segmentParse &&
                                                        Array.from(uniqueCarriers1).map((carrier, index) => (
                                                            <div key={index}>
                                                                <img
                                                                    className={`airlineimg${index}`}
                                                                    src={`${CONFIG.DEV_API}/airline_logo_images/${carrier}.png`}
                                                                    alt="Airline logo"
                                                                    width="40px"
                                                                />
                                                                <br />

                                                                {/* Render flight numbers associated with the current carrier */}
                                                                {(Array.isArray(segmentParse) ? segmentParse : [segmentParse]).map((segmentinfo, segmentindex) => (
                                                                    segmentinfo['$']['Carrier'] === carrier && (
                                                                        <span key={segmentindex} className="flightnumber">
                                                                            {segmentindex > 0 && ', '}
                                                                            {segmentinfo['$']['Carrier']} {segmentinfo['$']['FlightNumber']}
                                                                        </span>
                                                                    )
                                                                ))}
                                                            </div>
                                                        ))
                                                    );
                                                })()}



                                            </a>
                                        </div>
                                        <div className="checkout-headr">
                                            <div className="checkout-headrb">
                                                <div className="checkout-headrp">
                                                    <div className="chk-left">
                                                        <div className="chk-lbl">
                                                            <a href="#">{request.finalorigin.split('(')[0]} - {request.finaldestination.split('(')[0]}</a>
                                                        </div>
                                                        <div className="chk-lbl-a">{request.bookingtype} Trip</div>
                                                    </div>
                                                    <div className="clear" />
                                                </div>
                                            </div>
                                            <div className="clear" />
                                        </div>
                                    </div>
                                    <div className="chk-lines">
                                        <div className="chk-line chk-fligth-info">
                                            <div className="chk-departure">
                                                <span />
                                                <b>
                                                    {handleEffectiveDate(request.searchdeparture)}
                                                </b>
                                            </div>
                                            <div className="chk-fligth-devider" />
                                            <div className="chk-arrival">
                                                <span />
                                                <b>
                                                    {request.searchreturn ? handleEffectiveDate(request.searchreturn) : handleEffectiveDate(request.searcharrivaldate)}
                                                </b>
                                            </div>
                                            <div className="clear" />
                                        </div>
                                    </div>
                                    <div className="chk-details">
                                        <h2>Details</h2>
                                        <div className="chk-detais-row">
                                            <div className="chk-line">
                                                <span className="chk-l">Airlines:</span>
                                                <span className="chk-r">
                                                    {
                                                        segmentParse &&
                                                        Array.from(
                                                            new Set(
                                                                (Array.isArray(segmentParse) ? segmentParse : [segmentParse])
                                                                    .map(segmentinfo => segmentinfo['$']['Carrier'])
                                                            )
                                                        ).map((carrier, index) => (
                                                            <div key={index}>
                                                                {handleAirline(carrier)}
                                                            </div>
                                                        ))
                                                    }
                                                </span>
                                                <div className="clear" />
                                            </div>
                                            <div className="chk-line">
                                                <span className="chk-l">Cabin Class:</span>
                                                <span className="chk-r">{classType} class</span>
                                                <div className="clear" />
                                            </div>
                                            {packageSelected['air:AirPricingInfo'] && (
                                                Array.isArray(packageSelected['air:AirPricingInfo'])
                                                    ? (
                                                        packageSelected['air:AirPricingInfo'].map((priceInfo, priceIndex) => (
                                                            <div key={priceIndex} className="chk-line">
                                                                <span className="chk-l">
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
                                                                </span>
                                                                <span className="chk-r">
                                                                    <span className="chk-r">
                                                                        {priceIndex === 0 && request.adult > 0 ? (
                                                                            <span>
                                                                                {priceInfo.$.ApproximateBasePrice.includes('INR') ? '₹ ' : ''}
                                                                                {Number(priceInfo.$.ApproximateBasePrice.replace('INR', '')) * request.adult}
                                                                            </span>
                                                                        ) : priceIndex === 1 && request.child > 0 ? (
                                                                            <span>
                                                                                {priceInfo.$.ApproximateBasePrice.includes('INR') ? '₹ ' : ''}
                                                                                {Number(priceInfo.$.ApproximateBasePrice.replace('INR', '')) * request.child}
                                                                            </span>
                                                                        ) : priceIndex === 2 && request.infant > 0 ? (
                                                                            <span>
                                                                                {priceInfo.$.ApproximateBasePrice.includes('INR') ? '₹ ' : ''}
                                                                                {Number(priceInfo.$.ApproximateBasePrice.replace('INR', '')) * request.infant}
                                                                            </span>
                                                                        ) : (
                                                                            <span>
                                                                                {priceInfo.$.ApproximateBasePrice.includes('INR') ? '₹ ' : ''}
                                                                                {priceInfo.$.ApproximateBasePrice.replace('INR', '')}
                                                                            </span>
                                                                        )}
                                                                    </span>

                                                                </span>
                                                                <div className="clear" />
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="chk-line">
                                                            <span className="chk-l">Adult X {request.adult}</span>
                                                            <span className="chk-r">
                                                                {request.adult > 0 ? (
                                                                    <span>
                                                                        {packageSelected['air:AirPricingInfo'].$.ApproximateBasePrice.includes('INR') ? '₹ ' : ''}
                                                                        {Number(packageSelected['air:AirPricingInfo'].$.ApproximateBasePrice.replace('INR', '')) * request.adult}
                                                                    </span>
                                                                ) : (
                                                                    <span>
                                                                        {packageSelected['air:AirPricingInfo'].$.ApproximateBasePrice.includes('INR') ? '₹ ' : ''}
                                                                        {packageSelected['air:AirPricingInfo'].$.ApproximateBasePrice.replace('INR', '')}
                                                                    </span>
                                                                )}
                                                            </span>
                                                            <div className="clear" />
                                                        </div>
                                                    )
                                            )}

                                            {/* <div className="chk-line">
                                                {Array.isArray(packageSelected["air:AirPricingInfo"]?.["air:TaxInfo"])
                                                    ? packageSelected["air:AirPricingInfo"]["air:TaxInfo"].map((tax, index) => (
                                                        <div key={index} className="chk-line-item">
                                                        <div className="chk-l">
                                                            {tax["$"]["Category"]} 
                                                        </div>
                                                        <div className="chk-r">
                                                            {tax["$"]["Amount"].includes("INR") ? "₹ " : ""}
                                                            {tax["$"]["Amount"].replace("INR", "")}
                                                        </div>
                                                        </div>
                                                    ))
                                                    : packageSelected["air:AirPricingInfo"]?.["air:TaxInfo"] && (
                                                        <div className="chk-line-item">
                                                        <div className="chk-l">
                                                            {packageSelected["air:AirPricingInfo"]["air:TaxInfo"]["$"]["Category"]} 
                                                        </div>
                                                        <div className="chk-r">
                                                            {packageSelected["air:AirPricingInfo"]["air:TaxInfo"]["$"]["Amount"].includes("INR") ? "₹ " : ""}
                                                            {packageSelected["air:AirPricingInfo"]["air:TaxInfo"]["$"]["Amount"].replace("INR", "")}
                                                        </div>
                                                        </div>
                                                    )}
                                                </div> */}
                                            <div className="chk-line">
                                                {Array.isArray(packageSelected["air:AirPricingInfo"]?.["air:TaxInfo"])
                                                    ? packageSelected["air:AirPricingInfo"]["air:TaxInfo"]

                                                        .filter((tax) => tax["$"]["CarrierDefinedCategory"]?.includes("GST"))
                                                        .map((tax, index) => (
                                                            <div key={index} className="chk-line-item">
                                                                <div className="chk-l">{tax["$"]["CarrierDefinedCategory"]}</div>
                                                                <div className="chk-r">
                                                                    {tax["$"]["Amount"].includes("INR") ? "₹ " : ""}
                                                                    {tax["$"]["Amount"].replace("INR", "")}
                                                                </div>
                                                            </div>
                                                        ))
                                                    : packageSelected["air:AirPricingInfo"]?.["air:TaxInfo"] &&

                                                    packageSelected["air:AirPricingInfo"]?.["air:TaxInfo"]?.["$"]["CarrierDefinedCategory"]?.includes("GST") && ( // Check single object case
                                                        <div className="chk-line-item">
                                                            <div className="chk-l">
                                                                {packageSelected["air:AirPricingInfo"]["air:TaxInfo"]["$"]["Category"]}
                                                            </div>
                                                            <div className="chk-r">
                                                                {packageSelected["air:AirPricingInfo"]["air:TaxInfo"]["$"]["Amount"].includes("INR") ? "₹ " : ""}
                                                                {packageSelected["air:AirPricingInfo"]["air:TaxInfo"]["$"]["Amount"].replace("INR", "")}
                                                            </div>
                                                        </div>
                                                    )}
                                            </div>


                                            <div className="chk-line">
                                                <span className="chk-l">Others</span>
                                                <span className="chk-r">
                                                    {packageSelected.$.ApproximateTaxes.includes("INR") ? "₹ " : ""}
                                                    {(() => {
                                                        // Convert ApproximateTaxes to a number, default to 0 if NaN
                                                        const approximateTaxes = parseFloat(packageSelected.$.ApproximateTaxes.replace("INR", "").trim()) || 0;

                                                        // Check if TaxInfo is an array and filter for GST taxes
                                                        let k3Tax = 0;
                                                        if (Array.isArray(packageSelected["air:AirPricingInfo"]?.["air:TaxInfo"])) {
                                                            k3Tax = packageSelected["air:AirPricingInfo"]["air:TaxInfo"]
                                                                .filter((tax) => tax["$"]["CarrierDefinedCategory"]?.includes("GST"))
                                                                .reduce((sum, tax) => sum + (parseFloat(tax["$"]["Amount"].replace("INR", "").trim()) || 0), 0);
                                                        } else if (
                                                            packageSelected["air:AirPricingInfo"]?.["air:TaxInfo"]?.["$"]["CarrierDefinedCategory"]?.includes("GST")
                                                        ) {
                                                            k3Tax = parseFloat(packageSelected["air:AirPricingInfo"]["air:TaxInfo"]["$"]["Amount"].replace("INR", "").trim()) || 0;
                                                        }
                                                        let discount = 0;

                                                        const feeInfo = packageSelected?.["air:AirPricingInfo"]?.['air:FeeInfo']?.["$"];
                                                
                                                        if (feeInfo?.["Text"] === 'PromotionDiscount' && feeInfo?.["Amount"]) {
                                                          const feeAmount = parseFloat(feeInfo["Amount"].replace("INR", "").trim());
                                                          discount = Math.floor(Math.abs(feeAmount)) * parseFloat(noOfSeats || 1);
                                                        }
                                                        console.log("other discount", discount);
                                                        console.log("approximateTaxes:", approximateTaxes);
                                                        console.log("k3Tax:", k3Tax);
                                                        console.log("markup_price:", markup_price);
                                                        console.log("noOfSeats:", noOfSeats);
                                                        console.log("k3Tax",k3Tax);
                                                        
                                                        // Ensure the final tax is non-negative and only subtract GST if it exists
                                                        const finalTax = approximateTaxes - (k3Tax > 0 ? k3Tax : 0) + (parseFloat(markup_price) * parseFloat(noOfSeats));

                                                        return finalTax >= 0 ? finalTax : 0; // Ensure we don’t return negative values
                                                    })()}
                                                </span>
                                                <div className="clear" />
                                            </div>



                                        </div>
                                        <div className="chk-total">
                                            <div className="chk-total-l">Total Price</div>
                                            <div className="chk-total-r" style={{ fontWeight: 700 }}>
                                             
                                                {packageSelected.$.TotalPrice.includes('INR') ? '₹ ' : ''}

                                                {/* {(parseFloat(packageSelected.$.TotalPrice.replace('INR', '').trim()) + (parseFloat(markup_price)*parseFloat(noOfSeats)))} */}
                                                {
                                                    (
                                                        parseFloat(packageSelected?.$?.TotalPrice?.replace('INR', '').trim() || 0) +
                                                        parseFloat(markup_price || 0) * parseFloat(noOfSeats || 1) +
                                                        (
                                                        packageSelected?.["air:AirPricingInfo"]?.['air:FeeInfo']?.["$"]?.["Text"] === 'PromotionDiscount'
                                                            ? Math.floor(
                                                                Math.abs(
                                                                parseFloat(
                                                                    packageSelected?.["air:AirPricingInfo"]?.['air:FeeInfo']?.["$"]?.["Amount"]
                                                                    ?.replace("INR", "")
                                                                    .trim() || 0
                                                                )
                                                                )
                                                            ) * parseFloat(noOfSeats || 1)
                                                            : 0
                                                        )
                                                    ).toFixed(2)
                                                    }


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
            {/* Add an ID to your script tag for easier manipulation */}
        </div>


    );
}

export default Booking