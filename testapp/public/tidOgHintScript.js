let tid = 0;
let tællerEL = document.getElementById('Countdown');
let startStop = Boolean(true);

//Kalder updateCountdown hvergang der går 1000 milisekunder(1 sekunder)
let interval = setInterval(updaterTæller, 1000);

//Sender svar til database
$('#indsendSvar').click( () => { 
    startStopFunc();
    ikkehint(); 
});


//Start timeren
function startStopFunc(){
    if (startStop == true){
        gemTid();
        startStop = false;
    
    }else{
        startStop = true;
    }
}

//Skriver 00 foran, hvis tiden er mindre end 100
function formatterTid(x){
    if(x < 100){
        return '00' + x;
    
    }else{
        return x;
    }
}

//Updaterer tiden
function updaterTæller(){

    let sekunder = tid;
    tællerEL.innerHTML = + formatterTid(sekunder);

    if (startStop == true){
        //Gør så tiden kører så længe, at den ikke bliver stoppet
        if (tid != Infinity){
            tid++;
        
        }else{
            gemTid();
            clearInterval(interval);
        }
    }
}


function gemTid(){
    let currentText = document.getElementById('currentTime').innerHTML;
    currentTime = currentText + tællerEL.innerHTML +  '<br/>';
    document.getElementById('currentTime').value = tid;
}



$('#hintKnappen').click( () => { 
    hentHint();              
});
    
    
function hentHint(){
    let x = document.getElementById('hintDiv');
    if (x.style.display === 'none'){
        x.style.display = 'block';
        ikkehint();
    }
} 

    
    
function ikkehint(){
    let hintklik = 0;
    let x = document.getElementById('hintDiv');

    if(x.style.display == 'none'){
        hintklik = 0;
        document.getElementById('hintID').value = hintklik;
   
    }else{
        hintklik = 1;
        document.getElementById('hintID').value = hintklik;
    }
}


