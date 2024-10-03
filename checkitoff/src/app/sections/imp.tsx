import Below from '../../assets/text-below.svg'
import Image from 'next/image'
import { useImperativeHandle, forwardRef, useState, useEffect, useRef, useCallback} from 'react';
import axios from 'axios';
import TaskCard from './taskcard'
import { debounce } from 'lodash';
import TaskCardSkeleton from './taskskeleton'

interface Task {
    text: string;
    completed: boolean;
}

const Imp = forwardRef((_, ref) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const taskRefs = useRef<(HTMLInputElement | null)[]>([]);
      const fetchTasks = async () => {
        setIsFetching(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/imp-tasks`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            setIsFetching(false);
            setTasks(response.data.tasks); 
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };
    useEffect(() => {
        fetchTasks();
    }, []);

    const refreshImp = () => {
        fetchTasks();
      };
    
    const addTask = (index?: number) => {
        const newTask = { text: '', completed: false };
    
        let updatedTasks;
        if (index === undefined) {
            updatedTasks = [...tasks, newTask];
        } else {
            updatedTasks = [...tasks.slice(0, index + 1), newTask, ...tasks.slice(index + 1)];
        }
    
        setTasks(updatedTasks);
        setTimeout(() => {
            if (taskRefs.current[updatedTasks.length - 1]) {
                taskRefs.current[updatedTasks.length - 1]?.focus();
            }
        }, 0);
    };
    

    const updateTask = async (index: number, newText: string, completed: boolean) => {
        const updatedTasks = tasks.map((task, i) => {
            if (i === index) {
                return { ...task, text: newText, completed }; 
            }
            return task;
        });
        setTasks(updatedTasks);
        updateTaskDebounced(updatedTasks);
    };    

    const deleteTask = async (index: number) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
        updateTaskDebounced(updatedTasks);
    };

    const updateTaskDebounced = useCallback(
        debounce(async (updatedTasks: Task[]): Promise<void> => {
            setIsLoading(true);
            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/imp-tasks`,
                    { tasks: updatedTasks },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`
                        }
                    }
                );
                console.log('Tasks saved:', response.data.tasks);
                setIsLoading(false);
            } catch (error) {
                console.error('Error saving tasks:', error);
            }
        }, 1000),
        []
    );

    const [showSaved, setShowSaved] = useState(false);
    useEffect(() => {
        if (isLoading) {
            setShowSaved(false);
        } else {
            setShowSaved(true);
            const timer = setTimeout(() => {
                setShowSaved(false);
            }, 5000); 

            return () => clearTimeout(timer); 
        }
    }, [isLoading]);

    const focusPreviousTask = (index: number) => {
        if (index > 0 && taskRefs.current[index - 1]) {
            taskRefs.current[index + 1]?.focus();
        }
    };

    const focusNextTask = (index: number) => {
        if (index < tasks.length - 1) {
            const nextIndex = index + 1;
            if (taskRefs.current[nextIndex]) {
                taskRefs.current[nextIndex]?.focus();
            }
        }
    };

    useImperativeHandle(ref, () => ({
        refreshImp,
      }));

    return(
        <div className='flex w-[100%] md:w-[50%] pb-10'>
            <div className='w-[93%] md:w-[80%] m-auto'>
                <div className='flex justify-between items-center pr-3'>
                    <div>
                        <p className='text-xl md:text-2xl font-bold'>imp<span className='text-orange'>.</span></p>
                        <Image src={Below} alt="" width={70}/>
                    </div>
                    <div>
                        {isLoading ? (
                            <p className='text-sm'>Saving...</p>
                        ) : showSaved ? (
                            <p className='text-sm'>Saved</p>
                        ) : null}
                    </div>
                </div>
                
                <div className='mt-8'>
                {isFetching ? (
                    <>
                        <TaskCardSkeleton />
                        <TaskCardSkeleton />
                        <TaskCardSkeleton />
                    </>
                ) : (
                    <div >
                        {tasks.map((task, index) => (
                            <div key={index}>
                                <TaskCard 
                                text={task.text}
                                completed={task.completed}
                                index={index}
                                onUpdateTask={(newText, completed) => updateTask(index, newText, completed)}
                                onDeleteTask={() => deleteTask(index)}
                                onAddTask={addTask}
                                onFocusPrevious={() => focusPreviousTask(index)}
                                onFocusNext={() => focusNextTask(index)}
                                />
                            </div>
                        ))}

                        <div onClick={() => addTask()} className='flex gap-4 items-center py-3 px-3 hover:bg-taskcard w-fit rounded-xl hover:cursor-pointer group'>
                            <div className='flex justify-center items-center rounded-full w-[25px] h-[25px] group-hover:bg-orange'> 
                                <i className="fa-solid fa-plus"></i>
                            </div>
                            <p className='group-hover:text-orange'>Add task</p>
                        </div>
                    </div>
                    )}
                </div>
                
            </div>
        </div>
    )
});

Imp.displayName = "Important";

export default Imp; 