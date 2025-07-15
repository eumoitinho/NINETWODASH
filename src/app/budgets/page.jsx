import Breadcrumb from "@/components/Breadcrumb";
import BudgetManager from "@/components/BudgetManager";
import MasterLayout from "@/masterLayout/MasterLayout";

export const metadata = {
  title: "Gerenciar Orçamentos - WowDash NEXT JS",
  description: "Gerencie orçamentos dos clientes",
};

const BudgetsPage = () => {
  return (
    <>
      <MasterLayout>
        <Breadcrumb 
          title='Gerenciar Orçamentos' 
          breadcrumbs={[
            { label: 'Gestão de Clientes', href: '/clients' },
            { label: 'Orçamentos' }
          ]}
        />
        <BudgetManager />
      </MasterLayout>
    </>
  );
};

export default BudgetsPage; 