# Start from a Debian image with the latest version of Go installed
# and a workspace (GOPATH) configured at /go.
FROM golang as builder
# enable go modules
ENV GO111MODULE=on

# Create the user and group files that will be used in the running container to
# run the process as an unprivileged user.
RUN mkdir /user && \
    echo 'nobody:x:65534:65534:nobody:/:' > /user/passwd && \
    echo 'nobody:x:65534:' > /user/group

WORKDIR /backend
COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .

# build app
RUN GO111MODULE=on CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build

# base image for running our microservice
FROM alpine:3.10.1
WORKDIR /app

# Import the user and group files from the first stage.
COPY --from=builder /user/group /user/passwd /etc/

# Import the Certificate-Authority certificates for enabling HTTPS.
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

COPY --from=builder /backend/backend ./
COPY assets ./

# Perform any further action as an unprivileged user.
USER nobody:nobody

ENTRYPOINT ["./backend"]
# Document that the service listens on port 8080.
EXPOSE 8080