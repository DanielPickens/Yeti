import { IBaseSchema } from './base'
import { LabelItemsSchema } from './label'

export type ResourceType =
    | 'user'
    | 'user_group'
    | 'organization'
    | 'cluster'
    | 'ml_repository'
    | 'ml'
    | 'deployment'
    | 'deployment_revision'
    | 'yeti_component'
    | 'model_repository'
    | 'model'
    | 'api_token'
    | 'ml_runner'
    | 'ml_api_server'

export interface IResourceSchema extends IBaseSchema {
    name: string
    resource_type: ResourceType
    labels: LabelItemsSchema
}
