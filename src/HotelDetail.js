import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Modal from "./Modal";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
const HotelDetails = () => {
  const location = useLocation();
  const hotel = location.state?.hotel;
  // console.log(hotel);
  const agent_portal = sessionStorage.getItem("agent_portal");
  const booking_access = sessionStorage.getItem("has_search_access");
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const navigate = useNavigate();
  const [showHeader, setShowHeader] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  // References for sections
  const overviewRef = useRef(null);
  const roomsRef = useRef(null);
  const locationRef = useRef(null);
  const rulesRef = useRef(null);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Show header when scrolled past 200px
      setShowHeader(scrollY > 200);

      // Determine active section based on scroll position
      const sectionOffsets = {
        overview: overviewRef.current?.offsetTop || 0,
        rooms: roomsRef.current?.offsetTop || 0,
        location: locationRef.current?.offsetTop || 0,
        rules: rulesRef.current?.offsetTop || 0,
      };

      const scrollPosition = scrollY + 100; // Adjust for header height
      let currentSection = "overview";

      for (const section in sectionOffsets) {
        if (scrollPosition >= sectionOffsets[section]) {
          currentSection = section;
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleSelectRoom = (room) => {
    navigate("/HotelBooking", { state: { selectedRoom: room, hotel: hotel } }); // Pass room & hotel info
  };

  // Smooth scrolling function
  const scrollToSection = (sectionRef) => {
    if (sectionRef.current) {
      window.scrollTo({
        top: sectionRef.current.offsetTop - 80, // Adjust 80px based on your header height
        behavior: "smooth",
      });
      setShowHeader(false);
    }
  };

  const containerStyle = { width: "100%", height: "400px" };

  const [showRates, setShowRates] = useState(false);
  const [showRates2, setShowRates2] = useState(false);
  const searchParams = JSON.parse(sessionStorage.getItem("hotelData")) || {};
  const extractAttraction = (Description) => {
    if (!Description || typeof Description !== "string") {
      return "No Location Available";
    }

    // Use regex to extract text after "HeadLine :"
    const match = Description.match(/HeadLine\s*:\s*([^<]+)/);

    return match ? match[1].trim() : "No Location Available";
  };
  dayjs.extend(customParseFormat); // Enable custom date parsing

  const formatCancelPolicies = (CancelPolicies) => {
    const today = new Date(); // Get today's date
    today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

    return CancelPolicies.filter((policy) => {
      // Convert FromDate to a Date object
      const policyDate = new Date(
        policy.FromDate.split(" ")[0].split("-").reverse().join("-")
      );
      policyDate.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

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

  const cancellationPolicies = formatCancelPolicies(
    hotel.Rooms?.[0]?.CancelPolicies || []
  );

  const mealType = hotel.Rooms?.[0]?.MealType || "";
  const isRefundable = hotel.Rooms?.[0]?.IsRefundable || false;

  let cancellationText = "";

  if (cancellationPolicies.length === 0) {
    cancellationText = "No cancellation policies available.";
  } else if (mealType === "Room_Only") {
    cancellationText = isRefundable
      ? "Rooms with cancellation"
      : "Rooms with cancellation ";
  } else if (mealType === "BreakFast") {
    cancellationText = isRefundable
      ? "Rooms with cancellation | Breakfast Only"
      : "Rooms with Breakfast Only";
  } else {
    cancellationText = "Room Cancellation";
  }

  const images = [
    "../img/hotelroom1.jpg",
    "../img/hotelroom2.jpg",
    "../img/hotelroom3.jpg",
  ];
  // console.log("Final Cancellation Text:", cancellationText);
  const mapSectionRef = useRef(null);
  const [showInfo, setShowInfo] = useState(true);

  const scrollToMap = () => {
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const [lat, lng] = hotel.Map.split("|").map(parseFloat);
  const center = { lat, lng };

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCnfQ-TTa0kZzAPvcgc9qyorD34aIxaZhk",
  });

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <div className="">
      {/* Sticky Header */}
      {showHeader && (
        <div
          className="fixed w-full bg-[#e8e4ff] shadow-md z-50 flex h-10"
          style={{ top: "52px" }} // Adjust based on your header height
        >
          <div className="flex gap-5">
            {[
              "overview",
              ...(hotel?.Rooms?.length > 1 ? ["rooms"] : []), // Conditionally add "rooms"
              "location",
              "rules",
            ].map((section) => (
              <button
                key={section}
                onClick={() =>
                  scrollToSection(
                    section === "overview"
                      ? overviewRef
                      : section === "rooms"
                      ? roomsRef
                      : section === "location"
                      ? locationRef
                      : rulesRef
                  )
                }
                className={`${
                  activeSection === section
                    ? "font-bold text-[#785ef7]"
                    : "text-white-600"
                }`}
                style={{ marginLeft: "17%" }}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {hotel && (
        <div className="hoteldetail-conatiner mt-5">
          {agent_portal != null && String(agent_portal) === "0" && (
            <div className="text-sm text-gray-600 flex gap-2 py-4 px-5">
              {booking_access == "1" && (

            
              <><span
                  className="cursor-pointer text-blue-600 hover:underline"
                  onClick={() => navigate("/")}
                >
                  Home
                </span><span>&gt;</span></>
              )}
              <span
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => navigate("/SearchHotel")}
              >
                Hotels In {hotel.CityName}
              </span>
              <span>&gt;</span>
              <span className="text-gray-900 font-semibold">
                {hotel.HotelName}
              </span>
            </div>
          )}

          <div className="flex items-center justify-center py-2">
            {" "}
            <section ref={overviewRef}>
              <div className="max-w-[75rem] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4]  border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none hotel-border">
                <div className="py-3 px-3 ">
                  <h5 className="text-[#3b3f5c] text-xl mb-3 font-semibold dark:text-white-light">
                    {hotel.HotelName}
                  </h5>

                  <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-3 gap-3 mb-5 flex">
                    <div className="lg:col-span-2 xl:col-span-2 space-y-2  ">
                      {Array.isArray(hotel.Images) &&
                      hotel.Images.length > 0 ? (
                        <div className="flex gap-3 max-h-[21rem]">
                          <img
                            src={hotel.Images[0]}
                            className="photos-hotels"
                          ></img>
                          <div className="grid grid-rows-2 gap-3 py-1 ">
                            <img
                              src={hotel.Images[2]}
                              className="photos-hotel"
                            ></img>
                            <img
                              src={hotel.Images[3]}
                              className="photos-hotel"
                            ></img>
                          </div>
                        </div>
                      ) : (
                        <div className="">
                          <img src="./img/image_NA02.png" className=""></img>
                        </div>
                      )}
                      {/* <div className="py-2 ">
                        <h6 className="text-sizes-color ">
                          Stay at this budget hotel in Pune that offers a
                          conference room, restaurant, free Wi-Fi, elevator &
                          free parking .
                          <span className="information_button">More</span>
                        </h6>
                      </div> */}

                      <div className="flex gap-3">
                        {hotel.Rooms[0].MealType !== "Room_Only" && (
                          <div className="border  w-25 cursor-pointer hotel_button_color text-black flex items-center gap-2 p-2 rounded-md">
                            <img
                              src="../img/foodicon.png"
                              alt="food"
                              className="w-5 h-5"
                            />
                            {/* Replace with an actual icon */}
                            <span className="text-sm">Food And Dining</span>
                          </div>
                        )}

                        <div
                          className="border  w-25  cursor-pointer text-black flex items-center gap-2 p-2 rounded-md hotel_button_color"
                          onClick={() => setShowModal3(true)}
                        >
                          <img
                            src="../img/location.png"
                            alt="map"
                            className="w-5 h-5"
                          />
                          {/* Replace with an actual icon */}
                          <span className="text-sm ">Location</span>
                        </div>
                        {showModal3 && (
                          <Modal
                            title="Location"
                            onClose={() => setShowModal3(false)}
                          >
                            <div className="text-sm text-gray-700 dark:text-white-light">
                              {hotel.Address}
                            </div>
                          </Modal>
                        )}
                      </div>
                      {hotel?.HotelFacilities && (
                        <div>
                          <h6 className="text-[#3b3f5c] text-lg font-semibold dark:text-white-light">
                            Amenities
                          </h6>
                          <div className="flex flex-wrap gap-3 text-xs mb-3">
                            {hotel.HotelFacilities.length < 5
                              ? // Show all facilities with tick mark if less than 5
                                hotel.HotelFacilities.map((facility, index) => (
                                  <span
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
                                    <span className="text-black">✓</span>
                                    {facility}
                                  </span>
                                ))
                              : (() => {
                                  const predefinedAmenities = [
                                    {
                                      keyword: "restaurant",
                                      label: "Restaurant",
                                      icon: "/img/Food.svg",
                                    },
                                    {
                                      keyword: "parking",
                                      label: "Parking Available",
                                      icon: "/img/parking_1.svg",
                                    },
                                    {
                                      keyword: "wifi",
                                      label: "Free WiFi",
                                      icon: "/img/wifi_1.svg",
                                    },
                                    {
                                      keyword: "conference",
                                      label: "Conference Space",
                                      icon: "/img/conference.svg",
                                    },
                                  ];

                                  const matchedFacilities =
                                    predefinedAmenities.filter(({ keyword }) =>
                                      hotel?.HotelFacilities?.some((facility) =>
                                        facility.toLowerCase().includes(keyword)
                                      )
                                    );

                                  if (matchedFacilities.length > 0) {
                                    return (
                                      <>
                                        {matchedFacilities.map(
                                          ({ icon, label }, index) => (
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
                                          )
                                        )}
                                        {hotel?.HotelFacilities?.length >
                                          matchedFacilities.length && (
                                          <span
                                            className="information_button text-sm cursor-pointer"
                                            onClick={() => setShowModal2(true)}
                                          >
                                            +
                                            {hotel.HotelFacilities.length -
                                              matchedFacilities.length}{" "}
                                            more
                                          </span>
                                        )}
                                      </>
                                    );
                                  } else {
                                    // If none of the predefined amenities match, show the first 4 amenities with tick marks
                                    const displayedFacilities =
                                      hotel.HotelFacilities.slice(0, 4);
                                    const remainingFacilitiesCount =
                                      hotel.HotelFacilities.length -
                                      displayedFacilities.length;

                                    return (
                                      <>
                                        {displayedFacilities.map(
                                          (facility, index) => (
                                            <span
                                              key={index}
                                              className="flex items-center gap-2"
                                            >
                                              <span className="text-black">
                                                ✓
                                              </span>
                                              {facility}
                                            </span>
                                          )
                                        )}
                                        {remainingFacilitiesCount > 0 && (
                                          <span
                                            className="information_button text-sm cursor-pointer"
                                            onClick={() => setShowModal2(true)}
                                          >
                                            +{remainingFacilitiesCount} more
                                          </span>
                                        )}
                                      </>
                                    );
                                  }
                                })()}
                          </div>

                          {showModal2 && (
                            <Modal
                              title="Amenities"
                              onClose={() => setShowModal2(false)}
                            >
                              <div className="grid grid-cols-3 gap-4 text-sm text-gray-700 dark:text-white-light">
                                {hotel?.HotelFacilities?.map(
                                  (facility, index) => (
                                    <div
                                      key={index}
                                      className="flex items-start space-x-2"
                                    >
                                      <span className="text-black">✓</span>
                                      <span className="text-xs">
                                        {facility}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </Modal>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="lg:col-span-2 xl:col-span-1  relative">
                      <div className="sticky top-5 space-y-1">
                        <div className="flex items-center justify-center">
                          <div className="max-w-[25rem] w-full border border-white-light dark:border-[#1b2e4b] hotel-border ">
                            <div className="py-3 px-3">
                              {/* <h5 className="text-[#3b3f5c] text-xl font-semibold dark:text-white-light">
                          Deluxe King Room
                        </h5> */}
                              <h5 className="text-[#3b3f5c] text-sm dark:text-white-light">
                                {hotel.Rooms[0].Name.length > 1 &&
                                new Set(hotel.Rooms[0].Name).size === 1
                                  ? hotel.Rooms[0].Name[0] //
                                  : hotel.Rooms[0].Name.join(" | ")}
                              </h5>

                              <ul className="list-disc text-black space-y-1">
                                {hotel?.Rooms?.[0]?.Inclusion && (
                                  <div className="text-sm flex items-center mt-1">
                                    {/* <img
                              src="/img/tick.svg"
                              alt="✔"
                              className="w-3 h-3 mr-1"
                            /> */}
                                    <li className="">
                                      {hotel.Rooms[0].Inclusion}
                                    </li>
                                  </div>
                                )}
                                <li className="text-sm">
                                  {hotel.Rooms[0].MealType === "Room_Only"
                                    ? "No Meals Included"
                                    : hotel.Rooms[0].MealType === "BreakFast"
                                    ? "Breakfast Included"
                                    : hotel.Rooms[0].MealType}
                                </li>
                              </ul>
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

                              <div
                                className="flex items-center gap-2 cursor-pointer"
                                onMouseEnter={() => setShowRates(true)}
                                onMouseLeave={() => setShowRates(false)}
                              >
                                <h5 className=" text-2xl font-semibold  hotel-form-text-color">
                                  ₹ {hotel.Rooms[0].TotalFare}
                                </h5>
                                <span className="text-xs text-gray-500 font-semibold ">
                                  + ₹ {hotel.Rooms[0].TotalTax} taxes and fees
                                </span>
                              </div>
                              {showRates && (
                                <div className="absolute left-0 mt-2 w-80 bg-white shadow-xl rounded-lg p-4 border border-gray-300 z-20 animate-fade-in">
                                  {hotel.Rooms[0].DayRates?.map(
                                    (dayRateArray, index) => {
                                      // Calculate total base fare for this dayRate array
                                      const totalBaseFare = dayRateArray.reduce(
                                        (total, rate) =>
                                          total + (rate?.BasePrice || 0),
                                        0
                                      );

                                      return (
                                        <div key={index}>
                                          {/* Title & Total Price Section */}
                                          <div className="flex justify-between items-center pb-2">
                                            <h6 className="font-semibold text-gray-700 text-xs">
                                              Room {index + 1} price ×{" "}
                                              {dayRateArray.length} Days
                                            </h6>
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md font-medium text-xs">
                                              ₹ {totalBaseFare.toFixed(2)}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              )}

                              <button
                                className="bg-[#785ef7] w-[131px] h-10 text-white px-2 rounded-md font-semibold text-sm transition duration-300 hover:bg-[#5a3ec8]"
                                onClick={() =>
                                  hotel.Rooms.length > 0 &&
                                  handleSelectRoom(hotel.Rooms[0])
                                }
                              >
                                BOOK&nbsp;THIS&nbsp;NOW
                              </button>
                            </div>
                          </div>
                        </div>

                        <div
                          className="mb-5 flex items-center justify-center"
                          onClick={scrollToMap}
                        >
                          <div className="max-w-[25rem] w-full border border-white-light dark:border-[#1b2e4b] hotel-border ">
                            <div className="py-2 px-6">
                              <div className="grid grid-cols-3 items-center">
                                <div>
                                  <img
                                    src="../img/map_image.png"
                                    alt="Map"
                                    className="w-20 h-15"
                                  />
                                </div>

                                <div className="text-center leading-tight">
                                  <h6 className="text-sm block">
                                    {hotel.CityName}
                                  </h6>
                                  <span className="text-xs text-gray-500 ">
                                    {extractAttraction(hotel.Description)}
                                  </span>
                                </div>

                                <div
                                  className="flex items-center justify-center gap-1 text-blue-500 cursor-pointer"
                                  // Scroll on click
                                >
                                  {/* Google Maps Icon */}

                                  <p className="text-sm">See Map</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
          {hotel.Rooms && hotel.Rooms.length > 1 && (
            <div className="flex items-center justify-center py-2">
              <section ref={roomsRef} id="overview">
                <div className="max-w-[75rem] min-w-[75rem] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none hotel-border">
                  <div className="py-3 px-3">
                    <div className="border w-full h-full hotel-border">
                      <div className="border-b w-full">
                        <h6 className="text-md py-2 px-3 font-semibold">
                          Rooms
                        </h6>
                      </div>

                      {/* Loop through rooms starting from index 1 */}
                      {hotel.Rooms.slice(1, 4).map((room, index) => (
                        <div key={index} className="flex border-b py-2">
                          {/* Left section with image */}
                          <div className="w-1/2 border-r">
                            <div className="h-full px-3 py-2">
                              <div className="relative max-h-[20rem]">
                                {Array.isArray(hotel.Images) &&
                                hotel.Images.length > 0 ? (
                                  <img
                                    src={
                                      hotel.Images[
                                        (index + 4) % hotel.Images.length
                                      ] || "./img/hotel_not_found.png"
                                    } // Skip first image
                                    className="photos-hotelss"
                                    alt="Hotel Room"
                                  />
                                ) : (
                                  <div className="photos-hotelss">
                                    <img
                                      src="./img/hotel_not_found.png"
                                      alt="No Image"
                                      className="w-full h-full"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right section with details */}
                          <div className="px-3 py-2 w-full flex">
                            <div className="flex flex-col w-full">
                              {hotel?.Rooms &&
                              Array.isArray(hotel.Rooms) &&
                              hotel.Rooms.length > 0 ? (
                                hotel.Rooms.map((room, index) => (
                                  <h5
                                    key={index}
                                    className="text-[#3b3f5c] text-sm dark:text-white-light"
                                  >
                                    {room?.Name &&
                                    Array.isArray(room.Name) &&
                                    room.Name.length > 0
                                      ? new Set(room.Name).size === 1
                                        ? room.Name[0] // Display once if all names are the same
                                        : room.Name.join(" | ") // Show both if different
                                      : "No Room Info Available"}
                                  </h5>
                                ))
                              ) : (
                                <h5 className="text-[#3b3f5c] text-sm dark:text-white-light">
                                  No Room Info Available
                                </h5>
                              )}

                              <ul className="list-disc text-black space-y-1">
                                <div className="grid grid-cols-2 space-y-1">
                                  {hotel?.HotelFacilities?.slice(0, 4).map(
                                    (facility, i) => (
                                      <li key={i} className="text-xs">
                                        {facility}
                                      </li>
                                    )
                                  )}
                                </div>
                              </ul>
                              <p
                                className="information_button text-sm cursor-pointer"
                                onClick={() => setShowModal2(true)}
                              >
                                More Details
                              </p>

                              <div className="mt-2">
                                <h5 className="text-[#3b3f5c] text-sm font-semibold dark:text-white-light">
                                  {cancellationText}
                                </h5>
                                <ul className="list-disc text-black space-y-1">
                                  {room?.Inclusion && (
                                    <div className="text-xs flex items-center mt-1">
                                      <li>{room.Inclusion}</li>
                                    </div>
                                  )}
                                  <li className="text-xs">
                                    {room.MealType === "Room_Only"
                                      ? "No Meals Included"
                                      : room.MealType === "BreakFast"
                                      ? "Breakfast Included"
                                      : room.MealType}
                                  </li>
                                </ul>
                                <div className="text-xs text-green-700">
                                  {formatCancelPolicies(
                                    room?.CancelPolicies || []
                                  ).map((policy, i) => (
                                    <div key={i} className="flex gap-2">
                                      <img
                                        src="../img/tick.svg"
                                        className="w-3 h-5"
                                        alt="✔"
                                      />
                                      {policy}
                                    </div>
                                  ))}
                                </div>
                                {/* <p className="information_button text-sm cursor-pointer">More Details</p> */}
                              </div>
                            </div>

                            {/* Pricing Section */}
                            <div>
                              <div
                                className="relative cursor-pointer"
                                onMouseEnter={() => setShowRates2(index)}
                                onMouseLeave={() => setShowRates2(null)}
                              >
                                <h5 className="hotel-form-text-color text-xl font-semibold dark:text-white-light">
                                  ₹ {room.TotalFare}
                                </h5>
                                <h5 className="text-[#3b3f5c] text-sm dark:text-white-light">
                                  + ₹ {room.TotalTax} taxes and fees
                                </h5>
                              </div>
                              {/* {showRates === index && (
                                <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-lg p-3 border border-gray-300 z-10 animate-fade-in">
                                  <h6 className="font-semibold text-gray-700 border-b pb-1">
                                    Day Rates:
                                  </h6>
                                  <ul className="mt-2 text-sm text-gray-600 space-y-1">
                                    {room?.DayRates?.[0]?.map((rate, i) => (
                                      <li
                                        key={i}
                                        className="flex justify-between"
                                      >
                                        <span>Day {i + 1}:</span>
                                        <span className="font-medium text-black">
                                          ₹ {rate.BasePrice}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )} */}
                           {showRates2 === index && hotel.Rooms?.length > 1 && (
  <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-lg p-3 border border-gray-300 z-10 animate-fade-in">
    {hotel.Rooms.map((room, roomIndex) => {
      // Calculate the correct daily rate (sum of DayRates[0])
      const dailyRate = room.DayRates[0].reduce(
        (sum, rate) => sum + (rate?.BasePrice || 0),
        0
      );

      return (
        <div key={roomIndex} className="pb-2 border-b last:border-b-0">
          <div className="flex justify-between items-center">
            <h6 className="font-semibold text-gray-700 text-xs">
              Room {roomIndex + 1} × {room.DayRates.length} Days =
            </h6>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md font-medium text-xs">
              ₹ {dailyRate.toFixed(2)}  {/* Will show ₹11674.63 for both rooms */}
            </span>
          </div>
        </div>
      );
    })}
  </div>
)}

                              <button
                                className="bg-[#785ef7] w-30 h-7 text-white px-2 rounded-md font-semibold text-sm transition duration-300 hover:bg-[#5a3ec8]"
                                onClick={() => handleSelectRoom(room)}
                              >
                                SELECT ROOM
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          <div
            ref={mapSectionRef}
            className="flex items-center justify-center py-2"
          >
            <div className="max-w-[75rem] w-full bg-white shadow-md border border-white-light hotel-border">
              <section ref={locationRef} id="Location">
                <div className="py-3 px-3">
                  <div className="border w-full hotel-border">
                    <div className="border-b w-full">
                      <h6 className="text-md py-2 px-3 font-semibold">
                        Location
                      </h6>
                    </div>
                    <div className="w-full h-[400px] ">
                      <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={14}
                      >
                        <Marker
                          position={center}
                          onClick={() => setShowInfo(true)}
                        >
                          {showInfo && (
                            <InfoWindow
                              position={center}
                              onCloseClick={() => setShowInfo(false)}
                            >
                              <div>{hotel.name}</div>
                            </InfoWindow>
                          )}
                        </Marker>
                      </GoogleMap>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
          <div className="flex items-center justify-center py-2">
            <div className="max-w-[75rem] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4]  border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none hotel-border">
              <section ref={rulesRef} id="Rules">
                <div className="py-3 px-3 ">
                  <div className="border w-full h-full hotel-border">
                    {" "}
                    <h6 className="text-md py-2 px-3 font-semibold ">
                      Property Rules
                    </h6>
                    <dv className="flex gap-4 py-1 px-3">
                      <span className="text-sm">
                        Check-in : {hotel.CheckInTime}
                      </span>
                      <span className="text-sm">
                        Check-out : {hotel.CheckOutTime}
                      </span>
                    </dv>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetails;
