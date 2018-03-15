/* TODO */
// Afficher un retour lors de la création d'un shop | seller | product
// Éditer shop | seller | product

/* BUGS */
// On peut attribuer un produit ou un vendeur même s'il n'y a pas de magasin

import { App } from "./class/App";

const app: App = new App();
app.initMap();
app.load();

// Récupère les coordonnées sur la carte
app.map.addListener('click',function(event){
    app.$latitude.value = event.latLng.lat();
    app.$longitude.value = event.latLng.lng();
});

// Ajoute un magasin à la liste et un marqueur sur la carte
app.$shop_form.addEventListener('submit',function(event){
    event.preventDefault();
    app.addShop();
});

// Ajoute un vendeur à la liste
app.$seller_form.addEventListener('submit',function(event){
    event.preventDefault();
    app.addSeller();
});

// Ajoute un produit à la liste
app.$product_form.addEventListener('submit',function(event){
    event.preventDefault();
    app.addProduct();
});

// Ouvre le formulaire principal
app.$admin_button.addEventListener('click',function(event){
    //On prend l'id du premier magasin de la liste et on l'enregistre en tant que current_id_shop
    app.setCurrentIdShop();

    //On génère le formulaire principal
    app.htmlMainForm();

    //On affiche le formulaire
    app.$main_form_container.style.display = 'block';
});

// Ferme le formulaire principal
app.$close_main_form.addEventListener('click',function(event){
    app.$main_form_container.style.display = 'none';
    //Affiche les listes dans les infobulles des magasins
    app.updateInfowindows();
});

/* Ouverture du formulaire principal depuis l'infowindow d'un magasin */
app.$map.addEventListener('click',function(event: MouseEvent){
    //event.target ne renvoie pas un objet de type HTMLelement, d'où le cast
    let elem = <HTMLElement> event.target;

    /* affiche le formulaire d'édition principal */
    if (elem.classList.contains('update-shop'))
    {
        //On récupère l'id du magasin et on l'enregistre en tant que current_id_shop
        app.current_id_shop = parseInt(elem.dataset.id_shop);

        //On génère le formulaire principal
        app.htmlMainForm();

        //On affiche le formulaire
        app.$main_form_container.style.display = 'block';
    }
});

/* Évènements sur des éléments créés dynamiquement */
app.$main_form.addEventListener('click',function(event: MouseEvent){
    //event.target ne renvoie pas un objet de type HTMLelement, d'où le cast
    let elem = <HTMLElement> event.target;

    /* Ajoute un vendeur au magasin */
    if (elem.classList.contains('add-seller-to-shop'))
    {
        //Récupérer l'id du vendeur
        const id_seller: number = parseInt(elem.parentElement.dataset.id_seller);
        
        //On ajoute le vendeur au magasin (et le magasin au vendeur)
        app.addSellerToShop(app.current_id_shop,id_seller);

        //On régénère le formulaire principal
        app.htmlMainForm();
    }
    /* Retire un vendeur du magasin */
    else if (elem.classList.contains('remove-seller-from-shop'))
    {
        const id_seller: number = parseInt(elem.parentElement.dataset.id_seller);
        app.removeSellerFromShop(app.current_id_shop,id_seller);
        app.htmlMainForm();
    }
    /* Ajoute un produit au magasin */
    else if (elem.classList.contains('add-product-to-shop'))
    {
        const id_product: number = parseInt(elem.parentElement.dataset.id_product);
        app.addProductToShop(app.current_id_shop,id_product);
        app.htmlMainForm();
    }
    /* Retire un produit du magasin */
    else if (elem.classList.contains('remove-product-from-shop'))
    {
        const id_product: number = parseInt(elem.parentElement.dataset.id_product);
        app.removeProductFromShop(app.current_id_shop,id_product);
        app.htmlMainForm();
    }
    /* Changer de magasin */
    else if (elem.classList.contains('shop'))
    {
        //On récupère l'id du magasin et on l'enregistre en tant que current_id_shop
        app.current_id_shop = parseInt(elem.dataset.id_shop);
        app.htmlMainForm();
    }
    /* Supprimer un magasin */
    else if (elem.classList.contains('delete-shop'))
    {
        const id_shop: number = parseInt(elem.parentElement.dataset.id_shop);
        app.deleteShop(id_shop);
        app.htmlMainForm();
    }
    /* Supprimer un vendeur */
    else if (elem.classList.contains('delete-seller'))
    {
        const id_seller: number = parseInt(elem.parentElement.dataset.id_seller);
        app.deleteSeller(id_seller);
        app.htmlMainForm();
    }
    /* Supprimer un produit */
    else if (elem.classList.contains('delete-product'))
    {
        const id_product: number = parseInt(elem.parentElement.dataset.id_product);
        app.deleteProduct(id_product);
        app.htmlMainForm();
    }
});

/* Enregistrement en session */
window.addEventListener("beforeunload",function(event){
    app.save();
});