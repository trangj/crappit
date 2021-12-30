import React, { FormEvent, useState } from 'react';
import { SearchIcon } from "@heroicons/react/outline";
import { useRouter } from 'next/router';
import { useUser } from 'src/context/UserState';

const SearchBar = () => {
    const [query, setQuery] = useState("");
    const { user } = useUser();
    const router = useRouter();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (query === "") return;
        router.push({ pathname: '/search', query: { q: query } });
        setQuery("");
    };

    return (
        <div className={`flex-grow ${!user ? 'mx-auto max-w-2xl' : 'mx-4'}`}>
            <form onSubmit={handleSubmit} className='flex h-9 bg-gray-100 hover:bg-white hover:border-blue-500 dark:bg-gray-800 border dark:border-gray-700 dark:hover:border-white dark:hover:bg-gray-900 rounded'>
                <label className='flex'>
                    <div className='flex items-center pr-2 pl-4'>
                        <SearchIcon height={24} width={24} />
                    </div>
                </label>
                <input placeholder='Search Crappit' className='bg-transparent w-full text-sm mr-4 outline-none' type="text" value={query} onChange={e => setQuery(e.target.value)} />
            </form>
        </div>
    );
};

export default SearchBar;
