import { Fragment, useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const searchData = JSON.parse(sessionStorage.getItem("hotelSearchData")) || [];
  const hotelList = Array.isArray(location.state?.hotelList)
    ? location.state?.hotelList
    : Array.isArray(searchData)
    ? searchData
    : [];
  
  const searchParams = JSON.parse(sessionStorage.getItem("hotelData")) || {};
  
  console.log("Received Hotel List:", hotelList);
  
  const [hotelDetails, setHotelDetails] = useState([]);
  const hotelcodes = localStorage.getItem("hotelDetails");
  
  useLayoutEffect(() => {
    const fetchCity = async () => {
      if (!Array.isArray(hotelList) || hotelList.length === 0) {
        console.error("hotelList is not a valid array:", hotelList);
        return; // Exit if hotelList is not an array or is empty
      }
  
      const codes = hotelList.map((hotel) => hotel.HotelCode); // ✅ Safe .map()
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
  
          const validHotels = (data.response.HotelDetails || []).filter(
            (hotel) => hotel.Map
          );
          if (validHotels.length > 0) {
            const firstHotel = validHotels[0];
            const coordinates = firstHotel.Map.split("|").map(Number);
            setMapCenter({ lat: coordinates[0], lng: coordinates[1] });
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
  }, [hotelList]); // ✅ hotelList is always an array now
  

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
      return ["No cancellation policies available."]; // Return as an array
    }

    return cancelPolicies.map((policy) => {
      if (policy.ChargeType === "Fixed" && policy.CancellationCharge === 0) {
        return `Free Cancellation till check-in`;
      } else if (policy.ChargeType === "Percentage") {
        return `Cancellation charge of ${policy.CancellationCharge}%`;
      }
      return `Policy: From ${policy.FromDate}`;
    });
  };
    const [cityName, setCityName] = useState(
           searchParams.filteredCities && searchParams.filteredCities.length > 0
             ? searchParams.filteredCities[0].Name
             : ""
         );
         

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
              Showing Properties in {cityName}
              {/* {isTyping ? "Recently Viewed" : `Showing Properties in ${cityName}`} */}
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
                  <div
                    key={hotel.HotelCode}
                    className="w-full py-2 px-3 transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                    onClick={() => navigate("/HotelDetail", { state: { hotel, matchedHotel, hotelList } })}
                  >
                    <div className="max-w-[57rem] w-full flex flex-cols bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none transition-shadow duration-300 hover:shadow-lg">
                      {/* Hotel Image */}
                      <div className="py-3 px-3 w-1/3">
                        <div className="photos-container">
                          {Array.isArray(hotel.Images) && hotel.Images.length > 0 ? (
                            <>
                              <img src={hotel.Images[0]} alt="Hotel" className="hotel-photo" />
                              <div className="grid grid-cols-4 gap-2 py-1">
                                {hotel.Images.slice(1, 5).map((image, index) => (
                                  <div key={index} className="image-container relative">
                                    <img src={image} alt={`Hotel ${index + 1}`} className={`hotel-photos ${index === 3 ? "blur-sm" : ""}`} />
                                    {index === 3 && (
                                      <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
                                        <span
                                          className="text-white text-xs font-semibold cursor-pointer"
                                          onClick={(e) => {
                                            e.stopPropagation(); // Prevent navigation when clicking "View All"
                                            setIsOpenImage(true);
                                            setSelectedHotel(hotel.Images);
                                          }}
                                        >
                                          View All
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </>
                          ) : (
                            <p>No Image Available</p>
                          )}
                        </div>
                      </div>
                
                      {/* Hotel Info */}
                      <div className="w-1/2 py-3 px-1">
                        <h3 className="text-lg font-semibold">{hotel.HotelName || "No Name Available"}</h3>
                        <p className="text-sm font-semibold hotel-form-text-color">
                          {hotel.CityName || "No City Available"} | <span className="text-xs" style={{ color: "gray" }}>{extractAttraction(hotel.Attractions)}</span>
                        </p>
                        <div className="flex items-start flex-wrap gap-2">
                          {Array.isArray(matchedHotel.Rooms) && matchedHotel.Rooms.length > 0 ? (
                            <ul className="list-disc pl-4 text-xs space-y-1">
                              {matchedHotel.Rooms[0].Inclusion.split(",").map((item, index) => (
                                <li key={index}>{item.trim()}</li>
                              ))}
                            </ul>
                          ) : (
                            <p>No inclusions available</p>
                          )}
                        </div>
                       <p className="text-sm text-green-700 ">
                          {formatCancelPolicies(
                            matchedHotel.Rooms[0].CancelPolicies
                          )}
                        </p>

                      </div>
                
                      {/* Price & Book Button */}
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

                        <span className="text-lg font-semibold hotel-form-text-color">₹ {matchedHotel.Rooms?.[0]?.TotalFare || "N/A"}</span>
                        <span className="text-xs">+ ₹ {matchedHotel.Rooms?.[0]?.TotalTax || "0"} taxes & fees</span>
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
