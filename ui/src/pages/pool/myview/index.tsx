import Head from 'next/head';
import { SearchPoolOrFarm } from "../../../modals";

const MyPoolPage: React.FC = () => (
  <>
    <Head>
      <title>HODL Valley - My POOL</title>
    </Head>
    <SearchPoolOrFarm
      isMyPool={true}
      isFarmView={false}/>
  </>
)
export default MyPoolPage;
