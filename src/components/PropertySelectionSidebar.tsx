import { motion } from "framer-motion";
import { ChevronRight, MoveLeft } from "lucide-react";
import { useState } from "react";

type Props = {
  categories: any[];
  states: { state_name: string; status: number }[];
  activeCategory: string;
  setActiveCategory: (val: string) => void;
};

const PropertySelectionSidebar = ({
  categories,
  states,
  activeCategory,
  setActiveCategory,
}: Props) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="
    w-full max-w-[300px]
    ml-0            /* mobile */
    sm:ml-[-10px]   /* small screens */
    md:ml-[-20px]   /* tablets */
    lg:ml-[-30px]   /* laptops */
    xl:ml-[-40px]   /* large screens */
  "
    >
      {/* DESKTOP SIDEBAR */}
      <div

        // style={{ marginTop: "-55%" }}
        style={{ marginTop: "-55%" }}
        className="
hidden lg:block 
sticky
 top-[115px]
  left-[20px]
w-[300px]
rounded-2xl
margin-top 

shadow-[12px_0_20px_0_rgba(0,0,0,0.4)]
"

  // className="hidden lg:block fixed top-0 sticky rounded-2xl shadow-[12px_0_20px_0_rgba(0,0,0,0.4)]"
  // style={{ marginTop: "-55%" }}
>
        <div className="bg-[#F5E6C8] border rounded-2xl shadow-xl overflow-hidden border-2 border-black">
          {/* HEADER */}
          <div className="px-4 py-3 font-semibold text-sm tracking-wide bg-[#2F2FAA] text-white">
            Property Selection
          </div>

          {/* CATEGORY LIST */}
          <div className="p-3 space-y-2 bg-[#EED9A0]">
            {categories.map((cat) => {
              const isOpen = openCategory === cat.category_name;
              const isActive = activeCategory === cat.category_name;

              return (
                <div key={cat.id}>
                  {/* CATEGORY BUTTON */}
                  <div className="relative">
                    {isActive && (
                      <div className="absolute left-0 top-2 w-1 bg-white rounded-r-full"></div>
                    )}

                    <button
                      onClick={() => {
                        setActiveCategory(cat.category_name);
                        setOpenCategory(isOpen ? null : cat.category_name);
                      }}
                      className={`
                        w-full text-left px-4 py-3 rounded-xl font-medium flex justify-between items-center
                        transition-all duration-300 border-2 border-black
                        ${
                          isActive
                            ? "bg-[#C35A00] text-white shadow-md border-[#BD9828]"
                            : "bg-[#F8EFD8] text-gray-800 border-[#E5D3A3]"
                        }
                      `}
                    >
                      {cat.category_name}

                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* STATES DROPDOWN */}
                  {isOpen && (
                    <div className="mt-2 ml-2 max-h-[300px] overflow-y-auto">
                      {states.map((state, i) => {
                        const isInactive = state.status === 0;

                        return (
                          <div
                            key={i}
                            className={`
                              px-3 py-2 text-sm rounded-lg border mb-1 transition-all
                              ${
                                isInactive
                                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                  : "bg-[#EAF3FF] border-[#C7DBFF] text-gray-800 hover:bg-[#D6E8FF] cursor-pointer"
                              }
                            `}
                            onClick={() => {
                              if (!isInactive) {
                                setActiveCategory(cat.category_name);
                              }
                            }}
                          >
                            {state.state_name}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MOBILE (optional simple pills) */}
      <div className="lg:hidden overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max px-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.category_name)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border
                ${
                  activeCategory === cat.category_name
                    ? "bg-[#BD9828] text-white border-[#BD9828]"
                    : "bg-[#F8EFD8] border-[#E5D3A3] text-gray-800"
                }
              `}
            >
              {cat.category_name}
            </button>
          ))}
        </div>
      </div>
    </motion.aside>
  );
};

export default PropertySelectionSidebar;
