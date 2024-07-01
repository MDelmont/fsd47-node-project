function formatBirthday(birthdate) {
    const options = { day: 'numeric', month: 'long' };
    const birthdateObj = new Date(birthdate);
    return birthdateObj.toLocaleDateString('fr-FR', options);
}
function calculateAge(birthdate) {
    const birthdateObj = new Date(birthdate);
    const now = new Date();
    
    let age = now.getFullYear() - birthdateObj.getFullYear();
    
    if (now.getMonth() < birthdateObj.getMonth() || 
        (now.getMonth() === birthdateObj.getMonth() && now.getDate() < birthdateObj.getDate())) {
        age--;
    }
    
    return age;
}
export default  {
    formatBirthday,
    calculateAge
  }
  
