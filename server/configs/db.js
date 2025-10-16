import mongoose from 'mongoose';


mongoose.connection.on('connected', () => {
    console.log("Database Connected Successfully");
});

mongoose.connection.on('error', (err) => {
    console.error("Database connection error:", err);
});

const connectDB = async () => {
    try {
        let mongodbURI = process.env.MONGODB_URI;
        const projectName = 'resume-builder'; 
        if (!mongodbURI) {
            throw new Error("MONGOD_URI environment variable not set");
        }

       
        if (mongodbURI.endsWith('/')) {
            mongodbURI = mongodbURI.slice(0, -1);
        }

       
        await mongoose.connect(`${mongodbURI}/${projectName}`);

    } catch (error) {
        // ✅ 2. Log the specific error that caused the failure.
        console.error("Failed to connect to the database.", error);
        
        // ✅ 3. Exit the process
        process.exit(1);
    }
};

export default connectDB;