const mongoose = require('mongoose');

const Database = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to the database.');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
};

module.exports = Database;
