#!/bin/bash

echo "Deteniendo contenedores existentes..."
docker-compose down

echo "Reconstruyendo imágenes..."
docker-compose build

echo "Iniciando contenedores..."
docker-compose up -d

echo "Mostrando logs del backend..."
docker-compose logs -f backend 