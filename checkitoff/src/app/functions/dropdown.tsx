import { useState, useEffect, useRef } from "react";

interface TimeOption {
  label: string;
  value: number; 
}

interface DropdownProps {
  onTimeSelect: (time: number) => void; 
}

function Dropdown({ onTimeSelect }: DropdownProps) {
  const [selectedTime, setSelectedTime] = useState<string>("Select Time");
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const times: TimeOption[] = [
    { label: "15 minutes", value: 15 * 60 },
    { label: "25 minutes", value: 25 * 60 },
    { label: "30 minutes", value: 30 * 60 },
    { label: "45 minutes", value: 45 * 60 },
    { label: "60 minutes", value: 60 * 60 },
  ];

  const handleSelect = (time: TimeOption) => {
    setSelectedTime(time.label);
    onTimeSelect(time.value); 
    setDropdownOpen(false);
  };

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

  return (
    <div className="w-[130px] md:w-[200px] m-auto mt-10" ref={dropdownRef}>
      <div className="relative">
        <button
          className="bg-dark rounded-xl border-2 border-cardborder w-full text-left py-2 px-4 shadow-md"
          onClick={toggleDropdown}
        >
          {selectedTime}
        </button>
        {dropdownOpen && (
          <ul className="absolute w-full bg-dark rounded-xl border-2 border-cardborder shadow-md mt-2 max-h-60 overflow-y-auto">
            {times.map((time) => (
              <li
                key={time.label}
                className="cursor-pointer py-2 px-4 hover:bg-lessDark"
                onClick={() => handleSelect(time)}
              >
                {time.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dropdown;
