# E-commerce Store API

## Prerequisites
- Docker
- Docker Compose
- Node.js (optional, for local development)

## Docker Integration

### Building the Image
```bash
# Build the Docker image
docker build -t store-api-node-express .
```

### Running Containers

#### Development Mode
```bash
# Using PowerShell
docker run --name store-api-node-express-container --rm -d \
  -p 3000:3000 \
  --env-file ./.env \
  --env NODE_ENV=development \
  -v ${pwd}\src:/app/src:ro \
  store-api-node-express

# Using Bash/Linux/macOS
docker run --name store-api-node-express-container --rm -d \
  -p 3000:3000 \
  --env-file ./.env \
  --env NODE_ENV=development \
  -v $(pwd)/src:/app/src:ro \
  store-api-node-express
```

#### Production Mode
```bash
docker run --name store-api-node-express-container --rm -d \
  -p 3000:3000 \
  --env-file ./.env \
  --env NODE_ENV=production \
  store-api-node-express
```

### Docker Compose

#### Development Setup
```bash
# Pull development image
docker-compose -f docker-compose.yml -f docker-compose.dev.yml pull

# Start development environment
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
```

#### Production Setup
```bash
# Pull production image
docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull

# Start production environment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

### Docker Swarm Deployment
```bash
# Initialize Docker Swarm (first time)
docker swarm init

# Deploy to Docker Swarm
docker stack deploy -c docker-compose.yml -c docker-compose.prod.yml store-api-node-express-swarm

# Remove Swarm deployment
docker stack rm store-api-node-express

# To leave Swarm mode
docker swarm leave --force
```

## Docker Configuration Details

### Dockerfile Stages
- **base**: Sets up the base Node.js environment
- **development**: Installs all dependencies, mounts source code
- **production**: Installs only production dependencies

### Docker Compose Configuration
- Uses multiple compose files for environment-specific configurations
- Supports 2 replicas of the Node.js application
- Includes Nginx for reverse proxy and load balancing
- Configures restart policies and update strategies

## Environment Variables
Ensure to create a `.env` file with necessary configuration:
- Database connection strings
- JWT secrets
- Other environment-specific variables

## API Documentation
Detailed API endpoints are available in `endpoints-documentation.md`
