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

const FlightUapibookingflow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const base_url = `${CONFIG.BASE_URL}`;
  const [savedPassengers, setSavedPassengers] = useState([]);
  const formRefs = useRef([]);
  const stored = sessionStorage.getItem("PriceResponse");
  const responseData = JSON.parse(stored);
  console.log("responseData", responseData);
  const timeoutRef = useRef(null);
  const hasFetchedRef = useRef(false);
  const ClientPriceValue = responseData?.ClientPrice || 0;
  // console.log(ClientPriceValue);
  const TaxivaxiFlightDetails = responseData?.FlightDetails;
  const TaxivaxiPassengeDetails = responseData?.FlightDetails?.Passengerdetails;
  // console.log(TaxivaxiPassengeDetails);
  const bookingid = responseData?.FlightDetails?.bookingid;
  const FlightType = responseData?.FlightType;
  const is_gst_benefit = responseData?.FlightDetails?.is_gst_benefit;
  const clientid = responseData?.FlightDetails?.clientid;
  const fare_type = responseData?.faretype;
  const [accordion1Expanded, setAccordion1Expanded] = useState(true);
  const [accordion2Expanded, setAccordion2Expanded] = useState(false);
  const [accordion3Expanded, setAccordion3Expanded] = useState(false);
  const [accordion4Expanded, setAccordion4Expanded] = useState(false);
  const [accordion5Expanded, setAccordion5Expanded] = useState(false);
  const [accordion6Expanded, setAccordion6Expanded] = useState(false);
  const [isPassengerSaved, setIsPassengerSaved] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [Segments, SetSegment] = useState([]);
  const [SeatData, setSeatdata] = useState([]);
  const [MealData, setMealData] = useState([]);
  const [FareData, setFareData] = useState([]);
  const [FlightData, setFlightData] = useState([]);
  const [BaggageData, setBaggageData] = useState([]);
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
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedBaggage, setSelectedBaggage] = useState([]);
  const [selectedPassengerIndex, setSelectedPassengerIndex] = useState(0);
  const [selectedSegmentKey, setSelectedSegmentKey] = useState(0);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [PassengerDetails, setPassengerDetails] = useState([]);
  const [Countrydata, setCountrydata] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [Optionalservice, setOptionalservice] = useState([]);
  const [selectedPassengerKey, setSelectedPassengerKey] = useState("");
  const [PassengerInfo, setPassengerInfo] = useState([]);
  const [Seatloading, setSeatloading] = useState(false);
  const [TraceId, setTraceId] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [showError, setShowError] = useState(false);
  const [IsLCC, setIsLCC] = useState("");
  const [Pricekey, setPriceKey] = useState("");
  const [gst_k3, setGst_k3] = useState("");
  const [CancellationData1G, setcancellationData1G] = useState([]);
  const [finalbookresponse, setfinalbookresponse] = useState([]);
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
            key: responseData.key,
            traceId: responseData.traceId,
            source_type: responseData.source_type,
            isLCC: responseData.IsLCC,
          },
          passengerDetails: responseData.passengerDetails,
        };

        SetSegment(responseData.segments);

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
            const token = Data.data.onward.traceId;
            setTraceId(token);
            const Key = Data.data.onward.key;
            setPriceKey(Key);
            const LCC = Data.data.onward.isLCC;
            setIsLCC(LCC);
            const responseData = Data.data.onward.priceRequestResponse;
            // console.log(responseData)
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
              setOptionalservice(Optionalservice);
            }
            if (responseData?.AirPriceResult) {
              const fare = responseData?.AirPriceResult;
              // console.log(fare)
              setFareData(fare);
            }
            if (responseData?.AirPriceResult?.TaxInfo) {
              const gstObj = responseData.AirPriceResult.TaxInfo.find(
                (t) => t.$?.CarrierDefinedCategory === "27GST"
              );

              const gst = gstObj
                ? Number(gstObj.$.Amount.replace("INR", ""))
                : 0;

              // console.log(tax);
              setGst_k3(gst);
            }

            if (
              responseData?.priceRequestResponse?.AirPriceResult
                ?.OptionalServices?.Baggage
            ) {
              const baggagedata =
                responseData.priceRequestResponse?.AirPriceResult
                  ?.OptionalServices?.Baggage;
              // console.log(baggagedata)
              setBaggageData(baggagedata);
            }
          }
          if (Array.isArray(Data?.data?.onward)) {
            Swal.fire({
              title: "Error",
              text: Data.data.onward[0],
              iconHtml: '<i class="fa fa-exclamation" aria-hidden="true"></i>',
              confirmButtonText: "Try Again",
              allowOutsideClick: false,
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
              allowOutsideClick: false,
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
            allowOutsideClick: false,
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
      // console.log(Data)
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
    const allPassengers = [];
    const passengerinfo = [];

    const remainingPassengerDetails = [...responseData.passengerDetails];

    let isValid = true; // Track overall form validity
    let firstAdultEmail = "";
    let firstAdultContact = "";
    passengerList.forEach((passenger, index) => {
      const form = formRefs.current[index];
      attachLiveErrorHandlers(form);

      if (!form) return;

      const codeMap = {
        Adult: "ADT",
        Child: "CNN",
        Infant: "INF",
      };
      const matchCode = codeMap[passenger.type];

      // // ---------- Validation ----------
      // First Name
      const firstNameInput = form.querySelector(
        'input[name="adult_first_name[]"]'
      );
      const firstNameError = form.querySelector(".adult_first_name-message");
      if (firstNameInput && !firstNameInput.value.trim()) {
        firstNameError.style.display = "block";
        isValid = false;
      } else if (firstNameError) {
        firstNameError.style.display = "none";
      }

      // Last Name
      const lastNameInput = form.querySelector(
        'input[name="adult_last_name[]"]'
      );
      const lastNameError = form.querySelector(".adult_last_name-message");
      if (lastNameInput && !lastNameInput.value.trim()) {
        lastNameError.style.display = "block";
        isValid = false;
      } else if (lastNameError) {
        lastNameError.style.display = "none";
      }

      // Email (only for Adults)
      const emailInput = form.querySelector('input[name="email1"]');
      const emailError = emailInput?.nextElementSibling;
      if (
        passenger.type === "Adult" &&
        emailInput &&
        !emailInput.value.trim()
      ) {
        emailError.style.display = "block";
        isValid = false;
      } else if (emailError) {
        emailError.style.display = "none";
      }

      // Phone (only for Adults)
      const phoneInput = form.querySelector(".phone-input input");
      const phoneError = form.querySelector(".booking-mobile .error-message");
      if (passenger.type === "Adult" && phoneInput) {
        const phoneValue = phoneInput.value.trim();
        const digits = phoneValue.replace(/\D/g, "");
        const localNumber = digits.slice(-10);
        if (digits.length <= 10 || !/^\d{10}$/.test(localNumber)) {
          phoneError.textContent = "Please Enter a valid Mobile Number .";
          phoneError.style.display = "block";
          isValid = false;
        } else {
          phoneError.style.display = "none";
        }
      }
      // Gender
      const genderSelect = form.querySelector('select[name="adult_gender[]"]');
      const genderValue = genderSelect?.value || "";

      if (
        (passenger.type === "Adult" ||
          passenger.type === "Child" ||
          passenger.type === "Infant") &&
        genderSelect
      ) {
        let genderError =
          genderSelect.parentElement.querySelector(".error-message");

        if (genderValue === "") {
          if (!genderError) {
            genderError = document.createElement("span");
            genderError.className = "error-message";
            genderError.style.color = "red";
            genderError.textContent = "Please Select Gender.";
            genderSelect.parentElement.appendChild(genderError);
          }

          genderError.style.display = "block";
          isValid = false;
        } else if (genderError) {
          genderError.style.display = "none";
        }
      }
      if (FlightType === "International") {
        // Passport No
        const passportInput = form.querySelector(
          'input[name="adult_passportNo[]"]'
        );
        const passportError = form.querySelector(".adult_passportNo-message");
        if (!passportInput || !passportInput.value.trim()) {
          passportError.textContent = "Please enter Passport Number.";
          passportError.style.display = "block";
          isValid = false;
        } else {
          passportError.style.display = "none";
        }

        // Issued Country (React Select)
        const issuedCountryInput = form.querySelector(
          'input[name="adult_issuedcountry[]"]'
        );
        const issuedCountryError = form.querySelector(
          ".adult_issuedcountry-message"
        );
        if (!issuedCountryInput || !issuedCountryInput.value.trim()) {
          issuedCountryError.textContent = "Please select Issued Country.";
          issuedCountryError.style.display = "block";
          isValid = false;
        } else {
          issuedCountryError.style.display = "none";
        }

        // Passport Expiry
        const passportExpiryInput = form.querySelector(
          'input[name="adult_passportexpiry[]"]'
        );
        const passportExpiryError = form.querySelector(
          ".adult_passportexpiry-message"
        );

        if (!passportExpiryInput || !passportExpiryInput.value.trim()) {
          passportExpiryError.textContent = "Please select Passport Expiry.";
          passportExpiryError.style.display = "block";
          isValid = false;
        } else {
          passportExpiryError.style.display = "none";
        }
      }

      const dobInput = form.querySelector('input[name="adult_age[]"]');
      if (passenger.type === "Infant" && (!dobInput || !dobInput.value)) {
        dobInput.style.border = "1px solid red";
        isValid = false;
      } else if (dobInput) {
        dobInput.style.border = "";
      }
      if (!isValid) return;

      // ---------- Data Collection ----------
      const passengerData = {
        type: passenger.type,
        prefix:
          form.querySelector('select[name="adult_prefix[]"]')?.value || "",
        firstName: firstNameInput?.value || "",
        lastName: lastNameInput?.value || "",
        dob: dobInput?.value || "",
        age: calculateAge(dobInput?.value),
        email: emailInput?.value || "",
        contact:
          phoneNumbers ||
          `+91${TaxivaxiPassengeDetails[0].employee_contact}` ||
          "",
        gender: genderValue,
        flyerName: form.querySelector('input[name="flyername"]')?.value || "",
        flyerNumber:
          form.querySelector('input[name="flyernumber"]')?.value || "",
        code: matchCode,
        passportno:
          form.querySelector('input[name="adult_passportNo[]"]')?.value || "",
        passportexpiry:
          form.querySelector('input[name="adult_passportexpiry[]"]')?.value ||
          "",
        issuedcountry:
          form.querySelector('input[name="adult_issuedcountry[]"]')?.value ||
          "",
      };

      const matchIndex = remainingPassengerDetails.findIndex(
        (detail) => detail.Code === matchCode
      );

      if (matchIndex !== -1) {
        passengerData.Key = remainingPassengerDetails[matchIndex].Key;
        remainingPassengerDetails.splice(matchIndex, 1);
      } else {
        passengerData.Key = "";
      }
      if (
        passenger.type === "Adult" &&
        !firstAdultEmail &&
        passengerData.email &&
        passengerData.contact
      ) {
        firstAdultEmail = passengerData.email;
        firstAdultContact = passengerData.contact;
      }

      if (passenger.type !== "Adult") {
        passengerData.email = firstAdultEmail;
        passengerData.contact = firstAdultContact;
        delete passengerData.prefix;
      }
      // if (passenger.type !== 'Infant') {
      //   delete passengerData.dob;
      // }

      const Info = {
        Code: matchCode,
        Key: passengerData.Key,
        Prefix: passengerData.prefix || "",
        First: passengerData.firstName,
        Last: passengerData.lastName,
      };

      passengerinfo.push(Info);
      allPassengers.push(passengerData);
    });

    if (!isValid) {
      const firstError = document.querySelector(
        '.error-message[style*="block"]'
      );
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    if (isValid && !phoneError) {
      setIsPassengerSaved(true);
      setAccordion1Expanded(false);
      setAccordion5Expanded(true);
      // setAccordion5Expanded(true);
      // setAccordion1Expanded(false);
    }

    setPassengerInfo(passengerinfo);
    setPassengerData(allPassengers);
    // console.log('Passenger Details', allPassengers)
  };

  useEffect(() => {
    if (PassengerData && PassengerData.length > 0) {
      setSelectedPassengerIndex(0);
      setSelectedPassengerKey(PassengerData[0].Key);
    }
  }, [PassengerData]);

  const handleTabChange = (event, newValue) => {
    setSelectedSegmentKey(newValue);
  };

  //Meals
  const currentPassengerMeals = selectedMeals.filter(
    (m) =>
      m.passengerIndex === selectedPassengerIndex &&
      m.segmentKey ===
        Optionalservice?.find((s) => s.Key === selectedPassengerKey)?.Segment?.[
          selectedSegmentKey
        ]?.Key
  );
  console.log(currentPassengerMeals);
  // useEffect(() => {
  //   const totalPassengers = PassengerData.filter(
  //     (p) => p.type !== "Infant"
  //   ).length;

  //   const hasMealForCurrent = selectedMeals.some(
  //     (m) => m.passengerIndex === selectedPassengerIndex
  //   );

  //   if (hasMealForCurrent && selectedPassengerIndex < totalPassengers - 1) {
  //     setSelectedPassengerIndex((prev) => prev + 1);
  //   }
  // }, [selectedMeals]);
  useEffect(() => {
    if (Array.isArray(MealData) && MealData.length > 0 && MealData[0]?.Meal) {
      const firstKey = `${MealData[0].Meal.Origin}-${MealData[0].Meal.Destination}`;
      setSelectedSegmentKey(firstKey);
    }
  }, [MealData]);
  const handleSaveMeal = () => {
    // console.log('Saving meals:', selectedMeals);

    const formattedData = PassengerData.map((passenger, index) => {
      const passengerMeals = selectedMeals.filter(
        (m) => m.passengerIndex === index
      );

      return {
        passenger: `${passenger.firstName} ${passenger.lastName}`,
        meals: passengerMeals.map((m) => ({
          segment: m.meal.Key,
          traceid: m.meal.traceId,
          mealName: m.meal.DisplayText,
          price: m.meal.TotalPrice,
        })),
      };
    });

    // console.log('Formatted Meal Data:', formattedData);
  };

  //Baggage
  // const [sharedBaggage, setSharedBaggage] = useState([]);

  // const handleAddBaggage = (baggage, baggageIndex) => {
  //   setSelectedBaggage((prev) => {
  //     const existing = prev.find(
  //       (b) =>
  //         b.passengerIndex === selectedPassengerIndex &&
  //         b.segmentKey === selectedSegmentKey &&
  //         b.baggageIndex === baggageIndex
  //     );

  //     if (existing) {
  //       return prev.map((b) =>
  //         b.passengerIndex === selectedPassengerIndex &&
  //         b.segmentKey === selectedSegmentKey &&
  //         b.baggageIndex === baggageIndex
  //           ? { ...b, quantity: b.quantity + 1 }
  //           : b
  //       );
  //     }

  //     return [
  //       ...prev,
  //       {
  //         passengerIndex: selectedPassengerIndex,
  //         segmentKey: selectedSegmentKey,
  //         baggageIndex,
  //         baggage,
  //         quantity: 1,
  //       },
  //     ];
  //   });
  // };

  // const handleRemoveBaggage = (baggageIndex) => {
  //   setSelectedBaggage((prev) =>
  //     prev
  //       .map((b) =>
  //         b.passengerIndex === selectedPassengerIndex &&
  //         b.segmentKey === selectedSegmentKey &&
  //         b.baggageIndex === baggageIndex
  //           ? { ...b, quantity: b.quantity - 1 }
  //           : b
  //       )
  //       .filter((b) => b.quantity > 0)
  //   );
  // };
  const handleAddBaggage = (baggage, baggageIndex) => {
    const baggageItem = BaggageData[baggageIndex];

    setSelectedBaggage((prev) => {
      const filtered = prev.filter(
        (item) =>
          !(
            item.passengerIndex === selectedPassengerIndex &&
            item.segmentKey === selectedSegmentKey
          )
      );

      return [
        ...filtered,
        {
          passengerIndex: selectedPassengerIndex,
          segmentKey: selectedSegmentKey,
          baggageIndex,
          baggage,
          ...baggageItem,
          quantity: 1,
        },
      ];
    });

    // ✅ MOVE TO NEXT PASSENGER
    const nonInfants = PassengerData.filter((p) => p.type !== "Infant");

    if (selectedPassengerIndex < nonInfants.length - 1) {
      const nextIndex = selectedPassengerIndex + 1;
      setSelectedPassengerIndex(nextIndex);
      setSelectedPassengerKey(nonInfants[nextIndex].Key);
    }
  };

  const handleRemoveBaggage = (baggageIndex) => {
    const key = {
      passengerIndex: selectedPassengerIndex,
      segmentKey: selectedSegmentKey,
      baggageIndex,
    };

    setSelectedBaggage((prev) =>
      prev
        .map((item) => {
          if (
            item.passengerIndex === key.passengerIndex &&
            item.segmentKey === key.segmentKey &&
            item.baggageIndex === key.baggageIndex
          ) {
            return { ...item, quantity: Math.max(item.quantity - 1, 0) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  //Seat Api
  const SeatFetch = async () => {
    setAccordion2Expanded(false);
    const requestData = {
      onwardKeys: {
        key: responseData.key,
        traceId: TraceId,
        isLCC: responseData.IsLCC,
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
      const responseData = Data.data.onwards.seatsData.Rows;
      setSeatdata(responseData);
      setSeatloading(false);
      setShowModal(false);
    } catch {
      setSeatloading(false);
    }
  };
  const [currentFlightIndex, setCurrentFlightIndex] = useState(0);

  const handlePrev = () => {
    setCurrentFlightIndex((prev) =>
      prev > 0 ? prev - 1 : SeatData[0]?.Segments.length - 1
    );
  };

  const handleNext = () => {
    setCurrentFlightIndex((prev) =>
      prev < SeatData[0]?.Segments.length - 1 ? prev + 1 : 0
    );
  };
  const parsePrice = (price) => {
    if (typeof price === "string") {
      return parseFloat(price.replace(/[^\d.]/g, "")) || 0;
    }
    return Number(price) || 0;
  };

  const totalMealPrice = selectedMeals.reduce((total, item) => {
    return total + parsePrice(item.meal.TotalPrice);
  }, 0);

  const totalBaggagePrice = selectedBaggage.reduce((total, item) => {
    return total + parsePrice(item.baggage.TotalPrice);
  }, 0);

  const totalSeatPrice = selectedSeats.reduce((total, item) => {
    return total + parsePrice(item.seatPrice);
  }, 0);

  const totalServicePrice = totalMealPrice + totalBaggagePrice + totalSeatPrice;

  // ================= TAX =================
  const Tax = FareData?.Taxes || "INR0";
  const totalTax = Number(Tax.replace("INR", "")) || 0;

  // ================= TOTAL PRICE =================
  const GetTotalPrice = FareData?.TotalPrice || "INR0";
  const totalPrice2 = Number(GetTotalPrice.replace("INR", "")) || 0;

  // ================= BASE PRICE =================
  const basePrice =
    Number((FareData?.BasePrice || "INR0").replace("INR", "")) || 0;

  // ================= CLIENT PRICE =================
  const passengerCount = TaxivaxiPassengeDetails?.length || 0;
  console.log("passengerCount",passengerCount);
  const pricePerPax = Number(ClientPriceValue) || 0;
console.log("price",pricePerPax);
  const clientPrice = pricePerPax * passengerCount;
  console.log("clientPrice",clientPrice);
  // ================= CALCULATIONS =================
  const Markup = clientPrice - totalPrice2;

  const OtherCharges = totalTax - gst_k3;

  const TotalPrice = totalPrice2 + Markup + totalServicePrice;

  const otherchargeswithmarkup = OtherCharges + Markup;

  // ================= DISPLAY (ONLY HERE) =================
  console.log("Markup:", Markup.toFixed(2));
  // console.log("TotalPrice:", TotalPrice.toFixed(2));
  // console.log(
  //   "Other Charges with Markup:",
  //   otherchargeswithmarkup.toFixed(2)
  // );

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
  console.log(selectedBaggage);
  console.log(selectedMeals);
  const BaggageInfo = selectedBaggage.map((item) => ({
    service_traceId: item.baggage.traceId,
    service_index: item.baggage.Key,
  }));
  const MealInfo = selectedMeals.map((item) => ({
    service_traceId: item.meal.traceId,
    service_index: item.meal.Key,
  }));
  // Combine array of meal and bagage service key
  const ServiceInfo = BaggageInfo.concat(MealInfo);
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
      allowOutsideClick: false,
    });

    if (!result.isConfirmed) {
      return; // Stop the booking if user cancels
    }

    const passInfo = PassengerData.map((da) => {
      return {
        Key: da?.Key,
        Code: da?.code,
        Number: da?.contact,
        EmailID: da?.email,
        First: da?.firstName,
        Gender: da?.gender,
        Last: da?.lastName,
        Prefix: da?.prefix,
        Age: da?.age,
        Dob: da?.dob,
        PassportExpiry: da.passportexpiry,
        PassportNo: da.passportno,
      };
    });
    const SeatInfo = selectedSeats.map((da) => {
      return da.seat;
    });
    const requestData = {
      onwardKeys: {
        source_type: responseData.source_type,
        traceId: TraceId,
        key: Pricekey || "",
        isLCC: IsLCC,
        Optional_services: ServiceInfo,
        Seats_services: SeatInfo,
      },
      passengerDetails: passInfo,
    };
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
      const onward = Data?.data?.onward;
      // const ret = Data?.data?.returns;

      // CASE: API sent error (string instead of object)
      if (typeof onward === "string") {
        Swal.fire({
          title: "Error",
          text:
            typeof onward === "string"
              ? onward
              : "An unexpected error occurred during booking.",
          iconHtml: '<i class="fa fa-exclamation" aria-hidden="true"></i>',
          confirmButtonText: "Try Again",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            if (bookingid) {
              navigate("/SearchFlight", {
                state: { responseData: TaxivaxiFlightDetails },
              });
            } else {
              window.location.href = "/";
            }
          }
        });

        return; // IMPORTANT
      }
      if (Data.status == true) {
        const LocatorCode = Data.data.LocatorCode;
        // console.log('passenger', PassengerInfo)
        localStorage.setItem("Passengerdetails", JSON.stringify(PassengerInfo));
        setLocatorcode(LocatorCode);
        const fares = {
          markupValue: Markup,
          ClientPriceValue: ClientPriceValue,
          total_ex_tax_fees: basePrice,
          tax_and_fees: OtherCharges,
          gst_k3: gst_k3,
        };
        const responseData = TaxivaxiFlightDetails;
        const FlightBooking = Data.data;
        navigate("/UapibookingCompleted", {
          state: { FlightBooking, responseData, fares },
        });
      }

      if (Data.status == false || Data.status == "error") {
        Swal.fire({
          title: "Error",
          text: Data.message,
          iconHtml: '<i class="fa fa-exclamation" aria-hidden="true"></i>',
          confirmButtonText: "Try Again",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            if (bookingid) {
              const responseData = TaxivaxiFlightDetails;
              navigate("/SearchFlight", { state: { responseData } });
            } else {
              // Otherwise, go to home page
              window.location.href = "/";
            }
          }
        });
      }
      setfinalloading(false);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        iconHtml: '<i class="fa fa-exclamation" aria-hidden="true"></i>',
        confirmButtonText: "OK",
        allowOutsideClick: false,
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
  // const handleseatbuttonskip = () => {
  //   setAccordion3Expanded(false);
  // };
  // const handlebaggagebuttonskip = () => {
  //   setAccordion4Expanded(false);
  //   setAccordion6Expanded(true);
  // };
  const handleseatbuttonskip = () => {
    setAccordion3Expanded(false);
    // ✅ FORCE first passenger ACTIVE
    setSelectedPassengerIndex(0);

    const firstNonInfantPassenger = PassengerData.find(
      (p) => p.type !== "Infant"
    );

    if (firstNonInfantPassenger) {
      setSelectedPassengerKey(firstNonInfantPassenger.Key);
    }
  };
  const handlebaggagebuttonskip = () => {
    setAccordion4Expanded(false);
    setAccordion6Expanded(true);
    // ✅ FORCE first passenger ACTIVE
    setSelectedPassengerIndex(0);

    const firstNonInfantPassenger = PassengerData.find(
      (p) => p.type !== "Infant"
    );

    if (firstNonInfantPassenger) {
      setSelectedPassengerKey(firstNonInfantPassenger.Key);
    }
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
    if (!price) return "";
    return price.replace("INR", "₹");
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
                              <span className="headingpolicies">
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
                            {Segments.map((data, index) => (
                              <div
                                key={index}
                                className="row"
                                style={{
                                  border: "1px solid #e3e3e3",
                                  margin: "0% 0%",
                                }}
                              >
                                <div className="booking-form bagg-form-details">
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
                                        <span className="airportname text-black font-bold">
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
                                        <span className="airportname text-black font-bold">
                                          {data?.Destination?.Airport?.CityName}
                                        </span>
                                        <span className="airport">
                                          {
                                            data?.Destination?.Airport
                                              ?.AirportName
                                          }{" "}
                                          {data?.Destination?.Airport?.Terminal}
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
                                        {cancelItem.fare_name} (
                                        {cancelItem.airline_short_name})
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
                                        {dateChangeItem.fare_name}(
                                        {dateChangeItem.airline_short_name})
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
                                      <td>{cancelItem.PenaltyApplies}</td>
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
                                      <td>{cancelItem.PenaltyApplies}</td>
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
                                                ]?.lastName || TaxivaxiPassengeDetails?.[
                                                  formIndex
                                                ]?.firstName
                                                  ? TaxivaxiPassengeDetails[
                                                      formIndex
                                                    ].lastName || TaxivaxiPassengeDetails?.[
                                                  formIndex
                                                ]?.firstName
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
                                              Date Of Birth{" "}
                                              <span>
                                                {" "}
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
                            {/* <Accordion defaultExpanded expanded={accordion5Expanded} onChange={(event, isExpanded) => setAccordion5Expanded(isExpanded)}> */}
                            <Accordion
                              expanded={accordion5Expanded}
                              disabled={!isPassengerSaved}
                              onChange={(event, isExpanded) => {
                                if (isPassengerSaved) {
                                  setAccordion5Expanded(isExpanded);
                                }
                              }}
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
                            {/* <Accordion expanded={accordion2Expanded} onChange={(event, isExpanded) => setAccordion2Expanded(isExpanded)}> */}
                            <Accordion
                              expanded={accordion2Expanded}
                              disabled={!isPassengerSaved}
                              onChange={(event, isExpanded) => {
                                if (isPassengerSaved) {
                                  setAccordion2Expanded(isExpanded);
                                }
                              }}
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
                        {/* <Accordion expanded={accordion4Expanded}
                            onChange={(event, isExpanded) => {
                              if (Optionalservice[0]?.Segment.length > 1) {
                                setAccordion4Expanded(isExpanded)
                                if (isExpanded) {
                                  setSelectedPassengerIndex(0);
                                }
                              }
                              else {
                                if (Optionalservice[0]?.Segment[0]?.OptionalServices?.Baggage) {
                                  setAccordion4Expanded(isExpanded)
                                  if (isExpanded) {
                                    setSelectedPassengerIndex(0);
                                  }
                                }
                              }
                            }}
                          > */}
                        <Accordion
                          expanded={accordion4Expanded}
                          disabled={!isPassengerSaved}
                          onChange={(event, isExpanded) => {
                            if (!isPassengerSaved) return;

                            if (Optionalservice[0]?.Segment.length > 1) {
                              setAccordion4Expanded(isExpanded);
                              if (isExpanded) setSelectedPassengerIndex(0);
                            } else {
                              if (
                                Optionalservice[0]?.Segment[0]?.OptionalServices
                                  ?.Baggage
                              ) {
                                setAccordion4Expanded(isExpanded);
                                if (isExpanded) setSelectedPassengerIndex(0);
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
                              {Optionalservice[0]?.Segment[0]?.OptionalServices
                                ?.Baggage ? (
                                ""
                              ) : Optionalservice[0]?.Baggage ? (
                                ""
                              ) : (
                                <span className="extradisabled mb-0">
                                  Extra Baggage selections are not allowed
                                </span>
                              )}
                              {selectedBaggage.length > 0 ? (
                                <>
                                  <span className="text-sm text-gray-500 ">
                                    &nbsp; ({selectedBaggage.length} Selected)
                                  </span>
                                  <Tooltip
                                    title={
                                      <div className="text-sm p-2">
                                        {selectedBaggage.map((b, index) => {
                                          return (
                                            <div
                                              key={index}
                                              className="flex justify-between items-center gap-4"
                                            >
                                              <div>{b.baggage.DisplayText}</div>
                                              <div>
                                                {replaceINRWithSymbol(
                                                  b.baggage.TotalPrice
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })}
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
                          <AccordionDetails className="flex gap-6  ">
                            <div className="w-1/4 border-r pr-4 flex flex-col gap-3 ">
                              {PassengerData.filter(
                                (passenger) => passenger.type !== "Infant"
                              ).map((passenger, index) => {
                                const passengerBaggage = selectedBaggage.find(
                                  (m) => m.passengerIndex === index
                                );
                                // console.log(selectedBaggage)
                                return (
                                  <button
                                    key={index}
                                    type="button"
                                    className={`p-3 rounded-lg border text-left ${
                                      index === selectedPassengerIndex
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
                                      {
                                        // selectedBaggage
                                        //   .filter(
                                        //     (b) => b.passengerIndex === index && b.segmentKey === selectedSegmentKey
                                        //   )
                                        //   .map((b) => `${b.baggage.DisplayText} x${b.quantity}`)
                                        //   .join(', ') || 'Not Selected'
                                        selectedBaggage
                                          .filter(
                                            (b) =>
                                              b.passengerIndex === index &&
                                              b.segmentKey ===
                                                selectedSegmentKey
                                          )
                                          .map(
                                            (b) =>
                                              `${b.baggage.DisplayText} x${b.quantity}`
                                          )
                                          .join(", ") || "Not Selected"
                                      }
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                            <div className="w-3/4">
                              <div className="flex flex-col   h-[400px] overflow-y-auto">
                                {(() => {
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
                                  const baggage = [];
                                  if (passengerService?.Segment.length > 1) {
                                    baggage.push(passengerService?.Baggage);
                                  } else {
                                    baggage.push(
                                      segmentData?.OptionalServices?.Baggage
                                    );
                                  }
                                  const modBag = baggage[0];
                                  if (modBag != undefined) {
                                    return modBag.map((Baggage, idx) => {
                                      // const currentSelected = selectedBaggage.find(
                                      //   (b) =>
                                      //     b.passengerIndex === selectedPassengerIndex &&
                                      //     b.segmentKey === selectedSegmentKey &&
                                      //     b.baggageIndex === idx
                                      // );
                                      const currentSelected =
                                        selectedBaggage.find(
                                          (b) =>
                                            b.passengerIndex ===
                                              selectedPassengerIndex &&
                                            b.segmentKey ===
                                              selectedSegmentKey &&
                                            b.baggageIndex === idx
                                        );

                                      const quantity =
                                        currentSelected?.quantity || 0;

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

                                          {/* <div className="flex items-center gap-4">
                                            <div className="text-sm font-semibold text-black">
                                              {replaceINRWithSymbol(
                                                Baggage?.TotalPrice
                                              )}
                                            </div>
                                            <div className="flex items-center gap-2 baggageoptionbuttons">
                                              {quantity == 0 ? (
                                                <button
                                                  type="button"
                                                  className="px-4 py-1 text-sm border rounded-full text-purple-600 border-purple-600"
                                                  onClick={() =>
                                                    handleAddBaggage(
                                                      Baggage,
                                                      idx
                                                    )
                                                  } // pass index
                                                >
                                                  Add
                                                </button>
                                              ) : (
                                                <>
                                                  <button
                                                    type="button"
                                                    className="px-2 py-1 text-sm border rounded-full text-purple-600 border-purple-600"
                                                    onClick={() =>
                                                      handleRemoveBaggage(idx)
                                                    } // pass index
                                                  >
                                                    -
                                                  </button>
                                                  <span className="w-5 text-center">
                                                    {quantity}
                                                  </span>
                                                </>
                                              )}
                                            </div>
                                          </div> */}

                                          <div className="flex items-center gap-4">
                                            <div className="text-sm font-semibold text-black">
                                              {replaceINRWithSymbol(
                                                Baggage?.TotalPrice
                                              )}
                                            </div>
                                            <div className="flex items-center gap-2 baggageoptionbuttons">
                                              {quantity == 0 ? (
                                                <button
                                                  type="button"
                                                  className="px-4 py-1 text-sm border rounded-full text-purple-600 border-purple-600"
                                                  onClick={() =>
                                                    handleAddBaggage(
                                                      Baggage,
                                                      idx
                                                    )
                                                  } // pass index
                                                >
                                                  Add
                                                </button>
                                              ) : (
                                                <>
                                                  <button
                                                    type="button"
                                                    className="px-2 py-1 text-sm border rounded-full text-purple-600 border-purple-600"
                                                    onClick={() =>
                                                      handleRemoveBaggage(idx)
                                                    } // pass index
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
                          disabled={!isPassengerSaved}
                          onChange={(event, isExpanded) => {
                            if (!isPassengerSaved) return;

                            if (
                              Optionalservice[0]?.Segment[0]?.OptionalServices
                                ?.MealOrBeverage
                            ) {
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

                              {!Optionalservice[0]?.Segment[0]?.OptionalServices
                                ?.MealOrBeverage ? (
                                <span className="extradisabled">
                                  Meal not provided
                                </span>
                              ) : currentPassengerMeals.length > 0 ? (
                                <>
                                  <span className="text-sm text-gray-500">
                                    &nbsp; ({selectedMeals.length} Selected)
                                  </span>

                                  <Tooltip
                                    title={
                                      <div className="text-sm p-2">
                                        {currentPassengerMeals.map(
                                          (meals, index) => (
                                            <div
                                              key={index}
                                              className="flex justify-between items-center gap-4"
                                            >
                                              <div>
                                                {meals.meal.DisplayText}
                                              </div>
                                              <div>
                                                {replaceINRWithSymbol(
                                                  meals.meal.TotalPrice
                                                )}
                                              </div>
                                            </div>
                                          )
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
                              {PassengerData.filter(
                                (passenger) => passenger.type !== "Infant"
                              ) // Adjust key if needed
                                .map((passenger, index) => {
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
                                  const passengerMeal = selectedMeals.find(
                                    (m) =>
                                      m.passengerIndex === index &&
                                      m.segmentKey === segmentKey
                                  );
                                  // console.log(selectedMeals)
                                  return (
                                    <button
                                      key={index}
                                      type="button"
                                      className={`p-3 rounded-lg border text-left ${
                                        index === selectedPassengerIndex
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
                                        {passengerMeal
                                          ? `Selected: ${
                                              passengerMeal.meal.DisplayText ||
                                              "No Meal"
                                            }`
                                          : "Meal: Not Selected"}
                                      </span>
                                    </button>
                                  );
                                })}
                            </div>

                            <div className="w-3/4">
                              {Optionalservice?.length > 0 &&
                                Optionalservice[0]?.Segment?.length > 0 && (
                                  <div className="mb-4">
                                    <Tabs
                                      value={selectedSegmentKey}
                                      onChange={handleTabChange}
                                      variant="scrollable"
                                      // scrollButtons="auto"
                                    >
                                      {Optionalservice[0].Segment.map(
                                        (segment, index) => {
                                          const segmentData = segment;

                                          const origin =
                                            segmentData?.Origin
                                              ?.airport_municipality ||
                                            "Unknown Origin";
                                          const destination =
                                            segmentData?.Destination
                                              ?.airport_municipality ||
                                            "Unknown Destination";

                                          return (
                                            <Tab
                                              key={segment.key}
                                              label={`${origin} → ${destination}`}
                                              value={index}
                                            />
                                          );
                                        }
                                      )}
                                    </Tabs>
                                  </div>
                                )}
                              <div>
                                <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                                  {(() => {
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
                                    const meals =
                                      segmentData?.OptionalServices
                                        ?.MealOrBeverage || [];
                                    return meals.map((meal, idx) => (
                                      <>
                                        {meals.length == 0 ? (
                                          <div className="flex items-center justify-between border rounded-2xl p-2 mb-3">
                                            <div className="flex items-center gap-2">
                                              Meals Not Available
                                            </div>
                                          </div>
                                        ) : (
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
                                                className={`px-4 py-1 border rounded-xl text-sm ${
                                                  selectedMeals.some(
                                                    (m) =>
                                                      m.passengerIndex ===
                                                        selectedPassengerIndex &&
                                                      m.segmentKey ===
                                                        segmentKey &&
                                                      m.meal === meal
                                                  )
                                                    ? "text-white bg-violet-600 border-violet-600"
                                                    : "text-violet-600 border-violet-300"
                                                }`}
                                                // onClick={() => {
                                                //   setSelectedMeals((prev) => {
                                                //     const exists = prev.find(
                                                //       (m) =>
                                                //         m.passengerIndex ===
                                                //           selectedPassengerIndex &&
                                                //         m.segmentKey ===
                                                //           segmentKey &&
                                                //         m.mealIndex === idx
                                                //     );

                                                //     // REMOVE if already selected
                                                //     if (exists) {
                                                //       return prev.filter(
                                                //         (m) =>
                                                //           !(
                                                //             m.passengerIndex ===
                                                //               selectedPassengerIndex &&
                                                //             m.segmentKey ===
                                                //               segmentKey &&
                                                //             m.mealIndex === idx
                                                //           )
                                                //       );
                                                //     }

                                                //     // ADD
                                                //     return [
                                                //       ...prev,
                                                //       {
                                                //         passengerIndex:
                                                //           selectedPassengerIndex,
                                                //         segmentKey,
                                                //         mealIndex: idx,
                                                //         meal,
                                                //       },
                                                //     ];
                                                //   });
                                                // }}
                                                onClick={() => {
                                                  setSelectedMeals((prev) => {
                                                    const exists = prev.find(
                                                      (m) =>
                                                        m.passengerIndex ===
                                                          selectedPassengerIndex &&
                                                        m.segmentKey ===
                                                          segmentKey &&
                                                        m.mealIndex === idx
                                                    );

                                                    // REMOVE
                                                    if (exists) {
                                                      return prev.filter(
                                                        (m) =>
                                                          !(
                                                            m.passengerIndex ===
                                                              selectedPassengerIndex &&
                                                            m.segmentKey ===
                                                              segmentKey &&
                                                            m.mealIndex === idx
                                                          )
                                                      );
                                                    }

                                                    // ADD
                                                    return [
                                                      ...prev,
                                                      {
                                                        passengerIndex:
                                                          selectedPassengerIndex,
                                                        segmentKey,
                                                        mealIndex: idx,
                                                        meal,
                                                      },
                                                    ];
                                                  });

                                                  // ✅ AUTO MOVE TO NEXT PASSENGER (SAFE)
                                                  const nonInfantPassengers =
                                                    PassengerData.filter(
                                                      (p) => p.type !== "Infant"
                                                    );

                                                  if (
                                                    selectedPassengerIndex <
                                                    nonInfantPassengers.length -
                                                      1
                                                  ) {
                                                    const nextIndex =
                                                      selectedPassengerIndex +
                                                      1;
                                                    const nextPassenger =
                                                      nonInfantPassengers[
                                                        nextIndex
                                                      ];

                                                    setTimeout(() => {
                                                      setSelectedPassengerIndex(
                                                        nextIndex
                                                      );
                                                      setSelectedPassengerKey(
                                                        nextPassenger.Key
                                                      );
                                                    }, 150);
                                                  }
                                                }}
                                              >
                                                {selectedMeals.some(
                                                  (m) =>
                                                    m.passengerIndex ===
                                                      selectedPassengerIndex &&
                                                    m.segmentKey ===
                                                      segmentKey &&
                                                    m.meal === meal
                                                )
                                                  ? "Added"
                                                  : "Add"}
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    ));
                                  })()}
                                </div>
                              </div>
                              <div className="add-passenger">
                                <button
                                  type="button"
                                  id="save-passenger-btn"
                                  className="passenger-submit"
                                  onClick={() => {
                                    handleSaveMeal();
                                    setAccordion6Expanded(false);
                                    setAccordion3Expanded(true);
                                    // ✅ FORCE first passenger ACTIVE
                                    setSelectedPassengerIndex(0);

                                    const firstNonInfantPassenger =
                                      PassengerData.find(
                                        (p) => p.type !== "Infant"
                                      );

                                    if (firstNonInfantPassenger) {
                                      setSelectedPassengerKey(
                                        firstNonInfantPassenger.Key
                                      );
                                    }

                                    // open seat accordion
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

                          {/* <Accordion expanded={accordion3Expanded}
                            onChange={(event, isExpanded) => {
                              if (SeatData.length > 0) {
                                setAccordion3Expanded(isExpanded)
                                if (isExpanded) {
                                  setSelectedPassengerIndex(0);
                                }
                              }
                            }}> */}
                          <Accordion
                            expanded={accordion3Expanded}
                            disabled={!isPassengerSaved}
                            onChange={(event, isExpanded) => {
                              if (isPassengerSaved) {
                                setAccordion3Expanded(isExpanded);
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
                                {SeatData.length == 0 ? (
                                  <span className="extradisabled">
                                    No Seats Available To Choose
                                  </span>
                                ) : selectedSeats.length > 0 ? (
                                  <>
                                    <span className="text-sm text-gray-500 ">
                                      &nbsp; ({selectedSeats.length} Selected)
                                    </span>
                                    <Tooltip
                                      title={
                                        <div className="text-sm p-2">
                                          {selectedSeats.map((seat, index) => {
                                            return (
                                              <div
                                                key={index}
                                                className="flex justify-between items-center gap-4"
                                              >
                                                <div>{seat.seatCode}</div>
                                                <div>
                                                  {replaceINRWithSymbol(
                                                    seat.seatPrice
                                                  )}
                                                </div>
                                              </div>
                                            );
                                          })}
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
                                    {PassengerData.filter(
                                      (passenger) => passenger.type !== "Infant"
                                    ) // Adjust key if needed
                                      .map((passenger, index) => {
                                        const passengerService = SeatData?.find(
                                          (service) =>
                                            service.TravellerKey ===
                                            selectedPassengerKey
                                        );
                                        const segmentIndex = currentFlightIndex;
                                        const segmentData =
                                          passengerService?.Segments?.[
                                            segmentIndex
                                          ];
                                        const segmentkey = segmentData?.Key;
                                        const selectedSeat = selectedSeats.find(
                                          (m) =>
                                            m.passengerIndex === index &&
                                            m.segmentKey === segmentkey
                                        );
                                        // console.log(selectedSeats)
                                        return (
                                          <button
                                            key={index}
                                            type="button"
                                            className={`seatleftli tablinkseat ${
                                              selectedPassengerIndex === index
                                                ? "active"
                                                : ""
                                            }`}
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
                                              {selectedSeat?.seatPrice || "NA"}
                                            </span>
                                          </button>
                                        );
                                      })}
                                  </div>
                                </div>
                                {SeatData.length > 0 && (
                                  <div className="tabcontentseat">
                                    <div className="seatright">
                                      <div
                                        className="card-body"
                                        style={{ padding: "0px" }}
                                      >
                                        <div className="seat_selection">
                                          <>
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

                                            {(() => {
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
                                                      onClick={handlePrev}
                                                    >
                                                      {"<<"}
                                                    </button>
                                                  )}
                                                  {currentFlightIndex <
                                                    totalFlights - 1 && (
                                                    <button
                                                      type="button"
                                                      className="seatnextbutton"
                                                      onClick={handleNext}
                                                    >
                                                      {">>"}
                                                    </button>
                                                  )}
                                                </>
                                              );
                                            })()}

                                            <div style={{ display: "block" }}>
                                              <div className="plane passenger">
                                                {(() => {
                                                  const flight = SeatData?.find(
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
                                                          {flight.FlightNumber})
                                                          -
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
                                                      Object.keys(rowMap).sort(
                                                        (a, b) => +a - +b
                                                      );
                                                    const sortedSeatLetters =
                                                      Array.from(
                                                        seatLettersSet
                                                      ).sort();

                                                    return (
                                                      <>
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
                                                                    if (!seat) {
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

                                                                    // ⛔ Skip paid seats if isLCC is false
                                                                    const shouldDisable =
                                                                      isUnavailable ||
                                                                      (!IsLCC &&
                                                                        numericSeatPrice >
                                                                          0) ||
                                                                      selectedSeats.some(
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
                                                                          name={`optionalkeys`}
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
                                                                          checked={selectedSeats.some(
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
                                                                          // onChange={() => {
                                                                          //   setSelectedSeats(
                                                                          //     (
                                                                          //       prev
                                                                          //     ) => {
                                                                          //       const filtered =
                                                                          //         prev.filter(
                                                                          //           (
                                                                          //             s
                                                                          //           ) =>
                                                                          //             !(
                                                                          //               s.passengerIndex ===
                                                                          //                 selectedPassengerIndex &&
                                                                          //               s.segmentKey ===
                                                                          //                 segmentkey
                                                                          //             )
                                                                          //         );
                                                                          //       return [
                                                                          //         ...filtered,
                                                                          //         {
                                                                          //           passengerIndex:
                                                                          //             selectedPassengerIndex,
                                                                          //           segmentKey:
                                                                          //             segmentkey,
                                                                          //           seatCode,
                                                                          //           seatPrice,
                                                                          //           seat,
                                                                          //         },
                                                                          //       ];
                                                                          //     }
                                                                          //   );
                                                                          // }}
                                                                          onChange={() => {
                                                                            // 1️⃣ Save seat
                                                                            setSelectedSeats(
                                                                              (
                                                                                prev
                                                                              ) => {
                                                                                const filtered =
                                                                                  prev.filter(
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
                                                                                return [
                                                                                  ...filtered,
                                                                                  {
                                                                                    passengerIndex:
                                                                                      selectedPassengerIndex,
                                                                                    segmentKey:
                                                                                      segmentkey,
                                                                                    seatCode,
                                                                                    seatPrice,
                                                                                    seat,
                                                                                  },
                                                                                ];
                                                                              }
                                                                            );

                                                                            // 2️⃣ AUTO MOVE TO NEXT PASSENGER (ONLY HERE)
                                                                            const nonInfantPassengers =
                                                                              PassengerData.filter(
                                                                                (
                                                                                  p
                                                                                ) =>
                                                                                  p.type !==
                                                                                  "Infant"
                                                                              );

                                                                            const nextIndex =
                                                                              selectedPassengerIndex +
                                                                              1;

                                                                            if (
                                                                              nextIndex <
                                                                              nonInfantPassengers.length
                                                                            ) {
                                                                              setTimeout(
                                                                                () => {
                                                                                  setSelectedPassengerIndex(
                                                                                    nextIndex
                                                                                  );
                                                                                  setSelectedPassengerKey(
                                                                                    nonInfantPassengers[
                                                                                      nextIndex
                                                                                    ]
                                                                                      .Key
                                                                                  );
                                                                                },
                                                                                150
                                                                              );
                                                                            }
                                                                          }}
                                                                        />
                                                                        <label
                                                                          htmlFor={
                                                                            seatCode
                                                                          }
                                                                          className={`${
                                                                            numericSeatPrice >
                                                                            0
                                                                              ? "paid"
                                                                              : "free"
                                                                          } ${
                                                                            isUnavailable
                                                                              ? "unavailable"
                                                                              : "available"
                                                                          }`}
                                                                          title={`[${seatCode}] ${
                                                                            !IsLCC &&
                                                                            numericSeatPrice >
                                                                              0
                                                                              ? "After ticketing paid seats will be available"
                                                                              : isUnavailable
                                                                              ? "Unavailable"
                                                                              : `${seatPrice} Available`
                                                                          }`}
                                                                        ></label>
                                                                        <span className="tooltip">
                                                                          {/* {isUnavailable ? 'Unavailable' : 'Available'} [{seatCode}] ₹{seatPrice} */}
                                                                          {!IsLCC &&
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
                      <a href="#">
                        <div>
                          {FlightData?.Origin?.OriginAirline
                            ?.OperatingCarrier ===
                          FlightData?.Destination?.DestinationAirline
                            ?.OperatingCarrier ? (
                            <img
                              className={`airlineimg`}
                              src={`https://devapi.taxivaxi.com/airline_logo_images/${FlightData?.Origin?.OriginAirline?.OperatingCarrier}.png`}
                              alt="Airline logo"
                              width="40px"
                            />
                          ) : (
                            <div className="flex inline-block">
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
                          {/* Render flight numbers associated with the current carrier */}
                          <span className="flightnumber">
                            {/* {FlightData?.Origin?.OriginAirline?.AirlineCode}   {FlightData?.Origin?.OriginAirline?.FlightNumber} */}
                            {FlightData?.Origin?.OriginAirline?.FlightNumber ===
                              FlightData?.Destination?.DestinationAirline
                                ?.FlightNumber &&
                            FlightData?.Origin?.OriginAirline?.AirlineCode ===
                              FlightData?.Destination?.DestinationAirline
                                ?.AirlineCode ? (
                              <>
                                {FlightData?.Origin?.OriginAirline?.AirlineCode}{" "}
                                {
                                  FlightData?.Origin?.OriginAirline
                                    ?.FlightNumber
                                }
                              </>
                            ) : (
                              <>
                                {FlightData?.Origin?.OriginAirline?.AirlineCode}{" "}
                                {
                                  FlightData?.Origin?.OriginAirline
                                    ?.FlightNumber
                                }{" "}
                                <br />
                                {
                                  FlightData?.Destination?.DestinationAirline
                                    ?.AirlineCode
                                }{" "}
                                {
                                  FlightData?.Destination?.DestinationAirline
                                    ?.FlightNumber
                                }
                              </>
                            )}
                          </span>
                        </div>
                      </a>
                    </div>
                    <div className="checkout-headr">
                      <div className="checkout-headrb">
                        <div className="checkout-headrp">
                          <div className="chk-left">
                            <div className="chk-lbl">
                              <a href="#">
                                {" "}
                                {
                                  FlightData?.Origin?.OriginAirport?.Airport
                                    ?.CityName
                                }{" "}
                                -
                                {
                                  FlightData?.Origin?.OriginAirport?.Airport
                                    ?.AirportName
                                }{" "}
                                {
                                  FlightData?.Origin?.OriginAirport?.Airport
                                    ?.Terminal
                                }{" "}
                                -{" "}
                                {
                                  FlightData?.Destination?.DestinationAirport
                                    ?.Airport?.CityName
                                }{" "}
                                -
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
                            <div className="chk-lbl-a">One Way Trip</div>
                          </div>
                          <div className="clear" />
                        </div>
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
                      <div className="chk-fligth-devider" />
                      <div className="chk-arrival">
                        <span />
                        <b>
                          {handleweekdatemonthyear(
                            FlightData?.Destination?.DestinationAirport?.ArrTime
                          )}
                        </b>
                      </div>
                      <div className="clear" />
                    </div>
                  </div>

                  <div className="chk-details">
                    <h2>Details</h2>
                    <div className="chk-detais-row">
                      <div className="chk-line">
                        <span className="chk-l">Airlines:</span>
                        <span className="chk-r">
                          {FlightData?.Origin?.OriginAirline?.AirlineName ===
                          FlightData?.Destination?.DestinationAirline
                            ?.AirlineName ? (
                            <>
                              {FlightData?.Origin?.OriginAirline?.AirlineName}
                            </>
                          ) : (
                            <>
                              {FlightData?.Origin?.OriginAirline?.AirlineName}{" "}
                              <br />
                              {
                                FlightData?.Destination?.DestinationAirline
                                  ?.AirlineName
                              }
                            </>
                          )}
                        </span>
                        <div className="clear" />
                      </div>
                      <div className="chk-line">
                        <span className="chk-l">Cabin Class:</span>
                        <span className="chk-r">
                          {responseData?.CabinClass}
                        </span>
                        <div className="clear" />
                      </div>
                      {responseData?.Passenger_info?.Adult > 0 && (
                        <div className="chk-line">
                          <span className="chk-l">
                            Adult X {responseData?.Passenger_info?.Adult}
                          </span>
                          <span className="chk-r">
                            <span className="chk-r">
                              {(() => {
                                const airPricingInfos = Array.isArray(
                                  FareData?.AirPricingInfo
                                )
                                  ? FareData.AirPricingInfo
                                  : FareData?.AirPricingInfo
                                  ? [FareData.AirPricingInfo]
                                  : [];

                                const adultPricing = airPricingInfos.find(
                                  (info) => {
                                    const passengerTypes =
                                      info?.["air:PassengerType"];
                                    const passengerTypeArray = Array.isArray(
                                      passengerTypes
                                    )
                                      ? passengerTypes
                                      : passengerTypes
                                      ? [passengerTypes]
                                      : [];

                                    return passengerTypeArray.some(
                                      (pt) => pt?.$?.Code === "ADT"
                                    );
                                  }
                                );

                                const basePriceStr =
                                  adultPricing?.$?.BasePrice || "INR0.00";
                                const basePrice =
                                  parseFloat(
                                    basePriceStr
                                      .replace("INR", "")
                                      .replace(",", "")
                                  ) || 0;
                                const adultCount =
                                  Number(responseData?.Passenger_info?.Adult) ||
                                  0;
                                const total = basePrice * adultCount;

                                return `₹${total.toFixed(2)}`;
                              })()}
                            </span>
                          </span>
                          <div className="clear" />
                        </div>
                      )}
                      {responseData?.Passenger_info?.Child > 0 && (
                        <div className="chk-line">
                          <span className="chk-l">
                            Child X {responseData?.Passenger_info?.Child}
                          </span>
                          <span className="chk-r">
                            <span className="chk-r">
                              {(() => {
                                const airPricingInfos = Array.isArray(
                                  FareData?.AirPricingInfo
                                )
                                  ? FareData.AirPricingInfo
                                  : FareData?.AirPricingInfo
                                  ? [FareData.AirPricingInfo]
                                  : [];

                                const adultPricing = airPricingInfos.find(
                                  (info) => {
                                    const passengerTypes =
                                      info?.["air:PassengerType"];
                                    const passengerTypeArray = Array.isArray(
                                      passengerTypes
                                    )
                                      ? passengerTypes
                                      : passengerTypes
                                      ? [passengerTypes]
                                      : [];

                                    return passengerTypeArray.some(
                                      (pt) => pt?.$?.Code === "CNN"
                                    );
                                  }
                                );

                                const basePriceStr =
                                  adultPricing?.$?.BasePrice || "INR0.00";
                                const basePrice =
                                  parseFloat(
                                    basePriceStr
                                      .replace("INR", "")
                                      .replace(",", "")
                                  ) || 0;
                                const childCount =
                                  Number(responseData?.Passenger_info?.Child) ||
                                  0;
                                const total = basePrice * childCount;

                                return `₹${total.toFixed(2)}`;
                              })()}
                            </span>
                          </span>
                          <div className="clear" />
                        </div>
                      )}
                      {responseData?.Passenger_info?.Infant > 0 && (
                        <div className="chk-line">
                          <span className="chk-l">
                            Infant X {responseData?.Passenger_info?.Infant}
                          </span>
                          <span className="chk-r">
                            <span className="chk-r">
                              {/* ₹ {FareData?.BaseFare?.toFixed(2)} */}
                              {/* ₹ {PerPassFareData.find(item => item.PassengerType === 3)?.BaseFare?.toFixed(2) || '0.00'} */}
                              {(() => {
                                const airPricingInfos = Array.isArray(
                                  FareData?.AirPricingInfo
                                )
                                  ? FareData.AirPricingInfo
                                  : FareData?.AirPricingInfo
                                  ? [FareData.AirPricingInfo]
                                  : [];

                                const adultPricing = airPricingInfos.find(
                                  (info) => {
                                    const passengerTypes =
                                      info?.["air:PassengerType"];
                                    const passengerTypeArray = Array.isArray(
                                      passengerTypes
                                    )
                                      ? passengerTypes
                                      : passengerTypes
                                      ? [passengerTypes]
                                      : [];

                                    return passengerTypeArray.some(
                                      (pt) => pt?.$?.Code === "INF"
                                    );
                                  }
                                );

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
                            </span>
                          </span>
                          <div className="clear" />
                        </div>
                      )}

                      <div className="chk-line">
                        <div className="chk-line-item">
                          <span className="chk-l">27GST</span>
                          <span className="chk-r">
                            {/* {replaceINRWithSymbol(FareData?.Taxes)} */}₹{" "}
                            {gst_k3}
                          </span>
                          <div className="clear" />
                        </div>
                      </div>

                      <div className="chk-line">
                        <span className="chk-l">Others</span>
                        <span className="chk-r">
                          {/* ₹ {FareData?.OtherCharges?.toFixed(2) || 0.0} */}₹{" "}
                          {otherchargeswithmarkup.toFixed(2) || 0.0}
                        </span>
                        <div className="clear" />
                      </div>
                      {/* <div className="chk-line">
                        <span className="chk-l">Fees</span>
                        <span className="chk-r">
                          ₹ {replaceINRWithSymbol(FareData?.Fees) || 0.0}
                        </span>
                        <div className="clear" />
                      </div> */}

                      <div className="chk-line">
                        <span className="chk-l">Extra Services </span>
                        <span className="chk-r">₹{totalServicePrice}</span>
                        <div className="clear" />
                      </div>
                      <div className="chk-line">
                        <span className="chk-l">Client Price (per pax) </span>
                        <span className="chk-r">₹{ClientPriceValue}</span>
                        <div className="clear" />
                      </div>
                    </div>
                    <div className="chk-total">
                      <div className="chk-total-l">Total Price</div>
                      <div className="chk-total-r" style={{ fontWeight: 700 }}>
                        {/* {replaceINRWithSymbol(FareData?.TotalPrice)} */}
                        {/* {(() => {
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
                        })()} */}
                        ₹ {TotalPrice}
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
                              Meal X {selectedMeals.length}{" "}
                              <Tooltip
                                title={
                                  <div className="text-sm p-2">
                                    {currentPassengerMeals.map(
                                      (meals, index) => (
                                        <div
                                          key={index}
                                          className="flex justify-between items-center gap-4"
                                        >
                                          <div>{meals.meal.DisplayText}</div>
                                          <div>
                                            {replaceINRWithSymbol(
                                              meals.meal.TotalPrice
                                            )}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                }
                                arrow
                              >
                                <IconButton
                                  size="small"
                                  sx={{ padding: "2px" }}
                                >
                                  <InfoOutlinedIcon sx={{ fontSize: "14px" }} />
                                </IconButton>
                              </Tooltip>
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
                              Baggage X {selectedBaggage.length}{" "}
                              <Tooltip
                                title={
                                  <div className="text-sm p-2">
                                    {selectedBaggage.map((b, index) => {
                                      return (
                                        <div
                                          key={index}
                                          className="flex justify-between items-center gap-4"
                                        >
                                          <div>{b.baggage.DisplayText}</div>
                                          <div>
                                            {replaceINRWithSymbol(
                                              b.baggage.TotalPrice
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                }
                                arrow
                              >
                                <IconButton
                                  size="small"
                                  sx={{ padding: "2px" }}
                                >
                                  <InfoOutlinedIcon sx={{ fontSize: "14px" }} />
                                </IconButton>
                              </Tooltip>
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
                              Seat X {selectedSeats.length}{" "}
                              <Tooltip
                                title={
                                  <div className="text-sm p-2">
                                    {selectedSeats.map((seat, index) => {
                                      return (
                                        <div
                                          key={index}
                                          className="flex justify-between items-center gap-4"
                                        >
                                          <div>{seat.seatCode}</div>
                                          <div>
                                            {replaceINRWithSymbol(
                                              seat.seatPrice
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                }
                                arrow
                              >
                                <IconButton
                                  size="small"
                                  sx={{ padding: "2px" }}
                                >
                                  <InfoOutlinedIcon sx={{ fontSize: "14px" }} />
                                </IconButton>
                              </Tooltip>
                            </span>
                            <span className="chk-r">
                              <span className="chk-r">₹ {totalSeatPrice} </span>
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

export default FlightUapibookingflow;
