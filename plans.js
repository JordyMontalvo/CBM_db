const db = require('./db')

const { Plan } = db

async function main() {
  console.log('main ...')

  const plans = [
    {
      id: "pre-basic",
      name: "PLAN PILOTO 90",
      amount: 28,
      img: "https://ik.imagekit.io/asu/lehaim/plan2_Ekks6_hF5.png",
      affiliation_points: 0,
      n: 0,
      products: [
      ],
      kit: 20,
    },
    {
      id: "basic",
      name: "BÁSICO",
      amount: 50,
      img: "https://ik.imagekit.io/asu/lehaim/plan2_Ekks6_hF5.png",
      affiliation_points: 50,
      n: 1,
      products: [
      ],
      kit: 20,
    },
    {
      id: "standard",
      name: "ESTÁNDAR",
      amount: 150,
      img: "https://ik.imagekit.io/asu/lehaim/plan3_exL_uYDGf.png",
      affiliation_points: 150,
      n: 3,
      products: [
      ],
      kit: 20,
    },
    {
      id: "business",
      name: "PREMIUM",
      amount: 300,
      img: "https://ik.imagekit.io/asu/lehaim/plan1_JQFiCaVcH.png",
      affiliation_points: 300,
      n: 4,
      products: [
      ],
      kit: 20,
    },
    {
      id: "master",
      name: "ESTRELLA",
      amount: 500,
      img: "https://ik.imagekit.io/asu/lehaim/plan2_Ekks6_hF5.png",
      affiliation_points: 500,
      n: 5,
      products: [
        // {
        //   id: 1001,
        //   total: 1,
        // },
      ],
      kit: 20,
    },
  ]

  for(var i = 0; i < plans.length; i++) {
    console.log('...')
    await Plan.insert(plans[i])
  }

}

main()
