import React, { useState } from 'react';
import { User } from '@/types';
import Button from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { GENEROS_OPCOES } from '@/data/setores';
import {
  Mail,
  Phone,
  Building2,
  Briefcase,
  User as UserIcon,
  FileText,
  Calendar,
  Lock,
  ShieldCheck,
  CheckCircle2,
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
    cpf: user.cpf || '000.000.000-00',
    birthDate: user.birthDate || '1995-01-01',
    gender: user.gender || 'prefiro_nao_informar',
    department: user.department || 'DTI - Diretoria de Tecnologia da Informação',
    role: user.role || 'Servidor / Colaborador',
  });

  const generoRotulo =
    GENEROS_OPCOES.find((g) => g.valor === form.gender)?.rotulo || 'Não informado';

  // Máscara de telefone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) {
      v = v.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
    } else if (v.length > 2) {
      v = v.replace(/(\d{2})(\d{1,5})/, '($1) $2');
    }
    setForm({ ...form, phone: v });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Meu Perfil Funcional</h1>
        <p className="mt-1 text-sm text-slate-500">
          Dados cadastrais e identificação do servidor no Sistema de Tickets do DETRAN-TO.
        </p>
      </div>

      {/* Crachá Digital Institucional */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white shadow-md">
            {form.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{form.name}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <ShieldCheck className="h-3 w-3" />
                Ativo
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-0.5">{form.role}</p>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-slate-400" />
              {form.department}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs space-y-1 w-full sm:w-auto">
          <div className="text-slate-500 font-medium">Perfil no STI:</div>
          <div className="font-semibold text-slate-900 capitalize">
            {user.userRole === 'usuario' ? 'Colaborador / Solicitante' : user.userRole}
          </div>
        </div>
      </div>

      {/* Formulário de Identificação */}
      <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider text-xs">
            Dados de Identificação Institucional
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Campos cadastrais fornecidos no Primeiro Acesso.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Nome */}
          <Field label="Nome Completo">
            <div className="relative">
              <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </Field>

          {/* Cargo / Função */}
          <Field label="Cargo / Função">
            <div className="relative">
              <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="pl-10"
              />
            </div>
          </Field>

          {/* CPF (Travado por compliance institucional) */}
          <Field label="CPF (Identificador Funcional)">
            <div className="relative">
              <FileText className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={form.cpf}
                disabled
                className="pl-10 bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200"
              />
              <Lock className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </Field>

          {/* Data de Nascimento */}
          <Field label="Data de Nascimento">
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="date"
                value={form.birthDate}
                onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                className="pl-10"
              />
            </div>
          </Field>

          {/* Gênero */}
          <Field label="Gênero Declarado">
            <Input
              value={generoRotulo}
              disabled
              className="bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200"
            />
          </Field>

          {/* Setor DETRAN (Travado por regras de governança) */}
          <Field label="Lotação / Setor Oficial (DETRAN-TO)">
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={form.department}
                disabled
                className="pl-10 bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200"
              />
              <Lock className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </Field>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider text-xs">
            Canais de Comunicação
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Utilizados para notificações de status dos seus chamados.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* E-mail */}
          <Field label="E-mail Institucional ou Pessoal">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="pl-10"
                required
              />
            </div>
          </Field>

          {/* Telefone */}
          <Field label="Telefone / WhatsApp">
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={form.phone}
                onChange={handlePhoneChange}
                className="pl-10"
                required
              />
            </div>
          </Field>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            * Alterações de CPF ou Setor exigem abertura de chamado administrativo.
          </p>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
                Alterações salvas!
              </span>
            )}
            <Button type="submit" variant="primary">
              Salvar Alterações
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
