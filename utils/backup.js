const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');

function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(
    __dirname,
    '..',
    'backups',
    `backup-${timestamp}.sql`
  );
  console.log(
    `Executing backup command: docker exec -u ${process.env.POSTGRESUSER} ${process.env.COMPOSE_PROJECT_NAME}-db-1 pg_dump -Fc ${process.env.POSTGREDB} > ${backupPath}`
  );

  const command = `docker exec -u ${process.env.POSTGRESUSER} ${process.env.COMPOSE_PROJECT_NAME}-db-1 pg_dump -Fc ${process.env.POSTGREDB} > ${backupPath}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Backup error: ${error}`);
      return;
    }
    console.log(`Backup completed: ${backupPath}`);
  });
}

function scheduleBackup() {
  cron.schedule('* * * * *', () => {
    console.log('Running scheduled backup');
    runBackup();
  });
}

module.exports = { scheduleBackup };
