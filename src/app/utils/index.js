export const CommaSeparator = (value) => {
    if (isNaN(value)) {
      return 0
    }
    else {
      let result = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2
      }).format(value)
  
      return result
    }
  
  
  
  }