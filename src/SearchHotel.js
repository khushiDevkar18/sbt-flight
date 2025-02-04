import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { X } from "@mui/icons-material";
import { Dialog, Transition } from "@headlessui/react";
import Swal from "sweetalert2";

import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";

// //console.log("asdafdsfa");

const SearchHotel = () => {
  const location = useLocation();
  const hotelList = location.state?.hotelList || [];
  const searchParams = location.state?.searchParams || {};

  console.log("Received Hotel List:", searchParams);
  // //console.log("Hotel Attractions:", hotel.Attractions);

  const [hotelDetails, setHotelDetails] = useState([]);
  const hotelcodes = localStorage.getItem("hotelDetails");
  // //console.log(hotelcodes);
  useEffect(() => {
    const fetchCity = async () => {
      const codes = hotelList.map((hotel) => hotel.HotelCode);
      const hotelcodes = codes.toString(); // Convert array to comma-separated string

      try {
        const response = await fetch(
          "https://cors-anywhere.herokuapp.com/https://demo.taxivaxi.com/api/hotels/sbtHotelDetails",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Hotelcodes: hotelcodes,
              Language: "EN",
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Hotel data:", data);

        if (data.success === "1" && data.response.Status.Code === 200) {
          setHotelDetails(data.response.HotelDetails || []);
          localStorage.setItem(
            "hotelDetails",
            JSON.stringify(data.response.HotelDetails || [])
          );

          // ✅ Fix: Use `data.response.HotelDetails` instead of `hotels`
          const validHotels = (data.response.HotelDetails || []).filter(
            (hotel) => hotel.Map
          );
          if (validHotels.length > 0) {
            const firstHotel = validHotels[0];
            const coordinates = firstHotel.Map.split("|").map(Number);
            setMapCenter({ lat: coordinates[0], lng: coordinates[1] }); // ✅ Update map center
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
  }, [hotelList]);

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
        {Array(fullStars).fill(<FaStar className="text-yellow-500" />)}
        {Array(emptyStars).fill(<FaRegStar className="text-gray-300" />)}
      </>
    );
  };

  // Extract and clean attractions from the provided data
  const extractAttraction = (attractions) => {
    if (!attractions || Object.keys(attractions).length === 0) {
      return "No Attractions Available";
    }

    //console.log("Raw Attractions Data:", attractions); // Debugging Log

    // Convert object values into a single string
    const attractionText = Object.values(attractions).join("\n");

    // Extract the first paragraph and clean HTML tags
    const firstAttraction = attractionText
      .replace(/<br\s*\/?>/gi, "\n") // Replace <br> with new lines
      .replace(/<\/?p>/gi, "") // Remove <p> tags
      .split("\n")[0] // Get the first paragraph only
      .trim(); // Remove extra spaces

    return firstAttraction || "No Attractions Available";
  };
  const mapContainerStyle = {
    width: "100%",
    height: "400px", // Ensure height is set, otherwise the map won't show
  };

  const defaultCenter = { lat: 40.7128, lng: -74.006 };
  // //console.log(storedCities);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 });

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenImage, setIsOpenImage] = useState(false);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCnfQ-TTa0kZzAPvcgc9qyorD34aIxaZhk", // Use environment variables for security
  });
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
  const formatCancelPolicies = (cancelPolicies) => {
    if (!Array.isArray(cancelPolicies) || cancelPolicies.length === 0) {
      return "No cancellation policies available.";
    }

    return cancelPolicies
      .map((policy, index) => {
        if (policy.ChargeType === "Fixed" && policy.CancellationCharge === 0) {
          return `Free Cancellation till check-in`;
        } else if (policy.ChargeType === "Percentage") {
          return `Cancellation charge of ${policy.CancellationCharge}%`;
        }
        return `Policy: From ${policy.FromDate}`;
      })
      .join(" | ");
  };
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split("-").map(Number);
    if (!year || !month || !day) return null; // Ensure valid numbers
    return new Date(year, month - 1, day); // JS months are 0-based
  };

  // Function to format date as DD-MM-YYYY
  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return ""; // Check if valid date
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // State initialization with parsed dates from searchParams
  const [checkInDate, setCheckInDate] = useState(
    parseDate(searchParams.checkIn) || new Date()
  );
  const [checkOutDate, setCheckOutDate] = useState(
    parseDate(searchParams.checkOut) || new Date()
  );
  const [isCheckInOpen, setCheckInIsOpen] = useState(false);
  const [isCheckOutOpen, setCheckOutIsOpen] = useState(false);
  // console.log( 'previous date ',searchParams.checkIn);
  // console.log('Displayed date ',parseDate(searchParams.checkIn));
  console.log('actual date displayed',formatDate(checkInDate))
  // Handle date changes
  const handleCheckInDateChange = (date) => {
    setCheckInDate(date);
  };

  const handleCheckOutDateChange = (date) => {
    setCheckOutDate(date);
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Control dropdown visibility
  const [roomCount, setRoomCount] = useState(searchParams.Rooms);
  const [roomadultCount, setRoomAdultCount] = useState(searchParams.Adults);
  const [roomchildCount, setRoomChildCount] = useState(searchParams.Children);
  const [childrenAges, setChildrenAges] = useState(
    searchParams.childrenAges || []
  );

  const handleToggleHotel = () => {
    setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility
  };

  const handleSelection = (type, value) => {
    if (type === "children") {
      setRoomChildCount(value);
      setChildrenAges(new Array(value).fill(null)); // Initialize children ages
    } else if (type === "adults") {
      setRoomAdultCount(value);
    } else if (type === "rooms") {
      setRoomCount(value);
    }
  };
  const handleChildAgeChange = (index, age) => {
    const updatedAges = [...childrenAges];
    updatedAges[index] = age;
    setChildrenAges(updatedAges);
  };
  const [cityList, setCityList] = useState([]); // List of cities
  const [filteredCities, setFilteredCities] = useState([]); // Filtered list
  const [showDropdown, setShowDropdown] = useState(false); // Controls dropdown visibility
  const [cityName, setCityName] = useState(
    searchParams.filteredCities[0]?.Name || ""
  ); // Default city
  const [isTyping, setIsTyping] = useState(false);
  useEffect(() => {
    const storedCities = sessionStorage.getItem("cityList");

    if (storedCities) {
      // Use stored data if available
      const parsedCities = JSON.parse(storedCities);
      setCityList(parsedCities);
      setFilteredCities(parsedCities);
    } else {
      // Fetch API data only if not available in sessionStorage
      const fetchCities = async () => {
        try {
          const response = await fetch(
            "https://cors-anywhere.herokuapp.com/https://demo.taxivaxi.com/api/hotels/sbtCityList",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ CountryCode: "IN" }),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          if (data.success === "1" && data.response.Status.Code === 200) {
            const cityList = data.response.CityList || [];
            setCityList(cityList);
            setFilteredCities(cityList);

            // Store in sessionStorage
            sessionStorage.setItem("cityList", JSON.stringify(cityList));
          } else {
            console.error(
              "Error fetching cities:",
              data.response.Status.Description
            );
          }
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      };

      fetchCities();
    }
  }, []);

  // Handle input change and filter city list
  const handleInputChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setCityName(searchValue);

    const filtered = cityList.filter((city) =>
      city.Name.toLowerCase().includes(searchValue)
    );
    setFilteredCities(filtered);
    setShowDropdown(true); 
    setIsTyping(true);// Show dropdown when searching
  };

  // Handle city selection
  const handleCitySelect = (city) => {
    
    setCityName(city.Name); // Set selected city name
    setShowDropdown(false); // Hide dropdown
  };
 const [hotelcityList, setHotelCityList] = useState([]);
  const [hotelCodes, setHotelCodes] = useState([]);
  console.log(hotelCodes);
 useEffect(() => {
     const fetchCity = async () => {
       if (filteredCities.length === 0) return; // Ensure filteredCities has data
 
       const cityCode = filteredCities[0]?.Code; // Get the first city's code
       // if (!cityCode) return; // Avoid API call if cityCode is null
 
       console.log("Fetching hotels for City Code:", cityCode);
 
       // console.log('TB Hotel Code List')
 
       try {
         const response = await fetch(
           "https://cors-anywhere.herokuapp.com/https://demo.taxivaxi.com/api/hotels/sbtHotelCodesList",
           {
             method: "POST",
             headers: {
               "Content-Type": "application/json",
              //  Authorization: `Basic ${btoa("TBOStaticAPITest:Tbo@11530818")}`,
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
         // console.log("Hotel :", data);
 
         if (data.success === "1" && data.response.Status.Code === 200) {
           const hotels = data.response.Hotels || []; // Fix: Access Hotels from data.response
           setHotelCityList(hotels);
 
           if (hotels.length > 0) {
             const codes = hotels.map((hotel) => hotel.HotelCode);
             // console.log(codes);
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
   }, [filteredCities]);
   const formatDate1 = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

    const handleHotelSearch = async (e) => {
       e.preventDefault();
   
       const checkIn = checkInDate ? formatDate1(checkInDate) : "";
  const checkOut = checkOutDate ? formatDate1(checkOutDate) : "";
       const Rooms = roomCount;
       const Adults = roomadultCount;
       const Children = roomchildCount;
       const ChildAge = childrenAges;
       const CityCode = hotelCodes.toString();
       // console.log(CityCode);
       console.log("Check-In Date:", checkIn);
       console.log("Check-Out Date:", checkOut);
       console.log("Rooms:", Rooms);
       console.log("Adults:", Adults);
       console.log("Children:", Children);
       console.log("Children Ages:", ChildAge);
       console.log("City Code:", CityCode);
       const requestBody = {
         CheckIn: checkIn,
         CheckOut: checkOut,
         HotelCodes: CityCode,
         GuestNationality: "IN",
         PaxRooms: [
           {
             Adults: Adults,
             Children: Children,
             ChildrenAges: ChildAge,
           },
         ],
         ResponseTime: 23.0,
         IsDetailedResponse: true,
         Filters: {
           Refundable: false,
           NoOfRooms: 1,
           MealType: 0,
           OrderBy: 0,
           StarRating: 0,
           HotelName: null,
         },
       };
   
       // console.log("Authorization Header:", `Basic ${btoa("Bai:Bai@12345")}`);
   
       try {
         const response = await fetch(
           "https://cors-anywhere.herokuapp.com/https://demo.taxivaxi.com/api/hotels/sbtHotelCodesSearch",
           {
             method: "POST",
             headers: {
               "Content-Type": "application/json",
               // Authorization: `Basic ${btoa("Bai:Bai@12345")}`,
             },
             body: JSON.stringify(requestBody),
           }
         );
   
         if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
         }
   
         const data = await response.json();
         console.log("Hotel data:", data);
         if (data.success === "1" && data.response.Status.Code === 200) {
           setHotelCityList(data.response.HotelResult || []);
          //  console.log("asd");
           // navigate("/SearchFlight", { state: { responseData } });
           const searchState = {
            hotelList: data.response.HotelResult,
            searchParams: {
              checkIn,
              checkOut,
              Rooms,
              Adults,
              Children,
              ChildAge,
              CityCode,
              filteredCities,
            },
          };
          
          // Store in sessionStorage
          sessionStorage.setItem("searchState", JSON.stringify(searchState));
          
          // Navigate to SearchHotel
          // navigate("/SearchHotel");
          
           // navigate("/SearchHotel", { state: { hotelList: data.HotelResult } });
         } else {
           Swal.fire({
             // icon: "error",
             title: "Error",
             text: data.response.Status.Description || "Something went wrong!",
           });
         }
       } catch (error) {
         console.error("Error fetching hotels:", error);
   
         Swal.fire({
           icon: "error",
           title: "Request Failed",
           text: error.message || "Failed to fetch hotel data.",
         });
       }
     };
  return (
    <>
      <div className="panel">
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
                  zoom={10} // You can adjust this zoom level
                  center={mapCenter}
                >
                  {hotelDetails.map((hotel) => {
                    if (!hotel.Map) return null;

                    const coordinates = hotel.Map.split("|").map(Number);
                    // console.log(
                    //   "Coordinates for hotel:",
                    //   hotel.HotelName,
                    //   coordinates
                    // ); // Log coordinates

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
                            background: "black",
                            padding: "6px",
                            borderRadius: "5px",
                          }}
                        >
                          <InfoWindow
                            position={{
                              lat: coordinates[0],
                              lng: coordinates[1],
                            }}
                          >
                            <div className="text-sm font-semibold text-gray-700">
                              {/* Flex container to style InfoWindow */}
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
      </div>
      <div className="yield-content" style={{ background: "#e8e4ff" }}>
        <header className="search-bar2" id="widgetHeader">
        <form onSubmit={handleHotelSearch}>
            <div id="search-widget" className="hsw v2">
              <div className="hsw_inner" style={{ marginLeft: "4%" }}>
                <div className="hsw_inputBox tripTypeWrapper grid grid-cols-5 gap-10">
                
                  <div className="hotel-form-box relative">
                   
                    {/* Clickable div to trigger dropdown */}
                    <div
                      className="flex gap-2"
                      onClick={() => setShowDropdown(true)}
                    >
                      <h6 className="text-xs hotel-form-text-color">
                        CITY, AREA OR PROPERTY
                      </h6>
                      <img src="../img/downarrow.svg" className="w-3 h-4" />
                    </div>

                    {/* Searchable input field */}
                    <input
                      type="text"
                      className="hotel-city-name-2 font-semibold "
                      value={cityName}
                      onChange={handleInputChange}
                      placeholder="Search City"
                      onFocus={() => setShowDropdown(true)} // Show dropdown when input is focused
                    />

                    {/* Dropdown for city selection */}
                    {showDropdown && filteredCities.length > 0 && (
                      <div className="absolute w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-y-auto z-10 dropdown-size">
                        {filteredCities.map((city) => (
                          <div
                            key={city.Code}
                            className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleCitySelect(city)}
                          >
                            {city.Name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="hotel-form-box">
                    <div
                      className="flex gap-2"
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
                      {isCheckInOpen ? (
                        <DatePicker
                          selected={checkInDate}
                          dateFormat="dd/MM/yyyy"
                          minDate={new Date()} // Prevent past dates
                          onChange={(date) => {
                            handleCheckInDateChange(date || "null");
                            setCheckInIsOpen(false);
                          }}
                          open={isCheckInOpen}
                          onClickOutside={() => setCheckInIsOpen(false)}
                        />
                      ) : (
                        <p>{formatDate(checkInDate)}</p>
                      )}
                    </div>
                  </div>

                  {/* CHECK-OUT DATE */}
                  <div className="hotel-form-box">
                    <div
                      className="flex gap-2"
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
                      {isCheckOutOpen ? (
                        <DatePicker
                          selected={checkOutDate}
                          dateFormat="dd/MM/yyyy"
                          minDate={checkInDate} // Ensure checkout is after check-in
                          onChange={(date) => {
                            handleCheckOutDateChange(date || "null");
                            setCheckOutIsOpen(false);
                          }}
                          open={isCheckOutOpen}
                          onClickOutside={() => setCheckOutIsOpen(false)}
                        />
                      ) : (
                        <p>{formatDate(checkOutDate)}</p>
                      )}
                    </div>
                  </div>
                  <div className="hotel-form-box">
                    <div
                      className="flex gap-2 "
                      onClick={() => setIsDropdownOpen(true)}
                    >
                      <h6 className=" text-xs  hotel-form-text-color ">
                        {" "}
                        ROOMS & GUESTS{" "}
                      </h6>
                      <img src="../img/downarrow.svg" className="w-3 h-4"></img>
                    </div>
                    <p className=" hotel-city-name-2">
                      {roomCount} Rooms,{roomadultCount} Adults,
                      {roomchildCount} Children
                    </p>
                    {isDropdownOpen && (
                      <div
                        className="absolute right-0 bg-white rounded-lg mt-1 p-3 z-10 shadow-lg"
                        style={{
                          width: "400px", // Set dropdown width
                          maxHeight: "500px", // Set max height for the dropdown
                        }}
                      >
                        {/* Room Selector */}
                        <div className="mb-2 flex items-center justify-between">
                          <h6 className="textsizes">Rooms</h6>
                          <select
                            className="border border-gray-300  px-3 py-1 focus:outline-none"
                            value={roomCount}
                            onChange={(e) =>
                              handleSelection("rooms", parseInt(e.target.value))
                            }
                          >
                            {Array.from({ length: 21 }, (_, i) => i).map(
                              (num) => (
                                <option key={num} value={num}>
                                  {num}
                                </option>
                              )
                            )}
                          </select>
                        </div>

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
                            {Array.from({ length: 41 }, (_, i) => i).map(
                              (num) => (
                                <option key={num} value={num}>
                                  {num}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        {/* Children Selector */}
                        <div className="mb-2 flex items-center justify-between">
                          <div>
                            <h6 className="textsizes">Children </h6>{" "}
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
                            {Array.from({ length: 41 }, (_, i) => i).map(
                              (num) => (
                                <option key={num} value={num}>
                                  {num}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        {/* Horizontal Line */}
                        <p className="textcolor ">
                          Please provide the correct number of children along
                          with their ages for the best options and prices.
                        </p>
                        <hr className="my-4 border-gray-500" />

                        {/* Children Ages Dropdowns */}
                        <div
                          className="overflow-y-auto grid grid-cols-2 gap-4"
                          style={{
                            maxHeight: "150px", // Scrollable height for child age section
                          }}
                        >
                          {childrenAges.map((age, index) => (
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
                                {Array.from({ length: 18 }, (_, i) => i).map(
                                  (num) => (
                                    <option key={num} value={num}>
                                      {num} Yrs
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          ))}
                        </div>

                        {/* Apply Button */}
                        <button
                          className="search-buttonn item-center justift-between"
                          style={{ marginLeft: "25%" }}
                          onClick={handleToggleHotel}
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>

                  <button className="search-buttonn rounded-lg">Serach</button>
                
                </div>
              </div>
            </div>
          </form>
        </header>

        {/* <div className="px-2 h-12 grid grid-rows-1">
          <div className="grid grid-cols-6 px-3 py-3">
            <label className="text-sm">SORT BY:</label>
            <label className="text-sm">Popular</label>
            <label className="text-sm">User Rating (Highest First)</label>
            <label className="text-sm">Price (Highest First)</label>
            <label className="text-sm">Price (Lowest First)</label>
            <input className=" py-1 text-sm" placeholder=" search" />
          </div>
         
        </div> */}

        <div className="flex card-container ">
          <div className="w-1/3  items-center justify-center  p-4">
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
                    zoom={10}
                    center={mapCenter}
                  >
                    {/* Map is empty without markers */}
                  </GoogleMap>

                  {/* Overlay Text */}
                  <h6 className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-700 text-xs font-semibold mb-4 bg-white p-2 rounded">
                    EXPOLRE ON MAP
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full  items-center justify-center">
          <p className="py-7 px-6 heading-line mb-0">
      {isTyping ? "Recently Viewed" : `Showing Properties in ${cityName}`}
    </p>
            {hotelDetails &&
            Array.isArray(hotelDetails) &&
            hotelDetails.length > 0 ? (
              hotelDetails.map((hotel) => {
                // Ensure hotelList exists and is an array
                const matchedHotel = hotelList?.find(
                  (item) => item.HotelCode === hotel.HotelCode
                );

                // If a matching hotel is found, display its details
                return matchedHotel ? (
                  <div key={hotel.HotelCode} className="w-full py-2 px-3">
                    <div className="max-w-[57rem] w-full flex flex-cols bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                      <div className="py-3 px-3 w-1/3">
                        <div className="photos-container">
                          {Array.isArray(hotel.Images) &&
                          hotel.Images.length > 0 ? (
                            <>
                              <img
                                src={hotel.Images[0]} // Displaying the first image
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
                                        src={image} // Displaying the image
                                        alt={`Hotel ${index + 1}`}
                                        className={`hotel-photos ${
                                          index === 3 ? "blur-sm" : ""
                                        }`} // Apply blur to the last image
                                      />
                                      {/* Show the 'View All' button on image 4 (index 3) */}
                                      {index === 3 && (
                                        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
                                          <span
                                            className="text-white text-xs font-semibold cursor-pointer"
                                            onClick={() => {
                                              // Pass matchedHotel to the modal
                                              setIsOpenImage(true);
                                              setSelectedHotel(hotel.Images); // Track the selected hotel
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
                            <p>No Image Available</p>
                          )}
                        </div>
                      </div>

                      <div className="w-1/2 py-3 px-1">
                        <h3 className="text-lg font-semibold ">
                          {hotel.HotelName || "No Name Available"}
                        </h3>

                        <p className="text-sm font-semibold hotel-form-text-color">
                          {hotel.CityName || "No City Available"} |{" "}
                          <span className="text-xs" style={{ color: "gray" }}>
                            {extractAttraction(hotel.Attractions)}
                          </span>
                        </p>
                        <div className="flex items-start flex-wrap gap-2">
                          {Array.isArray(matchedHotel.Rooms) &&
                          matchedHotel.Rooms.length > 0 ? (
                            <ul className="list-disc pl-4 text-xs space-y-1">
                              {matchedHotel.Rooms[0].Inclusion.split(",").map(
                                (item, index) => (
                                  <li key={index}>{item.trim()}</li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p>No inclusions available</p>
                          )}
                        </div>
                        <p className="text-sm text-green-700 bg-green-100 border border-green-400 p-3 rounded-lg">
                          {formatCancelPolicies(
                            matchedHotel.Rooms[0].CancelPolicies
                          )}
                        </p>
                      </div>

                      <div className="w-1/4 py-3 px-3 flex flex-col items-end border-l border-gray-300">
                        <div className="flex items-center  gap-2">
                          <span className="hotel-form-text-color text-lg font-semibold">
                            {renderRatingText(hotel.HotelRating)}{" "}
                          </span>
                          <div className="border border-gray-300 px-2 flex items-center text-sm  rating-color font-semibold">
                            {" "}
                            {hotel.HotelRating}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 mb-4">
                          {renderStars(hotel.HotelRating)}
                        </div>
                        {Array.isArray(matchedHotel.Rooms) &&
                        matchedHotel.Rooms.length > 0 ? (
                          <>
                            <span className="text-lg font-semibold hotel-form-text-color ">
                              ₹ {matchedHotel.Rooms[0].TotalFare}
                            </span>
                            <span className="text-xs ">
                              + ₹ {matchedHotel.Rooms[0].TotalTax} taxes & fees
                            </span>
                          </>
                        ) : (
                          <p>No rooms available</p>
                        )}

                        <div className="flex gap-3 mt-5">
                          <button className="border-2 w-20 h-7 border-[#785ef7] text-[#785ef7] bg-transparent px-2  rounded-md  text-xs transition duration-300 hover:bg-[#785ef7] hover:text-white">
                            Added
                          </button>

                          <button className="bg-[#785ef7] w-20 h-7 text-white px-2 rounded-md font-semibold text-xs transition duration-300 hover:bg-[#5a3ec8]">
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Modal for viewing all images */}
                    {isOpenImage &&
                      selectedHotel &&
                      selectedHotel.length > 0 && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-3xl p-5 relative h-[450px]">
                            <button
                              className="absolute top-2 text-gray-600 right-2 px-5"
                              onClick={() => setIsOpenImage(false)}
                            >
                              Close
                            </button>

                            <div
                              className="grid grid-cols-3 gap-4 image-modal"
                              style={{ maxHeight: "350px", overflowY: "auto" }}
                            >
                              {selectedHotel.map((image, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={image}
                                    alt={`Hotel Image ${index + 1}`}
                                    className="w-full object-cover rounded-lg hotel-photo"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                ) : null;
              })
            ) : (
              <p className="text-center col-span-3">Loading hotels...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchHotel;
