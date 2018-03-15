import { Marker } from "./Marker";

export class Shop
{
	public id: number;
	public name: string;
	public description: string;
	public marker: Marker;
	public id_seller_list: Array<number> = [];
	public id_product_list: Array<number> = [];

	constructor(id: number,name: string,description: string,marker: Marker)
	{
		this.id = id;
		this.name = name;
		this.description = description;
		this.marker = marker;
	}

	addSeller(id: number): void
	{
		this.id_seller_list.push(id);
	}
	removeSeller(id: number): void
	{
		const index = this.id_seller_list.indexOf(id);
		this.id_seller_list.splice(index,1);
	}

	addProduct(id: number): void
	{
		this.id_product_list.push(id);
	}
	removeProduct(id: number): void
	{
		const index = this.id_product_list.indexOf(id);
		this.id_product_list.splice(index,1);
	}

	updateG_infowindow(seller_list: string,product_list: string)
    {
        let content: string = 
            '<h3>' + this.name + '</h3>' +
            '<p>' + this.description + '</p>' +
            seller_list +
            product_list +
            '<div data-id_shop="' + this.id + '" class="update-shop button">Modifier le magasin</div>';
        this.marker.updateContent(content);
    }
}