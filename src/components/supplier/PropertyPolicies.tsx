import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Policies = {
  booking: string;
  cancellation: string;
  terms: string;
};

type Props = {
  policies: Policies;
  setPolicies: React.Dispatch<React.SetStateAction<Policies>>;
  onPublish: () => void;
};

const PropertyPolicies = ({
  policies,
  setPolicies,
  onPublish,
}: Props) => {
  return (
    <div className="bg-card border rounded-3xl shadow-xl p-10 space-y-10">

      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold">Policies & Terms</h2>
        <p className="text-muted-foreground mt-2">
          Clearly define rules to avoid booking disputes.
        </p>
      </div>

      {/* FORM */}
      <div className="space-y-8">

        {/* BOOKING POLICY */}
        <div>
          <label className="font-semibold text-sm mb-2 block">
            Booking Policy
          </label>
          <Textarea
            className="min-h-[120px]"
            placeholder="Advance payment required, valid ID mandatory..."
            value={policies.booking}
            onChange={(e) =>
              setPolicies((p) => ({ ...p, booking: e.target.value }))
            }
          />
        </div>

        {/* CANCELLATION POLICY */}
        <div>
          <label className="font-semibold text-sm mb-2 block">
            Cancellation Policy
          </label>
          <Textarea
            className="min-h-[120px]"
            placeholder="Free cancellation up to 48 hours before check-in..."
            value={policies.cancellation}
            onChange={(e) =>
              setPolicies((p) => ({ ...p, cancellation: e.target.value }))
            }
          />
        </div>

        {/* TERMS */}
        <div>
          <label className="font-semibold text-sm mb-2 block">
            Terms & Conditions
          </label>
          <Textarea
            className="min-h-[120px]"
            placeholder="No pets allowed, check-in after 12 PM..."
            value={policies.terms}
            onChange={(e) =>
              setPolicies((p) => ({ ...p, terms: e.target.value }))
            }
          />
        </div>

      </div>

      {/* SUBMIT */}
      <Button
        onClick={onPublish}
        className="w-full h-12 text-lg rounded-xl bg-gradient-to-r from-primary to-accent"
      >
        Publish Property
      </Button>

    </div>
  );
};

export default PropertyPolicies;