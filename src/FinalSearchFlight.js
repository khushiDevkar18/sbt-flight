import React, { useEffect, useState, useRef } from "react";
import "./styles.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse, parseISO, isValid } from "date-fns";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Nav } from "react-bootstrap";
import CONFIG from "./config";
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
import useOnlineStatus from "./useOnlineStatus";
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
  const response = location.state.responseData;
  // console.log("response from taxivaxi", location.state.responseData);
  const isOnline = useOnlineStatus();
  const bookingid = location.state && location.state.responseData?.bookingid  ;
  const flight_query_id = location.state && location.state.responseData?.flight_query_id;
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
  const [fareloadingg, setfareLoadingg] = useState(false);
  const [Returnfareloadingg, setReturnfareLoadingg] = useState(false);
  const [FlightOptions, setFlightOptions] = useState([]);
  const [uniqueAirlines, setUniqueAirlines] = useState([]);
  const [uniqueReturnAirlines, setUniqueReturnAirlines] = useState([]);
  const [sortField, setSortField] = useState("price");
  const [sortReturnField, setSortReturnField] = useState("price");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortReturnOrder, setSortReturnOrder] = useState("asc");
  const [showPrices, setShowPrices] = useState(null);
  const [showReturnPrices, setShowReturnPrices] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [showFlightDetails, setShowFlightDetails] = useState(null);
  const [showContent, setshowcontent] = useState("flight_details");
  const [minFare, setMinFare] = useState(0);
  const [minreturnFare, setMinReturnFare] = useState(0);
  const [maxFare, setMaxFare] = useState(100000);
  const [maxreturnFare, setMaxReturnFare] = useState(100000);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [priceReturnRange, setPriceReturnRange] = useState([0, 100000]);
  const [FlightFares, setFlightFare] = useState([]);
  const [ReturnFlightFares, setReturnFlightFare] = useState([]);
  const [selectedStops, setSelectedStops] = React.useState(new Set());
  const [returnselectedStops, setreturnSelectedStops] = React.useState(
    new Set()
  );
  const [selectedDepartures, setSelectedDepartures] = useState([]);
  const [selectedReturnDepartures, setSelectedReturnDepartures] = useState([]);
  const [selectedArrivals, setSelectedArrivals] = useState([]);
  const [selectedReturnArrivals, setSelectedReturnArrivals] = useState([]);
  const [selectedAirlines, setSelectedAirlines] = React.useState(new Set());
  const [selectedReturnAirlines, setSelectedReturnAirlines] = React.useState(
    new Set()
  );
  const [selectedFlightoption, setSelectedFlightoption] = React.useState([]);
  const [selectedReturnFlightoption, setSelectedReturnFlightoption] =
    React.useState([]);
  const [selectedFlightIds, setSelectedFlightIds] = React.useState([]);
  const [selectedReturnFlightIds, setSelectedReturnFlightIds] = React.useState(
    []
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
    location.state.responseData?.flight_type
  );
  const [FlightReturnOptions, setFlightReturnOptions] = useState([]);
  const [AirportData, setAirportData] = useState([]);
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
            "https://selfbooking.taxivaxi.com/api/airports"
          );
          setAirportData(response.data);
          // console.log(response.data);
          localStorage.setItem(
            "apiairportsdata",
            JSON.stringify(response.data)
          ); // Save to localStorage
        } catch (error) {
          console.error("Error fetching airport data:", error);
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
          .filter((email) => !normalizedSpocEmails.includes(email)) // 🔥 SPOC has priority
      ),
    ];
  }, [ccmail, normalizedSpocEmails]);

  const [ccEmails, setCCEmails] = useState(normalizedCCEmails);

  const [ccEmailInput, setCCEmailInput] = useState("");

  const [spocEmailInput, setSpocEmailInput] = useState("");

  const [additionalEmails, setAdditionalEmails] = useState(
    normalizedAdditionalEmails
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
        "0"
      )}T00:00:00.000+05:30`;
    }
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return `${dateStr}T00:00:00.000+05:30`;
    }
    // Handle fallback
    console.warn("Unrecognized date format:", dateStr);
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
        airport.airportName?.toLowerCase().includes(value.toLowerCase())
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
        airport.airportName?.toLowerCase().includes(value.toLowerCase())
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
      "https://selfbooking.taxivaxi.com/api/airports"
    );
    const AirportData = response.data;
    // // console.log(AirportData)
    const origincode = inputValue.originAirport
      ? inputValue.originAirport
      : extractAirportCode(fromAirport);
    const airportOrigin = AirportData.find(
      (airport) => airport.airport_iata_code === origincode
    );
    const OriginCountryCode = airportOrigin?.airport_iso_country;
    const destcode = inputValue.destinationAriport
      ? inputValue.destinationAriport
      : extractAirportCode(ToAirport);

    const airportdest = AirportData.find(
      (airport) => airport.airport_iata_code === destcode
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
            })
          );

          setUniqueReturnAirlines(result);

          const { minFare, maxFare } = getFareBounds(AvailableOptionsReturn);
          setMinReturnFare(minFare);
          setMaxReturnFare(maxFare);
          setPriceReturnRange([minFare, maxFare]);
        }

        setLoadingg(false);
      }
      setLoadingg(false);
    } catch (error) {
      setLoadingg(false);
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchData();
      hasFetched.current = true;
    }
  }, []);

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
    setShowPrices(null);
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
    setShowPrices(null);
  };

  const toggleSelection = (slotKey, isDeparture) => {
    const updater = isDeparture ? setSelectedDepartures : setSelectedArrivals;
    const current = isDeparture ? selectedDepartures : selectedArrivals;
    updater(
      current.includes(slotKey)
        ? current.filter((key) => key !== slotKey)
        : [...current, slotKey]
    );
    setSelectedFlightIds([]);
    setSelectedFares([]);
    setShowPrices(null);
  };

  const getTimeSlot = (hour) => {
    if (hour < 6) return "before6AM";
    if (hour < 12) return "6AMto12PM";
    if (hour < 18) return "12PMto6PM";
    return "after6PM";
  };

  //Flitered data
  const filteredFlights = FlightOptions.filter((response) => {
    // // console.log("FlightOptions",FlightOptions)
    const flight = response.flight;
    if (!flight) return false;

    // 1. Stops filter
    const stopsCount = flight.segments.length - 1;
    if (selectedStops.size > 0 && !selectedStops.has(stopsCount)) return false;

    const depTime = new Date(flight?.depTime);
    const depSlot = getTimeSlot(depTime.getHours());
    if (selectedDepartures.length > 0 && !selectedDepartures.includes(depSlot))
      return false;

    // Arrival Time filter
    const arrTime = new Date(flight?.arrTime);
    const arrSlot = getTimeSlot(arrTime.getHours());
    if (selectedArrivals.length > 0 && !selectedArrivals.includes(arrSlot))
      return false;
    // Airlines filter
    if (selectedAirlines.size > 0) {
      const flightAirlines = new Set(
        flight.segments.map((s) => s.Airline.AirlineName)
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
    return true; // passed all filters
  });

  //data storing
  const sortedFlights = [...filteredFlights].sort((a, b) => {
    // // console.log("filteredFlights", filteredFlights)
    const getTime = (timeStr) => new Date(timeStr).getTime();

    const flightA = a;
    const flightB = b;
    switch (sortField) {
      case "departure":
        return sortOrder === "asc"
          ? getTime(flightA.flight.depTime) - getTime(flightB.flight.depTime)
          : getTime(flightB.flight.depTime) - getTime(flightA.flight.depTime);

      // case "arrival":
      //   return sortOrder === "asc"
      //     ? getTime(flightA.flight.arrTime) - getTime(flightB.flight.arrTime)
      //     : getTime(flightB.flight.arrTime) - getTime(flightA.flight.arrTime);
      case "arrival": {
        const parseArrivalDate = (value) => {
          if (!value) return 0;

          // Extract +XDays
          let extraDays = 0;
          const dayMatch = value.match(/\+(\d+)Days/);
          if (dayMatch) extraDays = parseInt(dayMatch[1]);

          // Remove +XDays to isolate the datetime part
          let cleaned = value.replace(/\+\d+Days/, "").trim();

          // Try to convert cleaned string into Date
          let baseDate = new Date(cleaned);

          // If invalid date AND only time provided → fallback to today
          if (isNaN(baseDate.getTime())) {
            const [time] = cleaned.split(" ");
            const [h, m] = time.split(":").map(Number);
            baseDate = new Date();
            baseDate.setHours(h, m, 0, 0);
          }

          // Add the extra days
          baseDate.setDate(baseDate.getDate() + extraDays);

          return baseDate.getTime();
        };

        const A = parseArrivalDate(flightA.flight.arrTime);
        const B = parseArrivalDate(flightB.flight.arrTime);

        return sortOrder === "asc" ? A - B : B - A;
      }

      case "travelTime": {
        const durationA =
          new Date(flightA.flight.arrTime).getTime() -
          new Date(flightA.flight.depTime).getTime();
        const durationB =
          new Date(flightB.flight.arrTime).getTime() -
          new Date(flightB.flight.depTime).getTime();
        return sortOrder === "asc"
          ? durationA - durationB
          : durationB - durationA;
      }

      case "stops": {
        const stopsA = flightA.flight.segments.length - 1;
        const stopsB = flightB.flight.segments.length - 1;
        return sortOrder === "asc" ? stopsA - stopsB : stopsB - stopsA;
      }
      case "price": {
        const minFareA = Math.min(Number(flightA.prices.TotalPrice));
        const minFareB = Math.min(Number(flightB.prices.TotalPrice));
        return sortOrder === "asc" ? minFareA - minFareB : minFareB - minFareA;
      }

      default:
        return 0;
    }
  });

  const handleSort = (field) => {
    if (field === sortField) {
      // Toggle order
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setShowPrices(null);
    setShowFlightDetails(null);
  };
  //Clear filter
  const handleClearFilters = () => {
    setSelectedStops(new Set());
    setSelectedDepartures([]);
    setSelectedArrivals([]);
    setSelectedAirlines(new Set());
    setPriceRange([minFare, maxFare]); // or your initial default range
    setShowPrices(null);
  };

  // -------------------------------------------- Return Filter ---------------------------------------------
  //Fliter stop
  const toggleReturnStop = (stop) => {
    setreturnSelectedStops((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stop)) {
        newSet.delete(stop);
      } else {
        newSet.add(stop);
      }
      return newSet;
    });
    setSelectedReturnFlightIds([]);
    setSelectedReturnFares([]);
    setShowReturnPrices(null);
  };
  // Airline Filter
  const toggleReturnAirline = (airlineName) => {
    setSelectedReturnAirlines((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(airlineName)) {
        newSet.delete(airlineName);
      } else {
        newSet.add(airlineName);
      }
      // onChange(newSet); // Notify parent about change
      return newSet;
    });
    setSelectedReturnFlightIds([]);
    setSelectedReturnFares([]);
    setShowReturnPrices(null);
  };

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
        : [...current, slotKey]
    );
    setSelectedReturnFlightIds([]);
    setSelectedReturnFares([]);
    setShowReturnPrices(null);
  };

  const getReturnTimeSlot = (hour) => {
    if (hour < 6) return "before6AM";
    if (hour < 12) return "6AMto12PM";
    if (hour < 18) return "12PMto6PM";
    return "after6PM";
  };

  //Flitered data
  const filteredReturnFlights = FlightReturnOptions.filter((response) => {
    const flight = response.flight;
    if (!flight) return false;

    // 1. Stops filter
    const stopsCount = flight.segments.length - 1;
    if (returnselectedStops.size > 0 && !returnselectedStops.has(stopsCount))
      return false;

    // departure Time filter
    const depTime = new Date(flight?.depTime);
    const depSlot = getReturnTimeSlot(depTime.getHours());
    if (
      selectedReturnDepartures.length > 0 &&
      !selectedReturnDepartures.includes(depSlot)
    )
      return false;

    // Arrival Time filter
    const arrTime = new Date(flight?.arrTime);
    const arrSlot = getReturnTimeSlot(arrTime.getHours());
    if (
      selectedReturnArrivals.length > 0 &&
      !selectedReturnArrivals.includes(arrSlot)
    )
      return false;
    // Airlines filter
    if (selectedReturnAirlines.size > 0) {
      const flightAirlines = new Set(
        flight.segments.map((s) => s.Airline.AirlineName)
      );
      let airlineMatch = false;
      for (let airline of selectedReturnAirlines) {
        if (flightAirlines.has(airline)) {
          airlineMatch = true;
          break;
        }
      }
      if (!airlineMatch) return false;
    }

    // Price range filter
    const price = Number(response.prices?.TotalPrice);
    if (price < priceReturnRange[0] || price > priceReturnRange[1]) {
      return false;
    }
    return true; // passed all filters
  });

  //data storing
  const sortedReturnFlights = [...filteredReturnFlights].sort((a, b) => {
    const getTime = (timeStr) => new Date(timeStr).getTime();

    const flightA = a;
    const flightB = b;
    switch (sortReturnField) {
      case "departure":
        return sortReturnOrder === "asc"
          ? getTime(flightA.flight.depTime) - getTime(flightB.flight.depTime)
          : getTime(flightB.flight.depTime) - getTime(flightA.flight.depTime);
      case "arrival":
        return sortReturnOrder === "asc"
          ? getTime(flightA.flight.arrTime) - getTime(flightB.flight.arrTime)
          : getTime(flightB.flight.arrTime) - getTime(flightA.flight.arrTime);

      case "travelTime": {
        const durationA =
          new Date(flightA.flight.arrTime).getTime() -
          new Date(flightA.flight.depTime).getTime();
        const durationB =
          new Date(flightB.flight.arrTime).getTime() -
          new Date(flightB.flight.depTime).getTime();
        return sortReturnOrder === "asc"
          ? durationA - durationB
          : durationB - durationA;
      }

      case "stops": {
        const stopsA = flightA.flight.segments.length - 1;
        const stopsB = flightB.flight.segments.length - 1;
        return sortReturnOrder === "asc" ? stopsA - stopsB : stopsB - stopsA;
      }
      case "price": {
        const minFareA = Math.min(Number(flightA.prices.TotalPrice));
        const minFareB = Math.min(Number(flightB.prices.TotalPrice));
        return sortReturnOrder === "asc"
          ? minFareA - minFareB
          : minFareB - minFareA;
      }

      default:
        return 0;
    }
  });

  const handleReturnSort = (field) => {
    if (field === sortReturnField) {
      // Toggle order
      setSortReturnOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortReturnField(field);
      setSortReturnOrder("asc");
    }
    setSelectedReturnFlightIds([]);
    setSelectedReturnFares([]);
    setShowReturnPrices(null);
  };

  //Clear filter
  const handleClearReturnFilters = () => {
    setreturnSelectedStops(new Set());
    setSelectedReturnDepartures([]);
    setSelectedReturnArrivals([]);
    setSelectedReturnAirlines(new Set());
    setPriceReturnRange([minFare, maxFare]); // or your initial default range
    setShowReturnPrices(null);
    setSelectedReturnFlightIds([]);
    setSelectedReturnFares([]);
    setShowReturnPrices(null);
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
  // ----------------------------------Flight fares api--------------------------------
  //Onward flights
  const Getfares = async (data) => {
    // // console.log(PassengeDetails)

    const requestData = {
      unique_id: data.unique_id,
      trace_price: data.trace_price,
      trace_search: data.trace_search,
      trace_option: data.trace_option,
      passengerDetails: PassengerDetails,
    };
    try {
      setfareLoadingg(true);
      const response = await fetch(`${base_url}searchPrices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const Data = await response.json();
      const data = Data.data;
      setFlightFare(data);
      // // console.log(data)
      setfareLoadingg(false);
    } catch {
      setfareLoadingg(false);
      // console.log("error");
    }
  };
  // Selected flight options

  const handleFareToggle = (segments, fare, index, basefare) => {
    // Get the current flight from sortedFlights to create unique ID
    const currentFlight = sortedFlights[index]?.flight;

    // Create unique ID using flight properties
    const flightId = `${currentFlight?.originAirport?.CityCode}-${currentFlight?.destinationAirport?.CityCode}-${currentFlight?.depTime}-${currentFlight?.arrTime}-${currentFlight?.segments?.[0]?.Airline?.FlightNumber}`;

    setSelectedFares((prevFares) => {
      const isAlreadySelected = prevFares.some(
        (f) => f.flightId === flightId && f.fareType === fare.type
      );

      let updatedFares;
      if (isAlreadySelected) {
        // Remove fare
        updatedFares = prevFares.filter(
          (f) => !(f.flightId === flightId && f.fareType === fare.type)
        );
      } else {
        // Add fare
        updatedFares = [...prevFares, { flightId, fareType: fare.type }];
      }

      // Update selectedFlightIds
      setSelectedFlightIds((prevIds) => {
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

    setSelectedFlightoption((prevOptions) => {
      const isAlreadySelected = prevOptions.some(
        (item) => item.flightId === flightId && item.fare.type === fare.type
      );

      if (isAlreadySelected) {
        // Remove from booking options
        return prevOptions.filter(
          (item) =>
            !(item.flightId === flightId && item.fare.type === fare.type)
        );
      } else {
        // Add to booking options
        return [
          ...prevOptions,
          {
            flightId, // Store flightId instead of index
            originalIndex: index, // Keep original index for reference
            flight: segments,
            fare,
            base_fare: basefare,
            flightData: currentFlight, // Store flight data for display
          },
        ];
      }
    });
  };
  const groupedFlights = selectedFlightoption.reduce((acc, curr) => {
    // Use flightId instead of index
    if (!acc[curr.flightId]) {
      acc[curr.flightId] = {
        flight: curr.flight,
        flightData: curr.flightData || curr.flight, // Use stored flight data
        fares: [],
        base_fare: curr.base_fare,
      };
    }
    acc[curr.flightId].fares.push(curr.fare);
    return acc;
  }, {});
  // Remove selected Flight option
  const handleRemoveFare = (flightId, fareType) => {
    // Update selectedFlightoption
    setSelectedFlightoption((prev) =>
      prev.filter(
        (item) => !(item.flightId === flightId && item.fare.type === fareType)
      )
    );

    // Update selectedFares
    setSelectedFares((prev) =>
      prev.filter((f) => !(f.flightId === flightId && f.fareType === fareType))
    );

    // Update selectedFlightIds if no fares left
    setSelectedFlightIds((prev) => {
      const hasOtherFares = selectedFares.some(
        (f) => f.flightId === flightId && f.fareType !== fareType
      );
      if (!hasOtherFares) {
        return prev.filter((id) => id !== flightId);
      }
      return prev;
    });
  };

  //Return Flights
  const GetreturnFares = async (data) => {
    // // console.log(PassengeDetails)

    const requestData = {
      unique_id: data.unique_id,
      trace_price: data.trace_price,
      trace_search: data.trace_search,
      trace_option: data.trace_option,
      passengerDetails: PassengerDetails,
    };
    try {
      setReturnfareLoadingg(true);
      const response = await fetch(`${base_url}searchPrices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const Data = await response.json();
      const data = Data.data;
      setReturnFlightFare(data);
      // // console.log(data)
      setReturnfareLoadingg(false);
    } catch {
      setReturnfareLoadingg(false);
      // console.log("error");
    }
  };
  // Selected flight options

  const handleReturnFareToggle = (segments, fare, index, basefare) => {
    // Get current flight from sortedReturnFlights
    const currentFlight = sortedReturnFlights[index]?.flight;
    // Create unique flight ID
    const flightId = `${currentFlight?.originAirport?.CityCode}-${currentFlight?.destinationAirport?.CityCode}-${currentFlight?.depTime}-${currentFlight?.arrTime}-${currentFlight?.segments?.[0]?.Airline?.FlightNumber}`;

    setSelectedReturnFares((prevFares) => {
      const isAlreadySelected = prevFares.some(
        (f) => f.flightId === flightId && f.fareType === fare.type
      );

      let updatedFares;
      if (isAlreadySelected) {
        updatedFares = prevFares.filter(
          (f) => !(f.flightId === flightId && f.fareType === fare.type)
        );
      } else {
        updatedFares = [...prevFares, { flightId, fareType: fare.type }];
      }

      // Update selectedReturnFlightIds
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
        (item) => item.flightId === flightId && item.fare.type === fare.type
      );

      if (isAlreadySelected) {
        return prevOptions.filter(
          (item) =>
            !(item.flightId === flightId && item.fare.type === fare.type)
        );
      } else {
        return [
          ...prevOptions,
          {
            flightId,
            originalIndex: index,
            flight: segments,
            fare,
            base_fare: basefare,
            flightData: currentFlight,
          },
        ];
      }
    });
  };
  const groupedReturnFlights = selectedReturnFlightoption.reduce(
    (acc, curr) => {
      // Use flightId instead of index
      if (!acc[curr.flightId]) {
        acc[curr.flightId] = {
          flight: curr.flight,
          flightData: curr.flightData || curr.flight,
          fares: [],
          base_fare: curr.base_fare,
        };
      }
      acc[curr.flightId].fares.push(curr.fare);
      return acc;
    },
    {}
  );
  // Remove selected Flight option
  const handleRemoveReturnFare = (flightId, fareType) => {
    setSelectedReturnFlightoption((prev) =>
      prev.filter(
        (item) => !(item.flightId === flightId && item.fare.type === fareType)
      )
    );

    setSelectedReturnFares((prev) =>
      prev.filter((f) => !(f.flightId === flightId && f.fareType === fareType))
    );

    setSelectedReturnFlightIds((prev) => {
      const hasOtherFares = selectedReturnFares.some(
        (f) => f.flightId === flightId && f.fareType !== fareType
      );
      if (!hasOtherFares) {
        return prev.filter((id) => id !== flightId);
      }
      return prev;
    });
  };

  // -----------------------------------------------------Fare selection for booking---------------------------------------------------

  const handleSingleSelect = (flight, fare, index, baseFare, journey) => {
    setSelectedFareforbooking((prev) => ({
      ...prev,
      [journey]: { flight: flight, fare: fare }, // replace the array with only the selected fare for the given journey
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
  const [ClientPrice, setClientPrice] = useState("");
  const [priceError, setPriceError] = useState("");
  // Add these state variables
  const [ClientPriceOnward, setClientPriceOnward] = useState("");
  const [ClientPriceReturn, setClientPriceReturn] = useState("");
  const [priceErrorOnward, setPriceErrorOnward] = useState("");
  const [priceErrorReturn, setPriceErrorReturn] = useState("");

  // Update modal close function
  const closeModal = () => {
    setIsModalOpen2(false);
    setClientPriceOnward("");
    setClientPriceReturn("");
    setPriceErrorOnward("");
    setPriceErrorReturn("");
  };
  // console.log(ClientPrice);

  const safeFormatTime = (dateValue) => {
    if (!dateValue) return "--:--";

    const date = new Date(dateValue);
    return isValid(date) ? format(date, "HH:mm") : "--:--";
  };

  const [bookingPayload, setBookingPayload] = useState(null);
  // const calculateDuration = (segments) => {
  //   if (!segments || segments.length === 0) return "0H 0M";

  //   // Calculate total duration from segments
  //   let totalMinutes = 0;
  //   segments.forEach(segment => {
  //     if (segment.duration) {
  //       // Assuming duration is in "PT2H10M" format or similar
  //       const match = segment.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  //       if (match) {
  //         const hours = parseInt(match[1] || 0);
  //         const minutes = parseInt(match[2] || 0);
  //         totalMinutes += hours * 60 + minutes;
  //       }
  //     }
  //   });

  //   const hours = Math.floor(totalMinutes / 60);
  //   const minutes = totalMinutes % 60;
  //   return `${hours}H ${minutes}M`;
  // };
  // const AddClientPrice = (
  //   fare,
  //   segments,
  //   Cabinclass,
  //   inputValue,
  //   FlightInfo,
  //   isRoundTrip = false,
  //   returnFlightData = null
  // ) => {
  //   setBookingPayload({
  //     fare,
  //     segments,
  //     Cabinclass,
  //     inputValue,
  //     FlightInfo,
  //     isRoundTrip,
  //     returnFlightData,
  //     totalPrice: isRoundTrip
  //       ? (fare?.price || 0) + (returnFlightData?.fare?.price || 0)
  //       : fare?.price || 0
  //   });

  //   setIsModalOpen2(true);
  // };
  const AddClientPrice = (
    fare,
    segments,
    Cabinclass,
    inputValue,
    FlightInfo,
    isRoundTrip = false,
    returnData = null
  ) => {
    // For one-way flight or onward flight only
    const bookingData = {
      fare,
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

    console.log("Booking Data:", bookingData); // Debug log

    setBookingPayload(bookingData);
    setIsModalOpen2(true);
  };
  const NavigatetoBookingflow = (
    fare,
    segments,
    Cabinclass,
    inputValue,
    FlightInfo,
    ClientPrice
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
    ClientPrice = null
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
      onward: { ...FlightData.Onward },
      return: { ...FlightData.Return },
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
      JSON.stringify(PriceResponse)
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
  function calculateDuration(dep, arr) {
    if (!dep || !arr) return "";
    const depDate = new Date(dep);
    const arrDate = new Date(arr);
    const diffMs = arrDate - depDate;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    console.log("time");
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:00`;
  }
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

  const cleanText = (text) => {
    if (!text || typeof text !== "string") return text;

    // Remove special characters but keep spaces, letters, numbers, basic punctuation
    return text
      .replace(/[^\w\s(),.-]/g, "") // Keep alphanumeric, spaces, and basic punctuation
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim();
  };

  const Shareflight = async () => {
    // Function to remove special characters and normalize text

    // Convert layover difference into HH:MM:SS
    const calculateLayover = (arrival, departure) => {
      const arr = new Date(arrival);
      const dep = new Date(departure);
      const diffMs = dep - arr;

      if (diffMs < 0) return "00 Hrs : 00 mins";

      const diffH = Math.floor(diffMs / (1000 * 60 * 60));
      const diffM = Math.floor((diffMs / (1000 * 60)) % 60);

      return `${String(diffH).padStart(2, "0")} Hrs : ${String(diffM).padStart(
        2,
        "0"
      )} mins`;
    };

    // Build initial object
    let transformedFlights = {
      flights: {
        onward: { flight_options: [] },
      },
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
    } else {
      is_return = 0;
    }

    // ------------------------- ONWARD FLIGHTS ----------------------------
    Object.values(groupedFlights).forEach((item) => {
      const segments = item.flight.segments || [];

      const flightNos = segments
        .map((seg) => seg.Airline?.FlightNumber)
        .join(", ");
      const airlineNames = segments
        .map((seg) => cleanText(seg.Airline?.AirlineName))
        .join(", ");
      const carriers = segments
        .map((seg) => cleanText(seg.Airline?.AirlineCode))
        .join(", ");
      const flightdetails = item.flight;

      // --------------------- LAYOVER CALCULATION ---------------------
      const stops = [];
      if (segments.length > 1) {
        for (let i = 0; i < segments.length - 1; i++) {
          const currentSeg = segments[i];
          const nextSeg = segments[i + 1];

          const stopAirport = currentSeg?.Destination?.Airport;

          const layoverTime = calculateLayover(
            currentSeg?.Destination?.ArrTime,
            nextSeg?.Origin?.DepTime
          );

          stops.push({
            stop_airport: cleanText(
              `${stopAirport?.AirportName} ${stopAirport?.CityName} (${stopAirport?.AirportCode})`
            ),
            duration: layoverTime,
          });
        }
      }

      // ---------------------- ADD FLIGHT OPTION ----------------------
      transformedFlights.flights.onward.flight_options.push({
        flight_no: cleanText(flightNos),
        airline_name: cleanText(airlineNames),
        from_city: cleanText(flightdetails.originAirport?.AirportName),
        from_city_code: cleanText(flightdetails.originAirport?.AirportCode),
        to_city: cleanText(flightdetails.destinationAirport?.AirportName),
        to_city_code: cleanText(flightdetails.destinationAirport?.AirportCode),
        departure_datetime: flightdetails?.depTime,
        arrival_datetime: flightdetails?.arrTime,
        base_price: item?.base_fare,
        price: item?.base_fare + Number(markup) || 0,
        markup: Number(markup) || 0,
        is_return,
        no_of_stops: segments.length - 1,
        carrier: cleanText(carriers),
        provider_code: cleanText(item?.fares?.[0]?.ProviderCode || ""),
        duration: calculateDuration(
          flightdetails?.depTime,
          flightdetails?.arrTime
        ),
        is_refundable: item.fares?.[0]?.is_refundable || 0,

        fare_details: (item?.fares || []).map((f) => ({
          fare_type: cleanText(f.type || "Corporate Fare"),
          base_price: f.price,
          price: f.price + Number(markup) || 0,
          // markup: f.markup || 0,
          markup: Number(markup) || 0,
          source: cleanText(f.from),
          updated_total_price: f.price + Number(markup) || 0, // Initialize with price
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
            seg.Destination?.Airport?.CityName
          ),
          provider_code: cleanText(item?.fares?.[0]?.ProviderCode),
          OriginTerminal: cleanText(seg.Origin?.Airport?.Terminal || ""),
          DestinationTerminal: cleanText(
            seg.Destination?.Airport?.Terminal || ""
          ),
        })),

        DestinationTerminal: cleanText(
          flightdetails.destinationAirport?.Terminal || ""
        ),
        OriginTerminal: cleanText(flightdetails.originAirport?.Terminal || ""),

        // ADD LAYOVER STOPS
        stops,
      });
    });

    // ------------------------- RETURN FLIGHTS ----------------------------
    if (Object.keys(groupedReturnFlights || {}).length > 0) {
      Object.values(groupedReturnFlights).forEach((item) => {
        const segments = item.flight.segments || [];

        const flightNos = segments
          .map((seg) => seg.Airline?.FlightNumber)
          .join(", ");
        const airlineNames = segments
          .map((seg) => cleanText(seg.Airline?.AirlineName))
          .join(", ");
        const carriers = segments
          .map((seg) => cleanText(seg.Airline?.AirlineCode))
          .join(", ");
        const flightdetails = item.flight;

        // ----------------- RETURN LAYOVER CALCULATION -----------------
        const stops = [];
        if (segments.length > 1) {
          for (let i = 0; i < segments.length - 1; i++) {
            const currentSeg = segments[i];
            const nextSeg = segments[i + 1];

            const stopAirport = currentSeg?.Destination?.Airport;

            const layoverTime = calculateLayover(
              currentSeg?.Destination?.ArrTime,
              nextSeg?.Origin?.DepTime
            );

            stops.push({
              stop_airport: cleanText(
                `${stopAirport?.AirportName} ${stopAirport?.CityName} (${stopAirport?.AirportCode})`
              ),
              duration: layoverTime,
            });
          }
        }

        // ---------------------- ADD FLIGHT OPTION ----------------------
        transformedFlights.flights.return.flight_options.push({
          flight_no: cleanText(flightNos),
          airline_name: cleanText(airlineNames),
          from_city: cleanText(flightdetails.originAirport?.AirportName),
          from_city_code: cleanText(flightdetails.originAirport?.AirportCode),
          to_city: cleanText(flightdetails.destinationAirport?.AirportName),
          to_city_code: cleanText(
            flightdetails.destinationAirport?.AirportCode
          ),
          departure_datetime: flightdetails?.depTime,
          arrival_datetime: flightdetails?.arrTime,
          base_price: item?.base_fare,
          price: item?.base_fare + Number(markup) || 0,
          markup: Number(markup) || 0,
          price: item?.base_fare,
          is_return: 1,
          no_of_stops: segments.length - 1,
          carrier: cleanText(carriers),
          provider_code: cleanText(item?.fares?.[0]?.ProviderCode || ""),
          duration: calculateDuration(
            flightdetails?.depTime,
            flightdetails?.arrTime
          ),
          is_refundable: item.fares?.[0]?.is_refundable || 0,

          fare_details: (item?.fares || []).map((f) => ({
            fare_type: cleanText(f.type || "Corporate Fare"),
            base_price: f.price,
            price: f.price + Number(markup) || 0,
            // markup: f.markup || 0,
            markup: Number(markup) || 0,
            source: cleanText(f.from),
            updated_total_price: f.price + Number(markup) || 0, // Initialize with price
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
              seg.Destination?.Airport?.CityName
            ),
            provider_code: cleanText(item?.fares?.[0]?.ProviderCode),
            OriginTerminal: cleanText(seg.Origin?.Airport?.Terminal || ""),
            DestinationTerminal: cleanText(
              seg.Destination?.Airport?.Terminal || ""
            ),
          })),

          DestinationTerminal: cleanText(
            flightdetails.destinationAirport?.Terminal || ""
          ),
          OriginTerminal: cleanText(
            flightdetails.originAirport?.Terminal || ""
          ),

          // ADD LAYOVER STOPS
          stops,
        });
      });
    }

    // ---------------------- FINAL REQUEST BODY ----------------------

    const requestData = {
      booking_id: cleanText(bookingid),
      email: cleanText(spocEmails),
      seat_type: cleanText(cabinclass),
      departure_date: searchdeparturedate || null,
      return_date: searchreturndate || null,
      no_of_seats: no_of_seats,
      ...transformedFlights,
      additional_emails: cleanText(additionalEmails),
      cc_email: cleanText(ccEmails),
      remark: cleanText(remark),
      client_name: cleanText(client_name),
      spoc_name: cleanText(spocname),
      htmlContent: "",
      flag: "",
      query_id:queryId,
    };

    // console.log("requestData", requestData);
    setshareoptionsrequest(requestData);

    try {
      const response = await fetch(
        `${CONFIG.MAIN_API}/api/flights/addCotravFlightOptionBooking`,
        {
          method: "POST",
          headers: {
            // "Content-Type": "application/json",
            // "Accept": "application/json"
            Origin: "*",
          },
          body: JSON.stringify(requestData),
        }
      );

      const responsedata = await response.json();
      if (responsedata.success === "1") {
        setHtmlContent(responsedata.data);
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
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Find all spans with data-index that already exist in the HTML
    const priceSpans = doc.querySelectorAll('span[data-index]');
    
    priceSpans.forEach((span, index) => {
        // Get the original text from the span
        const originalText = span.textContent.trim();
        
        // Extract the number from "INR "5420 format
        let numberMatch = originalText.match(/"INR "(\d+)/);
        let priceNumber = '';
        
        if (numberMatch) {
            priceNumber = numberMatch[1];
        } else {
            // Try other formats
            const alternativeMatch = originalText.match(/INR\s+["']?(\d+)/);
            if (alternativeMatch) {
                priceNumber = alternativeMatch[1];
            } else {
                // Last resort - just get numbers
                const numbersOnly = originalText.replace(/\D/g, '');
                if (numbersOnly) {
                    priceNumber = numbersOnly;
                }
            }
        }
        
        if (priceNumber) {
            // Store original value
            span.setAttribute('data-original', priceNumber);
            
            // Make it editable
            span.setAttribute('contenteditable', 'true');
            
            // Add styling
            span.style.backgroundColor = '#fff8e1';
            span.style.border = '1px solid #ff9800';
            span.style.padding = '2px 4px';
            span.style.borderRadius = '3px';
            span.style.display = 'inline-block';
            span.style.margin = '0 2px';
            span.style.cursor = 'text';
            span.style.fontWeight = 'bold';
            span.style.minWidth = '50px';
            
            // Clean up the text - show just the number with formatting
            const formattedNumber = parseInt(priceNumber).toLocaleString('en-IN');
            span.textContent = formattedNumber;
            
            console.log(`Span ${index}: data-index="${span.getAttribute('data-index')}", original="${priceNumber}"`);
        }
    });
    
    // Also check for any other price spans without data-index
    const allSpans = doc.querySelectorAll('span');
    allSpans.forEach(span => {
        if (!span.hasAttribute('data-index')) {
            const text = span.textContent.trim();
            // Look for price patterns
            if (text.includes('INR') || /^\d+$/.test(text)) {
                const priceMatch = text.match(/"INR "(\d+)/) || text.match(/INR\s+["']?(\d+)/);
                if (priceMatch) {
                    const priceNumber = priceMatch[1];
                    // Add data-index and make editable
                    span.setAttribute('data-index', `auto-${Date.now()}-${Math.random()}`);
                    span.setAttribute('data-original', priceNumber);
                    span.setAttribute('contenteditable', 'true');
                    
                    // Add styling
                    span.style.backgroundColor = '#fff8e1';
                    span.style.border = '1px solid #ff9800';
                    span.style.padding = '2px 4px';
                    span.style.borderRadius = '3px';
                    span.style.display = 'inline-block';
                    span.style.margin = '0 2px';
                    span.style.cursor = 'text';
                    span.style.fontWeight = 'bold';
                    span.style.minWidth = '50px';
                    
                    // Update text
                    span.textContent = parseInt(priceNumber).toLocaleString('en-IN');
                }
            }
        }
    });
    
    return doc.documentElement.outerHTML;
};
  // 2. SIMPLE EXTRACTION THAT WORKS
const extractFareDetailsFromHtml = (container) => {
    const updatedFares = [];
    
    // Find all editable spans with data-index
    const spans = container.querySelectorAll('span[data-index]');
    
    spans.forEach(span => {
        const dataIndex = span.getAttribute('data-index');
        const originalValue = span.getAttribute('data-original');
        const currentText = span.textContent.trim();
        
        // Extract numeric value from current text
        const numberMatch = currentText.match(/[\d,]+/);
        if (numberMatch) {
            const currentValue = parseInt(numberMatch[0].replace(/,/g, ''), 10);
            const originalValueNum = parseInt(originalValue, 10);
            
            updatedFares.push({
                dataIndex: dataIndex,
                originalValue: originalValueNum,
                currentValue: currentValue,
                isEdited: currentValue !== originalValueNum
            });
        }
    });
    
    return updatedFares;
};
const setupPriceFormatting = (container) => {
    if (!container) return;
    
    console.log('Setting up price formatting...');
    
    // Format on input
    const handleInput = (e) => {
        const target = e.target;
        if (!target.hasAttribute('data-index')) return;
        
        console.log('Input event on span with data-index:', target.getAttribute('data-index'));
        
        // Get current text
        let text = target.textContent.trim();
        
        // Remove all non-digits
        const digits = text.replace(/\D/g, '');
        
        if (digits) {
            const number = parseInt(digits, 10);
            if (!isNaN(number)) {
                target.textContent = number.toLocaleString('en-IN');
            }
        } else {
            // Restore original if empty
            const original = target.getAttribute('data-original');
            if (original) {
                const number = parseInt(original, 10);
                target.textContent = number.toLocaleString('en-IN');
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
    };
    
    // Handle paste
    const handlePaste = (e) => {
        const target = e.target;
        if (target.hasAttribute('data-index')) {
            e.preventDefault();
            const pastedText = e.clipboardData.getData('text/plain');
            const numbersOnly = pastedText.replace(/\D/g, '');
            
            if (numbersOnly) {
                const number = parseInt(numbersOnly, 10);
                if (!isNaN(number)) {
                    target.textContent = number.toLocaleString('en-IN');
                }
            }
        }
    };
    
    // Select all on click
    const handleClick = (e) => {
        const target = e.target;
        if (target.hasAttribute('data-index') && target.isContentEditable) {
            setTimeout(() => {
                const range = document.createRange();
                const selection = window.getSelection();
                range.selectNodeContents(target);
                selection.removeAllRanges();
                selection.addRange(range);
            }, 10);
        }
    };
    
    // Add event listeners
    container.addEventListener('input', handleInput);
    container.addEventListener('paste', handlePaste);
    container.addEventListener('click', handleClick);
    
    // Cleanup function
    return () => {
        container.removeEventListener('input', handleInput);
        container.removeEventListener('paste', handlePaste);
        container.removeEventListener('click', handleClick);
    };
};
//   // 3. SIMPLE BUILD FUNCTION
//   const buildUpdatedFlights = (originalFlights, updatedFareDetails) => {
//     // console.log("=== BUILDING UPDATED FLIGHTS ===");
//     // console.log("Updated fare details:", updatedFareDetails);
//     // console.log("Original flights structure:", originalFlights);

//     const updatedFlights = JSON.parse(JSON.stringify(originalFlights)); // Deep clone

//     // Update onward flights
//     if (
//       updatedFlights.flights.onward &&
//       updatedFlights.flights.onward.flight_options
//     ) {
//       // console.log("Original onward flights:", updatedFlights.flights.onward.flight_options.length);

//       updatedFlights.flights.onward.flight_options.forEach(
//         (flight, flightIndex) => {
//           const updatedFares = updatedFareDetails.onward[flightIndex] || [];

//           flight.fare_details.forEach((fare, fareIndex) => {
//             const updatedFare = updatedFares[fareIndex];

//             if (
//               updatedFare &&
//               updatedFare.__edited === true &&
//               typeof updatedFare.updated_total_price === "number"
//             ) {
//               // ✅ Edited fare
//               fare.updated_total_price = updatedFare.updated_total_price;
//             } else {
//               // ✅ NOT edited → use original price
//               fare.updated_total_price = fare.price;
//             }
//           });

//           // ✅ Flight price = min updated_total_price
//           const minPrice = Math.min(
//             ...flight.fare_details.map((f) => f.updated_total_price)
//           );

//           flight.price = minPrice;
//           flight.base_price = minPrice - flight.markup;
//         }
//       );
//     }

//     // Update return flights
//     if (
//       updatedFlights.flights.return &&
//       updatedFlights.flights.return.flight_options
//     ) {
//       // console.log("Original return flights:", updatedFlights.flights.return.flight_options.length);

//       updatedFlights.flights.return.flight_options.forEach(
//         (flight, flightIndex) => {
//           const updatedFares = updatedFareDetails.return[flightIndex] || [];

//           flight.fare_details.forEach((fare, fareIndex) => {
//             const updatedFare = updatedFares[fareIndex];

//             if (
//               updatedFare &&
//               updatedFare.__edited === true &&
//               typeof updatedFare.updated_total_price === "number"
//             ) {
//               fare.updated_total_price = updatedFare.updated_total_price;
//             } else {
//               fare.updated_total_price = fare.price;
//             }
//           });

//           const minPrice = Math.min(
//             ...flight.fare_details.map((f) => f.updated_total_price)
//           );

//           flight.price = minPrice;
//           flight.base_price = minPrice - flight.markup;
//         }
//       );
//     }

//     // console.log("Final updated flights:", updatedFlights);
//     return updatedFlights;
//   };
const updateRequestDataWithEditedPrices = (requestData, editedFares) => {
    // Deep clone the request data
    const updatedData = JSON.parse(JSON.stringify(requestData));
    
    // Group edited fares by flight type
    const onwardFares = editedFares.filter(fare => !fare.dataIndex.startsWith('R-'));
    const returnFares = editedFares.filter(fare => fare.dataIndex.startsWith('R-')).map(fare => ({
        ...fare,
        fareIndex: parseInt(fare.dataIndex.replace('R-', ''))
    }));
    
    // Update onward flight fares
    if (updatedData.flights?.onward?.flight_options?.length > 0) {
        const onwardFlight = updatedData.flights.onward.flight_options[0];
        
        onwardFares.forEach((fare, index) => {
            if (onwardFlight.fare_details && onwardFlight.fare_details.length > index) {
                // Update updated_total_price
                onwardFlight.fare_details[index].updated_total_price = fare.currentValue;
                
                // Also update price field if this is the base fare
                if (index === 0) {
                    onwardFlight.price = fare.currentValue;
                }
            }
        });
    }
    
    // Update return flight fares
    if (updatedData.flights?.return?.flight_options?.length > 0) {
        const returnFlight = updatedData.flights.return.flight_options[0];
        
        returnFares.forEach(fare => {
            if (returnFlight.fare_details && returnFlight.fare_details.length > fare.fareIndex) {
                // Update updated_total_price
                returnFlight.fare_details[fare.fareIndex].updated_total_price = fare.currentValue;
                
                // Also update price field if this is the base fare
                if (fare.fareIndex === 0) {
                    returnFlight.price = fare.currentValue;
                }
            }
        });
    }
    
    return updatedData;
};

  // 4. DEBUGGING CONFIRM FUNCTION
// const confirmAndCloseModal = async () => {
//     if (!contentRef.current) return;
    
//     try {
//         // 1. Extract edited fares from HTML
//         const editedFares = extractFareDetailsFromHtml(contentRef.current);
//         console.log('Edited fares:', editedFares);
        
//         // 2. Update the request data with edited prices
//         const updatedRequestData = updateRequestDataWithEditedPrices(shareoptionrequest, editedFares);
        
//         // 3. Prepare the final request
//         const finalRequest = {
//             ...updatedRequestData,
//             htmlContent: contentRef.current.innerHTML,
//             flag: "send"
//         };
        
//         console.log('Final request data:', finalRequest);
        
//         // 4. Send to server
//         const response = await fetch(
//             `${CONFIG.MAIN_API}/api/flights/addCotravFlightOptionBooking`,
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Origin: "*"
//                 },
//                 body: JSON.stringify(finalRequest)
//             }
//         );
        
//         const responseData = await response.json();
        
//         if (responseData.success === "1") {
//             Swal.fire({
//                 title: "Success!",
//                 text: "Updated prices have been sent successfully.",
//                 icon: "success",
//                 confirmButtonText: "OK"
//             });
//             setShowModal(false);
//         } else {
//             Swal.fire({
//                 title: "Error!",
//                 text: responseData.message || "Failed to update prices.",
//                 icon: "error",
//                 confirmButtonText: "OK"
//             });
//         }
        
//     } catch (error) {
//         console.error('Error:', error);
//         Swal.fire({
//             title: "Error!",
//             text: "An error occurred while updating prices.",
//             icon: "error",
//             confirmButtonText: "OK"
//         });
//     }
// };
const confirmAndCloseModal = async () => {
    if (!contentRef.current) return;
    
    try {
        // 1. Extract edited fares from HTML
        const editedFares = extractFareDetailsFromHtml(contentRef.current);
        console.log('Edited fares:', editedFares);
        
        // 2. Update the request data with edited prices
        const updatedRequestData = updateRequestDataWithEditedPrices(shareoptionrequest, editedFares);
        
        // 3. Check if any edited price is lower than base_price
        let hasPriceLowerThanBase = false;
        let warningMessage = '';
        const lowerPriceDetails = [];
        
        // Check onward flights
        if (updatedRequestData.flights?.onward?.flight_options?.length > 0) {
            const onwardFlight = updatedRequestData.flights.onward.flight_options[0];
            
            if (onwardFlight.fare_details && onwardFlight.fare_details.length > 0) {
                onwardFlight.fare_details.forEach((fare, index) => {
                    const basePrice = fare.base_price || 0;
                    const updatedPrice = fare.updated_total_price || fare.price || 0;
                    
                    if (updatedPrice < basePrice || updatedPrice === basePrice) {
                        hasPriceLowerThanBase = true;
                        lowerPriceDetails.push({
                            flightType: 'Onward',
                            fareType: fare.fare_type || `Fare ${index + 1}`,
                            basePrice: basePrice,
                            updatedPrice: updatedPrice,
                            difference: basePrice - updatedPrice
                        });
                    }
                });
            }
        }
        
        // Check return flights
        if (updatedRequestData.flights?.return?.flight_options?.length > 0) {
            const returnFlight = updatedRequestData.flights.return.flight_options[0];
            
            if (returnFlight.fare_details && returnFlight.fare_details.length > 0) {
                returnFlight.fare_details.forEach((fare, index) => {
                    const basePrice = fare.base_price || 0;
                    const updatedPrice = fare.updated_total_price || fare.price || 0;
                    
                    if (updatedPrice < basePrice || updatedPrice === basePrice) {
                        hasPriceLowerThanBase = true;
                        lowerPriceDetails.push({
                            flightType: 'Return',
                            fareType: fare.fare_type || `Fare ${index + 1}`,
                            basePrice: basePrice,
                            updatedPrice: updatedPrice,
                            difference: basePrice - updatedPrice
                        });
                    }
                });
            }
        }
        
        // 4. If price is lower than base, show confirmation alert
        if (hasPriceLowerThanBase) {
            // Build warning message
            warningMessage = `<div style="text-align: left;">
                <h4 style="color: #d32f2f; margin-bottom: 15px;">⚠️ Price Warning</h4>
                <p>The following prices are <strong>lower than their base price</strong>:</p>
                <ul style="margin: 10px 0 20px 20px;">`;
            
            lowerPriceDetails.forEach(detail => {
                warningMessage += `
                    <li>
                        <strong>${detail.flightType} - ${detail.fareType}:</strong><br>
                        Base Price: ₹${detail.basePrice.toLocaleString('en-IN')}<br>
                        Updated Price: ₹${detail.updatedPrice.toLocaleString('en-IN')}<br>
                        <span style="color: #d32f2f; font-weight: bold;">
                            Difference: -₹${detail.difference.toLocaleString('en-IN')}
                        </span>
                    </li><br>`;
            });
            
            warningMessage += `</ul>
                <p style="color: #666; font-size: 14px;">
                    <i class="fas fa-exclamation-triangle" style="color: #ff9800;"></i>
                    Are you sure you want to proceed with these lower prices?
                </p>
            </div>`;
            
            // Show confirmation alert
            const result = await Swal.fire({
                title: 'Confirm Price Changes',
                html: warningMessage,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d32f2f',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Yes, Proceed',
                cancelButtonText: 'Cancel',
                width: 600,
                customClass: {
                    popup: 'custom-swal-popup'
                }
            });
            
            // If user cancels, stop the process
            if (!result.isConfirmed) {
                console.log('User cancelled the operation');
                return;
            }
        }
        
        // 5. Prepare the final request
        const finalRequest = {
            ...updatedRequestData,
            htmlContent: contentRef.current.innerHTML,
            flag: "send"
        };
        
        // console.log('Final request data:', finalRequest);
        
        // 6. Send to server
        const response = await fetch(
            `${CONFIG.MAIN_API}/api/flights/addCotravFlightOptionBooking`,
            {
                method: "POST",
                headers: {
                    // "Content-Type": "application/json",
                    Origin: "*"
                },
                body: JSON.stringify(finalRequest)
            }
        );
        
        const responseData = await response.json();
        
        if (responseData.success === "1") {
            Swal.fire({
                title: "Success!",
                text: "Mail have been sent successfully.",
                // icon: "success",
                confirmButtonText: "OK"
            });
            setShowModal(false);
        } else {
            Swal.fire({
                title: "Error!",
                text: responseData.message || "Failed to update prices.",
                // icon: "error",
                confirmButtonText: "OK"
            });
        }
        
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: "Error!",
            text: "An error occurred while updating prices.",
            // icon: "error",
            confirmButtonText: "OK"
        });
    }
};
// Add a debug function to see what's in the HTML
const debugHtmlContent = (htmlContent) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    console.log('=== DEBUGGING HTML ===');
    
    // Find all price cells
    const priceCells = doc.querySelectorAll('table:has(th[bgcolor="#785eff"]) td:last-child');
    console.log(`Found ${priceCells.length} price cells`);
    
    priceCells.forEach((cell, index) => {
        console.log(`\nPrice Cell ${index}:`);
        console.log('HTML:', cell.innerHTML);
        console.log('Text:', cell.textContent);
        
        // Find spans
        const spans = cell.querySelectorAll('span');
        console.log(`Found ${spans.length} spans in this cell:`);
        
        spans.forEach((span, spanIndex) => {
            console.log(`  Span ${spanIndex}:`, {
                text: span.textContent,
                'data-index': span.getAttribute('data-index'),
                outerHTML: span.outerHTML
            });
        });
    });
    
    // Return original HTML if you want to see it
    return htmlContent;
};

useEffect(() => {
    if (showModal && htmlContent) {
        // First debug the original HTML
        console.log('=== ORIGINAL HTML ===');
        const debugged = debugHtmlContent(htmlContent);
        
        // Then transform it
        const transformed = transformHtmlForEditing(htmlContent);
        
        // Debug the transformed HTML
        console.log('=== TRANSFORMED HTML ===');
        debugHtmlContent(transformed);
        
        // Update state with transformed HTML
        setHtmlContent(transformed);
        
        // Setup formatting after DOM is updated
        setTimeout(() => {
            if (contentRef.current) {
                setupPriceFormatting(contentRef.current);
                
                // Debug what we have in the DOM
                const editableSpans = contentRef.current.querySelectorAll('span[data-index]');
                console.log(`Found ${editableSpans.length} editable price spans in DOM`);
                
                editableSpans.forEach((span, index) => {
                    console.log(`DOM Span ${index}:`, {
                        text: span.textContent,
                        'data-index': span.getAttribute('data-index'),
                        'data-original': span.getAttribute('data-original'),
                        editable: span.contentEditable
                    });
                });
            }
        }, 50);
    }
}, [showModal, htmlContent]);

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
                          <React.Fragment key={value}>
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
                            <React.Fragment key={value}>
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
                            <React.Fragment key={value}>
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
                      <label style={{ marginBottom: "1%", textAlign: "left" }}>
                        Choose Travel Class
                      </label>
                      <div className="select-wrapper1 select-wrapper2">
                        {["Economy/Premium Economy", "Business", "First"].map(
                          (value) => (
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
                            </React.Fragment>
                          )
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
                }}
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
                      {/* <div className='side-block fly-in headingofflights'>
                      Flights <FlightTakeoffTwoTone /> from {inputValue.originAirport ? inputOrigin : fromAirport} to <FlightLandOutlined/>{inputValue.destinationAriport ? inputDestination : ToAirport}
                    </div> */}
                      {/* <div className=" side-block fly-in headingofflights flex flex-col md:flex-row gap-4 w-full max-w-3xl mx-auto">

                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-800">Departure</span>
                          <span className="font-bold text-gray-500 text-sm">
                            {inputValue.originAirport ? inputOrigin : fromAirport}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-500 font-semibold text-base">
                        <span >—</span>
                        <span className="mx-2">✈</span>
                        <span >—</span>
                      </div>


                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-800">Arrival</span>
                          <span className="font-bold text-gray-500 text-sm">
                            {inputValue.destinationAriport ? inputDestination : ToAirport}
                          </span>
                        </div>
                      </div>
                    </div> */}
                      {/* <div className="side-block fly-in headingofflights">
                      <div className="flex">
                        <span className="text-[#785eff] mr-2 w-12">From:</span>
                        <span>
                          {inputValue.originAirport ? inputOrigin : fromAirport}
                        </span>
                      </div>
                      <div className="flex mt-2 ">
                        <span className="text-[#785eff] mr-2 w-12">To:</span>
                        <span>
                          {inputValue.destinationAriport ? inputDestination : ToAirport}
                        </span>
                      </div>
                    </div> */}
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
                                (data) => data?.flight?.segments?.length - 1
                              ).filter((stops) => stops > 0),
                            ])
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
                                    setShowPrices(null);
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
                                setShowPrices(null);
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
                                setShowPrices(null);
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
                                    setShowPrices(null);
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
                                setShowPrices(null);
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
                            <div
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
                            </div>
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
                            sortedFlights.map((response, index) => {
                              const FlightInfo = response?.flight;
                              const depTime = FlightInfo?.depTime || "";
                              const arrTime = FlightInfo?.arrTime || "";
                              // // console.log("Arrival Time", arrTime)
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
                                durationMs / (1000 * 60 * 60)
                              );
                              const durationMinutes = Math.floor(
                                (durationMs % (1000 * 60 * 60)) / (1000 * 60)
                              );
                              const duration = `${durationHours}H ${durationMinutes}M`;

                              //price
                              const segments = FlightInfo.segments;
                              let totalLayoverMinutes = 0;
                              let Totallayover = "";
                              if (segments.length > 1) {
                                for (let i = 0; i < segments.length - 1; i++) {
                                  const arrivalTime = dayjs(
                                    segments[i].Destination.ArrTime
                                  );
                                  const nextDepartureTime = dayjs(
                                    segments[i + 1].Origin.DepTime
                                  );
                                  const layoverMinutes = nextDepartureTime.diff(
                                    arrivalTime,
                                    "minute"
                                  );
                                  totalLayoverMinutes += layoverMinutes;
                                }

                                const totalLayoverDuration = dayjs.duration(
                                  totalLayoverMinutes,
                                  "minutes"
                                );
                                const totalHours = totalLayoverDuration.hours();
                                const totalMinutes =
                                  totalLayoverDuration.minutes();

                                Totallayover = `${
                                  totalHours > 0 ? `${totalHours}h ` : ""
                                }${totalMinutes}m Total Layover`;
                              }

                              //View price sorting
                              // const formattedUapiFares = (
                              //   FlightFares?.uapi_fares || []
                              // ).map((fare) => ({
                              //   type: fare.SupplierFareClass,
                              //   price: parseFloat(fare.TotalPrice),
                              //   from: "Uapi",
                              //   Resultindex: fare.ResultIndex,
                              //   TraceId: fare.trace_id,
                              //   isLCC: fare.isLCC,
                              //   ProviderCode: fare.ProviderCode,
                              // }));
                              // const formattedTboFares = (
                              //   FlightFares?.tbo_fares || []
                              // ).map((fare) => ({
                              //   type: fare.SupplierFareClass || "Regular Fare",
                              //   price: parseFloat(fare.TotalPrice),
                              //   from: "Tbo",
                              //   Resultindex: fare.ResultIndex,
                              //   TraceId: fare.trace_id,
                              //   ProviderCode: fare.ProviderCode,
                              // }));

                              // // Step 3: Combine and remove duplicates
                              // const combinedFares = [
                              //   ...formattedUapiFares,
                              //   ...formattedTboFares,
                              // ];
                              // const seen = new Set();
                              // const uniqueFares = [];

                              // combinedFares.forEach((fare) => {
                              //   uniqueFares.push(fare);
                              //   // }
                              // });
                              // --- VIEW PRICE SORTING ---

                              const formattedUapiFares = (
                                FlightFares?.uapi_fares || []
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
                                FlightFares?.tbo_fares || []
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
                                {}
                              );

                              // STEP 3: Apply rules
                              const uniqueFares = [];

                              Object.keys(grouped).forEach((fareType) => {
                                const fares = grouped[fareType];

                                // --- RULE 1: Corporate → prefer UAPI always ---
                                if (
                                  fareType.toLowerCase().includes("corporate")
                                ) {
                                  const uapiFare = fares.find(
                                    (f) => f.from === "Uapi"
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
                                  a.price < b.price ? a : b
                                );
                                uniqueFares.push(cheapest);
                              });

                              // STEP 4: Sort by price ASC
                              uniqueFares.sort((a, b) => a.price - b.price);

                              //number of days
                              const dep = new Date(depTime);
                              const arr = new Date(arrTime);
                              const depDate = new Date(
                                dep.getFullYear(),
                                dep.getMonth(),
                                dep.getDate()
                              );
                              const arrDate = new Date(
                                arr.getFullYear(),
                                arr.getMonth(),
                                arr.getDate()
                              );
                              const diffInMs =
                                arrDate.getTime() - depDate.getTime();
                              const diffInDays = Math.round(
                                diffInMs / (1000 * 60 * 60 * 24)
                              );
                              const date = new Date(arr);

                              const options = {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              };
                              const formattedDate = date.toLocaleDateString(
                                "en-GB",
                                options
                              );
                              return (
                                <div
                                  key={index}
                                  className={`flight-item fly-in ${
                                    selectedFlightIds.includes(index)
                                      ? "selected-flight"
                                      : ""
                                  }`}
                                >
                                  <div className="flt-i-a flex flex-col">
                                    <div className="flt-i-b ">
                                      <div className="flt-l-b">
                                        <div className="mb-1">
                                          {[
                                            ...new Set(
                                              FlightInfo?.segments?.map(
                                                (segment) =>
                                                  segment.Airline.AirlineLogo
                                              )
                                            ),
                                          ].map((logo) => {
                                            return (
                                              <img
                                                key={logo}
                                                src={`${logo}`}
                                                className="w-9 h-9 inline-block mr-2"
                                              />
                                            );
                                          })}
                                          {/* <img src={FlightInfo?.segments[0]?.Airline.AirlineLogo} alt="Airline Logo" className="w-8 h-8" /> */}
                                          <p className="cardbody_font font-Montserrat mt-1 mb-1">
                                            {[
                                              ...new Set(
                                                FlightInfo?.segments?.map(
                                                  (segment) =>
                                                    segment.Airline.AirlineName
                                                )
                                              ),
                                            ].join(" , ")}
                                          </p>
                                        </div>
                                        <p className=" text-[11px] font-Montserrat mb-1">
                                          {FlightInfo?.segments
                                            ?.map(
                                              (segment) =>
                                                `${segment.Airline.AirlineCode} ${segment.Airline.FlightNumber}`
                                            )
                                            .join(" , ")}
                                        </p>
                                      </div>

                                      <div className="flt-l-c">
                                        <div className="flt-l-cb flight-line">
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
                                          <div className="flight-line-d1"></div>
                                          <div className="flight-line-a mt-7 text-center font-Montserrat">
                                            <div className="stop-badge-container relative group">
                                              <div className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 -translate-x-1/2 z-10">
                                                <div className="bg-white text-black text-[8px] font-Montserrat px-3 py-2 rounded border shadow-md whitespace-nowrap relative">
                                                  {segments.length === 1 ? (
                                                    <span className="text-[8px]">
                                                      This is a direct flight
                                                      with no stops
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
                                                            .Destination.Airport
                                                            .CityName
                                                        }{" "}
                                                        | {Totallayover}
                                                      </p>
                                                    </span>
                                                  )}
                                                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white"></div>
                                                </div>
                                              </div>
                                              {/* <div className="text-sm mx-4">{duration}</div> */}
                                              <div className="flight-line-a">
                                                <span className="text-sm">
                                                  {duration}
                                                </span>
                                                <div className="w-fit mx-auto stop-badge">
                                                  {segments.length === 1 ? (
                                                    <p className=" cursor-pointer leading-tight">
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
                                          <div className="flight-line-d2"></div>
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
                                          <div className="flt-i-price">
                                            ₹{" "}
                                            {Number(response.prices.TotalPrice)}
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {showPrices === index && (
                                      <div className="row selectcontainer  w-full block">
                                        {fareloadingg && (
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
                                        {uniqueFares.map((fare, idx) => {
                                          // const isSelected = selectedFares.some(
                                          //   (f) =>
                                          //     f.index === index &&
                                          //     f.fareType === fare.type
                                          const currentFlight =
                                            sortedFlights[index]?.flight;

                                          const flightId = `${currentFlight?.originAirport?.CityCode}-${currentFlight?.destinationAirport?.CityCode}-${currentFlight?.depTime}-${currentFlight?.arrTime}-${currentFlight?.segments?.[0]?.Airline?.FlightNumber}`;

                                          const isSelected = selectedFares.some(
                                            (f) =>
                                              f.flightId === flightId &&
                                              f.fareType === fare.type
                                          );

                                          return (
                                            <div
                                              className="col-md-3 optionsflights"
                                              key={idx}
                                            >
                                              <div className="optionsflight">
                                                <div className="modal-data cursor-pointer">
                                                  <div className="seelctheader">
                                                    {fare.type}{" "}
                                                    <span className="text-[5px] text-gray-400">
                                                      ({fare.from})
                                                    </span>
                                                    {/* <button className=" ml-1"><i className="fa fa-info-circle" aria-hidden="true" style={{ color: '#785EFF', fontSize: '12px' }} ></i></button> */}
                                                  </div>
                                                  <div className="selectprice">
                                                    ₹ {fare.price}
                                                  </div>
                                                </div>
                                              </div>
                                              {/* {request_type === "book" && ( */}
                                              <div className="buttonbook">
                                                <button
                                                  type="button"
                                                  className="continuebutton"
                                                  style={{
                                                    color: "white",
                                                    backgroundColor: "#785eff",
                                                    border: "none",
                                                    padding: "2%",
                                                    borderRadius: "3px",
                                                    marginRight: "3px",
                                                  }}
                                                  onClick={() =>
                                                    AddClientPrice(
                                                      fare,
                                                      FlightInfo?.segments,
                                                      cabinClass,
                                                      inputValue,
                                                      FlightInfo
                                                    )
                                                  }
                                                >
                                                  Book Now
                                                </button>
                                              </div>
                                              {/* )} */}
                                              {/* {request_type === "search" && (  */}
                                              <button
                                                className="add-btn"
                                                type="button"
                                                title={
                                                  isSelected
                                                    ? "Remove Fare"
                                                    : "Select Fare"
                                                }
                                                onClick={() =>
                                                  handleFareToggle(
                                                    FlightFares?.flight,
                                                    fare,
                                                    index,
                                                    FlightFares?.base_fare
                                                  )
                                                }
                                              >
                                                {isSelected ? "-" : "+"}
                                              </button>
                                              {/* )}  */}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                    <div className="flt-l-c">
                                      {showFlightDetails === index && (
                                        <div
                                          className="flight-details"
                                          style={{
                                            display: "block",
                                            width: "80%",
                                          }}
                                        >
                                          {/* Tabs */}
                                          <Nav className="flight_nav">
                                            <Nav.Item>
                                              <Nav.Link
                                                role="button"
                                                className={`${
                                                  showContent ===
                                                  "flight_details"
                                                    ? "active"
                                                    : ""
                                                }`}
                                                onClick={() =>
                                                  setshowcontent(
                                                    "flight_details"
                                                  )
                                                }
                                              >
                                                FLIGHT DETAIL{" "}
                                              </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                              <Nav.Link
                                                role="button"
                                                className={`${
                                                  showContent === "fare_summary"
                                                    ? "active"
                                                    : ""
                                                }`}
                                                onClick={() =>
                                                  setshowcontent("fare_summary")
                                                }
                                              >
                                                FARE SUMMARY
                                              </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                              <Nav.Link
                                                role="button"
                                                className={`${
                                                  showContent === "date_change"
                                                    ? "active"
                                                    : ""
                                                }`}
                                                onClick={() =>
                                                  setshowcontent("date_change")
                                                }
                                              >
                                                DATE CHANGE
                                              </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                              <Nav.Link
                                                role="button"
                                                className={`${
                                                  showContent === "cancellation"
                                                    ? "active"
                                                    : ""
                                                }`}
                                                onClick={() =>
                                                  setshowcontent("cancellation")
                                                }
                                              >
                                                CANCELLATION
                                              </Nav.Link>
                                            </Nav.Item>
                                          </Nav>

                                          <div>
                                            {showContent ===
                                              "flight_details" && (
                                              <div
                                                className="tabcontent"
                                                style={{ display: "block" }}
                                              >
                                                <div>
                                                  <div>
                                                    <div>
                                                      <div>
                                                        {segments.map(
                                                          (segment, index) => {
                                                            const {
                                                              Airline,
                                                              Origin,
                                                              Destination,
                                                              Equipment,
                                                            } = segment;
                                                            const depTime =
                                                              new Date(
                                                                Origin?.DepTime
                                                              );
                                                            const arrTime =
                                                              new Date(
                                                                Destination?.ArrTime
                                                              );
                                                            // Calculate duration
                                                            const durationMs =
                                                              new Date(
                                                                arrTime.toUTCString()
                                                              ).getTime() -
                                                              new Date(
                                                                depTime.toUTCString()
                                                              ).getTime();
                                                            const durationHours =
                                                              Math.floor(
                                                                durationMs /
                                                                  (1000 *
                                                                    60 *
                                                                    60)
                                                              );
                                                            const durationMinutes =
                                                              Math.floor(
                                                                (durationMs %
                                                                  (1000 *
                                                                    60 *
                                                                    60)) /
                                                                  (1000 * 60)
                                                              );
                                                            const duration = `${durationHours}H ${durationMinutes}M`;

                                                            return (
                                                              <div key={index}>
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
                                                                    Origin?.DepTime
                                                                  )}
                                                                  <span className="equipmentno">
                                                                    {Equipment}
                                                                  </span>
                                                                </div>
                                                                <div className="clear"></div>
                                                                <div className="flight-details-l">
                                                                  <p className="flight-details-b">
                                                                    {
                                                                      Origin
                                                                        ?.Airport
                                                                        ?.CityName
                                                                    }
                                                                  </p>
                                                                  <p className="flight-details-b mb-1">
                                                                    {handleweekdatemonthyear(
                                                                      Origin?.DepTime
                                                                    )}
                                                                  </p>
                                                                  <p className="flight-details-c mb-0">
                                                                    {format(
                                                                      new Date(
                                                                        Origin?.DepTime
                                                                      ),
                                                                      "HH:mm"
                                                                    )}
                                                                  </p>
                                                                  <p className="flight-details-c1 mb-1">
                                                                    {
                                                                      Origin
                                                                        ?.Airport
                                                                        ?.AirportName
                                                                    }
                                                                    {
                                                                      Origin
                                                                        ?.Airline
                                                                        ?.Terminal
                                                                    }
                                                                  </p>
                                                                </div>
                                                                <div className="flight-details-m">
                                                                  <p className="flight-details-e">
                                                                    {duration}
                                                                  </p>
                                                                  <div className="flight-details-e">
                                                                    <hr />
                                                                  </div>
                                                                </div>
                                                                <div className="flight-details-r">
                                                                  <p className="flight-details-b">
                                                                    {
                                                                      Destination
                                                                        ?.Airport
                                                                        ?.CityName
                                                                    }
                                                                  </p>
                                                                  <p className="flight-details-b">
                                                                    {handleweekdatemonthyear(
                                                                      Destination?.ArrTime
                                                                    )}
                                                                  </p>
                                                                  <p className="flight-details-c mb-0">
                                                                    {format(
                                                                      new Date(
                                                                        Destination?.ArrTime
                                                                      ),
                                                                      "HH:mm"
                                                                    )}
                                                                  </p>
                                                                  <p className="flight-details-c1 mb-1">
                                                                    {
                                                                      Destination
                                                                        ?.Airport
                                                                        ?.AirportName
                                                                    }
                                                                    {
                                                                      Destination
                                                                        ?.Airport
                                                                        ?.Terminal
                                                                    }
                                                                  </p>
                                                                </div>
                                                                <div className="clear"></div>
                                                              </div>
                                                            );
                                                          }
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                            {showContent === "fare_summary" && (
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
                                                    {response.prices.TotalPrice}
                                                  </p>
                                                  <p className="flight-details-c mb-0">
                                                    ₹ {response.prices.BaseFare}
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
                                      )}
                                    </div>
                                  </div>

                                  <div className="flt-i-c">
                                    <div className="flt-i-padding">
                                      <button
                                        className="srch-btn"
                                        style={{ borderRadius: "18px" }}
                                        // onClick={() => setShowPrices(showPrices === index ? null : index)}
                                        onClick={() => {
                                          Getfares(response);
                                          setShowPrices(
                                            showPrices === index ? null : index
                                          );
                                          setFlightFare([]);
                                        }}
                                      >
                                        <span className="text-[12px]">
                                          View Prices
                                        </span>
                                      </button>
                                    </div>
                                    <div className="flight-line-b">
                                      <b
                                        onClick={() =>
                                          setShowFlightDetails(
                                            showFlightDetails === index
                                              ? null
                                              : index
                                          )
                                        }
                                      >
                                        Show Flight Details
                                      </b>
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
                                (data) => data?.flight?.segments?.length - 1
                              ).filter((stops) => stops > 0),
                            ])
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
                                    setShowPrices(null);
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
                                setShowPrices(null);
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
                                setShowPrices(null);
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
                                    setShowPrices(null);
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
                                setShowPrices(null);
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
                                (data) => data?.flight?.segments?.length - 1
                              ).filter((stops) => stops > 0),
                            ])
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
                                  checked={returnselectedStops.has(stopCount)}
                                  onChange={() => {
                                    toggleReturnStop(stopCount);
                                    setShowPrices(null);
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
                                setShowPrices(null);
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
                                setShowPrices(null);
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
                                    airline.name
                                  )}
                                  onChange={() => {
                                    toggleReturnAirline(airline.name);
                                    setShowPrices(null);
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
                                setShowPrices(null);
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
                                    : extractDate(DepartureDate)
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
                              <div
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
                              </div>
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
                                  durationMs / (1000 * 60 * 60)
                                );
                                const durationMinutes = Math.floor(
                                  (durationMs % (1000 * 60 * 60)) / (1000 * 60)
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
                                      segments[i].Destination.ArrTime
                                    );
                                    const nextDepartureTime = dayjs(
                                      segments[i + 1].Origin.DepTime
                                    );
                                    const layoverMinutes =
                                      nextDepartureTime.diff(
                                        arrivalTime,
                                        "minute"
                                      );
                                    totalLayoverMinutes += layoverMinutes;
                                  }

                                  const totalLayoverDuration = dayjs.duration(
                                    totalLayoverMinutes,
                                    "minutes"
                                  );
                                  const totalHours =
                                    totalLayoverDuration.hours();
                                  const totalMinutes =
                                    totalLayoverDuration.minutes();

                                  Totallayover = `${
                                    totalHours > 0 ? `${totalHours}h ` : ""
                                  }${totalMinutes}m Total Layover`;
                                }

                                //View price sorting
                                // const formattedUapiFares = (
                                //   FlightFares?.uapi_fares || []
                                // ).map((fare) => ({
                                //   type: fare.SupplierFareClass,
                                //   price: parseFloat(fare.TotalPrice),
                                //   from: "Uapi",
                                //   Resultindex: fare.ResultIndex,
                                //   TraceId: fare.trace_id,
                                //   isLCC: fare.isLCC,
                                //   ProviderCode: fare.ProviderCode,
                                // }));
                                // const formattedTboFares = (
                                //   FlightFares?.tbo_fares || []
                                // ).map((fare) => ({
                                //   type:
                                //     fare.SupplierFareClass || "Regular Fare",
                                //   price: parseFloat(fare.TotalPrice),
                                //   from: "Tbo",
                                //   Resultindex: fare.ResultIndex,
                                //   TraceId: fare.trace_id,
                                //   ProviderCode: fare.ProviderCode,
                                // }));

                                // // Step 3: Combine and remove duplicates
                                // const combinedFares = [
                                //   ...formattedUapiFares,
                                //   ...formattedTboFares,
                                // ];
                                // const seen = new Set();
                                // const uniqueFares = [];

                                // combinedFares.forEach((fare) => {
                                //   uniqueFares.push(fare);
                                //   // }
                                // });
                                // --- VIEW PRICE SORTING ---

                                const formattedUapiFares = (
                                  FlightFares?.uapi_fares || []
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
                                  FlightFares?.tbo_fares || []
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
                                  {}
                                );

                                // STEP 3: Apply rules
                                const uniqueFares = [];

                                Object.keys(grouped).forEach((fareType) => {
                                  const fares = grouped[fareType];

                                  // --- RULE 1: Corporate → prefer UAPI always ---
                                  if (
                                    fareType.toLowerCase().includes("corporate")
                                  ) {
                                    const uapiFare = fares.find(
                                      (f) => f.from === "Uapi"
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
                                    a.price < b.price ? a : b
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
                                  dep.getDate()
                                );
                                const arrDate = new Date(
                                  arr.getFullYear(),
                                  arr.getMonth(),
                                  arr.getDate()
                                );
                                const diffInMs =
                                  arrDate.getTime() - depDate.getTime();
                                const diffInDays = Math.round(
                                  diffInMs / (1000 * 60 * 60 * 24)
                                );
                                const date = new Date(arr);

                                const options = {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                };
                                const formattedDate = date.toLocaleDateString(
                                  "en-GB",
                                  options
                                );
                                return (
                                  <div
                                    key={index}
                                    className={`flight-item fly-in ${
                                      selectedFlightIds.includes(index)
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
                                                    segment.Airline.AirlineLogo
                                                )
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
                                                        .AirlineName
                                                  )
                                                ),
                                              ].join(" , ")}
                                            </p>

                                            <p className="text-[11px] font-Montserrat ">
                                              {FlightInfo?.segments
                                                ?.map(
                                                  (segment) =>
                                                    `${segment.Airline.AirlineCode} ${segment.Airline.FlightNumber}`
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
                                                  response.prices.TotalPrice
                                                )}
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
                                                      : index
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
                                                    Getfares(response);
                                                    setShowPrices(
                                                      showPrices === index
                                                        ? null
                                                        : index
                                                    );
                                                    setFlightFare([]);
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
                                        {showPrices === index && (
                                          <div className="row selectcontainer w-full block mt-4 pl-3">
                                            {fareloadingg && (
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
                                            {/* {uniqueFares.map((fare, idx) => {
                                              const isSelected =
                                                selectedFares.some(
                                                  (f) =>
                                                    f.index === index &&
                                                    f.fareType === fare.type
                                                ); */}
                                            {uniqueFares.map((fare, idx) => {
                                              // const isSelected = selectedFares.some(
                                              //   (f) =>
                                              //     f.index === index &&
                                              //     f.fareType === fare.type
                                              const currentFlight =
                                                sortedFlights[index]?.flight;

                                              const flightId = `${currentFlight?.originAirport?.CityCode}-${currentFlight?.destinationAirport?.CityCode}-${currentFlight?.depTime}-${currentFlight?.arrTime}-${currentFlight?.segments?.[0]?.Airline?.FlightNumber}`;

                                              const isSelected =
                                                selectedFares.some(
                                                  (f) =>
                                                    f.flightId === flightId &&
                                                    f.fareType === fare.type
                                                );

                                              return (
                                                <div
                                                  className=" priceoption optionsflights "
                                                  key={idx}
                                                >
                                                  <div className="pricecontent optionsflight">
                                                    <div className="modal-data cursor-pointer">
                                                      <div className="pricename">
                                                        {fare.type}{" "}
                                                        <span className="text-[5px] text-gray-400">
                                                          ({fare.from})
                                                        </span>
                                                      </div>
                                                      <div className="selectprice">
                                                        ₹ {fare.price}
                                                      </div>
                                                    </div>
                                                  </div>
                                                  {/* {request_type === "book" && ( */}
                                                  <div className="buttonbook">
                                                    <button
                                                      type="button"
                                                      className="continuebutton text-white font-Montserrat text-xs"
                                                      style={{
                                                        color: "white",
                                                        backgroundColor:
                                                          "#785eff",
                                                        border: "none",
                                                        padding: "2%",
                                                        borderRadius: "3px",
                                                        marginRight: "3px",
                                                      }}
                                                      onClick={() =>
                                                        handleSingleSelect(
                                                          FlightFares?.flight,
                                                          fare,
                                                          index,
                                                          FlightFares?.base_fare,
                                                          "Onward"
                                                        )
                                                      }
                                                    >
                                                      Book Now
                                                    </button>
                                                  </div>
                                                  {/* )} */}
                                                  {/* {request_type == "search" && ( */}
                                                  <button
                                                    className="Pricebutton-add"
                                                    type="button"
                                                    title={
                                                      isSelected
                                                        ? "Remove Fare"
                                                        : "Select Fare"
                                                    }
                                                    onClick={() =>
                                                      handleFareToggle(
                                                        FlightFares?.flight,
                                                        fare,
                                                        index,
                                                        FlightFares?.base_fare
                                                      )
                                                    }
                                                  >
                                                    {isSelected ? "-" : "+"}
                                                  </button>
                                                  {/* )} */}
                                                </div>
                                              );
                                            })}
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
                                                          "flight_details"
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
                                                          "fare_summary"
                                                        )
                                                      }
                                                    >
                                                      FARE SUMMARY
                                                    </Nav.Link>
                                                  </Nav.Item>
                                                  <Nav.Item>
                                                    <Nav.Link
                                                      role="button"
                                                      className={` ${
                                                        showContent ===
                                                        "date_change"
                                                          ? "active"
                                                          : ""
                                                      }`}
                                                      onClick={() =>
                                                        setshowcontent(
                                                          "date_change"
                                                        )
                                                      }
                                                    >
                                                      DATE CHANGE
                                                    </Nav.Link>
                                                  </Nav.Item>
                                                  <Nav.Item>
                                                    <Nav.Link
                                                      role="button"
                                                      className={` ${
                                                        showContent ===
                                                        "cancellation"
                                                          ? "active"
                                                          : ""
                                                      }`}
                                                      onClick={() =>
                                                        setshowcontent(
                                                          "cancellation"
                                                        )
                                                      }
                                                    >
                                                      CANCELLATION
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
                                                                  index
                                                                ) => {
                                                                  const {
                                                                    Airline,
                                                                    Origin,
                                                                    Destination,
                                                                    Equipment,
                                                                  } = segment;
                                                                  const depTime =
                                                                    new Date(
                                                                      Origin?.DepTime
                                                                    );
                                                                  const arrTime =
                                                                    new Date(
                                                                      Destination?.ArrTime
                                                                    );
                                                                  // Calculate duration
                                                                  const durationMs =
                                                                    new Date(
                                                                      arrTime.toUTCString()
                                                                    ).getTime() -
                                                                    new Date(
                                                                      depTime.toUTCString()
                                                                    ).getTime();
                                                                  const durationHours =
                                                                    Math.floor(
                                                                      durationMs /
                                                                        (1000 *
                                                                          60 *
                                                                          60)
                                                                    );
                                                                  const durationMinutes =
                                                                    Math.floor(
                                                                      (durationMs %
                                                                        (1000 *
                                                                          60 *
                                                                          60)) /
                                                                        (1000 *
                                                                          60)
                                                                    );
                                                                  const duration = `${durationHours}H ${durationMinutes}M`;

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
                                                                          Origin?.DepTime
                                                                        )}
                                                                        <span className="equipmentno">
                                                                          {
                                                                            Equipment
                                                                          }
                                                                        </span>
                                                                      </div>
                                                                      <div className="clear"></div>
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
                                                                              Origin?.DepTime
                                                                            )}
                                                                          </p>
                                                                          <p className="flight-details-c mb-0">
                                                                            {format(
                                                                              new Date(
                                                                                Origin?.DepTime
                                                                              ),
                                                                              "HH:mm"
                                                                            )}
                                                                          </p>
                                                                          <p className="flight-details-c1 mb-1">
                                                                            {
                                                                              Origin
                                                                                ?.Airport
                                                                                ?.AirportName
                                                                            }
                                                                            {
                                                                              Origin
                                                                                ?.Airline
                                                                                ?.Terminal
                                                                            }
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
                                                                              Destination?.ArrTime
                                                                            )}
                                                                          </p>
                                                                          <p className="flight-details-c mb-0">
                                                                            {format(
                                                                              new Date(
                                                                                Destination?.ArrTime
                                                                              ),
                                                                              "HH:mm"
                                                                            )}
                                                                          </p>
                                                                          <p className="flight-details-c1 mb-1">
                                                                            {
                                                                              Destination
                                                                                ?.Airport
                                                                                ?.AirportName
                                                                            }
                                                                            {
                                                                              Destination
                                                                                ?.Airport
                                                                                ?.Terminal
                                                                            }
                                                                          </p>
                                                                        </div>
                                                                      </div>
                                                                      <div className="clear"></div>
                                                                    </div>
                                                                  );
                                                                }
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
                                      : extractDate(ReturnDate)
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
                                      {sortOrder === "asc" ? "↓" : "↑"}
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
                                      {sortOrder === "asc" ? "↓" : "↑"}
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
                                      {sortOrder === "asc" ? "↓" : "↑"}
                                    </span>
                                  )}
                                </div>
                                <div
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
                                      {sortOrder === "asc" ? "↓" : "↑"}
                                    </span>
                                  )}
                                </div>
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
                                    durationMs / (1000 * 60 * 60)
                                  );
                                  const durationMinutes = Math.floor(
                                    (durationMs % (1000 * 60 * 60)) /
                                      (1000 * 60)
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
                                        segments[i].Destination.ArrTime
                                      );
                                      const nextDepartureTime = dayjs(
                                        segments[i + 1].Origin.DepTime
                                      );
                                      const layoverMinutes =
                                        nextDepartureTime.diff(
                                          arrivalTime,
                                          "minute"
                                        );
                                      totalLayoverMinutes += layoverMinutes;
                                    }

                                    const totalLayoverDuration = dayjs.duration(
                                      totalLayoverMinutes,
                                      "minutes"
                                    );
                                    const totalHours =
                                      totalLayoverDuration.hours();
                                    const totalMinutes =
                                      totalLayoverDuration.minutes();

                                    Totallayover = `${
                                      totalHours > 0 ? `${totalHours}h ` : ""
                                    }${totalMinutes}m Total Layover`;
                                  }

                                  //View price sorting
                                  // const formattedUapiFares = (
                                  //   ReturnFlightFares?.uapi_fares || []
                                  // ).map((fare) => ({
                                  //   type: fare.SupplierFareClass,
                                  //   price: parseFloat(fare.TotalPrice),
                                  //   from: "Uapi",
                                  //   Resultindex: fare.ResultIndex,
                                  //   TraceId: fare.trace_id,
                                  //   isLCC: fare.isLCC,
                                  //   ProviderCode: fare.ProviderCode,
                                  // }));
                                  // const formattedTboFares = (
                                  //   ReturnFlightFares?.tbo_fares || []
                                  // ).map((fare) => ({
                                  //   type:
                                  //     fare.SupplierFareClass || "Regular Fare",
                                  //   price: parseFloat(fare.TotalPrice),
                                  //   from: "Tbo",
                                  //   Resultindex: fare.ResultIndex,
                                  //   TraceId: fare.trace_id,
                                  //   ProviderCode: fare.ProviderCode,
                                  // }));

                                  // // Step 3: Combine and remove duplicates
                                  // const combinedFares = [
                                  //   ...formattedUapiFares,
                                  //   ...formattedTboFares,
                                  // ];
                                  // const seen = new Set();
                                  // const uniqueFares = [];

                                  // combinedFares.forEach((fare) => {
                                  //   uniqueFares.push(fare);
                                  //   // }
                                  // });
                                  // --- VIEW PRICE SORTING ---

                                  const formattedUapiFares = (
                                    ReturnFlightFares?.uapi_fares || []
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
                                    ReturnFlightFares?.tbo_fares || []
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
                                    {}
                                  );

                                  // STEP 3: Apply rules
                                  const uniqueFares = [];

                                  Object.keys(grouped).forEach((fareType) => {
                                    const fares = grouped[fareType];

                                    // --- RULE 1: Corporate → prefer UAPI always ---
                                    if (
                                      fareType
                                        .toLowerCase()
                                        .includes("corporate")
                                    ) {
                                      const uapiFare = fares.find(
                                        (f) => f.from === "Uapi"
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
                                      a.price < b.price ? a : b
                                    );
                                    uniqueFares.push(cheapest);
                                  });

                                  // STEP 4: Sort by price ASC
                                  uniqueFares.sort((a, b) => a.price - b.price);

                                  //number of days
                                  const dep = new Date(depTime);
                                  const arr = new Date(arrTime);
                                  const depDate = new Date(
                                    dep.getFullYear(),
                                    dep.getMonth(),
                                    dep.getDate()
                                  );
                                  const arrDate = new Date(
                                    arr.getFullYear(),
                                    arr.getMonth(),
                                    arr.getDate()
                                  );
                                  const diffInMs =
                                    arrDate.getTime() - depDate.getTime();
                                  const diffInDays = Math.round(
                                    diffInMs / (1000 * 60 * 60 * 24)
                                  );
                                  const date = new Date(arr);

                                  const options = {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  };
                                  const formattedDate = date.toLocaleDateString(
                                    "en-GB",
                                    options
                                  );
                                  return (
                                    <div
                                      key={index}
                                      className={`flight-item fly-in ${
                                        selectedReturnFlightIds.includes(index)
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
                                                      segment.Airline
                                                        .AirlineLogo
                                                  )
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
                                                          .AirlineName
                                                    )
                                                  ),
                                                ].join(" , ")}
                                              </p>

                                              <p className="text-[11px] font-Montserrat ">
                                                {FlightInfo?.segments
                                                  ?.map(
                                                    (segment) =>
                                                      `${segment.Airline.AirlineCode} ${segment.Airline.FlightNumber}`
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
                                                    response.prices.TotalPrice
                                                  )}
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
                                                      showFlightDetails ===
                                                        index
                                                        ? null
                                                        : index
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
                                                      GetreturnFares(response);
                                                      setShowReturnPrices(
                                                        showReturnPrices ===
                                                          index
                                                          ? null
                                                          : index
                                                      );
                                                      setReturnFlightFare([]);
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
                                          {showReturnPrices === index && (
                                            <div className="row selectcontainer w-full block mt-4 pl-3">
                                              {Returnfareloadingg && (
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
                                                      Retrieving return flight
                                                      fares. Please wait a
                                                      moment.
                                                    </p>
                                                  </div>
                                                </div>
                                              )}

                                              {uniqueFares.map((fare, idx) => {
                                                // const isSelected = selectedFares.some(
                                                //   (f) =>
                                                //     f.index === index &&
                                                //     f.fareType === fare.type
                                                const currentFlight =
                                                  sortedReturnFlights[index]
                                                    ?.flight;

                                                const flightId = `${currentFlight?.originAirport?.CityCode}-${currentFlight?.destinationAirport?.CityCode}-${currentFlight?.depTime}-${currentFlight?.arrTime}-${currentFlight?.segments?.[0]?.Airline?.FlightNumber}`;

                                                const isSelected =
                                                  selectedReturnFares.some(
                                                    (f) =>
                                                      f.flightId === flightId &&
                                                      f.fareType === fare.type
                                                  );

                                                return (
                                                  <div
                                                    className=" priceoption optionsflights "
                                                    key={idx}
                                                  >
                                                    <div className="optionsflight pricecontent">
                                                      <div className="modal-data cursor-pointer">
                                                        <div className="pricename">
                                                          {fare.type}{" "}
                                                          <span className="text-[5px] text-gray-400">
                                                            ({fare.from})
                                                          </span>
                                                          {/* <button className=" ml-1"><i className="fa fa-info-circle" aria-hidden="true" style={{ color: '#785EFF', fontSize: '12px' }} ></i></button> */}
                                                        </div>
                                                        <div className="selectprice">
                                                          ₹ {fare.price}
                                                        </div>
                                                      </div>
                                                    </div>
                                                    {/* {request_type ===
                                                      "book" && ( */}
                                                    <div className="buttonbook">
                                                      <button
                                                        type="button"
                                                        className="continuebutton text-white font-Montserrat text-xs"
                                                        style={{
                                                          color: "white",
                                                          backgroundColor:
                                                            "#785eff",
                                                          border: "none",
                                                          padding: "2%",
                                                          borderRadius: "3px",
                                                          marginRight: "3px",
                                                        }}
                                                        onClick={() =>
                                                          handleSingleSelect(
                                                            ReturnFlightFares?.flight,
                                                            fare,
                                                            index,
                                                            ReturnFlightFares?.base_fare,
                                                            "Return"
                                                          )
                                                        }
                                                      >
                                                        Book Now
                                                      </button>
                                                    </div>
                                                    {/* )} */}
                                                    {/* {request_type === "book" && (
                                                    <div className='buttonselect'>
                                                      <button type='button' className="SelectPrice"  >
                                                        
                                                      </button>
                                                    </div>
                                                    )} */}
                                                    {/* {request_type ==
                                                      "search" && ( */}
                                                    <button
                                                      className="Pricebutton-add"
                                                      type="button"
                                                      title={
                                                        isSelected
                                                          ? "Remove Fare"
                                                          : "Select Fare"
                                                      }
                                                      onClick={() =>
                                                        handleReturnFareToggle(
                                                          ReturnFlightFares?.flight,
                                                          fare,
                                                          index,
                                                          ReturnFlightFares?.base_fare
                                                        )
                                                      }
                                                    >
                                                      {isSelected ? "-" : "+"}
                                                    </button>
                                                    {/* )} */}
                                                  </div>
                                                );
                                              })}
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
                                                            "flight_details"
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
                                                            "fare_summary"
                                                          )
                                                        }
                                                      >
                                                        FARE SUMMARY
                                                      </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item>
                                                      <Nav.Link
                                                        role="button"
                                                        className={` ${
                                                          showContent ===
                                                          "date_change"
                                                            ? "active"
                                                            : ""
                                                        }`}
                                                        onClick={() =>
                                                          setshowcontent(
                                                            "date_change"
                                                          )
                                                        }
                                                      >
                                                        DATE CHANGE
                                                      </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item>
                                                      <Nav.Link
                                                        role="button"
                                                        className={` ${
                                                          showContent ===
                                                          "cancellation"
                                                            ? "active"
                                                            : ""
                                                        }`}
                                                        onClick={() =>
                                                          setshowcontent(
                                                            "cancellation"
                                                          )
                                                        }
                                                      >
                                                        CANCELLATION
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
                                                                    index
                                                                  ) => {
                                                                    const {
                                                                      Airline,
                                                                      Origin,
                                                                      Destination,
                                                                      Equipment,
                                                                    } = segment;
                                                                    const depTime =
                                                                      new Date(
                                                                        Origin?.DepTime
                                                                      );
                                                                    const arrTime =
                                                                      new Date(
                                                                        Destination?.ArrTime
                                                                      );
                                                                    // Calculate duration
                                                                    const durationMs =
                                                                      new Date(
                                                                        arrTime.toUTCString()
                                                                      ).getTime() -
                                                                      new Date(
                                                                        depTime.toUTCString()
                                                                      ).getTime();
                                                                    const durationHours =
                                                                      Math.floor(
                                                                        durationMs /
                                                                          (1000 *
                                                                            60 *
                                                                            60)
                                                                      );
                                                                    const durationMinutes =
                                                                      Math.floor(
                                                                        (durationMs %
                                                                          (1000 *
                                                                            60 *
                                                                            60)) /
                                                                          (1000 *
                                                                            60)
                                                                      );
                                                                    const duration = `${durationHours}H ${durationMinutes}M`;

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
                                                                            Origin?.DepTime
                                                                          )}
                                                                          <span className="equipmentno">
                                                                            {
                                                                              Equipment
                                                                            }
                                                                          </span>
                                                                        </div>
                                                                        <div className="clear"></div>
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
                                                                                Origin?.DepTime
                                                                              )}
                                                                            </p>
                                                                            <p className="flight-details-c mb-0">
                                                                              {format(
                                                                                new Date(
                                                                                  Origin?.DepTime
                                                                                ),
                                                                                "HH:mm"
                                                                              )}
                                                                            </p>
                                                                            <p className="flight-details-c1 mb-1">
                                                                              {
                                                                                Origin
                                                                                  ?.Airport
                                                                                  ?.AirportName
                                                                              }
                                                                              {
                                                                                Origin
                                                                                  ?.Airline
                                                                                  ?.Terminal
                                                                              }
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
                                                                                Destination?.ArrTime
                                                                              )}
                                                                            </p>
                                                                            <p className="flight-details-c mb-0">
                                                                              {format(
                                                                                new Date(
                                                                                  Destination?.ArrTime
                                                                                ),
                                                                                "HH:mm"
                                                                              )}
                                                                            </p>
                                                                            <p className="flight-details-c1 mb-1">
                                                                              {
                                                                                Destination
                                                                                  ?.Airport
                                                                                  ?.AirportName
                                                                              }
                                                                              {
                                                                                Destination
                                                                                  ?.Airport
                                                                                  ?.Terminal
                                                                              }
                                                                            </p>
                                                                          </div>
                                                                        </div>
                                                                        <div className="clear"></div>
                                                                      </div>
                                                                    );
                                                                  }
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
                {/* 🟩 Onward Flights */}
                {selectedFlightoption.length > 0 && (
                  <div className="mb-3 border-b pb-2">
                    <h4 className="font-semibold text-[13px] mb-2">
                      Onward Flights
                    </h4>
                    {/* {Object.entries(groupedFlights).map(
                      ([flightIndex, data]) => {
                        const Airline = data.flight?.segments[0]?.Airline;
                        const Origin = data.flight?.segments[0]?.Origin;
                        const Destination =
                          data.flight?.segments[0]?.Destination;

                        return (
                          <div
                            key={flightIndex}
                            className="selected-flight-list"
                          >
                            <div className="flight-item p-1 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <img
                                  src={Airline?.AirlineLogo}
                                  className="flight-logo w-8 h-8"
                                />
                                <div className="flight-detailss flex flex-col">
                                  <span className="flight-airline text-[12px] font-medium">
                                    {Airline?.AirlineName}{" "}
                                    {Airline?.FlightNumber}
                                  </span>
                                  <span className="flight-time text-[11px] text-gray-600">
                                    {new Date(
                                      Origin?.DepTime
                                    ).toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}{" "}
                                    -{" "}
                                    {new Date(
                                      Destination?.ArrTime
                                    ).toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}
                                  </span>
                                </div>
                              </div>

                              
                              <div className="flight-price">
                                {data.fares.map((fare, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between items-center mb-1 mt-1"
                                  >
                                    <div className="flex flex-col">
                                      <span className="text-[12px] font-bold">
                                        ₹ {fare?.price}
                                      </span>
                                      <span className="text-[10px] text-gray-500">
                                        {fare?.type}
                                      </span>
                                    </div>
                                    <button
                                      className="remove-btn text-red-500 text-lg ml-2"
                                      onClick={() =>
                                        handleRemoveFare(flightIndex, fare.type)
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
                      }
                    )} */}
                    {Object.entries(groupedFlights).map(([flightId, data]) => {
                      // Get flight info from stored flightData
                      const flightInfo = data.flightData;
                      const Airline = flightInfo?.segments?.[0]?.Airline;
                      const Origin = flightInfo?.segments?.[0]?.Origin;
                      const Destination =
                        flightInfo?.segments?.[0]?.Destination;

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
                                <span className="flight-airline text-[12px] font-medium">
                                  {Airline?.AirlineName} {Airline?.FlightNumber}
                                </span>
                                <span className="flight-time text-[11px] text-gray-600">
                                  {new Date(Origin?.DepTime).toLocaleTimeString(
                                    "en-US",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    }
                                  )}{" "}
                                  -{" "}
                                  {new Date(
                                    Destination?.ArrTime
                                  ).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </span>
                              </div>
                            </div>

                            {/* 💰 Fares */}
                            <div className="flight-price">
                              {data.fares.map((fare, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between items-center mb-1 mt-1"
                                >
                                  <div className="flex flex-col">
                                    <span className="text-[12px] font-bold">
                                      ₹ {fare?.price}
                                    </span>
                                    <span className="text-[10px] text-gray-500">
                                      {fare?.type}
                                    </span>
                                  </div>
                                  <button
                                    className="remove-btn text-red-500 text-lg ml-2"
                                    onClick={
                                      () =>
                                        handleRemoveFare(flightId, fare.type) // Pass flightId instead of index
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

                {/* 🟦 Return Flights */}
                {selectedReturnFlightoption.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-[13px] mb-2">
                      Return Flights
                    </h4>
                    {Object.entries(groupedReturnFlights).map(
                      ([flightId, data]) => {
                        // Use flightId here
                        const flightInfo = data.flightData;
                        const Airline = flightInfo?.segments?.[0]?.Airline;
                        const Origin = flightInfo?.segments?.[0]?.Origin;
                        const Destination =
                          flightInfo?.segments?.[0]?.Destination;

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
                                  <span className="flight-airline text-[12px] font-medium">
                                    {Airline?.AirlineName}{" "}
                                    {Airline?.FlightNumber}
                                  </span>
                                  <span className="flight-time text-[11px] text-gray-600">
                                    {new Date(
                                      Origin?.DepTime
                                    ).toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}{" "}
                                    -{" "}
                                    {new Date(
                                      Destination?.ArrTime
                                    ).toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}
                                  </span>
                                </div>
                              </div>

                              {/* 💰 Fares */}
                              <div className="flight-price">
                                {data.fares.map((fare, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between items-center mb-1 mt-1"
                                  >
                                    <div className="flex flex-col">
                                      <span className="text-[12px] font-bold">
                                        ₹ {fare?.price}
                                      </span>
                                      <span className="text-[10px] text-gray-500">
                                        {fare?.type}
                                      </span>
                                    </div>
                                    <button
                                      className="remove-btn text-red-500 text-lg ml-2"
                                      onClick={
                                        () =>
                                          handleRemoveReturnFare(
                                            flightId,
                                            fare.type
                                          ) // Pass flightId
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
                      }
                    )}
                  </div>
                )}
              </div>

              {/* 🟨 Share Button */}
              <div className="share-button-container mt-3 text-center">
                <button className="share-btn" onClick={modalopen}>
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
                                  selectedFareforbooking.Onward.flight.depTime
                                ),
                                "HH:mm"
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
                                  selectedFareforbooking.Onward.flight.arrTime
                                ),
                                "HH:mm"
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
                                  selectedFareforbooking.Return.flight.depTime
                                ),
                                "HH:mm"
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
                                  selectedFareforbooking.Return.flight.arrTime
                                ),
                                "HH:mm"
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
                    onClick={() => {
                      // Create booking payload with the correct structure
                      setBookingPayload({
                        isRoundTrip: true,
                        onwardFare: selectedFareforbooking.Onward.fare,
                        onwardFlight: selectedFareforbooking.Onward.flight,
                        onwardSegments:
                          selectedFareforbooking.Onward.flight.segments,
                        returnFare: selectedFareforbooking.Return?.fare,
                        returnFlight: selectedFareforbooking.Return?.flight,
                        returnSegments:
                          selectedFareforbooking.Return?.flight?.segments,
                        cabinClass: cabinClass,
                        inputValue: inputValue,
                        totalPrice:
                          (selectedFareforbooking.Onward.fare.price || 0) +
                          (selectedFareforbooking.Return?.fare?.price || 0),
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
    <Modal.Title id="modal-title" className="text-lg font-bold text-gray-800">
      Client Final Price
      {bookingPayload?.isRoundTrip && bookingPayload?.returnFlight 
        ? " - Round Trip" 
        : bookingPayload?.isRoundTrip 
          ? " - Departure" 
          : ""}
    </Modal.Title>
    <button
      className="text-gray-400 hover:text-gray-600 text-xl"
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
              {bookingPayload?.returnFlight ? "Departure Flight" : "Selected Flight"}
            </div>
          )}
          <div className="border rounded-lg p-4 bg-white mb-3">
            <div className="flex items-center justify-between mb-3">
              {/* Airline */}
              <div className="flex items-center gap-3 w-[20%]">
                {bookingPayload.onwardFlight.segments?.[0]?.Airline?.AirlineLogo && (
                  <img
                    src={bookingPayload.onwardFlight.segments[0].Airline.AirlineLogo}
                    alt="Airline"
                    className="w-8 h-8 object-contain"
                  />
                )}
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    {bookingPayload.onwardFlight.segments?.[0]?.Airline?.AirlineName || "Flight"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {bookingPayload.onwardFlight.segments?.map(
                      (segment) => 
                        `${segment.Airline.AirlineCode} ${segment.Airline.FlightNumber}`
                    ).join(" , ")}
                  </div>
                </div>
              </div>

              {/* Departure */}
              <div className="text-center w-[15%]">
                <div className="text-sm font-bold">
                  {bookingPayload.onwardFlight.depTime 
                    ? format(new Date(bookingPayload.onwardFlight.depTime), "HH:mm")
                    : "--:--"}
                </div>
                <div className="text-md text-gray-700">
                  {bookingPayload.onwardFlight.originAirport?.CityName || "Origin"}
                </div>
                <div className="text-xs text-gray-400">
                  {bookingPayload.onwardFlight.originAirport?.AirportName || ""}
                  {bookingPayload.onwardFlight.originAirport?.Terminal && 
                    ` (T${bookingPayload.onwardFlight.originAirport.Terminal})`}
                </div>
              </div>

              {/* Duration + line */}
              <div className="flex flex-col items-center w-[30%]">
                <div className="text-sm font-medium text-gray-700 mb-1">
                  {calculateDurationFlight(bookingPayload.onwardSegments)}
                </div>
                <div className="flex items-center w-full flight-line-d2 mt-0 mr-0 ">
                
                </div>
                <div className="text-xs text-[#785ef7] mt-1">
                  {bookingPayload.onwardSegments?.length === 1 ? (
                    <p className="cursor-pointer leading-tight">Non-stop</p>
                  ) : (
                    <p className="cursor-pointer leading-tight">
                      {bookingPayload.onwardSegments?.length - 1 || 0} stop
                      {bookingPayload.onwardSegments?.length - 1 > 1 ? "s" : ""} via{" "}
                      {bookingPayload.onwardSegments?.[0]?.Destination?.Airport?.CityName || "City"}
                    </p>
                  )}
                </div>
              </div>

              {/* Arrival */}
              <div className="text-center w-[15%]">
                <div className="text-sm font-bold">
                  {bookingPayload.onwardFlight.arrTime 
                    ? format(new Date(bookingPayload.onwardFlight.arrTime), "HH:mm")
                    : "--:--"}
                </div>
                <div className="text-md text-gray-700">
                  {bookingPayload.onwardFlight.destinationAirport?.CityName || "Destination"}
                </div>
                <div className="text-xs text-gray-400">
                  {bookingPayload.onwardFlight.destinationAirport?.AirportName || ""}
                  {bookingPayload.onwardFlight.destinationAirport?.Terminal && 
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
            const minPrice = bookingPayload.onwardFare?.price || 0;
            if (value && Number(value) < minPrice) {
              setPriceErrorOnward(`Must be at least ₹${minPrice}`);
            } else {
              setPriceErrorOnward("");
            }
          }}
          placeholder="Enter price..."
          className={`pl-4 w-full p-2 border-2 rounded-lg text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#785ef7] focus:border-[#785ef7] transition-all duration-200 ${
            priceErrorOnward 
              ? "border-red-500 bg-red-50 text-red-700" 
              : ClientPriceOnward && !priceErrorOnward && Number(ClientPriceOnward) >= (bookingPayload.onwardFare?.price || 0)
              ? "border-green-500 bg-green-50 text-green-700"
              : "border-gray-300 bg-white text-gray-800 hover:border-gray-400"
          }`}
          min={bookingPayload.onwardFare?.price || 0}
        />
        
        {ClientPriceOnward && !priceErrorOnward && 
         Number(ClientPriceOnward) >= (bookingPayload.onwardFare?.price || 0) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="flex items-center text-green-600 text-sm">
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium">Valid</span>
            </div>
          </div>
        )}
      </div>
      
      {priceErrorOnward && (
        <div className="mt-2 flex items-center text-red-600 text-sm font-medium">
          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
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
            <div className="flex items-center justify-between mb-3">
              {/* Airline */}
              <div className="flex items-center gap-3 w-[20%]">
                {bookingPayload.returnFlight.segments?.[0]?.Airline?.AirlineLogo && (
                  <img
                    src={bookingPayload.returnFlight.segments[0].Airline.AirlineLogo}
                    alt="Airline"
                    className="w-8 h-8 object-contain"
                  />
                )}
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    {bookingPayload.returnFlight.segments?.[0]?.Airline?.AirlineName || "Flight"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {bookingPayload.returnFlight.segments?.map(
                      (segment) => 
                        `${segment.Airline.AirlineCode} ${segment.Airline.FlightNumber}`
                    ).join(" , ")}
                  </div>
                </div>
              </div>

              {/* Departure */}
              <div className="text-center w-[15%]">
                <div className="text-sm font-bold">
                  {bookingPayload.returnFlight.depTime 
                    ? format(new Date(bookingPayload.returnFlight.depTime), "HH:mm")
                    : "--:--"}
                </div>
                <div className="text-md text-gray-700">
                  {bookingPayload.returnFlight.originAirport?.CityName || "Origin"}
                </div>
                <div className="text-xs text-gray-400">
                  {bookingPayload.returnFlight.originAirport?.AirportName || ""}
                  {bookingPayload.returnFlight.originAirport?.Terminal && 
                    ` (T${bookingPayload.returnFlight.originAirport.Terminal})`}
                </div>
              </div>

              {/* Duration + line */}
              <div className="flex flex-col items-center w-[30%]">
                <div className="text-sm font-medium text-gray-700 mb-1">
                  {calculateDurationFlight(bookingPayload.returnSegments)}
                </div>
                <div className="flex items-center w-full flight-line-d2 mt-0 mr-0 ">
              
                </div>
                <div className="text-xs text-[#785ef7] mt-1">
                  {bookingPayload.returnSegments?.length === 1 ? "Non-stop" : 
                   bookingPayload.returnSegments?.length > 1 ? "Connecting" : "Direct"}
                </div>
              </div>

              {/* Arrival */}
              <div className="text-center w-[15%]">
                <div className="text-sm font-bold">
                  {bookingPayload.returnFlight.arrTime 
                    ? format(new Date(bookingPayload.returnFlight.arrTime), "HH:mm")
                    : "--:--"}
                </div>
                <div className="text-md text-gray-700">
                  {bookingPayload.returnFlight.destinationAirport?.CityName || "Destination"}
                </div>
                <div className="text-xs text-gray-400">
                  {bookingPayload.returnFlight.destinationAirport?.AirportName || ""}
                  {bookingPayload.returnFlight.destinationAirport?.Terminal && 
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
          Client Price (Per Passenger)
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
            const minPrice = bookingPayload.returnFare?.price || 0;
            if (value && Number(value) < minPrice) {
              setPriceErrorReturn(`Must be at least ₹${minPrice}`);
            } else {
              setPriceErrorReturn("");
            }
          }}
          placeholder="Enter price..."
          className={`pl-3 w-full p-2 border-2 rounded-lg text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#785ef7] focus:border-[#785ef7] transition-all duration-200 ${
            priceErrorReturn 
              ? "border-red-500 bg-red-50 text-red-700" 
              : ClientPriceReturn && !priceErrorReturn && Number(ClientPriceReturn) >= (bookingPayload.returnFare?.price || 0)
              ? "border-green-500 bg-green-50 text-green-700"
              : "border-gray-300 bg-white text-gray-800 hover:border-gray-400"
          }`}
          min={bookingPayload.returnFare?.price || 0}
        />
        
        {ClientPriceReturn && !priceErrorReturn && 
         Number(ClientPriceReturn) >= (bookingPayload.returnFare?.price || 0) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="flex items-center text-green-600 text-sm">
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium">Valid</span>
            </div>
          </div>
        )}
      </div>
      
      {priceErrorReturn && (
        <div className="mt-2 flex items-center text-red-600 text-sm font-medium">
          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
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

    {/* Total Summary */}
    {/* {(ClientPriceOnward || ClientPriceReturn) && (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-semibold text-blue-700">
            Total Client Price
          </div>
          <div className="font-bold text-blue-800 text-lg">
            ₹{(Number(ClientPriceOnward || 0) + Number(ClientPriceReturn || 0)) || 0}
          </div>
        </div>
        <div className="text-xs text-blue-600">
          {bookingPayload?.inputValue?.adult || 1} Adult × 
          (₹{Number(ClientPriceOnward || 0)} + ₹{Number(ClientPriceReturn || 0)}) = 
          ₹{(Number(ClientPriceOnward || 0) + Number(ClientPriceReturn || 0)) * (bookingPayload?.inputValue?.adult || 1)}
        </div>
      </div>
    )} */}
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
          const onwardValid = ClientPriceOnward && 
                             !priceErrorOnward && 
                             Number(ClientPriceOnward) >= (bookingPayload.onwardFare?.price || 0);
          
          // Check if return price is valid (only if return flight exists)
          const returnValid = !bookingPayload.returnFlight || 
                             (ClientPriceReturn && 
                              !priceErrorReturn && 
                              Number(ClientPriceReturn) >= (bookingPayload.returnFare?.price || 0));
          
          if (onwardValid && returnValid) {
            if (bookingPayload?.isRoundTrip) {
              // Handle round trip booking
              NavigateToReturnBookingPage(
                {
                  Onward: {
                    fare: bookingPayload.onwardFare,
                    flight: bookingPayload.onwardFlight,
                    clientPrice: Number(ClientPriceOnward)
                  },
                  Return: bookingPayload.returnFlight
                    ? {
                        fare: bookingPayload.returnFare,
                        flight: bookingPayload.returnFlight,
                        clientPrice: Number(ClientPriceReturn)
                      }
                    : null,
                },
                bookingPayload.Cabinclass,
                bookingPayload.inputValue,
                Number(ClientPriceOnward) + Number(ClientPriceReturn || 0)
              );
            } else {
              // Handle one-way booking
              NavigatetoBookingflow(
                bookingPayload.fare,
                bookingPayload.segments,
                bookingPayload.Cabinclass,
                bookingPayload.inputValue,
                bookingPayload.FlightInfo,
                Number(ClientPriceOnward)
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
          Number(ClientPriceOnward) < (bookingPayload.onwardFare?.price || 0) ||
          (bookingPayload.returnFlight && (
            !ClientPriceReturn ||
            priceErrorReturn ||
            Number(ClientPriceReturn) < (bookingPayload.returnFare?.price || 0)
          ))
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
    <input type="text" value={bookingid} disabled />
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
                    (email) => typeof email === "string" && email.trim() !== ""
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
        <Modal.Title>Edit Flight Prices</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <div className="alert alert-warning" style={{ marginBottom: "15px" }}>
            <i className="fas fa-edit mr-2"></i>
            <strong>Editing Instructions:</strong> Click on the yellow-highlighted prices to edit them.
            <div style={{ marginTop: "5px", fontSize: "12px" }}>
                <strong>Note:</strong> Prices will auto-format with commas. Edit values and click outside to save.
            </div>
        </div>

        <div
            ref={contentRef}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            style={{
                minHeight: "400px",
                maxHeight: "500px",
                border: "1px solid #ddd",
                padding: "15px",
                overflow: "auto",
                backgroundColor: "#f9f9f9",
            }}
        />
    </Modal.Body>
    <Modal.Footer>
        <button
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
        >
            Cancel
        </button>

        {/* <button
            className="btn btn-warning"
            onClick={() => {
                if (contentRef.current) {
                    const updatedFares = extractFareDetailsFromHtml(contentRef.current);
                    console.log('Current extracted fares:', updatedFares);
                    
                    // Show which prices are editable
                    const editableSpans = contentRef.current.querySelectorAll('span[data-index]');
                    Swal.fire({
                        title: 'Debug Info',
                        html: `
                            <div style="text-align: left;">
                                <p>Editable spans found: ${editableSpans.length}</p>
                                <p>Extracted fares: ${updatedFares.length}</p>
                                <pre>${JSON.stringify(updatedFares, null, 2)}</pre>
                            </div>
                        `,
                        width: 800,
                    });
                }
            }}
        >
            Debug Extraction
        </button> */}

        <button
            className="px-5 py-2.5 text-sm font-medium text-white bg-[#785ef7] rounded-lg"
            onClick={confirmAndCloseModal}
        >
            Confirm & Send Updates
        </button>
    </Modal.Footer>
</Modal>
      ; ;
    </div>
  );
};
export default FinalSearchFlight;
