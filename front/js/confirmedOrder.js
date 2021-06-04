
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

/************************* Vidange de sessionStorage après affichage des données **************************/
sessionStorage.clear();




