import { ethers } from "ethers";

const abi = [
  'function posts(string) external view returns (tuple(address,uint256))'
];
const address = '0xF0f6C2D960965dAb65E3e12EE3ED8eBf0224F460'
export default async function fetchCurrentRegisteredLikes(postId: string, connector:any) {
  console.log("Fetcing likes", postId)
  const contract = new ethers.Contract(address, abi, connector);
  const results = await contract.posts(postId)
  console.log("Retrieve stats", results);
  return ethers.utils.formatUnits(results[1], 'wei');
}