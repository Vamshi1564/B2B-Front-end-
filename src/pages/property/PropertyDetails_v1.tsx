import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { ArrowLeft, MapPin, Star, ArrowUpDown } from "lucide-react";
import {
  Pencil,
  Trash2,
  X,
  Tag,
  ShieldCheck,
  CalendarX,
  FileText,
  Bed,
  User,
  BadgeCheck,
  Phone,
  Wifi,
  ParkingCircle,
  Car,
  Coffee,
  Utensils,
  Tv,
  Wind,
  Waves,
  Dumbbell,
  WashingMachine,
  Bath,
  BedDouble,
  Refrigerator,
  Flame,
  AirVent,
  ConciergeBell,
  Briefcase,
  Baby,
  Dog,
  Cigarette,
  Bus,
  Plane,
  Bike,
  Trees,
  Sun,
  Moon,
  Camera,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUser } from "@/utils/auth";
import { ChevronDown } from "lucide-react";
import { API_URL } from "@/config/api";
import { Switch } from "@/components/ui/switch";
import HeroSearchBar from "@/components/HeroSearchBar";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const amenityIcons: any = {
  "free wifi": Wifi,
  "air conditioning": Wind,
  "swimming pool": Waves,

  parking: ParkingCircle,

  restaurant: Utensils,
  bar: Coffee,

  gym: Dumbbell,
  spa: Bath,

  "room service": ConciergeBell,

  "laundry service": WashingMachine,

  "power backup": Flame,

  elevator: ArrowUpDown,

  "conference hall": Briefcase,

  "doctor on call": User,

  "cctv security": Camera,

  "fire safety": ShieldCheck,
};
const plans = [
  { code: "EP", label: "(Economy Plan Room Only)" },
  { code: "CP", label: "(Continental Plan with Breakfast)" },
  { code: "MAP", label: "(Modified American Plan BF with Lunch or Dinner)" },
  { code: "AP", label: "(American Plan BF Lunch & Dinner)" },
];

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const [activePlan, setActivePlan] = useState<string>("EP");
  const [openRoom, setOpenRoom] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [openSight, setOpenSight] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [showFreeProperties, setShowFreeProperties] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "contact", label: "Contact" },
    { key: "rooms", label: "Rooms & Pricing" },
    { key: "amenities", label: "Amenities" },
    { key: "staff", label: "Staff" },
    { key: "nearby", label: "Sight Seeing" },
    { key: "checkin", label: "Check-in & Check-out" }, // ✅ NEW TAB
    { key: "policies", label: "Policies" },
    { key: "media", label: "Media" },
  ];
  const user = getUser();
  const isSupplier = user?.role === "supplier";
  const isAgent = user?.role === "agent";
  const isActiveAgent = Number(user?.is_active) === 1;

  const nextImage = () => {
    if (lightboxIndex === null) return;

    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % data.images.length : 0,
    );
  };

  const prevImage = () => {
    if (lightboxIndex === null) return;

    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + data.images.length) % data.images.length : 0,
    );
  };

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        const res = await fetch(`${API_URL}/api/properties/${id}/full`);
        const result = await res.json();

        if (res.ok) setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);
  // useEffect(() => {
  //   if (!data || !isAgent) return;

  //   if (!isActiveAgent && data?.locked_for_agent) {
  //     toast.error("Activate your agent account to view this property");
  //     navigate("/agent/payment");
  //   }
  // }, [data]);
  const isTabLocked = (tabKey: string) => {
    if (!isAgent) return false;
    if (isActiveAgent) return false;
    return tabKey !== "overview";
  };
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;

    try {
      const res = await fetch(`${API_URL}/api/properties/${id}/delete`, {
        method: "PUT",
      });

      if (res.ok) {
        alert("Property marked as deleted");
        navigate("/supplier/dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/categories`);
        const data = await res.json();
        setCategories(data);

        if (data.length > 0) {
          setActiveCategory(data[0].category_name);
        }
      } catch (error) {
        console.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col bg-background ">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Property not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  const heroImage =
    data.images?.find((img: any) => img.is_cover === 1)?.image_path ||
    data.images?.[0]?.image_path;

  function setLightbox(arg0: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background min-h-screen flex flex-col bg-background py-0 bg-gradient-to-br from-sky-200 via-sky-200 to-sky-200">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-16 mt-5">
        {/* SEARCH BAR */}
        <div className="fixed top-20 left-0 w-full z-50">
          <div className="container mx-auto px-4 py-3">
            <HeroSearchBar activeCategory={activeCategory} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ================= SIDEBAR ================= */}
          <div className="lg:col-span-1">
            <div className="hidden lg:block fixed top-60 left-20 w-[300px] h-[calc(100vh-80px)] overflow-y-auto z-40">
              <div className="bg-card border rounded-2xl shadow-xl overflow-hidden bg-[#F5E6C8]">
                <div className="px-5 py-4 font-semibold text-sm tracking-wide bg-muted">
                  Property Selection
                </div>

                <div className="p-3 space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.category_name)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium transition
                  ${
                    activeCategory === cat.category_name
                      ? "bg-accent text-white"
                      : "hover:bg-[#B8860B]"
                  }`}
                    >
                      {cat.category_name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* ================= RIGHT SIDE ================= */}
          <div className="lg:col-span-3">
            <Link to={isSupplier ? "/supplier/dashboard" : "/home"}>
              <Button variant="outline" className="rounded-xl mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>

            <div>
              {data?.images?.length > 0 && (
                <div className="relative rounded-3xl overflow-hidden group">
                  <div className="grid grid-cols-4 gap-2 h-[450px]">
                    {/* LARGE IMAGE */}
                    <div
                      className="col-span-2 cursor-pointer"
                      onClick={() => setLightboxIndex(0)}
                    >
                      <img
                        src={`${API_URL}/uploads/${data.images[0].image_path}`}
                        className="w-full h-full object-cover transition duration-500 hover:scale-105"
                      />
                    </div>

                    {/* SMALL IMAGES GRID */}
                    <div className="col-span-2 grid grid-cols-2 gap-2 overflow-hidden">
                      {data.images.slice(1, 9).map((img, index) => (
                        <div
                          key={img.id}
                          className="relative cursor-pointer"
                          onClick={() => setLightboxIndex(index)}
                        >
                          <img
                            src={`${API_URL}/uploads/${img.image_path}`}
                            className="w-full h-full object-cover transition duration-500 hover:scale-105"
                          />

                          {/* +X Overlay */}
                          {index === 7 && data.images.length > 9 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl font-semibold">
                              +{data.images.length - 9} Photos
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* GRADIENT OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                  {/* STATUS BADGE */}
                  {isSupplier && (
                    <span className="absolute top-6 left-6 bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-xl backdrop-blur-md">
                      {data?.property?.status || "Approved"}
                    </span>
                  )}

                  {/* PROPERTY INFO */}
                  <div className="absolute bottom-6 left-6 text-white">
                    <h2 className="text-2xl font-semibold drop-shadow-lg">
                      {data?.property?.name}
                    </h2>
                    <p className="text-sm opacity-90">{data?.property?.city}</p>
                  </div>
                </div>
              )}

              <div className="sticky top-0 z-30 mt-2 ">
                <div className="flex w-full border border-black rounded-[10px] overflow-hidden">
                  {tabs.map((tab, index) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 text-center px-3 py-1 text-xs font-medium border-r border-black transition-all duration-200
    ${
      activeTab === tab.key
        ? "bg-[#A72703] text-white"
        : "bg-[#FFE797] text-gray-800"
    }


                            
    ${index === tabs.length - 1 ? "border-r-0" : ""}
  `}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-12 bg-[#2E4D98] rounded-[10px] shadow-sm p-2 lg:p-4 mt-2">
                {/* PROFESSIONAL TABS */}

                {activeTab === "overview" && (
                  <div className="space-y-16 mt-2 ">
                    {/* Property Header Card */}

                    <div className="bg-[#C2E2FA] rounded-[10px] p-2 h-full">
                      <div className="bg-[#FFEBEE] p-10 shadow-sm border ">
                        <div className="flex flex-col xl:flex-row xl:justify-between gap-10 ">
                          {/* LEFT CONTENT */}
                          <div className="space-y-5 max-w-3xl">
                            {/* PROPERTY NAME */}
                            {/* <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                        {data?.property?.name}
                      </h1> */}
                            <h1
                              className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight 
bg-gradient-to-r from-[#A72703] to-[#D43C1C]
               bg-clip-text text-transparent 
               drop-shadow-lg"
                            >
                              {data?.property?.name}
                            </h1>

                            {/* LOCATION */}
                            <div className="flex items-start gap-3 text-muted-foreground ">
                              <MapPin className="w-5 h-5 mt-1 text-primary" />
                              <div>
                                <p className="font-medium text-foreground">
                                  {data?.property?.area}, {data?.property?.city}{" "}
                                  – {data?.property?.pincode}
                                </p>
                                <p className="text-sm mt-1">
                                  {data?.property?.address}
                                </p>
                              </div>
                            </div>

                            {/* CATEGORY BADGE */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 w-fit">
                              <Tag className="w-4 h-4" />
                              <span className="text-xs uppercase tracking-wider font-semibold">
                                {data?.property?.category}
                              </span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 mx-2 rounded-full bg-primary/10 text-primary border border-primary/20 w-fit">
                              <Bed className="w-4 h-4" />
                              <span className="text-xs uppercase tracking-wider font-semibold">
                                {data?.property?.total_rooms ?? 0} Rooms
                              </span>
                            </div>
                          </div>

                          {/* RIGHT SIDE CTA / ACTIONS */}
                          <div className="flex flex-col items-start xl:items-end gap-4">
                            {/* Agent Booking CTA */}
                            {isAgent && !isActiveAgent && (
                              <Button
                                className="rounded-2xl px-10 h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => navigate(`/agent/payment`)}
                              >
                                Pay Now
                              </Button>
                            )}

                            {isAgent && isActiveAgent && (
                              <Button
                                className="rounded-2xl px-10 h-14 text-lg bg-green-600 hover:bg-green-700 text-white"
                                onClick={() =>
                                  navigate(`/agent/book/${data.property.id}`)
                                }
                              >
                                Book Now
                              </Button>
                            )}
                          </div>
                        </div>
                        {data?.checkin && (
                          <div className="border-t pt-5">
                            {/* <h2 className="w-full bg-[#A72703] text-white text-2xl font-semibold mb-8 px-6 py-2"> */}
                            <h2 className="w-[calc(100%+80px)] -mx-10 bg-red-600 text-white text-center font-bold text-lg lg:text-2xl py-2 rounded-t-lg">
                              Check-in Information
                            </h2>

                            <div className="w-[calc(100%+60px)] -mx-8 grid md:grid-cols-2 gap-6 text-sm mt-3 border border-black rounded-[10px] p-3 bg-[#FFE797]">
                              <p>
                                <strong>Check-in:</strong>{" "}
                                {data.checkin.check_in_time}
                              </p>

                              <p>
                                <strong>Check-out:</strong>{" "}
                                {data.checkin.check_out_time}
                              </p>

                              <p>
                                <strong>24Hr Check-in:</strong>{" "}
                                {data.checkin.is_24hr_checkin ? "Yes" : "No"}
                              </p>

                              <p>
                                <strong>Early Check-in:</strong>{" "}
                                {data.checkin.early_checkin_allowed
                                  ? `Allowed (₹${data.checkin.early_checkin_charge})`
                                  : "Not Allowed"}
                              </p>

                              <p>
                                <strong>Late Check-out:</strong>{" "}
                                {data.checkin.late_checkout_allowed
                                  ? `Allowed (₹${data.checkin.late_checkout_charge})`
                                  : "Not Allowed"}
                              </p>

                              <p>
                                <strong>ID Proof Required:</strong>{" "}
                                {data.checkin.id_proof_required ? "Yes" : "No"}
                              </p>
                            </div>
                          </div>
                        )}
                        {isSupplier && data?.bank && (
                          <div className="border-t pt-5">
                            <h2 className="w-[calc(100%+80px)] -mx-10 bg-red-600 text-white text-center font-bold text-lg lg:text-2xl py-2 rounded-t-lg">
                              Bank Details
                            </h2>

                            <div className="w-[calc(100%+60px)] -mx-8 grid md:grid-cols-2 gap-6 text-sm mt-3 border border-black rounded-[10px] p-3 bg-[#FFE797]">
                              <p>
                                <strong>Account Holder:</strong>{" "}
                                {data.bank.account_holder}
                              </p>
                              <p>
                                <strong>Bank Name:</strong>{" "}
                                {data.bank.bank_name}
                              </p>
                              <p>
                                <strong>Account Number:</strong>{" "}
                                {data.bank.account_number}
                              </p>
                              <p>
                                <strong>IFSC:</strong> {data.bank.ifsc}
                              </p>
                              <p>
                                <strong>Branch:</strong> {data.bank.branch}
                              </p>
                            </div>
                          </div>
                        )}
                        {data?.faqs?.length > 0 && (
                          <div className="border-t pt-5">
                            <h2 className="w-[calc(100%+80px)] -mx-10 bg-red-600 text-white text-center font-bold text-lg lg:text-2xl py-2 rounded-t-lg">
                              FAQs
                            </h2>

                            <div className="space-y-4 mt-4">
                              {data.faqs.map((faq: any, index: number) => (
                                <div
                                  key={faq.id}
                                  className="w-[calc(100%+60px)] -mx-8 border border-black rounded-[10px] bg-[#FFE797]"
                                >
                                  {/* Question */}
                                  <div
                                    className="flex justify-between items-center p-3 cursor-pointer"
                                    onClick={() => toggleFAQ(index)}
                                  >
                                    <h4 className="font-semibold">
                                      {faq.question}
                                    </h4>

                                    {openIndex === index ? (
                                      <FaChevronUp />
                                    ) : (
                                      <FaChevronDown />
                                    )}
                                  </div>

                                  {/* Answer */}
                                  {openIndex === index && (
                                    <div className="px-3 pb-3 text-sm text-muted-foreground">
                                      {faq.answer}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "contact" && (
                  <div className="space-y-16 mt-2">
                    <div className="bg-[#C2E2FA] rounded-[10px] p-2 h-full">
                      <div className="bg-[#FFEBEE] rounded-[20px] pl-6 pr-6 shadow-sm border">
                        <h2 className="w-[calc(100%+50px)] -mx-6 bg-red-600 text-white text-center font-bold text-lg lg:text-2xl py-2 rounded-t-lg">
                          Contact Details
                        </h2>

                        <div className="w-[calc(100%+10px)] -mx-1 mb-3 grid md:grid-cols-2 gap-6 text-sm mt-3 border border-black rounded-[10px] p-3 bg-[#FFE797]">
                          <p>
                            <strong>Name:</strong> {data?.property?.name}
                          </p>

                          <p>
                            <strong>Category:</strong>{" "}
                            {data?.property?.category}
                          </p>

                          <p>
                            <strong>Contact:</strong> {data?.property?.contact}
                          </p>

                          <p>
                            <strong>Email:</strong> {data?.property?.email}
                          </p>

                          <p>
                            <strong>Address:</strong> {data?.property?.address}
                          </p>

                          <p>
                            <strong>City:</strong> {data?.property?.city}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* {activeTab === "rooms" && (
                  <div className="space-y-16 mt-2">

                           <div className="bg-[#C2E2FA] rounded-[10px] p-2 h-full">
                      <div className="bg-[#FFEBEE] rounded-[20px] pl-6 pr-6 shadow-sm border">
                        <h2 className="w-[calc(100%+50px)] -mx-6 bg-red-600 text-white text-center font-bold text-lg lg:text-2xl py-2 rounded-t-lg">
                             Room Pricing
                        </h2>

               
                      <div className="flex flex-wrap gap-4 mb-10">
                        {plans.map((plan) => (
                          <button
                            key={plan.code}
                            onClick={() => setActivePlan(plan.code)}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300
            ${
              activePlan === plan.code
                ? "bg-[#A72703] text-white shadow-md scale-105"
                : "bg-[#FFE797] text-gray-800"
            }`}
                          >
                            {plan.code}
                            <span className="ml-2 text-xs opacity-70">
                              {plan.label}
                            </span>
                          </button>
                        ))}
                      </div>
                      </div>

                    
                      <div className="space-y-8">
                        {data?.rooms?.map((room) => {
                          const roomRates = data?.rates?.filter(
                            (r) =>
                              r.room_id === room.id && r.plan === activePlan,
                          );

                          if (!roomRates.length) return null;

                          const weekday = roomRates.find(
                            (r) => r.rate_type === "weekday",
                          );

                          const weekend = roomRates.find(
                            (r) => r.rate_type === "weekend",
                          );

                          const longWeekend = roomRates.find(
                            (r) => r.rate_type === "long_weekend",
                          );

                          const lowest = Math.min(
                            weekday?.base_price || Infinity,
                            weekend?.base_price || Infinity,
                            longWeekend?.base_price || Infinity,
                          );

                          return (
                            <div
                              key={room.id}
                              className="bg-white border rounded-3xl shadow-md overflow-hidden"
                            >
                         
                              <div
                                className="bg-blue-50 p-8 cursor-pointer flex justify-between items-center"
                                onClick={() =>
                                  setOpenRoom(
                                    openRoom === room.id ? null : room.id,
                                  )
                                }
                              >
                                <div>
                                  <h3 className="text-xl font-semibold">
                                    {room.type}
                                  </h3>

                                  <p className="text-sm text-gray-500 mt-1">
                                    Max {room.max_adults} Adults •{" "}
                                    {room.max_children} Children
                                  </p>
                                </div>

                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <p className="text-sm text-gray-500">
                                      Starting From
                                    </p>

                                    <p className="text-2xl font-bold text-[#A72703]">
                                      ₹{lowest}
                                    </p>
                                  </div>

                                  <ChevronDown
                                    className={`transition-transform duration-300 ${
                                      openRoom === room.id ? "rotate-180" : ""
                                    }`}
                                  />
                                </div>
                              </div>

                      
                              {openRoom === room.id && (
                                <div className="border-t p-8 bg-white">
                                  <div className="overflow-x-auto">
                                    <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
                               
                                      <thead className="bg-[#A72703] text-white">
                                        <tr>
                                          <th className="px-6 py-3 text-left">
                                            Rate Type
                                          </th>
                                          <th className="px-6 py-3 text-left">
                                            Base Price
                                          </th>
                                          <th className="px-6 py-3 text-left">
                                            Extra Adult
                                          </th>
                                          <th className="px-6 py-3 text-left">
                                            Child w/ Bed
                                          </th>
                                          <th className="px-6 py-3 text-left">
                                            Child w/o Bed
                                          </th>
                                          <th className="px-6 py-3 text-left">
                                            Dates
                                          </th>
                                        </tr>
                                      </thead>

                               
                                      <tbody className="bg-white">
                                        {[weekday, weekend, longWeekend].map(
                                          (rate, index) => {
                                            if (!rate) return null;

                                            return (
                                              <tr
                                                key={index}
                                                className="border-t hover:bg-gray-50 transition"
                                              >
                                               
                                                <td className="px-6 py-4 font-medium">
                                                  {rate.rate_type ===
                                                    "weekday" && "Weekday"}

                                                  {rate.rate_type ===
                                                    "weekend" && (
                                                    <>
                                                      Weekend
                                                      <span className="ml-2 text-xs bg-[#A72703] text-white px-2 py-1 rounded-full">
                                                        Peak
                                                      </span>
                                                    </>
                                                  )}

                                                  {rate.rate_type ===
                                                    "long_weekend" && (
                                                    <>
                                                      Long Weekend
                                                      <span className="ml-2 text-xs bg-[#A72703] text-white px-2 py-1 rounded-full">
                                                        Seasonal
                                                      </span>
                                                    </>
                                                  )}
                                                </td>

                                                <td className="px-6 py-4 font-bold text-[#A72703]">
                                                  ₹{rate.base_price}
                                                </td>

                                       
                                                <td className="px-6 py-4">
                                                  ₹{rate.extra_adult_price || 0}
                                                </td>

                                          
                                                <td className="px-6 py-4">
                                                  ₹
                                                  {rate.child_with_bed_price ||
                                                    0}
                                                </td>

                                                <td className="px-6 py-4">
                                                  ₹
                                                  {rate.child_without_bed_price ||
                                                    0}
                                                </td>

                                              
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                  {rate.rate_type ===
                                                    "long_weekend" &&
                                                    rate.long_weekend_from &&
                                                    rate.long_weekend_to && (
                                                      <>
                                                        {new Date(
                                                          rate.long_weekend_from,
                                                        ).toLocaleDateString()}{" "}
                                                        -{" "}
                                                        {new Date(
                                                          rate.long_weekend_to,
                                                        ).toLocaleDateString()}
                                                      </>
                                                    )}
                                                </td>
                                              </tr>
                                            );
                                          },
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )} */}

                {activeTab === "rooms" && (
                  <div className="space-y-16 mt-2">
                    {/* HEADER */}
                    <div className="bg-[#C2E2FA] rounded-[10px] p-2 h-full">
                      <div className="bg-[#FFEBEE] rounded-[20px] pl-6 pr-6 shadow-sm border">
                        <h2 className="w-[calc(100%+50px)] -mx-6 bg-red-600 text-white text-center font-bold text-lg lg:text-2xl py-2 rounded-t-lg">
                          Room Pricing
                        </h2>
                    

                    

                      {/* ROOMS */}
                      <div className="space-y-8 mt-6">
                        {data?.rooms?.map((room) => {
                          const roomRates = data?.rates?.filter(
                            (r) =>
                              r.room_id === room.id && r.plan === activePlan,
                          );

                          if (!roomRates.length) return null;

                          // Rate types
                          const weekday = roomRates.find(
                            (r) => r.rate_type === "weekday",
                          );
                          const weekend = roomRates.find(
                            (r) => r.rate_type === "weekend",
                          );
                          const longWeekend = roomRates.find(
                            (r) => r.rate_type === "long_weekend",
                          );

                          return (
                            <div
                              key={room.id}
                              className="bg-white border rounded-[10px] shadow-md overflow-hidden"
                            >
                              <div className="bg-[#A72703] p-2 flex justify-between items-center">
                                <div>
                                  <h3 className="text-xl text-white font-semibold">
                                    {room.type}
                                  </h3>

                                  <p className="text-sm text-white mt-1">
                                    Max {room.max_adults} Adults •{" "}
                                    {room.max_children} Children
                                  </p>
                                </div>
                              </div>

                              {/* TABLE - always visible */}
                              <div className="border-t p-6 bg-[#FFE797] overflow-x-auto">
                                <table className="w-full border bg-[#FFEBEE] border-gray-400 text-sm text-center">
                                  {/* ===== HEADERS ===== */}
                                  <thead>
                                    <tr>
                                      <th className="border bg-blue-900 text-white px-3 py-2">
                                        Normal Rate
                                      </th>
                                      <th
                                        colSpan={4}
                                        className="border bg-teal-400 px-3 py-2"
                                      >
                                        Public Holiday
                                      </th>
                                      <th className="border"></th>
                                      <th className="border"></th>
                                      <th className="border"></th>
                                    </tr>

                                    <tr className="bg-red-600 text-white">
                                      <th className="border"></th>
                                      <th className="border">Valid From</th>
                                      <th className="border"></th>
                                      <th className="border">Valid Till</th>
                                      <th className="border"></th>
                                      <th className="border"></th>
                                      <th className="border"></th>
                                      <th className="border"></th>
                                    </tr>

                                    <tr className="bg-yellow-600 text-white">
                                      <th className="border px-2 py-2">
                                        Room Type
                                      </th>
                                      <th className="border px-2 py-2">
                                        Rooms
                                      </th>
                                      <th className="border px-2 py-2">CPAI</th>
                                      <th className="border px-2 py-2">
                                        MAPAI
                                      </th>
                                      <th className="border px-2 py-2">APAI</th>
                                      <th className="border px-2 py-2">
                                        Ex Person
                                      </th>
                                      <th className="border px-2 py-2">
                                        Chd With Bed
                                      </th>
                                      <th className="border px-2 py-2">
                                        Chd No Bed
                                      </th>
                                    </tr>
                                  </thead>

                                  {/* ===== BODY ===== */}
                                  <tbody>
                                    {[weekday, weekend, longWeekend].map(
                                      (rate, i) => {
                                        if (!rate) return null;

                                        return (
                                          <tr key={i}>
                                            <td className="border px-2 py-2">
                                              {room.type}
                                            </td>
                                            <td className="border px-2 py-2">
                                              1
                                            </td>

                                            <td className="border px-2 py-2">
                                              ₹{rate.base_price}
                                            </td>

                                            <td className="border px-2 py-2">
                                              ₹{rate.map_price || "-"}
                                            </td>

                                            <td className="border px-2 py-2">
                                              ₹{rate.ap_price || "-"}
                                            </td>

                                            <td className="border px-2 py-2">
                                              ₹{rate.extra_adult_price || 0}
                                            </td>

                                            <td className="border px-2 py-2">
                                              ₹{rate.child_with_bed_price || 0}
                                            </td>

                                            <td className="border px-2 py-2">
                                              ₹
                                              {rate.child_without_bed_price ||
                                                0}
                                            </td>
                                          </tr>
                                        );
                                      },
                                    )}
                                  </tbody>

                                  {/* ===== EXTRA DETAILS ===== */}
                                  <tbody>
                                    <tr>
                                      <td
                                        colSpan={4}
                                        className="border text-left px-4 py-2 font-semibold"
                                      >
                                        Meals
                                      </td>
                                      <td
                                        colSpan={2}
                                        className="border font-semibold"
                                      >
                                        Price
                                      </td>
                                      <td
                                        colSpan={2}
                                        className="border font-semibold"
                                      >
                                        Check-in / out
                                      </td>
                                    </tr>

                                    <tr>
                                      <td
                                        colSpan={4}
                                        className="border text-left px-4 py-2"
                                      >
                                        {data?.meals?.lunch || "Buffet Lunch"}
                                      </td>
                                      <td colSpan={2} className="border">
                                        ₹{data?.meals?.lunch_price || "-"}
                                      </td>
                                      <td colSpan={2} className="border">
                                        {data?.checkin_time || "14:00 PM"}
                                      </td>
                                    </tr>

                                    <tr>
                                      <td
                                        colSpan={4}
                                        className="border text-left px-4 py-2"
                                      >
                                        {data?.meals?.dinner || "Buffet Dinner"}
                                      </td>
                                      <td colSpan={2} className="border">
                                        ₹{data?.meals?.dinner_price || "-"}
                                      </td>
                                      <td colSpan={2} className="border">
                                        {data?.checkout_time || "11:00 AM"}
                                      </td>
                                    </tr>

                                    <tr>
                                      <td
                                        colSpan={4}
                                        className="border text-left px-4 py-2"
                                      >
                                        24 Hours Check-in
                                      </td>
                                      <td colSpan={4} className="border">
                                        {data?.checkin_24hrs ||
                                          "Applicable / Not Applicable"}
                                      </td>
                                    </tr>

                                    {/* REMARKS */}
                                    <tr>
                                      <td
                                        colSpan={8}
                                        className="border font-semibold py-2"
                                      >
                                        Hotel Remarks
                                      </td>
                                    </tr>

                                    <tr>
                                      <td
                                        colSpan={8}
                                        className="border h-[120px]"
                                      >
                                        {data?.remarks || ""}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                        </div>
                    </div>
                  </div>
                )}

                {activeTab === "amenities" && data?.amenities?.length > 0 && (
                  <div className="space-y-16 mt-2">
                    {/* <div className="bg-[#FFEBEE] rounded-3xl p-10 shadow-sm border">
                      <h2 className="w-full bg-[#A72703] rounded-t-lg text-white text-2xl font-semibold mb-8 px-6 py-4">
                        Amenities
                      </h2> */}

                    <div className="bg-[#C2E2FA] rounded-[10px] p-2 h-full">
                      <div className="bg-[#FFEBEE] rounded-3xl pl-6 pr-6 shadow-sm border">
                        <h2 className="w-[calc(100%+50px)] -mx-6 bg-red-600 text-white text-center font-bold text-lg lg:text-2xl py-2 rounded-t-lg">
                          Amenities
                        </h2>

                        <div className="w-[calc(100%+10px)] -mx-1 mb-3 flex flex-wrap justify-start gap-3 text-sm mt-3 border border-black rounded-[10px] p-3 bg-[#FFE797]">
                          {data.amenities.map((a: any) => {
                            const name = a.amenity_name?.toLowerCase().trim();
                            const Icon = amenityIcons[name] || ConciergeBell;

                            return (
                              <div
                                key={a.id}
                                className="flex items-center gap-2 px-3 py-1 bg-primary rounded-[5px] text-white text-xs w-fit whitespace-nowrap"
                              >
                                <Icon size={14} />
                                {a.amenity_name}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "staff" && data?.staff?.length > 0 && (
                  <div className="space-y-16 mt-2">
              
                          <div className="bg-[#C2E2FA] rounded-[10px] p-2 h-full">
                      <div className="bg-[#FFEBEE] rounded-[18px] pl-6 pr-6 shadow-sm border">
                        <h2 className="w-[calc(100%+50px)] -mx-6 bg-red-600 text-white text-center font-bold text-lg lg:text-2xl py-2 rounded-t-lg">
                          Staff
                        </h2>
                      <div className="grid md:grid-cols-2 gap-8 mt-5 mb-5">
                        {data.staff.map((s: any) => {
                          const phones = Array.isArray(s.phones)
                            ? s.phones
                            : JSON.parse(s.phones || "[]");

                          const emails = Array.isArray(s.emails)
                            ? s.emails
                            : JSON.parse(s.emails || "[]");

                          return (
                            <div
                              key={s.id}
                              className="border bg-[#FAFAD2] shadow-sm"
                            >
                              <table className="w-full border border-white text-sm">
                                <tbody>
                                  <tr>
                                    {/* LEFT SIDE IMAGE (ROWSPAN FULL HEIGHT) */}
                                    <td
                                      rowSpan={5}
                                      className="border w-56 text-center align-top"
                                    >
                                      {s.photo &&
                                      (s.show_photo || isSupplier) ? (
                                        <img
                                          src={`${API_URL}/uploads/${s.photo}`}
                                          className="w-full h-48 object-cover"
                                          alt={s.name}
                                        />
                                      ) : (
                                        <div className="h-48 flex items-center justify-center text-gray-400">
                                          No Image
                                        </div>
                                      )}
                                    </td>

                                    {/* NAME */}
                                    <td className="font-semibold p-2 border bg-[#FAFAD2] w-32">
                                      Name
                                    </td>
                                    <td className="p-2 border">{s.name}</td>
                                  </tr>

                                  {/* POST */}
                                  <tr>
                                    <td className="font-semibold p-2 border bg-[#FAFAD2]">
                                      Post
                                    </td>
                                    <td className="p-2 border">
                                      {s.designation}
                                    </td>
                                  </tr>

                                  {/* PHONE */}
                                  {(s.show_phones || isSupplier) && (
                                    <tr>
                                      <td className="font-semibold p-2 border bg-[#FAFAD2]">
                                        Cell No
                                      </td>
                                      <td className="p-2 border">
                                        {phones.join(", ")}
                                      </td>
                                    </tr>
                                  )}

                                  {/* EMAIL */}
                                  {(s.show_emails || isSupplier) &&
                                    emails?.length > 0 && (
                                      <tr>
                                        <td className="font-semibold p-2 border bg-[#FAFAD2]">
                                          Mail Id
                                        </td>
                                        <td className="p-2 border">
                                          {emails.join(", ")}
                                        </td>
                                      </tr>
                                    )}

                                  {/* LANDLINE */}
                                  <tr>
                                    <td className="font-semibold p-2 border bg-[#FAFAD2]">
                                      Landline
                                    </td>
                                    <td className="p-2 border">
                                      {s.landline || "--"}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          );
                        })}
                      </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "nearby" && data?.sightseeing?.length > 0 && (
                  <div className="space-y-16 mt-2">
                    {/* Property Header Card */}

                    <div className="bg-[#C2E2FA] rounded-[10px] p-2 h-full">
                      <div className="bg-[#FFEBEE] rounded-3xl pl-6 pr-6 shadow-sm border">
                        <h2 className="w-[calc(100%+50px)] -mx-6 bg-red-600 text-white text-center font-bold text-lg lg:text-2xl py-2 rounded-t-lg">
                          Nearby Attractions
                        </h2>
                        <div className="w-[calc(100%+10px)] -mx-1 mb-3 flex flex-wrap justify-start gap-3 text-sm mt-3 border border-black rounded-[10px] p-3 bg-[#FFE797]">
                          {data.sightseeing.map((place: any) => (
                            <div
                              key={place.id}
                              className="w-[50%] border rounded-xl p-6 bg-[#FFEBEE] shadow-sm hover:shadow-md transition"
                            >
                              <h4 className="font-semibold text-lg">
                                {place.place_name}
                              </h4>

                              <p className="text-sm text-muted-foreground mt-1">
                                {place.distance_km} km • {place.travel_time}
                              </p>

                              <p className="text-sm mt-3 text-muted-foreground">
                                {place.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* {activeTab === "policies" && (
                  <div className="space-y-16 mt-2">
                  
                        <div className="bg-[#C2E2FA] rounded-[10px] p-2 h-full">
                      <div className="bg-[#FFEBEE] rounded-3xl pl-6 pr-6 shadow-sm border">
                        <h2 className="w-[calc(100%+50px)] -mx-6 bg-red-600 text-white text-center font-bold text-lg lg:text-2xl py-2 rounded-t-lg">
                          Policies & Terms
                        </h2>

                      <div className="space-y-10">
                      
                        {data?.policies?.booking_policy && (
                          <div className="border-b pb-8">
                            <div className="flex items-center p-1 gap-3 mb-5 bg-blue-50">
                              <ShieldCheck className="w-6 h-6 text-primary " />
                              <h4 className="font-semibold text-xl">
                                Booking Policy
                              </h4>
                            </div>

                            <ul className="space-y-3 text-sm text-black-foreground leading-relaxed">
                              {data.policies.booking_policy
                                .split("\n")
                                .map((item: string, i: number) => (
                                  <li key={i} className="flex gap-3">
                                    <span className="mt-2 w-2 h-2 bg-primary rounded-full" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}

                 
                        {data?.policies?.cancellation_policy && (
                          <div className="border-b pb-8">
                            <div className="flex items-center p-1 gap-3 mb-5 bg-blue-50">
                              <CalendarX className="w-6 h-6 text-primary" />
                              <h4 className="font-semibold text-xl">
                                Cancellation Policy
                              </h4>
                            </div>

                            <ul className="space-y-3 text-sm text-black-foreground leading-relaxed">
                              {data.policies.cancellation_policy
                                .split("\n")
                                .map((item: string, i: number) => (
                                  <li key={i} className="flex gap-3">
                                    <span className="mt-2 w-2 h-2 bg-primary rounded-full" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}

                 
                        {data?.cancellationRules?.length > 0 && (
                          <div>
                            <h3 className="text-xl font-semibold mb-6">
                              Cancellation Charges
                            </h3>

                            <div className="space-y-4">
                              {data.cancellationRules.map((rule: any) => (
                                <div
                                  key={rule.id}
                                  className="border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition"
                                >
                                  <p className="font-medium">
                                    {rule.from_days} – {rule.to_days} Days
                                    Before Check-in
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Charge: {rule.charge_value}{" "}
                                    {rule.charge_type === "percentage"
                                      ? "%"
                                      : "₹"}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {data?.policies?.child_policy && (
                          <div className="border-b pb-8">
                            <div className="flex items-center p-1 gap-3 mb-5 bg-blue-50">
                              <FileText className="w-6 h-6 text-primary" />
                              <h4 className="font-semibold text-xl">
                                Child Policy
                              </h4>
                            </div>

                            <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                              {data.policies.child_policy
                                .split("\n")
                                .map((item: string, i: number) => (
                                  <li key={i} className="flex gap-3">
                                    <span className="mt-2 w-2 h-2 bg-primary rounded-full" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                        {data?.policies?.pet_policy && (
                          <div className="border-b pb-8">
                            <div className="flex items-center p-1 gap-3 mb-5 bg-blue-50">
                              <FileText className="w-6 h-6 text-primary" />
                              <h4 className="font-semibold text-xl">
                                Pet Policies
                              </h4>
                            </div>

                            <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                              {data.policies.pet_policy
                                .split("\n")
                                .map((item: string, i: number) => (
                                  <li key={i} className="flex gap-3">
                                    <span className="mt-2 w-2 h-2 bg-primary rounded-full" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                      
                        {data?.policies?.terms && (
                          <div>
                            <div className="flex items-center p-1 gap-3 mb-5 bg-blue-50">
                              <FileText className="w-6 h-6 text-primary" />
                              <h4 className="font-semibold text-xl">
                                Terms & Conditions
                              </h4>
                            </div>

                            <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                              {data.policies.terms
                                .split("\n")
                                .map((item: string, i: number) => (
                                  <li key={i} className="flex gap-3">
                                    <span className="mt-2 w-2 h-2 bg-primary rounded-full" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      </div>
                    </div>
                  </div>
                )} */}

                {activeTab === "policies" && (
                  <div className="space-y-16 mt-2">
                    <div className="bg-[#C2E2FA] rounded-[10px] p-2 h-full mb-2">
                      <div className="bg-[#FFEBEE] rounded-2xl pl-6 pr-6 shadow-sm border pb-5">
                        <h2 className="w-[calc(100%+50px)] -mx-6 bg-red-600 text-white text-center font-bold text-lg lg:text-2xl py-2 rounded-t-lg">
                          Policies & Terms
                        </h2>

                        {/* MAIN LAYOUT */}
                        <div className="flex flex-col md:flex-row justify-between items-stretch gap-8 mt-6">
                          {/* LEFT SIDE - BOOKING POLICY */}
                          {data?.policies?.booking_policy && (
                            <div className="w-full md:w-1/2 border rounded-[20px] pl-4 pr-4 pb-4 bg-[#FFE797] h-full">
                              <div className="flex items-center gap-3 mb-2 bg-blue-50">
                                <h4 className="w-[calc(100%+40px)] -mx-4 bg-[#2E4D98] text-white text-center font-bold text-lg lg:text-1xl py-2 rounded-t-lg">
                                  Booking Policy
                                </h4>
                              </div>

                              <ul className="space-y-3 text-sm leading-relaxed text-justify mt-5 mb-5">
                                {data.policies.booking_policy
                                  .split("\n")
                                  .map((item: string, i: number) => (
                                    <li key={i} className="flex gap-3">
                                      <span className="mt-2 w-2 h-2 bg-primary rounded-full" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )}

                          {/* RIGHT SIDE - ALL OTHER POLICIES */}
                          <div className="w-full md:w-1/2 space-y-6">
                            {/* Cancellation Policy */}
                            {data?.policies?.cancellation_policy && (
                              <div className="border rounded-xl rounded-[25px] pl-4 pr-4 pb-4 bg-[#FFE797]">
                                <div className="flex items-center gap-3 mb-3 bg-blue-50">
                                  {/* <CalendarX className="w-6 h-6 text-primary" /> */}

                                  <h4 className="w-[calc(100%+40px)] -mx-4 bg-[#2E4D98] text-white text-center font-bold text-lg lg:text-1xl py-2 rounded-t-lg">
                                    Cancellation Policy
                                  </h4>
                                </div>

                                <p className="text-sm text-justify mt-5 mb-5">
                                  {data.policies.cancellation_policy}
                                </p>
                              </div>
                            )}

                            {/* Cancellation Charges */}
                            {data?.cancellationRules?.length > 0 && (
                              <div className="border rounded-xl rounded-[25px] pl-4 pr-4 pb-4 bg-[#FFE797]">
                                <h4 className="w-[calc(100%+32px)] -mx-4 bg-[#2E4D98] text-white text-center font-bold text-lg lg:text-1xl py-2 rounded-t-lg">
                                  Cancellation Charges
                                </h4>

                                {data.cancellationRules.map((rule: any) => (
                                  <div
                                    key={rule.id}
                                    className="text-sm mb-2 text-justify mt-5 mb-5"
                                  >
                                    {rule.from_days} – {rule.to_days} Days
                                    Before Check-in <br />
                                    <span className="text-muted-foreground">
                                      Charge: {rule.charge_value}{" "}
                                      {rule.charge_type === "percentage"
                                        ? "%"
                                        : "₹"}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Child Policy */}
                            {data?.policies?.child_policy && (
                              <div className="border rounded-xl rounded-[25px] pl-4 pr-4 pb-4 bg-[#FFE797]">
                                <h4 className="w-[calc(100%+32px)] -mx-4 bg-[#2E4D98] text-white text-center font-bold text-lg lg:text-1xl py-2 rounded-t-lg">
                                  Child Policy
                                </h4>

                                <p className="text-sm text-justify mt-5 mb-5">
                                  {data.policies.child_policy}
                                </p>
                              </div>
                            )}

                            {/* Pet Policy */}
                            {data?.policies?.pet_policy && (
                              <div className="border rounded-xl rounded-[25px] pl-4 pr-4 pb-4 bg-[#FFE797]">
                                <h4 className="w-[calc(100%+32px)] -mx-4 bg-[#2E4D98] text-white text-center font-bold text-lg lg:text-1xl py-2 rounded-t-lg">
                                  Pet Policies
                                </h4>
                                <p className="text-sm text-justify mt-5 mb-5">
                                  {data.policies.pet_policy}
                                </p>
                              </div>
                            )}

                            {/* Terms & Conditions */}
                            {data?.policies?.terms && (
                              <div className="border rounded-xl rounded-[25px] pl-4 pr-4 pb-4 bg-[#FFE797]">
                                <h4 className="w-[calc(100%+32px)] -mx-4 bg-[#2E4D98] text-white text-center font-bold text-lg lg:text-1xl py-2 rounded-t-lg">
                                  Terms & Conditions
                                </h4>
                                <p className="text-sm text-justify mt-5 mb-5">
                                  {data.policies.terms}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "media" && (
                  <div className="space-y-16 mt-2">
                    {/* Property Header Card */}

                    <div className="bg-[#C2E2FA] rounded-[10px] p-2 h-full mb-2">
                      <div className="bg-[#FFEBEE] rounded-2xl pl-6 pr-6 shadow-sm border pb-5">
                        <h2 className="w-[calc(100%+50px)] -mx-6 bg-red-600 text-white text-center font-bold text-lg lg:text-2xl py-2 rounded-t-lg">
                          Gallery
                        </h2>

                        {data?.images?.length > 0 && (
                          <div className="overflow-hidden border shadow-sm mt-5">
                            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px]">
                              {/* MAIN BIG IMAGE */}
                              <div
                                className="col-span-2 row-span-2 cursor-pointer"
                                onClick={() =>
                                  setLightbox(
                                    `${API_URL}/uploads/${data.images[0].image_path}`,
                                  )
                                }
                              >
                                <img
                                  src={`${API_URL}/uploads/${data.images[0].image_path}`}
                                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                />
                              </div>

                              {/* SIDE IMAGES */}
                              {data.images
                                .slice(1, 5)
                                .map((img: any, index: number) => (
                                  <div
                                    key={img.id}
                                    className="relative cursor-pointer"
                                    onClick={() => setLightboxIndex(index)}
                                  >
                                    <img
                                      src={`${API_URL}/uploads/${img.image_path}`}
                                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                    />

                                    {/* Show overlay on last image */}
                                    {index === 3 && data.images.length > 5 && (
                                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-semibold">
                                        +{data.images.length - 5} Photos
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {data?.videos?.length > 0 && (
                      <div className="border-t pt-14">
                        <h2 className="text-2xl font-semibold mb-8">
                          Property Videos
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                          {data.videos.map((v: any) => (
                            <video
                              key={v.id}
                              controls
                              className="rounded-xl w-full"
                            >
                              <source
                                src={`${API_URL}/uploads/${v.video_path}`}
                              />
                            </video>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>{" "}
          {/* END RIGHT SIDE */}
        </div>
      </main>

      {/* LIGHTBOX */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          {/* CLOSE BUTTON */}
          <button
            className="absolute top-6 right-6 text-white"
            onClick={() => setLightboxIndex(null)}
          >
            <X size={32} />
          </button>

          {/* LEFT ARROW */}
          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 
      bg-white/90 hover:bg-white 
      text-[#A72703] 
      shadow-lg 
      rounded-full 
      p-4 
      transition-all 
      hover:scale-110"
            onClick={prevImage}
          >
            <ChevronLeft size={28} />
          </button>

          {/* IMAGE */}
          <img
            src={`${API_URL}/uploads/${data.images[lightboxIndex].image_path}`}
            className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl"
          />

          {/* RIGHT ARROW */}
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 
      bg-white/90 hover:bg-white 
      text-[#A72703] 
      shadow-lg 
      rounded-full 
      p-4 
      transition-all 
      hover:scale-110"
            onClick={nextImage}
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PropertyDetails;
