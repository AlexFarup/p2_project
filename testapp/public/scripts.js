
let tid = 0;
let taellerTidOp = $('.Countdown');
let tidErStartet = true;

//Kalder updateCountdown hvergang der går 1000 milisekunder(1 sekunder)
let interval = setInterval(updaterTæller, 1000);

//Sender svar til database
$('#indsendSvar').click( () => { 
    tidErStartetFunc();
    ikkehint(); 
});


//Start timeren
function tidErStartetFunc(){
    if (tidErStartet == true){
        gemTid();
        tidErStartet = false;
    
    }else{
        tidErStartet = true;
    }
}

//Skriver 00 foran, hvis tiden er mindre end 100
function formatterTid(x){
    if(x < 100){
        return "00" + x;
    
    }else{
        return x;
    }
}

//Updaterer tiden
function updaterTæller(){

    let sekunder = tid;
    taellerTidOp.HTML = + formatterTid(sekunder);

    if (tidErStartet == true){
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
    let currentText = $(".currentTime").HTML;
    currentTime = currentText + taellerTidOp.HTML +  "<br/>";
    $("input[name='forventet_svar']").val(tid);
}

$('#hintKnappen').click( () =>jquest { 
    hentHint();              
});
    
    
function hentHint(){
    let x = $(".hintDiv");
    if (x.css("display") === 'none'){
        x.css("display", "block");
        ikkehint();
    }
} 

    
    
function ikkehint(){
    let hintklik = 0;
    let x = $(".hintDiv");

    if (x.css("display") === 'none'){
        hintklik = 0;
        $("input[name='hint_point']").val(hintklik);
   
    }else{
        hintklik = 1;
        $("input[name='hint_point']").val(hintklik);
    }
}
