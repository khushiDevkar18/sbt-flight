import React, { useEffect, useRef, useState } from "react";
import CONFIG from "./config";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const Newbookflow = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const Data = searchParams.get("taxivaxidata");
  const Taxivaxidata = JSON.parse(Data);
  const hasFetched = useRef(false);
  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);
  let emptaxivaxi = [];
  const [loadingg, setLoadingg] = useState(false);
  const [selectedflight, setselectedflight] = useState([]);
  const [selectedflight_return, setselectedflight_return] = useState([]);
  const [PassengerDetails, setPassengerDetails] = useState([]);
  const [PassengerInfo, setPassengerInfo] = useState([]);
  const [FlightFares, setFlightFare] = useState([]);
  const [FlightFaresReturn, setFlightFareReturn] = useState([]);
  console.log("taxivaxi data", Taxivaxidata);
  function getOnlyDate(dateTimeString) {
    if (!dateTimeString) return ""; // return empty string if undefined/null
    return dateTimeString.split("T")[0];
  }
  //console.log("passenger details", Taxivaxidata[0].passengerDetailsArray)
  //Generate keyss
  const Keyfetch = async () => {
    const requestData = {
      ADT: Taxivaxidata[0]?.passengerDetailsArray.length,
      CNN: 0,
      INF: 0,
    };
    try {
      setLoadingg(true);
      const response = await fetch(`${CONFIG.BASE_URL}generateKeys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const Data = await response.json();
      if (Data.status) {
        const responseData = Data.passengerDetails;
        // //console.log(responseData)
        setPassengerDetails(responseData);
        fetchData(responseData);
        FetchEmployee();
      }
    } catch (error) {
      // setLoadingg(false)
      console.error("Fetch error:", error.message);
    }
  };

  useEffect(() => {
    if (!hasFetchedRef.current) {
      Keyfetch();
      hasFetchedRef.current = true;
    }
  }, []);

  // --------------------------------------------------------Search flight-----------------------------------------------------------------
  //extract airport code
  function extractAirportCode(str) {
    const match = str.match(/\(([^)]+)\)/);
    return match ? match[1] : "";
  }

  //extractonly date
  function extractDate(dateInput) {
    const date = new Date(dateInput);

    if (isNaN(date.getTime())) {
      // Invalid date handling
      return "";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // month is 0-based
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
const [JourneyType, setJourneyType] = useState(() => {
  // Set initial value immediately based on data
  if (Taxivaxidata[0]?.return_date !== "0000-00-00") {
    return 2;
  } else {
    return 1;
  }
});

// This will show the current value during render

console.log("JourneyType in render:", JourneyType);  
    const fetchData = async (passengerDetails) => {
    // //console.log("passengerDetails", passengerDetails)
    const url = `${CONFIG.BASE_URL}searchFlights_new`;
    const requestData = {
      origin: extractAirportCode(Taxivaxidata[0]?.from_city),
      destination: extractAirportCode(Taxivaxidata[0]?.to_city),
      departureDate: extractDate(Taxivaxidata[0]?.departure_time),
  adultCount: parseInt(Taxivaxidata[0]?.no_of_seats, 10)
,

      childCount: 0,
      infantCount: 0,
      cabinClass: Taxivaxidata[0]?.seat_type,
      JourneyType: JourneyType,
      flighttype: Taxivaxidata[0]?.flight_type,
      // flighttype: "domestic",
      returnDate:
        Taxivaxidata[0]?.return_date !== "0000-00-00"
          ? extractDate(Taxivaxidata[0]?.return_date)
          : null,
      // JourneyType: inputValue.bookingType ? Number(inputValue.bookingType) : Number(journeytype),
    };

    try {
      setLoadingg(true);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      //console.log("search flight data", data)
      if (data.status === true) {
        // data.status
        const AvailableOptions = data.data.Onward;
        //console.log("available options", AvailableOptions)
        //Airline Options
        const taxivaxiFlightNos = Taxivaxidata[0].flight_no
          .split(",")
          .map((f) => f.trim());
        //console.log("flight taxivaxi", taxivaxiFlightNos)
        const matchedFlight = AvailableOptions.find((option) => {
          if (!option.flight.flights) return false;

          const optionFlightNos = option.flight.flights.map(
            (f) => f.FlightNumber
          );
          return taxivaxiFlightNos.every((no) => optionFlightNos.includes(no));
        });
        // console.log("Fetched matchedFlight", matchedFlight);
        if(matchedFlight == null){
              Swal.fire({
            title: "Flight Not Available",
            text: "The selected Flight is no longer available. Would you like to search again?",
            icon: "warning",
            // showCancelButton: true,
            confirmButtonText: "Search Again",
            // cancelButtonText: "Cancel",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/";
            }
          });
        }
        else {
      setselectedflight(matchedFlight);

        }
  
        await Getfares(matchedFlight, passengerDetails);
        if (JourneyType == 2) {
          const AvailableOptions_return = data.data.Return;
          //console.log("available options", AvailableOptions_return)
          //Airline Options
          const taxivaxiFlightNos_return = Taxivaxidata[1].flight_no
            .split(",")
            .map((f) => f.trim());
          //console.log("flight taxivaxi", taxivaxiFlightNos_return)
          const matchedFlight_return = AvailableOptions_return.find(
            (option) => {
              // if (!option.flight.flights) return false;

              const optionFlightNosReturn = option.flight.flights.map(
                (f) => f.FlightNumber
              );
              return taxivaxiFlightNos_return.every((no) =>
                optionFlightNosReturn.includes(no)
              );
            }
          );
            if(matchedFlight_return == null){
              Swal.fire({
            title: "Flight Not Available",
            text: "The selected Flight is no longer available. Would you like to search again?",
            icon: "warning",
            // showCancelButton: true,
            confirmButtonText: "Search Again",
            // cancelButtonText: "Cancel",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/";
            }
          });
        }
        else {
      setselectedflight_return(matchedFlight_return);

        }
          // console.log("fetched matchedFlight_return", matchedFlight_return);
          // setselectedflight_return(matchedFlight_return);

          await GetfaresReturn(matchedFlight_return, passengerDetails);
        }
      }

      // //console.log('Response:', AvailableOptions);
    } catch (error) {
      setLoadingg(false);
      console.error("Error:", error);
    }
  };

  // useEffect(() => {
  //     if (!hasFetched.current) {
  //         fetchData();
  //         hasFetched.current = true;
  //     }
  // }, []);

  // --------------------------------------------------------search prices -------------------------------------------------------------
  // 👇 Add these states at the top of your component
  const [onwardFares, setOnwardFares] = useState(null);
  const [returnFares, setReturnFares] = useState(null);

  //Flight fares api
  //Onward
  // const Getfares = async (Flightdata, passengerDetails) => {
  //   const requestData = {
  //     unique_id: Flightdata.unique_id,
  //     trace_price: Flightdata.trace_price,
  //     trace_search: Flightdata.trace_search,
  //     trace_option: Flightdata.trace_option,
  //     passengerDetails: passengerDetails,
  //   };
  //   try {
  //     const response = await fetch(`${CONFIG.BASE_URL}searchPrices`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(requestData),
  //     });

  //     const Data = await response.json();
  //     const data = Data.data;

  //     const faresArray = Array.isArray(Taxivaxidata)
  //       ? Taxivaxidata
  //       : [Taxivaxidata];tbo_fares
  //     if (JourneyType == 1) {
  //       const matchedObjects = faresArray
  //         .map(({ source, fare_type, price }) => {
  //           let found = null;

  //           const inputPrice = Number(price); // convert incoming price to number

  //           if (source === "Uapi") {
  //             found = data.uapi_fares.find(
  //               (f) =>
  //                 f.SupplierFareClass?.toLowerCase().trim() ===
  //                   fare_type?.toLowerCase().trim() &&
  //                 Number(f.TotalPrice) === inputPrice
  //             );
  //             return found
  //               ? { ...found, from: "Uapi", price: found.TotalPrice }
  //               : null;
  //           }

  //           if (source === "Tbo") {
  //             found = data.tbo_fares.find(
  //               (f) =>
  //                 f.SupplierFareClass?.toLowerCase().trim() ===
  //                   fare_type?.toLowerCase().trim() &&
  //                 Number(f.TotalPrice) === inputPrice
  //             );
  //             return found
  //               ? { ...found, from: "Tbo", price: found.TotalPrice }
  //               : null;
  //           }

  //           return null;
  //         })
  //         .filter(Boolean);
  //       // console.log("Matched Fare Objects:", matchedObjects);
  //       setFlightFare(matchedObjects);
  //       NavigatetoBookingflow(matchedObjects, Flightdata, passengerDetails);
  //       setLoadingg(false);
  //       return;
  //     } else if (JourneyType == 2) {
  //       const matchedObjects = faresArray
  //         .map(({ source, fare_type, price }) => {
  //           const inputPrice = Number(price);
  //           let found = null;

  //           if (source === "Uapi") {
  //             found = data.uapi_fares.find(
  //               (f) =>
  //                 f.SupplierFareClass?.toLowerCase().trim() ===
  //                   fare_type?.toLowerCase().trim() &&
  //                 Number(f.TotalPrice) === inputPrice
  //             );
  //             return found
  //               ? {
  //                   flight: Flightdata.flight,
  //                   fare: {
  //                     type: found.SupplierFareClass,
  //                     price: Number(found.TotalPrice),
  //                     from: "Uapi",
  //                     ResultIndex: found.ResultIndex,
  //                     TraceId: found.trace_id,
  //                     ProviderCode: found.ProviderCode,
  //                     isLCC: found.isLCC,
  //                   },
  //                 }
  //               : null;
  //           }

  //           if (source === "Tbo") {
  //             found = data.tbo_fares.find(
  //               (f) =>
  //                 f.SupplierFareClass?.toLowerCase().trim() ===
  //                   fare_type?.toLowerCase().trim() &&
  //                 Number(f.TotalPrice) === inputPrice
  //             );
  //             return found
  //               ? {
  //                   flight: Flightdata.flight,
  //                   fare: {
  //                     type: found.SupplierFareClass,
  //                     price: Number(found.TotalPrice),
  //                     from: "Tbo",
  //                     ResultIndex: found.ResultIndex,
  //                     TraceId: found.trace_id,
  //                   },
  //                 }
  //               : null;
  //           }

  //           return null;
  //         })
  //         .filter(Boolean);

  //       // console.log("Matched Fare Objects for Journey Type 2:", matchedObjects);
  //       setFlightFare(matchedObjects);
  //       setOnwardFares(matchedObjects);
  //     }
  //   } catch {
  //     setLoadingg(false);
  //     //console.log('error')
  //   }
  // };
  const Getfares = async (Flightdata, passengerDetails) => {
    console.log("Flightdata",Flightdata);
    const requestData = {
      unique_id: Flightdata.unique_id,
      trace_price: Flightdata.trace_price,
      trace_search: Flightdata.trace_search,
      trace_option: Flightdata.trace_option,
      passengerDetails: passengerDetails,
    };

    try {
      const response = await fetch(`${CONFIG.BASE_URL}searchPrices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const Data = await response.json();
      const data = Data.data;
      const faresArray = Array.isArray(Taxivaxidata)
        ? Taxivaxidata
        : [Taxivaxidata];

      // Debug logs
      console.log("API Response:", Data);
      console.log("tbo_fares:", data.tbo_fares);
      console.log("uapi_fares:", data.uapi_fares);
      console.log("Fares Array:", faresArray);

      if (JourneyType == 1) {
        const matchedObjects = faresArray
          .map(({ source, fare_type, price_without_markup }) => {
            let found = null;
            const inputPrice = Number(price_without_markup);

            if (source === "Uapi") {
              found = data.uapi_fares?.find((f) => {
                const match =
                  f.SupplierFareClass?.toLowerCase().trim() ===
                    fare_type?.toLowerCase().trim() &&
                  Number(f.TotalPrice) === inputPrice;
                console.log("Uapi match check:", {
                  sourceFareClass: f.SupplierFareClass,
                  fare_type,
                  sourcePrice: f.TotalPrice,
                  inputPrice,
                  match,
                });
                return match;
              });
              return found
                ? {
                    ...found,
                    from: "Uapi",
                    price: found.TotalPrice,
                    ResultIndex: found.ResultIndex,
                    trace_id: found.trace_id || found.TraceId,
                    traceId: found.trace_id || found.TraceId, // Add both formats
                    isLCC: found.isLCC || false,
                    SupplierFareClass:
                      found.SupplierFareClass || "Regular Fare",
                  }
                : null;
            }

            if (source === "Tbo") {
              found = data.tbo_fares?.find((f) => {
                const match =
                  f.SupplierFareClass?.toLowerCase().trim() ===
                    fare_type?.toLowerCase().trim() &&
                  Number(f.TotalPrice) === inputPrice;
                console.log("Tbo match check:", {
                  sourceFareClass: f.SupplierFareClass,
                  fare_type,
                  sourcePrice: f.TotalPrice,
                  inputPrice,
                  match,
                });
                return match;
              });
              return found
                ? {
                    ...found,
                    from: "Tbo",
                    price: found.TotalPrice,
                    ResultIndex: found.ResultIndex,
                    trace_id: found.trace_id,
                    traceId: found.trace_id, // Add both formats
                    isLCC: found.isLCC || false,
                    SupplierFareClass:
                      found.SupplierFareClass || "Regular Fare",
                  }
                : null;
            }
            return null;
          })
          .filter(Boolean);

        console.log("Matched Fare Objects:", matchedObjects);
        setFlightFare(matchedObjects);

        if (matchedObjects.length > 0) {
          NavigatetoBookingflow(matchedObjects, Flightdata, passengerDetails);
        } else if (matchedObjects.length === 0) {
          setLoadingg(false);

          Swal.fire({
            title: "Fare Not Available",
            text: "The selected fare is no longer available. Would you like to search again?",
            icon: "warning",
            // showCancelButton: true,
            confirmButtonText: "Search Again",
            // cancelButtonText: "Cancel",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/";
            }
          });

          return;
        }
      } else if (JourneyType == 2) {
        const matchedObjects = faresArray
          .map(({ source, fare_type, price_without_markup }) => {
            const inputPrice = Number(price_without_markup);
            let found = null;

            if (source === "Uapi") {
              found = data.uapi_fares?.find(
                (f) =>
                  f.SupplierFareClass?.toLowerCase().trim() ===
                    fare_type?.toLowerCase().trim() &&
                  Number(f.TotalPrice) === inputPrice
              );
              return found
                ? {
                    flight: Flightdata.flight,
                    fare: {
                      type: found.SupplierFareClass,
                      price: Number(found.TotalPrice),
                      from: "Uapi",
                      ResultIndex: found.ResultIndex,
                      TraceId: found.trace_id || found.TraceId,
                      traceId: found.trace_id || found.TraceId,
                      ProviderCode: found.ProviderCode,
                      isLCC: found.isLCC || false,
                    },
                  }
                : null;
            }

            if (source === "Tbo") {
              found = data.tbo_fares?.find(
                (f) =>
                  f.SupplierFareClass?.toLowerCase().trim() ===
                    fare_type?.toLowerCase().trim() &&
                  Number(f.TotalPrice) === inputPrice
              );
              return found
                ? {
                    flight: Flightdata.flight,
                    fare: {
                      type: found.SupplierFareClass,
                      price: Number(found.TotalPrice),
                      from: "Tbo",
                      ResultIndex: found.ResultIndex,
                      TraceId: found.trace_id,
                      traceId: found.trace_id,
                    },
                  }
                : null;
            }
            return null;
          })
          .filter(Boolean);

        console.log("Matched Fare Objects for Journey Type 2:", matchedObjects);
        setFlightFare(matchedObjects);
        setOnwardFares(matchedObjects);
        setLoadingg(false);
        // Alternative using window.confirm
        if (matchedObjects.length === 0) {
          setLoadingg(false);

          Swal.fire({
            title: "Fare Not Available",
            text: "The selected fare is no longer available. Would you like to search again?",
            icon: "warning",
            // showCancelButton: true,
            confirmButtonText: "Search Again",
            // cancelButtonText: "Cancel",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/";
            }
          });

          return;
        }
      }
    } catch (error) {
      console.error("Error in Getfares:", error);
      setLoadingg(false);
    }
  };
  const GetfaresReturn = async (FlightdataReturn, passengerDetails) => {
    const requestData = {
      unique_id: FlightdataReturn.unique_id,
      trace_price: FlightdataReturn.trace_price,
      trace_search: FlightdataReturn.trace_search,
      trace_option: FlightdataReturn.trace_option,
      passengerDetails: passengerDetails,
    };

    try {
      const response = await fetch(`${CONFIG.BASE_URL}searchPrices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const Data = await response.json();
      const data = Data.data;

      const faresArrayReturn = Array.isArray(Taxivaxidata)
        ? Taxivaxidata
        : [Taxivaxidata];
      const matchedObjectsReturn = faresArrayReturn
        .map(({ source, fare_type, price_without_markup }) => {
          let found = null;
          const inputPrice = Number(price_without_markup);

          if (source === "Uapi") {
            found = data.uapi_fares.find(
              (f) =>
                f.SupplierFareClass?.toLowerCase().trim() ===
                  fare_type?.toLowerCase().trim() &&
                Number(f.TotalPrice) === inputPrice
            );
            return found
              ? {
                  flight: FlightdataReturn.flight,
                  fare: {
                    type: found.SupplierFareClass,
                    price: Number(found.TotalPrice),
                    from: "Uapi",
                    ResultIndex: found.ResultIndex,
                    TraceId: found.trace_id,
                    ProviderCode: found.ProviderCode,
                    isLCC: found.isLCC,
                  },
                }
              : null;
          }

          if (source === "Tbo") {
            found = data.tbo_fares.find(
              (f) =>
                f.SupplierFareClass?.toLowerCase().trim() ===
                  fare_type?.toLowerCase().trim() &&
                Number(f.TotalPrice) === inputPrice
            );
            return found
              ? {
                  flight: FlightdataReturn.flight,
                  fare: {
                    type: found.SupplierFareClass,
                    price: Number(found.TotalPrice),
                    from: "Tbo",
                    ResultIndex: found.ResultIndex,
                    TraceId: found.trace_id,
                  },
                }
              : null;
          }

          return null;
        })
        .filter(Boolean);

      console.log(
        "Matched Fare Objects Return jounery 2:",
        matchedObjectsReturn
      );
      setFlightFareReturn(matchedObjectsReturn);
      setReturnFares(matchedObjectsReturn);
      // Alternative using window.confirm
      if (matchedObjectsReturn.length === 0) {
        setLoadingg(false);

        Swal.fire({
          title: "Fare Not Available",
          text: "The selected fare is no longer available. Would you like to search again?",
          icon: "warning",
          // showCancelButton: true,
          confirmButtonText: "Search Again",
          // cancelButtonText: "Cancel",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/";
          }
        });

        return;
      }

      // Retrieve passengerDetails from sessionStorage or use the parameter
      const currentPassengerDetails =
        passengerDetails ||
        JSON.parse(sessionStorage.getItem("currentPassengerDetails") || "[]");

      //   NavigatetoBookingflowReturn(
      //     FlightdataReturn,
      //     matchedObjectsReturn,

      //     currentPassengerDetails
      //   );
      setLoadingg(false);
    } catch (error) {
      setLoadingg(false);
      // console.log("error in GetfaresReturn:", error);
    }
  };
  const FetchEmployee = async () => {
    const empIdsArray = Array.isArray(Taxivaxidata[0]?.passengerDetailsArray)
      ? Taxivaxidata[0]?.passengerDetailsArray
      : [Taxivaxidata[0]?.passengerDetailsArray]; // Ensure
    //console.log("empids", empIdsArray)
    // empIdsArray is always an array
    const formData = new URLSearchParams();
    empIdsArray.forEach((emp, index) => {
      formData.append(`employee_id[${index}]`, emp);
    });

    try {
      const response = await fetch(
        `${CONFIG.MAIN_API}/api/flights/employeeByTaxivaxi`,
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
      // //console.log(responseData)
      const cleanedPassengers = data.map((emp) => {
        const [firstName, ...rest] = (emp.people_name || "").trim().split(" ");
        const lastName = rest.join(" ") || ""; // join remaining parts as lastName

        return {
          date_of_birth: emp.date_of_birth,
          employee_cid: emp.people_cid,
          employee_contact: emp.people_contact,
          employee_email: emp.people_email,
          employee_name: emp.people_name,
          firstName: firstName,
          gender: emp.gender,
          id: emp.id,
          lastName: lastName,
          user_type: "ADT",
        };
      });

      // console.log("passengerdetails", cleanedPassengers);
      setPassengerInfo(cleanedPassengers);
      emptaxivaxi.push(...cleanedPassengers);
    } catch (error) {
      // console.error("Error fetching employee data:", error);
    }
  };
  //  console.log("passengerdetails from state", PassengerDetails)
  const Updatedtaxivaxidata = {
    Passengerdetails: JourneyType == 1 ? emptaxivaxi : PassengerInfo,
    searchfromcity: Taxivaxidata[0]?.from_city,
    searchtocity: Taxivaxidata[0]?.to_city,
    searchdeparture: getOnlyDate(Taxivaxidata[0]?.departure_date),
    searchreturnd: Taxivaxidata[0]?.return_date,
    // airlinedata: airlineResponseData,
    // airportData: airportResponseData,
    selectadult: Taxivaxidata[0]?.passengerDetailsArray?.length,
    selectchild: "0",
    selectinfant: "0",
    selectclass: Taxivaxidata[0]?.seat_type,
    bookingtype: "book",
    // apiairportsdata: apiairportData,
    requesttype: Taxivaxidata[0]?.request_type,
    clientname: Taxivaxidata[0]?.client_name,
    clientid: Taxivaxidata[0]?.client_id,
    markupdata: Taxivaxidata[0]?.markup_details,
    bookingid: Taxivaxidata[0]?.booking_id,
    isapproved: Taxivaxidata[0]?.is_approved,
    no_of_seats: Taxivaxidata[0]?.no_of_seats,
    // request_id: Taxivaxidata[0]?.request_id,

    // Passengerdetails: emptaxivaxi,
    // Passengerdetails: passengerDetails,
    is_gst_benefit: Taxivaxidata[0]?.is_gst_benifit,
    flighttype: Taxivaxidata[0]?.flight_type,
    accessToken: Taxivaxidata[0]?.access_token,
    agent_id: Taxivaxidata[0]?.agentId,
  };
  // console.log("updated taxivaxi data", Updatedtaxivaxidata)

  // const NavigatetoBookingflow = (fare, Flight, passengerDetails) => {
  //   const adultCount = Taxivaxidata[0]?.passengerDetailsArray.length;
  //   const childCount = 0;
  //   const infantCount = 0;
  //   const PriceResponse = {
  //     key: fare?.[0]?.ResultIndex,
  //     traceId: fare?.[0]?.trace_id,
  //     source_type: fare?.[0]?.from,
  //     IsLCC: fare?.[0]?.isLCC,
  //     faretype: fare?.[0]?.SupplierFareClass || "Regular Fare",
  //     segments: Flight?.flight?.segments,
  //     CabinClass: Taxivaxidata[0]?.seat_type,
  //     Passenger_info: {
  //       Adult: adultCount,
  //       Child: childCount,
  //       Infant: infantCount,
  //     },
  //     passengerDetails: passengerDetails,
  //     FlightType: Taxivaxidata[0]?.flight_type,
  //     FlightDetails: Updatedtaxivaxidata || "",
  //   };
  //   console.log(PriceResponse);
  //   sessionStorage.setItem("PriceResponse", JSON.stringify(PriceResponse));

  //   // Open in new tab
  //   const path =
  //     fare?.[0]?.from === "Uapi" ? "/UapiBookingflow" : "/TboBookingflow";
  //   // window.open(path,'_blank');
  //   navigate(path);
  // };
  const NavigatetoBookingflow = (fare, Flight, passengerDetails) => {
    const adultCount = Taxivaxidata[0]?.passengerDetailsArray.length;
    const childCount = 0;
    const infantCount = 0;

    // Get the first fare object from the array
    const fareObj = Array.isArray(fare) ? fare[0] : fare;

  

    // Check what properties are available
    if (fareObj) {
      console.log(
        "ResultIndex exists?:",
        "ResultIndex" in fareObj,
        fareObj.ResultIndex
      );
  
    }

    const PriceResponse = {
      key: fareObj?.ResultIndex || fareObj?.resultIndex,
      traceId: fareObj?.trace_id || fareObj?.traceId || fareObj?.TraceId,
      source_type: fareObj?.from,
      IsLCC: fareObj?.isLCC || false,
      faretype: fareObj?.SupplierFareClass || fareObj?.type || "Regular Fare",
      segments: Flight?.flight?.segments,
      CabinClass: Taxivaxidata[0]?.seat_type,
      Passenger_info: {
        Adult: adultCount,
        Child: childCount,
        Infant: infantCount,
      },
      passengerDetails: passengerDetails,
      FlightType: Taxivaxidata[0]?.flight_type,
      FlightDetails: Updatedtaxivaxidata || "",
      ClientPrice:Taxivaxidata[0]?.price,
      
      // Include the entire fare object for debugging
      rawFare: fareObj,
    };

    console.log("PriceResponse to be saved:", PriceResponse);

    // Validate required fields
    if (!PriceResponse.key || !PriceResponse.traceId) {
      console.error("Missing required fields in PriceResponse!");
      console.error("Missing key:", PriceResponse.key);
      console.error("Missing traceId:", PriceResponse.traceId);
      alert("Error: Could not retrieve fare details. Please try again.");
      setLoadingg(false);
      return;
    }

    sessionStorage.setItem("PriceResponse", JSON.stringify(PriceResponse));

    // Determine which booking flow to use
    let path = "/TboBookingflow"; // default
    if (fareObj?.from === "Uapi") {
      path = "/UapiBookingflow";
    }

    console.log("Navigating to:", path);
    navigate(path);
  };

  useEffect(() => {
    if (onwardFares && returnFares && PassengerDetails) {
      console.log("✅ Both onward and return fares ready!");
      // const passengerDetails =
      //   JSON.parse(sessionStorage.getItem("currentPassengerDetails")) || [];

      NavigatetoBookingflowReturn(onwardFares, returnFares, PassengerDetails);
    }
  }, [onwardFares, returnFares, PassengerDetails]);

  const NavigatetoBookingflowReturn = (
    matchedObjects,
    matchedObjectsReturn,
    PassengerDetails
  ) => {
    // console.log('working with passengerDetails:', passengerDetails);

    const adultCount = Taxivaxidata[0]?.passengerDetailsArray.length || 0;
    const childCount = 0;
    const infantCount = 0;

    const PriceResponse = {
      onward: matchedObjects[0] || [], // 👈 onward flights (first leg)
      return: matchedObjectsReturn[0] || [], // 👈 return flights (second leg)
      Passenger_info: {
        Adult: adultCount,
        Child: childCount,
        Infant: infantCount,
      },
      passengerDetails: PassengerDetails || [],
      FlightType: Taxivaxidata[0]?.flight_type,
      FlightDetails: Updatedtaxivaxidata || "",
        ClientPriceOnward:Taxivaxidata[0]?.price,
          ClientPriceReturn:Taxivaxidata[1]?.price,
      // Flightdata: Flightdata,
      // FlightdataReturn: FlightdataReturn
    };

    // console.log("Final PriceResponse:", PriceResponse);

    sessionStorage.setItem(
      "returnPriceResponse",
      JSON.stringify(PriceResponse)
    );
    navigate("/ReturnBookingFlow");
    // window.open("/ReturnBookingFlow", "_blank");
  };

  // Remove the empty NavigateToReturnPage function or update it:

  return (
    <div className="yield-content" style={{ background: "#e8e4ff" }}>
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
    </div>
  );
};

export default Newbookflow;
