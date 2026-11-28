import LoginThreeBackground from './LoginThreeBackground';

interface LoginSceneProps {
  isDark: boolean;
}

export default function LoginScene({ isDark }: LoginSceneProps) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <LoginThreeBackground isDark={isDark} />

      <div
        className={`pointer-events-none absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-br from-[#06111d]/65 via-[#071421]/25 to-[#0b3b45]/45'
            : 'bg-gradient-to-br from-white/25 via-[#eaf2f7]/10 to-cyan-100/20'
        }`}
      />

      <div
        className="pointer-events-none absolute -right-24 top-[22%] h-72 w-72 rounded-full blur-3xl"
        style={{
          background: isDark
            ? 'rgba(13, 148, 136, 0.10)'
            : 'rgba(6, 182, 212, 0.08)',
        }}
      />

      <div
        className="pointer-events-none absolute -left-24 bottom-[15%] h-64 w-64 rounded-full blur-3xl"
        style={{
          background: isDark
            ? 'rgba(56, 189, 248, 0.06)'
            : 'rgba(14, 116, 144, 0.06)',
        }}
      />

      <div className="absolute left-[12%] right-8 top-[25%] flex max-w-[370px] flex-col items-start text-left lg:left-[14%]">
        <span
          className={`mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] ${
            isDark ? 'text-teal-300/75' : 'text-cyan-800/70'
          }`}
        >
          Atendimento inteligente
        </span>

        <h2
          className={`max-w-sm text-2xl font-semibold leading-snug lg:text-3xl ${
            isDark ? 'text-white/90' : 'text-slate-800'
          }`}
        >
          Suporte interno
          <span
            className={`mt-1 block ${
              isDark ? 'text-teal-300' : 'text-cyan-800'
            }`}
          >
            mais simples e organizado.
          </span>
        </h2>

        <p
          className={`mt-4 max-w-xs text-sm leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          Acompanhe solicitações e mantenha a equipe conectada.
        </p>
      </div>
    </div>
  );
}

