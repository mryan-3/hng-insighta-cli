import { Command } from 'commander';
import api from '../utils/api';
import Table from 'cli-table3';
import ora from 'ora';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

export function registerProfileCommands(program: Command) {
  const profiles = program.command('profiles').description('Manage intelligence profiles');

  // ... (list and search already there)

  profiles
    .command('get')
    .description('Get profile details by ID')
    .argument('<id>', 'Profile UUID')
    .action(async (id) => {
      const spinner = ora('Fetching profile...').start();
      try {
        const { data } = await api.get(`/api/profiles/${id}`);
        spinner.stop();
        console.log(chalk.bold('\nProfile Details:'));
        console.log(JSON.stringify(data.data, null, 2));
      } catch (error: any) {
        spinner.fail(chalk.red('Failed to fetch profile'));
        console.error(error.response?.data?.message || error.message);
      }
    });

  profiles
    .command('export')
    .description('Export profiles to CSV')
    .option('-g, --gender <gender>', 'Filter by gender')
    .option('-c, --country <country>', 'Filter by country ID')
    .option('--format <format>', 'Export format', 'csv')
    .action(async (options) => {
      if (options.format !== 'csv') {
        console.error(chalk.red('Only CSV format is currently supported.'));
        return;
      }
      const spinner = ora('Exporting to CSV...').start();
      try {
        const response = await api.get('/api/profiles/export', {
          params: { format: 'csv', gender: options.gender, country_id: options.country },
          responseType: 'blob' // Important for file downloads
        });

        const filename = `profiles_${new Date().getTime()}.csv`;
        fs.writeFileSync(path.join(process.cwd(), filename), response.data);
        
        spinner.succeed(chalk.green(`Export successful: ${filename}`));
      } catch (error: any) {
        spinner.fail(chalk.red('Export failed'));
        console.error(error.message);
      }
    });
}
// ... (renderTable function)
