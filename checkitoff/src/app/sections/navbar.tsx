import Me from '../../assets/me.jpeg'
import Favicon from '../favicon.ico'
import Image from 'next/image'

import { useEffect, useState } from 'react';

import NavbarDropdown from '../functions/navdropdown'

interface NavbarProps {
    refresh?: () => void;
  }

  const useCurrentPathname = () => {
    const [pathname, setPathname] = useState('');
  
    useEffect(() => {
      const handleRouteChange = () => {
        setPathname(window.location.pathname);
      };
  
      // Set initial pathname
      handleRouteChange();
  
      // Listen for route changes
      window.addEventListener('popstate', handleRouteChange);
      window.addEventListener('pushState', handleRouteChange);
      window.addEventListener('replaceState', handleRouteChange);
  
      return () => {
        window.removeEventListener('popstate', handleRouteChange);
        window.removeEventListener('pushState', handleRouteChange);
        window.removeEventListener('replaceState', handleRouteChange);
      };
    }, []);
  
    return pathname;
  };

const Navbar: React.FC<NavbarProps> = ({ refresh }) => {

    const pathname = useCurrentPathname();
    const showRefreshButton = pathname === '/';

    const [isRotating, setIsRotating] = useState(false);
    const handleRefresh = () => {
        if (refresh) {  
          setIsRotating(true);
          refresh();
          setTimeout(() => {
            setIsRotating(false);
          }, 1500);
        }
      };

    return(
        <div>
            <div className="flex justify-between items-center pt-3 pb-3 md:w-[94%] w-[90%] m-auto">
                <div className=''>
                    <a href='/' className='flex gap-3 items-center'>
                        <Image src={Favicon} alt='' width={30} className='rounded-xl'/>
                        <p className="md:text-3xl text-2xl font-bold hidden md:block">check<span className="text-orange">it</span>off.</p>
                        <p className="sm:text-xl text-sm font-bold md:hidden">check<span className="text-orange">it</span><span className=''>off.</span></p>
                    </a>
                </div>
                <div className='md:flex hidden gap-5 items-center '>
                    <div>
                        <p>creator:</p>
                    </div>
                    
                    <div className='flex items-center gap-3 py-1'>
                        <div className=''>
                            <Image src={Me} alt='creator' width={50} className='rounded-full border-2 border-orange'/>
                        </div>
                        
                        <div>
                            <a href='https://portfolio-eta-ten-43.vercel.app/' className='text-lg font-semibold hover:text-orange hover:cursor-pointer'>abdul <br/> <span>wahab<span className='text-orange'>.</span></span></a>
                        </div>
                    </div>
                </div>
                <div className='flex gap-2 md:gap-3 items-center'>
                    <div className='w-4'>
                        
                    </div>
                    
                    <a href='/' className="flex items-center justify-center p-2 hover:cursor-pointer hover:bg-gray-700 rounded-lg">
                        <i className="text-sm fa-solid fa-home"></i>
                    </a>

                    
                    {showRefreshButton && (
                    <div onClick={handleRefresh} className='flex items-center justify-center p-2 hover:cursor-pointer hover:bg-gray-700 rounded-lg'>
                        <i className={`fa-solid fa-arrows-rotate ${isRotating ? 'rotate' : ''}`}></i>
                    </div>
                    )}
                    
                    <NavbarDropdown/>
                    
                </div>
            </div>
            <hr/>
        </div>
    )
}

export default Navbar; 