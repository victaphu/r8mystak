'use client'

import { Profile } from "@/components/profile/Profile"

export default function Page({ params, searchParams } : any) {
  if (!params.id) {
    return <>Issue with args</>
  }
    return (<div className=""><Profile
        handle={params.id} 
      />
      
      </div>)
}