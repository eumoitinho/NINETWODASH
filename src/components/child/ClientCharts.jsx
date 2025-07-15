"use client";
import React from 'react';
import dynamic from 'next/dynamic';

// Importar componentes de chart dinamicamente para evitar problemas de SSR
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ClientCharts = ({ clientData }) => {
  // Configurações do gráfico de tráfego por fonte
  const trafficSourceOptions = {
    chart: {
      type: 'bar',
      height: 250,
      toolbar: {
        show: false
      }
    },
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '55%',
      }
    },
    xaxis: {
      categories: ['Google Ads', 'Facebook Ads', 'Orgânico', 'Direto', 'Outros']
    },
    yaxis: {
      title: {
        text: 'Sessões'
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " sessões";
        }
      }
    }
  };

  const trafficSourceSeries = [
    {
      name: 'Sessões',
      data: [4500, 3200, 1800, 1200, 800]
    }
  ];

  // Configurações do gráfico de conversões por dispositivo
  const deviceConversionOptions = {
    chart: {
      type: 'pie',
      height: 250
    },
    colors: ['#3B82F6', '#10B981', '#F59E0B'],
    labels: ['Desktop', 'Mobile', 'Tablet'],
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return opts.w.globals.labels[opts.seriesIndex] + ': ' + val.toFixed(1) + '%';
      }
    },
    legend: {
      position: 'bottom'
    }
  };

  const deviceConversionSeries = [45, 40, 15];

  // Configurações do gráfico de performance de campanhas
  const campaignPerformanceOptions = {
    chart: {
      type: 'radar',
      height: 300
    },
    colors: ['#3B82F6'],
    dataLabels: {
      enabled: true
    },
    plotOptions: {
      radar: {
        polygons: {
          strokeColors: '#e8e8e8',
          fill: {
            colors: ['#f8f8f8', '#fff']
          }
        }
      }
    },
    xaxis: {
      categories: ['CTR', 'CPC', 'Conversões', 'ROAS', 'Impressões', 'Cliques']
    },
    yaxis: {
      tickAmount: 7,
      labels: {
        formatter: function(val, i) {
          if (i % 2 === 0) {
            return val.toFixed(0);
          } else {
            return '';
          }
        }
      }
    }
  };

  const campaignPerformanceSeries = [
    {
      name: 'Performance',
      data: [2.8, 1.2, 85, 4.2, 95, 78]
    }
  ];

  // Configurações do gráfico de tendência de conversões
  const conversionTrendOptions = {
    chart: {
      type: 'line',
      height: 250,
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
      title: {
        text: 'Conversões'
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " conversões";
        }
      }
    }
  };

  const conversionTrendSeries = [
    {
      name: 'Conversões',
      data: [12, 15, 18, 14, 20, 16, 19]
    }
  ];

  return (
    <div className="row gy-4">
      {/* Gráfico de Tráfego por Fonte */}
      <div className="col-xxl-6">
        <div className="card h-100">
          <div className="card-body p-24">
            <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-4">
              <h6 className="mb-2 fw-bold text-lg mb-0">Tráfego por Fonte</h6>
              <select className="form-select form-select-sm w-auto bg-base border text-secondary-light">
                <option>Últimos 30 dias</option>
                <option>Últimos 7 dias</option>
                <option>Últimos 90 dias</option>
              </select>
            </div>
            <Chart
              options={trafficSourceOptions}
              series={trafficSourceSeries}
              type="bar"
              height={250}
            />
          </div>
        </div>
      </div>

      {/* Gráfico de Conversões por Dispositivo */}
      <div className="col-xxl-6">
        <div className="card h-100">
          <div className="card-body p-24">
            <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-4">
              <h6 className="mb-2 fw-bold text-lg mb-0">Conversões por Dispositivo</h6>
              <span className="badge bg-success-subtle text-success-main">Ativo</span>
            </div>
            <Chart
              options={deviceConversionOptions}
              series={deviceConversionSeries}
              type="pie"
              height={250}
            />
          </div>
        </div>
      </div>

      {/* Gráfico de Performance de Campanhas */}
      <div className="col-xxl-8">
        <div className="card h-100">
          <div className="card-body p-24">
            <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-4">
              <h6 className="mb-2 fw-bold text-lg mb-0">Performance de Campanhas</h6>
              <div className="d-flex gap-2">
                <span className="badge bg-primary-subtle text-primary-main">CTR: 2.8%</span>
                <span className="badge bg-success-subtle text-success-main">ROAS: 4.2</span>
              </div>
            </div>
            <Chart
              options={campaignPerformanceOptions}
              series={campaignPerformanceSeries}
              type="radar"
              height={300}
            />
          </div>
        </div>
      </div>

      {/* Gráfico de Tendência de Conversões */}
      <div className="col-xxl-4">
        <div className="card h-100">
          <div className="card-body p-24">
            <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-4">
              <h6 className="mb-2 fw-bold text-lg mb-0">Tendência de Conversões</h6>
              <select className="form-select form-select-sm w-auto bg-base border text-secondary-light">
                <option>Últimos 7 dias</option>
                <option>Últimos 30 dias</option>
              </select>
            </div>
            <Chart
              options={conversionTrendOptions}
              series={conversionTrendSeries}
              type="line"
              height={250}
            />
            <div className="text-center mt-3">
              <h4 className="text-success mb-1">16.3</h4>
              <p className="text-muted mb-0">Média diária de conversões</p>
              <span className="text-success-600 d-flex align-items-center justify-content-center gap-1 text-sm fw-bolder">
                8.5% <i className="ri-arrow-up-s-fill d-flex" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientCharts; 