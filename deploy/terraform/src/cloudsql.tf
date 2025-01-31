resource "google_sql_database_instance" "db_instance" {
  name             = "system-credit-db"
  database_version = "POSTGRES_13"
  region           = var.region

  settings {
    tier = "db-f1-micro"
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

resource "google_service_account" "cloudsql_service_account" {
  account_id   = "cloudsql-service-account"
  display_name = "Service Account for Cloud SQL"
}

resource "google_project_iam_member" "cloudsql_instance_access" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.cloudsql_service_account.email}"
}

