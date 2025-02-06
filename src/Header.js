import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";


const Header = () => {
    const location = useLocation();
    const searchData = JSON.parse(sessionStorage.getItem('hotelData'));

    
    const [hotelList, setHotelCityList] = useState(location.state?.hotelList || []);
    const searchParams = searchData || {};
    const datew= searchParams.checkIn;
    // console.log(searchParams);
const navigate = useNavigate();
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
     const [checkInDate, setCheckInDate] = useState(() => {
        const parsedDate = parseDate(searchParams.checkIn);
        return parsedDate instanceof Date && !isNaN(parsedDate) ? parsedDate : new Date();
      });
      
      const [checkOutDate, setCheckOutDate] = useState(() => {
        const parsedDate = parseDate(searchParams.checkOut);
        return parsedDate instanceof Date && !isNaN(parsedDate) ? parsedDate : new Date();
      });
      
     const [isCheckInOpen, setCheckInIsOpen] = useState(false);
     const [isCheckOutOpen, setCheckOutIsOpen] = useState(false);
     // // console.log( 'previous date ',searchParams.checkIn);
     // // console.log('Displayed date ',parseDate(searchParams.checkIn));
     // // console.log('actual date displayed',formatDate(checkInDate))
     // Handle date changes
     const handleCheckInDateChange = (date) => {
       setCheckInDate(date);
     };
   
     const handleCheckOutDateChange = (date) => {
       setCheckOutDate(date);
     };
     const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Control dropdown visibility
     const [roomCount, setRoomCount] = useState(() => Number(searchParams.Rooms) || 0);
const [roomadultCount, setRoomAdultCount] = useState(() => Number(searchParams.Adults) || 0);
const [roomchildCount, setRoomChildCount] = useState(() => Number(searchParams.Children) || 0);

   
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
        searchParams.filteredCities && searchParams.filteredCities.length > 0
          ? searchParams.filteredCities[0].Name
          : ""
      );
      
      
     // console.log(cityName); 
     const [isTyping, setIsTyping] = useState(false);
     useLayoutEffect(() => {
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
                 body: JSON.stringify({CountryCode:"IN" }),
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
   
   //  const hotelList = location.state?.hotelList || [];
    // console.log(hotelList);
     const [hotelCodes, setHotelCodes] = useState([]);
     // // console.log(hotelCodes);
     useLayoutEffect(() => {
        const fetchCity = async () => {
          if (filteredCities.length === 0) return; // Ensure filteredCities has data
    
          const cityCode = filteredCities[0]?.Code; // Get the first city's code
          // if (!cityCode) return; // Avoid API call if cityCode is null
    
          // console.log("Fetching hotels for City Code:", cityCode);
    
          // // console.log('TB Hotel Code List')
    
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
            // // console.log("Hotel :", data);
    
            if (data.success === "1" && data.response.Status.Code === 200) {
              const hotels = data.response.Hotels || []; // Fix: Access Hotels from data.response
             
    
              if (hotels.length > 0) {
                const codes = hotels.map((hotel) => hotel.HotelCode);
                // // console.log(codes);
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
          // // console.log(CityCode);
          // console.log("Check-In Date:", checkIn);
          // console.log("Check-Out Date:", checkOut);
          // console.log("Rooms:", Rooms);
          // console.log("Adults:", Adults);
          // console.log("Children:", Children);
          // console.log("Children Ages:", ChildAge);
          // console.log("City Code:", CityCode);
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
      
          // console.log(requestBody);
      
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
                // console.log("Hotel data:", data);
                if (data.success === "1" && data.response.Status.Code === 200) {
                    setHotelCityList(data.response.HotelResult || []);
                    console.log("asd");
                  
                    // Prepare the data to store in sessionStorage
                    const searchData = {
                      hotelList: data.response.HotelResult,
                     
                    };
                   const searchParams = {
                      checkIn,
                      checkOut,
                      Rooms,
                      Adults,
                      Children,
                      ChildAge,
                      CityCode,
                      filteredCities,
                    };
                    // Store the data in sessionStorage
                    sessionStorage.setItem('hotelData', JSON.stringify(searchParams));
                    sessionStorage.setItem('hotelSearchData', JSON.stringify(searchData));
                  
                    // Navigate to SearchHotel with the state
                    navigate("/SearchHotel", {
                      state: searchData,
                    });
                  
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
        const [showHeader, setShowHeader] = useState(true);
        const [lastScrollY, setLastScrollY] = useState(0);
      
        useLayoutEffect(() => {
          const handleScroll = () => {
            if (window.scrollY > lastScrollY) {
              // Scrolling Down - Hide Header
              setShowHeader(false);
            } else {
              // Scrolling Up - Show Header
              setShowHeader(true);
            }
            setLastScrollY(window.scrollY);
          };
      
          window.addEventListener("scroll", handleScroll);
          return () => {
            window.removeEventListener("scroll", handleScroll);
          };
        }, [lastScrollY]);
      
   // import ErrorLogger from './ErrorLogger';
  return (
    <>
      <div className="overlay"></div>
      <div className="autorize-popup">
        <div className="autorize-tabs">
          <a href="#" className="autorize-tab-a current">
            Sign in
          </a>
          <a href="#" className="autorize-tab-b">
            Register
          </a>
          <a href="#" className="autorize-close"></a>
          <div className="clear"></div>
        </div>
        <section className="autorize-tab-content">
          <div className="autorize-padding">
            <h6 className="autorize-lbl">Welocome! Login in to Your Accont</h6>
            <input type="text" placeholder="Name" />
            <input type="text" placeholder="Password" />
            <footer className="autorize-bottom">
              <button className="authorize-btn">Login</button>
              <a href="#" className="authorize-forget-pass">
                Forgot your password?
              </a>
              <div className="clear"></div>
            </footer>
          </div>
        </section>
        <section className="autorize-tab-content">
          <div className="autorize-padding">
            <h6 className="autorize-lbl">Register for Your Account</h6>
            <input type="text" placeholder="Name" />
            <input type="text" placeholder="Password" />
            <footer className="autorize-bottom">
              <button className="authorize-btn">Registration</button>
              <div className="clear"></div>
            </footer>
          </div>
        </section>
      </div>
      <header id="top">
        {showHeader && (
        <div className="header-b">
          <div className="mobile-menu">
            <nav>
              <ul>
                <li>
                  <Link className="has-child" to="/">
                    HOME
                  </Link>
                </li>

                <li>
                  <a className="has-child" href="#">
                    Services
                  </a>
                  <ul>
                    <li>
                      <a href="#">Hotel Booking</a>
                    </li>
                    <li>
                      <a href="#">Cabs</a>
                    </li>
                    <li>
                      <a href="#">Ticketing - Train, Bus & flight</a>
                    </li>
                    <li>
                      <a href="#">logistics</a>
                    </li>
                    <li>
                      <a href="#">FRRO/FRO consultancy</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a className="has-child" href="#">
                    About US
                  </a>
                </li>
                <li>
                  <a href="#">CONTACTS</a>
                </li>
              </ul>
            </nav>
          </div>
         
 <div className={`wrapper-padding ${showHeader ? '' : 'hidden'}`}>

    <div className="header-logo">
      <a href="index-2.html">
        <img alt="" src="img/taxivaxi/logo/cotrav_logo.svg" />
      </a>
    </div>
    <div className="header-right">
      <div className="hdr-srch">
        <a href="#" className="hdr-srch-btn"></a>
      </div>
      <div className="hdr-srch-overlay">
        <div className="hdr-srch-overlay-a">
          <input type="text" placeholder="Start typing..." />
          <a href="#" className="srch-close"></a>
          <div className="clear"></div>
        </div>
      </div>
      <div className="hdr-srch-devider"></div>
      <a href="#" className="menu-btn"></a>
      <nav className="header-nav">
        <ul>
          <li>
            <Link className="nav-links" to="/">
              HOME
            </Link>
          </li>
          <li>
            <a className="has-child" href="#">
              Services
            </a>
            <ul className="dropdown-menu">
              <li>
                <a href="flightOneWay.html">Hotel Booking</a>
              </li>
              <li>
                <a href="flightOneWay.html">Cabs</a>
              </li>
              <li>
                <a href="flightOneWay.html">Ticketing - Train, Bus & Flight</a>
              </li>
              <li>
                <a href="flightOneWay.html">Logistics</a>
              </li>
              <li>
                <a href="flightOneWay.html">FRRO/FRO consultancy</a>
              </li>
            </ul>
          </li>
          <li>
            <a className="has-child" href="#">
              About Us
            </a>
          </li>
          <li>
            <a href="#">CONTACTS</a>
          </li>
        </ul>
      </nav>
    </div>
    <div className="clear"></div>
  </div>


         
        </div>
        )}
      </header>
      { location.pathname !== "/" && (
      <header className="search-bar2" id="widgetHeader">
        <form onSubmit={handleHotelSearch}>
            <div id="search-widget" className="hsw v2">
              <div className="hsw_inner" style={{ marginLeft: "4%" }}>
                <div className="hsw_inputBox tripTypeWrapper grid grid-cols-5 gap-10">
                
                  <div className="hotel-form-box ">
                   
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
                    <div className="hotel-city-name-2">
                    <input
                      type="text"
                      className=" font-semibold  hotel-city"
                      value={cityName}
                      onChange={handleInputChange}
                      placeholder="Search City"
                      onFocus={() => setShowDropdown(true)} // Show dropdown when input is focused
                    /></div>

                    {/* Dropdown for city selection */}
                    {showDropdown && filteredCities.length > 0 && (
                      <div className="absolute w-25 bg-white border border-gray-300 mt-1 max-h-60 overflow-y-auto z-10 dropdown-size">
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
                  <div className="hotel-form-box ">
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
                        <p className="font-semibold">{formatDate(checkInDate)}</p>
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
                        <p className="font-semibold">{formatDate(checkOutDate)}</p>
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
                    <p className="hotel-city-name-2 font-semibold whitespace-nowrap">
  {roomCount} Rooms, {roomadultCount} Adults, {roomchildCount} Children
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

                  <button className="search-buttonn rounded-lg">Search</button>
                
                </div>
              </div>
            </div>
          </form>
        </header>
      )}
    </>
  );
};

export default Header;
