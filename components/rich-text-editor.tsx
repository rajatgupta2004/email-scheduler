"use client";

import { HtmlEditor, Inject, RichTextEditorComponent, Toolbar } from '@syncfusion/ej2-react-richtexteditor';
import { useRef, useState, useEffect } from 'react';
import { registerLicense } from '@syncfusion/ej2-base';
import { Save } from 'lucide-react';

registerLicense('Ngo9BigBOggjHTQxAR8/V1JEaF5cXmRCeUx0TXxbf1x1ZFJMYl1bRnJPMyBoS35Rc0VlW3ded3ZURGdfVkRyVEFd');

function RichTextEditor() {
  const rteObj = useRef<RichTextEditorComponent>(null);
  const [btnMessage, setBtnMessage] = useState<string>('Save');
  const [initialContent, setInitialContent] = useState<string>(''); // 👈 safe initial value

  useEffect(() => {
    // Access localStorage only on the client
    const savedContent = localStorage.getItem('editorContent') || '';
    setInitialContent(savedContent);
  }, []);

  const toolbarSettings: object = {
    items: [
      'Bold', 'Italic', 'Underline', 'StrikeThrough',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
      'LowerCase', 'UpperCase', '|',
      'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
      'Outdent', 'Indent', '|',
      'CreateLink', '|', 'ClearFormat', 'Print',
      'SourceCode', 'FullScreen', '|', 'Undo', 'Redo'
    ]
  };

  const handleGetContent = async () => {
    if (rteObj.current) {
      setBtnMessage('Saving...');
      const content = rteObj.current.value;
      localStorage.setItem('editorContent', content || '');
      setTimeout(() => setBtnMessage('Save'), 500);
    }
  };

  return (
    <div>
      <button 
        onClick={handleGetContent}
        className='bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition duration-200 mb-2'
      >
        <Save className="inline mr-2" />
        {btnMessage}
      </button>

      <RichTextEditorComponent 
        ref={rteObj}
        height={450} 
        value={initialContent} // ✅ now it's safe
        toolbarSettings={toolbarSettings}
      >
        <Inject services={[Toolbar, HtmlEditor]} />
      </RichTextEditorComponent>
    </div>
  );
}

export default RichTextEditor;
