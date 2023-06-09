'use client'
import { Profile } from "@/components/profile/Profile";
import { Publications } from "@/components/publications/Publications";
import { useProfile, usePublications } from "@lens-protocol/react-web";

export default function Page({ params, searchParams }: any) {
  const { data: profile, loading } = useProfile({ handle: params.id })

  console.log(searchParams);

  const { data, loading: publicationLoading, hasMore, next } = usePublications({
    profileId: searchParams?.profileId
  })

  console.log(data, publicationLoading, hasMore);
  
  if (loading) {
    return <div className="w-full"><span className="loading loading-bars loading-lg"> Loading ...</span></div>
  }
  return (<div className="flex w-full h-full items-center">
    <div className="w-full relative items-center">
    <button className="btn btn-circle absolute right-3 top-3 z-50" onClick={e=>window.location.href="/"}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
    </button>
    <Profile profile={profile as any} />
    <Publications publications={data}/>
  </div></div>)
}