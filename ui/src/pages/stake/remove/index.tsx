import Head from 'next/head';
import { AddRemoveStake } from "../../../modals";

const RemoveStakePage: React.FC = () => (
  <>
    <Head>
      <title>HODL Valley - REMOVE STAKE</title>
    </Head>
    <AddRemoveStake isRemove={true} />
  </>
)
export default RemoveStakePage;

