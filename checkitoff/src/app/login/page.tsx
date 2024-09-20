'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FormEvent, ChangeEvent } from 'react';
import Image from 'next/image'
import Below from '../../assets/text-below.svg'
import Me from '../../assets/me.jpeg'
import Favicon from '../favicon.ico'
import { useAuth } from '../functions/auth-context';

function Login(){
    const router = useRouter();
    const { login } = useAuth();
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
    const handleSubmit  = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, formData);
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                login();
                toast.success("Logged in successfuly");
                setTimeout(() => {
                    router.push('/');
                }, 2000);
                console.log('Logged in:', response.data);
            } else {
                throw new Error('Token not received from server');
            }
        } catch (error) {
            toast.error('Error logging in');
            console.error('Error logging in:', error);
        }
    };

    return(
        <div className="w-[95%] m-auto pt-10 md:pt-20">

        <div className='text-center relative'>
            <div className="text-wrapper absolute -top-6 overflow-hidden whitespace-nowrap w-full hidden lg:flex items-center">
                <span className="flowing-text select-none uppercase text-9xl opacity-5 font-extrabold ">
                    check it off. check it off. check it off. check it off. check it off.
                </span>
            </div>
        </div>
        
        <div className='flex justify-between items-center flex-col md:flex-row md:px-16'>

            <div className='w-[100%] md:w-[40%] flex justify-center flex-wrap'>
                <div className='flex flex-col gap-5 items-center'>
                
                    <div className='flex items-center gap-3 py-1 w-64 md:w-96'>
                        <div className='w-[30%]'>
                            <Image src={Favicon} alt='creator' width={80} className='rounded-xl border-2 border-orange'/>
                        </div>
                        <div className='w-[70%]'>
                            <p className="md:text-3xl text-2xl font-bold">check<span className="text-orange">it</span>off.</p>
                            <p className="pt-3">
                                made by Abdul, this minimal to-do list app lets you add today&apos;s and upcoming tasks and check them off when they&apos;re done.
                            </p>

                        </div>
                    </div>
                    <div className='flex gap-5 items-center pb-4'>
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
                    
                </div>
            </div>
            
            <div className='w-[100%] md:w-[60%] pt-10'>
                <div className="w-64 md:w-96 m-auto ">
                    <div className="pb-5 flex justify-center">
                        <div>
                            <p className='text-xl md:text-2xl font-bold text-center'>login<span className='text-orange'>.</span></p>
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
                                log in
                                <span className='pl-2'><i className="text-sm fa-solid fa-arrow-right"></i></span>
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className='px-3 text-center pt-5'>
                        <p className='text-sm'>don&apos;t have an account? <a href='/register' className='text-orange hover:underline'>sign up</a></p>
                    </div>
                    
                </div>
            </div>
        </div>
        </div>
    )
}

export default Login;
