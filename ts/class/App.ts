import { Marker } from "./Marker";
import { Shop } from "./Shop";
import { Seller } from "./Seller";
import { Product } from "./Product";

export class App
{
    public map: google.maps.Map;
    public shop_list: Array<Shop> = [];
    public seller_list: Array<Seller> = [];
    public product_list: Array<Product> = [];
    public current_id_shop: number = null;

    public $map: HTMLElement;
    
    public $shop_form: HTMLFormElement;
    public $shop_name: HTMLInputElement;
    public $shop_description: HTMLInputElement;
    public $latitude: HTMLInputElement;
    public $longitude: HTMLInputElement;

    public $seller_form: HTMLFormElement;
    public $seller_name: HTMLInputElement;
    public $seller_firstname: HTMLInputElement;

    public $product_form: HTMLFormElement;
    public $product_name: HTMLInputElement;
    public $product_price: HTMLInputElement;
    public $product_img: HTMLInputElement;

    
    public $admin_button: HTMLElement;
    public $main_form_container: HTMLElement;
    public $main_form: HTMLElement;
    public $close_main_form: HTMLElement;

    constructor()
    {
        this.$map = <HTMLElement> document.getElementById('map');
        
        this.$shop_form = <HTMLFormElement> document.getElementById('shop-form');
        this.$shop_name = <HTMLInputElement> document.getElementById('shop-name');
        this.$shop_description = <HTMLInputElement> document.getElementById('shop-description');
        this.$latitude = <HTMLInputElement> document.getElementById('latitude');
        this.$longitude = <HTMLInputElement> document.getElementById('longitude');
        
        this.$seller_form = <HTMLFormElement> document.getElementById('seller-form');
        this.$seller_name = <HTMLInputElement> document.getElementById('seller-name');
        this.$seller_firstname = <HTMLInputElement> document.getElementById('seller-firstname');
        
        this.$product_form = <HTMLFormElement> document.getElementById('product-form');
        this.$product_name = <HTMLInputElement> document.getElementById('product-name');
        this.$product_price = <HTMLInputElement> document.getElementById('product-price');
        this.$product_img = <HTMLInputElement> document.getElementById('product-img');
        
        this.$admin_button = <HTMLElement> document.getElementById('admin-button');
        this.$main_form_container = <HTMLElement> document.getElementById('main-form-container');
        this.$main_form = <HTMLElement> document.getElementById('main-form');
        this.$close_main_form = <HTMLElement> document.getElementById('close-main-form');
    }

    initMap(): void
    {
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 42.6990297, lng: 2.8344617},
            zoom: 8
        });
    }

    addMarker(): Marker
    {
        const position: google.maps.LatLng = new google.maps.LatLng(
            parseFloat(this.$latitude.value), 
            parseFloat(this.$longitude.value)
        );
        return new Marker(
            this.shop_list.length,
            this.map,position,
            this.$shop_name.value,
            this.$shop_description.value
        );
    }

    addShop(): void
    {
        const last_id = this.getLastId(this.shop_list);
        this.shop_list.push(new Shop(
            last_id,
            this.$shop_name.value,
            this.$shop_description.value,
            this.addMarker()
        ));
    }
    deleteShop(id_shop: number): void
    {
        const shop_index = this.getIndex(this.shop_list,id_shop);
        
        //On supprime les shops dans les sellers associés
        for(const id_seller of this.shop_list[shop_index].id_seller_list)
        {
            const index = this.getIndex(this.seller_list,id_seller);
            this.seller_list[index].removeShop();
        }

        //On supprime le Marker
        this.shop_list[shop_index].marker.g_marker.setMap(null);

        //On supprime le shop
        this.shop_list.splice(shop_index,1);

        //Si on supprime le current shop, on le met à jour
        if(id_shop == this.current_id_shop){
            this.setCurrentIdShop();
        }
    }

    addSeller(): void
    {
        const last_id = this.getLastId(this.seller_list);
        this.seller_list.push(new Seller(
            last_id,
            this.$seller_name.value,
            this.$seller_firstname.value
        ));
    }
    deleteSeller(id_seller: number): void
    {
        const seller_index = this.getIndex(this.seller_list,id_seller);
        
        //On supprime le vendeur dans le shop associé
        if(this.seller_list[seller_index].id_shop != null){
            this.removeSellerFromShop(this.seller_list[seller_index].id_shop,this.seller_list[seller_index].id);
        }

        //On supprime le vendeur
        this.seller_list.splice(seller_index,1);
    }

    addProduct(): void
    {
        const last_id = this.getLastId(this.product_list);
        this.product_list.push(new Product(
            last_id,
            this.$product_name.value,
            parseFloat(this.$product_price.value),
            this.$product_img.value
        ));
    }
    deleteProduct(id_product: number): void
    {
        //On supprime la référence au produit dans les magasins
        for (const shop of this.shop_list)
        {
            const index_of = shop.id_product_list.indexOf(id_product);
            if(index_of != -1){
                shop.id_product_list.splice(index_of,1);
            }
        }

        //On supprime le produit
        const product_index = this.getIndex(this.product_list,id_product);
        this.product_list.splice(product_index,1);
    }

    htmlMainForm(): void
    {
        var html: string = '<ul>';
        html += '<li><h4>Magasins</h4></li>';

        //liste des magasins
        for (const shop of this.shop_list)
        {
            const current = (shop.id == this.current_id_shop) ? ' current' : '';
            html += 
                '<li class="shop' + current + '" data-id_shop="' + shop.id + '">' + 
                    '<div class="td">' + shop.name + '</div>' + 
                    '<div class="button delete-shop">X</div>' + 
                '</li>';
        }
        html += '</ul><ul>';

        //liste des vendeurs
        html += '<li><h4>Vendeurs</h4></li>';
        for (const seller of this.seller_list)
        {
            let seller_shop_name: string = 'non attribué';
            let action: string = '<div class="button add-seller-to-shop"><= Ajouter</div>';
            let current: string = '';
            if(seller.id_shop != null){
                const shop_index = this.getIndex(this.shop_list,seller.id_shop);
                seller_shop_name = this.shop_list[shop_index].name;

                if(seller.id_shop == this.current_id_shop){
                    action = '<div class="button remove-seller-from-shop">Retirer =></div>';
                    current = ' class="current"';
                }
            }
            html += 
                '<li'+ current +' data-id_seller="' + seller.id + '">' + 
                    action + 
                    '<div class="td">' + seller.name + '</div>' + 
                    '<div class="td">' + seller.firstname + '</div>' + 
                    '<div class="td">' + seller_shop_name + '</div>' + 
                    '<div class="button delete-seller">X</div>' + 
                '</li>';
        }
        html += '</ul><ul>';

        //liste des produits
        if(this.current_id_shop != null)
        {
            const current_shop_index: number = this.getIndex(this.shop_list,this.current_id_shop);
            var current_shop_product_list: Array<number> = this.shop_list[current_shop_index].id_product_list;
        }
        html += '<li><h4>Produits</h4></li>';
        for(const product of this.product_list)
        {
            let action: string = '<div class="button add-product-to-shop"><= Ajouter</div>';
            let current: string = '';
            if(this.current_id_shop != null && current_shop_product_list.indexOf(product.id) != -1){
                action = '<div class="button remove-product-from-shop">Retirer =></div>';
                current = ' class="current"';
            }
            html += 
                '<li'+ current +' data-id_product="' + product.id + '">' + 
                    action + 
                    '<div class="td">' + product.name + '</div>' + 
                    '<div class="td">' + product.price + '€</div>' + 
                    '<div class="td">' + product.img + '</div>' + 
                    '<div class="button delete-product">X</div>' + 
                '</li>';
        }
        html += '</ul>';

        this.$main_form.innerHTML = html;
    }

    updateInfowindows(): void
    {
        for (const shop of this.shop_list)
        {
            let seller_list: string = '<h4>Vendeurs</h4><ul>';
            let product_list: string = '<h4>Produits</h4><ul>';
            for (const id_seller of shop.id_seller_list)
            {
                const seller_index = this.getIndex(this.seller_list,id_seller);
                seller_list += '<li>' + 
                    this.seller_list[seller_index].name + ' ' + 
                    this.seller_list[seller_index].firstname + 
                '</li>';
            }
            for (const id_product of shop.id_product_list)
            {
                const product_index = this.getIndex(this.product_list,id_product);
                product_list += '<li>' + 
                    this.product_list[product_index].name + ' ' +
                    this.product_list[product_index].price + '€ ' +
                    this.product_list[product_index].img + 
                '</li>';
            }
            seller_list += '</ul>';
            product_list += '</ul>';
            shop.updateG_infowindow(seller_list,product_list);
        }
    }

    addSellerToShop(id_shop: number,id_seller: number): void
    {
        //Si le vendeur était déjà attribué à un autre magasin, retirer celui-ci du magasin
        const seller_index = this.getIndex(this.seller_list,id_seller);
        const seller_id_shop: number = this.seller_list[seller_index].id_shop;
        
        if(seller_id_shop != null){
            this.removeSellerFromShop(seller_id_shop,id_seller);
        }
        
        //Add seller to shop
        const shop_index = this.getIndex(this.shop_list,id_shop);
        this.shop_list[shop_index].addSeller(id_seller);
        
        //Add shop to seller
        this.seller_list[seller_index].addShop(id_shop);
    }
    removeSellerFromShop(id_shop: number,id_seller: number): void
    {
        //Remove seller from shop
        const shop_index = this.getIndex(this.shop_list,id_shop);
        this.shop_list[shop_index].removeSeller(id_seller);
        
        //Remove shop from seller
        const seller_index = this.getIndex(this.seller_list,id_seller);
        this.seller_list[seller_index].removeShop();
    }

    addProductToShop(id_shop: number,id_product: number): void
    {
        const index = this.getIndex(this.shop_list,id_shop);
        this.shop_list[index].addProduct(id_product);
    }
    removeProductFromShop(id_shop: number,id_product: number): void
    {
        const index = this.getIndex(this.shop_list,id_shop);
        this.shop_list[index].removeProduct(id_product);
    }

    getLastId(array: Array<Shop | Seller | Product>): number
    {
        const lgth = array.length;
        if(lgth == 0){return 0;}

        var id_list:Array<number> = [];
        
        for (const obj of array)
        {
            id_list.push(obj.id);
        }

        return Math.max(...id_list) + 1;
    }
    getIndex(list: Array<Shop | Seller | Product>,id: number): number
    {
        for(const key in list)
        {
            const obj = list[key];
            if(obj.id == id){
                return parseInt(key);
            }
        }
        return null;
    }

    setCurrentIdShop(): void
    {
        this.current_id_shop = (this.shop_list.length == 0)
            ? null 
            : this.shop_list[0].id;
    }

    save()
    {
        let json_shop_list: Array<Object> = [];

        for(var shop of this.shop_list)
        {
            const json_marker = {
                "id" : shop.marker.id,
                "position" : shop.marker.g_marker.getPosition(),
            };
            const json_shop = {
                'id' : shop.id,
                'name': shop.name,
                'description' : shop.description,
                'marker' : json_marker,
                'id_seller_list' : shop.id_seller_list,
                'id_product_list' : shop.id_product_list
            };

            json_shop_list.push(json_shop);
        }

        localStorage.setItem('shops',JSON.stringify(json_shop_list));
        localStorage.setItem('sellers',JSON.stringify(this.seller_list));
        localStorage.setItem('products',JSON.stringify(this.product_list));
    }

    load()
    {
        /* Chargement des magasins */
        if(localStorage.getItem('shops')){
            var shop_list: Array<any> = JSON.parse(localStorage.getItem('shops'));

            for (var shop_elem of shop_list)
            {
                //Reconstruire le marker
                const position = new google.maps.LatLng(
                    shop_elem.marker.position.lat,
                    shop_elem.marker.position.lng
                );
                const marker = new Marker(
                    shop_elem.marker.id,
                    this.map,
                    position,
                    shop_elem.name,
                    shop_elem.description
                );

                //reconstruire le shop
                const shop: Shop = new Shop(
                    shop_elem.id,
                    shop_elem.name,
                    shop_elem.description,
                    marker
                );
                shop.id_seller_list = shop_elem.id_seller_list;
                shop.id_product_list = shop_elem.id_product_list;
                this.shop_list.push(shop);
            }
        }

        /* Chargement des vendeurs */
        if(localStorage.getItem('sellers')){
            var seller_list: Array<Seller> = JSON.parse(localStorage.getItem('sellers'));

            for (var seller_elem of seller_list)
            {
                const seller: Seller = new Seller(
                    seller_elem.id,
                    seller_elem.name,
                    seller_elem.firstname
                );
                if(seller_elem.id_shop){
                    seller.addShop(seller_elem.id_shop);
                }
                this.seller_list.push(seller);
            }
        }

        /* Chargement des produits */
        if(localStorage.getItem('products')){
            var product_list: Array<Product> = JSON.parse(localStorage.getItem('products'));

            for (var product_elem of product_list){
                this.product_list.push(new Product(
                    product_elem.id,
                    product_elem.name,
                    product_elem.price,
                    product_elem.img
                ));
            }
        }

        this.updateInfowindows();
    }
}