import { useRef, useEffect } from 'react';
import './QuillEditor.css';


function QuillEditor({ value='', editorId = 'quill-editor' }) {
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
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        [{ 'align': [] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        ['formula'],

        // [{ 'script': 'sub'}, { 'script': 'super' }],
        // [{ 'indent': '-1'}, { 'indent': '+1' }],
        // [{ 'direction': 'rtl' }],
        // [{ 'size': ['small', false, 'large', 'huge'] }],
        // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        // [{ 'color': [] }, { 'background': [] }],
        // [{ 'font': [] }],
        // [{ 'align': [] }],
        // ['clean'],
        ['table-better'],
        ['clean'],

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

      const editor = new window.Quill(`#${editorId}`, options);
      quillRef.current = editor;

      // Set initial content if provided
      if (value) {
        editor.root.innerHTML = value;
      }
    }

    // Cleanup function
    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, [value]);

  return (
    <div className="quill-editor-container">
      <div id={editorId} className="quill-editor"></div>
    </div>
  );
}

export default QuillEditor; 