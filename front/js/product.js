/* Récupération du paramètre de l'URL  = id du produit */
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productID = urlParams.get('id');
// console.log(productID);


/* Récupération des données du produit grâce à l'id et affichage dynamique */
fetch('http://localhost:3000/api/furniture/'+productID)
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

	/* Description */
	document.getElementsByClassName('description__text')[0].textContent = res.description;

	/* Options Vernis */
	res.varnish.forEach(option => {
		newChoice = addOptionToSelect(option);

		document.getElementById('varnishChoices').appendChild(newChoice);
	}); 
})
.catch (function(err) {
	console.log(err);
});



/* Fonction qui créé qui une nouvelle 'option' (vernis) de type select et qui rempli le champ */
function addOptionToSelect(opt) {
	const newOption = document.createElement('option');
	newOption.classList.add('varnishOption');
	newOption.textContent = opt;

	return newOption;
}

/* Bouton de quantité +, - et saisie manuelle */


/* Impossibilité d'ajouter au panier si quantité = 0 ou si vernis non choisi */


/* Sauvegarde des infos dans localStorage au clic du bouton 'Ajouter au panier' */



/* Ajout d'une parenthèse *nombre d'articles* face au panier, à partir des info localStorage */



/* Apparition de la div de confirmation d'ajout au panier apres maj de localStorage */



/* Article Favori : coeur en haut à droite de l'image */