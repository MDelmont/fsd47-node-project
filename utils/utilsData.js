function formatBirthday(birthdate) {
    const options = { day: 'numeric', month: 'long' };
    const birthdateObj = new Date(birthdate);
    return birthdateObj.toLocaleDateString('fr-FR', options);
}

function formatDateYYYYMMDD(date) {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    calculateAge,
    formatDateYYYYMMDD
  }
  
