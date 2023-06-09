"use client"
import { useActiveProfile, useCreateProfile } from "@lens-protocol/react-web";
import { FormEvent, useEffect, useState } from "react";

function NewProfile() {
  const { execute: create, error, isPending} = useCreateProfile();
  const { data, error: profileError, loading } = useActiveProfile();

  const [handle, setHandle] = useState<string>("")

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!handle || handle === '') return;

    await create({
      handle
    })
  }

  useEffect(() => {
    if (!data || loading) return;
    
    window.location.href = "/"; // redirect user back to main!
  }, [data, loading])
  if (data && !loading) {
    return <>Loading ...</>
  }
  return (<dialog id="my_modal_3" className="modal modal-open">
  <form method="dialog" className="modal-box">
    <h3 className="font-bold text-lg">Welcome to R8 My Stack!</h3>
    <p className="py-4">Create a Handle to begin!</p>
    <input type="text" placeholder="Type here" className="input input-bordered input-secondary w-full max-w-xs" value={handle} onChange={e=>setHandle(e.target.value)} disabled={isPending}/>
    <button className="btn btn-outline btn-primary" onClick={onSubmit} disabled={isPending}>{isPending && <span className="loading loading-bars loading-lg"></span>} Create</button>
  </form>
</dialog>)
}

export default NewProfile;