"use client"
import PostView from '@/components/publications/PostView';
import { useExplorePublications, PublicationMainFocus, PublicationTypes, AnyPublication } from '@lens-protocol/react-web'
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export default function Home() {
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)'
  })

  const [scrolled, setScrolled] = useState(0);
  const [data, setData] = useState<AnyPublication[]>([])
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
    if (data.length < scrolled + 2 && !loading && hasMore) {
      if (data.length < 3) return;
      console.log("reloading!");
      next();
    }
  }, [hasMore, loading, next, data, scrolled])

  useEffect(() => {
    if (publications) {
      console.log('publications', publications, data, 'reloading')
      const add = data == null || data.length === 0 ? publications : publications.filter(e=> data.find((f => f.id === e.id)) === null);
      console.log('adding', add)
      if (add.length > 0) {
        setData((prev: AnyPublication[]): AnyPublication[] => {
          return [...prev, ...add]
        })
      }
    }
  }, [publications])

  console.log("Resetting", data);
  if (!data || data.length === 0) {
    return <div><span className="loading loading-ball text-3xl"></span></div>
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className={"h-screen w-full carousel carousel-vertical rounded-box items-center " + (isDesktopOrLaptop ? "items-center" : "")}>
        {
          data?.map((e, idx) => {
            return (<div key={e.id} className={" h-full relative carousel-item " + (isDesktopOrLaptop ? " pb-4" : "  w-full")}>
              <PostView publicationData={e} scrollIn={() => { console.log(e.id, 'scroll in'); setScrolled(idx) }} scrollOut={() => { console.log(e.id, 'scroll.out') }} />
            </div>)
          })
        }
      </div>
      {
        !hasMore && <div>No more posts!</div>
      }
    </main>
  )
}
