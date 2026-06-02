import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';
import { Loader2, BookOpen, Sparkles, Cloud } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [loadingStep, setLoadingStep] = useState(0);
  const steps = [
    { icon: Cloud, text: '连接服务' },
    { icon: BookOpen, text: '加载项目数据' },
    { icon: Sparkles, text: '恢复最近工作区' },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= steps.length) {
          clearInterval(timer);
          navigate('/login');
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(timer);
  }, [navigate, steps.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1b2e] via-[#2d2a4a] to-[#1a1b2e] flex items-center justify-center">
      <div className="text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          <h1 className="text-5xl font-serif text-[#d4af37] drop-shadow-lg">
            梦织机
          </h1>
          <p className="text-xl text-[#8b8997]">Novelist Studio</p>
          <p className="text-sm text-[#e8e6e3] mt-2">面向网文作者的长篇创作工作台</p>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index < loadingStep;
            const isCurrent = index === loadingStep;

            return (
              <div
                key={index}
                className={`flex items-center gap-3 justify-center transition-all duration-300 ${
                  isActive ? 'text-[#d4af37]' : isCurrent ? 'text-[#8b8997]' : 'text-[#4a4857]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                <span className="text-sm">{step.text}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse" />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <Loader2 className="w-6 h-6 text-[#d4af37] animate-spin mx-auto" />
        </div>
      </div>
    </div>
  );
}
