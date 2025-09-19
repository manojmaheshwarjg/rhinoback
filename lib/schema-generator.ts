import { TableSchema, FieldSchema, Relationship, Index, DatabaseConfig, DatabaseType, FieldType } from './app-context'

export interface EntityAnalysis {
  entities: string[]
  relationships: { from: string; to: string; type: 'one-to-one' | 'one-to-many' | 'many-to-many' }[]
  suggestedDatabase: DatabaseType
  reasoning: string
  features: string[]
}

// Smart entity recognition from user input
export function analyzeEntities(input: string): EntityAnalysis {
  const lowerInput = input.toLowerCase()
  
  // Social Media Pattern
  if (lowerInput.includes('social') || lowerInput.includes('post') || lowerInput.includes('follow') || lowerInput.includes('like')) {
    return {
      entities: ['users', 'posts', 'comments', 'likes', 'follows', 'media'],
      relationships: [
        { from: 'posts', to: 'users', type: 'many-to-one' },
        { from: 'comments', to: 'posts', type: 'many-to-one' },
        { from: 'comments', to: 'users', type: 'many-to-one' },
        { from: 'likes', to: 'posts', type: 'many-to-one' },
        { from: 'likes', to: 'users', type: 'many-to-one' },
        { from: 'follows', to: 'users', type: 'many-to-many' },
        { from: 'media', to: 'posts', type: 'one-to-many' }
      ],
      suggestedDatabase: 'postgresql',
      reasoning: 'PostgreSQL is ideal for social media apps with complex relationships, ACID compliance, and excellent performance for read-heavy workloads.',
      features: ['Complex relationships', 'ACID transactions', 'Full-text search', 'JSON support']
    }
  }
  
  // E-commerce Pattern
  if (lowerInput.includes('ecommerce') || lowerInput.includes('shop') || lowerInput.includes('product') || lowerInput.includes('order') || lowerInput.includes('cart')) {
    return {
      entities: ['users', 'products', 'categories', 'orders', 'order_items', 'reviews', 'inventory', 'payments'],
      relationships: [
        { from: 'products', to: 'categories', type: 'many-to-one' },
        { from: 'orders', to: 'users', type: 'many-to-one' },
        { from: 'order_items', to: 'orders', type: 'many-to-one' },
        { from: 'order_items', to: 'products', type: 'many-to-one' },
        { from: 'reviews', to: 'products', type: 'many-to-one' },
        { from: 'reviews', to: 'users', type: 'many-to-one' },
        { from: 'inventory', to: 'products', type: 'one-to-one' },
        { from: 'payments', to: 'orders', type: 'one-to-one' }
      ],
      suggestedDatabase: 'postgresql',
      reasoning: 'PostgreSQL provides strong consistency for financial transactions, complex inventory management, and excellent support for e-commerce analytics.',
      features: ['ACID transactions', 'Complex queries', 'JSON support', 'Reliable for payments']
    }
  }
  
  // Blog/CMS Pattern
  if (lowerInput.includes('blog') || lowerInput.includes('cms') || lowerInput.includes('article') || lowerInput.includes('content')) {
    return {
      entities: ['users', 'posts', 'categories', 'tags', 'comments', 'media', 'pages'],
      relationships: [
        { from: 'posts', to: 'users', type: 'many-to-one' },
        { from: 'posts', to: 'categories', type: 'many-to-one' },
        { from: 'posts', to: 'tags', type: 'many-to-many' },
        { from: 'comments', to: 'posts', type: 'many-to-one' },
        { from: 'comments', to: 'users', type: 'many-to-one' },
        { from: 'media', to: 'posts', type: 'many-to-one' },
        { from: 'pages', to: 'users', type: 'many-to-one' }
      ],
      suggestedDatabase: 'mongodb',
      reasoning: 'MongoDB excels for content management with flexible document structure, easy content versioning, and excellent full-text search capabilities.',
      features: ['Flexible schema', 'Document storage', 'Full-text search', 'Easy scaling']
    }
  }
  
  // Real-time/Chat Pattern
  if (lowerInput.includes('chat') || lowerInput.includes('message') || lowerInput.includes('real-time') || lowerInput.includes('notification')) {
    return {
      entities: ['users', 'conversations', 'messages', 'participants', 'notifications'],
      relationships: [
        { from: 'conversations', to: 'users', type: 'many-to-many' },
        { from: 'messages', to: 'conversations', type: 'many-to-one' },
        { from: 'messages', to: 'users', type: 'many-to-one' },
        { from: 'participants', to: 'conversations', type: 'many-to-one' },
        { from: 'participants', to: 'users', type: 'many-to-one' },
        { from: 'notifications', to: 'users', type: 'many-to-one' }
      ],
      suggestedDatabase: 'redis',
      reasoning: 'Redis is perfect for real-time messaging with its pub/sub capabilities, lightning-fast performance, and excellent session management.',
      features: ['Pub/Sub messaging', 'Ultra-fast reads/writes', 'Session storage', 'Real-time capabilities']
    }
  }
  
  // Analytics/Time-series Pattern
  if (lowerInput.includes('analytics') || lowerInput.includes('tracking') || lowerInput.includes('metric') || lowerInput.includes('time-series')) {
    return {
      entities: ['events', 'users', 'sessions', 'metrics', 'dashboards'],
      relationships: [
        { from: 'events', to: 'users', type: 'many-to-one' },
        { from: 'events', to: 'sessions', type: 'many-to-one' },
        { from: 'metrics', to: 'events', type: 'many-to-one' },
        { from: 'dashboards', to: 'users', type: 'many-to-one' }
      ],
      suggestedDatabase: 'influxdb',
      reasoning: 'InfluxDB is purpose-built for time-series data with excellent compression, fast aggregations, and built-in analytics functions.',
      features: ['Time-series optimization', 'Fast aggregations', 'Data compression', 'Analytics functions']
    }
  }
  
  // AI/ML Pattern
  if (lowerInput.includes('ai') || lowerInput.includes('recommendation') || lowerInput.includes('ml') || lowerInput.includes('vector') || lowerInput.includes('search')) {
    return {
      entities: ['users', 'items', 'embeddings', 'recommendations', 'search_index'],
      relationships: [
        { from: 'embeddings', to: 'items', type: 'one-to-one' },
        { from: 'recommendations', to: 'users', type: 'many-to-one' },
        { from: 'recommendations', to: 'items', type: 'many-to-one' },
        { from: 'search_index', to: 'items', type: 'one-to-one' }
      ],
      suggestedDatabase: 'pinecone',
      reasoning: 'Pinecone is optimized for vector similarity search and AI-powered recommendations with excellent performance and scalability.',
      features: ['Vector similarity search', 'AI/ML optimization', 'Real-time recommendations', 'Scalable indexing']
    }
  }
  
  // Default Pattern
  return {
    entities: ['users', 'items'],
    relationships: [
      { from: 'items', to: 'users', type: 'many-to-one' }
    ],
    suggestedDatabase: 'postgresql',
    reasoning: 'PostgreSQL is a reliable, full-featured database perfect for most applications with excellent performance and extensive feature set.',
    features: ['ACID compliance', 'Complex queries', 'JSON support', 'Extensible']
  }
}

// Generate field schema based on entity type and field name
export function generateFieldSchema(entityName: string, fieldName: string): FieldSchema {
  const baseId = `${entityName}_${fieldName}_${Date.now()}`
  
  // Common patterns
  if (fieldName === 'id') {
    return {
      id: baseId,
      name: 'id',
      type: 'UUID',
      isPrimary: true,
      isRequired: true,
      isUnique: true,
      description: 'Unique identifier'
    }
  }
  
  if (fieldName.includes('email')) {
    return {
      id: baseId,
      name: fieldName,
      type: 'Email',
      isRequired: true,
      isUnique: true,
      description: 'Email address',
      validation: [
        { type: 'pattern', value: '^[^@]+@[^@]+\.[^@]+$', message: 'Must be a valid email' }
      ]
    }
  }
  
  if (fieldName.includes('password')) {
    return {
      id: baseId,
      name: fieldName,
      type: 'Password',
      isRequired: true,
      description: 'Hashed password',
      validation: [
        { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' }
      ]
    }
  }
  
  if (fieldName.includes('created') || fieldName.includes('updated') || fieldName.includes('date')) {
    return {
      id: baseId,
      name: fieldName,
      type: 'DateTime',
      isRequired: true,
      description: 'Timestamp'
    }
  }
  
  if (fieldName.includes('count') || fieldName.includes('quantity') || fieldName.includes('amount') || fieldName.includes('price')) {
    return {
      id: baseId,
      name: fieldName,
      type: fieldName.includes('price') || fieldName.includes('amount') ? 'Decimal' : 'Number',
      isRequired: true,
      description: fieldName.includes('price') ? 'Price in cents' : 'Numeric value',
      validation: [
        { type: 'min', value: 0, message: 'Must be positive' }
      ]
    }
  }
  
  if (fieldName.includes('description') || fieldName.includes('content') || fieldName.includes('bio')) {
    return {
      id: baseId,
      name: fieldName,
      type: 'Textarea',
      description: 'Long text content'
    }
  }
  
  if (fieldName.includes('active') || fieldName.includes('enabled') || fieldName.includes('verified')) {
    return {
      id: baseId,
      name: fieldName,
      type: 'Boolean',
      defaultValue: false,
      description: 'Boolean flag'
    }
  }
  
  if (fieldName.includes('url') || fieldName.includes('link')) {
    return {
      id: baseId,
      name: fieldName,
      type: 'Text',
      description: 'URL or link',
      validation: [
        { type: 'pattern', value: 'https?://.+', message: 'Must be a valid URL' }
      ]
    }
  }
  
  if (fieldName.includes('status')) {
    return {
      id: baseId,
      name: fieldName,
      type: 'Enum',
      isRequired: true,
      enumOptions: ['active', 'inactive', 'pending', 'deleted'],
      defaultValue: 'active',
      description: 'Status value'
    }
  }
  
  // Default text field
  return {
    id: baseId,
    name: fieldName,
    type: 'Text',
    isRequired: true,
    description: `${fieldName} field`
  }
}

// Generate comprehensive table schema from entity analysis
export function generateTableSchema(entityName: string, analysis: EntityAnalysis): TableSchema {
  const fields: FieldSchema[] = []
  
  // Always add ID field first
  fields.push(generateFieldSchema(entityName, 'id'))
  
  // Add entity-specific fields based on common patterns
  const fieldPatterns: Record<string, string[]> = {
    users: ['username', 'email', 'password_hash', 'first_name', 'last_name', 'bio', 'avatar_url', 'verified', 'created_at', 'updated_at'],
    posts: ['title', 'content', 'excerpt', 'featured_image', 'status', 'published_at', 'created_at', 'updated_at'],
    products: ['name', 'description', 'price', 'sku', 'category_id', 'stock_quantity', 'images', 'active', 'created_at', 'updated_at'],
    orders: ['order_number', 'total_amount', 'status', 'shipping_address', 'billing_address', 'created_at', 'updated_at'],
    categories: ['name', 'description', 'slug', 'parent_id', 'active', 'created_at'],
    comments: ['content', 'author_email', 'author_name', 'approved', 'created_at'],
    messages: ['content', 'message_type', 'read_at', 'created_at'],
    events: ['event_type', 'data', 'user_agent', 'ip_address', 'timestamp'],
    reviews: ['rating', 'title', 'content', 'verified_purchase', 'created_at']
  }
  
  const entityFields = fieldPatterns[entityName] || ['name', 'description', 'created_at', 'updated_at']
  
  entityFields.forEach(fieldName => {
    // Skip ID as we already added it
    if (fieldName !== 'id') {
      fields.push(generateFieldSchema(entityName, fieldName))
    }
  })
  
  // Generate relationships
  const relationships: Relationship[] = analysis.relationships
    .filter(rel => rel.from === entityName || rel.to === entityName)
    .map(rel => ({
      type: rel.type,
      targetTable: rel.from === entityName ? rel.to : rel.from,
      sourceField: rel.from === entityName ? `${rel.to.slice(0, -1)}_id` : 'id',
      targetField: rel.to === entityName ? 'id' : `${entityName.slice(0, -1)}_id`
    }))
  
  // Generate indexes
  const indexes: Index[] = [
    { name: `${entityName}_pkey`, fields: ['id'], isUnique: true }
  ]
  
  // Add common performance indexes
  if (fields.some(f => f.name.includes('created_at'))) {
    indexes.push({ name: `${entityName}_created_at_idx`, fields: ['created_at'], isUnique: false })
  }
  if (fields.some(f => f.name.includes('status'))) {
    indexes.push({ name: `${entityName}_status_idx`, fields: ['status'], isUnique: false })
  }
  if (fields.some(f => f.name.includes('email'))) {
    indexes.push({ name: `${entityName}_email_idx`, fields: ['email'], isUnique: true })
  }
  
  return {
    id: `table_${entityName}_${Date.now()}`,
    name: entityName,
    description: `${entityName.charAt(0).toUpperCase() + entityName.slice(1)} table`,
    fields,
    relationships,
    indexes,
    position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
    color: getEntityColor(entityName),
    estimatedRows: getEstimatedRows(entityName)
  }
}

// Get color for entity visualization
function getEntityColor(entityName: string): string {
  const colors: Record<string, string> = {
    users: '#10b981',      // green
    posts: '#3b82f6',      // blue  
    products: '#f59e0b',   // orange
    orders: '#8b5cf6',     // purple
    categories: '#06b6d4', // cyan
    comments: '#84cc16',   // lime
    messages: '#ec4899',   // pink
    events: '#6366f1',     // indigo
    reviews: '#f97316'     // orange-500
  }
  return colors[entityName] || '#6b7280' // default gray
}

// Estimate rows for different entities
function getEstimatedRows(entityName: string): number {
  const estimates: Record<string, number> = {
    users: 10000,
    posts: 50000,
    products: 5000,
    orders: 25000,
    categories: 100,
    comments: 100000,
    messages: 500000,
    events: 1000000,
    reviews: 15000
  }
  return estimates[entityName] || 1000
}

// Generate database configuration
export function generateDatabaseConfig(analysis: EntityAnalysis): DatabaseConfig {
  return {
    type: analysis.suggestedDatabase,
    reasoning: analysis.reasoning,
    features: analysis.features,
    database: 'app_database',
    port: getDatabasePort(analysis.suggestedDatabase)
  }
}

function getDatabasePort(dbType: DatabaseType): number {
  const ports: Record<DatabaseType, number> = {
    postgresql: 5432,
    mysql: 3306,
    sqlite: 0,
    mongodb: 27017,
    redis: 6379,
    pinecone: 443,
    influxdb: 8086,
    elasticsearch: 9200
  }
  return ports[dbType] || 5432
}