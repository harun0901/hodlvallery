import Head from 'next/head';
import GainerLoser from "../components/Analytics/gainerLoser/GainerLoser";
import { getApollo } from "../analytics/core/apollo";
import { getGainers } from "../analytics/core/api/pages";
import Layout from "../layouts";

export default function GainersPage () {
  return (
    <>
      <Head>
        <title>HODL Valley - Gainers</title>
      </Head>
      <Layout.GainerLoser gainers>
        <GainerLoser gainer />
      </Layout.GainerLoser>
    </>
  )
};

export async function getStaticProps({}) {
  const client = getApollo();
  await getGainers(client);

  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1,
  };
}