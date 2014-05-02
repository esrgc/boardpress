//set node environment
process.env.NODE_ENV = 'development';

//set server port
process.env.PORT = 3010

//MSSQL connection
exports.mssql = {
  userName: ''
  , password: ''
  , server: ''
  , options: {
    port: 1433
    , database: ''
  }
}