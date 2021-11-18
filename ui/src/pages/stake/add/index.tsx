import Head from 'next/head';
import { AddRemoveStake } from "../../../modals";

const AddStakePage: React.FC = () => (
  <>
    <Head>
      <title>HODL Valley - ADD STAKE</title>
    </Head>
    <AddRemoveStake isRemove={false} />
  </>
)
export default AddStakePage;

