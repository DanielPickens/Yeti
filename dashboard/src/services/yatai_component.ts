import { IyetiComponentSchema } from '@/schemas/yeti_component'
import axios from 'axios'

export async function listyetiComponents(clusterName: string): Promise<IyetiComponentSchema[]> {
    const resp = await axios.get<IyetiComponentSchema[]>(`/api/v1/clusters/${clusterName}/yeti_components`)
    return resp.data
}

export async function listOrganizationyetiComponents(): Promise<IyetiComponentSchema[]> {
    const resp = await axios.get<IyetiComponentSchema[]>('/api/v1/yeti_components')
    return resp.data
}
