resource "google_service_account" "gke_sa" {
  account_id   = var.gke_service_account
  display_name = "GKE Service Account"
}

resource "google_project_iam_member" "gke_cloudsql_access" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.gke_sa.email}"
}
