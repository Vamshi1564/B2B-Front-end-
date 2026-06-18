import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type RatePlan = {
  plan: "EP" | "CP" | "MAP" | "AP";
  enabled: boolean;
  weekday: string;
  weekend: string;
  longWeekend: string;

  longWeekendFrom: string;
  longWeekendTo: string;

  extraAdult: string;
  childWithBed: string;
  childWithoutBed: string;
};

type Room = {
  type: string;
  max_adults: string;
  max_children: string;
  rackRate: string;
  ratePlans: RatePlan[];
};

type Props = {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  onNext: () => void;
};

const defaultPlans = (): RatePlan[] => [
  {
    plan: "EP",
    enabled: true,
    weekday: "",
    weekend: "",
    longWeekend: "",
     longWeekendFrom: "",
    longWeekendTo: "",
    extraAdult: "",
    childWithBed: "",
    childWithoutBed: "",
  },
  {
    plan: "CP",
    enabled: true,
    weekday: "",
    weekend: "",
    longWeekend: "",
     longWeekendFrom: "",
    longWeekendTo: "",
    extraAdult: "",
    childWithBed: "",
    childWithoutBed: "",
  },
  {
    plan: "MAP",
    enabled: true,
    weekday: "",
    weekend: "",
    longWeekend: "",
     longWeekendFrom: "",
    longWeekendTo: "",
    extraAdult: "",
    childWithBed: "",
    childWithoutBed: "",
  },
  {
    plan: "AP",
    enabled: true,
    weekday: "",
    weekend: "",
    longWeekend: "",
     longWeekendFrom: "",
    longWeekendTo: "",
    extraAdult: "",
    childWithBed: "",
    childWithoutBed: "",
  },
];
const PLAN_LABELS: Record<string, string> = {
  EP: "EP Rate ( Economy Plan Room Only )",
  CP: "CP Rate ( Continental Plan with Breakfast )",
  MAP: "MAP Rate ( Modified American Plan BF with Lunch or Dinner )",
  AP: "AP Rate ( American Plan BF Lunch & Dinner )",
};
const PricingManager = ({ rooms, setRooms, onNext }: Props) => {

  useEffect(() => {
    if (rooms.length === 0) addRoom();
  }, []);

  const updateRoom = (
    roomIndex: number,
    key: keyof Room,
    value: any
  ) => {
    setRooms(prev =>
      prev.map((room, i) =>
        i === roomIndex ? { ...room, [key]: value } : room
      )
    );
  };

  const updatePlan = (
    roomIndex: number,
    planIndex: number,
    key: keyof RatePlan,
    value: any
  ) => {
    setRooms(prev =>
      prev.map((room, i) => {
        if (i !== roomIndex) return room;

        const updatedPlans = room.ratePlans.map((plan, pIndex) =>
          pIndex === planIndex
            ? { ...plan, [key]: value }
            : plan
        );

        return { ...room, ratePlans: updatedPlans };
      })
    );
  };

  const addRoom = () => {
    setRooms(prev => [
      ...prev,
      {
        type: "",
        max_adults: "",
        max_children: "",
        rackRate: "",
        ratePlans: defaultPlans(),
      },
    ]);
  };

  return (
    <div className="bg-white border rounded-3xl shadow-xl p-8 md:p-12 space-y-12">

      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold">
          Room & Rate Configuration
        </h2>
        <p className="text-muted-foreground mt-2">
          Configure rack rate and meal plan pricing.
        </p>
      </div>

      {rooms.map((room, roomIndex) => (
        <div key={roomIndex} className="border rounded-2xl p-8 space-y-10 bg-muted/10">

          {/* ROOM DETAILS */}
          <div>
            <h3 className="text-xl font-semibold mb-6">
              Room {roomIndex + 1}
            </h3>

            <div className="grid md:grid-cols-4 gap-6">

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Room Type *
                </label>
                <Input
                  placeholder="Deluxe / Suite"
                  value={room.type}
                  onChange={e =>
                    updateRoom(roomIndex, "type", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Max Adults *
                </label>
                <Input
                  type="number"
                  min="0"
                  value={room.max_adults}
                  onChange={e =>
                    updateRoom(roomIndex, "max_adults", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Max Children *
                </label>
                <Input
                  type="number"
                  min="0"
                  value={room.max_children}
                  onChange={e =>
                    updateRoom(roomIndex, "max_children", e.target.value)
                  }
                />
              </div>

              {/* RACK RATE */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Rack Rate (Bar Rate) ₹
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="Enter rack rate"
                  value={room.rackRate}
                  onChange={e =>
                    updateRoom(roomIndex, "rackRate", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* MEAL PLANS */}
          <div className="space-y-10">

            {room.ratePlans.map((plan, planIndex) => (

              <div key={plan.plan} className="border rounded-xl p-6 bg-white">

                {/* PLAN HEADER */}
       <div className="flex items-center justify-between mb-6">
  <h4 className="font-semibold text-lg">
    {PLAN_LABELS[plan.plan]}
  </h4>

  <label className="flex items-center gap-2 text-sm">
    <input
      type="checkbox"
      checked={plan.enabled}
      onChange={e =>
        updatePlan(
          roomIndex,
          planIndex,
          "enabled",
          e.target.checked
        )
      }
    />
    Enable
  </label>
</div>

       {plan.enabled && (

<div className="space-y-6">

  {/* WEEKDAY & WEEKEND */}
  <div className="grid md:grid-cols-2 gap-6">

    {/* WEEKDAY */}
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Weekday Price (₹)
      </label>
      <Input
        type="number"
        min="0"
        placeholder="Enter amount"
        value={plan.weekday}
        onChange={e =>
          updatePlan(roomIndex, planIndex, "weekday", e.target.value)
        }
      />
    </div>

    {/* WEEKEND */}
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Weekend Price (₹)
      </label>
      <Input
        type="number"
        min="0"
        placeholder="Enter amount"
        value={plan.weekend}
        onChange={e =>
          updatePlan(roomIndex, planIndex, "weekend", e.target.value)
        }
      />
    </div>

  </div>


  {/* LONG WEEKEND */}
  <div className="space-y-2">

    <label className="text-sm font-medium">
      Long Weekend Price (₹)
    </label>

    <div className="grid md:grid-cols-3 gap-3 items-end">

      {/* PRICE */}
      <Input
        type="number"
        min="0"
        placeholder="Amount"
        value={plan.longWeekend}
        onChange={e =>
          updatePlan(roomIndex, planIndex, "longWeekend", e.target.value)
        }
      />

      {/* FROM DATE */}
      <div className="relative">
        <span className="absolute left-3 top-1 text-xs text-muted-foreground">
          From
        </span>

        <Input
          type="date"
          className="pt-5"
          value={plan.longWeekendFrom}
          onChange={e =>
            updatePlan(roomIndex, planIndex, "longWeekendFrom", e.target.value)
          }
        />
      </div>

      {/* TO DATE */}
      <div className="relative">
        <span className="absolute left-3 top-1 text-xs text-muted-foreground">
          To
        </span>

        <Input
          type="date"
          className="pt-5"
          value={plan.longWeekendTo}
          onChange={e =>
            updatePlan(roomIndex, planIndex, "longWeekendTo", e.target.value)
          }
        />
      </div>

    </div>

  </div>


  {/* EXTRA PRICING */}
  <div className="grid md:grid-cols-3 gap-6">

    {/* EXTRA ADULT */}
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Extra Adult Price (₹)
      </label>
      <Input
        type="number"
        min="0"
        placeholder="Enter amount"
        value={plan.extraAdult}
        onChange={e =>
          updatePlan(roomIndex, planIndex, "extraAdult", e.target.value)
        }
      />
    </div>

    {/* CHILD WITH BED */}
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Child With Bed Price (₹)
      </label>
      <Input
        type="number"
        min="0"
        placeholder="Enter amount"
        value={plan.childWithBed}
        onChange={e =>
          updatePlan(roomIndex, planIndex, "childWithBed", e.target.value)
        }
      />
    </div>

    {/* CHILD WITHOUT BED */}
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Child Without Bed Price (₹)
      </label>
      <Input
        type="number"
        min="0"
        placeholder="Enter amount"
        value={plan.childWithoutBed}
        onChange={e =>
          updatePlan(roomIndex, planIndex, "childWithoutBed", e.target.value)
        }
      />
    </div>

  </div>

</div>

)}

              </div>

            ))}

          </div>

        </div>
      ))}

      <Button variant="outline" onClick={addRoom}>
        <Plus className="w-4 h-4 mr-2" />
        Add Another Room
      </Button>

     

    </div>
  );
};

export default PricingManager;