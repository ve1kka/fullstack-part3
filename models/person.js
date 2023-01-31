const mongoose = require("mongoose")

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log("connecting to", url)

mongoose
  .connect(url)
  .then((_result) => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message)
  })

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  number: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{2}-\d{5}\d*|^\d{3}-\d{4}\d*/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
})

personSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Person", personSchema)