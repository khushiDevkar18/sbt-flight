import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

 const FinalCab = () => {
    const Header = JSON.parse(sessionStorage.getItem("Header_Cab")) || {};
    const [bookingDetails, setBookingDetails] = useState('');
    const location = useLocation();
    const item = location.state?.cabData;
    const bookingId = location.state?.BookingId;
    const formattedPickup = `${format(
        new Date(Header.pickup_date + " " + Header.pickup_time),
        "eee, dd MMM ''yy, hh:mm a"
      )}`;
      const FeatureItem = ({ icon, label, value }) => (
        <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
          <div className="p-1.5 bg-gray-100 dark:bg-[#1d263a] rounded-lg">
            <img src={icon} className="w-5 h-5" alt="" />
          </div>
          <div>
            {label && <span className="font-medium">{label} </span>}
            <span className="text-gray-900 dark:text-gray-100">{value}</span>
          </div>
        </div>
      );
      console.log(bookingId);
      useEffect(() => {
        const numericBookingId = bookingId ? bookingId.replace(/\D/g, "") : "";
      
        if (!numericBookingId) {
          console.warn("No valid booking ID found. Skipping fetch.");
          return;
        }
      
        const fetchBookingDetails = async () => {
          try {
            console.log("Fetching booking with ID:", numericBookingId);
            const formData = new URLSearchParams();
            formData.append("booking_id", numericBookingId);
      
            const response = await fetch(
              "https://demo.fleet247.in/api/corporate_apis/v1/getSuccessBookingDetails",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData.toString(),
              }
            );
      
            const result = await response.json();
            console.log("Fetched Booking Details:", result);
      
            if (result.success === "true") {
              setBookingDetails(result.data);
            } else {
              console.error("API Error:", result.message);
            }
          } catch (error) {
            console.error("Fetch Error:", error);
          }
        };
      
        fetchBookingDetails();
      }, [bookingId]);
      
return(
<div>
<div className="search-bar3 h-20 w-full " id="widgetHeader2">
        <div className="purple-header">
          <div className="px-3">
            <h5 className="text-xl font-semibold text-white">
              Review your Booking
            </h5>
            <h6 className="text-white text-sm">
  {(typeof Header.Cities === "string" ? Header.Cities.split(",") : Header.Cities || [])
    .filter(Boolean)
    .map((city) => city.trim())
    .join(" → ")}
</h6>
<h6 className="text-white text-sm">
  {(typeof Header.SearchCities === "string" ? Header.SearchCities.split(",") : Header.SearchCities || [])
    .filter(Boolean)
    .map((city) => city.trim())
    .join(" → ")}
</h6>
            <h6 className="text-white text-sm">
              {Header.selectType} | Pickup: {formattedPickup}
            </h6>
          </div>
        </div>
        <div className="mb-5  h-full  floating-bookings">
          {/* <div className="w-full space-y-5"> */}
          
  


          <div className=" space-y-5 max-w-6xl w-full bg-white dark:bg-[#191e3a] border border-gray-200 dark:border-[#1b2e4b] rounded-md shadow-md p-6 transition-all duration-300 hover:shadow-lg">

{/* Top Section */}
<div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-md text-sm">
    <p className="font-semibold">Thanks, your booking has been confirmed.</p>
    <p>
      Dear <strong>{bookingDetails.passenger_name}</strong>, your advance payment has been received by CoTrav. Your journey is confirmed.
      The details of the driver and car shall be shared 4hrs before the pickup time.
    </p>
  </div>

<div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-6">
  

  {/* Vehicle Image */}
  <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-[#1d263a] rounded-lg border border-gray-100 dark:border-[#25324d]">
    <img
      src={item.vehicle.image}
      alt={item.vehicle.type}
      className="h-28 w-auto object-contain"
    />
  </div>

  {/* Vehicle Details */}
  <div className="flex flex-col justify-between gap-3">
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        {item.vehicle.description}
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
        {item.vehicle.type} • {item.vehicle.no_of_seats} Seats •{" "}
        <span className="text-emerald-600 dark:text-emerald-400">
          {item.package.kms_included} kms included
        </span>
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
      <FeatureItem
        icon="./img/Extra_Km.svg"
        label="Extra km fare"
        value={`₹${item.package.rate_per_km}/km After ${item.package.kms_included} kms`}
      />
      <FeatureItem
        icon="./img/Fuel_type.svg"
        label="Fuel Type"
        value={`${item.vehicle.fuel_type} with refill breaks`}
      />
      <FeatureItem
        icon="./img/Cancel_Cab.svg"
        label="Cancellation"
        value="Free till 1 hour of departure"
      />
      <FeatureItem
        icon="./img/Package.svg"
        label="Package"
        value={`${item.package.package_name}`}
      />
    </div>
  </div>

  {/* Pricing */}
  <div className="flex flex-col items-end justify-between">
    <div className="text-right space-y-1">
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        ₹{item.payment.estimated_base_fare}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        + ₹{item.payment.gst} (Taxes & Charges)
      </p>
    </div>
  </div>
</div>


<div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

<p><strong>Travel Summery</strong> {item.booking_id}</p>
<p><strong>Booking ID:</strong> <stong>{bookingId} </stong></p>
<div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700 dark:text-gray-300">

  <div className="space-y-1 border-r">
    
   
    <h3 className="text-xs ">Name: <strong>{bookingDetails.passenger_name}</strong></h3>
    <h3 className="text-xs "><strong>Mob No:</strong> {bookingDetails.passenger_phone}</h3>
    <h3 className="text-xs "><strong>Mail Id:</strong> {bookingDetails.passenger_email}</h3>
  </div>
  <div className="space-y-1 px-4">
    <h3 className="text-xs "><strong>Trip Type:</strong> {item.vehicle.description} | {item.package.package_name}</h3>
    <h3 className="text-xs "><strong>Trip Costed:</strong> ₹{item.payment.estimated_price}</h3>
    <h3 className="text-xs "><strong>Advance Paid:</strong> ₹{bookingDetails.advance_paid}</h3>
  </div>
</div>
</div>

          </div>
        </div>
</div>
);
}
export default FinalCab;