"use client";
import React, { useState } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from 'next/link';

const ClientList = () => {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "ABC EVO",
      email: "contato@abcevo.com",
      status: "active",
      ga4Connected: true,
      metaConnected: true,
      lastSync: "2024-01-15",
      monthlyBudget: 25000,
      avatar: "assets/images/avatar/avatar-1.png"
    },
    {
      id: 2,
      name: "Dr. Victor Mauro",
      email: "contato@drvictormauro.com",
      status: "active",
      ga4Connected: true,
      metaConnected: false,
      lastSync: "2024-01-14",
      monthlyBudget: 18000,
      avatar: "assets/images/avatar/avatar-2.png"
    },
    {
      id: 3,
      name: "Dr. Percio",
      email: "contato@drpercio.com",
      status: "active",
      ga4Connected: false,
      metaConnected: true,
      lastSync: "2024-01-13",
      monthlyBudget: 12000,
      avatar: "assets/images/avatar/avatar-3.png"
    },
    {
      id: 4,
      name: "CWTremds",
      email: "contato@cwtremds.com",
      status: "active",
      ga4Connected: true,
      metaConnected: true,
      lastSync: "2024-01-15",
      monthlyBudget: 30000,
      avatar: "assets/images/avatar/avatar-4.png"
    },
    {
      id: 5,
      name: "Global Best Part",
      email: "contato@globalbestpart.com",
      status: "active",
      ga4Connected: true,
      metaConnected: true,
      lastSync: "2024-01-14",
      monthlyBudget: 22000,
      avatar: "assets/images/avatar/avatar-1.png"
    },
    {
      id: 6,
      name: "LJ Santos",
      email: "contato@ljsantos.com",
      status: "active",
      ga4Connected: false,
      metaConnected: true,
      lastSync: "2024-01-12",
      monthlyBudget: 15000,
      avatar: "assets/images/avatar/avatar-2.png"
    },
    {
      id: 7,
      name: "Favretto Mídia Exterior",
      email: "contato@favrettomidia.com",
      status: "active",
      ga4Connected: true,
      metaConnected: true,
      lastSync: "2024-01-15",
      monthlyBudget: 35000,
      avatar: "assets/images/avatar/avatar-3.png"
    },
    {
      id: 8,
      name: "Favretto Comunicação Visual",
      email: "contato@favrettocomunicacao.com",
      status: "active",
      ga4Connected: true,
      metaConnected: false,
      lastSync: "2024-01-14",
      monthlyBudget: 28000,
      avatar: "assets/images/avatar/avatar-4.png"
    },
    {
      id: 9,
      name: "Mundial",
      email: "contato@mundial.com",
      status: "active",
      ga4Connected: true,
      metaConnected: true,
      lastSync: "2024-01-15",
      monthlyBudget: 40000,
      avatar: "assets/images/avatar/avatar-1.png"
    },
    {
      id: 10,
      name: "Naframe",
      email: "contato@naframe.com",
      status: "active",
      ga4Connected: false,
      metaConnected: true,
      lastSync: "2024-01-13",
      monthlyBudget: 16000,
      avatar: "assets/images/avatar/avatar-2.png"
    },
    {
      id: 11,
      name: "Motin Films",
      email: "contato@motinfilms.com",
      status: "active",
      ga4Connected: true,
      metaConnected: true,
      lastSync: "2024-01-15",
      monthlyBudget: 32000,
      avatar: "assets/images/avatar/avatar-3.png"
    },
    {
      id: 12,
      name: "Naport",
      email: "contato@naport.com",
      status: "active",
      ga4Connected: true,
      metaConnected: false,
      lastSync: "2024-01-14",
      monthlyBudget: 19000,
      avatar: "assets/images/avatar/avatar-4.png"
    },
    {
      id: 13,
      name: "Autoconnect Prime",
      email: "contato@autoconnectprime.com",
      status: "active",
      ga4Connected: true,
      metaConnected: true,
      lastSync: "2024-01-15",
      monthlyBudget: 45000,
      avatar: "assets/images/avatar/avatar-1.png"
    },
    {
      id: 14,
      name: "Vtelco Networks",
      email: "contato@vtelconetworks.com",
      status: "active",
      ga4Connected: true,
      metaConnected: true,
      lastSync: "2024-01-15",
      monthlyBudget: 38000,
      avatar: "assets/images/avatar/avatar-2.png"
    },
    {
      id: 15,
      name: "Amitech",
      email: "contato@amitech.com",
      status: "active",
      ga4Connected: false,
      metaConnected: true,
      lastSync: "2024-01-12",
      monthlyBudget: 14000,
      avatar: "assets/images/avatar/avatar-3.png"
    },
    {
      id: 16,
      name: "Catalisti Holding",
      email: "contato@catalistiholding.com",
      status: "active",
      ga4Connected: true,
      metaConnected: true,
      lastSync: "2024-01-15",
      monthlyBudget: 50000,
      avatar: "assets/images/avatar/avatar-4.png"
    },
    {
      id: 17,
      name: "Hogrefe Construtora",
      email: "contato@hogrefeconstrutora.com",
      status: "active",
      ga4Connected: true,
      metaConnected: false,
      lastSync: "2024-01-14",
      monthlyBudget: 26000,
      avatar: "assets/images/avatar/avatar-1.png"
    },
    {
      id: 18,
      name: "Colaço Engenharia",
      email: "contato@colacoengenharia.com",
      status: "active",
      ga4Connected: true,
      metaConnected: true,
      lastSync: "2024-01-15",
      monthlyBudget: 42000,
      avatar: "assets/images/avatar/avatar-2.png"
    },
    {
      id: 19,
      name: "Pesados Web",
      email: "contato@pesadosweb.com",
      status: "active",
      ga4Connected: false,
      metaConnected: true,
      lastSync: "2024-01-13",
      monthlyBudget: 11000,
      avatar: "assets/images/avatar/avatar-3.png"
    },
    {
      id: 20,
      name: "Eleva Corpo e Alma",
      email: "contato@elevacorpoealma.com",
      status: "active",
      ga4Connected: true,
      metaConnected: true,
      lastSync: "2024-01-15",
      monthlyBudget: 24000,
      avatar: "assets/images/avatar/avatar-4.png"
    }
  ]);

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: "bg-success-subtle text-success-main",
      pending: "bg-warning-subtle text-warning-main",
      inactive: "bg-danger-subtle text-danger-main"
    };
    return (
      <span className={`badge ${statusClasses[status] || statusClasses.inactive}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getConnectionStatus = (connected) => {
    return connected ? (
      <Icon icon="solar:check-circle-bold" className="text-success-main text-xl" />
    ) : (
      <Icon icon="solar:close-circle-bold" className="text-danger-main text-xl" />
    );
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Gestão de Clientes</h5>
            <div className="d-flex gap-2">
              <Link href="/client-tags" className="btn btn-outline-warning">
                <Icon icon="solar:tag-price-bold" className="me-2" />
                Gerenciar Tags
              </Link>
              <Link href="/budgets" className="btn btn-outline-info">
                <Icon icon="solar:money-bag-bold" className="me-2" />
                Orçamentos
              </Link>
              <Link href="/add-client" className="btn btn-primary">
                <Icon icon="solar:add-circle-bold" className="me-2" />
                Adicionar Cliente
              </Link>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Status</th>
                    <th>Google Analytics 4</th>
                    <th>Meta Ads</th>
                    <th>Última Sincronização</th>
                    <th>Orçamento Mensal</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={client.avatar}
                            alt={client.name}
                            className="rounded-circle me-3"
                            width="40"
                            height="40"
                          />
                          <div>
                            <h6 className="mb-0">{client.name}</h6>
                            <small className="text-muted">{client.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{getStatusBadge(client.status)}</td>
                      <td>{getConnectionStatus(client.ga4Connected)}</td>
                      <td>{getConnectionStatus(client.metaConnected)}</td>
                      <td>
                        {client.lastSync ? (
                          <span className="text-muted">{client.lastSync}</span>
                        ) : (
                          <span className="text-warning">Não sincronizado</span>
                        )}
                      </td>
                      <td>
                        <span className="fw-semibold">
                          R$ {client.monthlyBudget.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <Link
                            href={`/client-analytics/${client.id}`}
                            className="btn btn-sm btn-outline-primary"
                            title="Ver Analytics"
                          >
                            <Icon icon="solar:chart-2-bold" />
                          </Link>
                          <Link
                            href={`/edit-client/${client.id}`}
                            className="btn btn-sm btn-outline-secondary"
                            title="Editar"
                          >
                            <Icon icon="solar:pen-bold" />
                          </Link>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Remover"
                          >
                            <Icon icon="solar:trash-bin-trash-bold" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientList; 