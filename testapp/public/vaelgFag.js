//----------------------------------Oversigt opgaver----------------------------------

let matboks = document.getElementById('matboks');
let datboks = document.getElementById('datboks');
let hisboks = document.getElementById('hisboks');
let opgavesaet = document.getElementById('kasse-hoejer');

//Viser opgavesaettet, hvis matematikboksen bliver trykket på
document.getElementById('matboks').onclick = function(){
    opgavesaet.style.visibility = 'visible';
};
//Skjuler opgavesaettet. hvis danskboksen bliver trykket på
document.getElementById('datboks').onclick = function(){
    opgavesaet.style.visibility = 'hidden';
};
//Skjuler opgavesaettet. hvis historieboksen bliver trykket på
document.getElementById('hisboks').onclick = function(){
    opgavesaet.style.visibility = 'hidden';
};

