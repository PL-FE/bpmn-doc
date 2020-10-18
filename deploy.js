const { deploy } = require('sftp-sync-deploy')
const { HOST: host, PASSWORD: password, REMOTEDIR: remoteDir } = process.env

const config = {
  host, // Required.
  username: 'root', // Required.
  password, // Optional.
  localDir: './dist', // Required, Absolute or relative to cwd.
  remoteDir // Required, Absolute path only.
}

const options = {
  dryRun: false, // Enable dry-run mode. Default to false
  exclude: [
    // exclude patterns (glob)
    'node_modules',
    'src/**/*.spec.ts'
  ],
  excludeMode: 'remove', // Behavior for excluded files ('remove' or 'ignore'), Default to 'remove'.
  forceUpload: false, // Force uploading all files, Default to false(upload only newer files).
  concurrency: 100 // Max number of SFTP tasks processed concurrently. Default to 100.
}

return deploy(config, options)
