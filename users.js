const db = require('./db')

const { User } = db


const dnis = [
  '1718780552',
]

// async function main() {

//   const users = await User.find({dni: { $in: dnis }})

//   for(user of users) {

//     console.log(user.name, user.lastName, user.dni)
//     console.log(user.plan)

//     await User.updateOne({ id: user.id }, {
//       // plan: "master",
//       affiliation_points: 0,
//       // n: 5,
//       // affiliated: true,
//       // _activated: false,
//       // activated: false,
//     })
//   }
// }

// main()


async function main() {

  for(dni of dnis) {

    const user = await User.findOne({ dni })
    const { name, affiliated, plan } = user
    console.log(name, affiliated, plan)
    console.log(' ')

    // const id = rand()


    // await Affiliation.insert({
    //   date: new Date(),
    //   id,
    //   userId: user.id,
    //   plan: {
    //     id: 'business',
    //     name: 'PREMIUM',
    //   },
    //   voucher: null,
    //   office: 'central',
    //   status: 'approved',
    //   delivered: true,
    // })

    await User.updateOne({ id: user.id }, {
      // affiliated: true,
      // activated: false,
      affiliation_date: new Date(),
      plan: 'master',
      n: 5,
      // affiliation_points: 0,
    })

  }

}

main()
