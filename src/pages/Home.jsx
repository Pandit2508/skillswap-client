import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const sections = [
  {
    image: '/images/section1.jpg',
    title: 'Exchange skills, build connections',
    subtitle: 'DISCOVER THE PROCESS',
    description:
      "Engage in a video call, share your expertise, and learn something new. It's all about friendly exchanges in a supportive environment.",
    button: 'Get started',
  },
  {
    image: '/images/section2.jpg',
    title: 'Connect, learn, and grow',
    subtitle: "FEATURES YOU'LL LOVE",
    description:
      'Match with others, schedule a call, and dive into new skills. Our tools make learning and sharing enjoyable and personal.',
    button: 'Discover',
  },
  {
    image: '/images/section3.jpg',
    title: 'Learning through community',
    subtitle: 'OUR PROMISE',
    description:
      'Join a community where every skill is valued. Grow, make friends, and feel supported on your journey.',
    button: 'Join us',
  },
];

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white scroll-smooth">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="scroll-mt-[96px] min-h-screen flex items-center justify-center px-6 pt-[88px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl text-center"
        >
          <div className="text-sm uppercase tracking-widest font-bold text-purple-400 mb-3 text-lg">
            Share what you know, learn what you love
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Welcome to <span className="text-purple-500">SkillSwap</span>
          </h1>

          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
            A decentralized platform to barter skills, learn, and grow together —
            <br />
            <em className="text-purple-300">no money involved, just mutual growth.</em>
          </p>

          <div className="mt-8">
            <button
              onClick={() => navigate("/login")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition"
            >
              Get Started
            </button>
          </div>
        </motion.div>
      </section>

      {/* Stacked Sections */}
      {sections.map((section, idx) => {
        const isAbout = idx === 1;

        return (
          <section
            key={idx}
            id={isAbout ? 'about' : undefined}
            className={`scroll-mt-[96px] flex flex-col md:flex-row items-center justify-center px-6 py-16 gap-10 max-w-6xl mx-auto ${
              idx % 2 !== 0 ? 'md:flex-row-reverse' : ''
            }`}
            data-aos="fade-up"
          >
            <div className="md:w-1/2">
              <img
                src={section.image}
                alt="section"
                className="rounded-2xl shadow-2xl object-cover w-full h-80 md:h-[400px]"
              />
            </div>

            <div className="md:w-1/2 text-white">
              <div className="uppercase text-sm text-gray-400 font-medium mb-2">
                {section.subtitle}
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {section.title}
              </h2>

              <p className="text-gray-300 text-lg mb-6">
                {section.description}
              </p>

              <button
                onClick={() => navigate("/login")}
                className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-xl font-medium"
              >
                {section.button}
              </button>
            </div>
          </section>
        );
      })}

      {/* FAQ Section */}
      <section className="bg-zinc-900 text-white py-20 px-6" data-aos="fade-up">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get started with <br className="hidden md:block" /> skill swapping
            </h2>

            <p className="text-gray-400 mb-6 text-lg">
              Curious about how to begin your skill exchange journey? We've compiled the top
              questions to help you dive into our community with ease and enthusiasm.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="bg-purple-500 hover:bg-purple-600 px-6 py-2 rounded-full font-semibold transition duration-200"
            >
              Join us
            </button>
          </div>

          <div className="space-y-6">
            {[
              {
                question: 'How does swapping skills work?',
                answer:
                  "It's easy and fun! Share a skill you know and connect with someone eager to learn it. In return, pick up a new skill from them. All exchanges happen over video calls, so you can learn and teach from anywhere.",
              },
              {
                question: 'Is it really free?',
                answer:
                  "Absolutely! There are no fees or hidden charges. Our platform is all about sharing knowledge and building a supportive community—no payment needed.",
              },
              {
                question: 'What skills can I offer?',
                answer:
                  "Share anything you love—whether it’s baking, web design, yoga, or language learning. Every passion and talent is welcome here, and the more variety, the better for everyone.",
              },
              {
                question: 'How do I find a match?',
                answer:
                  'Browse member profiles or post what you want to learn and teach. Our platform connects you with others who share your interests, making it easy to start your next skill swap.',
              },
            ].map((faq, idx) => (
              <div key={idx}>
                <h3 className="text-xl font-semibold mb-1">{faq.question}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                <hr className="my-4 border-zinc-700" />
              </div>
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;