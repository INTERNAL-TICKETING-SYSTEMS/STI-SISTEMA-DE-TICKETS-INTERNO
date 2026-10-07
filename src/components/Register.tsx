
import React, { useState } from 'react';
import { registrarAuditoria } from '../services/auditService';
import Logo from '@/components/Logo';
import Button from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Field';
import { SETORES_DETRAN, GENEROS_OPCOES } from '@/data/setores';
import { GenderOption } from '@/types';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  UserCheck,
  Search,
  ClipboardList,
  Headset,
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
  LockKeyhole,
} from 'lucide-react';

interface RegisterProps {
  onBackToLogin: () => void;
}

// Validação de CPF
function validarCPF(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11 || /^(\d)\1{10}$/.test(clean)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(clean.charAt(i), 10) * (10 - i);
  }

  let resto = 11 - (soma % 11);
  const dv1 = resto >= 10 ? 0 : resto;
  if (dv1 !== parseInt(clean.charAt(9), 10)) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(clean.charAt(i), 10) * (11 - i);
  }

  resto = 11 - (soma % 11);
  const dv2 = resto >= 10 ? 0 : resto;

  return dv2 === parseInt(clean.charAt(10), 10);
}

function RegisterWelcomePanel() {
  const steps = [
    {
      icon: ClipboardList,
      title: 'Solicite ajuda',
      description: 'Conte o que precisa resolver.',
    },
    {
      icon: Headset,
      title: 'Acompanhe o atendimento',
      description: 'Veja o andamento da solicitação.',
    },
    {
      icon: CheckCircle2,
      title: 'Consulte a solução',
      description: 'Acompanhe as atualizações do chamado.',
    },
  ];

  return (
    <section className="register-brand-panel relative hidden overflow-hidden bg-[#0b1624] text-white md:flex md:w-[40%] md:flex-col md:justify-between md:p-8 lg:w-[42%] lg:p-12 xl:p-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 -top-24 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl motion-safe:animate-pulse"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl"
      />

      <div className="relative z-10">
        <div className="w-fit max-w-full motion-safe:animate-[float_5s_ease-in-out_infinite]">
          <Logo
            variant="login"
            light
            className="drop-shadow-[0_0_18px_rgba(20,184,166,0.18)]"
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-lg py-8">
        

        <h1 className="text-3xl font-bold leading-tight lg:text-4xl">
          Seu primeiro acesso começa aqui.
        </h1>

        <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
          Crie sua conta para solicitar suporte técnico e acompanhar seus
          chamados em um só lugar.
        </p>

        <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/20 sm:p-5">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-teal-400/10 blur-2xl"
          />

          <div className="relative flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-400">
                Central de atendimento
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                Tudo organizado para você
              </p>
            </div>

            <div className="rounded-xl border border-teal-300/10 bg-teal-400/10 p-3 text-teal-300 motion-safe:animate-pulse">
              <ClipboardList className="h-6 w-6" />
            </div>
          </div>

          <div className="relative mt-5 space-y-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#101f30] p-3 transition duration-300 hover:translate-x-1 hover:border-teal-300/20"
                  style={{
                    animation: `registerFadeIn 500ms ease-out ${index * 120}ms both`,
                  }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{step.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {step.description}
                    </p>
                  </div>

                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-500" />
                </div>
              );
            })}
          </div>

          <div className="relative mt-4 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 shrink-0 text-teal-300" />
            <span>Um acesso para acompanhar suas solicitações.</span>
          </div>
        </div>
      </div>

      <footer className="relative z-10 text-xs text-slate-500">
        STI &copy; {new Date().getFullYear()}
      </footer>

      <style>{`
        @keyframes registerFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .register-brand-panel *,
          .register-brand-panel *::before,
          .register-brand-panel *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export default function Register({ onBackToLogin }: RegisterProps) {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthDateInput, setBirthDateInput] = useState('');
  const [gender, setGender] = useState<GenderOption | ''>('');
  const [sector, setSector] = useState('');
  const [sectorSearch, setSectorSearch] = useState('');
  const [showSectorOptions, setShowSectorOptions] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const sortedSectors = [...SETORES_DETRAN].sort((a, b) =>
    a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' })
  );

  const filteredSectors = sortedSectors.filter((s) => {
    const search = sectorSearch.trim().toLowerCase();

    if (!search) return true;

    return (
      s.sigla.toLowerCase().includes(search) ||
      s.nome.toLowerCase().includes(search)
    );
  });

  const handleBirthDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
    let formatted = digits;

    if (digits.length > 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length > 2) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    setBirthDateInput(formatted);

    if (digits.length === 8) {
      const day = digits.slice(0, 2);
      const month = digits.slice(2, 4);
      const year = digits.slice(4, 8);
      setBirthDate(`${year}-${month}-${day}`);
    } else {
      setBirthDate('');
    }
  };

  const handleSectorSelect = (sigla: string, nome: string) => {
    const value = `${sigla} - ${nome}`;

    setSector(value);
    setSectorSearch(value);
    setShowSectorOptions(false);
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);

    if (v.length > 9) {
      v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (v.length > 6) {
      v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (v.length > 3) {
      v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }

    setCpf(v);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);

    if (v.length > 6) {
      v = v.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
    } else if (v.length > 2) {
      v = v.replace(/(\d{2})(\d{1,5})/, '($1) $2');
    }

    setPhone(v);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validarCPF(cpf)) {
      setError('O CPF informado é inválido. Por favor, confira os números.');
      return;
    }

    if (!birthDate) {
      setError('Informe a data de nascimento.');
      return;
    }

    const birthDateMatch = birthDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!birthDateMatch) {
      setError('Informe uma data com o ano contendo exatamente 4 números.');
      return;
    }

    const [, year, month, day] = birthDateMatch;
    const parsedBirthDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    if (
      year.length !== 4 ||
      Number(year) < 1900 ||
      parsedBirthDate.getFullYear() !== Number(year) ||
      parsedBirthDate.getMonth() !== Number(month) - 1 ||
      parsedBirthDate.getDate() !== Number(day) ||
      parsedBirthDate > new Date()
    ) {
      setError('Informe uma data de nascimento válida, com ano de 4 números.');
      return;
    }

    if (!gender) {
      setError('Selecione seu gênero.');
      return;
    }

    if (!sector) {
      setError('Selecione seu setor de lotação no DETRAN.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas digitadas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        const currentList = JSON.parse(
          localStorage.getItem('sti_registered_users') || '[]'
        );

        const formattedEmail = email.includes('@')
          ? email
          : `${email}@sti.chamados.com`;

        currentList.push({
          name,
          email: formattedEmail,
          department: sectorSearch || 'Administrativo',
          phone,
          password,
        });

        localStorage.setItem(
          'sti_registered_users',
          JSON.stringify(currentList)
        );

        // Mantém o registro de auditoria existente.
        // Não registra senha nos dados de auditoria.
        registrarAuditoria({
          entidade: 'USUARIO',
          idEntidade: cpf.replace(/\D/g, '') || formattedEmail,
          tipoOperacao: 'CADASTRO_USUARIO',
          autor: formattedEmail,
          estadoAtual: {
            nome: name,
            email: formattedEmail,
            secretaria: sectorSearch || 'Administrativo',
            telefone: phone,
          },
          metadados: { origem: 'Tela de Autocadastro' },
        }).catch((err) =>
          console.error('[Auditoria] Falha no log de cadastro:', err)
        );
      } catch (err) {
        console.error('[Cadastro] Não foi possível salvar o cadastro:', err);
        setError('Não foi possível concluir o cadastro. Tente novamente.');
        setLoading(false);
        return;
      }

      setLoading(false);
      setDone(true);
    }, 600);
  };

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 sm:p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl shadow-slate-200/60 sm:p-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Cadastro concluído
          </span>

          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Primeiro acesso concluído!
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Seus dados cadastrais foram registrados com sucesso no setor{' '}
            <strong>{sector}</strong>.
          </p>

          <div className="mt-6 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-xs">
            <div className="break-words">
              <span className="font-semibold text-slate-700">Colaborador:</span>{' '}
              {name}
            </div>
            <div>
              <span className="font-semibold text-slate-700">CPF:</span> {cpf}
            </div>
            <div className="break-words">
              <span className="font-semibold text-slate-700">E-mail:</span>{' '}
              {email}
            </div>
          </div>

          <div className="mt-8">
            <Button
              variant="primary"
              className="w-full"
              onClick={onBackToLogin}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ir para o Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const inputClass =
    'transition duration-200 focus-visible:ring-2 focus-visible:ring-teal-500/30';

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <RegisterWelcomePanel />

      <main className="flex min-w-0 flex-1 items-start justify-center px-4 py-5 sm:px-6 sm:py-8 lg:items-center lg:px-8">
        <div className="w-full max-w-2xl overflow-visible rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-7 lg:p-8">
          <header className="mb-7">
            <button
              type="button"
              onClick={onBackToLogin}
              className="mb-5 inline-flex min-h-9 items-center gap-2 rounded-lg text-xs font-medium text-slate-500 transition hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o login
            </button>

            <div className="flex items-start gap-3">
              <div className="hidden rounded-xl bg-teal-50 p-3 text-teal-700 sm:block">
                <UserCheck className="h-6 w-6" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                  Credenciamento DETRAN
                </span>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Cadastro de Primeiro Acesso
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-5 text-slate-500">
                  Preencha seus dados para criar sua conta e acompanhar suas
                  solicitações de suporte.
                </p>
              </div>
            </div>
          </header>

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
            >
              <span className="mt-0.5">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Grupo 1 */}
            <section className="space-y-4">
              <div className="flex items-start gap-3 border-b border-slate-100 pb-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-xs font-bold text-cyan-700">
                  01
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Dados pessoais
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Informe seus dados para identificação.
                  </p>
                </div>
              </div>

              <Field label="Nome Completo">
                <Input
                  placeholder="Ex.: João da Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className={inputClass}
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="CPF">
                  <Input
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={handleCpfChange}
                    required
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={14}
                    className={inputClass}
                  />
                </Field>

                <Field label="Data de Nascimento">
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="dd/mm/aaaa"
                    value={birthDateInput}
                    onChange={handleBirthDateChange}
                    maxLength={10}
                    required
                    autoComplete="bday"
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Gênero">
                <Select
                  value={gender}
                  onChange={(e) =>
                    setGender(e.target.value as GenderOption)
                  }
                  required
                  className={inputClass}
                >
                  <option value="">Selecione...</option>
                  {GENEROS_OPCOES.map((g) => (
                    <option key={g.valor} value={g.valor}>
                      {g.rotulo}
                    </option>
                  ))}
                </Select>
              </Field>
            </section>

            {/* Grupo 2 */}
            <section className="space-y-4">
              <div className="flex items-start gap-3 border-b border-slate-100 pb-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-xs font-bold text-cyan-700">
                  02
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Dados de trabalho
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Informe sua lotação e os contatos para comunicação.
                  </p>
                </div>
              </div>

              <Field label="Setor de Lotação (DETRAN)">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <Input
                    type="text"
                    placeholder="Digite para buscar seu setor..."
                    value={sectorSearch}
                    onChange={(e) => {
                      setSectorSearch(e.target.value);
                      setSector('');
                      setShowSectorOptions(true);
                    }}
                    onFocus={() => setShowSectorOptions(true)}
                    onBlur={() => {
                      window.setTimeout(
                        () => setShowSectorOptions(false),
                        150
                      );
                    }}
                    required
                    autoComplete="off"
                    className={`pl-10 ${inputClass}`}
                  />

                  {showSectorOptions && (
                    <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-900/10">
                      {filteredSectors.length > 0 ? (
                        filteredSectors.map((s) => (
                          <button
                            key={s.sigla}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() =>
                              handleSectorSelect(s.sigla, s.nome)
                            }
                            className="w-full rounded-lg border-b border-slate-50 px-3 py-3 text-left text-sm transition last:border-b-0 hover:bg-teal-50 focus-visible:bg-teal-50 focus-visible:outline-none"
                          >
                            <span className="font-semibold text-slate-800">
                              {s.sigla}
                            </span>
                            <span className="text-slate-600">
                              {' — '}{s.nome}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-4 text-sm text-slate-500">
                          Nenhuma lotação encontrada.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="E-mail Institucional ou Pessoal">
                  <Input
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className={inputClass}
                  />
                </Field>

                <Field label="Telefone / WhatsApp">
                  <Input
                    type="tel"
                    placeholder="(63) 99999-9999"
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={15}
                    className={inputClass}
                  />
                </Field>
              </div>
            </section>

            {/* Grupo 3 */}
            <section className="space-y-4">
              <div className="flex items-start gap-3 border-b border-slate-100 pb-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-xs font-bold text-cyan-700">
                  03
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Criar acesso
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Crie uma senha de pelo menos 6 caracteres.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Senha de Acesso">
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      className={`pr-11 pl-10 ${inputClass}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={
                        showPassword ? 'Ocultar senha' : 'Mostrar senha'
                      }
                      className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </Field>

                <Field label="Confirmar Senha">
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repita sua senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      className={`pr-11 pl-10 ${inputClass}`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((value) => !value)
                      }
                      aria-label={
                        showConfirmPassword
                          ? 'Ocultar confirmação da senha'
                          : 'Mostrar confirmação da senha'
                      }
                      className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </Field>
              </div>

              {password.length > 0 && (
                <div
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                    password.length >= 6
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {password.length >= 6 ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 shrink-0" />
                  )}
                  {password.length >= 6
                    ? 'A senha atende ao tamanho mínimo.'
                    : `Digite mais ${6 - password.length} caractere(s).`}
                </div>
              )}

              {confirmPassword.length > 0 && (
                <p
                  className={`text-xs ${
                    password === confirmPassword
                      ? 'text-emerald-700'
                      : 'text-rose-600'
                  }`}
                >
                  {password === confirmPassword
                    ? 'As senhas coincidem.'
                    : 'As senhas ainda não coincidem.'}
                </p>
              )}
            </section>

            <div className="border-t border-slate-100 pt-5">
              <Button
                type="submit"
                variant="primary"
                className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl transition duration-200 hover:shadow-lg hover:shadow-teal-600/15"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
                      aria-hidden="true"
                    />
                    Validando e cadastrando...
                  </>
                ) : (
                  <>
                    Finalizar Primeiro Acesso
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              <p className="mt-3 text-center text-xs leading-5 text-slate-400">
                Confira seus dados antes de concluir o cadastro.
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}