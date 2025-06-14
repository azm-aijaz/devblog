import { useRef, useEffect } from 'react';
import './QuillEditor.css';

// Create a unique ID for the editor instance
const EDITOR_ID = 'quill-editor'

function QuillEditor({ value, onChange }) {
  const quillRef = useRef(null);
  const editorInitialized = useRef(false);

  useEffect(() => {
    // Initialize Quill after component mounts, but only once
    if (!editorInitialized.current && window.Quill && window.QuillTableBetter) {
      editorInitialized.current = true;
      
      window.Quill.register({
        'modules/table-better': window.QuillTableBetter
      }, true);

      const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video', 'formula'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['table-better']
      ];

      const options = {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions,
          table: false,
          'table-better': {
            toolbarTable: true,
            menus: ['column', 'row', 'merge', 'table', 'cell', 'wrap', 'copy', 'delete'],
          },
          keyboard: {
            bindings: window.QuillTableBetter.keyboardBindings
          }
        }
      };

      const editor = new window.Quill(`#${EDITOR_ID}`, options);
      quillRef.current = editor;

      // Set initial content if provided
      if (value) {
        editor.root.innerHTML = value;
      }

     // 🔥 Only update on focus out
     editor.root.addEventListener('blur', () => {
      if (onChange) {
        console.log('blur editor.root.innerHTML', editor.root.innerHTML)
        onChange(editor.root.innerHTML);
      }
    });


    }

    // Cleanup function
    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, [value, onChange]);

  return (
    <div className="quill-editor-container">
      <div id={EDITOR_ID} className="quill-editor"></div>
    </div>
  );
}

export default QuillEditor; 