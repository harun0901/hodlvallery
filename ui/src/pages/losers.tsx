import Head from 'next/head';
import GainerLoser from "../components/Analytics/gainerLoser/GainerLoser";
import { getApollo } from "../analytics/core/apollo";
import {getLosers} from "../analytics/core/api/pages";
import Layout from "../layouts";

export default function LosersPage () {
  return (
    <>
      <Head>
        <title>HODL Valley - Losers</title>
      </Head>
      <Layout.GainerLoser>
        <GainerLoser />
      </Layout.GainerLoser>
    </>
  )
};

export async function getStaticProps({}) {
  const client = getApollo();
  await getLosers(client);

  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1,
  };
}