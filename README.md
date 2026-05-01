# Desarrollo FullStack III - Tienda Online ElMercadillo

Proyecto final para **Presentando el desarrollo Full Stack Final**.

## Estructura

- `frontend-tienda-angular`: FrontEnd Angular responsive con Bootstrap.
- `ms-usuarios`: microservicio Spring Boot para usuarios, registro, perfil y login.
- `ms-productos`: microservicio Spring Boot para catálogo, compras e historial.
- `ms-gestion-productos`: microservicio Spring Boot para administración del catálogo.
- `database/01_tienda_online_oracle.sql`: script Oracle con tablas y datos iniciales.
- `postman/tienda_online_microservicios.postman_collection.json`: colección para probar APIs.
- `sonar-project.properties`: configuración para SonarQube y cobertura FrontEnd.

## Requerimientos cubiertos

### FrontEnd

- Angular.
- Bootstrap y CSS.
- Responsive para móvil, tablet y escritorio usando grid de 12 columnas.
- Pantallas de login, registro, recuperar contraseña y perfil.
- Catálogo, compras y administración de productos.
- Roles `ADMIN` y `CLIENTE`.
- Validaciones de formularios.
- Validaciones de contraseña: largo, mayúscula, minúscula, número y carácter especial.
- Patrón Facade mediante `TiendaFacadeService`.
- Consumo de APIs reales con `HttpClient`.
- Pruebas unitarias con Karma y Jasmine.

### BackEnd

- Spring Boot.
- 3 microservicios.
- CRUD con Oracle.
- Endpoints REST en JSON.
- Capas tipo arquetipo: controller, service, repository, model, dto y exception.
- Colección Postman.

## Puertos

- FrontEnd: `4200`
- ms-usuarios: `8081`
- ms-productos: `8082`
- ms-gestion-productos: `8083`

## Cuentas de prueba

- Admin: `admin@tienda.cl` / `Admin123!`
- Cliente: `camila@tienda.cl` / `Cliente123!`
- Cliente 2: `daniel@tienda.cl` / `Cliente123!`

## Ejecución rápida

### Base de datos

Ejecutar:

```sql
@database/01_tienda_online_oracle.sql
```

### Microservicios

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

```bash
cd frontend-tienda-angular
npm test
```

Reporte:

```text
frontend-tienda-angular/coverage/frontend-tienda-angular/index.html
```

## SonarQube

```bash
cd frontend-tienda-angular
npm test
cd ..
sonar-scanner
```
