import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const HotelRoom = () => {
  const [hotelCityList, setHotelCityList] = useState([]);
  const [hotelDetails, setHotelDetails] = useState(null);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const extractedData = urlParams.get("taxivaxidata");

  let formtaxivaxiData = null;
  try {
    formtaxivaxiData = extractedData
      ? JSON.parse(decodeURIComponent(extractedData))
      : null;
    console.log("formtaxivaxiData", formtaxivaxiData);
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
  sessionStorage.setItem("agent_portal_rooms", "1");
//   const passengerId1 = formtaxivaxiData?.passengerDetailsArray?.[0]?.id;
//   const passengerId2 = formtaxivaxiData?.passengerDetailsArray?.[1]?.id;
  const passenger = formtaxivaxiData.passengerIds;
  console.log(passenger);
  const hotelCode = formtaxivaxiData?.hotel_code; // Only one hotel code

  

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const requestBody = {
          people_ids: passenger.filter(Boolean), // Filter out undefined values
        };

        // console.log("Fetching People with Request Body:", requestBody);

        const response = await fetch(
          "https://demo.taxivaxi.com/api/hotels/getPeoplewithId",
          {
            method: "POST",
            headers: {
              Origin: "*",
              "Access-Control-Request-Method": "POST",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        // console.log("People Data:", data);

        sessionStorage.setItem("peopleData", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching people data:", error);
      }
    };

    if (passenger) {
      fetchPerson();
    }
  }, [passenger]);

  useEffect(() => {
    if (hotelCode) {
        setLoader(true);
      const fetchSearchApi = async () => {
        const checkInDate = formtaxivaxiData.checkindate.split(" ")[0];
        const checkOutDate = formtaxivaxiData.checkoutdate.split(" ")[0];
  
        const requestBody = {
          CheckIn: checkInDate,
          CheckOut: checkOutDate,
          HotelCodes: String(formtaxivaxiData.hotel_code),
          GuestNationality: "IN",
          PaxRooms: [
            {
              Adults: formtaxivaxiData?.PassengerADT,
              Children: formtaxivaxiData?.Passengerchild,
              ChildrenAges:
                formtaxivaxiData?.Passengerchild > 0
                  ? formtaxivaxiData?.Passengerchildage
                  : null,
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
            setLoader(true);
        //   console.log("Fetching Hotel Data with Request Body:", requestBody);
          const response = await fetch(
            "https://demo.taxivaxi.com/api/hotels/sbtHotelCodesSearch",
            {
              method: "POST",
              headers: {
                Origin: "*",
                "Access-Control-Request-Method": "POST",
              },
              body: JSON.stringify(requestBody),
            }
          );
  
          if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);
  
          const hotelSearchData = await response.json();
          if (hotelSearchData.Status.Code === 200) {
            setHotelCityList(hotelSearchData.HotelResult || []);
            const searchParams = {
              checkIn: formtaxivaxiData.checkindate,
              checkOut: formtaxivaxiData.checkoutdate,
              Rooms: "1",
              Adults: formtaxivaxiData.PassengerADT,
              Children: formtaxivaxiData.Passengerchild,
              ChildAge: formtaxivaxiData.Passengerchildage,
              CityCode: formtaxivaxiData,
              //   "filteredCompany": JSON.parse(sessionStorage.getItem("selectedCompany")) || null, // Retrieve full company data,
              City_name: formtaxivaxiData.city_name,
              spoc_name: formtaxivaxiData.spoc_name,
              approver1: formtaxivaxiData.approver1_email,
              approver2: formtaxivaxiData.approver2_email,
              corporate_name: formtaxivaxiData.corporate_name,
              booking_id: formtaxivaxiData.booking_id,
              admin_id: formtaxivaxiData.admin_id,
              payment: formtaxivaxiData.is_self_payment,
            
            };
            sessionStorage.setItem(
              "hotelData_header",
              JSON.stringify(searchParams)
            );
            sessionStorage.setItem(
              "hotelSearchData",
              JSON.stringify({ hotelcityList: hotelSearchData.HotelResult })
            );

         
          } else {
            // Swal.fire({ title: "Error", text: data.Status.Description || "Something went wrong!" });
            navigate("/ResultNotFound");
          }
        //   console.log("Hotel Data:", hotelSearchData);
  
          if (hotelSearchData.Status.Code === 200) {
            const hotelResult = hotelSearchData.HotelResult?.[0] || null;
  
            if (hotelResult) {
                setLoader(true);
              // Fetch additional hotel details
              const responseDetails = await fetch(
                "https://demo.taxivaxi.com/api/hotels/sbtHotelDetails",
                {
                  method: "POST",
                  headers: {
                    Origin: "*",
                    "Access-Control-Request-Method": "POST",
                  },
                  body: JSON.stringify({
                    Hotelcodes: hotelCode,
                    Language: "EN",
                  }),
                }
              );
  
              if (!responseDetails.ok)
                throw new Error(
                  `HTTP error! Status: ${responseDetails.status}`
                );
  
              const hotelDetailsData = await responseDetails.json();
            //   console.log("Hotel Details:", hotelDetailsData);
  
              if (hotelDetailsData.Status?.Code === 200) {
                const hotelDetails =
                  hotelDetailsData.HotelDetails?.[0] || null;
  
                // Merging both responses
                const mergedHotelData = {
                  ...hotelResult, // Contains pricing, rooms, booking details
                  ...hotelDetails, // Contains location, amenities, and address
                };
  
                // console.log("Merged Hotel Data:", mergedHotelData);
                if (mergedHotelData) {
                    // Navigate to HotelDetail and pass merged data
                    navigate("/HotelDetail", { state: { hotel: mergedHotelData } });
                }
            
  
                // Store in sessionStorage
                sessionStorage.setItem(
                  "mergedHotelData",
                  JSON.stringify(mergedHotelData)
                );
  
                setHotelCityList([mergedHotelData]);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching hotels:", error);
        }
      };
      setLoader(false);
      fetchSearchApi();
    }
  }, [hotelCode]);
  
  return (
    <div>
    {loader && (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
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

export default HotelRoom;
