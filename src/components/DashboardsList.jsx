"use client";
import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from 'next/link';
import LoadingSpinner from './LoadingSpinner';

const DashboardsList = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setClients([
        {
          id: 1,
          name: "ABC EVO",
          status: "active",
          ga4Connected: true,
          metaConnected: true,
          lastSync: "2024-01-15",
          monthlyBudget: 25000,
          avatar: "assets/images/avatar/avatar-1.png",
          tags: ["Tecnologia", "Premium"],
          recentMetrics: {
            sessions: 18420,
            conversions: 234,
            revenue: 189000,
            spend: 22000
          }
        },
        {
          id: 2,
          name: "Dr. Victor Mauro",
          status: "active",
          ga4Connected: true,
          metaConnected: false,
          lastSync: "2024-01-14",
          monthlyBudget: 18000,
          avatar: "assets/images/avatar/avatar-2.png",
          tags: ["Saúde", "Médico"],
          recentMetrics: {
            sessions: 12340,
            conversions: 156,
            revenue: 145000,
            spend: 16500
          }
        },
        {
          id: 3,
          name: "Dr. Percio",
          status: "active",
          ga4Connected: false,
          metaConnected: true,
          lastSync: "2024-01-13",
          monthlyBudget: 12000,
          avatar: "assets/images/avatar/avatar-3.png",
          tags: ["Saúde", "Médico"],
          recentMetrics: {
            sessions: 8900,
            conversions: 89,
            revenue: 98000,
            spend: 11000
          }
        },
        {
          id: 4,
          name: "CWTremds",
          status: "active",
          ga4Connected: true,
          metaConnected: true,
          lastSync: "2024-01-15",
          monthlyBudget: 30000,
          avatar: "assets/images/avatar/avatar-4.png",
          tags: ["Tecnologia", "Premium"],
          recentMetrics: {
            sessions: 23400,
            conversions: 289,
            revenue: 245000,
            spend: 28000
          }
        },
        {
          id: 5,
          name: "Global Best Part",
          status: "active",
          ga4Connected: true,
          metaConnected: true,
          lastSync: "2024-01-14",
          monthlyBudget: 22000,
          avatar: "assets/images/avatar/avatar-1.png",
          tags: ["Comércio", "Standard"],
          recentMetrics: {
            sessions: 15600,
            conversions: 178,
            revenue: 189000,
            spend: 20000
          }
        },
        {
          id: 6,
          name: "LJ Santos",
          status: "active",
          ga4Connected: false,
          metaConnected: true,
          lastSync: "2024-01-12",
          monthlyBudget: 15000,
          avatar: "assets/images/avatar/avatar-2.png",
          tags: ["Serviços", "Standard"],
          recentMetrics: {
            sessions: 11200,
            conversions: 134,
            revenue: 125000,
            spend: 14000
          }
        },
        {
          id: 7,
          name: "Favretto Mídia Exterior",
          status: "active",
          ga4Connected: true,
          metaConnected: true,
          lastSync: "2024-01-15",
          monthlyBudget: 35000,
          avatar: "assets/images/avatar/avatar-3.png",
          tags: ["Publicidade", "Premium"],
          recentMetrics: {
            sessions: 28900,
            conversions: 345,
            revenue: 320000,
            spend: 32000
          }
        },
        {
          id: 8,
          name: "Favretto Comunicação Visual",
          status: "active",
          ga4Connected: true,
          metaConnected: false,
          lastSync: "2024-01-14",
          monthlyBudget: 28000,
          avatar: "assets/images/avatar/avatar-4.png",
          tags: ["Publicidade", "Standard"],
          recentMetrics: {
            sessions: 19800,
            conversions: 223,
            revenue: 245000,
            spend: 26000
          }
        },
        {
          id: 9,
          name: "Mundial",
          status: "active",
          ga4Connected: true,
          metaConnected: true,
          lastSync: "2024-01-15",
          monthlyBudget: 40000,
          avatar: "assets/images/avatar/avatar-1.png",
          tags: ["Comércio", "Premium"],
          recentMetrics: {
            sessions: 34500,
            conversions: 412,
            revenue: 389000,
            spend: 38000
          }
        },
        {
          id: 10,
          name: "Naframe",
          status: "active",
          ga4Connected: false,
          metaConnected: true,
          lastSync: "2024-01-13",
          monthlyBudget: 16000,
          avatar: "assets/images/avatar/avatar-2.png",
          tags: ["Indústria", "Standard"],
          recentMetrics: {
            sessions: 13400,
            conversions: 167,
            revenue: 145000,
            spend: 15000
          }
        },
        {
          id: 11,
          name: "Motin Films",
          status: "active",
          ga4Connected: true,
          metaConnected: true,
          lastSync: "2024-01-15",
          monthlyBudget: 32000,
          avatar: "assets/images/avatar/avatar-3.png",
          tags: ["Entretenimento", "Premium"],
          recentMetrics: {
            sessions: 26700,
            conversions: 312,
            revenue: 298000,
            spend: 30000
          }
        },
        {
          id: 12,
          name: "Naport",
          status: "active",
          ga4Connected: true,
          metaConnected: false,
          lastSync: "2024-01-14",
          monthlyBudget: 19000,
          avatar: "assets/images/avatar/avatar-4.png",
          tags: ["Tecnologia", "Standard"],
          recentMetrics: {
            sessions: 14500,
            conversions: 178,
            revenue: 167000,
            spend: 18000
          }
        },
        {
          id: 13,
          name: "Autoconnect Prime",
          status: "active",
          ga4Connected: true,
          metaConnected: true,
          lastSync: "2024-01-15",
          monthlyBudget: 45000,
          avatar: "assets/images/avatar/avatar-1.png",
          tags: ["Tecnologia", "Premium"],
          recentMetrics: {
            sessions: 38900,
            conversions: 456,
            revenue: 445000,
            spend: 42000
          }
        },
        {
          id: 14,
          name: "Vtelco Networks",
          status: "active",
          ga4Connected: true,
          metaConnected: true,
          lastSync: "2024-01-15",
          monthlyBudget: 38000,
          avatar: "assets/images/avatar/avatar-2.png",
          tags: ["Telecomunicações", "Premium"],
          recentMetrics: {
            sessions: 32300,
            conversions: 378,
            revenue: 356000,
            spend: 36000
          }
        },
        {
          id: 15,
          name: "Amitech",
          status: "active",
          ga4Connected: false,
          metaConnected: true,
          lastSync: "2024-01-12",
          monthlyBudget: 14000,
          avatar: "assets/images/avatar/avatar-3.png",
          tags: ["Tecnologia", "Standard"],
          recentMetrics: {
            sessions: 11200,
            conversions: 134,
            revenue: 123000,
            spend: 13000
          }
        },
        {
          id: 16,
          name: "Catalisti Holding",
          status: "active",
          ga4Connected: true,
          metaConnected: true,
          lastSync: "2024-01-15",
          monthlyBudget: 50000,
          avatar: "assets/images/avatar/avatar-4.png",
          tags: ["Holding", "Premium"],
          recentMetrics: {
            sessions: 45600,
            conversions: 534,
            revenue: 512000,
            spend: 48000
          }
        },
        {
          id: 17,
          name: "Hogrefe Construtora",
          status: "active",
          ga4Connected: true,
          metaConnected: false,
          lastSync: "2024-01-14",
          monthlyBudget: 26000,
          avatar: "assets/images/avatar/avatar-1.png",
          tags: ["Construção", "Standard"],
          recentMetrics: {
            sessions: 18900,
            conversions: 223,
            revenue: 234000,
            spend: 24000
          }
        },
        {
          id: 18,
          name: "Colaço Engenharia",
          status: "active",
          ga4Connected: true,
          metaConnected: true,
          lastSync: "2024-01-15",
          monthlyBudget: 42000,
          avatar: "assets/images/avatar/avatar-2.png",
          tags: ["Engenharia", "Premium"],
          recentMetrics: {
            sessions: 37800,
            conversions: 445,
            revenue: 423000,
            spend: 40000
          }
        },
        {
          id: 19,
          name: "Pesados Web",
          status: "active",
          ga4Connected: false,
          metaConnected: true,
          lastSync: "2024-01-13",
          monthlyBudget: 11000,
          avatar: "assets/images/avatar/avatar-3.png",
          tags: ["Web", "Standard"],
          recentMetrics: {
            sessions: 8900,
            conversions: 98,
            revenue: 89000,
            spend: 10000
          }
        },
        {
          id: 20,
          name: "Eleva Corpo e Alma",
          status: "active",
          ga4Connected: true,
          metaConnected: true,
          lastSync: "2024-01-15",
          monthlyBudget: 24000,
          avatar: "assets/images/avatar/avatar-4.png",
          tags: ["Bem-estar", "Standard"],
          recentMetrics: {
            sessions: 20100,
            conversions: 234,
            revenue: 223000,
            spend: 22000
          }
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(num);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: "bg-success-subtle text-success-main",
      pending: "bg-warning-subtle text-warning-main",
      inactive: "bg-danger-subtle text-danger-main"
    };
    return (
      <span className={`badge ${statusClasses[status] || statusClasses.inactive}`}>
        {status === 'active' ? 'Ativo' : status === 'pending' ? 'Pendente' : 'Inativo'}
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

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <LoadingSpinner text="Carregando dashboards..." />;
  }

  return (
    <div className="row">
      {/* Filtros */}
      <div className="col-12 mb-4">
        <div className="card">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-6 mb-3 mb-md-0">
                <div className="input-group">
                  <span className="input-group-text">
                    <Icon icon="solar:magnifer-bold" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3 mb-3 mb-md-0">
                <select
                  className="form-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Todos os Status</option>
                  <option value="active">Ativos</option>
                  <option value="pending">Pendentes</option>
                  <option value="inactive">Inativos</option>
                </select>
              </div>
              <div className="col-md-3">
                <div className="d-flex justify-content-end">
                  <span className="text-muted">
                    {filteredClients.length} de {clients.length} clientes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Dashboards */}
      <div className="col-12">
        <div className="row">
          {filteredClients.map((client) => (
            <div key={client.id} className="col-lg-6 col-xl-4 mb-4">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
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
                      <small className="text-muted">{formatCurrency(client.monthlyBudget)}/mês</small>
                    </div>
                  </div>
                  {getStatusBadge(client.status)}
                </div>
                
                <div className="card-body">
                  {/* Tags */}
                  <div className="mb-3">
                    {client.tags.map((tag, index) => (
                      <span key={index} className="badge bg-primary-subtle text-primary-main me-1 mb-1">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Métricas Rápidas */}
                  <div className="row text-center mb-3">
                    <div className="col-6">
                      <div className="border-end">
                        <h6 className="text-primary mb-1">{formatNumber(client.recentMetrics.sessions)}</h6>
                        <small className="text-muted">Sessões</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <h6 className="text-success mb-1">{formatNumber(client.recentMetrics.conversions)}</h6>
                      <small className="text-muted">Conversões</small>
                    </div>
                  </div>

                  <div className="row text-center mb-3">
                    <div className="col-6">
                      <div className="border-end">
                        <h6 className="text-info mb-1">{formatCurrency(client.recentMetrics.revenue)}</h6>
                        <small className="text-muted">Receita</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <h6 className="text-warning mb-1">{formatCurrency(client.recentMetrics.spend)}</h6>
                      <small className="text-muted">Gasto</small>
                    </div>
                  </div>

                  {/* Status de Conexão */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <Icon icon="logos:google-analytics" className="me-2" />
                      {getConnectionStatus(client.ga4Connected)}
                    </div>
                    <div className="d-flex align-items-center">
                      <Icon icon="logos:facebook" className="me-2" />
                      {getConnectionStatus(client.metaConnected)}
                    </div>
                  </div>

                  {/* Última Sincronização */}
                  <div className="mb-3">
                    <small className="text-muted">
                      Última sincronização: {client.lastSync || 'Nunca sincronizado'}
                    </small>
                  </div>

                  {/* Ações */}
                  <div className="d-grid gap-2">
                    <Link
                  href={`/client-analytics/${client.id}`}
                  className="btn btn-primary btn-sm"
                >
                  <Icon icon="solar:chart-2-bold" className="me-2" />
                  Ver Dashboard
                </Link>
                    <div className="btn-group btn-group-sm" role="group">
                      <Link
                        href={`/edit-client/${client.id}`}
                        className="btn btn-outline-secondary"
                        title="Editar Cliente"
                      >
                        <Icon icon="solar:pen-bold" />
                      </Link>
                      <button
                        className="btn btn-outline-success"
                        title="Sincronizar Dados"
                      >
                        <Icon icon="solar:refresh-bold" />
                      </button>
                      <button
                        className="btn btn-outline-info"
                        title="Relatórios"
                      >
                        <Icon icon="solar:document-bold" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mensagem quando não há resultados */}
      {filteredClients.length === 0 && (
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center py-5">
              <Icon icon="solar:search-bold" className="text-muted text-4xl mb-3" />
              <h5 className="text-muted">Nenhum cliente encontrado</h5>
              <p className="text-muted">Tente ajustar os filtros de busca</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardsList; 