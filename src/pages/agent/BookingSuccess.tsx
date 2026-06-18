import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const BookingSuccess = () => {
  const { bookingNumber } = useParams();
  const navigate = useNavigate();

return (
  <div className="min-h-screen flex flex-col bg-[#f4f6fb]">
    <Header />

    <main className="flex-1 flex items-center justify-center px-6 py-16">

      <div className="max-w-2xl w-full">

        {/* SUCCESS CARD */}
        <div className="bg-white rounded-3xl shadow-2xl border overflow-hidden">

          {/* TOP SUCCESS STRIP */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-10 text-white text-center">

            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-md rounded-full p-6 shadow-lg">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-2">
              Booking Confirmed 🎉
            </h1>

            <p className="opacity-90 text-sm">
              Your reservation has been successfully processed.
            </p>

          </div>

          {/* BODY */}
          <div className="p-10 space-y-8 text-center">

            {/* BOOKING NUMBER CARD */}
            <div className="bg-[#f8fafc] rounded-2xl border p-6 shadow-sm">

              <p className="text-sm text-muted-foreground mb-2">
                Booking Reference Number
              </p>

              <p className="text-2xl font-bold text-primary tracking-wide">
                {bookingNumber}
              </p>

            </div>

            {/* WHAT NEXT */}
            <div className="bg-muted/30 rounded-2xl p-6 text-left space-y-3">

              <h3 className="font-semibold text-lg text-center mb-4">
                What happens next?
              </h3>

              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="mt-1 w-2 h-2 bg-green-500 rounded-full" />
                  Confirmation details will be shared with the supplier.
                </li>

                <li className="flex gap-3">
                  <span className="mt-1 w-2 h-2 bg-green-500 rounded-full" />
                  You can track booking status in your dashboard.
                </li>

                <li className="flex gap-3">
                  <span className="mt-1 w-2 h-2 bg-green-500 rounded-full" />
                  Please carry booking reference at check-in.
                </li>
              </ul>

            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-4 pt-4">

              <Button
                onClick={() => navigate("/agent/bookings")}
                className="w-full h-14 rounded-xl text-lg shadow-md"
              >
                View My Bookings
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/home")}
                className="w-full h-14 rounded-xl text-lg"
              >
                Explore More Properties
              </Button>

            </div>

          </div>

        </div>

      </div>

    </main>

    <Footer />
  </div>
);
};

export default BookingSuccess;