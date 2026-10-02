import React, { useEffect, useState } from 'react';
import { dataAuditService, AuditEventResponse, DataViolationResponse } from '../../services/dataAuditService';

export const AuditCompliancePanel: React.FC = () => {
  const [eventos, setEventos] = useState<AuditEventResponse[]>([]);
  const [violacoes, setViolacoes] = useState<DataViolationResponse[]>([]);
  const [abaAtiva, setAbaAtiva] = useState<'LOGS' | 'VIOLACOES'>('LOGS');
  const [carregando, setCarregando] = useState(false);
  const [validandoId, setValidandoId] = useState<number | null>(null);
  const [resultadoIntegridade, setResultadoIntegridade] = useState<{ id: number; status: string } | null>(null);

  const carregarDados = async () => {
    setCarregando(true);
    const [ev, vi] = await Promise.all([
      dataAuditService.listarEventos(0, 30),
      dataAuditService.listarViolacoes()
    ]);
    setEventos(ev);
    setViolacoes(vi);
    setCarregando(false);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleVerificarHash = async (id: number) => {
    setValidandoId(id);
    const resp = await dataAuditService.verificarIntegridade(id);
    if (resp) {
      setResultadoIntegridade({ id, status: resp.statusIntegridade });
    }
    setValidandoId(null);
  };

  const handleResolver = async (id: number) => {
    const ok = await dataAuditService.resolverViolacao(id, 'Resolvido pelo Gestor via Painel STI.');
    if (ok) carregarDados();
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-slate-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>🛡️</span> Trilha de Auditoria & Conformidade Forense
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Integrado ao microsserviço Spring Boot DATA-AUDIT (PostgreSQL / SHA-256)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={carregarDados}
            disabled={carregando}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-medium rounded-lg border border-slate-700 transition"
          >
            {carregando ? 'Atualizando...' : '🔄 Atualizar Dados'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 my-6">
        <button
          onClick={() => setAbaAtiva('LOGS')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            abaAtiva === 'LOGS'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          Trilha de Eventos ({eventos.length})
        </button>
        <button
          onClick={() => setAbaAtiva('VIOLACOES')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
            abaAtiva === 'VIOLACOES'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/30'
              : 'bg-slate-800/80 text-slate-400 hover:text-white'
          }`}
        >
          Inconformidades / Violações
          {violacoes.some(v => v.statusResolucao === 'PENDENTE') && (
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          )}
        </button>
      </div>

      {/* Tabela de Eventos */}
      {abaAtiva === 'LOGS' && (
        <div className="bg-slate-800/50 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800 text-slate-400 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Data/Hora</th>
                  <th className="px-4 py-3">Operação</th>
                  <th className="px-4 py-3">Entidade</th>
                  <th className="px-4 py-3">Autor</th>
                  <th className="px-4 py-3">Hash SHA-256</th>
                  <th className="px-4 py-3 text-center">Forense</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {eventos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      Nenhum evento registrado ainda no DATA-AUDIT ou backend offline.
                    </td>
                  </tr>
                ) : (
                  eventos.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-800/60 transition">
                      <td className="px-4 py-3 font-mono text-xs text-blue-400">#{ev.id}</td>
                      <td className="px-4 py-3 text-xs">{new Date(ev.dataHoraEvento).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-700 text-slate-200">
                          {ev.tipoOperacao}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-300">
                        {ev.entidade} ({ev.idEntidade})
                      </td>
                      <td className="px-4 py-3 text-xs">{ev.autor}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-400" title={ev.hashIntegridade}>
                        {ev.hashIntegridade ? `${ev.hashIntegridade.slice(0, 16)}...` : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleVerificarHash(ev.id)}
                          disabled={validandoId === ev.id}
                          className="px-2.5 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 transition"
                        >
                          {validandoId === ev.id
                            ? 'Checando...'
                            : resultadoIntegridade?.id === ev.id
                            ? resultadoIntegridade.status === 'VALIDO'
                              ? '✅ Válido'
                              : '❌ Adulterado'
                            : '🔍 Checar'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tabela de Violações */}
      {abaAtiva === 'VIOLACOES' && (
        <div className="bg-slate-800/50 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800 text-slate-400 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Entidade Afetada</th>
                  <th className="px-4 py-3">Regra</th>
                  <th className="px-4 py-3">Severidade</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {violacoes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      Nenhuma inconformidade detectada pelo AuditRuleValidator.
                    </td>
                  </tr>
                ) : (
                  violacoes.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-800/60 transition">
                      <td className="px-4 py-3 font-mono text-xs text-amber-400">#{v.id}</td>
                      <td className="px-4 py-3 font-medium text-slate-200">Chamado {v.idEntidadeAfetada}</td>
                      <td className="px-4 py-3 text-xs">{v.tipoRegraViolada} - {v.descricaoInconformidade}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          v.severidade === 'CRITICA' || v.severidade === 'ALTA'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {v.severidade}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold">
                        {v.statusResolucao === 'PENDENTE' ? (
                          <span className="text-red-400">Pendente</span>
                        ) : (
                          <span className="text-emerald-400">Resolvido</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {v.statusResolucao === 'PENDENTE' && (
                          <button
                            onClick={() => handleResolver(v.id)}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium transition"
                          >
                            Resolver Ocorrência
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
