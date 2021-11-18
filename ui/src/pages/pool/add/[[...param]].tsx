import {useRouter} from "next/router";
import Head from 'next/head';
import { AddPool } from "../../../modals";

const AddPoolPage: React.FC = () => {
  const router = useRouter();
  const { param } = router.query;

  return (
    <>
      <Head>
        <title>HODL Valley - ADD POOL</title>
      </Head>
      <AddPool />
    </>
)}

export default AddPoolPage;