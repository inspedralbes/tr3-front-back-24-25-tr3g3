import json
import sys
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime

def generate_image(data_path, output_path):
    with open(data_path) as f:
        data = json.load(f)

    plt.figure(figsize=(12, 6))

    # Verificar si los datos incluyen email, fecha o ambos
    has_email = "email" in data[0]
    has_fecha = "fecha" in data[0]

    if has_email and has_fecha:
        # Caso: Email y Fecha - Sumar enemigos matados en una fecha específica para un usuario
        email = data[0]["email"]
        fecha = data[0]["fecha"]
        total_kills = sum(
            sum(d["estadisticas"].values()) for d in data if d["email"] == email and d["fecha"] == fecha
        )

        plt.bar(["Total Enemigos Matados"], [total_kills], color="blue")
        plt.title(f"Estadísticas de {email} el {fecha}")
        plt.ylabel("Cantidad de Enemigos Matados")
        plt.xlabel("Fecha")

    elif has_email:
        # Caso: Solo Email - Mostrar enemigos totales matados por un usuario
        email = data[0]["email"]
        total_kills = sum(sum(d["estadisticas"].values()) for d in data if d["email"] == email)

        plt.bar(["Total Enemigos Matados"], [total_kills], color="green")
        plt.title(f"Estadísticas Totales de {email}")
        plt.ylabel("Cantidad de Enemigos Matados")
        plt.xlabel("Usuario")

    elif has_fecha:
        # Caso: Solo Fecha - Sumar enemigos matados por todos los usuarios en una fecha específica
        fecha = data[0]["fecha"]
        total_kills = sum(sum(d["estadisticas"].values()) for d in data if d["fecha"] == fecha)

        plt.bar(["Total Enemigos Matados"], [total_kills], color="orange")
        plt.title(f"Estadísticas Totales el {fecha}")
        plt.ylabel("Cantidad de Enemigos Matados")
        plt.xlabel("Fecha")

    else:
        # Caso: Datos no válidos
        raise ValueError("Los datos proporcionados no contienen email ni fecha.")

    # Guardar la imagen generada
    plt.tight_layout()
    plt.savefig(output_path, dpi=300)
    plt.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Uso: python3 generate_image.py <ruta_datos.json> <ruta_salida.png>")
        sys.exit(1)

    data_path = sys.argv[1]
    output_path = sys.argv[2]

    try:
        generate_image(data_path, output_path)
        print(f"Imagen generada exitosamente en {output_path}")
    except Exception as e:
        print(f"Error al generar la imagen: {e}")
