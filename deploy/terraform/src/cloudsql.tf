resource "google_sql_database_instance" "db_instance" {
  name             = "credit-db-instance"
  database_version = "POSTGRES_13"
  region           = var.region

  settings {
    tier = "db-f1-micro" # Ajuste conforme necessidade
    ip_configuration {
      ipv4_enabled = true
    }
  }
}

resource "google_sql_user" "db_user" {
  name     = var.db_user
  instance = google_sql_database_instance.db_instance.name
  password = var.db_password
}

resource "google_sql_database" "credit_db" {
  name     = var.db_name
  instance = google_sql_database_instance.db_instance.name
}
