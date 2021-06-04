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

	//MAJ du total et du nbArtciles
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
	quantityChange.setAttribute('max', '20');
	quantityChange.setAttribute('min', '0');
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
			if (this.classList.contains('less') && quantity <= 20) {
				if (quantity != 0 ) {
					quantity--;
				}
			} else if (this.classList.contains('more') &&  quantity >= 0) {
				if (quantity == 20) {
					alert('Vous ne pouvez pas commander plus de 20 articles par produits');
				} else {
					quantity++;
				}
			}
			updateAll(productId, quantity, newLine, quantityChange);
		});
	}

	// Ajout du eventListener sur le input 'quantité' et maj du panier, du sous-total du Total
	quantityChange.addEventListener('change', function() {
		let value = parseInt(this.value);

		if(Number.isInteger(value)){
			if (value > 0 && value <= 20) {
				quantity = value;
				updateAll(productId, quantity, newLine, quantityChange);
			} else {
				alert('Veuillez indiquer une valeur entière entre 1 et 20');
			}
		} else {
			alert('Veuillez indiquer une valeur entière entre 1 et 20');
		}
	});
	
	// Ajout de la div de controle à la cellule du tableau
	cell3.appendChild(quantityControl);
}


/******************* Fonction qui supprime un article ************/
function deleteProduct (element, newLine, quantite) {
	element.addEventListener('click', function() {
		let tableau = document.getElementById('cart');
		let i = newLine.rowIndex;

		// Maj du tableau affiché
		tableau.deleteRow(i);

		// Maj de la variable cart pour sessionStorage
		cart.splice(i-1, 1);
		sessionStorage.cart = JSON.stringify(cart);

		//MAJ du total et du nbArtciles
		updateTotalPrice(cart);
	});
}


/***************** Fonction qui ajoute un bouton pour supprimer le produit ***************/

function addDeleteButton (cell, newLine, quantite) {
	const deleteDiv = document.createElement('div');
	const trashIcon = document.createElement('img');
	const deleteText = document.createElement('p');

	// Style de l'icone poubelle
	trashIcon.setAttribute('src', '../images/trash-alt-solid.svg');
	trashIcon.classList.add('trashIcon');

	// Style du texte 'Supprimer'
	deleteText.textContent = 'Supprimer';
	deleteText.setAttribute('title', 'Supprimer');
	deleteText.classList.add('deleteText');
	
	// Action de suppression au clic sur le texte
	deleteProduct(deleteText, newLine, quantite);

	// Ajout de ces 2 éléments dans la div
	deleteDiv.appendChild(trashIcon);
	deleteDiv.appendChild(deleteText);
	deleteDiv.classList.add('deleteDiv');

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



/********* Les Regex pour vérifier les champs *********/

// 20 caractères par champ texte
const regexText = new RegExp("[A-Za-z-äë ]{1,20}");

// champ adresse qui peut prendre du texte et des chiffres
const regexAddress = new RegExp("^[a-zA-Z0-9_-èé ]*$");

//^[A-Za-z0-9]{1,20}' '+[A-Za-z0-9]{1,20}$");

// code postal à 5 chiffres en excluant le 00000
const regexPostalCode = new RegExp("^(?!00000)\\d{5}$");

// email avec un @ et .  
const regexEmail = new RegExp("^[A-Za-z0-9-_.]+@[a-z]{3,}[.][a-z]{2,4}$");



/************* Fonction qui vérifie les champs texte ******/
function checkText(value) {
	if (regexText.test(value)) {
		return true;
	} else {
		console.log(regexText);
		console.log('texte non valide!');
		return false;
	}
}

/********** Fonction qui vérifie le champ de l'adresse ********/
function checkAddress(value) {
	if (regexAddress.test(value)) {
		return true;
	} else {
		console.log(regexAddress);
		console.log('adresse non valide!');
		return false;
	}
}


/************* Fonction qui vérifie le champ codepostal ***********/
function checkPostalCode(value) {
	if (regexPostalCode.test(value)) {
		return true;
	} else {
		console.log(regexPostalCode);
		console.log('code postal non valide!');
		return false;
	}
}


/********************* Fonction qui vérifie le champ email *******************/
function checkEmail(value) {
	value = value.toString();
	if (regexEmail.test(value)) {
		return true;
	} else {
		console.log(regexEmail);
		console.log('mail non valide');
		return false;
	}
}

/********** Fonction qui redonne les couleurs initiale au champ ***************/
function setInitialColor(element) {
	element.style.backgroundColor = "none";
	element.style.borderColor = "#9b59b6";
	// element.style.color = "#ccc";
}



/*********** Fonction qui ajoute un eventListener sur les champs pour récupérer les valeurs et les vérifier, puis rempli l'objet contact **********************/

let validTextField = false;
let validAddressField = false;
let validPostalCodeField = false;
let validEmail = false;

function addEventToFields (element) {
	element.addEventListener('change', function() {
		
		// vérification des champs texte
		if (element.name == 'firstName' || element.name == 'lastName' || element.name == 'city') {

			element.setAttribute("value", this.value);
			validTextField = checkText(this.value);

			if (!validTextField) {
				element.classList.add('redStyle');
				element.setAttribute("value", "");
			} else {
				element.classList.remove('redStyle');
			}
		}

		// verification de l'adresse et du complément 
		if (element.name == 'address' || element.name == 'complement') {
			element.setAttribute("value", this.value);
			validAddressField = checkAddress(this.value);

			if (!validAddressField) {
				element.classList.add('redStyle');
				element.setAttribute("value", "");
			} else {
				element.classList.remove('redStyle');
			}
		}

		// verification du code postal
		if (element.name === 'postalCode') {
			element.setAttribute("value", this.value);
			validPostalCodeField = checkPostalCode(this.value);

			if (!validPostalCodeField) {
				element.classList.add('redStyle');
				element.setAttribute("value", "");
			} else {
				element.classList.remove('redStyle');
			}
		}

		// verification de l'adresse mail
		if (element.type === 'email') {
			element.setAttribute("value", this.value);
			validEmail = checkEmail(this.value);

			if (!validEmail) {
				element.classList.add('redStyle');
				element.setAttribute("value", "");
			} else {
				element.classList.remove('redStyle');
				// Récupération du mail pour la page deconfirmation de commande
				sessionStorage.emailAddress = JSON.stringify(element.value);
			}
		}
			
		// Si le champ est requis, remplir l'objet contact
		if (element.hasAttribute('required') ) {
			contact[element.name] = element.value;
		}
	});
}


/***************** Fonction pour vérifier les champs du formulaire et remplir l'objet contact ************/

let contact = {};


/******* Liste des champs du formulaire ************/
let formFields = document.querySelectorAll('.input-box > input');


for (let element= 0; element < formFields.length; element++ ) {
	addEventToFields(formFields[element]);
}



/********************* Remplissage du tableau products ****************/

let products = [];
cart.forEach(element => {
	products.push(element.id);
})



/***************************  Fonction qui envoie le tableau contact et le tableau de products au back end **************************/

let data = {"contact": contact, "products": products};


const url = 'http://​localhost:3000/api/furniture/order';
const orderId = '';

function send(e) {
	e.preventDefault();
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
		if (sessionStorage.orderId) {
			window.location.href = "confirmedOrder.html";
		} else {
			console.log('sessionStorage.orderId does not exist, look for post fetch promise');
		}
	})
	.catch(function(err) {
		console.log(err);
	})
}

/****************** Envoie des données au submit du formulaire **************/
formContact = document.getElementsByTagName('form')[0];

formContact.addEventListener('submit', function(e) {
	if (nbArticles > 0 && cart.length > 0  && validTextField) {
		send(e);
	} else {
		// impossibilité de commander lorsque le panier est vide
		alert("Votre panier est vide");
		e.preventDefault();
		sessionStorage.removeItem('emailAddress');
		// reinitialisation des valeurs du formulaire
		formContact.reset();
	}
});
