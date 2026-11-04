// array objetos -mauro

const productos = [
    {id:1,imagen:"ASSETS\Products\bee-1024px.png", nombre: "Abeja", tipo:"Animal"},
    {id:2,imagen:"ASSETS\Products\cow-1024px.png", nombre: "Vaca", tipo:"Animal"},
    {id:3,imagen:"ASSETS\Products\poppy-1024.png", nombre: "Tulipan", tipo:"Planta"},
    {id:4,imagen:"ASSETS\Products\cactus-1024.png", nombre: "Cactus", tipo:"Planta"},
];

// transformacion del array a json
const jsonString = JSON.stringify(productos);

// prueba en print que el array sale en json
// console.log(jsonString);

console.log(productos);





