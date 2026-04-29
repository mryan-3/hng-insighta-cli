#!/usr/bin/env node
import { Command } from 'commander';
import { login, logout, whoami } from './commands/auth';

const program = new Command();

program
  .name('insighta')
  .description('Insighta Labs+ CLI Tool')
  .version('1.0.0');

// Authentication Commands
program
  .command('login')
  .description('Authenticate with GitHub')
  .action(login);

program
  .command('logout')
  .description('Log out and clear local credentials')
  .action(logout);

program
  .command('whoami')
  .description('Check current user status')
  .action(whoami);

program.parse(process.argv);
