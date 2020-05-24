//----------------------------------Oversigt opgaver----------------------------------

//Hides the right side of the page until a button is clicked
$('.container-right').hide();


//Shows the hidden concent, when selectec button is clicked
$('.matbox').click( () => { 
    $('.container-right').fadeIn();
});



//-----------------------------------Hjælpemidler-------------------------------------

$('.skjul').hide();

$('.addition').click( () => { 
    $('.skjul-addition').fadeIn();
    $('.skjul-division').hide();
    $('.skjul-substraktion').hide();
    $('.skjul-multiplikation').hide();
});


$('.substraktion').click( () => { 
    $('.skjul-substraktion').fadeIn();
    $('.skjul-division').hide();
    $('.skjul-addition').hide();
    $('.skjul-multiplikation').hide();
});

$('.multiplikation').click( () => { 
    $('.skjul-multiplikation').fadeIn();
    $('.skjul-division').hide();
    $('.skjul-addition').hide();
    $('.skjul-substraktion').hide();
});

$('.division').click( () => { 
    $('.skjul-division').fadeIn();
    $('.skjul-multiplikation').hide();
    $('.skjul-addition').hide();
    $('.skjul-substraktion').hide();
});

