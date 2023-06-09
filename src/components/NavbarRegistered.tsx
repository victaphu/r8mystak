"use client"
import React, { useEffect } from 'react';

import { useActiveProfile, useActiveProfileSwitch, useProfilesOwnedByMe, useWalletLogin, useWalletLogout } from '@lens-protocol/react-web';
import NewProfile from './profile/NewProfile';
import { FaHome, FaPlusSquare, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useDisconnect } from 'wagmi';


const Register = () => {
  const { isPending } = useWalletLogin()
  const { data: profile, error: profileError, loading: loadingProfile } = useProfilesOwnedByMe();
  const { disconnect, disconnectAsync } = useDisconnect();
  const { execute: logout } = useWalletLogout();

  const { execute } = useActiveProfileSwitch();
  
  const { data: activeProfile } = useActiveProfile();

  useEffect(() => {
    if (activeProfile) {
      return;
    }
    if (!isPending && !loadingProfile && profile && profile.length > 0) {
      console.log("selecting the profile!")
      execute(profile[0]?.id);
    }
  }, [isPending, profile, loadingProfile, activeProfile])

  console.log(">>>", isPending, loadingProfile, profile)

  if (!isPending && !loadingProfile && profile?.length === 0) {
    return <NewProfile />
  }

  if (!activeProfile) {
    return <div>Loading ...</div>
  }
  console.log('updating repeatedly')
  return (
    <div className='w-full flex justify-between items-center border-b-2 border-gray-600 py-2 px-4 fixed z-50 bg-gray-600 btm-nav'>
      <button onClick={e=>window.location.href="/"}>
        <FaHome />
      </button>
      <button onClick={e=>window.location.href="/post"}>
        <FaPlusSquare/>
      </button>
      <button onClick={e=>window.location.href=`/profile/${activeProfile?.handle}?profileId=${activeProfile?.id}`}>
        <FaUser />
      </button>
      <button onClick={e=>{
        logout();
        disconnect()
      }}>
        <FaSignOutAlt />
      </button>
    </div>
  );
};

export default Register;