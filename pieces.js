
var UsineApiece = function(id,rect1) {
  this.id = id;
  this.image = document.createElement("img");
  this.image.src = 'img/pieces.png';
  this.image.setAttribute('id', ('piece'+id))
  this.image.style.position = 'absolute';
  this.image.style.left = 900 + 'px';
  this.image.style.top = (Math.floor((430-200)*Math.random())+200) + 'px';
  this.image.style.width = 53 + 'px';
  this.image.style.height = 53 + 'px';
  this.vie = true;
  document.getElementById("paysage").appendChild(this.image);
  this.compteurPx = 0;
  this.visible = true;
  this.rect1 = rect1;
  this.cache = function(){
    this.image.remove();
    this.visible = false;
  };

};
var monscore = 0;

// Gestion des collisitons
UsineApiece.prototype.collision = function () {

    var afficheScore = function(){
      window.document.getElementById('score').innerHTML = 'Score : ' + monscore;
    }

    var rect2 = {
      x: parseFloat(this.image.style.left),
      y: parseFloat(this.image.style.top),
      width: parseFloat(this.image.style.width),
      height: parseFloat(this.image.style.height)
    }

    if (this.rect1.x < rect2.x + rect2.width &&
      this.rect1.x + this.rect1.width > rect2.x &&
      this.rect1.y < rect2.y + rect2.height &&
      this.rect1.height + this.rect1.y > rect2.y) {
        // console.log(this.vie);
        // collision détectée !
        this.vie = false;
        if(!this.vie){

          monscore++;
         //console.log(monscore);

        }
      }
   
    if(monscore >= 5){
        
        var cv = document.createElement("img");
        cv.src = 'img/cv.png';
        cv.style.position = 'absolute';
        
  document.getElementById("paysage").appendChild(cv);
        
    }
afficheScore();
  };


// Gestion de mouvement des étoiles
UsineApiece.prototype.mouv = function (jeu) { 
        if (this.compteurPx <= 1000) {
            if(jeu){
                this.compteurPx += 10; 
            }
             
        }
    
      this.image.style.left =  900 - this.compteurPx + "px";

};
//Gestion des appels en boucles des étoiles
UsineApiece.prototype.miseAjour = function (jeu) {
  var piece = this;

  var idSetInterval = setInterval(function () {
    //  piece.mouv();
  //    piece.collision();
      if (piece.vie) {
          
        piece.mouv(jeu);
        piece.collision();
          
      }else if (piece.visible){

        piece.cache();

      }

    }, 60);

};





