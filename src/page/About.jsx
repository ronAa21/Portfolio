import { motion } from "framer-motion";
function About() {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return(
    <div className="bg-black text-white min-h-screen py-20 px-10 flex justify-center">
      <div className="max-w-6xl w-full">
        
        {/* Header Section */}
        <div className="mb-16">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-gray-400 mb-2">
            About Me
          </h2>
          <h1 className="text-4xl lg:text-5xl font-bold">
            More than just <span className="text-teal-500">code.</span>
          </h1>
        </div>

        {/* Main Grid Layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >

          {/* 1. The Biography Card (Spans 2 columns) */}
          <motion.div 
            variants={itemVariants} 
            className="lg:col-span-2 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 hover:border-teal-500/50 transition duration-300"
          >
            <h3 className="text-2xl font-bold mb-4 text-teal-400">My Journey</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              I began my software development journey in Grade 10, but it was in Grade 12 that I truly discovered my passion for building software.

              Although I have two years of formal experience, I’ve been exposed to coding much earlier and started developing websites during my first year in school. Over the past year, I’ve focused on deepening my skills and building real-world projects.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              I enjoy building ideas as soon as they come to mind and turning them into real, working projects. While my tech stack may not be extensive, it’s one I’m confident using and continually improving.
            </p>

            <p className="text-gray-300 leading-relaxed">
              these 4 projects displayed were created by me, this does not include the websites I created along with my school group members.
            </p>
          </motion.div>

          {/* 2. The Stats/Quick Info Card */}
          <motion.div 
            variants={itemVariants}
            className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 flex flex-col justify-center gap-6"
          >
            <div>
              <h4 className="text-4xl font-bold text-teal-500">2</h4>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Years Experience</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold text-teal-500">4</h4>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Projects Built</p>
            </div>
          </motion.div>

          {/* 3. Tech Stack (The "Full Stack" Part) */}
          <motion.div 
            variants={itemVariants}
            className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
              The Tech
            </h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'Node.js', 'Express', 'MySQL', 'HTML', 'JavaScript', 'CSS', "Render"].map((tech) => (
                <span key={tech} className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-gray-300 hover:bg-teal-500 hover:text-black transition cursor-default">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* 4. The "Creative" Card (Your Editing/CSS skills) */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-2 bg-gradient-to-br from-zinc-900 to-teal-900/20 p-8 rounded-2xl border border-zinc-800 hover:border-teal-500 transition duration-300"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4 text-white">The Creative Side</h3>
                <p className="text-gray-300 mb-6">
                  Aside from coding, I also have a hobby of editing, as I work part time on Suno for their promotion videos where I make short reel videos using their music.
                </p>
                <div className="flex gap-4">
                  {/* Examples of Creative Skills */}
                  <div className="flex items-center gap-2 text-sm text-teal-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    Video Editing
                  </div>
                  <div className="flex items-center gap-2 text-sm text-teal-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
                    Animating
                  </div>
                </div>
              </div>
              
              {/* Optional: Place a small GIF or Image related to editing here */}
              <div className="w-full md:w-48 h-32 bg-zinc-800 rounded-lg flex items-center justify-center border border-dashed border-zinc-600">
                 <span className="text-xs text-gray-500">Showreel / Edit</span>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  )
}

export default About