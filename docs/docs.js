const config = {
  openapi: '3.0.1',
  info: {
    version: '1.3.0',
    title: 'Rides',
    description: 'This API provides endpoints to get all rides, get specific rides, and create new ride',
    contact: {
      name: 'Benedita Tanabi',
      email: 'benedita.tan@gmail.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:8010/',
      description: 'Local server'
    },
  ],
  tags: [
    {
      name: 'CRUD operations'
    },
    {
      name: 'Health Check'
    }
  ],
  paths: {
    '/rides': {
      get: {
        tags: ['CRUD operations'],
        description: 'Get all user rides',
        // operationId: 'getUsers',
        parameters: [],
        responses: {
          '200': {
            description: 'Rides were obtained',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Rides'
                }
              }
            }
          },
          '404': {
            description: 'No rides found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  error_code: 'RIDES_NOT_FOUND_ERROR',
                  message: 'Could not find any rides',
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  error_code: 'SERVER_ERROR',
                  message: 'Unknown error'
                }
              }
            }
          }
        }
      },
    }
  },
  components: {
    schemas: {
      rideID: {
        type: 'integer',
        description: 'Ride identification number',
        example: 1234
      },
      startLat: {
        type: 'decimal',
        description: 'Latitude of ride starting point',
        example: -6.347617
      },
      startLong: {
        type: 'decimal',
        description: 'Longitude of ride starting point',
        example: 106.826691
      },
      endLat: {
        type: 'decimal',
        description: 'Latitude of ride end point',
        example: -6.193758
      },
      endLong: {
        type: 'decimal',
        description: 'Longitude of ride end point',
        example: 106.801613
      },
      riderName: {
        type: 'string',
        description: 'Name of passenger',
        example: 'Benedita'
      },
      driverName: {
        type: 'string',
        description: 'Name of driver',
        example: 'Samuel'
      },
      driverVehicle: {
        type: 'string',
        description: 'Vehicle brand',
        example: 'Toyota Avanza'
      },
      created: {
        type: 'datetime',
        description: 'Date and time when the ride is booked in UTC',
        example: '2020-01-01T00:00:00Z'
      },
      Ride: {
        type: 'object',
        properties: {
          rideID: {
            $ref: '#/components/schemas/rideID'
          },
          startLat: {
            $ref: '#/components/schemas/startLat'
          },
          startLong: {
            $ref: '#/components/schemas/startLong'
          },
          endLat: {
            $ref: '#/components/schemas/endLat'
          },
          endLong: {
            $ref: '#/components/schemas/endLong'
          },
          riderName: {
            $ref: '#/components/schemas/riderName'
          },
          driverName: {
            $ref: '#/components/schemas/driverName'
          },
          driverVehicle: {
            $ref: '#/components/schemas/driverVehicle'
          },
          created: {
            $ref: '#/components/schemas/created'
          }
        }
      },
      Rides: {
        type: 'object',
        properties: {
          rides: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Ride'
            }
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error_code: {
            type: 'string'
          },
          message: {
            type: 'string'
          }
        }
      }
    }
  }
};

module.exports = config;