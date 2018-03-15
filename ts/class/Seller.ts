export class Seller
{
	public id: number;
	public name: string;
	public firstname: string;
	public id_shop: number = null;

	constructor(id: number,name: string,firstname: string)
	{
		this.id = id;
		this.name = name;
		this.firstname = firstname;
	}

	addShop(id: number): void
	{
			this.id_shop = id;
	}
	removeShop(): void
	{
			this.id_shop = null;
	}
}