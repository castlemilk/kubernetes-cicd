package models


import (
	"github.com/DATA-DOG/go-sqlmock"
	"testing"
	"regexp"
	"backend/db"

)
func TestCreateProductsUnit(t *testing.T) {
	sdb, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	DB, err := db.CreateDB(sdb)
	if err != nil {
		t.Errorf("error creating databse %s", err)	
	}
	createColumns := []string{"id"}
	productTest := ProductDetails{Name: "TEST", ImageURL: "test.png", Description: "test", Title: "test"}
	mock.ExpectBegin()
	mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO "products"`)).
		WithArgs("TEST","test","test","test.png").
		WillReturnRows(sqlmock.NewRows(createColumns).AddRow("00000000-0000-0000-0000-000000000000"))
	mock.ExpectCommit()
	if _, err := CreateProduct(DB, productTest); err != nil {
		t.Errorf("there was error creating product: %s", err)	
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestGetProductUnit(t *testing.T) {
	sdb, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	DB, err := db.CreateDB(sdb)
	if err != nil {
		t.Errorf("error creating databse %s", err)	
	}
	createColumns := []string{"id"}
	productTest := ProductDetails{Name: "TEST", ImageURL: "test.png", Description: "test", Title: "test"}
	mock.ExpectBegin()
	mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO "products"`)).
		WithArgs("TEST","test","test","test.png").
		WillReturnRows(sqlmock.NewRows(createColumns).AddRow("00000000-0000-0000-0000-000000000000"))
	mock.ExpectCommit()
	getColumns := []string{"id", "name", "title", "description", "image_url"}
	mock.ExpectQuery(regexp.QuoteMeta(`SELECT * FROM "products" WHERE (id = $1)`)).
		WithArgs("00000000-0000-0000-0000-000000000000").
		WillReturnRows(sqlmock.NewRows(getColumns).
			AddRow("00000000-0000-0000-0000-000000000000", "TEST", "test", "test", "test.png"))
			
	productTestID, createErr := CreateProduct(DB, productTest)

	if createErr != nil {
		t.Errorf("error creating product: %s", createErr)
	}

	// CreateProduct(DB, productTest)
	if _, err := GetProduct(DB, productTestID.String()); err != nil {
		t.Errorf("error getting product: %s", err)	
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestListProductsUnit(t *testing.T) {
	sdb, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	DB, err := db.CreateDB(sdb)
	if err != nil {
		t.Errorf("error creating databse %s", err)	
	}
	createColumns := []string{"id"}
	productTest := ProductDetails{Name: "TEST", ImageURL: "test.png", Description: "test", Title: "test"}
	mock.ExpectBegin()
	mock.ExpectQuery(regexp.QuoteMeta(`INSERT INTO "products"`)).
		WithArgs("TEST","test","test","test.png").
		WillReturnRows(sqlmock.NewRows(createColumns).AddRow("00000000-0000-0000-0000-000000000000"))
	mock.ExpectCommit()
	getColumns := []string{"id", "name", "title", "description", "image_url"}
	mock.ExpectQuery(regexp.QuoteMeta(`SELECT * FROM "products"`)).
		WillReturnRows(sqlmock.NewRows(getColumns).
			AddRow("00000000-0000-0000-0000-000000000000", "TEST", "test", "test", "test.png"))
	if _, err := CreateProduct(DB, productTest); err != nil {
		t.Errorf("error getting product: %s", err)
	}
	// CreateProduct(DB, productTest)
	if _, err := ListProducts(DB); err != nil {
		t.Errorf("error getting list of products: %s", err)	
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}