# Desarrollo FullStack III - Tienda Online NovaMarket

Proyecto ajustado a la actividad **Desarrollando nuestro proyecto bajo lineamientos empresariales**.

## Estructura
- `frontend-tienda-angular`
- `ms-usuarios`
- `ms-productos`
- `ms-gestion-productos`
- `database/01_tienda_online_oracle.sql`
- `postman/tienda_online_microservicios.postman_collection.json`
- `arquetipo-backend`
- `docker-compose.yml`

## Lo que cubre la solución
### FrontEnd
- Angular
- Bootstrap y CSS
- responsive para móvil, tablet y escritorio
- login, registro, recuperar contraseña y perfil
- catálogo, compras y administración
- 2 roles: ADMIN y CLIENTE
- datos manejados con arreglos, colecciones y localStorage
- patrón Facade

### BackEnd
- Spring Boot
- 3 microservicios
- Oracle
- endpoints JSON
- Postman
- arquetipo consistente: controller, service, repository, model, dto y exception

## Puertos
- FrontEnd: 4200
- ms-usuarios: 8081
- ms-productos: 8082
- ms-gestion-productos: 8083

## Oracle
Edita los `application.properties` según tu conexión y ejecuta el script de `database`.

## Ejecución local
### FrontEnd
```bash
cd frontend-tienda-angular
npm install
npm start
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

## Docker
```bash
docker compose up --build
```

## Cuentas FrontEnd
- Admin: `admin@tienda.cl` / `Admin123!`
- Cliente: `camila@tienda.cl` / `Cliente123!`
