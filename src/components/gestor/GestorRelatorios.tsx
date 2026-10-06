
import React from 'react';
import {
  FileText,
  CalendarDays,
  MonitorCog,
  Download,
} from 'lucide-react';

import OfficialReportModal from '@/components/gestor/OfficialReportModal';
import { useGestorTheme } from '@/components/gestor/GestorSidebar';
import { Ticket } from '@/types';

type ReportType = 'SEMANAL' | 'MENSAL' | 'PATRIMONIO';

interface GestorRelatoriosProps {
  tickets: Ticket[];
  gestorName: string;
  reportModalOpen: boolean;
  selectedReportType: ReportType;
  onReportModalOpenChange: (open: boolean) => void;
  onSelectedReportTypeChange: (type: ReportType) => void;
}

export default function GestorRelatorios({
  tickets,
  gestorName,
  reportModalOpen,
  selectedReportType,
  onReportModalOpenChange,
  onSelectedReportTypeChange,
}: GestorRelatoriosProps) {
  const { isDark } = useGestorTheme();

  const panelClass = isDark
    ? 'border-white/10 bg-[#0b1624]'
    : 'border-slate-200 bg-white';

  const titleClass = isDark
    ? 'text-white'
    : 'text-slate-900';

  const descriptionClass = isDark
    ? 'text-slate-400'
    : 'text-slate-600';

  const reports = [
    {
      type: 'SEMANAL' as const,
      title: 'Relatório Semanal de Atendimentos',
      description:
        'Consolidado das demandas e tempos de resolução da semana corrente.',
      buttonLabel: 'Gerar PDF Semanal',
      icon: CalendarDays,
      buttonClass:
        'bg-cyan-500 text-slate-950 hover:bg-cyan-400',
    },
    {
      type: 'MENSAL' as const,
      title: 'Relatório Mensal de Produtividade',
      description:
        'Balanço mensal de horas gastas por técnico e peças substituídas.',
      buttonLabel: 'Gerar PDF Mensal',
      icon: MonitorCog,
      buttonClass:
        'bg-[#00A896] text-white hover:bg-teal-500',
    },
    {
      type: 'PATRIMONIO' as const,
      title: 'Auditoria Anual de Patrimônio',
      description:
        'Histórico completo de equipamentos intervencionados.',
      buttonLabel: 'Exportar Auditoria Patrimonial',
      icon: Download,
      buttonClass: isDark
        ? 'border border-white/15 bg-white/5 text-white hover:bg-white/10'
        : 'border border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200',
    },
  ];

  const abrirRelatorio = (type: ReportType) => {
    onSelectedReportTypeChange(type);
    onReportModalOpenChange(true);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            isDark
              ? 'bg-cyan-500/10 text-cyan-400'
              : 'bg-cyan-100 text-cyan-700'
          }`}
        >
          <FileText className="h-5 w-5" />
        </div>

        <div>
          <h2 className={`text-xl font-bold ${titleClass}`}>
            Central de Relatórios Oficiais
          </h2>

          <p className={`text-xs ${descriptionClass}`}>
            Emissão de relatórios consolidados em PDF e CSV.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => {
          const Icon = report.icon;

          return (
            <section
              key={report.type}
              className={`flex flex-col rounded-2xl border p-5 ${panelClass}`}
            >
              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${
                  isDark
                    ? 'bg-white/5 text-cyan-300'
                    : 'bg-slate-100 text-cyan-700'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <h3 className={`text-sm font-bold ${titleClass}`}>
                {report.title}
              </h3>

              <p
                className={`mt-2 flex-1 text-xs leading-relaxed ${descriptionClass}`}
              >
                {report.description}
              </p>

              <button
                type="button"
                onClick={() => abrirRelatorio(report.type)}
                className={`mt-5 w-full cursor-pointer rounded-xl px-4 py-2.5 text-xs font-bold ${report.buttonClass}`}
              >
                {report.buttonLabel}
              </button>
            </section>
          );
        })}
      </div>

      <OfficialReportModal
        isOpen={reportModalOpen}
        onClose={() => onReportModalOpenChange(false)}
        tipoRelatorio={selectedReportType}
        tickets={tickets}
        gestorName={gestorName}
      />
    </div>
  );
}