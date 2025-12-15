import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CONFIG from "./config";

const NewFormtaxivaxi = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const queryParams = new URLSearchParams(location.search);
      const encodedData = queryParams.get("taxivaxidata");

      if (!encodedData) return;

      try {
        setLoading(true);

        const decoded = decodeURIComponent(encodedData);
        let rawData = JSON.parse(decoded);

        console.log("Raw decoded data:", rawData);

        // FIX passengerDetailsArray (string → array)
        if (
          rawData.passengerDetailsArray &&
          typeof rawData.passengerDetailsArray === "string"
        ) {
          rawData.passengerDetailsArray = JSON.parse(
            rawData.passengerDetailsArray
          );
        }

        console.log("Fixed Passenger Array:", rawData.passengerDetailsArray);

        const empIdsArray = rawData.passengerDetailsArray || [];

        // CALL TAXIVAXI EMPLOYEE API
        const formData = new URLSearchParams();
        empIdsArray.forEach((emp) => {
          formData.append("employee_id[]", emp);
        });

        const empResponse = await fetch(
          `${CONFIG.MAIN_API}/api/flights/employeeByTaxivaxi`,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData.toString(),
          }
        );

        const empJson = await empResponse.json();
        console.log("Employee API Response:", empJson);
        const employeeData = empJson.result || [];

        // const cleanedPassengers = employeeData.map((emp) => {
        //   const [firstName, ...rest] = (emp.people_name || "")
        //     .trim()
        //     .split(" ");
        //   const lastName = rest.join(" ") || ""; // join remaining parts as lastName
  const cleanedPassengers = employeeData.map((emp) => {
    const nameParts = (emp.people_name || "")
        .trim()
        .split(" ")
        .filter(n => n); // Remove extra spaces

    let firstName = "";
    let lastName = "";

    if (nameParts.length === 1) {
        firstName = nameParts[0];
        lastName = "";
    } 
    else {
        firstName = nameParts.slice(0, nameParts.length - 1).join(" ");
        lastName = nameParts[nameParts.length - 1];
    }




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

        rawData.PassengerList = cleanedPassengers;

        const TripType = rawData.trip_type;

        let responseData;

        if (TripType === "One Way") {
          responseData = {
            searchfromcity: rawData.from_city,
            searchtocity: rawData.to_city,
            searchdeparture: rawData.departure_date,
            searchreturnd: rawData.return_date,
            selectadult: rawData.adult || "1",
            selectchild: rawData.child || "0",
            selectinfant: rawData.infant || "0",
            selectclass: rawData.seat_type,
            bookingtype: rawData.trip_type,
            requesttype: rawData.request_type,
            spocemail: rawData.email,
            additionalemail: rawData.additional_emails,
            ccmail: rawData.cc_email,
            clientname: rawData.client_name,
            clientid: rawData.client_id,
            spocname: rawData.spoc_name,
            markupdata: rawData.markup_details,
            bookingid: rawData.booking_id,
            isapproved: rawData.is_approved,
            no_of_seats: rawData.no_of_seats,
            Passengerdetails: cleanedPassengers,
            is_gst_benefit: rawData.is_gst_benefit,
            flighttype: rawData.flight_type,
            accessToken: rawData.access_token,
            agent_id: rawData.agentId,
          };

          navigate("/SearchFlight", { state: { responseData } });
        } else if (TripType === "Round Trip") {
          responseData = {
            searchfromcity: rawData.from_city,
            searchtocity: rawData.to_city,
            searchdeparture: rawData.departure_date,
            searchreturnDate: rawData.return_date,
            searchreturnd: rawData.return_date,
            selectadult: rawData.adult || "1",
            selectchild: rawData.child || "0",
            selectinfant: rawData.infant || "0",
            selectclass: rawData.seat_type,
            bookingtype: rawData.trip_type,
            requesttype: rawData.request_type,
            spocemail: rawData.email,
            additionalemail: rawData.additional_emails,
            ccmail: rawData.cc_email,
            clientname: rawData.client_name,
            clientid: rawData.client_id,
            spocname: rawData.spoc_name,
            markupdata: rawData.markup_details,
            bookingid: rawData.booking_id,
            isapproved: rawData.is_approved,
            no_of_seats: rawData.no_of_seats,
            Passengerdetails: cleanedPassengers,
            is_gst_benefit: rawData.is_gst_benefit,
            flighttype: rawData.flight_type,
            accessToken: rawData.access_token,
            agent_id: rawData.agentId,
          };
          navigate("/SearchFlight", { state: { responseData } });
          // console.log("Round Trip Data:", responseData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error parsing or fetching data:", error);
        setLoading(false);
      }
    };

    loadData(); // CALL THE ASYNC FUNCTION
  }, [location.search]);

  return (
    <div className="yield-content">
      {loading && (
        <div className="page-center-loaderr flex items-center justify-center">
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

export default NewFormtaxivaxi;
