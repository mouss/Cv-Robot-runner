window.document.addEventListener('DOMContentLoaded', function(){


//Robot
  var masque = window.document.getElementById('container');
  var image = window.document.getElementById('contenu');
  masque.style.left = 450 + 'px';
  masque.style.overflow = 'hidden';
  masque.style.position = 'absolute';
  masque.style.top = 390 + 'px';

// Déclarations des variables Globals
var positionY = 500.0;
var velocityY = 0.0;
var gravity = 0.4;
var onGround = false;
var monscore = 0;
var jeu = false;

    
    // Animation du sprite
var setPosition = function(positions,selection){
  var masque = window.document.getElementById('container');
  var image = window.document.getElementById('contenu');

  masque.style.width = positions[selection].masque.width+'px';
  masque.style.height = positions[selection].masque.height+'px';
  image.style.top = positions[selection].image.top+'px';
  image.style.left = positions[selection].image.left+'px';

};

var steady = function(){
  position = 0;
  var positions = [{
    masque:{
      width:115,
      height:115
    },
    image:{
      top:-118,
      left:0
    },
    masque:{
      width:109,
      height:115
    },
    image:{
      top:-118,
      left:0
    }
  }];

  setPosition(positions,0);
};

steady();


var animLeftOrRight = function(position){

  var positions = [{
    masque:{
      width:66,
      height:107
    },
    image:{
      top:-342,
      left:-14
    }
  },{
    masque:{
      width:69,
      height:107
    },
    image:{
      top:-342,
      left:-132
    }
  },{
    masque:{
      width:82,
      height:107
    },
    image:{
      top:-342,
      left:-230
    }
  },{
    masque:{
      width:72,
      height:107
    },
    image:{
      top:-342,
      left:-342
    }
  },{
    masque:{
      width:71,
      height:107
    },
    image:{
      top:-342,
      left:-454
    }
  },{
    masque:{
      width:83,
      height:107
    },
    image:{
      top:-342,
      left:-558
    }
  },{
    masque:{
      width:84,
      height:107
    },
    image:{
      top:-342,
      left:-661
    }
  },{
    masque:{
      width:80,
      height:107
    },
    image:{
      top:-342,
      left:-778
    }


  }];

  if(position >= 8){
    position = 0;
  };

  setPosition(positions,position);

  return position + 1;
};

var animLeft = function(position){
  return animLeftOrRight(position,true);
};


// Lancement du saut avec la fleche du haut
 window.onkeydown = function(event){
var x = event.keyCode;
    if (x == 38) {
        jump();

    }

  };

  var gimage = 0;
  var fondPaysage = window.document.getElementById('lefond');
//Animation du paysage
  var animFond = function(){
    if(gimage >= 1000){
      gimage = 0;
    }else {
      gimage = gimage + 10;
    }

    fondPaysage.style.left = - gimage + "px";

  };

//Position du Robot
  var rect1 = {
    x: parseFloat(masque.style.left),
    y: parseFloat(masque.style.top),
    width: parseFloat(masque.style.width),
    height: parseFloat(masque.style.height)
  }


  // Création des étoiles
  var j = 0;
  var mespieces = [];

  var x = setInterval(function () {
    if(j<10){
        if(jeu){
            var piece = new UsineApiece(j,rect1);
            piece.miseAjour(jeu);
            mespieces.push(piece);
            j++;
        }

    }else {
      clearInterval(x);
    }
  }, 2000);



//appel de la boucle
loop(); 

// Gestion du saut
function jump(){

  if(onGround){
      velocityY = -12.0;
      onGround = false;

  }
}

// Boucle qui appel en boucle le paysage et l'écoute du saut
function loop(){

    if(jeu){
        animFond();
        update();
        render();
    
    }

 window.setTimeout(loop, 60);
}

function update() {
  velocityY += gravity;
  positionY += velocityY;

  if(positionY > 400.0){
    positionY = 400.0;
    velocityY = 0.0;
    onGround = true;
    position = animLeft(position);
  }

}

function render(){
  masque.style.top = positionY + "px";
  rect1.y = parseFloat(masque.style.top);
  
}
    // Pause du Jeu
  var stop = window.document.getElementById('stop');
     stop.onclick = function(){
     jeu=false;
     };
    // Lancement du Jeu
    var start = window.document.getElementById('start');
     start.onclick = function(){
     jeu=true;
     };


});