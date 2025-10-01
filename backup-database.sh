#!/bin/bash

echo "💾 Script de Respaldo de Base de Datos CBM"
echo "=========================================="

# Configuración
DB_NAME="cbm_production"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="cbm_backup_$DATE"

# Crear directorio de respaldos si no existe
mkdir -p $BACKUP_DIR

echo "📦 Creando respaldo de la base de datos..."
echo "Base de datos: $DB_NAME"
echo "Archivo: $BACKUP_FILE"

# Crear respaldo usando mongodump
mongodump --db $DB_NAME --out $BACKUP_DIR/$BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✅ Respaldo creado exitosamente"
    echo "📁 Ubicación: $BACKUP_DIR/$BACKUP_FILE"
    
    # Comprimir el respaldo
    echo "🗜️  Comprimiendo respaldo..."
    tar -czf $BACKUP_DIR/$BACKUP_FILE.tar.gz -C $BACKUP_DIR $BACKUP_FILE
    
    if [ $? -eq 0 ]; then
        echo "✅ Respaldo comprimido: $BACKUP_FILE.tar.gz"
        
        # Remover directorio sin comprimir
        rm -rf $BACKUP_DIR/$BACKUP_FILE
        echo "🗑️  Directorio temporal removido"
        
        # Mostrar tamaño del archivo
        echo "📊 Tamaño del respaldo:"
        ls -lh $BACKUP_DIR/$BACKUP_FILE.tar.gz
    else
        echo "❌ Error al comprimir el respaldo"
        exit 1
    fi
else
    echo "❌ Error al crear el respaldo"
    exit 1
fi

echo ""
echo "📋 Instrucciones:"
echo "================="
echo "• El respaldo está en: $BACKUP_DIR/$BACKUP_FILE.tar.gz"
echo "• Para restaurar: tar -xzf $BACKUP_FILE.tar.gz && mongorestore $BACKUP_FILE"
echo "• Este archivo NO se subirá a Git (está en .gitignore)"
echo "• Guárdalo en un lugar seguro fuera del repositorio"
