/**
 * check filed in form
 * @param {*} req 
 * @param {*} requiredFields List of string
 * @returns list of missing field
 */
const checkMissingField = (req, requiredFields) => {
    const missingFields = [];
  
    for (const field of requiredFields) {
        if (req.body[field] === null || req.body[field] === undefined || req.body[field].trim() === "") {
            missingFields.push(field);
        }
    }
    return missingFields
    
  };

    /**
   * Check if the password respect condition for register
   * @param {string} password 
   * @param {string} password2 
   */
const checkPasswordCondition = async (password,password2) => {
    let errors = [];
    // Check if the passwords match
    if (password !== password2) {
      errors.push({ msg: "Les mot de passe doivent etre identique" });
    }
    // Check length of password
    if (password.length < 6) {
      errors.push({ msg: "La taille du mot de passe doit etre au minimum de 6 caractère" });
    }
    return errors
}


  /**
 * Check if the gender is good value
 * @param {string} gender 
 */
  const checkGenderValue = async (gender) => {
    let errors = [];
    // Check the gender value
    if (!['male', 'female'].includes(gender)) {
      errors.push({ msg: "Le genre doit être homme ou femme." });
    }
    return errors
}

  /**
 * Check if the category is good value
 * @param {string} category 
 */
  const checkCategoryValue = async (category) => {
    let errors = [];
    // Check the category value
    if (!['Marketing', 'Client', 'Technique'].includes(category)) {
      errors.push({ msg: "La catégorie doit être Marketing, client ou technique." });
    }
    return errors
}


/**
 * Check if the phone is good value
 * @param {string} phone 
 */
  const checkPhoneFormat = async (phone) => {
    let errors = [];

    const phoneRegex = /^\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$/

    if (!phoneRegex.test(phone)) {
      errors.push({ msg: "Le numéro de téléphone n'est pas dans un format valide. format : XX-XX-XX-XX-XX" });
    }
    return errors
}

/**
 * Check date format
 * @param {string} dateStr 
 */
const checkDateFormat = async (dateStr) => {
  let errors = [];
  // Example of a simple regex for date format YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  // Check if the date string matches the expected format
  if (!dateRegex.test(dateStr)) {
    errors.push({ msg: "La date d'anniversaire n'est pas dans un format valide (YYYY-MM-DD)." });
  } else {
    // Additional check for valid date (not just format)
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) {
      errors.push({ msg: "La date d'anniversaire spécifiée n'est pas valide." });
    }
  }

  return errors;
}

/**
 * Check URL format
 * @param {string} urlStr 
 */
const checkUrlFormat = async (urlStr) => {
  let errors = [];
  // This regex allows URLs that start with http:// or https://
  // and have any valid characters afterwards
  const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$/;

  // Check if the URL string matches the expected format
  if (!urlRegex.test(urlStr)) {
    errors.push({ msg: "L'URL de la photo n'est pas dans un format valide." });
  }

  return errors;
}
export default  {
  checkMissingField,
  checkPasswordCondition,
  checkGenderValue,
  checkPhoneFormat,
  checkDateFormat,
  checkUrlFormat,
  checkCategoryValue,
}

