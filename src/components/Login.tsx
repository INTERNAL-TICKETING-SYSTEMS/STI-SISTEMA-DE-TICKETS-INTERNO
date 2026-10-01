import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ShieldCheck, 
  Wrench, 
  UserCheck, 
  ArrowRight, 
  TicketCheck, 
  MessagesSquare 
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import Logo from '@/components/Logo';
import { UserRole } from '@/types';

const multiRoleAccountsConfig: Record<string, { name: string; roles: { id: UserRole; title: string; desc: string; icon: any }[] }> = {
  'wanderson.ti@orgao.to.gov.br': {
    name: 'Wanderson Silveira',
    roles: [
      { id: 'gestor', title: 'Painel do Gestor (BI & SLA)', desc: 'Visão executiva, indicadores e auditoria geral', icon: ShieldCheck },
      { id: 'tecnico', title: 'Console Operacional (Técnico)', desc: 'Atendimento direto da fila e resolução de ordens', icon: Wrench },
    ],
  },
  'diretor.geral@orgao.to.gov.br': {
    name: 'Dr. Carlos Eduardo Lima',
    roles: [
      { id: 'gestor', title: 'Diretoria Geral (Gestor)', desc: 'Acompanhamento estratégico, metas e relatórios consolidados', icon: ShieldCheck },
      { id: 'usuario', title: 'Portal do Solicitante (Servidor)', desc: 'Abertura e acompanhamento de chamados próprios', icon: UserCheck },
    ],
  },
  'roberto.gerencia@orgao.to.gov.br': {
    name: 'Roberto Albuquerque',
    roles: [
      { id: 'gestor', title: 'Gerência Operacional (Gestor)', desc: 'Auditoria de SLA, prazos de atendimento e relatórios', icon: ShieldCheck },
      { id: 'usuario', title: 'Portal do Solicitante (Servidor)', desc: 'Abertura e acompanhamento de chamados próprios', icon: UserCheck },
    ],
  },
};

interface LoginProps {
  onLogin: (email: string, role?: UserRole) => void;
  onGoToRegister: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [multiRoleData, setMultiRoleData] = useState<{
    email: string;
    name: string;
    roles: { id: UserRole; title: string; desc: string; icon: any }[];
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail) return;

    if (multiRoleAccountsConfig[cleanEmail]) {
      setMultiRoleData({
        email: cleanEmail,
        ...multiRoleAccountsConfig[cleanEmail],
      });
      return;
    }

    onLogin(cleanEmail);
  };

  const handleSelectRoleAndEnter = (role: UserRole) => {
    if (multiRoleData) {
      onLogin(multiRoleData.email, role);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 md:flex relative">
      {/* Modal de Escolha para Perfis Híbridos */}
      {multiRoleData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b1624] p-6 shadow-2xl text-white">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Selecione o Ambiente de Acesso</h3>
                <p className="text-xs text-slate-400">
                  Olá, <span className="text-amber-300 font-semibold">{multiRoleData.name}</span>. Escolha o perfil operacional para esta sessão:
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {multiRoleData.roles.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRoleAndEnter(r.id)}
                    className="group flex w-full items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:border-cyan-500/50 hover:bg-cyan-950/30"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-300">{r.title}</h4>
                        <span className="text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          Acessar &rarr;
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{r.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setMultiRoleData(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancelar e voltar ao login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          LADO ESQUERDO (Apresentação Visual Institucional)
      ====================================================== */}
      <section className="relative hidden overflow-hidden bg-[#0b1624] md:flex md:w-[42%] lg:w-[44%]">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative z-10 flex h-full w-full flex-col justify-between p-10 lg:p-14 text-white">
          <Logo />
          
          <div className="max-w-md space-y-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                <TicketCheck className="h-3.5 w-3.5" /> STI Conectado
              </span>
              <h2 className="text-2xl lg:text-3xl font-bold leading-tight">
                Gestão de TI centralizada, ágil e em conformidade de SLA.
              </h2>
            </div>
            <p className="text-sm text-slate-300">
              Acompanhamento de chamados em tempo real com controle de acessos, inventário de peças e métricas de produtividade.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                <div className="flex items-center gap-2 text-cyan-400 mb-1">
                  <MessagesSquare className="h-4 w-4" />
                  <span className="text-xs font-semibold">Atendimento Rápido</span>
                </div>
                <p className="text-[11px] text-slate-400">Comunicação direta com o solicitante.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                <div className="flex items-center gap-2 text-amber-400 mb-1">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-xs font-semibold">Auditoria de SLA</span>
                </div>
                <p className="text-[11px] text-slate-400">Controle rigoroso de prazos e metas.</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            STI &copy; {new Date().getFullYear()} - Governo do Estado do Tocantins
          </p>
        </div>
      </section>

      {/* =====================================================
          LADO DIREITO (Card de Login Refinado)
      ====================================================== */}
      <section className="flex min-h-screen flex-1 items-center justify-center bg-slate-50 px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-9 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Acesse sua conta</h1>
              <p className="text-sm text-slate-500">Entre com seu e-mail corporativo institucional.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="E-mail corporativo">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="email"
                    required
                    placeholder="seu.nome@orgao.to.gov.br"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-11"
                  />
                </div>
              </Field>

              <Field label="Senha de acesso">
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={senha}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
                    className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-11"
                  />
                </div>
              </Field>

              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-cyan-600 font-semibold text-white hover:bg-cyan-500 shadow-md shadow-cyan-600/20 flex items-center justify-center gap-2"
              >
                <span>Entrar no Sistema</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 text-xs text-slate-600 space-y-1.5">
              <p className="font-semibold text-slate-800">Contas Híbridas de Teste:</p>
              <p className="font-mono text-[11px] text-slate-500">wanderson.ti@orgao.to.gov.br (Gestor + Técnico)</p>
              <p className="font-mono text-[11px] text-slate-500">diretor.geral@orgao.to.gov.br (Gestor + Solicitante)</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
