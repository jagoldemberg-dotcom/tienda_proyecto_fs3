# Desarrollo FullStack III - Tienda Online ElMercadillo

Proyecto final Full Stack para el caso **Sistema de Gestión de Pedidos de una Tienda en Línea**.

## Estructura

- `frontend-tienda-angular`: FrontEnd Angular responsive con Bootstrap y patrón Facade.
- `ms-usuarios`: microservicio Spring Boot para usuarios, registro, perfil y login.
- `ms-productos`: microservicio Spring Boot para catálogo, compras e historial.
- `ms-gestion-productos`: microservicio Spring Boot para administración del catálogo.
- `database/01_tienda_online_oracle.sql`: script Oracle con tablas y datos iniciales.
- `postman/tienda_online_microservicios.postman_collection.json`: colección para probar APIs.

## Requerimientos cubiertos

### FrontEnd

- Angular 18.
- Bootstrap 5, CSS y JS de Bootstrap.
- Responsive para móvil, tablet y escritorio usando grid de 12 columnas.
- Pantallas obligatorias: inicio de sesión, registro, recuperar contraseña y modificación de perfil.
- Pantallas internas: inicio, catálogo, mis compras y administración de productos.
- Roles `ADMIN` y `CLIENTE` con guards de navegación.
- Validaciones de formularios.
- Validaciones de contraseña: largo mínimo, largo máximo, mayúscula, minúscula, número y carácter especial.
- Patrón Facade mediante `TiendaFacadeService`.
- Consumo de APIs reales con `HttpClient`.
- Pruebas unitarias con Karma y Jasmine.

### BackEnd

- Spring Boot 3.5.
- 3 microservicios separados.
- CRUD con Oracle.
- Endpoints REST en JSON.
- Arquetipo por capas: `controller`, `service`, `repository`, `model`, `dto` y `exception`.
- Pruebas unitarias con JUnit, Mockito y Jacoco.

## Puertos

- FrontEnd: `4200`
- ms-usuarios: `8081`
- ms-productos: `8082`
- ms-gestion-productos: `8083`

## Cuentas de prueba

- Admin: `admin@tienda.cl` / `Admin123!`
- Cliente: `camila@tienda.cl` / `Cliente123!`
- Cliente 2: `daniel@tienda.cl` / `Cliente123!`

## Base de datos Oracle

Ejecutar el script:

```sql
@database/01_tienda_online_oracle.sql
```

La configuración por defecto apunta a:

```properties
jdbc:oracle:thin:@//host.docker.internal:1521/FREEPDB1
usuario: TIENDA
password: Tienda1234
```

Para Oracle Cloud o Docker Lab, puedes configurar variables de entorno:

```bash
SPRING_DATASOURCE_URL=jdbc:oracle:thin:@//<host>:1521/<service_name>
SPRING_DATASOURCE_USERNAME=TIENDA
SPRING_DATASOURCE_PASSWORD=<password>
```

También puedes copiar `.env.example` como `.env` y ajustar los valores.

## Ejecución con Docker

```bash
docker compose up --build
```

Abrir:

```text
http://localhost:4200
```

Validar APIs:

```text
http://localhost:8081/api/usuarios
http://localhost:8082/api/productos
http://localhost:8083/api/admin/productos
```

## URLs de API en Docker Lab

El FrontEnd calcula las URLs usando el hostname actual del navegador y los puertos 8081, 8082 y 8083. Si Docker Lab entrega URLs públicas diferentes para cada microservicio, abre la consola del navegador y configura:

```javascript
localStorage.setItem('TIENDA_API_USUARIOS_URL', 'https://url-ms-usuarios/api');
localStorage.setItem('TIENDA_API_PRODUCTOS_URL', 'https://url-ms-productos/api');
localStorage.setItem('TIENDA_API_GESTION_URL', 'https://url-ms-gestion-productos/api/admin');
location.reload();
```

## Ejecución local sin Docker

### Microservicios

Desde cada carpeta:

```bash
cd ms-usuarios
mvn spring-boot:run
```

```bash
cd ms-productos
mvn spring-boot:run
```

```bash
cd ms-gestion-productos
mvn spring-boot:run
```

### FrontEnd

```bash
cd frontend-tienda-angular
npm install
npm start
```

## Pruebas y cobertura

### FrontEnd

```bash
cd frontend-tienda-angular
npm test -- --browsers=ChromeHeadless --watch=false
```

Reporte:

```text
frontend-tienda-angular/coverage/frontend-tienda-angular/index.html
frontend-tienda-angular/coverage/frontend-tienda-angular/lcov.info
```

### BackEnd

Desde la raíz del proyecto:

```bash
mvn clean verify
```

Reportes Jacoco:

```text
ms-usuarios/target/site/jacoco/index.html
ms-productos/target/site/jacoco/index.html
ms-gestion-productos/target/site/jacoco/index.html
```

Si no tienes Maven instalado, puedes ejecutar las pruebas BackEnd usando Docker:

```bash
scripts/run-backend-tests-docker.bat
```

O en Linux/Mac:

```bash
./scripts/run-backend-tests-docker.sh
```

## SonarQube

1. Ejecutar pruebas FrontEnd.
2. Ejecutar pruebas BackEnd.
3. Ejecutar Sonar desde la raíz:

```bash
sonar-scanner
```

El archivo `sonar-project.properties` incluye:

- `lcov.info` del FrontEnd.
- `jacoco.xml` de los tres microservicios.
- Fuentes y tests de Angular y Java.

```
