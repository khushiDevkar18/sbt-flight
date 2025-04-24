import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";

const Header = () => {
  const location = useLocation();
  const [loader, setLoader] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
 

  useEffect(() => {
    const isSearchHotelPage = location.pathname === "/SearchHotel"; // Check if the user is on SearchHotel page

    const handleScroll = () => {
      if (isSearchHotelPage) {
        setShowHeader(window.scrollY === 0); // Hide header on scroll only on SearchHotel page
      }
    };

    // Set header visibility when route changes
    setShowHeader(isSearchHotelPage ? window.scrollY === 0 : true);

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location]); // Re-run effect when URL changes


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

        <div className="header-b" style={{ display: showHeader ? "block" : "none" }}>
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

          <div
  className={`wrapper-padding transition-all duration-300 px-5 ${
    showHeader ? "opacity-100 visible" : "opacity-0 invisible"
  }`}
>
            <div className="header-logo">
            
                <img alt="" src="img/taxivaxi/logo/cotrav_logo.svg" />
           
            </div>
            <div className="header-right">
              {/* <div className="hdr-srch">
                <a href="#" className="hdr-srch-btn"></a>
              </div> */}
              {/* <div className="hdr-srch-overlay">
                <div className="hdr-srch-overlay-a">
                  <input type="text" placeholder="Start typing..." />
                  <a href="#" className="srch-close"></a>
                  <div className="clear"></div>
                </div>
              </div> */}
              {/* <div className="hdr-srch-devider"></div> */}
              <a href="#" className="menu-btn"></a>
              <nav className="header-nav">
                <ul>
                  <li>
                    <Link
                      className="nav-links"
                      to="/"
                      onClick={() => {
                        sessionStorage.clear(); // Clear all session values
                      }}
                    >
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
                        <a href="flightOneWay.html">
                          Ticketing - Train, Bus & Flight
                        </a>
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

      </header>
      {/* {showHeader2 && (
        <header className="search-bar2" id="widgetHeader">
          <form onSubmit={handleHotelSearch}>
            <div id="search-widget" className="hsw v2">
              <div className="hsw_inner" style={{ marginLeft: "4%" }}>
                <div className="hsw_inputBox tripTypeWrapper grid grid-cols-6 gap-10">
                <div className="hotel-form-box">
      
      <div className="flex gap-2" onClick={() => setShowDropdown2(true)}>
        <h6 className="text-xs hotel-form-text-color">COMPANY</h6>
        <img src="../img/downarrow.svg" className="w-3 h-4" alt="Dropdown" />
      </div>

     
      <div className="hotel-city-name-2">
        <input
          type="text"
          className="font-semibold hotel-city"
          value={companyName}
          onChange={handleInputChange2}
          placeholder="Search Company"
          onFocus={() => setShowDropdown2(true)} // Show dropdown when input is focused
        />
      </div>

      
      {showDropdown2 && (
        <div className="absolute w-25 bg-white border border-gray-300 margin_City max-h-60 overflow-y-auto z-10 dropdown-size">
          {filteredCompany.length > 0 ? (
            filteredCompany.map((company, index) => (
              <div
                key={company.id || index}
                className="px-3 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSelectCompany(company)}
              >
                <div className="text-sm">{company.corporate_name}</div>
                <div className="text-xs">({company.corporate_code})</div>
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500">No companies found</div>
          )}
        </div>
      )}
    </div>
                  <div className="hotel-form-box ">
                    
                    <div
                      className="flex gap-2"
                      onClick={() => setShowDropdown(true)}
                    >
                      <h6 className="text-xs hotel-form-text-color">
                        CITY OR AREA
                      </h6>
                      <img src="../img/downarrow.svg" className="w-3 h-4" />
                    </div>

                  
                    <div className="hotel-city-name-2">
                      <input
                        type="text"
                        className=" font-semibold  hotel-city"
                        value={cityName}
                        onChange={handleInputChange}
                        placeholder="Search City"
                        onFocus={() => setShowDropdown(true)} // Show dropdown when input is focused
                      />
                    </div>

                   
                    {showDropdown && filteredCities.length > 0 && (
                      <div className="absolute w-25 bg-white border border-gray-300 margin_City max-h-60 overflow-y-auto z-10 dropdown-size">
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
                        <p className="font-semibold">
                          {formatDate(checkInDate)}
                        </p>
                      )}
                    </div>
                  </div>

                 
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
                        <p className="font-semibold">
                          {formatDate(checkOutDate)}
                        </p>
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
                      {roomCount} Rooms, {roomadultCount} Adults,{" "}
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

                       
                        <p className="textcolor ">
                          Please provide the correct number of children along
                          with their ages for the best options and prices.
                        </p>
                        <hr className="my-4 border-gray-500" />

                       
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
      )} */}
    </>
  );
};

export default Header;
