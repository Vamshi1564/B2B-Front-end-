// import React from "react";
// import { Link } from "react-router-dom";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";

// const CancellationPolicy = () => {
//   const sections = [
//     {
//       id: "booking-cancellation",
//       title: "Booking Cancellation",
//       desc: "Bookings may be cancelled through the platform dashboard or by contacting customer support. Once the cancellation is processed, users will receive a confirmation notification."
//     },
//     {
//       id: "cancellation-timeframe",
//       title: "Cancellation Timeframe",
//       desc: "Free cancellation may be available before the specified check-in date depending on the property policy. The allowed timeframe will be shown during the booking process."
//     },
//     {
//       id: "non-refundable",
//       title: "Non-Refundable Bookings",
//       desc: "Some discounted or promotional bookings may be marked as non-refundable. These bookings cannot be cancelled for a refund after confirmation."
//     },
//     {
//       id: "refund-processing",
//       title: "Refund Processing",
//       desc: "Refunds will be processed to the original payment method used during booking. Processing time may vary depending on the bank or payment provider."
//     },
//     {
//       id: "partner-policies",
//       title: "Partner Policies",
//       desc: "Each property may have its own cancellation and refund policy. Users are advised to review the partner terms before confirming the booking."
//     },
//     {
//       id: "booking-modifications",
//       title: "Booking Modifications",
//       desc: "Changes to bookings depend on partner availability and their modification rules. Additional charges may apply if the booking details are changed."
//     },
//     {
//       id: "no-show",
//       title: "No-Show Policy",
//       desc: "Failure to check in without cancellation may result in the booking being treated as a no-show. In such cases, refunds may not be applicable."
//     },
//     {
//       id: "support",
//       title: "Support Assistance",
//       desc: "For help with cancellations or refunds, users can contact our support team anytime. We will assist you with resolving booking-related concerns."
//     }
//   ];

//   return (
//     <>
//       <Header />

//       <div className="bg-gradient-to-br from-sky-100 via-white to-sky-100 py-16 px-6">
//         <div className="max-w-7xl mx-auto">

//           <div className="text-center mb-16">
//             <h1 className="text-4xl font-bold text-gray-800 mb-4">
//               Cancellation Policy
//             </h1>

//             <p className="text-gray-600 max-w-2xl mx-auto">
//               This policy explains how cancellations, refunds, and booking
//               changes are handled on our platform.
//             </p>
//           </div>

//           <div className="grid lg:grid-cols-4 gap-10">

//             <div className="bg-white p-6 rounded-xl shadow-md h-fit sticky top-24">
//               <h3 className="font-semibold text-gray-700 mb-4">
//                 Policy Sections
//               </h3>

//               <ul className="space-y-3 text-sm">
//                 {sections.map((item) => (
//                   <li key={item.id}>
//                     <a
//                       href={`#${item.id}`}
//                       className="text-blue-600 hover:text-blue-800"
//                     >
//                       {item.title}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div className="lg:col-span-3 space-y-10">
//               {sections.map((item) => (
//                 <div
//                   key={item.id}
//                   id={item.id}
//                   className="bg-white p-8 rounded-xl shadow-md border"
//                 >
//                   <h2 className="text-xl font-semibold text-blue-600 mb-3">
//                     {item.title}
//                   </h2>

//                   <p className="text-gray-600 leading-relaxed">
//                     {item.desc}
//                   </p>
//                 </div>
//               ))}

//               <div className="bg-blue-600 text-white p-10 rounded-xl text-center shadow-lg">
//                 <h2 className="text-2xl font-semibold mb-3">
//                   Need Help?
//                 </h2>

//                 <p className="mb-6">
//                   If you need assistance with booking cancellations or refunds,
//                   please contact our support team.
//                 </p>

//                 <Link
//                   to="/contact"
//                   className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
//                 >
//                   Contact Support
//                 </Link>
//               </div>
//             </div>

//           </div>

//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default CancellationPolicy;