import { MapPin, Building2, Hash, Search, Map } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type HeroSearchBarProps = {
  activeCategory: string;
};

const CITIES = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune"];
const HOTELS = ["Taj Hotel", "ITC Grand", "Oberoi", "Marriott", "Hyatt"];
const AREAS = ["Andheri", "Bandra", "Powai", "Dadar", "Kurla"];
const LANDMARKS = ["Near Airport", "Bus Stand", "Railway Station", "Mall"];

const HeroSearchBar = ({ activeCategory }: HeroSearchBarProps) => {
  const [city, setCity] = useState("");
  const [hotel, setHotel] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [focus, setFocus] = useState<string | null>(null);

  const navigate = useNavigate();

  const filter = (list: string[], value: string) =>
    list
      .filter((i) => i.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (hotel) params.set("hotel", hotel);
    if (area) params.set("area", area);
    if (landmark) params.set("landmark", landmark);
    if (pincode) params.set("pincode", pincode);
    params.set("category", activeCategory);

    navigate(`/home?${params.toString()}`);
  };

  const handleReset = () => {
    setCity("");
    setHotel("");
    setArea("");
    setLandmark("");
    setPincode("");
    navigate("/home");
  };

  return (
    //     <form
    //       onSubmit={handleSearch}
    //       className="border shadow-2xl w-[109%] -ml-[5%]"
    //       style={{
    //         background:
    //           "radial-gradient(circle, rgb(90,146,237) 0%, rgb(76,112,231) 30%, rgb(15,31,92) 70%, rgb(10,17,40) 100%)",
    //       }}
    //     >
    //       <div className="flex flex-col lg:flex-row items-stretch">

    //         {/* CITY */}
    //         <div className="relative flex-1 px-4 py-3 lg:border-r">
    //           <label className="flex items-center gap-2 text-[13px] font-semibold text-white uppercase">
    //             <MapPin size={14} /> City
    //           </label>
    //           <Input
    //             value={city}
    //             onFocus={() => setFocus("city")}
    //             onBlur={() => setTimeout(() => setFocus(null), 150)}
    //             onChange={(e) => setCity(e.target.value)}
    //             placeholder="Mumbai"
    //             className="mt-1 border-0 bg-[#FAFAD2] text-black rounded-md focus-visible:ring-0"
    //           />

    //           {focus === "city" && city && (
    //             <div className="absolute z-30 mt-2 bg-white border rounded shadow w-full">
    //               {filter(CITIES, city).map((c) => (
    //                 <button
    //                   key={c}
    //                   type="button"
    //                   onClick={() => setCity(c)}
    //                   className="w-full px-3 py-2 text-left hover:bg-gray-100"
    //                 >
    //                   {c}
    //                 </button>
    //               ))}
    //             </div>
    //           )}
    //         </div>

    //         {/* HOTEL */}
    //         <div className="flex-1 px-4 py-3 border-b lg:border-b-0 lg:border-r">
    //           <label className="flex items-center gap-2 text-[13px] font-semibold text-white uppercase">
    //             <Building2 size={14} /> Hotel
    //           </label>
    //           <Input
    //             value={hotel}
    //             onChange={(e) => setHotel(e.target.value)}
    //             placeholder="Taj, ITC..."
    //             className="mt-1 border-0 bg-[#FAFAD2] text-black rounded-md focus-visible:ring-0"
    //           />
    //         </div>

    //         {/* AREA */}
    //         <div className="flex-1 px-4 py-3 border-b lg:border-b-0 lg:border-r">
    //           <label className="flex items-center gap-2 text-[13px] font-semibold text-white uppercase">
    //             <MapPin size={14} /> Area
    //           </label>
    //           <Input
    //             value={area}
    //             onChange={(e) => setArea(e.target.value)}
    //             placeholder="Andheri"
    //             className="mt-1 border-0 bg-[#FAFAD2] text-black rounded-md focus-visible:ring-0"
    //           />
    //         </div>

    //         {/* LANDMARK */}
    //         <div className="flex-1 px-4 py-3 border-b lg:border-b-0 lg:border-r">
    //           <label className="flex items-center gap-2 text-[13px] font-semibold text-white uppercase">
    //             <Map size={14} /> Landmark
    //           </label>
    //           <Input
    //             value={landmark}
    //             onChange={(e) => setLandmark(e.target.value)}
    //             placeholder="Near Airport"
    //             className="mt-1 border-0 bg-[#FAFAD2] text-black rounded-md focus-visible:ring-0"
    //           />
    //         </div>

    //         {/* PINCODE */}
    //         <div className="flex-1 px-4 py-3 border-b lg:border-b-0 lg:border-r">
    //           <label className="flex items-center gap-2 text-[13px] font-semibold text-white uppercase">
    //             <Hash size={14} /> Pincode
    //           </label>
    //           <Input
    //             value={pincode}
    //             onChange={(e) => setPincode(e.target.value)}
    //             placeholder="400028"
    //             className="mt-1 border-0 bg-[#FAFAD2] text-black rounded-md focus-visible:ring-0"
    //           />
    //         </div>

    //         {/* BUTTONS */}
    //         <div className="flex flex-col justify-center px-4 py-3 gap-2 min-w-[150px]">

    //   {/* CLEAR FILTERS (TOP) */}
    //   <button
    //     type="button"
    //     onClick={handleReset}
    //     className="text-white text-sm font-medium underline hover:text-gray-200 text-center"
    //   >
    //     Clear Filters
    //   </button>

    //   {/* SEARCH BUTTON (BOTTOM) */}
    //   <Button
    //     type="submit"
    //     className="w-full h-11 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
    //   >
    //     <Search size={16} />
    //     Search
    //   </Button>

    // </div>
    //       </div>
    //     </form>


    <form
  onSubmit={handleSearch}
  className="w-full rounded-[10px] border-[6px] border-[#1f2a44] bg-[#1f2a44] p-[4px]"
>
      {/* TITLE BAR */}
      <div className="bg-[#A2D4F1] text-center rounded-[4px] text-[#2b2b8a] font-bold py-1 text-sm uppercase tracking-wider mb-[2px]">
        Search Here
      </div>

      {/* MAIN GRID - 6 Columns */}
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_0.6fr_110px] gap-[2px]">
        {/* --- ROW 1: HEADERS + CLEAR ALL --- */}
        {["City", "Hotel", "Area", "Landmark", "Pincode"].map((label) => (
          <div
            key={label}
            className="bg-[#c45a00] text-white text-center py-1 text-sm font-medium border border-white rounded-[4px]"
          >
            {label}
          </div>
        ))}

        {/* CLEAR ALL BUTTON (Matches Header Row) */}
        <button
          type="button"
          onClick={handleReset}
          className="bg-[#a34b00] text-white text-sm font-medium  rounded-[7px] py-1 transition-colors"
        >
          Clear All
        </button>

        {/* --- ROW 2: INPUTS + SEARCH --- */}

        {/* CITY INPUT */}
        <div className="relative">
          <input
            value={city}
            onFocus={() => setFocus("city")}
            onBlur={() => setTimeout(() => setFocus(null), 150)}
            onChange={(e) => setCity(e.target.value)}
            className="bg-[#ffffcc] h-8 w-full border border-white rounded-[4px] text-black px-2 focus:outline-none"
          />
          {focus === "city" && city && (
            <div className="absolute gap-1 z-50 bg-white border w-full shadow-lg max-h-40 overflow-y-auto mt-1">
              {filter(CITIES, city).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCity(c)}
                  className="w-full text-left px-2 py-1 hover:bg-gray-100 text-sm"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* HOTEL INPUT */}
        <input
          value={hotel}
          onChange={(e) => setHotel(e.target.value)}
          className="bg-[#ffffcc] h-8 w-full border border-white rounded-[4px] text-black px-2 focus:outline-none"
        />

        {/* AREA INPUT */}
        <input
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="bg-[#ffffcc] h-8 w-full border border-white rounded-[4px] text-black px-2 focus:outline-none"
        />

        {/* LANDMARK INPUT */}
        <input
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
          className="bg-[#ffffcc] h-8 w-full border border-white rounded-[4px] text-black px-2 focus:outline-none"
        />

        {/* PINCODE INPUT */}
        <input
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="bg-[#ffffcc] h-8 w-full border border-white rounded-[4px] text-black px-2 focus:outline-none"
        />

        {/* SEARCH BUTTON (Matches Input Row) */}
        <button
          type="submit"
          className="bg-[#cc0000] text-white text-sm font-bold rounded-[7px] py-1 hover:bg-red-700 transition-colors uppercase"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default HeroSearchBar;
