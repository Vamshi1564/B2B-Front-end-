import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col bg-background bg-gradient-to-br from-sky-200 via-sky-200 to-sky-200">
      <Header />

      <main className="flex-1 py-24">
        <div className="max-w-6xl mx-auto px-6">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h1 className="text-5xl font-extrabold tracking-tight">
              About B2B Partners
            </h1>
            <p className="text-muted-foreground mt-5 text-lg">
              Building modern infrastructure for smarter business collaboration.
            </p>
          </motion.div>

          {/* STORY */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex justify-center mb-20"
          >
            <Card className="p-12 rounded-3xl shadow-xl border backdrop-blur bg-background/80 max-w-5xl transition hover:shadow-2xl hover:-translate-y-1">
              <p className="leading-relaxed text-lg mb-6">
                <strong>B2B Partners</strong> is a digital platform connecting
                agents, suppliers, and enterprises into a single intelligent
                ecosystem designed for speed, clarity, and trust.
              </p>

              <p className="leading-relaxed text-muted-foreground">
                Our focus is on automation-driven workflows, transparent
                collaboration, and scalable infrastructure that helps
                businesses grow without operational friction.
              </p>
            </Card>
          </motion.div>

          {/* VALUES */}
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">

            {[
              {
                title: "Trust & Transparency",
                text:
                  "Secure systems, verified partners, and real-time tracking ensure accountability across every deal.",
              },
              {
                title: "Smart Automation",
                text:
                  "From approvals to reporting — everything is streamlined for operational efficiency.",
              },
              {
                title: "Scalable Growth",
                text:
                  "Our platform evolves with your business — from startup to enterprise scale.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              >
               <Card className="p-10 rounded-2xl shadow-lg border bg-background/80 h-full flex flex-col justify-between transition hover:shadow-xl hover:-translate-y-1">
  <h3 className="text-xl font-semibold mb-4">
    {item.title}
  </h3>

  <p className="text-muted-foreground leading-relaxed flex-1">
    {item.text}
  </p>
</Card>
              </motion.div>
            ))}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}