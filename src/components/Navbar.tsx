import React from 'react';
import Link from 'next/link';
import { BiSearch } from 'react-icons/bi';

import LoginButton from './Login';
import { useAccount } from 'wagmi';
import { useActiveProfile, useProfilesOwnedByMe } from '@lens-protocol/react-web';
import NewProfile from './profile/NewProfile';

const Navbar = () => {
  const { isConnected } = useAccount();
  const { data: profile, error: profileError, loading: loadingProfile } = useProfilesOwnedByMe();

  console.log(isConnected, loadingProfile, profile)

  return (
    <div className='w-full flex justify-between items-center border-b-2 border-gray-200 py-2 px-4 fixed z-50 bg-slate-300 btm-nav'>
      {isConnected && !loadingProfile && !profile && <NewProfile/>} 
      <Link href='/'>
        <div className='w-[100px] md:w-[129px] md:h-[30px] h-[38px]'>
          R8 My Stack
        </div>
      </Link>

      <div className='relative hidden md:block'>
        <form
          className=' md:static top-10 -left-20 bg-white'
        >
          <input
            className='p-3 md:text-md font-medium border-2 border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 w-[300px] md:w-[350px] rounded-full  md:top-0'
            placeholder='Search accounts and videos'
          />
          <button
            className='absolute md:right-5 right-6 top-4 border-l-2 border-gray-300 pl-4 text-2xl text-gray-400'
          >
            <BiSearch />
          </button>
        </form>
      </div>
      <div>
        <LoginButton/>
      </div>
    </div>
  );
};

export default Navbar;