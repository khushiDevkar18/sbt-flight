import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { format, parseISO, parse, isValid } from "date-fns";

const SearchCab = () => {
  const [Header, setHeader] = useState(() => {
    return JSON.parse(sessionStorage.getItem("Header_Cab")) || {};
  });

  const Cab = JSON.parse(sessionStorage.getItem("SearchCab")) || {};
  const [selectedCabTypes, setSelectedCabTypes] = useState([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);

  const navigate = useNavigate();
  const handleCheckboxChange = (value, selectedItems, setSelectedItems) => {
    if (selectedItems.includes(value)) {
      setSelectedItems(selectedItems.filter((item) => item !== value));
    } else {
      setSelectedItems([...selectedItems, value]);
    }
  };
  // console.log(selectedFuelTypes);
  const filteredCabs = Cab?.rates?.filter((item) => {
    const cabTypeMatch =
      selectedCabTypes.length === 0 ||
      selectedCabTypes
        .map((type) => type.toLowerCase())
        .includes(item.vehicle.type.toLowerCase());

    const fuelTypeMatch =
      selectedFuelTypes.length === 0 ||
      selectedFuelTypes
        .map((type) => type.toLowerCase())
        .includes(item.vehicle.fuel_type.toLowerCase());

    const modelMatch =
      selectedModels.length === 0 ||
      selectedModels
        .map((model) => model.toLowerCase())
        .includes(item.vehicle.description.toLowerCase());

    return cabTypeMatch && fuelTypeMatch && modelMatch;
  });
  const cabTypeCounts = Cab?.rates?.reduce((acc, item) => {
    const type = item.vehicle.type.toUpperCase();
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const cabTypeOptions = Array.from(
    new Set(Cab?.rates?.map((item) => item.vehicle.type.toUpperCase()))
  );
  const cabFuelCounts = Cab?.rates?.reduce((acc, item) => {
    const type = item.vehicle.fuel_type.toUpperCase();
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const cabFuelOptions = Array.from(
    new Set(Cab?.rates?.map((item) => item.vehicle.fuel_type.toUpperCase()))
  );
  const cabModelCounts = Cab?.rates?.reduce((acc, item) => {
    const type = item.vehicle.description.toUpperCase();
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const cabModelOptions = Array.from(
    new Set(Cab?.rates?.map((item) => item.vehicle.description.toUpperCase()))
  );
  // Build a mapping from Cab Type to Cab Models.
  const cabTypeToModelsMap = Cab?.rates?.reduce((acc, item) => {
    const type = item.vehicle.type.toUpperCase();
    const model = item.vehicle.description;
    if (!acc[type]) acc[type] = new Set();
    acc[type].add(model);
    return acc;
  }, {});
  const cabModelToTypeMap = {};
  if (cabTypeToModelsMap) {
    Object.entries(cabTypeToModelsMap).forEach(([type, modelsSet]) => {
      modelsSet.forEach((model) => {
        if (!cabModelToTypeMap[model.toUpperCase()]) {
          cabModelToTypeMap[model.toUpperCase()] = new Set();
        }
        cabModelToTypeMap[model.toUpperCase()].add(type);
      });
    });
  }
  const isCabModelEnabled = (modelLabel) => {
    // If no cab type is selected, enable all cab models.
    if (selectedCabTypes.length === 0) return true;

    // Build a set of allowed model names (all in uppercase)
    const allowedModels = new Set();
    selectedCabTypes.forEach((type) => {
      const modelsSet = cabTypeToModelsMap[type.toUpperCase()];
      if (modelsSet) {
        modelsSet.forEach((m) => allowedModels.add(m.toUpperCase()));
      }
    });

    // Compare the option's label after converting to uppercase
    return allowedModels.has(modelLabel.toUpperCase());
  };

  const isCabTypeEnabled = (typeLabel) => {
    if (selectedModels.length === 0) return true;
    const allowedTypes = new Set();
    selectedModels.forEach((model) => {
      const typesSet = cabModelToTypeMap[model.toUpperCase()];
      if (typesSet) {
        typesSet.forEach((t) => allowedTypes.add(t));
      }
    });
    return allowedTypes.has(typeLabel);
  };
  const tripTypes = [
    "Local",
    "Round Trip (Outstation)",
    "MultiCity (Outstation)",
    "Oneway",
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selectType, setSelectType] = useState(Header.selectType || "");
  const handleSelect = (type) => {
    setSelectType(type);
    setHeader((prev) => ({ ...prev, selectType: type })); // Update both if needed
    setIsOpen(false);
  };

  const [showDropdown, setShowDropdown] = useState(false);
  const [allCities, setAllCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredCitiesDrop, setFilteredCitiesDrop] = useState([]);
  const [pickupCity, setPickupCity] = useState(Header.pickup_city.city_name);
  const [selectedDropCity, setSelectedDropCity] = useState(Header.Drop_city);
  const [isLoading, setIsLoading] = useState(false);

  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const [showDropDropdown, setShowDropDropdown] = useState(false);
  const pickupDropdownRef = useRef(null);
  const dropDropdownRef = useRef(null);

  // Fetch all cities for both pickup and drop
  const fetchCities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(
        "https://demo.fleet247.in/api/corporate_apis/v1/getAllCities"
      );
      if (
        response.data?.success === "true" &&
        Array.isArray(response.data.response?.cities)
      ) {
        const citiesData = response.data.response.cities;
        setAllCities(citiesData);
        setFilteredCities(citiesData); // For pickup city list
        setFilteredCitiesDrop(citiesData); // For drop city list
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
      setError("Failed to load cities. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  // console.log(filteredCities);
  const handleInputClick = (type) => {
    if (type === "pickup") {
      setShowPickupDropdown(true);
    } else if (type === "drop") {
      setShowDropDropdown(true);
    }

    if (allCities.length === 0) {
      fetchCities();
    }
  };

  // Handle input change and filter cities
  const handleInputChange = (e, type) => {
    const value = e.target.value;

      if (type === "pickup") {
        setPickupCity(value);
        const filtered = allCities.filter((city) =>
          city.city_name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCities(filtered); // contains full objects
      } else if (type === "drop") {
        setSelectedDropCity(value);
        const filtered = allCities.filter((city) =>
          city.city_name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCitiesDrop(filtered); // contains full objects
      }
  };
  const [selectedPickupCityObject, setSelectedPickupCityObject] = useState(null);
  const [selectedDropCityObject, setSelectedDropCityObject] = useState(null);
  
  const handleCitySelect = (cityObj, type) => {
    if (type === "pickup") {
      setPickupCity(cityObj.city_name);
      setSelectedPickupCityObject(cityObj); // ✅ Save full object
      setShowPickupDropdown(false);
    } else if (type === "drop") {
      setSelectedDropCity(cityObj.city_name);
      setSelectedDropCityObject(cityObj); // ✅ Save full object
      setShowDropDropdown(false);
    }
  };
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickupDropdownRef.current &&
        !pickupDropdownRef.current.contains(event.target)
      ) {
        setShowPickupDropdown(false);
      }

      if (
        dropDropdownRef.current &&
        !dropDropdownRef.current.contains(event.target)
      ) {
        setShowDropDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Helper function to parse pickup date (DD-MM-YYYY -> Date object)
  const parsePickupDate = (dateStr) => {
    if (!dateStr) return new Date();
    const [day, month, year] = dateStr.split("-");
    return new Date(`${year}-${month}-${day}`);
  };

  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickupDate, setPickupDate] = useState(formatDate(Header.pickup_date));
  const [loading, setLoading] = useState(false);
  const [selectedDropDate, setSelectedDropDate] = useState(null);
  const [showDropDatePicker, setShowDropDatePicker] = useState(false);
  const [dropDate, setDropDate] = useState(formatDate(Header.Drop_date || ""));

  const [selectedTime, setSelectedTime] = useState(null);
  const [pickupTime, setPickupTime] = useState(Header.pickup_time);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [stops, setStops] = useState(
    Array.isArray(Header.Cities) ? Header.Cities : []
  );
  console.log(stops);
  const calculateDays = (pickupDateStr, dropDateStr) => {
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split("-").map(Number);
      return new Date(year, month - 1, day);
    };

    const start = parseDate(pickupDateStr);
    const end = parseDate(dropDateStr);

    return Math.round((end - start) / (1000 * 60 * 60 * 24));
  };
  const numberOfDays = calculateDays(pickupDate, dropDate);

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState([]);
  const [showStopModal, setShowStopModal] = useState(false);
  const inputRefs = useRef([]);

  const handleInputChangeCities = (index, value) => {
    const updatedStops = [...stops];
    updatedStops[index] = value;
    setStops(updatedStops);

    setError("");
    if (fieldErrors[index]) {
      const newErrors = [...fieldErrors];
      newErrors[index] = "";
      setFieldErrors(newErrors);
    }
  };

  const handleAddStop = () => {
    if (stops.length >= 5) {
      setError("You can select a maximum of 5 cities");
      return;
    }

    if (validateAllStops()) {
      setStops([...stops, ""]);
      setError("");
      setFieldErrors([...fieldErrors, ""]);
    }
  };

  const handleRemoveStop = (index) => {
    const updatedStops = stops.filter((_, i) => i !== index);
    const updatedErrors = fieldErrors.filter((_, i) => i !== index);
    setStops(updatedStops);
    setFieldErrors(updatedErrors);
    setError("");
  };

  const validateStop = (index) => {
    if (stops[index] && stops[index].trim().length >= 3) {
      return true;
    }

    const newErrors = [...fieldErrors];

    if (!stops[index] || stops[index].trim() === "") {
      newErrors[index] = "City is required";
    } else if (stops[index].length < 3) {
      newErrors[index] = "Enter a valid city name";
    } else {
      newErrors[index] = "";
    }

    setFieldErrors(newErrors);
    return newErrors[index] === "";
  };

  const validateAllStops = () => {
    let isValid = true;
    const newErrors = [];

    stops.forEach((stop, index) => {
      if (!stop || stop.trim() === "") {
        newErrors[index] = "City is required";
        isValid = false;
      } else if (stop.length < 3) {
        newErrors[index] = "Enter a valid city name";
        isValid = false;
      } else {
        newErrors[index] = "";
      }
    });

    setFieldErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    inputRefs.current.forEach((input, index) => {
      if (input && !input.autocomplete) {
        const autocomplete = new window.google.maps.places.Autocomplete(input, {
          types: ["(cities)"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place || !place.formatted_address) {
            setFieldErrors((prev) => {
              const newErrors = [...prev];
              newErrors[index] = "Please select a valid city from suggestions";
              return newErrors;
            });
            return;
          }

          const city = place.formatted_address;
          // Update the stop without triggering validation
          const updatedStops = [...stops];
          updatedStops[index] = city;
          setStops(updatedStops);

          // Clear any existing errors for this field
          setFieldErrors((prev) => {
            const newErrors = [...prev];
            newErrors[index] = "";
            return newErrors;
          });
        });

        input.autocomplete = autocomplete;
      }
    });
  }, [stops.length]);

  // Final Save function with validation
  const handleSaveStops = (e) => {
    e.preventDefault();

    if (!validateAllStops()) {
      setError("Please fix all errors before saving");
      return;
    }

    if (stops.length === 0) {
      setError("At least one stop is required");
      return;
    }

    Header.Cities = [...stops.filter((stop) => stop.trim() !== "")];
    Header.numberOfCities = Header.Cities.length;
    setShowStopModal(false);
  };
  const getDisplayText = () => {
    if (stops.length === 0) {
      return "Add Stops";
    }
    return `${stops.length} Stop${stops.length > 1 ? "s" : ""}`;
  };
  console.log(pickupCity);
  const formatTimeString = (timeStr) => {
    if (!timeStr) return "";

    // If time is in AM/PM format (e.g., "04:15 PM")
    if (timeStr.includes("AM") || timeStr.includes("PM")) {
      const [time, period] = timeStr.split(" ");
      const [hours, minutes] = time.split(":");
      let hours24 = parseInt(hours);
      if (period === "PM" && hours24 < 12) hours24 += 12;
      if (period === "AM" && hours24 === 12) hours24 = 0;
      return `${hours24.toString().padStart(2, "0")}:${minutes}`;
    }

    // Assume it's already in HH:mm format
    return timeStr;
  };
  const handleSearchCab = async (e) => {
    e.preventDefault();

    const parseAndFormatDate = (dateStr) => {
      if (!dateStr) return "";
      try {
        const parts = dateStr.split("-");
        if (parts.length === 3) {
          const [day, month, year] = parts;
          const date = new Date(`${year}-${month}-${day}`);
          if (isNaN(date.getTime())) throw new Error("Invalid date");
          return format(date, "yyyy-MM-dd");
        }
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) throw new Error("Invalid date");
        return format(date, "yyyy-MM-dd");
      } catch (error) {
        console.error("Date formatting error:", error);
        return "";
      }
    };

    const formattedPickupDate = parseAndFormatDate(pickupDate);
    const formattedDropDate = parseAndFormatDate(dropDate);
    const formattedTime = formatTimeString(pickupTime);

    if (!pickupCity) {
      setError("Please select a pickup city");
      return;
    }

    if (
      (selectType === "Oneway" || selectType === "Round Trip (Outstation)") &&
      !selectedDropCity
    ) {
      setError("Please select a drop city");
      return;
    }

    if (!formattedPickupDate) {
      setError("Please select a valid pickup date");
      return;
    }

    if (
      (selectType === "Round Trip (Outstation)" ||
        selectType === "MultiCity (Outstation)") &&
      !formattedDropDate
    ) {
      setError("Please select a valid drop date");
      return;
    }

    const formData = new URLSearchParams();
    formData.append("access_token", "5268d5792d02df568cdf2f8146577eba");
    formData.append("pickup_city", pickupCity);
    formData.append("pickup_time", formattedTime);
    formData.append("pickup_date", formattedPickupDate);
    formData.append("type_of_tour", selectType);

    let Cities = [];
    let SearchCities = [];

    switch (selectType) {
      case "Oneway":
        formData.append("cities", selectedDropCity);
        formData.append("return_date", formattedDropDate);
        formData.append("is_local", "0");
        break;

      case "Round Trip (Outstation)":
        Cities = [pickupCity, selectedDropCity, pickupCity].join(",");
        formData.append("cities", Cities);
        formData.append("return_date", formattedDropDate);
        formData.append("is_local", "0");
        break;

      case "MultiCity (Outstation)":
        if (stops.length > 0) {
          const formatCityName = (location) => {
            const parts = location.split(",");
            return parts[0].trim();
          };

          SearchCities = [
            formatCityName(pickupCity),
            ...stops.filter(Boolean).map((stop) => formatCityName(stop)),
          ];
          formData.append("cities", SearchCities.join(","));
        } else {
          setError("Please add at least one stop for MultiCity trip");
          return;
        }
        formData.append("return_date", formattedDropDate);
        formData.append("is_local", "0");
        break;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "https://demo.fleet247.in/api/corporate_apis/v1/searchTaxismod",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success === "false") {
        navigate("/CabResultNotFound");
      } else if (data.success === "true") {
        const header = {
          pickup_city: selectedPickupCityObject,
          pickup_date: formattedPickupDate,
          ...(Cities.length > 0 && { Cities }),
          ...(SearchCities.length > 0 && { SearchCities }),
          numberOfCities:
            Cities.length > 0 ? Cities.split(",").length : SearchCities.length,
          Drop_city: selectedDropCityObject,
          Drop_date: formattedDropDate,
          pickup_time: formattedTime,
          selectType: selectType,
        };

        sessionStorage.setItem("SearchCab", JSON.stringify(data.response));
        sessionStorage.setItem("Header_Cab", JSON.stringify(header));

        // ✅ Set Header state so component updates
        setHeader(header);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Optional: useEffect if you want to act when Header changes
  useEffect(() => {
    // console.log("Header updated:", Header);
  }, [Header]);
  return (
    <div>
      {/* {loading && (
        <div className="page-center-loader flex items-center justify-center">
          <div className="big-loader flex items-center justify-center">
            <img
              className="loader-gif"
              src="/img/cotravloader.gif"
              alt="Loader"
            />
            <p className="text-center ml-4 text-gray-600 text-lg"></p>
          </div>
        </div>
      )} */}
      {showStopModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] md:w-[500px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Add Stops</h2>

            {error && (
              <div className="text-red-500 mb-3 p-2 bg-red-50 rounded">
                {error}
              </div>
            )}

            <div className="space-y-3 mb-4">
              {stops.map((stop, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      ref={(el) => {
                        if (el) inputRefs.current[index] = el;
                      }}
                      className={`w-full border rounded px-3 py-2 ${
                        fieldErrors[index]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder={`Stop ${index + 1}`}
                      value={stop}
                      onChange={(e) =>
                        handleInputChangeCities(index, e.target.value)
                      }
                      onBlur={() => validateStop(index)}
                    />
                    {stops.length > 1 && (
                      <button
                        onClick={() => handleRemoveStop(index)}
                        className="text-red-500 font-bold text-lg hover:text-red-700"
                        title="Remove stop"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                  {fieldErrors[index] && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors[index]}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleAddStop}
              className={`text-blue-600 text-sm underline mb-4 ${
                stops.length >= 5 ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={stops.length >= 5}
            >
              + Add Next Stop
            </button>

            <div className="flex justify-end gap-3 pt-2">
              {/* <button
          onClick={() => {
            setError("");
            setFieldErrors([]);
            setShowStopModal(false);
          }}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button> */}
              <button
                onClick={handleSaveStops}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Stops
              </button>
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <div className="page-center-loader flex items-center justify-center">
          <div className="big-loader flex items-center justify-center">
            <img
              className="loader-gif"
              src="/img/cotravloader.gif"
              alt="Loader"
            />
            <p className="text-center ml-4 text-gray-600 text-lg"></p>
          </div>
        </div>
      ) : (
        <>
          <header className="search-bar2" id="widgetHeader">
            <form onSubmit={(e) => handleSearchCab(e)}>
              <div id="search-widget" className="hsw v2">
                <div className="hsw_inner px-2">
                  <div className="hsw_inputBox tripTypeWrapper grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 md:gap-4">
                    <div className="Cab-form-box col-span-1 md:col-span-3 lg:col-span-1 relative">
                      <div
                        className="flex gap-2 cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        <h6 className="text-xs hotel-form-text-color">
                          Trip Type
                        </h6>
                        <img
                          src="../img/downarrow.svg"
                          className="w-3 h-4"
                          alt="Dropdown"
                        />
                      </div>

                      <div className="hotel-city-name-2 relative">
                        <input
                          type="text"
                          className="font-semibold hotel-city w-full cursor-pointer"
                          placeholder="Trip Type"
                          value={selectType}
                          readOnly
                          onClick={() => setIsOpen(!isOpen)}
                        />

                        {isOpen && (
                          <ul className="absolute bg-white border border-gray-300 w-full mt-1 z-10 shadow-md rounded-md text-sm">
                            {tripTypes.map((type) => (
                              <li
                                key={type}
                                onClick={() => handleSelect(type)}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                {type}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                    <div className="Cab-form-box col-span-1 md:col-span-3 lg:col-span-1 relative">
                      <div className="flex gap-2">
                        <h6 className="text-xs hotel-form-text-color">From</h6>
                        <img
                          src="../img/downarrow.svg"
                          className="w-3 h-4 cursor-pointer"
                          alt="Dropdown"
                        />
                      </div>

                      <div
                        className="hotel-city-name-2 relative"
                        ref={pickupDropdownRef}
                      >
                        <input
                          type="text"
                          placeholder="Search City"
                          value={pickupCity}
                          onClick={() => handleInputClick("pickup")}
                          onChange={(e) => handleInputChange(e, "pickup")}
                          className="font-semibold hotel-city w-full"
                        />
                        {showPickupDropdown && (
                          <div className="absolute z-10 bg-white shadow border w-full mt-1 max-h-60 overflow-y-auto">
                            {isLoading ? (
                              <div className="p-2 text-gray-500">
                                Loading...
                              </div>
                            ) : filteredCities.length > 0 ? (
                              filteredCities.map((city, idx) => (
                                <div
                                  key={idx}
                                  onClick={() => handleCitySelect(city, "pickup")}

                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  {city.city_name}
                                </div>
                              ))
                            ) : (
                              <div className="p-2 text-gray-500">
                                No results found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {(selectType === "Round Trip (Outstation)" ||
                      selectType === "Oneway") && (
                      <div className="Cab-form-box col-span-1 md:col-span-3 lg:col-span-1 relative">
                        <div className="flex gap-2">
                          <h6 className="text-xs hotel-form-text-color">To</h6>
                          <img
                            src="../img/downarrow.svg"
                            className="w-3 h-4 cursor-pointer"
                            alt="Dropdown"
                          />
                        </div>

                        <div
                          className="hotel-city-name-2 relative"
                          ref={dropDropdownRef}
                        >
                          <input
                            type="text"
                            placeholder="Drop City"
                            value={selectedDropCity}
                            onClick={() => handleInputClick("drop")}
                            onChange={(e) => handleInputChange(e, "drop")}
                            className="font-semibold hotel-city w-full"
                          />
                          {showDropDropdown && (
                            <div className="absolute z-10 bg-white shadow border w-full mt-1 max-h-60 overflow-y-auto">
                              {isLoading ? (
                                <div className="p-2 text-gray-500">
                                  Loading...
                                </div>
                              ) : filteredCitiesDrop.length > 0 ? (
                                filteredCitiesDrop.map((city, idx) => (
                                  <div
                                    key={idx}
                                    onClick={() => handleCitySelect(city, "drop")}

                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                  >
                                    {city.city_name}
                                  </div>
                                ))
                              ) : (
                                <div className="p-2 text-gray-500">
                                  No results found
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {selectType == "MultiCity (Outstation)" && (
                      <div className="Cab-form-box col-span-1 md:col-span-3 lg:col-span-1">
                        <div className="flex gap-2">
                          <h6 className="text-xs hotel-form-text-color">
                            Stop
                          </h6>
                        </div>
                        <div className="hotel-city-name-2 relative">
                          <input
                            type="text"
                            className="font-semibold hotel-city w-full"
                            placeholder="Add Stops"
                            value={getDisplayText()}
                            readOnly
                            onClick={() => setShowStopModal(true)}
                          />
                        </div>
                      </div>
                    )}

                    <div className="Cab-form-box col-span-1">
                      <div className="flex gap-2">
                        <h6 className="text-xs hotel-form-text-color">
                          Pickup Date
                        </h6>
                        <img
                          src="../img/downarrow.svg"
                          className="w-3 h-4 cursor-pointer"
                          alt="Dropdown"
                        />
                      </div>

                      <div className="hotel-city-name-2 relative">
                        {!showDatePicker ? (
                          <input
                            type="text"
                            className="font-semibold hotel-city w-full"
                            placeholder="Pickup Date"
                            value={pickupDate}
                            readOnly
                            onClick={() => setShowDatePicker(true)}
                          />
                        ) : (
                          <DatePicker
                            className="font-semibold hotel-city w-full"
                            placeholderText="Select Pickup Date"
                            selected={selectedDate}
                            onChange={(date) => {
                              setSelectedDate(date);
                              const formatted = formatDate(date);
                              setPickupDate(formatted);
                              setShowDatePicker(false);
                            }}
                            dateFormat="dd/MM/yyyy"
                            minDate={new Date()}
                            autoFocus
                            onBlur={() =>
                              setTimeout(() => {
                                setShowDatePicker(false);
                              }, 200)
                            }
                          />
                        )}
                      </div>
                    </div>

                    {(selectType === "Round Trip (Outstation)" ||
                      selectType === "MultiCity (Outstation)") && (
                      <div className="Cab-form-box col-span-1">
                        <div className="flex gap-2">
                          <h6 className="text-xs hotel-form-text-color">
                            Drop Date
                          </h6>
                          <img
                            src="../img/downarrow.svg"
                            className="w-3 h-4 cursor-pointer"
                            alt="Dropdown"
                          />
                        </div>

                        <div className="hotel-city-name-2 relative">
                          {!showDropDatePicker ? (
                            <input
                              type="text"
                              className="font-semibold hotel-city w-full"
                              placeholder="Drop Date"
                              value={dropDate}
                              readOnly
                              onClick={() => setShowDropDatePicker(true)}
                            />
                          ) : (
                            <DatePicker
                              className="font-semibold hotel-city w-full"
                              placeholderText="Select Drop Date"
                              selected={selectedDropDate}
                              onChange={(date) => {
                                if (date) {
                                  setSelectedDropDate(date);
                                  const formatted = formatDate(date);
                                  setDropDate(formatted);
                                }
                                setShowDropDatePicker(false);
                              }}
                              dateFormat="dd/MM/yyyy"
                              minDate={parsePickupDate(pickupDate)}
                              autoFocus
                              onBlur={() =>
                                setTimeout(() => {
                                  setShowDropDatePicker(false);
                                }, 200)
                              }
                            />
                          )}
                        </div>
                      </div>
                    )}
                    <div className="Cab-form-box col-span-1 md:col-span-3 lg:col-span-1">
                      <div className="flex gap-2">
                        <h6 className="text-xs hotel-form-text-color">
                          Pickup Time
                        </h6>
                        <img
                          src="../img/downarrow.svg"
                          className="w-3 h-4 cursor-pointer"
                          alt="Dropdown"
                        />
                      </div>
                      <div className="hotel-city-name-2 relative">
                        {!showTimeDropdown ? (
                          <input
                            type="text"
                            className="font-semibold hotel-city w-full"
                            placeholder="Pickup Time"
                            value={pickupTime}
                            readOnly
                            onClick={() => setShowTimeDropdown(true)}
                          />
                        ) : (
                          <DatePicker
                            className="font-semibold hotel-city w-full"
                            placeholderText="Select Pickup Time"
                            selected={selectedTime}
                            onChange={(time) => {
                              setSelectedTime(time);
                              const formatted = time.toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              ); // Example: 04:15 PM
                              setPickupTime(formatted);
                              setShowTimeDropdown(false);
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            autoFocus
                            onBlur={() =>
                              setTimeout(() => setShowTimeDropdown(false), 200)
                            }
                          />
                        )}
                      </div>
                    </div>

                    {/* Search Button */}
                    <button className="search-buttonn rounded-lg col-span-1 md:col-span-3 lg:col-span-1 h-[50px] mt-auto">
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </header>
          <div className="card-container max_height">
            <div className="flex flex-col md:flex-row ">
              <div className="max-w-[18rem] w-full bg-white shadow-md rounded border cursor-pointer md:w-1/3 lg:w-1/4 p-4 mx-auto ">
                <div className="">
                  {(selectedCabTypes.length > 0 ||
                    selectedFuelTypes.length > 0 ||
                    selectedModels.length > 0) && (
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">
                          Applied Filters
                        </h2>
                        <button
                          className="hotel-form-text-color text-xs hover:underline"
                          onClick={() => {
                            setSelectedCabTypes([]);
                            setSelectedFuelTypes([]);
                            setSelectedModels([]);
                          }}
                        >
                          CLEAR ALL
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {selectedCabTypes.map((filter, i) => (
                          <span
                            key={`cab-${i}`}
                            className="bg-[#785ef7] text-white px-3 py-1 rounded-md text-xs flex items-center space-x-1"
                          >
                            <span>{filter}</span>
                            <button
                              onClick={() =>
                                setSelectedCabTypes((prev) =>
                                  prev.filter((f) => f !== filter)
                                )
                              }
                            >
                              <img src="./img/cros.png" className="w-2 h-2" />
                            </button>
                          </span>
                        ))}

                        {selectedFuelTypes.map((filter, i) => (
                          <span
                            key={`fuel-${i}`}
                            className="bg-[#785ef7] text-white px-3 py-1 rounded-md text-xs flex items-center space-x-1"
                          >
                            <span>{filter}</span>
                            <button
                              onClick={() =>
                                setSelectedFuelTypes((prev) =>
                                  prev.filter((f) => f !== filter)
                                )
                              }
                            >
                              <img src="./img/cros.png" className="w-2 h-2" />
                            </button>
                          </span>
                        ))}

                        {selectedModels.map((filter, i) => (
                          <span
                            key={`model-${i}`}
                            className="bg-[#785ef7] text-white px-3 py-1 rounded-md text-xs flex items-center space-x-1"
                          >
                            <span>{filter}</span>
                            <button
                              onClick={() =>
                                setSelectedModels((prev) =>
                                  prev.filter((f) => f !== filter)
                                )
                              }
                            >
                              <img src="./img/cros.png" className="w-2 h-2" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        Select Filters
                      </h2>
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-gray-700 mb-2">
                        Cab Type
                      </h3>
                      <ul className="space-y-2 text-xs">
                        {cabTypeOptions.map((label, i) => {
                          const enabled = isCabTypeEnabled(label);
                          return (
                            <li
                              key={i}
                              className="flex items-center justify-between"
                            >
                              <label
                                className={`flex items-center space-x-2 ${
                                  !enabled
                                    ? "opacity-40 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  className="form-checkbox h-3 w-3 text-blue-600"
                                  checked={selectedCabTypes.includes(label)}
                                  onChange={() =>
                                    enabled &&
                                    handleCheckboxChange(
                                      label,
                                      selectedCabTypes,
                                      setSelectedCabTypes
                                    )
                                  }
                                  disabled={!enabled}
                                />
                                <span className="text-gray-800">{label}</span>
                              </label>
                              <span className="text-xs text-gray-500">
                                ({cabTypeCounts?.[label] || 0})
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-gray-700 mb-2">
                        Fuel Type
                      </h3>
                      <ul className="space-y-2 text-xs">
                        {cabFuelOptions.map((label, i) => (
                          <li
                            key={i}
                            className="flex items-center justify-between "
                          >
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                className="form-checkbox h-3 w-3 text-blue-600"
                                checked={selectedFuelTypes.includes(label)}
                                onChange={() =>
                                  handleCheckboxChange(
                                    label,
                                    selectedFuelTypes,
                                    setSelectedFuelTypes
                                  )
                                }
                              />
                              <span className="text-gray-800">{label}</span>
                            </label>
                            <span className="text-xs text-gray-500">
                              ({cabFuelCounts?.[label] || 0})
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-gray-700 mb-2">
                        Cab Model
                      </h3>
                      <ul className="space-y-2 text-xs">
                        {cabModelOptions.map((label, i) => {
                          const enabled = isCabModelEnabled(label);
                          return (
                            <li
                              key={i}
                              className="flex items-center justify-between"
                            >
                              <label
                                className={`flex items-center space-x-2 ${
                                  !enabled
                                    ? "opacity-40 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  className="form-checkbox h-3 w-3 text-blue-600"
                                  checked={selectedModels.includes(label)}
                                  onChange={() =>
                                    enabled &&
                                    handleCheckboxChange(
                                      label,
                                      selectedModels,
                                      setSelectedModels
                                    )
                                  }
                                  disabled={!enabled}
                                />
                                <span className="text-gray-800">{label}</span>
                              </label>
                              <span className="text-xs text-gray-500">
                                ({cabModelCounts?.[label] || 0})
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-2/3 lg:w-3/4 px-4 md:px-6 justify-center">
                {Header.eselectType === "MultiCity (Outstation)" && (
                  <p className="py-4 md:py-7 px-2 md:px-6 mb-0 md:text-left text-sm md:text-base">
                    Your {Header.selectType} Plan : {numberOfDays} Days |{" "}
                    {Header.SearchCities?.filter(Boolean)
                      .map((city) => city.split(",")[0].trim())
                      .join(" → ")}
                  </p>
                )}

                {Header.selectType === "Round Trip (Outstation)" && (
                  <p className="py-4 md:py-7 px-2 md:px-6 mb-0 md:text-left text-sm md:text-base">
                    Your {Header.selectType} Plan : {numberOfDays} Days |{" "}
                    {Header.Cities?.split(",")
                      .filter(Boolean)
                      .map((city) => city.trim())
                      .join(" → ")}
                  </p>
                )}

                {filteredCabs?.map((item, index) => (
                  <div
                    key={index}
                    className="w-full py-2 px-3 transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    {/* Outer Card Container */}
                    <div className="max-w-[61rem] w-full flex flex-col md:flex-row md:items-center bg-white shadow-md rounded-md border border-gray-200 dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none transition-shadow duration-300 hover:shadow-lg md:gap-6 p-4">
                      {/* Image Section */}
                      <div className="w-full md:w-1/4 flex justify-center items-center mb-4 md:mb-0">
                        {/* {item.vehicle.no_of_seats === "6" ? (
<img
src="./img/SUV.svg"       // Replace with the SUV image path
alt="SUV"
className="cab_image max-h-28 object-contain"
/>
) : item.vehicle.no_of_seats === "4" ? (
<img
src="./img/Seden.svg"     // Replace with the Sedan image path
alt="Sedan"
className="cab_image max-h-28 object-contain"
/>
) : (
<img
src={item.vehicle.image} // Fallback: use the original image if seats are something else
alt={item.vehicle.type}
className="cab_image max-h-28 object-contain"
/>
)} */}
                        <img
                          src={item.vehicle.image} // Fallback: use the original image if seats are something else
                          alt={item.vehicle.type}
                          className="cab_image max-h-28 object-contain"
                        />
                      </div>

                      {/* Middle Details Section */}
                      <div className="w-full md:w-2/4">
                        <h2 className="text-lg md:text-xl font-semibold mb-1">
                          {item.vehicle.description}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {item.vehicle.type} • {item.vehicle.no_of_seats} Seats
                          • {item.package.kms_included} kms included
                        </p>

                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <h6 className="font-semibold">Spacious Car</h6>

                          <p className="flex gap-2 items-center">
                            <img src="./img/Extra_Km.svg" className="w-5 h-5" />
                            <strong>Extra km fare:</strong>
                            <span>₹{item.package.rate_per_km}/Km</span>
                            <small className="text-gray-500">
                              after {item.package.kms_included} kms
                            </small>
                          </p>

                          <p className="flex gap-2 items-center">
                            <img
                              src="./img/Fuel_type.svg"
                              className="w-5 h-5"
                            />
                            <strong>Fuel Type:</strong>
                            <span>{item.vehicle.fuel_type}</span>
                          </p>

                          <p className="flex gap-2 items-center">
                            <img
                              src="./img/Cancel_Cab.svg"
                              className="w-5 h-5"
                            />
                            <strong>Cancellation:</strong>
                            <span className="text-green-600">Free</span>
                            <small className="text-gray-500">
                              till 24 hrs of departure
                            </small>
                          </p>
                        </div>
                      </div>

                      {/* Pricing & Button Section */}
                      <div className="w-full md:w-1/4 flex flex-col justify-between items-end mt-4 md:mt-0">
                        <div className="text-right mb-3 md:mb-6">
                          <h2 className="text-lg md:text-xl font-semibold mb-1">
                            ₹{item.payment.estimated_base_fare}
                          </h2>
                          <p className="text-xs text-gray-500">
                            + ₹{item.payment.gst} (Taxes & Charges)
                          </p>
                        </div>

                        <button
                          className="bg-[#785ef7] text-white px-4 py-2 text-sm rounded shadow self-end"
                          onClick={() =>
                            navigate("/CabDetails", {
                              state: { cabData: item },
                            })
                          }
                        >
                          BOOK NOW
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default SearchCab;
