import { NextRequest, NextResponse } from 'next/server'
import type { Project, TableSchema } from '@/lib/app-context'

interface GenerateCodeRequest {
  project: Project
  framework: 'express' | 'fastapi' | 'django' | 'spring-boot'
  language: 'typescript' | 'javascript' | 'python' | 'java'
  includeAuth?: boolean
  includeTests?: boolean
}

interface GeneratedCode {
  files: Array<{
    path: string
    content: string
    description: string
  }>
  instructions: string
  dependencies: string[]
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: GenerateCodeRequest = await request.json()
    const { project, framework, language, includeAuth = false, includeTests = false } = body

    if (!project || !project.schema || project.schema.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Project must have at least one table in schema' 
        },
        { status: 400 }
      )
    }

    const generatedCode = generateBackendCode(project, framework, language, includeAuth, includeTests)

    return NextResponse.json({
      success: true,
      data: generatedCode
    })

  } catch (error) {
    console.error('Code generation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate code'
      },
      { status: 500 }
    )
  }
}

function generateBackendCode(
  project: Project,
  framework: string,
  language: string,
  includeAuth: boolean,
  includeTests: boolean
): GeneratedCode {
  switch (framework) {
    case 'express':
      return generateExpressCode(project, language, includeAuth, includeTests)
    case 'fastapi':
      return generateFastAPICode(project, includeAuth, includeTests)
    case 'django':
      return generateDjangoCode(project, includeAuth, includeTests)
    default:
      return generateExpressCode(project, language, includeAuth, includeTests)
  }
}

function generateExpressCode(project: Project, language: string, includeAuth: boolean, includeTests: boolean): GeneratedCode {
  const isTypeScript = language === 'typescript'
  const ext = isTypeScript ? 'ts' : 'js'
  
  // Generate package.json
  const packageJson = {
    name: project.name.toLowerCase().replace(/\s+/g, '-'),
    version: '1.0.0',
    description: project.description,
    main: `src/app.${ext}`,
    scripts: {
      "dev": isTypeScript ? "ts-node-dev src/app.ts" : "nodemon src/app.js",
      "build": isTypeScript ? "tsc" : "echo 'No build step needed'",
      "start": `node ${isTypeScript ? 'dist/app.js' : 'src/app.js'}`,
      "test": includeTests ? "jest" : "echo 'No tests specified'"
    },
    dependencies: {
      "express": "^4.18.2",
      "cors": "^2.8.5",
      "helmet": "^7.0.0",
      "dotenv": "^16.3.1",
      ...(project.database.type === 'postgresql' && { "pg": "^8.11.3" }),
      ...(project.database.type === 'mysql' && { "mysql2": "^3.6.0" }),
      ...(project.database.type === 'mongodb' && { "mongoose": "^7.5.0" }),
      ...(includeAuth && { "jsonwebtoken": "^9.0.2", "bcrypt": "^5.1.1" })
    },
    devDependencies: {
      ...(isTypeScript && {
        "typescript": "^5.2.2",
        "@types/node": "^20.6.0",
        "@types/express": "^4.17.17",
        "@types/cors": "^2.8.14",
        "ts-node-dev": "^2.0.0"
      }),
      "nodemon": "^3.0.1",
      ...(includeTests && { "jest": "^29.7.0", "supertest": "^6.3.3" })
    }
  }

  // Generate main app file
  const appCode = `${isTypeScript ? `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
${project.schema.map(table => 
  `app.use('/api/${table.name.toLowerCase()}', require('./routes/${table.name.toLowerCase()}'));`
).join('\n')}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});

export default app;` : `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
${project.schema.map(table => 
  `app.use('/api/${table.name.toLowerCase()}', require('./routes/${table.name.toLowerCase()}'));`
).join('\n')}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});

module.exports = app;`}`

  // Generate route files for each table
  const routeFiles = project.schema.map(table => {
    const routeCode = generateExpressRoute(table, isTypeScript)
    return {
      path: `src/routes/${table.name.toLowerCase()}.${ext}`,
      content: routeCode,
      description: `CRUD routes for ${table.name}`
    }
  })

  const files = [
    {
      path: 'package.json',
      content: JSON.stringify(packageJson, null, 2),
      description: 'Package configuration and dependencies'
    },
    {
      path: `src/app.${ext}`,
      content: appCode,
      description: 'Main application entry point'
    },
    ...routeFiles,
    {
      path: '.env.example',
      content: generateEnvFile(project.database.type),
      description: 'Environment variables template'
    },
    ...(isTypeScript ? [{
      path: 'tsconfig.json',
      content: generateTSConfig(),
      description: 'TypeScript configuration'
    }] : []),
    {
      path: 'README.md',
      content: generateReadme(project, framework),
      description: 'Project documentation'
    }
  ]

  return {
    files,
    instructions: `Setup Instructions:
1. npm install
2. Copy .env.example to .env and configure database
3. npm run dev`,
    dependencies: Object.keys(packageJson.dependencies)
  }
}

function generateExpressRoute(table: TableSchema, isTypeScript: boolean): string {
  const routerImport = isTypeScript ? 
    `import { Router } from 'express';` : 
    `const express = require('express');`
  
  const routerInit = isTypeScript ? `const router = Router();` : `const router = express.Router();`
  
  return `${routerImport}
${routerInit}

// CRUD operations for ${table.name}
router.get('/', (req, res) => {
  res.json({ message: 'Get all ${table.name}', data: [] });
});

router.get('/:id', (req, res) => {
  res.json({ message: \`Get ${table.name} \${req.params.id}\` });
});

router.post('/', (req, res) => {
  res.status(201).json({ message: '${table.name} created', data: req.body });
});

router.put('/:id', (req, res) => {
  res.json({ message: \`${table.name} \${req.params.id} updated\` });
});

router.delete('/:id', (req, res) => {
  res.json({ message: \`${table.name} \${req.params.id} deleted\` });
});

${isTypeScript ? 'export default router;' : 'module.exports = router;'}`
}

function generateEnvFile(dbType: string): string {
  return `PORT=3000
NODE_ENV=development
DATABASE_URL=${dbType}://username:password@localhost:5432/database_name`
}

function generateTSConfig(): string {
  return JSON.stringify({
    "compilerOptions": {
      "target": "es2020",
      "module": "commonjs",
      "outDir": "./dist",
      "rootDir": "./src",
      "strict": true,
      "esModuleInterop": true
    }
  }, null, 2)
}

function generateReadme(project: Project, framework: string): string {
  return `# ${project.name}

${project.description}

Generated with RhinoBack AI using ${framework}.

## API Endpoints
${project.schema.map(table => `- /api/${table.name.toLowerCase()}`).join('\n')}

## Setup
1. npm install
2. Configure .env file
3. npm run dev`
}

function generateFastAPICode(project: Project, includeAuth: boolean, includeTests: boolean): GeneratedCode {
  return {
    files: [{
      path: 'main.py',
      content: `# FastAPI implementation for ${project.name}`,
      description: 'FastAPI main application'
    }],
    instructions: 'FastAPI code generation coming soon!',
    dependencies: ['fastapi', 'uvicorn']
  }
}

function generateDjangoCode(project: Project, includeAuth: boolean, includeTests: boolean): GeneratedCode {
  return {
    files: [{
      path: 'manage.py',
      content: `# Django implementation for ${project.name}`,
      description: 'Django main application'
    }],
    instructions: 'Django code generation coming soon!',
    dependencies: ['django']
  }
}