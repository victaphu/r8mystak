"use client"
import PostView from '@/components/PostView';
import { useExploreProfiles, useExplorePublications, PublicationMainFocus, PublicationTypes, Post } from '@lens-protocol/react-web'
import { Publication } from '@lens-protocol/widgets-react';
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export default function Home() {
  const [scrolled, setScrolled] = useState(0);
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)'
  })
  const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
  const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })

  
  const { data: publications, hasMore, loading, next } = useExplorePublications({
    limit: 5,
    publicationTypes: [PublicationTypes.Post],
    metadataFilter: {
      restrictPublicationMainFocusTo: [PublicationMainFocus.Video]
    }
  });
  console.log(hasMore, loading, publications, scrolled)
  
  useEffect(() => {
    if (publications && publications.length < scrolled + 3 && !loading && hasMore) {
      console.log("load more")
      next();
    }
  }, [scrolled])

  // todo: window of currently active views
  return (
    <main className="flex min-h-screen flex-col items-center justify-between gap-4">
      <div className={"h-screen w-full carousel carousel-vertical rounded-box"}>
        {
          publications?.map((e, idx) => { return (<div key={idx} className={"mb-2 w-full relative carousel-item " + (!isDesktopOrLaptop ? "h-full" : "")}>
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
