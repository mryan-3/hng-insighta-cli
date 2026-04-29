#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
  .name('insighta')
  .description('Insighta Labs+ CLI Tool')
  .version('1.0.0');

program
  .command('whoami')
  .description('Check current user status')
  .action(() => {
    console.log(chalk.blue('You are not logged in. Run ') + chalk.green('insighta login') + chalk.blue(' to authenticate.'));
  });

program.parse(process.argv);
