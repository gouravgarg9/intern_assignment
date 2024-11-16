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
    security: [
        {
          bearerAuth: [],
        },
    ],
  },
  apis: ['./routes/*.js']  // Adjust path to your API files
};

const specs = swaggerJsdoc(options);
module.exports = {
  specs,
  swaggerUi
};