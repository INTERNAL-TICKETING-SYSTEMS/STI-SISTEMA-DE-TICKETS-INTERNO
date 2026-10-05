import { dbRepository } from '../services/dbRepository';
import { enviarOtpMetaWhatsApp } from '../services/metaWhatsappService';
import React, { useEffect, useState } from 'react';
import {
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
  UserPlus,
  ArrowRight,
  MessagesSquare,
  Shield,
  Activity,
  BarChart3,
  CheckCircle2,
  Moon,
  Sun,
  X,
} from 'lucide-react';

import Button from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import Logo from '@/components/Logo';
import { UserRole } from '@/types';

const THEME_STORAGE_KEY = 'sti-login-theme';

type ThemeMode = 'light' | 'dark';

const multiRoleAccountsConfig: Record<
  string,
  {
    name: string;
    roles: {
      id: UserRole;
      title: string;
      desc: string;
      icon: any;
    }[];
  }
> = {
  'wanderson.maior@sti.chamados.com': {
    name: 'Wanderson Alves Maior',
    roles: [
      {
        id: 'tecnico',
        title: 'Console Técnico STI',
        desc: 'Atendimento de chamados e suporte',
        icon: Activity,
      },
      {
        id: 'gestor',
        title: 'Painel Gestor STI',
        desc: 'Métricas, relatórios e auditoria',
        icon: BarChart3,
      },
    ],
  },

  'luigue.brandao@sti.chamados.com': {
    name: 'Luigue Soares Brandão',
    roles: [
      {
        id: 'gestor',
        title: 'Painel da Diretoria Administrativa',
        desc: 'Gestão executiva, SLA e governança',
        icon: BarChart3,
      },
      {
        id: 'usuario',
        title: 'Portal do Solicitante',
        desc: 'Abertura de chamados internos',
        icon: UserCheck,
      },
    ],
  },

  'elias.junior@sti.chamados.com': {
    name: 'Elias Nunes da Silva Junior',
    roles: [
      {
        id: 'gestor',
        title: 'Painel da Gerência Administrativa',
        desc: 'Gestão operacional e relatórios',
        icon: BarChart3,
      },
      {
        id: 'usuario',
        title: 'Portal do Solicitante',
        desc: 'Abertura de chamados internos',
        icon: UserCheck,
      },
    ],
  },
};

interface LoginProps {
  onLogin: (email: string, role?: UserRole) => void;
  onGoToRegister: () => void;
}

export default function Login({
  onLogin,
  onGoToRegister,
}: LoginProps) {
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const [forgotInput, setForgotInput] = useState('');
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotStep, setForgotStep] =
    useState<'IDENTIFY' | 'VERIFY'>('IDENTIFY');

  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtpInput, setUserOtpInput] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [forgotTargetAccount, setForgotTargetAccount] =
    useState<string>('');

  const [forgotSuccessMessage, setForgotSuccessMessage] =
    useState('');

  const [forgotErrorMessage, setForgotErrorMessage] =
    useState('');

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [multiRoleData, setMultiRoleData] = useState<{
    email: string;
    name: string;
    roles: {
      id: UserRole;
      title: string;
      desc: string;
      icon: any;
    }[];
  } | null>(null);

  const [sendingOtp, setSendingOtp] = useState(false);

  /*
   * ============================================================
   * TEMA
   * ============================================================
   *
   * Primeiro acesso:
   * - respeita o sistema operacional/navegador.
   *
   * Depois:
   * - se o usuário trocar manualmente, salvamos a escolha.
   */

  const getInitialTheme = (): ThemeMode => {
    const savedTheme = localStorage.getItem(
      THEME_STORAGE_KEY
    ) as ThemeMode | null;

    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }

    return 'light';
  };

  const [theme, setTheme] =
    useState<ThemeMode>(getInitialTheme);

  const isDark = theme === 'dark';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);

    document.documentElement.style.colorScheme = isDark
      ? 'dark'
      : 'light';

    return () => {
      document.documentElement.style.colorScheme = '';
    };
  }, [isDark]);

  const toggleTheme = () => {
    const nextTheme: ThemeMode =
      theme === 'dark' ? 'light' : 'dark';

    setTheme(nextTheme);

    localStorage.setItem(
      THEME_STORAGE_KEY,
      nextTheme
    );
  };

  /*
   * ============================================================
   * RECUPERAÇÃO DE SENHA
   * ============================================================
   */

  const handleGenerateRecoveryCode = async () => {
    setForgotErrorMessage('');

    const input = forgotInput.trim().toLowerCase();
    const rawPhone = forgotPhone.replace(/\D/g, '');

    if (!input) {
      setForgotErrorMessage(
        'Informe seu e-mail cadastrado ou matrícula.'
      );
      return;
    }

    if (rawPhone.length < 10) {
      setForgotErrorMessage(
        'Informe seu número de WhatsApp com DDD (ex: 63984000000).'
      );
      return;
    }

    setSendingOtp(true);

    try {
      const code = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      setGeneratedOtp(code);
      setForgotTargetAccount(input);

      const result = await enviarOtpMetaWhatsApp({
        phoneNumber: rawPhone,
        otpCode: code,
        accountEmail: input,
      });

      const user =
        await dbRepository.buscarUsuarioPorLogin(input);

      const userId = user
        ? user.id
        : 'b0000000-0000-0000-0000-000000000003';

      await dbRepository.salvarRecuperacaoOtp(
        userId,
        code,
        result.messageId
      );

      if (!result.success) {
        setForgotErrorMessage(
          `Erro Meta: ${result.error}`
        );

        console.error(
          'Detalhes do erro Meta:',
          result.metaDetails
        );

        return;
      }

      setForgotStep('VERIFY');
    } catch (err: any) {
      setForgotErrorMessage(
        err?.message ||
          'Erro de conexão ao solicitar recuperação.'
      );
    } finally {
      setSendingOtp(false);
    }
  };

  const handleConfirmNewPassword = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setForgotErrorMessage('');

    if (userOtpInput.trim() !== generatedOtp) {
      setForgotErrorMessage(
        'Código de segurança incorreto ou expirado.'
      );
      return;
    }

    if (newPassword.length < 4) {
      setForgotErrorMessage(
        'A nova senha deve ter no mínimo 4 caracteres.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotErrorMessage(
        'As senhas não coincidem.'
      );
      return;
    }

    const customPasswords = JSON.parse(
      localStorage.getItem(
        'sti_custom_passwords'
      ) || '{}'
    );

    customPasswords[forgotTargetAccount] =
      newPassword;

    localStorage.setItem(
      'sti_custom_passwords',
      JSON.stringify(customPasswords)
    );

    const registeredUsers = JSON.parse(
      localStorage.getItem(
        'sti_registered_users'
      ) || '[]'
    );

    const updatedUsers = registeredUsers.map(
      (u: any) => {
        if (
          u.email.toLowerCase() ===
          forgotTargetAccount
        ) {
          return {
            ...u,
            password: newPassword,
          };
        }

        return u;
      }
    );

    localStorage.setItem(
      'sti_registered_users',
      JSON.stringify(updatedUsers)
    );

    setForgotSuccessMessage(
      'Senha redefinida com sucesso! Você já pode entrar com a nova credencial.'
    );

    setTimeout(() => {
      setIsForgotOpen(false);
      setForgotStep('IDENTIFY');
      setForgotSuccessMessage('');
      setForgotErrorMessage('');
      setSenha(newPassword);
      setEmail(forgotTargetAccount);
    }, 2000);
  };

  /*
   * ============================================================
   * LOGIN
   * ============================================================
   */

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const cleanEmail =
      email.toLowerCase().trim();

    if (!cleanEmail) return;

    const isTechEmail = [
      'carlos.daniel@sti.chamados.com',
      'joao.pedro@sti.chamados.com',
      'guilherme.ferreira@sti.chamados.com',
      'wanderson.maior@sti.chamados.com',
    ].includes(cleanEmail);

    const customPasswords = JSON.parse(
      localStorage.getItem(
        'sti_custom_passwords'
      ) || '{}'
    );

    const customPass =
      customPasswords[cleanEmail];

    if (
      isTechEmail &&
      senha &&
      senha !== '.\\ati@!#$%2020' &&
      senha !== 'ati2020' &&
      (!customPass ||
        customPass !== senha)
    ) {
      alert(
        'Senha incorreta para perfil técnico de suporte STI. Use a credencial operacional autorizada.'
      );

      return;
    }

    if (
      multiRoleAccountsConfig[cleanEmail]
    ) {
      setMultiRoleData({
        email: cleanEmail,
        ...multiRoleAccountsConfig[
          cleanEmail
        ],
      });

      return;
    }

    onLogin(cleanEmail);
  };

  const handleSelectRoleAndEnter = (
    role: UserRole
  ) => {
    if (multiRoleData) {
      onLogin(
        multiRoleData.email,
        role
      );
    }
  };

  /*
   * ============================================================
   * CLASSES VISUAIS
   * ============================================================
   */

  const pageBackground = isDark
    ? 'bg-[#06111d]'
    : 'bg-slate-100';

  const loginPanelBackground = isDark
    ? 'bg-[#071421]'
    : 'bg-slate-50';

  const cardBackground = isDark
    ? 'bg-[#0b1727]'
    : 'bg-white';

  const cardBorder = isDark
    ? 'border-slate-700/80'
    : 'border-slate-200';

  const headingColor = isDark
    ? 'text-white'
    : 'text-slate-950';

  const bodyColor = isDark
    ? 'text-slate-300'
    : 'text-slate-600';

  const mutedColor = isDark
    ? 'text-slate-400'
    : 'text-slate-500';

  const inputBackground = isDark
    ? 'bg-[#101e30]'
    : 'bg-slate-50';

  const inputBorder = isDark
    ? 'border-slate-600'
    : 'border-slate-200';

  const inputText = isDark
    ? 'text-white'
    : 'text-slate-900';

  const inputPlaceholder = isDark
    ? 'placeholder:text-slate-500'
    : 'placeholder:text-slate-400';

  return (
    <div
      className={`relative min-h-screen transition-colors duration-300 ${pageBackground} md:flex`}
    >
      {/* =====================================================
          MODAL MULTI-ROLE
      ====================================================== */}

      {multiRoleData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div
            className="
              w-full
              max-w-2xl
              rounded-3xl
              border
              border-white/10
              bg-[#0b1624]
              p-7
              text-white
              shadow-2xl
              sm:p-9
            "
          >
            <div className="flex items-center gap-4 border-b border-white/10 pb-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">
                  Selecione o Ambiente de Acesso
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Olá,{' '}
                  <span className="font-semibold text-cyan-300">
                    {multiRoleData.name}
                  </span>
                  . Escolha o perfil operacional para esta sessão.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {multiRoleData.roles.map((r) => {
                const Icon = r.icon;

                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() =>
                      handleSelectRoleAndEnter(
                        r.id
                      )
                    }
                    className="
                      group
                      flex
                      w-full
                      items-start
                      gap-4
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.04]
                      p-5
                      text-left
                      transition-all
                      hover:border-cyan-500/50
                      hover:bg-cyan-950/30
                      focus:outline-none
                      focus:ring-2
                      focus:ring-cyan-400
                    "
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 transition-colors group-hover:bg-cyan-500 group-hover:text-slate-950">
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="text-base font-bold text-white group-hover:text-cyan-300">
                          {r.title}
                        </h4>

                        <span className="hidden text-sm font-semibold text-cyan-400 opacity-0 transition-opacity group-hover:opacity-100 sm:block">
                          Acessar →
                        </span>
                      </div>

                      <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                        {r.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-7 flex justify-end border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={() =>
                  setMultiRoleData(null)
                }
                className="min-h-11 rounded-xl px-4 text-sm font-semibold text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                Cancelar e voltar ao login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          BOTÃO DE TEMA
      ====================================================== */}

      <div className="absolute right-5 top-5 z-40 sm:right-7 sm:top-7">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            isDark
              ? 'Ativar modo claro'
              : 'Ativar modo escuro'
          }
          title={
            isDark
              ? 'Ativar modo claro'
              : 'Ativar modo escuro'
          }
          className={`
            flex
            min-h-11
            items-center
            gap-2
            rounded-xl
            border
            px-3
            text-sm
            font-semibold
            transition-all
            focus:outline-none
            focus:ring-2
            focus:ring-cyan-400
            ${
              isDark
                ? 'border-slate-600 bg-slate-900/90 text-cyan-300 hover:border-cyan-500/60 hover:bg-slate-800'
                : 'border-slate-300 bg-white/95 text-slate-700 shadow-sm hover:border-cyan-400 hover:text-cyan-700'
            }
          `}
        >
          {isDark ? (
            <>
              <Sun className="h-5 w-5" />
              <span className="hidden sm:inline">
                Modo claro
              </span>
            </>
          ) : (
            <>
              <Moon className="h-5 w-5" />
              <span className="hidden sm:inline">
                Modo escuro
              </span>
            </>
          )}
        </button>
      </div>

      {/* =====================================================
          PAINEL ESQUERDO
      ====================================================== */}

      <section className="relative hidden overflow-hidden bg-[#081522] md:flex md:w-[42%] md:flex-col lg:w-[44%]">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative z-10 flex min-h-screen w-full flex-col justify-between p-8 text-white lg:p-12">
          <div className="w-fit max-w-full animate-sti-logo">
            <Logo
              variant="login"
              light
              className="drop-shadow-[0_0_18px_rgba(20,184,166,0.16)]"
            />
          </div>

          <div className="my-10 max-w-xl space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-teal-400" />

              Suporte de TI em um só lugar
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
                Precisa de alguma
                <br />
                ajuda?
              </h2>

              <p className="max-w-lg text-base leading-relaxed text-slate-300 lg:text-lg">
                Abra seu chamado, acompanhe o atendimento e veja as atualizações sem complicação.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-400/[0.07]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
                  <MessagesSquare className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-white">
                    1. Peça ajuda
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-slate-400">
                    Conte o que aconteceu e envie sua solicitação.
                  </p>
                </div>

                <ArrowRight className="h-5 w-5 shrink-0 text-cyan-400" />
              </div>

              <div className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:border-teal-400/40 hover:bg-teal-400/[0.07]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 text-teal-300">
                  <Activity className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-white">
                    2. Acompanhe
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-slate-400">
                    Veja o andamento do seu chamado.
                  </p>
                </div>

                <ArrowRight className="h-5 w-5 shrink-0 text-teal-400" />
              </div>

              <div className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:border-emerald-400/40 hover:bg-emerald-400/[0.07]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                  <CheckCircle2 className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-white">
                    3. Confira a solução
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-slate-400">
                    Consulte a conclusão do atendimento.
                  </p>
                </div>

                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            STI © {new Date().getFullYear()}
          </p>
        </div>
      </section>

      {/* =====================================================
          LADO DIREITO — LOGIN
      ====================================================== */}

      <section
        className={`
          flex
          min-h-screen
          flex-1
          items-center
          justify-center
          px-5
          py-16
          transition-colors
          duration-300
          sm:px-8
          lg:px-12
          xl:px-16
          ${loginPanelBackground}
        `}
      >
        <div className="w-full max-w-xl">
          <div
            className={`
              space-y-7
              rounded-3xl
              border
              p-8
              shadow-2xl
              transition-colors
              duration-300
              sm:p-10
              lg:p-12
              ${cardBackground}
              ${cardBorder}
              ${
                isDark
                  ? 'shadow-black/30'
                  : 'shadow-slate-300/50'
              }
            `}
          >
            {/* Cabeçalho */}

            <div className="space-y-3">
              <h1
                className={`text-3xl font-bold tracking-tight sm:text-4xl ${headingColor}`}
              >
                Acesse sua conta
              </h1>

              <p
                className={`text-base leading-relaxed sm:text-lg ${bodyColor}`}
              >
                Entre com seu e-mail corporativo institucional.
              </p>
            </div>

            {/* Formulário */}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <Field label="E-mail corporativo">
                <div className="relative">
                  <Mail
                    className={`
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      h-5
                      w-5
                      -translate-y-1/2
                      ${
                        isDark
                          ? 'text-slate-400'
                          : 'text-slate-400'
                      }
                    `}
                  />

                  <Input
                    type="email"
                    required
                    placeholder="seu.nome@orgao.to.gov.br"
                    value={email}
                    onChange={(
                      e: React.ChangeEvent<HTMLInputElement>
                    ) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    className={`
                      h-14
                      rounded-xl
                      pl-12
                      text-base
                      sm:text-lg
                      ${inputBackground}
                      ${inputBorder}
                      ${inputText}
                      ${inputPlaceholder}
                      focus:border-cyan-500
                      focus:ring-2
                      focus:ring-cyan-500/20
                    `}
                  />
                </div>
              </Field>

              <Field label="Senha de acesso">
                <div className="relative">
                  <Lock
                    className={`
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      h-5
                      w-5
                      -translate-y-1/2
                      ${
                        isDark
                          ? 'text-slate-400'
                          : 'text-slate-400'
                      }
                    `}
                  />

                  <Input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={senha}
                    onChange={(
                      e: React.ChangeEvent<HTMLInputElement>
                    ) =>
                      setSenha(
                        e.target.value
                      )
                    }
                    className={`
                      h-14
                      rounded-xl
                      pl-12
                      text-base
                      sm:text-lg
                      ${inputBackground}
                      ${inputBorder}
                      ${inputText}
                      ${inputPlaceholder}
                      focus:border-cyan-500
                      focus:ring-2
                      focus:ring-cyan-500/20
                    `}
                  />
                </div>
              </Field>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setForgotErrorMessage('');
                    setForgotSuccessMessage('');
                    setForgotStep('IDENTIFY');
                    setIsForgotOpen(true);
                  }}
                  className="
                    min-h-11
                    rounded-lg
                    px-2
                    text-sm
                    font-semibold
                    text-cyan-500
                    transition-colors
                    hover:text-cyan-400
                    focus:outline-none
                    focus:ring-2
                    focus:ring-cyan-400
                  "
                >
                  Esqueceu sua senha?
                </button>
              </div>

              <Button
                type="submit"
                className="
                  flex
                  h-14
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  bg-cyan-600
                  text-base
                  font-bold
                  text-white
                  shadow-lg
                  shadow-cyan-600/20
                  transition-all
                  hover:bg-cyan-500
                  hover:shadow-cyan-500/30
                  focus:outline-none
                  focus:ring-2
                  focus:ring-cyan-400
                  focus:ring-offset-2
                "
              >
                <span>Entrar no Sistema</span>

                <ArrowRight className="h-5 w-5" />
              </Button>

              {/* Separador */}

              <div className="pt-1">
                <div className="relative my-5 flex items-center justify-center">
                  <div
                    className={`
                      w-full border-t
                      ${
                        isDark
                          ? 'border-slate-700'
                          : 'border-slate-200'
                      }
                    `}
                  />

                  <span
                    className={`
                      absolute px-4 text-xs font-semibold uppercase tracking-wider
                      ${
                        isDark
                          ? 'bg-[#0b1727] text-slate-500'
                          : 'bg-white text-slate-400'
                      }
                    `}
                  >
                    ou
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onGoToRegister}
                  className={`
                    flex
                    min-h-14
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-xl
                    border
                    text-sm
                    font-semibold
                    transition-all
                    focus:outline-none
                    focus:ring-2
                    focus:ring-cyan-400
                    ${
                      isDark
                        ? 'border-slate-600 bg-slate-800/70 text-slate-200 hover:border-cyan-500/60 hover:bg-slate-800'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-300 hover:bg-slate-100'
                    }
                  `}
                >
                  <UserPlus className="h-5 w-5 text-cyan-500" />

                  <span>
                    Primeiro Acesso / Cadastrar Servidor
                  </span>
                </button>
              </div>
            </form>

            {/* Contas multi-role */}

            <div
              className={`
                space-y-2
                border-t
                pt-5
                ${
                  isDark
                    ? 'border-slate-700'
                    : 'border-slate-200'
                }
              `}
            >
              <p
                className={`font-mono text-xs ${mutedColor}`}
              >
                wanderson.maior@sti.chamados.com
                {' '}
                (Gestor + Técnico)
              </p>

              <p
                className={`font-mono text-xs ${mutedColor}`}
              >
                luigue.brandao@sti.chamados.com
                {' '}
                (Gestor + Solicitante)
              </p>

              <p
                className={`font-mono text-xs ${mutedColor}`}
              >
                elias.junior@sti.chamados.com
                {' '}
                (Gestor + Solicitante)
              </p>
            </div>

            {/* =================================================
                MODAL RECUPERAÇÃO DE SENHA
            ================================================== */}

            {isForgotOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
                <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#0b1624] p-7 text-white shadow-2xl sm:p-9">
                  <div className="flex items-start justify-between border-b border-white/10 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-cyan-500/20 p-3 text-cyan-400">
                        <Shield className="h-6 w-6" />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-white">
                          Recuperar Senha
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                          Validação rápida via WhatsApp
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setIsForgotOpen(false)
                      }
                      aria-label="Fechar recuperação de senha"
                      className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-6 space-y-5">
                    {forgotSuccessMessage ? (
                      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center text-sm font-semibold text-emerald-400">
                        {forgotSuccessMessage}
                      </div>
                    ) : forgotStep === 'IDENTIFY' ? (
                      <div className="space-y-5">
                        <p className="text-sm leading-relaxed text-slate-300">
                          Informe seu e-mail e o número do seu WhatsApp com DDD para receber o código de segurança.
                        </p>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-300">
                            E-mail ou Matrícula
                          </label>

                          <input
                            type="text"
                            value={forgotInput}
                            onChange={(e) =>
                              setForgotInput(
                                e.target.value
                              )
                            }
                            placeholder="Ex: wanderson.maior@sti.chamados.com"
                            className="h-14 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-300">
                            Seu WhatsApp (com DDD)
                          </label>

                          <input
                            type="text"
                            value={forgotPhone}
                            onChange={(e) =>
                              setForgotPhone(
                                e.target.value
                              )
                            }
                            placeholder="Ex: (63) 98400-0000"
                            className="h-14 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                          />
                        </div>

                        {forgotErrorMessage && (
                          <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm font-medium text-rose-400">
                            {forgotErrorMessage}
                          </p>
                        )}

                        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setIsForgotOpen(false)
                            }
                            className="min-h-12 rounded-xl px-5 text-sm font-semibold text-slate-400 hover:bg-white/5 hover:text-white"
                          >
                            Cancelar
                          </button>

                          <button
                            type="button"
                            disabled={sendingOtp}
                            onClick={
                              handleGenerateRecoveryCode
                            }
                            className="min-h-12 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {sendingOtp
                              ? 'Enviando via Meta API...'
                              : 'Enviar Código via WhatsApp Oficial →'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form
                        onSubmit={
                          handleConfirmNewPassword
                        }
                        className="space-y-5"
                      >
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
                          <span className="block font-semibold">
                            Código de segurança enviado!
                          </span>

                          <span className="mt-1 block text-sm text-slate-300">
                            Verifique a mensagem oficial recebida no WhatsApp do número informado.
                          </span>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-300">
                            Código de 6 Dígitos
                          </label>

                          <input
                            type="text"
                            maxLength={6}
                            value={userOtpInput}
                            onChange={(e) =>
                              setUserOtpInput(
                                e.target.value
                              )
                            }
                            placeholder="Ex: 849201"
                            required
                            className="h-14 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-center font-mono text-xl font-bold tracking-[0.35em] text-cyan-400 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-300">
                            Nova Senha
                          </label>

                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                              setNewPassword(
                                e.target.value
                              )
                            }
                            placeholder="Digite sua nova senha"
                            required
                            className="h-14 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-300">
                            Confirmar Nova Senha
                          </label>

                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                              setConfirmPassword(
                                e.target.value
                              )
                            }
                            placeholder="Digite novamente sua senha"
                            required
                            className="h-14 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                          />
                        </div>

                        {forgotErrorMessage && (
                          <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm font-medium text-rose-400">
                            {forgotErrorMessage}
                          </p>
                        )}

                        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                          <button
                            type="button"
                            onClick={() =>
                              setForgotStep(
                                'IDENTIFY'
                              )
                            }
                            className="min-h-12 rounded-xl px-4 text-sm font-semibold text-slate-400 hover:bg-white/5 hover:text-white"
                          >
                            ← Voltar
                          </button>

                          <button
                            type="submit"
                            className="min-h-12 rounded-xl bg-cyan-500 px-5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition-colors hover:bg-cyan-400"
                          >
                            Redefinir Senha
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}