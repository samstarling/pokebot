module.exports = {
  development: {
    database: process.env.DATABASE_URL,
    dialect: "postgres",
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
  },
};
