import Breadcrumb from "@/components/Breadcrumb";
import ClientList from "@/components/ClientList";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Clientes - WowDash NEXT JS",
  description: "Gerencie seus clientes e suas configurações de analytics",
};

const ClientsPage = () => {
  return (
    <>
      <MasterLayout>
        <Breadcrumb 
          title='Clientes' 
          breadcrumbs={[
            { label: 'Clientes', href: '/clients' }
          ]}
        />
        <ClientList />
      </MasterLayout>
    </>
  );
};

export default ClientsPage; 