import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

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
    const handleDays = (DayRates) => {
        if (!DayRates || !Array.isArray(DayRates) || DayRates.length === 0) {
          return []; // Return an empty array to avoid errors
        }
      
        // Access the first element of DayRates (which is an array) and extract BasePrice
        return DayRates[0].map((item) => item.BasePrice || 0); 
      };
      
      
      
    // const [selectedTab, setSelectedTab] = useState(null);
    // const [selectedTab2, setSelectedTab2] = useState(null);

    // const options = [
    //     { title: "UPI Options", description: "Pay Directly From Your Bank Account", action: () => handlePaymentMethod("1") },
    //     { title: "Credit & Debit Cards", description: "Visa, MasterCard, Amex, Rupay and More", action: () => handlePaymentMethod("2") },
    //     { title: "EMI", description: "No Cost EMI Available", action: () => handlePaymentMethod("3") },
    //     { title: "Net Banking", description: "40+ Banks Available", action: () => handlePaymentMethod("4") },
    //     { title: "Book Now Pay Later", description: "Lazypay, Simpl, HDFC, ICICI, IDFC", action: () => handlePaymentMethod("5") },
    //     { title: "Gift Cards & e-wallets", description: "MMT Gift Cards & Amazon Pay", action: () => handlePaymentMethod("6") },
    // ];

    // function handlePaymentMethod(method) {
    //     const menthod = method;
    //     setSelectedTab2(menthod);
    //     console.log(`Selected Payment Method:`, menthod);

    // }
    const handlePayment = async () => {
        const options = {
          key: "rzp_test_W9A9jvXZXqKiVa", // Replace with your Razorpay Key ID
          amount: 50000, // Amount in paise (50000 paise = ₹500)
          currency: "INR",
          name: "Cotrav",
          description: "Test Transaction",
        //   image: "https://your-logo-url.com/logo.png", // Optional logo
          handler: function (response) {
            alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
          },
          prefill: {
            name: "John Doe",
            email: "john@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#785ef7",
          },
        };
    
        const razorpay = new window.Razorpay(options);
        razorpay.open();
        
      };
    
      useEffect(() => {
        // Open Razorpay when the div is clicked
        const divElement = document.getElementById('razorpay-container');
        if (divElement) {
          divElement.addEventListener('click', handlePayment);
        }
    
        // Clean up the event listener when component unmounts
        return () => {
          if (divElement) {
            divElement.removeEventListener('click', handlePayment);
          }
        };
      }, []);
    
    return (
        <div className="search-bar3 h-20 w-full " id="widgetHeader2">
            <div className="purple-header">
                {/* <h5 className="text-xl font-semibold text-white">
          Review your Booking
        </h5> */}
            </div>
            <div className="mb-5 flex h-full floating-bookings gap-10 ">
                <div className="w-full space-y-5">
                <div className="max-w-[53rem] shadow-lg w-full bg-white border border-gray-300 p-4 rounded-lg" id="razorpay-container">
      <h5 className="text-xl font-semibold border-b pb-2">Payment Options</h5>
      <div className="flex justify-center mt-4">
        <p>Click anywhere here to initiate the Razorpay payment</p>
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
                               <div className="hoteldetail-conatiner w-full px-2">
  <span className="text_hotel_address text-xs">
    {hotelItem.Address.split(',').slice(-4).join(', ')}
  </span>
</div>


                            </div>

                            <div className="py-2  space-y-2">
                                <div className="grid grid-cols-3 px-1  ">
                                    <div>
                                        <h5 className="text-xs">CHECK IN</h5>
                                        <span className="text-sm font-semibold">
                                            {formatDate1(searchParams.checkIn)}
                                        </span>
                                        <p className="text-xs">{checkInTime}</p>
                                    </div>

                                    {/* Separator in the middle */}
                                    <div className="text-2xl item-center mt-3 text-center font-bold">-</div>

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
                                <div className="px-3 flex gap-2">
                                    <div>
                                        <img src="./img/Room.svg" className="w-5 h-5" />
                                    </div>
                                    <div className="text-sm font-semibold  ">

                                        Rooms
                                    
                                    <div className="textcolor ">
                                        {hotelItem.Rooms[0].Name}
                                    </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 px-3 border-b">
                                    <div>  <img src="./img/Room_1.svg" className="w-5 h-5" />
                                    </div>
                                    <div className="text-sm font-semibold   ">

                                        Premium Rooms

                                        <div className="textcolor  ">
                                            {hotelItem.Rooms[0].MealType === "Room_Only"
                                                ? "Room Only"
                                                : hotelItem.Rooms[0].MealType === "BreakFast"
                                                    ? "Breakfast Included"
                                                    : hotelItem.Rooms[0].MealType}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 px-3">
                                    <div>
                                        <img src="./img/Traveller.svg" className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold  "> Traveler(s) </div>
                                        <div className="text-sm ">Khushi Devkar</div>
                                        <div className="text-sm ">
                                            Khushidevkar@taxivaxi.com|7822865797
                                        </div>
                                    </div>
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
                                <div className="px-3 flex justify-between items-center">
  <h6 className="text-sm font-semibold">Hotel Fare</h6>
  <span className="text-xs font-semibold cursor-pointer">
    ₹ {handleDays(hotelItem?.Rooms?.[0]?.DayRates).reduce((acc, price) => acc + price, 0)}
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
                                        ₹ {hotelItem.Rooms[0].TotalFare}
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
