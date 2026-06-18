// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { MapPin, CalendarDays } from "lucide-react";

// const bookings = [
//   {
//     id: 1,
//     property: "Grand Palace Hotel",
//     city: "Mumbai",
//     date: "12 Aug 2026 – 15 Aug 2026",
//     status: "Confirmed",
//     image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
//   },
//   {
//     id: 2,
//     property: "Palm Breeze Villa",
//     city: "Lonavala",
//     date: "20 Aug 2026 – 22 Aug 2026",
//     status: "Pending",
//     image: "https://images.pexels.com/photos/210617/pexels-photo-210617.jpeg",
//   },
// ];

// const statusStyle = (status: string) => {
//   if (status === "Confirmed") return "bg-green-100 text-green-700";
//   if (status === "Pending") return "bg-yellow-100 text-yellow-700";
//   return "bg-red-100 text-red-700";
// };

// const MyBookings = () => {
//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Header />

//       <main className="flex-1 container mx-auto px-6 py-16 max-w-6xl">

//         <h1 className="text-4xl font-bold mb-10">My Bookings</h1>

//         <div className="space-y-6">

//           {bookings.map(b => (
//             <Card
//               key={b.id}
//               className="flex flex-col md:flex-row overflow-hidden rounded-3xl shadow-lg hover:shadow-xl transition"
//             >
//               <img
//                 src={b.image}
//                 className="w-full md:w-64 h-48 object-cover"
//               />

//               <div className="flex-1 p-6 space-y-3">

//                 <div className="flex items-center justify-between">
//                   <h3 className="text-xl font-semibold">{b.property}</h3>
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(b.status)}`}
//                   >
//                     {b.status}
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-2 text-muted-foreground">
//                   <MapPin size={16} />
//                   {b.city}
//                 </div>

//                 <div className="flex items-center gap-2 text-muted-foreground">
//                   <CalendarDays size={16} />
//                   {b.date}
//                 </div>

//                 <Button variant="outline" className="mt-3 rounded-xl">
//                   View Details
//                 </Button>

//               </div>
//             </Card>
//           ))}

//         </div>

//       </main>

//       <Footer />
//     </div>
//   );
// };

// export default MyBookings;


import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getUser } from "@/utils/auth";
import { API_URL } from "@/config/api";

const MyBookings = () => {
  const user = getUser();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!user?.id) return;

    fetch(`${API_URL}/api/bookings/agent/${user.id}`)
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.error(err));
  }, [user]);

  /* ================= FILTER BOOKINGS ================= */
  const filteredBookings = useMemo(() => {
    if (activeTab === "all") return bookings;

    return bookings.filter(b =>
      b.status?.toLowerCase() === activeTab
    );
  }, [bookings, activeTab]);

  /* ================= STATUS STYLE ================= */
  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();

    if (s === "confirmed")
      return "bg-green-100 text-green-600";

    if (s === "cancelled")
      return "bg-red-100 text-red-600";

    return "bg-yellow-100 text-yellow-600"; // pending default
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-16 max-w-8xl">

  {/* HEADER */}
  <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-10">
    <h1 className="text-3xl font-bold">
      My Bookings
    </h1>

    <Button
      variant="outline"
      onClick={() => navigate("/home")}
      className="rounded-xl"
    >
      Explore Properties
    </Button>
  </div>

  {/* SUMMARY CARDS */}
  <div className="grid sm:grid-cols-3 gap-6 mb-12">
    <div className="bg-white rounded-2xl shadow-md border p-6">
      <p className="text-sm text-muted-foreground">Total Bookings</p>
      <p className="text-2xl font-bold">{bookings.length}</p>
    </div>

    <div className="bg-white rounded-2xl shadow-md border p-6">
      <p className="text-sm text-muted-foreground">Confirmed</p>
      <p className="text-2xl font-bold text-green-600">
        {bookings.filter(b => b.status?.toLowerCase() === "confirmed").length}
      </p>
    </div>

    <div className="bg-white rounded-2xl shadow-md border p-6">
      <p className="text-sm text-muted-foreground">Pending</p>
      <p className="text-2xl font-bold text-yellow-600">
        {bookings.filter(b => b.status?.toLowerCase() === "pending").length}
      </p>
    </div>
  </div>

        {/* STATUS FILTER TABS */}
        <div className="flex flex-wrap gap-4 mb-10">
          {[
            { label: "All", value: "all" },
            { label: "Confirmed", value: "confirmed" },
            { label: "Pending", value: "pending" },
            { label: "Cancelled", value: "cancelled" }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`
                px-5 py-2 rounded-full text-sm font-medium transition
                ${activeTab === tab.value
                  ? "bg-primary text-white shadow-md"
                  : "bg-white border hover:bg-muted"}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg border p-14 text-center">
            <h2 className="text-xl font-semibold mb-4">
              No {activeTab !== "all" ? activeTab : ""} bookings found
            </h2>
            <p className="text-muted-foreground mb-6">
              Start exploring and make your next reservation.
            </p>
            <Button
              onClick={() => navigate("/home")}
              className="rounded-xl"
            >
              Browse Properties
            </Button>
          </div>
        ) : (
          <div className="space-y-6">

            {filteredBookings.map(b => (
              <div
                key={b.id}
                className="bg-white rounded-3xl shadow-lg border p-10 hover:shadow-2xl transition"
              >

                <div className="flex flex-col lg:flex-row lg:justify-between gap-8">

                  {/* LEFT SECTION */}
                  <div className="space-y-4">

                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-semibold">
                        {b.property_name}
                      </h3>

                      <span
                        className={`px-4 py-1 rounded-full text-xs font-semibold ${getStatusColor(b.status)}`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Booking No:{" "}
                      <span className="font-semibold text-foreground">
                        {b.booking_number}
                      </span>
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <p>
                        Check-In:{" "}
                        <span className="font-medium text-foreground">
                          {new Date(b.check_in).toLocaleDateString()}
                        </span>
                      </p>

                      <p>
                        Check-Out:{" "}
                        <span className="font-medium text-foreground">
                          {new Date(b.check_out).toLocaleDateString()}
                        </span>
                      </p>
                    </div>

                  </div>

                  {/* RIGHT SECTION */}
                  <div className="flex flex-col lg:items-end justify-between gap-6">

                    <div className="text-left lg:text-right">
                      <p className="text-sm text-muted-foreground">
                        Total Amount
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        ₹{b.total_amount}
                      </p>
                    </div>

                    <Button
                      onClick={() =>
                        navigate(`/agent/booking/${b.booking_number}`)
                      }
                      className="rounded-xl"
                    >
                      View Details
                    </Button>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default MyBookings;