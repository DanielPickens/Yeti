import { IDeploymentSchema } from '@/schemas/deployment'
import axios from 'axios'
import {
    ICreatemlRepositorySchema,
    ImlRepositorySchema,
    IUpdatemlRepositorySchema,
    ImlRepositoryWithLatestDeploymentsSchema,
} from '@/schemas/ml_repository'
import { IListQuerySchema, IListSchema } from '@/schemas/list'

export async function listmlRepositories(
    query: IListQuerySchema
): Promise<IListSchema<ImlRepositoryWithLatestDeploymentsSchema>> {
    const resp = await axios.get<IListSchema<ImlRepositoryWithLatestDeploymentsSchema>>(
        '/api/v1/ml_repositories',
        { params: query }
    )
    return resp.data
}

export async function fetchmlRepository(mlRepositoryName: string): Promise<ImlRepositorySchema> {
    const resp = await axios.get<ImlRepositorySchema>(`/api/v1/ml_repositories/${mlRepositoryName}`)
    return resp.data
}

export async function listmlRepositoryDeployments(
    mlRepositoryName: string,
    query: IListQuerySchema
): Promise<IListSchema<IDeploymentSchema>> {
    const resp = await axios.get<IListSchema<IDeploymentSchema>>(
        `/api/v1/ml_repositories/${mlRepositoryName}/deployments`,
        { params: query }
    )
    return resp.data
}

export async function createmlRepository(data: ICreatemlRepositorySchema): Promise<ImlRepositorySchema> {
    const resp = await axios.post<ImlRepositorySchema>('/api/v1/ml_repositories', data)
    return resp.data
}

export async function updatemlRepository(
    mlRepositoryName: string,
    data: IUpdatemlRepositorySchema
): Promise<ImlRepositorySchema> {
    const resp = await axios.patch<ImlRepositorySchema>(`/api/v1/ml_repositories/${mlRepositoryName}`, data)
    return resp.data
}
