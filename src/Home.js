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
// import ErrorLogger from './ErrorLogger';
function Home() {
    const [activeTab, setActiveTab] = useState('flight');

  const openCity = (cityName) => {
    setActiveTab(cityName);
    // console.log(cityName);
  };


  


    const [apiairports, setAirports] = useState([]);
    // Swal.fire({
    //     title: 'Approval Required ',
    //     text: 'I wanted to inform you that we have found another flight with a lower price available. Before proceeding, I would require your approval to confirm this booking.',
    //     showCancelButton: true,
    //     confirmButtonText: 'Yes, continue!',
    //     cancelButtonText: 'No!',
    //     reverseButtons: true
    // });

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
    const [loading, setLoading] = useState(false);
    
    const [airlineData, setAirlineResponse] = useState(null);
    const [airportData, setAirportResponse] = useState(null);

    const [inputOrigin, setInputOrigin] = useState('Pune (PNQ) Pune Airport / Lohagaon Air Force Station');
    const [showOriginDropdown, setShowOriginDropdown] = useState(false);
    const [origin, setOrigin] = useState([]);
    const [allAirportsOrigin, setAllAirportsOrigin] = useState([]);
    const [airportOriginCodes, setAirportOriginCodes] = useState(null);

    const [inputDestination, setInputDestination] = useState('Delhi (DEL) Indira Gandhi International Airport');
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

    useEffect(() => {
        const makeAirlineRequest = async () => {
        try {
            const username = 'Universal API/uAPI8645980109-af7494fa';
            const password = 'N-k29Z}my5';
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
            
            const airlineresponse = await axios.post('https://cors-anywhere.herokuapp.com/https://apac.universal-api.pp.travelport.com/B2BGateway/connect/uAPI/UtilService', airlineRequest, {
            headers: {
                'Content-Type': 'text/xml',
                'Authorization': authHeader,
            },
            });
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
        try {
            const username1 = 'Universal API/uAPI8645980109-af7494fa';
            const password1 = 'N-k29Z}my5';
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
            const airportResponse = await axios.post('https://cors-anywhere.herokuapp.com/https://apac.universal-api.pp.travelport.com/B2BGateway/connect/uAPI/UtilService', airportRequest, {
            headers: {
                'Content-Type': 'text/xml',
                'Authorization': authHeader1,
            },
            });
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
        flightOrigin: 'Pune (PNQ) Pune Airport / Lohagaon Air Force Station',
        flightDestination: 'Delhi (DEL) Indira Gandhi International Airport',
        bookingType: 'oneway',
        adult: '1',
        child: '0',
        infant: '0',
        classType: 'Economy/Premium Economy',
    });
    useEffect(() => {
        Cookies.set('cookiesData', JSON.stringify(formData), { expires: 7 });
    }, []);
    const [isReturnEnabled, setReturnEnabled] = useState(false);

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
            return { color: '#fff', backgroundColor: '#bd8100' };
        } else {
            return {};
        }
    };
    const handleRadioChange = (e) => {
        const value = e.target.value;
        setFormData({ ...formData, bookingType: value });
        handleReturnDateInitialization(value);
    };

    const handleDepartureDateChange = (date) => {
        setdepIsOpen(false);
        if(formData.returnDate){
            setFormData({ ...formData, departureDate: date, returnDate: date });
        }else{
            setFormData({ ...formData, departureDate: date });
        }
        // setReturnEnabled(true);
    };
    

    const handleReturnDateChange = (date) => {
        setretIsOpen(false);
        setFormData({ 
            ...formData, 
            returnDate: date,
            bookingType: 'Return' 
        });

    };

    const navigate = useNavigate();
    const [apiResponse, setApiResponse] = useState(null);

    
    
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        let searchfrom = event.target.searchfrom.value.trim();
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
            // console.log(soapEnvelope);
            // TargetBranch="P4451438"
            // <com:Provider Code="ACH"/>
            // const username = 'Universal API/uAPI6514598558-21259b0c';
            // const password = 'tN=54gT+%Y';
            const username = 'Universal API/uAPI8645980109-af7494fa';
            const password = 'N-k29Z}my5';
            const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

            sessionStorage.setItem('searchdata', soapEnvelope);
            
    
            const response = await axios.post('https://cors-anywhere.herokuapp.com/https://apac.universal-api.pp.travelport.com/B2BGateway/connect/uAPI/AirService', soapEnvelope, {
                headers: {
                'Content-Type': 'text/xml',
                'Authorization':authHeader,
                },
            });
            const responseData = {
                responsedata :response.data,
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
                apiairportsdata:apiairports
            };
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
    
return (
        
            <div className="yield-content">



                <div className="index-page">
                    <div id="api-response-container"></div>
                    {loading &&  <div className="loader" style={{display:"block"}}>
                        <img
                        src="/img/flight-loader-material-gif.gif"
                        alt="Loader"
                        />
                        <h2>Hold on, we’re fetching flights for you</h2>
                    </div>
                    }
                    <div id="loaderone">
                        <img src="img/loader2.gif" alt="Loader" />
                    </div>

                    <div className="main-cont">
                        <div className="body-padding">
                            <div className="mp-slider">

                                <div className="mp-slider-row">
                                    <div className="swiper-container">
                                        <div className="swiper-preloader-bg"></div>
                                        <div id="preloader">
                                            <div id="spinner"></div>
                                        </div>

                                        <a href="#" className="arrow-left"></a>
                                        <a href="#" className="arrow-right"></a>
                                        <div className="swiper-pagination"></div>
                                        <div className="swiper-wrapper">
                                            <div className="swiper-slide">
                                                <div className="slide-section" style={{ background: 'url(../img/sider-01.png) center top no-repeat' }}>

                                                </div>
                                            </div>
                                            <div className="swiper-slide">
                                                <div className="slide-section slide-b" style={{ background: 'url(../img/sider-02.jpg) center top no-repeat' }}>

                                                </div>
                                            </div>
                                            <div className="swiper-slide">
                                                <div className="slide-section slide-b" style={{ background: 'url(../img/sider-03.jpg) center top no-repeat' }}>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="wrapper-a-holder">
                                <div className="wrapper-a">
                                    <div className="page-search full-width-search search-type-b">
                                        <div className="search-type-padding" style={{ marginTop: '-200px' }}>
                                            <nav className="page-search-tabs">

                                                <div className="clear"></div>
                                            </nav>
                                            <div className="pages_filter">
                                               
                                                        
                                                        {/* <button className={`search-tab ${activeTab === 'flight' ? 'active' : ''}`} onClick={() => openCity('flight')}>
                                                            <img src="/img/flight.jpg" className="filter_img" width="50px" height="50px" />
                                                            Flights
                                                        </button> */}
                                                    
                                                        
                                                        {/* <button className={`search-tab ${activeTab === 'cab' ? 'active' : ''}`} onClick={() => openCity('cab')}>
                                                        <img src="/img/cab.jpg" className="filter_img" width="50px" height="50px" />Cabs</button>
                                                   
                                                        
                                                        <button className={`search-tab ${activeTab === 'hotel' ? 'active' : ''}`} onClick={() => openCity('hotel')}>
                                                        <img src="/img/hotel.jpg" className="filter_img" width="50px" height="50px" />
                                                        Hotels</button>
                                                    
                                                        
                                                        <button className={`search-tab ${activeTab === 'bus' ? 'active' : ''}`} onClick={() => openCity('bus')}>
                                                        <img src="/img/bus.jpg" className="filter_img" width="50px" height="50px" />
                                                        Buses</button> */}
                                                    
                                            </div>
                                                <div className="page-search-content" style={{ display: activeTab === 'flight' ? 'block' : 'none' }}>


                                                    <div className="search-tab-content " >
                                                    

                                                        <form id="submit-form" onSubmit={(e) => handleSubmit(e)} action="" method="POST" autoComplete="off">

                                                            <input type="hidden" name="_token" defaultValue="S1NzGDzenZ2TihPVjEByzt2t1VkgNBfoEIoqg8rK" /><div className="page-search-p1">
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

                                                            <div className="page-search-p">

                                                                <div className="search-large-i">

                                                                    <div className="srch-tab-line no-margin-bottom">
                                                                        <div className="srch-tab-left">
                                                                            <label>From</label>
                                                                            <div className="input-a">
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="Search..."
                                                                                    id="searchfrom"
                                                                                    className="text_input"
                                                                                    name="searchfrom"
                                                                                    value={inputOrigin}
                                                                                    onChange={(e) => handleOriginChange(e.target.value)}
                                                                                />

                                                                                {showOriginDropdown && (
                                                                                    <ul style={{
                                                                                        position: 'absolute',
                                                                                        top: '100%',
                                                                                        marginLeft: '-8px',
                                                                                        borderRadius: '3px',
                                                                                        backgroundColor: '#fff',
                                                                                        paddingLeft: '6px',
                                                                                        width: '100%',
                                                                                        border: '1px solid #e3e3e3',
                                                                                        listStyle: 'none',
                                                                                        width: '100%',
                                                                                        zIndex: '9999',
                                                                                        maxHeight: '150px',
                                                                                        minHeight: 'auto',
                                                                                        overflow: 'auto'
                                                                                    }}>
                                                                                        {origin.map((option) => (
                                                                                            <li style={{
                                                                                                cursor: 'pointer',
                                                                                                fontFamily: 'Montserrat',
                                                                                                color: '#4c4c4c',
                                                                                                fontSize: '10px',
                                                                                                paddingTop: '5px',
                                                                                                paddingBottom: '5px',
                                                                                                paddingRight: '5px'
                                                                                            }} key={option.value} onClick={() => handleOrigin(option.value,option.airportName)}>
                                                                                                {option.label} ({option.value}) <br/>
                                                                                                {option.airportName}
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul>
                                                                                )}


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
                                                                        <button type="button" className='swapbutton' onClick={swapOriginAndDestination}><img src='/img/swap.png' width={'16px'}/></button>
                                                                        <div className="srch-tab-right">
                                                                            <label>To</label>
                                                                            <div className="input-a">
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="Search..."
                                                                                    id="searchto" className="text_input" name="searchto"
                                                                                    value={inputDestination}
                                                                                    onChange={(e) => handleDestinationChange(e.target.value)}
                                                                                />

                                                                                {showDestinationDropdown && (
                                                                                    <ul style={{
                                                                                        position: 'absolute',
                                                                                        top: '100%',
                                                                                        marginLeft: '-8px',
                                                                                        borderRadius: '3px',
                                                                                        backgroundColor: '#fff',
                                                                                        paddingLeft: '6px',
                                                                                        width: '100%',
                                                                                        border: '1px solid #e3e3e3',
                                                                                        listStyle: 'none',
                                                                                        width: '100%',
                                                                                        zIndex: '9999',
                                                                                        maxHeight: '150px',
                                                                                        minHeight: 'auto',
                                                                                        overflow: 'auto'
                                                                                    }}>
                                                                                        {destination.map((option) => (
                                                                                            <li style={{
                                                                                                cursor: 'pointer',
                                                                                                fontFamily: 'Montserrat',
                                                                                                color: '#4c4c4c',
                                                                                                fontSize: '10px',
                                                                                                paddingTop: '5px',
                                                                                                paddingBottom: '5px',
                                                                                                paddingRight: '5px'
                                                                                            }} key={option.value} onClick={() => handleDestination(option.value,option.airportName)}>
                                                                                                {option.label} ({option.value}) <br/>
                                                                                                {option.airportName}
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul>
                                                                                )}

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
                                                                        <div className="clear"></div>
                                                                    </div>

                                                                </div>

                                                                <div className="search-large-i">

                                                                    <div className="srch-tab-line no-margin-bottom">
                                                                        <div className="srch-tab-left">
                                                                            <label>Departure</label>
                                                                            <div className="input-a" onClick={() => setdepIsOpen(true)}>
                                                                            <DatePicker
                                                                                name="searchdeparture"
                                                                                selected={formData.departureDate}
                                                                                onChange={handleDepartureDateChange}
                                                                                dateFormat="dd/MM/yyyy"
                                                                                minDate={new Date()}
                                                                                value={formData.departureDate}
                                                                                open={isdepOpen}
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
                                                                        
                                                                        <div className="srch-tab-right" id="departurereturn">
                                                                            <label>Return</label>
                                                                            <div className="input-a" onClick={formData.bookingType === "Return" ? () => setretIsOpen(true) : () => () => setretIsOpen(false)}>
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
                                                                        <div className="clear"></div>
                                                                    </div>
                                                                    
                                                                </div>

                                                                <div className="search-large-i">
                                                                    <div className="srch-tab-line no-margin-bottom">
                                                                        <label>Passengers & Cabinclass</label>
                                                                        <div className="input-a">
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
                                                                    <div className="clear"></div>
                                                                </div>

                                                                <div className="clear"></div>
                                                            
                                                                <div className="search-asvanced" style={{ display: isOpen ? 'block' : 'none' }}>
                                                                    {/* // */}
                                                                    <div className="search-large-i">
                                                                        {/* // */}
                                                                        <div className="srch-tab-line no-margin-bottom">
                                                                            <div className="srch-tab-line no-margin-bottom">
                                                                                <label>Adults (12y + : on the day of travel)</label>
                                                                                <div className="select-wrapper1">
                                                                                    {/* Radio buttons for adults */}
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
                                                                            <div className="clear" />
                                                                        </div>
                                                                        {/* \\ */}
                                                                    </div>
                                                                    {/* \\ */}
                                                                    {/* // */}
                                                                    <div className="search-large-i">
                                                                        <div className="srch-tab-line no-margin-bottom">
                                                                            <label>Children (2y - 12y : on the day of travel)</label>
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
                                                                    </div>
                                                                    {/* \\ */}
                                                                    {/* // */}
                                                                    <div className="search-large-i">
                                                                        <div className="srch-tab-line no-margin-bottom">
                                                                            <label>Infants (below 2y : on the day of travel)</label>
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
                                                                    {/* \\ */}
                                                                    <div className="clear" />
                                                                </div>

                                                                <div className="search-asvanced" style={{ display: isOpen ? 'block' : 'none' }}>
                                                                    {/* // */}
                                                                    <div className="search-large-i1">
                                                                        {/* // */}
                                                                        <div className="srch-tab-line no-margin-bottom">
                                                                            <label>Choose Travel Class</label>
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
                                                                                        <label style={{lineHeight:'1.8'}} htmlFor={`classtype${value}`}>{value === "Economy/Premium Economy" ? value : `${value} class`}</label>
                                                                                    </React.Fragment>
                                                                                ))}
                                                                            </div>
                                                                            
                                                                            <div className="clear" />
                                                                        </div>
                                                                        {/* \\ */}
                                                                    </div>
                                                                    {/* \\ */}
                                                                    <div className="clear" />
                                                                </div>
                                                                
                                                            
                                                            </div>
                                                            <div id="error-message1" style={{ color: 'red', marginleft: '2%', fontfamily: 'Raleway', fontsize: '13px' }}></div>
                                                            <div id="error-message2" style={{ color: 'red', marginleft: '2%', fontfamily: 'Raleway', fontsize: '13px' }}></div>
                                                            <footer className="search-footer">
                                                                {/* <Link to="/FonewayFrm"> */}
                                                                <button type="submit" className="srch-btn" id="btnSearch">Search</button>
                                                                {/* </Link> */}
                                                                {/* <span className="srch-lbl">Advanced Search options</span> */}
                                                                <div className="clear"></div>
                                                            </footer>
                                                        </form>
                                                    </div>
                                                </div>
                                                {/* <div className="page-search-content" style={{ display: activeTab === 'cab' ? 'block' : 'none' }}>
                                                    <div className="search-tab-content">cabs</div>
                                                </div>
                                                <div className="page-search-content" style={{ display: activeTab === 'hotel' ? 'block' : 'none' }}>
                                                    <div className="search-tab-content">hotels </div>
                                                </div>
                                                <div className="page-search-content" style={{ display: activeTab === 'bus' ? 'block' : 'none' }}>
                                                    <div className="search-tab-content">buses </div>
                                                </div> */}
                                                
                                                
                                            
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
                                                        <img alt="" src="img/taxivaxi/home_page/services_offer/Cab%202.png" />
                                                        <span className="offer-slider-overlay">
                                                            <span className="offer-slider-btn">view details</span>
                                                        </span>
                                                    </a>
                                                    <div className="offer-slider-txt">
                                                        <div className="offer-slider-link"><a href="#">Cabs</a></div>
                                                        <div className="offer-slider-l">

                                                            <nav className="stars">
                                                                <ul>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" /></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" /></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" /></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" /></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-a.png" /></a></li>
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
                                                        <img alt="" src="img/taxivaxi/home_page/services_offer/Hotel%202.png" />
                                                        <span className="offer-slider-overlay">
                                                            <span className="offer-slider-btn">view details</span>
                                                        </span>
                                                    </a>
                                                    <div className="offer-slider-txt">
                                                        <div className="offer-slider-link"><a href="#">Hotel Bookings</a></div>
                                                        <div className="offer-slider-l">
                                                            <nav className="stars">
                                                                <ul>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" /></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" /></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" /></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" /></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-a.png" /></a></li>
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
                                                        <img alt="" src="img/taxivaxi/home_page/services_offer/Ticket%201.png" />
                                                        <span className="offer-slider-overlay">
                                                            <span className="offer-slider-btn">view details</span>
                                                        </span>
                                                    </a>
                                                    <div className="offer-slider-txt">
                                                        <div className="offer-slider-link"><a href="#">Ticketing</a></div>
                                                        <div className="offer-slider-l">
                                                            <nav className="stars">
                                                                <ul>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" /></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" /></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" /></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" /></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" /></a></li>
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
                                                        <img alt="" src="img/taxivaxi/home_page/services_offer/Logistics%201.png" />
                                                        <span className="offer-slider-overlay">
                                                            <span className="offer-slider-btn">view details</span>
                                                        </span>
                                                    </a>
                                                    <div className="offer-slider-txt">
                                                        <div className="offer-slider-link"><a href="#">Logistics</a></div>
                                                        <div className="offer-slider-l">
                                                            <nav className="stars">
                                                                <ul>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" /></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" /></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" /></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" /></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-a.png" /></a></li>
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
                                                        <img alt="" src="img/taxivaxi/home_page/services_offer/FRRO%20VISA%201.png" />
                                                        <span className="offer-slider-overlay">
                                                            <span className="offer-slider-btn">view details</span>
                                                        </span>
                                                    </a>
                                                    <div className="offer-slider-txt">
                                                        <div className="offer-slider-link"><a href="#">FRRO/Visa Consultancy</a></div>
                                                        <div className="offer-slider-l">
                                                            <nav className="stars">
                                                                <ul>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" /></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" /></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" /></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-b.png" /></a></li>
                                                                    <li><a href="#"><img alt="" src="img/star-a.png" /></a></li>
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
                                        <div className="theme-teaser-r"><img alt="" src="img/taxivaxi/home_page/simplifying/Artboard%201-8.png" /></div>
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
                                            <div className="advantages-a"><img alt="" src="img/taxivaxi/home_page/why_choose_taxivaxi/Experience.svg" /></div>
                                            <div className="advantages-b">Experience</div>
                                            <div className="advantages-c">With 10 years of &nbsp;team &nbsp;experience, we &nbsp;have &nbsp;built &nbsp;and &nbsp;upgraded &nbsp;a &nbsp;reliable technology.</div>
                                        </div>
                                        <div className="advantages-i">
                                            <div className="advantages-a"><img alt="" src="img/taxivaxi/home_page/why_choose_taxivaxi/Solution_provider.svg" /></div>
                                            <div className="advantages-b">Solution Provider</div>
                                            <div className="advantages-c">With our problem-solving approach, we provide support to you at every step.</div>
                                        </div>
                                        <div className="advantages-i">
                                            <div className="advantages-a"><img alt="" src="img/taxivaxi/home_page/why_choose_taxivaxi/Pan_india-tie_ups.svg" /></div>
                                            <div className="advantages-b">PAN India tie-ups</div>
                                            <div className="advantages-c">Providing services to corporates all over India, with partnerships, and tie-ups with many stakeholders.</div>
                                        </div>

                                    </div>
                                    <div className="fly-in advantages-row">
                                        <div className="advantages-i">
                                            <div className="advantages-a"><img alt="" src="img/taxivaxi/home_page/why_choose_taxivaxi/Extra_mile.svg" /></div>
                                            <div className="advantages-b">Extra Mile</div>
                                            <div className="advantages-c">To fulfil our promise of providing good quality, we will never hesitate to take extra effort when it really matters.</div>
                                        </div>
                                        <div className="advantages-i">
                                            <div className="advantages-a"><img alt="" src="img/taxivaxi/home_page/why_choose_taxivaxi/Right_people_right_place.svg" /></div>
                                            <div className="advantages-b">Right People Right Place</div>
                                            <div className="advantages-c">From FRRO consultancy to Relationship Management. We have a knowledgeable and qualified team with varied skills to help you.</div>
                                        </div>
                                        <div className="advantages-i">
                                            <div className="advantages-a"><img alt="" src="img/taxivaxi/home_page/why_choose_taxivaxi/Team_work.svg" /></div>
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