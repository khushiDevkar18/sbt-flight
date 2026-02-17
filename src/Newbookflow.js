import React, { useEffect, useRef, useState } from "react";
import CONFIG from "./config";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Newbookflow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the query parameter
  const queryParams = new URLSearchParams(location.search);
  const bookingDataId = queryParams.get("id");
  
  const hasFetchedRef = useRef(false);
  const keyFetchRef = useRef(false);
  let emptaxivaxi = [];
  
  const [loadingg, setLoadingg] = useState(true);
  const [selectedflight, setselectedflight] = useState([]);
  const [selectedflight_return, setselectedflight_return] = useState([]);
  const [PassengerDetails, setPassengerDetails] = useState([]);
  const [PassengerInfo, setPassengerInfo] = useState([]);
  const [FlightFares, setFlightFare] = useState([]);
  const [FlightFaresReturn, setFlightFareReturn] = useState([]);
  const [Taxivaxidata, setTaxivaxidata] = useState(null);
  const [bookingDataFetched, setBookingDataFetched] = useState(false);
  const [apiError, setApiError] = useState(false);
  
  const [onwardFares, setOnwardFares] = useState(null);
  const [returnFares, setReturnFares] = useState(null);
  const [JourneyType, setJourneyType] = useState(1);
  const [faresFound, setFaresFound] = useState({ onward: false, return: false });

  // useEffect 1: Fetch booking data on component mount
  useEffect(() => {
    if (!bookingDataId) {
      console.error("❌ No booking ID found in URL");
      setLoadingg(false);
      Swal.fire({
        title: "Error",
        text: "No booking ID found in URL. Please use format: /BookFlow?id=20",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        window.location.href = "/";
      });
      return;
    }

    if (!hasFetchedRef.current) {
      fetchBookingData();
      hasFetchedRef.current = true;
    }
  }, [bookingDataId]);

  // useEffect 2: Process data only after API is successfully fetched
  useEffect(() => {
    if (bookingDataFetched && Taxivaxidata && !apiError) {
      console.log("🔍 Checking trip_type:", Taxivaxidata[0]?.trip_type);
      
      // Set Journey Type based on trip_type
      if (Taxivaxidata[0]?.trip_type === "Round Trip") {
        setJourneyType(2);
        console.log("📊 Journey Type set to: 2 (Round Trip)");
      } else {
        setJourneyType(1);
        console.log("📊 Journey Type set to: 1 (One Way)");
      }
      
      // Start the booking flow only if not already started
      if (!keyFetchRef.current) {
        Keyfetch();
        keyFetchRef.current = true;
      }
    } else if (apiError) {
      setLoadingg(false);
    }
  }, [bookingDataFetched, Taxivaxidata, apiError]);

  // useEffect 3: Navigate to return booking flow when both fares are ready
  useEffect(() => {
    console.log("🔄 useEffect 3 triggered");
    console.log("onwardFares:", onwardFares);
    console.log("returnFares:", returnFares);
    console.log("faresFound:", faresFound);
    console.log("JourneyType:", JourneyType);
    
    // Only proceed if BOTH fares are found AND both are not null
    if (JourneyType === 2 && faresFound.onward && faresFound.return && onwardFares && returnFares) {
      console.log("✅ Both onward and return fares ready for round trip!");
      setLoadingg(false);
      NavigatetoBookingflowReturn(onwardFares, returnFares, PassengerDetails);
    } else {
      console.log("⏳ Waiting for all data to be ready...");
      if (JourneyType !== 2) console.log("JourneyType is not 2");
      if (!faresFound.onward) console.log("onward fares not found");
      if (!faresFound.return) console.log("return fares not found");
      if (!onwardFares) console.log("onwardFares is null");
      if (!returnFares) console.log("returnFares is null");
    }
  }, [onwardFares, returnFares, faresFound, PassengerDetails, JourneyType]);

  // Function to fetch booking data from API
  const fetchBookingData = async () => {
    try {
      setLoadingg(true);
      setApiError(false);
      
      const formData = new URLSearchParams();
      formData.append('booking_data_id', bookingDataId);

      const response = await fetch('http://demo.taxivaxi.com/api/flights/fetchFlightBookData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success === "0" && data.response?.encoded_data) {
        const decodedData = JSON.parse(data.response.encoded_data);
        console.log("🔓 Decoded Data:", decodedData);
        
        if (decodedData && Array.isArray(decodedData) && decodedData.length > 0) {
          setTaxivaxidata(decodedData);
          setBookingDataFetched(true);
        } else {
          throw new Error("Invalid decoded data format");
        }
      } else {
        console.error("❌ Failed to fetch booking data:", data.error || "Unknown error");
        setApiError(true);
        setLoadingg(false);
        Swal.fire({
          title: "Error",
          text: data.error || "Failed to fetch booking data. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#3085d6",
        }).then(() => {
          window.location.href = "/";
        });
      }
    } catch (error) {
      console.error("❌ Error fetching booking data:", error);
      setApiError(true);
      setLoadingg(false);
      
      Swal.fire({
        title: "Error",
        text: "An error occurred while fetching booking data: " + error.message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        window.location.href = "/";
      });
    }
  };

  function getOnlyDate(dateTimeString) {
    if (!dateTimeString) return "";
    return dateTimeString.split("T")[0];
  }

  // Generate keys
  const Keyfetch = async () => {
    if (!Taxivaxidata || !Taxivaxidata[0]) {
      console.error("❌ Taxivaxidata not available in Keyfetch");
      setLoadingg(false);
      return;
    }
    
    const requestData = {
      ADT: Taxivaxidata[0]?.passengerDetailsArray?.length || 0,
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
        setPassengerDetails(responseData);
        
        if (responseData && responseData.length > 0) {
          await fetchData(responseData);
        } else {
          setLoadingg(false);
        }
        
        if (Taxivaxidata[0]?.passengerDetailsArray) {
          await FetchEmployee();
        }
      } else {
        console.error("❌ Keyfetch failed:", Data);
        setLoadingg(false);
      }
    } catch (error) {
      console.error("❌ Fetch error in Keyfetch:", error.message);
      setLoadingg(false);
    }
  };

  // Extract airport code
  function extractAirportCode(str) {
    if (!str) return "";
    const match = str.match(/\(([^)]+)\)/);
    return match ? match[1] : "";
  }

  // Extract only date
  function extractDate(dateInput) {
    if (!dateInput || dateInput === "0000-00-00") return null;
    
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      return "";
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    
    return `${year}-${month}-${day}`;
  }

  const fetchData = async (passengerDetails) => {
    if (!Taxivaxidata || !Taxivaxidata[0]) {
      console.error("❌ Taxivaxidata not available in fetchData");
      setLoadingg(false);
      return;
    }
    
    // Determine journey type directly from data
    const isRoundTrip = Taxivaxidata[0]?.trip_type === "Round Trip";
    const currentJourneyType = isRoundTrip ? 2 : 1;
    
    console.log("🛫 fetchData - currentJourneyType:", currentJourneyType);
    
    const url = `${CONFIG.BASE_URL}searchFlights_new`;
    
    const onwardFlightNos = Taxivaxidata[0]?.flight_no?.split(",").map(f => f.trim()) || [];
    const returnFlightNos = Taxivaxidata[1]?.flight_no?.split(",").map(f => f.trim()) || [];
    
    const requestData = {
      origin: extractAirportCode(Taxivaxidata[0]?.from_city),
      destination: extractAirportCode(Taxivaxidata[0]?.to_city),
      departureDate: extractDate(Taxivaxidata[0]?.departure_time),
      adultCount: parseInt(Taxivaxidata[0]?.no_of_seats, 10) || 1,
      childCount: 0,
      infantCount: 0,
      cabinClass: Taxivaxidata[0]?.seat_type || "Economy",
      JourneyType: currentJourneyType,
      flighttype: Taxivaxidata[0]?.flight_type || "domestic",
      returnDate: Taxivaxidata[0]?.return_date !== "0000-00-00" 
        ? extractDate(Taxivaxidata[0]?.return_date) 
        : null,
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
      
      if (data.status === true) {
        // Process onward flight
        const AvailableOptions = data.data.Onward;
        
        const matchedFlight = AvailableOptions.find((option) => {
          if (!option.flight?.flights) return false;
          const optionFlightNos = option.flight.flights.map(f => f.FlightNumber);
          return onwardFlightNos.every(no => optionFlightNos.includes(no));
        });
        
        if (matchedFlight == null) {
          setLoadingg(false);
          Swal.fire({
            title: "Flight Not Available",
            text: "The selected onward flight is no longer available. Would you like to search again?",
            icon: "warning",
            confirmButtonText: "Search Again",
            confirmButtonColor: "#3085d6",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/";
            }
          });
          return; // ✅ Stop execution
        } else {
          setselectedflight(matchedFlight);
          // Pass the journey type to Getfares
          await Getfares(matchedFlight, passengerDetails, currentJourneyType);
        }
        
        // Process return flight if round trip
        if (currentJourneyType === 2) {
          const AvailableOptions_return = data.data.Return;
          
          const matchedFlight_return = AvailableOptions_return.find((option) => {
            if (!option.flight?.flights) return false;
            const optionFlightNosReturn = option.flight.flights.map(f => f.FlightNumber);
            return returnFlightNos.every(no => optionFlightNosReturn.includes(no));
          });
          
          if (matchedFlight_return == null) {
            setLoadingg(false);
            Swal.fire({
              title: "Flight Not Available",
              text: "The selected return flight is no longer available. Would you like to search again?",
              icon: "warning",
              confirmButtonText: "Search Again",
              confirmButtonColor: "#3085d6",
              allowOutsideClick: false,
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = "/";
              }
            });
            return; // ✅ Stop execution
          } else {
            setselectedflight_return(matchedFlight_return);
            // Pass the journey type to GetfaresReturn
            await GetfaresReturn(matchedFlight_return, passengerDetails, currentJourneyType);
          }
        }
      } else {
        setLoadingg(false);
      }
    } catch (error) {
      setLoadingg(false);
      console.error("Error in fetchData:", error);
    }
  };

  // Get fares for onward flight
  const Getfares = async (Flightdata, passengerDetails, journeyType) => {
    console.log("💰 Getfares called for onward flight");
    console.log("Received journeyType:", journeyType);
    
    if (!Taxivaxidata || !Taxivaxidata[0]) {
      console.error("❌ Taxivaxidata not available in Getfares");
      setLoadingg(false);
      return;
    }
    
    const requestData = {
      unique_id: Flightdata.unique_id,
      trace_price: Flightdata.trace_price,
      trace_search: Flightdata.trace_search,
      trace_option: Flightdata.trace_option,
      passengerDetails: passengerDetails,
    };

    try {
      setLoadingg(true);
      const response = await fetch(`${CONFIG.BASE_URL}searchPrices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const Data = await response.json();
      const data = Data.data;
      
      // Get fare details from Taxivaxidata
      let fareDetails = [];
      try {
        if (Taxivaxidata[0]?.fare_details) {
          let fareDetailsString = Taxivaxidata[0].fare_details;
          
          if (typeof fareDetailsString === 'string' && fareDetailsString.startsWith('[')) {
            if (!fareDetailsString.endsWith(']')) {
              fareDetailsString = fareDetailsString + ']';
              console.log("⚠️ Fixed truncated fare_details by adding closing bracket");
            }
            fareDetails = JSON.parse(fareDetailsString);
            console.log("✅ Parsed fare_details array:", fareDetails);
          } else {
            fareDetails = [Taxivaxidata[0]];
          }
        } else {
          fareDetails = [Taxivaxidata[0]];
        }
      } catch (e) {
        console.error("❌ Error parsing fare_details:", e);
        try {
          if (Taxivaxidata[0]?.fare_details) {
            const fareString = Taxivaxidata[0].fare_details;
            const firstObjMatch = fareString.match(/\{.*?\}/);
            if (firstObjMatch) {
              fareDetails = [JSON.parse(firstObjMatch[0])];
              console.log("✅ Extracted first fare object:", fareDetails);
            } else {
              fareDetails = [Taxivaxidata[0]];
            }
          } else {
            fareDetails = [Taxivaxidata[0]];
          }
        } catch (e2) {
          console.error("❌ Second parsing attempt failed:", e2);
          fareDetails = [Taxivaxidata[0]];
        }
      }

      if (journeyType === 1) {
        console.log("🛫 Processing ONE-WAY journey");
        const matchedObjects = [];
        
        for (const fareItem of fareDetails) {
          const source = fareItem.source || "Uapi";
          const fare_type = fareItem.fare_type || "Regular Fare";
          const inputPrice = Math.round(parseFloat(fareItem.price_without_markup || fareItem.price) * 100) / 100;
          
          let found = null;

          if (source === "Uapi") {
            found = data.uapi_fares?.find((f) => {
              const apiPrice = Math.round(parseFloat(f.TotalPrice) * 100) / 100;
              const typeMatch = f.SupplierFareClass?.toLowerCase().trim() === fare_type?.toLowerCase().trim();
              const priceMatch = apiPrice === inputPrice;
              return typeMatch && priceMatch;
            });
            
            if (found) {
              matchedObjects.push({
                ...found,
                from: "Uapi",
                price: found.TotalPrice,
                ResultIndex: found.ResultIndex,
                trace_id: found.trace_id || found.TraceId,
                traceId: found.trace_id || found.TraceId,
                isLCC: found.isLCC || false,
                SupplierFareClass: found.SupplierFareClass || "Regular Fare",
              });
            }
          }

          if (source === "Tbo") {
            found = data.tbo_fares?.find((f) => {
              const apiPrice = Math.round(parseFloat(f.TotalPrice) * 100) / 100;
              const typeMatch = f.SupplierFareClass?.toLowerCase().trim() === fare_type?.toLowerCase().trim();
              const priceMatch = apiPrice === inputPrice;
              return typeMatch && priceMatch;
            });
            
            if (found) {
              matchedObjects.push({
                ...found,
                from: "Tbo",
                price: found.TotalPrice,
                ResultIndex: found.ResultIndex,
                trace_id: found.trace_id,
                traceId: found.trace_id,
                isLCC: found.isLCC || false,
                SupplierFareClass: found.SupplierFareClass || "Regular Fare",
              });
            }
          }
        }

        console.log("✅ Matched Fare Objects for ONE-WAY:", matchedObjects);
        setFlightFare(matchedObjects);

        if (matchedObjects.length > 0) {
          console.log("🚀 Navigating to booking flow for one-way");
          setLoadingg(false);
          NavigatetoBookingflow(matchedObjects, Flightdata, passengerDetails);
        } else {
          console.error("❌ No matching fares found for one-way");
          setLoadingg(false);
          Swal.fire({
            title: "Fare Not Available",
            text: "The selected fare is no longer available. Would you like to search again?",
            icon: "warning",
            confirmButtonText: "Search Again",
            confirmButtonColor: "#3085d6",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/";
            }
          });
        }
      } 
      else if (journeyType === 2) {
        console.log("🔄 Processing ROUND-TRIP journey - ONWARD FLIGHT");
        const matchedObjects = [];
        
        for (const fareItem of fareDetails) {
          const source = fareItem.source || "Uapi";
          const fare_type = fareItem.fare_type || "Regular Fare";
          const inputPrice = Math.round(parseFloat(fareItem.price_without_markup || fareItem.price) * 100) / 100;
          
          let found = null;

          if (source === "Uapi") {
            found = data.uapi_fares?.find((f) => {
              const apiPrice = Math.round(parseFloat(f.TotalPrice) * 100) / 100;
              const typeMatch = f.SupplierFareClass?.toLowerCase().trim() === fare_type?.toLowerCase().trim();
              const priceMatch = apiPrice === inputPrice;
              return typeMatch && priceMatch;
            });
            
            if (found) {
              matchedObjects.push({
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
              });
            }
          }

          if (source === "Tbo") {
            found = data.tbo_fares?.find((f) => {
              const apiPrice = Math.round(parseFloat(f.TotalPrice) * 100) / 100;
              const typeMatch = f.SupplierFareClass?.toLowerCase().trim() === fare_type?.toLowerCase().trim();
              const priceMatch = apiPrice === inputPrice;
              return typeMatch && priceMatch;
            });
            
            if (found) {
              matchedObjects.push({
                flight: Flightdata.flight,
                fare: {
                  type: found.SupplierFareClass,
                  price: Number(found.TotalPrice),
                  from: "Tbo",
                  ResultIndex: found.ResultIndex,
                  TraceId: found.trace_id,
                  traceId: found.trace_id,
                },
              });
            }
          }
        }

        console.log("✅ Matched ONWARD Fare Objects for Round Trip:", matchedObjects);
        setFlightFare(matchedObjects);
        
        if (matchedObjects.length > 0) {
          setOnwardFares(matchedObjects);
          setFaresFound(prev => ({ ...prev, onward: true }));
          console.log("⏳ Waiting for return fares to be fetched...");
        } else {
          console.error("❌ No matching onward fares found for round trip");
          setFaresFound(prev => ({ ...prev, onward: false }));
          setLoadingg(false);
          Swal.fire({
            title: "Fare Not Available",
            text: "The selected onward fare is no longer available. Would you like to search again?",
            icon: "warning",
            confirmButtonText: "Search Again",
            confirmButtonColor: "#3085d6",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/";
            }
          });
          return; // ✅ Stop execution
        }
      }
    } catch (error) {
      console.error("❌ Error in Getfares:", error);
      setLoadingg(false);
    }
  };

  // Get fares for return flight
  const GetfaresReturn = async (FlightdataReturn, passengerDetails, journeyType) => {
    console.log("💰 GetfaresReturn called for return flight");
    console.log("Received journeyType:", journeyType);
    
    if (!Taxivaxidata || !Taxivaxidata[1]) {
      console.error("❌ Taxivaxidata return data not available in GetfaresReturn");
      setLoadingg(false);
      return;
    }
    
    const requestData = {
      unique_id: FlightdataReturn.unique_id,
      trace_price: FlightdataReturn.trace_price,
      trace_search: FlightdataReturn.trace_search,
      trace_option: FlightdataReturn.trace_option,
      passengerDetails: passengerDetails,
    };

    try {
      setLoadingg(true);
      const response = await fetch(`${CONFIG.BASE_URL}searchPrices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const Data = await response.json();
      const data = Data.data;
      
      // Get fare details for return flight
      let fareDetailsReturn = [];
      try {
        if (Taxivaxidata[1]?.fare_details) {
          let fareDetailsString = Taxivaxidata[1].fare_details;
          
          if (typeof fareDetailsString === 'string' && fareDetailsString.startsWith('[')) {
            fareDetailsReturn = JSON.parse(fareDetailsString);
            console.log("✅ Parsed return fare_details array:", fareDetailsReturn);
          } else {
            fareDetailsReturn = [Taxivaxidata[1]];
          }
        } else {
          fareDetailsReturn = [Taxivaxidata[1]];
        }
      } catch (e) {
        console.error("❌ Error parsing return fare_details:", e);
        fareDetailsReturn = [Taxivaxidata[1]];
      }
      
      // Match fares for return flight
      const matchedObjectsReturn = [];
      
      for (const fareItem of fareDetailsReturn) {
        const source = fareItem.source || "Uapi";
        const fare_type = fareItem.fare_type || "Regular Fare";
        const inputPrice = Math.round(parseFloat(fareItem.price_without_markup || fareItem.price) * 100) / 100;
        
        let found = null;

        if (source === "Uapi") {
          found = data.uapi_fares?.find((f) => {
            const apiPrice = Math.round(parseFloat(f.TotalPrice) * 100) / 100;
            const typeMatch = f.SupplierFareClass?.toLowerCase().trim() === fare_type?.toLowerCase().trim();
            const priceMatch = apiPrice === inputPrice;
            return typeMatch && priceMatch;
          });
          
          if (found) {
            matchedObjectsReturn.push({
              ...found,
              from: "Uapi",
              price: Number(found.TotalPrice),
              ResultIndex: found.ResultIndex,
              trace_id: found.trace_id || found.TraceId,
              traceId: found.trace_id || found.TraceId,
              isLCC: found.isLCC || false,
              type: found.SupplierFareClass || "Regular Fare",
              flight: FlightdataReturn.flight
            });
          }
        }

        if (source === "Tbo") {
          found = data.tbo_fares?.find((f) => {
            const apiPrice = Math.round(parseFloat(f.TotalPrice) * 100) / 100;
            const typeMatch = f.SupplierFareClass?.toLowerCase().trim() === fare_type?.toLowerCase().trim();
            const priceMatch = apiPrice === inputPrice;
            return typeMatch && priceMatch;
          });
          
          if (found) {
            matchedObjectsReturn.push({
              ...found,
              from: "Tbo",
              price: Number(found.TotalPrice),
              ResultIndex: found.ResultIndex,
              trace_id: found.trace_id,
              traceId: found.trace_id,
              isLCC: found.isLCC || false,
              type: found.SupplierFareClass || "Regular Fare",
              flight: FlightdataReturn.flight
            });
          }
        }
      }

      console.log("✅ Matched RETURN Fare Objects for Round Trip:", matchedObjectsReturn);
      setFlightFareReturn(matchedObjectsReturn);
      
      if (matchedObjectsReturn.length > 0) {
        setReturnFares(matchedObjectsReturn);
        setFaresFound(prev => ({ ...prev, return: true }));
        console.log("✅ Return fares set successfully. Waiting for useEffect 3 to trigger navigation...");
        console.log("Current onwardFares:", onwardFares);
        console.log("Current returnFares (just set):", matchedObjectsReturn);
      } else {
        console.error("❌ No matching return fares found");
        setFaresFound(prev => ({ ...prev, return: false }));
        setLoadingg(false);
        Swal.fire({
          title: "Fare Not Available",
          text: "The selected return fare is no longer available. Would you like to search again?",
          icon: "warning",
          confirmButtonText: "Search Again",
          confirmButtonColor: "#3085d6",
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/";
          }
        });
        return; // ✅ Stop execution
      }
    } catch (error) {
      console.error("❌ Error in GetfaresReturn:", error);
      setLoadingg(false);
    }
  };

  const FetchEmployee = async () => {
    if (!Taxivaxidata || !Taxivaxidata[0]) {
      console.error("❌ Taxivaxidata not available in FetchEmployee");
      return;
    }
    
    const empIdsArray = Array.isArray(Taxivaxidata[0]?.passengerDetailsArray)
      ? Taxivaxidata[0]?.passengerDetailsArray
      : [Taxivaxidata[0]?.passengerDetailsArray];

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
      
      const cleanedPassengers = data.map((emp) => {
        const [firstName, ...rest] = (emp.people_name || "").trim().split(" ");
        const lastName = rest.join(" ") || "";

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

      setPassengerInfo(cleanedPassengers);
      emptaxivaxi.push(...cleanedPassengers);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const Updatedtaxivaxidata = {
    Passengerdetails: JourneyType == 1 ? emptaxivaxi : PassengerInfo,
    searchfromcity: Taxivaxidata?.[0]?.from_city,
    searchtocity: Taxivaxidata?.[0]?.to_city,
    searchdeparture: getOnlyDate(Taxivaxidata?.[0]?.departure_date),
    searchreturnd: Taxivaxidata?.[0]?.return_date,
    selectadult: Taxivaxidata?.[0]?.passengerDetailsArray?.length,
    selectchild: "0",
    selectinfant: "0",
    selectclass: Taxivaxidata?.[0]?.seat_type,
    bookingtype: Taxivaxidata?.[0]?.trip_type,
    requesttype: Taxivaxidata?.[0]?.request_type,
    clientname: Taxivaxidata?.[0]?.client_name,
    clientid: Taxivaxidata?.[0]?.client_id,
    markupdata: Taxivaxidata?.[0]?.markup_details,
    bookingid: Taxivaxidata?.[0]?.booking_id,
    isapproved: Taxivaxidata?.[0]?.is_approved,
    no_of_seats: Taxivaxidata?.[0]?.no_of_seats,
    is_gst_benefit: Taxivaxidata?.[0]?.is_gst_benifit,
    flighttype: Taxivaxidata?.[0]?.flight_type,
    accessToken: Taxivaxidata?.[0]?.access_token,
    agent_id: Taxivaxidata?.[0]?.agentId,
  };

  const NavigatetoBookingflow = (fare, Flight, passengerDetails) => {
    const adultCount = Taxivaxidata?.[0]?.passengerDetailsArray?.length || 0;
    const childCount = 0;
    const infantCount = 0;

    const fareObj = Array.isArray(fare) ? fare[0] : fare;

    const PriceResponse = {
      key: fareObj?.ResultIndex || fareObj?.resultIndex,
      traceId: fareObj?.trace_id || fareObj?.traceId || fareObj?.TraceId,
      source_type: fareObj?.from,
      IsLCC: fareObj?.isLCC || false,
      faretype: fareObj?.SupplierFareClass || fareObj?.type || "Regular Fare",
      segments: Flight?.flight?.segments,
      CabinClass: Taxivaxidata?.[0]?.seat_type,
      Passenger_info: {
        Adult: adultCount,
        Child: childCount,
        Infant: infantCount,
      },
      passengerDetails: passengerDetails,
      FlightType: Taxivaxidata?.[0]?.flight_type,
      FlightDetails: Updatedtaxivaxidata || "",
      ClientPrice: Taxivaxidata?.[0]?.price,
      rawFare: fareObj,
    };

    if (!PriceResponse.key || !PriceResponse.traceId) {
      console.error("Missing required fields in PriceResponse!");
      alert("Error: Could not retrieve fare details. Please try again.");
      setLoadingg(false);
      return;
    }

    sessionStorage.setItem("PriceResponse", JSON.stringify(PriceResponse));

    let path = "/TboBookingflow";
    if (fareObj?.from === "Uapi") {
      path = "/UapiBookingflow";
    }

    navigate(path);
  };

  const NavigatetoBookingflowReturn = (
    matchedObjects,
    matchedObjectsReturn,
    PassengerDetails
  ) => {
    const adultCount = Taxivaxidata?.[0]?.passengerDetailsArray?.length || 0;
    const childCount = 0;
    const infantCount = 0;

    const PriceResponse = {
      onward: matchedObjects[0] || [],
      return: matchedObjectsReturn[0] || [],
      Passenger_info: {
        Adult: adultCount,
        Child: childCount,
        Infant: infantCount,
      },
      passengerDetails: PassengerDetails || [],
      FlightType: Taxivaxidata?.[0]?.flight_type,
      FlightDetails: Updatedtaxivaxidata || "",
      ClientPriceOnward: Taxivaxidata?.[0]?.price,
      ClientPriceReturn: Taxivaxidata?.[1]?.price,
    };

    console.log("Final PriceResponse for round trip:", PriceResponse);
    sessionStorage.setItem("returnPriceResponse", JSON.stringify(PriceResponse));
    navigate("/ReturnBookingFlow");
  };

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