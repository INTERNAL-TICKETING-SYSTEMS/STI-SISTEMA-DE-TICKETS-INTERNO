import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, RefreshCw, KeyRound, Search, Download, CheckCircle2 } from 'lucide-react';

interface AuditEvent {
  id: number;
  origem: string;
  entidade: string;
  idEntidade: string;
  tipoOperacao: string;
  autor: string;
  dataHoraEvento: string;
  hashIntegridade: string;
  hashAnterior?: string | null;
}

export default function GestorAuditTable() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<Record<number, { valid: boolean; checking: boolean }>>({});
  const [batchChecking, setBatchChecking] = useState(false);

  const carregarEventos = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8081/api/v1/audit/events?size=100');
      if (res.ok) {
        const data = await res.json();
        setEvents(data.content || []);
      }
    } catch (err) {
      console.error('Falha ao buscar eventos de auditoria:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEventos();
  }, []);

  const verificarIntegridade = async (id: number): Promise<boolean> => {
    setVerificationStatus(prev => ({ ...prev, [id]: { valid: false, checking: true } }));
    try {
      const res = await fetch(`http://localhost:8081/api/v1/audit/events/${id}/verificar-integridade`);
      if (res.ok) {
        const result = await res.json();
        const valido = result.statusIntegridade === 'INTEGRO' || result.integro === true || 
                       (result.hashRecalculado && result.hashRecalculado === result.hashArmazenado);
        setVerificationStatus(prev => ({ ...prev, [id]: { valid: Boolean(valido), checking: false } }));
        return Boolean(valido);
      } else {
        setVerificationStatus(prev => ({ ...prev, [id]: { valid: false, checking: false } }));
        return false;
      }
    } catch {
      setVerificationStatus(prev => ({ ...prev, [id]: { valid: false, checking: false } }));
      return false;
    }
  };

  const verificarTodosEmLote = async () => {
    if (filteredEvents.length === 0 || batchChecking) return;
    setBatchChecking(true);

    for (const ev of filteredEvents) {
      await verificarIntegridade(ev.id);
    }

    setBatchChecking(false);
  };

  const exportarAuditoriaCSV = () => {
    const headers = ['ID', 'Data_Hora', 'Operacao', 'Entidade', 'ID_Entidade', 'Autor', 'Hash_SHA256'];
    const rows = filteredEvents.map(e => [
      e.id,
      `"${new Date(e.dataHoraEvento).toLocaleString('pt-BR')}"`,
      `"${e.tipoOperacao}"`,
      `"${e.entidade}"`,
      `"${e.idEntidade}"`,
      `"${e.autor}"`,
      `"${e.hashIntegridade}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `trilha_auditoria_sti_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEvents = events.filter(e => 
    e.tipoOperacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.entidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.idEntidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.hashIntegridade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalVerificados = Object.values(verificationStatus).filter(s => !s.checking).length;
  const totalIntegro = Object.values(verificationStatus).filter(s => s.valid && !s.checking).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-cyan-400" />
            Trilha Criptográfica de Auditoria (SHA-256)
          </h2>
          <p className="text-xs text-slate-400">
            Registro imutável em PostgreSQL com verificação de integridade ponto a ponto.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Filtrar por autor, operação, hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={verificarTodosEmLote}
            disabled={batchChecking || filteredEvents.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/30 transition-all disabled:opacity-50"
          >
            <ShieldCheck className={`h-3.5 w-3.5 ${batchChecking ? 'animate-bounce' : ''}`} />
            {batchChecking ? 'Validando Lote...' : 'Validar Todos (Lote)'}
          </button>

          <button
            onClick={exportarAuditoriaCSV}
            disabled={filteredEvents.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold hover:bg-cyan-500/30 transition-all disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            Exportar CSV
          </button>

          <button
            onClick={carregarEventos}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 text-slate-300 border border-white/10 text-xs font-semibold hover:bg-white/10 transition-all"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>
      </div>

      {totalVerificados > 0 && (
        <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs">
          <span className="text-slate-400">
            Eventos verificados: <strong className="text-white">{totalVerificados}</strong> de <strong className="text-white">{filteredEvents.length}</strong>
          </span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> {totalIntegro} íntegro(s)
          </span>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-[#0b1624] p-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-2.5 px-2">ID</th>
              <th className="px-2">Data / Hora</th>
              <th className="px-2">Operação</th>
              <th className="px-2">Entidade</th>
              <th className="px-2">Autor</th>
              <th className="px-2">Hash SHA-256</th>
              <th className="px-2 text-right">Integridade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-slate-500">
                  {loading ? 'Consultando nós de auditoria...' : 'Nenhum evento localizado.'}
                </td>
              </tr>
            ) : (
              filteredEvents.map((ev) => {
                const status = verificationStatus[ev.id];
                return (
                  <tr key={ev.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-2 font-mono text-cyan-400 font-bold">#{ev.id}</td>
                    <td className="px-2 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(ev.dataHoraEvento).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        {ev.tipoOperacao}
                      </span>
                    </td>
                    <td className="px-2 font-medium text-white">
                      {ev.entidade} <span className="text-slate-500">({ev.idEntidade})</span>
                    </td>
                    <td className="px-2 text-slate-300 truncate max-w-[150px]">{ev.autor}</td>
                    <td className="px-2 font-mono text-[10px] text-slate-400 truncate max-w-[180px]" title={ev.hashIntegridade}>
                      {ev.hashIntegridade ? `${ev.hashIntegridade.slice(0, 16)}...` : 'N/A'}
                    </td>
                    <td className="px-2 text-right">
                      {status?.checking ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-mono">
                          <RefreshCw className="h-3 w-3 animate-spin" /> Verificando...
                        </span>
                      ) : status?.valid === true ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <ShieldCheck className="h-3 w-3" /> Íntegro
                        </span>
                      ) : status?.valid === false ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          <ShieldAlert className="h-3 w-3" /> Adulterado
                        </span>
                      ) : (
                        <button
                          onClick={() => verificarIntegridade(ev.id)}
                          className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 border border-white/10 transition-colors"
                        >
                          Checar Hash
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
