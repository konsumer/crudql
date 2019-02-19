const reqGlob = require('require-glob')
const { setup, initialSetup, finishSetup } = require('@crudql/dynamo')

const run = async () => {
  const resolvers = await reqGlob('./resolvers/**/*.js')
  // run top-level setup
  const initialConfig = await initialSetup()
  // run your setup for each table, one after another, add all their config together
  try {
    const res = Object.values(resolvers)
    let config = { keys: {} }
    await res.reduce(
      (p, r, i) => p.then(async () => {
        if (r._info) {
          const info = await setup(r._info, initialConfig, config)
          config = { ...config, ...info }
        }
      }),
      Promise.resolve()
    )
    finishSetup(config)
  } catch (e) {
    console.error(e)
  }
}

run()
