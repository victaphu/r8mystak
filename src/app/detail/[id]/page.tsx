'use client'
import { Profile } from "@lens-protocol/widgets-react";

export default function Page({ params, searchParams } : any) {
    return (<div><Profile
        handle={params.id} 
      />
      
      </div>)
}