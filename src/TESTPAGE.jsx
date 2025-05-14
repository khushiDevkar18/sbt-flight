import React, { useState } from 'react';

const initialSeats = [
  // Lower Berth
  { id: 1, berth: 'lower', price: 4200, status: 'available' },
  { id: 2, berth: 'lower', price: 4200, status: 'available' },
  { id: 3, berth: 'lower', price: 4200, status: 'available' },
  { id: 4, berth: 'lower', price: 4200, status: 'available' },
  { id: 5, berth: 'lower', price: 4200, status: 'available' },
  { id: 6, berth: 'lower', price: 4200, status: 'available' },
  { id: 7, berth: 'lower', price: 4200, status: 'available' },
  { id: 8, berth: 'lower', price: 4200, status: 'available' },
  { id: 9, berth: 'lower', price: 4200, status: 'available' },
  { id: 10, berth: 'lower', price: 4200, status: 'available' },

  // Upper Berth
  { id: 11, berth: 'upper', price: 4200, status: 'available' },
  { id: 12, berth: 'upper', price: 4200, status: 'selected' },
  { id: 13, berth: 'upper', price: 4200, status: 'available' },
  { id: 14, berth: 'upper', price: 4200, status: 'available' },
  { id: 15, berth: 'upper', price: 4200, status: 'available' },
  { id: 16, berth: 'upper', price: 4200, status: 'available' },
];

const Seat = ({ seat, onClick }) => {
  const borderClass =
    seat.status === 'selected'
      ? 'border-blue-500'
      : 'border-gray-300 hover:border-blue-400';

  const icon =
    seat.status === 'selected' ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-blue-500"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4S8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ) : null;

  return (
    <div
      onClick={() => onClick(seat.id)}
      className="flex flex-col items-center justify-center m-1 cursor-pointer"
    >
      <div
        className={`w-10 h-16 rounded-md border-2 ${borderClass} flex items-center justify-center`}
      >
        {icon}
      </div>
      <span className="text-xs text-gray-600 mt-1">₹{seat.price}</span>
    </div>
  );
};

const BusSeatLayout = () => {
  const [seats, setSeats] = useState(initialSeats);

  const handleSeatClick = (id) => {
    setSeats((prev) =>
      prev.map((seat) =>
        seat.id === id
          ? {
              ...seat,
              status: seat.status === 'selected' ? 'available' : 'selected',
            }
          : seat
      )
    );
  };

  const lowerBerth = seats.filter((seat) => seat.berth === 'lower');
  const upperBerth = seats.filter((seat) => seat.berth === 'upper');

  return (
    <div className="flex justify-center gap-10 mt-10">
      {/* LOWER BERTH */}
      <div>
        <h2 className="text-center font-medium text-gray-500 mb-3">
          LOWER BERTH ({lowerBerth.length})
        </h2>
        <div className="grid grid-cols-3 gap-2 bg-white p-4 rounded-xl shadow">
          {lowerBerth.map((seat) => (
            <Seat key={seat.id} seat={seat} onClick={handleSeatClick} />
          ))}
        </div>
      </div>

      {/* UPPER BERTH */}
      <div>
        <h2 className="text-center font-medium text-gray-500 mb-3">
          UPPER BERTH ({upperBerth.length})
        </h2>
        <div className="grid grid-cols-3 gap-2 bg-white p-4 rounded-xl shadow">
          {upperBerth.map((seat) => (
            <Seat key={seat.id} seat={seat} onClick={handleSeatClick} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusSeatLayout;
