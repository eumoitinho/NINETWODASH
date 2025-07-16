import PluginInit from "@/helper/PluginInit";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./font.css";
import "./globals.css";

export const metadata = {
  title: "NINETWODASH - Dashboard de Marketing Digital",
  description:
    "NINETWODASH é o dashboard completo para acompanhar métricas de Google Ads, Facebook Ads e Google Analytics em tempo real.",
};

export default function RootLayout({ children }) {
  return (
    <html lang='pt-BR'>
      <PluginInit />
      <body suppressHydrationWarning={true}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
