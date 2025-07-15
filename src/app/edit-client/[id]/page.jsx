import Breadcrumb from "@/components/Breadcrumb";
import AddEditClient from "@/components/AddEditClient";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Editar Cliente - WowDash NEXT JS",
  description: "Edite as configurações do cliente",
};

const EditClientPage = ({ params }) => {
  return (
    <>
      <MasterLayout>
        <Breadcrumb 
          title='Editar Cliente' 
          breadcrumbs={[
            { label: 'Clientes', href: '/clients' },
            { label: 'Editar Cliente' }
          ]}
        />
        <AddEditClient clientId={params.id} />
      </MasterLayout>
    </>
  );
};

export default EditClientPage; 