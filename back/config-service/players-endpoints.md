# Players API Endpoints

## GET /players
### Description
Retrieve all players

### Authentication
Requires authentication token

### Response
Returns an array of player objects

```json
[
  {
    "id": 1,
    "email": "jugador1@ejemplo.com",
    "gold": 1000,
    "timePlayed": 3600,
    "health": 100,
    "damage": 15,
    "attackSpeed": 1.2
  },
  {
    "id": 2,
    "email": "jugador2@ejemplo.com",
    "gold": 500,
    "timePlayed": 1800,
    "health": 80,
    "damage": 12,
    "attackSpeed": 1.0
  }
]
```

## GET /players/:id
### Description
Retrieve a specific player by ID

### Parameters
- `id`: Player's unique identifier

### Response
Returns a single player object

```json
{
  "id": 1,
  "email": "jugador1@ejemplo.com",
  "gold": 1000,
  "timePlayed": 3600,
  "health": 100,
  "damage": 15,
  "attackSpeed": 1.2
}
```

## GET /players/email/:email
### Description
Retrieve a player by email address

### Parameters
- `email`: Player's email address

### Response
Returns a single player object

```json
{
  "id": 2,
  "email": "jugador2@ejemplo.com",
  "gold": 500,
  "timePlayed": 1800,
  "health": 80,
  "damage": 12,
  "attackSpeed": 1.0
}
```

## POST /players
### Description
Create a new player

### Request Body
```json
{
  "email": "nuevojugador@ejemplo.com",
  "gold": 0,
  "timePlayed": 0,
  "health": 100,
  "damage": 10,
  "attackSpeed": 1.0
}
```

### Response
```json
{
  "message": "Jugador creado exitosamente",
  "player": {
    "id": 3,
    "email": "nuevojugador@ejemplo.com",
    "gold": 0,
    "timePlayed": 0,
    "health": 100,
    "damage": 10,
    "attackSpeed": 1.0
  }
}
```

## PUT /players/:id/stats
### Description
Update all player statistics

### Parameters
- `id`: Player's unique identifier

### Request Body
```json
{
  "gold": 1500,
  "timePlayed": 5400,
  "health": 120,
  "damage": 18,
  "attackSpeed": 1.3
}
```

### Response
```json
{
  "message": "Estadísticas actualizadas correctamente",
  "updatedStats": {
    "gold": 1500,
    "timePlayed": 5400,
    "health": 120,
    "damage": 18,
    "attackSpeed": 1.3
  }
}
```

## PUT /players/:id/stats/:stat
### Description
Update a specific player statistic

### Example Request (Updating Gold)
```json
{
  "gold": 2000
}
```