import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom';
import CONFIG from './config';

const FlightBookingComplete = () => {
    const location = useLocation();
    const hasFetched = useRef(false);
    const FinalDetails = location.state && location.state.FlightBooking;
    const responseData = location.state && location.state.responseData;
    const [loadingg, setLoadingg] = useState(false);
    const [finalresponse, setfinalresponse] = useState([]);
    const [PNR, setPNR] = useState('');
    const [Segments, setSegments] = useState([]);
    const [PassengerDetails, setPassengerDetails] = useState([]);
    const [FlightDetails, setFlightDetails] = useState([]);
    console.log('Responsedata:', responseData)
    // console.log("Finaldetails:",FinalDetails)

    const finalfetch = async () => {
        setLoadingg(true)
        const requestData = {
            traceId: FinalDetails?.Response?.TraceId
        }
        try {

            const response = await fetch(`${CONFIG.BASE_URL}getTicketData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
            const Data = await response.json();
            if (Data.status) {
                const finalresponses = Data.data.data;
                setFlightDetails(finalresponses?.Response?.Response?.FlightItinerary);
                setPNR(finalresponses?.Response?.Response?.PNR);
                setSegments(finalresponses?.Response?.Response?.FlightItinerary?.Segments);
                setPassengerDetails(finalresponses?.Response?.Response?.FlightItinerary?.Passenger);
                const finalresponse = Data.data;
                TBOAssignbooking(finalresponse);
            }

            console.log(Data)
            setLoadingg(false)

        } catch {

        }
    }
    useEffect(() => {
        if (!hasFetched.current) {
            finalfetch();
            hasFetched.current = true;
        }
    }, []);


    // const formatDateTime = (fullDateTime) => {
    //     const year = fullDateTime.getFullYear();
    //     const month = String(fullDateTime.getMonth() + 1).padStart(2, '0');
    //     const day = String(fullDateTime.getDate()).padStart(2, '0');

    //     // Format as 'yy-mm-dd'
    //     return `${year}-${month}-${day}`;
    // };

    // const TBOAssignbooking = async (finalresponse) => {
    //     const passengers = finalresponse?.Response?.Response?.FlightItinerary?.Passenger || [];
    //     const segments = finalresponse?.Response?.Response?.FlightItinerary?.Segments;
    //     passengers.forEach(passenger => {
    //         const match = responseData?.Passengerdetails.find(
    //             pd =>
    //                 pd.firstName.toLowerCase() === passenger.FirstName.toLowerCase() &&
    //                 pd.lastName.toLowerCase() === passenger.LastName.toLowerCase()
    //         );

    //         if (match) {
    //             passenger.employee_id = match.id; // Add the new property
    //         }
    //     });
    //     const passengerdetails = {};

    //     segments.forEach((segment, flightIndex) => {
    //         passengers.forEach((passenger, passengerIndex) => {
    //             passengerdetails[`people_id_${flightIndex}_${passengerIndex}`] = passenger.employee_id;
    //             passengerdetails[`ticket_no_${flightIndex}_${passengerIndex}`] = passenger.Ticket?.TicketNumber || null;
    //             const MealInfo = Array.isArray(passenger.MealDynamic)
    //                 ? passenger.MealDynamic[flightIndex]?.AirlineDescription || null
    //                 : passenger.MealDynamic?.AirlineDescription || null;
    //             passengerdetails[`meal_include_${flightIndex}_${passengerIndex}`] = MealInfo;
    //             const seatInfo = Array.isArray(passenger.SeatDynamic)
    //                 ? passenger.SeatDynamic[flightIndex]?.Code || null
    //                 : passenger.SeatDynamic?.Code || null;
    //             passengerdetails[`seat_no_${flightIndex}_${passengerIndex}`] = seatInfo;
    //         });
    //     });
    //     const isExtraBaggageIncluded = passengers.some((p) => {
    //         const baggageValue = p?.Baggage ? String(p.Baggage).trim() : "";
    //         return baggageValue !== "" && baggageValue.toUpperCase() !== "NA";
    //     }) ? 1 : 0;
    //     const Fare = finalresponse?.Response?.Response?.FlightItinerary?.Fare;
    //     const k3_tax = Fare.TaxBreakup.find(item => item.key === "K3")?.value;
    //     const FlightPNR = finalresponse?.Response?.Response?.PNR;
    //     const tax_excluding_k3 =parseFloat(Fare?.Tax) - parseFloat(k3_tax)-parseFloat(Fare?.ServiceFee);
    //     const flightDetails = {};
    //     finalresponse?.Response?.Response?.FlightItinerary?.Segments.forEach((segment, index) => {
    //         const departureDate = new Date(segment?.Origin?.DepTime);
    //         const arrivalDate = new Date(segment?.Destination?.ArrTime);

    //         const formattedDate = formatDateTime(departureDate);

    //         const formattedDeparture = new Date(departureDate).toLocaleTimeString('en-US', {
    //             hour: 'numeric',
    //             minute: 'numeric',
    //             hour12: false,
    //         });

    //         const concatDeptDateTime = formattedDate + " " + formattedDeparture;

    //         const formattedArrivalDate = formatDateTime(arrivalDate);

    //         const formattedArrival = new Date(arrivalDate).toLocaleTimeString('en-US', {
    //             hour: 'numeric',
    //             minute: 'numeric',
    //             hour12: false,
    //         });
    //         const concatArrivalDateTime = formattedArrivalDate + " " + formattedArrival;
    //         flightDetails[`from_${index}`] = segment.Origin.Airport.AirportCode;
    //         flightDetails[`to_${index}`] = segment.Destination.Airport.AirportCode;
    //         flightDetails[`depart_${index}`] = concatDeptDateTime;
    //         flightDetails[`arrival_${index}`] = concatArrivalDateTime;
    //         flightDetails[`flight_name_${index}`] = segment?.Airline?.AirlineName + " (" + responseData?.flighttype + ")";
    //         flightDetails[`flight_no_${index}`] = segment?.Airline?.AirlineCode + " " + segment?.Airline?.FlightNumber;
    //         flightDetails[`seat_type_${index}`] = responseData?.selectclass;
    //         flightDetails[`pnr_no_${index}`] = FlightPNR;
    //         flightDetails[`checked_bg_${index}`] = segment?.Baggage || 'NA';
    //         flightDetails[`cabin_bg_${index}`] = segment?.CabinBaggage || 'NA';
    //         flightDetails[`originTerminal_${index}`] = segment?.Origin?.Airport?.Terminal ? `T-${segment.Origin.Airport.Terminal}`: '';
    //         flightDetails[`destinationTerminal_${index}`] = segment?.Destination?.Airport?.Terminal ?  `T-${segment.Destination.Airport.Terminal}`:'';
    //     });
    //     const Totalprice =finalresponse?.Response?.Response?.FlightItinerary?.InvoiceAmount;
    //     const noofstops = segments.length > 0 ? segments.length - 1 : 0;
    //     const FareType = finalresponse?.Response?.Response?.FlightItinerary?.NonRefundable ? 'NonRefundable' : 'Refundable';
    //     const bookingStatus = segments?.[0]?.FlightStatus;
    //     const requestData = {
    //         access_token: responseData?.accessToken,
    //         booking_id: responseData?.bookingid,
    //         trip_type: responseData?.bookingtype,
    //         fare_type: FareType,
    //         flight_type: responseData?.flighttype,
    //         total_ex_tax_fees:Totalprice - Fare?.Discount,
    //         total_price:Totalprice,
    //         tax_and_fees:tax_excluding_k3 + Fare?.Discount,
    //         gst_k3:k3_tax,
    //         ...flightDetails,
    //         ...passengerdetails,
    //         is_extra_baggage_included: isExtraBaggageIncluded,
    //         no_of_stops: noofstops,
    //         no_of_stops_return: '',
    //         no_of_seats:responseData?.no_of_seats,
    //         date_change_charges: 0,
    //         seat_charges: Fare?.TotalSeatCharges || '0',
    //         meal_charges: Fare?.TotalMealCharges || '0',
    //         extra_baggage_charges: Fare.TotalBaggageCharges || '0',
    //         fast_forward_charges: 0,
    //         pnrcode: FlightPNR,
    //         universallocatorCode: FlightPNR,
    //         applied_markup: '',
    //         actual_markup: '',
    //         discount: Fare?.Discount,
    //         extrabaggage: 'NA',
    //         returns: '',
    //         reservationStatus: bookingStatus,
    //         vip_service_charges: 0,
    //     }
    //     console.log('Request', requestData)
    //     // console.log('Requesttaxivaxi',requestData)
    //     const response = await fetch('https://demo.taxivaxi.com/api/flights/assignSbtCotravFlightBooking', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //       },
    //       body: JSON.stringify(requestData),
    //     });
    //     const Data = await response.json()
    //     console.log(Data)
    //     // Swal.fire({
    //     //   title: 'Booking Successful!',
    //     //   text: `Your Locator Code is : ${LocatorCode?.["LocatorCode"]}.`,
    //     //   iconHtml: '<i class="fa fa-check" aria-hidden="true"></i>',
    //     //   confirmButtonText: 'OK'
    //     // });
    // }
    const TBOAssignbooking = async (finalresponse) => {
    console.log('response from api', finalresponse)
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
        const seatService = p.OptionalServices?.find(s => s.Type === "PreReservedSeatAssignment");
        const mealService = p.OptionalServices?.find(s => s.Type === "MealOrBeverage");
        const matchingEmployee = taxivaxipassenger.find(emp =>
          emp.firstName?.toLowerCase() === p.First?.toLowerCase() &&
          emp.lastName?.toLowerCase() === p.Last?.toLowerCase() &&
          emp.user_type === p.TravelerType
        );
        return {
          people_id: matchingEmployee?.id,
          seat_no: seatService?.ServiceData?.Data || "NA",
          ticket_no: finalresponse?.PNR || "NA",
          meal_include: mealService?.Value || "NA",
        }
      }),
    }));
    // console.log("flight details", flight_details)
    const requestData = {
      access_token: responseData?.accessToken,
      booking_id: responseData?.bookingid,
      trip_type: responseData?.bookingtype,
      fare_type: 'Refundable',
      flight_type: responseData?.flighttype,
      total_ex_tax_fees: finalresponse?.fareDetails?.total_ex_tax_fees,
      // total_price: removeCurrency(Totalprice) + removeCurrency(seatcharge)+removeCurrency(mealcharge),
      tax_and_fees: finalresponse?.fareDetails?.tax_and_fees,
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
      applied_markup: '',
      actual_markup: '',
      discount: finalresponse?.discount,
      extra_baggage: finalresponse?.baggage_count,
      // returns: '',
      // reservationStatus: bookingStatus,
      vip_service_charges: 0,
      portal_used: "UAPI",
    }

    console.log('Requesttaxivaxi', requestData)
    // const response = await fetch('https://demo.taxivaxi.com/api/flights/assignSbtCotravFlightBookingNew', {
    //   method: 'POST',
    //   headers: {
    //     // 'Content-Type': 'application/json',
    //     // 'Access-Token': responseData?.accessToken,
    //     // 'Content-Type': 'application/x-www-form-urlencoded',

    //   },
    //   body: JSON.stringify(requestData),
    // });
    // const Data = await response.json()
    // console.log(Data)
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
  }
    //Hrs caculator
    function Hrscaculator(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m`;
    }
    //Time Format 
    function dateTime(dateTime) {
        return new Date(dateTime).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    //Convert into week date month year
    const handleweekdatemonthyear = (date) => {
        const arrivalTime = new Date(date);
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const weekday = weekdays[arrivalTime.getDay()];
        const day = arrivalTime.getDate();
        const month = months[arrivalTime.getMonth()];
        const year = arrivalTime.getFullYear();
        const formattedDateString = `${weekday}, ${day} ${month} ${year}`;
        return formattedDateString;
    }
    //Kg converter
    function formatWeight(weight) {
        if (!weight) return '';
        const trimmed = weight.trim().toLowerCase();
        if (trimmed.endsWith('kg')) {
            return weight.toUpperCase();
        }
        const numberPart = weight.match(/\d+/);
        return numberPart ? `${numberPart[0]} KG` : weight;
    }
    return (
        <div className="yield-content" style={{ background: '#e8e4ff' }}>
            {loadingg &&
                <div className="page-center-loader flex items-center justify-center">
                    <div className="big-loader flex items-center justify-center">
                        <img className="loader-gif" src="/img/cotravloader.gif" alt="Loader" />
                        <p className="text-center ml-4 text-gray-600 text-lg">
                            Retrieving flight details. Please wait a moment
                        </p>
                    </div>
                </div>
            }
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
                                                            <span className='Bookingheading' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                Confirmed Flight Details
                                                                <span>
                                                                    PNR No. {PNR}
                                                                </span>
                                                            </span>
                                                            <div
                                                                className="modal fade bd-example-modal-lg multipleflight"
                                                                tabIndex={-1}
                                                                role="dialog"
                                                                aria-labelledby="myLargeModalLabel"
                                                                aria-hidden="true"
                                                            >

                                                            </div>

                                                        </>
                                                        {Segments.map((data, index) => (
                                                            <div
                                                                key={index}
                                                                className="border border-gray-300 rounded-md overflow-hidden mb-4 bg-white shadow-sm"
                                                            >
                                                                {/* Top Row: Route and Date */}
                                                                <div className="flex justify-between items-center px-4 py-2 bg-gray-50">
                                                                    <div className="text-lg font-semibold text=[#0E0E3E]">
                                                                        {data?.Origin?.Airport?.CityName} <span className="mx-2">→</span> {data?.Destination?.Airport?.CityName}
                                                                    </div>
                                                                    <span className="block text-sm text-gray-500">
                                                                        {handleweekdatemonthyear(data?.Origin?.DepTime)}
                                                                    </span>
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                                                                            {FlightDetails?.NonRefundable ? 'NonRefundable' : 'Refundable'}
                                                                        </span>
                                                                        <button className="text-blue-500 text-xs font-medium hover:underline">
                                                                            Fare Rules
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <hr className='m-0' />
                                                                {/* Bottom Row: Flight Details */}
                                                                <div className="flex items-center justify-between px-4 py-3 gap-6">
                                                                    <div className="flex items-center gap-2 max-w-[120px]">
                                                                        <img
                                                                            className="w-8 h-8"
                                                                            src={`https://devapi.taxivaxi.com/airline_logo_images/${data?.Airline?.AirlineCode}.png`}
                                                                            alt="Airline logo"
                                                                        />
                                                                        <div>
                                                                            <div className="font-medium text-gray-800">
                                                                                {data?.Airline?.AirlineName}
                                                                            </div>
                                                                            <div className="text-xs text-gray-500">
                                                                                {data?.Airline?.AirlineCode}-{data?.Airline?.FlightNumber}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-center max-w-[180px]">
                                                                        <div className="text-lg font-semibold">
                                                                            {dateTime(data?.Origin?.DepTime)}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500 ">
                                                                            {data?.Origin?.Airport?.AirportName} {data?.Origin?.Airport?.Terminal} <br /> ({data?.Origin?.Airport?.AirportCode})
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-center max-w-[100px]">
                                                                        <div className="text-sm font-medium text-gray-700">
                                                                            {Hrscaculator(data?.Duration)}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">Duration</div>
                                                                    </div>
                                                                    <div className="text-center max-w-[180px]">
                                                                        <div className="text-lg font-semibold">
                                                                            {dateTime(data?.Destination?.ArrTime)}
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">
                                                                            {data?.Destination?.Airport?.AirportName} {data?.Destination?.Airport?.Terminal}<br /> ({data?.Destination?.Airport?.AirportCode})
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}

                                                    </div>
                                                    <div className=' baggagae_policy'>
                                                        <>
                                                            <span className='Bookingheading' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                Passenger Information
                                                            </span>
                                                            <div
                                                                className="modal fade bd-example-modal-lg multipleflight"
                                                                tabIndex={-1}
                                                                role="dialog"
                                                                aria-labelledby="myLargeModalLabel"
                                                                aria-hidden="true"
                                                            >

                                                            </div>

                                                        </>
                                                        {PassengerDetails.map((pax, index) => (
                                                            <div
                                                                key={index}
                                                                className="border border-gray-300 rounded-md p-2 mt-1 bg-white shadow-sm"
                                                            >
                                                                <div className="flex justify-between">
                                                                    <div>
                                                                        <p className="font-semibold text-lg">
                                                                            {pax.FirstName} {pax.LastName} <span className="text-sm text-gray-600">({pax.Gender === 1 ? "Male" : pax.Gender === 2 ? "Female" : "Other"})</span>
                                                                        </p>
                                                                    </div>
                                                                    <div className="text-sm text-gray-500">
                                                                        DOB: {new Date(pax.DateOfBirth).toLocaleDateString()}
                                                                    </div>
                                                                </div>

                                                                <div className="mt-1">
                                                                    <p><strong>Contact:</strong> {pax.ContactNo} ({pax.Email})</p>
                                                                    <p> <strong>Address:</strong> {pax.AddressLine1}, {pax.AddressLine2}, {pax.City}, {pax.CountryName}</p>
                                                                </div>
                                                                {/* Optional Services Table */}
                                                                {(pax.MealDynamic?.length > 0 || pax.Baggage?.length > 0 || pax.SeatDynamic?.length > 0) && (
                                                                    <table className="table-auto w-full mt-2 border border-gray-300 text-sm">
                                                                        <thead>
                                                                            <tr className="bg-gray-100">
                                                                                <th className="border border-gray-300 px-2 py-1 text-left">Meal</th>
                                                                                <th className="border border-gray-300 px-2 py-1 text-left">Baggage</th>
                                                                                <th className="border border-gray-300 px-2 py-1 text-left">Seat</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                {/* Meal Column */}
                                                                                <td className="border border-gray-300 px-2 py-1">
                                                                                    {pax.MealDynamic?.length > 0
                                                                                        ? pax.MealDynamic.map((meal, index) => (
                                                                                            <div key={index}>
                                                                                                {meal.Origin} → {meal.Destination}<br />{meal.AirlineDescription || "N/A"}
                                                                                            </div>
                                                                                        ))
                                                                                        : "N/A"}
                                                                                </td>

                                                                                {/* Baggage Column */}
                                                                                <td className="border border-gray-300 px-2 py-1">
                                                                                    {pax.Baggage?.length > 0
                                                                                        ? pax.Baggage.map((bag, index) => (
                                                                                            <div key={index}>
                                                                                                {bag.Weight} {bag.Unit || "KG"}
                                                                                            </div>
                                                                                        ))
                                                                                        : "N/A"}
                                                                                </td>

                                                                                {/* Seat Column */}
                                                                                <td className="border border-gray-300 px-2 py-1">
                                                                                    {pax.SeatDynamic?.length > 0
                                                                                        ? pax.SeatDynamic.map((seat, index) => (
                                                                                            <div key={index}>
                                                                                                {seat.Code || "N/A"} ({seat.Origin} → {seat.Destination})
                                                                                            </div>
                                                                                        ))
                                                                                        : "N/A"}
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                )}

                                                                {/* <div className="mt-2 border-t border-gray-200 pt-2">
                                                                    <p className="font-semibold text-gray-700">Optional Services:</p>

                                                                    {pax.MealDynamic?.length > 0 && (
                                                                        <div>
                                                                            <strong>Meal:</strong>
                                                                            {pax.MealDynamic.map((meal, index) => (
                                                                                <div key={index}>
                                                                                    {meal.Origin} → {meal.Destination}: {meal.AirlineDescription || "N/A"}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                    {pax.Baggage?.length > 0 && (
                                                                        <p><strong>Baggage:</strong> {pax.Baggage.map(bag => `${bag.Weight} ${bag.Unit || 'KG'}`).join(", ")}</p>
                                                                    )}

                                                                    {pax.SeatDynamic?.length > 0 && (
                                                                        <p><strong>Seat:</strong> {pax.SeatDynamic.map(seat => seat.SeatNumber || "N/A").join(", ")}</p>
                                                                    )}
                                                                </div> */}
                                                                {/* <div className="mt-1">
                                                                    <p><strong>GST Number:</strong> {pax.GSTNumber}</p>
                                                                    <p><strong>GST Company:</strong> {pax.GSTCompanyName}</p>
                                                                </div> */}
                                                            </div>
                                                        ))}

                                                    </div>
                                                    <div className=' baggagae_policy'>
                                                        <>
                                                            <span className='Bookingheading' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                GST Information
                                                            </span>
                                                            <div
                                                                className="modal fade bd-example-modal-lg multipleflight"
                                                                tabIndex={-1}
                                                                role="dialog"
                                                                aria-labelledby="myLargeModalLabel"
                                                                aria-hidden="true"
                                                            >

                                                            </div>

                                                        </>
                                                        {PassengerDetails.length > 0 && (
                                                            <div className="border border-gray-300 rounded-md p-2 mt-1 bg-white shadow-sm">
                                                                <div className="flex justify-between">
                                                                    <p><strong>GST Number:</strong> {PassengerDetails[0].GSTNumber}</p>
                                                                    <p><strong>GST Company:</strong> {PassengerDetails[0].GSTCompanyName}</p>
                                                                </div>
                                                            </div>
                                                        )}

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
                                        <span className='Bookingheading' >Fare Info</span>
                                        <div className="chk-detais-row">
                                            <div className="chk-line">
                                                <span className="chk-l">Fare Type</span>
                                                <span className="chk-r">
                                                    {FlightDetails?.ResultFareType}
                                                </span>
                                                <div className="clear" />
                                            </div>
                                            <div className="chk-line">
                                                <span className="chk-l">Cabin Class</span>
                                                <span className="chk-r">Economy</span>
                                                <div className="clear" />
                                            </div>
                                            {/* {responseData?.Passenger_info?.Adult > 0 && (
                        <div className="chk-line">
                          <span className="chk-l">
                            Adult X {responseData?.Passenger_info?.Adult}
                          </span>
                          <span className="chk-r">
                            <span className="chk-r">
                              ₹ {PerPassFareData.find(item => item.PassengerType === 1)?.BaseFare?.toFixed(2) || '0.00'}
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
                              ₹ {PerPassFareData.find(item => item.PassengerType === 2)?.BaseFare?.toFixed(2) || '0.00'}
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
                              ₹ {PerPassFareData.find(item => item.PassengerType === 3)?.BaseFare?.toFixed(2) || '0.00'}
                            </span>

                          </span>
                          <div className="clear" />
                        </div>
                      )} */}

                                            <div className="chk-line">

                                                <div className="chk-line-item">
                                                    <span className="chk-l">27GST</span>
                                                    <span className="chk-r">
                                                        ₹ {FlightDetails?.Fare?.Tax?.toFixed(2)}
                                                    </span>
                                                    <div className="clear" />
                                                </div>
                                            </div>

                                            <div className="chk-line">
                                                <span className="chk-l">Meal Charges</span>
                                                <span className="chk-r">
                                                    ₹ {FlightDetails?.Fare?.TotalMealCharges?.toFixed(2)}
                                                </span>
                                                <div className="clear" />
                                            </div>

                                            <div className="chk-line">
                                                <span className="chk-l">Baggage Charges </span>
                                                <span className="chk-r">
                                                    ₹{FlightDetails?.Fare?.TotalBaggageCharges?.toFixed(2)}
                                                </span>
                                                <div className="clear" />
                                            </div>
                                            <div className="chk-line">
                                                <span className="chk-l">Seat Charges </span>
                                                <span className="chk-r">
                                                    ₹{FlightDetails?.Fare?.TotalSeatCharges?.toFixed(2)}
                                                </span>
                                                <div className="clear" />
                                            </div>

                                        </div>
                                        <div className="chk-total">
                                            <div className="chk-total-l">Total Price</div>
                                            <div className="chk-total-r" style={{ fontWeight: 700 }}>
                                                {/* ₹ {FareData?.PublishedFare?.toFixed(2)} */}
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

        </div>
    )
}

export default FlightBookingComplete