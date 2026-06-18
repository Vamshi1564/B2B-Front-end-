import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getUser } from "@/utils/auth";
import { MapPin } from "lucide-react";
import { API_URL } from "@/config/api";

const PLAN_LABELS: Record<string, string> = {
  EP: "EP Rate ( Economy Plan Room Only )",
  CP: "CP Rate ( Continental Plan with Breakfast )",
  MAP: "MAP Rate ( Modified American Plan BF with Lunch or Dinner )",
  AP: "AP Rate ( American Plan BF Lunch & Dinner )",
};


const BookProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();

  const [property, setProperty] = useState<any>(null);
  const [roomId, setRoomId] = useState("");
  const [plan, setPlan] = useState("CP");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [adults, setAdults] = useState(2);
  const [childrenWithBed, setChildrenWithBed] = useState(0);
  const [childrenWithoutBed, setChildrenWithoutBed] = useState(0);

  const [price, setPrice] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ================= FETCH PROPERTY =================
  useEffect(() => {
    fetch(`${API_URL}/api/properties/${id}/full`)
      .then(res => res.json())
      .then(data => setProperty(data));
  }, [id]);

  // ================= CALCULATE PRICE =================
  const calculatePrice = async () => {
    if (!roomId || !checkIn || !checkOut) {
      alert("Please select room and dates");
      return;
    }

    setLoading(true);

    const res = await fetch(
      `${API_URL}/api/bookings/calculate-booking`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId,
          plan,
          checkIn,
          checkOut,
          adults,
          childrenWithBed,
          childrenWithoutBed
        })
      }
    );

    const data = await res.json();
    setPrice(data);
    setLoading(false);
  };

  // ================= CONFIRM BOOKING =================
  const confirmBooking = async () => {
    if (!price) {
      alert("Please calculate price first");
      return;
    }

    const res = await fetch(
      `${API_URL}/api/bookings/confirm-booking`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: id,
          roomId,
          plan,
          checkIn,
          checkOut,
          adults,
          childrenWithBed,
          childrenWithoutBed,
          agentId: user.id,
          totalAmount: price.totalAmount
        })
      }
    );

    const data = await res.json();

    if (res.ok) {
      navigate(`/agent/booking-success/${data.bookingNumber}`);
    } else {
      alert(data.message || "Booking failed");
    }
  };

  if (!property) return <div>Loading...</div>;

return (
  <div className="min-h-screen flex flex-col bg-[#f5f7fb]">
    <Header />

    <main className="flex-1 max-w-7xl mx-auto px-6 py-12">

      {/* PROPERTY HEADER */}
      <div className="bg-white rounded-3xl shadow-lg border overflow-hidden mb-10">

        {property.images?.[0] && (
          <div className="relative h-[300px]">
            <img
              src={`${API_URL}/uploads/${property.images[0].image_path}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl font-bold">
                {property.property.name}
              </h1>
              <p className="text-sm opacity-90">
                {property.property.area}, {property.property.city}
              </p>
            </div>
          </div>
        )}

        <div className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            {property.property.address}
          </div>

          <div className="px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            {property.property.category}
          </div>
        </div>

      </div>

      {/* BOOKING GRID */}
      <div className="grid lg:grid-cols-3 gap-10">

        {/* ================= LEFT SIDE ================= */}
        <div className="lg:col-span-2 space-y-8">

          <div className="bg-white rounded-3xl shadow-md border p-8 space-y-6">

            <h2 className="text-2xl font-semibold">
              Select Stay Details
            </h2>

            {/* ROOM SELECT */}
            <div>
              <label className="text-sm font-medium">
                Room Type
              </label>
              <select
                className="w-full mt-2 border rounded-xl p-3 focus:ring-2 focus:ring-primary"
                value={roomId}
                onChange={e => setRoomId(e.target.value)}
              >
                <option value="">Choose Room</option>
                {property.rooms.map((room: any) => (
                  <option key={room.id} value={room.id}>
                    {room.type} (Max {room.max_adults} Adults)
                  </option>
                ))}
              </select>
            </div>

            {/* PLAN */}
            <div>
              <label className="text-sm font-medium">
                Rate Plan
              </label>
              <select
  className="w-full mt-2 border rounded-xl p-3 focus:ring-2 focus:ring-primary"
  value={plan}
  onChange={e => setPlan(e.target.value)}
>
  <option value="">Select Plan</option>

  {["EP", "CP", "MAP", "AP"].map(p => (
    <option key={p} value={p}>
      {PLAN_LABELS[p]}
    </option>
  ))}

</select>
            </div>

            {/* DATES */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label>Check-In</label>
                <input
                  type="date"
                  className="w-full border rounded-xl p-3 mt-2"
                  onChange={e => setCheckIn(e.target.value)}
                />
              </div>

              <div>
                <label>Check-Out</label>
                <input
                  type="date"
                  className="w-full border rounded-xl p-3 mt-2"
                  onChange={e => setCheckOut(e.target.value)}
                />
              </div>
            </div>

            {/* GUESTS */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label>Adults</label>
                <input
                  type="number"
                  min={1}
                  value={adults}
                  className="w-full border rounded-xl p-3 mt-2"
                  onChange={e => setAdults(+e.target.value)}
                />
              </div>

              <div>
                <label>Child w/ Bed</label>
                <input
                  type="number"
                  min={0}
                  value={childrenWithBed}
                  className="w-full border rounded-xl p-3 mt-2"
                  onChange={e => setChildrenWithBed(+e.target.value)}
                />
              </div>

              <div>
                <label>Child w/o Bed</label>
                <input
                  type="number"
                  min={0}
                  value={childrenWithoutBed}
                  className="w-full border rounded-xl p-3 mt-2"
                  onChange={e => setChildrenWithoutBed(+e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={calculatePrice}
              disabled={loading}
              className="w-full h-14 text-lg rounded-xl"
            >
              {loading ? "Checking..." : "Check Availability"}
            </Button>

          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="sticky top-24 h-fit">

          <div className="bg-white rounded-3xl shadow-xl border p-8">

            <h3 className="text-xl font-semibold mb-6">
              Booking Summary
            </h3>

     {price ? (
  <div className="space-y-5">

    {/* Property & Room Info */}
    <div className="border-b pb-4 space-y-1">
      <p className="text-sm text-muted-foreground">
        {property.property.name}
      </p>

      <p className="text-sm">
        Room: {
          property.rooms.find((r:any)=> r.id === Number(roomId))?.type
        }
      </p>

      <p className="text-sm">
        Plan: {plan}
      </p>
    </div>

    {/* Stay Details */}
    <div className="flex justify-between">
  <span>Check-in</span>
  <span>
    {new Date(checkIn).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}
  </span>
</div>

<div className="flex justify-between">
  <span>Check-out</span>
  <span>
    {new Date(checkOut).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}
  </span>
</div>

    <div className="flex justify-between">
      <span>Total Nights</span>
      <span>{price.nights}</span>
    </div>

    {/* Pricing */}
    <div className="border-t pt-4 space-y-2">

      <div className="flex justify-between">
        <span>Base Amount</span>
        <span>₹{price.baseAmount}</span>
      </div>

      <div className="flex justify-between">
        <span>Extra Charges</span>
        <span>₹{price.extraAmount}</span>
      </div>

      <div className="flex justify-between font-semibold">
        <span>Total Booking</span>
        <span>₹{price.totalAmount}</span>
      </div>

    </div>

    {/* Commission Section */}
    {price?.commissionAmount !== undefined && (
      <div className="border-t pt-4 space-y-2">

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Commission (10%)</span>
          <span>- ₹{price.commissionAmount}</span>
        </div>

        <div className="flex justify-between text-xl font-bold text-primary">
          <span>Agent Payable</span>
          <span>₹{price.finalPayable}</span>
        </div>

      </div>
    )}

    <Button
      onClick={confirmBooking}
      className="w-full h-14 mt-4 rounded-xl text-lg"
    >
      Confirm Booking
    </Button>

  </div>
) : (
  <p className="text-sm text-muted-foreground">
    Select details to view price.
  </p>
)}

          </div>
        </div>

      </div>

    </main>

    <Footer />
  </div>
);
}
export default BookProperty;