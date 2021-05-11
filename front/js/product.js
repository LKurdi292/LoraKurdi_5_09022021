/* Récupération d'un produit depuis le paramètre URL */

fetch('http://localhost:3000/api/furniture')
.then(function(res) {
	if (res.ok) {
		return res.json();
	}
})
.then (function () {

})
.catch (function(err) {
	console.log(err);
});



/* Ajout d'une parenthèse *nombre d'articles* dans panier */


/* Ajout d'une div "L'article a bien été ajouté au panier */