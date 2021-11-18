import Head from 'next/head';
import { SearchPoolOrFarm } from "../../../modals";

const AllFarmPage: React.FC = () => (
  <>
    <Head>
      <title>HODL Valley - ALL FARM</title>
    </Head>
    <SearchPoolOrFarm
      isMyPool={false}
      isFarmView={true}/>
  </>
)
export default AllFarmPage;
