/* eslint-disable import/no-cycle */
import { ImlSchema } from './ml'
import { IDeploymentSchema } from './deployment'
import { IOrganizationSchema } from './organization'
import { IResourceSchema } from './resource'
import { IUserSchema } from './user'

export interface ImlRepositorySchema extends IResourceSchema {
    latest_ml?: ImlSchema
    creator?: IUserSchema
    organization?: IOrganizationSchema
    description: string
    n_mls: number
    n_deployments: number
    latest_mls: ImlSchema[]
}

export interface ImlRepositoryWithLatestDeploymentsSchema extends ImlRepositorySchema {
    latest_deployments: IDeploymentSchema[]
}

export interface ICreatemlRepositorySchema {
    name: string
    description: string
}

export interface IUpdatemlRepositorySchema {
    description?: string
}
