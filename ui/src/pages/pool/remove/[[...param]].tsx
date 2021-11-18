import {useRouter} from "next/router";
import Head from 'next/head';
import { RemovePool } from "../../../modals";

const RemovePoolPage: React.FC = () => {
  const router = useRouter();
  const { param } = router.query;

  return (
    <>
      <Head>
        <title>HODL Valley - REMOVE POOL</title>
      </Head>
      <RemovePool />
    </>
  )}

export default RemovePoolPage;