import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { API_URL } from "@/config/api";

const PAGE_SIZE = 6;

type Props = {
  properties: any[];
};

const SupplierPropertyGrid = ({ properties }: Props) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(properties.length / PAGE_SIZE);

  const visible = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return properties.slice(start, start + PAGE_SIZE);
  }, [properties, page]);

  if (!properties) {
    return <div className="text-center py-10">Loading properties...</div>;
  }

  return (
    <div className="bg-[#FFEBEE] border rounded-3xl shadow-xl p-10">

      <h2 className="text-2xl font-semibold mb-8">
        Your Properties
      </h2>

      {properties.length === 0 ? (
        <p className="text-muted-foreground text-center">
          No properties added yet.
        </p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

            {visible.map((property) => (
              <div
                key={property.id}
                className={`bg-background rounded-3xl shadow-lg overflow-hidden hover:-translate-y-1 transition
                  ${property.status === "Deleted" ? "opacity-60" : ""}
                `}
              >
                {/* Cover Image */}
                <img
                  src={
                    property.cover_image
                      ? `${API_URL}/uploads/${property.cover_image}`
                      : "https://via.placeholder.com/400x250"
                  }
                  className="h-52 w-full object-cover"
                />

                <div className="p-5 space-y-3 bg-blue-50">

                  {/* Header Row */}
                  <div className="flex justify-between items-start ">

                    <h3 className="font-bold text-lg">
                      {property.name}
                    </h3>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          property.status === "Deleted"
                            ? "bg-red-100 text-red-600"
                            : property.status === "Inactive"
                            ? "bg-gray-100 text-gray-600"
                            : property.status === "Pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        }
                      `}
                    >
                      {property.status}
                    </span>

                  </div>

                  {/* Location */}
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {property.city}, {property.area} – {property.pincode}
                  </div>

                  {/* Category */}
                  <p className="text-xs uppercase tracking-wider text-primary font-semibold">
                    {property.category}
                  </p>

                  {/* Button */}
                  {property.status !== "Deleted" ? (
                    <Link to={`/property/${property.id}`}>
                      <Button className="w-full mt-3 rounded-xl">
                        View Details 
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      disabled
                      variant="outline"
                      className="w-full mt-3 rounded-xl"
                    >
                      Deleted
                    </Button>
                  )}

                </div>
              </div>
            ))}

          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-10">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Prev
              </Button>

              <span className="px-4 py-2 font-semibold">
                {page} / {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            </div>
          )}

        </>
      )}
    </div>
  );
};

export default SupplierPropertyGrid;