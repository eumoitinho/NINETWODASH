/**
 * Database Initialization Script for NINETWODASH
 * Creates initial admin user and basic client data (names and access only)
 */

import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

// Database connection
async function connectToDatabase() {
  try {
    const mongoUri = 'mongodb://root:FDefhgOxFQFDN3MBLAIalOgb6Z6dsImulqQOMYcXQl22xxU4YZ6ZM5MdjwQp65hA@162.240.99.119:5187/?directConnection=true';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    throw error;
  }
}

// Schemas (simplified for initialization)
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'client'], default: 'client' },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
  monthlyBudget: { type: Number, required: true },
  avatar: String,
  tags: [String],
  portalSettings: {
    logoUrl: String,
    primaryColor: { type: String, default: '#3B82F6' },
    secondaryColor: { type: String, default: '#8B5CF6' },
    allowedSections: [{ type: String, enum: ['dashboard', 'campanhas', 'analytics', 'relatorios', 'configuracoes'] }],
  },
  googleAds: {
    connected: { type: Boolean, default: false },
    customerId: String,
    lastSync: Date,
  },
  facebookAds: {
    connected: { type: Boolean, default: false },
    accountId: String,
    lastSync: Date,
  },
  googleAnalytics: {
    connected: { type: Boolean, default: false },
    propertyId: String,
    lastSync: Date,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Client = mongoose.models.Client || mongoose.model('Client', ClientSchema);

// Lista dos 20 clientes
const CLIENTS_DATA = [
  {
    name: 'Catalisti Holding',
    email: 'catalisti@dashboard.ninetwo.com.br',
    slug: 'catalisti-holding',
    monthlyBudget: 25000,
    tags: ['premium', 'holding'],
    portalSettings: {
      primaryColor: '#2563EB',
      secondaryColor: '#7C3AED',
      allowedSections: ['dashboard', 'campanhas', 'analytics', 'relatorios'],
    }
  },
  {
    name: 'ABC EVO',
    email: 'abcevo@dashboard.ninetwo.com.br',
    slug: 'abc-evo',
    monthlyBudget: 15000,
    tags: ['tech', 'startup'],
    portalSettings: {
      primaryColor: '#059669',
      secondaryColor: '#7C2D12',
      allowedSections: ['dashboard', 'campanhas', 'analytics'],
    }
  },
  {
    name: 'Dr. Victor Mauro',
    email: 'drvictor@dashboard.ninetwo.com.br',
    slug: 'dr-victor-mauro',
    monthlyBudget: 8000,
    tags: ['healthcare', 'medical'],
    portalSettings: {
      primaryColor: '#DC2626',
      secondaryColor: '#B91C1C',
      allowedSections: ['dashboard', 'relatorios'],
    }
  },
  {
    name: 'Dr. Percio',
    email: 'drpercio@dashboard.ninetwo.com.br',
    slug: 'dr-percio',
    monthlyBudget: 6000,
    tags: ['healthcare', 'medical'],
    portalSettings: {
      primaryColor: '#0891B2',
      secondaryColor: '#0E7490',
      allowedSections: ['dashboard', 'campanhas'],
    }
  },
  {
    name: 'CWTrends',
    email: 'cwtrends@dashboard.ninetwo.com.br',
    slug: 'cwtrends',
    monthlyBudget: 12000,
    tags: ['fashion', 'trends'],
    portalSettings: {
      primaryColor: '#7C3AED',
      secondaryColor: '#6D28D9',
      allowedSections: ['dashboard', 'campanhas', 'analytics'],
    }
  },
  {
    name: 'Global Best Part',
    email: 'globalbestpart@dashboard.ninetwo.com.br',
    slug: 'global-best-part',
    monthlyBudget: 18000,
    tags: ['automotive', 'parts'],
    portalSettings: {
      primaryColor: '#EA580C',
      secondaryColor: '#C2410C',
      allowedSections: ['dashboard', 'campanhas', 'relatorios'],
    }
  },
  {
    name: 'LJ Santos',
    email: 'ljsantos@dashboard.ninetwo.com.br',
    slug: 'lj-santos',
    monthlyBudget: 9000,
    tags: ['services', 'consulting'],
    portalSettings: {
      primaryColor: '#16A34A',
      secondaryColor: '#15803D',
      allowedSections: ['dashboard', 'relatorios'],
    }
  },
  {
    name: 'Favretto Mídia Exterior',
    email: 'favrettomidia@dashboard.ninetwo.com.br',
    slug: 'favretto-midia-exterior',
    monthlyBudget: 22000,
    tags: ['advertising', 'outdoor'],
    portalSettings: {
      primaryColor: '#DB2777',
      secondaryColor: '#BE185D',
      allowedSections: ['dashboard', 'campanhas', 'analytics', 'relatorios'],
    }
  },
  {
    name: 'Favretto Comunicação Visual',
    email: 'favrettovisual@dashboard.ninetwo.com.br',
    slug: 'favretto-comunicacao-visual',
    monthlyBudget: 14000,
    tags: ['design', 'visual'],
    portalSettings: {
      primaryColor: '#7C2D12',
      secondaryColor: '#92400E',
      allowedSections: ['dashboard', 'campanhas'],
    }
  },
  {
    name: 'Mundial',
    email: 'mundial@dashboard.ninetwo.com.br',
    slug: 'mundial',
    monthlyBudget: 35000,
    tags: ['enterprise', 'global'],
    portalSettings: {
      primaryColor: '#1D4ED8',
      secondaryColor: '#1E40AF',
      allowedSections: ['dashboard', 'campanhas', 'analytics', 'relatorios'],
    }
  },
  {
    name: 'Naframe',
    email: 'naframe@dashboard.ninetwo.com.br',
    slug: 'naframe',
    monthlyBudget: 11000,
    tags: ['construction', 'frames'],
    portalSettings: {
      primaryColor: '#9333EA',
      secondaryColor: '#7C3AED',
      allowedSections: ['dashboard', 'campanhas'],
    }
  },
  {
    name: 'Motin Films',
    email: 'motinfilms@dashboard.ninetwo.com.br',
    slug: 'motin-films',
    monthlyBudget: 16000,
    tags: ['media', 'films'],
    portalSettings: {
      primaryColor: '#DC2626',
      secondaryColor: '#B91C1C',
      allowedSections: ['dashboard', 'campanhas', 'analytics'],
    }
  },
  {
    name: 'Naport',
    email: 'naport@dashboard.ninetwo.com.br',
    slug: 'naport',
    monthlyBudget: 13000,
    tags: ['logistics', 'port'],
    portalSettings: {
      primaryColor: '#0891B2',
      secondaryColor: '#0E7490',
      allowedSections: ['dashboard', 'relatorios'],
    }
  },
  {
    name: 'Autoconnect Prime',
    email: 'autoconnectprime@dashboard.ninetwo.com.br',
    slug: 'autoconnect-prime',
    monthlyBudget: 19000,
    tags: ['automotive', 'premium'],
    portalSettings: {
      primaryColor: '#059669',
      secondaryColor: '#047857',
      allowedSections: ['dashboard', 'campanhas', 'analytics', 'relatorios'],
    }
  },
  {
    name: 'Vtelco Networks',
    email: 'vtelco@dashboard.ninetwo.com.br',
    slug: 'vtelco-networks',
    monthlyBudget: 28000,
    tags: ['telecom', 'networks'],
    portalSettings: {
      primaryColor: '#7C3AED',
      secondaryColor: '#6D28D9',
      allowedSections: ['dashboard', 'campanhas', 'analytics', 'relatorios'],
    }
  },
  {
    name: 'Amitech',
    email: 'amitech@dashboard.ninetwo.com.br',
    slug: 'amitech',
    monthlyBudget: 17000,
    tags: ['technology', 'solutions'],
    portalSettings: {
      primaryColor: '#2563EB',
      secondaryColor: '#1D4ED8',
      allowedSections: ['dashboard', 'campanhas', 'analytics'],
    }
  },
  {
    name: 'Hogrefe Construtora',
    email: 'hogrefe@dashboard.ninetwo.com.br',
    slug: 'hogrefe-construtora',
    monthlyBudget: 21000,
    tags: ['construction', 'real-estate'],
    portalSettings: {
      primaryColor: '#EA580C',
      secondaryColor: '#C2410C',
      allowedSections: ['dashboard', 'campanhas', 'relatorios'],
    }
  },
  {
    name: 'Colaço Engenharia',
    email: 'colaco@dashboard.ninetwo.com.br',
    slug: 'colaco-engenharia',
    monthlyBudget: 24000,
    tags: ['engineering', 'construction'],
    portalSettings: {
      primaryColor: '#16A34A',
      secondaryColor: '#15803D',
      allowedSections: ['dashboard', 'campanhas', 'analytics', 'relatorios'],
    }
  },
  {
    name: 'Pesados Web',
    email: 'pesadosweb@dashboard.ninetwo.com.br',
    slug: 'pesados-web',
    monthlyBudget: 10000,
    tags: ['web', 'development'],
    portalSettings: {
      primaryColor: '#DB2777',
      secondaryColor: '#BE185D',
      allowedSections: ['dashboard', 'campanhas', 'analytics'],
    }
  },
  {
    name: 'Eleva Corpo e Alma',
    email: 'elevacorpoealma@dashboard.ninetwo.com.br',
    slug: 'eleva-corpo-e-alma',
    monthlyBudget: 7500,
    tags: ['wellness', 'fitness'],
    portalSettings: {
      primaryColor: '#7C2D12',
      secondaryColor: '#92400E',
      allowedSections: ['dashboard', 'relatorios'],
    }
  }
];

async function initializeDatabase() {
  console.log('🚀 Iniciando configuração do banco de dados NINETWODASH...\n');

  try {
    await connectToDatabase();

    // Limpar dados existentes
    console.log('🧹 Limpando dados existentes...');
    await User.deleteMany({});
    await Client.deleteMany({});

    // Criar usuário admin
    console.log('👤 Criando usuário administrador...');
    const adminPassword = await bcryptjs.hash('admin123', 12);
    const admin = await User.create({
      email: 'admin@ninetwodash.com',
      password: adminPassword,
      name: 'Administrador NINETWODASH',
      role: 'admin',
    });
    console.log('✅ Admin criado:', admin.email);

    // Criar todos os 20 clientes
    console.log('\n🏢 Criando clientes...');
    const createdClients = [];

    for (const clientData of CLIENTS_DATA) {
      const client = await Client.create(clientData);
      createdClients.push(client);
      
      // Criar usuário para o cliente
      const clientPassword = await bcryptjs.hash('cliente123', 12);
      const clientUser = await User.create({
        email: clientData.email,
        password: clientPassword,
        name: `Portal ${clientData.name}`,
        role: 'client',
        clientId: client._id,
      });

      console.log(`✅ Cliente criado: ${client.name} (${client.slug})`);
      console.log(`   📧 Login: ${clientUser.email} | Senha: cliente123`);
    }

    console.log(`\n🎉 Banco de dados inicializado com sucesso!`);
    console.log(`📊 Total de clientes: ${createdClients.length}`);
    console.log(`👥 Total de usuários: ${createdClients.length + 1}`);
    
    console.log('\n🔐 Credenciais de acesso:');
    console.log('📋 ADMIN:');
    console.log('   📧 Email: admin@ninetwodash.com');
    console.log('   🔑 Senha: admin123');
    
    console.log('\n📋 CLIENTES (todos usam a mesma senha):');
    console.log('   🔑 Senha padrão: cliente123');
    console.log('   📧 Exemplos:');
    console.log('     • catalisti@dashboard.ninetwo.com.br');
    console.log('     • abcevo@dashboard.ninetwo.com.br');
    console.log('     • drvictor@dashboard.ninetwo.com.br');
    console.log('     • [... todos os outros emails dos clientes]');

  } catch (error) {
    console.error('❌ Erro durante inicialização:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Conexão com MongoDB fechada');
  }
}

// Executar inicialização
initializeDatabase();