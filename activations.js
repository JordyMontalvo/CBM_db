const db = require('./db')

const { Activation } = db


async function main() {

  const activations = await Activation.find({})

  for(activation of activations) {
    console.log(activation.date.toString())

    if(activation.date.toString().includes('Sep')) {

      await Activation.updateOne({ id: activation.id },
        {
          closed: false,
        },
      )
    }
    else {
      console.log('closed ..')

      await Activation.updateOne({ id: activation.id },
        {
          closed: true,
        },
      )
    }
  }
}

main()
