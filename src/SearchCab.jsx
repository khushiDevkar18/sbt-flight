import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchCab = () => {
  const [Header, setHeader] = useState(() => {
    return JSON.parse(sessionStorage.getItem("Header_Cab")) || {
      selectType: ""
    };
  });
  const Cab = JSON.parse(sessionStorage.getItem("SerachCab")) || {};
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
const tripTypes = ["Local", "RoundTrip", "Multi city", "Oneway"];

  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (type) => {
    setHeader({ ...Header, selectType: type });
    setIsOpen(false);
  };

  const calculateDays = (pickupDate, dropDate) => {
    const start = new Date(pickupDate);
    const end = new Date(dropDate);
  
    // Get time difference in milliseconds
    const diffTime = end - start;
  
    // Convert to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    return diffDays;
  };
  const numberOfDays = calculateDays(Header.pickup_date, Header.Drop_date);
  console.log(numberOfDays);
  return (
    <div>
      <header className="search-bar2" id="widgetHeader">
        <form>
          <div id="search-widget" className="hsw v2">
            <div className="hsw_inner px-2">
              <div className="hsw_inputBox tripTypeWrapper grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-2 md:gap-4">
              <div className="Cab-form-box col-span-1 md:col-span-3 lg:col-span-1 relative">
      <div
        className="flex gap-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h6 className="text-xs hotel-form-text-color">Trip Type</h6>
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
          value={Header.selectType}
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

                <div className="Cab-form-box col-span-1 md:col-span-3 lg:col-span-1">
                  <div className="flex gap-2">
                    <h6 className="text-xs hotel-form-text-color">From</h6>
                    <img
                      src="../img/downarrow.svg"
                      className="w-3 h-4 cursor-pointer"
                      alt="Dropdown"
                    />
                  </div>
                  <div className="hotel-city-name-2 relative">
                    <input
                      type="text"
                      className="font-semibold hotel-city w-full"
                      placeholder="Search City"
                      value={Header.pickup_city.city_name}
                    />
                  </div>
                </div>
                <div className="Cab-form-box col-span-1 md:col-span-3 lg:col-span-1">
                  <div className="flex gap-2">
                    <h6 className="text-xs hotel-form-text-color">To</h6>
                    <img
                      src="../img/downarrow.svg"
                      className="w-3 h-4 cursor-pointer"
                      alt="Dropdown"
                    />
                  </div>
                  <div className="hotel-city-name-2 relative">
                    <input
                      type="text"
                      className="font-semibold hotel-city w-full"
                      placeholder="Drop City"
                      value={Header.Drop_city}
                    />
                  </div>
                </div>
                <div className="Cab-form-box col-span-1 md:col-span-3 lg:col-span-1">
                  <div className="flex gap-2">
                    <h6 className="text-xs hotel-form-text-color">Stop</h6>
                    <img
                      src="../img/downarrow.svg"
                      className="w-3 h-4 cursor-pointer"
                      alt="Dropdown"
                    />
                  </div>
                  <div className="hotel-city-name-2 relative">
                    <input
                      type="text"
                      className="font-semibold hotel-city w-full"
                      placeholder="Stop"
                      value={Header.Cities}
                    />
                  </div>
                </div>
                <div className="Cab-form-box col-span-1 md:col-span-3 lg:col-span-1">
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
                    <input
                      type="text"
                      className="font-semibold hotel-city w-full"
                      placeholder="Pickup Date"
                      value={Header.pickup_date}
                    />
                  </div>
                </div>
                <div className="Cab-form-box col-span-1 md:col-span-3 lg:col-span-1">
                  <div className="flex gap-2">
                    <h6 className="text-xs hotel-form-text-color">
                      {" "}
                      Drop Date
                    </h6>
                    <img
                      src="../img/downarrow.svg"
                      className="w-3 h-4 cursor-pointer"
                      alt="Dropdown"
                    />
                  </div>
                  <div className="hotel-city-name-2 relative">
                    <input
                      type="text"
                      className="font-semibold hotel-city w-full"
                      placeholder="Drop Date"
                      value={Header.Drop_date}
                    />
                  </div>
                </div>
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
                    <input
                      type="text"
                      className="font-semibold hotel-city w-full"
                      placeholder="Pickup Time"
                      value={Header.pickup_time}
                    />
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
        {(selectedCabTypes.length > 0 || selectedFuelTypes.length > 0 || selectedModels.length > 0) && (

      
        <div className="space-y-4 mb-6">
  <div className="flex justify-between items-center">
    <h2 className="text-lg font-semibold text-gray-800">Applied Filters</h2>
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
        <button onClick={() =>
          setSelectedCabTypes((prev) => prev.filter((f) => f !== filter))
        }>
          <img src="./img/cros.png" className="w-2 h-2"/>
        </button>
      </span>
    ))}

    {selectedFuelTypes.map((filter, i) => (
      <span
        key={`fuel-${i}`}
         className="bg-[#785ef7] text-white px-3 py-1 rounded-md text-xs flex items-center space-x-1"
      >
        <span>{filter}</span>
        <button onClick={() =>
          setSelectedFuelTypes((prev) => prev.filter((f) => f !== filter))
        }>
            <img src="./img/cros.png" className="w-2 h-2"/>
        </button>
      </span>
    ))}

    {selectedModels.map((filter, i) => (
      <span
        key={`model-${i}`}
        className="bg-[#785ef7] text-white px-3 py-1 rounded-md text-xs flex items-center space-x-1"
      >
        <span>{filter}</span>
        <button onClick={() =>
          setSelectedModels((prev) => prev.filter((f) => f !== filter))
        }>
            <img src="./img/cros.png" className="w-2 h-2"/>
        </button>
      </span>
    ))}
  </div>
</div>
  )}

  <div className="space-y-6">
    
    <div>
      <h2 className="text-lg font-semibold text-gray-800">Select Filters</h2>
    </div>

 
    <div>
      <h3 className="text-base font-semibold text-gray-700 mb-2">Cab Type</h3>
      <ul className="space-y-2 text-xs">
      {cabTypeOptions.map((label, i) => {
      const enabled = isCabTypeEnabled(label);
      return (
        <li key={i} className="flex items-center justify-between">
          <label className={`flex items-center space-x-2 ${!enabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
            <input
              type="checkbox"
              className="form-checkbox h-3 w-3 text-blue-600"
              checked={selectedCabTypes.includes(label)}
              onChange={() =>
                enabled && handleCheckboxChange(label, selectedCabTypes, setSelectedCabTypes)
              }
              disabled={!enabled}
            />
            <span className="text-gray-800">{label}</span>
          </label>
          <span className="text-xs text-gray-500">({cabTypeCounts?.[label] || 0})</span>
        </li>
      );
    })}
</ul>

    </div>

   
    <div>
      <h3 className="text-base font-semibold text-gray-700 mb-2">Fuel Type</h3>
      <ul className="space-y-2 text-xs">
      {cabFuelOptions.map((label, i) => (
    <li key={i} className="flex items-center justify-between ">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          className="form-checkbox h-3 w-3 text-blue-600"
          checked={selectedFuelTypes.includes(label)} 
          onChange={() =>
            handleCheckboxChange(label, selectedFuelTypes, setSelectedFuelTypes)
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
      <h3 className="text-base font-semibold text-gray-700 mb-2">Cab Model</h3>
      <ul className="space-y-2 text-xs">
      {cabModelOptions.map((label, i) => {
  const enabled = isCabModelEnabled(label);
  return (
    <li key={i} className="flex items-center justify-between">
      <label className={`flex items-center space-x-2 ${!enabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
        <input
          type="checkbox"
          className="form-checkbox h-3 w-3 text-blue-600"
          checked={selectedModels.includes(label)}
          onChange={() =>
            enabled && handleCheckboxChange(label, selectedModels, setSelectedModels)
          }
          disabled={!enabled}
        />
        <span className="text-gray-800">{label}</span>
      </label>
      <span className="text-xs text-gray-500">({cabModelCounts?.[label] || 0})</span>
    </li>
  );
})}

      </ul>
    </div>
  </div>
  </div>
</div>


<div className="w-full md:w-2/3 lg:w-3/4 px-4 md:px-6 justify-center">
{(Header.selectType === "Round Trip (Outstation)" || Header.selectType === "MultiCity (Outstation)") && (
  <p className="py-4 md:py-7 px-2 md:px-6 mb-0 md:text-left text-sm md:text-base">
    Your {Header.selectType} Plan : {numberOfDays} Days |{" "}
    {Header.Cities?.filter(Boolean)
      .map((city) => city.split(",")[0].trim())
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
            {item.vehicle.type} • {item.vehicle.no_of_seats} Seats •{" "}
            {item.package.kms_included} kms included
          </p>
          
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <h6 className="font-semibold">Spacious Car</h6>
            
            <p className="flex gap-2 items-center">
              <img src="./img/Extra_Km.svg" className="w-5 h-5" />
              <strong>Extra km fare:</strong>
              <span>₹{item.package.rate_per_km}/Km</span>
              <small className="text-gray-500">after {item.package.kms_included} kms</small>
            </p>
            
            <p className="flex gap-2 items-center">
              <img src="./img/Fuel_type.svg" className="w-5 h-5" />
              <strong>Fuel Type:</strong>
              <span>{item.vehicle.fuel_type}</span>
            </p>
            
            <p className="flex gap-2 items-center">
              <img src="./img/Cancel_Cab.svg" className="w-5 h-5" />
              <strong>Cancellation:</strong>
              <span className="text-green-600">Free</span>
              <small className="text-gray-500">till 24 hrs of departure</small>
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
          
          <button className="bg-[#785ef7] text-white px-4 py-2 text-sm rounded shadow self-end"  onClick={() => navigate('/CabDetails', { state: { cabData: item } })}>
            BOOK NOW
          </button>
        </div>
      </div>
    </div>
  ))}
</div>


        </div>
      </div>
    </div>
  );
};
export default SearchCab;
