"use client"
import PostView from '@/components/PostView';
import { useExploreProfiles, useExplorePublications, PublicationMainFocus, PublicationTypes, Post } from '@lens-protocol/react-web'
import { Publication } from '@lens-protocol/widgets-react';
import Image from 'next/image'
import { useEffect, useState } from 'react';

export default function Home() {
  const [scrolled, setScrolled] = useState(0);
  const { data: publications, hasMore, loading, next } = useExplorePublications({
    limit: 5,
    publicationTypes: [PublicationTypes.Post],
    metadataFilter: {
      restrictPublicationMainFocusTo: [PublicationMainFocus.Video]
    }
  });
  console.log({ profiles: publications });

  useEffect(() => {
    if (publications && publications.length < scrolled + 1 && !loading && hasMore) {
      next();
    }
  }, [scrolled])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="h-screen w-full carousel carousel-vertical rounded-box">
        {
          publications?.map((e, idx) => { return (<div key={idx} className="w-full h-full relative carousel-item">
            <PostView publicationData={e} scrollIn={() => {console.log(e.id, 'scroll in'); setScrolled(idx)}} scrollOut={() => {console.log(e.id, 'scroll.out')}}/>
          </div>)})
        }
      </div>
      {
        !hasMore && <div>No more posts!</div>
      }
    </main>
  )
}
