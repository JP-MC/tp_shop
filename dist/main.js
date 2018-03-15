System.register("class/Marker", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Marker;
    return {
        setters: [],
        execute: function () {
            Marker = class Marker {
                constructor(id, map, position, title, description) {
                    this.g_infowindow = null;
                    this.g_marker = null;
                    this.id = id;
                    this.createG_marker(map, position, title);
                    this.createG_infowindow(title, description);
                    this.linkMarkerWindow(title, description);
                }
                createG_marker(map, position, title) {
                    this.g_marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        title: title
                    });
                }
                createG_infowindow(title, description) {
                    let content = '<h3>' + title + '</h3>' +
                        '<p>' + description + '</p>' +
                        '<div data-id_shop="' + this.id + '" class="update-shop button">Modifier le magasin</div>';
                    let pixel_offset = new google.maps.Size(10, -10);
                    this.g_infowindow = new google.maps.InfoWindow({
                        content: content,
                        pixelOffset: pixel_offset
                    });
                }
                linkMarkerWindow(title, description) {
                    this.g_marker.addListener('click', () => {
                        this.g_infowindow.open(this.g_marker.getMap(), this.g_marker);
                    });
                }
                updateContent(content) {
                    this.g_infowindow.setContent(content);
                }
            };
            exports_1("Marker", Marker);
        }
    };
});
System.register("class/Shop", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var Shop;
    return {
        setters: [],
        execute: function () {
            Shop = class Shop {
                constructor(id, name, description, marker) {
                    this.id_seller_list = [];
                    this.id_product_list = [];
                    this.id = id;
                    this.name = name;
                    this.description = description;
                    this.marker = marker;
                }
                addSeller(id) {
                    this.id_seller_list.push(id);
                }
                removeSeller(id) {
                    const index = this.id_seller_list.indexOf(id);
                    this.id_seller_list.splice(index, 1);
                }
                addProduct(id) {
                    this.id_product_list.push(id);
                }
                removeProduct(id) {
                    const index = this.id_product_list.indexOf(id);
                    this.id_product_list.splice(index, 1);
                }
                updateG_infowindow(seller_list, product_list) {
                    let content = '<h3>' + this.name + '</h3>' +
                        '<p>' + this.description + '</p>' +
                        seller_list +
                        product_list +
                        '<div data-id_shop="' + this.id + '" class="update-shop button">Modifier le magasin</div>';
                    this.marker.updateContent(content);
                }
            };
            exports_2("Shop", Shop);
        }
    };
});
System.register("class/Seller", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var Seller;
    return {
        setters: [],
        execute: function () {
            Seller = class Seller {
                constructor(id, name, firstname) {
                    this.id_shop = null;
                    this.id = id;
                    this.name = name;
                    this.firstname = firstname;
                }
                addShop(id) {
                    this.id_shop = id;
                }
                removeShop() {
                    this.id_shop = null;
                }
            };
            exports_3("Seller", Seller);
        }
    };
});
System.register("class/Product", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var Product;
    return {
        setters: [],
        execute: function () {
            Product = class Product {
                constructor(id, name, price, img) {
                    this.id = id;
                    this.name = name;
                    this.price = price;
                    this.img = img;
                }
            };
            exports_4("Product", Product);
        }
    };
});
System.register("class/App", ["class/Marker", "class/Shop", "class/Seller", "class/Product"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var Marker_1, Shop_1, Seller_1, Product_1, App;
    return {
        setters: [
            function (Marker_1_1) {
                Marker_1 = Marker_1_1;
            },
            function (Shop_1_1) {
                Shop_1 = Shop_1_1;
            },
            function (Seller_1_1) {
                Seller_1 = Seller_1_1;
            },
            function (Product_1_1) {
                Product_1 = Product_1_1;
            }
        ],
        execute: function () {
            App = class App {
                constructor() {
                    this.shop_list = [];
                    this.seller_list = [];
                    this.product_list = [];
                    this.current_id_shop = null;
                    this.$map = document.getElementById('map');
                    this.$shop_form = document.getElementById('shop-form');
                    this.$shop_name = document.getElementById('shop-name');
                    this.$shop_description = document.getElementById('shop-description');
                    this.$latitude = document.getElementById('latitude');
                    this.$longitude = document.getElementById('longitude');
                    this.$seller_form = document.getElementById('seller-form');
                    this.$seller_name = document.getElementById('seller-name');
                    this.$seller_firstname = document.getElementById('seller-firstname');
                    this.$product_form = document.getElementById('product-form');
                    this.$product_name = document.getElementById('product-name');
                    this.$product_price = document.getElementById('product-price');
                    this.$product_img = document.getElementById('product-img');
                    this.$admin_button = document.getElementById('admin-button');
                    this.$main_form_container = document.getElementById('main-form-container');
                    this.$main_form = document.getElementById('main-form');
                    this.$close_main_form = document.getElementById('close-main-form');
                }
                initMap() {
                    this.map = new google.maps.Map(document.getElementById('map'), {
                        center: { lat: 42.6990297, lng: 2.8344617 },
                        zoom: 8
                    });
                }
                addMarker() {
                    const position = new google.maps.LatLng(parseFloat(this.$latitude.value), parseFloat(this.$longitude.value));
                    return new Marker_1.Marker(this.shop_list.length, this.map, position, this.$shop_name.value, this.$shop_description.value);
                }
                addShop() {
                    const last_id = this.getLastId(this.shop_list);
                    this.shop_list.push(new Shop_1.Shop(last_id, this.$shop_name.value, this.$shop_description.value, this.addMarker()));
                }
                deleteShop(id_shop) {
                    const shop_index = this.getIndex(this.shop_list, id_shop);
                    for (const id_seller of this.shop_list[shop_index].id_seller_list) {
                        const index = this.getIndex(this.seller_list, id_seller);
                        this.seller_list[index].removeShop();
                    }
                    this.shop_list[shop_index].marker.g_marker.setMap(null);
                    this.shop_list.splice(shop_index, 1);
                    if (id_shop == this.current_id_shop) {
                        this.setCurrentIdShop();
                    }
                }
                addSeller() {
                    const last_id = this.getLastId(this.seller_list);
                    this.seller_list.push(new Seller_1.Seller(last_id, this.$seller_name.value, this.$seller_firstname.value));
                }
                deleteSeller(id_seller) {
                    const seller_index = this.getIndex(this.seller_list, id_seller);
                    if (this.seller_list[seller_index].id_shop != null) {
                        this.removeSellerFromShop(this.seller_list[seller_index].id_shop, this.seller_list[seller_index].id);
                    }
                    this.seller_list.splice(seller_index, 1);
                }
                addProduct() {
                    const last_id = this.getLastId(this.product_list);
                    this.product_list.push(new Product_1.Product(last_id, this.$product_name.value, parseFloat(this.$product_price.value), this.$product_img.value));
                }
                deleteProduct(id_product) {
                    for (const shop of this.shop_list) {
                        const index_of = shop.id_product_list.indexOf(id_product);
                        if (index_of != -1) {
                            shop.id_product_list.splice(index_of, 1);
                        }
                    }
                    const product_index = this.getIndex(this.product_list, id_product);
                    this.product_list.splice(product_index, 1);
                }
                htmlMainForm() {
                    var html = '<ul>';
                    html += '<li><h4>Magasins</h4></li>';
                    for (const shop of this.shop_list) {
                        const current = (shop.id == this.current_id_shop) ? ' current' : '';
                        html +=
                            '<li class="shop' + current + '" data-id_shop="' + shop.id + '">' +
                                '<div class="td">' + shop.name + '</div>' +
                                '<div class="button delete-shop">X</div>' +
                                '</li>';
                    }
                    html += '</ul><ul>';
                    html += '<li><h4>Vendeurs</h4></li>';
                    for (const seller of this.seller_list) {
                        let seller_shop_name = 'non attribué';
                        let action = '<div class="button add-seller-to-shop"><= Ajouter</div>';
                        let current = '';
                        if (seller.id_shop != null) {
                            const shop_index = this.getIndex(this.shop_list, seller.id_shop);
                            seller_shop_name = this.shop_list[shop_index].name;
                            if (seller.id_shop == this.current_id_shop) {
                                action = '<div class="button remove-seller-from-shop">Retirer =></div>';
                                current = ' class="current"';
                            }
                        }
                        html +=
                            '<li' + current + ' data-id_seller="' + seller.id + '">' +
                                action +
                                '<div class="td">' + seller.name + '</div>' +
                                '<div class="td">' + seller.firstname + '</div>' +
                                '<div class="td">' + seller_shop_name + '</div>' +
                                '<div class="button delete-seller">X</div>' +
                                '</li>';
                    }
                    html += '</ul><ul>';
                    if (this.current_id_shop != null) {
                        const current_shop_index = this.getIndex(this.shop_list, this.current_id_shop);
                        var current_shop_product_list = this.shop_list[current_shop_index].id_product_list;
                    }
                    html += '<li><h4>Produits</h4></li>';
                    for (const product of this.product_list) {
                        let action = '<div class="button add-product-to-shop"><= Ajouter</div>';
                        let current = '';
                        if (this.current_id_shop != null && current_shop_product_list.indexOf(product.id) != -1) {
                            action = '<div class="button remove-product-from-shop">Retirer =></div>';
                            current = ' class="current"';
                        }
                        html +=
                            '<li' + current + ' data-id_product="' + product.id + '">' +
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
                updateInfowindows() {
                    for (const shop of this.shop_list) {
                        let seller_list = '<h4>Vendeurs</h4><ul>';
                        let product_list = '<h4>Produits</h4><ul>';
                        for (const id_seller of shop.id_seller_list) {
                            const seller_index = this.getIndex(this.seller_list, id_seller);
                            seller_list += '<li>' +
                                this.seller_list[seller_index].name + ' ' +
                                this.seller_list[seller_index].firstname +
                                '</li>';
                        }
                        for (const id_product of shop.id_product_list) {
                            const product_index = this.getIndex(this.product_list, id_product);
                            product_list += '<li>' +
                                this.product_list[product_index].name + ' ' +
                                this.product_list[product_index].price + '€ ' +
                                this.product_list[product_index].img +
                                '</li>';
                        }
                        seller_list += '</ul>';
                        product_list += '</ul>';
                        shop.updateG_infowindow(seller_list, product_list);
                    }
                }
                addSellerToShop(id_shop, id_seller) {
                    const seller_index = this.getIndex(this.seller_list, id_seller);
                    const seller_id_shop = this.seller_list[seller_index].id_shop;
                    if (seller_id_shop != null) {
                        this.removeSellerFromShop(seller_id_shop, id_seller);
                    }
                    const shop_index = this.getIndex(this.shop_list, id_shop);
                    this.shop_list[shop_index].addSeller(id_seller);
                    this.seller_list[seller_index].addShop(id_shop);
                }
                removeSellerFromShop(id_shop, id_seller) {
                    const shop_index = this.getIndex(this.shop_list, id_shop);
                    this.shop_list[shop_index].removeSeller(id_seller);
                    const seller_index = this.getIndex(this.seller_list, id_seller);
                    this.seller_list[seller_index].removeShop();
                }
                addProductToShop(id_shop, id_product) {
                    const index = this.getIndex(this.shop_list, id_shop);
                    this.shop_list[index].addProduct(id_product);
                }
                removeProductFromShop(id_shop, id_product) {
                    const index = this.getIndex(this.shop_list, id_shop);
                    this.shop_list[index].removeProduct(id_product);
                }
                getLastId(array) {
                    const lgth = array.length;
                    if (lgth == 0) {
                        return 0;
                    }
                    var id_list = [];
                    for (const obj of array) {
                        id_list.push(obj.id);
                    }
                    return Math.max(...id_list) + 1;
                }
                getIndex(list, id) {
                    for (const key in list) {
                        const obj = list[key];
                        if (obj.id == id) {
                            return parseInt(key);
                        }
                    }
                    return null;
                }
                setCurrentIdShop() {
                    this.current_id_shop = (this.shop_list.length == 0)
                        ? null
                        : this.shop_list[0].id;
                }
                save() {
                    let json_shop_list = [];
                    for (var shop of this.shop_list) {
                        const json_marker = {
                            "id": shop.marker.id,
                            "position": shop.marker.g_marker.getPosition(),
                        };
                        const json_shop = {
                            'id': shop.id,
                            'name': shop.name,
                            'description': shop.description,
                            'marker': json_marker,
                            'id_seller_list': shop.id_seller_list,
                            'id_product_list': shop.id_product_list
                        };
                        json_shop_list.push(json_shop);
                    }
                    localStorage.setItem('shops', JSON.stringify(json_shop_list));
                    localStorage.setItem('sellers', JSON.stringify(this.seller_list));
                    localStorage.setItem('products', JSON.stringify(this.product_list));
                }
                load() {
                    if (localStorage.getItem('shops')) {
                        var shop_list = JSON.parse(localStorage.getItem('shops'));
                        for (var shop_elem of shop_list) {
                            const position = new google.maps.LatLng(shop_elem.marker.position.lat, shop_elem.marker.position.lng);
                            const marker = new Marker_1.Marker(shop_elem.marker.id, this.map, position, shop_elem.name, shop_elem.description);
                            const shop = new Shop_1.Shop(shop_elem.id, shop_elem.name, shop_elem.description, marker);
                            shop.id_seller_list = shop_elem.id_seller_list;
                            shop.id_product_list = shop_elem.id_product_list;
                            this.shop_list.push(shop);
                        }
                    }
                    if (localStorage.getItem('sellers')) {
                        var seller_list = JSON.parse(localStorage.getItem('sellers'));
                        for (var seller_elem of seller_list) {
                            const seller = new Seller_1.Seller(seller_elem.id, seller_elem.name, seller_elem.firstname);
                            if (seller_elem.id_shop) {
                                seller.addShop(seller_elem.id_shop);
                            }
                            this.seller_list.push(seller);
                        }
                    }
                    if (localStorage.getItem('products')) {
                        var product_list = JSON.parse(localStorage.getItem('products'));
                        for (var product_elem of product_list) {
                            this.product_list.push(new Product_1.Product(product_elem.id, product_elem.name, product_elem.price, product_elem.img));
                        }
                    }
                    this.updateInfowindows();
                }
            };
            exports_5("App", App);
        }
    };
});
System.register("main", ["class/App"], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var App_1, app;
    return {
        setters: [
            function (App_1_1) {
                App_1 = App_1_1;
            }
        ],
        execute: function () {
            app = new App_1.App();
            app.initMap();
            app.load();
            app.map.addListener('click', function (event) {
                app.$latitude.value = event.latLng.lat();
                app.$longitude.value = event.latLng.lng();
            });
            app.$shop_form.addEventListener('submit', function (event) {
                event.preventDefault();
                app.addShop();
            });
            app.$seller_form.addEventListener('submit', function (event) {
                event.preventDefault();
                app.addSeller();
            });
            app.$product_form.addEventListener('submit', function (event) {
                event.preventDefault();
                app.addProduct();
            });
            app.$admin_button.addEventListener('click', function (event) {
                app.setCurrentIdShop();
                app.htmlMainForm();
                app.$main_form_container.style.display = 'block';
            });
            app.$close_main_form.addEventListener('click', function (event) {
                app.$main_form_container.style.display = 'none';
                app.updateInfowindows();
            });
            app.$map.addEventListener('click', function (event) {
                let elem = event.target;
                if (elem.classList.contains('update-shop')) {
                    app.current_id_shop = parseInt(elem.dataset.id_shop);
                    app.htmlMainForm();
                    app.$main_form_container.style.display = 'block';
                }
            });
            app.$main_form.addEventListener('click', function (event) {
                let elem = event.target;
                if (elem.classList.contains('add-seller-to-shop')) {
                    const id_seller = parseInt(elem.parentElement.dataset.id_seller);
                    app.addSellerToShop(app.current_id_shop, id_seller);
                    app.htmlMainForm();
                }
                else if (elem.classList.contains('remove-seller-from-shop')) {
                    const id_seller = parseInt(elem.parentElement.dataset.id_seller);
                    app.removeSellerFromShop(app.current_id_shop, id_seller);
                    app.htmlMainForm();
                }
                else if (elem.classList.contains('add-product-to-shop')) {
                    const id_product = parseInt(elem.parentElement.dataset.id_product);
                    app.addProductToShop(app.current_id_shop, id_product);
                    app.htmlMainForm();
                }
                else if (elem.classList.contains('remove-product-from-shop')) {
                    const id_product = parseInt(elem.parentElement.dataset.id_product);
                    app.removeProductFromShop(app.current_id_shop, id_product);
                    app.htmlMainForm();
                }
                else if (elem.classList.contains('shop')) {
                    app.current_id_shop = parseInt(elem.dataset.id_shop);
                    app.htmlMainForm();
                }
                else if (elem.classList.contains('delete-shop')) {
                    const id_shop = parseInt(elem.parentElement.dataset.id_shop);
                    app.deleteShop(id_shop);
                    app.htmlMainForm();
                }
                else if (elem.classList.contains('delete-seller')) {
                    const id_seller = parseInt(elem.parentElement.dataset.id_seller);
                    app.deleteSeller(id_seller);
                    app.htmlMainForm();
                }
                else if (elem.classList.contains('delete-product')) {
                    const id_product = parseInt(elem.parentElement.dataset.id_product);
                    app.deleteProduct(id_product);
                    app.htmlMainForm();
                }
            });
            window.addEventListener("beforeunload", function (event) {
                app.save();
            });
        }
    };
});
//# sourceMappingURL=main.js.map