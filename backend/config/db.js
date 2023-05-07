const mongoose = require('mongoose')

const connetDB = async() =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            UseNewUrlParser: true,
            UseUnifiedTopology: true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Errors: ${error}`);
        process.exit();
    }
};

module.exports = connetDB;
