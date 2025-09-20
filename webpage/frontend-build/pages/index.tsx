import Head from "next/head";
import type { GetStaticProps } from "next";
import { LandingPage } from "../src/components/LandingPage";
import type { LandingPageContent } from "../src/lib/types";
import { api } from "../src/lib/api";

type IndexPageProps = {
  content: LandingPageContent;
};

export default function IndexPage({ content }: IndexPageProps) {
  return (
    <>
      <Head>
        <title>模卡即刻 - 智能模特商用平台</title>
        <meta
          name="description"
          content="AI 驱动的模卡模板复刻、授权与训练一体化平台"
        />
      </Head>
      <LandingPage content={content} />
    </>
  );
}

export const getStaticProps: GetStaticProps<IndexPageProps> = async () => {
  const content = await api.fetchLandingPageContent();
  return {
    props: {
      content
    }
  };
};
