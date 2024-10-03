import { useState, useEffect, useRef } from "react";

import { useAuth } from '../functions/auth-context';
import Modal from '../functions/modal';

interface NavDropdownProps {
  isFocusMode: boolean;
  toggleFocusMode: () => void;

  showGoals: boolean;
  toggleShowGoals: () => void;
}

const NavbarDropdown: React.FC<NavDropdownProps> = ({ isFocusMode, toggleFocusMode, showGoals, toggleShowGoals }) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { logout } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogout = () => {
        setIsModalOpen(true);
    };

    const handleConfirmLogout = () => {
        setIsModalOpen(false);
        logout();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="focus:outline-none flex items-center justify-center p-2 hover:bg-gray-700 rounded-lg hover:cursor-pointer"
        onClick={toggleDropdown}
      >
        <i className="text-sm fa-solid fa-bars"></i>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-lessDark rounded-lg bs p-4">
          <div className="grid grid-cols-2 gap-4">
            <a href='/pomodoro' className="flex items-center justify-center p-2 hover:bg-gray-700 rounded-lg">
                <i className="text-sm fa-solid fa-clock hover:cursor-pointer"></i>
            </a>
            <a href='/settings' className="flex items-center justify-center p-2 hover:bg-gray-700 rounded-lg">
                <p ><i className="text-sm fa-solid fa-gear hover:cursor-pointer"></i></p>
            </a>
            <a href='/notes' className="flex items-center justify-center p-2 hover:bg-gray-700 rounded-lg">
                <p><i className="text-sm fa-solid fa-note-sticky hover:cursor-pointer"></i></p>
            </a>
          </div>

          <div onClick={toggleFocusMode} className="text-center p-2 mt-3 hover:bg-gray-700 rounded-lg">
            <p className="m-auto hover:cursor-pointer flex justify-between"><span className='pr-1'>focus</span><span className='md:pl-2'><i className={`fa-solid ${isFocusMode ? 'fa-toggle-off' : 'fa-toggle-on'}`}></i></span></p>
          </div>

          <div onClick={toggleShowGoals} className="text-center p-2 mt-3 hover:bg-gray-700 rounded-lg">
            <p className="m-auto hover:cursor-pointer flex justify-between"><span className='pr-1'>goals</span><span className='md:pl-2'><i className={`fa-solid ${showGoals ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i></span></p>
          </div>

          <div onClick={handleLogout} className="text-center p-2 mt-3 hover:bg-gray-700 rounded-lg">
            <p className="m-auto hover:cursor-pointer flex justify-between"><span className='pr-1'>logout</span><span className='md:pl-2'><i className="text-sm fa-solid fa-right-from-bracket"></i></span></p>
          </div>
        </div>
      )}
      <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onConfirm={handleConfirmLogout}
        />
    </div>
  );
}

export default NavbarDropdown;