# Start from a Debian image with the latest version of Go installed
# and a workspace (GOPATH) configured at /go.
FROM golang as builder
# enable go modules
ENV GO111MODULE=on

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
COPY --from=builder /backend/backend ./
COPY assets ./
ENTRYPOINT ["./backend"]
# Document that the service listens on port 8080.
EXPOSE 8080