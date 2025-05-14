import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Modal from "./Modal";
import PhoneInput from "react-phone-input-2";
import Swal from "sweetalert2";
const CabDetails = () => {
  const Header = JSON.parse(sessionStorage.getItem("Header_Cab")) || {};
  const location = useLocation();
  const item = location.state?.cabData;
  const navigate = useNavigate();
  // console.log(item.fare_rules.advance_percentage);
  const decodeHtmlEntities = (text) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  };
  const stripHtmlTags = (html) => {
    const decodedHtml = decodeHtmlEntities(html);
    return decodedHtml.replace(/<\/?[^>]+(>|$)/g, "");
  };
  const [AdvancePayment, setAdvancePayment] = useState();
  useEffect(() => {
    const Value = item.payment.estimated_price;
    const percentage = item.fare_rules.advance_percentage;
    const result = (percentage / 100) * Value;
    console.log(result);
    setAdvancePayment(result);
  });
  const [pickupAddress, setpickupAddress] = useState();
  const [dropAddress, setDropAddress] = useState();
  const [formData, setFormData] = useState({
    pickupAddress: "",
    dropAddress: "",
    name: "",
    gender: "",
    email: "",
    contact: "",
  });

  const [errors, setErrors] = useState({});
  const [openTerms, setOpenTerms] = useState(false);

  const autocompleteRef = useRef(null);
  const dropoffAutocompleteRef = useRef(null);

  useEffect(() => {
    const setupAutocomplete = (ref, field) => {
      if (!window.google || !ref.current) return;

      const autocomplete = new window.google.maps.places.Autocomplete(
        ref.current,
        {
          types: ["address"],
          fields: ["formatted_address"],
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        setFormData((prev) => ({ ...prev, [field]: place.formatted_address }));
      });
    };

    setupAutocomplete(autocompleteRef, "pickupAddress");
    setupAutocomplete(dropoffAutocompleteRef, "dropoffAddress");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.pickupAddress)
      newErrors.pickupAddress = "Pick-up location is required";

    if (!formData.dropAddress)
      newErrors.dropAddress = "Drop location is required";

    if (!formData.name) newErrors.name = "Name is required";

    if (!formData.gender) newErrors.gender = "Please select gender";

    if (!formData.email) newErrors.email = "Email is required";

    const phoneDigits = formData.contact.replace(/\D/g, "");
    if (phoneDigits.length < 10)
      newErrors.contact = "Enter a valid 10-digit phone number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const warningRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (item?.warnings?.wallet_warning && warningRef.current) {
      warningRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    Swal.fire({
      title: "Cab Booking Confirmation",
      text: `We would like to inform you that ₹${AdvancePayment} will be deducted from your wallet for cab booking. Do you want to continue?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, continue!",
      cancelButtonText: "No!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleCabBooking(); // call your function here
      }
    });
  };

  const calculateDays = (pickupDate, dropDate) => {
    const start = new Date(pickupDate);
    const end = new Date(dropDate);

    // Get time difference in milliseconds
    const diffTime = end - start;

    // Convert to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };
  const numberOfDays = calculateDays(Header.pickup_date, Header.Drop_date);
  console.log(numberOfDays);
  // useEffect(() => {
  //   const fetchCities = async () => {
  //     try {
  //       const response = await fetch('https://demo.fleet247.in/api/tbo_bus/sbtCityList', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }

  //       const data = await response.json();
  //       console.log('City List:', data);
  //       // setCities(data); // You can store this in state
  //     } catch (error) {
  //       console.error('Error fetching city list:', error);
  //     }
  //   };

  //   fetchCities();
  // }, []);

  const handleCabBooking = async (e) => {
    try {
      const data = new URLSearchParams();
      let apiUrl = "";

      if (Header.selectType === "Local") {
        data.append("tour_type", "0");
        data.append("days", "0");
        data.append("is_local", "1");

        apiUrl =
          "https://demo.fleet247.in/api/corporate_apis/v1/recordTripDetails";
      } else if (
        Header.selectType === "Round Trip (Outstation)" ||
        Header.selectType === "MultiCity (Outstation)"
      ) {
        data.append("tour_type", "2");
        data.append("is_local", "0");
        data.append("days", numberOfDays.toString());

        apiUrl =
          "https://demo.fleet247.in/api/corporate_apis/v1/recordTripDetailsOutstation";
      } else if (Header.selectType === "Oneway") {
        data.append("type_of_tour", "1");
        data.append("is_local", "0");
        data.append("days", "0");

        apiUrl =
          "https://demo.fleet247.in/api/corporate_apis/v1/recordOneWayTripDetails";
      }

      data.append("token_id", "5268d5792d02df568cdf2f8146577eba");
      data.append("package", item.package.package_name);
      data.append("pickup_location", Header.pickup_city.google_city_name);
      data.append("pickup_location_detail", pickupAddress);
      data.append("locality", Header.pickup_city.city_name);
      data.append("pickup_date", Header.pickup_date);
      data.append("pickup_time", Header.pickup_time);
      data.append("return_date", Header.Drop_date);
      data.append("cities", Header.Cities);
      data.append("no_of_seats", item.vehicle.no_of_seats);
      data.append("estimated_price", item.payment.estimated_price);
      data.append("chargable_km", item.package.kms_included);
      data.append("min_km_chargable", "");
      data.append("min_fare_per_booking", "");
      data.append("estimated_extra_km", item.payment.estimated_chargable_kms);
      data.append("estimaed_extra_charge", "");
      data.append("base_fare", item.package.base_fare);
      data.append("driver_allowance", item.package.driver_day_allowance);
      data.append("advance_paid", AdvancePayment);
      data.append("passenger_name", formData.name);
      data.append("passenger_email", formData.email);
      data.append("passenger_phone", formData.contact);
      data.append("taxi_model_id", item.vehicle.exact_model);
      data.append("taxi_type_id", item.vehicle.type_id);
      data.append("rate_id", item.package.rate_id);
      data.append("corporate_id", "2");
      data.append("service_tax", item.payment.gst);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data.toString(),
      });

      const result = await response.json();
      const daa = result.data.booking_id;
      console.log("Booking result:", daa);

      if (result.success === "true") {
        navigate("/FinalCab", {
          state: {
            cabData: item,

            BookingId: daa,
          },
        });
      } else {
        Swal.fire({
          title: "Something Went Wrong",
          text: result.message,
          icon: "warning",
          showCancelButton: true,
          reverseButtons: true,
        });
      }
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Something went wrong. Please try again.");
    }
  };

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

  return (
    <div>
      <div className="search-bar3 h-20 w-full " id="widgetHeader2">
        <div className="purple-header">
          <div className="px-3">
            <h5 className="text-xl font-semibold text-white">
              Review your Cab Details
            </h5>

            <h6 className="text-white text-sm">
              {(typeof Header.Cities === "string"
                ? Header.Cities.split(",")
                : Header.Cities || []
              )
                .filter(Boolean)
                .map((city) => city.trim())
                .join(" → ")}
            </h6>
            <h6 className="text-white text-sm">
              {(typeof Header.SearchCities === "string"
                ? Header.SearchCities.split(",")
                : Header.SearchCities || []
              )
                .filter(Boolean)
                .map((city) => city.trim())
                .join(" → ")}
            </h6>

            <h6 className="text-white text-sm">
              {Header.selectType} | Pickup: {formattedPickup}
            </h6>
          </div>
        </div>
        <div className="mb-5  h-full space-y-5 floating-bookings">
          {/* <div className="w-full space-y-5"> */}
          <div className="max-w-[74rem] w-full grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] bg-white dark:bg-[#191e3a] border border-gray-200 dark:border-[#1b2e4b] rounded-md shadow-md p-6 gap-6 transition-all duration-300 ">
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
          {item.warnings !== null && item.warnings !== undefined && (
            <div
              className="max-w-[74rem] w-full bg-white rounded-md border border-gray-200 shadow p-3"
              ref={warningRef}
            >
              <span className="ltr:pr-2 rtl:pl-2">
                <strong className="ltr:mr-2 rtl:ml-2 text-red-400">
                  {item.warnings.wallet_warning}
                </strong>
              </span>
              <button
                type="button"
                className="ltr:ml-auto rtl:mr-auto hover:opacity-80"
              >
                {/* <IconX className="w-5 h-5" /> */}
              </button>
            </div>
          )}

          <div className="max-w-[74rem] w-full bg-white rounded-md border border-gray-200 shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2  divide-y md:divide-y-0 md:divide-x divide-gray-300">
              {/* Inclusions */}
              <div className="pr-0 md:pr-6 px-3">
                <h3 className="flex items-center text-green-700 text-base font-semibold mb-4">
                  <svg
                    className="w-5 h-5 mr-2 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Inclusions
                  <span className="ml-2 text-sm text-gray-500">
                    (Included in the Price)
                  </span>
                </h3>
                <ul className="space-y-2 text-gray-700 text-sm list-disc list-inside">
                  {item?.fare_rules?.inclusions
                    ?.split("\n")
                    .slice(0, 4)
                    .map((condition, index) => (
                      <li key={index}>{stripHtmlTags(condition)}</li>
                    ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="pt-6 md:pt-0 pl-0 md:pl-6 px-5">
                <h3 className="flex items-center text-red-600 text-base font-semibold mb-4">
                  <svg
                    className="w-5 h-5 mr-2 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 9.293l6.293-6.293 1.414 1.414L11.414 10l6.293 6.293-1.414 1.414L10 11.414l-6.293 6.293-1.414-1.414L8.586 10 2.293 3.707l1.414-1.414L10 8.586z" />
                  </svg>
                  Exclusions
                  <span className="ml-2 text-sm text-gray-500">
                    (Extra Charges)
                  </span>
                </h3>
                <ul className="space-y-2 text-gray-700 text-sm list-disc list-inside">
                  {item?.fare_rules?.exclusions
                    ?.split("\n")
                    .slice(0, 4)
                    .map((condition, index) => (
                      <li key={index}>{stripHtmlTags(condition)}</li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="max-w-[74rem] w-full bg-white rounded-md border border-gray-200 shadow-sm p-5">
            <h2 className="text-lg font-bold mb-3">Trip details</h2>
            <form onSubmit={handleSubmit}>
              {/* Pick-up Address */}
              <div className="mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-sm">
                      Pick-up Address
                      <span className="text-gray-500 text-xs ml-1">
                        (This will help our driver reach you on time)
                      </span>
                    </label>
                    <input
                      ref={autocompleteRef}
                      name="pickupAddress"
                      type="text"
                      placeholder="Enter pick-up location"
                      className="w-full mt-1 p-3 border rounded-md placeholder-gray-400 text-xs h-2"
                      autoComplete="off"
                      value={pickupAddress}
                      onChange={handleInputChange}
                    />
                    {errors.pickupAddress && (
                      <p className="text-red-500 text-xs">
                        {errors.pickupAddress}
                      </p>
                    )}
                  </div>
                  <div className="">
                    <label className="block font-semibold text-sm">
                      Drop-off Address
                      <span className="text-gray-500 text-xs ml-1">
                        (Optional)
                      </span>
                    </label>
                    <input
                      ref={dropoffAutocompleteRef}
                      name="dropAddress"
                      type="text"
                      placeholder="Enter drop-off location"
                      className="w-full mt-1 p-3 border rounded-md placeholder-gray-400 text-xs h-2"
                      autoComplete="off"
                      value={dropAddress}
                      onChange={handleInputChange}
                    />
                    {errors.dropAddress && (
                      <p className="text-red-500 text-xs">
                        {errors.dropAddress}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Drop-off Address
      <div className="mb-6">
        <label className="block font-semibold text-sm">
          Drop-off Address
          <span className="text-gray-500 text-xs ml-1">(Optional)</span>
        </label>
        <input
          ref={dropoffAutocompleteRef}
          name="dropAddress"
          type="text"
          placeholder="Enter drop-off location"
          className="w-full mt-1 p-3 border rounded-md placeholder-gray-400 text-xs h-2"
          autoComplete="off"
          value={dropAddress}
          onChange={handleInputChange}
        />
         {errors.dropAddress && <p className="text-red-500 text-xs">{errors.dropAddress}</p>}
      </div> */}

              <hr className="my-6" />

              <h3 className="text-lg font-semibold mb-3">
                Confirm Traveller information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block font-semibold mb-1">Name</label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className=" input_width_cab p-3 border rounded-md placeholder-gray-400 text-xs h-2"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">{errors.name}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block font-semibold mb-2 text-sm">
                    Gender
                  </label>
                  <div className="flex items-center gap-4 text-xs">
                    {["Male", "Female", "Other"].map((g) => (
                      <label className="flex items-center" key={g}>
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={formData.gender === g}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        {g}
                      </label>
                    ))}
                  </div>
                  {errors.gender && (
                    <p className="text-red-500 text-xs">{errors.gender}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block font-semibold text-sm">
                    Email Id
                    <span className="text-gray-500 text-xs ml-1">
                      (Booking confirmation will be sent here)
                    </span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter Email ID"
                    value={formData.email}
                    onChange={handleChange}
                    className="input_width_cab p-3 mt-1 border rounded-md placeholder-gray-400 text-xs h-2"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email}</p>
                  )}
                </div>

                {/* Contact */}
                <div>
                  <label className="block font-semibold mb-1 text-sm">
                    Contact Number
                  </label>
                  {/* <div className="flex">
            <input
              type="text"
              value="+91"
              readOnly
              className="w-20 p-3 border rounded-l-md bg-gray-100 text-center text-xs h-2"
            />
            <input
              name="contact"
              type="tel"
              placeholder="Enter 10 digit mobile number"
              value={formData.contact}
              onChange={handleChange}
              className="flex-grow p-3 border-t border-b border-r rounded-r-md placeholder-gray-400 text-xs h-2 "
            />
          </div> */}
                  <PhoneInput
                    country={"in"}
                    enableAreaCodes={true}
                    isValid={(value, country) => {
                      const digits = value.replace(/\D/g, "");
                      return digits.length >= 10;
                    }}
                    value={formData.contact}
                    onChange={(phone) => {
                      handleChange({
                        target: {
                          name: "contact", // ✅ Fix here
                          value: phone,
                        },
                      });
                    }}
                    onlyCountries={["us", "gb", "in", "au", "de", "fr", "jp"]}
                    disableDropdown={false}
                    buttonClass="show-flag"
                    containerClass="custom-phone-input"
                    inputClass="contact-number-input"
                    style={{ width: "70%" }}
                  />

                  {errors.contact && (
                    <p className="text-red-500 text-xs">{errors.contact}</p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <p className="mt-6 text-sm text-gray-600">
                By proceeding to book, I Agree to Cotrav's{" "}
                <span
                  className="text-blue-600 cursor-pointer"
                  onClick={() => setOpenTerms(true)}
                >
                  Terms & Condition
                </span>
                .
              </p>

              {openTerms && (
                <Modal
                  title="Terms & Conditions"
                  onClose={() => setOpenTerms(false)}
                >
                  {item?.fare_rules?.termsconditions &&
                    item.fare_rules.termsconditions
                      .split("\n")
                      .slice(0, 4)
                      .map((line, idx) => (
                        <p className="text-xs" key={idx}>
                          {stripHtmlTags(line)}
                        </p>
                      ))}
                </Modal>
              )}

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="bg-[#785ef7] hover:bg-[#5a3ec8] text-white text-sm font-semibold px-4 py-2 rounded-md transition"
                >
                  Book & Pay Now
                </button>
              </div>
            </form>
          </div>
          {/* </div> */}
          {/* <div className="w-1/3 ">
            <div className="sticky top-0">
              <div className="w-full max-w-md bg-white border rounded-md shadow-md p-4 mx-auto">
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-md text-lg mb-4">
                  PAY ₹230 NOW
                </button>

                
                <div className="mb-4">
                  <label className="flex items-center justify-between p-3 border rounded-md mb-2 ">
                    <input type="radio" name="payment" className="mr-2" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        Make part payment now
                      </p>
                      <p className="text-xs text-gray-500">
                        Pay the rest to the driver
                      </p>
                    </div>
                    <span className="font-semibold">₹230</span>
                  </label>

                  <label className="flex items-center justify-between p-3 border rounded-md">
                    <input type="radio" name="payment" className="mr-2" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        Make full payment now
                      </p>
                    </div>
                    <span className="font-semibold">₹768</span>
                  </label>
                </div>

                <hr className="my-4" />

             
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold">Total Amount</h3>
                    <p className="text-xs text-gray-500">
                      inc. of tolls and taxes
                    </p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-xl font-bold">₹768</h3>
                    <button className="text-blue-600 text-sm underline font-medium">
                      Fare Breakup
                    </button>
                  </div>
                </div>

               
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Enter Coupon code
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="eg. CAB100"
                      className="flex-grow border rounded-l-md px-3 py-2 text-sm"
                    />
                    <button className="bg-gray-300 px-4 rounded-r-md text-sm font-semibold">
                      APPLY
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};
export default CabDetails;
