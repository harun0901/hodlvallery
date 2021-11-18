import Head from 'next/head';
import {SwapMeet} from "../modals";

const SwapMeetPage: React.FC = () => (
  <>
    <Head>
      <title>HODL Valley - SWAP MEET</title>
    </Head>
    <SwapMeet swapPageLink={'/swap'} pairsPageLink={"/network"} poolsPageLink={"/pools"} tokensPageLink={"/tokens"} />
  </>
)
export default SwapMeetPage;