import { motion } from "framer-motion";
import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { FaGithub, FaLinkedin, FaEnvelope, FaPaperPlane } from "react-icons/fa";

function Contact() {
  const form = useRef();
  const [copied, setCopied] = useState(false);
  const [sending, isSending] = useState(false); 
  const [status, setStatus] = useState(null); 

  const socials = [
    {
      icon: FaGithub,
      link: "https://github.com/ronAa21"
    },
    {
      icon: FaLinkedin,
      link: "https://www.linkedin.com/in/aaron-philip-pagente-a606283a5/"
    }
  ]

  function handleCopyEmail() {
    navigator.clipboard.writeText("aaronpagente19@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function sendEmail(e) {
    e.preventDefault();
    isSending(true);

    emailjs.sendForm("service_17dz64i", "template_iq7uu1j", form.current, "uriJ2YF-eL2YRHeVa").then((result) => {
      console.log(result.text);
      setStatus('success');
      isSending(false);
      e.target.reset();
    }, (error) => {
      console.log(error.text);
      setStatus('error');
      isSending(false);
    })
  }

  if(sending) {
    return (
      <div className="bg-zinc-900/50 p-8 md:p-10 rounded-3xl border border-zinc-800 flex flex-col items-center justify-center h-[100vh] animate-pulse">
        
        <div className="w-16 h-16 border-4 border-zinc-700 border-t-teal-500 rounded-full animate-spin mb-6"></div>

        <h3 className="text-xl font-bold text-white">Sending...</h3>
        <p className="text-gray-400 text-sm mt-2">Just a moment</p>
      </div>
    );
  }

  if(status === 'success') {
    return (
    <div className="bg-zinc-900/50 p-8 md:p-10 rounded-3xl border border-zinc-800 flex flex-col items-center justify-center h-[100vh]">
      
      {/* Animated Checkmark Icon */}
      <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>

      <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
      <p className="text-gray-400 text-center max-w-xs mb-8">
        Thanks for reaching out. I'll get back to you within 24 hours.
      </p>

      {/* Button to reset and send another */}
      <button 
        onClick={() => setStatus('idle')}
        className="px-8 py-3 rounded-lg border border-zinc-700 text-sm font-bold text-white hover:bg-zinc-800 transition"
      >
        Send Another Message
      </button>
    </div>
  );
  }

  if(status === 'error') {
    return (
    <div className="bg-zinc-900/50 p-8 md:p-10 rounded-3xl border border-zinc-800 flex flex-col items-center justify-center h-[500px]">
      
      {/* Error Icon */}
      <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
      </div>

      <h3 className="text-2xl font-bold text-white mb-2">Oops!</h3>
      <p className="text-gray-400 text-center max-w-xs mb-8">
        Something went wrong sending your message. Please try again.
      </p>

      {/* Retry Button */}
      <button 
        onClick={() => setStatus('idle')} 
        className="px-8 py-3 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition"
      >
        Try Again
      </button>
    </div>
  );
  }

  return(
    <div className="bg-black text-white py-20 px-10 flex justify-center relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-[-10%] w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
        
        {/* LEFT SIDE: INFO & SOCIALS */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-gray-400 mb-2">
            Contact
          </h2>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Let's work <span className="text-teal-500">together.</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-10">
            Whether you need a full-stack web application, a redesign, or some creative video editing, 
            I'm ready to help you bring your vision to life.
          </p>

          {/* Email Copy Feature */}
          <div className="mb-10">
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-4">Email Me</h3>
            <div 
              onClick={handleCopyEmail}
              className="group flex items-center gap-3 cursor-pointer w-fit p-3 -ml-3 rounded-xl hover:bg-zinc-900 transition"
            >
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-teal-500 group-hover:bg-teal-500 group-hover:text-black transition">
                <FaEnvelope size={20} />
              </div>
              <div>
                <p className="text-xl font-medium">aaronpagente19@gmail.com</p>
                <p className="text-xs text-teal-500 h-4">
                  {copied ? "Copied to clipboard!" : "Click to copy"}
                </p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-4">Follow Me</h3>
            <div className="flex gap-4">
              {socials.map((s, i) => (
                <a key={i} href={s.link} className="w-12 h-12 border border-zinc-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-teal-500 hover:bg-teal-500/10 transition">
                  <s.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>


        {/* RIGHT SIDE: THE FORM */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-zinc-900/50 p-8 md:p-10 rounded-3xl border border-zinc-800"
        >
          <form ref={form} onSubmit={sendEmail} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Your Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe"
                  name="user_name"
                  className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Your Email</label>
                <input 
                  type="email"
                  name="user_email"
                  placeholder="john@example.com" 
                  className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Message</label>
              <textarea 
                rows="4" 
                name="message"
                placeholder="Send me an email..." 
                className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition resize-none"
              ></textarea>
            </div>

            <button 
            disabled={sending}
            className="w-full bg-teal-500 text-black font-bold py-4 rounded-lg hover:bg-teal-400 transition flex items-center justify-center gap-2 group">
              {sending ? "Sending..." : "Send Message"}
              {!sending && <FaPaperPlane className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
            </button>
          </form>
        </motion.div>

      </div>
    </div>
  )
}

export default Contact