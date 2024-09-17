function Dropdown(){
    <div className="w-[200px] m-auto mt-10">
      <div className="relative">
        <button className="bg-gray-200 w-full text-left py-2 px-4 rounded shadow-md">
          {selectedTime}
        </button>
        <ul className="absolute w-full bg-white shadow-md rounded mt-2 max-h-60 overflow-y-auto">
          {times.map((time) => (
            <li
              key={time}
              className="cursor-pointer py-2 px-4 hover:bg-gray-100"
              onClick={() => handleSelect(time)}
            >
              {time}
            </li>
          ))}
        </ul>
      </div>
      {/* Display the selected time */}
      {selectedTime !== "Select Time" && (
        <div className="mt-4">
          <p className="text-center">Selected time: {selectedTime}</p>
        </div>
      )}
    </div>
}