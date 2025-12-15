import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const HotelSearch = () => {
  const [hotelCityList, setHotelCityList] = useState([]);
  const [hotelCodes, setHotelCodes] = useState([]);
  const [loader, setLoader] = useState(false);
  const [hotelDetails, setHotelDetails] = useState();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const extractedData = urlParams.get("taxivaxidata");
const [personDetails , setPersonDetails]= useState();

  let formtaxivaxiData = null;
  try {
    formtaxivaxiData = extractedData
      ? JSON.parse(decodeURIComponent(extractedData))
      : null;
    console.log("formtaxivaxiData", formtaxivaxiData);
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  // Fetch Hotel Codes First
  useEffect(() => {
    if (formtaxivaxiData) {
      const fetchHotelCodes = async () => {
        try {
          setLoader(true);
          const response = await fetch(
            "https://demo.taxivaxi.com/api/hotels/sbtHotelCodesList",
            {
              method: "POST",
              headers: {
                //   "Content-Type": "application/json",
                Origin: "*",
                "Access-Control-Request-Method": "POST",
              },
              body: JSON.stringify({
                CityCode: formtaxivaxiData.city,
                IsDetailedResponse: "true",
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          if (data.Status.Code === 200) {
            const hotels = data.Hotels || [];
            setHotelCityList(hotels);

            if (hotels.length > 0) {
              const codes = hotels.map((hotel) => hotel.HotelCode);
              setHotelCodes(codes);
            } else {
              console.warn("No hotels found in response.");
            }
          } else {
            console.error("Error fetching hotels:", data.Status.Description);
          }
        } catch (error) {
          console.error("Error fetching hotels:", error);
        }
      };

      fetchHotelCodes();
    }
  }, []);
  // const passengerId1 = formtaxivaxiData["passengerDetailsArray[0][id]"];
  // const passengerId2 = formtaxivaxiData["passengerDetailsArray[1][id]"];
  const passengerId = formtaxivaxiData.passengerDetailsArray;
  
//  const search = formtaxivaxiData.request_type;
 sessionStorage.setItem("agent_portal", 0);
  
  

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        // setLoader(true);
  
        const requestBody = {
          people_ids: [
         passengerId
          ],
        };
  console.log(requestBody)
        const response = await fetch(
          "https://demo.taxivaxi.com/api/hotels/getPeoplewithId",
          {
            method: "POST",
            headers: {
              // "Content-Type": "application/json", // Added correct content type
              Origin: "*",
              "Access-Control-Request-Method": "POST",
            },
            body: JSON.stringify(requestBody),
          }
        );
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log(data);
  
        // Store response in session storage
        sessionStorage.setItem("peopleData", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching people data:", error);
      } finally {
        // setLoader(false); // Ensure loader is turned off
      }
    };
  
    fetchPerson();
  }, []);

  useEffect(() => {
    if (formtaxivaxiData && hotelCodes.length > 0) {
      const fetchSearchApi = async () => {
        setLoader(true);
        const requestBody = {
          CheckIn: formtaxivaxiData.checkindate,
          CheckOut: formtaxivaxiData.checkoutdate,
          HotelCodes: hotelCodes.toString(),
          GuestNationality: "IN",
          PaxRooms: [
            {
              Adults: formtaxivaxiData.PassengerADT,
              Children: formtaxivaxiData.Passengerchild,
              ChildrenAges:
                formtaxivaxiData.Passengerchild > 0
                  ? formtaxivaxiData.Passengerchildage
                  : [],
            },
          ],
          ResponseTime: 23.0,
          IsDetailedResponse: true,
          Filters: {
            Refundable: false,
            NoOfRooms: 1,
            MealType: 0,
            OrderBy: 0,
            StarRating: 0,
            HotelName: null,
          },
        };

        try {
          const response = await fetch(
            "https://demo.taxivaxi.com/api/hotels/sbtHotelCodesSearch",
            {
              method: "POST",
              headers: {
                //   "Content-Type": "application/json",
                Origin: "*",
                "Access-Control-Request-Method": "POST",
              },
              body: JSON.stringify(requestBody),
            }
          );

          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

          const data = await response.json();
          //   console.log("Hotel data:", data);

          if (data.Status.Code === 200) {
            setHotelCityList(data.HotelResult || []);
            const searchParams = {
              checkIn: formtaxivaxiData.checkindate,
              checkOut: formtaxivaxiData.checkoutdate,
              Rooms: "1",
              Adults: formtaxivaxiData.PassengerADT,
              Children: formtaxivaxiData.Passengerchild,
              ChildAge: formtaxivaxiData.Passengerchildage,
              CityCode: formtaxivaxiData.city,
              //   "filteredCompany": JSON.parse(sessionStorage.getItem("selectedCompany")) || null, // Retrieve full company data,
              City_name: formtaxivaxiData.city_name,
              spoc_name: formtaxivaxiData.spoc_name,
              approver1: formtaxivaxiData.approver1_email,
              approver2: formtaxivaxiData.approver2_email,
              corporate_name: formtaxivaxiData.corporate_name,
              booking_id: formtaxivaxiData.booking_id,
              admin_id: formtaxivaxiData.admin_id,
              payment: formtaxivaxiData.is_self_payment,
              booknow: '0'|formtaxivaxiData.booknow ,
            
            };
              sessionStorage.setItem("has_Booking_access", 0);
               sessionStorage.setItem("has_search_access", 0);
            sessionStorage.setItem(
              "hotelData_header",
              JSON.stringify(searchParams)
            );
            sessionStorage.setItem(
              "hotelSearchData",
              JSON.stringify({ hotelcityList: data.HotelResult })
            );

            fetchCity(data.HotelResult || []);
          } else {
            // Swal.fire({ title: "Error", text: data.Status.Description || "Something went wrong!" });
            navigate("/ResultNotFound");
          }
        } catch (error) {
          console.error("Error fetching hotels:", error);
        } finally {
          // setLoader(false);
        }
      };

      fetchSearchApi();
    }
  }, [hotelCodes]); // Runs only when hotelCodes are updated
  const fetchCity = async (hotelcityList) => {
    if (!Array.isArray(hotelcityList) || hotelcityList.length === 0) {
      return;
    }

    setLoader(true);
    const codes = hotelcityList.map((hotel) => hotel.HotelCode).join(",");

    try {
      const response = await fetch(
        "https://demo.taxivaxi.com/api/hotels/sbtHotelDetails",
        {
          method: "POST",
          headers: {
            Origin: "*",
            "Access-Control-Request-Method": "POST",
          },
          body: JSON.stringify({
            Hotelcodes: codes,
            Language: "EN",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.Status && data.Status.Code === 200) {
        setHotelDetails(data.HotelDetails || []);

        sessionStorage.setItem(
          "hotelDetails",
          JSON.stringify(data.HotelDetails || [])
        );

        navigate("/SearchHotel", {
          state: { hotelcityList: data.HotelResult },
        });
      } else {
        console.error("Error fetching hotels:", data.Status?.Description);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      // setLoader(false);
    }
  };

  return (
    <div>
     {loader && (
  <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
    <img
      src="../img/hotel_loader.gif"
      alt="Loading..."
      className="loader_size"
    />
  </div>
)}

    </div>
  );
};

export default HotelSearch;
