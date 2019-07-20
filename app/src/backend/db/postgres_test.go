package db

import (
	"testing"
	"github.com/stretchr/testify/assert"
	"github.com/DATA-DOG/go-sqlmock"
	"os"
)

func TestDatabaseInit(t *testing.T) {
	Init()
	assert.NotNil(t, GetDB())
}

func TestDatabaseUnitInitFail(t *testing.T) {
	os.Setenv("PG_HOST", "LOL")
	assert.Panics(t, func() { Init() })
}

func TestDatabaseCreate(t *testing.T) {
	db, _, _ := sqlmock.New()
	CreateDB(db)
}