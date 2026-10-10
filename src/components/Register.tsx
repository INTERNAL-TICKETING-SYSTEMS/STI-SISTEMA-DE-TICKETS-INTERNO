import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Search } from 'lucide-react';
import Button from './ui/Button';
import { Field } from './ui/Field';
import { registrarAuditoria } from '../services/auditService';
import { SETORES_DETRAN } from '../data/setores';

interface RegisterProps {
  onBackToLogin: () => void;
}

const GENEROS_OPCOES = [
  { valor: 'MASCULINO', rotulo: 'Masculino' },
  { valor: 'FEMININO', rotulo: 'Feminino' },
  { valor: 'OUTRO', rotulo: 'Outro' },
  { valor: 'PREFIRO_NAO_DIZER', rotulo: 'Prefiro não dizer' }
];



export default function Register({ onBackToLogin }: RegisterProps) {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDateInput, setBirthDateInput] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<string>('');
  const [sector, setSector] = useState('');
  const [sectorSearch, setSectorSearch] = useState('');
  const [showSectorOptions, setShowSectorOptions] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const filteredSectors = SETORES_DETRAN.filter(
    (s) =>
      s.sigla.toLowerCase().includes(sectorSearch.toLowerCase()) ||
      s.nome.toLowerCase().includes(sectorSearch.toLowerCase())
  );

  const validarCPF = (cpfStr: string) => {
    const cleanCpf = cpfStr.replace(/\D/g, '');
    return cleanCpf.length === 11;
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

    const formattedEmail = email.includes('@')
      ? email
      : `${email}@sti.chamados.com`;

    const departamentoIdUuid = 'a0000000-0000-0000-0000-000000000001';

    fetch('http://localhost:8081/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: name,
        email: formattedEmail,
        emailPessoal: formattedEmail,
        cpf: cpf.replace(/\D/g, ''),
        dataNascimento: birthDate,
        genero: gender,
        senha: password,
        telefoneWhatsapp: phone,
        departamentoId: departamentoIdUuid
      })
    })
    .then(async (res: Response) => {
      setLoading(false);
      if (res.ok) {
        setDone(true);
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
          metadados: { origem: 'Tela de Autocadastro - PostgreSQL' },
        }).catch((err: any) => console.error('[Auditoria] Falha:', err));
      } else {
        const errText = await res.text();
        setError('Erro ao salvar no servidor: ' + errText);
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
            Seus dados cadastrais foram registrados com sucesso no PostgreSQL e no setor <strong>{sector}</strong>.
          </p>
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

  const inputClass = 'w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/30';

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <main className="flex min-w-0 flex-1 items-start justify-center px-4 py-5 sm:px-6 sm:py-8 lg:items-center lg:px-8">
        <div className="w-full max-w-2xl overflow-visible rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-7 lg:p-8">
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
          </header>

          {error && (
            <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            <Field label="Nome Completo">
              <input placeholder="Ex.: João da Silva" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="CPF">
                <input placeholder="000.000.000-00" value={cpf} onChange={handleCpfChange} required maxLength={14} className={inputClass} />
              </Field>
              <Field label="Data de Nascimento">
                <input type="text" placeholder="dd/mm/aaaa" value={birthDateInput} onChange={handleBirthDateChange} maxLength={10} required className={inputClass} />
              </Field>
            </div>

            <Field label="Gênero">
              <select value={gender} onChange={(e) => setGender(e.target.value)} required className={inputClass}>
                <option value="">Selecione...</option>
                {GENEROS_OPCOES.map((g) => (
                  <option key={g.valor} value={g.valor}>{g.rotulo}</option>
                ))}
              </select>
            </Field>

            <Field label="Setor de Lotação (DETRAN)">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Digite para buscar seu setor..."
                  value={sectorSearch}
                  onChange={(e) => {
                    setSectorSearch(e.target.value);
                    setSector('');
                    setShowSectorOptions(true);
                  }}
                  onFocus={() => setShowSectorOptions(true)}
                  onBlur={() => setTimeout(() => setShowSectorOptions(false), 150)}
                  required
                  className={`pl-10 ${inputClass}`}
                />
                {showSectorOptions && (
                  <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
                    {filteredSectors.map((s) => (
                      <button
                        key={s.sigla}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSectorSelect(s.sigla, s.nome)}
                        className="w-full rounded-lg px-3 py-3 text-left text-sm hover:bg-teal-50"
                      >
                        <span className="font-semibold text-slate-800">{s.sigla}</span> — <span className="text-slate-600">{s.nome}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="E-mail Institucional ou Pessoal">
                <input type="email" placeholder="seu.email@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
              </Field>
              <Field label="Telefone / WhatsApp">
                <input type="tel" placeholder="(63) 99999-9999" value={phone} onChange={handlePhoneChange} required maxLength={15} className={inputClass} />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Senha de Acesso">
                <input type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className={inputClass} />
              </Field>
              <Field label="Confirmar Senha">
                <input type="password" placeholder="Repita sua senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} className={inputClass} />
              </Field>
            </div>

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Cadastrando no PostgreSQL...' : 'Finalizar Primeiro Acesso'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}