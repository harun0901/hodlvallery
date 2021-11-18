import Head from 'next/head';
import { SearchPoolOrFarm } from "../../../modals";

const AllPoolPage: React.FC = () => (
  <>
    <Head>
      <title>HODL Valley - ALL POOL</title>
    </Head>
    <SearchPoolOrFarm
      isMyPool={false}
      isFarmView={false}/>
  </>
)
export default AllPoolPage;
