import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req : NextApiRequest, res : NextApiResponse) {
  if (req.method === 'POST') {
    const { postId } = req.body;
    
  }
  else {
    throw new Error("Must be post");
  }
}