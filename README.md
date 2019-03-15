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
npm run migrate <command> <server> [options]

npm run migrate create <server> <long migration name>
npm run migrate create MASTER some migrate name - создается файл миграций


npm run migrate <server> up [count]
npm run migrate MASTER up - накатываются все новые миграции
npm run migrate MASTER up 1 - накатывается одна новая миграция


npm run migrate <server> down [count]
npm run migrate MASTER down - откатывается одна миграция
npm run migrate MASTER down 3 - откатываются три миграции
```
