const { MongoClient } = require('mongodb')

let db, client

class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    const user = await this.userModel.findOne({ email })
    return user
  }
}

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)
  return {
    userModel,
    sut
  }
}

describe('LoadUserByEmail Repository', () => {
  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = await client.db()
  })
  beforeEach(async () => {
    db.collection('users').deleteMany()
  })
  afterAll(async () => {
    await client.close()
  })
  test('Should return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load()
    expect(user).toBeNull()
  })
  test('Should an return user if user is found', async () => {
    const { sut, userModel } = makeSut()
    await userModel.insertOne({
      email: 'valid_email@email.com'
    })
    const user = await sut.load('valid_email@email.com')
    expect(user.email).toBe('valid_email@email.com')
  })
})