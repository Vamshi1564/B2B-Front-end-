// import React from "react";
// import { Link } from "react-router-dom";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";

// const TermsPolicy = () => {
//   const sections = [
//     {
//       id: "acceptance",
//       title: "Acceptance of Terms",
//       desc: "By accessing this website, you agree to comply with these Terms and Conditions."
//     },
//     {
//       id: "platform",
//       title: "Use of Platform",
//       desc: "Users must use this platform only for legitimate travel booking and service purposes."
//     },
//     {
//       id: "bookings",
//       title: "Bookings",
//       desc: "All bookings are subject to availability and confirmation by the respective property."
//     },
//     {
//       id: "payments",
//       title: "Payments",
//       desc: "Payments must be completed through secure payment methods available on the platform."
//     },
//     {
//       id: "partners",
//       title: "Partner Services",
//       desc: "Our platform connects users with verified resorts, hotels, villas, and travel service providers."
//     },
//     {
//       id: "responsibility",
//       title: "User Responsibilities",
//       desc: "Users must provide accurate information during registration and booking."
//     },
//     {
//       id: "liability",
//       title: "Limitation of Liability",
//       desc: "We are not responsible for service issues caused by third-party providers."
//     },
//     {
//       id: "updates",
//       title: "Policy Updates",
//       desc: "These terms may be updated periodically."
//     }
//   ];

//   return (
//     <>
//       <Header />

//       <div className="bg-gradient-to-br from-sky-100 via-white to-sky-100 py-16 px-6">
//         <div className="max-w-7xl mx-auto">

//           {/* Header */}
//           <div className="text-center mb-16">
//             <h1 className="text-4xl font-bold text-gray-800 mb-4">
//               Terms & Conditions
//             </h1>

//             <p className="text-gray-600 max-w-2xl mx-auto">
//               By accessing and using our platform, you agree to follow the terms
//               and conditions outlined below.
//             </p>
//           </div>

//           <div className="grid lg:grid-cols-4 gap-10">

//             {/* Sidebar */}
//             <div className="bg-white p-6 rounded-xl shadow-md h-fit sticky top-24">
//               <h3 className="font-semibold text-gray-700 mb-4">
//                 Terms Sections
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

//             {/* Content */}
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

//               {/* Contact */}
//               <div className="bg-blue-600 text-white p-10 rounded-xl text-center shadow-lg">
//                 <h2 className="text-2xl font-semibold mb-3">
//                   Need Help?
//                 </h2>

//                 <p className="mb-6">
//                   If you have questions regarding our terms and conditions,
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

// export default TermsPolicy;