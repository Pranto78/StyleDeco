import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react"; // ⭐ Logo Icon

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen p-6 sm:p-10 flex flex-col items-center justify-center"
    >
      {/* Glass Container */}
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-md border border-blue-500/30 rounded-3xl p-8 sm:p-12 shadow-[0_0_30px_rgba(37,99,235,0.25)]">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center mb-4"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="p-4 rounded-full bg-blue-500/10 backdrop-blur-xl border border-blue-400/30 shadow-[0_0_25px_rgba(37,99,235,0.4)]"
          >
            <Sparkles
              size={48}
              className="text-blue-400 drop-shadow-[0_0_10px_rgba(37,99,235,0.8)]"
            />
          </motion.div>
        </motion.div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-center text-blue-400 drop-shadow-lg">
          About Our Decoration Service
        </h1>

        <p className="text-gray-300 mt-6 text-lg text-center leading-relaxed">
          We are a next-generation{" "}
          <span className="text-blue-400">online decoration service</span>,
          offering seamless booking, professional decorators, and stunning event
          design — all handled completely online.
        </p>

        {/* Mission Section */}
        <div className="mt-10">
          <h2 className="text-2xl text-blue-300 font-semibold mb-3">
            🎯 Our Mission
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Our mission is to modernize the event-decoration experience by
            bringing everything online — from browsing designs to hiring experts
            to final execution — making it{" "}
            <span className="text-blue-400">
              simple, transparent, and stress-free
            </span>
            .
          </p>
        </div>

        {/* Vision Section */}
        <div className="mt-8">
          <h2 className="text-2xl text-blue-300 font-semibold mb-3">
            🌟 Our Vision
          </h2>
          <p className="text-gray-300 leading-relaxed">
            We aim to become the most trusted online decoration platform in
            Bangladesh, offering premium service quality, verified decorators,
            and a fully digital booking experience — accessible to everyone.
          </p>
        </div>

        {/* What We Do Section */}
        <div className="mt-8">
          <h2 className="text-2xl text-blue-300 font-semibold mb-3">
            💼 What We Provide
          </h2>
          <ul className="text-gray-300 leading-relaxed space-y-2">
            <li>✔ Professional decorators for any event</li>
            <li>✔ 100% online booking & payment system</li>
            <li>✔ Live service tracking & communication</li>
            <li>✔ Transparent pricing with no hidden fees</li>
            <li>✔ Theme-based premium decoration packages</li>
            <li>✔ High-quality materials & creative designs</li>
          </ul>
        </div>

        {/* Why Choose Us */}
        <div className="mt-10 bg-white/5 p-6 rounded-2xl border border-blue-400/20 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
          <h2 className="text-2xl text-blue-300 font-semibold mb-3">
            💎 Why Choose Us?
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 text-gray-300">
            <p>✨ Modern & transparent online system</p>
            <p>🎨 Premium, aesthetic decoration styles</p>
            <p>🛠 Skilled & verified decorators</p>
            <p>⚡ Fast response & support</p>
            <p>📅 Easy scheduling & booking</p>
            <p>💸 Affordable & reliable pricing</p>
          </div>
        </div>

        {/* Footer Quote */}
        <p className="mt-10 text-center text-blue-300 font-medium italic text-lg">
          “We turn your special moments into unforgettable experiences.”
        </p>
      </div>
    </motion.div>
  );
};

export default About;
