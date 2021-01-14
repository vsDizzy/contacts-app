import * as AWS from 'aws-sdk'
import * as awsServerlessExpressMiddleware from 'aws-serverless-express/middleware'
import * as bodyParser from 'body-parser'
import * as express from 'express'
import { v4 as generateId } from 'uuid'
import { ContactsRepo } from './contacts-repo'
import { SubscriberEndpoint } from './subscriber-endpoint'

AWS.config.update({ region: process.env.TABLE_REGION })

let tableName = 'contacts'
if (process.env.ENV && process.env.ENV !== 'NONE') {
  tableName = tableName + '-' + process.env.ENV
}

// declare a new express app
export const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

const dynamodb = new AWS.DynamoDB.DocumentClient()
const cr = new ContactsRepo(dynamodb, tableName)
const se = new SubscriberEndpoint(cr, generateId)

app.all(
  '/subscriber',
  wrapAsyncHandler(async (req, res) => {
    const { body, status } = await se.handle(req)
    res.status(status).json(body)
  })
)

function wrapAsyncHandler(handler: express.RequestHandler) {
  return function (req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next)
  } as express.RequestHandler
}
