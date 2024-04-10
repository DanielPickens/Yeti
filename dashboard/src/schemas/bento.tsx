/* eslint-disable import/no-cycle */
import { ImlRepositorySchema } from './ml_repository'
import { ILabelItemSchema } from './label'
import { IModelSchema } from './model'
import { IResourceSchema } from './resource'
import { IUserSchema } from './user'

export type mlUploadStatus = 'pending' | 'uploading' | 'success' | 'failed'

export type ImageBuildStatus = 'pending' | 'building' | 'success' | 'failed'

export interface ImlManifestSchema {
    service: string
    mlml_version: string
    models: string[]
    apis: {
        [key: string]: {
            route: string
            doc: string
            input: string
            output: string
        }
    }
    runners?: {
        name: string
        runnable_type: string
        models: string[]
        resource_config?: {
            cpu?: number
            nvidia_gpu?: number
            custom_resources: { [key: string]: number }
        }
    }[]
    size_bytes: number
}

export interface ImlSchema extends IResourceSchema {
    creator?: IUserSchema
    version: string
    description: string
    image_build_status: ImageBuildStatus
    upload_status: mlUploadStatus
    upload_started_at?: string
    upload_finished_at?: string
    upload_finished_reason: string
    presigned_s3_uri: string
    manifest: ImlManifestSchema
    build_at: string
}

export interface ImlWithRepositorySchema extends ImlSchema {
    repository: ImlRepositorySchema
}

export interface ImlFullSchema extends ImlWithRepositorySchema {
    models: IModelSchema[]
}

export interface ICreatemlSchema {
    description: string
    version: string
    build_at: string
    manifest: ImlManifestSchema
}

export interface IUpdatemlSchema {
    description?: string
    manifest: ImlManifestSchema
    labels: ILabelItemSchema[]
}

export interface IFinishUploadmlSchema {
    status?: mlUploadStatus
    reason?: string
}
