const db = require('./db')

const { User, Transaction } = db

async function main() {

  const transactions = await Transaction.find({ value: -28 })

  console.log({ transactions })

  // // const transactions = await Transaction.find({ virtual: true, type: 'in' })
  // const transactions = await Transaction.find({ name: 'residual' })

  // transactions.sort(function(a,b){
  //   return new Date(a.date) - new Date(b.date)
  // })

  // for (const transaction of transactions) {
  //   if(transaction.value) {
  //     console.log(transaction.date, transaction.value)
  //   }
  // }

}

main()

// async function main() {

//   // const users = await User.find({})

//   const transactions = await Transaction.find({ virtual: true, type: 'in' })
//   // const transactions = await Transaction.find({ name: 'residual' })

//   for (const transaction of transactions) {
//     // const user = users.find(e => e.id == transaction.user_id)

//     // console.log(transaction.date.toString())
//     // console.log(user.name)
//     // console.log(transaction.value)
//     // console.log('')

//     if (transaction.date.toString().includes("Wed Nov 15")) {
//       console.log(transaction.date)

//       await Transaction.deleteOne({ id: transaction.id })
//     }
//   }

//   // await Transaction.updateMany(
//   //   { value: null },
//   //   { $set: { value: 0 } }
//   // )


//   // // get users
//   // const users = await User.find({})

//   // for(user of users) {

//   //   console.log(user.name)

//   //   // const all_points = [{ val: user.points, payed: false }]

//   //   await User.updateOne(
//   //     { id: user.id },
//   //     // { all_points }
//   //     // {affiliation_points: 0}
//   //     {affiliation_points: 0}
//   //   )

//   // }
// }






// const db = require('./db')

// const { User } = db


// async function main() {

//   // get users
//   const users = await User.find({})

//   for(user of users) {
//     // console.log(user.name)

//     const affiliated = user.affiliated
//     // console.log('affiliated: ', affiliated)

//     if(!affiliated) {
//       const date1 = new Date(user.date)
//       const date2 = new Date()
//       const diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24), 10)

//       // console.log({ diffDays })

//       if(diffDays >= 30) {

//         console.log(user.name)
//         console.log({ diffDays })

//         // await User.deleteOne({ id: user.id })
//       }
//     }
//   }
// }

// main()
