import { useState, useEffect, useLayoutEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import Modal from "./Modal";
import dayjs from "dayjs";
const HotelBooking = () => {
  const [loader, setLoader] = useState(false);
  const searchParams = JSON.parse(sessionStorage.getItem("hotelData")) || {};
  const location = useLocation();
  const hotel = location.state?.hotel;

  console.log(hotel); // This prevents errors if Rooms is undefined or empty

  const [hotelBooking, setHotelBooking] = useState([]);
  console.log(hotelBooking);
  useLayoutEffect(() => {
    if (!hotel || !hotel.Rooms || hotel.Rooms.length === 0) {
      console.error("Hotel or Rooms data is missing!");
      return; // Exit early if data is invalid
    }

    const fetchPriBooking = async () => {
      try {
        const BookingCode_1 = hotel.Rooms[0];
        const BookingCode = BookingCode_1?.BookingCode; // Ensure BookingCode exists

        if (!BookingCode) {
          console.error("BookingCode is missing!");
          return;
        }

        console.log(BookingCode);

        const response = await fetch(
          "https://cors-anywhere.herokuapp.com/https://affiliate.tektravels.com/HotelAPI/PreBook",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${btoa("Bai:Bai@12345")}`,
            },
            body: JSON.stringify({
              BookingCode: BookingCode,
              Language: "EN",
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Hotel data:", data);

        if (data.Status?.Code === 200) {
          setHotelBooking(data.HotelResult || []);
        } else {
          console.error(
            "Error fetching hotels:",
            data.response?.Status?.Description
          );
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchPriBooking();
  }, []); // Empty dependency array ensures it runs once
  const combinedHotels = useMemo(() => {
    if (!hotel && hotelBooking.length === 0) return []; // Return empty if both are missing

    // Convert `hotel` into an array if it exists
    const hotelArray = hotel ? [hotel] : [];

    // Merge hotelArray and hotelBooking
    const mergedHotels = [...hotelArray, ...hotelBooking].reduce(
      (acc, curr) => {
        const existingIndex = acc.findIndex(
          (item) => item.HotelCode === curr.HotelCode
        );

        if (existingIndex !== -1) {
          // Merge existing hotel with the new data
          acc[existingIndex] = { ...acc[existingIndex], ...curr };
        } else {
          // Add new hotel if not already in the list
          acc.push(curr);
        }

        return acc;
      },
      []
    );

    return mergedHotels;
  }, [hotel, hotelBooking]);

  const [showTaxDetails, setShowTaxDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  console.log("Final Combined Hotels:", combinedHotels);

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
  const decodeHtmlEntities = (str) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  };

  const cleanRateConditions = (conditions) => {
    return conditions.map(
      (condition) =>
        decodeHtmlEntities(condition).replace(/<\/?[^>]+(>|$)/g, "") // Removes all HTML tags
    );
  };
  const formatDate1 = (date) => dayjs(date).format("DD-MM-YYYY");
  const [showDetails, setShowDetails] = useState(false);
  // Calculate number of nights
  const calculateNights = () => {
    if (!searchParams.checkIn || !searchParams.checkOut) return 0;
    const checkInDate = dayjs(searchParams.checkIn);
    const checkOutDate = dayjs(searchParams.checkOut);
    return checkOutDate.diff(checkInDate, "day");
  };

  const [nights, setNights] = useState(0);

  useEffect(() => {
    setNights(calculateNights());
  }, [searchParams.checkIn, searchParams.checkOut]);
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
  // console.log('adasad')
  return (
    <div className="search-bar3 h-20 w-full " id="widgetHeader2">
      <div className="purple-header">
        <h5 className="text-xl font-semibold text-white">
          Review your Booking
        </h5>
      </div>
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
          {combinedHotels.map((hotelItem, index) => (
            <div key={index} className="mb-5 flex h-full floating-bookings">
              <div className="w-full space-y-5">
                <div className="max-w-[53rem] shadow-[4px_6px_10px_-3px_#bfc9d4] w-full bg-white border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                  <div className="py-7 px-6 space-y-2">
                    <h5 className="text-[#3b3f5c] text-xl font-semibold dark:text-white-light">
                      {hotelItem.HotelName}
                    </h5>
                    <div className="flex items-center space-x-1">
                      {renderStars(hotelItem.HotelRating)}
                    </div>
                    <div className="flex gap-2">
                      <img
                        src="../img/Address-icon.svg"
                        alt="img"
                        className="w-5 h-5"
                      />
                      <p className="text-xs">{hotelItem.Address}</p>
                    </div>
                    <div className="flex flex-cols gap-2 mb-3">
                      <div className="max-w-[25rem] w-full border border-white-light dark:border-[#1b2e4b] card_background  ">
                        <div className="py-2 px-6">
                          <div className="grid grid-cols-3 items-center justify-center ">
                            <div>
                              <h5 className="text-xs">Check In Date</h5>
                              <span className="text-sm font-semibold">
                                {formatDate1(searchParams.checkIn)}
                              </span>
                            </div>

                            {/* Display number of nights in the button */}
                            <button className="border-2 w-20 h-5 mb-2 border-[#785ef7] text-[#785ef7] bg-transparent  text-xs transition duration-300 ">
                              {nights} {nights === 1 ? "Night" : "Nights"}
                            </button>

                            <div>
                              <h5 className="text-xs">Check Out Date</h5>
                              <span className="text-sm font-semibold">
                                {formatDate1(searchParams.checkOut)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="max-w-[25rem] w-full border border-white-light dark:border-[#1b2e4b] text-center card_background">
                        <div className="py-2 px-6 flex justify-center">
                          <h5 className="text-sm">
                            <span className="font-bold">{nights}</span>{" "}
                            {nights === 1 ? "Night" : "Nights"} |
                            <span className="font-bold">
                              {" "}
                              {searchParams.Adults}
                            </span>{" "}
                            Adults |
                            <span className="font-bold">
                              {" "}
                              {searchParams.Children}
                            </span>{" "}
                            Children
                            {searchParams.ChildAge?.length > 0 && (
                              <span className="font-bold">
                                {" "}
                                {searchParams.ChildAge.map(
                                  (age) => `${age} yrs`
                                ).join(", ")}
                              </span>
                            )}{" "}
                            |
                            <span className="font-bold">
                              {" "}
                              {searchParams.Rooms}
                            </span>{" "}
                            Rooms
                          </h5>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <h5 className="text-[#3b3f5c] text-lg font-semibold dark:text-white-light">
                        {hotelItem?.Rooms?.[0]?.Name ||
                          "No Room Name Available"}
                      </h5>
                      <h5
                        className="text-[#785ef7] cursor-pointer text-sm font-semibold"
                        onClick={() => setShowModal2(true)}
                      >
                        See Inclusion
                      </h5>
                    </div>
                    {showModal2 && (
                      <Modal
                        title="Inclusion"
                        onClose={() => setShowModal2(false)}
                      >
                        <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-white-light">
                          <li>{hotelItem?.Rooms[0]?.Inclusion}</li>
                        </ul>
                      </Modal>
                    )}
                    <ul className="list-disc text-black space-y-1">
                      {hotelItem?.Rooms?.[0]?.Inclusion && (
                        <li className="text-sm">
                          {hotelItem.Rooms[0].Inclusion}
                        </li>
                      )}
                      <li className="text-sm">
                        {hotelItem?.Rooms?.[0]?.MealType === "Room_Only"
                          ? "No Meals Included"
                          : hotelItem?.Rooms?.[0]?.MealType === "BreakFast"
                          ? "Breakfast Included"
                          : hotelItem?.Rooms?.[0]?.MealType}
                      </li>
                    </ul>

                    <div className="text-xs text-green-700">
                      {formatCancelPolicies(
                        hotelItem?.Rooms?.[0]?.CancelPolicies || []
                      ).map((policy, idx) => (
                        <div key={idx} className="flex gap-2">
                          <img
                            src="../img/tick.svg"
                            className="w-3 h-5"
                            alt="✔"
                          />{" "}
                          {policy}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="max-w-[53rem] shadow-[4px_6px_10px_-3px_#bfc9d4] w-full bg-white border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                  <div className="py-7 px-6 space-y-2">
                    <h5 className="text-[#3b3f5c] text-xl font-semibold dark:text-white-light">
                      Important Information
                    </h5>

                    {/* Display First 4 RateConditions */}
                    <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-white-light">
                      {hotelItem?.RateConditions?.slice(0, 4).map(
                        (condition, index) => (
                          <li
                            key={index}
                            dangerouslySetInnerHTML={{ __html: condition }}
                          />
                        )
                      )}
                        <button
                      className="text-[#785ef7] text-sm font-semibold mt-2 cursor-pointer"
                      onClick={() => setShowModal(true)}
                    >
                      View More
                    </button>
                    </ul>

                    {/* View More Button */}
                  
                  </div>
                </div>

                {/* Modal for Full RateConditions */}
                {showModal && (
                  <Modal
                    title="All Hotel Rules"
                    onClose={() => setShowModal(false)}
                  >
                    <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-white-light">
                      {cleanRateConditions(hotelItem?.RateConditions || []).map(
                        (condition, index) => (
                          <li key={index}>{condition}</li>
                        )
                      )}
                    </ul>
                  </Modal>
                )}
              </div>

              <div className="w-1/3 sticky top-0">
  <div className="max-w-[19rem] w-full bg-white border border-gray-300 dark:border-[#1b2e4b] dark:bg-[#191e3a] sticky top-5 shadow-[4px_6px_10px_-3px_#bfc9d4]">
    <div className="py-7 px-6">
      <h5 className="text-[#785ef7] text-lg font-semibold mb-4 dark:text-white-light">
        Price Breakup
      </h5>
      {hotelItem?.Rooms?.[0]?.PriceBreakUp?.length > 0 ? (
        <div className="dark:border-[#1b2e4b]">
          {/* Room Rate */}
          <div className="flex justify-between items-center border-b border-gray-300 dark:border-[#1b2e4b] py-2 relative">
            <p className="text-sm text-gray-700 dark:text-white-light flex items-center gap-2">
              <strong>1 Room x {nights} Nights</strong>
              <img
                src="../img/i_icon.svg"
                className="w-5 h-5 cursor-pointer"
                onMouseEnter={() => setShowDetails(true)}
                onMouseLeave={() => setShowDetails(false)}
              />
            </p>
            <p className="text-sm text-gray-700 dark:text-white-light font-semibold">
              ₹{hotelItem?.Rooms?.[0]?.PriceBreakUp?.[0]?.RoomRate?.toFixed(2)}
            </p>

            {/* Tooltip with Rates */}
            {showDetails && (
              <div className="absolute right-0 top-10 w-56 bg-white dark:bg-[#1b2e4b] border border-gray-300 dark:border-[#1b2e4b] shadow-md rounded-lg p-3 z-10">
                <h6 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                  Rates Breakdown:
                </h6>
                {hotelItem?.Rooms?.[0]?.DayRates?.[0]?.map((rate, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-xs text-gray-700 dark:text-white-light"
                  >
                    <p>Day {idx + 1}:</p>
                    <p className="font-semibold">₹{rate.BasePrice.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Agent Commission */}
          <div className="border-b border-gray-300 dark:border-[#1b2e4b] py-2 flex justify-between">
            <p className="text-sm text-gray-700 dark:text-white-light">
              <strong>Agent Commission:</strong>
            </p>
            <p className="text-sm text-gray-700 dark:text-white-light font-semibold">
              - ₹
              {hotelItem?.Rooms?.[0]?.PriceBreakUp?.[0]?.AgentCommission?.toFixed(2)}
            </p>
          </div>

          {/* Tax Amount */}
          <div className="border-b border-gray-300 dark:border-[#1b2e4b] py-2 flex justify-between items-center relative">
            <div className="flex  gap-1">
              <p className="text-sm text-gray-700 dark:text-white-light flex items-center gap-2">
                <strong>Tax Amount:</strong>
              </p>
              <img
                src="../img/i_icon.svg"
                className="w-5 h-5 cursor-pointer"
                onMouseEnter={() => setShowTaxDetails(true)}
                onMouseLeave={() => setShowTaxDetails(false)}
              />
            </div>
            <p className="text-sm text-gray-700 dark:text-white-light font-semibold">
              ₹{hotelItem?.Rooms?.[0]?.TotalTax.toFixed(2)}
            </p>

            {/* Tax Breakdown Tooltip */}
            {showTaxDetails && (
              <div className="absolute right-0 top-10 w-56 bg-white dark:bg-[#1b2e4b] border border-gray-300 dark:border-[#1b2e4b] shadow-md rounded-lg p-3 z-10">
                <h6 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                  Tax Breakdown:
                </h6>
                {hotelItem?.Rooms?.[0]?.PriceBreakUp?.[0]?.TaxBreakup?.map((tax, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-xs text-gray-700 dark:text-white-light"
                  >
                    <p>
                      {tax.TaxType} ({tax.TaxPercentage}%):
                    </p>
                    <p className="font-semibold">₹{tax.TaxableAmount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total Amount */}
          <div className="py-2 flex justify-between">
            <p className="text-sm text-gray-700 dark:text-white-light">
              <strong>Total Amount:</strong>
            </p>
            <p className="text-sm text-gray-700 dark:text-white-light font-semibold">
              ₹{hotelItem?.Rooms?.[0]?.TotalFare}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-white-dark">No Price Breakdown Available</p>
      )}
    </div>
  </div>
</div>

            </div>
          ))}
        </>
      )}
    </div>
  );
};
export default HotelBooking;
