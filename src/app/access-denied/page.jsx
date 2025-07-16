import AccessDeniedLayer from "@/components/AccessDeniedLayer";

export const metadata = {
  title: "Acesso Negado - NINETWODASH | Dashboard de Marketing Digital",
  description: "Você não tem permissão para acessar esta página do NINETWODASH.",
};

const Page = () => {
  return (
    <>
      <AccessDeniedLayer />
    </>
  );
};

export default Page;
