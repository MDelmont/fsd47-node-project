import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
const userSchema = new mongoose.Schema({
  gender: { 
    type: String,
     enum: ['male', 'female'], 
     required: true }, 

  firstname: { 
    type: String, 
    required: true,
    maxlength: 50},  

  lastname: { 
    type: String, 
    required: true,
    maxlength: 50},

  email: { 
    type: String, 
    required: true, 
    unique: true,
    maxlength: 100}, 

  password: { 
    type: String, 
    required: true,
    maxlength: 100},  

  phone: { 
    type: String, 
    required: true,
    maxlength: 20 }, 

  birthdate: { 
    type: Date, 
    required: true }, 

  city: { 
    type: String, 
    required: true,
    maxlength: 50 }, 

  country: { 
    type: String, 
    required: true,
    maxlength: 50 }, 

  photo: { 
    type: String, 
    required: true,
    maxlength: 255 },  

  category: { 
    type: String, 
    enum: ['Marketing', 'Client', 'Technique'], 
    required: true },  

  isAdmin: { 
    type: Boolean, 
    default: false }  
}, {
  timestamps: true,  // get 3 fields in database : "createdAt"; "updatedAt"; "__v";
});


userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  });

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };
// Create model object
const UserModel = mongoose.model('Users', userSchema);

export default UserModel;