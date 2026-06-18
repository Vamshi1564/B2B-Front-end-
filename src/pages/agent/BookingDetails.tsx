import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config/api";

const BookingDetails = () => {
  const { bookingNumber } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH BOOKING ================= */
  useEffect(() => {
    if (!bookingNumber) return;

    const fetchDetails = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/bookings/details/${bookingNumber}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch booking details");
        }

        const result = await res.json();
        setData(result);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [bookingNumber]);

  /* ================= CANCEL BOOKING ================= */
  const cancelBooking = async () => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      const res = await fetch(
        `${API_URL}/api/bookings/cancel/${bookingNumber}`,
        { method: "PUT" }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Failed to cancel");
        return;
      }

      alert(
        `Booking Cancelled\n\nRefund: ₹${result.refundAmount}\nCancellation Charge: ₹${result.cancellationCharge}`
      );

      navigate("/agent/bookings");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-6 py-16">
          <p className="text-muted-foreground">
            Loading booking details...
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !data?.booking) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-6 py-16">
          <p className="text-red-500">
            {error || "Booking not found"}
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  /* ================= DATA ================= */

  const { booking } = data;

  const status = booking.status?.toLowerCase();

  const getStatusColor = () => {
    if (status === "confirmed") return "bg-green-100 text-green-600";
    if (status === "cancelled") return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-600";
  };

  const checkInDate = new Date(booking.check_in);
  const checkOutDate = new Date(booking.check_out);

  const nights = Math.max(
    1,
    Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-16 max-w-6xl">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">
            Booking Details
          </h1>

          <Button
            variant="outline"
            onClick={() => navigate("/agent/bookings")}
            className="rounded-xl"
          >
            Back to My Bookings
          </Button>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-3xl shadow-xl border p-10 space-y-10">
          {/* TOP */}
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">
                {booking.property_name}
              </h2>

              <p className="text-sm text-muted-foreground">
                Booking No:{" "}
                <span className="font-semibold text-foreground">
                  {booking.booking_number}
                </span>
              </p>

              <span
                className={`inline-block px-4 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}
              >
                {booking.status}
              </span>
            </div>

            <div className="text-left lg:text-right">
              <p className="text-sm text-muted-foreground">
                Total Amount
              </p>
              <p className="text-3xl font-bold text-primary">
                ₹{booking.total_amount}
              </p>
            </div>
          </div>

          {/* STAY DETAILS */}
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-muted/30 rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-2">
                Check-In
              </p>
              <p className="font-semibold text-lg">
                {checkInDate.toLocaleDateString()}
              </p>
            </div>

            <div className="bg-muted/30 rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-2">
                Check-Out
              </p>
              <p className="font-semibold text-lg">
                {checkOutDate.toLocaleDateString()}
              </p>
            </div>

            <div className="bg-muted/30 rounded-xl p-6">
              <p className="text-sm text-muted-foreground mb-2">
                Duration
              </p>
              <p className="font-semibold text-lg">
                {nights} Night{nights > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* CANCEL BUTTON */}
          {status !== "cancelled" &&
            new Date() < checkInDate && (
              <div className="pt-6 border-t">
                <Button
                  variant="destructive"
                  onClick={cancelBooking}
                  className="rounded-xl"
                >
                  Cancel Booking
                </Button>
              </div>
            )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingDetails;