import Head from 'next/head';
import { FarmDetails } from "../../../modals";
import {useRouter} from "next/router";

const FarmDetailsPage: React.FC = () => {
  const router = useRouter();
  const { pair } = router.query;

  return (
    <>
      <Head>
        <title>HODL Valley - ALL FARM DETAILS</title>
      </Head>
      <FarmDetails />
    </>
  )
}

export default FarmDetailsPage;
