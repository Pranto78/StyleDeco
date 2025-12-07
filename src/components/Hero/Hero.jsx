import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import hero1 from '../../assets/Picture1.jpg';
import hero2 from '../../assets/Picture2.jpg';
import hero3 from '../../assets/Picture3.jpg';
import hero4 from '../../assets/Picture4.jpg';
import hero5 from '../../assets/Picture5.jpg';

const images = [hero1, hero2, hero3, hero4, hero5];

const Hero = () => {
  const [index, setIndex] = useState(0);

  // Slide interval
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000); // slide every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Sliding images */}
      <div className="flex w-full h-full">
        <motion.div
          className="flex w-full h-full"
          animate={{ x: `-${index * 100}%` }}
          transition={{ type: "tween", duration: 1 }}
        >
          {images.map((img, i) => (
            <div key={i} className="w-full h-full flex-shrink-0">
              <img
                src={img}
                alt={`hero-${i}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Overlay for text */}
      <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center px-4">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-bold text-white text-center mb-6"
        >
          Transform Your Space with Stunning Decorations!
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary-gradient text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:opacity-90 transition"
        >
          Book Decoration Service
        </motion.button>
      </div>
    </div>
  );
};

export default Hero;
