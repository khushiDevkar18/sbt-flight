import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

const HotelPayment = () => {
  const formatDate1 = (date) => dayjs(date).format("ddd D MMM YYYY");

  const location = useLocation();
  const combinedHotels = location.state?.combinedHotels;
  const searchParams = JSON.parse(sessionStorage.getItem("hotelData")) || {};
  //   console.log(combinedHotels);
  //   console.log("hello");
  const checkInTime =
    combinedHotels.length > 0
      ? combinedHotels[0].RateConditions?.find((condition) =>
          condition.includes("CheckIn Time-Begin")
        )
          ?.replace("CheckIn Time-Begin:", "")
          .trim()
      : "N/A";

  const checkOutTime =
    combinedHotels.length > 0
      ? combinedHotels[0].RateConditions?.find((condition) =>
          condition.includes("CheckOut Time")
        )
          ?.replace("CheckOut Time:", "")
          .trim()
      : "N/A";

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
  return (
    <div className="search-bar3 h-20 w-full " id="widgetHeader2">
      <div className="purple-header">
        <h5 className="text-xl font-semibold text-white">
          Review your Booking
        </h5>
      </div>
      <div className="mb-5 flex h-full floating-bookings gap-10 ">
        <div className="w-full space-y-5">
          <div className="max-w-[53rem] shadow-[4px_6px_10px_-3px_#bfc9d4] w-full bg-white border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
            <div className="py-7 px-2 space-y-2 flex">
              <div className="payment_width_box border ">
              <h5 className="text-xl font-semibold border-b  bg-blue-100">Payment Options</h5>
                <div className="text-xl font-semibold border-b bg-blue-100 ">
                  <div className="text-lg">UPI Options</div>
                  <span className="text-sm">
                    Pay Directly From Your Bank Account{" "}
                  </span>
                </div>
                <div className="text-xl font-semibold border-b bg-blue-100">
                  <div className="text-lg">Credit & Debit Cards</div>
                  <span className="text-sm">
                   Visa, MasterCard, Amex, Rupay and More{" "}
                  </span>
                </div>
                <div className="text-xl font-semibold border-b bg-blue-100">
                  <div className="text-lg">EMI</div>
                  <span className="text-sm">
                   No Cost EMI Available{" "}
                  </span>
                </div>
                <div className="text-xl font-semibold border-b bg-blue-100">
                  <div className="text-lg">Net Banking</div>
                  <span className="text-sm">
                   40+ Banks Available
                  </span>
                </div>
                <div className="text-xl font-semibold border-b bg-blue-100">
                  <div className="text-lg">Book Now Pay Later </div>
                  <span className="text-sm">
                   Lazypay, simpl, HDFC, ICICI , IDFC
                  </span>
                </div>
                <div className="text-xl font-semibold border-b bg-blue-100">
                  <div className="text-lg">Gift Cards & e-wallets</div>
                  <span className="text-sm">
                  MMT Gift Cards & Amazon pay
                  </span>
                </div>
              </div>
              <div className="w-full border">
                <h5 className="text-xl font-semibold ">Payment Options</h5>
              </div>
            </div>
          </div>
        </div>
        {combinedHotels.map((hotelItem, index) => (
          <div key={index} className="payment_width_box sticky top-0 space-y-2">
            <div className="max-w-[53rem] shadow-[4px_6px_10px_-3px_#bfc9d4] w-full bg-white border hotel-border2 border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
              <div>
                <img
                  src="./img/hotelroom.jpg"
                  className="hotelPhotos_Payment"
                ></img>
                <div className="hoteldetail-conatiner  w-full px-2  ">
                  <span className="text_hotel_address text-xs">
                    {hotelItem.Address}
                  </span>
                </div>
              </div>

              <div className="py-2  space-y-2">
                <div className="grid grid-cols-3 px-1 text-center ">
                  <div>
                    <h5 className="text-xs">CHECK IN</h5>
                    <span className="text-sm font-semibold">
                      {formatDate1(searchParams.checkIn)}
                    </span>
                    <p className="text-xs">{checkInTime}</p>
                  </div>

                  {/* Separator in the middle */}
                  <div className="text-lg font-bold">-</div>

                  <div>
                    <h5 className="text-xs">CHECK OUT</h5>
                    <span className="text-sm font-semibold">
                      {formatDate1(searchParams.checkOut)}
                    </span>
                    <p className="text-xs">{checkOutTime}</p>
                  </div>
                </div>
                <div className="border border-green-800 bg-green-500 px-2  text-xs text-white">
                  {formatCancelPolicies(
                    hotelItem?.Rooms?.[0]?.CancelPolicies || []
                  ).map((policy, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <img src="../img/tick.svg" className="w-3 h-5" alt="✔" />
                      <span>{policy}</span>
                    </div>
                  ))}
                </div>

                <div className="text-sm font-semibold px-3 ">Rooms</div>
                <div className="text-sm font-semibold px-3  border-b">
                  Premium Rooms
                  <div className="textcolor  ">
                    {hotelItem.Rooms[0].MealType === "Room_Only"
                      ? "Room Only"
                      : hotelItem.Rooms[0].MealType === "BreakFast"
                      ? "Breakfast Included"
                      : hotelItem.Rooms[0].MealType}
                  </div>
                </div>
                <div className="text-sm font-semibold px-3 "> Traveler(s) </div>
                <div className="text-sm px-3 ">Khushi Devkar</div>
                <div className="text-sm px-3 ">
                  Khushidevkar@taxivaxi.com|7822865797
                </div>

                <div></div>
              </div>
            </div>
            <div className="max-w-[53rem] shadow-[4px_6px_10px_-3px_#bfc9d4] w-full bg-white border hotel-border2 border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
              <div className="py-2">
                <div className="px-3 flex justify-between items-center border-b">
                  <h6 className="text-sm font-semibold">Free Summary</h6>
                  <span className="text-[#785ef7] text-xs font-semibold cursor-pointer">
                    View Details
                  </span>
                </div>
                <div className="px-3 flex justify-between items-center ">
                  <h6 className="text-sm font-semibold">Hotel Fare</h6>
                  <span className=" text-xs font-semibold cursor-pointer">
                    ₹ {hotelItem.Rooms[0].TotalFare}
                  </span>
                </div>
                <div className="px-3 flex justify-between items-center border-b ">
                  <h6 className="text-sm font-semibold">others</h6>
                  <span className=" text-xs font-semibold cursor-pointer">
                    ₹ {hotelItem.Rooms[0].TotalTax}
                  </span>
                </div>
                <div className="px-3 flex justify-between items-center">
                  <h6 className="text-lg font-semibold">Total Due</h6>
                  <span className=" text-lg font-semibold cursor-pointer">
                    ₹ {hotelItem.Rooms[0].NetAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default HotelPayment;
