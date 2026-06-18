import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavLink } from "@/components/NavLink";
import { getUser, logout } from "@/utils/auth";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

interface HeaderProps {
  onLogout?: () => void;
}


const Header = ({ onLogout }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());
 const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
 

  const isLogin = location.pathname === "/" || location.pathname === "/login";

 /* SCROLL EFFECT */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* CLICK OUTSIDE CLOSE */
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);





const navItems = [
  { to: "/home", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];
const handleLogout = () => {
  logout();
  onLogout?.();
  navigate("/login", { replace: true });
};
useEffect(() => {
  const handleLogoutEvent = () => setUser(null);
  window.addEventListener("logout", handleLogoutEvent);

  return () => window.removeEventListener("logout", handleLogoutEvent);
}, []);
  return (
    <header
   className={cn(
  "sticky top-0 z-50 w-full transition-all duration-300",
  scrolled
    ? "h-16 bg-primary/70 backdrop-blur-2xl border-b border-white/10 shadow-2xl"
    : "h-20 bg-primary/90 backdrop-blur-xl"
)}
    >
      <div className="container mx-auto px-6 flex items-center justify-between h-full text-primary-foreground">

        {/* LOGO */}
        <Link to="/home" className="flex items-center">
          <img
            src="/b2blogo.png"
            alt="B2B Partners Logo"
            className={cn(
              "w-auto transition-all duration-300",
              scrolled ? "h-12" : "h-14 sm:h-16"
            )}
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className="text-base font-medium text-white/80 hover:text-white relative transition duration-300 after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-accent hover:after:w-full after:transition-all"
              activeClassName="text-white font-semibold border-b-2 border-accent"
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* RIGHT */}
        {!user ? (
          <div className="hidden md:flex items-center gap-3">

            <Link to="/register">
              <Button className="bg-accent text-accent-foreground rounded-full px-6 hover:opacity-90">
                Sign Up
              </Button>
            </Link>

            <Link to="/login">
              <Button
                className={cn(
                  "bg-primary-foreground text-primary rounded-full px-6 hover:bg-white/90",
                  isLogin && "ring-2 ring-accent"
                )}
              >
                Login
              </Button>
            </Link>

          </div>
        ) : (
          <div
  ref={dropdownRef}
  className="hidden md:block relative"
  onMouseEnter={() => setOpen(true)}
  onMouseLeave={() => setOpen(false)}
>
            <button
            
              className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/20 border border-white/10 transition duration-300 shadow-sm"
            >
              {/* AVATAR */}
  <div className="w-9 h-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm shadow">
    {user?.company_name?.charAt(0)?.toUpperCase() || "U"}
  </div>
              <div className="text-left leading-tight">
                <p className="text-sm font-semibold">{user.company_name}</p>
                <p className="text-xs text-white/70 capitalize">{user.role}</p>
              </div>
              <ChevronDown size={16} />
            </button>

    {open && (
   <div
  className={`
   absolute right-[-80px] w-44
    bg-white/95 backdrop-blur-xl text-foreground
    rounded-2xl border border-border shadow-2xl p-1
    transition-all duration-200
    ${open
      ? "opacity-100 translate-y-0 pointer-events-auto"
      : "opacity-0 translate-y-2 pointer-events-none"}
  `}
>

                {user.role === "supplier" && (
                  <>
                    <Link to="/supplier/dashboard" className="block px-4 py-3 rounded-xl hover:bg-muted transition">
                      Dashboard
                    </Link>
                    <Link to="/supplier/add-property" className="block px-4 py-3 rounded-xl hover:bg-muted transition">
                      Add Property
                    </Link>
                  </>
                )}

                {user.role === "agent" && (
                  <Link to="/agent/bookings" className="block px-4 py-3 rounded-xl hover:bg-muted transition">
                    My Bookings
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="block px-4 py-3 rounded-xl hover:bg-muted transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* MOBILE BUTTON */}
       {/* MOBILE BUTTON */}
        <button onClick={() => setMobileOpen(o => !o)} className="md:hidden">
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

     {/* MOBILE MENU */}
{mobileOpen && (
  <div className="md:hidden bg-gradient-to-b from-primary/95 to-primary backdrop-blur-xl px-6 pb-8 pt-6 space-y-6 shadow-2xl border-t border-white/10">

    {/* NAV LINKS */}
    <div className="space-y-3 border-b border-white/20 pb-4">
      {navItems.map(i => (
        <Link
          key={i.to}
          to={i.to}
          onClick={() => setMobileOpen(false)}
          className="block text-white font-medium text-lg"
        >
          {i.label}
        </Link>
      ))}
    </div>

    {/* AUTH / ROLE MENU */}
    {!user ? (
      <div className="flex gap-3 pt-4">
        <Link to="/register" className="flex-1">
          <Button className="w-full bg-accent rounded-full">
            Sign Up
          </Button>
        </Link>

        <Link to="/login" className="flex-1">
          <Button className="w-full bg-white text-primary rounded-full">
            Login
          </Button>
        </Link>
      </div>
    ) : (
      <div className="space-y-3 pt-4">

        {user.role === "supplier" && (
          <>
            <Link
              to="/supplier/dashboard"
              onClick={() => setMobileOpen(false)}
              className="block text-white font-medium"
            >
              Dashboard
            </Link>

            <Link
              to="/supplier/add-property"
              onClick={() => setMobileOpen(false)}
              className="block text-white font-medium"
            >
              Add Property
            </Link>
          </>
        )}

        {user.role === "agent" && (
          <Link
            to="/my-bookings"
            onClick={() => setMobileOpen(false)}
            className="block text-white font-medium"
          >
            My Bookings
          </Link>
        )}

        <Button
          onClick={handleLogout}
          className="w-full bg-white text-primary rounded-full mt-2"
        >
          Logout
        </Button>
      </div>
    )}
  </div>
)}
    </header>
  );
};

export default Header;