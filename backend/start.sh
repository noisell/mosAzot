#!/bin/bash

uvicorn src.main:app --host 0.0.0.0 --port 8001 --forwarded-allow-ips='*' --proxy-headers --workers 4
echo "Приложение успешно запущенно!"