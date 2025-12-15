import { useState, useEffect, useLayoutEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import Modal from "./Modal";
import dayjs from "dayjs";
import { Token } from "@mui/icons-material";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import Swal from "sweetalert2";

const HotelBookingCompleted = () => {
 
  const searchParams =
    JSON.parse(sessionStorage.getItem("hotelData_header")) || {};
  const location = useLocation();
  const hotel = location.state?.combinedHotels;
// const [loading, setLoading] = useState(false);
  // console.log(hotel);

  const [hotelBooking, setHotelBooking] = useState([]);
  // // console.log(hotelBooking);
 

  const hotelData = hotel?.[0];
  const [IP, setIP] = useState();
  const [Token, setToken] = useState();
  const [BookingId, setBookingId] = useState(null);
  const [loader, setLoader] = useState(false);
useEffect(() => {


  const gstDetails   = JSON.parse(sessionStorage.getItem("gstDetails") || "{}");
  const personData   = JSON.parse(sessionStorage.getItem("personData") || "[]");

  const fetchHotelBooking = async () => {
    try {
      setLoader(true);
      const { BookingCode, NetAmount: price } = hotelData.Rooms[0] ?? {};
      if (!BookingCode) throw new Error("Booking code missing");

      const hotelPassengers = personData.map((p) => ({
        Title: p.title || "Mr.",
        FirstName: p.firstName,
        LastName:  p.lastName,
        Email:     p.email || null,
        PaxType:   1,
        LeadPassenger: true,
        Age: 0,
        PassportNo: null,
        PassportIssueDate: null,
        PassportExpDate:  null,
        Phoneno: p.contact_no || null,
        PaxId: 0,
        GSTCompanyAddress:  gstDetails.cAddr   || null,
        GSTCompanyContactNumber: gstDetails.contactNo || null,
        GSTCompanyName:    gstDetails.cName   || null,
        GSTNumber:         gstDetails.gstNo   || null,
        GSTCompanyEmail:   gstDetails.email   || null,
        PAN: "BBBBB5056Q",
      }));

      const request = {
        BookingCode,
        IsVoucherBooking: true,
        GuestNationality: "IN",
        EndUserIp: "192.168.11.120",
        RequestedBookingMode: 5,
        // NetAmount: Number(price?.toFixed(3)),
        NetAmount: price,
        HotelRoomsDetails: [{ HotelPassenger: hotelPassengers }],
      };

      const res = await fetch(
        "https://demo.taxivaxi.com/api/hotels/sbtHotelBook",
        {
          method: "POST",
          headers: {Origin:"*" },
          body: JSON.stringify(request),
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      const { Error: apiErr = {}, BookingId } = data.BookResult ?? {};
      if (apiErr.ErrorCode !== 0) {
        Swal.fire({
          // icon: 'error',
          title: 'Booking failed',
          text: apiErr.ErrorMessage || 'Unknown error',
        });
        return;                                   // stop; keep loader? your call
      }
      setBookingId(data.BookResult.BookingId);
      setIP(data.enduserip);
      setToken(data.tokenid);
      setLoader(false);                    // 2️⃣ hide spinner *only here*
    } catch (err) {
      console.error(err);
      // decide whether to keep the loader spinning on error
      // or clear it and show an error message instead:
      // setLoader(false);
    }
  };

  fetchHotelBooking();
}, [hotelData]);


  useEffect(() => {
    const fetchVoucherApi = async () => {
      // if (!BookingId || !IP || !Token) {
      //   return; 
      // }

      try {
        const requestBody = {
          BookingId: BookingId,
          EndUserIp: IP,
          TokenId: Token,
        };

        const response = await fetch(
          "https://demo.taxivaxi.com/api/hotels/addSbtHotelBookingGenerateVoucher",
          {
            method: "POST",
            headers: {
              // "Content-Type": "application/json",
              Origin: "http://localhost:3000",
              "Access-Control-Request-Method": "POST",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setLoader(false);
        // console.log("API Response2:", data);
      } catch (error) {
        setLoader(false);
        console.error("Error fetching voucher API:", error);
      }
    };

    fetchVoucherApi();
  }, [BookingId, IP, Token]); 

//Assigned Booking Api For the Cotrav
  
  // useEffect(() => {
  //   const FetchBook = async () => {
  //     // if(BookingId){
  //     try {
  //       if (!hotelData || !hotelData.Rooms || hotelData.Rooms.length === 0) {
  //         console.error("Hotel data is missing or incomplete.");
  //         return;
  //       }
  
        
  //       const roomName = hotelData.Rooms[0].Name?.join(" ") || "";
  //       const inclusion = hotelData.Inclusion || "";
  //       const mealType = hotelData.MealType || "";
  
        
  //       let assignedRoomType = "";
  //       if (/deluxe|superior|Club|classic/i.test(roomName)) {
  //         assignedRoomType = roomName;
  //       }
  
       
  //       const dailyBreakfast = inclusion.toLowerCase().includes("breakfast") ? "1" : "0";
  
      
  //       const mealPlan = mealType.toLowerCase() === "breakfast" ? "1" : "0";
  
  //     if(searchParams.booking_id){
  //       const formData = new URLSearchParams();
  //       formData.append("access_token", "8aaf1c9d9941e795e5b0c62e5252c537");
  //       formData.append("assigned_hotel", hotelData.HotelName);
  //       formData.append("booking_id", searchParams.booking_id);
  //       formData.append("assigned_hotel_address", hotelData.Address);
  //       // formData.append("hotel_contact", hotelData.PhoneNumber);
  //       formData.append("assigned_room_type",hotelData.Rooms[0].Name[0] );
  //       formData.append("daily_breakfast", dailyBreakfast);
  //       formData.append("meal_plan", mealPlan);
  //       formData.append("portal_used", "sbt");
  //       formData.append("is_prepaid_booking", "0");
  //       formData.append("is_ac_room", "0");
  //       formData.append("room_price", hotelData.Rooms[0].TotalFare);
  //       formData.append("hotel_id", hotelData.HotelCode);
  //       formData.append("vendor_taxable_amount", hotelData.Rooms[0].TotalTax);
  //       formData.append("vendor_amount_paid_to", hotelData.Rooms[0].TotalFare);
  //       formData.append("vendor_tax_paid_to", "0");
  //       formData.append("vendor_room_nights", hotelData.Rooms[0].DayRates[0].length);
  //       formData.append("commission_earned", "");
  //       formData.append("vendor_invoice_comment", "NA");
  //       formData.append("is_vendor_gst_applicable ", "1");
  // console.log(formData.toString());
  //       const response = await fetch("https://demo.taxivaxi.com/api/hotels/assignSBTHotelBooking", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/x-www-form-urlencoded",
  //         },
  //         body: formData.toString(),
  //       });
  
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  
  //       const data = await response.json();
  //       console.log("API Response:", data);
  //     } 
  //   }
  //   catch (error) {
  //       console.error("Error fetching voucher API:", error);
  //     }
  //   // }
  //   };
  
  //   FetchBook();
  // }, [hotelData]);
  
  const combinedHotels = useMemo(() => {
    if (!hotel && hotelBooking.length === 0) return []; 

   
    const hotelArray = hotel ? [hotel] : [];

    
    const mergedHotels = [...hotelArray, ...hotelBooking].reduce(
      (acc, curr) => {
        const existingIndex = acc.findIndex(
          (item) => item.HotelCode === curr.HotelCode
        );

        if (existingIndex !== -1) {
        
          acc[existingIndex] = { ...acc[existingIndex], ...curr };
        } else {
          
          acc.push(curr);
        }

        return acc;
      },
      []
    );

    return mergedHotels;
  }, [hotel, hotelBooking]);
  // console.log(combinedHotels);
  const navigate = useNavigate();
  const [showGSTDetails, setShowGSTDetails] = useState(false);
  const [showTaxDetails, setShowTaxDetails] = useState(false);
  const [showTimeLineDetails, setShowTimeLineDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  // console.log("Final Combined Hotels:", combinedHotels);
  const decodeHtmlEntities = (text) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  };

  const stripHtmlTags = (html) => {
    const decodedHtml = decodeHtmlEntities(html);
    return decodedHtml.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const formatCancelPolicies = (CancelPolicies) => {
    if (!Array.isArray(CancelPolicies) || CancelPolicies.length === 0) {
      return ["No cancellation policies available."];
    }

    const today = new Date(); 
    today.setHours(0, 0, 0, 0);

    return CancelPolicies.filter((policy) => {
    
      const policyDate = new Date(
        policy.FromDate.split(" ")[0].split("-").reverse().join("-")
      );
      return policyDate >= today; 
    }).map((policy) => {
      const formattedDate = policy.FromDate.split(" ")[0]; 
      if (policy.ChargeType === "Fixed" && policy.CancellationCharge === 0) {
        return `Free Cancellation till check-in`;
      } else if (policy.ChargeType === "Fixed") {
        return `Booking will be cancelled from ${formattedDate} with a charge of ${policy.CancellationCharge}`;
      } else if (policy.ChargeType === "Percentage") {
        return `From ${formattedDate}, the cancellation charge is ${policy.CancellationCharge}%`;
      }
      return `Policy starts from ${formattedDate}`;
    });
  };

  const cleanRateConditions = (conditions) => {
    return conditions.map(
      (condition) =>
        decodeHtmlEntities(condition).replace(/<\/?[^>]+(>|$)/g, "") 
    );
  };
  const formatDate1 = (date) => dayjs(date).format("ddd D MMM YYYY");
  // // console.log("RateConditions:", hotel[0]?.RateConditions);

  const checkInTime =
  Array.isArray(hotel) && hotel.length > 0
    ? hotel[0]?.RateConditions?.find((condition) =>
        condition.startsWith("CheckIn Time-Begin:")
      )
        ?.replace("CheckIn Time-Begin:", "")
        .trim()
    : "N/A";

const checkOutTime =
  Array.isArray(hotel) && hotel.length > 0
    ? hotel[0]?.RateConditions?.find((condition) =>
        condition.startsWith("CheckOut Time:")
      )
        ?.replace("CheckOut Time:", "")
        .trim()
    : "N/A";

  const [showDetails, setShowDetails] = useState(false);
  // Calculate number of nights
  const calculateNights = () => {
    if (!searchParams.checkIn || !searchParams.checkOut) return 0;
    const checkInDate = dayjs(searchParams.checkIn);
    const checkOutDate = dayjs(searchParams.checkOut);
    return checkOutDate.diff(checkInDate, "day");
  };

  const [nights, setNights] = useState(0);

  useEffect(() => {
    setNights(calculateNights());
  }, [searchParams.checkIn, searchParams.checkOut]);
  const renderStars = (rating) => {
    const maxStars = 5;
    const fullStars = Math.floor(rating);
    const emptyStars = maxStars - fullStars;

    // return (
    //   <>
    //     {Array(fullStars).fill(<FaStar className="text-yellow-500" />)}
    //     {Array(emptyStars).fill(<FaRegStar className="text-gray-300" />)}
    //   </>
    // );
  };
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };
  const [mapCenter, setMapCenter] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenImage, setIsOpenImage] = useState(false);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCnfQ-TTa0kZzAPvcgc9qyorD34aIxaZhk", 
  });
  useEffect(() => {
    if (hotel?.length > 0 && hotel[0]?.Map) {
      const coords = hotel[0].Map.split("|").map(Number);
      // console.log("Extracted Coordinates:", coords); // Log coordinates

      if (!isNaN(coords[0]) && !isNaN(coords[1])) {
        setMapCenter({ lat: coords[0], lng: coords[1] });
        // console.log("Setting Map Center:", { lat: coords[0], lng: coords[1] });
      } else {
        console.error("Invalid Coordinates:", coords); 
      }
    } else {
      console.warn("hotel[0].Map is undefined or hotel array is empty");
    }
  }, [hotel]);
  const [remarks, setRemarks] = useState(""); 
  const [apiResponse, setApiResponse] = useState(null);
  const handleSubmit = async () => {
    //   console.log("Entered Remarks:", remarks);
    try {
      const requestBody = {
        BookingMode: 5,
        RequestType: 4,
        Remarks: remarks,
        BookingId: BookingId,
        EndUserIp: IP,
        TokenId: Token,
      };
      const response = await fetch(
        "https://demo.taxivaxi.com/api/hotels/sbtHotelSendChangeRequest",
        {
          method: "POST",
          headers: {
            // "Content-Type": "application/json",
            Origin: "http://localhost:3000",
            "Access-Control-Request-Method": "POST",  
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response3:", data);
      setApiResponse(data.HotelChangeRequestResult);
    } catch {}
    setShowModal3(false); 
    setRemarks("");
  };
  const responseStatusMap = {
    0: "Not Set",
    1: "Successful",
    2: "Failed",
    3: "Invalid Request",
    4: "Invalid Session",
    5: "Invalid Credentials",
  };
  return (
    <div className="search-bar3 h-20 w-full " id="widgetHeader2">
      <div className="purple-header">
        <h5 className="text-xl font-semibold text-white">
          Your booking is comfirmed no need to call for Hotel information
        </h5>
       {BookingId && (
  <p className="text-sm text-white uppercase">
    Booking&nbsp;ID:&nbsp;{BookingId}
  </p>
)}
      </div>
      {loader ? (
        <>
          <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <img
              src="../img/hotel_loader.gif"
              alt="Loading..."
              className="loader_size"
            />
          </div>
        </>
      ) : (
        <>
          {combinedHotels.map((hotelItem, index) => (
            <div key={index} className="mb-5 flex h-full floating-bookings">
              <div className="w-full space-y-5">
                <div className=" py-7 px-6 hotel_booking_cards max-w-[53rem] shadow-[4px_6px_10px_-3px_#bfc9d4] w-full bg-white border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                  <div className="flex gap-3 space-y-2 border-b">
                    <div className=" width_adjustment">
                      <h5 className="text-[#3b3f5c] text-xl font-semibold dark:text-white-light">
                        {hotelItem[0].HotelName}
                      </h5>
                      <div className="flex items-center space-x-1">
                        {renderStars(hotelItem[0].HotelRating)}
                      </div>
                      <div className="flex gap-2">
                        <img
                          src="../img/Address-icon.svg"
                          alt="img"
                          className="w-5 h-5"
                        />
                        <p className="text-xs">{hotelItem[0].Address}</p>
                      </div>
                      <div className="flex gap-3 mb-3">
                        <div className="w-full border box-color  overflow-hidden">
                          <div className="py-4 px-6">
                            <div className="flex items-center justify-between">
                            
                              <div className="text-center">
                                <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                  Check In
                                </h5>
                                <span className="text-sm font-semibold text-gray-800 dark:text-white">
                                  {formatDate1(searchParams.checkIn)}
                                </span>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {checkInTime}
                                </p>
                              </div>

                           
                              <button
                                className=" font-semibold btn-color  text-xs px-5 py-1 rounded-full shadow-md transition duration-300 hover:shadow-lg hover:scale-105"
                                style={{ width: "148px" }}
                              >
                                {nights} {nights === 1 ? "Night" : "Nights"}
                              </button>

                        
                              <div className="text-center">
                                <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                  Check Out
                                </h5>
                                <span className="text-sm font-semibold text-gray-800 dark:text-white">
                                  {formatDate1(searchParams.checkOut)}
                                </span>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {checkOutTime}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <h5 className="text-[#3b3f5c] text-sm font-semibold dark:text-white-light">
                          {hotelItem[0]?.Rooms?.[0]?.Name ||
                            "No Room Name Available"}
                        </h5>
                        <h5
                          className="text-[#785ef7] cursor-pointer text-xs font-semibold"
                          onClick={() => setShowModal2(true)}
                        >
                          See&nbsp;Inclusion
                        </h5>
                      </div>
                      {showModal2 && (
                        <Modal
                          title="Inclusion"
                          onClose={() => setShowModal2(false)}
                        >
                          <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-white-light">
                            <li>{hotelItem[0]?.Rooms[0]?.Inclusion}</li>
                          </ul>
                        </Modal>
                      )}
                      {/* <ul className="list-disc text-black space-y-1">
                                            {hotelItem[0]?.Rooms?.[0]?.Inclusion && (
                                                <li className="text-sm">
                                                    {hotelItem[0].Rooms[0].Inclusion}
                                                </li>
                                            )}
                                            <li className="text-sm">
                                                {hotelItem[0]?.Rooms?.[0]?.MealType === "Room_Only"
                                                    ? "No Meals Included"
                                                    : hotelItem[0]?.Rooms?.[0]?.MealType === "BreakFast"
                                                        ? "Breakfast Included"
                                                        : hotelItem[0]?.Rooms?.[0]?.MealType}
                                            </li>
                                        </ul> */}

                      <div className="text-xs text-green-700">
                        {formatCancelPolicies(
                          hotelItem[0]?.Rooms?.[0]?.CancelPolicies || []
                        ).length > 0 ? (
                          formatCancelPolicies(
                            hotelItem[0]?.Rooms?.[0]?.CancelPolicies || []
                          ).map((policy, idx) => (
                            <div
                              key={idx}
                              className="flex gap-2 items-center mb-2"
                            >
                              <img
                                src="../img/tick.svg"
                                className="w-3 h-5"
                                alt="✔"
                              />
                              <span>{policy}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-[#785ef7]">
                            Cancellation Policy Not Available
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="width_images_final space-y-2 ">
                      <div>
                        {Array.isArray(hotelItem[0].Images) &&
                        hotelItem[0].Images.length > 0 ? (
                          <div className="">
                            <img
                              src={hotelItem[0].Images[1]}
                              className="hotel_images_final"
                            ></img>
                          </div>
                        ) : (
                          <img
                            src="./img/HNF_05.png"
                            className="hotel_images_final"
                          ></img>
                        )}
                      </div>
                      <div className="mb-5">
                        <div
                          className="bg-white shadow-lg rounded border cursor-pointer"
                          onClick={() => setIsOpen(true)}
                        >
                          <div className="relative">
                            {isLoaded && mapCenter ? (
                              <GoogleMap
                                mapContainerStyle={{
                                  width: "100%",
                                  height: "76px",
                                  borderRadius: "8px",
                                }}
                                zoom={15}
                                center={mapCenter}
                              >
                                <Marker position={mapCenter} />
                              </GoogleMap>
                            ) : (
                              <p className="text-center text-gray-500">
                                Loading map...
                              </p>
                            )}

                            <h6 className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-700 text-xs font-semibold mb-4 bg-white p-2 rounded">
                              View MAP
                            </h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-5 mt-3 font-semibold cursor-pointer ">
                    <div className="text-xs text-[#785ef7]  flex">
                      <img src="./img/voucher_01.svg" className="w-5 h-4"></img>
                      Downolad voucher
                    </div>
                    <div className="text-xs text-[#785ef7] flex ">
                      <img src="./img/voucher_01.svg" className="w-5 h-4"></img>
                      Email voucher
                    </div>
                  </div>
                </div>
                <div className="max-w-[53rem] hotel_booking_cards shadow-[4px_6px_10px_-3px_#bfc9d4] w-full bg-white border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                  <div className="py-7 px-6 space-y-2">
                    <h5 className="text-[#3b3f5c] text-xl font-semibold dark:text-white-light">
                      Important Information
                    </h5>

                  
                    <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-white-light">
                      {hotelItem[0]?.RateConditions?.slice(0, 4).map(
                        (condition, index) => (
                          <li key={index}>{stripHtmlTags(condition)}</li>
                        )
                      )}
                      <button
                        className="text-[#785ef7] text-sm font-semibold mt-2 cursor-pointer"
                        onClick={() => setShowModal(true)}
                      >
                        View More
                      </button>
                    </ul>

                   
                  </div>
                </div>

           
                {showModal && (
                  <Modal
                    title="All Hotel Rules"
                    onClose={() => setShowModal(false)}
                  >
                    <ul className="list-disc pl-5 text-xs text-gray-700 dark:text-white-light">
                      {cleanRateConditions(
                        hotelItem[0]?.RateConditions || []
                      ).map((condition, index) => (
                        <li key={index}>{condition}</li>
                      ))}
                    </ul>
                  </Modal>
                )}
              </div>

              <div className="w-1/3 ">
                <div className="sticky top-0 space-y-5">
                  <div className="max-w-[19rem]  hotel_booking_cards w-full bg-white border border-gray-300 dark:border-[#1b2e4b] dark:bg-[#191e3a] sticky top-5 shadow-[4px_6px_10px_-3px_#bfc9d4]">
                    <div className="py-2 px-6">
                      <div className="border-b">
                        <h5 className="text-[#785ef7] text-sm font-semibold  dark:text-white-light">
                          Need Modification
                        </h5>
                        <div className="flex gap-2 ">
                          <img
                            src="./img/Traveller.svg"
                            className="w-5 h-5 cursor-pointer"
                          />
                          <p className="text-xs cursor-pointer"> Chnage Name</p>
                        </div>
                      </div>
                      <div>
                        {apiResponse ? (
                       
                          <div>
                            <h5 className="text-[#785ef7] text-sm font-semibold dark:text-white-light">
                              Cancel Booking
                            </h5>
                            <div className="flex gap-2">
                              <h6 className="text-xs ">
                                Status:{" "}
                                {responseStatusMap[
                                  apiResponse.ResponseStatus
                                ] || "Unknown"}
                              </h6>
                              <img
                                src="../img/i_icon.svg"
                                className="w-4 h-4 cursor-pointer"
                              />
                            </div>
                          </div>
                        ) : (
                          
                          <div>
                            <h5 className="text-[#785ef7] text-sm font-semibold dark:text-white-light">
                              Change In Plans
                            </h5>
                            <div
                              className="flex gap-2"
                              onClick={() => setShowModal3(true)}
                            >
                              <img
                                src="./img/Close-01.svg"
                                className="w-4 h-4 cursor-pointer"
                              />
                              <p className="text-xs cursor-pointer">
                                Cancel Entire Booking
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {showModal3 && (
                    <Modal
                      title="Cancel Booking"
                      onClose={() => setShowModal3(false)}
                    >
                      <div className="p-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white">
                          Remarks
                        </label>
                        <input
                          type="text"
                          className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#785ef7] dark:bg-gray-800 dark:text-white"
                          placeholder="Enter your remarks"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)} // Capture input value
                        />
                        <div className="mt-4 flex justify-end">
                          <button
                            className="px-4 py-2 bg-[#785ef7] text-white rounded-md hover:bg-[#6749c5]"
                            onClick={handleSubmit} // Handle submit action
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </Modal>
                  )}
                  <div className="max-w-[19rem] hotel_booking_cards w-full bg-white border border-gray-300 dark:border-[#1b2e4b] dark:bg-[#191e3a] sticky top-5 shadow-[4px_6px_10px_-3px_#bfc9d4]">
                    <div className="py-2 px-6">
                      <h5 className="text-[#785ef7] text-lg font-semibold  dark:text-white-light">
                        Price Breakup
                      </h5>
                      {hotelItem[0]?.Rooms?.[0]?.PriceBreakUp?.length > 0 ? (
                        <div className="dark:border-[#1b2e4b]">
                          {/* Room Rate */}
                          <div className="flex justify-between items-center border-b border-gray-300 dark:border-[#1b2e4b] py-1 relative">
                            <div className="text-sm text-gray-700 dark:text-white-light flex items-center gap-2">
                              <div>
                                <strong>1 Room x {nights} Nights</strong>
                                <br />
                                <span className="text-xs">Base price </span>
                              </div>

                              <img
                                src="../img/i_icon.svg"
                                className="w-4 h-5 cursor-pointer mb-3"
                                onMouseEnter={() => setShowDetails(true)}
                                onMouseLeave={() => setShowDetails(false)}
                              />
                            </div>
                            <p className="text-sm text-gray-700 dark:text-white-light font-semibold">
                              ₹
                              {hotelItem[0]?.Rooms?.[0]?.PriceBreakUp?.[0]?.RoomRate?.toFixed(
                                2
                              )}
                            </p>

                            {/* Tooltip with Rates */}
                            {showDetails && (
                              <div className="absolute right-0 top-10 w-56 bg-white dark:bg-[#1b2e4b] border border-gray-300 dark:border-[#1b2e4b] shadow-md rounded-lg p-3 z-10">
                                <h6 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                                  Rates Breakdown:
                                </h6>
                                {hotelItem[0]?.Rooms?.[0]?.DayRates?.[0]?.map(
                                  (rate, idx) => (
                                    <div
                                      key={idx}
                                      className="flex justify-between text-xs text-gray-700 dark:text-white-light"
                                    >
                                      <p>Day {idx + 1}:</p>
                                      <p className="font-semibold">
                                        ₹{rate.BasePrice.toFixed(2)}
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>

                          {/* Agent Commission */}
                          {/* <div className="border-b border-gray-300 dark:border-[#1b2e4b] py-1 flex justify-between">
                          <p className="text-sm text-gray-700 dark:text-white-light">
                            <strong>Management Fees:</strong>
                          </p>
                          <p className="text-sm text-gray-700 dark:text-white-light font-semibold">
                            - ₹
                            {hotelItem[0]?.Rooms?.[0]?.PriceBreakUp?.[0]?.AgentCommission?.toFixed(
                              2
                            )}
                          </p>
                        </div> */}

                          {/* Tax Amount */}
                          <div className="border-b border-gray-300 dark:border-[#1b2e4b]  flex justify-between py-1 items-center relative">
                            <div className="flex  gap-1">
                              <p className="text-sm text-gray-700 dark:text-white-light flex items-center gap-2">
                                <strong>Tax Amount</strong>
                              </p>
                              <img
                                src="../img/i_icon.svg"
                                className="w-4 h-5 cursor-pointer"
                                onMouseEnter={() => setShowTaxDetails(true)}
                                onMouseLeave={() => setShowTaxDetails(false)}
                              />
                            </div>
                            <p className="text-sm text-gray-700 dark:text-white-light font-semibold">
                              ₹{hotelItem[0]?.Rooms?.[0]?.TotalTax.toFixed(2)}
                            </p>

                            {/* Tax Breakdown Tooltip */}
                            {showTaxDetails && (
                              <div className="absolute right-0 top-10 w-56 bg-white dark:bg-[#1b2e4b] border border-gray-300 dark:border-[#1b2e4b] shadow-md rounded-lg p-3 z-10">
                               
                                {hotelItem[0]?.Rooms?.[0]?.PriceBreakUp?.[0]?.TaxBreakup?.map(
                                  (tax, idx) => (
                                    <div
                                      key={idx}
                                      className="flex justify-between text-xs text-gray-700 dark:text-white-light"
                                    >
                                      <p>
                                        {tax.TaxType.replace("Tax_", "")} (
                                        {tax.TaxPercentage}%)
                                      </p>
                                      <p className="font-semibold">
                                        ₹{tax.TaxableAmount.toFixed(2)}
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>

                          {/* Total Amount */}
                          <div className="py-1 flex justify-between ">
                            <p className="text-sm text-gray-700 dark:text-white-light">
                              <strong>Total Amount:</strong>
                            </p>
                            <p className="text-sm text-gray-700 dark:text-white-light font-semibold">
                              ₹{hotelItem[0]?.Rooms?.[0]?.TotalFare}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-white-dark">
                          No Price Breakdown Available
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
export default HotelBookingCompleted;
