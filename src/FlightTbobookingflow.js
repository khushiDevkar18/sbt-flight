import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CONFIG from "./config";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
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
import { Check } from "@mui/icons-material";

const FlightTbobookingflow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const base_url = `${CONFIG.BASE_URL}`;
  const formRefs = useRef([]);
  const gstFormRef = useRef(null);
  const timeoutRef = useRef(null);
  const hasFetched = useRef(false);
  const stored = sessionStorage.getItem("PriceResponse");
  const responseData = JSON.parse(stored);
  const TaxivaxiFlightDetails = responseData?.FlightDetails;
  const TaxivaxiPassengeDetails = responseData?.FlightDetails?.Passengerdetails;
  const bookingid = responseData?.FlightDetails?.bookingid;
  const is_gst_benefit = responseData?.FlightDetails?.is_gst_benefit;
  // console.log(responseData);
  const clientid = responseData?.FlightDetails?.clientid;
  // console.log(responseData)
  const ClientPriceValue = responseData?.ClientPrice || 0;
  const [accordion1Expanded, setAccordion1Expanded] = useState(true);
  const [accordion2Expanded, setAccordion2Expanded] = useState(false);
  const [accordion3Expanded, setAccordion3Expanded] = useState(false);
  const [accordion4Expanded, setAccordion4Expanded] = useState(false);
  const [accordion5Expanded, setAccordion5Expanded] = useState(false);
  const [accordion6Expanded, setAccordion6Expanded] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [Segments, SetSegment] = useState([]);
  const [SeatData, setSeatdata] = useState([]);
  const [MealData, setMealData] = useState([]);
  const [FareData, setFareData] = useState([]);
  const [PerPassFareData, setPerPassFareData] = useState([]);
  const [FlightData, setFlightData] = useState([]);
  const [BaggageData, setBaggageData] = useState([]);
  const [CancellationData, setcancellationData] = useState([]);
  const [Policy, setpolicy] = useState([]);
  const [PassengerData, setPassengerData] = useState([]);
  const [PassengerDetails, setPassengerDetails] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [showError, setShowError] = useState(false);
  const [Countrydata, setCountrydata] = useState([]);
  const FlightType = responseData.FlightType;
  const [gstForm, setGstForm] = useState({
    gstin: "",
    company_name: "",
    company_address: "",
    company_contact: "",
    company_email: "flight@cotrav.co",
  });
  const [GstEntries, setGstEntries] = useState([]);
  const [loadingg, setLoadingg] = useState(false);
  const [Finalloading, setfinalloading] = useState(false);
  const [maxDate, setMaxDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSegmentKey, setSelectedSegmentKey] = useState("");
  const [selectedPassengerIndex, setSelectedPassengerIndex] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [ismealfree, setismealfree] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBaggage, setSelectedBaggage] = useState([]);
  const [traceId, settraceId] = useState("");
  const [ResultIndex, setResultIndex] = useState("");
  const [CheckLCC, setCheckLCC] = useState("");
  const [isPassengerSaved, setIsPassengerSaved] = useState(false);
  useEffect(() => {
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    setMaxDate(formattedToday);
    fetchGstData();
  }, []);
  useEffect(() => {
    setLoadingg(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a timeout to delay the API call slightly
    timeoutRef.current = setTimeout(() => {
      const FetchOptions = async () => {
        const requestData = {
          onwardKeys: {
            key: responseData.key,
            traceId: responseData.traceId,
            source_type: responseData.source_type,
          },
        };
        // SetSegment(responseData.segments)
        try {
          const response = await fetch(`${base_url}makePriceRequest`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const Data = await response.json();
          const responseData = Data.data.onward;

          if (Data.status) {
            if (
              responseData.FareRule_Response?.FareRules.length == 0 ||
              responseData.FareQuote_Response?.Error?.ErrorCode != 0 ||
              responseData?.FlightSSR_Response?.Error?.ErrorCode != 0
            ) {
              const error = "Your session is expired, Search again.";
              Swal.fire({
                title: "Error",
                text: `${error}`,
                iconHtml:
                  '<i class="fa fa-exclamation"  style="font-size: 2rem"></i>',
                confirmButtonText: "Search Again",
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
            } else {
              if (responseData.FareRule_Response.FareRules) {
                const policy =
                  responseData.FareRule_Response.FareRules[0].FareRuleDetail;
                // console.log(policy);
                setpolicy(policy);
              }
              if (responseData.FareQuote_Response) {
                const trace_id = responseData.FareQuote_Response.TraceId;
                const resultindex =
                  responseData.FareQuote_Response.Results.ResultIndex;
                const LCC = responseData.FareQuote_Response.Results.IsLCC;
                setCheckLCC(LCC);
                settraceId(trace_id);
                setResultIndex(resultindex);
              }
              if (responseData.FareQuote_Response.FlightDetails) {
                const flight = responseData.FareQuote_Response.FlightDetails;
                setFlightData(flight);
              }
              if (responseData.FareQuote_Response.Results.MiniFareRules) {
                const cancellation =
                  responseData.FareQuote_Response.Results.MiniFareRules[0];
                // console.log(cancellation)
                setcancellationData(cancellation);
              }
              if (responseData.FareQuote_Response?.Results.Segments) {
                const segment =
                  responseData.FareQuote_Response.Results.Segments[0];
                SetSegment(segment);
              }
              if (responseData.FareQuote_Response?.Results.Fare) {
                const Fare = responseData.FareQuote_Response?.Results.Fare;
                // console.log(Fare)
                setFareData(Fare);
              }
              if (responseData.FareQuote_Response?.Results.FareBreakdown) {
                const PerFare =
                  responseData.FareQuote_Response?.Results.FareBreakdown;
                setPerPassFareData(PerFare);
              }
              if (
                responseData.FareQuote_Response?.Results.IsFreeMealAvailable
              ) {
                const meal =
                  responseData.FareQuote_Response.Results.IsFreeMealAvailable;
                if (meal === true) {
                  setismealfree(true);
                }
              }

              if (responseData?.FlightSSR_Response?.SeatDynamic) {
                const seatdata =
                  responseData.FlightSSR_Response?.SeatDynamic?.[0]
                    ?.SegmentSeat;
                // console.log(seatdata)
                setSeatdata(seatdata);
              }
              if (responseData.FlightSSR_Response?.MealDynamic) {
                const mealdata =
                  responseData.FlightSSR_Response?.MealDynamic[0];
                // console.log(mealdata)
                setMealData(mealdata);
              }
              if (responseData.FlightSSR_Response?.Meal) {
                const mealdata = responseData.FlightSSR_Response?.Meal;
                // console.log(mealdata)
                setMealData(mealdata);
              }
              if (responseData.FlightSSR_Response?.Baggage) {
                const baggagedata = responseData.FlightSSR_Response?.Baggage[0];
                // console.log(baggagedata)
                setBaggageData(baggagedata);
              }
            }
          } else {
            // console.log('error')
            const error = Data.message;
            Swal.fire({
              title: "Error",
              text: error,
              iconHtml:
                '<i class="fa fa-exclamation"  style="font-size: 2rem"></i>',
              confirmButtonText: "Search Again",
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
            text: `${error.message}`,
            iconHtml:
              '<i class="fa fa-exclamation"  style="font-size: 2rem"></i>',
            confirmButtonText: "Search Again",
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

  // const attachLiveErrorHandlers = (form) => {
  //   if (!form) return;

  //   // First Name
  //   const firstNameInput = form.querySelector('input[name="adult_first_name[]"]');
  //   const firstNameError = form.querySelector('.adult_first_name-message');
  //   firstNameInput?.addEventListener('input', () => {
  //     if (firstNameInput.value.trim()) firstNameError.style.display = 'none';
  //   });

  //   // Last Name
  //   const lastNameInput = form.querySelector('input[name="adult_last_name[]"]');
  //   const lastNameError = form.querySelector('.adult_last_name-message');
  //   lastNameInput?.addEventListener('input', () => {
  //     if (lastNameInput.value.trim()) lastNameError.style.display = 'none';
  //   });
  //   // Address line 1
  //   const Address1Input = form.querySelector('input[name="adult_address_line_1[]"]');
  //   const Address1Error = form.querySelector('.adult_address_line_1-message');
  //   Address1Input?.addEventListener('input', () => {
  //     if (Address1Input.value.trim()) Address1Error.style.display = 'none';
  //   });
  //   // Address line 2
  //   const Address2Input = form.querySelector('input[name="adult_address_line_2[]"]');
  //   const Address2Error = form.querySelector('.adult_address_line_2-message');
  //   Address2Input?.addEventListener('input', () => {
  //     if (Address2Input.value.trim()) Address2Error.style.display = 'none';
  //   });

  //   // City
  //   const CityInput = form.querySelector('input[name="adult_city[]"]');
  //   const CityError = form.querySelector('.adult_city-message');
  //   CityInput?.addEventListener('input', () => {
  //     if (CityInput.value.trim()) CityError.style.display = 'none';
  //   });

  //   // Email
  //   const emailInput = form.querySelector('input[name="email1"]');
  //   const emailError = emailInput?.nextElementSibling;
  //   emailInput?.addEventListener('input', () => {
  //     if (emailInput.value.trim()) emailError.style.display = 'none';
  //   });

  //   // Mobile
  //   const phoneInput = form.querySelector('.phone-input input');
  //   const phoneError = form.querySelector('.booking-mobile .error-message');
  //   phoneInput?.addEventListener('input', () => {
  //     const val = phoneInput.value.trim();
  //     if (val && val !== '+91' && !/^\+91\s*$/.test(val)) {
  //       phoneError.style.display = 'none';
  //     }
  //   });

  //   // Gender

  //   const genderSelects = form.querySelectorAll('select[name="adult_gender[]"]');
  //   genderSelects.forEach((select) => {
  //     const wrapper = select.closest('.booking-gender'); // go up to the container
  //     const genderError = wrapper?.querySelector('.error-message');

  //     select.addEventListener('change', () => {
  //       if (select.value && genderError) {
  //         genderError.style.display = 'none';
  //       }
  //     });
  //   });

  //   // DOB
  //   const dobInput = form.querySelector('input[name="adult_age[]"]');
  //   const DobError = form.querySelector('.adult_age-message');
  //   dobInput?.addEventListener('input', () => {
  //     if (dobInput.value.trim()) DobError.style.display = 'none';
  //   });
  //   // Passport No
  //   const passportInput = form.querySelector('input[name="adult_passportNo[]"]');
  //   const passportError = form.querySelector('.adult_passportNo-message');
  //   passportInput?.addEventListener('input', () => {
  //     if (passportInput.value.trim()) passportError.style.display = 'none';
  //   });

  //   // Issued Country (React Select input)
  //   const issuedCountryInput = form.querySelector('input[name="adult_issuedcountry[]"]');
  //   const issuedCountryError = form.querySelector('.adult_issuedcountry-message');
  //   issuedCountryInput?.addEventListener('input', () => {
  //     if (issuedCountryInput.value.trim()) issuedCountryError.style.display = 'none';
  //   });

  //   // Passport Expiry Date
  //   const passportExpiryInput = form.querySelector('input[name="adult_passportexpiry[]"]');
  //   const passportExpiryError = form.querySelector('.adult_passportexpiry-message');
  //   passportExpiryInput?.addEventListener('input', () => {
  //     if (passportExpiryInput.value.trim()) passportExpiryError.style.display = 'none';
  //   });
  // };
  function attachLiveErrorHandlers(form) {
    if (!form) return;

    const fields = form.querySelectorAll("input, select");

    fields.forEach((field) => {
      field.addEventListener("input", () => {
        const errorElement =
          field.parentElement.querySelector(".error-message") ||
          field.nextElementSibling;

        if (!errorElement) return; // ← IMPORTANT FIX (prevents crash)

        if (field.value.trim() !== "") {
          errorElement.style.display = "none";
        }
      });
    });
  }

  useEffect(() => {
    formRefs.current.forEach((form) => {
      attachLiveErrorHandlers(form);
    });
  }, [passengerList.length]);

  // const handleSavePassenger = () => {
  //   const allPassengers = [];
  //   const passengerdetails = [];
  //   let isValid = true;
  //   let leadEmail = '';
  //   let leadContact = '';
  //   let leadAddress1 = '';
  //   let leadAddress2 = '';
  //   let LeadCity = '';
  //   passengerList.forEach((passenger, index) => {
  //     const form = formRefs.current[index];
  //     attachLiveErrorHandlers(form);
  //     if (!form) return;

  //     // // ---------- Validation ----------
  //     // First Name
  //     const firstNameInput = form.querySelector('input[name="adult_first_name[]"]');
  //     const firstNameError = form.querySelector('.adult_first_name-message');
  //     if (firstNameInput && !firstNameInput.value.trim()) {
  //       firstNameError.style.display = 'block';
  //       isValid = false;
  //     } else if (firstNameError) {
  //       firstNameError.style.display = 'none';
  //     }

  //     // Last Name
  //     const lastNameInput = form.querySelector('input[name="adult_last_name[]"]');
  //     const lastNameError = form.querySelector('.adult_last_name-message');
  //     if (lastNameInput && !lastNameInput.value.trim()) {
  //       lastNameError.style.display = 'block';
  //       isValid = false;
  //     } else if (lastNameError) {
  //       lastNameError.style.display = 'none';
  //     }
  //     //Address line 1
  //     const Address1Input = form.querySelector('input[name="adult_address_line_1[]"]');
  //     const Address1Error = form.querySelector('.adult_address_line_1-message');
  //     if (Address1Input && !Address1Input.value.trim()) {
  //       Address1Error.style.display = 'block';
  //       isValid = false;
  //     } else if (Address1Error) {
  //       Address1Error.style.display = 'none';
  //     }
  //     //Address line 2
  //     const Address2Input = form.querySelector('input[name="adult_address_line_2[]"]');
  //     const Address2Error = form.querySelector('.adult_address_line_2-message');
  //     if (Address2Input && !Address2Input.value.trim()) {
  //       Address2Error.style.display = 'block';
  //       isValid = false;
  //     } else if (Address2Error) {
  //       Address2Error.style.display = 'none';
  //     }
  //     //City
  //     const CityInput = form.querySelector('input[name="adult_city[]"]');
  //     const CityError = form.querySelector('.adult_city-message');
  //     if (CityInput && !CityInput.value.trim()) {
  //       CityError.style.display = 'block';
  //       isValid = false;
  //     } else if (CityError) {
  //       CityError.style.display = 'none';
  //     }

  //     // Email (only for Adults)
  //     const emailInput = form.querySelector('input[name="email1"]');
  //     const emailError = emailInput?.nextElementSibling;
  //     if (passenger.type === 'Adult' && emailInput && !emailInput.value.trim()) {
  //       emailError.style.display = 'block';
  //       isValid = false;
  //     } else if (emailError) {
  //       emailError.style.display = 'none';
  //     }

  //     // Phone (only for Adults)
  //     const phoneInput = form.querySelector('.phone-input input');
  //     const phoneError = form.querySelector('.booking-mobile .error-message');

  //     if (passenger.type === 'Adult' && phoneInput) {
  //       const phoneValue = phoneInput.value.trim();
  //       const digits = phoneValue.replace(/\D/g, '');
  //       const localNumber = digits.slice(-10);
  //       if (digits.length <= 10 || !/^\d{10}$/.test(localNumber)) {
  //         phoneError.textContent = "Please Enter a valid Mobile Number .";
  //         phoneError.style.display = 'block';
  //         isValid = false;
  //       } else {
  //         phoneError.style.display = 'none';
  //       }
  //     }
  //     // Gender
  //     const genderSelect = form.querySelector('select[name="adult_gender[]"]');
  //     const genderValue = genderSelect?.value || '';

  //     if ((passenger.type === 'Adult' || passenger.type === 'Child' || passenger.type === 'Infant') && genderSelect) {
  //       let genderError = genderSelect.parentElement.querySelector('.error-message');

  //       if (genderValue === '') {
  //         if (!genderError) {
  //           genderError = document.createElement('span');
  //           genderError.className = 'error-message';
  //           genderError.style.color = 'red';
  //           genderError.textContent = 'Please Select Gender.';
  //           genderSelect.parentElement.appendChild(genderError);
  //         }

  //         genderError.style.display = 'block';
  //         isValid = false;
  //       } else if (genderError) {
  //         genderError.style.display = 'none';
  //       }
  //     }
  //     if (FlightType === 'International') {
  //       // Passport No
  //       const passportInput = form.querySelector('input[name="adult_passportNo[]"]');
  //       const passportError = form.querySelector('.adult_passportNo-message');
  //       if (!passportInput || !passportInput.value.trim()) {
  //         passportError.textContent = 'Please enter Passport Number.';
  //         passportError.style.display = 'block';
  //         isValid = false;
  //       } else {
  //         passportError.style.display = 'none';
  //       }

  //       // Issued Country (React Select)
  //       const issuedCountryInput = form.querySelector('input[name="adult_issuedcountry[]"]');
  //       const issuedCountryError = form.querySelector('.adult_issuedcountry-message');
  //       if (!issuedCountryInput || !issuedCountryInput.value.trim()) {
  //         issuedCountryError.textContent = 'Please select Issued Country.';
  //         issuedCountryError.style.display = 'block';
  //         isValid = false;
  //       } else {
  //         issuedCountryError.style.display = 'none';
  //       }

  //       // Passport Expiry
  //       const passportExpiryInput = form.querySelector('input[name="adult_passportexpiry[]"]');
  //       const passportExpiryError = form.querySelector('.adult_passportexpiry-message');

  //       if (!passportExpiryInput || !passportExpiryInput.value.trim()) {
  //         passportExpiryError.textContent = 'Please select Passport Expiry.';
  //         passportExpiryError.style.display = 'block';
  //         isValid = false;
  //       } else {
  //         passportExpiryError.style.display = 'none';
  //       }
  //     }

  //     const dobInput = form.querySelector('input[name="adult_age[]"]');
  //     const DobError = form.querySelector('.adult_age-message');
  //     // if (passenger.type === 'Infant' && (!dobInput || !dobInput.value)) {
  //     //   dobInput.style.border = '1px solid red';
  //     //   isValid = false;
  //     // } else if (dobInput) {
  //     //   dobInput.style.border = '';
  //     // }
  //     if (!dobInput || !dobInput.value) {
  //       DobError.style.display = 'block';
  //       isValid = false;
  //     } else if (dobInput) {
  //       dobInput.style.border = '';
  //     }
  //     if (!isValid) return;

  //     const isLeadPax = index === 0;
  //     const prefix = form.querySelector('select[name="adult_prefix[]"]')?.value || '';
  //     const firstName = form.querySelector('input[name="adult_first_name[]"]')?.value || '';
  //     const lastName = form.querySelector('input[name="adult_last_name[]"]')?.value || '';
  //     const dob = form.querySelector('input[name="adult_age[]"]')?.value || '';
  //     const email = form.querySelector('input[name="email1"]')?.value || '';
  //     const contact = phoneNumbers || `+91${TaxivaxiPassengeDetails[0].employee_contact}` || '';
  //     const genderVal = form.querySelector('select[name="adult_gender[]"]')?.value || '';
  //     const Addressline1 = form.querySelector('input[name="adult_address_line_1[]"]')?.value || '';
  //     const Addressline2 = form.querySelector('input[name="adult_address_line_2[]"]')?.value || '';
  //     const flyerName = form.querySelector('input[name="flyername"]')?.value || '';
  //     const flyerNumber = form.querySelector('input[name="flyernumber"]')?.value || '';
  //     const city = form.querySelector('input[name="adult_city[]"]')?.value || '';
  //     // If this is an adult, capture email and contact
  //     if (isLeadPax) {
  //       leadEmail = email;
  //       leadContact = contact;
  //       leadAddress1 = Addressline1;
  //       leadAddress2 = Addressline2;
  //       LeadCity = city;
  //     }
  //     const passengerData = {
  //       type: passenger.type,
  //       passengerIndex: index,
  //       prefix,
  //       firstName,
  //       lastName,
  //       dob,
  //       email: ['Child', 'Infant'].includes(passenger.type) ? leadEmail : email,
  //       contact: ['Child', 'Infant'].includes(passenger.type) ? leadContact : contact,
  //       gender: genderVal,
  //       Address1: ['Child', 'Infant'].includes(passenger.type) ? leadAddress1 : Addressline1,
  //       Address2: ['Child', 'Infant'].includes(passenger.type) ? leadAddress2 : Addressline2,
  //       city: ['Child', 'Infant'].includes(passenger.type) ? LeadCity : city,
  //       flyerName,
  //       flyerNumber,
  //       passportno: form.querySelector('input[name="adult_passportNo[]"]')?.value || '',
  //       passportexpiry: form.querySelector('input[name="adult_passportexpiry[]"]')?.value || '',
  //       issuedcountry: form.querySelector('input[name="adult_issuedcountry[]"]')?.value || '',
  //     };

  //     const codeMap = {
  //       Adult: 1,
  //       Child: 2,
  //       Infant: 3,
  //     };

  //     const genderMap = {
  //       M: 1,
  //       F: 2,
  //     };

  //     const details = {
  //       passengerIndex: passengerData.passengerIndex,
  //       Title: passengerData.prefix,
  //       FirstName: passengerData.firstName,
  //       LastName: passengerData.lastName,
  //       PaxType: codeMap[passengerData.type],
  //       Gender: genderMap[passengerData.gender],
  //       DateOfBirth: passengerData.dob + "T00:00:00",
  //       ContactNo: passengerData.contact,
  //       // Email: passengerData.email,
  //       Email: "flight@cotrav.co",
  //       AddressLine1: passengerData.Address1,
  //       AddressLine2: passengerData.Address2,
  //       IsLeadPax: isLeadPax,
  //       City: passengerData.city,
  //       PassportExpiry: passengerData.passportexpiry,
  //       PassportNo: passengerData.passportno
  //     };

  //     passengerdetails.push(details);
  //     allPassengers.push(passengerData);
  //   });
  //   if (!isValid) {
  //     const firstError = document.querySelector('.error-message[style*="block"]');
  //     if (firstError) {
  //       firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
  //     }
  //     return;
  //   }
  //   if (isValid && !phoneError) {
  //     setAccordion5Expanded(true);
  //     setAccordion1Expanded(false);
  //   }
  //   setPassengerDetails(passengerdetails);
  //   setPassengerData(allPassengers);
  //   console.log("All Passenger Data", passengerdetails);
  // };

  const handleSavePassenger = () => {
    const allPassengers = [];
    const passengerdetails = [];
    let isValid = true;

    let leadEmail = "";
    let leadContact = "";
    let leadAddress1 = "";
    let leadAddress2 = "";
    let LeadCity = "";

    passengerList.forEach((passenger, index) => {
      const form = formRefs.current[index];
      attachLiveErrorHandlers(form);
      if (!form) return;

      // --------------------------- VALIDATIONS ---------------------------

      // First Name
      const firstNameInput = form.querySelector(
        'input[name="adult_first_name[]"]'
      );
      const firstNameError = form.querySelector(".adult_first_name-message");
      if (firstNameInput && !firstNameInput.value.trim()) {
        firstNameError.style.display = "block";
        isValid = false;
      } else firstNameError.style.display = "none";

      // Last Name
      const lastNameInput = form.querySelector(
        'input[name="adult_last_name[]"]'
      );
      const lastNameError = form.querySelector(".adult_last_name-message");
      if (lastNameInput && !lastNameInput.value.trim()) {
        lastNameError.style.display = "block";
        isValid = false;
      } else lastNameError.style.display = "none";

      const dobInput = form.querySelector('input[name="adult_age[]"]');
      // Address Line 1 (Skip if Domestic)
      if (FlightType === "International") {
        const Address1Input = form.querySelector(
          'input[name="adult_address_line_1[]"]'
        );
        const Address1Error = form.querySelector(
          ".adult_address_line_1-message"
        );

        if (Address1Input && !Address1Input.value.trim()) {
          if (Address1Error) Address1Error.style.display = "block";
          isValid = false;
        } else if (Address1Error) {
          Address1Error.style.display = "none";
        }
      }

      // Address Line 2 (Skip if Domestic)
      if (FlightType === "International") {
        const Address2Input = form.querySelector(
          'input[name="adult_address_line_2[]"]'
        );
        const Address2Error = form.querySelector(
          ".adult_address_line_2-message"
        );

        if (Address2Input && !Address2Input.value.trim()) {
          if (Address2Error) Address2Error.style.display = "block";
          isValid = false;
        } else if (Address2Error) {
          Address2Error.style.display = "none";
        }
      }

      // City (Skip if Domestic)
      if (FlightType === "International") {
        const CityInput = form.querySelector('input[name="adult_city[]"]');
        const CityError = form.querySelector(".adult_city-message");

        if (CityInput && !CityInput.value.trim()) {
          if (CityError) CityError.style.display = "block";
          isValid = false;
        } else if (CityError) {
          CityError.style.display = "none";
        }
      }

      // Email
      const emailInput = form.querySelector('input[name="email1"]');
      const emailError = emailInput?.nextElementSibling;

      if (passenger.type === "Adult") {
        if (emailInput && !emailInput.value.trim()) {
          if (emailError) emailError.style.display = "block";
          isValid = false;
        } else if (emailError) {
          emailError.style.display = "none";
        }
      }

      // Phone
      const phoneInput = form.querySelector(".phone-input input");
      const phoneError = form.querySelector(".booking-mobile .error-message");

      if (passenger.type === "Adult" && phoneInput) {
        const digits = phoneInput.value.trim().replace(/\D/g, "");
        const localNumber = digits.slice(-10);

        if (!/^\d{10}$/.test(localNumber)) {
          if (phoneError) {
            phoneError.textContent = "Please Enter a valid Mobile Number.";
            phoneError.style.display = "block";
          }
          isValid = false;
        } else if (phoneError) {
          phoneError.style.display = "none";
        }
      }

      // Gender
      const genderSelect = form.querySelector('select[name="adult_gender[]"]');
      let genderError =
        genderSelect?.parentElement.querySelector(".error-message");

      if (!genderSelect?.value) {
        if (!genderError) {
          genderError = document.createElement("span");
          genderError.className = "error-message";
          genderError.style.color = "red";
          genderError.textContent = "Please Select Gender.";
          genderSelect?.parentElement.appendChild(genderError);
        }
        genderError.style.display = "block";
        isValid = false;
      } else if (genderError) {
        genderError.style.display = "none";
      }

      // Passport (Only International)
      if (FlightType === "International") {
        const passportInput = form.querySelector(
          'input[name="adult_passportNo[]"]'
        );
        const passportError = form.querySelector(".adult_passportNo-message");

        if (passportInput && !passportInput.value.trim()) {
          if (passportError) passportError.style.display = "block";
          isValid = false;
        } else if (passportError) {
          passportError.style.display = "none";
        }

        const issuedCountryInput = form.querySelector(
          'input[name="adult_issuedcountry[]"]'
        );
        const issuedCountryError = form.querySelector(
          ".adult_issuedcountry-message"
        );

        if (issuedCountryInput && !issuedCountryInput.value.trim()) {
          if (issuedCountryError) issuedCountryError.style.display = "block";
          isValid = false;
        } else if (issuedCountryError) {
          issuedCountryError.style.display = "none";
        }

        const passportExpiryInput = form.querySelector(
          'input[name="adult_passportexpiry[]"]'
        );
        const passportExpiryError = form.querySelector(
          ".adult_passportexpiry-message"
        );

        if (passportExpiryInput && !passportExpiryInput.value.trim()) {
          if (passportExpiryError) passportExpiryError.style.display = "block";
          isValid = false;
        } else if (passportExpiryError) {
          passportExpiryError.style.display = "none";
        }
      }

      // Stop function if invalid
      if (!isValid) return;

      // ---------------------- BUILD PASSENGER DATA ----------------------

      const isLeadPax = index === 0;

      const prefix =
        form.querySelector('select[name="adult_prefix[]"]')?.value || "";
      const firstName = firstNameInput.value;
      const lastName = lastNameInput.value;
      const dob = dobInput.value || ""; // optional for Domestic
      const email = emailInput?.value || "";
      const contact =
        phoneNumbers || `+91${TaxivaxiPassengeDetails[0].employee_contact}`;
      const genderVal = genderSelect.value;

      const Address1 =
        form.querySelector('input[name="adult_address_line_1[]"]')?.value || "";
      const Address2 =
        form.querySelector('input[name="adult_address_line_2[]"]')?.value || "";
      const city =
        form.querySelector('input[name="adult_city[]"]')?.value || "";

      // Lead pax store
      if (isLeadPax) {
        leadEmail = email;
        leadContact = contact;
        leadAddress1 = Address1;
        leadAddress2 = Address2;
        LeadCity = city;
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
          : Address1,
        Address2: ["Child", "Infant"].includes(passenger.type)
          ? leadAddress2
          : Address2,
        city: ["Child", "Infant"].includes(passenger.type) ? LeadCity : city,
        passportno:
          form.querySelector('input[name="adult_passportNo[]"]')?.value || "",
        passportexpiry:
          form.querySelector('input[name="adult_passportexpiry[]"]')?.value ||
          "",
        issuedcountry:
          form.querySelector('input[name="adult_issuedcountry[]"]')?.value ||
          "",
      };

      const codeMap = { Adult: 1, Child: 2, Infant: 3 };
      const genderMap = { M: 1, F: 2 };

      const details = {
        passengerIndex: index,
        Title: prefix,
        FirstName: firstName,
        LastName: lastName,
        PaxType: codeMap[passenger.type],
        Gender: genderMap[genderVal],
        DateOfBirth: dob ? dob + "T00:00:00" : "2001-01-01T00:00:00",
        ContactNo: passengerData.contact,
        Email: "flight@cotrav.co",
        AddressLine1: passengerData.Address1 || "baner",
        AddressLine2: passengerData.Address2 || "Pune",
        IsLeadPax: isLeadPax,
        City: passengerData.city || "Pune",
        PassportExpiry: passengerData.passportexpiry,
        PassportNo: passengerData.passportno,
      };

      passengerdetails.push(details);
      allPassengers.push(passengerData);
    });

    // scroll to first error
    if (!isValid) {
      const firstError = document.querySelector(
        '.error-message[style*="block"]'
      );
      if (firstError)
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setAccordion5Expanded(true);
    setAccordion1Expanded(false);
    setIsPassengerSaved(true);
    setPassengerDetails(passengerdetails);
    setPassengerData(allPassengers);

    // console.log("All Passenger Data", passengerdetails);
  };

  //Meal Tabs
  const handleAddMeal = (meal) => {
    setSelectedMeals((prev) => {
      const filtered = prev.filter(
        (m) =>
          !(
            m.passengerIndex === selectedPassengerIndex &&
            m.segmentKey === selectedSegmentKey
          )
      );

      return [
        ...filtered,
        {
          passengerIndex: selectedPassengerIndex,
          segmentKey: selectedSegmentKey,
          meal,
        },
      ];
    });

    // ✅ AUTO MOVE TO NEXT PASSENGER
    if (selectedPassengerIndex < nonInfantPassengers.length - 1) {
      setSelectedPassengerIndex((prev) => prev + 1);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedSegmentKey(newValue);
  };
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
          segment: m.segmentKey,
          mealCode: m.meal.Code,
          mealName: m.meal.AirlineDescription,
          price: m.meal.Price,
        })),
      };
    });

    // console.log('Formatted Meal Data:', formattedData);
  };

  //Baggage

  // const handleAddBaggage = (baggageIndex, data) => {
  //   const baggageItem = BaggageData[baggageIndex];

  //   const key = {
  //     passengerIndex: selectedPassengerIndex,
  //     segmentKey: selectedSegmentKey,
  //     baggageIndex,
  //   };

  //   setSelectedBaggage((prev) => {
  //     // Remove any existing baggage selection for this passenger & segment
  //     const updated = prev.filter(
  //       (item) =>
  //         !(
  //           item.passengerIndex === key.passengerIndex &&
  //           item.segmentKey === key.segmentKey
  //         )
  //     );
  //     return [
  //       ...updated,
  //       {
  //         ...key,
  //         baggage: baggageItem, // includes Weight, Price, etc.
  //         quantity: 1,
  //       },
  //     ];
  //   });

  // };
  const nonInfantPassengers = PassengerData.filter((p) => p.type !== "Infant");

  const handleAddBaggage = (baggageIndex) => {
    const baggageItem = BaggageData[baggageIndex];

    setSelectedBaggage((prev) => {
      const updated = prev.filter(
        (item) =>
          !(
            item.passengerIndex === selectedPassengerIndex &&
            item.segmentKey === selectedSegmentKey
          )
      );

      return [
        ...updated,
        {
          passengerIndex: selectedPassengerIndex,
          segmentKey: selectedSegmentKey,
          baggageIndex,
          baggage: baggageItem,
          quantity: 1,
        },
      ];
    });

    // ✅ AUTO MOVE TO NEXT PASSENGER
    if (selectedPassengerIndex < nonInfantPassengers.length - 1) {
      const nextIndex = selectedPassengerIndex + 1;
      setSelectedPassengerIndex(nextIndex);
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
  const totalMealPrice = selectedMeals.reduce(
    (total, item) => total + (Number(item.meal.Price) || 0),
    0
  );
  const totalBaggagePrice = selectedBaggage.reduce(
    (total, item) => total + (Number(item.baggage.Price) || 0),
    0
  );
  const totalSeatPrice = selectedSeats.reduce(
    (total, item) => total + (Number(item.seatPrice) || 0),
    0
  );
  const totalServicePrice = totalMealPrice + totalBaggagePrice + totalSeatPrice;
  const [currentFlightIndex, setCurrentFlightIndex] = useState(0);

  const handlePrev = () => {
    setCurrentFlightIndex((prev) =>
      prev > 0 ? prev - 1 : SeatData.length - 1
    );
  };

  const handleNext = () => {
    setCurrentFlightIndex((prev) =>
      prev < SeatData.length - 1 ? prev + 1 : 0
    );
  };

  const currentSegment = SeatData?.[currentFlightIndex];
  if (loadingg) {
    return (
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
    );
  }

  // if (typeof currentSegment === 'undefined'  ||!currentSegment.RowSeats ||!currentSegment.RowSeats[0]?.Seats) {
  //   return null;
  // }
  // ─── Fare Details ──────────────────────────────────────────────
  const passengerCount = TaxivaxiPassengeDetails?.length || 0;
  const totalTax = Number(FareData?.Tax) * passengerCount || 0;

  const k3Tax =
    Number(FareData?.TaxBreakup?.find((t) => t.key === "K3")?.value) * passengerCount || 0;

  // Base + services (NUMBER)
  const GetTotalPrice =
    Number(FareData?.PublishedFare * passengerCount|| 0) + Number(totalServicePrice || 0);
  console.log(FareData?.OtherCharges);
  console.log(FareData?.PublishedFare  * passengerCount);
  // Client markup

  const pricePerPax = Number(ClientPriceValue) || 0;

  const clientPrice =
    pricePerPax * passengerCount +
    Number(totalServicePrice || 0) +
    Number(FareData?.OtherCharges  * passengerCount);
  console.log(clientPrice);
  const Markup = Number(clientPrice || 0) - GetTotalPrice;
  console.log("ClientPriceValue", clientPrice);
  console.log("Total Price", GetTotalPrice);
  console.log("Markup", Markup);
  // Other charges
  const OtherCharges = totalTax - k3Tax;

  // ─── Final Display Values ──────────────────────────────────────

  const TotalPrice = (GetTotalPrice + Markup).toFixed(2);
  const otherchargeswithmarkup = OtherCharges + Markup;

  // Base fare (UI)
  const adultFare = PerPassFareData.find((item) => item.PassengerType === 1);

  const BaseFare = adultFare
    ? Number(adultFare.BaseFare || 0).toFixed(2)
    : "0.00";

  ///////////////////Fetch GST
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
          gstin: data.gst_id || "07AAGCB3556P1Z7",
          company_name:
            data.billing_name || "BAI INFOSOLUTIONS PRIVATE LIMITED",
          company_address:
            data.billing_address_line1 ||
            "1 1075 1 2 GF 4/Mehrauli/New Delhi/110030",
          company_contact: data.billing_contact || "9881102875",
          company_email: data.contact_email || "flight@cotrav.co",
        };

        setGstEntries(gstData);
      } else {
        const gstin = "07AAGCB3556P1Z7";
        const company_name = "BAI INFOSOLUTIONS PRIVATE LIMITED";
        const company_address = "1 1075 1 2 GF 4/Mehrauli/New Delhi/110030";
        const company_contact = "9881102875";
        const company_email = "flight@cotrav.co";

        const gstData = {
          gstin,
          company_name,
          company_address,
          company_contact,
          company_email,
        };
        setGstEntries(gstData);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  // useEffect(() => {
  //   if (!hasFetched.current) {
  //     fetchGstData();
  //     hasFetched.current = true;
  //   }
  // }, []);
  //Gst Details Saving
  const SaveGstDetails = () => {
    if (!gstFormRef.current) return;

    const form = gstFormRef.current;

    const updatedGstForm = {
      gstin: form.querySelector('input[name="gstin"]')?.value || "",
      company_name:
        form.querySelector('input[name="company_name"]')?.value || "",
      company_address:
        form.querySelector('input[name="company_address"]')?.value || "",
      company_contact:
        form.querySelector('input[name="company_contact"]')?.value || "",
      company_email:
        form.querySelector('input[name="company_email"]')?.value || "",
    };

    setGstEntries(updatedGstForm);
    console.log("GST Details:", updatedGstForm); // for verification
    setShowModal(true);
  };

  // Final LCC booking process

  const LCCBooking = async () => {
    const enrichedPassengerDetails = PassengerDetails.map((passenger) => {
      const isInfant = passenger.PaxType === 3;
      const baggageForPassenger = selectedBaggage.filter(
        (b) => b.passengerIndex === passenger.passengerIndex
      );
      const MealsForPassenger = selectedMeals.filter(
        (b) => b.passengerIndex === passenger.passengerIndex
      );
      const SeatForPassenger = selectedSeats.filter(
        (b) => b.passengerIndex === passenger.passengerIndex
      );
      const Passengerfare = PerPassFareData.filter(
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
    // console.log(enrichedPassengerDetails)
    const requestData = {
      TraceId: traceId,
      ResultIndex: ResultIndex,
      Passengers: enrichedPassengerDetails,
    };
    console.log(requestData);
    try {
      setfinalloading(true);
      const response = await fetch(`${base_url}tboTicket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const Data = await response.json();

      if (!Data.status) {
        const error = Data.message;
        Swal.fire({
          title: "Error",
          text: error,
          icon: '<i class="fa fa-exclamation"  style="font-size: 2rem"></i>',
          confirmButtonText: "Search Again",
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
      if (Data.status) {
        const fares = {
          markupValue: Markup,
          ClientPriceValue: ClientPriceValue,
          total_ex_tax_fees: BaseFare,
          tax_and_fees: OtherCharges,
          gst_k3: k3Tax,
        };
        console.log(fares);
        const responseData = TaxivaxiFlightDetails;
        const FlightBooking = Data.data;
        navigate("/UapibookingCompleted", {
          state: { FlightBooking, responseData, fares },
        });
      }
      setfinalloading(false);
    } catch (error) {
      setfinalloading(false);
      Swal.fire({
        title: "Error",
        text: `${error.message}`,
        icon: '<i class="fa fa-exclamation"  style="font-size: 2rem"></i>',
        confirmButtonText: "Search Again",
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

  //Final Non Lcc booking
  const NonLCCBooking = async () => {
    const enrichedPassengerDetails = PassengerDetails.map((passenger) => {
      const isInfant = passenger.PaxType === 3;
      const baggageForPassenger = selectedBaggage.filter(
        (b) => b.passengerIndex === passenger.passengerIndex
      );
      const MealsForPassenger = selectedMeals.filter(
        (b) => b.passengerIndex === passenger.passengerIndex
      );
      const SeatForPassenger = selectedSeats.filter(
        (b) => b.passengerIndex === passenger.passengerIndex
      );
      const Passengerfare = PerPassFareData.filter(
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
    // console.log(enrichedPassengerDetails)
    const requestData = {
      TraceId: traceId,
      ResultIndex: ResultIndex,
      Passengers: enrichedPassengerDetails,
    };
    console.log(requestData);
    try {
      setfinalloading(true);
      const response = await fetch(`${base_url}tboBookFlight`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const Data = await response.json();
      // console.log(Data)

      setfinalloading(false);
      if (!Data.status) {
        const error = Data.message;
        Swal.fire({
          title: "Error",
          text: `${error}`,
          icon: '<i class="fa fa-exclamation"  style="font-size: 2rem"></i>',
          confirmButtonText: "Search Again",
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
      if (Data.status) {
        // const PNRNO = Data.data.Response.Response;
        // Swal.fire({
        //   title: 'Booking Successful!',
        //   text: `Your PNR Code is : ${PNRNO?.["PNR"]}.`,
        //   iconHtml: '<i class="fa fa-check" style="font-size: 2rem"></i>',
        //   confirmButtonText: 'OK'
        // });
        const fares = {
          ClientPriceValue: ClientPriceValue,
          total_ex_tax_fees: BaseFare,
          tax_and_fees: OtherCharges,
          gst_k3: k3Tax,
        };
        console.log(fares);
        const responseData = TaxivaxiFlightDetails;
        const FlightBooking = Data.data;
        navigate("/UapibookingCompleted", {
          state: { FlightBooking, responseData, fares },
        });
      }
    } catch (error) {
      setfinalloading(false);
      Swal.fire({
        title: "Error",
        text: `${error.message}`,
        iconHtml: '<i class="fa fa-exclamation"  style="font-size: 2rem"></i>',
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    }
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
    if (e.target.checked) {
      setShowError(false); // hide error if checkbox is checked
    }
  };
  //Final continue Booking
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
      return; // Stop the booking if user cancels
    }
    if (CheckLCC == true) {
      LCCBooking();
    } else {
      NonLCCBooking();
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
    setSelectedPassengerIndex(0);
  };
  const handlebaggagebuttonskip = () => {
    setAccordion4Expanded(false);
    if (Array.isArray(MealData) && MealData.length > 0 && MealData[0]?.Meal) {
      setAccordion6Expanded(true);
    }
    setSelectedPassengerIndex(0);
  };
  const handleMealbuttonskip = () => {
    setAccordion6Expanded(false);
  };

  //contact validation
  const validateIndianNumber = (value) => {
    // Remove all non-digits (removes +, spaces, dashes, etc.)
    const cleaned = value.replace(/[^\d]/g, "");
    return /^91[6-9]\d{9}$/.test(value);
  };

  const handlePhoneChange = (value) => {
    console.log(validateIndianNumber(value));
    setPhoneNumbers(value);
    if (validateIndianNumber(value)) {
      setPhoneError("");
    } else {
      setPhoneError("Please enter a valid 10-digit Indian mobile number.");
    }
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
  return (
    <div className="yield-content" style={{ background: "#e8e4ff" }}>
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
                                        <span className="airportname text-black">
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
                                        <span className="airportname text-black">
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
                            <a
                              onClick={() => setIsOpen(true)}
                              className="text-blue-500 text-[11px] mr-5 hover:underline cursor-pointer"
                            >
                              More Policy
                            </a>
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
                          <table className="styled-table">
                            <thead>
                              <tr>
                                <th colSpan={2}>Cancellation</th>
                                {/* <th colSpan={2}>Date Change</th> */}
                              </tr>
                            </thead>
                            <tbody>
                              {/* <tr> */}

                              {Array.isArray(CancellationData) &&
                                CancellationData.filter(
                                  (item) => item.Type === "Cancellation"
                                ).map((item, index) => {
                                  const formatDate = (d) =>
                                    d.toLocaleString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    });

                                  const hasValidFrom =
                                    item.From !== null && item.From !== "";
                                  const hasValidTo =
                                    item.To !== null && item.To !== "";
                                  const hasValidUnit =
                                    item.Unit !== null && item.Unit !== "";

                                  if (!hasValidFrom && !hasValidTo) {
                                    const details =
                                      item.Details?.replace(/INR/i, "₹") ||
                                      "₹ 0";
                                    return <td key={index}>{details}</td>;
                                  }
                                  const fromHours =
                                    parseFloat(item.From) *
                                    (item.Unit === "DAYS" ? 24 : 1);
                                  const toHours =
                                    hasValidTo && item.To
                                      ? parseFloat(item.To) *
                                        (item.Unit === "DAYS" ? 24 : 1)
                                      : null;

                                  const fromDate = new Date(
                                    new Date(
                                      FlightData?.Origin?.OriginAirport?.DepTime
                                    ).getTime() -
                                      fromHours * 60 * 60 * 1000
                                  );
                                  const toDate = toHours
                                    ? new Date(
                                        new Date(
                                          FlightData?.Origin?.OriginAirport?.DepTime
                                        ).getTime() -
                                          toHours * 60 * 60 * 1000
                                      )
                                    : null;

                                  const rangeText = toDate
                                    ? `${formatDate(fromDate)} to ${formatDate(
                                        toDate
                                      )}`
                                    : `Before ${formatDate(fromDate)}`;

                                  const details =
                                    item.Details?.replace(/INR/i, "₹") || "₹ 0";

                                  return (
                                    <tr key={index}>
                                      <td>{rangeText} </td>
                                      <td>{details}</td>
                                    </tr>
                                  );
                                })}

                              <tr>
                                <th colSpan={2}>Date Change</th>
                              </tr>
                              {Array.isArray(CancellationData) &&
                                CancellationData.filter(
                                  (item) => item.Type === "Reissue"
                                ).map((item, index) => {
                                  const formatDate = (d) =>
                                    d.toLocaleString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    });

                                  const hasValidFrom =
                                    item.From !== null && item.From !== "";
                                  const hasValidTo =
                                    item.To !== null && item.To !== "";
                                  const hasValidUnit =
                                    item.Unit !== null && item.Unit !== "";

                                  if (!hasValidFrom && !hasValidTo) {
                                    const details =
                                      item.Details?.replace(/INR/i, "₹") ||
                                      "₹ 0";
                                    return <td key={index}>{details}</td>;
                                  }

                                  const fromHours =
                                    parseFloat(item.From) *
                                    (item.Unit === "DAYS" ? 24 : 1);
                                  const toHours =
                                    hasValidTo && item.To
                                      ? parseFloat(item.To) *
                                        (item.Unit === "DAYS" ? 24 : 1)
                                      : null;

                                  const fromDate = new Date(
                                    new Date(
                                      FlightData?.Origin?.OriginAirport?.DepTime
                                    ).getTime() -
                                      fromHours * 60 * 60 * 1000
                                  );
                                  const toDate = toHours
                                    ? new Date(
                                        new Date(
                                          FlightData?.Origin?.OriginAirport?.DepTime
                                        ).getTime() -
                                          toHours * 60 * 60 * 1000
                                      )
                                    : null;

                                  const rangeText = toDate
                                    ? `${formatDate(fromDate)} to ${formatDate(
                                        toDate
                                      )}`
                                    : `Before ${formatDate(fromDate)}`;

                                  const details =
                                    item.Details?.replace(/INR/i, "₹") || "₹ 0";

                                  return (
                                    <tr key={index}>
                                      <td>{rangeText} </td>
                                      <td>{details}</td>
                                    </tr>
                                  );
                                })}

                              {/* </tr> */}
                            </tbody>
                          </table>

                          {/* <table className="styled-table">
                            <thead className="bg-gray-100 text-gray-800 font-semibold">
                              <tr>
                                <th className="px-4 py-2 border-r w-1/2">Cancellation </th>
                                <th className="px-4 py-2">Date Change </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="bg-white">
                                <td className="px-2 py-2 border-r align-top">
                                  {Array.isArray(CancellationData) &&
                                    CancellationData.some(item => item.Type === 'Cancellation') ? (
                                    CancellationData
                                      .filter(item => item.Type === 'Cancellation')
                                      .map((item, index) => {
                                        const formatDate = (d) =>
                                          d.toLocaleString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                          });

                                        const hasValidFrom = item.From !== null && item.From !== '';
                                        const hasValidTo = item.To !== null && item.To !== '';
                                        const hasValidUnit = item.Unit !== null && item.Unit !== '';

                                        if (!hasValidFrom && !hasValidTo) {
                                          const details = item.Details?.replace(/INR/i, '₹') || '₹ 0';
                                          return (
                                            <div key={index} className="mb-2 text-gray-700">
                                              <span className="font-medium">{details}</span>
                                            </div>
                                          );
                                        }

                                        const fromHours =
                                          parseFloat(item.From) * (item.Unit === 'DAYS' ? 24 : 1);
                                        const toHours =
                                          hasValidTo
                                            ? parseFloat(item.To) * (item.Unit === 'DAYS' ? 24 : 1)
                                            : null;

                                        const fromDate = new Date(
                                          new Date(FlightData?.Origin?.OriginAirport?.DepTime).getTime() -
                                          fromHours * 60 * 60 * 1000
                                        );
                                        const toDate = toHours
                                          ? new Date(
                                            new Date(
                                              FlightData?.Origin?.OriginAirport?.DepTime
                                            ).getTime() - toHours * 60 * 60 * 1000
                                          )
                                          : null;

                                        const rangeText = toDate
                                          ? `${formatDate(fromDate)} to ${formatDate(toDate)}`
                                          : `Before ${formatDate(fromDate)}`;

                                        const details = item.Details?.replace(/INR/i, '₹') || '₹ 0';

                                        return (
                                          <div key={index} className="mb-2 text-gray-700">
                                            <div className="flex justify-between">
                                              <span>{rangeText}</span>
                                              <span className="font-semibold text-right">{details}</span>
                                            </div>
                                          </div>
                                        );
                                      })
                                  ) : (
                                    <span className="text-gray-400">No cancellation policy</span>
                                  )}
                                </td>

                                <td className="px-2 py-2 align-top">
                                  {Array.isArray(CancellationData) &&
                                    CancellationData.some(item => item.Type === 'Reissue') ? (
                                    CancellationData.filter(item => item.Type === 'Reissue').map(
                                      (item, index) => {
                                        const formatDate = (d) =>
                                          d.toLocaleString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                          });

                                        const hasValidFrom = item.From !== null && item.From !== '';
                                        const hasValidTo = item.To !== null && item.To !== '';
                                        const hasValidUnit = item.Unit !== null && item.Unit !== '';

                                        if (!hasValidFrom && !hasValidTo) {
                                          const details = item.Details?.replace(/INR/i, '₹') || '₹ 0';
                                          return (
                                            <div key={index} className="mb-2 text-gray-700">
                                              <span className="font-medium">{details}</span>
                                            </div>
                                          );
                                        }

                                        const fromHours =
                                          parseFloat(item.From) * (item.Unit === 'DAYS' ? 24 : 1);
                                        const toHours =
                                          hasValidTo
                                            ? parseFloat(item.To) * (item.Unit === 'DAYS' ? 24 : 1)
                                            : null;

                                        const fromDate = new Date(
                                          new Date(FlightData?.Origin?.OriginAirport?.DepTime).getTime() -
                                          fromHours * 60 * 60 * 1000
                                        );
                                        const toDate = toHours
                                          ? new Date(
                                            new Date(
                                              FlightData?.Origin?.OriginAirport?.DepTime
                                            ).getTime() - toHours * 60 * 60 * 1000
                                          )
                                          : null;

                                        const rangeText = toDate
                                          ? `${formatDate(fromDate)} to ${formatDate(toDate)}`
                                          : `Before ${formatDate(fromDate)}`;

                                        const details = item.Details?.replace(/INR/i, '₹') || '₹ 0';

                                        return (
                                          <div key={index} className="mb-2 text-gray-700">
                                            <div className="flex justify-between">
                                              <span>{rangeText}</span>
                                              <span className="font-semibold text-right">{details}</span>
                                            </div>
                                          </div>
                                        );
                                      }
                                    )
                                  ) : (
                                    <span className="text-gray-400">No date change policy</span>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table> */}

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
                                          {/* {passenger.type == 'Adult' && ( */}
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
                                                <option value="Mr">Mr.</option>
                                                <option value="Mrs">
                                                  Mrs.
                                                </option>
                                              </select>
                                            </div>
                                          </div>
                                          {/* )} */}
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
                                              //     emptaxivaxi?.[passengerindex]?.people_name
                                              //         ? emptaxivaxi[passengerindex].people_name.trim().split(' ').slice(0, -1).join(' ').trim()
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
                                              Please Enter The First Name.
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
                                              //     emptaxivaxi?.[passengerindex]?.people_name
                                              //         ? emptaxivaxi[passengerindex].people_name.trim().split(' ').pop()
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
                                              Please Enter The Last Name.
                                            </span>
                                          </div>
                                        </div>

                                        <div className="booking-row">
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
                                              style={{ width: "99%" }}
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
                                              <span
                                                className="error-message adult_age-message"
                                                style={{
                                                  display: "none",
                                                  color: "red",
                                                  fontWeight: "normal",
                                                }}
                                              >
                                                Please Select The Date Of Birth.
                                              </span>
                                            </div>
                                          </div>

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
                                                <option value="M">Male</option>
                                                <option value="F">
                                                  Female
                                                </option>
                                              </select>
                                              <span className="error-message adult_gender-message">
                                                Please Select The Gender
                                              </span>
                                            </div>
                                          </div>
                                          {passenger.type == "Adult" && (
                                            <div className="booking-field booking-name">
                                              <label>
                                                Address Line 1{" "}
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

                                              {/* <span className="error-message adult_address_line_1-message" style={{ display: "none", color: "red", fontWeight: "normal" }}>
                                                Please Enter The Address Line 1.
                                              </span> */}
                                              <span
                                                className="error-message adult_address_line_1-message"
                                                style={{
                                                  display:
                                                    FlightType === "Domestic"
                                                      ? "none"
                                                      : "none",
                                                  color: "red",
                                                  fontWeight: "normal",
                                                }}
                                              >
                                                {FlightType ===
                                                  "International" &&
                                                  "Please Enter The Address Line 1."}
                                              </span>
                                            </div>
                                          )}
                                        </div>

                                        {passenger.type == "Adult" && (
                                          <div className="booking-row">
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
                                                className="error-message adult_address_line_1-message"
                                                style={{
                                                  display:
                                                    FlightType === "Domestic"
                                                      ? "none"
                                                      : "none",
                                                  color: "red",
                                                  fontWeight: "normal",
                                                }}
                                              >
                                                {FlightType ===
                                                  "International" &&
                                                  "Please Enter The Address Line 2."}
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
                                                className="error-message adult_address_line_1-message"
                                                style={{
                                                  display:
                                                    FlightType === "Domestic"
                                                      ? "none"
                                                      : "none",
                                                  color: "red",
                                                  fontWeight: "normal",
                                                }}
                                              >
                                                {FlightType ===
                                                  "International" &&
                                                  "Please Enter City."}
                                              </span>
                                            </div>

                                            <div className="booking-field booking-email">
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
                                              <span className="error-message email1-message">
                                                Please Enter The Email ID.
                                              </span>
                                            </div>

                                            <div className="booking-field booking-mobile">
                                              <label>
                                                Mobile Number
                                                <span className="mandatory-star">
                                                  *
                                                </span>
                                              </label>
                                              <div
                                                className="mobile-input-wrapper"
                                                style={{ width: "32%" }}
                                              >
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
                                                  onChange={(value) => {
                                                    const formattedNumber =
                                                      "+" + value;
                                                    setPhoneNumbers(
                                                      formattedNumber
                                                    );
                                                  }}
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
                                                Please Enter The Mobile Number
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
                                                  //     emptaxivaxi &&
                                                  //         emptaxivaxi[passengerindex] &&
                                                  //         emptaxivaxi[passengerindex]['date_of_birth']
                                                  //         ? emptaxivaxi[passengerindex]['date_of_birth']
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
                            {/* <Accordion defaultExpanded expanded={accordion5Expanded}  onChange={(event, isExpanded) => setAccordion5Expanded(isExpanded)}> */}
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
                                    ref={gstFormRef}
                                    style={{
                                      marginLeft: 5,
                                      marginRight: 5,
                                      marginBottom: 0,
                                    }}
                                  >
                                    <div className="booking-form-i booking-form-i3">
                                      <label>GSTIN</label>
                                      <div className="input">
                                        <input
                                          type="text"
                                          name="gstin"
                                          placeholder=""
                                          defaultValue={GstEntries.gstin}
                                          // onChange={(e) => setGstRegistrationNo(e.target.value)}
                                          // onKeyPress={handleGstKeyPress}
                                        />
                                      </div>
                                      <span
                                        className="error-message gst_registration_no-message"
                                        style={{
                                          display: "none",
                                          color: "red",
                                          fontWeight: "normal",
                                        }}
                                      >
                                        Please enter GSTIN.
                                      </span>
                                    </div>

                                    <div className="booking-form-i booking-form-i3">
                                      <label>Company Name</label>
                                      <div className="input">
                                        <input
                                          type="text"
                                          name="company_name"
                                          defaultValue={GstEntries.company_name}
                                          placeholder=""
                                        />
                                      </div>
                                      <span
                                        className="error-message company_gst_name-message"
                                        style={{
                                          display: "none",
                                          color: "red",
                                          fontWeight: "normal",
                                        }}
                                      >
                                        Please enter Name.
                                      </span>
                                    </div>

                                    <div className="booking-form-i booking-form-i3">
                                      <label>GST Address</label>
                                      <div className="input">
                                        <input
                                          type="text"
                                          name="company_address"
                                          defaultValue={
                                            GstEntries.company_address
                                          }
                                          placeholder=""
                                        />
                                      </div>
                                      <span
                                        className="error-message company_gst_name-message"
                                        style={{
                                          display: "none",
                                          color: "red",
                                          fontWeight: "normal",
                                        }}
                                      >
                                        Please enter GST Address.
                                      </span>
                                    </div>

                                    <div className="booking-form-i booking-form-i3">
                                      <label>GST Contact</label>
                                      <div className="input">
                                        <input
                                          type="text"
                                          name="company_contact"
                                          defaultValue={
                                            GstEntries.company_contact
                                          }
                                          placeholder=""
                                        />
                                      </div>
                                      <span
                                        className="error-message company_gst_name-message"
                                        style={{
                                          display: "none",
                                          color: "red",
                                          fontWeight: "normal",
                                        }}
                                      >
                                        Please enter GST Contact.
                                      </span>
                                    </div>
                                    <div className="booking-form-i booking-form-i2">
                                      <label>Email ID</label>
                                      <div className="input">
                                        <input
                                          type="email"
                                          name="company_email"
                                          placeholder=""
                                          // readOnly={bookingid}
                                          onChange={(e) =>
                                            setGstForm({
                                              ...gstForm,
                                              company_email: e.target.value,
                                            })
                                          }
                                          defaultValue={
                                            GstEntries.company_email
                                          }
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
                                  </div>
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
                                                onClick={() => {
                                                  setAccordion4Expanded(true);
                                                  setAccordion5Expanded(false);
                                                  setShowModal(false);
                                                }}
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
                                      id="save-passenger-btn"
                                      className="passenger-submit"
                                      onClick={() => {
                                        SaveGstDetails();
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
                            {/* <Accordion expanded={accordion2Expanded} onChange={(event, isExpanded) => setAccordion2Expanded(isExpanded)}>
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
                                      marginBottom: 0
                                    }}
                                  >
                                    <div className="booking-form-i booking-form-i2">
                                      <label>Email ID</label>
                                      <div className="input">
                                        <input
                                          type="email"
                                          name="email"
                                          placeholder=""
                                          // readOnly={bookingid}
                                          defaultValue='flight@cotrav.co'
                                        />

                                      </div>
                                      <span
                                        className="error-message email-message"
                                        style={{
                                          display: "none",
                                          color: "red",
                                          fontWeight: "normal"
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
                                        // defaultValue={emptaxivaxi && emptaxivaxi[0] && emptaxivaxi[0]['people_contact'] &&
                                        //     emptaxivaxi[0]['people_contact']
                                        // }
                                        />
                                      </div>
                                      <span
                                        className="error-message contact_details-message"
                                        style={{
                                          display: "none",
                                          color: "red",
                                          fontWeight: "normal"
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
                                        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                                      >
                                        <div className="modal-dialog modal-md">
                                          <div className="modal-content rounded-md px-4 py-2" style={{ maxWidth: '605px', margin: 'auto' }}>
                                            <div className="flex border-0 pb-2">
                                              <h5 className="text-center modal-title text-lg text-gray-600 font-semibold mx-auto" id="exampleModalLabel">
                                                Review Details
                                              </h5>

                                            </div>
                                            <div className="review-details" style={{ fontSize: '11px', fontFamily: 'Montserrat', textAlign: 'left' }}>Please ensure that the spelling of your name and other details match with your travel document/govt. ID, as these cannot be changed later. Errors might lead to cancellation penalties.</div>
                                            <br />
                                            <div className="modal-body pt-0">
                                              <div className="row flex flex-col gap-2">
                                                {PassengerData.map((passenger, index) => (
                                                  <div key={index} className=" border-b border-gray-300 p-2 text-sm text-gray-600">
                                                    <div className="font-bold text-sm mb-2" style={{ color: 'black' }}>
                                                      Passenger {index + 1}
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '50px' }}>
                                                      <div style={{ width: '100px', fontWeight: '600' }}>Name:</div>
                                                      <div style={{ display: 'flex-1' }}>{passenger.firstName} {passenger.lastName} {passenger.gender === 'F' ? '(Female)' : '(Male)'}</div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '50px' }}>
                                                      <div style={{ width: '100px', fontWeight: '600' }}>Email:</div>
                                                      <div style={{ display: 'flex-1' }}>{passenger.email}</div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '50px' }}>
                                                      <div style={{ width: '100px', fontWeight: '600' }}>Contact No:</div>
                                                      <div style={{ display: 'flex-1' }}>+{passenger.contact}</div>
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                            <div className="flex justify-center gap-4 mt-1 pb-2">
                                              <button
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                                className="bg-black text-white px-3 py-2 rounded font-semibold"
                                              >
                                                Edit
                                              </button>
                                              <button
                                                type="button"
                                                onClick={() => { setAccordion4Expanded(true); setAccordion2Expanded(false) }}
                                                className="bg-violet-500 hover:bg-violet-600 text-white px-5 py-2 rounded font-semibold"
                                              >
                                                Confirm
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                    )}
                                    <button type="button" className="save_details" onClick={() => { setShowModal(true) }}>
                                      Save Details
                                    </button>

                                  </div>
                                </div>

                              </AccordionDetails>
                              <AccordionActions>
                              </AccordionActions>
                            </Accordion> */}
                          </div>
                        </form>
                        <Accordion
                          expanded={accordion4Expanded}
                          disabled={!isPassengerSaved}
                          onChange={(event, isExpanded) => {
                            if (isPassengerSaved) {
                              setAccordion4Expanded(isExpanded);
                            }
                            if (
                              Array.isArray(BaggageData) &&
                              BaggageData.length > 0
                            ) {
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
                              {BaggageData && BaggageData.length > 0 ? (
                                ""
                              ) : (
                                <span className="extradisabled">
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
                                              <div>
                                                Extra Baggage{b.Weight}KG
                                              </div>
                                              <div>₹{b.baggage.Price}</div>
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
                                const passengerMeal = selectedMeals.find(
                                  (m) =>
                                    m.passengerIndex === index &&
                                    m.segmentKey === selectedSegmentKey
                                );
                                console.log(
                                  "Selected baggage",
                                  selectedBaggage
                                );
                                return (
                                  <button
                                    key={index}
                                    type="button"
                                    className={`p-3 rounded-lg border text-left ${
                                      index === selectedPassengerIndex
                                        ? "border-violet-500 bg-violet-50"
                                        : "border-gray-300"
                                    } text-gray-700`}
                                    onClick={() =>
                                      setSelectedPassengerIndex(index)
                                    }
                                  >
                                    {passenger.firstName} {passenger.lastName}
                                    <br />
                                    <span className="text-xs text-gray-500">
                                      Baggage:{" "}
                                      {selectedBaggage
                                        .filter(
                                          (b) =>
                                            b.passengerIndex === index &&
                                            b.segmentKey === selectedSegmentKey
                                        )
                                        .map(
                                          (b) =>
                                            `${
                                              BaggageData[b.baggageIndex]
                                                ?.Weight
                                            }KG x${b.quantity}`
                                        )
                                        .join(", ") || "Not Selected"}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                            <div className="w-3/4">
                              <div className="flex flex-col   h-[400px] overflow-y-auto">
                                {BaggageData.map((data, baggageIndex) => {
                                  const currentBaggage = selectedBaggage.find(
                                    (b) =>
                                      b.passengerIndex ===
                                        selectedPassengerIndex &&
                                      b.segmentKey === selectedSegmentKey &&
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
                                            Extra Baggage {data.Weight}&nbsp;KG
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-4">
                                        <div className="text-sm font-semibold text-black">
                                          ₹{data.Price}
                                        </div>
                                        <div className="flex items-center gap-2 baggageoptionbuttons">
                                          {quantity === 0 ? (
                                            // <button
                                            //   type="button"
                                            //   className="px-4 py-1 text-sm border rounded-full text-purple-600 border-purple-600"
                                            //   onClick={() => { handleAddBaggage(baggageIndex, data); setSelectedPassengerIndex(0) }}
                                            // >
                                            //   Add
                                            // </button>
                                            <button
                                              type="button"
                                              className="px-4 py-1 text-sm border rounded-full text-purple-600 border-purple-600"
                                              onClick={() =>
                                                handleAddBaggage(baggageIndex)
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
                                                    baggageIndex
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
                                })}
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
                            if (isPassengerSaved) {
                              setAccordion6Expanded(isExpanded);
                            }
                            if (
                              Array.isArray(MealData) &&
                              MealData.length > 0 &&
                              MealData[0]?.Meal
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
                              {!Array.isArray(MealData) ||
                              MealData.length === 0 ? (
                                // <>
                                <span className="extradisabled">
                                  Meal not provided
                                </span>
                              ) : selectedMeals.length > 0 ? (
                                <>
                                  <span className="text-sm text-gray-500">
                                    &nbsp; ({selectedMeals.length} Selected)
                                  </span>
                                  <Tooltip
                                    title={
                                      <div className="text-sm p-2">
                                        {selectedMeals.map((meals, index) => {
                                          return (
                                            <div
                                              key={index}
                                              className="flex justify-between items-center gap-4"
                                            >
                                              <div>
                                                {meals.meal.AirlineDescription}
                                              </div>
                                              <div>₹{meals.meal.Price}</div>
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

                          <AccordionDetails className="flex gap-6">
                            <div className="w-1/4 border-r pr-4 flex flex-col gap-3">
                              {PassengerData.filter(
                                (passenger) => passenger.type !== "Infant"
                              ).map((passenger, index) => {
                                const passengerMeal = selectedMeals.find(
                                  (m) =>
                                    m.passengerIndex === index &&
                                    m.segmentKey === selectedSegmentKey
                                );
                                console.log("Seleected meals", selectedMeals);
                                return (
                                  <button
                                    key={index}
                                    type="button"
                                    className={`p-3 rounded-lg border text-left ${
                                      index === selectedPassengerIndex
                                        ? "border-violet-500 bg-violet-50"
                                        : "border-gray-300"
                                    } text-gray-700`}
                                    onClick={() =>
                                      setSelectedPassengerIndex(index)
                                    }
                                  >
                                    {passenger.firstName} {passenger.lastName}
                                    <br />
                                    <span className="text-xs text-gray-500">
                                      {passengerMeal
                                        ? `Selected: ${
                                            passengerMeal.meal
                                              .AirlineDescription || "No Meal"
                                          }`
                                        : "Meal: Not Selected"}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                            {Array.isArray(MealData) && MealData.length > 0 && (
                              <div className="w-3/4">
                                <div className="mb-4">
                                  <Tabs
                                    value={selectedSegmentKey}
                                    onChange={handleTabChange}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                  >
                                    {Array.from(
                                      new Map(
                                        MealData.map((item) => [
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
                                </div>
                                <div>
                                  <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                                    {MealData.filter(
                                      (item) =>
                                        `${item.Meal.Origin}-${item.Meal.Destination}` ===
                                        selectedSegmentKey
                                    ).map((meal, idx) => {
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
                                                {ismealfree
                                                  ? meal.Meal.Description
                                                  : meal.Meal
                                                      .AirlineDescription ||
                                                    "No Meal"}
                                              </div>
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-6">
                                            <div className="font-semibold text-sm">
                                              ₹
                                              {ismealfree
                                                ? "Free"
                                                : meal.Meal.Price}
                                            </div>

                                            {/* <button type='button' className={`px-4 py-1 border rounded-xl text-sm ${selectedMeals.some(
                                                (m) =>
                                                  m.passengerIndex === selectedPassengerIndex &&
                                                  m.segmentKey === selectedSegmentKey &&
                                                  m.meal.Code === meal.Meal.Code
                                              )
                                                ? 'text-white bg-violet-600 border-violet-600'
                                                : 'text-violet-600 border-violet-300'
                                                }`}
                                                onClick={() => {
                                                  setSelectedMeals((prev) => {
                                                    const filtered = prev.filter(
                                                      (m) =>
                                                        !(m.passengerIndex === selectedPassengerIndex && m.segmentKey === selectedSegmentKey)
                                                    );
                                                    return [
                                                      ...filtered,
                                                      {
                                                        passengerIndex: selectedPassengerIndex,
                                                        segmentKey: selectedSegmentKey,
                                                        meal: meal.Meal,
                                                      },
                                                    ];
                                                  });
                                                }}
                                              >
                                                {selectedMeals.some(
                                                  (m) =>
                                                    m.passengerIndex === selectedPassengerIndex &&
                                                    m.segmentKey === selectedSegmentKey &&
                                                    m.meal.Code === meal.Meal.Code
                                                )
                                                  ? 'Added'
                                                  : 'Add'}
                                              </button> */}
                                            <button
                                              type="button"
                                              className={`px-4 py-1 border rounded-xl text-sm ${
                                                selectedMeals.some(
                                                  (m) =>
                                                    m.passengerIndex ===
                                                      selectedPassengerIndex &&
                                                    m.segmentKey ===
                                                      selectedSegmentKey &&
                                                    m.meal.Code ===
                                                      meal.Meal.Code
                                                )
                                                  ? "text-white bg-violet-600 border-violet-600"
                                                  : "text-violet-600 border-violet-300"
                                              }`}
                                              onClick={() =>
                                                handleAddMeal(meal.Meal)
                                              }
                                            >
                                              {selectedMeals.some(
                                                (m) =>
                                                  m.passengerIndex ===
                                                    selectedPassengerIndex &&
                                                  m.segmentKey ===
                                                    selectedSegmentKey &&
                                                  m.meal.Code === meal.Meal.Code
                                              )
                                                ? "Added"
                                                : "Add"}
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
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
                                      setSelectedPassengerIndex(0);
                                    }}
                                  >
                                    Save Meal
                                  </button>
                                </div>
                              </div>
                            )}
                          </AccordionDetails>

                          <AccordionActions>
                            {/* Footer if needed */}
                          </AccordionActions>
                        </Accordion>

                        <form>
                          <div className="booking-devider" />

                          <Accordion
                            expanded={accordion3Expanded}
                            disabled={!isPassengerSaved}
                            onChange={(event, isExpanded) => {
                              if (isPassengerSaved) {
                                setAccordion3Expanded(isExpanded);
                              }
                              if (
                                Array.isArray(SeatData) &&
                                SeatData.length > 0
                              ) {
                                setAccordion3Expanded(isExpanded);
                              }
                              if (isExpanded) {
                                setSelectedPassengerIndex(0);
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
                                                <div>₹{seat.seatPrice}</div>
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
                              {currentSegment?.RowSeats?.[0]?.Seats ? (
                                <div
                                  className="panel"
                                  id="panel2"
                                  style={{ maxHeight: "450px" }}
                                >
                                  <div className="seatleft">
                                    <div className="seatleftul">
                                      {PassengerData.filter(
                                        (passenger) =>
                                          passenger.type !== "Infant"
                                      ).map((passenger, index) => {
                                        const currentSegmentKey = `${currentSegment?.OriginAirport?.airport_municipality}-${currentSegment?.DestinationAirport?.airport_municipality}`;
                                        const CurrentSegmentCode = `${currentSegment?.OriginAirport?.airport_iata_code}-${currentSegment?.DestinationAirport?.airport_iata_code}`;
                                        const selectedSeat = selectedSeats.find(
                                          (s) =>
                                            s.passengerIndex === index &&
                                            s.segmentKey === CurrentSegmentCode
                                        );
                                        console.log(
                                          "Seleected seats",
                                          selectedSeats
                                        );
                                        return (
                                          <button
                                            key={index}
                                            type="button"
                                            className={`seatleftli tablinkseat ${
                                              selectedPassengerIndex === index
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
                                              ₹{selectedSeat?.seatPrice || "NA"}
                                            </span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
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
                                            {SeatData.length > 1 &&
                                              currentFlightIndex > 0 && (
                                                <button
                                                  type="button"
                                                  className="seatprevbutton"
                                                  onClick={handlePrev}
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
                                                  onClick={handleNext}
                                                >
                                                  {">>"}
                                                </button>
                                              )}

                                            <div style={{ display: "block" }}>
                                              <div className="plane passenger">
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
                                                          .RowSeats[0].Seats[0]
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
                                                  {(() => {
                                                    const rowMap = {};
                                                    const seatLettersSet =
                                                      new Set();

                                                    currentSegment?.RowSeats?.forEach(
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
                                                      <>
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
                                                                    const currentSegmentKey = `${currentSegment?.RowSeats[0]?.Seats[0]?.Origin}-${currentSegment?.RowSeats[0]?.Seats[0]?.Destination}`;

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
                                                                            selectedSeats.some(
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
                                                                          checked={selectedSeats.some(
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
                                                                          // onChange={() => {
                                                                          //   setSelectedSeats(prev => {
                                                                          //     const filtered = prev.filter(
                                                                          //       s =>
                                                                          //         !(
                                                                          //           s.passengerIndex === selectedPassengerIndex &&
                                                                          //           s.segmentKey === currentSegmentKey
                                                                          //         )
                                                                          //     );

                                                                          //     return [
                                                                          //       ...filtered,
                                                                          //       {
                                                                          //         passengerIndex: selectedPassengerIndex,
                                                                          //         segmentKey: currentSegmentKey,
                                                                          //         seatCode,
                                                                          //         seatPrice,
                                                                          //         seat: seat,
                                                                          //       }
                                                                          //     ];
                                                                          //   });
                                                                          // }}
                                                                          onChange={() => {
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
                                                                                          currentSegmentKey
                                                                                      )
                                                                                  );

                                                                                return [
                                                                                  ...filtered,
                                                                                  {
                                                                                    passengerIndex:
                                                                                      selectedPassengerIndex,
                                                                                    segmentKey:
                                                                                      currentSegmentKey,
                                                                                    seatCode,
                                                                                    seatPrice,
                                                                                    seat,
                                                                                  },
                                                                                ];
                                                                              }
                                                                            );

                                                                            // ✅ AUTO MOVE TO NEXT PASSENGER
                                                                            if (
                                                                              selectedPassengerIndex <
                                                                              nonInfantPassengers.length -
                                                                                1
                                                                            ) {
                                                                              setSelectedPassengerIndex(
                                                                                (
                                                                                  prev
                                                                                ) =>
                                                                                  prev +
                                                                                  1
                                                                              );
                                                                            }
                                                                          }}
                                                                        />

                                                                        <label
                                                                          htmlFor={
                                                                            seatCode
                                                                          }
                                                                          className={`${
                                                                            seatPrice >
                                                                            0
                                                                              ? "paid"
                                                                              : "free"
                                                                          } ${
                                                                            isUnavailable
                                                                              ? "unavailable"
                                                                              : "available"
                                                                          }`}
                                                                          title={`[${seatCode}] ₹${seatPrice}`}
                                                                        ></label>
                                                                        <span className="tooltip">
                                                                          {isUnavailable
                                                                            ? "Unavailable"
                                                                            : "Available"}{" "}
                                                                          [
                                                                          {
                                                                            seatCode
                                                                          }
                                                                          ] ₹
                                                                          {
                                                                            seatPrice
                                                                          }
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
                                </div>
                              ) : (
                                <div className="text-center p-4 text-danger">
                                  Seat data not available for this flight.
                                </div>
                              )}
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
                          {FlightData?.Origin?.OriginAirline?.AirlineCode ===
                          FlightData?.Destination?.DestinationAirline
                            ?.AirlineCode ? (
                            <img
                              className={`airlineimg`}
                              src={`https://devapi.taxivaxi.com/airline_logo_images/${FlightData?.Origin?.OriginAirline?.AirlineCode}.png`}
                              alt="Airline logo"
                              width="40px"
                            />
                          ) : (
                            <div className="flex inline-block">
                              <img
                                className={`airlineimg`}
                                src={`https://devapi.taxivaxi.com/airline_logo_images/${FlightData?.Origin?.OriginAirline?.AirlineCode}.png`}
                                alt="Airline logo"
                                width="40px"
                              />
                              <img
                                className={`airlineimg`}
                                src={`https://devapi.taxivaxi.com/airline_logo_images/${FlightData?.Destination?.DestinationAirline?.AirlineCode}.png`}
                                alt="Airline logo"
                                width="40px"
                              />
                            </div>
                          )}
                          <br />
                          <span className="flightnumber">
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
                        <span className="chk-l">Airlines</span>
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
                        <span className="chk-l">Cabin Class</span>
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
                              {/* ₹ {FareData?.BaseFare?.toFixed(2)} */}₹{" "}
                              {/* {PerPassFareData.find(
                                (item) => item.PassengerType === 1
                              )?.BaseFare?.toFixed(2) || "0.00"} */}
                              {BaseFare}
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
                              {/* ₹ {FareData?.BaseFare?.toFixed(2)} */}₹{" "}
                              {PerPassFareData.find(
                                (item) => item.PassengerType === 2
                              )?.BaseFare?.toFixed(2) || "0.00"}
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
                              {/* ₹ {FareData?.BaseFare?.toFixed(2)} */}₹{" "}
                              {PerPassFareData.find(
                                (item) => item.PassengerType === 3
                              )?.BaseFare?.toFixed(2) || "0.00"}
                            </span>
                          </span>
                          <div className="clear" />
                        </div>
                      )}

                      <div className="chk-line">
                        <div className="chk-line-item">
                          <span className="chk-l">27GST</span>
                          <span className="chk-r">₹ {k3Tax}</span>
                          <div className="clear" />
                        </div>
                      </div>

                      <div className="chk-line">
                        <span className="chk-l">Others</span>
                        <span className="chk-r">
                          ₹ {otherchargeswithmarkup.toFixed(2)}
                        </span>
                        <div className="clear" />
                      </div>

                      <div className="chk-line">
                        <span className="chk-l">Extra Services </span>
                        <span className="chk-r">₹{totalServicePrice}</span>
                        <div className="clear" />
                      </div>
                      <div className="chk-line">
                        <span className="chk-l">Client Price (per pax)</span>
                        <span className="chk-r">₹{ClientPriceValue}</span>
                        <div className="clear" />
                      </div>
                    </div>
                    <div className="chk-total">
                      <div className="chk-total-l">Total Price</div>
                      <div className="chk-total-r" style={{ fontWeight: 700 }}>
                        {/* ₹ {FareData?.PublishedFare?.toFixed(2)} */}
                        {/* {(
                          (Number(FareData?.PublishedFare) || 0) +
                          Number(totalServicePrice)
                        ).toFixed(2)} */}
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
                      <h2 className=" mt-0">Breakdown Of Extra Services</h2>
                      <div className="chk-detais-row">
                        {selectedMeals.length > 0 && (
                          <div className="chk-line">
                            <span className="chk-l">
                              Meal X {selectedMeals.length}
                              <Tooltip
                                title={
                                  <div className="text-sm p-2">
                                    {selectedMeals.map((meals, index) => {
                                      return (
                                        <div
                                          key={index}
                                          className="flex justify-between items-center gap-4"
                                        >
                                          <div>
                                            {meals.meal.AirlineDescription}
                                          </div>
                                          <div>₹{meals.meal.Price}</div>
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
                              <span className="chk-r">₹ {totalMealPrice}</span>
                            </span>
                            <div className="clear" />
                          </div>
                        )}
                        {selectedBaggage.length > 0 && (
                          <div className="chk-line">
                            <span className="chk-l">
                              Baggage X {selectedBaggage.length}
                              <Tooltip
                                title={
                                  <div className="text-sm p-2">
                                    {selectedBaggage.map((b, index) => {
                                      return (
                                        <div
                                          key={index}
                                          className="flex justify-between items-center gap-4"
                                        >
                                          <div>Extra Baggage{b.Weight}KG</div>
                                          <div>₹{b.baggage.Price}</div>
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
                              Seat X {selectedSeats.length}
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
                                          <div>₹{seat.seatPrice}</div>
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

export default FlightTbobookingflow;
