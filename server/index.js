const express = require('express');
const Sequelize = require('sequelize');
const chalk = require('chalk');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/ci_db';
const PUBLIC_PATH = path.join(__dirname, '../public');
const DIST_PATH = path.join(__dirname, '../dist');

const app = express();

const startServer = () => new Promise((res) => {
  app.listen(PORT, () => {
    console.log(chalk.green(`Server is now listening on PORT:${PORT}`));
    res();
  });
});

const db = new Sequelize(DB_URL, {
  logging: false,
});

const sync = async () => {
  try {
    await db.sync();

    console.log(chalk.green('DB Synced.'));
  } catch (e) {
    console.log(chalk.red('DB Failed to Sync.'));

    throw e;
  }
};

app.use(express.static(PUBLIC_PATH));
app.use(express.static(DIST_PATH));

app.get('/api/health', (req, res) => {
  res.send({
    message: 'I am a healthy little server.',
  });
});

const startApplication = async () => {
  try {
    console.log(chalk.cyan('Application starting...'));

    await sync();
    await startServer();

    console.log(chalk.green('Application started.'));
  } catch (e) {
    console.log(chalk.red('Application failed to start.'));

    throw e;
  }
};

startApplication();
