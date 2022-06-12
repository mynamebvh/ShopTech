const calculatorVoucher = (type, discount, max, total) => {

  switch (type) {
    case "DISCOUNT":
      if(total / 100 * discount >= max){
        return max;
      }
      else {
        return total - (total / 100 * discount);
      }
      break;
    case "MONEY": 
      return total - discount;
      break;
    default:
      return null;
  }
}

module.exports = calculatorVoucher;