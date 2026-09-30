import { ReactNode } from 'react';
import Logo from '@/components/Logo';
import { Home, ClipboardList, PlusCircle, User, LogOut } from 'lucide-react';

export type Page = 'inicio' | 'meus-chamados' | 'abrir-chamado' | 'perfil';

interface SidebarProps {
  current: Page;
  onNavigate: (p: Page) => void;
  onLogout: () => void;
  userName: string;
}

const navItems: { id: Page; label: string; icon: typeof Home }[] = [
  { id: 'inicio', label: 'Início', icon: Home },
  { id: 'meus-chamados', label: 'Meus chamados', icon: ClipboardList },
  { id: 'abrir-chamado', label: 'Abrir chamado', icon: PlusCircle },
  { id: 'perfil', label: 'Perfil', icon: User },
];

export default function Sidebar({ current, onNavigate, onLogout, userName }: SidebarProps) {
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
          const isCta = item.id === 'abrir-chamado';

          if (isCta) {
            return (
              <div key={item.id} className="px-3 pt-4">
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
          onClick={() => onNavigate('perfil')}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
            current === 'perfil' ? 'bg-white/10' : 'hover:bg-white/5'
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sti-teal-500 text-sm font-semibold text-white">
            {userName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{userName}</p>
            <p className="truncate text-xs text-slate-400">Ver perfil</p>
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

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <main className="ml-64 min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-10 py-10 animate-fade-in">{children}</div>
    </main>
  );
}
