import { useMemo, useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { getUser } from "@/utils/auth";
import { API_URL } from "@/config/api";

const PAGE_SIZE = 9;

const PropertyGrid = ({
  activeCategory,
  freeOnly = false,
}: {
  activeCategory: string;
  freeOnly?: boolean;
}) => {
  const [page, setPage] = useState(1);
  const [properties, setProperties] = useState<any[]>([]);
  const [params] = useSearchParams();

  const user = getUser();
  const navigate = useNavigate();

  const isAgent = user?.role === "agent";
  const isActiveAgent = user?.role === "agent" && Number(user?.is_active) === 1;
  const city = params.get("city") || "";
  const hotel = params.get("hotel") || "";
  const area = params.get("area") || "";
  const pincode = params.get("pincode") || "";
  const showFreeView = isAgent && !isActiveAgent;
  const showPaidAgent = isAgent && isActiveAgent;

  /* ================= FETCH FROM DB ================= */
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        let url = `${API_URL}/api/properties`;

        // If supplier → only his properties
        if (user?.role === "supplier") {
          url = `${API_URL}/api/properties/supplier/${user.id}/list`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (res.ok) {
          setProperties(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProperties();
  }, [user]);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const matchCategory = !activeCategory || p.category === activeCategory;

      const matchCity =
        !city || p.city?.toLowerCase().includes(city.toLowerCase());

      const matchHotel =
        !hotel || p.name?.toLowerCase().includes(hotel.toLowerCase());

      const matchArea =
        !area || p.area?.toLowerCase().includes(area.toLowerCase());

      const matchPincode = !pincode || p.pincode?.includes(pincode);

      return (
        matchCategory && matchCity && matchHotel && matchArea && matchPincode
      );
    });
  }, [properties, activeCategory, city, hotel, area, pincode]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, city, hotel, area, pincode]);

  const start = (page - 1) * PAGE_SIZE;
  let visible = filtered.slice(start, start + PAGE_SIZE);

  if (freeOnly) {
    visible = filtered.slice(0, 5);
  }
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto py-1">
      {/* {freeOnly && (
        <div className="flex justify-end mb-4">
          <Button onClick={() => (window.location.href = "/home")}>
            Close Free View
          </Button>
        </div>
      )} */}
      {/* <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-16 -ml-[28px] w-[104%] sm:-ml-[20px] sm:w-[102%] md:-ml-[24px] md:w-[103%] lg:-ml-[28px] lg:w-[104%]">
        {visible.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
            <h2 className="text-2xl font-semibold mb-3 text-black">
              Properties Coming Soon!!!
            </h2>

            <p className="text-xl text-white max-w-md">
              {/* We are currently adding new properties to this section. Please
              check back soon for exciting listings and updates. */}
            </p>
          </div>
        )}

        {visible.map((property, index) => {
          const globalIndex = start + index;
          const isLocked = showFreeView && globalIndex >= 5;

          return (
            <div
              key={property.id}
              className="w-[325.33px] h-[439.2px]  group bg-[#C3E3F5] rounded-2xl overflow-hidden border border-black shadow-[10px_4px_12px_rgba(0,0,0,0.6)] hover:shadow-xl transition duration-300"
            >
              {/* IMAGE */}
              <div className="relative overflow-hidden">
                <div className="relative overflow-hidden">
                  <img
                    src={
                      property.cover_image
                        ? `${API_URL}/uploads/${property.cover_image}`
                        : "https://via.placeholder.com/400x250"
                    }
                    className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
                    //  alt={property.name}
                  />

                  {/* Gradient Overlay (optional but recommended) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* PRICE BADGE */}
                  {/* {property.starting_price && (
                  <div className="absolute bottom-4 right-4 bg-white text-primary px-4 py-2 rounded-full shadow-lg font-semibold">
                    * ₹{property.starting_price} 
                    <span className="text-xs font-normal text-muted-foreground ml-1">
                      / night
                    </span>
                  </div>
                )} */}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                {/* Category Badge */}
                {/* <span className="absolute top-4 left-4 bg-white/90 text-primary px-3 py-1 rounded-full text-xs font-semibold shadow">
                {property.category}
              </span> */}
              </div>

              {/* CONTENT */}
              {/* <div className="p-4 space-y-2"> */}

              <div className="h-60 p-4 space-y-0 bg-[#EDF3FB] rounded-xl shadow-sm border border-[#dce6f2]">
                <div className="flex flex-col">
                  <h2 className="text-[#33538B] text-lg leading-tight flex">
                    <span className="font-bold whitespace-nowrap">
                      Hotel Name:
                    </span>

                    <span
                      className="ml-1 font-normal truncate max-w-[180px]"
                      title={property.name}
                    >
                      {property.name}
                    </span>
                  </h2>
                </div>

                {/* Info Rows with Margin Top for spacing */}
                <div className="flex flex-col mt-2">
                  <h3 className="text-[15px] text-[#33538B] flex items-baseline mt-1">
                    <span className="font-bold min-w-[50px]">Area:</span>
                    <span className="ml-2 font-normal">{property.area}</span>
                  </h3>

                  <h3 className="text-[15px] text-[#33538B] flex items-baseline mt-1">
                    <span className="font-bold min-w-[50px]">City:</span>
                    <span className="ml-2 font-normal">{property.city}</span>
                  </h3>

                  <h3 className="text-[15px] text-[#33538B] flex items-baseline mt-1">
                    <span className="font-bold">Price Starts from:</span>
                    <span className="ml-2 font-normal">
                      {property.starting_price}/-
                    </span>
                  </h3>
                </div>
                {/* Optional price placeholder */}

                {/* Buttons */}
                <div className="flex gap-3">
                  {/* INACTIVE AGENT - FIRST 5 PROPERTIES */}
                  {showFreeView && !isLocked && (
                    <>
                      <Link to={`/property/${property.id}`} className="flex-1">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          Free View
                        </Button>
                      </Link>

                      <Button
                        className="flex-1 bg-primary"
                        onClick={() => navigate("/agent/payment")}
                      >
                        Pay Now
                      </Button>
                    </>
                  )}

                  {/* INACTIVE AGENT - AFTER 5 PROPERTIES */}
                  {showFreeView && isLocked && (
                    <Button
                      className="w-full bg-primary"
                      onClick={() => navigate("/agent/payment")}
                    >
                      Pay Now
                    </Button>
                  )}

                  {/* ACTIVE AGENT */}
                  {showPaidAgent && (
                    <>
                      <Link to={`/property/${property.id}`} className="flex-1">
                        <Button className="mt-3 w-full bg-[#2F2FAA] text-white rounded-[10px]">
                          View Details
                        </Button>
                      </Link>

                      <Button
                        className="mt-3 flex-1 bg-[#FF0000] text-white rounded-[10px]"
                        disabled
                      >
                        Paid Agent
                      </Button>
                    </>
                  )}

                  {/* NON AGENT */}
                  {!isAgent && (
                    <Link to={`/property/${property.id}`} className="flex-1">
                      <Button className="w-full bg-[#0f1f5c] text-white rounded-[10px]">
                        View Details
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION (DISABLED IN FREE VIEW) */}
      {!freeOnly && totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-10">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>

          <span className="px-4 py-2 font-semibold">
            {page} / {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default PropertyGrid;
