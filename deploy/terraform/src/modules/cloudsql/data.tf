data "google_sql_database_instance" "instance" {
  name    = "credit-db-instance"
  project = var.project_id
}

output "cloud_sql_ip" {
  value = data.google_sql_database_instance.instance.ip_address[0].ip_address
}
