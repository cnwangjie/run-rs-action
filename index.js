const core = require('@actions/core')
const readline = require('readline')
const {spawn} = require('child_process')
const path = require('path')
const ReadableStreamClone = require('./readable-stream-clone')

const args = core.getInput('args')
const cp = spawn(path.join(__dirname, 'node_modules/run-rs/index.js'), args.split(' '), {
  detached: true,
  cwd: __dirname,
  shell: true,
})
cp.stderr.pipe(process.stderr)
cp.on('exit', (code) => {
  if (code !== 0) process.exit(code)
})
cp.on('error', (err) => {
  core.setFailed(err.message)
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
