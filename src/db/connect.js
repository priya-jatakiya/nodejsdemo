const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGODB_CONN_URL);
        //console.log('Connected Successfully ...!!');
    } catch (connErr) {
        console.error('Connection Error: ', connErr.message);
        process.exit(1)
    }
}

module.exports = connectDB