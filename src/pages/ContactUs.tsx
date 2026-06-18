import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactUs() {
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
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
              Talk to our team
            </h1>
            <p className="text-muted-foreground mt-5 text-lg">
              Get product support, sales help, or partnership info.
            </p>
          </motion.div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-14">

            {/* INFO */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
            <Card className="p-12 rounded-3xl border backdrop-blur bg-background/80 shadow-xl flex flex-col justify-between h-full transition hover:shadow-2xl">

  <div className="space-y-10">
    <div>
      <h3 className="text-2xl font-semibold mb-2">B2B Partners</h3>
      <p className="text-muted-foreground">
        Enterprise support & onboarding
      </p>
    </div>

    <div className="space-y-6">

      <div className="flex items-center gap-4 group">
        <Mail className="w-5 h-5 text-primary group-hover:scale-110 transition" />
        <span className="font-medium">salil@sktt.in</span>
      </div>

      <div className="flex items-center gap-4 group">
        <Phone className="w-5 h-5 text-primary group-hover:scale-110 transition" />
        <span className="font-medium">+91 9820870771</span>
      </div>

      <div className="flex items-center gap-4 group">
        <MapPin className="w-5 h-5 text-primary group-hover:scale-110 transition" />
        <span className="font-medium">
          Dadar West, Mumbai – 400028
        </span>
      </div>

    </div>
  </div>

  <div className="border-t pt-6 text-sm text-muted-foreground">
    Typical response time under 24 hours
  </div>

</Card>
            </motion.div>

            {/* FORM */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Card className="p-12 rounded-3xl border backdrop-blur bg-background/80 shadow-xl flex flex-col justify-between h-full transition hover:shadow-2xl">

  <div className="space-y-6">

    <Input
      placeholder="Full name"
      className="h-12 transition focus:ring-2 focus:ring-ring"
    />

    <Input
      type="email"
      placeholder="email"
      className="h-12 transition focus:ring-2 focus:ring-ring"
    />

    <Textarea
      placeholder="Tell us about your needs..."
      className="min-h-[170px] transition focus:ring-2 focus:ring-ring"
    />

  </div>

  <Button className="w-full h-12 rounded-xl text-lg bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:opacity-90 transition-all mt-4">
    Send Message
  </Button>

</Card>
            </motion.div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}