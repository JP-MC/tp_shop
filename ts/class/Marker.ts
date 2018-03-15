import { App } from "./App";

export class Marker{
    public id: number;
    public g_infowindow: google.maps.InfoWindow = null;
    public g_marker: google.maps.Marker = null;

    constructor(id:number,map: google.maps.Map,position: google.maps.LatLng,title: string,description: string)
    {
        this.id = id;
        this.createG_marker(map,position,title);
        this.createG_infowindow(title,description);
        this.linkMarkerWindow(title,description);
    }

    createG_marker(map: google.maps.Map,position: google.maps.LatLng,title: string)
    {
        this.g_marker = new google.maps.Marker({
            position: position,
            map: map,
            title: title
        });
    }

    createG_infowindow(title: string,description: string)
    {
        let content: string = 
            '<h3>' + title + '</h3>' +
            '<p>' + description + '</p>' +
            '<div data-id_shop="' + this.id + '" class="update-shop button">Modifier le magasin</div>';
        let pixel_offset: google.maps.Size = new google.maps.Size(10,-10);
        this.g_infowindow = new google.maps.InfoWindow({
            content: content,
            pixelOffset: pixel_offset
        });
    }

    linkMarkerWindow(title: string,description: string)
    {
        this.g_marker.addListener('click',()=>{
            this.g_infowindow.open(this.g_marker.getMap(),this.g_marker);
        });
    }

    updateContent(content: string)
    {
        this.g_infowindow.setContent(content);
    }
}