const reqGlob = require('require-glob')
const { setup, initialSetup, finishSetup } = require('@crudql/dynamo')

const run = async () => {
  const resolvers = await reqGlob('./resolvers/**/*.js')
  try {
    // run top-level setup
    const initialConfig = await initialSetup()
    const res = Object.values(resolvers)
    let config = { keys: {} }
    // run your setup for each table, one after another, merge all their config together
    await res.reduce(
      (p, r, i) => p.then(async () => {
        if (r._info) {
          const info = await setup(r._info, initialConfig, config)
          config = { ...config, ...info }
        }
      }),
      Promise.resolve()
    )
    // actually create all the tables & keys
    await finishSetup(config)
  } catch (e) {
    console.error(e)
  }
}

run()
