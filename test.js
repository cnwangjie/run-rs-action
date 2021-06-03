const {MongoClient} = require('mongodb')
const {inspect} = require('util')

const main = async () => {
  const url = process.env.MONGO_URL
  console.log('attempt to connect ' + url)
  const client = await new MongoClient(url, {
    useUnifiedTopology: true,
  }).connect()
  const admin = client.db().admin()
  const status = await admin.replSetGetStatus()
  console.log(status)
  await client.close()
}

main().catch((err) => {
  console.log(err)
  process.exit(1)
})
