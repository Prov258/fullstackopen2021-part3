const mongoose = require('mongoose')

if(process.argv.length < 3){
	console.log('Please provide the password as an argument: node mongo.js <password>')
	process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://flo2021:${password}@cluster0.nlrt3.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	number: String
})
const Person = mongoose.model('Person', personSchema)

if(process.argv.length >= 5){
	const name = process.argv[3]
	const number = process.argv[4]
	const person = new Person({ name, number })

	person.save().then(() => {
		console.log(`added ${name} number ${number} to phonebook`)
		mongoose.connection.close()
	})
}
if(process.argv.length === 3){
	Person
		.find({})
		.then(result => {
			console.log('phonebook:')
			result.forEach(item => {
				console.log(item.name, item.number)
			})
			mongoose.connection.close()
		})
}