import Navbar from './navbar'
import Today from './today'
import Upcoming from './upcoming'
import React, { useRef } from 'react';
import Image from 'next/image'
import Me from '../../assets/me.jpeg'

function MainPart(){
    const todayRef = useRef<{ refreshToday: () => void }>(null);
    const upcomingRef = useRef<{ refreshUpcoming: () => void }>(null);
  
    const refresh = () => {
      if (todayRef.current) todayRef.current.refreshToday();
      if (upcomingRef.current) upcomingRef.current.refreshUpcoming();
    };
    return(
        <div className="">
            <Navbar refresh={refresh}/>
            
            <div className='w-[96%] m-auto pt-12 md:pt-24'>
                <div className='flex justify-between items-start flex-col md:flex-row'>
                    <Today ref={todayRef} />
                    <Upcoming ref={upcomingRef} />
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