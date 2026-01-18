import { NavLink } from "react-router-dom";
function Navigation() {
const linkClasses = ({ isActive }) => 
    isActive 
      ? "text-teal-500 font-semibold transition duration-300" 
      : "text-gray-300 hover:text-teal-500 transition duration-300";

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-10 py-6 bg-black text-white">
      
      <h1 className="text-3xl font-bold tracking-wider">
        <span className="text-teal-500">A</span>ARON
      </h1>

      <div className="flex gap-10 text-sm tracking-widest self-center">
        <NavLink to="/" className={linkClasses}>HOME</NavLink>
        <NavLink to="/about" className={linkClasses}>ABOUT</NavLink>
        <NavLink to="/portfolio" className={linkClasses}>PORTFOLIO</NavLink>
        <NavLink to="/contact" className={linkClasses}>CONTACT</NavLink>
      </div>

      <div className="w-10"></div> 
    </nav>
  );
}

export default Navigation;