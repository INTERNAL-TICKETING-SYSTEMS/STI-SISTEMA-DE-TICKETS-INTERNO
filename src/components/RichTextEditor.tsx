import React, { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Palette,
  Highlighter,
  ChevronDown,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
}

const fontColors = [
  { name: 'Preto', color: '#000000' },
  { name: 'Cinza escuro', color: '#434343' },
  { name: 'Cinza', color: '#666666' },
  { name: 'Cinza claro', color: '#B7B7B7' },
  { name: 'Branco', color: '#FFFFFF' },
  { name: 'Vermelho', color: '#E53935' },
  { name: 'Laranja', color: '#FB8C00' },
  { name: 'Amarelo', color: '#FDD835' },
  { name: 'Verde claro', color: '#93C47D' },
  { name: 'Verde', color: '#43A047' },
  { name: 'Água-marinha', color: '#76A5AF' },
  { name: 'Turquesa', color: '#00ACC1' },
  { name: 'Azul claro', color: '#6FA8DC' },
  { name: 'Azul', color: '#1E88E5' },
  { name: 'Púrpura', color: '#8E24AA' },
];

const highlightColors = [
  { name: 'Amarelo', color: '#FFFF00' },
  { name: 'Verde claro', color: '#B7E1CD' },
  { name: 'Azul claro', color: '#A4C2F4' },
  { name: 'Rosa', color: '#F4CCCC' },
  { name: 'Lilás', color: '#D9B8FF' },
  { name: 'Laranja claro', color: '#FCE5CD' },
  { name: 'Cinza claro', color: '#E6E6E6' },
];

const toolbarButtonClass =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-700 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-200 dark:hover:bg-slate-700';

const paletteButtonClass =
  'flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 transition hover:scale-110 hover:border-teal-500 dark:border-slate-600';

export default function RichTextEditor({
  value,
  onChange,
  disabled = false,
}: RichTextEditorProps) {
  const [fontPaletteOpen, setFontPaletteOpen] = useState(false);
  const [highlightPaletteOpen, setHighlightPaletteOpen] = useState(false);
  const [fontHex, setFontHex] = useState('#000000');
  const [highlightHex, setHighlightHex] = useState('#FFFF00');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value || '<p></p>',
    editable: !disabled,
    editorProps: {
      attributes: {
        class:
          'ticket-rich-editor min-h-[260px] max-h-[600px] overflow-y-auto px-4 py-3 text-sm leading-relaxed outline-none',
        'aria-label': 'Descrição do chamado',
        'aria-multiline': 'true',
        'aria-required': 'true',
        'data-placeholder': 'Descreva sua solicitação...',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sincroniza alterações externas, como o preenchimento de modelos.
  useEffect(() => {
    if (!editor) return;

    if (editor.getHTML() !== (value || '<p></p>')) {
      editor.commands.setContent(value || '<p></p>', {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  // Atualiza o estado de edição sem recriar o editor.
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  if (!editor) {
    return (
      <div className="rounded-xl border border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-600">
        Preparando editor...
      </div>
    );
  }

  const applyFontColor = (color: string) => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(color)) return;

    editor.chain().focus().setColor(color).run();
    setFontHex(color.toUpperCase());
    setFontPaletteOpen(false);
  };

  const applyHighlightColor = (color: string) => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(color)) return;

    editor.chain().focus().setHighlight({ color }).run();
    setHighlightHex(color.toUpperCase());
    setHighlightPaletteOpen(false);
  };

  const actions = [
    {
      label: 'Negrito',
      icon: Bold,
      active: editor.isActive('bold'),
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: 'Itálico',
      icon: Italic,
      active: editor.isActive('italic'),
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: 'Sublinhado',
      icon: UnderlineIcon,
      active: editor.isActive('underline'),
      run: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      label: 'Tachado',
      icon: Strikethrough,
      active: editor.isActive('strike'),
      run: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      label: 'Lista com marcadores',
      icon: List,
      active: editor.isActive('bulletList'),
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: 'Lista numerada',
      icon: ListOrdered,
      active: editor.isActive('orderedList'),
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: 'Alinhar à esquerda',
      icon: AlignLeft,
      active: editor.isActive({ textAlign: 'left' }),
      run: () => editor.chain().focus().setTextAlign('left').run(),
    },
    {
      label: 'Centralizar',
      icon: AlignCenter,
      active: editor.isActive({ textAlign: 'center' }),
      run: () => editor.chain().focus().setTextAlign('center').run(),
    },
    {
      label: 'Alinhar à direita',
      icon: AlignRight,
      active: editor.isActive({ textAlign: 'right' }),
      run: () => editor.chain().focus().setTextAlign('right').run(),
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-950">
      <div
        role="toolbar"
        aria-label="Formatação do texto"
        className="flex flex-wrap items-center gap-1 border-b border-slate-300 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800"
      >
        {actions.map(({ label, icon: Icon, active, run }) => (
          <button
            key={label}
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={active}
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={run}
            className={`${toolbarButtonClass} ${active
                ? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
                : ''
              }`}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}

        <div className="mx-1 h-6 w-px bg-slate-300 dark:bg-slate-600" />

        {/* Cor da fonte */}
        <div className="relative">
          <button
            type="button"
            title="Cor da fonte"
            aria-label="Abrir paleta de cores da fonte"
            aria-expanded={fontPaletteOpen}
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setFontPaletteOpen(!fontPaletteOpen);
              setHighlightPaletteOpen(false);
            }}
            className={`${toolbarButtonClass} w-auto gap-1 px-2`}
          >
            <Palette className="h-4 w-4" />
            <span className="text-xs font-medium">Cor</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {fontPaletteOpen && (
            <div className="absolute left-0 top-full z-30 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <p className="mb-3 text-xs font-semibold text-slate-700 dark:text-slate-200">
                Cor da fonte
              </p>

              <div className="grid grid-cols-5 gap-2">
                {fontColors.map(({ name, color }) => (
                  <button
                    key={color}
                    type="button"
                    title={name}
                    aria-label={name}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => applyFontColor(color)}
                    className={paletteButtonClass}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="my-3 border-t border-slate-200 dark:border-slate-700" />

              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
                Escolher cor personalizada
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fontHex}
                  aria-label="Selecionar cor personalizada da fonte"
                  onChange={(event) => {
                    const color = event.currentTarget.value.toUpperCase();
                    setFontHex(color);
                    applyFontColor(color);
                  }}
                  className="h-9 w-10 cursor-pointer rounded border-0 bg-transparent"
                />

                <input
                  type="text"
                  value={fontHex}
                  maxLength={7}
                  aria-label="Código hexadecimal da fonte"
                  onChange={(event) => setFontHex(event.target.value.toUpperCase())}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') applyFontColor(fontHex);
                  }}
                  className="h-9 min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-800 outline-none focus:border-teal-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />

                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => applyFontColor(fontHex)}
                  className="h-9 rounded-md bg-teal-600 px-3 text-xs font-semibold text-white hover:bg-teal-700"
                >
                  Aplicar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Marca-texto */}
        <div className="relative">
          <button
            type="button"
            title="Marca-texto"
            aria-label="Abrir paleta de marca-texto"
            aria-expanded={highlightPaletteOpen}
            disabled={disabled}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setHighlightPaletteOpen(!highlightPaletteOpen);
              setFontPaletteOpen(false);
            }}
            className={`${toolbarButtonClass} w-auto gap-1 px-2`}
          >
            <Highlighter className="h-4 w-4" />
            <span className="text-xs font-medium">Realce</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {highlightPaletteOpen && (
            <div className="absolute left-0 top-full z-30 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-700 dark:bg-slate-900">
              <p className="mb-3 text-xs font-semibold text-slate-700 dark:text-slate-200">
                Cor do marca-texto
              </p>

              <div className="grid grid-cols-5 gap-2">
                {highlightColors.map(({ name, color }) => (
                  <button
                    key={color}
                    type="button"
                    title={name}
                    aria-label={`Marca-texto ${name}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => applyHighlightColor(color)}
                    className={paletteButtonClass}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="my-3 border-t border-slate-200 dark:border-slate-700" />

              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
                Escolher cor personalizada
              </label>

              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={highlightHex}
                  aria-label="Selecionar cor personalizada do marca-texto"
                  onChange={(event) => {
                    const color = event.currentTarget.value.toUpperCase();
                    setHighlightHex(color);
                    applyHighlightColor(color);
                  }}
                  className="h-9 w-10 cursor-pointer rounded border-0 bg-transparent"
                />

                <input
                  type="text"
                  value={highlightHex}
                  maxLength={7}
                  aria-label="Código hexadecimal do marca-texto"
                  onChange={(event) => setHighlightHex(event.target.value.toUpperCase())}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') applyHighlightColor(highlightHex);
                  }}
                  className="h-9 min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-800 outline-none focus:border-teal-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                />

                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => applyHighlightColor(highlightHex)}
                  className="h-9 rounded-md bg-teal-600 px-3 text-xs font-semibold text-white hover:bg-teal-700"
                >
                  Aplicar
                </button>
              </div>

              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  editor.chain().focus().unsetHighlight().run();
                  setHighlightPaletteOpen(false);
                }}
                className="mt-3 text-xs font-medium text-slate-600 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-400"
              >
                Remover marca-texto
              </button>
            </div>
          )}
        </div>

        <div className="mx-1 h-6 w-px bg-slate-300 dark:bg-slate-600" />

        <button
          type="button"
          title="Desfazer"
          aria-label="Desfazer"
          disabled={disabled || !editor.can().undo()}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().undo().run()}
          className={toolbarButtonClass}
        >
          <Undo2 className="h-4 w-4" />
        </button>

        <button
          type="button"
          title="Refazer"
          aria-label="Refazer"
          disabled={disabled || !editor.can().redo()}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.chain().focus().redo().run()}
          className={toolbarButtonClass}
        >
          <Redo2 className="h-4 w-4" />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
