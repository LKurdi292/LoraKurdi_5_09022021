/* Récupération du paramètre de l'URL  = id du produit */
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const product_id = urlParams.get('id');


/**************** Récupération des données du produit grâce à l'id et affichage dynamique *******************/
fetch('http://localhost:3000/api/furniture/' + product_id)
.then(function(res) {
	if (res.ok) {
		return res.json();
	}
})
.then (function (res) {
	/* Nom */
	document.getElementsByClassName('product__name')[0].textContent = res.name;

	/* Prix */
	document.getElementsByClassName('product__price')[0].textContent = res.price + " €";

	/* Image */
	document.getElementById('imageAndDescription_container').children[0].children[0].setAttribute('src', res.imageUrl);

	/* Afficher un coeur */
	displayHeart();

	/* Description */
	document.getElementsByClassName('description__text')[0].textContent = res.description;

	/* Ajout des options de vernis */
	res.varnish.forEach(option => {
		newChoice = addOptionToSelect(option);

		document.getElementById('varnishChoices').appendChild(newChoice);
	}); 
})
.catch (function(err) {
	console.log(err);
});



/*********** Fonction qui créé qui une nouvelle 'option' (vernis) de type select et qui l'ajoute à la 'liste' ***********/
function addOptionToSelect(opt) {
	const newOption = document.createElement('option');
	newOption.classList.add('varnishOption');
	//La 'value' de l'option doit être égale à l'option pour pouvoir récupérer l'info pour le panier
	newOption.setAttribute('value', opt);

	//Texte pour affichage de l'option dans la liste
	newOption.textContent = opt;

	return newOption;
}

/************ Fonction qui affiche le coeur sur chaque image produit *********************/
function displayHeart() {
	document.getElementsByClassName('heartContainer')[0].style.display = 'flex';
}



/************ Récupération de la couleur initiale du texte, pour les champs qui nécessitent une action de l'utilisateur **********/
const defaultColor = document.querySelector('#varnishChoices_container > p').style.color;



/******************************** Récupération du vernis selectionné *************************************/
let product_varnish = String();
const varnishElement = document.getElementById('varnishChoices');
const textVarnish = document.querySelector('#varnishChoices_container > p');

varnishElement.addEventListener('change', function() {
	product_varnish = this.value;
	// Redonner la couleur initiale au texte 'Vernis' si il est passé au rouge (cf fonctions checkVarnish et changeColor)
	textVarnish.style.color = defaultColor;
});



/********************************** Récupération de la quantité choisie **********************************/

// Variables
let product_quantity = 0;
let quantity = document.getElementsByTagName('input')[0];
const textQuantity = document.querySelector('.quantity > p');

// Récupération de la quantité et vérification que c'est un entier
quantity.addEventListener('change', function() {
	let value = parseFloat(this.value);

	if(Number.isInteger(value)){
		product_quantity = value;
		backToInitialColor();
	} else {
		alert('Veuillez indiquer une valeur entière entre 1 et 20');
		changeColor(textQuantity);
	}
});


//Fonctionnement des 'boutons' de quantité + et - => incrémentation de l'input 'quantity' et de product_quantity
const more = document.getElementsByClassName('more')[0];
const less = document.getElementsByClassName('less')[0];

more.addEventListener('click', function() {
	product_quantity++;
	document.getElementsByTagName('input')[0].value++;
	backToInitialColor();
})

less.addEventListener('click', function() {
	product_quantity--;
	document.getElementsByTagName('input')[0].value--;
	backToInitialColor();
})


//Fonction qui redonne la couleur initiale au texte 'Quantité' et au '0' si ils sont passés au rouge (cf fonctions checkQuantity et changeColor)
function backToInitialColor() {
	textQuantity.style.color = defaultColor;
	quantity.style.color = defaultColor;
}


/*************  Fonctions qui vérifient les champs manquants que l'utilisateur n'aurait pas indiqués ************/

// Selection d'un vernis ?
function checkVarnish(value) {
	let validVarnish = true;
	
	//Impossibilité d'ajouter au panier si vernis non choisi 
	if (value == 'default' || value == '') {
		return false;
	} else {
		return validVarnish;
	}
}

// Quantité choisie?
function checkQuantity(value) {
	if (value < 1 || value > 20) {
		// Impossibilité d'ajouter au panier si quantité non comprise entre 1 et 20 ou type non valable
		console.log('je ne suis pas censé être là');
		return false;
	} else {
		return true;
	}
}


/************** Fonction qui change la couleur au rouge pour les champs qui nécessitent une action de l'utilisateur **********/
const redInvalid = "#DB2819";

function changeColor(elementToChange) {
	elementToChange.style.color = redInvalid;
}



/******* Fonction apparition de la div de confirmation d'ajout au panier puis suppression au bout de 2.5s **************/
const confirmDiv = document.getElementsByClassName('confirmAdditionToCart')[0];

// retour à display 'none' pour un ajout supplémentaire sur la même page produit
function displayAndRemoveConfirmationDiv () {
	confirmDiv.style.display = "flex";
	setTimeout( () => confirmDiv.style.display = 'none', 2500);
}



/********************************** Ajout d'une parenthèse *nombre d'articles* face à 'Panier' ****************************/
let parentheses = document.createElement('p');
document.getElementsByTagName('ul')[0].appendChild(parentheses);




/***************************************  À l'arrivée sur une page produit *****************************************/

const panierLiElement = document.querySelectorAll('li > a')[1];

if (!sessionStorage.cart) {
	// Première page produit visitée = panier vide
	cart = [];

	//Initialisation du nombre d'articles dans sessionStorage
	sessionStorage.setItem('nbArticles', '0');
	
	//Récupération du nb d'articles sous forme de variable pour manipulation ultérieure et externe à sessionStorage
	nbArticles = JSON.parse(sessionStorage.nbArticles);

	//Pas d'affichage de la parenthèse si panier vide
	parentheses.display = 'none';

	// Pas d'accès à la page panier s'il est vide
	panierLiElement.setAttribute('title', 'Votre panier est vide');
	panierLiElement.setAttribute('href', '');

} else {
	// Une autre page produit a déjà été visitée = commande en cours = panier existant

	//Récup du contenu du panier pour la suite de la commande
	cart = JSON.parse(sessionStorage.cart);
	
	//Remplissage et affichage de la parenthèse quand on arrive sur une nouvelle page produit
	nbArticles = JSON.parse(sessionStorage.nbArticles);
	parentheses.textContent = "(" + nbArticles + ")";
	parentheses.display = 'block';
}




/*****************  Fonction qui met à jour le panier : une quantité ou ajout d'un nouveau produit  ****************/

function updateCart(id, varnish, quantity) {
	let newLine = false;

	for (let i = 0; i < cart.length; i++) {
		if (cart[i].id == id) {
			if (cart[i].varnish == varnish){
				// si mm id et mm vernis = maj quantité
				newLine = false;
				cart[i].quantity += quantity;
				// on sort de la boucle
				return false;

			} else {
				// si mm id mais varnish différent = nouvelle entrée
				newLine = true;
			}
		} else if (cart[i].id != id){
			// si id différent = nouvelle entrée
			newLine = true;
		}
	}
	
	// Si après avoir parcouru tout le panier, newLine est toujours égal à true, alors le produit à ajouter est nouveau. 
	if (newLine) {
		cart.push({'id': id, 'varnish': varnish, 'quantity': quantity});
	};
}


/*******************  Sauvegarde des infos dans sessionStorage au clic du bouton 'Ajouter au panier' *****************/

const addButton = document.getElementById("addToCartButton");

addButton.addEventListener('click', function() {
	// Vérifier que l'utilisateur a choisi une option de vernis et a entré une quantité
	varnishOK = checkVarnish(product_varnish);
	quantityOK = checkQuantity(product_quantity);

	if (varnishOK && quantityOK) {
		if (cart.length == 0) {
			// Panier vide => Premier remplissage
			cart.push({
				'id': product_id,
				'varnish': product_varnish,
				'quantity': product_quantity,
			});

		} else {
			// MAJ du panier si déjà existant
			updateCart(product_id, product_varnish, product_quantity);
		}

		// Sauvegarde du nouveau panier dans session storage
		sessionStorage.cart = JSON.stringify(cart);

		// MAJ du nombre d'articles
		nbArticles = 0; //car le panier est re-parcouru en entier à chaque ajout d'article(s):
		for (let i=0; i < cart.length; i++) {
			nbArticles += JSON.parse(cart[i].quantity);
		}

		// Sauvegarde du nb d'articles dans session storage
		sessionStorage.nbArticles = JSON.stringify(nbArticles);
		
		// MAJ de la parenthèse du header
		parentheses.textContent = "(" + nbArticles + ")";
		parentheses.display = 'block';
		
		// Div de confirmation d'ajout
		displayAndRemoveConfirmationDiv();

		// Accès à la page panier
		panierLiElement.setAttribute('title', 'Voir mon panier');
		panierLiElement.setAttribute('href', './cart.html');
	
	} else {
		if (!varnishOK) {
			alert('Veuillez choisir une couleur de vernissage');
			changeColor(textVarnish);
		}

		if (!quantityOK) {
			alert('Veuillez indiquer une valeur entre 1 et 20');
			changeColor(textQuantity);
			changeColor(quantity);
		}
	}
})