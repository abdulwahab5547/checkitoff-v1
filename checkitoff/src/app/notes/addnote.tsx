import React, { useEffect, FormEvent, useRef} from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface AddNoteProps {
  isOpen: boolean;
  title: string;
  content: string;
  setTitle: (value: string) => void;
  setContent: (value: string) => void;
  onClose: () => void;
  fetchNotes: () => void;
}


interface Note {
    title: string;
    content: string;
}

function AddNote({ isOpen, content, title, onClose, setTitle, setContent, fetchNotes }: AddNoteProps) {
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
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          const maxHeight = window.innerHeight * 0.7;
          textareaRef.current.style.maxHeight = `${maxHeight}px`;
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
          textareaRef.current.style.overflowY = textareaRef.current.scrollHeight > maxHeight ? 'auto' : 'hidden';
        }
      }, [content]);

      const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
      
        const note: Note = {
          title,
          content
        };
      
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/notes`, 
            { notes: [note] },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
              }
            }
          );
          console.log('Note saved:', response.data.notes);
          setTitle('');
          setContent('');
          fetchNotes();
          onClose();
          toast.success("Note added");
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error('Error saving note:', error.message);
            toast.error(`Error adding note: ${error.message}`);
          } else {
            console.error('Unexpected error:', error);
            toast.error('Unexpected error occurred');
          }
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
                        <form onSubmit={handleSubmit} className='text-white'>
                            <div>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder='add note title...'
                                className='text-xl font-bold mb-4 bg-inherit w-full focus:outline-none'
                            />
                            </div>
                            <div>
                            <textarea
                                id="content"
                                ref={textareaRef}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                placeholder='add note...'
                                className='bg-inherit w-full resize-none focus:outline-none'
                            />
                            </div>
                            <div className='text-center pt-5'>
                                <button
                                    className="bg-orange text-white px-2 py-1 font-bold rounded hover:bg-opacity-85"
                                    type="submit"
                                    >
                                    add note
                                </button>
                            </div>
                            
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddNote;