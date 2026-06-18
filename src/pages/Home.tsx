

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSearchBar from "@/components/HeroSearchBar";
import PropertyGrid from "@/components/PropertyGrid";
import PropertySelectionSidebar from "@/components/PropertySelectionSidebar";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { API_URL } from "@/config/api";

interface HomeProps {
  onLogout: () => void;
}

const Home = ({ onLogout }: HomeProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [showFreeProperties, setShowFreeProperties] = useState(false);
  const [states, setStates] = useState<
    { state_name: string; status: number }[]
  >([]);

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/categories`);
        const data = await res.json();
        setCategories(data);

        if (data.length > 0) {
          setActiveCategory(data[0].category_name);
        }
      } catch (error) {
        console.error("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  // ✅ Fetch states
  useEffect(() => {
    fetch(`${API_URL}/api/states`)
      .then((res) => res.json())
      .then((data) => setStates(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background py-0 bg-[#F1F3F4]">
      <Header />

      {/* HERO SEARCH BAR */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-10 pb-2"
      >
        <div className="w-[82vw] -ml-[-9vw] px-4">
          <HeroSearchBar activeCategory={activeCategory} />
        </div>
      </motion.section>

      {/* TOGGLE BUTTONS */}
      <div className="max-w-6xl mx-auto mb-2 flex gap-3 mr-14">
        <button
          onClick={() => setShowFreeProperties(false)}
          className={`w-full sm:w-auto min-w-[140px] sm:min-w-[180px] md:min-w-[532px] py-2 rounded-[8px] font-medium text-center shadow-[6px_6px_12px_rgba(0,0,0,0.25)] ${
            !showFreeProperties
              ? "bg-[#BD9828] text-white"
              : "bg-[#F8EFD8]"
          }`}
        >
          All Properties
        </button>

        <button
          onClick={() => setShowFreeProperties(true)}
          className={`w-full sm:w-auto min-w-[140px] sm:min-w-[180px] md:min-w-[543px] py-2 rounded-[8px] font-medium text-center shadow-[-6px_6px_12px_rgba(0,0,0,0.25)] mr-0 sm:mr-[-4px] md:mr-[-8px] lg:mr-[-12px] xl:mr-[-16px] ${
            showFreeProperties
              ? "bg-[#BD9828] text-white"
              : "bg-[#F8EFD8]"
          }`}
        >
          Free Properties
        </button>
      </div>

      {/* MAIN CONTENT */}
      <main
        className="flex-1 container mx-auto px-4 pb-16 mb-5"
        // style={{
        //   background:
        //     "radial-gradient(circle, rgb(90, 146, 237) 0%, rgb(76, 112, 231) 30%, rgb(15, 31, 92) 70%, rgb(10, 17, 40) 100%)",
        // }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
        >
          {/* ✅ REUSABLE SIDEBAR */}
          <PropertySelectionSidebar
            categories={categories}
            states={states}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />

          {/* PROPERTY GRID */}
          <motion.section
            key={activeCategory}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <PropertyGrid
              activeCategory={activeCategory}
              freeOnly={showFreeProperties}
            />
          </motion.section>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;