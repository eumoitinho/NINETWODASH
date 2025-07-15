"use client";
import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import Notification from './Notification';

const AddEditClient = ({ clientId = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    monthlyBudget: '',
    status: 'pending',
    tags: '',
    ga4PropertyId: '',
    ga4ViewId: '',
    metaAdAccountId: '',
    metaPixelId: '',
    notes: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing] = useState(!!clientId);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (clientId) {
      // Carregar dados do cliente para edição
      // Aqui você faria uma chamada API
      setFormData({
        name: 'TechCorp Solutions',
        email: 'contato@techcorp.com',
        phone: '(11) 99999-9999',
        company: 'TechCorp Solutions Ltda',
        website: 'https://techcorp.com',
        monthlyBudget: '15000',
        status: 'active',
        tags: 'E-commerce, Premium',
        ga4PropertyId: 'GA4_PROPERTY_ID',
        ga4ViewId: 'GA4_VIEW_ID',
        metaAdAccountId: 'META_AD_ACCOUNT_ID',
        metaPixelId: 'META_PIXEL_ID',
        notes: 'Cliente ativo com campanhas em andamento'
      });
    }
  }, [clientId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Aqui você faria a chamada API para salvar
      console.log('Dados do cliente:', formData);
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setNotification({
        type: 'success',
        title: 'Sucesso!',
        message: isEditing ? 'Cliente atualizado com sucesso!' : 'Cliente adicionado com sucesso!'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        title: 'Erro!',
        message: 'Erro ao salvar cliente'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async (platform) => {
    setIsLoading(true);
    try {
      // Simular teste de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      setNotification({
        type: 'success',
        title: 'Conexão Testada!',
        message: `Conexão com ${platform} testada com sucesso!`
      });
    } catch (error) {
      setNotification({
        type: 'error',
        title: 'Erro de Conexão!',
        message: `Erro ao conectar com ${platform}`
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">
              {isEditing ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Informações Básicas */}
                <div className="col-md-6">
                  <h6 className="mb-3">Informações Básicas</h6>
                  
                  <div className="mb-3">
                    <label className="form-label">Nome do Cliente *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Telefone</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Empresa</label>
                    <input
                      type="text"
                      className="form-control"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Website</label>
                    <input
                      type="url"
                      className="form-control"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://exemplo.com"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Orçamento Mensal (R$)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="monthlyBudget"
                      value={formData.monthlyBudget}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="pending">Pendente</option>
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Tags</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="E-commerce, Premium, Startup (separadas por vírgula)"
                    />
                    <small className="text-muted">Separe as tags por vírgula</small>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Orçamento Mensal (R$)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="monthlyBudget"
                      value={formData.monthlyBudget}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Configurações de API */}
                <div className="col-md-6">
                  <h6 className="mb-3">Configurações de API</h6>
                  
                  {/* Google Analytics 4 */}
                  <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <h6 className="mb-0">
                        <Icon icon="logos:google-analytics" className="me-2" />
                        Google Analytics 4
                      </h6>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => testConnection('Google Analytics 4')}
                        disabled={isLoading}
                      >
                        <Icon icon="solar:refresh-bold" className="me-1" />
                        Testar
                      </button>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Property ID</label>
                      <input
                        type="text"
                        className="form-control"
                        name="ga4PropertyId"
                        value={formData.ga4PropertyId}
                        onChange={handleInputChange}
                        placeholder="123456789"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">View ID</label>
                      <input
                        type="text"
                        className="form-control"
                        name="ga4ViewId"
                        value={formData.ga4ViewId}
                        onChange={handleInputChange}
                        placeholder="123456789"
                      />
                    </div>
                  </div>

                  {/* Meta Ads */}
                  <div className="mb-4">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <h6 className="mb-0">
                        <Icon icon="logos:facebook" className="me-2" />
                        Meta Ads
                      </h6>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => testConnection('Meta Ads')}
                        disabled={isLoading}
                      >
                        <Icon icon="solar:refresh-bold" className="me-1" />
                        Testar
                      </button>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Ad Account ID</label>
                      <input
                        type="text"
                        className="form-control"
                        name="metaAdAccountId"
                        value={formData.metaAdAccountId}
                        onChange={handleInputChange}
                        placeholder="act_123456789"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Pixel ID</label>
                      <input
                        type="text"
                        className="form-control"
                        name="metaPixelId"
                        value={formData.metaPixelId}
                        onChange={handleInputChange}
                        placeholder="123456789"
                      />
                    </div>
                  </div>

                  {/* Observações */}
                  <div className="mb-3">
                    <label className="form-label">Observações</label>
                    <textarea
                      className="form-control"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Observações sobre o cliente..."
                    />
                  </div>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-12">
                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Icon icon="solar:loading-bold" className="me-2" spin />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Icon icon="solar:check-circle-bold" className="me-2" />
                          {isEditing ? 'Atualizar Cliente' : 'Adicionar Cliente'}
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => window.history.back()}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditClient; 