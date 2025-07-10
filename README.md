# Mini Payment Gateway Proxy

A lightweight backend API that simulates routing payment requests to Stripe or PayPal based on fraud risk scoring, with LLM-powered explanations for each decision.

## Features

- **Fraud Risk Scoring**: Configurable heuristics for payment risk assessment
- **Payment Routing**: Intelligent routing to Stripe or PayPal based on risk factors
- **LLM Explanations**: Natural language explanations using Google Gemma 3 12B via OpenRouter
- **Redis Integration**: Caching for LLM responses and persistent transaction logging
- **Security Middleware**: Comprehensive security with rate limiting, CORS, and input validation
- **Docker Support**: Containerized deployment with Redis
- **Swagger Documentation**: Interactive API documentation

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │───▶│  Payment Proxy  │───▶│   Redis Cache   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  OpenRouter LLM │
                       │  (Gemma 3 12B)  │
                       └─────────────────┘
```

## Setup Instructions

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- OpenRouter API key (for LLM explanations)

### Environment Variables

Create a `.env` file in the root directory:

```env
# App Configuration
NODE_ENV=development
PORT=3000

# Fraud Detection
FRAUD_LARGE_AMOUNT=1000
FRAUD_SUSPICIOUS_DOMAINS=.ru,test.com

# Payment Providers
PAYMENT_PROVIDERS=stripe,paypal

# LLM Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
CACHE_TTL_SECONDS=3600

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
TRANSACTION_KEY=transactions
```

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Redis (using Docker):**
   ```bash
   docker run -d -p 6379:6379 redis:7-alpine
   ```

3. **Run the application:**
   ```bash
   npm run dev
   ```

4. **Access the API:**
   - API: http://localhost:3000
   - Swagger Docs: http://localhost:3000/api-docs

### Docker Deployment

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

2. **Or build and run manually:**
   ```bash
   docker build -t payment-proxy .
   docker run -p 3000:3000 payment-proxy
   ```

## API Endpoints

### POST /charge

Process a payment with fraud risk assessment.

**Request:**
```json
{
  "amount": 1000,
  "currency": "USD",
  "source": "tok_test",
  "email": "donor@example.com"
}
```

**Response:**
```json
{
  "transactionId": "txn_abc123",
  "provider": "paypal",
  "status": "success",
  "riskScore": 0.32,
  "explanation": "This payment was routed to PayPal due to a moderately high low score based on a large amount and a suspicious email domain."
}
```

### GET /transactions

Retrieve all transaction logs.

**Response:**
```json
[
  {
    "timestamp": "2024-07-09T12:34:56.789Z",
    "transactionId": "txn_abc123",
    "provider": "paypal",
    "status": "success",
    "riskScore": 0.32,
    "explanation": "This payment was routed to PayPal due to a moderately high low score based on a large amount and a suspicious email domain.",
    "amount": 1000,
    "currency": "USD",
    "email": "donor@example.com"
  }
]
```

## Fraud Logic

The system uses configurable heuristics to calculate a risk score (0-1):

### Current Heuristics

1. **Large Amount Detection**
   - Threshold: Configurable via `FRAUD_LARGE_AMOUNT` (default: 1000)
   - Weight: 0.4 (configurable in `fraud.rules.json`)

2. **Suspicious Domain Detection**
   - Domains: Configurable via `FRAUD_SUSPICIOUS_DOMAINS` (default: .ru, test.com)
   - Weight: 0.6 (configurable in `fraud.rules.json`)

### Risk Scoring

- **Score < 0.5**: Payment is routed to a provider (Stripe or PayPal)
- **Score ≥ 0.5**: Payment is blocked

### Provider Selection

- **Suspicious Domain**: Routes to PayPal
- **Large Amount**: Routes to PayPal
- **Low Risk**: Routes to Stripe

## LLM Integration

### Configuration

- **Model**: Google Gemma 3 12B (via OpenRouter)
- **Caching**: Redis-based caching with configurable TTL
- **Prompt Engineering**: Structured prompts for consistent explanations

### Caching Strategy

- LLM responses are cached in Redis using the prompt as the key
- Cache TTL: Configurable via `CACHE_TTL_SECONDS` (default: 1 hour)
- Reduces API costs and improves response times

## Configuration Files

### fraud.rules.json

```json
{
  "largeAmount": {
    "threshold": 1000,
    "weight": 0.4
  },
  "suspiciousDomains": {
    "domains": [".ru", "test.com"],
    "weight": 0.6
  }
}
```

### swagger.json

OpenAPI 3.0 specification for API documentation.

## Security Features

- **Helmet**: Security headers
- **CORS**: Configurable cross-origin requests
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Class-validator with custom DTOs
- **XSS Protection**: xss-clean middleware
- **HTTP Parameter Pollution**: hpp middleware
- **Body Size Limiting**: 1MB limit

## Assumptions and Tradeoffs

### Assumptions

1. **Payment Simulation**: This is a simulation - no real payments are processed
2. **Provider Selection**: Simple heuristic-based routing (not ML-based)
3. **Risk Scoring**: Basic rule-based scoring (not ML-based)
4. **LLM Reliability**: Assumes OpenRouter API availability
5. **Redis Persistence**: Assumes Redis is always available

### Tradeoffs

1. **Performance vs. Accuracy**
   - Simple heuristics are fast but may not catch sophisticated fraud
   - LLM explanations add latency but provide human-readable insights

2. **Caching vs. Freshness**
   - LLM response caching improves performance but may return stale explanations
   - Configurable TTL balances performance and freshness

3. **Simplicity vs. Complexity**
   - Current heuristics are simple and configurable
   - Could be enhanced with ML models for better accuracy

4. **In-Memory vs. Persistent Storage**
   - Redis provides persistence but adds infrastructure complexity
   - Could use database for more robust storage

## Development

### Project Structure

```
src/
├── configs/          # Configuration files
├── controllers/      # Request handlers
├── dtos/            # Data transfer objects
├── handlers/        # Middleware handlers
├── interfaces/      # TypeScript interfaces
├── middlewares/     # Express middlewares
├── providers/       # External service providers
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript types
└── utils/           # Utility functions
```

### Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run debug`: Start with debugging enabled
- `npm run build`: Build TypeScript to dist/
- `npm test`: Run tests (to be implemented)

## Testing

Use the provided test cases in Swagger UI or Postman:

1. **Low Risk**: amount=100, email=user@example.com
2. **Medium Risk**: amount=1500, email=user@example.com
3. **High Risk**: amount=100, email=user@test.com
4. **Blocked**: amount=1500, email=user@abc.ru

## Deployment

### Production Considerations

1. **Environment Variables**: Use proper secrets management
2. **Redis Persistence**: Configure Redis persistence for data durability
3. **Monitoring**: Add health checks and monitoring
4. **Scaling**: Consider horizontal scaling with load balancers
5. **Security**: Review and harden security configurations

### Health Checks

- `/health` endpoint (to be implemented)
- Redis connectivity check
- LLM API connectivity check

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT 