

//-----------------------------------Hjælpemidler-------------------------------------
let addition = document.getElementById('addition');
let substraktion = document.getElementById('substraktion');
let multiplikation = document.getElementById('multiplikation');
let division = document.getElementById('division');

let additionsknap = document.getElementById('skjul-addition');
let substraktionsknap = document.getElementById('skjul-substraktion');
let multiplikationsknap = document.getElementById('skjul-multiplikation');
let divisionsknap = document.getElementById('skjul-division');

//Hvis plusknappen bliver trykket på
document.getElementById('addition').onclick = function(){
    console.log('clicked');
    additionsknap.style.visibility = 'visible';
    substraktionsknap.style.visibility = 'hidden';
    multiplikationsknap.style.visibility = 'hidden';
    divisionsknap.style.visibility = 'hidden';
};

document.getElementById('substraktion').onclick = function(){
    additionsknap.style.visibility = 'hidden';
    substraktionsknap.style.visibility = 'visible';
    multiplikationsknap.style.visibility = 'hidden';
    divisionsknap.style.visibility = 'hidden';
};

document.getElementById('multiplikation').onclick = function(){
    additionsknap.style.visibility = 'hidden';
    substraktionsknap.style.visibility = 'hidden';
    multiplikationsknap.style.visibility = 'visible';
    divisionsknap.style.visibility = 'hidden';
};

document.getElementById('division').onclick = function(){
    additionsknap.style.visibility = 'hidden';
    substraktionsknap.style.visibility = 'hidden';
    multiplikationsknap.style.visibility = 'hidden';
    divisionsknap.style.visibility = 'visible';
};

