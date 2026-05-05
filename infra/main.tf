terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Futuramente adicionar backend S3/DynamoDB aqui
}

provider "aws" {
  region = "us-east-1"
}

module "frontend" {
  source       = "./modules/frontend"
  project_name = "gerenciador-money"
  environment  = "dev"
}

output "frontend_url" {
  value = module.frontend.cloudfront_domain_name
}

output "frontend_bucket" {
  value = module.frontend.s3_bucket_name
}
