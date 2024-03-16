export const num = [1,2,3,4,5,6,7,8,9]
const errrr = 3;
const numbers = []

for(let i = 0; i < num.length; i++){
  if(num[i] === errrr){
    console.log('ja existe')
    continue
  } else {
    console.log('n existe');
    numbers.push(num[i]);
  }
}

console.log(numbers)