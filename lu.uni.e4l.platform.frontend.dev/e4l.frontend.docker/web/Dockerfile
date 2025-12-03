FROM nginx:1.28

ADD nginx.conf /etc/nginx/conf.d/default.conf
ADD ./dist  /usr/share/nginx/html/

ADD command.sh /command.sh
RUN chmod 755 /command.sh
CMD ["bash", "command.sh"]
