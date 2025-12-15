import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import CONFIG from "./config";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Swal from "sweetalert2";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Tooltip,
  IconButton,
} from "@mui/material";
const CompleteFlightbookingReturn = () => {
  const base_url = `${CONFIG.BASE_URL}`;
  const location = useLocation();
  const hasFetchedRef = useRef(false);
  const hasFetched = useRef(false);
  const FinalDetails = location.state && location.state.FlightBooking;
  // console.log(FinalDetails);
  const Passenger = localStorage.getItem("Passengerdetails");
  const PassengerInfo = JSON.parse(Passenger);
  const responseData = location.state && location.state.responseData;
  console.log("REponse", responseData);
  const [finalresponse, setfinalresponse] = useState([]);
  const [taxivaxiresponse, settaxivaxiresponse] = useState([]);
  const [PNR, setPNR] = useState("");
  const [PNRReturn, setPNRReturn] = useState("");
  const [Segments, setSegments] = useState([]);
  const [SegmentsReturn, setSegmentsReturn] = useState([]);
  const [PassengerDetails, setPassengerDetails] = useState([]);
  const [PassengerDetailsReturn, setPassengerDetailsReturn] = useState([]);
  const [FlightDetails, setFlightDetails] = useState([]);
  const [FlightDetailsReturn, setFlightDetailsReturn] = useState([]);
  const [loadingg, setLoadingg] = useState(false);
  const [Seatloading, setSeatloading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTooltip2, setShowTooltip2] = useState(false);
  const [showTooltip3, setShowTooltip3] = useState(false);
  const [showTooltip4, setShowTooltip4] = useState(false);
  const [showTooltip5, setShowTooltip5] = useState(false);
  const [showTooltip6, setShowTooltip6] = useState(false);
  const [showTooltip7, setShowTooltip7] = useState(false);
  const [showTooltip8, setShowTooltip8] = useState(false);
  const [showTooltip9, setShowTooltip9] = useState(false);
const hasAssigned = useRef(false);

useEffect(() => {
  finalfetch();
  finalfetchReturn();
}, []);

useEffect(() => {
  if (
    !hasAssigned.current && // ensure it runs only once
    FlightDetails && 
    Object.keys(FlightDetails).length > 0 &&
    FlightDetailsReturn && 
    Object.keys(FlightDetailsReturn).length > 0
  ) {
    hasAssigned.current = true; // mark as executed
    UapiAssignbooking(FlightDetails, FlightDetailsReturn);
  }
}, [FlightDetails, FlightDetailsReturn]);

  //For Onwasrd Flight
  const finalfetch = async () => {
    setLoadingg(true);
    const requestData = {
      traceId: FinalDetails?.onwards?.traceId,
    };
    // console.log(requestData);
    try {
      setLoadingg(true);
      const response = await fetch(`${CONFIG.BASE_URL}getTicketData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const Data = await response.json();

      setLoadingg(false);
      if (Data.status) {
        const finalresponse = Data.data;
        setFlightDetails(finalresponse);
        const PNR = finalresponse.locatorCode.UniversalLocatorCode;
        setPNR(PNR);
        const segmentsData = finalresponse?.flight_details;
        // console.log(segmentsData)
        setSegments(
          Array.isArray(segmentsData) ? segmentsData : [segmentsData]
        );
        // setSegments(finalresponse?.FlightItinerary?.AirReservation?.AirSegment);
        setPassengerDetails(finalresponse?.data?.flight_details?.Passengers);

        // console.log('PNR',PNR)
        // UapiAssignbooking(finalresponse);
      }
    } catch {
      setLoadingg(false);
    }
  };

  //For Return Flight
  const finalfetchReturn = async () => {
    setLoadingg(true);
    const requestData = {
      traceId: FinalDetails?.returns?.traceId,
    };
    console.log(requestData);
    try {
      setLoadingg(true);
      const response = await fetch(`${CONFIG.BASE_URL}getTicketData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const Data = await response.json();
      // console.log('HELLO');
      // console.log(Data);
      setLoadingg(false);
      if (Data.status) {
        // console.log('HELLO2');
        const finalresponse = Data.data;
        setFlightDetailsReturn(finalresponse);
        const PNR = finalresponse.locatorCode.UniversalLocatorCode;
        setPNRReturn(PNR);
        const segmentsData = finalresponse?.flight_details;
        console.log(segmentsData);
        setSegmentsReturn(
          Array.isArray(segmentsData) ? segmentsData : [segmentsData]
        );
        // setSegments(finalresponse?.FlightItinerary?.AirReservation?.AirSegment);
        setPassengerDetailsReturn(
          finalresponse?.data?.flight_details?.Passengers
        );

        // console.log('PNR',PNR)
        // UapiAssignbooking(finalresponse);
      }
    } catch {
      setLoadingg(false);
    }
  };


  const UapiAssignbooking = async (FlightDetails, FlightDetailsReturn) => {
    // setLoadingg(false)
    // console.log("live or demo",finalresponse?.productionMode)
    // console.log("URL", finalresponse?.productionMode == 'live' ? CONFIG.LIVE_ASSIGN : CONFIG.DEMO_ASSIGN)
    const taxivaxipassenger = responseData?.Passengerdetails;
    // console.log(taxivaxipassenger)
    const flight_details_Onward = FlightDetails?.flight_details?.map(
      (flight) => ({
        from_city: flight?.from_city,
        to_city: flight?.to_city,
        departure_datetime: formatDateTime(flight.departure_datetime),
        arrival_datetime: formatDateTime(flight.arrival_datetime),
        flight_name: `${flight.flight} (${responseData.flighttype})`,
        flight_no: flight?.flight_no,
        checked_bg: "15 kg", // placeholder
        cabin_bg: "7 kg", // placeholder
        pnr_no: FlightDetails?.PNR || "NA",
        seat_type: flight?.CabinClass,
        via: flight?.via,
        no_of_stops: flight?.no_of_stops,
        passenger_details: flight.Passengers?.map((p, idx) => {
          const seatService = p.OptionalServices?.find(
            (s) => s.Type === "PreReservedSeatAssignment"
          );
          const mealService = p.OptionalServices?.find(
            (s) => s.Type === "MealOrBeverage"
          );
          const matchingEmployee = taxivaxipassenger.find(
            (emp) =>
              emp.firstName?.toLowerCase() === p.First?.toLowerCase() &&
              emp.lastName?.toLowerCase() === p.Last?.toLowerCase() &&
              emp.user_type === p.TravelerType
          );
          return {
            people_id: matchingEmployee?.id,
            seat_no: seatService?.ServiceData?.Data || "NA",
            ticket_no: finalresponse?.PNR || "NA",
            meal_include: mealService?.Value || "NA",
          };
        }),
      })
    );
    const flight_details_Return = FlightDetailsReturn?.flight_details?.map(
      (flight) => ({
        from_city: flight?.from_city,
        to_city: flight?.to_city,
        departure_datetime: formatDateTime(flight.departure_datetime),
        arrival_datetime: formatDateTime(flight.arrival_datetime),
        flight_name: `${flight.flight} (${responseData.flighttype})`,
        flight_no: flight?.flight_no,
        checked_bg: "15 kg", // placeholder
        cabin_bg: "7 kg", // placeholder
        pnr_no: FlightDetails?.PNR || "NA",
        seat_type: flight?.CabinClass,
        via: flight?.via,
          no_of_stops: flight?.no_of_stops,
        passenger_details: flight.Passengers?.map((p, idx) => {
          const seatService = p.OptionalServices?.find(
            (s) => s.Type === "PreReservedSeatAssignment"
          );
          const mealService = p.OptionalServices?.find(
            (s) => s.Type === "MealOrBeverage"
          );
          const matchingEmployee = taxivaxipassenger.find(
            (emp) =>
              emp.firstName?.toLowerCase() === p.First?.toLowerCase() &&
              emp.lastName?.toLowerCase() === p.Last?.toLowerCase() &&
              emp.user_type === p.TravelerType
          );
          return {
            people_id: matchingEmployee?.id,
            seat_no: seatService?.ServiceData?.Data || "NA",
            ticket_no: finalresponse?.PNR || "NA",
            meal_include: mealService?.Value || "NA",
          };
        }),
      })
    );
    // console.log("flight details", flight_details)
    const requestData = {
      access_token: responseData?.accessToken,
      booking_id: responseData?.bookingid,
      flight_type: responseData?.flighttype,
      trip_type: responseData?.bookingtype,
      fare_type: "Refundable",
      is_extra_baggage_included: FlightDetails?.is_extra_baggage_included,
      extra_baggage: FlightDetails?.baggage_count,
      no_of_stops: FlightDetails?.no_of_stops,
      no_of_seats: responseData?.no_of_seats,
      universallocatorCode: FlightDetails?.universallocatorCode,
      discount: FlightDetails?.discount,
      date_change_charges: FlightDetails?.date_change_charges,
      seat_charges: FlightDetails?.seat_charges,
      meal_charges: FlightDetails?.meal_charges,
      extra_baggage_charges: FlightDetails?.extra_baggage_charges,
      fast_forward_charges: 0,
      vip_service_charges: 0,
      applied_markup: "",
      actual_markup: "",
      total_ex_tax_fees: FlightDetails?.fareDetails?.total_ex_tax_fees,
      // total_price: removeCurrency(Totalprice) + removeCurrency(seatcharge)+removeCurrency(mealcharge),
      tax_and_fees: FlightDetails?.fareDetails?.tax_and_fees,
      gst_k3: FlightDetails?.fareDetails?.gst_k3,
      //

      portal_used: FlightDetails?.portal_used,
      portal_used_return: FlightDetailsReturn?.portal_used,
      fare_type_return: "Refundable",
      is_extra_baggage_included_return:
      FlightDetailsReturn?.is_extra_baggage_included,
      no_of_stops_return: FlightDetailsReturn?.no_of_stops,
      extra_baggage_return: FlightDetailsReturn?.extra_baggage,
      universallocatorCode_return: FlightDetailsReturn?.universallocatorCode,

      flight_details : flight_details_Onward,
      return_flight_details: flight_details_Return,

      // returns: '',
      // reservationStatus: bookingStatus,
    };
console.log("Request Data for Assign Booking", requestData);
    try {
      // const response = await fetch(finalresponse?.productionMode == 'live' ? CONFIG.LIVE_ASSIGN : CONFIG.DEMO_ASSIGN, {
      const response = await fetch(`${CONFIG.ASSIGN_API}`, {
        method: "POST",
        headers: {
          // 'Content-Type': 'application/json',
          // 'Access-Token': responseData?.accessToken,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(requestData),
      });
      const Data = await response.json();
      console.log(Data);
      settaxivaxiresponse(Data);
      setLoadingg(false);
    } catch (error) {
      settaxivaxiresponse(error);
      setLoadingg(false);
    }
  };
  function removeCurrency(amountString, currencyCode = "INR") {
    if (!amountString || typeof amountString !== "string") return null;

    // Remove currency code (case-insensitive) and extra spaces
    const cleaned = amountString
      .replace(new RegExp(currencyCode, "i"), "")
      .trim();

    // Convert to number
    const value = parseFloat(cleaned);

    return isNaN(value) ? null : value;
  }
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    // Get individual components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // Return in desired format
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  // const formatDateTime = (fullDateTime) => {
  //   const year = fullDateTime.getFullYear();
  //   const month = String(fullDateTime.getMonth() + 1).padStart(2, '0');
  //   const day = String(fullDateTime.getDate()).padStart(2, '0');

  //   // Format as 'yy-mm-dd'
  //   return `${year}-${month}-${day}`;
  // };

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
  //Hrs caculator
  function Hrscaculator(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  }
  //Time Format
  function dateTime(dateTime) {
    return new Date(dateTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  // const SeatFetch = async () => {
  //   const requestData = {
  //     traceId: FinalDetails?.traceId,
  //     passengerDetails: PassengerInfo,
  //   };
  //   try {
  //     setSeatloading(true);
  //     const response = await fetch(
  //       `${base_url}seatMapAfterTicket`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(requestData),
  //       }

  //     );
  //     const Data = await response.json();
  //     // console.log(Data)
  //     const responseData = Data.data.seatsData.Rows;
  //     setSeatdata(responseData)
  //     setSeatloading(false)
  //   } catch {
  //     setSeatloading(false);

  //   }
  // }
  // useEffect(() => {
  //   if (!hasFetchedRef.current) {
  //     SeatFetch();
  //     hasFetchedRef.current = true;
  //   }
  // }, []);

  // const handlePrev = () => {
  //   setCurrentFlightIndex((prev) =>
  //     prev > 0 ? prev - 1 : SeatData[0]?.Segments.length - 1
  //   );
  // };

  // const handleNext = () => {
  //   setCurrentFlightIndex((prev) =>
  //     prev < SeatData[0]?.Segments.length - 1 ? prev + 1 : 0
  //   )
  // };
  // const handleseatbuttonskip = () => {
  //   setAccordion3Expanded(false);
  // }
  // const AddSeat = async () => {
  //   if (!selectedSeats || Object.keys(selectedSeats).length === 0) {
  //     await Swal.fire({
  //       iconHtml: '<i class="fa fa-exclamation" aria-hidden="true"></i>',
  //       title: 'No Seat Selected',
  //       text: 'Please select a seat before continuing.',
  //       confirmButtonText: 'OK'
  //     });
  //     return; // Stop the process if no seat selected
  //   }

  //   const result = await Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'Do you want to add the selected seat?',
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, Continue',
  //     cancelButtonText: 'Cancel'
  //   });

  //   if (!result.isConfirmed) {
  //     return; // Stop the booking if user cancels
  //   }
  //   const requestData = {
  //     traceId: FinalDetails?.traceId,
  //     passengerDetails: PassengerInfo,
  //   };
  //   try {
  //     setLoadingg(true);
  //     const response = await fetch(
  //       `${base_url}seatMapAfterTicket`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(requestData),
  //       }

  //     );
  //     const Data = await response.json();

  //     setLoadingg(false)
  //   } catch {
  //     setLoadingg(false)
  //   }
  // }
  // //replace
  // function replaceINRWithSymbol(price) {
  //   if (!price) return '';
  //   return price.replace('INR', '₹');
  // }

  function splitBySpace(text) {
    if (!text) return { before: "", after: "" };
    const parts = text.split(" ");
    return {
      before: parts[0] || "",
      after: parts[1] || "",
    };
  }
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
      {loadingg && (
        <div className="page-center-loader flex items-center justify-center backdrop-blur-sm bg-white/30">
          <div className="big-loader flex items-center justify-center">
            <img
              className="loader-gif"
              src="/img/cotravloader.gif"
              alt="Loader"
            />
            <p className="text-center ml-4 text-gray-600 text-lg">
              Retrieving Flight details. Please wait a moment.
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
                          <div className="baggagae_policy mb-3">
                            <>
                              <span
                                className="Bookingsuccessful"
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                {taxivaxiresponse?.response?.message ||
                                  taxivaxiresponse?.error}
                                {/* <span>
                                  Booking Id : {taxivaxiresponse?.response?.booking_id || "Not Assigned"}
                                </span> */}
                              </span>
                              <div
                                className="modal fade bd-example-modal-lg multipleflight"
                                tabIndex={-1}
                                role="dialog"
                                aria-labelledby="myLargeModalLabel"
                                aria-hidden="true"
                              ></div>
                            </>
                          </div>

                          <div className="baggagae_policy">
                            <>
                              <span
                                className="Bookingheading"
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                Confirmed Flight Details
                                <span>PNR No. {PNR}</span>
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
                                className="border border-gray-300 rounded-md overflow-hidden mb-4 bg-white shadow-sm"
                              >
                                {/* Top Row: Route and Date */}
                                <div className="flex justify-between items-center px-4 py-2 bg-gray-50">
                                  <div className="text-lg font-semibold text-[#0E0E3E]">
                                    {data?.from_city}{" "}
                                    <span className="mx-2">→</span>{" "}
                                    {data?.to_city}
                                  </div>
                                  <span className="block text-sm text-gray-500">
                                    {handleweekdatemonthyear(
                                      data?.departure_datetime
                                    )}
                                  </span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-blue-500 text-xs font-semibold px-2 py-1 rounded">
                                      {data?.seat_type}
                                    </span>
                                  </div>
                                </div>

                                {/* Flight Info */}
                                <div className="flex items-center justify-between px-4 py-3 gap-6">
                                  <div className="flex items-center gap-2 max-w-[120px]">
                                    <img
                                      className="w-8 h-8"
                                      src={`https://devapi.taxivaxi.com/airline_logo_images/${data?.carrier}.png`}
                                      alt="Airline logo"
                                    />
                                    <div>
                                      <div className="font-medium text-gray-800">
                                        {data?.flight}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {data?.flight_no}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-center max-w-[180px]">
                                    <div className="text-lg font-semibold">
                                      {dateTime(data?.departure_datetime)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {data?.from_city}
                                    </div>
                                  </div>
                                  <div className="text-center max-w-[100px]">
                                    <div className="text-sm font-medium text-gray-700">
                                      {Hrscaculator(data?.TravelTime)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Duration
                                    </div>
                                  </div>
                                  <div className="text-center max-w-[180px]">
                                    <div className="text-lg font-semibold">
                                      {dateTime(data?.arrival_datetime)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {data?.to_city}
                                    </div>
                                  </div>
                                </div>

                                {/* Passenger Details */}
                                <div className="px-4 py-3 border-t bg-gray-50">
                                  <h4 className="font-semibold text-sm text-gray-700 mb-2">
                                    Passenger Details
                                  </h4>

                                  {data?.Passengers?.map(
                                    (passenger, pIndex) => (
                                      <div
                                        key={pIndex}
                                        className="border border-gray-200 rounded-lg p-3 mb-3 bg-white shadow-sm"
                                      >
                                        <div className="flex justify-between items-center">
                                          <div>
                                            <span className="font-medium">
                                              {passenger.First} {passenger.Last}
                                            </span>{" "}
                                            <span className="text-xs text-gray-500 ml-2">
                                              ({passenger.TravelerType})
                                            </span>
                                          </div>
                                          <span className="text-xs text-gray-500">
                                            Age: {passenger.Age || "NA"}
                                          </span>
                                        </div>

                                        {/* Optional Services */}
                                        {passenger?.OptionalServices?.length >
                                          0 && (
                                          <div className="mt-2">
                                            <p className="text-xs font-semibold text-gray-600 mb-1">
                                              Selected Services:
                                            </p>
                                            <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                                              {passenger.OptionalServices.map(
                                                (service, sIndex) => (
                                                  <li key={sIndex}>
                                                    {service.Type ===
                                                    "PreReservedSeatAssignment" ? (
                                                      <>
                                                        Seat:{" "}
                                                        <span className="font-medium">
                                                          {
                                                            service?.ServiceData
                                                              ?.Data
                                                          }
                                                        </span>{" "}
                                                        (₹{service.TotalPrice})
                                                      </>
                                                    ) : (
                                                      <>
                                                        {service.Value} (₹
                                                        {service.TotalPrice})
                                                      </>
                                                    )}
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          {/* Return Flight Details */}
                          <div className="baggagae_policy">
                            <>
                              <span
                                className="Bookingheading"
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                Confirmed Flight Details
                                <span>PNR No. {PNRReturn}</span>
                              </span>
                              <div
                                className="modal fade bd-example-modal-lg multipleflight"
                                tabIndex={-1}
                                role="dialog"
                                aria-labelledby="myLargeModalLabel"
                                aria-hidden="true"
                              ></div>
                            </>

                            {SegmentsReturn.map((data, index) => (
                              <div
                                key={index}
                                className="border border-gray-300 rounded-md overflow-hidden mb-4 bg-white shadow-sm"
                              >
                                {/* Top Row: Route and Date */}
                                <div className="flex justify-between items-center px-4 py-2 bg-gray-50">
                                  <div className="text-lg font-semibold text-[#0E0E3E]">
                                    {data?.from_city}{" "}
                                    <span className="mx-2">→</span>{" "}
                                    {data?.to_city}
                                  </div>
                                  <span className="block text-sm text-gray-500">
                                    {handleweekdatemonthyear(
                                      data?.departure_datetime
                                    )}
                                  </span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-blue-500 text-xs font-semibold px-2 py-1 rounded">
                                      {data?.seat_type}
                                    </span>
                                  </div>
                                </div>

                                {/* Flight Info */}
                                <div className="flex items-center justify-between px-4 py-3 gap-6">
                                  <div className="flex items-center gap-2 max-w-[120px]">
                                    <img
                                      className="w-8 h-8"
                                      src={`https://devapi.taxivaxi.com/airline_logo_images/${data?.carrier}.png`}
                                      alt="Airline logo"
                                    />
                                    <div>
                                      <div className="font-medium text-gray-800">
                                        {data?.flight}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {data?.flight_no}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-center max-w-[180px]">
                                    <div className="text-lg font-semibold">
                                      {dateTime(data?.departure_datetime)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {data?.from_city}
                                    </div>
                                  </div>
                                  <div className="text-center max-w-[100px]">
                                    <div className="text-sm font-medium text-gray-700">
                                      {Hrscaculator(data?.TravelTime)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Duration
                                    </div>
                                  </div>
                                  <div className="text-center max-w-[180px]">
                                    <div className="text-lg font-semibold">
                                      {dateTime(data?.arrival_datetime)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {data?.to_city}
                                    </div>
                                  </div>
                                </div>

                                {/* Passenger Details */}
                                <div className="px-4 py-3 border-t bg-gray-50">
                                  <h4 className="font-semibold text-sm text-gray-700 mb-2">
                                    Passenger Details
                                  </h4>

                                  {data?.Passengers?.map(
                                    (passenger, pIndex) => (
                                      <div
                                        key={pIndex}
                                        className="border border-gray-200 rounded-lg p-3 mb-3 bg-white shadow-sm"
                                      >
                                        <div className="flex justify-between items-center">
                                          <div>
                                            <span className="font-medium">
                                              {passenger.First} {passenger.Last}
                                            </span>{" "}
                                            <span className="text-xs text-gray-500 ml-2">
                                              ({passenger.TravelerType})
                                            </span>
                                          </div>
                                          <span className="text-xs text-gray-500">
                                            Age: {passenger.Age || "NA"}
                                          </span>
                                        </div>

                                        {/* Optional Services */}
                                        {passenger?.OptionalServices?.length >
                                          0 && (
                                          <div className="mt-2">
                                            <p className="text-xs font-semibold text-gray-600 mb-1">
                                              Selected Services:
                                            </p>
                                            <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                                              {passenger.OptionalServices.map(
                                                (service, sIndex) => (
                                                  <li key={sIndex}>
                                                    {service.Type ===
                                                    "PreReservedSeatAssignment" ? (
                                                      <>
                                                        Seat:{" "}
                                                        <span className="font-medium">
                                                          {
                                                            service?.ServiceData
                                                              ?.Data
                                                          }
                                                        </span>{" "}
                                                        (₹{service.TotalPrice})
                                                      </>
                                                    ) : (
                                                      <>
                                                        {service.Value} (₹
                                                        {service.TotalPrice})
                                                      </>
                                                    )}
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bsp-page-r ">
                <div className="checkout-coll mr-2">
                  <div className="chk-details">
                    <span className="Bookingsuccessful">
                      Booking Id :{" "}
                      {taxivaxiresponse?.response?.booking_id || "NA"}
                    </span>
                    <span className="Bookingheading">Fare Info</span>
                    <div className="chk-detais-row">
                      <div className="chk-line">
                        <span className="chk-l">Fare Type</span>
                        <span className="chk-r">
                          {/* {FlightDetails?.ResultFareType} */}
                        </span>
                        <div className="clear" />
                      </div>
                      <div className="chk-line relative items-start gap-2">
                        <div className="chk-l">Cabin Class</div>
                        <span className="chk-r">
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
                              <span className="chk-r">
                                {FlightDetails?.seat_type}
                              </span>
                            </div>

                            <hr className="my-2" />

                            <div className="flex gap-2">
                              <p className="font-semibold text-xs text-gray-800 mb-1 flex">
                                Return Airlines:
                              </p>

                              <span className="chk-r">
                                {FlightDetailsReturn?.seat_type}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="clear" />
                      </div>
                      <div className="chk-line relative items-start gap-2">
                        <div className="chk-l">27GST</div>
                        <span className="chk-r">
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
                                ₹
                                {FlightDetails?.fareDetails?.gst_k3?.toFixed(2)}
                              </span>
                            </div>

                            <hr className="my-2" />

                            <div className="flex gap-2">
                              <p className="font-semibold text-xs text-gray-800 mb-1 flex">
                                Return Airlines:
                              </p>

                              <span className="chk-r">
                                ₹
                                {FlightDetailsReturn?.fareDetails?.gst_k3?.toFixed(
                                  2
                                )}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="clear" />
                      </div>
                      <div className="chk-line relative items-start gap-2">
                        <div className="chk-l">Meal Charges</div>
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
                                {" "}
                                ₹{FlightDetails?.meal_charges?.toFixed(2)}
                              </span>
                            </div>

                            <hr className="my-2" />

                            <div className="flex gap-2">
                              <p className="font-semibold text-xs text-gray-800 mb-1 flex">
                                Return Airlines:
                              </p>

                              <span className="chk-r">
                                ₹{FlightDetailsReturn?.meal_charges?.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="clear" />
                      </div>

                      <div className="chk-line relative items-start gap-2">
                        <div className="chk-l">Baggage Charges</div>
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
                                {" "}
                                ₹
                                {FlightDetails?.extra_baggage_charges?.toFixed(
                                  2
                                )}
                              </span>
                            </div>

                            <hr className="my-2" />

                            <div className="flex gap-2">
                              <p className="font-semibold text-xs text-gray-800 mb-1 flex">
                                Return Airlines:
                              </p>

                              <span className="chk-r">
                                ₹
                                {FlightDetailsReturn?.extra_baggage_charges?.toFixed(
                                  2
                                )}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="clear" />
                      </div>
                      <div className="chk-line relative items-start gap-2">
                        <div className="chk-l">Seat Charges</div>
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
                                ₹{FlightDetails?.seat_charges?.toFixed(2)}
                              </span>
                            </div>

                            <hr className="my-2" />

                            <div className="flex gap-2">
                              <p className="font-semibold text-xs text-gray-800 mb-1 flex">
                                Return Airlines:
                              </p>

                              <span className="chk-r">
                                ₹{FlightDetailsReturn?.seat_charges?.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="clear" />
                      </div>

                      <div className="chk-line relative items-start gap-2">
                        <div className="chk-l">Flight Charges</div>
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
                                ₹
                                {FlightDetails?.fareDetails?.total_ex_tax_fees?.toFixed(
                                  2
                                )}
                              </span>
                            </div>

                            <hr className="my-2" />

                            <div className="flex gap-2">
                              <p className="font-semibold text-xs text-gray-800 mb-1 flex">
                                Return Airlines:
                              </p>

                              <span className="chk-r">
                                ₹
                                {FlightDetailsReturn?.fareDetails?.total_ex_tax_fees?.toFixed(
                                  2
                                )}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="clear" />
                      </div>

                      <div className="chk-line relative items-start gap-2">
                        <div className="chk-l">Other Charges</div>
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
                                {" "}
                                ₹
                                {FlightDetails?.fareDetails?.tax_and_fees?.toFixed(
                                  2
                                )}
                              </span>
                            </div>

                            <hr className="my-2" />

                            <div className="flex gap-2">
                              <p className="font-semibold text-xs text-gray-800 mb-1 flex">
                                Return Airlines:
                              </p>

                              <span className="chk-r">
                                ₹
                                {FlightDetailsReturn?.fareDetails?.tax_and_fees?.toFixed(
                                  2
                                )}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="clear" />
                      </div>
                    </div>
                    <div className="chk-total">
                      <div className="chk-total-l">Total Price</div>
                      <div className="chk-total-r" style={{ fontWeight: 700 }}>
                        {(() => {
                          const onwardTotal =
                            Number(FlightDetails?.fareDetails?.total) || 0;
                          const returnTotal =
                            Number(FlightDetailsReturn?.fareDetails?.total) ||
                            0;
                          const grandTotal = onwardTotal + returnTotal;

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
              </div>
              <div className="clear" />
            </div>
          </div>
        </div>
      </div>

      {/* <div className="main-cont" id="main_cont">
        <div className="body-wrapper">

          <div className="wrapper-padding">
            <span className="bgGradient"></span>

            <div className="sp-page mt-2">
              <div className="sp-page-a mt-4" style={{ paddingLeft: '25px', paddingRight: '25px' }} >

                <div className="booking-left mt-2">
                  <Accordion expanded={accordion3Expanded}
                    onChange={(event, isExpanded) => {
                      if (SeatData.length > 0) {
                        setAccordion3Expanded(isExpanded)
                        if (isExpanded) {
                          setSelectedPassengerIndex(0);
                        }
                      }
                    }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel3-content"
                      id="panel3-header"
                      className={`accordion `}
                    >
                      <div className="flex items-center gap-2">
                        <span >Choose Seats</span>
                        {SeatData.length == 0 ? (
                          <span className='extradisabled'>
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
                                        <div>{replaceINRWithSymbol(seat.seatPrice)}</div>
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
                        ) : (null)}
                      </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className='panel' id="panel2" style={{ maxHeight: "450px" }}>
                        <div className='seatleft'>
                          <div className='seatleftul'>

                            {PassengerInfo
                              .filter((passenger) => passenger.type !== 'INF') // Adjust key if needed
                              .map((passenger, index) => {
                                const passengerService = SeatData?.find(service => service.TravellerKey === selectedPassengerKey);
                                const segmentIndex = currentFlightIndex;
                                const segmentData = passengerService?.Segments?.[segmentIndex];
                                const segmentkey = segmentData?.Key;
                                const selectedSeat = selectedSeats.find(
                                  (m) => m.passengerIndex === index && m.segmentKey === segmentkey
                                );
                                return (
                                  <button
                                    key={index}
                                    type="button"
                                    className={`seatleftli tablinkseat ${selectedPassengerIndex === index ? 'active' : ''}`}
                                    onClick={() => {
                                      setSelectedPassengerIndex(index);
                                      setSelectedPassengerKey(passenger.Key);
                                    }}
                                  >
                                    {passenger.First} {passenger.Last}
                                    <br />
                                    <span>Seat No.</span>
                                    <br />
                                    <span>{selectedSeat?.seatCode || 'Not Selected'}</span>
                                    <br />
                                    <span>Price </span>
                                    <br />
                                    <span>{selectedSeat?.seatPrice || 'NA'}</span>
                                  </button>
                                );
                              })}

                          </div>

                        </div>
                        {SeatData.length > 0 && (
                          <div className='tabcontentseat'>
                            <div className='seatright'>
                              <div className='card-body' style={{ padding: '0px' }}>
                                <div className="seat_selection">

                                  <>
                                    <div className='noted_seat'>
                                      <div className='row noted_seat_clear'>
                                        <div className='col-md-9'>Free</div>
                                        <div className='col-md-3 noted_seat_free'></div>
                                      </div>
                                      <div className='row noted_seat_clear'>
                                        <div className='col-md-9'>₹ 1 - ₹ 300</div>
                                        <div className='col-md-3 noted_seat_300'></div>
                                      </div>
                                      <div className='row noted_seat_clear'>
                                        <div className='col-md-9'>{'> ₹ 300'}</div>
                                        <div className='col-md-3 noted_seat_g300'></div>
                                      </div>
                                      <div className='row noted_seat_clear'>
                                        <div className='col-md-9'>Unavailable</div>
                                        <div className='col-md-3 noted_seat_disabled'></div>
                                      </div>
                                    </div>


                                    {(() => {
                                      const passengerService = SeatData?.find(service => service.TravellerKey === selectedPassengerKey);
                                      const totalFlights = passengerService?.Segments?.length || 0;
                                      return (
                                        <>
                                          {currentFlightIndex > 0 && (
                                            <button type="button" className='seatprevbutton' onClick={handlePrev}>{'<<'}</button>
                                          )}
                                          {currentFlightIndex < totalFlights - 1 && (
                                            <button type="button" className='seatnextbutton' onClick={handleNext}>{'>>'}</button>
                                          )}
                                        </>
                                      );
                                    })()}


                                    <div style={{ display: 'block' }}>

                                      <div className="plane passenger">


                                        {(() => {
                                          const flight = SeatData?.find(service => service.TravellerKey === selectedPassengerKey)
                                            ?.Segments?.[currentFlightIndex];
                                          if (!flight) return null;

                                          return (
                                            <div className="cockpit">
                                              <h1>
                                                {flight.Origin?.airport_municipality || 'Origin'}
                                                <br />
                                                <span className="apiairportname1">{flight.Origin?.airport_name}</span>
                                                <br />
                                                <span className="brcockpit">TO</span>
                                                <br />
                                                {flight.Destination?.airport_municipality || 'Destination'}
                                                <br />
                                                <span className="apiairportname1">{flight.Destination?.airport_name}</span>
                                                <br />
                                                <span className="brcockpit1">
                                                  (Flight Number: {flight.FlightNumber}) -
                                                  <span className="equipmentno">
                                                    {flight.Equipment || 'Equip'}
                                                  </span>
                                                </span>
                                              </h1>
                                            </div>
                                          );
                                        })()}

                                        <div className="exit exit--front fuselage"></div>
                                        <ol className="cabin fuselage">


                                          {(() => {
                                            const passengerService = SeatData?.find(
                                              service => service.TravellerKey === selectedPassengerKey
                                            );
                                            const segmentIndex = currentFlightIndex;
                                            const segmentData = passengerService?.Segments?.[segmentIndex];
                                            const segmentkey = segmentData?.Key;

                                            if (!segmentData || !Array.isArray(segmentData.Rows) || segmentData.Rows.length === 0) {
                                              return (
                                                <div className="text-center text-gray-500 font-semibold py-4 px-4">
                                                  Seat Reservation Not Available
                                                </div>
                                              );
                                            }

                                            const rowMap = {};
                                            const seatLettersSet = new Set();

                                            segmentData?.Rows?.forEach((row) => {
                                              const rowNo = row.Number;
                                              const validSeats = row.Seats?.filter((seat) => seat?.SeatCode);

                                              if (!validSeats?.length || !rowNo) return;

                                              rowMap[rowNo] = {};

                                              validSeats.forEach((seat) => {
                                                const seatLetter = seat.SeatCode.split('-')[1];
                                                rowMap[rowNo][seatLetter] = {
                                                  ...seat,
                                                  rowNo,
                                                  seatLetter,
                                                  seatCode: seat.SeatCode,
                                                  price: seat.Paid === "true" ? seat.TotalPrice : 0,
                                                  isUnavailable: seat.Availability !== "Available",
                                                };

                                                seatLettersSet.add(seatLetter);
                                              });
                                            });

                                            const sortedRowNos = Object.keys(rowMap).sort((a, b) => +a - +b);
                                            const sortedSeatLetters = Array.from(seatLettersSet).sort();

                                            return (
                                              <>
                                                {sortedRowNos.map((rowNo, rowIndex) => (
                                                  <li key={rowIndex} className={`row row--${rowNo}`}>
                                                    <ol
                                                      className={`seats border-0 olrow${sortedSeatLetters.length}`}
                                                      type="A"
                                                    >
                                                      <li className="seat border-0">{rowNo}</li>
                                                      {sortedSeatLetters.map((seatLetter, seatIndex) => {
                                                        const seat = rowMap[rowNo][seatLetter];
                                                        if (!seat) {
                                                          return (
                                                            <li
                                                              key={seatIndex}
                                                              className="seat border-0 empty-seat"
                                                            ></li>
                                                          );
                                                        }

                                                        const seatCode = seat.seatCode;
                                                        const seatPrice = replaceINRWithSymbol(seat.price);
                                                        const isUnavailable = seat.isUnavailable;
                                                        const numericSeatPrice = parseFloat(seatPrice.replace(/[^\d.]/g, ''));
                                                        const shouldDisable =
                                                          isUnavailable ||
                                                          selectedSeats.some(
                                                            s =>
                                                              s.seatCode === seatCode &&
                                                              s.segmentKey === segmentkey &&
                                                              s.passengerIndex !== selectedPassengerIndex
                                                          );

                                                        return (
                                                          <li key={seatIndex} className="seat border-0">
                                                            <input
                                                              type="radio"
                                                              name={`optionalkeys`}
                                                              id={seatCode}
                                                              value={
                                                                seat.price > 0
                                                                  ? `${seatCode}_${seatPrice}`
                                                                  : `free ${seatCode}`
                                                              }
                                                              disabled={shouldDisable}
                                                              checked={selectedSeats.some(
                                                                s =>
                                                                  s.passengerIndex === selectedPassengerIndex &&
                                                                  s.segmentKey === segmentkey &&
                                                                  s.seatCode === seatCode
                                                              )}
                                                              onChange={() => {
                                                                setSelectedSeats(prev => {
                                                                  const filtered = prev.filter(
                                                                    s =>
                                                                      !(
                                                                        s.passengerIndex === selectedPassengerIndex &&
                                                                        s.segmentKey === segmentkey
                                                                      )
                                                                  );
                                                                  return [
                                                                    ...filtered,
                                                                    {
                                                                      passengerIndex: selectedPassengerIndex,
                                                                      segmentKey: segmentkey,
                                                                      seatCode,
                                                                      seatPrice,
                                                                      seat,
                                                                    }
                                                                  ];
                                                                });
                                                              }}
                                                            />
                                                            <label
                                                              htmlFor={seatCode}
                                                              className={`${numericSeatPrice > 0 ? 'paid' : 'free'} ${isUnavailable ? 'unavailable' : 'available'}`}
                                                              title={`[${seatCode}] ${isUnavailable
                                                                ? 'Unavailable'
                                                                : `${seatPrice} Available`
                                                                }`}
                                                            ></label>
                                                            <span className="tooltip">
                                                              {isUnavailable
                                                                ? 'Unavailable'
                                                                : `Available [${seatCode}] ₹${seatPrice}`}
                                                            </span>
                                                          </li>
                                                        );
                                                      })}
                                                    </ol>
                                                  </li>
                                                ))}
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
                      <div className='seatbutton'>
                        <button type='button' onClick={AddSeat} className='seatbuttonskip'>Add Seat</button>
                      </div>
                    </AccordionDetails>
                    <AccordionActions>
                    </AccordionActions>
                  </Accordion>
                </div>
              </div>
              <div className="clear" />
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default CompleteFlightbookingReturn;
