import Breadcrumb from "@/components/Breadcrumb";
import ClientTagsManager from "@/components/ClientTagsManager";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Gerenciar Tags - WowDash NEXT JS",
  description: "Gerencie tags e atribua aos clientes",
};

const ClientTagsPage = () => {
  return (
    <>
      <MasterLayout>
        <Breadcrumb 
          title='Gerenciar Tags' 
          breadcrumbs={[
            { label: 'Gestão de Clientes', href: '/clients' },
            { label: 'Gerenciar Tags' }
          ]}
        />
        <ClientTagsManager />
      </MasterLayout>
    </>
  );
};

export default ClientTagsPage; 