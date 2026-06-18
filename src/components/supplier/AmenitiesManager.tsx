import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

type Props = {
  amenities: string[];
  setAmenities: React.Dispatch<React.SetStateAction<string[]>>;
};

const MASTER_AMENITIES = [
  "Free WiFi",
  "Air Conditioning",
  "Swimming Pool",
  "Parking",
  "Restaurant",
  "Bar",
  "Gym",
  "Spa",
  "Room Service",
  "Laundry Service",
  "Power Backup",
  "Elevator",
  "Conference Hall",
  "Doctor on Call",
  "CCTV Security",
  "Fire Safety",
];

const AmenitiesManager = ({ amenities, setAmenities }: Props) => {
  const [customAmenity, setCustomAmenity] = useState("");

  const toggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(prev => prev.filter(a => a !== amenity));
    } else {
      setAmenities(prev => [...prev, amenity]);
    }
  };

  const addCustomAmenity = () => {
    if (!customAmenity.trim()) return;

    if (!amenities.includes(customAmenity)) {
      setAmenities(prev => [...prev, customAmenity]);
    }

    setCustomAmenity("");
  };

  const removeAmenity = (amenity: string) => {
    setAmenities(prev => prev.filter(a => a !== amenity));
  };

  return (
    <div className="space-y-12">

      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold">
          Property Amenities
        </h2>
        <p className="text-muted-foreground mt-2">
          Select available amenities to improve visibility and booking rate.
        </p>
      </div>

      {/* MASTER AMENITIES GRID */}
<div className="grid md:grid-cols-4 lg:grid-cols-5 gap-3">

        {MASTER_AMENITIES.map((amenity) => (
          <label
            key={amenity}
            className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:bg-muted/20 transition"
          >
            <input
              type="checkbox"
              checked={amenities.includes(amenity)}
              onChange={() => toggleAmenity(amenity)}
            />
            <span className="text-sm font-medium">
              {amenity}
            </span>
          </label>
        ))}

      </div>

      {/* CUSTOM AMENITY ADD */}
      <div className="border-t pt-8 space-y-4">

        <h3 className="text-lg font-semibold">
          Add Custom Amenity
        </h3>

        <div className="flex gap-4">
          <Input
            value={customAmenity}
            onChange={(e) => setCustomAmenity(e.target.value)}
            placeholder="Enter custom amenity"
          />
          <Button onClick={addCustomAmenity}>
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

      </div>

      {/* SELECTED AMENITIES DISPLAY */}
      {amenities.length > 0 && (
        <div className="border-t pt-8 space-y-4">

          <h3 className="text-lg font-semibold">
            Selected Amenities
          </h3>

          <div className="flex flex-wrap gap-3">

            {amenities.map((amenity) => (
              <div
                key={amenity}
                className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full"
              >
                <span className="text-sm">
                  {amenity}
                </span>
                <button
                  onClick={() => removeAmenity(amenity)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  );
};

export default AmenitiesManager;