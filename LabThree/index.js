const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const resolvers = {
  Query: {
    getCustomers(root, args, context){
      return context.prisma.customers()
    },
    getOrders(root, args, context){
      return context.prisma.orders()
    },
    getProducts(root, args, context){
      return context.prisma.products()
    },
    //Part two returns the customr history of a specific customer history id
    his(root, args, context){
      return context.prisma.customerHistory({where:{id: args.customerHistoryId}})
    },
    //Part Three gets the order, customr and product from the customer history based on a specific histroy id
    getHistory(root, args, context){
      return context.prisma.customerHistories({where: {id: args.hisID}})
    },
    //Gets customer History based on customer id
    ordersByUsers(root, args,context){
      return context.prisma.customer({
        where:{customer: args.customerId}
      }).customerHistories()
    }
  },
  Mutation: {
    //Updates a customer and makes a new one
    createCustomer(root, args, context) {
      return context.prisma.createCustomer(
        { firstName: args.firstName,lastName: args.lastName, email: args.email, username: args.username, password: args.password
        }
      )
    }
  },
  createOrder(root, args, context){
    return context.prisma.createOrder(
      {orderId: args.orderId,orderItem: args.orderDate,orderDate: args.orderDate,netamount: args.netamount,tax: args.tax,totalAmount: args.totalAmount,customerId: args.customerId}
    )
  },
  createProducts(root, args, context){
    return context.prisma.createProducts(
      {prodId: args.prodId,title: args.title,category: args.category,actor: args.actor,price: args.price,special: args.special,commonProdId: args.commonProdId}
    )
  },
  //Part Four
  //makes a new customer history by getting the id of existing cutomer, product and order
  createCustomerOrderHistory(root, args, context){
    return context.prisma.createCustomerHistory({
      customerId: args.custID, orderId: args.ordID, prodId: proID
    })
  },
  CustomerHistory:{
    customerId(root,args,context){
      return context.prisma.customerHistory({
        id: root.id
      }).customerId()
    }
  }
}

//Part 5 the server
const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers,
  context: {
    prisma
  },
})
server.start(() => console.log('Server is running on http://localhost:4000'))


/** 
// A `main` function so that we can use async/await
async function main() {

  // Create a new user called `Alice`
  const newCustomerHistory = await prisma.createCustomerHistory({
     customer: {
       create: [{
        firstName: 'Alice',
        lastName: 'McCann',
        address1: '123 Road Street',
        address2: 'Blackrock',
        city: 'Dublin',
        zip: 123,
        country: 'Ireland',
        email: 'Alice@gmail.com',
        phone: '12345678',
        cardType: 3,
        card: 'Visa',
        cardExpiration: '02/22',
        username: 'Alice123',
        password: 'alice',
        age: 21,
        income: 21000,
        gender: 2
       }]
     },
     orders: {
       create: [{
        orderDate: '12/12/12',
        netamount: 1234,
        tax: 24,
        totalAmount: 1258
       },{
        orderDate: '10/11/15',
        netamount: 12,
        tax: 2,
        totalAmount: 14
       }]
     },
     products: {
       create: [{
        title: 'Pen',
        category: 'Stationary',
        actor: 'Bill',
        price: 50,
        special: 2,
        commonProdId: 123
       },{
        title: 'Pencil',
        category: 'Stationary',
        actor: 'George',
        price: 30,
        special: 1,
        commonProdId: 1325
       }
      ]
     },
    })
  console.log(`Created new customer history: ${newCustomerHistory.username} (ID: ${newCustomerHistory.id})`)

  // Read all users from the database and print them to the console
  const allCustomerHistory = await prisma.customerHistories()
  console.log(allCustomerHistory)

  //Read all products
  const allProducts = await prisma.products()
  console.log(allProducts)

  //Read all orders
  const allOrders = await prisma.orders()
  console.log(allOrders)
}

main().catch(e => console.error(e))
*/