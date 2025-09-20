import { api } from "../src/lib/api";
import { LandingPage } from "../src/components/LandingPage";

export const dynamic = "force-static";

export default async function HomePage() {
  const content = await api.fetchLandingPageContent();
  return <LandingPage content={content} />;
}
