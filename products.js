const db = require('./db')

const { Product } = db

async function main() {

  const products = await Product.find({})

  for(var i = 0; i < products.length; i++) {

    const product = products[i]


    const new_price = [0].concat(product.price)

    console.log(product.name)
    console.log('price: ', new_price)

    await Product.updateOne({id: product.id}, {
      price: new_price
    })


    if (product.aff_price) {

      const new_aff_price = [0].concat(product.aff_price)

      console.log(product.name)
      console.log('new_aff_price: ', new_aff_price)

      await Product.updateOne({id: product.id}, {
        aff_price: new_aff_price
      })

    }


    if (product.desc_price) {

      const new_desc_price = [0].concat(product.desc_price)

      console.log(product.name)
      console.log('new_desc_price: ', new_desc_price)

      await Product.updateOne({id: product.id}, {
        desc_price: new_desc_price
      })

    }
  }
}

main()
