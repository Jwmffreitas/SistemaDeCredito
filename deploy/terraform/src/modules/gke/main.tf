resource "google_container_cluster" "credit_cluster" {
  name                     = var.cluster_name
  location                 = var.region
  remove_default_node_pool = true
  deletion_protection      = false
  networking_mode          = "VPC_NATIVE"
  ip_allocation_policy {}
}

resource "google_container_node_pool" "credit_nodes" {
  name       = "credit-node-pool"
  cluster    = google_container_cluster.credit_cluster.name
  location   = var.region
  node_count = 2

  node_config {
    machine_type = "e2-medium" # 2 vCPUs e 4GB RAM por nó
    disk_size_gb = 50
    oauth_scopes = ["https://www.googleapis.com/auth/cloud-platform"]
    metadata     = { disable-legacy-endpoints = "true" }
  }

  autoscaling {
    min_node_count = 1
    max_node_count = 2 # Mantém o limite de 4 vCPUs e 16GB RAM
  }
}

resource "google_service_account" "gke_sa" {
  account_id   = var.gke_service_account
  display_name = "GKE Service Account"
}

resource "google_project_iam_member" "gke_cloudsql_access" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.gke_sa.email}"
}
