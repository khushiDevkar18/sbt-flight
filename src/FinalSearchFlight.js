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
  console.log("response from taxivaxi", location.state.responseData);
  const isOnline = useOnlineStatus();
  const bookingid = location.state && location.state.responseData?.bookingid;
  const adult = location.state && location.state.responseData?.selectadult;
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
  console.log(request_type);
  const client_name = location.state && location.state.responseData?.clientname;
  const spocname = location.state && location.state.responseData?.spocname;
  const spocemail = location.state && location.state.responseData?.spocemail;
  const ccmail = location.state && location.state.responseData?.ccmail;
  const additional_mails =
    location.state && location.state.responseData?.additionalemail;
  const no_of_seats =
    location.state && location.state.responseData?.no_of_seats;
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
  const [selectedFlightIndex, setSelectedFlightIndex] = React.useState([]);
  const [selectedReturnFlightIndex, setSelectedReturnFlightIndex] =
    React.useState([]);
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
          console.log(response.data);
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

  const normalizedCCEmailsRaw = Array.isArray(ccmail)
    ? ccmail.flatMap((email) => email.split(",").map((e) => e.trim()))
    : ccmail
    ? ccmail.split(",").map((e) => e.trim())
    : [];
  const normalizedCCEmails = [...new Set(normalizedCCEmailsRaw)];
  // console.log("Normalized CC Emails:", normalizedCCEmails);
  const [ccEmails, setCCEmails] = useState(normalizedCCEmails);

  const [ccEmailInput, setCCEmailInput] = useState("");
  const normalizedSpocEmails = Array.isArray(spocemail)
    ? spocemail.flatMap((email) => email.split(",").map((e) => e.trim()))
    : spocemail
    ? spocemail.split(",").map((e) => e.trim())
    : [];

  const [spocEmails, setSpocEmails] = useState(normalizedSpocEmails);
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
        // console.log(responseData)
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
    console.log("booking type", value);
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
    // console.log(airport)
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
    // console.log('Fares', options)
    let baseFares = [];

    options.forEach((flight) => {
      // console.log('each fare',flight)
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
    // console.log(AirportData)
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
    console.log(requestData);
    try {
      setLoadingg(true);
      const response = await fetch(url, {
        method: "POST",
        headers: {
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
        // console.log('Available flights', AvailableOptions)
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
          // console.log('return flight:', AvailableOptionsReturn.length);
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
  };

  const toggleSelection = (slotKey, isDeparture) => {
    const updater = isDeparture ? setSelectedDepartures : setSelectedArrivals;
    const current = isDeparture ? selectedDepartures : selectedArrivals;
    updater(
      current.includes(slotKey)
        ? current.filter((key) => key !== slotKey)
        : [...current, slotKey]
    );
  };

  const getTimeSlot = (hour) => {
    if (hour < 6) return "before6AM";
    if (hour < 12) return "6AMto12PM";
    if (hour < 18) return "12PMto6PM";
    return "after6PM";
  };

  //Flitered data
  const filteredFlights = FlightOptions.filter((response) => {
    // console.log("FlightOptions",FlightOptions)
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
    // console.log("filteredFlights", filteredFlights)
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
  };

  //Clear filter
  const handleClearReturnFilters = () => {
    setreturnSelectedStops(new Set());
    setSelectedReturnDepartures([]);
    setSelectedReturnArrivals([]);
    setSelectedReturnAirlines(new Set());
    setPriceReturnRange([minFare, maxFare]); // or your initial default range
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
    // console.log(PassengeDetails)

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
      // console.log(data)
      setfareLoadingg(false);
    } catch {
      setfareLoadingg(false);
      console.log("error");
    }
  };
  // Selected flight options

  const handleFareToggle = (segments, fare, index, basefare) => {
    setSelectedFares((prevFares) => {
      const isAlreadySelected = prevFares.some(
        (f) => f.index === index && f.fareType === fare.type
      );

      let updatedFares;
      if (isAlreadySelected) {
        // Remove fare
        updatedFares = prevFares.filter(
          (f) => !(f.index === index && f.fareType === fare.type)
        );
      } else {
        // Add fare
        updatedFares = [...prevFares, { index, fareType: fare.type }];
      }

      // Update selectedFlightIndex based on whether any fares remain for this flight
      setSelectedFlightIndex((prevIndexes) => {
        const hasOtherFares = updatedFares.some((f) => f.index === index);
        if (!hasOtherFares) {
          // Remove flight index if no fares remain
          return prevIndexes.filter((i) => i !== index);
        } else if (!prevIndexes.includes(index)) {
          // Add flight index if not already present
          return [...prevIndexes, index];
        }
        return prevIndexes;
      });

      return updatedFares;
    });

    setSelectedFlightoption((prevOptions) => {
      const isAlreadySelected = prevOptions.some(
        (item) => item.index === index && item.fare.type === fare.type
      );

      if (isAlreadySelected) {
        // Remove from booking options
        return prevOptions.filter(
          (item) => !(item.index === index && item.fare.type === fare.type)
        );
      } else {
        // Add to booking options
        return [
          ...prevOptions,
          { index, flight: segments, fare, base_fare: basefare },
        ];
      }
    });
  };
  const groupedFlights = selectedFlightoption.reduce((acc, curr) => {
    // console.log(selectedFlightoption)
    if (!acc[curr.index]) {
      acc[curr.index] = {
        flight: curr.flight,
        fares: [],
        base_fare: curr.base_fare,
      };
    }
    acc[curr.index].fares.push(curr.fare);
    return acc;
  }, {});

  // Remove selected Flight option
  const handleRemoveFare = (flightIndex, fareType) => {
    const updatedOptions = selectedFlightoption.filter(
      (item) =>
        !(item.index === parseInt(flightIndex) && item.fare.type === fareType)
    );
    setSelectedFlightoption(updatedOptions);

    const updatedFares = selectedFares.filter(
      (f) => !(f.index === parseInt(flightIndex) && f.fareType === fareType)
    );
    setSelectedFares(updatedFares);

    const hasOtherFares = updatedOptions.some(
      (item) => item.index === parseInt(flightIndex)
    );

    if (!hasOtherFares) {
      setSelectedFlightIndex((prev) =>
        prev.filter((idx) => idx !== parseInt(flightIndex))
      );
    }
  };

  //Return Flights
  const GetreturnFares = async (data) => {
    // console.log(PassengeDetails)

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
      // console.log(data)
      setReturnfareLoadingg(false);
    } catch {
      setReturnfareLoadingg(false);
      console.log("error");
    }
  };
  // Selected flight options

  const handleReturnFareToggle = (segments, fare, index, basefare) => {
    console.log("base fare", basefare);
    setSelectedReturnFares((prevFares) => {
      const isAlreadySelected = prevFares.some(
        (f) => f.index === index && f.fareType === fare.type
      );

      let updatedFares;
      if (isAlreadySelected) {
        // Remove fare
        updatedFares = prevFares.filter(
          (f) => !(f.index === index && f.fareType === fare.type)
        );
      } else {
        // Add fare
        updatedFares = [...prevFares, { index, fareType: fare.type }];
      }

      // Update selectedFlightIndex based on whether any fares remain for this flight
      setSelectedReturnFlightIndex((prevIndexes) => {
        const hasOtherFares = updatedFares.some((f) => f.index === index);
        if (!hasOtherFares) {
          // Remove flight index if no fares remain
          return prevIndexes.filter((i) => i !== index);
        } else if (!prevIndexes.includes(index)) {
          // Add flight index if not already present
          return [...prevIndexes, index];
        }
        return prevIndexes;
      });

      return updatedFares;
    });

    setSelectedReturnFlightoption((prevOptions) => {
      const isAlreadySelected = prevOptions.some(
        (item) => item.index === index && item.fare.type === fare.type
      );

      if (isAlreadySelected) {
        // Remove from booking options
        return prevOptions.filter(
          (item) => !(item.index === index && item.fare.type === fare.type)
        );
      } else {
        // Add to booking options
        return [
          ...prevOptions,
          { index, flight: segments, fare, base_fare: basefare },
        ];
      }
    });
  };
  const groupedReturnFlights = selectedReturnFlightoption.reduce(
    (acc, curr) => {
      // console.log(selectedFlightoption)
      if (!acc[curr.index]) {
        acc[curr.index] = {
          flight: curr.flight,
          fares: [],
          base_fare: curr.base_fare,
        };
      }
      acc[curr.index].fares.push(curr.fare);
      return acc;
    },
    {}
  );
  // Remove selected Flight option
  const handleRemoveReturnFare = (flightIndex, fareType) => {
    const updatedOptions = selectedReturnFlightoption.filter(
      (item) =>
        !(item.index === parseInt(flightIndex) && item.fare.type === fareType)
    );
    setSelectedReturnFlightoption(updatedOptions);

    const updatedFares = selectedReturnFares.filter(
      (f) => !(f.index === parseInt(flightIndex) && f.fareType === fareType)
    );
    setSelectedReturnFares(updatedFares);

    const hasOtherFares = updatedOptions.some(
      (item) => item.index === parseInt(flightIndex)
    );

    if (!hasOtherFares) {
      setSelectedReturnFlightIndex((prev) =>
        prev.filter((idx) => idx !== parseInt(flightIndex))
      );
    }
  };

  // -----------------------------------------------------Fare selection for booking---------------------------------------------------

  const handleSingleSelect = (flight, fare, index, baseFare, journey) => {
    setSelectedFareforbooking((prev) => ({
      ...prev,
      [journey]: { flight: flight, fare: fare }, // replace the array with only the selected fare for the given journey
    }));
    setFlightBookingOpen(true);
  };

  // console.log(selectedFareforbooking)

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

  const NavigatetoBookingflow = (
    fare,
    segments,
    Cabinclass,
    inputValue,
    FlightInfo
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
    // console.log("Flight type", FLightType)
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
    };
    sessionStorage.setItem("PriceResponse", JSON.stringify(PriceResponse));

    // Open in new tab
    const path = fare.from === "Uapi" ? "/UapiBookingflow" : "/TboBookingflow";
    window.open(path, "_blank");
  };

  // Navigate to next page for return flight booking
  const NavigateToReturnBookingPage = (FlightData, cabinClass, inputValue) => {
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
    };
    sessionStorage.setItem(
      "returnPriceResponse",
      JSON.stringify(PriceResponse)
    );

    // // Open in new tab
    // const path = fare.from === 'Uapi' ? '/UapiBookingflow' : '/TboBookingflow';
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
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:00`;
  }
//   const Shareflight = async () => {

//     // Construct transformedFlights object
//     let transformedFlights = {
//       flights: {
//         onward: {
//           flight_options: [],
//         },
//       },
//     };
//     let is_return = 0; // default — assume no return flights

//     // 🛫 Onward flights
//     if (Object.keys(groupedFlights || {}).length > 0) {
//       transformedFlights.flights.onward = { flight_options: [] };
//     }
// console.log("groupedReturnFlights",groupedReturnFlights);
// console.log("groupedFlights",groupedFlights);
//     // 🔁 Return flights
//     if (Object.keys(groupedReturnFlights || {}).length > 0) {
//       transformedFlights.flights.return = { flight_options: [] };
//       is_return = 1; // set to 1 if return flight data exists
//     } else {
//       is_return = 0; // no return flight data
//     }
//     // 🛫 Onward flights
//     Object.values(groupedFlights).forEach((item) => {
//       const segments = item.flight.segments || [];
//       const flightNos = segments
//         .map((seg) => seg.Airline?.FlightNumber)
//         .join(", ");
//       const airlineNames = segments
//         .map((seg) => seg.Airline?.AirlineName)
//         .join(", ");
//       const carriers = segments
//         .map((seg) => seg.Airline?.AirlineCode)
//         .join(", ");
//       const flightdetails = item.flight;

//       transformedFlights.flights.onward.flight_options.push({
//         flight_no: flightNos,
//         airline_name: airlineNames,
//         from_city: flightdetails.originAirport?.AirportName,
//         from_city_code: flightdetails.originAirport?.AirportCode,
//         to_city: flightdetails.destinationAirport?.AirportName,
//         to_city_code: flightdetails.destinationAirport?.AirportCode,
//         departure_datetime: flightdetails?.depTime,
//         arrival_datetime: flightdetails?.arrTime,
//         price: item?.base_fare,
//         is_return,
//         no_of_stops: segments.length - 1,
//         carrier: carriers,
//         provider_code: item?.fares?.[0]?.ProviderCode || "",
//         duration: calculateDuration(
//           flightdetails?.depTime,
//           flightdetails?.arrTime
//         ),
//         is_refundable: item.fares?.[0]?.is_refundable || 0,
//         fare_details: (item?.fares || []).map((f) => ({
//           fare_type: f.type || "Corporate Fare",
//           price: f.price,
//           markup: f.markup || 0,
//           source: f.from,
//         })),
//         flight_details: segments.map((seg) => ({
//           flight_no: seg.Airline?.FlightNumber,
//           airline_name: seg.Airline?.AirlineName,
//           from_city: seg.Origin?.Airport?.AirportName,
//           from_city_code: seg.Origin?.Airport?.AirportCode,
//           to_city: seg.Destination?.Airport?.AirportName,
//           to_city_code: seg.Destination?.Airport?.AirportCode,
//           departure_datetime: seg.Origin?.DepTime,
//           arrival_datetime: seg.Destination?.ArrTime,
//           origin_airline_city: seg.Origin?.Airport?.CityName,
//           destination_airline_city: seg.Destination?.Airport?.CityName,
//           provider_code: item?.fares?.[0]?.ProviderCode,
//           OriginTerminal: seg.Origin?.Airport?.Terminal || "",
//           DestinationTerminal: seg.Destination?.Airport?.Terminal || "",
//         })),
//         DestinationTerminal: item.destinationAirport?.Terminal || "",
//         OriginTerminal: item.originAirport?.Terminal || "",
//       });
//     });

//     // 🔁 Return flights (only add if data exists)
//     if (Object.keys(groupedReturnFlights || {}).length > 0) {
//       transformedFlights.flights.return = { flight_options: [] };

//       Object.values(groupedReturnFlights).forEach((item) => {
//         const segments = item.flight.segments || [];
//         const flightNos = segments
//           .map((seg) => seg.Airline?.FlightNumber)
//           .join(", ");
//         const airlineNames = segments
//           .map((seg) => seg.Airline?.AirlineName)
//           .join(", ");
//         const carriers = segments
//           .map((seg) => seg.Airline?.AirlineCode)
//           .join(", ");
//         const flightdetails = item.flight;

//         transformedFlights.flights.return.flight_options.push({
//           flight_no: flightNos,
//           airline_name: airlineNames,
//           from_city: flightdetails.originAirport?.AirportName,
//           from_city_code: flightdetails.originAirport?.AirportCode,
//           to_city: flightdetails.destinationAirport?.AirportName,
//           to_city_code: flightdetails.destinationAirport?.AirportCode,
//           departure_datetime: flightdetails?.depTime,
//           arrival_datetime: flightdetails?.arrTime,
//           price: item?.base_fare,
//           is_return: 1,
//           no_of_stops: segments.length - 1,
//           carrier: carriers,
//           provider_code: item?.fares?.[0]?.ProviderCode || "",
//           duration: calculateDuration(
//             flightdetails?.depTime,
//             flightdetails?.arrTime
//           ),
//           is_refundable: item.fares?.[0]?.is_refundable || 0,
//           fare_details: (item?.fares || []).map((f) => ({
//             fare_type: f.type || "Corporate Fare",
//             price: f.price,
//             markup: f.markup || 0,
//             source: f.from,
//           })),
//           flight_details: segments.map((seg) => ({
//             flight_no: seg.Airline?.FlightNumber,
//             airline_name: seg.Airline?.AirlineName,
//             from_city: seg.Origin?.Airport?.AirportName,
//             from_city_code: seg.Origin?.Airport?.AirportCode,
//             to_city: seg.Destination?.Airport?.AirportName,
//             to_city_code: seg.Destination?.Airport?.AirportCode,
//             departure_datetime: seg.Origin?.DepTime,
//             arrival_datetime: seg.Destination?.ArrTime,
//             origin_airline_city: seg.Origin?.Airport?.CityName,
//             destination_airline_city: seg.Destination?.Airport?.CityName,
//             provider_code: item?.fares?.[0]?.ProviderCode,
//             OriginTerminal: seg.Origin?.Airport?.Terminal || "",
//             DestinationTerminal: seg.Destination?.Airport?.Terminal || "",
//           })),
//           DestinationTerminal: item.destinationAirport?.Terminal || "",
//           OriginTerminal: item.originAirport?.Terminal || "",
//         });
//       });
//     }

//     // ✈️ Final request data
//     const requestData = {
//       booking_id: bookingid,
//       email: spocEmails,
//       seat_type: cabinclass,
//       // departure_date: "2025-09-29T00:00:00.000 05:30",
//       departure_date: searchdeparturedate || null,
//       return_date: searchreturndate || null,

//       no_of_seats: no_of_seats,
//       ...transformedFlights,
//       additional_emails: additionalEmails,
//       cc_email: ccEmails,
//       remark: remark,
//       client_name: client_name,
//       spoc_name: spocname,
//       htmlContent: "",
//       flag: "",
//     };

//     setshareoptionsrequest(requestData);
//     // console.log("share option flights", requestData);

//     try {
//       const response = await fetch(
//         `${CONFIG.MAIN_API}/api/flights/addCotravFlightOptionBooking`,
//         {
//           method: "POST",
//           headers: {
//             Origin: "*",
//             // "Content-Type": "application/x-www-form-urlencoded",
//           },
//           body: JSON.stringify(requestData),
//         }
//       );

//       const responsedata = await response.json();
//       if (responsedata.success === "1") {
//         setHtmlContent(responsedata.data);
//         setIsModalOpen(false);
//         setShowModal(true);
//         setIsMinimized(true);
//       }
//     } catch (error) {
//       console.error("Error sharing flight options:", error);
//     }
//   };
const Shareflight = async () => {
  // Function to remove special characters and normalize text
  const cleanText = (text) => {
    if (!text || typeof text !== 'string') return text;
    
    // Remove special characters but keep spaces, letters, numbers, basic punctuation
    return text
      .replace(/[^\w\s(),.-]/g, '') // Keep alphanumeric, spaces, and basic punctuation
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  };

  // Convert layover difference into HH:MM:SS
  const calculateLayover = (arrival, departure) => {
    const arr = new Date(arrival);
    const dep = new Date(departure);
    const diffMs = dep - arr;

    if (diffMs < 0) return "00 Hrs : 00 mins";

    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    const diffM = Math.floor((diffMs / (1000 * 60)) % 60);

    return `${String(diffH).padStart(2, "0")} Hrs : ${String(diffM).padStart(2, "0")} mins`;
};


  // Build initial object
  let transformedFlights = {
    flights: {
      onward: { flight_options: [] }
    }
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

    const flightNos = segments.map(seg => seg.Airline?.FlightNumber).join(", ");
    const airlineNames = segments.map(seg => cleanText(seg.Airline?.AirlineName)).join(", ");
    const carriers = segments.map(seg => cleanText(seg.Airline?.AirlineCode)).join(", ");
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
          stop_airport: cleanText(`${stopAirport?.AirportName} ${stopAirport?.CityName} (${stopAirport?.AirportCode})`),
          duration: layoverTime
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
      price: item?.base_fare,
      is_return,
      no_of_stops: segments.length - 1,
      carrier: cleanText(carriers),
      provider_code: cleanText(item?.fares?.[0]?.ProviderCode || ""),
      duration: calculateDuration(flightdetails?.depTime, flightdetails?.arrTime),
      is_refundable: item.fares?.[0]?.is_refundable || 0,

      fare_details: (item?.fares || []).map(f => ({
        fare_type: cleanText(f.type || "Corporate Fare"),
        price: f.price,
        markup: f.markup || 0,
        source: cleanText(f.from),
      })),

      flight_details: segments.map(seg => ({
        flight_no: cleanText(seg.Airline?.FlightNumber),
        airline_name: cleanText(seg.Airline?.AirlineName),
        from_city: cleanText(seg.Origin?.Airport?.AirportName),
        from_city_code: cleanText(seg.Origin?.Airport?.AirportCode),
        to_city: cleanText(seg.Destination?.Airport?.AirportName),
        to_city_code: cleanText(seg.Destination?.Airport?.AirportCode),
        departure_datetime: seg.Origin?.DepTime,
        arrival_datetime: seg.Destination?.ArrTime,
        origin_airline_city: cleanText(seg.Origin?.Airport?.CityName),
        destination_airline_city: cleanText(seg.Destination?.Airport?.CityName),
        provider_code: cleanText(item?.fares?.[0]?.ProviderCode),
        OriginTerminal: cleanText(seg.Origin?.Airport?.Terminal || ""),
        DestinationTerminal: cleanText(seg.Destination?.Airport?.Terminal || ""),
      })),

      DestinationTerminal: cleanText(flightdetails.destinationAirport?.Terminal || ""),
      OriginTerminal: cleanText(flightdetails.originAirport?.Terminal || ""),

      // ADD LAYOVER STOPS
      stops
    });
  });

  // ------------------------- RETURN FLIGHTS ----------------------------
  if (Object.keys(groupedReturnFlights || {}).length > 0) {
    Object.values(groupedReturnFlights).forEach((item) => {
      const segments = item.flight.segments || [];

      const flightNos = segments.map(seg => seg.Airline?.FlightNumber).join(", ");
      const airlineNames = segments.map(seg => cleanText(seg.Airline?.AirlineName)).join(", ");
      const carriers = segments.map(seg => cleanText(seg.Airline?.AirlineCode)).join(", ");
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
            stop_airport: cleanText(`${stopAirport?.AirportName} ${stopAirport?.CityName} (${stopAirport?.AirportCode})`),
            duration: layoverTime
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
        to_city_code: cleanText(flightdetails.destinationAirport?.AirportCode),
        departure_datetime: flightdetails?.depTime,
        arrival_datetime: flightdetails?.arrTime,
        price: item?.base_fare,
        is_return: 1,
        no_of_stops: segments.length - 1,
        carrier: cleanText(carriers),
        provider_code: cleanText(item?.fares?.[0]?.ProviderCode || ""),
        duration: calculateDuration(flightdetails?.depTime, flightdetails?.arrTime),
        is_refundable: item.fares?.[0]?.is_refundable || 0,

        fare_details: (item?.fares || []).map(f => ({
          fare_type: cleanText(f.type || "Corporate Fare"),
          price: f.price,
          markup: f.markup || 0,
          source: cleanText(f.from),
        })),

        flight_details: segments.map(seg => ({
          flight_no: cleanText(seg.Airline?.FlightNumber),
          airline_name: cleanText(seg.Airline?.AirlineName),
          from_city: cleanText(seg.Origin?.Airport?.AirportName),
          from_city_code: cleanText(seg.Origin?.Airport?.AirportCode),
          to_city: cleanText(seg.Destination?.Airport?.AirportName),
          to_city_code: cleanText(seg.Destination?.Airport?.AirportCode),
          departure_datetime: seg.Origin?.DepTime,
          arrival_datetime: seg.Destination?.ArrTime,
          origin_airline_city: cleanText(seg.Origin?.Airport?.CityName),
          destination_airline_city: cleanText(seg.Destination?.Airport?.CityName),
          provider_code: cleanText(item?.fares?.[0]?.ProviderCode),
          OriginTerminal: cleanText(seg.Origin?.Airport?.Terminal || ""),
          DestinationTerminal: cleanText(seg.Destination?.Airport?.Terminal || ""),
        })),

        DestinationTerminal: cleanText(flightdetails.destinationAirport?.Terminal || ""),
        OriginTerminal: cleanText(flightdetails.originAirport?.Terminal || ""),

        // ADD LAYOVER STOPS
        stops
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
  };
  
  console.log("requestData", requestData);
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

const confirmAndCloseModal = async () => {
  if (contentRef.current) {
    const updatedHtml = contentRef.current.innerHTML;

    const requestData = {
      ...shareoptionrequest,
      htmlContent: updatedHtml,
      flag: "send",
    };

    console.log("Request Data :", requestData);

    try {
      const response = await fetch(
        `${CONFIG.MAIN_API}/api/flights/addCotravFlightOptionBooking`,
        {
          method: "POST",
          headers: {
            Origin: "*",
          },
          body: JSON.stringify(requestData), // ✅ correctly stringified
        }
      );

      const responsedata = await response.json();
      console.log("Response :", responsedata);

      if (responsedata.success === "1") {
        Swal.fire({
          title: "Success!",
          text: "Flight options have been sent successfully.",
          imageUrl: "https://cdn-icons-png.flaticon.com/512/845/845646.png",
          imageWidth: 75,
          imageHeight: 75,
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: responsedata.message || "Something went wrong.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }

      setShowModal(false);

    } catch (error) {
      console.error("Fetch error:", error);

      Swal.fire({
        title: "Error!",
        text: "Network or server error. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });

      setShowModal(false);
    }
  }
};

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
                              // console.log("Arrival Time", arrTime)
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
                                    selectedFlightIndex.includes(index)
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
                                          const isSelected = selectedFares.some(
                                            (f) =>
                                              f.index === index &&
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
                                                    NavigatetoBookingflow(
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
                                              {/* )}
                                              {request_type === "search" && ( */}
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
                                              {/* )} */}
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
                                      selectedFlightIndex.includes(index)
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
                                            {uniqueFares.map((fare, idx) => {
                                              const isSelected =
                                                selectedFares.some(
                                                  (f) =>
                                                    f.index === index &&
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
                                        selectedReturnFlightIndex.includes(
                                          index
                                        )
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
                                                const isSelected =
                                                  selectedReturnFares.some(
                                                    (f) =>
                                                      f.index === index &&
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
                    {Object.entries(groupedFlights).map(
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
                    )}
                  </div>
                )}

                {/* 🟦 Return Flights */}
                {selectedReturnFlightoption.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-[13px] mb-2">
                      Return Flights
                    </h4>
                    {Object.entries(groupedReturnFlights).map(
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
                                      onClick={() =>
                                        handleRemoveReturnFare(
                                          flightIndex,
                                          fare.type
                                        )
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
                  <button
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
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <div className="form-group">
              <label>Reference Number</label>
              <input type="text" value={bookingid} disabled />
            </div>

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
          <Modal.Title>HTML Preview (Editable)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            ref={contentRef}
            contentEditable="true" // The main container remains editable
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            style={{
              minHeight: "200px",
              border: "1px solid #ddd",
              padding: "10px",
            }}
            onInput={(e) => {
              // Prevent editing if the user tries to modify a non-editable div
              const selection = window.getSelection();
              if (
                selection.anchorNode?.parentElement?.closest(
                  '[contenteditable="false"]'
                )
              ) {
                e.preventDefault();
                document.execCommand("undo"); // Undo the last attempted edit
              }
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <button className="send-button" onClick={confirmAndCloseModal}>
            Confirm & Proceed
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default FinalSearchFlight;
