import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
const userSchema = new mongoose.Schema({
  gender: { 
    type: String,
     enum: ['male', 'female'], 
     required: true
    }, 

  firstname: { 
    type: String, 
    required: true,
    maxlength: [50,"La taille du prénom n'est pas valide 50, caractères maximum"]
  },  

  lastname: { 
    type: String, 
    required: true,
    maxlength: [50,"La taille du Nom n'est pas valide, 50 caractères maximum"]
  },

  email: { 
    type: String, 
    required: true, 
    unique: true,
    maxlength: [100,"La taille de l'email n'est pas valide, 100 caractères maximum"]
  }, 

  password: { 
    type: String, 
    required: true,
    maxlength: [100,"La taille du mot de passe n'est pas valide, 100 caractères maximum"]
  },  

  phone: { 
    type: String, 
    required: true,
    maxlength: [20,"La taille du numéro de téléphone n'est pas valide, 20 caractères maximum"]
  }, 

  birthdate: { 
    type: Date, 
    required: true
  }, 

  city: { 
    type: String, 
    required: true,
    maxlength: [50,"La taille de la photo n'est pas valide, 50 caractères maximum"]
  }, 

  country: { 
    type: String, 
    required: true,
    maxlength: [50,"La taille du pays n'est pas valide, 50 caractères maximum"]
  }, 

  photo: { 
    type: String, 
    required: true,
    maxlength:[ 255,"La taille de la photo n'est pas valide, 255 caractères maximum"]
  },  

  category: { 
    type: String, 
    enum: ['Marketing', 'Client', 'Technique'], 
    required: true
  },  

  isAdmin: { 
    type: Boolean, 
    default: false
  }  
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

// Method to compare passwords
userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };
// Create model object
const UserModel = mongoose.model('Users', userSchema);

export default UserModel;