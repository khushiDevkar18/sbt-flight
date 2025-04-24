import { format } from "date-fns";
import { useLocation } from "react-router-dom";

const FinalCab = () => {
    const Header = JSON.parse(sessionStorage.getItem("Header_Cab")) || {};
    const location = useLocation();
    const item = location.state?.cabData;
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
return(
<div>
<div className="search-bar3 h-20 w-full " id="widgetHeader2">
        <div className="purple-header">
          <div className="px-3">
            <h5 className="text-xl font-semibold text-white">
              Review your Booking
            </h5>
            <h6 className="text-white text-sm">
              {Header.Cities?.filter(Boolean)
                .map((city) => city.split(",")[0].trim())
                .join(" → ")}
            </h6>
            <h6 className="text-white text-sm">
              {Header.selectType} | Pickup: {formattedPickup}
            </h6>
          </div>
        </div>
        <div className="mb-5  h-full space-y-5 floating-bookings">
          {/* <div className="w-full space-y-5"> */}
          <div className="max-w-[74rem] w-full grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] bg-white dark:bg-[#191e3a] border border-gray-200 dark:border-[#1b2e4b] rounded-md shadow-md p-6 gap-6 transition-all duration-300 hover:shadow-lg">
            {/* Vehicle Image */}
            <div className="flex items-center justify-center p-3 bg-gray-50 dark:bg-[#1d263a] rounded-lg border border-gray-100 dark:border-[#25324d]">
              <img
                src={item.vehicle.image}
                alt={item.vehicle.type}
                className="h-32 w-full object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Vehicle Details */}
            <div className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-[#f0f4ff]">
                  {item.vehicle.description}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {item.vehicle.type} • {item.vehicle.no_of_seats} Seats •{" "}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {item.package.kms_included} kms included
                  </span>
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FeatureItem
                  icon="./img/Extra_Km.svg"
                  label="Extra km fare:"
                  value={`₹${item.package.rate_per_km}/km After ${item.package.kms_included} kms`}
                />
                <FeatureItem
                  icon="./img/Fuel_type.svg"
                  label=""
                  value={`${item.vehicle.fuel_type} with refill breaks`}
                />
                <FeatureItem
                  icon="./img/Cancel_Cab.svg"
                  label="Cancellation:"
                  value="Free till 1 hour of departure"
                />
                <FeatureItem
                  icon="./img/Package.svg"
                  label="Package:"
                  value={`${item.package.package_name} `}
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
          </div>
        </div>
</div>
);
}
export default FinalCab;