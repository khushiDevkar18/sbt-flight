import { Fragment, useEffect, useLayoutEffect, useMemo, useState } from "react";
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

// //// // // console.log("asdafdsfa");

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

  //     // // console.log("Parsed hotelcityList:", hotelcityList);

  //     if (!Array.isArray(hotelcityList) || hotelcityList.length === 0) {
  //       // // console.log("Hotel list is empty, exiting fetchCity");
  //       return;
  //     }

  //     setLoader(true);

  //     const codes = hotelcityList.map((hotel) => hotel.HotelCode);
  //     // // console.log("Hotel Codes:", codes);

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
  //       // // console.log("Hotel data:", data);

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
  // // console.log(combinedHotels);

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

  
  // //// // // console.log(storedCities);
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

  const [cityName, setCityName] = useState(
    searchParams.filteredCities?.length > 0
      ? searchParams.filteredCities[0].Name
      : searchParams.City_name || ""
  );
  const agent_portal= sessionStorage.getItem('agent_portal');
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
          cityName: hotel.CityName,
          Description: hotel.Description,
          BookingCode: hotel.Rooms?.[0]?.BookingCode || 0,
          BasePrice: hotel.Rooms?.[0]?.DayRates?.[0]?.map((rate) => rate.BasePrice) || [],
        },
      ]);
      
    }
  };
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleShareOptions = () => {
    const sharedHotels = selectedHotels.map(hotel => ({
      name: hotel.name, // Use `name` from selectedHotels
      code: hotel.code, // Use `code` from selectedHotels
      tax: hotel.tax, // Use stored tax value
      total: hotel.price, // Use stored price value
      BookingCode:hotel.BookingCode,
      BasePrice:hotel.BasePrice,
    }));
  
    // console.log(sharedHotels); // This should now log correct hotel data
    setIsModalOpen(true);
  };
  
  


const handleCancel =()=>{
  setIsModalOpen(false);
}
  

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
    clientName: searchParams.corporate_name ,
    spocName: searchParams.spoc_name || "",
    spocEmail: `${searchParams.approver1 || ""}, ${searchParams.approver2 || ""}`,
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
      Options: selectedHotels.map(hotel => ({
        hotel_code: hotel.code, 
        booking_code: hotel.BookingCode, 
        base_fares: hotel.BasePrice,
        total_fare: hotel.price, 
        tax: hotel.tax, 
        hotel_name: hotel.name, 
        source: 2,
        
      })),
      additional_email: toEmailList, // Use toEmailList from form state
      approver_email: formData.spocEmail.split(",").map((email) => email.trim()),
      cc_email: ccEmailList, // Use ccEmailList from form state
      admin_id: searchParams.admin_id, 
      booking_id: searchParams.booking_id, 
      checkin_date: searchParams.checkIn, 
      checkout_date: searchParams.checkOut, 
      no_of_seats: searchParams.Adults || 2, 
      city: searchParams.City_name || (searchParams.filteredCities?.length > 0 ? searchParams.filteredCities[0].Name : ""),

    };
    
    // // console.log(formattedData);
    
  
    // const requestBody = { formattedData: formattedData };
  // // console.log(requestBody);
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
      // console.log("API Response:", data);
      if(data.success=='1'){
        setIsModalOpen(false);
        setSelectedHotels([]);
        Swal.fire({
                  title: "Mail Sent",
                  text:"Mail Was Sent Successfully" ,
                });

      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  
    // console.log("Request Body:", requestBody);
  };
  
  
  return (
    <>
      {loader ? (
        <>
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <img
              src="../img/hotel_loader.gif"
              alt="Loading..."
              className="loader_size"
            />
          </div>
        </>
      ) : (
        <>
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
          className="max-w-[19rem] w-full bg-white shadow-lg rounded border cursor-pointer" onClick={() => setIsOpen(true)}
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
  {formatCancelPolicies(hotel?.Rooms?.[0]?.CancelPolicies || []).length > 0 ? (
    formatCancelPolicies(hotel?.Rooms?.[0]?.CancelPolicies || []).map((policy, index) => (
      <div key={index} className="flex gap-2">
        <img src="../img/tick.svg" className="w-3 h-5" alt="✔" /> {policy}
      </div>
    ))
  ) : (
    <p className="text-xs  hotel-form-text-color ">No Cancellation Policy Available</p>
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
                            {hoveredHotel === hotel.HotelCode && (
                              <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-lg p-3 border border-gray-300 z-10 animate-fade-in">
                                {/* <h6 className="font-semibold text-gray-700 border-b pb-1">
        Day Rates:
      </h6> */}
                                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                                  {hotel.Rooms[0].DayRates[0]?.map(
                                    (rate, index) => (
                                      <li
                                        key={index}
                                        className="flex justify-between"
                                      >
                                        <span>Day {index + 1}:</span>
                                        <span className="font-medium text-black">
                                          ₹ {rate.BasePrice}
                                        </span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="flex mt-5 justify-end gap-2 w-full">
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      handleHotelSelect(hotel);
    }}
    className={`bg-[#785ef7] w-[91px] h-7 text-white px-2 rounded-md font-semibold text-xs transition duration-300 hover:bg-[#5a3ec8] ${
      selectedHotels.some((h) => h.name === hotel.HotelName) ? "" : ""
    }`}
  >
    {selectedHotels.some((h) => h.name === hotel.HotelName) ? (
      <span className="flex items-center gap-2 text-xs">
        Added{" "}
        <img src="../img/cros.png" className="w-3 h-3" alt="Remove" />
      </span>
    ) : (
      "Add to Share"
    )}
  </button>

  {/* Conditionally show "Book Now" button */}
  {agent_portal === "0" && (
    <button className="button_book text-xs w-[91px] h-7">Book Now</button>
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
