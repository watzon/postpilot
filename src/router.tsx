import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import RoadmapPage from './pages/RoadmapPage';
import FeaturesPage from './pages/FeaturesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/roadmap',
        element: <RoadmapPage />,
      },
      {
        path: '/features',
        element: <FeaturesPage />,
      },
    ],
  },
]); 