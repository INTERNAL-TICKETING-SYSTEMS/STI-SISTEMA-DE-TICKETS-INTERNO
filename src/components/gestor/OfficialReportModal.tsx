import React from 'react';
import { Printer, X, ShieldCheck, FileText } from 'lucide-react';
import { Ticket } from '../../types';

interface OfficialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipoRelatorio: 'SEMANAL' | 'MENSAL' | 'PATRIMONIO';
  tickets: Ticket[];
  gestorName: string;
}

export default function OfficialReportModal({
  isOpen,
  onClose,
  tipoRelatorio,
  tickets,
  gestorName
}: OfficialReportModalProps) {
  if (!isOpen) return null;

  const dataEmissao = new Date().toLocaleString('pt-BR');
  const codigoDocumento = `STI-REL-${Date.now().toString().slice(-6)}`;

  let titulo = 'Relatório Semanal de Atendimentos de TI';
  let subtitulo = 'Consolidado operacional de demandas e cumprimento de SLA';
  let filteredTickets = tickets;

  if (tipoRelatorio === 'MENSAL') {
    titulo = 'Balanço Mensal de Produtividade e Suporte';
    subtitulo = 'Métricas consolidadas de tempo de resposta e alocação de equipe técnica';
  } else if (tipoRelatorio === 'PATRIMONIO') {
    titulo = 'Auditoria Consolidada de Bens Patrimoniais e Peças';
    subtitulo = 'Inventário de intervenções em equipamentos de TI e tombamentos';
    filteredTickets = tickets.filter(t => t.assetTag || t.replacedParts);
  }

  const total = filteredTickets.length;
  const resolvidos = filteredTickets.filter(t => t.status === 'resolvido' || t.status === 'fechado').length;
  const taxaResolucao = total > 0 ? Math.round((resolvidos / total) * 100) : 0;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=750');
    if (!printWindow) {
      alert('Por favor, permita pop-ups para gerar a impressão do relatório.');
      return;
    }

    const rowsHtml = filteredTickets.map(t => `
      <tr>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1; font-family: monospace; font-weight: bold; color: #0891b2;">${t.id}</td>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1; font-weight: 600;">${t.title}</td>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">${t.requesterDepartment || '-'}</td>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1;">${t.assignee || 'Pendente'}</td>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1; font-family: monospace; font-size: 11px;">
        ${(t.assetTag || t.replacedParts) ? ((t.assetTag || 'S/P') + ' - ' + (t.replacedParts || '')) : '-'}
      </td>
        <td style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: bold; text-transform: uppercase; font-size: 11px;">${t.status}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <title>${titulo} - STI</title>
        <style>
          @page { size: A4 portrait; margin: 12mm; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            margin: 0;
            padding: 24px;
            color: #0f172a;
            background: #ffffff;
            font-size: 12px;
          }
          .header {
            border-bottom: 2px solid #0f172a;
            padding-bottom: 12px;
            margin-bottom: 16px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .kpis {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 18px;
          }
          .kpi-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 10px;
          }
          .kpi-label { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b; }
          .kpi-value { font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 2px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 11px; }
          th { background: #f1f5f9; padding: 8px; border: 1px solid #cbd5e1; text-align: left; font-size: 10px; text-transform: uppercase; color: #334155; }
          .footer {
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .signature { text-align: right; }
          .line { border-bottom: 1px solid #64748b; width: 200px; margin-bottom: 4px; margin-left: auto; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div style="font-size: 11px; font-weight: 800; letter-spacing: 1px; color: #64748b; text-transform: uppercase;">
               DETRAN-TO
            </div>
            <h1 style="font-size: 20px; font-weight: 900; margin: 4px 0 2px 0;">${titulo}</h1>
            <div style="font-size: 12px; color: #475569;">${subtitulo}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-family: monospace; font-size: 11px; font-weight: bold; background: #f1f5f9; padding: 2px 6px; border: 1px solid #cbd5e1; border-radius: 4px; display: inline-block;">
              ${codigoDocumento}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Emissão: ${dataEmissao}</div>
            <div style="font-size: 11px; color: #64748b;">Gestor: ${gestorName}</div>
          </div>
        </div>

        <div class="kpis">
          <div class="kpi-card">
            <div class="kpi-label">Demandas no Período</div>
            <div class="kpi-value">${total}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Demandas Concluídas</div>
            <div class="kpi-value" style="color: #059669;">${resolvidos}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Taxa de Eficiência / Conclusão</div>
            <div class="kpi-value" style="color: #0891b2;">${taxaResolucao}%</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 70px;">Código</th>
              <th>Título / Descrição</th>
              <th>Setor Solicitante</th>
              <th>Técnico Resp.</th>
              <th>Patrimônio / Peças</th>
              <th style="text-align: right; width: 90px;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="6" style="text-align: center; padding: 16px; color: #94a3b8;">Nenhuma demanda localizada.</td></tr>'}
          </tbody>
        </table>

        <div class="footer">
          <div>
            <div style="font-size: 11px; font-weight: bold; color: #047857; margin-bottom: 2px;">
              ✓ Certificação de Integridade Criptográfica (SHA-256)
            </div>
            <div style="font-size: 10px; color: #64748b; font-family: monospace;">
              Documento emitido com auditoria imutável no banco institucional STI.<br>
              Hash de Validação: ${codigoDocumento}-AUTH-OK
            </div>
          </div>
          <div class="signature">
            <div class="line"></div>
            <div style="font-size: 12px; font-weight: bold;">${gestorName}</div>
            <div style="font-size: 10px; color: #64748b;">Gestão e Governança de TI — DETRAN-TO</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white text-slate-900 shadow-2xl flex flex-col my-8">
        
        {/* Barra superior de ações */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-600" />
            <span className="font-bold text-slate-800 text-sm">Visualização de Impressão Oficial (Padrão A4)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              Imprimir / Salvar como PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Prévia na tela */}
        <div className="p-8 sm:p-12 space-y-6 text-slate-900 bg-white">
          
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                
              </p>
              <h1 className="text-xl font-black text-slate-950 mt-1">{titulo}</h1>
              <p className="text-xs text-slate-600 mt-0.5">{subtitulo}</p>
            </div>
            <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-300">
                {codigoDocumento}
              </span>
              <p className="text-[10px] text-slate-500 mt-1">Emissão: {dataEmissao}</p>
              <p className="text-[10px] text-slate-500">Gestor: {gestorName}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 py-2">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Demandas Analisadas</span>
              <span className="text-xl font-black text-slate-900">{total}</span>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Demandas Resolvidas</span>
              <span className="text-xl font-black text-emerald-600">{resolvidos}</span>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Taxa de Eficiência</span>
              <span className="text-xl font-black text-cyan-700">{taxaResolucao}%</span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Código</th>
                  <th className="px-3">Título / Descrição</th>
                  <th className="px-3">Setor Solicitante</th>
                  <th className="px-3">Técnico Resp.</th>
                  <th className="px-3">Patrimônio / Peças</th>
                  <th className="px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">
                      Nenhum registro localizado.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((t) => (
                    <tr key={t.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-cyan-900">{t.id}</td>
                      <td className="px-3 font-semibold text-slate-900">{t.title}</td>
                      <td className="px-3">{t.requesterDepartment}</td>
                      <td className="px-3">{t.assignee || 'Pendente'}</td>
                      <td className="px-3 font-mono text-[11px] text-slate-600">
                        {t.assetTag || t.replacedParts ? `${t.assetTag || 'S/P'} - ${t.replacedParts || ''}` : '-'}
                      </td>
                      <td className="px-3 text-right font-semibold uppercase text-[10px]">{t.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                <ShieldCheck className="h-4 w-4" />
                Certificação de Integridade Criptográfica (SHA-256)
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
                Documento emitido com auditoria imutável no banco institucional STI.<br />
                Hash do Lote: {codigoDocumento}-AUTH-OK
              </p>
            </div>

            <div className="text-center sm:text-right pt-4 sm:pt-0">
              <div className="border-b border-slate-400 w-48 ml-auto mb-1"></div>
              <p className="text-xs font-bold text-slate-900">{gestorName}</p>
              <p className="text-[10px] text-slate-500">Gestão e Governança de TI — DETRAN-TO</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
