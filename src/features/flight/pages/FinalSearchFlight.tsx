// @ts-nocheck
import React, { Fragment, useEffect, useState, useRef } from "react";
import "../../../styles.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse, parseISO, isValid } from "date-fns";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Nav } from "react-bootstrap";
import CONFIG from "../../../pages/legacy/config";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ArrowBackSharp,
  ArrowForwardIosSharp,
  ArrowForwardSharp,
  Flight,
  FlightLand,
  FlightLandOutlined,
  FlightLandTwoTone,
  FlightSharp,
  FlightTakeoff,
  FlightTakeoffOutlined,
  FlightTakeoffSharp,
  FlightTakeoffTwoTone,
} from "@mui/icons-material";
import useOnlineStatus from "../../../hooks/useOnlineStatus";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import axios from "axios";
dayjs.extend(duration);

const FinalSearchFlight = () => {
  // const base_url = "http://68.183.85.86/api/example/";
  const base_url = `${CONFIG.BASE_URL}`;
  const location = useLocation();
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);
  const hasFetchedRefForCancellation = useRef(false);
  const response = location.state.responseData;
  // console.log("response from taxivaxi", location.state.responseData);
  const isOnline = useOnlineStatus();
  const bookingid = location.state && location.state.responseData?.bookingid;
  const reference_no =
    location.state && location.state.responseData?.reference_no;

  const flight_query_id =
    location.state && location.state.responseData?.flight_query_id;
  const adult = location.state && location.state.responseData?.selectadult;
  // console.log("adult count", adult);
  const child = location.state && location.state.responseData?.selectchild;
  const infant = location.state && location.state.responseData?.selectinfant;
  const cabinclass = location.state && location.state.responseData?.selectclass;
  const fromAirport =
    location.state && location.state.responseData?.searchfromcity;
  const ToAirport = location.state && location.state.responseData?.searchtocity;
  const searchdeparturedate =
    location.state && location.state.responseData?.searchdeparture;
  const searchreturndate =
    location.state && location.state.responseData?.searchreturnDate;
  const triptype = location.state && location.state.responseData?.bookingtype;
  const request_type =
    location.state && location.state.responseData?.requesttype;
  // console.log(request_type);
  const client_name = location.state && location.state.responseData?.clientname;
  const spocname = location.state && location.state.responseData?.spocname;
  const spocemail = location.state && location.state.responseData?.spocemail;
  const ccmail = location.state && location.state.responseData?.ccmail;
  const additional_mails =
    location.state && location.state.responseData?.additionalemail;
  const no_of_seats =
    location.state && location.state.responseData?.no_of_seats;
  const queryId = location.state && location.state.responseData?.query_id;
  // console.log(queryId);
  const hasFetched = useRef(false);
  const contentRef = useRef(null);
  const [loadingg, setLoadingg] = useState(false);
  const [fareloadingg, setFareloadingg] = useState(false);
  const [returnFareLoadingg, setreturnFareLoadingg] = useState(false);
  const [FlightOptions, setFlightOptions] = useState([]);
  const [uniqueAirlines, setUniqueAirlines] = useState([]);
  const [uniqueReturnAirlines, setUniqueReturnAirlines] = useState([]);
  const [sortField, setSortField] = useState("price");

  const [sortOrder, setSortOrder] = useState("asc");

  const [showPrices, setShowPrices] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [showFlightDetails, setShowFlightDetails] = useState(null);
  const [showContent, setshowcontent] = useState("flight_details");

  const [showReturnFlightDetails, setShowReturnFlightDetails] = useState(null);

  const [returnShowContent, setReturnShowContent] = useState("flight_details");
  const [minFare, setMinFare] = useState(0);
  const [minreturnFare, setMinReturnFare] = useState(0);
  const [maxFare, setMaxFare] = useState(100000);
  const [maxreturnFare, setMaxReturnFare] = useState(100000);
  const [priceRange, setPriceRange] = useState([0, 100000]);

  const [FlightFares, setFlightFare] = useState([]);
  const [ReturnFlightFares, setReturnFlightFare] = useState([]);
  const [selectedStops, setSelectedStops] = React.useState(new Set());

  // Return Flights States
  const [returnFlightFares, setReturnFlightFares] = useState({}); // key: flightId

  const [showReturnPrices, setShowReturnPrices] = useState(new Set()); // Set of flightIds

  // Return Filter States
  const [returnSelectedStops, setReturnSelectedStops] = useState(new Set());
  const [returnSelectedDepartures, setReturnSelectedDepartures] = useState([]);
  const [returnSelectedArrivals, setReturnSelectedArrivals] = useState([]);
  const [returnSelectedAirlines, setReturnSelectedAirlines] = useState(
    new Set(),
  );
  const [priceReturnRange, setPriceReturnRange] = useState([0, 100000]);
  const [sortReturnField, setSortReturnField] = useState("price");
  const [sortReturnOrder, setSortReturnOrder] = useState("asc");

  const [selectedDepartures, setSelectedDepartures] = useState([]);
  const [selectedReturnDepartures, setSelectedReturnDepartures] = useState([]);
  const [selectedArrivals, setSelectedArrivals] = useState([]);
  const [selectedReturnArrivals, setSelectedReturnArrivals] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = React.useState(new Set());
  const [selectedReturnAirlines, setSelectedReturnAirlines] = React.useState(
    new Set(),
  );
  const [selectedFlightoption, setSelectedFlightoption] = React.useState([]);
  const [selectedReturnFlightoption, setSelectedReturnFlightoption] =
    React.useState([]);
  const [selectedFlightIds, setSelectedFlightIds] = React.useState([]);
  const [selectedReturnFlightIds, setSelectedReturnFlightIds] = React.useState(
    [],
  );
  const [selectedFares, setSelectedFares] = React.useState([]);
  const [selectedReturnFares, setSelectedReturnFares] = React.useState([]);
  const [selectedFareforbooking, setSelectedFareforbooking] = useState({
    Onward: [],
    Return: [],
  });
  const [selectedReturnFareforbooking, setSelectedReturnFareforbooking] =
    React.useState([]);
  const [flightbookingopen, setFlightBookingOpen] = useState(false);
  const [airports, setAirports] = useState([
    location.state.responseData?.apiairportsdata,
  ]);
  const [inputOrigin, setInputOrigin] = useState(fromAirport);
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputDestination, setInputDestination] = useState(ToAirport);
  const [filteredDestinationAirports, setFilteredDestinationAirports] =
    useState([]);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastActionWasSwap, setLastActionWasSwap] = useState(false);
  const [adultCount, setAdultCount] = useState(adult);
  const [childCount, setChildCount] = useState(child);
  const [infantCount, setInfantCount] = useState(infant);
  const [cabinClass, setCabinClass] = useState(cabinclass);
  const [journeytype, setjourneytype] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  const [PassengerDetails, setPassengerDetails] = useState([]);
  const [shareoptionrequest, setshareoptionsrequest] = useState([]);
  const [origincountrycode, setorigincountrycode] = useState("");
  const [destinationcountrycode, setdestinationcountrycode] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [FLightType, setFlightType] = useState(
    location.state.responseData?.flight_type,
  );
  const [FlightReturnOptions, setFlightReturnOptions] = useState([]);
  const [AirportData, setAirportData] = useState([]);
  const [showPolicyPopup, setShowPolicyPopup] = useState(false);
  const [selectedFarePolicy, setSelectedFarePolicy] = useState(null);
  const [selectedFareForPopup, setSelectedFareForPopup] = useState(null);
  useEffect(() => {
    const loadAirports = async () => {
      const Airportlist = localStorage.getItem("apiairportsdata");

      if (Airportlist) {
        // If data exists in localStorage, parse and set it
        const AirportData = JSON.parse(Airportlist);
        setAirportData(AirportData);
      } else {
        // If not, fetch from API
        try {
          const response = await axios.get(
            "https://selfbooking.taxivaxi.com/api/airports",
          );
          setAirportData(response.data);
          // console.log(response.data);
          localStorage.setItem(
            "apiairportsdata",
            JSON.stringify(response.data),
          ); // Save to localStorage
        } catch (error) {
          // console.error("Error fetching airport data:", error);
        }
      }
    };

    loadAirports();
  }, []);
  const normalizedAdditionalEmails = Array.isArray(additional_mails)
    ? additional_mails
    : [additional_mails];
  //   const normalizedSpocEmails = React.useMemo(() => {
  //   if (!spocemail) return [];

  //   const emails = Array.isArray(spocemail)
  //     ? spocemail.flatMap(e => e.split(","))
  //     : spocemail.split(",");

  //   return [...new Set(
  //     emails
  //       .map(e => e.trim())
  //       .filter(Boolean)
  //   )];
  // }, [ccmail]);
  const normalizedSpocEmails = React.useMemo(() => {
    if (!spocemail) return [];

    const emails = Array.isArray(spocemail)
      ? spocemail.flatMap((e) => e.split(","))
      : spocemail.split(",");

    return [...new Set(emails.map((e) => e.trim()).filter(Boolean))];
  }, [spocemail]);

  // const normalizedSpocEmails = Array.isArray(spocemail)
  //   ? spocemail.flatMap((email) => email.split(",").map((e) => e.trim()))
  //   : spocemail
  //   ? spocemail.split(",").map((e) => e.trim())
  //   : [];

  const [spocEmails, setSpocEmails] = useState(normalizedSpocEmails);
  const normalizedCCEmails = React.useMemo(() => {
    if (!ccmail) return [];

    const emails = Array.isArray(ccmail)
      ? ccmail.flatMap((e) => e.split(","))
      : ccmail.split(",");

    return [
      ...new Set(
        emails
          .map((e) => e.trim())
          .filter(Boolean)
          .filter((email) => !normalizedSpocEmails.includes(email)), // 🔥 SPOC has priority
      ),
    ];
  }, [ccmail, normalizedSpocEmails]);

  const [ccEmails, setCCEmails] = useState(normalizedCCEmails);

  const [ccEmailInput, setCCEmailInput] = useState("");

  const [spocEmailInput, setSpocEmailInput] = useState("");

  const [additionalEmails, setAdditionalEmails] = useState(
    normalizedAdditionalEmails,
  );
  const [additionalEmailInput, setAdditionalEmailInput] = useState("");
  const [remark, setRemark] = useState("");
  const TIME_SLOTS = [
    { key: "before6AM", label: "Before 6 AM", img: "morning_inactive.png" },
    { key: "6AMto12PM", label: "6 AM - 12 PM", img: "noon_inactive.png" },
    { key: "12PMto6PM", label: "12 PM - 6 PM", img: "evening_inactive.png" },
    { key: "after6PM", label: "After 6 PM", img: "night_inactive.png" },
  ];

  function convertDateFormat(dateStr) {
    if (!dateStr) return "";
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/").map(Number);
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
        2,
        "0",
      )}T00:00:00.000+05:30`;
    }
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return `${dateStr}T00:00:00.000+05:30`;
    }
    // Handle fallback
    // console.warn("Unrecognized date format:", dateStr);
    return "";
  }

  const DepartureDate = convertDateFormat(searchdeparturedate);
  const ReturnDate = convertDateFormat(searchreturndate);

  const [inputValue, setInputValue] = useState({
    bookingType: triptype === "One Way" ? "1" : "2",
    originAirport: "",
    destinationAriport: "",
    departureDate: DepartureDate,
    adult: "",
    child: "",
    infant: "",
    classType: "",
    returnDate: ReturnDate,
  });

  //Generate keys

  const Keyfetch = async () => {
    const requestData = {
      ADT: inputValue.adult ? Number(inputValue.adult) : Number(adult),
      CNN: inputValue.child ? Number(inputValue.child) : Number(child),
      INF: inputValue.infant ? Number(inputValue.infant) : Number(infant),
    };
    try {
      setLoadingg(true);
      const response = await fetch(`${base_url}generateKeys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const Data = await response.json();
      if (Data.status) {
        const responseData = Data.passengerDetails;
        // // console.log(responseData)
        setPassengerDetails(responseData);
      }
    } catch (error) {
      // setLoadingg(false)
      console.error("Fetch error:", error.message);
    }
  };

  useEffect(() => {
    if (!hasFetchedRef.current) {
      Keyfetch();
      // fetchCancellationForUapiFare();
      hasFetchedRef.current = true;
    }
  }, []);
  //Ariport optins api
  useEffect(() => {
    Cookies.set("cookiesData", JSON.stringify(inputValue), { expires: 7 });
  }, []);

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await fetch(`${base_url}getAutocompleteAirports`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const formatted = data.response.map((Airports) => ({
          value: `${Airports.airport_iata_code}`,
          label: ` ${Airports.airport_municipality} (${Airports.airport_iata_code})`,
          airportName: `${Airports.airport_name}`,
          countrycode: `${Airports.airport_iso_country}`,
        }));
        setAirports(formatted);
      } catch (error) {
        // console.error('Fetch error:', error.message);
      }
    };

    fetchAirports();
  }, []);

  //Swap funtion
  const swapOriginAndDestination = () => {
    if (lastActionWasSwap) {
      const destinationCode = inputDestination.match(/\(([^)]+)\)/);
      const destination = destinationCode ? destinationCode[1] : null;
      const originCode = inputOrigin.match(/\(([^)]+)\)/);
      const Origin = originCode ? originCode[1] : null;
      setInputValue({
        ...inputValue,
        originAirport: destination,
        destinationAriport: Origin,
      });
      setInputOrigin(inputDestination);
      setInputDestination(inputOrigin);
    } else {
      const temp = inputOrigin;
      setInputOrigin(inputDestination);
      setInputDestination(temp);
      const destinationCode = inputDestination.match(/\(([^)]+)\)/);
      const destination = destinationCode ? destinationCode[1] : null;
      const originCode = inputOrigin.match(/\(([^)]+)\)/);
      const Origin = originCode ? originCode[1] : null;
      setInputValue({
        ...inputValue,
        originAirport: destination,
        destinationAriport: Origin,
      });
    }
    setLastActionWasSwap(!lastActionWasSwap);
  };
  //Booking Type
  const handleBookingtype = (e) => {
    const value = e.target.value;
    setInputValue({ ...inputValue, bookingType: value });
    // console.log("booking type", value);
  };

  //Origin Airports
  const handleChange = (e) => {
    const value = e.target.value;
    setInputOrigin(value);
    if (value.trim() === "") {
      setFilteredAirports([]);
      setShowDropdown(false);
      return;
    }

    const filtered = airports.filter(
      (airport) =>
        airport.label.toLowerCase().includes(value.toLowerCase()) ||
        airport.airportName?.toLowerCase().includes(value.toLowerCase()),
    );

    setFilteredAirports(filtered);
    setShowDropdown(true);
  };

  const handleSelect = (airport) => {
    setInputOrigin(`${airport.label} ${airport.airportName}`);
    setShowDropdown(false);
    setInputValue({ ...inputValue, originAirport: `${airport.value}` });
    setIsChanged(true);
    setorigincountrycode(`${airport.countrycode}`);
  };
  //Destination Airport
  const handledesinationChange = (e) => {
    const value = e.target.value;
    setInputDestination(value);

    if (value.trim() === "") {
      setFilteredDestinationAirports([]);
      setShowDestinationDropdown(false);
      return;
    }

    const filtered = airports.filter(
      (airport) =>
        airport.label.toLowerCase().includes(value.toLowerCase()) ||
        airport.airportName?.toLowerCase().includes(value.toLowerCase()),
    );

    setFilteredDestinationAirports(filtered);
    setShowDestinationDropdown(true);
  };

  const handledestinationSelect = (airport) => {
    // // console.log(airport)
    setInputDestination(`${airport.label} ${airport.airportName}`);
    setShowDestinationDropdown(false);
    setInputValue({ ...inputValue, destinationAriport: `${airport.value}` });
    setIsChanged(true);
    setdestinationcountrycode(`${airport.countrycode}`);
  };

  //departure date

  const handleDepartureDateChange = (date) => {
    setInputValue({ ...inputValue, departureDate: date });
    setIsChanged(true);
  };
  //return date

  const handleReturnDateChange = (date) => {
    setInputValue({ ...inputValue, returnDate: date });
    setIsChanged(true);
  };
  //Passenger data
  const handleToggle = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
    setIsChanged(true);
  };

  const handleAdult = (value) => {
    setAdultCount(value);
    setInputValue({ ...inputValue, adult: value });
  };

  const handleChild = (value) => {
    setChildCount(value);
    setInputValue({ ...inputValue, child: value });
  };

  const handleInfant = (value) => {
    setInfantCount(value);
    setInputValue({ ...inputValue, infant: value });
  };

  //Cabin class
  const handleClasstype = (value) => {
    setCabinClass(value);
    setInputValue({ ...inputValue, classType: value });
  };
  const handleBlur = () => {
    if (isChanged) {
      toast.dismiss();
      toast.info("Please click the search button to apply changes.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // ********************************************************Flightoptions**************************************************************************************

  //separte airport code
  function extractAirportCode(str) {
    const match = str.match(/\(([^)]+)\)/);
    return match ? match[1] : "";
  }
  //extractonly date
  function extractDate(dateInput) {
    const date = new Date(dateInput);

    if (isNaN(date.getTime())) {
      // Invalid date handling
      return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // month is 0-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // Price Filter
  const getFareBounds = (options) => {
    // // console.log('Fares', options)
    let baseFares = [];

    options.forEach((flight) => {
      // // console.log('each fare',flight)
      baseFares.push(Number(flight.prices.TotalPrice));
    });
    const min = Math.min(...baseFares);
    const max = Math.max(...baseFares);
    return { minFare: min, maxFare: max };
  };

  const fetchData = async () => {
    const response = await axios.get(
      "https://selfbooking.taxivaxi.com/api/airports",
    );
    const AirportData = response.data;
    // // console.log(AirportData)
    const origincode = inputValue.originAirport
      ? inputValue.originAirport
      : extractAirportCode(fromAirport);
    const airportOrigin = AirportData.find(
      (airport) => airport.airport_iata_code === origincode,
    );
    const OriginCountryCode = airportOrigin?.airport_iso_country;
    const destcode = inputValue.destinationAriport
      ? inputValue.destinationAriport
      : extractAirportCode(ToAirport);

    const airportdest = AirportData.find(
      (airport) => airport.airport_iata_code === destcode,
    );

    const destinationCountryCode = airportdest?.airport_iso_country;
    let FlightType = "";
    if (destinationCountryCode == "IN" && OriginCountryCode == "IN") {
      setFlightType("domestic");
      FlightType = "domestic";
    } else {
      setFlightType("International");
      FlightType = "International";
    }
    let journeytype = "";
    const url = `${base_url}searchFlights_new`;
    if (triptype === "One Way") {
      journeytype = 1;
    } else {
      journeytype = 2;
    }
    const requestData = {
      origin: inputValue.originAirport
        ? inputValue.originAirport
        : extractAirportCode(fromAirport),
      destination: inputValue.destinationAriport
        ? inputValue.destinationAriport
        : extractAirportCode(ToAirport),
      departureDate: inputValue.departureDate
        ? extractDate(inputValue.departureDate)
        : extractDate(DepartureDate),
      adultCount: inputValue.adult ? Number(inputValue.adult) : Number(adult),
      childCount: inputValue.child ? Number(inputValue.child) : Number(child),
      infantCount: inputValue.infant
        ? Number(inputValue.infant)
        : Number(infant),
      cabinClass: inputValue.classType ? inputValue.classType : cabinClass,
      returnDate: inputValue.returnDate
        ? extractDate(inputValue.returnDate)
        : extractDate(ReturnDate),
      JourneyType: inputValue.bookingType
        ? Number(inputValue.bookingType)
        : journeytype,
      flighttype: FLightType ? FLightType : FlightType,
    };
    // console.log(requestData);
    try {
      setLoadingg(true);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          // origin :"*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (data.status === true) {
        const journey = data.data.JourneyType;
        setjourneytype(journey);
        const AvailableOptions = data.data.Onward;
        setFlightOptions(AvailableOptions);
        // // console.log('Available flights', AvailableOptions)
        //Airline Options
        const airlineMap = new Map();
        AvailableOptions.forEach((item) => {
          const segments = item.flight?.segments || [];
          segments.forEach((segment) => {
            const name = segment?.Airline?.AirlineName;
            const logo = segment?.Airline?.AirlineLogo;
            if (name && !airlineMap.has(name)) {
              airlineMap.set(name, logo);
            }
          });
        });

        const result = Array.from(airlineMap.entries()).map(([name, logo]) => ({
          name,
          logo,
        }));

        setUniqueAirlines(result);

        //price filter
        const { minFare, maxFare } = getFareBounds(AvailableOptions);
        setMinFare(minFare);
        setMaxFare(maxFare);
        setPriceRange([minFare, maxFare]);

        // Return Data
        if (data.data.Return) {
          const AvailableOptionsReturn = data.data.Return;
          setFlightReturnOptions(AvailableOptionsReturn);

          const returnairlineMap = new Map();
          AvailableOptionsReturn.forEach((item) => {
            const segments = item.flight?.segments || [];
            segments.forEach((segment) => {
              const name = segment?.Airline?.AirlineName;
              const logo = segment?.Airline?.AirlineLogo;
              if (name && !returnairlineMap.has(name)) {
                returnairlineMap.set(name, logo);
              }
            });
          });
          // // console.log('return flight:', AvailableOptionsReturn.length);
          const result = Array.from(returnairlineMap.entries()).map(
            ([name, logo]) => ({
              name,
              logo,
            }),
          );

          setUniqueReturnAirlines(result);

          const { minFare, maxFare } = getFareBounds(AvailableOptionsReturn);
          setMinReturnFare(minFare);
          setMaxReturnFare(maxFare);
          setPriceReturnRange([minFare, maxFare]);
        }

        setLoadingg(false);
      } else if (data.status === false) {
        setLoadingg(false);
        Swal.fire({
          title: "Error",
          text: data.message,
          iconHtml: '<i class="fa fa-exclamation" aria-hidden="true"></i>',
          confirmButtonText: "Try Again",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            // Otherwise, go to home page
            window.location.href = "/";
          }
        });
      }
      else{
        setLoadingg(false);
        Swal.fire({
          title: "Error",
          text: "Something went wrong. Please try again later.",
          iconHtml: '<i class="fa fa-exclamation" aria-hidden="true"></i>',
          confirmButtonText: "Try Again",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            // Otherwise, go to home page
            window.location.href = "/";
          }
        });
      }
      setLoadingg(false);
    } catch (error) {
      setLoadingg(false);
        Swal.fire({
          title: "Error",
          text: "Something went wrong. Please try again later.",
          iconHtml: '<i class="fa fa-exclamation" aria-hidden="true"></i>',
          confirmButtonText: "Try Again",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            // Otherwise, go to home page
            window.location.href = "/";
          }
        });
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchData();
      hasFetched.current = true;
    }
  }, []);

  // Function to handle showing policy popup
  const handleShowPolicy = (flightData, fare, flightId, basefare) => {
    

    // Get the policy key
    const policyKey = `${flightId}_${fare.type}`;
    const policyData = cancellationPolicies[policyKey];
  
    // Store the selected fare data for popup
    setSelectedFareForPopup({
      flightData,
      fare,
      flightId,
      basefare,
      airlineName: flightData?.segments?.[0]?.Airline?.AirlineName,
      flightNumber: flightData?.segments?.[0]?.Airline?.FlightNumber,
      airlineLogo: flightData?.segments?.[0]?.Airline?.AirlineLogo,
      originCity: flightData?.originAirport?.CityName,
      destinationCity: flightData?.destinationAirport?.CityName,
      depTime: flightData?.depTime,
      arrTime: flightData?.arrTime,
    });

    setSelectedFarePolicy(policyData);

    // Show the popup
    setShowPolicyPopup(true);
  };
  // ----------------------------------Flight fares api--------------------------------
  //Onward flights
  const getFlightUniqueId = (flight) => {
    if (!flight) return "";
    return `${flight?.originAirport?.CityCode}-${flight?.destinationAirport?.CityCode}-${flight?.depTime}-${flight?.arrTime}-${flight?.segments?.[0]?.Airline?.FlightNumber}`;
  };
  // 2. flightFares ko ID-based banao
  const [flightFares, setFlightFares] = useState({}); // key: flightId, value: fareData
  // Add this new state
  const [allFaresList, setAllFaresList] = useState({});
  // 3. Getfares function update karo
  const Getfares = async (data, flightId) => {
    const requestData = {
      unique_id: data.unique_id,
      trace_price: data.trace_price,
      trace_search: data.trace_search,
      trace_option: data.trace_option,
      passengerDetails: PassengerDetails,
    };

    try {
      setFareloadingg((prev) => ({ ...prev, [flightId]: true }));

      const response = await fetch(`${base_url}searchPrices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const Data = await response.json();
      const fareData = Data.data;

      setFlightFares((prev) => ({
        ...prev,
        [flightId]: fareData,
      }));

      // Get flight info from fareData
      const flightInfo = {
        originCity: fareData.flight?.originAirport?.CityName || "",
        destinationCity: fareData.flight?.destinationAirport?.CityName || "",
        originCode: fareData.flight?.originAirport?.AirportCode || "",
        destinationCode: fareData.flight?.destinationAirport?.AirportCode || "",
        airlineName: fareData.flight?.segments?.[0]?.Airline?.AirlineName || "",
      };

      console.log("Fare data received for flightId:", { fareData, flightInfo });

      // AFTER getting fares, fetch cancellation policies for each fare
      if (fareData) {
        // Combine all fares from uapi and tbo with additional info
        const allFares = [
          ...(fareData.uapi_fares || []).map((fare) => ({
            ...fare,
            from: "Uapi",
            type: fare.SupplierFareClass || fare.FareType || "",
            Resultindex: fare.ResultIndex,
            TraceId: fare.trace_id,
            // Add flight info to each fare
            ...flightInfo,
          })),
          ...(fareData.tbo_fares || []).map((fare) => ({
            ...fare,
            from: "Tbo",
            type: fare.SupplierFareClass || "Regular Fare",
            Resultindex: fare.ResultIndex,
            TraceId: fare.trace_id,
            // Add flight info to each fare
            ...flightInfo,
          })),
        ];

        // Store all fares with their info in state for later use
        setAllFaresList((prev) => ({
          ...prev,
          [flightId]: allFares,
        }));

        // Fetch policies for all unique fares
        for (const fare of allFares) {
          const resultIndex = fare.Resultindex || fare.ResultIndex || fare.key;
          if (resultIndex) {
            // ✅ CORRECT: Use fare which already has all flightInfo
            fetchCancellationPolicy(fare, flightId, resultIndex);
          }
        }
      }

      setFareloadingg((prev) => ({ ...prev, [flightId]: false }));
    } catch (error) {
      console.error("Error in Getfares:", error);
      setFareloadingg((prev) => ({ ...prev, [flightId]: false }));
    }
  };
  // console.log("selectedFarePolicy:", selectedFarePolicy);
  // 4. showPrices ko bhi ID-based banao

  const toggleShowPrices = (flightId) => {
    setShowPrices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(flightId)) {
        newSet.delete(flightId);
      } else {
        newSet.add(flightId);
      }
      return newSet;
    });
  };

  const toggleShowReturnPrices = (flightId) => {
    setShowReturnPrices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(flightId)) {
        newSet.delete(flightId);
      } else {
        newSet.add(flightId);
      }
      return newSet;
    });
  };
  // Selected flight options

  const handleFareToggle = async (flightData, fare, flightId, basefare) => {
    // console.log("handleFareToggle called with:", {
    //   flightId,
    //   fareType: fare.type,
    // });
    // Check if this is a selection or deselection
    const isAlreadySelected = selectedFares.some(
      (f) => f.flightId === flightId && f.fareType === fare.type,
    );

    if (isAlreadySelected) {
      // DESELECTION: Remove fare without fetching policy
      setSelectedFares((prevFares) =>
        prevFares.filter(
          (f) => !(f.flightId === flightId && f.fareType === fare.type),
        ),
      );

      setSelectedFlightoption((prevOptions) =>
        prevOptions.filter(
          (item) =>
            !(item.flightId === flightId && item.fare.type === fare.type),
        ),
      );

      // Check if there are any other fares selected for this flight
      const hasOtherFares = selectedFares.some(
        (f) => f.flightId === flightId && f.fareType !== fare.type,
      );

      if (!hasOtherFares) {
        setSelectedFlightIds((prevIds) =>
          prevIds.filter((id) => id !== flightId),
        );
      }

      return;
    }

    // SELECTION: Fetch cancellation policy first
    // IMPORTANT: Get the resultIndex from the fare object
    const resultIndex =
      fare.ResultIndex || fare.result_index || fare.key || fare.Resultindex;

    if (!resultIndex) {
      console.error("No resultIndex found for fare:", fare);
      // Optionally show an alert to user
      return;
    }

    // Fetch cancellation policy with all three parameters
    const policyData = await fetchCancellationPolicy(
      fare,
      flightId,
      resultIndex,
    );

    // First update selectedFares
    setSelectedFares((prevFares) => {
      // Double-check it wasn't added while we were fetching
      const exists = prevFares.some(
        (f) => f.flightId === flightId && f.fareType === fare.type,
      );

      if (exists) return prevFares;

      return [
        ...prevFares,
        {
          flightId,
          fareType: fare.type,
          policy: policyData,
          resultIndex: resultIndex,
        },
      ];
    });

    // Then update selectedFlightoption
    setSelectedFlightoption((prevOptions) => {
      // Double-check it wasn't added while we were fetching
      const exists = prevOptions.some(
        (item) => item.flightId === flightId && item.fare.type === fare.type,
      );

      if (exists) return prevOptions;

      console.log("Adding new option with policy:", policyData); // Debug log

      return [
        ...prevOptions,
        {
          flightId: flightId,
          flight: flightData,
          fare: fare,
          base_fare: basefare,
          flightData: flightData,
          airlineName: flightData?.segments?.[0]?.Airline?.AirlineName,
          flightNumber: flightData?.segments?.[0]?.Airline?.FlightNumber,
          airlineLogo: flightData?.segments?.[0]?.Airline?.AirlineLogo,
          depTime: flightData?.depTime,
          arrTime: flightData?.arrTime,
          originCity: flightData?.originAirport?.CityName,
          destinationCity: flightData?.destinationAirport?.CityName,
          cancellation_policy: policyData,
          result_index: resultIndex,
        },
      ];
    });

    // Finally update selectedFlightIds
    setSelectedFlightIds((prevIds) => {
      if (!prevIds.includes(flightId)) {
        return [...prevIds, flightId];
      }
      return prevIds;
    });
  };
  const groupedFlights = React.useMemo(() => {
    return selectedFlightoption.reduce((acc, curr) => {
      if (!acc[curr.flightId]) {
        acc[curr.flightId] = {
          flightData: curr.flightData,
          fares: [],
        };
      }
      acc[curr.flightId].fares.push(curr.fare);
      return acc;
    }, {});
  }, [selectedFlightoption]);
  // console.log('grouped flights', groupedFlights);
  // Remove selected Flight option
  const handleRemoveFare = (flightId, fareType) => {
    setSelectedFlightoption((prev) =>
      prev.filter(
        (item) => !(item.flightId === flightId && item.fare.type === fareType),
      ),
    );

    setSelectedFares((prev) =>
      prev.filter((f) => !(f.flightId === flightId && f.fareType === fareType)),
    );

    setSelectedFlightIds((prev) => {
      const hasOtherFares = selectedFares.some(
        (f) => f.flightId === flightId && f.fareType !== fareType,
      );
      if (!hasOtherFares) {
        return prev.filter((id) => id !== flightId);
      }
      return prev;
    });
  };

  //Return Flights
  const GetreturnFares = async (data, flightId) => {
    // Add flightId parameter
    const requestData = {
      unique_id: data.unique_id,
      trace_price: data.trace_price,
      trace_search: data.trace_search,
      trace_option: data.trace_option,
      passengerDetails: PassengerDetails,
    };

    try {
      setreturnFareLoadingg((prev) => ({ ...prev, [flightId]: true })); // Set loading for specific flight

      const response = await fetch(`${base_url}searchPrices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const Data = await response.json();
      const fareData = Data.data;

      setReturnFlightFares((prev) => ({
        ...prev,
        [flightId]: fareData,
      }));

      // Get flight info from fareData
      const flightInfo = {
        originCity: fareData.flight?.originAirport?.CityName || "",
        destinationCity: fareData.flight?.destinationAirport?.CityName || "",
        originCode: fareData.flight?.originAirport?.AirportCode || "",
        destinationCode: fareData.flight?.destinationAirport?.AirportCode || "",
        airlineName: fareData.flight?.segments?.[0]?.Airline?.AirlineName || "",
      };

      console.log("Fare data received for flightId:", { fareData, flightInfo });

      // AFTER getting fares, fetch cancellation policies for each fare
      if (fareData) {
        // Combine all fares from uapi and tbo with additional info
        const allFares = [
          ...(fareData.uapi_fares || []).map((fare) => ({
            ...fare,
            from: "Uapi",
            type: fare.SupplierFareClass || fare.FareType || "",
            Resultindex: fare.ResultIndex,
            TraceId: fare.trace_id,
            // Add flight info to each fare
            ...flightInfo,
          })),
          ...(fareData.tbo_fares || []).map((fare) => ({
            ...fare,
            from: "Tbo",
            type: fare.SupplierFareClass || "Regular Fare",
            Resultindex: fare.ResultIndex,
            TraceId: fare.trace_id,
            // Add flight info to each fare
            ...flightInfo,
          })),
        ];

        // Fetch policies for all unique fares
        for (const fare of allFares) {
          const resultIndex = fare.Resultindex || fare.ResultIndex || fare.key;
          if (resultIndex) {
            // Don't await, fetch in background
            fetchCancellationPolicy(fare, flightId, resultIndex);
          }
        }
      }

      setreturnFareLoadingg((prev) => ({ ...prev, [flightId]: false }));
    } catch {
      setreturnFareLoadingg((prev) => ({ ...prev, [flightId]: false }));
    }
  };
  // Selected flight options
  const handleReturnFareToggle = (flightData, fare, flightId, basefare) => {
    setSelectedReturnFares((prevFares) => {
      const isAlreadySelected = prevFares.some(
        (f) => f.flightId === flightId && f.fareType === fare.type,
      );

      let updatedFares;
      if (isAlreadySelected) {
        updatedFares = prevFares.filter(
          (f) => !(f.flightId === flightId && f.fareType === fare.type),
        );
      } else {
        updatedFares = [...prevFares, { flightId, fareType: fare.type }];
      }

      setSelectedReturnFlightIds((prevIds) => {
        const hasOtherFares = updatedFares.some((f) => f.flightId === flightId);
        if (!hasOtherFares) {
          return prevIds.filter((id) => id !== flightId);
        } else if (!prevIds.includes(flightId)) {
          return [...prevIds, flightId];
        }
        return prevIds;
      });

      return updatedFares;
    });

    setSelectedReturnFlightoption((prevOptions) => {
      const isAlreadySelected = prevOptions.some(
        (item) => item.flightId === flightId && item.fare.type === fare.type,
      );

      if (isAlreadySelected) {
        return prevOptions.filter(
          (item) =>
            !(item.flightId === flightId && item.fare.type === fare.type),
        );
      } else {
        return [
          ...prevOptions,
          {
            flightId: flightId,
            flight: flightData,
            fare: fare,
            base_fare: basefare,
            flightData: flightData,
            airlineName: flightData?.segments?.[0]?.Airline?.AirlineName,
            flightNumber: flightData?.segments?.[0]?.Airline?.FlightNumber,
            airlineLogo: flightData?.segments?.[0]?.Airline?.AirlineLogo,
            depTime: flightData?.depTime,
            arrTime: flightData?.arrTime,
            originCity: flightData?.originAirport?.CityName,
            destinationCity: flightData?.destinationAirport?.CityName,
          },
        ];
      }
    });
  };
  const groupedReturnFlights = React.useMemo(() => {
    return selectedReturnFlightoption.reduce((acc, curr) => {
      if (!acc[curr.flightId]) {
        acc[curr.flightId] = {
          flightData: curr.flightData,
          fares: [],
        };
      }
      acc[curr.flightId].fares.push(curr.fare);
      return acc;
    }, {});
  }, [selectedReturnFlightoption]);
  // Remove selected Flight option
  const handleRemoveReturnFare = (flightId, fareType) => {
    setSelectedReturnFlightoption((prev) =>
      prev.filter(
        (item) => !(item.flightId === flightId && item.fare.type === fareType),
      ),
    );

    setSelectedReturnFares((prev) =>
      prev.filter((f) => !(f.flightId === flightId && f.fareType === fareType)),
    );

    setSelectedReturnFlightIds((prev) => {
      const hasOtherFares = selectedReturnFares.some(
        (f) => f.flightId === flightId && f.fareType !== fareType,
      );
      if (!hasOtherFares) {
        return prev.filter((id) => id !== flightId);
      }
      return prev;
    });
  };

  // ------------------------------------------------ Onward Fliter--------------------------------------------------------
  //Fliter stop
  const toggleStop = (stop) => {
    setSelectedStops((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stop)) {
        newSet.delete(stop);
      } else {
        newSet.add(stop);
      }
      return newSet;
    });
    setSelectedFlightIds([]);
    setSelectedFares([]);
    setShowPrices(new Set());
  };
  // Airline Filter
  const toggleAirline = (airlineName) => {
    setSelectedAirlines((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(airlineName)) {
        newSet.delete(airlineName);
      } else {
        newSet.add(airlineName);
      }
      // onChange(newSet); // Notify parent about change
      return newSet;
    });
    setSelectedFlightIds([]);
    setSelectedFares([]);
    setShowPrices(new Set());
  };

  const toggleSelection = (slotKey, isDeparture) => {
    const updater = isDeparture ? setSelectedDepartures : setSelectedArrivals;
    const current = isDeparture ? selectedDepartures : selectedArrivals;
    updater(
      current.includes(slotKey)
        ? current.filter((key) => key !== slotKey)
        : [...current, slotKey],
    );
    setSelectedFlightIds([]);
    setSelectedFares([]);
    setShowPrices(new Set());
  };

  const getTimeSlot = (hour) => {
    if (hour < 6) return "before6AM";
    if (hour < 12) return "6AMto12PM";
    if (hour < 18) return "12PMto6PM";
    return "after6PM";
  };

  const filteredFlights = React.useMemo(() => {
    if (!FlightOptions?.length) return [];

    return FlightOptions.filter((response) => {
      const flight = response?.flight;
      if (!flight) return false;

      // Stops filter
      const stopsCount = flight.segments?.length - 1;
      if (selectedStops.size > 0 && !selectedStops.has(stopsCount))
        return false;

      // Departure Time filter
      const depTime = new Date(flight?.depTime);
      const depSlot = getTimeSlot(depTime.getHours());
      if (
        selectedDepartures.length > 0 &&
        !selectedDepartures.includes(depSlot)
      )
        return false;

      // Arrival Time filter
      const arrTime = new Date(flight?.arrTime);
      const arrSlot = getTimeSlot(arrTime.getHours());
      if (selectedArrivals.length > 0 && !selectedArrivals.includes(arrSlot))
        return false;

      // Airlines filter
      if (selectedAirlines.size > 0) {
        const flightAirlines = new Set(
          flight.segments?.map((s) => s.Airline?.AirlineName) || [],
        );
        let airlineMatch = false;
        for (let airline of selectedAirlines) {
          if (flightAirlines.has(airline)) {
            airlineMatch = true;
            break;
          }
        }
        if (!airlineMatch) return false;
      }

      // Price range filter
      const price = Number(response.prices?.TotalPrice);
      if (price < priceRange[0] || price > priceRange[1]) {
        return false;
      }

      return true;
    });
  }, [
    FlightOptions,
    selectedStops,
    selectedDepartures,
    selectedArrivals,
    selectedAirlines,
    priceRange,
  ]);

  // Sorted Onward Flights
  const sortedFlights = React.useMemo(() => {
    // Remove duplicates based on flightId
    const uniqueFlights = [];
    const seenFlightIds = new Set();

    filteredFlights.forEach((flight) => {
      const flightId = getFlightUniqueId(flight.flight);
      if (!seenFlightIds.has(flightId)) {
        seenFlightIds.add(flightId);
        uniqueFlights.push(flight);
      }
    });

    // Sort
    return [...uniqueFlights].sort((a, b) => {
      const getTime = (timeStr) => new Date(timeStr).getTime();

      switch (sortField) {
        case "departure":
          return sortOrder === "asc"
            ? getTime(a.flight.depTime) - getTime(b.flight.depTime)
            : getTime(b.flight.depTime) - getTime(a.flight.depTime);

        case "arrival":
          return sortOrder === "asc"
            ? getTime(a.flight.arrTime) - getTime(b.flight.arrTime)
            : getTime(b.flight.arrTime) - getTime(a.flight.arrTime);

        case "travelTime": {
          const durationA =
            getTime(a.flight.arrTime) - getTime(a.flight.depTime);
          const durationB =
            getTime(b.flight.arrTime) - getTime(b.flight.depTime);
          return sortOrder === "asc"
            ? durationA - durationB
            : durationB - durationA;
        }

        case "stops": {
          const stopsA = a.flight.segments.length - 1;
          const stopsB = b.flight.segments.length - 1;
          return sortOrder === "asc" ? stopsA - stopsB : stopsB - stopsA;
        }

        case "price": {
          const priceA = Number(a.prices.TotalPrice);
          const priceB = Number(b.prices.TotalPrice);
          return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
        }

        default:
          return 0;
      }
    });
  }, [filteredFlights, sortField, sortOrder]);
  const handleSort = (field) => {
    if (field === sortField) {
      // Toggle order
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setShowPrices(new Set());
    setShowFlightDetails(null);
  };
  //Clear filter
  const handleClearFilters = () => {
    setSelectedStops(new Set());
    setSelectedDepartures([]);
    setSelectedArrivals([]);
    setSelectedAirlines(new Set());
    setPriceRange([minFare, maxFare]); // or your initial default range
    setShowPrices(new Set());
    setReturnSelectedStops(new Set());
    setSelectedReturnDepartures([]);
    setSelectedReturnArrivals([]);
    setSelectedReturnAirlines(new Set());
    setPriceReturnRange([minFare, maxFare]);
  };

  // -------------------------------------------- Return Filter ---------------------------------------------
  //Fliter stop
  // Make sure these are defined correctly
  const toggleReturnStop = (stop) => {
    setReturnSelectedStops((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stop)) {
        newSet.delete(stop);
      } else {
        newSet.add(stop);
      }
      console.log("Return stops updated:", Array.from(newSet)); // Debug
      return newSet;
    });
    setSelectedReturnFlightIds([]);
    setSelectedReturnFares([]);
    setShowReturnPrices(new Set());
  };

  // Airline filter
  const toggleReturnAirline = (airlineName) => {
    setSelectedReturnAirlines((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(airlineName)) {
        newSet.delete(airlineName);
      } else {
        newSet.add(airlineName);
      }
      // console.log('Return airlines updated:', Array.from(newSet)); // Debug
      return newSet;
    });
    setSelectedReturnFlightIds([]);
    setSelectedReturnFares([]);
    setShowReturnPrices(new Set());
  };

  // Time slot filter
  const toggleReturnSelection = (slotKey, isDeparture) => {
    const updater = isDeparture
      ? setSelectedReturnDepartures
      : setSelectedReturnArrivals;
    const current = isDeparture
      ? selectedReturnDepartures
      : selectedReturnArrivals;

    updater(
      current.includes(slotKey)
        ? current.filter((key) => key !== slotKey)
        : [...current, slotKey],
    );

    // console.log('Return departures:', selectedReturnDepartures); // Debug
    // console.log('Return arrivals:', selectedReturnArrivals); // Debug

    setSelectedReturnFlightIds([]);
    setSelectedReturnFares([]);
    setShowReturnPrices(new Set());
  };

  const getReturnTimeSlot = (hour) => {
    if (hour < 6) return "before6AM";
    if (hour < 12) return "6AMto12PM";
    if (hour < 18) return "12PMto6PM";
    return "after6PM";
  };

  // Filtered data - FIXED VERSION
  const filteredReturnFlights = React.useMemo(() => {
    // console.log('=== FILTERING RETURN FLIGHTS ===');
    // console.log('Selected stops:', Array.from(returnSelectedStops || []));
    // console.log('Selected departures:', selectedReturnDepartures);
    // console.log('Selected arrivals:', selectedReturnArrivals);
    // console.log('Selected airlines:', Array.from(selectedReturnAirlines || []));
    // console.log('Price range:', priceReturnRange);

    if (!FlightReturnOptions?.length) {
      // console.log('No return flights to filter');
      return [];
    }

    // Debug first few flights to see airline names
    // console.log('Sample flight airlines:');
    FlightReturnOptions.slice(0, 5).forEach((resp, idx) => {
      const airlines =
        resp?.flight?.segments?.map((s) => s.Airline?.AirlineName) || [];
      // console.log(`Flight ${idx} airlines:`, airlines);
    });

    const filtered = FlightReturnOptions.filter((response, idx) => {
      const flight = response?.flight;
      if (!flight) return false;

      // STOP FILTER
      const stopsCount = flight.segments?.length - 1;
      if (returnSelectedStops.size > 0) {
        if (!returnSelectedStops.has(stopsCount)) {
          if (idx < 5) console.log(`Flight ${idx} rejected by stops`);
          return false;
        }
      }

      // DEPARTURE TIME FILTER
      if (selectedReturnDepartures.length > 0) {
        const depTime = new Date(flight?.depTime);
        const depSlot = getReturnTimeSlot(depTime.getHours());
        if (!selectedReturnDepartures.includes(depSlot)) {
          if (idx < 5) console.log(`Flight ${idx} rejected by departure time`);
          return false;
        }
      }

      // ARRIVAL TIME FILTER
      if (selectedReturnArrivals.length > 0) {
        const arrTime = new Date(flight?.arrTime);
        const arrSlot = getReturnTimeSlot(arrTime.getHours());
        if (!selectedReturnArrivals.includes(arrSlot)) {
          if (idx < 5) console.log(`Flight ${idx} rejected by arrival time`);
          return false;
        }
      }

      // AIRLINE FILTER - WITH DEBUG
      if (selectedReturnAirlines.size > 0) {
        const flightAirlines =
          flight.segments?.map((s) => s.Airline?.AirlineName) || [];
        const selectedAirlinesArray = Array.from(selectedReturnAirlines);

        // Debug first few flights
        if (idx < 5) {
          // console.log(`Flight ${idx} airlines:`, flightAirlines);
          // console.log(`Selected airlines:`, selectedAirlinesArray);
        }

        // Check if ANY selected airline matches ANY flight airline
        let hasMatchingAirline = false;
        for (let selectedAirline of selectedAirlinesArray) {
          if (flightAirlines.includes(selectedAirline)) {
            hasMatchingAirline = true;
            break;
          }
        }

        if (!hasMatchingAirline) {
          if (idx < 5) console.log(`Flight ${idx} rejected by airlines`);
          return false;
        }

        if (idx < 5) console.log(`Flight ${idx} accepted by airlines`);
      }

      // PRICE FILTER
      const price = Number(response.prices?.TotalPrice);
      if (price < priceReturnRange[0] || price > priceReturnRange[1]) {
        if (idx < 5) console.log(`Flight ${idx} rejected by price`);
        return false;
      }

      if (idx < 5);
      return true;
    });

    // console.log('Filtered count:', filtered.length);
    return filtered;
  }, [
    FlightReturnOptions,
    returnSelectedStops,
    selectedReturnDepartures,
    selectedReturnArrivals,
    selectedReturnAirlines,
    priceReturnRange,
  ]);

  // Sort the filtered flights
  const sortedReturnFlights = React.useMemo(() => {
    // Remove duplicates
    const uniqueFlights = [];
    const seenFlightIds = new Set();

    filteredReturnFlights.forEach((flight) => {
      const flightId = getFlightUniqueId(flight.flight);
      if (!seenFlightIds.has(flightId)) {
        seenFlightIds.add(flightId);
        uniqueFlights.push(flight);
      }
    });

    // Sort
    return [...uniqueFlights].sort((a, b) => {
      const getTime = (timeStr) => new Date(timeStr).getTime();

      switch (sortReturnField) {
        case "departure":
          return sortReturnOrder === "asc"
            ? getTime(a.flight.depTime) - getTime(b.flight.depTime)
            : getTime(b.flight.depTime) - getTime(a.flight.depTime);

        case "arrival":
          return sortReturnOrder === "asc"
            ? getTime(a.flight.arrTime) - getTime(b.flight.arrTime)
            : getTime(b.flight.arrTime) - getTime(a.flight.arrTime);

        case "travelTime": {
          const durationA =
            getTime(a.flight.arrTime) - getTime(a.flight.depTime);
          const durationB =
            getTime(b.flight.arrTime) - getTime(b.flight.depTime);
          return sortReturnOrder === "asc"
            ? durationA - durationB
            : durationB - durationA;
        }

        case "stops": {
          const stopsA = a.flight.segments.length - 1;
          const stopsB = b.flight.segments.length - 1;
          return sortReturnOrder === "asc" ? stopsA - stopsB : stopsB - stopsA;
        }

        case "price": {
          const priceA = Number(a.prices.TotalPrice);
          const priceB = Number(b.prices.TotalPrice);
          return sortReturnOrder === "asc" ? priceA - priceB : priceB - priceA;
        }

        default:
          return 0;
      }
    });
  }, [filteredReturnFlights, sortReturnField, sortReturnOrder]);

  // Sort handler
  const handleReturnSort = (field) => {
    if (field === sortReturnField) {
      setSortReturnOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortReturnField(field);
      setSortReturnOrder("asc");
    }
    setSelectedReturnFlightIds([]);
    setSelectedReturnFares([]);
    setShowReturnPrices(new Set());
  };

  // Clear all filters
  const handleClearReturnFilters = () => {
    setReturnSelectedStops(new Set());
    setSelectedReturnDepartures([]);
    setSelectedReturnArrivals([]);
    setSelectedReturnAirlines(new Set());
    setPriceReturnRange([minFare, maxFare]);
    setShowReturnPrices(new Set());
    setSelectedReturnFlightIds([]);
    setSelectedReturnFares([]);
  };
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleserachfunction = () => {
    setFlightOptions([]);
    setShowPrices(false);
    Keyfetch();
    handleClearFilters();
    setFlightReturnOptions([]);
    handleClearReturnFilters();
    setShowReturnPrices(false);
    setFlightBookingOpen(false);
    setSelectedFareforbooking([]);
  };

  // -----------------------------------------------------Fare selection for booking---------------------------------------------------

  const handleSingleSelect = (flight, fare, flightId, baseFare, journey) => {
    console.log("flight", flight);
    console.log("fare", fare);
    console.log(flightId);
    console.log("jounery", journey);
    //  const EffectiveFlightId = flightId;
    //   const policyKey = `${EffectiveFlightId}_${fare.type}`;
    //   const policyData = cancellationPolicies[policyKey];
    //   console.log("Policy data for booking:", policyData); // Debug log
    setSelectedFareforbooking((prev) => ({
      ...prev,
      [journey]: { flight: flight, fare: fare, flightId: flightId }, // replace the array with only the selected fare for the given journey
    }));
    setFlightBookingOpen(true);
  };

  // // console.log(selectedFareforbooking)

  // -------------------------------------------------------------------------------------------------------------------------------------
  //Selected flight ui
  const [isMinimized, setIsMinimized] = useState(false);

  const handleClose = () => {
    setIsMinimized(true); // Minimize the popup
    setFlightBookingOpen(false);
  };

  const handleExpand = () => {
    setIsMinimized(false); // Expand the popup
  };

  // Convert date into date and month
  const formatdatemonth = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getDate()} ${date.toLocaleString("default", {
      month: "short",
    })}`;
  };

  //Convert into week date month year
  const handleweekdatemonthyear = (date) => {
    const arrivalTime = new Date(date);
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const weekday = weekdays[arrivalTime.getDay()];
    const day = arrivalTime.getDate();
    const month = months[arrivalTime.getMonth()];
    const year = arrivalTime.getFullYear();

    const formattedDateString = `${weekday}, ${day} ${month} ${year}`;
    return formattedDateString;
  };

  //Navigate to next page on click on price div
  const [markup, setMarkup] = useState("");
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [flightRouteInfo, setFlightRouteInfo] = useState({
    fromCity: "",
    fromAirport: "",
    fromCode: "",
    toCity: "",
    toAirport: "",
    toCode: "",
  });
  // Add these state variables
  const [ClientPriceOnward, setClientPriceOnward] = useState("");
  const [ClientPriceReturn, setClientPriceReturn] = useState("");
  const [priceErrorOnward, setPriceErrorOnward] = useState("");
  const [priceErrorReturn, setPriceErrorReturn] = useState("");

  // Update modal close function

  // console.log(ClientPrice);

  const safeFormatTime = (dateValue) => {
    if (!dateValue) return "--:--";

    const date = new Date(dateValue);
    return isValid(date) ? format(date, "HH:mm") : "--:--";
  };

  const [bookingPayload, setBookingPayload] = useState(null);

  const AddClientPrice = (
    fare,
    flightId,
    segments,
    Cabinclass,
    inputValue,
    FlightInfo,
    isRoundTrip = false,
    returnData = null,
  ) => {
    const EffectiveFlightId = flightId;
    const policyKey = `${EffectiveFlightId}_${fare.type}`;
    const policyData = cancellationPolicies[policyKey];
    const bookingData = {
      fare,
      flightId,
      segments,
      Cabinclass,
      inputValue,
      FlightInfo,
      isRoundTrip,

      // Always set onward data
      onwardFare: fare,
      onwardFlight: FlightInfo,
      onwardSegments: segments,

      // Only set return data if provided
      returnFare: returnData?.fare || null,
      returnFlight: returnData?.flight || null,
      returnSegments: returnData?.flight?.segments || null,

      // Calculate total price
      totalPrice:
        isRoundTrip && returnData?.fare
          ? (fare?.price || 0) + (returnData.fare?.price || 0)
          : fare?.price || 0,
    };
    console.log("Policy data for booking:", policyData); // Debug log
    // console.log("Booking Data:", bookingData); // Debug log

    setBookingPayload(bookingData);
    setIsModalOpen2(true);
  };
  // console.log("Booking Payload:", bookingPayload); // Debug log
  const NavigatetoBookingflow = (
    fare,
    segments,
    Cabinclass,
    inputValue,
    FlightInfo,
    ClientPrice,
    onwardPolicyData,
  ) => {
    const adultCount = inputValue.adult
      ? Number(inputValue.adult)
      : Number(adult);
    const childCount = inputValue.child
      ? Number(inputValue.child)
      : Number(child);
    const infantCount = inputValue.infant
      ? Number(inputValue.infant)
      : Number(infant);
    // // console.log("Flight type", FLightType)
    const PriceResponse = {
      key: fare.Resultindex,
      traceId: fare.TraceId,
      source_type: fare.from,
      IsLCC: fare.isLCC,
      faretype: fare.type,
      segments: segments,
      CabinClass: Cabinclass,
      Passenger_info: {
        Adult: adultCount,
        Child: childCount,
        Infant: infantCount,
      },
      passengerDetails: PassengerDetails,
      FlightType: FLightType,
      FlightDetails: location.state.responseData || "",
      // ClientPrice: Number(ClientPrice) || 0,
      ClientPrice: Number(ClientPriceOnward) || 0,
      cancellationPolicy: onwardPolicyData,
      // ClientPriceOnward: Number(ClientPriceOnward) || 0,
    };
    sessionStorage.setItem("PriceResponse", JSON.stringify(PriceResponse));

    // Open in new tab
    const path = fare.from === "Uapi" ? "/UapiBookingflow" : "/TboBookingflow";
    window.open(path, "_blank");
  };

  // Navigate to next page for return flight booking
  const NavigateToReturnBookingPage = (
    FlightData,
    cabinClass,
    inputValue,
    ClientPrice = null,
  ) => {
    const adultCount = inputValue.adult
      ? Number(inputValue.adult)
      : Number(adult);
    const childCount = inputValue.child
      ? Number(inputValue.child)
      : Number(child);
    const infantCount = inputValue.infant
      ? Number(inputValue.infant)
      : Number(infant);

    const PriceResponse = {
      onward: { ...FlightData.Onward ,  cancellationPolicy: FlightData.Onward.cancellationPolicy,
      flightId: FlightData.Onward.flightId, },
      return: { ...FlightData.Return , cancellationPolicy: FlightData.Return.cancellationPolicy,
      flightId: FlightData.Return.flightId, },
      CabinClass: cabinClass,
      Passenger_info: {
        Adult: adultCount,
        Child: childCount,
        Infant: infantCount,
      },
      passengerDetails: PassengerDetails,
      FlightType: FLightType,
      FlightDetails: location.state.responseData || "",
      ClientPriceOnward: FlightData.Onward.clientPrice || 0,
      ClientPriceReturn: FlightData.Return?.clientPrice || 0,
      // TotalClientPrice: totalClientPrice || 0,
    };

    sessionStorage.setItem(
      "returnPriceResponse",
      JSON.stringify(PriceResponse),
    );

    window.open("/ReturnBookingFlow", "_blank");
  };

  //input value date format
  function ddmmyyyyformatDate(date) {
    // alert(date);
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  }
  // ------------------------------------- Share options -----------------------------------------------------

  const modalopen = () => {
    setIsModalOpen(true);
  };
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const handleRemoveEmail = (email) => {
    setAdditionalEmails(additionalEmails.filter((e) => e !== email));
  };
  const handleRemoveCCEmail = (emailToRemove) => {
    setCCEmails(ccEmails.filter((email) => email !== emailToRemove));
  };
  const handleAddCCEmailOnBlur = () => {
    if (!ccEmailInput || ccEmailInput.trim() === "") return;

    const newEmails = ccEmailInput
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "");

    setCCEmails((prev) => {
      const combined = [...prev, ...newEmails];

      // Remove duplicates using Set
      return [...new Set(combined)];
    });

    setCCEmailInput("");
  };

  const handleAddSpocEmailOnBlur = () => {
    if (spocEmailInput.trim() !== "") {
      const newEmails = spocEmailInput.split(",").map((email) => email.trim());
      setSpocEmails((prev) => [...new Set([...prev, ...newEmails])]); // Remove duplicates
      setSpocEmailInput(""); // Clear input
    }
  };

  const handleAddEmailOnBlur = () => {
    if (
      typeof additionalEmailInput === "string" &&
      additionalEmailInput.trim() !== "" &&
      !additionalEmails.includes(additionalEmailInput.trim())
    ) {
      setAdditionalEmails((prev) => [...prev, additionalEmailInput.trim()]);
      setAdditionalEmailInput(""); // Clear input
    }
  };

  // helper to calculate duration between dep & arr

  function calculateDurationFlight(segments = []) {
    if (!segments.length) return "00h 00m";

    const depTime = segments[0]?.Origin?.DepTime;
    const arrTime = segments[segments.length - 1]?.Destination?.ArrTime;

    if (!depTime || !arrTime) return "00h 00m";

    const start = new Date(depTime);
    const end = new Date(arrTime);

    const diffMs = end - start;
    const totalMinutes = Math.floor(diffMs / (1000 * 60));

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  }

  const [cancellationPolicies, setCancellationPolicies] = useState({}); // key: flightId_fareType, value: policy data
  const [cancellationPoliciesUapi, setCancellationPoliciesUapi] = useState({});
  const [policyLoading, setPolicyLoading] = useState({});

  const fetchCancellationForUapiFare = async () => {
    try {
      const response = await fetch(
        `${CONFIG.MAIN_API}/api/flights/getCancellationDateChangePolicy`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const Data = await response.json();
      setCancellationPoliciesUapi(Data.data);
    } catch (error) {
      console.error("Error fetching cancellation policy:", error);
      // Optionally set an error state to show to user
      // setCancellationError(error.message);
    }
  };

  useEffect(() => {
    if (!hasFetchedRefForCancellation.current) {
      fetchCancellationForUapiFare();
      hasFetchedRefForCancellation.current = true;
    }
  }, []); // Empty dependency array is fine with the ref pattern
  const fetchCancellationPolicy = async (fare, flightId, resultIndex) => {
    if (!resultIndex) {
      return null;
    }

    const policyKey = `${flightId}_${fare.type}`;

    // Don't fetch if already have policy or currently loading
    if (cancellationPolicies[policyKey] || policyLoading[policyKey]) {
      return cancellationPolicies[policyKey];
    }

    try {
      setPolicyLoading((prev) => ({ ...prev, [policyKey]: true }));

      // Check source type
      if (fare.from === "Tbo") {
        // For TBO - Always call cancellationsPolicies API
        const requestData = {
          onwardKeys: {
            key: resultIndex,
            traceId: fare.trace_id || fare.traceId || fare.TraceId || "",
            source_type: fare.from,
            flighttype: FLightType,
            isLCC: fare.isLCC,
            FareClass: fare.SupplierFareClass || "",
          },
          passengerDetails: PassengerDetails,
        };

        const response = await fetch(`${base_url}cancellationsPolicies`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        const data = await response.json();

        if (data.status && data.data) {
          // Store TBO policy WITH all the fare info
          setCancellationPolicies((prev) => ({
            ...prev,
            [policyKey]: {
              source: "Tbo",
              type: "api",
              data: data.data,
              // Add all the fare info here
              originCity: fare.originCity,
              destinationCity: fare.destinationCity,
              originCode: fare.originCode,
              destinationCode: fare.destinationCode,
              airlineName: fare.airlineName,
              fareType: fare.type || fare.SupplierFareClass,
            },
          }));
          return data.data;
        }
      } else if (fare.from === "Uapi") {
        // For UAPI - First check in pre-fetched cancellation policies
        const uapiCancellationPolicies =
          cancellationPoliciesUapi?.Cancellation || [];
        const uapiDateChangePolicies =
          cancellationPoliciesUapi?.Date_Change || [];

        // Find matching fare type in UAPI policies
        const matchingCancellationPolicy = uapiCancellationPolicies.find(
          (policy) =>
            policy.fare_name?.toLowerCase() === fare.type?.toLowerCase(),
        );

        const matchingDateChangePolicy = uapiDateChangePolicies.find(
          (policy) =>
            policy.fare_name?.toLowerCase() === fare.type?.toLowerCase(),
        );

        if (matchingCancellationPolicy || matchingDateChangePolicy) {
          // Fare type found in UAPI predefined policies
          setCancellationPolicies((prev) => ({
            ...prev,
            [policyKey]: {
              source: "Uapi",
              type: "predefined",
              data: {
                onward: {
                  fareTypeFound: fare.type,
                  cancellation: matchingCancellationPolicy
                    ? {
                        charges: matchingCancellationPolicy.charges,
                        fee: matchingCancellationPolicy.fee,
                        timeframe: matchingCancellationPolicy.timeframe,
                      }
                    : null,
                  dateChange: matchingDateChangePolicy
                    ? {
                        charges: matchingDateChangePolicy.charges,
                        fee: matchingDateChangePolicy.fee,
                        timeframe: matchingDateChangePolicy.timeframe,
                      }
                    : null,
                },
              },
              // Add all the fare info here
              originCity: fare.originCity,
              destinationCity: fare.destinationCity,
              originCode: fare.originCode,
              destinationCode: fare.destinationCode,
              airlineName: fare.airlineName,
              fareType: fare.type || fare.SupplierFareClass,
            },
          }));
          return {
            onward: {
              fareTypeFound: fare.type,
              cancellation: matchingCancellationPolicy,
              dateChange: matchingDateChangePolicy,
            },
          };
        } else {
          // Fare type not found in UAPI policies - Call cancellationsPolicies API
          const requestData = {
            onwardKeys: {
              key: resultIndex,
              traceId: fare.trace_id || fare.traceId || fare.TraceId || "",
              source_type: fare.from,
              flighttype: FLightType,
              isLCC: fare.isLCC,
              FareClass: fare.SupplierFareClass || "",
            },
            passengerDetails: PassengerDetails,
          };

          const response = await fetch(`${base_url}cancellationsPolicies`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });

          const data = await response.json();

          if (data.status && data.data) {
            // Store UAPI policy from API WITH all the fare info
            setCancellationPolicies((prev) => ({
              ...prev,
              [policyKey]: {
                source: "Uapi",
                type: "api",
                data: data.data,
                // Add all the fare info here
                originCity: fare.originCity,
                destinationCity: fare.destinationCity,
                originCode: fare.originCode,
                destinationCode: fare.destinationCode,
                airlineName: fare.airlineName,
                fareType: fare.type || fare.SupplierFareClass,
              },
            }));
            return data.data;
          }
        }
      }

      return null;
    } catch (error) {
      console.error("Error fetching cancellation policy:", error);
      return null;
    } finally {
      setPolicyLoading((prev) => ({ ...prev, [policyKey]: false }));
    }
  };
  // Add this helper function to get policy data for a fare
  const getPolicyForFare = (flightId, fareType) => {
    const policyKey = `${flightId}_${fareType}`;
    return cancellationPolicies[policyKey] || null;
  };
  const Shareflight = async () => {
    // Helper function to clean text

    const cleanText = (text) => {
      if (!text || typeof text !== "string") return text;

      // Remove special characters but keep spaces, letters, numbers, basic punctuation
      return text
        .replace(/[^\w\s(),.-]/g, "") // Keep alphanumeric, spaces, and basic punctuation
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .trim();
    };

    // Helper function to calculate duration
    const calculateDuration = (departure, arrival) => {
      if (!departure || !arrival) return "00 Hrs : 00 mins";

      const dep = new Date(departure);
      const arr = new Date(arrival);
      const diffMs = arr - dep;

      if (diffMs < 0) return "00 Hrs : 00 mins";

      const diffH = Math.floor(diffMs / (1000 * 60 * 60));
      const diffM = Math.floor((diffMs / (1000 * 60)) % 60);

      return `${String(diffH).padStart(2, "0")} Hrs : ${String(diffM).padStart(
        2,
        "0",
      )} mins`;
    };

    // Convert layover difference into HH:MM:SS
    const calculateLayover = (arrival, departure) => {
      if (!arrival || !departure) return "00 Hrs : 00 mins";

      const arr = new Date(arrival);
      const dep = new Date(departure);
      const diffMs = dep - arr;

      if (diffMs < 0) return "00 Hrs : 00 mins";

      const diffH = Math.floor(diffMs / (1000 * 60 * 60));
      const diffM = Math.floor((diffMs / (1000 * 60)) % 60);

      return `${String(diffH).padStart(2, "0")} Hrs : ${String(diffM).padStart(
        2,
        "0",
      )} mins`;
    };

    // Build initial object
    let transformedFlights = {
      flights: {},
    };

    let is_return = 0;

    // Check for onward flights
    if (Object.keys(groupedFlights || {}).length > 0) {
      transformedFlights.flights.onward = { flight_options: [] };
    }

    // Check for return flights
    if (Object.keys(groupedReturnFlights || {}).length > 0) {
      transformedFlights.flights.return = { flight_options: [] };
      is_return = 1;
    }
    // After transforming flights, update the city states
    if (groupedFlights && Object.keys(groupedFlights).length > 0) {
      const firstFlight = Object.values(groupedFlights)[0];
      const flightData = firstFlight.flightData || firstFlight.flight;

      if (flightData) {
        setFromCity(
          flightData.originAirport?.CityName ||
            flightData.originAirport?.AirportName ||
            "",
        );
        setToCity(
          flightData.destinationAirport?.CityName ||
            flightData.destinationAirport?.AirportName ||
            "",
        );
      }
    }

    // ------------------------- ONWARD FLIGHTS ----------------------------
    Object.entries(groupedFlights || {}).forEach(([flightId, item]) => {
      // Get flight data - check if it's in item.flightData or item.flight
      const flightData = item.flightData || item.flight;
      if (!flightData) return;

      const segments = flightData.segments || [];

      const flightNos = segments
        .map((seg) => seg.Airline?.FlightNumber)
        .filter(Boolean)
        .join(", ");

      const airlineNames = segments
        .map((seg) => cleanText(seg.Airline?.AirlineName))
        .filter(Boolean)
        .join(", ");

      const carriers = segments
        .map((seg) => cleanText(seg.Airline?.AirlineCode))
        .filter(Boolean)
        .join(", ");

      // --------------------- LAYOVER CALCULATION ---------------------
      const stops = [];
      if (segments.length > 1) {
        for (let i = 0; i < segments.length - 1; i++) {
          const currentSeg = segments[i];
          const nextSeg = segments[i + 1];

          const stopAirport = currentSeg?.Destination?.Airport;

          const layoverTime = calculateLayover(
            currentSeg?.Destination?.ArrTime,
            nextSeg?.Origin?.DepTime,
          );

          stops.push({
            stop_airport: cleanText(
              `${stopAirport?.AirportName || ""} ${stopAirport?.CityName || ""} (${stopAirport?.AirportCode || ""})`,
            ),
            duration: layoverTime,
          });
        }
      }

      // Get base fare from first fare
      const baseFare = item.fares?.[0]?.price || 0;
      // console.log("Base Price",baseFare);
      const markupValue = Number(markup) || 0;

      // ---------------------- ADD FLIGHT OPTION ----------------------
      transformedFlights.flights.onward.flight_options.push({
        flight_no: cleanText(carriers) + " " + cleanText(flightNos),
        airline_name: cleanText(airlineNames),
        from_city: cleanText(flightData.originAirport?.AirportName),
        from_city_code: cleanText(flightData.originAirport?.AirportCode),
        to_city: cleanText(flightData.destinationAirport?.AirportName),
        to_city_code: cleanText(flightData.destinationAirport?.AirportCode),
        departure_datetime: flightData?.depTime,
        arrival_datetime: flightData?.arrTime,
        base_price: baseFare,
        price: baseFare + markupValue,
        markup: markupValue,
        is_return,
        no_of_stops: segments.length - 1,
        carrier: cleanText(carriers),
        provider_code: cleanText(item?.fares?.[0]?.ProviderCode || ""),
        duration: calculateDuration(flightData?.depTime, flightData?.arrTime),
        is_refundable: item.fares?.[0]?.is_refundable || 0,

        // In Shareflight function, when creating fare_details:
        fare_details: (item?.fares || []).map((f) => {
          // Find if this fare is selected from selectedFlightoption
          const selectedOption = selectedFlightoption.find(
            (opt) => opt.flightId === flightId && opt.fare.type === f.type,
          );

          // Extract policy data if available
          let cancellationPolicyDetail = "No cancellation policy available";
          let dateChangePolicyDetail = "No date change policy available";
          let fareRuleDetail = "";

          if (selectedOption?.cancellation_policy?.onward) {
            const policy = selectedOption.cancellation_policy.onward;

            // Get FareRuleDetail if available
            if (policy.FareRules && policy.FareRules[0]) {
              fareRuleDetail = policy.FareRules[0].FareRuleDetail || "";
              cancellationPolicyDetail =
                fareRuleDetail || "Cancellation policy available";
            }

            // Get date change policy from MiniFareRules
            if (policy.MiniFareRules && policy.MiniFareRules[0]) {
              const reissueRules = policy.MiniFareRules[0].filter(
                (rule) => rule.Type === "Reissue",
              );
              if (reissueRules.length > 0) {
                dateChangePolicyDetail = JSON.stringify(reissueRules);
              }
            }
          }

          return {
            fare_type: cleanText(f.type || "Corporate Fare"),
            base_price: f.price || 0,
            price: (f.price || 0) + markupValue,
            markup: markupValue,
            source: cleanText(f.from || "Uapi"),
            updated_total_price: (f.price || 0) + markupValue,
            result_index: f.ResultIndex || f.result_index || "",
            cancellation_policy: cancellationPolicyDetail,
            date_change_policy: dateChangePolicyDetail,
            fare_rule_detail: fareRuleDetail,
            is_selected: !!selectedOption,
          };
        }),

        flight_details: segments.map((seg) => ({
          flight_no: cleanText(seg.Airline?.FlightNumber),
          airline_name: cleanText(seg.Airline?.AirlineName),
          from_city: cleanText(seg.Origin?.Airport?.AirportName),
          from_city_code: cleanText(seg.Origin?.Airport?.AirportCode),
          to_city: cleanText(seg.Destination?.Airport?.AirportName),
          to_city_code: cleanText(seg.Destination?.Airport?.AirportCode),
          departure_datetime: seg.Origin?.DepTime,
          arrival_datetime: seg.Destination?.ArrTime,
          origin_airline_city: cleanText(seg.Origin?.Airport?.CityName),
          destination_airline_city: cleanText(
            seg.Destination?.Airport?.CityName,
          ),
          provider_code: cleanText(item?.fares?.[0]?.ProviderCode || ""),
          OriginTerminal: cleanText(seg.Origin?.Airport?.Terminal || ""),
          DestinationTerminal: cleanText(
            seg.Destination?.Airport?.Terminal || "",
          ),
        })),

        DestinationTerminal: cleanText(
          flightData.destinationAirport?.Terminal || "",
        ),
        OriginTerminal: cleanText(flightData.originAirport?.Terminal || ""),

        // ADD LAYOVER STOPS
        stops,
      });
    });

    // ------------------------- RETURN FLIGHTS ----------------------------
    if (Object.keys(groupedReturnFlights || {}).length > 0) {
      Object.entries(groupedReturnFlights).forEach(([flightId, item]) => {
        // Get flight data - check if it's in item.flightData or item.flight
        const flightData = item.flightData || item.flight;
        if (!flightData) return;

        const segments = flightData.segments || [];

        const flightNos = segments
          .map((seg) => seg.Airline?.FlightNumber)
          .filter(Boolean)
          .join(", ");

        const airlineNames = segments
          .map((seg) => cleanText(seg.Airline?.AirlineName))
          .filter(Boolean)
          .join(", ");

        const carriers = segments
          .map((seg) => cleanText(seg.Airline?.AirlineCode))
          .filter(Boolean)
          .join(", ");

        // ----------------- RETURN LAYOVER CALCULATION -----------------
        const stops = [];
        if (segments.length > 1) {
          for (let i = 0; i < segments.length - 1; i++) {
            const currentSeg = segments[i];
            const nextSeg = segments[i + 1];

            const stopAirport = currentSeg?.Destination?.Airport;

            const layoverTime = calculateLayover(
              currentSeg?.Destination?.ArrTime,
              nextSeg?.Origin?.DepTime,
            );

            stops.push({
              stop_airport: cleanText(
                `${stopAirport?.AirportName || ""} ${stopAirport?.CityName || ""} (${stopAirport?.AirportCode || ""})`,
              ),
              duration: layoverTime,
            });
          }
        }

        // Get base fare from first fare
        const baseFare = item.fares?.[0]?.price || 0;
        const markupValue = Number(markup) || 0;

        // ---------------------- ADD FLIGHT OPTION ----------------------
        transformedFlights.flights.return.flight_options.push({
          flight_no: cleanText(carriers) + " " + cleanText(flightNos),
          airline_name: cleanText(airlineNames),
          from_city: cleanText(flightData.originAirport?.AirportName),
          from_city_code: cleanText(flightData.originAirport?.AirportCode),
          to_city: cleanText(flightData.destinationAirport?.AirportName),
          to_city_code: cleanText(flightData.destinationAirport?.AirportCode),
          departure_datetime: flightData?.depTime,
          arrival_datetime: flightData?.arrTime,
          base_price: baseFare,
          price: baseFare + markupValue, // Fixed: removed duplicate price property
          markup: markupValue,
          is_return: 1,
          no_of_stops: segments.length - 1,
          carrier: cleanText(carriers),
          provider_code: cleanText(item?.fares?.[0]?.ProviderCode || ""),
          duration: calculateDuration(flightData?.depTime, flightData?.arrTime),
          is_refundable: item.fares?.[0]?.is_refundable || 0,

          fare_details: (item?.fares || []).map((f) => ({
            fare_type: cleanText(f.type || "Corporate Fare"),
            base_price: f.price || 0,
            price: (f.price || 0) + markupValue,
            markup: markupValue,
            source: cleanText(f.from || "Uapi"),
            updated_total_price: (f.price || 0) + markupValue,
          })),

          flight_details: segments.map((seg) => ({
            flight_no: cleanText(seg.Airline?.FlightNumber),
            airline_name: cleanText(seg.Airline?.AirlineName),
            from_city: cleanText(seg.Origin?.Airport?.AirportName),
            from_city_code: cleanText(seg.Origin?.Airport?.AirportCode),
            to_city: cleanText(seg.Destination?.Airport?.AirportName),
            to_city_code: cleanText(seg.Destination?.Airport?.AirportCode),
            departure_datetime: seg.Origin?.DepTime,
            arrival_datetime: seg.Destination?.ArrTime,
            origin_airline_city: cleanText(seg.Origin?.Airport?.CityName),
            destination_airline_city: cleanText(
              seg.Destination?.Airport?.CityName,
            ),
            provider_code: cleanText(item?.fares?.[0]?.ProviderCode || ""),
            OriginTerminal: cleanText(seg.Origin?.Airport?.Terminal || ""),
            DestinationTerminal: cleanText(
              seg.Destination?.Airport?.Terminal || "",
            ),
          })),

          DestinationTerminal: cleanText(
            flightData.destinationAirport?.Terminal || "",
          ),
          OriginTerminal: cleanText(flightData.originAirport?.Terminal || ""),

          // ADD LAYOVER STOPS
          stops,
        });
      });
    }

    // ---------------------- FINAL REQUEST BODY ----------------------
    const requestData = {
      booking_id: cleanText(bookingid || ""),
      email: Array.isArray(spocEmails) ? spocEmails.filter(Boolean) : [],
      seat_type: cleanText(cabinclass || ""),
      departure_date: searchdeparturedate || null,
      return_date: searchreturndate || null,
      no_of_seats: no_of_seats || 1,
      ...transformedFlights,
      additional_emails: Array.isArray(additionalEmails)
        ? additionalEmails.filter(Boolean)
        : [],
      cc_email: Array.isArray(ccEmails) ? ccEmails.filter(Boolean) : [],
      remark: cleanText(remark || ""),
      client_name: cleanText(client_name || ""),
      spoc_name: cleanText(spocname || ""),
      htmlContent: "",
      flag: "",
      query_id: queryId || null,
    };

    // console.log("requestData", requestData);
    setshareoptionsrequest(requestData);

    try {
      const response = await fetch(
        `${CONFIG.MAIN_API}/api/flights/addCotravFlightOptionBooking`,
        {
          method: "POST",
          headers: {
            Origin: "*",
            // "Content-Type": "application/json", // Added proper header
          },
          body: JSON.stringify(requestData),
        },
      );

      const responsedata = await response.json();
      if (responsedata.success === "1") {
        setHtmlContent(responsedata.data);
        if (requestData.flights?.onward?.flight_options?.length > 0) {
          const firstFlight =
            requestData.flights.onward.flight_options[0].flight_details[0];
          setFlightRouteInfo({
            fromCity: firstFlight.origin_airline_city,
            fromAirport: firstFlight.from_city || "",
            fromCode: firstFlight.from_city_code || "",
            toCity: firstFlight.destination_airline_city,
            toAirport: firstFlight.to_city || "",
            toCode: firstFlight.to_city_code || "",
          });
        }
        setIsModalOpen(false);
        setShowModal(true);
        setIsMinimized(true);
      }
      console.log("responsedata", responsedata.data);
    } catch (error) {
      console.error("Error sharing flight options:", error);
    }
  };
  //Update transformHtmlForEditing function
  const transformHtmlForEditing = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // Make the entire body editable
    const body = doc.body;
    body.setAttribute("contenteditable", "true");

    // ===== PROCESS PRICE SPANS (KEEP YOUR EXISTING LOGIC) =====
    const priceSpans = doc.querySelectorAll("span[data-index]");
    priceSpans.forEach((span, index) => {
      // Get the original text from the span
      const originalText = span.textContent.trim();
      const dataIndex = span.getAttribute("data-index");

      // Parse the data-index to understand which flight and fare it belongs to
      let flightType = "onward";
      let flightIndex = 0;
      let fareIndex = 0;

      if (dataIndex.startsWith("R-")) {
        flightType = "return";
        const parts = dataIndex.split("-");
        flightIndex = parseInt(parts[1]);
        fareIndex = parseInt(parts[2]);
      } else {
        const parts = dataIndex.split("-");
        flightIndex = parseInt(parts[0]);
        fareIndex = parseInt(parts[1]);
      }

      // Extract the number from "INR 1669" format
      let numberMatch = originalText.match(/INR\s+([\d,.]+)/);
      let priceNumber = "";

      if (numberMatch) {
        priceNumber = numberMatch[1].replace(/,/g, "");
      } else {
        const numbersWithDecimal = originalText.replace(/[^\d.]/g, "");
        if (numbersWithDecimal) {
          priceNumber = numbersWithDecimal;
        }
      }

      if (priceNumber) {
        span.setAttribute("data-original", priceNumber);
        span.setAttribute("data-flight-type", flightType);
        span.setAttribute("data-flight-index", flightIndex);
        span.setAttribute("data-fare-index", fareIndex);
        span.setAttribute("contenteditable", "true");

        span.style.backgroundColor = "#fff8e1";
        span.style.border = "1px solid #ff9800";
        span.style.padding = "2px 4px";
        span.style.borderRadius = "3px";
        span.style.display = "inline-block";
        span.style.margin = "0 2px";
        span.style.cursor = "text";
        span.style.fontWeight = "bold";
        span.style.minWidth = "50px";

        const numValue = parseFloat(priceNumber);
        if (numValue % 1 !== 0) {
          span.textContent = numValue.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
        } else {
          span.textContent = numValue.toLocaleString("en-IN");
        }
      }
    });

    // ===== FIX FOOTER IMAGES (MOVED OUTSIDE THE LOOP) =====

    // 1. Fix Google Play Store image
    // const googlePlayImg = doc.querySelector('img[src*="google-play-store"]');
    // if (googlePlayImg) {
    //   const possibleUrls = [
    //     'https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg',
    //     'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png',
    //     'https://corporate.taxivaxi.com/image/google-play-store.png'
    //   ];

    //   googlePlayImg.setAttribute('src', possibleUrls[0]);
    //   googlePlayImg.setAttribute('width', '120');
    //   googlePlayImg.setAttribute('height', '40');
    //   googlePlayImg.setAttribute('alt', 'Get it on Google Play');

    //   googlePlayImg.setAttribute('onerror', function() {
    //     let currentSrc = this.src;
    //     let urls = ['https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg',
    //                 'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png',
    //                 'https://corporate.taxivaxi.com/image/google-play-store.png'];
    //     let currentIndex = urls.indexOf(currentSrc);
    //     if (currentIndex < urls.length - 1) {
    //       this.src = urls[currentIndex + 1];
    //     }
    //   });
    // }

    // // 5. Ensure footer structure matches your image
    // const footerTables = doc.querySelectorAll('table[bgcolor="#e8e4ff"]');
    // footerTables.forEach(table => {
    //   const html = table.outerHTML;

    //   // If this is the app download section
    //   if (html.includes('Download') || html.includes('The App')) {
    //     // Create new footer that matches your image
    //     const newFooter = doc.createElement('table');
    //     newFooter.setAttribute('border', '0');
    //     newFooter.setAttribute('cellspacing', '0');
    //     newFooter.setAttribute('width', '100%');
    //     newFooter.setAttribute('bgcolor', '#e8e4ff');
    //     newFooter.style.cssText = 'font-family: "Trebuchet MS", Helvetica, sans-serif; font-size: 12px; ';

    //     newFooter.innerHTML = `
    //       <td style="font-family:Trebuchet MS, Helvetica, sans-serif; text-align:right; text-transform:uppercase; padding-right:15px; vertical-align:middle;">
    //       <span style="font-weight:bold; font-size:15px; display:block; line-height:1.3;">DOWNLOAD<br/>THE APP</span>
    //     </td>
    //     <td style="padding-right:10px; text-align:center;">
    //     <a href="https://play.google.com/store/apps/details?id=co.cotrav.app.cotrav" target="blank"
    //          style="text-decoration:none; display:flex; flex-direction:column; align-items:center;">

    //         <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
    //              width="135" height="40"
    //              alt="Google Play"
    //              style="display:block;">

    //       </a>
    //     </td>
    //     <td style="border-left:2px solid #000; height:50px; width:1px;"></td>
    //     <td style="padding-left:10px; text-align:center;">
    //       	<a href="https://apps.apple.com/in/app/cotrav/id6677036537" target="blank"
    //          style="text-decoration:none; display:flex; flex-direction:column; align-items:center;">

    //         <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
    //              width="135" height="40"
    //              alt="App Store"
    //              style="display:block;">

    //       </a>
    //     </td>
    //     `;

    //     // Replace the old table with new footer
    //     table.parentNode.replaceChild(newFooter, table);
    //   }
    // });

    return doc.documentElement.outerHTML;
  };
  // Update setupPriceFormatting to work with fully editable content
  const setupPriceFormatting = (container) => {
    if (!container) return;

    // Make the container itself editable if not already
    if (!container.hasAttribute("contenteditable")) {
      container.setAttribute("contenteditable", "true");
    }

    // Format on input - only for price spans
    const handleInput = (e) => {
      const target = e.target;

      // Only format price spans, not other content
      if (target.hasAttribute("data-index")) {
        // Get current text
        let text = target.textContent.trim();

        // Remove all non-digits and non-decimal point
        const numberStr = text.replace(/[^\d.]/g, "");

        // Ensure only one decimal point
        const parts = numberStr.split(".");
        const validNumberStr =
          parts[0] + (parts.length > 1 ? "." + parts.slice(1).join("") : "");

        if (validNumberStr) {
          const number = parseFloat(validNumberStr);
          if (!isNaN(number)) {
            // Format with 2 decimals if it has decimal part
            if (number % 1 !== 0) {
              target.textContent = number.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
            } else {
              target.textContent = number.toLocaleString("en-IN");
            }
          }
        } else {
          // Restore original if empty
          const original = target.getAttribute("data-original");
          if (original) {
            const number = parseFloat(original);
            if (number % 1 !== 0) {
              target.textContent = number.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
            } else {
              target.textContent = number.toLocaleString("en-IN");
            }
          }
        }

        // Move cursor to end
        setTimeout(() => {
          const range = document.createRange();
          const selection = window.getSelection();
          range.selectNodeContents(target);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }, 0);
      }
      // If not a price span, let normal editing happen
    };

    // Handle paste - only for price spans
    const handlePaste = (e) => {
      const target = e.target;
      if (target.hasAttribute("data-index")) {
        e.preventDefault();
        const pastedText = e.clipboardData.getData("text/plain");
        // Extract numbers including decimal
        const numbersWithDecimal = pastedText.replace(/[^\d.]/g, "");

        // Ensure only one decimal point
        const parts = numbersWithDecimal.split(".");
        const validNumberStr =
          parts[0] + (parts.length > 1 ? "." + parts.slice(1).join("") : "");

        if (validNumberStr) {
          const number = parseFloat(validNumberStr);
          if (!isNaN(number)) {
            if (number % 1 !== 0) {
              target.textContent = number.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
            } else {
              target.textContent = number.toLocaleString("en-IN");
            }
          }
        }
      }
      // If not a price span, allow normal paste
    };

    // Select all on click - only for price spans
    const handleClick = (e) => {
      const target = e.target;
      if (target.hasAttribute("data-index") && target.isContentEditable) {
        setTimeout(() => {
          const range = document.createRange();
          const selection = window.getSelection();
          range.selectNodeContents(target);
          selection.removeAllRanges();
          selection.addRange(range);
        }, 10);
      }
    };

    // Handle keydown to prevent formatting shortcuts from interfering
    const handleKeyDown = (e) => {
      const target = e.target;

      // Allow normal editing shortcuts (Ctrl+B, Ctrl+I, etc.) for all content
      // But for price spans, prevent formatting
      if (target.hasAttribute("data-index")) {
        // Prevent formatting shortcuts for price spans
        if (e.ctrlKey || e.metaKey) {
          if (
            e.key === "b" ||
            e.key === "i" ||
            e.key === "u" ||
            e.key === "k"
          ) {
            e.preventDefault();
          }
        }
      }
    };

    // Add event listeners
    container.addEventListener("input", handleInput);
    container.addEventListener("paste", handlePaste);
    container.addEventListener("click", handleClick);
    container.addEventListener("keydown", handleKeyDown);

    // Cleanup function
    return () => {
      container.removeEventListener("input", handleInput);
      container.removeEventListener("paste", handlePaste);
      container.removeEventListener("click", handleClick);
      container.removeEventListener("keydown", handleKeyDown);
    };
  };

  // Update extractFareDetailsFromHtml - this remains largely the same
  const extractFareDetailsFromHtml = (container) => {
    const updatedFares = [];

    // Find all editable spans with data-index
    const spans = container.querySelectorAll("span[data-index]");

    spans.forEach((span) => {
      const dataIndex = span.getAttribute("data-index");
      const originalValue = span.getAttribute("data-original");
      const flightType = span.getAttribute("data-flight-type");
      const flightIndex = span.getAttribute("data-flight-index");
      const fareIndex = span.getAttribute("data-fare-index");
      const currentText = span.textContent.trim();

      // Extract numeric value from current text (handles commas and decimals)
      const numberMatch = currentText.match(/[\d,]+(\.\d+)?/);
      if (numberMatch && originalValue) {
        // Parse as float to handle decimals
        const currentValue = parseFloat(numberMatch[0].replace(/,/g, ""));
        const originalValueNum = parseFloat(originalValue);

        updatedFares.push({
          dataIndex: dataIndex,
          flightType:
            flightType || (dataIndex.startsWith("R-") ? "return" : "onward"),
          flightIndex: flightIndex
            ? parseInt(flightIndex)
            : dataIndex.startsWith("R-")
              ? parseInt(dataIndex.split("-")[1])
              : parseInt(dataIndex.split("-")[0]),
          fareIndex: fareIndex
            ? parseInt(fareIndex)
            : dataIndex.startsWith("R-")
              ? parseInt(dataIndex.split("-")[2])
              : parseInt(dataIndex.split("-")[1]),
          originalValue: originalValueNum,
          currentValue: currentValue,
          isEdited: Math.abs(currentValue - originalValueNum) > 0.01, // Use tolerance for float comparison
        });
      }
    });

    return updatedFares;
  };

  const updateRequestDataWithEditedPrices = (requestData, editedFares) => {
    // Deep clone the request data
    const updatedData = JSON.parse(JSON.stringify(requestData));

    // Group edited fares by flight type
    const onwardFares = editedFares.filter(
      (fare) => fare.flightType === "onward",
    );
    const returnFares = editedFares.filter(
      (fare) => fare.flightType === "return",
    );

    // console.log("Onward fares to update:", onwardFares);
    // console.log("Return fares to update:", returnFares);

    // Update onward flight fares for ALL flight options
    if (updatedData.flights?.onward?.flight_options?.length > 0) {
      onwardFares.forEach((fare) => {
        const flightOption =
          updatedData.flights.onward.flight_options[fare.flightIndex];

        if (
          flightOption &&
          flightOption.fare_details &&
          flightOption.fare_details.length > fare.fareIndex
        ) {
          // console.log(`Updating onward flight ${fare.flightIndex}, fare ${fare.fareIndex} to ${fare.currentValue}`);

          // Update the specific fare detail
          flightOption.fare_details[fare.fareIndex].updated_total_price =
            fare.currentValue;

          // Update price field if this is the base fare (fareIndex 0)
          if (fare.fareIndex === 0) {
            flightOption.price = fare.currentValue;
          }
        } else {
          // console.warn(`Could not find onward flight ${fare.flightIndex} or fare ${fare.fareIndex}`);
        }
      });
    }

    // Update return flight fares for ALL flight options
    if (updatedData.flights?.return?.flight_options?.length > 0) {
      returnFares.forEach((fare) => {
        const flightOption =
          updatedData.flights.return.flight_options[fare.flightIndex];

        if (
          flightOption &&
          flightOption.fare_details &&
          flightOption.fare_details.length > fare.fareIndex
        ) {
          // console.log(`Updating return flight ${fare.flightIndex}, fare ${fare.fareIndex} to ${fare.currentValue}`);

          // Update the specific fare detail
          flightOption.fare_details[fare.fareIndex].updated_total_price =
            fare.currentValue;

          // Update price field if this is the base fare (fareIndex 0)
          if (fare.fareIndex === 0) {
            flightOption.price = fare.currentValue;
          }
        } else {
          // console.warn(`Could not find return flight ${fare.flightIndex} or fare ${fare.fareIndex}`);
        }
      });
    }

    return updatedData;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const confirmAndCloseModal = async () => {
    if (!contentRef.current) return;
    setIsSubmitting(true);

    try {
      // 1. Extract edited fares from HTML
      const editedFares = extractFareDetailsFromHtml(contentRef.current);
      // console.log("Edited fares:", editedFares);

      // 2. Update the request data with edited prices
      const updatedRequestData = updateRequestDataWithEditedPrices(
        shareoptionrequest,
        editedFares,
      );

      // 3. Check price comparisons
      let hasPriceLowerThanBase = false;
      let hasPriceEqualToBase = false;
      let hasPriceHigherThanBase = false;
      const priceDetails = [];

      // Helper function to get airline info
      const getAirlineInfo = (flightOption) => {
        // Get flight number from flight_details if available
        let flightNumber = "N/A";
        if (
          flightOption.flight_details &&
          flightOption.flight_details.length > 0
        ) {
          flightNumber = flightOption.flight_details[0].flight_no || "N/A";
        } else {
          flightNumber =
            flightOption.flight_no || flightOption.airline_no || "N/A";
        }

        return {
          name: flightOption.airline_name || "Unknown Airline",
          number: flightNumber,
          code: (
            flightOption.airline_no ||
            flightOption.flight_number ||
            "XX"
          ).split(" ")[0],
          flightNo: flightNumber,
        };
      };

      // Check onward flights
      if (updatedRequestData.flights?.onward?.flight_options?.length > 0) {
        updatedRequestData.flights.onward.flight_options.forEach(
          (flightOption, flightIdx) => {
            const airline = getAirlineInfo(flightOption);

            if (
              flightOption.fare_details &&
              flightOption.fare_details.length > 0
            ) {
              flightOption.fare_details.forEach((fare, fareIdx) => {
                const basePrice = fare.base_price || 0;
                const updatedPrice =
                  fare.updated_total_price || fare.price || 0;

                // Check different conditions
                if (updatedPrice < basePrice) {
                  hasPriceLowerThanBase = true;
                  priceDetails.push({
                    flightType: "Onward",
                    flightNumber: flightIdx + 1,
                    airlineName: airline.name,
                    airlineNumber: airline.number,
                    airlineCode: airline.code,
                    flightNo: airline.flightNo,
                    fareType: fare.fare_type || `Fare ${fareIdx + 1}`,
                    basePrice: basePrice,
                    updatedPrice: updatedPrice,
                    difference: basePrice - updatedPrice,
                    origin: flightOption.from_city_code || "N/A",
                    destination: flightOption.to_city_code || "N/A",
                    condition: "lower",
                  });
                } else if (updatedPrice === basePrice) {
                  hasPriceEqualToBase = true;
                  priceDetails.push({
                    flightType: "Onward",
                    flightNumber: flightIdx + 1,
                    airlineName: airline.name,
                    airlineNumber: airline.number,
                    airlineCode: airline.code,
                    flightNo: airline.flightNo,
                    fareType: fare.fare_type || `Fare ${fareIdx + 1}`,
                    basePrice: basePrice,
                    updatedPrice: updatedPrice,
                    difference: 0,
                    origin: flightOption.from_city_code || "N/A",
                    destination: flightOption.to_city_code || "N/A",
                    condition: "equal",
                  });
                } else if (updatedPrice > basePrice) {
                  hasPriceHigherThanBase = true;
                }
              });
            }
          },
        );
      }

      // Check return flights
      if (updatedRequestData.flights?.return?.flight_options?.length > 0) {
        updatedRequestData.flights.return.flight_options.forEach(
          (flightOption, flightIdx) => {
            const airline = getAirlineInfo(flightOption);

            if (
              flightOption.fare_details &&
              flightOption.fare_details.length > 0
            ) {
              flightOption.fare_details.forEach((fare, fareIdx) => {
                const basePrice = fare.base_price || 0;
                const updatedPrice =
                  fare.updated_total_price || fare.price || 0;

                // Check different conditions
                if (updatedPrice < basePrice) {
                  hasPriceLowerThanBase = true;
                  priceDetails.push({
                    flightType: "Return",
                    flightNumber: flightIdx + 1,
                    airlineName: airline.name,
                    airlineNumber: airline.number,
                    airlineCode: airline.code,
                    flightNo: airline.flightNo,
                    fareType: fare.fare_type || `Fare ${fareIdx + 1}`,
                    basePrice: basePrice,
                    updatedPrice: updatedPrice,
                    difference: basePrice - updatedPrice,
                    origin: flightOption.from_city_code || "N/A",
                    destination: flightOption.to_city_code || "N/A",
                    condition: "lower",
                  });
                } else if (updatedPrice === basePrice) {
                  hasPriceEqualToBase = true;
                  priceDetails.push({
                    flightType: "Return",
                    flightNumber: flightIdx + 1,
                    airlineName: airline.name,
                    airlineNumber: airline.number,
                    airlineCode: airline.code,
                    flightNo: airline.flightNo,
                    fareType: fare.fare_type || `Fare ${fareIdx + 1}`,
                    basePrice: basePrice,
                    updatedPrice: updatedPrice,
                    difference: 0,
                    origin: flightOption.from_city_code || "N/A",
                    destination: flightOption.to_city_code || "N/A",
                    condition: "equal",
                  });
                } else if (updatedPrice > basePrice) {
                  hasPriceHigherThanBase = true;
                }
              });
            }
          },
        );
      }

      // 4. Handle different scenarios based on price comparisons

      // Scenario 1: If any price is lower than base - Show warning with ONLY Review button
      if (hasPriceLowerThanBase) {
        let warningMessage = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; text-align: left;">

          <!-- Header -->
          <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #edf2f7;
          ">
            <div>
              <h4 style="margin: 0; color: #1e293b; font-size: 15px; font-weight: 600;">⚠️ Prices Lower Than Base Fare</h4>
              <p style="margin: 2px 0 0; color: #64748b; font-size: 11px;">Our Prices are below the base fare</p>
            </div>
          </div>

          <!-- Price List - Ultra Compact -->
          <div style="max-height: 280px; overflow-y: auto; padding-right: 2px;">
      `;

        // Only show lower price details
        priceDetails
          .filter((d) => d.condition === "lower")
          .forEach((detail) => {
            warningMessage += `
          <div style="
            background: #ffffff;
            border: 1px solid #fee2e2;
            border-radius: 6px;
            padding: 8px;
            margin-bottom: 6px;
            border-left: 3px solid #dc2626;
          ">
            <!-- Header with Flight Info -->
            <div style="
              display: flex;
              align-items: center;
              gap: 6px;
              margin-bottom: 6px;
            ">
              <span style="
                background: ${detail.flightType === "Onward" ? "#e6f0fa" : "#f0e6fa"};
                color: ${detail.flightType === "Onward" ? "#2563eb" : "#9333ea"};
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 10px;
                font-weight: 500;
              ">${detail.flightType}</span>
              
              <span style="font-weight: 600; font-size: 12px; color: #0f172a;">
                ${detail.airlineName} ${detail.flightNo}
              </span>
              
              <span style="margin-left: auto; font-size: 10px; color: #64748b;">
                ${detail.origin} → ${detail.destination}
              </span>
            </div>

            <!-- Fare Type -->
            <div style="
              display: inline-block;
              background: #f1f5f9;
              color: #475569;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 10px;
              margin-bottom: 6px;
            ">${detail.fareType}</div>

            <!-- Price Row - Horizontal -->
            <div style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              background: #f8fafc;
              border-radius: 4px;
              padding: 6px 8px;
            ">
              <div>
                <span style="font-size: 10px; color: #64748b;">Vendor Price</span>
                <span style="margin-left: 4px; font-weight: 500; color: #334155; font-size: 12px;">₹${detail.basePrice.toLocaleString("en-IN")}</span>
              </div>
              
              <div style="color: #94a3b8;">→</div>
              
              <div>
                <span style="font-size: 10px; color: #64748b;">Our Price</span>
                <span style="margin-left: 4px; font-weight: 600; color: #dc2626; font-size: 12px;">₹${detail.updatedPrice.toLocaleString("en-IN")}</span>
              </div>
              
              <div style="
                background: #fee2e2;
                color: #b91c1c;
                padding: 2px 6px;
                border-radius: 12px;
                font-size: 10px;
                font-weight: 500;
              ">
                -₹${detail.difference.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        `;
          });

        warningMessage += `
          </div>

          <!-- Footer Question - Only Review Option -->
          <div style="
            margin-top: 12px;
            padding: 8px 12px;
            background: #fee2e2;
            border-radius: 6px;
            font-size: 12px;
            color: #991b1b;
            text-align: center;
            font-weight: 500;
          ">
            Please review these prices before proceeding
          </div>
        </div>
      `;

        // Show confirmation alert with ONLY Review button
        const result = await Swal.fire({
          title: "",
          html: warningMessage,
          showCancelButton: false,
          showConfirmButton: true,
          confirmButtonText: "Review",
          confirmButtonColor: "#2563eb",
          width: 380,
          padding: "12px",
          backdrop: "rgba(0,0,0,0.5)",
          // showCloseButton: true,
        });

        // When user clicks Review, stop the process
        if (result.isConfirmed) {
          // console.log("User clicked Review - stopping operation");
          setIsSubmitting(false);
          return; // Stop here, don't proceed to API
        }
      }
      // Scenario 2: If prices are equal to base (but no lower prices) - Show both buttons
      else if (hasPriceEqualToBase && !hasPriceLowerThanBase) {
        let warningMessage = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; text-align: left;">

          <!-- Header -->
          <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #edf2f7;
          ">
            <div>
              <h4 style="margin: 0; color: #1e293b; font-size: 15px; font-weight: 600;">Confirm Price Changes</h4>
              <p style="margin: 2px 0 0; color: #64748b; font-size: 11px;">No price changes detected</p>
            </div>
          </div>

          <!-- Price List - Ultra Compact -->
          <div style="max-height: 280px; overflow-y: auto; padding-right: 2px;">
      `;

        // Show equal price details
        priceDetails
          .filter((d) => d.condition === "equal")
          .forEach((detail) => {
            warningMessage += `
          <div style="
            background: #ffffff;
            border: 1px solid #e9eef2;
            border-radius: 6px;
            padding: 8px;
            margin-bottom: 6px;
          ">
            <!-- Header with Flight Info -->
            <div style="
              display: flex;
              align-items: center;
              gap: 6px;
              margin-bottom: 6px;
            ">
              <span style="
                background: ${detail.flightType === "Onward" ? "#e6f0fa" : "#f0e6fa"};
                color: ${detail.flightType === "Onward" ? "#2563eb" : "#9333ea"};
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 10px;
                font-weight: 500;
              ">${detail.flightType}</span>
              
              <span style="font-weight: 600; font-size: 12px; color: #0f172a;">
                ${detail.airlineName} ${detail.flightNo}
              </span>
              
              <span style="margin-left: auto; font-size: 10px; color: #64748b;">
                ${detail.origin} → ${detail.destination}
              </span>
            </div>

            <!-- Fare Type -->
            <div style="
              display: inline-block;
              background: #f1f5f9;
              color: #475569;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 10px;
              margin-bottom: 6px;
            ">${detail.fareType}</div>

            <!-- Price Row - Horizontal -->
            <div style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              background: #f8fafc;
              border-radius: 4px;
              padding: 6px 8px;
            ">
              <div>
                <span style="font-size: 10px; color: #64748b;">Vendor Price</span>
                <span style="margin-left: 4px; font-weight: 500; color: #334155; font-size: 12px;">₹${detail.basePrice.toLocaleString("en-IN")}</span>
              </div>
              
              <div style="color: #94a3b8;">→</div>
              
              <div>
                <span style="font-size: 10px; color: #64748b;">Our Price</span>
                <span style="margin-left: 4px; font-weight: 600; color: #059669; font-size: 12px;">₹${detail.updatedPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        `;
          });

        warningMessage += `
          </div>

          <!-- Footer Question - Both Options -->
          <div style="
            margin-top: 12px;
            padding: 8px 12px;
            background: #f0f9ff;
            border-radius: 6px;
            font-size: 12px;
            color: #0369a1;
            text-align: center;
            font-weight: 500;
          ">
            Are you sure you want to proceed with these prices?
          </div>
        </div>
      `;

        // Show confirmation alert with both buttons
        const result = await Swal.fire({
          title: "",
          html: warningMessage,
          showCancelButton: true,
          confirmButtonText: "Proceed Anyway",
          cancelButtonText: "Review",
          confirmButtonColor: "#059669",
          cancelButtonColor: "#64748b",
          width: 380,
          padding: "12px",
          backdrop: "rgba(0,0,0,0.5)",
          showCloseButton: true,
          reverseButtons: true,
        });

        // If user clicks Review, stop the process
        if (!result.isConfirmed) {
          // console.log("User clicked Review - stopping operation");
          setIsSubmitting(false);
          return;
        }
        // If Proceed Anyway clicked, continue to API (fall through to API call)
      }

      // ===== REMOVE ALL HIGHLIGHTING, OUTLINES, AND EDITING INDICATORS FROM THE CONTENT BEFORE SENDING =====

      // Create a deep clone of the content to modify for email
      const emailContent = contentRef.current.cloneNode(true);

      // Function to remove all highlighting styles, outlines, borders, and editing indicators
      const removeAllHighlighting = (element) => {
        if (!element) return;

        // Remove common highlight classes
        const highlightClasses = [
          "editable-highlight",
          "editable-price",
          "highlight",
          "editable",
          "bg-warning",
          "bg-yellow",
          "yellow-bg",
          "editable-field",
          "price-editable",
          "editable-cell",
          "highlighted",
          "editable-price-cell",
        ];

        highlightClasses.forEach((className) => {
          if (element.classList && element.classList.contains(className)) {
            element.classList.remove(className);
          }
        });

        // Remove any inline styles that might cause highlighting or outlines
        if (element.style) {
          // Remove background colors
          const bgColor = element.style.backgroundColor;
          if (
            bgColor &&
            (bgColor.includes("255, 243, 205") || // #fff3cd
              bgColor.includes("#fff3cd") ||
              bgColor.includes("yellow") ||
              bgColor.includes("#ffff99") ||
              bgColor.includes("#ffeb3b") ||
              bgColor.includes("rgb(255, 243, 205)") ||
              bgColor.includes("#fef9e7") ||
              bgColor.includes("#fff3e0"))
          ) {
            element.style.backgroundColor = "";
          }

          // Remove cursor pointer that indicates editability
          if (
            element.style.cursor === "pointer" ||
            element.style.cursor === "text"
          ) {
            element.style.cursor = "";
          }

          // Remove ALL outlines (this is key for removing the outline you mentioned)
          if (element.style.outline) {
            element.style.outline = "";
          }

          // Remove borders that might have been added for highlighting
          if (
            element.style.border &&
            (element.style.border.includes("2px") ||
              element.style.border.includes("dashed") ||
              element.style.border.includes("dotted"))
          ) {
            element.style.border = "";
          }

          // Remove box-shadow that might indicate highlight
          if (element.style.boxShadow) {
            element.style.boxShadow = "";
          }

          // Remove any border properties
          if (element.style.borderColor) element.style.borderColor = "";
          if (element.style.borderWidth) element.style.borderWidth = "";
          if (element.style.borderStyle) element.style.borderStyle = "";

          // Remove focus rings
          if (element.style.ring) element.style.ring = "";
          if (element.style.ringColor) element.style.ringColor = "";
          if (element.style.ringOffset) element.style.ringOffset = "";
        }

        // Remove specific attributes that might cause highlighting
        const attrsToRemove = [
          "data-editable",
          "data-highlighted",
          "contenteditable",
          "data-price-edited",
        ];
        attrsToRemove.forEach((attr) => {
          if (element.hasAttribute && element.hasAttribute(attr)) {
            element.removeAttribute(attr);
          }
        });

        // Remove style attribute if it only contained highlighting styles
        const styleAttr = element.getAttribute("style");
        if (styleAttr) {
          // If after processing, style is empty or only contains whitespace, remove it
          const cleanedStyle = styleAttr
            .replace(/background-color:\s*[^;]+;?/gi, "")
            .replace(/background:\s*[^;]+;?/gi, "")
            .replace(/cursor:\s*[^;]+;?/gi, "")
            .replace(/outline:\s*[^;]+;?/gi, "")
            .replace(/border:\s*[^;]+;?/gi, "")
            .replace(/border-\w+:\s*[^;]+;?/gi, "")
            .replace(/box-shadow:\s*[^;]+;?/gi, "")
            .replace(/ring:\s*[^;]+;?/gi, "")
            .trim();

          if (cleanedStyle === "") {
            element.removeAttribute("style");
          } else {
            element.setAttribute("style", cleanedStyle);
          }
        }

        // Recursively process all children
        if (element.children) {
          Array.from(element.children).forEach((child) =>
            removeAllHighlighting(child),
          );
        }
      };

      // Apply highlighting removal to the entire email content
      removeAllHighlighting(emailContent);

      // Specifically target table cells that might contain prices
      const tableCells = emailContent.querySelectorAll("td, th");
      tableCells.forEach((cell) => {
        removeAllHighlighting(cell);

        // Check if cell contains price (₹ symbol)
        if (cell.textContent && cell.textContent.includes("₹")) {
          // Ensure no special styling on price cells
          if (cell.style) {
            cell.style.backgroundColor = "";
            cell.style.outline = "";
            cell.style.border = "";
          }
        }
      });

      // Target any elements that might have been edited
      const editedElements = emailContent.querySelectorAll(
        '[class*="edit"], [style*="background"], [style*="cursor"], [style*="outline"], [style*="border"]',
      );
      editedElements.forEach((el) => {
        removeAllHighlighting(el);
      });

      // Get the cleaned HTML for email
      const emailHtmlContent = emailContent.innerHTML;

      // Also clean the original content for UI update after successful send
      const cleanOriginalContent = () => {
        if (contentRef.current) {
          removeAllHighlighting(contentRef.current);
        }
      };

      // 5. Prepare the final request with cleaned HTML (no highlights, no outlines)
      const finalRequest = {
        ...updatedRequestData,
        // Add current email values from state
        email: Array.isArray(spocEmails) ? spocEmails.filter(Boolean) : [],
        cc_email: Array.isArray(ccEmails) ? ccEmails.filter(Boolean) : [],
        additional_emails: Array.isArray(additionalEmails)
          ? additionalEmails.filter(Boolean)
          : [],
        htmlContent: emailHtmlContent,
        flag: "send",
      };

      // 6. Send to server
      const response = await fetch(
        `${CONFIG.MAIN_API}/api/flights/addCotravFlightOptionBooking`,
        {
          method: "POST",
          headers: {
            Origin: "*",
            // 'Content-Type': 'application/json',
          },
          body: JSON.stringify(finalRequest),
        },
      );

      const responseData = await response.json();

      if (responseData.success === "1") {
        // Clean the original content to remove highlights from the modal UI
        cleanOriginalContent();

        await Swal.fire({
          title: "Success!",
          text: "Mail has been sent successfully.",
          imageUrl: "https://cdn-icons-png.flaticon.com/512/845/845646.png",
          imageWidth: 75,
          imageHeight: 75,
          confirmButtonText: "OK",
          confirmButtonColor: "#10b981",
        });

        setShowModal(false);
        // if (onSuccess) onSuccess();
      } else {
        Swal.fire({
          title: "Error!",
          text: responseData.message || "Failed to update prices.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (error) {
      // console.error("Error:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while updating prices.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  // Add a debug function to see what's in the HTML
  const debugHtmlContent = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // console.log("=== DEBUGGING HTML ===");

    // Find all price cells
    const priceCells = doc.querySelectorAll(
      'table:has(th[bgcolor="#785eff"]) td:last-child',
    );
    // console.log(`Found ${priceCells.length} price cells`);

    priceCells.forEach((cell, index) => {
      // console.log(`\nPrice Cell ${index}:`);
      // console.log("HTML:", cell.innerHTML);
      // console.log("Text:", cell.textContent);

      // Find spans
      const spans = cell.querySelectorAll("span");
      // console.log(`Found ${spans.length} spans in this cell:`);

      spans.forEach((span, spanIndex) => {
        // console.log(`  Span ${spanIndex}:`, {
        //   text: span.textContent,
        //   "data-index": span.getAttribute("data-index"),
        //   outerHTML: span.outerHTML,
        // });
      });
    });

    // Return original HTML if you want to see it
    return htmlContent;
  };

  useEffect(() => {
    if (showModal && htmlContent) {
      // Transform the HTML
      const transformed = transformHtmlForEditing(htmlContent);

      // Update state with transformed HTML
      setHtmlContent(transformed);

      // Setup formatting after DOM is updated
      setTimeout(() => {
        if (contentRef.current) {
          setupPriceFormatting(contentRef.current);

          // Add some CSS to indicate editable areas (optional)
          const style = document.createElement("style");
          style.textContent = `
          [contenteditable="true"]:focus {
            outline: 2px solid #007bff;
            outline-offset: 2px;
          }
          span[data-index] {
            background-color: #fff8e1 !important;
            border: 1px solid #ff9800 !important;
          }
        `;
          document.head.appendChild(style);
        }
      }, 50);
    }
  }, [showModal, htmlContent]);

  const isBookDisabled =
    !selectedFareforbooking?.Onward || !selectedFareforbooking?.Return;

  return (
    <div
      className="yield-content font-Montserrat"
      style={{ background: "#e8e4ff" }}
    >
      <header className="search-bar" id="widgetHeader">
        <form id="submit-form" action="" method="POST" autoComplete="off">
          <div id="search-widget" className="hsw v2">
            <div className="hsw_inner" style={{ marginLeft: "7%" }}>
              <div className="hsw_inputBox tripTypeWrapper">
                <label
                  htmlFor="tripType"
                  className="lbl_input latoBold font12 blueText appendBottom5"
                >
                  TRIP TYPE
                </label>
                <div className="selectDropdown">
                  <select
                    id="tripType"
                    className="tripTypeSelect"
                    name="bookingtype"
                    value={inputValue.bookingType || triptype}
                    onChange={handleBookingtype}
                    disabled={bookingid}
                    style={{
                      backgroundColor: bookingid ? "#e0e0e0" : "white",
                      fontSize: "14px",
                      fontWeight: "600",
                      height: "40px",
                    }}
                  >
                    <option value="1">One Way</option>
                    <option value="2">Return</option>
                  </select>
                  <div className="dropdownIcon">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 10l5 5 5-5"
                        stroke="#666"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="hsw_inputBox">
                <label
                  htmlFor="fromCity"
                  className="lbl_input latoBold font12 blueText appendBottom5"
                >
                  FROM
                </label>
                <div
                  className="input-a"
                  style={{ backgroundColor: bookingid ? "#e0e0e0" : "white" }}
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    className="text_input"
                    value={inputOrigin}
                    onChange={handleChange}
                    onFocus={() => {
                      if (filteredAirports.length > 0) setShowDropdown(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowDropdown(false), 150);
                      handleBlur();
                    }} // delay to allow click
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                    disabled={bookingid}
                  />

                  {showDropdown && (
                    <ul
                      style={{
                        position: "absolute",
                        top: "100%",
                        marginLeft: "-8px",
                        borderRadius: "3px",
                        backgroundColor: "#fff",
                        paddingLeft: "6px",
                        width: "100%",
                        border: "1px solid #e3e3e3",
                        listStyle: "none",
                        width: "100%",
                        zIndex: "9999",
                        maxHeight: "150px",
                        minHeight: "auto",
                        overflow: "auto",
                      }}
                    >
                      {filteredAirports.map((airport, index) => (
                        <li
                          key={index}
                          onClick={() => handleSelect(airport)}
                          style={{
                            cursor: "pointer",
                            fontFamily: "Montserrat",
                            color: "#4c4c4c",
                            fontSize: "10px",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            paddingRight: "5px",
                          }}
                        >
                          {airport.label}
                          <div style={{ fontSize: "11px", color: "#888" }}>
                            {airport.airportName}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  className="swapbutton"
                  disabled={bookingid}
                  onClick={swapOriginAndDestination}
                >
                  <img src="/img/Swap-01.png" width={"17px"} />
                </button>
              </div>

              <div className="hsw_inputBox">
                <label
                  htmlFor="toCity"
                  className="lbl_input latoBold font12 blueText appendBottom5"
                >
                  TO
                </label>
                <div
                  className="input-a"
                  style={{ backgroundColor: bookingid ? "#e0e0e0" : "white" }}
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    className="text_input"
                    value={inputDestination}
                    onChange={handledesinationChange}
                    onFocus={() => {
                      if (filteredDestinationAirports.length > 0)
                        setShowDestinationDropdown(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowDestinationDropdown(false), 150);
                      handleBlur();
                    }} // delay to allow click
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                    disabled={bookingid}
                  />

                  {showDestinationDropdown && (
                    <ul
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        maxHeight: "150px",
                        overflowY: "auto",
                        zIndex: 9999,
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                      }}
                    >
                      {filteredDestinationAirports.map((airport, index) => (
                        <li
                          key={index}
                          onClick={() => handledestinationSelect(airport)}
                          style={{
                            cursor: "pointer",
                            fontFamily: "Montserrat",
                            color: "#4c4c4c",
                            fontSize: "10px",
                            paddingTop: "5px",
                            paddingBottom: "5px",
                            paddingRight: "5px",
                          }}
                        >
                          {airport.label}
                          <div style={{ fontSize: "11px", color: "#888" }}>
                            {airport.airportName}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
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

              <div className="hsw_inputBox">
                <label className="lbl_input latoBold font12 blueText appendBottom5">
                  DEPART
                </label>
                <div
                  className="input-a"
                  style={{
                    width: "120px",
                    height: "40.5px",
                    backgroundColor: bookingid ? "#e0e0e0" : "white",
                  }}
                >
                  <div style={{ fontSize: "14px", fontWeight: "600" }}>
                    <DatePicker
                      className="custom-datepicker mt-1"
                      name="searchdeparture"
                      selected={inputValue.departureDate}
                      onChange={handleDepartureDateChange}
                      onBlur={handleBlur}
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}
                      value={ddmmyyyyformatDate(inputValue.departureDate)}
                      disabled={bookingid}
                      style={{ fontSize: "5px" }}
                    />
                  </div>

                  <span className="date-icon"></span>
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
                  Please select Depart Date
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
                  Please select valid Depart Date
                </div>
              </div>

              <div className="hsw_inputBox" id="departurereturn">
                <label
                  htmlFor="return"
                  className="lbl_input latoBold font12 blueText appendBottom5"
                >
                  RETURN
                </label>
                <div
                  className="input-a"
                  style={{
                    width: "120px",
                    backgroundColor: bookingid ? "#e0e0e0" : "white",
                  }}
                >
                  <DatePicker
                    name="searchreturnDate"
                    selected={inputValue.returnDate || inputValue.departureDate}
                    onChange={handleReturnDateChange}
                    dateFormat="dd/MM/yyyy"
                    minDate={inputValue.departureDate || new Date()}
                    placeholderText="Add Return Date"
                    value={
                      inputValue.bookingType === "1"
                        ? "__/__/____"
                        : inputValue.returnDate
                          ? ddmmyyyyformatDate(inputValue.returnDate)
                          : ddmmyyyyformatDate(inputValue.departureDate)
                    }
                    // disabled={!isReturnEnabled}
                    // open={isretOpen}
                    // onClickOutside={() => setretIsOpen(false)}
                    // disabled={bookingid}
                    disabled={inputValue.bookingType === "1" || bookingid}
                    className="custom-datepicker"
                    style={{ fontSize: "5px", paddingBottom: "4px" }}
                  />
                  <span className="date-icon"></span>
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

              <div className="hsw_inputBox">
                <label
                  htmlFor="travellerAndClass"
                  className="lbl_input latoBold font12 blueText appendBottom5"
                >
                  PASSENGERS &amp; CLASS
                </label>
                <div
                  className="input-a"
                  style={{
                    width: "250px",
                    height: "40px",
                    backgroundColor: bookingid ? "#e0e0e0" : "white",
                  }}
                >
                  <input
                    type="text"
                    id="openpassengermodal"
                    name="openpassengermodal"
                    className="openpassengermodal srch-lbl mt-1"
                    placeholder="Select all"
                    value={`${cabinClass}, Adult: ${adultCount}, Child: ${childCount}, Infant: ${infantCount}`}
                    onClick={handleToggle}
                    onBlur={handleBlur}
                    disabled={bookingid}
                    readOnly
                    title={`${cabinClass}, Adult: ${adultCount}, Child: ${childCount}, Infant: ${infantCount}`}
                    style={{ fontSize: "14px", fontWeight: "600" }}
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
                <div
                  className="search-asvanced"
                  style={{
                    display: isOpen ? "block" : "none",
                    marginTop: "1%",
                    marginLeft: "-43%",
                  }}
                >
                  <div className="search-large-i">
                    <div className="srch-tab-line no-margin-bottom">
                      <label style={{ textAlign: "left", marginBottom: "0px" }}>
                        Adults (12y +)
                      </label>
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
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
                          <Fragment key={value}>
                            <input
                              type="radio"
                              name="adult"
                              id={`adult${value}`}
                              value={value}
                              onChange={(e) => handleAdult(e.target.value)}
                              // checked={Cookies.get('cookiesData') ? value.toString() === adultCount.toString() : value === 1}
                              checked={
                                Cookies.get("cookiesData")
                                  ? value.toString() ===
                                    (adultCount ? adultCount.toString() : "")
                                  : value === 1
                              }
                            />
                            <label htmlFor={`adult${value}`}>{value}</label>
                          </Fragment>
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
                        <label
                          style={{ textAlign: "left", marginBottom: "0px" }}
                        >
                          Children (2y - 12y)
                        </label>
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
                            <Fragment key={value}>
                              <input
                                type="radio"
                                name="child"
                                id={`child${value}`}
                                value={value}
                                onChange={(e) => handleChild(e.target.value)}
                                checked={
                                  Cookies.get("cookiesData")
                                    ? value.toString() ===
                                      (childCount ? childCount.toString() : "")
                                    : value === 0
                                }
                              />
                              <label htmlFor={`child${value}`}>{value}</label>
                            </Fragment>
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
                        <label
                          style={{ textAlign: "left", marginBottom: "0px" }}
                        >
                          Infants (below 2y)
                        </label>
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
                            <Fragment key={value}>
                              <input
                                type="radio"
                                name="infant"
                                id={`infant${value}`}
                                value={value}
                                onChange={(e) => handleInfant(e.target.value)}
                                checked={
                                  Cookies.get("cookiesData")
                                    ? value.toString() ===
                                      (infantCount
                                        ? infantCount.toString()
                                        : "")
                                    : value === 0
                                }
                              />
                              <label htmlFor={`infant${value}`}>{value}</label>
                            </Fragment>
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
                      <label style={{ marginBottom: "1%", textAlign: "left" }}>
                        Choose Travel Class
                      </label>
                      <div className="select-wrapper1 select-wrapper2">
                        {["Economy/Premium Economy", "Business", "First"].map(
                          (value) => (
                            <Fragment key={value}>
                              <input
                                type="radio"
                                name="classtype"
                                id={`classtype${value}`}
                                value={value}
                                onChange={(e) =>
                                  handleClasstype(e.target.value)
                                }
                                checked={
                                  cabinClass?.toString() === "Economy" &&
                                  value === "Economy/Premium Economy"
                                    ? true
                                    : cabinClass?.toString() === value
                                }
                              />
                              <label
                                style={{ lineHeight: "2" }}
                                htmlFor={`classtype${value}`}
                              >
                                {value === "Economy/Premium Economy"
                                  ? value
                                  : `${value} class`}
                              </label>
                            </Fragment>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="search-buttonn"
                    style={{ marginLeft: "80%", height: "30px" }}
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="srch-btn"
                style={{
                  width: "98px",
                  marginBottom: "-5px",
                  height: "39px",
                  fontSize: "14px",
                  // Add cursor style for disabled state
                  cursor:
                    inputValue.bookingType === "1" ||
                    (bookingid !== null &&
                      bookingid !== undefined &&
                      bookingid !== "")
                      ? "not-allowed"
                      : "pointer",
                  // Optional: make it look more disabled
                  opacity:
                    inputValue.bookingType === "1" ||
                    (bookingid !== null &&
                      bookingid !== undefined &&
                      bookingid !== "")
                      ? 0.6
                      : 1,
                }}
                disabled={
                  inputValue.bookingType === "1" ||
                  (bookingid !== null &&
                    bookingid !== undefined &&
                    bookingid !== "")
                }
                onClick={() => {
                  fetchData();
                  handleserachfunction();
                }}
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </header>
      {loadingg && (
        <div className="page-center-loader flex items-center justify-center backdrop-blur-sm bg-white/30">
          <div className="big-loader flex items-center justify-center">
            <img
              className="loader-gif"
              src="/img/cotravloader.gif"
              alt="Loader"
            />
            <p className="text-center ml-4 text-gray-600 text-lg">
              Retrieving flight details. Please wait a moment.
            </p>
          </div>
        </div>
      )}
      {journeytype == "1" ? (
        <div className="main-cont" id="main_cont">
          <div className="body-wrapper ">
            <div className="wrapper-padding">
              <div className="two-colls">
                <div className="two-colls-left font-Montserrat space-y-2">
                  {Array.isArray(FlightOptions) && FlightOptions.length > 0 && (
                    <>
                      <div className="side-block fly-in">
                        <button
                          className="scrolltotop"
                          type="button"
                          onClick={handleClearFilters}
                        >
                          Clear All Filters
                        </button>
                      </div>
                      <div className="side-block fly-in side-padding">
                        <h4 className="side-lbl">
                          STOPS FROM{" "}
                          {inputValue.originAirport
                            ? inputOrigin.split(/[-(]/)[0].trim()
                            : fromAirport.split(/[-(]/)[0].trim()}{" "}
                        </h4>
                        <div className="space-y-2 text-[10px] text-gray-500 ">
                          {Array.from(
                            new Set([
                              0,
                              ...FlightOptions?.map(
                                (data) => data?.flight?.segments?.length - 1,
                              ).filter((stops) => stops > 0),
                            ]),
                          )
                            .sort((a, b) => a - b)
                            .map((stopCount) => (
                              <label
                                key={stopCount}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="checkbox"
                                  className="accent-blue-600"
                                  checked={selectedStops.has(stopCount)}
                                  onChange={() => {
                                    toggleStop(stopCount);
                                    setShowPrices(new Set());
                                  }}
                                />
                                <span>
                                  {stopCount === 0
                                    ? "Non Stop"
                                    : `${stopCount} Stop${
                                        stopCount > 1 ? "s" : ""
                                      }`}
                                </span>
                              </label>
                            ))}
                        </div>
                      </div>

                      {/* Departure Time Filter */}
                      <div className="side-block fly-in side-padding">
                        <h4 className="side-lbl">
                          DEPARTURE FROM{" "}
                          {inputValue.originAirport
                            ? inputOrigin.split(/[-(]/)[0].trim()
                            : fromAirport.split(/[-(]/)[0].trim()}
                        </h4>
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          {TIME_SLOTS.map((slot) => (
                            <div
                              key={slot.key}
                              className={`appendBottom12 filterTimeSlots cursor-pointer ${
                                selectedDepartures.includes(slot.key)
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() => {
                                toggleSelection(slot.key, true);
                                setShowPrices(new Set());
                              }}
                            >
                              <span
                                className="appendBottom2 checkBlockIcon block w-8 h-8 bg-no-repeat bg-contain"
                                style={{
                                  backgroundImage: `url(https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/${slot.img}?v=1)`,
                                }}
                              />
                              <div className="boldFont">{slot.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Arrival Time Filter */}
                      <div className="side-block fly-in side-padding">
                        <h4 className="side-lbl">
                          ARRIVAL AT{" "}
                          {inputValue.destinationAriport
                            ? inputDestination.split(/[-(]/)[0].trim()
                            : ToAirport.split(/[-(]/)[0].trim()}
                        </h4>
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          {TIME_SLOTS.map((slot) => (
                            <div
                              key={slot.key}
                              className={`appendBottom12 filterTimeSlots cursor-pointer ${
                                selectedArrivals.includes(slot.key)
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() => {
                                toggleSelection(slot.key, false);
                                setShowPrices(new Set());
                              }}
                            >
                              <span
                                className="appendBottom2 checkBlockIcon block w-8 h-8 bg-no-repeat bg-contain"
                                style={{
                                  backgroundImage: `url(https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/${slot.img}?v=1)`,
                                }}
                              />
                              <div className="boldFont">{slot.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Airlines Filter */}
                      <div className="side-block fly-in side-padding">
                        <h4 className="side-lbl">AIRLINES</h4>
                        <div className="side-block fly-in">
                          <div className="side-stars text-[11px] text-gray-500">
                            {uniqueAirlines.map((airline, idx) => (
                              <label
                                key={idx}
                                className="flex items-center space-x-2 mb-1 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  className="accent-blue-600"
                                  checked={selectedAirlines.has(airline.name)}
                                  onChange={() => {
                                    toggleAirline(airline.name);
                                    setShowPrices(new Set());
                                  }}
                                />
                                <span className="flex items-center space-x-1">
                                  <img
                                    src={airline.logo}
                                    alt={airline.name}
                                    className="w-4 h-4 object-contain"
                                  />
                                  <span>{airline.name}</span>
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* Price Filter */}
                      <div className="side-block fly-in">
                        <div className="side-price">
                          <div className="price-ammounts">
                            <p className="price-ammountsp">
                              <label htmlFor="amount" className="side-lbl">
                                Price range:
                              </label>
                            </p>
                          </div>
                          <div className="price-ranger">
                            <Slider
                              min={minFare}
                              max={maxFare}
                              range
                              value={priceRange}
                              onChange={(value) => {
                                setPriceRange(value);
                                setShowPrices(new Set());
                              }}
                            />
                          </div>
                          <div className="price-ammounts">
                            <input
                              type="text"
                              id="ammount-from"
                              value={priceRange[0]}
                              readOnly
                            />
                            <input
                              type="text"
                              id="ammount-to"
                              value={priceRange[1]}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                      <div className="side-block fly-in">
                        <button
                          className="scrolltotop"
                          type="button"
                          onClick={handleScrollToTop}
                        >
                          Scroll To Top
                        </button>
                      </div>
                    </>
                  )}
                </div>
                {/* sidebar end */}
                {Array.isArray(FlightOptions) && FlightOptions.length > 0 ? (
                  <div className="two-colls-right">
                    <div className="two-colls-right-b">
                      <div className="padding">
                        <div className="catalog-row" id="catalog">
                          <div className="row catalog_filters">
                            <div
                              className="col-md-2 departurefilter cursor-pointer"
                              onClick={() => handleSort("departure")}
                              style={{
                                opacity:
                                  sortField === "departure" ? "1" : "0.5",
                              }}
                            >
                              Departure
                              {sortField === "departure" && (
                                <span style={{ marginLeft: "5px" }}>
                                  {sortOrder === "asc" ? "↓" : "↑"}
                                </span>
                              )}
                            </div>
                            <div
                              className="col-md-3 travelfilter cursor-pointer"
                              onClick={() => handleSort("travelTime")}
                              style={{
                                opacity:
                                  sortField === "travelTime" ? "1" : "0.5",
                              }}
                            >
                              Travel Time
                              {sortField === "travelTime" && (
                                <span style={{ marginLeft: "5px" }}>
                                  {sortOrder === "asc" ? "↓" : "↑"}
                                </span>
                              )}
                            </div>
                            <div
                              className="col-md-2 arriavelfilter cursor-pointer"
                              onClick={() => handleSort("arrival")}
                              style={{
                                opacity: sortField === "arrival" ? "1" : "0.5",
                              }}
                            >
                              Arrival
                              {sortField === "arrival" && (
                                <span style={{ marginLeft: "5px" }}>
                                  {sortOrder === "asc" ? "↓" : "↑"}
                                </span>
                              )}
                            </div>
                            {/* <div
                              className="col-md-2 stopsfilter cursor-pointer"
                              onClick={() => handleSort("stops")}
                              style={{
                                opacity: sortField === "stops" ? "1" : "0.5",
                              }}
                            >
                              Stops
                              {sortField === "stops" && (
                                <span style={{ marginLeft: "5px" }}>
                                  {sortOrder === "asc" ? "↓" : "↑"}
                                </span>
                              )}
                            </div> */}
                            <div
                              className="col-md-3 pricefilter cursor-pointer"
                              onClick={() => handleSort("price")}
                              style={{
                                opacity: sortField === "price" ? "1" : "0.5",
                              }}
                            >
                              Price
                              {sortField === "price" && (
                                <span style={{ marginLeft: "5px" }}>
                                  {sortOrder === "asc" ? "↓" : "↑"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div
                          className="overflow-y-auto mt-2"
                          // style={{ maxHeight: "calc(100vh - 30px)" }}
                        >
                          {sortedFlights?.length === 0 ? (
                            <div className="Searchresult text-center">
                              <div
                                className="pl-10 ml-10"
                                style={{ paddingLeft: "160px" }}
                              >
                                <img
                                  src="/img/FlightNotFound.png"
                                  alt="Flight Not Found"
                                  className="w-2/3"
                                />
                              </div>
                              <p className="font-semibold text-gray-700 mb-0">
                                These flights are not available. Please modify
                                your search.
                              </p>
                            </div>
                          ) : (
                            // Onward flights section
                            sortedFlights.map((response, index) => {
                              const FlightInfo = response?.flight;
                              const flightId = getFlightUniqueId(FlightInfo);
                              const depTime = FlightInfo?.depTime || "";
                              const arrTime = FlightInfo?.arrTime || "";

                              const formattedDepTime = FlightInfo?.depTime
                                ? format(new Date(depTime), "HH:mm")
                                : "N/A";
                              const formattedArrTime = FlightInfo?.arrTime
                                ? format(new Date(arrTime), "HH:mm")
                                : "N/A";

                              // Calculate duration
                              const durationMs =
                                new Date(arrTime).getTime() -
                                new Date(depTime).getTime();
                              const durationHours = Math.floor(
                                durationMs / (1000 * 60 * 60),
                              );
                              const durationMinutes = Math.floor(
                                (durationMs % (1000 * 60 * 60)) / (1000 * 60),
                              );
                              const duration = `${durationHours}H ${durationMinutes}M`;

                              // Layover calculation
                              const segments = FlightInfo.segments;
                              let totalLayoverMinutes = 0;
                              let Totallayover = "";
                              if (segments.length > 1) {
                                for (let i = 0; i < segments.length - 1; i++) {
                                  const arrivalTime = dayjs(
                                    segments[i].Destination.ArrTime,
                                  );
                                  const nextDepartureTime = dayjs(
                                    segments[i + 1].Origin.DepTime,
                                  );
                                  const layoverMinutes = nextDepartureTime.diff(
                                    arrivalTime,
                                    "minute",
                                  );
                                  totalLayoverMinutes += layoverMinutes;
                                }

                                const totalLayoverDuration = dayjs.duration(
                                  totalLayoverMinutes,
                                  "minutes",
                                );
                                const totalHours = totalLayoverDuration.hours();
                                const totalMinutes =
                                  totalLayoverDuration.minutes();

                                Totallayover = `${
                                  totalHours > 0 ? `${totalHours}h ` : ""
                                }${totalMinutes}m Total Layover`;
                              }

                              // Fare processing - ONLY if currentFlightFares exists
                              let uniqueFares = [];
                              const currentFlightFares = flightFares[flightId];

                              //  IMPORTANT: Sirf tabhi process karo jab data ho
                              // if (currentFlightFares) {
                              const formattedUapiFares = (
                                currentFlightFares?.uapi_fares || []
                              ).map((fare) => ({
                                type: (fare.SupplierFareClass || "").trim(),
                                price: parseFloat(fare.TotalPrice),
                                from: "Uapi",
                                Resultindex: fare.ResultIndex,
                                TraceId: fare.trace_id,
                              }));

                              const formattedTboFares = (
                                currentFlightFares?.tbo_fares || []
                              ).map((fare) => ({
                                type: (
                                  fare.SupplierFareClass || "Regular Fare"
                                ).trim(),
                                price: parseFloat(fare.TotalPrice),
                                from: "Tbo",
                                Resultindex: fare.ResultIndex,
                                TraceId: fare.trace_id,
                              }));

                              // Combine all fares
                              const combinedFares = [
                                ...formattedUapiFares,
                                ...formattedTboFares,
                              ];

                              // Group by fare type
                              const grouped = combinedFares.reduce(
                                (acc, fare) => {
                                  if (!acc[fare.type]) acc[fare.type] = [];
                                  acc[fare.type].push(fare);
                                  return acc;
                                },
                                {},
                              );

                              // Apply rules
                              Object.keys(grouped).forEach((fareType) => {
                                const fares = grouped[fareType];

                                if (
                                  fareType.toLowerCase().includes("corporate")
                                ) {
                                  const uapiFare = fares.find(
                                    (f) => f.from === "Uapi",
                                  );
                                  if (uapiFare) {
                                    uniqueFares.push(uapiFare);
                                  } else {
                                    uniqueFares.push(fares[0]);
                                  }
                                  return;
                                }

                                const cheapest = fares.reduce((a, b) =>
                                  a.price < b.price ? a : b,
                                );
                                uniqueFares.push(cheapest);
                              });

                              // Sort by price ASC
                              uniqueFares.sort((a, b) => a.price - b.price);
                              // }

                              // Number of days calculation
                              const dep = new Date(depTime);
                              const arr = new Date(arrTime);
                              const depDate = new Date(
                                dep.getFullYear(),
                                dep.getMonth(),
                                dep.getDate(),
                              );
                              const arrDate = new Date(
                                arr.getFullYear(),
                                arr.getMonth(),
                                arr.getDate(),
                              );
                              const diffInMs =
                                arrDate.getTime() - depDate.getTime();
                              const diffInDays = Math.round(
                                diffInMs / (1000 * 60 * 60 * 24),
                              );
                              const date = new Date(arr);

                              const options = {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              };
                              const formattedDate = date.toLocaleDateString(
                                "en-GB",
                                options,
                              );

                              return (
                                <div
                                  key={flightId} //  key flightId based
                                  className={`flight-item fly-in ${
                                    selectedFlightIds.includes(index)
                                      ? "selected-flight"
                                      : ""
                                  }`}
                                >
                                  <div className="flt-i-a flex flex-col">
                                    <div className="flt-i-b">
                                      <div className="flt-l-b">
                                        {/* Airline logos and names section */}
                                        <div className="mb-1">
                                          {[
                                            ...new Set(
                                              FlightInfo?.segments?.map(
                                                (segment) =>
                                                  segment.Airline.AirlineLogo,
                                              ),
                                            ),
                                          ].map((logo) => {
                                            return (
                                              <img
                                                key={logo}
                                                src={`${logo}`}
                                                className="w-9 h-9 inline-block mr-2"
                                                alt="airline logo"
                                              />
                                            );
                                          })}
                                          <p className="cardbody_font font-Montserrat mt-1 mb-1">
                                            {[
                                              ...new Set(
                                                FlightInfo?.segments?.map(
                                                  (segment) =>
                                                    segment.Airline.AirlineName,
                                                ),
                                              ),
                                            ].join(" , ")}
                                          </p>
                                        </div>
                                        <p className="text-[11px] font-Montserrat mb-1">
                                          {FlightInfo?.segments
                                            ?.map(
                                              (segment) =>
                                                `${segment.Airline.AirlineCode} ${segment.Airline.FlightNumber}`,
                                            )
                                            .join(" , ")}
                                        </p>
                                      </div>

                                      <div className="flt-l-c">
                                        <div className="flt-l-cb flight-line">
                                          {/* Departure section */}
                                          <div
                                            className="flight-line-a"
                                            style={{ width: "58px" }}
                                          >
                                            <div className="text-[15px] font-bold">
                                              {formattedDepTime}
                                            </div>
                                            <div className="cardbody_font">
                                              {
                                                FlightInfo?.originAirport
                                                  ?.CityName
                                              }{" "}
                                            </div>
                                            <div className="apiairportresult">
                                              {
                                                FlightInfo?.originAirport
                                                  ?.AirportName
                                              }{" "}
                                              {
                                                FlightInfo?.originAirport
                                                  ?.Terminal
                                              }
                                            </div>
                                          </div>

                                          {/* Flight path line */}
                                          <div className="flight-line-d1"></div>

                                          {/* Duration and stops section */}
                                          <div className="flight-line-a  text-center font-Montserrat">
                                            <div className="stop-badge-container relative group">
                                              {/* Tooltip - Now positioned at the bottom */}
                                              {/* <div className="absolute hidden group-hover:block top-full mt-2 left-1/2 -translate-x-1/2 z-10">
    <div className="bg-white text-black text-[8px] font-Montserrat px-3 py-2 rounded border shadow-md whitespace-nowrap relative">
      {segments.length === 1 ? (
        <span className="text-[8px]">
          This is a direct flight with no stops
        </span>
      ) : (
        <span
          className="leading-tight"
          style={{
            fontSize: "10px",
          }}
        >
          <p className="mb-0">
            Plane Change
          </p>
          <p className="mb-1">
            {
              segments[0]
                .Destination.Airport
                .CityName
            }{" "}
            | {Totallayover}
          </p>
        </span>
      )}
    
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-white"></div>
    </div>
  </div> */}

                                              {/* Your existing stop badge content */}
                                              <div className="flight-line-a">
                                                <span className="text-sm">
                                                  {duration}
                                                </span>
                                                <div className="w-fit mx-auto stop-badge">
                                                  {segments.length === 1 ? (
                                                    <p className="cursor-pointer leading-tight">
                                                      Non-stop
                                                    </p>
                                                  ) : (
                                                    <p className="cursor-pointer leading-tight">
                                                      {segments.length - 1} stop
                                                      {segments.length - 1 > 1
                                                        ? "s"
                                                        : ""}{" "}
                                                      via{" "}
                                                      {
                                                        segments[0].Destination
                                                          .Airport.CityName
                                                      }
                                                    </p>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          {/* Flight path line */}
                                          <div className="flight-line-d2"></div>

                                          {/* Arrival section */}
                                          <div
                                            className="flight-line-a"
                                            style={{ width: "90px" }}
                                          >
                                            <div className="flex items-center space-x-1">
                                              <div className="text-[15px] font-bold">
                                                {formattedArrTime}
                                              </div>
                                              {diffInDays > 0 && (
                                                <div className="relative group inline-block">
                                                  <span
                                                    className="font-medium cursor-pointer"
                                                    style={{
                                                      fontSize: "10px",
                                                      color: "red",
                                                    }}
                                                  >
                                                    +{diffInDays}{" "}
                                                    {diffInDays > 1
                                                      ? "DAYS"
                                                      : "DAY"}
                                                  </span>
                                                  <div className="absolute hidden group-hover:block bottom-full mb-1 left-1/2 -translate-x-1/2 z-10">
                                                    <div className="relative bg-white text-black text-[12px] font-Montserrat px-3 py-1 rounded border shadow-md whitespace-nowrap">
                                                      {formattedDate}
                                                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white drop-shadow-md"></div>
                                                    </div>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                            <div className="cardbody_font">
                                              {
                                                FlightInfo?.destinationAirport
                                                  ?.CityName
                                              }
                                            </div>
                                            <div className="text-[9px] text-gray-500 leading-tight">
                                              {
                                                FlightInfo?.destinationAirport
                                                  ?.AirportName
                                              }{" "}
                                              {
                                                FlightInfo?.destinationAirport
                                                  ?.Terminal
                                              }
                                            </div>
                                          </div>

                                          {/* Price and Actions Container - NEW */}
                                          <div className="price-actions-container">
                                            {/* Price Display */}
                                            <div className="price-display">
                                              ₹{" "}
                                              {Number(
                                                response.prices.TotalPrice,
                                              )}
                                              <br />
                                              <span className="text-[10px] text-gray-900 float-right font-normal">
                                                /adult
                                              </span>
                                            </div>

                                            {/* Actions Container */}
                                            <div className="actions-container">
                                              {/* View Prices Button */}
                                              <button
                                                className="view-prices-btn"
                                                onClick={() => {
                                                  if (!flightFares[flightId]) {
                                                    Getfares(
                                                      response,
                                                      flightId,
                                                    );
                                                  }
                                                  toggleShowPrices(flightId);
                                                }}
                                              >
                                                <span className="text-[12px]">
                                                  View Prices
                                                </span>
                                              </button>

                                              {/* Show Flight Details Link */}
                                              <div className="flight-details-link">
                                                <b
                                                  onClick={() =>
                                                    setShowFlightDetails(
                                                      showFlightDetails ===
                                                        index
                                                        ? null
                                                        : index,
                                                    )
                                                  }
                                                >
                                                  Show Flight Details
                                                </b>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/*  Price Display Section - flightId based */}

                                    {showPrices.has(flightId) && (
                                      <div className="price-fixed-container">
                                        {fareloadingg[flightId] && (
                                          <div className="flex items-center justify-center bg-white/30">
                                            <div className="big-loader flex items-center justify-center">
                                              <img
                                                style={{
                                                  width: "100px",
                                                  height: "100px",
                                                }}
                                                src="/img/cotravloader.gif"
                                                alt="Loader"
                                              />
                                              <p className="text-center ml-4 text-gray-600 text-xs">
                                                Retrieving flight fares. Please
                                                wait a moment.
                                              </p>
                                            </div>
                                          </div>
                                        )}

                                        <div className="fare-mini-grid-onward">
                                          {uniqueFares.map((fare, idx) => {
                                            const isSelected =
                                              selectedFares.some(
                                                (f) =>
                                                  f.flightId === flightId &&
                                                  f.fareType === fare.type,
                                              );
                                            const policyKey = `${flightId}_${fare.type}`;
                                            const isPolicyLoading =
                                              policyLoading[policyKey];
                                            const hasPolicy =
                                              cancellationPolicies[policyKey];

                                            // Check if Book Now button should be hidden
                                            const hideBookNow = false; // Replace with your actual condition

                                            return (
                                              <div
                                                className={`fare-mini-card ${isSelected ? "mini-selected" : ""}`}
                                                key={idx}
                                              >
                                                <div className="fare-mini-content">
                                                  {/* Fare Type and Policy Icon */}
                                                  <div className="fare-mini-header">
                                                    <span className="fare-mini-type">
                                                      {fare.type}
                                                    </span>
                                                    <button
                                                      className="fare-mini-policy"
                                                      type="button"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleShowPolicy(
                                                          FlightInfo,
                                                          fare,
                                                          flightId,
                                                          currentFlightFares?.base_fare,
                                                        );
                                                      }}
                                                      title="View Cancellation & Date Change Policy"
                                                    >
                                                      {isPolicyLoading ? (
                                                        <span className="mini-policy-loading">
                                                          ...
                                                        </span>
                                                      ) : (
                                                        <svg
                                                          width="10"
                                                          height="10"
                                                          viewBox="0 0 24 24"
                                                          fill="none"
                                                          xmlns="http://www.w3.org/2000/svg"
                                                          className={`mini-policy-icon ${hasPolicy ? "mini-policy-active" : ""}`}
                                                        >
                                                          <path
                                                            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                          />
                                                          <path
                                                            d="M12 16V12"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                          />
                                                          <path
                                                            d="M12 8H12.01"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                          />
                                                        </svg>
                                                      )}
                                                    </button>
                                                  </div>

                                                  {/* Source - Highlighted */}
                                                  {fare.from && (
                                                    <div className="fare-mini-source">
                                                      ({fare.from})
                                                    </div>
                                                  )}

                                                  {/* Price Row - Conditional rendering based on hideBookNow */}
                                                  {hideBookNow ? (
                                                    <div className="fare-mini-price-row">
                                                      <span className="fare-mini-price">
                                                        ₹{fare.price}
                                                      </span>
                                                      <button
                                                        className={`fare-mini-toggle ${isSelected ? "toggle-active" : ""}`}
                                                        type="button"
                                                        title={
                                                          isSelected
                                                            ? "Remove Fare"
                                                            : "Select fare and share"
                                                        }
                                                        onClick={() =>
                                                          AddClientPrice(
                                                            fare,
                                                            flightId,
                                                            FlightInfo?.segments,
                                                            cabinClass,
                                                            inputValue,
                                                            FlightInfo,
                                                          )
                                                        }
                                                      >
                                                        {isSelected ? "−" : "+"}
                                                      </button>
                                                    </div>
                                                  ) : (
                                                    <>
                                                      <div className="fare-mini-price">
                                                        ₹{fare.price}
                                                      </div>
                                                      {/* Button Group with Book Now and Toggle */}
                                                      <div className="fare-mini-button-group">
                                                        <button
                                                          type="button"
                                                          className="fare-mini-book"
                                                          onClick={() =>
                                                            AddClientPrice(
                                                              fare,
                                                              flightId,
                                                              FlightInfo?.segments,
                                                              cabinClass,
                                                              inputValue,
                                                              FlightInfo,
                                                            )
                                                          }
                                                        >
                                                          BOOK NOW
                                                        </button>

                                                        <button
                                                          className={`fare-mini-toggle ${isSelected ? "toggle-active" : ""}`}
                                                          type="button"
                                                          title={
                                                            isSelected
                                                              ? "Remove Fare"
                                                              : "Select fare and share"
                                                          }
                                                          onClick={() =>
                                                            handleFareToggle(
                                                              FlightInfo,
                                                              fare,
                                                              flightId,
                                                              currentFlightFares?.base_fare,
                                                            )
                                                          }
                                                        >
                                                          {isSelected
                                                            ? "−"
                                                            : "+"}
                                                        </button>
                                                      </div>
                                                    </>
                                                  )}
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                    {/* Flight Details Section */}
                                    <div className="flt-l-cr">
                                      {showFlightDetails === index && (
                                        <>
                                          <div
                                            className="flight-details"
                                            style={{ display: "block" }}
                                          >
                                            {/* Tabs */}
                                            <Nav className="flight_detailnav ">
                                              <Nav.Item>
                                                <Nav.Link
                                                  role="button"
                                                  className={` ${
                                                    showContent ===
                                                    "flight_details"
                                                      ? "active"
                                                      : ""
                                                  }`}
                                                  onClick={() =>
                                                    setshowcontent(
                                                      "flight_details",
                                                    )
                                                  }
                                                >
                                                  FLIGHT DETAIL{" "}
                                                </Nav.Link>
                                              </Nav.Item>
                                              <Nav.Item>
                                                <Nav.Link
                                                  role="button"
                                                  className={` ${
                                                    showContent ===
                                                    "fare_summary"
                                                      ? "active"
                                                      : ""
                                                  }`}
                                                  onClick={() =>
                                                    setshowcontent(
                                                      "fare_summary",
                                                    )
                                                  }
                                                >
                                                  FARE SUMMARY
                                                </Nav.Link>
                                              </Nav.Item>
                                            </Nav>

                                            <div>
                                              {showContent ===
                                                "flight_details" && (
                                                <div
                                                  className="tabcontent"
                                                  style={{
                                                    display: "block",
                                                  }}
                                                >
                                                  <div>
                                                    <div>
                                                      <div>
                                                        <div>
                                                          {segments.map(
                                                            (
                                                              segment,
                                                              index,
                                                            ) => {
                                                              const {
                                                                Airline,
                                                                Origin,
                                                                Destination,
                                                                Equipment,
                                                              } = segment;
                                                              const depTime =
                                                                new Date(
                                                                  Origin?.DepTime,
                                                                );
                                                              const arrTime =
                                                                new Date(
                                                                  Destination?.ArrTime,
                                                                );
                                                              // Calculate duration
                                                              const durationMs =
                                                                new Date(
                                                                  arrTime.toUTCString(),
                                                                ).getTime() -
                                                                new Date(
                                                                  depTime.toUTCString(),
                                                                ).getTime();
                                                              const durationHours =
                                                                Math.floor(
                                                                  durationMs /
                                                                    (1000 *
                                                                      60 *
                                                                      60),
                                                                );
                                                              const durationMinutes =
                                                                Math.floor(
                                                                  (durationMs %
                                                                    (1000 *
                                                                      60 *
                                                                      60)) /
                                                                    (1000 * 60),
                                                                );
                                                              const duration = `${durationHours}H ${durationMinutes}M`;
                                                              const cleanText =
                                                                (text) => {
                                                                  if (
                                                                    !text ||
                                                                    typeof text !==
                                                                      "string"
                                                                  )
                                                                    return text;

                                                                  // Remove special characters but keep spaces, letters, numbers, basic punctuation
                                                                  return text
                                                                    .replace(
                                                                      /[^\w\s(),.-]/g,
                                                                      "",
                                                                    ) // Keep alphanumeric, spaces, and basic punctuation
                                                                    .replace(
                                                                      /\s+/g,
                                                                      " ",
                                                                    ) // Replace multiple spaces with single space
                                                                    .trim();
                                                                };
                                                              const calculateLayover =
                                                                (
                                                                  arrival,
                                                                  departure,
                                                                ) => {
                                                                  if (
                                                                    !arrival ||
                                                                    !departure
                                                                  )
                                                                    return "00 Hrs : 00 mins";

                                                                  const arr =
                                                                    new Date(
                                                                      arrival,
                                                                    );
                                                                  const dep =
                                                                    new Date(
                                                                      departure,
                                                                    );
                                                                  const diffMs =
                                                                    dep - arr;

                                                                  if (
                                                                    diffMs < 0
                                                                  )
                                                                    return "00 Hrs : 00 mins";

                                                                  const diffH =
                                                                    Math.floor(
                                                                      diffMs /
                                                                        (1000 *
                                                                          60 *
                                                                          60),
                                                                    );
                                                                  const diffM =
                                                                    Math.floor(
                                                                      (diffMs /
                                                                        (1000 *
                                                                          60)) %
                                                                        60,
                                                                    );

                                                                  return `${String(diffH).padStart(2, "0")} Hrs : ${String(
                                                                    diffM,
                                                                  ).padStart(
                                                                    2,
                                                                    "0",
                                                                  )} mins`;
                                                                };
                                                              const stops = [];
                                                              if (
                                                                segments &&
                                                                segments.length >
                                                                  1
                                                              ) {
                                                                for (
                                                                  let i = 0;
                                                                  i <
                                                                  segments.length -
                                                                    1;
                                                                  i++
                                                                ) {
                                                                  const currentSeg =
                                                                    segments[i];
                                                                  const nextSeg =
                                                                    segments[
                                                                      i + 1
                                                                    ];

                                                                  const stopAirport =
                                                                    currentSeg
                                                                      ?.Destination
                                                                      ?.Airport;

                                                                  const layoverTime =
                                                                    calculateLayover(
                                                                      currentSeg
                                                                        ?.Destination
                                                                        ?.ArrTime,
                                                                      nextSeg
                                                                        ?.Origin
                                                                        ?.DepTime,
                                                                    );

                                                                  stops.push({
                                                                    stop_airport:
                                                                      cleanText(
                                                                        `${stopAirport?.AirportName || ""} ${stopAirport?.CityName || ""} (${stopAirport?.AirportCode || ""})`,
                                                                      ),
                                                                    duration:
                                                                      layoverTime,
                                                                  });
                                                                }
                                                              }
                                                              return (
                                                                <div
                                                                  key={index}
                                                                >
                                                                  <div className="flight-details-d"></div>
                                                                  <div className="flight-details-a ">
                                                                    {
                                                                      Airline?.AirlineName
                                                                    }{" "}
                                                                    .{" "}
                                                                    {
                                                                      Airline?.AirlineCode
                                                                    }
                                                                    {
                                                                      Airline?.FlightNumber
                                                                    }{" "}
                                                                    ||{" "}
                                                                    {
                                                                      Origin
                                                                        ?.Airport
                                                                        ?.CityName
                                                                    }{" "}
                                                                    To{" "}
                                                                    {
                                                                      Destination
                                                                        ?.Airport
                                                                        ?.CityName
                                                                    }{" "}
                                                                    ,{" "}
                                                                    {formatdatemonth(
                                                                      Origin?.DepTime,
                                                                    )}
                                                                  </div>
                                                                  <div className="clear"></div>

                                                                  {/* Flight Segment Details */}
                                                                  <div className="flightstopdetail">
                                                                    <div className="flight-details-lr">
                                                                      <p className="flight-details-b">
                                                                        {
                                                                          Origin
                                                                            ?.Airport
                                                                            ?.CityName
                                                                        }
                                                                      </p>
                                                                      <p className="flight-details-b mb-1">
                                                                        {handleweekdatemonthyear(
                                                                          Origin?.DepTime,
                                                                        )}
                                                                      </p>
                                                                      <p className="flight-details-c mb-0">
                                                                        {format(
                                                                          new Date(
                                                                            Origin?.DepTime,
                                                                          ),
                                                                          "HH:mm",
                                                                        )}
                                                                      </p>
                                                                      <p className="flight-details-c1 mb-1">
                                                                        {
                                                                          Origin
                                                                            ?.Airport
                                                                            ?.AirportName
                                                                        }
                                                                      </p>
                                                                      <p className="flight-details-c mb-0">
                                                                        {Origin
                                                                          ?.Airport
                                                                          ?.Terminal
                                                                          ? ` Terminal ${Origin?.Airport?.Terminal}`
                                                                          : ""}
                                                                      </p>
                                                                    </div>

                                                                    <div className="flight-details-mr">
                                                                      <p className="flight-details-e">
                                                                        {
                                                                          duration
                                                                        }
                                                                      </p>
                                                                      <div className="flight-details-e">
                                                                        <hr />
                                                                      </div>
                                                                    </div>

                                                                    <div className="flight-details-rr">
                                                                      <p className="flight-details-b">
                                                                        {
                                                                          Destination
                                                                            ?.Airport
                                                                            ?.CityName
                                                                        }
                                                                      </p>
                                                                      <p className="flight-details-b">
                                                                        {handleweekdatemonthyear(
                                                                          Destination?.ArrTime,
                                                                        )}
                                                                      </p>
                                                                      <p className="flight-details-c mb-0">
                                                                        {format(
                                                                          new Date(
                                                                            Destination?.ArrTime,
                                                                          ),
                                                                          "HH:mm",
                                                                        )}
                                                                      </p>
                                                                      <p className="flight-details-c1 mb-1">
                                                                        {
                                                                          Destination
                                                                            ?.Airport
                                                                            ?.AirportName
                                                                        }
                                                                      </p>
                                                                      <p className="flight-details-c mb-0">
                                                                        {Destination
                                                                          ?.Airport
                                                                          ?.Terminal
                                                                          ? ` Terminal ${Destination?.Airport?.Terminal}`
                                                                          : ""}
                                                                      </p>
                                                                    </div>
                                                                  </div>

                                                                  {/* Layover Information - THIS SHOULD BE AFTER flightstopdetail, NOT INSIDE IT */}
                                                                  {index <
                                                                    segments.length -
                                                                      1 &&
                                                                    stops[
                                                                      index
                                                                    ] && (
                                                                      <div className="layover-simple">
                                                                        <p>
                                                                          {/* Change of planes if applicable */}
                                                                          {/* {segments[index]?.Airline?.FlightNumber !== segments[index + 1]?.Airline?.FlightNumber && (
        <>Change of planes <span>·</span></>
      )} */}
                                                                          {/* Layover duration and location */}
                                                                          <strong>
                                                                            {
                                                                              stops[
                                                                                index
                                                                              ]
                                                                                .duration
                                                                            }
                                                                          </strong>{" "}
                                                                          Layover
                                                                          in{" "}
                                                                          {segments[
                                                                            index
                                                                          ]
                                                                            ?.Destination
                                                                            ?.Airport
                                                                            ?.CityName ||
                                                                            "Ahmedabad"}
                                                                        </p>
                                                                      </div>
                                                                    )}

                                                                  <div className="clear"></div>
                                                                </div>
                                                              );
                                                            },
                                                          )}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              )}
                                              {showContent ===
                                                "fare_summary" && (
                                                <div className="tabcontent">
                                                  <div className="flight-details-a">
                                                    Fare Breakup (For Per
                                                    Passenger)
                                                  </div>
                                                  <div className="flight-details-l">
                                                    <p className="flight-details-b">
                                                      Total Fare
                                                    </p>
                                                    <p className="flight-details-c mb-0">
                                                      Base Price
                                                    </p>
                                                    <p className="flight-details-c mb-0">
                                                      Tax
                                                    </p>
                                                    <p className="flight-details-c mb-0">
                                                      IN
                                                    </p>
                                                    <p className="flight-details-c mb-0 ">
                                                      Surcharge
                                                    </p>
                                                  </div>
                                                  <div className="flight-details-r">
                                                    <p className="flight-details-b">
                                                      ₹{" "}
                                                      {
                                                        response.prices
                                                          .TotalPrice
                                                      }
                                                    </p>
                                                    <p className="flight-details-c mb-0">
                                                      ₹{" "}
                                                      {response.prices.BaseFare}
                                                    </p>
                                                    <p className="flight-details-c mb-0">
                                                      ₹ {response.prices.Taxes}
                                                    </p>
                                                    <p className="flight-details-c mb-0">
                                                      ₹ 00
                                                    </p>
                                                    <p className="flight-details-c mb-0">
                                                      ₹ 00
                                                    </p>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {/*  Action Buttons - flightId based */}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 flex flex-col items-center">
                    <div className="Searchresult text-center">
                      <div className="pl-7 ml-7">
                        <img
                          src="/img/FlightNotFound.png"
                          alt="Flight Not Found"
                          className="w-4/5 mb-2"
                        />
                      </div>
                      <p className="font-semibold text-gray-700">
                        These search flights are not available. Please modify
                        your search.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="clear" />
            </div>
          </div>
        </div>
      ) : (
        <div className="main-cont" id="main_cont">
          <div className="body-wrapper ">
            <div className="wrapper-padding">
              <div className="two-colls">
                <div className="two-colls-left-return font-Montserrat space-y-2">
                  {Array.isArray(FlightOptions) && FlightOptions.length > 0 && (
                    <>
                      <div className="side-block fly-in">
                        <button
                          className="Clearfilter"
                          type="button"
                          onClick={handleClearFilters}
                        >
                          Clear All Onward Flight Filters
                        </button>
                      </div>
                      <div className="side-block fly-in side-padding">
                        <h4 className="side-lbl">
                          STOPS FROM{" "}
                          {inputValue.originAirport
                            ? inputOrigin.split(/[-(]/)[0].trim()
                            : fromAirport.split(/[-(]/)[0].trim()}{" "}
                        </h4>
                        <div className="space-y-2 text-[10px] text-gray-500 ">
                          {Array.from(
                            new Set([
                              0,
                              ...FlightOptions?.map(
                                (data) => data?.flight?.segments?.length - 1,
                              ).filter((stops) => stops > 0),
                            ]),
                          )
                            .sort((a, b) => a - b)
                            .map((stopCount) => (
                              <label
                                key={stopCount}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="checkbox"
                                  className="accent-blue-600"
                                  checked={selectedStops.has(stopCount)}
                                  onChange={() => {
                                    toggleStop(stopCount);
                                    setShowPrices(new Set());
                                  }}
                                />
                                <span>
                                  {stopCount === 0
                                    ? "Non Stop"
                                    : `${stopCount} Stop${
                                        stopCount > 1 ? "s" : ""
                                      }`}
                                </span>
                              </label>
                            ))}
                        </div>
                      </div>

                      <div className="side-block fly-in side-padding">
                        <h4 className="side-lbl">
                          DEPARTURE FROM{" "}
                          {inputValue.originAirport
                            ? inputOrigin.split(/[-(]/)[0].trim()
                            : fromAirport.split(/[-(]/)[0].trim()}
                        </h4>
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          {TIME_SLOTS.map((slot) => (
                            <div
                              key={slot.key}
                              className={`appendBottom12 filterTimeSlots cursor-pointer ${
                                selectedDepartures.includes(slot.key)
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() => {
                                toggleSelection(slot.key, true);
                                setShowPrices(new Set());
                              }}
                            >
                              <span
                                className="appendBottom2 checkBlockIcon block w-8 h-8 bg-no-repeat bg-contain"
                                style={{
                                  backgroundImage: `url(https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/${slot.img}?v=1)`,
                                }}
                              />
                              <div className="boldFont">{slot.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="side-block fly-in side-padding">
                        <h4 className="side-lbl">
                          ARRIVAL AT{" "}
                          {inputValue.destinationAriport
                            ? inputDestination.split(/[-(]/)[0].trim()
                            : ToAirport.split(/[-(]/)[0].trim()}
                        </h4>
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          {TIME_SLOTS.map((slot) => (
                            <div
                              key={slot.key}
                              className={`appendBottom12 filterTimeSlots cursor-pointer ${
                                selectedArrivals.includes(slot.key)
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() => {
                                toggleSelection(slot.key, false);
                                setShowPrices(new Set());
                              }}
                            >
                              <span
                                className="appendBottom2 checkBlockIcon block w-8 h-8 bg-no-repeat bg-contain"
                                style={{
                                  backgroundImage: `url(https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/${slot.img}?v=1)`,
                                }}
                              />
                              <div className="boldFont">{slot.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="side-block fly-in side-padding">
                        <h4 className="side-lbl">AIRLINES</h4>
                        <div className="side-block fly-in">
                          <div className="side-stars text-[11px] text-gray-500">
                            {uniqueAirlines.map((airline, idx) => (
                              <label
                                key={idx}
                                className="flex items-center space-x-2 mb-1 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  className="accent-blue-600"
                                  checked={selectedAirlines.has(airline.name)}
                                  onChange={() => {
                                    toggleAirline(airline.name);
                                    setShowPrices(new Set());
                                  }}
                                />
                                <span className="flex items-center space-x-1">
                                  <img
                                    src={airline.logo}
                                    alt={airline.name}
                                    className="w-4 h-4 object-contain"
                                  />
                                  <span>{airline.name}</span>
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="side-block fly-in">
                        <div className="side-price">
                          <div className="price-ammounts">
                            <p className="price-ammountsp">
                              <label htmlFor="amount" className="side-lbl">
                                Price range:
                              </label>
                            </p>
                          </div>
                          <div className="price-ranger">
                            <Slider
                              min={minFare}
                              max={maxFare}
                              range
                              value={priceRange}
                              onChange={(value) => {
                                setPriceRange(value);
                                setShowPrices(new Set());
                              }}
                            />
                          </div>
                          <div className="price-ammounts">
                            <input
                              type="text"
                              id="ammount-from"
                              value={priceRange[0]}
                              readOnly
                            />
                            <input
                              type="text"
                              id="ammount-to"
                              value={priceRange[1]}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      <div className="side-block fly-in">
                        <button
                          className="Clearfilter"
                          type="button"
                          onClick={handleClearFilters}
                        >
                          Clear All Return Flight Filters
                        </button>
                      </div>
                      <div className="side-block fly-in side-padding">
                        <h4 className="side-lbl">
                          STOPS FROM{" "}
                          {inputValue.destinationAriport
                            ? inputDestination.split(/[-(]/)[0].trim()
                            : ToAirport.split(/[-(]/)[0].trim()}{" "}
                        </h4>
                        <div className="space-y-2 text-[10px] text-gray-500 ">
                          {Array.from(
                            new Set([
                              0,
                              ...FlightReturnOptions?.map(
                                (data) => data?.flight?.segments?.length - 1,
                              ).filter((stops) => stops > 0),
                            ]),
                          )
                            .sort((a, b) => a - b)
                            .map((stopCount) => (
                              <label
                                key={stopCount}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="checkbox"
                                  className="accent-blue-600"
                                  checked={returnSelectedStops.has(stopCount)}
                                  onChange={() => {
                                    toggleReturnStop(stopCount);
                                    setShowPrices(new Set());
                                  }}
                                />
                                <span>
                                  {stopCount === 0
                                    ? "Non Stop"
                                    : `${stopCount} Stop${
                                        stopCount > 1 ? "s" : ""
                                      }`}
                                </span>
                              </label>
                            ))}
                        </div>
                      </div>

                      <div className="side-block fly-in side-padding">
                        <h4 className="side-lbl">
                          DEPARTURE FROM{" "}
                          {inputValue.destinationAriport
                            ? inputDestination.split(/[-(]/)[0].trim()
                            : ToAirport.split(/[-(]/)[0].trim()}
                        </h4>
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          {TIME_SLOTS.map((slot) => (
                            <div
                              key={slot.key}
                              className={`appendBottom12 filterTimeSlots cursor-pointer ${
                                selectedReturnDepartures.includes(slot.key)
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() => {
                                toggleReturnSelection(slot.key, true);
                                setShowPrices(new Set());
                              }}
                            >
                              <span
                                className="appendBottom2 checkBlockIcon block w-8 h-8 bg-no-repeat bg-contain"
                                style={{
                                  backgroundImage: `url(https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/${slot.img}?v=1)`,
                                }}
                              />
                              <div className="boldFont">{slot.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="side-block fly-in side-padding">
                        <h4 className="side-lbl">
                          ARRIVAL AT{" "}
                          {inputValue.originAirport
                            ? inputOrigin.split(/[-(]/)[0].trim()
                            : fromAirport.split(/[-(]/)[0].trim()}
                        </h4>
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          {TIME_SLOTS.map((slot) => (
                            <div
                              key={slot.key}
                              className={`appendBottom12 filterTimeSlots cursor-pointer ${
                                selectedReturnArrivals.includes(slot.key)
                                  ? "selected"
                                  : ""
                              }`}
                              onClick={() => {
                                toggleReturnSelection(slot.key, false);
                                setShowPrices(new Set());
                              }}
                            >
                              <span
                                className="appendBottom2 checkBlockIcon block w-8 h-8 bg-no-repeat bg-contain"
                                style={{
                                  backgroundImage: `url(https://imgak.mmtcdn.com/flights/assets/media/dt/listing/left-filters/${slot.img}?v=1)`,
                                }}
                              />
                              <div className="boldFont">{slot.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="side-block fly-in side-padding">
                        <h4 className="side-lbl">AIRLINES</h4>
                        <div className="side-block fly-in">
                          <div className="side-stars text-[11px] text-gray-500">
                            {uniqueReturnAirlines.map((airline, idx) => (
                              <label
                                key={idx}
                                className="flex items-center space-x-2 mb-1 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  className="accent-blue-600"
                                  checked={selectedReturnAirlines.has(
                                    airline.name,
                                  )}
                                  onChange={() => {
                                    toggleReturnAirline(airline.name);
                                    setShowPrices(new Set());
                                  }}
                                />
                                <span className="flex items-center space-x-1">
                                  <img
                                    src={airline.logo}
                                    alt={airline.name}
                                    className="w-4 h-4 object-contain"
                                  />
                                  <span>{airline.name}</span>
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="side-block fly-in">
                        <div className="side-price">
                          <div className="price-ammounts">
                            <p className="price-ammountsp">
                              <label htmlFor="amount" className="side-lbl">
                                Price range:
                              </label>
                            </p>
                          </div>
                          <div className="price-ranger">
                            <Slider
                              min={minreturnFare}
                              max={maxreturnFare}
                              range
                              value={priceReturnRange}
                              onChange={(value) => {
                                setPriceReturnRange(value);
                                setShowPrices(new Set());
                              }}
                            />
                          </div>
                          <div className="price-ammounts">
                            <input
                              type="text"
                              id="ammount-from"
                              value={priceReturnRange[0]}
                              readOnly
                            />
                            <input
                              type="text"
                              id="ammount-to"
                              value={priceReturnRange[1]}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                      <div className="side-block fly-in">
                        <button
                          className="scrolltotop"
                          type="button"
                          onClick={handleScrollToTop}
                        >
                          Scroll To Top
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <div className="resultcontainer">
                  <div className="flightoptions">
                    {Array.isArray(FlightOptions) &&
                    FlightOptions.length > 0 ? (
                      <div className="two-colls-right-b">
                        <div className="padding">
                          <div className="catalog-row-return" id="catalog">
                            <div className="side-block  py-1 px-3 fly-in headingofflights">
                              <span>
                                {" "}
                                {inputValue.originAirport
                                  ? inputOrigin.split(/[-(]/)[0].trim()
                                  : fromAirport.split(/[-(]/)[0].trim()}{" "}
                                <ArrowForwardSharp style={{ width: "35px" }} />{" "}
                                {inputValue.destinationAriport
                                  ? inputDestination.split(/[-(]/)[0].trim()
                                  : ToAirport.split(/[-(]/)[0].trim()}
                              </span>
                              <span
                                style={{
                                  float: "right",
                                  marginTop: "2px",
                                  marginRight: "5px",
                                }}
                              >
                                {" "}
                                {formatDate(
                                  inputValue.departureDate
                                    ? extractDate(inputValue.departureDate)
                                    : extractDate(DepartureDate),
                                )}
                              </span>
                            </div>
                            <div className="row catalog_filters_return">
                              <div
                                className="col-md-2 departurefilter cursor-pointer"
                                onClick={() => handleSort("departure")}
                                style={{
                                  opacity:
                                    sortField === "departure" ? "1" : "0.5",
                                }}
                              >
                                Departure
                                {sortField === "departure" && (
                                  <span style={{ marginLeft: "5px" }}>
                                    {sortOrder === "asc" ? "↓" : "↑"}
                                  </span>
                                )}
                              </div>
                              <div
                                className="col-md-3 travelfilter cursor-pointer"
                                onClick={() => handleSort("travelTime")}
                                style={{
                                  opacity:
                                    sortField === "travelTime" ? "1" : "0.5",
                                }}
                              >
                                Travel Time
                                {sortField === "travelTime" && (
                                  <span style={{ marginLeft: "5px" }}>
                                    {sortOrder === "asc" ? "↓" : "↑"}
                                  </span>
                                )}
                              </div>
                              <div
                                className="col-md-2 arriavelfilter cursor-pointer"
                                onClick={() => handleSort("arrival")}
                                style={{
                                  opacity:
                                    sortField === "arrival" ? "1" : "0.5",
                                }}
                              >
                                Arrival
                                {sortField === "arrival" && (
                                  <span style={{ marginLeft: "5px" }}>
                                    {sortOrder === "asc" ? "↓" : "↑"}
                                  </span>
                                )}
                              </div>
                              {/* <div
                                className="col-md-2 stopsfilter cursor-pointer"
                                onClick={() => handleSort("stops")}
                                style={{
                                  opacity: sortField === "stops" ? "1" : "0.5",
                                }}
                              >
                                Stops
                                {sortField === "stops" && (
                                  <span style={{ marginLeft: "5px" }}>
                                    {sortOrder === "asc" ? "↓" : "↑"}
                                  </span>
                                )}
                              </div> */}
                              <div
                                className="col-md-3 pricefilter cursor-pointer"
                                onClick={() => handleSort("price")}
                                style={{
                                  opacity: sortField === "price" ? "1" : "0.5",
                                }}
                              >
                                Price
                                {sortField === "price" && (
                                  <span style={{ marginLeft: "5px" }}>
                                    {sortOrder === "asc" ? "↓" : "↑"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div
                            className="overflow-y-auto mt-2"
                            style={{ maxHeight: "400vh" }}
                          >
                            {sortedFlights?.length === 0 ? (
                              <div className="Searchresult text-center">
                                <div
                                  className="pl-10 ml-10"
                                  style={{ paddingLeft: "160px" }}
                                >
                                  <img
                                    src="/img/FlightNotFound.png"
                                    alt="Flight Not Found"
                                    className="w-2/3"
                                  />
                                </div>
                                <p className="font-semibold text-gray-700 mb-0">
                                  These flights are not available. Please modify
                                  your search.
                                </p>
                              </div>
                            ) : (
                              sortedFlights.map((response, index) => {
                                const FlightInfo = response?.flight;
                                const depTime = FlightInfo?.depTime || "";
                                const arrTime = FlightInfo?.arrTime || "";
                                const flightId = getFlightUniqueId(FlightInfo);
                                const formattedDepTime = FlightInfo?.depTime
                                  ? format(new Date(depTime), "HH:mm")
                                  : "N/A";
                                const formattedArrTime = FlightInfo?.arrTime
                                  ? format(new Date(arrTime), "HH:mm")
                                  : "N/A";

                                // Calculate duration
                                const durationMs =
                                  new Date(arrTime).getTime() -
                                  new Date(depTime).getTime();
                                const durationHours = Math.floor(
                                  durationMs / (1000 * 60 * 60),
                                );
                                const durationMinutes = Math.floor(
                                  (durationMs % (1000 * 60 * 60)) / (1000 * 60),
                                );
                                const duration = `${durationHours}H ${durationMinutes}M`;

                                //price
                                const segments = FlightInfo.segments;
                                let totalLayoverMinutes = 0;
                                let Totallayover = "";
                                if (segments.length > 1) {
                                  for (
                                    let i = 0;
                                    i < segments.length - 1;
                                    i++
                                  ) {
                                    const arrivalTime = dayjs(
                                      segments[i].Destination.ArrTime,
                                    );
                                    const nextDepartureTime = dayjs(
                                      segments[i + 1].Origin.DepTime,
                                    );
                                    const layoverMinutes =
                                      nextDepartureTime.diff(
                                        arrivalTime,
                                        "minute",
                                      );
                                    totalLayoverMinutes += layoverMinutes;
                                  }

                                  const totalLayoverDuration = dayjs.duration(
                                    totalLayoverMinutes,
                                    "minutes",
                                  );
                                  const totalHours =
                                    totalLayoverDuration.hours();
                                  const totalMinutes =
                                    totalLayoverDuration.minutes();

                                  Totallayover = `${
                                    totalHours > 0 ? `${totalHours}h ` : ""
                                  }${totalMinutes}m Total Layover`;
                                }

                                let uniqueFares = [];
                                const currentFlightFares =
                                  flightFares[flightId];

                                const formattedUapiFares = (
                                  currentFlightFares?.uapi_fares || []
                                ) //  FlightFares nahi, currentFlightFares
                                  .map((fare) => ({
                                    type: (fare.SupplierFareClass || "").trim(),
                                    price: parseFloat(fare.TotalPrice),
                                    from: "Uapi",
                                    Resultindex: fare.ResultIndex,
                                    TraceId: fare.trace_id,
                                    isLCC: fare.isLCC,
                                    ProviderCode: fare.ProviderCode,
                                  }));

                                const formattedTboFares = (
                                  currentFlightFares?.tbo_fares || []
                                ) //  FlightFares nahi, currentFlightFares
                                  .map((fare) => ({
                                    type: (
                                      fare.SupplierFareClass || "Regular Fare"
                                    ).trim(),
                                    price: parseFloat(fare.TotalPrice),
                                    from: "Tbo",
                                    Resultindex: fare.ResultIndex,
                                    TraceId: fare.trace_id,
                                    ProviderCode: fare.ProviderCode,
                                  }));

                                // STEP 1: Combine all fares
                                const combinedFares = [
                                  ...formattedUapiFares,
                                  ...formattedTboFares,
                                ];

                                // STEP 2: Group by fare type
                                const grouped = combinedFares.reduce(
                                  (acc, fare) => {
                                    if (!acc[fare.type]) acc[fare.type] = [];
                                    acc[fare.type].push(fare);
                                    return acc;
                                  },
                                  {},
                                );

                                // STEP 3: Apply rules

                                Object.keys(grouped).forEach((fareType) => {
                                  const fares = grouped[fareType];

                                  // --- RULE 1: Corporate → prefer UAPI always ---
                                  if (
                                    fareType.toLowerCase().includes("corporate")
                                  ) {
                                    const uapiFare = fares.find(
                                      (f) => f.from === "Uapi",
                                    );

                                    if (uapiFare) {
                                      uniqueFares.push(uapiFare);
                                    } else {
                                      uniqueFares.push(fares[0]); // Only TBO exists
                                    }
                                    return;
                                  }

                                  // --- RULE 2: Other fare types → pick cheapest ---
                                  const cheapest = fares.reduce((a, b) =>
                                    a.price < b.price ? a : b,
                                  );
                                  uniqueFares.push(cheapest);
                                });

                                // STEP 4: Sort by price ASC
                                uniqueFares.sort((a, b) => a.price - b.price);

                                const journey = "Onward";
                                //number of days
                                const dep = new Date(depTime);
                                const arr = new Date(arrTime);
                                const depDate = new Date(
                                  dep.getFullYear(),
                                  dep.getMonth(),
                                  dep.getDate(),
                                );
                                const arrDate = new Date(
                                  arr.getFullYear(),
                                  arr.getMonth(),
                                  arr.getDate(),
                                );
                                const diffInMs =
                                  arrDate.getTime() - depDate.getTime();
                                const diffInDays = Math.round(
                                  diffInMs / (1000 * 60 * 60 * 24),
                                );
                                const date = new Date(arr);

                                const options = {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                };
                                const formattedDate = date.toLocaleDateString(
                                  "en-GB",
                                  options,
                                );
                                return (
                                  <div
                                    key={flightId}
                                    className={`flight-item fly-in ${
                                      selectedFlightIds.includes(flightId)
                                        ? "selected-flight"
                                        : ""
                                    }`}
                                  >
                                    <div className="flt-i-a flex flex-col">
                                      <div className="flt-i-br ">
                                        <div className="flt-l-br">
                                          <div className="mb-1 flt-l-img ">
                                            {[
                                              ...new Set(
                                                FlightInfo?.segments?.map(
                                                  (segment) =>
                                                    segment.Airline.AirlineLogo,
                                                ),
                                              ),
                                            ].map((logo) => {
                                              return (
                                                <img
                                                  key={logo}
                                                  src={`${logo}`}
                                                  className="w-7 h-7 inline-block mr-2"
                                                />
                                              );
                                            })}
                                          </div>

                                          <div className="flt-l-fightname ">
                                            <p className=" cardbody_font font-Montserrat mb-0 ">
                                              {[
                                                ...new Set(
                                                  FlightInfo?.segments?.map(
                                                    (segment) =>
                                                      segment.Airline
                                                        .AirlineName,
                                                  ),
                                                ),
                                              ].join(" , ")}
                                            </p>

                                            <p className="text-[11px] font-Montserrat ">
                                              {FlightInfo?.segments
                                                ?.map(
                                                  (segment) =>
                                                    `${segment.Airline.AirlineCode} ${segment.Airline.FlightNumber}`,
                                                )
                                                .join(" , ")}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="flt-l-cr">
                                          <div className="Flightflow">
                                            <div className="flight-line-origin">
                                              <div className="text-[15px] font-bold">
                                                {formattedDepTime}
                                              </div>
                                              <div className="cardbody_font">
                                                {
                                                  FlightInfo?.originAirport
                                                    ?.CityName
                                                }{" "}
                                              </div>
                                            </div>
                                            <div className="flight-timeline">
                                              <div className=" line-from">
                                                <img src="/img/DOTT_LINE.svg" />
                                              </div>
                                              <div className="flight-line-a text-center font-Montserrat flight-time">
                                                <div className="stop-badge-container relative group">
                                                  <div className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 -translate-x-1/2 z-10">
                                                    <div className="bg-white text-black text-[8px] font-Montserrat px-3 py-2 rounded border shadow-md whitespace-nowrap relative">
                                                      {segments.length === 1 ? (
                                                        <span className="text-[8px]">
                                                          This is a direct
                                                          flight with no stops
                                                        </span>
                                                      ) : (
                                                        <span
                                                          className=" leading-tight"
                                                          style={{
                                                            fontSize: "10px",
                                                          }}
                                                        >
                                                          <p className="mb-0">
                                                            Plane Change
                                                          </p>
                                                          <p className="mb-1">
                                                            {
                                                              segments[0]
                                                                .Destination
                                                                .Airport
                                                                .CityName
                                                            }{" "}
                                                            | {Totallayover}
                                                          </p>
                                                        </span>
                                                      )}
                                                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white"></div>
                                                    </div>
                                                  </div>
                                                  <div className="flight-line-a">
                                                    <span className="text-sm">
                                                      {duration}
                                                    </span>
                                                    <div className="flight-line-d2 mt-0 mr-0 "></div>
                                                    <div className="w-fit mx-auto stop-badge">
                                                      {segments.length === 1 ? (
                                                        <p className=" cursor-pointer leading-tight mb-0">
                                                          Non-stop
                                                        </p>
                                                      ) : (
                                                        <p className="cursor-pointer leading-tight mb-0">
                                                          {segments.length - 1}{" "}
                                                          stop
                                                          {segments.length - 1 >
                                                          1
                                                            ? "s"
                                                            : ""}{" "}
                                                          via{" "}
                                                          {
                                                            segments[0]
                                                              .Destination
                                                              .Airport.CityName
                                                          }
                                                        </p>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="line-to">
                                                <img src="/img/FLIGHT_LINE.svg" />
                                              </div>
                                            </div>
                                            <div className="flight-line-destination">
                                              <div className="flex items-center space-x-1">
                                                <div className="text-[15px] font-bold">
                                                  {formattedArrTime}
                                                </div>
                                                {diffInDays > 0 && (
                                                  <div className="relative group inline-block">
                                                    <span
                                                      className="font-medium cursor-pointer"
                                                      style={{
                                                        fontSize: "10px",
                                                        color: "red",
                                                      }}
                                                    >
                                                      +{diffInDays}{" "}
                                                      {diffInDays > 1
                                                        ? "DAYS"
                                                        : "DAY"}
                                                    </span>
                                                    <div className="absolute hidden group-hover:block bottom-full mb-1 left-1/2 -translate-x-1/2 z-10">
                                                      <div className="relative bg-white text-black text-[12px] font-Montserrat px-3 py-1 rounded border shadow-md whitespace-nowrap">
                                                        {formattedDate}
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white drop-shadow-md"></div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>
                                              <div className="cardbody_font">
                                                {
                                                  FlightInfo?.destinationAirport
                                                    ?.CityName
                                                }
                                              </div>
                                            </div>
                                            <div className="flight-price">
                                              {" "}
                                              <span className="flightprice">
                                                ₹{" "}
                                                {Number(
                                                  response.prices.TotalPrice,
                                                )}
                                              </span>
                                              <br />
                                              <span className="text-[10px] text-gray-900 float-right">
                                                /adult
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flt-i-cr">
                                          <div className="flight-detail cursor-pointer">
                                            <div className="flight-show-details">
                                              <span
                                                className="text-[11px] text-[#785eff]"
                                                onClick={() =>
                                                  setShowFlightDetails(
                                                    showFlightDetails === index
                                                      ? null
                                                      : index,
                                                  )
                                                }
                                              >
                                                Show Flight Details
                                              </span>
                                            </div>
                                            <div className="fligth-view-price">
                                              <span>
                                                <button
                                                  className="viewprice"
                                                  style={{
                                                    borderRadius: "18px",
                                                  }}
                                                  onClick={() => {
                                                    //  flightId use karo, index nahi
                                                    if (
                                                      !flightFares[flightId]
                                                    ) {
                                                      Getfares(
                                                        response,
                                                        flightId,
                                                      ); //  flightId bhejo
                                                    }
                                                    toggleShowPrices(flightId); //  flightId bhejo
                                                  }}
                                                >
                                                  <span className="text-[10px]">
                                                    View Prices
                                                  </span>
                                                </button>
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        {showPrices.has(flightId) && (
                                          <div className="flight-price-wrapper w-full mt-4">
                                            {fareloadingg[flightId] && (
                                              <div className="flex items-center justify-center bg-white/30">
                                                <div className="big-loader flex items-center justify-center">
                                                  <img
                                                    style={{
                                                      width: "100px",
                                                      height: "100px",
                                                    }}
                                                    src="/img/cotravloader.gif"
                                                    alt="Loader"
                                                  />
                                                  <p className="text-center ml-4 text-gray-600 text-xs">
                                                    Retrieving flight fares.
                                                    Please wait a moment.
                                                  </p>
                                                </div>
                                              </div>
                                            )}

                                            <div className="fare-mini-grid">
                                              {uniqueFares.map((fare, idx) => {
                                                const isSelected =
                                                  selectedFares.some(
                                                    (f) =>
                                                      f.flightId === flightId &&
                                                      f.fareType === fare.type,
                                                  );
                                                const policyKey = `${flightId}_${fare.type}`;
                                                const isPolicyLoading =
                                                  policyLoading[policyKey];
                                                const hasPolicy =
                                                  cancellationPolicies[
                                                    policyKey
                                                  ];

                                                // Check if Book Now button should be hidden
                                                const hideBookNow = false; // Replace with your actual condition

                                                return (
                                                  <div
                                                    className={`fare-mini-card ${isSelected ? "mini-selected" : ""}`}
                                                    key={idx}
                                                  >
                                                    <div className="fare-mini-content">
                                                      {/* Fare Type and Policy Icon */}
                                                      <div className="fare-mini-header">
                                                        <span className="fare-mini-type">
                                                          {fare.type}
                                                        </span>
                                                        <button
                                                          className="fare-mini-policy"
                                                          type="button"
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleShowPolicy(
                                                              FlightInfo,
                                                              fare,
                                                              flightId,
                                                              currentFlightFares?.base_fare,
                                                            );
                                                          }}
                                                          title="View Cancellation & Date Change Policy"
                                                        >
                                                          {isPolicyLoading ? (
                                                            <span className="mini-policy-loading">
                                                              ...
                                                            </span>
                                                          ) : (
                                                            <svg
                                                              width="10"
                                                              height="10"
                                                              viewBox="0 0 24 24"
                                                              fill="none"
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              className={`mini-policy-icon ${hasPolicy ? "mini-policy-active" : ""}`}
                                                            >
                                                              <path
                                                                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                              />
                                                              <path
                                                                d="M12 16V12"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                              />
                                                              <path
                                                                d="M12 8H12.01"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                              />
                                                            </svg>
                                                          )}
                                                        </button>
                                                      </div>

                                                      {/* Source - Highlighted */}
                                                      {fare.from && (
                                                        <div className="fare-mini-source">
                                                          ({fare.from})
                                                        </div>
                                                      )}

                                                      {/* Price Row - Conditional rendering based on hideBookNow */}
                                                      {hideBookNow ? (
                                                        <div className="fare-mini-price-row">
                                                          <span className="fare-mini-price">
                                                            ₹{fare.price}
                                                          </span>
                                                          <button
                                                            className={`fare-mini-toggle ${isSelected ? "toggle-active" : ""}`}
                                                            type="button"
                                                            title={
                                                              isSelected
                                                                ? "Remove Fare"
                                                                : "Select fare and share"
                                                            }
                                                            onClick={() =>
                                                              handleFareToggle(
                                                                FlightInfo,
                                                                fare,
                                                                flightId,
                                                                currentFlightFares?.base_fare,
                                                              )
                                                            }
                                                          >
                                                            {isSelected
                                                              ? "−"
                                                              : "+"}
                                                          </button>
                                                        </div>
                                                      ) : (
                                                        <>
                                                          <div className="fare-mini-price">
                                                            ₹{fare.price}
                                                          </div>
                                                          {/* Button Group with Book Now and Toggle */}
                                                          <div className="fare-mini-button-group">
                                                            <button
                                                              type="button"
                                                              className="fare-mini-book"
                                                              onClick={() =>
                                                                handleSingleSelect(
                                                                  FlightInfo,
                                                                  fare,
                                                                  flightId,
                                                                  currentFlightFares?.base_fare,
                                                                  "Onward",
                                                                )
                                                              }
                                                            >
                                                              BOOK NOW
                                                            </button>

                                                            <button
                                                              className={`fare-mini-toggle ${isSelected ? "toggle-active" : ""}`}
                                                              type="button"
                                                              title={
                                                                isSelected
                                                                  ? "Remove Fare"
                                                                  : "Select fare and share"
                                                              }
                                                              onClick={() =>
                                                                handleFareToggle(
                                                                  FlightInfo,
                                                                  fare,
                                                                  flightId,
                                                                  currentFlightFares?.base_fare,
                                                                )
                                                              }
                                                            >
                                                              {isSelected
                                                                ? "−"
                                                                : "+"}
                                                            </button>
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        )}
                                        <div className="flt-l-cr">
                                          {showFlightDetails === index && (
                                            <>
                                              <hr />
                                              <div
                                                className="flight-details"
                                                style={{ display: "block" }}
                                              >
                                                {/* Tabs */}
                                                <Nav className="flight_detailnav ">
                                                  <Nav.Item>
                                                    <Nav.Link
                                                      role="button"
                                                      className={` ${
                                                        showContent ===
                                                        "flight_details"
                                                          ? "active"
                                                          : ""
                                                      }`}
                                                      onClick={() =>
                                                        setshowcontent(
                                                          "flight_details",
                                                        )
                                                      }
                                                    >
                                                      FLIGHT DETAIL{" "}
                                                    </Nav.Link>
                                                  </Nav.Item>
                                                  <Nav.Item>
                                                    <Nav.Link
                                                      role="button"
                                                      className={` ${
                                                        showContent ===
                                                        "fare_summary"
                                                          ? "active"
                                                          : ""
                                                      }`}
                                                      onClick={() =>
                                                        setshowcontent(
                                                          "fare_summary",
                                                        )
                                                      }
                                                    >
                                                      FARE SUMMARY
                                                    </Nav.Link>
                                                  </Nav.Item>
                                                </Nav>

                                                <div>
                                                  {showContent ===
                                                    "flight_details" && (
                                                    <div
                                                      className="tabcontent"
                                                      style={{
                                                        display: "block",
                                                      }}
                                                    >
                                                      <div>
                                                        <div>
                                                          <div>
                                                            <div>
                                                              {segments.map(
                                                                (
                                                                  segment,
                                                                  index,
                                                                ) => {
                                                                  const {
                                                                    Airline,
                                                                    Origin,
                                                                    Destination,
                                                                    Equipment,
                                                                  } = segment;
                                                                  const depTime =
                                                                    new Date(
                                                                      Origin?.DepTime,
                                                                    );
                                                                  const arrTime =
                                                                    new Date(
                                                                      Destination?.ArrTime,
                                                                    );
                                                                  // Calculate duration
                                                                  const durationMs =
                                                                    new Date(
                                                                      arrTime.toUTCString(),
                                                                    ).getTime() -
                                                                    new Date(
                                                                      depTime.toUTCString(),
                                                                    ).getTime();
                                                                  const durationHours =
                                                                    Math.floor(
                                                                      durationMs /
                                                                        (1000 *
                                                                          60 *
                                                                          60),
                                                                    );
                                                                  const durationMinutes =
                                                                    Math.floor(
                                                                      (durationMs %
                                                                        (1000 *
                                                                          60 *
                                                                          60)) /
                                                                        (1000 *
                                                                          60),
                                                                    );
                                                                  const duration = `${durationHours}H ${durationMinutes}M`;
                                                                  const cleanText =
                                                                    (text) => {
                                                                      if (
                                                                        !text ||
                                                                        typeof text !==
                                                                          "string"
                                                                      )
                                                                        return text;

                                                                      // Remove special characters but keep spaces, letters, numbers, basic punctuation
                                                                      return text
                                                                        .replace(
                                                                          /[^\w\s(),.-]/g,
                                                                          "",
                                                                        ) // Keep alphanumeric, spaces, and basic punctuation
                                                                        .replace(
                                                                          /\s+/g,
                                                                          " ",
                                                                        ) // Replace multiple spaces with single space
                                                                        .trim();
                                                                    };
                                                                  const calculateLayover =
                                                                    (
                                                                      arrival,
                                                                      departure,
                                                                    ) => {
                                                                      if (
                                                                        !arrival ||
                                                                        !departure
                                                                      )
                                                                        return "00 Hrs : 00 mins";

                                                                      const arr =
                                                                        new Date(
                                                                          arrival,
                                                                        );
                                                                      const dep =
                                                                        new Date(
                                                                          departure,
                                                                        );
                                                                      const diffMs =
                                                                        dep -
                                                                        arr;

                                                                      if (
                                                                        diffMs <
                                                                        0
                                                                      )
                                                                        return "00 Hrs : 00 mins";

                                                                      const diffH =
                                                                        Math.floor(
                                                                          diffMs /
                                                                            (1000 *
                                                                              60 *
                                                                              60),
                                                                        );
                                                                      const diffM =
                                                                        Math.floor(
                                                                          (diffMs /
                                                                            (1000 *
                                                                              60)) %
                                                                            60,
                                                                        );

                                                                      return `${String(diffH).padStart(2, "0")} Hrs : ${String(
                                                                        diffM,
                                                                      ).padStart(
                                                                        2,
                                                                        "0",
                                                                      )} mins`;
                                                                    };
                                                                  const stops =
                                                                    [];
                                                                  if (
                                                                    segments &&
                                                                    segments.length >
                                                                      1
                                                                  ) {
                                                                    for (
                                                                      let i = 0;
                                                                      i <
                                                                      segments.length -
                                                                        1;
                                                                      i++
                                                                    ) {
                                                                      const currentSeg =
                                                                        segments[
                                                                          i
                                                                        ];
                                                                      const nextSeg =
                                                                        segments[
                                                                          i + 1
                                                                        ];

                                                                      const stopAirport =
                                                                        currentSeg
                                                                          ?.Destination
                                                                          ?.Airport;

                                                                      const layoverTime =
                                                                        calculateLayover(
                                                                          currentSeg
                                                                            ?.Destination
                                                                            ?.ArrTime,
                                                                          nextSeg
                                                                            ?.Origin
                                                                            ?.DepTime,
                                                                        );

                                                                      stops.push(
                                                                        {
                                                                          stop_airport:
                                                                            cleanText(
                                                                              `${stopAirport?.AirportName || ""} ${stopAirport?.CityName || ""} (${stopAirport?.AirportCode || ""})`,
                                                                            ),
                                                                          duration:
                                                                            layoverTime,
                                                                        },
                                                                      );
                                                                    }
                                                                  }
                                                                  return (
                                                                    <div
                                                                      key={
                                                                        index
                                                                      }
                                                                    >
                                                                      <div className="flight-details-d"></div>
                                                                      <div className="flight-details-a ">
                                                                        {
                                                                          Airline?.AirlineName
                                                                        }{" "}
                                                                        .{" "}
                                                                        {
                                                                          Airline?.AirlineCode
                                                                        }
                                                                        {
                                                                          Airline?.FlightNumber
                                                                        }{" "}
                                                                        ||{" "}
                                                                        {
                                                                          Origin
                                                                            ?.Airport
                                                                            ?.CityName
                                                                        }{" "}
                                                                        To{" "}
                                                                        {
                                                                          Destination
                                                                            ?.Airport
                                                                            ?.CityName
                                                                        }{" "}
                                                                        ,{" "}
                                                                        {formatdatemonth(
                                                                          Origin?.DepTime,
                                                                        )}
                                                                      </div>
                                                                      <div className="clear"></div>

                                                                      {/* Flight Segment Details */}
                                                                      <div className="flightstopdetail">
                                                                        <div className="flight-details-lr">
                                                                          <p className="flight-details-b">
                                                                            {
                                                                              Origin
                                                                                ?.Airport
                                                                                ?.CityName
                                                                            }
                                                                          </p>
                                                                          <p className="flight-details-b mb-1">
                                                                            {handleweekdatemonthyear(
                                                                              Origin?.DepTime,
                                                                            )}
                                                                          </p>
                                                                          <p className="flight-details-c mb-0">
                                                                            {format(
                                                                              new Date(
                                                                                Origin?.DepTime,
                                                                              ),
                                                                              "HH:mm",
                                                                            )}
                                                                          </p>
                                                                          <p className="flight-details-c1 mb-1">
                                                                            {
                                                                              Origin
                                                                                ?.Airport
                                                                                ?.AirportName
                                                                            }
                                                                          </p>
                                                                          <p className="flight-details-c mb-0">
                                                                            {Origin
                                                                              ?.Airport
                                                                              ?.Terminal
                                                                              ? ` Terminal ${Origin?.Airport?.Terminal}`
                                                                              : ""}
                                                                          </p>
                                                                        </div>

                                                                        <div className="flight-details-mr">
                                                                          <p className="flight-details-e">
                                                                            {
                                                                              duration
                                                                            }
                                                                          </p>
                                                                          <div className="flight-details-e">
                                                                            <hr />
                                                                          </div>
                                                                        </div>

                                                                        <div className="flight-details-rr">
                                                                          <p className="flight-details-b">
                                                                            {
                                                                              Destination
                                                                                ?.Airport
                                                                                ?.CityName
                                                                            }
                                                                          </p>
                                                                          <p className="flight-details-b">
                                                                            {handleweekdatemonthyear(
                                                                              Destination?.ArrTime,
                                                                            )}
                                                                          </p>
                                                                          <p className="flight-details-c mb-0">
                                                                            {format(
                                                                              new Date(
                                                                                Destination?.ArrTime,
                                                                              ),
                                                                              "HH:mm",
                                                                            )}
                                                                          </p>
                                                                          <p className="flight-details-c1 mb-1">
                                                                            {
                                                                              Destination
                                                                                ?.Airport
                                                                                ?.AirportName
                                                                            }
                                                                          </p>
                                                                          <p className="flight-details-c mb-0">
                                                                            {Destination
                                                                              ?.Airport
                                                                              ?.Terminal
                                                                              ? ` Terminal ${Destination?.Airport?.Terminal}`
                                                                              : ""}
                                                                          </p>
                                                                        </div>
                                                                      </div>

                                                                      {/* Layover Information - THIS SHOULD BE AFTER flightstopdetail, NOT INSIDE IT */}
                                                                      {index <
                                                                        segments.length -
                                                                          1 &&
                                                                        stops[
                                                                          index
                                                                        ] && (
                                                                          <div className="layover-simple">
                                                                            <p>
                                                                              {/* Change of planes if applicable */}
                                                                              {/* {segments[index]?.Airline?.FlightNumber !== segments[index + 1]?.Airline?.FlightNumber && (
        <>Change of planes <span>·</span></>
      )} */}
                                                                              {/* Layover duration and location */}
                                                                              <strong>
                                                                                {
                                                                                  stops[
                                                                                    index
                                                                                  ]
                                                                                    .duration
                                                                                }
                                                                              </strong>{" "}
                                                                              Layover
                                                                              in{" "}
                                                                              {segments[
                                                                                index
                                                                              ]
                                                                                ?.Destination
                                                                                ?.Airport
                                                                                ?.CityName ||
                                                                                "Ahmedabad"}
                                                                            </p>
                                                                          </div>
                                                                        )}

                                                                      <div className="clear"></div>
                                                                    </div>
                                                                  );
                                                                },
                                                              )}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )}
                                                  {showContent ===
                                                    "fare_summary" && (
                                                    <div className="tabcontent">
                                                      <div className="flight-details-a">
                                                        Fare Breakup (For All
                                                        Passengers)
                                                      </div>
                                                      <div className="flight-details-l">
                                                        <p className="flight-details-b">
                                                          Total Fare
                                                        </p>
                                                        <p className="flight-details-c mb-0">
                                                          Base Price
                                                        </p>
                                                        <p className="flight-details-c mb-0">
                                                          Tax
                                                        </p>
                                                        <p className="flight-details-c mb-0">
                                                          IN
                                                        </p>
                                                        <p className="flight-details-c mb-0 ">
                                                          Surcharge
                                                        </p>
                                                      </div>
                                                      <div className="flight-details-r">
                                                        <p className="flight-details-b">
                                                          ₹{" "}
                                                          {
                                                            response.prices
                                                              .TotalPrice
                                                          }
                                                        </p>
                                                        <p className="flight-details-c mb-0">
                                                          ₹{" "}
                                                          {
                                                            response.prices
                                                              .BaseFare
                                                          }
                                                        </p>
                                                        <p className="flight-details-c mb-0">
                                                          ₹{" "}
                                                          {
                                                            response.prices
                                                              .Taxes
                                                          }
                                                        </p>
                                                        <p className="flight-details-c mb-0">
                                                          ₹ 00
                                                        </p>
                                                        <p className="flight-details-c mb-0">
                                                          ₹ 00
                                                        </p>
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="px-4 flex flex-col items-center">
                        <div className="Searchresult text-center">
                          <div className="pl-7 ml-7">
                            <img
                              src="/img/FlightNotFound.png"
                              alt="Flight Not Found"
                              className="w-4/5 mb-2"
                            />
                          </div>
                          <p className="font-semibold text-gray-700">
                            These search onward flights are not available.
                            Please modify your search.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flightoptions">
                    {Array.isArray(FlightReturnOptions) &&
                    FlightReturnOptions.length > 0 ? (
                      <div className=".two-colls-right-return">
                        <div className="two-colls-right-b">
                          <div className="padding">
                            <div className="catalog-row-return" id="catalog">
                              <div className="side-block py-1 px-3 fly-in headingofflights">
                                <span>
                                  {" "}
                                  {inputValue.destinationAriport
                                    ? inputDestination.split(/[-(]/)[0].trim()
                                    : ToAirport.split(/[-(]/)[0].trim()}{" "}
                                  <ArrowForwardSharp
                                    style={{ width: "35px" }}
                                  />{" "}
                                  {inputValue.originAirport
                                    ? inputOrigin.split(/[-(]/)[0].trim()
                                    : fromAirport.split(/[-(]/)[0].trim()}
                                </span>
                                <span
                                  style={{
                                    float: "right",
                                    marginTop: "2px",
                                    marginRight: "5px",
                                  }}
                                >
                                  {" "}
                                  {formatDate(
                                    inputValue.returnDate
                                      ? extractDate(inputValue.returnDate)
                                      : extractDate(ReturnDate),
                                  )}
                                </span>
                              </div>
                              <div className="row catalog_filters_return">
                                <div
                                  className="col-md-2 departurefilter cursor-pointer"
                                  onClick={() => handleReturnSort("departure")}
                                  style={{
                                    opacity:
                                      sortReturnField === "departure"
                                        ? "1"
                                        : "0.5",
                                  }}
                                >
                                  Departure
                                  {sortReturnField === "departure" && (
                                    <span style={{ marginLeft: "5px" }}>
                                      {sortReturnOrder === "asc" ? "↑" : "↓"}
                                    </span>
                                  )}
                                </div>

                                <div
                                  className="col-md-3 travelfilter cursor-pointer"
                                  onClick={() => handleReturnSort("travelTime")}
                                  style={{
                                    opacity:
                                      sortReturnField === "travelTime"
                                        ? "1"
                                        : "0.5",
                                  }}
                                >
                                  Travel Time
                                  {sortReturnField === "travelTime" && (
                                    <span style={{ marginLeft: "5px" }}>
                                      {sortReturnOrder === "asc" ? "↑" : "↓"}
                                    </span>
                                  )}
                                </div>

                                <div
                                  className="col-md-2 arriavelfilter cursor-pointer"
                                  onClick={() => handleReturnSort("arrival")}
                                  style={{
                                    opacity:
                                      sortReturnField === "arrival"
                                        ? "1"
                                        : "0.5",
                                  }}
                                >
                                  Arrival
                                  {sortReturnField === "arrival" && (
                                    <span style={{ marginLeft: "5px" }}>
                                      {sortReturnOrder === "asc" ? "↑" : "↓"}
                                    </span>
                                  )}
                                </div>

                                {/* <div
                                  className="col-md-2 stopsfilter cursor-pointer"
                                  onClick={() => handleReturnSort("stops")}
                                  style={{
                                    opacity:
                                      sortReturnField === "stops" ? "1" : "0.5",
                                  }}
                                >
                                  Stops
                                  {sortReturnField === "stops" && (
                                    <span style={{ marginLeft: "5px" }}>
                                      {sortReturnOrder === "asc" ? "↑" : "↓"}
                                    </span>
                                  )}
                                </div> */}

                                <div
                                  className="col-md-3 pricefilter cursor-pointer"
                                  onClick={() => handleReturnSort("price")}
                                  style={{
                                    opacity:
                                      sortReturnField === "price" ? "1" : "0.5",
                                  }}
                                >
                                  Price
                                  {sortReturnField === "price" && (
                                    <span style={{ marginLeft: "5px" }}>
                                      {sortReturnOrder === "asc" ? "↑" : "↓"}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div
                              className="overflow-y-auto mt-2"
                              style={{ maxHeight: "400vh" }}
                            >
                              {/* {console.log('===== FINAL RETURN FLIGHTS =====')}
{console.log('Total original:', FlightReturnOptions?.length)}
{console.log('After filtering:', filteredReturnFlights?.length)}
{console.log('After sorting/dedup:', sortedReturnFlights?.length)} */}
                              {sortedReturnFlights?.length === 0 ? (
                                <div className="Searchresult text-center">
                                  <div
                                    className="pl-10 ml-10"
                                    style={{ paddingLeft: "160px" }}
                                  >
                                    <img
                                      src="/img/FlightNotFound.png"
                                      alt="Flight Not Found"
                                      className="w-2/3"
                                    />
                                  </div>
                                  <p className="font-semibold text-gray-700 mb-0">
                                    These flights are not available. Please
                                    modify your search.
                                  </p>
                                </div>
                              ) : (
                                sortedReturnFlights.map((response, index) => {
                                  const FlightInfo = response?.flight;
                                  const flightId =
                                    getFlightUniqueId(FlightInfo); //  flightId generate karo
                                  const depTime = FlightInfo?.depTime || "";
                                  const arrTime = FlightInfo?.arrTime || "";

                                  const formattedDepTime = FlightInfo?.depTime
                                    ? format(new Date(depTime), "HH:mm")
                                    : "N/A";
                                  const formattedArrTime = FlightInfo?.arrTime
                                    ? format(new Date(arrTime), "HH:mm")
                                    : "N/A";

                                  // Calculate duration
                                  const durationMs =
                                    new Date(arrTime).getTime() -
                                    new Date(depTime).getTime();
                                  const durationHours = Math.floor(
                                    durationMs / (1000 * 60 * 60),
                                  );
                                  const durationMinutes = Math.floor(
                                    (durationMs % (1000 * 60 * 60)) /
                                      (1000 * 60),
                                  );
                                  const duration = `${durationHours}H ${durationMinutes}M`;

                                  // Layover calculation
                                  const segments = FlightInfo.segments;
                                  let totalLayoverMinutes = 0;
                                  let Totallayover = "";
                                  if (segments.length > 1) {
                                    for (
                                      let i = 0;
                                      i < segments.length - 1;
                                      i++
                                    ) {
                                      const arrivalTime = dayjs(
                                        segments[i].Destination.ArrTime,
                                      );
                                      const nextDepartureTime = dayjs(
                                        segments[i + 1].Origin.DepTime,
                                      );
                                      const layoverMinutes =
                                        nextDepartureTime.diff(
                                          arrivalTime,
                                          "minute",
                                        );
                                      totalLayoverMinutes += layoverMinutes;
                                    }

                                    const totalLayoverDuration = dayjs.duration(
                                      totalLayoverMinutes,
                                      "minutes",
                                    );
                                    const totalHours =
                                      totalLayoverDuration.hours();
                                    const totalMinutes =
                                      totalLayoverDuration.minutes();

                                    Totallayover = `${
                                      totalHours > 0 ? `${totalHours}h ` : ""
                                    }${totalMinutes}m Total Layover`;
                                  }

                                  //  FARE PROCESSING - returnFlightFares use karo
                                  let uniqueFares = [];
                                  const currentReturnFlightFares =
                                    returnFlightFares[flightId]; //  returnFlightFares

                                  // if (currentReturnFlightFares) {
                                  const formattedUapiFares = (
                                    currentReturnFlightFares?.uapi_fares || []
                                  ).map((fare) => ({
                                    type: (fare.SupplierFareClass || "").trim(),
                                    price: parseFloat(fare.TotalPrice),
                                    from: "Uapi",
                                    Resultindex: fare.ResultIndex,
                                    TraceId: fare.trace_id,
                                    isLCC: fare.isLCC,
                                    ProviderCode: fare.ProviderCode,
                                  }));

                                  const formattedTboFares = (
                                    currentReturnFlightFares?.tbo_fares || []
                                  ).map((fare) => ({
                                    type: (
                                      fare.SupplierFareClass || "Regular Fare"
                                    ).trim(),
                                    price: parseFloat(fare.TotalPrice),
                                    from: "Tbo",
                                    Resultindex: fare.ResultIndex,
                                    TraceId: fare.trace_id,
                                    ProviderCode: fare.ProviderCode,
                                  }));

                                  const combinedFares = [
                                    ...formattedUapiFares,
                                    ...formattedTboFares,
                                  ];

                                  const grouped = combinedFares.reduce(
                                    (acc, fare) => {
                                      if (!acc[fare.type]) acc[fare.type] = [];
                                      acc[fare.type].push(fare);
                                      return acc;
                                    },
                                    {},
                                  );

                                  Object.keys(grouped).forEach((fareType) => {
                                    const fares = grouped[fareType];

                                    if (
                                      fareType
                                        .toLowerCase()
                                        .includes("corporate")
                                    ) {
                                      const uapiFare = fares.find(
                                        (f) => f.from === "Uapi",
                                      );
                                      if (uapiFare) {
                                        uniqueFares.push(uapiFare);
                                      } else {
                                        uniqueFares.push(fares[0]);
                                      }
                                      return;
                                    }

                                    const cheapest = fares.reduce((a, b) =>
                                      a.price < b.price ? a : b,
                                    );
                                    uniqueFares.push(cheapest);
                                  });

                                  uniqueFares.sort((a, b) => a.price - b.price);
                                  // }

                                  // Number of days calculation
                                  const dep = new Date(depTime);
                                  const arr = new Date(arrTime);
                                  const depDate = new Date(
                                    dep.getFullYear(),
                                    dep.getMonth(),
                                    dep.getDate(),
                                  );
                                  const arrDate = new Date(
                                    arr.getFullYear(),
                                    arr.getMonth(),
                                    arr.getDate(),
                                  );
                                  const diffInMs =
                                    arrDate.getTime() - depDate.getTime();
                                  const diffInDays = Math.round(
                                    diffInMs / (1000 * 60 * 60 * 24),
                                  );
                                  const date = new Date(arr);

                                  const options = {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  };
                                  const formattedDate = date.toLocaleDateString(
                                    "en-GB",
                                    options,
                                  );

                                  return (
                                    <div
                                      key={flightId} //  key flightId based
                                      className={`flight-item fly-in ${
                                        selectedReturnFlightIds.includes(
                                          flightId,
                                        )
                                          ? "selected-flight"
                                          : "" //  flightId se check
                                      }`}
                                    >
                                      <div className="flt-i-a flex flex-col">
                                        <div className="flt-i-br ">
                                          <div className="flt-l-br">
                                            <div className="mb-1 flt-l-img ">
                                              {[
                                                ...new Set(
                                                  FlightInfo?.segments?.map(
                                                    (segment) =>
                                                      segment.Airline
                                                        .AirlineLogo,
                                                  ),
                                                ),
                                              ].map((logo) => {
                                                return (
                                                  <img
                                                    key={logo}
                                                    src={`${logo}`}
                                                    className="w-7 h-7 inline-block mr-2"
                                                  />
                                                );
                                              })}
                                            </div>
                                            {/* <img src={FlightInfo?.segments[0]?.Airline.AirlineLogo} alt="Airline Logo" className="w-8 h-8" /> */}
                                            <div className="flt-l-fightname ">
                                              <p className=" cardbody_font font-Montserrat mb-0 ">
                                                {[
                                                  ...new Set(
                                                    FlightInfo?.segments?.map(
                                                      (segment) =>
                                                        segment.Airline
                                                          .AirlineName,
                                                    ),
                                                  ),
                                                ].join(" , ")}
                                              </p>

                                              <p className="text-[11px] font-Montserrat ">
                                                {FlightInfo?.segments
                                                  ?.map(
                                                    (segment) =>
                                                      `${segment.Airline.AirlineCode} ${segment.Airline.FlightNumber}`,
                                                  )
                                                  .join(" , ")}
                                              </p>
                                            </div>
                                          </div>

                                          <div className="flt-l-cr">
                                            <div className="Flightflow">
                                              <div className="flight-line-origin">
                                                <div className="text-[15px] font-bold">
                                                  {formattedDepTime}
                                                </div>
                                                <div className="cardbody_font">
                                                  {
                                                    FlightInfo?.originAirport
                                                      ?.CityName
                                                  }{" "}
                                                </div>
                                              </div>
                                              <div className="flight-timeline">
                                                <div className=" line-from">
                                                  <img src="/img/DOTT_LINE.svg" />
                                                </div>
                                                <div className="flight-line-a text-center font-Montserrat flight-time">
                                                  <div className="stop-badge-container relative group">
                                                    <div className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 -translate-x-1/2 z-10">
                                                      <div className="bg-white text-black text-[8px] font-Montserrat px-3 py-2 rounded border shadow-md whitespace-nowrap relative">
                                                        {segments.length ===
                                                        1 ? (
                                                          <span className="text-[8px]">
                                                            This is a direct
                                                            flight with no stops
                                                          </span>
                                                        ) : (
                                                          <span
                                                            className=" leading-tight"
                                                            style={{
                                                              fontSize: "10px",
                                                            }}
                                                          >
                                                            <p className="mb-0">
                                                              Plane Change
                                                            </p>
                                                            <p className="mb-1">
                                                              {
                                                                segments[0]
                                                                  .Destination
                                                                  .Airport
                                                                  .CityName
                                                              }{" "}
                                                              | {Totallayover}
                                                            </p>
                                                          </span>
                                                        )}
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white"></div>
                                                      </div>
                                                    </div>
                                                    <div className="flight-line-a">
                                                      <span className="text-sm">
                                                        {duration}
                                                      </span>
                                                      <div className="flight-line-d2 mt-0 mr-0 "></div>
                                                      <div className="w-fit mx-auto stop-badge">
                                                        {segments.length ===
                                                        1 ? (
                                                          <p className=" cursor-pointer leading-tight mb-0">
                                                            Non-stop
                                                          </p>
                                                        ) : (
                                                          <p className="cursor-pointer leading-tight mb-0">
                                                            {segments.length -
                                                              1}{" "}
                                                            stop
                                                            {segments.length -
                                                              1 >
                                                            1
                                                              ? "s"
                                                              : ""}{" "}
                                                            via{" "}
                                                            {
                                                              segments[0]
                                                                .Destination
                                                                .Airport
                                                                .CityName
                                                            }
                                                          </p>
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="line-to">
                                                  <img src="/img/FLIGHT_LINE.svg" />
                                                </div>
                                              </div>
                                              <div className="flight-line-destination">
                                                <div className="flex items-center space-x-1">
                                                  <div className="text-[15px] font-bold">
                                                    {formattedArrTime}
                                                  </div>
                                                  {diffInDays > 0 && (
                                                    <div className="relative group inline-block">
                                                      <span
                                                        className="font-medium cursor-pointer"
                                                        style={{
                                                          fontSize: "10px",
                                                          color: "red",
                                                        }}
                                                      >
                                                        +{diffInDays}{" "}
                                                        {diffInDays > 1
                                                          ? "DAYS"
                                                          : "DAY"}
                                                      </span>
                                                      <div className="absolute hidden group-hover:block bottom-full mb-1 left-1/2 -translate-x-1/2 z-10">
                                                        <div className="relative bg-white text-black text-[12px] font-Montserrat px-3 py-1 rounded border shadow-md whitespace-nowrap">
                                                          {formattedDate}
                                                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white drop-shadow-md"></div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                                <div className="cardbody_font">
                                                  {
                                                    FlightInfo
                                                      ?.destinationAirport
                                                      ?.CityName
                                                  }
                                                </div>
                                              </div>
                                              <div className="flight-price">
                                                {" "}
                                                <span className="flightprice">
                                                  ₹{" "}
                                                  {Number(
                                                    response.prices.TotalPrice,
                                                  )}
                                                </span>
                                                <br />
                                                <span className="text-[10px] text-gray-900 float-right">
                                                  /adult
                                                </span>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="flt-i-cr">
                                            <div className="flight-detail cursor-pointer">
                                              <div className="flight-show-details">
                                                <span
                                                  className="text-[11px] text-[#785eff]"
                                                  onClick={() =>
                                                    setShowReturnFlightDetails(
                                                      showReturnFlightDetails ===
                                                        index
                                                        ? null
                                                        : index,
                                                    )
                                                  }
                                                >
                                                  Show Flight Details
                                                </span>
                                              </div>
                                              <div className="fligth-view-price">
                                                <span>
                                                  <button
                                                    className="viewprice"
                                                    style={{
                                                      borderRadius: "18px",
                                                    }}
                                                    onClick={() => {
                                                      if (
                                                        !returnFlightFares?.[
                                                          flightId
                                                        ]
                                                      ) {
                                                        GetreturnFares(
                                                          response,
                                                          flightId,
                                                        ); // Pass both response and flightId
                                                      }
                                                      toggleShowReturnPrices(
                                                        flightId,
                                                      );
                                                    }}
                                                  >
                                                    <span className="text-[10px]">
                                                      View Prices
                                                    </span>
                                                  </button>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div>
                                          {showReturnPrices.has(flightId) && (
                                            <div className="flight-price-wrapper w-full mt-4">
                                              {returnFareLoadingg[flightId] && (
                                                <div className="flex items-center justify-center bg-white/30">
                                                  <div className="big-loader flex items-center justify-center">
                                                    <img
                                                      style={{
                                                        width: "100px",
                                                        height: "100px",
                                                      }}
                                                      src="/img/cotravloader.gif"
                                                      alt="Loader"
                                                    />
                                                    <p className="text-center ml-4 text-gray-600 text-xs">
                                                      Retrieving flight fares.
                                                      Please wait a moment.
                                                    </p>
                                                  </div>
                                                </div>
                                              )}

                                              <div className="fare-mini-grid">
                                                {uniqueFares.map(
                                                  (fare, idx) => {
                                                    const isSelected =
                                                      selectedReturnFares.some(
                                                        (f) =>
                                                          f.flightId ===
                                                            flightId &&
                                                          f.fareType ===
                                                            fare.type,
                                                      );
                                                    const policyKey = `${flightId}_${fare.type}`;
                                                    const isPolicyLoading =
                                                      policyLoading[policyKey];
                                                    const hasPolicy =
                                                      cancellationPolicies[
                                                        policyKey
                                                      ];

                                                    // Check if Book Now button should be hidden
                                                    const hideBookNow = false; // Replace with your actual condition

                                                    return (
                                                      <div
                                                        className={`fare-mini-card ${isSelected ? "mini-selected" : ""}`}
                                                        key={idx}
                                                      >
                                                        <div className="fare-mini-content">
                                                          {/* Fare Type and Policy Icon */}
                                                          <div className="fare-mini-header">
                                                            <span className="fare-mini-type">
                                                              {fare.type}
                                                            </span>
                                                            <button
                                                              className="fare-mini-policy"
                                                              type="button"
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleShowPolicy(
                                                                  FlightInfo,
                                                                  fare,
                                                                  flightId,
                                                                  currentReturnFlightFares?.base_fare,
                                                                );
                                                              }}
                                                              title="View Cancellation & Date Change Policy"
                                                            >
                                                              {isPolicyLoading ? (
                                                                <span className="mini-policy-loading">
                                                                  ...
                                                                </span>
                                                              ) : (
                                                                <svg
                                                                  width="10"
                                                                  height="10"
                                                                  viewBox="0 0 24 24"
                                                                  fill="none"
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                  className={`mini-policy-icon ${hasPolicy ? "mini-policy-active" : ""}`}
                                                                >
                                                                  <path
                                                                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                  />
                                                                  <path
                                                                    d="M12 16V12"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                  />
                                                                  <path
                                                                    d="M12 8H12.01"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                  />
                                                                </svg>
                                                              )}
                                                            </button>
                                                          </div>

                                                          {/* Source - Highlighted */}
                                                          {fare.from && (
                                                            <div className="fare-mini-source">
                                                              ({fare.from})
                                                            </div>
                                                          )}

                                                          {/* Price Row - Conditional rendering based on hideBookNow */}
                                                          {hideBookNow ? (
                                                            <div className="fare-mini-price-row">
                                                              <span className="fare-mini-price">
                                                                ₹{fare.price}
                                                              </span>
                                                              <button
                                                                className={`fare-mini-toggle ${isSelected ? "toggle-active" : ""}`}
                                                                type="button"
                                                                title={
                                                                  isSelected
                                                                    ? "Remove Fare"
                                                                    : "Select fare and share"
                                                                }
                                                                onClick={() =>
                                                                  handleReturnFareToggle(
                                                                    FlightInfo,
                                                                    fare,
                                                                    flightId,
                                                                    currentReturnFlightFares?.base_fare,
                                                                  )
                                                                }
                                                              >
                                                                {isSelected
                                                                  ? "−"
                                                                  : "+"}
                                                              </button>
                                                            </div>
                                                          ) : (
                                                            <>
                                                              <div className="fare-mini-price">
                                                                ₹{fare.price}
                                                              </div>
                                                              {/* Button Group with Book Now and Toggle */}
                                                              <div className="fare-mini-button-group">
                                                                <button
                                                                  type="button"
                                                                  className="fare-mini-book"
                                                                  onClick={() =>
                                                                    handleSingleSelect(
                                                                      FlightInfo, //  Use FlightInfo, not ReturnFlightFares
                                                                      fare,
                                                                      flightId, // Pass flightId
                                                                      currentReturnFlightFares?.base_fare,
                                                                      "Return",
                                                                    )
                                                                  }
                                                                >
                                                                  BOOK NOW
                                                                </button>

                                                                <button
                                                                  className={`fare-mini-toggle ${isSelected ? "toggle-active" : ""}`}
                                                                  type="button"
                                                                  title={
                                                                    isSelected
                                                                      ? "Remove Fare"
                                                                      : "Select fare and share"
                                                                  }
                                                                  onClick={() =>
                                                                    handleReturnFareToggle(
                                                                      FlightInfo,
                                                                      fare,
                                                                      flightId,
                                                                      currentReturnFlightFares?.base_fare,
                                                                    )
                                                                  }
                                                                >
                                                                  {isSelected
                                                                    ? "−"
                                                                    : "+"}
                                                                </button>
                                                              </div>
                                                            </>
                                                          )}
                                                        </div>
                                                      </div>
                                                    );
                                                  },
                                                )}
                                              </div>
                                            </div>
                                          )}

                                          <div className="flt-l-cr">
                                            {showReturnFlightDetails ===
                                              index && (
                                              <>
                                                <hr />
                                                <div
                                                  className="flight-details"
                                                  style={{ display: "block" }}
                                                >
                                                  {/* Tabs */}
                                                  <Nav className="flight_detailnav ">
                                                    <Nav.Item>
                                                      <Nav.Link
                                                        role="button"
                                                        className={` ${
                                                          returnShowContent ===
                                                          "flight_details"
                                                            ? "active"
                                                            : ""
                                                        }`}
                                                        onClick={() =>
                                                          setReturnShowContent(
                                                            "flight_details",
                                                          )
                                                        }
                                                      >
                                                        FLIGHT DETAIL{" "}
                                                      </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item>
                                                      <Nav.Link
                                                        role="button"
                                                        className={` ${
                                                          returnShowContent ===
                                                          "fare_summary"
                                                            ? "active"
                                                            : ""
                                                        }`}
                                                        onClick={() =>
                                                          setReturnShowContent(
                                                            "fare_summary",
                                                          )
                                                        }
                                                      >
                                                        FARE SUMMARY
                                                      </Nav.Link>
                                                    </Nav.Item>
                                                  </Nav>

                                                  <div>
                                                    {returnShowContent ===
                                                      "flight_details" && (
                                                      <div
                                                        className="tabcontent"
                                                        style={{
                                                          display: "block",
                                                        }}
                                                      >
                                                        <div>
                                                          <div>
                                                            <div>
                                                              <div>
                                                                {segments.map(
                                                                  (
                                                                    segment,
                                                                    index,
                                                                  ) => {
                                                                    const {
                                                                      Airline,
                                                                      Origin,
                                                                      Destination,
                                                                      Equipment,
                                                                    } = segment;
                                                                    const depTime =
                                                                      new Date(
                                                                        Origin?.DepTime,
                                                                      );
                                                                    const arrTime =
                                                                      new Date(
                                                                        Destination?.ArrTime,
                                                                      );
                                                                    // Calculate duration
                                                                    const durationMs =
                                                                      new Date(
                                                                        arrTime.toUTCString(),
                                                                      ).getTime() -
                                                                      new Date(
                                                                        depTime.toUTCString(),
                                                                      ).getTime();
                                                                    const durationHours =
                                                                      Math.floor(
                                                                        durationMs /
                                                                          (1000 *
                                                                            60 *
                                                                            60),
                                                                      );
                                                                    const durationMinutes =
                                                                      Math.floor(
                                                                        (durationMs %
                                                                          (1000 *
                                                                            60 *
                                                                            60)) /
                                                                          (1000 *
                                                                            60),
                                                                      );
                                                                    const duration = `${durationHours}H ${durationMinutes}M`;
                                                                    const cleanText =
                                                                      (
                                                                        text,
                                                                      ) => {
                                                                        if (
                                                                          !text ||
                                                                          typeof text !==
                                                                            "string"
                                                                        )
                                                                          return text;

                                                                        // Remove special characters but keep spaces, letters, numbers, basic punctuation
                                                                        return text
                                                                          .replace(
                                                                            /[^\w\s(),.-]/g,
                                                                            "",
                                                                          ) // Keep alphanumeric, spaces, and basic punctuation
                                                                          .replace(
                                                                            /\s+/g,
                                                                            " ",
                                                                          ) // Replace multiple spaces with single space
                                                                          .trim();
                                                                      };
                                                                    const calculateLayover =
                                                                      (
                                                                        arrival,
                                                                        departure,
                                                                      ) => {
                                                                        if (
                                                                          !arrival ||
                                                                          !departure
                                                                        )
                                                                          return "00 Hrs : 00 mins";

                                                                        const arr =
                                                                          new Date(
                                                                            arrival,
                                                                          );
                                                                        const dep =
                                                                          new Date(
                                                                            departure,
                                                                          );
                                                                        const diffMs =
                                                                          dep -
                                                                          arr;

                                                                        if (
                                                                          diffMs <
                                                                          0
                                                                        )
                                                                          return "00 Hrs : 00 mins";

                                                                        const diffH =
                                                                          Math.floor(
                                                                            diffMs /
                                                                              (1000 *
                                                                                60 *
                                                                                60),
                                                                          );
                                                                        const diffM =
                                                                          Math.floor(
                                                                            (diffMs /
                                                                              (1000 *
                                                                                60)) %
                                                                              60,
                                                                          );

                                                                        return `${String(diffH).padStart(2, "0")} Hrs : ${String(
                                                                          diffM,
                                                                        ).padStart(
                                                                          2,
                                                                          "0",
                                                                        )} mins`;
                                                                      };
                                                                    const stops =
                                                                      [];
                                                                    if (
                                                                      segments &&
                                                                      segments.length >
                                                                        1
                                                                    ) {
                                                                      for (
                                                                        let i = 0;
                                                                        i <
                                                                        segments.length -
                                                                          1;
                                                                        i++
                                                                      ) {
                                                                        const currentSeg =
                                                                          segments[
                                                                            i
                                                                          ];
                                                                        const nextSeg =
                                                                          segments[
                                                                            i +
                                                                              1
                                                                          ];

                                                                        const stopAirport =
                                                                          currentSeg
                                                                            ?.Destination
                                                                            ?.Airport;

                                                                        const layoverTime =
                                                                          calculateLayover(
                                                                            currentSeg
                                                                              ?.Destination
                                                                              ?.ArrTime,
                                                                            nextSeg
                                                                              ?.Origin
                                                                              ?.DepTime,
                                                                          );

                                                                        stops.push(
                                                                          {
                                                                            stop_airport:
                                                                              cleanText(
                                                                                `${stopAirport?.AirportName || ""} ${stopAirport?.CityName || ""} (${stopAirport?.AirportCode || ""})`,
                                                                              ),
                                                                            duration:
                                                                              layoverTime,
                                                                          },
                                                                        );
                                                                      }
                                                                    }
                                                                    return (
                                                                      <div
                                                                        key={
                                                                          index
                                                                        }
                                                                      >
                                                                        <div className="flight-details-d"></div>
                                                                        <div className="flight-details-a ">
                                                                          {
                                                                            Airline?.AirlineName
                                                                          }{" "}
                                                                          .{" "}
                                                                          {
                                                                            Airline?.AirlineCode
                                                                          }
                                                                          {
                                                                            Airline?.FlightNumber
                                                                          }{" "}
                                                                          ||{" "}
                                                                          {
                                                                            Origin
                                                                              ?.Airport
                                                                              ?.CityName
                                                                          }{" "}
                                                                          To{" "}
                                                                          {
                                                                            Destination
                                                                              ?.Airport
                                                                              ?.CityName
                                                                          }{" "}
                                                                          ,{" "}
                                                                          {formatdatemonth(
                                                                            Origin?.DepTime,
                                                                          )}
                                                                        </div>
                                                                        <div className="clear"></div>

                                                                        {/* Flight Segment Details */}
                                                                        <div className="flightstopdetail">
                                                                          <div className="flight-details-lr">
                                                                            <p className="flight-details-b">
                                                                              {
                                                                                Origin
                                                                                  ?.Airport
                                                                                  ?.CityName
                                                                              }
                                                                            </p>
                                                                            <p className="flight-details-b mb-1">
                                                                              {handleweekdatemonthyear(
                                                                                Origin?.DepTime,
                                                                              )}
                                                                            </p>
                                                                            <p className="flight-details-c mb-0">
                                                                              {format(
                                                                                new Date(
                                                                                  Origin?.DepTime,
                                                                                ),
                                                                                "HH:mm",
                                                                              )}
                                                                            </p>
                                                                            <p className="flight-details-c1 mb-1">
                                                                              {
                                                                                Origin
                                                                                  ?.Airport
                                                                                  ?.AirportName
                                                                              }
                                                                            </p>
                                                                            <p className="flight-details-c mb-0">
                                                                              {Origin
                                                                                ?.Airport
                                                                                ?.Terminal
                                                                                ? ` Terminal ${Origin?.Airport?.Terminal}`
                                                                                : ""}
                                                                            </p>
                                                                          </div>

                                                                          <div className="flight-details-mr">
                                                                            <p className="flight-details-e">
                                                                              {
                                                                                duration
                                                                              }
                                                                            </p>
                                                                            <div className="flight-details-e">
                                                                              <hr />
                                                                            </div>
                                                                          </div>

                                                                          <div className="flight-details-rr">
                                                                            <p className="flight-details-b">
                                                                              {
                                                                                Destination
                                                                                  ?.Airport
                                                                                  ?.CityName
                                                                              }
                                                                            </p>
                                                                            <p className="flight-details-b">
                                                                              {handleweekdatemonthyear(
                                                                                Destination?.ArrTime,
                                                                              )}
                                                                            </p>
                                                                            <p className="flight-details-c mb-0">
                                                                              {format(
                                                                                new Date(
                                                                                  Destination?.ArrTime,
                                                                                ),
                                                                                "HH:mm",
                                                                              )}
                                                                            </p>
                                                                            <p className="flight-details-c1 mb-1">
                                                                              {
                                                                                Destination
                                                                                  ?.Airport
                                                                                  ?.AirportName
                                                                              }
                                                                            </p>
                                                                            <p className="flight-details-c mb-0">
                                                                              {Destination
                                                                                ?.Airport
                                                                                ?.Terminal
                                                                                ? ` Terminal ${Destination?.Airport?.Terminal}`
                                                                                : ""}
                                                                            </p>
                                                                          </div>
                                                                        </div>

                                                                        {/* Layover Information - THIS SHOULD BE AFTER flightstopdetail, NOT INSIDE IT */}
                                                                        {index <
                                                                          segments.length -
                                                                            1 &&
                                                                          stops[
                                                                            index
                                                                          ] && (
                                                                            <div className="layover-simple">
                                                                              <p>
                                                                                {/* Change of planes if applicable */}
                                                                                {/* {segments[index]?.Airline?.FlightNumber !== segments[index + 1]?.Airline?.FlightNumber && (
        <>Change of planes <span>·</span></>
      )} */}
                                                                                {/* Layover duration and location */}
                                                                                <strong>
                                                                                  {
                                                                                    stops[
                                                                                      index
                                                                                    ]
                                                                                      .duration
                                                                                  }
                                                                                </strong>{" "}
                                                                                Layover
                                                                                in{" "}
                                                                                {segments[
                                                                                  index
                                                                                ]
                                                                                  ?.Destination
                                                                                  ?.Airport
                                                                                  ?.CityName ||
                                                                                  "Ahmedabad"}
                                                                              </p>
                                                                            </div>
                                                                          )}

                                                                        <div className="clear"></div>
                                                                      </div>
                                                                    );
                                                                  },
                                                                )}
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    )}
                                                    {returnShowContent ===
                                                      "fare_summary" && (
                                                      <div className="tabcontent">
                                                        <div className="flight-details-a">
                                                          Fare Breakup (For Per
                                                          Passenger)
                                                        </div>
                                                        <div className="flight-details-l">
                                                          <p className="flight-details-b">
                                                            Total Fare
                                                          </p>
                                                          <p className="flight-details-c mb-0">
                                                            Base Price
                                                          </p>
                                                          <p className="flight-details-c mb-0">
                                                            Tax
                                                          </p>
                                                          <p className="flight-details-c mb-0">
                                                            IN
                                                          </p>
                                                          <p className="flight-details-c mb-0 ">
                                                            Surcharge
                                                          </p>
                                                        </div>
                                                        <div className="flight-details-r">
                                                          <p className="flight-details-b">
                                                            ₹{" "}
                                                            {
                                                              response.prices
                                                                .TotalPrice
                                                            }
                                                          </p>
                                                          <p className="flight-details-c mb-0">
                                                            ₹{" "}
                                                            {
                                                              response.prices
                                                                .BaseFare
                                                            }
                                                          </p>
                                                          <p className="flight-details-c mb-0">
                                                            ₹{" "}
                                                            {
                                                              response.prices
                                                                .Taxes
                                                            }
                                                          </p>
                                                          <p className="flight-details-c mb-0">
                                                            ₹ 00
                                                          </p>
                                                          <p className="flight-details-c mb-0">
                                                            ₹ 00
                                                          </p>
                                                        </div>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="px-4 flex flex-col items-center">
                        <div className="Searchresult text-center">
                          <div className="pl-7 ml-7">
                            <img
                              src="/img/FlightNotFound.png"
                              alt="Flight Not Found"
                              className="w-4/5 mb-2"
                            />
                          </div>
                          <p className="font-semibold text-gray-700">
                            These search return flights are not available.
                            Please modify your search.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="clear" />
            </div>
          </div>
        </div>
      )}
      {(selectedFlightoption.length > 0 ||
        selectedReturnFlightoption.length > 0) && (
        <div>
          {isMinimized ? (
            <div className="minimized-ball" onClick={handleExpand}>
              ⚪
              <span className="tooltip-text">
                Click to see selected flights
              </span>
            </div>
          ) : (
            <div className="selected-flight-container">
              <div className="selected-flight-header">
                <span>SELECTED FLIGHTS</span>
                <button className="close-btn mr-2" onClick={handleClose}>
                  -
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto">
                {/*  Onward Flights */}
                {selectedFlightoption.length > 0 && (
                  <div className="mb-3 border-b pb-2">
                    <h4 className="font-semibold text-[12px] mb-2">
                      Onward Flights
                    </h4>

                    {Object.entries(groupedFlights).map(([flightId, data]) => {
                      // Get flight info from stored flightData
                      const flightInfo = data.flightData;
                      const segments = flightInfo?.segments || [];

                      const firstSegment = segments[0];
                      const lastSegment = segments[segments.length - 1];

                      const depTime = firstSegment?.Origin?.DepTime;
                      const arrTime = lastSegment?.Destination?.ArrTime;

                      const Airline = flightInfo?.segments?.[0]?.Airline;
                      // const Origin = flightInfo?.segments?.[0]?.Origin;
                      // const Destination =
                      // flightInfo?.segments?.[0]?.Destination;

                      return (
                        <div
                          key={flightId} // Use flightId as key
                          className="selected-flight-list"
                        >
                          <div className="flight-item p-1 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={Airline?.AirlineLogo}
                                className="flight-logo w-8 h-8"
                              />
                              <div className="flight-detailss flex flex-col">
                                <span className="text-[11px] font-bold">
                                  {Airline?.AirlineName}{" "}
                                  {segments.map((seg, idx) => (
                                    <span key={idx}>
                                      {idx > 0 && ", "}
                                      {seg.Airline?.FlightNumber}
                                    </span>
                                  ))}
                                </span>
                                <span className=" text-[11px] text-gray-600">
                                  {new Date(depTime).toLocaleTimeString(
                                    "en-US",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    },
                                  )}{" "}
                                  -{" "}
                                  {new Date(arrTime).toLocaleTimeString(
                                    "en-US",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    },
                                  )}
                                </span>
                              </div>
                            </div>

                            {/*  Fares */}
                            <div className="flight-price">
                              {data.fares.map((fare, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-end items-center mb-1 mt-1 gap-0"
                                >
                                  <div className="flex flex-col items-end mr-2">
                                    <span className="text-[10px] font-bold">
                                      ₹ {fare?.price}
                                    </span>
                                    <span className="text-[9px] text-gray-500">
                                      {fare?.type}
                                    </span>
                                  </div>
                                  <button
                                    className="remove-btn text-red-500 text-lg"
                                    onClick={() =>
                                      handleRemoveFare(flightId, fare.type)
                                    }
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/*  Return Flights */}
                {selectedReturnFlightoption.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-[12px] mb-2">
                      Return Flights
                    </h4>
                    {Object.entries(groupedReturnFlights).map(
                      ([flightId, data]) => {
                        // Use flightId here
                        const flightInfo = data.flightData;
                        const segments = flightInfo?.segments || [];

                        const firstSegment = segments[0];
                        const lastSegment = segments[segments.length - 1];

                        const depTime = firstSegment?.Origin?.DepTime;
                        const arrTime = lastSegment?.Destination?.ArrTime;

                        const Airline = flightInfo?.segments?.[0]?.Airline;
                        // const Origin = flightInfo?.segments?.[0]?.Origin;
                        // const Destination =
                        //   flightInfo?.segments?.[0]?.Destination;

                        return (
                          <div
                            key={flightId} // Use flightId as key
                            className="selected-flight-list"
                          >
                            <div className="flight-item p-1 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <img
                                  src={Airline?.AirlineLogo}
                                  className="flight-logo w-8 h-8"
                                />
                                <div className="flight-detailss flex flex-col">
                                  <span className="text-[11px] font-bold">
                                    {Airline?.AirlineName}{" "}
                                    {segments.map((seg, idx) => (
                                      <span key={idx}>
                                        {idx > 0 && ", "}
                                        {seg.Airline?.FlightNumber}
                                      </span>
                                    ))}
                                  </span>
                                  <span className="text-[11px] text-gray-600">
                                    {new Date(depTime).toLocaleTimeString(
                                      "en-US",
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      },
                                    )}{" "}
                                    -{" "}
                                    {new Date(arrTime).toLocaleTimeString(
                                      "en-US",
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      },
                                    )}
                                  </span>
                                </div>
                              </div>

                              {/* Fares */}
                              <div className="flight-price">
                                {data.fares.map((fare, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-end items-center mb-1 mt-1 gap-0"
                                  >
                                    <div className="flex flex-col items-end mr-2">
                                      <span className="text-[10px] font-bold">
                                        ₹ {fare?.price}
                                      </span>
                                      <span className="text-[9px] text-gray-500">
                                        {fare?.type}
                                      </span>
                                    </div>
                                    <button
                                      className="remove-btn text-red-500 text-lg"
                                      onClick={() =>
                                        handleRemoveFare(flightId, fare.type)
                                      }
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                )}
              </div>

              {/*Share Button */}
              <div className="share-button-container mt-3 text-center">
                <button className="share-btn" onClick={Shareflight}>
                  Share Flight Options
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {flightbookingopen && journeytype == "2" && (
        <div className="selected-flight-book-container">
          <div className="max-h-22 overflow-y-auto">
            <div className="Selectedflight-booking">
              {selectedFareforbooking.Onward &&
              Object.keys(selectedFareforbooking.Onward).length > 0 ? (
                <div className="Onward-flight">
                  <div className="Flight-book-data">
                    <div className="Flight-heading-line">
                      Departure .{" "}
                      {
                        selectedFareforbooking.Onward.flight.segments[0].Airline
                          .AirlineName
                      }{" "}
                      {selectedFareforbooking.Onward.flight.segments.map(
                        (seg, idx) => (
                          <span key={idx}>
                            {idx > 0 && ", "}
                            {seg.Airline?.FlightNumber}
                          </span>
                        ),
                      )}
                    </div>
                    <div className="Fligth-detail-line">
                      <div className="flight-container">
                        <div className="Flightlogo">
                          <img
                            src={
                              selectedFareforbooking.Onward.flight.segments[0]
                                .Airline.AirlineLogo
                            }
                            className="Logo-class"
                          />
                        </div>
                        <div className="Booking-details">
                          <div className="Origin-flight">
                            <div className="text-[12px] font-bold">
                              {format(
                                new Date(
                                  selectedFareforbooking.Onward.flight.depTime,
                                ),
                                "HH:mm",
                              )}
                            </div>
                            <div className="text-[10px]">
                              {
                                selectedFareforbooking.Onward.flight
                                  .originAirport.CityName
                              }{" "}
                            </div>
                            <div className="airportname">
                              {
                                selectedFareforbooking.Onward?.flight
                                  ?.originAirport?.AirportName
                              }{" "}
                              {
                                selectedFareforbooking.Onward?.flight
                                  ?.originAirport?.Terminal
                              }
                            </div>
                          </div>
                          <div className="arrowtowards">
                            <ArrowForwardSharp style={{ width: "20px" }} />
                          </div>
                          <div className="Destination-flight">
                            <div className="text-[12px] font-bold">
                              {format(
                                new Date(
                                  selectedFareforbooking.Onward.flight.arrTime,
                                ),
                                "HH:mm",
                              )}
                            </div>
                            <div className="text-[10px]">
                              {
                                selectedFareforbooking.Onward.flight
                                  .destinationAirport.CityName
                              }{" "}
                            </div>
                            <div className="airportname">
                              {
                                selectedFareforbooking.Onward?.flight
                                  ?.destinationAirport?.AirportName
                              }{" "}
                              {
                                selectedFareforbooking.Onward?.flight
                                  ?.destinationAirport?.Terminal
                              }
                            </div>
                          </div>
                        </div>
                        <div className="Flightbook-price">
                          <span className="text-[12px] font-bold">
                            ₹ {selectedFareforbooking.Onward.fare.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="Onward-flight">
                  <div className="text-white-500 p-4">
                    Onward flight not selected
                  </div>
                </div>
              )}

              {selectedFareforbooking.Return &&
              Object.keys(selectedFareforbooking.Return).length > 0 ? (
                <div className="Return-flight">
                  <div className="Flight-book-data">
                    <div className="Flight-heading-line">
                      Return .{" "}
                      {
                        selectedFareforbooking.Return.flight.segments[0].Airline
                          .AirlineName
                      }{" "}
                      {selectedFareforbooking.Return.flight.segments.map(
                        (seg, idx) => (
                          <span key={idx}>
                            {idx > 0 && ", "}
                            {seg.Airline?.FlightNumber}
                          </span>
                        ),
                      )}
                    </div>
                    <div className="Fligth-detail-line">
                      <div className="flight-container">
                        <div className="Flightlogo">
                          <img
                            src={
                              selectedFareforbooking.Return.flight.segments[0]
                                .Airline.AirlineLogo
                            }
                            className="Logo-class"
                          />
                        </div>
                        <div className="Booking-details">
                          <div className="Origin-flight">
                            <div className="text-[12px] font-bold">
                              {format(
                                new Date(
                                  selectedFareforbooking.Return.flight.depTime,
                                ),
                                "HH:mm",
                              )}
                            </div>
                            <div className="text-[10px]">
                              {
                                selectedFareforbooking.Return.flight
                                  .originAirport.CityName
                              }{" "}
                            </div>
                            <div className="airportname">
                              {
                                selectedFareforbooking.Return?.flight
                                  ?.originAirport?.AirportName
                              }{" "}
                              {
                                selectedFareforbooking.Return?.flight
                                  ?.originAirport?.Terminal
                              }
                            </div>
                          </div>
                          <div className="arrowtowards">
                            <ArrowForwardSharp style={{ width: "100%" }} />
                          </div>
                          <div className="Destination-flight">
                            <div className="text-[12px] font-bold">
                              {format(
                                new Date(
                                  selectedFareforbooking.Return.flight.arrTime,
                                ),
                                "HH:mm",
                              )}
                            </div>
                            <div className="text-[10px]">
                              {
                                selectedFareforbooking.Return.flight
                                  .destinationAirport.CityName
                              }{" "}
                            </div>
                            <div className="airportname">
                              {
                                selectedFareforbooking.Return?.flight
                                  ?.destinationAirport?.AirportName
                              }{" "}
                              {
                                selectedFareforbooking.Return?.flight
                                  ?.destinationAirport?.Terminal
                              }
                            </div>
                          </div>
                        </div>
                        <div className="Flightbook-price">
                          <span className="text-[12px] font-bold">
                            ₹ {selectedFareforbooking.Return.fare.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="Return-flight">
                  <div className="text-white-500 p-4">
                    Return flight not selected
                  </div>
                </div>
              )}
              <div className="flight-process">
                <div className="flight-price">
                  {selectedFareforbooking.Return &&
                    Object.keys(selectedFareforbooking.Return).length > 0 &&
                    selectedFareforbooking.Onward &&
                    Object.keys(selectedFareforbooking.Onward).length > 0 && (
                      <div className="text-sm font-bold mr-3">
                        ₹
                        {(selectedFareforbooking.Onward.fare.price || 0) +
                          (selectedFareforbooking.Return.fare.price || 0)}
                        <br />
                        Per Adult
                      </div>
                    )}
                </div>
                <div className="share-button-container Flight-Booking">
                  {/* <button
                    type="button"
                    className="share-btn"
                    onClick={() =>
                      NavigateToReturnBookingPage(
                        selectedFareforbooking,
                        cabinClass,
                        inputValue
                      )
                    }
                  >
                    Book
                  </button> */}
                  <button
                    type="button"
                    className="share-btn"
                    disabled={isBookDisabled}
                    onClick={(e) => {
                      if (isBookDisabled) {
                        e.preventDefault();
                        return;
                      }
                      setBookingPayload({
                        isRoundTrip: true,
                        onwardFare: selectedFareforbooking.Onward.fare,
                        onwardFlight: selectedFareforbooking.Onward.flight,
                        onwardSegments:
                          selectedFareforbooking?.Onward.flight.segments,
                        onwardFlightId:
                          selectedFareforbooking?.Onward?.flightId,
                        returnFare: selectedFareforbooking.Return?.fare,
                        returnFlight: selectedFareforbooking.Return?.flight,
                        returnSegments:
                          selectedFareforbooking?.Return?.flight?.segments,
                        returnFlightId:
                          selectedFareforbooking?.Return?.flightId,
                        cabinClass: cabinClass,
                        inputValue: inputValue,
                        totalPrice:
                          (selectedFareforbooking.Onward.fare.price || 0) +
                          (selectedFareforbooking.Return?.fare?.price || 0),
                      });
                      console.log("Booking payload set for round trip:", {
                        onwardFlightId:
                          selectedFareforbooking?.Onward?.flightId,
                        returnFlightId:
                          selectedFareforbooking?.Return?.flightId,
                        onwardFareType:
                          selectedFareforbooking.Onward?.fare?.type,
                        returnFareType:
                          selectedFareforbooking.Return?.fare?.type,
                      });

                      setIsModalOpen2(true);
                    }}
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showPolicyPopup && selectedFarePolicy && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="relative z-20 shrink-0 bg-gradient-to-r from-[#0c1a2e] to-[#1e3a5f] px-3 py-2 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-white font-semibold text-sm">
                    Fare Rules
                    {/* {selectedFarePolicy.source === "Uapi" && selectedFarePolicy.type === "predefined" && " (Predefined)"} */}
                  </h2>
                  <p className="text-white/90 text-xs">
                    <span className="font-medium">
                      {selectedFarePolicy.originCity || "N/A"}
                    </span>
                    {selectedFarePolicy.originCode &&
                      ` (${selectedFarePolicy.originCode})`}
                    <span className="mx-2">→</span>
                    <span className="font-medium">
                      {selectedFarePolicy.destinationCity || "N/A"}
                    </span>
                    {selectedFarePolicy.destinationCode &&
                      ` (${selectedFarePolicy.destinationCode})`}{" "}
                    |{" "}
                    <span className="font-medium">
                      {selectedFarePolicy.airlineName || "N/A"}
                    </span>{" "}
                    |{" "}
                    <span className="font-medium">
                      {selectedFarePolicy.fareType || "N/A"}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPolicyPopup(false)}
                className="w-8 h-8 cursor-pointer bg-white/10 hover:bg-white/20 rounded-lg text-slate-300 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-0">
              {/* CASE 1: UAPI Predefined Policy (from getCancellationDateChangePolicy) */}
              {selectedFarePolicy.source === "Uapi" &&
                selectedFarePolicy.type === "predefined" && (
                  <div className="space-y-4">
                    {/* Fare Type Header */}
                    <div className="border rounded-xl overflow-hidden border-slate-200">
                      <div className="bg-blue-50 px-4 py-2 border-t-4 border-blue-500">
                        <span className="text-xs font-semibold text-slate-800">
                          {selectedFarePolicy.data?.onward?.fareTypeFound ||
                            "Fare Policy"}
                        </span>
                      </div>

                      {/* Cancellation Policy */}
                      {selectedFarePolicy.data?.onward?.cancellation && (
                        <div className="px-4 py-3 border-t">
                          <span className="text-[10px] uppercase text-slate-400 font-semibold">
                            Cancellation Policy
                          </span>
                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-600">
                                Charges:
                              </span>
                              <span className="text-sm font-semibold text-red-600">
                                {
                                  selectedFarePolicy.data.onward.cancellation
                                    .charges
                                }
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-600">
                                Fee:
                              </span>
                              <span className="text-sm text-slate-700">
                                {
                                  selectedFarePolicy.data.onward.cancellation
                                    .fee
                                }
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              {
                                selectedFarePolicy.data.onward.cancellation
                                  .timeframe
                              }
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Date Change Policy */}
                      {selectedFarePolicy.data?.onward?.dateChange && (
                        <div className="px-4 py-3 border-t">
                          <span className="text-[10px] uppercase text-slate-400 font-semibold">
                            Date Change Policy
                          </span>
                          <div className="mt-2 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-600">
                                Charges:
                              </span>
                              <span className="text-sm font-semibold text-green-600">
                                {
                                  selectedFarePolicy.data.onward.dateChange
                                    .charges
                                }
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-slate-600">
                                Fee:
                              </span>
                              <span className="text-sm text-slate-700">
                                {selectedFarePolicy.data.onward.dateChange.fee}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              {
                                selectedFarePolicy.data.onward.dateChange
                                  .timeframe
                              }
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* CASE 2: UAPI API Response (from cancellationsPolicies) */}
              {selectedFarePolicy.source === "Uapi" &&
                selectedFarePolicy.type === "api" && (
                  <div className="border rounded-xl overflow-hidden border-slate-200">
                    <div className="bg-purple-50 px-4 py-2 border-t-4 border-purple-500">
                      <span className="text-xs font-semibold text-slate-800">
                        {selectedFarePolicy.data?.onward?.fareTypeFound ||
                          "Fare Policy"}
                      </span>
                    </div>

                    {selectedFarePolicy.data?.onward?.cancellation && (
                      <div className="px-4 py-3 border-t">
                        <span className="text-[10px] uppercase text-slate-400 font-semibold">
                          Cancellation Policy
                        </span>
                        <div className="text-xs text-slate-700 mt-1">
                          {selectedFarePolicy.data.onward.cancellation}
                        </div>
                      </div>
                    )}

                    {selectedFarePolicy.data?.onward?.reissue && (
                      <div className="px-4 py-3 border-t">
                        <span className="text-[10px] uppercase text-slate-400 font-semibold">
                          Date Change Policy
                        </span>
                        <div className="text-xs text-slate-700 mt-1">
                          {selectedFarePolicy.data.onward.reissue}
                        </div>
                      </div>
                    )}

                    {selectedFarePolicy.data?.onward?.["No-show"] && (
                      <div className="px-4 py-3 border-t">
                        <span className="text-[10px] uppercase text-slate-400 font-semibold">
                          No-show Policy
                        </span>
                        <div className="text-xs text-slate-700 mt-1">
                          {selectedFarePolicy.data.onward["No-show"]}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              {/* CASE 3: TBO API Response */}
              {selectedFarePolicy.source === "Tbo" && (
                <>
                  {/* Cancellation Section */}
                  {selectedFarePolicy.data?.onward?.MiniFareRules?.[0]?.filter(
                    (r) => r.Type === "Cancellation",
                  ).length > 0 && (
                    <div className="border rounded-xl overflow-hidden border-slate-200">
                      <div className="bg-orange-50 px-4 py-2 flex justify-between items-center border-t-4 border-orange-500">
                        <span className="text-xs font-semibold text-slate-800">
                          Cancellation
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Per passenger
                        </span>
                      </div>

                      {selectedFarePolicy.data?.onward?.MiniFareRules[0]
                        .filter((r) => r.Type === "Cancellation")
                        .map((rule, i) => {
                          const text =
                            rule.To === ""
                              ? `Cancellation before ${rule.From} ${rule.Unit?.toLowerCase() || "hours"} of departure`
                              : `Cancellation between ${rule.From} to ${rule.To} ${rule.Unit?.toLowerCase() || "hours"} of departure`;

                          const amount =
                            rule.Details?.replace("INR ", "") || rule.Details;

                          return (
                            <div
                              key={i}
                              className="flex justify-between items-center px-3 py-2 border-t"
                            >
                              <div>
                                <span className="text-[10px] uppercase text-slate-400 font-semibold">
                                  Time before departure
                                </span>
                                <div className="text-xs text-slate-700 font-medium">
                                  {text}
                                </div>
                              </div>

                              {amount === "0" ? (
                                <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full border border-green-200">
                                  FREE
                                </span>
                              ) : (
                                <span className="font-semibold text-red-600">
                                  ₹ {amount}
                                </span>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {/* Reschedule Section */}
                  {selectedFarePolicy.data?.onward?.MiniFareRules?.[0]?.filter(
                    (r) => r.Type === "Reissue",
                  ).length > 0 && (
                    <div className="border rounded-xl overflow-hidden border-slate-200">
                      <div className="bg-green-50 px-4 py-2 flex justify-between items-center border-t-4 border-green-500">
                        <span className="text-xs font-semibold text-slate-800">
                          Reschedule
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Per passenger
                        </span>
                      </div>

                      {selectedFarePolicy.data?.onward?.MiniFareRules[0]
                        .filter((r) => r.Type === "Reissue")
                        .map((rule, i) => {
                          const text =
                            rule.To === ""
                              ? `Reschedule before ${rule.From} ${rule.Unit?.toLowerCase() || "hours"} of departure`
                              : `Reschedule between ${rule.From}-${rule.To} ${rule.Unit?.toLowerCase() || "hours"} of departure`;

                          const amount =
                            rule.Details?.replace("INR ", "") || rule.Details;

                          return (
                            <div
                              key={i}
                              className="flex justify-between items-center px-3 py-2 border-t"
                            >
                              <div>
                                <span className="text-[10px] uppercase text-slate-400 font-semibold">
                                  Time before departure
                                </span>
                                <div className="text-xs text-slate-700 font-medium">
                                  {text}
                                </div>
                              </div>

                              {amount === "0" ? (
                                <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full border border-green-200">
                                  FREE
                                </span>
                              ) : (
                                <span className="font-semibold text-green-600">
                                  ₹ {amount}
                                </span>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </>
              )}

              {/* Terms and Conditions for all types (if available) */}
              {selectedFarePolicy.data?.onward?.FareRules?.[0]
                ?.FareRuleDetail && (
                <div className="bg-slate-50 border rounded-xl p-4 text-[11px] text-slate-500 leading-relaxed">
                  {/* <div className="text-xs font-semibold text-slate-700 mb-2">Terms & Conditions</div> */}
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        selectedFarePolicy.data.onward.FareRules[0]
                          .FareRuleDetail,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <Modal
        show={isModalOpen2}
        onHide={() => {
          setIsModalOpen2(false);
          setClientPriceOnward("");
          setClientPriceReturn("");
          setPriceErrorOnward("");
          setPriceErrorReturn("");
        }}
        aria-labelledby="modal-title"
        size="lg"
        centered
      >
        <Modal.Header className="custom-modal-header">
          <Modal.Title
            id="modal-title"
            className="text-lg font-bold text-gray-800"
          >
            Client Final Price
            {bookingPayload?.isRoundTrip && bookingPayload?.returnFlight
              ? " - Round Trip"
              : bookingPayload?.isRoundTrip
                ? " - Departure"
                : ""}
          </Modal.Title>
          <button
            className="text-gray-400 hover:text-gray-600 text-3xl"
            onClick={() => {
              setIsModalOpen2(false);
              setClientPriceOnward("");
              setClientPriceReturn("");
              setPriceErrorOnward("");
              setPriceErrorReturn("");
            }}
          >
            ×
          </button>
        </Modal.Header>

        <Modal.Body className="py-4">
          {/* Selected Flight Information */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              {bookingPayload?.isRoundTrip && bookingPayload?.returnFlight
                ? "Selected Flights"
                : "Selected Flight"}
            </h3>

            {/* Onward/Departure Flight - ALWAYS SHOW */}
            {bookingPayload?.onwardFlight && (
              <div className="mb-4">
                {bookingPayload?.isRoundTrip && (
                  <div className="text-xs font-semibold text-gray-600 mb-2">
                    {bookingPayload?.returnFlight
                      ? "Departure Flight"
                      : "Selected Flight"}
                  </div>
                )}

                <div className="border rounded-lg p-4 bg-white mb-3">
                  <div className="text-xs bg-[#785ef7] bg-opacity-10 text-[#785ef7] px-2 py-1  font-medium w-25 mb-2">
                    {bookingPayload.onwardFlight.depTime
                      ? format(
                          new Date(bookingPayload.onwardFlight.depTime),
                          "EEE, dd MMM yyyy",
                        )
                      : ""}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    {/* Airline */}
                    <div className="flex items-center gap-3 w-[20%]">
                      {bookingPayload.onwardFlight.segments?.[0]?.Airline
                        ?.AirlineLogo && (
                        <img
                          src={
                            bookingPayload.onwardFlight.segments[0].Airline
                              .AirlineLogo
                          }
                          alt="Airline"
                          className="w-8 h-8 object-contain"
                        />
                      )}
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          {bookingPayload.onwardFlight.segments?.[0]?.Airline
                            ?.AirlineName || "Flight"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {bookingPayload.onwardFlight.segments
                            ?.map(
                              (segment) =>
                                `${segment.Airline.AirlineCode} ${segment.Airline.FlightNumber}`,
                            )
                            .join(" , ")}
                        </div>
                      </div>
                    </div>

                    {/* Departure */}
                    <div className="text-center w-[15%]">
                      <div className="text-sm font-bold">
                        {bookingPayload.onwardFlight.depTime
                          ? format(
                              new Date(bookingPayload.onwardFlight.depTime),
                              "HH:mm",
                            )
                          : "--:--"}
                      </div>
                      <div className="text-md text-gray-700">
                        {bookingPayload.onwardFlight.originAirport?.CityName ||
                          "Origin"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {bookingPayload.onwardFlight.originAirport
                          ?.AirportName || ""}
                        {bookingPayload.onwardFlight.originAirport?.Terminal &&
                          ` (T${bookingPayload.onwardFlight.originAirport.Terminal})`}
                      </div>
                    </div>

                    {/* Duration + line */}
                    <div className="flex flex-col items-center w-[30%]">
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        {calculateDurationFlight(bookingPayload.onwardSegments)}
                      </div>
                      <div className="flex items-center w-full flight-line-d2 mt-0 mr-0 "></div>
                      <div className="text-xs text-[#785ef7] mt-1">
                        {bookingPayload.onwardSegments?.length === 1 ? (
                          <p className="cursor-pointer leading-tight">
                            Non-stop
                          </p>
                        ) : (
                          <p className="cursor-pointer leading-tight">
                            {bookingPayload.onwardSegments?.length - 1 || 0}{" "}
                            stop
                            {bookingPayload.onwardSegments?.length - 1 > 1
                              ? "s"
                              : ""}{" "}
                            via{" "}
                            {bookingPayload.onwardSegments?.[0]?.Destination
                              ?.Airport?.CityName || "City"}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Arrival */}
                    <div className="text-center w-[15%]">
                      <div className="text-sm font-bold">
                        {bookingPayload.onwardFlight.arrTime
                          ? format(
                              new Date(bookingPayload.onwardFlight.arrTime),
                              "HH:mm",
                            )
                          : "--:--"}
                      </div>
                      <div className="text-md text-gray-700">
                        {bookingPayload.onwardFlight.destinationAirport
                          ?.CityName || "Destination"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {bookingPayload.onwardFlight.destinationAirport
                          ?.AirportName || ""}
                        {bookingPayload.onwardFlight.destinationAirport
                          ?.Terminal &&
                          ` (T${bookingPayload.onwardFlight.destinationAirport.Terminal})`}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right w-[20%]">
                      <div className="text-sm font-bold text-[#785ef7]">
                        ₹{bookingPayload.onwardFare?.price || 0}
                      </div>
                      <div className="text-xs text-gray-500">
                        {bookingPayload.onwardFare?.from || "Supplier"}
                      </div>
                    </div>
                  </div>

                  {/* Client Price Input for Onward Flight - INSIDE THE BOX */}

                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="w-2/3">
                        <div className="flex items-center mb-3">
                          <div className="text-sm font-semibold text-gray-700 mr-3">
                            Client Price (Per Passenger)
                            <button
                              className="fare-mini-policy inline-flex items-center justify-center ml-1"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();

                                const flightId =
                                  bookingPayload.flightId ||
                                  bookingPayload.onwardFlightId;

                                handleShowPolicy(
                                  bookingPayload.onwardFlight,
                                  bookingPayload.onwardFare,
                                  flightId,
                                  bookingPayload.onwardFare?.base_fare,
                                );
                              }}
                              title="View Cancellation & Date Change Policy"
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={`mini-policy-icon ${selectedFarePolicy ? "mini-policy-active" : ""}`}
                              >
                                <path
                                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M12 16V12"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M12 8H12.01"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            Min: ₹{bookingPayload.onwardFare?.price || 0}
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
                            <span className="text-gray-700 font-bold"></span>
                          </div>
                          <input
                            type="number"
                            value={ClientPriceOnward}
                            onChange={(e) => {
                              const value = e.target.value;
                              setClientPriceOnward(value);
                              const minPrice =
                                bookingPayload.onwardFare?.price || 0;
                              if (value && Number(value) < minPrice) {
                                setPriceErrorOnward(
                                  `Must be at least ₹${minPrice}`,
                                );
                              } else {
                                setPriceErrorOnward("");
                              }
                            }}
                            placeholder="Enter price..."
                            className={`pl-4 w-full p-2 border-2 rounded-lg text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#785ef7] focus:border-[#785ef7] transition-all duration-200 ${
                              priceErrorOnward
                                ? "border-red-500 bg-red-50 text-red-700"
                                : ClientPriceOnward &&
                                    !priceErrorOnward &&
                                    Number(ClientPriceOnward) >=
                                      (bookingPayload.onwardFare?.price || 0)
                                  ? "border-green-500 bg-green-50 text-green-700"
                                  : "border-gray-300 bg-white text-gray-800 hover:border-gray-400"
                            }`}
                            min={bookingPayload.onwardFare?.price || 0}
                          />

                          {ClientPriceOnward &&
                            !priceErrorOnward &&
                            Number(ClientPriceOnward) >=
                              (bookingPayload.onwardFare?.price || 0) && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="flex items-center text-green-600 text-sm">
                                  <svg
                                    className="w-5 h-5 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="font-medium">Valid</span>
                                </div>
                              </div>
                            )}
                        </div>

                        {priceErrorOnward && (
                          <div className="mt-2 flex items-center text-red-600 text-sm font-medium">
                            <svg
                              className="w-4 h-4 mr-2 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {priceErrorOnward}
                          </div>
                        )}
                      </div>

                      <div className="w-1/3 pl-4 text-right">
                        <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                          Fare Details
                        </div>
                        <div className="text-sm font-bold text-[#785ef7] mb-1">
                          {bookingPayload.onwardFare?.type || "Standard"} Fare
                        </div>
                        <div className="text-md font-bold text-gray-800">
                          ₹{bookingPayload.onwardFare?.price || 0}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Supplier: {bookingPayload.onwardFare?.from || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Return Flight - Only show if exists */}
            {bookingPayload?.isRoundTrip && bookingPayload?.returnFlight && (
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-600 mb-2">
                  Return Flight
                </div>
                <div className="border rounded-lg p-4 bg-white">
                  <div className="text-xs bg-[#785ef7] bg-opacity-10 text-[#785ef7] px-2 py-1  font-medium w-25 mb-2">
                    {bookingPayload.returnFlight.depTime
                      ? format(
                          new Date(bookingPayload.returnFlight.depTime),
                          "EEE, dd MMM yyyy",
                        )
                      : ""}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    {/* Airline */}
                    <div className="flex items-center gap-3 w-[20%]">
                      {bookingPayload.returnFlight.segments?.[0]?.Airline
                        ?.AirlineLogo && (
                        <img
                          src={
                            bookingPayload.returnFlight.segments[0].Airline
                              .AirlineLogo
                          }
                          alt="Airline"
                          className="w-8 h-8 object-contain"
                        />
                      )}
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          {bookingPayload.returnFlight.segments?.[0]?.Airline
                            ?.AirlineName || "Flight"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {bookingPayload.returnFlight.segments
                            ?.map(
                              (segment) =>
                                `${segment.Airline.AirlineCode} ${segment.Airline.FlightNumber}`,
                            )
                            .join(" , ")}
                        </div>
                      </div>
                    </div>

                    {/* Departure */}
                    <div className="text-center w-[15%]">
                      <div className="text-sm font-bold">
                        {bookingPayload.returnFlight.depTime
                          ? format(
                              new Date(bookingPayload.returnFlight.depTime),
                              "HH:mm",
                            )
                          : "--:--"}
                      </div>
                      <div className="text-md text-gray-700">
                        {bookingPayload.returnFlight.originAirport?.CityName ||
                          "Origin"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {bookingPayload.returnFlight.originAirport
                          ?.AirportName || ""}
                        {bookingPayload.returnFlight.originAirport?.Terminal &&
                          ` (T${bookingPayload.returnFlight.originAirport.Terminal})`}
                      </div>
                    </div>

                    {/* Duration + line */}
                    <div className="flex flex-col items-center w-[30%]">
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        {calculateDurationFlight(bookingPayload.returnSegments)}
                      </div>
                      <div className="flex items-center w-full flight-line-d2 mt-0 mr-0 "></div>
                      <div className="text-xs text-[#785ef7] mt-1">
                        {bookingPayload.returnSegments?.length === 1
                          ? "Non-stop"
                          : bookingPayload.returnSegments?.length > 1
                            ? "Connecting"
                            : "Direct"}
                      </div>
                    </div>

                    {/* Arrival */}
                    <div className="text-center w-[15%]">
                      <div className="text-sm font-bold">
                        {bookingPayload.returnFlight.arrTime
                          ? format(
                              new Date(bookingPayload.returnFlight.arrTime),
                              "HH:mm",
                            )
                          : "--:--"}
                      </div>
                      <div className="text-md text-gray-700">
                        {bookingPayload.returnFlight.destinationAirport
                          ?.CityName || "Destination"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {bookingPayload.returnFlight.destinationAirport
                          ?.AirportName || ""}
                        {bookingPayload.returnFlight.destinationAirport
                          ?.Terminal &&
                          ` (T${bookingPayload.returnFlight.destinationAirport.Terminal})`}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right w-[20%]">
                      <div className="text-sm font-bold text-[#785ef7]">
                        ₹{bookingPayload.returnFare?.price || 0}
                      </div>
                      <div className="text-xs text-gray-500">
                        {bookingPayload.returnFare?.from || "Supplier"}
                      </div>
                    </div>
                  </div>

                  {/* Client Price Input for Return Flight - SIMPLIFIED */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="w-2/3">
                        <div className="flex items-center mb-3">
                          <div className="text-sm font-semibold text-gray-700 mr-3">
                            Client Price (Per Passenger){" "}
                            <button
                              className="fare-mini-policy inline-flex items-center justify-center ml-1"
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();

                                const flightId =
                                  // bookingPayload.flightId ||
                                  bookingPayload.returnFlightId;

                                handleShowPolicy(
                                  bookingPayload.reeturnFlight,
                                  bookingPayload.returnFare,
                                  flightId,
                                  bookingPayload.returnFare?.base_fare,
                                );
                              }}
                              title="View Cancellation & Date Change Policy"
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={`mini-policy-icon ${selectedFarePolicy ? "mini-policy-active" : ""}`}
                              >
                                <path
                                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M12 16V12"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M12 8H12.01"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>

                          <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            Min: ₹{bookingPayload.returnFare?.price || 0}
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                            <span className="text-gray-700 font-bold"></span>
                          </div>
                          <input
                            type="number"
                            value={ClientPriceReturn}
                            onChange={(e) => {
                              const value = e.target.value;
                              setClientPriceReturn(value);
                              const minPrice =
                                bookingPayload.returnFare?.price || 0;
                              if (value && Number(value) < minPrice) {
                                setPriceErrorReturn(
                                  `Must be at least ₹${minPrice}`,
                                );
                              } else {
                                setPriceErrorReturn("");
                              }
                            }}
                            placeholder="Enter price..."
                            className={`pl-3 w-full p-2 border-2 rounded-lg text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#785ef7] focus:border-[#785ef7] transition-all duration-200 ${
                              priceErrorReturn
                                ? "border-red-500 bg-red-50 text-red-700"
                                : ClientPriceReturn &&
                                    !priceErrorReturn &&
                                    Number(ClientPriceReturn) >=
                                      (bookingPayload.returnFare?.price || 0)
                                  ? "border-green-500 bg-green-50 text-green-700"
                                  : "border-gray-300 bg-white text-gray-800 hover:border-gray-400"
                            }`}
                            min={bookingPayload.returnFare?.price || 0}
                          />

                          {ClientPriceReturn &&
                            !priceErrorReturn &&
                            Number(ClientPriceReturn) >=
                              (bookingPayload.returnFare?.price || 0) && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="flex items-center text-green-600 text-sm">
                                  <svg
                                    className="w-5 h-5 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="font-medium">Valid</span>
                                </div>
                              </div>
                            )}
                        </div>

                        {priceErrorReturn && (
                          <div className="mt-2 flex items-center text-red-600 text-sm font-medium">
                            <svg
                              className="w-4 h-4 mr-2 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {priceErrorReturn}
                          </div>
                        )}
                      </div>

                      <div className="w-1/3 pl-4 text-right">
                        <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                          Fare Details
                        </div>
                        <div className="text-sm font-bold text-[#785ef7] mb-1">
                          {bookingPayload.returnFare?.type || "Standard"} Fare
                        </div>
                        <div className="text-md font-bold text-gray-800">
                          ₹{bookingPayload.returnFare?.price || 0}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Supplier: {bookingPayload.returnFare?.from || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Show message if round trip but no return flight selected */}
            {bookingPayload?.isRoundTrip && !bookingPayload?.returnFlight && (
              <div className="mb-4">
                <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="text-center text-gray-500 text-sm">
                    Return flight not selected yet. You can add it later.
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer className="border-t pt-4">
          <div className="flex justify-end space-x-3">
            <button
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              onClick={() => {
                setIsModalOpen2(false);
                setClientPriceOnward("");
                setClientPriceReturn("");
                setPriceErrorOnward("");
                setPriceErrorReturn("");
              }}
            >
              Cancel
            </button>
            <button
              className="px-5 py-2.5 text-sm font-medium text-white bg-[#785ef7] rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={() => {
                // Check if onward price is valid
                const onwardValid =
                  ClientPriceOnward &&
                  !priceErrorOnward &&
                  Number(ClientPriceOnward) >=
                    (bookingPayload.onwardFare?.price || 0);

                // Check if return price is valid (only if return flight exists)
                const returnValid =
                  !bookingPayload.returnFlight ||
                  (ClientPriceReturn &&
                    !priceErrorReturn &&
                    Number(ClientPriceReturn) >=
                      (bookingPayload.returnFare?.price || 0));

// Check which flightId is available and use that
let onwardPolicyKey;
if (bookingPayload.onwardFlightId) {
  onwardPolicyKey = `${bookingPayload.onwardFlightId}_${bookingPayload.onwardFare?.type}`;
} else if (bookingPayload.flightId) {
  onwardPolicyKey = `${bookingPayload.flightId}_${bookingPayload.onwardFare?.type}`;
} else {
  // console.error("No flightId available for policy lookup");
  onwardPolicyKey = null;
}


const onwardPolicyData = onwardPolicyKey ? cancellationPolicies[onwardPolicyKey] : undefined;
// console.log("Onward Policy Data:", onwardPolicyData);
      
      // Get policy data for return flight if exists
      const returnPolicyKey = bookingPayload.returnFlightId 
        ? `${bookingPayload.returnFlightId}_${bookingPayload.returnFare?.type}`
        : null;
      const returnPolicyData = returnPolicyKey ? cancellationPolicies[returnPolicyKey] : null;
                if (onwardValid && returnValid) {
                  if (bookingPayload?.isRoundTrip) {
                    // Handle round trip booking
                    NavigateToReturnBookingPage(
                      {
                        Onward: {
                          fare: bookingPayload.onwardFare,
                          flight: bookingPayload.onwardFlight,
                          clientPrice: Number(ClientPriceOnward),
                           cancellationPolicy: onwardPolicyData,
                        },
                        Return: bookingPayload.returnFlight
                          ? {
                              fare: bookingPayload.returnFare,
                              flight: bookingPayload.returnFlight,
                              clientPrice: Number(ClientPriceReturn),
                              cancellationPolicy: returnPolicyData,
                            }
                          : null,
                      },
                      bookingPayload.Cabinclass,
                      bookingPayload.inputValue,
                      Number(ClientPriceOnward) +
                        Number(ClientPriceReturn || 0),
                    );
                  } else {
                    // Handle one-way booking
                    NavigatetoBookingflow(
                      bookingPayload.fare,
                      bookingPayload.segments,
                      bookingPayload.Cabinclass,
                      bookingPayload.inputValue,
                      bookingPayload.FlightInfo,
                      Number(ClientPriceOnward),
                      onwardPolicyData,
                      
                    );
                  }
                  setIsModalOpen2(false);
                  setClientPriceOnward("");
                  setClientPriceReturn("");
                  setPriceErrorOnward("");
                  setPriceErrorReturn("");
                }
              }}
              disabled={
                !ClientPriceOnward ||
                priceErrorOnward ||
                Number(ClientPriceOnward) <
                  (bookingPayload.onwardFare?.price || 0) ||
                (bookingPayload.returnFlight &&
                  (!ClientPriceReturn ||
                    priceErrorReturn ||
                    Number(ClientPriceReturn) <
                      (bookingPayload.returnFare?.price || 0)))
              }
            >
              Continue to Booking
            </button>
          </div>
        </Modal.Footer>
      </Modal>
      <Modal
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
        aria-labelledby="modal-title"
      >
        <Modal.Header className="custom-modal-header">
          <Modal.Title id="modal-title">Share Flights with</Modal.Title>
          <button className="close-btn" onClick={() => setIsModalOpen(false)}>
            ×
          </button>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          <form>
            <div className="form-row">
              <div className="form-group">
                <label>Client Name</label>
                <input type="text" value={client_name} disabled />
              </div>
              <div className="form-group">
                <label>SPOC Name</label>
                <input type="text" value={spocname} disabled />
              </div>
            </div>
            {queryId == null ? (
              <div className="form-group">
                <label>Reference Number</label>
                <input type="text" value={reference_no} disabled />
              </div>
            ) : (
              <div className="form-group">
                <label>Flight Query Id</label>
                <input type="text" value={flight_query_id} disabled />
              </div>
            )}

            <div className="form-group">
              <label>Email To</label>
              <div className="chips-input-container">
                {spocEmails.map((email, index) => (
                  <div className="chip" key={index}>
                    <span>{email}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSpocEmails(spocEmails.filter((e) => e !== email))
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
                <input
                  type="email"
                  value={spocEmailInput || ""}
                  onChange={(e) => setSpocEmailInput(e.target.value)}
                  placeholder={
                    spocEmails.length === 0 ? "Add Email" : "Add Email"
                  }
                  onBlur={handleAddSpocEmailOnBlur} // Add email when input loses focus
                />
              </div>
            </div>

            {/* <div className="form-group">
              <label>Additional Email</label>
              <div className="chips-input-container">
                {additionalEmails
                  .filter((email) => typeof email === "string" && email.trim() !== "") // Filter undefined and empty emails
                  .map((email, index) => (
                    <div className="chip" key={index}>
                      <span>{email}</span>
                      <button type="button" style={{ color: 'red' }} onClick={() => handleRemoveEmail(email)}>×</button>
                    </div>
                  ))}
                <input
                  type="email"
                  value={additionalEmailInput || ""} // Ensure input is never undefined
                  onChange={(e) => setAdditionalEmailInput(e.target.value)}
                  placeholder={
                    additionalEmails.length === 0 && additionalEmailInput.trim() === ""
                      ? "Add email"
                      : "Add email"
                  } // Show placeholder only when no emails and input is empty
                  onBlur={handleAddEmailOnBlur} // Add email when input loses focus
                />
              </div>
            </div> */}

            <div className="form-group">
              <label>CC Email</label>
              <div className="chips-input-container">
                {[...new Set(ccEmails)]
                  .filter(
                    (email) => typeof email === "string" && email.trim() !== "",
                  )
                  .map((email, index) => (
                    <div className="chip" key={index}>
                      <span>{email}</span>
                      <button
                        type="button"
                        style={{ color: "red" }}
                        onClick={() => handleRemoveCCEmail(email)}
                      >
                        ×
                      </button>
                    </div>
                  ))}

                <input
                  type="email"
                  value={ccEmailInput || ""} // Ensure input is never undefined
                  onChange={(e) => setCCEmailInput(e.target.value)}
                  placeholder={
                    ccEmails.length === 0 && ccEmailInput.trim() === ""
                      ? "Add CC email"
                      : "Add CC email"
                  } // Show placeholder only when no emails and input is empty
                  onBlur={handleAddCCEmailOnBlur} // Add email when input loses focus
                />
              </div>
            </div>
            <div className="form-group">
              <label>Enter Markup For Per Person</label>
              <input
                type="number"
                value={markup}
                onChange={(e) => setMarkup(e.target.value)}
                placeholder="Enter markup"
              />
            </div>
            <div className="form-group">
              <label>Remark</label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              ></textarea>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="custom-modal-footer">
          <button className="send-button" onClick={Shareflight}>
            SEND
          </button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {fromCity} - {toCity} | {adult} Passenger
            {/* {is_return ? " (Round Trip)" : " (One Way)"} */}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <div className="alert alert-warning" style={{ marginBottom: "15px" }}>
            <div className="text-[12px]">
              <i className="fas fa-edit mr-2 "></i>
              <strong>Editing Instructions:</strong> Click on the
              yellow-highlighted prices to edit them.
            </div>
            <div style={{ marginTop: "5px", fontSize: "10px" }}>
              <strong>Note:</strong> Prices will auto-format with commas. Edit
              values and click outside to save.
            </div>
          </div> */}

          <div
            // ref={contentRef}
            // dangerouslySetInnerHTML={{ __html: htmlContent }}
            style={{
              minHeight: "400px",
              maxHeight: "500px",
              // border: "1px solid #ddd",
              padding: "8px",
              overflow: "auto",

              // backgroundColor: "#f9f9f9",
            }}
            className="space-y-2"
          >
            <form className="email-compose-form">
              <div className="email-field-row">
                {/* To Field */}
                <div className="email-field">
                  <span className="field-label">To</span>
                  <div className="chips-wrapper">
                    {spocEmails.map((email, index) => (
                      <div className="chip" key={index}>
                        <span>{email}</span>
                        <button
                          type="button"
                          className="chip-remove"
                          onClick={() =>
                            setSpocEmails(spocEmails.filter((e) => e !== email))
                          }
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <input
                      type="email"
                      value={spocEmailInput || ""}
                      onChange={(e) => setSpocEmailInput(e.target.value)}
                      onBlur={handleAddSpocEmailOnBlur}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          handleAddSpocEmailOnBlur();
                        }
                      }}
                      placeholder={
                        spocEmails.length === 0 ? "Enter email addresses" : ""
                      }
                      className="email-field-input"
                    />
                  </div>
                </div>

                {/* Cc Field */}
                <div className="email-field">
                  <span className="field-label">Cc</span>
                  <div className="chips-wrapper">
                    {[...new Set(ccEmails)]
                      .filter(
                        (email) =>
                          typeof email === "string" && email.trim() !== "",
                      )
                      .map((email, index) => (
                        <div className="chip" key={index}>
                          <span>{email}</span>
                          <button
                            type="button"
                            className="chip-remove"
                            onClick={() => handleRemoveCCEmail(email)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    <input
                      type="email"
                      value={ccEmailInput || ""}
                      onChange={(e) => setCCEmailInput(e.target.value)}
                      onBlur={handleAddCCEmailOnBlur}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          handleAddCCEmailOnBlur();
                        }
                      }}
                      placeholder={
                        ccEmails.length === 0 ? "Enter email addresses" : ""
                      }
                      className="email-field-input"
                    />
                  </div>
                </div>
                <div className="email-field">
                  <span className="field-label">
                    {reference_no} | Flight Options | {flightRouteInfo.fromCity}{" "}
                    ({flightRouteInfo.fromAirport}({flightRouteInfo.fromCode}))
                    - {flightRouteInfo.toCity} ({flightRouteInfo.toAirport} (
                    {flightRouteInfo.toCode}))
                  </span>
                </div>
              </div>
            </form>
            <div
              ref={contentRef}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            ></div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>

          <button
            className="px-5 py-2.5 text-sm font-medium text-white bg-[#785ef7] rounded-lg flex items-center justify-center gap-2"
            onClick={confirmAndCloseModal}
            disabled={isSubmitting}
            style={{
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? (
              <>
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid #fff",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Sending...
              </>
            ) : (
              "Confirm & Send Updates"
            )}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default FinalSearchFlight;
