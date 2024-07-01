import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
const userSchema = new mongoose.Schema({
  gender: { 
    type: String,
     enum: ['male', 'female'], 
     required: true }, 

  firstname: { 
    type: String, 
    required: true },  

  lastname: { 
    type: String, 
    required: true },  

  email: { 
    type: String, 
    required: true, 
    unique: true },  

  password: { 
    type: String, 
    required: true },  

  phone: { 
    type: String, 
    required: true }, 

  birthdate: { 
    type: Date, 
    required: true }, 

  city: { 
    type: String, 
    required: true }, 

  country: { 
    type: String, 
    required: true }, 

  photo: { 
    type: String, 
    required: true },  

  category: { 
    type: String, 
    enum: ['Marketing', 'Client', 'Technique'], 
    required: true },  

  isAdmin: { 
    type: Boolean, 
    default: true }  
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