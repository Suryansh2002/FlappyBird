export function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function randomChoice(array){
    return array[Math.floor(Math.random() * array.length)];
}