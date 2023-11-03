import mongoose from "mongoose"

let userSchema = new mongoose.Schema({
    firstName: {
        type: "String",
        maxlength: 15,
        minlength: 2
    },
    lastName: {
        type: "String",
        maxlength: 12,
        minlength: 2
    },
    phone: {
        type: String,
        // required: true,
        // unique: true,
    },
    email: {
        type: String,
        // required: true,
        // unique: true,
    },
    password: {
        type: String,
        // required: true,
    },
    address: {
        type: String,
        // required: true,
        // maxlength: 100,
        // minlength: 4,
    },

    userverified: {
        email: {
            type: Boolean,
            default: false
        },
        phone: {
            type: Boolean,
            default: false,
        },
    },

    userverifyToken: {
        email: {
            type: String
        },
        phone: {
            type: String
        },
    },




});

export default mongoose.model("users", userSchema, "users");