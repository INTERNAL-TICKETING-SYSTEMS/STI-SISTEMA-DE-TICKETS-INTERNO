import GestorSidebar, { GestorPage, GestorPageContainer } from '@/components/gestor/GestorSidebar';
import GestorDashboard from '@/components/gestor/GestorDashboard';
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
import { mockTickets, currentUser, currentTech, mockTechnicians } from '@/data';
import { Ticket, UserRole, TicketStatus, User } from '@/types';
import Logo from '@/components/Logo';
import { BarChart3, ClipboardList, CheckCircle2, Clock, Users } from 'lucide-react';

type UserView = { page: Page } | { page: 'ticket-detail'; ticketId: string };
type TechView = { page: TechPage } | { page: 'tech-ticket-detail'; ticketId: string };
type AuthScreen = 'login' | 'register';

// Simulated account database — maps email to role
const knownAccounts: Record<string, { role: UserRole; user: User; defaultPassword?: string }> = {
  'ana.mendes@empresa.com.br': { role: 'usuario', user: currentUser },
    'danielandsanfer@gmail.com': { role: 'tecnico', user: mockTechnicians[0], defaultPassword: '.\ati@!#$%2020' },
  'wanderson.ti@orgao.to.gov.br': {
    role: 'gestor',
    user: {
      name: 'Wanderson Silveira',
      email: 'wanderson.ti@orgao.to.gov.br',
      department: 'Diretoria de TI',
      role: 'Chefe de Setor / TI',
      phone: '(63) 98400-1001',
      userRole: 'gestor',
      roles: ['tecnico', 'gestor'],
    },
  },
  'diretor.geral@orgao.to.gov.br': {
    role: 'gestor',
    user: {
      name: 'Dr. Carlos Eduardo Lima',
      email: 'diretor.geral@orgao.to.gov.br',
      department: 'Gabinete da Diretoria',
      role: 'Diretor Geral',
      phone: '(63) 98400-1002',
      userRole: 'gestor',
      roles: ['usuario', 'gestor'],
    },
  },
  'roberto.gerencia@orgao.to.gov.br': {
    role: 'gestor',
    user: {
      name: 'Roberto Albuquerque',
      email: 'roberto.gerencia@orgao.to.gov.br',
      department: 'Gerência Operacional',
      role: 'Gerente Administrativo',
      phone: '(63) 98400-1003',
      userRole: 'gestor',
      roles: ['usuario', 'gestor'],
    },
  },
  'joaopedromms20@gmail.com': { role: 'tecnico', user: mockTechnicians[1], defaultPassword: '.\ati@!#$%2020' },
  'guidetranto@gmail.com': { role: 'tecnico', user: mockTechnicians[2], defaultPassword: '.\ati@!#$%2020' },
  'wandersonmaior@gmail.com': { role: 'tecnico', user: mockTechnicians[3], defaultPassword: '.\ati@!#$%2020' },
  'roberto.gestor@empresa.com.br': {
    role: 'gestor',
    user: {
      name: 'Roberto Gestor',
      email: 'roberto.gestor@empresa.com.br',
      department: 'Manutenção / TI',
      role: 'Gestor de TI',
      phone: '(63) 98888-0000',
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
    const [gestorView, setGestorView] = useState<GestorPage>('gestor-dashboard');

  const handleSwitchRole = (newRole: UserRole) => {
    setRole(newRole);
    setActiveUser((prev) => ({ ...prev, userRole: newRole }));
    if (newRole === 'usuario') setUserView({ page: 'inicio' });
    if (newRole === 'tecnico') setTechView({ page: 'tech-inicio' });
    if (newRole === 'gestor') setGestorView('gestor-dashboard');
  };
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [inspectedTicket, setInspectedTicket] = useState<Ticket | null>(null);

      const handleLogin = (email: string, chosenRole?: UserRole) => {
    const { role: detectedRole, user } = detectRoleFromEmail(email);
    const finalRole = chosenRole || detectedRole;

    setRole(finalRole);
    setActiveUser({
      ...user,
      userRole: finalRole,
    });
    setAuthed(true);
  };

  const handleLogout = () => {
    setAuthed(false);
    setAuthScreen('login');
    setRole('usuario');
    setUserView({ page: 'inicio' });
    setTechView({ page: 'tech-inicio' });
    setGestorView('gestor-dashboard');
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

    const handleAssignTicket = (id: string, assigneeName: string) => {
    const now = new Date().toISOString();

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;

        const isReassign = Boolean(t.assignee && t.assignee !== assigneeName);
        const logMsg = isReassign
          ? 'Chamado transferido de ' + t.assignee + ' para ' + assigneeName + '.'
          : 'Atendimento assumido por ' + assigneeName + ' (Manutenção / TI).';

        return {
          ...t,
          assignee: assigneeName,
          status: t.status === 'aberto' ? 'em_andamento' : t.status,
          attendanceStartedAt: t.attendanceStartedAt || now,
          updatedAt: now,
          updates: [
            ...t.updates,
            {
              id: String(Date.now()),
              author: 'tecnico' as const,
              authorName: activeUser.name,
              message: logMsg,
              createdAt: now,
            },
          ],
        };
      })
    );
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

  const handleResolve = (id: string, solution: string, assetTag?: string, replacedParts?: string) => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'resolvido' as TicketStatus,
              solution,
              assetTag: assetTag || t.assetTag,
              replacedParts: replacedParts || t.replacedParts,
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

  
  const handleRateTicket = (id: string, rating: number, comment?: string) => {
    const now = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return {
          ...t,
          status: 'fechado' as const,
          rating,
          ratingComment: comment,
          updatedAt: now,
          updates: [
            ...t.updates,
            {
              id: String(Date.now()),
              author: 'usuario' as const,
              authorName: activeUser.name,
              message: `Chamado avaliado com ${rating} de 5 estrelas pelo usuário.${comment ? ' Feedback: "' + comment + '"' : ''}`,
              createdAt: now,
            },
          ],
        };
      })
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
                onReply={(msg) => handleUserReply(currentTicket.id, msg)}
                onNavigate={navigate}
                onRateTicket={handleRateTicket}
              />
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
            activeUser={activeUser}
            onSwitchRole={handleSwitchRole}
            tickets={tickets}
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
              onResolve={(id, solution, assetTag, replacedParts) => handleResolve(id, solution, assetTag, replacedParts)}
              onAddInternalNote={(id, note) =>
                handleAddNote(id, note)
              }
              techName={activeUser.name}
                technicians={mockTechnicians}
                onAssign={handleAssignTicket}
            />
          )}
        </TechPageContainer>
      </div>
    );
  }

  // ---- Gestor area ----
  if (role === 'gestor') {
    return (
      <div className="flex h-screen bg-[#070e17]">
        <GestorSidebar
          current={gestorView}
          onNavigate={(page: GestorPage) => setGestorView(page)}
          onLogout={handleLogout}
          activeUser={activeUser}
          onSwitchRole={handleSwitchRole}
        />

        <GestorPageContainer>
          {gestorView === 'gestor-perfil' && (
            <Profile user={activeUser} />
          )}

          {gestorView === 'gestor-dashboard' && (
            <GestorDashboard tickets={tickets} onNavigate={(p: any) => setGestorView(p)} />
          )}

          {gestorView === 'gestor-equipe' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Produtividade da Equipe de TI</h2>
              <p className="text-xs text-slate-400">Distribuição de chamados atendidos e tempo de resposta por técnico.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {mockTechnicians.map((t) => {
                  const techTickets = tickets.filter((tk) => tk.assignee === t.name);
                  const concluidos = techTickets.filter((tk) => tk.status === 'resolvido' || tk.status === 'fechado').length;
                  return (
                    <div key={t.email} className="rounded-2xl border border-white/10 bg-[#0b1624] p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 font-bold">
                          {t.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{t.name}</p>
                          <p className="text-xs text-slate-400">{t.role}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5 text-center">
                        <div className="rounded-lg bg-black/20 p-2">
                          <span className="block text-base font-bold text-white">{techTickets.length}</span>
                          <span className="text-[10px] text-slate-400">Atribuídos</span>
                        </div>
                        <div className="rounded-lg bg-black/20 p-2">
                          <span className="block text-base font-bold text-emerald-400">{concluidos}</span>
                          <span className="text-[10px] text-slate-400">Concluídos</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {gestorView === 'gestor-auditoria' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Trilha de Auditoria & Conformidade SLA</h2>
              <p className="text-xs text-slate-400">Inspeção detalhada de prazos e patrimônios alocados.</p>
              <div className="rounded-2xl border border-white/10 bg-[#0b1624] p-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5">Código</th>
                      <th>Solicitante / Setor</th>
                      <th>Técnico Responsável</th>
                      <th>Patrimônio / Peça</th>
                      <th>Estado</th>
                      <th>Avaliação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {tickets.map((t) => (
                      <tr key={t.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 font-mono text-cyan-400">{t.id}</td>
                        <td>
                          <div className="font-semibold text-white">{t.requesterName}</div>
                          <div className="text-[10px] text-slate-500">{t.requesterDepartment}</div>
                        </td>
                        <td>{t.assignee || <span className="text-slate-500 italic">Pendente</span>}</td>
                        <td className="font-mono text-amber-300">
                          {t.assetTag || t.replacedParts ? (
                            <span>{t.assetTag || 'S/P'} - {t.replacedParts || 'Manutenção'}</span>
                          ) : (
                            <span className="text-slate-600">-</span>
                          )}
                        </td>
                        <td>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            t.status === 'resolvido' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            t.status === 'em_andamento' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                            'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {t.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          {t.rating ? (
                            <span className="text-amber-400 font-bold flex items-center gap-1">
                              ★ {t.rating}.0
                            </span>
                          ) : (
                            <span className="text-slate-600 text-[10px]">Pendente</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {gestorView === 'gestor-relatorios' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Central de Relatórios Oficiais</h2>
              <p className="text-xs text-slate-400">Emissão de relatórios consolidados em PDF e CSV.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="rounded-2xl border border-white/10 bg-[#0b1624] p-5">
                  <h4 className="font-bold text-white text-sm">Relatório Semanal de Atendimentos</h4>
                  <p className="text-xs text-slate-400 mt-1">Consolidado das demandas e tempos de resolução da semana corrente.</p>
                  <button onClick={() => window.print()} className="mt-4 w-full rounded-xl bg-cyan-500 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400">
                    Gerar PDF Semanal
                  </button>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0b1624] p-5">
                  <h4 className="font-bold text-white text-sm">Relatório Mensal de Produtividade</h4>
                  <p className="text-xs text-slate-400 mt-1">Balanço mensal de horas gastas por técnico e peças substituídas.</p>
                  <button onClick={() => window.print()} className="mt-4 w-full rounded-xl bg-[#00A896] py-2 text-xs font-bold text-white hover:bg-teal-500">
                    Gerar PDF Mensal
                  </button>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0b1624] p-5">
                  <h4 className="font-bold text-white text-sm">Auditoria Anual de Patrimônio</h4>
                  <p className="text-xs text-slate-400 mt-1">Histórico completo de equipamentos intervencionados.</p>
                  <button onClick={() => window.print()} className="mt-4 w-full rounded-xl border border-white/15 bg-white/5 py-2 text-xs font-bold text-white hover:bg-white/10">
                    Exportar Tabela
                  </button>
                </div>
              </div>
            </div>
          )}
        </GestorPageContainer>
      </div>
    );
  }

  return null;
}
