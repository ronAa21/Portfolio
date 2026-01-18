import profile from "../media/profile.png"
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

function Home() {
  return(
    <div className="bg-black text-white min-h-screen flex items-center justify-center px-10 overflow-hidden relative">
      
      {/* Background Element: A subtle gradient blob to break the solid black flatness */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center w-full max-w-6xl gap-10 relative z-10">
        
        {/* Left Side: Text - Animated Container */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 space-y-5 text-center lg:text-left"
        >
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-gray-400">
            Hello!
          </h2>

          <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
            I'm <span className="text-teal-500">Aaron Pagente</span>
          </h1>

          {/* DYNAMIC TYPING EFFECT */}
          <h4 className="text-2xl text-teal-500 font-medium h-8">
            <TypeAnimation
              sequence={[
                'Full-stack Developer',
                2000,
                'Building Web Apps',
                2000,
                'Crafting Visuals',
                2000
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </h4>

          <p className="text-gray-400 max-w-lg text-lg leading-relaxed mx-auto lg:mx-0">
            A full-stack developer passionate about building clean, efficient, and 
            user-friendly web applications. I enjoy working across the entire stack 
            and bringing ideas to life.
          </p>
        </motion.div>

        {/* Right Side: Floating Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex justify-center relative"
        >
          {/* The Glow */}
          <div className="absolute inset-0 bg-teal-500 blur-3xl opacity-20 rounded-full scale-90 animate-pulse"></div>
          
          {/* The Image with "Floating" Animation */}
          <motion.img 
            animate={{ y: [0, -15, 0] }} // Moves up 15px then down
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            src={profile} 
            alt="Aaron Pagente" 
            className="relative w-80 h-80 lg:w-[400px] lg:h-[400px] object-cover rounded-full border-4 border-teal-500 shadow-2xl" 
          />
        </motion.div>

      </div>
    </div>
  )
}

export default Home;