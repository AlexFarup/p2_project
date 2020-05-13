
        function hentHint() {
            
            var x = document.getElementById("hintDiv");
            if (x.style.display === "none") {
              x.style.display = "block";

                ikkehint();

            } 
          }
        
            function ikkehint(){
            var hintklik = 0;
            var x = document.getElementById("hintDiv");

                if(x.style.display == "none"){
                    hintklik = 0;
                    document.getElementById("hintID").value = hintklik;
                }
                else{
                    hintklik = 1;
                    document.getElementById("hintID").value = hintklik;
                }
            }
        



        
            var tid = 0;

var tællerEL = document.getElementById('Countdown');

var startStop = Boolean(true);

//Kalder updateCountdown hvergang der går 1000 milisekunder(1 sekunder)
var interval = setInterval(updaterTæller, 1000);

function startStopFunc()
{
    if (startStop == true)
    {
        gemTid();
        startStop = false;
    }
    else
    {
        startStop = true;
    }
}

function formatterTid(x)
{
    if(x < 100)
    {
            return "00" + x;
        }
        else
    {
            return x;
        }
}

function updaterTæller() 
{
    let sekunder = tid;
    tællerEL.innerHTML = + formatterTid(sekunder);


    if (startStop == true)
    {
        if (tid != 120)
        {
            tid++;
        }
        else
        {
            gemTid();
            clearInterval(interval);
        }
    }
    else if (startStop == false)
    {

    }
}

function gemTid()
{
    let currentText = document.getElementById("currentTime").innerHTML;
    currentTime.innerHTML = currentText + tællerEL.innerHTML +  "<br/>";
    document.getElementById("currentTime").value = tid;
}



        