import { registrarAuditoria } from '../services/auditService';
import React, { useEffect, useState } from 'react';

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

const THEME_STORAGE_KEY = 'sti_theme_preference';
const THEME_EVENT = 'sti-theme-change';

function getCurrentTheme(): 'light' | 'dark' {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return document.documentElement.dataset.theme === 'dark'
    ? 'dark'
    : 'light';
}

interface ProfileProps {
  user: User;
}

export default function Profile({ user }: ProfileProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    getCurrentTheme()
  );

  const isDark = theme === 'dark';

  useEffect(() => {
    const updateTheme = () => {
      setTheme(getCurrentTheme());
    };

    window.addEventListener(THEME_EVENT, updateTheme);
    window.addEventListener('storage', updateTheme);

    const observer = new MutationObserver(updateTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });

    updateTheme();

    return () => {
      window.removeEventListener(THEME_EVENT, updateTheme);
      window.removeEventListener('storage', updateTheme);
      observer.disconnect();
    };
  }, []);

  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '(63) 98400-0000',
    department:
      user.department ||
      'DTI - Diretoria de Tecnologia da Informação',
    role: user.role || 'Servidor / Colaborador',
  });

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = e.target.value
      .replace(/\D/g, '')
      .slice(0, 11);

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
  |--------------------------------------------------------------------------
  | CORES DO TEMA
  |--------------------------------------------------------------------------
  */

  const pageText = isDark
    ? 'text-slate-100'
    : 'text-slate-900';

  const headingText = isDark
    ? 'text-white'
    : 'text-slate-900';

  const secondaryText = isDark
    ? 'text-slate-400'
    : 'text-slate-600';

  const cardClass = isDark
    ? 'border-white/10 bg-[#0b1624]'
    : 'border-slate-200 bg-white';

  const sectionDivider = isDark
    ? 'border-white/10'
    : 'border-slate-200';

  const pageBackground = isDark
    ? 'bg-[#070e17]'
    : 'bg-slate-50';

  /*
  |--------------------------------------------------------------------------
  | LABELS DOS CAMPOS
  |--------------------------------------------------------------------------
  */

  const fieldLabelClass = [
    '[&>label]:!font-medium',
    isDark
      ? '[&>label]:!text-slate-200'
      : '[&>label]:!text-slate-700',
  ].join(' ');

  /*
  |--------------------------------------------------------------------------
  | INPUT EDITÁVEL
  |--------------------------------------------------------------------------
  */

  const editableInputClass = [
    'focus:!border-[#14b8a6]',
    'focus:!ring-[#14b8a6]/20',
    isDark
      ? [
        '!border-slate-700',
        '!bg-[#111f2e]',
        '!text-slate-100',
        'placeholder:!text-slate-500',
        '[color-scheme:dark]',
      ].join(' ')
      : [
        '!border-slate-300',
        '!bg-white',
        '!text-slate-900',
        'placeholder:!text-slate-400',
        '[color-scheme:light]',
      ].join(' '),
  ].join(' ');

  /*
  |--------------------------------------------------------------------------
  | INPUT BLOQUEADO
  |--------------------------------------------------------------------------
  */

  const lockedInputClass = [
    'cursor-not-allowed',
    'disabled:opacity-100',
    isDark
      ? [
        '!border-slate-700',
        '!bg-[#101c2a]',
        '!text-slate-200',
        'disabled:!bg-[#101c2a]',
        'disabled:!text-slate-200',
      ].join(' ')
      : [
        '!border-slate-300',
        '!bg-slate-100',
        '!text-slate-700',
        'disabled:!bg-slate-100',
        'disabled:!text-slate-700',
      ].join(' '),
  ].join(' ');

  /*
  |--------------------------------------------------------------------------
  | ÍCONES DOS CAMPOS
  |--------------------------------------------------------------------------
  */

  const lockedIconColor = isDark
    ? 'text-slate-500'
    : 'text-slate-400';

  const accentIconColor = isDark
    ? 'text-[#5eead4]'
    : 'text-[#0f766e]';

  return (
    <div
      className={[
        'min-h-screen w-full max-w-5xl space-y-6 pb-8',
        pageText,
        pageBackground,
        isDark
          ? '[color-scheme:dark]'
          : '[color-scheme:light]',
      ].join(' ')}
    >
      {/* CABEÇALHO */}

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1
            className={[
              'text-2xl font-bold',
              headingText,
            ].join(' ')}
          >
            Perfil Técnico
          </h1>

          <span
            className={[
              'inline-flex items-center gap-1.5',
              'rounded-full border px-2.5 py-1',
              'text-xs font-semibold',
              isDark
                ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700',
            ].join(' ')}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Ativo
          </span>
        </div>

        <p
          className={[
            'mt-1 text-sm',
            secondaryText,
          ].join(' ')}
        >
          Informações profissionais e dados de contato utilizados no
          Sistema de Tickets do DETRAN-TO.
        </p>
      </div>

      {/* IDENTIDADE DO TÉCNICO */}

      <section
        className={[
          'overflow-hidden rounded-2xl border shadow-xl',
          isDark
            ? 'border-white/10 bg-[#0b1624] shadow-black/20'
            : 'border-slate-200 bg-white shadow-slate-200/60',
        ].join(' ')}
      >
        <div
          className={[
            'relative overflow-hidden px-6 py-7',
            isDark
              ? 'bg-gradient-to-br from-[#07111d] via-[#0b1624] to-[#102033]'
              : 'bg-gradient-to-br from-white via-slate-50 to-teal-50/50',
          ].join(' ')}
        >
          <div
            className={[
              'pointer-events-none absolute right-0 top-0',
              'h-full w-1/3',
              isDark
                ? 'bg-gradient-to-l from-[#06b6b4]/10 to-transparent'
                : 'bg-gradient-to-l from-teal-100/70 to-transparent',
            ].join(' ')}
          />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div
                className="
                  flex h-20 w-20 shrink-0
                  items-center justify-center
                  rounded-2xl
                  border border-[#2dd4bf]/30
                  bg-gradient-to-br
                  from-[#14b8a6]
                  to-[#0f766e]
                  text-xl font-bold
                  text-white
                  shadow-lg
                  shadow-[#06b6b6]/10
                "
              >
                {initials}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2
                    className={[
                      'text-xl font-bold',
                      headingText,
                    ].join(' ')}
                  >
                    {form.name}
                  </h2>

                  <span
                    className={[
                      'inline-flex items-center gap-1',
                      'rounded-full border px-2.5 py-1',
                      'text-xs font-semibold',
                      isDark
                        ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700',
                    ].join(' ')}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Conta ativa
                  </span>
                </div>

                <p
                  className={[
                    'mt-1 text-sm font-medium',
                    isDark
                      ? 'text-slate-200'
                      : 'text-slate-700',
                  ].join(' ')}
                >
                  {form.role}
                </p>

                <div
                  className={[
                    'mt-2 flex items-center gap-1.5 text-sm',
                    secondaryText,
                  ].join(' ')}
                >
                  <Building2
                    className={[
                      'h-4 w-4',
                      accentIconColor,
                    ].join(' ')}
                  />
                  <span>{form.department}</span>
                </div>
              </div>
            </div>

            <div
              className={[
                'rounded-xl border px-4 py-3',
                isDark
                  ? 'border-[#06b6b4]/20 bg-[#06b6b4]/5'
                  : 'border-teal-200 bg-teal-50/70',
              ].join(' ')}
            >
              <p
                className={[
                  'text-xs font-medium',
                  secondaryText,
                ].join(' ')}
              >
                Perfil no STI
              </p>

              <p
                className={[
                  'mt-1 text-sm font-semibold capitalize',
                  isDark
                    ? 'text-[#5eead4]'
                    : 'text-[#0f766e]',
                ].join(' ')}
              >
                {profileLabel}
              </p>
            </div>
          </div>
        </div>

        {/* RESUMO */}

        <div
          className={[
            'grid gap-4 border-t p-6 sm:grid-cols-3',
            sectionDivider,
            isDark
              ? 'bg-[#08121f]'
              : 'bg-slate-50',
          ].join(' ')}
        >
          <div
            className={[
              'rounded-xl border p-4',
              'transition-colors duration-200',
              isDark
                ? 'border-[#2dd4bf]/20 bg-[#0f766e]/10 hover:border-[#2dd4bf]/40'
                : 'border-teal-200 bg-teal-50/60 hover:border-teal-300',
            ].join(' ')}
          >
            <div
              className={[
                'flex items-center gap-2',
                'text-xs font-semibold uppercase tracking-wide',
                isDark
                  ? 'text-[#5eead4]'
                  : 'text-[#0f766e]',
              ].join(' ')}
            >
              <Briefcase className="h-4 w-4" />
              Função
            </div>

            <p
              className={[
                'mt-2 text-sm font-semibold',
                isDark ? 'text-slate-100' : 'text-slate-800',
              ].join(' ')}
            >
              {form.role}
            </p>
          </div>

          <div
            className={[
              'rounded-xl border p-4',
              'transition-colors duration-200',
              isDark
                ? 'border-[#2dd4bf]/20 bg-[#0f766e]/10 hover:border-[#2dd4bf]/40'
                : 'border-teal-200 bg-teal-50/60 hover:border-teal-300',
            ].join(' ')}
          >
            <div
              className={[
                'flex items-center gap-2',
                'text-xs font-semibold uppercase tracking-wide',
                isDark
                  ? 'text-[#5eead4]'
                  : 'text-[#0f766e]',
              ].join(' ')}
            >
              <Building2 className="h-4 w-4" />
              Setor
            </div>

            <p
              className={[
                'mt-2 text-sm font-semibold',
                isDark ? 'text-slate-100' : 'text-slate-800',
              ].join(' ')}
            >
              {form.department}
            </p>
          </div>

          <div
            className={[
              'rounded-xl border p-4',
              'transition-colors duration-200',
              isDark
                ? 'border-[#2dd4bf]/20 bg-[#0f766e]/10 hover:border-[#2dd4bf]/40'
                : 'border-teal-200 bg-teal-50/60 hover:border-teal-300',
            ].join(' ')}
          >
            <div
              className={[
                'flex items-center gap-2',
                'text-xs font-semibold uppercase tracking-wide',
                isDark
                  ? 'text-[#5eead4]'
                  : 'text-[#0f766e]',
              ].join(' ')}
            >
              <IdCard className="h-4 w-4" />
              Perfil
            </div>

            <p
              className={[
                'mt-2 text-sm font-semibold capitalize',
                isDark ? 'text-slate-100' : 'text-slate-800',
              ].join(' ')}
            >
              {profileLabel}
            </p>
          </div>
        </div>
      </section>

      {/* INFORMAÇÕES PROFISSIONAIS */}

      <form
        onSubmit={handleSave}
        className={[
          'overflow-hidden rounded-2xl border shadow-xl',
          '[&_label]:!font-medium',
          cardClass,
          isDark
            ? 'shadow-black/20'
            : 'shadow-slate-200/60',
        ].join(' ')}
      >
        <div
          className={[
            'border-b px-6 py-5',
            sectionDivider,
          ].join(' ')}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={[
                  'mt-0.5 flex h-9 w-9 shrink-0',
                  'items-center justify-center rounded-lg',
                  isDark
                    ? 'bg-[#06b6b4]/10 text-[#5eead4]'
                    : 'bg-teal-50 text-teal-700',
                ].join(' ')}
              >
                <Briefcase className="h-4 w-4" />
              </div>

              <div>
                <h3
                  className={[
                    'text-sm font-bold uppercase tracking-wider',
                    headingText,
                  ].join(' ')}
                >
                  Informações profissionais
                </h3>

                <p
                  className={[
                    'mt-1 text-xs',
                    secondaryText,
                  ].join(' ')}
                >
                  Dados utilizados para identificação dentro do STI.
                </p>
              </div>
            </div>

            <div
              className={[
                'hidden items-center gap-2 rounded-lg',
                'border px-3 py-2 text-xs font-medium sm:flex',
                isDark
                  ? 'border-slate-700 bg-[#111d2b] text-slate-300'
                  : 'border-slate-200 bg-slate-50 text-slate-600',
              ].join(' ')}
            >
              <Pencil className="h-3.5 w-3.5" />
              Campos editáveis
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* IDENTIFICAÇÃO */}

          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#06b6b4]" />

              <h4
                className={[
                  'text-xs font-bold uppercase tracking-wider',
                  isDark
                    ? 'text-[#5eead4]'
                    : 'text-[#0f766e]',
                ].join(' ')}
              >
                Identificação
              </h4>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Nome completo"
                className={fieldLabelClass}
              >
                <div className="relative">
                  <UserIcon
                    className={[
                      'pointer-events-none absolute left-3.5 top-1/2',
                      'h-4 w-4 -translate-y-1/2',
                      accentIconColor,
                    ].join(' ')}
                  />

                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className={[
                      editableInputClass,
                      'pl-10',
                    ].join(' ')}
                    required
                  />
                </div>
              </Field>

              <Field
                label="Cargo / Função"
                className={fieldLabelClass}
              >
                <div className="relative">
                  <Briefcase
                    className={[
                      'pointer-events-none absolute left-3.5 top-1/2',
                      'h-4 w-4 -translate-y-1/2',
                      lockedIconColor,
                    ].join(' ')}
                  />

                  <Input
                    value={form.role}
                    disabled
                    className={[
                      lockedInputClass,
                      'pl-10',
                    ].join(' ')}
                  />

                  <LockKeyhole
                    className={[
                      'pointer-events-none absolute right-3.5 top-1/2',
                      'h-4 w-4 -translate-y-1/2',
                      lockedIconColor,
                    ].join(' ')}
                  />
                </div>
              </Field>

              <Field
                label="Setor / Lotação"
                className={fieldLabelClass}
              >
                <div className="relative">
                  <Building2
                    className={[
                      'pointer-events-none absolute left-3.5 top-1/2',
                      'h-4 w-4 -translate-y-1/2',
                      lockedIconColor,
                    ].join(' ')}
                  />

                  <Input
                    value={form.department}
                    disabled
                    className={[
                      lockedInputClass,
                      'pl-10',
                    ].join(' ')}
                  />

                  <LockKeyhole
                    className={[
                      'pointer-events-none absolute right-3.5 top-1/2',
                      'h-4 w-4 -translate-y-1/2',
                      lockedIconColor,
                    ].join(' ')}
                  />
                </div>
              </Field>

              <Field
                label="Perfil de acesso"
                className={fieldLabelClass}
              >
                <div className="relative">
                  <ShieldCheck
                    className={[
                      'pointer-events-none absolute left-3.5 top-1/2',
                      'h-4 w-4 -translate-y-1/2',
                      accentIconColor,
                    ].join(' ')}
                  />

                  <Input
                    value={profileLabel}
                    disabled
                    className={[
                      lockedInputClass,
                      'pl-10',
                    ].join(' ')}
                  />

                  <LockKeyhole
                    className={[
                      'pointer-events-none absolute right-3.5 top-1/2',
                      'h-4 w-4 -translate-y-1/2',
                      lockedIconColor,
                    ].join(' ')}
                  />
                </div>
              </Field>
            </div>
          </div>

          {/* COMUNICAÇÃO */}

          <div
            className={[
              'border-t pt-6',
              sectionDivider,
            ].join(' ')}
          >
            <div className="mb-4 flex items-start gap-3">
              <div
                className={[
                  'flex h-9 w-9 shrink-0',
                  'items-center justify-center rounded-lg',
                  isDark
                    ? 'bg-[#06b6b4]/10 text-[#5eead4]'
                    : 'bg-teal-50 text-teal-700',
                ].join(' ')}
              >
                <Phone className="h-4 w-4" />
              </div>

              <div>
                <h4
                  className={[
                    'text-xs font-bold uppercase tracking-wider',
                    isDark
                      ? 'text-[#5eead4]'
                      : 'text-[#0f766e]',
                  ].join(' ')}
                >
                  Canais de comunicação
                </h4>

                <p
                  className={[
                    'mt-1 text-xs',
                    secondaryText,
                  ].join(' ')}
                >
                  Utilizados para comunicações e notificações relacionadas aos chamados.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="E-mail institucional"
                className={fieldLabelClass}
              >
                <div className="relative">
                  <Mail
                    className={[
                      'pointer-events-none absolute left-3.5 top-1/2',
                      'h-4 w-4 -translate-y-1/2',
                      lockedIconColor,
                    ].join(' ')}
                  />

                  <Input
                    type="email"
                    value={form.email}
                    disabled
                    className={[
                      lockedInputClass,
                      'pl-10',
                    ].join(' ')}
                  />

                  <LockKeyhole
                    className={[
                      'pointer-events-none absolute right-3.5 top-1/2',
                      'h-4 w-4 -translate-y-1/2',
                      lockedIconColor,
                    ].join(' ')}
                  />
                </div>
              </Field>

              <Field
                label="Telefone / WhatsApp"
                className={fieldLabelClass}
              >
                <div className="relative">
                  <Phone
                    className={[
                      'pointer-events-none absolute left-3.5 top-1/2',
                      'h-4 w-4 -translate-y-1/2',
                      accentIconColor,
                    ].join(' ')}
                  />

                  <Input
                    value={form.phone}
                    onChange={handlePhoneChange}
                    className={[
                      editableInputClass,
                      'pl-10',
                    ].join(' ')}
                    required
                  />
                </div>
              </Field>
            </div>
          </div>
        </div>

        {/* RODAPÉ */}

        <div
          className={[
            'flex flex-col gap-3 border-t px-6 py-4',
            'sm:flex-row sm:items-center sm:justify-between',
            sectionDivider,
            isDark
              ? 'bg-[#08121f]'
              : 'bg-slate-50',
          ].join(' ')}
        >
          <div className="flex items-start gap-2">
            <ShieldCheck
              className={[
                'mt-0.5 h-4 w-4 shrink-0',
                accentIconColor,
              ].join(' ')}
            />

            <p
              className={[
                'text-xs leading-5',
                secondaryText,
              ].join(' ')}
            >
              Alterações realizadas neste perfil são registradas na
              auditoria do sistema.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {saved && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
                <CheckCircle2 className="h-4 w-4" />
                Alterações salvas!
              </span>
            )}

            <Button
              type="submit"
              variant="primary"
            >
              Salvar alterações
            </Button>
          </div>
        </div>
      </form>

      {/* SEGURANÇA E CONTA */}

      <section
        className={[
          'overflow-hidden rounded-2xl border shadow-xl',
          cardClass,
          isDark
            ? 'shadow-black/20'
            : 'shadow-slate-200/60',
        ].join(' ')}
      >
        <div
          className={[
            'border-b px-6 py-5',
            sectionDivider,
          ].join(' ')}
        >
          <div className="flex items-start gap-3">
            <div
              className={[
                'flex h-9 w-9 shrink-0',
                'items-center justify-center rounded-lg',
                isDark
                  ? 'bg-[#06b6b4]/10 text-[#5eead4]'
                  : 'bg-teal-50 text-teal-700',
              ].join(' ')}
            >
              <ShieldCheck className="h-4 w-4" />
            </div>

            <div>
              <h3
                className={[
                  'text-sm font-bold uppercase tracking-wider',
                  headingText,
                ].join(' ')}
              >
                Segurança e conta
              </h3>

              <p
                className={[
                  'mt-1 text-xs',
                  secondaryText,
                ].join(' ')}
              >
                Informações relacionadas ao acesso do usuário ao sistema.
              </p>
            </div>
          </div>
        </div>

        <div
          className={[
            'grid gap-4 p-6',
            isDark
              ? 'bg-[#08121f]'
              : 'bg-slate-50',
            'sm:grid-cols-2',
          ].join(' ')}
        >
          {/* Status */}

          <div
            className={[
              'flex items-center justify-between',
              'rounded-xl border p-4',
              isDark
                ? 'border-emerald-500/20 bg-emerald-950/30'
                : 'border-emerald-200 bg-emerald-50',
            ].join(' ')}
          >
            <div>
              <p
                className={[
                  'text-xs font-medium',
                  isDark
                    ? 'text-slate-400'
                    : 'text-slate-600',
                ].join(' ')}
              >
                Status da conta
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />

                <span
                  className={[
                    'text-sm font-bold',
                    isDark
                      ? 'text-emerald-300'
                      : 'text-emerald-700',
                  ].join(' ')}
                >
                  Ativo
                </span>
              </div>
            </div>

            <div
              className={[
                'flex h-9 w-9 items-center justify-center',
                'rounded-lg border',
                isDark
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                  : 'border-emerald-200 bg-white text-emerald-600',
              ].join(' ')}
            >
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>

          {/* Identificação */}

          <div
            className={[
              'flex items-center justify-between',
              'rounded-xl border p-4',
              isDark
                ? 'border-[#06b6b4]/20 bg-[#06b6b4]/5'
                : 'border-teal-200 bg-teal-50/60',
            ].join(' ')}
          >
            <div className="min-w-0">
              <p
                className={[
                  'text-xs font-medium',
                  isDark
                    ? 'text-slate-400'
                    : 'text-slate-600',
                ].join(' ')}
              >
                Identificação da conta
              </p>

              <p
                className={[
                  'mt-1 truncate text-sm font-semibold',
                  isDark
                    ? 'text-slate-100'
                    : 'text-slate-800',
                ].join(' ')}
              >
                {user.email}
              </p>
            </div>

            <div
              className={[
                'ml-3 flex h-9 w-9 shrink-0',
                'items-center justify-center rounded-lg border',
                isDark
                  ? 'border-[#06b6b4]/20 bg-[#06b6b4]/10 text-[#5eead4]'
                  : 'border-teal-200 bg-white text-teal-700',
              ].join(' ')}
            >
              <LockKeyhole className="h-4 w-4" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}