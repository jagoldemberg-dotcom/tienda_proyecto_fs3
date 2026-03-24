# Evaluación Desarrollo Full Stack III - BackEnd Tienda en Línea

Este repositorio contiene una propuesta completa para la evaluación del caso **Sistema de Gestión de Pedidos de una Tienda en Línea**, basada en la estructura del ejemplo entregado por el docente, pero adaptada al caso solicitado en `instrucciones.docx`.

## Contenido

- `ms-usuarios`: microservicio para CRUD de usuarios e inicio de sesión.
- `ms-productos`: microservicio para CRUD de productos, búsqueda y compra simulada.
- `database/01_tienda_online_oracle.sql`: script Oracle con creación de tablas e inserción de datos.
- `postman/tienda_online_microservicios.postman_collection.json`: colección de pruebas para ambos microservicios.

## Microservicios implementados

### 1) Microservicio de usuarios
Puerto sugerido: `8081`

Funcionalidades:
- Crear usuario
- Listar usuarios
- Buscar usuario por ID
- Actualizar usuario
- Eliminar usuario
- Login básico por correo y contraseña
- Manejo de roles: `ADMIN` y `CLIENTE`

### 2) Microservicio de productos y compras
Puerto sugerido: `8082`

Funcionalidades:
- Crear producto
- Listar productos
- Buscar producto por ID
- Buscar por nombre
- Buscar por categoría
- Actualizar producto
- Eliminar producto
- Comprar producto (simulado)
- Listar compras realizadas

## Requisitos recomendados

- Java 21
- Maven 3.9+
- Oracle Database / Oracle XE
- Postman

## Configuración base de Oracle

En ambos microservicios debes revisar el archivo `src/main/resources/application.properties` y cambiar:

- `spring.datasource.url`
- `spring.datasource.username`
- `spring.datasource.password`

El script SQL está pensado para ejecutarse con un usuario Oracle dedicado, por ejemplo `TIENDA_FS3`.

## Orden recomendado de ejecución

1. Crear el usuario/schema en Oracle.
2. Ejecutar `database/01_tienda_online_oracle.sql`.
3. Configurar `application.properties` en ambos microservicios.
4. Levantar `ms-usuarios`.
5. Levantar `ms-productos`.
6. Probar con Postman usando la colección incluida.

## Ejecución con Maven

### ms-usuarios
```bash
cd ms-usuarios
mvn spring-boot:run
```

### ms-productos
```bash
cd ms-productos
mvn spring-boot:run
```

## Endpoints principales

### Usuarios
- `GET /api/usuarios`
- `GET /api/usuarios/{id}`
- `POST /api/usuarios`
- `PUT /api/usuarios/{id}`
- `DELETE /api/usuarios/{id}`
- `POST /api/auth/login`

### Productos
- `GET /api/productos`
- `GET /api/productos/{id}`
- `GET /api/productos/buscar?nombre=...`
- `GET /api/productos/categoria/{categoria}`
- `POST /api/productos`
- `PUT /api/productos/{id}`
- `DELETE /api/productos/{id}`
- `POST /api/productos/{id}/comprar`
- `GET /api/compras`
