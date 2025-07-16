"use client"

import { ChevronRightIcon, BuildingIcon, Loader2Icon } from "lucide-react"
import Link from "next/link"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

interface Client {
  id: string
  name: string
  slug: string
  status: string
}

interface NavClientsProps {
  clients: Client[]
  loading: boolean
  userRole?: string
}

export function NavClients({ clients, loading, userRole }: NavClientsProps) {
  if (loading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Clientes</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <Loader2Icon className="h-4 w-4 animate-spin" />
              <span>Carregando clientes...</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  if (!clients.length) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Clientes</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <BuildingIcon className="h-4 w-4" />
              <span>Nenhum cliente encontrado</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Clientes ({clients.length})</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible asChild defaultOpen={true}>
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip="Clientes">
                <BuildingIcon className="h-4 w-4" />
                <span>Lista de Clientes</span>
                <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {clients.map((client) => (
                  <SidebarMenuSubItem key={client.id}>
                    <SidebarMenuSubButton asChild>
                      <Link href={`/client-analytics/${client.slug}`}>
                        <div className="flex items-center justify-between w-full">
                          <span className="truncate">{client.name}</span>
                          <div 
                            className={`h-2 w-2 rounded-full ${
                              client.status === 'connected' ? 'bg-green-500' : 
                              client.status === 'disconnected' ? 'bg-red-500' : 
                              'bg-yellow-500'
                            }`}
                            title={`Status: ${client.status}`}
                          />
                        </div>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}