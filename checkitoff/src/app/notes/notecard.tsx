import React from 'react';

interface NoteCardProps {
    id: string;
    onClick: (id: string, title: string, content: string) => void;
    content: string;
    title: string; 
    onDelete: (title: string) => void;
}

function NoteCard({ id, onClick, title, content, onDelete}: NoteCardProps) {
    const handleClick = () => {
        onClick(id, title, content);
      };

      const handleDelete = () => {
        onDelete(title);
    };
    return (
        <div className="">
            <div className="bg-dark rounded-xl border-2 border-cardborder h-72 bs relative group">
                <div onClick={handleClick} className='p-3 min-h-full'>
                    <p className="font-bold select-none">{title}</p>
                    <div className="py-1 pt-2 text-sm md:text-base">
                        <p className='select-none'>{content}</p>
                    </div>
                </div>
                {/* <div className='hover:bg-lessDark hover:cursor-pointer absolute top-2 right-2 text-end hidden group-hover:flex w-10 h-10 rounded-full justify-center items-center'>
                    <i className="fa-solid text-md fa-thumbtack item-hover:text-orange"></i>
                </div> */}
                <div className='bg-lessDark absolute bottom-0 text-end min-w-full hidden group-hover:block rounded-b-lg'>
                    <div className='p-2 px-3 text-center'>
                        <i onClick={handleDelete} className="fa-solid text-md fa-trash hover:text-orange cursor-pointer"></i>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NoteCard;