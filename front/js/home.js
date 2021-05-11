/* Récupération de tous les produits depuis l'API */

fetch('http://localhost:3000/api/furniture')
.then(function(res) {
	if (res.ok) {
		return res.json();
	}
})
.then (function (arrayAllProducts) {
	/* Création d'une nouvelle div par produit */
	insertNewProduct(arrayAllProducts);
})
.catch (function(err) {
	console.log(err);
});



/* Creation d'une nouvelle div par produit, dans le main la page d'acceuil */
function insertNewProduct(array) {
	array.forEach((element, i) => {
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
	divDescription.classList.add("productDescription");
	const nameElement = document.createElement("p");
	const priceElement = document.createElement("p");

	/* Récupérer le nom et le prix du produit */
	nameElement.id = "name";
	priceElement.id = "price";
	nameElement.innerText = element.name;
	priceElement.innerText = element.price + " € TTC";
	
	/* Ajout du nom et du prix dans la div Description */
	divDescription.appendChild(nameElement);
	divDescription.appendChild(priceElement);

	return divDescription;
}


