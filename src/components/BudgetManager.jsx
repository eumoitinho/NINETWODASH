"use client";
import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import LoadingSpinner from './LoadingSpinner';
import Notification from './Notification';

const BudgetManager = () => {
  const [budgets, setBudgets] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setClients([
        {
          id: 1,
          name: "TechCorp Solutions",
          status: "active",
          avatar: "assets/images/avatar/avatar-1.png"
        },
        {
          id: 2,
          name: "E-commerce Store",
          status: "active",
          avatar: "assets/images/avatar/avatar-2.png"
        },
        {
          id: 3,
          name: "StartupXYZ",
          status: "pending",
          avatar: "assets/images/avatar/avatar-3.png"
        },
        {
          id: 4,
          name: "Digital Agency",
          status: "active",
          avatar: "assets/images/avatar/avatar-4.png"
        }
      ]);

      setBudgets([
        {
          id: 1,
          clientId: 1,
          period: "2024-01",
          budget: 15000,
          spent: 12500,
          remaining: 2500,
          status: "active",
          channels: ["Google Ads", "Meta Ads"],
          notes: "Orçamento para campanhas de conversão"
        },
        {
          id: 2,
          clientId: 2,
          period: "2024-01",
          budget: 8000,
          spent: 8000,
          remaining: 0,
          status: "exhausted",
          channels: ["Meta Ads"],
          notes: "Foco em remarketing"
        },
        {
          id: 3,
          clientId: 3,
          period: "2024-01",
          budget: 5000,
          spent: 0,
          remaining: 5000,
          status: "pending",
          channels: ["Google Ads"],
          notes: "Aguardando aprovação"
        },
        {
          id: 4,
          clientId: 4,
          period: "2024-01",
          budget: 25000,
          spent: 22000,
          remaining: 3000,
          status: "active",
          channels: ["Google Ads", "Meta Ads", "TikTok Ads"],
          notes: "Campanha multichannel"
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

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: "bg-success-subtle text-success-main",
      exhausted: "bg-danger-subtle text-danger-main",
      pending: "bg-warning-subtle text-warning-main",
      inactive: "bg-secondary-subtle text-secondary-main"
    };
    
    const statusLabels = {
      active: "Ativo",
      exhausted: "Esgotado",
      pending: "Pendente",
      inactive: "Inativo"
    };

    return (
      <span className={`badge ${statusClasses[status] || statusClasses.inactive}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const getProgressPercentage = (spent, budget) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  const handleAddBudget = () => {
    // Implementar adição de orçamento
    setNotification({
      type: 'info',
      title: 'Funcionalidade',
      message: 'Funcionalidade de adicionar orçamento será implementada'
    });
  };

  const handleEditBudget = (budgetId) => {
    // Implementar edição de orçamento
    setNotification({
      type: 'info',
      title: 'Funcionalidade',
      message: 'Funcionalidade de editar orçamento será implementada'
    });
  };

  if (isLoading) {
    return <LoadingSpinner text="Carregando orçamentos..." />;
  }

  return (
    <div className="row">
      {notification && (
        <div className="col-12 mb-3">
          <Notification
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        </div>
      )}

      {/* Filtros e Controles */}
      <div className="col-12 mb-4">
        <div className="card">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-6 mb-3 mb-md-0">
                <h6 className="mb-0">Gerenciar Orçamentos</h6>
              </div>
              <div className="col-md-3 mb-3 mb-md-0">
                <select
                  className="form-select"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="current">Período Atual</option>
                  <option value="previous">Período Anterior</option>
                  <option value="next">Próximo Período</option>
                </select>
              </div>
              <div className="col-md-3">
                <button
                  className="btn btn-primary w-100"
                  onClick={handleAddBudget}
                >
                  <Icon icon="solar:add-circle-bold" className="me-2" />
                  Adicionar Orçamento
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo Geral */}
      <div className="col-12 mb-4">
        <div className="row">
          <div className="col-md-3 mb-3">
            <div className="card">
              <div className="card-body text-center">
                <h4 className="text-primary mb-1">
                  {formatCurrency(budgets.reduce((sum, budget) => sum + budget.budget, 0))}
                </h4>
                <small className="text-muted">Orçamento Total</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card">
              <div className="card-body text-center">
                <h4 className="text-warning mb-1">
                  {formatCurrency(budgets.reduce((sum, budget) => sum + budget.spent, 0))}
                </h4>
                <small className="text-muted">Gasto Total</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card">
              <div className="card-body text-center">
                <h4 className="text-success mb-1">
                  {formatCurrency(budgets.reduce((sum, budget) => sum + budget.remaining, 0))}
                </h4>
                <small className="text-muted">Restante Total</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card">
              <div className="card-body text-center">
                <h4 className="text-info mb-1">
                  {budgets.filter(b => b.status === 'active').length}
                </h4>
                <small className="text-muted">Orçamentos Ativos</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Orçamentos */}
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">Orçamentos por Cliente</h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Período</th>
                    <th>Orçamento</th>
                    <th>Gasto</th>
                    <th>Restante</th>
                    <th>Progresso</th>
                    <th>Status</th>
                    <th>Canais</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {budgets.map((budget) => {
                    const client = clients.find(c => c.id === budget.clientId);
                    const progressPercentage = getProgressPercentage(budget.spent, budget.budget);
                    const progressColor = getProgressColor(progressPercentage);

                    return (
                      <tr key={budget.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={client?.avatar}
                              alt={client?.name}
                              className="rounded-circle me-3"
                              width="40"
                              height="40"
                            />
                            <div>
                              <h6 className="mb-0">{client?.name}</h6>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-muted">{budget.period}</span>
                        </td>
                        <td>
                          <span className="fw-semibold">{formatCurrency(budget.budget)}</span>
                        </td>
                        <td>
                          <span className="text-warning">{formatCurrency(budget.spent)}</span>
                        </td>
                        <td>
                          <span className="text-success">{formatCurrency(budget.remaining)}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                              <div
                                className={`progress-bar bg-${progressColor}`}
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                            <small className="text-muted">{progressPercentage.toFixed(1)}%</small>
                          </div>
                        </td>
                        <td>
                          {getStatusBadge(budget.status)}
                        </td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            {budget.channels.map((channel, index) => (
                              <span key={index} className="badge bg-light text-dark">
                                {channel}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm" role="group">
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => handleEditBudget(budget.id)}
                              title="Editar Orçamento"
                            >
                              <Icon icon="solar:pen-bold" />
                            </button>
                            <button
                              className="btn btn-outline-info"
                              title="Ver Detalhes"
                            >
                              <Icon icon="solar:eye-bold" />
                            </button>
                            <button
                              className="btn btn-outline-success"
                              title="Relatórios"
                            >
                              <Icon icon="solar:chart-2-bold" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos de Orçamento */}
      <div className="col-12 mt-4">
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">Análise de Orçamentos</h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <h6 className="mb-3">Distribuição por Status</h6>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Ativos</span>
                    <span className="badge bg-success-subtle text-success-main">
                      {budgets.filter(b => b.status === 'active').length}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Esgotados</span>
                    <span className="badge bg-danger-subtle text-danger-main">
                      {budgets.filter(b => b.status === 'exhausted').length}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Pendentes</span>
                    <span className="badge bg-warning-subtle text-warning-main">
                      {budgets.filter(b => b.status === 'pending').length}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <h6 className="mb-3">Resumo Financeiro</h6>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between">
                    <span>Orçamento Total:</span>
                    <span className="fw-semibold">
                      {formatCurrency(budgets.reduce((sum, b) => sum + b.budget, 0))}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Gasto Total:</span>
                    <span className="fw-semibold text-warning">
                      {formatCurrency(budgets.reduce((sum, b) => sum + b.spent, 0))}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Restante Total:</span>
                    <span className="fw-semibold text-success">
                      {formatCurrency(budgets.reduce((sum, b) => sum + b.remaining, 0))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetManager; 