/* Récupération du paramètre de l'URL  = id du produit */
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const product_id = urlParams.get('id');
// console.log(productID);


/* Récupération des données du produit grâce à l'id et affichage dynamique */
fetch('http://localhost:3000/api/furniture/'+product_id)
.then(function(res) {
	if (res.ok) {
		return res.json();
	}
})
.then (function (res) {
	/* Nom */
	document.getElementsByClassName('product__name')[0].textContent = res.name;

	/* Prix */
	document.getElementsByClassName('product__price')[0].textContent = res.price+" €";

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



/* Fonction qui créé qui une nouvelle 'option' (vernis) de type select et qui l'ajoute à la 'liste' */
function addOptionToSelect(opt) {
	const newOption = document.createElement('option');
	newOption.classList.add('varnishOption');
	//La 'value' de l'option doit être égale à l'option pour pouvoir récupérer l'info pour le panier
	newOption.setAttribute('value', opt);

	//Texte pour affichage de l'option dans la liste
	newOption.textContent = opt;

	return newOption;
}

/* Fonction qui affiche le coeur sur chaque image produit */
function displayHeart() {
	document.getElementsByClassName('heartContainer')[0].style.display = 'flex';
}

/* Récupération de la couleur initiale des champs qui nécessitent une action de l'utilisateur */
const defaultColor = document.querySelector('#varnishChoices_container > p').style.color;


/* Récupération du vernis selectionné */
let product_varnish = String();
const varnishElement = document.getElementById('varnishChoices');

varnishElement.addEventListener('change', function() {
	product_varnish = this.value;
	// Redonner la couleur initiale au texte 'vernis' si il est passé au rouge (cf plus bas)
	document.querySelector('#varnishChoices_container > p').style.color = defaultColor;
});


/* Récupération de la quantité choisie */
let product_quantity = 0;
quantity = document.getElementsByTagName('input')[0];

quantity.addEventListener('change', function() {
	product_quantity = this.value;
	// Redonner la couleur initiale au texte 'vernis' et au '0' si ils sont passés au rouge (cf plus bas)
	document.querySelector('.quantity > p').style.color = defaultColor;
	quantity.style.color = defaultColor;
});


/* Incrémentation de l'input 'quantité' grâce aux boutons + et - */
const more = document.getElementsByClassName('more')[0];
const less = document.getElementsByClassName('less')[0];

more.addEventListener('click', function() {
	document.getElementsByTagName('input')[0].value++;
	product_quantity++;
	// Redonner la couleur initiale au texte 'vernis' et au '0' si ils sont passés au rouge (cf plus bas)
	document.querySelector('.quantity > p').style.color = defaultColor;
	quantity.style.color = defaultColor;
})

less.addEventListener('click', function() {
	document.getElementsByTagName('input')[0].value--;
	product_quantity--;
	// Redonner la couleur initiale au texte 'vernis' et au '0' si ils sont passés au rouge (cf plus bas)
	document.querySelector('.quantity > p').style.color = defaultColor;
	quantity.style.color = defaultColor;
})


/* Ajout d'une parenthèse *nombre d'articles* face à 'Panier' */
let parentheses = document.createElement('p');
document.getElementsByTagName('ul')[0].appendChild(parentheses);




/* Le panier est recréé à chaque changement de page produit, ou actualisation, à partir du  contenu de  sessionStorage, sauf quand aucun article n'a encore été ajouté, et dans ce cas, on créé un panier vide. */

const panierLiElement = document.querySelectorAll('li > a')[1];

if (!sessionStorage.cart) {
	cart = [];
	//Initialisation du nombre d'articles dans sessionStorage
	sessionStorage.setItem('nbArticles', '0');
	
	//Récupération du nb d'articles sous forme de variable pour manipulation ultérieure et externe à sessionStorage
	nbArticles = JSON.parse(sessionStorage.nbArticles);

	//Pas d'affichage de la parenthèse si panier vide
	parentheses.display = 'none';

	// Modif du lien panier dans le header
	panierLiElement.setAttribute('title', 'Votre panier est vide');
	panierLiElement.setAttribute('href', '');

} else {
	//Récup du contenu du panier pour la suite de la commande
	cart = JSON.parse(sessionStorage.cart);
	
	//Remplissage et affichage de la parenthèse quand on arrive sur une nouvelle page produit
	nbArticles = JSON.parse(sessionStorage.nbArticles);
	parentheses.textContent = "("+nbArticles+")";
	parentheses.display = 'block';
}




/*******************  Sauvegarde des infos dans sessionStorage au clic du bouton 'Ajouter au panier' *****************/

const addButton = document.getElementById("addToCartButton");

addButton.addEventListener('click', function() {
	// Impossibilité d'ajouter au panier si quantité = 0 ou si vernis non choisi => les champs manquants passent au rouge
	if (product_varnish == 'default' || product_varnish == '') {
		alert('Veuillez choisir une couleur de vernissage');
		
		document.querySelector('#varnishChoices_container > p').style.color = "#DB2819";

	} else if (product_quantity < 1) {
		alert('Veuillez indiquer une quantité');

		document.querySelector('.quantity > p').style.color = "#DB2819";
		quantity.style.color = "#DB2819";

	} else {
		// MAJ du panier
		cart.push({
			'id': product_id,
			'varnish': product_varnish,
			'quantity': product_quantity,
		});

		// Sauvegarde du nouveau panier dans session storage
		sessionStorage.cart = JSON.stringify(cart);

		// MAJ du nombre d'articles et sauvegarde dans session storage
		nbArticles = 0; //car le panier est re-parcouru en entier à chaque ajout:
		for (let i=0; i < cart.length; i++) {
			nbArticles += JSON.parse(cart[i].quantity);
		}
		sessionStorage.nbArticles = JSON.stringify(nbArticles);
		
		// MAJ de la parenthèse du header
		parentheses.textContent = "("+nbArticles+")";
		parentheses.display = 'block';
		
		// Div de confirmation d'ajout et Retour au display none de départ, pour un autre ajout du même produit
		displayAndRemoveConfirmationDiv();

		// Modif du lien panier dans le header
		panierLiElement.setAttribute('title', 'Voir mon panier');
		panierLiElement.setAttribute('href', './cart.html');
	}
});


/* Fonction apparition de la div de confirmation d'ajout au panier puis suppression au bout de 2.5s */
const confirmDiv = document.getElementsByClassName('confirmAdditionToCart')[0];

function displayAndRemoveConfirmationDiv () {
	confirmDiv.style.display = "flex";
	setTimeout( () => confirmDiv.style.display = 'none', 2500);
}





