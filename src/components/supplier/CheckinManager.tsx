import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type CheckinData = {
  check_in_time: string;
  check_out_time: string;
  is_24hr_checkin: boolean;
  early_checkin_allowed: boolean;
  early_checkin_charge: string;
  late_checkout_allowed: boolean;
  late_checkout_charge: string;
  id_proof_required: boolean;
};

type Props = {
  checkinData: CheckinData;
  setCheckinData: React.Dispatch<React.SetStateAction<CheckinData>>;
  onNext?: () => void;
};

const CheckinManager = ({
  checkinData,
  setCheckinData,
  onNext,
}: Props) => {

  const updateField = (key: keyof CheckinData, value: any) => {
    setCheckinData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-12">

      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold">
          Check-in & Check-out Settings
        </h2>
        <p className="text-muted-foreground mt-2">
          Configure property timing and flexible check-in rules.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">

        {/* CHECK-IN TIME */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Standard Check-in Time
          </label>
          <Input
            type="time"
            value={checkinData.check_in_time}
            onChange={(e) =>
              updateField("check_in_time", e.target.value)
            }
          />
        </div>

        {/* CHECK-OUT TIME */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Standard Check-out Time
          </label>
          <Input
            type="time"
            value={checkinData.check_out_time}
            onChange={(e) =>
              updateField("check_out_time", e.target.value)
            }
          />
        </div>

        {/* 24 HOUR CHECK-IN */}
        <div className="flex items-center gap-3 md:col-span-2">
          <input
            type="checkbox"
            checked={checkinData.is_24hr_checkin}
            onChange={(e) =>
              updateField("is_24hr_checkin", e.target.checked)
            }
          />
          <label className="font-medium">
            24 Hour Flexible Check-in Available
          </label>
        </div>

        {/* EARLY CHECK-IN */}
        <div className="flex items-center gap-3 md:col-span-2">
          <input
            type="checkbox"
            checked={checkinData.early_checkin_allowed}
            onChange={(e) =>
              updateField("early_checkin_allowed", e.target.checked)
            }
          />
          <label className="font-medium">
            Early Check-in Allowed
          </label>
        </div>

        {checkinData.early_checkin_allowed && (
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold">
              Early Check-in Charge (₹)
            </label>
          <Input
  type="text"
  placeholder="e.g. ₹500 / Complimentary / Subject to availability"
  value={checkinData.early_checkin_charge}
  onChange={(e) =>
    updateField("early_checkin_charge", e.target.value)
  }
/>
          </div>
        )}

        {/* LATE CHECK-OUT */}
        <div className="flex items-center gap-3 md:col-span-2">
          <input
            type="checkbox"
            checked={checkinData.late_checkout_allowed}
            onChange={(e) =>
              updateField("late_checkout_allowed", e.target.checked)
            }
          />
          <label className="font-medium">
            Late Check-out Allowed
          </label>
        </div>

        {checkinData.late_checkout_allowed && (
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold">
              Late Check-out Charge (₹)
            </label>
           <Input
  type="text"
  placeholder="e.g. ₹500 till 2PM / Half day charge"
  value={checkinData.late_checkout_charge}
  onChange={(e) =>
    updateField("late_checkout_charge", e.target.value)
  }
/>
          </div>
        )}

        {/* ID PROOF REQUIRED */}
        <div className="flex items-center gap-3 md:col-span-2">
          <input
            type="checkbox"
            checked={checkinData.id_proof_required}
            onChange={(e) =>
              updateField("id_proof_required", e.target.checked)
            }
          />
          <label className="font-medium">
            Valid Government ID Required
          </label>
        </div>

      </div>

      {onNext && (
        <Button
          onClick={onNext}
          className="w-full h-12 text-lg"
        >
          Save & Continue →
        </Button>
      )}
    </div>
  );
};

export default CheckinManager;