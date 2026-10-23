window.document.addEventListener('DOMContentLoaded', function () {

  // Éléments de la page
  var masque = document.getElementById('container');
  var image = document.getElementById('contenu');
  var fondPaysage = document.getElementById('lefond');
  var sol = document.getElementById('sol');
  var paysage = document.getElementById('paysage');
  var zoneJeu = document.getElementById('globalanime');
  var scoreEl = document.getElementById('score');

  masque.style.left = 450 + 'px';
  masque.style.top = 400 + 'px';

  // Réglages
  var VITESSE = 10;          // pixels par image
  var SOL_Y = 400.0;         // position du robot au sol
  var DELAI_ETOILE = 33;     // une étoile toutes les ~2 s (33 x 60 ms)
  var ETOILES_POUR_CV = 5;

  // État du jeu
  var positionY = SOL_Y;
  var velocityY = 0.0;
  var gravity = 0.4;
  var onGround = true;
  var position = 0;          // image courante de l'animation de course
  var jeu = false;           // true quand la partie tourne
  var termine = false;       // true quand le CV est affiché
  var monscore = 0;
  var mespieces = [];
  var compteurEtoiles = DELAI_ETOILE - 1;
  var prochainId = 0;
  var gimage = 0;
  var gsol = 0;
  var cvImage = null;

  // Zone de collision du robot : suit la taille de l'image affichée
  var rect1 = {
    x: parseFloat(masque.style.left),
    y: parseFloat(masque.style.top),
    width: 0,
    height: 0
  };

  // Animation du sprite
  var setPosition = function (positions, selection) {
    masque.style.width = positions[selection].masque.width + 'px';
    masque.style.height = positions[selection].masque.height + 'px';
    rect1.width = positions[selection].masque.width;
    rect1.height = positions[selection].masque.height;
    image.style.top = positions[selection].image.top + 'px';
    image.style.left = positions[selection].image.left + 'px';
  };

  var steady = function () {
    setPosition([{
      masque: { width: 109, height: 115 },
      image: { top: -118, left: 0 }
    }], 0);
  };

  var positionsCourse = [
    { masque: { width: 66, height: 107 }, image: { top: -342, left: -14 } },
    { masque: { width: 69, height: 107 }, image: { top: -342, left: -132 } },
    { masque: { width: 82, height: 107 }, image: { top: -342, left: -230 } },
    { masque: { width: 72, height: 107 }, image: { top: -342, left: -342 } },
    { masque: { width: 71, height: 107 }, image: { top: -342, left: -454 } },
    { masque: { width: 83, height: 107 }, image: { top: -342, left: -558 } },
    { masque: { width: 84, height: 107 }, image: { top: -342, left: -661 } },
    { masque: { width: 80, height: 107 }, image: { top: -342, left: -778 } }
  ];

  var animCourse = function (pos) {
    if (pos >= positionsCourse.length) {
      pos = 0;
    }
    setPosition(positionsCourse, pos);
    return pos + 1;
  };

  steady();

  // Défilement du paysage et du sol
  var animFond = function () {
    gimage = gimage >= 1000 ? 0 : gimage + VITESSE;
    fondPaysage.style.left = -gimage + 'px';

    gsol = (gsol + VITESSE) % 50; // BGTile.png fait 50 px de large
    sol.style.backgroundPositionX = -gsol + 'px';
  };

  var afficheScore = function () {
    scoreEl.textContent = 'Score : ' + monscore + ' / ' + ETOILES_POUR_CV;
  };

  // Étoiles : une nouvelle régulièrement, jusqu'à ce que le CV soit gagné
  var gereEtoiles = function () {
    compteurEtoiles++;
    if (compteurEtoiles >= DELAI_ETOILE) {
      compteurEtoiles = 0;
      mespieces.push(new UsineApiece(prochainId++));
    }

    mespieces.forEach(function (piece) {
      piece.mouv(VITESSE);
      if (piece.active && piece.touche(rect1)) {
        piece.retire();
        monscore++;
        afficheScore();
      }
    });
    mespieces = mespieces.filter(function (piece) { return piece.active; });

    if (monscore >= ETOILES_POUR_CV) {
      victoire();
    }
  };

  var retireEtoiles = function () {
    mespieces.forEach(function (piece) { piece.retire(); });
    mespieces = [];
  };

  // Affiche le CV une seule fois et termine la partie
  var victoire = function () {
    jeu = false;
    termine = true;
    retireEtoiles();
    cvImage = document.createElement('img');
    cvImage.src = 'img/cv.png';
    cvImage.id = 'cv';
    paysage.appendChild(cvImage);
  };

  var rejouer = function () {
    retireEtoiles();
    if (cvImage) {
      cvImage.remove();
      cvImage = null;
    }
    monscore = 0;
    afficheScore();
    compteurEtoiles = DELAI_ETOILE - 1;
    positionY = SOL_Y;
    velocityY = 0.0;
    onGround = true;
    render();
    termine = false;
    jeu = true;
  };

  var demarre = function () {
    if (termine) {
      rejouer();
    } else {
      jeu = true;
    }
  };

  // Saut
  function jump() {
    if (jeu && onGround) {
      velocityY = -12.0;
      onGround = false;
    }
  }

  function update() {
    velocityY += gravity;
    positionY += velocityY;

    if (positionY > SOL_Y) {
      positionY = SOL_Y;
      velocityY = 0.0;
      onGround = true;
      position = animCourse(position);
    }
  }

  function render() {
    masque.style.top = positionY + 'px';
    rect1.y = positionY;
  }

  // Boucle principale
  function loop() {
    if (jeu) {
      animFond();
      update();
      render();
      gereEtoiles();
    }
    window.setTimeout(loop, 60);
  }

  // Contrôles clavier : flèche du haut ou espace
  window.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowUp' || event.key === ' ') {
      event.preventDefault();
      jump();
    }
  });

  // Contrôle tactile / souris : toucher la zone de jeu fait sauter
  // (ou lance la partie si elle n'a pas commencé)
  zoneJeu.addEventListener('pointerdown', function (event) {
    event.preventDefault();
    if (jeu) {
      jump();
    } else {
      demarre();
    }
  });

  // Menu
  document.getElementById('start').onclick = demarre;
  document.getElementById('stop').onclick = function () { jeu = false; };
  document.getElementById('rejouer').onclick = rejouer;

  // Adapte la taille du jeu aux petits écrans (téléphones)
  var ajusteTaille = function () {
    var echelle = Math.min(1, document.getElementById('container-global').clientWidth / 1000);
    zoneJeu.style.zoom = echelle;
  };
  window.addEventListener('resize', ajusteTaille);
  ajusteTaille();

  afficheScore();
  loop();
});
