import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

interface NoteViewProps {
  isOpen: boolean;
  title: string;
  content: string;
  onClose: () => void;
  fetchNotes: () => void;
}

function NoteView({ isOpen, title, content, onClose, fetchNotes }: NoteViewProps) {
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    setEditedTitle(title);
    setEditedContent(content);
  }, [title, content]);

  const handleUpdateNote = async () => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notes/${title}`,
        {
          title: editedTitle,
          content: editedContent,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        console.log('Note successfully updated:', editedTitle, editedContent);
        fetchNotes();
        // onClose();  
      } else {
        console.error('Unexpected response from server:', response);
      }
    } catch (error) {
      console.error('Error updating the note:', error);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div
        className="bg-lessDark rounded-lg p-5 max-w-md w-[90%] md:w-full mx-4 border-2 border-cardborder"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-black text-lg"
          onClick={onClose}
        >
          &times;
        </button>


        <div>
          <div>
            <input
              type="text"
              id="title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              required
              className="text-xl font-bold mb-4 bg-inherit w-full focus:outline-none"
            />
          </div>

          <div className='h-64 max-h-96'>
            <textarea
              id="content"
              ref={textareaRef}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              required
              placeholder="add note..."
              className='bg-inherit w-full h-full resize-none focus:outline-none'
            />
          </div>

          <div>
            <button
              onClick={handleUpdateNote}
              className="bg-dark border-2 border-cardborder py-2 px-3 rounded-xl mt-4"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteView;