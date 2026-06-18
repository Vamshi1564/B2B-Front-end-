import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type BankDetails = {
  account_holder: string;
  bank_name: string;
  account_number: string;
  ifsc: string;
  branch: string;
  cancelled_cheque: File | null;
};

type Props = {
  bankDetails: BankDetails;
  setBankDetails: React.Dispatch<React.SetStateAction<BankDetails>>;
};

const BankDetailsManager = ({
  bankDetails,
  setBankDetails,
}: Props) => {

  const updateField = (key: keyof BankDetails, value: any) => {
    setBankDetails(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-12">

      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold">
          Bank Details
        </h2>
        <p className="text-muted-foreground mt-2">
          Provide payout bank details for settlements.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">

        {/* ACCOUNT HOLDER */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Account Holder Name *
          </label>
          <Input
            value={bankDetails.account_holder}
            onChange={(e) =>
              updateField("account_holder", e.target.value)
            }
            placeholder="Enter account holder name"
          />
        </div>

        {/* BANK NAME */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Bank Name *
          </label>
          <Input
            value={bankDetails.bank_name}
            onChange={(e) =>
              updateField("bank_name", e.target.value)
            }
            placeholder="Enter bank name"
          />
        </div>

        {/* ACCOUNT NUMBER */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Account Number *
          </label>
          <Input
            value={bankDetails.account_number}
            onChange={(e) =>
              updateField("account_number", e.target.value)
            }
            placeholder="Enter account number"
          />
        </div>

        {/* IFSC */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            IFSC Code *
          </label>
          <Input
            value={bankDetails.ifsc}
            onChange={(e) =>
              updateField("ifsc", e.target.value.toUpperCase())
            }
            placeholder="e.g. SBIN0001234"
          />
        </div>

        {/* BRANCH */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Branch
          </label>
          <Input
            value={bankDetails.branch}
            onChange={(e) =>
              updateField("branch", e.target.value)
            }
            placeholder="Enter branch name"
          />
        </div>

        {/* CANCELLED CHEQUE UPLOAD */}
        <div className="space-y-2">
          <label className="text-sm font-semibold">
            Upload Cancelled Cheque *
          </label>
          <Input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e: any) =>
              updateField(
                "cancelled_cheque",
                e.target.files?.[0] || null
              )
            }
          />
        </div>

      </div>

    </div>
  );
};

export default BankDetailsManager;