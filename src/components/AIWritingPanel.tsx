import React from 'react';
import { X, ChevronDown, Sparkles, Check, RotateCcw, Copy, ArrowLeft } from 'lucide-react';
import type { Chapter } from '../utils/projectStorage';

interface AIWritingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentChapter: Chapter | null;
  onUpdateChapter: (chapterId: string, updates: Partial<Chapter>) => void;
  chapters: Chapter[];
}

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  prompts: string[];
}

const promptTemplates: PromptTemplate[] = [
  {
    id: 'continue',
    name: '续写剧情',
    description: '基于当前内容智能续写后续剧情',
    prompts: [
      '继续发展当前的情节，保持故事的连贯性',
      '基于已有内容，展开新的故事发展',
      '延续当前的情感基调，推进剧情发展',
      '在保持人物性格的基础上继续故事'
    ]
  },
  {
    id: 'expand',
    name: '扩写场景',
    description: '将简单的场景描述扩展为生动的画面',
    prompts: [
      '添加更多感官描写，让场景更加立体',
      '通过细节描写增强场景的真实感',
      '加入环境与人物的互动描写',
      '强化场景的氛围和情感渲染'
    ]
  },
  {
    id: 'dialogue',
    name: '对话生成',
    description: '生成自然流畅的人物对话',
    prompts: [
      '创建自然的对话交流',
      '通过对话展现人物性格',
      '设计富有张力的对话场景',
      '用对话推动情节发展'
    ]
  },
  {
    id: 'emotion',
    name: '情感渲染',
    description: '加强文字的情感表达',
    prompts: [
      '深化人物的情感描写',
      '通过细节展现情感变化',
      '营造特定的情感氛围',
      '强化情感冲突的表达'
    ]
  },
];

const models = [
  { id: 'gpt-4', name: 'GPT-4', description: '更强大的理解力和创造力' },
  { id: 'gpt-3.5', name: 'GPT-3.5', description: '快速响应，性价比更高' },
];

export function AIWritingPanel({
  isOpen,
  onClose,
  currentChapter,
  onUpdateChapter,
  chapters
}: AIWritingPanelProps) {
  const [selectedModel, setSelectedModel] = React.useState(models[0]);
  const [selectedPrompt, setSelectedPrompt] = React.useState<PromptTemplate | null>(null);
  const [selectedPromptText, setSelectedPromptText] = React.useState<string>('');
  const [selectedChapters, setSelectedChapters] = React.useState<Set<string>>(new Set());
  const [customPrompt, setCustomPrompt] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedContent, setGeneratedContent] = React.useState<string>('');
  const [copySuccess, setCopySuccess] = React.useState(false);
  const [view, setView] = React.useState<'form' | 'result'>('form');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // 模拟 AI 生成过程
    setTimeout(() => {
      const mockContent = `在这个寂静的夜晚，月光如水般倾泻而下，为整个世界镀上一层银白色的光辉。远处的山峦如同巨人的剪影，静静地矗立在天际线上。微风轻拂，带来阵阵花香，让人不禁想起那些逝去的美好时光。

张明站在窗前，望着这幅美丽的夜景，内心却久久不能平静。今天发生的一切，就像一场梦一样，让他难以置信。他的手中紧握着那封信，信纸已经被汗水浸湿，字迹也变得有些模糊，但那些文字所承载的信息，却深深地刻在了他的脑海中。`;
      setGeneratedContent(mockContent);
      setView('result');
      setIsGenerating(false);
    }, 2000);
  };

  const handleApplyContent = () => {
    if (currentChapter && generatedContent) {
      onUpdateChapter(currentChapter.id, {
        content: currentChapter.content + '\n\n' + generatedContent
      });
      setGeneratedContent('');
      setView('form');
      onClose();
    }
  };

  const handleReset = () => {
    setView('form');
    setGeneratedContent('');
    setSelectedPrompt(null);
    setSelectedPromptText('');
    setCustomPrompt('');
    setSelectedChapters(new Set());
  };

  const toggleChapter = (chapterId: string) => {
    const newSelected = new Set(selectedChapters);
    if (newSelected.has(chapterId)) {
      newSelected.delete(chapterId);
    } else {
      newSelected.add(chapterId);
    }
    setSelectedChapters(newSelected);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-lg z-50">
      <div className="h-full flex flex-col">
        {/* 顶部标题栏 */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">AI 写作助手</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 主要内容区 */}
        {view === 'form' ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* 模型选择 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">选择模型</label>
            <div className="relative">
              <select
                value={selectedModel.id}
                onChange={(e) => setSelectedModel(models.find(m => m.id === e.target.value) || models[0])}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {models.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-sm text-gray-500">{selectedModel.description}</p>
          </div>

          {/* 提示词模板 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">选择提示词</label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {promptTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedPrompt(template);
                    setSelectedPromptText('');
                  }}
                  className={`p-3 text-left rounded-lg border transition-all ${
                    selectedPrompt?.id === template.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50'
                  }`}
                >
                  <div className="font-medium text-gray-800">{template.name}</div>
                  <div className="text-sm text-gray-500">{template.description}</div>
                </button>
              ))}
            </div>
            {selectedPrompt && (
              <div className="space-y-2">
                <div className="relative">
                  <select
                    value={selectedPromptText}
                    onChange={(e) => setSelectedPromptText(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">选择预设提示词...</option>
                    {selectedPrompt.prompts.map((prompt) => (
                      <option key={prompt} value={prompt}>
                        {prompt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}
          </div>

          {/* 自定义提示词 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">自定义提示词</label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="输入特定的写作要求..."
              className="w-full h-24 px-4 py-2 text-gray-800 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* 关联内容 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">关联章节</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {chapters.map(chapter => (
                <label key={chapter.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={selectedChapters.has(chapter.id)}
                    onChange={() => toggleChapter(chapter.id)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-gray-700">{chapter.title}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleReset}
                    className="p-2 text-gray-600 hover:text-purple-600 rounded-lg hover:bg-purple-50"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-sm font-medium text-gray-700">生成结果</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 text-gray-600 hover:text-purple-600 rounded-lg hover:bg-purple-50 relative"
                  >
                    <Copy className="w-5 h-5" />
                    {copySuccess && (
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded">
                        已复制
                      </span>
                    )}
                  </button>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <pre className="whitespace-pre-wrap text-gray-800 font-sans">
                  {generatedContent}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* 底部按钮 */}
        <div className="p-4 border-t border-gray-200">
          {view === 'form' ? (
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedPrompt || (!selectedPromptText && !customPrompt)}
              className={`
                w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg
                ${isGenerating || !selectedPrompt || (!selectedPromptText && !customPrompt)
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
                } transition-colors duration-300
              `}
            >
              <Sparkles className="w-5 h-5" />
              <span>{isGenerating ? '生成中...' : '开始生成'}</span>
            </button>
          ) : (
            <button
              onClick={handleApplyContent}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-300"
            >
              <Check className="w-5 h-5" />
              <span>应用内容</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}