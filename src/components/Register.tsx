import { useState } from 'react';
import Logo from '@/components/Logo';
import Button from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import {
  Lock,
  Mail,
  User as UserIcon,
  Building2,
  MapPin,
  Phone,
  ArrowLeft,
  CheckCircle2,
  Info,
} from 'lucide-react';

interface RegisterProps {
  onBackToLogin: () => void;
}

export default function Register({ onBackToLogin }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem. Verifique e tente novamente.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter ao menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 800);
  };

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="w-full max-w-sm text-center animate-slide-up">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 mx-auto">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-sti-navy-800">Conta criada!</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Seu cadastro foi enviado. O administrador do sistema vai definir seu perfil de acesso.
            Você receberá um e-mail quando sua conta estiver liberada.
          </p>
          <div className="mt-8">
            <Button variant="secondary" onClick={onBackToLogin}>
              <ArrowLeft className="h-4 w-4" />
              Voltar para o login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left — brand panel */}
      <div className="relative hidden w-[44%] flex-col justify-between bg-sti-navy-800 p-12 lg:flex">
        <Logo variant="full" light className="h-12" />

        <div className="max-w-sm">
          <h1 className="text-3xl font-bold leading-tight text-white">
            Suporte de TI, simples e direto.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Abra chamados, acompanhe o andamento e converse com a equipe de TI — tudo em um só lugar.
          </p>
        </div>

        <p className="text-xs text-slate-500">© 2026 STI — Sistema de Tickets Interno</p>
      </div>

      {/* Right — register form */}
      <div className="flex flex-1 items-center justify-center bg-white px-8 py-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <Logo variant="full" className="h-12" />
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-sti-navy-800">Criar sua conta</h2>
            <p className="mt-2 text-sm text-slate-500">
              Preencha seus dados para solicitar acesso ao STI.
            </p>
          </div>

          {/* Info banner */}
          <div className="mb-5 flex items-start gap-2.5 rounded-lg bg-sti-navy-50 px-4 py-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-sti-navy-500" />
            <p className="text-sm text-sti-navy-700">
              Seu perfil de acesso será definido pelo administrador do sistema.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Nome completo">
              <div className="relative">
                <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome completo"
                  className="pl-10"
                  required
                />
              </div>
            </Field>

            <Field label="E-mail corporativo">
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                  className="pl-10"
                  required
                />
              </div>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Setor">
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Ex: Financeiro"
                    className="pl-10"
                    required
                  />
                </div>
              </Field>

              <Field label="Localização">
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Sala 302"
                    className="pl-10"
                    required
                  />
                </div>
              </Field>
            </div>

            <Field label="Telefone / Ramal">
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: (11) 98765-4321"
                  className="pl-10"
                  required
                />
              </div>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Senha">
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="pl-10"
                    required
                  />
                </div>
              </Field>

              <Field label="Confirmar senha">
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    className="pl-10"
                    required
                  />
                </div>
              </Field>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
            )}

            <Button type="submit" size="lg" className="mt-1 w-full" disabled={loading}>
              {loading ? 'Criando…' : 'Criar conta'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Já possui uma conta?{' '}
            <button
              onClick={onBackToLogin}
              className="font-semibold text-sti-teal-600 hover:text-sti-teal-700"
            >
              Voltar para o login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
