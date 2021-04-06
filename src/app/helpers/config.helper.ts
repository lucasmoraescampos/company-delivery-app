export class ConfigHelper {

    public static Storage = {
        AccessToken: 'access_token',
        CurrentUser: 'current_user',
        CurrentCompany: 'current_company',
        CurrentOrder: 'current_order',
    };

    public static Pages = [
        {
            title: 'Início',
            url: '/home',
            icon: 'home-outline',
            disabled: false
        },
        {
            title: 'Pedidos',
            url: '/orders',
            icon: 'receipt-outline',
            disabled: false
        },
        {
            title: 'Segmentos',
            url: '/segments',
            icon: 'grid-outline',
            disabled: false
        },
        {
            title: 'Produtos',
            url: '/products',
            icon: 'bag-handle-outline',
            disabled: false
        },
        // {
        //   title: 'Relatórios',
        //   url: '/reports',
        //   icon: 'bar-chart-outline',
        //   disabled: true
        // },
        {
            title: 'Configurações',
            url: '/settings',
            icon: 'settings-outline',
            disabled: false
        }
    ]
}