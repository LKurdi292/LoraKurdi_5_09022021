/**********************************************   PARTIE I   PANIER ***********************************************/



/************ Récupération des éléments sauvegardés dans sessionStorage ****************/

nbArticles = JSON.parse(sessionStorage.nbArticles);
cart = JSON.parse(sessionStorage.cart);
idNamePriceEquivalence = JSON.parse(sessionStorage.idNamePriceEquivalence);


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

/********************* Fonction qui met à jour la quantité dans le panier *****************/
function updateCart(id, quantity) {
	for (let i = 0; i < cart.length; i++) {
		if (cart[i].id == id) {
			cart[i].quantity = quantity;
			sessionStorage.cart = JSON.stringify(cart);
			// on sort de la boucle
			return false;
		}
	}
}


/**********************  Fonction qui calcule le prix total ********************/
// je profite de cette fonction qui boucle sur le 'nouveau' panier pour calculer le nbArticles dans la parenthèse (évite de refaire une fonction)

const totalDiv = document.getElementById('totalDiv');
let totalPrice = document.getElementsByClassName('total')[0];

function updateTotalPrice(array) {
	let price = 0;
	
	// reinitialisation du nombre d'articles dans la parenthèse
	nbArticles = 0;
	
	array.forEach((element) => {
		let productPrice = searchPrice(element.id);
		price += productPrice * element.quantity;
	
		// Maj du nombre d'articles dans la parenthèse
		nbArticles += element.quantity;
	});

	// Affichage du prix total
	totalPrice.textContent = price + " €";

	// Création et maj du total dans sessionStorage
	sessionStorage.totalPrice = JSON.stringify(price);

	// Maj du nombre d'articles dans la parenthèse
	sessionStorage.nbArticles = JSON.stringify(nbArticles);
}




/******************  Fonction qui regroupe toutes les mises à jour à faire lorsqu'on change la quantité d'un produit ************/

function updateAll(productId, quantity, newLine, quantityChange) {
	// Maj de la valeur de l'input
	quantityChange.setAttribute('value', quantity);

	// Sauvegarder la nouvelle quantité dans le panier et le sessionStorage
	updateCart(productId, quantity);
	
	// MAJ du sous-total
	let productPrice = searchPrice(productId);
	let productTotal = parseInt(quantity) * parseInt(productPrice);
	newLine.getElementsByClassName('price')[0].textContent = productTotal + " €";

	//MAJ du total
	updateTotalPrice(cart);
}





/************************* Fonction qui ajoute une div qui controle les quantités avec les boutons + et - *******************/
function addQuantityControl (cell3, newLine, quantity) {
	// Creation de la div 
	const quantityControl = document.createElement('div');

	// Création du trio: bouton-, la quantité, bouton+
	const moreButton = document.createElement('div');
	const lessButton = document.createElement('div');
	
	let quantityChange = document.createElement('input');
	quantityChange.setAttribute('type', 'number');
	quantityChange.setAttribute('value', quantity);

	// Remplissage de la div de controle
	quantityControl.appendChild(lessButton);
	quantityControl.appendChild(quantityChange);
	quantityControl.appendChild(moreButton);

	// Les classes pour le style et les EventListener
	quantityControl.classList.add('quantity__control');
	moreButton.classList.add('more', 'greyBG', 'control');
	lessButton.classList.add('less', 'greyBG','control');
	const control = quantityControl.getElementsByClassName('control');
	
	// Récupération de l'id du produit pour lequel on modifie la quantité, afin de maj le panier et le sous total
	let productId = newLine.getAttribute('data-product-id');

	// Ajout des eventListener, maj du panier, du sous-total et du Total au clic '+' et '-'
	for (let i=0; i < control.length; i++ ) {
		control[i].addEventListener('click', function() {
			if (this.classList.contains('less')) {
				if (quantity > 0) {
					quantity--;
				}
			} else if (this.classList.contains('more')) {
				quantity++;
			}

			updateAll(productId, quantity, newLine, quantityChange);
		});
	}

	// Ajout du eventListener sur le input 'quantité' et maj du panier, du sous-total du Total
	quantityChange.addEventListener('change', function() {
		quantity = this.value;
		updateAll(productId, quantity, newLine, quantityChange);
	});
	
	// Ajout de la div de controle à la cellule du tableau
	cell3.appendChild(quantityControl);
}


/******************* Fonction qui supprime une ligne du tableau ************/
function deleteProduct (element, newLine, quantite){
	element.addEventListener('click', function() {
		let tableau = document.getElementById('cart');
		let i = newLine.rowIndex;

		// Maj du tableau affiché
		tableau.deleteRow(i);

		// Maj de la variable cart pour sessionStorage
		cart.splice(i-1, 1);
		sessionStorage.cart = JSON.stringify(cart);

		// Maj du nombre d'articles dans la parenthèse
		nbArticles -= quantite;
		sessionStorage.nbArticles = JSON.stringify(nbArticles);
	});
}



/***************** Fonction qui ajoute un bouton pour supprimer le produit ***************/

function addDeleteButton (cell, newLine, quantite) {
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
	
	// Action de suppression au clic sur le texte
	deleteProduct(deleteText, newLine, quantite);

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

let tableBody = document.getElementsByTagName('tbody')[0];

function addNewLine(idProduit, nomProduit, vernis, price, quantite) {
	const newLine = document.createElement('tr');
	newLine.setAttribute('data-product-id', idProduit);

	// Nom et vernis
	const newCell_1 = document.createElement('td');
	newCell_1.innerText = nomProduit + "\r" + " Vernis : " + vernis;
	
	// Prix
	const newCell_2 = document.createElement('td');
	newCell_2.textContent = price + " €";

	// Contrôle des quantités
	const newCell_3 = document.createElement('td');
	addQuantityControl(newCell_3, newLine, quantite);
	
	// Boutton supprimer le produit
	addDeleteButton(newCell_3, newLine, quantite);

	newCell_3.style.display = 'flex';
	newCell_3.style.flexDirection = 'column';
	newCell_3.style.justifyContent = 'center';
	newCell_3.style.alignItems = 'center';

	// Calcul et affichage du sous-total
	const newCell_4 = document.createElement('td');
	newCell_4.classList.add('price');
	let sousTotal = parseInt(price * quantite);
	newCell_4.textContent = sousTotal + " €";

	newLine.appendChild(newCell_1);
	newLine.appendChild(newCell_2);
	newLine.appendChild(newCell_3);
	newLine.appendChild(newCell_4);
	
	tableBody.appendChild(newLine);
}




/********** Affichage du contenu du panier dans le tableau ************/

function fillCartPage (array) {
	array.forEach((element) => {
		let id = element.id;
		let nom = searchName(element.id);
		let vernis = element.varnish;
		let productPrice = searchPrice(element.id);
		let quantite = element.quantity;

		addNewLine(id, nom, vernis, productPrice, quantite);
	});
	
	// Afficher le total et le maj si besoin
	totalDiv.style.display = "flex";
	updateTotalPrice(array);
}

fillCartPage(cart);







/**********************************************   PARTIE II  FORMULAIRE ***********************************************/

/******* Liste des champs du formulaire ************/
let formFields = document.querySelectorAll('.input-box > input');


/********* Fonction qui ajoute un eventListener sur les champs pour récupérer les valeurs et qui rempli le tableau contact **********************/



function addEventToFields (list) {
	list.forEach(element => {
		element.addEventListener('change', function() {
			validEmail = false;
			if (typeof this.value === 'string') {
				// vérification validité
				isValid = true;
				if (element.name === 'email') {
					validEmail = true;
				}
				
				// Si le champ est requis, mettre à jour la valeur de l'élément
				if (element.hasAttribute('required')) {
					element.setAttribute("value", this.value);
					contact[element.name] = element.value;
				}
			} else {
				isValid = false;
			}
		
			// Récupération du mail pour la page de confirmation de commande
			if (element.name === 'email' && validEmail) {
				email = element.value;
				sessionStorage.emailAddress = JSON.stringify(email);
			}
		})
	});
}

let contact = {};

/***************** Fonction remplir l'objet contact ************/

// contact = {
// 	firstName: document.getElementById('firstName').value,
//  	lastName: document.getElementById('lasName').value,
//  	address: document.getElementById('address').value,
//  	city: document.getElementById('city').value,
//  	email: document.getElementById('email').value
// }

addEventToFields(formFields);



/********************* Remplissage du tableau products ****************/

let products = [];
cart.forEach(element => {
	products.push(element.id);
})



/***************************  Fonction qui envoie le tableau contact et le tableau de products au back **************************/

let data = {"contact": contact, "products": products};


const url = 'http://​localhost:3000/api/furniture/order';
const orderId = '';

function send(e) {
	e.preventDefault();
	console.log(data);
	fetch(url, {
		method: "POST",
		headers: {
			"Content-type": "application/json", 
		},
		body: (JSON.stringify(data))
	})
	.then(function(res) {
		if (res.ok) {
			return res.json();
		}
	})
	.then(function(res) {
		sessionStorage.orderId = JSON.stringify(res.orderId);
		window.location.href = "confirmedOrder.html";
	})
	.catch(function(err) {
		console.log(err);
	})
}

/****************** Envoie des données au submit du formulaire **************/
formContact = document.getElementsByTagName('form')[0];

formContact.addEventListener('submit', function(e) {
	// réinitialisation des données
	sessionStorage.removeItem("cart");
	sessionStorage.removeItem("nbArticles");
	
	send(e);
});