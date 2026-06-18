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
    return parsed
      .map((v: any) =>
        typeof v === "string" && v.startsWith("[") ? JSON.parse(v) : v,
      )
      .flat();
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
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");
  const [mediaIndex, setMediaIndex] = useState(0);
  const rateTypes = ["weekday", "weekend", "long_weekend"];
  const [activeRateTab, setActiveRateTab] = useState(0);

  const [states, setStates] = useState<
    { state_name: string; status: number }[]
  >([]);

  const roles = [
    "All",
    ...new Set(data?.staff?.map((s: any) => s.designation).filter(Boolean)),
  ];
  const user = getUser();
  const isSupplier = user?.role === "supplier";
  const isAgent = user?.role === "agent";
  const isActiveAgent = Number(user?.is_active) === 1;
  // const filteredStaff =
  //   activeRole === "All"
  //     ? data?.staff
  //     : data?.staff.filter((s: any) => s.designation === activeRole);
  const filteredStaff = (data?.staff || []).filter((s: any) => {
    // ✅ Supplier sees all
    if (isSupplier) return true;

    // ✅ Agent sees only active
    if (isAgent && !s.is_active) return false;

    // ✅ Role filter
    if (activeRole !== "All" && s.designation !== activeRole) return false;

    return true;
  });

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "address", label: "Address" },
    { key: "rooms", label: "Rooms Rates" },
    // { key: "amenities", label: "Amenities" },
    { key: "staff", label: "Staff Details" },
    { key: "Q/A", label: "Question & Answers" },
    { key: "policies", label: "Booking and Cancellation Policy" }, // ✅ NEW TAB
    { key: "bank", label: "Bank Details" },
    { key: "media", label: "Media" },
    // { key: "annual", label: "Annual Charges" },
  ];

  const nextImage = () => {
    if (lightboxIndex === null) return;

    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % data.images.length : 0,
    );
  };

  const [charges, setCharges] = useState({
    maintenance_amount: "",
    maintenance_note: "",
    service_amount: "",
    service_note: "",
    gst_amount: "",
    gst_note: "",
    extra_amount: "",
    extra_note: "",
  });

  const RATE_TABS = [
    "Normal Rate",
    "Public Holiday",
    "Festival Rate",
    "Banquet Rate",
  ];

  const rateTypeMap: any = {
    0: "normal",
    1: "public_holiday",
    2: "festival",
    3: "banquet",
  };

  // 🔥 normalize backend category
  const normalizeCategory = (val: string) =>
    val?.toLowerCase().replace(/\s+/g, "_");

  // 🔥 normalize rate type
  const normalizeType = (val: string) =>
    val?.toLowerCase().replace(/\s+/g, "_");

  // 🔥 normalize plan
  const normalizePlan = (val: string) => val?.toUpperCase().replace(/\s+/g, "");

  const prevImage = () => {
    if (lightboxIndex === null) return;

    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + data.images.length) % data.images.length : 0,
    );
  };

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleChange = (key: string, value: string) => {
    setCharges((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (!id) return;

    const fetchProperty = async () => {
      try {
        const res = await fetch(`${API_URL}/api/properties/${id}/full`, {
          headers: {
            role: user?.role || "",
          },
        });
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

    // ✅ If already contains AM/PM → return as is
    if (
      time.toUpperCase().includes("AM") ||
      time.toUpperCase().includes("PM")
    ) {
      return time;
    }

    // ✅ If 24-hour format → convert
    const [hour, minute] = time.split(":");
    let h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";

    h = h % 12 || 12;

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

  // ✅ Convert YouTube to embed
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      return `https://www.youtube.com/embed/${url.split("youtu.be/")[1]}`;
    }
    return url;
  };

  const currentData = mediaType === "photo" ? data?.images : data?.videos;

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
            <div className="w-[280px] mt-12 sm:mt-16 md:mt-24 lg:mt-32 xl:mt-40">
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
              Name of the State:{" "}
              {data?.property?.state_name || data?.property?.state_name || "-"}
            </div>
            {/* HERO SEARCH BAR */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="pt-1 pb-1 ml-0 lg:ml-[-29%]"
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
                <div className="flex w-[108%] -ml-[5%] bg-[#66FFFF] overflow-hidden rounded-[6px] border-2 border-black divide-x divide-black h-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 flex items-center justify-center text-center
          px-2 text-[14px] leading-none whitespace-nowrap
          transition-all duration-200
          ${
            activeTab === tab.key
              ? "bg-[#002060] text-white font-medium"
              : "bg-[#66FFFF] text-black font-normal"
          }
        `}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-12 rounded-[0px] shadow-sm p-2 w-[110%] -ml-[6%]">
                {/* PROFESSIONAL TABS */}

                {activeTab === "overview" && (
                  <div className="space-y-3">
                    {/* 🔵 OVERVIEW HEADER */}
                    <div className="w-full bg-[#0b2c6f] rounded-[10px] py-1.5">
                      <h2 className="text-center text-white font-semibold text-[15px]">
                        Overview Of{" "}
                        <span className="ml-1 font-bold text-lg text-red-500">
                          {data?.property?.name}
                        </span>
                      </h2>
                    </div>

                    {/* 🔷 OVERVIEW CONTAINER */}
                    <div className="bg-[#0c2d67] p-2 rounded-2xl">
                      <div className="bg-[#b9d3ea] p-2 rounded-2xl">
                        <div className="bg-[#FFE1E1] rounded-[14px] p-4 border border-[#0b2c6f]/20">
                          <div className="flex flex-col xl:flex-row xl:justify-between gap-4">
                            {/* LEFT CONTENT */}
                            <div className="space-y-3 max-w-3xl">
                              <h1
                                className="text-3xl lg:text-4xl font-bold leading-tight
                bg-gradient-to-r from-[#A72703] to-[#D43C1C]
                bg-clip-text text-transparent"
                              >
                                {data?.property?.name}
                              </h1>

                              <div className="flex items-start gap-2">
                                {/* <MapPin className="w-4 h-4 mt-1 text-black" /> */}
                                <div>
                                  {/* <p className="font-medium text-black text-sm">
                                    {data?.property?.area},{" "}
                                    {data?.property?.city} –{" "}
                                    {data?.property?.pincode}
                                  </p>
                                  <p className="text-xs text-gray-700 mt-0.5">
                                    {data?.property?.address}
                                  </p> */}
                                  <p className="text-xs text-gray-700 mt-0.5">
                                    {data?.property?.full_overview}
                                  </p>
                                </div>
                              </div>

                              {/* <div className="flex gap-2 flex-wrap">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-black/10">
                                  <Tag className="w-3.5 h-3.5" />
                                  <span className="text-[10px] font-semibold uppercase">
                                    {data?.property?.category}
                                  </span>
                                </div>

                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-black/10">
                                  <Bed className="w-3.5 h-3.5" />
                                  <span className="text-[10px] font-semibold uppercase">
                                    {data?.property?.total_rooms ?? 0} Rooms
                                  </span>
                                </div>
                              </div> */}
                            </div>

                            {/* RIGHT CTA */}
                            <div className="flex flex-col items-start xl:items-end gap-2">
                              {isAgent && !isActiveAgent && (
                                <Button
                                  className="rounded-xl px-6 h-10 text-white bg-blue-600 hover:bg-blue-700"
                                  onClick={() => navigate(`/agent/payment`)}
                                >
                                  Pay Now
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 🔵 AMENITIES HEADER */}
                    <div className="w-full bg-[#0b2c6f] rounded-[10px] py-1.5">
                      <h2 className="text-center text-white font-semibold text-[15px]">
                        Amenities
                      </h2>
                    </div>

                    {/* 🔷 AMENITIES CONTAINER */}
                    <div className="bg-[#0c2d67] p-2 rounded-2xl">
                      <div className="bg-[#b9d3ea] p-2 rounded-2xl">
                        <div className="bg-[#FFE1E1] rounded-[14px] p-4 border border-[#0b2c6f]/20">
                          {data?.amenities?.length > 0 && (
                            <div className="bg-[#7fd8dc] border border-black rounded-[10px] p-3 flex flex-wrap gap-3">
                              {data.amenities.map((a: any) => {
                                const name = a.amenity_name
                                  ?.toLowerCase()
                                  .trim();
                                const Icon =
                                  amenityIcons[name] || ConciergeBell;

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
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* {activeTab === "address" && (
                  <div className="space-y-4">
                 
                    <div className="w-full bg-[#0b2c6f] rounded-[10px] py-1.5">
                      <h2 className="text-center text-white font-semibold text-[15px]">
                        Address
                      </h2>
                    </div>

                    <div className="bg-[#0c2d67] p-2 rounded-2xl">
                
                      <div className="bg-[#b9d3ea] p-3 rounded-2xl">
                 
                        <div className="grid md:grid-cols-2 gap-6">
                       

                          <div className="bg-[#0b2c6f] p-3 rounded-xl">
                            {[
                              {
                                label: "Address Type",
                                value: data?.property?.address_type,
                              },
                              {
                                label: "Address",
                                value: data?.property?.address1,
                              },
                              {
                                label: "Address",
                                value: data?.property?.address2,
                              },
                              { label: "Area", value: data?.property?.area },
                              {
                                label: "Landmark",
                                value: data?.property?.landmark,
                              },
                              {
                                label: "Pincode",
                                value: data?.property?.pincode,
                              },
                              { label: "City", value: data?.property?.city },
                              { label: "State", value: data?.property?.state },
                              {
                                label: "Country",
                              value: data?.property?.hotel_country,
                              },
                            ].map((item, index) => (
                              <div key={index} className="flex mt-[1px]">
                                <div className="bg-[#e11900] text-white text-xs font-bold px-2 py-1 w-32 rounded-[5px] border-2 border-gray-700">
                                  {item.label}
                                </div>

                                <div className="flex-1 px-2 py-1 text-xs rounded-[5px] border-2 border-l-0 border-gray-700 bg-[#FFE5E5]">
                                  {item.value || "-"}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="bg-[#0b2c6f] p-3 rounded-xl">
                            {[
                              {
                                label: "Address Type",
                                value: data?.property?.hotel_address_type,
                              },
                              {
                                label: "Address",
                                value: data?.property?.hotel_address1,
                              },
                              {
                                label: "Address",
                                value: data?.property?.hotel_address2,
                              },
                              {
                                label: "Area",
                                value: data?.property?.hotel_area,
                              },
                              {
                                label: "Landmark",
                                value: data?.property?.hotel_landmark,
                              },
                              {
                                label: "Pincode",
                                value: data?.property?.hotel_pincode,
                              },
                              {
                                label: "City",
                                value: data?.property?.hotel_city,
                              },
                              {
                                label: "State",
                                value: data?.property?.hotel_state,
                              },
                              {
                                label: "Country",
                                value: data?.property?.hotel_country,
                              },
                            ].map((item, index) => (
                              <div key={index} className="flex mt-[1px]">
                                <div className="bg-[#FF0000] text-white text-xs font-bold px-2 py-1 w-32 rounded-[5px] border-2 border-gray-700">
                                  {item.label}
                                </div>

                                <div className="flex-1 px-2 py-1 text-xs rounded-[5px] border-2 border-l-0 border-gray-700 bg-[#FFE5E5]">
                                  {item.value || "-"}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )} */}

                {activeTab === "address" && (
                  <div className="space-y-4">
                    <div className="w-full bg-[#0b2c6f] rounded-[10px] py-1.5">
                      <h2 className="text-center text-white font-semibold text-[15px]">
                        Address
                      </h2>
                    </div>

                    <div className="bg-[#0c2d67] p-2 rounded-2xl">
                      <div className="bg-[#b9d3ea] p-3 rounded-2xl">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-[#0b2c6f] p-3 rounded-xl">
                            {[
                              {
                                label: "Address Type",
                                value: data?.property?.address_type,
                              },
                              {
                                label: "Address",
                                value: data?.property?.address1,
                              },
                              {
                                label: "Address",
                                value: data?.property?.address2,
                              },
                              { label: "Area", value: data?.property?.area },
                              {
                                label: "Landmark",
                                value: data?.property?.landmark,
                              },
                              {
                                label: "Pincode",
                                value: data?.property?.pincode,
                              },
                              { label: "City", value: data?.property?.city },
                              {
                                label: "State",
                                value:
                                  data?.property?.state_name ||
                                  data?.property?.state,
                              },
                              {
                                label: "Country",
                                value: data?.property?.hotel_country,
                              },
                            ].map((item, index) => (
                              <div key={index} className="flex mt-[1px]">
                                <div className="bg-[#e11900] text-white text-xs font-bold px-2 py-1 w-32 rounded-[5px] border-2 border-gray-700">
                                  {item.label}
                                </div>

                                <div className="flex-1 px-2 py-1 text-xs rounded-[5px] border-2 border-l-0 border-gray-700 bg-[#FFE5E5]">
                                  {item.value || "-"}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="bg-[#0b2c6f] p-3 rounded-xl">
                            {[
                              {
                                label: "Address Type",
                                value: data?.property?.hotel_address_type,
                              },
                              {
                                label: "Address",
                                value: data?.property?.hotel_address1,
                              },
                              {
                                label: "Address",
                                value: data?.property?.hotel_address2,
                              },
                              {
                                label: "Area",
                                value: data?.property?.hotel_area,
                              },
                              {
                                label: "Landmark",
                                value: data?.property?.hotel_landmark,
                              },
                              {
                                label: "Pincode",
                                value: data?.property?.hotel_pincode,
                              },
                              {
                                label: "City",
                                value: data?.property?.hotel_city,
                              },
                              {
                                label: "State",
                                value: data?.property?.hotel_state,
                              },
                              {
                                label: "Country",
                                value: data?.property?.hotel_country,
                              },
                            ].map((item, index) => (
                              <div key={index} className="flex mt-[1px]">
                                <div className="bg-[#FF0000] text-white text-xs font-bold px-2 py-1 w-32 rounded-[5px] border-2 border-gray-700">
                                  {item.label}
                                </div>

                                <div className="flex-1 px-2 py-1 text-xs rounded-[5px] border-2 border-l-0 border-gray-700 bg-[#FFE5E5]">
                                  {item.value || "-"}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "rooms" && (
                  <div className="bg-[#66FFFF] p-4 rounded-xl border border-black">
                    <div className="bg-white p-4 rounded-xl">
                      {/* TITLE */}
                      <div className="bg-[#0c2d67] text-white text-center py-1 px-6 rounded-xl font-semibold mb-3">
                        Room Rates
                      </div>

                      {/* TABS */}
                      <div className="flex gap-3 mb-3">
                        {RATE_TABS.map((tab, index) => (
                          <div
                            key={tab}
                            className="border-2 border-black bg-[#cfe3f5] p-[4px] w-[240px]"
                          >
                            <button
                              onClick={() => setActiveRateTab(index)}
                              className={`w-full py-2 text-sm font-semibold bg-[#123e6b] text-white ${
                                activeRateTab === index ? "" : "opacity-70"
                              }`}
                            >
                              {tab}
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* ACTIVE TAB LABEL */}
                      <div className="mb-3 font-semibold text-[#0c2d67]">
                        {RATE_TABS[activeRateTab]}
                      </div>

                      {/* ROOMS */}
                      {data?.rooms?.map((room: any) => {
                        const roomRates =
                          data?.rates?.filter(
                            (r: any) =>
                              r.room_id === room.id &&
                              normalizeType(r.rate_type) === "weekday",
                          ) || [];

                        // ✅ helper
                        const getRate = (plan: string) =>
                          roomRates.find(
                            (r: any) =>
                              normalizePlan(r.plan) === normalizePlan(plan),
                          ) || {};

                        return (
                          <div
                            key={room.id}
                            className="mb-6 border border-black p-3 rounded-lg"
                          >
                            {/* ROOM HEADER */}
                            <div className="bg-[#0c2d67] text-white p-2 text-sm font-semibold mb-2 rounded-xl">
                              {room.type} - Max {room.max_adults} Adults,{" "}
                              {room.max_children} Children
                            </div>

                            {/* DATES */}
                            <div className="flex items-center gap-2 mb-3 w-fit">
                              <div className="bg-orange-600 px-3 py-1 text-white border border-black text-xs">
                                Valid From
                              </div>
                              <div className="bg-[#e6c0b8] border border-black px-2 py-1 w-[130px] text-xs">
                                {formatDate(room.valid_from) || "-"}
                              </div>

                              <div className="bg-orange-600 px-3 py-1 text-white border border-black text-xs">
                                Valid Till
                              </div>
                              <div className="bg-[#e6c0b8] border border-black px-2 py-1 w-[130px] text-xs">
                                {formatDate(room.valid_to) || "-"}
                              </div>
                            </div>

                            {/* HEADER */}
                            <div className="grid grid-cols-[2fr_1fr_0.7fr_1fr_1fr_1fr_1fr_1fr_1fr] bg-[#0c2d67] text-white text-center text-xs font-semibold">
                              {[
                                "Room Category",
                                "Rooms",
                                "EP",
                                "CPAI",
                                "MAPAI",
                                "APAI",
                                "Ex Adult",
                                "Chd with Bed",
                                "Chd no Bed",
                              ].map((h) => (
                                <div
                                  key={h}
                                  className="p-2 border border-white"
                                >
                                  {h}
                                </div>
                              ))}
                            </div>

                            {/* ROWS */}
                            {(() => {
                              const ep = getRate("EP");

                              return (
                                <div className="grid grid-cols-[2fr_1fr_0.7fr_1fr_1fr_1fr_1fr_1fr_1fr] bg-[#66FFFF] text-center text-xs border-b border-white">
                                  <div className="p-2 border border-white">
                                    {room.type}
                                  </div>

                                  <div className="p-2 border border-white">
                                    {room.rooms || 1}
                                  </div>

                                  <div className="p-2 border border-white">
                                    ₹{ep.base_price ?? "-"}
                                  </div>

                                  <div className="p-2 border border-white">
                                    ₹{getRate("CP").base_price ?? "-"}
                                  </div>

                                  <div className="p-2 border border-white">
                                    ₹{getRate("MAP").base_price ?? "-"}
                                  </div>

                                  <div className="p-2 border border-white">
                                    ₹{getRate("AP").base_price ?? "-"}
                                  </div>

                                  <div className="p-2 border border-white">
                                    ₹{ep.extra_adult_price ?? 0}
                                  </div>

                                  <div className="p-2 border border-white">
                                    ₹{ep.child_with_bed_price ?? 0}
                                  </div>

                                  <div className="p-2 border border-white">
                                    ₹{ep.child_without_bed_price ?? 0}
                                  </div>
                                </div>
                              );
                            })()}

                            {/* EMPTY MESSAGE */}
                            {roomRates.length === 0 && (
                              <div className="text-center text-red-500 py-2 text-xs">
                                No rates available for this category
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* BOTTOM SECTION */}
                      <div className="flex mt-4 items-start gap-2 text-xs">
                        {/* Meals */}
                        <div className="flex flex-col gap-[2px] w-[300px]">
                          {/* Header */}
                          <div className="bg-[#041e56] text-white p-2 text-center font-bold">
                            Meals
                          </div>

                          {/* Values in single row */}
                          <div className="grid grid-cols-2">
                            {data?.meals?.map((meal: any, i: number) => (
                              <div
                                key={i}
                                className="bg-[#66ffff] p-2 border text-center"
                              >
                                {meal.meal_name}: ₹{meal.price}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 24hr */}
                        <div className="flex flex-col gap-[2px] w-[300px]">
                          <div className="bg-[#041e56] text-white p-2 text-center font-bold">
                            24 Hours Check-in
                          </div>
                          <div className="bg-[#66ffff] p-2 border text-center">
                            {data?.checkin?.is_24hr_checkin
                              ? "Applicable"
                              : "Not Applicable"}
                          </div>
                        </div>

                        {/* Checkin/out */}
                        <div className="flex flex-col gap-[2px] flex-1">
                          <div className="bg-[#041e56] text-white p-2 text-center font-bold">
                            Check in / Check out
                          </div>
                          <div className="grid grid-cols-2 text-center">
                            <div className="bg-[#66ffff] p-2 border">
                              Check In:{" "}
                              {formatTime(data?.checkin?.check_in_time)}
                            </div>
                            <div className="bg-[#66ffff] p-2 border">
                              Check Out:{" "}
                              {formatTime(data?.checkin?.check_out_time)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "staff" && (
                  <div className="space-y-3">
                    {/* 🔵 STAFF HEADER */}
                    <div className="w-full bg-[#0b2c6f] rounded-[10px] py-1.5">
                      <h2 className="text-center text-white font-semibold text-[15px]">
                        Staff Members
                      </h2>
                    </div>

                    {/* 🔷 STAFF CONTAINER */}
                    <div className="bg-[#0c2d67] p-2 rounded-2xl">
                      <div className="bg-[#b9d3ea] p-2 rounded-2xl">
                        <div className="bg-[#FFE1E1] rounded-[14px] p-4 border border-[#0b2c6f]/20">
                          {/* STAFF GRID */}
                          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">  */}
                          <div className="grid grid-cols-1 gap-4">
                            {filteredStaff.map((s: any) => {
                              const phones = Array.isArray(s.phones)
                                ? s.phones
                                : JSON.parse(s.phones || "[]");

                              const activeFields = s.active_fields
                                ? typeof s.active_fields === "string"
                                  ? JSON.parse(s.active_fields)
                                  : s.active_fields
                                : {};

                              const emails = Array.isArray(s.emails)
                                ? s.emails
                                : JSON.parse(s.emails || "[]");

                              // ✅ Visibility logic
                              const phone1 =
                                s.show_phones || isSupplier
                                  ? phones[0] || ""
                                  : "Hidden";

                              const phone2 =
                                s.show_phones || isSupplier
                                  ? phones[1] || ""
                                  : "Hidden";

                              const email1 =
                                s.show_emails || isSupplier
                                  ? emails[0] || ""
                                  : "Hidden";

                              const email2 =
                                s.show_emails || isSupplier
                                  ? emails[1] || ""
                                  : "Hidden";

                              return (
                                <div
                                  key={s.id}
                                  className="p-3 rounded-[10px] flex gap-4"
                                >
                                  {/* PHOTO SECTION */}
                                  <div className="w-[230px] h-[310px] bg-gray-100 flex items-center justify-center rounded-[8px] overflow-hidden border border-gray-300 flex-shrink-0">
                                    {s.photo && (s.show_photo || isSupplier) ? (
                                      <img
                                        src={`${API_URL}/uploads/${s.photo}`}
                                        className="w-full h-full object-cover"
                                        alt={s.name}
                                      />
                                    ) : (
                                      <span className="text-gray-400 text-sm">
                                        No Photo
                                      </span>
                                    )}
                                  </div>

                                  {/* DETAILS SECTION */}
                                  <div className="flex-1 space-y-2">
                                    {/* NAME ROW */}
                                    {/* <div className="flex gap-2">
                                      <div className="w-[110px] bg-[#0c2d67] text-white px-3 py-1 h-[32px] flex items-center rounded-[7px] text-md">
                                        Name
                                      </div>
                                      <input
                                        value={s.name || ""}
                                        readOnly
                                        className="flex-1 bg-white px-2 h-[32px] rounded-[7px] border border-gray-300 text-sm"
                                      />
                                      <input
                                        value={s.surname || ""}
                                        readOnly
                                        className="flex-1 bg-white px-2 h-[32px] rounded-[7px] border border-gray-300 text-sm"
                                      />
                                    </div> */}

                                    <div className="flex gap-2">
                                      {/* Reservation Type */}
                                      <div className="w-[150px] bg-[#0c2d67] text-white px-2 py-1 h-[32px] flex items-center rounded-[7px] text-sm">
                                        Reservation Type
                                      </div>
                                      <input
                                        value={s.reservation_type || "-"}
                                        readOnly
                                        className="flex-1 bg-white px-2 h-[32px] rounded-[7px] border border-gray-300 text-sm"
                                      />

                                      {/* City */}
                                      <div className="w-[80px] bg-[#0c2d67] text-white px-2 py-1 h-[32px] flex items-center rounded-[7px] text-sm">
                                        City
                                      </div>
                                      <input
                                        value={s.city || "-"}
                                        readOnly
                                        className="flex-1 bg-white px-2 h-[32px] rounded-[7px] border border-gray-300 text-sm"
                                      />
                                    </div>

                                    {[
                                      {
                                        label: "Post",
                                        value: activeFields.post
                                          ? s.designation
                                          : "Hidden",
                                      },
                                      {
                                        label: "Cell 1",
                                        value: activeFields.cell1
                                          ? phone1
                                          : "Hidden",
                                      },
                                      {
                                        label: "Cell 2",
                                        value: activeFields.cell2
                                          ? phone2
                                          : "Hidden",
                                      },
                                      {
                                        label: "Landmark",
                                        value: activeFields.landmark
                                          ? s.landmark
                                          : "Hidden",
                                      },
                                      {
                                        label: "Email 1",
                                        value: activeFields.email1
                                          ? email1
                                          : "Hidden",
                                      },
                                      {
                                        label: "Email 2",
                                        value: activeFields.email2
                                          ? email2
                                          : "Hidden",
                                      },
                                    ].map((item, i) => (
                                      <div key={i} className="flex gap-2">
                                        <div className="w-[110px] bg-[#0b2c6f] text-white px-2 h-[32px] flex items-center rounded-[7px] text-sm">
                                          {item.label}
                                        </div>
                                        <input
                                          value={item.value}
                                          readOnly
                                          className="flex-1 bg-white px-2 h-[32px] rounded-[7px] border border-gray-300 text-sm"
                                        />
                                      </div>
                                    ))}

                                    {/* LANDLINE + EXTENSION */}
                                    <div className="flex gap-2">
                                      <div className="w-[110px] bg-[#0b2c6f] text-white px-2 h-[32px] flex items-center rounded-[7px] text-sm">
                                        Landline
                                      </div>
                                      <input
                                        value={
                                          s.show_phones || isSupplier
                                            ? s.alternate_mobile || ""
                                            : "Hidden"
                                        }
                                        readOnly
                                        className="flex-1 bg-white px-2 h-[32px] rounded-[7px] border border-gray-300 text-sm"
                                      />

                                      <div className="bg-[#0b2c6f] text-white px-4 h-[32px] flex items-center rounded-[7px] text-sm">
                                        Extension
                                      </div>

                                      <input
                                        value={s.extension || ""}
                                        readOnly
                                        className="w-[80px] bg-white px-2 h-[32px] rounded-[7px] border border-gray-300 text-sm"
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "Q/A" && data?.faqs?.length > 0 && (
                  <div className="space-y-3">
                    {/* 🔵 Q/A HEADER */}
                    <div className="w-full bg-[#0b2c6f] rounded-[10px] py-1.5">
                      <h2 className="text-center text-white font-semibold text-[15px]">
                        Questions & Answers
                      </h2>
                    </div>

                    {/* 🔷 Q/A CONTAINER */}
                    <div className="bg-[#0c2d67] p-2 rounded-2xl">
                      <div className="bg-[#b9d3ea] p-2 rounded-2xl">
                        <div className="bg-[#FFE1E1] rounded-[14px] p-4 border border-[#0b2c6f]/20">
                          <div className="space-y-3">
                            {data.faqs.map((faq: any, index: number) => (
                              <div
                                key={faq.id}
                                className="border border-[#0b2c6f]/30 rounded-[10px] bg-[#FFE797] overflow-hidden"
                              >
                                {/* Question */}
                                <div
                                  className="flex justify-between items-center p-3 cursor-pointer hover:bg-[#FFDF60] transition-colors"
                                  onClick={() => toggleFAQ(index)}
                                >
                                  <h4 className="font-semibold text-sm text-[#0c2d67] flex gap-2">
                                    <span className="font-bold">Q:</span>
                                    {faq.question}
                                  </h4>

                                  <div className="text-[#0c2d67]">
                                    {openIndex === index ? (
                                      <FaChevronUp size={14} />
                                    ) : (
                                      <FaChevronDown size={14} />
                                    )}
                                  </div>
                                </div>

                                {/* Answer */}
                                {openIndex === index && (
                                  <div className="px-3 pb-3 pt-1 text-sm text-gray-700 bg-[#FFF5CC] border-t border-[#0b2c6f]/10">
                                    <span className="font-semibold text-[#0c2d67]">
                                      A:
                                    </span>{" "}
                                    {faq.answer}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* {activeTab === "policies" && (
                  <div className="space-y-3">
              
                    <div className="w-full bg-[#0b2c6f] rounded-[10px] py-1.5">
                      <h2 className="text-center text-white font-semibold text-[15px]">
                        Booking and Cancellation Policy
                      </h2>
                    </div>

              
                    <div className="bg-[#0c2d67] p-2 rounded-2xl">
                      <div className="bg-[#b9d3ea] p-2 rounded-2xl">
                        <div className="bg-[#FFE1E1] rounded-[14px] p-4 border border-[#0b2c6f]/20">
                         
                          <div className="bg-white p-4 rounded-xl border border-black space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                          
                              {data?.policies?.booking_policy && (
                                <div className="border border-black rounded-xl overflow-hidden">
                                  <h4 className="bg-[#FF0000] text-white text-center font-bold text-lg py-2">
                                    Booking Policy
                                  </h4>
                                  <div className="p-3 bg-[#FFDADA]">
                                    <ul className="space-y-2 text-sm text-justify">
                                      {data.policies.booking_policy
                                        .split("\n")
                                        .map((item: string, i: number) => (
                                          <li key={i} className="flex gap-3">
                                            <span className="mt-1.5 w-2 h-2 bg-black rounded-full shrink-0" />
                                            <span>{item}</span>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                </div>
                              )}

                           
                              {data?.policies?.cancellation_policy && (
                                <div className="border border-black rounded-xl overflow-hidden">
                                  <h4 className="bg-[#FF0000] text-white text-center font-bold text-lg py-2">
                                    Cancellation Policy
                                  </h4>
                                  <div className="p-3 bg-[#FFDADA]">
                                    <p className="text-sm text-justify whitespace-pre-line">
                                      {data.policies.cancellation_policy}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )} */}

                {activeTab === "policies" && (
                  <div className="space-y-3">
                    <div className="w-full bg-[#0b2c6f] rounded-[10px] py-1.5">
                      <h2 className="text-center text-white font-semibold text-[15px]">
                        Booking and Cancellation Policy
                      </h2>
                    </div>

                    <div className="bg-[#0c2d67] p-2 rounded-2xl">
                      <div className="bg-[#b9d3ea] p-2 rounded-2xl">
                        <div className="bg-[#FFE1E1] rounded-[14px] p-4 border border-[#0b2c6f]/20">
                          {(() => {
                            const policiesData = Array.isArray(data?.policies)
                              ? data?.policies?.[0] || {}
                              : data?.policies || {};

                            const safeParseRows = (value: any) => {
                              try {
                                if (!value) return [];
                                if (Array.isArray(value)) return value;

                                if (typeof value === "string") {
                                  const parsed = JSON.parse(value);
                                  return Array.isArray(parsed) ? parsed : [];
                                }

                                return [];
                              } catch {
                                return [];
                              }
                            };

                            const bookingRows = safeParseRows(
                              policiesData.booking_policy,
                            );
                            const cancellationRows = safeParseRows(
                              policiesData.cancellation_policy,
                            );

                            const bookingRemarks =
                              policiesData.child_policy || "";
                            const cancellationRemarks =
                              policiesData.pet_policy || "";

                            return (
                              <div className="space-y-4">
                                {/* TABLES */}
                                <div className="grid md:grid-cols-2 gap-2">
                                  {/* BOOKING TABLE */}
                                  <div className="border-2 border-[#2f5297] rounded-xl overflow-hidden bg-[#dfe8f8] min-h-[330px]">
                                    <div className="grid grid-cols-[58%_42%] border-b border-black">
                                      <div className="bg-[#31539a] text-white text-xl font-bold flex items-center justify-center border-r-2 border-[#16346f] h-[54px]">
                                        Booking Policy
                                      </div>
                                      <div className="bg-[#31539a] text-white text-xl font-bold flex items-center justify-center h-[54px]">
                                        Amount
                                      </div>
                                    </div>

                                    {bookingRows.length > 0 ? (
                                      <>
                                        {bookingRows.map(
                                          (row: any, index: number) => (
                                            <div
                                              key={index}
                                              className="grid grid-cols-[58%_42%] border-b border-black min-h-[46px]"
                                            >
                                              <div className="px-3 py-2 flex items-center border-r-2 border-[#16346f] text-sm">
                                                {row.policy || "-"}
                                              </div>

                                              <div className="px-3 py-2 flex items-center text-sm font-bold text-green-700">
                                                {row.amount || "-"}
                                              </div>
                                            </div>
                                          ),
                                        )}

                                        <div className="h-[135px] bg-[#dfe8f8]" />
                                      </>
                                    ) : (
                                      <div className="p-4 text-sm text-gray-600">
                                        No booking policy found
                                      </div>
                                    )}
                                  </div>

                                  {/* CANCELLATION TABLE */}
                                  <div className="border-2 border-[#2f5297] rounded-xl overflow-hidden bg-[#dfe8f8] min-h-[330px]">
                                    <div className="grid grid-cols-[58%_42%] border-b border-black">
                                      <div className="bg-[#aa2100] text-white text-xl font-bold flex items-center justify-center border-r-2 border-[#16346f] h-[54px]">
                                        Cancellation Policy
                                      </div>
                                      <div className="bg-[#aa2100] text-white text-xl font-bold flex items-center justify-center h-[54px]">
                                        Charge
                                      </div>
                                    </div>

                                    {cancellationRows.length > 0 ? (
                                      <>
                                        {cancellationRows.map(
                                          (row: any, index: number) => (
                                            <div
                                              key={index}
                                              className="grid grid-cols-[58%_42%] border-b border-black min-h-[46px]"
                                            >
                                              <div className="px-3 py-2 flex items-center border-r-2 border-[#16346f] text-sm">
                                                {row.policy || "-"}
                                              </div>

                                              <div className="px-3 py-2 flex items-center text-sm font-bold text-[#9b2108]">
                                                {row.charge || "-"}
                                              </div>
                                            </div>
                                          ),
                                        )}

                                        <div className="h-[135px] bg-[#dfe8f8]" />
                                      </>
                                    ) : (
                                      <div className="p-4 text-sm text-gray-600">
                                        No cancellation policy found
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* REMARKS */}
                                <div className="grid md:grid-cols-2 gap-2">
                                  <div className="border-2 border-[#2f5297] rounded-xl overflow-hidden bg-[#ffe9e9]">
                                    <div className="bg-[#31539a] text-white text-lg font-bold flex items-center justify-center h-[48px]">
                                      Booking Policy Remarks
                                    </div>

                                    <div className="p-4 text-sm leading-6 text-justify whitespace-pre-line h-[150px] overflow-y-auto">
                                      {bookingRemarks || "-"}
                                    </div>
                                  </div>

                                  <div className="border-2 border-[#2f5297] rounded-xl overflow-hidden bg-[#ffe9e9]">
                                    <div className="bg-[#aa2100] text-white text-lg font-bold flex items-center justify-center h-[48px]">
                                      Cancellation Policy Remarks
                                    </div>

                                    <div className="p-4 text-sm leading-6 text-justify whitespace-pre-line h-[150px] overflow-y-auto">
                                      {cancellationRemarks || "-"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "bank" && (
                  <div className="space-y-4">
                    {/* 🔵 HEADER (same as other tabs) */}
                    <div className="w-full bg-[#0b2c6f] rounded-[10px] py-1.5">
                      <h2 className="text-center text-white font-semibold text-[15px]">
                        Bank Details
                      </h2>
                    </div>

                    {/* 🔷 OUTER FRAME */}
                    <div className="bg-[#0c2d67] p-2 rounded-2xl">
                      {/* 🔷 INNER FRAME */}
                      <div className="bg-[#b9d3ea] p-2 rounded-2xl">
                        {/* 🔷 YOUR ORIGINAL CONTENT (UNCHANGED) */}
                        {/* <div className="bg-[#66FFFF] p-4 rounded-xl border border-black"> */}
                        <div className="bg-[#FFE1E1] p-4 rounded-xl">
                          <div className="grid grid-cols-3 gap-6">
                            {/* ================= LEFT SIDE ================= */}
                            <div className="col-span-1">
                              {(Array.isArray(data?.bank_details)
                                ? data.bank_details
                                : [0, 1]
                              ).map((bank: any, bankIndex: number) => (
                                <div key={bankIndex} className="mb-4">
                                  <div className="text-sm font-semibold mb-2">
                                    Bank {bankIndex + 1}
                                  </div>

                                  {[
                                    { label: "Bank Name", key: "bank_name" },
                                    {
                                      label: "Account Name",
                                      key: "account_holder",
                                    },
                                    {
                                      label: "Account Number",
                                      key: "account_number",
                                    },
                                    { label: "IFSC Code", key: "ifsc" },
                                    { label: "Branch Name", key: "branch" },
                                    {
                                      label: "Bank Address",
                                      key: "bank_address",
                                    },
                                    { label: "Address", key: "address" },
                                  ].map((item) => (
                                    <div
                                      key={item.key}
                                      className="flex items-center gap-1 mt-[2px]"
                                    >
                                      <div className="bg-[#0c2d67] text-white text-xs font-semibold px-2 py-1 h-7 flex items-center w-36 rounded-[5px] border-2 border-gray-700">
                                        {item.label}
                                      </div>

                                      <div className="flex-1 h-7 px-2 py-1 text-xs bg-[#fff] border-2 border-gray-700 rounded-[5px] flex items-center overflow-hidden whitespace-nowrap text-ellipsis">
                                        {bank?.[item.key] || "-"}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>

                            {/* ================= CENTER ================= */}
                            {/* <div className="flex flex-col items-center justify-start">
                              <div className="w-[260px] h-[85%] mt-7 bg-[#d6c4c4] border border-black rounded-xl flex items-center justify-center overflow-hidden">
                                {data?.bank_details?.[0]?.cancelled_cheque ? (
                                  <img
                                    src={`${API_URL}/uploads/${data.bank_details[0].cancelled_cheque}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-gray-600 text-sm">
                                    Preview
                                  </span>
                                )}
                              </div>
                            </div> */}

                            <div className="flex flex-col items-center justify-start">
                              <div className="w-[260px] h-[85%] mt-7 bg-[#d6c4c4] border border-black rounded-md flex items-center justify-center">
                                {data?.bank_details?.[0]?.cancelled_cheque ? (
                                  <img
                                    src={`${API_URL}/uploads/${data.bank_details[0].cancelled_cheque}`}
                                    className="w-full h-full object-cover"
                                    alt="Cancelled Cheque"
                                    onError={(e) => {
                                      console.log(
                                        "Image failed:",
                                        e.currentTarget.src,
                                      );
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <span className="text-gray-600 text-sm">
                                    Preview
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* ================= RIGHT SIDE ================= */}
                            <div className="col-span-1 flex flex-col gap-2 mt-6">
                              <div className="flex items-center gap-1 mt-[2px]">
                                <div className="bg-[#0c2d67] text-white text-xs font-semibold px-2 h-7 flex items-center w-36 border-2 border-gray-700 rounded-[5px]">
                                  Gpay Number
                                </div>

                                <div className="flex-1 h-7 px-2 text-xs bg-[#fff] border-2 border-gray-700 rounded-[5px] flex items-center">
                                  {/* {data?.gpay_number || "-"} */}
                                  {data?.bank_details?.[0]?.gpay_number || "-"}
                                </div>
                              </div>

                              <div className="flex items-center gap-1 mt-[2px]">
                                <div className="bg-[#0c2d67] text-white text-xs font-semibold px-2 h-7 flex items-center w-36 border-2 border-gray-700 rounded-[5px]">
                                  Gpay Name
                                </div>

                                <div className="flex-1 h-7 px-2 text-xs bg-[#fff] border-2 border-gray-700 rounded-[5px] flex items-center">
                                  {/* {data?.gpay_name || "-"} */}
                                  {data?.bank_details?.[0]?.gpay_name || "-"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* </div> */}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "media" && (
                  <div className="space-y-4">
                    {/* 🔵 HEADER (same as address) */}
                    <div className="w-full bg-[#0b2c6f] rounded-[10px] py-1.5">
                      <h2 className="text-center text-white font-semibold text-[15px]">
                        Media
                      </h2>
                    </div>

                    {/* 🔷 OUTER CONTAINER */}
                    {/* <div className="bg-[#0c2d67] p-2 rounded-2xl">
                      <div className="bg-[#b9d3ea] p-3 rounded-2xl">
                       
                        <div className="bg-[#FFE1E1] p-4 rounded-xl">
                          
                          <div className="flex gap-3 mb-4">
                            {["photo", "video"].map((tab) => (
                              <div
                                key={tab}
                                className="border-2 border-black bg-[#cfe3f5] p-[4px]"
                              >
                                <button
                                  onClick={() => {
                                    setMediaType(tab as any);
                                    setMediaIndex(0);
                                  }}
                                  className={`px-10 py-1.5 text-sm font-semibold bg-[#123e6b] text-white ${
                                    mediaType === tab ? "" : "opacity-70"
                                  }`}
                                >
                                  {tab === "photo" ? "Photo" : "Video"}
                                </button>
                              </div>
                            ))}
                          </div>

                          
                          {(() => {
                            const currentData =
                              mediaType === "photo"
                                ? data?.images
                                : data?.videos;

                            if (!currentData || currentData.length === 0) {
                              return (
                                <div className="text-center py-10">
                                  No Media Available
                                </div>
                              );
                            }

                            return (
                              <div className="flex gap-6">
                              
                                <div className="w-[520px] h-[420px] bg-[#d9d9d9] rounded-xl overflow-hidden border border-gray-400">
                                  {/* {mediaType === "photo" ? (
                                    <img
                                      src={`${API_URL}/uploads/${currentData[mediaIndex]?.image_path}`}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <video
                                      src={`${API_URL}/uploads/${currentData[mediaIndex]?.video_path}`}
                                      className="w-full h-full object-cover"
                                      controls
                                    />
                                  )} 
                                  
                                </div>

                               
                                <div className="grid grid-cols-2 gap-2 w-[420px] h-[420px] overflow-y-auto">
                                  {currentData.map(
                                    (item: any, index: number) => (
                                      <div
                                        key={index}
                                        onClick={() => setMediaIndex(index)}
                                        className="cursor-pointer rounded-xl overflow-hidden bg-[#d9d9d9]"
                                        style={{ height: "200px" }}
                                      >
                                        {mediaType === "photo" ? (
                                          <img
                                            src={`${API_URL}/uploads/${item.image_path}`}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <video
                                            src={`${API_URL}/uploads/${item.video_path}`}
                                            className="w-full h-full object-cover"
                                          />
                                        )}
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div> */}

                    <div className="bg-[#0c2d67] p-2 rounded-2xl">
                      <div className="bg-[#b9d3ea] p-3 rounded-2xl">
                        <div className="bg-[#FFE1E1] p-4 rounded-xl">
                          {/* TABS */}
                          <div className="flex gap-3 mb-4">
                            {["photo", "video"].map((tab) => (
                              <div
                                key={tab}
                                className="border-2 border-black bg-[#cfe3f5] p-[4px]"
                              >
                                <button
                                  onClick={() => {
                                    setMediaType(tab as any);
                                    setMediaIndex(0);
                                  }}
                                  className={`px-10 py-1.5 text-sm font-semibold bg-[#123e6b] text-white ${
                                    mediaType === tab ? "" : "opacity-70"
                                  }`}
                                >
                                  {tab === "photo" ? "Photo" : "Video"}
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* DATA */}
                          {!currentData || currentData.length === 0 ? (
                            <div className="text-center py-10">
                              No Media Available
                            </div>
                          ) : (
                            <div className="flex gap-6">
                              {/* 🔶 LEFT BIG VIEW */}
                              <div className="w-[520px] h-[420px] bg-[#d9d9d9] rounded-xl overflow-hidden border border-gray-400">
                                {/* PHOTO */}
                                {mediaType === "photo" && (
                                  <img
                                    src={`${API_URL}/uploads/${currentData[mediaIndex]?.image_path}`}
                                    className="w-full h-full object-cover"
                                  />
                                )}

                                {/* VIDEO */}
                                {mediaType === "video" &&
                                  (currentData[mediaIndex]?.video_url ? (
                                    // ✅ YOUTUBE LINK
                                    <iframe
                                      src={getEmbedUrl(
                                        currentData[mediaIndex].video_url,
                                      )}
                                      className="w-full h-full"
                                      allowFullScreen
                                    />
                                  ) : (
                                    // ✅ UPLOADED VIDEO
                                    <video
                                      src={`${API_URL}/uploads/${currentData[mediaIndex]?.video_path}`}
                                      className="w-full h-full object-cover"
                                      controls
                                    />
                                  ))}
                              </div>

                              {/* 🔶 RIGHT THUMBNAILS */}
                              <div className="grid grid-cols-2 gap-2 w-[420px] h-[420px] overflow-y-auto">
                                {currentData.map((item: any, index: number) => (
                                  <div
                                    key={index}
                                    onClick={() => setMediaIndex(index)}
                                    className={`cursor-pointer rounded-xl overflow-hidden bg-[#d9d9d9] border-2 ${
                                      mediaIndex === index
                                        ? "border-blue-600"
                                        : "border-transparent"
                                    }`}
                                    style={{ height: "200px" }}
                                  >
                                    {/* PHOTO */}
                                    {mediaType === "photo" && (
                                      <img
                                        src={`${API_URL}/uploads/${item.image_path}`}
                                        className="w-full h-full object-cover"
                                      />
                                    )}

                                    {/* VIDEO */}
                                    {mediaType === "video" &&
                                      (item.video_url ? (
                                        // ✅ YOUTUBE THUMB
                                        <iframe
                                          src={getEmbedUrl(item.video_url)}
                                          className="w-full h-full"
                                        />
                                      ) : (
                                        // ✅ VIDEO FILE
                                        <video
                                          src={`${API_URL}/uploads/${item.video_path}`}
                                          className="w-full h-full object-cover"
                                        />
                                      ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "annual" && (
                  <div className="space-y-4">
                    {/* 🔵 HEADER */}
                    <div className="w-full bg-[#0b2c6f] rounded-[10px] py-1.5">
                      <h2 className="text-center text-white font-semibold text-[15px]">
                        Annual Charges
                      </h2>
                    </div>

                    {/* 🔷 OUTER FRAME */}
                    <div className="bg-[#0c2d67] p-2 rounded-2xl">
                      <div className="bg-[#b9d3ea] p-3 rounded-2xl">
                        <div className="bg-[#FFE1E1] p-4 rounded-xl space-y-3">
                          {[
                            {
                              label: "Maintenance Fee",
                              amount: data?.annual_charges?.maintenance_amount,
                              note: data?.annual_charges?.maintenance_note,
                            },
                            {
                              label: "Service Charges",
                              amount: data?.annual_charges?.service_amount,
                              note: data?.annual_charges?.service_note,
                            },
                            {
                              label: "GST (%)",
                              amount: data?.annual_charges?.gst_amount,
                              note: data?.annual_charges?.gst_note,
                            },
                            {
                              label: "Extra Charges",
                              amount: data?.annual_charges?.extra_amount,
                              note: data?.annual_charges?.extra_note,
                            },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="grid grid-cols-[200px_150px_1fr] gap-2 items-center"
                            >
                              {/* 🔴 LABEL */}
                              <div className="bg-[#0c2d67] text-white px-3 py-1 rounded-[7px]">
                                {item.label}
                              </div>

                              {/* 💰 AMOUNT (READ ONLY DISPLAY) */}
                              <div className="bg-[#FFF5CC] px-3 py-1 border border-black rounded-[7px] w-full">
                                {item.amount ?? "-"}
                              </div>

                              {/* 📝 NOTE (READ ONLY DISPLAY) */}
                              <div className="bg-[#FFF5CC] px-3 py-1 border border-black rounded-[7px] w-full">
                                {item.note || "-"}
                              </div>
                            </div>
                          ))}

                          {/* 🔶 TOTAL */}
                          <div className="mt-4 border-t pt-3">
                            <div className="grid grid-cols-[200px_150px_1fr] gap-2 items-center">
                              <div className="bg-[#0c2d67] text-white px-3 py-1 rounded-[7px]">
                                Total
                              </div>

                              <div className="bg-[#FFF5CC] px-3 py-1 border border-black rounded-[7px] w-full font-semibold">
                                {Number(
                                  data?.annual_charges?.maintenance_amount || 0,
                                ) +
                                  Number(
                                    data?.annual_charges?.service_amount || 0,
                                  ) +
                                  Number(
                                    data?.annual_charges?.extra_amount || 0,
                                  ) || 0}
                              </div>

                              <div className="bg-[#FFF5CC] px-3 py-1 border border-black rounded-[7px] w-full">
                                Auto Calculated
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
