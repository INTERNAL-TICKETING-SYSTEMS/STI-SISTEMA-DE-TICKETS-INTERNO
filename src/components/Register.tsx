import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Search } from 'lucide-react';
import Button from './ui/Button';
import { Field } from './ui/Field';
import { useTechTheme } from './tech/techTheme';
import { registrarAuditoria } from '../services/auditService';
import { SETORES_DETRAN } from '../data/setores';

interface RegisterProps {
  onBackToLogin: () => void;
}

interface Departamento {
  id: number;
  nome: string;
  sigla?: string | null;
}

const API_BASE = (
  import.meta.env.VITE_API_URL || 'https://data-audit-production.up.railway.app'
).replace(/\/$/, '');

const GENEROS_OPCOES = [
  { valor: 'MASCULINO', rotulo: 'Masculino' },
  { valor: 'FEMININO', rotulo: 'Feminino' },
  { valor: 'OUTRO', rotulo: 'Outro' },
  { valor: 'PREFIRO_NAO_DIZER', rotulo: 'Prefiro não dizer' },
];

const IDADE_MINIMA = 18;
const IDADE_MAXIMA = 110;

const toLowerSafe = (value: unknown): string =>
  typeof value === 'string' ? value.toLowerCase() : '';

function validarDataNascimento(isoDateStr: string): { valida: boolean; motivo?: string } {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDateStr.trim());
  if (!match) {
    return { valida: false, motivo: 'Informe uma data de nascimento válida no formato dd/mm/aaaa.' };
  }

  const ano = Number(match[1]);
  const mes = Number(match[2]);
  const dia = Number(match[3]);

  if (mes < 1 || mes > 12 || dia < 1 || dia > 31) {
    return { valida: false, motivo: 'Data de nascimento inexistente.' };
  }

  const dataNasc = new Date(Date.UTC(ano, mes - 1, dia));
  if (
    dataNasc.getUTCFullYear() !== ano ||
    dataNasc.getUTCMonth() !== mes - 1 ||
    dataNasc.getUTCDate() !== dia
  ) {
    return { valida: false, motivo: 'Data de nascimento inválida para o calendário.' };
  }

  const hoje = new Date();
  const hojeUtc = new Date(Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()));

  if (dataNasc > hojeUtc) {
    return { valida: false, motivo: 'A data de nascimento não pode estar no futuro.' };
  }

  let idade = hojeUtc.getUTCFullYear() - ano;
  const mesAtual = hojeUtc.getUTCMonth() + 1;
  const diaAtual = hojeUtc.getUTCDate();
  if (mesAtual < mes || (mesAtual === mes && diaAtual < dia)) {
    idade -= 1;
  }

  if (idade < IDADE_MINIMA) {
    return {
      valida: false,
      motivo: `É necessário ter pelo menos ${IDADE_MINIMA} anos para realizar o cadastro.`,
    };
  }

  if (idade > IDADE_MAXIMA) {
    return {
      valida: false,
      motivo: `Data de nascimento fora do limite permitido (idade máxima de ${IDADE_MAXIMA} anos).`,
    };
  }

  return { valida: true };
}

function gerarEmailAcessoSti(nomeCompleto: string, emailDigitado: string): string {
  const cleanEmail = emailDigitado.trim().toLowerCase();
  if (cleanEmail.endsWith('@sti.chamados.com')) {
    return cleanEmail;
  }

  const partes = nomeCompleto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const primeiro = partes[0] || 'usuario';
  const ultimo = partes.length > 1 ? partes[partes.length - 1] : '';
  const sufixo = Math.floor(10 + Math.random() * 89);

  return ultimo
    ? `${primeiro}.${ultimo}.${sufixo}@sti.chamados.com`
    : `${primeiro}.${sufixo}@sti.chamados.com`;
}

export default function Register({ onBackToLogin }: RegisterProps) {
  const { isDark } = useTechTheme();
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDateInput, setBirthDateInput] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<string>('');
  const [sector, setSector] = useState('');
  const [sectorSearch, setSectorSearch] = useState('');
  const [showSectorOptions, setShowSectorOptions] = useState(false);

  const [departamentoId, setDepartamentoId] = useState<number | null>(null);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [erroDepartamentos, setErroDepartamentos] = useState('');
  const [email, setEmail] = useState('');
  const [generatedAccessEmail, setGeneratedAccessEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let ativo = true;

    fetch(`${API_BASE}/api/v1/departamentos`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Falha ao carregar os departamentos.');
        }

        return res.json();
      })
      .then((data: unknown) => {
        if (!ativo) return;

        if (Array.isArray(data) && data.length > 0) {
          setDepartamentos(data as Departamento[]);
          setErroDepartamentos('');
        } else if (Array.isArray(SETORES_DETRAN)) {
          setDepartamentos(SETORES_DETRAN as Departamento[]);
          setErroDepartamentos('');
        } else {
          setDepartamentos([]);
        }
      })
      .catch((err) => {
        console.error('[Departamentos API] Erro:', err);

        if (ativo) {
          if (Array.isArray(SETORES_DETRAN) && SETORES_DETRAN.length > 0) {
            setDepartamentos(SETORES_DETRAN as Departamento[]);
            setErroDepartamentos('');
          } else {
            setErroDepartamentos(
              'Não foi possível carregar os setores. Verifique se o servidor está ativo.',
            );
          }
        }
      });

    return () => {
      ativo = false;
    };
  }, []);

  const searchLower = toLowerSafe(sectorSearch);
  const listaDepartamentos = Array.isArray(departamentos) ? departamentos : [];

  const filteredSectors = listaDepartamentos.filter(
    (s) =>
      toLowerSafe(s?.sigla).includes(searchLower) ||
      toLowerSafe(s?.nome).includes(searchLower),
  );

  const validarCPF = (cpfStr: string): boolean => {
    const cleanCpf = cpfStr.replace(/\D/g, '');

    if (!/^\d{11}$/.test(cleanCpf)) {
      return false;
    }

    if (/^(\d)\1{10}$/.test(cleanCpf)) {
      return false;
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {
      soma += Number(cleanCpf[i]) * (10 - i);
    }

    let resto = (soma * 10) % 11;
    const primeiroDigito = resto === 10 ? 0 : resto;

    if (primeiroDigito !== Number(cleanCpf[9])) {
      return false;
    }

    soma = 0;

    for (let i = 0; i < 10; i++) {
      soma += Number(cleanCpf[i]) * (11 - i);
    }

    resto = (soma * 10) % 11;
    const segundoDigito = resto === 10 ? 0 : resto;

    return segundoDigito === Number(cleanCpf[10]);
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 4) {
      v = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
    } else if (v.length > 2) {
      v = `${v.slice(0, 2)}/${v.slice(2)}`;
    }
    setBirthDateInput(v);

    if (v.length === 10) {
      const [d, m, a] = v.split('/');
      setBirthDate(`${a}-${m}-${d}`);
    } else {
      setBirthDate('');
    }
  };

  const handleSectorSelect = (departamento: Departamento) => {
    const siglaTexto = departamento.sigla ? `${departamento.sigla} - ` : '';
    const value = `${siglaTexto}${departamento.nome ?? ''}`;

    setDepartamentoId(departamento.id);
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
      setError('Informe a data de nascimento no formato dd/mm/aaaa.');
      return;
    }

    const validacaoData = validarDataNascimento(birthDate);
    if (!validacaoData.valida) {
      setError(validacaoData.motivo || 'Data de nascimento inválida.');
      return;
    }

    if (!gender) {
      setError('Selecione seu gênero.');
      return;
    }

    if (departamentoId === null) {
      setError('Selecione seu setor de lotação no DETRAN.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas digitadas não coincidem.');
      return;
    }

    if (password.length < 8) {
      setError('A senha deve conter no mínimo 8 caracteres.');
      return;
    }

    setLoading(true);

    const personalEmail = email.trim().toLowerCase();
    const accessEmail = gerarEmailAcessoSti(name, personalEmail);
    setGeneratedAccessEmail(accessEmail);

    fetch(`${API_BASE}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: name.trim(),
        email: accessEmail,
        emailPessoal: personalEmail,
        cpf: cpf.replace(/\D/g, ''),
        dataNascimento: birthDate,
        genero: gender,
        senha: password,
        telefoneWhatsapp: phone,
        departamentoId: departamentoId,
      }),
    })
      .then(async (res: Response) => {
        setLoading(false);
        if (res.ok) {
          const setorEscolhido = sector || sectorSearch || 'Não informado';
          try {
            const registeredUsers = JSON.parse(
              localStorage.getItem('sti_registered_users') || '[]',
            );
            const novoUsuarioLocal = {
              name: name.trim(),
              email: accessEmail,
              personalEmail,
              cpf: cpf.replace(/\D/g, ''),
              department: setorEscolhido,
              role: 'Servidor / Colaborador',
              phone,
              userRole: 'usuario',
              roles: ['usuario'],
            };
            localStorage.setItem(
              'sti_registered_users',
              JSON.stringify([...registeredUsers, novoUsuarioLocal]),
            );
            localStorage.setItem(
              `sti_profile_${accessEmail}`,
              JSON.stringify(novoUsuarioLocal),
            );
          } catch {
            // Ignora falha de localStorage
          }

          setDone(true);
          registrarAuditoria({
            entidade: 'USUARIO',
            idEntidade: cpf.replace(/\D/g, '') || accessEmail,
            tipoOperacao: 'CADASTRO_USUARIO',
            autor: accessEmail,
            estadoAtual: {
              nome: name.trim(),
              email: accessEmail,
              emailPessoal: personalEmail,
              secretaria: setorEscolhido,
              telefone: phone,
            },
            metadados: { origem: 'Tela de Autocadastro - PostgreSQL' },
          }).catch((err: any) => console.error('[Auditoria] Falha:', err));
        } else {
          const errText = await res.text();
          setError(
            errText ||
              'Não foi possível concluir o cadastro com os dados informados. Verifique os campos ou entre em contato com o suporte.',
          );
        }
      })
      .catch((err: any) => {
        setLoading(false);
        console.error('[Cadastro API] Erro de conexão:', err);
        setError('Não foi possível comunicar com o servidor de banco de dados.');
      });
  };

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 sm:p-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl shadow-slate-200/60 sm:p-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Primeiro acesso concluído!
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Seu cadastro foi salvo no PostgreSQL no setor <strong>{sector || sectorSearch}</strong>.
          </p>
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-left text-xs text-slate-700">
            <p>
              <strong>E-mail de acesso (Login):</strong>{' '}
              <span className="font-mono font-semibold text-teal-700">{generatedAccessEmail}</span>
            </p>
            <p className="mt-1">
              <strong>E-mail pessoal cadastrado:</strong> {email}
            </p>
          </div>
          <div className="mt-8">
            <Button variant="primary" className="w-full" onClick={onBackToLogin}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ir para o Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition duration-200 focus:ring-2 ${isDark
    ? 'border-slate-600 bg-[#101e30] text-slate-100 placeholder:text-slate-500 focus:border-teal-400 focus:ring-teal-500/30'
    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-teal-500/30'
    }`;

  return (
    <div
      className={`min-h-screen md:flex ${isDark
        ? 'bg-[#070e17] text-slate-100'
        : 'bg-slate-50 text-slate-900'
        }`}
      style={{
        '--field-label-color': isDark ? '#e2e8f0' : '#334155',
        '--field-hint-color': isDark ? '#94a3b8' : '#64748b',
      } as React.CSSProperties}
    >
      <main className="flex min-w-0 flex-1 items-start justify-center px-4 py-5 sm:px-6 sm:py-8 lg:items-center lg:px-8">
        <div
          className={`w-full max-w-2xl overflow-visible rounded-2xl border p-5 shadow-xl sm:p-7 lg:p-8 ${isDark
            ? 'border-slate-700/80 bg-[#0b1727] shadow-black/30'
            : 'border-slate-200/80 bg-white shadow-slate-200/50'
            }`}
        >
          <header className="mb-7">
            <button
              type="button"
              onClick={onBackToLogin}
              className="mb-5 inline-flex min-h-9 items-center gap-2 rounded-lg text-xs font-medium text-slate-500 transition hover:text-teal-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o login
            </button>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Cadastro de Primeiro Acesso
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Informe seu e-mail pessoal (para recuperação/contato). O sistema criará seu e-mail de acesso institucional @sti.chamados.com para entrar.
            </p>
          </header>

          {error && (
            <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            <Field label="Nome Completo" labelClassName="!text-slate-700">
              <input
                placeholder="Ex.: João da Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="CPF" labelClassName="!text-slate-700">
                <input
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={handleCpfChange}
                  required
                  maxLength={14}
                  className={inputClass}
                />
              </Field>
              <Field label="Data de Nascimento" labelClassName="!text-slate-700">
                <input
                  type="text"
                  placeholder="dd/mm/aaaa"
                  value={birthDateInput}
                  onChange={handleBirthDateChange}
                  maxLength={10}
                  required
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Gênero" labelClassName="!text-slate-700">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className={inputClass}
              >
                <option value="">Selecione...</option>
                {GENEROS_OPCOES.map((g) => (
                  <option key={g.valor} value={g.valor}>
                    {g.rotulo}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Setor de Lotação (DETRAN)" labelClassName="!text-slate-700">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Digite para buscar seu setor..."
                  value={sectorSearch}
                  onChange={(e) => {
                    setSectorSearch(e.target.value);
                    setSector('');
                    setDepartamentoId(null);
                    setShowSectorOptions(true);
                  }}
                  onFocus={() => setShowSectorOptions(true)}
                  onBlur={() => setTimeout(() => setShowSectorOptions(false), 150)}
                  required
                  className={`pl-10 ${inputClass}`}
                />
                {erroDepartamentos && (
                  <p className="mt-2 text-sm text-rose-600" role="alert">
                    {erroDepartamentos}
                  </p>
                )}


                {showSectorOptions && (
                  <div
                    className={`absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border p-1 shadow-xl ${isDark
                      ? 'border-slate-700 bg-[#101e30] shadow-black/30'
                      : 'border-slate-200 bg-white'
                      }`}
                  >
                    {filteredSectors.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSectorSelect(s)}
                        className={`w-full rounded-lg px-3 py-3 text-left text-sm transition ${isDark
                          ? 'text-slate-200 hover:bg-teal-900/40'
                          : 'text-slate-700 hover:bg-teal-50'
                          }`}
                      >
                        {s.sigla ? (
                          <>
                            <span
                              className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'
                                }`}
                            >
                              {s.sigla}
                            </span>
                            {' — '}
                          </>
                        ) : null}

                        <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                          {s.nome}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="E-mail" labelClassName="!text-slate-700">
                <input
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Telefone / WhatsApp" labelClassName="!text-slate-700">
                <input
                  type="tel"
                  placeholder="(63) 99999-9999"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                  maxLength={15}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Senha de Acesso" labelClassName="!text-slate-700">
                <input
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className={inputClass}
                />
              </Field>
              <Field label="Confirmar Senha" labelClassName="!text-slate-700">
                <input
                  type="password"
                  placeholder="Repita sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className={inputClass}
                />
              </Field>
            </div>

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Cadastrando no PostgreSQL...' : 'Finalizar Primeiro Acesso'}
            </Button>
          </form>
        </div>
      </main >
    </div >
  );
}