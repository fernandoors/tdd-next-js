const config = require('./jest.config')

module.exports={
  ...config,
  testMatch: ['**/?(*.integration.)+(spec|test).ts?(x)'],
}
