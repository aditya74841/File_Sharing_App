import mongoose from 'mongoose';


const DBConnection = async () => {
    const MONGO_URI = `mongodb+srv://aditya74810:aditya90060@file-sharing.8vipdzk.mongodb.net/?retryWrites=true&w=majority`;

  
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true });
        console.log('Database connected successfully after long time');
    } catch (error) {
        console.error("Error while connecting with the database", error.message);
    }
}

export default DBConnection;