let mongoose = require("mongoose");

let Transaction = require("../models/transaction")

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb+srv://owner:V0A9gD2VOncz9zGq@cluster0.oa5wy.mongodb.net/account?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
);



let transactionSeed = [
    {
      name: "Starting Amount",
      value: 10000,
      date: Date.now()
    },
    {
      name: "payday deposit",
      value: 1500,
      date: Date.now(),
    }
]

Transaction.deleteMany({})
  .then(() => Transaction.collection.insertMany(transactionSeed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });