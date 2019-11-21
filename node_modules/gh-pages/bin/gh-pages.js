#!/usr/bin/env node

const ghpages = require('../lib/index');
const program = require('commander');
const path = require('path');
const pkg = require('../package.json');
const addr = require('email-addresses');

function publish(config) {
  return new Promise((resolve, reject) => {
    const basePath = path.join(process.cwd(), program.dist);
    ghpages.publish(basePath, config, err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

function main(args) {
  return Promise.resolve().then(() => {
    program
      .version(pkg.version)
      .option('-d, --dist <dist>', 'Base directory for all source files')
      .option(
        '-s, --src <src>',
        'Pattern used to select which files to publish',
        ghpages.defaults.src
      )
      .option(
        '-b, --branch <branch>',
        'Name of the branch you are pushing to',
        ghpages.defaults.branch
      )
      .option(
        '-e, --dest <dest>',
        'Target directory within the destination branch (relative to the root)',
        ghpages.defaults.dest
      )
      .option('-a, --add', 'Only add, and never remove existing files')
      .option('-x, --silent', 'Do not output the repository url')
      .option(
        '-m, --message <message>',
        'commit message',
        ghpages.defaults.message
      )
      .option('-g, --tag <tag>', 'add tag to commit')
      .option('--git <git>', 'Path to git executable', ghpages.defaults.git)
      .option('-t, --dotfiles', 'Include dotfiles')
      .option('-r, --repo <repo>', 'URL of the repository you are pushing to')
      .option('-p, --depth <depth>', 'depth for clone', ghpages.defaults.depth)
      .option(
        '-o, --remote <name>',
        'The name of the remote',
        ghpages.defaults.remote
      )
      .option(
        '-u, --user <address>',
        'The name and email of the user (defaults to the git config).  Format is "Your Name <email@example.com>".'
      )
      .option(
        '-v, --remove <pattern>',
        'Remove files that match the given pattern ' +
          '(ignored if used together with --add).',
        ghpages.defaults.only
      )
      .option('-n, --no-push', 'Commit only (with no push)')
      .parse(args);

    let user;
    if (program.user) {
      const parts = addr.parseOneAddress(program.user);
      if (!parts) {
        throw new Error(
          `Could not parse name and email from user option "${program.user}" ` +
            '(format should be "Your Name <email@example.com>")'
        );
      }
      user = {name: parts.name, email: parts.address};
    }

    const config = {
      repo: program.repo,
      silent: !!program.silent,
      branch: program.branch,
      src: program.src,
      dest: program.dest,
      message: program.message,
      tag: program.tag,
      git: program.git,
      depth: program.depth,
      dotfiles: !!program.dotfiles,
      add: !!program.add,
      only: program.remove,
      remote: program.remote,
      push: !!program.push,
      user: user
    };

    return publish(config);
  });
}

if (require.main === module) {
  main(process.argv)
    .then(() => {
      process.stdout.write('Published\n');
    })
    .catch(err => {
      process.stderr.write(`${err.message}\n`, () => process.exit(1));
    });
}

exports = module.exports = main;
