import { ReactNode } from 'react';
import Logo from '@/components/Logo';
import { Home, ClipboardList, Headphones, User, LogOut } from 'lucide-react';

export type TechPage = 'tech-inicio' | 'tech-chamados' | 'tech-atendimentos' | 'tech-perfil';

interface TechSidebarProps {
  current: TechPage;
  onNavigate: (p: TechPage) => void;
  onLogout: () => void;
  userName: string;
}

const navItems: { id: TechPage; label: string; icon: typeof Home; highlight?: boolean }[] = [
  { id: 'tech-inicio', label: 'Início', icon: Home },
  { id: 'tech-chamados', label: 'Chamados', icon: ClipboardList, highlight: true },
  { id: 'tech-atendimentos', label: 'Meus atendimentos', icon: Headphones },
  { id: 'tech-perfil', label: 'Perfil', icon: User },
];

export default function TechSidebar({ current, onNavigate, onLogout, userName }: TechSidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col bg-sti-navy-800">
      {/* Logo area */}
      <div className="flex h-20 items-center px-6">
        <Logo variant="full" light className="h-9" />
      </div>

      {/* Nav */}
      <nav className="mt-2 flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = current === item.id;

          if (item.highlight) {
            return (
              <div key={item.id} className="px-3 pt-2">
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                    active
                      ? 'bg-sti-teal-500 text-white shadow-sti-md'
                      : 'bg-sti-teal-500/90 text-white hover:bg-sti-teal-400 shadow-sm'
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {item.label}
                </button>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-white/10 text-white'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer / user */}
      <div className="border-t border-white/10 px-4 py-4">
        <button
          onClick={() => onNavigate('tech-perfil')}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
            current === 'tech-perfil' ? 'bg-white/10' : 'hover:bg-white/5'
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sti-teal-500 text-sm font-semibold text-white">
            {userName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{userName}</p>
            <p className="truncate text-xs text-slate-400">Técnico de TI</p>
          </div>
        </button>

        <button
          onClick={onLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  );
}

export function TechPageContainer({ children }: { children: ReactNode }) {
  return (
    <main className="ml-64 min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-10 py-10 animate-fade-in">{children}</div>
    </main>
  );
}
