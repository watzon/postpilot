import { motion } from 'framer-motion';
import { 
  InboxIcon, 
  SwatchIcon,
  SunIcon,
  DevicePhoneMobileIcon,
  MagnifyingGlassIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Local SMTP Server',
    description: 'Test your application\'s email functionality with our built-in SMTP server that captures all outgoing emails.',
    icon: InboxIcon,
  },
  {
    name: 'Modern UI',
    description: 'Experience a clean, responsive interface built with React and Tailwind CSS for optimal usability.',
    icon: SwatchIcon,
  },
  {
    name: 'Dark Mode Support',
    description: 'Work comfortably in any lighting condition with our built-in light and dark mode support.',
    icon: SunIcon,
  },
  {
    name: 'Multi-Format Preview',
    description: 'Preview your emails in different formats including HTML, Text, and Raw to ensure perfect rendering.',
    icon: DevicePhoneMobileIcon,
  },
  {
    name: 'Search Capabilities',
    description: 'Quickly find the emails you need with our powerful search functionality.',
    icon: MagnifyingGlassIcon,
  },
  {
    name: 'Real-time Updates',
    description: 'See incoming emails instantly with real-time updates and notifications.',
    icon: ClockIcon,
  },
];

export default function Features() {
  return (
    <div className="py-24 sm:py-32" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Core Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything You Need for Email Testing
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            PostPilot provides all the essential tools you need to test and debug your application's email functionality in a development environment.
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