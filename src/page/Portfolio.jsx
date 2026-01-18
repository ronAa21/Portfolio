import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaPlay } from "react-icons/fa";
import projectS from "../media/p-s.png";
function Portfolio() {

const mainProject = {
    title: "Project S",
    description: "An order tracking platform with real-time status updates, a cash flow management system, and a real-time chat feature that enables seamless communication between customers and managers.",
    tech: ["HTML", "CSS", "JavaScript", "Node.js", "MySQL", "Socket.io"],
    image: projectS, // Replace with your screenshot
    liveLink: "https://project-s-nhsi.onrender.com/",
    repoLink: "https://github.com/ronAa21/Project-CashFlow",
    videoLink: "#" // Optional: Showcase your editing skills here with a demo reel
  };

  // 2. THE THREE MINI PROJECTS
  const miniProjects = [
    {
      title: "Pet Adoption App",
      description: "A pet adoption app with a format of a dating app.",
      tech: ["React", "Node.js", "Tailwind", "MySQL", "Axios"],
      link: "#",
      repo: "https://github.com/ronAa21/Pet-Adoption/tree/main"
    },
    {
      title: "Notes App",
      description: "A simple notes app that highlights CRUD.",
      tech: ["HTML", "CSS", "JavaScript", "Node.js", "MySQL"],
      link: "https://first-notes.onrender.com/index.html",
      repo: "https://github.com/ronAa21/Notes-Website"
    },
    {
      title: "Library ",
      description: "A gallery site focusing on masonry layouts and also highlights the use of CRUD",
      tech: ["HTML/CSS", "JavaScript", "Node.js", "MySQL", "Grid"],
      link: "#",
      repo: "#"
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen py-20 px-10 flex justify-center">
      <div className="max-w-6xl w-full">
        
        {/* Page Header */}
        <div className="mb-16">
           <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-gray-400 mb-2">
            Portfolio
          </h2>
          <h1 className="text-4xl lg:text-5xl font-bold">
            Selected <span className="text-teal-500">Works</span>
          </h1>
        </div>

        {/* SECTION 1: THE FEATURED PROJECT (Hero Style) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="group relative bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-teal-500/50 transition-all duration-500 mb-20"
        >
          <div className="flex flex-col lg:flex-row">
            
            {/* Image Side (Takes up 60% on desktop) */}
            <div className="lg:w-3/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              <img 
                src={mainProject.image} 
                alt={mainProject.title} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
              />
            </div>

            {/* Content Side */}
            <div className="lg:w-2/5 p-10 flex flex-col justify-center space-y-6">
              <h3 className="text-teal-500 font-bold tracking-widest uppercase text-xs">Featured Project</h3>
              <h2 className="text-3xl font-bold text-white group-hover:text-teal-400 transition-colors">{mainProject.title}</h2>
              <p className="text-gray-400 leading-relaxed">
                {mainProject.description}
              </p>
              
              {/* Tech Stack Tags */}
              <div className="flex flex-wrap gap-2">
                {mainProject.tech.map((t) => (
                  <span key={t} className="px-3 py-1 bg-black rounded-full text-xs text-gray-300 border border-zinc-700">
                    {t}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <a href={mainProject.liveLink} className="flex items-center gap-2 bg-teal-500 text-black px-6 py-2 rounded-full font-bold hover:bg-teal-400 transition">
                  <FaExternalLinkAlt /> Live Demo
                </a>
                <a href={mainProject.repoLink} className="flex items-center gap-2 px-6 py-2 rounded-full border border-zinc-600 hover:border-white transition">
                  <FaGithub /> Code
                </a>
              </div>
            </div>
          </div>
        </motion.div>


        {/* SECTION 2: THE MINI PROJECTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {miniProjects.map((project, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 hover:bg-zinc-900 hover:-translate-y-2 transition duration-300 group"
            >
              <div className="flex justify-between items-start mb-6">
                 {/* Folder Icon or similar could go here */}
                 <div className="text-teal-500 text-4xl font-bold opacity-20 group-hover:opacity-100 transition">0{index + 1}</div>
                 <div className="flex gap-3">
                    <a href={project.repo} className="text-gray-400 hover:text-white"><FaGithub size={20} /></a>
                    <a href={project.link} className="text-gray-400 hover:text-teal-500"><FaExternalLinkAlt size={18} /></a>
                 </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-500 transition">{project.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tech.map((t) => (
                  <span key={t} className="text-xs text-teal-500/80 font-mono">
                    #{t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Portfolio;