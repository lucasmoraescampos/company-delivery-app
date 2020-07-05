export class ConfigHelper {
    public static Url = 'https://api.meupedido.org';
    public static Socket = 'ws://localhost:3000';
    public static Storage = {
        AccessToken: 'access_token',
        CurrentUser: 'current_user',
        Setup: {
            Photo: 'setup_photo',
            Location: 'setup_location',
            Delivery: 'setup_delivery'
        }
    };
}