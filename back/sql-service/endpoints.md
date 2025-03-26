# Documentación de la API de Gestión de Usuarios

Servidor Node.js/Express para gestión de usuarios, autenticación, y administración de perfiles.

## Características Principales
- ✅ Autenticación con email/contraseña
- 👥 CRUD completo de usuarios
- 🔒 Roles de usuarios (cliente, admin)
- 🔑 Cambio de contraseñas seguro
- 🛡️ Encriptación de contraseñas con bcrypt

## Tabla de Contenidos
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Modelo de Datos](#modelo-de-datos)
- [Endpoints](#endpoints)
  - [Usuarios](#usuarios)
- [Variables de Entorno](#variables-de-entorno)
- [Licencia](#licencia)

## Tecnologías Utilizadas
- Node.js
- Express
- Sequelize ORM
- bcrypt
- MySQL/PostgreSQL

## Instalación
```bash
git clone [tu-repositorio]
cd tu-proyecto
npm install
```

## Configuración
Crea un archivo `.env` en la raíz del proyecto con la siguiente configuración:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_db
PORT=3000
JWT_SECRET=tu_secreto_jwt
```

## Estructura del Proyecto
El proyecto sigue una arquitectura MVC (Modelo-Vista-Controlador):
```
├── controllers/
│   └── userController.js
├── models/
│   └── User.js
├── routes/
│   └── userRoutes.js
├── middleware/
│   └── auth.js
├── config/
│   └── db.js
├── .env
└── server.js
```

## Modelo de Datos

### Usuario
```javascript
{
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('cliente', 'admin'),
    allowNull: false,
    defaultValue: 'cliente'
  },
  gold: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  playTime: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}
```

## Endpoints

### Usuarios

#### 1. **Crear Usuario**
- **Método**: `POST`
- **Ruta**: `/users`
- **Descripción**: Crea un nuevo usuario.
- **Cuerpo de la Solicitud**:
  ```json
  {
    "email": "usuario@ejemplo.com",
    "username": "nombreUsuario",
    "password": "contraseña"
  }
  ```
- **Respuesta de éxito**:
  - **Código**: `201 Created`
  - **Cuerpo**:
    ```json
    {
      "message": "Usuario creado exitosamente",
      "user": {
        "email": "usuario@ejemplo.com",
        "username": "nombreUsuario",
        "rol": "cliente"
      }
    }
    ```

#### 2. **Obtener Todos los Usuarios**
- **Método**: `GET`
- **Ruta**: `/users`
- **Descripción**: Obtiene una lista de todos los usuarios.
- **Respuesta de éxito**:
  - **Código**: `200 OK`
  - **Cuerpo**: Array de objetos usuario.

#### 3. **Obtener Usuario por ID**
- **Método**: `GET`
- **Ruta**: `/users/:id`
- **Descripción**: Obtiene los detalles de un usuario específico por su ID.
- **Respuesta de éxito**:

  - **Código**: `200 OK`
  - **Cuerpo**: Objeto usuario.
- **Respuesta de error**:
  - **Código**: `404 Not Found`
  - **Cuerpo**:
    ```json
    {
      "message": "Usuario no encontrado"
    }
    ```

#### 4. **Obtener Usuario por Email**
- **Método**: `GET`
- **Ruta**: `/users/email/:email`
- **Descripción**: Obtiene los detalles de un usuario específico por su email.
- **Respuesta de éxito**:
  - **Código**: `200 OK`
  - **Cuerpo**: Objeto usuario.
- **Respuesta de error**:
  - **Código**: `404 Not Found`
  - **Cuerpo**:
    ```json
    {
      "message": "Usuario no encontrado"
    }
    ```

#### 5. **Actualizar Usuario**
- **Método**: `PUT`
- **Ruta**: `/users/:id`
- **Descripción**: Actualiza la información de un usuario.
- **Cuerpo de la Solicitud**:
  ```json
  {
    "email": "nuevo@ejemplo.com",
    "username": "nuevoUsername",
    "password": "nuevaContraseña",
    "rol": "admin",
    "gold": 100,
    "playTime": 3600
  }
  ```
- **Respuesta de éxito**:
  - **Código**: `200 OK`
  - **Cuerpo**:
    ```json
    {
      "message": "Usuario actualizado exitosamente",
      "updatedUser": { ... }
    }
    ```

#### 6. **Eliminar Usuario**
- **Método**: `DELETE`
- **Ruta**: `/users/:id`
- **Descripción**: Elimina un usuario.
- **Respuesta de éxito**:
  - **Código**: `200 OK`
  - **Cuerpo**:
    ```json
    {
      "message": "Usuario eliminado exitosamente"
    }
    ```
- **Respuesta de error**:
  - **Código**: `404 Not Found`
  - **Cuerpo**:
    ```json
    {
      "message": "Usuario no encontrado"
    }
    ```

#### 7. **Cambiar Contraseña**
- **Método**: `PUT`
- **Ruta**: `/users/:id/password`
- **Descripción**: Cambia la contraseña de un usuario específico.
- **Cuerpo de la Solicitud**:
  ```json
  {
    "password": "nuevaContraseña"
  }
  ```
- **Respuesta de éxito**:
  - **Código**: `200 OK`
  - **Cuerpo**:
    ```json
    {
      "message": "Contraseña actualizada exitosamente"
    }
    ```

## Variables de Entorno
Para configurar correctamente la aplicación, asegúrate de configurar las siguientes variables en tu archivo `.env`:

```
# Configuración de Base de Datos
DB_HOST=localhost
DB_USER=usuario_db
DB_PASSWORD=contraseña_db
DB_NAME=nombre_db
DB_PORT=3306

# Configuración del Servidor
PORT=3000

# Seguridad
JWT_SECRET=tu_clave_secreta
```

## Licencia
Este proyecto está licenciado bajo la Licencia MIT - ver el archivo LICENSE para más detalles.