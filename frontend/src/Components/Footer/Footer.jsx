import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-white border-y">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          {/* Logo Section */}
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center">
              <img
                src="https://alexharkness.com/wp-content/uploads/2020/06/logo-2.png"
                className="mr-3 h-16"
                alt="Logo"
              />
            </Link>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">
                Pages
              </h2>
              <ul className="text-gray-500 font-medium">
                <li className="mb-4">
                  <Link to="/" className="hover:underline">Home</Link>
                </li>
                <li className="mb-4">
                  <Link to="/about" className="hover:underline">About</Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:underline">Contact</Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">
                User
              </h2>
              <ul className="text-gray-500 font-medium">
                <li className="mb-4">
                  <Link to="/login" className="hover:underline">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="hover:underline">Register</Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">
                Legal
              </h2>
              <ul className="text-gray-500 font-medium">
                <li className="mb-4">
                  <Link to="/terms" className="hover:underline">Terms & Conditions</Link>
                </li>
                <li>
                  <Link to="/policy" className="hover:underline">Privacy Policy</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />

        {/* Bottom Section */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center">
            © 2025{" "}
            <a href="https://yourportfolio.com" className="hover:underline">
              Pushkar Limje
            </a>
            . All Rights Reserved.
          </span>

          {/* Socials */}
          <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
            {/* GitHub */}
            <a
              href="https://github.com/PushkarLimje"
              className="text-gray-500 hover:text-black transition"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-github text-xl"></i>
              <span className="sr-only">GitHub</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/pushkarlimje"
              className="text-gray-500 hover:text-blue-600 transition"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-linkedin text-xl"></i>
              <span className="sr-only">LinkedIn</span>
            </a>

            {/* Dribbble */}
            <a
              href="https://dribbble.com/"
              className="text-gray-500 hover:text-pink-500 transition"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fab fa-dribbble text-xl"></i>
              <span className="sr-only">Dribbble</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
