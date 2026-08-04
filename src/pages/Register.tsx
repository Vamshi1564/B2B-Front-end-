import { useState, FormEvent, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { ArrowRight, Building2, UserCircle, CheckCircle2, Plus, Trash2 } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { API_URL } from "@/config/api";

/* =========================
   REGISTER FORM COMPONENT
========================= */

const RegisterForm = ({ role }: { role: string }) => {
const [form, setForm] = useState({
  companyName: "",
  firstName: "",
  lastName: "",
  contactPerson: "",

  emails: [""],
  mobiles: [
    {
      countryCode: "+91",
      number: "",
    },
  ],

  area: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  country: "",

  supplierType: "",
  otherSupplierType: "",

  gstApplicable: "no",
  gstNumber: "",

  agentType: "",
});
const addMobile = () => {
  setForm((prev) => ({
    ...prev,
    mobiles: [
      ...prev.mobiles,
      {
        countryCode: "+91",
        number: "",
      },
    ],
  }));
};

const removeMobile = (index: number) => {
  const updated = [...form.mobiles];
  updated.splice(index, 1);

  setForm((prev) => ({
    ...prev,
    mobiles: updated,
  }));
};

const updateMobile = (
  index: number,
  field: "countryCode" | "number",
  value: string
) => {
  const updated = [...form.mobiles];
  updated[index][field] = value;

  setForm((prev) => ({
    ...prev,
    mobiles: updated,
  }));
};

const addEmail = () => {
  setForm(prev => ({
    ...prev,
    emails: [...prev.emails, ""]
  }));
};

const removeEmail = (index:number) => {
  const updated = [...form.emails];
  updated.splice(index,1);

  setForm(prev => ({
    ...prev,
    emails: updated
  }));
};

const updateEmail = (index:number,value:string) => {
  const updated = [...form.emails];
  updated[index] = value;

  setForm(prev => ({
    ...prev,
    emails: updated
  }));
};
  const [allowDuplicate, setAllowDuplicate] = useState(false);
  const nameLabel = role === "supplier" ? "Supplier Name" : "Company Name";
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [errors, setErrors] = useState<any>({});
  
  const handleChange = (field: string, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "firstName" || field === "lastName") {
        updated.contactPerson =
          `${updated.firstName} ${updated.lastName}`.trim();
      }

      return updated;
    });
  };

  const submitRegistration = async (payload: any) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    return { res, data };
  };

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   setSubmitted(true);

  //   const payload = {
  //     role,
  //     company_name: form.companyName,
  //     contact_person: form.contactPerson,
  //     email: form.email,
  //     mobile: form.mobile,
  //     city: form.city,
  //     pincode: form.pincode,
  //     country: form.country,
  //     supplier_type: form.supplierType,
  //     gst_applicable: form.gstApplicable,
  //     gst_number: form.gstNumber,
  //     agent_type: form.agentType,
  //   };

  //   const { res, data } = await submitRegistration(payload);

  //   // 🔴 Duplicate Name Handling
  //   if (res.status === 409) {
  //     toast.warning("Company name already exists.", {
  //       description: "Do you want to create a new account with the same name?",
  //       action: {
  //         label: "Create Anyway",
  //         onClick: async () => {
  //           const retryPayload = {
  //             ...payload,
  //             allow_duplicate: true,
  //           };

  //           const retry = await submitRegistration(retryPayload);

  //           if (!retry.res.ok) {
  //             toast.error(retry.data.message || "Registration failed");
  //             return;
  //           }

  //           toast.success(
  //             "Registration successful! Once admin approves your account, login credentials will be sent to your registered email.",
  //           );

  //           navigate("/login");
  //         },
  //       },
  //       cancel: {
  //         label: "Cancel",
  //         onClick: () => toast.info("Registration cancelled"),
  //       },
  //     });

  //     return;
  //   }

  //   // Normal error
  //   if (!res.ok) {
  //     toast.error(data.message || "Registration failed");
  //     return;
  //   }

  //   toast.success(
  //     "Registration successful! Once admin approves your account, login credentials will be sent to your registered email.",
  //   );

  //   navigate("/login");
  // };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
localStorage.setItem("register_role", role);
    const newErrors: any = {};
// 🔴 REQUIRED FIELDS
if (!form.companyName.trim()) {
  newErrors.companyName = role === "agent" ? "Agent name is required" : "Supplier name is required";
}


if (!form.mobiles[0]?.number.trim()) {
  newErrors.mobile_0 = "Mobile is required";
}

if (role === "agent" && !form.agentType) {
  newErrors.agentType = "Agent type is required";
}

if (role === "supplier" && !form.supplierType) {
  newErrors.supplierType = "Supplier type is required";
}
    // Object.keys(form).forEach((field) => {
    //   const message = validateField(field, (form as any)[field]);
    //   if (message) newErrors[field] = message;
    // });

// Only the required primary mobile number is format-checked. All other
// registration fields, including additional mobile and email entries, are optional.
if (
  form.mobiles[0]?.number.trim() &&
  !/^\d{10}$/.test(form.mobiles[0].number)
) {
  newErrors.mobile_0 = "Mobile must be 10 digits";
}
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
const firstErrorMessage = newErrors[firstErrorKey];

toast.error(firstErrorMessage);
      return; // 🚫 stop API call
    }



const payload = {
  role,
  company_name: form.companyName,
  contact_person: form.contactPerson,

  emails: form.emails.filter(e => e.trim() !== ""),
 mobiles: form.mobiles
  .filter((m) => m.number.trim() !== "")
  .map((m) => ({
    country_code: m.countryCode,
    mobile: m.number,
  })),

  area: form.area,
  landmark: form.landmark,
  city: form.city,
  state: form.state,
  pincode: form.pincode,
  country: form.country,

  supplier_type:
    role === "supplier"
      ? form.supplierType === "Others"
        ? form.otherSupplierType
        : form.supplierType
      : null,

  agent_type: role === "agent" ? form.agentType : null,

  gst_applicable: form.gstApplicable,
  gst_number: form.gstApplicable === "yes" ? form.gstNumber : null,
};

    const { res, data } = await submitRegistration(payload);

    // 🔴 Duplicate Name Handling
    if (res.status === 409) {
      toast.warning("Company name already exists.", {
        description: "Do you want to create a new account with the same name?",
        action: {
          label: "Create Anyway",
          onClick: async () => {
            const retryPayload = {
              ...payload,
              allow_duplicate: true,
            };

            const retry = await submitRegistration(retryPayload);

            if (!retry.res.ok) {
              toast.error(retry.data.message || "Registration failed");
              return;
            }

    toast.success("Registration submitted for admin approval.");

            navigate("/login");
          },
        },
        cancel: {
          label: "Cancel",
          onClick: () => toast.info("Registration cancelled"),
        },
      });

      return;
    }

    // Normal error
    if (!res.ok) {
  setErrors({ general: data.message }); // store error
  toast.error(data.message);
  return;
}

    toast.success("Registration submitted for admin approval.");

    navigate("/login");
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  const inputClass =
    "w-full h-11 px-3 rounded-xl border border-black text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary";

  const selectClass =
    "w-full h-11 px-3 rounded-xl border border-black text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary";

  return (
    
    <form onSubmit={handleSubmit} className="space-y-6 pt-6">

      {/* BUSINESS */}
      {/* COMPANY NAME FULL WIDTH */}
{role === "supplier" && (
 <div className="grid grid-cols-5 gap-3">

  {/* PROPERTY NAME (BIG) */}
  <div className="col-span-2">
    <Label className="text-white">Supplier Name</Label>
    <Input
      className={inputClass}
      value={form.companyName}
      onChange={(e) => handleChange("companyName", e.target.value)}
    />
  </div>

  {/* CONTACT PERSON (MEDIUM+) */}
  <div className="col-span-2">
    <Label className="text-white">Contact Person</Label>
    <Input
      className={inputClass}
      value={form.firstName}
      onChange={(e) => handleChange("firstName", e.target.value)}
    />
  </div>

  {/* SURNAME (SMALL but better than before) */}
  <div className="col-span-1">
    <Label className="text-white">Surname</Label>
    <Input
      className={inputClass}
      value={form.lastName}
      onChange={(e) => handleChange("lastName", e.target.value)}
    />
  </div>

</div>
)}

  {/* AGENT NAME */}
{role === "agent" && (
 <div className="grid grid-cols-5 gap-3">

    {/* TRAVEL AGENCY NAME (BIG) */}
    <div className="col-span-2">
      <Label className="text-white">Agent Name</Label>
      <Input
        className={inputClass}
        value={form.companyName}
        onChange={(e) => handleChange("companyName", e.target.value)}
      />
    </div>

    {/* INDIVIDUAL NAME */}
    <div className="col-span-2">
      <Label className="text-white">Individual Name</Label>
      <Input
        className={inputClass}
        value={form.firstName}
        onChange={(e) => handleChange("firstName", e.target.value)}
      />
    </div>

    {/* SURNAME */}
       <div className="col-span-1">
      <Label className="text-white">Surname</Label>
      <Input
        className={inputClass}
        value={form.lastName}
        onChange={(e) => handleChange("lastName", e.target.value)}
      />
    </div>

  </div>
)}


       
    
      {/* CONTACT */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-white">
            Email Address {" "}
          </Label>
         <div>


{form.emails.map((email, index) => (
  <div key={index} className="mt-1">

    <div className="flex items-center gap-2">

      <Input
        type="text"
        className={`${inputClass} ${
          errors[`email_${index}`] ? "border-red-500" : ""
        }`}
        value={email}
        onChange={(e) => updateEmail(index, e.target.value)}
      />

      {index === form.emails.length - 1 && (
        <button
          type="button"
          onClick={addEmail}
          className="p-2 rounded-lg bg-green-500 text-white"
        >
          +
        </button>
      )}

      {form.emails.length > 1 && (
        <button
          type="button"
          onClick={() => removeEmail(index)}
          className="p-2 rounded-lg bg-red-500 text-white"
        >
          -
        </button>
      )}

    </div>

    {/* ✅ ERROR MESSAGE MUST BE INSIDE MAP */}
    {errors[`email_${index}`] && (
      <p className="text-red-500 text-sm mt-1">
        {errors[`email_${index}`]}
      </p>
    )}

  </div>
))}
        </div>
  </div>
<div>
  <Label className="text-white">
    Mobile Number
  </Label>

{form.mobiles.map((mob, index) => (
  <div key={index} className="mt-1">

    <div className="flex items-center gap-2">

      {/* Country Code */}
     <Input
  className={`${inputClass} w-16`}
  placeholder="+91"
  value={mob.countryCode}
  onChange={(e) =>
    updateMobile(index, "countryCode", e.target.value)
  }
/>

      {/* Mobile Number */}
      <Input
        className={`flex-1 ${inputClass} ${
          errors[`mobile_${index}`] ? "border-red-500" : ""
        }`}
        value={mob.number}
        maxLength={15}
        type="tel"
        placeholder="Mobile Number"
        onChange={(e) =>
          updateMobile(
            index,
            "number",
            e.target.value.replace(/\D/g, "")
          )
        }
      />

      {index === form.mobiles.length - 1 && (
        <button
          type="button"
          onClick={addMobile}
          className="p-2 rounded-lg bg-green-500 text-white"
        >
          +
        </button>
      )}

      {form.mobiles.length > 1 && (
        <button
          type="button"
          onClick={() => removeMobile(index)}
          className="p-2 rounded-lg bg-red-500 text-white"
        >
          -
        </button>
      )}
    </div>

    {errors[`mobile_${index}`] && (
      <p className="text-red-500 text-sm mt-1">
        {errors[`mobile_${index}`]}
      </p>
    )}
  </div>
))}
</div>
      </div>

      {role === "supplier" && (
        <div className="space-y-4">
          <div>
            <Label className="text-white">Supplier Type</Label>

            <div className="grid sm:grid-cols-1 gap-3">
              <select
                className={inputClass}
                value={form.supplierType}
                onChange={(e) => handleChange("supplierType", e.target.value)}
                
              >
                <option value="">Select supplier type</option>

                {categories.map((cat) => (
                  <option key={cat.id} value={cat.category_name}>
                    {cat.category_name}
                  </option>
                ))}
              </select>

              {form.supplierType === "Others" && (
                <Input
                  placeholder="Mention Type of Supplier"
                  className={`${inputClass} text-gray-400`}
                  value={form.otherSupplierType}
                  onChange={(e) =>
                    handleChange("otherSupplierType", e.target.value)
                  }
                  
                />
              )}
            </div>
          </div>
        </div>
      )}

      {role === "agent" && (
        <div>
          <Label className="text-white">Agent Type</Label>
          <select
            className={inputClass}
            value={form.agentType}
            onChange={(e) => handleChange("agentType", e.target.value)}
            
          >
            <option value="">Select Agent Type</option>
            <option value="Domestic">Domestic</option>
            <option value="International">International</option>
          </select>
        </div>
      )}

      {(role === "agent" || role === "supplier") && (
        <div>
          <Label className="text-white">GST Number</Label>

          <div className="flex gap-3">
            {/* Dropdown - 50% */}
            <select
              className={`${selectClass} flex-1`}
              value={form.gstApplicable}
              onChange={(e) => handleChange("gstApplicable", e.target.value)}
            >
              <option value="no">Not Applicable</option>
              <option value="yes">Applicable</option>
            </select>

            {/* GST Input - 50% */}
            <Input
              placeholder="Enter GST Number"
              className={`${inputClass} flex-1 ${
                form.gstApplicable === "no"
                  ? "bg-gray-100 cursor-not-allowed"
                  : ""
              }`}
              value={form.gstNumber}
              onChange={(e) => handleChange("gstNumber", e.target.value)}
              disabled={form.gstApplicable === "no"}
            />
            {errors.gstNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.gstNumber}</p>
            )}
          </div>
        </div>
      )}

      {/* LOCATION */}
      {/* LOCATION */}
<div className="grid sm:grid-cols-2 gap-4">

  <div>
    <Label className="text-white">Area</Label>
    <Input
      className={inputClass}
      value={form.area}
      onChange={(e) => handleChange("area", e.target.value)}
    />
  </div>

  <div>
    <Label className="text-white">Landmark</Label>
    <Input
      className={inputClass}
      value={form.landmark}
      onChange={(e) => handleChange("landmark", e.target.value)}
    />
  </div>

  <div>
    <Label className="text-white">City</Label>
    <Input
      className={inputClass} 
      value={form.city}
      onChange={(e) => handleChange("city", e.target.value)}
    />
  </div>

  <div>
    <Label className="text-white">State</Label>
    <Input
      className={inputClass}
      value={form.state}
      onChange={(e) => handleChange("state", e.target.value)}
    />
  </div>

  <div>
    <Label className="text-white">Pincode</Label>
    <Input
      className={inputClass}
        
      value={form.pincode}
    maxLength={12}
    placeholder={
        form.country?.toLowerCase() === "india"
            ? "Enter 6-digit PIN Code"
            : "Enter Postal Code"
    }
    onChange={(e) => handleChange("pincode", e.target.value.toUpperCase())}
    />
    {errors.pincode && (
      <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
    )}
  </div>

  <div>
    <Label className="text-white">Country</Label>
    <Input
      className={inputClass}
      value={form.country}
      onChange={(e) => handleChange("country", e.target.value)}
    />
    {errors.country && (
      <p className="text-red-500 text-sm mt-1">{errors.country}</p>
    )}
  </div>

</div>

      <Button
        className="w-full h-12 text-white rounded-xl shadow-lg hover:opacity-90"
        style={{ backgroundColor: "#ff0000" }}
      >
        Register <ArrowRight size={16} className="ml-1" />
      </Button>

      <p className="text-xs text-yellow-300 mt-3 text-center">
  Note: If you think that your number is already registered and it is not registered by you,
  please drop a mail on{" "}
  <a
    href="mailto:support@b2bpartners.in"
    className="underline font-semibold text-yellow-400"
  >
    support@b2bpartners.in
  </a>
</p>

      <p className="text-center text-sm text-white">
        Already have an account?{" "}
        <Link to="/login" className="text-[#ff0000] font-bold">
          Sign In
        </Link>
      </p>
    </form>
  );
};

/* =========================
   MAIN REGISTER PAGE
========================= */

const Register = () => {
  const [params] = useSearchParams();
  const savedRole = localStorage.getItem("register_role");

const defaultTab =
  savedRole || (params.get("type") === "supplier" ? "supplier" : "agent");
const [activeTab, setActiveTab] = useState(defaultTab);

useEffect(() => {
  const savedRole = localStorage.getItem("register_role");

  if (savedRole && savedRole !== activeTab) {
    setActiveTab(savedRole);
  }
}, []);

  return (
    <div className="min-h-screen flex flex-col bg-background bg-gradient-to-br from-sky-200 via-sky-200 to-sky-200">
      <Header />

      <main className="flex-1 py-16">
        <div className="container mx-auto max-w-9xl grid lg:grid-cols-12 gap-10">
          {/* LEFT PANEL */}
          <div className="hidden lg:flex lg:col-span-5 flex-col space-y-10">
            <div className="space-y-4">
              <h1 className="text-5xl font-extrabold">
                Start Your <span className="text-primary">Partnership</span>
              </h1>
              <p className="text-gray-600">
                Join a verified B2B network to grow faster and smarter.
              </p>
            </div>

            {[
              { icon: Building2, title: "Business Dashboard" },
              { icon: UserCircle, title: "24/7 Support" },
              { icon: CheckCircle2, title: "Verified Network" },
            ].map(({ icon: Icon, title }) => (
              <div
                key={title}
                className="bg-[rgb(250,250,210)] p-5 rounded-xl shadow-lg border flex items-center gap-4"
              >
                <Icon />
                <p className="font-semibold">{title}</p>
              </div>
            ))}
          </div>

          {/* FORM */}
          <div className="lg:col-span-7 bg-gradient-to-r from-[#0F1F5C] via-[#1F3F93] to-[#0F1F5C] rounded-2xl shadow-2xl border p-10">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Create Account
            </h2>

            <Tabs
  value={activeTab}
  onValueChange={(val) => {
    setActiveTab(val);
    localStorage.setItem("register_role", val); // 🔥 sync immediately
  }}
>
              <TabsList className="w-full bg-muted rounded-xl flex gap-0 p-0">
                <TabsTrigger
                  value="agent"
                  className="flex-1 rounded-xl py-2.5 text-sm font-semibold data-[state=active]:bg-[#B8960B] data-[state=active]:text-primary-foreground"
                >
                  Agent
                </TabsTrigger>
                <TabsTrigger
                  value="supplier"
                  className="flex-1 rounded-xl py-2.5 text-sm font-semibold data-[state=active]:bg-[#C9A227]  data-[state=active]:text-primary-foreground"
                >
                  Supplier
                </TabsTrigger>
              </TabsList>

              <TabsContent value="agent">
                <RegisterForm role="agent" />
              </TabsContent>

              <TabsContent value="supplier">
                <RegisterForm role="supplier" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
