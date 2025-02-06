import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const HotelDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "../img/hotelroom1.jpg",
    "../img/hotelroom2.jpg",
    "../img/hotelroom3.jpg",
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };
  return (
    <div className="hoteldetail-conatiner">
      <nav className="text-sm text-gray-600 flex gap-2 py-3 px-5">
        <span
          className="cursor-pointer text-blue-600 hover:underline"
          onClick={() => navigate("/")}
        >
          Home
        </span>
        <span>&gt;</span>
        <span
          className="cursor-pointer text-blue-600 hover:underline"
          onClick={() => navigate("/SearchHotel")}
        >
          Hotels In Pune
        </span>
        <span>&gt;</span>
        <span className="text-gray-900 font-semibold">Hotel Name</span>
      </nav>
      <div className="flex items-center justify-center py-2">
        <div className="max-w-[71rem] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4]  border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none hotel-border">
          <div className="py-3 px-3 ">
            <h5 className="text-[#3b3f5c] text-xl mb-3 font-semibold dark:text-white-light">
              Hotel Name{" "}
            </h5>
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-3 gap-3 mb-5 flex">
              <div className="lg:col-span-2 xl:col-span-2 space-y-2  ">
                <div className="flex gap-3 max-h-[21rem]">
                  <img
                    src="../img/hotelroom.jpg"
                    className="photos-hotels"
                  ></img>
                  <div className="grid grid-rows-2 gap-3 py-1 ">
                    <img
                      src="../img/hotelroom1.jpg"
                      className="photos-hotel"
                    ></img>
                    <img
                      src="../img/hotelroom3.jpg"
                      className="photos-hotel"
                    ></img>
                  </div>
                </div>
                <div className="py-2 ">
                  <h6 className="text-sizes-color ">
                    Stay at this budget hotel in Pune that offers a conference
                    room, restaurant, free Wi-Fi, elevator & free parking .
                    <span className="information_button">More</span>
                  </h6>
                </div>

                <div className="flex gap-3">
                  <div className="border  w-25 hotel_button_color text-black flex items-center gap-2 p-2 rounded-md">
                    <img
                      src="../img/foodicon.png"
                      alt="food"
                      className="w-5 h-5"
                    />
                    {/* Replace with an actual icon */}
                    <span className="text-sm">Food And Dining</span>
                  </div>
                  <div className="border  w-25  text-black flex items-center gap-2 p-2 rounded-md hotel_button_color">
                    <img
                      src="../img/location.png"
                      alt="map"
                      className="w-5 h-5"
                    />
                    {/* Replace with an actual icon */}
                    <span className="text-sm">Location</span>
                  </div>
                </div>
                <div>
                  <h6 className="text-[#3b3f5c] text-lg font-semibold dark:text-white-ligh">
                    Amenities
                  </h6>
                </div>
              </div>

              <div className="lg:col-span-2 xl:col-span-1  relative">
                <div className="sticky top-5 space-y-5">
                  <div className="flex items-center justify-center">
                    <div className="max-w-[25rem] w-full border border-white-light dark:border-[#1b2e4b] hotel-border ">
                      <div className="py-3 px-3">
                        <h5 className="text-[#3b3f5c] text-xl font-semibold dark:text-white-light">
                          Deluxe King Room
                        </h5>
                        <h5 className="text-[#3b3f5c] text-sm dark:text-white-light">
                          Fits 2 Adults & 2 Children
                        </h5>
                        <ul className="list-disc text-black space-y-1">
                          <li className="text-sm">
                            Free stay for both the kids
                          </li>
                          <li className="text-sm">No meals included</li>
                          <li className="flex items-center gap-2">
                            <i className="text-blue-500"></i>
                            <span className="text-green-500 text-sm">
                              Free Cancellation till 24 hrs before check-in
                            </span>
                          </li>
                        </ul>
                        <div className="flex items-center gap-2">
                          <h5 className="text-[#3b3f5c] text-2xl font-semibold dark:text-white-light">
                            ₹ 2,319
                          </h5>
                          <span className="text-xs text-gray-500 font-semibold ">
                            + ₹ 603 taxes & fees
                          </span>
                        </div>
                        <button className="bg-[#785ef7] w-30 h-10 text-white px-2 rounded-md font-semibold text-sm transition duration-300 hover:bg-[#5a3ec8]">
                          BOOK THIS NOW
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-5 flex items-center justify-center">
                    <div className="max-w-[25rem] w-full border border-white-light dark:border-[#1b2e4b] hotel-border ">
                      <div className="py-2 px-6">
                        <div className="grid grid-cols-3 items-center">
                          <div>
                            <img
                              src="../img/map_image.png"
                              alt="Map"
                              className="w-20 h-15"
                            />
                          </div>

                          <div className="text-center leading-tight">
                            <h6 className="text-sm block">Hinjawadi</h6>
                            <span className="text-xs text-gray-500 block -mt-1">
                              15.1 km from
                            </span>
                          </div>

                          <div className="flex items-center justify-center gap-1 text-blue-500 cursor-pointer">
                            {/* Google Maps Icon */}

                            <p className="text-sm">See Map</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center py-2">
        <div className="max-w-[71rem] w-full bg-white shadow-[4px_6px_10px_-3px_#bfc9d4]  border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none hotel-border">
          <div className="py-3 px-3 ">
            {/* <h5 className="text-[#3b3f5c] text-xl mb-3 font-semibold dark:text-white-light">
              Hotel Name{" "}
            </h5> */}
            <div className="border w-full h-full hotel-border">
              <div className="border-b   w-full ">
                {" "}
                <h6 className="text-sm py-2 px-3 ">
                  Enjoy Free Breakfast throughout your stay for just ₹155 more!
                </h6>
              </div>
              <div className="grid grid-cols-3 flex space-y-2 ">
                <div className="border h-full">
                  <div className="px-3 py-2">
                    <div className="relative">
                      <img
                        src={images[currentIndex]}
                        className="photos-hotelss mb-2"
                        alt="Hotel Room"
                      />
                      <button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2"
                      >
                        ❮
                      </button>
                      <button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2"
                      >
                        ❯
                      </button>
                    </div>

                    <h5 className="text-[#3b3f5c] text-xl font-semibold dark:text-white-light  ">
                      Deluxe King Room
                    </h5>
                    <h5 className="text-[#3b3f5c] text-sm dark:text-white-light">
                      (168 sq.ft (16 sq.mt) | Twin Bed)
                    </h5>
                    <ul className="list-disc text-black space-y-1">
                      <div className="grid grid-cols-2 gap-2">
                        <li className="text-sm">Laundry Service</li>
                        <li className="text-sm">Bathroom</li>
                        <li className="text-sm">Room Service</li>
                        <li className="text-sm">Telephoned</li>
                        <li className="text-sm">Daily Housekeeping</li>
                        <li className="text-sm">Wifi</li>
                      </div>
                    </ul>
                    <p className="information_button text-sm">More Details</p>
                  </div>
                </div>
                <div className="py-2 px-3 space-y-1">
                  <button className="border-2 w-ful h-5 mb-2 border-[#785ef7] text-[#785ef7] bg-transparent px-2  hotel-border text-xs transition duration-300 hover:bg-[#785ef7] hover:text-white">
                    RECOMMEDED
                  </button>
                  <h5 className="text-[#3b3f5c] text-lg font-semibold dark:text-white-light  ">
                    Room With Free Cancellation | Breakfast only
                  </h5>
                  <ul className="list-disc text-black space-y-1">
                    <li className="text-sm">Free stay for both the kids</li>
                    <li className="text-sm">Free Breakfast</li>
                    <li className="flex items-center gap-2">
                      <i className="text-blue-500"></i>
                      <span className="text-green-500 text-sm">
                        Free Cancellation till 24 hrs before check in
                      </span>
                    </li>
                  </ul>
                  <p className="information_button text-sm">More Details</p>
                </div>
                <div className="py-4 px-3 space-y-2">
                  <h5 className="text-[#3b3f5c] text-xl font-semibold dark:text-white-light  ">
                    ₹ 2,474
                  </h5>
                  <h5 className="text-[#3b3f5c] text-sm dark:text-white-light">
                    +₹ 643 taxes & fees Per Night
                  </h5>
                  <button className="bg-[#785ef7] w-30 h-7 text-white px-2 rounded-md font-semibold text-sm transition duration-300 hover:bg-[#5a3ec8]">
                    SELECT ROOM
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add your hotel details content here */}
    </div>
  );
};

export default HotelDetails;
