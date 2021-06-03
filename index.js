const core = require('@actions/core');
const {spawn} = require('child_process')

const args = core.getInput('args');
const cp = spawn('node_modules/.bin/run-rs', args.split(' '))
cp.stdout.pipe(process.stdout)
cp.stderr.pipe(process.stderr)
cp.on('error', (err) => {
  core.setFailed(err.message);
})
