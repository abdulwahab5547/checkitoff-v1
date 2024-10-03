import React from 'react';

const TaskCardSkeleton: React.FC = () => {
    return (
        <div className='bg-taskcard py-2 md:py-3 px-2 my-2 rounded-xl border-2 border-cardborder min-h-[35px] md:min-h-[50px] animate-pulse'> 
            <div className="flex items-center">
                <div className="rounded-full mx-1 min-w-[25px] h-[25px] bg-gray-300 mr-2"></div>
                <div className='w-full'>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
                <div className="px-2 rounded-full">
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                </div>
            </div>
        </div>
    )
}

export default TaskCardSkeleton;