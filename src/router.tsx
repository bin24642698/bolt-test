import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import ProjectSelection from './pages/ProjectSelection';
import CreateProject from './pages/CreateProject';
import Editor from './pages/Editor';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/projects',
    element: <ProjectSelection />,
  },
  {
    path: '/projects/new',
    element: <CreateProject />,
  },
  {
    path: '/projects/:projectId',
    element: <Editor />,
  },
]);