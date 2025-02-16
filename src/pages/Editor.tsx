import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, GripVertical, Trash2, Wand2, BookOpen, Map, ArrowUpDown } from 'lucide-react';
import { getProjects, updateProjectChapters, type Chapter } from '../utils/projectStorage';
import { AIWritingPanel } from '../components/AIWritingPanel';
import { ChapterAnalysisPanel } from '../components/ChapterAnalysisPanel';

function Editor() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = React.useState(
    getProjects().find(p => p.id === projectId)
  );
  const [chapters, setChapters] = React.useState<Chapter[]>(
    project?.chapters || []
  );
  const [selectedChapter, setSelectedChapter] = React.useState<Chapter | null>(null);
  const [isAscending, setIsAscending] = React.useState(true);
  const [isAIWritingOpen, setIsAIWritingOpen] = React.useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = React.useState(false);

  React.useEffect(() => {
    if (!project) {
      navigate('/projects');
    } else if (chapters.length > 0) {
      setSelectedChapter(chapters[0]);
    }
  }, [project, navigate]);

  const handleAddChapter = () => {
    const newChapter: Chapter = {
      id: crypto.randomUUID(),
      title: `第${chapters.length + 1}章`,
      content: '',
      order: chapters.length,
    };
    const updatedChapters = [...chapters, newChapter];
    setChapters(updatedChapters);
    setSelectedChapter(newChapter);
    if (projectId) {
      updateProjectChapters(projectId, updatedChapters);
    }
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (window.confirm('确定要删除这个章节吗？')) {
      const updatedChapters = chapters
        .filter(ch => ch.id !== chapterId)
        .map((ch, index) => ({ ...ch, order: index }));
      setChapters(updatedChapters);
      if (selectedChapter?.id === chapterId) {
        setSelectedChapter(updatedChapters[0] || null);
      }
      if (projectId) {
        updateProjectChapters(projectId, updatedChapters);
      }
    }
  };

  const handleUpdateChapter = (chapterId: string, updates: Partial<Chapter>) => {
    const updatedChapters = chapters.map(ch =>
      ch.id === chapterId ? { ...ch, ...updates } : ch
    );
    setChapters(updatedChapters);
    if (selectedChapter?.id === chapterId) {
      setSelectedChapter({ ...selectedChapter, ...updates });
    }
    if (projectId) {
      updateProjectChapters(projectId, updatedChapters);
    }
  };

  const toggleOrder = () => {
    setIsAscending(!isAscending);
    const sortedChapters = [...chapters].sort((a, b) => 
      isAscending ? b.order - a.order : a.order - b.order
    );
    setChapters(sortedChapters);
  };

  const sortedChapters = React.useMemo(() => 
    [...chapters].sort((a, b) => 
      isAscending ? a.order - b.order : b.order - a.order
    ), [chapters, isAscending]
  );

  if (!project) return null;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/projects')}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">{project.title}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAIWritingOpen(true)}
            className="p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50">
            <Wand2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsAnalysisOpen(true)}
            className="p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50">
            <BookOpen className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50">
            <Map className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 主要内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧章节管理 */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={handleAddChapter}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>添加章节</span>
            </button>
            <button
              onClick={toggleOrder}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span>{isAscending ? '正序' : '倒序'}</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {sortedChapters.map(chapter => (
              <div
                key={chapter.id}
                className={`
                  flex items-center px-4 py-3 cursor-pointer group
                  ${selectedChapter?.id === chapter.id ? 'bg-purple-50' : 'hover:bg-gray-50'}
                `}
                onClick={() => setSelectedChapter(chapter)}
              >
                <GripVertical className="w-4 h-4 text-gray-400 mr-2 opacity-0 group-hover:opacity-100 cursor-grab" />
                <span className="flex-1 text-gray-700">{chapter.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChapter(chapter.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 中间编辑区 */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedChapter && (
            <>
              <div className="p-4 border-b border-gray-200">
                <input
                  type="text"
                  value={selectedChapter.title}
                  onChange={(e) => handleUpdateChapter(selectedChapter.id, { title: e.target.value })}
                  className="w-full px-4 py-2 text-lg font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="章节标题"
                />
              </div>
              <div className="flex-1 p-4">
                <textarea
                  value={selectedChapter.content}
                  onChange={(e) => handleUpdateChapter(selectedChapter.id, { content: e.target.value })}
                  className="w-full h-full p-4 text-gray-800 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="开始写作..."
                />
              </div>
            </>
          )}
        </div>

        {/* 右侧 AI 功能区 */}
        <div className="relative">
          <AIWritingPanel
            isOpen={isAIWritingOpen}
            onClose={() => setIsAIWritingOpen(false)}
            currentChapter={selectedChapter}
            onUpdateChapter={handleUpdateChapter}
            chapters={chapters}
          />
          <ChapterAnalysisPanel
            isOpen={isAnalysisOpen}
            onClose={() => setIsAnalysisOpen(false)}
            currentChapter={selectedChapter}
            chapters={chapters}
          />
        </div>
      </div>
    </div>
  );
}

export default Editor;