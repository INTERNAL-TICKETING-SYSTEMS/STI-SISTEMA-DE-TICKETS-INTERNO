import React, { useState, useEffect } from 'react';
import { 
  Bug, 
  Sparkles, 
  FileText, 
  Filter, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  PlusCircle,
  X,
  User,
  Building
} from 'lucide-react';

export interface FeedbackItem {
  id: string;
  type: 'falha' | 'ideia' | 'demanda_gestor';
  title: string;
  description: string;
  authorName: string;
  authorDepartment?: string;
  authorRole?: string;
  createdAt: string;
  status: 'novo' | 'em_analise' | 'implementado' | 'descartado';
  priority?: 'baixa' | 'media' | 'alta';
}

const DEFAULT_FEEDBACKS: FeedbackItem[] = [
  {
    id: 'FB-001',
    type: 'falha',
    title: 'Lentidão no carregamento de anexos pesados',
    description: 'Ao anexar PDFs acima de 5MB na abertura de chamado, a página congela por alguns segundos antes de confirmar o upload.',
    authorName: 'Ana Paula Rocha',
    authorDepartment: 'Recursos Humanos',
    authorRole: 'Servidor',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'em_analise',
    priority: 'alta'
  },
  {
    id: 'FB-002',
    type: 'ideia',
    title: 'Adicionar filtro por data de abertura no painel',
    description: 'Seria muito útil podermos filtrar os chamados por período de datas específico para conciliação mensal.',
    authorName: 'Carlos Eduardo',
    authorDepartment: 'Financeiro',
    authorRole: 'Servidor',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    status: 'novo',
    priority: 'media'
  },
  {
    id: 'FB-003',
    type: 'demanda_gestor',
    title: 'Relatório Executivo de Tempo Médio de Resolução (MTTR) por Diretoria',
    description: 'Necessário compilar os dados consolidados do terceiro trimestre para apresentação ao comitê de governança.',
    authorName: 'Diretoria de Governança',
    authorDepartment: 'Gabinete / Gestão',
    authorRole: 'Gestor',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'novo',
    priority: 'alta'
  }
];

interface FeedbackCenterProps {
  currentRole: 'tecnico' | 'gestor';
  activeUserName?: string;
  activeUserDepartment?: string;
}

export default function FeedbackCenter({ currentRole, activeUserName = 'Usuário', activeUserDepartment = 'STI' }: FeedbackCenterProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [filterType, setFilterType] = useState<'todos' | 'falha' | 'ideia' | 'demanda_gestor'>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for Gestor Demand
  const [demandTitle, setDemandTitle] = useState('');
  const [demandDesc, setDemandDesc] = useState('');
  const [demandPriority, setDemandPriority] = useState<'baixa' | 'media' | 'alta'>('alta');

  useEffect(() => {
    const saved = localStorage.getItem('sti_feedbacks');
    if (saved) {
      try {
        setFeedbacks(JSON.parse(saved));
      } catch {
        setFeedbacks(DEFAULT_FEEDBACKS);
      }
    } else {
      setFeedbacks(DEFAULT_FEEDBACKS);
      localStorage.setItem('sti_feedbacks', JSON.stringify(DEFAULT_FEEDBACKS));
    }
  }, []);

  const saveFeedbacks = (updated: FeedbackItem[]) => {
    setFeedbacks(updated);
    localStorage.setItem('sti_feedbacks', JSON.stringify(updated));
  };

  const handleUpdateStatus = (id: string, newStatus: FeedbackItem['status']) => {
    const updated = feedbacks.map(item => item.id === id ? { ...item, status: newStatus } : item);
    saveFeedbacks(updated);
  };

  const handleCreateDemand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demandTitle.trim() || !demandDesc.trim()) return;

    const newItem: FeedbackItem = {
      id: `DEM-${Date.now().toString().slice(-4)}`,
      type: 'demanda_gestor',
      title: demandTitle.trim(),
      description: demandDesc.trim(),
      authorName: activeUserName,
      authorDepartment: activeUserDepartment,
      authorRole: 'Gestor',
      createdAt: new Date().toISOString(),
      status: 'novo',
      priority: demandPriority
    };

    saveFeedbacks([newItem, ...feedbacks]);
    setDemandTitle('');
    setDemandDesc('');
    setIsModalOpen(false);
  };

  const filteredFeedbacks = feedbacks.filter(f => filterType === 'todos' ? true : f.type === filterType);

  const bugsCount = feedbacks.filter(f => f.type === 'falha').length;
  const ideasCount = feedbacks.filter(f => f.type === 'ideia').length;
  const demandsCount = feedbacks.filter(f => f.type === 'demanda_gestor').length;

  return (
    <div className="space-y-6">
      {/* Header com Ação */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Central de Feedbacks & Demandas</span>
            <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 text-xs text-cyan-400 font-semibold">
              {currentRole === 'gestor' ? 'Visão da Gestão' : 'Console Técnico'}
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Acompanhe problemas notificados pelos servidores, sugestões de aprimoramento e solicitações de relatórios.
          </p>
        </div>

        {currentRole === 'gestor' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Solicitar Dado / Novo Relatório</span>
          </button>
        )}
      </div>

      {/* Cards de Contadores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setFilterType('falha')}
          className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left cursor-pointer ${
            filterType === 'falha' 
              ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/30' 
              : 'bg-[#0b1624] border-white/5 hover:border-white/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-500/20 p-2.5 text-amber-400">
              <Bug className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-2xl font-bold text-white">{bugsCount}</span>
              <span className="text-xs text-slate-400">Problemas / Falhas</span>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFilterType('ideia')}
          className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left cursor-pointer ${
            filterType === 'ideia' 
              ? 'bg-cyan-500/10 border-cyan-500/40 ring-1 ring-cyan-500/30' 
              : 'bg-[#0b1624] border-white/5 hover:border-white/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/20 p-2.5 text-cyan-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-2xl font-bold text-white">{ideasCount}</span>
              <span className="text-xs text-slate-400">Sugestões de Ideias</span>
            </div>
          </div>
        </button>

        <button
          onClick={() => setFilterType('demanda_gestor')}
          className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left cursor-pointer ${
            filterType === 'demanda_gestor' 
              ? 'bg-emerald-500/10 border-emerald-500/40 ring-1 ring-emerald-500/30' 
              : 'bg-[#0b1624] border-white/5 hover:border-white/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/20 p-2.5 text-emerald-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <span className="block text-2xl font-bold text-white">{demandsCount}</span>
              <span className="text-xs text-slate-400">Demandas de Gestão</span>
            </div>
          </div>
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="flex items-center gap-2 pb-1 border-b border-white/5">
        <Filter className="h-4 w-4 text-slate-400" />
        <span className="text-xs font-semibold text-slate-300 mr-2">Filtrar:</span>
        <button
          onClick={() => setFilterType('todos')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            filterType === 'todos' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Todos ({feedbacks.length})
        </button>
        <button
          onClick={() => setFilterType('falha')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            filterType === 'falha' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Problemas
        </button>
        <button
          onClick={() => setFilterType('ideia')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            filterType === 'ideia' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Ideias
        </button>
        <button
          onClick={() => setFilterType('demanda_gestor')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            filterType === 'demanda_gestor' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Demandas de Gestão
        </button>
      </div>

      {/* Lista de Registros */}
      <div className="space-y-3">
        {filteredFeedbacks.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-[#0b1624] p-12 text-center text-slate-400 text-xs">
            Nenhum registro encontrado nesta categoria.
          </div>
        ) : (
          filteredFeedbacks.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-[#0b1624] p-5 shadow-sm hover:border-white/20 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    item.type === 'falha' 
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' 
                      : item.type === 'ideia'
                      ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                      : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                  }`}>
                    {item.type === 'falha' ? <Bug className="h-3 w-3" /> : item.type === 'ideia' ? <Sparkles className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                    {item.type === 'falha' ? 'Falha' : item.type === 'ideia' ? 'Sugestão' : 'Demanda Gerencial'}
                  </span>
                  <span className="font-mono text-xs text-slate-400">{item.id}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Status Dropdown/Badges */}
                <div className="flex items-center gap-2">
                  <select
                    value={item.status}
                    onChange={(e) => handleUpdateStatus(item.id, e.target.value as any)}
                    className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="novo" className="bg-[#0b1624]">Novo</option>
                    <option value="em_analise" className="bg-[#0b1624]">Em Análise</option>
                    <option value="implementado" className="bg-[#0b1624]">Atendido / Concluído</option>
                    <option value="descartado" className="bg-[#0b1624]">Descartado</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/5 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{item.authorName}</span>
                </div>
                {item.authorDepartment && (
                  <div className="flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-slate-500" />
                    <span>{item.authorDepartment}</span>
                  </div>
                )}
                {item.priority && (
                  <span className={`font-semibold ${
                    item.priority === 'alta' ? 'text-rose-400' : item.priority === 'media' ? 'text-amber-400' : 'text-slate-400'
                  }`}>
                    Prioridade: {item.priority.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal para o Gestor Solicitar Relatório/Dados */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b1624] p-6 text-white shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-amber-500/20 p-2 text-amber-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Solicitar Dado ou Relatório</h3>
                  <p className="text-xs text-slate-400">Demanda direta aos desenvolvedores e analistas de BI do STI</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDemand} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Título da Solicitação</label>
                <input
                  type="text"
                  required
                  value={demandTitle}
                  onChange={(e) => setDemandTitle(e.target.value)}
                  placeholder="Ex: Relatório de SLA dos Chamados da Secretaria de Educação..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Prioridade Institucional</label>
                <div className="flex gap-2">
                  {(['baixa', 'media', 'alta'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setDemandPriority(p)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
                        demandPriority === p 
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                          : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Especificação dos Dados / Campos Necessários
                </label>
                <textarea
                  rows={4}
                  required
                  value={demandDesc}
                  onChange={(e) => setDemandDesc(e.target.value)}
                  placeholder="Descreva o recorte temporal, departamentos envolvidos, métricas desejadas e objetivo do relatório..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500">Demanda assinada pelo perfil gestor</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-amber-500/20 hover:brightness-110"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Registrar Demanda</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
