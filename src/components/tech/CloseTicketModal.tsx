import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface CloseTicketModalProps {
  isOpen: boolean;
  ticketProtocolo: string;
  onClose: () => void;
  onConfirm: (parecerTecnico: string) => Promise<void>;
}

export const CloseTicketModal: React.FC<CloseTicketModalProps> = ({
  isOpen,
  ticketProtocolo,
  onClose,
  onConfirm
}) => {
  const [parecer, setParecer] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parecer.trim().length < 15) {
      setErro('O parecer técnico deve conter pelo menos 15 caracteres para conformidade (Regra REG-001).');
      return;
    }

    try {
      setLoading(true);
      setErro('');
      await onConfirm(parecer.trim());
      setParecer('');
      onClose();
    } catch (err: any) {
      setErro(err?.message || 'Falha ao registrar encerramento auditado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Cabeçalho */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Encerramento com Parecer Técnico</h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl text-xs text-blue-200 flex gap-2.5 items-start">
            <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-blue-300">Conformidade e Rastreabilidade Forense:</span>
              <p className="mt-0.5 text-slate-300">
                O encerramento do chamado <strong className="text-white font-mono">{ticketProtocolo}</strong> será despachado ao microsserviço <strong>DATA-AUDIT</strong> e assinado criptograficamente com hash SHA-256.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Parecer Técnico / Solução Aplicada <span className="text-red-400">*</span>
            </label>
            <textarea
              value={parecer}
              onChange={(e) => {
                setParecer(e.target.value);
                if (erro) setErro('');
              }}
              placeholder="Ex: Conector RJ-45 substituído no ponto de rede 04. Link testado com DHCP operando em 1Gbps full-duplex sem perda de pacotes."
              rows={4}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 resize-none transition"
            />
            <div className="flex justify-between items-center mt-1.5 text-xs text-slate-400">
              <span>Mínimo 15 caracteres (Auditoria REG-001)</span>
              <span className={parecer.length >= 15 ? 'text-emerald-400 font-mono' : 'text-slate-500 font-mono'}>
                {parecer.length}/15
              </span>
            </div>
          </div>

          {erro && (
            <div className="p-3 bg-red-950/50 border border-red-800/60 rounded-xl text-xs text-red-300 flex gap-2 items-center">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 border border-slate-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || parecer.trim().length < 15}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              {loading ? 'Auditorando...' : 'Concluir Chamado'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
