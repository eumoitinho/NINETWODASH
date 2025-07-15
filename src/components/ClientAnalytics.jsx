"use client";
import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from 'next/link';
import LoadingSpinner from './LoadingSpinner';
import dynamic from 'next/dynamic';
import ClientCharts from './child/ClientCharts';

// Importar componentes de chart dinamicamente para evitar problemas de SSR
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ClientAnalytics = ({ clientId }) => {
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    // Simular carregamento de dados do cliente
    setClient({
      id: clientId,
      name: "TechCorp Solutions",
      email: "contato@techcorp.com",
      status: "active",
      ga4Connected: true,
      metaConnected: true,
      lastSync: "2024-01-15",
      monthlyBudget: 15000
    });

    // Simular carregamento de dados
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [clientId]);

  // Configurações do gráfico de receita
  const revenueChartOptions = {
    chart: {
      type: 'area',
      height: 200,
      toolbar: {
        show: false
      }
    },
    colors: ['#3B82F6', '#8B5CF6'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    xaxis: {
      categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return 'R$ ' + val.toFixed(0);
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return 'R$ ' + val.toFixed(0);
        }
      }
    }
  };

  const revenueChartSeries = [
    {
      name: 'Receita GA4',
      data: [21000, 22000, 24000, 26000, 28000, 30000, 32000, 31000, 33000, 35000, 37000, 39000]
    },
    {
      name: 'Gasto Meta Ads',
      data: [15000, 16000, 17000, 18000, 19000, 20000, 21000, 20000, 22000, 24000, 26000, 28000]
    }
  ];

  // Configurações do gráfico de métricas
  const metricsChartOptions = {
    chart: {
      type: 'donut',
      height: 200
    },
    colors: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
    labels: ['Sessões', 'Usuários', 'Visualizações', 'Conversões'],
    plotOptions: {
      pie: {
        donut: {
          size: '70%'
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'bottom'
    }
  };

  const metricsChartSeries = [15420, 12340, 45670, 2800];

  // Configurações do gráfico de vendas diárias
  const dailySalesChartOptions = {
    chart: {
      type: 'line',
      height: 200,
      toolbar: {
        show: false
      }
    },
    colors: ['#10B981'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return 'R$ ' + val.toFixed(0);
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return 'R$ ' + val.toFixed(0);
        }
      }
    }
  };

  const dailySalesChartSeries = [
    {
      name: 'Vendas Diárias',
      data: [2500, 2800, 3200, 2900, 3100, 3400, 3000]
    }
  ];

  if (isLoading) {
    return <LoadingSpinner text="Carregando dashboard..." />;
  }

  return (
    <div className="row">
      {/* Header do Cliente */}
      <div className="col-12 mb-4">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-1">{client?.name}</h4>
                <p className="text-muted mb-0">{client?.email}</p>
              </div>
              <div className="d-flex gap-2">
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedPeriod === '7d' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSelectedPeriod('7d')}
                  >
                    7 dias
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedPeriod === '30d' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSelectedPeriod('30d')}
                  >
                    30 dias
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedPeriod === '90d' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setSelectedPeriod('90d')}
                  >
                    90 dias
                  </button>
                </div>
                <button className="btn btn-outline-primary btn-sm">
                  <Icon icon="solar:refresh-bold" className="me-2" />
                  Sincronizar
                </button>
                <Link href={`/edit-client/${clientId}`} className="btn btn-outline-secondary btn-sm">
                  <Icon icon="solar:pen-bold" className="me-2" />
                  Editar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Components com Charts */}
      <div className="col-12">
        <div className='row gy-4'>
          {/* Status do Cliente */}
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Status do Cliente</h6>
                    <p className="text-muted mb-0">Última sincronização: {client?.lastSync}</p>
                  </div>
                  <div className="d-flex gap-2">
                    <span className={`badge ${client?.ga4Connected ? 'bg-success-subtle text-success-main' : 'bg-danger-subtle text-danger-main'}`}>
                      <Icon icon="logos:google-analytics" className="me-1" />
                      GA4 {client?.ga4Connected ? 'Conectado' : 'Desconectado'}
                    </span>
                    <span className={`badge ${client?.metaConnected ? 'bg-success-subtle text-success-main' : 'bg-danger-subtle text-danger-main'}`}>
                      <Icon icon="logos:facebook" className="me-1" />
                      Meta {client?.metaConnected ? 'Conectado' : 'Desconectado'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de Receita */}
          <div className="col-xxl-8">
            <div className="card h-100">
              <div className="card-body p-24">
                <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-4">
                  <h6 className="mb-2 fw-bold text-lg mb-0">Receita e Gastos</h6>
                  <select className="form-select form-select-sm w-auto bg-base border text-secondary-light">
                    <option>Últimos 12 meses</option>
                    <option>Últimos 6 meses</option>
                    <option>Últimos 3 meses</option>
                  </select>
                </div>
                <div className="mb-4">
                  <ul className="d-flex flex-wrap align-items-center justify-content-start gap-4">
                    <li className="d-flex align-items-center gap-2">
                      <span className="w-8-px h-8-px rounded-pill bg-primary-600" />
                      <span className="text-secondary-light text-sm fw-semibold">
                        Receita GA4
                      </span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <span className="w-8-px h-8-px rounded-pill bg-lilac-600" />
                      <span className="text-secondary-light text-sm fw-semibold">
                        Gasto Meta Ads
                      </span>
                    </li>
                  </ul>
                </div>
                <Chart
                  options={revenueChartOptions}
                  series={revenueChartSeries}
                  type="area"
                  height={300}
                />
              </div>
            </div>
          </div>

          {/* Gráfico de Métricas */}
          <div className="col-xxl-4">
            <div className="card h-100">
              <div className="card-body p-24">
                <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-4">
                  <h6 className="mb-2 fw-bold text-lg mb-0">Distribuição de Métricas</h6>
                  <div className="d-flex gap-2">
                    <span className="badge bg-success-subtle text-success-main">Ativo</span>
                  </div>
                </div>
                <Chart
                  options={metricsChartOptions}
                  series={metricsChartSeries}
                  type="donut"
                  height={250}
                />
                <div className="row mt-3">
                  <div className="col-6 text-center">
                    <h6 className="text-primary mb-1">15.420</h6>
                    <small className="text-muted">Sessões</small>
                  </div>
                  <div className="col-6 text-center">
                    <h6 className="text-success mb-1">12.340</h6>
                    <small className="text-muted">Usuários</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de Vendas Diárias */}
          <div className="col-xxl-6">
            <div className="card h-100">
              <div className="card-body p-24">
                <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-4">
                  <h6 className="mb-2 fw-bold text-lg mb-0">Vendas Diárias</h6>
                  <select className="form-select form-select-sm w-auto bg-base border text-secondary-light">
                    <option>Últimos 7 dias</option>
                    <option>Últimos 30 dias</option>
                  </select>
                </div>
                <Chart
                  options={dailySalesChartOptions}
                  series={dailySalesChartSeries}
                  type="line"
                  height={250}
                />
                <div className="text-center mt-3">
                  <h4 className="text-primary mb-1">R$ 2.847</h4>
                  <p className="text-muted mb-0">Média diária de vendas</p>
                  <span className="text-success-600 d-flex align-items-center justify-content-center gap-1 text-sm fw-bolder">
                    12% <i className="ri-arrow-up-s-fill d-flex" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Transações Recentes */}
          <div className="col-xxl-6">
            <div className="card h-100">
              <div className="card-body p-24">
                <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-4">
                  <h6 className="mb-2 fw-bold text-lg mb-0">Transações Recentes</h6>
                  <Link href="#" className="text-primary-600 fw-semibold text-sm">
                    Ver todas
                  </Link>
                </div>
                <div className="space-y-3">
                  <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                    <div>
                      <h6 className="mb-1">Venda #1234</h6>
                      <small className="text-muted">2 horas atrás</small>
                    </div>
                    <div className="text-end">
                      <h6 className="text-success mb-1">R$ 1.250</h6>
                      <span className="badge bg-success-subtle text-success-main">Concluída</span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                    <div>
                      <h6 className="mb-1">Venda #1233</h6>
                      <small className="text-muted">4 horas atrás</small>
                    </div>
                    <div className="text-end">
                      <h6 className="text-success mb-1">R$ 890</h6>
                      <span className="badge bg-success-subtle text-success-main">Concluída</span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                    <div>
                      <h6 className="mb-1">Venda #1232</h6>
                      <small className="text-muted">6 horas atrás</small>
                    </div>
                    <div className="text-end">
                      <h6 className="text-success mb-1">R$ 2.100</h6>
                      <span className="badge bg-success-subtle text-success-main">Concluída</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Métricas Adicionais */}
          <div className="col-12">
            <div className="row">
              <div className="col-md-3 mb-3">
                <div className="card text-center">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <Icon icon="solar:users-group-rounded-bold" className="text-primary text-2xl" />
                    </div>
                    <h4 className="text-primary mb-1">45.2K</h4>
                    <p className="text-muted mb-0">Usuários Únicos</p>
                    <small className="text-success">+12.5% vs mês anterior</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card text-center">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <Icon icon="solar:eye-bold" className="text-success text-2xl" />
                    </div>
                    <h4 className="text-success mb-1">128.7K</h4>
                    <p className="text-muted mb-0">Visualizações</p>
                    <small className="text-success">+8.3% vs mês anterior</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card text-center">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <Icon icon="solar:mouse-bold" className="text-warning text-2xl" />
                    </div>
                    <h4 className="text-warning mb-1">2.8%</h4>
                    <p className="text-muted mb-0">Taxa de Conversão</p>
                    <small className="text-success">+0.5% vs mês anterior</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card text-center">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <Icon icon="solar:money-bag-bold" className="text-info text-2xl" />
                    </div>
                    <h4 className="text-info mb-1">R$ 15.2K</h4>
                    <p className="text-muted mb-0">ROAS</p>
                    <small className="text-success">+15.2% vs mês anterior</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Adicionais */}
          <div className="col-12">
            <ClientCharts clientData={client} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientAnalytics; 