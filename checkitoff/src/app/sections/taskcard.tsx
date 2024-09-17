import { useState, useEffect, useRef } from 'react';

interface TaskCardProps {
    text: string;
    completed: boolean;
    index: number;
    onUpdateTask: (newText: string, completed: boolean) => void; 
    onDeleteTask: () => void;
    onAddTask: (index: number) => void;
    onFocusPrevious: () => void;
    onFocusNext: () => void;
}


const TaskCard: React.FC<TaskCardProps> = ({ text, completed, index, onUpdateTask, onDeleteTask, onAddTask, onFocusPrevious, onFocusNext }) => {
    const [editableText, setEditableText] = useState(text);
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        setEditableText(text);
    }, [text]);
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newText = e.target.value;
        setEditableText(newText);
        onUpdateTask(newText, completed); 
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && editableText === '') {
            e.preventDefault();
            onDeleteTask();
            onFocusPrevious(); 
        }
        if (e.key === 'Enter') {
            e.preventDefault(); 
            onAddTask(index);
            onFocusNext();
        }
    };
    const toggleCompleted = () => {
        onUpdateTask(editableText, !completed); 
    };
    return(
        <div className='bg-taskcard py-2 md:py-3 px-2 my-2 rounded-xl border-2 border-cardborder min-h-[35px] md:min-h-[50px]'> 
            <div>
                <div className="flex items-center">
                    <div onClick={toggleCompleted} className={`border rounded-full mx-1 group cursor-pointer min-w-[25px] h-[25px] text-center ${completed ? 'bg-orange border-0' : ''}`}>
                        <i className={`fa-solid text-xs fa-check transition-opacity duration-300 ${completed ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></i>
                    </div>
                    <div className='w-full'>
                        <input
                            ref={inputRef}
                            type="text"
                            value={editableText}
                            placeholder="add task..."
                            onChange={handleTextChange}
                            onKeyDown={handleKeyDown}
                            className={`px-3 w-full text-sm md:text-base bg-transparent focus:outline-none ${completed ? 'line-through' : ''}`}
                        />
                    </div>
                    <div onClick={onDeleteTask} className="px-2 group hover:cursor-pointer rounded-full">
                        <i 
                            className="fa-solid text-md fa-trash group-hover:text-orange transition-colors duration-300"
                        ></i>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default TaskCard;