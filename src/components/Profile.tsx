import { User } from '@/types';
import Button from '@/components/ui/Button';
import { Field, Input } from '@/components/ui/Field';
import { Mail, Phone, Building2, Briefcase, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

interface ProfileProps {
  user: User;
}

export default function Profile({ user }: ProfileProps) {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(user);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-sti-navy-800">Meu perfil</h1>
        <p className="mt-2 text-sm text-slate-500">Mantenha seus dados atualizados.</p>
      </div>

      {/* Avatar + name */}
      <div className="mb-6 flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sti">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sti-teal-500 text-xl font-bold text-white">
          {user.name.charAt(0)}
        </div>
        <div>
          <p className="text-lg font-semibold text-sti-navy-800">{user.name}</p>
          <p className="text-sm text-slate-400">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sti">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nome completo" className="sm:col-span-2">
            <div className="relative">
              <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="pl-10"
              />
            </div>
          </Field>

          <Field label="E-mail corporativo">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="pl-10"
              />
            </div>
          </Field>

          <Field label="Telefone">
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="pl-10"
              />
            </div>
          </Field>

          <Field label="Departamento">
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="pl-10"
              />
            </div>
          </Field>

          <Field label="Cargo">
            <div className="relative">
              <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="pl-10"
              />
            </div>
          </Field>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          {saved && (
            <span className="text-sm font-medium text-green-600 animate-fade-in">
              Alterações salvas!
            </span>
          )}
          <Button type="submit">Salvar alterações</Button>
        </div>
      </form>
    </div>
  );
}
