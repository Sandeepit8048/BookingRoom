// import React from 'react'
// import BookingCalendar from './components/Bookingcalendar';
// function App() {
//   return (
//     <>
//       <BookingCalendar />
//     </>
//   )
// }

// export default App


import { useState, useMemo } from "react";
import BOOKINGS_DATA from "./data/booking.json";
import StatsCard from "./components/StatsCard";
import BookingForm from "./components/BookingForm";
import BookingTable from "./components/BookingTable";
import BookingCard from "./components/BookingCard";

export default function App() {
  const [bookings, setBookings] = useState(BOOKINGS_DATA);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchSearch =
        booking.guestName.toLowerCase().includes(search.toLowerCase()) ||
        booking.roomNumber.includes(search) ||
        booking.id.toLowerCase().includes(search.toLowerCase());

      const matchStatus = status === "All" || booking.status === status;

      return matchSearch && matchStatus;
    });
  }, [bookings, search, status]);

  const totalRevenue = bookings.reduce((sum, item) => sum + item.amount, 0);

  function addBooking(newBooking) {
    setBookings([
      ...bookings,
      {
        ...newBooking,
        id: `BK${Date.now()}`,
        amount: Number(newBooking.amount),
      },
    ]);
  }

  function deleteBooking(id) {
    setBookings(bookings.filter((booking) => booking.id !== id));
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-500 p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold md:text-5xl">
            Hotel Booking Dashboard
          </h1>
          <p className="mt-3 text-blue-100">
            Manage bookings, rooms, guests and payments easily.
          </p>
        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <StatsCard title="Total Bookings" value={bookings.length} />
          <StatsCard
            title="Confirmed"
            value={bookings.filter((b) => b.status === "Confirmed").length}
          />
          <StatsCard title="Revenue" value={`₹${totalRevenue}`} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <BookingForm onAddBooking={addBooking} />

          <div className="rounded-3xl bg-white p-5 shadow-md">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <input
                type="text"
                placeholder="Search by guest, room or booking id..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 md:w-2/3"
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500"
              >
                <option>All</option>
                <option>Confirmed</option>
                <option>Pending</option>
                <option>Cancelled</option>
              </select>
            </div>

            <BookingTable
              bookings={filteredBookings}
              onDelete={deleteBooking}
            />
          </div>
        </div>
      </div>
    </div>
  );
}