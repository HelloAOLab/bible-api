import { Command } from 'commander';
import path from 'path';
import {readdir, readFile} from 'fs/promises';
import Sql, { Database } from 'better-sqlite3';
import { randomUUID } from 'crypto';

const migrationsPath = path.resolve(__dirname, './migrations');

async function start() {
    // @ts-ignore
    // const Conf = await import('conf');

    const program = new Command();

    // const conf = new Conf({
    //     projectName: 'bible-api-cli'
    // });

    program.name('bible-api')
        .description('A CLI for managing a Bible API.')
        .version('0.0.1')
        .option('--db <db>', 'The SQLite database file to use.');

    program.command('init [dir]')
        .description('Initialize a new Bible API DB.')
        .action(async (dir: string) => {
            console.log('Initializing new Bible API DB...');
            dir = dir || process.cwd();
            const dbPath = path.resolve(dir, 'bible-api.db');
            // setDbPath(dbPath);

            const db = await getDb(dbPath);
            db.close();
        });

    await program.parseAsync(process.argv);

    // function getDbPath(db: string) {
    //     return db || conf.get('db');
    // }
    
    // function setDbPath(db: string) {
    //     conf.set('db', db);
    // }
}

start();

// program.command('import <dir>')
// .description('Import a Bible into ')


async function getDb(dbPath: string) {
    const db = new Sql(dbPath, {});

    db.exec(`CREATE TABLE IF NOT EXISTS _prisma_migrations (
        id TEXT PRIMARY KEY,
        checksum TEXT,
        started_at TEXT,
        finished_at TEXT,
        migration_name TEXT,
        applied_steps_count INTEGER
    );`);

    const migrations = await readdir(migrationsPath);
    const appliedMigrations = db.prepare('SELECT * FROM _prisma_migrations;').all() as Migration[];

    let missingMigrations = [];
    for (let migration of migrations) {
        if(appliedMigrations.some(m => m.migration_name === migration)) {
            continue;
        }
        if (path.extname(migration) !== '') {
            continue;
        }
        missingMigrations.push(migration);
    }

    const insertMigrationStatement = db.prepare('INSERT INTO _prisma_migrations (id, checksum, started_at, finished_at, migration_name, applied_steps_count) VALUES (?, ?, ?, ?, ?, ?);');

    for(let missingMigration of missingMigrations) {
        console.log(`Applying migration ${missingMigration}...`);
        const migration = path.resolve(migrationsPath, missingMigration, 'migration.sql');
        const migrationFile = await readFile(migration, 'utf8');
        db.exec(migrationFile);
        insertMigrationStatement.run(randomUUID(), '', new Date().toISOString(), new Date().toISOString(), missingMigration, 1);
    }

    return db;
}

interface Migration {
    id: string;
    checksum: string;
    finished_at: Date;
    migration_name: string;
}