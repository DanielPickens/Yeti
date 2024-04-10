import { IResourceSchema } from './resource'
import { IUserSchema } from './user'

export type TransmissionStrategy = 'presigned_url' | 'proxy'

export interface IAwsS3Schema {
    mls_bucket_name: string
    models_bucket_name: string
    region: string
}

export interface IAwsECRSchema {
    account_id: string
    mls_repository_name: string
    models_repository_name: string
    password: string
    region: string
}

export interface IOrganizationAwsConfigSchema {
    access_key_id: string
    secret_access_key: string
    s3?: IAwsS3Schema
    ecr?: IAwsECRSchema
}

export interface IOrganizationS3Schema {
    endpoint: string
    access_key: string
    secret_key: string
    secure: boolean
    region: string
    mls_bucket_name: string
    models_bucket_name: string
}

export interface IOrganizationDockerRegistrySchema {
    mls_repository_uri: string
    models_repository_uri: string
    server: string
    username: string
    password: string
    secure: boolean
}

export interface IOrganizationConfigSchema {
    major_cluster_uid?: string
    aws?: IOrganizationAwsConfigSchema
    s3?: IOrganizationS3Schema
    transmission_strategy?: TransmissionStrategy
}

export interface IOrganizationSchema extends IResourceSchema {
    creator?: IUserSchema
    description: string
}

export interface IOrganizationFullSchema extends IOrganizationSchema {
    config?: IOrganizationConfigSchema
}

export interface IUpdateOrganizationSchema {
    description?: string
    config?: IOrganizationConfigSchema
}

export interface ICreateOrganizationSchema {
    name: string
    description: string
    config?: IOrganizationConfigSchema
}
