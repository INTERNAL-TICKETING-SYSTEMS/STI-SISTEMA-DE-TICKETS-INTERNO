import { useState } from 'react';
import Sidebar, { Page, PageContainer } from '@/components/Sidebar';
import Login from '@/components/Login';
import Register from '@/components/Register';
import Dashboard from '@/components/Dashboard';
import OpenTicket from '@/components/OpenTicket';
import MyTickets from '@/components/MyTickets';
import TicketDetail from '@/components/TicketDetail';
import Profile from '@/components/Profile';
import TechSidebar, { TechPage, TechPageContainer } from '@/components/tech/TechSidebar';
import TechDashboard from '@/components/tech/TechDashboard';
import TechTickets from '@/components/tech/TechTickets';
import TechMyAttendance from '@/components/tech/TechMyAttendance';
import TechTicketDetail from '@/components/tech/TechTicketDetail';
import { mockTickets, currentUser, currentTech } from '@/data';
import { Ticket, UserRole, TicketStatus, User } from '@/types';
import Logo from '@/components/Logo';
import { BarChart3, ClipboardList, CheckCircle2, Clock, Users } from 'lucide-react';

type UserView = { page: Page } | { page: 'ticket-detail'; ticketId: string };
type TechView = { page: TechPage } | { page: 'tech-ticket-detail'; ticketId: string };
type AuthScreen = 'login' | 'register';

// Simulated account database — maps email to role
const knownAccounts: Record<string, { role: UserRole; user: User }> = {
  'ana.mendes@empresa.com.br': { role: 'usuario', user: currentUser },
  'marina.alves@empresa.com.br': { role: 'tecnico', user: currentTech },
  'roberto.gestor@empresa.com.br': {
    role: 'gestor',
    user: {
      name: 'Roberto Gestor',
      email: 'roberto.gestor@empresa.com.br',
      department: 'TI',
      role: 'Gestor de TI',
      phone: '(11) 90000-0000',
      userRole: 'gestor',
    },
  },
};

function detectRoleFromEmail(email: string): { role: UserRole; user: User } {
  const normalizedEmail = email.toLowerCase().trim();
  const account = knownAccounts[normalizedEmail];

  if (account) return account;

  // Default to usuario for unknown emails
  return {
    role: 'usuario',
    user: {
      ...currentUser,
      email: normalizedEmail,
    },
  };
}

export default function App() {
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [authed, setAuthed] = useState(false);
  const [activeUser, setActiveUser] = useState<User>(currentUser);
  const [role, setRole] = useState<UserRole>('usuario');
  const [userView, setUserView] = useState<UserView>({ page: 'inicio' });
  const [techView, setTechView] = useState<TechView>({ page: 'tech-inicio' });
  const [gestorView, setGestorView] = useState<'gestor-inicio' | 'gestor-perfil'>('gestor-inicio');
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);

  const handleLogin = (email: string) => {
    const { role: detectedRole, user } = detectRoleFromEmail(email);

    setRole(detectedRole);
    setActiveUser(user);
    setAuthed(true);
  };

  const handleLogout = () => {
    setAuthed(false);
    setAuthScreen('login');
    setRole('usuario');
    setUserView({ page: 'inicio' });
    setTechView({ page: 'tech-inicio' });
    setGestorView('gestor-inicio');
    setActiveUser(currentUser);
  };

  // ---- User mutations ----
  const handleSubmitTicket = (data: {
    title: string;
    category: string;
    description: string;
    urgency: string;
    startDate: string;
    blocking: string;
  }) => {
    const now = new Date().toISOString();

    const newTicket: Ticket = {
      id: String(Date.now()),
      protocol: `STI-2026-${String(Math.floor(150 + Math.random() * 50)).padStart(4, '0')}`,
      title: data.title,
      description: data.description,
      category: data.category,
      status: 'aberto',
      priority: data.urgency as Ticket['priority'],
      createdAt: now,
      updatedAt: now,
      updates: [],
      requesterName: activeUser.name,
      requesterDepartment: activeUser.department,
      requesterLocation: 'A definir',
      requesterContact: activeUser.phone,
      equipmentOrSystem: 'A identificar',
      approximateDate: data.startDate || now.slice(0, 10),
      impact:
        data.blocking === 'sim'
          ? 'Alto — não consigo trabalhar'
          : 'Médio — dá para contornar',
      errorMessage: 'Nenhuma',
      attachments: (data as any).attachments || [],
      assignee: null,
      attendanceStartedAt: null,
      solution: null,
      internalNotes: [],
    };

    setTickets((prev) => [newTicket, ...prev]);
      // Deixa o OpenTicket exibir o comprovante e a animacao de sucesso
  };

  const handleUserReply = (id: string, message: string) => {
    const now = new Date().toISOString();

    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
            ...t,
            updatedAt: now,
            status: 'em_andamento',
            updates: [
              ...t.updates,
              {
                id: String(Date.now()),
                author: 'usuario' as const,
                authorName: activeUser.name,
                message,
                createdAt: now,
              },
            ],
          }
          : t
      )
    );
  };

  // ---- Tech mutations ----
  const handleAssume = (id: string) => {
    const now = new Date().toISOString();

    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
            ...t,
            assignee: activeUser.name,
            status: 'em_andamento',
            attendanceStartedAt: t.attendanceStartedAt ?? now,
            updatedAt: now,
          }
          : t
      )
    );

    setTechView({ page: 'tech-ticket-detail', ticketId: id });
  };

  const handleTechMessage = (id: string, message: string) => {
    const now = new Date().toISOString();

    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
            ...t,
            updatedAt: now,
            updates: [
              ...t.updates,
              {
                id: String(Date.now()),
                author: 'tecnico' as const,
                authorName: activeUser.name,
                message,
                createdAt: now,
              },
            ],
          }
          : t
      )
    );
  };

  const handleRequestInfo = (id: string, question: string) => {
    const now = new Date().toISOString();

    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
            ...t,
            status: 'aguardando' as TicketStatus,
            updatedAt: now,
            updates: [
              ...t.updates,
              {
                id: String(Date.now()),
                author: 'tecnico' as const,
                authorName: activeUser.name,
                message: question,
                createdAt: now,
              },
            ],
          }
          : t
      )
    );
  };

  const handleChangeStatus = (id: string, status: TicketStatus) => {
    const now = new Date().toISOString();

    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
            ...t,
            status,
            updatedAt: now,
          }
          : t
      )
    );
  };

  const handleResolve = (id: string, solution: string) => {
    const now = new Date().toISOString();

    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
            ...t,
            status: 'resolvido' as TicketStatus,
            solution,
            updatedAt: now,
            updates: [
              ...t.updates,
              {
                id: String(Date.now()),
                author: 'tecnico' as const,
                authorName: activeUser.name,
                message: `Chamado resolvido. Solução: ${solution}`,
                createdAt: now,
              },
            ],
          }
          : t
      )
    );
  };

  const handleAddNote = (id: string, note: string) => {
    const now = new Date().toISOString();

    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
            ...t,
            internalNotes: [
              ...t.internalNotes,
              {
                id: String(Date.now()),
                authorName: activeUser.name,
                message: note,
                createdAt: now,
              },
            ],
          }
          : t
      )
    );
  };

  // ---- Auth screens ----
  if (!authed) {
    if (authScreen === 'register') {
      return <Register onBackToLogin={() => setAuthScreen('login')} />;
    }

    return (
      <Login
        onLogin={handleLogin}
        onGoToRegister={() => setAuthScreen('register')}
      />
    );
  }

  // ---- User area ----
  if (role === 'usuario') {
    const navigate = (p: Page) => setUserView({ page: p });
    const openTicket = (id: string) =>
      setUserView({ page: 'ticket-detail', ticketId: id });

    const currentTicket =
      userView.page === 'ticket-detail'
        ? tickets.find((t) => t.id === userView.ticketId)
        : null;

    return (
      <div className="flex h-screen bg-slate-50">
        <Sidebar
          onNavigate={navigate}
          onLogout={handleLogout} current={'inicio'} userName={''}        />

        <PageContainer>
          {userView.page === 'inicio' && (
            <Dashboard
              tickets={tickets}
              onNavigate={navigate}
              onOpenTicket={openTicket}
            />
          )}

          {userView.page === 'abrir-chamado' && (
            <OpenTicket
              onSubmit={handleSubmitTicket}
              onNavigate={navigate}
            />
          )}

          {userView.page === 'meus-chamados' && (
            <MyTickets
              tickets={tickets}
              onNavigate={navigate}
              onOpenTicket={openTicket}
            />
          )}

          {userView.page === 'perfil' && <Profile user={activeUser} />}

          {userView.page === 'ticket-detail' && currentTicket && (
            <TicketDetail
              ticket={currentTicket}
              onReply={(msg) => handleUserReply(currentTicket.id, msg)} onNavigate={navigate}            />
          )}
        </PageContainer>
      </div>
    );
  }

  // ---- Tech area ----
  if (role === 'tecnico') {
    const navigate = (p: TechPage) => setTechView({ page: p });
    const openTicket = (id: string) =>
      setTechView({ page: 'tech-ticket-detail', ticketId: id });

    const currentTicket =
      techView.page === 'tech-ticket-detail'
        ? tickets.find((t) => t.id === techView.ticketId)
        : null;

    return (
      <div className="flex h-screen bg-slate-50">
        <TechSidebar
          current={
            techView.page === 'tech-ticket-detail'
              ? 'tech-chamados'
              : techView.page
          }
          onNavigate={navigate}
          onLogout={handleLogout}
          userName={activeUser.name}
        />

        <TechPageContainer>
          {techView.page === 'tech-inicio' && (
            <TechDashboard
              tickets={tickets}
              onNavigate={navigate}
              onOpenTicket={openTicket}
              onAssume={handleAssume}
              techName={activeUser.name}
            />
          )}

          {techView.page === 'tech-chamados' && (
            <TechTickets
              tickets={tickets}
              onNavigate={navigate}
              onOpenTicket={openTicket}
              onAssume={handleAssume}
            />
          )}

          {techView.page === 'tech-atendimentos' && (
            <TechMyAttendance
              tickets={tickets}
              onNavigate={navigate}
              onOpenTicket={openTicket}
              techName={activeUser.name}
            />
          )}

          {techView.page === 'tech-perfil' && (
            <Profile user={activeUser} />
          )}

          {techView.page === 'tech-ticket-detail' && currentTicket && (
            <TechTicketDetail
              ticket={currentTicket}
              onNavigate={navigate}
              onSendMessage={(id, msg) =>
                handleTechMessage(id, msg)
              }
              onRequestInfo={(id, question) =>
                handleRequestInfo(id, question)
              }
              onChangeStatus={(id, status) =>
                handleChangeStatus(id, status)
              }
              onResolve={(id, solution) =>
                handleResolve(id, solution)
              }
              onAddInternalNote={(id, note) =>
                handleAddNote(id, note)
              }
              techName={activeUser.name}
            />
          )}
        </TechPageContainer>
      </div>
    );
  }

  // ---- Gestor area ----
  const totalTickets = tickets.length;
  const openTicketsCount = tickets.filter(
    (t) => t.status === 'aberto'
  ).length;
  const inProgressTicketsCount = tickets.filter(
    (t) => t.status === 'em_andamento'
  ).length;
  const resolvedTicketsCount = tickets.filter(
    (t) => t.status === 'resolvido'
  ).length;

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Gestor Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4">
        <div className="space-y-6">
          <div className="px-2 py-4">
            <Logo />
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setGestorView('gestor-inicio')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${gestorView === 'gestor-inicio'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <BarChart3 className="w-5 h-5" />
              Painel Geral
            </button>

            <button
              onClick={() => setGestorView('gestor-perfil')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${gestorView === 'gestor-perfil'
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <Users className="w-5 h-5" />
              Meu Perfil
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-colors font-medium"
        >
          Sair do Sistema
        </button>
      </aside>

      {/* Gestor content */}
      <main className="flex-1 overflow-auto p-8">
        {gestorView === 'gestor-inicio' && (
          <div className="max-w-6xl mx-auto space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Painel do Gestor de TI
              </h2>
              <p className="text-slate-500 mt-1">
                Visão analítica de demandas e performance da equipe de suporte.
              </p>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Total de Chamados
                  </p>
                  <p className="text-2xl font-bold text-slate-800">
                    {totalTickets}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Não Atendidos
                  </p>
                  <p className="text-2xl font-bold text-slate-800">
                    {openTicketsCount}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-center gap-4">
                <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Em Andamento
                  </p>
                  <p className="text-2xl font-bold text-slate-800">
                    {inProgressTicketsCount}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Resolvidos
                  </p>
                  <p className="text-2xl font-bold text-slate-800">
                    {resolvedTicketsCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Lista Geral de Monitoramento */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Monitoramento em Tempo Real
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Protocolo</th>
                      <th className="pb-3">Título</th>
                      <th className="pb-3">Requerente</th>
                      <th className="pb-3">Prioridade</th>
                      <th className="pb-3">Técnico</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-50 text-sm text-slate-600">
                    {tickets.map((t) => (
                      <tr
                        key={t.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-3.5 font-medium text-slate-900">
                          {t.protocol}
                        </td>

                        <td className="py-3.5 max-w-xs truncate">
                          {t.title}
                        </td>

                        <td className="py-3.5">
                          {t.requesterName}{' '}
                          <span className="text-xs text-slate-400">
                            ({t.requesterDepartment})
                          </span>
                        </td>

                        <td className="py-3.5">
                          <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${t.priority === 'alta'
                              ? 'bg-red-50 text-red-600'
                              : t.priority === 'media'
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-slate-100 text-slate-600'
                              }`}
                          >
                            {t.priority}
                          </span>
                        </td>

                        <td className="py-3.5 text-slate-500">
                          {t.assignee || (
                            <span className="text-slate-400 italic">
                              Não assumido
                            </span>
                          )}
                        </td>

                        <td className="py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${t.status === 'aberto'
                              ? 'bg-amber-100 text-amber-800'
                              : t.status === 'em_andamento'
                                ? 'bg-cyan-100 text-cyan-800'
                                : t.status === 'resolvido'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                          >
                            {t.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {gestorView === 'gestor-perfil' && (
          <Profile user={activeUser} />
        )}
      </main>
    </div>
  );
}
