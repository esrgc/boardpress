//set node environment
process.env.NODE_ENV = 'development';
process.env.PORT = 3007

exports.db = {
  userName: ''
  , password: ''
  , server: ''
  , options: {
    port: 1433
    , database: ''
  }
}