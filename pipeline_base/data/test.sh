# Variables setup
PROJECT_ID="2"
TOKEN="glpat-6WToj6ERPLmMvr73lrblEW86MQp1OjIH.01.0w0vhq5rb"
GITLAB_URL="http://192.168.56.9/gitlab"

# Corrected API URL
URL="$GITLAB_URL/api/v4/projects/$PROJECT_ID/variables"

add_var() {
  local KEY=$1
  local VALUE=$2
  local MASKED=$3
  
  echo -e "Adding $KEY...\n"
  curl --request POST --header "PRIVATE-TOKEN: $TOKEN" \
    "$URL" \
    --form "key=$KEY" \
    --form "value=$VALUE" \
    --form "masked=$MASKED"
}

# Add your variables here
add_var "STAGING_SPRING_DATASOURCE_URL" "jdbc:mysql://e4l-db-staging/e4lstaging?createDatabaseIfNotExist=true&serverTimezone=Europe/Paris" "false"
add_var "STAGING_MYSQL_USERNAME" "root" "false"
add_var "STAGING_MYSQL_PASSWORD" "12345678" "true"
add_var "STAGING_RESOURCES_STATIC_URL" "http://localhost:8084/e4lapi/" "false"

add_var "PROD_SPRING_DATASOURCE_URL" "jdbc:mysql://e4l-db-prod/e4lprod?createDatabaseIfNotExist=true&serverTimezone=Europe/Paris" "false"
add_var "PROD_MYSQL_USERNAME" "root" "false"
add_var "PROD_MYSQL_PASSWORD" "12345678" "true"
add_var "PROD_RESOURCES_STATIC_URL" "http://localhost:8085/e4lapi/" "false"

add_var "JWT_SECRET" "it_s_a_secret" "true"
add_var "SIGNATURE_KEY" "placeholder" "true"
add_var "ADMIN_EMAIL" "abc@abc.com" "true"
add_var "ADMIN_PASSWORD" "12345678" "true"
