import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../stores/project.store';
import { api } from '../services/api';
import { Plus, ArrowLeft, FileText, Settings, Save, Clock } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';

export default function Project() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentProject, setCurrentProject, chapters, setChapters, addChapter } = useProjectStore();
  const [loading, setLoading] = useState(true);
  const [showNewChapterModal, setShowNewChapterModal] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      const [projectRes, chaptersRes] = await Promise.all([
        api.projects.get(id!),
        api.chapters.list(id!),
      ]);

      if (projectRes.success) {
        setCurrentProject(projectRes.data);
      }
      if (chaptersRes.success) {
        setChapters(chaptersRes.data);
      }
    } catch (err) {
      console.error('Failed to load project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterTitle.trim() || !id) return;

    try {
      const response = await api.chapters.create(id, { title: newChapterTitle });
      if (response.success) {
        addChapter(response.data);
        setShowNewChapterModal(false);
        setNewChapterTitle('');
        navigate(`/project/${id}/chapter/${response.data.id}`);
      }
    } catch (err) {
      console.error('Failed to create chapter:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1b2e] flex items-center justify-center">
        <div className="animate-spin text-[#d4af37] text-4xl">⟳</div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-[#1a1b2e] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8b8997] mb-4">项目不存在</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-[#d4af37] hover:underline"
          >
            返回工作台
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1b2e]">
      <header className="bg-[#2d2a4a] border-b border-[#3d3a5a] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-[#8b8997] hover:text-[#d4af37] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-[#e8e6e3]">{currentProject.title}</h1>
              <p className="text-xs text-[#8b8997]">
                {currentProject.wordCount} 字 · {chapters.length} 章
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowNewChapterModal(true)}
            className="bg-[#d4af37] hover:bg-[#c49f32] text-[#1a1b2e] font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            新建章节
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-[#2d2a4a] rounded-lg border border-[#3d3a5a] p-6">
              <h2 className="text-2xl font-semibold text-[#e8e6e3] mb-4">章节列表</h2>

              {chapters.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-[#3d3a5a] mx-auto mb-4" />
                  <p className="text-[#8b8997] mb-4">还没有章节，开始创作吧！</p>
                  <button
                    onClick={() => setShowNewChapterModal(true)}
                    className="bg-[#d4af37] hover:bg-[#c49f32] text-[#1a1b2e] font-semibold px-6 py-3 rounded-lg transition-colors"
                  >
                    创建第一章
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {chapters.map((chapter, index) => (
                    <div
                      key={chapter.id}
                      onClick={() => navigate(`/project/${id}/chapter/${chapter.id}`)}
                      className="bg-[#1a1b2e] rounded-lg p-4 border border-[#3d3a5a] hover:border-[#d4af37] transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[#8b8997] text-sm">
                            第{index + 1}章
                          </span>
                          <h3 className="text-[#e8e6e3] font-semibold group-hover:text-[#d4af37] transition-colors">
                            {chapter.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-[#8b8997]">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {chapter.wordCount} 字
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(chapter.updatedAt).toLocaleDateString('zh-CN')}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            chapter.status === 'published' ? 'bg-green-500/20 text-green-400' :
                            chapter.status === 'review' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {chapter.status === 'published' ? '已发布' :
                             chapter.status === 'review' ? '待审' : '草稿'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-[#2d2a4a] rounded-lg border border-[#3d3a5a] p-6">
              <h2 className="text-xl font-semibold text-[#e8e6e3] mb-4">项目信息</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[#8b8997]">标题</label>
                  <p className="text-[#e8e6e3]">{currentProject.title}</p>
                </div>
                {currentProject.description && (
                  <div>
                    <label className="text-sm text-[#8b8997]">简介</label>
                    <p className="text-[#e8e6e3]">{currentProject.description}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm text-[#8b8997]">总字数</label>
                  <p className="text-[#d4af37] text-2xl font-bold">{currentProject.wordCount}</p>
                </div>
                <div>
                  <label className="text-sm text-[#8b8997]">创建时间</label>
                  <p className="text-[#e8e6e3]">
                    {new Date(currentProject.createdAt).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showNewChapterModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#2d2a4a] rounded-lg p-6 w-full max-w-md border border-[#3d3a5a]">
            <h3 className="text-xl font-semibold text-[#e8e6e3] mb-4">新建章节</h3>
            <form onSubmit={handleCreateChapter} className="space-y-4">
              <div>
                <label className="block text-sm text-[#8b8997] mb-2">章节标题</label>
                <input
                  type="text"
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  required
                  className="w-full bg-[#1a1b2e] border border-[#3d3a5a] rounded-lg px-4 py-2 text-[#e8e6e3] focus:outline-none focus:border-[#d4af37]"
                  placeholder="第一章：..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewChapterModal(false)}
                  className="flex-1 bg-[#3d3a5a] hover:bg-[#4d4a6a] text-[#e8e6e3] font-semibold py-2 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#d4af37] hover:bg-[#c49f32] text-[#1a1b2e] font-semibold py-2 rounded-lg transition-colors"
                >
                  创建
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
