# Скелет для express.js приложения

## Структура папок


```
+- /etc - файлы настроек / конфигураций
|
+- /bin - настроенные сервисы
|
+- /lib - классы, сервисы и пр. 
```

## БД

Используется база данных MySQL. Используется конфигурация poolClaster.
Для работы с ней используется пакет https://www.npmjs.com/package/mysql.

### Миграции

```
npm run migrate create some migrate name - создается файл миграций
npm run migrate up - накатываются все новые миграции
npm run migrate up 1 - накатывается одна новая миграция
npm run migrate down - откатывается одна миграция
npm run migrate down 3 - откатываются три миграции
```
