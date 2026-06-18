// import React from "react";
// import { Link } from "react-router-dom";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";

// const PrivacyPolicy = () => {
//   const sections = [
//     {
//       id: "info",
//       title: "Information We Collect",
//       desc: "We collect personal details such as name, email address, phone number, company information, and booking preferences when you register or use our services."
//     },
//     {
//       id: "usage",
//       title: "How We Use Your Information",
//       desc: "Your information is used to manage bookings, improve our services, provide customer support, and connect you with verified travel partners."
//     },
//     {
//       id: "payment",
//       title: "Payment Information",
//       desc: "All payments are processed through secure payment gateways. We do not store sensitive financial information such as credit or debit card numbers."
//     },
//     {
//       id: "security",
//       title: "Data Protection",
//       desc: "We use industry-standard security systems to protect your data from unauthorized access or misuse."
//     },
//     {
//       id: "sharing",
//       title: "Information Sharing",
//       desc: "Your information may be shared with trusted partners such as resorts, hotels, and service providers only to complete bookings."
//     },
//     {
//       id: "cookies",
//       title: "Cookies",
//       desc: "Our website may use cookies to enhance user experience and analyze website performance."
//     },
//     {
//       id: "rights",
//       title: "User Rights",
//       desc: "Users may request updates, corrections, or deletion of their personal information."
//     },
//     {
//       id: "updates",
//       title: "Policy Updates",
//       desc: "This Privacy Policy may be updated periodically to reflect improvements in our services."
//     }
//   ];

//   return (
//     <>
//       <Header />

//       <div className="bg-gradient-to-br from-sky-100 via-white to-sky-100 py-16 px-6">
//         <div className="max-w-7xl mx-auto">

//           {/* Page Header */}
//           <div className="text-center mb-16">
//             <h1 className="text-4xl font-bold text-gray-800 mb-4">
//               Privacy Policy
//             </h1>
//             <p className="text-gray-600 max-w-2xl mx-auto">
//               Your privacy is important to us. This page explains how we collect,
//               use, and protect your information when using our services.
//             </p>
//           </div>

//           <div className="grid lg:grid-cols-4 gap-10">

//             {/* Left Sidebar Navigation */}
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

//             {/* Right Content */}
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

//               {/* Contact Section */}
//               <div className="bg-blue-600 text-white p-10 rounded-xl text-center shadow-lg">
//                 <h2 className="text-2xl font-semibold mb-3">
//                   Have Questions?
//                 </h2>

//                 <p className="mb-6">
//                   If you have any questions regarding our privacy policy, feel free
//                   to contact our support team.
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

// export default PrivacyPolicy;