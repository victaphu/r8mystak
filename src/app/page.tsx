"use client"
import PostView from '@/components/PostView';
import { useExplorePublications, PublicationMainFocus, PublicationTypes, AnyPublication } from '@lens-protocol/react-web'
import { useEffect, useState } from 'react';

export default function Home() {
  const [scrolled, setScrolled] = useState(0);
  const [ data, setData ] = useState<AnyPublication[]>([])
  const { data: publications, hasMore, loading, next } = useExplorePublications({
    limit: 5,
    publicationTypes: [PublicationTypes.Post],
    metadataFilter: {
      restrictPublicationMainFocusTo: [PublicationMainFocus.Video],
      restrictPublicationTagsTo: {
        oneOf: ["r8mystak"]
      }
    }
  });

  useEffect(() => {
    if (publications && data.length < scrolled + 2 && !loading && hasMore) {
      next();
    }
  }, [hasMore, loading, next, data, publications, scrolled])

  useEffect(() => {    
    if (publications) {
      console.log('publications', publications, data, 'reloading')
      setData((prev: AnyPublication[]) : AnyPublication[] => {
        return [...prev, ...publications.filter(e=>prev.find(v=>v.id === e.id) !== null)]
      })
    }
  }, [publications])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="h-screen w-full carousel carousel-vertical rounded-box">
        {
          data?.map((e, idx) => { return (<div key={idx} className="w-full h-full relative carousel-item">
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
