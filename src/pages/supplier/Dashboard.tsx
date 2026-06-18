import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, IndianRupee, Plus } from "lucide-react";
import { getUser } from "@/utils/auth";
import SupplierPropertyGrid from "./SupplierPropertyGrid";
import { API_URL } from "@/config/api";

const SupplierDashboard = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const user = getUser();

  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
    totalEarnings: 0,
  });

  useEffect(() => {
  if (!user?.id) return;

  const fetchDashboard = async () => {
    try {
      // Stats
      const statsRes = await fetch(
        `${API_URL}/api/properties/supplier/${user.id}`
      );
      const statsData = await statsRes.json();
      if (statsRes.ok) setStats(statsData);

      // Property List
      const propRes = await fetch(
        `${API_URL}/api/properties/supplier/${user.id}/list`
      );
      const propData = await propRes.json();
      if (propRes.ok) setProperties(propData);

    } catch (err) {
      console.error(err);
    }
  };

  fetchDashboard();
}, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-background bg-gradient-to-br from-sky-200 via-sky-200 to-sky-200">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-14">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Supplier Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your properties, pricing and bookings
            </p>
          </div>

          <Link to="/supplier/add-property">
            <Button className="h-12 px-8 rounded-xl text-lg flex items-center gap-2 shadow-lg">
              <Plus size={18} /> Add Property
            </Button>
          </Link>
        </div>

        {/* STATS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-14 ">

          <StatCard
            icon={Building2}
            label="Total Properties"
            value={stats.totalProperties}
          />

          <StatCard
            icon={Calendar}
            label="Bookings"
            value={stats.totalBookings}
          />

          <StatCard
            icon={IndianRupee}
            label="Earnings"
            value={`₹${stats.totalEarnings}`}
          />

        </div>

        {/* PROPERTY LIST */}
<SupplierPropertyGrid properties={properties} />


      </main>

      <Footer />
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value }: any) => (
  <div className="bg-blue-50  border rounded-2xl p-8 shadow-lg hover:-translate-y-1 transition">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="text-primary" />
      </div>
      
      <p className="text-gray-800 text-sm text-sm uppercase tracking-widest">
        {label}
      </p>
    </div>

    <p className="text-3xl font-extrabold">{value}</p>
  </div>
);

export default SupplierDashboard;