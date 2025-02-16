export interface Project {
  id: string;
  title: string;
  lastModified: string;
  wordCount: number;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
}

const STORAGE_KEY = 'zhixia_projects';

export function getProjects(): Project[] {
  const projectsJson = localStorage.getItem(STORAGE_KEY);
  return projectsJson ? JSON.parse(projectsJson) : [];
}

export function saveProjects(projects: Project[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function addProject(title: string): Project {
  const projects = getProjects();
  const newProject: Project = {
    id: crypto.randomUUID(),
    title,
    lastModified: new Date().toISOString().split('T')[0],
    wordCount: 0,
    chapters: [],
  };
  projects.push(newProject);
  saveProjects(projects);
  return newProject;
}

export function deleteProject(id: string) {
  const projects = getProjects().filter(project => project.id !== id);
  saveProjects(projects);
}

export function updateProject(id: string, title: string) {
  const projects = getProjects().map(project => 
    project.id === id 
      ? { ...project, title, lastModified: new Date().toISOString().split('T')[0] }
      : project
  );
  saveProjects(projects);
}

export function updateProjectChapters(projectId: string, chapters: Chapter[]) {
  const projects = getProjects().map(project => 
    project.id === projectId
      ? {
          ...project,
          chapters,
          lastModified: new Date().toISOString().split('T')[0],
          wordCount: chapters.reduce((total, chapter) => total + chapter.content.length, 0),
        }
      : project
  );
  saveProjects(projects);
}