import HomeClient from "@/components/public-page-components/HomeClient";
import { getPublicStats } from "@/controllers/breachController";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const stats = await getPublicStats();
  return <HomeClient stats={stats} />;
}
