import json
import sys
import matplotlib.pyplot as plt
from datetime import datetime

def generate_image(data_path, output_path):
    with open(data_path) as f:
        data = json.load(f)

    # Preparar los tipos de enemigos y sus colores
    enemigos = ["ghost_killed", "grunt_killed", "horse_killed", "ogre_killed", "wolf_killed", "boss_killed"]
    colores = {
        "ghost_killed": "#1f77b4",  # Azul
        "grunt_killed": "#ff7f0e",  # Naranja
        "horse_killed": "#2ca02c",  # Verde
        "ogre_killed": "#d62728",   # Rojo
        "wolf_killed": "#9467bd",   # Púrpura
        "boss_killed": "#8c564b"    # Marrón
    }
    
    # Verificar si los datos incluyen email y/o fecha
    has_email = any("email" in registro for registro in data)
    has_fecha = any("fecha" in registro for registro in data)

    # Inicializar el diccionario para sumar enemigos
    suma_enemigos = {enemigo: 0 for enemigo in enemigos}

    if has_email and has_fecha:
        # Caso: Email y Fecha
        # Si hay múltiples emails/fechas, tomamos el email y fecha del primer registro como filtro
        email_filtro = data[0]["email"] if "email" in data[0] else None
        fecha_filtro = data[0]["fecha"] if "fecha" in data[0] else None
        
        # Sumar estadísticas para todos los registros que coincidan con el filtro
        for registro in data:
            if (registro.get("email") == email_filtro and 
                registro.get("fecha") == fecha_filtro and 
                "estadisticas" in registro):
                for enemigo in enemigos:
                    if enemigo in registro["estadisticas"]:
                        suma_enemigos[enemigo] += registro["estadisticas"][enemigo]
        
        # Formatear la fecha para el título si está disponible
        fecha_formateada = fecha_filtro
        if fecha_filtro:
            try:
                fecha_obj = datetime.fromisoformat(fecha_filtro.replace('Z', '+00:00'))
                fecha_formateada = fecha_obj.strftime("%d/%m/%Y")
            except:
                pass  # Si hay error, mantener el formato original
        
        plt.title(f"Estadísticas de {email_filtro} el {fecha_formateada}")

    elif has_email:
        # Caso: Solo Email
        email_filtro = data[0]["email"] if "email" in data[0] else None
        
        # Sumar estadísticas para todos los registros con el mismo email
        for registro in data:
            if registro.get("email") == email_filtro and "estadisticas" in registro:
                for enemigo in enemigos:
                    if enemigo in registro["estadisticas"]:
                        suma_enemigos[enemigo] += registro["estadisticas"][enemigo]
        
        plt.title(f"Estadísticas Totales de {email_filtro}")

    elif has_fecha:
        # Caso: Solo Fecha
        fecha_filtro = data[0]["fecha"] if "fecha" in data[0] else None
        
        # Sumar estadísticas para todos los registros con la misma fecha
        for registro in data:
            if registro.get("fecha") == fecha_filtro and "estadisticas" in registro:
                for enemigo in enemigos:
                    if enemigo in registro["estadisticas"]:
                        suma_enemigos[enemigo] += registro["estadisticas"][enemigo]
        
        # Formatear la fecha para el título
        fecha_formateada = fecha_filtro
        if fecha_filtro:
            try:
                fecha_obj = datetime.fromisoformat(fecha_filtro.replace('Z', '+00:00'))
                fecha_formateada = fecha_obj.strftime("%d/%m/%Y")
            except:
                pass  # Si hay error, mantener el formato original
        
        plt.title(f"Estadísticas Totales el {fecha_formateada}")

    else:
        # Caso: Sin filtros específicos, sumar todas las estadísticas
        for registro in data:
            if "estadisticas" in registro:
                for enemigo in enemigos:
                    if enemigo in registro["estadisticas"]:
                        suma_enemigos[enemigo] += registro["estadisticas"][enemigo]
        
        plt.title("Estadísticas Totales")

    # Generar el gráfico
    plt.bar(suma_enemigos.keys(), suma_enemigos.values(), color=[colores[enemigo] for enemigo in enemigos])
    plt.xlabel("Tipo de Enemigo")
    plt.ylabel("Cantidad Total Matada")
    plt.xticks(rotation=45)
    
    # Agregar etiquetas con los valores sobre cada barra
    for i, v in enumerate(suma_enemigos.values()):
        plt.text(i, v + 0.5, str(v), ha='center')

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