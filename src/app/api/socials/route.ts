import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const req = await request.json();
  const { postId } = req;
  console.log(req)
  const web2url =
    'https://i7iw4j2coi.execute-api.ap-southeast-2.amazonaws.com/staging/socials';
  const lensurl = 'https://api-mumbai.lens.dev/';
  const lensResult = await axios.post(lensurl, {
    operationName: 'Publication',
    variables: {
      request: {
        publicationId: postId,
      },
      reactionRequest: null,
      profileId: null,
    },
    query:
      ' query Publication($request: PublicationQueryRequest!, $reactionRequest: ReactionFieldResolverRequest, $profileId: ProfileId) {\n  publication(request: $request) {\n    ... on Post {\n      ...PostFields\n      collectNftAddress\n      profile {\n        isFollowedByMe\n        __typename\n      }\n      referenceModule {\n        __typename\n      }\n      __typename\n    }\n    ... on Mirror {\n      ...MirrorFields\n      collectNftAddress\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment PostFields on Post {\n  id\n  reaction(request: $reactionRequest)\n  mirrors(by: $profileId)\n  stats {\n    ...StatsFields\n    __typename\n  }\n  metadata {\n    ...MetadataFields\n    __typename\n  }\n  hidden\n  createdAt\n  appId\n  __typename\n}\n\nfragment StatsFields on PublicationStats {\n  totalUpvotes\n  totalAmountOfMirrors\n  totalAmountOfCollects\n  totalAmountOfComments\n  __typename\n}\n\nfragment MetadataFields on MetadataOutput {\n  name\n  content\n  image\n  attributes {\n    traitType\n    value\n    __typename\n  }\n  cover {\n    original {\n      url\n      __typename\n    }\n    __typename\n  }\n  media {\n    original {\n      url\n      mimeType\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment MirrorFields on Mirror {\n  id\n  reaction(request: $reactionRequest)\n  stats {\n    ...StatsFields\n    __typename\n  }\n  metadata {\n    ...MetadataFields\n    __typename\n  }\n  hidden\n  mirrorOf {\n    ... on Post {\n      ...PostFields\n      __typename\n    }\n    __typename\n  }\n  createdAt\n  appId\n  __typename\n}\n',
  });
  console.log('post', lensResult.data.errors);
  // stats (likes)
  // metadata (insta and tiktok)
  const { publication } = lensResult.data.data;

  console.log(publication);

  if (publication.metadata.content.indexOf('#r8mystak') < 0) {
    // throw Error('Post not valid, does not contain r8mystak tag');
    return NextResponse.json({
      instaLikes: 0,
      tiktokLikes: 0,
      postLikes: publication.stats.totalUpvotes
    });
  }

  if (
    publication.metadata.content.indexOf('tiktok:') < 0 ||
    publication.metadata.content.indexOf('instagram: ') < 0
  ) {
    return NextResponse.json({
      instaLikes: 0,
      tiktokLikes: 0,
      postLikes: publication.stats.totalUpvotes
    });
  }

  const content = publication.metadata.content
    .split('\n')
    .filter((e:any) => e.indexOf('tiktok') >= 0 || e.indexOf('instagram') >= 0);
  console.log(content);

  const insta = content
    .find((e:any) => e.indexOf('instagram: ') >= 0)
    .replace('instagram: ', '');
  const tiktok = content
    .find((e:any) => e.indexOf('tiktok: ') >= 0)
    .replace('tiktok: ', '');

  console.log(insta, tiktok);

  const instaTiktokResult = await axios.post(web2url, {
      postId: postId,
      tiktokId: tiktok,
      instaId: insta,
    },
    // Get a free API key from https://coinmarketcap.com/api/
    {
      headers: { 'x-api-key': process.env.API_KEY },
    }
  );
  

  const instaLikes = instaTiktokResult.data.data.instaLike;
  const tiktokLikes = instaTiktokResult.data.data.tiktokLike;
  const postLikes = publication.stats.totalUpvotes;
  console.log(instaLikes, tiktokLikes, postLikes);

  return NextResponse.json({
    instaLikes,
    tiktokLikes,
    postLikes
  });
}
