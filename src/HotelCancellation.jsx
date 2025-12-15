const HotelCancellation = ()=>{

    return(
 <div className="search-bar3 h-20 w-full " id="widgetHeader2">
        <div className="purple-header">
         
        </div>
             <div className="mb-5  h-full space-y-5 floating-bookings ">
       <div className=" p-6 bg-white rounded-lg shadow-lg border">
      <div className="flex items-center bg-red-100 p-3 rounded-t-lg border-b border-red-300">
        <span className="text-red-600 text-lg font-semibold mr-2">Booking has been cancelled!</span>
        <span className="text-gray-600 item-right">Booking ID 1984433</span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 p-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800">The Menino Regency</h2>
          <p className="text-sm text-gray-600">The Grand Deluxe Room King Bed with Bathtub 2</p>
          <p className="mt-2 text-sm text-gray-700">
            <span className="font-semibold">Check-In:</span> <strong>Sun, 12 Jan 2025 04:15 PM</strong>
          </p>
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-700 flex gap-2 font-bold"> <img
                              src="./img/Traveller.svg"
                              className="w-5 h-5"
                            /> Travelers</p>
            <p className="text-sm text-gray-600">
              Ms. Khushi Devkar &nbsp;|&nbsp; khushi.devkar@taxivaxi.com &nbsp;|&nbsp; +91-7822865797
            </p>
          </div>
        </div>
        <img
          src="./img/hotelroom1.jpg"
          alt="Hotel"
          className="w-full sm:w-48 h-32 object-cover rounded-md"
        />
      </div>

      <div className="border-t mt-4 pt-4">
        <h3 className="text-lg font-semibold text-gray-800">Total Refund Processed: ₹ 16,200</h3>

        <div className="mt-2">
          <p className="text-blue-600 font-semibold">Refund Status: PROCESSED</p>
          <p className="text-sm text-gray-700 mt-1">
            Booking for Khushi Devkar was cancelled. A refund of ₹ 16,200 has been processed.
          </p>
        </div>

        <div className="mt-4 space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
             <p>Booking Cancelled <span className="text-gray-500">Sun, 12 Jan 2025 04:15 PM</span></p>
          </div>
          <div className="flex items-center gap-2">
             <p>Refund attempted: ₹ 16,200 <span className="text-gray-500">Sun, 12 Jan 2025 04:15 PM</span></p>
          </div>
          <div className="flex items-center gap-2">
             <p>Refund transferred to wallet ₹ 16,200 <span className="text-gray-500">Expected by Mon, 13 Jan 2025</span></p>
          </div>
        </div>
      </div>

      <div className="border-t mt-4 pt-4">
        <h4 className="text-md font-medium text-gray-800">Payment Details</h4>
        <p className="text-red-500 text-sm mt-1">❌ Cancelled On Sun, 12 Jan 2025</p>

        <div className="text-sm text-gray-700 mt-2 space-y-1">
          <p>Total amount charged: ₹ 16,200</p>
          <p>Cancellation Fees: ₹ 0</p>
          <p className="font-semibold">Refund: ₹ 16,200</p>
        </div>

        
      </div>
     </div> 
    </div> 
    {/* </div> */}
        </div>
    );
}

export default HotelCancellation; 