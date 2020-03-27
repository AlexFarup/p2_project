//Hides the right side of the page until a button is clicked
$('.container-right').hide();


//Shows the hidden concent, when selectec button is clicked
$('.matbox').click( () => { 
    $('.container-right').fadeIn();
});

    