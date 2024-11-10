import { motion } from 'framer-motion';
import { 
  InboxIcon, 
  SunIcon, 
  DocumentMagnifyingGlassIcon,
  DevicePhoneMobileIcon,
  CommandLineIcon,
  CursorArrowRaysIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Local SMTP Server',
    description: 'Capture and inspect outgoing emails during development with our built-in SMTP server.',
    icon: InboxIcon,
  },
  {
    name: 'Modern UI',
    description: 'Clean, responsive interface built with React and Tailwind CSS, including light/dark mode support.',
    icon: SunIcon,
  },
  {
    name: 'Multiple Preview Formats',
    description: 'View emails in different formats including HTML, Text, and Raw for comprehensive testing.',
    icon: DocumentMagnifyingGlassIcon,
  },
  {
    name: 'Responsive Testing',
    description: 'Preview how your emails look across different devices and screen sizes.',
    icon: DevicePhoneMobileIcon,
  },
  {
    name: 'Developer Tools',
    description: 'Access developer utilities like cURL export and REST API for programmatic access.',
    icon: CommandLineIcon,
  },
  {
    name: 'Smart Search',
    description: 'Powerful search capabilities to find and filter your test emails efficiently.',
    icon: CursorArrowRaysIcon,
  },
];

export default function Features() {
  return (
    <div className="py-24 sm:py-32" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Powerful Features for Social Media Management
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            PostPilot comes packed with all the tools you need to manage your social media presence effectively.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative pl-16"
              >
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
} 