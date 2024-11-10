import { motion } from 'framer-motion';
import screenshot from '../assets/images/screenshot.png';

export default function Hero() {
  return (
    <div className="relative isolate px-6 pt-12 lg:px-8">
      <div className="mx-auto max-w-7xl py-24 sm:py-32 lg:py-40">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              A Sleek Local SMTP Testing Environment
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              PostPilot simplifies email testing during development with a local SMTP server that captures outgoing emails and displays them in a modern, user-friendly interface.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="https://github.com/watzon/postpilot/releases"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Download Now
              </a>
              <a href="#features" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 flow-root sm:mt-24 max-w-[90%] mx-auto"
          >
              <img
                src={screenshot}
                alt="PostPilot interface"
                className="rounded-md shadow-2xl ring-1 ring-gray-900/10 w-full"
              />
          </motion.div>
        </div>
      </div>
    </div>
  );
} 