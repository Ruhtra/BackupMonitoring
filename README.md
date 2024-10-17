# BackupMonitoring

BackupMonitoring is a web application designed to schedule and perform automatic daily backups. It uses TypeScript, React, and a clean architecture, ensuring best practices and maintainability. The focus is on creating daily schedules to execute backups in specific locations with defined costs.

## Technologies

- **React with TypeScript** for the front-end
- **Node.js** for scheduling and executing backups
- **Clean Architecture**: clear separation of layers

## How to Run

1. Clone the repository:

   ```bash
   git clone https://github.com/Ruhtra/BackupMonitoring.git
   cd BackupMonitoring
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure your `.env.development` file according to the environment (development or production).

4. To run in development mode:

   ```bash
   npm run dev
   ```

5. To run in production mode save `.env.proeuction` and run:

   ```bash
   npm run start
   ```

## Environment Configuration

The project relies on environment variables. Create a `.env` file with the following settings:

```bash
# Application Settings
PORT=                       # The port where the application will run
DATABASE_URL=                # URL for the database connection
NODE_ENV=                    # Set as 'development', 'production', or 'test'

# Backup Directories
DB_DIR1=                     # Path to the first directory for backups
DB_DIR2=                     # Path to the second directory for backups
OUTPUT_DIR=                  # Output directory for the backup files
PATH_REMOTE=                 # Remote path for backups

# SCP Connection
SCP_USER=                    # Username for SCP (Secure Copy Protocol)
SCP_HOST=                    # Host for SCP connection
SCP_PORT=                    # Port for SCP connection

# Backup Schedule
BACKUP_NAMES=                # List of backup names separated by commas, e.g., "backup1,backup2"
BACKUP_CRON=                 # CRON expression for backup scheduling

# SSH Configuration
SSH_KEY_PATH=                # Path to the SSH private key for SCP connection
```

Ensure that the `BACKUP_NAMES` do not contain duplicate names as this will cause an error.
