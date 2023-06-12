import axios from 'axios';
import { NextResponse } from 'next/server';
import handle from './request';

export async function POST(request: Request) {
  const req = await request.json();
  const { postId } = req;
  
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
      ' query Publication($request: PublicationQueryRequest!, $reactionRequest: ReactionFieldResolverRequest, $profileId: ProfileId) {\n  publication(request: $request) {\n    ... on Post {\n      ...PostFields\n      collectNftAddress\n      profile {\n        isFollowedByMe\n        ownedBy\n        __typename\n      }\n      referenceModule {\n        __typename\n      }\n      __typename\n    }\n    ... on Mirror {\n      ...MirrorFields\n      collectNftAddress\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment PostFields on Post {\n  id\n  reaction(request: $reactionRequest)\n  mirrors(by: $profileId)\n  stats {\n    ...StatsFields\n    __typename\n  }\n  metadata {\n    ...MetadataFields\n    __typename\n  }\n  hidden\n  createdAt\n  appId\n  __typename\n}\n\nfragment StatsFields on PublicationStats {\n  totalUpvotes\n  totalAmountOfMirrors\n  totalAmountOfCollects\n  totalAmountOfComments\n  __typename\n}\n\nfragment MetadataFields on MetadataOutput {\n  name\n  content\n  image\n  attributes {\n    traitType\n    value\n    __typename\n  }\n  cover {\n    original {\n      url\n      __typename\n    }\n    __typename\n  }\n  media {\n    original {\n      url\n      mimeType\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment MirrorFields on Mirror {\n  id\n  reaction(request: $reactionRequest)\n  stats {\n    ...StatsFields\n    __typename\n  }\n  metadata {\n    ...MetadataFields\n    __typename\n  }\n  hidden\n  mirrorOf {\n    ... on Post {\n      ...PostFields\n      __typename\n    }\n    __typename\n  }\n  createdAt\n  appId\n  __typename\n}\n',
  });
  console.log('post', lensResult.data.errors);
  // stats (likes)
  // metadata (insta and tiktok)
  const { publication } = lensResult.data.data;

  const result = await handle(publication.profile.ownedBy, postId);  
  console.log("Completed processing successfully?", result);

  return NextResponse.json({
    message: `Processed Publication ${publication.id} owned by ${publication.profile.ownedBy} with result ${result}`
  });
}
