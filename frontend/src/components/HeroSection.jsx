import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        const trimmedQuery = query.trim();
        dispatch(setSearchedQuery(trimmedQuery)); // Dispatch the search query to Redux
        navigate("/browse"); // Navigate to the browse page
    };

    return (
        <div className='text-center'>
            <div className='flex flex-col gap-5 my-10'>
                <span className='mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>
                    No. 1 Job Hunt Website
                </span>
                <h1 className='text-5xl font-bold'>
                    Search, Apply & <br /> Get Your <span className='text-[#6A38C2]'>Dream Jobs</span>
                </h1>
                <p>Find Jobs which suits you and Apply easily!</p>
                <form onSubmit={handleSubmit} className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
                    <input
                        type="text"
                        placeholder='Find your dream jobs'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none border-none w-full'ly
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmit(e);
                            }
                        }}
                    />
                    <Button type="submit" className="rounded-r-full bg-[#6A38C2]">
                        <Search className='h-5 w-5' />
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default HeroSection;