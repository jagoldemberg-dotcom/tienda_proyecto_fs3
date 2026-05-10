const browserWindow = typeof window !== 'undefined' ? window : undefined;
const runtimeProtocol = browserWindow?.location?.protocol || 'http:';
const runtimeHost = browserWindow?.location?.hostname || 'localhost';

// En Docker Lab o en una URL pública, el FrontEnd queda en otro host.
// Por defecto se usa el mismo hostname visible en el navegador y se cambian los puertos.
// Si Docker Lab entrega hosts distintos por servicio, puedes sobreescribirlos desde consola:
// localStorage.setItem('TIENDA_API_USUARIOS_URL', 'https://url-ms-usuarios/api')
// localStorage.setItem('TIENDA_API_PRODUCTOS_URL', 'https://url-ms-productos/api')
// localStorage.setItem('TIENDA_API_GESTION_URL', 'https://url-ms-gestion-productos/api/admin')
const getOverride = (key: string): string | null => {
  try {
    return browserWindow?.localStorage?.getItem(key) || null;
  } catch {
    return null;
  }
};

const buildApiUrl = (port: number, path: string): string => `${runtimeProtocol}//${runtimeHost}:${port}${path}`;

export const API_CONFIG = {
  usuariosUrl: getOverride('TIENDA_API_USUARIOS_URL') || buildApiUrl(8081, '/api'),
  productosUrl: getOverride('TIENDA_API_PRODUCTOS_URL') || buildApiUrl(8082, '/api'),
  gestionProductosUrl: getOverride('TIENDA_API_GESTION_URL') || buildApiUrl(8083, '/api/admin')
};
