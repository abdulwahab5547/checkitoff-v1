"use client"

import {useState, useEffect, FormEvent} from 'react';
import axios from 'axios';
import Navbar from "../sections/navbar";
import Below from "../../assets/text-below.svg";
import Image from "next/image";
import NoteCard from './notecard'
import NoteView from './noteview'
import AddNote from './addnote';
import toast from 'react-hot-toast';

interface Note {
    id: string;
    title: string;
    content: string;
}

function Notes(){
    const [selectedContent, setSelectedContent] = useState<string | null>(null);
    const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
    const [isNoteViewOpen, setIsNoteViewOpen] = useState<boolean>(false);
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

    const handleNoteCardClick = (id: string, title: string, content: string) => {
        setSelectedNoteId(id);
        setSelectedContent(content);
        setSelectedTitle(title);
        setIsNoteViewOpen(true);
    };

    const handleCloseNoteView = () => {
        setIsNoteViewOpen(false);
        setSelectedContent(null);
        setSelectedTitle(null);
    };

    const [isAddNoteOpen, setIsAddNoteOpen] = useState<boolean>(false); 

    const handleOpenAddNote = () => {
        setIsAddNoteOpen(true);
    };

    const handleCloseAddNote = () => {
        setIsAddNoteOpen(false);
    };

    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const fetchNotes = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get('http://localhost:8000/api/notes', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            setNotes(response.data.notes); 
            console.log(response.data.notes);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
        finally{
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleDeleteNote = async (title: string) => {
        try {
            await axios.delete(`http://localhost:8000/api/notes/${title}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            fetchNotes();
            toast.success("Note deleted");
        } catch (error) {
            console.error('Error deleting note:', error);
            toast.success("Error deleting note");
        }
    };

    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>(''); 


    return(
        <div>
            <Navbar/>
            <div className="md:pt-12 pt-8 w-[95%] md:w-[88%] m-auto">

                <div className="flex flex-col items-center">
                    <p className="text-xl md:text-2xl font-bold">
                        notes<span className="text-orange">.</span>
                    </p>
                    <Image src={Below} alt="" width={70} />
                </div>

                <div className='flex justify-center pt-8'>
                    <div onClick={handleOpenAddNote} className='bg-dark hover:cursor-pointer py-2 rounded-xl border-2 border-cardborder hover:border-orange text-center w-40'>
                        <p className='select-none'>new note<span className='pl-2'><i className="text-sm fa-solid fa-plus"></i></span></p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center text-base font-bold pt-8 md:pt-10">Loading...</div>
                ) : (
                    <div className='pt-8 md:pt-10'>
                        <div className="flex flex-wrap">
                            {[...notes].reverse().map((note, index) => (
                            <div key={index} className="w-1/2 sm:w-1/2 md:w-1/4 lg:w-1/5 px-1 sm:px-2 py-1 sm:py-2">
                                <NoteCard 
                                id={note.id}
                                onClick={() => handleNoteCardClick(note.id, note.title, note.content)}
                                title={note.title}
                                content={note.content}
                                onDelete={handleDeleteNote}
                                />
                            </div>
                            ))}
                        </div>
                    </div>
                )}

                <NoteView
                    isOpen={isNoteViewOpen}
                    title={selectedTitle || ''}
                    content={selectedContent || ''}
                    onClose={handleCloseNoteView}
                    fetchNotes={fetchNotes}
                />
                <AddNote
                    isOpen={isAddNoteOpen}  
                    setTitle={setTitle}
                    setContent={setContent}
                    title={title}
                    content={content}
                    onClose={handleCloseAddNote}  
                    fetchNotes={fetchNotes}
                />
            </div>
        </div>
    )
}

export default Notes; 