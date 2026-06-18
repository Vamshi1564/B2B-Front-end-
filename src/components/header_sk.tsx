import {
  Ship, Compass, Phone, UserCircle, Home as HomeIcon, ChevronDown, Sparkles, Heart,
  GraduationCap, Car, Bus, Map, Landmark, Umbrella, CalendarDays, Users, Shield, Star,
  UsersRound, Globe, MapPin, ChevronRight, PlaneTakeoff, UserPlus, Menu as MenuIcon,
  X as XIcon, ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "../assets/png[3].png"; 
import { useState, useRef, useEffect } from "react";
import { API_URL } from "../config/api";

const indianStates = [
  "Andaman", "Andhra Pradesh", "Bihar", "Chhattisgarh", "Daman & Diu",
   "Goa", "Gujarat",  "Himachal Pradesh", "Jammu & Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh",
  "Maharashtra", "North East", "Odisha", "Puducherry", "Punjab", "Rajasthan",
   "Tamil Nadu", "Uttar Pradesh", "Uttarakhand", "West Bengal",
].sort();

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
  subDropdown?: string[];
  isCountryList?: boolean;
}

interface NavItem {
  icon: any;
  label: string;
  href?: string;
  dropdown?: NavItemDropdown[];
}

const Header = () => {
  const [showIndianIndividualStates, setShowIndianIndividualStates] = useState(false);
  const [showIndianGroupStates, setShowIndianGroupStates] = useState(false);
  const [showIndianLadiesStates, setShowIndianLadiesStates] = useState(false);
  const [showIndianSeniorStates, setShowIndianSeniorStates] = useState(false);
  const [showIndianStudentStates, setShowIndianStudentStates] = useState(false);
  const [showIndianHoneymoonStates, setShowIndianHoneymoonStates] = useState(false);
  const [showIndianSportsStates, setShowIndianSportsStates] = useState(false);
  const [showIndianFestivalStates, setShowIndianFestivalStates] = useState(false);
  
  const [showIntlIndividualCountries, setShowIntlIndividualCountries] = useState(false);
  const [showIntlGroupCountries, setShowIntlGroupCountries] = useState(false);
  const [showIntlLadiesCountries, setShowIntlLadiesCountries] = useState(false);
  const [showIntlSeniorCountries, setShowIntlSeniorCountries] = useState(false);
  const [showIntlStudentCountries, setShowIntlStudentCountries] = useState(false);
  const [showIntlHoneymoonCountries, setShowIntlHoneymoonCountries] = useState(false);
  const [showIntlSportsCountries, setShowIntlSportsCountries] = useState(false);
  const [showIntlFestivalCountries, setShowIntlFestivalCountries] = useState(false);
  
  // State for showing destinations for a specific country
  const [showIntlIndividualDestinations, setShowIntlIndividualDestinations] = useState<{countryId: number, countryName: string} | null>(null);
  const [showIntlGroupDestinations, setShowIntlGroupDestinations] = useState<{countryId: number, countryName: string} | null>(null);
  const [showIntlLadiesDestinations, setShowIntlLadiesDestinations] = useState<{countryId: number, countryName: string} | null>(null);
  const [showIntlSeniorDestinations, setShowIntlSeniorDestinations] = useState<{countryId: number, countryName: string} | null>(null);
  const [showIntlStudentDestinations, setShowIntlStudentDestinations] = useState<{countryId: number, countryName: string} | null>(null);
  const [showIntlHoneymoonDestinations, setShowIntlHoneymoonDestinations] = useState<{countryId: number, countryName: string} | null>(null);
  const [showIntlSportsDestinations, setShowIntlSportsDestinations] = useState<{countryId: number, countryName: string} | null>(null);
  const [showIntlFestivalDestinations, setShowIntlFestivalDestinations] = useState<{countryId: number, countryName: string} | null>(null);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<Record<string, boolean>>({});
  
  // State to store tours data
  const [allTours, setAllTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State for international destinations grouped by country
  const [groupedInternationalDestinations, setGroupedInternationalDestinations] = useState<GroupedDestinations>({});
  const [internationalCountries, setInternationalCountries] = useState<string[]>([]);

  // Timers for delayed close
  const indianIndividualTimer = useRef<NodeJS.Timeout | null>(null);
  const indianGroupTimer = useRef<NodeJS.Timeout | null>(null);
  const indianLadiesTimer = useRef<NodeJS.Timeout | null>(null);
  const indianSeniorTimer = useRef<NodeJS.Timeout | null>(null);
  const indianStudentTimer = useRef<NodeJS.Timeout | null>(null);
  const indianHoneymoonTimer = useRef<NodeJS.Timeout | null>(null);
  const indianSportsTimer = useRef<NodeJS.Timeout | null>(null);
  const indianFestivalTimer = useRef<NodeJS.Timeout | null>(null);
  
  const intlIndividualTimer = useRef<NodeJS.Timeout | null>(null);
  const intlGroupTimer = useRef<NodeJS.Timeout | null>(null);
  const intlLadiesTimer = useRef<NodeJS.Timeout | null>(null);
  const intlSeniorTimer = useRef<NodeJS.Timeout | null>(null);
  const intlStudentTimer = useRef<NodeJS.Timeout | null>(null);
  const intlHoneymoonTimer = useRef<NodeJS.Timeout | null>(null);
  const intlSportsTimer = useRef<NodeJS.Timeout | null>(null);
  const intlFestivalTimer = useRef<NodeJS.Timeout | null>(null);
  
  const intlIndividualDestTimer = useRef<NodeJS.Timeout | null>(null);
  const intlGroupDestTimer = useRef<NodeJS.Timeout | null>(null);
  const intlLadiesDestTimer = useRef<NodeJS.Timeout | null>(null);
  const intlSeniorDestTimer = useRef<NodeJS.Timeout | null>(null);
  const intlStudentDestTimer = useRef<NodeJS.Timeout | null>(null);
  const intlHoneymoonDestTimer = useRef<NodeJS.Timeout | null>(null);
  const intlSportsDestTimer = useRef<NodeJS.Timeout | null>(null);
  const intlFestivalDestTimer = useRef<NodeJS.Timeout | null>(null);

  // Fetch tours data
  useEffect(() => {
    const fetchTours = async () => {
      try {
        console.log("Fetching tours from API...");
        const res = await fetch(`${API_URL}/api/tours`);
        const data = await res.json();
        console.log("Fetched tours:", data);
        console.log("Total tours count:", data.length);
        setAllTours(data);
      } catch (err) {
        console.error("Error fetching tours:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Fetch and group international destinations by country
  useEffect(() => {
    const fetchInternationalData = async () => {
      try {
        // Fetch countries
        const countriesRes = await fetch(`${API_URL}/api/countries/international`);
        if (!countriesRes.ok) throw new Error("Failed to fetch countries");
        const countriesData: Country[] = await countriesRes.json();
        
        // Fetch destinations
        const destinationsRes = await fetch(`${API_URL}/api/destinations/international`);
        if (!destinationsRes.ok) throw new Error("Failed to fetch destinations");
        const destinationsData: Destination[] = await destinationsRes.json();
        
        console.log("Countries data:", countriesData);
        console.log("Destinations data:", destinationsData);
        
        // Group destinations by country_id
        const grouped: GroupedDestinations = {};
        
        // First, add all countries from the countries API
        countriesData.forEach(country => {
          grouped[country.country_id] = {
            countryName: country.name,
            destinations: []
          };
        });
        
        // Then, add destinations to their respective countries
        destinationsData.forEach(destination => {
          if (grouped[destination.country_id]) {
            // Avoid duplicates
            const existingDestination = grouped[destination.country_id].destinations.find(
              d => d.name === destination.name
            );
            if (!existingDestination) {
              grouped[destination.country_id].destinations.push({
                name: destination.name,
                hasActiveTours: false // Will be updated later
              });
            }
          } else {
            // If country not in countries API, create a new entry
            grouped[destination.country_id] = {
              countryName: destination.country_name,
              destinations: [{
                name: destination.name,
                hasActiveTours: false // Will be updated later
              }]
            };
          }
        });
        
        // Now, check which destinations have active tours for any tour type
        Object.keys(grouped).forEach(key => {
          const countryId = parseInt(key);
          grouped[countryId].destinations.forEach(dest => {
            // Check if this destination has any active tours in any category
            const hasAnyActiveTour = [
              "Individual", "Group", "Ladies Special", 
              "Senior Citizen", "Student", "Honeymoon",
              "Sports", "Festival"
            ].some(category => 
              hasToursForDestination(dest.name, category, true)
            );
            dest.hasActiveTours = hasAnyActiveTour;
          });
        });
        
        // Filter out destinations that don't have active tours
        Object.keys(grouped).forEach(key => {
          const countryId = parseInt(key);
          grouped[countryId].destinations = grouped[countryId].destinations.filter(
            dest => dest.hasActiveTours
          );
        });
        
        Object.keys(grouped).forEach(key => {
          const countryId = parseInt(key);
          grouped[countryId].destinations.sort((a, b) => 
            a.name.localeCompare(b.name)
          );
        });
        
        console.log("Grouped destinations with active tours:", grouped);
        
        setGroupedInternationalDestinations(grouped);
        
        const countryNames = countriesData
          .map(country => country.name)
          .sort();
        setInternationalCountries(countryNames);
        
      } catch (err) {
        console.error("Error fetching international data:", err);
      }
    };

    fetchInternationalData();
  }, [allTours]); // Re-run when allTours changes

  // Function to check if a destination has tours - UPDATED with Sports and Festival
  const hasToursForDestination = (destinationName: string, tourType: string, isInternational: boolean = false) => {
    if (!allTours.length) return false;
    
    const tourTypeMap: Record<string, string[]> = {
      "Individual": ["individual", "Individual"],
      "Group": ["Group", "group"],
      "Ladies Special": ["ladiesspecial", "Ladies Special", "ladies special", "ladies"],
      "Senior Citizen": ["seniorcitizen", "Senior Citizen", "senior citizen", "senior"],
      "Student": ["student", "Student"],
      "Honeymoon": ["honeymoon", "Honeymoon"],
      "Sports": ["sports", "Sports", "sport"],
      "Festival": ["festival", "Festival", "festivals"]
    };
    
    const validTourTypes = tourTypeMap[tourType] || [tourType];
    
    return allTours.some(tour => {
      const tourDestination = tour.primary_destination_name?.trim();
      const targetDestination = destinationName.trim();
      
      // More flexible matching for destinations
      const destinationMatch = tourDestination?.toLowerCase() === targetDestination.toLowerCase();
      
      if (!destinationMatch) return false;
      
      // More flexible tour type matching
      const tourTypeMatch = validTourTypes.some(
        validType => tour.tour_type?.toLowerCase().includes(validType.toLowerCase())
      );
      
      if (!tourTypeMatch) return false;
      
      // Check international flag
      const internationalMatch = isInternational ? tour.is_international === 1 : tour.is_international === 0;
      
      if (!internationalMatch) return false;
      
      // Check if tour is active and published
      return tour.status === 1 && tour.is_active === 1;
    });
  };

  // Function to check if a country has active tours for a specific tour type - UPDATED
  const countryHasActiveToursForType = (
    countryId: number,
    isIndividualTour: boolean,
    isGroupTour: boolean,
    isLadiesTour: boolean,
    isSeniorTour: boolean,
    isStudentTour: boolean,
    isHoneymoonTour: boolean,
    isSportsTour: boolean,
    isFestivalTour: boolean
  ) => {
    const country = groupedInternationalDestinations[countryId];
    if (!country) return false;

    let category = "";
    if (isIndividualTour) category = "Individual";
    else if (isGroupTour) category = "Group";
    else if (isLadiesTour) category = "Ladies Special";
    else if (isSeniorTour) category = "Senior Citizen";
    else if (isStudentTour) category = "Student";
    else if (isHoneymoonTour) category = "Honeymoon";
    else if (isSportsTour) category = "Sports";
    else if (isFestivalTour) category = "Festival";

    return country.destinations.some(dest => 
      hasToursForDestination(dest.name, category, true)
    );
  };

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
  const toggleMobileSubmenu = (label: string) => {
    setMobileSubmenuOpen(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const createHoverHandlers = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    timerRef: React.MutableRefObject<NodeJS.Timeout | null>
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

  // UPDATED: Use consistent URL patterns with Sports and Festival
  const getDestinationHref = (
    isIndian: boolean,
    isIndividualTour: boolean,
    isGroupTour: boolean,
    isLadiesTour: boolean,
    isSeniorTour: boolean,
    isStudentTour: boolean,
    isHoneymoonTour: boolean,
    isSportsTour: boolean,
    isFestivalTour: boolean,
    destination: string
  ) => {
    if (isIndian) {
      if (isIndividualTour) {
        return `/tours-packages/${encodeURIComponent(destination)}`;
      } else if (isGroupTour) {
        return `/tours_groups/${encodeURIComponent(destination)}`;
      } else if (isLadiesTour) {
        return `/ladies_tours/${encodeURIComponent(destination)}`;
      } else if (isSeniorTour) {
        return `/senior_tours/${encodeURIComponent(destination)}`;
      } else if (isStudentTour) {
        return `/students_tours/${encodeURIComponent(destination)}`;
      } else if (isHoneymoonTour) {
        return `/honeymoon_tours/${encodeURIComponent(destination)}`;
      } else if (isSportsTour) {
        return `/sports/${encodeURIComponent(destination)}`;
      } else if (isFestivalTour) {
        return `/festival/${encodeURIComponent(destination)}`;
      }
    } else {
      if (isIndividualTour) {
        return `/intl-tours-packages/${encodeURIComponent(destination)}`;
      } else if (isGroupTour) {
        return `/intl-tours_groups/${encodeURIComponent(destination)}`;
      } else if (isLadiesTour) {
        return `/intl-ladies_tours/${encodeURIComponent(destination)}`;
      } else if (isSeniorTour) {
        return `/intl-senior_tours/${encodeURIComponent(destination)}`;
      } else if (isStudentTour) {
        return `/intl-students_tours/${encodeURIComponent(destination)}`;
      } else if (isHoneymoonTour) {
        return `/intl-honeymoon_tours/${encodeURIComponent(destination)}`;
      } else if (isSportsTour) {
        return `/intl-sports/${encodeURIComponent(destination)}`;
      } else if (isFestivalTour) {
        return `/intl-festival/${encodeURIComponent(destination)}`;
      }
    }
    return "#";
  };

  // Function to get country ID by name
  const getCountryIdByName = (countryName: string): number | null => {
    const entry = Object.entries(groupedInternationalDestinations).find(
      ([id, data]) => data.countryName === countryName
    );
    return entry ? parseInt(entry[0]) : null;
  };

  // UPDATED: Function to render countries list with Sports and Festival
  const renderCountriesList = (
    isIndividualTour: boolean,
    isGroupTour: boolean,
    isLadiesTour: boolean,
    isSeniorTour: boolean,
    isStudentTour: boolean,
    isHoneymoonTour: boolean,
    isSportsTour: boolean,
    isFestivalTour: boolean
  ) => {
    if (internationalCountries.length === 0) {
      return (
        <div className="text-center py-8 text-gray-600">
          No countries available
        </div>
      );
    }

    return (
      <div className="max-h-[70vh] overflow-y-auto p-1">
        <table className="min-w-full border border-black">
          <tbody>
            {internationalCountries.reduce((rows: any[], country, index) => {
              if (index % 3 === 0) rows.push([]);
              rows[rows.length - 1].push(country);
              return rows;
            }, []).map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-blue-50" : "bg-blue-100"}>
                {row.map((country: string, colIndex: number) => {
                  const countryId = getCountryIdByName(country);
                  
                  let hasActiveTours = false;
                  if (countryId) {
                    hasActiveTours = countryHasActiveToursForType(
                      countryId,
                      isIndividualTour,
                      isGroupTour,
                      isLadiesTour,
                      isSeniorTour,
                      isStudentTour,
                      isHoneymoonTour,
                      isSportsTour,
                      isFestivalTour
                    );
                  }
                  
                  return (
                    <td 
                      key={colIndex} 
                      className="border border-black p-1"
                    >
                      <div
                        className={`block w-full p-2 text-sm text-center transition-all duration-200 min-h-[40px] flex items-center justify-center ${
                          hasActiveTours 
                            ? "bg-[#2E3a8a] text-white font-bold hover:bg-[#1e2a6a] cursor-pointer"
                            : "text-gray-700 hover:bg-gray-100 cursor-pointer"
                        }`}
                        title={country}
                        onClick={() => {
                          if (hasActiveTours && countryId) {
                            if (isIndividualTour) {
                              setShowIntlIndividualDestinations({countryId, countryName: country});
                            } else if (isGroupTour) {
                              setShowIntlGroupDestinations({countryId, countryName: country});
                            } else if (isLadiesTour) {
                              setShowIntlLadiesDestinations({countryId, countryName: country});
                            } else if (isSeniorTour) {
                              setShowIntlSeniorDestinations({countryId, countryName: country});
                            } else if (isStudentTour) {
                              setShowIntlStudentDestinations({countryId, countryName: country});
                            } else if (isHoneymoonTour) {
                              setShowIntlHoneymoonDestinations({countryId, countryName: country});
                            } else if (isSportsTour) {
                              setShowIntlSportsDestinations({countryId, countryName: country});
                            } else if (isFestivalTour) {
                              setShowIntlFestivalDestinations({countryId, countryName: country});
                            }
                          }
                        }}
                      >
                        {country}
                      </div>
                    </td>
                  );
                })}
                {row.length < 3 && [...Array(3 - row.length)].map((_, colIndex) => (
                  <td 
                    key={colIndex} 
                    className="border border-black p-1 bg-gray-50"
                  >
                    <div className="block w-full p-2 h-full min-h-[40px]"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // UPDATED: Function to render destinations for a specific country with Sports and Festival
  const renderDestinationsForCountry = (
    countryId: number,
    countryName: string,
    isIndividualTour: boolean,
    isGroupTour: boolean,
    isLadiesTour: boolean,
    isSeniorTour: boolean,
    isStudentTour: boolean,
    isHoneymoonTour: boolean,
    isSportsTour: boolean,
    isFestivalTour: boolean
  ) => {
    const country = groupedInternationalDestinations[countryId];
    
    if (!country || !country.destinations || country.destinations.length === 0) {
      return (
        <div className="max-h-[70vh] overflow-y-auto p-4">
          <div className="flex items-center gap-2 mb-4">
            <button 
              onClick={() => {
                if (isIndividualTour) setShowIntlIndividualDestinations(null);
                else if (isGroupTour) setShowIntlGroupDestinations(null);
                else if (isLadiesTour) setShowIntlLadiesDestinations(null);
                else if (isSeniorTour) setShowIntlSeniorDestinations(null);
                else if (isStudentTour) setShowIntlStudentDestinations(null);
                else if (isHoneymoonTour) setShowIntlHoneymoonDestinations(null);
                else if (isSportsTour) setShowIntlSportsDestinations(null);
                else if (isFestivalTour) setShowIntlFestivalDestinations(null);
              }}
              className="text-blue-900 hover:text-blue-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-blue-900 text-lg">{countryName}</h3>
          </div>
          <div className="text-center py-8 text-gray-600">
            No destinations available for {countryName}
          </div>
        </div>
      );
    }

    // Filter destinations that have active tours for the current category
    const activeDestinations = country.destinations.filter(dest => {
      const category = isIndividualTour ? "Individual" :
                     isGroupTour ? "Group" :
                     isLadiesTour ? "Ladies Special" :
                     isSeniorTour ? "Senior Citizen" :
                     isStudentTour ? "Student" : 
                     isHoneymoonTour ? "Honeymoon" :
                     isSportsTour ? "Sports" : "Festival";
      
      return hasToursForDestination(dest.name, category, true);
    });

    if (activeDestinations.length === 0) {
      return (
        <div className="max-h-[70vh] overflow-y-auto p-4">
          <div className="flex items-center gap-2 mb-4">
            <button 
              onClick={() => {
                if (isIndividualTour) setShowIntlIndividualDestinations(null);
                else if (isGroupTour) setShowIntlGroupDestinations(null);
                else if (isLadiesTour) setShowIntlLadiesDestinations(null);
                else if (isSeniorTour) setShowIntlSeniorDestinations(null);
                else if (isStudentTour) setShowIntlStudentDestinations(null);
                else if (isHoneymoonTour) setShowIntlHoneymoonDestinations(null);
                else if (isSportsTour) setShowIntlSportsDestinations(null);
                else if (isFestivalTour) setShowIntlFestivalDestinations(null);
              }}
              className="text-blue-900 hover:text-blue-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-blue-900 text-lg">{countryName}</h3>
          </div>
          <div className="text-center py-8 text-gray-600">
            No active tours available for {countryName}
          </div>
        </div>
      );
    }

    return (
      <div className="max-h-[70vh] overflow-y-auto p-1">
        <div className="flex items-center gap-2 mb-2 px-2">
          <button 
            onClick={() => {
              if (isIndividualTour) setShowIntlIndividualDestinations(null);
              else if (isGroupTour) setShowIntlGroupDestinations(null);
              else if (isLadiesTour) setShowIntlLadiesDestinations(null);
              else if (isSeniorTour) setShowIntlSeniorDestinations(null);
              else if (isStudentTour) setShowIntlStudentDestinations(null);
              else if (isHoneymoonTour) setShowIntlHoneymoonDestinations(null);
              else if (isSportsTour) setShowIntlSportsDestinations(null);
              else if (isFestivalTour) setShowIntlFestivalDestinations(null);
            }}
            className="text-blue-900 hover:text-blue-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="font-bold text-blue-900 text-sm">{countryName}</h3>
        </div>
        <table className="min-w-full border border-black">
          <tbody>
            {activeDestinations.reduce((rows: any[], dest, index) => {
              if (index % 3 === 0) rows.push([]);
              rows[rows.length - 1].push(dest);
              return rows;
            }, []).map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-blue-50" : "bg-blue-100"}>
                {row.map((dest, colIndex: number) => {
                  const href = getDestinationHref(
                    false,
                    isIndividualTour,
                    isGroupTour,
                    isLadiesTour,
                    isSeniorTour,
                    isStudentTour,
                    isHoneymoonTour,
                    isSportsTour,
                    isFestivalTour,
                    dest.name
                  );
                  
                  return (
                    <td 
                      key={colIndex} 
                      className="border border-black p-1"
                    >
                      <a
                        href={href}
                        className="block w-full p-2 text-sm text-center bg-[#2E3a8a] text-white font-bold hover:bg-[#1e2a6a] transition-all duration-200 min-h-[40px] flex items-center justify-center"
                        title={dest.name}
                      >
                        {dest.name}
                      </a>
                    </td>
                  );
                })}
                {row.length < 3 && [...Array(3 - row.length)].map((_, colIndex) => (
                  <td 
                    key={colIndex} 
                    className="border border-black p-1 bg-gray-50"
                  >
                    <div className="block w-full p-2 h-full min-h-[40px]"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const navItems: NavItem[] = [
    { icon: HomeIcon, label: "Home", href: "/" },
    {
      icon: MapPin, label: "Indian Tours",
      dropdown: [
        { label: "Individual Tours", href: "#indian-individual", icon: Users, subDropdown: indianStates },
        { label: "Group Tours", href: "#indian-group", icon: UsersRound, subDropdown: indianStates },
        { label: "Ladies Special Tours", href: "#ladies-special", icon: UsersRound, subDropdown: indianStates },
        { label: "Senior Citizen Tours", href: "#senior-citizens", icon: UsersRound, subDropdown: indianStates },
        { label: "Students Tours", href: "#students-tours", icon: GraduationCap, subDropdown: indianStates },
        { label: "Honeymoon Tours", href: "#honeymoon-tours", icon: Heart, subDropdown: indianStates },
        { label: "Sports Tours", href: "#sports-tours", icon: Shield, subDropdown: indianStates },
        { label: "Festival Tours", href: "#festival-tours", icon: Sparkles, subDropdown: indianStates },
      ],
    },
    {
      icon: Globe, label: "International Tours",
      dropdown: [
        { 
          label: "Individual Tours", 
          href: "#international-individual", 
          icon: Users, 
          subDropdown: internationalCountries,
          isCountryList: true 
        },
        { 
          label: "Group Tours", 
          href: "#international-group", 
          icon: UsersRound, 
          subDropdown: internationalCountries,
          isCountryList: true 
        },
        { 
          label: "Ladies Special Tours", 
          href: "#international-ladies-special", 
          icon: Sparkles, 
          subDropdown: internationalCountries,
          isCountryList: true 
        },
        { 
          label: "Senior Citizen Tours", 
          href: "#international-senior-citizens", 
          icon: UsersRound, 
          subDropdown: internationalCountries,
          isCountryList: true 
        },
        { 
          label: "Students Tours", 
          href: "#international-students-tours", 
          icon: GraduationCap, 
          subDropdown: internationalCountries,
          isCountryList: true 
        },
        { 
          label: "Honeymoon Tours", 
          href: "#international-honeymoon-tours", 
          icon: Heart, 
          subDropdown: internationalCountries,
          isCountryList: true 
        },
        { 
          label: "Sports Tours", 
          href: "#international-sports-tours", 
          icon: Shield, 
          subDropdown: internationalCountries,
          isCountryList: true 
        },
        { 
          label: "Festival Tours", 
          href: "#international-festival-tours", 
          icon: Sparkles, 
          subDropdown: internationalCountries,
          isCountryList: true 
        },
      ],
    },
    { 
      icon: PlaneTakeoff, 
      label: "Flight / Hotel", 
      href: "#offline-flight-tickets",
      dropdown: [
         { label: "Online Flight Blocks", href: "/flightfrontend" },
        { label: "Offline Filght Blocks", href: "/offlineflightblocks" },
        { label: "Offline Hotel Blocks", href: "/offlinehotelbooking" },
      ]
    },
    { icon: Ship, label: "Exhibitions", href: "/exhibition" },
    { icon: Compass, label: "MICE", href: "/micpage" },
    {
      icon: Star, label: "Others",
      dropdown: [
        { label: "Bungalow / Villa", href: "/bungalow", icon: HomeIcon },
        { label: "One Day Picnic", href: "/ondaycard", icon: Map },
        { label: "Insurances", href: "/insuranceform", icon: Umbrella },
        { label: "Passport", href: "/passport", icon: Landmark },
        { label: "Weekend Gateways", href: "/Weekendcard", icon: CalendarDays },
      ],
    },
    { icon: UsersRound, label: "About Us", href: "/about" },
    { icon: Phone, label: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-xl border-b-2 border-blue-400 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* LOGO */}
          <div className="flex items-center">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-3 bg-white/10 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img
                src={logo}
                alt="SK Tours Logo"
                className="h-12 sm:h-14 w-auto object-contain relative z-10 transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
              />
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navItems.map((item, index) => (
              <div key={index} className="relative group">
                {!item.dropdown ? (
                  <a
                    href={item.href}
                    className="flex flex-col items-center px-3 sm:px-4 py-3 transition-all duration-300 hover:bg-white/15 rounded-lg min-w-[80px] sm:min-w-[90px]"
                  >
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </a>
                ) : (
                  <div className="relative">
                    <div className="flex flex-col items-center px-3 sm:px-4 py-3 transition-all duration-300 hover:bg-white/15 rounded-lg min-w-[100px] sm:min-w-[110px] cursor-pointer">
                      <item.icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">{item.label}</span>
                        <ChevronDown className="w-3 h-3" />
                      </div>
                    </div>
                    
                    {/* MEGA DROPDOWN */}
                    <div className={`absolute left-1/2 -translate-x-1/2 top-full opacity-0 -translate-y-4 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible bg-red-50 text-gray-800 rounded-xl shadow-2xl min-w-[200px] py-4 border border-gray-200 transition-all duration-300 ease-in-out z-50`}>
                      {item.dropdown.map((sub, idx) => {
                        const isIndian = item.label === "Indian Tours";
                        const isIntl = item.label === "International Tours";
                        const isIndividual = sub.label === "Individual Tours";
                        const isGroup = sub.label === "Group Tours";
                        const isLadies = sub.label === "Ladies Special Tours";
                        const isSenior = sub.label === "Senior Citizen Tours";
                        const isStudent = sub.label === "Students Tours";
                        const isHoneymoon = sub.label === "Honeymoon Tours";
                        const isSports = sub.label === "Sports Tours";
                        const isFestival = sub.label === "Festival Tours";
                        
                        let showThisStates = false;
                        let enterHandler: (() => void) | null = null;
                        let leaveHandler: (() => void) | null = null;
                        let enterStatesHandler: (() => void) | null = null;
                        let leaveStatesHandler: (() => void) | null = null;
                        let topOffset = "top-0";

                        if (isIndian && isIndividual) {
                          showThisStates = showIndianIndividualStates;
                          const h = createHoverHandlers(setShowIndianIndividualStates, indianIndividualTimer);
                          enterHandler = h.enter;
                          leaveHandler = h.leave;
                          enterStatesHandler = h.enter;
                          leaveStatesHandler = h.leave;
                          topOffset = "top-[-1rem]";
                        } else if (isIndian && isGroup) {
                          showThisStates = showIndianGroupStates;
                          const h = createHoverHandlers(setShowIndianGroupStates, indianGroupTimer);
                          enterHandler = h.enter;
                          leaveHandler = h.leave;
                          enterStatesHandler = h.enter;
                          leaveStatesHandler = h.leave;
                          topOffset = "top-[-4rem]";
                        } else if (isIndian && isLadies) {
                          showThisStates = showIndianLadiesStates;
                          const h = createHoverHandlers(setShowIndianLadiesStates, indianLadiesTimer);
                          enterHandler = h.enter;
                          leaveHandler = h.leave;
                          enterStatesHandler = h.enter;
                          leaveStatesHandler = h.leave;
                          topOffset = "top-[-7rem]";
                        } else if (isIndian && isSenior) {
                          showThisStates = showIndianSeniorStates;
                          const h = createHoverHandlers(setShowIndianSeniorStates, indianSeniorTimer);
                          enterHandler = h.enter;
                          leaveHandler = h.leave;
                          enterStatesHandler = h.enter;
                          leaveStatesHandler = h.leave;
                          topOffset = "top-[-10rem]";
                        } else if (isIndian && isStudent) {
                          showThisStates = showIndianStudentStates;
                          const h = createHoverHandlers(setShowIndianStudentStates, indianStudentTimer);
                          enterHandler = h.enter;
                          leaveHandler = h.leave;
                          enterStatesHandler = h.enter;
                          leaveStatesHandler = h.leave;
                          topOffset = "top-[-13rem]";
                        } else if (isIndian && isHoneymoon) {
                          showThisStates = showIndianHoneymoonStates;
                          const h = createHoverHandlers(setShowIndianHoneymoonStates, indianHoneymoonTimer);
                          enterHandler = h.enter;
                          leaveHandler = h.leave;
                          enterStatesHandler = h.enter;
                          leaveStatesHandler = h.leave;
                          topOffset = "top-[-16rem]";
                        } else if (isIndian && isSports) {
                          showThisStates = showIndianSportsStates;
                          const h = createHoverHandlers(setShowIndianSportsStates, indianSportsTimer);
                          enterHandler = h.enter;
                          leaveHandler = h.leave;
                          enterStatesHandler = h.enter;
                          leaveStatesHandler = h.leave;
                          topOffset = "top-[-19rem]";
                        } else if (isIndian && isFestival) {
                          showThisStates = showIndianFestivalStates;
                          const h = createHoverHandlers(setShowIndianFestivalStates, indianFestivalTimer);
                          enterHandler = h.enter;
                          leaveHandler = h.leave;
                          enterStatesHandler = h.enter;
                          leaveStatesHandler = h.leave;
                          topOffset = "top-[-22rem]";
                        } else if (isIntl && isIndividual) {
                          showThisStates = showIntlIndividualCountries;
                          const h = createHoverHandlers(setShowIntlIndividualCountries, intlIndividualTimer);
                          enterHandler = h.enter;
                          leaveHandler = h.leave;
                          enterStatesHandler = h.enter;
                          leaveStatesHandler = h.leave;
                          topOffset = "top-[-1rem]";
                        } else if (isIntl && isGroup) {
                          showThisStates = showIntlGroupCountries;
                          const h = createHoverHandlers(setShowIntlGroupCountries, intlGroupTimer);
                          enterHandler = h.enter;
                          leaveHandler = h.leave;
                          enterStatesHandler = h.enter;
                          leaveStatesHandler = h.leave;
                          topOffset = "top-[-4rem]";
                        } else if (isIntl && isLadies) {
                          showThisStates = showIntlLadiesCountries;
                          const h = createHoverHandlers(setShowIntlLadiesCountries, intlLadiesTimer);
                          enterHandler = h.enter;
                          leaveHandler = h.leave;
                          enterStatesHandler = h.enter;
                          leaveStatesHandler = h.leave;
                          topOffset = "top-[-7rem]";
                        } else if (isIntl && isSenior) {
                          showThisStates = showIntlSeniorCountries;
                          const h = createHoverHandlers(setShowIntlSeniorCountries, intlSeniorTimer);
                          enterHandler = h.enter;
                          leaveHandler = h.leave;
                          enterStatesHandler = h.enter;
                          leaveStatesHandler = h.leave;
                          topOffset = "top-[-10rem]";
                        } else if (isIntl && isStudent) {
                          showThisStates = showIntlStudentCountries;
                          const h = createHoverHandlers(setShowIntlStudentCountries, intlStudentTimer);
                          enterHandler = h.enter;
                          leaveHandler = h.leave;
                          enterStatesHandler = h.enter;
                          leaveStatesHandler = h.leave;
                          topOffset = "top-[-13rem]";
                        } else if (isIntl && isHoneymoon) {
                          showThisStates = showIntlHoneymoonCountries;
                          const h = createHoverHandlers(setShowIntlHoneymoonCountries, intlHoneymoonTimer);
                          enterHandler = h.enter;
                          leaveHandler = h.leave;
                          enterStatesHandler = h.enter;
                          leaveStatesHandler = h.leave;
                          topOffset = "top-[-16rem]";
                        } else if (isIntl && isSports) {
                          showThisStates = showIntlSportsCountries;
                          const h = createHoverHandlers(setShowIntlSportsCountries, intlSportsTimer);
                          enterHandler = h.enter;
                          leaveHandler = h.leave;
                          enterStatesHandler = h.enter;
                          leaveStatesHandler = h.leave;
                          topOffset = "top-[-19rem]";
                        } else if (isIntl && isFestival) {
                          showThisStates = showIntlFestivalCountries;
                          const h = createHoverHandlers(setShowIntlFestivalCountries, intlFestivalTimer);
                          enterHandler = h.enter;
                          leaveHandler = h.leave;
                          enterStatesHandler = h.enter;
                          leaveStatesHandler = h.leave;
                          topOffset = "top-[-22rem]";
                        }

                        return (
                          <div key={idx} className="relative">
                            <div
                              className={`flex items-center px-2 sm:px-3 py-3.5 text-sm hover:bg-red-100 border-l-2 border-transparent hover:border-red-500 mx-1 sm:mx-2 rounded-lg block cursor-pointer transition-colors ${sub.subDropdown ? "pr-2" : ""}`}
                              onMouseEnter={enterHandler ?? undefined}
                              onMouseLeave={leaveHandler ?? undefined}
                            >
                              <a href={sub.href} className="flex items-center w-full">
                                {sub.icon && <sub.icon className="w-4 h-4 mr-2" />}
                                <span className="font-medium flex-grow">{sub.label}</span>
                                {sub.subDropdown && <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />}
                              </a>
                            </div>
                            
                            {/* STATES / COUNTRIES SUB-DROPDOWN */}
                            {sub.subDropdown && showThisStates && (
                              <div
                                className={`absolute left-full ${topOffset} ml-3 bg-white text-gray-800 rounded-lg shadow-2xl w-[450px] min-w-[450px] py-0 border border-gray-300 opacity-100 visible transition-all duration-300 ease-in-out z-[60] max-h-[70vh] overflow-hidden`}
                                onMouseEnter={enterStatesHandler ?? undefined}
                                onMouseLeave={leaveStatesHandler ?? undefined}
                              >
                                {isIntl && sub.isCountryList ? (
                                  (() => {
                                    if (isIndividual && showIntlIndividualDestinations) {
                                      return renderDestinationsForCountry(
                                        showIntlIndividualDestinations.countryId,
                                        showIntlIndividualDestinations.countryName,
                                        isIndividual,
                                        isGroup,
                                        isLadies,
                                        isSenior,
                                        isStudent,
                                        isHoneymoon,
                                        isSports,
                                        isFestival
                                      );
                                    } else if (isGroup && showIntlGroupDestinations) {
                                      return renderDestinationsForCountry(
                                        showIntlGroupDestinations.countryId,
                                        showIntlGroupDestinations.countryName,
                                        isIndividual,
                                        isGroup,
                                        isLadies,
                                        isSenior,
                                        isStudent,
                                        isHoneymoon,
                                        isSports,
                                        isFestival
                                      );
                                    } else if (isLadies && showIntlLadiesDestinations) {
                                      return renderDestinationsForCountry(
                                        showIntlLadiesDestinations.countryId,
                                        showIntlLadiesDestinations.countryName,
                                        isIndividual,
                                        isGroup,
                                        isLadies,
                                        isSenior,
                                        isStudent,
                                        isHoneymoon,
                                        isSports,
                                        isFestival
                                      );
                                    } else if (isSenior && showIntlSeniorDestinations) {
                                      return renderDestinationsForCountry(
                                        showIntlSeniorDestinations.countryId,
                                        showIntlSeniorDestinations.countryName,
                                        isIndividual,
                                        isGroup,
                                        isLadies,
                                        isSenior,
                                        isStudent,
                                        isHoneymoon,
                                        isSports,
                                        isFestival
                                      );
                                    } else if (isStudent && showIntlStudentDestinations) {
                                      return renderDestinationsForCountry(
                                        showIntlStudentDestinations.countryId,
                                        showIntlStudentDestinations.countryName,
                                        isIndividual,
                                        isGroup,
                                        isLadies,
                                        isSenior,
                                        isStudent,
                                        isHoneymoon,
                                        isSports,
                                        isFestival
                                      );
                                    } else if (isHoneymoon && showIntlHoneymoonDestinations) {
                                      return renderDestinationsForCountry(
                                        showIntlHoneymoonDestinations.countryId,
                                        showIntlHoneymoonDestinations.countryName,
                                        isIndividual,
                                        isGroup,
                                        isLadies,
                                        isSenior,
                                        isStudent,
                                        isHoneymoon,
                                        isSports,
                                        isFestival
                                      );
                                    } else if (isSports && showIntlSportsDestinations) {
                                      return renderDestinationsForCountry(
                                        showIntlSportsDestinations.countryId,
                                        showIntlSportsDestinations.countryName,
                                        isIndividual,
                                        isGroup,
                                        isLadies,
                                        isSenior,
                                        isStudent,
                                        isHoneymoon,
                                        isSports,
                                        isFestival
                                      );
                                    } else if (isFestival && showIntlFestivalDestinations) {
                                      return renderDestinationsForCountry(
                                        showIntlFestivalDestinations.countryId,
                                        showIntlFestivalDestinations.countryName,
                                        isIndividual,
                                        isGroup,
                                        isLadies,
                                        isSenior,
                                        isStudent,
                                        isHoneymoon,
                                        isSports,
                                        isFestival
                                      );
                                    } else {
                                      // Show countries list
                                      return renderCountriesList(
                                        isIndividual,
                                        isGroup,
                                        isLadies,
                                        isSenior,
                                        isStudent,
                                        isHoneymoon,
                                        isSports,
                                        isFestival
                                      );
                                    }
                                  })()
                                ) : (
                                  // INDIAN TOURS TABLE
                                  <div className="max-h-[70vh] overflow-y-auto p-1">
                                    <table className="min-w-full border border-black">
                                      <tbody>
                                        {sub.subDropdown.reduce((rows: any[], dest, index) => {
                                          if (index % 3 === 0) rows.push([]);
                                          rows[rows.length - 1].push(dest);
                                          return rows;
                                        }, []).map((row, rowIndex) => (
                                          <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-blue-50" : "bg-blue-100"}>
                                            {row.map((dest: string, colIndex: number) => {
                                              const isAndaman = dest === "Andaman";
                                              const href = getDestinationHref(
                                                isIndian,
                                                isIndividual,
                                                isGroup,
                                                isLadies,
                                                isSenior,
                                                isStudent,
                                                isHoneymoon,
                                                isSports,
                                                isFestival,
                                                dest
                                              );
                                              
                                              const hasTours = hasToursForDestination(
                                                dest,
                                                isIndividual ? "Individual" : 
                                                isGroup ? "Group" :
                                                isLadies ? "Ladies Special" :
                                                isSenior ? "Senior Citizen" :
                                                isStudent ? "Student" : 
                                                isHoneymoon ? "Honeymoon" :
                                                isSports ? "Sports" : "Festival",
                                                false
                                              );
                                              
                                              return (
                                                <td 
                                                  key={colIndex} 
                                                  className="border border-black p-1"
                                                >
                                                  <a
                                                    href={href}
                                                 className={`block w-full p-2 text-sm text-center transition-all duration-200 min-h-[38px] flex items-center justify-center ${
        hasTours 
          ? "bg-[#2E3a8a] text-white font-bold hover:bg-[#1e2a6a] shadow-md" 
          : "text-gray-700 hover:bg-gray-100"                                  
      }`}
                                                    title={dest}
                                                  >
                                                    {isAndaman ? "Andaman (P. Blair)" : dest}
                                                  </a>
                                                </td>
                                              );
                                            })}
                                            
                                            {/* Fill empty cells */}
                                            {row.length < 3 && [...Array(3 - row.length)].map((_, colIndex) => (
                                              <td 
                                                key={colIndex} 
                                                className="border border-black p-1 bg-gray-50"
                                              >
                                                <div className="block w-full p-2 h-full min-h-[40px]"></div>
                                              </td>
                                            ))}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Login/Signup - Vertical Layout */}
          <div className="hidden lg:flex flex-col items-end gap-2 ml-auto">
            {/* Sign Up */}
            <div className="relative group">
              <Button 
                variant="ghost" 
                size="sm" 
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg border border-green-600 flex items-center gap-2 w-[120px] justify-center"
              >
                <UserPlus className="w-4 h-4" />
                <span className="font-medium text-sm">Sign Up</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
              <div className="absolute right-full top-0 mr-2 opacity-0 -translate-x-4 invisible group-hover:opacity-100 group-hover:translate-x-0 group-hover:visible bg-green-50 text-gray-800 rounded-xl shadow-2xl py-2 border border-green-200 transition-all duration-300 z-50 min-w-[140px]">
                <a href="#new-user" className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-green-100 hover:text-green-700 rounded-lg transition-colors">
                  <UserPlus className="w-4 h-4 text-green-600" /> New User
                </a>
                <a href="#new-agent" className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-green-100 hover:text-green-700 rounded-lg transition-colors">
                  <Users className="w-4 h-4 text-green-600" /> New Agent
                </a>
              </div>
            </div>

            {/* Login */}
            <div className="relative group">
              <Button 
                variant="ghost" 
                size="sm" 
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg border border-red-600 flex items-center gap-2 w-[120px] justify-center"
              >
                <UserCircle className="w-4 h-4" />
                <span className="font-medium text-sm">Login</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
              <div className="absolute right-full top-0 mr-2 opacity-0 -translate-x-4 invisible group-hover:opacity-100 group-hover:translate-x-0 group-hover:visible bg-red-50 text-gray-800 rounded-xl shadow-2xl py-2 border border-red-200 transition-all duration-300 z-50 min-w-[140px]">
                <a href="#user-login" className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors">
                  <UserCircle className="w-4 h-4 text-red-600" /> User Login
                </a>
                <a href="#agent-login" className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors">
                  <Users className="w-4 h-4 text-red-600" /> Agent Login
                </a>
              </div>
            </div>
          </div>
        </div>
{/* MOBILE MENU */}
{mobileMenuOpen && (
  <nav className="lg:hidden bg-primary text-primary-foreground border-t border-blue-400">
    <ul className="flex flex-col">
      {navItems.map((item, index) => (
        <li key={index} className="border-b border-blue-500">
          {!item.dropdown ? (
            <a href={item.href} className="flex gap-2 items-center px-4 py-3 hover:bg-white/10 transition-colors">
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </a>
          ) : (
            <>
              <button
                onClick={() => toggleMobileSubmenu(item.label)}
                className="w-full flex justify-between items-center px-4 py-3 hover:bg-white/10 transition-colors font-medium text-sm"
              >
                <div className="flex items-center gap-2">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileSubmenuOpen[item.label] ? "rotate-180" : ""}`} />
              </button>
              {mobileSubmenuOpen[item.label] && (
                <ul className="bg-primary border-t border-blue-500">
                  {item.dropdown.map((sub, i) => {
                    return (
                      <li key={i} className="border-b border-blue-600">
                        {!sub.subDropdown ? (
                          <a href={sub.href} className="flex items-center gap-2 px-8 py-2 hover:bg-white/10 transition-colors font-normal text-sm">
                            {sub.icon && <sub.icon className="w-4 h-4" />}
                            <span>{sub.label}</span>
                          </a>
                        ) : (
                          <>
                            <button
                              onClick={() => toggleMobileSubmenu(sub.label)}
                              className="w-full flex justify-between items-center px-8 py-2 hover:bg-white/10 transition-colors font-normal text-sm"
                            >
                              <div className="flex items-center gap-2">
                                {sub.icon && <sub.icon className="w-4 h-4" />}
                                <span>{sub.label}</span>
                              </div>
                              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${mobileSubmenuOpen[sub.label] ? "rotate-180" : ""}`} />
                            </button>
                            {mobileSubmenuOpen[sub.label] && (
                              <ul className="bg-primary border-t border-blue-600">
                                {item.label === "International Tours" ? (
                                  internationalCountries
                                    .filter(countryName => {
                                      const countryId = getCountryIdByName(countryName);
                                      if (!countryId) return false;
                                      
                                      const isIndividual = sub.label === "Individual Tours";
                                      const isGroup = sub.label === "Group Tours";
                                      const isLadies = sub.label === "Ladies Special Tours";
                                      const isSenior = sub.label === "Senior Citizen Tours";
                                      const isStudent = sub.label === "Students Tours";
                                      const isHoneymoon = sub.label === "Honeymoon Tours";
                                      const isSports = sub.label === "Sports Tours";
                                      const isFestival = sub.label === "Festival Tours";
                                      
                                      return countryHasActiveToursForType(
                                        countryId,
                                        isIndividual,
                                        isGroup,
                                        isLadies,
                                        isSenior,
                                        isStudent,
                                        isHoneymoon,
                                        isSports,
                                        isFestival
                                      );
                                    })
                                    .map((countryName, j) => {
                                      const countryId = getCountryIdByName(countryName);
                                      if (!countryId) return null;
                                      
                                      return (
                                        <li key={j} className="px-12 py-2">
                                          <div className="font-bold text-white mb-1">{countryName}</div>
                                          <ul className="pl-4">
                                            {groupedInternationalDestinations[countryId]?.destinations
                                              .filter(dest => {
                                                const isIndividualTour = sub.label === "Individual Tours";
                                                const isGroupTour = sub.label === "Group Tours";
                                                const isLadiesTour = sub.label === "Ladies Special Tours";
                                                const isSeniorTour = sub.label === "Senior Citizen Tours";
                                                const isStudentTour = sub.label === "Students Tours";
                                                const isHoneymoonTour = sub.label === "Honeymoon Tours";
                                                const isSportsTour = sub.label === "Sports Tours";
                                                const isFestivalTour = sub.label === "Festival Tours";
                                                
                                                const hasToursForThisCategory = hasToursForDestination(
                                                  dest.name,
                                                  isIndividualTour ? "Individual" : 
                                                  isGroupTour ? "Group" :
                                                  isLadiesTour ? "Ladies Special" :
                                                  isSeniorTour ? "Senior Citizen" :
                                                  isStudentTour ? "Student" : 
                                                  isHoneymoonTour ? "Honeymoon" :
                                                  isSportsTour ? "Sports" : "Festival",
                                                  true
                                                );
                                                
                                                return hasToursForThisCategory;
                                              })
                                              .map((dest, k) => {
                                                const isIndividualTour = sub.label === "Individual Tours";
                                                const isGroupTour = sub.label === "Group Tours";
                                                const isLadiesTour = sub.label === "Ladies Special Tours";
                                                const isSeniorTour = sub.label === "Senior Citizen Tours";
                                                const isStudentTour = sub.label === "Students Tours";
                                                const isHoneymoonTour = sub.label === "Honeymoon Tours";
                                                const isSportsTour = sub.label === "Sports Tours";
                                                const isFestivalTour = sub.label === "Festival Tours";
                                                
                                                let href = "";
                                                if (isIndividualTour) {
                                                  href = `/intl-tours-packages/${encodeURIComponent(dest.name)}`;
                                                } else if (isGroupTour) {
                                                  href = `/intl-tours_groups/${encodeURIComponent(dest.name)}`;
                                                } else if (isLadiesTour) {
                                                  href = `/intl-ladies_tours/${encodeURIComponent(dest.name)}`;
                                                } else if (isSeniorTour) {
                                                  href = `/intl-senior_tours/${encodeURIComponent(dest.name)}`;
                                                } else if (isStudentTour) {
                                                  href = `/intl-students_tours/${encodeURIComponent(dest.name)}`;
                                                } else if (isHoneymoonTour) {
                                                  href = `/intl-honeymoon_tours/${encodeURIComponent(dest.name)}`;
                                                } else if (isSportsTour) {
                                                  href = `/intl-sports/${encodeURIComponent(dest.name)}`;
                                                } else if (isFestivalTour) {
                                                  href = `/intl-festival/${encodeURIComponent(dest.name)}`;
                                                }
                                                
                                                return (
                                                  <li key={k}>
                                                    <a
                                                      href={href}
                                                      className="block px-2 py-1 text-sm text-gray-300 hover:text-white"
                                                    >
                                                      {dest.name}
                                                    </a>
                                                  </li>
                                                );
                                              })}
                                          </ul>
                                        </li>
                                      );
                                    })
                                ) : (
                                  sub.subDropdown.map((dest, j) => {
                                    const isAndaman = dest === "Andaman";
                                    const isIndividualTour = sub.label === "Individual Tours";
                                    const isGroupTour = sub.label === "Group Tours";
                                    const isLadiesTour = sub.label === "Ladies Special Tours";
                                    const isSeniorTour = sub.label === "Senior Citizen Tours";
                                    const isStudentTour = sub.label === "Students Tours";
                                    const isHoneymoonTour = sub.label === "Honeymoon Tours";
                                    const isSportsTour = sub.label === "Sports Tours";
                                    const isFestivalTour = sub.label === "Festival Tours";
                                    
                                    let href = "";
                                    if (isIndividualTour) {
                                      href = `/tours-packages/${encodeURIComponent(dest)}`;
                                    } else if (isGroupTour) {
                                      href = `/tours_groups/${encodeURIComponent(dest)}`;
                                    } else if (isLadiesTour) {
                                      href = `/ladies_tours/${encodeURIComponent(dest)}`;
                                    } else if (isSeniorTour) {
                                      href = `/senior_tours/${encodeURIComponent(dest)}`;
                                    } else if (isStudentTour) {
                                      href = `/students_tours/${encodeURIComponent(dest)}`;
                                    } else if (isHoneymoonTour) {
                                      href = `/honeymoon_tours/${encodeURIComponent(dest)}`;
                                    } else if (isSportsTour) {
                                      href = `/sports/${encodeURIComponent(dest)}`;
                                    } else if (isFestivalTour) {
                                      href = `/festival/${encodeURIComponent(dest)}`;
                                    }
                                    
                                    return (
                                   <li key={j}>
  <a
    href={href}
    className={`block px-12 py-2 text-sm font-medium ${isAndaman ? "text-cyan-400 font-bold" : "text-gray-300"} hover:text-white`}
  >
    {dest}
  </a>
</li>
                                    );
                                  })
                                )}
                              </ul>
                            )}
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </li>
      ))}
      
      <li className="px-4 py-4 border-b border-blue-500">
        <div className="flex gap-3">
          {/* Mobile Sign Up with Dropdown */}
          <div className="relative group flex-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg border border-green-600 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span className="font-medium text-sm">Sign Up</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
            {/* Dropdown for Sign Up */}
            <div className="absolute left-0 right-0 mt-1 opacity-0 -translate-y-4 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible bg-green-50 text-gray-800 rounded-xl shadow-2xl py-2 border border-green-200 transition-all duration-300 z-50">
              <a href="#new-user" className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-green-100 hover:text-green-700 rounded-lg transition-colors mx-2">
                <UserPlus className="w-4 h-4 text-green-600" /> New User
              </a>
              <a href="#new-agent" className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-green-100 hover:text-green-700 rounded-lg transition-colors mx-2">
                <Users className="w-4 h-4 text-green-600" /> New Agent
              </a>
            </div>
          </div>
          
          {/* Mobile Login with Dropdown */}
          <div className="relative group flex-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg border border-red-600 flex items-center justify-center gap-2"
            >
              <UserCircle className="w-4 h-4" />
              <span className="font-medium text-sm">Login</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
            {/* Dropdown for Login */}
            <div className="absolute left-0 right-0 mt-1 opacity-0 -translate-y-4 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible bg-red-50 text-gray-800 rounded-xl shadow-2xl py-2 border border-red-200 transition-all duration-300 z-50">
              <a href="#user-login" className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors mx-2">
                <UserCircle className="w-4 h-4 text-red-600" /> User Login
              </a>
              <a href="#agent-login" className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors mx-2">
                <Users className="w-4 h-4 text-red-600" /> Agent Login
              </a>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </nav>
)}
      </div>
    </header>
  );
};

export default Header;