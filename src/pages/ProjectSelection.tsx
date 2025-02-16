import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Book, ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { Project, getProjects, deleteProject, updateProject } from '../utils/projectStorage';

function ProjectSelection() {
  const navigate = useNavigate();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState('');

  React.useEffect(() => {
    setProjects(getProjects());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这个项目吗？')) {
      deleteProject(id);
      setProjects(getProjects());
    }
  };

  const handleEdit = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(project.id);
    setEditTitle(project.title);
  };

  const handleSaveEdit = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim()) {
      updateProject(id, editTitle.trim());
      setProjects(getProjects());
      setEditingId(null);
      setEditTitle('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* 顶部导航 */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 ml-4">项目管理</h1>
        </div>

        {/* 新建项目按钮 */}
        <button
          onClick={() => navigate('/projects/new')}
          className="w-full mb-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex items-center justify-center group"
        >
          <PlusCircle className="w-6 h-6 text-purple-600 mr-2 group-hover:scale-110 transition-transform" />
          <span className="text-lg font-semibold text-gray-800">新建项目</span>
        </button>

        {/* 项目列表 */}
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              {editingId === project.id ? (
                <form onSubmit={(e) => handleSaveEdit(project.id, e)} className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="项目名称"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    保存
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    取消
                  </button>
                </form>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <Book className="w-8 h-8 text-purple-600 mr-4" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">
                        {project.title}
                      </h3>
                      <div className="flex space-x-4 text-sm text-gray-500">
                        <span>字数：{project.wordCount.toLocaleString()}</span>
                        <span>最后修改：{project.lastModified}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleEdit(project, e)}
                      className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(project.id, e)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="bg-purple-50 px-3 py-1 rounded-full">
                      <span className="text-sm text-purple-600 font-medium">继续创作</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {projects.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              还没有项目，点击上方按钮创建新项目
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectSelection;