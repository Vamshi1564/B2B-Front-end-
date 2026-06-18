import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getUser } from "@/utils/auth";
import { API_URL } from "@/config/api";
import { useNavigate } from "react-router-dom";
import PropertyDetails from "@/components/supplier/PropertyDetails";
import StaffManager from "@/components/supplier/StaffManager";
import PricingManager from "@/components/supplier/PricingManager";
import MediaManager from "@/components/supplier/MediaManager";
import AmenitiesManager from "@/components/supplier/AmenitiesManager";
import SightSeeingManager from "@/components/supplier/SightSeeingManager";
import QAManager from "@/components/supplier/QAManager";
import BookingPoliciesManager from "@/components/supplier/BookingPoliciesManager";
import CancellationPoliciesManager from "@/components/supplier/CancellationPoliciesManager";
import CheckinManager from "@/components/supplier/CheckinManager";
import BankDetailsManager from "@/components/supplier/BankDetailsManager";
import { toast } from "sonner";
import {
  Building2,
  Users,
  IndianRupee,
  Image,
  Sparkles,
  Map,
  HelpCircle,
  FileText,
  Ban,
  Clock,
  Landmark
} from "lucide-react";

const TABS = [
  { label: "Property Details", icon: Building2 },        // 0
  { label: "Staff Details", icon: Users },               // 1
  { label: "Price", icon: IndianRupee },                 // 2
  { label: "Photos & Videos", icon: Image },             // 3
  { label: "Amenities", icon: Sparkles },                // 4
  { label: "Sight Seeing", icon: Map },                  // 5
  { label: "Q & A", icon: HelpCircle },                  // 6
  { label: "Booking Policies", icon: FileText },         // 7
  { label: "Cancellation Policies", icon: Ban },         // 8
  { label: "Check In / Check Out", icon: Clock },        // 9
  { label: "Bank Details", icon: Landmark },             // 10
];
const STEPS = [
  "Property",
  "Staff",
  "Price",
  "Media",
  "Amenities",
  "Policies",
  "Bank",
];
const AddProperty = () => {

  const [activeTab, setActiveTab] = useState(0);

  // -------------------- BASIC DETAILS --------------------
const [form, setForm] = useState({
  name: "",
  category: "",
  state: "",
  city: "",
  area: "",
  pincode: "",
  address: "",
  landmark: "",
  contact: "",
  email: "",
  total_rooms: "",
  hotel_remarks: ""
});

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // -------------------- STATES --------------------
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [coverIndex, setCoverIndex] = useState<number | null>(null);
  const [staff, setStaff] = useState<any[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [sightseeing, setSightSeeing] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any>({});
  const [cancellationRules, setCancellationRules] = useState<any[]>([]);
  const [checkinData, setCheckinData] = useState<any>({});
  const [certificate, setCertificate] = useState<File | null>(null);
  const [bankDetails, setBankDetails] = useState<any>({
    account_holder: "",
    bank_name: "",
    account_number: "",
    ifsc: "",
    branch: "",
    cancelled_cheque: null,
  });
const nextTab = () => {
  if (activeTab < TABS.length - 1) {
    setActiveTab(prev => prev + 1);
  }
};

const prevTab = () => {
  if (activeTab > 0) {
    setActiveTab(prev => prev - 1);
  }
};
  // -------------------- SUBMIT --------------------

  const submitProperty = async () => {

    try {

      const user = getUser();
      if (!user) {
      toast.error("Please login again");
      return;
    }

      const formData = new FormData();

      // Basic
      Object.entries(form).forEach(([k, v]) =>
        formData.append(k, v as string)
      );

      formData.append("supplier_id", String(user.id));
      formData.append("rooms", JSON.stringify(rooms));
      formData.append("staff", JSON.stringify(staff));
      formData.append("amenities", JSON.stringify(amenities));
      formData.append("coverIndex", String(coverIndex ?? 0));
      formData.append("sightseeing", JSON.stringify(sightseeing));
      formData.append("faqs", JSON.stringify(faqs));
      formData.append("policies", JSON.stringify(policies));
      formData.append("cancellation_rules", JSON.stringify(cancellationRules));
      formData.append("checkin_data", JSON.stringify(checkinData));
      

      if (certificate) {
        formData.append("certificate", certificate);
        }
      // Images
      images.forEach(img =>
        formData.append("images", img)
      );

      // Videos
      videos.forEach(video =>
        formData.append("videos", video)
      );

      // Staff Photos
      staff.forEach(member => {
        if (member.photo) {
          formData.append("staffPhotos", member.photo);
        }
      });

      // Bank Details
      formData.append("bank_details", JSON.stringify({
        account_holder: bankDetails.account_holder,
        bank_name: bankDetails.bank_name,
        account_number: bankDetails.account_number,
        ifsc: bankDetails.ifsc,
        branch: bankDetails.branch,
      }));

      if (bankDetails.cancelled_cheque) {
        formData.append("cancelledCheque", bankDetails.cancelled_cheque);
      }

      const res = await fetch(
        `${API_URL}/api/properties/add-property`,
        { method: "POST", body: formData }
      );

      const data = await res.json();
      if (!res.ok) {
      toast.error(data.message || "Failed to create property");
      return;
    }

    toast.success("Property created successfully 🎉");

    setTimeout(() => {
      navigate("/supplier/dashboard");
    }, 1200);

  } catch (err) {
    toast.error("Server error");
  } finally {
    setSubmitting(false);
  }
};
useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [activeTab]);
  // -------------------- UI --------------------

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-10 px-6">
        <div className="max-w-7xl mx-auto">
<div className="relative mb-10">

  {/* Progress Line Background */}
  <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded"></div>

  {/* Animated Progress */}
  <div
    className="absolute top-5 left-0 h-1 bg-[#bd9828] rounded transition-all duration-500 ease-out"
    style={{
      width: `${(activeTab / (TABS.length - 1)) * 100}%`
    }}
  />

  <div className="flex justify-between items-start mx-2">

    {TABS.map((tab, index) => {
      const Icon = tab.icon;

      return (
        <button
          key={tab.label}
          onClick={() => setActiveTab(index)}
          className="flex flex-col items-center relative z-10 group"
        >

          {/* Step Circle */}
     <div
  className={`
    w-11 h-11 flex items-center justify-center rounded-2xl border
    transition-all duration-300 font-semibold
    ${
      activeTab >= index
        ? "bg-[#bd9828] text-white scale-105 border-[#bd9828] shadow-[0_4px_10px_rgba(184,134,11,0.45),0_0_10px_rgba(184,134,11,0.35)]"
        : "bg-gray-200 text-primary group-hover:shadow-[0_0_8px_rgba(184,134,11,0.35)]"
    }
  `}
>
  <Icon size={18} />
</div>

          {/* Label */}
          <span
            className={`
              text-xs mt-2 text-center font-medium transition
              ${
                activeTab === index
                  ? "text-[#bd9828] font-semibold"
                  : "text-black-500 group-hover:text-[#bd9828] font-semibold"
              }
            `}
          >
            {tab.label}
          </span>

        </button>
      );
    })}

  </div>

</div>

          {/* TAB CONTENT */}
          <div
  key={activeTab}
  className="bg-white rounded-3xl shadow-xl p-10 animate-tab"
>

            {activeTab === 0 && (
<PropertyDetails
  form={form}
  handleChange={handleChange}
  setCertificate={setCertificate}
/>
            )}

            {activeTab === 1 && (
              <StaffManager staff={staff} setStaff={setStaff} />
            )}

            {activeTab === 2 && (
              <PricingManager
                rooms={rooms}
                setRooms={setRooms}
                onNext={() => setActiveTab(3)}
              />
            )}

            {activeTab === 3 && (
              <MediaManager
                images={images}
                setImages={setImages}
                coverIndex={coverIndex}
                setCoverIndex={setCoverIndex}
                videos={videos}
                setVideos={setVideos}
              />
            )}

            {activeTab === 4 && (
              <AmenitiesManager
                amenities={amenities}
                setAmenities={setAmenities}
              />
            )}

            {activeTab === 5 && (
              <SightSeeingManager
                sightseeing={sightseeing}
                setSightSeeing={setSightSeeing}
              />
            )}

            {activeTab === 6 && (
              <QAManager faqs={faqs} setFaqs={setFaqs} />
            )}

            {activeTab === 7 && (
              <BookingPoliciesManager
                policies={policies}
                setPolicies={setPolicies}
              />
            )}

            {activeTab === 8 && (
              <CancellationPoliciesManager
                rules={cancellationRules}
                setRules={setCancellationRules}
              />
            )}

            {activeTab === 9 && (
              <CheckinManager
                checkinData={checkinData}
                setCheckinData={setCheckinData}
              />
            )}

            {activeTab === 10 && (
              <BankDetailsManager
                bankDetails={bankDetails}
                setBankDetails={setBankDetails}
              />
            )}

            {/* FINAL SUBMIT BUTTON */}
           <div className="mt-10 flex justify-between">

  {/* Previous Button */}
  {activeTab > 0 && (
    <button
      onClick={prevTab}
      className="px-6 py-3 rounded-xl border"
    >
      ← Previous
    </button>
  )}

  {/* Next / Submit Button */}
  {activeTab < TABS.length - 1 ? (
    <button
      onClick={nextTab}
      className="ml-auto bg-primary text-white px-8 py-3 rounded-xl"
    >
      Save & Continue →
    </button>
  ) : (
    <button
  onClick={submitProperty}
  disabled={submitting}
  className={`w-full py-4 rounded-xl text-lg font-semibold transition 
    ${submitting 
      ? "bg-gray-400 cursor-not-allowed" 
      : "bg-primary text-white hover:opacity-90"
    }`}
>
  {submitting ? (
    <span className="flex items-center justify-center gap-2">
      <svg
        className="animate-spin h-5 w-5"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="white"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="white"
          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a10 10 0 00-10 10h4z"
        />
      </svg>
      Submitting...
    </span>
  ) : (
    "Submit Property"
  )}
</button>
  )}

</div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddProperty;