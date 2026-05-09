export default function BookingCard({ booking, onDelete }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-md hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">
          {booking.guestName}
        </h3>

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
      </div>

      <p className="mt-2 text-sm text-slate-500">
        Booking ID: <span className="font-medium">{booking.id}</span>
      </p>

      <div className="mt-4 space-y-2 text-sm text-slate-700">
        <p>Room: {booking.roomNumber} - {booking.roomType}</p>
        <p>Check In: {booking.checkIn}</p>
        <p>Check Out: {booking.checkOut}</p>
        <p className="font-bold text-slate-900">Amount: ₹{booking.amount}</p>
      </div>

      <button
        onClick={() => onDelete(booking.id)}
        className="mt-5 w-full rounded-xl bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );
}