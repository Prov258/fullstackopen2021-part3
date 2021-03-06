require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

// eslint-disable-next-line no-unused-vars
morgan.token('data', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : null)

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/info', (req, res, next) => {
	Person.find({})
		.then(persons => {
			res.send(`
                <div>
                    Phonebook has info for ${persons.length} people
                </div>
                <br/>
                <div>
                    ${new Date()}
                </div>
            `)
		})
		.catch(error => next(error))
})

app.get('/api/persons', (req, res) => {
	Person
		.find({})
		.then(persons => res.json(persons))
})

app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id)
		.then(person => {
			if(person){
				res.json(person)
			} else{
				res.status(404).end()
			}
		})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(() => {
			res.status(204).end()
		})
		.catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
	const body = req.body

	const person = new Person({
		name: body.name,
		number: body.number,
	})

	person.save()
		.then(savedPerson => {
			res.json(savedPerson)
		})
		.catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
	console.log('put')
	const newPerson = {
		name: req.body.name,
		number: req.body.number
	}
	Person
		.findByIdAndUpdate(req.params.id, newPerson, { new: true })
		.then(updatedPerson => {
			res.json(updatedPerson)
		})
		.catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
	console.log(err.message)

	console.log(err.name)

	if(err.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' })
	} else if(err.name === 'ValidationError') {
		return res.status(400).json({ error: err.message })
	}

	next(err)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})