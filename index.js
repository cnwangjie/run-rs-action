const core = require('@actions/core')
const readline = require('readline')
const {spawn} = require('child_process')
const ReadableStreamClone = require('./readable-stream-clone')

const args = core.getInput('args');
const cp = spawn('node_modules/.bin/run-rs', args.split(' '), { detached: true })
cp.stderr.pipe(process.stderr)
cp.on('error', (err) => {
  core.setFailed(err.message);
  process.exit()
})

new ReadableStreamClone(cp.stdout).pipe(process.stdout)

const out = new ReadableStreamClone(cp.stdout)

const rl = readline.createInterface(out)

rl.on('line', (line) => {
  const url = line.match(/Started replica set on "(.*)"/)
  if (!url) return
  core.setOutput('url', url[1])
  cp.unref()
  process.exit()
})
