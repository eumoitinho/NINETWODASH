import ClientPortalDashboard from "@/components/client-portal/ClientPortalDashboard";

export const metadata = {
  title: "Portal do Cliente - NINETWODASH",
  description: "Dashboard exclusivo do cliente com métricas de campanhas e performance.",
};

const ClientPortalPage = ({ params }) => {
  return <ClientPortalDashboard clientSlug={params.client} />;
};

export default ClientPortalPage;