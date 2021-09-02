const bcrypt = require('bcrypt')
const clientsRouter = require('express').Router()
const Client = require('../models/client')

clientsRouter.post('/', async (req, res, next) => {
  const body = req.body

  const saltRound = 10
  const passwordHash = await bcrypt.hash(body.password, saltRound)

  const client = new Client({
    username: body.username,
    name: body.name,
    passwordHash,
    phone: body.phone,
    email: body.email
  })

  await client.save()
    .then(saved => res.json(saved))
    .catch(err => next(err))
})

clientsRouter.get('/', async (req, res) => {
  const clients = await Client.find({}).populate('bookings')

  res.json(clients.map(client => client.toJSON()))
})

clientsRouter.get('/:id', async(req,res,next)=>{
  
  try {
    const clients = await Client.findById(req.params.id).populate('bookings')
    res.json(clients)
  } catch (error) {
    next(error)
  }
})

module.exports = clientsRouter
