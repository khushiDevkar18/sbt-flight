import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
const HotelDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "../img/hotelroom1.jpg",
    "../img/hotelroom2.jpg",
    "../img/hotelroom3.jpg",
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };
  const containerStyle = { width: "100%", height: "400px" };

  const [showRates, setShowRates] = useState(false);

  const hotel = location.state?.hotel;
  console.log(hotel);
  const searchParams = JSON.parse(sessionStorage.getItem("hotelData")) || {};
  const extractAttraction = (Description) => {
    if (!Description || typeof Description !== "string") {
      return "No Location Available";
    }

    // Use regex to extract text after "HeadLine :"
    const match = Description.match(/HeadLine\s*:\s*([^<]+)/);

    return match ? match[1].trim() : "No Location Available";
  };
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
    <div>
      {hotel && (
        <div className="hoteldetail-conatiner">
          <nav className="text-sm text-gray-600 flex gap-2 py-3 px-5">
            <span
              className="cursor-pointer text-blue-600 hover:underline"
              onClick={() => navigate("/")}
            >
              Home
            </span>
            <span>&gt;</span>
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
          </nav>
          <div className="flex items-center justify-center py-2">
            <div className="max-w-[75rem] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4]  border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none hotel-border">
              <div className="py-3 px-3 ">
                <h5 className="text-[#3b3f5c] text-xl mb-3 font-semibold dark:text-white-light">
                  {hotel.HotelName}
                </h5>
                <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-3 gap-3 mb-5 flex">
                  <div className="lg:col-span-2 xl:col-span-2 space-y-2  ">
                    <div className="flex gap-3 max-h-[21rem]">
                      <img
                        src="../img/hotelroom.jpg"
                        className="photos-hotels"
                      ></img>
                      <div className="grid grid-rows-2 gap-3 py-1 ">
                        <img
                          src="../img/hotelroom1.jpg"
                          className="photos-hotel"
                        ></img>
                        <img
                          src="../img/hotelroom3.jpg"
                          className="photos-hotel"
                        ></img>
                      </div>
                    </div>
                    <div className="py-2 ">
                      <h6 className="text-sizes-color ">
                        Stay at this budget hotel in Pune that offers a
                        conference room, restaurant, free Wi-Fi, elevator & free
                        parking .
                        <span className="information_button">More</span>
                      </h6>
                    </div>

                    <div className="flex gap-3">
                      <div className="border  w-25 hotel_button_color text-black flex items-center gap-2 p-2 rounded-md">
                        <img
                          src="../img/foodicon.png"
                          alt="food"
                          className="w-5 h-5"
                        />
                        {/* Replace with an actual icon */}
                        <span className="text-sm">Food And Dining</span>
                      </div>
                      <div className="border  w-25  text-black flex items-center gap-2 p-2 rounded-md hotel_button_color">
                        <img
                          src="../img/location.png"
                          alt="map"
                          className="w-5 h-5"
                        />
                        {/* Replace with an actual icon */}
                        <span className="text-sm">Location</span>
                      </div>
                    </div>
                    <div>
                      <h6 className="text-[#3b3f5c] text-lg font-semibold dark:text-white-ligh">
                        Amenities
                      </h6>
                      <div className="flex flex-wrap gap-3 text-xs mb-3">
                        {(() => {
                          const matchedFacilities = [
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
                              keyword: "wifi",
                              label: "Free WiFi",
                              icon: "/img/wifi2.svg",
                            },
                            {
                              keyword: "conference",
                              label: "Conference Space",
                              icon: "/img/conference.svg",
                            },
                          ].filter(({ keyword }) =>
                            hotel.HotelFacilities.some((facility) =>
                              facility.toLowerCase().includes(keyword)
                            )
                          );

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
                                    />{" "}
                                    {label}
                                  </span>
                                )
                              )}

                              {/* Dynamically calculate remaining facilities */}
                              {hotel.HotelFacilities.length >
                                matchedFacilities.length && (
                                <span className="information_button text-sm">
                                  +
                                  {hotel.HotelFacilities.length -
                                    matchedFacilities.length}{" "}
                                  more
                                </span>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-2 xl:col-span-1  relative">
                    <div className="sticky top-5 space-y-5">
                      <div className="flex items-center justify-center">
                        <div className="max-w-[25rem] w-full border border-white-light dark:border-[#1b2e4b] hotel-border ">
                          <div className="py-3 px-3">
                            {/* <h5 className="text-[#3b3f5c] text-xl font-semibold dark:text-white-light">
                          Deluxe King Room
                        </h5> */}
                            <h5 className="text-[#3b3f5c] text-sm dark:text-white-light">
                              Fits {searchParams.Adults} Adults &{" "}
                              {searchParams.Children} Children
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
                              className="flex items-center gap-2"
                              onMouseEnter={() => setShowRates(true)}
                              onMouseLeave={() => setShowRates(false)}
                            >
                              <h5 className="text-[#3b3f5c] text-2xl font-semibold dark:text-white-light">
                                ₹ {hotel.Rooms[0].TotalFare}
                              </h5>
                              <span className="text-xs text-gray-500 font-semibold ">
                                + ₹ {hotel.Rooms[0].TotalTax} taxes and fees
                              </span>
                              {showRates && (
                                <div className="absolute left-0 mt-2 w-60 bg-white shadow-lg rounded-lg p-3 border border-gray-300 z-10 animate-fade-in">
                                  <h6 className="font-semibold text-gray-700 border-b pb-1">
                                    Day Rates:
                                  </h6>
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
                            <button className="bg-[#785ef7] w-30 h-10 text-white px-2 rounded-md font-semibold text-sm transition duration-300 hover:bg-[#5a3ec8]">
                              BOOK THIS NOW
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
          </div>
          <div className="flex items-center justify-center py-2">
            <div className="max-w-[75rem] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4]  border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none hotel-border">
              <div className="py-3 px-3 ">
                {/* <h5 className="text-[#3b3f5c] text-xl mb-3 font-semibold dark:text-white-light">
              Hotel Name{" "}
            </h5> */}
                <div className="border w-full h-full hotel-border">
                  <div className="border-b   w-full ">
                    {" "}
                    <h6 className="text-sm py-2 px-3 ">
                      Enjoy Free Breakfast throughout your stay for just ₹155
                      more!
                    </h6>
                  </div>
                  <div className="grid grid-cols-3 flex space-y-2 ">
                    <div className="border h-full">
                      <div className="px-3 py-2">
                        <div className="relative">
                          <img
                            src={images[currentIndex]}
                            className="photos-hotelss mb-2"
                            alt="Hotel Room"
                          />
                          <button
                            onClick={prevSlide}
                            className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2"
                          >
                            ❮
                          </button>
                          <button
                            onClick={nextSlide}
                            className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2"
                          >
                            ❯
                          </button>
                        </div>

                        <h5 className="text-[#3b3f5c] text-lg font-semibold dark:text-white-light  ">
                          {hotel.Rooms[0].Name}
                        </h5>
                        {/* <h5 className="text-[#3b3f5c] text-sm dark:text-white-light">
                                                    (168 sq.ft (16 sq.mt) | Twin Bed)
                                                </h5> */}
                        <ul className="list-disc text-black space-y-1">
                          <div className="grid grid-cols-2 gap-2">
                            {hotel?.HotelFacilities?.slice(0, 6).map(
                              (facility, index) => (
                                <li key={index} className="text-sm">
                                  {facility}
                                </li>
                              )
                            )}
                          </div>
                        </ul>

                        <p className="information_button text-sm">
                          More Details
                        </p>
                      </div>
                    </div>
                    <div className="py-2 px-3 space-y-1">
                      <button className="border-2 w-ful h-5 mb-2 border-[#785ef7] text-[#785ef7] bg-transparent px-2  hotel-border text-xs transition duration-300 hover:bg-[#785ef7] hover:text-white">
                        RECOMMEDED
                      </button>
                      <h5 className="text-[#3b3f5c] text-lg font-semibold dark:text-white-light">
                        {hotel.Rooms[0].IsRefundable
                          ? hotel.Rooms[0].MealType === "BreakFast"
                            ? "Room With Free Cancellation | Breakfast only"
                            : "Room With Free Cancellation | Breakfast Not Included"
                          : "Room Cancellation "}
                      </h5>

                      <ul className="list-disc text-black space-y-1">
                        {hotel?.Rooms?.[0]?.Inclusion && (
                          <div className="text-sm flex items-center mt-1">
                            {/* <img
                              src="/img/tick.svg"
                              alt="✔"
                              className="w-3 h-3 mr-1"
                            /> */}
                            <li className="">{hotel.Rooms[0].Inclusion}</li>
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

                      <p className="information_button text-sm">More Details</p>
                    </div>
                    <div className="py-4 px-3 space-y-2">
                      <div
                        className="relative"
                        onMouseEnter={() => setShowRates(true)}
                        onMouseLeave={() => setShowRates(false)}
                      >
                        <div>
                          <h5 className="text-[#3b3f5c] text-xl font-semibold dark:text-white-light">
                            ₹ {hotel.Rooms[0].TotalFare}
                          </h5>
                          <h5 className="text-[#3b3f5c] text-sm dark:text-white-light">
                            + ₹ {hotel.Rooms[0].TotalTax} taxes and fees
                          </h5>
                        </div>

                        {showRates && (
                          <div className="absolute left-0 mt-2 w-60 bg-white shadow-lg rounded-lg p-3 border border-gray-300 z-10 animate-fade-in">
                            <h6 className="font-semibold text-gray-700 border-b pb-1">
                              Day Rates:
                            </h6>
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
                      <button className="bg-[#785ef7] w-30 h-7 text-white px-2 rounded-md font-semibold text-sm transition duration-300 hover:bg-[#5a3ec8]">
                        SELECT ROOM
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={mapSectionRef}
            className="flex items-center justify-center py-2"
          >
            <div className="max-w-[75rem] w-full bg-white shadow-md border border-white-light">
              <div className="py-3 px-3">
                <div className="border w-full">
                  <div className="border-b w-full">
                    <h6 className="text-sm py-2 px-3 font-semibold">
                      Location
                    </h6>
                  </div>
                  <div className="w-full h-[400px]">
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
            </div>
          </div>
          <div className="flex items-center justify-center py-2">
            <div className="max-w-[75rem] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4]  border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none hotel-border">
              <div className="py-3 px-3 ">
                <div className="border w-full h-full hotel-border">
                  {" "}
                  <h6 className="text-lg py-2 px-3 font-semibold ">
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetails;
