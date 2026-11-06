
import { useMemo } from 'react';
import { X, Printer, FileText, CheckCircle2, Clock, BarChart3, Package } from 'lucide-react';
import type { Ticket } from '../../types';

type ReportType = 'SEMANAL' | 'MENSAL' | 'PATRIMONIO';

interface OfficialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ReportType;
  tickets: Ticket[];
  gestorName: string;
}

const formatDate = (date: Date) =>
  date.toLocaleDateString('pt-BR');

const formatPeriod = (start: Date, end: Date) =>
  `${formatDate(start)} a ${formatDate(end)}`;

const normalize = (value?: string | null) =>
  (value || 'Não informado').trim() || 'Não informado';

export default function OfficialReportModal({
  isOpen,
  onClose,
  type,
  tickets,
  gestorName,
}: OfficialReportModalProps) {
  const report = useMemo(() => {
    const now = new Date();
    const start = new Date(now);

    if (type === 'SEMANAL') {
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);
    } else if (type === 'MENSAL') {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
    } else {
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
    }

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    const filtered = tickets.filter((ticket) => {
      const date = new Date(ticket.createdAt);
      if (Number.isNaN(date.getTime())) return false;

      if (type === 'PATRIMONIO') {
        return (
          date >= start &&
          date <= end &&
          Boolean(ticket.assetTag || ticket.replacedParts)
        );
      }

      return date >= start && date <= end;
    });

    const resolved = filtered.filter(
      (ticket) =>
        ticket.status === 'resolvido' || ticket.status === 'fechado'
    ).length;

    const pending = filtered.length - resolved;

    const categories = new Map<string, number>();

    filtered.forEach((ticket) => {
      const category = normalize(ticket.category);
      categories.set(category, (categories.get(category) || 0) + 1);
    });

    const categoryRows = Array.from(categories.entries())
      .sort((a, b) => b[1] - a[1]);

    const assetInterventions = filtered.filter(
      (ticket) => Boolean(ticket.assetTag || ticket.replacedParts)
    ).length;

    return {
      start,
      end,
      filtered,
      resolved,
      pending,
      rate: filtered.length
        ? Math.round((resolved / filtered.length) * 100)
        : 0,
      categoryRows,
      assetInterventions,
    };
  }, [tickets, type]);

  if (!isOpen) return null;

  const titles: Record<ReportType, string> = {
    SEMANAL: 'Relatório Semanal de Atendimentos',
    MENSAL: 'Relatório Mensal de Produtividade',
    PATRIMONIO: 'Relatório Anual de Patrimônio',
  };

  const periodLabel =
    type === 'SEMANAL'
      ? 'Últimos 7 dias'
      : type === 'MENSAL'
        ? 'Mês atual'
        : `Ano de ${new Date().getFullYear()}`;

  const documentCode = `STI-${type}-${Date.now().toString(36).toUpperCase()}`;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      alert('Não foi possível abrir a janela de impressão. Verifique se o navegador bloqueou pop-ups.');
      return;
    }

    const categoryRows = report.categoryRows
      .map(
        ([category, quantity]) => `
          <tr>
            <td>${escapeHtml(category)}</td>
            <td>${quantity}</td>
          </tr>
        `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>${escapeHtml(titles[type])}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: Arial, Helvetica, sans-serif;
            color: #1e293b;
            margin: 36px;
            font-size: 12px;
          }
          .header {
            border-bottom: 3px solid #0f766e;
            padding-bottom: 18px;
            margin-bottom: 24px;
          }
          .brand {
            color: #0f766e;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 2px;
          }
          h1 { font-size: 21px; margin: 10px 0; }
          .muted { color: #64748b; }
          .meta {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            margin-top: 16px;
            flex-wrap: wrap;
          }
          .cards {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin: 24px 0;
          }
          .card {
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 14px;
          }
          .card span { display: block; color: #64748b; font-size: 10px; }
          .card strong { display: block; font-size: 23px; margin-top: 8px; }
          h2 {
            font-size: 15px;
            margin-top: 28px;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 8px;
          }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td {
            border: 1px solid #cbd5e1;
            padding: 10px;
            text-align: left;
          }
          th { background: #f1f5f9; }
          .footer {
            margin-top: 50px;
            border-top: 1px solid #cbd5e1;
            padding-top: 14px;
            color: #64748b;
            font-size: 10px;
          }
          @media print {
            body { margin: 18mm; }
            .card { break-inside: avoid; }
          }
          @media (max-width: 600px) {
            .cards { grid-template-columns: repeat(2, 1fr); }
          }
        </style>
      </head>
      <body>
        <header class="header">
          <div class="brand">STI · SISTEMA DE TICKETS INTERNO</div>
          <h1>${escapeHtml(titles[type])}</h1>
          <div class="muted">Relatório gerencial consolidado</div>
          <div class="meta">
            <div><strong>Período:</strong> ${escapeHtml(formatPeriod(report.start, report.end))}</div>
            <div><strong>Documento:</strong> ${escapeHtml(documentCode)}</div>
            <div><strong>Emissão:</strong> ${escapeHtml(formatDate(new Date()))}</div>
          </div>
        </header>

        <section class="cards">
          <div class="card"><span>Total de chamados</span><strong>${report.filtered.length}</strong></div>
          <div class="card"><span>Resolvidos ou fechados</span><strong>${report.resolved}</strong></div>
          <div class="card"><span>Pendentes</span><strong>${report.pending}</strong></div>
          <div class="card"><span>Taxa de resolução</span><strong>${report.rate}%</strong></div>
        </section>

        ${type === 'PATRIMONIO'
        ? `<h2>Indicadores patrimoniais</h2>
               <p>Quantidade de chamados com registro de patrimônio ou peças substituídas: <strong>${report.assetInterventions}</strong>.</p>
               <p class="muted">Este relatório apresenta somente indicadores consolidados, sem identificação individual de equipamentos ou solicitantes.</p>`
        : `<h2>Distribuição por categoria</h2>
               ${report.categoryRows.length
          ? `<table><thead><tr><th>Categoria</th><th>Quantidade</th></tr></thead><tbody>${categoryRows}</tbody></table>`
          : '<p>Não há categorias disponíveis para o período selecionado.</p>'
        }`
      }

        <footer class="footer">
          <p>Documento emitido pelo Sistema de Tickets Interno (STI).</p>
          <p>Responsável pela emissão: ${escapeHtml(gestorName || 'Gestor')}</p>
          <p>Relatório consolidado para acompanhamento gerencial. Não contém dados individuais dos chamados.</p>
        </footer>
        <script>window.onload = () => window.print();</script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6">
      <div className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-teal-50 p-2.5 text-teal-700">
              <FileText size={22} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Visualização do relatório</h2>
              <p className="text-xs text-slate-500">{documentCode}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label="Fechar relatório"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto bg-slate-100 p-4 sm:p-8">
          <article className="mx-auto min-h-[600px] max-w-[800px] bg-white p-6 shadow-sm sm:p-10">
            <header className="border-b-4 border-teal-700 pb-5">
              <div className="text-xs font-bold tracking-[0.2em] text-teal-700">
                STI · SISTEMA DE TICKETS INTERNO
              </div>
              <h1 className="mt-3 text-2xl font-bold text-slate-900">
                {titles[type]}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Relatório gerencial consolidado
              </p>
              <div className="mt-5 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
                <p><strong>Período:</strong> {formatPeriod(report.start, report.end)}</p>
                <p><strong>Referência:</strong> {periodLabel}</p>
                <p><strong>Documento:</strong> {documentCode}</p>
                <p><strong>Emissão:</strong> {formatDate(new Date())}</p>
              </div>
            </header>

            <section className="my-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <MetricCard label="Total de chamados" value={report.filtered.length} icon={<BarChart3 size={18} />} />
              <MetricCard label="Resolvidos" value={report.resolved} icon={<CheckCircle2 size={18} />} />
              <MetricCard label="Pendentes" value={report.pending} icon={<Clock size={18} />} />
              <MetricCard label="Taxa de resolução" value={`${report.rate}%`} icon={<CheckCircle2 size={18} />} />
            </section>

            {type === 'PATRIMONIO' ? (
              <section className="mt-8">
                <h3 className="mb-3 border-b border-slate-200 pb-2 font-bold text-slate-800">
                  Indicadores patrimoniais
                </h3>
                <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-5">
                  <Package className="text-teal-700" size={28} />
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{report.assetInterventions}</p>
                    <p className="text-sm text-slate-500">
                      Chamados com registro de patrimônio ou peças substituídas
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-500">
                  Os dados são apresentados de forma agregada, sem identificação individual de equipamentos ou solicitantes.
                </p>
              </section>
            ) : (
              <section className="mt-8">
                <h3 className="mb-3 border-b border-slate-200 pb-2 font-bold text-slate-800">
                  Distribuição por categoria
                </h3>
                {report.categoryRows.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-100 text-slate-600">
                        <tr>
                          <th className="p-3">Categoria</th>
                          <th className="p-3 text-right">Quantidade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.categoryRows.map(([category, quantity]) => (
                          <tr key={category} className="border-b border-slate-100">
                            <td className="p-3 text-slate-700">{category}</td>
                            <td className="p-3 text-right font-semibold text-slate-800">{quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                    Não há categorias disponíveis para o período selecionado.
                  </p>
                )}
              </section>
            )}

            <footer className="mt-16 border-t border-slate-200 pt-5 text-xs text-slate-500">
              <p className="font-semibold text-slate-700">
                Responsável pela emissão: {gestorName || 'Gestor'}
              </p>
              <p className="mt-2">
                Documento emitido pelo Sistema de Tickets Interno (STI).
              </p>
              <p className="mt-1">
                Relatório consolidado para acompanhamento gerencial, sem dados individuais dos chamados.
              </p>
            </footer>
          </article>
        </div>

        <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            <Printer size={17} />
            Imprimir / Salvar PDF
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2 text-slate-500">
        <span className="text-xs">{label}</span>
        <span className="text-teal-700">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return entities[character];
  });
}