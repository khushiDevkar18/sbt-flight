import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import dayjs from "dayjs";
const HotelBooking = () => {
  const location = useLocation();
  const hotel = location.state?.hotel;
  const searchParams = JSON.parse(sessionStorage.getItem("hotelData")) || {};
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
  const formatDate1 = (date) => dayjs(date).format("DD-MM-YYYY");

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
    <div className="hoteldetail-conatiner bg-white h-full">
      <div className="search-bar2 h-20 px-5 w-full " id="widgetHeader">
        <h5 className="text-xl font-semibold text-white">
          Review your Booking
        </h5>
        {hotel && (
          <div className="mb-5 flex h-full  ">
            <div className="w-full">
              <div className="max-w-[53rem] w-full bg-white  rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                <div className="py-7 px-6 space-y-2">
                  <h5 className="text-[#3b3f5c] text-xl font-semibold  dark:text-white-light">
                    {hotel.HotelName}
                  </h5>
                  <div className="flex items-center space-x-1 ">
                    {renderStars(hotel.HotelRating)}
                  </div>
                  <div className="flex gap-2">
                    <img src="../img/Address-icon.svg" alt="img" className="w-5 h-5"></img>
                  <p className="text-xs">{hotel.Address}</p>
                  </div>
                  <div className="flex flex-cols gap-2 mb-3">
                    <div className="max-w-[25rem] w-full border border-white-light dark:border-[#1b2e4b] hotel-border ">
                      <div className="py-2 px-6">
                        <div className="grid grid-cols-3 items-center justify-center">
                          <div>
                            <h5 className="text-xs">Check In Date</h5>
                            <span className="text-sm font-semibold">
                              {formatDate1(searchParams.checkIn)}
                            </span>
                          </div>

                          {/* Display number of nights in the button */}
                          <button className="border-2 w-20 h-5 mb-2 border-[#785ef7] text-[#785ef7] bg-transparent  hotel-border text-xs transition duration-300 hover:bg-[#785ef7] hover:text-white">
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
                    <div className="max-w-[25rem] w-full border border-white-light dark:border-[#1b2e4b] hotel-border text-center">
  <div className="py-2 px-6 flex justify-center">
    <h5 className="text-sm">
      <span className="font-bold">{nights}</span> {nights === 1 ? "Night" : "Nights"} | 
      <span className="font-bold"> {searchParams.Adults}</span> Adults | 
      <span className="font-bold"> {searchParams.Children}</span> Children (
      {searchParams.ChildAge?.length > 0 && (
        <span className="font-bold"> {searchParams.ChildAge.map((age) => `${age} yrs`).join(", ")}</span>
      )} ) |
      <span className="font-bold"> {searchParams.Rooms}</span> Rooms
    </h5>
  </div>
</div>

                  </div>
                  <div className="flex">
                  <h5 className="text-[#3b3f5c] text-lg font-semibold dark:text-white-light  ">
                          {hotel.Rooms[0].Name}
                        </h5>
                        <h5 className="item-end  ">
                         See Inclusion
                        </h5>
                    </div>
                    <span className="text-sm">
                            {searchParams.Adults} Adults , {searchParams.Children} Children
                        </span>
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
              
                </div>
              </div>
            </div>
            <div className="w-1/3">
              <div className="max-w-[19rem] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                <div className="py-7 px-6">
                  <h5 className="text-[#3b3f5c] text-xl font-semibold mb-4 dark:text-white-light">
                    CLI Based
                  </h5>
                  <p className="text-white-dark">
                    Etiam sed augue ac justo tincidunt posuere. Vivamus euismod
                    eros, nec risus malesuada.
                  </p>
                  <button type="button" className="btn btn-primary mt-6">
                    Explore More
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default HotelBooking;
