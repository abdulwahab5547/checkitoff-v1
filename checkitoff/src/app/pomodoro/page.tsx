"use client"

import { useState, useEffect } from "react";
import Navbar from "../sections/navbar";
import Below from "../../assets/text-below.svg";
import Image from "next/image";
import Dropdown from '../functions/dropdown';

function Pomodoro() {
    const [timeLeft, setTimeLeft] = useState(25 * 60); 
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isRunning && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false); 
        }
        return () => clearInterval(timer);
    }, [isRunning, timeLeft]);

    useEffect(() => {
        document.title = `${formatTime(timeLeft)} - pomodoro timer`;
        return () => {
            document.title = "pomodoro timer"; 
        };
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleStartStop = () => {
        setIsRunning((prevIsRunning) => !prevIsRunning); 
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(25 * 60); 
    };

    const handleTimeSelect = (timeInSeconds: number) => {
        setTimeLeft(timeInSeconds);
        setIsRunning(false); 
    };

    return (
        <div>
            <Navbar isFocusMode={false} toggleFocusMode={function (): void {
                throw new Error("Function not implemented.");
            } } showGoals={false} toggleShowGoals={function (): void {
                throw new Error("Function not implemented.");
            } } />
            <div className="w-[90%] m-auto pt-10 md:pt-20">
                <div className="flex flex-col items-center">
                    <p className="text-xl md:text-2xl font-bold">
                        pomodoro timer<span className="text-orange">.</span>
                    </p>
                    <Image src={Below} alt="" width={130} />
                </div>
                <div className="bg-lessDark w-64 sm:w-96 md:w-96 m-auto mt-10 rounded-2xl bs text-center px-2 md:px-5 py-7 md:py-10">
                    <div>
                        <p className="text-4xl md:text-7xl font-semibold">{formatTime(timeLeft)}</p>
                    </div>
                    <div className="pt-10">
                        <button
                            className="bg-orange text-white px-3 md:px-5 py-1 md:py-2 text-lg md:text-xl font-bold rounded mr-2 hover:bg-opacity-85"
                            onClick={handleStartStop}
                        >
                            {isRunning ? "Stop" : "Start"}
                        </button>
                        <button
                            className="bg-gray-500 text-white px-3 md:px-5 py-1 md:py-2 text-lg md:text-xl font-bold rounded ml-2 hover:bg-opacity-85"
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                    </div>
                    <div className="">
                        <Dropdown onTimeSelect={handleTimeSelect} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pomodoro;
