import { registrarAuditoria } from '../services/auditService';
import React, { useState } from 'react';
import Logo from '@/components/Logo';
import Button from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Field';
import { SETORES_DETRAN, GENEROS_OPCOES } from '@/data/setores';
import { GenderOption } from '@/types';
import {
  ArrowLeft,
  CheckCircle2,
  UserCheck,
  Search,
} from 'lucide-react';

interface RegisterProps {
  onBackToLogin: () => void;
}

// Algoritmo real de validação de CPF
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

  // Máscara de CPF
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

  // Máscara de Telefone
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
        const currentList = JSON.parse(localStorage.getItem('sti_registered_users') || '[]');
        const formattedEmail = email.includes('@') ? email : `${email}@sti.chamados.com`;
        currentList.push({
          name,
          email: formattedEmail,
          department: sectorSearch || 'Administrativo',
          phone,
          password
        });
        localStorage.setItem('sti_registered_users', JSON.stringify(currentList));

        // Auditoria imutável: Novo usuário cadastrado no sistema
        registrarAuditoria({
          entidade: 'USUARIO',
          idEntidade: cpf.replace(/\D/g, '') || formattedEmail,
          tipoOperacao: 'CADASTRO_USUARIO',
          autor: formattedEmail,
          estadoAtual: {
            nome: name,
            email: formattedEmail,
            secretaria: sectorSearch || 'Administrativo',
            telefone: phone
          },
          metadados: { origem: 'Tela de Autocadastro' }
        }).catch(err => console.error('[Auditoria] Falha no log de cadastro:', err));
      } catch (err) { }
      setLoading(false);
      setDone(true);
    }, 600);
  };

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm border border-slate-200 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 mx-auto">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Primeiro Acesso Concluído!</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Seus dados cadastrais foram registrados com sucesso no setor <strong>{sector}</strong>.
          </p>
          <div className="mt-6 bg-slate-50 p-4 rounded-lg border border-slate-200 text-left text-xs space-y-1">
            <div><span className="font-semibold">Colaborador:</span> {name}</div>
            <div><span className="font-semibold">CPF:</span> {cpf}</div>
            <div><span className="font-semibold">E-mail:</span> {email}</div>
          </div>
          <div className="mt-8">
            <Button variant="primary" className="w-full" onClick={onBackToLogin}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ir para o Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Painel Esquerdo Institucional */}
      <div className="relative hidden w-[38%] lg:flex flex-col justify-between bg-slate-900 p-10 text-white">
        <Logo variant="full" light className="h-12" />
        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
            <UserCheck className="h-3.5 w-3.5" />
            Credenciamento DETRAN
          </span>
          <h1 className="text-2xl font-bold leading-tight">
            Primeiro Acesso ao STI
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Cadastre-se para solicitar suporte técnico, acompanhar o status dos seus chamados de TI e gerenciar ocorrências da sua unidade.
          </p>
        </div>
        <div className="text-xs text-slate-500">
          &copy; 2026 STI &mdash; Departamento de Tecnologia da Informação.
        </div>
      </div>

      {/* Formulário Central */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-sm border border-slate-200">
          <div className="mb-6">
            <button
              type="button"
              onClick={onBackToLogin}
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o login
            </button>
            <h1 className="text-xl font-bold text-slate-900">Cadastro de Primeiro Acesso</h1>
            <p className="mt-1 text-xs text-slate-500">
              Preencha os dados institucionais para ativação da sua conta.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Nome Completo">
              <Input
                placeholder="Ex: João da Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="CPF">
                <Input
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={handleCpfChange}
                  required
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
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Gênero">
                <Select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as GenderOption)}
                  required
                >
                  <option value="">Selecione...</option>
                  {GENEROS_OPCOES.map((g) => (
                    <option key={g.valor} value={g.valor}>
                      {g.rotulo}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Setor de Lotação (DETRAN)">
                <div className="relative">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <Input
                      type="text"
                      placeholder="Digite para buscar sua lotação..."
                      value={sectorSearch}
                      onChange={(e) => {
                        setSectorSearch(e.target.value);
                        setSector('');
                        setShowSectorOptions(true);
                      }}
                      onFocus={() => setShowSectorOptions(true)}
                      required
                      autoComplete="off"
                      className="pl-10"
                    />
                  </div>

                  {showSectorOptions && (
                    <div className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                      {filteredSectors.length > 0 ? (
                        filteredSectors.map((s) => (
                          <button
                            key={s.sigla}
                            type="button"
                            onClick={() => handleSectorSelect(s.sigla, s.nome)}
                            className="w-full border-b border-slate-100 px-4 py-3 text-left text-sm transition-colors last:border-b-0 hover:bg-cyan-50"
                          >
                            <span className="font-medium text-slate-800">
                              {s.sigla}
                            </span>

                            <span className="text-slate-600">
                              {' - '}{s.nome}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-slate-500">
                          Nenhuma lotação encontrada.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="E-mail Institucional ou Pessoal">
                <Input
                  type="email"
                  placeholder="nome.sobrenome@sti.chamados.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Field label="Telefone / WhatsApp">
                <Input
                  placeholder="(63) 99999-9999"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Senha de Acesso">
                <Input
                  type="password"
                  placeholder="Mínimo 6 dígitos"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>

              <Field label="Confirmar Senha">
                <Input
                  type="password"
                  placeholder="Repita sua senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Field>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Validando e Cadastrando...' : 'Finalizar Primeiro Acesso'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
