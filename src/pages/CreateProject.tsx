import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { addProject } from '../utils/projectStorage';

function CreateProject() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addProject(title.trim());
      navigate('/projects');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* 顶部导航 */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/projects')}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 ml-4">新建项目</h1>
        </div>

        {/* 创建项目表单 */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                项目名称
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 outline-none"
                placeholder="请输入项目名称"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className="px-6 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-300"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-300"
              >
                创建项目
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateProject;