/************ Récupération des éléments sauvegardés dans sessionStorage ****************/

nbArticles = JSON.parse(sessionStorage.nbArticles);
cart = JSON.parse(sessionStorage.cart);
idNamePriceEquivalence = JSON.parse(sessionStorage.idNamePriceEquivalence);

updatedCart = [];

/************************** Fonctions qui cherchent le nom et le prix grâce à l'id, dans le tableau idNamePriceEquivalence ************/
function searchName (id) {
	for (let i in idNamePriceEquivalence) {
		if (id == idNamePriceEquivalence[i].id) {
			return idNamePriceEquivalence[i].name;
		}
	}
}

function searchPrice (id) {
	for (let i in idNamePriceEquivalence) {
		if (id === idNamePriceEquivalence[i].id) {
			return idNamePriceEquivalence[i].price;
		}
	}
}



/*************** Fonction qui ajoute une div 'controle des quantités' ***************/
function addQuantityControl (cell, quantity) {
	// Creation de la div globale
	const quantityControl = document.createElement('div');

	// Création du trio: bouton- , la quantité, bouton+
	const moreButton = document.createElement('div');
	let quantityChange = document.createElement('p');
	quantityChange.textContent = quantity;
	const lessButton = document.createElement('div');

	// Ajout des eventListener pour modifier la valeur
	moreButton.addEventListener('click', function() {
		quantityChange.textContent++;
	})
	
	lessButton.addEventListener('click', function() {
		quantityChange.textContent--;
	})

	// Remplissage de la div de controle
	quantityControl.appendChild(lessButton);
	quantityControl.appendChild(quantityChange);
	quantityControl.appendChild(moreButton);

	// Les classes pour le style
	quantityControl.classList.add('quantity__control');
	moreButton.classList.add('more', 'greyBG');
	lessButton.classList.add('less', 'greyBG');

	// Ajout de la div de controle à la cellule du tableau
	cell.appendChild(quantityControl);
}




/******************* Fonction qui supprime une ligne du tableau ************/
function deleteProduct (element, newLine){
	element.addEventListener('click', function() {
		let i = newLine.rowIndex;
		console.log(newLine);
		corpsTableau.deleteRow(i);
		updatedCart = cart.splice(i, i);
		console.log('updatedCart: ' + updatedCart);
		for (let ligne in cart) {
			delete cart[ligne];
		}
		console.log('cart: '+cart);
		sessionStorage.updatedCart = JSON.stringify(updatedCart);
		//corpsTableau.splice(i, i);
	});
}



/***************** Fonction qui ajoute un bouton pour supprimer le produit ***************/

function addDeleteButton (cell, newLine) {
	const deleteDiv = document.createElement('div');
	const trashIcon = document.createElement('img');
	const deleteText = document.createElement('p');

	// Style de l'icone poubelle
	trashIcon.setAttribute('src', '../images/trash-alt-solid.svg');
	trashIcon.style.width = '15px';
	trashIcon.style.height = '15px';
	trashIcon.style.marginRight = '5px';

	// Style du texte 'Supprimer'
	deleteText.textContent = 'Supprimer';
	deleteText.setAttribute('title', 'Supprimer');
	deleteText.style.margin = '0';
	deleteText.style.fontSize = '14px';
	deleteText.style.textDecoration = 'underline';
	deleteText.style.cursor  ='pointer';
		// Action de suppression sur le texte
	deleteProduct(deleteText, newLine);

	// Ajout de ces 2 éléments dans la div
	deleteDiv.appendChild(trashIcon);
	deleteDiv.appendChild(deleteText);

	deleteDiv.style.display = 'flex';
	deleteDiv.style.justifyContent = 'center';
	deleteDiv.style.alignItems = 'center';
	deleteDiv.style.margin = '15px 0';

	// Ajout de la div à la cellule du tableau
	cell.appendChild(deleteDiv);
}





/*********************** Fonction qui ajoute une ligne dans le tableau avec les données issues de sessionStorage:  nom du produit, vernis, son prix et la quantité */

const controlQuantity = document.getElementsByClassName('quantity__control')[0];

function addNewLine(nomProduit, vernis, price, quantite) {
	const newLine = document.createElement('tr');

	// Nom et vernis
	const newCell_1 = document.createElement('td');
	newCell_1.innerText = nomProduit + "\r" + " Vernis : " + vernis;
	
	// Prix
	const newCell_2 = document.createElement('td');
	newCell_2.textContent = price + " €";

	// Quantité
	const newCell_3 = document.createElement('td');
		// contrôle des quantités
	addQuantityControl(newCell_3, quantite);
		// Boutton supprimer le produit
	addDeleteButton(newCell_3, newLine);

		// style
	newCell_3.style.display = 'flex';
	newCell_3.style.flexDirection = 'column';
	newCell_3.style.justifyContent = 'center';
	newCell_3.style.alignItems = 'center';

	// Sous-total
	const newCell_4 = document.createElement('td');
	let total = parseInt(price * quantite);
	newCell_4.textContent = total + " €";

	newLine.appendChild(newCell_1);
	newLine.appendChild(newCell_2);
	newLine.appendChild(newCell_3);
	newLine.appendChild(newCell_4);
	
	corpsTableau.appendChild(newLine);
}



/********** Affichage du contenu du panier dans le tableau ************/

let corpsTableau = document.getElementsByTagName('table')[0];

// console.log(typeof corpsTableau);

function fillCartPage (array) {
	array.forEach((element) => {
		let quantite = element.quantity;
		let vernis = element.varnish;
		let nomProduit = searchName(element.id);
		let prix = searchPrice(element.id);

		addNewLine(nomProduit, vernis, prix, quantite);
	});
}

fillCartPage(cart);


/************************ Style du bouton 'Mettre à jour le panier ****************/
const majButtonContainer = document.getElementsByClassName('buttonContainer')[0];
const majButton = document.getElementById('updateCartButton');

majButtonContainer.style.width = '200px';
majButtonContainer.style.position = 'absolute';
majButtonContainer.style.right = '15vw';
majButtonContainer.style.margin = '25px 0 0 57vw';
majButton.style.fontSize = '18px';
