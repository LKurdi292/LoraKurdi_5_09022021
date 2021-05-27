/************* Création d'un tableau pour avoir l'équivalence id prix à récupérer plus tard pour la page panier *********************/

let idNamePriceEquivalence = [];


/**************** Récupération de tous les produits depuis l'API ***************/

fetch('http://localhost:3000/api/furniture')
.then(function(res) {
	if (res.ok) {
		return res.json();
	}
})
.then (function (arrayAllProducts) {

	/* Création d'une nouvelle div par produit */
	insertNewProduct(arrayAllProducts);

	/* Remplissage du tableau d'équivalence id/prix */
	fillIdNamePriceEquivalenceArray(arrayAllProducts);
	sessionStorage.idNamePriceEquivalence = JSON.stringify(idNamePriceEquivalence);
	// console.log(idNamePriceEquivalence);
})
.catch (function(err) {
	console.log(err);
});


/******************** Fonction remplissage du tableau équivalence id/name/prix ****/
function fillIdNamePriceEquivalenceArray(array) {
	array.forEach((element) => {
		idNamePriceEquivalence.push({id : element._id, name: element.name, price : element.price});
	});
}



/****************** Creation d'une nouvelle div par produit, dans le main la page d'acceuil *************/
function insertNewProduct(array) {
	array.forEach((element) => {
		/* Création d'une div Produit */
		const newDivProduct = document.createElement("div");
		newDivProduct.classList.add("productContainer");
		
		/* Ajout du lien vers la page produit  */
		const link = addLinkToProduct(element)

		/* Ajout de l'image */
		const figure = addImageToProduct(element);

		/* Ajout de la description */
		const description = addDescriptionToProduct(element);

		/* 'Montage' de la div Produit */
		link.appendChild(figure);
		link.appendChild(description);
		newDivProduct.appendChild(link);
		
		/*Ajout du Produit dans le DOM  */
		document.getElementById('productsGeneralContainer').appendChild(newDivProduct);
	});
}


/* Fonction ajout d'un lien */
function addLinkToProduct(element) {
	const link = document.createElement("a");
	link.setAttribute("href", "product.html?id="+element._id);
	return link;
}

/* Fonction ajout de l'image */
 function addImageToProduct (element){
 	const imageFigureProduct = document.createElement("figure");
 	const image = document.createElement("img");
 	image.setAttribute("src", element.imageUrl);
 	imageFigureProduct.appendChild(image);
 	return imageFigureProduct
}

/* Fonction ajout de la description  */
function addDescriptionToProduct(element) {
	const divDescription  = document.createElement("div");
	divDescription.classList.add("home__description");
	const nameElement = document.createElement("p");
	const priceElement = document.createElement("p");

	/* Récupérer le nom et le prix du produit */
	nameElement.id = "home__name";
	priceElement.id = "home__price";
	nameElement.innerText = element.name;
	priceElement.innerText = element.price + " € TTC";
	
	/* Ajout du nom et du prix dans la div Description */
	divDescription.appendChild(nameElement);
	divDescription.appendChild(priceElement);

	return divDescription;
}


/***************** Au retour sur la page d'accueil, après avoir ajouté des articles dans le panier pour la suite de la commande ***************/

// Ajout d'une parenthèse *nombre d'articles* face à 'Panier', à partir des info sessionStorage
let parentheses = document.createElement('p');
document.getElementsByTagName('ul')[0].appendChild(parentheses);
parentheses.style.margin = '0';


if (sessionStorage.nbArticles) {
	nbArticles = JSON.parse(sessionStorage.nbArticles);
	parentheses.textContent = "(" + nbArticles + ")";
	if (nbArticles != 0) {
		parentheses.style.display = 'block';
	} else {
		parentheses.style.display ='none';
	}
	
	// Modif du lien panier dans le header
	panierLiElement = document.querySelectorAll('li > a')[1];
	panierLiElement.setAttribute('title', 'Voir mon panier');
	panierLiElement.setAttribute('href', './cart.html');

} else {
	// Panier vide = première visite sur la page
	parentheses.style.display ='none';
}