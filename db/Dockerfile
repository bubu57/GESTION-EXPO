FROM ubuntu:latest

# Mise à jour des packages et installation de MySQL et MariaDB
RUN apt-get update && apt-get install -y mariadb-server mysql-server

# Copie du script de configuration pour démarrer MariaDB et MySQL simultanément
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Configuration des autorisations de MariaDB et MySQL pour qu'ils puissent s'exécuter simultanément
RUN sed -i 's/3306/3307/g' /etc/mysql/mariadb.conf.d/50-server.cnf
RUN sed -i 's/\/var\/run\/mysqld/\/var\/run\/mysqld-mariadb/g' /etc/mysql/mariadb.conf.d/50-server.cnf
RUN echo "[mysqld]\nport=3307" >> /etc/mysql/mysql.conf.d/mysqld.cnf
RUN sed -i 's/\/var\/lib\/mysql/\/var\/lib\/mysql-mariadb/g' /etc/mysql/mysql.conf.d/mysqld.cnf

# Exposition des ports pour MariaDB et MySQL
EXPOSE 3306 3307

# Commande de démarrage du conteneur
CMD ["/usr/local/bin/start.sh"]
