'use client'
import { Profile } from "@lens-protocol/widgets-react";

export default function Page({ params, searchParams } : any) {
  if (!params.id) {
    return <>Issue with args</>
  }
    return (<div><Profile
        handle={params.id} 
      />
      
      </div>)
}