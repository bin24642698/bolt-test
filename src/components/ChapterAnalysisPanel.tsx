import React from 'react';
import { X, ChevronDown, BookOpen, Copy, ArrowLeft } from 'lucide-react';
import type { Chapter } from '../utils/projectStorage';

interface ChapterAnalysisPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentChapter: Chapter | null;
  chapters: Chapter[];
}

const analysisModels = [
  { id: 'gpt-4', name: 'GPT-4', description: '深度理解与分析能力' },
  { id: 'gpt-3.5', name: 'GPT-3.5', description: '快速分析，性价比更高' },
];

const analysisMethods = [
  {
    id: 'breakdown',
    name: '拆书分析',
    description: '分析章节的结构、情节、人物等要素',
    prompts: [
      '分析本章节的故事结构，包括开头、发展、高潮和结尾的安排',
      '分析本章节的人物塑造和性格特点',
      '评估本章节的情节发展和节奏把控',
      '探讨本章节的场景布置和氛围营造',
      '分析本章节与整体故事的关联性'
    ]
  },
  {
    id: 'analysis',
    name: '深度分析',
    description: '对章节进行全方位的文学分析',
    prompts: [
      '分析本章节的写作技巧和叙事手法',
      '评估本章节的语言风格和表达特点',
      '探讨本章节的情感层次和心理刻画',
      '分析本章节的主题思想和深层寓意',
      '评估本章节的文学价值和创新之处'
    ]
  }
];

export function ChapterAnalysisPanel({
  isOpen,
  onClose,
  currentChapter,
  chapters
}: ChapterAnalysisPanelProps) {
  const [selectedModel, setSelectedModel] = React.useState(analysisModels[0]);
  const [selectedMethod, setSelectedMethod] = React.useState<typeof analysisMethods[0] | null>(null);
  const [selectedPrompt, setSelectedPrompt] = React.useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<string>('');
  const [copySuccess, setCopySuccess] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(analysisResult);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedMethod || !currentChapter) return;
    
    setIsAnalyzing(true);
    // 模拟分析过程
    setTimeout(() => {
      const mockResult = `# ${currentChapter.title} - ${selectedMethod.name}分析报告

## 整体评价
本章节结构完整，情节发展自然，人物刻画生动。通过细腻的心理描写和环境渲染，成功营造了深沉的情感氛围。

## 详细分析

### 1. 故事结构
- 开篇设置悬念，通过信件引发读者好奇
- 中段通过回忆推进情节
- 结尾留有余韵，为下章埋下伏笔

### 2. 人物刻画
- 主角心理活动描写细腻
- 通过细节展现人物性格
- 情感表达真实自然

### 3. 场景描写
- 夜景描写优美，意境深远
- 环境与人物情感呼应
- 意象运用恰当

### 4. 写作建议
- 可适当加强动作描写
- 建议增加对话情节
- 考虑补充更多感官描写

## 总结
本章节整体质量良好，具有较强的文学性和艺术性。建议在后续创作中继续保持，并注意上述建议点。`;
      
      setAnalysisResult(mockResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-lg z-50">
      <div className="h-full flex flex-col">
        {/* 顶部标题栏 */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">章节分析</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 主要内容区 */}
        <div className="flex-1 overflow-y-auto">
          {!analysisResult ? (
            <div className="p-4 space-y-6">
              {/* 模型选择 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">选择模型</label>
                <div className="relative">
                  <select
                    value={selectedModel.id}
                    onChange={(e) => setSelectedModel(analysisModels.find(m => m.id === e.target.value) || analysisModels[0])}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {analysisModels.map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
                <p className="text-sm text-gray-500">{selectedModel.description}</p>
              </div>

              {/* 分析方法选择 */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">分析方法</label>
                <div className="space-y-2">
                  {analysisMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => {
                        setSelectedMethod(method);
                        setSelectedPrompt('');
                      }}
                      className={`w-full p-3 text-left rounded-lg border transition-all ${
                        selectedMethod?.id === method.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50'
                      }`}
                    >
                      <div className="font-medium text-gray-800">{method.name}</div>
                      <div className="text-sm text-gray-500">{method.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 分析维度选择 */}
              {selectedMethod && selectedMethod.prompts && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">选择提示词</label>
                  <div className="relative">
                    <select
                      value={selectedPrompt}
                      onChange={(e) => setSelectedPrompt(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">请选择提示词...</option>
                      {selectedMethod.prompts.map((prompt) => (
                        <option key={prompt} value={prompt}>
                          {prompt}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                  <div className="mt-2">
                    <textarea
                      value={selectedPrompt}
                      onChange={(e) => setSelectedPrompt(e.target.value)}
                      className="w-full h-24 px-4 py-2 text-gray-800 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="可以直接编辑提示词..."
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setAnalysisResult('')}
                  className="p-2 text-gray-600 hover:text-purple-600 rounded-lg hover:bg-purple-50"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
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
              <div className="prose prose-purple max-w-none">
                <pre className="whitespace-pre-wrap text-gray-800 font-sans bg-purple-50 p-4 rounded-lg">
                  {analysisResult}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="p-4 border-t border-gray-200">
          {!analysisResult ? (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !selectedMethod || !selectedPrompt}
              className={`
                w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg
                ${isAnalyzing || !selectedMethod || !selectedPrompt
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
                } transition-colors duration-300
              `}
            >
              <BookOpen className="w-5 h-5" />
              <span>{isAnalyzing ? '分析中...' : '开始分析'}</span>
            </button>
          ) : (
            <button
              onClick={() => setAnalysisResult('')}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-300"
            >
              <span>重新分析</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}