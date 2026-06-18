import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

type Rule = {
  from_days: number;
  to_days: number;
  charge_type: "percentage" | "fixed";
  charge_value: string;
};

type Props = {
  rules: Rule[];
  setRules: React.Dispatch<React.SetStateAction<Rule[]>>;
};

const CancellationPoliciesManager = ({ rules, setRules }: Props) => {

  const addRule = () => {
    setRules(prev => [
      ...prev,
      {
        from_days: 0,
        to_days: 0,
        charge_type: "percentage",
        charge_value: "",
      }
    ]);
  };

  const removeRule = (index: number) => {
    setRules(prev => prev.filter((_, i) => i !== index));
  };

  const updateRule = (
    index: number,
    key: keyof Rule,
    value: any
  ) => {
    setRules(prev =>
      prev.map((rule, i) =>
        i === index ? { ...rule, [key]: value } : rule
      )
    );
  };

  return (
    <div className="space-y-12">

      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold">
          Cancellation Policy Rules
        </h2>
        <p className="text-muted-foreground mt-2">
          Define cancellation charges based on days before check-in.
        </p>
      </div>

      {rules.map((rule, index) => (
        <div
          key={index}
          className="border rounded-2xl p-8 bg-muted/10 space-y-6"
        >

          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">
              Rule {index + 1}
            </h3>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeRule(index)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            {/* FROM DAYS */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                From (Days Before Check-in)
              </label>
              <Input
                type="number"
                min="0"
                value={rule.from_days}
                onChange={(e) =>
                  updateRule(index, "from_days", Number(e.target.value))
                }
              />
            </div>

            {/* TO DAYS */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                To (Days Before Check-in)
              </label>
              <Input
                type="number"
                min="0"
                value={rule.to_days}
                onChange={(e) =>
                  updateRule(index, "to_days", Number(e.target.value))
                }
              />
            </div>

            {/* CHARGE TYPE */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Charge Type
              </label>
              <select
                className="w-full border rounded-xl h-10 px-3"
                value={rule.charge_type}
                onChange={(e) =>
                  updateRule(index, "charge_type", e.target.value)
                }
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>

            {/* CHARGE VALUE */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Charge Value
              </label>
              <Input
                type="number"
                min="0"
                placeholder="Enter value"
                value={rule.charge_value}
                onChange={(e) =>
                  updateRule(index, "charge_value", e.target.value)
                }
              />
            </div>

          </div>

        </div>
      ))}

      <Button variant="outline" onClick={addRule}>
        <Plus className="w-4 h-4 mr-2" />
        Add Cancellation Rule
      </Button>

    </div>
  );
};

export default CancellationPoliciesManager;