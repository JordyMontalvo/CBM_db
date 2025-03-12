const db = require('./db')

const { User, Tree, Transaction, Activation } = db

let tree

const Pay = {
  'star'  : 15,
  'master': 30,
  'silver': 45,
  'gold'  : 100,
}

let r = {
  'active': [0.03, 0.01, 0.01                                                                   ],
  'star':   [0.05, 0.06, 0.08, 0.03, 0.005, 0.005                                               ],
  'master': [0.05, 0.06, 0.10, 0.07, 0.03,  0.01,  0.01, 0.005, 0.005                           ],
  'silver': [0.05, 0.06, 0.12, 0.10, 0.03,  0.01,  0.01, 0.01,  0.01, 0.005, 0.005              ],
  'gold':   [0.05, 0.07, 0.13, 0.10, 0.03,  0.015, 0.01, 0.01,  0.01, 0.005, 0.005, 0.005, 0.005],
}


function total_points(id) {

  const node = tree.find(e => e.id == id)

  if(!node) return

  node.total_points = node.points + node.affiliation_points

  node.childs.forEach(_id => {
    node.total_points += total_points(_id)
  })

  return node.total_points
}


function calc_range(arr, p, name, id) {
  // if(name == 'Carmen Maira  Lastre chiriboga') console.log(':)')
  console.log(name)
  if(id == '0ow9elu3tc4i') {
    console.log(arr)
    console.log(p)
  }

  const n = arr.length

  if(n >= 3 && arr.reduce((a, b, c) => a + (b > (c == 0 ? 0.35 : 0.34) * 3300 ? (c == 0 ? 0.35 : 0.34) * 3300 : b), 0) >= 3300) return 'gold'
  if(n >= 3 && arr.reduce((a, b, c) => a + (b > (c == 0 ? 0.40 : 0.34) * 1800 ? (c == 0 ? 0.40 : 0.34) * 1800 : b), 0) >= 1800) return 'silver'
  if(n >= 2 && arr.reduce((a, b, c) => a + (b > (c == 0 ? 0.55 : 0.50) * 900  ? (c == 0 ? 0.55 : 0.50) * 900  : b), 0) >= 900 ) return 'master'
  if(n >= 2 && arr.reduce((a, b, c) => a + (b > (c == 0 ? 0.66 : 0.50) * 300  ? (c == 0 ? 0.66 : 0.50) * 300  : b), 0) >= 300 ) return 'star'

  return 'active'
}


function rank(node) {

  if(node._activated || node.activated) node.rank = calc_range(node.total, node.points, node.name, node.id)
  else node.rank = 'none'

  node.childs.forEach(_id => {
    const _node = tree.find(e => e.id == _id)
    rank(_node)
  })
}


function levels() {
  for(node of tree) {
    if(node.rank == 'gold')   node.levels = 13
    if(node.rank == 'silver') node.levels = 11
    if(node.rank == 'master') node.levels = 9
    if(node.rank == 'star')   node.levels = 6
    if(node.rank == 'active') node.levels = 3
  }
}



function pay_residual(id, n, val) {

  if(n == 13) return

  let node = tree.find(e => e.id == id)
  let _id  = node.parent
  // if(node._activated) console.log('_activated', node.name)
  if(node._activated || node.activated) {

    let rr = node.activated ? 1 : 0.5
    // console.log(node.name, node.activated, rr)

    if(node.levels > n) {
      node.residual_bonus += r[node.rank][n] * val * rr
    }

    if(_id) pay_residual(_id, n+1, val)

  } else {

    if(_id) pay_residual(_id, n, val)
  }
}


async function main() {

  const users = await User.find({ tree: true })
        tree  = await Tree.find({})

  tree.forEach(node => {
    const user = users.find(e => e.id == node.id)

    node.name               = user.name + ' ' + user.lastName
    node.activated          = user.activated
    node._activated         = user._activated ? user._activated : false
    node.points             = Number(user.points)
    node.affiliation_points = user.affiliation_points ? user.affiliation_points : 0
    node.closeds            = user.closeds ? user.closeds : []
    node.pays               = user.pays ? user.pays : [
                                                        {
                                                          'name' : 'star',
                                                          'payed':  false,
                                                        },
                                                        {
                                                          'name' : 'master',
                                                          'payed':  false,
                                                        },
                                                        {
                                                          'name' : 'silver',
                                                          'payed':  false,
                                                        },
                                                        {
                                                          'name' : 'gold',
                                                          'payed':  false,
                                                        },
                                                      ]
    node.n_inactives        = user.n_inactives ? user.n_inactives : 0
    node.residual_bonus     = 0

  })

  // calculate total points
  total_points('5f0e0b67af92089b5866bcd0')


  tree.forEach(node => {

    node.total = []
    node._total = []

    node.childs.forEach(_id => {

      const _node = tree.find(e => e.id == _id)

      node.total.push(_node.total_points)
      node._total.push(_node.total_points)
    })
    node.total.sort((a, b) => a - b)
  })

  rank(tree[0])

  for(let node of tree) {
    console.log(node.name, ' - ', node.rank)
    console.log('')
  }

  levels()

  for(node of tree) if(node.parent) pay_residual(node.parent, 0, node.points)


  for(node of tree) {

    // console.log(node.name)

    const { rank } = node

    if(rank != 'none') {

      // console.log(node.name, '-', node.rank)
      console.log(node.name)
      console.log(node.rank)
      // console.log(node._total)
      console.log('bono residual: ', node.residual_bonus)
      // console.log(node.pays)


      await Transaction.insert({
        date:    new Date(),
        user_id: node.id,
        type:   'in',
        value:   node.residual_bonus,
        name:   'residual',
      })


      const pos = node.pays.findIndex(e => e.name == rank)/*; console.log({ pos })*/

      if(pos != -1) {

        for(i = 0; i <= pos; i++) {

          const pay = node.pays[i]

          if(!pay.payed) {

            const value = Pay[pay.name]
            console.log('bono rango: ', value)

            await Transaction.insert({
              date:    new Date(),
              user_id: node.id,
              type:   'in',
              value:   value,
              name:   'closed bonus',
            })

            pay.payed = true
          }
        }
      }

      // console.log(node.pays)

      node.closeds.push({
        date: new Date(),
        arr:  node._total,
        rank: node.rank,
      })

      // console.log(node.closeds)
    }

    if(!node.activated) node.n_inactives + 1

    console.log('.........')

    await User.updateOne(
      { id: node.id },
      {
        activated:          false,
        _activated:         false,
        rank:               node.rank,
        points:             0,
        affiliation_points: 0,
        pays:               node.pays,
        closeds:            node.closeds,
        n_inactives:        node.n_inactives,
      },
    )

    if(node.n_inactives == 6) {

      await User.updateOne(
        { id: node.id },
        {
          password: null,
        },
      )

      await Session.deleteMany({ id: node.id })
    }

    // console.log('......')
    console.log('')
  }


  await Activation.updateMany(
    {},
    {
      closed: true,
    },
  )
}

main()
