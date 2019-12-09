FROM alpine:3.10.3

RUN apk update && apk add py3-jinja2 bash make ncurses
RUN pip3 install --upgrade pip setuptools
RUN pip3 install 'jinja2-cli[yaml]'

ENTRYPOINT [ "jinja2" ]