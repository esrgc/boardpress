//set node environment
process.env.NODE_ENV = 'development';

//set server port
process.env.PORT = 3007

//MSSQL connection
exports.db = {
  userName: ''
  , password: ''
  , server: ''
  , options: {
    port: 1433
    , database: ''
  }
}