"use client";
import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from 'next/link';
import LoadingSpinner from './LoadingSpinner';

const AgencyDashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    totalRevenue: 0,
    avgConversionRate: 0,
    totalSpend: 0,
    totalConversions: 0
  });

  const [recentClients, setRecentClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setStats({
        totalClients: 12,
        activeClients: 8,
        totalRevenue: 125000,
        avgConversionRate: 3.2,
        totalSpend: 45000,
        totalConversions: 1250
      });

      setRecentClients([
        {
          id: 1,
          name: "TechCorp Solutions",
          status: "active",
          lastSync: "2024-01-15",
          monthlyBudget: 15000,
          avatar: "assets/images/avatar/avatar-1.png"
        },
        {
          id: 2,
          name: "E-commerce Store",
          status: "active",
          lastSync: "2024-01-14",
          monthlyBudget: 8000,
          avatar: "assets/images/avatar/avatar-2.png"
        },
        {
          id: 3,
          name: "StartupXYZ",
          status: "pending",
          lastSync: null,
          monthlyBudget: 5000,
          avatar: "assets/images/avatar/avatar-3.png"
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

  if (isLoading) {
    return <LoadingSpinner text="Carregando dashboard..." />;
  }

  return (
    <div className="row">
      {/* Cards de Estatísticas */}
      <div className="col-xl-3 col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="w-48-px h-48-px bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center">
                  <Icon icon="solar:users-group-rounded-bold" className="text-primary text-xl" />
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <h4 className="mb-1">{stats.totalClients}</h4>
                <p className="text-muted mb-0">Total de Clientes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-3 col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="w-48-px h-48-px bg-success-subtle rounded-circle d-flex align-items-center justify-content-center">
                  <Icon icon="solar:check-circle-bold" className="text-success text-xl" />
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <h4 className="mb-1">{stats.activeClients}</h4>
                <p className="text-muted mb-0">Clientes Ativos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-3 col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="w-48-px h-48-px bg-warning-subtle rounded-circle d-flex align-items-center justify-content-center">
                  <Icon icon="solar:money-bag-bold" className="text-warning text-xl" />
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <h4 className="mb-1">{formatCurrency(stats.totalRevenue)}</h4>
                <p className="text-muted mb-0">Receita Total</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-3 col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="w-48-px h-48-px bg-info-subtle rounded-circle d-flex align-items-center justify-content-center">
                  <Icon icon="solar:chart-2-bold" className="text-info text-xl" />
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <h4 className="mb-1">{stats.avgConversionRate.toFixed(1)}%</h4>
                <p className="text-muted mb-0">Taxa Média de Conversão</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clientes Recentes */}
      <div className="col-12 mb-4">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Clientes Recentes</h5>
            <Link href="/clients" className="btn btn-primary btn-sm">
              Ver Todos
            </Link>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Status</th>
                    <th>Última Sincronização</th>
                    <th>Orçamento Mensal</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {recentClients.map((client) => (
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
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${client.status === 'active' ? 'bg-success-subtle text-success-main' : 'bg-warning-subtle text-warning-main'}`}>
                          {client.status === 'active' ? 'Ativo' : 'Pendente'}
                        </span>
                      </td>
                      <td>
                        {client.lastSync ? (
                          <span className="text-muted">{client.lastSync}</span>
                        ) : (
                          <span className="text-warning">Não sincronizado</span>
                        )}
                      </td>
                      <td>
                        <span className="fw-semibold">
                          {formatCurrency(client.monthlyBudget)}
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

      {/* Ações Rápidas */}
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Ações Rápidas</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-3 mb-3">
                <Link href="/add-client" className="btn btn-primary w-100">
                  <Icon icon="solar:add-circle-bold" className="me-2" />
                  Adicionar Cliente
                </Link>
              </div>
              <div className="col-md-3 mb-3">
                <Link href="/clients" className="btn btn-outline-primary w-100">
                  <Icon icon="solar:users-group-rounded-bold" className="me-2" />
                  Gerenciar Clientes
                </Link>
              </div>
              <div className="col-md-3 mb-3">
                <button className="btn btn-outline-success w-100">
                  <Icon icon="solar:refresh-bold" className="me-2" />
                  Sincronizar Todos
                </button>
              </div>
              <div className="col-md-3 mb-3">
                <button className="btn btn-outline-info w-100">
                  <Icon icon="solar:chart-2-bold" className="me-2" />
                  Relatório Geral
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyDashboard; 