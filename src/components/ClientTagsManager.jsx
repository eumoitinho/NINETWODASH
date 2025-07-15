"use client";
import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import LoadingSpinner from './LoadingSpinner';
import Notification from './Notification';

const ClientTagsManager = () => {
  const [tags, setTags] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTag, setNewTag] = useState('');
  const [editingTag, setEditingTag] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setTags([
        { id: 1, name: 'E-commerce', color: 'primary', count: 3 },
        { id: 2, name: 'Premium', color: 'success', count: 2 },
        { id: 3, name: 'Startup', color: 'warning', count: 1 },
        { id: 4, name: 'Agency', color: 'info', count: 1 },
        { id: 5, name: 'Standard', color: 'secondary', count: 1 },
        { id: 6, name: 'New', color: 'danger', count: 1 }
      ]);

      setClients([
        {
          id: 1,
          name: "TechCorp Solutions",
          tags: ["E-commerce", "Premium"],
          status: "active"
        },
        {
          id: 2,
          name: "E-commerce Store",
          tags: ["E-commerce", "Standard"],
          status: "active"
        },
        {
          id: 3,
          name: "StartupXYZ",
          tags: ["Startup", "New"],
          status: "pending"
        },
        {
          id: 4,
          name: "Digital Agency",
          tags: ["Agency", "Premium"],
          status: "active"
        }
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  const getColorClass = (color) => {
    const colorClasses = {
      primary: 'bg-primary-subtle text-primary-main',
      success: 'bg-success-subtle text-success-main',
      warning: 'bg-warning-subtle text-warning-main',
      info: 'bg-info-subtle text-info-main',
      secondary: 'bg-secondary-subtle text-secondary-main',
      danger: 'bg-danger-subtle text-danger-main'
    };
    return colorClasses[color] || colorClasses.primary;
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;

    const tag = {
      id: Date.now(),
      name: newTag.trim(),
      color: 'primary',
      count: 0
    };

    setTags([...tags, tag]);
    setNewTag('');
    setNotification({
      type: 'success',
      title: 'Tag Adicionada!',
      message: `Tag "${tag.name}" foi criada com sucesso!`
    });
  };

  const handleEditTag = (tag) => {
    setEditingTag(tag);
  };

  const handleSaveEdit = () => {
    if (!editingTag.name.trim()) return;

    setTags(tags.map(tag => 
      tag.id === editingTag.id ? editingTag : tag
    ));
    setEditingTag(null);
    setNotification({
      type: 'success',
      title: 'Tag Atualizada!',
      message: `Tag foi atualizada com sucesso!`
    });
  };

  const handleDeleteTag = (tagId) => {
    if (window.confirm('Tem certeza que deseja excluir esta tag?')) {
      setTags(tags.filter(tag => tag.id !== tagId));
      setNotification({
        type: 'success',
        title: 'Tag Excluída!',
        message: 'Tag foi excluída com sucesso!'
      });
    }
  };

  const handleAssignTag = (clientId, tagName) => {
    setClients(clients.map(client => {
      if (client.id === clientId) {
        const newTags = client.tags.includes(tagName) 
          ? client.tags.filter(tag => tag !== tagName)
          : [...client.tags, tagName];
        return { ...client, tags: newTags };
      }
      return client;
    }));

    // Atualizar contagem das tags
    setTags(tags.map(tag => ({
      ...tag,
      count: clients.filter(client => client.tags.includes(tag.name)).length
    })));
  };

  if (isLoading) {
    return <LoadingSpinner text="Carregando gerenciador de tags..." />;
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

      {/* Gerenciar Tags */}
      <div className="col-md-4 mb-4">
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">Gerenciar Tags</h6>
          </div>
          <div className="card-body">
            {/* Adicionar Nova Tag */}
            <div className="mb-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nova tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                >
                  <Icon icon="solar:add-circle-bold" />
                </button>
              </div>
            </div>

            {/* Lista de Tags */}
            <div className="mb-3">
              <h6 className="mb-2">Tags Existentes</h6>
              {tags.map((tag) => (
                <div key={tag.id} className="d-flex align-items-center justify-content-between mb-2 p-2 border rounded">
                  <div className="d-flex align-items-center">
                    <span className={`badge ${getColorClass(tag.color)} me-2`}>
                      {tag.name}
                    </span>
                    <small className="text-muted">({tag.count} clientes)</small>
                  </div>
                  <div className="btn-group btn-group-sm">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleEditTag(tag)}
                      title="Editar"
                    >
                      <Icon icon="solar:pen-bold" />
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteTag(tag.id)}
                      title="Excluir"
                    >
                      <Icon icon="solar:trash-bin-trash-bold" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Atribuir Tags aos Clientes */}
      <div className="col-md-8 mb-4">
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">Atribuir Tags aos Clientes</h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Status</th>
                    <th>Tags Atuais</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={`assets/images/avatar/avatar-${client.id}.png`}
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
                        <div className="d-flex flex-wrap gap-1">
                          {client.tags.map((tag, index) => (
                            <span key={index} className="badge bg-primary-subtle text-primary-main">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-outline-primary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            <Icon icon="solar:tag-price-bold" className="me-1" />
                            Atribuir Tags
                          </button>
                          <ul className="dropdown-menu">
                            {tags.map((tag) => (
                              <li key={tag.id}>
                                <button
                                  className={`dropdown-item ${client.tags.includes(tag.name) ? 'active' : ''}`}
                                  onClick={() => handleAssignTag(client.id, tag.name)}
                                >
                                  <Icon 
                                    icon={client.tags.includes(tag.name) ? "solar:check-circle-bold" : "solar:circle-bold"} 
                                    className="me-2" 
                                  />
                                  {tag.name}
                                </button>
                              </li>
                            ))}
                          </ul>
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

      {/* Modal de Edição de Tag */}
      {editingTag && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Tag</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingTag(null)}
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nome da Tag</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingTag.name}
                    onChange={(e) => setEditingTag({...editingTag, name: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Cor</label>
                  <select
                    className="form-select"
                    value={editingTag.color}
                    onChange={(e) => setEditingTag({...editingTag, color: e.target.value})}
                  >
                    <option value="primary">Primária</option>
                    <option value="success">Sucesso</option>
                    <option value="warning">Aviso</option>
                    <option value="info">Informação</option>
                    <option value="secondary">Secundária</option>
                    <option value="danger">Perigo</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingTag(null)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveEdit}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientTagsManager; 