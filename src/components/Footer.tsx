
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <p className="text-sm text-gray-600">
              Made with Lovable showcases the best projects built using the Lovable framework.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/submit" className="hover:text-primary">Submit Project</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="https://x.com/JulienLeg78" className="hover:text-primary">Twitter</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
