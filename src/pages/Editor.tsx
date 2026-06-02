import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../stores/project.store';
import { api } from '../services/api';
import { ArrowLeft, Save, Clock, FileText, Sparkles } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';

export default function Editor() {
  const { id, chapterId } = useParams<{ id: string; chapterId: string }>();
  const navigate = useNavigate();
  const { currentChapter, setCurrentChapter, updateChapter } = useProjectStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: '开始你的创作...',
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      const count = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
      setWordCount(count);
    },
  });

  useEffect(() => {
    if (chapterId && id) {
      loadChapter();
    }
  }, [chapterId, id]);

  const loadChapter = async () => {
    try {
      const response = await api.chapters.get(id!, chapterId!);
      if (response.success) {
        setCurrentChapter(response.data);
        editor?.commands.setContent(response.data.content || '');
        setWordCount(response.data.wordCount);
      }
    } catch (err) {
      console.error('Failed to load chapter:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveChapter = useCallback(async () => {
    if (!chapterId || !id || !editor) return;

    setSaving(true);
    try {
      const content = editor.getHTML();
      const response = await api.chapters.update(id, chapterId, { content });
      if (response.success) {
        updateChapter(response.data);
        setLastSaved(new Date());
      }
    } catch (err) {
      console.error('Failed to save chapter:', err);
    } finally {
      setSaving(false);
    }
  }, [chapterId, id, editor, updateChapter]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (editor && !editor.isFocused) {
        saveChapter();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [editor, saveChapter]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveChapter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveChapter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1b2e] flex items-center justify-center">
        <div className="animate-spin text-[#d4af37] text-4xl">⟳</div>
      </div>
    );
  }

  if (!currentChapter) {
    return (
      <div className="min-h-screen bg-[#1a1b2e] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#8b8997] mb-4">章节不存在</p>
          <button
            onClick={() => navigate(`/project/${id}`)}
            className="text-[#d4af37] hover:underline"
          >
            返回项目
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1b2e] flex flex-col">
      <header className="bg-[#2d2a4a] border-b border-[#3d3a5a] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/project/${id}`)}
            className="text-[#8b8997] hover:text-[#d4af37] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-[#e8e6e3]">{currentChapter.title}</h1>
            <p className="text-xs text-[#8b8997]">
              {currentChapter.status === 'draft' ? '草稿' :
               currentChapter.status === 'review' ? '待审' : '已发布'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-[#8b8997]">
            <FileText className="w-4 h-4" />
            <span>{wordCount} 字</span>
          </div>

          {lastSaved && (
            <div className="flex items-center gap-2 text-sm text-[#8b8997]">
              <Clock className="w-4 h-4" />
              <span>上次保存: {lastSaved.toLocaleTimeString('zh-CN')}</span>
            </div>
          )}

          <button
            onClick={saveChapter}
            disabled={saving}
            className="bg-[#d4af37] hover:bg-[#c49f32] text-[#1a1b2e] font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-4xl">
            <EditorContent
              editor={editor}
              className="prose prose-invert max-w-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#2d2a4a] border-t border-[#3d3a5a] px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-[#8b8997]">
          <div>
            按 Ctrl+S 保存
          </div>
          <div>
            自动保存间隔: 30秒
          </div>
        </div>
      </div>
    </div>
  );
}
