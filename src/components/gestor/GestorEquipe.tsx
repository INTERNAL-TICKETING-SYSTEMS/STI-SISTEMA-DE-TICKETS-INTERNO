import { Ticket } from '@/types';
import { mockTechnicians } from '@/data';
import { useGestorTheme } from './GestorSidebar';

interface GestorEquipeProps {
  tickets: Ticket[];
}

export default function GestorEquipe({ tickets }: GestorEquipeProps) {
  const { isDark } = useGestorTheme();

  return (
    <div className="space-y-4">
      <div>
        <h2
          className={`text-xl font-bold ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          Produtividade da Equipe de TI
        </h2>

        <p
          className={`text-xs ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          Distribuição de chamados atendidos e tempo de resposta por técnico.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {mockTechnicians.map((t) => {
          const techTickets = tickets.filter(
            (tk) => tk.assignee === t.name
          );

          const concluidos = techTickets.filter(
            (tk) =>
              tk.status === 'resolvido' ||
              tk.status === 'fechado'
          ).length;

          return (
            <div
              key={t.email}
              className={`rounded-2xl border p-4 ${
                isDark
                  ? 'border-white/10 bg-[#0b1624]'
                  : 'border-slate-200 bg-white shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold ${
                    isDark
                      ? 'bg-cyan-500/10 text-cyan-400'
                      : 'bg-cyan-50 text-cyan-600'
                  }`}
                >
                  {t.name.charAt(0)}
                </div>

                <div className="min-w-0">
                  <p
                    className={`text-sm font-bold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {t.name}
                  </p>

                  <p
                    className={`text-xs ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {t.role}
                  </p>
                </div>
              </div>

              <div
                className={`grid grid-cols-2 gap-2 mt-4 pt-4 border-t text-center ${
                  isDark ? 'border-white/5' : 'border-slate-100'
                }`}
              >
                <div
                  className={`rounded-lg p-2 ${
                    isDark ? 'bg-black/20' : 'bg-slate-50'
                  }`}
                >
                  <span
                    className={`block text-base font-bold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {techTickets.length}
                  </span>

                  <span
                    className={`text-[10px] ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Atribuídos
                  </span>
                </div>

                <div
                  className={`rounded-lg p-2 ${
                    isDark ? 'bg-black/20' : 'bg-slate-50'
                  }`}
                >
                  <span className="block text-base font-bold text-emerald-500">
                    {concluidos}
                  </span>

                  <span
                    className={`text-[10px] ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Concluídos
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}