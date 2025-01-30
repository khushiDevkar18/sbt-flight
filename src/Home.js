import React, { useEffect, useState,useRef } from 'react';
import axios from 'axios'
import { parseString } from 'xml2js';
import XMLParser from 'react-xml-parser';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO ,parse,isValid  } from 'date-fns';
import SearchFlight from './SearchFlight';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import IconLoader from './IconLoader';
// import ErrorLogger from './ErrorLogger';
function Home() {
    const [activeTab, setActiveTab] = useState('flight');
    const [loading, setLoading] = useState(true);
    const searchRef = useRef(null);
    const [airlineData, setAirlineResponse] = useState(null);
    const [airportData, setAirportResponse] = useState(null);

    const [inputOrigin, setInputOrigin] = useState(() => {
            return localStorage.getItem('lastorigin') || '';
          });
    const [showOriginDropdown, setShowOriginDropdown] = useState(false);
    const [origin, setOrigin] = useState([]);
    const [allAirportsOrigin, setAllAirportsOrigin] = useState([]);
    const [airportOriginCodes, setAirportOriginCodes] = useState(null);

    // const [inputDestination, setInputDestination] = useState('Delhi (DEL) Indira Gandhi International Airport');
    const [inputDestination, setInputDestination] = useState(() => {
        return localStorage.getItem('lastDestination') || '';
      });
    const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
    const [destination, setDestination] = useState([]);
    const [allAirportsDestination, setAllAirportsDestination] = useState([]);
    const [airportDestinationCodes, setAirportDestinationCodes] = useState(null);
    const [Airports, setAirportOptions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isdepOpen, setdepIsOpen] = useState(false);
    const [isretOpen, setretIsOpen] = useState(false);
    const [adultCount, setAdultCount] = useState(1);
    const [childCount, setChildCount] = useState(0); 
    const [infantCount, setInfantCount] = useState(0); 
    const [cabinClass, setCabinClass] = useState('Economy'); 
    const [lastActionWasSwap, setLastActionWasSwap] = useState(false);
    const [apiResponse, setApiResponse] = useState(null);
    const [apiairports, setAirports] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        
        const fetchData = async () => {
            try {
            const response = await axios.get('https://selfbooking.taxivaxi.com/api/airports');
            
            setAirports(response.data);
            } catch (error) {
            console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const cookieData = Cookies.get('cookiesData');
        // console.log(cookieData);
        if (cookieData) {
            const parsedCookieData = JSON.parse(cookieData);
            setInputOrigin(parsedCookieData.flightOrigin);
            setInputDestination(parsedCookieData.flightDestination);
            setAdultCount(parsedCookieData.adult);
            setChildCount(parsedCookieData.child);
            setInfantCount(parsedCookieData.infant);
            if(parsedCookieData.classType === "Economy"){
                setCabinClass('Economy/Premium Economy');
            }else{
                setCabinClass(parsedCookieData.classType);
            }
            if(parsedCookieData.returnDate === null){
                setFormData({ 
                    ...formData, 
                    departureDate: new Date (parsedCookieData.departureDate),
                    bookingType: parsedCookieData.bookingType,
                    returnDate: null
                });
            }else{
                setFormData({ 
                    ...formData, 
                    departureDate: new Date (parsedCookieData.departureDate),
                    bookingType: parsedCookieData.bookingType,
                    returnDate: new Date (parsedCookieData.returnDate)
                });
            }
        }
       
    }, []);
    
    useEffect(() => {
       
        const makeAirlineRequest = async () => {
            // test TargetBranch: P7206253
            // live TargetBranch: P4451438
        try {
            const username = 'Universal API/uAPI6514598558-21259b0c';
            const password = 'tN=54gT+%Y';
            const authHeader = `Basic ${btoa(`${username}:${password}`)}`;
            const airlineRequest = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:util="http://www.travelport.com/schema/util_v50_0" xmlns:com="http://www.travelport.com/schema/common_v50_0">
            <soapenv:Header/>
            <soapenv:Body>
                <util:ReferenceDataRetrieveReq AuthorizedBy="TAXIVAXI" TargetBranch="P7206253" TraceId="AR45JHJ" TypeCode="AirAndRailSupplierType">
                    <com:BillingPointOfSaleInfo OriginApplication="UAPI"/>
                    <util:ReferenceDataSearchModifiers MaxResults="99999" StartFromResult="0"/>
                </util:ReferenceDataRetrieveReq>
            </soapenv:Body>
            </soapenv:Envelope>`;
            
            const airlineresponse = await axios.post(
                'https://devapi.taxivaxi.com/reactSelfBookingApi/v1/makeFlightRequest',
                airlineRequest, { headers: { 'Content-Type': 'text/xml'}
                }
            );
            // console.log('airlineresponse', airlineresponse.data);
            setAirlineResponse(airlineresponse);
            
        } catch (error) {
            console.error(error);
            // navigate('/tryagainlater');
            }
            finally {
                setLoading(false);
            }
        };

        const makeAirportRequest = async () => {
            // setLoading(true);
        try {
            
            const username1 = 'Universal API/uAPI6514598558-21259b0c';
            const password1 = 'tN=54gT+%Y';
            const authHeader1 = `Basic ${btoa(`${username1}:${password1}`)}`;
            const airportRequest = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:util="http://www.travelport.com/schema/util_v50_0" xmlns:com="http://www.travelport.com/schema/common_v50_0">
            <soapenv:Header/>
            <soapenv:Body>
            <util:ReferenceDataRetrieveReq AuthorizedBy="TAXIVAXI" TargetBranch="P7206253" TraceId="AV145ER" TypeCode="CityAirport">
                <com:BillingPointOfSaleInfo OriginApplication="UAPI"/>
                <util:ReferenceDataSearchModifiers MaxResults="99999" StartFromResult="0"/>
            </util:ReferenceDataRetrieveReq>
            </soapenv:Body>
        </soapenv:Envelope>`;
            console.log("start opo")
            const airportResponse = await axios.post(
                'https://devapi.taxivaxi.com/reactSelfBookingApi/v1/makeFlightRequest', 
                airportRequest, { headers: { 'Content-Type': 'text/xml'  }}
            );
            console.log("end opo")
            setLoading(false);
            // console.log('airportresp', airportResponse);
           
            setAirportResponse(airportResponse);
            parseString(airportResponse.data, { explicitArray: false }, (errs, airportresult) => {
                if (errs) {
                console.error('Error parsing XML:', errs);
                return;
                }
                const airportlist = airportresult['SOAP:Envelope']['SOAP:Body']['util:ReferenceDataRetrieveRsp']['util:ReferenceDataItem'];
                setAirportOptions(airportlist);
                const tempAirportCodes = {};
                airportlist.forEach((airport) => {
                        tempAirportCodes[airport.$.Code] = airport.$.Name;
                    });
                
                setAirportOriginCodes(tempAirportCodes);
                setAllAirportsOrigin(airportlist);

                setAirportDestinationCodes(tempAirportCodes);
                setAllAirportsDestination(airportlist);
            });
            
        } catch (error) {
            console.error(error);
                // navigate('/tryagainlater');
                }
                finally {
                    setLoading(false);
                }
        };

        const executeRequestsSequentially = async () => {
        await makeAirlineRequest();
        await makeAirportRequest();
        };

        executeRequestsSequentially();
    }, []);

    useEffect(() => {
        Cookies.set('cookiesData', JSON.stringify(formData), { expires: 7 });
    }, []);
    const [isReturnEnabled, setReturnEnabled] = useState(false);

    useEffect(() => {
        let timeoutId;
        const timeoutDuration = 5 * 60 * 1000;
        const handleInactive = () => {
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

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

  const openCity = (cityName) => {
    setActiveTab(cityName);
  };

    // Swal.fire({
    //     title: 'Approval Required ',
    //     text: 'I wanted to inform you that we have found another flight with a lower price available. Before proceeding, I would require your approval to confirm this booking.',
    //     showCancelButton: true,
    //     confirmButtonText: 'Yes, continue!',
    //     cancelButtonText: 'No!',
    //     reverseButtons: true
    // });


    
    const XAUTH_TRAVELPORT_ACCESSGROUP = "E41F154B-04FC-46AD-9089-011C0C9C4089";
    const Accept_Version = "11";
    const Content_Version = "11";
    const baseURL = "api.pp.travelport.com";
    const version = "11";    

    const swapOriginAndDestination = () => {
        if (lastActionWasSwap) {
          setInputOrigin(inputDestination);
          setInputDestination(inputOrigin);
        } else {
          const temp = inputOrigin;
          setInputOrigin(inputDestination);
          setInputDestination(temp);
        }
    
        setLastActionWasSwap(!lastActionWasSwap);
      };

    const handleToggle = () => {
        setIsOpen(prevIsOpen => !prevIsOpen);
    };
    
    const handleOriginChange = (inputValue) => {
        setInputOrigin(inputValue);
        const filteredOptions = allAirportsOrigin
            .filter((airport) =>
                airport.$.Name.toLowerCase().includes(inputValue.toLowerCase())
            )
            .map((airport) => {
                const matchedAirport = apiairports.find(
                    (apiAirport) => apiAirport.airport_iata_code === airport.$.Code
                );
                return {
                    value: airport.$.Code,
                    label: airport.$.Name,
                    airportName: matchedAirport ? matchedAirport.airport_name : '' // Add airport name from apiairports
                };
            })
            .sort((a, b) => a.label.localeCompare(b.label));
        setOrigin(filteredOptions);
        setShowOriginDropdown(true);
    };
    
    const handleOrigin = (value,airportName) => {
        setInputOrigin(`${airportOriginCodes[value]} (${value}) ${airportName}`);
        setShowOriginDropdown(false);
    };

    const handleDestinationChange = (inputValue) => {
        setInputDestination(inputValue);

        const filteredOptions = allAirportsDestination
            .filter((airport) =>
                airport.$.Name.toLowerCase().includes(inputValue.toLowerCase())
            )
            .map((airport) => {
                const matchedAirport = apiairports.find(
                    (apiAirport) => apiAirport.airport_iata_code === airport.$.Code
                );
                return {
                    value: airport.$.Code,
                    label: airport.$.Name,
                    airportName: matchedAirport ? matchedAirport.airport_name : '' 
                };
            })
            .sort((a, b) => a.label.localeCompare(b.label));
        setDestination(filteredOptions);
        setShowDestinationDropdown(true);
    };
    const handleDestination = (value,airportName) => {
        setInputDestination(`${airportDestinationCodes[value]} (${value}) ${airportName}`);
        setShowDestinationDropdown(false);
    };
    const handleClasstype = (value) => {
        setCabinClass(value);
    };
    const handleAdult = (value) => {
        setAdultCount(value);
    };
    const handleChild = (value) => {
        setChildCount(value);
    };
    const handleInfant = (value) => {
        setInfantCount(value);
        const infanterror = document.querySelector('.infantmore');
        if(value > adultCount){
            infanterror.style.display = 'block';
        }else{
            infanterror.style.display = 'none';
        }
        
    };
    const [formData, setFormData] = useState({
        departureDate: new Date(),
        returnDate: null,
        flightOrigin: localStorage.getItem('lastorigin') || '',
        flightDestination: localStorage.getItem('lastDestination') || '',
        bookingType: 'oneway',
        adult: '1',
        child: '0',
        infant: '0',
        classType: 'Economy/Premium Economy',
    });

    const handleReturnDateInitialization = (bookingType) => {
        if (bookingType === 'oneway') {
            setReturnEnabled(false);
            setFormData({ ...formData, bookingType, returnDate: null });
        } else {
            setReturnEnabled(true);
            const nextDay = new Date();
            if (formData.departureDate) {
                setFormData({ ...formData, bookingType, returnDate: formData.departureDate });
            } else {
                nextDay.setDate(nextDay.getDate() + 1);
                setFormData({ ...formData, bookingType, returnDate: nextDay });
            }
        }
    };
    
    const getLabelStyle = (labelValue) => {
        if (labelValue === formData.bookingType) {
            return { color: '#fff', backgroundColor: '#785eff' };
        } else {
            return {};
        }
    };
    const handleRadioChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, bookingType: value });
        handleReturnDateInitialization(value);
    };

    // const handleDepartureDateChange = (date) => {
    //     setdepIsOpen(false);
    //     if(formData.returnDate){
    //         setFormData({ ...formData, departureDate: date, returnDate: date });
    //     }else{
    //         setFormData({ ...formData, departureDate: date });
    //     }
    //     // setReturnEnabled(true);
    // };
    const handleDepartureDateChange = (date) => { 
        setFormData((prev) => ({
            ...prev,
            departureDate: date,
            ...(prev.returnDate && { returnDate: date }), // Update return date only if it exists
        }));
        setTimeout(() => {
            setdepIsOpen(false); // Delay to ensure DatePicker processes the update
        }, 0); // Add timeout to force re-render after updating state
    };

    const handleReturnDateChange = (date) => {
        // Close the date picker after selection with a delay
        setTimeout(() => {
            setretIsOpen(false);
        }, 0); // Delay of 200ms to allow for the selection to register
    
        setFormData({
            ...formData,
            returnDate: date,
            bookingType: 'Return',
        });
    };
    
    const fetchToken = async () => {
        const storedToken = localStorage.getItem('authToken');
        const tokenTimestamp = localStorage.getItem('authTokenTimestamp');
        const currentDate = new Date();
    
        console.log('storedToken:', storedToken);
        console.log('tokenTimestamp:', tokenTimestamp);
    
        // Check if both storedToken and tokenTimestamp are available and valid
        if (storedToken && storedToken !== 'null') {
            console.log('Token exists.');
            
            if (tokenTimestamp) {
                console.log('Timestamp exists.');
                
                // Check if the stored token's timestamp matches today's date
                if (new Date(tokenTimestamp).toDateString() === currentDate.toDateString()) {
                    console.log('Token is valid and current.');
                    return storedToken; // Return the stored token if valid
                } else {
                    console.log('Token is expired (date mismatch).');
                }
            } else {
                console.log('Timestamp is missing, fetching new token...');
            }
        } else {
            console.log('Token is missing, fetching new token...');
        }

        const authPayload = {
            ClientId: "ApiIntegrationNew",
            UserName: "BAI",
            Password: "Bai@12345",
            EndUserIp: '192.168.11.120',
        };
    
        try {
            const authResponse = await axios.post(
                'https://cors-anywhere.herokuapp.com/http://api.tektravels.com/SharedServices/SharedData.svc/rest/Authenticate',
                JSON.stringify(authPayload),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Forwarded-For': '192.168.11.120',
                    }
                }
            );
            console.log('authResponse',authResponse.data);
    
            const newToken = authResponse.data.TokenId;
            localStorage.setItem('authToken', newToken);
            localStorage.setItem('authTokenTimestamp', currentDate.toISOString());
    
            console.log('New token saved:', newToken);
            return newToken;
        } catch (error) {
            console.error('Error fetching token:', error);
            throw new Error('Authentication failed');
        }
    };

    async function getAccessToken() {
        const tokenKey = 'ndc_access_token';
        const expirationKey = 'ndc_token_expiration';
        const now = Date.now();
      
        const storedToken = localStorage.getItem(tokenKey);
        const storedExpiration = localStorage.getItem(expirationKey);
      
        // Use cached token if it's valid
        if (storedToken && storedExpiration && now < Number(storedExpiration)) {
        //   console.log('Using cached token');
          return storedToken;
        }
      
        const url = 'https://devapi.taxivaxi.com/reactSelfBookingApi/v1/makeNDCAuthenticationApiRequest';
      
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const data = await response.json();
          const token = data.access_token;
          const expirationTime = now + 24 * 60 * 60 * 1000; // 24 hours validity
      
          // Store the token and expiration time in localStorage
          localStorage.setItem(tokenKey, token);
          localStorage.setItem(expirationKey, expirationTime.toString());
      
        //   console.log('Access token fetched successfully:', token);
          return token;
        } catch (error) {
          console.error('Failed to fetch access token:', error.message);
          throw error;
        }
      }
      
    //   getAccessToken();

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.time("make api request");
        let searchfrom = event.target.searchfrom.value.trim();

        // let searchfrom = formActual;
        let searchto = event.target.searchto.value.trim();
        let searchdeparture = event.target.searchdeparture.value.trim();
        let searchreturnDate = event.target.searchreturnDate.value.trim();
        const originerror = document.querySelector('.redorigin');
        const originerror1 = document.querySelector('.redorigin1');
        const destinationerror = document.querySelector('.redestination');
        const destinationerror1 = document.querySelector('.redestination1');
        const searchdepartureerror = document.querySelector('.redsearchdeparture');
        const searchreturnerror = document.querySelector('.redsearchreturn');
        const searchdepartureerror1 = document.querySelector('.redsearchdeparture1');
        const searchreturnerror1 = document.querySelector('.redsearchreturn1');
        const passengererror = document.querySelector('.redpassenger');
        const infanterror = document.querySelector('.infantmore');
        
        let totalpassenger = parseInt(adultCount) + parseInt(childCount) + parseInt(infantCount);
        let isValidPassenger = true;
        localStorage.setItem('lastorigin', searchfrom);
        localStorage.setItem('lastDestination', searchto);
        
        
        if(infantCount > adultCount){
           
            isValidPassenger = false;
            infanterror.style.display = 'block';
        }else{
            infanterror.style.display = 'none';
        }
        const formatPattern = /\((.*?)\)/;
        const dateFormatPattern = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
        if (!searchfrom) {
            isValidPassenger = false;
            originerror.style.display = 'block';
        }else if(!formatPattern.test(searchfrom)){
            isValidPassenger = false;
            originerror1.style.display = 'block';
        }else{
            originerror1.style.display = 'none';
            originerror.style.display = 'none';
        }
        if (!searchto) {
            isValidPassenger = false;
            destinationerror.style.display = 'block';
        }else if(!formatPattern.test(searchto)){
            isValidPassenger = false;
            destinationerror1.style.display = 'block';
        }else{
            destinationerror.style.display = 'none';
            destinationerror1.style.display = 'none';
        }
        if (!searchdeparture) {
            isValidPassenger = false;
            searchdepartureerror.style.display = 'block';
        }else if(!dateFormatPattern.test(searchdeparture)){
            isValidPassenger = false;
            searchdepartureerror1.style.display = 'block';
        }else{
            searchdepartureerror.style.display = 'none';
            searchdepartureerror1.style.display = 'none';
        }
        if(formData.bookingType === 'Return'){
            if (!searchreturnDate) {
                isValidPassenger = false;
                searchreturnerror.style.display = 'block';
            }else{
                searchreturnerror.style.display = 'none';
            }
        }else{
            searchreturnerror.style.display = 'none';
        }
        
        if (searchreturnDate && !dateFormatPattern.test(searchreturnDate)) {
            isValidPassenger = false;
            searchreturnerror1.style.display = 'block';
        }else{
            searchreturnerror1.style.display = 'none';
        }
        if(totalpassenger > 9){
            isValidPassenger = false;
            passengererror.style.display = 'block';
        }else{
            passengererror.style.display = 'none';
        }
        if(isValidPassenger){
            setLoading(true);
            // const token = await ndcToken();

            const formatDate = (inputDate) => {
            const parsedDate = parse(inputDate, 'dd/MM/yyyy', new Date());
            if (!isValid(parsedDate)) {
                return null;
            }else{
                const formattedDate = format(parsedDate, 'yyyy-MM-dd');
                return formattedDate;
            }
            
            };
      
            const searchfrom = event.target.searchfrom.value;
            const searchfromMatch = searchfrom.match(/\((\w+)\)/);
            const searchfromCode = searchfromMatch[1];
            const searchto = event.target.searchto.value;
            const searchtoMatch = searchto.match(/\((\w+)\)/);
            const searchtoCode = searchtoMatch[1];
            const searchdeparture= event.target.searchdeparture.value;
            const searchreturnDate= event.target.searchreturnDate.value;
            const formattedsearchdeparture = formatDate(searchdeparture);
            const formattedsearchreturnDate = formatDate(searchreturnDate);
            
            const adult = event.target.adult.value;
            const child = event.target.child.value;
            const infant = event.target.infant.value;
            const classtype= event.target.classtype.value;
            let cabinclass = classtype;
            let bookingtype ="";
            if (searchreturnDate) {
                bookingtype = "Return";
            } else {
                bookingtype = "oneway";
            }
            if (classtype === "Economy/Premium Economy") {
            cabinclass = "Economy";
            }else{
                cabinclass = classtype;
            }
            try {
            
            const dynamicCityCode = searchfromCode; 
            const dynamicDestinationCode = searchtoCode; 
            const dynamicDepTime = formattedsearchdeparture;
            const returndynamicDepTime = formattedsearchreturnDate;
            const dynamicCabinType = cabinclass; 
            const PassengerCodeADT = adult; 
            const PassengerCodeCNN = child; 
            const PassengerCodeINF = infant; 

            const createSoapEnvelope = (
                cityCode,
                destinationCode,
                depTime,
                returnDepTime,
                cabinType,
                passengerCodeADT,
                passengerCodeCNN,
                passengerCodeINF
            ) => {
            
                const generatePassengerElements = (age, count,type) => {
                return Array.from({ length: count }, (_, index) => `<com:SearchPassenger Code="${type}"${age ? ` Age="${age}"` : ''}/>`).join('');
                };
                const searchPassengerADT = generatePassengerElements('', passengerCodeADT,'ADT');
                const searchPassengerCNN = generatePassengerElements('10', passengerCodeCNN,'CNN');
                const searchPassengerINF = generatePassengerElements('01', passengerCodeINF,'INF');
                
                const returnLegSection = returnDepTime
                ? `<air:SearchAirLeg>
                    <air:SearchOrigin>
                    <com:CityOrAirport Code="${destinationCode}"/>
                    </air:SearchOrigin>
                    <air:SearchDestination>
                    <com:CityOrAirport Code="${cityCode}"/>
                    </air:SearchDestination>
                    <air:SearchDepTime PreferredTime="${returnDepTime}"/>
                </air:SearchAirLeg>`
                : '';
                
            
                return `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soap:Body>
                    <air:LowFareSearchReq TargetBranch="P7206253" TraceId="TVSBP001" SolutionResult="false" DistanceUnits="Km" AuthorizedBy="TAXIVAXI" xmlns:air="http://www.travelport.com/schema/air_v52_0" xmlns:com="http://www.travelport.com/schema/common_v52_0">
                        <com:BillingPointOfSaleInfo OriginApplication="UAPI"/>
                        <air:SearchAirLeg>
                            <air:SearchOrigin>
                                <com:CityOrAirport Code="${cityCode}"/>
                            </air:SearchOrigin>
                            <air:SearchDestination>
                                <com:CityOrAirport Code="${destinationCode}"/>
                            </air:SearchDestination>
                            <air:SearchDepTime PreferredTime="${depTime}"/>
                        </air:SearchAirLeg>
                        ${returnLegSection}
                        <air:AirSearchModifiers ETicketability="Yes" FaresIndicator="AllFares">
                            <air:PreferredProviders>
                                <com:Provider Code="1G"/>
                                <com:Provider Code="ACH"/>
                            </air:PreferredProviders>
                            <air:PermittedCabins>
                                <com:CabinClass Type="${cabinType}"/>
                            </air:PermittedCabins>
                        </air:AirSearchModifiers>
                        ${searchPassengerADT}
                        ${searchPassengerCNN}
                        ${searchPassengerINF}
                    </air:LowFareSearchReq>
                </soap:Body>
                </soap:Envelope>`;
            };
            
            var soapEnvelope = createSoapEnvelope(
                dynamicCityCode,
                dynamicDestinationCode,
                dynamicDepTime,
                returndynamicDepTime,
                dynamicCabinType,
                PassengerCodeADT,
                PassengerCodeCNN,
                PassengerCodeINF,
                );
                console.timeEnd("make api request");

            sessionStorage.setItem('searchdata', soapEnvelope);
            console.time("API Call");
            const response = await axios.post(
                'https://devapi.taxivaxi.com/reactSelfBookingApi/v1/makeFlightAirServiceRequest', 
                soapEnvelope, { headers: { 'Content-Type': 'text/xml'  }}
            );
                console.log("searchresponse", response);
                console.timeEnd("API Call");

            const requestBody = {
                "CatalogProductOfferingsQueryRequest": {
                  "CatalogProductOfferingsRequest": {
                    "@type": "CatalogProductOfferingsRequestAir",
                    "maxNumberOfUpsellsToReturn": 4,
                    "offersPerPage": 10,
                    "contentSourceList": ["NDC"],
                    "PassengerCriteria": [
                      { "number": 1, "passengerTypeCode": "ADT" },
                      { "number": 1, "passengerTypeCode": "CHD" },
                      { "number": 1, "passengerTypeCode": "INF" },
                    ],
                    "SearchCriteriaFlight": [
                      {
                        "departureDate": dynamicDepTime,
                        "From": { "value": dynamicCityCode }, 
                        "To": { "value": dynamicDestinationCode },
                      },
                    ],
                    "SearchModifiersAir": {
                      "@type": "SearchModifiersAir",
                      "CarrierPreference": [
                        {
                          "preferenceType": "Preferred",
                          "carriers": ["AI"],
                        },
                      ],
                    },
                  },
                },
              };
            //   console.log('requestbody', requestBody);
            const endpoint = `${baseURL}/${version}/air/catalog/search/catalogproductofferings`; 
            
                const requestBdy = {
                request: requestBody,
                endpoint: endpoint
              };
      
                //   console.log('requestbody', requestBody);
            let token;
            try {
                token = await getAccessToken(); // Call your token function
                // console.log('token', token);
            } catch (error) {
                console.error("Error fetching token:", error.message);
                return;
            }
            const apiUrl = `https://${baseURL}/${version}/air/catalog/search/catalogproductofferings`;
            const requestData = JSON.stringify(requestBody);
                const formBody = {
                    url: apiUrl,
                    requestData: requestData,
                    token: token
                  };
        
            // Send the POST request
            // const ndcresponse = await axios.post(
            //     "https://devapi.taxivaxi.com/reactSelfBookingApi/v1/makeNDCApiRequest",
            //     formBody
            // );
            // console.log('ndcresponse', ndcresponse);
            console.time("redirect");
            const responseData = {
                responsedata :response.data,
                // ndcresponse :ndcresponse.data, 
                searchfromcity :searchfrom,
                searchtocity :searchto,
                searchdeparture:searchdeparture,
                searchreturnDate:searchreturnDate,
                airlinedata : airlineData.data,
                airportData :airportData.data,
                selectadult :adult,
                selectchild :child,
                selectinfant:infant,
                selectclass:cabinclass,
                bookingtype :bookingtype,
                apiairportsdata:apiairports,
                requesttype: 'book',
                fromcotrav: '1',
                };
                console.timeEnd("redirect");
            console.log('searchresponse', response);
            navigate('/SearchFlight', { state: { responseData } });
            } catch (error) {
                // ErrorLogger.logError('search_api',soapEnvelope,error);
                navigate('/tryagainlater');
            }
            finally {
                setLoading(false);
            }
        }
        
    };
   
    const handleClickOutside = (event) => {
        // Check if the click is outside the div
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setIsOpen(false); // Close the div
        }
    };

    // const [formActual, setformActual] = useState(null);
    // console.log('form', formActual);
    
return (
            <div className="yield-content">
                <div className="index-page">
                    <div id="api-response-container"></div>
                    {loading &&  
                        <div className="page-center-loader flex items-center justify-center">
                            <div className="big-loader flex items-center justify-center">
                                <IconLoader className="big-icon animate-[spin_2s_linear_infinite]" />
                                <p className="text-center ml-4 text-gray-600 text-lg">
                                
                                </p>
                            </div>
                        </div>
                    }
                    {/* <div id="loaderone">
                        <img src="img/loader2.gif" alt="Loader" />
                    </div> */}

                    <div className="main-cont">
                        <div className="body-padding">
                            {/* <div className="mp-slider"> */}

                                <div className="mp-slider-row">
                                    <div className="swiper-container">
                                        
                                    </div>
                                </div>

                            {/* </div> */}

                            <div className="wrapper-a-holder">
                                <div className="wrapper-a">
                                    <div className="page-search full-width-search search-type-b">
                                        <div className="search-type-padding" style={{ marginTop: '-160px' }}>
                                            <nav className="page-search-tabs">

                                                <div className="clear"></div>
                                            </nav>
                                            <div className="pages_filter">
     
                                            </div>
                                                <div className="page-search-content" style={{ display: activeTab === 'flight' ? 'block' : 'none' }}>


                                                    <div className="search-tab-content " >
                                                    

                                                    <form id="submit-form" onSubmit={(e) => handleSubmit(e)} action="" method="POST" autoComplete="off">
                                                    <input type="hidden" name="_token" defaultValue="S1NzGDzenZ2TihPVjEByzt2t1VkgNBfoEIoqg8rK" />
                            <div className="booking-container">
                            <h2 style={{ marginLeft:'19px'}}>Flight Booking</h2>

                            <div className="page-search-p1">
                                    <div className="One_Way">
                                        <input
                                            type="radio"
                                            className="bookingtypecheck"
                                            name="bookingtype"
                                            value="oneway"
                                            onChange={handleRadioChange}
                                            checked={formData.bookingType === 'oneway'}
                                            id="departureRadio"
                                        />
                                        <label className="bookingtype onewaybookingtype" htmlFor="departureRadio" style={getLabelStyle('oneway')}>One-Way</label>
                                    </div>

                                    <div className="Return">
                                        <input
                                            type="radio"
                                            className="bookingtypecheck"
                                            name="bookingtype"
                                            value="Return"
                                            onChange={handleRadioChange}
                                            checked={formData.bookingType === 'Return'}
                                            id="returnRadio"
                                        />
                                        <label className="bookingtype returnbookingtype" htmlFor="returnRadio" style={getLabelStyle('Return')}>Return</label>
                                    </div>
                                    <div className="clear"></div>
                                    
                                </div>

                            <div className="form-roww page-search-p" >

                                <div className="form-groupp">
                                {/* <label htmlFor="from">From</label> */}
                                <div className="location-info">
                                    <div className="input-a" style={{ border: 'none', boxShadow: 'none' }}>
                                        <div className="location-header">FROM</div>
                                        <div className="location-details" style={{ position: 'relative' }}>
                                            {/* Editable city name */}
                                            <input
                                                type="text"
                                                id="searchfrom"
                                                className="city-name-input"
                                                name="searchfrom"
                                                // original={inputOrigin}
                                                value={inputOrigin} // Display only the city name
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    handleOriginChange(value);
                                                    setShowOriginDropdown(true); // Show dropdown when typing or emptying the field

                                                    // Hide error if value is not empty
                                                    const errorElement = document.querySelector('.redorigin');
                                                    if (value.trim() !== '') {
                                                        errorElement.style.display = 'none';
                                                    } else {
                                                        errorElement.style.display = 'block';
                                                    }
                                                }}
                                                placeholder="Enter city"
                                                onFocus={() => setShowOriginDropdown(true)} // Show dropdown when focused
                                                onBlur={(e) => {
                                                    // Validate input on blur
                                                    const value = e.target.value;
                                                    const errorElement = document.querySelector('.redorigin');
                                                    if (value.trim() !== '') {
                                                        errorElement.style.display = 'none';
                                                    } else {
                                                        errorElement.style.display = 'block';
                                                    }
                                                    // Delay hiding dropdown to allow click on options
                                                    setTimeout(() => setShowOriginDropdown(false), 200);
                                                }}
                                            />
                                            <div className="airport-name">
                                                {inputOrigin.split(')').slice(1).join(')').trim()} {/* Display everything after the city */}
                                            </div>
                                            {showOriginDropdown && (
                                                <ul className="dropdown">
                                                    {origin.map((option) => (
                                                        <li
                                                            // onClick={setformActual(option.value)}
                                                            className="dropdown-item"
                                                            key={option.value}
                                                            onMouseDown={() => {
                                                                handleOrigin(option.value, option.airportName);
                                                                setShowOriginDropdown(false); // Hide dropdown after selecting an option
                                                            }}
                                                            
                                                        >
                                                            {option.label} ({option.value}) <br />
                                                            <span className="airport-name">{option.airportName}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="redorigin" style={{
                                    color: 'red',
                                    fontsize: '10px',
                                    fontfamily: 'Raleway', display: 'none'
                                }}>Please select Origin</div>
                                <div className="redorigin1" style={{
                                    color: 'red',
                                    fontsize: '10px',
                                    fontfamily: 'Raleway', display: 'none'
                                }}>Please select valid Origin</div>
                                </div>
                                <button type="button" className='swapbuttonn' onClick={swapOriginAndDestination}>
                                <img src='/img/swapcircle.svg' width={'25px'} loading="lazy"/>
                                </button>

                                <div className="form-groupp" >
                                    <div className="location-info">
                                        <div className="input-a" style={{ border: 'none', boxShadow: 'none' }}>
                                            <div className="location-header">TO</div>
                                            <div className="location-details" style={{ position: 'relative' }}>
                                                {/* Editable city name */}
                                                <input
                                                    type="text"
                                                    placeholder="Enter city"
                                                    id="searchto"
                                                    className="city-name-input"
                                                    name="searchto"
                                                    value={inputDestination} // Display only the city name  .split('(')[0].trim()
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        handleDestinationChange(value);
                                                        setShowDestinationDropdown(true); // Show dropdown when typing or emptying the field

                                                        // Hide error if value is not empty
                                                        const errorElement = document.querySelector('.redestination');
                                                        if (value.trim() !== '') {
                                                            errorElement.style.display = 'none';
                                                        } else {
                                                            errorElement.style.display = 'block';
                                                        }
                                                    }}
                                                    onFocus={() => setShowDestinationDropdown(true)}
                                                    onBlur={(e) => {
                                                        // Validate input on blur
                                                        const value = e.target.value;
                                                        const errorElement = document.querySelector('.redestination');
                                                        if (value.trim() !== '') {
                                                            errorElement.style.display = 'none';
                                                        } else {
                                                            errorElement.style.display = 'block';
                                                        }
                                                        // Delay hiding dropdown to allow click on options
                                                        setTimeout(() => setShowDestinationDropdown(false), 200);
                                                    }}
                                                    // style={{ width: '100%', textAlign: 'center', height: '100%', border: 'none', outline: 'none' }}
                                                />
                                                {/* Dropdown */}
                                                
                                                {/* Static airport name */}
                                                <div className="airport-name">
                                                    {inputDestination.split(')').slice(1).join(')').trim()} {/* Display everything after the city */}
                                                </div>
                                                {showDestinationDropdown && (
                                                    <ul className="dropdown">
                                                        {destination.map((option) => (
                                                            <li
                                                                className="dropdown-item"
                                                                key={option.value}
                                                                onMouseDown={() => {
                                                                    handleDestination(option.value, option.airportName);
                                                                    setShowDestinationDropdown(false); // Hide dropdown after selecting an option
                                                                }}
                                                            >
                                                                {option.label} ({option.value}) <br />
                                                                <span className="airport-name">{option.airportName}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                        </div>
                                    <div className="redestination" style={{
                                        color: 'red',
                                        fontsize: '10px',
                                        fontfamily: 'Raleway', display: 'none'
                                    }}>Please select Destination</div>
                                    <div className="redestination1" style={{
                                        color: 'red',
                                        fontsize: '10px',
                                        fontfamily: 'Raleway', display: 'none'
                                    }}>Please select valid Destination</div>

                               
                                </div>

                                <div className="form-groupp srch-tab-left">
                                {/* <label htmlFor="departureDate">Departure</label> */}
                                <div className="location-header" style={{ paddingLeft:'12px', paddingTop:'6px'}}>Departure</div>
                                {/* <div className="react-datepicker__month-container">
                                    <input
                                    type="date"
                                    id="departureDate"
                                    //   value={departureDate}
                                    //   onChange={(e) => setDepartureDate(e.target.value)}
                                    />

                                </div> */}
                                <div className="input-a" style={{ border:'none', boxShadow:'none', paddingLeft:'12px'}} onClick={() => setdepIsOpen(true)}>
                                    <DatePicker
                                        name="searchdeparture"
                                        selected={formData.departureDate}
                                        // onChange={handleDepartureDateChange}
                                        dateFormat="dd/MM/yyyy"
                                        minDate={new Date()}
                                        value={formData.departureDate}
                                        open={isdepOpen}
                                        onChange={(date) => {
            handleDepartureDateChange(date); // Update date and close calendar
        }}
                                        onClickOutside={() => setdepIsOpen(false)}
                                    />
                                    <span className="date-icon" onClick={(e) => {e.stopPropagation(); setdepIsOpen(true)}}></span>
                                    </div>
                                    <span id="errorDate" style={{
                                        color: 'red',
                                        fontsize: '12px',
                                        fontfamily: 'Raleway'
                                    }} className="error-message"></span>
                                    <div className="redsearchdeparture" style={{
                                        color: 'red',
                                        fontsize: '12px',
                                        fontfamily: 'Raleway'
                                    }}>Please select Departure Date</div>
                                    <div className="redsearchdeparture1" style={{
                                        display:'none',
                                        color: 'red',
                                        fontsize: '12px',
                                        fontfamily: 'Raleway'
                                    }}>Please select valid Departure Date</div>                                                                           
                                </div>

                                <div className="form-groupp srch-tab-right" id="departurereturn">
                                {/* <label htmlFor="returnDate">Return</label> */}
                                <div className="location-header" style={{ paddingLeft:'12px', paddingTop:'6px'}}>Return</div>
                                <div className="input-a" style={{ border:'none', boxShadow:'none', paddingLeft:'12px'}} onClick={formData.bookingType === "Return" ? () => setretIsOpen(true) : () => () => setretIsOpen(false)}>
                                    <DatePicker
                                    name="searchreturnDate"
                                    selected={formData.returnDate}
                                    onChange={handleReturnDateChange}
                                    dateFormat="dd/MM/yyyy"
                                    minDate={formData.departureDate || new Date()}
                                    placeholderText="Add Return Date"
                                    disabled={!isReturnEnabled}
                                    open={isretOpen}
                                    onClickOutside={() => setretIsOpen(false)}
                                    />
                                    <span
                                    className="date-icon"
                                    onClick={(e) => {
                                        if (formData.bookingType === "Return") {
                                        e.stopPropagation();
                                        setretIsOpen(true);
                                        }
                                    }}
                                    ></span>
                                    </div>
                                    <span id="errorDate1" style={{
                                    color: 'red',
                                    fontsize: '12px',
                                    fontfamily: 'Raleway'
                                    }} className="error-message"></span>
                                    <div className="redsearchreturn" style={{
                                    display:'none',
                                    color: 'red',
                                    fontsize: '12px',
                                    fontfamily: 'Raleway'
                                    }}>Please select Return Date</div>
                                    <div className="redsearchreturn1" style={{
                                    display:'none',
                                    color: 'red',
                                    fontsize: '12px',
                                    fontfamily: 'Raleway'
                                    }}>Please select valid Return Date</div>
                                </div>

                                <div className="form-groupp srch-tab-line no-margin-bottom">
                                    {/* <label htmlFor="travellers">Travellers & Class</label> */}
                                    <div className="location-header" style={{ paddingLeft:'12px', paddingTop:'6px'}}>Travellers & Class</div>
                                    <div className="input-a" style={{ border:'none', boxShadow:'none', paddingLeft:'12px'}}>
                                        <input
                                            type="text"
                                            id="openpassengermodal"
                                            name="openpassengermodal"
                                            className="openpassengermodal srch-lbl"
                                            placeholder="Select all"
                                            value={`Adult: ${adultCount}, Child: ${childCount}, Infant: ${infantCount}, Cabinclass: ${cabinClass} class`}
                                            onClick={handleToggle}
                                            readOnly
                                        />
                                        
                                    </div>
                                    <div className="redpassenger" style={{
                                        color: 'red',
                                        fontsize: '12px',
                                        fontfamily: 'Raleway'
                                    }}>Please select maximum 9 passenger</div>
                                    <div className="infantmore" style={{
                                        color: 'red',
                                        fontsize: '12px',
                                        fontfamily: 'Raleway'
                                    }}>Number of infants cannot be more than adults</div>

                                </div>
                            </div>
                                
                            
                            <div id="error-message1" style={{ color: 'red', marginleft: '2%', fontfamily: 'Raleway', fontsize: '13px' }}></div>
                            <div id="error-message2" style={{ color: 'red', marginleft: '2%', fontfamily: 'Raleway', fontsize: '13px' }}></div>

                            {/* <button className="search-buttonn">SEARCH</button> */}
                            <button type="submit" className="search-buttonn" style={{ position:'absolute', bottom:'-121px', left:'41.5%'}} id="btnSearch">SEARCH</button>
                            </div>
                            <div ref={searchRef} className="search-asvanced" style={{ display: isOpen ? 'block' : 'none' }}>
                                <div className="search-large-i">
                                    <div className="srch-tab-line no-margin-bottom">
                                        <label style={{ textAlign:'left', marginBottom:'0px' }}>Adults (12y +)</label>
                                        <p style={{color:'#7b7777', fontSize:'small', marginBottom:'1px'}}>on the day of travel</p>
                                        <div className="select-wrapper1">
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
                                                <React.Fragment key={value}>
                                                    <input
                                                        type="radio"
                                                        name="adult"
                                                        id={`adult${value}`}
                                                        value={value}
                                                        onChange={(e) => handleAdult(e.target.value)}
                                                        checked={Cookies.get('cookiesData') ? value.toString() === adultCount.toString() : value === 1}
                                                    />
                                                    <label htmlFor={`adult${value}`}>{value}</label>
                                                </React.Fragment>
                                            ))}
                                            <input
                                                type="radio"
                                                name="adult"
                                                id="adultgreater9"
                                                value={10}
                                                onChange={(e) => handleAdult(e.target.value)}
                                            />
                                            <label htmlFor="adultgreater9">&gt;9</label>
                                        </div>
                                    </div>
                                    <div className="row-container">
                                        <div className="srch-tab-line no-margin-bottom">
                                            <label style={{ textAlign: 'left', marginBottom: '0px' }}>Children (2y - 12y)</label>
                                            <p style={{ color: '#7b7777', fontSize: 'small', marginBottom: '1px' }}>on the day of travel</p>
                                            <div className="select-wrapper1">
                                                {[0, 1, 2, 3, 4, 5, 6].map((value) => (
                                                    <React.Fragment key={value}>
                                                        <input
                                                            type="radio"
                                                            name="child"
                                                            id={`child${value}`}
                                                            value={value}
                                                            onChange={(e) => handleChild(e.target.value)}
                                                            checked={Cookies.get('cookiesData') ? value.toString() === childCount.toString() : value === 0}
                                                        />
                                                        <label htmlFor={`child${value}`}>{value}</label>
                                                    </React.Fragment>
                                                ))}
                                                <input
                                                    type="radio"
                                                    name="child"
                                                    id="childgreater6"
                                                    value={7}
                                                    onChange={(e) => handleChild(e.target.value)}
                                                />
                                                <label htmlFor="childgreater6">&gt;6</label>
                                            </div>
                                        </div>
                                        <div className="srch-tab-line no-margin-bottom">
                                            <label style={{ textAlign: 'left', marginBottom: '0px' }}>Infants (below 2y)</label>
                                            <p style={{ color: '#7b7777', fontSize: 'small', marginBottom: '1px' }}>on the day of travel</p>
                                            <div className="select-wrapper1">
                                                {[0, 1, 2, 3, 4, 5, 6].map((value) => (
                                                    <React.Fragment key={value}>
                                                        <input
                                                            type="radio"
                                                            name="infant"
                                                            id={`infant${value}`}
                                                            value={value}
                                                            onChange={(e) => handleInfant(e.target.value)}
                                                            checked={Cookies.get('cookiesData') ? value.toString() === infantCount.toString() : value === 0}
                                                        />
                                                        <label htmlFor={`infant${value}`}>{value}</label>
                                                    </React.Fragment>
                                                ))}
                                                <input
                                                    type="radio"
                                                    name="infant"
                                                    id="infantgreater6"
                                                    value={7}
                                                    onChange={(e) => handleInfant(e.target.value)}
                                                />
                                                <label htmlFor="infantgreater6">&gt;6</label>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                {/* Travel Class Selection */}
                                <div className="search-large-i1">
                                    <div className="srch-tab-line no-margin-bottom">
                                        <label style={{ marginBottom:'1%', textAlign:'left'}}>Choose Travel Class</label>
                                        <div className="select-wrapper1 select-wrapper2">
                                            {['Economy/Premium Economy', 'Business', 'First'].map((value) => (
                                                <React.Fragment key={value}>
                                                    <input
                                                        type="radio"
                                                        name="classtype"
                                                        id={`classtype${value}`}
                                                        value={value}
                                                        onChange={(e) => handleClasstype(e.target.value)}
                                                        checked={Cookies.get('cookiesData') ? value.toString() === cabinClass.toString() : value === "Economy/Premium Economy"}
                                                    />
                                                    <label style={{lineHeight:'2'}} htmlFor={`classtype${value}`}>{value === "Economy/Premium Economy" ? value : `${value} class`}</label>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button type='button' className="search-buttonn" style={{marginLeft:'67%'}} onClick={() => { setIsOpen(false);}}>Apply</button>
                                </div>
                            </form>
                            
                                                    </div>
                                                    
                                                </div>
                                                
                                        </div>
                                    </div>
                                    <div className="clear"></div>
                                </div>
                            </div>

                            <div className="mp-offesr">
                                <div className="wrapper-padding-a">
                                    <div className="offer-slider">
                                        <header className="fly-in">
                                            <div className="offer-slider-lbl">Services We Offer</div>
                                        </header>
                                        <div className="fly-in offer-slider-c">
                                            <div id="offers-a" className="owl-slider">
                                                <div className="offer-slider-i">
                                                    <a className="offer-slider-img" href="#">
                                                        <img alt="" src="img/taxivaxi/home_page/services_offer/Cab%202.png" loading="lazy"/>
                                                        <span className="offer-slider-overlay">
                                                            <span className="offer-slider-btn">view details</span>
                                                        </span>
                                                    </a>
                                                    <div className="offer-slider-txt">
                                                        <div className="offer-slider-link"><a href="#">Cabs</a></div>
                                                        <div className="offer-slider-l">

                                                            <nav className="stars">
                                                                <ul>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" loading="lazy" /></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" loading="lazy"/></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" loading="lazy"/></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" loading="lazy"/></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-a.png" loading="lazy"/></a></li>
                                                                </ul>
                                                                <div className="clear"></div>
                                                            </nav>
                                                        </div>
                                                        <div className="offer-slider-r align-right">
                                                            
                                                        </div>

                                                        <div className="clear"></div>
                                                    </div>
                                                </div>
                                                <div className="offer-slider-i">
                                                    <a className="offer-slider-img" href="#">
                                                        <img alt="" src="img/taxivaxi/home_page/services_offer/Hotel%202.png" loading="lazy"/>
                                                        <span className="offer-slider-overlay">
                                                            <span className="offer-slider-btn">view details</span>
                                                        </span>
                                                    </a>
                                                    <div className="offer-slider-txt">
                                                        <div className="offer-slider-link"><a href="#">Hotel Bookings</a></div>
                                                        <div className="offer-slider-l">
                                                            <nav className="stars">
                                                                <ul>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" loading="lazy"/></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" loading="lazy"/></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" loading="lazy"/></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" loading="lazy"/></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-a.png" loading="lazy"/></a></li>
                                                                </ul>
                                                                <div className="clear"></div>
                                                            </nav>
                                                        </div>
                                                        <div className="offer-slider-r">
                                                            
                                                        </div>
                                                        
                                                        <div className="clear"></div>
                                                    </div>
                                                </div>
                                                <div className="offer-slider-i">
                                                    <a className="offer-slider-img" href="#">
                                                        <img alt="" src="img/taxivaxi/home_page/services_offer/Ticket%201.png" loading="lazy" />
                                                        <span className="offer-slider-overlay">
                                                            <span className="offer-slider-btn">view details</span>
                                                        </span>
                                                    </a>
                                                    <div className="offer-slider-txt">
                                                        <div className="offer-slider-link"><a href="#">Ticketing</a></div>
                                                        <div className="offer-slider-l">
                                                            <nav className="stars">
                                                                <ul>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" loading="lazy"/></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" loading="lazy"/></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" loading="lazy"/></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" loading="lazy"/></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" loading="lazy"/></a></li>
                                                                </ul>
                                                                <div className="clear"></div>
                                                            </nav>
                                                        </div>
                                                        <div className="offer-slider-r">
                                                            
                                                        </div>
                                                        
                                                        <div className="clear"></div>
                                                    </div>
                                                </div>
                                                <div className="offer-slider-i">
                                                    <a className="offer-slider-img" href="#">
                                                        <img alt="" src="img/taxivaxi/home_page/services_offer/Logistics%201.png" loading="lazy"/>
                                                        <span className="offer-slider-overlay">
                                                            <span className="offer-slider-btn">view details</span>
                                                        </span>
                                                    </a>
                                                    <div className="offer-slider-txt">
                                                        <div className="offer-slider-link"><a href="#">Logistics</a></div>
                                                        <div className="offer-slider-l">
                                                            <nav className="stars">
                                                                <ul>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" loading="lazy"/></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" loading="lazy"/></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" loading="lazy"/></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" loading="lazy"/></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-a.png" loading="lazy"/></a></li>
                                                                </ul>
                                                                <div className="clear"></div>
                                                            </nav>
                                                        </div>
                                                        <div className="offer-slider-r">
                                                            
                                                        </div>
                                                        <div className="clear"></div>
                                                    </div>
                                                </div>
                                                <div className="offer-slider-i">
                                                    <a className="offer-slider-img" href="#">
                                                        <img alt="" src="img/taxivaxi/home_page/services_offer/FRRO%20VISA%201.png" loading="lazy"/>
                                                        <span className="offer-slider-overlay">
                                                            <span className="offer-slider-btn">view details</span>
                                                        </span>
                                                    </a>
                                                    <div className="offer-slider-txt">
                                                        <div className="offer-slider-link"><a href="#">FRRO/Visa Consultancy</a></div>
                                                        <div className="offer-slider-l">
                                                            <nav className="stars">
                                                                <ul>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" loading="lazy"/></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" loading="lazy"/></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" loading="lazy"/></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" loading="lazy"/></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-a.png" loading="lazy"/></a></li>
                                                                </ul>
                                                                <div className="clear"></div>
                                                            </nav>
                                                        </div>
                                                        <div className="offer-slider-r align-right">
                                                        </div>
                                                        <div className="clear"></div>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            

                            <div className="theme-teaser">
                                <div className="theme-teaser-padding">
                                    <div className="wrapper-padding fly-in">
                                        <div className="theme-teaser-l">
                                            <div className="theme-teaser-a">Simplifying your<br />Business Travel</div>
                                            <div className="theme-teaser-b">Navigating your corporate travel needs, from Takeoff to Touchdown.</div>
                                            <a href="#" className="theme-teaser-c">book a Demo</a>
                                        </div>
                                        <div className="theme-teaser-r"><img alt="" src="img/taxivaxi/home_page/simplifying/Artboard%201-8.png" loading="lazy"/></div>
                                        <div className="clear"></div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="mp-pop">
                            <div className="wrapper-padding-a">
                                <div className="mp-popular">
                                    <header className="fly-in">
                                        <b>Why choose TaxiVaxi?</b>
                                    </header>
                                    <div className="fly-in advantages-row">
                                        <div className="advantages-i">
                                            <div className="advantages-a"><img alt="" src="img/taxivaxi/home_page/why_choose_taxivaxi/Experience.svg" loading="lazy"/></div>
                                            <div className="advantages-b">Experience</div>
                                            <div className="advantages-c">With 10 years of &nbsp;team &nbsp;experience, we &nbsp;have &nbsp;built &nbsp;and &nbsp;upgraded &nbsp;a &nbsp;reliable technology.</div>
                                        </div>
                                        <div className="advantages-i">
                                            <div className="advantages-a"><img alt="" src="img/taxivaxi/home_page/why_choose_taxivaxi/Solution_provider.svg" loading="lazy"/></div>
                                            <div className="advantages-b">Solution Provider</div>
                                            <div className="advantages-c">With our problem-solving approach, we provide support to you at every step.</div>
                                        </div>
                                        <div className="advantages-i">
                                            <div className="advantages-a"><img alt="" src="img/taxivaxi/home_page/why_choose_taxivaxi/Pan_india-tie_ups.svg" loading="lazy"/></div>
                                            <div className="advantages-b">PAN India tie-ups</div>
                                            <div className="advantages-c">Providing services to corporates all over India, with partnerships, and tie-ups with many stakeholders.</div>
                                        </div>

                                    </div>
                                    <div className="fly-in advantages-row">
                                        <div className="advantages-i">
                                            <div className="advantages-a"><img alt="" src="img/taxivaxi/home_page/why_choose_taxivaxi/Extra_mile.svg" loading="lazy"/></div>
                                            <div className="advantages-b">Extra Mile</div>
                                            <div className="advantages-c">To fulfil our promise of providing good quality, we will never hesitate to take extra effort when it really matters.</div>
                                        </div>
                                        <div className="advantages-i">
                                            <div className="advantages-a"><img alt="" src="img/taxivaxi/home_page/why_choose_taxivaxi/Right_people_right_place.svg" loading="lazy"/></div>
                                            <div className="advantages-b">Right People Right Place</div>
                                            <div className="advantages-c">From FRRO consultancy to Relationship Management. We have a knowledgeable and qualified team with varied skills to help you.</div>
                                        </div>
                                        <div className="advantages-i">
                                            <div className="advantages-a"><img alt="" src="img/taxivaxi/home_page/why_choose_taxivaxi/Team_work.svg" loading="lazy"/></div>
                                            <div className="advantages-b">Team Work & Flexibility</div>
                                            <div className="advantages-c">With&nbsp; quick&nbsp; response&nbsp; time, &nbsp;we &nbsp;would &nbsp;be&nbsp; Helping &nbsp;you&nbsp; to&nbsp; reduce&nbsp; your &nbsp;workload &nbsp;and share responsibilities.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>




            </div>

            

    );
}

export default Home;