import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const HotelSearch = () => {
  const [hotelCityList, setHotelCityList] = useState([]);
  const [hotelCodes, setHotelCodes] = useState([]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const extractedData = urlParams.get("taxivaxidata");

  let formtaxivaxiData = null;
  try {
    formtaxivaxiData = extractedData ? JSON.parse(decodeURIComponent(extractedData)) : null;
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
          const response = await fetch("https://demo.taxivaxi.com/api/hotels/sbtHotelCodesList", {
            method: "POST",
            headers: {
            //   "Content-Type": "application/json",
              "Origin": "*",
              "Access-Control-Request-Method": "POST",
            },
            body: JSON.stringify({
              CityCode: formtaxivaxiData.city,
              IsDetailedResponse: "true",
            }),
          });

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
              ChildrenAges: formtaxivaxiData.Passengerchild > 0 ? formtaxivaxiData.Passengerchildage : [],
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
          const response = await fetch("https://demo.taxivaxi.com/api/hotels/sbtHotelCodesSearch", {
            method: "POST",
            headers: {
            //   "Content-Type": "application/json",
              "Origin": "*",
              "Access-Control-Request-Method": "POST",
            },
            body: JSON.stringify(requestBody),
          });

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

          const data = await response.json();
        //   console.log("Hotel data:", data);

          if (data.Status.Code === 200) {
            setHotelCityList(data.HotelResult || []);
              const searchParams = {
                    "checkIn":formtaxivaxiData.checkindate,
                      "checkOut":formtaxivaxiData.checkoutdate,
                      "Rooms":"1",
                      "Adults":formtaxivaxiData.PassengerADT,
                      "Children":formtaxivaxiData.Passengerchild,
                      "ChildAge":formtaxivaxiData.Passengerchildage,
                      "CityCode":formtaxivaxiData,
                    //   "filteredCompany": JSON.parse(sessionStorage.getItem("selectedCompany")) || null, // Retrieve full company data,
                      "filteredCities":formtaxivaxiData.city_name,
                      "spoc_name":formtaxivaxiData.spoc_name,
                      "approver1":formtaxivaxiData.approver1_email,
                      "approver2":formtaxivaxiData.approver2_email,
                      "corporate_name":formtaxivaxiData.corporate_name,
                      "booking_id":formtaxivaxiData.booking_id,
                    };
                    sessionStorage.setItem('hotelData_header', JSON.stringify(searchParams));
            sessionStorage.setItem("hotelSearchData", JSON.stringify({ hotelList: data.HotelResult }));
            navigate("/SearchHotel", { state: { hotelList: data.HotelResult } });
          } else {
            // Swal.fire({ title: "Error", text: data.Status.Description || "Something went wrong!" });
            navigate("/ResultNotFound")
          }
        } catch (error) {
          console.error("Error fetching hotels:", error);
        } finally {
          setLoader(false);
        }
      };

      fetchSearchApi();
    }
  }, [hotelCodes]); // Runs only when hotelCodes are updated

  return (
    <div>
      {loader && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <img src="../img/hotel_loader.gif" alt="Loading..." className="loader_size" />
        </div>
      )}
    </div>
  );
};

export default HotelSearch;
