This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

What you learnt
===============
Technical Perspective
- Lens Protocol: the technology is starting to mature fast! there are a host of developer tools and documentation out there that really helps someone pick up the protocol and develop within it in days. Lens is truly composable; you can integrate directly with the protocol at any level without barriers and re-use a lot of the tools and pluggable code that's built already. Being able to bring my social network across the various domains was an incredible feeling. I could build out a social network of followers and then take them where-ever i went.

- Chainlink Functions: I think this is a game-changer. Being able to securely and verifiably invoke any API on earth and have the results aggregated back to you will open up a whole new set of use-cases and business functions that could not have been done reliably without the chainlink middleware.

- Polygon: Fast, cheap and reliable. I used it for all my web3 projects.

- Amazon AWS Lambda Functions, Serverless: Super quick to roll out using serverless and infrastructure as code. This was required for our web2 integration layer

- Web3 Auth: Social web3 login is a fundamental pillar for mass adoption of web tech. For r8mystak we spent quite a bit of time to make sure we had social logins to enable as many users to on-board in-app as possible. This was key to a smooth user experience.

- Solidity, Openzeppelin and Chainlink libraries: we built chainlink function consumers in a day with the helpful tutorials and built an end-to-end architecture to allow integration between the web2 space and web3 space. 

- NextJS 13: This tech allowed us to build and deploy effortlessly. This helped remove obstacles which would have otherwise took us away from the main focus of building cool stuff


Project Perspective
- Keep the scope small, targeted and manageable. We decided to build the core tech for r8mystak and keep it as simple as possible to prove an idea; that we can build a MVP that allows for aggregate on-chain and off-chain social media likes through various decentralised protocols and tools
- Manage scope-creep; ask yourself if it proves the core tech and whether there is workarounds. Time management is KEY in hackathons
- Don't be afraid to ask for help online, and always remember to give back
- Team work makes the dream work! Each team member brings value in various competencies. Learn each team members' strengths and weaknesses and how they compliment.

Pitfalls
- Don't chase after every shiny new thing; use tried and true vs bleeding edge (although sometimes its not possible)
- New tech will fail you at the worse time! be prepared and have workarounds
- Don't leave things to the last minute!


How we built this
=================
I think the majority of the time was spent learning all the new tech that was needed. We started with the concept of aggregated likes and then worked backwards until we solved all the technical hurdles. The hardest part was to integrate all the various technologies we chose and make them work nicely together. Trying to get our LAMBDA functions talking to our Smart contracts, trying to define the various interfaces between the tech, finding all the libraries and interfaces and smart contracts to make everything work smoothly.

Once the technical hurdles were solved (to a satisfactory level) we started to map out the various system components that were required to realise our vision; noting all the issues we had along the way. We tried to incorporate as many best-practices as we could (CI/CD, Testing (yeah right!), Infrastructure as Code, Reusability and Open Architectures, Composability and modular design, etc). We tried to use as many free solutions as possible so we could quickly spin up instances and test.


Challenges
==========
- Keeping the scope under control. We truly believe in the app and its potential to draw crowds from web2 to web3 space with token incentives for their likes. We wanted to implement the world but only really managed to implement a fraction of our vision
- Trying out all the new tech that came along; Lens Protocol and Chainlink are great; but as with any bleeding edge tech there are pitfalls and gotchas. For example, the Lens Protocol widgets and embeds only work with main-net and didn't accept injection of the various objects (profile, posts, etc). Chainlink functions are very raw; I'm use to the incredibly well thought out documentation and guides from other chainlink tools and felt the functions were still missing a few key pieces (e.g. deploying chainlink functions in a server-side environment)
- Pricing and costs; Chainlink functions cost 0.2++ LINK which can be rather expensive. We got around this hurdle by allowing users to 'farm' their likes until they reach a certain amount to cash out. In future implementations we also plan to include a way for users to pay for the transaction costs using a portion of their 'farmed' likes
- Web3 Auth is great, but how can a user bring their wallet with them the same way that they can bring their social network with them? We integrated web3auth in R8MyStak then Heather asked how she could connect to Lenster with their richer User Experience and I was stumped. Web3Auth is great if everyone integrates it; otherwise we end up with another walled garden.


What we used to build this!
===========================
- Chainlink for web2 to web3 integration - that chainlink function code was a lifesaver!
- Lens Protocol for the social networking layer
- Web3 Auth for the social login layer
- AWS Lambda for quickly deploying web services for our APIs
- MongoDB for our persistence layer because there was a free version and because its so easy to use and rollout
- ReactJS + NextJS + Netlify for rapid prototyping and development
- Wagmi + LensProtocol adapters to integrate Web3 Auth, Lens protocol and EthersJS
- Solidity + Hardhat to build out the smart contracts (ERC20 + STAKSController, combined with Open Zeppelin and Chainlink)
- Tailwind CSS and Daisy UI (because I'm terrible at UX design!)
- All the wonderful integration code from Chainlink, Lens Protocol, Web3 Auth and Wagmi. 
