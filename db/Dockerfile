FROM mariadb:latest

COPY ./data/init.sql /docker-entrypoint-initdb.d/init.sql
RUN chmod 777 /docker-entrypoint-initdb.d/init.sql

COPY ./data/data.sql /docker-entrypoint-initdb.d/data.sql
RUN chmod 777 /docker-entrypoint-initdb.d/data.sql

COPY ./data/init.sql init.sql
RUN chmod 777 init.sql

COPY ./data/data.sql data.sql
RUN chmod 777 data.sql