const db = require('./db')

const { User, Affiliation } = db

function rand () { return Math.random().toString(36).substr(2) }

const dnis = [
  '1718780552',
]

async function main() {

  const users = await User.find({dni: { $in: dnis }})

  for(user of users) {

    console.log(user.name)

    // const affiliation = await Affiliation.findOne({userId: user.id})

    // console.log(affiliation)

    // // let plan = affiliation.plan
    // //     plan.id = "master"
    // //     plan.name = "ESTRELLA"
    // //     plan.amount = 500

    // // await Affiliation.updateOne({ id: affiliation.id }, {
    // //   plan,
    // // })

    await Affiliation.insert({
      date: new Date(),
      id: rand(),
      userId: user.id,
      price: 500,
      plan: {
        id: 'master',
        name: 'ESTRELLA',
        amount: 500,
      },
      voucher: null,
      office: 'central',
      status: 'approved',
      delivered: true,
    })
  }
}

main()
