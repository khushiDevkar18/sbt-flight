import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const SearchBus = () => {
  const location = useLocation();
  const { searchHeader, busResults } = location.state || {};
  const [results, setResults] = useState(busResults);
  const [header, setHeader] = useState(searchHeader);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  console.log(busResults);
  console.log(searchHeader);
  const reSearch = async () => {
    try {
      setIsLoading(true);
      const formData = new URLSearchParams();
      formData.append("DateOfJourney", header.DateOfJourney);
      formData.append("OriginId", header.FromCity.CityId);
      formData.append("DestinationId", header.ToCity.CityId);

      const response = await fetch(
        "https://demo.fleet247.in/api/tbo_bus/searchBus",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success === "true") {
        setResults(data);
        setError("");
      } else {
        setError("No buses found");
      }
    } catch (err) {
      setError("Error fetching buses");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!header || !results) {
      setError("No search data found.");
    }
  }, [header, results]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cityListBus, setCityListBus] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);
  const [toSearchTerm, setToSearchTerm] = useState("");
  const [toCityList, setToCityList] = useState([]);
  const [filteredToCities, setFilteredToCities] = useState([]);
  const [isToLoading, setIsToLoading] = useState(false);
  const [toError, setToError] = useState("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const selectedDate = new Date(header.DateOfJourney);

  const fetchCitiesBus = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        "https://demo.fleet247.in/api/tbo_bus/getBusCityList",
        {
          method: "POST",
          headers: {
            Origin: "*",
          },
          // body: JSON.stringify({
          //   TokenId: "6f393c10-615e-4420-943a-0ca6a50dab0",
          //   IpAddress: "27.107.132.171",
          //   ClientId: "ApiIntegrationNew",
          // }),
        }
      );

      const data = await response.json();
      if (data.Status === 1 && Array.isArray(data.BusCities)) {
        setCityListBus(data.BusCities);
        setFilteredCities(data.BusCities);
        setToCityList(data.BusCities);
        setFilteredToCities(data.BusCities);
      } else {
        setError("Failed to fetch cities.");
      }
    } catch (err) {
      setError("Error fetching city list.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCitiesBus();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = cityListBus.filter((city) =>
        city.CityName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(cityListBus);
    }
  }, [searchTerm, cityListBus]);

  const handleCitySelect = (city) => {
    setHeader((prev) => ({
      ...prev,
      FromCity: city,
    }));
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const handleInputClick = () => {
    setIsDropdownOpen(true);
    setSearchTerm("");
  };
  useEffect(() => {
    if (toSearchTerm) {
      const filtered = toCityList.filter((city) =>
        city.CityName.toLowerCase().includes(toSearchTerm.toLowerCase())
      );
      setFilteredToCities(filtered);
    } else {
      setFilteredToCities(toCityList);
    }
  }, [toSearchTerm, toCityList]);

  const handleToCitySelect = (city) => {
    setHeader((prev) => ({
      ...prev,
      ToCity: city,
    }));
    setIsToDropdownOpen(false);
    setToSearchTerm("");
  };

  const handleToInputClick = () => {
    setIsToDropdownOpen(true);
    setToSearchTerm("");
  };
  const handleDateChange = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setHeader((prev) => ({
      ...prev,
      DateOfJourney: formattedDate,
    }));
    setIsDatePickerOpen(false);
  };

  const formatDisplayDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };
  const formatTime = (date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const traceID = busResults?.data?.BusSearchResult?.TraceId;
  
  const [activeResultIndex, setActiveResultIndex] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const formatTimes = (timeStr) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const [boardingPoints, setBoardingPoints] = useState([]);
  const [droppingPoints, setDroppingPoints] = useState([]);
  const [selectedLayout, setSelectedLayout] = useState({
    resultIndex: null,
    html: "",
    seatDetails: []
  });
  
  const handleSeatLayout = async (resultIndex) => {
    try {
      const formData = new URLSearchParams();
      formData.append("ResultIndex", resultIndex);
      formData.append("TraceId", traceID);
      formData.append("TokenId", "e3c6172f-fef3-47f3-9e7f-536ec33e7ab9");
  
      const response = await fetch(`https://demo.fleet247.in/api/tbo_bus/GetBusSeatLayOut`, {
        method: "POST",
        headers: {
          Origin: "*",
        },
        body: formData,
      });
  
      const data = await response.json();
  
      if (data.success === "true") {
        const html = data.data.GetBusSeatLayOutResult.SeatLayoutDetails.HTMLLayout;
        const seatDetails = data.data.GetBusSeatLayOutResult.SeatLayoutDetails.SeatLayout.SeatDetails.flat();
        setSelectedLayout({ resultIndex, html, seatDetails });
      } else {
        const errorMsg = data.Error?.ErrorMessage || "Failed to fetch seat layout";
        alert(errorMsg);
      }
    } catch (err) {
      console.error("Error fetching seat layout:", err);
      alert("Network error occurred while fetching seat layout");
    }
  };
  
  const handleLocation = async (resultIndex) => {
    if (activeResultIndex === resultIndex) {
      setActiveResultIndex(null);
      setHasFetched(false);
      return;
    }

    try {
      setActiveResultIndex(resultIndex);

      const formData = new URLSearchParams();
      formData.append("ResultIndex", resultIndex);
      formData.append("TraceId", traceID);
      formData.append("TokenId", "e3c6172f-fef3-47f3-9e7f-536ec33e7ab9");

      const response = await fetch(
        `https://demo.fleet247.in/api/tbo_bus/GetBoardingPointDetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      const data = await response.json();

      if (data.success === "true") {
        const result = data.data.GetBusRouteDetailResult;
        setBoardingPoints(result.BoardingPointsDetails || []);
        setDroppingPoints(result.DroppingPointsDetails || []);
        setHasFetched(true);
      } else {
        alert(data.Error?.ErrorMessage || "Failed to fetch data");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Network error occurred");
    }
  };

  const [showAllDropPoints, setShowAllDropPoints] = useState(false);

  const allDropPoints =
    results?.data?.BusSearchResult?.BusResults?.flatMap((bus) =>
      bus.DroppingPointsDetails?.map((point) => ({
        ...point,
        busId: bus.BusId,
      }))
    ) || [];

  const visibleDropPoints = showAllDropPoints
    ? allDropPoints
    : allDropPoints.slice(0, 3);

  const [showAllPickupPoints, setShowAllPickupPoints] = useState(false);

  const allPickupPoints =
    results?.data?.BusSearchResult?.BusResults?.flatMap((bus) =>
      bus.BoardingPointsDetails?.map((point) => ({
        ...point,
        busId: bus.BusId,
      }))
    ) || [];

  const visiblePickupPoints = showAllPickupPoints
    ? allPickupPoints
    : allPickupPoints.slice(0, 3);

  const [showAllTravellers, setShowAllTravellers] = useState(false);

  const allTravellers =
    results?.data?.BusSearchResult?.BusResults?.map(
      (bus) => bus.TravelName
    )?.filter((name, index, self) => self.indexOf(name) === index) || [];

  const visibleTravellers = showAllTravellers
    ? allTravellers
    : allTravellers.slice(0, 3);

  const getOperatorCount = (name) => {
    return (
      results?.data?.BusSearchResult?.BusResults?.filter(
        (bus) => bus.TravelName === name
      ).length || 0
    );
  };

  const [activeCancellationBusId, setActiveCancellationBusId] = useState(null);

const toggleCancellation = (resultIndex) => {
  setActiveCancellationBusId(prev => prev === resultIndex ? null : resultIndex);
};
  
  const formatCharge = (policy) => {
    if (policy.CancellationChargeType === 2) {
      return `${policy.CancellationCharge}%`;
    }
    return `${policy.CancellationCharge} INR`;
  };

  // const getChargeTypeText = (type) => {
  //   switch(type) {
  //     case 1: return 'Fixed Amount';
  //     case 2: return 'Percentage';
  //     case 3: return 'Per Night';
  //     default: return 'Unknown';
  //   }
  // };
  const [filters, setFilters] = useState({
    ac: null,
    seatType: null,
    singleSeater: false,
    pickupPoints: [],
    dropPoints: [],
    pickupTime: null,
    dropTime: null,
    operators: [],
  });
  const filteredBuses = results?.data?.BusSearchResult?.BusResults?.filter(bus => {
    // AC filter
    if (filters.ac !== null) {
      const isAC = bus.BusType.toLowerCase().includes('ac');
      if (filters.ac && !isAC) return false;
      if (!filters.ac && isAC) return false;
    }
    
    // Seat type filter
    if (filters.seatType !== null) {
      const isSleeper = bus.BusType.toLowerCase().includes('sleeper');
      if (filters.seatType === 'sleeper' && !isSleeper) return false;
      if (filters.seatType === 'seater' && isSleeper) return false;
    }
    
    // Single seater filter
    if (filters.singleSeater && bus.WindowSeats === 0) return false;
    
    if (filters.pickupPoints.length > 0) {
      const hasSelectedPickup = bus.BoardingPoints?.some(point => 
        filters.pickupPoints.includes(point.CityPointId)
      );
      if (!hasSelectedPickup) return false;
    }
    
    // Drop points filter
    if (filters.dropPoints.length > 0) {
      const hasSelectedDrop = bus.DroppingPoints?.some(point => 
        filters.dropPoints.includes(point.CityPointId)
      );
      if (!hasSelectedDrop) return false;
    }
    // Pickup time filter
    if (filters.pickupTime) {
      const departureHour = new Date(bus.DepartureTime).getHours();
      let timeMatch = false;
      
      if (filters.pickupTime === 'morning' && departureHour >= 6 && departureHour < 11) {
        timeMatch = true;
      } else if (filters.pickupTime === 'afternoon' && departureHour >= 11 && departureHour < 18) {
        timeMatch = true;
      } else if (filters.pickupTime === 'evening' && departureHour >= 18 && departureHour < 23) {
        timeMatch = true;
      } else if (filters.pickupTime === 'night' && (departureHour >= 23 || departureHour < 6)) {
        timeMatch = true;
      }
      
      if (!timeMatch) return false;
    }
    
    // Drop time filter
    if (filters.dropTime) {
      const arrivalHour = new Date(bus.ArrivalTime).getHours();
      let timeMatch = false;
      
      if (filters.dropTime === 'morning' && arrivalHour >= 6 && arrivalHour < 11) {
        timeMatch = true;
      } else if (filters.dropTime === 'afternoon' && arrivalHour >= 11 && arrivalHour < 18) {
        timeMatch = true;
      } else if (filters.dropTime === 'evening' && arrivalHour >= 18 && arrivalHour < 23) {
        timeMatch = true;
      } else if (filters.dropTime === 'night' && (arrivalHour >= 23 || arrivalHour < 6)) {
        timeMatch = true;
      }
      
      if (!timeMatch) return false;
    }
    
    // Operators filter
    if (filters.operators.length > 0 && !filters.operators.includes(bus.TravelName)) {
      return false;
    }
    
    return true;
  });
  const renderSeat = (seat) => {
    const isSelected = selectedLayout.selectedSeats?.some(s => s.SeatIndex === seat.SeatIndex);
    let seatClass = "seat";
    if (seat.IsBooked) seatClass += " booked";
    else if (seat.IsLadiesSeat) seatClass += " ladies";
    else if (isSelected) seatClass += " selected";

    return (
      <div
        key={seat.SeatIndex}
        className={seatClass}
        // onClick={() => !seat.IsBooked && handleSeatSelect(seat)}
      >
        <div className="seat-handle" />
      </div>
    );
  };
  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

 // Corrected toggle functions
const togglePickupPoint = (pointId) => {
  setFilters(prev => {
    // Check if the point is already selected
    const isSelected = prev.pickupPoints.includes(pointId);
    
    // If it's selected, remove it
    if (isSelected) {
      return {
        ...prev,
        pickupPoints: prev.pickupPoints.filter(id => id !== pointId)
      };
    }
    // If not selected, add it
    else {
      return {
        ...prev,
        pickupPoints: [...prev.pickupPoints, pointId]
      };
    }
  });
};

const toggleDropPoint = (pointId) => {
  setFilters(prev => {
    // Check if the point is already selected
    const isSelected = prev.dropPoints.includes(pointId);
    
    // If it's selected, remove it
    if (isSelected) {
      return {
        ...prev,
        dropPoints: prev.dropPoints.filter(id => id !== pointId)
      };
    }
    // If not selected, add it
    else {
      return {
        ...prev,
        dropPoints: [...prev.dropPoints, pointId]
      };
    }
  });
};

  const toggleOperator = (operator) => {
    setFilters(prev => {
      const newOperators = prev.operators.includes(operator)
        ? prev.operators.filter(op => op !== operator)
        : [...prev.operators, operator];
      
      return {
        ...prev,
        operators: newOperators
      };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      ac: null,
      seatType: null,
      singleSeater: false,
      pickupPoints: [],
      dropPoints: [],
      pickupTime: null,
      dropTime: null,
      operators: [],
    });
  };
//   console.log('Selected pickup points:', filters.pickupPoints);
// console.log('Selected drop points:', filters.dropPoints);
const toggleSeatSelection = (seat) => {
  if (!seat?.SeatStatus) return;

  setSelectedLayout(prev => {
    const isSelected = prev.selectedSeats?.some(s => s?.SeatIndex === seat?.SeatIndex) || false;
    
    if (isSelected) {
      return {
        ...prev,
        selectedSeats: prev.selectedSeats?.filter(s => s?.SeatIndex !== seat?.SeatIndex) || []
      };
    } else {
      return {
        ...prev,
        selectedSeats: [...(prev.selectedSeats || []), seat]
      };
    }
  });
};

const calculateTotal = () => {
  return selectedLayout.selectedSeats?.reduce((sum, seat) => sum + (seat?.SeatFare || 0), 0) || 0;
};

const availableSeatsCount = selectedLayout.seatDetails?.filter(seat => seat?.SeatStatus).length || 0;


  return (
    <div>
      <header className="search-bar2" id="widgetHeader">
        <form onSubmit={reSearch}>
          <div id="search-widget" className="hsw v2">
            <div className="hsw_inner px-2">
              <div className="hsw_inputBox tripTypeWrapper grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 md:gap-4">
                <div className="Cab-form-box col-span-1 md:col-span-3 lg:col-span-1 relative">
                  <div className="flex gap-2">
                    <h6 className="text-xs hotel-form-text-color">From</h6>
                    <img
                      src="../img/downarrow.svg"
                      className="w-3 h-4 cursor-pointer"
                      alt="Dropdown"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    />
                  </div>

                  <div className="hotel-city-name-2 relative">
                    <input
                      type="text"
                      placeholder="Search City"
                      value={
                        isDropdownOpen ? searchTerm : header.FromCity.CityName
                      }
                      className="font-semibold hotel-city w-full"
                      onClick={handleInputClick}
                      onChange={(e) =>
                        isDropdownOpen && setSearchTerm(e.target.value)
                      }
                      readOnly={!isDropdownOpen}
                    />

                    {isDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 overflow-auto">
                        {isLoading ? (
                          <div className="p-2 text-center">Loading...</div>
                        ) : error ? (
                          <div className="p-2 text-red-500">{error}</div>
                        ) : filteredCities.length === 0 ? (
                          <div className="p-2 text-gray-500">
                            No cities found
                          </div>
                        ) : (
                          filteredCities.map((city) => (
                            <div
                              key={city.CityId}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleCitySelect(city)}
                            >
                              {city.CityName}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="Cab-form-box col-span-1 md:col-span-3 lg:col-span-1 relative">
                  <div className="flex gap-2">
                    <h6 className="text-xs hotel-form-text-color">To</h6>
                    <img
                      src="../img/downarrow.svg"
                      className="w-3 h-4 cursor-pointer"
                      alt="Dropdown"
                      onClick={() => setIsToDropdownOpen(!isToDropdownOpen)}
                    />
                  </div>

                  <div className="hotel-city-name-2 relative">
                    <input
                      type="text"
                      placeholder="Destination City"
                      value={
                        isToDropdownOpen
                          ? toSearchTerm
                          : header.ToCity?.CityName || ""
                      }
                      className="font-semibold hotel-city w-full"
                      onClick={handleToInputClick}
                      onChange={(e) =>
                        isToDropdownOpen && setToSearchTerm(e.target.value)
                      }
                      readOnly={!isToDropdownOpen}
                    />

                    {isToDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 overflow-auto">
                        {isToLoading ? (
                          <div className="p-2 text-center">
                            Loading destinations...
                          </div>
                        ) : toError ? (
                          <div className="p-2 text-red-500">{toError}</div>
                        ) : filteredToCities.length === 0 ? (
                          <div className="p-2 text-gray-500">
                            No destinations found
                          </div>
                        ) : (
                          filteredToCities.map((city) => (
                            <div
                              key={city.CityId}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleToCitySelect(city)}
                            >
                              {city.CityName}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="Cab-form-box col-span-1">
                  <div className="flex gap-2">
                    <h6 className="text-xs hotel-form-text-color">Depart</h6>
                    <img
                      src="../img/downarrow.svg"
                      className="w-3 h-4 cursor-pointer"
                      alt="Dropdown"
                      onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    />
                  </div>

                  <div className="hotel-city-name-2 relative">
                    <input
                      type="text"
                      className="font-semibold hotel-city w-full cursor-pointer"
                      value={formatDisplayDate(header.DateOfJourney)}
                      onClick={() => setIsDatePickerOpen(true)}
                      readOnly
                    />

                    {isDatePickerOpen && (
                      <div className="absolute z-10 mt-1">
                        <DatePicker
                          selected={selectedDate}
                          onChange={handleDateChange}
                          dateFormat="dd/MM/yyyy"
                          minDate={new Date()}
                          inline
                          onClickOutside={() => setIsDatePickerOpen(false)}
                          onSelect={() => setIsDatePickerOpen(false)} // Close when date is selected
                        />
                      </div>
                    )}
                  </div>
                </div>

                <button className="search-buttonn rounded-lg col-span-1 md:col-span-3 lg:col-span-1 h-[50px] mt-auto">
                  Search
                </button>
              </div>
            </div>
          </div>
        </form>
      </header>
      <div className="card-container ">
        <div className="flex flex-col md:flex-row px-3 gap-3">
        <div className="p-3 bg-white rounded-xl shadow-md border max-w-xs  overflow-y-auto sticky top-4">
  <div className="space-y-6 text-sm text-gray-800">
    <div className="flex justify-between items-center font-semibold text-base pb-4 border-b sticky top-0 bg-white z-10">
      <span>Filters</span>
      <button 
        className={`text-xs ${Object.values(filters).some(val => 
          (Array.isArray(val) && val.length > 0) || 
          (typeof val === 'boolean' && val) || 
          (val !== null && val !== undefined)
          ? 'text-blue-600 font-medium' : 'text-gray-400'
   ) } hover:underline`}
        onClick={clearAllFilters}
      >
        CLEAR ALL
      </button>
    </div>

    {[
      /* AC Filter */
      {
        title: "AC",
        key: 'ac',
        content: (
          <div className="flex gap-2">
            <button 
              className={`flex-1 border rounded px-3 py-2 flex items-center justify-center gap-1 hover:bg-gray-100 text-xs ${
                filters.ac === false ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => handleFilterChange('ac', false)}
            >
              <img src="./img/AC-09.svg" className="w-7 h-7"/>AC
            </button>
            <button 
              className={`flex-1 border rounded px-3 py-2 flex items-center justify-center gap-1 hover:bg-gray-100 text-xs ${
                filters.ac === true ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => handleFilterChange('ac', true)}
            >
              <img src="./img/Non_AC-10.svg" className="w-7 h-7"/> Non AC
            </button>
          </div>
        ),
      },

      /* Seat Type */
      {
        title: "Seat type",
        key: 'seatType',
        content: (
          <div className="flex gap-2">
            <button 
              className={`flex-1 border rounded px-3 py-2 flex items-center justify-center gap-1 hover:bg-gray-100 text-xs ${
                filters.seatType === 'sleeper' ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => handleFilterChange('seatType', 'sleeper')}
            >
             <img src="./img/Sleeper-12.svg" className="w-7 h-7"/>Sleeper
            </button>
            <button 
              className={`flex-1 border rounded px-3 py-2 flex items-center justify-center gap-1 hover:bg-gray-100 text-xs ${
                filters.seatType === 'seater' ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => handleFilterChange('seatType', 'seater')}
            >
             <img src="./img/Seater-11.svg" className="w-7 h-7"/>    Seater
            </button>
          </div>
        ),
      },

      /* Single Seater */
      {
        title: "Single Seater/Sleeper",
        key: 'singleSeater',
        content: (
          <label className="flex items-start gap-2">
            <input 
              type="checkbox" 
              className="mt-1" 
              checked={filters.singleSeater}
              onChange={(e) => handleFilterChange('singleSeater', e.target.checked)}
            />
            <div>
              <span className="font-medium">Single</span>
              <div className="text-xs text-gray-500">
                Separate single window seats
              </div>
            </div>
            <span className="ml-auto text-gray-400">
              ({results?.data?.BusSearchResult?.BusResults?.filter(bus => bus.WindowSeats > 0).length || 0})
            </span>
          </label>
        ),
      },

      /* Pickup Point */
      {
        title: `Pick up point - ${results.data.BusSearchResult.Origin}`,
        key: 'pickupPoints',
        hasSearch: true,
        content: (
          <>
            <div className="space-y-2">
              {visiblePickupPoints.map((point, index) => (
                <label
                  key={`${point.busId}-${point.CityPointId || index}`}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={filters.pickupPoints.includes(point.CityPointId)}
                      onChange={() => togglePickupPoint(point.CityPointId)}
                    />
                    <span className="text-xs">
                      {point.CityPointName} - {point.CityPointLocation}
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs">
                    ({results?.data?.BusSearchResult?.BusResults?.filter(
                      bus => bus.BoardingPoints?.some(p => p.CityPointId === point.CityPointId)
                    ).length || 0})
                  </span>
                </label>
              ))}
            </div>
            {allPickupPoints.length > 3 && (
              <button
                className="text-xs text-blue-600 hover:underline mt-2"
                onClick={() => setShowAllPickupPoints(!showAllPickupPoints)}
              >
                {showAllPickupPoints ? "SHOW LESS" : `SHOW ALL (${allPickupPoints.length - 3})`}
              </button>
            )}
          </>
        ),
      },

      /* Pick up time */
      {
        title: `Pick up time - ${results.data.BusSearchResult.Origin}`,
        key: 'pickupTime',
        content: (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button 
              className={`border rounded py-2 flex items-center justify-center gap-2 hover:bg-gray-100 ${
                filters.pickupTime === 'morning' ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => handleFilterChange('pickupTime', 'morning')}
            >
              <img src="./img/Sunrise-05.svg" className="w-7 h-7"/> 6 AM to 11 AM
            </button>
            <button 
              className={`border rounded py-2 flex items-center justify-center gap-2 hover:bg-gray-100 ${
                filters.pickupTime === 'afternoon' ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => handleFilterChange('pickupTime', 'afternoon')}
            >
              <img src="./img/Midday-07.svg" className="w-7 h-7"/> 11 AM to 6 PM
            </button>
            <button 
              className={`border rounded py-2 flex items-center justify-center gap-2 hover:bg-gray-100 ${
                filters.pickupTime === 'evening' ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => handleFilterChange('pickupTime', 'evening')}
            >
              <img src="./img/Sunset-06.svg" className="w-7 h-7"/> 6 PM to 11 PM
            </button>
            <button 
              className={`border rounded py-2 flex items-center justify-center gap-2 hover:bg-gray-100 ${
                filters.pickupTime === 'night' ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => handleFilterChange('pickupTime', 'night')}
            >
              <img src="./img/Night-08.svg" className="w-7 h-7"/> 11 PM to 6 AM
            </button>
          </div>
        ),
      },

      /* Travel Operators */
      {
        title: "Travel Operators",
        key: 'operators',
        content: (
          <>
            <div className="space-y-2">
              {visibleTravellers.map((name, index) => (
                <label
                  key={`${name}-${index}`}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={filters.operators.includes(name)}
                      onChange={() => toggleOperator(name)}
                    />
                    <span className="text-xs">{name}</span>
                  </div>
                  <span className="text-gray-400 text-xs">
                    ({getOperatorCount(name)})
                  </span>
                </label>
              ))}
            </div>
            {allTravellers.length > 3 && (
              <button
                className="text-xs text-blue-600 hover:underline mt-2"
                onClick={() => setShowAllTravellers(!showAllTravellers)}
              >
                {showAllTravellers ? "SHOW LESS" : `SHOW ALL (${allTravellers.length - 3})`}
              </button>
            )}
          </>
        ),
      },

      /* Drop Point */
      {
        title: `Drop point - ${results.data.BusSearchResult.Destination}`,
        key: 'dropPoints',
        content: (
          <>
            <div className="space-y-2">
              {visibleDropPoints.map((point, index) => (
                <label
                  key={`${point.busId}-${point.CityPointId || index}`}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={filters.dropPoints.includes(point.CityPointId)}
                      onChange={() => toggleDropPoint(point.CityPointId)}
                    />
                    <span className="text-xs">
                      {point.CityPointName} - {point.CityPointLocation}
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs">
                    ({results?.data?.BusSearchResult?.BusResults?.filter(
                      bus => bus.DroppingPoints?.some(p => p.CityPointId === point.CityPointId)
                    ).length || 0})
                  </span>
                </label>
              ))}
            </div>
            {allDropPoints.length > 3 && (
              <button
                className="text-xs text-blue-600 hover:underline mt-2"
                onClick={() => setShowAllDropPoints(!showAllDropPoints)}
              >
                {showAllDropPoints ? "SHOW LESS" : `SHOW ALL (${allDropPoints.length - 3})`}
              </button>
            )}
          </>
        ),
      },

      /* Drop time */
      {
        title: `Drop time - ${results.data.BusSearchResult.Destination}`,
        key: 'dropTime',
        content: (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button 
              className={`border rounded py-2 flex items-center justify-center gap-2 hover:bg-gray-100 ${
                filters.dropTime === 'morning' ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => handleFilterChange('dropTime', 'morning')}
            >
              <img src="./img/Sunrise-05.svg" className="w-7 h-7"/> 6 AM to 11 AM
            </button>
            <button 
              className={`border rounded py-2 flex items-center justify-center gap-2 hover:bg-gray-100 ${
                filters.dropTime === 'afternoon' ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => handleFilterChange('dropTime', 'afternoon')}
            >
              <img src="./img/Midday-07.svg" className="w-7 h-7"/> 11 AM to 6 PM
            </button>
            <button 
              className={`border rounded py-2 flex items-center justify-center gap-2 hover:bg-gray-100 ${
                filters.dropTime === 'evening' ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => handleFilterChange('dropTime', 'evening')}
            >
              <img src="./img/Sunset-06.svg" className="w-7 h-7"/> 6 PM to 11 PM
            </button>
            <button 
              className={`border rounded py-2 flex items-center justify-center gap-2 hover:bg-gray-100 ${
                filters.dropTime === 'night' ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => handleFilterChange('dropTime', 'night')}
            >
              <img src="./img/Night-08.svg" className="w-7 h-7"/> 11 PM to 6 AM
            </button>
          </div>
        ),
      },
    ].map((section, index) => {
      const isFilterActive = 
        (Array.isArray(filters[section.key]) && filters[section.key].length > 0) ||
        (typeof filters[section.key] === 'boolean' && filters[section.key]) ||
        (filters[section.key] !== null && filters[section.key] !== undefined);
      
      return (
        <div
          key={index}
          className={`pb-4 ${index < 7 ? "border-b" : ""}`}
        >
          <div className="flex justify-between items-center font-medium mb-2">
            <span className="text-sm">{section.title}</span>
            <button 
              className={`text-xs ${
                isFilterActive ? 'text-blue-600 font-medium' : 'text-gray-400'
              } hover:underline`}
              onClick={() => {
                // Clear specific filter
                if (section.key === 'pickupPoints' || section.key === 'dropPoints') {
                  handleFilterChange(section.key, []);
                } else if (section.key === 'singleSeater') {
                  handleFilterChange(section.key, false);
                } else {
                  handleFilterChange(section.key, null);
                }
              }}
            >
              CLEAR
            </button>
          </div>

          {section.hasSearch && (
            <input
              type="text"
              placeholder="Search"
              className="w-full border rounded px-3 py-2 text-xs focus:outline-none focus:ring focus:ring-blue-200 mb-2"
            />
          )}

          <div className="">{section.content}</div>
        </div>
      );
    })}
  </div>
</div>

          {/* <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {filteredBuses?.length || 0} Buses Found
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <span>Sort by:</span>
            <select className="border rounded px-3 py-1">
              <option>Departure Time</option>
              <option>Arrival Time</option>
              <option>Price (Low to High)</option>
              <option>Price (High to Low)</option>
              <option>Rating</option>
            </select>
          </div>
        </div> */}

        <div className="flex-1 space-y-4">
          {filteredBuses?.length > 0 ? (
            filteredBuses.map((bus, index) => {
              const busData = {
                TravelName: bus?.TravelName || "Unknown Operator",
                BusType: bus?.BusType || "Standard Bus",
                AvailableSeats: bus?.AvailableSeats ?? 0,
                WindowSeats: bus?.WindowSeats ?? 0,
                TotalFare: bus?.BusPrice?.TotalFare ?? 0,
                ResultIndex: bus?.ResultIndex ?? index,
                DepartureTime: bus?.DepartureTime
                  ? new Date(bus.DepartureTime)
                  : null,
                ArrivalTime: bus?.ArrivalTime
                  ? new Date(bus.ArrivalTime)
                  : null,
              };

              let duration = "";
              if (busData.DepartureTime && busData.ArrivalTime) {
                const durationMs =
                  busData.ArrivalTime - busData.DepartureTime;
                const hours = Math.floor(durationMs / (1000 * 60 * 60));
                const mins = Math.floor((durationMs / (1000 * 60)) % 60);
                duration = `${hours}hrs ${mins}mins`;
              }

              return (
                <div key={index} className="w-full">
                  <div className="border rounded-xl shadow-sm hover:shadow-md transition w-full mx-auto p-3">
                    <div className="flex flex-col md:flex-row justify-between items-center border-b pb-4 gap-4">
                      <div className="flex-1">
                        <h2 className="text-lg font-bold">
                          {busData.TravelName}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {busData.BusType}
                        </p>
                      </div>

                      <div className="flex justify-center items-center gap-4 text-center flex-1">
                        {busData.DepartureTime && (
                          <div>
                            <div className="text-lg font-bold">
                              {formatTime(busData.DepartureTime)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(busData.DepartureTime)}
                            </div>
                          </div>
                        )}
                        <div className="text-sm text-gray-500">——</div>
                        <div className="text-sm text-gray-700">
                          {duration}
                        </div>
                        <div className="text-sm text-gray-500">——</div>
                        {busData.ArrivalTime && (
                          <div>
                            <div className="text-lg font-bold">
                              {formatTime(busData.ArrivalTime)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(busData.ArrivalTime)}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-right flex-1">
                        <div className="text-xl font-bold text-black">
                          ₹ {Math.round(busData.TotalFare)}
                        </div>
                        <div
                          className="text-xs text-gray-800"
                          onClick={() => handleSeatLayout(busData.ResultIndex)}
                        >
                          <span className="text-red-600 font-semibold">
                            {busData.AvailableSeats} Seats Left
                          </span>{" "}
                          | {busData.WindowSeats} Window Seats
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center py-2 text-sm text-gray-700 gap-3">
                      <div className="flex flex-wrap gap-3">
                        <span
                          className="cursor-pointer hover:underline text-xs"
                          onClick={() => handleLocation(busData.ResultIndex)}
                        >
                          Pickups & Drops
                        </span>
                        <span
                          className="cursor-pointer hover:underline text-xs"
                          onClick={() => toggleCancellation(bus.ResultIndex)}
                        >
                          Cancellation
                        </span>
                      </div>

                      <div className="py-0.5">
                        <button 
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700"
                          onClick={() => handleSeatLayout(busData.ResultIndex)}
                        >
                          SELECT SEATS
                        </button>
                      </div>
                    </div>
                    {selectedLayout.resultIndex === busData?.ResultIndex &&
    selectedLayout.seatDetails?.length > 0 && (
      <div className="p-6 bg-gray-50 rounded-lg shadow-md max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select Your Seats</h2>
          <div className="text-sm text-gray-600">
            {availableSeatsCount} seats available
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 mb-6">
          {[
            { className: "bg-white", label: "Available" },
            { className: "bg-gray-400", label: "Booked" },
            { className: "bg-red-300", label: "Ladies Seat" },
            { className: "bg-green-400", label: "Selected" },
          ].map(({ className, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              <div className={`w-6 h-6 border border-gray-400 rounded-sm ${className}`} />
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Lower Deck */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Lower Deck</h3>
          <div className="flex items-start">
            {/* Driver */}
            <div className="mr-4 flex flex-col items-center">
              <div className="text-2xl">🧑‍✈️</div>
              <div className="text-sm mt-1">Driver</div>
            </div>

            {/* Seats */}
            <div className="grid grid-cols-6 gap-2">
              {selectedLayout.seatDetails
                ?.filter(seat => !seat?.IsUpper)
                .map(seat => renderSeat(seat))}
            </div>
          </div>
        </div>

        {/* Upper Deck */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Upper Deck</h3>
          <div className="flex items-start">
            {/* Blank for alignment */}
            <div className="mr-4 w-[40px]" />
            <div className="grid grid-cols-6 gap-2">
              {selectedLayout.seatDetails
                ?.filter(seat => seat?.IsUpper)
                .map(seat => renderSeat(seat))}
            </div>
          </div>
        </div>

        {/* Exit Door */}
        <div className="flex justify-end mb-6">
          <div className="bg-gray-400 w-6 h-10 rounded-sm flex items-center justify-center relative">
            <div className="w-1 h-6 bg-white" />
          </div>
        </div>

        {/* Selection Summary */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Your Selection</h3>
          {selectedLayout.selectedSeats?.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                {selectedLayout.selectedSeats.map(seat => (
                  seat && (
                    <div key={seat.SeatIndex} className="flex justify-between">
                      <span>Seat {seat.SeatName}</span>
                      <span>₹{seat.SeatFare}</span>
                    </div>
                  )
                ))}
              </div>
              <div className="text-right font-semibold text-lg">
                Total: ₹{calculateTotal()}
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-500">No seats selected yet</div>
          )}
        </div>

        {/* Proceed Button */}
        <button
          className={`w-full py-2 rounded-md text-white font-semibold ${
            selectedLayout.selectedSeats?.length
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!selectedLayout.selectedSeats || selectedLayout.selectedSeats.length === 0}
        >
          Proceed to Book
        </button>
      </div>
    )}
  

                    {hasFetched &&
                      activeResultIndex === busData.ResultIndex && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <div>
                            <h2 className="text-sm font-semibold mb-2">
                              Pickup Points
                            </h2>
                            <div className="border rounded p-2 max-h-48 overflow-y-auto">
                              {boardingPoints.map((point, index) => (
                                <div key={index} className="mb-1">
                                  <span className="font-semibold text-xs">
                                    {formatTimes(point.CityPointTime)}
                                  </span>{" "}
                                  <span className="text-xs">
                                    {point.CityPointName.split(",")[0]}
                                  </span>
                                  ,{" "}
                                  <span className="text-xs">
                                    {point.CityPointLocation}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h2 className="text-sm font-semibold mb-2">
                              Drop Points
                            </h2>
                            <div className="border rounded p-2 max-h-48 overflow-y-auto">
                              {droppingPoints.map((point, index) => (
                                <div key={index} className="mb-1 ">
                                  <span className="font-semibold text-xs">
                                    {formatTimes(point.CityPointTime)}
                                  </span>{" "}
                                  <span className="text-xs">
                                    {point.CityPointName.split(",")[0]}
                                  </span>
                                  ,
                                  <span className="text-xs">
                                    {" "}
                                    {point.CityPointLocation}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                    {activeCancellationBusId === bus.ResultIndex && bus.CancellationPolicies && (
                      <div className="mt-3 bg-gray-50 rounded-lg p-2 border border-gray-200 shadow-xs">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-base font-semibold text-gray-800">
                            Cancellation Policy
                          </h4>
                          <button 
                            onClick={() => setActiveCancellationBusId(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        
                        <ul className="space-y-3">
                          {bus.CancellationPolicies.map((policy, index) => (
                            <li key={index} className="p-2 bg-white rounded-md border border-gray-100 shadow-sm">
                              <div className="flex items-start">
                                <div className={`flex-shrink-0 h-5 w-5 rounded-full mt-0.5 ${
                                  policy.CancellationChargeType === 1 ? 'bg-blue-100 text-blue-800' : 
                                  policy.CancellationChargeType === 2 ? 'bg-purple-100 text-purple-800' : 
                                  'bg-green-100 text-green-800'
                                } flex items-center justify-center`}>
                                  <span className="text-xs font-medium">
                                    {policy.CancellationChargeType === 1 ? '₹' : 
                                    policy.CancellationChargeType === 2 ? '%' : '🌙'}
                                  </span>
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-800">
                                    {policy.PolicyString} Charges will be  
                                    <span className={`ml-1 font-medium ${
                                      policy.CancellationChargeType === 1 ? 'text-blue-600' : 
                                      policy.CancellationChargeType === 2 ? 'text-purple-600' : 
                                      'text-green-600'
                                    }`}>
                                      {formatCharge(policy)}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>

                        {bus.PartialCancellationAllowed && (
                          <div className="mt-3 flex items-center text-xs text-green-700 bg-green-50 px-3 py-2 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Partial cancellation allowed for this bus
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium text-gray-700">No buses found matching your filters</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters or clear all filters to see more options</p>
              <button 
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={clearAllFilters}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBus;
