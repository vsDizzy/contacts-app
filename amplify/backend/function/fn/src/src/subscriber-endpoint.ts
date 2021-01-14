import { ContactsRepo } from './contacts-repo'

export class SubscriberEndpoint {
  constructor(public contacts: ContactsRepo, public generateId: () => string) {}

  async handle(req) {
    switch (req.method) {
      case 'GET':
        return this.get(req)
      case 'POST':
        return this.post(req)
      default:
        return { status: 405 }
    }
  }

  async get(req) {
    const id = req.query.id
    return id
      ? this.getItem(id)
      : {
          status: 200,
          body: await this.contacts.getAll(),
        }
  }

  private async getItem(id: string) {
    const item = await this.contacts.get(id)
    return item
      ? {
          status: 200,
          body: item,
        }
      : { status: 404 }
  }

  async post(req) {
    const { email, firstName, lastName } = req.body
    if (!email) {
      return {
        status: 400,
        body: { error: "'email' field is required." },
      }
    }

    const item = { id: this.generateId(), email, firstName, lastName }
    await this.contacts.put(item)
    return {
      status: 200,
      body: item,
    }
  }
}
