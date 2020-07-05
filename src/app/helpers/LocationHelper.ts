import { LatLng } from '../models/LatLng';

export class LocationHelper {

    public static distance(origin: LatLng, destiny: LatLng) {

        if (origin.lat == destiny.lat && origin.lng == destiny.lng) {

            return 0;

        }

        else {

            const radlat1 = Math.PI * Number(origin.lat) / 180;

            const radlat2 = Math.PI * Number(destiny.lat) / 180;

            const theta = Number(origin.lng) - Number(destiny.lng);

            const radtheta = Math.PI * theta / 180;

            let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

            dist = dist > 1 ? 1 : dist;

            dist = Math.acos(dist);

            dist = dist * 180 / Math.PI;

            dist = dist * 60 * 1.1515;

            dist = dist * 1.609344;

            return dist;

        }

    }
}