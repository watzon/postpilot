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
    description: 'Test your application\'s email functionality with our built-in SMTP server that captures all outgoing emails. Monitor email traffic, inspect message content, and debug email-related issues all in one place. Perfect for development and testing environments.',
    icon: InboxIcon,
    imageUrl: 'https://placehold.co/1200x675?text=Image+Coming+Soon',
    imageAlt: 'Screenshot of SMTP server dashboard showing email logs and server status',
  },
  {
    name: 'Modern UI',
    description: 'Experience a clean, responsive interface built with React and Tailwind CSS for optimal usability. Our modern design philosophy ensures that you can focus on what matters most - your email testing workflow. Enjoy smooth animations, intuitive navigation, and a consistent experience across all devices.',
    icon: SwatchIcon,
    imageUrl: 'https://placehold.co/1200x675?text=Image+Coming+Soon',
    imageAlt: 'Collection of UI components showing the modern interface design',
  },
  {
    name: 'Dark Mode Support',
    description: 'Work comfortably in any lighting condition with our built-in light and dark mode support. Every element of our interface has been carefully crafted to look perfect in both modes, ensuring optimal visibility and reducing eye strain during those late-night debugging sessions.',
    icon: SunIcon,
    imageUrl: 'https://placehold.co/1200x675?text=Image+Coming+Soon',
    imageAlt: 'Split screenshot showing the application in both light and dark modes',
  },
  {
    name: 'Multi-Format Preview',
    description: 'Preview your emails in different formats including HTML, Text, and Raw to ensure perfect rendering across all email clients. Our advanced preview system lets you catch formatting issues before they reach your users, with side-by-side comparisons and detailed rendering information.',
    icon: DevicePhoneMobileIcon,
    imageUrl: 'https://placehold.co/1200x675?text=Image+Coming+Soon',
    imageAlt: 'Email preview interface showing HTML, text, and raw format tabs with email content',
  },
  {
    name: 'Search Capabilities',
    description: 'Quickly find the emails you need with our powerful search functionality. Filter by date, content, subject, or any other email attribute. Our advanced search features include regex support and saved searches to streamline your workflow.',
    icon: MagnifyingGlassIcon,
    imageUrl: 'https://placehold.co/1200x675?text=Image+Coming+Soon',
    imageAlt: 'Search interface showing filters, results, and advanced search options',
  },
  {
    name: 'Real-time Updates',
    description: 'See incoming emails instantly with real-time updates and notifications. Never miss an important test email with our live updating interface and optional desktop notifications. Perfect for monitoring email flows in development.',
    icon: ClockIcon,
    imageUrl: 'https://placehold.co/1200x675?text=Image+Coming+Soon',
    imageAlt: 'Dashboard showing real-time email notifications and live updates',
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Powerful Features</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Everything You Need for Email Testing
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              PostPilot provides all the essential tools you need to test and debug your application's email functionality in a development environment.
            </p>
          </motion.div>

          <div className="mx-auto mt-16 max-w-7xl">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`relative space-y-48 flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-16 items-center`}
              >
                {/* Image Section */}
                <div className="lg:w-1/2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative rounded-2xl overflow-hidden shadow-2xl"
                  >
                    <div className="aspect-[16/9] bg-gray-100">
                      <img
                        src={feature.imageUrl}
                        alt={feature.imageAlt}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-transparent" />
                  </motion.div>
                </div>

                {/* Content Section */}
                <div className="lg:w-1/2 pb-16">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                      {feature.name}
                    </h3>
                  </div>
                  <p className="text-lg leading-8 text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 