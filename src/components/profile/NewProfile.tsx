"use client"
import { useCreateProfile } from "@lens-protocol/react-web";
import { FormEvent, useState } from "react";

function NewProfile() {
  const { execute: create, error, isPending} = useCreateProfile();
  const [handle, setHandle] = useState<string>("")

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!handle || handle === '') return;

    await create({
      handle
    })
  }

  return (<div className='w-screen h-screen'>
    <dialog id="my_modal_3" className="modal modal-open">
  <form method="dialog" className="modal-box">
    <h3 className="font-bold text-lg">Welcome to R8 My Stack!</h3>
    <p className="py-4">Create a Handle to begin!</p>
    <input type="text" placeholder="Type here" className="input input-bordered input-secondary w-full max-w-xs" value={handle} onChange={e=>setHandle(e.target.value)} disabled={isPending}/>
    <button className="btn btn-outline btn-primary" onClick={onSubmit} disabled={isPending}>{isPending && <span className="loading loading-bars loading-lg"></span>} Create</button>
  </form>
</dialog></div>)
}

export default NewProfile;