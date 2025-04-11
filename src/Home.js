import React, {
    useEffect,
    useState,
    useRef,
    Children,
    useLayoutEffect,
  } from "react";
  import axios from "axios";
  import { parseString } from "xml2js";
  import XMLParser from "react-xml-parser";
  import { Link, useNavigate, useLocation } from "react-router-dom";
  import DatePicker from "react-datepicker";
  import "react-datepicker/dist/react-datepicker.css";
  import { format, parseISO, parse, isValid } from "date-fns";
  import SearchFlight from "./SearchFlight";
  import Swal from "sweetalert2";
  import Cookies from "js-cookie";
  import IconLoader from "./IconLoader";
  import CONFIG from "./config";
 

const NewHome = () => {

   const [loading, setLoading] = useState(true);
   const searchRef = useRef(null);
   const [airlineData, setAirlineResponse] = useState(null);
   // console.log('airlinedata', airlineData);
   const [airportData, setAirportResponse] = useState(null);
 
   const [inputOrigin, setInputOrigin] = useState(() => {
     return localStorage.getItem("lastorigin") || "";
   });
   const [showOriginDropdown, setShowOriginDropdown] = useState(false);
   const [origin, setOrigin] = useState([]);
   const [allAirportsOrigin, setAllAirportsOrigin] = useState([]);
   const [airportOriginCodes, setAirportOriginCodes] = useState(null);
 
   // const [inputDestination, setInputDestination] = useState('Delhi (DEL) Indira Gandhi International Airport');
   const [inputDestination, setInputDestination] = useState(() => {
     return localStorage.getItem("lastDestination") || "";
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
   const [cabinClass, setCabinClass] = useState("Economy");
   const [lastActionWasSwap, setLastActionWasSwap] = useState(false);
   const [apiResponse, setApiResponse] = useState(null);
   const [apiairports, setAirports] = useState([]);
   const navigate = useNavigate();
   const location = useLocation();
   const [isseaarchresponse, setSearchresponse] = useState(false);
   const [companies, setCompanies] = useState([]);
   // console.log("companies", companies);
   const [inputCompany, setInputCompany] = useState(""); // Display selected company name
   const [adminid, setAdminid] = useState("");
   const [showDropdown, setShowDropdown] = useState(false);
   const [ClientMarkupDetails, setClientMarkupDetails] = useState("");
   // console.log('ClientMarkupDetails', ClientMarkupDetails);f
 
   const Targetbranch = "P7206253";
   // console.log(Targetbranch);
   // test TargetBranch: P7206253
   // live TargetBranch: P4451438
 
   useEffect(() => {
     const fetchData = async () => {
       try {
         const response = await axios.get(
           "https://selfbooking.taxivaxi.com/api/airports"
         );
 
         setAirports(response.data);
       } catch (error) {
         console.error("Error fetching data:", error);
       }
     };
     fetchData();
   }, []);
 
   useEffect(() => {
     const cookieData = Cookies.get("cookiesData");
     // console.log(cookieData);
     if (cookieData) {
       const parsedCookieData = JSON.parse(cookieData);
       setInputOrigin(parsedCookieData.flightOrigin);
       setInputDestination(parsedCookieData.flightDestination);
       setAdultCount(parsedCookieData.adult);
       setChildCount(parsedCookieData.child);
       setInfantCount(parsedCookieData.infant);
       if (parsedCookieData.classType === "Economy") {
         setCabinClass("Economy/Premium Economy");
       } else {
         setCabinClass(parsedCookieData.classType);
       }
       if (parsedCookieData.returnDate === null) {
         setFormData({
           ...formData,
           departureDate: new Date(parsedCookieData.departureDate),
           bookingType: parsedCookieData.bookingType,
           returnDate: null,
         });
       } else {
         setFormData({
           ...formData,
           departureDate: new Date(parsedCookieData.departureDate),
           bookingType: parsedCookieData.bookingType,
           returnDate: new Date(parsedCookieData.returnDate),
         });
       }
     }
   }, []);
 
   useEffect(() => {
     const makeAirlineRequest = async () => {
       if (airlineData) return; // Prevent API call if data exists
 
       try {
         const airlineRequest = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:util="http://www.travelport.com/schema/util_v50_0" xmlns:com="http://www.travelport.com/schema/common_v50_0">
                 <soapenv:Header/>
                 <soapenv:Body>
                     <util:ReferenceDataRetrieveReq AuthorizedBy="TAXIVAXI" TargetBranch="${Targetbranch}" TraceId="AR45JHJ" TypeCode="AirAndRailSupplierType">
                         <com:BillingPointOfSaleInfo OriginApplication="UAPI"/>
                         <util:ReferenceDataSearchModifiers MaxResults="99999" StartFromResult="0"/>
                     </util:ReferenceDataRetrieveReq>
                 </soapenv:Body>
                 </soapenv:Envelope>`;
 
         const response = await axios.post(
           `${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightRequest`,
           airlineRequest,
           { headers: { "Content-Type": "text/xml" } }
         );
         setAirlineResponse(response);
       } catch (error) {
         console.error(error);
       }
     };
 
     const makeAirportRequest = async () => {
       if (airportData) return; // Prevent API call if data exists
 
       try {
         const airportRequest = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:util="http://www.travelport.com/schema/util_v50_0" xmlns:com="http://www.travelport.com/schema/common_v50_0">
                 <soapenv:Header/>
                 <soapenv:Body>
                     <util:ReferenceDataRetrieveReq AuthorizedBy="TAXIVAXI" TargetBranch="${Targetbranch}" TraceId="AV145ER" TypeCode="CityAirport">
                         <com:BillingPointOfSaleInfo OriginApplication="UAPI"/>
                         <util:ReferenceDataSearchModifiers MaxResults="99999" StartFromResult="0"/>
                     </util:ReferenceDataRetrieveReq>
                 </soapenv:Body>
                 </soapenv:Envelope>`;
 
         const response = await axios.post(
           `${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightRequest`,
           airportRequest,
           { headers: { "Content-Type": "text/xml" } }
         );
 
         setAirportResponse(response);
 
         // XML Parsing Logic
         parseString(response.data, { explicitArray: false }, (errs, result) => {
           if (errs) {
             console.error("Error parsing XML:", errs);
             return;
           }
           const airportList =
             result["SOAP:Envelope"]["SOAP:Body"][
             "util:ReferenceDataRetrieveRsp"
             ]["util:ReferenceDataItem"];
           setAirportOptions(airportList);
 
           const tempAirportCodes = {};
           airportList.forEach((airport) => {
             tempAirportCodes[airport.$.Code] = airport.$.Name;
           });
 
           setAirportOriginCodes(tempAirportCodes);
           setAllAirportsOrigin(airportList);
 
           setAirportDestinationCodes(tempAirportCodes);
           setAllAirportsDestination(airportList);
         });
       } catch (error) {
         console.error(error);
       }
     };
 
     if (!airlineData || !airportData) {
       (async () => {
         await Promise.all([makeAirlineRequest(), makeAirportRequest()]); // Run both requests in parallel
         setLoading(false); // Set loading to false only after both API calls finish
       })();
     }
   }, [airlineData, airportData]);
 
   useEffect(() => {
     Cookies.set("cookiesData", JSON.stringify(formData), { expires: 7 });
   }, []);
   const [isReturnEnabled, setReturnEnabled] = useState(false);
 
   useEffect(() => {
     let timeoutId;
     const timeoutDuration = 5 * 60 * 1000;
     const handleInactive = () => {
       navigate("/");
     };
     const resetTimer = () => {
       clearTimeout(timeoutId);
       timeoutId = setTimeout(handleInactive, timeoutDuration);
     };
     const resetOnActivity = () => {
       resetTimer();
       window.addEventListener("mousemove", resetTimer);
       window.addEventListener("keydown", resetTimer);
     };
     resetOnActivity();
     return () => {
       clearTimeout(timeoutId);
       window.removeEventListener("mousemove", resetTimer);
       window.removeEventListener("keydown", resetTimer);
     };
   }, [navigate]);
 
   useEffect(() => {
     document.addEventListener("mousedown", handleClickOutside);
 
     return () => {
       document.removeEventListener("mousedown", handleClickOutside);
     };
   }, []);
   useEffect(() => {
     if (companies.length === 0) {
       // Only fetch if companies array is empty
       axios
         .get("https://corporate.taxivaxi.com/api/getIDNameAllCompanies")
         .then((response) => {
           if (response.data.success === "1") {
             setCompanies(response.data.response.Companies); // Store company data
           } else {
             console.error("Failed to fetch company data");
           }
         })
         .catch((error) => {
           console.error("Error fetching companies:", error);
         });
     }
   }, [companies]);
 
   const handleCompanySelect = (company) => {
     setInputCompany(company.corporate_name); // Show selected name
 
     setShowDropdown(false); // Hide dropdown after selection
     const adminid = company.id;
     setAdminid(adminid);
     // console.log('adminid', adminid)
     const payload = {
       admin_id: adminid,
       flight_type: "Domestic",
     };
     // console.log('payload', payload);
 
     axios
       .post(
         "https://corporate.taxivaxi.com/api/flights/getClientMarkupDetails",
         payload,
         {
           headers: {
             "Content-Type": "application/x-www-form-urlencoded", // Correct content type
           },
         }
       )
 
       .then((response) => {
         console.log("Client Markup Details:", response.data.data);
         setClientMarkupDetails(response.data.data);
         // Handle response if needed (e.g., store in state)
       })
       .catch((error) => {
         console.error("Error fetching client markup details:", error);
       });
   };
 
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
     setIsOpen((prevIsOpen) => !prevIsOpen);
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
           div: airport.$.Name,
           airportName: matchedAirport ? matchedAirport.airport_name : "", // Add airport name from apiairports
         };
       })
       .sort((a, b) => a.div.localeCompare(b.div));
     setOrigin(filteredOptions);
     setShowOriginDropdown(true);
   };
 
   const handleOrigin = (value, airportName) => {
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
           div: airport.$.Name,
           airportName: matchedAirport ? matchedAirport.airport_name : "",
         };
       })
       .sort((a, b) => a.div.localeCompare(b.div));
     setDestination(filteredOptions);
     setShowDestinationDropdown(true);
   };
   const handleDestination = (value, airportName) => {
     setInputDestination(
       `${airportDestinationCodes[value]} (${value}) ${airportName}`
     );
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
     const infanterror = document.querySelector(".infantmore");
     if (value > adultCount) {
       infanterror.style.display = "block";
     } else {
       infanterror.style.display = "none";
     }
   };
   const [formData, setFormData] = useState({
     departureDate: new Date(),
     returnDate: null,
     flightOrigin: localStorage.getItem("lastorigin") || "",
     flightDestination: localStorage.getItem("lastDestination") || "",
     bookingType: "oneway",
     adult: "1",
     child: "0",
     infant: "0",
     classType: "Economy/Premium Economy",
   });
 
   const handleReturnDateInitialization = (bookingType) => {
     if (bookingType === "oneway") {
       setReturnEnabled(false);
       setFormData({ ...formData, bookingType, returnDate: null });
     } else {
       setReturnEnabled(true);
       const nextDay = new Date();
       if (formData.departureDate) {
         setFormData({
           ...formData,
           bookingType,
           returnDate: formData.departureDate,
         });
       } else {
         nextDay.setDate(nextDay.getDate() + 1);
         setFormData({ ...formData, bookingType, returnDate: nextDay });
       }
     }
   };
 
   const getLabelStyle = (labelValue) => {
     if (labelValue === formData.bookingType) {
       return { color: "#fff", backgroundColor: "#785eff" };
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
       bookingType: "Return",
     });
   };
 
   const fetchToken = async () => {
     const storedToken = localStorage.getItem("authToken");
     const tokenTimestamp = localStorage.getItem("authTokenTimestamp");
     const currentDate = new Date();
 
     // // // conaole.log("storedToken:", storedToken);
     // // // conaole.log("tokenTimestamp:", tokenTimestamp);
 
     // Check if both storedToken and tokenTimestamp are available and valid
     if (storedToken && storedToken !== "null") {
       // // // conaole.log("Token exists.");
 
       if (tokenTimestamp) {
         // // // conaole.log("Timestamp exists.");
 
         // Check if the stored token's timestamp matches today's date
         if (
           new Date(tokenTimestamp).toDateString() === currentDate.toDateString()
         ) {
           // conaole.log("Token is valid and current.");
           return storedToken; // Return the stored token if valid
         } else {
           // conaole.log("Token is expired (date mismatch).");
         }
       } else {
         // conaole.log("Timestamp is missing, fetching new token...");
       }
     } else {
       // conaole.log("Token is missing, fetching new token...");
     }
 
     const authPayload = {
       ClientId: "ApiIntegrationNew",
       UserName: "BAI",
       Password: "Bai@12345",
       EndUserIp: "192.168.11.120",
     };
 
     try {
       const authResponse = await axios.post(
         "https://cors-anywhere.herokuapp.com/http://api.tektravels.com/SharedServices/SharedData.svc/rest/Authenticate",
         JSON.stringify(authPayload),
         {
           headers: {
             "Content-Type": "application/json",
             "X-Forwarded-For": "192.168.11.120",
           },
         }
       );
       // // conaole.log("authResponse", authResponse.data);
 
       const newToken = authResponse.data.TokenId;
       localStorage.setItem("authToken", newToken);
       localStorage.setItem("authTokenTimestamp", currentDate.toISOString());
 
       // // conaole.log("New token saved:", newToken);
       return newToken;
     } catch (error) {
       console.error("Error fetching token:", error);
       throw new Error("Authentication failed");
     }
   };
 
   async function getAccessToken() {
     const tokenKey = "ndc_access_token";
     const expirationKey = "ndc_token_expiration";
     const now = Date.now();
 
     const storedToken = localStorage.getItem(tokenKey);
     const storedExpiration = localStorage.getItem(expirationKey);
 
     // Use cached token if it's valid
     if (storedToken && storedExpiration && now < Number(storedExpiration)) {
       //   console.log('Using cached token');
       return storedToken;
     }
 
     const url =
       "https://devapi.taxivaxi.com/reactSelfBookingApi/v1/makeNDCAuthenticationApiRequest";
 
     try {
       const response = await fetch(url, {
         method: "POST",
         headers: {
           "Content-Type": "application/x-www-form-urlencoded",
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
       console.error("Failed to fetch access token:", error.message);
       throw error;
     }
   }
 
   //   getAccessToken();
   const queryParams = new URLSearchParams(window.location.search);
   const agentId = queryParams.get("agent_id");
 
   // console.log(agentId);
 
   const handleSubmit = async (event) => {
     setSearchresponse(true);
     event.preventDefault();
     console.time("make api request");
     let searchfrom = event.target.searchfrom.value.trim();
 
     // let searchfrom = formActual;
     let searchto = event.target.searchto.value.trim();
     let searchdeparture = event.target.searchdeparture.value.trim();
     let searchreturnDate = event.target.searchreturnDate.value.trim();
     const originerror = document.querySelector(".redorigin");
     const originerror1 = document.querySelector(".redorigin1");
     const destinationerror = document.querySelector(".redestination");
     const destinationerror1 = document.querySelector(".redestination1");
     const searchdepartureerror = document.querySelector(".redsearchdeparture");
     const searchreturnerror = document.querySelector(".redsearchreturn");
     const searchdepartureerror1 = document.querySelector(
       ".redsearchdeparture1"
     );
     const searchreturnerror1 = document.querySelector(".redsearchreturn1");
     const passengererror = document.querySelector(".redpassenger");
     const infanterror = document.querySelector(".infantmore");
 
     let totalpassenger =
       parseInt(adultCount) + parseInt(childCount) + parseInt(infantCount);
     let isValidPassenger = true;
     localStorage.setItem("lastorigin", searchfrom);
     localStorage.setItem("lastDestination", searchto);
 
     if (infantCount > adultCount) {
       isValidPassenger = false;
       infanterror.style.display = "block";
     } else {
       infanterror.style.display = "none";
     }
     const formatPattern = /\((.*?)\)/;
     const dateFormatPattern = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
     if (!searchfrom) {
       isValidPassenger = false;
       originerror.style.display = "block";
     } else if (!formatPattern.test(searchfrom)) {
       isValidPassenger = false;
       originerror1.style.display = "block";
     } else {
       originerror1.style.display = "none";
       originerror.style.display = "none";
     }
     if (!searchto) {
       isValidPassenger = false;
       destinationerror.style.display = "block";
     } else if (!formatPattern.test(searchto)) {
       isValidPassenger = false;
       destinationerror1.style.display = "block";
     } else {
       destinationerror.style.display = "none";
       destinationerror1.style.display = "none";
     }
     if (!searchdeparture) {
       isValidPassenger = false;
       searchdepartureerror.style.display = "block";
     } else if (!dateFormatPattern.test(searchdeparture)) {
       isValidPassenger = false;
       searchdepartureerror1.style.display = "block";
     } else {
       searchdepartureerror.style.display = "none";
       searchdepartureerror1.style.display = "none";
     }
     if (formData.bookingType === "Return") {
       if (!searchreturnDate) {
         isValidPassenger = false;
         searchreturnerror.style.display = "block";
       } else {
         searchreturnerror.style.display = "none";
       }
     } else {
       searchreturnerror.style.display = "none";
     }
 
     if (searchreturnDate && !dateFormatPattern.test(searchreturnDate)) {
       isValidPassenger = false;
       searchreturnerror1.style.display = "block";
     } else {
       searchreturnerror1.style.display = "none";
     }
     if (totalpassenger > 9) {
       isValidPassenger = false;
       passengererror.style.display = "block";
     } else {
       passengererror.style.display = "none";
     }
     if (isValidPassenger) {
       setLoading(true);
       // const token = await ndcToken();
 
       const formatDate = (inputDate) => {
         const parsedDate = parse(inputDate, "dd/MM/yyyy", new Date());
         if (!isValid(parsedDate)) {
           return null;
         } else {
           const formattedDate = format(parsedDate, "yyyy-MM-dd");
           return formattedDate;
         }
       };
 
       const searchfrom = event.target.searchfrom.value;
       const searchfromMatch = searchfrom.match(/\((\w+)\)/);
       const searchfromCode = searchfromMatch[1];
       const searchto = event.target.searchto.value;
       const searchtoMatch = searchto.match(/\((\w+)\)/);
       const searchtoCode = searchtoMatch[1];
       const searchdeparture = event.target.searchdeparture.value;
       const searchreturnDate = event.target.searchreturnDate.value;
       const formattedsearchdeparture = formatDate(searchdeparture);
       const formattedsearchreturnDate = formatDate(searchreturnDate);
 
       const adult = event.target.adult.value;
       const child = event.target.child.value;
       const infant = event.target.infant.value;
       const classtype = event.target.classtype.value;
       let cabinclass = classtype;
       let bookingtype = "";
       if (searchreturnDate) {
         bookingtype = "Return";
       } else {
         bookingtype = "oneway";
       }
       if (classtype === "Economy/Premium Economy") {
         cabinclass = "Economy";
       } else {
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
           const generatePassengerElements = (age, count, type) => {
             return Array.from(
               { length: count },
               (_, index) =>
                 `<com:SearchPassenger Code="${type}"${age ? ` Age="${age}"` : ""
                 }/>`
             ).join("");
           };
           const searchPassengerADT = generatePassengerElements(
             "",
             passengerCodeADT,
             "ADT"
           );
           const searchPassengerCNN = generatePassengerElements(
             "10",
             passengerCodeCNN,
             "CNN"
           );
           const searchPassengerINF = generatePassengerElements(
             "01",
             passengerCodeINF,
             "INF"
           );
 
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
             : "";
 
           return `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                     <soap:Body>
                     <air:LowFareSearchReq TargetBranch="${Targetbranch}" TraceId="TVSBP001" SolutionResult="false" DistanceUnits="Km" AuthorizedBy="TAXIVAXI" xmlns:air="http://www.travelport.com/schema/air_v52_0" xmlns:com="http://www.travelport.com/schema/common_v52_0">
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
                                 <com:Provider Code="ACH"/>
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
           PassengerCodeINF
         );
         // console.timeEnd("make api request");
 
         sessionStorage.setItem("searchdata", soapEnvelope);
         console.log("search data", soapEnvelope);
         // console.time("API Call");
         const response = await axios.post(
           `${CONFIG.DEV_API}/reactSelfBookingApi/v1/makeFlightAirServiceRequest`,
           soapEnvelope,
           { headers: { "Content-Type": "text/xml" } }
         );
         console.log("searchresponse", response);
         console.timeEnd("API Call");
 
         const requestBody = {
           CatalogProductOfferingsQueryRequest: {
             CatalogProductOfferingsRequest: {
               "@type": "CatalogProductOfferingsRequestAir",
               maxNumberOfUpsellsToReturn: 4,
               offersPerPage: 10,
               contentSourceList: ["NDC"],
               PassengerCriteria: [
                 { number: 1, passengerTypeCode: "ADT" },
                 { number: 1, passengerTypeCode: "CHD" },
                 { number: 1, passengerTypeCode: "INF" },
               ],
               SearchCriteriaFlight: [
                 {
                   departureDate: dynamicDepTime,
                   From: { value: dynamicCityCode },
                   To: { value: dynamicDestinationCode },
                 },
               ],
               SearchModifiersAir: {
                 "@type": "SearchModifiersAir",
                 CarrierPreference: [
                   {
                     preferenceType: "Preferred",
                     carriers: ["AI"],
                   },
                 ],
               },
             },
           },
         };
         //   console.log('requestbody', requestBody);
         // const endpoint = `${baseURL}/${version}/air/catalog/search/catalogproductofferings`;
 
         //     const requestBdy = {
         //     request: requestBody,
         //     endpoint: endpoint
         //   };
 
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
           token: token,
         };
 
         // Send the POST request
         // const ndcresponse = await axios.post(
         //     "https://devapi.taxivaxi.com/reactSelfBookingApi/v1/makeNDCApiRequest",
         //     formBody
         // );
         // console.log('ndcresponse', ndcresponse);
         console.time("redirect");
         const responseData = {
           responsedata: response.data,
           // ndcresponse :ndcresponse.data,
           clientname: inputCompany,
           markupdata: ClientMarkupDetails,
           searchfromcity: searchfrom,
           searchtocity: searchto,
           searchdeparture: searchdeparture,
           searchreturnDate: searchreturnDate,
           airlinedata: airlineData.data,
           airportData: airportData.data,
           selectadult: adult,
           selectchild: child,
           selectinfant: infant,
           selectclass: cabinclass,
           bookingtype: bookingtype,
           apiairportsdata: apiairports,
           requesttype: "book",
           fromcotrav: "1",
           agent_id: agentId,
           admin_id: adminid,
           global: agentId ? 1 : 0,
         };
         console.timeEnd("redirect");
         console.log("searchresponse", responseData);
         navigate("/SearchFlight", { state: { responseData } });
       } catch (error) {
         // ErrorLogger.logError('search_api',soapEnvelope,error);
         navigate("/tryagainlater");
       } finally {
         // setLoading(false);
       }
     }
   };
 
   const handleClickOutside = (event) => {
     // Check if the click is outside the div
     if (searchRef.current && !searchRef.current.contains(event.target)) {
       setIsOpen(false); // Close the div
     }
   };
   // ********************************************************************* Hotel Section ************************************************************************************
 
   // const [formActual, setformActual] = useState(null);
   // console.log('form', formActual);
   const [loader, setLoader] = useState(false);
   // const [formActual, setformActual] = useState(null);
   // // conaole.log('form', formActual);
   const [activeForm, setActiveForm] = useState("flight"); // Default form is shown initially
   const [activeTab, setActiveTab] = useState("flight");
   const handleIconClick = (type) => {
     setActiveTab(type); // Ensure the correct tab is active
     setActiveForm(type); // Ensure the correct form is displayed
   };
 
   const [cityList, setCityList] = useState([]); // List of cities
   const [filteredCities, setFilteredCities] = useState([]); // Filtered cities for search
   const [showDropdown1, setShowDropdown1] = useState(false); // Controls dropdown visibility
   const [selectedCity, setSelectedCity] = useState(""); // Selected city
   const [hotelcityList, setHotelCityList] = useState([]);
   const [hotelCodes, setHotelCodes] = useState([]);
 
   useLayoutEffect(() => {
     const fetchCities = async () => {
       try {
         const response = await fetch(
           "https://demo.taxivaxi.com/api/hotels/sbtCityList",
           {
             method: "POST",
             headers: {
               // "Content-Type": "application/json",
               Origin: "http://localhost:3000", // Change to your React app's origin
               "Access-Control-Request-Method": "POST", // The method you're going to use
             },
             body: JSON.stringify({ CountryCode: "IN" }),
           }
         );
 
         if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
         }
 
         const data = await response.json();
         // conaole.log("API Response:", data);
 
         if (data.Status.Code === 200) {
           const cityList = data.CityList || [];
           setCityList(cityList);
           setFilteredCities(cityList);
           sessionStorage.setItem("cityList", JSON.stringify(cityList));
         } else {
           console.error("Error fetching cities:", data.Status.Description);
         }
       } catch (error) {
         console.error("Error fetching cities:", error);
       }
     };
 
     const storedCities = sessionStorage.getItem("cityList");
     if (storedCities) {
       const parsedCities = JSON.parse(storedCities);
       setCityList(parsedCities);
       setFilteredCities(parsedCities);
     } else {
       fetchCities();
     }
   }, []);
 
   // Handle city search and filter
   const handleInputChange = (e) => {
     const value = e.target.value;
     setSelectedCity(value);
     setErrors((prev) => {
       const newErrors = { ...prev };
       if (value) delete newErrors.selectedCity;
       return newErrors;
     });
     clearFieldError("selectedCity");
     const searchValue = e.target.value.toLowerCase();
     setSelectedCity(searchValue);
 
     if (searchValue.length === 0) {
       setFilteredCities(cityList);
       setShowDropdown1(false);
       return;
     }
 
     const filtered = cityList.filter((city) =>
       city.Name.toLowerCase().includes(searchValue)
     );
     setFilteredCities(filtered);
     setShowDropdown1(filtered.length > 0);
   };
   // Handle city selection
   const handleCitySelect = (cityName) => {
     setSelectedCity(cityName);
     setShowDropdown1(false);
     setErrors((prevErrors) => {
       const updatedErrors = { ...prevErrors };
       delete updatedErrors.selectedCity;
       return updatedErrors;
     });
   };
 
   const [companyList, setCompanyList] = useState([]); // List of companies
   const [filteredCompany, setFilteredCompany] = useState([]); // Filtered companies for search
   const [showDropdown2, setShowDropdown2] = useState(false); // Controls dropdown visibility
   const [selectedCompany, setSelectedCompany] = useState(""); // Selected company
 
   useEffect(() => {
     const fetchCompanies = async () => {
       try {
         const response = await fetch(
           "https://demo.taxivaxi.com/api/getAllSBTCompanies",
           {
             method: "GET",
             headers: {
               // "Content-Type": "application/json",
               Origin: "*", // Change to your React app's origin
               "Access-Control-Request-Method": "POST", // The method you're going to use
             },
           }
         );
 
         // console.log("Response Status:", response.status);
 
         if (!response.ok) {
           throw new Error(`HTTP error! Status: ${response.status}`);
         }
 
         const data = await response.json();
         // console.log("API Response:", data);
 
         if (data.success === "1" && Array.isArray(data.response.Companies)) {
           setCompanyList(data.response.Companies);
           setFilteredCompany(data.response.Companies);
           sessionStorage.setItem(
             "companyList",
             JSON.stringify(data.response.Companies)
           );
         } else {
           console.error(
             "API Error: No companies found or invalid response format"
           );
         }
       } catch (error) {
         console.error("Fetch Error:", error);
       }
     };
 
     // Check session storage before fetching
     // const storedCompanies = sessionStorage.getItem("companyList");
     // if (storedCompanies) {
     //   setCompanyList(JSON.parse(storedCompanies));
     //   setFilteredCompany(JSON.parse(storedCompanies));
     // } else {
     //   fetchCompanies();
     // }
     fetchCompanies();
   }, []); // Runs only once when component mounts
 
   const handleSelectCompany = (company) => {
     setSelectedCompany(company); // Store entire company object
     sessionStorage.setItem("selectedCompany", JSON.stringify(company)); // Store in sessionStorage
     setShowDropdown2(false); 
     setErrors((prevErrors) => {
       const updatedErrors = { ...prevErrors };
       delete updatedErrors.selectedCompany;
       return updatedErrors;
     });
     
   };
 
   // const handleCompanySelect = (companyName) => {
   //   setSelectedCompany(companyName);
   //   setShowDropdown2(false);
   // };
 
   // console.log("Filtered Companies:", selectedCompany);
 
   useLayoutEffect(() => {
     const fetchCity = async () => {
       if (filteredCities.length === 0) return; // Ensure filteredCities has data
 
       const cityCode = filteredCities[0]?.Code; // Get the first city's code
 
       try {
         const response = await fetch(
           "https://demo.taxivaxi.com/api/hotels/sbtHotelCodesList",
           {
             method: "POST",
             headers: {
               Origin: "*", // Change to your React app's origin
               "Access-Control-Request-Method": "POST", // The method you're going to use
             },
             body: JSON.stringify({
               CityCode: cityCode,
               IsDetailedResponse: "true",
             }),
           }
         );
 
         if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
         }
 
         const data = await response.json();
         // // conaole.log("Hotel :", data);
 
         if (data.Status.Code === 200) {
           const hotels = data.Hotels || []; // Fix: Access Hotels from data.response
           setHotelCityList(hotels);
 
           if (hotels.length > 0) {
             const codes = hotels.map((hotel) => hotel.HotelCode);
             // // conaole.log(codes);
             setHotelCodes(codes);
           } else {
             console.warn("No hotels found in response.");
           }
         } else {
           console.error(
             "Error fetching hotels:",
             data.response.Status.Description
           );
         }
       } catch (error) {
         console.error("Error fetching hotels:", error);
       }
     };
 
     fetchCity();
   }, [filteredCities]); // Runs whenever `filteredCities` changes
 
   // // conaole.log(hotelCodes);
 
   const [isCheckInOpen, setCheckInIsOpen] = useState(false);
   const [isCheckOutOpen, setCheckOutIsOpen] = useState(false);
   const clearFieldError = (fieldName) => {
     setErrors((prev) => {
       const newErrors = { ...prev };
       delete newErrors[fieldName];
       return newErrors;
     });
   };
   // const handleCheckInDateChange = (date) => {
   //   setFormData((prevData) => ({
   //     ...prevData,
   //     checkInDate: date,
   //   }));
   // };
   const handleCheckInDateChange = (date) => {
     setFormData((prev) => ({ ...prev, checkInDate: date }));
     clearFieldError("checkInDate");
 
     // Validate check-out date if it exists
     if (formData.checkOutDate && date >= formData.checkOutDate) {
       setErrors((prev) => ({
         ...prev,
         checkOutDate: "Check-out must be after check-in",
       }));
     }
   };
   // const handleCheckOutDateChange = (date) => {
   //   setFormData((prevData) => ({
   //     ...prevData,
   //     checkOutDate: date,
   //   }));
   // };
   const handleCheckOutDateChange = (date) => {
     setFormData((prev) => ({ ...prev, checkOutDate: date }));
 
     // Only clear error if date is valid
     if (!formData.checkInDate || date > formData.checkInDate) {
       clearFieldError("checkOutDate");
     } else {
       setErrors((prev) => ({
         ...prev,
         checkOutDate: "Check-out must be after check-in",
       }));
     }
   };
   const formatDate1 = (date) => {
     const year = date.getFullYear();
     const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
     const day = String(date.getDate()).padStart(2, "0");
     return `${year}-${month}-${day}`;
   };
   const [hotelDetails, setHotelDetails] = useState();
   const [errorMessage, setErrorMessage] = useState("");
 
   const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Control dropdown visibility
   const [roomCount, setRoomCount] = useState("");
   const [roomadultCount, setRoomAdultCount] = useState("");
   const [roomchildCount, setRoomChildCount] = useState(0);
   const [childrenAges, setChildrenAges] = useState([""]);
 
   const handleToggleHotel = () => {
     setIsDropdownOpen((prev) => !prev);
   };
   const calculateRequiredRooms = (adults, children) => {
     // Each room can have:
     // - Max 8 adults AND
     // - Max 4 children AND
     // - Max 12 total people
 
     const roomsBasedOnAdults = Math.ceil(adults / 2);
     const roomsBasedOnChildren = Math.ceil(children / 2);
     const roomsBasedOnTotal = Math.ceil((adults + children) / 4);
 
     return Math.max(
       roomsBasedOnAdults,
       roomsBasedOnChildren,
       roomsBasedOnTotal
     );
   };
 
   const handleApply = () => {
     const totalAdults = parseInt(roomadultCount) || 0;
     const totalChildren = parseInt(roomchildCount) || 0;
     const selectedRooms = parseInt(roomCount) || 0;
 
     const requiredRooms = calculateRequiredRooms(totalAdults, totalChildren);
 
     if (selectedRooms > requiredRooms) {
       setErrorMessage(
         `Minimum ${requiredRooms} rooms required based on your selection.`
       );
       return;
     }
 
     if (selectedRooms < requiredRooms) {
       setErrorMessage(
         `Minimum ${requiredRooms} rooms required based on your selection.`
       );
       return;
     }
 
     // Validate children ages
     if (totalChildren > 0 && childrenAges.some((age) => age === "")) {
       setErrorMessage("Please specify ages for all children");
       return;
     }
 
     setErrorMessage("");
     setIsDropdownOpen(false);
   };
   const [errors, setErrors] = useState({
     selectedCompany: "",
     selectedCity: "",
     checkInDate: "",
     checkOutDate: "",
     roomCount: "",
   });
 
   const validateForm = () => {
     let newErrors = {};
 
     if (!selectedCompany) {
       newErrors.selectedCompany = "Please select a company.";
     }
 
     if (!selectedCity) {
       newErrors.selectedCity = "Please enter a city.";
     }
 
     if (!formData.checkInDate) {
       newErrors.checkInDate = "Check-in date is required.";
     }
 
     if (!formData.checkOutDate) {
       newErrors.checkOutDate = "Check-out date is required.";
     } else if (
       formData.checkInDate &&
       formData.checkOutDate <= formData.checkInDate
     ) {
       newErrors.checkOutDate = "Check-out date must be after check-in.";
     }
 
     if (roomCount <= 0) {
       newErrors.roomCount = "Select the Room.";
     }
 
     setErrors(newErrors);
 
     return Object.keys(newErrors).length === 0;
   };
   const handleInputChange2 = (e) => {
     const { name, value } = e.target;
 
     clearFieldError("selectedCompany");
 
     // Update the corresponding state
     switch (name) {
       case "selectedCompany":
         setSelectedCompany(value);
         const searchValue = value.trim();
         if (!searchValue) {
           setFilteredCompany([]);
           setShowDropdown2(false);
         } else {
           const filtered = companyList.filter((company) =>
             company?.corporate_name
               ?.toLowerCase()
               .includes(searchValue.toLowerCase())
           );
           setFilteredCompany(filtered);
           setShowDropdown2(filtered.length > 0);
         }
         break;
 
       case "selectedCity":
         setSelectedCity(value);
         break;
 
       case "roomCount":
         setRoomCount(value);
         break;
 
       case "checkInDate":
       case "checkOutDate":
         setFormData((prev) => ({ ...prev, [name]: value }));
         break;
     }
   };
 
   // Debugging: Watch error updates
   useEffect(() => {
     console.log("Errors state updated:", errors);
   }, [errors]);
 
   const handleSelection = (type, value) => {
     let newRoomAdultCount = roomadultCount;
     let newRoomChildCount = roomchildCount;
     let newRoomCount = roomCount;
 
     if (type === "adults") {
       newRoomAdultCount = value;
       setRoomAdultCount(value);
     } else if (type === "children") {
       newRoomChildCount = value;
       setRoomChildCount(value);
 
       setChildrenAges((prevAges) => {
         if (value > prevAges.length) {
           return [...prevAges, ...new Array(value - prevAges.length).fill("")];
         } else {
           return prevAges.slice(0, value);
         }
       });
     } else if (type === "rooms") {
       newRoomCount = value;
       if (value > 0) clearFieldError("roomCount");
       setRoomCount(value);
     }
 
     // Convert to numbers for calculations
     const totalAdults = parseInt(newRoomAdultCount) || 0;
     const totalChildren = parseInt(newRoomChildCount) || 0;
     const selectedRooms = parseInt(newRoomCount) || 0;
 
     const requiredRooms = calculateRequiredRooms(totalAdults, totalChildren);
 
     if (selectedRooms < requiredRooms) {
       setErrorMessage(
         `Minimum ${requiredRooms} rooms required based on your selection.`
       );
     } else {
       setErrorMessage(""); // Clear error message when valid selection
     }
   };
 
   const handleChildAgeChange = (index, age) => {
     const updatedAges = [...childrenAges];
     updatedAges[index] = age;
     setChildrenAges(updatedAges);
   };
 
   const handleHotelSearch = async (e) => {
     e.preventDefault();
 
     // Prevent search if there is an error
     if (errorMessage) {
       return;
     }
     if (!validateForm()) {
       return;
     }
 
     setLoader(true);
 
     const checkIn = formData.checkInDate
       ? formatDate1(formData.checkInDate)
       : "";
     const checkOut = formData.checkOutDate
       ? formatDate1(formData.checkOutDate)
       : "";
     const CityCode = hotelCodes.toString();
 
     let remainingAdults = roomadultCount;
     let remainingChildren = roomchildCount;
     let remainingChildrenAges = [...childrenAges];
     let roomsArray = [];
 
     const maxAdultsPerRoom = 8;
     const maxChildrenPerRoom = 4;
 
     while (remainingAdults > 0 || remainingChildren > 0) {
       let allocatedAdults = Math.min(remainingAdults, maxAdultsPerRoom);
       let allocatedChildren = Math.min(remainingChildren, maxChildrenPerRoom);
 
       let allocatedChildrenAges = remainingChildrenAges.slice(
         0,
         allocatedChildren
       );
 
       roomsArray.push({
         Adults: allocatedAdults,
         Children: allocatedChildren,
         ChildrenAges:
           allocatedChildrenAges.length > 0 ? allocatedChildrenAges : null,
       });
 
       remainingAdults -= allocatedAdults;
       remainingChildren -= allocatedChildren;
       remainingChildrenAges = remainingChildrenAges.slice(allocatedChildren);
     }
 
     while (remainingAdults > 0) {
       let allocatedAdults = Math.min(remainingAdults, maxAdultsPerRoom);
 
       roomsArray.push({
         Adults: allocatedAdults,
         Children: 0,
         ChildrenAges: null,
       });
 
       remainingAdults -= allocatedAdults;
     }
 
     const requestBody = {
       CheckIn: checkIn,
       CheckOut: checkOut,
       HotelCodes: CityCode,
       GuestNationality: "IN",
       PaxRooms: roomsArray,
       ResponseTime: 23.0,
       IsDetailedResponse: true,
       Filters: {
         Refundable: false,
         NoOfRooms: roomsArray.length,
         MealType: 0,
         OrderBy: 0,
         StarRating: 0,
         HotelName: null,
       },
     };
 
     console.log("Request Body:", requestBody);
 
     try {
       const response = await fetch(
         "https://demo.taxivaxi.com/api/hotels/sbtHotelCodesSearch",
         {
           method: "POST",
           headers: {
             Origin: "http://localhost:3000",
             "Access-Control-Request-Method": "POST",
           },
           body: JSON.stringify(requestBody),
         }
       );
 
       if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
       }
 
       const data = await response.json();
 
       if (data.Status.Code === 200) {
         setHotelCityList(data.HotelResult || []);
         const payment = "1";
         const searchParams = {
           checkIn,
           checkOut,
           Rooms: roomsArray.length,
           Adults: roomadultCount,
           Children: roomchildCount,
           ChildAge: childrenAges,
           CityCode,
           corporate_name:
             JSON.parse(sessionStorage.getItem("selectedCompany")) || null,
           filteredCities,
           payment,
         };
         sessionStorage.setItem("agent_portal", 0);
         sessionStorage.setItem(
           "hotelData_header",
           JSON.stringify(searchParams)
         );
         sessionStorage.setItem(
           "hotelSearchData",
           JSON.stringify({ hotelcityList: data.HotelResult })
         );
         fetchCity(data.HotelResult || []);
       } else {
         Swal.fire({
           title: "Error",
           text: data.Status.Description || "Something went wrong!",
         });
         setLoader(false);
       }
     } catch (error) {
       console.error("Error fetching hotels:", error);
     }
   };
 
   // Function to fetch hotel details
   const fetchCity = async (hotelcityList) => {
     if (!Array.isArray(hotelcityList) || hotelcityList.length === 0) {
       return;
     }
 
     setLoader(true);
     const codes = hotelcityList.map((hotel) => hotel.HotelCode).join(",");
 
     try {
       const response = await fetch(
         "https://demo.taxivaxi.com/api/hotels/sbtHotelDetails",
         {
           method: "POST",
           headers: {
             Origin: "*",
             "Access-Control-Request-Method": "POST",
           },
           body: JSON.stringify({
             Hotelcodes: codes,
             Language: "EN",
           }),
         }
       );
 
       if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
       }
 
       const data = await response.json();
 
       if (data.Status && data.Status.Code === 200) {
         setHotelDetails(data.HotelDetails || []);
 
         sessionStorage.setItem(
           "hotelDetails",
           JSON.stringify(data.HotelDetails || [])
         );
 
         navigate("/SearchHotel", {
           state: { hotelcityList: data.HotelResult },
         });
       } else {
         console.error("Error fetching hotels:", data.Status?.Description);
       }
     } catch (error) {
       console.error("Error fetching hotels:", error);
     } finally {
       setLoader(false);
     }
   };
   // ************************************************************************** Cab Section **********************************************************************
   const [selectedCabType, setSelectedCabType] = useState("Local");
   const [selectedCabCity, setSelectedCabCity] = useState("");
   const [allCities, setAllCities] = useState([]);
   const [filteredCitiesCab, setFilteredCitiesCab] = useState([]);
   const [showDropdownCab, setShowDropdownCab] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState(null);
   const [selectedDate, setSelectedDate] = useState(null);
   const [showDropdown5, setShowDropdown5] = useState(false);
   const [selectedCabInput, setSelectedCabInput] = useState("");
 
   const [cityLimitError, setCityLimitError] = useState('');
   const [RoundTripcityLimitError, setRoundTripsetCityLimitError] = useState('');
 
   const [multiStopsVisible, setMultiStopsVisible] = useState(false);
   const [stopInputs, setStopInputs] = useState([]);
 
   const inputRefs = useRef([]);
 
   const handleAddStop = () => {
     if (stopInputs.length >= 5) {
       setCityLimitError("You can only select up to 5 cities.");
       return;
     }
     setStopInputs((prev) => [...prev, ""]);
     setMultiStopsVisible(true);
     setCityLimitError(""); // clear error if adding within limit
   };
 
 
   const handleInputChangeCIties = (index, value) => {
     const updated = [...stopInputs];
     updated[index] = value;
     setStopInputs(updated);
   };
 
   const handleRemoveStop = (index) => {
     const updated = [...stopInputs];
     updated.splice(index, 1);
     setStopInputs(updated);
     if (updated.length < 5) {
       setCityLimitError("");
     }
     if(updated.length === 0){
       setMultiStopsVisible(false);
     }
   };
 
 
   // Initialize Google Places Autocomplete for all input fields
   useEffect(() => {
     inputRefs.current.forEach((input, index) => {
       if (input && !input.autocomplete) {
         const autocomplete = new window.google.maps.places.Autocomplete(input, {
           types: ["(cities)"],
         });
 
         autocomplete.addListener("place_changed", () => {
           const place = autocomplete.getPlace();
 
           // Fallback to formatted address or place.name
           const city = place.formatted_address || place.name || "";
 
           handleInputChangeCIties(index, city);
         });
 
         input.autocomplete = autocomplete;
       }
     });
   }, [stopInputs]);
 
 
   const [roundTripStopsVisible, setRoundTripStopsVisible] = useState(false);
   const [roundTripStopInputs, setRoundTripStopInputs] = useState([]);
   const roundTripInputRefs = useRef([]);
   const [selectedRoundTripCity, setSelectedRoundTripCity] = useState('');
 
 
   const handleAddRoundTripStop = () => {
     if (roundTripStopInputs.length >= 1) {
       setRoundTripsetCityLimitError("You can select a maximum of 1 cities.");
       return;
     }
     setRoundTripStopInputs((prev) => [...prev, ""]);
     setRoundTripStopsVisible(true);
     setRoundTripsetCityLimitError(""); // clear error if adding within limit
   };
 
   const handleRoundTripInputChange = (index, value) => {
     const updated = [...roundTripStopInputs];
     updated[index] = value;
     setRoundTripStopInputs(updated);
   };
 
   const handleRemoveRoundTripStop = (index) => {
     const updated = [...roundTripStopInputs];
     updated.splice(index, 1);
     setRoundTripStopInputs(updated);
 
     if (updated.length < 1) {
       setRoundTripsetCityLimitError("");
     }
     if(updated.length === 0){
       setRoundTripStopsVisible(false);
     }
 
   };
 
   // Initialize Google Places Autocomplete for round trip inputs
   useEffect(() => {
     roundTripInputRefs.current.forEach((input, index) => {
       if (input && !input.autocomplete) {
         const autocomplete = new window.google.maps.places.Autocomplete(input, {
           types: ["(cities)"],
         });
 
         autocomplete.addListener("place_changed", () => {
           const place = autocomplete.getPlace();
           const city = place.formatted_address || place.name || "";
           handleRoundTripInputChange(index, city);
         });
 
         input.autocomplete = autocomplete;
       }
     });
   }, [roundTripStopInputs]);
 
 
 
   useEffect(() => {
     const fetchCities = async () => {
       setIsLoading(true);
       setError(null);
 
       try {
         const response = await axios.get(
           "https://demo.fleet247.in/api/corporate_apis/v1/getAllCities"
         );
 
         if (
           response.data?.success === "true" &&
           Array.isArray(response.data.response?.cities)
         ) {
           const citiesData = response.data.response.cities;
           setAllCities(citiesData);
           setFilteredCitiesCab(citiesData); // Initialize pickup city list
           setFilteredCitiesDrop(citiesData); // Initialize drop city list
         }
       } catch (err) {
         console.error("Error fetching cities:", err);
         setError("Failed to load cities. Please try again.");
       } finally {
         setIsLoading(false);
       }
     };
 
     fetchCities();
   }, []);
 
   const handleSelectCity = (city) => {
     setSelectedCabCity(city);
     setSelectedCabInput(`${city.city_name}, ${city.state_name}`);
     setShowDropdownCab(false);
     setErrors(prev => ({
       ...prev,
       pickupCity: '' // Clear pickup city error
     }))
   };
 
   const handleInputChangeCab = (e) => {
     const inputValue = e.target.value;
     setErrors(prev => ({ ...prev, pickupCity: '' }));
     setSelectedCabInput(inputValue); // update input string
 
     if (
       !selectedCabCity ||
       (selectedCabCity &&
         inputValue !==
         `${selectedCabCity.city_name || ""}, ${selectedCabCity.state_name || ""
         }`)
     ) {
       setSelectedCabCity(null);
 
       if (inputValue.length > 0) {
         const filtered = allCities.filter((city) => {
           const searchTerm = inputValue.toLowerCase();
 
           const cityName = city.city_name?.toLowerCase() ?? "";
           const googleName = city.google_city_name?.toLowerCase() ?? "";
           const stateName = city.state_name?.toLowerCase() ?? "";
           const keywords = city.keywords?.toLowerCase() ?? "";
 
           return (
             cityName.includes(searchTerm) ||
             googleName.includes(searchTerm) ||
             stateName.includes(searchTerm) ||
             keywords.includes(searchTerm)
           );
         });
 
         setFilteredCitiesCab(filtered);
       } else {
         setFilteredCitiesCab(allCities);
       }
     }
   
   };
 
   const [selectedDropCity, setSelectedDropCity] = useState("");
   const [filteredCitiesDrop, setFilteredCitiesDrop] = useState([]);
   const [showDropdownDrop, setShowDropdownDrop] = useState(false);
 
   const handleSelectDropCity = (city) => {
     const fullCity = `${city.city_name}, ${city.state_name}`;
     setSelectedDropCity(fullCity);
     setShowDropdownDrop(false);
     setErrors(prev => ({
       ...prev,
       dropCity: '' // Clear pickup city error
     }))
   };
 
 
   const handleInputChangeDrop = (e) => {
 
     const inputValue = e.target.value;
     setErrors(prev => ({ ...prev, dropCity: '' }));
     setSelectedDropCity(inputValue); // update input string
 
     if (
       !selectedDropCity ||
       (selectedDropCity &&
         inputValue !==
         `${selectedDropCity.city_name || ""}, ${selectedDropCity.state_name || ""
         }`)
     ) {
       setSelectedDropCity(null);
 
       if (inputValue.length > 0) {
         const filtered = allCities.filter((city) => {
           const searchTerm = inputValue.toLowerCase();
 
           const cityName = city.city_name?.toLowerCase() ?? "";
           const googleName = city.google_city_name?.toLowerCase() ?? "";
           const stateName = city.state_name?.toLowerCase() ?? "";
           const keywords = city.keywords?.toLowerCase() ?? "";
 
           return (
             cityName.includes(searchTerm) ||
             googleName.includes(searchTerm) ||
             stateName.includes(searchTerm) ||
             keywords.includes(searchTerm)
           );
         });
 
         setFilteredCitiesDrop(filtered);
       } else {
         setFilteredCitiesDrop(allCities);
       }
     };
   };
   const [selectedTime, setSelectedTime] = useState(null);
   const [showTimeDropdown, setShowTimeDropdown] = useState(false);
 
   const [dropDate, setDropDate] = useState(null);
   const [showDropDatePicker, setShowDropDatePicker] = useState(false);
 
   const validateFormCab = () => {
     const newErrors = {};
     if (selectedCabType === "Local") {
       if (!selectedCabInput) newErrors.pickupCity = "Pickup city is required";
       
       if (!selectedDate) newErrors.pickupDate = "Pickup date is required";
      
       if (!selectedTime) newErrors.pickupTime = "Pickup time is required";
     }
     
     // Round Trip Validation
     if (selectedCabType === "Round Trip (Outstation)") {
       if (!selectedCabInput) newErrors.pickupCity = "Pickup city is required";
       if (!selectedDropCity) newErrors.dropCity = "Drop city is required";
       if (selectedCabInput === selectedDropCity) newErrors.dropCity = "Drop city must be different";
       if (!selectedDate) newErrors.pickupDate = "Pickup date is required";
       if (!dropDate) newErrors.dropDate = "Drop date is required";
       if (dropDate && selectedDate && dropDate < selectedDate) newErrors.dropDate = "Drop date cannot be before pickup date";
       if (!selectedTime) newErrors.pickupTime = "Pickup time is required";
     }
 
     // MultiCity Validation
     if (selectedCabType === "MultiCity (Outstation)") {
       if (!selectedCabInput) newErrors.pickupCity = "Pickup city is required";
       if (stopInputs.some(input => !input)) newErrors.stops = "All stops must be filled";
       if (new Set([selectedCabInput, ...stopInputs]).size !== stopInputs.length + 1) newErrors.duplicate = "Duplicate cities not allowed";
       if (!selectedDate) newErrors.pickupDate = "Pickup date is required";
       if (!dropDate) newErrors.dropDate = "Drop date is required";
       if (!selectedTime) newErrors.pickupTime = "Pickup time is required";
     }
     if (selectedCabType === "oneWay") {
       if (!selectedCabInput) newErrors.pickupCity = "Pickup city is required";
       if (!selectedDropCity) newErrors.dropCity = "Drop city is required";
 
       if (!selectedDate) newErrors.pickupDate = "Pickup date is required";
      
       if (!selectedTime) newErrors.pickupTime = "Pickup time is required";
     }
 
     setErrors(newErrors);
     return Object.keys(newErrors).length === 0;
   };
 
   const handleSearchCab = async (e) => {
     e.preventDefault();
     if (!validateFormCab()) return;
     const formattedPickupDate = selectedDate
       ? format(selectedDate, "yyyy-MM-dd")
       : "";
     const formattedDropDate = dropDate ? format(dropDate, "yyyy-MM-dd") : "";
     const formattedTime = selectedTime ? format(selectedTime, "HH:mm") : "";
 
     const formData = new URLSearchParams();
 
     if (selectedCabType === "Local") {
       formData.append("pickup_city", selectedCabCity?.city_name || "");
       formData.append("pickup_time", formattedTime);
       formData.append("pickup_date", formattedPickupDate);
       formData.append("type_of_tour", selectedCabType);
     } else if (selectedCabType === "Round Trip (Outstation)") {
       formData.append("pickup_city", selectedCabCity?.city_name || "");
       formData.append("pickup_time", formattedTime);
       formData.append("pickup_date", formattedPickupDate);
       formData.append("cities", 
         [selectedCabInput, ...roundTripStopInputs, selectedDropCity,selectedCabInput]
           .filter(Boolean)
           .map(location => location.split(',')[0].trim())
           .join(", ")  // Changed arrow to comma separator
       );
       formData.append("return_date", formattedDropDate);
       formData.append("type_of_tour", selectedCabType);
     } else if (selectedCabType === "MultiCity (Outstation)") {
       formData.append("pickup_city", selectedCabCity?.city_name || "");
       formData.append("pickup_time", formattedTime);
       formData.append("pickup_date", formattedPickupDate);
       formData.append("cities", 
         [selectedCabInput, ...stopInputs]
           .filter(Boolean)
           .map(location => location.split(',')[0].trim())
           .join(", ")  // Changed arrow to comma separator
       );
       formData.append("return_date", formattedDropDate);
       formData.append("type_of_tour", selectedCabType);
     }
     else if (selectedCabType === "Oneway") {
       formData.append("pickup_city", selectedCabCity?.city_name || "");
       formData.append("pickup_time", formattedTime);
       formData.append("pickup_date", formattedPickupDate);
       formData.append("cities", selectedDropCity?.city_name || "");
       formData.append("return_date", formattedDropDate);
       formData.append("type_of_tour", selectedCabType);
     }
 
     // console.log(formData.toString());
 
     try {
       const response = await fetch(
         "https://demo.fleet247.in/api/corporate_apis/v1/searchTaxismod",
         {
           method: "POST",
           headers: {
             "Content-Type": "application/x-www-form-urlencoded",
           },
           body: formData,
         }
       );
 
       if (!response.ok) {
         throw new Error("Network response was not ok");
       }
 
       const data = await response.json();
 
       console.log("API response:", data);
       if(data.success === 'false'){
         navigate('/CabResultNotFound');
 
       }
       else if (data.success === 'true') {
         const header = {
           pickup_city: selectedCabCity,
           pickup_date: formattedPickupDate,
           ...(selectedCabType === 'Round Trip (Outstation)' && {
             Cities: [selectedCabInput, ...roundTripStopInputs, selectedDropCity, selectedCabInput].filter(Boolean),
            
           }),
           ...(selectedCabType === 'MultiCity (Outstation)' && {
             Cities: [selectedCabInput, ...stopInputs].filter(Boolean)
           }),
           Drop_city: selectedDropCity,
           Drop_date: formattedDropDate,
           pickup_time: formattedTime,
           selectType : selectedCabType,
         };
         
         navigate('/SearchCab');
         sessionStorage.setItem('SerachCab', JSON.stringify(data.response));
         sessionStorage.setItem('Header_Cab', JSON.stringify(header)); 
      
       }
     } catch (error) {
       console.error("Error fetching cab data:", error);
     }
   };

  return (
    <div className='Home_page_Container'>
         {loading && (
          <div className="page-center-loader flex items-center justify-center">
            <div className="big-loader flex items-center justify-center">
              <img
                className="loader-gif"
                src="/img/cotravloader.gif"
                alt="Loader"
              />
              <p className="text-center ml-4 text-gray-600 text-lg"></p>
            </div>
          </div>
        )}
        {loader && (
          <div className="page-center-loader flex items-center justify-center">
            <div className="big-loader flex items-center justify-center">
              <img
                className="loader-gif"
                src="../img/hotel_loader.gif"
                alt="Loader"
              />
            </div>
          </div>
        )}
    <div className="bgGradient" />
    <div className="main_wrapper">
      <div className="module_container">
      <div
                            className={`gap-1 flex items-center border-b ${activeForm === "flight"
                              ? "information_button border-b  active_tabs"
                              : "border-b-2 border-transparent"
                              }`}
                            onClick={() => handleIconClick("flight")}
                            style={{ cursor: "pointer" }}
                          >
                            <img
                              src={
                                activeForm === "flight"
                                  ? "../img/Flight_Hover.svg" // Image to show when activeForm is "flight"
                                  : "../img/Flight_01.svg" // Default image
                              }
                              alt="Flight Image"
                              className="w-8 h-8"
                              style={{
                                filter:
                                  activeForm === "flight"
                                    ? "grayscale(0%)"
                                    : "grayscale(100%)",
                                tintColor:
                                  activeForm === "flight" ? "blue" : "black",
                              }}
                            />
                            <span
                              className="text-lg font-semibold"
                              style={{ cursor: "pointer" }}
                            >
                              Flight
                            </span>
                          </div>

                          <div
                            className={`gap-1 flex items-center ${activeForm === "hotel"
                              ? "information_button  border-b  active_tabs"
                              : "border-b-2 border-transparent"
                              }`}
                            onClick={() => handleIconClick("hotel")}
                            style={{ cursor: "pointer" }}
                          >
                            <img
                              src={
                                activeForm === "hotel"
                                  ? "../img/Hotel_Hover.svg" // Image to show when activeForm is "flight"
                                  : "../img/Hotel_01.svg" // Default image
                              }
                              // src="../img/Hotel-02.png"
                              alt="Hotel Image"
                              className="w-6 h-6"
                              style={{
                                // filter:
                                //   activeForm === "hotel"
                                //     ? "grayscale(0%)"
                                //     : "grayscale(100%)",
                                tintColor:
                                  activeForm === "hotel" ? "blue" : "black",
                              }}
                            />
                            <span
                              className="text-lg font-semibold"
                              style={{ cursor: "pointer" }}
                            >
                              Hotel
                            </span>
                          </div>
                          <div
                            className={`gap-1 flex items-center ${activeForm === "cab"
                              ? "information_button  border-b  active_tabs"
                              : "border-b-2 border-transparent"
                              }`}
                            onClick={() => handleIconClick("cab")}
                            style={{ cursor: "pointer" }}
                          >
                            <img
                              src={
                                activeForm === "cab"
                                  ? "../img/Cab_Hover-03.svg" // Image to show when activeForm is "flight"
                                  : "../img/Cab_black.svg" // Default image
                              }
                              // src="../img/Hotel-02.png"
                              alt="Cab Image"
                              className="w-6 h-6"
                              style={{
                                // filter:
                                //   activeForm === "hotel"
                                //     ? "grayscale(0%)"
                                //     : "grayscale(100%)",
                                tintColor:
                                  activeForm === "cab" ? "blue" : "black",
                              }}
                            />
                            <span
                              className="text-lg font-semibold"
                              style={{ cursor: "pointer" }}
                            >
                              Cab
                            </span>
                          </div>
      </div>
  
      <div className="main_container">
      {activeForm === "flight" && (
                          <form
                            id="submit-form"
                            onSubmit={(e) => handleSubmit(e)}
                            action=""
                            method="POST"
                            autoComplete="off"
                          >
                            <input
                              type="hidden"
                              name="_token"
                              defaultValue="S1NzGDzenZ2TihPVjEByzt2t1VkgNBfoEIoqg8rK"
                            />
                            <div className="booking-container">
                              {/* <h2 style={{ marginLeft:'19px'}}>Flight Booking</h2> */}

                              <div className="page-search-p1">
                                <div className="One_Way">
                                  <input
                                    type="radio"
                                    className="bookingtypecheck"
                                    name="bookingtype"
                                    value="oneway"
                                    onChange={handleRadioChange}
                                    checked={formData.bookingType === "oneway"}
                                    id="departureRadio"
                                  />
                                  <div
                                    className="bookingtype onewaybookingtype"
                                    htmlFor="departureRadio"
                                    style={getLabelStyle("oneway")}
                                  >
                                    One-Way
                                  </div>
                                </div>

                                <div className="Return">
                                  <input
                                    type="radio"
                                    className="bookingtypecheck"
                                    name="bookingtype"
                                    value="Return"
                                    onChange={handleRadioChange}
                                    checked={formData.bookingType === "Return"}
                                    id="returnRadio"
                                  />
                                  <div
                                    className="bookingtype returnbookingtype"
                                    htmlFor="returnRadio"
                                    style={getLabelStyle("Return")}
                                  >
                                    Return
                                  </div>
                                </div>
                                <div className="clear"></div>
                              </div>

                              <div className="form-roww page-search-p">
                                <div
                                  className="form-groupp"
                                  style={{ maxWidth: "140px" }}
                                >
                                  <div
                                    className="location-header"
                                    style={{
                                      paddingLeft: "12px",
                                      paddingTop: "6px",
                                    }}
                                  >
                                    Company
                                  </div>

                                  <div className="location-info">
                                    <div
                                      className="input-a"
                                      style={{
                                        border: "none",
                                        boxShadow: "none",
                                        paddingLeft: "0px",
                                      }}
                                    >
                                      <div
                                        className="location-details"
                                        style={{ position: "relative" }}
                                      >
                                        <input
                                          type="text"
                                          className="city-name-input"
                                          value={inputCompany}
                                          onChange={(e) => {
                                            setInputCompany(e.target.value);
                                            setShowDropdown(true); // Show dropdown while typing
                                          }}
                                          placeholder="Select company"
                                          onFocus={() => setShowDropdown(true)}
                                          onBlur={() =>
                                            setTimeout(
                                              () => setShowDropdown(false),
                                              200
                                            )
                                          } // Delay hiding for clicks
                                        />

                                        {showDropdown && (
                                          <div className="dropdown-container">
                                            <ul
                                              className="dropdown"
                                              style={{ minWidth: "137px" }}
                                            >
                                              {companies
                                                .filter((company) =>
                                                  company.corporate_name
                                                    .toLowerCase()
                                                    .includes(
                                                      inputCompany.toLowerCase()
                                                    )
                                                )
                                                .map((company) => (
                                                  <li
                                                    key={company.id}
                                                    className="dropdown-item"
                                                    onMouseDown={() =>
                                                      handleCompanySelect(
                                                        company
                                                      )
                                                    }
                                                    style={{
                                                      marginBottom: "7px",
                                                      padding: "5px",
                                                      width: "100%", // Ensure full width usage
                                                    }}
                                                  >
                                                    <div
                                                      style={{
                                                        display: "flex",
                                                        justifyContent:
                                                          "space-between",
                                                        alignItems: "center",
                                                        // whiteSpace: "nowrap", // Prevents text from wrapping
                                                      }}
                                                    >
                                                      <span
                                                        style={{
                                                          fontWeight: "600",
                                                          color: "#555",
                                                          flexGrow: 1,
                                                          overflow: "hidden",
                                                          textOverflow:
                                                            "ellipsis",
                                                        }}
                                                      >
                                                        {company.corporate_name}
                                                      </span>
                                                      <span
                                                        style={{
                                                          fontWeight: "500",
                                                          minWidth: "30px",
                                                          textAlign: "right",
                                                        }}
                                                      >
                                                        {company.id}
                                                      </span>
                                                    </div>
                                                  </li>
                                                ))}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="form-groupp">
                                  <div className="location-info">
                                    <div
                                      className="input-a"
                                      style={{
                                        border: "none",
                                        boxShadow: "none",
                                      }}
                                    >
                                      <div className="location-header">
                                        FROM
                                      </div>
                                      <div
                                        className="location-details"
                                        style={{ position: "relative" }}
                                      >
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
                                            const errorElement =
                                              document.querySelector(
                                                ".redorigin"
                                              );
                                            if (value.trim() !== "") {
                                              errorElement.style.display =
                                                "none";
                                            } else {
                                              errorElement.style.display =
                                                "block";
                                            }
                                          }}
                                          placeholder="Enter city"
                                          onFocus={() =>
                                            setShowOriginDropdown(true)
                                          } // Show dropdown when focused
                                          onBlur={(e) => {
                                            // Validate input on blur
                                            const value = e.target.value;
                                            const errorElement =
                                              document.querySelector(
                                                ".redorigin"
                                              );
                                            if (value.trim() !== "") {
                                              errorElement.style.display =
                                                "none";
                                            } else {
                                              errorElement.style.display =
                                                "block";
                                            }
                                            // Delay hiding dropdown to allow click on options
                                            setTimeout(
                                              () =>
                                                setShowOriginDropdown(false),
                                              200
                                            );
                                          }}
                                        />
                                        <div className="airport-name">
                                          {inputOrigin
                                            .split(")")
                                            .slice(1)
                                            .join(")")
                                            .trim()}{" "}
                                          {/* Display everything after the city */}
                                        </div>
                                        {showOriginDropdown && (
                                          <ul className="dropdown">
                                            <div className="dropdown-title">
                                              Popular Cities
                                            </div>
                                            {origin.map((option) => (
                                              <li
                                                className="dropdown-item"
                                                key={option.value}
                                                onMouseDown={() => {
                                                  handleOrigin(
                                                    option.value,
                                                    option.airportName
                                                  );
                                                  setShowOriginDropdown(false);
                                                }}
                                              >
                                                <div className="dropdown-top">
                                                  <span className="city-names">
                                                    {option.div}
                                                  </span>
                                                  <span className="iata-code">
                                                    {option.value}
                                                  </span>
                                                </div>
                                                <div className="airport-namee">
                                                  {option.airportName}
                                                </div>
                                              </li>
                                            ))}
                                          </ul>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className="redorigin"
                                    style={{
                                      color: "red",
                                      fontsize: "10px",
                                      fontfamily: "Raleway",
                                      display: "none",
                                    }}
                                  >
                                    Please select Origin
                                  </div>
                                  <div
                                    className="redorigin1"
                                    style={{
                                      color: "red",
                                      fontsize: "10px",
                                      fontfamily: "Raleway",
                                      display: "none",
                                    }}
                                  >
                                    Please select valid Origin
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  className="swapbuttonn"
                                  onClick={swapOriginAndDestination}
                                >
                                  <img
                                    src="/img/swapcircle.svg"
                                    width={"25px"}
                                    loading="lazy"
                                  />
                                </button>

                                <div className="form-groupp">
                                  <div className="location-info">
                                    <div
                                      className="input-a"
                                      style={{
                                        border: "none",
                                        boxShadow: "none",
                                      }}
                                    >
                                      <div className="location-header">TO</div>
                                      <div
                                        className="location-details"
                                        style={{ position: "relative" }}
                                      >
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
                                            const errorElement =
                                              document.querySelector(
                                                ".redestination"
                                              );
                                            if (value.trim() !== "") {
                                              errorElement.style.display =
                                                "none";
                                            } else {
                                              errorElement.style.display =
                                                "block";
                                            }
                                          }}
                                          onFocus={() =>
                                            setShowDestinationDropdown(true)
                                          }
                                          onBlur={(e) => {
                                            // Validate input on blur
                                            const value = e.target.value;
                                            const errorElement =
                                              document.querySelector(
                                                ".redestination"
                                              );
                                            if (value.trim() !== "") {
                                              errorElement.style.display =
                                                "none";
                                            } else {
                                              errorElement.style.display =
                                                "block";
                                            }
                                            // Delay hiding dropdown to allow click on options
                                            setTimeout(
                                              () =>
                                                setShowDestinationDropdown(
                                                  false
                                                ),
                                              200
                                            );
                                          }}
                                        // style={{ width: '100%', textAlign: 'center', height: '100%', border: 'none', outline: 'none' }}
                                        />
                                        {/* Dropdown */}

                                        {/* Static airport name */}
                                        <div className="airport-name">
                                          {inputDestination
                                            .split(")")
                                            .slice(1)
                                            .join(")")
                                            .trim()}{" "}
                                          {/* Display everything after the city */}
                                        </div>
                                        {showDestinationDropdown && (
                                          <ul className="dropdown">
                                            <div className="dropdown-title">
                                              Popular Cities
                                            </div>
                                            {destination.map((option) => (
                                              <li
                                                className="dropdown-item"
                                                key={option.value}
                                                onMouseDown={() => {
                                                  handleDestination(
                                                    option.value,
                                                    option.airportName
                                                  );
                                                  setShowDestinationDropdown(
                                                    false
                                                  );
                                                }}
                                              >
                                                {/* City name and IATA code in the same line */}
                                                <div className="dropdown-top">
                                                  <span className="city-names">
                                                    {option.div}
                                                  </span>
                                                  <span className="iata-code">
                                                    {option.value}
                                                  </span>
                                                </div>
                                                {/* Airport name below */}
                                                <div className="airport-namee">
                                                  {option.airportName}
                                                </div>
                                                {/* Divider between options */}
                                                {/* <div className="dropdown-divider"></div> */}
                                              </li>
                                            ))}
                                          </ul>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className="redestination"
                                    style={{
                                      color: "red",
                                      fontsize: "10px",
                                      fontfamily: "Raleway",
                                      display: "none",
                                    }}
                                  >
                                    Please select Destination
                                  </div>
                                  <div
                                    className="redestination1"
                                    style={{
                                      color: "red",
                                      fontsize: "10px",
                                      fontfamily: "Raleway",
                                      display: "none",
                                    }}
                                  >
                                    Please select valid Destination
                                  </div>
                                </div>

                                <div
                                  className="form-groupp srch-tab-left"
                                  style={{ maxWidth: "130px" }}
                                >
                                  {/* <div htmlFor="departureDate">Departure</div> */}
                                  <div
                                    className="location-header"
                                    style={{
                                      paddingLeft: "12px",
                                      paddingTop: "6px",
                                    }}
                                  >
                                    Departure
                                  </div>

                                  <div
                                    className="input-a"
                                    style={{
                                      border: "none",
                                      boxShadow: "none",
                                      paddingLeft: "12px",
                                    }}
                                    onClick={() => setdepIsOpen(true)}
                                  >
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
                                    {/* <span className="date-icon" onClick={(e) => {e.stopPropagation(); setdepIsOpen(true)}}></span> */}
                                  </div>
                                  <span
                                    id="errorDate"
                                    style={{
                                      color: "red",
                                      fontsize: "12px",
                                      fontfamily: "Raleway",
                                    }}
                                    className="error-message"
                                  ></span>
                                  <div
                                    className="redsearchdeparture"
                                    style={{
                                      color: "red",
                                      fontsize: "12px",
                                      fontfamily: "Raleway",
                                    }}
                                  >
                                    Please select Departure Date
                                  </div>
                                  <div
                                    className="redsearchdeparture1"
                                    style={{
                                      display: "none",
                                      color: "red",
                                      fontsize: "12px",
                                      fontfamily: "Raleway",
                                    }}
                                  >
                                    Please select valid Departure Date
                                  </div>
                                </div>

                                <div
                                  className="form-groupp srch-tab-right"
                                  id="departurereturn"
                                  style={{ maxWidth: "130px" }}
                                >
                                  {/* <div htmlFor="returnDate">Return</div> */}
                                  <div
                                    className="location-header"
                                    style={{
                                      paddingLeft: "12px",
                                      paddingTop: "6px",
                                    }}
                                  >
                                    Return
                                  </div>
                                  <div
                                    className="input-a"
                                    style={{
                                      border: "none",
                                      boxShadow: "none",
                                      paddingLeft: "12px",
                                    }}
                                    onClick={
                                      formData.bookingType === "Return"
                                        ? () => setretIsOpen(true)
                                        : () => () => setretIsOpen(false)
                                    }
                                  >
                                    <DatePicker
                                      name="searchreturnDate"
                                      selected={formData.returnDate}
                                      onChange={handleReturnDateChange}
                                      dateFormat="dd/MM/yyyy"
                                      minDate={
                                        formData.departureDate || new Date()
                                      }
                                      placeholderText="Return Date"
                                      disabled={!isReturnEnabled}
                                      open={isretOpen}
                                      onClickOutside={() => setretIsOpen(false)}
                                    />
                                    {/* <span
                                    className="date-icon"
                                    onClick={(e) => {
                                        if (formData.bookingType === "Return") {
                                        e.stopPropagation();
                                        setretIsOpen(true);
                                        }
                                    }}
                                    ></span> */}
                                  </div>
                                  <span
                                    id="errorDate1"
                                    style={{
                                      color: "red",
                                      fontsize: "12px",
                                      fontfamily: "Raleway",
                                    }}
                                    className="error-message"
                                  ></span>
                                  <div
                                    className="redsearchreturn"
                                    style={{
                                      display: "none",
                                      color: "red",
                                      fontsize: "12px",
                                      fontfamily: "Raleway",
                                    }}
                                  >
                                    Please select Return Date
                                  </div>
                                  <div
                                    className="redsearchreturn1"
                                    style={{
                                      display: "none",
                                      color: "red",
                                      fontsize: "12px",
                                      fontfamily: "Raleway",
                                    }}
                                  >
                                    Please select valid Return Date
                                  </div>
                                </div>

                                <div className="form-groupp srch-tab-line no-margin-bottom">
                                  {/* <div htmlFor="travellers">Travellers & Class</div> */}
                                  <div
                                    className="location-header"
                                    style={{
                                      paddingLeft: "12px",
                                      paddingTop: "6px",
                                    }}
                                  >
                                    Travellers & Class
                                  </div>
                                  <div
                                    className="input-a"
                                    style={{
                                      border: "none",
                                      boxShadow: "none",
                                      paddingLeft: "12px",
                                    }}
                                  >
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
                                  <div
                                    className="redpassenger"
                                    style={{
                                      color: "red",
                                      fontsize: "12px",
                                      fontfamily: "Raleway",
                                    }}
                                  >
                                    Please select maximum 9 passenger
                                  </div>
                                  <div
                                    className="infantmore"
                                    style={{
                                      color: "red",
                                      fontsize: "12px",
                                      fontfamily: "Raleway",
                                    }}
                                  >
                                    Number of infants cannot be more than adults
                                  </div>
                                </div>
                              </div>

                              <div
                                id="error-message1"
                                style={{
                                  color: "red",
                                  marginleft: "2%",
                                  fontfamily: "Raleway",
                                  fontsize: "13px",
                                }}
                              ></div>
                              <div
                                id="error-message2"
                                style={{
                                  color: "red",
                                  marginleft: "2%",
                                  fontfamily: "Raleway",
                                  fontsize: "13px",
                                }}
                              ></div>

                              {/* <button className="search-buttonn">SEARCH</button> */}
                              <button
                                type="submit"
                                className="search-buttonn serach_button"
                                id="btnSearch"
                              >
                                SEARCH
                              </button>
                            </div>
                            <div
                              ref={searchRef}
                              className="search-asvanced"
                              style={{ display: isOpen ? "block" : "none" }}
                            >
                              <div className="search-large-i">
                                <div className="srch-tab-line no-margin-bottom">
                                  <div
                                    style={{
                                      textAlign: "left",
                                      marginBottom: "0px",
                                    }}
                                  >
                                    Adults (12y +)
                                  </div>
                                  <p
                                    style={{
                                      color: "#7b7777",
                                      fontSize: "small",
                                      marginBottom: "1px",
                                    }}
                                  >
                                    on the day of travel
                                  </p>
                                  <div className="select-wrapper1">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
                                      (value) => (
                                        <React.Fragment key={value}>
                                          <input
                                            type="radio"
                                            name="adult"
                                            id={`adult${value}`}
                                            value={value}
                                            onChange={(e) =>
                                              handleAdult(e.target.value)
                                            }
                                            checked={
                                              Cookies.get("cookiesData")
                                                ? value.toString() ===
                                                adultCount.toString()
                                                : value === 1
                                            }
                                          />
                                          <div htmlFor={`adult${value}`}>
                                            {value}
                                          </div>
                                        </React.Fragment>
                                      )
                                    )}
                                    <input
                                      type="radio"
                                      name="adult"
                                      id="adultgreater9"
                                      value={10}
                                      onChange={(e) =>
                                        handleAdult(e.target.value)
                                      }
                                    />
                                    <div htmlFor="adultgreater9">&gt;9</div>
                                  </div>
                                </div>
                                <div className="row-container">
                                  <div className="srch-tab-line no-margin-bottom">
                                    <div
                                      style={{
                                        textAlign: "left",
                                        marginBottom: "0px",
                                      }}
                                    >
                                      Children (2y - 12y)
                                    </div>
                                    <p
                                      style={{
                                        color: "#7b7777",
                                        fontSize: "small",
                                        marginBottom: "1px",
                                      }}
                                    >
                                      on the day of travel
                                    </p>
                                    <div className="select-wrapper1">
                                      {[0, 1, 2, 3, 4, 5, 6].map((value) => (
                                        <React.Fragment key={value}>
                                          <input
                                            type="radio"
                                            name="child"
                                            id={`child${value}`}
                                            value={value}
                                            onChange={(e) =>
                                              handleChild(e.target.value)
                                            }
                                            checked={
                                              Cookies.get("cookiesData")
                                                ? value.toString() ===
                                                childCount.toString()
                                                : value === 0
                                            }
                                          />
                                          <div htmlFor={`child${value}`}>
                                            {value}
                                          </div>
                                        </React.Fragment>
                                      ))}
                                      <input
                                        type="radio"
                                        name="child"
                                        id="childgreater6"
                                        value={7}
                                        onChange={(e) =>
                                          handleChild(e.target.value)
                                        }
                                      />
                                      <div htmlFor="childgreater6">&gt;6</div>
                                    </div>
                                  </div>
                                  <div className="srch-tab-line no-margin-bottom">
                                    <div
                                      style={{
                                        textAlign: "left",
                                        marginBottom: "0px",
                                      }}
                                    >
                                      Infants (below 2y)
                                    </div>
                                    <p
                                      style={{
                                        color: "#7b7777",
                                        fontSize: "small",
                                        marginBottom: "1px",
                                      }}
                                    >
                                      on the day of travel
                                    </p>
                                    <div className="select-wrapper1">
                                      {[0, 1, 2, 3, 4, 5, 6].map((value) => (
                                        <React.Fragment key={value}>
                                          <input
                                            type="radio"
                                            name="infant"
                                            id={`infant${value}`}
                                            value={value}
                                            onChange={(e) =>
                                              handleInfant(e.target.value)
                                            }
                                            checked={
                                              Cookies.get("cookiesData")
                                                ? value.toString() ===
                                                infantCount.toString()
                                                : value === 0
                                            }
                                          />
                                          <div htmlFor={`infant${value}`}>
                                            {value}
                                          </div>
                                        </React.Fragment>
                                      ))}
                                      <input
                                        type="radio"
                                        name="infant"
                                        id="infantgreater6"
                                        value={7}
                                        onChange={(e) =>
                                          handleInfant(e.target.value)
                                        }
                                      />
                                      <div htmlFor="infantgreater6">&gt;6</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Travel Class Selection */}
                              <div className="search-large-i1">
                                <div className="srch-tab-line no-margin-bottom">
                                  <div
                                    style={{
                                      marginBottom: "1%",
                                      textAlign: "left",
                                    }}
                                  >
                                    Choose Travel Class
                                  </div>
                                  <div className="select-wrapper1 select-wrapper2">
                                    {[
                                      "Economy/Premium Economy",
                                      "Business",
                                      "First",
                                    ].map((value) => (
                                      <React.Fragment key={value}>
                                        <input
                                          type="radio"
                                          name="classtype"
                                          id={`classtype${value}`}
                                          value={value}
                                          onChange={(e) =>
                                            handleClasstype(e.target.value)
                                          }
                                          checked={
                                            Cookies.get("cookiesData")
                                              ? value.toString() ===
                                              cabinClass.toString()
                                              : value ===
                                              "Economy/Premium Economy"
                                          }
                                        />
                                        <div
                                          style={{ lineHeight: "2" }}
                                          htmlFor={`classtype${value}`}
                                        >
                                          {value === "Economy/Premium Economy"
                                            ? value
                                            : `${value} class`}
                                        </div>
                                      </React.Fragment>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="search-buttonn"
                                style={{ marginLeft: "69%" }}
                                onClick={() => {
                                  setIsOpen(false);
                                }}
                              >
                                Apply
                              </button>
                            </div>
                          </form>
                        )}
                           {activeForm === "hotel" && (
                                                  <form
                                                    className="hotel-form "
                                                    onSubmit={handleHotelSearch}
                                                  >
                                                    <div className=" hotel-box ">
                                                      <div className="hotel-container flex flex-cols ">
                                                        {/* Input for City, Property, or Location */}
                                                        <div className="from-hotel-group">
                                                          <div className="location-headers">
                                                            Company Name
                                                          </div>
                                                          <div className="location-details relative">
                                                            <input
                                                              type="text"
                                                              className="w-full rounded-lg px-3 py-2 focus:outline-none hotel-city-name"
                                                              placeholder="Select Company"
                                                              name="selectedCompany" // Match this with your state key
                                                              value={selectedCompany}
                                                              onChange={handleInputChange2}
                                                              onFocus={() => setShowDropdown2(true)}
                                                              onBlur={() =>
                                                                setTimeout(
                                                                  () => setShowDropdown2(false),
                                                                  200
                                                                )
                                                              }
                                                              autoComplete="off"
                                                            />
                        
                                                            {showDropdown2 && (
                                                              <div className="absolute w-full bg-white shadow-md rounded-lg max-h-48 overflow-auto mt-1 border border-gray-300 z-50">
                                                                {filteredCompany.length > 0 ? (
                                                                  filteredCompany.map(
                                                                    (company, index) => (
                                                                      <div
                                                                        key={company.id || index}
                                                                        className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                                                                        onClick={() =>
                                                                          handleSelectCompany(
                                                                            company.corporate_name
                                                                          )
                                                                        }
                                                                      >
                                                                        <div className="text-sm">
                                                                          {company.corporate_name}
                                                                        </div>
                                                                        <div className="text-xs">
                                                                          ({company.corporate_code})
                                                                        </div>
                                                                      </div>
                                                                    )
                                                                  )
                                                                ) : (
                                                                  <div className="px-3 py-2 text-gray-500">
                                                                    No companies found
                                                                  </div>
                                                                )}
                                                              </div>
                                                            )}
                        
                                                            {errors.selectedCompany && (
                                                              <span className="text-red-500 text-xs px-3">
                                                                {errors.selectedCompany}
                                                              </span>
                                                            )}
                                                          </div>
                                                        </div>
                        
                                                        <div className="from-hotel-group">
                                                          <div className="location-headers">
                                                            City, Property Name or Location
                                                          </div>
                                                          <div className="location-details relative">
                                                            <input
                                                              type="text"
                                                              className="w-full rounded-lg px-3 py-2 focus:outline-none hotel-city-name"
                                                              placeholder="Enter City"
                                                              value={selectedCity}
                                                              name="city_name"
                                                              onChange={handleInputChange}
                                                              onFocus={() => setShowDropdown1(true)} // Show dropdown when input is focused
                                                              onBlur={() =>
                                                                setTimeout(
                                                                  () => setShowDropdown1(false),
                                                                  200
                                                                )
                                                              } // Delay hiding to allow click
                                                              autoComplete="off"
                                                            />
                        
                                                            {showDropdown1 &&
                                                              filteredCities.length > 0 && (
                                                                <div className="absolute w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-y-auto z-10 dropdown-size">
                                                                  {filteredCities.map((city) => (
                                                                    <div
                                                                      key={city.Code}
                                                                      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                                                                      onMouseDown={() =>
                                                                        handleCitySelect(city.Name)
                                                                      } // Use onMouseDown to prevent blur issue
                                                                    >
                                                                      {city.Name}
                                                                    </div>
                                                                  ))}
                                                                </div>
                                                              )}
                                                            {errors.selectedCity && (
                                                              <span className="text-red-500 text-xs px-3">
                                                                {errors.selectedCity}
                                                              </span>
                                                            )}
                                                          </div>
                                                        </div>
                        
                                                        {/* Check-In Date */}
                                                        <div className="from-hotel-group">
                                                          <div className="location-headers">
                                                            Check-In
                                                          </div>
                                                          <div
                                                            className="input-a"
                                                            // style={{
                                                            //   border: "none",
                                                            //   boxShadow: "none",
                                                            //   paddingLeft: "12px",
                                                            // }}
                        
                                                            onClick={() => setCheckInIsOpen(true)} // Separate state for Check-In calendar
                                                          >
                                                            <DatePicker
                                                              name="searchCheckIn"
                                                              autoComplete="off"
                                                              selected={formData.checkInDate} // Separate variable for Check-In date
                                                              dateFormat="dd/MM/yyyy"
                                                              placeholderText="Add Check-In Date"
                                                              minDate={new Date()}
                                                              value={formData.checkInDate}
                                                              open={isCheckInOpen} // Separate state for Check-In calendar visibility
                                                              onChange={(date) => {
                                                                handleCheckInDateChange(date); // Handle Check-In date change
                                                                setCheckInIsOpen(false); // Close calendar after selecting
                                                              }}
                                                              onClickOutside={() =>
                                                                setCheckInIsOpen(false)
                                                              } // Close calendar when clicking outside
                                                            />
                                                            <span
                                                              className="date-icon"
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                                setCheckInIsOpen(true); // Reopen calendar on icon click
                                                              }}
                                                            ></span>
                                                          </div>
                                                          {errors.checkInDate && (
                                                            <span className="text-red-500 text-xs px-2">
                                                              {errors.checkInDate}
                                                            </span>
                                                          )}
                                                          <span
                                                            id="errorDate"
                                                            style={{
                                                              color: "red",
                                                              fontsize: "12px",
                                                              fontfamily: "Raleway",
                                                            }}
                                                            className="error-message"
                                                          ></span>
                                                        </div>
                        
                                                        {/* Check-Out Date */}
                                                        <div className="from-hotel-group">
                                                          <div className="location-headers">
                                                            Check-Out
                                                          </div>
                        
                                                          <div
                                                            className="input-a"
                                                            // style={{
                                                            //   border: "none",
                                                            //   boxShadow: "none",
                                                            //   paddingLeft: "12px",
                                                            // }}
                                                            onClick={() => setCheckOutIsOpen(true)}
                                                          >
                                                            <DatePicker
                                                              name="searchCheckOut"
                                                              autoComplete="off"
                                                              selected={formData.checkOutDate}
                                                              onChange={(date) => {
                                                                handleCheckOutDateChange(date);
                                                                setCheckOutIsOpen(false); // Close the DatePicker
                                                              }}
                                                              dateFormat="dd/MM/yyyy"
                                                              minDate={formData.checkInDate} // Ensure Check-Out date is after Return date
                                                              placeholderText="Add Check-Out Date"
                                                              open={isCheckOutOpen}
                                                              onClickOutside={() =>
                                                                setCheckOutIsOpen(false)
                                                              }
                                                            />
                                                            <span
                                                              className="date-icon"
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                                setCheckOutIsOpen(true);
                                                              }}
                                                            ></span>
                                                            <span
                                                              id="errorDate2"
                                                              style={{
                                                                color: "red",
                                                                fontSize: "12px",
                                                                fontFamily: "Raleway",
                                                              }}
                                                              className="error-message"
                                                            ></span>
                                                          </div>
                                                          {errors.checkOutDate && (
                                                            <span className="text-red-500 text-xs px-2">
                                                              {errors.checkOutDate}
                                                            </span>
                                                          )}
                                                          <span
                                                            id="errorDate1"
                                                            style={{
                                                              color: "red",
                                                              fontsize: "12px",
                                                              fontfamily: "Raleway",
                                                            }}
                                                            className="error-message"
                                                          ></span>
                                                        </div>
                                                        <div className="from-hotel-group">
                                                          <div className="location-headers">
                                                            Rooms & Guests
                                                          </div>
                                                          <div className="input-a">
                                                            <input
                                                              type="text"
                                                              id="openpassengermodal"
                                                              name="openpassengermodal"
                                                              className="openpassengermodal srch-lbl w-full focus:outline-none cursor-pointer overflow-x"
                                                              placeholder="Select all"
                                                              value={`${roomCount} Rooms, ${roomadultCount} Adults,${roomchildCount} Children`}
                                                              onClick={handleToggleHotel}
                                                              readOnly
                                                            />
                                                            {isDropdownOpen && (
                                                              <div className="absolute right-0 bg-white rounded-lg mt-1 p-3 z-10 shadow-lg hotel_forms_home">
                                                                <div className="mb-2 flex items-center justify-between">
                                                                  <h6 className="textsizes">Rooms</h6>
                                                                  <select
                                                                    className="border border-gray-300 px-3 py-1 focus:outline-none"
                                                                    value={roomCount}
                                                                    onChange={(e) =>
                                                                      handleSelection(
                                                                        "rooms",
                                                                        parseInt(e.target.value)
                                                                      )
                                                                    }
                                                                  >
                                                                    {Array.from(
                                                                      { length: 21 },
                                                                      (_, i) => i
                                                                    ).map((num) => (
                                                                      <option
                                                                        key={num}
                                                                        value={num}
                                                                        className="max-h-[2px]"
                                                                      >
                                                                        {num}
                                                                      </option>
                                                                    ))}
                                                                  </select>
                                                                </div>
                        
                                                                {/* Show error message if not enough rooms */}
                                                                {errorMessage && (
                                                                  <p className="text-red-500 text-xs px-2">
                                                                    {errorMessage}
                                                                  </p>
                                                                )}
                        
                                                                {/* Adults Selector */}
                                                                <div className="mb-2 flex items-center justify-between">
                                                                  <h6 className="textsizes">Adults</h6>
                                                                  <select
                                                                    className="border border-gray-300  px-3 py-1 focus:outline-none"
                                                                    value={roomadultCount}
                                                                    onChange={(e) =>
                                                                      handleSelection(
                                                                        "adults",
                                                                        parseInt(e.target.value)
                                                                      )
                                                                    }
                                                                  >
                                                                    {Array.from(
                                                                      { length: 41 },
                                                                      (_, i) => i
                                                                    ).map((num) => (
                                                                      <option key={num} value={num}>
                                                                        {num}
                                                                      </option>
                                                                    ))}
                                                                  </select>
                                                                </div>
                        
                                                                {/* Children Selector */}
                                                                <div className="mb-2 flex items-center justify-between">
                                                                  <div>
                                                                    <h6 className="textsizes">
                                                                      Children{" "}
                                                                    </h6>{" "}
                                                                    <p className="text-xs ">0-17 yrs</p>
                                                                  </div>
                        
                                                                  <select
                                                                    className="border border-gray-300 px-3 py-1 focus:outline-none"
                                                                    value={roomchildCount}
                                                                    onChange={(e) =>
                                                                      handleSelection(
                                                                        "children",
                                                                        parseInt(e.target.value)
                                                                      )
                                                                    }
                                                                  >
                                                                    {Array.from(
                                                                      { length: 41 },
                                                                      (_, i) => i
                                                                    ).map((num) => (
                                                                      <option key={num} value={num}>
                                                                        {num}
                                                                      </option>
                                                                    ))}
                                                                  </select>
                                                                </div>
                        
                                                                {/* Horizontal Line */}
                                                                <p className="textcolor ">
                                                                  Please provide the correct number of
                                                                  children along with their ages for the
                                                                  best options and prices.
                                                                </p>
                                                                <hr className="my-4 border-gray-500" />
                        
                                                                {/* Children Ages Dropdowns */}
                                                                {/* Children Ages Dropdowns - Only show if children count > 0 */}
                                                                {roomchildCount > 0 && (
                                                                  <div
                                                                    className="overflow-y-auto grid grid-cols-2 gap-4"
                                                                    style={{ maxHeight: "150px" }}
                                                                  >
                                                                    {childrenAges
                                                                      .slice(0, roomchildCount)
                                                                      .map((age, index) => (
                                                                        <div
                                                                          key={index}
                                                                          className="mb-4 flex items-center gap-4 justify-between"
                                                                        >
                                                                          <h6 className="textsizes">
                                                                            Child&nbsp;{index + 1}
                                                                          </h6>
                                                                          <select
                                                                            className="border border-gray-300 rounded-sm py-1 px-2 w-full focus:outline-none text-xs"
                                                                            value={age || ""}
                                                                            onChange={(e) =>
                                                                              handleChildAgeChange(
                                                                                index,
                                                                                parseInt(e.target.value)
                                                                              )
                                                                            }
                                                                          >
                                                                            <option value="" disabled>
                                                                              Select
                                                                            </option>
                                                                            {Array.from(
                                                                              { length: 18 },
                                                                              (_, i) => i
                                                                            ).map((num) => (
                                                                              <option
                                                                                key={num}
                                                                                value={num}
                                                                              >
                                                                                {num} Yrs
                                                                              </option>
                                                                            ))}
                                                                          </select>
                                                                        </div>
                                                                      ))}
                                                                  </div>
                                                                )}
                        
                                                                {/* Apply Button */}
                                                                <button
                                                                  className="search-buttonn item-center justify-between"
                                                                  style={{ marginLeft: "25%" }}
                                                                  onClick={handleApply} // Validate before closing
                                                                >
                                                                  Apply
                                                                </button>
                                                              </div>
                                                            )}
                                                          </div>
                                                          {errors.roomCount && (
                                                            <span className="text-red-500 text-xs px-2">
                                                              {errors.roomCount}
                                                            </span>
                                                          )}
                                                        </div>
                                                      </div>
                                                    </div>
                        
                                                    {/* Search Button */}
                                                    <button
                                                      type="submit"
                                                      className="search-buttonn serach_button"
                                                      // style={{
                                                      //   position: "absolute",
                                                      //   bottom: "-140px",
                                                      //   left: "41.5%",
                                                      // }}
                                                      id="btnSearch"
                                                    >
                                                      SEARCH
                                                    </button>
                                                  </form>
                                                )}
                                                   {activeForm === "cab" && (
                                                                          <div
                                                                            className="cab-form "
                                                                          // onSubmit={handleCabSearch}
                                                                          >
                                                                            <div className=" cab-box ">
                                                                              <div className="flex gap-4">
                                                                                {/* Radio Buttons */}
                                                                                {[
                                                                                  "Local",
                                                                                  "Round Trip (Outstation)",
                                                                                  "MultiCity (Outstation)",
                                                                                  "Oneway",
                                                                                ].map((type) => (
                                                                                  <div
                                                                                    key={type}
                                                                                    className="inline-flex items-center gap-1 cursor-pointer"
                                                                                    onClick={() => setSelectedCabType(type)}
                                                                                  >
                                                                                    <input
                                                                                      type="radio"
                                                                                      name="cabType"
                                                                                      className="w-4 h-3"
                                                                                      checked={selectedCabType === type}
                                                                                      onChange={() => setSelectedCabType(type)}
                                                                                    />
                                                                                    <span className="text-sm cursor-pointer">
                                                                                      {type}
                                                                                    </span>
                                                                                  </div>
                                                                                ))}
                                                                              </div>
                                                                              {selectedCabType === "Local" ? (
                                                                                <from className="cab-container flex flex-cols ">
                                                                                  <div className="from-cab-group">
                                                                                    <div className="location-headers">
                                                                                      Pickup City
                                                                                    </div>
                                                                                    <div className="location-details relative">
                                                                                      <input
                                                                                        type="text"
                                                                                        className="w-full rounded-lg px-3 py-2 focus:outline-none hotel-city-name"
                                                                                        placeholder="Select Pickup City"
                                                                                        value={selectedCabInput}
                                                                                        onChange={handleInputChangeCab}
                                                                                        onFocus={() => setShowDropdownCab(true)}
                                                                                        onBlur={() =>
                                                                                          setTimeout(
                                                                                            () => setShowDropdownCab(false),
                                                                                            200
                                                                                          )
                                                                                        }
                                                                                        disabled={isLoading}
                                                                                      />
                                                
                                                                                      {isLoading && (
                                                                                        <div className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full p-2">
                                                                                          <div className="text-center py-2">
                                                                                            Loading cities...
                                                                                          </div>
                                                                                        </div>
                                                                                      )}
                                                
                                                                                      {error && (
                                                                                        <div className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full p-2">
                                                                                          <div className="text-red-500 text-center py-2">
                                                                                            {error}
                                                                                          </div>
                                                                                        </div>
                                                                                      )}
                                                
                                                                                      {showDropdownCab &&
                                                                                        !isLoading &&
                                                                                        !error &&
                                                                                        filteredCitiesCab.length > 0 && (
                                                                                          <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full max-h-60 overflow-auto shadow-lg">
                                                                                            {filteredCitiesCab.map((city) => (
                                                                                              <li
                                                                                                key={city.city_id}
                                                                                                className="px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                                                                                                onMouseDown={() =>
                                                                                                  handleSelectCity(city)
                                                                                                }
                                                                                              >
                                                                                                <div className="font-medium">
                                                                                                  {city.city_name}
                                                                                                </div>
                                                                                                <div className="text-xs text-gray-500">
                                                                                                  {city.google_city_name}
                                                                                                </div>
                                                                                              </li>
                                                                                            ))}
                                                                                          </ul>
                                                                                        )}
                                                
                                                                                      {showDropdownCab &&
                                                                                        !isLoading &&
                                                                                        filteredCitiesCab.length === 0 && (
                                                                                          <div className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full p-2">
                                                                                            <div className="text-center py-2 text-gray-500">
                                                                                              No cities found
                                                                                            </div>
                                                                                          </div>
                                                                                        )}
                                                                                          {errors.pickupCity && (
                                                           <div className="text-red-500 text-xs mt-1 px-2.5">{errors.pickupCity}</div>
                                                          )}
                                                                                    </div>
                                                                                  </div>
                                                
                                                                                  <div className="from-cab-group">
                                                                                    <div className="cab-headers">
                                                                                      Pickup Date
                                                                                    </div>
                                                                                    <div className="location-details relative">
                                                                                      <DatePicker
                                                                                        className="w-full rounded-lg px-3 py-2 focus:outline-none hotel-city-name"
                                                                                        placeholderText="Select Pickup Date"
                                                                                        selected={selectedDate} // Your state variable for the selected date
                                                                                        onChange={(date) => {
                                                                                          setSelectedDate(date);
                                                                                          setErrors(prev => ({ ...prev, pickupDate: '' }));
                                                                                          setShowDropdown5(false); // Close the dropdown if needed
                                                                                        }}
                                                                                        dateFormat="dd/MM/yyyy"
                                                                                        minDate={new Date()} // Optional: restrict to future dates
                                                                                        onFocus={() => setShowDropdown5(true)}
                                                                                        onBlur={() =>
                                                                                          setTimeout(
                                                                                            () => setShowDropdown5(false),
                                                                                            200
                                                                                          )
                                                                                        }
                                                                                        open={showDropdown5} // Control visibility
                                                                                        onClickOutside={() =>
                                                                                          setShowDropdown5(false)
                                                                                        }
                                                                                      />
                                                                                    </div>
                                                                                    {errors.pickupDate && (
                                                           <div className="text-red-500 text-xs mt-1 px-2.5">{errors.pickupDate}</div>
                                                          )}
                                                                                  </div>
                                                
                                                                                  <div className="from-cab-group">
                                                                                    <div className="cab-headers">
                                                                                      Pickup Time
                                                                                    </div>
                                                                                    <div className="location-details relative">
                                                                                      <DatePicker
                                                                                        className="w-full rounded-lg px-3 py-2 focus:outline-none hotel-city-name"
                                                                                        placeholderText="Select Pickup Time"
                                                                                        selected={selectedTime}
                                                                                        onChange={(time) => {
                                                                                          setSelectedTime(time);
                                                                                          setErrors(prev => ({ ...prev, pickupTime: '' })); // Clear time error
                                                                                        }}
                                                                                        showTimeSelect
                                                                                        showTimeSelectOnly
                                                                                        timeIntervals={15}
                                                                                        timeCaption="Time"
                                                                                        dateFormat="h:mm aa"
                                                                                        onFocus={() =>
                                                                                          setShowTimeDropdown(true)
                                                                                        }
                                                                                        onBlur={() =>
                                                                                          setTimeout(
                                                                                            () => setShowTimeDropdown(false),
                                                                                            200
                                                                                          )
                                                                                        }
                                                                                        open={showTimeDropdown}
                                                                                      />
                                                                                    </div>
                                                                                    {errors.pickupTime && (
                                                           <div className="text-red-500 text-xs mt-1 px-2.5">{errors.pickupTime}</div>
                                                          )}
                                                                                  </div>
                                                                                </from>
                                                                              ) : selectedCabType ===
                                                                                "Round Trip (Outstation)" ? (
                                                                                <><from className="cab-container flex flex-cols ">
                                                                                  <div className="from-cab-group">
                                                                                    <div className="location-headers">
                                                                                      From City
                                                                                    </div>
                                                                                    <div className="location-details relative">
                                                                                      <input
                                                                                        type="text"
                                                                                        className="w-full rounded-lg px-3 py-2 focus:outline-none hotel-city-name"
                                                                                        placeholder="Select Pickup City"
                                                                                        value={selectedCabInput}
                                                                                        onChange={handleInputChangeCab}
                                                                                        onFocus={() => setShowDropdownCab(true)}
                                                                                        onBlur={() => setTimeout(
                                                                                          () => setShowDropdownCab(false),
                                                                                          200
                                                                                        )}
                                                                                        disabled={isLoading} />
                                                
                                                                                      {isLoading && (
                                                                                        <div className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full p-2">
                                                                                          <div className="text-center py-2">
                                                                                            Loading cities...
                                                                                          </div>
                                                                                        </div>
                                                                                      )}
                                                
                                                                                      {error && (
                                                                                        <div className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full p-2">
                                                                                          <div className="text-red-500 text-center py-2">
                                                                                            {error}
                                                                                          </div>
                                                                                        </div>
                                                                                      )}
                                                
                                                                                      {showDropdownCab &&
                                                                                        !isLoading &&
                                                                                        !error &&
                                                                                        filteredCitiesCab.length > 0 && (
                                                                                          <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full max-h-60 overflow-auto shadow-lg">
                                                                                            {filteredCitiesCab.map((city) => (
                                                                                              <li
                                                                                                key={city.city_id}
                                                                                                className="px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                                                                                                onMouseDown={() => handleSelectCity(city)}
                                                                                              >
                                                                                                <div className="font-medium">
                                                                                                  {city.city_name}
                                                                                                </div>
                                                                                                <div className="text-xs text-gray-500">
                                                                                                  {city.google_city_name}
                                                                                                </div>
                                                                                              </li>
                                                                                            ))}
                                                                                          </ul>
                                                                                        )}
                                                
                                                                                      {showDropdownCab &&
                                                                                        !isLoading &&
                                                                                        filteredCitiesCab.length === 0 && (
                                                                                          <div className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full p-2">
                                                                                            <div className="text-center py-2 text-gray-500">
                                                                                              No cities found
                                                                                            </div>
                                                                                          </div>
                                                                                        )}
                                                                                          {errors.pickupCity && (
                                                            <div className="text-red-500 text-xs mt-1 px-2.5">{errors.pickupCity}</div>
                                                          )}
                                                                                    </div>
                                                                                  </div>
                                                                                  <div className="from-cab-group">
                                                                                    <div className="cab-headers">To City</div>
                                                                                    <div className="location-details relative">
                                                                                      <input
                                                                                        type="text"
                                                                                        className="w-full rounded-lg px-3 py-2 focus:outline-none hotel-city-name"
                                                                                        placeholder="Select Drop City"
                                                                                        value={selectedDropCity}
                                                                                        onChange={handleInputChangeDrop}
                                                                                        
                                                                                        onFocus={() => setShowDropdownDrop(true)}
                                                                                        onBlur={() => setTimeout(
                                                                                          () => setShowDropdownDrop(false),
                                                                                          200
                                                                                        )}
                                                                                        disabled={isLoading} />
                                                
                                                                                      {isLoading && (
                                                                                        <div className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full p-2">
                                                                                          <div className="text-center py-2">
                                                                                            Loading cities...
                                                                                          </div>
                                                                                        </div>
                                                                                      )}
                                                
                                                                                      {error && (
                                                                                        <div className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full p-2">
                                                                                          <div className="text-red-500 text-center py-2">
                                                                                            {error}
                                                                                          </div>
                                                                                        </div>
                                                                                      )}
                                                
                                                                                      {showDropdownDrop &&
                                                                                        !isLoading &&
                                                                                        !error &&
                                                                                        filteredCitiesDrop.length > 0 && (
                                                                                          <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full max-h-60 overflow-auto shadow-lg">
                                                                                            {filteredCitiesDrop.map((city) => (
                                                                                              <li
                                                                                                key={city.city_id}
                                                                                                className="px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                                                                                                onMouseDown={() => handleSelectDropCity(city)}
                                                                                              >
                                                                                                <div className="font-medium">
                                                                                                  {city.city_name}
                                                                                                </div>
                                                                                                <div className="text-xs text-gray-500">
                                                                                                  {city.google_city_name}
                                                                                                </div>
                                                                                              </li>
                                                                                            ))}
                                                                                          </ul>
                                                                                        )}
                                                
                                                                                      {showDropdownDrop &&
                                                                                        !isLoading &&
                                                                                        filteredCitiesDrop.length === 0 && (
                                                                                          <div className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full p-2">
                                                                                            <div className="text-center py-2 text-gray-500">
                                                                                              No cities found
                                                                                            </div>
                                                                                          </div>
                                                                                        )}
                                                                                          {errors.dropCity && (
                                                           <div className="text-red-500 text-xs mt-1 px-2.5">{errors.dropCity}</div>
                                                          )}
                                                                                    </div>
                                                                                  
                                                                                  </div>
                                                
                                                                                  <div className="from-cab-group">
                                                                                    <div className="cab-headers">
                                                                                      Pickup Date
                                                                                    </div>
                                                                                    <div className="location-details relative">
                                                                                      <DatePicker
                                                                                        className="w-full rounded-lg px-3 py-2 focus:outline-none hotel-city-name"
                                                                                        placeholderText="Select Pickup Date"
                                                                                        selected={selectedDate} // Your state variable for the selected date
                                                                                        onChange={(date) => {
                                                                                          setSelectedDate(date);
                                                                                          setErrors(prev => ({ ...prev, pickupDate: '' }));
                                                                                          setShowDropdown5(false); // Close the dropdown if needed
                                                                                        }}
                                                                                        dateFormat="dd/MM/yyyy"
                                                                                        minDate={new Date()} // Optional: restrict to future dates
                                                                                        onFocus={() => setShowDropdown5(true)}
                                                                                        onBlur={() => setTimeout(
                                                                                          () => setShowDropdown5(false),
                                                                                          200
                                                                                        )}
                                                                                        open={showDropdown5} // Control visibility
                                                                                        onClickOutside={() => setShowDropdown5(false)} />
                                                                                    </div>
                                                                                    {errors.pickupDate && (
                                                           <div className="text-red-500 text-xs mt-1 px-2.5">{errors.pickupDate}</div>
                                                          )}
                                                                                  </div>
                                                                                  <div className="from-cab-group">
                                                                                    <div className="cab-headers">Drop Date</div>
                                                                                    <div className="location-details relative">
                                                                                      <DatePicker
                                                                                        className="w-full rounded-lg px-3 py-2 focus:outline-none hotel-city-name"
                                                                                        placeholderText="Select Drop Date"
                                                                                        selected={dropDate}
                                                                                        onChange={(date) => {
                                                                                          setDropDate(date);
                                                                                          setErrors(prev => ({ ...prev, dropDate: '' })); // Clear drop date error
                                                                                          setShowDropDatePicker(false);
                                                                                        }}
                                                                                        dateFormat="dd/MM/yyyy"
                                                                                        minDate={selectedDate}
                                                                                        onFocus={() => setShowDropDatePicker(true)}
                                                                                        onBlur={() => setTimeout(
                                                                                          () => setShowDropDatePicker(false),
                                                                                          200
                                                                                        )}
                                                                                        open={showDropDatePicker}
                                                                                        onClickOutside={() => setShowDropDatePicker(false)} />
                                                                                    </div>
                                                                                    {errors.dropDate && (
                                                           <div className="text-red-500 text-xs mt-1 px-2.5">{errors.dropDate}</div>
                                                          )}
                                                                                  </div>
                                                                                  <div className="from-cab-group">
                                                                                    <div className="cab-headers">
                                                                                      Pickup Time
                                                                                    </div>
                                                                                    <div className="location-details relative">
                                                                                      <DatePicker
                                                                                        className="w-full rounded-lg px-3 py-2 focus:outline-none hotel-city-name"
                                                                                        placeholderText="Select Pickup Time"
                                                                                        selected={selectedTime}
                                                                                        onChange={(time) => {
                                                                                          setSelectedTime(time);
                                                                                          setErrors(prev => ({ ...prev, pickupTime: '' })); // Clear time error
                                                                                        }}
                                                                                        showTimeSelect
                                                                                        showTimeSelectOnly
                                                                                        timeIntervals={15}
                                                                                        timeCaption="Time"
                                                                                        dateFormat="h:mm aa"
                                                                                        onFocus={() => setShowTimeDropdown(true)}
                                                                                        onBlur={() => setTimeout(
                                                                                          () => setShowTimeDropdown(false),
                                                                                          200
                                                                                        )}
                                                                                        open={showTimeDropdown} />
                                                                                    </div>
                                                                                    {errors.pickupTime && (
                                                           <div className="text-red-500 text-xs mt-1 px-2.5">{errors.pickupTime}</div>
                                                          )}
                                                                                  </div>
                                                                                </from><>
                                                                                    {roundTripStopsVisible && (
                                                
                                                                                      <div className="text-sm font-medium text-gray-700 my-2 px-2 py-2">
                                                                                        Your Round Trip plan |{" "}
                                                                                        {[selectedCabInput, ...roundTripStopInputs, selectedDropCity,selectedCabInput]
                                                                                          .filter(Boolean)
                                                                                          .map(location => location.split(',')[0].trim()) // Get first part before comma
                                                                                          .join(" → ")}
                                                                                      </div>
                                                                                    )}
                                                                                    {roundTripStopInputs.map((value, index) => (
                                                                                      <div key={index} className="relative mb-2 mt-2">
                                                                                        <input
                                                                                          type="text"
                                                                                          ref={(el) => (roundTripInputRefs.current[index] = el)}
                                                                                          value={value}
                                                                                          onChange={(e) => handleRoundTripInputChange(index, e.target.value)}
                                                                                          placeholder="Enter city name"
                                                                                          className="w-full rounded-lg px-3 py-2 pr-8 text-xs border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                                                        />
                                                                                        <span
                                                                                          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                                                                                          onClick={() => handleRemoveRoundTripStop(index)}
                                                                                        >
                                                                                          ×
                                                                                        </span>
                                                                                      </div>
                                                                                    ))}
                                                
                                                                                    <div className="relative">
                                                                                      <button
                                                                                        className="text-sm text-blue-500 py-2 px-2 cursor-pointer hover:text-blue-700 transition-colors"
                                                                                        onClick={handleAddRoundTripStop}
                                                                                      >
                                                                                        Add More Stops
                                                                                      </button>
                                                                                      {RoundTripcityLimitError && (
                                                                                        <div className="text-xs text-red-500 mt-1">{RoundTripcityLimitError}</div>
                                                                                      )}
                                                                                    </div>
                                                                                  </></>
                                                
                                                
                                                                              ) : selectedCabType ===
                                                                                "MultiCity (Outstation)" ? (
                                                                                <>
                                                                                  <from className="cab-container flex flex-cols ">
                                                                                    <div className="from-cab-group">
                                                                                      <div className="location-headers">
                                                                                        Pickup City
                                                                                      </div>
                                                                                      <div className="location-details relative">
                                                                                        <input
                                                                                          type="text"
                                                                                          className="w-full rounded-lg px-3 py-2 focus:outline-none hotel-city-name"
                                                                                          placeholder="Select Pickup City"
                                                                                          value={selectedCabInput}
                                                                                          onChange={handleInputChangeCab}
                                                                                          onFocus={() =>
                                                                                            setShowDropdownCab(true)
                                                                                          }
                                                                                          onBlur={() =>
                                                                                            setTimeout(
                                                                                              () => setShowDropdownCab(false),
                                                                                              200
                                                                                            )
                                                                                          }
                                                                                          disabled={isLoading}
                                                                                        />
                                                
                                                                                        {isLoading && (
                                                                                          <div className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full p-2">
                                                                                            <div className="text-center py-2">
                                                                                              Loading cities...
                                                                                            </div>
                                                                                          </div>
                                                                                        )}
                                                
                                                                                        {error && (
                                                                                          <div className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full p-2">
                                                                                            <div className="text-red-500 text-center py-2">
                                                                                              {error}
                                                                                            </div>
                                                                                          </div>
                                                                                        )}
                                                
                                                                                        {showDropdownCab &&
                                                                                          !isLoading &&
                                                                                          !error &&
                                                                                          filteredCitiesCab.length > 0 && (
                                                                                            <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full max-h-60 overflow-auto shadow-lg">
                                                                                              {filteredCitiesCab.map((city) => (
                                                                                                <li
                                                                                                  key={city.city_id}
                                                                                                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                                                                                                  onMouseDown={() =>
                                                                                                    handleSelectCity(city)
                                                                                                  }
                                                                                                >
                                                                                                  <div className="font-medium">
                                                                                                    {city.city_name}
                                                                                                  </div>
                                                                                                  <div className="text-xs text-gray-500">
                                                                                                    {city.google_city_name}
                                                                                                  </div>
                                                                                                </li>
                                                                                              ))}
                                                                                            </ul>
                                                                                          )}
                                                
                                                                                        {showDropdownCab &&
                                                                                          !isLoading &&
                                                                                          filteredCitiesCab.length === 0 && (
                                                                                            <div className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full p-2">
                                                                                              <div className="text-center py-2 text-gray-500">
                                                                                                No cities found
                                                                                              </div>
                                                                                            </div>
                                                                                          )}
                                                                                            {errors.pickupCity && (
                                                           <div className="text-red-500 text-xs mt-1 px-2.5">{errors.pickupCity}</div>
                                                          )}
                                                                                      </div>
                                                                                    </div>
                                                
                                                                                    <div className="from-cab-group">
                                                                                      <div className="cab-headers">
                                                                                        Pickup Date
                                                                                      </div>
                                                                                      <div className="location-details relative">
                                                                                        <DatePicker
                                                                                          className="w-full rounded-lg px-3 py-2 focus:outline-none hotel-city-name"
                                                                                          placeholderText="Select Pickup Date"
                                                                                          selected={selectedDate} // Your state variable for the selected date
                                                                                          onChange={(date) => {
                                                                                            setSelectedDate(date);
                                                                                            setErrors(prev => ({ ...prev, pickupDate: '' }));
                                                                                            setShowDropdown5(false); // Close the dropdown if needed
                                                                                          }}
                                                                                          dateFormat="dd/MM/yyyy"
                                                                                          minDate={new Date()} // Optional: restrict to future dates
                                                                                          onFocus={() => setShowDropdown5(true)}
                                                                                          onBlur={() =>
                                                                                            setTimeout(
                                                                                              () => setShowDropdown5(false),
                                                                                              200
                                                                                            )
                                                                                          }
                                                                                          open={showDropdown5} // Control visibility
                                                                                          onClickOutside={() =>
                                                                                            setShowDropdown5(false)
                                                                                          }
                                                                                        />
                                                                                      </div>
                                                                                      {errors.pickupDate && (
                                                           <div className="text-red-500 text-xs mt-1 px-2.5">{errors.pickupDate}</div>
                                                          )}
                                                                                    </div>
                                                                                    <div className="from-cab-group">
                                                                                      <div className="cab-headers">
                                                                                        Drop Date
                                                                                      </div>
                                                                                      <div className="location-details relative">
                                                                                        <DatePicker
                                                                                          className="w-full rounded-lg px-3 py-2 focus:outline-none hotel-city-name"
                                                                                          placeholderText="Select Drop Date"
                                                                                          selected={dropDate}
                                                                                          onChange={(date) => {
                                                                                            setDropDate(date);
                                                                                            setErrors(prev => ({ ...prev, dropDate: '' })); // Clear drop date error
                                                                                            setShowDropDatePicker(false);
                                                                                          }}
                                                                                          dateFormat="dd/MM/yyyy"
                                                                                          minDate={selectedDate}
                                                                                          onFocus={() =>
                                                                                            setShowDropDatePicker(true)
                                                                                          }
                                                                                          onBlur={() =>
                                                                                            setTimeout(
                                                                                              () =>
                                                                                                setShowDropDatePicker(false),
                                                                                              200
                                                                                            )
                                                                                          }
                                                                                          open={showDropDatePicker}
                                                                                          onClickOutside={() =>
                                                                                            setShowDropDatePicker(false)
                                                                                          }
                                                                                        />
                                                                                      </div>
                                                                                      {errors.dropDate && (
                                                           <div className="text-red-500 text-xs mt-1 px-2.5">{errors.dropDate}</div>
                                                          )}
                                                                                    </div>
                                                                                    <div className="from-cab-group">
                                                                                      <div className="cab-headers">
                                                                                        Pickup Time
                                                                                      </div>
                                                                                      <div className="location-details relative">
                                                                                        <DatePicker
                                                                                          className="w-full rounded-lg px-3 py-2 focus:outline-none hotel-city-name"
                                                                                          placeholderText="Select Pickup Time"
                                                                                          selected={selectedTime}
                                                                                          onChange={(time) => {
                                                                                            setSelectedTime(time);
                                                                                            setErrors(prev => ({ ...prev, pickupTime: '' })); // Clear time error
                                                                                          }}
                                                                                          showTimeSelect
                                                                                          showTimeSelectOnly
                                                                                          timeIntervals={15}
                                                                                          timeCaption="Time"
                                                                                          dateFormat="h:mm aa"
                                                                                          onFocus={() =>
                                                                                            setShowTimeDropdown(true)
                                                                                          }
                                                                                          onBlur={() =>
                                                                                            setTimeout(
                                                                                              () => setShowTimeDropdown(false),
                                                                                              200
                                                                                            )
                                                                                          }
                                                                                          open={showTimeDropdown}
                                                                                        />
                                                                                      </div>
                                                                                      {errors.pickupTime && (
                                                           <div className="text-red-500 text-xs mt-1 px-2.5">{errors.pickupTime}</div>
                                                          )}
                                                                                    </div>
                                                                                  </from>
                                                                                  {/* {cabCities && (
                                                
                                                                               
                                                                                  <div className="text-sm font-medium text-gray-700 my-2 px-2 py-2">
                                                                                    Your multi city plan |  {[selectedCabInput, ...cityInputs]
                                                                                      .filter(Boolean)
                                                                                      .map(city => city.split(',')[0].trim())
                                                                                      .join(' → ')}
                                                                                     
                                                                                  </div>
                                                                                   )}
                                                
                                                
                                                                                  {cityInputs.map((value, index) => {
                                                                                    const filteredOptions = allCities.filter((city) =>
                                                                                      `${city.city_name}, ${city.state_name}`.toLowerCase().includes(value.toLowerCase())
                                                                                    );
                                                
                                                                                    return (
                                                                                      <div key={index} className="relative mb-2 mt-2">
                                                                                        <input
                                                                                          type="text"
                                                                                          autoFocus
                                                                                          value={value}
                                                                                          onChange={(e) => handleCityInputChange(index, e.target.value)}
                                                                                          placeholder="Enter city name"
                                                                                          className="w-full rounded-lg px-3 py-2 pr-8 text-xs border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cab_names"
                                                                                        />
                                                                                        <span
                                                                                          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                                                                                          onClick={() => handleRemoveCityInput(index)}
                                                                                        >
                                                                                          ×
                                                                                        </span>
                                                
                                                                                        {value && filteredOptions.length > 0 && value !== filteredOptions[0]?.city_name + ', ' + filteredOptions[0]?.state_name && (
                                                                                          <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-40 overflow-y-auto rounded-md mt-1 shadow-lg">
                                                                                            {filteredOptions.map((city, i) => (
                                                                                              <li
                                                                                                key={i}
                                                                                                onClick={() => {
                                                                                                  handleCityInputChange(index, `${city.city_name}, ${city.state_name}`);
                                                                                                }}
                                                                                                className="px-3 py-1 text-sm cursor-pointer hover:bg-blue-100"
                                                                                              >
                                                                                                {city.city_name}, {city.state_name}
                                                                                              </li>
                                                                                            ))}
                                                                                          </ul>
                                                                                        )}
                                                                                      </div>
                                                                                    );
                                                                                  })}
                                                
                                                
                                                                                  <div className="relative">
                                                                                    <button
                                                                                      className="text-sm text-blue-500 py-2 px-2 cursor-pointer hover:text-blue-700 transition-colors"
                                                                                      onClick={handleAddCityInput}
                                                                                    >
                                                                                      Add More Stops
                                                                                    </button>
                                                                                  </div> */}
                                                                                  {multiStopsVisible && (
                                                                                    <div className="text-sm font-medium text-gray-700 my-2 px-2 py-2">
                                                                                      Your multi city plan |{" "}
                                                                                      {[selectedCabInput, ...stopInputs]
                                                                                        .filter(Boolean)
                                                                                        .map(location => location.split(',')[0].trim()) // Get first part before comma
                                                                                        .join(" → ")}
                                                                                    </div>
                                                                                  )}
                                                
                                                                                  {stopInputs.map((value, index) => (
                                                                                    <div
                                                                                      key={index}
                                                                                      className="relative mb-2 mt-2"
                                                                                    >
                                                                                      <input
                                                                                        type="text"
                                                                                        ref={(el) =>
                                                                                          (inputRefs.current[index] = el)
                                                                                        }
                                                                                        value={value}
                                                                                        onChange={(e) =>
                                                                                          handleInputChangeCIties(
                                                                                            index,
                                                                                            e.target.value
                                                                                          )
                                                                                        }
                                                                                        placeholder="Enter city name"
                                                                                        className="w-full rounded-lg px-3 py-2 pr-8 text-xs border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cab_names"
                                                                                      />
                                                                                      <span
                                                                                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                                                                                        onClick={() => handleRemoveStop(index)}
                                                                                      >
                                                                                        ×
                                                                                      </span>
                                                                                    </div>
                                                                                  ))}
                                                
                                                                                  <div className="relative">
                                                                                    <button
                                                                                      className="text-sm text-blue-500 py-2 px-2 cursor-pointer hover:text-blue-700 transition-colors"
                                                                                      onClick={handleAddStop}
                                                                                    >
                                                                                      Add More Stops
                                                                                    </button>
                                                                                    {cityLimitError && (
                                                                                      <div className="text-xs text-red-500 mt-1">{cityLimitError}</div>
                                                                                    )}
                                                                                  </div>
                                                
                                                                                </>
                                                                              ) : selectedCabType === "Oneway" ? (
                                                                                <from className="cab-container flex flex-cols ">
                                                                                  <div className="from-cab-group">
                                                                                    <div className="location-headers">
                                                                                      Pickup City
                                                                                    </div>
                                                                                    <div className="location-details relative">
                                                                                      <input
                                                                                        type="text"
                                                                                        className="w-full rounded-lg px-3 py-2 focus:outline-none hotel-city-name"
                                                                                        placeholder="Select Pickup City"
                                                                                        value={selectedCabInput}
                                                                                        onChange={handleInputChangeCab}
                                                                                        onFocus={() => setShowDropdownCab(true)}
                                                                                        onBlur={() =>
                                                                                          setTimeout(
                                                                                            () => setShowDropdownCab(false),
                                                                                            200
                                                                                          )
                                                                                        }
                                                                                        disabled={isLoading}
                                                                                      />
                                                
                                                                                      {isLoading && (
                                                                                        <div className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full p-2">
                                                                                          <div className="text-center py-2">
                                                                                            Loading cities...
                                                                                          </div>
                                                                                        </div>
                                                                                      )}
                                                
                                                                                      {error && (
                                                                                        <div className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full p-2">
                                                                                          <div className="text-red-500 text-center py-2">
                                                                                            {error}
                                                                                          </div>
                                                                                        </div>
                                                                                      )}
                                                
                                                                                      {showDropdownCab &&
                                                                                        !isLoading &&
                                                                                        !error &&
                                                                                        filteredCitiesCab.length > 0 && (
                                                                                          <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full max-h-60 overflow-auto shadow-lg">
                                                                                            {filteredCitiesCab.map((city) => (
                                                                                              <li
                                                                                                key={city.city_id}
                                                                                                className="px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                                                                                                onMouseDown={() =>
                                                                                                  handleSelectCity(city)
                                                                                                }
                                                                                              >
                                                                                                <div className="font-medium">
                                                                                                  {city.city_name}
                                                                                                </div>
                                                                                                <div className="text-xs text-gray-500">
                                                                                                  {city.google_city_name}
                                                                                                </div>
                                                                                              </li>
                                                                                            ))}
                                                                                          </ul>
                                                                                        )}
                                                
                                                                                      {showDropdownCab &&
                                                                                        !isLoading &&
                                                                                        filteredCitiesCab.length === 0 && (
                                                                                          <div className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full p-2">
                                                                                            <div className="text-center py-2 text-gray-500">
                                                                                              No cities found
                                                                                            </div>
                                                                                          </div>
                                                                                        )}
                                                                                          {errors.pickupCity && (
                                                           <div className="text-red-500 text-xs mt-1 px-2.5">{errors.pickupCity}</div>
                                                          )}
                                                                                    </div>
                                                                                  </div>
                                                                                  <div className="from-cab-group">
                                                                                    <div className="cab-headers">Drop City</div>
                                                                                    <div className="location-details relative">
                                                                                      <input
                                                                                        type="text"
                                                                                        className="w-full rounded-lg px-3 py-2 focus:outline-none hotel-city-name"
                                                                                        placeholder="Select Drop City"
                                                                                        value={selectedDropCity}
                                                                                        onChange={handleInputChangeDrop}
                                                                                        onFocus={() =>
                                                                                          setShowDropdownDrop(true)
                                                                                        }
                                                                                        onBlur={() =>
                                                                                          setTimeout(
                                                                                            () => setShowDropdownDrop(false),
                                                                                            200
                                                                                          )
                                                                                        }
                                                                                        disabled={isLoading}
                                                                                      />
                                                
                                                                                      {isLoading && (
                                                                                        <div className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full p-2">
                                                                                          <div className="text-center py-2">
                                                                                            Loading cities...
                                                                                          </div>
                                                                                        </div>
                                                                                      )}
                                                
                                                                                      {error && (
                                                                                        <div className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full p-2">
                                                                                          <div className="text-red-500 text-center py-2">
                                                                                            {error}
                                                                                          </div>
                                                                                        </div>
                                                                                      )}
                                                
                                                                                      {showDropdownDrop &&
                                                                                        !isLoading &&
                                                                                        !error &&
                                                                                        filteredCitiesDrop.length > 0 && (
                                                                                          <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full max-h-60 overflow-auto shadow-lg">
                                                                                            {filteredCitiesDrop.map((city) => (
                                                                                              <li
                                                                                                key={city.city_id}
                                                                                                className="px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                                                                                                onMouseDown={() =>
                                                                                                  handleSelectDropCity(city)
                                                                                                }
                                                                                              >
                                                                                                <div className="font-medium">
                                                                                                  {city.city_name}
                                                                                                </div>
                                                                                                <div className="text-xs text-gray-500">
                                                                                                  {city.google_city_name}
                                                                                                </div>
                                                                                              </li>
                                                                                            ))}
                                                                                          </ul>
                                                                                        )}
                                                
                                                                                      {showDropdownDrop &&
                                                                                        !isLoading &&
                                                                                        filteredCitiesDrop.length === 0 && (
                                                                                          <div className="absolute z-10 bg-white border border-gray-300 rounded-lg w-full p-2">
                                                                                            <div className="text-center py-2 text-gray-500">
                                                                                              No cities found
                                                                                            </div>
                                                                                          </div>
                                                                                        )}
                                                                                    </div>
                                                                                    {errors.dropCity && (
                                                           <div className="text-red-500 text-xs mt-1 px-2.5">{errors.dropCity}</div>
                                                          )}
                                                                                  </div>
                                                
                                                                                  <div className="from-cab-group">
                                                                                    <div className="cab-headers">
                                                                                      Pickup Date
                                                                                    </div>
                                                                                    <div className="location-details relative">
                                                                                      <DatePicker
                                                                                        className="w-full rounded-lg px-3 py-2 focus:outline-none hotel-city-name"
                                                                                        placeholderText="Select Pickup Date"
                                                                                        selected={selectedDate} // Your state variable for the selected date
                                                                                        onChange={(date) => {
                                                                                          setSelectedDate(date);
                                                                                          setErrors(prev => ({ ...prev, pickupDate: '' }));
                                                                                          setShowDropdown5(false); // Close the dropdown if needed
                                                                                        }}
                                                                                        dateFormat="dd/MM/yyyy"
                                                                                        minDate={new Date()} // Optional: restrict to future dates
                                                                                        onFocus={() => setShowDropdown5(true)}
                                                                                        onBlur={() =>
                                                                                          setTimeout(
                                                                                            () => setShowDropdown5(false),
                                                                                            200
                                                                                          )
                                                                                        }
                                                                                        open={showDropdown5} // Control visibility
                                                                                        onClickOutside={() =>
                                                                                          setShowDropdown5(false)
                                                                                        }
                                                                                      />
                                                                                    </div>
                                                                                    {errors.pickupDate && (
                                                           <div className="text-red-500 text-xs mt-1 px-2.5">{errors.pickupDate}</div>
                                                          )}
                                                                                  </div>
                                                
                                                                                  <div className="from-cab-group">
                                                                                    <div className="cab-headers">
                                                                                      Pickup Time
                                                                                    </div>
                                                                                    <div className="location-details relative">
                                                                                      <DatePicker
                                                                                        className="w-full rounded-lg px-3 py-2 focus:outline-none hotel-city-name"
                                                                                        placeholderText="Select Pickup Time"
                                                                                        selected={selectedTime}
                                                                                        onChange={(time) => {
                                                                                          setSelectedTime(time);
                                                                                          setErrors(prev => ({ ...prev, pickupTime: '' })); // Clear time error
                                                                                        }}
                                                                                        showTimeSelect
                                                                                        showTimeSelectOnly
                                                                                        timeIntervals={15}
                                                                                        timeCaption="Time"
                                                                                        dateFormat="h:mm aa"
                                                                                        onFocus={() =>
                                                                                          setShowTimeDropdown(true)
                                                                                        }
                                                                                        onBlur={() =>
                                                                                          setTimeout(
                                                                                            () => setShowTimeDropdown(false),
                                                                                            200
                                                                                          )
                                                                                        }
                                                                                        open={showTimeDropdown}
                                                                                      />
                                                                                    </div>
                                                                                    {errors.pickupTime && (
                                                           <div className="text-red-500 text-xs mt-1 px-2.5">{errors.pickupTime}</div>
                                                          )}
                                                                                  </div>
                                                                                </from>
                                                                              ) : null}
                                                                            </div>
                                                                            <button
                                                                              type="submit"
                                                                              className="search-buttonn serach_button"
                                                                            //   style={{
                                                                            //     marginBottom: "-20px",
                                                                            //     marginLeft: "40%",
                                                                            //   }}
                                                                              onClick={handleSearchCab}
                                                                              id="btnSearch"
                                                                            >
                                                                              SEARCH
                                                                            </button>
                                                                          </div>
                                                                        )}
      </div>
  
      
      <div className="content_below">
        <h2>Why choose <span className='Home_Page_Text'>CoTrav?</span></h2>
        <p className='SubTitle'>
        Everything You Need, All in One Place.
        </p>
        <p className="subText">
        Manage every step of your business travel with a <br/> single, seamless platform.
</p>

        <div className="features">
          <div className="feature_box">
            <div className='Home_page_images mb-3'>
            <img src  = "./img/Experience.png" className='w-9 h-9 mb-2'/>
            </div>
            
            <h4 className='Home_Page_Text text-sm'>Experience</h4>
            <p className='text-sm'>With 10 years of team experience, we have built and upgraded a reliable technology.</p>
          </div>
          <div className="feature_box">
          <div className='Home_page_images mb-3'>
            <img src  = "./img/Solution.png" className='w-9 h-9 '/>
            </div>
            <h4 className='Home_Page_Text text-sm'>Solution Provider</h4>
            <p className='text-sm'>With our problem-solving approach, we provide support to you at every step.</p>
          </div>
          <div className="feature_box">
          <div className='Home_page_images mb-3'>
            <img src  = "./img/PAN.png" className='w-9 h-9 mb-2'/>
            </div>
            <h4 className='Home_Page_Text text-sm'>PAN India tie-ups</h4>
            <p className='text-sm'>Providing services to corporates all over India, with partnerships and tie-ups with many stakeholders.</p>
          </div>
          <div className="feature_box">
          <div className='Home_page_images mb-3'>
            <img src  = "./img/Team.png" className='w-9 h-9 mb-2'/>
            </div>
            <h4 className='Home_Page_Text text-sm'>Team Work & Flexibility</h4>
            <p className='text-sm'>With 10 years of team experience, we have built and upgraded a reliable technology.</p>
          </div>
        </div>
       <div className='mt-5'>
        <h2>Services <span className='Home_Page_Text'> We Offer</span></h2>
        <p className="subText">
        We makes corporate travel easy with one powerful platform.<br/>
        Powerful Platform.
</p>
</div>


      </div>
      
    </div>
    <div className="services_section">
  <div className="services_tabs">
    {[
      { name: 'TICKETING', stars: 5 },
      { name: 'HOTEL BOOKINGS', stars: 5 },
      { name: 'CABS', stars: 4 },
      { name: 'LOGISTICS', stars: 5 },
      { name: 'FRRO & VISA CONSULTANCY', stars: 5 },
    ].map((service, idx) => (
      <div key={idx} className="service_tab">
        <h4>{service.name}</h4>
        <div className="stars">
          {'★'.repeat(service.stars)}
          {'☆'.repeat(5 - service.stars)}
        </div>
      </div>
    ))}
  </div>

  {/* <div className="demo_card">
    <div className="demo_content">
      <h3>Simplifying your Business Travel</h3>
      <p>
        Navigating your corporate travel needs,<br />
        from Takeoff to Touchdown.
      </p>
      <button>BOOK A DEMO</button>
    </div>
    <div className="demo_image">
      <img src="./img/Card_Image.png" alt="Business Travel" />
    </div>
  </div> */}
</div>
  </div>
  
  
  );
};

export default NewHome;
