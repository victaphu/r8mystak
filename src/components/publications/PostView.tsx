import {
  useEffect, useRef, useState
} from 'react'
import { css } from '@emotion/css'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { formatDistance } from 'date-fns'

import ReactPlayer from 'react-player'
import { Theme, ThemeColor } from '@lens-protocol/widgets-react'
import { formatHandleColors, formatProfilePicture, getSubstring, returnIpfsPathOrUrl, systemFonts } from '@/lib/utils'
import { AudioPlayer } from '../AudioPlayer'
import { MessageIcon } from '../icons/MessageIcon'
import { MirrorIcon } from '../icons/MirrorIcon'
import { HeartIcon } from '../icons/HeartIcon'
import useOnScreen from '@/hook/useOnScreen'
import Link from 'next/link'
import { FaInstagram, FaTiktok, FaCommentDollar } from 'react-icons/fa';
import axios from 'axios'
import fetchCurrentRegisteredLikes from '@/lib/StaksController'
import { useClient } from 'wagmi'
import { useActiveWallet } from '@lens-protocol/react-web'

interface Stats {
  "instaLikes": 0,
  "tiktokLikes": 0,
  "postLikes": 0,
  "distributed": 0,
}

function Publication({
  onClick,
  publicationData,
  theme = Theme.default,
  ipfsGateway,
}: {
  publicationId?: string,
  publicationData: any,
  onClick?: () => void,
  theme?: Theme,
  ipfsGateway?: string
}) {
  let [publication, setPublication] = useState<any>(publicationData)
  let [publicationId, setPublicationId] = useState<any>();

  const [isFarming, setFarming] = useState(false);
  
  const {data, loading} = useActiveWallet();
  let [stats, setStats] = useState<Stats>({
    "instaLikes": 0,
    "tiktokLikes": 0,
    "postLikes": 0,
    "distributed": 0,
  });

  const {provider} = useClient()
  console.log("WALLET IS", data)

  async function fetchStats(connector: any) {
    const likes = await axios.post('/api/socials', {postId: publicationId})
    const stats = {...likes.data, distributed: +(await fetchCurrentRegisteredLikes(publicationId, connector))}
    console.log("Loading from server", stats)
    setStats(stats);
  }

  useEffect(() => {
    if (publicationId && provider) {
      fetchStats(provider);
    }
  }, [publicationId, provider])

  useEffect(() => {
    if (publicationData) {
      let publication = JSON.parse(JSON.stringify(publicationData));
      if (publication.mirrorOf) {
        const { mirrorOf, ...original } = publication
        publication = publication.mirrorOf
        publication.original = original
      }
      publication.profile = formatProfilePicture(publication.profile)
      setPublication(publication)
      if (publication.id != publicationId) {
        setPublicationId(publication.id);
      }
    }
  }, [publicationData])
  
  function onPublicationPress() {
    if (onClick) {
      onClick()
    } else {
      const URI = `https://lenster.xyz/posts/${publication.id}`
      window.open(URI, '_blank')
    }
  }
  console.log(publication);
  if (!publication) return null

  const { profile } = publication

  const isDarkTheme = theme === Theme.dark
  const color = isDarkTheme ? ThemeColor.white : ThemeColor.darkGray
  const backgroundColor = isDarkTheme ? ThemeColor.lightBlack : ThemeColor.white
  const reactionBgColor = isDarkTheme ? ThemeColor.darkGray : ThemeColor.lightGray
  const reactionTextColor = isDarkTheme ? ThemeColor.lightGray : ThemeColor.darkGray

  let media, cover
  if (publication.metadata.media.length) {
    media = JSON.parse(JSON.stringify(publication.metadata.media[0]))
    if (media && media.original) {
      if (
        media.original.mimeType === 'image/jpg' ||
        media.original.mimeType === 'image/jpeg' ||
        media.original.mimeType === 'image/png' ||
        media.original.mimeType === 'image/gif'
      ) {
        media.type = 'image'
      }
      if (
        media.original.mimeType === 'video/mp4' ||
        media.original.mimeType === 'video/quicktime' ||
        media.original.mimeTuype === 'application/x-mpegURL' ||
        media.original.mimeType === 'video/MP2T'
      ) {
        media.type = 'video'
      }
      if (
        media.original.mimeType === 'audio/mpeg' ||
        media.original.mimeType === 'audio/wav' ||
        media.original.mimeType === 'audio/mp3'
      ) {
        media.type = 'audio'
      }
      media.original.url = returnIpfsPathOrUrl(media.original.url, ipfsGateway)
    }
  }
  if (publication.metadata.cover) {
    cover = returnIpfsPathOrUrl(publication.metadata.cover.original.url, ipfsGateway)
  }

  const farm = async () => {
    if (isFarming) return; // already farming
    setFarming(true);
    if (publication && publication.id) {
      const result = await axios.post(`/api/farm`, {
        postId: publication.id
      })

      alert('Farmed!' + result.data.message)
      console.log("Farmed", result.data);
      setFarming((prev) => {
        return false;
      })
      fetchStats(provider);
    }
  }

  return (
    <div
      className={publicationContainerStyle(backgroundColor) + " h-full"}
    >
      <Link href={`/profile/${profile.handle}?profileId=${profile.id}`}>
        <div
          onClick={onPublicationPress}
          className={topLevelContentStyle}
        >
          {
            publication.original && (
              <div className={mirroredByContainerStyle}>
                <MirrorIcon color={ThemeColor.mediumGray} />
                <p>mirrored by {publication.original.profile.handle || publication.original.profile.name}</p>
              </div>
            )
          }
          <div className={profileContainerStyle}>
            <div>
              {
                profile.picture?.uri || profile.picture?.original?.url ? (
                  <img
                    src={
                      profile.picture.__typename === 'NftImage' ?
                        profile.picture.uri : profile.picture?.original?.url
                    }
                    className={profilePictureStyle}
                  />
                ) : (
                  <div
                    className={profilePictureStyle}
                  />
                )
              }
            </div>
            <div className={profileDetailsContainerStyle(color)}>
              <p className={profileNameStyle}>{profile.name || profile.handle}</p>
              <p className={dateStyle}> {formatDistance(new Date(publication.createdAt), new Date())}</p>
            </div>
          </div>
          <div>
            <ReactMarkdown
              className={markdownStyle(color)}
              rehypePlugins={[rehypeRaw]}
            >{formatHandleColors(getSubstring(publication.metadata.content, 339))}</ReactMarkdown>
          </div>
        </div>
      </Link>
      {
        media && media.type == 'image' && (
          <div className={imageContainerStyle}>
            <img
              className={mediaImageStyle}
              src={media.original.url}
              onClick={onPublicationPress}
            />
          </div>
        )
      }
      {
        media && media.type == 'video' && (
          <div className={videoContainerStyle}>
            <ReactPlayer
              className={videoStyle}
              url={media.original.url}
              controls
            />
          </div>
        )
      }
      {
        media && media.type == 'audio' && (
          <AudioPlayer
            url={media.original.url}
            theme={theme}
            cover={cover}
            publication={publication}
          />
        )
      }
      <div
        className={reactionsContainerStyle}
        onClick={onPublicationPress}
      >
        <div className={reactionContainerStyle(reactionTextColor, reactionBgColor)}>
          <MessageIcon color={reactionTextColor} />
          <p>{publication.stats.totalAmountOfComments}</p>
        </div>
        <div className={reactionContainerStyle(reactionTextColor, reactionBgColor)}>
          <HeartIcon color={reactionTextColor} />
          <p>{publication.stats.totalUpvotes}</p>
        </div>
        <div className={reactionContainerStyle(reactionTextColor, reactionBgColor)}>
          <FaInstagram/>
          <p>{stats.instaLikes}</p>
        </div>
        <div className={reactionContainerStyle(reactionTextColor, reactionBgColor)}>
          <FaTiktok color={reactionTextColor} />
          <p>{stats.tiktokLikes}</p>
        </div>
        {
          data && profile.ownedBy === data.address &&
          <button className='btn text-xs' disabled={((stats.instaLikes + stats.tiktokLikes + stats.postLikes) - stats.distributed) <= 0 || isFarming} onClick={farm}>Farm {(stats.instaLikes + stats.tiktokLikes + stats.postLikes) - stats.distributed} STK</button>
        }
        
        
      </div>
    </div>
  )
}

const topLevelContentStyle = css`
  padding: 12px 18px 0px;
`

const imageContainerStyle = css`
  position: relative;
  width: 100%;
  overflow: hidden;
  max-height: 480px;
`

const videoContainerStyle = css`
  padding-top: 56.25% !important;
  height: 0px !important;
  position: relative !important;
`

const videoStyle = css`
  width: 100% !important;
  height: 100% !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
`

const mediaImageStyle = css`
  width: 100%;
  height: auto;
  display: block;
`

const markdownStyle = (color: string) => css`
  color: ${color};
  overflow: hidden;
  p {
    font-size: 14px;
  }
`

const profileContainerStyle = css`
  display: flex;
  align-items: center;
`
const system = css`
  font-family: ${systemFonts} !important
`

const profileNameStyle = css`
  font-weight: 600;
  font-size: 16px;
`

const profilePictureStyle = css`
  width: 42px;
  height: 42px;
  border-radius: 20px;
  object-fit: cover;
  background-color: #dddddd;
`

const reactionsContainerStyle = css`
  padding: 0px 18px 18px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top: 15px;
`

const mirroredByContainerStyle = css`
  display: flex;
  margin-bottom: 5px;
  height: 30px;
  align-items: center;
  p {
    margin: 0;
    color: ${ThemeColor.mediumGray};
    font-size: 14px;
    margin-left: 10px;
    margin-top: -2px;
  }
`

const reactionContainerStyle = (color: string, backgroundColor: string) => css`
  background-color: ${backgroundColor};
  display: flex;
  border-radius: 20px;
  padding: 10px;
  margin-right: 10px;
  p {
    color: ${color};
    font-size: 12px;
    opacity: .75;
    margin: 0;
    margin-left: 4px;
  }
`

const publicationContainerStyle = (color: string) => css`
  width: 510px;
  background-color: ${color};
  cursor: pointer;
  border-radius: 18px;
  @media (max-width: 510px) {
    width: 100%
  }
  * {
    ${system};
  }
`

const dateStyle = css`
  margin-top: 2px !important;
  font-size: 12px;
  color: ${ThemeColor.darkGray};
  opacity: .75;
`

const profileDetailsContainerStyle = (color: string) => css`
  display: flex;
  flex-direction: column;
  margin-left: 7px;
  p {
    margin: 0;
    color: ${color};
  }
`

interface PostArgs {
  publicationData: any,
  scrollIn?: () => void,
  scrollOut?: () => void
};

function fetchUrl(url: string) {
  if (url.indexOf('ipfs://') === 0) {
    return `https://gateway.ipfscdn.io/ipfs/${url.replace('ipfs://', '')}`
  }
  return url
}

export default function PostView({ publicationData, scrollIn, scrollOut }: PostArgs) {
  const elementRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(elementRef);

  useEffect(() => {
    if (scrollIn && scrollOut) {
      isOnScreen ? scrollIn() : scrollOut();
    }
  }, [isOnScreen, scrollIn, scrollOut])

  console.log(publicationData.id, 'rendering')
  return <div className='w-full h-full' ref={elementRef}><Publication publicationData={publicationData} onClick={() => { console.log('clicked') }} /></div>
}