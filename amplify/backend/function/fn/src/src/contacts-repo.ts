import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Contact } from './contact'

export class ContactsRepo {
  constructor(public db: DocumentClient, public tableName: string) {}

  async getAll() {
    const res = await this.db
      .scan({
        TableName: this.tableName,
        Select: 'ALL_ATTRIBUTES',
      })
      .promise()
    return res.Items as Contact[]
  }

  async get(id: string): Promise<Contact> {
    const res = await this.db
      .get({ TableName: this.tableName, Key: { id } })
      .promise()
    return res.Item as Contact
  }

  async put(contact: Contact) {
    await this.db.put({ TableName: this.tableName, Item: contact }).promise()
  }
}
