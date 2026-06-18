// import { useState } from "react";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import PropertyGallery from "@/components/supplier/PropertyGallery";
// import PricingManager from "@/components/supplier/PricingManager";
// import PropertyPolicies from "@/components/supplier/PropertyPolicies";
// import { Textarea } from "@/components/ui/textarea";
// import { getUser } from "@/utils/auth";
// import { API_URL } from "@/config/api";

// const CATEGORIES = [
//   "Hotels",
//   "Bungalow / Villa",
//   "Home Stay",
//   "One Day Picnic",
//   "Car Rental",
//   "Forex",
//   "Insurance",
//   "Consultancies",
//   "Airlines",
// ];

// const TABS = [
//   "Property Details",
//   "Staff Details",
//   "Price",
//   "Photos & Videos",
//   "Amenities",
//   "Sight Seeing",
//   "Q & A",
//   "Booking Policies",
//   "Cancellation Policies",
//   "Check In / Check Out",
//   "Bank Details",
// ];


// // ✅ MOVE TYPES OUTSIDE COMPONENT
// type RatePlan = {
//   plan: "CP" | "MAP" | "AP";
//   weekday: string;
//   weekend: string;
//   longWeekend: string;
//   extraAdult: string;
//   childWithBed: string;
//   childWithoutBed: string;
// };

// type Room = {
//   type: string;
//   max_adults: string;
//   max_children: string;
//   ratePlans: RatePlan[];
// };

// const defaultPlan = (plan: "CP" | "MAP" | "AP"): RatePlan => ({
//   plan,
//   weekday: "",
//   weekend: "",
//   longWeekend: "",
//   extraAdult: "",
//   childWithBed: "",
//   childWithoutBed: "",
// });

// const AddProperty = () => {

//  const [activeTab, setActiveTab] = useState(0);

//   const [images, setImages] = useState<File[]>([]);
//   const [coverIndex, setCoverIndex] = useState<number | null>(null);

//   const [rooms, setRooms] = useState<Room[]>([
//     {
//       type: "",
//       max_adults: "",
//       max_children: "",
//       ratePlans: [
//         defaultPlan("CP"),
//         defaultPlan("MAP"),
//         defaultPlan("AP"),
//       ],
//     },
//   ]);

//   const [policies, setPolicies] = useState({
//     booking: "",
//     cancellation: "",
//     terms: "",
//   });

//   const [form, setForm] = useState({
//     name: "",
//     category: "",
//     city: "",
//     area: "",
//     pincode: "",
//     address: "",
//     landmark: "",
//     contact: "",
//     email: "",
//   });

//   const handleChange = (key: string, value: string) => {
//     setForm(prev => ({ ...prev, [key]: value }));
//   };

//   // ✅ FINAL SUBMIT
//   const submitProperty = async () => {
//     try {

//       const user = getUser();
//       if (!user) {
//         alert("Please login again");
//         return;
//       }

//       const formData = new FormData();

//       Object.entries(form).forEach(([key, value]) => {
//         formData.append(key, value);
//       });

//       formData.append("supplier_id", String(user.id));
//       formData.append("rooms", JSON.stringify(rooms));
//       formData.append("policies", JSON.stringify(policies));
//       formData.append("coverIndex", String(coverIndex ?? 0));

//       images.forEach(img => {
//         formData.append("images", img);
//       });

//       const res = await fetch(
//         `${API_URL}/api/properties/add-property`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || "Failed to save property");
//         return;
//       }

//       alert("Property saved successfully!");

//       // ✅ Reset Form
//       setStep(1);
//       setImages([]);
//       setCoverIndex(null);
//       setRooms([
//         {
//           type: "",
//           max_adults: "",
//           max_children: "",
//           ratePlans: [
//             defaultPlan("CP"),
//             defaultPlan("MAP"),
//             defaultPlan("AP"),
//           ],
//         },
//       ]);
//       setPolicies({ booking: "", cancellation: "", terms: "" });

//     } catch (error) {
//       console.error(error);
//       alert("Server error");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Header />

//       <main className="flex-1 py-16 px-6">
//         <div className="max-w-5xl mx-auto space-y-12">

//           {/* STEP BAR */}
//          <div className="flex overflow-x-auto border-b mb-8">
//   {TABS.map((tab, index) => (
//     <button
//       key={tab}
//       onClick={() => setActiveTab(index)}
//       className={`
//         px-6 py-3 text-sm font-medium whitespace-nowrap
//         border-b-2 transition
//         ${
//           activeTab === index
//             ? "border-primary text-primary"
//             : "border-transparent text-muted-foreground hover:text-black"
//         }
//       `}
//     >
//       {tab}
//     </button>
//   ))}
// </div>

//           {/* STEP CONTENT */}
//           {activeTab === 0 && (
//   <div>
//     {/* Property Details Component */}
//     <PropertyDetails
//       form={form}
//       handleChange={handleChange}
//       setActiveTab={setActiveTab}
//     />
//                 <div className="bg-white rounded-3xl border shadow-xl p-12 space-y-10">

//   {/* SECTION HEADER */}
//   <div>
//     <h2 className="text-3xl font-bold">
//       Property Information
//     </h2>
//     <p className="text-muted-foreground mt-2">
//       Enter the basic details of your property
//     </p>
//   </div>

//   {/* FORM GRID */}
//   <div className="grid md:grid-cols-2 gap-8">

//     {/* PROPERTY NAME */}
//     <div className="space-y-2">
//       <label className="text-sm font-semibold">
//         Property Name <span className="text-red-500">*</span>
//       </label>
//       <Input
//         placeholder="e.g. Grand Palace Hotel"
//         onChange={e => handleChange("name", e.target.value)}
//         className="h-12 rounded-xl"
//       />
//     </div>

//     {/* CATEGORY */}
//     <div className="space-y-2">
//       <label className="text-sm font-semibold">
//         Category <span className="text-red-500">*</span>
//       </label>
//       <select
//         className="h-12 w-full rounded-xl border px-4 bg-background"
//         onChange={e => handleChange("category", e.target.value)}
//       >
//         <option value="">Select Category</option>
//         {CATEGORIES.map(c => (
//           <option key={c}>{c}</option>
//         ))}
//       </select>
//     </div>

//     {/* CITY */}
//     <div className="space-y-2">
//       <label className="text-sm font-semibold">
//         City <span className="text-red-500">*</span>
//       </label>
//       <Input
//         placeholder="Enter city"
//         onChange={e => handleChange("city", e.target.value)}
//         className="h-12 rounded-xl"
//       />
//     </div>

//     {/* AREA */}
//     <div className="space-y-2">
//       <label className="text-sm font-semibold">
//         Area
//       </label>
//       <Input
//         placeholder="Locality / Area"
//         onChange={e => handleChange("area", e.target.value)}
//         className="h-12 rounded-xl"
//       />
//     </div>

//     {/* PINCODE */}
//     <div className="space-y-2">
//       <label className="text-sm font-semibold">
//         Pincode
//       </label>
//       <Input
//         placeholder="6 digit pincode"
//         onChange={e => handleChange("pincode", e.target.value)}
//         className="h-12 rounded-xl"
//       />
//     </div>

//     {/* LANDMARK */}
//     <div className="space-y-2">
//       <label className="text-sm font-semibold">
//         Landmark
//       </label>
//       <Input
//         placeholder="Nearby landmark"
//         onChange={e => handleChange("landmark", e.target.value)}
//         className="h-12 rounded-xl"
//       />
//     </div>

//     {/* ADDRESS */}
//     <div className="md:col-span-2 space-y-2">
//       <label className="text-sm font-semibold">
//         Full Address
//       </label>
//       <Textarea
//         placeholder="Complete address of the property"
//         onChange={e => handleChange("address", e.target.value)}
//         className="rounded-xl min-h-[100px]"
//       />
//     </div>

//     {/* CONTACT */}
//     <div className="space-y-2">
//       <label className="text-sm font-semibold">
//         Contact Number
//       </label>
//       <Input
//         placeholder="e.g. 9876543210"
//         onChange={e => handleChange("contact", e.target.value)}
//         className="h-12 rounded-xl"
//       />
//     </div>

//     {/* EMAIL */}
//     <div className="space-y-2">
//       <label className="text-sm font-semibold">
//         Email Address
//       </label>
//       <Input
//         placeholder="example@email.com"
//         onChange={e => handleChange("email", e.target.value)}
//         className="h-12 rounded-xl"
//       />
//     </div>

//   </div>

//   {/* CTA BUTTON */}
//   <div className="pt-6 border-t">
//     <Button
//       onClick={() => setStep(2)}
//       className="w-full h-14 text-lg rounded-xl shadow-md"
//     >
//       Continue to Room Setup →
//     </Button>
//   </div>

// </div>
//   </div>
// )}

//           )}

//           {step === 2 && (
//             <PropertyGallery
//               images={images}
//               setImages={setImages}
//               coverIndex={coverIndex}
//               setCoverIndex={setCoverIndex}
//               onNext={() => setStep(3)}
//             />
//           )}

//           {step === 3 && (
//             <PricingManager
//               rooms={rooms}
//               setRooms={setRooms}
//               onNext={() => setStep(4)}
//             />
//           )}

//           {step === 4 && (
//             <PropertyPolicies
//               policies={policies}
//               setPolicies={setPolicies}
//               onPublish={submitProperty}
//             />
//           )}

//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// };



// export default AddProperty;