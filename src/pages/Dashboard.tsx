import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { useProjectStore } from '../stores/project.store';
import { api } from '../services/api';
import { Plus, BookOpen, Clock, FileText, Search, Grid, List, LogOut } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { projects, setProjects, addProject, removeProject } = useProjectStore();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await api.projects.list();
      if (response.success) {
        setProjects(response.data);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    try {
      const response = await api.projects.create({
        title: newProjectTitle,
        description: newProjectDesc,
      });
      if (response.success) {
        addProject(response.data);
        setShowCreateModal(false);
        setNewProjectTitle('');
        setNewProjectDesc('');
        navigate(`/project/${response.data.id}`);
      }
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('确定要删除这个项目吗？')) return;

    try {
      await api.projects.delete(id);
      removeProject(id);
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1b2e] flex items-center justify-center">
        <div className="animate-spin text-[#d4af37] text-4xl">⟳</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1b2e]">
      <header className="bg-[#2d2a4a] border-b border-[#3d3a5a] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#d4af37]" />
            <h1 className="text-xl font-serif text-[#e8e6e3]">梦织机</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[#8b8997] text-sm">
              {user?.nickname || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-[#8b8997] hover:text-[#d4af37] transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-semibold text-[#e8e6e3]">我的项目</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#d4af37] hover:bg-[#c49f32] text-[#1a1b2e] font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            新建项目
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b8997]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索项目..."
              className="w-full bg-[#2d2a4a] border border-[#3d3a5a] rounded-lg pl-10 pr-4 py-2 text-[#e8e6e3] focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-[#d4af37] text-[#1a1b2e]' : 'bg-[#2d2a4a] text-[#8b8997]'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-[#d4af37] text-[#1a1b2e]' : 'bg-[#2d2a4a] text-[#8b8997]'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-[#3d3a5a] mx-auto mb-4" />
            <p className="text-[#8b8997] mb-4">
              {searchTerm ? '没有找到匹配的项目' : '还没有任何项目，开始创作吧！'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#d4af37] hover:bg-[#c49f32] text-[#1a1b2e] font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                创建第一个项目
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-[#2d2a4a] rounded-lg p-6 border border-[#3d3a5a] hover:border-[#d4af37] transition-all cursor-pointer group"
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#e8e6e3] group-hover:text-[#d4af37] transition-colors">
                    {project.title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    className="text-[#8b8997] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
                {project.description && (
                  <p className="text-[#8b8997] text-sm mb-4 line-clamp-2">{project.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-[#8b8997]">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {project.wordCount} 字
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(project.updatedAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-[#2d2a4a] rounded-lg p-4 border border-[#3d3a5a] hover:border-[#d4af37] transition-all cursor-pointer flex items-center justify-between group"
                onClick={() => navigate(`/project/${project.id}`)}
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#e8e6e3] group-hover:text-[#d4af37] transition-colors">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-[#8b8997] text-sm mt-1">{project.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-6 text-sm text-[#8b8997]">
                  <span>{project.wordCount} 字</span>
                  <span>{new Date(project.updatedAt).toLocaleDateString('zh-CN')}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    className="text-[#8b8997] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#2d2a4a] rounded-lg p-6 w-full max-w-md border border-[#3d3a5a]">
            <h3 className="text-xl font-semibold text-[#e8e6e3] mb-4">新建项目</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm text-[#8b8997] mb-2">项目标题</label>
                <input
                  type="text"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  required
                  className="w-full bg-[#1a1b2e] border border-[#3d3a5a] rounded-lg px-4 py-2 text-[#e8e6e3] focus:outline-none focus:border-[#d4af37]"
                  placeholder="我的小说"
                />
              </div>
              <div>
                <label className="block text-sm text-[#8b8997] mb-2">简介（可选）</label>
                <textarea
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full bg-[#1a1b2e] border border-[#3d3a5a] rounded-lg px-4 py-2 text-[#e8e6e3] focus:outline-none focus:border-[#d4af37] h-24 resize-none"
                  placeholder="简要描述你的故事..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
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
