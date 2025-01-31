output "db_instance_name" {
  value = google_sql_database_instance.db_instance.name
}

output "db_public_ip" {
  value = google_sql_database_instance.db_instance.public_ip_address
}
