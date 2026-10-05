import { registrarAuditoria } from '../services/auditService';
import React, { useState } from 'react';
import { User } from '@/types';
import Button from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import {
  Mail,
  Phone,
  Building2,
  Briefcase,
  User as UserIcon,
  ShieldCheck,
  CheckCircle2,
  Pencil,
  LockKeyhole,
  IdCard,
} from 'lucide-react';

interface ProfileProps {
  user: User;
}

export default function Profile({ user }: ProfileProps) {
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '(63) 98400-0000',
    department:
      user.department || 'DTI - Diretoria de Tecnologia da Informação',
    role: user.role || 'Servidor / Colaborador',
  });

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 11);

    if (value.length > 6) {
      value = value.replace(
        /(\d{2})(\d{5})(\d{1,4})/,
        '($1) $2-$3'
      );
    } else if (value.length > 2) {
      value = value.replace(
        /(\d{2})(\d{1,5})/,
        '($1) $2'
      );
    }

    setForm((prev) => ({
      ...prev,
      phone: value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    setSaved(true);

    registrarAuditoria({
      entidade: 'USUARIO',
      idEntidade: user.email,
      tipoOperacao: 'ATUALIZACAO_PERFIL',
      autor: user.email,
      estadoAtual: {
        nome: form.name,
        telefone: form.phone,
        departamento: form.department,
      },
      metadados: {
        alteradoEm: new Date().toISOString(),
      },
    }).catch((err) =>
      console.error(
        '[Auditoria] Falha no log de perfil:',
        err
      )
    );

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const initials = form.name
    .trim()
    .split(/\s+/)
    .map((name) => name[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const profileLabel =
    user.userRole === 'usuario'
      ? 'Colaborador / Solicitante'
      : user.userRole;

  /*
   * Estilo comum dos labels.
   * Mantém todos os textos dos campos claros no modo escuro.
   */
  const fieldLabelClass =
    '[&>label]:!text-slate-100';

  /*
   * Campo editável.
   *
   * Os !important do Tailwind (!) são intencionais aqui:
   * o componente Input possui estilos próprios e poderia
   * sobrescrever o fundo/texto.
   */
  const editableInputClass =
    '!border-slate-700 ' +
    '!bg-slate-800 ' +
    '!text-slate-100 ' +
    'placeholder:!text-slate-500 ' +
    'focus:!border-[#14b8a6] ' +
    'focus:!ring-[#14b8a6]/20';

  /*
   * Campo bloqueado.
   *
   * Mantém o fundo escuro e força o texto claro mesmo
   * quando o navegador aplica estilos de disabled.
   */
  const lockedInputClass =
    'cursor-not-allowed ' +
    '!border-slate-700 ' +
    '!bg-slate-800/80 ' +
    '!text-slate-100 ' +
    'disabled:!bg-slate-800/80 ' +
    'disabled:!text-slate-100 ' +
    'disabled:opacity-100';

  return (
    <div className="max-w-5xl space-y-6 pb-8">

      {/* =========================================================
          CABEÇALHO
      ========================================================= */}
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-100">
            Perfil Técnico
          </h1>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Ativo
          </span>
        </div>

        <p className="mt-1 text-sm text-slate-400">
          Informações profissionais e dados de contato utilizados no
          Sistema de Tickets do DETRAN-TO.
        </p>
      </div>

      {/* =========================================================
          IDENTIDADE DO TÉCNICO
      ========================================================= */}
      <section className="overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-xl shadow-black/10">

        {/* Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-7">

          {/* Detalhe visual STI */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#06b6b4]/10 to-transparent" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              {/* Avatar */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-[#2dd4bf]/30 bg-gradient-to-br from-[#14b8a6] to-[#0f766e] text-xl font-bold text-white shadow-lg shadow-[#06b6b4]/10">
                {initials}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">

                  <h2 className="text-xl font-bold text-white">
                    {form.name}
                  </h2>

                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Conta ativa
                  </span>

                </div>

                <p className="mt-1 text-sm font-medium text-slate-200">
                  {form.role}
                </p>

                <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-300">
                  <Building2 className="h-4 w-4 text-[#2dd4bf]" />
                  <span>{form.department}</span>
                </div>
              </div>
            </div>

            {/* Perfil STI */}
            <div className="rounded-xl border border-[#06b6b4]/20 bg-[#06b6b4]/5 px-4 py-3">
              <p className="text-xs font-medium text-slate-400">
                Perfil no STI
              </p>

              <p className="mt-1 text-sm font-semibold capitalize text-[#5eead4]">
                {profileLabel}
              </p>
            </div>

          </div>
        </div>

        {/* =====================================================
            RESUMO
        ===================================================== */}
        <div className="grid gap-4 border-t border-slate-700/70 bg-slate-950/70 p-6 sm:grid-cols-3">

          {/* Função */}
          <div className="rounded-xl border border-[#2dd4bf]/20 bg-[#0f766e]/10 p-4 transition-colors hover:border-[#2dd4bf]/40">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#5eead4]">
              <Briefcase className="h-4 w-4" />
              Função
            </div>

            <p className="mt-2 text-sm font-semibold text-slate-100">
              {form.role}
            </p>
          </div>

          {/* Setor */}
          <div className="rounded-xl border border-[#2dd4bf]/20 bg-[#0f766e]/10 p-4 transition-colors hover:border-[#2dd4bf]/40">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#5eead4]">
              <Building2 className="h-4 w-4" />
              Setor
            </div>

            <p className="mt-2 text-sm font-semibold text-slate-100">
              {form.department}
            </p>
          </div>

          {/* Perfil */}
          <div className="rounded-xl border border-[#2dd4bf]/20 bg-[#0f766e]/10 p-4 transition-colors hover:border-[#2dd4bf]/40">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#5eead4]">
              <IdCard className="h-4 w-4" />
              Perfil
            </div>

            <p className="mt-2 text-sm font-semibold capitalize text-slate-100">
              {profileLabel}
            </p>
          </div>

        </div>
      </section>

      {/* =========================================================
          INFORMAÇÕES PROFISSIONAIS
      ========================================================= */}
      <form
        onSubmit={handleSave}
        className="
          overflow-hidden
          rounded-2xl
          border border-slate-700/80
          bg-slate-900
          shadow-xl shadow-black/10
          [&_label]:!text-slate-100
        "
      >

        {/* Cabeçalho da seção */}
        <div className="border-b border-slate-700/80 px-6 py-5">
          <div className="flex items-center justify-between gap-4">

            <div className="flex items-start gap-3">

              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#06b6b4]/10 text-[#5eead4]">
                <Briefcase className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100">
                  Informações profissionais
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Dados utilizados para identificação dentro do STI.
                </p>
              </div>

            </div>

            <div className="hidden items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-2 text-xs font-medium text-slate-300 sm:flex">
              <Pencil className="h-3.5 w-3.5" />
              Campos editáveis
            </div>

          </div>
        </div>

        <div className="space-y-6 p-6">

          {/* =====================================================
              IDENTIFICAÇÃO
          ===================================================== */}
          <div>

            <div className="mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#06b6b4]" />

              <h4 className="text-xs font-bold uppercase tracking-wider text-[#5eead4]">
                Identificação
              </h4>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              {/* Nome */}
              <Field
                label="Nome completo"
                className={fieldLabelClass}
              >
                <div className="relative">

                  <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2dd4bf]" />

                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className={`${editableInputClass} pl-10`}
                    required
                  />

                </div>
              </Field>

              {/* Cargo */}
              <Field
                label="Cargo / Função"
                className={fieldLabelClass}
              >
                <div className="relative">

                  <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <Input
                    value={form.role}
                    disabled
                    className={`${lockedInputClass} pl-10`}
                  />

                  <LockKeyhole className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                </div>
              </Field>

              {/* Setor */}
              <Field
                label="Setor / Lotação"
                className={fieldLabelClass}
              >
                <div className="relative">

                  <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <Input
                    value={form.department}
                    disabled
                    className={`${lockedInputClass} pl-10`}
                  />

                  <LockKeyhole className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                </div>
              </Field>

              {/* Perfil */}
              <Field
                label="Perfil de acesso"
                className={fieldLabelClass}
              >
                <div className="relative">

                  <ShieldCheck className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2dd4bf]" />

                  <Input
                    value={profileLabel}
                    disabled
                    className={`${lockedInputClass} pl-10`}
                  />

                  <LockKeyhole className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                </div>
              </Field>

            </div>
          </div>

          {/* =====================================================
              COMUNICAÇÃO
          ===================================================== */}
          <div className="border-t border-slate-700/80 pt-6">

            <div className="mb-4 flex items-start gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#06b6b4]/10 text-[#5eead4]">
                <Phone className="h-4 w-4" />
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#5eead4]">
                  Canais de comunicação
                </h4>

                <p className="mt-1 text-xs text-slate-400">
                  Utilizados para comunicações e notificações relacionadas aos chamados.
                </p>
              </div>

            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              {/* E-mail */}
              <Field
                label="E-mail institucional"
                className={fieldLabelClass}
              >
                <div className="relative">

                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <Input
                    type="email"
                    value={form.email}
                    disabled
                    className={`${lockedInputClass} pl-10`}
                  />

                  <LockKeyhole className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                </div>
              </Field>

              {/* Telefone */}
              <Field
                label="Telefone / WhatsApp"
                className={fieldLabelClass}
              >
                <div className="relative">

                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2dd4bf]" />

                  <Input
                    value={form.phone}
                    onChange={handlePhoneChange}
                    className={`${editableInputClass} pl-10`}
                    required
                  />

                </div>
              </Field>

            </div>
          </div>

        </div>

        {/* =====================================================
            RODAPÉ
        ========================================================= */}
        <div className="flex flex-col gap-3 border-t border-slate-700/80 bg-slate-950/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-2">

            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#2dd4bf]" />

            <p className="text-xs leading-5 text-slate-400">
              Alterações realizadas neste perfil são registradas na auditoria do sistema.
            </p>

          </div>

          <div className="flex items-center gap-3">

            {saved && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Alterações salvas!
              </span>
            )}

            <Button type="submit" variant="primary">
              Salvar alterações
            </Button>

          </div>
        </div>

      </form>

      {/* =========================================================
          SEGURANÇA E CONTA
      ========================================================= */}
      <section className="overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-xl shadow-black/10">

        {/* Cabeçalho */}
        <div className="border-b border-slate-700/80 px-6 py-5">

          <div className="flex items-start gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#06b6b4]/10 text-[#5eead4]">
              <ShieldCheck className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100">
                Segurança e conta
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Informações relacionadas ao acesso do usuário ao sistema.
              </p>
            </div>

          </div>
        </div>

        <div className="grid gap-4 bg-slate-950/40 p-6 sm:grid-cols-2">

          {/* Status */}
          <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-950/30 p-4">

            <div>
              <p className="text-xs font-medium text-slate-400">
                Status da conta
              </p>

              <div className="mt-1 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />

                <span className="text-sm font-bold text-emerald-300">
                  Ativo
                </span>

              </div>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>

          </div>

          {/* Identificação */}
          <div className="flex items-center justify-between rounded-xl border border-[#06b6b4]/20 bg-[#06b6b4]/5 p-4">

            <div className="min-w-0">

              <p className="text-xs font-medium text-slate-400">
                Identificação da conta
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-slate-100">
                {user.email}
              </p>

            </div>

            <div className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#06b6b4]/20 bg-[#06b6b4]/10 text-[#5eead4]">
              <LockKeyhole className="h-4 w-4" />
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}