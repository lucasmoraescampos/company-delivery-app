export class ConfigHelper {
    public static Url = 'http://api.meupedido.localhost';
    public static Mercadopago = {
        publicKey: 'APP_USR-a157c6fd-6b03-4533-876a-6b4b42e11d97',
        publicKeyTest: 'TEST-b01bd26b-0810-457b-8187-54db697eb8eb',
    };
    public static Storage = {
        AccessToken: 'access_token',
        CurrentUser: 'current_user',
        CurrentCompany: 'current_company',
        CurrentOrder: 'current_order',
    };
    public static Loading = {
        backdropBorderRadius: '4px',
        backdropBackgroundColour: 'rgba(255, 255, 255, 0.5)',
        primaryColour: '#428cff',
        secondaryColour: '#428cff',
        tertiaryColour: '#428cff',
        fullScreenBackdrop: true
    };
}