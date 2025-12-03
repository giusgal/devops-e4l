# DOCUMENTATION for the Dockerised version

## Objective
*This documentation aims to provide a comprehensive guide on recreating the project using Docker, allowing for the creation of individual active containers for each component of the project. This guide is a cross-platform solution to run the project.*

## Pre-requisites 

1. Docker version: 19.03.15+ 
2. Docker-compose version: 1.23.2+
3. Familiarity with Unix terminal commands.
4. _Optional_ Apache: _Server version: Apache/2.4.41 (Ubuntu)_

### Before starting there are some HINTS for docker:
Check and remove images:

    sudo docker images
    sudo docker image rm [Image]

Check, Stop, Start and Remove containers: 

    sudo docker container ls -a
    sudo docker start/stop/rm [Container ID]

## Preparation
*The first step is to clone the project (2 repositories with backend and frontend) to do this you can use github desktop and clone with URL)*


> !! Before cloning make sure that the folder does not have previously
> cloned repositories.


**Links:**

frontend: https://gitlab.com/uniluxembourg/fstm/open/e4l/lu.uni.e4l.platform.frontend.dev.git

backend: https://gitlab.com/uniluxembourg/fstm/open/e4l/lu.uni.e4l.platform.api.dev.git
	




## CREATING IMAGES

*The second step is to create an images using docker build. We will have 3 images (one for the frontend, one for the backend and one for the database):*
	
### BACKEND and DATABASE: (go to the backend folder)

> !! Before starting you need to ensure that you substituted environmental variables with actual values in `lu.uni.e4l.platform.api.dev/src/main/resources/application.properties`, for example:
```
spring.datasource.url=jdbc:mysql://localhost:3306/e4l?serverTimezone=Europe/Paris
spring.datasource.username=root
spring.datasource.password=12345678

jwt.secret="it s a secret"
jwt.expiration-time=86400000

signature.key="it s a placeholder"

admin.email=abc@abc.com
admin.password=12345678

resources.static.url=http://localhost:8084/e4lapi/ # this line is important!
```
0.  Craete a **build** folder in the backend using this command:
	    `mkdir build`

1. Prepare jar file to run the Dockerfile in backend:

	1.1 Pull the gradle image with version 8.3:

       sudo docker pull gradle:8.3

	1.2 Create container with the use of gradle image (add tail so it does not stop):

       sudo docker run -d --name e4l-backend-preprod gradle:8.3 tail -f /dev/null

	1.3 Add “app” folder into this container with a source code:

	   sudo docker cp ~/[your-path-to-backend-repo]/lu.uni.e4l.platform.api.dev/. e4l-backend-preprod:/app

	1.4 Go inside the container:

	   sudo docker exec -it e4l-backend-preprod bash

	1.5 Navigate to the app folder and run:

	   cd /app
	   gradle wrapper
	   chmod +x gradlew
	   ./gradlew clean build bootJar

	1.6 Navigate to the *build/libs* folder where you can see a jar file. Now you can `exit` from Docker console and run (make sure you have a `build` folder (with permissions) on your host):
	
	   sudo docker cp e4l-backend-preprod:/app/build/libs ~/[your-path-to-backend-repo]/lu.uni.e4l.platform.api.dev/build/libs
	
	Now you should have `~/[your-path-to-backend-repo]/lu.uni.e4l.platform.api.dev/build/libs/e4l-server.jar` on your host. 

	1.7 Remove existing gradle container (hint: you can determine container ID by using list of all running containers: `docker ps`):
	
	   sudo docker stop [Container ID]
	   sudo docker rm [Container ID]


2. Run docker build:

       sudo docker build -t lu.uni.e4l.platform.backend.dev:rc .

3. For the database pull the mariadb image (mariadb 10.4.7):
	
	   sudo docker pull mariadb:10.4.7
---
### FRONTEND: (go to the frontend folder)

Before preparing the dist folder change `.env` file in `lu.uni.e4l.platform.frontend.dev` repository to this:

	PUBLIC_PATH=PUBLIC_PATH  
	API_URL=http://localhost:8084/e4lapi
	API_AUTHENTICATE=API_AUTHENTICATE  
	CI_REGISTRY_IMAGE=lu.uni.e4l.platform.frontend.dev

This is the configuration for local testing via Docker.

Additionally, prior to executing any commands, it iss crucial to ensure that there is free space in the `/var` directory if you are utilizing a Debian or Linux-based operating system. Ideally, you should have at least 2 GB of available space.

1. Prepare `dist` folder to run the Dockerfile in frontend:

	1.1 Pull the node image with version 15:

	   sudo docker pull node:15

	1.2 Create container with the use of node image (add tail so it does not stop):

	   sudo docker run -d --name e4l-frontend-preprod node:15 tail -f /dev/null

	1.3 Add “app” folder into this container with a source code:

	   sudo docker cp ~/[your-path-to-frontend-repo]/lu.uni.e4l.platform.frontend.dev/. e4l-frontend-preprod:/app

	1.4 Go inside the container:

       sudo docker exec -it e4l-frontend-preprod bash

	1.5 Navigate to the`app` folder and run:
	
	   cd /app
	   npm install --save-dev webpack
       npm run build

	1.6 Navigate to the `/app/e4l.frontend.docker/web` folder where you can see a `dist` folder. Now you can `exit` from Docker console and run (make sure you have a `web` folder (with permissions) on your host):
	
       sudo docker cp e4l-frontend-preprod:/app/e4l.frontend.docker/web/dist ~/[your-path-to-frontend-repo]/lu.uni.e4l.platform.frontend.dev/e4l.frontend.docker/web/

	1.7 Remove existing node container:

	   sudo docker stop [Container ID]
       sudo docker rm [Container ID]
       

2. Pull the nginx image (nginx 1.13.5):

       sudo docker pull nginx:1.13.5

3. To create an image for the frontend you can run docker build:

       sudo docker build -t lu.uni.e4l.platform.frontend.dev:rc ./e4l.frontend.docker/web/.
       

## CREATING CONTAINERS
*The third step is to create a containers using docker-compose . We will have 3 containers (one for the frontend, one for the backend and one for the database):*

> !! Before starting you need:
>  1. Make sure you don't have a network (e4l-db-net) using docker network.
>  2. Change the variables in the files indicated below:
>
>- `lu.uni.e4l.platform.api.dev/docker/docker-compose.backend.pre-prod.yml`,
>- `lu.uni.e4l.platform.api.dev/docker/docker-compose.db.yml`, 
```
PREPROD_SPRING_DATASOURCE_URL=jdbc:mysql://e4l-db/e4lpreprod?createDatabaseIfNotExist=true&serverTimezone=Europe/Paris
MYSQL_USERNAME=root
MYSQL_PASSWORD=12345678
PREPROD_RESOURCES_STATIC_URL=http://localhost:8084/e4lapi/
CI_REGISTRY_IMAGE=lu.uni.e4l.platform.backend.dev
```
>- `lu.uni.e4l.platform.frontend.dev/e4l.frontend.docker/docker-compose.frontend.pre-prod.yml`
```
CI_REGISTRY_IMAGE=lu.uni.e4l.platform.frontend.dev
```


### **Hints** for docker network:

    sudo docker network create [net-name]	
    sudo docker network rm [net-name]        (to delete)
    sudo docker network inspect [net-name]   (to check)
    sudo docker network connect [net-name] [Container ID] (to connect)


### DATABASE

0. Go to the backend folder:

	   cd ~/[your-path-to-backend-repo]/lu.uni.e4l.platform.api.dev

1. To create a database container run (docker-compose will use pulled `mariadb` image):

       sudo docker-compose -f ./docker/docker-compose.db.yml up -d

	 _Hint #1: If you get an error connected with `InnoDB` and `./ibdata1` and your container keeps restarting - check if your local volume is available for read/write operations by Docker; you can change the location of the volume in your host in `docker-compose.db.yml`._
	 _Hint #2: Avoid overlapping with your locally installed instance of MySQL; the credentials to access the "dockerised" version of database can be overwritten by your local credentials._

	 To enter the database:

       sudo docker exec -it e4l-db bash
       mariadb -u root -p -h localhost
	---
### BACKEND

0. Go to the backend folder:

	   cd ~/[your-path-to-backend-repo]/lu.uni.e4l.platform.api.dev

1. To create a backend container run:

       sudo docker-compose -f ./docker/docker-compose.backend.pre-prod.yml up -d

---
### FRONTEND

0. Go to the frontend folder:

	   cd ~/[your-path-to-frontend-repo]/lu.uni.e4l.platform.frontend.dev

1. To create a frontend container run:

       sudo docker-compose -f ./e4l.frontend.docker/docker-compose.frontend.pre-prod.yml up -d 
			 
	_Hint: If you get an `Error response from daemon: error while creating mount source path '/host_mnt/opt/e4l-news': mkdir /host_mnt/opt/e4l-news: permission denied` - check if your local volume is available for read/write operations; you can change the location of the volume in your host in `docker-compose.frontend.pre-prod.yml`_

## CONFIGURE APACHE (optional, if you would like address to the container by port 80)

> !! Before starting make sure the apache is active (`sudo systemctl status apache2`)

1. Enable required Apache2 modules:

	   sudo a2enmod proxy
	   sudo a2enmod proxy_http
	   sudo a2enmod rewrite
	   sudo systemctl restart apache2

2. Create a new Apache2 virtual host configuration file:

	   sudo nano /etc/apache2/sites-available/reverse-proxy.conf

3. Add the following configuration to the reverse-proxy.conf file:

	   <VirtualHost *:80>
	
	   ServerName localhost
	   ServerAdmin webmaster@localhost
	   DocumentRoot /var/www/html
	
	   ErrorLog ${APACHE_LOG_DIR}/error.log
	   CustomLog ${APACHE_LOG_DIR}/access.log combined

	   #*******************************
	   #Proxy directives required by:
	   #E4L
	   #*******************************

	   ProxyRequests Off
	   ProxyPreserveHost On
	   ProxyVia Off

	   <Proxy *>
	   Require all granted
	   </Proxy>

	   #E4L
	   ProxyPass /e4lapi http://localhost:8084/e4lapi
	   ProxyPassReverse /e4lapi http://localhost:8084/e4lapi

	   ProxyPass / http://localhost:8884/
	   ProxyPassReverse / http://localhost:8884/

	   </VirtualHost>

4. Save and close the file (Ctrl+O, Enter, Ctrl+X).
Enable the new virtual host:  
  
	   sudo a2ensite reverse-proxy

5. Check with `sudo a2query -s` and restart apache:

	   sudo systemctl reload apache2  
  

Now, Apache2 will act as a reverse proxy, forwarding requests from http://localhost to your frontend container running on http://localhost:8884. 
