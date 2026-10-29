import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Search,
  ChevronDown,
  X,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import { helpArticles } from './helpArticles';

interface HelpCenterModalProps {
  isOpen: boolean;
  isDark: boolean;
  onClose: () => void;
  onSelectCategory: (
    category: string,
    title: string,
    descriptionTemplate?: string,
  ) => void;
}

export default function HelpCenterModal({
  isOpen,
  isDark,
  onClose,
  onSelectCategory,
}: HelpCenterModalProps) {
  const [query, setQuery] = useState('');
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

    if (!normalizedQuery) return helpArticles;

    const words = normalizedQuery.split(/\s+/);

    return helpArticles.filter((article) => {
      const searchableText = [
        article.title,
        article.keywords,
        article.category,
        ...article.solution,
      ]
        .join(' ')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

      return words.every((word) => searchableText.includes(word));
    });
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setExpandedArticle(null);
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const panelClass = isDark
    ? 'border-white/10 bg-[#0b1624] text-slate-100'
    : 'border-slate-200 bg-white text-slate-900';

  const mutedClass = isDark ? 'text-slate-400' : 'text-slate-600';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="sti-help-title"
        className={[
          'flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl',
          panelClass,
        ].join(' ')}
      >
        <header
          className={[
            'flex items-start justify-between gap-4 border-b p-5 sm:p-6',
            isDark ? 'border-white/10' : 'border-slate-200',
          ].join(' ')}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white">
              <BookOpen className="h-5 w-5" />
            </div>

            <div>
              <h2 id="sti-help-title" className="text-lg font-bold">
                Central de Ajuda do STI
              </h2>
              <p className={['mt-1 text-sm', mutedClass].join(' ')}>
                Consulte orientações antes de abrir um chamado.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar Central de Ajuda"
            className={[
              'rounded-lg p-2 transition-colors',
              isDark
                ? 'text-slate-400 hover:bg-white/10 hover:text-white'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
            ].join(' ')}
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="overflow-y-auto p-5 sm:p-6">
          <label htmlFor="sti-help-search" className="mb-2 block text-sm font-medium">
            Qual problema você está enfrentando?
          </label>

          <div className="relative">
            <Search
              className={[
                'absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2',
                mutedClass,
              ].join(' ')}
            />

            <input
              id="sti-help-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex.: internet, senha, impressora..."
              className={[
                'w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-teal-500',
                isDark
                  ? 'border-white/10 bg-slate-950 text-white placeholder:text-slate-500'
                  : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400',
              ].join(' ')}
            />
          </div>

          <p
            className={[
              'mb-3 mt-5 text-xs font-semibold uppercase tracking-wider',
              mutedClass,
            ].join(' ')}
          >
            {query.trim() ? 'Resultados encontrados' : 'Problemas frequentes'}
            {' · '}
            {filteredArticles.length}
          </p>

          <div className="space-y-2">
            {filteredArticles.map((article) => {
              const isExpanded = expandedArticle === article.id;

              return (
                <article
                  key={article.id}
                  className={[
                    'overflow-hidden rounded-xl border',
                    isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-white',
                  ].join(' ')}
                >
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() =>
                      setExpandedArticle(isExpanded ? null : article.id)
                    }
                    className={[
                      'flex w-full items-center gap-3 p-4 text-left transition-colors',
                      isDark ? 'hover:bg-white/[0.05]' : 'hover:bg-slate-50',
                    ].join(' ')}
                  >
                    <BookOpen className="h-4 w-4 shrink-0 text-teal-500" />

                    <span className="flex-1 text-sm font-semibold">
                      {article.title}
                    </span>

                    <ChevronDown
                      className={[
                        'h-4 w-4 shrink-0 transition-transform',
                        mutedClass,
                        isExpanded ? 'rotate-180' : '',
                      ].join(' ')}
                    />
                  </button>

                  {isExpanded && (
                    <div
                      className={[
                        'border-t px-4 pb-4 pt-3',
                        isDark ? 'border-white/10' : 'border-slate-200',
                      ].join(' ')}
                    >
                      <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed">
                        {article.solution.map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))}
                      </ol>

                      <button
                        type="button"
                        onClick={() =>
                          onSelectCategory(
                            article.category,
                            article.ticketTitle,
                            article.descriptionTemplate,
                          )
                        }
                        className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
                      >
                        Usar esta categoria
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </article>
              );
            })}

            {filteredArticles.length === 0 && (
              <div
                className={[
                  'rounded-xl border border-dashed p-6 text-center',
                  isDark ? 'border-white/15' : 'border-slate-300',
                ].join(' ')}
              >
                <Lightbulb className={['mx-auto h-7 w-7', mutedClass].join(' ')} />

                <p className="mt-2 text-sm font-semibold">
                  Nenhuma solução encontrada
                </p>

                <p className={['mt-1 text-sm', mutedClass].join(' ')}>
                  Tente pesquisar por outra palavra ou abra um chamado para a
                  equipe de TI.
                </p>
              </div>
            )}
          </div>
        </div>

        <footer
          className={[
            'flex flex-wrap items-center justify-between gap-3 border-t px-5 py-4 sm:px-6',
            isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-50',
          ].join(' ')}
        >
          <span className={['text-xs', mutedClass].join(' ')}>
            Não encontrou a solução? Nossa equipe pode ajudar.
          </span>

          <button
            type="button"
            onClick={() => onSelectCategory('outro', '')}
            className="inline-flex items-center gap-2 rounded-xl bg-[#00A896] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#009181]"
          >
            Abrir um chamado
            <ArrowRight className="h-4 w-4" />
          </button>
        </footer>
      </section>
    </div>
  );
}
