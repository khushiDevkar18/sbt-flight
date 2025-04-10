 const SearchCab = () =>{
   const Header =   JSON.parse(sessionStorage.getItem("Header_Cab")) || {};

    return (
    <div>
      <header className="search-bar2" id="widgetHeader">
  <form>
    <div id="search-widget" className="hsw v2">
      <div className="hsw_inner px-2">
        <div className="hsw_inputBox tripTypeWrapper grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-2 md:gap-4">
        
          <div className="Cab-form-box col-span-1 md:col-span-3 lg:col-span-1">
            <div className="flex gap-2">
              <h6 className="text-xs hotel-form-text-color">Trip Type</h6>
              <img src="../img/downarrow.svg" className="w-3 h-4 cursor-pointer" alt="Dropdown" />
            </div>
            <div className="hotel-city-name-2 relative">
              <input
                type="text"
                className="font-semibold hotel-city w-full"
                placeholder="Trip Type"
                value={Header.selectType}
              />
            </div>
          </div>

         
         
          <div className="Cab-form-box col-span-1 md:col-span-3 lg:col-span-1">
              <div className="flex gap-2">
                <h6 className="text-xs hotel-form-text-color">From</h6>
                <img src="../img/downarrow.svg" className="w-3 h-4 cursor-pointer" alt="Dropdown" />
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
              <img src="../img/downarrow.svg" className="w-3 h-4 cursor-pointer" alt="Dropdown" />
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
              <img src="../img/downarrow.svg" className="w-3 h-4 cursor-pointer" alt="Dropdown" />
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
              <h6 className="text-xs hotel-form-text-color">Pickup Date</h6>
              <img src="../img/downarrow.svg" className="w-3 h-4 cursor-pointer" alt="Dropdown" />
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
              <h6 className="text-xs hotel-form-text-color"> Drop Date</h6>
              <img src="../img/downarrow.svg" className="w-3 h-4 cursor-pointer" alt="Dropdown" />
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
              <h6 className="text-xs hotel-form-text-color">Pickup Time</h6>
              <img src="../img/downarrow.svg" className="w-3 h-4 cursor-pointer" alt="Dropdown" />
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

<div className="card-container">
  <div className="flex flex-col md:flex-row">
 
    <div className="w-full md:w-1/3 lg:w-1/4 p-2 md:p-4 mx-auto">
      <div className="mb-5">
        <div className="max-w-[19rem] w-full bg-white shadow-lg rounded border cursor-pointer mx-auto">
          <div className="relative">
            <h6 className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-700 text-xs font-semibold mb-4 bg-white p-2 rounded whitespace-nowrap">
              EXPLORE ON MAP
            </h6>
          </div>
        </div>
      </div>
    </div>

  
    <div className="w-full md:w-2/3 lg:w-3/4 px-4 md:px-6">
  <p className="py-4 md:py-7 px-2 md:px-6  mb-0 md:text-left text-sm md:text-base">
    Your {Header.selectType} Plan : 2 Days |{" "}
    {Header.Cities?.filter(Boolean)
      .map(city => city.split(',')[0].trim()) 
      .join(' → ')} 
  </p>
  <div
                    
                      className="w-full py-2 px-3 transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                    
                    >
                      <div className="max-w-[57rem] w-full flex flex-cols bg-white shadow-md rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none transition-shadow duration-300 hover:shadow-lg">
                        <div className="py-3 px-3 w-1/3">
                          <div className="photos-container">
                          <img
                                  src='./img/Cab_image.png'
                                  alt="Hotel"
                                  className="hotel-photo"
                                />

                            </div></div></div></div>
</div>

  </div>
</div>


    </div>


    
    );

 }
 export default SearchCab;