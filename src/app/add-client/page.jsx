import Breadcrumb from "@/components/Breadcrumb";
import AddEditClient from "@/components/AddEditClient";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Adicionar Cliente - WowDash NEXT JS",
  description: "Adicione um novo cliente com configurações de analytics",
};

const AddClientPage = () => {
  return (
    <>
      <MasterLayout>
        <Breadcrumb 
          title='Adicionar Cliente' 
          breadcrumbs={[
            { label: 'Clientes', href: '/clients' },
            { label: 'Adicionar Cliente' }
          ]}
        />
        <AddEditClient />
      </MasterLayout>
    </>
  );
};

export default AddClientPage; 