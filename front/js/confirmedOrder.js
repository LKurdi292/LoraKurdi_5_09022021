
/**************** Récupérer les variables depuis sessionStorage ***************/
let orderId = JSON.parse(sessionStorage.orderId);
let totalPrice = JSON.parse(sessionStorage.totalPrice);
let emailAddress = JSON.parse(sessionStorage.emailAddress);

/***************** Liste des éléments span à remplir *****************/
let spanList = document.getElementsByTagName('span');

// remplissage
spanList[0].textContent = orderId;
spanList[1].textContent = totalPrice;
spanList[2].textContent = emailAddress;


/***********************  Au retour sur la page d'accueil (logo + nav), supprimer les variables de sessionStorage ************/

let homeLink = document.getElementsByClassName('backHome')[0];

homeLink.addEventListener('click', function() {
	sessionStorage.removeItem("orderId");
	sessionStorage.removeItem("totalPrice");
	sessionStorage.removeItem("emailAddress");
});