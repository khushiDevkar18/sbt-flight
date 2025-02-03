import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";

import { X } from "@mui/icons-material";
import { Dialog, Transition } from "@headlessui/react";

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
  const cityName = searchParams.filteredCities[0]?.Name;

  console.log("Received Hotel List:", hotelList);
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
  // console.log(selectedHotel);
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
          <form>
            <div id="search-widget" className="hsw v2">
              <div className="hsw_inner" style={{ marginLeft: "4%" }}>
                <div className="hsw_inputBox tripTypeWrapper grid grid-cols-5 gap-10">
                  <div className="hotel-form-box">
                    <div className="flex gap-2">
                      <h6 className=" text-xs  hotel-form-text-color">
                        {" "}
                        CITY, AREA OR PROPERTY{" "}
                      </h6>
                      <img src="../img/downarrow.svg" className="w-3 h-4"></img>
                    </div>
                    <p className=" hotel-city-name-2">{cityName}</p>
                  </div>
                  <div className="hotel-form-box">
                    <div className="flex gap-2">
                      <h6 className="text-xs hotel-form-text-color">
                        {" "}
                        CHECK-IN DATE
                      </h6>
                      <img src="../img/downarrow.svg" className="w-3 h-4"></img>
                      {/* <i className="fa-solid fa-caret-down"></i> */}
                    </div>
                    <p className=" hotel-city-name-2">{searchParams.checkIn}</p>
                  </div>
                  <div className="hotel-form-box">
                    <div className="flex gap-2">
                      <h6 className=" text-xs hotel-form-text-color">
                        {" "}
                        CHECK-OUT DATE{" "}
                      </h6>
                      <img src="../img/downarrow.svg" className="w-3 h-4"></img>
                    </div>
                    <p className=" hotel-city-name-2">
                      {searchParams.checkOut}
                    </p>
                  </div>
                  <div className="hotel-form-box">
                    <div className="flex gap-2">
                      <h6 className=" text-xs  hotel-form-text-color ">
                        {" "}
                        ROOMS & GUESTS{" "}
                      </h6>
                      <img src="../img/downarrow.svg" className="w-3 h-4"></img>
                    </div>
                    <p className=" hotel-city-name-2">
                      {searchParams.Rooms} Rooms,{searchParams.Adults} Adults,
                      {searchParams.Children} Children
                    </p>
                  </div>

                  <button className="search-buttonn rounded-lg">Serach</button>
                </div>
              </div>
            </div>
          </form>
        </header>

        <div className="px-2 h-12 grid grid-rows-1">
          <div className="grid grid-cols-6 px-3 py-3">
            <label className="text-sm">SORT BY:</label>
            <label className="text-sm">Popular</label>
            <label className="text-sm">User Rating (Highest First)</label>
            <label className="text-sm">Price (Highest First)</label>
            <label className="text-sm">Price (Lowest First)</label>
            <input className=" py-1 text-sm" placeholder=" search" />
          </div>
          {/* <div className="grid grid-cols-4 px-3 py-2">
   <label className="">SORT BY:</label>
   <label className="">SORT BY:</label>
   <label className="">SORT BY:</label>
   <label className="">SORT BY:</label>
    </div> */}
        </div>

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
              Showing Properties in {cityName}
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
                          <span className="text-xs" style={{ color: "black" }}>
                            {extractAttraction(hotel.Attractions)}
                          </span>
                        </p>
                        <div className="flex flex-wrap gap-2 items-start">
                          {Array.isArray(matchedHotel.Rooms) &&
                          matchedHotel.Rooms.length > 0 ? (
                            <ul className="flex flex-wrap gap-2 text-xs">
                              {matchedHotel.Rooms[0].Inclusion.split(",").map(
                                (item, index) => (
                                  <li
                                    key={index}
                                    className="bg-gray-100 px-2 py-1 rounded-md"
                                  >
                                    {item.trim()}
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p>No inclusions available</p>
                          )}
                        </div>
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
                            <span className="text-xs font-semibold ">
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
