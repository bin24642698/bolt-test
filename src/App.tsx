import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, BookText, FolderDot, Image } from 'lucide-react';

function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">知夏写作网</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 开始写作卡片 */}
          <div
            onClick={() => navigate('/projects')}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer"
          >
            <div className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors duration-300">
                <Pencil className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">开始写作</h2>
              <p className="text-gray-600">开启您的创作之旅，让灵感自由流动</p>
            </div>
          </div>

          {/* 剧情设计卡片 */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group relative">
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                <BookText className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">剧情设计</h2>
              <p className="text-gray-600">大纲、细纲、人物、世界观设计</p>
              <div className="absolute top-3 right-3 bg-yellow-100 px-2 py-1 rounded-full">
                <span className="text-xs text-yellow-800 font-medium">开发中</span>
              </div>
            </div>
          </div>

          {/* 档案管理卡片 */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group relative">
            <div className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors duration-300">
                <FolderDot className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">档案管理</h2>
              <p className="text-gray-600">高效管理您的创作档案</p>
              <div className="absolute top-3 right-3 bg-yellow-100 px-2 py-1 rounded-full">
                <span className="text-xs text-yellow-800 font-medium">开发中</span>
              </div>
            </div>
          </div>

          {/* 制作封面卡片 */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group relative">
            <div className="p-6">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors duration-300">
                <Image className="w-6 h-6 text-pink-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">制作封面</h2>
              <p className="text-gray-600">为您的作品设计精美封面</p>
              <div className="absolute top-3 right-3 bg-yellow-100 px-2 py-1 rounded-full">
                <span className="text-xs text-yellow-800 font-medium">开发中</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
