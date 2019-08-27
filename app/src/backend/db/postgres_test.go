package db

import (
	"github.com/DATA-DOG/go-sqlmock"
	"github.com/stretchr/testify/assert"
	"os"
	"testing"
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
	_, err := CreateDB(db)
	if err != nil {
		panic(err)
	}
}
