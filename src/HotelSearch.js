import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const HotelSearch = () => {
//   const [extractedData, setExtractedData] = useState([]);
const [selectedCity, setSelectedCity] = useState(""); // Selected city
  const [hotelcityList, setHotelCityList] = useState([]);
    const [hotelCodes, setHotelCodes] = useState([]);
    const [loader, setLoader]= useState(false);
    const navigate = useNavigate();
//   useEffect(() => {
//     const getUrlParams = () => {
//       const urlParams = new URLSearchParams(window.location.search);
//       const encodedData = urlParams.get("taxivaxidata");

//       if (encodedData) {
//         const decodedData = decodeURIComponent(encodedData);
//         try {
//           const jsonData = JSON.parse(decodedData);
//           setExtractedData(jsonData);
//         } catch (error) {
//           console.error("Error parsing JSON:", error);
//         }
//       }
//     };

//     getUrlParams();
//   }, []);
const urlParams = new URLSearchParams(window.location.search);
const extractedData = urlParams.get("taxivaxidata");

console.log(extractedData);
const formtaxivaxiData = JSON.parse(decodeURIComponent(extractedData));
          console.log('formtaxivaxiData', formtaxivaxiData); 
  console.log(formtaxivaxiData);
useEffect (()=>{
    if(formtaxivaxiData){
    const fetchHotelCodes = async() =>{
try{
    
    const response = await fetch(
        "https://demo.taxivaxi.com/api/hotels/sbtHotelCodesList",
        {
          method: "POST",
          headers: {
            'Origin': '*', // Change to your React app's origin
            'Access-Control-Request-Method': 'POST', // The method you're going to use
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
      // // console.log("Hotel :", data);

      if (data.Status.Code === 200) {
        const hotels = data.Hotels || []; // Fix: Access Hotels from data.response
        setHotelCityList(hotels);

        if (hotels.length > 0) {
          const codes = hotels.map((hotel) => hotel.HotelCode);
          // // console.log(codes);
          setHotelCodes(codes);
        } else {
          console.warn("No hotels found in response.");
        }
      } else {
        console.error(
          "Error fetching hotels:",
          data.response.Status.Description
        );
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }

    }
    fetchHotelCodes();
}
},[]);

// console.log("hotelcodes",hotelCodes);

useEffect(() => {
    if(formtaxivaxiData){
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
            // "Content-Type": "application/json",
            'Origin': '*', // Change to your React app's origin
            'Access-Control-Request-Method': 'POST', // The method you're going to use
            // Authorization: `Basic ${btoa("Bai:Bai@12345")}`,
          },
          body: JSON.stringify(requestBody),
        });
  
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
        const data = await response.json();
        console.log("Hotel data:", data);
  
        if (data.Status.Code === 200) {
          setHotelCityList(data.HotelResult || []);
  
          sessionStorage.setItem("hotelSearchData", JSON.stringify({ hotelList: data.HotelResult }));
          navigate("/SearchHotel", { state: { hotelList: data.HotelResult } });
        } else {
          Swal.fire({ title: "Error", text: data.Status.Description || "Something went wrong!" });
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setLoader(false);
      }
    };
    
  
    fetchSearchApi();
}
  }, [extractedData, hotelCodes]); // Added dependency array
  

  return (
    <div>
     {loader &&(
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

export default HotelSearch;
