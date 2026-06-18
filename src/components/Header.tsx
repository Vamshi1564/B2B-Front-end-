import {
  Ship,
  Compass,
  Phone,
  UserCircle,
  Home as HomeIcon,
  ChevronDown,
  Sparkles,
  Heart,
  GraduationCap,
  Car,
  Bus,
  Map,
  Landmark,
  Umbrella,
  CalendarDays,
  Users,
  Shield,
  Star,
  UsersRound,
  Globe,
  MapPin,
  ChevronRight,
  PlaneTakeoff,
  UserPlus,
  Menu as MenuIcon,
  X as XIcon,
  ChevronLeft,
  Plane,
  Calculator,
  Code,
  DollarSign,
  FileBadge,
  FileText,
  Hammer,
  Languages,
  PenTool,
  Printer,
  Sofa,
  Trees,
  UserCheck,
  Waves,
  Building2,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { getUser, logout } from "@/utils/auth";
import { useState, useRef, useEffect } from "react";
import { API_URL } from "../config/api";
import { Link } from "react-router-dom";
// import { Landmark } from "lucide-react";

// Types for API responses
interface Country {
  country_id: number;
  name: string;
  is_domestic: number;
}

interface Destination {
  destination_id: number;
  name: string;
  short_desc: string | null;
  created_at: string;
  country_name: string;
  country_id: number;
  is_domestic: number;
}

interface GroupedDestinations {
  [countryId: number]: {
    countryName: string;
    destinations: {
      name: string;
      hasActiveTours: boolean;
    }[];
  };
}

interface NavItemDropdown {
  label: string;
  href: string;
  icon?: any;
  subDropdown?: { state_name: string; status: number }[];
  isCountryList?: boolean;
}

interface NavItem {
  icon: any;
  label: string;
  href?: string;
  dropdown?: NavItemDropdown[];
}

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<
    Record<string, boolean>
  >({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  // State to store tours data
  const [allTours, setAllTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(getUser());

  const isLoginPage =
    location.pathname === "/" || location.pathname === "/login";

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/", { replace: true }); // go to default page "/"
  };

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const toggleMobileSubmenu = (label: string) => {
    setMobileSubmenuOpen((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const createHoverHandlers = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    timerRef: React.MutableRefObject<NodeJS.Timeout | null>,
  ) => {
    const enter = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setter(true);
    };
    const leave = () => {
      timerRef.current = setTimeout(() => {
        setter(false);
        timerRef.current = null;
      }, 300);
    };
    return { enter, leave };
  };

  const [states, setStates] = useState<
    { state_name: string; status: number }[]
  >([]);

  useEffect(() => {
    fetch(`${API_URL}/api/states`)
      .then((res) => res.json())
      .then((data) => {
        setStates(data); // ✅ keep original DB order
      })
      .catch((err) => console.error(err));
  }, []);

  const navItems: NavItem[] = [
    { icon: HomeIcon, label: "Home", href: "/" },
    {
      icon: Building2,
      label: "Hotels",
      dropdown: [
        { label: "State", href: "#state", icon: MapPin, subDropdown: states },
      ],
    },
    {
      icon: Home,
      label: "Bungalow / Villa",
      dropdown: [
        {
          label: "State",
          href: "#state",
          icon: MapPin,
          subDropdown: states,
          isCountryList: true,
        },
      ],
    },
    {
      icon: Car,
      label: "Transport",
      href: "#transport",
      dropdown: [
        {
          label: "State",
          href: "#state",
          icon: MapPin,
          subDropdown: states,
          isCountryList: true,
        },
      ],
    },
    {
      icon: Ship, // 🚤 better than PlaneTakeoff
      label: "House Boat",
      href: "#house-boat",
      dropdown: [
        {
          label: "Alleppey",
          href: "#alleppey",
          icon: Waves, // 🌊 backwaters
        },
        {
          label: "Kumarakom",
          href: "#kumarakom",
          icon: Waves, // 🌊 water destination
        },
        {
          label: "Srinagar",
          href: "#srinagar",
          icon: MapPin, // 📍 location (Dal Lake)
        },
      ],
    },
    {
      icon: PlaneTakeoff,
      label: "Travel Essentials",
      href: "#travel-essentials",
      dropdown: [
        {
          label: "Airlines",
          href: "#airlines",
          icon: Plane, // ✈️ flights
        },
        {
          label: "Consulates",
          href: "#consulates",
          icon: Landmark, // 🏛️ embassy/consulate
        },
        {
          label: "Tourism",
          href: "#tourism",
          icon: Map, // 🗺️ travel/tourism
        },
      ],
    },
    {
      icon: Star,
      label: "Others",
      dropdown: [
        { label: "Forex", href: "/forex", icon: DollarSign }, // 💰 money
        { label: "Insurance", href: "/insurance", icon: Shield }, // 🛡️ protection
        { label: "Tour Guide", href: "/tour-guide", icon: UserCheck }, // 👤 guide
        { label: "Visa", href: "/visa", icon: FileText }, // 📄 document
        { label: "Translator", href: "/translator", icon: Languages }, // 🌐 language
        { label: "Permits", href: "/permits", icon: FileBadge }, // 📜 approval
        { label: "Safaris", href: "/safaris", icon: Trees }, // 🌳 nature
        { label: "Stall Staff Suppliers", href: "/stall-staff", icon: Users }, // 👥 staff
        {
          label: "Stall Fabricators",
          href: "/stall-fabricators",
          icon: Hammer,
        }, // 🔨 build
        { label: "Stall Designers", href: "/stall-designers", icon: PenTool }, // 🎨 design
        { label: "Flex Printers", href: "/flex-printers", icon: Printer }, // 🖨️ print
        { label: "Furniture TV Suppliers", href: "/furniture-tv", icon: Sofa }, // 🛋️ furniture
        {
          label: "Software Developer",
          href: "/software-developer",
          icon: Code,
        }, // 💻 dev
        {
          label: "Accounts Software",
          href: "/accounts-software",
          icon: Calculator,
        }, // 🧮 accounts
      ],
    },
    { icon: UsersRound, label: "About Us", href: "/about" },
    { icon: Phone, label: "Contact Us", href: "/contact" },
    { icon: Landmark, label: "Bank Details", href: "/bankdetails" },
  ];

  // const filteredNavItems = isLoginPage && !user
  // ? navItems.filter(
  //     (item) =>
  //       item.label === "Home" ||
  //       item.label === "About Us" ||
  //       item.label === "Contact Us"
  //   )
  // : navItems;

  const filteredNavItems = !user
    ? navItems.filter(
        (item) =>
          item.label === "Home" ||
          item.label === "About Us" ||
          item.label === "Contact Us" ||
          item.label === "Bank Details",
      )
    : navItems;

  return (
    <header className="bg-[#1B2A5E] text-primary-foreground sticky top-0 z-50 shadow-xl border-b-2 border-blue-400 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* LOGO */}
          <div className="flex items-center">
            <div className="relative group cursor-pointer">
              <Link
                to="/"
                className="flex items-center bg-white p-[2px] rounded-[10px]
             shadow-[0_0_30px_10px_rgba(255,255,255,0.8)]"
              >
                <img src="/b2blogo.png" alt="Logo" className="h-20 w-auto" />
              </Link>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            {mobileMenuOpen ? (
              <XIcon className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-end justify-center flex-1 gap-1 flex-nowrap">
            {filteredNavItems.map((item, index) => (
              <div key={index} className="relative group">
                {!item.dropdown ? (
                  <Link
                    to={item.href || "#"}
                    className="flex flex-col items-center justify-center w-[100px] h-[78px]
  gap-1.5 hover:bg-white/10 rounded-lg transition text-center"
                  >
                    <item.icon className="w-5 h-5" />

                    <span className="text-[12.5px] font-medium leading-[1.1] whitespace-nowrap">
                      {item.label}
                    </span>
                  </Link>
                ) : (
                  <>
                    <div
                      className="flex flex-col items-center justify-center w-[100px] h-[78px]
gap-1.5 hover:bg-white/10 rounded-lg transition text-center"
                    >
                      <item.icon className="w-5 h-5 mb-1" />

                      <div className="flex items-center gap-1">
                        <span className="text-[12.5px] font-medium whitespace-nowrap">
                          {item.label}
                        </span>
                        <ChevronDown className="w-3 h-3" />
                      </div>
                    </div>

                    {/* DROPDOWN */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block bg-white text-gray-800 rounded-xl shadow-xl min-w-[220px] py-2 border z-50">
                      {item.dropdown.map((sub, idx) => (
                        <div key={idx} className="relative group/sub">
                          {/* SUB ITEM */}
                          {!sub.subDropdown ? (
                            <Link
                              to={sub.href}
                              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                            >
                              {sub.icon && <sub.icon className="w-4 h-4" />}
                              {sub.label}
                            </Link>
                          ) : (
                            <>
                              {/* SUB DROPDOWN TITLE */}
                              <div className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                                <div className="flex items-center gap-2">
                                  {sub.icon && <sub.icon className="w-4 h-4" />}
                                  {sub.label}
                                </div>
                                <ChevronRight className="w-4 h-4" />
                              </div>

                              {/* STATES DROPDOWN */}
                              <div
                                className="
  absolute left-full top-0
  hidden group-hover/sub:block
 bg-red-50 text-gray-800 rounded-xl shadow-2xl
  border border-gray-200
  w-[550px] z-50
  opacity-0 translate-x-2
  group-hover/sub:opacity-100 group-hover/sub:translate-x-0
  transition-all duration-200
"
                              >
                                <div className="p-1">
                                  <div className="grid grid-cols-3 gap-[1px] bg-gray-300 rounded-xl overflow-hidden border-2 border-gray-400">
                                    {sub.subDropdown?.map((stateObj, i) => {
                                      const isInactive = stateObj.status === 0;

                                      return (
                                        <Link
                                          key={i}
                                          to={
                                            !isInactive
                                              ? `/${stateObj.state_name.toLowerCase().replace(/\s+/g, "-")}`
                                              : "#"
                                          }
                                          onClick={(e) =>
                                            isInactive && e.preventDefault()
                                          }
                                          className={`
        text-center text-sm py-2 px-2 font-medium transition-all duration-200

        ${
          isInactive
            ? "bg-gray-300 text-gray-400 cursor-not-allowed"
            : `${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-[#2E3a8a] hover:text-white`
        }
      `}
                                          title={
                                            isInactive
                                              ? "Coming soon"
                                              : stateObj.state_name
                                          }
                                        >
                                          {stateObj.state_name === "Andaman"
                                            ? "Andaman (P. Blair)"
                                            : stateObj.state_name}
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Login/Signup - Vertical Layout */}
          <div className="hidden lg:flex flex-col items-end gap-2 ml-auto">
            {!user ? (
              <>
                {/* SIGN UP */}
                <Link to="/register">
                  <Button className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 w-[120px] justify-center">
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </Button>
                </Link>

                {/* LOGIN */}
                <Link to="/login">
                  <Button
                    className={`bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 w-[120px] justify-center ${
                      isLoginPage ? "ring-2 ring-white" : ""
                    }`}
                  >
                    <UserCircle className="w-4 h-4" />
                    Login
                  </Button>
                </Link>
              </>
            ) : (
              <div
                ref={dropdownRef}
                className="hidden md:block relative"
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
              >
                {/* USER BUTTON */}
                <button className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/20 border border-white/10 transition duration-300 shadow-sm max-w-[220px] overflow-hidden">
                  {/* AVATAR */}
                  <div className="w-9 h-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm shadow">
                    {user?.company_name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  {/* USER INFO */}
                  <div className="text-left leading-tight">
                    <p className="text-sm font-semibold truncate max-w-[50px]">
                      {user.company_name}
                    </p>
                    <p className="text-xs text-white/70 capitalize">
                      {user.role}
                    </p>
                  </div>

                  <ChevronDown size={16} />
                </button>

                {/* DROPDOWN */}
                {open && (
                  <div
                    className={`absolute right-[-10px] w-44 bg-white/95 backdrop-blur-xl text-foreground rounded-2xl border border-border shadow-2xl p-1 transition-all duration-200 ${
                      open
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 translate-y-2 pointer-events-none"
                    }`}
                  >
                    {/* SUPPLIER */}
                    {user.role === "supplier" && (
                      <>
                        <Link
                          to="/supplier/dashboard"
                          className="block px-4 py-3 rounded-xl hover:bg-muted transition"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/supplier/add-property"
                          className="block px-4 py-3 rounded-xl hover:bg-muted transition"
                        >
                          Add Property
                        </Link>
                      </>
                    )}

                    {/* AGENT */}
                    {user.role === "agent" && (
                      <Link
                        to="/agent/bookings"
                        className="block px-4 py-3 rounded-xl hover:bg-muted transition"
                      >
                        My Bookings
                      </Link>
                    )}

                    {/* LOGOUT */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-muted transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {mobileMenuOpen && (
            <nav className="lg:hidden bg-primary text-white border-t border-blue-400">
              <ul className="flex flex-col">
                {filteredNavItems.map((item, index) => (
                  <li key={index} className="border-b border-blue-500">
                    {/* MAIN ITEM */}
                    {!item.dropdown ? (
                      <Link
                        to={item.href || "#"}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-4 text-base font-medium hover:bg-white/10"
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    ) : (
                      <>
                        {/* MAIN DROPDOWN */}
                        <button
                          onClick={() => toggleMobileSubmenu(item.label)}
                          className="w-full flex justify-between items-center px-5 py-4 text-base font-medium hover:bg-white/10"
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5" />
                            {item.label}
                          </div>

                          <ChevronDown
                            className={`w-4 h-4 transition ${
                              mobileSubmenuOpen[item.label] ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* FIRST LEVEL */}
                        {mobileSubmenuOpen[item.label] && (
                          <ul className="bg-primary/90">
                            {item.dropdown.map((sub, i) => (
                              <li key={i} className="border-t border-blue-600">
                                {/* SIMPLE SUB */}
                                {!sub.subDropdown ? (
                                  <Link
                                    to={sub.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2 px-10 py-3 text-sm hover:bg-white/10"
                                  >
                                    {sub.icon && (
                                      <sub.icon className="w-4 h-4" />
                                    )}
                                    {sub.label}
                                  </Link>
                                ) : (
                                  <>
                                    {/* SUB DROPDOWN */}
                                    <button
                                      onClick={() =>
                                        toggleMobileSubmenu(sub.label)
                                      }
                                      className="w-full flex justify-between items-center px-10 py-3 text-sm hover:bg-white/10"
                                    >
                                      <div className="flex items-center gap-2">
                                        {sub.icon && (
                                          <sub.icon className="w-4 h-4" />
                                        )}
                                        {sub.label}
                                      </div>

                                      <ChevronDown
                                        className={`w-4 h-4 transition ${
                                          mobileSubmenuOpen[sub.label]
                                            ? "rotate-180"
                                            : ""
                                        }`}
                                      />
                                    </button>

                                    {/* STATES LIST */}
                                    {sub.subDropdown?.map((stateObj, j) => {
                                      const isInactive = stateObj.status === 0;

                                      return (
                                        <li key={j}>
                                          <Link
                                            to={
                                              !isInactive
                                                ? `/${stateObj.state_name.toLowerCase().replace(/\s+/g, "-")}`
                                                : "#"
                                            }
                                            onClick={(e) => {
                                              if (isInactive)
                                                e.preventDefault();
                                              else setMobileMenuOpen(false);
                                            }}
                                            className={`
          block px-14 py-2 text-sm
          ${
            isInactive
              ? "text-gray-500 cursor-not-allowed"
              : "text-gray-300 hover:text-white hover:bg-white/10"
          }
        `}
                                          >
                                            {stateObj.state_name}
                                          </Link>
                                        </li>
                                      );
                                    })}
                                  </>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </li>
                ))}

                {/* AUTH SECTION */}
                <li className="px-5 py-4">
                  {!user ? (
                    <div className="flex gap-3">
                      <Link to="/register" className="flex-1">
                        <Button className="w-full bg-green-500">Sign Up</Button>
                      </Link>

                      <Link to="/login" className="flex-1">
                        <Button className="w-full bg-red-500 text-white">
                          Login
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-sm font-semibold text-white">
                        {user.company_name}
                      </div>

                      {user.role === "supplier" && (
                        <>
                          <Link
                            to="/supplier/dashboard"
                            className="block text-sm"
                          >
                            Dashboard
                          </Link>
                          <Link
                            to="/supplier/add-property"
                            className="block text-sm"
                          >
                            Add Property
                          </Link>
                        </>
                      )}

                      {user.role === "agent" && (
                        <Link to="/my-bookings" className="block text-sm">
                          My Bookings
                        </Link>
                      )}

                      <Button
                        onClick={handleLogout}
                        className="w-full bg-white text-primary mt-2"
                      >
                        Logout
                      </Button>
                    </div>
                  )}
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
