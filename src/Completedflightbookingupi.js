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
const CompleteFlightbookinguapi = () => {
  const base_url = `${CONFIG.BASE_URL}`;
  const location = useLocation();
  const hasFetchedRef = useRef(false);
  const hasFetched = useRef(false);
  const FareDetails = location.state && location.state.fares;
  console.log(FareDetails);
  const FinalDetails = location.state && location.state.FlightBooking;
  const Passenger = localStorage.getItem("Passengerdetails");
  const PassengerInfo = JSON.parse(Passenger);
  const responseData = location.state && location.state.responseData;
  const [finalresponse, setfinalresponse] = useState([]);
  const [taxivaxiresponse, settaxivaxiresponse] = useState([]);
  const [PNR, setPNR] = useState("");
  const [Segments, setSegments] = useState([]);
  const [PassengerDetails, setPassengerDetails] = useState([]);
  const [FlightDetails, setFlightDetails] = useState([]);
  const [SeatData, setSeatdata] = useState([]);
  const [loadingg, setLoadingg] = useState(false);
  const [Seatloading, setSeatloading] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [currentFlightIndex, setCurrentFlightIndex] = useState(0);
  const [selectedPassengerKey, setSelectedPassengerKey] = useState(
    PassengerInfo?.[0]?.Key
  );
  const [selectedPassengerIndex, setSelectedPassengerIndex] = useState(0);
  const [accordion3Expanded, setAccordion3Expanded] = useState(true);
  // console.log('Booking resposne', responseData)

  const totalServicePrice = Number(FlightDetails?.extra_baggage_charges) +(Number(FlightDetails?.meal_charges))+(Number(FlightDetails?.seat_charges))
  console.log(totalServicePrice)
  const finalfetch = async () => {
    setLoadingg(true);
    const requestData = {
      traceId: FinalDetails?.traceId || FinalDetails?.Response?.TraceId,
    };
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
      if (Data.status) {
        const finalresponse = Data.data;
        setFlightDetails(finalresponse);
        setPNR(finalresponse?.PNR);
        const segmentsData = finalresponse?.flight_details;
        console.log(segmentsData);
        setSegments(
          Array.isArray(segmentsData) ? segmentsData : [segmentsData]
        );
        // setSegments(finalresponse?.FlightItinerary?.AirReservation?.AirSegment);
        setPassengerDetails(finalresponse?.data?.flight_details?.Passengers);
        UapiAssignbooking(finalresponse);
      }
    } catch {
      setLoadingg(false);
    }
  };
  console.log(Segments);
  useEffect(() => {
    if (!hasFetched.current) {
      finalfetch();
      hasFetched.current = true;
    }
  }, []);

  const UapiAssignbooking = async (finalresponse) => {
    // setLoadingg(false)
    // console.log("live or demo",finalresponse?.productionMode)
    // console.log("URL", finalresponse?.productionMode == 'live' ? CONFIG.LIVE_ASSIGN : CONFIG.DEMO_ASSIGN)
    const taxivaxipassenger = responseData?.Passengerdetails;
    // console.log(taxivaxipassenger)
    const flight_details = finalresponse?.flight_details?.map((flight) => ({
      from_city: flight?.from_city,
      to_city: flight?.to_city,
      departure_datetime: formatDateTime(flight.departure_datetime),
      arrival_datetime: formatDateTime(flight.arrival_datetime),
      flight_name: `${flight.flight} (${responseData.flighttype})`,
      flight_no: flight?.flight_no,
      checked_bg: "15 kg", // placeholder
      cabin_bg: "7 kg", // placeholder
      pnr_no: finalresponse?.PNR || "NA",
      seat_type: flight?.CabinClass,
      via: flight?.via,
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
    }));
    // console.log("flight details", flight_details)
    const requestData = {
      access_token: responseData?.accessToken,
      booking_id: responseData?.bookingid,
      trip_type: responseData?.bookingtype,
      fare_type: finalresponse?.fareDetails?.fareType[0],
      flight_type: responseData?.flighttype,
      total_ex_tax_fees: finalresponse?.fareDetails?.total_ex_tax_fees,
      // total_price: removeCurrency(Totalprice) + removeCurrency(seatcharge)+removeCurrency(mealcharge),
      tax_and_fees:
        finalresponse?.fareDetails?.tax_and_fees,
      gst_k3: finalresponse?.fareDetails?.gst_k3,
      flight_details,
      is_extra_baggage_included: finalresponse?.is_extra_baggage_included,
      no_of_stops: finalresponse?.no_of_stops,
      no_of_seats: responseData?.no_of_seats,
      date_change_charges: finalresponse?.date_change_charges,
      seat_charges: finalresponse?.seat_charges,
      meal_charges: finalresponse?.meal_charges,
      extra_baggage_charges: finalresponse?.extra_baggage_charges,
      fast_forward_charges: 0,
      universallocatorCode: finalresponse?.universallocatorCode,
      applied_markup: FareDetails?.markupValue,
      actual_markup: "",
      discount: finalresponse?.discount,
      extra_baggage: finalresponse?.baggage_count,
      // returns: '',
      // reservationStatus: bookingStatus,
      vip_service_charges: 0,
      portal_used: finalresponse?.portal_used,
    };
    console.log(requestData);

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
                      <div className="chk-line">
                        <span className="chk-l">Cabin Class</span>
                        <span className="chk-r">
                          {FlightDetails?.seat_type}
                        </span>
                        <div className="clear" />
                      </div>

                      <div className="chk-line">
                        <div className="chk-line-item">
                          <span className="chk-l">27GST</span>
                          <span className="chk-r">
                            ₹ {FlightDetails?.fareDetails?.gst_k3?.toFixed(2)}
                          </span>
                          <div className="clear" />
                        </div>
                      </div>

                      <div className="chk-line">
                        <span className="chk-l">Meal Charges</span>
                        <span className="chk-r">
                          ₹ {FlightDetails?.meal_charges?.toFixed(2)}
                        </span>
                        <div className="clear" />
                      </div>

                      <div className="chk-line">
                        <span className="chk-l">Baggage Charges </span>
                        <span className="chk-r">
                          ₹{FlightDetails?.extra_baggage_charges?.toFixed(2)}
                        </span>
                        <div className="clear" />
                      </div>
                      <div className="chk-line">
                        <span className="chk-l">Seat Charges </span>
                        <span className="chk-r">
                          ₹{FlightDetails?.seat_charges?.toFixed(2)}
                        </span>
                        <div className="clear" />
                      </div>
                      <div className="chk-line">
                        <span className="chk-l">Flight Charges</span>
                        <span className="chk-r">
                          ₹{" "}
                          {FlightDetails?.fareDetails?.total_ex_tax_fees?.toFixed(
                            2
                          )}
                        </span>
                        <div className="clear" />
                      </div>
                      <div className="chk-line">
                        <span className="chk-l">Other Charges</span>
                        <span className="chk-r">
                          ₹{" "}
                          {(
                            Number(
                              FlightDetails?.fareDetails?.tax_and_fees || 0
                            ) + Number(FareDetails?.markupValue || 0)
                          ).toFixed(2)}
                        </span>
                        <div className="clear" />
                      </div>
                        <div className="chk-line">
                        <span className="chk-l">Client Price (per pax)</span>
                        <span className="chk-r">
                          ₹{" "}
                          {
                            Number(
                            FareDetails?.ClientPriceValue || 0
                            
                          ).toFixed(2)}
                        </span>
                        <div className="clear" />
                      </div>
                    </div>
                    <div className="chk-total">
                      <div className="chk-total-l">Total Price</div>
                      <div className="chk-total-r" style={{ fontWeight: 700 }}>
                        ₹{" "}
                        {(
                          Number(FlightDetails?.fareDetails?.total || 0) +
                          Number(FareDetails?.markupValue || 0)+ (Number(totalServicePrice))
                        ).toFixed(2)}
                        {/* ₹ {FlightDetails?.fareDetails?.total?.toFixed(2)} */}
                        {/* ₹ {(((Number(FareData?.PublishedFare) || 0) + (Number(totalServicePrice))).toFixed(2))} */}
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

export default CompleteFlightbookinguapi;
