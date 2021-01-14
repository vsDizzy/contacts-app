import { Contact } from '../src/contact'
import type { ContactsRepo } from '../src/contacts-repo'
import { SubscriberEndpoint } from '../src/subscriber-endpoint'

const contacts = new Map<string, Contact>(
  [
    { id: '1', email: 'c1@mail.com', firstName: 'fn1', lastName: 'ln1' },
    { id: '2', email: 'c2@mail.com', firstName: 'fn2', lastName: 'ln2' },
    { id: '3', email: 'c3@mail.com', firstName: 'fn3', lastName: 'ln3' },
  ].map((x) => [x.id, x])
)

const contactsRepo = {
  async get(id) {
    return contacts.get(id)
  },
  async getAll() {
    return [...contacts.values()]
  },
  async put(item: Contact) {},
} as ContactsRepo

function generateId() {
  return '456'
}

describe(SubscriberEndpoint.name, () => {
  const se = new SubscriberEndpoint(contactsRepo, generateId)

  it('gets all contacts', async () => {
    const r = await se.get({ query: {} })
    expect(r).toEqual({
      status: 200,
      body: [
        { id: '1', email: 'c1@mail.com', firstName: 'fn1', lastName: 'ln1' },
        { id: '2', email: 'c2@mail.com', firstName: 'fn2', lastName: 'ln2' },
        { id: '3', email: 'c3@mail.com', firstName: 'fn3', lastName: 'ln3' },
      ],
    })
  })

  it('gets single contact', async () => {
    const r = await se.get({ query: { id: '2' } })
    expect(r).toEqual({
      status: 200,
      body: {
        id: '2',
        email: 'c2@mail.com',
        firstName: 'fn2',
        lastName: 'ln2',
      },
    })
  })

  it('returns 404 when contact is not found', async () => {
    const r = await se.get({ query: { id: 'unexisting' } })
    expect(r).toEqual({
      status: 404,
    })
  })

  it('creates new contact', async () => {
    const r = await se.post({
      body: {
        email: 'email',
        firstName: 'Jack',
        lastName: 'Brown',
      },
    })
    expect(r).toEqual({
      status: 200,
      body: {
        id: '456',
        email: 'email',
        firstName: 'Jack',
        lastName: 'Brown',
      },
    })
  })

  it('returns 400 when email is not specified', async () => {
    const r = await se.post({
      body: {
        firstName: 'Jack',
        lastName: 'Brown',
      },
    })
    expect(r.status).toEqual(400)
  })
})
