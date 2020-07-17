FROM nginx:1.19-alpine

RUN mkdir /config

RUN rm /etc/nginx/conf.d/default.conf
COPY docker/*.conf /etc/nginx/conf.d/

VOLUME /config
VOLUME /var/log/nginx

COPY dist/ /www/
