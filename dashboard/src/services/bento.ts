import axios from 'axios'
import {
    ICreatemlSchema,
    ImlSchema,
    IFinishUploadmlSchema,
    ImlWithRepositorySchema,
    IUpdatemlSchema,
    ImlFullSchema,
} from '@/schemas/ml'
import { IListQuerySchema, IListSchema } from '@/schemas/list'
import { IKubePodSchema } from '@/schemas/kube_pod'
import { IModelWithRepositorySchema } from '@/schemas/model'
import { IDeploymentSchema } from '@/schemas/deployment'

export async function listAllmls(query: IListQuerySchema): Promise<IListSchema<ImlWithRepositorySchema>> {
    const resp = await axios.get<IListSchema<ImlWithRepositorySchema>>('/api/v1/mls', {
        params: query,
    })
    return resp.data
}

export async function listmls(
    mlRepositoryName: string,
    query: IListQuerySchema
): Promise<IListSchema<ImlWithRepositorySchema>> {
    const resp = await axios.get<IListSchema<ImlWithRepositorySchema>>(
        `/api/v1/ml_repositories/${mlRepositoryName}/mls`,
        {
            params: query,
        }
    )
    return resp.data
}

export async function fetchml(mlRepositoryName: string, version: string): Promise<ImlFullSchema> {
    const resp = await axios.get<ImlFullSchema>(
        `/api/v1/ml_repositories/${mlRepositoryName}/mls/${version}`
    )
    return resp.data
}

export async function listmlModels(
    mlRepositoryName: string,
    version: string
): Promise<IModelWithRepositorySchema[]> {
    const resp = await axios.get<IModelWithRepositorySchema[]>(
        `/api/v1/ml_repositories/${mlRepositoryName}/mls/${version}/models`
    )
    return resp.data
}

export async function listmlDeployments(
    mlRepositoryName: string,
    version: string,
    query: IListQuerySchema
): Promise<IListSchema<IDeploymentSchema>> {
    const resp = await axios.get<IListSchema<IDeploymentSchema>>(
        `/api/v1/ml_repositories/${mlRepositoryName}/mls/${version}/deployments`,
        {
            params: query,
        }
    )
    return resp.data
}

export async function createml(mlRepositoryName: string, data: ICreatemlSchema): Promise<ImlSchema> {
    const resp = await axios.post<ImlSchema>(`/api/v1/ml_repositories/${mlRepositoryName}/mls`, data)
    return resp.data
}

export async function updateml(
    mlRepositoryName: string,
    version: string,
    data: IUpdatemlSchema
): Promise<ImlFullSchema> {
    const response = await axios.patch<ImlFullSchema>(
        `/api/v1/ml_repositories/${mlRepositoryName}/mls/${version}`,
        data
    )
    return response.data
}

export async function startmlUpload(mlRepositoryName: string, version: string): Promise<ImlSchema> {
    const resp = await axios.post<ImlSchema>(
        `/api/v1/ml_repositories/${mlRepositoryName}/mls/${version}/start_upload`
    )
    return resp.data
}

export async function finishmlUpload(
    mlRepositoryName: string,
    version: string,
    data: IFinishUploadmlSchema
): Promise<ImlSchema> {
    const resp = await axios.post<ImlSchema>(
        `/api/v1/ml_repositories/${mlRepositoryName}/mls/${version}/finish_upload`,
        data
    )
    return resp.data
}

export async function recreatemlImageBuilderJob(
    mlRepositoryName: string,
    version: string
): Promise<ImlSchema> {
    const resp = await axios.patch<ImlSchema>(
        `/api/v1/ml_repositories/${mlRepositoryName}/mls/${version}/recreate_image_builder_job`
    )
    return resp.data
}

export async function listmlImageBuilderPods(
    mlRepositoryName: string,
    version: string
): Promise<IKubePodSchema[]> {
    const resp = await axios.post<IKubePodSchema[]>(
        `/api/v1/ml_repositories/${mlRepositoryName}/mls/${version}/image_builder_pods`
    )
    return resp.data
}
