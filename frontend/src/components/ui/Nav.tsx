import { Link } from "react-router-dom";
import Button from "./Button";

function Nav(){
    return (
         <nav className="flex justify-between items-center p-8 border-b-2 border-grunge-dark sticky top-0 bg-grunge-white/90 backdrop-blur z-50">
        <div className="font-display text-4xl uppercase select-none cursor-pointer hover:text-grunge-accent transition-colors">
          Void<span className="text-grunge-accent">_Talk</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/chat" className="hidden md:inline-block font-bold hover:text-grunge-accent hover:underline decoration-2 underline-offset-4 uppercase">Chat</Link>
          <Link to="/add-friends" className="hidden md:inline-block font-bold hover:text-grunge-accent hover:underline decoration-2 underline-offset-4 uppercase">Find Friends</Link>
          <Button to="/login" variant="primary" className="px-6 py-2">
            LOGIN // JOIN
          </Button>
        </div>
      </nav>
    );
}
export default Nav;