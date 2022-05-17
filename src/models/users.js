import mongoose from 'mongoose';

const usersCollection = 'users';

const usersSchema = new mongoose.Schema({
    email: {
        type: String, 
        require: true, 
    },
    user: {
        type: String, 
        require: true, 
    },
    pass: {
        type: String, 
        require: true, 
    },
    adress: {
        type: String, 
        require: true, 
    },
    age: {
        type: Number,
        require: true,
    },
    telephone: {
        type: Number,
        require: true,
    },
    avatar: {
        type: String, 
        require: true, 
    }
})

const users = mongoose.model(usersCollection, usersSchema);

export default users;
