import { useState, useEffect, useLayoutEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import Modal from "./Modal";
import dayjs from "dayjs";

const HotelBooking = () => {
  const [loader, setLoader] = useState(false);
  const searchParams = JSON.parse(sessionStorage.getItem("hotelData")) || {};
  const location = useLocation();
  const hotel = location.state?.hotel;

  console.log(searchParams); // This prevents errors if Rooms is undefined or empty

  const [hotelBooking, setHotelBooking] = useState([]);
  console.log(hotelBooking);
  useLayoutEffect(() => {
    if (!hotel || !hotel.Rooms || hotel.Rooms.length === 0) {
      console.error("Hotel or Rooms data is missing!");
      return; // Exit early if data is invalid
    }

    const fetchPriBooking = async () => {
      try {
        const BookingCode_1 = hotel.Rooms[0];
        const BookingCode = BookingCode_1?.BookingCode; // Ensure BookingCode exists
        console.log(BookingCode);
        if (!BookingCode) {
          console.error("BookingCode is missing!");
          return;
        }

        console.log(BookingCode);

        const response = await fetch(
          "https://cors-anywhere.herokuapp.com/https://affiliate.tektravels.com/HotelAPI/PreBook",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${btoa("Bai:Bai@12345")}`,
            },
            body: JSON.stringify({
              BookingCode: BookingCode,
              Language: "EN",
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Hotel data:", data);

        if (data.Status?.Code === 200) {
          setHotelBooking(data.HotelResult || []);
        } else {
          console.error(
            "Error fetching hotels:",
            data.response?.Status?.Description
          );
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchPriBooking();
  }, []); // Empty dependency array ensures it runs once
  const combinedHotels = useMemo(() => {
    if (!hotel && hotelBooking.length === 0) return []; // Return empty if both are missing

    // Convert `hotel` into an array if it exists
    const hotelArray = hotel ? [hotel] : [];

    // Merge hotelArray and hotelBooking
    const mergedHotels = [...hotelArray, ...hotelBooking].reduce(
      (acc, curr) => {
        const existingIndex = acc.findIndex(
          (item) => item.HotelCode === curr.HotelCode
        );

        if (existingIndex !== -1) {
          // Merge existing hotel with the new data
          acc[existingIndex] = { ...acc[existingIndex], ...curr };
        } else {
          // Add new hotel if not already in the list
          acc.push(curr);
        }

        return acc;
      },
      []
    );

    return mergedHotels;
  }, [hotel, hotelBooking]);
  const navigate = useNavigate();
  const [showGSTDetails, setShowGSTDetails] = useState(false);
  const [showTaxDetails, setShowTaxDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  console.log("Final Combined Hotels:", combinedHotels);

  const formatCancelPolicies = (CancelPolicies) => {
    if (!Array.isArray(CancelPolicies) || CancelPolicies.length === 0) {
      return ["No cancellation policies available."];
    }

    const today = new Date(); // Get today's date
    today.setHours(0, 0, 0, 0); // Remove time part for accurate comparison

    return CancelPolicies.filter((policy) => {
      // Convert FromDate to a Date object
      const policyDate = new Date(
        policy.FromDate.split(" ")[0].split("-").reverse().join("-")
      );
      return policyDate >= today; // Only keep future or current dates
    }).map((policy) => {
      const formattedDate = policy.FromDate.split(" ")[0]; // Extract only DD-MM-YYYY
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
  const decodeHtmlEntities = (str) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  };

  const cleanRateConditions = (conditions) => {
    return conditions.map(
      (condition) =>
        decodeHtmlEntities(condition).replace(/<\/?[^>]+(>|$)/g, "") // Removes all HTML tags
    );
  };
  const formatDate1 = (date) => dayjs(date).format("ddd D MMM YYYY");
  const checkInTime =
    combinedHotels.length > 0
      ? combinedHotels[0].RateConditions?.find((condition) =>
          condition.includes("CheckIn Time-Begin")
        )
          ?.replace("CheckIn Time-Begin:", "")
          .trim()
      : "N/A";

  const checkOutTime =
    combinedHotels.length > 0
      ? combinedHotels[0].RateConditions?.find((condition) =>
          condition.includes("CheckOut Time")
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

    return (
      <>
        {Array(fullStars).fill(<FaStar className="text-yellow-500" />)}
        {Array(emptyStars).fill(<FaRegStar className="text-gray-300" />)}
      </>
    );
  };
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [guestDetails, setGuestDetails] = useState({
    title: "",
    firstName: "",
    lastName: "",
    isBelow12: false,
  });
  const [guests, setGuests] = useState([]); // Store all added guests
  const [selectedGuests, setSelectedGuests] = useState([]); // Store only selected guests
  const [error, setError] = useState("");

  const MAX_ADULTS = searchParams.Adults; // 2 (1 prefilled + 1 selectable)
  const MAX_CHILDREN = searchParams.Children; // 2
  const handleCheckboxChange = (index) => {
    setGuests((prevGuests) => {
      const updatedGuests = [...prevGuests];
      const currentGuest = updatedGuests[index];
  
      // Toggle isBelow12 value
      const newIsBelow12 = !currentGuest.isBelow12;
  
      // Update guest object
      updatedGuests[index] = {
        ...currentGuest,
        isBelow12: newIsBelow12,
      };
  
      // Recalculate adults and children count
      const newAdultsCount = updatedGuests.filter((g) => !g.isBelow12).length;
      const newChildrenCount = updatedGuests.filter((g) => g.isBelow12).length;
  
      console.log("Adults:", newAdultsCount, "Children:", newChildrenCount);
  
      // Restrict max adults
      if (!newIsBelow12 && newAdultsCount > MAX_ADULTS) {
        alert(`You can only add up to ${MAX_ADULTS} adults.`);
        return prevGuests;
      }
  
      // Restrict max children
      if (newIsBelow12 && newChildrenCount > MAX_CHILDREN) {
        alert(`You can only add up to ${MAX_CHILDREN} children.`);
        return prevGuests;
      }
  
      return updatedGuests;
    });
  };
  
  

  const handleAddNewGuest = () => {
    setShowForm(true);
    setIsEditing(false);
    setGuestDetails({
      title: "",
      firstName: "",
      lastName: "",
      isBelow12: false,
    });
  };
  const handleEditGuest = (guest) => {
    setShowForm(true);
    setIsEditing(true);
    setGuestDetails(guest);

    // Remove the guest being edited from the list
    setGuests((prevGuests) => prevGuests.filter((g) => g !== guest));
  };

  const handleSubmit = () => {
    if (
      guestDetails.firstName.trim() === "" ||
      guestDetails.lastName.trim() === ""
    ) {
      setError("Please enter guest's first and last name");
      return;
    }

    setGuests((prevGuests) => [...prevGuests, guestDetails]); // Add updated guest back
    setShowForm(false);
    setIsEditing(false);
    setError("");
  };

  const handleDone = () => {
    setShowModal3(false);
    // Store only the checked guests in the selectedGuests list
    const selected = guests.filter((guest) => guest.isBelow12);
    setSelectedGuests(selected);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGuestDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleRemoveGuest = (index) => {
    setSelectedGuests((prevGuests) => prevGuests.filter((_, i) => i !== index));
  };

  return (
    <div className="search-bar3 h-20 w-full " id="widgetHeader2">
      <div className="purple-header">
        <h5 className="text-xl font-semibold text-white">
          Review your Booking
        </h5>
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
                <div className="max-w-[53rem] shadow-[4px_6px_10px_-3px_#bfc9d4] w-full bg-white border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                  <div className="py-7 px-6 space-y-2">
                    <h5 className="text-[#3b3f5c] text-xl font-semibold dark:text-white-light">
                      {hotelItem.HotelName}
                    </h5>
                    <div className="flex items-center space-x-1">
                      {renderStars(hotelItem.HotelRating)}
                    </div>
                    <div className="flex gap-2">
                      <img
                        src="../img/Address-icon.svg"
                        alt="img"
                        className="w-5 h-5"
                      />
                      <p className="text-xs">{hotelItem.Address}</p>
                    </div>
                    <div className="flex flex-cols gap-2 mb-3">
                      <div className="max-w-[25rem] w-full border border-white-light dark:border-[#1b2e4b]  box-color ">
                        <div className="py-2 px-6">
                          <div className="grid grid-cols-3 items-center justify-center  ">
                            <div>
                              <h5 className="text-xs">CHECK IN </h5>
                              <span className="text-sm font-semibold">
                                {formatDate1(searchParams.checkIn)}
                              </span>
                              <p className="text-xs">{checkInTime}</p>
                            </div>

                            {/* Display number of nights in the button */}
                            <button className="border-1 w-20 h-5 mb-2 btn-color rounded-full  text-xs transition duration-300 ">
                              {nights} {nights === 1 ? "Night" : "Nights"}
                            </button>

                            <div>
                              <h5 className="text-xs">CHECK OUT </h5>
                              <span className="text-sm font-semibold">
                                {formatDate1(searchParams.checkOut)}
                              </span>
                              <p className="text-xs">{checkOutTime}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="max-w-[25rem] w-full border border-white-light dark:border-[#1b2e4b] text-center box-color">
                        <div className="py-2 px-6 flex justify-center">
                          <h5 className="text-sm">
                            <span className="font-bold">{nights}</span>{" "}
                            {nights === 1 ? "Night" : "Nights"} |
                            <span className="font-bold">
                              {" "}
                              {searchParams.Adults}
                            </span>{" "}
                            Adults |
                            <span className="font-bold">
                              {" "}
                              {searchParams.Children}
                            </span>{" "}
                            Children
                            {searchParams.ChildAge?.length > 0 && (
                              <span className="font-bold">
                                {" "}
                                {searchParams.ChildAge.map(
                                  (age) => `${age} yrs`
                                ).join(", ")}
                              </span>
                            )}{" "}
                            |
                            <span className="font-bold">
                              {" "}
                              {searchParams.Rooms}
                            </span>{" "}
                            Rooms
                          </h5>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <h5 className="text-[#3b3f5c] text-lg font-semibold dark:text-white-light">
                        {hotelItem?.Rooms?.[0]?.Name ||
                          "No Room Name Available"}
                      </h5>
                      <h5
                        className="text-[#785ef7] cursor-pointer text-sm font-semibold"
                        onClick={() => setShowModal2(true)}
                      >
                        See Inclusion
                      </h5>
                    </div>
                    {showModal2 && (
                      <Modal
                        title="Inclusion"
                        onClose={() => setShowModal2(false)}
                      >
                        <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-white-light">
                          <li>{hotelItem?.Rooms[0]?.Inclusion}</li>
                        </ul>
                      </Modal>
                    )}
                    <ul className="list-disc text-black space-y-1">
                      {hotelItem?.Rooms?.[0]?.Inclusion && (
                        <li className="text-sm">
                          {hotelItem.Rooms[0].Inclusion}
                        </li>
                      )}
                      <li className="text-sm">
                        {hotelItem?.Rooms?.[0]?.MealType === "Room_Only"
                          ? "No Meals Included"
                          : hotelItem?.Rooms?.[0]?.MealType === "BreakFast"
                          ? "Breakfast Included"
                          : hotelItem?.Rooms?.[0]?.MealType}
                      </li>
                    </ul>

                    <div className="text-xs text-green-700">
                      {formatCancelPolicies(
                        hotelItem?.Rooms?.[0]?.CancelPolicies || []
                      ).map((policy, idx) => (
                        <div key={idx} className="flex gap-2">
                          <img
                            src="../img/tick.svg"
                            className="w-3 h-5"
                            alt="✔"
                          />{" "}
                          {policy}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="max-w-[53rem] shadow-[4px_6px_10px_-3px_#bfc9d4] w-full bg-white border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                  <div className="py-7 px-6 space-y-2">
                    <h5 className="text-[#3b3f5c] text-xl font-semibold dark:text-white-light">
                      Important Information
                    </h5>

                    {/* Display First 4 RateConditions */}
                    <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-white-light">
                      {hotelItem?.RateConditions?.slice(0, 4).map(
                        (condition, index) => (
                          <li
                            key={index}
                            dangerouslySetInnerHTML={{ __html: condition }}
                          />
                        )
                      )}
                      <button
                        className="text-[#785ef7] text-sm font-semibold mt-2 cursor-pointer"
                        onClick={() => setShowModal(true)}
                      >
                        View More
                      </button>
                    </ul>

                    {/* View More Button */}
                  </div>
                </div>
                <div className="max-w-[53rem] shadow-[4px_6px_10px_-3px_#bfc9d4] w-full bg-white border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                  <div className="py-7 px-6 space-y-2">
                    <h5 className="text-[#3b3f5c] text-xl font-semibold dark:text-white-light">
                      Guest Details
                    </h5>

                    <form>
                      <div className="guestsInfo__row mb-4">
                        <div className="makeFlex">
                          <div className=" guestDtls__col width70 appendRight10">
                            <p className="font11 capText appendBottom10">
                              Title
                            </p>
                            <div className="frmSelectCont">
                              <select id="title" className="frmSelect">
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Ms">Ms</option>
                              </select>
                            </div>
                          </div>
                          <div className="makeFlex column flexOne">
                            <div className="makeFlex">
                              <div className="guestDtls__col width247 appendRight10">
                                <div className="textFieldCol ">
                                  <p className="font11 appendBottom10 guestDtlsTextLbl">
                                    <span className="capText">FULL NAME</span>
                                  </p>
                                  <input
                                    type="text"
                                    id="fName"
                                    name="fName"
                                    className="frmTextInput "
                                    placeholder="First Name"
                                  />
                                </div>
                              </div>
                              <div className="guestDtls__col width247">
                                <div className="textFieldCol ">
                                  <p className="font11 appendBottom10 guestDtlsTextLbl">
                                    <span className="capText"></span>
                                  </p>
                                  <input
                                    type="text"
                                    id="lName"
                                    name="lName"
                                    className="frmTextInput "
                                    placeholder="Last Name"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="guestDtls__row mb-4">
                        <div className="makeFlex">
                          <div className="guestDtls__col width327 appendRight10">
                            <div className="textFieldCol ">
                              <p className="font11 appendBottom10 guestDtlsTextLbl">
                                <span className="capText">Email Address</span>
                                <span className="grayText appendLeft3">
                                  (Booking voucher will be sent to this email
                                  ID)
                                </span>
                              </p>
                              <input
                                type="text"
                                id="email"
                                name="email"
                                className="frmTextInput "
                                placeholder="Email ID"
                              />
                            </div>
                          </div>
                          <div className="guestDtls__col width327">
                            <p className="font11 capText appendBottom10">
                              Mobile Number
                            </p>
                            <div className="makeFlex textLtr">
                              <div className="guestDtls__contact">
                                <label
                                  for="mCode"
                                  className=" frmSelectCont__contact"
                                >
                                  <span className="selectedCode">+91</span>
                                </label>
                              </div>
                              <div className="flexOne">
                                <div className="textFieldCol ">
                                  <input
                                    type="number"
                                    id="mNo"
                                    name="mNo"
                                    className="frmTextInput noLeftBorder"
                                    placeholder="Contact Number"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="guestDtls__row mb-4">
                        <div>
                          <div className="makeFlex hrtlCenter spaceBetween appendBottom15 mt-3 ">
                            <span className="checkmarkOuter gap-2  ">
                              <input
                                type="checkbox"
                                id="gstVisible"
                                data-gtm-form-interact-field-id="0"
                                className="w-4 h-4"
                                onChange={(e) =>
                                  setShowGSTDetails(e.target.checked)
                                }
                              />
                              <label
                                className="makeFlex hrtlCenter gap-1"
                                for="gstVisible"
                              >
                                <span className="font14 blackText appendRight5">
                                  Enter GST Details
                                </span>{" "}
                                <span className="font11 grayText">
                                  (Optional)
                                </span>
                              </label>
                            </span>
                          </div>
                        </div>
                        {showGSTDetails && (
                          <div className="makeFlex">
                            <div className="guestDtls__col width220 appendRight10">
                              <div className="textFieldCol ">
                                <p className="font11 appendBottom10 guestDtlsTextLbl">
                                  <span className="capText">
                                    Registration Number
                                  </span>
                                </p>
                                <input
                                  type="text"
                                  id="gstNo"
                                  name="gstNo"
                                  className="frmTextInput "
                                  placeholder="Enter Registration No."
                                />
                              </div>
                            </div>
                            <div className="guestDtls__col width220 appendRight10">
                              <div className="textFieldCol ">
                                <p className="font11 appendBottom10 guestDtlsTextLbl">
                                  <span className="capText">
                                    Registered Company name
                                  </span>
                                </p>
                                <input
                                  type="text"
                                  id="cName"
                                  name="cName"
                                  className="frmTextInput "
                                  placeholder="Enter Company Name"
                                />
                              </div>
                            </div>
                            <div className="guestDtls__col width220 appendRight10">
                              <div className="textFieldCol ">
                                <p className="font11 appendBottom10 guestDtlsTextLbl">
                                  <span className="capText">
                                    Registered Company address
                                  </span>
                                </p>
                                <input
                                  type="text"
                                  id="cAddr"
                                  name="cAddr"
                                  className="frmTextInput "
                                  placeholder="Enter Company Address"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      {selectedGuests.length > 0 && (
                        <div className=" border-gray-300 ">
                          <p className="cursor-pointer font-semibold mb-2">
                            Others Guests:
                          </p>
                          <div className="w-25">
                            <ul>
                              {selectedGuests.map((guest, index) => (
                                <li
                                  key={index}
                                  className="text-sm flex items-center justify-between gap-2 border-b "
                                >
                                  <span>
                                    {guest.firstName} {guest.lastName}
                                  </span>

                                  {/* Close (Cross) Icon to remove individual guests */}
                                  <button
                                    onClick={() => handleRemoveGuest(index)}
                                    className="text-gray-500 hover:text-red-600"
                                  >
                                    ✖
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      <div className="guestDtls__add">
                        <p
                          className="text-[#785ef7] cursor-pointer guestDtls__addBtn font-semibold "
                          onClick={() => setShowModal3(true)}
                        >
                          + Add Guest
                        </p>
                      </div>
                      {showModal3 && (
                        <Modal
                          title={
                            <div className="flex items-center justify-between w-full">
                              <span className="text-lg font-medium">
                                Saved Guests
                              </span>
                              {!showForm && (
                                <span
                                  className="text-sm text-[#785ef7] cursor-pointer hover:underline"
                                  onClick={handleAddNewGuest}
                                >
                                  + Add New Guests
                                </span>
                              )}
                            </div>
                          }
                          onClose={() => setShowModal3(false)}
                        >
                          {showForm ? (
                            <>
                              <div className="max-w-[29rem] w-full border py-2 px-3 box-color">
                                <h6 className="font-semibold mt-2">
                                  {isEditing ? "Edit Guest" : "Add Guests"}
                                </h6>
                                <p className="text-xs">
                                  Name should be as per official govt. ID &
                                  travelers below 18 years of age cannot travel
                                  alone.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-2">
                                  <div>
                                    <label htmlFor="gridState">Title</label>
                                    <select
                                      id="gridState"
                                      name="title"
                                      className="form-select"
                                      value={guestDetails.title}
                                      onChange={handleChange}
                                    >
                                      <option>Mr</option>
                                      <option>Mrs</option>
                                      <option>Ms</option>
                                    </select>
                                  </div>
                                  <div className="md:col-span-2">
                                    <label htmlFor="gridCity">Full Name</label>
                                    <div className="flex gap-2 add_gusts_box">
                                      <input
                                        id="gridCity"
                                        name="firstName"
                                        type="text"
                                        className="frmTextInputs"
                                        placeholder="First Name"
                                        value={guestDetails.firstName}
                                        onChange={handleChange}
                                      />
                                      <input
                                        id="gridZip"
                                        name="lastName"
                                        type="text"
                                        className="frmTextInputs"
                                        placeholder="Last Name"
                                        value={guestDetails.lastName}
                                        onChange={handleChange}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  {error && (
                                    <p className="text-red-500 text-sm">
                                      {error}
                                    </p>
                                  )}
                                </div>

                                <div className="mb-2">
                                <label className="inline-flex gap-2">
  <input
    type="checkbox"
    name="isBelow12"
    className="form-checkbox w-3 h-auto"
    checked={guests[index]?.isBelow12 || false} // Ensure correct value
    onChange={() => handleCheckboxChange(index)} // Ensure correct handler
  />
  <span className="text-xs">Below 12 years of age</span>
</label>

                                </div>

                                <div className="flex justify-between mb-2">
                                  <button
                                    type="button"
                                    className="rounded-full btn-color"
                                    onClick={handleSubmit}
                                  >
                                    {isEditing
                                      ? "SAVE GUEST"
                                      : "ADD TO SAVED GUESTS"}
                                  </button>
                                </div>
                              </div>

                              {/* Show the guest list and "Done" button only if guests are added */}
                              {guests.length > 0 && (
                                <div className="h-full flex flex-col gap-4 mt-2">
                                  {guests.map((guest, index) => (
                                    <div
                                      key={index}
                                      className="border-b pb-2 flex justify-between items-center"
                                    >
                                      <label className="inline-flex gap-2 items-center">
                                        <input
                                          type="checkbox"
                                          name="isBelow12"
                                          className="form-checkbox w-3 h-auto"
                                          checked={guest.isBelow12} // ✅ This correctly reflects the state
                                          onChange={() =>
                                            handleCheckboxChange(index)
                                          }
                                        />
                                        <span className="text-sm">
                                          {guest.firstName} {guest.lastName}
                                        </span>
                                      </label>
                                      <img
                                        src="./img/Edit-01.svg"
                                        alt="edit"
                                        className="w-5 h-5 cursor-pointer"
                                        onClick={() => handleEditGuest(guest)}
                                      />
                                    </div>
                                  ))}

                                  <div className="flex justify-center mt-4">
                                    <button
                                      type="button"
                                      className="rounded-full btn-color_h1 h-8 px-4"
                                      onClick={handleDone} // ✅ Saves state after clicking "Done"
                                    >
                                      Done
                                    </button>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="h-full flex flex-col gap-4">
                              {guests.length > 0 && (
                                <div className="h-full flex flex-col gap-4 mt-2">
                                  {guests.map((guest, index) => (
                                    <div
                                      key={index}
                                      className="border-b pb-2 flex justify-between items-center"
                                    >
                                      <label className="inline-flex gap-2 items-center">
                                        <input
                                          type="checkbox"
                                          name="isBelow12"
                                          className="form-checkbox w-3 h-auto"
                                          checked={guest.isBelow12} // ✅ This correctly reflects the state
                                          onChange={() =>
                                            handleCheckboxChange(index)
                                          }
                                        />
                                        <span className="text-sm">
                                          {guest.firstName} {guest.lastName}
                                        </span>
                                      </label>
                                      <img
                                        src="./img/Edit-01.svg"
                                        alt="edit"
                                        className="w-5 h-5 cursor-pointer"
                                        onClick={() => handleEditGuest(guest)}
                                      />
                                    </div>
                                  ))}

                                  <div className="flex justify-center mt-4">
                                    <button
                                      type="button"
                                      className="rounded-full btn-color_h1 h-8 px-4"
                                      onClick={handleDone} // ✅ Saves state after clicking "Done"
                                    >
                                      Done
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* <div className="flex justify-center mt-4">
                                <button
                                  type="button"
                                  className="rounded-full btn-color_h1 h-8 px-4"
                                  onClick={handleDone}
                                >
                                  Done
                                </button>
                              </div> */}
                            </div>
                          )}
                        </Modal>
                      )}
                    </form>
                  </div>
                </div>
                {/* Modal for Full RateConditions */}
                {showModal && (
                  <Modal
                    title="All Hotel Rules"
                    onClose={() => setShowModal(false)}
                  >
                    <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-white-light">
                      {cleanRateConditions(hotelItem?.RateConditions || []).map(
                        (condition, index) => (
                          <li key={index}>{condition}</li>
                        )
                      )}
                    </ul>
                  </Modal>
                )}
                <div className="max-w-[53rem] shadow-[4px_6px_10px_-3px_#bfc9d4] w-full bg-white border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                  <div className="py-7 px-6 space-y-2">
                    <label className="inline-flex gap-2">
                      <input
                        type="checkbox"
                        name="isBelow12"
                        className="form-checkbox w-3 h-auto"
                        // checked={guestDetails.isBelow12 || false} // Prevents undefined issues
                        // onChange={handleChange}
                      />
                      <span className="text-xs">
                        By proceeding, I agree to MakeMyTrip’s User Agreement,
                        Terms of Service and Cancellation & Property Booking
                        Policies.
                      </span>
                    </label>
                    <div>
                      <button
                        type="button"
                        className="bg-[#785ef7] button_width h-10 text-white px-2 rounded-md font-semibold text-sm transition duration-300 hover:bg-[#5a3ec8]"
                        onClick={() =>
                          navigate("/HotelPayment", {
                            state: { combinedHotels },
                          })
                        }
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-1/3 sticky top-0">
                <div className="max-w-[19rem] w-full bg-white border border-gray-300 dark:border-[#1b2e4b] dark:bg-[#191e3a] sticky top-5 shadow-[4px_6px_10px_-3px_#bfc9d4]">
                  <div className="py-7 px-6">
                    <h5 className="text-[#785ef7] text-lg font-semibold mb-4 dark:text-white-light">
                      Price Breakup
                    </h5>
                    {hotelItem?.Rooms?.[0]?.PriceBreakUp?.length > 0 ? (
                      <div className="dark:border-[#1b2e4b]">
                        {/* Room Rate */}
                        <div className="flex justify-between items-center border-b border-gray-300 dark:border-[#1b2e4b] py-2 relative">
                          <p className="text-sm text-gray-700 dark:text-white-light flex items-center gap-2">
                            <strong>1 Room x {nights} Nights</strong>
                            <img
                              src="../img/i_icon.svg"
                              className="w-5 h-5 cursor-pointer"
                              onMouseEnter={() => setShowDetails(true)}
                              onMouseLeave={() => setShowDetails(false)}
                            />
                          </p>
                          <p className="text-sm text-gray-700 dark:text-white-light font-semibold">
                            ₹
                            {hotelItem?.Rooms?.[0]?.PriceBreakUp?.[0]?.RoomRate?.toFixed(
                              2
                            )}
                          </p>

                          {/* Tooltip with Rates */}
                          {showDetails && (
                            <div className="absolute right-0 top-10 w-56 bg-white dark:bg-[#1b2e4b] border border-gray-300 dark:border-[#1b2e4b] shadow-md rounded-lg p-3 z-10">
                              <h6 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                                Rates Breakdown:
                              </h6>
                              {hotelItem?.Rooms?.[0]?.DayRates?.[0]?.map(
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
                        <div className="border-b border-gray-300 dark:border-[#1b2e4b] py-2 flex justify-between">
                          <p className="text-sm text-gray-700 dark:text-white-light">
                            <strong>Management Fees:</strong>
                          </p>
                          <p className="text-sm text-gray-700 dark:text-white-light font-semibold">
                            - ₹
                            {hotelItem?.Rooms?.[0]?.PriceBreakUp?.[0]?.AgentCommission?.toFixed(
                              2
                            )}
                          </p>
                        </div>

                        {/* Tax Amount */}
                        <div className="border-b border-gray-300 dark:border-[#1b2e4b] py-2 flex justify-between items-center relative">
                          <div className="flex  gap-1">
                            <p className="text-sm text-gray-700 dark:text-white-light flex items-center gap-2">
                              <strong>Tax Amount:</strong>
                            </p>
                            <img
                              src="../img/i_icon.svg"
                              className="w-5 h-5 cursor-pointer"
                              onMouseEnter={() => setShowTaxDetails(true)}
                              onMouseLeave={() => setShowTaxDetails(false)}
                            />
                          </div>
                          <p className="text-sm text-gray-700 dark:text-white-light font-semibold">
                            ₹{hotelItem?.Rooms?.[0]?.TotalTax.toFixed(2)}
                          </p>

                          {/* Tax Breakdown Tooltip */}
                          {showTaxDetails && (
                            <div className="absolute right-0 top-10 w-56 bg-white dark:bg-[#1b2e4b] border border-gray-300 dark:border-[#1b2e4b] shadow-md rounded-lg p-3 z-10">
                              <h6 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                                Tax Breakdown:
                              </h6>
                              {hotelItem?.Rooms?.[0]?.PriceBreakUp?.[0]?.TaxBreakup?.map(
                                (tax, idx) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between text-xs text-gray-700 dark:text-white-light"
                                  >
                                    <p>
                                      {tax.TaxType} ({tax.TaxPercentage}%):
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
                        <div className="py-2 flex justify-between">
                          <p className="text-sm text-gray-700 dark:text-white-light">
                            <strong>Total Amount:</strong>
                          </p>
                          <p className="text-sm text-gray-700 dark:text-white-light font-semibold">
                            ₹{hotelItem?.Rooms?.[0]?.TotalFare}
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
          ))}
        </>
      )}
    </div>
  );
};
export default HotelBooking;
