"use client"

import Navbar from '../sections/navbar'
import Below from '../../assets/text-below.svg'
import toast from 'react-hot-toast';
import Image from 'next/image'
import { useState, useEffect, ChangeEvent, FormEvent } from 'react'

interface FormData {
    username: string;
    password: string;
}

function Settings() {
    const [formData, setFormData] = useState<FormData>({ username: '', password: '' });

    useEffect(() => {
        const fetchAccountSettings = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/account-settings', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Assuming token is stored in localStorage
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch account settings');
                }

                const data = await response.json();
                setFormData({ username: data.username, password: data.password }); 

            } catch (err) {
                console.log('Error fetching account settings.');
            }
        };

        fetchAccountSettings();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/api/account-settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update account settings');
            }

            toast.success("Account details updated");
        } catch (err) {
            console.log('Error updating account settings.');
            toast.error("Error updating account settings");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="w-[95%] m-auto pt-20">
                <div className="w-64 md:w-96 m-auto">
                    <div className="pb-5 flex justify-center">
                        <div>
                            <p className='text-xl md:text-2xl font-bold text-center'>
                                account settings<span className='text-orange'>.</span>
                            </p>
                            <Image src={Below} alt="" width={100} className='pl-3' />
                        </div>
                    </div>

                    <div className="bg-taskcard py-5 md:py-10 md:px-8 px-3 rounded-xl bs">
                        <form onSubmit={handleSubmit}>
                            <div className="py-2">
                                <input
                                    type='text'
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Enter username"
                                    className="py-2 w-full focus:ring-1 focus:ring-orange focus:outline-none rounded-xl bg-dark px-3"
                                />
                            </div>

                            <div className="py-2">
                                <input
                                    type='password'
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                    className="py-2 w-full focus:ring-1 focus:ring-orange focus:outline-none rounded-xl bg-dark px-3"
                                />
                            </div>

                            <div className="pt-6 text-center">
                                <button
                                    type="submit"
                                    className="bg-orange hover:opacity-90 px-4 py-2 rounded-full"
                                >
                                    save details
                                    <span className='pl-2'><i className="text-sm fa-solid fa-arrow-right"></i></span>
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className='px-3 text-center pt-5'>
                        <p className='text-sm'>
                            <a href='/' className='text-orange hover:underline'>go to home</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings;