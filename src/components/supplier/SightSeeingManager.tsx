import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

type SightSeeing = {
  place_name: string;
  distance_km: string;
  travel_time: string;
  description: string;
};

type Props = {
  sightseeing: SightSeeing[];
  setSightSeeing: React.Dispatch<React.SetStateAction<SightSeeing[]>>;
};

const SightSeeingManager = ({ sightseeing, setSightSeeing }: Props) => {

  const addPlace = () => {
    setSightSeeing(prev => [
      ...prev,
      {
        place_name: "",
        distance_km: "",
        travel_time: "",
        description: "",
      }
    ]);
  };

  const removePlace = (index: number) => {
    setSightSeeing(prev => prev.filter((_, i) => i !== index));
  };

  const updatePlace = (
    index: number,
    key: keyof SightSeeing,
    value: string
  ) => {
    setSightSeeing(prev =>
      prev.map((place, i) =>
        i === index ? { ...place, [key]: value } : place
      )
    );
  };

  return (
    <div className="space-y-12">

      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold">
          Nearby Sightseeing
        </h2>
        <p className="text-muted-foreground mt-2">
          Add tourist attractions near your property.
        </p>
      </div>

      {/* LIST */}
      {sightseeing.map((place, index) => (
        <div
          key={index}
          className="border rounded-2xl p-8 bg-muted/10 space-y-6"
        >

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Attraction {index + 1}
            </h3>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => removePlace(index)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-3">

            {/* PLACE NAME */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Place Name *
              </label>
              <Input
                placeholder="e.g. Charminar"
                value={place.place_name}
                onChange={(e) =>
                  updatePlace(index, "place_name", e.target.value)
                }
              />
            </div>

            {/* DISTANCE */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Distance (KM)
              </label>
              <Input
              type="text"
              placeholder="e.g. 5 km / 500 m"
              value={place.distance_km}
              onChange={(e) =>
                updatePlace(index, "distance_km", e.target.value)
              }
            />
            </div>

            {/* TRAVEL TIME */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Travel Time
              </label>
              <Input
                placeholder="e.g. 15 mins"
                value={place.travel_time}
                onChange={(e) =>
                  updatePlace(index, "travel_time", e.target.value)
                }
              />
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium">
                Description
              </label>
              <Textarea
                placeholder="Brief details about this attraction"
                value={place.description}
                onChange={(e) =>
                  updatePlace(index, "description", e.target.value)
                }
              />
            </div>

          </div>

        </div>
      ))}

      {/* ADD BUTTON */}
      <Button variant="outline" onClick={addPlace}>
        <Plus className="w-4 h-4 mr-2" />
        Add Sightseeing Place
      </Button>

    </div>
  );
};

export default SightSeeingManager;