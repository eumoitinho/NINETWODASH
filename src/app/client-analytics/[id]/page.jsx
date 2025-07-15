import Breadcrumb from "@/components/Breadcrumb";
import ClientAnalytics from "@/components/ClientAnalytics";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Analytics do Cliente - WowDash NEXT JS",
  description: "Analytics específicas do cliente com dados do GA4 e Meta Ads",
};

const ClientAnalyticsPage = async ({ params }) => {
  // Aguardar os parâmetros conforme exigido pelo Next.js 15+
  const { id } = await params;

  return (
    <>
      <MasterLayout>
        <Breadcrumb 
          title='Analytics do Cliente' 
          breadcrumbs={[
            { label: 'Dashboards', href: '/dashboards' },
            { label: 'Analytics do Cliente' }
          ]}
        />
        <ClientAnalytics clientId={id} />
      </MasterLayout>
    </>
  );
};

export default ClientAnalyticsPage; 