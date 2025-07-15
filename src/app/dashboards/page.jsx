import Breadcrumb from "@/components/Breadcrumb";
import DashboardsList from "@/components/DashboardsList";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Dashboards - WowDash NEXT JS",
  description: "Visualize todos os dashboards dos clientes",
};

const DashboardsPage = () => {
  return (
    <>
      <MasterLayout>
        <Breadcrumb 
          title='Dashboards dos Clientes' 
          breadcrumbs={[
            { label: 'Dashboards', href: '/dashboards' }
          ]}
        />
        <DashboardsList />
      </MasterLayout>
    </>
  );
};

export default DashboardsPage; 