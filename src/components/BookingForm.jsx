import { useState } from "react";

const initialState = {
  guestName: "",
  roomNumber: "",
  roomType: "Deluxe",
  checkIn: "",
  checkOut: "",
  status: "Pending",
  amount: "",
};

export default function BookingForm({ onAddBooking }) {
  const [form, setForm] = useState(initialState);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.guestName || !form.roomNumber || !form.checkIn || !form.checkOut) {
      alert("Please fill all required fields");
      return;
    }

    onAddBooking(form);
    setForm(initialState);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-white p-6 shadow-md"
    >
      <h2 className="mb-5 text-2xl font-bold text-slate-900">
        Add New Booking
      </h2>

      <div className="space-y-4">
        <input
          name="guestName"
          value={form.guestName}
          onChange={handleChange}
          placeholder="Guest Name"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500"
        />

        <input
          name="roomNumber"
          value={form.roomNumber}
          onChange={handleChange}
          placeholder="Room Number"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500"
        />

        <select
          name="roomType"
          value={form.roomType}
          onChange={handleChange}
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500"
        >
          <option>Deluxe</option>
          <option>Suite</option>
          <option>Standard</option>
          <option>Premium</option>
        </select>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="date"
            name="checkIn"
            value={form.checkIn}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500"
          />

          <input
            type="date"
            name="checkOut"
            value={form.checkOut}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500"
          />
        </div>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500"
        >
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Cancelled</option>
        </select>

        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500"
        />

        <button className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700">
          Add Booking
        </button>
      </div>
    </form>
  );
}