const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Car API',
      version: '1.0.0',
      description: 'API for managing cars'
    },
    components: {
      schemas: {
        Car: {
          type: 'object',
          required: ['title', 'description', 'images'],
          properties: {
            title: { type: 'string', example: '2019 Toyota Camry' },
            description: { type: 'string', example: 'A well-maintained car with low mileage' },
            tags: { type: 'array', items: { type: 'string' }, example: ['sedan', 'toyota', 'camry'] },
            images: { type: 'array', items: { type: 'string' }, example: ['/uploads/1596234932334-image.jpg'] }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Car not found' }
          }
        },
        User: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', example: 'john_doe' },
            password: { type: 'string', example: 'securepassword123' }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    servers: [
      {
        url: "https://intern-assignment-api.vercel.app",
        description: "Car Management API"
      }
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./challenge/routes/*.js']
};

const specs = swaggerJsdoc(options);
module.exports = {
  specs,
  swaggerUi
};
