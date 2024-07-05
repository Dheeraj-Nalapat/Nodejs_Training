import { FizzBuzz } from "./fizzbuzz";

describe("fizzbuzz test", () => {
  let fizzBuzz;
  beforeEach(() => {
    fizzBuzz = new FizzBuzz();
  });

  it('should return "Fizz" for numbers diviible by 3', () => {
    expect(fizzBuzz.fizzBuzz(3)).toBe("Fizz");
    expect(fizzBuzz.fizzBuzz(5)).toBe("Buzz");
    expect(fizzBuzz.fizzBuzz(15)).toBe("FizzBuzz");
  });
  it("shoudl do", () => {
    expect(fizzBuzz.fizzBuzz(2)).toBe(2);
  });
  it("should mock", () => {
    let mockFn = jest.fn(fizzBuzz.divisibleByThree).mockReturnValue(true);
    fizzBuzz.divisibleByThree = mockFn;
    expect(fizzBuzz.fizzBuzz(4)).toBe("Fizz");
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
