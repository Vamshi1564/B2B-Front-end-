import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Policies = {
  booking_policy: string;
  cancellation_policy: string;
  child_policy: string;
  pet_policy: string;
  terms: string;
};

type Props = {
  policies: Policies;
  setPolicies: React.Dispatch<React.SetStateAction<Policies>>;
  onNext?: () => void;
};

const BookingPoliciesManager = ({
  policies,
  setPolicies,
  onNext,
}: Props) => {
  const updateField = (key: keyof Policies, value: any) => {
    setPolicies(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-12">

      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold">
          Booking & Cancellation Policies
        </h2>
        <p className="text-muted-foreground mt-2">
          Define clear property rules to avoid guest disputes.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">

        {/* BOOKING POLICY */}
        <div className="space-y-2 md:col-span-2">
          <label className="font-semibold text-sm">
            Booking Policy *
          </label>
          <Textarea
            className="min-h-[120px]"
            placeholder="Advance payment required, valid ID mandatory..."
            value={policies.booking_policy}
            onChange={(e) =>
              updateField("booking_policy", e.target.value)
            }
          />
        </div>

        {/* CANCELLATION POLICY */}
        <div className="space-y-2 md:col-span-2">
          <label className="font-semibold text-sm">
            Cancellation Policy *
          </label>
          <Textarea
            className="min-h-[120px]"
            placeholder="Free cancellation up to 48 hours before check-in..."
            value={policies.cancellation_policy}
            onChange={(e) =>
              updateField("cancellation_policy", e.target.value)
            }
          />
        </div>

        {/* CHILD POLICY */}
        <div className="space-y-2">
          <label className="font-semibold text-sm">
            Child Policy
          </label>
          <Textarea
            placeholder="Children below 5 years stay free..."
            value={policies.child_policy}
            onChange={(e) =>
              updateField("child_policy", e.target.value)
            }
          />
        </div>

        {/* PET POLICY */}
        <div className="space-y-2">
          <label className="font-semibold text-sm">
            Pet Policy
          </label>
          <Textarea
            placeholder="Pets allowed / Not allowed"
            value={policies.pet_policy}
            onChange={(e) =>
              updateField("pet_policy", e.target.value)
            }
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="font-semibold text-sm">
            Terms and Conditions *
          </label>
          <Textarea
            className="min-h-[120px]"
            placeholder="Advance payment required, valid ID mandatory..."
            value={policies.terms}
            onChange={(e) =>
              updateField("terms", e.target.value)
            }
          />
        </div>

        {/* CHECK-IN TIME */}
        {/* <div className="space-y-2">
          <label className="font-semibold text-sm">
            Check-in Time
          </label>
          <Input
            type="time"
            value={policies.check_in_time}
            onChange={(e) =>
              updateField("check_in_time", e.target.value)
            }
          />
        </div> */}

        {/* CHECK-OUT TIME */}
        {/* <div className="space-y-2">
          <label className="font-semibold text-sm">
            Check-out Time
          </label>
          <Input
            type="time"
            value={policies.check_out_time}
            onChange={(e) =>
              updateField("check_out_time", e.target.value)
            }
          />
        </div> */}

        {/* 24 HOUR CHECK-IN */}
        {/* <div className="flex items-center gap-3 md:col-span-2">
          <input
            type="checkbox"
            checked={policies.is_24hr_checkin}
            onChange={(e) =>
              updateField("is_24hr_checkin", e.target.checked)
            }
          />
          <label className="font-medium">
            24 Hour Flexible Check-in Available
          </label>
        </div> */}

        {/* ID REQUIRED */}
        {/* <div className="flex items-center gap-3 md:col-span-2">
          <input
            type="checkbox"
            checked={policies.id_proof_required}
            onChange={(e) =>
              updateField("id_proof_required", e.target.checked)
            }
          />
          <label className="font-medium">
            Valid Government ID Required
          </label>
        </div> */}

        {/* HOTEL REMARKS */}
        {/* <div className="space-y-2 md:col-span-2">
          <label className="font-semibold text-sm">
            Hotel Remarks
          </label>
          <Textarea
            className="min-h-[120px]"
            placeholder="Additional internal notes..."
            value={policies.hotel_remarks}
            onChange={(e) =>
              updateField("hotel_remarks", e.target.value)
            }
          />
        </div> */}

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

export default BookingPoliciesManager;