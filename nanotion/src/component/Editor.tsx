import { useEditor, EditorContent, ReactRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Extension } from '@tiptap/core'; // <-- ESSE IMPORT ESTAVA FALTANDO
import Suggestion from '@tiptap/suggestion';
import tippy from 'tippy.js';
import CommandList from './CommandList';

// 1. Definição da Extensão Slash Command (Agora com o import correto)
const SlashCommandsExtension = Extension.create({
  name: 'slashCommands',
  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }) => {
          props.command({ editor, range });
        },
      },
    }
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
});

// 2. O Componente do Editor
const CustomNotionEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      SlashCommandsExtension.configure({
        suggestion: {
          items: ({ query }) => {
            return [
              {
                title: 'Texto Simples',
                command: ({ editor, range }) => {
                  editor.chain().focus().deleteRange(range).setNode('paragraph').run();
                },
              },
              {
                title: 'Título 1',
                command: ({ editor, range }) => {
                  editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
                },
              },
              {
                title: 'Título 2',
                command: ({ editor, range }) => {
                  editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
                },
              },
              {
                title: 'Lista de Marcadores',
                command: ({ editor, range }) => {
                  editor.chain().focus().deleteRange(range).toggleBulletList().run();
                },
              },
              {
                title: 'Citação',
                command: ({ editor, range }) => {
                  editor.chain().focus().deleteRange(range).toggleBlockquote().run();
                },
              },
            ].filter(item => item.title.toLowerCase().includes(query.toLowerCase())).slice(0, 10);
          },
          
          render: () => {
            let component;
            let popup;

            return {
              onStart: props => {
                component = new ReactRenderer(CommandList, {
                  props,
                  editor: props.editor,
                });

                if (!props.clientRect) {
                  return;
                }

                popup = tippy('body', {
                  getReferenceClientRect: props.clientRect,
                  appendTo: () => document.body,
                  content: component.element,
                  showOnCreate: true,
                  interactive: true,
                  trigger: 'manual',
                  placement: 'bottom-start',
                });
              },
              onUpdate(props) {
                component.updateProps(props);
                if (!props.clientRect) {
                  return;
                }
                popup[0].setProps({
                  getReferenceClientRect: props.clientRect,
                });
              },
              onKeyDown(props) {
                if (props.event.key === 'Escape') {
                  popup[0].hide();
                  return true;
                }
                return component.ref?.onKeyDown(props);
              },
              onExit() {
                if (popup && popup[0]) {
                  popup[0].destroy();
                }
                if (component) {
                  component.destroy();
                }
              },
            };
          },
        },
      }),
    ],
    content: '<p>Comece a escrever ou digite <strong>/</strong> para abrir os comandos...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none max-w-3xl py-10 px-4 min-h-[500px]',
      },
    },
  });

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
      <EditorContent editor={editor} />
    </div>
  );
};

export default CustomNotionEditor;