// Une étoile qui défile de droite à gauche.
// Elle est déplacée par la boucle principale du jeu (robot.js),
// ce qui permet au bouton Stop de tout mettre en pause.
var UsineApiece = function (id) {
  this.id = id;
  this.taille = 53;
  this.x = 900;
  this.y = Math.floor((430 - 200) * Math.random()) + 200;
  this.active = true;

  this.image = document.createElement('img');
  this.image.src = 'img/pieces.png';
  this.image.id = 'piece' + id;
  this.image.className = 'piece';
  this.image.style.left = this.x + 'px';
  this.image.style.top = this.y + 'px';
  document.getElementById('paysage').appendChild(this.image);
};

// Déplacement vers la gauche ; l'étoile disparaît une fois sortie de l'écran
UsineApiece.prototype.mouv = function (vitesse) {
  this.x -= vitesse;
  this.image.style.left = this.x + 'px';
  if (this.x < -this.taille) {
    this.retire();
  }
};

// Collision avec le rectangle du robot
UsineApiece.prototype.touche = function (rect) {
  return rect.x < this.x + this.taille &&
    rect.x + rect.width > this.x &&
    rect.y < this.y + this.taille &&
    rect.y + rect.height > this.y;
};

UsineApiece.prototype.retire = function () {
  this.image.remove();
  this.active = false;
};
