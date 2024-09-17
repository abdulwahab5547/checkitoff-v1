'use client'

import { useRouter } from 'next/navigation';
import {useState} from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FormEvent, ChangeEvent } from 'react';
import Image from 'next/image'
import Below from '../../assets/text-below.svg';

function Register(){
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/signup', formData);
            toast.success('Account created!');
            console.log('User created:', response.data);
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error) {
            toast.error('Error creating account');
            console.error('Error creating user:', error);
        }
    };

    return(
        <div className="w-[95%] m-auto pt-20">
            <div className="w-64 md:w-96 m-auto">
                <div className="pb-5 flex justify-center">
                    <div>
                        <p className='text-xl md:text-2xl font-bold text-center'>register<span className='text-orange'>.</span></p>
                        <Image src={Below} alt="" width={100} className='pl-3'/>
                    </div>
                </div>
                <div className="bg-taskcard py-5 md:py-10 md:px-8 px-3 rounded-xl bs">
                    <form onSubmit={handleSubmit}>
                        <div className="py-2">
                            <input 
                              type='text' 
                              placeholder="enter username" 
                              name="username"
                              value={formData.username}
                              onChange={handleChange}
                              className="py-2 w-full focus:ring-1 focus:ring-orange focus:outline-none rounded-xl bg-dark px-3" 
                            />
                        </div>
                        
                        <div className="py-2">
                            <input 
                              type='password' 
                              placeholder="enter password" 
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              className="py-2 w-full focus:ring-1 focus:ring-orange focus:outline-none rounded-xl bg-dark px-3" 
                            />
                        </div>
                        
                        <div className="pt-6 text-center">
                            <button 
                              type="submit" 
                              className="bg-orange hover:opacity-90 px-4 py-2 rounded-full">
                              create account
                              <span className='pl-2'><i className="text-sm fa-solid fa-arrow-right"></i></span>
                            </button>
                        </div>
                    </form>
                </div>
                <div className='px-3 text-center pt-5'>
                    <p className='text-sm'>registered already? <a href='/login' className='text-orange hover:underline'>log in</a></p>
                </div>
            </div>
        </div>
    )
}

export default Register;
