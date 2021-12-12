module.exports = ({env}) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'mysql',
        host: env('DATABASE_HOST', '127.0.0.1'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'db_news'),
        username: env('DATABASE_USERNAME', 'root'),
        password: env('DATABASE_PASSWORD', 'root'),
        ssl: env.bool('DATABASE_SSL', false),
        charset: env('CHARSET', 'utf8mb4'),
      },
      options: {
        charset: env('CHARSET', 'utf8mb4'),
        pool:{
          min: 0,
          max: 7,
          idleTimeoutMillis: 30000,
          createTimeoutMillis: 30000,
          acquireTimeoutMillis: 30000
        }
      }
    },
  },
});
