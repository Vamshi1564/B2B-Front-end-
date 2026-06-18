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
import { motion } from "framer-motion";
import PropertySelectionSidebar from "@/components/PropertySelectionSidebar";

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
const formatDate = (date: string) => {
  if (!date) return "-";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};
const parseSafe = (value: any) => {
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;

    // remove nested JSON strings
    return parsed.map((v: any) =>
      typeof v === "string" && v.startsWith("[")
        ? JSON.parse(v)
        : v
    ).flat();
  } catch {
    return [];
  }
};
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeRole, setActiveRole] = useState("All");
  const [states, setStates] = useState<
    { state_name: string; status: number }[]
  >([]);

  const roles = [
    "All",
    ...new Set(data?.staff?.map((s: any) => s.designation).filter(Boolean)),
  ];

  const filteredStaff =
    activeRole === "All"
      ? data?.staff
      : data?.staff.filter((s: any) => s.designation === activeRole);

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "address", label: "Address" },
    { key: "rooms", label: "Rooms Rates" },
    { key: "amenities", label: "Amenities" },
    { key: "staff", label: "Staff Details" },
    { key: "Q/A", label: "Question & Answers" },
    { key: "policies", label: "Bkg & Can Policy" }, // ✅ NEW TAB
    { key: "instructions", label: "Instructions" },
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


   // ✅ Fetch states
  useEffect(() => {
    fetch(`${API_URL}/api/states`)
      .then((res) => res.json())
      .then((data) => setStates(data))
      .catch((err) => console.error(err));
  }, []);


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
        // const res = await fetch(`${API_URL}/api/auth/categories`);
        const res = await fetch(`${API_URL}/api/categories`);
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
const formatTime = (time) => {
  if (!time) return "-";

  const [hour, minute] = time.split(":");
  let h = parseInt(hour);
  const ampm = h >= 12 ? "PM" : "AM";

  h = h % 12 || 12; // convert 0 → 12

  return `${h}:${minute} ${ampm}`;
};
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

      {/* <div className="max-w-6xl mx-auto flex gap-1">

  <button
    onClick={() => setShowFreeProperties(false)}
    className={`px-6 py-2 rounded-full font-medium ${
      !showFreeProperties
        ? "bg-[#BD9828] text-white"
        : "bg-white text-gray-700"
    }`}
  >
    All Properties
  </button>

  <button
    onClick={() => setShowFreeProperties(true)}
    className={`px-6 py-2 rounded-full font-medium ${
      showFreeProperties
        ? "bg-blue-600 text-white"
        : "bg-white text-gray-700"
    }`}
  >
    Free Properties
  </button>

</div> */}

      <main className="flex-1 container mx-auto px-6 py-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {/* ================= SIDEBAR ================= */}
          <div className="lg:col-span-1 hidden lg:flex justify-start -ml-6">
  <div className="w-[280px]"> {/* 👈 CONTROL WIDTH HERE */}
    <PropertySelectionSidebar
      categories={categories}
      states={states}
      activeCategory={activeCategory}
      setActiveCategory={setActiveCategory}
    />
  </div>
</div>
          {/* ================= RIGHT SIDE ================= */}
          <div className="lg:col-span-3">
            <div className="w-full flex items-center justify-between">
              {/* Back Button (Left Edge) */}
              <Link to={isSupplier ? "/supplier/dashboard" : "/home"}>
                <Button
                  variant="destructive"
                  className="rounded-none px-4 py-1 relative right-12"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>

              {/* Close Button (Right Edge) */}
              <Link to={isSupplier ? "/supplier/dashboard" : "/home"}>
                <Button
                  variant="destructive"
                  className="rounded-none px-4 py-1 relative left-10"
                >
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </Link>
            </div>
            {/* Title Bar */}
            <div className="w-[109%] -ml-[5%] bg-yellow-400 text-center font-medium py-1 mt-1">
  Name of the State: {data?.property?.state_name || data?.property?.state_name || "-"}
</div>
            {/* HERO SEARCH BAR */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="pt-1 pb-1"
            >
              <HeroSearchBar activeCategory={activeCategory} />
            </motion.section>
            <div>
              {/* {data?.images?.length > 0 && (
                <div className="relative rounded-3xl overflow-hidden group">
                  <div className="grid grid-cols-4 gap-2 h-[450px]">
                   
                    <div
                      className="col-span-2 cursor-pointer"
                      onClick={() => setLightboxIndex(0)}
                    >
                      <img
                        src={`${API_URL}/uploads/${data.images[0].image_path}`}
                        className="w-full h-full object-cover transition duration-500 hover:scale-105"
                      />
                    </div>

                  
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

                          
                          {index === 7 && data.images.length > 9 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl font-semibold">
                              +{data.images.length - 9} Photos
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                 
                  {isSupplier && (
                    <span className="absolute top-6 left-6 bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-xl backdrop-blur-md">
                      {data?.property?.status || "Approved"}
                    </span>
                  )}

             
                  <div className="absolute bottom-6 left-6 text-white">
                    <h2 className="text-2xl font-semibold drop-shadow-lg">
                      {data?.property?.name}
                    </h2>
                    <p className="text-sm opacity-90">{data?.property?.city}</p>
                  </div>
                </div>
              )} */}

              <div className="sticky top-0 z-30">
                <div className="flex w-[109%] -ml-[5%] border border-black rounded-[0px] overflow-hidden">
                  {tabs.map((tab, index) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 text-center px-3 py-1 text-xs font-medium border-r border-black transition-all duration-200
    ${activeTab === tab.key
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

              <div className="p-12 bg-[#2E4D98] rounded-[0px] shadow-sm p-2 lg:p-4 mt-1 w-[109%] -ml-[5%]">
                {/* PROFESSIONAL TABS */}

                {activeTab === "overview" && (
                  <div className="space-y-16  ">
                    {/* Property Header Card */}

                    <div className="bg-[#C2E2FA] rounded-[10px] p-1 h-full">
                      <div className="bg-[#FFEBEE] p-10 rounded-[10px] shadow-sm border ">
                        <div className="flex flex-col xl:flex-row xl:justify-between gap-10 ">
                          {/* LEFT CONTENT */}
                          <div className="space-y-5 max-w-3xl">
                            {/* PROPERTY NAME */}
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
                        {/* {data?.checkin && (
                          <div className="border-t pt-5">
                         
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
                        )} */}
                        {/* {isSupplier && data?.bank && (
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
                        )} */}
                        {/* {data?.faqs?.length > 0 && (
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

                              
                                  {openIndex === index && (
                                    <div className="px-3 pb-3 text-sm text-muted-foreground">
                                      {faq.answer}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )} */}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "address" && (
                  <div className="space-y-16">
                    <div className="bg-[#C2E2FA] rounded-[10px] p-1 h-full">
                      <div className="bg-[#FFEBEE] rounded-[10px] pl-6 pr-6 shadow-sm border">
                        <h2 className="w-[calc(100%+50px)] -mx-6 bg-red-600 text-white text-center font-bold text-lg lg:text-2xl py-2 rounded-t-[10px]">
                          Address Details
                        </h2>

                        <div className="w-[calc(100%+40px)] -mx-5 mb-1 grid md:grid-cols-2 gap-6 text-sm mt-1 border border-black rounded-[10px] p-3 bg-[#FFE797]">
                          <p>
                            <strong>Name:</strong> {data?.property?.name}
                          </p>

                          <p>
                            <strong>Category:</strong>{" "}
                            {data?.property?.category}
                          </p>

                          <p>
  <strong>Contact:</strong>{" "}
  {parseSafe(data?.property?.contact).join(", ")}
</p>

<p>
  <strong>Email:</strong>{" "}
  {parseSafe(data?.property?.email).join(", ")}
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
                  <div className="space-y-16">
                    {/* HEADER */}
                    <div className="bg-[#C2E2FA] rounded-[10px] p-1 h-full">
                      <div className="bg-[#FFEBEE] rounded-[10px] pl-6 pr-6 shadow-sm border">
                        <h2 className="w-[calc(100%+50px)] -mx-6 bg-red-600 text-white text-center font-bold text-lg lg:text-2xl py-2 rounded-t-[10px]">
                          Room Pricing
                        </h2>

                        {/* ROOMS */}
                        <div className="space-y-8 mt-1 mb-1 w-[calc(100%+40px)] -mx-5">
                          {data?.rooms?.map((room) => {
                           const roomRates = data?.rates?.filter(
                              (r) => r.room_id === room.id
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
                            const getRate = (type, plan) =>
                              roomRates.find(
                                (r) => r.rate_type === type && r.plan === plan
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
                                    <colgroup>
  {/* Small columns */}
  <col style={{ width: "120px" }} /> {/* Room Category */}
  <col style={{ width: "120px" }} /> {/* Rate Type */}
  <col style={{ width: "80px" }} />  {/* Rooms */}

  {/* Plan columns (equal) */}
  <col style={{ width: "110px" }} /> {/* EP */}
  <col style={{ width: "110px" }} /> {/* CP */}
  <col style={{ width: "110px" }} /> {/* MAP */}
  <col style={{ width: "110px" }} /> {/* AP */}

  {/* BIG columns (important 🔥) */}
  <col style={{ width: "160px" }} /> {/* Extra Person */}
  <col style={{ width: "160px" }} /> {/* Child With Bed */}
  <col style={{ width: "160px" }} /> {/* Child No Bed */}
</colgroup>
                                    <thead>
                                      <tr>
  <th className="border bg-blue-900 text-white px-3 py-2">
    Normal Rate
  </th>

  <th colSpan={3} className="border bg-teal-400 px-3 py-2">
    Public Holiday
  </th>

  <th colSpan={3} className="border bg-teal-400 px-3 py-2">
    Festival Rates
  </th>

  <th colSpan={3} className="border bg-teal-400 px-3 py-2">
    Banquet Rate
  </th>
</tr>

                                      {data?.rooms?.map((room: any, index: number) => (
  <tr key={index} className="bg-red-600 text-white">
    <th colSpan={3} className="border text-base">Valid From:</th>
    <th colSpan={2} className="border text-base">
      {formatDate(room.valid_from)}
    </th>

    <th colSpan={3} className="border text-base">Valid Till:</th>
    <th colSpan={2} className="border text-base">
      {formatDate(room.valid_to)}
    </th>


 
  </tr>
))}

                                      <tr className="bg-yellow-600 text-white">
                                        <th className="border px-2 py-2">
                                          Room Category
                                        </th>
                                        <th className="border px-2 py-2">Rate Type</th>
                                        <th className="border px-2 py-2">
                                          Rooms
                                        </th>
                                        <th className="border px-2 py-2">
                                          EP
                                        </th>
                                        <th className="border px-2 py-2">
                                          CPAI
                                        </th>
                                        <th className="border px-2 py-2">
                                          MAPAI
                                        </th>
                                        <th className="border px-2 py-2">
                                          APAI
                                        </th>
                                        <th className="border px-2 py-2 text-xs">Ex. Person</th>
<th className="border px-2 py-2 text-xs">Child (With Bed)</th>
<th className="border px-2 py-2 text-xs">Child (No Bed)</th>
                                      </tr>
                                    </thead>

                                    {/* ===== BODY ===== */}
                                  <tbody>
  {["weekday", "weekend", "long_weekend"].map((type, i) => {
    const ep = getRate(type, "EP");
    const cp = getRate(type, "CP");
    const map = getRate(type, "MAP");
    const ap = getRate(type, "AP");

    if (!ep && !cp && !map && !ap) return null;

    return (
      <tr key={i}>
        <td className="border px-2 py-2">{room.type}</td>
         {/* ✅ NEW COLUMN */}
  <td className="border px-2 py-2">
    {type === "weekday" && "Weekday"}
    {type === "weekend" && "Weekend"}
    {type === "long_weekend" && "Long Weekend"}
  </td>
        <td className="border px-2 py-2">
  {room.total_rooms || 1}
</td>
         
        <td className="border px-2 py-2">
  {ep ? `₹${ep.base_price}` : "-"}
</td>

<td className="border px-2 py-2">
  {cp ? `₹${cp.base_price}` : "-"}
</td>

<td className="border px-2 py-2">
  {map ? `₹${map.base_price}` : "-"}
</td>

<td className="border px-2 py-2">
  {ap ? `₹${ap.base_price}` : "-"}
</td>

        {/* Extra */}
        <td className="border px-2 py-2">
          ₹{ep?.extra_adult_price || 0}
        </td>

        <td className="border px-2 py-2">
          ₹{ep?.child_with_bed_price || 0}
        </td>

        <td className="border px-2 py-2">
          ₹{ep?.child_without_bed_price || 0}
        </td>
      </tr>
    );
  })}
</tbody>
  <tr>
  <td  colSpan={10} className="border py-4">
    
  </td>
</tr>
                                    {/* ===== EXTRA DETAILS ===== */}
      <tbody>
  {/* HEADER */}
  <tr>
    <td colSpan={3} className="border text-left px-4 py-2 font-semibold">
      Meals
    </td>

    <td colSpan={2} className="border font-semibold text-center">
      Price
    </td>

    <td colSpan={2} className="border font-semibold text-center">
      24 Hours Check-in
    </td>

    <td colSpan={3} className="border font-semibold text-center">
      Check in / Check out
    </td>
  </tr>

  {/* MEALS */}
  {data?.meals?.length > 0 ? (
    data.meals.map((meal: any, index: number) => (
      <tr key={index}>
        <td colSpan={3} className="border text-left px-4 py-2">
          {meal.meal_name}
        </td>

        <td colSpan={2} className="border text-center">
          ₹{meal.price}
        </td>

        <td colSpan={2} className="border text-center">
          {data?.checkin?.is_24hr_checkin ? "Available" : "Not Available"}
        </td>

        {index === 0 && (
          <>
            <td colSpan={2} className="border font-semibold text-center">
              Check in Time
            </td>
            <td colSpan={1} className="border text-center">
              {formatTime(data?.checkin?.check_in_time) || "2:00 PM"}
            </td>
          </>
        )}

        {index === 1 && (
          <>
            <td colSpan={2} className="border font-semibold text-center">
              Check out Time
            </td>
            <td colSpan={1} className="border text-center">
              {formatTime(data?.checkin?.check_out_time) || "11:00 AM"}
            </td>
          </>
        )}
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={9} className="text-center py-4">
        No Meals Available
      </td>
    </tr>
  )}

  {/* ✅ REMARKS (OUTSIDE CONDITION) */}
  <tr>
    <td colSpan={10} className="border font-semibold py-2">
      Hotel Remarks
    </td>
  </tr>

  <tr>
    <td colSpan={10} className="border h-[120px]">
      {data?.property?.hotel_remarks || ""}
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
                  <div className="space-y-16">
                    <div className="bg-[#C2E2FA] rounded-[10px] p-1 h-full">
                      <div className="bg-[#FFEBEE] rounded-[10px] pl-6 pr-6 shadow-sm border">
                        <h2 className="w-[calc(100%+50px)] -mx-6 bg-red-600 text-white text-center font-bold text-lg lg:text-2xl py-2 rounded-t-[10px]">
                          Amenities
                        </h2>

                        <div className="w-[calc(100%+40px)] -mx-5 mb-1 flex flex-wrap justify-start gap-3 text-sm mt-1 border border-black rounded-[10px] p-3 bg-[#FFE797]">
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
                  <>
                    {/* ✅ Tabs */}
                    <div className="flex gap-3 mb-4 flex-wrap">
                      {roles.map((role: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setActiveRole(role)}
                          className={`px-4 py-1 rounded border text-sm ${activeRole === role
                              ? "bg-red-600 text-white"
                              : "bg-white text-black"
                            }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>

                    {/* ✅ Your Existing UI (NO CHANGE) */}
                    <div className="space-y-16">
                      <div className="bg-[#C2E2FA] rounded-[10px] p-1 h-full">
                        <div className="bg-[#FFEBEE] rounded-[10px] pl-6 pr-6 shadow-sm border">
                          <h2 className="w-[calc(100%+50px)] -mx-6 bg-red-600 text-white text-center font-bold text-lg lg:text-2xl py-2 rounded-t-[10px]">
                            Staff
                          </h2>

                          <div className="grid grid-cols-1 gap-6 mt-2 mb-2 w-full">
                            {/* ✅ IMPORTANT CHANGE HERE */}
                            {filteredStaff.map((s: any) => {
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
                                  <table className="w-full border border-gray-400 text-sm table-fixed">
                                    

                                     <colgroup>
    <col style={{ width: "240px" }} /> {/* Photo */}
    
    <col style={{ width: "15%" }} /> {/* Label Left */}
    <col style={{ width: "35%" }} /> {/* Value Left */}

    <col style={{ width: "15%" }} /> {/* Label Right */}
    <col style={{ width: "35%" }} /> {/* Value Right */}
  </colgroup>
                                    <tbody>
                                      {/* Row 1 */}
                                      <tr>
                                        <td
                                          rowSpan={4}
                                          className="border border-gray-400 w-60 align-top"
                                        >
                                          {s.photo && (s.show_photo || isSupplier) ? (
                                            <img
                                              src={`${API_URL}/uploads/${s.photo}`}
                                              className="w-full h-full object-cover"
                                              alt={s.name}
                                            />
                                          ) : (
                                            <div className="h-full flex items-center justify-center text-gray-400">
                                              No Image
                                            </div>
                                          )}
                                        </td>

                                        <td className="border border-gray-400 p-2 font-semibold">Name</td>
                                        <td className="border border-gray-400 p-2">{s.name}</td>

                                        <td className="border border-gray-400 p-2 font-semibold">Post</td>
                                        <td className="border border-gray-400 p-2">{s.designation}</td>
                                      </tr>

                                      {/* Row 2 */}
                                      <tr>
                                        <td className="border border-gray-400 p-2 font-semibold">Cell No 1 </td>
                                        <td className="border border-gray-400 p-2">{phones[0] || "--"}</td>

                                        <td className="border border-gray-400 p-2 font-semibold">Cell No 2</td>
                                        <td className="border border-gray-400 p-2">{phones[1] || "--"}</td>
                                      </tr>

                                      {/* Row 3 */}
                                      <tr>
                                        <td className="border border-gray-400 p-2 font-semibold">Mail Id 1</td>
                                        <td className="border border-gray-400 p-2">{emails[0] || "--"}</td>

                                        <td className="border border-gray-400 p-2 font-semibold">Mail Id 2</td>
                                        <td className="border border-gray-400 p-2">{emails[1] || "--"}</td>
                                      </tr>

                                      {/* Row 4 */}
                                      <tr>
                                        <td className="border border-gray-400 p-2 font-semibold">Landline</td>
                                        <td className="border border-gray-400 p-2">{s.landline || "--"}</td>

                                        <td className="border border-gray-400 p-2 font-semibold">Extension</td>
                                        <td className="border border-gray-400 p-2">{s.extension || "--"}</td>
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
                  </>
                )}

                {activeTab === "Q/A" && data?.faqs?.length > 0 && (
                  <div className="space-y-16 ">
                    <div className="bg-[#C2E2FA] rounded-[10px] p-1 h-full">
                      <div className="bg-[#FFEBEE] rounded-[10px] pl-6 pr-6 shadow-sm border">
                        {/* Header */}
                        <h2 className="w-[calc(100%+50px)] -mx-6 bg-red-600 text-white text-center font-bold text-lg lg:text-2xl py-2 rounded-t-[10px]">
                          Questions & Answers
                        </h2>

                        {/* FAQ List */}
                        <div className="space-y-4 mt-1 mb-1 w-[calc(100%+40px)] -mx-5">
                          {data.faqs.map((faq: any, index: number) => (
                            <div
                              key={faq.id}
                              className="w-[calc(100%+10px)] -mx-1 border border-black rounded-[10px] bg-[#FFE797]"
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
                    </div>
                  </div>
                )}

                {activeTab === "policies" && (
                  <div className="space-y-10">
                    <div className="bg-[#C2E2FA] rounded-xl p-1">
                      <div className="bg-[#FFEBEE] rounded-2xl shadow-sm border pb-2">
                        {/* HEADER */}
                        <h2 className="bg-red-600 text-white text-center font-bold text-lg lg:text-2xl py-3 rounded-t-2xl">
                          Policies & Terms
                        </h2>

                        {/* MAIN LAYOUT */}
                        <div className="space-y-4">
                          {/* TOP ROW */}
                          <div className="grid md:grid-cols-2 gap-4">
                            {/* Booking Policy */}
                            {data?.policies?.booking_policy && (
    <div className="bg-[#FFE797] rounded-2xl overflow-hidden border border-black h-full m-1">
                                <h4 className="bg-[#A72703] text-white text-center font-bold text-lg py-3 rounded-t-2xl">
                                  Booking Policy
                                </h4>

                                <div className="px-4 py-3">
                                  <ul className="space-y-2 text-sm text-justify">
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
                              </div>
                            )}

                            {/* Cancellation Policy */}
                            {data?.policies?.cancellation_policy && (
                              <div className="bg-[#FFE797] rounded-2xl overflow-hidden border border-black h-full m-1">
                                <h4 className="bg-[#A72703] text-white text-center font-bold text-lg py-3 rounded-t-2xl">
                                  Cancellation Policy
                                </h4>

                                <div className="px-4 py-3">
                                  <p className="text-sm text-justify">
                                    {data.policies.cancellation_policy}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* BELOW → 2 PER ROW */}
                          {/* <div className="grid md:grid-cols-2 gap-4"> */}
                          {/* Cancellation Charges */}
                          {/* {data?.cancellationRules?.length > 0 && (
                              <div className="bg-[#FFE797] rounded-2xl overflow-hidden border h-full m-1">
                                <h4 className="bg-[#A72703] text-white text-center font-bold text-lg py-3 rounded-t-2xl">
                                  Cancellation Charges
                                </h4>

                                <div className="px-4 py-3 space-y-2 text-sm text-justify">
                                  {data.cancellationRules.map((rule: any) => (
                                    <div key={rule.id}>
                                      {rule.from_days} – {rule.to_days} Days
                                      Before Check-in
                                      <br />
                                      <span className="text-muted-foreground">
                                        Charge: {rule.charge_value}{" "}
                                        {rule.charge_type === "percentage"
                                          ? "%"
                                          : "₹"}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )} */}

                          {/* Child Policy */}
                          {/* {data?.policies?.child_policy && (
                              <div className="bg-[#FFE797] rounded-2xl overflow-hidden border h-full m-1">
                                <h4 className="bg-[#A72703] text-white text-center font-bold text-lg py-3 rounded-t-2xl">
                                  Child Policy
                                </h4>

                                <div className="px-4 py-3">
                                  <p className="text-sm text-justify">
                                    {data.policies.child_policy}
                                  </p>
                                </div>
                              </div>
                            )} */}

                          {/* Pet Policy */}
                          {/* {data?.policies?.pet_policy && (
                              <div className="bg-[#FFE797] rounded-2xl overflow-hidden border h-full m-1">
                                <h4 className="bg-[#A72703] text-white text-center font-bold text-lg py-3 rounded-t-2xl">
                                  Pet Policies
                                </h4>

                                <div className="px-4 py-3">
                                  <p className="text-sm text-justify">
                                    {data.policies.pet_policy}
                                  </p>
                                </div>
                              </div>
                            )} */}

                          {/* Terms & Conditions */}
                          {/* {data?.policies?.terms && (
                              <div className="bg-[#FFE797] rounded-2xl overflow-hidden border h-full m-1">
                                <h4 className="bg-[#A72703] text-white text-center font-bold text-lg py-3 rounded-t-2xl">
                                  Terms & Conditions
                                </h4>

                                <div className="px-4 py-3">
                                  <p className="text-sm text-justify">
                                    {data.policies.terms}
                                  </p>
                                </div>
                              </div>
                            )} */}
                          {/* </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "instructions" && (
                  <div className="">
                    <div className="bg-[#C2E2FA] rounded-[10px] p-1 h-full ">
                      <div className="bg-[#FFEBEE] rounded-[10px] pl-4 pr-4 shadow-sm border pb-3 border border-black">
                        <h2 className="w-[calc(100%+32px)] -mx-4 bg-red-600 text-white text-center font-bold text-lg lg:text-2xl py-2 rounded-t-[10px]">
                          Instructions
                        </h2>

                        <p className="text-sm text-justify mt-1 mb-1 px-1 py-1 leading-snug">
                          Please ensure that all the required details are filled
                          in accurately and completely before proceeding
                          further. Carefully verify the information provided,
                          including personal details, booking preferences, and
                          selected options, to avoid any discrepancies during
                          confirmation. Make sure that all uploaded documents
                          and images are valid, clear, and meet the specified
                          guidelines. It is strongly recommended to review all
                          the entered information thoroughly before submitting,
                          as changes or modifications may not be allowed once
                          the process is completed. Kindly follow all the
                          instructions, property rules, and applicable policies,
                          including check-in and check-out timings, to ensure a
                          smooth and hassle-free experience. Avoid entering any
                          false, incorrect, or misleading information, as it may
                          lead to rejection or cancellation. In case of any
                          issues, delays, or queries, please reach out to the
                          support team or concerned authority for timely
                          assistance and resolution.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* {activeTab === "media" && (
                  <div className="space-y-16">
             

                    <div className="bg-[#C2E2FA] rounded-[10px] p-1 h-full ">
                      <div className="bg-[#FFEBEE] rounded-[10px] pl-6 pr-6 shadow-sm border pb-1">
                        <h2 className="w-[calc(100%+50px)] -mx-6 bg-red-600 text-white text-center font-bold text-lg lg:text-2xl py-2 rounded-t-[10px]">
                          Gallery
                        </h2>

                        {data?.images?.length > 0 && (
                          <div className="overflow-hidden border shadow-sm mt-1 w-[calc(100%+40px)] -mx-5">
                            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px]">
                             
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
                )} */}

                {activeTab === "media" && (
                  <div className="space-y-16">
                    {/* Property Header Card */}
                    <div className="bg-[#C2E2FA] rounded-[10px] p-1 h-full">
                      <div className="bg-[#FFEBEE] rounded-[10px] pl-6 pr-6 shadow-sm border pb-1">
                        {/* HEADER */}
                        <h2 className="w-[calc(100%+50px)] -mx-6 bg-red-600 text-white text-center font-bold text-lg lg:text-2xl py-2 rounded-t-[10px]">
                          Gallery
                        </h2>

                        {/* IMAGES */}
                        {data?.images?.length > 0 && (
                          <div className="overflow-hidden border shadow-sm mt-1 w-[calc(100%+40px)] -mx-5">
                            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px]">
                              {/* ===== MAIN BIG IMAGE (SLIDER + LIGHTBOX) ===== */}
                              <div className="col-span-2 row-span-2 relative cursor-pointer">
                                <img
                                  src={`${API_URL}/uploads/${data.images[currentIndex].image_path}`}
                                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                  onClick={() =>
                                    setLightbox(
                                      `${API_URL}/uploads/${data.images[currentIndex].image_path}`,
                                    )
                                  }
                                />

                                {/* LEFT ARROW */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentIndex((prev) =>
                                      prev === 0
                                        ? data.images.length - 1
                                        : prev - 1,
                                    );
                                  }}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white px-3 py-1 rounded-full transition"
                                >
                                  ◀
                                </button>

                                {/* RIGHT ARROW */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentIndex((prev) =>
                                      prev === data.images.length - 1
                                        ? 0
                                        : prev + 1,
                                    );
                                  }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white px-3 py-1 rounded-full transition"
                                >
                                  ▶
                                </button>

                                {/* DOTS */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                                  {data.images.map((_: any, i: number) => (
                                    <span
                                      key={i}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentIndex(i);
                                      }}
                                      className={`cursor-pointer px-2 py-1 text-xs rounded-full ${i === currentIndex
                                          ? "bg-white text-black"
                                          : "bg-black/50 text-white"
                                        }`}
                                    >
                                      {i + 1}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* ===== SIDE IMAGES ===== */}
                              {data.images
                                .slice(1, 5)
                                .map((img: any, index: number) => (
                                  <div
                                    key={img.id}
                                    className="relative cursor-pointer"
                                    onClick={() => {
                                      setCurrentIndex(index + 1); // update main image
                                      setLightboxIndex(index); // keep your existing logic
                                    }}
                                  >
                                    <img
                                      src={`${API_URL}/uploads/${img.image_path}`}
                                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                                    />

                                    {/* Overlay on last image */}
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

                    {/* ===== VIDEOS ===== */}
                    {data?.videos?.length > 0 && (
                      <div className="border-t pt-14">
                        <h2 className="text-2xl font-semibold mb-8">
                          Property Videos
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                          {data.videos.map((v: any) => (
                            <div key={v.id} className="aspect-square">
                              <video
                                controls
                                className="w-full h-full object-cover rounded-xl"
                              >
                                <source
                                  src={`${API_URL}/uploads/${v.video_path}`}
                                />
                              </video>
                            </div>
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
