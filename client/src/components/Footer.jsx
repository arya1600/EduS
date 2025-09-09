import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-[#b087cf] text-white border-t border-[#3c5f95] py-8 sm:py-12">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-8 text-center md:text-left">
        {/* EduSphere Section */}
        <div>
          <h5 className="text-lg font-bold mb-4">EduSphere</h5>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:underline hover:text-white">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h5 className="text-lg font-bold mb-4">Support</h5>
          <ul className="space-y-2">
            <li>
              <Link to="/support" className="hover:underline hover:text-white">
                Customer Support
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="text-center text-sm text-gray-200 mt-6 sm:mt-8">
        &copy; {new Date().getFullYear()} EduSphere. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
