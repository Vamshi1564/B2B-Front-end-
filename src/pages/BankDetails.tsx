import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BankDetails = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-200 via-sky-200 to-sky-300">
      <Header />

      <div className="flex-1 px-4 py-10">
        <div className="max-w-7xl mx-auto">

          <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
            Bank, GST & Payment Details
          </h2>

          <div className="grid lg:grid-cols-2 gap-10">

            {/* LEFT SIDE */}
            <div className="space-y-6">

              {/* GST CARD */}
              <div className="bg-muted rounded-2xl shadow-md p-6 border">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">
                  GST Details
                </h3>

                <div className="space-y-2 text-sm text-gray-700">
                  <p><span className="font-semibold">GSTIN:</span> 27ACBPK7532L1ZE</p>
                  <p><span className="font-semibold">Legal Name:</span> ANJALI SALIL KARULKAR</p>
                  <p><span className="font-semibold">Trade Name:</span> B2B PARTNERS</p>
                  <p><span className="font-semibold">Business Type:</span> Proprietorship</p>

                  <p>
                    <span className="font-semibold">Address:</span><br />
                    3RD FLOOR, 4/29 PARIJAT, Makarand Society,<br />
                    Senapati Bapat Marg, Dadar West,<br />
                    Mumbai - 400028
                  </p>
                </div>
              </div>

              {/* BANK CARD */}
              <div className="bg-muted rounded-2xl shadow-md p-6 border">
                <h3 className="text-xl font-semibold text-green-600 mb-4">
                  Bank Account Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                  <p><span className="font-semibold">Bank:</span> Saraswat Bank</p>
                  <p><span className="font-semibold">Branch:</span> Dadar West</p>
                  <p><span className="font-semibold">Account Name:</span> B2B PARTNERS</p>
                  <p><span className="font-semibold">IFSC:</span> SRCB0000471</p>

                  <p className="col-span-2">
                    <span className="font-semibold">Account No:</span> CAELT/610000000063592
                  </p>

                  <p><span className="font-semibold">MICR:</span> 400088156</p>
                  <p><span className="font-semibold">GST Linked:</span> 27ACBPK7532L1ZE</p>
                </div>
              </div>

              {/* UPI CARD */}
              <div className="bg-muted rounded-2xl shadow-md p-6 border">
                <h3 className="text-xl font-semibold text-red-600 mb-4">
                  UPI / GPay Details
                </h3>

                <div className="space-y-2 text-sm text-gray-700">
                  <p><span className="font-semibold">GPay Number:</span> 9820870771</p>
                  <p><span className="font-semibold">GPay Name:</span> Mr Salil Karulkar</p>
                </div>
              </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="flex justify-center items-center">

              <div className="bg-muted rounded-3xl shadow-lg p-6 text-center w-full max-w-sm border">

                {/* Profile */}
                <div className="flex items-center gap-3 justify-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <h4 className="font-semibold text-lg">
                    Salil Karulkar
                  </h4>
                </div>

                {/* QR */}
                <div className="bg-white rounded-2xl p-4">
                  <img
                    src="/qr-code.png"
                    alt="QR Code"
                    className="w-full rounded-xl"
                  />
                </div>

                <p className="mt-4 text-sm text-gray-600">
                  Scan to pay with any UPI app
                </p>

                <p className="mt-2 font-medium text-gray-800">
                  salil.sktours@okhdfcbank
                </p>

                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Copy UPI ID
                </button>

              </div>

            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BankDetails;