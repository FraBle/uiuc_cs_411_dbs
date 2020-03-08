# CS411 DBS Project: Team Golden State SQL Natives

### Running the project locally
- Install Docker and docker-compose
- Create a JSON key for the service account `nba-stats-local-dev` in the [GCP console](https://console.cloud.google.com/iam-admin/serviceaccounts?orgonly=true&project=cs-411-data-gssn-kat&supportedpurview=project) and save it as `local-db.json`
- In your terminal run:
  ```
  export DB_PASS=<password>
  docker-compose up
  ```
