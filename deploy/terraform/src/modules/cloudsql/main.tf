resource "google_sql_database_instance" "postgres" {
  name             = "credit-db-instance"
  project          = var.project_id
  region           = var.region
  database_version = "POSTGRES_14"

  settings {
    tier = "db-f1-micro"

    ip_configuration {
      ipv4_enabled = true # Habilita IP público

      authorized_networks {
        name  = "Geral"
        value = "0.0.0.0/0"
      }
    }
  }
}

resource "google_sql_database" "creditdb" {
  name     = "creditdb"
  instance = google_sql_database_instance.postgres.name
}

resource "google_sql_user" "credituser" {
  name     = var.db_user
  instance = google_sql_database_instance.postgres.name
  password = var.db_password
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
