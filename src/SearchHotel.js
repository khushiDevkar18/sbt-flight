import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { X } from "@mui/icons-material";
import { Dialog, Transition } from "@headlessui/react";
import Swal from "sweetalert2";
import Modal from "./Modal";

import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { Chip } from "@mui/material";

// //// // // // console.log("asdafdsfa");

const SearchHotel = () => {
  const location = useLocation();
  // window.location.reload();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [hoveredHotel, setHoveredHotel] = useState("");

  const searchParams =
    JSON.parse(sessionStorage.getItem("hotelData_header")) || {};
  const hotelData = JSON.parse(sessionStorage.getItem("hotelSearchData")) || {};
  const [hotelDetails, setHotelDetails] = useState(() => {
    // Try getting data from sessionStorage first
    const storedData = sessionStorage.getItem("hotelDetails");
    return storedData ? JSON.parse(storedData) : [];
  });

  const hotelcityList =
    JSON.parse(sessionStorage.getItem("hotelSearchData"))?.hotelcityList || [];

  // useEffect(() => {
  //   const fetchCity = async () => {
  //     const storedHotelList = sessionStorage.getItem("hotelSearchData");
  //     const hotelcityList = storedHotelList
  //       ? JSON.parse(storedHotelList).hotelcityList
  //       : [];

  //     // // // console.log("Parsed hotelcityList:", hotelcityList);

  //     if (!Array.isArray(hotelcityList) || hotelcityList.length === 0) {
  //       // // // console.log("Hotel list is empty, exiting fetchCity");
  //       return;
  //     }

  //     setLoader(true);

  //     const codes = hotelcityList.map((hotel) => hotel.HotelCode);
  //     // // // console.log("Hotel Codes:", codes);

  //     const hotelcodes = codes.toString(); // Convert array to comma-separated string

  //     try {
  //       const response = await fetch(
  //         "https://demo.taxivaxi.com/api/hotels/sbtHotelDetails",
  //         {
  //           method: "POST",
  //           headers: {
  //             // "Content-Type": "application/json",
  //             Origin: "*", // Change to your React app's origin
  //             "Access-Control-Request-Method": "POST", // The method you're going to use
  //           },
  //           body: JSON.stringify({
  //             Hotelcodes: hotelcodes,
  //             Language: "EN",
  //           }),
  //         }
  //       );

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }

  //       const data = await response.json();
  //       // // // console.log("Hotel data:", data);

  //       if (data.Status && data.Status.Code === 200) {
  //         setHotelDetails(data.HotelDetails || []);
  //         sessionStorage.setItem(
  //           "hotelDetails",
  //           JSON.stringify(data.HotelDetails || [])
  //         );
  //       } else {
  //         console.error("Error fetching hotels:", data.Status?.Description);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching hotels:", error);
  //     } finally {
  //       setLoader(false);
  //     }
  //   };

  //   fetchCity();
  // }, []);

  const combinedHotels = useMemo(() => {
    return hotelDetails.map((hotel) => {
      const matchedHotelList = hotelcityList.find(
        (item) => item.HotelCode === hotel.HotelCode
      );
      const matchedHotelData = hotelData[hotel.HotelCode] || {};

      return {
        ...hotel, // Base details
        ...matchedHotelList, // Override with hotelcityList data if found
        ...matchedHotelData, // Override with hotelData if found
      };
    });
  }, [hotelDetails, hotelcityList, hotelData]); // Recompute only when dependencies change
  // // // console.log(combinedHotels);

  const renderRatingText = (rating) => {
    if (rating > 4.5) return "Excellent";
    if (rating > 3.5) return "Very Good";
    return "Good";
  };
  const renderStars = (rating) => {
    const maxStars = 5;
    const fullStars = Math.floor(rating);
    const emptyStars = maxStars - fullStars;

    return (
      <>
        {Array.from({ length: fullStars }, (_, index) => (
          <FaStar key={`full-${index}`} className="text-yellow-500" />
        ))}
        {Array.from({ length: emptyStars }, (_, index) => (
          <FaRegStar key={`empty-${index}`} className="text-gray-300" />
        ))}
      </>
    );
  };

  const extractAttraction = (Description) => {
    if (!Description || typeof Description !== "string") {
      return "No Location Available";
    }

    // Use regex to extract text after "HeadLine :"
    const match = Description.match(/HeadLine\s*:\s*([^<]+)/);

    return match ? match[1].trim() : "No Location Available";
  };

  const mapContainerStyle = {
    width: "100%",
    height: "400px", // Ensure height is set, otherwise the map won't show
  };

  // //// // // // console.log(storedCities);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 });

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenImage, setIsOpenImage] = useState(false);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCnfQ-TTa0kZzAPvcgc9qyorD34aIxaZhk", // Use environment variables for security
  });
  useEffect(() => {
    if (hotelData.Map) {
      const [lat, lng] = hotelData.Map.split("|").map(Number);
      setMapCenter({ lat, lng });
    }
  }, []);
  const [selectedHotel, setSelectedHotel] = useState(null);
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .gm-fullscreen-control {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const formatCancelPolicies = (CancelPolicies) => {
    if (!Array.isArray(CancelPolicies) || CancelPolicies.length === 0) {
      return ["No cancellation policies available."];
    }

    const today = new Date(); // Get today's date
    today.setHours(0, 0, 0, 0); // Remove time part for accurate comparison

    return CancelPolicies.filter((policy) => {
      // Convert FromDate to a Date object
      const policyDate = new Date(
        policy.FromDate.split(" ")[0].split("-").reverse().join("-")
      );
      return policyDate >= today; // Only keep future or current dates
    }).map((policy) => {
      const formattedDate = policy.FromDate.split(" ")[0]; // Extract only DD-MM-YYYY
      if (policy.ChargeType === "Fixed" && policy.CancellationCharge === 0) {
        return `Free Cancellation till check-in`;
      } else if (policy.ChargeType === "Fixed") {
        return `Booking will be cancelled from ${formattedDate} with a charge of ${policy.CancellationCharge}`;
      } else if (policy.ChargeType === "Percentage") {
        return `From ${formattedDate}, the cancellation charge is ${policy.CancellationCharge}%`;
      }
      return `Policy starts from ${formattedDate}`;
    });
  };

  const [cityName, setCityName] = useState(() => {
    if (searchParams.filteredCities?.length > 0) {
      return searchParams.filteredCities[0]?.Name || "";
    }
    return searchParams.City_name || "";
  });

  useEffect(() => {
    if (!loader) {
      setCityName(() => {
        if (searchParams.filteredCities?.length > 0) {
          return searchParams.filteredCities[0]?.Name || "";
        }
        return searchParams.City_name || "";
      });
    }
  }, [loader, searchParams]); // Runs when isLoading or searchParams change

  const agent_portal = sessionStorage.getItem("agent_portal");
  const booknow = searchParams.booknow;
  const [showModal2, setShowModal2] = useState(false);
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [showModal1, setShowModal1] = useState(false);
  const handleHotelSelect = (hotel) => {
    const isSelected = selectedHotels.some((h) => h.name === hotel.HotelName);

    if (isSelected) {
      setSelectedHotels((prev) =>
        prev.filter((h) => h.name !== hotel.HotelName)
      );
    } else {
      setSelectedHotels((prev) => [
        ...prev,
        {
          name: hotel.HotelName,
          code: hotel.HotelCode, // Ensure this property exists in API response
          price: hotel.Rooms?.[0]?.TotalFare || 0, // Store TotalFare properly
          tax: hotel.Rooms?.[0]?.TotalTax || 0, // Store TotalTax properly
          City_name: hotel.CityName,
          Description: hotel.Description,
          Address: hotel.Address,
          BookingCode: hotel.Rooms?.[0]?.BookingCode || 0,
          BasePrice:
            hotel.Rooms?.[0]?.DayRates?.[0]?.map((rate) => rate.BasePrice) ||
            [],
        },
      ]);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleShareOptions = () => {
    const sharedHotels = selectedHotels.map((hotel) => ({
      name: hotel.name, // Use `name` from selectedHotels
      code: hotel.code, // Use `code` from selectedHotels
      tax: hotel.tax, // Use stored tax value
      total: hotel.price, // Use stored price value
      BookingCode: hotel.BookingCode,
      Address: hotel.Address,
    }));

    // console.log(sharedHotels); // This should now log correct hotel data
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [toEmail, setToEmail] = useState("");
  const [toEmailList, setToEmailList] = useState([]); // ✅ List for "To" emails

  const [ccEmail, setCcEmail] = useState("");
  const [ccEmailList, setCcEmailList] = useState([]); // ✅ List for "CC" emails

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddEmail = (email, setEmail, emailList, setEmailList, field) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    if (!validateEmail(trimmedEmail)) {
      setErrors((prev) => ({ ...prev, [field]: "Invalid email format" }));
      return;
    }

    if (emailList.includes(trimmedEmail)) {
      setErrors((prev) => ({ ...prev, [field]: "Email already added" }));
      return;
    }

    setEmailList((prevEmails) => [...prevEmails, trimmedEmail]); // ✅ Add to respective list
    setEmail(""); // ✅ Clear input
    setErrors((prev) => ({ ...prev, [field]: "" })); // ✅ Clear error
  };

  const handleKeyDown = (
    e,
    email,
    setEmail,
    emailList,
    setEmailList,
    field
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAddEmail(email, setEmail, emailList, setEmailList, field);
    }
  };

  const handleDelete = (emailToDelete, setEmailList) => {
    setEmailList((prevEmails) => prevEmails.filter((e) => e !== emailToDelete));
  };
  const [formData, setFormData] = useState({
    clientName: searchParams.corporate_name,
    spocName: searchParams.spoc_name || "",
    spocEmail: `${searchParams.approver1 || ""}, ${searchParams.approver2 || ""
      }`,
    remark: "",
    toEmail: "",
    ccEmail: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct the Options array dynamically
    const requestBody = {
      Options: selectedHotels.map((hotel) => ({
        hotel_code: hotel.code,
        booking_code: hotel.BookingCode,
        base_fares: JSON.stringify(hotel.BasePrice),
        total_fare: hotel.price,
        tax: hotel.tax,
        hotel_name: hotel.name,
        hotel_address: hotel.Address,
        source: 2,
      })),
      additional_email: toEmailList, // Use toEmailList from form state
      approver_email: formData.spocEmail
        .split(",")
        .map((email) => email.trim()),
      cc_email: ccEmailList, // Use ccEmailList from form state
      admin_id: searchParams.admin_id,
      booking_id: searchParams.booking_id,
      checkin_date: searchParams.checkIn,
      checkout_date: searchParams.checkOut,
      no_of_seats: searchParams.Adults || 2,
      city:
        searchParams.City_name ||
        (searchParams.filteredCities?.length > 0
          ? searchParams.filteredCities[0].Name
          : ""),
    };

    // // // console.log(formattedData);

    // const requestBody = { formattedData: formattedData };
    // console.log(requestBody);
    try {
      const response = await fetch(
        "https://demo.taxivaxi.com/api/hotels/addsbthoteloptions",
        {
          method: "POST",
          headers: {
            // "Content-Type": "application/json",
            Origin: "*", // Change to your React app's origin
            "Access-Control-Request-Method": "POST",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // // console.log("API Response:", data);
      if (data.success == "1") {
        setIsModalOpen(false);
        setSelectedHotels([]);
        Swal.fire({
          title: "Mail Sent",
          text: "Mail Was Sent Successfully",
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }

    // // console.log("Request Body:", requestBody);
  };
  const [company, setCompany] = useState(searchParams.corporate_name || "");
  const [companies, setCompanies] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const [hotelCityList, setHotelCityList] = useState([]);
  const [hotelCityLists, setHotelCityLists] = useState([]);
  const [hotelCodes, setHotelCodes] = useState([]);
  const [SearchHotelCodes, setSearchHotelCodes] = useState([]);
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://demo.taxivaxi.com/api/getAllSBTCompanies"
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      if (data.success === "1" && Array.isArray(data.response.Companies)) {
        setCompanies(data.response.Companies.map((c) => c.corporate_name));
      } else {
        console.error(
          "API Error: No companies found or invalid response format"
        );
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const [city, setCity] = useState(
    searchParams.filteredCities?.[0]?.Name || searchParams.City_name
  );
  const [cities, setCities] = useState([]);
  const [showDropdown2, setShowDropdown2] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://demo.taxivaxi.com/api/hotels/sbtCityList",
        {
          method: "POST",
          headers: {
            Origin: "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
            // "Content-Type": "application/json",
          },
          body: JSON.stringify({ CountryCode: "IN" }),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      if (data.Status?.Code === 200 && Array.isArray(data.CityList)) {
        setCities(data.CityList);
      } else {
        console.error("API Error: No cities found or invalid response format");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter cities based on search term
  const filteredCities = cities.filter((c) =>
    c.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [isCheckInOpen, setCheckInIsOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState(
    searchParams.checkIn ? new Date(searchParams.checkIn) : null
  );

  const handleCheckInDateChange = (date) => {
    setCheckInDate(date);
    setCheckInIsOpen(false);
  };
  const [isCheckOutOpen, setCheckOutIsOpen] = useState(false);
  const [checkOutDate, setCheckOutDate] = useState(
    searchParams.checkOut ? new Date(searchParams.checkOut) : null
  );

  const handleCheckOutDateChange = (date) => {
    setCheckOutDate(date);
    setCheckOutIsOpen(false);
  };
  const [errorMessage, setErrorMessage] = useState("");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [roomCount, setRoomCount] = useState(searchParams.Rooms);
  const [roomadultCount, setRoomAdultCount] = useState(searchParams.Adults);
  const [roomchildCount, setRoomChildCount] = useState(searchParams.Children);
  const [childrenAges, setChildrenAges] = useState(searchParams.ChildAge || []);
  const calculateRequiredRooms = (adults, children) => {
    // Each room can have:
    // - Max 8 adults AND
    // - Max 4 children AND
    // - Max 12 total people

    const roomsBasedOnAdults = Math.ceil(adults / 2);
    const roomsBasedOnChildren = Math.ceil(children / 2);
    const roomsBasedOnTotal = Math.ceil((adults + children) / 4);

    return Math.max(roomsBasedOnAdults, roomsBasedOnChildren, roomsBasedOnTotal);
  };

  const handleApply = () => {
    const totalAdults = parseInt(roomadultCount) || 0;
    const totalChildren = parseInt(roomchildCount) || 0;
    const selectedRooms = parseInt(roomCount) || 0;

    const requiredRooms = calculateRequiredRooms(totalAdults, totalChildren);

    if (selectedRooms > requiredRooms) {
      setErrorMessage(`Minimum ${requiredRooms} rooms required based on your selection.`);
      return;
    }

    if (selectedRooms < requiredRooms) {
      setErrorMessage(`Minimum ${requiredRooms} rooms required based on your selection.`);
      return;
    }

    // Validate children ages
    if (totalChildren > 0 && childrenAges.some(age => age === "")) {
      setErrorMessage("Please specify ages for all children");
      return;
    }

    setErrorMessage("");
    setIsDropdownOpen(false);
  };
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
      setRoomCount(value);
    }

    // Convert to numbers for calculations
    const totalAdults = parseInt(newRoomAdultCount) || 0;
    const totalChildren = parseInt(newRoomChildCount) || 0;
    const selectedRooms = parseInt(newRoomCount) || 0;

    const requiredRooms = calculateRequiredRooms(totalAdults, totalChildren);

    if (selectedRooms < requiredRooms) {
      setErrorMessage(`Minimum ${requiredRooms} rooms required based on your selection.`);
    } else {
      setErrorMessage(""); // Clear error message when valid selection
    }
  };

  const handleChildAgeChange = (index, age) => {
    const updatedAges = [...childrenAges];
    updatedAges[index] = age;
    setChildrenAges(updatedAges);
  };

  // const handleSelection = (type, value) => {
  //   if (type === "rooms") setRoomCount(value);
  //   if (type === "adults") setRoomAdultCount(value);
  //   if (type === "children") {
  //     setRoomChildCount(value);
  //     setChildrenAges(Array(value).fill(null));
  //   }
  // };

  // const handleChildAgeChange = (index, value) => {
  //   const updatedAges = [...childrenAges];
  //   updatedAges[index] = value;
  //   setChildrenAges(updatedAges);
  // };
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (errorMessage) {
      console.warn("Form contains errors, submission stopped.");
      return;
    }
    setLoader(true);

    let selectedCity = cities.find((c) => city.trim() === c.Name.trim());

    if (!selectedCity && searchParams.filteredCities?.length > 0) {
      selectedCity = searchParams.filteredCities[0];
    }

    const cityCode = selectedCity ? selectedCity.Code : "";

    if (!cityCode) {
      console.error("City code not found for selected city:", city);
      setLoader(false);
      return;
    }

    try {
      const response = await fetch(
        "https://demo.taxivaxi.com/api/hotels/sbtHotelCodesList",
        {
          method: "POST",
          headers: {
            Origin: "*",
            "Access-Control-Request-Method": "POST",
          },
          body: JSON.stringify({
            CityCode: cityCode,
            IsDetailedResponse: "true",
          }),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.Status.Code === 200) {
        const hotels = data.Hotels || [];
        setHotelCityList(hotels);

        if (hotels.length > 0) {
          const codes = hotels.map((hotel) => hotel.HotelCode);
          setHotelCodes(codes);
          await fetchSearchApi(codes);
        } else {
          console.warn("No hotels found in response.");
          setLoader(false);
        }
      } else {
        console.error("Error fetching hotels:", data.Status.Description);
        setLoader(false);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
      setLoader(false);
    }
  };

  const isFetchCitysCalled = useRef(false);

  const fetchSearchApi = async (hotelCodes) => {
    if (!hotelCodes || hotelCodes.length < 3) {
      console.warn("Skipping search: Not enough hotel codes.");
      return;
    }

    const formattedCheckInDate = new Date(checkInDate).toISOString().split("T")[0];
    const formattedCheckOutDate = new Date(checkOutDate).toISOString().split("T")[0];

    let remainingAdults = roomadultCount;
    let remainingChildren = roomchildCount;
    let remainingChildrenAges = [...childrenAges];
    let roomsArray = [];

    const maxAdultsPerRoom = 8;
    const maxChildrenPerRoom = 4;

    while (remainingAdults > 0 || remainingChildren > 0) {
      let allocatedAdults = Math.min(remainingAdults, maxAdultsPerRoom);
      let allocatedChildren = Math.min(remainingChildren, maxChildrenPerRoom);
      let allocatedChildrenAges = remainingChildrenAges.slice(0, allocatedChildren);

      roomsArray.push({
        Adults: allocatedAdults,
        Children: allocatedChildren,
        ChildrenAges: allocatedChildrenAges.length > 0 ? allocatedChildrenAges : null,
      });

      remainingAdults -= allocatedAdults;
      remainingChildren -= allocatedChildren;
      remainingChildrenAges = remainingChildrenAges.slice(allocatedChildren);
    }

    const requestBody = {
      CheckIn: formattedCheckInDate,
      CheckOut: formattedCheckOutDate,
      HotelCodes: hotelCodes.toString(),
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

    try {
      const response = await fetch(
        "https://demo.taxivaxi.com/api/hotels/sbtHotelCodesSearch",
        {
          method: "POST",
          headers: { Origin: "*", "Access-Control-Request-Method": "POST" },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (data.Status.Code === 200) {
        const hotels = data.HotelResult || [];
        setHotelCityLists(hotels);

        const hotelCodesForDetails = hotels
          .map((hotel) => hotel.HotelCode?.toString())
          .filter(code => code && code !== '[object Object]');

        if (!isFetchCitysCalled.current && hotelCodesForDetails.length > 0) {
          isFetchCitysCalled.current = true;  // Mark as called
          await fetchCitys(hotelCodesForDetails);
        }

        setSearchHotelCodes(hotelCodesForDetails);

        sessionStorage.setItem(
          "hotelData_header",
          JSON.stringify({
            checkIn: formattedCheckInDate,
            checkOut: formattedCheckOutDate,
            Rooms: roomCount,
            Adults: roomadultCount,
            Children: roomchildCount,
            ChildAge: childrenAges,
            CityCode: hotelCodes.toString(),
            corporate_name: JSON.parse(sessionStorage.getItem("selectedCompany")) || null,
            City_name: city,
            payment: 1,
          })
        );

        sessionStorage.setItem(
          "hotelSearchData",
          JSON.stringify({ hotelcityList: data.HotelResult })
        );

      } else if (data.Status.Code === 201) {
        setLoader(false);

        Swal.fire({
          title: "Error",
          text: data.Status.Description || "Something went wrong!",
          confirmButtonText: "OK"
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });

        setHotelCityLists([]);
        setSearchHotelCodes([]);

      } else {
        navigate("/ResultNotFound");
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };




  const fetchCitys = async (SearchHotelCodes) => {
    // Validate input and ensure it's a non-empty array of strings/numbers
    if (!Array.isArray(SearchHotelCodes)) {
      console.error("Invalid hotel codes format - expected array");
      return;
    }

    // Filter out any invalid codes and convert to strings
    const validCodes = SearchHotelCodes
      .map(code => {
        if (typeof code === 'object' && code !== null) {
          return code.HotelCode || null; // Handle case where hotel objects might be passed
        }
        return code.toString();
      })
      .filter(code => code && code !== '[object Object]'); // Filter out invalid codes

    if (validCodes.length === 0) {
      console.warn("No valid hotel codes to fetch details for");
      return;
    }

    // Join the valid codes with commas
    const codesString = validCodes.join(',');

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
            Hotelcodes: codesString,
            Language: "EN",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.Status?.Code === 200) {
        setHotelDetails(data.HotelDetails || []);
        sessionStorage.setItem(
          "hotelDetails",
          JSON.stringify(data.HotelDetails || [])
        );
      } else {
        console.error(
          "Error fetching hotel details:",
          data.Status?.Description
        );
      }
    } catch (error) {
      console.error("Error fetching hotel details:", error);
    }

  };




  return (
    <>
      {loader ? (
        <>
          <div className="page-center-loader flex items-center justify-center">
            <div className="big-loader flex items-center justify-center">
              <img
                className="loader-gif"
                src="../img/hotel_loader.gif"
                alt="Loader"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <header className="search-bar2" id="widgetHeader">
            <form onSubmit={handleSubmitForm}>
              <div id="search-widget" className="hsw v2">
                <div className="hsw_inner px-2">
                  <div className="hsw_inputBox tripTypeWrapper grid grid-cols-6 gap-10">
                    <div className="hotel-form-box">
                      <div className="flex gap-2">
                        <h6 className="text-xs hotel-form-text-color">
                          COMPANY
                        </h6>
                        <img
                          src="../img/downarrow.svg"
                          className="w-3 h-4 cursor-pointer"
                          alt="Dropdown"
                          onClick={() => {
                            if (!showDropdown) fetchCompanies();
                            setShowDropdown(!showDropdown);
                          }}
                        />
                      </div>

                      <div className="hotel-city-name-2 relative">
                        <input
                          type="text"
                          className="font-semibold hotel-city"
                          value={company}
                          placeholder="Search Company"
                          onChange={(e) => {
                            setCompany(e.target.value);
                            setShowDropdown(true);
                          }}
                          onClick={() => {
                            fetchCompanies();
                            setShowDropdown(true);
                          }}
                        />

                        {showDropdown && (
                          <ul className="absolute w-full bg-white shadow-md rounded-lg max-h-48 overflow-y-auto mt-1 border border-gray-300 z-50">
                            {loading ? (
                              <li className="p-2 text-gray-500">Loading...</li>
                            ) : companies.length === 0 ? (
                              <li className="p-2 text-gray-500">No companies found</li>
                            ) : (
                              companies
                                .filter(comp =>
                                  comp.toLowerCase().includes(company.toLowerCase())
                                )
                                .map((comp) => (
                                  <li
                                    key={comp}
                                    className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                                    onClick={() => {
                                      setCompany(comp);
                                      setShowDropdown(false);
                                    }}
                                  >
                                    {comp}
                                  </li>
                                ))
                            )}
                          </ul>
                        )}
                      </div>
                    </div>

                    <div className="hotel-form-box">
                      <div className="flex gap-2">
                        <h6 className="text-xs hotel-form-text-color">
                          CITY OR AREA
                        </h6>
                        <img
                          src="../img/downarrow.svg"
                          className="w-3 h-4 cursor-pointer"
                          alt="Dropdown"
                          onClick={() => {
                            if (!showDropdown) fetchCities();
                            setShowDropdown2(!showDropdown);
                          }}
                        />
                      </div>

                      <div className="hotel-city-name-2 relative">
                        <input
                          type="text"
                          className="font-semibold hotel-city"
                          value={city}
                          placeholder="Search City"
                          onChange={(e) => {
                            setCity(e.target.value);
                            setShowDropdown2(true); // Show dropdown when typing
                          }}
                          onClick={() => {
                            fetchCities();
                            setShowDropdown2(true);
                          }}
                        />

                        {showDropdown2 && (
                          <ul className="absolute top-full left-0 w-full bg-white border shadow-md max-h-60 overflow-auto z-10">
                            {loading ? (
                              <li className="p-2 text-gray-500">Loading...</li>
                            ) : (
                              cities
                                .filter(c =>
                                  c.Name.toLowerCase().includes(city.toLowerCase())
                                )
                                .map((c) => (
                                  <li
                                    key={c.Code}
                                    className="p-2 cursor-pointer hover:bg-gray-200"
                                    onClick={() => {
                                      setCity(c.Name);
                                      setShowDropdown2(false);
                                    }}
                                  >
                                    {c.Name}
                                  </li>
                                ))
                            )}
                          </ul>
                        )}
                      </div>
                    </div>
                    <div className="hotel-form-box">
                      {/* Header - Click to Open Date Picker */}
                      <div
                        className="flex gap-2 cursor-pointer"
                        onClick={() => setCheckInIsOpen(true)}
                      >
                        <h6 className="text-xs hotel-form-text-color">
                          CHECK-IN DATE
                        </h6>
                        <img
                          src="../img/downarrow.svg"
                          className="w-3 h-4"
                          alt="Down Arrow"
                        />
                      </div>

                      <div className="hotel-city-name-2">
                        <div
                          className="font-semibold hotel-city cursor-pointer"
                          onClick={() => setCheckInIsOpen(true)}
                        >
                          {checkInDate
                            ? checkInDate.toLocaleDateString("en-GB")
                            : "Select Check-in Date"}
                        </div>

                        {/* DatePicker (Absolute Positioned Below Header) */}
                        {isCheckInOpen && (
                          <DatePicker
                            selected={checkInDate}
                            dateFormat="dd/MM/yyyy"
                            minDate={new Date()} // Prevent past dates
                            onChange={(date) => {
                              handleCheckInDateChange(date);
                              setCheckInIsOpen(false); // Close on selection
                            }}
                            inline // Shows date picker below header
                            onClickOutside={() => setCheckInIsOpen(false)}
                          />
                        )}
                      </div>
                    </div>

                    <div className="hotel-form-box ">
                      {/* Header - Click to Open Date Picker */}
                      <div
                        className="flex gap-2 cursor-pointer"
                        onClick={() => setCheckOutIsOpen(true)}
                      >
                        <h6 className="text-xs hotel-form-text-color">
                          CHECK-OUT DATE
                        </h6>
                        <img
                          src="../img/downarrow.svg"
                          className="w-3 h-4"
                          alt="Down Arrow"
                        />
                      </div>

                      <div className="hotel-city-name-2">
                        <div
                          className="font-semibold hotel-city cursor-pointer"
                          onClick={() => setCheckOutIsOpen(true)}
                        >
                          {checkOutDate
                            ? checkOutDate.toLocaleDateString("en-GB")
                            : "Select Check-out Date"}
                        </div>

                        {/* DatePicker (Absolute Positioned) */}
                        {isCheckOutOpen && (
                          <DatePicker
                            selected={checkOutDate}
                            dateFormat="dd/MM/yyyy"
                            minDate={checkInDate || new Date()} // Check-Out cannot be before Check-In
                            onChange={(date) => handleCheckOutDateChange(date)}
                            inline // Displays inline instead of input field
                            onClickOutside={() => setCheckOutIsOpen(false)} // Close when clicking outside
                          />
                        )}
                      </div>
                    </div>
                    <div className="hotel-form-box ">
                      <div
                        className="flex gap-2 cursor-pointer"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        <h6 className="text-xs hotel-form-text-color">
                          ROOMS & GUESTS
                        </h6>
                        <img
                          src="../img/downarrow.svg"
                          className="w-3 h-4"
                          alt="Down Arrow"
                        />
                      </div>
                      <p className="hotel-city-name-2 font-semibold whitespace-nowrap">
                        {roomCount} Rooms, {roomadultCount} Adults,{" "}
                        {roomchildCount} Childs
                      </p>

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
                    <button className="search-buttonn rounded-lg">
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </header>
          {isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-3xl p-5 relative">
                <button
                  className="absolute top-2 right-2 text-gray-600"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </button>

                {/* Ensure the map loads correctly */}
                {isLoaded && (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={10}
                    center={mapCenter}
                  >
                    {hotelDetails.map((hotel) => {
                      if (!hotel.Map) return null;

                      const coordinates = hotel.Map.split("|").map(Number);
                      if (coordinates.length === 2) {
                        return (
                          <Marker
                            key={hotel.HotelCode}
                            position={{
                              lat: coordinates[0],
                              lng: coordinates[1],
                            }}
                            label={{
                              text: hotel.HotelName || "Unnamed Hotel",
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "14px",
                            }}
                          >
                            <InfoWindow
                              position={{
                                lat: coordinates[0],
                                lng: coordinates[1],
                              }}
                            >
                              <div className="text-sm font-semibold text-gray-700">
                                <div className="flex items-center justify-between">
                                  <span>
                                    {hotel.HotelName || "Unnamed Hotel"}
                                  </span>
                                </div>
                              </div>
                            </InfoWindow>
                          </Marker>
                        );
                      }
                      return null;
                    })}
                  </GoogleMap>
                )}
              </div>
            </div>
          )}

          {/* {showModal1 && (
  <div className="fixed inset-0 z-50 flex items-end justify-end">
  
    <div 
      className="fixed inset-0 bg-black opacity-25" 
      onClick={() => setShowModal1(false)}
    ></div>
    
  
    <div className="bg-white shadow-md rounded-lg max-w-xs w-full relative h-auto mr-4 mb-4 z-50">
      <div className="flex bg-black px-2 h-8 py-2 items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Selected Hotels</h3>
        <button
          onClick={() => setShowModal1(false)}
          className="text-gray-300 hover:text-gray-300"
        >
          ✖
        </button>
      </div>

      {selectedHotels.length > 0 ? (
        selectedHotels.map((hotel, index) => (
          <div
            key={index}
            className="flex justify-between items-center mb-2 p-2 border-b border-gray-200"
          >
            <div>
              <span className="text-sm">{hotel.name}</span>
              <br />
              <span className="text-xs text-gray-600">
                ₹ {hotel.price}
              </span>
            </div>
            <button
              onClick={() => handleRemoveHotel(hotel.name)}
              className="text-red-500 text-sm hover:text-red-700"
            >
              ✖
            </button>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 p-2">No hotels selected.</p>
      )}
    </div>
  </div>
)} */}

          {showModal2 && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
              <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-3xl p-5 relative hotel_photos_container">
                <button
                  className="absolute top-2 right-2 text-gray-600"
                  onClick={() => setShowModal2(false)}
                >
                  Close
                </button>
                <div
                  className="grid grid-cols-3 gap-2 hotel_images_container "
                  style={{ pointerEvents: "none" }}
                >
                  {selectedHotel.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Hotel Image ${index + 1}`}
                      className="hotel_photos_all"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="yield-content" style={{ background: "#e8e4ff" }}>
            <div className="flex card-container ">
              <div className="w-1/3 items-center justify-center p-4">
                <div className="mb-5">
                  <div
                    className="max-w-[19rem] w-full bg-white shadow-lg rounded border cursor-pointer"
                    onClick={() => setIsOpen(true)}
                  >
                    <div className="relative">
                      {/* Small Map Preview */}
                      <GoogleMap
                        mapContainerStyle={{
                          width: "100%",
                          height: "150px",
                          borderRadius: "8px",
                        }}
                        zoom={15}
                        center={mapCenter}
                      >
                        {/* Marker at Hotel Location */}
                        <Marker position={mapCenter} />
                      </GoogleMap>

                      {/* Overlay Text */}
                      <h6 className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-700 text-xs font-semibold mb-4 bg-white p-2 rounded">
                        EXPLORE ON MAP
                      </h6>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full items-center justify-center">
                <p className="py-7 px-6 heading-line mb-0">
                  Showing Properties in {cityName}
                </p>

                {combinedHotels.length > 0 ? (
                  combinedHotels.map((hotel) => (
                    <div
                      key={hotel.HotelCode}
                      className="w-full py-2 px-3 transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                      onClick={() =>
                        navigate("/HotelDetail", { state: { hotel } })
                      }
                    >
                      <div className="max-w-[57rem] w-full flex flex-cols bg-white shadow-md rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none transition-shadow duration-300 hover:shadow-lg">
                        <div className="py-3 px-3 w-1/3">
                          <div className="photos-container">
                            {Array.isArray(hotel.Images) &&
                              hotel.Images.length > 0 ? (
                              <>
                                <img
                                  src={hotel.Images[0]}
                                  alt="Hotel"
                                  className="hotel-photo"
                                />
                                <div className="grid grid-cols-4 gap-2 py-1">
                                  {hotel.Images.slice(1, 5).map(
                                    (image, index) => (
                                      <div
                                        key={index}
                                        className="image-container relative"
                                      >
                                        <img
                                          src={image}
                                          alt={`Hotel ${index + 1}`}
                                          className={`hotel-photos ${index === 3 ? "blur-sm" : ""
                                            }`}
                                        />
                                        {index === 3 && (
                                          <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
                                            <span
                                              className="text-white text-xs font-semibold cursor-pointer"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setShowModal2(true);
                                                setSelectedHotel(hotel.Images);
                                              }}
                                            >
                                              View All
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              </>
                            ) : (
                              <img
                                src="./img/image_NA05.png"
                                className="h-full "
                              ></img>
                            )}
                          </div>
                        </div>

                        <div className="w-1/2 py-3 px-1">
                          <h3 className="text-lg font-semibold">
                            {hotel.HotelName || "No Name Available"}
                          </h3>
                          <p className="text-sm font-semibold hotel-form-text-color">
                            {hotel.CityName || "No City Available"} |{" "}
                            <span className="text-xs text-gray-500">
                              {extractAttraction(hotel.Description)}
                            </span>
                          </p>
                          <div className="flex flex-wrap gap-3 text-xs mb-2">
                            {hotel?.HotelFacilities && (
                              <>
                                {[
                                  {
                                    keyword: "restaurant",
                                    label: "Restaurant",
                                    icon: "/img/Food.svg",
                                  },
                                  {
                                    keyword: "elevator",
                                    label: "Elevator",
                                    icon: "/img/Elevator.svg",
                                  },
                                  {
                                    keyword: "conference",
                                    label: "Conference Space",
                                    icon: "/img/Conference_Room.svg",
                                  },
                                ]
                                  .filter(({ keyword }) =>
                                    hotel.HotelFacilities.some((facility) =>
                                      facility.toLowerCase().includes(keyword)
                                    )
                                  )
                                  .map(({ icon, label }, index) => (
                                    <span
                                      key={index}
                                      className="flex items-center gap-2"
                                    >
                                      <img
                                        src={icon}
                                        alt={label}
                                        className="w-5 h-5"
                                      />
                                      {label}
                                    </span>
                                  ))}

                                {/* If no matching facilities, show first three with tick sign */}
                                {[
                                  {
                                    keyword: "restaurant",
                                  },
                                  {
                                    keyword: "elevator",
                                  },
                                  {
                                    keyword: "conference",
                                  },
                                ].every(({ keyword }) =>
                                  hotel.HotelFacilities.every(
                                    (facility) =>
                                      !facility.toLowerCase().includes(keyword)
                                  )
                                ) &&
                                  hotel.HotelFacilities.slice(0, 3).map(
                                    (facility, index) => (
                                      <span
                                        key={index}
                                        className="flex items-center gap-2"
                                      >
                                        <span className="text-black-500">
                                          &#8226;
                                        </span>
                                        {facility}
                                      </span>
                                    )
                                  )}
                              </>
                            )}
                          </div>

                          <div className="mb-3">
                            {hotel?.Rooms?.[0]?.Inclusion && (
                              <div className="text-xs  mt-1 flex gap-2 ">
                                {hotel.Rooms[0].Inclusion.split(",").map(
                                  (item, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center"
                                    >
                                      <span className="text-black-500 mr-1">
                                        ✓
                                      </span>
                                      <span>{item.trim()}</span>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>

                          <div className="text-xs text-green-700">
                            {formatCancelPolicies(
                              hotel?.Rooms?.[0]?.CancelPolicies || []
                            ).length > 0 ? (
                              formatCancelPolicies(
                                hotel?.Rooms?.[0]?.CancelPolicies || []
                              ).map((policy, index) => (
                                <div key={index} className="flex gap-2">
                                  <img
                                    src="../img/tick.svg"
                                    className="w-3 h-5"
                                    alt="✔"
                                  />{" "}
                                  {policy}
                                </div>
                              ))
                            ) : (
                              <p className="text-xs  hotel-form-text-color ">
                                No Cancellation Policy Available
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="w-1/4 py-3 px-3 flex flex-col items-end border-l border-gray-300">
                          <div className="flex items-center gap-2">
                            <span className="hotel-form-text-color text-lg font-semibold">
                              {renderRatingText(hotel.HotelRating)}
                            </span>
                            <div className="border border-gray-300 px-2 flex items-center text-sm rating-color font-semibold">
                              {hotel.HotelRating}
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 mb-4">
                            {renderStars(hotel.HotelRating)}
                          </div>

                          <div
                            className="relative text-right"
                            onMouseEnter={() =>
                              setHoveredHotel(hotel.HotelCode)
                            }
                            onMouseLeave={() => setHoveredHotel(null)}
                          >
                            <span className="text-lg font-semibold hotel-form-text-color block">
                              ₹ {hotel.Rooms?.[0]?.TotalFare || "N/A"}
                            </span>
                            <span className="text-xs block">
                              + ₹ {hotel.Rooms?.[0]?.TotalTax || "0"} taxes &
                              fees
                            </span>
                            {hoveredHotel === hotel.HotelCode && hotel.Rooms?.[0] && (
                              <div className="fixed right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-3 border border-gray-300 z-50">
                                {/* Get Room[0] Details */}
                                {hotel.Rooms[0].DayRates?.map((dayRateArray, index) => {
                                  // Calculate total base fare for this dayRate array
                                  const totalBaseFare = dayRateArray.reduce(
                                    (total, rate) => total + (rate?.BasePrice || 0),
                                    0
                                  );

                                  return (
                                    <div key={index}>
                                      {/* Title & Total Price Section */}
                                      <div className="flex justify-between items-center pb-2">
                                        <h6 className="font-semibold text-gray-700 text-xs">
                                          Room {index + 1} price × {dayRateArray.length} Days
                                        </h6>
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md font-medium text-xs">
                                          ₹ {totalBaseFare.toFixed(2)}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                          </div>

                          <div className="flex mt-5 justify-end gap-2 w-full">
                            {booknow === 0 && (


                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleHotelSelect(hotel);
                                }}
                                className={`bg-[#785ef7] w-[91px] h-7 text-white px-2 rounded-md font-semibold text-xs transition duration-300 hover:bg-[#5a3ec8] ${selectedHotels.some(
                                  (h) => h.name === hotel.HotelName
                                )
                                    ? ""
                                    : ""
                                  }`}
                              >
                                {selectedHotels.some(
                                  (h) => h.name === hotel.HotelName
                                ) ? (
                                  <span className="flex items-center gap-2 text-xs">
                                    Added{" "}
                                    <img
                                      src="../img/cros.png"
                                      className="w-3 h-3"
                                      alt="Remove"
                                    />
                                  </span>
                                ) : (
                                  "Add to Share"
                                )}
                              </button>
                            )}
                            {/* Conditionally show "Book Now" button */}
                            {agent_portal === "0" && (
                              <button className="button_book text-xs w-[91px] h-7">
                                Book Now
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No hotels found</p>
                )}

                {selectedHotels.length > 0 && (
                  <div
                    className="fixed bottom-0 right-0 mb-2 ml-2 bg-white  hotel_booking_cards shadow-md justify-end h-auto"
                    style={{ width: "25%" }}
                  >
                    <div className="flex bg-black px-3 h-9  items-center justify-between rounded-t-md">
                      <h3 className="text-sm font-semibold text-white  ">
                        Selected Hotels
                      </h3>
                      <button
                        className="text-gray-300 hover:text-gray-300"
                        onClick={() => setSelectedHotels([])}
                      >
                        ✖
                      </button>
                    </div>
                    <div className="px-3 py-1">
                      {selectedHotels.map((hotel, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center border-b  "
                        >
                          <div className="flex-1">
                            <span className="text-xs font-semibold">
                              {hotel.name}
                            </span>
                            <p className="text-xs font-semibold hotel-form-text-color">
                              {hotel.cityName || "No City Available"} |{" "}
                              <span className="text-xs text-gray-500">
                                {extractAttraction(hotel.Description)}
                              </span>
                            </p>
                          </div>
                          <span className="text-xs font-semibold mr-2">
                            ₹{hotel.price}
                          </span>
                          <button
                            onClick={() =>
                              setSelectedHotels((prev) =>
                                prev.filter((h) => h.name !== hotel.name)
                              )
                            }
                            className="w-5 h-5 flex items-center justify-center cursor-pointer"
                          >
                            <img
                              src="../img/Close-01.svg"
                              className="w-4 h-4"
                              alt="Remove"
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex bg-black px-2 h-9 py-2 items-center justify-between rounded-b-md">
                      <button
                        type="button"
                        className="bg-[#785ef7] h-6 text-white px-2 rounded-lg text-xs ml-auto"
                        onClick={handleShareOptions}
                      >
                        Share hotel options
                      </button>
                    </div>
                  </div>
                )}
                {isModalOpen && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-1/2">
                      <div className="flex justify-between items-center pb-2 modal2 px-4 py-3">
                        <h2 className="text-xl font-semibold">Share With</h2>
                        <button
                          onClick={handleCancel}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <img src="../img/cros.png" className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="py-3 px-4">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor="clientName"
                                className="text-sm font-semibold"
                              >
                                Client Name
                              </label>
                              <input
                                id="clientName"
                                name="clientName"
                                type="text"
                                placeholder="Enter Client Name"
                                className="frmTextInput2"
                                value={searchParams.corporate_name}
                              // onChange={handleChange}
                              />
                              {errors.clientName && (
                                <p className="text-red-500 text-xs">
                                  {errors.clientName}
                                </p>
                              )}
                            </div>
                            <div>
                              <label
                                htmlFor="spocName"
                                className="text-sm font-semibold"
                              >
                                SPOC Name
                              </label>
                              <input
                                id="spocName"
                                name="spocName"
                                type="text"
                                placeholder="SPOC Name"
                                className="frmTextInput2"
                                value={formData.spocName}
                                onChange={handleChange}
                              />
                              {errors.spocName && (
                                <p className="text-red-500 text-xs">
                                  {errors.spocName}
                                </p>
                              )}
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="spocEmail"
                              className="text-sm font-semibold"
                            >
                              Approver Email
                            </label>
                            <input
                              id="spocEmail"
                              name="spocEmail"
                              type="text"
                              placeholder="Enter Email"
                              className="frmTextInput2"
                              value={formData.spocEmail}
                              onChange={handleChange}
                            />

                            {errors.spocEmail && (
                              <p className="text-red-500 text-xs">
                                {errors.spocEmail}
                              </p>
                            )}
                          </div>
                          <div>
                            {/* Additional Emails (To) */}
                            <label
                              htmlFor="toEmail"
                              className="text-sm font-semibold"
                            >
                              Additional Email
                            </label>
                            <div className="flex flex-wrap gap-2 border border-gray-300 rounded-md p-2 text-xs">
                              {toEmailList.map((emailItem, index) => (
                                <Chip
                                  key={index}
                                  label={emailItem}
                                  variant="outlined"
                                  onDelete={() =>
                                    handleDelete(emailItem, setToEmailList)
                                  }
                                />
                              ))}
                              <input
                                id="toEmail"
                                name="toEmail"
                                type="text"
                                placeholder="Enter Email"
                                className="flex-1 min-w-[150px] border-none outline-none"
                                value={toEmail}
                                onChange={(e) => setToEmail(e.target.value)}
                                onBlur={() =>
                                  handleAddEmail(
                                    toEmail,
                                    setToEmail,
                                    toEmailList,
                                    setToEmailList,
                                    "toEmail"
                                  )
                                }
                                onKeyDown={(e) =>
                                  handleKeyDown(
                                    e,
                                    toEmail,
                                    setToEmail,
                                    toEmailList,
                                    setToEmailList,
                                    "toEmail"
                                  )
                                }
                              />
                            </div>
                            {errors.toEmail && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.toEmail}
                              </p>
                            )}

                            {/* CC Emails */}
                            <label
                              htmlFor="ccEmail"
                              className="text-sm font-semibold mt-3"
                            >
                              CC Email
                            </label>
                            <div className="flex flex-wrap gap-2 border border-gray-300 rounded-md p-2 text-xs">
                              {ccEmailList.map((emailItem, index) => (
                                <Chip
                                  key={index}
                                  label={emailItem}
                                  variant="outlined"
                                  onDelete={() =>
                                    handleDelete(emailItem, setCcEmailList)
                                  }
                                />
                              ))}
                              <input
                                id="ccEmail"
                                name="ccEmail"
                                type="text"
                                placeholder="Enter CC Email"
                                className="flex-1 min-w-[150px] border-none outline-none"
                                value={ccEmail}
                                onChange={(e) => setCcEmail(e.target.value)}
                                onBlur={() =>
                                  handleAddEmail(
                                    ccEmail,
                                    setCcEmail,
                                    ccEmailList,
                                    setCcEmailList,
                                    "ccEmail"
                                  )
                                }
                                onKeyDown={(e) =>
                                  handleKeyDown(
                                    e,
                                    ccEmail,
                                    setCcEmail,
                                    ccEmailList,
                                    setCcEmailList,
                                    "ccEmail"
                                  )
                                }
                              />
                            </div>
                            {errors.ccEmail && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.ccEmail}
                              </p>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="remark"
                              className="text-sm font-semibold"
                            >
                              Remark
                            </label>
                            <input
                              id="remark"
                              name="remark"
                              type="text"
                              className="frmTextAreaInput2"
                              value={formData.remark}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  remark: e.target.value,
                                })
                              } // ✅ Update remark field
                            />

                            {errors.remark && (
                              <p className="text-red-500 text-xs">
                                {errors.remark}
                              </p>
                            )}
                          </div>
                          <div className="flex justify-end">
                            <button
                              type="submit"
                              className="bg-[#785ef7] text-white px-3 py-1 text-sm"
                            >
                              SEND
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SearchHotel;
