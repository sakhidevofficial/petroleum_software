export const getCurrentDate = () => {
    const today = new Date();
    
    // Get day, month, and year
    const day = String(today.getDate()).padStart(2, '0');  // Ensures two digits
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = today.getFullYear();
  
    // Return the date in "DD-MM-YYYY" format
    return `${day}-${month}-${year}`;
  }