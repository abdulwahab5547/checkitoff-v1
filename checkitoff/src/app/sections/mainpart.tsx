import Navbar from './navbar'
import Today from './today'
import Upcoming from './upcoming'
import Imp from './imp'
import Weekly from './weekly'
import React, { useRef, useState} from 'react';
import Image from 'next/image'
import Me from '../../assets/me.jpeg'
import LongTermGoals from './longtermgoals'


function MainPart(){
    const todayRef = useRef<{ refreshToday: () => void }>(null);
    const upcomingRef = useRef<{ refreshUpcoming: () => void }>(null);
    const impRef = useRef<{ refreshImp: () => void }>(null);
    const weeklyRef = useRef<{ refreshWeekly: () => void }>(null);
    const goalsRef = useRef<{ refreshGoals: () => void }>(null);

    const [isFocusMode, setIsFocusMode] = useState<boolean>(() => {
        const savedFocusMode = localStorage.getItem('focusMode');
        return savedFocusMode !== null ? JSON.parse(savedFocusMode) : true;
      });
      
      const toggleFocusMode = () => {
        setIsFocusMode(prevMode => {
          const newMode = !prevMode;
          localStorage.setItem('focusMode', JSON.stringify(newMode));
          return newMode;
        });
      };
      
      const [showGoals, setShowGoals] = useState<boolean>(() => {
        const savedShowGoals = localStorage.getItem('showGoals');
        return savedShowGoals !== null ? JSON.parse(savedShowGoals) : true;
      });
      
      const toggleShowGoals = () => {
        setShowGoals(prevMode => {
          const newMode = !prevMode;
          localStorage.setItem('showGoals', JSON.stringify(newMode));
          return newMode;
        });
      };
  
    const refresh = () => {
      if (todayRef.current) todayRef.current.refreshToday();
      if (upcomingRef.current) upcomingRef.current.refreshUpcoming();
      if (impRef.current) impRef.current.refreshImp();
      if (weeklyRef.current) weeklyRef.current.refreshWeekly();
      if (goalsRef.current) goalsRef.current.refreshGoals();
    };
    return(
        <div className="">
            <Navbar refresh={refresh} isFocusMode={isFocusMode} toggleFocusMode={toggleFocusMode} showGoals={showGoals} toggleShowGoals={toggleShowGoals}/>
            
            <div className='w-[96%] m-auto pt-12 md:pt-16'>
                <div className={`flex ${isFocusMode ? 'justify-start items-start flex-col md:flex-row' : 'justify-center'}`}>
                    <Today ref={todayRef} isFocusMode={isFocusMode}/>
                    <Imp ref={impRef} />
                </div>
                
                <div className={` ${isFocusMode ? 'flex justify-start items-start flex-col md:flex-row md:pt-10' : 'hidden'}`}>
                    <Upcoming ref={upcomingRef} />
                    <Weekly ref={weeklyRef}/>
                </div>

                <div className={`flex justify-center items-center md:pt-10`}>
                    <LongTermGoals ref={goalsRef} showGoals={showGoals}/>
                </div>
            </div>

            <div className='md:hidden flex gap-5 items-center fixed bottom-3 right-3'>
                <div className='flex items-center gap-3 py-1'>
                    <div>
                    <Image src={Me} alt='creator' width={40} className='rounded-full border-2 border-orange'/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainPart;