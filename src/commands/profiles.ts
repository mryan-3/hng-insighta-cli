import { Command } from 'commander';
import api from '../utils/api.js';
import Table from 'cli-table3';
import ora from 'ora';
import chalk from 'chalk';

export function registerProfileCommands(program: Command) {
  const profiles = program.command('profiles').description('Manage intelligence profiles');

  profiles
    .command('list')
    .description('List profiles with filters')
    .option('-g, --gender <gender>', 'Filter by gender')
    .option('-c, --country <country>', 'Filter by country ID')
    .option('-a, --age-group <group>', 'Filter by age group')
    .option('--min-age <age>', 'Minimum age')
    .option('--max-age <age>', 'Maximum age')
    .option('--page <page>', 'Page number', '1')
    .option('--limit <limit>', 'Items per page', '10')
    .action(async (options) => {
      const spinner = ora('Fetching profiles...').start();
      try {
        const { data } = await api.get('/api/profiles', {
          params: {
            gender: options.gender,
            age_group: options.ageGroup,
            country_id: options.country,
            min_age: options.minAge,
            max_age: options.maxAge,
            page: options.page,
            limit: options.limit
          }
        });

        spinner.stop();
        renderTable(data.data);
      } catch (error: any) {
        spinner.fail(chalk.red('Failed to fetch profiles'));
        console.error(error.response?.data?.message || error.message);
      }
    });
}

function renderTable(profiles: any[]) {
  if (profiles.length === 0) {
    console.log(chalk.yellow('No profiles found.'));
    return;
  }

  const table = new Table({
    head: ['Name', 'Gender', 'Age', 'Country', 'Age Group'],
    colWidths: [20, 10, 5, 10, 15]
  });

  profiles.forEach(p => {
    table.push([p.name, p.gender, p.age, p.country_id || p.countryId, p.age_group || p.ageGroup]);
  });

  console.log(table.toString());
}
