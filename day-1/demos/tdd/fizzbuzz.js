function fizzBuzz(input) {
    let output = ""; 
    const isDivisByThree = input % 3 === 0;
    const isDivisByFive = input % 5 === 0;

    if (isDivisByThree) output = "Fizz";
    if (isDivisByFive) output += "Buzz";
    if(!isDivisByThree && !isDivisByFive) output = String(input)

    return output;
}

module.exports = {
    fizzBuzz
}















