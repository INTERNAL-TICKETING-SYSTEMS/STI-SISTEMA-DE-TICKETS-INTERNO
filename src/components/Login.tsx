import { useState } from 'react';
import Logo from '@/components/Logo';
import { Field, Input } from '@/components/ui/Field';
import { Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
  onGoToRegister: () => void;
}

export default function Login({ onLogin, onGoToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email) {
      onLogin(email);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      {/* =====================================================
          LADO ESQUERDO
      ====================================================== */}
      <section className="relative hidden overflow-hidden bg-[#0b1624] md:flex md:w-[46%] lg:w-[48%]">
        {/* Brilhos decorativos */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

        {/* Linhas decorativas */}
        <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />

        <div className="relative z-10 flex min-h-screen w-full flex-col justify-between px-10 py-10 lg:px-14">
          {/* Logo */}
          <div>
            <div className="inline-flex items-center rounded-2xl bg-white/5 px-5 py-4 backdrop-blur-sm">
              <Logo />
            </div>
          </div>

          {/* Texto principal */}
          <div className="max-w-xl -translate-y-4">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              Central de suporte de TI
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white lg:text-5xl">
              Suporte de TI,
              <br />
              <span className="text-cyan-400">simples e direto.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-400 lg:text-lg">
              Abra chamados, acompanhe o andamento das solicitações
              e converse com a equipe de TI em um único lugar.
            </p>

            {/* Mini informações */}
            <div className="mt-8 grid max-w-md grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/5 bg-white/[0.04] p-4">
                <p className="text-2xl font-bold text-white">24h</p>
                <p className="mt-1 text-xs text-slate-500">
                  Acompanhamento
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.04] p-4">
                <p className="text-2xl font-bold text-white">STI</p>
                <p className="mt-1 text-xs text-slate-500">
                  Suporte interno
                </p>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="flex items-end justify-between gap-6">
            <div className="flex items-center gap-2 rounded-full border border-cyan-400/10 bg-cyan-400/5 px-3 py-2 text-xs font-medium text-cyan-300">
              <ShieldCheck className="h-4 w-4" />
              Ambiente seguro
            </div>

            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} STI
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          LADO DIREITO
      ====================================================== */}
      <section className="flex min-h-screen flex-1 items-center justify-center bg-slate-50 px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          {/* Card do formulário */}
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-9">
            {/* Cabeçalho */}
            <div className="mb-8">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Entrar no sistema
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Use seu e-mail corporativo para acessar o STI.
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Field label="E-mail corporativo">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <Input
                    type="email"
                    required
                    placeholder="seu.nome@empresa.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-11 transition-all focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                  />
                </div>
              </Field>

              <Field label="Senha">
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <Input
                    type="password"
                    required
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-11 transition-all focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10"
                  />
                </div>
              </Field>

              {/* Opções */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer select-none items-center gap-2 text-slate-500">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  Lembrar de mim
                </label>

                <button
                  type="button"
                  className="font-medium text-cyan-600 transition-colors hover:text-cyan-700"
                >
                  Esqueci minha senha
                </button>
              </div>

              {/* Botão */}
              <button
                type="submit"
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#00A896] px-4 font-semibold text-white shadow-lg shadow-teal-500/20 transition-all duration-200 hover:bg-[#008f80] hover:shadow-xl hover:shadow-teal-500/25 active:scale-[0.98]"
              >
                Entrar

                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              </form>

            {/* Cadastro */}
            <div className="mt-7 text-center text-sm text-slate-500">
              Ainda não possui uma conta?{' '}
              <button
                type="button"
                onClick={onGoToRegister}
                className="font-semibold text-cyan-600 transition-colors hover:text-cyan-700"
              >
                Criar minha conta
              </button>
            </div>

            {/* Separador */}
            <div className="my-7 h-px bg-slate-100" />

            {/* Ajuda */}
            <div className="text-center">
              <p className="text-xs text-slate-400">
                Precisa de ajuda?
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Contate o setor de TI pelo ramal{' '}
                <span className="font-semibold text-slate-700">
                  4001
                </span>
              </p>
            </div>
          </div>

          {/* Texto inferior */}
          <p className="mt-5 text-center text-xs text-slate-400">
            Sistema de Tickets Interno • STI
          </p>
        </div>
      </section>
    </div>
  );
}