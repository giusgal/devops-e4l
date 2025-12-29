export STAGING_SPRING_DATASOURCE_URL="jdbc:mysql://e4l-db-staging/e4lstaging?createDatabaseIfNotExist=true&serverTimezone=Europe/Paris"
export STAGING_MYSQL_USERNAME=root
export STAGING_MYSQL_PASSWORD=12345678
export STAGING_RESOURCES_STATIC_URL="http://localhost:8084/e4lapi/"

export PROD_SPRING_DATASOURCE_URL="jdbc:mysql://e4l-db-prod/e4lprod?createDatabaseIfNotExist=true&serverTimezone=Europe/Paris"
export PROD_MYSQL_USERNAME=root
export PROD_MYSQL_PASSWORD=12345678
export PROD_RESOURCES_STATIC_URL="http://localhost:8085/e4lapi/"

export JWT_SECRET="secret"
export SIGNATURE_KEY="placeholder"
export ADMIN_EMAIL=abc@abc.com
export ADMIN_PASSWORD=12345678