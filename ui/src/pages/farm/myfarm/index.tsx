import Head from 'next/head';
import { SearchPoolOrFarm } from "../../../modals";

const MyFarmPage: React.FC = () => (
  <>
    <Head>
      <title>HODL Valley - My FARM</title>
    </Head>
    <SearchPoolOrFarm
      isMyPool={true}
      isFarmView={true}/>
  </>
)
export default MyFarmPage;
