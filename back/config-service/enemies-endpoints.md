# Documentación de Endpoints de Enemigos

## 1. Obtener Enemigo Jefe
- **Endpoint:** `GET /enemies/boss`
- **Descripción:** Obtiene los stats del enemigo jefe
- **Respuesta:**
  ```json
  {
    "health": 100,
    "danoColumna": 15,
    "danoFuegoBoca": 75
  }
  ```
- **Formato Completo en Base de Datos:**
  ```json
  {
    "_id": "67d2fe8db505f7f3b11970bb",
    "id": 5,
    "name": "demon",
    "type": "boss",
    "level": "level1",
    "stats": {
      "health": 100,
      "danoColumna": 15,
      "danoFuegoBoca": 75
    }
  }
  ```

## 2. Obtener Enemigos para Unity
- **Endpoint:** `GET /unity/enemies`
- **Descripción:** Obtiene lista de enemigos específicos para Unity
- **Respuesta:**
  ```json
  {
    "wolf": {
      "damage": 15,
      "detectionRange": 3,
      "maxHealth": 100,
      "moveSpeed": 2
    },
    "horse": {
      "damage": 15,
      "chargeDistance": 1.1,
      "maxHealth": 100,
      "moveSpeed": 2
    },
    "ghost": {
      "detectionRange": 6,
      "maxHealth": 100,
      "moveSpeed": 4
    },
    "grunt": {
      "enemyDamage": 15,
      "maxHealth": 100,
      "shootingDistance": 1
    },
    "ogre": {
      "damage": 15,
      "detectionRange": 3,
      "maxHealth": 100,
      "atackCooldawn": 4
    }
  }
  ```

## 3. Obtener Todos los Enemigos
- **Endpoint:** `GET /enemies`
- **Descripción:** Obtiene lista completa de enemigos
- **Respuesta Ejemplo:**
  ```json
  [
    {
      "_id": "67d2fe8db505f7f3b11970b7",
      "id": 1,
      "name": "wolf",
      "type": "enemy",
      "level": "level1",
      "stats": {
        "damage": 15,
        "detectionRange": 3,
        "maxHealth": 100,
        "moveSpeed": 2
      }
    },
    {
      "_id": "67d2fe8db505f7f3b11970bb",
      "id": 5,
      "name": "demon",
      "type": "boss",
      "level": "level1",
      "stats": {
        "health": 100,
        "danoColumna": 15,
        "danoFuegoBoca": 75
      }
    }
  ]
  ```

## 4. Crear Enemigo
- **Endpoint:** `POST /enemies`
- **Body de la Solicitud:** Seguir el formato de ejemplo
  ```json
  {
    "name": "nuevoEnemigo",
    "type": "enemy",
    "level": "level1",
    "stats": {
      "damage": 15,
      "maxHealth": 100
    }
  }
  ```

## 5. Actualizar Enemigo
- **Endpoint:** `PUT /enemies/:id`
- **Body de la Solicitud:** Seguir el formato de ejemplo
  ```json
  {
    "stats": {
      "damage": 20,
      "maxHealth": 120
    }
  }
  ```

## 6. Obtener Enemigo por ID
- **Endpoint:** `GET /enemies/:id`
- **Respuesta Ejemplo:**
  ```json
  {
    "_id": "67d2fe8db505f7f3b11970b7",
    "id": 1,
    "name": "wolf",
    "type": "enemy",
    "level": "level1",
    "stats": {
      "damage": 15,
      "detectionRange": 3,
      "maxHealth": 100,
      "moveSpeed": 2
    }
  }
  ```

## 7. Buscar Enemigos por Tipo
- **Endpoint:** `GET /enemies/boss`
- **Respuesta Ejemplo:**
  ```json
  [
    {
      "_id": "67d2fe8db505f7f3b11970bb",
      "id": 5,
      "name": "demon",
      "type": "boss",
      "level": "level1",
      "stats": {
        "health": 100,
        "danoColumna": 15,
        "danoFuegoBoca": 75
      }
    }
  ]
  ```