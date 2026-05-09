export default function BookingTable({ bookings, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px] text-left">
        <thead>
          <tr className="border-b bg-slate-50 text-sm text-slate-600">
            <th className="p-4">Booking ID</th>
            <th className="p-4">Guest</th>
            <th className="p-4">Room</th>
            <th className="p-4">Check In</th>
            <th className="p-4">Check Out</th>
            <th className="p-4">Status</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="8" className="p-6 text-center text-slate-500">
                No booking found
              </td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr key={booking.id} className="border-b hover:bg-slate-50">
                <td className="p-4 font-semibold">{booking.id}</td>
                <td className="p-4">{booking.guestName}</td>
                <td className="p-4">
                  {booking.roomNumber} - {booking.roomType}
                </td>
                <td className="p-4">{booking.checkIn}</td>
                <td className="p-4">{booking.checkOut}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      booking.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="p-4 font-semibold">₹{booking.amount}</td>
                <td className="p-4">
                  <button
                    onClick={() => onDelete(booking.id)}
                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}