package models

import (
	"backend/db"
	"github.com/DATA-DOG/go-sqlmock"
	uuid "github.com/satori/go.uuid"
	"regexp"
	"testing"
)

func TestCreateRatingUnit(t *testing.T) {
	sdb, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	DB, err := db.CreateDB(sdb)
	if err != nil {
		t.Errorf("error creating databse %s", err)
	}
	id := uuid.NewV4()
	createColumns := []string{"id"}
	ratingTest := RatingSummary{Value: 1.1, ProductID: id}
	mock.ExpectBegin()
	mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO "ratings"`)).
		WithArgs(1.1, id).
		WillReturnRows(sqlmock.NewRows(createColumns).AddRow("00000000-0000-0000-0000-000000000000"))
	mock.ExpectCommit()
	if _, err := CreateRating(DB, ratingTest); err != nil {
		t.Errorf("there was error creating product: %s", err)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}
