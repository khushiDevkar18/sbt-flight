import { Fragment, useEffect, useLayoutEffect, useMemo, useState } from "react";
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

// //// console.log("asdafdsfa");

const SearchHotel = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = JSON.parse(sessionStorage.getItem("hotelData")) || {};
  const hotelData = JSON.parse(sessionStorage.getItem("hotel")) || {};
  // // console.log("Received Hotel List:", hotelData);
  const searchData =
    JSON.parse(sessionStorage.getItem("hotelSearchData")) || [];
  const hotelList = Array.isArray(location.state?.hotelList)
    ? location.state?.hotelList
    : Array.isArray(searchData)
    ? searchData
    : [];

  const [hotelDetails, setHotelDetails] = useState(() => {
    // Try getting data from sessionStorage first
    const storedData = sessionStorage.getItem("hotelDetails");
    return storedData ? JSON.parse(storedData) : [];
  });

  useLayoutEffect(() => {
    const fetchCity = async () => {
      if (!Array.isArray(hotelList) || hotelList.length === 0) {
        // console.error("hotelList is not a valid array:", hotelList);
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
        // console.log("Hotel data:", data);

        if (data.success === "1" && data.response.Status.Code === 200) {
          setHotelDetails(data.response.HotelDetails || []);
          sessionStorage.setItem(
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

  const combinedHotels = useMemo(() => {
    return hotelDetails.map((hotel) => {
      const matchedHotelList = hotelList.find(
        (item) => item.HotelCode === hotel.HotelCode
      );
      const matchedHotelData = hotelData[hotel.HotelCode] || {};

      return {
        ...hotel, // Base details
        ...matchedHotelList, // Override with hotelList data if found
        ...matchedHotelData, // Override with hotelData if found
      };
    });
  }, [hotelDetails, hotelList, hotelData]); // Recompute only when dependencies change
  console.log(combinedHotels);

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

  const defaultCenter = { lat: 40.7128, lng: -74.006 };
  // //// console.log(storedCities);
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
        return `Booking will be canceled from ${formattedDate} with a charge of ${policy.CancellationCharge}`;
      } else if (policy.ChargeType === "Percentage") {
        return `From ${formattedDate}, the cancellation charge is ${policy.CancellationCharge}%`;
      }
      return `Policy starts from ${formattedDate}`;
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
                    // // console.log(
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
         
            <div className="w-full items-center justify-center">
              <p className="py-7 px-6 heading-line mb-0">
                Showing Properties in {cityName}
              </p>
              {combinedHotels.length > 0 ? (
                combinedHotels.map((hotel) => (
                  <div
                  key={hotel.HotelCode}
                  className="w-full py-2 px-3 transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                  onClick={() => navigate("/HotelDetail", { state: { hotel } })}
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
                                        className={`hotel-photos ${
                                          index === 3 ? "blur-sm" : ""
                                        }`}
                                      />
                                      {index === 3 && (
                                        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center">
                                          <span
                                            className="text-white text-xs font-semibold cursor-pointer"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setIsOpenImage(true);
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
                            <p>No Image Available</p>
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
                        <div className="flex flex-wrap gap-3 text-xs mb-3">
                          {[
                            {
                              keyword: "restaurant",
                              label: "Restaurant",
                              icon: "/img/food1.svg",
                            },
                            {
                              keyword: "parking",
                              label: "Parking Available",
                              icon: "/img/parking.svg",
                            },
                            {
                              keyword: "conference",
                              label: "Conference Space",
                              icon: "/img/conference.svg",
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
                                />{" "}
                                {label}
                              </span>
                            ))}
                        </div>

                        <div className="text-xs text-green-700">
                          {formatCancelPolicies(
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
                          ))}
                        </div>

                        {hotel?.Rooms?.[0]?.Inclusion && (
                          <div className="text-xs text-green-700 flex items-center mt-1">
                            <img
                              src="/img/tick.svg"
                              alt="✔"
                              className="w-3 h-3 mr-1"
                            />
                            <span>{hotel.Rooms[0].Inclusion}</span>
                          </div>
                        )}
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
                        <span className="text-lg font-semibold hotel-form-text-color">
                          ₹ {hotel.Rooms?.[0]?.TotalFare || "N/A"}
                        </span>
                        <span className="text-xs">
                          + ₹ {hotel.Rooms?.[0]?.TotalTax || "0"} taxes & fees
                        </span>
                        <div className="flex gap-3 mt-5">
                          <button className="border-2 w-20 h-7 border-[#785ef7] text-[#785ef7] bg-transparent px-2 rounded-md text-xs transition duration-300 hover:bg-[#785ef7] hover:text-white">
                            Added
                          </button>
                          <button className="bg-[#785ef7] w-20 h-7 text-white px-2 rounded-md font-semibold text-xs transition duration-300 hover:bg-[#5a3ec8]">
                            Book Now
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))
              ) : (
                <p>No hotels found</p>
              )}
            </div>
          
        </div>
      </div>
    </>
  );
};

export default SearchHotel;
