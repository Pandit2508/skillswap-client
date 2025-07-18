import React from 'react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-950 text-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center space-y-6">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold">Let's Connect</h2>
        <p className="text-gray-400 max-w-xl mx-auto text-lg">
          Reach out to us for any suggestions, feedback, or collaboration opportunities.
        </p>

        {/* Divider */}
        <div className="border-t border-zinc-700 my-8 w-full"></div>

        {/* Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand Name */}
          <div className="text-xl font-semibold text-purple-400">SkillSwap</div>

          {/* Social Icons */}
          <div className="flex justify-center items-center space-x-6 ml-20 pl-12">
            {/* Instagram */}
            <a
              href="https://instagram.com/_pandit__25"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition"
            >
              <img src="/assets/icons/instagram.png" alt="Instagram" className="w-6 h-6" />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/naman-pandit-2362642a1/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition"
            >
              <img src="/assets/icons/linkedin.png" alt="LinkedIn" className="w-6 h-6" />
            </a>

            {/* Gmail */}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=namanpandit2502@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition"
            >
              <img src="/assets/icons/gmail.png" alt="Gmail" className="w-6 h-6" />
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/pandit2508"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition"
            >
              <img src="/assets/icons/github.png" alt="GitHub" className="w-6 h-6 rounded-full" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} SkillSwap. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
