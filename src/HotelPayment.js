import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Modal from "./Modal";
import { useEffect, useRef, useState } from "react";

const HotelPayment = () => {
  const formatDate1 = (date) => dayjs(date).format("ddd D MMM YYYY");

  const location = useLocation();
  const combinedHotels = location.state?.combinedHotels;
  const personDetails = location.state?.personData;
  const searchParams = JSON.parse(sessionStorage.getItem("hotelData_header")) || {};
    // console.log(personDetails);
  const rooms = combinedHotels?.[0]?.Rooms?.[0];
  //   console.log('Rooms:', rooms);
  const Amount = rooms.TotalFare;
  //   console.log('Amount:', Amount);

  

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
      
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight for accurate comparison
      
        return CancelPolicies
          .filter((policy) => {
            // Convert FromDate to a Date object in a more reliable way
            const [day, month, year] = policy.FromDate.split(" ")[0].split("-");
            const policyDate = new Date(`${year}-${month}-${day}T00:00:00`);
            return policyDate >= today;
          })
          .map((policy) => {
            const formattedDate = policy.FromDate.split(" ")[0]; // Extract DD-MM-YYYY
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
      
      
      
      const validPolicies = formatCancelPolicies(
        combinedHotels?.[0]?.Rooms?.[0]?.CancelPolicies || []
      );
      console.log("Valid Policies:", validPolicies);

  const handleDays = (DayRates) => {
    if (!DayRates || !Array.isArray(DayRates) || DayRates.length === 0) {
      return []; // Return an empty array to avoid errors
    }

    // Access the first element of DayRates (which is an array) and extract BasePrice
    return DayRates[0].map((item) => item.BasePrice || 0);
  };

  //   const [selectedTab, setSelectedTab] = useState(null);
  //   const [selectedTab2, setSelectedTab2] = useState(null);

  //   const options = [
  //     {
  //       title: "UPI Options",
  //       description: "Pay Directly From Your Bank Account",
  //       action: () => handlePaymentMethod("1"),
  //     },
  //     {
  //       title: "Credit & Debit Cards",
  //       description: "Visa, MasterCard, Amex, Rupay and More",
  //       action: () => handlePaymentMethod("2"),
  //     },
  //     {
  //       title: "EMI",
  //       description: "No Cost EMI Available",
  //       action: () => handlePaymentMethod("3"),
  //     },
  //     {
  //       title: "Net Banking",
  //       description: "40+ Banks Available",
  //       action: () => handlePaymentMethod("4"),
  //     },
  //     {
  //       title: "Book Now Pay Later",
  //       description: "Lazypay, Simpl, HDFC, ICICI, IDFC",
  //       action: () => handlePaymentMethod("5"),
  //     },
  //     {
  //       title: "Gift Cards & e-wallets",
  //       description: "MMT Gift Cards & Amazon Pay",
  //       action: () => handlePaymentMethod("6"),
  //     },
  //   ];

  //   function handlePaymentMethod(method) {
  //     const menthod = method;
  //     setSelectedTab2(menthod);
  //     console.log(`Selected Payment Method:`, menthod);
  //   }
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState();
  const integerAmount = Amount;
  useEffect(() => {
    // Fetch data from API
    fetchOrderId();
  }, []);
  const fetchOrderId = async () => {
    try {
      const formData = new URLSearchParams();

      console.log(integerAmount);
      // formData.append('amount', integerAmount.toString());

      formData.append("amount", integerAmount);
      // console.log(typeof(Amount));
      const response = await fetch(
        "https://demo.taxivaxi.com/api/hotels/create_order_razorpay",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            // 'Origin': 'http://localhost:3000', // Change to your React app's origin
            // 'Access-Control-Request-Method': 'POST', // The method you're going to use
            // Authorization: `Basic ${btoa("Bai:Bai@12345")}`,
          },
          body: formData,
        }
      );
      const data = await response.json();
      console.log(data);
      const data1 = data.id;
      setOrderId(data1);
    } catch {}
  };
  const displayRazorpay = () => {
    console.log("real amount in paise:", Math.round(integerAmount));

    var options = {
        key: "rzp_test_go8VcTslr3QSxe",
        secret: "vQJRXCJnE5uIZ5y8Q4KjMbhV",
        amount: Math.round(integerAmount * 100), // Already in paise
        currency: "INR",
        name: "Cotrav",
        description: "Test Transaction",
        order_id: orderId,
        prefill: {
          name: "khushi devkar",
          email: "khushi.devghar@taxivaxi.com",
          contact: "1234567890",
        },
        theme: {
          color: "#785ef7",
        },
        modal: {
          ondismiss: function () {
            console.log("Checkout closed.");
          },
        },
        handler: function (response) {
          console.log("Payment Successful", response);
          navigate("/HotelBookingCompleted", { state: {combinedHotels} });
        },
      };
    
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    };
    
    // var options = {
    //     "key": "rzp_test_go8VcTslr3QSxe",
    //     "secret": "vQJRXCJnE5uIZ5y8Q4KjMbhV",
    //     "amount": 57000*100,
    //     "currency": "INR",
    //     "name": "Acme Corp",
    //     "description": "Test Transaction",
    //     "image": "https://example.com/your_logo",
    //     "prefill": {
    //         "name": "Gaurav Kumar",
    //         "email": "gaurav.kumar@example.com",
    //         "contact": "9000090000"
    //     },
    //     "theme": {
    //         "color": "#3399cc"
    //     }
    // };

  



  // Components for different payment methods
  const UPIPayment = () => (
    <div>
      <h5 className="text-xl font-semibold">UPI</h5>
      <p>Enter your UPI ID to proceed.</p>
      <input type="text" placeholder="UPI ID" className="border p-2 w-full" />
      <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Pay
      </button>
    </div>
  );

  const CreditPayment = () => (
    <div>
      <h5 className="text-xl font-semibold">Credit</h5>
      <p>Enter your credit card details.</p>
      <input
        type="text"
        placeholder="Card Number"
        className="border p-2 w-full"
      />
      <input
        type="text"
        placeholder="Expiry Date"
        className="border p-2 w-full mt-2"
      />
      <input type="text" placeholder="CVV" className="border p-2 w-full mt-2" />
      <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Pay
      </button>
    </div>
  );

  const EMIPayment = () => (
    <div>
      <h5 className="text-xl font-semibold">EMI</h5>
      <p>Select your EMI plan.</p>
      <select className="border p-2 w-full">
        <option>3 Months - 12% Interest</option>
        <option>6 Months - 10% Interest</option>
        <option>12 Months - 8% Interest</option>
      </select>
      <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Proceed
      </button>
    </div>
  );

  const NetBanking = () => (
    <div>
      <h5 className="text-xl font-semibold">Net Banking</h5>
      <p>Select your bank.</p>
      <select className="border p-2 w-full">
        <option>HDFC</option>
        <option>ICICI</option>
        <option>SBI</option>
      </select>
      <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Pay
      </button>
    </div>
  );

  const BookNowPayLater = () => (
    <div>
      <h5 className="text-xl font-semibold">Book Now Pay Later</h5>
      <p>You can complete the payment later.</p>
      <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
        Confirm Booking
      </button>
    </div>
  );

  const GiftCards = () => (
    <div>
      <h5 className="text-xl font-semibold">Gift Cards & e-wallets</h5>
      <p>Enter your gift card or e-wallet details.</p>
      <input
        type="text"
        placeholder="Gift Card Code"
        className="border p-2 w-full"
      />
      <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Redeem
      </button>
    </div>
  );
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div className="search-bar3 h-20 w-full " id="widgetHeader2">
      <div className="purple-header">
        {/* <h5 className="text-xl font-semibold text-white">
          Review your Booking
        </h5> */}
      </div>
      <div className="mb-5 h-full floating-bookings gap-10 ">
        <div className="space-y-2 px-3 py-2 w-full ">
          {combinedHotels.map((hotelItem, index) => (
            <div
              key={index}
              className="max-w-[72rem] shadow-[4px_6px_10px_-3px_#bfc9d4] w-full bg-white border hotel-border2 border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none"
              style={{ height: "464px" }}
            >
              <div>
                <div className="flex gap-8 px-5 py-7">
                  <div className="payment_width_boxs border overflow-hidden shadow-md hotel-border2 max-h-[409px]">
                    <div className="   ">
                      <div className="border-b px-3 pb-3 pt-3">
                        <h6 className="font18 font-semibold ">
                          {hotelItem.HotelName}
                        </h6>
                        <span className="text_hotel_address font12">
                          {hotelItem.Address}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 px-3 py-2  border-b ">
                        <div>
                          <h5 className="text-xs">CHECK IN</h5>
                          <span className="text-sm font-semibold">
                            {formatDate1(searchParams.checkIn)}
                          </span>
                          <br />
                          <span className="text-xs">{checkInTime}</span>
                        </div>

                        <div>
                          <h5 className="text-xs">CHECK OUT</h5>
                          <span className="text-sm font-semibold">
                            {formatDate1(searchParams.checkOut)}
                          </span>
                          <br />
                          <span className="text-xs">{checkOutTime}</span>
                        </div>
                      </div>

                      <div className="border light_color_cotrav px-3 py-2 h-8 font14 text-[#785ef7] cursor-pointer">
  {validPolicies.length === 0 || (validPolicies[0] === "No cancellation policies available.") ? (
    <span>No cancellation policy available</span>
  ) : (
    <span onClick={setShowDetails}>
      Cancellation Policy
    </span>
  )}
</div>

{showDetails && (
  <Modal
    title="Cancellation Policy"
    onClose={() => setShowDetails(false)}
  >
    {validPolicies.map((policy, idx) => (
      <div key={idx} className="gap-2 px-2 flex">
        <img
          src="../img/tick.svg"
          className="w-3 h-5"
          alt="✔"
        />
        <span>{policy}</span>
      </div>
    ))}
  </Modal>
)}

                      <div className="border-b py-2 pb-2 ">
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
                        <div className="flex gap-2 px-3">
                          <div>
                            {" "}
                            <img src="./img/Room_1.svg" className="w-5 h-5" />
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
                      </div>
                      <div className=" py-2">
                        <div className="flex gap-2 px-3">
                          <div>
                            <img
                              src="./img/Traveller.svg"
                              className="w-5 h-5"
                            />
                          </div>
                          <div>
  <div className="text-sm font-semibold">Traveler(s)</div>
  <div className="grid grid-cols-2 gap-3 mb-3">
    {/* First Traveler */}
    {personDetails?.[0] && (
      <div className={`text-sm ${personDetails?.[1] ? "border-r pr-2" : ""}`}>
        {personDetails[0].firstName} {personDetails[0].lastName}
        <div>
          {personDetails[0].email}{" "}
          {personDetails?.[1] ? "|" : "|"} {/* Show '|' only if there's a second traveler */}
          {personDetails[0].contact_no}
        </div>
      </div>
    )}

    {/* Second Traveler */}
    {personDetails?.[1] && (
      <div className="text-sm">
        {personDetails[1].firstName} {personDetails[1].lastName}
        <div>
          {personDetails[1].email} | {personDetails[1].contact_no}
        </div>
      </div>
    )}
  </div>
</div>

                        </div>
                      </div>
                    </div>
                  </div>
                  <div key={index} className="payment_width_box   space-y-6">
                    {Array.isArray(hotelItem.Images) &&
                    hotelItem.Images.length > 0 ? (
                      <div className=" ">
                        <img
                          src={hotelItem.Images[0]}
                          className="hotelPhotos_Payment"
                        ></img>
                      </div>
                    ) : (
                      <img
                        src="./img/image_NA04.png"
                        className="hotelPhotos_Payment"
                      ></img>
                    )}
                    <div
                      className="max-w-[53rem]  border overflow-hidden shadow-md hotel-border2 "
                      style={{}}
                    >
                      <div className="py-2">
                        <div className="px-3 flex justify-between items-center border-b">
                          <h6 className="text-sm font-semibold">
                            Free Summary
                          </h6>
                          <span className="text-[#785ef7] text-xs font-semibold cursor-pointer">
                            View Details
                          </span>
                        </div>
                        <div className="px-3 flex justify-between items-center py-1">
                          <h6 className="text-sm font-semibold">Hotel Fare</h6>
                          <span className="text-xs font-semibold cursor-pointer">
                            ₹{" "}
                            {handleDays(hotelItem?.Rooms?.[0]?.DayRates)
                              .reduce((acc, price) => acc + price, 0)
                              .toFixed(2)}
                          </span>
                        </div>

                        <div className="px-3 flex justify-between items-center border-b ">
                          <h6 className="text-sm font-semibold">others</h6>
                          <span className=" text-xs font-semibold cursor-pointer">
                            ₹ {Number(hotelItem.Rooms[0].TotalTax).toFixed(2)}
                          </span>
                        </div>
                        <div className="px-3 flex justify-between items-center py-1 border-b">
                          <h6 className="text-lg font-semibold">Total Due</h6>
                          <span className=" text-lg font-semibold cursor-pointer">
                            {/* ₹ {hotelItem.Rooms[0].TotalFare} */}₹{" "}
                            {Number(hotelItem.Rooms[0].TotalFare).toFixed(2)}
                          </span>
                        </div>
                        <div className="px-3  items-center py-2 ">
                          <button
                            type="button"
                            className="bg-[#785ef7]  h-10 text-white px-2 py-2 rounded-md font-semibold text-sm transition duration-300 hover:bg-[#5a3ec8] float-right mb-2"
                            style={{ width: "50%" }}
                            onClick={displayRazorpay} // Add the onClick handler here
                          >
                            Pay Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div>
              <h5 className="text-xl font-semibold   px-3">Payment Options</h5>
            </div> */}
                  {/* <div className="flex">
              <div className="payment_width_boxs border overflow-hidden shadow-md">
              

                {options.map((option, index) => (
                  <div
                    key={index}
                    className={`text-xl  border-b px-2 py-2 cursor-pointer transition-all duration-300 ease-in-out
            ${
              selectedTab === index
                ? "bg-white text-black border-gray-800"
                : "light_color_cotrav text-black border-gray-300"
            }`}
                    onClick={() => {
                      setSelectedTab(index);
                      option.action();
                    }}
                  >
                 
                    <div className="flex gap-2 px-3 ">
                      <div>
                        <div
                          className={`text-sm font-semibold ${
                            selectedTab === index
                              ? "text-black"
                              : "text-[#785ef7]"
                          }`}
                        >
                          {option.title}
                        </div>
                      
                        <span className="text-xs">{option.description}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full border">
      <div className="px-3 py-2">
        {selectedTab2 == "1" && <UPIPayment />}
        {selectedTab2 == "2" && <CreditPayment />}
        {selectedTab2 == "3" && <EMIPayment />}
        {selectedTab2 == "4" && <NetBanking />}
        {selectedTab2 == "5" && <BookNowPayLater />}
        {selectedTab2 == "6" && <GiftCards />}
      </div>
    </div>
            </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* {combinedHotels.map((hotelItem, index) => (
          <div key={index} className="payment_width_box  space-y-2">
            <div className="max-w-[53rem] shadow-[4px_6px_10px_-3px_#bfc9d4] w-full bg-white border hotel-border2 border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
              <div>
                <img
                  src="./img/hotelroom.jpg"
                  className="hotelPhotos_Payment"
                ></img>
                <div className="hoteldetail-conatiner w-full px-2">
                  <span className="text_hotel_address text-xs">
                    {hotelItem.Address.split(",").slice(-4).join(", ")}
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

               
                  <div className="text-2xl item-center mt-3 text-center font-bold">
                    -
                  </div>

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
                    <div className="textcolor ">{hotelItem.Rooms[0].Name}</div>
                  </div>
                </div>
                <div className="flex gap-2 px-3 border-b">
                  <div>
                    {" "}
                    <img src="./img/Room_1.svg" className="w-5 h-5" />
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
                    ₹{" "}
                    {handleDays(hotelItem?.Rooms?.[0]?.DayRates).reduce(
                      (acc, price) => acc + price,
                      0
                    )}
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
        ))} */}
      </div>
    </div>
  );
};
export default HotelPayment;
