const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 10,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (email) => {
        return !Joi.string().email().validate(email).error;
      },
      msg: "Invalid email format",
    },
  },
  courses: [
    {
      type: String,
      ref: "Course", //需要和model名字一致
    },
  ],
});

const Model = mongoose.model('Student', schema);

module.exports = Model;