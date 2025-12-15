import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CONFIG from "./config";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Swal from "sweetalert2";
import Select from "react-select";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Tooltip,
  IconButton,
} from "@mui/material";
import PhoneInput from "react-phone-input-2";
import { data } from "autoprefixer";
import { ArrowForwardSharp } from "@mui/icons-material";

const ReturnBookingFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const base_url = `${CONFIG.BASE_URL}`;
  const [savedPassengers, setSavedPassengers] = useState([]);
  const formRefs = useRef([]);
  const stored = sessionStorage.getItem("returnPriceResponse");
  const responseData = JSON.parse(stored);
  // console.log(responseData);
  const timeoutRef = useRef(null);
  const hasFetchedRef = useRef(false);
  const OnwardFare = responseData?.onward?.fare;
  const ReturnFare = responseData?.return?.fare;
  // console.log("return flight fare", ReturnFare);
  const OnwardSegments = responseData?.onward?.flight?.segments;
  console.log("onward segments", OnwardSegments);
  const ReturnSegments = responseData?.return?.flight?.segments;
  const OnwardFlight = responseData?.onward?.flight;
  const ReturnFlight = responseData?.return?.flight;
  // console.log("return flight", ReturnFlight);
  const TaxivaxiFlightDetails = responseData?.FlightDetails;
  const TaxivaxiPassengeDetails = responseData?.FlightDetails?.Passengerdetails;
  // console.log("Taxivaxi Passenger Details", TaxivaxiPassengeDetails);
  const bookingid = responseData?.FlightDetails?.bookingid;
  const FlightType = responseData?.FlightType;
  const is_gst_benefit = responseData?.FlightDetails?.is_gst_benefit;
  const clientid = responseData?.FlightDetails?.clientid;
  const fare_type = responseData?.faretype;
  const passengerKeyCode = responseData?.passengerDetails;
  // //console.log(passengerKeyCode);
  const [accordion1Expanded, setAccordion1Expanded] = useState(true);
  const [accordion2Expanded, setAccordion2Expanded] = useState(false);
  const [accordion3Expanded, setAccordion3Expanded] = useState(false);
  const [accordion4Expanded, setAccordion4Expanded] = useState(false);
  const [accordion5Expanded, setAccordion5Expanded] = useState(false);
  const [accordion6Expanded, setAccordion6Expanded] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [Segments, SetSegment] = useState([]);
  const [MealData, setMealData] = useState([]);
  const [FareData, setFareData] = useState([]);
  const [ReturnFareData, setReturnFareData] = useState([]);
  const [OnwardSourceType, setOnwardSourceType] = useState([]);
  const [ReturnSourceType, setReturnSourceType] = useState([]);
  const [FlightData, setFlightData] = useState([]);
  const [ReturnFlightData, setReturnFlightData] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTooltip2, setShowTooltip2] = useState(false);
  const [showTooltip3, setShowTooltip3] = useState(false);
  const [showTooltip4, setShowTooltip4] = useState(false);
  const [showTooltip5, setShowTooltip5] = useState(false);
  const [showTooltip6, setShowTooltip6] = useState(false);
  const [showTooltip7, setShowTooltip7] = useState(false);
  const [showTooltip8, setShowTooltip8] = useState(false);
  const [showTooltip9, setShowTooltip9] = useState(false);
  const [IsOnwardMealFree, setisOnwardmealfree] = useState([]);
  const [IsReturnMealFree, setisReturnmealfree] = useState([]);
  const [CancellationData, setcancellationData] = useState([]);
  const [Policy, setpolicy] = useState([]);
  const [Locatorcode, setLocatorcode] = useState("");
  const [PassengerData, setPassengerData] = useState([]);
  const [gstForm, setGstForm] = useState({
    gstin: "",
    company_name: "",
    company_address: "",
    company_contact: "",
  });
  const [GstEntries, setGstEntries] = useState([]);
  const [loadingg, setLoadingg] = useState(false);
  const [Finalloading, setfinalloading] = useState(false);
  const [maxDate, setMaxDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState({
    onward: [],
    return: [],
  });
  const [selectedBaggage, setSelectedBaggage] = useState({
    onward: [],
    return: [],
  });
  const [selectedPassengerIndex, setSelectedPassengerIndex] = useState(0);
  const [selectedSegmentKey, setSelectedSegmentKey] = useState(0);
  const [selectedMeals, setSelectedMeals] = useState({
    onward: [],
    return: [],
  });
  const [PassengerDetails, setPassengerDetails] = useState([]);
  const [TboPassengerDetails, setTboPassengerDetails] = useState([]);
  const [Countrydata, setCountrydata] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [UapiOnwardOptionalservice, setUapiOnwardOptionalservice] = useState(
    []
  );
  const [UapiReturnOptionalservice, setUapiReturnOptionalservice] = useState(
    []
  );
  const [TboOnwardBaggageservice, setTboOnwardBaggageservice] = useState([]);
  const [TboReturnBaggageservice, setTboReturnBaggageservice] = useState([]);
  const [TboOnwardMealservice, setTboOnwardMealservice] = useState([]);
  const [TboReturnMealservice, setTboReturnMealservice] = useState([]);
  const [TboOnwardSeatservice, setTboOnwardSeatService] = useState([]);
  const [TboReturnSeatservice, setTboReturnSeatservice] = useState([]);
  const [OnwardSeatData, setOnwardSeatdata] = useState([]);
  const [ReturnSeatData, setReturnSeatdata] = useState([]);
  const [selectedPassengerKey, setSelectedPassengerKey] = useState(null);
  const [selectedSegmentType, setSelectedSegmentType] = useState("onward");
  const [PassengerInfo, setPassengerInfo] = useState([]);
  const [Seatloading, setSeatloading] = useState(false);
  const [OnwardTraceId, setOnwardTraceId] = useState("");
  const [ReturnTraceId, setReturnTraceId] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [showError, setShowError] = useState(false);
  const [IsOnwardLCC, setIsOnwardLCC] = useState("");
  const [IsReturnLCC, setIsReturnLCC] = useState("");
  const [OnwardPricekey, setOnwardPriceKey] = useState("");
  const [ReturnPricekey, setReturnPriceKey] = useState("");
  const [OnwaredTboFare, setOnwaredTboFare] = useState("");
  const [ReturnTboFare, setReturnTboFare] = useState("");
  const [CancellationData1G, setcancellationData1G] = useState([]);
  const [TboOnwardTraceId, setTboOnwardTraceId] = useState("");
  const [TboReturnTraceId, setTboReturnTraceId] = useState("");
  const [TbonwardResultIndex, setTboOnwardResultIndex] = useState("");
  const [TboreturnResultIndex, setTboReturnResultIndex] = useState("");
  const [IsTboOnwardLCC, setIsTboOnwardLCC] = useState("");
  const [IsTboReturnLCC, setIsTboReturnLCC] = useState("");
  const [PerPassOnwardTboFareData, setPerPassOnwardTboFareData] = useState([]);
  const [PerPassReturnTboFareData, setPerPassReturnTboFareData] = useState([]);
  const [errors, setErrors] = useState({
    gstin: "",
    company_name: "",
    company_address: "",
    company_contact: "",
  });

  // setPassengerDetails(responseData.passengerDetails)
  useEffect(() => {
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    setMaxDate(formattedToday);
  }, []);

  useEffect(() => {
    setLoadingg(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      const FetchOptions = async () => {
        const requestData = {
          onwardKeys: {
            key: OnwardFare.Resultindex || OnwardFare.ResultIndex,
            traceId: OnwardFare.TraceId,
            source_type: OnwardFare.from,
            isLCC: OnwardFare.isLCC,
          },
          returnKeys: {
            key: ReturnFare.Resultindex || ReturnFare.ResultIndex,
            traceId: ReturnFare.TraceId,
            source_type: ReturnFare.from,
            isLCC: ReturnFare.isLCC,
          },
          passengerDetails: responseData.passengerDetails,
        };

        try {
          const response = await fetch(`${base_url}makePriceRequest`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });

          const Data = await response.json();
          if (Data.status) {
            if (Data.data.onward) {
              const token = Data.data.onward.traceId;
              setOnwardTraceId(token);
              const Key = Data.data.onward.key;
              setOnwardPriceKey(Key);
              const LCC = Data.data.onward.isLCC;
              setIsOnwardLCC(LCC);
              if (Data.data.onward.source == "Uapi") {
                const source_type = Data.data.onward.source;
                setOnwardSourceType(source_type);
                const responseData = Data.data.onward.priceRequestResponse;
                // //console.log(responseData)
                if (Data.data.onward.cancellation) {
                  const cancellation = Data.data.onward.cancellation;
                  setcancellationData1G(cancellation);
                }
                if (responseData?.FlightDetails) {
                  const flightdetails = responseData?.FlightDetails;
                  setFlightData(flightdetails);
                }
                if (responseData?.AirPriceResult?.OptionalServices) {
                  const Optionalservice =
                    responseData?.AirPriceResult?.OptionalServices;
                  setUapiOnwardOptionalservice(Optionalservice);
                }
                if (responseData?.AirPriceResult) {
                  const fare = responseData?.AirPriceResult;
                  // //console.log(fare)
                  setFareData(fare);
                }
              }
              if (Data.data.onward.source == "Tbo") {
                const source_type = Data.data.onward.source;
                setOnwardSourceType(source_type);

                const responseData = Data.data.onward;
                if (responseData.FareQuote_Response) {
                  const trace_id = responseData.FareQuote_Response.TraceId;
                  const resultindex =
                    responseData.FareQuote_Response.Results.ResultIndex;
                  const LCC = responseData.FareQuote_Response.Results.IsLCC;
                  setIsTboOnwardLCC(LCC);
                  setTboOnwardTraceId(trace_id);
                  setTboOnwardResultIndex(resultindex);
                }
                if (responseData.FareQuote_Response.FlightDetails) {
                  const flight = responseData.FareQuote_Response.FlightDetails;
                  setFlightData(flight);
                }
                if (responseData.FareQuote_Response?.Results.Fare) {
                  const Fare = responseData.FareQuote_Response?.Results.Fare;
                  // //console.log(Fare)
                  setOnwaredTboFare(Fare);
                  // (Fare);
                }
                if (responseData.FareQuote_Response?.Results.FareBreakdown) {
                  const PerFare =
                    responseData.FareQuote_Response?.Results.FareBreakdown;
                  setPerPassOnwardTboFareData(PerFare);
                }
                if (responseData.FlightSSR_Response?.Baggage) {
                  const baggagedata =
                    responseData.FlightSSR_Response?.Baggage[0];
                  // //console.log("onward", baggagedata)
                  setTboOnwardBaggageservice(baggagedata);
                }
                if (
                  responseData.FareQuote_Response?.Results?.IsFreeMealAvailable
                ) {
                  const meal =
                    responseData?.FareQuote_Response?.Results
                      ?.IsFreeMealAvailable;
                  if (meal === true) {
                    setisOnwardmealfree(true);
                  }
                }
                if (responseData.FlightSSR_Response?.MealDynamic) {
                  const mealdata =
                    responseData.FlightSSR_Response?.MealDynamic[0];
                  // //console.log(mealdata)
                  setTboOnwardMealservice(mealdata);
                }
                if (responseData.FlightSSR_Response?.Meal) {
                  const mealdata = responseData.FlightSSR_Response?.Meal;
                  // //console.log(mealdata)
                  setTboOnwardMealservice(mealdata);
                }
                if (responseData?.FlightSSR_Response?.SeatDynamic) {
                  const seatdata =
                    responseData.FlightSSR_Response?.SeatDynamic?.[0]
                      ?.SegmentSeat;
                  // //console.log(seatdata)
                  setTboOnwardSeatService(seatdata);
                }
              }
            }
            if (Data.data.return) {
              const token = Data.data.return.traceId;
              setReturnTraceId(token);
              const Key = Data.data.return.key;
              setReturnPriceKey(Key);
              const LCC = Data.data.return.isLCC;
              setIsReturnLCC(LCC);
              if (Data.data.return.source == "Uapi") {
                const source_type = Data.data.return.source;
                setReturnSourceType(source_type);
                const responseData = Data.data.return.priceRequestResponse;

                if (responseData?.FlightDetails) {
                  const flightdetails = responseData?.FlightDetails;
                  setReturnFlightData(flightdetails);
                }
                if (responseData?.AirPriceResult?.OptionalServices) {
                  const Optionalservice =
                    responseData?.AirPriceResult?.OptionalServices;
                  setUapiReturnOptionalservice(Optionalservice);
                }
                if (responseData?.AirPriceResult) {
                  const fare = responseData?.AirPriceResult;
                  // //console.log(fare)
                  setReturnFareData(fare);
                }
              }
              if (Data.data.return.source == "Tbo") {
                const source_type = Data.data.return.source;
                setReturnSourceType(source_type);
                const responseData = Data.data.return;
                if (responseData.FareQuote_Response) {
                  const trace_id = responseData.FareQuote_Response.TraceId;
                  const resultindex =
                    responseData.FareQuote_Response.Results.ResultIndex;
                  const LCC = responseData.FareQuote_Response.Results.IsLCC;
                  setIsTboReturnLCC(LCC);
                  setTboReturnTraceId(trace_id);
                  setTboReturnResultIndex(resultindex);
                }
                if (responseData.FareQuote_Response.FlightDetails) {
                  const flight = responseData.FareQuote_Response.FlightDetails;
                  setReturnFlightData(flight);
                }
                if (responseData.FareQuote_Response?.Results.Fare) {
                  const Fare = responseData.FareQuote_Response?.Results.Fare;
                  // //console.log(Fare)
                  setReturnTboFare(Fare);
                  // (Fare);
                }
                if (responseData.FareQuote_Response?.Results.FareBreakdown) {
                  const PerFare =
                    responseData.FareQuote_Response?.Results.FareBreakdown;
                  setPerPassReturnTboFareData(PerFare);
                }
                if (responseData.FlightSSR_Response?.Baggage) {
                  const baggagedata =
                    responseData.FlightSSR_Response?.Baggage[0];
                  // //console.log("return", baggagedata)
                  setTboReturnBaggageservice(baggagedata);
                }
                if (
                  responseData.FareQuote_Response?.Results?.IsFreeMealAvailable
                ) {
                  const meal =
                    responseData?.FareQuote_Response?.Results
                      ?.IsFreeMealAvailable;
                  if (meal === true) {
                    setisReturnmealfree(true);
                  }
                }
                if (responseData.FlightSSR_Response?.MealDynamic) {
                  const mealdata =
                    responseData.FlightSSR_Response?.MealDynamic[0];
                  // //console.log(mealdata)
                  setTboReturnMealservice(mealdata);
                }
                if (responseData.FlightSSR_Response?.Meal) {
                  const mealdata = responseData.FlightSSR_Response?.Meal;
                  // //console.log(mealdata)
                  setTboReturnMealservice(mealdata);
                }
                if (responseData?.FlightSSR_Response?.SeatDynamic) {
                  const seatdata =
                    responseData.FlightSSR_Response?.SeatDynamic?.[0]
                      ?.SegmentSeat;
                  // //console.log(seatdata)
                  setTboReturnSeatservice(seatdata);
                }
              }
            }
          }
          if (
            Array.isArray(Data?.data?.onward) ||
            Array.isArray(Data?.data?.return)
          ) {
            Swal.fire({
              title: "Error",
              text: Data.data.onward[0],
              iconHtml: '<i class="fa fa-exclamation" aria-hidden="true"></i>',
              confirmButtonText: "Try Again",
            }).then((result) => {
              if (result.isConfirmed) {
                if (bookingid) {
                  const responseData = TaxivaxiFlightDetails;
                  // Navigate to search page if bookingid is present
                  navigate("/SearchFlight", { state: { responseData } });
                } else {
                  // Otherwise, go to home page
                  window.location.href = "/";
                }
              }
            });
          }
          if (Data.status == false) {
            Swal.fire({
              title: "Error",
              text: Data.message,
              iconHtml: '<i class="fa fa-exclamation" aria-hidden="true"></i>',
              confirmButtonText: "Try Again",
            }).then((result) => {
              if (result.isConfirmed) {
                if (bookingid) {
                  const responseData = TaxivaxiFlightDetails;
                  // Navigate to search page if bookingid is present
                  navigate("/SearchFlight", { state: { responseData } });
                } else {
                  // Otherwise, go to home page
                  window.location.href = "/";
                }
              }
            });
          }

          setLoadingg(false);
        } catch (error) {
          setLoadingg(false);

          Swal.fire({
            title: "Error",
            text: error.message,
            iconHtml: '<i class="fa fa-exclamation" aria-hidden="true"></i>',
            confirmButtonText: "Try Again",
          }).then((result) => {
            if (result.isConfirmed) {
              if (bookingid) {
                const responseData = TaxivaxiFlightDetails;
                // Navigate to search page if bookingid is present
                navigate("/SearchFlight", { state: { responseData } });
              } else {
                // Otherwise, go to home page
                window.location.href = "/";
              }
            }
          });
        }
      };

      FetchOptions();
    }, 1000); // Delay API call by 1 second

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [PassengerDetails]);
  //console.log("Uapi Flight", ReturnFareData);
  //console.log("OwnwardFlight", OnwaredTboFare);
  //Cancellation

  const fetchCancellationPolicy = async () => {
    try {
      const response = await fetch(
        `${CONFIG.MAIN_API}/api/flights/getCancellationDateChangePolicy`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const Data = await response.json();
      // //console.log(Data)
      setcancellationData(Data.data);
    } catch (error) {
      console.error("Error fetching cancellation policy:", error);
    }
  };

  useEffect(() => {
    if (!hasFetchedRef.current) {
      fetchCancellationPolicy();
      hasFetchedRef.current = true;
    }
  }, []);
  //Passenger count
  const passengerList = [];

  Object.entries(responseData.Passenger_info).forEach(([type, count]) => {
    for (let i = 1; i <= count; i++) {
      passengerList.push({ type, index: i });
    }
  });

  //Save passenger data
  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const response = await fetch(
          "https://corporate.taxivaxi.com/api/getAllCountries"
        );
        const result = await response.json();

        if (
          result.success === "1" &&
          Array.isArray(result.response.Countries)
        ) {
          const formattedOptions = result.response.Countries.map((country) => ({
            value: country.country_name,
            label: country.country_name,
          }));

          setCountrydata(formattedOptions);
        } else {
          console.error("Error in response:", result.error || result.msg);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchCountryData();
  }, []);

  const calculateAge = (dobString) => {
    const dob = new Date(dobString);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  };
  const attachLiveErrorHandlers = (form) => {
    if (!form) return;

    // First Name
    const firstNameInput = form.querySelector(
      'input[name="adult_first_name[]"]'
    );
    const firstNameError = form.querySelector(".adult_first_name-message");
    firstNameInput?.addEventListener("input", () => {
      if (firstNameInput.value.trim()) firstNameError.style.display = "none";
    });

    // Last Name
    const lastNameInput = form.querySelector('input[name="adult_last_name[]"]');
    const lastNameError = form.querySelector(".adult_last_name-message");
    lastNameInput?.addEventListener("input", () => {
      if (lastNameInput.value.trim()) lastNameError.style.display = "none";
    });

    // Email
    const emailInput = form.querySelector('input[name="email1"]');
    const emailError = emailInput?.nextElementSibling;
    emailInput?.addEventListener("input", () => {
      if (emailInput.value.trim()) emailError.style.display = "none";
    });

    // Mobile
    const phoneInput = form.querySelector(".phone-input input");
    const phoneError = form.querySelector(".booking-mobile .error-message");
    phoneInput?.addEventListener("input", () => {
      const val = phoneInput.value.trim();
      if (val && val !== "+91" && !/^\+91\s*$/.test(val)) {
        phoneError.style.display = "none";
      }
    });

    // Gender

    const genderSelects = form.querySelectorAll(
      'select[name="adult_gender[]"]'
    );
    genderSelects.forEach((select) => {
      const wrapper = select.closest(".booking-gender"); // go up to the container
      const genderError = wrapper?.querySelector(".error-message");

      select.addEventListener("change", () => {
        if (select.value && genderError) {
          genderError.style.display = "none";
        }
      });
    });

    // DOB
    const dobInput = form.querySelector('input[name="adult_age[]"]');
    dobInput?.addEventListener("input", () => {
      if (dobInput.value) dobInput.style.border = "";
    });
    // Passport No
    const passportInput = form.querySelector(
      'input[name="adult_passportNo[]"]'
    );
    const passportError = form.querySelector(".adult_passportNo-message");
    passportInput?.addEventListener("input", () => {
      if (passportInput.value.trim()) passportError.style.display = "none";
    });

    // Issued Country (React Select input)
    const issuedCountryInput = form.querySelector(
      'input[name="adult_issuedcountry[]"]'
    );
    const issuedCountryError = form.querySelector(
      ".adult_issuedcountry-message"
    );
    issuedCountryInput?.addEventListener("input", () => {
      if (issuedCountryInput.value.trim())
        issuedCountryError.style.display = "none";
    });

    // Passport Expiry Date
    const passportExpiryInput = form.querySelector(
      'input[name="adult_passportexpiry[]"]'
    );
    const passportExpiryError = form.querySelector(
      ".adult_passportexpiry-message"
    );
    passportExpiryInput?.addEventListener("input", () => {
      if (passportExpiryInput.value.trim())
        passportExpiryError.style.display = "none";
    });
  };

  useEffect(() => {
    formRefs.current.forEach((form) => {
      attachLiveErrorHandlers(form);
    });
  }, [passengerList.length]);
  const handleSavePassenger = () => {
    const allPassengers = []; // Common Passenger raw data
    const uapiPassengerInfo = []; // For UAPI
    const tboPassengerDetails = []; // For TBO

    const remainingPassengerDetails = [
      ...(responseData?.passengerDetails || []),
    ];

    const keyIndexMap = { ADT: 0, CNN: 0, INF: 0 };
    let isValid = true;

    let leadEmail = "";
    let leadContact = "";
    let leadAddress1 = "";
    let leadAddress2 = "";
    let leadCity = "";

    passengerList.forEach((passenger, index) => {
      const form = formRefs.current[index];
      attachLiveErrorHandlers(form);
      if (!form) return;

      // ---------- GET FORM FIELDS ----------
      const firstNameInput = form.querySelector(
        'input[name="adult_first_name[]"]'
      );
      const lastNameInput = form.querySelector(
        'input[name="adult_last_name[]"]'
      );
      const emailInput = form.querySelector('input[name="email1"]');
      const phoneInput =
        phoneNumbers ||
        `+91${TaxivaxiPassengeDetails?.[0]?.employee_contact}` ||
        "";
      const genderSelect = form.querySelector('select[name="adult_gender[]"]');
      const dobInput = form.querySelector('input[name="adult_age[]"]');
      const passportInput = form.querySelector(
        'input[name="adult_passportNo[]"]'
      );
      const issuedCountryInput = form.querySelector(
        'input[name="adult_issuedcountry[]"]'
      );
      const passportExpiryInput = form.querySelector(
        'input[name="adult_passportexpiry[]"]'
      );
      const address1Input = form.querySelector(
        'input[name="adult_address_line_1[]"]'
      );
      const address2Input = form.querySelector(
        'input[name="adult_address_line_2[]"]'
      );
      const cityInput = form.querySelector('input[name="adult_city[]"]');

      // -------------------- VALIDATION ---------------------

      // Name validation
      if (firstNameInput && !firstNameInput.value.trim()) {
        form.querySelector(".adult_first_name-message").style.display = "block";
        isValid = false;
      }
      if (lastNameInput && !lastNameInput.value.trim()) {
        form.querySelector(".adult_last_name-message").style.display = "block";
        isValid = false;
      }

      // Email required for adults only
      if (
        passenger.type === "Adult" &&
        emailInput &&
        !emailInput.value.trim()
      ) {
        emailInput.nextElementSibling.style.display = "block";
        isValid = false;
      }

      // ---------- International Validations ----------
      if (FlightType === "International") {
        if (!dobInput?.value) {
          form
            .querySelector(".adult_age-message")
            ?.style?.setProperty("display", "block");
          isValid = false;
        }

        if (!address1Input?.value) isValid = false;
        if (!cityInput?.value) isValid = false;

        if (!passportInput?.value) isValid = false;
        if (!issuedCountryInput?.value) isValid = false;
        if (!passportExpiryInput?.value) isValid = false;
      }

      // ---------- Domestic Auto-Fill (NO validation) ----------
      let finalDob = dobInput?.value;
      let finalAddress1 = address1Input?.value;
      let finalCity = cityInput?.value;

      if (FlightType === "Domestic") {
        // Auto-fill DOB (25 years old)
        if (!finalDob) {
          const today = new Date();
          const defaultYear = today.getFullYear() - 25;
          finalDob = `${defaultYear}-01-01`;
        }

        // Auto-fill address defaults
        if (!finalAddress1) finalAddress1 = "Pune";
        if (!finalCity) finalCity = "Pune";
      }

      if (!isValid) return;

      // ---------- Common Passenger Data ----------
      const prefix =
        form.querySelector('select[name="adult_prefix[]"]')?.value || "";
      const firstName = firstNameInput?.value || "";
      const lastName = lastNameInput?.value || "";
      const dob = finalDob;
      const genderVal = genderSelect?.value || "";
      const email = emailInput?.value || "";
      const contact =
        phoneNumbers ||
        `+91${TaxivaxiPassengeDetails?.[0]?.employee_contact}` ||
        "";
      const address1 = finalAddress1;
      const address2 = address2Input?.value || "";
      const city = finalCity;
      const flyerName =
        form.querySelector('input[name="flyername"]')?.value || "";
      const flyerNumber =
        form.querySelector('input[name="flyernumber"]')?.value || "";

      const isLeadPax = index === 0;
      if (isLeadPax) {
        leadEmail = email;
        leadContact = contact;
        leadAddress1 = address1;
        leadAddress2 = address2;
        leadCity = city;
      }

      const passengerData = {
        type: passenger.type,
        passengerIndex: index,
        prefix,
        firstName,
        lastName,
        dob,
        email: ["Child", "Infant"].includes(passenger.type) ? leadEmail : email,
        contact: ["Child", "Infant"].includes(passenger.type)
          ? leadContact
          : contact,
        gender: genderVal,
        Address1: ["Child", "Infant"].includes(passenger.type)
          ? leadAddress1
          : address1,
        Address2: ["Child", "Infant"].includes(passenger.type)
          ? leadAddress2
          : address2,
        city: ["Child", "Infant"].includes(passenger.type) ? leadCity : city,
        flyerName,
        flyerNumber,
        passportno: passportInput?.value || "",
        passportexpiry: passportExpiryInput?.value || "",
        issuedcountry: issuedCountryInput?.value || "",
      };

      allPassengers.push(passengerData);

      // ---------- UAPI Format ----------
      const codeMapUapi = { Adult: "ADT", Child: "CNN", Infant: "INF" };
      const matchCode = codeMapUapi[passenger.type];

      const keysWithSameCode = remainingPassengerDetails.filter(
        (d) => d.Code === matchCode
      );

      const passengerKey = keysWithSameCode[keyIndexMap[matchCode]]?.Key || "";

      keyIndexMap[matchCode] += 1;

      const Info = {
        Code: matchCode,
        Key: passengerKey,
        Prefix: prefix,
        First: firstName,
        Last: lastName,
        DateOfBirth: dob + "T00:00:00",
        ContactNo: passengerData.contact,
        Email: "flight@cotrav.co",
        PassportExpiry: passengerData.passportexpiry,
        PassportNo: passengerData.passportno,
      };

      uapiPassengerInfo.push(Info);

      // ---------- TBO Format ----------
      const codeMapTbo = { Adult: 1, Child: 2, Infant: 3 };
      const genderMap = { M: 1, F: 2 };

      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      const details = {
        passengerIndex: index,
        Title: prefix,
        FirstName: firstName,
        LastName: lastName,
        PaxType: codeMapTbo[passenger.type],
        Gender: genderMap[genderVal],
        DateOfBirth: dob + "T00:00:00" || "2001-01-01T00:00:00",
        ContactNo: passengerData.contact,
        Age: age,
        Email: "flight@cotrav.co",
        AddressLine1: passengerData.Address1 || "baner",
        AddressLine2: passengerData.Address2 || "pune",
        IsLeadPax: isLeadPax,
        City: passengerData.city || "pune",
        PassportExpiry: passengerData.passportexpiry,
        PassportNo: passengerData.passportno,
      };

      tboPassengerDetails.push(details);
    });

    console.log("tbopassengers", tboPassengerDetails);

    if (!isValid) {
      document
        .querySelector('.error-message[style*="block"]')
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setPassengerInfo(uapiPassengerInfo);
    setPassengerData(allPassengers);
    setTboPassengerDetails(tboPassengerDetails);

    setAccordion5Expanded(true);
    setAccordion1Expanded(false);
  };

  //   const handleSavePassenger = () => {
  //     const allPassengers = []; // Common Passenger raw data
  //     const uapiPassengerInfo = []; // For UAPI
  //     const tboPassengerDetails = []; // For TBO

  //     const remainingPassengerDetails = [
  //       ...(responseData?.passengerDetails || []),
  //     ];
  //     // console.log("remainingPassengerDetails", remainingPassengerDetails)
  //     const keyIndexMap = { ADT: 0, CNN: 0, INF: 0 };
  //     let isValid = true;

  //     let leadEmail = "";
  //     let leadContact = "";
  //     let leadAddress1 = "";
  //     let leadAddress2 = "";
  //     let leadCity = "";

  //     passengerList.forEach((passenger, index) => {
  //       const form = formRefs.current[index];
  //       attachLiveErrorHandlers(form);
  //       if (!form) return;

  //       // ---------- VALIDATION ----------
  //       const firstNameInput = form.querySelector(
  //         'input[name="adult_first_name[]"]'
  //       );
  //       const lastNameInput = form.querySelector(
  //         'input[name="adult_last_name[]"]'
  //       );
  //       const emailInput = form.querySelector('input[name="email1"]');
  //       const phoneInput =
  //         phoneNumbers ||
  //         `+91${TaxivaxiPassengeDetails?.[0]?.employee_contact}` ||
  //         "";
  //       const genderSelect = form.querySelector('select[name="adult_gender[]"]');
  //       const dobInput = form.querySelector('input[name="adult_age[]"]');
  //       const passportInput = form.querySelector(
  //         'input[name="adult_passportNo[]"]'
  //       );
  //       const issuedCountryInput = form.querySelector(
  //         'input[name="adult_issuedcountry[]"]'
  //       );
  //       const passportExpiryInput = form.querySelector(
  //         'input[name="adult_passportexpiry[]"]'
  //       );
  //       const address1Input = form.querySelector(
  //         'input[name="adult_address_line_1[]"]'
  //       );
  //       const address2Input = form.querySelector(
  //         'input[name="adult_address_line_2[]"]'
  //       );
  //       const cityInput = form.querySelector('input[name="adult_city[]"]');

  //       // Basic name/email/phone validations (reuse your existing ones)...
  //       if (firstNameInput && !firstNameInput.value.trim()) {
  //         form.querySelector(".adult_first_name-message").style.display = "block";
  //         isValid = false;
  //       }
  //       if (lastNameInput && !lastNameInput.value.trim()) {
  //         form.querySelector(".adult_last_name-message").style.display = "block";
  //         isValid = false;
  //       }
  //       if (
  //         passenger.type === "Adult" &&
  //         emailInput &&
  //         !emailInput.value.trim()
  //       ) {
  //         emailInput.nextElementSibling.style.display = "block";
  //         isValid = false;
  //       }
  //       if (passenger.type === "Adult" && phoneInput) {
  //         const phoneValue = phoneNumbers?.replace(/\D/g, "") || "";
  //         // if (phoneValue.length !== 10) {
  //         //     setPhoneError("Please enter a valid Mobile Number.");
  //         //     isValid = false;
  //         // } else {
  //         //     setPhoneError(""); // clear error
  //         // }
  //       }
  //       if (!dobInput?.value) {
  //         form
  //           .querySelector(".adult_age-message")
  //           ?.style?.setProperty("display", "block");
  //         isValid = false;
  //       }

  //       if (FlightType === "International") {
  //         if (!passportInput?.value) isValid = false;
  //         if (!issuedCountryInput?.value) isValid = false;
  //         if (!passportExpiryInput?.value) isValid = false;
  //       }

  //       if (!isValid) return;

  //       // ---------- Common Passenger Data ----------
  //       const prefix =
  //         form.querySelector('select[name="adult_prefix[]"]')?.value || "";
  //       const firstName = firstNameInput?.value || "";
  //       const lastName = lastNameInput?.value || "";
  //       const dob = dobInput?.value || "";
  //       const genderVal = genderSelect?.value || "";
  //       const email = emailInput?.value || "";
  //       const contact =
  //         phoneNumbers ||
  //         `+91${TaxivaxiPassengeDetails?.[0]?.employee_contact}` ||
  //         "";
  //       const address1 = address1Input?.value || "";
  //       const address2 = address2Input?.value || "";
  //       const city = cityInput?.value || "";
  //       const flyerName =
  //         form.querySelector('input[name="flyername"]')?.value || "";
  //       const flyerNumber =
  //         form.querySelector('input[name="flyernumber"]')?.value || "";

  //       const isLeadPax = index === 0;
  //       if (isLeadPax) {
  //         leadEmail = email;
  //         leadContact = contact;
  //         leadAddress1 = address1;
  //         leadAddress2 = address2;
  //         leadCity = city;
  //       }

  //       const passengerData = {
  //         type: passenger.type,
  //         passengerIndex: index,
  //         prefix,
  //         firstName,
  //         lastName,
  //         dob,
  //         email: ["Child", "Infant"].includes(passenger.type) ? leadEmail : email,
  //         contact: ["Child", "Infant"].includes(passenger.type)
  //           ? leadContact
  //           : contact,
  //         gender: genderVal,
  //         Address1: ["Child", "Infant"].includes(passenger.type)
  //           ? leadAddress1
  //           : address1,
  //         Address2: ["Child", "Infant"].includes(passenger.type)
  //           ? leadAddress2
  //           : address2,
  //         city: ["Child", "Infant"].includes(passenger.type) ? leadCity : city,
  //         flyerName,
  //         flyerNumber,
  //         passportno: passportInput?.value || "",
  //         passportexpiry: passportExpiryInput?.value || "",
  //         issuedcountry: issuedCountryInput?.value || "",
  //       };

  //       allPassengers.push(passengerData);

  //       // ---------- UAPI Format ----------
  //    const codeMapUapi = { Adult: "ADT", Child: "CNN", Infant: "INF" };
  //     const matchCode = codeMapUapi[passenger.type];

  //     const keysWithSameCode = remainingPassengerDetails.filter(
  //       (d) => d.Code === matchCode
  //     );

  //     const passengerKey =
  //       keysWithSameCode[keyIndexMap[matchCode]]?.Key || "";

  //     // increment for next passenger of the same type
  //     keyIndexMap[matchCode] += 1;

  //     const Info = {
  //       Code: matchCode,
  //       Key: passengerKey,
  //       Prefix: prefix,
  //       First: firstName,
  //       Last: lastName,
  //       DateOfBirth: dob + "T00:00:00",
  //       ContactNo: passengerData.contact,
  //       Email: "flight@cotrav.co",
  //       PassportExpiry: passengerData.passportexpiry,
  //       PassportNo: passengerData.passportno,
  //     };

  //     uapiPassengerInfo.push(Info);
  // // console.log("uapiPassengerInfo", uapiPassengerInfo)

  //       // ---------- TBO Format ----------

  //       const codeMapTbo = { Adult: 1, Child: 2, Infant: 3 };
  //       const genderMap = { M: 1, F: 2 };
  //       const dobs = dob; // e.g. "2003-06-18"
  //       const birthDate = new Date(dobs);
  //       const today = new Date();

  //       let age = today.getFullYear() - birthDate.getFullYear();
  //       const monthDiff = today.getMonth() - birthDate.getMonth();

  //       if (
  //         monthDiff < 0 ||
  //         (monthDiff === 0 && today.getDate() < birthDate.getDate())
  //       ) {
  //         age--;
  //       }

  //       const details = {
  //         passengerIndex: index,
  //         Title: prefix,
  //         FirstName: firstName,
  //         LastName: lastName,
  //         PaxType: codeMapTbo[passenger.type],
  //         Gender: genderMap[genderVal],
  //         DateOfBirth: dob + "T00:00:00",
  //         // ContactNo: "+".concat(passengerData.contact),
  //         ContactNo: passengerData.contact,
  //         Age: age,

  //         Email: "flight@cotrav.co", // Override if needed
  //         AddressLine1: passengerData.Address1,
  //         AddressLine2: passengerData.Address2,
  //         IsLeadPax: isLeadPax,
  //         City: passengerData.city,
  //         PassportExpiry: passengerData.passportexpiry,
  //         PassportNo: passengerData.passportno,
  //       };

  //       tboPassengerDetails.push(details);
  //     });

  //     console.log("tbopassengers", tboPassengerDetails);

  //     if (!isValid) {
  //       document
  //         .querySelector('.error-message[style*="block"]')
  //         ?.scrollIntoView({ behavior: "smooth", block: "center" });
  //       return;
  //     }
  //     // //console.log(allPassengers);
  //     setPassengerInfo(uapiPassengerInfo);
  //     setPassengerData(allPassengers);
  //     setTboPassengerDetails(tboPassengerDetails);

  //     setAccordion5Expanded(true);
  //     setAccordion1Expanded(false);
  //   };

  useEffect(() => {
    if (PassengerData && PassengerData.length > 0) {
      setSelectedPassengerIndex(0);
      setSelectedPassengerKey(PassengerData[0].Key);
    }
  }, [PassengerData]);

  const handleTabChange = (event, newValue) => {
    setSelectedSegmentKey(newValue);
  };
  useEffect(() => {
    if (Array.isArray(MealData) && MealData.length > 0 && MealData[0]?.Meal) {
      const firstKey = `${MealData[0].Meal.Origin}-${MealData[0].Meal.Destination}`;
      setSelectedSegmentKey(firstKey);
    }
  }, [MealData]);

  //Baggage
  const handleAddBaggage = (
    Idx,
    Data,
    segmentType,
    passengerKey = selectedPassengerKey,
    source_type
  ) => {
    if (source_type === "Uapi") {
      if (!passengerKey) return;

      setSelectedBaggage((prev) => {
        const list = prev[segmentType] || [];

        const filtered = list.filter(
          (b) =>
            !(
              b.passengerKey === passengerKey &&
              b.segmentKey === selectedSegmentKey &&
              b.segmentType === segmentType
            )
        );

        const newItem = {
          passengerKey,
          segmentKey: selectedSegmentKey,
          segmentType,
          baggageIndex: Idx,
          baggage: Data,
          quantity: 1,
          source_type,
        };

        return { ...prev, [segmentType]: [...filtered, newItem] };
      });
    } else {
      const baggageIndex = Idx;
      const baggageItem = Data;
      setSelectedBaggage((prev) => {
        const list = prev[segmentType] || [];

        const filtered = list.filter(
          (item) =>
            !(
              item.passengerIndex === selectedPassengerIndex &&
              item.segmentKey === selectedSegmentKey
            )
        );

        const newItem = {
          passengerIndex: selectedPassengerIndex,
          segmentKey: selectedSegmentKey,
          segmentType,
          baggageIndex,
          baggage: baggageItem,
          quantity: 1,
          source_type,
        };

        return { ...prev, [segmentType]: [...filtered, newItem] };
      });
    }
  };

  //  Remove baggage

  const handleRemoveBaggage = (
    baggageIndex,
    segmentType,
    passengerKey = selectedPassengerKey,
    source_type
  ) => {
    if (source_type === "Uapi") {
      if (!passengerKey) return;

      setSelectedBaggage((prev) => {
        const list = prev[segmentType] || [];

        const filtered = list.filter(
          (b) =>
            !(
              b.passengerKey === passengerKey &&
              b.segmentKey === selectedSegmentKey &&
              b.segmentType === segmentType &&
              b.baggageIndex === baggageIndex
            )
        );

        return { ...prev, [segmentType]: filtered };
      });
    } else {
      setSelectedBaggage((prev) => {
        const list = prev[segmentType] || [];

        const updated = list
          .map((item) => {
            if (
              item.passengerIndex === selectedPassengerIndex &&
              item.segmentKey === selectedSegmentKey &&
              item.baggageIndex === baggageIndex
            ) {
              return { ...item, quantity: Math.max(item.quantity - 1, 0) };
            }
            return item;
          })
          .filter((item) => item.quantity > 0);

        return { ...prev, [segmentType]: updated };
      });
    }
  };

  //Seat Api
  const SeatFetch = async () => {
    setAccordion2Expanded(false);
    const requestData = {
      onwardKeys: {
        key: OnwardFare.Resultindex,
        traceId: OnwardTraceId,
        isLCC: OnwardFare.isLCC,
      },
      returnKeys: {
        key: ReturnFare.Resultindex,
        traceId: ReturnTraceId,
        isLCC: ReturnFare.isLCC,
      },
      passengerDetails: PassengerInfo,
    };
    try {
      setSeatloading(true);
      const response = await fetch(`${base_url}seatMapRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const Data = await response.json();
      if (Data.data.onwards) {
        const responseData = Data.data.onwards.seatsData.Rows;
        setOnwardSeatdata(responseData);
      }
      if (Data.data.returns) {
        const responseData = Data.data.returns.seatsData.Rows;
        setReturnSeatdata(responseData);
      }
      setSeatloading(false);
      setShowModal(false);
    } catch {
      setSeatloading(false);
    }
  };
  const [currentFlightIndex, setCurrentFlightIndex] = useState(0);

  const handlePrev = (source_type) => {
    setCurrentFlightIndex((prev) => {
      if (source_type === "Uapi") {
        // UAPI logic
        if (selectedSegmentType === "onward") {
          const totalFlights = OnwardSeatData?.[0]?.Segments?.length || 0;
          return prev > 0 ? prev - 1 : totalFlights - 1;
        } else {
          const totalFlights = ReturnSeatData?.[0]?.Segments?.length || 0;
          return prev > 0 ? prev - 1 : totalFlights - 1;
        }
      } else {
        // TBO logic
        if (selectedSegmentType === "onward") {
          const totalFlights = TboOnwardSeatservice?.length || 0;
          return prev > 0 ? prev - 1 : totalFlights - 1;
        } else {
          const totalFlights = TboReturnSeatservice?.length || 0;
          return prev > 0 ? prev - 1 : totalFlights - 1;
        }
      }
    });
  };

  const handleNext = (source_type) => {
    setCurrentFlightIndex((prev) => {
      if (source_type === "Uapi") {
        if (selectedSegmentType === "onward") {
          const totalFlights = OnwardSeatData?.[0]?.Segments?.length || 0;
          return prev < totalFlights - 1 ? prev + 1 : 0;
        } else {
          const totalFlights = ReturnSeatData?.[0]?.Segments?.length || 0;
          return prev < totalFlights - 1 ? prev + 1 : 0;
        }
      } else {
        if (selectedSegmentType === "onward") {
          const totalFlights = TboOnwardSeatservice?.length || 0;
          return prev < totalFlights - 1 ? prev + 1 : 0;
        } else {
          const totalFlights = TboReturnSeatservice?.length || 0;
          return prev < totalFlights - 1 ? prev + 1 : 0;
        }
      }
    });
  };
  const parsePrice = (price) => {
    if (typeof price === "string") {
      return parseFloat(price.replace(/[^\d.]/g, "")) || 0;
    }
    return Number(price) || 0;
  };

  // const totalMealPrice = selectedMeals.reduce((total, item) => {
  //     return total + parsePrice(item.meal.TotalPrice);
  // }, 0);
  const totalMealPrice = 0;
  // const totalBaggagePrice = selectedBaggage.reduce((total, item) => {
  //     return total + parsePrice(item.baggage.TotalPrice);
  // }, 0);
  const totalBaggagePrice = 0;

  const totalSeatPrice = 0;

  const totalServicePrice = totalMealPrice + totalBaggagePrice + totalSeatPrice;

  //Cilent Gst Data
  const fetchGstData = async () => {
    const formData = new URLSearchParams();
    formData.append(`clientid`, clientid);

    try {
      if (is_gst_benefit == "1") {
        const response = await fetch(
          `${CONFIG.MAIN_API}/api/flights/getClientGst`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        const data = responseData.result;

        const gstData = {
          gstin: data.gst_id || "",
          company_name: data.billing_name || "",
          company_address: data.billing_address_line1 || "",
          company_contact: data.billing_contact || "",
        };

        setGstEntries(gstData);
      } else {
        const gstin = "07AAGCB3556P1Z7";
        const company_name = "BAI INFOSOLUTIONS PRIVATE LIMITED";
        const company_address = "1 1075 1 2 GF 4/Mehrauli/New Delhi/110030";
        const company_contact = "9881102875";

        const gstData = {
          gstin,
          company_name,
          company_address,
          company_contact,
        };
        setGstEntries(gstData);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };
  useEffect(() => {
    fetchGstData();
  }, []);
  //console.log("GstEntries", GstEntries);

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!gstForm.gstin?.trim()) {
      formErrors.gstin = "Please enter GSTIN.";
      isValid = false;
    }
    if (!gstForm.company_name?.trim()) {
      formErrors.company_name = "Please enter Name.";
      isValid = false;
    }
    if (!gstForm.company_address?.trim()) {
      formErrors.company_address = "Please enter GST Address.";
      isValid = false;
    }
    if (!gstForm.company_contact?.trim()) {
      formErrors.company_contact = "Please enter GST Contact.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  //Gst Details Saving
  const SaveGstDetails = () => {
    setGstEntries(gstForm);
    setAccordion2Expanded(false);
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
    if (e.target.checked) {
      setShowError(false); // hide error if checkbox is checked
    }
  };
  // Booking process

  const ContinueBooking = async () => {
    if (!isChecked) {
      setShowError(true); // show error if checkbox is not checked
      return;
    }
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to proceed with the booking?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Continue",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }
    // uapi optional service request
    const UapiBaggageInfo = {
      onward: selectedBaggage.onward
        .filter((item) => item.source_type === "Uapi")
        .map((item) => ({
          service_traceId: item.baggage.traceId,
          service_index: item.baggage.Key,
        })),
      return: selectedBaggage.return
        .filter((item) => item.source_type === "Uapi")
        .map((item) => ({
          service_traceId: item.baggage.traceId,
          service_index: item.baggage.Key,
        })),
    };
    const UapiMealInfo = {
      onward: selectedMeals.onward
        .filter((item) => item.sourcetype === "Uapi")
        .map((item) => ({
          service_traceId: item.meal.traceId,
          service_index: item.meal.Key,
        })),
      return: selectedMeals.return
        .filter((item) => item.sourcetype === "Uapi")
        .map((item) => ({
          service_traceId: item.meal.traceId,
          service_index: item.meal.Key,
        })),
    };
    const UpiOnwardServiceInfo = UapiBaggageInfo?.onward.concat(
      UapiMealInfo?.onward
    );
    const UpiReturnServiceInfo = UapiBaggageInfo?.return.concat(
      UapiMealInfo?.return
    );
    const onwardSeatInfo = selectedSeats["onward"].map((da) => {
      return da.seat;
    });
    const returnSeatInfo = selectedSeats["return"].map((da) => {
      return da.seat;
    });

    console.log("passenger", PassengerInfo);
    // //console.log("passenger",PassengerData)

    // const passInfo = PassengerInfo.map(da => {
    //     return {
    //         Key: da?.Key,
    //         Code: da?.code,
    //         Number: da?.contact,
    //         EmailID: da?.email,
    //         First: da?.firstName,
    //         Gender: da?.gender,
    //         Last: da?.lastName,
    //         Prefix: da?.prefix,
    //         Age: da?.age,
    //         Dob: da?.dob,
    //         PassportExpiry: da.passportexpiry,
    //         PassportNo: da.passportno,
    //     }
    // })
    const passInfo = PassengerInfo.map((info, index) => {
      const data = PassengerData[index] || {};

      // Use correct field for dob (check DateOfBirth or Dob)
      const dobString = info?.DateOfBirth || info?.Dob || data?.dob || "";
      let age = "";

      if (dobString) {
        const birthDate = new Date(dobString);
        if (!isNaN(birthDate.getTime())) {
          const today = new Date();
          age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }
        }
      }

      return {
        Key: info?.Key || "",
        Code: info?.Code || "",
        Prefix: info?.Prefix || data?.prefix || "",
        First: info?.First || data?.firstName || "",
        Last: info?.Last || data?.lastName || "",
        Gender: data?.gender || info?.Gender || "",
        Number: info?.ContactNo || data?.contact || "",
        EmailID: info?.Email || data?.email || "",
        Dob: dobString,
        Age: age,
        PassportNo: info?.PassportNo || data?.passportno || "",
        PassportExpiry: info?.PassportExpiry || data?.passportexpiry || "",
        Address1: data?.Address1 || "",
        Address2: data?.Address2 || "",
        City: data?.city || "",
      };
    });

    // requestData.passengerDetails = passInfo;
    //console.log("Passinfo:", passInfo);

    let requestData = {};
    const hasUapi =
      OnwardFare?.sourcetype === "Uapi" || ReturnFare?.sourcetype === "Uapi";

    // set passengerDetails depending on sourcetype
    requestData.passengerDetails = passInfo;
    if (OnwardFare.from === "Uapi") {
      requestData.onwardKeys = {
        source_type: OnwardFare.from,
        traceId: OnwardTraceId,
        key: OnwardPricekey || "",
        isLCC: IsOnwardLCC,
        Optional_services: UpiOnwardServiceInfo,
        Seats_services: onwardSeatInfo,
        // passengerDetails: passInfo,
      };
    } else if (OnwardFare.from === "Tbo") {
      // const enrichedPassengerDetails = TboPassengerDetails.map((passenger) => {
      //     const isInfant = passenger.PaxType === 3;
      //     const baggageForPassenger = selectedBaggage['onward'].filter(
      //         (b) => b.passengerIndex === passenger.passengerIndex
      //             &&
      //             b.source_type === "Tbo"
      //     );
      //     const MealsForPassenger = selectedMeals['onward'].filter(
      //         (b) => b.passengerIndex === passenger.passengerIndex
      //             &&
      //             b.sourcetype === "Tbo"
      //     );
      //     const SeatForPassenger = selectedSeats['onward'].filter(
      //         (b) => b.passengerIndex === passenger.passengerIndex
      //             &&
      //             b.sourcetype === "Tbo"
      //     );
      //     const Passengerfare = PerPassOnwardTboFareData.filter(
      //         (b) => b.PassengerType === passenger.PaxType
      //     );

      //     return {
      //         ...passenger,
      //         CountryCode: "IN",
      //         CountryName: "India",
      //         Nationality: "IN",
      //         FFAirlineCode: null,
      //         FFNumber: null,
      //         ...(isInfant
      //             ? {}
      //             : {
      //                 Baggage: baggageForPassenger.map((b) => b.baggage),
      //                 SeatDynamic: SeatForPassenger.map((s) => s.seat),
      //                 MealDynamic: MealsForPassenger.map((m) => m.meal),
      //             }),
      //         Fare: {
      //             BaseFare: Passengerfare[0]?.BaseFare || 0,
      //             Tax: Passengerfare[0]?.Tax || 0,
      //             YQTax: Passengerfare[0]?.YQTax || 0,
      //             AdditionalTxnFeePub: Passengerfare[0]?.AdditionalTxnFeePub || 0,
      //             AdditionalTxnFeeOfrd: Passengerfare[0]?.AdditionalTxnFeeOfrd || 0,
      //             OtherCharges: FareData?.OtherCharges || 0,
      //         },
      //         GSTCompanyAddress: GstEntries?.company_address,
      //         GSTCompanyContactNumber: GstEntries?.company_contact,
      //         GSTCompanyName: GstEntries?.company_name,
      //         GSTNumber: GstEntries?.gstin,
      //         GSTCompanyEmail: GstEntries?.company_email,
      //     };
      // });
      let enrichedPassengerDetailsOnward;

      if (IsTboOnwardLCC) {
        // TBO LCC case
        enrichedPassengerDetailsOnward = TboPassengerDetails.map(
          (passenger) => {
            const isInfant = passenger.PaxType === 3;
            const baggageForPassenger = selectedBaggage["onward"].filter(
              (b) =>
                b.passengerIndex === passenger.passengerIndex &&
                b.sourcetype === "Tbo"
            );
            const MealsForPassenger = selectedMeals["onward"].filter(
              (m) =>
                m.passengerIndex === passenger.passengerIndex &&
                m.sourcetype === "Tbo"
            );
            const SeatForPassenger = selectedSeats["onward"].filter(
              (s) =>
                s.passengerIndex === passenger.passengerIndex &&
                s.sourcetype === "Tbo"
            );
            const Passengerfare = PerPassOnwardTboFareData.filter(
              (b) => b.PassengerType === passenger.PaxType
            );

            return {
              source_type: "Tbo",
              isLCC: IsTboOnwardLCC,
              ...passenger,
              CountryCode: "IN",
              CountryName: "India",
              Nationality: "IN",
              FFAirlineCode: null,
              FFNumber: null,
              ...(isInfant
                ? {}
                : {
                  Baggage: baggageForPassenger.map((b) => b.baggage),
                  SeatDynamic: SeatForPassenger.map((s) => s.seat),
                  MealDynamic: MealsForPassenger.map((m) => m.meal),
                }),
              Fare: {
                BaseFare: Passengerfare[0]?.BaseFare || 0,
                Tax: Passengerfare[0]?.Tax || 0,
                YQTax: Passengerfare[0]?.YQTax || 0,
                AdditionalTxnFeePub: Passengerfare[0]?.AdditionalTxnFeePub || 0,
                AdditionalTxnFeeOfrd:
                  Passengerfare[0]?.AdditionalTxnFeeOfrd || 0,
                OtherCharges: FareData?.OtherCharges || 0,
              },
              GSTCompanyAddress: GstEntries?.company_address,
              GSTCompanyContactNumber: GstEntries?.company_contact,
              GSTCompanyName: GstEntries?.company_name,
              GSTNumber: GstEntries?.gstin,
              GSTCompanyEmail: GstEntries?.company_email,
            };
          }
        );
      } else {
        // Non-TBO or normal case
        enrichedPassengerDetailsOnward = TboPassengerDetails.map(
          (passenger) => {
            const isInfant = passenger.PaxType === 3;
            const baggageForPassenger = selectedBaggage["onward"].filter(
              (b) =>
                b.passengerIndex === passenger.passengerIndex &&
                b.sourcetype === "Tbo"
            );
            const MealsForPassenger = selectedMeals["onward"].filter(
              (m) =>
                m.passengerIndex === passenger.passengerIndex &&
                m.sourcetype === "Tbo"
            );
            const SeatForPassenger = selectedSeats["onward"].filter(
              (s) =>
                s.passengerIndex === passenger.passengerIndex &&
                s.sourcetype === "Tbo"
            );
            const Passengerfare = PerPassOnwardTboFareData.filter(
              (b) => b.PassengerType === passenger.PaxType
            );

            return {
              ...passenger,
              CountryCode: "",
              CellCountryCode: "",
              Nationality: "",
              FFAirlineCode: null,
              FFNumber: null,
              Fare: {
                Currency: Passengerfare[0]?.Currency || "",
                BaseFare: Passengerfare[0]?.BaseFare || 0,
                Tax: Passengerfare[0]?.Tax || 0,
                YQTax: Passengerfare[0]?.YQTax || 0,
                AdditionalTxnFeePub: Passengerfare[0]?.AdditionalTxnFeePub || 0,
                AdditionalTxnFeeOfrd:
                  Passengerfare[0]?.AdditionalTxnFeeOfrd || 0,
                OtherCharges: FareData?.OtherCharges || 0,
                Discount: Passengerfare[0]?.Discount || 0,
                PublishedFare: Passengerfare[0]?.PublishedFare || 0,
                OfferedFare: Passengerfare[0]?.OfferedFare || 0,
                TdsOnCommission: Passengerfare[0]?.TdsOnCommission || 0,
                TdsOnPLB: Passengerfare[0]?.TdsOnPLB || 0,
                TdsOnIncentive: Passengerfare[0]?.TdsOnIncentive || 0,
                ServiceFee: Passengerfare[0]?.ServiceFee || 0,
              },
              ...(isInfant
                ? {}
                : {
                  SeatDynamic: SeatForPassenger.map((s) => ({
                    Code: s.seat.Code,
                    Description: s.seat.Description,
                  })),
                  MealDynamic: MealsForPassenger.map((m) => ({
                    Code: m.meal.Code,
                    Description: m.meal.AirlineDescription,
                  })),
                }),
              GSTCompanyAddress: GstEntries?.company_address,
              GSTCompanyContactNumber: GstEntries?.company_contact,
              GSTCompanyName: GstEntries?.company_name,
              GSTNumber: GstEntries?.gstin,
              GSTCompanyEmail: GstEntries?.company_email,
            };
          }
        );
      }

      // finally set requestData
      requestData.onwardKeys = {
        source_type: OnwardFare.from,
        TraceId: TboOnwardTraceId,
        isLCC: IsTboOnwardLCC,
        ResultIndex: TbonwardResultIndex,
        Passengers: enrichedPassengerDetailsOnward,
      };

      // requestData.onwardKeys = {
      //     TraceId: TboOnwardTraceId,
      //     ResultIndex: TbonwardResultIndex,
      //     Passengers: enrichedPassengerDetails,
      // };
    }
    if (ReturnFare.from === "Uapi") {
      requestData.returnKeys = {
        source_type: ReturnFare.from,
        traceId: ReturnTraceId,
        key: ReturnPricekey || "",
        isLCC: IsReturnLCC,
        Optional_services: UpiReturnServiceInfo,
        Seats_services: returnSeatInfo,
        // passengerDetails: passInfo,
      };
    } else if (ReturnFare.from === "Tbo") {
      // const enrichedPassengerDetails = TboPassengerDetails.map((passenger) => {
      //     const isInfant = passenger.PaxType === 3;
      //     const baggageForPassenger = selectedBaggage['return'].filter(
      //         (b) => b.passengerIndex === passenger.passengerIndex
      //             &&
      //             b.source_type === "Tbo"
      //     );
      //     const MealsForPassenger = selectedMeals['return'].filter(
      //         (b) => b.passengerIndex === passenger.passengerIndex
      //             &&
      //             b.source_type === "Tbo"
      //     );
      //     const SeatForPassenger = selectedSeats['return'].filter(
      //         (b) => b.passengerIndex === passenger.passengerIndex
      //             &&
      //             b.source_type === "Tbo"
      //     );
      //     const Passengerfare = PerPassReturnTboFareData.filter(
      //         (b) => b.PassengerType === passenger.PaxType
      //     );

      //     return {
      //         ...passenger,
      //         CountryCode: "IN",
      //         CountryName: "India",
      //         Nationality: "IN",
      //         FFAirlineCode: null,
      //         FFNumber: null,
      //         ...(isInfant
      //             ? {}
      //             : {
      //                 Baggage: baggageForPassenger.map((b) => b.baggage),
      //                 SeatDynamic: SeatForPassenger.map((s) => s.seat),
      //                 MealDynamic: MealsForPassenger.map((m) => m.meal),
      //             }),
      //         Fare: {
      //             BaseFare: Passengerfare[0]?.BaseFare || 0,
      //             Tax: Passengerfare[0]?.Tax || 0,
      //             YQTax: Passengerfare[0]?.YQTax || 0,
      //             AdditionalTxnFeePub: Passengerfare[0]?.AdditionalTxnFeePub || 0,
      //             AdditionalTxnFeeOfrd: Passengerfare[0]?.AdditionalTxnFeeOfrd || 0,
      //             OtherCharges: FareData?.OtherCharges || 0,
      //         },
      //         GSTCompanyAddress: GstEntries?.company_address,
      //         GSTCompanyContactNumber: GstEntries?.company_contact,
      //         GSTCompanyName: GstEntries?.company_name,
      //         GSTNumber: GstEntries?.gstin,
      //         GSTCompanyEmail: GstEntries?.company_email,
      //     };
      // });

      // requestData.returnKeys = {
      //     TraceId: TboReturnTraceId,
      //     ResultIndex: TboreturnResultIndex,
      //     Passengers: enrichedPassengerDetails,
      // };

      let enrichedPassengerDetails;

      if (IsTboReturnLCC) {
        // TBO LCC case
        enrichedPassengerDetails = TboPassengerDetails.map((passenger) => {
          const isInfant = passenger.PaxType === 3;
          const baggageForPassenger = selectedBaggage["return"].filter(
            (b) =>
              b.passengerIndex === passenger.passengerIndex &&
              b.source_type === "Tbo"
          );
          const MealsForPassenger = selectedMeals["return"].filter(
            (b) =>
              b.passengerIndex === passenger.passengerIndex &&
              b.source_type === "Tbo"
          );
          const SeatForPassenger = selectedSeats["return"].filter(
            (b) =>
              b.passengerIndex === passenger.passengerIndex &&
              b.source_type === "Tbo"
          );
          const Passengerfare = PerPassReturnTboFareData.filter(
            (b) => b.PassengerType === passenger.PaxType
          );

          return {
            ...passenger,
            CountryCode: "IN",
            CountryName: "India",
            Nationality: "IN",
            FFAirlineCode: null,
            FFNumber: null,
            ...(isInfant
              ? {}
              : {
                Baggage: baggageForPassenger.map((b) => b.baggage),
                SeatDynamic: SeatForPassenger.map((s) => s.seat),
                MealDynamic: MealsForPassenger.map((m) => m.meal),
              }),
            Fare: {
              BaseFare: Passengerfare[0]?.BaseFare || 0,
              Tax: Passengerfare[0]?.Tax || 0,
              YQTax: Passengerfare[0]?.YQTax || 0,
              AdditionalTxnFeePub: Passengerfare[0]?.AdditionalTxnFeePub || 0,
              AdditionalTxnFeeOfrd: Passengerfare[0]?.AdditionalTxnFeeOfrd || 0,
              OtherCharges: FareData?.OtherCharges || 0,
            },
            GSTCompanyAddress: GstEntries?.company_address,
            GSTCompanyContactNumber: GstEntries?.company_contact,
            GSTCompanyName: GstEntries?.company_name,
            GSTNumber: GstEntries?.gstin,
            GSTCompanyEmail: GstEntries?.company_email,
          };
        });
      } else {
        // Non-TBO or normal case
        enrichedPassengerDetails = PassengerDetails.map((passenger) => {
          const isInfant = passenger.PaxType === 3;
          const baggageForPassenger = selectedBaggage["return"].filter(
            (b) =>
              b.passengerIndex === passenger.passengerIndex &&
              b.source_type === "Tbo"
          );
          const MealsForPassenger = selectedMeals["return"].filter(
            (b) =>
              b.passengerIndex === passenger.passengerIndex &&
              b.source_type === "Tbo"
          );
          const SeatForPassenger = selectedSeats["return"].filter(
            (b) =>
              b.passengerIndex === passenger.passengerIndex &&
              b.source_type === "Tbo"
          );
          const Passengerfare = PerPassReturnTboFareData.filter(
            (b) => b.PassengerType === passenger.PaxType
          );

          return {
            ...passenger,
            CountryCode: "",
            CellCountryCode: "",
            Nationality: "",
            FFAirlineCode: null,
            FFNumber: null,
            Fare: {
              Currency: Passengerfare[0]?.Currency || "",
              BaseFare: Passengerfare[0]?.BaseFare || 0,
              Tax: Passengerfare[0]?.Tax || 0,
              YQTax: Passengerfare[0]?.YQTax || 0,
              AdditionalTxnFeePub: Passengerfare[0]?.AdditionalTxnFeePub || 0,
              AdditionalTxnFeeOfrd: Passengerfare[0]?.AdditionalTxnFeeOfrd || 0,
              OtherCharges: FareData?.OtherCharges || 0,
              Discount: Passengerfare[0]?.Discount || 0,
              PublishedFare: Passengerfare[0]?.PublishedFare || 0,
              OfferedFare: Passengerfare[0]?.OfferedFare || 0,
              TdsOnCommission: Passengerfare[0]?.TdsOnCommission || 0,
              TdsOnPLB: Passengerfare[0]?.TdsOnPLB || 0,
              TdsOnIncentive: Passengerfare[0]?.TdsOnIncentive || 0,
              ServiceFee: Passengerfare[0]?.ServiceFee || 0,
            },
            ...(isInfant
              ? {}
              : {
                SeatDynamic: SeatForPassenger.map((s) => ({
                  Code: s.seat.Code,
                  Description: s.seat.Description,
                })),
                MealDynamic: MealsForPassenger.map((m) => ({
                  Code: m.meal.Code,
                  Description: m.meal.AirlineDescription,
                })),
              }),
            GSTCompanyAddress: GstEntries?.company_address,
            GSTCompanyContactNumber: GstEntries?.company_contact,
            GSTCompanyName: GstEntries?.company_name,
            GSTNumber: GstEntries?.gstin,
            GSTCompanyEmail: GstEntries?.company_email,
          };
        });
      }
      //console.log(enrichedPassengerDetails);

      // finally set requestData
      requestData.returnKeys = {
        source_type: ReturnFare.from,
        TraceId: TboReturnTraceId,
        isLCC: IsTboReturnLCC,
        ResultIndex: TboreturnResultIndex,
        Passengers: enrichedPassengerDetails,
      };
    }

    console.log("Final requestData:", requestData);

    try {
      setfinalloading(true);
      const response = await fetch(`${base_url}makeFinalPriceRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const Data = await response.json();
      setfinalloading(false);
      //console.log("Final resposne", Data);
      const onward = Data?.data?.onwards;
      const ret = Data?.data?.returns;

      // CASE: API sent error (string instead of object)
      if (typeof onward === "string" || typeof ret === "string") {
        Swal.fire({
          title: "Error",
          text: typeof onward === "string" ? onward : ret,
          iconHtml: '<i class="fa fa-exclamation" aria-hidden="true"></i>',
          confirmButtonText: "Try Again",
        }).then((result) => {
          if (result.isConfirmed) {
            if (bookingid) {
              navigate("/SearchFlight", { state: { responseData: TaxivaxiFlightDetails } });
            } else {
              window.location.href = "/";
            }
          }
        });

        return; // IMPORTANT
      }

      else if (Data.status == false || Data.status == "error") {
        Swal.fire({
          title: "Error",
          text: Data.message,
          iconHtml: '<i class="fa fa-exclamation" aria-hidden="true"></i>',
          confirmButtonText: "Try Again",
        }).then((result) => {
          if (result.isConfirmed) {
            if (bookingid) {
              const responseData = TaxivaxiFlightDetails;
              navigate("/SearchFlight", { state: { responseData } });
            } else {
              window.location.href = "/";
            }
          }
        });
      }
      else if (Data.status == true) {
        const LocatorCode = Data.data.LocatorCode;

        localStorage.setItem("Passengerdetails", JSON.stringify(PassengerInfo));
        setLocatorcode(LocatorCode);
        const responseData = TaxivaxiFlightDetails;
        const FlightBooking = Data.data;
        navigate("/ReturnbookingCompleted", {
          state: { FlightBooking, responseData },
        });
      }
      setfinalloading(false);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        iconHtml: '<i class="fa fa-exclamation" aria-hidden="true"></i>',
        confirmButtonText: "OK",
      });
      setfinalloading(false);
    }
  };

  const isAlphabetic = (event) => {
    var charCode = event.charCode;
    return (
      (charCode >= 65 && charCode <= 90) || // A-Z
      (charCode >= 97 && charCode <= 122) || // a-z
      charCode === 32 // Space
    );
  };
  function handleKeyPress(event) {
    if (!isAlphabetic(event)) {
      event.preventDefault();
    }
  }
  const isNumber = (event) => {
    var charCode = event.charCode;
    return charCode >= 48 && charCode <= 57;
  };
  function handleNumberPress(event) {
    if (!isNumber(event)) {
      event.preventDefault();
    }
  }
  const handleseatbuttonskip = () => {
    setAccordion3Expanded(false);
  };
  const handlebaggagebuttonskip = () => {
    setAccordion4Expanded(false);
    setAccordion6Expanded(true);
  };
  const handleMealbuttonskip = () => {
    setAccordion6Expanded(false);
  };

  //Convert into week date month year
  const handleweekdatemonthyear = (date) => {
    const arrivalTime = new Date(date);
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const weekday = weekdays[arrivalTime.getDay()];
    const day = arrivalTime.getDate();
    const month = months[arrivalTime.getMonth()];
    const year = arrivalTime.getFullYear();

    const formattedDateString = `${weekday}, ${day} ${month} ${year}`;
    return formattedDateString;
  };
  //Kg converter
  function formatWeight(weight) {
    if (!weight) return "";

    const trimmed = weight.trim().toLowerCase();

    if (trimmed.endsWith("kg")) {
      // Already in correct format
      return weight.toUpperCase();
    }

    // Convert "Kilograms" or similar to "KG"
    const numberPart = weight.match(/\d+/);
    return numberPart ? `${numberPart[0]} KG` : weight;
  }
  function replaceINRWithSymbol(price) {
    if (price == null) return ""; // handles null/undefined
    const priceStr = String(price); // ensure it's a string
    return priceStr.includes("INR") ? priceStr.replace("INR", "₹") : priceStr;
  }

  const validateIndianNumber = (value) => {
    // Remove all non-digits (removes +, spaces, dashes, etc.)
    const cleaned = value.replace(/[^\d]/g, "");
    return /^91[6-9]\d{9}$/.test(value);
  };

  const handlePhoneChange = (value) => {
    setPhoneNumbers(value);
    if (validateIndianNumber(value)) {
      setPhoneError("");
    } else {
      setPhoneError("Please enter a valid 10-digit Indian mobile number.");
    }
  };
  return (
    <div className="yield-content" style={{ background: "#e8e4ff" }}>
      {Seatloading && (
        <div className="page-center-loader flex items-center justify-center">
          <div className="big-loader flex items-center justify-center">
            <img
              className="loader-gif"
              src="/img/cotravloader.gif"
              alt="Loader"
            />
            <p className="text-center ml-4 text-gray-600 text-lg">
              Retrieving seat details. Please wait a moment.
            </p>
          </div>
        </div>
      )}
      {Finalloading && (
        <div className="page-center-loader flex items-center justify-center">
          <div className="big-loader flex items-center justify-center">
            <img
              className="loader-gif"
              src="/img/cotravloader.gif"
              alt="Loader"
            />
            <p className="text-center ml-4 text-gray-600 text-lg">
              Your booking is being processed. This may take a few moments...
            </p>
          </div>
        </div>
      )}
      {loadingg && (
        <div className="page-center-loader flex items-center justify-center backdrop-blur-sm bg-white/30">
          <div className="big-loader flex items-center justify-center">
            <img
              className="loader-gif"
              src="/img/cotravloader.gif"
              alt="Loader"
            />
            <p className="text-center ml-4 text-gray-600 text-lg">
              Retrieving flight details. Please wait a moment.
            </p>
          </div>
        </div>
      )}
      <div className="main-cont" id="main_cont">
        <div className="body-wrapper">
          <div className="wrapper-padding">
            <span className="bgGradient"></span>

            <div className="sp-page">
              <div className="sp-page-a">
                <div className="sp-page-l">
                  <div className="sp-page-lb">
                    <div className="sp-page-p">
                      <div className="booking-left">
                        <div>
                          <div className="baggagae_policy">
                            <>
                              <span className="headingpolicies mb-2">
                                Flight Details
                                <span></span>
                              </span>
                              <div
                                className="modal fade bd-example-modal-lg multipleflight"
                                tabIndex={-1}
                                role="dialog"
                                aria-labelledby="myLargeModalLabel"
                                aria-hidden="true"
                              ></div>
                            </>
                            <div className="mb-3 shadow-md">
                              <span className="Returnflight-heading">
                                {OnwardFlight?.originAirport?.CityName}{" "}
                                <ArrowForwardSharp style={{ width: "70%" }} />{" "}
                                {OnwardFlight?.destinationAirport?.CityName}
                              </span>
                              {OnwardSegments.map((data, index) => (
                                <div
                                  key={index}
                                  className="row"
                                  style={{
                                    border: "1px solid #e3e3e3",
                                    margin: "0% 0%",
                                  }}
                                >
                                  <div className="Flight-segment-container">
                                    <div>
                                      <div className="row accordionfarename apiairportname">
                                        <div className="airport-flight-row">
                                          <div className="airport-flight-container">
                                            {/* Airline Logo */}
                                            <img
                                              className="airport-airline-img w-9 h-9"
                                              src={`https://devapi.taxivaxi.com/airline_logo_images/${data?.Airline?.AirlineCode}.png`}
                                              alt="Airline logo"
                                            />
                                            <div className="airport-flight-details text-black font-bold">
                                              <span className="airport-airline-name">
                                                {data?.Airline?.AirlineName}{" "}
                                                {data?.Airline?.AirlineCode}
                                                <br />
                                                <span className="airport-flight-number">
                                                  {data?.Airline?.FlightNumber}
                                                </span>
                                              </span>
                                            </div>

                                            {/* Cabin Class */}
                                            <div className="airport-cabin-class">
                                              {responseData?.CabinClass}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flight-details-container">
                                        <div className="row accordionfarename apiairportname">
                                          <span className="apicircle">◯</span>
                                          <span className="CityName">
                                            {data?.Origin?.Airport?.CityName}
                                          </span>
                                          <span className="airport">
                                            {data?.Origin?.Airport?.AirportName}{" "}
                                            {data?.Origin?.Airport?.Terminal}
                                          </span>
                                        </div>
                                        <div className="row accordionfarename apiairportname">
                                          <span className="vertical_line"></span>
                                          {handleweekdatemonthyear(
                                            data?.Origin?.DepTime
                                          )}
                                        </div>
                                        <div className="row accordionfarename apiairportname">
                                          <span className="apicircle">◯</span>
                                          <span className="CityName">
                                            {
                                              data?.Destination?.Airport
                                                ?.CityName
                                            }
                                          </span>
                                          <span className="airport">
                                            {
                                              data?.Destination?.Airport
                                                ?.AirportName
                                            }{" "}
                                            {
                                              data?.Destination?.Airport
                                                ?.Terminal
                                            }
                                          </span>
                                        </div>
                                        <div className="baggage-info">
                                          <span className="cabin-baggage">
                                            <img
                                              src="/img/cabin_bag.svg"
                                              alt="Cabin Baggage"
                                              className="baggage-icon"
                                            />
                                            <strong>Cabin Baggage:</strong>{" "}
                                            {formatWeight(data?.CabinBaggage) ||
                                              "7KG"}
                                          </span>
                                          <span className="checkin-baggage">
                                            <img
                                              src="/img/checkin_bag.svg"
                                              alt="Cabin Baggage"
                                              className="baggage-icon"
                                            />
                                            <strong>Check-In Baggage:</strong>{" "}
                                            {formatWeight(data?.Baggage) ||
                                              "15KG"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div>
                              <span className="Returnflight-heading">
                                {ReturnFlight?.originAirport?.CityName}{" "}
                                <ArrowForwardSharp style={{ width: "70%" }} />{" "}
                                {ReturnFlight?.destinationAirport?.CityName}
                              </span>
                              {ReturnSegments.map((data, index) => (
                                <div
                                  key={index}
                                  className="row"
                                  style={{
                                    border: "1px solid #e3e3e3",
                                    margin: "0% 0%",
                                  }}
                                >
                                  <div className="Flight-segment-container">
                                    <div>
                                      <div className="row accordionfarename apiairportname">
                                        <div className="airport-flight-row">
                                          <div className="airport-flight-container">
                                            {/* Airline Logo */}
                                            <img
                                              className="airport-airline-img w-9 h-9"
                                              src={`https://devapi.taxivaxi.com/airline_logo_images/${data?.Airline?.AirlineCode}.png`}
                                              alt="Airline logo"
                                            />
                                            <div className="airport-flight-details text-black font-bold">
                                              <span className="airport-airline-name">
                                                {data?.Airline?.AirlineName}{" "}
                                                {data?.Airline?.AirlineCode}
                                                <br />
                                                <span className="airport-flight-number">
                                                  {data?.Airline?.FlightNumber}
                                                </span>
                                              </span>
                                            </div>

                                            {/* Cabin Class */}
                                            <div className="airport-cabin-class">
                                              {responseData?.CabinClass}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flight-details-container">
                                        <div className="row accordionfarename apiairportname">
                                          <span className="apicircle">◯</span>
                                          <span className="CityName">
                                            {data?.Origin?.Airport?.CityName}
                                          </span>
                                          <span className="airport">
                                            {data?.Origin?.Airport?.AirportName}{" "}
                                            {data?.Origin?.Airport?.Terminal}
                                          </span>
                                        </div>
                                        <div className="row accordionfarename apiairportname">
                                          <span className="vertical_line"></span>
                                          {handleweekdatemonthyear(
                                            data?.Origin?.DepTime
                                          )}
                                        </div>
                                        <div className="row accordionfarename apiairportname">
                                          <span className="apicircle">◯</span>
                                          <span className="CityName">
                                            {
                                              data?.Destination?.Airport
                                                ?.CityName
                                            }
                                          </span>
                                          <span className="airport">
                                            {
                                              data?.Destination?.Airport
                                                ?.AirportName
                                            }{" "}
                                            {
                                              data?.Destination?.Airport
                                                ?.Terminal
                                            }
                                          </span>
                                        </div>
                                        <div className="baggage-info">
                                          <span className="cabin-baggage">
                                            <img
                                              src="/img/cabin_bag.svg"
                                              alt="Cabin Baggage"
                                              className="baggage-icon"
                                            />
                                            <strong>Cabin Baggage:</strong>{" "}
                                            {formatWeight(data?.CabinBaggage) ||
                                              "7KG"}
                                          </span>
                                          <span className="checkin-baggage">
                                            <img
                                              src="/img/checkin_bag.svg"
                                              alt="Cabin Baggage"
                                              className="baggage-icon"
                                            />
                                            <strong>Check-In Baggage:</strong>{" "}
                                            {formatWeight(data?.Baggage) ||
                                              "15KG"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="table-container">
                          <div className="flex items-center justify-between">
                            <h1>Cancellation / Date Change Charges</h1>
                            {/* <a
                              onClick={() => setIsOpen(true)}
                              className="text-blue-500 text-[11px] mr-5 hover:underline cursor-pointer"
                            >
                              More Policy
                            </a> */}
                          </div>
                          {isOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                              <div
                                className="bg-white p-4 rounded-lg  shadow-lg relative"
                                style={{ width: "700px" }}
                              >
                                <h2 className="text-lg bg-purple font-semibold mb-3">
                                  Details
                                </h2>
                                <div className="max-h-[300px] overflow-y-auto policy_container">
                                  <pre
                                    className="text-xs"
                                    dangerouslySetInnerHTML={{ __html: Policy }}
                                  />
                                </div>
                                <button
                                  onClick={() => setIsOpen(false)}
                                  className="absolute top-2 right-2 text-red-500 hover:text-red-600 text-xl"
                                >
                                  ✖
                                </button>
                              </div>
                            </div>
                          )}

                          {Segments?.some(
                            (seg) => seg.Airline?.AirlineCode === "6E"
                          ) ? (
                            <table className="styled-table">
                              <thead>
                                <tr>
                                  <th colSpan={2}>Cancellation</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(() => {
                                  const cancelItem =
                                    CancellationData?.Cancellation?.find(
                                      (item) => item.fare_name === fare_type
                                    );
                                  return cancelItem ? (
                                    <tr>
                                      <td>
                                        {cancelItem.fare_name}{" "}
                                        ({cancelItem.airline_short_name})
                                      </td>
                                      <td>
                                        {cancelItem.fee.replace(/INR/i, "₹")}
                                      </td>
                                    </tr>
                                  ) : (
                                    <tr>
                                      <td colSpan={2}>
                                        No cancellation policy found
                                      </td>
                                    </tr>
                                  );
                                })()}

                                <tr>
                                  <th colSpan={2}>Date Change</th>
                                </tr>

                                {(() => {
                                  const dateChangeItem =
                                    CancellationData?.Date_Change?.find(
                                      (item) => item.fare_name === fare_type
                                    );
                                  return dateChangeItem ? (
                                    <tr>
                                      <td>
                                          {dateChangeItem.fare_name}
                                      
                                        ({dateChangeItem.airline_short_name})
                                      </td>
                                      <td>
                                        {dateChangeItem.fee.replace(
                                          /INR/i,
                                          "₹"
                                        )}
                                      </td>
                                    </tr>
                                  ) : (
                                    <tr>
                                      <td colSpan={2}>
                                        No date change policy found
                                      </td>
                                    </tr>
                                  );
                                })()}
                              </tbody>
                            </table>
                          ) : (
                            <table className="styled-table">
                              <thead>
                                <tr>
                                  <th colSpan={2}>Cancellation</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(() => {
                                  const cancelItem =
                                    CancellationData1G?.CancelPenalty;
                                  const formatValue = (item) => {
                                    if (item?.Amount) {
                                      return item.Amount.includes("INR")
                                        ? item.Amount.replace(/INR/i, "₹")
                                        : item.Amount;
                                    } else if (item?.Percentage) {
                                      return `${item.Percentage}%`;
                                    } else {
                                      return "N/A";
                                    }
                                  };
                                  return cancelItem ? (
                                    <tr>
                                      <td>
                                      
                                          {cancelItem.PenaltyApplies}
                                    
                                      </td>
                                      <td>{formatValue(cancelItem)}</td>
                                    </tr>
                                  ) : (
                                    <tr>
                                      <td colSpan={2}>
                                        No cancellation policy found
                                      </td>
                                    </tr>
                                  );
                                })()}

                                <tr>
                                  <th colSpan={2}>Date Change</th>
                                </tr>
                                {(() => {
                                  const cancelItem =
                                    CancellationData1G?.ChangePenalty;
                                  const formatValue = (item) => {
                                    if (item?.Amount) {
                                      return item.Amount.includes("INR")
                                        ? item.Amount.replace(/INR/i, "₹")
                                        : item.Amount;
                                    } else if (item?.Percentage) {
                                      return `${item.Percentage}%`;
                                    } else {
                                      return "N/A";
                                    }
                                  };
                                  return cancelItem ? (
                                    <tr>
                                      <td>
                                      
                                          {cancelItem.PenaltyApplies}
                                    
                                      </td>
                                      <td>{formatValue(cancelItem)}</td>
                                    </tr>
                                  ) : (
                                    <tr>
                                      <td colSpan={2}>
                                        No Date Change policy found
                                      </td>
                                    </tr>
                                  );
                                })()}
                              </tbody>
                            </table>
                          )}

                          <p className="note">* From the Time of Departure</p>
                        </div>

                        <form style={{ marginTop: "1%" }}>
                          <input
                            type="hidden"
                            name="_token"
                            defaultValue="i4raLr6oEg0tP0rBiDGwtSpV4Wfesa5PiCq222sR"
                          />{" "}
                          <div>
                            <Accordion
                              defaultExpanded
                              expanded={accordion1Expanded}
                              onChange={(event, isExpanded) =>
                                setAccordion1Expanded(isExpanded)
                              }
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                className="accordion"
                              >
                                Passenger Details &nbsp;&nbsp;
                                <span className="govid">
                                  {" "}
                                  Important: Enter name as mentioned on your
                                  passport or Government approved IDs.
                                </span>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className="" id="">
                                  {passengerList.map((passenger, formIndex) => (
                                    <div
                                      key={formIndex}
                                      ref={(el) =>
                                        (formRefs.current[formIndex] = el)
                                      }
                                    >
                                      <div
                                        id="totalPassenger"
                                        data-totalpassenger={formIndex + 1}
                                      />
                                      <input
                                        type="hidden"
                                        name="passengerkey[]"
                                      />
                                      <input
                                        type="hidden"
                                        name="passengercode[]"
                                      />
                                      <h1
                                        style={{
                                          backgroundColor: "#fff",
                                          marginLeft: 5,
                                          marginTop: 10,
                                        }}
                                      >
                                        {passenger.type} {passenger.index}
                                      </h1>
                                      <div className="booking-container1">
                                        <div className="booking-row">
                                          {passenger.type == "Adult" && (
                                            <div className="booking-field booking-prefix">
                                              <label>
                                                Prefix
                                                <span className="mandatory-star">
                                                  *
                                                </span>
                                              </label>
                                              <div className="form-calendar1">
                                                <select
                                                  name="adult_prefix[]"
                                                  data-index={formIndex}
                                                  disabled={bookingid}
                                                  style={{
                                                    pointerEvents: bookingid
                                                      ? "none"
                                                      : "auto",
                                                    backgroundColor: bookingid
                                                      ? "#f0f0f0"
                                                      : "white",
                                                  }}
                                                  defaultValue={
                                                    TaxivaxiPassengeDetails?.[
                                                      formIndex
                                                    ]?.gender === "Female"
                                                      ? "Mrs"
                                                      : "Mr"
                                                  }
                                                >
                                                  <option value="Mr">
                                                    Mr.
                                                  </option>
                                                  <option value="Mrs">
                                                    Mrs.
                                                  </option>
                                                </select>
                                              </div>
                                            </div>
                                          )}
                                          <div className="booking-field booking-name">
                                            <label>
                                              First Name
                                              <span className="mandatory-star">
                                                *
                                              </span>
                                            </label>
                                            <input
                                              type="text"
                                              name="adult_first_name[]"
                                              onKeyPress={handleKeyPress}
                                              data-index={formIndex}
                                              readOnly={bookingid}
                                              style={{
                                                pointerEvents: bookingid
                                                  ? "none"
                                                  : "auto",
                                                backgroundColor: bookingid
                                                  ? "#f0f0f0"
                                                  : "white",
                                              }}
                                              defaultValue={
                                                TaxivaxiPassengeDetails?.[
                                                  formIndex
                                                ]?.firstName
                                                  ? TaxivaxiPassengeDetails[
                                                    formIndex
                                                  ].firstName
                                                  : ""
                                              }
                                            // defaultValue={
                                            //     TaxivaxiPassengeDetails?.[formIndex]?.people_name
                                            //         ? TaxivaxiPassengeDetails[formIndex].people_name.trim().split(' ').slice(0, -1).join(' ').trim()
                                            //         : ''
                                            // }
                                            />
                                            <span
                                              className="error-message adult_first_name-message"
                                              style={{
                                                display: "none",
                                                color: "red",
                                                fontWeight: "normal",
                                              }}
                                            >
                                              Please Enter First Name.
                                            </span>
                                          </div>

                                          <div className="booking-field booking-name">
                                            <label>
                                              Last Name
                                              <span className="mandatory-star">
                                                *
                                              </span>
                                            </label>
                                            <input
                                              type="text"
                                              name="adult_last_name[]"
                                              onKeyPress={handleKeyPress}
                                              data-index={formIndex}
                                              readOnly={bookingid}
                                              style={{
                                                pointerEvents: bookingid
                                                  ? "none"
                                                  : "auto",
                                                backgroundColor: bookingid
                                                  ? "#f0f0f0"
                                                  : "white",
                                              }}
                                              defaultValue={
                                                TaxivaxiPassengeDetails?.[
                                                  formIndex
                                                ]?.lastName
                                                  ? TaxivaxiPassengeDetails[
                                                    formIndex
                                                  ].lastName
                                                  : ""
                                              }

                                            // defaultValue={
                                            //     TaxivaxiPassengeDetails?.[passengerindex]?.people_name
                                            //         ? TaxivaxiPassengeDetails[passengerindex].people_name.trim().split(' ').pop()
                                            //         : ''
                                            // }
                                            />
                                            <span
                                              className="error-message adult_last_name-message"
                                              style={{
                                                display: "none",
                                                color: "red",
                                                fontWeight: "normal",
                                              }}
                                            >
                                              Please Enter Last Name.
                                            </span>
                                          </div>
                                          {(passenger.type == "Child" ||
                                            passenger.type == "Infant") && (
                                              <div className="booking-field booking-gender">
                                                <label>
                                                  Gender
                                                  <span className="mandatory-star">
                                                    *
                                                  </span>
                                                </label>
                                                <div className="form-calendar1">
                                                  <select
                                                    name="adult_gender[]"
                                                    data-index={formIndex}
                                                    disabled={bookingid}
                                                    style={{
                                                      pointerEvents: bookingid
                                                        ? "none"
                                                        : "auto",
                                                      backgroundColor: bookingid
                                                        ? "#f0f0f0"
                                                        : "white",
                                                    }}
                                                    defaultValue={
                                                      TaxivaxiPassengeDetails?.[
                                                        formIndex
                                                      ]?.gender === "Female"
                                                        ? "F"
                                                        : "M"
                                                    }
                                                  >
                                                    <option value="">
                                                      Select Gender
                                                    </option>
                                                    <option value="M">
                                                      Male
                                                    </option>
                                                    <option value="F">
                                                      Female
                                                    </option>
                                                  </select>
                                                </div>
                                                <span className="error-message">
                                                  Please Select Gender
                                                </span>
                                              </div>
                                            )}
                                        </div>

                                        <div className="booking-row mb-0">
                                          {passenger.type == "Adult" && (
                                            <>
                                              <div className="booking-field booking-email gap-0">
                                                <label>
                                                  Email ID
                                                  <span className="mandatory-star">
                                                    *
                                                  </span>
                                                </label>
                                                <input
                                                  type="email"
                                                  name="email1"
                                                  data-index={formIndex}
                                                  // placeholder=""
                                                  readOnly={bookingid}
                                                  style={{
                                                    pointerEvents: bookingid
                                                      ? "none"
                                                      : "auto",
                                                    backgroundColor: bookingid
                                                      ? "#f0f0f0"
                                                      : "white",
                                                  }}
                                                  defaultValue={
                                                    TaxivaxiPassengeDetails?.[
                                                      formIndex
                                                    ]?.employee_email || ""
                                                  }
                                                />
                                                <span
                                                  className="error-message"
                                                  style={{
                                                    display: "none",
                                                    color: "red",
                                                    fontWeight: "normal",
                                                  }}
                                                >
                                                  Please Enter Email Id.
                                                </span>
                                                {/* <span className="error-message">Please Enter Email ID.</span> */}
                                              </div>

                                              <div className="booking-field booking-mobile gap-0">
                                                <label>
                                                  Mobile Number
                                                  <span className="mandatory-star">
                                                    *
                                                  </span>
                                                </label>
                                                <div className="mobile-input-wrapper">
                                                  <PhoneInput
                                                    international
                                                    country={"in"}
                                                    value={
                                                      phoneNumbers ||
                                                      (TaxivaxiPassengeDetails?.[0]
                                                        ?.employee_contact
                                                        ? `+91${TaxivaxiPassengeDetails[0].employee_contact}`
                                                        : "")
                                                    }
                                                    // onChange={(value) => {
                                                    //   setPhoneNumbers(value);
                                                    // }}
                                                    onChange={handlePhoneChange}
                                                    name="contact_details1"
                                                    data-index={formIndex}
                                                    className="phone-input"
                                                    placeholder="Enter phone number"
                                                    disabled={bookingid}
                                                    style={{
                                                      pointerEvents: bookingid
                                                        ? "none"
                                                        : "auto",
                                                      backgroundColor: bookingid
                                                        ? "#f0f0f0"
                                                        : "white",
                                                    }}
                                                    // name="contact_details1"
                                                    defaultValue={
                                                      TaxivaxiPassengeDetails?.[
                                                        formIndex
                                                      ]?.employee_contact || ""
                                                    }
                                                  />
                                                </div>
                                                {phoneError && (
                                                  <span
                                                    style={{
                                                      color: "red",
                                                      fontSize: "11px",
                                                    }}
                                                  >
                                                    {phoneError}
                                                  </span>
                                                )}
                                                <span className="error-message">
                                                  Please Enter Mobile Number
                                                </span>
                                              </div>

                                              <div className="booking-field booking-gender gap-0">
                                                <label>
                                                  Gender
                                                  <span className="mandatory-star">
                                                    *
                                                  </span>
                                                </label>
                                                <div className="form-calendar1">
                                                  <select
                                                    name="adult_gender[]"
                                                    data-index={formIndex}
                                                    disabled={bookingid}
                                                    style={{
                                                      pointerEvents: bookingid
                                                        ? "none"
                                                        : "auto",
                                                      backgroundColor: bookingid
                                                        ? "#f0f0f0"
                                                        : "white",
                                                    }}
                                                    defaultValue={
                                                      TaxivaxiPassengeDetails?.[
                                                        formIndex
                                                      ]?.gender === "Female"
                                                        ? "F"
                                                        : "M"
                                                    }
                                                  >
                                                    <option value="">
                                                      Select Gender
                                                    </option>
                                                    <option value="M">
                                                      Male
                                                    </option>
                                                    <option value="F">
                                                      Female
                                                    </option>
                                                  </select>
                                                </div>
                                                <span className="error-message">
                                                  Please Select Gender
                                                </span>
                                              </div>
                                            </>
                                          )}
                                          {/* {passenger.type !== 'Adult' && ( */}
                                          <div className="booking-field booking-gender">
                                            <label>
                                              Date Of Birth
                                              <span className="mandatory-star">
                                                {FlightType ===
                                                  "International" && "*"}
                                              </span>
                                            </label>
                                            <div
                                              className="form-calendar"
                                              style={{ width: "32%" }}
                                            >
                                              <input
                                                type="date"
                                                name="adult_age[]"
                                                max={maxDate}
                                                data-index={formIndex}
                                                readOnly={bookingid}
                                                style={{
                                                  pointerEvents: bookingid
                                                    ? "none"
                                                    : "auto",
                                                  backgroundColor: bookingid
                                                    ? "#f0f0f0"
                                                    : "white",
                                                }}
                                                defaultValue={
                                                  TaxivaxiPassengeDetails &&
                                                    TaxivaxiPassengeDetails[
                                                    formIndex
                                                    ] &&
                                                    TaxivaxiPassengeDetails[
                                                    formIndex
                                                    ]["date_of_birth"]
                                                    ? TaxivaxiPassengeDetails[
                                                    formIndex
                                                    ]["date_of_birth"]
                                                    : new Date(
                                                      new Date().setFullYear(
                                                        new Date().getFullYear() -
                                                        99
                                                      )
                                                    )
                                                      .toISOString()
                                                      .split("T")[0] // Converts to YYYY-MM-DD format
                                                }
                                              />
                                            </div>
                                          </div>
                                          {/* )} */}
                                        </div>
                                        {passenger.type == "Adult" && (
                                          <div className="booking-row">
                                            <div className="booking-field booking-name">
                                              <label>
                                                Address Line 1
                                                <span className="mandatory-star">
                                                  {FlightType ===
                                                    "International" && "*"}
                                                </span>
                                              </label>
                                              <input
                                                type="text"
                                                name="adult_address_line_1[]"
                                                data-index={formIndex}
                                              // readOnly={bookingid}
                                              // defaultValue={
                                              //     emptaxivaxi?.[passengerindex]?.people_name
                                              //         ? (emptaxivaxi[passengerindex].people_name.trim().includes(' ')
                                              //             ? emptaxivaxi[passengerindex].people_name.trim().split(' ').pop()
                                              //             : emptaxivaxi[passengerindex].people_name.trim()) // If only one word, use the same for last name
                                              //         : ''
                                              // }
                                              // defaultValue={
                                              //     emptaxivaxi?.[passengerindex]?.people_name
                                              //         ? emptaxivaxi[passengerindex].people_name.trim().split(' ').pop()
                                              //         : ''
                                              // }
                                              />
                                              <span
                                                className="error-message adult_address_line_1-message"
                                                style={{
                                                  display: "none",
                                                  color: "red",
                                                  fontWeight: "normal",
                                                }}
                                              >
                                                Please Enter The Address Line 1.
                                              </span>
                                            </div>
                                            <div className="booking-field booking-name">
                                              <label>
                                                Address Line 2
                                                <span className="mandatory-star">
                                                  {FlightType ===
                                                    "International" && "*"}
                                                </span>
                                              </label>
                                              <input
                                                type="text"
                                                name="adult_address_line_2[]"
                                                data-index={formIndex}
                                              // readOnly={bookingid}
                                              // defaultValue={
                                              //     emptaxivaxi?.[passengerindex]?.people_name
                                              //         ? (emptaxivaxi[passengerindex].people_name.trim().includes(' ')
                                              //             ? emptaxivaxi[passengerindex].people_name.trim().split(' ').pop()
                                              //             : emptaxivaxi[passengerindex].people_name.trim()) // If only one word, use the same for last name
                                              //         : ''
                                              // }
                                              // defaultValue={
                                              //     emptaxivaxi?.[passengerindex]?.people_name
                                              //         ? emptaxivaxi[passengerindex].people_name.trim().split(' ').pop()
                                              //         : ''
                                              // }
                                              />
                                              <span
                                                className="error-message adult_address_line_2-message"
                                                style={{
                                                  display: "none",
                                                  color: "red",
                                                  fontWeight: "normal",
                                                }}
                                              >
                                                Please Enter The Address Line 2.
                                              </span>
                                            </div>
                                            <div className="booking-field booking-name">
                                              <label>
                                                City
                                                <span className="mandatory-star">
                                                  {FlightType ===
                                                    "International" && "*"}
                                                </span>
                                              </label>
                                              <input
                                                type="text"
                                                name="adult_city[]"
                                                data-index={formIndex}
                                                onKeyPress={handleKeyPress}
                                              // readOnly={bookingid}
                                              // defaultValue={
                                              //     emptaxivaxi?.[passengerindex]?.people_name
                                              //         ? (emptaxivaxi[passengerindex].people_name.trim().includes(' ')
                                              //             ? emptaxivaxi[passengerindex].people_name.trim().split(' ').pop()
                                              //             : emptaxivaxi[passengerindex].people_name.trim()) // If only one word, use the same for last name
                                              //         : ''
                                              // }
                                              // defaultValue={
                                              //     emptaxivaxi?.[passengerindex]?.people_name
                                              //         ? emptaxivaxi[passengerindex].people_name.trim().split(' ').pop()
                                              //         : ''
                                              // }
                                              />
                                              <span
                                                className="error-message adult_city-message"
                                                style={{
                                                  display: "none",
                                                  color: "red",
                                                  fontWeight: "normal",
                                                }}
                                              >
                                                Please Enter The City Name.
                                              </span>
                                            </div>
                                          </div>
                                        )}
                                        {FlightType === "International" && (
                                          <div className="booking-row mb-0">
                                            <div className="booking-field booking-name">
                                              <label>
                                                Passport No.
                                                <span className="mandatory-star">
                                                  *
                                                </span>
                                              </label>
                                              <input
                                                type="text"
                                                name="adult_passportNo[]"
                                                // onKeyPress={handleKeyPress}
                                                data-index={formIndex}
                                              // readOnly={bookingid}
                                              // defaultValue={
                                              //     TaxivaxiPassengeDetails?.[formIndex]?.people_name
                                              //         ? (TaxivaxiPassengeDetails[formIndex].people_name.trim().includes(' ')
                                              //             ? TaxivaxiPassengeDetails[formIndex].people_name.trim().split(' ').pop()
                                              //             : TaxivaxiPassengeDetails[formIndex].people_name.trim()) // If only one word, use the same for last name
                                              //         : ''
                                              // }
                                              // defaultValue={
                                              //     TaxivaxiPassengeDetails?.[formIndex]?.people_name
                                              //         ? TaxivaxiPassengeDetails[formIndex].people_name.trim().split(' ').pop()
                                              //         : ''
                                              // }
                                              />
                                              <div
                                                className="error-message adult_passportNo-message"
                                                style={{
                                                  color: "red",
                                                  display: "none",
                                                }}
                                              ></div>
                                            </div>
                                            <div className="booking-field booking-gender">
                                              <label>
                                                Issued Country
                                                <span className="mandatory-star">
                                                  *
                                                </span>
                                              </label>

                                              <Select
                                                name="adult_issuedcountry[]"
                                                options={Countrydata}
                                                placeholder="Select a country"
                                                className="country-select"
                                                classNamePrefix="react-select"
                                                isSearchable
                                                onChange={(selectedOption) => {
                                                  // Update state...
                                                  const error =
                                                    document.querySelector(
                                                      ".adult_issuedcountry-message"
                                                    );
                                                  if (selectedOption)
                                                    error.style.display =
                                                      "none";
                                                }}
                                                styles={{
                                                  control: (provided) => ({
                                                    ...provided,
                                                    height: "36px",
                                                    minHeight: "36px",
                                                    fontSize: "13px",
                                                  }),
                                                  valueContainer: (
                                                    provided
                                                  ) => ({
                                                    ...provided,
                                                    height: "36px",
                                                    paddingTop: 0,
                                                    paddingBottom: 0,
                                                    display: "flex",
                                                    alignItems: "center",
                                                  }),
                                                  input: (provided) => ({
                                                    ...provided,
                                                    margin: 0,
                                                    padding: 0,
                                                    fontSize: "13px",
                                                  }),
                                                  singleValue: (provided) => ({
                                                    ...provided,
                                                    fontSize: "13px",
                                                  }),
                                                  option: (
                                                    provided,
                                                    state
                                                  ) => ({
                                                    ...provided,
                                                    fontSize: "13px",
                                                    paddingTop: 6,
                                                    paddingBottom: 6,
                                                  }),
                                                  menu: (provided) => ({
                                                    ...provided,
                                                    fontSize: "13px",
                                                  }),
                                                  placeholder: (provided) => ({
                                                    ...provided,
                                                    fontSize: "13px",
                                                  }),
                                                }}
                                              />
                                              <div
                                                className="error-message adult_issuedcountry-message"
                                                style={{
                                                  color: "red",
                                                  display: "none",
                                                }}
                                              ></div>
                                            </div>
                                            <div className="booking-field booking-gender">
                                              <label>
                                                Passport Expiry
                                                <span className="mandatory-star">
                                                  *
                                                </span>
                                              </label>
                                              <div
                                                className="form-calendar"
                                                style={{ width: "98%" }}
                                              >
                                                <input
                                                  type="date"
                                                  name="adult_passportexpiry[]"
                                                  min={maxDate}
                                                  data-index={formIndex}
                                                // readOnly={bookingid}
                                                // defaultValue={
                                                //     TaxivaxiPassengeDetails &&
                                                //         TaxivaxiPassengeDetails[formIndex] &&
                                                //         TaxivaxiPassengeDetails[passengerindex]['date_of_birth']
                                                //         ? TaxivaxiPassengeDetails[passengerindex]['date_of_birth']
                                                //         : new Date(new Date().setFullYear(new Date().getFullYear() - 99))
                                                //             .toISOString()
                                                //             .split("T")[0] // Converts to YYYY-MM-DD format
                                                // }
                                                />
                                                <div
                                                  className="error-message adult_passportexpiry-message"
                                                  style={{
                                                    color: "red",
                                                    display: "none",
                                                  }}
                                                ></div>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          gap: "5px",
                                          paddingTop: "10px",
                                        }}
                                      >
                                        <img
                                          src="/img/checkin_bag.svg"
                                          alt="Cabin Baggage"
                                          className="baggage-icon"
                                        />
                                        <span
                                          style={{
                                            color: "#000000",
                                            fontSize: "small",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          Frequent Flyer Number
                                        </span>
                                        <span
                                          style={{
                                            color: "#757575",
                                            fontSize: "small",
                                          }}
                                        >
                                          (Avail extra benefits & earn points)
                                        </span>
                                      </div>
                                      <div
                                        className="booking-row"
                                        style={{ marginTop: "10px" }}
                                      >
                                        <div className="booking-field booking-email">
                                          <label>Frequent Flyer Airline</label>
                                          <input
                                            type="text"
                                            name="flyername"
                                            // data-index={passengerindex}
                                            placeholder=""
                                          />
                                        </div>
                                        <div className="booking-field booking-email">
                                          <label>Frequent Flyer No</label>
                                          <input
                                            type="text"
                                            name="flyernumber"
                                            // data-index={passengerindex}
                                            placeholder=""
                                          />
                                        </div>
                                      </div>

                                      <div className="booking-form-append" />
                                      <hr />
                                    </div>
                                  ))}

                                  <div className="add-passenger">
                                    <button
                                      type="button"
                                      id="save-passenger-btn"
                                      className="passenger-submit"
                                      onClick={() => {
                                        handleSavePassenger();
                                      }}
                                    >
                                      Save Passenger
                                    </button>
                                  </div>
                                </div>
                              </AccordionDetails>
                              <AccordionActions></AccordionActions>
                            </Accordion>
                            <div className="booking-devider" />
                            <Accordion
                              defaultExpanded
                              expanded={accordion5Expanded}
                              onChange={(event, isExpanded) =>
                                setAccordion5Expanded(isExpanded)
                              }
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                className="accordion"
                              >
                                GST Details &nbsp;&nbsp;
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className="" id="">
                                  <div
                                    className="booking-form gstblock"
                                    style={{
                                      marginLeft: 5,
                                      marginRight: 5,
                                      marginBottom: 0,
                                    }}
                                  >
                                    <div className="booking-form-i booking-form-i3">
                                      <label>
                                        GSTIN
                                        <span className="mandatory-star">
                                          *
                                        </span>
                                      </label>
                                      <div className="input">
                                        <input
                                          type="text"
                                          name="gstin"
                                          placeholder=""
                                          defaultValue={GstEntries.gstin}
                                          // onChange={(e) => setGstRegistrationNo(e.target.value)}
                                          // onKeyPress={handleGstKeyPress}
                                          onChange={(e) =>
                                            setGstForm({
                                              ...gstForm,
                                              gstin: e.target.value,
                                            })
                                          }
                                        />
                                        {errors.gstin && (
                                          <div
                                            className="error-message"
                                            style={{ color: "red" }}
                                          >
                                            {errors.gstin}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="booking-form-i booking-form-i3">
                                      <label>
                                        Name
                                        <span className="mandatory-star">
                                          *
                                        </span>
                                      </label>
                                      <div className="input">
                                        <input
                                          type="text"
                                          name="company_name"
                                          defaultValue={GstEntries.company_name}
                                          onChange={(e) =>
                                            setGstForm({
                                              ...gstForm,
                                              name: e.target.value,
                                            })
                                          }
                                          placeholder=""
                                        />
                                        <div
                                          className="error-message company_name-message"
                                          style={{ color: "red" }}
                                        >
                                          Please enter Name.
                                        </div>
                                      </div>
                                    </div>

                                    <div className="booking-form-i booking-form-i3">
                                      <label>
                                        GST Address
                                        <span className="mandatory-star">
                                          *
                                        </span>
                                      </label>
                                      <div className="input">
                                        <input
                                          type="text"
                                          name="company_address"
                                          defaultValue={
                                            GstEntries.company_address
                                          }
                                          onChange={(e) =>
                                            setGstForm({
                                              ...gstForm,
                                              company_address: e.target.value,
                                            })
                                          }
                                          placeholder=""
                                        />
                                        <div
                                          className="error-message company_address-message"
                                          style={{ color: "red" }}
                                        >
                                          {" "}
                                          Please enter GST Address.
                                        </div>
                                      </div>
                                    </div>

                                    <div className="booking-form-i booking-form-i3">
                                      <label>
                                        GST Contact
                                        <span className="mandatory-star">
                                          *
                                        </span>
                                      </label>
                                      <div className="input">
                                        <input
                                          type="text"
                                          name="company_contact"
                                          defaultValue={
                                            GstEntries.company_contact
                                          }
                                          onChange={(e) =>
                                            setGstForm({
                                              ...gstForm,
                                              company_contact: e.target.value,
                                            })
                                          }
                                          placeholder=""
                                        />
                                        {errors.company_contact && (
                                          <div
                                            className="error-message"
                                            style={{ color: "red" }}
                                          >
                                            {errors.company_contact}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="add-passenger">
                                    <button
                                      type="button"
                                      id="save-passenger-btn"
                                      className="passenger-submit"
                                      onClick={() => {
                                        SaveGstDetails();
                                        setAccordion2Expanded(true);
                                        setAccordion5Expanded(false);
                                      }} // Invoke the validation function on button click
                                    >
                                      Save Details
                                    </button>
                                  </div>
                                </div>
                              </AccordionDetails>
                              <AccordionActions></AccordionActions>
                            </Accordion>
                            <div className="booking-devider" />
                            <Accordion
                              expanded={accordion2Expanded}
                              onChange={(event, isExpanded) =>
                                setAccordion2Expanded(isExpanded)
                              }
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2-content"
                                id="panel2-header"
                                className="accordion"
                              >
                                Contact details
                              </AccordionSummary>
                              <AccordionDetails>
                                <div className="" id="">
                                  <div
                                    className="booking-form"
                                    style={{
                                      marginLeft: 5,
                                      marginRight: 5,
                                      marginBottom: 0,
                                    }}
                                  >
                                    <div className="booking-form-i booking-form-i2">
                                      <label>Email ID</label>
                                      <div className="input">
                                        <input
                                          type="email"
                                          name="email"
                                          placeholder=""
                                          readOnly={bookingid}
                                          defaultValue="flight@cotrav.co"
                                        />
                                      </div>
                                      <span
                                        className="error-message email-message"
                                        style={{
                                          display: "none",
                                          color: "red",
                                          fontWeight: "normal",
                                        }}
                                      >
                                        Please enter Email ID.
                                      </span>
                                    </div>
                                    <div className="booking-form-i booking-form-i2">
                                      <label>Mobile Number</label>
                                      <div className="input">
                                        <input
                                          type="text"
                                          name="contact_details"
                                          onKeyPress={handleNumberPress}
                                          maxLength={10}
                                          minLength={10}
                                          placeholder=""
                                          // readOnly={bookingid}
                                          // defaultValue={TaxivaxiPassengeDetails && TaxivaxiPassengeDetails[0] && TaxivaxiPassengeDetails[0]['people_contact'] &&
                                          //     TaxivaxiPassengeDetails[0]['people_contact']
                                          // }
                                          defaultValue={
                                            TaxivaxiPassengeDetails?.[0]
                                              ?.employee_contact || ""
                                          }
                                        />
                                      </div>
                                      <span
                                        className="error-message contact_details-message"
                                        style={{
                                          display: "none",
                                          color: "red",
                                          fontWeight: "normal",
                                        }}
                                      >
                                        Please enter Mobile Number.
                                      </span>
                                    </div>
                                  </div>

                                  <div className="booking-form-append" />
                                  <div className="add-passenger">
                                    {showModal && (
                                      <div
                                        className="modal fade show d-block bd-example-modal-md multipleflight"
                                        tabIndex={-1}
                                        role="dialog"
                                        aria-labelledby="myLargeModalLabel"
                                        aria-modal="true"
                                        style={{
                                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                                        }}
                                      >
                                        <div className="modal-dialog modal-md">
                                          <div
                                            className="modal-content rounded-md px-4 py-2"
                                            style={{
                                              maxWidth: "605px",
                                              margin: "auto",
                                            }}
                                          >
                                            <div className="flex border-0 pb-2">
                                              <h5
                                                className="text-center modal-title text-lg text-gray-600 font-semibold mx-auto"
                                                id="exampleModalLabel"
                                              >
                                                Review Details
                                              </h5>
                                            </div>
                                            <div
                                              className="review-details"
                                              style={{
                                                fontSize: "11px",
                                                fontFamily: "Montserrat",
                                                textAlign: "left",
                                              }}
                                            >
                                              Please ensure that the spelling of
                                              your name and other details match
                                              with your travel document/govt.
                                              ID, as these cannot be changed
                                              later. Errors might lead to
                                              cancellation penalties.
                                            </div>
                                            <br />
                                            <div className="modal-body pt-0">
                                              <div className="row flex flex-col gap-2">
                                                {PassengerData.map(
                                                  (passenger, index) => (
                                                    <div
                                                      key={index}
                                                      className=" border-b border-gray-300 p-2 text-sm text-gray-600"
                                                    >
                                                      <div
                                                        className="font-bold text-sm mb-2"
                                                        style={{
                                                          color: "black",
                                                        }}
                                                      >
                                                        Passenger {index + 1}
                                                      </div>
                                                      <div
                                                        style={{
                                                          display: "flex",
                                                          gap: "50px",
                                                        }}
                                                      >
                                                        <div
                                                          style={{
                                                            width: "100px",
                                                            fontWeight: "600",
                                                          }}
                                                        >
                                                          Name:
                                                        </div>
                                                        <div
                                                          style={{
                                                            display: "flex-1",
                                                          }}
                                                        >
                                                          {passenger.firstName}{" "}
                                                          {passenger.lastName}{" "}
                                                          {passenger.gender ===
                                                            "F"
                                                            ? "(Female)"
                                                            : "(Male)"}
                                                        </div>
                                                      </div>
                                                      <div
                                                        style={{
                                                          display: "flex",
                                                          gap: "50px",
                                                        }}
                                                      >
                                                        <div
                                                          style={{
                                                            width: "100px",
                                                            fontWeight: "600",
                                                          }}
                                                        >
                                                          Email:
                                                        </div>
                                                        <div
                                                          style={{
                                                            display: "flex-1",
                                                          }}
                                                        >
                                                          {passenger.email}
                                                        </div>
                                                      </div>
                                                      <div
                                                        style={{
                                                          display: "flex",
                                                          gap: "50px",
                                                        }}
                                                      >
                                                        <div
                                                          style={{
                                                            width: "100px",
                                                            fontWeight: "600",
                                                          }}
                                                        >
                                                          Contact No:
                                                        </div>
                                                        <div
                                                          style={{
                                                            display: "flex-1",
                                                          }}
                                                        >
                                                          {passenger.contact}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                            <div className="flex justify-center gap-4 mt-1 pb-2">
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  setShowModal(false)
                                                }
                                                className="bg-black text-white px-3 py-2 rounded font-semibold"
                                              >
                                                Edit
                                              </button>
                                              <button
                                                type="button"
                                                onClick={SeatFetch}
                                                className="bg-violet-500 hover:bg-violet-600 text-white px-5 py-2 rounded font-semibold"
                                              >
                                                Confirm
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    <button
                                      type="button"
                                      className="save_details"
                                      onClick={() => {
                                        setShowModal(true);
                                      }}
                                    >
                                      Save Details
                                    </button>
                                  </div>
                                </div>
                              </AccordionDetails>
                              <AccordionActions></AccordionActions>
                            </Accordion>

                            <div className="booking-devider" />
                          </div>
                        </form>
                        <Accordion
                          expanded={accordion4Expanded}
                          onChange={(event, isExpanded) => {
                            const hasUapiOnwardMultiple =
                              UapiOnwardOptionalservice?.[0]?.Segment?.length >
                              1;

                            const hasUapiOnwardBaggage =
                              UapiOnwardOptionalservice?.[0]?.Segment?.[0]
                                ?.OptionalServices?.Baggage ||
                              UapiOnwardOptionalservice?.[0]?.Baggage;

                            const hasTboOnwardBaggage =
                              Array.isArray(TboOnwardBaggageservice) &&
                              TboOnwardBaggageservice.length > 0;

                            const hasTboReturnBaggage =
                              Array.isArray(TboReturnBaggageservice) &&
                              TboReturnBaggageservice.length > 0;
                            const hasAnyBaggage =
                              hasUapiOnwardMultiple ||
                              hasUapiOnwardBaggage ||
                              hasTboOnwardBaggage ||
                              hasTboReturnBaggage;

                            if (hasAnyBaggage) {
                              setAccordion4Expanded(isExpanded);
                              if (isExpanded) {
                                setSelectedPassengerIndex(0);
                              }
                            }
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                            className={`accordion`}
                          >
                            <div className="flex items-center gap-2">
                              <span>extra baggage</span>
                              {selectedBaggage.onward.length > 0 ||
                                selectedBaggage.return.length > 0 ? (
                                <>
                                  <span className="text-sm text-gray-500">
                                    &nbsp; (
                                    {selectedBaggage.onward.length +
                                      selectedBaggage.return.length}{" "}
                                    Selected )
                                  </span>

                                  <Tooltip
                                    title={
                                      <div className="text-sm p-2 space-y-2">
                                        {/* Onward baggage list */}
                                        {selectedBaggage.onward.length > 0 && (
                                          <div>
                                            <div className="font-semibold mb-1">
                                              Onward
                                            </div>
                                            {selectedBaggage.onward.map(
                                              (b, index) => (
                                                <div
                                                  key={`onward-${index}`}
                                                  className="flex justify-between items-center gap-4"
                                                >
                                                  <div>
                                                    {b.source_type === "Uapi"
                                                      ? b.baggage.DisplayText
                                                      : `Baggage, ${b.baggage.Weight ||
                                                      b.baggage.Description
                                                      } kg `}
                                                  </div>
                                                  <div>
                                                    {b.source_type === "Uapi"
                                                      ? replaceINRWithSymbol(
                                                        b.baggage.TotalPrice
                                                      )
                                                      : `₹${b.baggage.Price}`}
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        )}

                                        {/* Return baggage list */}
                                        {selectedBaggage.return.length > 0 && (
                                          <div>
                                            <div className="font-semibold mb-1">
                                              Return
                                            </div>
                                            {selectedBaggage.return.map(
                                              (b, index) => (
                                                <div
                                                  key={`return-${index}`}
                                                  className="flex justify-between items-center gap-4"
                                                >
                                                  <div>
                                                    {b.source_type === "Uapi"
                                                      ? b.baggage.DisplayText
                                                      : `Baggage,${b.baggage.Weight ||
                                                      b.baggage.Description
                                                      } kg`}
                                                  </div>
                                                  <div>
                                                    {b.source_type === "Uapi"
                                                      ? replaceINRWithSymbol(
                                                        b.baggage.TotalPrice
                                                      )
                                                      : `₹${b.baggage.Price}`}
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    }
                                    arrow
                                  >
                                    <IconButton size="small">
                                      <InfoOutlinedIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              ) : null}
                            </div>
                          </AccordionSummary>
                          <AccordionDetails className="flex gap-6">
                            {/* LEFT SIDE PASSENGER LIST */}
                            <div className="w-1/4 border-r pr-4 flex flex-col gap-3">
                              {PassengerData.filter(
                                (passenger) => passenger.type !== "Infant"
                              ).map((passenger, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  className={`p-3 rounded-lg border text-left ${index === selectedPassengerIndex
                                      ? "border-violet-500 bg-violet-50"
                                      : "border-gray-300"
                                    } text-gray-700`}
                                  onClick={() => {
                                    setSelectedPassengerIndex(index);
                                    setSelectedPassengerKey(passenger.Key);
                                  }}
                                >
                                  {passenger.firstName} {passenger.lastName}
                                  <br />
                                  <span className="text-xs text-gray-500">
                                    {selectedBaggage[selectedSegmentType]
                                      ?.filter(
                                        (b) =>
                                          b.segmentKey === selectedSegmentKey &&
                                          (b.passengerKey === passenger.Key ||
                                            b.passengerIndex === index)
                                      )
                                      ?.map((b) => {
                                        if (b.source_type === "Uapi") {
                                          return `${b.baggage.DisplayText} x${b.quantity}`;
                                        } else if (b.source_type === "Tbo") {
                                          const weight =
                                            b.baggage.Weight ||
                                            b.baggage.Description ||
                                            "";
                                          return `Extra Baggage${weight}KG x${b.quantity}`;
                                        }
                                        return "";
                                      })
                                      .join(", ") || "Not Selected"}
                                  </span>
                                </button>
                              ))}
                            </div>

                            <div className="w-3/4">
                              {/* --- Tabs --- */}
                              <div className="flex gap-1 mb-4 justify-center">
                                <button
                                  className={`px-4 py-2 border ${selectedSegmentType === "onward"
                                      ? "border-violet-500 bg-violet-100 text-violet-600"
                                      : "border-gray-300"
                                    }`}
                                  onClick={() => {
                                    setSelectedSegmentType("onward");
                                    setSelectedPassengerIndex(0);
                                  }}
                                >
                                  {
                                    FlightData?.Origin?.OriginAirport?.Airport
                                      ?.CityName
                                  }{" "}
                                  →{" "}
                                  {
                                    FlightData?.Destination?.DestinationAirport
                                      ?.Airport?.CityName
                                  }
                                </button>
                                <button
                                  className={`px-4 py-2 border ${selectedSegmentType === "return"
                                      ? "border-violet-500 bg-violet-100 text-violet-600"
                                      : "border-gray-300"
                                    }`}
                                  onClick={() => {
                                    setSelectedSegmentType("return");
                                    setSelectedPassengerIndex(0);
                                  }}
                                >
                                  {
                                    ReturnFlightData?.Origin?.OriginAirport
                                      ?.Airport?.CityName
                                  }{" "}
                                  →{" "}
                                  {
                                    ReturnFlightData?.Destination
                                      ?.DestinationAirport?.Airport?.CityName
                                  }
                                </button>
                              </div>

                              {/* --- Baggage list --- */}
                              <div className="flex flex-col h-[400px] overflow-y-auto">
                                {(selectedSegmentType === "onward" &&
                                  OnwardSourceType === "Uapi") ||
                                  (selectedSegmentType === "return" &&
                                    ReturnSourceType === "Uapi")
                                  ? // ---------- UAPI BAGGAGE ----------
                                  (() => {
                                    const serviceSource =
                                      selectedSegmentType === "onward"
                                        ? UapiOnwardOptionalservice?.find(
                                          (service) =>
                                            service.Key ===
                                            selectedPassengerKey
                                        )
                                        : UapiReturnOptionalservice?.find(
                                          (service) =>
                                            service.Key ===
                                            selectedPassengerKey
                                        );

                                    const segmentData =
                                      serviceSource?.["Segment"]?.[
                                      selectedSegmentKey
                                      ];
                                    const baggage = [];

                                    if (serviceSource?.Segment?.length > 1) {
                                      baggage.push(serviceSource?.Baggage);
                                    } else {
                                      baggage.push(
                                        segmentData?.OptionalServices?.Baggage
                                      );
                                    }

                                    const modBag = baggage[0];
                                    if (modBag != undefined) {
                                      return modBag.map((Baggage, idx) => {
                                        const currentSelected = (
                                          selectedBaggage[
                                          selectedSegmentType
                                          ] || []
                                        ).find(
                                          (b) =>
                                            b.passengerKey ===
                                            selectedPassengerKey &&
                                            b.segmentKey ===
                                            selectedSegmentKey &&
                                            b.segmentType ===
                                            selectedSegmentType &&
                                            b.baggageIndex === idx
                                        );
                                        const quantity =
                                          currentSelected?.quantity ?? 0;

                                        return (
                                          <div
                                            key={idx}
                                            className="baggage-container flex items-center justify-between border rounded-xl p-4 my-2 shadow-sm"
                                          >
                                            <div className="flex items-center gap-4">
                                              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                                <img
                                                  src="/img/checkin_bag.svg"
                                                  alt="Baggage Icon"
                                                  className="w-6 h-6"
                                                />
                                              </div>
                                              <div>
                                                <div className="font-semibold text-sm">
                                                  {Baggage?.DisplayText}
                                                </div>
                                              </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                              <div className="text-sm font-semibold text-black">
                                                {replaceINRWithSymbol(
                                                  Baggage?.TotalPrice
                                                )}
                                              </div>
                                              <div className="flex items-center gap-2 baggageoptionbuttons">
                                                {quantity === 0 ? (
                                                  <button
                                                    type="button"
                                                    className="px-4 py-1 text-sm border rounded-full text-purple-600 border-purple-600"
                                                    onClick={() =>
                                                      handleAddBaggage(
                                                        idx,
                                                        Baggage,
                                                        selectedSegmentType,
                                                        selectedPassengerKey,
                                                        "Uapi"
                                                      )
                                                    }
                                                  >
                                                    Add
                                                  </button>
                                                ) : (
                                                  <>
                                                    <button
                                                      type="button"
                                                      className="px-2 py-1 text-sm border rounded-full text-purple-600 border-purple-600"
                                                      onClick={() =>
                                                        handleRemoveBaggage(
                                                          idx,
                                                          selectedSegmentType,
                                                          selectedPassengerKey,
                                                          "Uapi"
                                                        )
                                                      }
                                                    >
                                                      -
                                                    </button>
                                                    <span className="w-5 text-center">
                                                      {quantity}
                                                    </span>
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      });
                                    }
                                  })()
                                  : // ---------- TBO BAGGAGE ----------
                                  (() => {
                                    const baggageDataSource =
                                      selectedSegmentType === "onward"
                                        ? TboOnwardBaggageservice
                                        : TboReturnBaggageservice;

                                    return baggageDataSource?.map(
                                      (data, baggageIndex) => {
                                        const currentBaggage =
                                          selectedBaggage[
                                            selectedSegmentType
                                          ].find(
                                            (b) =>
                                              b.passengerIndex ===
                                              selectedPassengerIndex &&
                                              b.segmentKey ===
                                              selectedSegmentKey &&
                                              b.baggageIndex === baggageIndex
                                          );
                                        const quantity =
                                          currentBaggage?.quantity || 0;

                                        return (
                                          <div
                                            key={baggageIndex}
                                            className="baggage-container flex items-center justify-between border rounded-xl p-4 my-2 shadow-sm"
                                          >
                                            <div className="flex items-center gap-4">
                                              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                                <img
                                                  src="/img/checkin_bag.svg"
                                                  alt="Baggage Icon"
                                                  className="w-6 h-6"
                                                />
                                              </div>
                                              <div>
                                                <div className="font-semibold text-sm">
                                                  Extra Baggage {data.Weight}
                                                  &nbsp;KG
                                                </div>
                                              </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                              <div className="text-sm font-semibold text-black">
                                                ₹{data.Price}
                                              </div>
                                              <div className="flex items-center gap-2 baggageoptionbuttons">
                                                {quantity === 0 ? (
                                                  <button
                                                    type="button"
                                                    className="px-4 py-1 text-sm border rounded-full text-purple-600 border-purple-600"
                                                    onClick={() => {
                                                      handleAddBaggage(
                                                        baggageIndex,
                                                        data,
                                                        selectedSegmentType,
                                                        selectedPassengerKey,
                                                        "Tbo"
                                                      );
                                                      setSelectedPassengerIndex(
                                                        0
                                                      );
                                                    }}
                                                  >
                                                    Add
                                                  </button>
                                                ) : (
                                                  <>
                                                    <button
                                                      type="button"
                                                      className="px-2 py-1 text-sm border rounded-full text-purple-600 border-purple-600"
                                                      onClick={() =>
                                                        handleRemoveBaggage(
                                                          baggageIndex,
                                                          selectedSegmentType,
                                                          selectedPassengerKey,
                                                          "Tbo"
                                                        )
                                                      }
                                                    >
                                                      -
                                                    </button>
                                                    <span className="w-5 text-center">
                                                      1
                                                    </span>
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      }
                                    );
                                  })()}
                              </div>
                              <div className="baggagebutton">
                                <button
                                  type="button"
                                  onClick={handlebaggagebuttonskip}
                                  className="baggagebuttonskip"
                                  style={{ marginRight: "4px" }}
                                >
                                  Skip
                                </button>

                                <button
                                  type="button"
                                  onClick={handlebaggagebuttonskip}
                                  className="baggagebuttonskip"
                                >
                                  continue
                                </button>
                              </div>
                            </div>
                          </AccordionDetails>
                          <AccordionActions></AccordionActions>
                        </Accordion>
                        <div className="booking-devider" />
                        <Accordion
                          expanded={accordion6Expanded}
                          // onChange={(event, isExpanded) => {
                          //     if (UapiOnwardOptionalservice[0]?.Segment[0]?.OptionalServices?.MealOrBeverage) {
                          //         setAccordion6Expanded(isExpanded);
                          //         if (isExpanded) {
                          //             setSelectedPassengerIndex(0);
                          //         }
                          //     }
                          // }}
                          onChange={(event, isExpanded) => {
                            const hasUapiReturnMeal =
                              UapiReturnOptionalservice?.[0]?.Segment?.[0]
                                ?.OptionalServices?.MealOrBeverage ||
                              UapiReturnOptionalservice?.[0]?.MealOrBeverage;

                            const hasUapiOnwardMeal =
                              UapiOnwardOptionalservice?.[0]?.Segment?.[0]
                                ?.OptionalServices?.MealOrBeverage ||
                              UapiOnwardOptionalservice?.[0]?.MealOrBeverage;

                            const hasTboOnwardMeal =
                              Array.isArray(TboOnwardMealservice) &&
                              TboOnwardMealservice.length > 0;

                            const hasTboReturnMeal =
                              Array.isArray(TboReturnMealservice) &&
                              TboReturnMealservice.length > 0;
                            const hasAnyBaggage =
                              hasUapiReturnMeal ||
                              hasUapiOnwardMeal ||
                              hasTboOnwardMeal ||
                              hasTboReturnMeal;

                            if (hasAnyBaggage) {
                              setAccordion6Expanded(isExpanded);
                              if (isExpanded) {
                                setSelectedPassengerIndex(0);
                              }
                            }
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                            className="accordion"
                          >
                            <div className="flex items-center gap-2">
                              <span>Meal Or Beverage</span>

                              {selectedMeals.onward.length +
                                selectedMeals.return.length >
                                0 ? (
                                <>
                                  <span className="text-sm text-gray-500">
                                    &nbsp; (
                                    {selectedMeals.onward.length +
                                      selectedMeals.return.length}{" "}
                                    Selected)
                                  </span>
                                  <Tooltip
                                    title={
                                      <div className="text-sm p-2">
                                        {/* Onward meals */}
                                        {selectedMeals.onward.length > 0 && (
                                          <div>
                                            <div className="font-semibold mb-1">
                                              Onward
                                            </div>
                                            {selectedMeals.onward.map(
                                              (meal, index) => (
                                                <div
                                                  key={`onward-${index}`}
                                                  className="flex justify-between items-center gap-4 text-sx"
                                                >
                                                  <div>
                                                    {meal.sourcetype === "Uapi"
                                                      ? meal.meal.DisplayText
                                                      : meal.meal
                                                        .AirlineDescription}
                                                  </div>
                                                  <div>
                                                    {meal.sourcetype === "Uapi"
                                                      ? replaceINRWithSymbol(
                                                        meal.meal.TotalPrice
                                                      )
                                                      : `₹ ${meal.meal.Price}`}
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        )}

                                        {/* Return meals */}

                                        {selectedMeals.return.length > 0 && (
                                          <div>
                                            <div className="font-semibold mt-2 mb-1">
                                              Return
                                            </div>
                                            {selectedMeals.return.map(
                                              (meal, index) => (
                                                <div
                                                  key={`return-${index}`}
                                                  className="flex justify-between items-center gap-4 text-sx"
                                                >
                                                  <div>
                                                    {meal.sourcetype === "Uapi"
                                                      ? meal.meal.DisplayText
                                                      : meal.meal
                                                        .AirlineDescription}
                                                  </div>
                                                  <div>
                                                    {meal.sourcetype === "Uapi"
                                                      ? replaceINRWithSymbol(
                                                        meal.meal.TotalPrice
                                                      )
                                                      : `₹ ${meal.meal.Price}`}
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    }
                                    arrow
                                  >
                                    <IconButton size="small">
                                      <InfoOutlinedIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              ) : null}
                            </div>
                          </AccordionSummary>

                          <AccordionDetails className="flex gap-6">
                            <div className="w-1/4 border-r pr-4 flex flex-col gap-3">
                              {(selectedSegmentType === "onward" &&
                                OnwardSourceType === "Uapi") ||
                                (selectedSegmentType === "return" &&
                                  ReturnSourceType === "Uapi")
                                ? PassengerData.filter(
                                  (passenger) => passenger.type !== "Infant"
                                ) // Adjust key if needed
                                  .map((passenger, index) => {
                                    const Optionalservice =
                                      selectedSegmentType === "onward"
                                        ? UapiOnwardOptionalservice
                                        : UapiReturnOptionalservice;
                                    const passengerService =
                                      Optionalservice?.find(
                                        (service) =>
                                          service.Key === selectedPassengerKey
                                      );
                                    const segmentIndex = selectedSegmentKey;
                                    const segmentData =
                                      passengerService?.["Segment"]?.[
                                      segmentIndex
                                      ];
                                    const segmentKey = segmentData?.Key;
                                    const passengerMeal = selectedMeals[
                                      selectedSegmentType
                                    ].find(
                                      (m) =>
                                        m.passengerIndex === index &&
                                        m.segmentKey === segmentKey
                                    );
                                    // //console.log(selectedMeals)
                                    return (
                                      <button
                                        key={index}
                                        type="button"
                                        className={`p-3 rounded-lg border text-left ${index === selectedPassengerIndex
                                            ? "border-violet-500 bg-violet-50"
                                            : "border-gray-300"
                                          } text-gray-700`}
                                        onClick={() => {
                                          setSelectedPassengerIndex(index);
                                          setSelectedPassengerKey(
                                            passenger.Key
                                          );
                                        }}
                                      >
                                        {passenger.firstName}{" "}
                                        {passenger.lastName}
                                        <br />
                                        <span className="text-xs text-gray-500">
                                          {passengerMeal
                                            ? `Selected: ${passengerMeal.meal
                                              .DisplayText || "No Meal"
                                            }`
                                            : "Meal: Not Selected"}
                                        </span>
                                      </button>
                                    );
                                  })
                                : PassengerData.filter(
                                  (passenger) => passenger.type !== "Infant"
                                ).map((passenger, index) => {
                                  const passengerMeal = selectedMeals[
                                    selectedSegmentType
                                  ].find(
                                    (m) =>
                                      m.passengerIndex === index &&
                                      m.segmentKey === selectedSegmentKey
                                  );
                                  // console.log(
                                  //   "Seleected meals",
                                  //   selectedMeals
                                  // );
                                  return (
                                    <button
                                      key={index}
                                      type="button"
                                      className={`p-3 rounded-lg border text-left ${index === selectedPassengerIndex
                                          ? "border-violet-500 bg-violet-50"
                                          : "border-gray-300"
                                        } text-gray-700`}
                                      onClick={() =>
                                        setSelectedPassengerIndex(index)
                                      }
                                    >
                                      {passenger.firstName}{" "}
                                      {passenger.lastName}
                                      <br />
                                      <span className="text-xs text-gray-500">
                                        {passengerMeal
                                          ? `Selected: ${passengerMeal.meal
                                            .AirlineDescription ||
                                          "No Meal"
                                          }`
                                          : "Meal: Not Selected"}
                                      </span>
                                    </button>
                                  );
                                })}
                            </div>

                            <div className="w-3/4">
                              <div className="flex gap-1 mb-4 justify-center">
                                <button
                                  className={`px-4 py-2 border ${selectedSegmentType === "onward"
                                      ? "border-violet-500 bg-violet-100 text-violet-600"
                                      : "border-gray-300"
                                    }`}
                                  onClick={() => {
                                    setSelectedSegmentType("onward");
                                    setSelectedPassengerIndex(0);
                                    if (
                                      UapiOnwardOptionalservice?.[0]?.Segment
                                        ?.length > 0
                                    ) {
                                      setSelectedSegmentKey(0);
                                    }
                                    // ✅ TBO onward
                                    else if (TboOnwardMealservice?.length > 0) {
                                      setSelectedSegmentKey(
                                        `${TboOnwardMealservice[0].Origin.airport_iata_code}-${TboOnwardMealservice[0].Destination.airport_iata_code}`
                                      );
                                    }
                                  }}
                                >
                                  {
                                    FlightData?.Origin?.OriginAirport?.Airport
                                      ?.CityName
                                  }{" "}
                                  →{" "}
                                  {
                                    FlightData?.Destination?.DestinationAirport
                                      ?.Airport?.CityName
                                  }
                                </button>
                                <button
                                  className={`px-4 py-2 border ${selectedSegmentType === "return"
                                      ? "border-violet-500 bg-violet-100 text-violet-600"
                                      : "border-gray-300"
                                    }`}
                                  onClick={() => {
                                    setSelectedSegmentType("return");
                                    setSelectedPassengerIndex(0);
                                    if (
                                      UapiReturnOptionalservice?.[0]?.Segment
                                        ?.length > 0
                                    ) {
                                      setSelectedSegmentKey(0);
                                    }
                                    // ✅ TBO return
                                    else if (TboReturnMealservice?.length > 0) {
                                      setSelectedSegmentKey(
                                        `${TboReturnMealservice[0].Origin.airport_iata_code}-${TboReturnMealservice[0].Destination.airport_iata_code}`
                                      );
                                    }
                                  }}
                                >
                                  {
                                    ReturnFlightData?.Origin?.OriginAirport
                                      ?.Airport?.CityName
                                  }{" "}
                                  →{" "}
                                  {
                                    ReturnFlightData?.Destination
                                      ?.DestinationAirport?.Airport?.CityName
                                  }
                                </button>
                              </div>
                              {(selectedSegmentType === "onward" &&
                                OnwardSourceType === "Uapi") ||
                                (selectedSegmentType === "return" &&
                                  ReturnSourceType === "Uapi") ? (
                                UapiOnwardOptionalservice?.length > 0 &&
                                UapiOnwardOptionalservice[0]?.Segment?.length >
                                0 && (
                                  <div className="mb-4">
                                    <Tabs
                                      value={selectedSegmentKey}
                                      onChange={handleTabChange}
                                      variant="scrollable"
                                    >
                                      {(selectedSegmentType === "onward"
                                        ? UapiOnwardOptionalservice?.[0]
                                          ?.Segment
                                        : UapiReturnOptionalservice?.[0]
                                          ?.Segment
                                      )?.map((segment, index) => {
                                        const origin =
                                          segment?.Origin
                                            ?.airport_municipality ||
                                          "Unknown Origin";
                                        const destination =
                                          segment?.Destination
                                            ?.airport_municipality ||
                                          "Unknown Destination";

                                        return (
                                          <Tab
                                            key={segment.Key}
                                            label={`${origin} → ${destination}`}
                                            value={index}
                                          />
                                        );
                                      })}
                                    </Tabs>
                                  </div>
                                )
                              ) : (
                                <Tabs
                                  value={selectedSegmentKey}
                                  onChange={handleTabChange}
                                  variant="scrollable"
                                  scrollButtons="auto"
                                >
                                  {Array.from(
                                    new Map(
                                      (selectedSegmentType === "onward"
                                        ? TboOnwardMealservice
                                        : TboReturnMealservice
                                      ).map((item) => [
                                        `${item.Origin.airport_municipality}-${item.Destination.airport_municipality}`,
                                        {
                                          key: `${item.Origin.airport_iata_code}-${item.Destination.airport_iata_code}`,
                                          label: `${item.Origin.airport_municipality} → ${item.Destination.airport_municipality}`,
                                        },
                                      ])
                                    ).values()
                                  ).map((segment) => (
                                    <Tab
                                      key={segment.key}
                                      label={segment.label}
                                      value={segment.key}
                                    />
                                  ))}
                                </Tabs>
                              )}

                              <div>
                                <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                                  {(selectedSegmentType === "onward" &&
                                    OnwardSourceType === "Uapi") ||
                                    (selectedSegmentType === "return" &&
                                      ReturnSourceType === "Uapi")
                                    ? (() => {
                                      const serviceSource =
                                        selectedSegmentType === "onward"
                                          ? UapiOnwardOptionalservice?.find(
                                            (service) =>
                                              service.Key ===
                                              selectedPassengerKey
                                          )
                                          : UapiReturnOptionalservice?.find(
                                            (service) =>
                                              service.Key ===
                                              selectedPassengerKey
                                          );

                                      const segmentData =
                                        serviceSource?.["Segment"]?.[
                                        selectedSegmentKey
                                        ];
                                      const segmentKey = segmentData?.Key;
                                      const meals =
                                        segmentData?.OptionalServices
                                          ?.MealOrBeverage || [];

                                      if (meals.length === 0) {
                                        return (
                                          <div className="flex items-center justify-between border rounded-2xl p-2 mb-3">
                                            <div className="flex items-center gap-2">
                                              Meals Not Available
                                            </div>
                                          </div>
                                        );
                                      }

                                      return meals.map((meal, idx) => {
                                        const isSelected = selectedMeals[
                                          selectedSegmentType
                                        ].some(
                                          (m) =>
                                            m.passengerIndex ===
                                            selectedPassengerIndex &&
                                            m.segmentKey === segmentKey &&
                                            m.meal.DisplayText ===
                                            meal.DisplayText
                                        );

                                        return (
                                          <div
                                            key={idx}
                                            className="flex items-center justify-between border rounded-2xl p-2 mb-3"
                                          >
                                            <div className="flex items-center gap-2">
                                              <div className="p-3 rounded-xl bg-violet-50">
                                                <img
                                                  src="/img/Meals-01.svg"
                                                  alt="Meal"
                                                  className="h-10 w-10"
                                                />
                                              </div>
                                              <div>
                                                <div className="text-sm font-medium">
                                                  {meal?.DisplayText ||
                                                    "Meal Option"}
                                                </div>
                                              </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                              <div className="font-semibold text-sm">
                                                {replaceINRWithSymbol(
                                                  meal?.TotalPrice
                                                ) || "0.00"}
                                              </div>

                                              <button
                                                type="button"
                                                className={`px-4 py-1 border rounded-xl text-sm ${isSelected
                                                    ? "text-white bg-violet-600 border-violet-600"
                                                    : "text-violet-600 border-violet-300"
                                                  }`}
                                                onClick={() => {
                                                  setSelectedMeals((prev) => {
                                                    const journeyType =
                                                      selectedSegmentType;
                                                    const filtered = prev[
                                                      journeyType
                                                    ].filter(
                                                      (m) =>
                                                        !(
                                                          m.passengerIndex ===
                                                          selectedPassengerIndex &&
                                                          m.segmentKey ===
                                                          segmentKey
                                                        )
                                                    );
                                                    return {
                                                      ...prev,
                                                      [journeyType]: [
                                                        ...filtered,
                                                        {
                                                          passengerIndex:
                                                            selectedPassengerIndex,
                                                          segmentKey:
                                                            segmentKey,
                                                          meal: meal,
                                                          sourcetype:
                                                            OnwardSourceType ||
                                                            ReturnSourceType,
                                                        },
                                                      ],
                                                    };
                                                  });
                                                }}
                                              >
                                                {isSelected ? "Added" : "Add"}
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      });
                                    })()
                                    : (() => {
                                      const mealSource =
                                        selectedSegmentType === "onward"
                                          ? TboOnwardMealservice
                                          : TboReturnMealservice;
                                      const segmentMeals =
                                        mealSource?.filter(
                                          (meal) =>
                                            `${meal.Meal.Origin}-${meal.Meal.Destination}` ===
                                            selectedSegmentKey
                                        ) || [];
                                      if (segmentMeals.length === 0) {
                                        return (
                                          <div className="flex items-center justify-between border rounded-2xl p-2 mb-3">
                                            <div className="flex items-center gap-2">
                                              Meals Not Available
                                            </div>
                                          </div>
                                        );
                                      }

                                      return segmentMeals.map((meal, idx) => {
                                        const isSelected = selectedMeals[
                                          selectedSegmentType
                                        ].some(
                                          (m) =>
                                            m.passengerIndex ===
                                            selectedPassengerIndex &&
                                            m.segmentKey ===
                                            selectedSegmentKey &&
                                            m.meal.Code === meal.Meal.Code
                                        );

                                        return (
                                          <div
                                            key={idx}
                                            className="flex  items-center justify-between border rounded-2xl p-2 mb-3"
                                          >
                                            {/* Meal Icon + Text */}
                                            <div className="flex items-center gap-2">
                                              <div className="p-3 rounded-xl bg-violet-50">
                                                <img
                                                  src="/img/Meals-01.svg"
                                                  alt="Meal"
                                                  className="h-10 w-10"
                                                />
                                              </div>
                                              <div>
                                                <div className="text-sm font-medium">
                                                  {meal.Meal
                                                    .AirlineDescription ||
                                                    "No Meal"}
                                                </div>
                                              </div>
                                            </div>

                                            {/* Price + Button */}
                                            <div className="flex items-center gap-6">
                                              <div className="font-semibold text-sm">
                                                ₹
                                                {meal.Meal.Price === "0"
                                                  ? "0"
                                                  : meal.Meal.Price}
                                              </div>

                                              <button
                                                type="button"
                                                className={`px-4 py-1 border rounded-xl text-sm ${isSelected
                                                    ? "text-white bg-violet-600 border-violet-600"
                                                    : "text-violet-600 border-violet-300"
                                                  }`}
                                                onClick={() => {
                                                  setSelectedMeals((prev) => {
                                                    const journeyType =
                                                      selectedSegmentType;

                                                    // remove old selection for same passenger & segment
                                                    const filtered = prev[
                                                      journeyType
                                                    ].filter(
                                                      (m) =>
                                                        !(
                                                          m.passengerIndex ===
                                                          selectedPassengerIndex &&
                                                          m.segmentKey ===
                                                          selectedSegmentKey
                                                        )
                                                    );

                                                    // add new selection
                                                    return {
                                                      ...prev,
                                                      [journeyType]: [
                                                        ...filtered,
                                                        {
                                                          passengerIndex:
                                                            selectedPassengerIndex,
                                                          segmentKey:
                                                            selectedSegmentKey,
                                                          meal: meal.Meal,
                                                          sourceType:
                                                            ReturnSourceType ||
                                                            OnwardSourceType,
                                                        },
                                                      ],
                                                    };
                                                  });
                                                }}
                                              >
                                                {isSelected ? "Added" : "Add"}
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      });
                                    })()}
                                </div>
                              </div>

                              <div className="add-passenger">
                                <button
                                  type="button"
                                  id="save-passenger-btn"
                                  className="passenger-submit"
                                  onClick={() => {
                                    const sourceType =
                                      (selectedSegmentType === "onward" &&
                                        OnwardSourceType === "Uapi") ||
                                        (selectedSegmentType === "return" &&
                                          ReturnSourceType === "Uapi")
                                        ? "Uapi"
                                        : "Tbo";

                                    setAccordion6Expanded(false);
                                    setAccordion3Expanded(true);
                                  }}
                                >
                                  Save Meal
                                </button>
                              </div>
                            </div>
                          </AccordionDetails>

                          <AccordionActions></AccordionActions>
                        </Accordion>

                        <form>
                          <div className="booking-devider" />

                          <Accordion
                            expanded={accordion3Expanded}
                            onChange={(event, isExpanded) => {
                              const hasUapiReturnseat = ReturnSeatData > 0;

                              const hasUapiOnwardseat = OnwardSeatData > 0;

                              const hasTboOnwardseat =
                                Array.isArray(TboOnwardSeatservice) &&
                                TboOnwardSeatservice.length > 0;

                              const hasTboReturnseat =
                                Array.isArray(TboReturnSeatservice) &&
                                TboReturnSeatservice.length > 0;
                              const hasAnyBaggage =
                                hasUapiReturnseat ||
                                hasUapiOnwardseat ||
                                hasTboOnwardseat ||
                                hasTboReturnseat;

                              if (hasAnyBaggage) {
                                setAccordion3Expanded(isExpanded);
                                if (isExpanded) {
                                  setSelectedPassengerIndex(0);
                                }
                              }
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel3-content"
                              id="panel3-header"
                              className={`accordion `}
                            >
                              <div className="flex items-center gap-2">
                                <span>Choose Seats</span>
                                {selectedSeats.onward.length +
                                  selectedSeats.return.length >
                                  0 ? (
                                  <>
                                    <span className="text-sm text-gray-500 ">
                                      &nbsp; (
                                      {selectedSeats.onward.length +
                                        selectedSeats.return.length}{" "}
                                      Selected)
                                    </span>
                                    <Tooltip
                                      title={
                                        <div className="text-sm p-2">
                                          {selectedSeats.onward.length > 0 && (
                                            <div>
                                              <div className="font-semibold mb-1">
                                                Onward
                                              </div>
                                              {selectedSeats.onward.map(
                                                (seat, index) => (
                                                  <div
                                                    key={`onward-${index}`}
                                                    className="flex justify-between items-center gap-4 text-sx"
                                                  >
                                                    <div>{seat.seatCode}</div>
                                                    <div>
                                                      {replaceINRWithSymbol(
                                                        seat.seatPrice
                                                      )}
                                                    </div>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          )}

                                          {selectedSeats.return.length > 0 && (
                                            <div>
                                              <div className="font-semibold mt-2 mb-1">
                                                Return
                                              </div>
                                              {selectedSeats.return.map(
                                                (seat, index) => (
                                                  <div
                                                    key={`return-${index}`}
                                                    className="flex justify-between items-center gap-4 text-sx"
                                                  >
                                                    <div>{seat.seatCode}</div>
                                                    <div>
                                                      {replaceINRWithSymbol(
                                                        seat.seatPrice
                                                      )}
                                                    </div>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      }
                                      arrow
                                    >
                                      <IconButton size="small">
                                        <InfoOutlinedIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                ) : null}
                              </div>
                            </AccordionSummary>
                            <AccordionDetails>
                              <div
                                className="panel"
                                id="panel2"
                                style={{ maxHeight: "450px" }}
                              >
                                <div className="seatleft">
                                  <div className="seatleftul">
                                    {(selectedSegmentType === "onward" &&
                                      OnwardSourceType === "Uapi") ||
                                      (selectedSegmentType === "return" &&
                                        ReturnSourceType === "Uapi")
                                      ? PassengerData.filter(
                                        (passenger) =>
                                          passenger.type !== "Infant"
                                      ) // Adjust key if needed
                                        .map((passenger, index) => {
                                          const SeatData =
                                            selectedSegmentType == "onward"
                                              ? OnwardSeatData
                                              : ReturnSeatData;
                                          const passengerService =
                                            SeatData?.find(
                                              (service) =>
                                                service.TravellerKey ===
                                                selectedPassengerKey
                                            );
                                          const segmentIndex =
                                            currentFlightIndex;
                                          const segmentData =
                                            passengerService?.Segments?.[
                                            segmentIndex
                                            ];
                                          const segmentkey = segmentData?.Key;
                                          const selectedSeat = selectedSeats[
                                            selectedSegmentType
                                          ].find(
                                            (m) =>
                                              m.passengerIndex === index &&
                                              m.segmentKey === segmentkey
                                          );
                                          // //console.log("Selcted setas", selectedSeats)
                                          return (
                                            <button
                                              key={index}
                                              type="button"
                                              className={`seatleftli tablinkseat ${selectedPassengerIndex ===
                                                  index
                                                  ? "active"
                                                  : ""
                                                }`}
                                              onClick={() => {
                                                setSelectedPassengerIndex(
                                                  index
                                                );
                                                setSelectedPassengerKey(
                                                  passenger.Key
                                                );
                                              }}
                                            >
                                              {passenger.firstName}{" "}
                                              {passenger.lastName}
                                              <br />
                                              <span>Seat No.</span>
                                              <br />
                                              <span>
                                                {selectedSeat?.seatCode ||
                                                  "Not Selected"}
                                              </span>
                                              <br />
                                              <span>Price </span>
                                              <br />
                                              <span>
                                                {selectedSeat?.seatPrice ||
                                                  "NA"}
                                              </span>
                                            </button>
                                          );
                                        })
                                      : PassengerData.filter(
                                        (passenger) =>
                                          passenger.type !== "Infant"
                                      ).map((passenger, index) => {
                                        const currentSegment =
                                          selectedSegmentType === "onward"
                                            ? TboOnwardSeatservice?.[
                                            currentFlightIndex
                                            ]
                                            : TboReturnSeatservice?.[
                                            currentFlightIndex
                                            ];
                                        const currentSegmentKey = `${currentSegment?.OriginAirport?.airport_municipality}-${currentSegment?.DestinationAirport?.airport_municipality}`;
                                        const CurrentSegmentCode = `${currentSegment?.OriginAirport?.airport_iata_code}-${currentSegment?.DestinationAirport?.airport_iata_code}`;
                                        const selectedSeat = selectedSeats[
                                          selectedSegmentType
                                        ].find(
                                          (s) =>
                                            s.passengerIndex === index &&
                                            s.segmentKey ===
                                            CurrentSegmentCode
                                        );
                                        // //console.log('Seleected seats', selectedSeats)
                                        return (
                                          <button
                                            key={index}
                                            type="button"
                                            className={`seatleftli tablinkseat ${selectedPassengerIndex === index
                                                ? "active"
                                                : ""
                                              }`}
                                            onClick={() =>
                                              setSelectedPassengerIndex(index)
                                            }
                                          >
                                            {passenger.firstName}{" "}
                                            {passenger.lastName}
                                            <br />
                                            <span>Seat No.</span>
                                            <br />
                                            <span>
                                              {selectedSeat?.seatCode ||
                                                "Not Selected"}
                                            </span>
                                            <br />
                                            <span>Price</span>
                                            <br />
                                            <span>
                                              ₹
                                              {selectedSeat?.seatPrice ||
                                                "NA"}
                                            </span>
                                          </button>
                                        );
                                      })}
                                  </div>
                                </div>
                                <div className="flex gap-1 mb-4 justify-center">
                                  <button
                                    type="button"
                                    className={`px-4 py-2 border ${selectedSegmentType === "onward"
                                        ? "border-violet-500 bg-violet-100 text-violet-600"
                                        : "border-gray-300"
                                      }`}
                                    onClick={() => {
                                      setSelectedSegmentType("onward");
                                      setSelectedPassengerIndex(0);
                                      setCurrentFlightIndex(0);
                                    }}
                                  >
                                    {
                                      FlightData?.Origin?.OriginAirport?.Airport
                                        ?.CityName
                                    }{" "}
                                    →{" "}
                                    {
                                      FlightData?.Destination
                                        ?.DestinationAirport?.Airport?.CityName
                                    }
                                  </button>
                                  <button
                                    type="button"
                                    className={`px-4 py-2 border ${selectedSegmentType === "return"
                                        ? "border-violet-500 bg-violet-100 text-violet-600"
                                        : "border-gray-300"
                                      }`}
                                    onClick={() => {
                                      setSelectedSegmentType("return");
                                      setSelectedPassengerIndex(0);
                                      setCurrentFlightIndex(0);
                                    }}
                                  >
                                    {
                                      ReturnFlightData?.Origin?.OriginAirport
                                        ?.Airport?.CityName
                                    }{" "}
                                    →{" "}
                                    {
                                      ReturnFlightData?.Destination
                                        ?.DestinationAirport?.Airport?.CityName
                                    }
                                  </button>
                                </div>
                                {(selectedSegmentType === "onward" &&
                                  OnwardSourceType === "Uapi") ||
                                  (selectedSegmentType === "return" &&
                                    ReturnSourceType === "Uapi") ? (
                                  (OnwardSeatData.length > 0 ||
                                    ReturnSeatData.length > 0) && (
                                    <div className="tabcontentseat">
                                      <div className="seatright">
                                        <div
                                          className="card-body"
                                          style={{ padding: "0px" }}
                                        >
                                          <div className="seat_selection">
                                            <>
                                              {/* Legend */}
                                              <div className="noted_seat">
                                                <div className="row noted_seat_clear">
                                                  <div className="col-md-9">
                                                    Free
                                                  </div>
                                                  <div className="col-md-3 noted_seat_free"></div>
                                                </div>
                                                <div className="row noted_seat_clear">
                                                  <div className="col-md-9">
                                                    ₹ 1 - ₹ 300
                                                  </div>
                                                  <div className="col-md-3 noted_seat_300"></div>
                                                </div>
                                                <div className="row noted_seat_clear">
                                                  <div className="col-md-9">
                                                    {"> ₹ 300"}
                                                  </div>
                                                  <div className="col-md-3 noted_seat_g300"></div>
                                                </div>
                                                <div className="row noted_seat_clear">
                                                  <div className="col-md-9">
                                                    Unavailable
                                                  </div>
                                                  <div className="col-md-3 noted_seat_disabled"></div>
                                                </div>
                                              </div>

                                              {/* Prev / Next Buttons */}
                                              {(() => {
                                                const SeatData =
                                                  selectedSegmentType ===
                                                    "onward"
                                                    ? OnwardSeatData
                                                    : ReturnSeatData;
                                                const passengerService =
                                                  SeatData?.find(
                                                    (service) =>
                                                      service.TravellerKey ===
                                                      selectedPassengerKey
                                                  );
                                                const totalFlights =
                                                  passengerService?.Segments
                                                    ?.length || 0;
                                                return (
                                                  <>
                                                    {currentFlightIndex > 0 && (
                                                      <button
                                                        type="button"
                                                        className="seatprevbutton"
                                                        onClick={() =>
                                                          handlePrev("Uapi")
                                                        }
                                                      >
                                                        {"<<"}
                                                      </button>
                                                    )}
                                                    {currentFlightIndex <
                                                      totalFlights - 1 && (
                                                        <button
                                                          type="button"
                                                          className="seatnextbutton"
                                                          onClick={() =>
                                                            handleNext("Uapi")
                                                          }
                                                        >
                                                          {">>"}
                                                        </button>
                                                      )}
                                                  </>
                                                );
                                              })()}

                                              <div style={{ display: "block" }}>
                                                <div className="plane passenger">
                                                  {/* Cockpit Info */}
                                                  {(() => {
                                                    const SeatData =
                                                      selectedSegmentType ===
                                                        "onward"
                                                        ? OnwardSeatData
                                                        : ReturnSeatData;
                                                    const flight =
                                                      SeatData?.find(
                                                        (service) =>
                                                          service.TravellerKey ===
                                                          selectedPassengerKey
                                                      )?.Segments?.[
                                                      currentFlightIndex
                                                      ];

                                                    if (!flight) return null;

                                                    return (
                                                      <div className="cockpit">
                                                        <h1>
                                                          {flight.Origin
                                                            ?.airport_municipality ||
                                                            "Origin"}
                                                          <br />
                                                          <span className="apiairportname1">
                                                            {
                                                              flight.Origin
                                                                ?.airport_name
                                                            }
                                                          </span>
                                                          <br />
                                                          <span className="brcockpit">
                                                            TO
                                                          </span>
                                                          <br />
                                                          {flight.Destination
                                                            ?.airport_municipality ||
                                                            "Destination"}
                                                          <br />
                                                          <span className="apiairportname1">
                                                            {
                                                              flight.Destination
                                                                ?.airport_name
                                                            }
                                                          </span>
                                                          <br />
                                                          <span className="brcockpit1">
                                                            (Flight Number:{" "}
                                                            {
                                                              flight.FlightNumber
                                                            }
                                                            ) -
                                                            <span className="equipmentno">
                                                              {flight.Equipment ||
                                                                "Equip"}
                                                            </span>
                                                          </span>
                                                        </h1>
                                                      </div>
                                                    );
                                                  })()}

                                                  <div className="exit exit--front fuselage"></div>
                                                  <ol className="cabin fuselage">
                                                    {(() => {
                                                      const SeatData =
                                                        selectedSegmentType ===
                                                          "onward"
                                                          ? OnwardSeatData
                                                          : ReturnSeatData;
                                                      const passengerService =
                                                        SeatData?.find(
                                                          (service) =>
                                                            service.TravellerKey ===
                                                            selectedPassengerKey
                                                        );
                                                      const segmentIndex =
                                                        currentFlightIndex;
                                                      const segmentData =
                                                        passengerService
                                                          ?.Segments?.[
                                                        segmentIndex
                                                        ];
                                                      const segmentkey =
                                                        segmentData?.Key;

                                                      if (
                                                        !segmentData ||
                                                        !Array.isArray(
                                                          segmentData.Rows
                                                        ) ||
                                                        segmentData.Rows
                                                          .length === 0
                                                      ) {
                                                        return (
                                                          <div className="text-center text-gray-500 font-semibold py-4 px-4">
                                                            Seat Reservation Not
                                                            Available
                                                          </div>
                                                        );
                                                      }

                                                      const rowMap = {};
                                                      const seatLettersSet =
                                                        new Set();

                                                      segmentData?.Rows?.forEach(
                                                        (row) => {
                                                          const rowNo =
                                                            row.Number;
                                                          const validSeats =
                                                            row.Seats?.filter(
                                                              (seat) =>
                                                                seat?.SeatCode
                                                            );

                                                          if (
                                                            !validSeats?.length ||
                                                            !rowNo
                                                          )
                                                            return;

                                                          rowMap[rowNo] = {};

                                                          validSeats.forEach(
                                                            (seat) => {
                                                              const seatLetter =
                                                                seat.SeatCode.split(
                                                                  "-"
                                                                )[1]; // A, B, etc.
                                                              rowMap[rowNo][
                                                                seatLetter
                                                              ] = {
                                                                ...seat,
                                                                rowNo,
                                                                seatLetter,
                                                                seatCode:
                                                                  seat.SeatCode,
                                                                price:
                                                                  seat.Paid ===
                                                                    "true"
                                                                    ? seat.TotalPrice
                                                                    : 0,
                                                                isUnavailable:
                                                                  seat.Availability !==
                                                                  "Available",
                                                              };

                                                              seatLettersSet.add(
                                                                seatLetter
                                                              );
                                                            }
                                                          );
                                                        }
                                                      );

                                                      const sortedRowNos =
                                                        Object.keys(
                                                          rowMap
                                                        ).sort(
                                                          (a, b) => +a - +b
                                                        );
                                                      const sortedSeatLetters =
                                                        Array.from(
                                                          seatLettersSet
                                                        ).sort();

                                                      return (
                                                        <>
                                                          {sortedRowNos.map(
                                                            (
                                                              rowNo,
                                                              rowIndex
                                                            ) => (
                                                              <li
                                                                key={rowIndex}
                                                                className={`row row--${rowNo}`}
                                                              >
                                                                <ol
                                                                  className={`seats border-0 olrow${sortedSeatLetters.length}`}
                                                                  type="A"
                                                                >
                                                                  <li className="seat border-0">
                                                                    {rowNo}
                                                                  </li>
                                                                  {sortedSeatLetters.map(
                                                                    (
                                                                      seatLetter,
                                                                      seatIndex
                                                                    ) => {
                                                                      const seat =
                                                                        rowMap[
                                                                        rowNo
                                                                        ][
                                                                        seatLetter
                                                                        ];
                                                                      if (
                                                                        !seat
                                                                      ) {
                                                                        return (
                                                                          <li
                                                                            key={
                                                                              seatIndex
                                                                            }
                                                                            className="seat border-0 empty-seat"
                                                                          ></li>
                                                                        );
                                                                      }

                                                                      const seatCode =
                                                                        seat.seatCode;
                                                                      const seatPrice =
                                                                        replaceINRWithSymbol(
                                                                          seat.price
                                                                        );
                                                                      const isUnavailable =
                                                                        seat.isUnavailable;
                                                                      const numericSeatPrice =
                                                                        parseFloat(
                                                                          seatPrice.replace(
                                                                            /[^\d.]/g,
                                                                            ""
                                                                          )
                                                                        );

                                                                      // disable condition
                                                                      const shouldDisable =
                                                                        isUnavailable ||
                                                                        ((!IsOnwardLCC ||
                                                                          !IsReturnLCC) &&
                                                                          numericSeatPrice >
                                                                          0) ||
                                                                        selectedSeats[
                                                                          selectedSegmentType
                                                                        ].some(
                                                                          (s) =>
                                                                            s.seatCode ===
                                                                            seatCode &&
                                                                            s.segmentKey ===
                                                                            segmentkey &&
                                                                            s.passengerIndex !==
                                                                            selectedPassengerIndex
                                                                        );

                                                                      return (
                                                                        <li
                                                                          key={
                                                                            seatIndex
                                                                          }
                                                                          className="seat border-0"
                                                                        >
                                                                          <input
                                                                            type="radio"
                                                                            name="optionalkeys"
                                                                            id={
                                                                              seatCode
                                                                            }
                                                                            value={
                                                                              numericSeatPrice >
                                                                                0
                                                                                ? `${seatCode}_${seatPrice}`
                                                                                : `free ${seatCode}`
                                                                            }
                                                                            disabled={
                                                                              shouldDisable
                                                                            }
                                                                            checked={selectedSeats[
                                                                              selectedSegmentType
                                                                            ].some(
                                                                              (
                                                                                s
                                                                              ) =>
                                                                                s.passengerIndex ===
                                                                                selectedPassengerIndex &&
                                                                                s.segmentKey ===
                                                                                segmentkey &&
                                                                                s.seatCode ===
                                                                                seatCode
                                                                            )}
                                                                            onChange={() => {
                                                                              setSelectedSeats(
                                                                                (
                                                                                  prev
                                                                                ) => {
                                                                                  const updatedSegmentSeats =
                                                                                    prev[
                                                                                      selectedSegmentType
                                                                                    ].filter(
                                                                                      (
                                                                                        s
                                                                                      ) =>
                                                                                        !(
                                                                                          s.passengerIndex ===
                                                                                          selectedPassengerIndex &&
                                                                                          s.segmentKey ===
                                                                                          segmentkey
                                                                                        )
                                                                                    );

                                                                                  return {
                                                                                    ...prev,
                                                                                    [selectedSegmentType]:
                                                                                      [
                                                                                        ...updatedSegmentSeats,
                                                                                        {
                                                                                          passengerIndex:
                                                                                            selectedPassengerIndex,
                                                                                          segmentKey:
                                                                                            segmentkey,
                                                                                          seatCode,
                                                                                          seatPrice,
                                                                                          seat,
                                                                                          sourcetype:
                                                                                            "Uapi",
                                                                                        },
                                                                                      ],
                                                                                  };
                                                                                }
                                                                              );
                                                                            }}
                                                                          />
                                                                          <label
                                                                            htmlFor={
                                                                              seatCode
                                                                            }
                                                                            className={`${numericSeatPrice >
                                                                                0
                                                                                ? "paid"
                                                                                : "free"
                                                                              } ${isUnavailable
                                                                                ? "unavailable"
                                                                                : "available"
                                                                              }`}
                                                                            title={`[${seatCode}] ${(!IsOnwardLCC ||
                                                                                !IsReturnLCC) &&
                                                                                numericSeatPrice >
                                                                                0
                                                                                ? "After ticketing paid seats will be available"
                                                                                : isUnavailable
                                                                                  ? "Unavailable"
                                                                                  : `${seatPrice} Available`
                                                                              }`}
                                                                          ></label>
                                                                          <span className="tooltip">
                                                                            {(!IsOnwardLCC ||
                                                                              !IsReturnLCC) &&
                                                                              numericSeatPrice >
                                                                              0
                                                                              ? "After ticketing paid seats will be available"
                                                                              : isUnavailable
                                                                                ? "Unavailable"
                                                                                : `Available [${seatCode}] ₹${seatPrice}`}
                                                                          </span>
                                                                        </li>
                                                                      );
                                                                    }
                                                                  )}
                                                                </ol>
                                                              </li>
                                                            )
                                                          )}
                                                        </>
                                                      );
                                                    })()}
                                                  </ol>
                                                  <div className="exit exit--back fuselage"></div>
                                                </div>
                                              </div>
                                            </>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                ) : TboOnwardSeatservice?.length > 0 ||
                                  TboReturnSeatservice?.length > 0 ? (
                                  <>
                                    <div className="tabcontentseat">
                                      <div className="seatright">
                                        <div
                                          className="card-body"
                                          style={{ padding: "0px" }}
                                        >
                                          <div className="seat_selection">
                                            <>
                                              {/* Legend */}
                                              <div className="noted_seat">
                                                <div className="row noted_seat_clear">
                                                  <div className="col-md-9">
                                                    Free
                                                  </div>
                                                  <div className="col-md-3 noted_seat_free"></div>
                                                </div>
                                                <div className="row noted_seat_clear">
                                                  <div className="col-md-9">
                                                    ₹ 1 - ₹ 300
                                                  </div>
                                                  <div className="col-md-3 noted_seat_300"></div>
                                                </div>
                                                <div className="row noted_seat_clear">
                                                  <div className="col-md-9">
                                                    {"> ₹ 300"}
                                                  </div>
                                                  <div className="col-md-3 noted_seat_g300"></div>
                                                </div>
                                                <div className="row noted_seat_clear">
                                                  <div className="col-md-9">
                                                    Unavailable
                                                  </div>
                                                  <div className="col-md-3 noted_seat_disabled"></div>
                                                </div>
                                              </div>

                                              {/* Prev/Next buttons */}
                                              {(() => {
                                                const SeatData =
                                                  selectedSegmentType ===
                                                    "onward"
                                                    ? TboOnwardSeatservice
                                                    : TboReturnSeatservice;
                                                return (
                                                  <>
                                                    {SeatData.length > 1 &&
                                                      currentFlightIndex >
                                                      0 && (
                                                        <button
                                                          type="button"
                                                          className="seatprevbutton"
                                                          onClick={() =>
                                                            handlePrev("Tbo")
                                                          }
                                                        >
                                                          {"<<"}
                                                        </button>
                                                      )}
                                                    {SeatData.length > 1 &&
                                                      currentFlightIndex <
                                                      SeatData.length - 1 && (
                                                        <button
                                                          type="button"
                                                          className="seatnextbutton"
                                                          onClick={() =>
                                                            handleNext("Tbo")
                                                          }
                                                        >
                                                          {">>"}
                                                        </button>
                                                      )}
                                                  </>
                                                );
                                              })()}

                                              {/* Plane Seats */}
                                              <div style={{ display: "block" }}>
                                                {(() => {
                                                  const currentSegment =
                                                    selectedSegmentType ===
                                                      "onward"
                                                      ? TboOnwardSeatservice?.[
                                                      currentFlightIndex
                                                      ]
                                                      : TboReturnSeatservice?.[
                                                      currentFlightIndex
                                                      ];

                                                  if (
                                                    !currentSegment?.RowSeats
                                                      ?.length
                                                  ) {
                                                    return (
                                                      <div className="text-center p-4 text-danger">
                                                        Seat data not available
                                                        for this flight.
                                                      </div>
                                                    );
                                                  }

                                                  const currentSegmentKey = `${currentSegment.OriginAirport.airport_iata_code}-${currentSegment.DestinationAirport.airport_iata_code}`;
                                                  const rowMap = {};
                                                  const seatLettersSet =
                                                    new Set();

                                                  currentSegment.RowSeats.forEach(
                                                    (row) => {
                                                      const validSeats =
                                                        row.Seats.filter(
                                                          (s) => s.SeatNo
                                                        );
                                                      if (!validSeats.length)
                                                        return;
                                                      const rowNo =
                                                        validSeats[0].RowNo;
                                                      if (!rowNo) return;
                                                      rowMap[rowNo] = {};
                                                      validSeats.forEach(
                                                        (seat) => {
                                                          rowMap[rowNo][
                                                            seat.SeatNo
                                                          ] = seat;
                                                          seatLettersSet.add(
                                                            seat.SeatNo
                                                          );
                                                        }
                                                      );
                                                    }
                                                  );

                                                  const sortedRowNos =
                                                    Object.keys(rowMap).sort(
                                                      (a, b) => +a - +b
                                                    );
                                                  const sortedSeatLetters =
                                                    Array.from(
                                                      seatLettersSet
                                                    ).sort();

                                                  return (
                                                    <div className="plane passenger">
                                                      {/* Cockpit info */}
                                                      <div className="cockpit">
                                                        <h1>
                                                          {currentSegment
                                                            .OriginAirport
                                                            .airport_municipality ||
                                                            "Origin"}
                                                          <br />
                                                          <span className="apiairportname1">
                                                            {
                                                              currentSegment
                                                                .OriginAirport
                                                                .airport_name
                                                            }
                                                          </span>
                                                          <br />
                                                          <span className="brcockpit">
                                                            TO
                                                          </span>
                                                          <br />
                                                          {currentSegment
                                                            .DestinationAirport
                                                            .airport_municipality ||
                                                            "Destination"}
                                                          <br />
                                                          <span className="apiairportname1">
                                                            {
                                                              currentSegment
                                                                .DestinationAirport
                                                                .airport_name
                                                            }
                                                          </span>
                                                          <br />
                                                          <span className="brcockpit1">
                                                            (Flight Number:{" "}
                                                            {
                                                              currentSegment
                                                                .RowSeats[0]
                                                                .Seats[0]
                                                                .FlightNumber
                                                            }
                                                            ) -
                                                            <span className="equipmentno">
                                                              {currentSegment.RowSeats[0].Seats[0].CraftType?.split(
                                                                "-"
                                                              )[0] || "Equip"}
                                                            </span>
                                                          </span>
                                                        </h1>
                                                      </div>

                                                      <div className="exit exit--front fuselage"></div>

                                                      <ol className="cabin fuselage">
                                                        <li className="row row--header">
                                                          <ol
                                                            className={`seatsolrow${sortedSeatLetters.length}`}
                                                          >
                                                            <li className="seat header-seat border-0"></li>
                                                          </ol>
                                                        </li>

                                                        {sortedRowNos.map(
                                                          (rowNo, rowIndex) => (
                                                            <li
                                                              key={rowIndex}
                                                              className={`row row--${rowNo}`}
                                                            >
                                                              <ol
                                                                className={`seats border-0 olrow${sortedSeatLetters.length}`}
                                                                type="A"
                                                              >
                                                                <li className="seat border-0">
                                                                  {rowNo}
                                                                </li>
                                                                {sortedSeatLetters.map(
                                                                  (
                                                                    seatLetter,
                                                                    seatIndex
                                                                  ) => {
                                                                    const seat =
                                                                      rowMap[
                                                                      rowNo
                                                                      ][
                                                                      seatLetter
                                                                      ];
                                                                    if (!seat)
                                                                      return (
                                                                        <li
                                                                          key={
                                                                            seatIndex
                                                                          }
                                                                          className="seat border-0 empty-seat"
                                                                        ></li>
                                                                      );

                                                                    const seatCode =
                                                                      seat.Code;
                                                                    const seatPrice =
                                                                      seat.Price;
                                                                    const isUnavailable =
                                                                      seat.AvailablityType ===
                                                                      3;

                                                                    return (
                                                                      <li
                                                                        key={
                                                                          seatIndex
                                                                        }
                                                                        className="seat border-0"
                                                                      >
                                                                        <input
                                                                          type="radio"
                                                                          name={`optionalkeys`}
                                                                          id={
                                                                            seatCode
                                                                          }
                                                                          value={
                                                                            seatPrice >
                                                                              0
                                                                              ? `${seatCode}_${seatPrice}`
                                                                              : `free ${seatCode}`
                                                                          }
                                                                          disabled={
                                                                            isUnavailable ||
                                                                            selectedSeats[
                                                                              selectedSegmentType
                                                                            ].some(
                                                                              (
                                                                                s
                                                                              ) =>
                                                                                s.seatCode ===
                                                                                seatCode &&
                                                                                s.segmentKey ===
                                                                                currentSegmentKey &&
                                                                                s.passengerIndex !==
                                                                                selectedPassengerIndex
                                                                            )
                                                                          }
                                                                          checked={selectedSeats[
                                                                            selectedSegmentType
                                                                          ].some(
                                                                            (
                                                                              s
                                                                            ) =>
                                                                              s.passengerIndex ===
                                                                              selectedPassengerIndex &&
                                                                              s.segmentKey ===
                                                                              currentSegmentKey &&
                                                                              s.seatCode ===
                                                                              seatCode
                                                                          )}
                                                                          onChange={() => {
                                                                            setSelectedSeats(
                                                                              (
                                                                                prev
                                                                              ) => {
                                                                                const filtered =
                                                                                  prev[
                                                                                    selectedSegmentType
                                                                                  ].filter(
                                                                                    (
                                                                                      s
                                                                                    ) =>
                                                                                      !(
                                                                                        s.passengerIndex ===
                                                                                        selectedPassengerIndex &&
                                                                                        s.segmentKey ===
                                                                                        currentSegmentKey
                                                                                      )
                                                                                  );

                                                                                return {
                                                                                  ...prev,
                                                                                  [selectedSegmentType]:
                                                                                    [
                                                                                      ...filtered,
                                                                                      {
                                                                                        passengerIndex:
                                                                                          selectedPassengerIndex,
                                                                                        segmentKey:
                                                                                          currentSegmentKey,
                                                                                        seatCode,
                                                                                        seatPrice,
                                                                                        seat: seat,
                                                                                        sourcetype:
                                                                                          "Tbo",
                                                                                      },
                                                                                    ],
                                                                                };
                                                                              }
                                                                            );
                                                                          }}
                                                                        />

                                                                        <label
                                                                          htmlFor={
                                                                            seatCode
                                                                          }
                                                                          className={`${seatPrice >
                                                                              0
                                                                              ? "paid"
                                                                              : "free"
                                                                            } ${isUnavailable
                                                                              ? "unavailable"
                                                                              : "available"
                                                                            }`}
                                                                          title={`[${seatCode}] ₹${seatPrice}`}
                                                                        ></label>
                                                                        <span className="tooltip">
                                                                          {isUnavailable
                                                                            ? "Unavailable"
                                                                            : `Available [${seatCode}] ₹${seatPrice}`}
                                                                        </span>
                                                                      </li>
                                                                    );
                                                                  }
                                                                )}
                                                              </ol>
                                                            </li>
                                                          )
                                                        )}
                                                      </ol>

                                                      <div className="exit exit--back fuselage"></div>
                                                    </div>
                                                  );
                                                })()}
                                              </div>
                                            </>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-center p-4">
                                    Seat data not available for this flight.
                                  </div>
                                )}
                              </div>
                              <div className="seatbutton">
                                {Array.isArray(selectedSeats) &&
                                  selectedSeats.length > 0 ? (
                                  <button
                                    type="button"
                                    className="seatbuttonskip disabledskip"
                                    style={{ marginRight: "4px" }}
                                    disabled
                                  >
                                    Skip
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={handleseatbuttonskip}
                                    className="seatbuttonskip"
                                    style={{ marginRight: "4px" }}
                                  >
                                    Skip
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={handleseatbuttonskip}
                                  className="seatbuttonskip"
                                >
                                  continue
                                </button>
                              </div>
                            </AccordionDetails>
                            <AccordionActions></AccordionActions>
                          </Accordion>

                          <div className="booking-devider" />
                          <div>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => handleCheckboxChange(e)}
                            />
                            <label className="confirmtocontinue">
                              I confirm that I have read and I accept the{" "}
                              <a href="#">Fare Rules</a> , the{" "}
                              <a href="#">Privacy Policy</a> , the{" "}
                              <a href="#">User Agreement</a> and{" "}
                              <a href="#">Terms of Service</a> of Taxivaxi
                            </label>
                            {showError && (
                              <div
                                style={{
                                  color: "red",
                                  marginBottom: "5px",
                                  fontSize: "11px",
                                }}
                              >
                                Please accept the terms and conditions before
                                continuing.
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            id="back_button"
                            onClick={() => window.history.back()}
                          >
                            Back
                          </button>

                          {/* {emptyseatmap || seatresponseparse ? ( */}
                          <button
                            type="button"
                            className="booking_continue booking_continue_hover"
                            onClick={ContinueBooking}
                          >
                            Continue booking
                          </button>
                          {/* ) : (
                            <button
                              type="submit"
                              className="booking_continue"
                              disabled
                              style={{ cursor: 'not-allowed' }}
                            >
                              Continue booking
                            </button>
                          )} */}

                          <div className="booking-devider" />
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="clear" />
                </div>
              </div>
              <div className="sp-page-r">
                <div className="checkout-coll">
                  <div className="checkout-head">
                    <div className="checkout-headl">
                      {/* <a href="#">
                                                <div >
                                                    {FlightData?.Origin?.OriginAirline?.OperatingCarrier === FlightData?.Destination?.DestinationAirline?.OperatingCarrier ? (
                                                        <img
                                                            className={`airlineimg`}
                                                            src={`https://devapi.taxivaxi.com/airline_logo_images/${FlightData?.Origin?.OriginAirline?.OperatingCarrier}.png`}
                                                            alt="Airline logo"
                                                            width="40px"
                                                        />
                                                    ) : (
                                                        <div className='flex inline-block'>
                                                            <img
                                                                className={`airlineimg`}
                                                                src={`https://devapi.taxivaxi.com/airline_logo_images/${FlightData?.Origin?.OriginAirline?.OperatingCarrier}.png`}
                                                                alt="Airline logo"
                                                                width="40px"
                                                            />
                                                            <img
                                                                className={`airlineimg`}
                                                                src={`https://devapi.taxivaxi.com/airline_logo_images/${FlightData?.Destination?.DestinationAirline?.OperatingCarrier}.png`}
                                                                alt="Airline logo"
                                                                width="40px"
                                                            />
                                                        </div>
                                                    )}
                                                    <br />
                                                
                                                    <span className="flightnumber">
                                                    
                                                        {FlightData?.Origin?.OriginAirline?.FlightNumber === FlightData?.Destination?.DestinationAirline?.FlightNumber &&
                                                            FlightData?.Origin?.OriginAirline?.AirlineCode === FlightData?.Destination?.DestinationAirline?.AirlineCode ? (

                                                            <>
                                                                {FlightData?.Origin?.OriginAirline?.AirlineCode} {FlightData?.Origin?.OriginAirline?.FlightNumber}
                                                            </>
                                                        ) : (

                                                            <>
                                                                {FlightData?.Origin?.OriginAirline?.AirlineCode} {FlightData?.Origin?.OriginAirline?.FlightNumber} <br />
                                                                {FlightData?.Destination?.DestinationAirline?.AirlineCode} {FlightData?.Destination?.DestinationAirline?.FlightNumber}
                                                            </>
                                                        )}
                                                    </span>
                                                </div>
                                            </a> */}
                    </div>
                    {/* <div className="checkout-headr">
                                            <div className="checkout-headrb">
                                                <div className="checkout-headrp">
                                                    <div className="chk-left">
                                                        <div className="chk-lbl">
                                                            <a href="#">   {FlightData?.Origin?.OriginAirport?.Airport?.CityName} -{FlightData?.Origin?.OriginAirport?.Airport?.AirportName} {FlightData?.Origin?.OriginAirport?.Airport?.Terminal} -  {FlightData?.Destination?.DestinationAirport?.Airport?.CityName} -{FlightData?.Destination?.DestinationAirport?.Airport?.AirportName} {FlightData?.Destination?.DestinationAirport?.Airport?.Terminal} </a>
                                                        </div>
                                                        
                                                    </div>
                                                    <div className="clear" />
                                                </div>
                                            </div>
                                            <div className="clear" />
                                        </div> */}
                  </div>
                  <div className="chk-lines">
                    <div className="chk-line chk-fligth-info">
                      <div className="chk-departure">
                        <span />
                        <b>
                          <div className="">Onward Flight</div>
                        </b>
                      </div>
                      {/* <div className="chk-fligth-devider" /> */}
                      <div className="w-px bg-gray-300 mx-6"></div>

                      <div className="chk-arrival">
                        <span />
                        <b>
                          <div className="">Return Flight</div>
                        </b>
                      </div>
                      <div className="clear" />
                    </div>
                  </div>
                  <div className="chk-lines ">
                    <div className="chk-line chk-fligth-info flex">
                      <div className="chk-departure">
                        <span />
                        <b>
                          <div className="chk-lbl">
                            <div className="flex gap-3">

                              {FlightData?.Origin?.OriginAirline?.OperatingCarrier ===
                                FlightData?.Destination?.DestinationAirline?.OperatingCarrier ? (
                                <img
                                  className="airlineimg"
                                  src={`https://devapi.taxivaxi.com/airline_logo_images/${FlightData?.Origin?.OriginAirline?.OperatingCarrier ||
                                    FlightData?.Origin?.OriginAirline?.AirlineCode
                                    }.png`}
                                  alt="Airline logo"
                                  width="40px"
                                />
                              ) : (
                                <div className="flex inline-block">
                                  <img
                                    className="airlineimg"
                                    src={`https://devapi.taxivaxi.com/airline_logo_images/${FlightData?.Origin?.OriginAirline?.OperatingCarrier ||
                                      FlightData?.Origin?.OriginAirline?.AirlineCode
                                      }.png`}
                                    alt="Airline logo"
                                    width="40px"
                                  />

                                  <img
                                    className="airlineimg"
                                    src={`https://devapi.taxivaxi.com/airline_logo_images/${FlightData?.Destination?.DestinationAirline?.OperatingCarrier ||
                                      FlightData?.Destination?.DestinationAirline?.AirlineCode
                                      }.png`}
                                    alt="Airline logo"
                                    width="40px"
                                  />
                                </div>
                              )}

                              <span className="flightnumber">
                                {FlightData?.Origin?.OriginAirline?.FlightNumber ===
                                  FlightData?.Destination?.DestinationAirline?.FlightNumber &&
                                  FlightData?.Origin?.OriginAirline?.AirlineCode ===
                                  FlightData?.Destination?.DestinationAirline?.AirlineCode ? (
                                  <>
                                    {FlightData?.Origin?.OriginAirline?.AirlineCode}{" "}
                                    {FlightData?.Origin?.OriginAirline?.FlightNumber}
                                  </>
                                ) : (
                                  <>
                                    {FlightData?.Origin?.OriginAirline?.AirlineCode}{" "}
                                    {FlightData?.Origin?.OriginAirline?.FlightNumber}
                                    <br />
                                    {FlightData?.Destination?.DestinationAirline?.AirlineCode}{" "}
                                    {FlightData?.Destination?.DestinationAirline?.FlightNumber}
                                  </>
                                )}
                              </span>

                            </div>

                            <br />
                            <a href="#">
                              {" "}
                              {
                                FlightData?.Origin?.OriginAirport?.Airport
                                  ?.CityName
                              }{" "}
                              –{" "}
                              {
                                FlightData?.Origin?.OriginAirport?.Airport
                                  ?.AirportName
                              }{" "}
                              {
                                FlightData?.Origin?.OriginAirport?.Airport
                                  ?.Terminal
                              }{" "}
                              →{" "}
                              {
                                FlightData?.Destination?.DestinationAirport
                                  ?.Airport?.CityName
                              }{" "}
                              –{" "}
                              {
                                FlightData?.Destination?.DestinationAirport
                                  ?.Airport?.AirportName
                              }{" "}
                              {
                                FlightData?.Destination?.DestinationAirport
                                  ?.Airport?.Terminal
                              }{" "}
                            </a>
                          </div>

                          {/* <div className="chk-lbl-a">One Way Trip</div> */}
                        </b>
                      </div>
                      <div className="w-px bg-gray-300 mx-6"></div>

                      <div className="chk-arrival">
                        <span />
                        <b>
                          <div className="chk-lbl">
                            <div className="flex gap-3">

                              {ReturnFlightData?.Origin?.OriginAirline?.OperatingCarrier ===
                                ReturnFlightData?.Destination?.DestinationAirline?.OperatingCarrier ? (
                                <img
                                  className="airlineimg"
                                  src={`https://devapi.taxivaxi.com/airline_logo_images/${ReturnFlightData?.Origin?.OriginAirline?.OperatingCarrier ||
                                    ReturnFlightData?.Origin?.OriginAirline?.AirlineCode
                                    }.png`}
                                  alt="Airline logo"
                                  width="40px"
                                />
                              ) : (
                                <div className="flex inline-block">
                                  <img
                                    className="airlineimg"
                                    src={`https://devapi.taxivaxi.com/airline_logo_images/${ReturnFlightData?.Origin?.OriginAirline?.OperatingCarrier ||
                                      ReturnFlightData?.Origin?.OriginAirline?.AirlineCode
                                      }.png`}
                                    alt="Airline logo"
                                    width="40px"
                                  />

                                  <img
                                    className="airlineimg"
                                    src={`https://devapi.taxivaxi.com/airline_logo_images/${ReturnFlightData?.Destination?.DestinationAirline?.OperatingCarrier ||
                                      ReturnFlightData?.Destination?.DestinationAirline?.AirlineCode
                                      }.png`}
                                    alt="Airline logo"
                                    width="40px"
                                  />
                                </div>
                              )}

                              <span className="flightnumber">
                                {ReturnFlightData?.Origin?.OriginAirline?.FlightNumber ===
                                  ReturnFlightData?.Destination?.DestinationAirline?.FlightNumber &&
                                  ReturnFlightData?.Origin?.OriginAirline?.AirlineCode ===
                                  ReturnFlightData?.Destination?.DestinationAirline?.AirlineCode ? (
                                  <>
                                    {ReturnFlightData?.Origin?.OriginAirline?.AirlineCode}{" "}
                                    {ReturnFlightData?.Origin?.OriginAirline?.FlightNumber}
                                  </>
                                ) : (
                                  <>
                                    {ReturnFlightData?.Origin?.OriginAirline?.AirlineCode}{" "}
                                    {ReturnFlightData?.Origin?.OriginAirline?.FlightNumber}
                                    <br />
                                    {ReturnFlightData?.Destination?.DestinationAirline?.AirlineCode}{" "}
                                    {ReturnFlightData?.Destination?.DestinationAirline?.FlightNumber}
                                  </>
                                )}
                              </span>

                            </div>

                            <br />
                            <a href="#">
                              {" "}
                              {
                                ReturnFlightData?.Origin?.OriginAirport?.Airport
                                  ?.CityName
                              }{" "}
                              –{" "}
                              {
                                ReturnFlightData?.Origin?.OriginAirport?.Airport
                                  ?.AirportName
                              }{" "}
                              {
                                ReturnFlightData?.Origin?.OriginAirport?.Airport
                                  ?.Terminal
                              }{" "}
                              →{" "}
                              {
                                ReturnFlightData?.Destination
                                  ?.DestinationAirport?.Airport?.CityName
                              }{" "}
                              –{" "}
                              {
                                ReturnFlightData?.Destination
                                  ?.DestinationAirport?.Airport?.AirportName
                              }{" "}
                              {
                                ReturnFlightData?.Destination
                                  ?.DestinationAirport?.Airport?.Terminal
                              }{" "}
                            </a>
                          </div>
                          {/* <div className="chk-lbl-a">One Way Trip</div> */}
                        </b>
                      </div>
                      <div className="clear" />
                    </div>
                  </div>
                  <div className="chk-lines">
                    <div className="chk-line chk-fligth-info">
                      <div className="chk-departure">
                        <span />
                        <b>
                          {handleweekdatemonthyear(
                            FlightData?.Origin?.OriginAirport?.DepTime
                          )}
                        </b>
                      </div>
                      {/* <div className="chk-fligth-devider" /> */}
                      <div className="w-px bg-gray-300 mx-6"></div>

                      <div className="chk-arrival">
                        <span />
                        <b>
                          {handleweekdatemonthyear(
                            ReturnFlightData?.Destination?.DestinationAirport
                              ?.ArrTime
                          )}
                        </b>
                      </div>
                      <div className="clear" />
                    </div>
                  </div>

                  <div className="chk-details">
                    <h2>Details</h2>
                    <div className="chk-detais-row">
                      <div className="chk-line relative items-start gap-2">
                        <span className="chk-l">Airlines</span>

                        <span className="chk-r flex items-center">
                          <button
                            className="cursor-pointer"
                            onClick={() => setShowTooltip((prev) => !prev)}
                          >
                            <img
                              src="../img/i_icon.svg"
                              alt="Info"
                              className="w-4 h-4 cursor-pointer mt-1"
                            />
                          </button>
                        </span>

                        {showTooltip && (
                          <div
                            className="absolute right-0 top-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-sm z-50 w-40 "
                            onMouseLeave={() => setShowTooltip(false)}
                          >
                            <div className="flex gap-2">
                              <p className="font-semibold text-xs text-gray-800 mb-1">
                                Onward Airlines:
                              </p>
                              {FlightData?.Origin?.OriginAirline
                                ?.AirlineName ===
                                FlightData?.Destination?.DestinationAirline
                                  ?.AirlineName ? (
                                <p className="chk-r">
                                  {
                                    FlightData?.Origin?.OriginAirline
                                      ?.AirlineName
                                  }
                                </p>
                              ) : (
                                <>
                                  <p className="chk-r">
                                    {
                                      FlightData?.Origin?.OriginAirline
                                        ?.AirlineName
                                    }
                                  </p>
                                  <p className="chk-r">
                                    {
                                      FlightData?.Destination
                                        ?.DestinationAirline?.AirlineName
                                    }
                                  </p>
                                </>
                              )}
                            </div>

                            <hr className="my-2" />

                            <div className="flex gap-2">
                              <p className="font-semibold text-xs text-gray-800 mb-1 flex">
                                Return Airlines:
                              </p>
                              {ReturnFlightData?.Origin?.OriginAirline
                                ?.AirlineName ===
                                ReturnFlightData?.Destination?.DestinationAirline
                                  ?.AirlineName ? (
                                <p className="chk-r">
                                  {
                                    ReturnFlightData?.Origin?.OriginAirline
                                      ?.AirlineName
                                  }
                                </p>
                              ) : (
                                <>
                                  <p className="chk-r">
                                    {
                                      ReturnFlightData?.Origin?.OriginAirline
                                        ?.AirlineName
                                    }
                                  </p>
                                  <p className="chk-r">
                                    {
                                      ReturnFlightData?.Destination
                                        ?.DestinationAirline?.AirlineName
                                    }
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="clear" />
                      </div>
                      <div className="chk-line relative items-start gap-2">
                        <span className="chk-l">Cabin Class</span>

                        {/* <span className="chk-r">
                          {responseData?.CabinClass}
                        </span> */}
                        <span className="chk-r flex items-center">
                          <button
                            className="cursor-pointer"
                            onClick={() => setShowTooltip2((prev) => !prev)}
                          >
                            <img
                              src="../img/i_icon.svg"
                              alt="Info"
                              className="w-4 h-4 cursor-pointer mt-1"
                            />
                          </button>
                        </span>

                        {showTooltip2 && (
                          <div
                            className="absolute right-0 top-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-sm z-50 w-40 "
                            onMouseLeave={() => setShowTooltip2(false)}
                          >
                            <div className="flex gap-2">
                              <p className="font-semibold text-xs text-gray-800 mb-1">
                                Onward Airlines:
                              </p>
                              <span className="chk-r">
                                {responseData?.CabinClass}
                              </span>
                            </div>

                            <hr className="my-2" />

                            <div className="flex gap-2">
                              <p className="font-semibold text-xs text-gray-800 mb-1 flex">
                                Return Airlines:
                              </p>
                              <span className="chk-r">
                                {responseData?.CabinClass}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="clear" />
                      </div>
                      {responseData?.Passenger_info?.Adult > 0 && (
                        <div className="chk-line relative items-start gap-2">
                          <span className="chk-l">
                            Adult X {responseData?.Passenger_info?.Adult}
                          </span>
                          <span className="chk-r">
                            <button
                              className="cursor-pointer"
                              onClick={() => setShowTooltip3((prev) => !prev)}
                            >
                              <img
                                src="../img/i_icon.svg"
                                alt="Info"
                                className="w-4 h-4 cursor-pointer mt-1"
                              />
                            </button>
                          </span>
                          {showTooltip3 && (
                            <div
                              className="absolute right-0 top-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-sm z-50 w-40 "
                              onMouseLeave={() => setShowTooltip3(false)}
                            >
                              <div className="flex gap-2">
                                <p className="font-semibold text-xs text-gray-800 mb-1">
                                  Onward Airlines:
                                </p>
                                <span className="chk-r">
                                  {OnwardSourceType === "Uapi" && (
                                    <>
                                      {(() => {
                                        const airPricingInfos = Array.isArray(
                                          FareData?.AirPricingInfo
                                        )
                                          ? FareData.AirPricingInfo
                                          : FareData?.AirPricingInfo
                                            ? [FareData.AirPricingInfo]
                                            : [];

                                        const adultPricing =
                                          airPricingInfos.find((info) => {
                                            const passengerTypes =
                                              info?.["air:PassengerType"];
                                            const passengerTypeArray =
                                              Array.isArray(passengerTypes)
                                                ? passengerTypes
                                                : passengerTypes
                                                  ? [passengerTypes]
                                                  : [];

                                            return passengerTypeArray.some(
                                              (pt) => pt?.$?.Code === "ADT"
                                            );
                                          });

                                        const basePriceStr =
                                          adultPricing?.$?.BasePrice ||
                                          "INR0.00";
                                        const basePrice =
                                          parseFloat(
                                            basePriceStr
                                              .replace("INR", "")
                                              .replace(",", "")
                                          ) || 0;
                                        const adultCount =
                                          Number(
                                            responseData?.Passenger_info?.Adult
                                          ) || 0;
                                        const total = basePrice * adultCount;

                                        return `₹${total.toFixed(2)}`;
                                      })()}
                                    </>
                                  )}
                                  {OnwardSourceType === "Tbo" && (
                                    <>
                                      ₹
                                      {PerPassOnwardTboFareData.find(
                                        (item) => item.PassengerType === 1
                                      )?.BaseFare?.toFixed(2) || "0.00"}
                                    </>
                                  )}
                                </span>
                              </div>

                              <hr className="my-2" />

                              <div className="flex gap-2">
                                <p className="font-semibold text-xs text-gray-800 mb-1 flex">
                                  Return Airlines:
                                </p>
                                <span className="chk-r">
                                  {ReturnSourceType === "Uapi" && (
                                    <>
                                      {(() => {
                                        const airPricingInfos = Array.isArray(
                                          ReturnFareData?.AirPricingInfo
                                        )
                                          ? ReturnFareData.AirPricingInfo
                                          : ReturnFareData?.AirPricingInfo
                                            ? [ReturnFareData.AirPricingInfo]
                                            : [];

                                        const adultPricing =
                                          airPricingInfos.find((info) => {
                                            const passengerTypes =
                                              info?.["air:PassengerType"];
                                            const passengerTypeArray =
                                              Array.isArray(passengerTypes)
                                                ? passengerTypes
                                                : passengerTypes
                                                  ? [passengerTypes]
                                                  : [];

                                            return passengerTypeArray.some(
                                              (pt) => pt?.$?.Code === "ADT"
                                            );
                                          });

                                        const basePriceStr =
                                          adultPricing?.$?.BasePrice ||
                                          "INR0.00";
                                        const basePrice =
                                          parseFloat(
                                            basePriceStr
                                              .replace("INR", "")
                                              .replace(",", "")
                                          ) || 0;
                                        const adultCount =
                                          Number(
                                            responseData?.Passenger_info?.Adult
                                          ) || 0;
                                        const total = basePrice * adultCount;

                                        return `₹${total.toFixed(2)}`;
                                      })()}
                                    </>
                                  )}
                                  {ReturnSourceType === "Tbo" && (
                                    <>
                                      ₹
                                      {PerPassReturnTboFareData.find(
                                        (item) => item.PassengerType === 1
                                      )?.BaseFare?.toFixed(2) || "0.00"}
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="clear" />
                        </div>
                      )}
                      {responseData?.Passenger_info?.Child > 0 && (
                        <div className="chk-line relative items-start gap-2">
                          <span className="chk-l">
                            Child X {responseData?.Passenger_info?.Child}
                          </span>
                          <span className="chk-r">
                            <button
                              className="cursor-pointer"
                              onClick={() => setShowTooltip4((prev) => !prev)}
                            >
                              <img
                                src="../img/i_icon.svg"
                                alt="Info"
                                className="w-4 h-4 cursor-pointer mt-1"
                              />
                            </button>
                          </span>
                          {showTooltip4 && (
                            <div
                              className="absolute right-0 top-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-sm z-50 w-40 "
                              onMouseLeave={() => setShowTooltip4(false)}
                            >
                              <div className="flex gap-2">
                                <p className="font-semibold text-xs text-gray-800 mb-1">
                                  Onward Airlines:
                                </p>
                                <span className="chk-r">
                                  {OnwardSourceType === "Uapi" && (
                                    <>
                                      {(() => {
                                        const airPricingInfos = Array.isArray(
                                          FareData?.AirPricingInfo
                                        )
                                          ? FareData.AirPricingInfo
                                          : FareData?.AirPricingInfo
                                            ? [FareData.AirPricingInfo]
                                            : [];

                                        const adultPricing =
                                          airPricingInfos.find((info) => {
                                            const passengerTypes =
                                              info?.["air:PassengerType"];
                                            const passengerTypeArray =
                                              Array.isArray(passengerTypes)
                                                ? passengerTypes
                                                : passengerTypes
                                                  ? [passengerTypes]
                                                  : [];

                                            return passengerTypeArray.some(
                                              (pt) => pt?.$?.Code === "CNN"
                                            );
                                          });

                                        const basePriceStr =
                                          adultPricing?.$?.BasePrice ||
                                          "INR0.00";
                                        const basePrice =
                                          parseFloat(
                                            basePriceStr
                                              .replace("INR", "")
                                              .replace(",", "")
                                          ) || 0;
                                        const childCount =
                                          Number(
                                            responseData?.Passenger_info?.Child
                                          ) || 0;
                                        const total = basePrice * childCount;

                                        return `₹${total.toFixed(2)}`;
                                      })()}
                                    </>
                                  )}
                                  {OnwardSourceType === "Tbo" && (
                                    <>
                                      ₹
                                      {PerPassOnwardTboFareData.find(
                                        (item) => item.PassengerType === 2
                                      )?.BaseFare?.toFixed(2) || "0.00"}
                                    </>
                                  )}
                                </span>
                              </div>

                              <hr className="my-2" />

                              <div className="flex gap-2">
                                <p className="font-semibold text-xs text-gray-800 mb-1 flex">
                                  Return Airlines:
                                </p>
                                <span className="chk-r">
                                  {ReturnSourceType === "Uapi" && (
                                    <>
                                      {(() => {
                                        const airPricingInfos = Array.isArray(
                                          ReturnFareData?.AirPricingInfo
                                        )
                                          ? ReturnFareData.AirPricingInfo
                                          : ReturnFareData?.AirPricingInfo
                                            ? [ReturnFareData.AirPricingInfo]
                                            : [];

                                        const adultPricing =
                                          airPricingInfos.find((info) => {
                                            const passengerTypes =
                                              info?.["air:PassengerType"];
                                            const passengerTypeArray =
                                              Array.isArray(passengerTypes)
                                                ? passengerTypes
                                                : passengerTypes
                                                  ? [passengerTypes]
                                                  : [];

                                            return passengerTypeArray.some(
                                              (pt) => pt?.$?.Code === "CNN"
                                            );
                                          });

                                        const basePriceStr =
                                          adultPricing?.$?.BasePrice ||
                                          "INR0.00";
                                        const basePrice =
                                          parseFloat(
                                            basePriceStr
                                              .replace("INR", "")
                                              .replace(",", "")
                                          ) || 0;
                                        const childCount =
                                          Number(
                                            responseData?.Passenger_info?.Child
                                          ) || 0;
                                        const total = basePrice * childCount;

                                        return `₹${total.toFixed(2)}`;
                                      })()}
                                    </>
                                  )}
                                  {ReturnSourceType === "Tbo" && (
                                    <>
                                      ₹
                                      {PerPassReturnTboFareData.find(
                                        (item) => item.PassengerType === 2
                                      )?.BaseFare?.toFixed(2) || "0.00"}
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="clear" />
                        </div>
                      )}
                      {responseData?.Passenger_info?.Infant > 0 && (
                        <div className="chk-line relative items-start gap-2">
                          <span className="chk-l">
                            Infant X {responseData?.Passenger_info?.Infant}
                          </span>
                          <span className="chk-r">
                            <button
                              className="cursor-pointer"
                              onClick={() => setShowTooltip5((prev) => !prev)}
                            >
                              <img
                                src="../img/i_icon.svg"
                                alt="Info"
                                className="w-4 h-4 cursor-pointer mt-1"
                              />
                            </button>
                          </span>
                          {showTooltip5 && (
                            <div
                              className="absolute right-0 top-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-sm z-50 w-40 "
                              onMouseLeave={() => setShowTooltip5(false)}
                            >
                              <div className="flex gap-2">
                                <p className="font-semibold text-xs text-gray-800 mb-1">
                                  Onward Airlines:
                                </p>
                                <span className="chk-r">
                                  {OnwardSourceType === "Uapi" && (
                                    <>
                                      {(() => {
                                        const airPricingInfos = Array.isArray(
                                          FareData?.AirPricingInfo
                                        )
                                          ? FareData.AirPricingInfo
                                          : FareData?.AirPricingInfo
                                            ? [FareData.AirPricingInfo]
                                            : [];

                                        const adultPricing =
                                          airPricingInfos.find((info) => {
                                            const passengerTypes =
                                              info?.["air:PassengerType"];
                                            const passengerTypeArray =
                                              Array.isArray(passengerTypes)
                                                ? passengerTypes
                                                : passengerTypes
                                                  ? [passengerTypes]
                                                  : [];

                                            return passengerTypeArray.some(
                                              (pt) => pt?.$?.Code === "INF"
                                            );
                                          });

                                        const basePriceStr =
                                          adultPricing?.$?.Fees || "INR0.00";
                                        const basePrice =
                                          parseFloat(
                                            basePriceStr
                                              .replace("INR", "")
                                              .replace(",", "")
                                          ) || 0;
                                        const infantCount =
                                          Number(
                                            responseData?.Passenger_info?.Infant
                                          ) || 0;
                                        const total = basePrice * infantCount;

                                        return `₹${total.toFixed(2)}`;
                                      })()}
                                    </>
                                  )}
                                  {OnwardSourceType === "Tbo" && (
                                    <>
                                      ₹
                                      {PerPassOnwardTboFareData.find(
                                        (item) => item.PassengerType === 3
                                      )?.BaseFare?.toFixed(2) || "0.00"}
                                    </>
                                  )}
                                </span>
                              </div>

                              <hr className="my-2" />

                              <div className="flex gap-2">
                                <p className="font-semibold text-xs text-gray-800 mb-1 flex">
                                  Return Airlines:
                                </p>
                                <span className="chk-r">
                                  {ReturnSourceType === "Uapi" && (
                                    <>
                                      {(() => {
                                        const airPricingInfos = Array.isArray(
                                          ReturnFareData?.AirPricingInfo
                                        )
                                          ? ReturnFareData.AirPricingInfo
                                          : ReturnFareData?.AirPricingInfo
                                            ? [ReturnFareData.AirPricingInfo]
                                            : [];

                                        const adultPricing =
                                          airPricingInfos.find((info) => {
                                            const passengerTypes =
                                              info?.["air:PassengerType"];
                                            const passengerTypeArray =
                                              Array.isArray(passengerTypes)
                                                ? passengerTypes
                                                : passengerTypes
                                                  ? [passengerTypes]
                                                  : [];

                                            return passengerTypeArray.some(
                                              (pt) => pt?.$?.Code === "INF"
                                            );
                                          });

                                        const basePriceStr =
                                          adultPricing?.$?.Fees || "INR0.00";
                                        const basePrice =
                                          parseFloat(
                                            basePriceStr
                                              .replace("INR", "")
                                              .replace(",", "")
                                          ) || 0;
                                        const infantCount =
                                          Number(
                                            responseData?.Passenger_info?.Infant
                                          ) || 0;
                                        const total = basePrice * infantCount;

                                        return `₹${total.toFixed(2)}`;
                                      })()}
                                    </>
                                  )}
                                  {ReturnSourceType === "Tbo" && (
                                    <>
                                      ₹
                                      {PerPassReturnTboFareData.find(
                                        (item) => item.PassengerType === 3
                                      )?.BaseFare?.toFixed(2) || "0.00"}
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="clear" />
                        </div>
                      )}

                      <div className="chk-line relative items-start gap-2">
                        <div className="chk-l">27GST</div>
                        <span className="chk-r">
                          <button
                            className="cursor-pointer"
                            onClick={() => setShowTooltip6((prev) => !prev)}
                          >
                            <img
                              src="../img/i_icon.svg"
                              alt="Info"
                              className="w-4 h-4 cursor-pointer mt-1"
                            />
                          </button>
                        </span>
                        {showTooltip6 && (
                          <div
                            className="absolute right-0 top-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-sm z-50 w-40 "
                            onMouseLeave={() => setShowTooltip6(false)}
                          >
                            <div className="flex gap-2">
                              <p className="font-semibold text-xs text-gray-800 mb-1">
                                Onward Airlines:
                              </p>
                              <span className="chk-r">
                                {OnwardSourceType === "Uapi" && (
                                  <>{replaceINRWithSymbol(FareData?.Taxes)}</>
                                )}
                                {OnwardSourceType === "Tbo" && (
                                  <>
                                    ₹{replaceINRWithSymbol(OnwaredTboFare?.Tax)}
                                  </>
                                )}
                              </span>
                            </div>

                            <hr className="my-2" />

                            <div className="flex gap-2">
                              <p className="font-semibold text-xs text-gray-800 mb-1 flex">
                                Return Airlines:
                              </p>
                              <span className="chk-r">
                                {ReturnSourceType === "Uapi" && (
                                  <>
                                    {replaceINRWithSymbol(
                                      ReturnFareData?.Taxes
                                    )}
                                  </>
                                )}
                                {ReturnSourceType === "Tbo" && (
                                  <>
                                    ₹{replaceINRWithSymbol(ReturnTboFare?.Tax)}
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="clear" />
                      </div>

                      <div className="chk-line relative items-start gap-2">
                        <div className="chk-l">Others</div>
                        <span className="chk-r">
                          <button
                            className="cursor-pointer"
                            onClick={() => setShowTooltip7((prev) => !prev)}
                          >
                            <img
                              src="../img/i_icon.svg"
                              alt="Info"
                              className="w-4 h-4 cursor-pointer mt-1"
                            />
                          </button>
                        </span>
                        {showTooltip7 && (
                          <div
                            className="absolute right-0 top-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-sm z-50 w-40 "
                            onMouseLeave={() => setShowTooltip7(false)}
                          >
                            <div className="flex gap-2">
                              <p className="font-semibold text-xs text-gray-800 mb-1">
                                Onward Airlines:
                              </p>
                              <span className="chk-r">
                                {OnwardSourceType === "Uapi" && (
                                  <>
                                    {replaceINRWithSymbol(
                                      FareData?.OtherCharges?.toFixed(2) || 0.0
                                    )}
                                  </>
                                )}
                                {OnwardSourceType === "Tbo" && (
                                  <>
                                    ₹
                                    {replaceINRWithSymbol(
                                      OnwaredTboFare?.OtherCharges?.toFixed(2)
                                    )}
                                  </>
                                )}
                              </span>
                            </div>

                            <hr className="my-2" />

                            <div className="flex gap-2">
                              <p className="font-semibold text-xs text-gray-800 mb-1 flex">
                                Return Airlines:
                              </p>
                              <span className="chk-r">
                                {ReturnSourceType === "Uapi" && (
                                  <>
                                    {replaceINRWithSymbol(
                                      ReturnFareData?.OtherCharges?.toFixed(
                                        2
                                      ) || 0.0
                                    )}
                                  </>
                                )}
                                {ReturnSourceType === "Tbo" && (
                                  <>
                                    ₹
                                    {replaceINRWithSymbol(
                                      ReturnTboFare?.OtherCharges?.toFixed(2)
                                    )}
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="clear" />
                      </div>
                      {/* <div className="chk-line relative items-start gap-2">
                          <div className="chk-l">Fees</div>
                           <span className="chk-r">
                            <button
                              className="cursor-pointer"
                              onClick={() => setShowTooltip8((prev) => !prev)}
                            >
                              <img
                                src="../img/i_icon.svg"
                                alt="Info"
                                className="w-4 h-4 cursor-pointer mt-1"
                              />
                            </button>
                          </span>
                              {showTooltip8 && (
                            <div
                              className="absolute right-0 top-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-sm z-50 w-40 "
                              onMouseLeave={() => setShowTooltip8(false)}
                            >
                              <div className="flex gap-2">
                                <p className="font-semibold text-xs text-gray-800 mb-1">
                                  Onward Airlines:
                                </p>
                                <span className="chk-r">
                                  {OnwardSourceType === "Uapi" && (
                                    <>
                                         {replaceINRWithSymbol(FareData?.Fees?.toFixed(2) || 0.0)}
                                    </>
                                  )}
                                  {OnwardSourceType === "Tbo" && (
                                    <>
                                      
                                    ₹{replaceINRWithSymbol(OnwaredTboFare?.OtherCharges?.toFixed(2))}
                                    </>
                                  )}
                                </span>
                              </div>

                              <hr className="my-2" />

                              <div className="flex gap-2">
                                <p className="font-semibold text-xs text-gray-800 mb-1 flex">
                                  Return Airlines:
                                </p>
                                <span className="chk-r">
                                  {ReturnSourceType === "Uapi" && (
                                    <>
                                      {replaceINRWithSymbol(ReturnFareData?.Fees?.toFixed(2) || 0.0)}
                                    </>
                                  )}
                                  {ReturnSourceType === "Tbo" && (
                                    <>
                                      ₹
                                    {replaceINRWithSymbol(ReturnTboFare?.OtherCharges?.toFixed(2))}
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                          )}
                        <span className="chk-r">
                          {replaceINRWithSymbol(FareData?.Fees) || 0.0}
                        </span>
                        <div className="clear" />
                      </div> */}

                      <div className="chk-line relative items-start gap-2">
                        <div className="chk-l">Extra Services</div>
                        <span className="chk-r">
                          <button
                            className="cursor-pointer"
                            onClick={() => setShowTooltip8((prev) => !prev)}
                          >
                            <img
                              src="../img/i_icon.svg"
                              alt="Info"
                              className="w-4 h-4 cursor-pointer mt-1"
                            />
                          </button>
                        </span>
                        {showTooltip8 && (
                          <div
                            className="absolute right-0 top-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-sm z-50 w-40 "
                            onMouseLeave={() => setShowTooltip8(false)}
                          >
                            <div className="flex gap-2">
                              <p className="font-semibold text-xs text-gray-800 mb-1">
                                Onward Airlines:
                              </p>
                              <span className="chk-r">
                                {OnwardSourceType === "Uapi" && (
                                  <>₹{totalServicePrice}</>
                                )}
                                {OnwardSourceType === "Tbo" && (
                                  <>₹{totalServicePrice}</>
                                )}
                              </span>
                            </div>

                            <hr className="my-2" />

                            <div className="flex gap-2">
                              <p className="font-semibold text-xs text-gray-800 mb-1 flex">
                                Return Airlines:
                              </p>
                              <span className="chk-r">
                                {ReturnSourceType === "Uapi" && (
                                  <>₹{totalServicePrice}</>
                                )}
                                {ReturnSourceType === "Tbo" && (
                                  <>₹{totalServicePrice}</>
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                        {/* <span className="chk-r">₹{totalServicePrice}</span> */}
                        <div className="clear" />
                      </div>
                    </div>
                    {/* <div className="chk-total">
                      <div className="chk-total-l">Total Price</div>
                      <div className="chk-total-r" style={{ fontWeight: 700 }}>
                    
                        {(() => {
                          const basePrice =
                            parseFloat(
                              (FareData?.TotalPrice || "").replace(
                                /[^\d.]/g,
                                ""
                              )
                            ) || 0;
                          const grandTotal = basePrice + totalServicePrice;
                          return `₹${grandTotal.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`;
                        })()}
                      </div>
                      <div className="clear" />
                    </div> */}
                    <div className="chk-total">
                      <div className="chk-total-l">Total Price</div>
                      <div className="chk-total-r" style={{ fontWeight: 700 }}>
                        {(() => {
                          // Helper to safely extract numeric price
                          const parsePrice = (value) =>
                            parseFloat(
                              (value || "").toString().replace(/[^\d.]/g, "")
                            ) || 0;

                          // ---- Onward fare ----
                          let onwardFare = 0;
                          if (OnwardSourceType === "Uapi") {
                            onwardFare = parsePrice(
                              FareData?.TotalPrice || FareData?.PublishedFare
                            );
                          } else if (OnwardSourceType === "Tbo") {
                            onwardFare = parsePrice(
                              OnwaredTboFare?.PublishedFare ||
                              OnwaredTboFare?.TotalPrice
                            );
                          }

                          // ---- Return fare ----
                          let returnFare = 0;
                          if (ReturnSourceType === "Uapi") {
                            returnFare = parsePrice(
                              ReturnFareData?.TotalPrice ||
                              ReturnFareData?.PublishedFare
                            );
                          } else if (ReturnSourceType === "Tbo") {
                            returnFare = parsePrice(
                              ReturnTboFare?.PublishedFare ||
                              ReturnTboFare?.TotalPrice
                            );
                          }

                          // ---- Grand total ----
                          const grandTotal =
                            onwardFare + returnFare + totalServicePrice;

                          return `₹${grandTotal.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`;
                        })()}
                      </div>
                      <div className="clear" />
                    </div>
                  </div>
                </div>
                {[
                  selectedMeals.length > 0,
                  selectedBaggage.length > 0,
                  selectedSeats.length > 0,
                ].filter(Boolean).length >= 1 && (
                    <div className="checkout-coll">
                      <div className="chk-details">
                        <h2 className="mt-0">Breakdown Of Extra Services</h2>
                        <div className="chk-detais-row">
                          {selectedMeals.length > 0 && (
                            <div className="chk-line">
                              <span className="chk-l">
                                Meal X {selectedMeals.length}
                              </span>
                              <span className="chk-r">
                                <span className="chk-r">₹ {totalMealPrice}</span>
                              </span>
                              <div className="clear" />
                            </div>
                          )}
                          {selectedBaggage.length > 0 && (
                            <div className="chk-line">
                              <span className="chk-l">
                                Baggage X {selectedBaggage.length}
                              </span>
                              <span className="chk-r">
                                <span className="chk-r">
                                  ₹ {totalBaggagePrice}
                                </span>
                              </span>
                              <div className="clear" />
                            </div>
                          )}
                          {selectedSeats.length > 0 && (
                            <div className="chk-line">
                              <span className="chk-l">
                                Seat X {selectedSeats.length}
                              </span>
                              <span className="chk-r">
                                <span className="chk-r">₹ {totalSeatPrice}</span>
                              </span>
                              <div className="clear" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
              </div>
              <div className="clear" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnBookingFlow;
