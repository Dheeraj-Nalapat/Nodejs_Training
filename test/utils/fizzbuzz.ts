export class FizzBuzz {
  public fizzBuzz(num) {
    if (num % 3 == 0 && num % 5 == 0) {
      return "FizzBuzz";
    } else if (num % 5 == 0) {
      return "Buzz";
    } else if (this.divisibleByThree(num)) {
      return "Fizz";
    }
    return num;
  }
  divisibleByThree(num) {
    return num % 3 == 0;
  }
}

const fizzBuzz = new FizzBuzz();
// for (let i = 0; i < 20; i++) {
//   console.log(fizzBuzz.fizzBuzz(i));
// }
