import { dbRepository } from '@/services/dbRepository';
import { AuditCompliancePanel } from './components/tech/AuditCompliancePanel';

import GestorAuditTable from '@/components/gestor/GestorAuditTable';
import { registrarAuditoria } from './services/auditService';
import GestorSidebar, { GestorPage, GestorPageContainer } from '@/components/gestor/GestorSidebar';
import GestorDashboard from '@/components/gestor/GestorDashboard';
import { useState } from 'react';
import GestorEquipe from '@/components/gestor/GestorEquipe';
import Sidebar, { Page, PageContainer } from '@/components/Sidebar';
import Login from '@/components/Login';
import Register from '@/components/Register';
import Dashboard from '@/components/Dashboard';
import OpenTicket from '@/components/OpenTicket';
import MyTickets from '@/components/MyTickets';
import TicketDetail from '@/components/TicketDetail';
import GestorFeedbacks from '@/components/gestor/GestorFeedbacks';
import FeedbackCenter from '@/components/FeedbackCenter';
import Profile from '@/components/Profile';
import TechSidebar, { TechPage, TechPageContainer } from '@/components/tech/TechSidebar';
import TechDashboard from '@/components/tech/TechDashboard';
import TechTickets from '@/components/tech/TechTickets';
import TechMyAttendance from '@/components/tech/TechMyAttendance';
import TechTicketDetail from '@/components/tech/TechTicketDetail';
import GestorRelatorios from '@/components/gestor/GestorRelatorios';
import { mockTickets, currentUser, currentTech, mockTechnicians } from '@/data';
import { Ticket, UserRole, TicketStatus, User, MessageAttachment } from '@/types';
import Logo from '@/components/Logo';

type UserView = { page: Page } | { page: 'ticket-detail'; ticketId: string };
type TechView = { page: TechPage } | { page: 'tech-ticket-detail'; ticketId: string };
type AuthScreen = 'login' | 'register';

// Simulated account database — maps email to role
// Base Oficial STI Exclusiva (@sti.chamados.com)
const TECH_DEFAULT_PASSWORD = '.\\ati@!#$%2020';

const knownAccounts: Record<string, { role: UserRole; user: User; defaultPassword?: string; requireStrictPassword?: boolean }> = {
  // Solicitante Padrão de Demonstração
  'servidor@sti.chamados.com': {
    role: 'usuario',
    user: currentUser,
    requireStrictPassword: false
  },

  // Carlos Daniel Santos Ferreira (Técnico de Suporte STI)
  'carlos.daniel@sti.chamados.com': {
    role: 'tecnico',
    user: {
      name: 'Carlos Daniel Santos',
      email: 'carlos.daniel@sti.chamados.com',
      department: 'Suporte Técnico STI',
      role: 'Técnico de Suporte',
      phone: '(63) 98400-2020',
      userRole: 'tecnico',
      roles: ['tecnico'],
    },
    defaultPassword: TECH_DEFAULT_PASSWORD,
    requireStrictPassword: true
  },

  // João Pedro Moreira (Técnico de Suporte STI)
  'joao.pedro@sti.chamados.com': {
    role: 'tecnico',
    user: {
      name: 'João Pedro Moreira',
      email: 'joao.pedro@sti.chamados.com',
      department: 'Suporte Técnico STI',
      role: 'Técnico de Suporte',
      phone: '(63) 98400-2021',
      userRole: 'tecnico',
      roles: ['tecnico'],
    },
    defaultPassword: TECH_DEFAULT_PASSWORD,
    requireStrictPassword: true
  },

  // Guilherme Ferreira de Souza (Técnico de Suporte STI)
  'guilherme.ferreira@sti.chamados.com': {
    role: 'tecnico',
    user: {
      name: 'Guilherme Ferreira',
      email: 'guilherme.ferreira@sti.chamados.com',
      department: 'Suporte Técnico STI',
      role: 'Técnico de Suporte',
      phone: '(63) 98400-2022',
      userRole: 'tecnico',
      roles: ['tecnico'],
    },
    defaultPassword: TECH_DEFAULT_PASSWORD,
    requireStrictPassword: true
  },

  // Wanderson Alves Maior (Técnico & Gestor)
  'wanderson.maior@sti.chamados.com': {
    role: 'tecnico',
    user: {
      name: 'Wanderson Alves',
      email: 'wanderson.maior@sti.chamados.com',
      department: 'Infraestrutura & Gestão TI',
      role: 'Técnico / Gestor de TI',
      phone: '(63) 98400-1001',
      userRole: 'tecnico',
      roles: ['tecnico', 'gestor'],
    },
    defaultPassword: TECH_DEFAULT_PASSWORD,
    requireStrictPassword: true
  },

  // Luigue Soares Brandão (Diretor Administrativo)
  'luigue.brandao@sti.chamados.com': {
    role: 'gestor',
    user: {
      name: 'Luigue Soares Brandão',
      email: 'luigue.brandao@sti.chamados.com',
      department: 'Diretoria Administrativa',
      role: 'Diretor Administrativo',
      phone: '(63) 98400-3001',
      userRole: 'gestor',
      roles: ['gestor', 'usuario'],
    },
    requireStrictPassword: false
  },

  // Elias Nunes da Silva Junior (Gerente Administrativo)
  'elias.junior@sti.chamados.com': {
    role: 'gestor',
    user: {
      name: 'Elias Nunes da Silva Junior',
      email: 'elias.junior@sti.chamados.com',
      department: 'Gerência Administrativa',
      role: 'Gerente Administrativo',
      phone: '(63) 98400-3002',
      userRole: 'gestor',
      roles: ['gestor', 'usuario'],
    },
    requireStrictPassword: false
  }
};

function detectRoleFromEmail(email: string): { role: UserRole; user: User } {
  const normalizedEmail = email.toLowerCase().trim();
  const account = knownAccounts[normalizedEmail];

  if (account) return account;

  // Busca se foi cadastrado via tela de cadastro
  try {
    const customUsers = JSON.parse(localStorage.getItem('sti_registered_users') || '[]');
    const found = customUsers.find((u: any) => u.email.toLowerCase() === normalizedEmail);
    if (found) {
      return {
        role: 'usuario',
        user: {
          ...currentUser,
          name: found.name,
          email: found.email,
          department: found.department,
          phone: found.phone || '(63) 98400-0000',
          userRole: 'usuario',
          roles: ['usuario'],
        }
      };
    }
  } catch (err) { }

  return {
    role: 'usuario',
    user: {
      ...currentUser,
      email: normalizedEmail,
    },
  };
}

function getThemeBackground() {
  const isDark =
    document.documentElement.dataset.theme === 'dark' ||
    document.documentElement.classList.contains('dark');

  return isDark
    ? 'bg-[#070e17] text-slate-100'
    : 'bg-slate-50 text-slate-900';
}

export default function App() {
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [authed, setAuthed] = useState(false);
  const [activeUser, setActiveUser] = useState<User>(currentUser);
  const [role, setRole] = useState<UserRole>('usuario');
  const [userView, setUserView] = useState<UserView>({ page: 'inicio' });
  const [techView, setTechView] = useState<TechView>({ page: 'tech-inicio' });
  const [techInitialStatus, setTechInitialStatus] = useState<TicketStatus | 'todos'>('todos');
  const [gestorView, setGestorView] = useState<GestorPage>('gestor-dashboard');
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<'SEMANAL' | 'MENSAL' | 'PATRIMONIO'>('SEMANAL');

  const handleTechFilterSelect = (status: TicketStatus) => {
    setTechInitialStatus(status);
    setTechView({ page: 'tech-chamados' });
  };

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

    console.log('[Auth STI] Autenticando:', {
      inputEmail: email,
      detectedRole,
      finalRole,
      userName: user.name
    });

    setRole(finalRole);
    setActiveUser({
      ...user,
      userRole: finalRole,
    });

    if (finalRole === 'tecnico') {
      setTechView({ page: 'tech-inicio' });
    } else if (finalRole === 'gestor') {
      setGestorView('gestor-dashboard');
    } else {
      setUserView({ page: 'inicio' });
    }

    setAuthed(true);

    // Auditoria de autenticação imutável
    registrarAuditoria({
      entidade: 'AUTENTICACAO',
      idEntidade: user.email || email,
      tipoOperacao: 'LOGIN',
      autor: email,
      estadoAtual: { role: finalRole, nome: user.name, departamento: user.department },
      metadados: { origem: 'Login Form STI' }
    }).catch(err => console.error('[Auditoria] Falha silenciosa no login:', err));
  };

  const handleLogout = () => {
    if (activeUser?.email) {
      registrarAuditoria({
        entidade: 'AUTENTICACAO',
        idEntidade: activeUser.email,
        tipoOperacao: 'LOGOUT',
        autor: activeUser.email,
        estadoAnterior: { role, nome: activeUser.name },
        metadados: { motivo: 'Logout manual pelo usuário' }
      }).catch(err => console.error('[Auditoria] Falha silenciosa no logout:', err));
    }
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

    // Auditoria imutável na criação do chamado
    registrarAuditoria({
      entidade: 'CHAMADO',
      idEntidade: newTicket.id,
      tipoOperacao: 'CRIACAO',
      autor: activeUser?.email || (newTicket as any).userEmail || (newTicket as any).creatorName || 'solicitante@sti.chamados.com',
      estadoAtual: {
        assunto: newTicket.title,
        categoria: newTicket.category,
        prioridade: newTicket.priority,
        status: newTicket.status,
        setor: (newTicket as any).location || activeUser?.department || "Geral"
      },
      metadados: { origem: 'Abertura de Chamado STI' }
    }).catch(err => console.error('[Auditoria] Falha ao registrar criação do chamado:', err));
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

    // Auditoria imutável: Réplica enviada pelo usuário solicitante
    registrarAuditoria({
      entidade: 'CHAMADO',
      idEntidade: id,
      tipoOperacao: 'MENSAGEM_USUARIO',
      autor: activeUser?.email || 'solicitante@sti.chamados.com',
      estadoAtual: { mensagem: message },
      metadados: { origem: 'Chat do Chamado - Solicitante' }
    }).catch(err => console.error('[Auditoria] Falha ao registrar mensagem do usuário:', err));
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

    // Auditoria imutável: Técnico assumiu o atendimento
    registrarAuditoria({
      entidade: 'CHAMADO',
      idEntidade: id,
      tipoOperacao: 'ATRIBUICAO',
      autor: activeUser?.email || 'tecnico@sti.chamados.com',
      estadoAtual: {
        tecnico: activeUser?.name || 'Técnico STI',
        status: 'em_andamento'
      },
      metadados: { acao: 'Técnico assumiu o chamado' }
    }).catch(err => console.error('[Auditoria] Falha ao registrar atribuição:', err));

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

    // Auditoria imutável: Atribuição ou Transferência de chamado
    const targetTicket = tickets.find((t) => t.id === id);
    const isReassign = Boolean(targetTicket?.assignee && targetTicket.assignee !== assigneeName);
    registrarAuditoria({
      entidade: 'CHAMADO',
      idEntidade: id,
      tipoOperacao: isReassign ? 'TRANSFERENCIA' : 'ATRIBUICAO',
      autor: activeUser?.email || 'sistema@sti.chamados.com',
      estadoAnterior: { responsavel: targetTicket?.assignee || null },
      estadoAtual: { responsavel: assigneeName },
      metadados: {
        acao: isReassign ? 'Transferência entre técnicos' : 'Atribuição de chamado',
        transferidoPor: activeUser?.name || 'Sistema'
      }
    }).catch((err) => console.error('[Auditoria] Falha ao registrar atribuição/transferência:', err));
  };

  const handlePrintReport = (tipoRelatorio: string) => {
    registrarAuditoria({
      entidade: 'RELATORIO',
      idEntidade: tipoRelatorio.toUpperCase().replace(/s+/g, '_'),
      tipoOperacao: 'EMISSAO_RELATORIO',
      autor: activeUser?.email || 'gestor@sti.chamados.com',
      estadoAtual: { relatorio: tipoRelatorio, impressoEm: new Date().toISOString() },
      metadados: { formato: 'PDF_PRINT', solicitante: activeUser?.name || 'Gestor' }
    }).catch(err => console.error('[Auditoria] Falha ao registrar emissão de relatório:', err));
    window.print();
  };



  const handleTechMessage = (
    id: string,
    message: string,
    attachments: MessageAttachment[] = []
  ) => {
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
                attachments,
              },
            ],
          }
          : t
      )
    );

    registrarAuditoria({
      entidade: 'CHAMADO',
      idEntidade: id,
      tipoOperacao: 'MENSAGEM_TECNICO',
      autor: activeUser?.email || 'tecnico@sti.chamados.com',
      estadoAtual: {
        mensagem: message,
        anexos: attachments.map((a) => ({
          nome: a.name,
          tipo: a.type,
          tamanho: a.size,
        })),
      },
      metadados: { origem: 'Chat Técnico' },
    }).catch((err) =>
      console.error('[Auditoria] Falha ao registrar mensagem técnica:', err)
    );
  };

  const handleRequestInfo = (
    id: string,
    question: string,
    attachments: MessageAttachment[] = []
  ) => {
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
                attachments,
              },
            ],
          }
          : t
      )
    );

    registrarAuditoria({
      entidade: 'CHAMADO',
      idEntidade: id,
      tipoOperacao: 'SOLICITACAO_INFORMACOES',
      autor: activeUser?.email || 'tecnico@sti.chamados.com',
      estadoAtual: {
        status: 'aguardando',
        pergunta: question,
        anexos: attachments.map((a) => ({
          nome: a.name,
          tipo: a.type,
          tamanho: a.size,
        })),
      },
      metadados: { acao: 'Aguardando retorno do solicitante' },
    }).catch((err) =>
      console.error(
        '[Auditoria] Falha ao registrar solicitação de informações:',
        err
      )
    );
  };


  const handleChangeStatus = (id: string, status: TicketStatus) => {
    const now = new Date().toISOString();

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;

        const resolvedAt =
          status === 'resolvido'
            ? t.resolvedAt || now
            : status === 'fechado'
              ? t.resolvedAt || null
              : null;

        return {
          ...t,
          status,
          resolvedAt,
          updatedAt: now,
        };
      })
    );

    registrarAuditoria({
      entidade: 'CHAMADO',
      idEntidade: id,
      tipoOperacao: 'ATUALIZACAO_STATUS',
      autor: activeUser?.email || 'tecnico@sti.chamados.com',
      estadoAtual: { status },
      metadados: {
        acao: 'Mudança manual de status pelo técnico',
      },
    }).catch((err) =>
      console.error(
        '[Auditoria] Falha ao registrar alteração de status:',
        err
      )
    );
  };

  const handleResolve = (
    id: string,
    solution: string,
    assetTag?: string,
    replacedParts?: string
  ) => {
    // Despacho oficial para persistência e microsserviço DATA-AUDIT
    dbRepository.atualizarStatusChamado(
      id,
      'RESOLVIDO',
      (activeUser as any)?.name ||
      (activeUser as any)?.email ||
      'Técnico STI',
      (activeUser as any)?.id || undefined,
      solution
    );

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

            // Mantém a primeira data de resolução
            resolvedAt: t.resolvedAt || now,

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

    // Auditoria imutável: Resolução técnica do chamado
    registrarAuditoria({
      entidade: 'CHAMADO',
      idEntidade: id,
      tipoOperacao: 'RESOLUCAO',
      autor: activeUser?.email || 'tecnico@sti.chamados.com',
      estadoAtual: {
        status: 'resolvido',
        solucao: solution,
        patrimonio: assetTag || null,
        pecasTrocadas: replacedParts || null,
      },
      metadados: {
        acao: 'Resolução técnica concluída',
      },
    }).catch((err) =>
      console.error('[Auditoria] Falha ao registar resolução:', err)
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

    // Auditoria imutável: Avaliação e Fechamento formal pelo solicitante
    registrarAuditoria({
      entidade: 'CHAMADO',
      idEntidade: id,
      tipoOperacao: 'AVALIACAO',
      autor: activeUser?.email || 'solicitante@sti.chamados.com',
      estadoAtual: {
        status: 'fechado',
        nota: rating,
        comentario: comment || null
      },
      metadados: { acao: 'Encerramento formal com avaliação de satisfação' }
    }).catch(err => console.error('[Auditoria] Falha ao registrar avaliação:', err));
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
      <div className={`flex h-screen ${getThemeBackground()}`}>
        <Sidebar
          current={userView.page === 'ticket-detail' ? 'meus-chamados' : userView.page}
          onNavigate={navigate}
          onLogout={handleLogout}
          userName={activeUser.name}
          userRole={activeUser.department || 'Colaborador'}
          tickets={tickets}
          activeUser={activeUser}
          onSwitchRole={handleSwitchRole}
        />

        <PageContainer>
          {userView.page === 'inicio' && (
            <Dashboard
              tickets={tickets}
              onNavigate={navigate}
              onOpenTicket={openTicket}
              userName={activeUser?.name || ''}
            />
          )}

          {userView.page === 'abrir-chamado' && (<OpenTicket
            onSubmit={handleSubmitTicket}
            onNavigate={navigate}
          />
          )}

          {userView.page === 'meus-chamados' && (<MyTickets
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
          )} </PageContainer>

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
      <div className="flex h-screen">
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
            techView.page === ('auditoria' as any) ? (
              <AuditCompliancePanel />
            ) : (
              <TechDashboard
                tickets={tickets}
                onNavigate={navigate}
                onOpenTicket={openTicket}
                onAssume={handleAssume}
                techName={activeUser.name}
                onFilterSelect={handleTechFilterSelect}
              />
            )
          )}

          {techView.page === 'tech-chamados' && (
            <TechTickets
              tickets={tickets}
              onNavigate={navigate}
              onOpenTicket={openTicket}
              onAssume={handleAssume}
              initialStatus={techInitialStatus}
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


          {techView.page === ('tech-feedbacks' as any) && (
            <FeedbackCenter
              currentRole="tecnico"
              activeUserName={activeUser.name}
              activeUserDepartment={activeUser.department}
            />
          )}

          {techView.page === 'tech-perfil' && (
            <Profile user={activeUser} />
          )}

          {techView.page === 'tech-ticket-detail' && currentTicket && (
            <TechTicketDetail
              ticket={currentTicket}
              onNavigate={navigate}
              onSendMessage={(id, msg, attachments) =>
                handleTechMessage(id, msg, attachments)
              }
              onRequestInfo={(id, question, attachments) =>
                handleRequestInfo(id, question, attachments)
              }
              onChangeStatus={(id, status) =>
                handleChangeStatus(id, status)
              }
              onResolve={(id, solution, assetTag, replacedParts) =>
                handleResolve(id, solution, assetTag, replacedParts)
              }
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
      <div className={`flex min-h-screen ${getThemeBackground()}`}>
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
            <GestorDashboard
              tickets={tickets}
              onNavigate={(page: any) => setGestorView(page)}
            />
          )}

          {gestorView === 'gestor-equipe' && (
            <GestorEquipe tickets={tickets} />
          )}

          {gestorView === 'gestor-auditoria' && (
            <GestorAuditTable />
          )}

          {gestorView === 'gestor-feedbacks' && (
            <GestorFeedbacks
              currentRole={activeUser.role}
              activeUserName={activeUser.name}
              activeUserDepartment={activeUser.department}
            />
          )}

          {gestorView === 'gestor-relatorios' && (
            <GestorRelatorios
              tickets={tickets}
              gestorName={activeUser.name}
              reportModalOpen={reportModalOpen}
              selectedReportType={selectedReportType}
              onReportModalOpenChange={setReportModalOpen}
              onSelectedReportTypeChange={setSelectedReportType}
            />
          )}
        </GestorPageContainer>
      </div>
    );
  }

  return null;
}
