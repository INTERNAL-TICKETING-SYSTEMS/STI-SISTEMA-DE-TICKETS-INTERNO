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
  const [gender, setGender] = useState<GenderOption | ''>('');
  const [sector, setSector] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

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
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
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
                <Select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  required
                >
                  <option value="">Selecione seu setor...</option>
                  {SETORES_DETRAN.map((s) => (
                    <option key={s.sigla} value={`${s.sigla} - ${s.nome}`}>
                      {s.sigla} - {s.nome}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="E-mail Institucional ou Pessoal">
                <Input
                  type="email"
                  placeholder="nome.sobrenome@detran.to.gov.br"
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
