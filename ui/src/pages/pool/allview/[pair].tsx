import Head from 'next/head';
import { PoolDetails } from "../../../modals";
import {useRouter} from "next/router";

const PoolDetailsPage: React.FC = () => {
  const router = useRouter();
  const { pair } = router.query;

  return (
    <>
      <Head>
        <title>HODL Valley - MY ALL POOL DETAILS</title>
      </Head>
      <PoolDetails />
    </>
  )
}

export default PoolDetailsPage;
